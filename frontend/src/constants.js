import theme from '~/theme'

const { status, priority } = theme.palette

const AUTH_REDIRECT = `${window.location.protocol}//${window.location.host}/api/auth/discord/callback`

export const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(AUTH_REDIRECT)}&response_type=code&scope=identify`

export const ROLES = {
  OWNER: 'owner',
  MAINTAINER: 'maintainer',
  CONTRIBUTOR: 'contributor',
}

export const ISSUE_STATUSES = ['reported', 'in_progress', 'completed', 'wont_fix']
export const ISSUE_TYPES = ['bug', 'suggestion']
export const ISSUE_PRIORITIES = ['low', 'medium', 'high']
export const OPERATING_SYSTEMS = ['windows', 'macos', 'linux', 'handheld']

export const KANBAN_COLUMNS = [
  { key: 'reported', label: 'Reported', color: status.reported },
  { key: 'in_progress', label: 'In Progress', color: status.inProgress },
  { key: 'completed', label: 'Completed', color: status.completed },
  { key: 'wont_fix', label: "Won't Fix", color: status.wontFix },
]

export const PRIORITY_COLORS = {
  low: priority.low,
  medium: priority.medium,
  high: priority.high,
}

export const STATUS_COLORS = {
  reported: status.reported,
  in_progress: status.inProgress,
  completed: status.completed,
  wont_fix: status.wontFix,
}

export const STATUS_COLORS_LIGHT = {
  reported: status.reportedLight,
  in_progress: status.inProgressLight,
  completed: status.completedLight,
  wont_fix: status.wontFixLight,
}

export const OS_LABEL = { windows: 'Windows', macos: 'macOS', linux: 'Linux', handheld: 'Handheld' }

export const MEMBER_ROLES = [
  { key: ROLES.MAINTAINER, label: 'Maintainers' },
  { key: ROLES.CONTRIBUTOR, label: 'Contributors' },
]

export const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Anton&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap'

export const MOD_TABS = [
  { label: 'All', count: null },
  { label: 'Trending', count: null },
  { label: 'New', count: null },
  { label: 'Top Rated', count: null },
]

export const VIEW_MODE_STORAGE_KEY = 'modforge_view_mode'

export const CATEGORY_COLORS = ['#22c55e', '#f97316', '#3b82f6', '#a855f7', '#ef4444', '#eab308', '#06b6d4', '#ec4899']

export const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #5865f2, #4f46e5)',
  'linear-gradient(135deg, #22c55e, #15803d)',
  'linear-gradient(135deg, #f97316, #dc2626)',
  'linear-gradient(135deg, #a855f7, #6d28d9)',
  'linear-gradient(135deg, #eab308, #a16207)',
  'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  'linear-gradient(135deg, #ef4444, #b91c1c)',
  'linear-gradient(135deg, #06b6d4, #0e7490)',
]

export const ACTIVITY_DOT_COLORS = {
  issue_created: 'd-r',
  issue_closed: 'd-g',
  version_published: 'd-o',
  member_joined: 'd-b',
  issue_assigned: 'd-o',
}

export const MOD_FEATURES = [
  'Browse by game, category, or popularity',
  'One-click install with version tracking',
  'Community ratings and reviews',
  'Stay up to date when mods release',
]

export const FORGE_FEATURES = [
  'Kanban board for issues and sprints',
  'Release queue and notification pipeline',
  'Download, upvote and view metrics',
  'Team members, roles and contributors',
]

