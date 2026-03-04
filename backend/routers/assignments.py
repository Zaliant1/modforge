from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core import database as db

router = APIRouter()


@router.post('/issues/{issue_id}/assignments')
def create_assignment(issue_id: int, body: dict, user: dict = Depends(get_current_user)):
    issue = db.issues.get(issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail='Issue not found')
    role = db.get_user_role(issue['project_id'], user['discord_id'])
    if role not in ('owner', 'maintainer'):
        raise HTTPException(status_code=403, detail='Forbidden')
    assignment_id = db.next_id('assignment')
    assignment = {
        'id': assignment_id,
        'issue_id': issue_id,
        'assignee_id': body.get('assignee_id'),
        'task': body.get('task', ''),
        'done': False,
    }
    db.assignments[assignment_id] = assignment
    return assignment


@router.put('/issues/{issue_id}/assignments/{assignment_id}')
def update_assignment(issue_id: int, assignment_id: int, body: dict, user: dict = Depends(get_current_user)):
    assignment = db.assignments.get(assignment_id)
    if not assignment or assignment['issue_id'] != issue_id:
        raise HTTPException(status_code=404, detail='Assignment not found')
    discord_id = user['discord_id']
    issue = db.issues.get(issue_id)
    role = db.get_user_role(issue['project_id'], discord_id) if issue else None
    is_assignee = assignment['assignee_id'] == discord_id
    if not is_assignee and role not in ('owner', 'maintainer'):
        raise HTTPException(status_code=403, detail='Forbidden')
    if 'done' in body:
        assignment['done'] = body['done']
    if role in ('owner', 'maintainer') and 'task' in body:
        assignment['task'] = body['task']
    return assignment


@router.delete('/issues/{issue_id}/assignments/{assignment_id}')
def delete_assignment(issue_id: int, assignment_id: int, user: dict = Depends(get_current_user)):
    assignment = db.assignments.get(assignment_id)
    if not assignment or assignment['issue_id'] != issue_id:
        raise HTTPException(status_code=404, detail='Assignment not found')
    issue = db.issues.get(issue_id)
    role = db.get_user_role(issue['project_id'], user['discord_id']) if issue else None
    if role not in ('owner', 'maintainer'):
        raise HTTPException(status_code=403, detail='Forbidden')
    del db.assignments[assignment_id]
    return {'ok': True}
