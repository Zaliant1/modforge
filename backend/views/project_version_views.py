from fastapi import APIRouter, Depends, HTTPException

from core.database import get_user_role, get_project_versions
from core.dependencies import get_current_user
from models import Project, ProjectVersion
from schemas.project import VersionCreate, VersionUpdate, VersionOut

router = APIRouter()


@router.get('/{project_id}/versions', response_model=list[VersionOut])
def list_versions(project_id: int, user: dict = Depends(get_current_user)):
    session = user["_db"]
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = get_user_role(session, project_id, discord_id)
    if not project.is_public and role is None:
        raise HTTPException(status_code=403, detail='Forbidden')
    return session.query(ProjectVersion).filter_by(project_id=project_id).order_by(ProjectVersion.created_at).all()


@router.post('/{project_id}/versions', response_model=VersionOut)
def create_version(project_id: int, body: VersionCreate, user: dict = Depends(get_current_user)):
    session = user["_db"]
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    role = get_user_role(session, project_id, user['discord_id'])
    if role != 'owner':
        raise HTTPException(status_code=403, detail='Only the owner can create versions')
    new_status = body.status.value
    if new_status == 'current':
        current_versions = session.query(ProjectVersion).filter_by(project_id=project_id, status='current').all()
        for v in current_versions:
            v.status = 'released'
    version = ProjectVersion(
        project_id=project_id,
        name=body.name,
        description=body.description,
        status=new_status,
    )
    session.add(version)
    session.commit()
    session.refresh(version)
    return version


@router.put('/{project_id}/versions/{version_id}', response_model=VersionOut)
def update_version(project_id: int, version_id: int, body: VersionUpdate, user: dict = Depends(get_current_user)):
    session = user["_db"]
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    role = get_user_role(session, project_id, user['discord_id'])
    if role != 'owner':
        raise HTTPException(status_code=403, detail='Only the owner can edit versions')
    version = session.get(ProjectVersion, version_id)
    if not version or version.project_id != project_id:
        raise HTTPException(status_code=404, detail='Version not found')

    updates = body.model_dump(exclude_unset=True)
    if 'name' in updates:
        version.name = updates['name']
    if 'description' in updates:
        version.description = updates['description']
    if 'status' in updates:
        new_status = updates['status'].value
        if new_status == 'current' and version.status != 'current':
            current_versions = session.query(ProjectVersion).filter_by(project_id=project_id, status='current').all()
            for v in current_versions:
                v.status = 'released'
        version.status = new_status
    session.commit()
    session.refresh(version)
    return version


@router.delete('/{project_id}/versions/{version_id}')
def delete_version(project_id: int, version_id: int, user: dict = Depends(get_current_user)):
    session = user["_db"]
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    role = get_user_role(session, project_id, user['discord_id'])
    if role != 'owner':
        raise HTTPException(status_code=403, detail='Only the owner can delete versions')
    version = session.get(ProjectVersion, version_id)
    if not version or version.project_id != project_id:
        raise HTTPException(status_code=404, detail='Version not found')
    if version.status == 'current':
        raise HTTPException(status_code=400, detail='Cannot delete the current version')
    session.delete(version)
    session.commit()
    return {'ok': True}
