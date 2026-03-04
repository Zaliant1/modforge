# ModForge — Design Document

A gamer-oriented project/issue tracker (think Jira meets the modding community).

---

## Setup & Running Locally

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.11
- MySQL running locally (default port 3306)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
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

### Frontend

```bash
cd frontend
npm install
```

Copy and fill in env vars:
```bash
cp .env.example .env
```

Required `.env` keys:
```
VITE_DISCORD_CLIENT_ID=
VITE_TINYMCE_API_KEY=
VITE_API_BASE_URL=http://localhost:8000
```

Run the dev server:
```bash
npm run dev
```

Other scripts:
```bash
npm run lint      # ESLint
npm run format    # Prettier
npm run build     # Production build
```

---

## Tech Stack

### Frontend
- ReactJS
- React Router
- Axios
- Material UI (MUI)

### Backend
- Python
- FastAPI
- Pydantic
- Peewee ORM
- MySQL

### Code Quality
- ESLint — JS linting
- Prettier — JS formatting
- Black — Python formatting

### Hosting
- Monorepo layout: `/frontend` and `/backend` subdirectories
- Frontend → Vercel (static React build, root directory: `frontend/`)
- Backend → Railway or Render (FastAPI, root directory: `backend/`)
- Media storage → Cloudflare R2 (S3-compatible, no egress fees)

### Media Uploads
- Project pictures/GIFs, issue description bodies, and modlog files are stored in Cloudflare R2
- Uploads go browser → R2 via presigned URL; only the resulting URL is stored in the DB
- All uploaded files are stored in R2; the database stores only the returned URL string, never binary data
- Issue descriptions are saved as HTML files in R2 and fetched on the issue page

---

## Auth

- Login via **Discord OAuth2**
- Users are identified by their Discord account

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
| `about` | string | max 500 chars |
| `version` | float | current project version |
| `picture` | string | URL to uploaded image/GIF in R2 |
| `categories` | string[] | list of category names |
| `is_public` | boolean | whether visitors can interact |
| `owner_id` | FK → User | |

#### Project Users (junction)
| Field | Type | Notes |
|-------|------|-------|
| `project_id` | FK | |
| `user_id` | FK | |
| `role` | enum | `owner`, `maintainer`, `contributor` |

---

### Issue
| Field | Type | Notes |
|-------|------|-------|
| `id` | int | PK |
| `project_id` | FK | |
| `summary` | string | max 200 chars |
| `author_id` | FK → User | creator |
| `version` | float | selected from project version history |
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

#### Issue Assignments
| Field | Type | Notes |
|-------|------|-------|
| `issue_id` | FK | |
| `assignee_id` | FK → User | must be owner/maintainer/contributor |
| `task` | string | description of the task |
| `done` | boolean | assignee can check off |

> `progress` on an issue is derived: `done_count / total_assignments`

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

## Views

### Home Page
- Grid/list of project cards the user owns or is a member of
- Discover public projects

### Project Card
- Displays: name, picture, version, about snippet, member count

### Project Page
- Sidebar: list of categories (clicking selects that category)
- Default: first category selected
- Header: project name, version, about, owner info

### Category View (Kanban Board)
- 4 columns: **Reported | In Progress | Completed | Won't Fix**
- Toggle to show/hide archived issues

#### Kanban Issue Card
- Summary
- 3-dot menu: Archive, Delete (permission-gated)
- Priority icon
- Type icon (bug / suggestion)
- OS icons
- Version
- Author avatar/picture
- Progress bar (if assignments exist)

### Issue Page (3 Tabs via MUI Tabs)

#### Tab 1 — Details
- Left: issue description body
- Right sidebar: status, type, priority, category, version, author, OS list

#### Tab 2 — Modlog
- Displays the uploaded modlog file content

#### Tab 3 — Assignments
- List of assignments showing the assignee, their task, and a completion checkbox
- Assignees can check off their task, which advances the issue progress

### Issue Creation Form
- Summary (max 200 chars)
- Type (radio: bug / suggestion)
- Priority (radio: low / medium / high) — locked for visitors
- Status (radio: reported / in_progress / completed / wont_fix)
- Category (dropdown from project categories)
- Version (dropdown from project version history) — locked for visitors
- Operating Systems (multi-select checkboxes)
- Description (rich text editor)
- Modlog upload (optional `.txt`)

---

## API Structure (FastAPI)

### Auth
- `GET /auth/discord` — redirect to Discord OAuth
- `GET /auth/discord/callback` — handle callback, issue session/JWT

### Projects
- `GET /projects` — list user's projects + public projects
- `POST /projects` — create project (user becomes owner)
- `GET /projects/{id}` — project detail
- `PUT /projects/{id}` — edit project (owner instant / maintainer → queued)
- `DELETE /projects/{id}` — owner only

### Project Users
- `POST /projects/{id}/users` — add user with role
- `PUT /projects/{id}/users/{user_id}` — change role
- `DELETE /projects/{id}/users/{user_id}` — remove user

### Change Requests (maintainer → owner approval)
- `GET /projects/{id}/requests` — list pending requests
- `POST /projects/{id}/requests` — submit a change request
- `PUT /projects/{id}/requests/{req_id}` — approve/reject (owner only)

