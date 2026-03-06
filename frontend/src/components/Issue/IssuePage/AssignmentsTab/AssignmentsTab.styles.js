import { vars } from '~/theme'

export const styles = {
  'assign': {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  // Progress bar
  'assign__progress': {
    bgcolor: vars.surface,
    border: `1px solid ${vars.border}`,
    borderRadius: '8px',
    p: '14px 16px',
  },
  'assign__progress-header': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: '8px',
  },
  'assign__progress-label': {
    fontFamily: vars.mono,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: vars.text3,
  },
  'assign__progress-pct': {
    fontFamily: vars.mono,
    fontSize: 11,
    color: vars.text2,
    fontWeight: 500,
  },
  'assign__progress-track': {
    height: 4,
    bgcolor: 'rgba(255,255,255,0.06)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  'assign__progress-fill': {
    height: '100%',
    bgcolor: vars.green,
    borderRadius: '2px',
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Assignment grid
  'assign__grid': {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '8px',
  },
  'assign__card': {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    p: '14px',
    borderRadius: '8px',
    bgcolor: vars.card,
    border: `1px solid ${vars.border}`,
    transition: 'all 0.12s',
    position: 'relative',
    cursor: 'pointer',
    '&:hover': { bgcolor: vars.cardHi, borderColor: vars.borderHi },
    '&:hover .assign-actions': { opacity: 1 },
  },
  'assign__card--done': {
    opacity: 0.55,
  },

  // Card header (checkbox + assignee)
  'assign__card-head': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Checkbox
  'assign__check': {
    width: 18,
    height: 18,
    borderRadius: '4px',
    border: `2px solid ${vars.border}`,
    bgcolor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    color: 'transparent',
    fontSize: 9,
    transition: 'all 0.12s',
    '&:hover': { borderColor: vars.green },
  },
  'assign__check--done': {
    bgcolor: vars.green,
    borderColor: vars.green,
    color: '#fff',
  },

  // Avatar
  'assign__avatar': {
    width: 22,
    height: 22,
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 9,
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
    overflow: 'hidden',
  },
  'assign__avatar-img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  'assign__assignee': {
    fontFamily: vars.mono,
    fontSize: 11,
    color: vars.text2,
    fontWeight: 500,
  },

  // Task text
  'assign__task': {
    fontSize: 12,
    fontWeight: 400,
    color: vars.text2,
    lineHeight: 1.5,
  },
  'assign__task--done': {
    textDecoration: 'line-through',
    color: vars.text3,
  },

  // Action buttons
  'assign__actions': {
    position: 'absolute',
    top: 10,
    right: 10,
    display: 'flex',
    gap: '4px',
    opacity: 0,
    transition: 'opacity 0.12s',
  },
  'assign__action-btn': {
    width: 22,
    height: 22,
    borderRadius: '4px',
    border: 'none',
    bgcolor: 'transparent',
    color: vars.text3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 10,
    transition: 'all 0.12s',
    '&:hover': { color: '#f59e0b', bgcolor: 'rgba(245,158,11,0.1)' },
  },
  'assign__action-btn--danger': {
    '&:hover': { color: vars.red, bgcolor: 'rgba(239,68,68,0.1)' },
  },

  // Inline edit input
  'assign__edit-input': {
    '& .MuiOutlinedInput-root': {
      fontSize: 12,
      bgcolor: vars.surface,
      borderRadius: '4px',
      '& fieldset': { borderColor: vars.border },
      '&.Mui-focused fieldset': { borderColor: vars.accent },
    },
    '& .MuiOutlinedInput-input': {
      color: vars.text2,
      py: '4px',
      px: '8px',
    },
  },

  // Empty
  'assign__empty': {
    fontSize: 13,
    color: vars.text3,
    fontStyle: 'italic',
    textAlign: 'center',
    py: '30px',
  },

  // Add form
  'assign__form': {
    display: 'flex',
    gap: '8px',
    mt: '4px',
  },
  'assign__input': {
    '& .MuiOutlinedInput-root': {
      fontSize: 12,
      bgcolor: vars.surface,
      borderRadius: '6px',
      '& fieldset': { borderColor: vars.border },
      '&:hover fieldset': { borderColor: vars.borderHi },
      '&.Mui-focused fieldset': { borderColor: vars.accent },
    },
    '& .MuiOutlinedInput-input': {
      color: vars.text2,
      py: '8px',
    },
  },
  'assign__add-btn': {
    fontFamily: vars.mono,
    fontSize: 11,
    textTransform: 'none',
    borderColor: vars.accMed,
    color: vars.accent,
    display: 'flex',
    gap: '6px',
    px: '14px',
    whiteSpace: 'nowrap',
    '&:hover': { borderColor: vars.accent, bgcolor: vars.accLo },
  },
}
