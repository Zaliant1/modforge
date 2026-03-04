from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, projects, issues, comments, assignments, upvotes, change_requests

app = FastAPI(title='ModForge API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth.router, prefix='/api/auth', tags=['auth'])
app.include_router(projects.router, prefix='/api/projects', tags=['projects'])
app.include_router(issues.router, prefix='/api', tags=['issues'])
app.include_router(comments.router, prefix='/api', tags=['comments'])
app.include_router(assignments.router, prefix='/api', tags=['assignments'])
app.include_router(upvotes.router, prefix='/api', tags=['upvotes'])
app.include_router(change_requests.router, prefix='/api', tags=['change_requests'])
