import { vars } from '~/theme'

export const styles = {
  'change-request': { maxWidth: 700 },
  'change-request__divider': { mb: 2, borderColor: vars.border },
  'change-request__item': { borderBottom: `1px solid ${vars.border}`, py: 2 },
  'change-request__actions': { display: 'flex', gap: 1 },
}
