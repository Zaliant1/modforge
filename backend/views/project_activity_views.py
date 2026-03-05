from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core import database as db

router = APIRouter()


@router.get('/{project_id}/activity')
def list_activity(project_id: int, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    if not project['is_public'] and role is None:
        raise HTTPException(status_code=403, detail='Forbidden')
    entries = [e for e in db.activity_log.values() if e['project_id'] == project_id]
    entries.sort(key=lambda e: e['created_at'], reverse=True)
    # Enrich with user info
    result = []
    for entry in entries:
        actor = db.users.get(entry['user_id'], {})
        result.append({
            **entry,
            'user': {
                'discord_id': actor.get('discord_id', ''),
                'username': actor.get('username', 'Unknown'),
                'avatar_url': actor.get('avatar_url', ''),
            },
        })
    return result
