import datetime
from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core import database as db

router = APIRouter()


@router.get('/projects/{project_id}/requests')
def list_requests(project_id: int, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    role = db.get_user_role(project_id, user['discord_id'])
    if role not in ('owner', 'maintainer'):
        raise HTTPException(status_code=403, detail='Forbidden')
    return [r for r in db.change_requests.values() if r['project_id'] == project_id]


@router.post('/projects/{project_id}/requests')
def submit_request(project_id: int, body: dict, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    if role not in ('owner', 'maintainer'):
        raise HTTPException(status_code=403, detail='Forbidden')
    req_id = db.next_id('change_request')
    req = {
        'id': req_id,
        'project_id': project_id,
        'requester_id': discord_id,
        'status': 'pending',
        'changes': body.get('changes', {}),
        'note': body.get('note', ''),
        'created_at': datetime.datetime.utcnow().isoformat() + 'Z',
        'reviewed_at': None,
        'reviewer_id': None,
    }
    db.change_requests[req_id] = req
    return req


@router.put('/projects/{project_id}/requests/{req_id}')
def resolve_request(project_id: int, req_id: int, body: dict, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    if role != 'owner':
        raise HTTPException(status_code=403, detail='Forbidden')
    req = db.change_requests.get(req_id)
    if not req or req['project_id'] != project_id:
        raise HTTPException(status_code=404, detail='Request not found')
    action = body.get('status')
    if action not in ('approved', 'rejected'):
        raise HTTPException(status_code=400, detail='status must be approved or rejected')
    req['status'] = action
    req['reviewer_id'] = discord_id
    req['reviewed_at'] = datetime.datetime.utcnow().isoformat() + 'Z'
    if action == 'approved':
        for key, value in req['changes'].items():
            if key in project:
                project[key] = value
    return req
