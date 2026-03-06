import theme from '~/theme'
import HKKnight from '~/assets/images/HKKnight.png'
import ModForgeLogo from '~/assets/images/ModForge.png'

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

export const PRIORITY_LABELS = {
  high: { label: 'High' },
  medium: { label: 'Medium' },
  low: { label: 'Low' },
}

export const TAG_STYLES = {
  bug: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.15)', color: '#f87171' },
  feature: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  suggestion: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  crash: { bg: 'rgba(239,68,68,0.18)', border: 'rgba(239,68,68,0.3)', color: '#fca5a5' },
  network: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  ui: { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.15)', color: '#fbbf24' },
  audio: { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.15)', color: '#fbbf24' },
  performance: { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.15)', color: '#c084fc' },
}

export const PRIORITY_BADGE_STYLES = {
  high: { bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)', color: '#fb923c' },
  medium: { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)', color: '#fbbf24' },
  low: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
}

export const COLUMN_THEMES = {
  reported: { color: '#f87171', gradient: 'linear-gradient(90deg,#ef4444,rgba(239,68,68,0.1))', countBg: 'rgba(239,68,68,0.1)', countBorder: 'rgba(239,68,68,0.2)' },
  in_progress: { color: '#fbbf24', gradient: 'linear-gradient(90deg,#eab308,rgba(234,179,8,0.1))', countBg: 'rgba(234,179,8,0.1)', countBorder: 'rgba(234,179,8,0.2)' },
  completed: { color: '#4ade80', gradient: 'linear-gradient(90deg,#22c55e,rgba(34,197,94,0.1))', countBg: 'rgba(34,197,94,0.1)', countBorder: 'rgba(34,197,94,0.2)' },
  wont_fix: { color: '#c084fc', gradient: 'linear-gradient(90deg,#a855f7,rgba(168,85,247,0.1))', countBg: 'rgba(168,85,247,0.1)', countBorder: 'rgba(168,85,247,0.2)' },
}

export const PRIORITY_ACCENT_COLORS = {
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
}

export const KANBAN_FILTER_TABS = [
  { key: 'all', label: 'All', color: '#4ade80', bg: 'rgba(34,197,94,0.10)', border: 'rgba(34,197,94,0.25)' },
  { key: 'bugs', label: 'Bugs', color: '#f87171', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.25)' },
  { key: 'features', label: 'Features', color: '#60a5fa', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.25)' },
  { key: 'mine', label: 'My Issues', color: '#a78bfa', bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.25)' },
]

export const KANBAN_PRIORITY_TABS = [
  { key: 'all', label: 'All', color: '#4ade80', bg: 'rgba(34,197,94,0.10)', border: 'rgba(34,197,94,0.25)' },
  { key: 'high', label: 'High', color: '#fb923c', bg: 'rgba(249,115,22,0.10)', border: 'rgba(249,115,22,0.20)' },
  { key: 'medium', label: 'Medium', color: '#fbbf24', bg: 'rgba(234,179,8,0.10)', border: 'rgba(234,179,8,0.20)' },
  { key: 'low', label: 'Low', color: '#60a5fa', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.20)' },
]

export const KANBAN_SORT_TABS = [
  { key: 'newest', label: 'Newest', color: '#60a5fa', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.25)' },
  { key: 'oldest', label: 'Oldest', color: '#60a5fa', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.25)' },
  { key: 'votes', label: 'Most Votes', color: '#60a5fa', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.25)' },
  { key: 'priority', label: 'Priority', color: '#60a5fa', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.25)' },
]

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

export const ROLE_STYLE_MAP = {
  owner: 'pp-member__role--owner',
  maintainer: 'pp-member__role--maintainer',
  contributor: 'pp-member__role--contributor',
}

export const ROLE_LABEL_MAP = {
  owner: 'Owner',
  maintainer: 'Maintainer',
  contributor: 'Contributor',
}

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

export const GAME_ICONS = {
  'Hollow Knight': { icon: HKKnight, color: '#4a5568', scale: '130%' },
  'The Elder Scrolls V: Skyrim': { icon: ModForgeLogo, color: '#8b7d5e' },
  'Stardew Valley': { icon: ModForgeLogo, color: '#5daa3a' },
  'Minecraft': { icon: ModForgeLogo, color: '#5d8a3e' },
  'Elden Ring': { icon: ModForgeLogo, color: '#c8a84e' },
  'Factorio': { icon: ModForgeLogo, color: '#f97316' },
  'Terraria': { icon: ModForgeLogo, color: '#3b82f6' },
  'Cyberpunk 2077': { icon: ModForgeLogo, color: '#f0e040' },
  'RimWorld': { icon: ModForgeLogo, color: '#4a90d9' },
  'No Man\'s Sky': { icon: ModForgeLogo, color: '#e03030' },
  'Valheim': { icon: ModForgeLogo, color: '#5bbcd6' },
  'Path of Exile 2': { icon: ModForgeLogo, color: '#af6025' },
  'Baldur\'s Gate 3': { icon: ModForgeLogo, color: '#c8a84e' },
  'Dark Souls 3': { icon: ModForgeLogo, color: '#d45f1a' },
  'Fallout 4': { icon: ModForgeLogo, color: '#4af626' },
  _default: { icon: ModForgeLogo, color: '#f97316' },
}

