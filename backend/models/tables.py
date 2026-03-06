from datetime import datetime

from sqlalchemy import (
    Boolean, Column, DateTime, Enum, ForeignKey, Integer, JSON, String, Text,
    UniqueConstraint,
)
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    discord_id = Column(String(64), primary_key=True)
    username = Column(String(128), nullable=False)
    avatar_url = Column(String(512), nullable=False, default="")
    is_donor = Column(Boolean, nullable=False, default=False)


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(256), nullable=False)
    game = Column(String(256), nullable=True)
    about = Column(String(500), nullable=False, default="")
    picture = Column(String(512), nullable=False, default="")
    categories = Column(JSON, nullable=False, default=list)
    is_public = Column(Boolean, nullable=False, default=False)
    owner_id = Column(String(64), ForeignKey("users.discord_id"), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    owner = relationship("User", foreign_keys=[owner_id])
    versions = relationship("ProjectVersion", back_populates="project", cascade="all, delete-orphan")
    members = relationship("ProjectUser", back_populates="project", cascade="all, delete-orphan")


class ProjectVersion(Base):
    __tablename__ = "project_versions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(64), nullable=False)
    description = Column(Text, nullable=False, default="")
    status = Column(Enum("released", "current", "upcoming", name="version_status"), nullable=False)
    released_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    project = relationship("Project", back_populates="versions")


class ProjectUser(Base):
    __tablename__ = "project_users"

    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(String(64), ForeignKey("users.discord_id"), primary_key=True)
    role = Column(Enum("owner", "maintainer", "contributor", name="project_role"), nullable=False)

    project = relationship("Project", back_populates="members")
    user = relationship("User")


class ViewEvent(Base):
    __tablename__ = "view_events"
    __table_args__ = (UniqueConstraint("project_id", "client_token"),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    client_token = Column(String(128), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class DownloadEvent(Base):
    __tablename__ = "download_events"
    __table_args__ = (UniqueConstraint("project_id", "client_token"),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    client_token = Column(String(128), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class ProjectRating(Base):
    __tablename__ = "project_ratings"
    __table_args__ = (UniqueConstraint("project_id", "user_id"),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(64), ForeignKey("users.discord_id"), nullable=False)
    stars = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    summary = Column(String(200), nullable=False)
    author_id = Column(String(64), ForeignKey("users.discord_id"), nullable=False)
    version_id = Column(Integer, ForeignKey("project_versions.id"), nullable=True)
    category = Column(String(128), nullable=False)
    type = Column(Enum("bug", "suggestion", name="issue_type"), nullable=False)
    priority = Column(Enum("low", "medium", "high", name="issue_priority"), nullable=False)
    status = Column(Enum("reported", "in_progress", "completed", "wont_fix", name="issue_status"), nullable=False)
    operating_systems = Column(JSON, nullable=False, default=list)
    description = Column(Text, nullable=False, default="")
    modlog = Column(String(512), nullable=True)
    archived = Column(Boolean, nullable=False, default=False)
    upvotes = Column(Integer, nullable=False, default=0)
    is_visitor_issue = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    author = relationship("User", foreign_keys=[author_id])
    version = relationship("ProjectVersion", foreign_keys=[version_id])
    assignments = relationship("Assignment", back_populates="issue", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="issue", cascade="all, delete-orphan")


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    issue_id = Column(Integer, ForeignKey("issues.id", ondelete="CASCADE"), nullable=False)
    assignee_id = Column(String(64), ForeignKey("users.discord_id"), nullable=False)
    task = Column(Text, nullable=False)
    done = Column(Boolean, nullable=False, default=False)

    issue = relationship("Issue", back_populates="assignments")
    assignee = relationship("User")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    issue_id = Column(Integer, ForeignKey("issues.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(String(64), ForeignKey("users.discord_id"), nullable=False)
    body = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    issue = relationship("Issue", back_populates="comments")
    author = relationship("User")


class ActivityLog(Base):
    __tablename__ = "activity_log"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(64), ForeignKey("users.discord_id"), nullable=False)
    action = Column(String(64), nullable=False)
    detail = Column(Text, nullable=False, default="")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User")


class ChangeRequest(Base):
    __tablename__ = "change_requests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    requester_id = Column(String(64), ForeignKey("users.discord_id"), nullable=False)
    status = Column(Enum("pending", "approved", "rejected", name="change_request_status"), nullable=False, default="pending")
    changes = Column(JSON, nullable=False)
    note = Column(Text, nullable=False, default="")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)
    reviewer_id = Column(String(64), ForeignKey("users.discord_id"), nullable=True)

    requester = relationship("User", foreign_keys=[requester_id])
    reviewer = relationship("User", foreign_keys=[reviewer_id])


class IssueUpvote(Base):
    __tablename__ = "issue_upvotes"

    issue_id = Column(Integer, ForeignKey("issues.id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(String(64), ForeignKey("users.discord_id"), primary_key=True)
