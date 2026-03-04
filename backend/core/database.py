import json
from pathlib import Path

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

# (issue_id, discord_id)
upvotes: set[tuple[int, str]] = set()

_next_ids = {
    'project': max(projects.keys(), default=0) + 1,
    'issue': max(issues.keys(), default=0) + 1,
    'assignment': max(assignments.keys(), default=0) + 1,
    'comment': max(comments.keys(), default=0) + 1,
    'change_request': max(change_requests.keys(), default=0) + 1,
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
