import time
from fastapi import Header, HTTPException
from core.auth import decode_jwt_payload
from core import database as db


def get_current_user(authorization: str = Header(...)) -> dict:
    if not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail='Invalid token')
    token = authorization[7:]
    payload = decode_jwt_payload(token)
    if not payload:
        raise HTTPException(status_code=401, detail='Invalid token')
    if time.time() > payload.get('exp', 0):
        raise HTTPException(status_code=401, detail='Token expired')
    discord_id = payload.get('discord_id')
    if not discord_id:
        raise HTTPException(status_code=401, detail='Invalid token payload')

    if discord_id not in db.users:
        db.users[discord_id] = {
            'discord_id': discord_id,
            'username': payload.get('username', 'Unknown'),
            'avatar_url': payload.get('avatar_url', ''),
            'is_donor': payload.get('is_donor', False),
        }

    return db.users[discord_id]
