import { vars } from '~/theme'

export const styles = {
  'mod-detail': {
    maxWidth: 900,
    mx: 'auto',
    px: 3,
    py: 4,
  },
  'mod-detail__hero': {
    display: 'flex',
    gap: 3,
    mb: 4,
  },
  'mod-detail__picture': {
    width: 200,
    height: 200,
    borderRadius: '10px',
    objectFit: 'cover',
    flexShrink: 0,
    border: `1px solid ${vars.borderHi}`,
  },
  'mod-detail__info': {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  'mod-detail__name': {
    fontWeight: 700,
    color: vars.text,
  },
  'mod-detail__version': {
    alignSelf: 'flex-start',
    bgcolor: vars.surface,
    color: vars.text2,
    border: `1px solid ${vars.border}`,
  },
  'mod-detail__about': {
    color: vars.text2,
    fontSize: 14,
    lineHeight: 1.6,
  },
  'mod-detail__stats': {
    display: 'flex',
    gap: 3,
    mt: 1,
  },
  'mod-detail__stat': {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    color: vars.text2,
    fontSize: 13,
  },
  'mod-detail__stat-label': {
    fontSize: 11,
    color: vars.text3,
  },
  'mod-detail__body': {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  'mod-detail__section-title': {
    color: vars.text3,
    mb: 1,
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: '0.1em',
    fontFamily: vars.mono,
  },
  'mod-detail__categories': {},
  'mod-detail__chip-row': {
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap',
  },
  'mod-detail__chip': {
    bgcolor: vars.surface,
    color: vars.text2,
    border: `1px solid ${vars.border}`,
  },
  'mod-detail__members': {},
  'mod-detail__member': {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    py: 1,
  },
  'mod-detail__avatar': {
    width: 32,
    height: 32,
  },
  'mod-detail__member-name': {
    fontSize: 13,
    fontWeight: 600,
    color: vars.text,
  },
  'mod-detail__member-role': {
    fontSize: 11,
    color: vars.text2,
    textTransform: 'capitalize',
  },
}
