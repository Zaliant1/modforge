import os
from dotenv import load_dotenv

load_dotenv()

DISCORD_CLIENT_ID = os.getenv('DISCORD_CLIENT_ID', '')
DISCORD_CLIENT_SECRET = os.getenv('DISCORD_CLIENT_SECRET', '')
DISCORD_REDIRECT_URI = os.getenv('DISCORD_REDIRECT_URI', 'http://localhost:3000/api/auth/discord/callback')
JWT_SECRET = os.getenv('JWT_SECRET', 'devsecret')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
DATABASE_URL = os.getenv('DATABASE_URL', 'mysql+pymysql://root:@localhost:3306/modforge')
