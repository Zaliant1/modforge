from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core import database as db

router = APIRouter()


@router.post('/issues/{issue_id}/upvote')
def toggle_upvote(issue_id: int, user: dict = Depends(get_current_user)):
    issue = db.issues.get(issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail='Issue not found')
    discord_id = user['discord_id']
    key = (issue_id, discord_id)
    if key in db.upvotes:
        db.upvotes.discard(key)
        issue['upvotes'] = max(0, issue['upvotes'] - 1)
        upvoted = False
    else:
        db.upvotes.add(key)
        issue['upvotes'] += 1
        upvoted = True
    return {'upvotes': issue['upvotes'], 'upvoted': upvoted}
