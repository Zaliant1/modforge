from typing import Optional

from pydantic import BaseModel

from schemas.user import UserBrief


class CommentCreate(BaseModel):
    body: str


class CommentUpdate(BaseModel):
    body: str


class CommentOut(BaseModel):
    id: int
    issue_id: int
    author_id: str
    body: str
    created_at: str
    author: Optional[UserBrief] = None
