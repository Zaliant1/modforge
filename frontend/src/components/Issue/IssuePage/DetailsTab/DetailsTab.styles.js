import { vars } from '~/theme'

export const styles = {
  'details-tab': {
    display: 'flex',
    gap: '24px',
  },
  'details-tab__main': {
    flex: 1,
    minWidth: 0,
  },
  'details-tab__body-label': {
    fontFamily: vars.mono,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: vars.text3,
    mb: '10px',
  },
  'details-tab__body': {
    bgcolor: vars.surface,
    border: `1px solid ${vars.border}`,
    borderRadius: '8px',
    p: '18px 20px',
    minHeight: 120,
  },
  'details-tab__body-text': {
    fontSize: 13,
    fontWeight: 300,
    color: vars.text2,
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    '& img': { maxWidth: '100%', borderRadius: '6px', mt: '8px' },
  },
  'details-tab__empty': {
    fontSize: 13,
    color: vars.text3,
    fontStyle: 'italic',
    py: '20px',
  },

  // Sidebar
  'details-tab__sidebar': {
    width: 220,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    bgcolor: vars.surface,
    border: `1px solid ${vars.border}`,
    borderRadius: '8px',
    p: '16px',
  },
  'details-tab__field': {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  'details-tab__label': {
    fontFamily: vars.mono,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: vars.text3,
  },
  'details-tab__val': {
    fontSize: 12,
    fontWeight: 500,
    color: vars.text2,
    textTransform: 'capitalize',
  },
  'details-tab__val--mono': {
    fontFamily: vars.mono,
    fontSize: 11,
  },
  'details-tab__val-row': {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  // Status pill
  'details-tab__status': {
    fontFamily: vars.mono,
    fontSize: 10,
    fontWeight: 600,
    py: '3px',
    px: '8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    width: 'fit-content',
  },
  'details-tab__status--reported': {
    bgcolor: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.2)',
    color: '#f87171',
  },
  'details-tab__status--in_progress': {
    bgcolor: 'rgba(234,179,8,0.12)',
    border: '1px solid rgba(234,179,8,0.2)',
    color: '#facc15',
  },
  'details-tab__status--completed': {
    bgcolor: 'rgba(34,197,94,0.12)',
    border: '1px solid rgba(34,197,94,0.2)',
    color: '#4ade80',
  },
  'details-tab__status--wont_fix': {
    bgcolor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${vars.border}`,
    color: vars.text3,
  },

  // Author
  'details-tab__author': {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  'details-tab__author-av': {
    width: 20,
    height: 20,
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 9,
    fontWeight: 700,
    color: '#fff',
    overflow: 'hidden',
    flexShrink: 0,
  },
  'details-tab__author-av-img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  'details-tab__visitor-badge': {
    fontFamily: vars.mono,
    fontSize: 8,
    py: '1px',
    px: '5px',
    borderRadius: '3px',
    bgcolor: 'rgba(168,85,247,0.1)',
    border: '1px solid rgba(168,85,247,0.2)',
    color: '#c084fc',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },

  // OS chips
  'details-tab__os-list': {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  'details-tab__os-chip': {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: vars.mono,
    fontSize: 10,
    py: '2px',
    px: '6px',
    borderRadius: '4px',
    bgcolor: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.14)',
    color: vars.text2,
  },
}
