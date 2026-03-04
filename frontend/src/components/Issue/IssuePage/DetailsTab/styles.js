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
  'details-tab__meta-label': { letterSpacing: 1, fontWeight: 700 },
  'details-tab__meta-value': { mt: 0.5 },
  'details-tab__author': { display: 'flex', alignItems: 'center', gap: 1 },
  'details-tab__author-avatar': { width: 24, height: 24, fontSize: 11 },
  'details-tab__status--reported': { bgcolor: '#c0622a', color: '#fff', fontWeight: 700 },
  'details-tab__status--in_progress': { bgcolor: '#b89030', color: '#fff', fontWeight: 700 },
  'details-tab__status--completed': { bgcolor: '#43a047', color: '#fff', fontWeight: 700 },
  'details-tab__status--wont_fix': { bgcolor: '#666', color: '#fff', fontWeight: 700 },
}