### Issues
- `GET /projects/{id}/issues` — list issues (filter by category, status, archived)
- `POST /projects/{id}/issues` — create issue
- `GET /projects/{id}/issues/{issue_id}` — issue detail
- `PUT /projects/{id}/issues/{issue_id}` — edit issue
- `DELETE /projects/{id}/issues/{issue_id}` — delete (maintainer+ or own visitor issue)

### Assignments
- `POST /issues/{id}/assignments` — add assignment
- `PUT /issues/{id}/assignments/{assignment_id}` — update (toggle done)
- `DELETE /issues/{id}/assignments/{assignment_id}` — remove

### Comments
- `GET /issues/{id}/comments` — list comments
- `POST /issues/{id}/comments` — create comment
- `PUT /issues/{id}/comments/{comment_id}` — edit (own comment)
- `DELETE /issues/{id}/comments/{comment_id}` — delete (own or maintainer+)

### Upvotes
- `POST /issues/{id}/upvote` — toggle upvote

---

## Frontend Structure (React Router)

```
/                          → Home (project list)
/projects/new              → Create project
/projects/:id              → Project page (default: first category)
/projects/:id/:category    → Project page with selected category
/projects/:id/issues/new   → Issue creation
/projects/:id/issues/:issueId → Issue detail (tabs: details / modlog / assignments)
/projects/:id/settings     → Project settings (owner/maintainer)
/projects/:id/requests     → Pending change requests (owner)
```

---

## Component Overview

Each component and page folder contains a co-located `styles.js` alongside its `index.js`:

```
ComponentName/
  index.js
  styles.js
```

```
src/
  components/
    Project/
      ProjectCard/
        index.js
        styles.js
    Kanban/
      KanbanBoard/
        index.js
        styles.js
      KanbanColumn/
        index.js
        styles.js
    Issue/
      IssueCard/
        index.js
        styles.js
      IssueForm/
        index.js
        styles.js
      IssuePage/
        index.js
        styles.js
        DetailsTab/
          index.js
          styles.js
        ModlogTab/
          index.js
          styles.js
        AssignmentsTab/
          index.js
          styles.js
      CommentSection/
        index.js
        styles.js
    Common/
      Sidebar/
        index.js
        styles.js
      RichTextEditor/
        index.js
        styles.js
  pages/
    Home/
      index.js
      styles.js
    Project/
      index.js
      styles.js
      ProjectEdit/
        index.js
        styles.js
      ProjectChangeRequest/
        index.js
        styles.js
      ProjectSettings/
        index.js
        styles.js
    Issue/
      IssueCreate/
        index.js
        styles.js
  api/
    projects.js
    issues.js
    comments.js
    auth.js
  context/
    AuthContext.js
  constants.js
  hooks/
    useAuth.js
    useProject.js
    useIssue.js
    useStyles.js
```

---

## Frontend Conventions

- Always destructure props in the function signature, even for a single prop:
  ```js
  // correct
  export const MyComponent = ({ messages }) => { ... }

  // avoid
  export const MyComponent = (props) => { const { messages } = props }
  ```
- Components and utilities always declare and export together with `export const`; pages are the exception and use `export default`:
  ```js
  // components / utilities
  export const MyComponent = () => { ... }
  export const myUtil = (arg) => { ... }

  // pages only
  export default function ProjectPage() { ... }
  ```
- Never use dot notation to access object properties — always destructure, using aliasing when names conflict:
  ```js
  // correct
  const { name: projectName } = project || {}
  const { id: commentId } = comment || {}

  // avoid
  project.name
  comment.id
  ```
- Destructure with `|| {}` fallback at each level so destructuring never throws on undefined:
  ```js
  const { user, project } = someStore || {}
  const { name } = user || {}
  ```
- Never write inline `sx` props or raw CSS files — each component/page has a co-located `styles.js` exporting a BEM-keyed object, consumed via the `useStyles` hook:
  ```js
  // IssueCard/styles.js
  export const styles = {
    'issue-card': { background: '#1e1e1e', borderRadius: 2 },
    'issue-card__summary': { fontWeight: 600 },
    'issue-card__summary--archived': { opacity: 0.5 },
  }

  // hooks/useStyles.js
  export const useStyles = (styles, bemName) => {
    const { [bemName]: style } = styles || {}
    return style || {}
  }

  // IssueCard/index.js
  import { styles } from './styles'
  // ...
  <Box sx={useStyles(styles, 'issue-card')}>
  ```
- Never use optional chaining (`?.`) — use `|| {}` fallbacks so properties are always safe to access directly
- All `ALL_UPPERCASE` constants belong in `constants.js`, even if only used in one place
- Use full descriptive names for callback parameters — never abbreviate:
  ```js
  // correct
  comments.map((comment) => ...)
  projects.filter((project) => ...)

  // avoid
  comments.map((c) => ...)
  projects.filter((p) => ...)
  ```

---

## Key Business Rules

1. A project must have at least one category.
2. An issue's `archived` can only be `true` when `status` is `completed` or `wont_fix`.
3. Visitor issues lock `version` (to current project version) and `priority` (to `medium`).
4. Maintainer edits to project attributes are queued as change requests; only the owner can approve them.
5. Progress is computed: `assignments.filter(a => a.done).length / assignments.length` (0 if no assignments).
6. Only one owner per project at any time.
7. The owner role cannot be removed; it can only be transferred.
