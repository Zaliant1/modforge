import datetime
from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core import database as db

router = APIRouter()


def _enrich_comment(comment: dict) -> dict:
    author = db.users.get(comment['author_id'], {})
    return {
        **comment,
        'author': {
            'discord_id': author.get('discord_id', ''),
            'username': author.get('username', 'Unknown'),
            'avatar_url': author.get('avatar_url', ''),
        },
    }


@router.get('/issues/{issue_id}/comments')
def list_comments(issue_id: int, user: dict = Depends(get_current_user)):
    if issue_id not in db.issues:
        raise HTTPException(status_code=404, detail='Issue not found')
    result = [c for c in db.comments.values() if c['issue_id'] == issue_id]
    result.sort(key=lambda c: c['created_at'])
    return [_enrich_comment(c) for c in result]


@router.post('/issues/{issue_id}/comments')
def create_comment(issue_id: int, body: dict, user: dict = Depends(get_current_user)):
    if issue_id not in db.issues:
        raise HTTPException(status_code=404, detail='Issue not found')
    comment_id = db.next_id('comment')
    comment = {
        'id': comment_id,
        'issue_id': issue_id,
        'author_id': user['discord_id'],
        'body': body.get('body', ''),
        'created_at': datetime.datetime.utcnow().isoformat() + 'Z',
    }
    db.comments[comment_id] = comment
    return _enrich_comment(comment)


@router.put('/issues/{issue_id}/comments/{comment_id}')
def update_comment(issue_id: int, comment_id: int, body: dict, user: dict = Depends(get_current_user)):
    comment = db.comments.get(comment_id)
    if not comment or comment['issue_id'] != issue_id:
        raise HTTPException(status_code=404, detail='Comment not found')
    if comment['author_id'] != user['discord_id']:
        raise HTTPException(status_code=403, detail='Forbidden')
    comment['body'] = body.get('body', comment['body'])
    return _enrich_comment(comment)


@router.delete('/issues/{issue_id}/comments/{comment_id}')
def delete_comment(issue_id: int, comment_id: int, user: dict = Depends(get_current_user)):
    comment = db.comments.get(comment_id)
    if not comment or comment['issue_id'] != issue_id:
        raise HTTPException(status_code=404, detail='Comment not found')
    discord_id = user['discord_id']
    issue = db.issues.get(issue_id)
    project_id = issue['project_id'] if issue else None
    role = db.get_user_role(project_id, discord_id) if project_id else None
    if comment['author_id'] != discord_id and role not in ('owner', 'maintainer'):
        raise HTTPException(status_code=403, detail='Forbidden')
    del db.comments[comment_id]
    return {'ok': True}
