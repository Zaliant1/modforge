import { Box, Typography } from '@mui/material'
import { IssueCard } from '~/components/Issue/IssueCard'
import { styles } from './styles'
import { useStyles } from '~/hooks/useStyles'

export const KanbanColumn = ({ column, issues }) => {
  const { key, label } = column || {}

  return (
    <Box sx={useStyles(styles, 'kanban-column')}>
      <Box sx={useStyles(styles, `kanban-column__header--${key}`)}>
        <Typography align='center' fontWeight={700}>
          {label}
        </Typography>
      </Box>

      <Box sx={useStyles(styles, 'kanban-column__issues')}>
        {issues.map((issue) => {
          const { id: issueId } = issue || {}
          return <IssueCard key={issueId} issue={issue} />
        })}
      </Box>
    </Box>
  )
}

