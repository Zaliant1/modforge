from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field

from schemas.user import UserOut


class ProjectRole(str, Enum):
    owner = "owner"
    maintainer = "maintainer"
    contributor = "contributor"


class VersionStatus(str, Enum):
    released = "released"
    current = "current"
    upcoming = "upcoming"


# --- Project ---


class ProjectCreate(BaseModel):
    name: str
    game: Optional[str] = None
    about: str = Field("", max_length=500)
    picture: str = ""
    categories: list[str] = Field(default_factory=list, min_length=1)
    is_public: bool = False
    version: str = "1.0.0"


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    game: Optional[str] = None
    about: Optional[str] = Field(None, max_length=500)
    picture: Optional[str] = None
    categories: Optional[list[str]] = None
    is_public: Optional[bool] = None


class CategoryStats(BaseModel):
    total: int = 0
    reported: int = 0
    in_progress: int = 0
    completed: int = 0
    wont_fix: int = 0


class MemberOut(UserOut):
    role: ProjectRole


class ProjectSummary(BaseModel):
    id: int
    name: str
    game: Optional[str] = None
    about: str
    picture: str
    categories: list[str]
    is_public: bool
    owner_id: str
    created_at: str
    version: Optional[str] = None
    is_member: bool
    user_role: Optional[str] = None
    member_count: int
    views: int = 0


class ProjectDetail(BaseModel):
    id: int
    name: str
    game: Optional[str] = None
    about: str
    picture: str
    categories: list[str]
    is_public: bool
    owner_id: str
    created_at: str
    version: Optional[str] = None
    is_member: bool
    user_role: Optional[str] = None
    members: list[MemberOut]
    category_stats: dict[str, CategoryStats]


# --- Project Version ---


class VersionCreate(BaseModel):
    name: str
    description: str = ""
    status: VersionStatus = VersionStatus.upcoming


class VersionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[VersionStatus] = None


class VersionOut(BaseModel):
    id: int
    project_id: int
    name: str
    description: str
    status: VersionStatus
    released_at: Optional[str] = None
    created_at: str


# --- Project User ---


class ProjectUserAdd(BaseModel):
    user_id: str
    role: ProjectRole


class ProjectUserUpdate(BaseModel):
    role: ProjectRole


# --- Project Rating ---


class RatingCreate(BaseModel):
    stars: int = Field(..., ge=1, le=5)


# --- Project Stats ---


class ProjectStatsOut(BaseModel):
    views: int
    downloads: int
    downloads_week: int
    downloads_today: int
    open_issues: int
    open_issues_today: int
    bugs_closed: int
    close_rate: float
    avg_rating: float
    rating_count: int
