from typing import Optional

from pydantic import BaseModel


class AssignmentCreate(BaseModel):
    assignee_id: str
    task: str


class AssignmentUpdate(BaseModel):
    done: Optional[bool] = None
    task: Optional[str] = None


class AssignmentOut(BaseModel):
    id: int
    issue_id: int
    assignee_id: str
    task: str
    done: bool
