import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_current_user
from core.database import get_user_role, get_current_version, enrich_issue
from models import Project, Issue
from schemas.issue import IssueCreate, IssueUpdate
from sqlalchemy.orm import Session

router = APIRouter()


@router.get('/projects/{project_id}/issues', response_model=list)
def list_issues(
    project_id: int,
    category: Optional[str] = None,
    status: Optional[str] = None,
    version_id: Optional[int] = None,
    archived: Optional[bool] = None,
    user: dict = Depends(get_current_user),
):
    session: Session = user['_db']
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = get_user_role(session, project_id, discord_id)
    if not project.is_public and role is None:
        raise HTTPException(status_code=403, detail='Forbidden')

    query = session.query(Issue).filter_by(project_id=project_id)
    if category is not None:
        query = query.filter_by(category=category)
    if status is not None:
        query = query.filter_by(status=status)
    if version_id is not None:
        query = query.filter_by(version_id=version_id)
    if archived is not None:
        query = query.filter_by(archived=archived)

    issues = query.all()
    return [enrich_issue(session, i, discord_id) for i in issues]


@router.post('/projects/{project_id}/issues')
def create_issue(project_id: int, body: IssueCreate, user: dict = Depends(get_current_user)):
    session: Session = user['_db']
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail='Project not found')
    discord_id = user['discord_id']
    role = get_user_role(session, project_id, discord_id)
    if not project.is_public and role is None:
        raise HTTPException(status_code=403, detail='Forbidden')

    is_visitor = role is None
    current_version = get_current_version(session, project_id)
    current_version_id = current_version.id if current_version else None

    issue = Issue(
        project_id=project_id,
        summary=body.summary,
        author_id=discord_id,
        version_id=current_version_id if is_visitor else (body.version_id or current_version_id),
        category=body.category or (project.categories[0] if project.categories else ''),
        type=body.type.value,
        priority='medium' if is_visitor else body.priority.value,
        status=body.status.value,
        operating_systems=[os.value for os in body.operating_systems],
        description=body.description,
        modlog=body.modlog,
        archived=False,
        upvotes=0,
        is_visitor_issue=is_visitor,
        created_at=datetime.datetime.utcnow(),
    )
    session.add(issue)
    session.commit()
    session.refresh(issue)
    return enrich_issue(session, issue, discord_id)


@router.get('/projects/{project_id}/issues/{issue_id}')
def get_issue(project_id: int, issue_id: int, user: dict = Depends(get_current_user)):
    session: Session = user['_db']
    issue = session.get(Issue, issue_id)
    if not issue or issue.project_id != project_id:
        raise HTTPException(status_code=404, detail='Issue not found')
    project = session.get(Project, project_id)
    discord_id = user['discord_id']
    role = get_user_role(session, project_id, discord_id)
    if not project.is_public and role is None:
        raise HTTPException(status_code=403, detail='Forbidden')
    return enrich_issue(session, issue, discord_id)


@router.put('/projects/{project_id}/issues/{issue_id}')
def update_issue(project_id: int, issue_id: int, body: IssueUpdate, user: dict = Depends(get_current_user)):
    session: Session = user['_db']
    issue = session.get(Issue, issue_id)
    if not issue or issue.project_id != project_id:
        raise HTTPException(status_code=404, detail='Issue not found')
    discord_id = user['discord_id']
    role = get_user_role(session, project_id, discord_id)
    is_own_visitor = issue.is_visitor_issue and issue.author_id == discord_id

    if role is None and not is_own_visitor:
        raise HTTPException(status_code=403, detail='Forbidden')

    allowed = {'summary', 'type', 'priority', 'status', 'category', 'version_id',
               'operating_systems', 'description', 'modlog', 'archived'}
    if role is None:
        allowed = {'summary', 'type', 'category', 'operating_systems', 'description'}

    updates = body.model_dump(exclude_unset=True)
    for key, value in updates.items():
        if key not in allowed:
            continue
        if isinstance(value, list):
            setattr(issue, key, [v.value if hasattr(v, 'value') else v for v in value])
        elif hasattr(value, 'value'):
            setattr(issue, key, value.value)
        else:
            setattr(issue, key, value)

    if issue.archived and issue.status not in ('completed', 'wont_fix'):
        raise HTTPException(status_code=422, detail='Can only archive completed or wont_fix issues')

    session.commit()
    session.refresh(issue)
    return enrich_issue(session, issue, discord_id)


@router.delete('/projects/{project_id}/issues/{issue_id}')
def delete_issue(project_id: int, issue_id: int, user: dict = Depends(get_current_user)):
    session: Session = user['_db']
    issue = session.get(Issue, issue_id)
    if not issue or issue.project_id != project_id:
        raise HTTPException(status_code=404, detail='Issue not found')
    discord_id = user['discord_id']
    role = get_user_role(session, project_id, discord_id)
    is_own_visitor = issue.is_visitor_issue and issue.author_id == discord_id
    if role not in ('owner', 'maintainer') and not is_own_visitor:
        raise HTTPException(status_code=403, detail='Forbidden')
    session.delete(issue)
    session.commit()
    return {'ok': True}
