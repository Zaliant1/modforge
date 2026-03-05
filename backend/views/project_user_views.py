from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core import database as db

router = APIRouter()


@router.post('/{project_id}/users')
def add_project_user(project_id: int, body: dict, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    role = db.get_user_role(project_id, user['discord_id'])
    if role not in ('owner', 'maintainer'):
        raise HTTPException(status_code=403, detail='Forbidden')
    entry = {'project_id': project_id, 'user_id': body['user_id'], 'role': body.get('role', 'contributor')}
    db.project_users.append(entry)
    return entry


@router.put('/{project_id}/users/{user_id}')
def update_project_user(project_id: int, user_id: str, body: dict, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    role = db.get_user_role(project_id, user['discord_id'])
    if role != 'owner':
        raise HTTPException(status_code=403, detail='Forbidden')
    for pu in db.project_users:
        if pu['project_id'] == project_id and pu['user_id'] == user_id:
            pu['role'] = body.get('role', pu['role'])
            return pu
    raise HTTPException(status_code=404, detail='User not in project')


@router.delete('/{project_id}/users/{user_id}')
def remove_project_user(project_id: int, user_id: str, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    role = db.get_user_role(project_id, user['discord_id'])
    if role != 'owner':
        raise HTTPException(status_code=403, detail='Forbidden')
    before = len(db.project_users)
    db.project_users[:] = [
        pu for pu in db.project_users
        if not (pu['project_id'] == project_id and pu['user_id'] == user_id)
    ]
    if len(db.project_users) == before:
        raise HTTPException(status_code=404, detail='User not in project')
    return {'ok': True}
