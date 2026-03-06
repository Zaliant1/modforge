import { vars } from '~/theme'

export const styles = {
  // -- Layout --
  'issue-form': {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    flex: 1,
    minHeight: 0,
    position: 'relative',
    zIndex: 1,
  },
  'issue-form__main': {
    p: '24px 28px',
    borderRight: `1px solid ${vars.border}`,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  'issue-form__sidebar': {
    p: '20px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },

  // -- Header --
  'issue-form__header': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: '4px',
  },
  'issue-form__title': {
    fontFamily: vars.ts,
    fontSize: 22,
    letterSpacing: '0.04em',
    color: vars.text,
    lineHeight: 1,
  },

  // -- Summary input --
  'issue-form__summary': {
    '& .MuiOutlinedInput-root': {
      bgcolor: vars.card,
      border: `1px solid ${vars.border}`,
      borderRadius: '10px',
      fontSize: 15,
      fontWeight: 500,
      color: vars.text,
      transition: 'border-color 0.15s, box-shadow 0.15s',
      '& fieldset': { border: 'none' },
      '&:hover': { borderColor: vars.borderHi },
      '&.Mui-focused': {
        borderColor: vars.accent,
        boxShadow: `0 0 0 1px ${vars.accMed}, 0 4px 16px rgba(249,115,22,0.08)`,
      },
    },
    '& .MuiOutlinedInput-input': {
      py: '14px',
      px: '16px',
      '&::placeholder': { color: vars.text3, opacity: 1 },
    },
  },
  'issue-form__char-count': {
    fontFamily: vars.mono,
    fontSize: 10,
    color: vars.text2,
    textAlign: 'right',
    mt: '4px',
  },

  // -- Editor wrapper --
  'issue-form__editor-label': {
    fontFamily: vars.mono,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: vars.text2,
    mb: '8px',
  },
  'issue-form__editor-section': {
    display: 'flex',
    flexDirection: 'column',
  },
  'issue-form__editor-wrapper': {
    bgcolor: vars.card,
    border: `1px solid ${vars.border}`,
    borderRadius: '10px',
    overflow: 'hidden',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    '&:focus-within': {
      borderColor: vars.accent,
      boxShadow: `0 0 0 1px ${vars.accMed}, 0 4px 16px rgba(249,115,22,0.08)`,
    },
  },

  // -- Sidebar section --
  'issue-form__section-label': {
    fontFamily: vars.mono,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: vars.text2,
    mb: '8px',
  },

  // -- Custom select --
  'issue-form__select': {
    '& .MuiOutlinedInput-root': {
      bgcolor: vars.surface,
      border: `1px solid ${vars.border}`,
      borderRadius: '6px',
      fontSize: 13,
      color: vars.text,
      '& fieldset': { border: 'none' },
      '&:hover': { borderColor: vars.borderHi },
      '&.Mui-focused': { borderColor: vars.accent },
    },
    '& .MuiOutlinedInput-input': {
      py: '8px',
      px: '12px',
    },
    '& .MuiInputLabel-root': {
      fontSize: 12,
      color: vars.text3,
    },
    '& .MuiSelect-icon': {
      color: vars.text3,
    },
  },

  // -- Radio pill group --
  'issue-form__pill-group': {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  'issue-form__pill': {
    fontSize: 12,
    fontWeight: 500,
    py: '6px',
    px: '12px',
    borderRadius: '5px',
    border: `1px solid ${vars.border}`,
    bgcolor: vars.surface,
    color: vars.text2,
    cursor: 'pointer',
    transition: 'all 0.12s',
  },
  'issue-form__pill--active': {
    borderColor: vars.accMed,
    bgcolor: vars.accLo,
    color: vars.accent,
  },
  'issue-form__pill--disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
    '&:hover': { borderColor: vars.border, bgcolor: vars.surface },
  },

  // -- OS checkbox grid --
  'issue-form__os-grid': {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
  },
  'issue-form__os-item': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: 12,
    fontWeight: 500,
    py: '7px',
    px: '10px',
    borderRadius: '5px',
    border: `1px solid ${vars.border}`,
    bgcolor: vars.surface,
    color: vars.text2,
    cursor: 'pointer',
    transition: 'all 0.12s',
    '&:hover': { borderColor: vars.borderHi },
  },
  'issue-form__os-item--active': {
    borderColor: vars.accMed,
    bgcolor: vars.accLo,
    color: vars.accent,
  },
  'issue-form__os-check': {
    width: 14,
    height: 14,
    borderRadius: '3px',
    border: `1px solid ${vars.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 8,
    flexShrink: 0,
    transition: 'all 0.12s',
  },
  'issue-form__os-check--active': {
    bgcolor: vars.accent,
    borderColor: vars.accent,
    color: '#fff',
  },

  // -- Modlog upload --
  'issue-form__upload': {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    py: '10px',
    px: '14px',
    borderRadius: '6px',
    border: `1px dashed ${vars.border}`,
    bgcolor: vars.surface,
    cursor: 'pointer',
    transition: 'all 0.12s',
    '&:hover': { borderColor: vars.borderHi, bgcolor: vars.card },
  },
  'issue-form__upload-icon': {
    fontSize: 14,
    color: vars.text3,
  },
  'issue-form__upload-text': {
    fontSize: 12,
    color: vars.text3,
    fontWeight: 500,
  },
  'issue-form__upload-file': {
    fontSize: 12,
    color: vars.accent,
    fontWeight: 500,
  },

  // -- Footer --
  'issue-form__footer': {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    pt: '8px',
  },
  'issue-form__cancel-button': {
    fontSize: 12,
    fontWeight: 600,
    py: '8px',
    px: '20px',
    borderRadius: '6px',
    border: `1px solid ${vars.border}`,
    bgcolor: 'transparent',
    color: vars.text2,
    cursor: 'pointer',
    transition: 'all 0.12s',
    '&:hover': { borderColor: vars.borderHi, color: vars.text },
  },
  'issue-form__submit-button': {
    fontSize: 12,
    fontWeight: 600,
    py: '8px',
    px: '24px',
    borderRadius: '6px',
    border: `1px solid ${vars.accMed}`,
    bgcolor: vars.accent,
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.12s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    '&:hover': { bgcolor: vars.accentHover },
  },

  // -- Priority colors --
  'issue-form__pill--low': {
    borderColor: vars.blueMed,
    bgcolor: vars.blueLo,
    color: vars.blue,
  },
  'issue-form__pill--medium': {
    borderColor: 'rgba(234,179,8,0.2)',
    bgcolor: 'rgba(234,179,8,0.1)',
    color: vars.yellow,
  },
  'issue-form__pill--high': {
    borderColor: 'rgba(239,68,68,0.2)',
    bgcolor: 'rgba(239,68,68,0.1)',
    color: vars.red,
  },

  // -- Status colors --
  'issue-form__pill--reported': {
    borderColor: 'rgba(239,68,68,0.2)',
    bgcolor: 'rgba(239,68,68,0.1)',
    color: vars.red,
  },
  'issue-form__pill--in_progress': {
    borderColor: 'rgba(234,179,8,0.2)',
    bgcolor: 'rgba(234,179,8,0.1)',
    color: vars.yellow,
  },
  'issue-form__pill--completed': {
    borderColor: 'rgba(34,197,94,0.2)',
    bgcolor: 'rgba(34,197,94,0.1)',
    color: vars.green,
  },
  'issue-form__pill--wont_fix': {
    borderColor: 'rgba(168,85,247,0.2)',
    bgcolor: 'rgba(168,85,247,0.1)',
    color: vars.purple,
  },

  // -- Type colors --
  'issue-form__pill--bug': {
    borderColor: 'rgba(239,68,68,0.2)',
    bgcolor: 'rgba(239,68,68,0.1)',
    color: vars.red,
  },
  'issue-form__pill--suggestion': {
    borderColor: vars.blueMed,
    bgcolor: vars.blueLo,
    color: vars.blue,
  },

  // -- Validation errors --
  'issue-form__overlay': {
    position: 'absolute',
    inset: 0,
    bgcolor: 'rgba(0,0,0,0.45)',
    zIndex: 10,
    pointerEvents: 'none',
    transition: 'opacity 0.3s',
  },
  'issue-form__error-field': {
    position: 'relative',
    zIndex: 11,
  },
  'issue-form__error-ring': {
    borderRadius: '8px',
    boxShadow: `0 0 0 2px ${vars.red}, 0 0 12px rgba(239,68,68,0.25)`,
    animation: 'issue-form-shake 0.4s ease-in-out',
    '@keyframes issue-form-shake': {
      '0%, 100%': { transform: 'translateX(0)' },
      '20%': { transform: 'translateX(-4px)' },
      '40%': { transform: 'translateX(4px)' },
      '60%': { transform: 'translateX(-3px)' },
      '80%': { transform: 'translateX(3px)' },
    },
  },
  'issue-form__summary--error': {
    '& .MuiOutlinedInput-root': {
      borderColor: `${vars.red} !important`,
      boxShadow: `0 0 0 1px ${vars.red}, 0 0 12px rgba(239,68,68,0.25)`,
    },
  },
  'issue-form__select--error': {
    '& .MuiOutlinedInput-root': {
      borderColor: `${vars.red} !important`,
      boxShadow: `0 0 0 1px ${vars.red}, 0 0 12px rgba(239,68,68,0.25)`,
    },
  },
  'issue-form__section-label--error': {
    color: vars.red,
  },
}
