from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core.database import get_user_role
from models import Comment, Issue
from schemas.comment import CommentCreate, CommentUpdate, CommentOut

router = APIRouter()


def _enrich_comment(comment: Comment) -> dict:
    return {
        'id': comment.id,
        'issue_id': comment.issue_id,
        'author_id': comment.author_id,
        'body': comment.body,
        'created_at': comment.created_at,
        'author': {
            'discord_id': comment.author.discord_id,
            'username': comment.author.username,
            'avatar_url': comment.author.avatar_url,
        },
    }


@router.get('/issues/{issue_id}/comments', response_model=list[CommentOut])
def list_comments(issue_id: int, user: dict = Depends(get_current_user)):
    session = user["_db"]
    if not session.get(Issue, issue_id):
        raise HTTPException(status_code=404, detail='Issue not found')
    comments = (
        session.query(Comment)
        .filter_by(issue_id=issue_id)
        .order_by(Comment.created_at)
        .all()
    )
    return [_enrich_comment(c) for c in comments]


@router.post('/issues/{issue_id}/comments', response_model=CommentOut)
def create_comment(issue_id: int, body: CommentCreate, user: dict = Depends(get_current_user)):
    session = user["_db"]
    if not session.get(Issue, issue_id):
        raise HTTPException(status_code=404, detail='Issue not found')
    comment = Comment(
        issue_id=issue_id,
        author_id=user['discord_id'],
        body=body.body,
    )
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return _enrich_comment(comment)


@router.put('/issues/{issue_id}/comments/{comment_id}', response_model=CommentOut)
def update_comment(issue_id: int, comment_id: int, body: CommentUpdate, user: dict = Depends(get_current_user)):
    session = user["_db"]
    comment = session.get(Comment, comment_id)
    if not comment or comment.issue_id != issue_id:
        raise HTTPException(status_code=404, detail='Comment not found')
    if comment.author_id != user['discord_id']:
        raise HTTPException(status_code=403, detail='Forbidden')
    comment.body = body.body
    session.commit()
    session.refresh(comment)
    return _enrich_comment(comment)


@router.delete('/issues/{issue_id}/comments/{comment_id}')
def delete_comment(issue_id: int, comment_id: int, user: dict = Depends(get_current_user)):
    session = user["_db"]
    comment = session.get(Comment, comment_id)
    if not comment or comment.issue_id != issue_id:
        raise HTTPException(status_code=404, detail='Comment not found')
    discord_id = user['discord_id']
    issue = session.get(Issue, issue_id)
    project_id = issue.project_id if issue else None
    role = get_user_role(session, project_id, discord_id) if project_id else None
    if comment.author_id != discord_id and role not in ('owner', 'maintainer'):
        raise HTTPException(status_code=403, detail='Forbidden')
    session.delete(comment)
    session.commit()
    return {'ok': True}
