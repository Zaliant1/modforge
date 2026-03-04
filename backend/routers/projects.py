from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core import database as db

router = APIRouter()


def _project_summary(project: dict, discord_id: str) -> dict:
    role = db.get_user_role(project['id'], discord_id)
    members = db.get_project_members(project['id'])
    return {
        **project,
        'is_member': role is not None,
        'user_role': role,
        'member_count': len(members),
    }


def _project_detail(project: dict, discord_id: str) -> dict:
    role = db.get_user_role(project['id'], discord_id)
    members = db.get_project_members(project['id'])
    return {
        **project,
        'is_member': role is not None,
        'user_role': role,
        'members': members,
    }


@router.get('')
def list_projects(user: dict = Depends(get_current_user)):
    discord_id = user['discord_id']
    result = []
    for project in db.projects.values():
        role = db.get_user_role(project['id'], discord_id)
        is_member = role is not None
        if is_member or project['is_public']:
            result.append(_project_summary(project, discord_id))
    return result


@router.post('')
def create_project(body: dict, user: dict = Depends(get_current_user)):
    discord_id = user['discord_id']
    project_id = db.next_id('project')
    project = {
        'id': project_id,
        'name': body.get('name', 'Untitled'),
        'about': body.get('about', ''),
        'version': body.get('version', '1.0.0'),
        'picture': body.get('picture', ''),
        'categories': body.get('categories', []),
        'is_public': body.get('is_public', False),
        'owner_id': discord_id,
    }
    db.projects[project_id] = project
    db.project_users.append({'project_id': project_id, 'user_id': discord_id, 'role': 'owner'})
    return project


@router.get('/{project_id}')
def get_project(project_id: int, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    if not project['is_public'] and role is None:
        raise HTTPException(status_code=403, detail='Forbidden')
    return _project_detail(project, discord_id)


@router.put('/{project_id}')
def update_project(project_id: int, body: dict, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    if role not in ('owner', 'maintainer'):
        raise HTTPException(status_code=403, detail='Forbidden')
    allowed = {'name', 'about', 'version', 'picture', 'categories', 'is_public'}
    for key in allowed:
        if key in body:
            project[key] = body[key]
    return _project_detail(project, discord_id)


@router.delete('/{project_id}')
def delete_project(project_id: int, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    if role != 'owner':
        raise HTTPException(status_code=403, detail='Forbidden')
    del db.projects[project_id]
    db.project_users[:] = [pu for pu in db.project_users if pu['project_id'] != project_id]
    return {'ok': True}


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
