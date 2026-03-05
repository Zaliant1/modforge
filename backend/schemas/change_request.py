from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel


class ChangeRequestStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class ChangeRequestCreate(BaseModel):
    changes: dict[str, Any]
    note: str = ""


class ChangeRequestResolve(BaseModel):
    status: ChangeRequestStatus


class ChangeRequestOut(BaseModel):
    id: int
    project_id: int
    requester_id: str
    status: ChangeRequestStatus
    changes: dict[str, Any]
    note: str
    created_at: str
    reviewed_at: Optional[str] = None
    reviewer_id: Optional[str] = None
