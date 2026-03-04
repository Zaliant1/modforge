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
  { key: 'reported', label: 'Reported', color: '#c0622a' },
  { key: 'in_progress', label: 'In Progress', color: '#b89030' },
  { key: 'completed', label: 'Completed', color: '#555' },
  { key: 'wont_fix', label: "Won't Fix", color: '#4a2a4a' },
]

export const PRIORITY_COLORS = {
  low: '#5865F2',
  medium: '#e0b83a',
  high: '#e06c3a',
}

export const STATUS_COLORS = {
  reported: '#c0622a',
  in_progress: '#b89030',
  completed: '#43a047',
  wont_fix: '#666',
}

export const PRIORITY_SYMBOL = { low: '▬', medium: '▲', high: '▲▲' }
export const TYPE_SYMBOL = { bug: '🐛', suggestion: '💡' }
export const OS_SYMBOL = { windows: '⊞', macos: '', linux: '🐧', handheld: '🎮' }
export const OS_LABEL = { windows: 'Windows', macos: 'macOS', linux: 'Linux', handheld: 'Handheld' }
