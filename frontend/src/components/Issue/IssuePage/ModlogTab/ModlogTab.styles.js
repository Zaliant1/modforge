import { vars } from '~/theme'

export const styles = {
  'modlog-tab__content': {
    bgcolor: vars.surface,
    border: `1px solid ${vars.border}`,
    p: 2,
    borderRadius: '8px',
    overflow: 'auto',
    fontSize: 13,
    fontFamily: vars.mono,
    color: vars.text2,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
}
