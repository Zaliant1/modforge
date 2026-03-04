from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from core.dependencies import get_current_user
from core import database as db
import datetime

router = APIRouter()


@router.get('/projects/{project_id}/issues')
def list_issues(
    project_id: int,
    category: Optional[str] = None,
    user: dict = Depends(get_current_user),
):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    if not project['is_public'] and role is None:
        raise HTTPException(status_code=403, detail='Forbidden')

    result = [
        i for i in db.issues.values()
        if i['project_id'] == project_id and (category is None or i['category'] == category)
    ]
    return [db.enrich_issue(i, discord_id) for i in result]


@router.post('/projects/{project_id}/issues')
def create_issue(project_id: int, body: dict, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    if not project['is_public'] and role is None:
        raise HTTPException(status_code=403, detail='Forbidden')

    is_visitor = role is None
    issue_id = db.next_id('issue')
    issue = {
        'id': issue_id,
        'project_id': project_id,
        'summary': body.get('summary', ''),
        'author_id': discord_id,
        'version': project['version'] if is_visitor else body.get('version', project['version']),
        'category': body.get('category', project['categories'][0] if project['categories'] else ''),
        'type': body.get('type', 'bug'),
        'priority': 'medium' if is_visitor else body.get('priority', 'medium'),
        'status': body.get('status', 'reported'),
        'operating_systems': body.get('operating_systems', []),
        'description': body.get('description', ''),
        'modlog': body.get('modlog'),
        'archived': False,
        'upvotes': 0,
        'is_visitor_issue': is_visitor,
    }
    db.issues[issue_id] = issue
    return db.enrich_issue(issue, discord_id)


@router.get('/projects/{project_id}/issues/{issue_id}')
def get_issue(project_id: int, issue_id: int, user: dict = Depends(get_current_user)):
    issue = db.issues.get(issue_id)
    if not issue or issue['project_id'] != project_id:
        raise HTTPException(status_code=404, detail='Issue not found')
    project = db.projects.get(project_id)
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    if not project['is_public'] and role is None:
        raise HTTPException(status_code=403, detail='Forbidden')
    return db.enrich_issue(issue, discord_id)


@router.put('/projects/{project_id}/issues/{issue_id}')
def update_issue(project_id: int, issue_id: int, body: dict, user: dict = Depends(get_current_user)):
    issue = db.issues.get(issue_id)
    if not issue or issue['project_id'] != project_id:
        raise HTTPException(status_code=404, detail='Issue not found')
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    is_own_visitor = issue['is_visitor_issue'] and issue['author_id'] == discord_id

    if role is None and not is_own_visitor:
        raise HTTPException(status_code=403, detail='Forbidden')

    allowed = {'summary', 'type', 'priority', 'status', 'category', 'version',
               'operating_systems', 'description', 'modlog', 'archived'}
    if role is None:
        allowed = {'summary', 'type', 'category', 'operating_systems', 'description'}

    for key in allowed:
        if key in body:
            issue[key] = body[key]
    return db.enrich_issue(issue, discord_id)


@router.delete('/projects/{project_id}/issues/{issue_id}')
def delete_issue(project_id: int, issue_id: int, user: dict = Depends(get_current_user)):
    issue = db.issues.get(issue_id)
    if not issue or issue['project_id'] != project_id:
        raise HTTPException(status_code=404, detail='Issue not found')
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    is_own_visitor = issue['is_visitor_issue'] and issue['author_id'] == discord_id
    if role not in ('owner', 'maintainer') and not is_own_visitor:
        raise HTTPException(status_code=403, detail='Forbidden')
    del db.issues[issue_id]
    return {'ok': True}
