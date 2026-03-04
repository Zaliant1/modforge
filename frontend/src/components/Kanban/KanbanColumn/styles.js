export const styles = {
  'kanban-column': { minWidth: 260, flex: 1 },
  'kanban-column__header--reported': {
    bgcolor: '#c0622a',
    py: 1.5,
    px: 2,
    borderRadius: '4px 4px 0 0',
    mb: 1,
  },
  'kanban-column__header--in_progress': {
    bgcolor: '#b89030',
    py: 1.5,
    px: 2,
    borderRadius: '4px 4px 0 0',
    mb: 1,
  },
  'kanban-column__header--completed': {
    bgcolor: '#555',
    py: 1.5,
    px: 2,
    borderRadius: '4px 4px 0 0',
    mb: 1,
  },
  'kanban-column__header--wont_fix': {
    bgcolor: '#4a2a4a',
    py: 1.5,
    px: 2,
    borderRadius: '4px 4px 0 0',
    mb: 1,
  },
  'kanban-column__issues': { display: 'flex', flexDirection: 'column', gap: 1 },
}
