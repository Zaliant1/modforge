from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core import database as db
from schemas.project import ProjectCreate, ProjectUpdate, ProjectSummary, ProjectDetail
import datetime

router = APIRouter()


def _project_summary(project: dict, discord_id: str) -> dict:
    role = db.get_user_role(project['id'], discord_id)
    members = db.get_project_members(project['id'])
    current_version = db.get_current_version(project['id'])
    views = sum(1 for e in db.view_events if e['project_id'] == project['id'])
    return {
        **project,
        'version': current_version['name'] if current_version else None,
        'is_member': role is not None,
        'user_role': role,
        'member_count': len(members),
        'views': views,
    }


def _category_stats(project_id: int, categories: list) -> dict:
    stats = {cat: {'total': 0, 'reported': 0, 'in_progress': 0, 'completed': 0, 'wont_fix': 0} for cat in categories}
    for issue in db.issues.values():
        if issue['project_id'] != project_id:
            continue
        cat = issue.get('category', '')
        if cat not in stats:
            continue
        stats[cat]['total'] += 1
        status = issue.get('status', '')
        if status in stats[cat]:
            stats[cat][status] += 1
    return stats


def _project_detail(project: dict, discord_id: str) -> dict:
    role = db.get_user_role(project['id'], discord_id)
    members = db.get_project_members(project['id'])
    current_version = db.get_current_version(project['id'])
    return {
        **project,
        'version': current_version['name'] if current_version else None,
        'is_member': role is not None,
        'user_role': role,
        'members': members,
        'category_stats': _category_stats(project['id'], project.get('categories', [])),
    }


@router.get('', response_model=list[ProjectSummary])
def list_projects(user: dict = Depends(get_current_user)):
    discord_id = user['discord_id']
    result = []
    for project in db.projects.values():
        role = db.get_user_role(project['id'], discord_id)
        is_member = role is not None
        if is_member or project['is_public']:
            result.append(_project_summary(project, discord_id))
    return result


@router.post('')
def create_project(body: ProjectCreate, user: dict = Depends(get_current_user)):
    discord_id = user['discord_id']
    project_id = db.next_id('project')
    is_public = body.is_public
    if not body.game:
        is_public = False
    project = {
        'id': project_id,
        'name': body.name,
        'game': body.game,
        'about': body.about,
        'picture': body.picture,
        'categories': body.categories,
        'is_public': is_public,
        'owner_id': discord_id,
        'created_at': datetime.datetime.utcnow().isoformat() + 'Z',
    }
    db.projects[project_id] = project
    db.project_users.append({'project_id': project_id, 'user_id': discord_id, 'role': 'owner'})
    # Create initial version
    version_id = db.next_id('project_version')
    version = {
        'id': version_id,
        'project_id': project_id,
        'name': body.version,
        'status': 'current',
        'released_at': None,
        'created_at': datetime.datetime.utcnow().isoformat() + 'Z',
    }
    db.project_versions[version_id] = version
    return _project_detail(project, discord_id)


@router.get('/{project_id}', response_model=ProjectDetail)
def get_project(project_id: int, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    if not project['is_public'] and role is None:
        raise HTTPException(status_code=403, detail='Forbidden')
    return _project_detail(project, discord_id)


@router.put('/{project_id}')
def update_project(project_id: int, body: ProjectUpdate, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    if role not in ('owner', 'maintainer'):
        raise HTTPException(status_code=403, detail='Forbidden')

    updates = body.model_dump(exclude_unset=True)
    for key, value in updates.items():
        project[key] = value
    # Non-game projects cannot be public
    if not project.get('game'):
        project['is_public'] = False
    return _project_detail(project, discord_id)


@router.delete('/{project_id}')
def delete_project(project_id: int, user: dict = Depends(get_current_user)):
    project = db.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = db.get_user_role(project_id, discord_id)
    if role != 'owner':
        raise HTTPException(status_code=403, detail='Forbidden')
    del db.projects[project_id]
    db.project_users[:] = [pu for pu in db.project_users if pu['project_id'] != project_id]
    return {'ok': True}