import { vars } from '~/theme'

const columnHeader = {
  py: 1.5,
  px: 2,
  borderRadius: '6px 6px 0 0',
  mb: 1,
  fontFamily: vars.mono,
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

export const styles = {
  'kanban-column': { minWidth: 260, flex: 1 },
  'kanban-column__header--reported': { ...columnHeader, bgcolor: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' },
  'kanban-column__header--in_progress': { ...columnHeader, bgcolor: 'rgba(234,179,8,0.12)', color: '#facc15', border: '1px solid rgba(234,179,8,0.2)' },
  'kanban-column__header--completed': { ...columnHeader, bgcolor: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' },
  'kanban-column__header--wont_fix': { ...columnHeader, bgcolor: 'rgba(255,255,255,0.04)', color: vars.text3, border: `1px solid ${vars.border}` },
  'kanban-column__issues': { display: 'flex', flexDirection: 'column', gap: '7px' },
}
