import { useEffect } from 'react'
import { Box, Typography, FormControlLabel, Switch } from '@mui/material'
import { useParams } from 'react-router-dom'
import { getIssues } from '~/api/issues'
import { useKanban } from '~/context/KanbanContext'
import { KanbanColumn } from '~/components/Kanban/KanbanColumn'
import { KANBAN_COLUMNS } from '~/constants'
import { styles } from './styles'
import { useStyles } from '~/hooks/useStyles'

export const KanbanBoard = ({ category }) => {
  const { id: projectId } = useParams()
  const { issues, setIssues, showArchived, setShowArchived } = useKanban() || {}

  useEffect(() => {
    if (projectId && category) {
      getIssues(projectId, { category })
        .then(setIssues)
        .catch(() => {})
    }
  }, [projectId, category])

  const visibleIssues = showArchived
    ? issues
    : issues.filter((issue) => {
        const { archived } = issue || {}
        return !archived
      })
  const archivedCount = issues.filter((issue) => {
    const { archived } = issue || {}
    return archived
  }).length

  return (
    <Box>
      <Typography variant='h5' align='center' gutterBottom>
        {category}
      </Typography>

      <Box sx={useStyles(styles, 'kanban-board__controls')}>
        <FormControlLabel
          control={
            <Switch
              checked={showArchived}
              onChange={(event) => setShowArchived(event.target.checked)}
              size='small'
            />
          }
          label={`Archived ${archivedCount}`}
          slotProps={{ typography: { variant: 'body2' } }}
        />
      </Box>

      <Box sx={useStyles(styles, 'kanban-board__columns')}>
        {KANBAN_COLUMNS.map((column) => {
          const { key } = column || {}
          return (
            <KanbanColumn
              key={key}
              column={column}
              issues={visibleIssues.filter((issue) => {
                const { status } = issue || {}
                return status === key
              })}
            />
          )
        })}
      </Box>
    </Box>
  )
}

