from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core.database import get_user_role, get_project_stats
from models import Project
from schemas.project import ProjectStatsOut

router = APIRouter()


@router.get('/{project_id}/stats', response_model=ProjectStatsOut)
def project_stats(project_id: int, user: dict = Depends(get_current_user)):
    session = user["_db"]
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = get_user_role(session, project_id, discord_id)
    if not project.is_public and role is None:
        raise HTTPException(status_code=403, detail='Forbidden')
    return get_project_stats(session, project_id)
