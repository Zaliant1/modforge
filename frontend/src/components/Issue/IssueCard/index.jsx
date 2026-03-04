import { useState } from 'react'
import {
  Paper,
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate, useParams } from 'react-router-dom'
import { getProgressPercent } from '~/utils/progress'
import { PRIORITY_SYMBOL, TYPE_SYMBOL, OS_SYMBOL } from '~/constants'
import { styles } from './styles'
import { useStyles } from '~/hooks/useStyles'

export const IssueCard = ({ issue }) => {
  const navigate = useNavigate()
  const { id: projectId } = useParams()
  const [menuAnchor, setMenuAnchor] = useState(null)
  const { id: issueId, summary, priority, type, version, operating_systems = [], author = {}, assignments } = issue || {}
  const { avatar_url, username = '' } = author || {}
  const progress = getProgressPercent(assignments)

  const openIssue = () =>
    navigate(`/projects/${projectId}/issues/${issueId}`)

  const stopAndOpen = (event, cb) => {
    event.stopPropagation()
    cb()
  }

  return (
    <Paper
      sx={useStyles(styles, 'issue-card')}
      onClick={openIssue}
    >
      <Box sx={useStyles(styles, 'issue-card__header')}>
        <Typography variant='body2' sx={useStyles(styles, 'issue-card__summary')}>
          {summary}
        </Typography>
        <IconButton
          size='small'
          onClick={(event) => stopAndOpen(event, () => setMenuAnchor(event.currentTarget))}
        >
          <MoreVertIcon fontSize='small' />
        </IconButton>
      </Box>

      <Box sx={useStyles(styles, 'issue-card__meta')}>
        <Box sx={useStyles(styles, 'issue-card__icons')}>
          <Typography sx={useStyles(styles, `issue-card__priority--${priority}`)}>
            {PRIORITY_SYMBOL[priority]}
          </Typography>
          <Typography sx={useStyles(styles, 'issue-card__type')}>
            {TYPE_SYMBOL[type]}
          </Typography>
          {operating_systems.map((operatingSystem) => (
            <Typography key={operatingSystem} sx={useStyles(styles, 'issue-card__os')}>
              {OS_SYMBOL[operatingSystem]}
            </Typography>
          ))}
        </Box>
        <Box sx={useStyles(styles, 'issue-card__right')}>
          <Typography variant='caption' color='text.secondary'>
            {version}
          </Typography>
          <Avatar
            src={avatar_url}
            sx={useStyles(styles, 'issue-card__author')}
          >
            {username[0]}
          </Avatar>
        </Box>
      </Box>

      {progress !== null && (
        <LinearProgress
          variant='determinate'
          value={progress}
          sx={useStyles(styles, 'issue-card__progress')}
        />
      )}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={(event) => {
          event && event.stopPropagation && event.stopPropagation()
          setMenuAnchor(null)
        }}
      >
        <MenuItem onClick={(event) => stopAndOpen(event, () => setMenuAnchor(null))}>
          Archive
        </MenuItem>
        <MenuItem
          sx={useStyles(styles, 'issue-card__delete')}
          onClick={(event) => stopAndOpen(event, () => setMenuAnchor(null))}
        >
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  )
}

