from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from models import Issue, IssueUpvote

router = APIRouter()


@router.post('/issues/{issue_id}/upvote')
def toggle_upvote(issue_id: int, user: dict = Depends(get_current_user)):
    session = user["_db"]
    issue = session.get(Issue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail='Issue not found')
    discord_id = user['discord_id']
    existing = session.get(IssueUpvote, (issue_id, discord_id))
    if existing:
        session.delete(existing)
        issue.upvotes = max(0, issue.upvotes - 1)
        upvoted = False
    else:
        session.add(IssueUpvote(issue_id=issue_id, user_id=discord_id))
        issue.upvotes += 1
        upvoted = True
    session.commit()
    return {'upvotes': issue.upvotes, 'upvoted': upvoted}
