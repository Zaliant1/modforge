from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core.database import get_user_role
from models import Project, ActivityLog

router = APIRouter()


@router.get('/{project_id}/activity')
def list_activity(project_id: int, user: dict = Depends(get_current_user)):
    session = user["_db"]
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = get_user_role(session, project_id, discord_id)
    if not project.is_public and role is None:
        raise HTTPException(status_code=403, detail='Forbidden')
    entries = (
        session.query(ActivityLog)
        .filter_by(project_id=project_id)
        .order_by(ActivityLog.created_at.desc())
        .all()
    )
    result = []
    for entry in entries:
        actor = entry.user
        result.append({
            'id': entry.id,
            'project_id': entry.project_id,
            'user_id': entry.user_id,
            'action': entry.action,
            'detail': entry.detail,
            'created_at': entry.created_at,
            'user': {
                'discord_id': actor.discord_id if actor else '',
                'username': actor.username if actor else 'Unknown',
                'avatar_url': actor.avatar_url if actor else '',
            },
        })
    return result
