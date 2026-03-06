# ModForge — Frontend Design Document

A gamer-oriented project/issue tracker (think Jira meets the modding community).

---

## Setup & Running Locally

### Prerequisites
- Node.js >= 18

### Install & Run

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

- ReactJS
- React Router
- Axios
- Material UI (MUI)

### Code Quality
- ESLint — JS linting (unused variables are errors, not warnings)
- Prettier — JS formatting

### Hosting
- Vercel (static React build, root directory: `frontend/`)

### Static Assets (`src/assets/`)
- Branding images (logo, Discord icon, HK sprites) and fonts (PT Sans, thunderstrike) are bundled in the repo under `src/assets/`
- These are small, static, and needed at render time — Vite hashes font/image files for optimal caching
- All icons use **Font Awesome** (via `@fortawesome/react-fontawesome`)
- User-generated content (project pictures, descriptions, modlogs) is stored in Cloudflare R2 — see Backend Design Document

---

## Auth

- Login via **Discord OAuth2**
- Users are identified by their Discord account

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
- Version (dropdown from project versions — released, current, and upcoming) — locked for visitors
- Operating Systems (multi-select checkboxes)
- Description (rich text editor)
- Modlog upload (optional `.txt`)

---

## Frontend Structure (React Router)

The app has two top-level view modes — **Mod View** (consumer/browser) and **Forge View** (creator/manager). Users pick their mode on the landing page; it persists in localStorage. Each mode has its own page tree and visual style.

### Shared
```
/                          → LandingView (mode selector, redirects if mode stored)
```

### Mod View (browse & discover)
```
/mod                       → Mod browse (featured, new, top rated)
/mod/:id                   → Mod detail page (description, downloads, ratings)
```

### Forge View (project management)
```
/forge                     → Forge dashboard (my projects, activity, stats)
/forge/projects/new        → Create project
/forge/projects/:id        → Project page (default: first category)
/forge/projects/:id/:category → Project page with selected category
/forge/projects/:id/issues/new → Issue creation
/forge/projects/:id/issues/:issueId → Issue detail (tabs: details / modlog / assignments)
/forge/projects/:id/settings → Project settings (owner/maintainer)
/forge/projects/:id/requests → Pending change requests (owner)
```

---

## Component Overview

Each component and page folder contains a `.jsx` file named after the folder and a co-located styles file:

```
ComponentName/
  ComponentName.jsx
  ComponentName.styles.js
```

```
src/
  assets/
    fonts/
      PTSans-Regular.ttf
      PTSans-Bold.ttf
      PTSans-Italic.ttf
      PTSans-BoldItalic.ttf
      thunderstrike.ttf        # brand/display font
    images/
      DiscordIcon.png
      HKHornet.png
      HKKnight.png
      ModForge.png
  components/
    Landing/                   # landing page / mode selector
      LandingView/
      SlamTransition/
    Mod/                       # mod view (consumer/browser) components
      ModView/
      ModCard/
    Forge/                     # forge view (creator/manager) components
      ForgeView/
      ForgeProjectCard/
    Project/
      ProjectCard/
    Kanban/
      KanbanBoard/
      KanbanColumn/
    Issue/
      IssueCard/
      IssueForm/
      IssuePage/
        DetailsTab/
        ModlogTab/
        AssignmentsTab/
      CommentSection/
    Icon/
      TypeIcon/
      PriorityIcon/
      OsIcon/
    Common/
      Sidebar/
      RichTextEditor/
  pages/                       # 2 top-level dirs: Mod, Forge (landing uses LandingView component directly)
    Mod/                       # mod view pages
      ModBrowse/
      ModDetail/
    Forge/                     # forge view pages
      ForgeDashboard/
      Project/
        ProjectHome/
        ProjectEdit/
        ProjectChangeRequest/
        ProjectSettings/
      Issue/
        IssueCreate/
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

> Each folder above follows the `ComponentName.jsx` + `ComponentName.styles.js` convention. Abbreviated here for readability.

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
- All style keys follow **BEM notation**: `block__element--modifier`. The block name matches the component (e.g. `issue-card`). Elements use double underscore (`issue-card__summary`). Modifiers use double dash (`issue-card__summary--archived`)
- When stacking `ListItemButton`s side by side, alternate between `surface.light`/`surface.lightHover` and `surface.dark`/`surface.darkHover` for visual contrast
- Never write inline `sx` props or `style={}` — each component/page has a co-located `ComponentName.styles.js` exporting a BEM-keyed object:
  ```js
  // IssueCard/IssueCard.styles.js
  export const styles = {
    'issue-card': { background: '#1e1e1e', borderRadius: 2 },
    'issue-card__summary': { fontWeight: 600 },
    'issue-card__summary--archived': { opacity: 0.5 },
  }
  ```
- Use `getStyle` for single-key lookups (no state-dependent modifiers) and `cx` for composing a base key with conditional BEM modifiers:
  ```js
  import { getStyle, cx } from '~/hooks/useStyles'
  import { styles } from './IssueCard.styles'

  // single key — no modifiers
  <Box sx={getStyle(styles, 'issue-card')}>

  // base + conditional modifier — use cx
  <Box sx={cx(styles, 'issue-card__summary', archived && 'issue-card__summary--archived')}>

  // multiple conditional modifiers
  <Box sx={cx(styles, 'kanban-board__tab', isActive && 'kanban-board__tab--active', isDisabled && 'kanban-board__tab--disabled')}>
  ```
- Never use the ternary-select pattern (`isActive ? 'key--active' : 'key'`) with `getStyle` — always use `cx` with the base key + conditional modifier instead
- Always reference colors from `vars` (exported from `~/theme`) — never hardcode hex values in styles files. When a new color is needed, add it to `theme.js` first, then reference it from `vars`
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
- The frontend displays relative times (e.g. "3 min ago") by comparing UTC timestamps from the API to the user's local clock

---

## AI-Assisted Development

- After any Claude-generated code changes, manually verify the diff for hiccups or discrepancies before committing (e.g. stale imports, naming mismatches, convention drift)
- Before finalizing changes, run `npm run lint` and fix any errors — safely delete unused variables and imports

---

## Final Pass Checklist

Run through every item below before considering any frontend work complete.

- [ ] **Verbose naming** — No abbreviations (`category` not `cat`, `button` not `btn`, `response` not `res`, `comment` not `c`)
- [ ] **No inline styles** — All styling lives in co-located `*.styles.js` files. No inline `sx` or `style={}`. Use `getStyle` for single keys, `cx` for base + conditional modifiers.
- [ ] **BEM style keys** — All style keys follow BEM notation (`block__element--modifier`). Never ternary-select between keys — use `cx` with base + conditional modifier instead.
- [ ] **Destructure, don't dot-access** — Always destructure objects. Destructure props/params at the function declaration. Use `|| {}` fallbacks. Array method chains (`.map`, `.filter`) are the only dot-notation exception.
- [ ] **Export on declaration** — `export const MyComponent = ...` for components/utilities. Only pages use `export default`.
- [ ] **Ensure cx convention** — see convention for modifiers
- [ ] **Run lint** (`npm run lint`) — Catch and remove unused variables, unused imports, and dead code.
- [ ] **Design doc adherence** — Cross-check component structure, naming, theme usage, and patterns against this document.
