from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from core.database import get_user_role
from core.dependencies import get_current_user
from models import ChangeRequest, Project
from schemas.change_request import ChangeRequestCreate, ChangeRequestResolve, ChangeRequestOut

router = APIRouter()


@router.get('/{project_id}/requests', response_model=list[ChangeRequestOut])
def list_requests(project_id: int, user: dict = Depends(get_current_user)):
    session = user["_db"]
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    role = get_user_role(session, project_id, user['discord_id'])
    if role not in ('owner', 'maintainer'):
        raise HTTPException(status_code=403, detail='Forbidden')
    return session.query(ChangeRequest).filter_by(project_id=project_id).all()


@router.post('/{project_id}/requests', response_model=ChangeRequestOut)
def submit_request(project_id: int, body: ChangeRequestCreate, user: dict = Depends(get_current_user)):
    session = user["_db"]
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = get_user_role(session, project_id, discord_id)
    if role not in ('owner', 'maintainer'):
        raise HTTPException(status_code=403, detail='Forbidden')
    req = ChangeRequest(
        project_id=project_id,
        requester_id=discord_id,
        status='pending',
        changes=body.changes,
        note=body.note,
    )
    session.add(req)
    session.commit()
    session.refresh(req)
    return req


@router.put('/{project_id}/requests/{req_id}', response_model=ChangeRequestOut)
def resolve_request(project_id: int, req_id: int, body: ChangeRequestResolve, user: dict = Depends(get_current_user)):
    session = user["_db"]
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = get_user_role(session, project_id, discord_id)
    if role != 'owner':
        raise HTTPException(status_code=403, detail='Forbidden')
    req = session.get(ChangeRequest, req_id)
    if not req or req.project_id != project_id:
        raise HTTPException(status_code=404, detail='Request not found')
    if body.status not in ('approved', 'rejected'):
        raise HTTPException(status_code=400, detail='status must be approved or rejected')
    req.status = body.status.value
    req.reviewer_id = discord_id
    req.reviewed_at = datetime.now(timezone.utc)
    if body.status == 'approved':
        for key, value in req.changes.items():
            if hasattr(project, key):
                setattr(project, key, value)
    session.commit()
    session.refresh(req)
    return req
