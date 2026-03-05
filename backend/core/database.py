import json
from pathlib import Path
from datetime import datetime, timedelta, timezone

DUMMY_DIR = Path(__file__).parent.parent.parent / 'dummydata'


def _load(filename):
    with open(DUMMY_DIR / filename) as f:
        return json.load(f)


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
project_ratings = {r['id']: r for r in _load('project_ratings.json')}
activity_log = {e['id']: e for e in _load('activity_log.json')}

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
    return {
        **issue,
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
