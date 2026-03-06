from fastapi import APIRouter, Depends, HTTPException

from core.database import get_user_role
from core.dependencies import get_current_user
from models import Project, ProjectUser
from schemas.project import ProjectUserAdd, ProjectUserUpdate

router = APIRouter()


@router.post('/{project_id}/users')
def add_project_user(project_id: int, body: ProjectUserAdd, user: dict = Depends(get_current_user)):
    session = user["_db"]
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    role = get_user_role(session, project_id, user['discord_id'])
    if role not in ('owner', 'maintainer'):
        raise HTTPException(status_code=403, detail='Forbidden')
    pu = ProjectUser(project_id=project_id, user_id=body.user_id, role=body.role.value)
    session.add(pu)
    session.commit()
    return {'project_id': pu.project_id, 'user_id': pu.user_id, 'role': pu.role}


@router.put('/{project_id}/users/{user_id}')
def update_project_user(project_id: int, user_id: str, body: ProjectUserUpdate, user: dict = Depends(get_current_user)):
    session = user["_db"]
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    role = get_user_role(session, project_id, user['discord_id'])
    if role != 'owner':
        raise HTTPException(status_code=403, detail='Forbidden')
    pu = session.query(ProjectUser).filter_by(project_id=project_id, user_id=user_id).first()
    if not pu:
        raise HTTPException(status_code=404, detail='User not in project')
    pu.role = body.role.value
    session.commit()
    return {'project_id': pu.project_id, 'user_id': pu.user_id, 'role': pu.role}


@router.delete('/{project_id}/users/{user_id}')
def remove_project_user(project_id: int, user_id: str, user: dict = Depends(get_current_user)):
    session = user["_db"]
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    role = get_user_role(session, project_id, user['discord_id'])
    if role != 'owner':
        raise HTTPException(status_code=403, detail='Forbidden')
    deleted = session.query(ProjectUser).filter_by(project_id=project_id, user_id=user_id).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail='User not in project')
    session.commit()
    return {'ok': True}
