from pydantic import BaseModel


class UserOut(BaseModel):
    discord_id: str
    username: str
    avatar_url: str
    is_donor: bool


class UserBrief(BaseModel):
    discord_id: str
    username: str
    avatar_url: str
