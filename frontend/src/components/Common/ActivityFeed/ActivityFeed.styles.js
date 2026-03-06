import { vars } from '~/theme'

export const styles = {
  'activity-feed': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  'activity-feed__header': {
    fontFamily: vars.mono,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: vars.text3,
    mb: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  'activity-feed__link': {
    color: vars.text3,
    cursor: 'pointer',
    fontSize: 9,
    transition: 'color 0.12s',
    '&:hover': { color: vars.accent },
  },
  'activity-feed__list': {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'auto',
  },
  'activity-feed__row': {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '9px',
    py: '9px',
    borderBottom: `1px solid ${vars.border}`,
    '&:last-of-type': { borderBottom: 'none' },
  },
  'activity-feed__dot': {
    width: 6,
    height: 6,
    borderRadius: '50%',
    flexShrink: 0,
    mt: '5px',
  },
  'd-r': { bgcolor: vars.red },
  'd-o': { bgcolor: vars.accent },
  'd-g': { bgcolor: vars.green },
  'd-b': { bgcolor: vars.blue },
  'activity-feed__body': {
    flex: 1,
  },
  'activity-feed__text': {
    fontSize: 12,
    fontWeight: 300,
    color: vars.text2,
    lineHeight: 1.5,
  },
  'activity-feed__time': {
    fontFamily: vars.mono,
    fontSize: 9,
    color: vars.text3,
    mt: '2px',
  },
}
