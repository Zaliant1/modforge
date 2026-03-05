import { Box, Typography } from '@mui/material'
import { KanbanCard } from '~/components/Kanban/KanbanCard/KanbanCard'
import { COLUMN_THEMES } from '~/constants'
import { styles } from './KanbanColumn.styles'
import { useStyles } from '~/hooks/useStyles'

export const KanbanColumn = ({ column, issues, showCategory, cardsFade, sliding, filteredIds, archived }) => {
  const { key, label } = column || {}
  const { color, gradient, countBg, countBorder } = COLUMN_THEMES[key] || {}
  const visibleCount = issues.filter((issue) => {
    const { id } = issue || {}
    return filteredIds ? filteredIds.has(id) : true
  }).length

  return (
    <Box sx={{
      ...useStyles(styles, 'kanban-column'),
      ...(sliding ? { flex: 0, minWidth: 0, opacity: 0, overflow: 'hidden', p: 0, gap: 0 } : {}),
      transition: 'flex 0.4s ease, min-width 0.4s ease, opacity 0.3s ease, padding 0.4s ease',
    }}>
      <Box sx={{ ...useStyles(styles, 'kanban-column__status-bar'), background: gradient }} />
      <Box sx={useStyles(styles, 'kanban-column__header')}>
        <Typography sx={{ ...useStyles(styles, 'kanban-column__title'), color }}>{label}</Typography>
        <Box sx={{ ...useStyles(styles, 'kanban-column__count'), bgcolor: countBg, border: `1px solid ${countBorder}`, color }}>
          {visibleCount}
        </Box>
        <Box component='button' sx={useStyles(styles, 'kanban-column__add')}>&#xFF0B;</Box>
      </Box>
      <Box sx={{
        ...useStyles(styles, 'kanban-column__cards'),
        opacity: cardsFade ? 0 : 1,
        transition: 'opacity 0.25s ease',
        ...(archived ? { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', alignItems: 'start', alignContent: 'start', '& > *': { mb: 0 } } : {}),
      }}>
        {issues.map((issue) => {
          const { id: issueId } = issue || {}
          const visible = filteredIds ? filteredIds.has(issueId) : true
          if (archived && !visible) return null
          return <KanbanCard key={issueId} issue={issue} columnKey={key} showCategory={showCategory} visible={visible} />
        })}
      </Box>
    </Box>
  )
}
