import { vars } from '~/theme'

export const styles = {
  'issue-page': {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    p: '24px 28px',
  },
  'issue-page__header': {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
  },
  'issue-page__id': {
    fontFamily: vars.mono,
    fontSize: 13,
    color: vars.text3,
    fontWeight: 500,
    mt: '4px',
    flexShrink: 0,
  },
  'issue-page__title': {
    fontFamily: vars.heading,
    fontSize: 22,
    fontWeight: 600,
    color: vars.text,
    lineHeight: 1.3,
  },
  'issue-page__tabs': {
    borderBottom: `1px solid ${vars.border}`,
    minHeight: 36,
    '& .MuiTabs-indicator': {
      bgcolor: vars.accent,
      height: 2,
    },
  },
  'issue-page__tab': {
    fontFamily: vars.mono,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: vars.text3,
    minHeight: 36,
    py: '8px',
    px: '14px',
    '&.Mui-selected': { color: vars.accent },
    '&:hover': { color: vars.text2 },
  },
  'issue-page__content': {
    minHeight: 0,
  },
}
