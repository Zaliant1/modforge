from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from schemas.user import UserBrief


class IssueType(str, Enum):
    bug = "bug"
    suggestion = "suggestion"


class IssuePriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class IssueStatus(str, Enum):
    reported = "reported"
    in_progress = "in_progress"
    completed = "completed"
    wont_fix = "wont_fix"


class OperatingSystem(str, Enum):
    windows = "windows"
    macos = "macos"
    linux = "linux"
    handheld = "handheld"


class IssueCreate(BaseModel):
    summary: str = Field(..., max_length=200)
    version_id: Optional[int] = None
    category: Optional[str] = None
    type: IssueType = IssueType.bug
    priority: IssuePriority = IssuePriority.medium
    status: IssueStatus = IssueStatus.reported
    operating_systems: list[OperatingSystem] = Field(default_factory=list)
    description: str = ""
    modlog: Optional[str] = None


class IssueUpdate(BaseModel):
    summary: Optional[str] = Field(None, max_length=200)
    version_id: Optional[int] = None
    category: Optional[str] = None
    type: Optional[IssueType] = None
    priority: Optional[IssuePriority] = None
    status: Optional[IssueStatus] = None
    operating_systems: Optional[list[OperatingSystem]] = None
    description: Optional[str] = None
    modlog: Optional[str] = None
    archived: Optional[bool] = None


class IssueOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    project_id: int
    summary: str
    author_id: str
    version_id: Optional[int] = None
    version: str
    category: str
    type: IssueType
    priority: IssuePriority
    status: IssueStatus
    operating_systems: list[OperatingSystem]
    description: str
    modlog: Optional[str] = None
    archived: bool
    upvotes: int
    is_visitor_issue: bool
    created_at: datetime
    author: UserBrief
    progress: float
    upvoted: bool
