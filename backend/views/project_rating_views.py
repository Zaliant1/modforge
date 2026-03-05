import datetime
from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core import database as db

router = APIRouter()


@router.post('/{project_id}/ratings')
def create_or_update_rating(project_id: int, body: dict, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    stars = body.get('stars')
    if not isinstance(stars, int) or stars < 1 or stars > 5:
        raise HTTPException(status_code=400, detail='stars must be an integer between 1 and 5')
    # Check for existing rating by this user on this project
    for rating in db.project_ratings.values():
        if rating['project_id'] == project_id and rating['user_id'] == discord_id:
            rating['stars'] = stars
            return rating
    # Create new rating
    rating_id = db.next_id('project_rating')
    rating = {
        'id': rating_id,
        'project_id': project_id,
        'user_id': discord_id,
        'stars': stars,
        'created_at': datetime.datetime.utcnow().isoformat() + 'Z',
    }
    db.project_ratings[rating_id] = rating
    return rating


@router.delete('/{project_id}/ratings')
def delete_rating(project_id: int, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    for rating_id, rating in list(db.project_ratings.items()):
        if rating['project_id'] == project_id and rating['user_id'] == discord_id:
            del db.project_ratings[rating_id]
            return {'ok': True}
    raise HTTPException(status_code=404, detail='No rating found')
