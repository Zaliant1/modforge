import time

from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from core.auth import decode_jwt_payload
from core.database import get_db
from models import User


def get_current_user(
    authorization: str = Header(...),
    db: Session = Depends(get_db),
) -> dict:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token")
    token = authorization[7:]
    payload = decode_jwt_payload(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    if time.time() > payload.get("exp", 0):
        raise HTTPException(status_code=401, detail="Token expired")
    discord_id = payload.get("discord_id")
    if not discord_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.get(User, discord_id)
    if not user:
        user = User(
            discord_id=discord_id,
            username=payload.get("username", "Unknown"),
            avatar_url=payload.get("avatar_url", ""),
            is_donor=payload.get("is_donor", False),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return {
        "discord_id": user.discord_id,
        "username": user.username,
        "avatar_url": user.avatar_url,
        "is_donor": user.is_donor,
        "_db": db,
    }
