import { vars } from '~/theme'

export const styles = {
  'issue-card': {
    p: 2,
    cursor: 'pointer',
    bgcolor: vars.card,
    border: `1px solid ${vars.border}`,
    borderRadius: '8px',
    transition: 'all 0.15s',
    '&:hover': { bgcolor: vars.cardHi, borderColor: vars.borderHi },
  },
  'issue-card__header': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  'issue-card__summary': { flex: 1, mr: 1, color: vars.text, fontWeight: 500 },
  'issue-card__meta': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mt: 1,
  },
  'issue-card__icons': { display: 'flex', gap: 0.5, alignItems: 'center' },
  'issue-card__priority--low': { color: vars.blue, fontSize: 14 },
  'issue-card__priority--medium': { color: vars.yellow, fontSize: 14 },
  'issue-card__priority--high': { color: vars.red, fontSize: 14 },
  'issue-card__type': { fontSize: 14, color: vars.text2 },
  'issue-card__os': { fontSize: 13, color: vars.text3 },
  'issue-card__right': { display: 'flex', alignItems: 'center', gap: 1 },
  'issue-card__author': { width: 24, height: 24, fontSize: 11 },
  'issue-card__progress': { mt: 1, height: 4, borderRadius: 2 },
  'issue-card__delete': { color: vars.red },
}
