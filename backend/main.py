from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from views import (
    auth_views,
    project_views,
    project_user_views,
    project_version_views,
    project_stats_views,
    project_rating_views,
    project_activity_views,
    change_request_views,
    issue_views,
    assignment_views,
    comment_views,
    upvote_views,
)

app = FastAPI(title='ModForge API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth_views.router, prefix='/api/auth', tags=['auth'])
app.include_router(project_views.router, prefix='/api/projects', tags=['projects'])
app.include_router(project_user_views.router, prefix='/api/projects', tags=['project-users'])
app.include_router(project_version_views.router, prefix='/api/projects', tags=['project-versions'])
app.include_router(project_stats_views.router, prefix='/api/projects', tags=['project-stats'])
app.include_router(project_rating_views.router, prefix='/api/projects', tags=['project-ratings'])
app.include_router(project_activity_views.router, prefix='/api/projects', tags=['project-activity'])
app.include_router(change_request_views.router, prefix='/api/projects', tags=['change-requests'])
app.include_router(issue_views.router, prefix='/api', tags=['issues'])
app.include_router(assignment_views.router, prefix='/api', tags=['assignments'])
app.include_router(comment_views.router, prefix='/api', tags=['comments'])
app.include_router(upvote_views.router, prefix='/api', tags=['upvotes'])
