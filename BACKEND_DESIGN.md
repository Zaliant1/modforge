# ModForge — Backend Design Document

A gamer-oriented project/issue tracker (think Jira meets the modding community).

---

## Setup & Running Locally

### Prerequisites
- Python >= 3.11
- MySQL running locally (default port 3306)

### Install & Run

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Unix: source venv/bin/activate
pip install -r requirements.txt
```

Copy and fill in env vars:
```bash
cp .env.example .env
```

Required `.env` keys:
```
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/modforge
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=http://localhost:8000/auth/discord/callback
JWT_SECRET=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

Run the dev server:
```bash
uvicorn main:app --reload --port 8000
```

### Code Quality
- Black — Python formatting

### Hosting
- Railway or Render (FastAPI, root directory: `backend/`)
- Media storage → Cloudflare R2 (S3-compatible, no egress fees)

---

## Auth

- Login via **Discord OAuth2**
- Users are identified by their Discord account

---

## Media Uploads

- Project pictures/GIFs, issue description bodies, and modlog files are stored in Cloudflare R2
- Uploads go browser → R2 via presigned URL; only the resulting URL is stored in the DB
- All uploaded files are stored in R2; the database stores only the returned URL string, never binary data
- Issue descriptions are saved as HTML files in R2 and fetched on the issue page

---

## Data Models

### User (Discord-based)
- `discord_id` — string
- `username` — string
- `avatar_url` — string
- `is_donor` — boolean

---

### Project
| Field | Type | Notes |
|-------|------|-------|
| `id` | int | PK |
| `name` | string | |
| `game` | string | nullable — the game this mod is for (null for non-game projects) |
| `about` | string | max 500 chars |
| `picture` | string | URL to uploaded image/GIF in R2 |
| `categories` | string[] | list of category names |
| `is_public` | boolean | whether visitors can interact |
| `owner_id` | FK → User | |
| `created_at` | datetime | UTC |

#### Project Versions
| Field | Type | Notes |
|-------|------|-------|
| `id` | int | PK |
| `project_id` | FK | |
| `name` | string | version label, e.g. `1.0.0`, `2.0-beta` |
| `description` | string | changelog / release notes (plain text) |
| `status` | enum | `released`, `current`, `upcoming` |
| `released_at` | datetime | nullable — null for upcoming versions |
| `created_at` | datetime | UTC |

> Exactly one version per project should have `status = current` at any time. Issues can be filtered by version. Visitors creating issues are locked to the `current` version.

#### Project Users (junction)
| Field | Type | Notes |
|-------|------|-------|
| `project_id` | FK | |
| `user_id` | FK | |
| `role` | enum | `owner`, `maintainer`, `contributor` |

#### View Events
| Field | Type | Notes |
|-------|------|-------|
| `id` | int | PK |
| `project_id` | FK | |
| `client_token` | string | unique token from localStorage (no login required) |
| `created_at` | datetime | UTC |

> One view per `client_token` per project. Only for public game projects.

#### Download Events
| Field | Type | Notes |
|-------|------|-------|
| `id` | int | PK |
| `project_id` | FK | |
| `client_token` | string | unique token from localStorage (no login required) |
| `created_at` | datetime | UTC |

> One download per `client_token` per project. `downloads` (lifetime), `downloads_week`, `downloads_today` are derived by counting rows. Only for public game projects.

#### Project Ratings
| Field | Type | Notes |
|-------|------|-------|
| `id` | int | PK |
| `project_id` | FK | |
| `user_id` | FK → User | one rating per user per project (must be logged in) |
| `stars` | int | 1-5 |
| `created_at` | datetime | |

> `avg_rating` and `rating_count` are derived. Only public game projects can be rated.

---

### Issue
| Field | Type | Notes |
|-------|------|-------|
| `id` | int | PK |
| `project_id` | FK | |
| `summary` | string | max 200 chars |
| `author_id` | FK → User | creator |
| `version_id` | FK → Project Versions | selected from project's version list |
| `category` | string | must exist on project |
| `type` | enum | `bug`, `suggestion` |
| `priority` | enum | `low`, `medium`, `high` |
| `status` | enum | `reported`, `in_progress`, `completed`, `wont_fix` |
| `operating_systems` | string[] | `windows`, `macos`, `linux`, `handheld` (multi-select) |
| `description` | string | URL to HTML file in R2 |
| `modlog` | string | URL to uploaded `.txt` in R2 |
| `archived` | boolean | only if status is `completed` or `wont_fix` |
| `upvotes` | int | |
| `is_visitor_issue` | boolean | created by non-member |
| `created_at` | datetime | UTC |

#### Issue Assignments
| Field | Type | Notes |
|-------|------|-------|
| `issue_id` | FK | |
| `assignee_id` | FK → User | must be owner/maintainer/contributor |
| `task` | string | description of the task |
| `done` | boolean | assignee can check off |

> `progress` on an issue is derived: `done_count / total_assignments`

#### Activity Log
| Field | Type | Notes |
|-------|------|-------|
| `id` | int | PK |
| `project_id` | FK | |
| `user_id` | FK → User | actor |
| `action` | string | e.g. `issue_created`, `issue_closed`, `version_published`, `member_joined` |
| `detail` | string | human-readable summary |
| `created_at` | datetime | |

#### Issue Comments
| Field | Type | Notes |
|-------|------|-------|
| `id` | int | PK |
| `issue_id` | FK | |
| `author_id` | FK → User | |
| `body` | rich text | |
| `created_at` | datetime | |

---

## Permissions

