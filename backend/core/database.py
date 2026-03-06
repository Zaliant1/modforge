from datetime import datetime, timedelta, timezone

from sqlalchemy import create_engine, func
from sqlalchemy.orm import Session, sessionmaker

from core.config import DATABASE_URL
from models import (
    Base, User, Project, ProjectVersion, ProjectUser,
    ViewEvent, DownloadEvent, ProjectRating,
    Issue, Assignment, Comment, ActivityLog, ChangeRequest, IssueUpvote,
)

engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def create_tables():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Query helpers (used by views)
# ---------------------------------------------------------------------------


def get_user_role(db: Session, project_id: int, discord_id: str) -> str | None:
    pu = db.query(ProjectUser).filter_by(project_id=project_id, user_id=discord_id).first()
    return pu.role if pu else None


def get_project_members(db: Session, project_id: int) -> list[dict]:
    rows = (
        db.query(ProjectUser, User)
        .join(User, ProjectUser.user_id == User.discord_id)
        .filter(ProjectUser.project_id == project_id)
        .all()
    )
    return [
        {
            "discord_id": u.discord_id,
            "username": u.username,
            "avatar_url": u.avatar_url,
            "is_donor": u.is_donor,
            "role": pu.role,
        }
        for pu, u in rows
    ]


def get_project_versions(db: Session, project_id: int) -> list[ProjectVersion]:
    return db.query(ProjectVersion).filter_by(project_id=project_id).all()


def get_current_version(db: Session, project_id: int) -> ProjectVersion | None:
    return db.query(ProjectVersion).filter_by(project_id=project_id, status="current").first()


def issue_progress(db: Session, issue_id: int) -> float:
    total = db.query(func.count(Assignment.id)).filter_by(issue_id=issue_id).scalar()
    if not total:
        return 0.0
    done = db.query(func.count(Assignment.id)).filter_by(issue_id=issue_id, done=True).scalar()
    return done / total


def enrich_issue(db: Session, issue: Issue, discord_id: str) -> dict:
    author = db.get(User, issue.author_id)
    version = db.get(ProjectVersion, issue.version_id) if issue.version_id else None
    upvoted = db.query(IssueUpvote).filter_by(issue_id=issue.id, user_id=discord_id).first() is not None
    return {
        "id": issue.id,
        "project_id": issue.project_id,
        "summary": issue.summary,
        "author_id": issue.author_id,
        "version_id": issue.version_id,
        "version": version.name if version else "",
        "category": issue.category,
        "type": issue.type,
        "priority": issue.priority,
        "status": issue.status,
        "operating_systems": issue.operating_systems or [],
        "description": issue.description or "",
        "modlog": issue.modlog,
        "archived": issue.archived,
        "upvotes": issue.upvotes,
        "is_visitor_issue": issue.is_visitor_issue,
        "created_at": issue.created_at,
        "author": {
            "discord_id": author.discord_id if author else "",
            "username": author.username if author else "Unknown",
            "avatar_url": author.avatar_url if author else "",
        },
        "assignments": [
            {
                "id": a.id,
                "issue_id": a.issue_id,
                "assignee_id": a.assignee_id,
                "task": a.task,
                "done": a.done,
                "assignee": {
                    "discord_id": a.assignee.discord_id if a.assignee else "",
                    "username": a.assignee.username if a.assignee else "Unknown",
                    "avatar_url": a.assignee.avatar_url if a.assignee else "",
                },
            }
            for a in issue.assignments
        ],
        "progress": issue_progress(db, issue.id),
        "upvoted": upvoted,
    }


def get_project_stats(db: Session, project_id: int) -> dict:
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=7)

    views = db.query(func.count(ViewEvent.id)).filter_by(project_id=project_id).scalar()

    downloads = db.query(func.count(DownloadEvent.id)).filter_by(project_id=project_id).scalar()
    downloads_week = (
        db.query(func.count(DownloadEvent.id))
        .filter(DownloadEvent.project_id == project_id, DownloadEvent.created_at >= week_start)
        .scalar()
    )
    downloads_today = (
        db.query(func.count(DownloadEvent.id))
        .filter(DownloadEvent.project_id == project_id, DownloadEvent.created_at >= today_start)
        .scalar()
    )

    proj_issues = db.query(Issue).filter_by(project_id=project_id).all()
    reported_issues = sum(1 for i in proj_issues if i.status == "reported")
    in_progress_issues = sum(1 for i in proj_issues if i.status == "in_progress")
    open_issues = reported_issues + in_progress_issues
    open_issues_today = sum(
        1 for i in proj_issues
        if i.status in ("reported", "in_progress") and i.created_at and i.created_at >= today_start.replace(tzinfo=None)
    )
    bugs_closed = sum(1 for i in proj_issues if i.status in ("completed", "wont_fix"))
    total = len(proj_issues)
    close_rate = (bugs_closed / total) if total > 0 else 0.0

    project = db.get(Project, project_id)
    total_categories = len(project.categories) if project and project.categories else 0

    proj_ratings = db.query(ProjectRating).filter_by(project_id=project_id).all()
    rating_count = len(proj_ratings)
    avg_rating = (sum(r.stars for r in proj_ratings) / rating_count) if rating_count > 0 else 0.0

    return {
        "views": views,
        "downloads": downloads,
        "downloads_week": downloads_week,
        "downloads_today": downloads_today,
        "open_issues": open_issues,
        "open_issues_today": open_issues_today,
        "reported_issues": reported_issues,
        "in_progress_issues": in_progress_issues,
        "bugs_closed": bugs_closed,
        "close_rate": round(close_rate, 2),
        "avg_rating": round(avg_rating, 2),
        "rating_count": rating_count,
        "total_categories": total_categories,
    }
