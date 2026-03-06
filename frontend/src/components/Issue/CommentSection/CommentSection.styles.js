import { vars } from '~/theme'

export const styles = {
  'comment-section': {
    mt: '24px',
    pt: '20px',
    borderTop: `1px solid ${vars.border}`,
  },

  // Header
  'comment-section__header': {
    fontFamily: vars.mono,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: vars.text3,
    mb: '14px',
  },

  // Comment list
  'comment-section__list': {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    mb: '16px',
  },

  // Single comment
  'comment-section__item': {
    display: 'flex',
    gap: '10px',
    p: '12px 14px',
    borderRadius: '8px',
    bgcolor: vars.surface,
    border: `1px solid ${vars.border}`,
    transition: 'border-color 0.12s',
    '&:hover': { borderColor: vars.borderHi },
  },
  'comment-section__avatar': {
    width: 28,
    height: 28,
    borderRadius: '6px',
    fontSize: 10,
    fontWeight: 700,
    bgcolor: vars.accent,
    color: '#fff',
    flexShrink: 0,
  },
  'comment-section__meta': {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
    flex: 1,
  },
  'comment-section__username': {
    fontFamily: vars.mono,
    fontSize: 11,
    fontWeight: 600,
    color: vars.text2,
  },
  'comment-section__body': {
    fontSize: 12,
    fontWeight: 300,
    color: vars.text2,
    lineHeight: 1.6,
    wordBreak: 'break-word',
    '& p': { m: 0 },
    '& a': { color: vars.accent, textDecoration: 'none' },
  },

  // Empty state
  'comment-section__empty': {
    fontSize: 12,
    color: vars.text3,
    fontStyle: 'italic',
    textAlign: 'center',
    py: '20px',
  },

  // Form
  'comment-section__form': {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  'comment-section__form-avatar': {
    width: 28,
    height: 28,
    borderRadius: '6px',
    fontSize: 10,
    fontWeight: 700,
    bgcolor: vars.accent,
    color: '#fff',
    flexShrink: 0,
    mt: '2px',
  },
  'comment-section__input-wrapper': {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  'comment-section__input': {
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
    },
    '& .MuiInputBase-inputMultiline': {
      color: vars.text2,
    },
  },
  'comment-section__submit': {
    alignSelf: 'flex-end',
    fontFamily: vars.mono,
    fontSize: 11,
    textTransform: 'none',
    borderColor: vars.accMed,
    color: vars.accent,
    px: '14px',
    py: '5px',
    borderRadius: '6px',
    '&:hover': { borderColor: vars.accent, bgcolor: vars.accLo },
  },
}
