from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from core.dependencies import get_current_user
from core.database import get_user_role, get_project_members, get_current_version
from models import Project, ProjectVersion, ProjectUser, Issue, ViewEvent
from schemas.project import ProjectCreate, ProjectUpdate, ProjectSummary, ProjectDetail

router = APIRouter()


def _project_summary(session, project: Project, discord_id: str) -> dict:
    role = get_user_role(session, project.id, discord_id)
    members = get_project_members(session, project.id)
    current_version = get_current_version(session, project.id)
    views = session.query(func.count(ViewEvent.id)).filter_by(project_id=project.id).scalar()
    return {
        'id': project.id,
        'name': project.name,
        'game': project.game,
        'about': project.about,
        'picture': project.picture,
        'categories': project.categories or [],
        'is_public': project.is_public,
        'owner_id': project.owner_id,
        'created_at': project.created_at,
        'version': current_version.name if current_version else None,
        'is_member': role is not None,
        'user_role': role,
        'member_count': len(members),
        'views': views,
    }


def _category_stats(session, project_id: int, categories: list) -> dict:
    stats = {cat: {'total': 0, 'reported': 0, 'in_progress': 0, 'completed': 0, 'wont_fix': 0} for cat in categories}
    issues = session.query(Issue).filter_by(project_id=project_id).all()
    for issue in issues:
        cat = issue.category or ''
        if cat not in stats:
            continue
        stats[cat]['total'] += 1
        status = issue.status or ''
        if status in stats[cat]:
            stats[cat][status] += 1
    return stats


def _project_detail(session, project: Project, discord_id: str) -> dict:
    role = get_user_role(session, project.id, discord_id)
    members = get_project_members(session, project.id)
    current_version = get_current_version(session, project.id)
    return {
        'id': project.id,
        'name': project.name,
        'game': project.game,
        'about': project.about,
        'picture': project.picture,
        'categories': project.categories or [],
        'is_public': project.is_public,
        'owner_id': project.owner_id,
        'created_at': project.created_at,
        'version': current_version.name if current_version else None,
        'is_member': role is not None,
        'user_role': role,
        'members': members,
        'category_stats': _category_stats(session, project.id, project.categories or []),
    }


@router.get('', response_model=list[ProjectSummary])
def list_projects(user: dict = Depends(get_current_user)):
    session = user['_db']
    discord_id = user['discord_id']
    result = []
    for project in session.query(Project).all():
        role = get_user_role(session, project.id, discord_id)
        is_member = role is not None
        if is_member or project.is_public:
            result.append(_project_summary(session, project, discord_id))
    return result


@router.post('')
def create_project(body: ProjectCreate, user: dict = Depends(get_current_user)):
    session = user['_db']
    discord_id = user['discord_id']

    is_public = body.is_public
    if not body.game:
        is_public = False

    project = Project(
        name=body.name,
        game=body.game,
        about=body.about,
        picture=body.picture,
        categories=body.categories,
        is_public=is_public,
        owner_id=discord_id,
    )
    session.add(project)
    session.commit()

    # Create owner membership
    session.add(ProjectUser(project_id=project.id, user_id=discord_id, role='owner'))

    # Create initial version
    session.add(ProjectVersion(
        project_id=project.id,
        name=body.version,
        status='current',
    ))
    session.commit()

    return _project_detail(session, project, discord_id)


@router.get('/{project_id}', response_model=ProjectDetail)
def get_project(project_id: int, user: dict = Depends(get_current_user)):
    session = user['_db']
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = get_user_role(session, project_id, discord_id)
    if not project.is_public and role is None:
        raise HTTPException(status_code=403, detail='Forbidden')
    return _project_detail(session, project, discord_id)


@router.put('/{project_id}')
def update_project(project_id: int, body: ProjectUpdate, user: dict = Depends(get_current_user)):
    session = user['_db']
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = get_user_role(session, project_id, discord_id)
    if role not in ('owner', 'maintainer'):
        raise HTTPException(status_code=403, detail='Forbidden')

    updates = body.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(project, key, value)
    # Non-game projects cannot be public
    if not project.game:
        project.is_public = False
    session.commit()
    return _project_detail(session, project, discord_id)


@router.delete('/{project_id}')
def delete_project(project_id: int, user: dict = Depends(get_current_user)):
    session = user['_db']
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = get_user_role(session, project_id, discord_id)
    if role != 'owner':
        raise HTTPException(status_code=403, detail='Forbidden')
    session.query(ProjectUser).filter_by(project_id=project_id).delete()
    session.delete(project)
    session.commit()
    return {'ok': True}
