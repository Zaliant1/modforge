from urllib.parse import quote
import httpx
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from core.config import DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI, FRONTEND_URL
from core.auth import create_jwt
from core import database as db

router = APIRouter()


@router.get('/discord')
def discord_login():
    url = (
        'https://discord.com/api/oauth2/authorize'
        f'?client_id={DISCORD_CLIENT_ID}'
        f'&redirect_uri={quote(DISCORD_REDIRECT_URI, safe="")}'
        '&response_type=code&scope=identify'
    )
    return RedirectResponse(url)


@router.get('/discord/callback')
async def discord_callback(code: str):
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            'https://discord.com/api/oauth2/token',
            data={
                'client_id': DISCORD_CLIENT_ID,
                'client_secret': DISCORD_CLIENT_SECRET,
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': DISCORD_REDIRECT_URI,
            },
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
        )
        token_data = token_resp.json()
        access_token = token_data.get('access_token')
        if not access_token:
            raise HTTPException(status_code=400, detail='Discord OAuth failed')

        user_resp = await client.get(
            'https://discord.com/api/users/@me',
            headers={'Authorization': f'Bearer {access_token}'},
        )
        discord_user = user_resp.json()

    discord_id = discord_user['id']
    username = discord_user['username']
    avatar_hash = discord_user.get('avatar')
    avatar_url = (
        f'https://cdn.discordapp.com/avatars/{discord_id}/{avatar_hash}.png'
        if avatar_hash
        else f'https://cdn.discordapp.com/embed/avatars/{int(discord_id) % 5}.png'
    )

    if discord_id not in db.users:
        db.users[discord_id] = {
            'discord_id': discord_id,
            'username': username,
            'avatar_url': avatar_url,
            'is_donor': False,
        }
    else:
        db.users[discord_id]['username'] = username
        db.users[discord_id]['avatar_url'] = avatar_url

    token = create_jwt(db.users[discord_id])
    return RedirectResponse(f'{FRONTEND_URL}/?token={token}')
