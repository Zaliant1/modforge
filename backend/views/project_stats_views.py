from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core import database as db

router = APIRouter()


@router.get('/{project_id}/stats')
def get_project_stats(project_id: int, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    if not project['is_public'] and role is None:
        raise HTTPException(status_code=403, detail='Forbidden')
    return db.get_project_stats(project_id)
