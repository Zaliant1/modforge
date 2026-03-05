import datetime
from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core import database as db
from schemas.change_request import ChangeRequestCreate, ChangeRequestResolve, ChangeRequestOut

router = APIRouter()


@router.get('/{project_id}/requests', response_model=list[ChangeRequestOut])
def list_requests(project_id: int, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    role = db.get_user_role(project_id, user['discord_id'])
    if role not in ('owner', 'maintainer'):
        raise HTTPException(status_code=403, detail='Forbidden')
    return [r for r in db.change_requests.values() if r['project_id'] == project_id]


@router.post('/{project_id}/requests', response_model=ChangeRequestOut)
def submit_request(project_id: int, body: ChangeRequestCreate, user: dict = Depends(get_current_user)):
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
        'changes': body.changes,
        'note': body.note,
        'created_at': datetime.datetime.utcnow().isoformat() + 'Z',
        'reviewed_at': None,
        'reviewer_id': None,
    }
    db.change_requests[req_id] = req
    return req


@router.put('/{project_id}/requests/{req_id}', response_model=ChangeRequestOut)
def resolve_request(project_id: int, req_id: int, body: ChangeRequestResolve, user: dict = Depends(get_current_user)):
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
    if body.status not in ('approved', 'rejected'):
        raise HTTPException(status_code=400, detail='status must be approved or rejected')
    req['status'] = body.status.value
    req['reviewer_id'] = discord_id
    req['reviewed_at'] = datetime.datetime.utcnow().isoformat() + 'Z'
    if body.status == 'approved':
        for key, value in req['changes'].items():
            if key in project:
                project[key] = value
    return req