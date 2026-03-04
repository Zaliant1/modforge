import base64
import json
import time
import jwt
from core.config import JWT_SECRET


def decode_jwt_payload(token: str) -> dict:
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return {}
        payload_b64 = parts[1]
        padding = 4 - len(payload_b64) % 4
        if padding != 4:
            payload_b64 += '=' * padding
        return json.loads(base64.urlsafe_b64decode(payload_b64))
    except Exception:
        return {}


def create_jwt(user: dict) -> str:
    payload = {
        'discord_id': user['discord_id'],
        'username': user['username'],
        'avatar_url': user.get('avatar_url', ''),
        'is_donor': user.get('is_donor', False),
        'exp': int(time.time()) + 60 * 60 * 24 * 30,  # 30 days
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')
