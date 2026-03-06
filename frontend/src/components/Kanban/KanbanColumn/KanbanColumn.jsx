import { useState, useEffect } from 'react'
import { Box, Typography, Slide, Fade } from '@mui/material'
import { KanbanCard } from '~/components/Kanban/KanbanCard/KanbanCard'
import { COLUMN_THEMES } from '~/constants'
import { styles } from './KanbanColumn.styles'
import { getStyle } from '~/hooks/useStyles'

export const KanbanColumn = ({ column, columnIndex = 0, issues, showCategory, cardsFade, sliding, filteredIds, archived }) => {
  const { key, label } = column || {}
  const { color, gradient, countBg, countBorder } = COLUMN_THEMES[key] || {}
  const [cardsIn, setCardsIn] = useState(false)

  useEffect(() => {
    const delay = 150 + columnIndex * 120
    const timer = setTimeout(() => setCardsIn(true), delay)
    return () => clearTimeout(timer)
  }, [columnIndex])

  const visibleCount = issues.filter((issue) => {
    const { id } = issue || {}
    return filteredIds ? filteredIds.has(id) : true
  }).length

  return (
    <Box sx={{
      ...getStyle(styles, 'kanban-column'),
      ...(sliding ? { flex: 0, minWidth: 0, opacity: 0, overflow: 'hidden', p: 0, gap: 0 } : {}),
      transition: 'flex 0.4s ease, min-width 0.4s ease, opacity 0.3s ease, padding 0.4s ease',
    }}>
      <Box sx={{ ...getStyle(styles, 'kanban-column__status-bar'), background: gradient }} />
      <Box sx={getStyle(styles, 'kanban-column__header')}>
        <Typography sx={{ ...getStyle(styles, 'kanban-column__title'), color }}>{label}</Typography>
        <Box sx={{ ...getStyle(styles, 'kanban-column__count'), bgcolor: countBg, border: `1px solid ${countBorder}`, color }}>
          {visibleCount}
        </Box>
        <Box component='button' sx={getStyle(styles, 'kanban-column__add')}>&#xFF0B;</Box>
      </Box>
      <Slide direction='up' in={cardsIn} timeout={400} mountOnEnter>
        <Box>
          <Fade in={!cardsFade && cardsIn} timeout={350}>
            <Box sx={{
              ...getStyle(styles, 'kanban-column__cards'),
              ...(archived ? { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', alignItems: 'start', alignContent: 'start', '& > *': { mb: 0 } } : {}),
            }}>
              {issues.map((issue) => {
                const { id: issueId } = issue || {}
                const visible = filteredIds ? filteredIds.has(issueId) : true
                if (archived && !visible) return null
                return <KanbanCard key={issueId} issue={issue} columnKey={key} showCategory={showCategory} visible={visible} />
              })}
            </Box>
          </Fade>
        </Box>
      </Slide>
    </Box>
  )
}
