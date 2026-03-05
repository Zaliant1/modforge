import { vars } from '~/theme'

const statusChip = { color: '#fff', fontWeight: 700, fontSize: 11 }

export const styles = {
  'details-tab': { display: 'flex', gap: 4 },
  'details-tab__body': { flex: 1, minWidth: 0 },
  'details-tab__sidebar': {
    width: 220,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  'details-tab__meta-label': { letterSpacing: 1, fontWeight: 700, color: vars.text3, fontSize: 10, textTransform: 'uppercase' },
  'details-tab__meta-value': { mt: 0.5, color: vars.text2 },
  'details-tab__author': { display: 'flex', alignItems: 'center', gap: 1 },
  'details-tab__author-avatar': { width: 24, height: 24, fontSize: 11 },
  'details-tab__status--reported': { ...statusChip, bgcolor: 'rgba(239,68,68,0.2)', color: '#f87171' },
  'details-tab__status--in_progress': { ...statusChip, bgcolor: 'rgba(234,179,8,0.15)', color: '#facc15' },
  'details-tab__status--completed': { ...statusChip, bgcolor: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  'details-tab__status--wont_fix': { ...statusChip, bgcolor: 'rgba(255,255,255,0.06)', color: vars.text3 },
}