### Owner
- Full edit on all project attributes (name, about, version, picture, categories, publicity)
- Add/remove/change roles of any user (maintainer, contributor)
- Approve or reject maintainer-requested changes
- All maintainer permissions

### Maintainer
**Instant actions:**
- Create issues
- Edit any issue (status, priority, version, category, assignment, etc.)
- Move issues between kanban columns
- Archive issues (status must be `completed` or `wont_fix`)
- Delete issues
- Comment on issues

**Requested actions (must be approved by owner):**
- Edit project: categories, version number, picture, name, description
- Add users as contributors

### Contributor
- Create issues
- Move their **own** issues on the kanban
- Cannot assign members to issues
- Comment on issues

### Visitor (non-member, public projects only)
- Create issues (version locked to current project version, priority locked to `medium`)
- Edit **their own** issue: category, summary, type, OS, description
- Delete **their own** issue
- Comment on any issue
- Cannot move or edit anyone else's issue
- Cannot change version or priority on their issue

---

## API Structure (FastAPI)

Endpoints are organized into **view modules** — each view file groups the routes consumed by a specific area of the frontend.

```
backend/
  views/
    auth_views.py
    project_views.py
    project_user_views.py
    project_version_views.py
    project_stats_views.py
    project_rating_views.py
    project_activity_views.py
    change_request_views.py
    issue_views.py
    assignment_views.py
    comment_views.py
    upvote_views.py
```

### `auth_views.py`
- `GET /auth/discord` — redirect to Discord OAuth
- `GET /auth/discord/callback` — handle callback, issue session/JWT

### `project_views.py`
- `GET /projects` — list user's projects + public projects
- `POST /projects` — create project (user becomes owner)
- `GET /projects/{id}` — project detail
- `PUT /projects/{id}` — edit project (owner instant / maintainer → queued)
- `DELETE /projects/{id}` — owner only

### `project_user_views.py`
- `POST /projects/{id}/users` — add user with role
- `PUT /projects/{id}/users/{user_id}` — change role
- `DELETE /projects/{id}/users/{user_id}` — remove user

### `project_version_views.py`
- `GET /projects/{id}/versions` — list all versions (released, current, upcoming)
- `POST /projects/{id}/versions` — create a version (owner only)
- `PUT /projects/{id}/versions/{version_id}` — edit version (name, status)
- `DELETE /projects/{id}/versions/{version_id}` — delete version (owner only, cannot delete current)

### `project_stats_views.py`
- `GET /projects/{id}/stats` — returns computed metrics: `downloads`, `downloads_week`, `downloads_today` (all derived from Download Events), `open_issues` (reported + in_progress), `open_issues_today` (created_at within UTC today), `bugs_closed` (completed + wont_fix), `close_rate`, `avg_rating`, `rating_count`

### `project_rating_views.py`
- `POST /projects/{id}/ratings` — create or update rating (1-5 stars, one per user)
- `DELETE /projects/{id}/ratings` — remove own rating

### `project_activity_views.py`
- `GET /projects/{id}/activity` — list recent activity log entries (timestamped)

### `change_request_views.py`
- `GET /projects/{id}/requests` — list pending requests
- `POST /projects/{id}/requests` — submit a change request
- `PUT /projects/{id}/requests/{req_id}` — approve/reject (owner only)

### `issue_views.py`
- `GET /projects/{id}/issues` — list issues (filter by category, status, version, archived)
- `POST /projects/{id}/issues` — create issue
- `GET /projects/{id}/issues/{issue_id}` — issue detail
- `PUT /projects/{id}/issues/{issue_id}` — edit issue
- `DELETE /projects/{id}/issues/{issue_id}` — delete (maintainer+ or own visitor issue)

### `assignment_views.py`
- `POST /issues/{id}/assignments` — add assignment
- `PUT /issues/{id}/assignments/{assignment_id}` — update (toggle done)
- `DELETE /issues/{id}/assignments/{assignment_id}` — remove

### `comment_views.py`
- `GET /issues/{id}/comments` — list comments
- `POST /issues/{id}/comments` — create comment
- `PUT /issues/{id}/comments/{comment_id}` — edit (own comment)
- `DELETE /issues/{id}/comments/{comment_id}` — delete (own or maintainer+)

### `upvote_views.py`
- `POST /issues/{id}/upvote` — toggle upvote

---

## Key Business Rules

1. A project must have at least one category.
2. An issue's `archived` can only be `true` when `status` is `completed` or `wont_fix`.
3. Visitor issues lock `version_id` (to the project's `current` version) and `priority` (to `medium`).
4. Maintainer edits to project attributes are queued as change requests; only the owner can approve them.
5. Progress is computed: `assignments.filter(a => a.done).length / assignments.length` (0 if no assignments).
6. Only one owner per project at any time.
7. The owner role cannot be removed; it can only be transferred.
8. All timestamps are stored as UTC. "Today" and "this week" are computed server-side against UTC boundaries.
9. Download counts (`downloads`, `downloads_week`, `downloads_today`) are derived from the `Download Events` table by counting rows within the relevant UTC time window — no rolling counters or cron jobs needed.
10. Views, downloads, ratings, and issue upvotes are unique per user — deduplicated by a `client_token` (generated and stored in localStorage on first visit). No login required to view, download, or upvote.
11. Projects without a `game` (non-mod projects): cannot be public, cannot be downloaded, cannot have star ratings, cannot have views.
12. Private projects (regardless of game): cannot have star ratings.

---

## AI-Assisted Development

- After any Claude-generated code changes, manually verify the diff for hiccups or discrepancies before committing (e.g. stale imports, naming mismatches, convention drift)
