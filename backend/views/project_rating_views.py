from fastapi import APIRouter, Depends, HTTPException

from core.dependencies import get_current_user
from models import Project, ProjectRating
from schemas.project import RatingCreate

router = APIRouter()


@router.post('/{project_id}/ratings')
def create_or_update_rating(project_id: int, body: RatingCreate, user: dict = Depends(get_current_user)):
    session = user["_db"]
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    if not project.game or not project.is_public:
        raise HTTPException(status_code=403, detail='Only public game projects can be rated')
    discord_id = user['discord_id']
    existing = session.query(ProjectRating).filter_by(project_id=project_id, user_id=discord_id).first()
    if existing:
        existing.stars = body.stars
        session.commit()
        session.refresh(existing)
        return existing
    rating = ProjectRating(
        project_id=project_id,
        user_id=discord_id,
        stars=body.stars,
    )
    session.add(rating)
    session.commit()
    session.refresh(rating)
    return rating


@router.delete('/{project_id}/ratings')
def delete_rating(project_id: int, user: dict = Depends(get_current_user)):
    session = user["_db"]
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    rating = session.query(ProjectRating).filter_by(project_id=project_id, user_id=discord_id).first()
    if not rating:
        raise HTTPException(status_code=404, detail='No rating found')
    session.delete(rating)
    session.commit()
    return {'ok': True}
