import json
import sys
from pathlib import Path
from datetime import datetime, timedelta, timezone

DUMMY_DIR = Path(__file__).parent.parent.parent / 'dummydata'

VALID_ISSUE_TYPES = {'bug', 'suggestion'}
VALID_ISSUE_PRIORITIES = {'low', 'medium', 'high'}
VALID_ISSUE_STATUSES = {'reported', 'in_progress', 'completed', 'wont_fix'}
VALID_OS = {'windows', 'macos', 'linux', 'handheld'}
VALID_ROLES = {'owner', 'maintainer', 'contributor'}
VALID_VERSION_STATUSES = {'released', 'current', 'upcoming'}


def _load(filename):
    with open(DUMMY_DIR / filename) as f:
        return json.load(f)


def _validate_data(
    issues_list, projects_dict, project_users_list, project_versions_dict,
    assignments_dict, ratings_list, users_dict,
):
    errors = []
    proj_cats = {p['id']: set(p.get('categories', [])) for p in projects_dict.values()}

    for i in issues_list.values():
        iid = i['id']
        if i.get('type') not in VALID_ISSUE_TYPES:
            errors.append(f"Issue {iid}: invalid type '{i.get('type')}'")
        if i.get('priority') not in VALID_ISSUE_PRIORITIES:
            errors.append(f"Issue {iid}: invalid priority '{i.get('priority')}'")
        if i.get('status') not in VALID_ISSUE_STATUSES:
            errors.append(f"Issue {iid}: invalid status '{i.get('status')}'")
        for os_val in i.get('operating_systems', []):
            if os_val not in VALID_OS:
                errors.append(f"Issue {iid}: invalid OS '{os_val}'")
        if i.get('archived') and i.get('status') not in ('completed', 'wont_fix'):
            errors.append(f"Issue {iid}: archived but status='{i.get('status')}'")
        if i.get('is_visitor_issue') and i.get('priority') != 'medium':
            errors.append(f"Issue {iid}: visitor issue with priority='{i.get('priority')}' (must be medium)")
        pid = i.get('project_id')
        cat = i.get('category', '')
        if pid in proj_cats and cat not in proj_cats[pid]:
            errors.append(f"Issue {iid}: category '{cat}' not in project {pid}")
        if len(i.get('summary', '')) > 200:
            errors.append(f"Issue {iid}: summary exceeds 200 chars")
        vid = i.get('version_id')
        if vid is not None and vid not in project_versions_dict:
            errors.append(f"Issue {iid}: version_id {vid} not found")

    for p in projects_dict.values():
        pid = p['id']
        if not p.get('categories'):
            errors.append(f"Project {pid}: must have at least one category")
        if len(p.get('about', '')) > 500:
            errors.append(f"Project {pid}: about exceeds 500 chars")
        if not p.get('game') and p.get('is_public'):
            errors.append(f"Project {pid}: non-game project cannot be public")

    for pu in project_users_list:
        if pu.get('role') not in VALID_ROLES:
            errors.append(f"ProjectUser project={pu.get('project_id')} user={pu.get('user_id')}: invalid role '{pu.get('role')}'")

    for v in project_versions_dict.values():
        if v.get('status') not in VALID_VERSION_STATUSES:
            errors.append(f"Version {v['id']}: invalid status '{v.get('status')}'")


    for r in ratings_list.values():
        if not (1 <= r.get('stars', 0) <= 5):
            errors.append(f"Rating {r['id']}: stars={r.get('stars')} out of range 1-5")
        rpid = r.get('project_id')
        rp = projects_dict.get(rpid)
        if rp:
            if not rp.get('game'):
                errors.append(f"Rating {r['id']}: non-game project {rpid} cannot have ratings")
            if not rp.get('is_public'):
                errors.append(f"Rating {r['id']}: private project {rpid} cannot have ratings")

    if errors:
        print(f"\n{'='*60}", file=sys.stderr)
        print(f"DATA VALIDATION FAILED — {len(errors)} error(s):", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        print(f"{'='*60}\n", file=sys.stderr)
        raise SystemExit(1)


# In-memory stores
users = {u['discord_id']: u for u in _load('users.json')}
projects = {p['id']: p for p in _load('projects.json')}
project_users = _load('project_users.json')
issues = {i['id']: i for i in _load('issues.json')}
assignments = {a['id']: a for a in _load('assignments.json')}
comments = {c['id']: c for c in _load('comments.json')}
change_requests = {r['id']: r for r in _load('change_requests.json')}
project_versions = {v['id']: v for v in _load('project_versions.json')}
download_events = _load('download_events.json')
view_events = _load('view_events.json')
project_ratings = {r['id']: r for r in _load('project_ratings.json')}
activity_log = {e['id']: e for e in _load('activity_log.json')}

_validate_data(issues, projects, project_users, project_versions, assignments, project_ratings, users)

# (issue_id, discord_id)
upvotes: set[tuple[int, str]] = set()

_next_ids = {
    'project': max(projects.keys(), default=0) + 1,
    'issue': max(issues.keys(), default=0) + 1,
    'assignment': max(assignments.keys(), default=0) + 1,
    'comment': max(comments.keys(), default=0) + 1,
    'change_request': max(change_requests.keys(), default=0) + 1,
    'project_version': max(project_versions.keys(), default=0) + 1,
    'download_event': max((e['id'] for e in download_events), default=0) + 1,
    'view_event': max((e['id'] for e in view_events), default=0) + 1,
    'project_rating': max(project_ratings.keys(), default=0) + 1,
    'activity_log': max(activity_log.keys(), default=0) + 1,
}


def next_id(kind: str) -> int:
    val = _next_ids[kind]
    _next_ids[kind] += 1
    return val


def get_user_role(project_id: int, discord_id: str) -> str | None:
    for pu in project_users:
        if pu['project_id'] == project_id and pu['user_id'] == discord_id:
            return pu['role']
    return None


def get_project_members(project_id: int) -> list[dict]:
    result = []
    for pu in project_users:
        if pu['project_id'] == project_id:
            user = users.get(pu['user_id'])
            if user:
                result.append({**user, 'role': pu['role']})
    return result


def get_project_versions(project_id: int) -> list[dict]:
    return [v for v in project_versions.values() if v['project_id'] == project_id]


def get_current_version(project_id: int) -> dict | None:
    for v in project_versions.values():
        if v['project_id'] == project_id and v['status'] == 'current':
            return v
    return None


def issue_progress(issue_id: int) -> float:
    issue_assignments = [a for a in assignments.values() if a['issue_id'] == issue_id]
    if not issue_assignments:
        return 0.0
    done = sum(1 for a in issue_assignments if a['done'])
    return done / len(issue_assignments)


def enrich_issue(issue: dict, discord_id: str) -> dict:
    author = users.get(issue['author_id'], {})
    version = project_versions.get(issue.get('version_id'))
    return {
        **issue,
        'version': version['name'] if version else '',
        'author': {
            'discord_id': author.get('discord_id', ''),
            'username': author.get('username', 'Unknown'),
            'avatar_url': author.get('avatar_url', ''),
        },
        'progress': issue_progress(issue['id']),
        'upvoted': (issue['id'], discord_id) in upvotes,
    }


def get_project_stats(project_id: int) -> dict:
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=7)

    # View counts from view_events
    views = sum(1 for e in view_events if e['project_id'] == project_id)

    # Download counts from download_events
    proj_downloads = [e for e in download_events if e['project_id'] == project_id]
    downloads = len(proj_downloads)
    downloads_week = sum(
        1 for e in proj_downloads
        if datetime.fromisoformat(e['created_at'].replace('Z', '+00:00')) >= week_start
    )
    downloads_today = sum(
        1 for e in proj_downloads
        if datetime.fromisoformat(e['created_at'].replace('Z', '+00:00')) >= today_start
    )

    # Issue counts
    proj_issues = [i for i in issues.values() if i['project_id'] == project_id]
    open_issues = sum(1 for i in proj_issues if i['status'] in ('reported', 'in_progress'))
    open_issues_today = sum(
        1 for i in proj_issues
        if i['status'] in ('reported', 'in_progress')
        and datetime.fromisoformat(i['created_at'].replace('Z', '+00:00')) >= today_start
    )
    bugs_closed = sum(1 for i in proj_issues if i['status'] in ('completed', 'wont_fix'))
    total = len(proj_issues)
    close_rate = (bugs_closed / total) if total > 0 else 0.0

    # Ratings
    proj_ratings = [r for r in project_ratings.values() if r['project_id'] == project_id]
    rating_count = len(proj_ratings)
    avg_rating = (sum(r['stars'] for r in proj_ratings) / rating_count) if rating_count > 0 else 0.0

    return {
        'views': views,
        'downloads': downloads,
        'downloads_week': downloads_week,
        'downloads_today': downloads_today,
        'open_issues': open_issues,
        'open_issues_today': open_issues_today,
        'bugs_closed': bugs_closed,
        'close_rate': round(close_rate, 2),
        'avg_rating': round(avg_rating, 2),
        'rating_count': rating_count,
    }
