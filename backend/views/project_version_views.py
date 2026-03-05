import datetime
from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core import database as db

router = APIRouter()


@router.get('/{project_id}/versions')
def list_versions(project_id: int, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    if not project['is_public'] and role is None:
        raise HTTPException(status_code=403, detail='Forbidden')
    versions = db.get_project_versions(project_id)
    versions.sort(key=lambda v: v['created_at'])
    return versions


@router.post('/{project_id}/versions')
def create_version(project_id: int, body: dict, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    role = db.get_user_role(project_id, user['discord_id'])
    if role != 'owner':
        raise HTTPException(status_code=403, detail='Only the owner can create versions')
    version_id = db.next_id('project_version')
    version = {
        'id': version_id,
        'project_id': project_id,
        'name': body.get('name', ''),
        'status': body.get('status', 'upcoming'),
        'released_at': body.get('released_at'),
        'created_at': datetime.datetime.utcnow().isoformat() + 'Z',
    }
    # If setting as current, unset any existing current version
    if version['status'] == 'current':
        for v in db.project_versions.values():
            if v['project_id'] == project_id and v['status'] == 'current':
                v['status'] = 'released'
    db.project_versions[version_id] = version
    return version


@router.put('/{project_id}/versions/{version_id}')
def update_version(project_id: int, version_id: int, body: dict, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    role = db.get_user_role(project_id, user['discord_id'])
    if role != 'owner':
        raise HTTPException(status_code=403, detail='Only the owner can edit versions')
    version = db.project_versions.get(version_id)
    if not version or version['project_id'] != project_id:
        raise HTTPException(status_code=404, detail='Version not found')
    if 'name' in body:
        version['name'] = body['name']
    if 'status' in body:
        new_status = body['status']
        # If setting as current, unset any existing current version
        if new_status == 'current' and version['status'] != 'current':
            for v in db.project_versions.values():
                if v['project_id'] == project_id and v['status'] == 'current':
                    v['status'] = 'released'
        version['status'] = new_status
    if 'released_at' in body:
        version['released_at'] = body['released_at']
    return version


@router.delete('/{project_id}/versions/{version_id}')
def delete_version(project_id: int, version_id: int, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    role = db.get_user_role(project_id, user['discord_id'])
    if role != 'owner':
        raise HTTPException(status_code=403, detail='Only the owner can delete versions')
    version = db.project_versions.get(version_id)
    if not version or version['project_id'] != project_id:
        raise HTTPException(status_code=404, detail='Version not found')
    if version['status'] == 'current':
        raise HTTPException(status_code=400, detail='Cannot delete the current version')
    del db.project_versions[version_id]
    return {'ok': True}
