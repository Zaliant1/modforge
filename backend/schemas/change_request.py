from datetime import datetime
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict


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
    model_config = ConfigDict(from_attributes=True)
    id: int
    project_id: int
    requester_id: str
    status: ChangeRequestStatus
    changes: dict[str, Any]
    note: str
    created_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewer_id: Optional[str] = None
