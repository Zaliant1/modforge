import { vars } from '~/theme'

export const styles = {
  'modlog-tab': {
    border: `1px solid ${vars.border}`,
    borderRadius: '8px',
    overflow: 'hidden',
  },
  'modlog-tab__header': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: '16px',
    py: '10px',
    bgcolor: vars.surface,
    borderBottom: `1px solid ${vars.border}`,
  },
  'modlog-tab__file-info': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  'modlog-tab__file-icon': {
    fontSize: 14,
    color: vars.text3,
  },
  'modlog-tab__file-name': {
    fontFamily: vars.mono,
    fontSize: 12,
    fontWeight: 500,
    color: vars.text2,
  },
  'modlog-tab__file-size': {
    fontFamily: vars.mono,
    fontSize: 10,
    color: vars.text3,
  },
  'modlog-tab__download': {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: vars.mono,
    fontSize: 10,
    py: '4px',
    px: '10px',
    borderRadius: '4px',
    bgcolor: vars.accLo,
    border: `1px solid ${vars.accMed}`,
    color: vars.accent,
    cursor: 'pointer',
    transition: 'all 0.12s',
    '&:hover': { bgcolor: 'rgba(249,115,22,0.18)' },
  },
  'modlog-tab__content': {
    bgcolor: vars.card,
    p: '16px 20px',
    overflow: 'auto',
    fontSize: 12,
    fontFamily: vars.mono,
    color: vars.text2,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: 1.6,
    maxHeight: 500,
    m: 0,
  },

  // Empty state
  'modlog-tab__empty': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    py: '40px',
  },
  'modlog-tab__empty-icon': {
    fontSize: 28,
    color: vars.text3,
    opacity: 0.5,
  },
  'modlog-tab__empty-text': {
    fontSize: 13,
    color: vars.text3,
  },
}
