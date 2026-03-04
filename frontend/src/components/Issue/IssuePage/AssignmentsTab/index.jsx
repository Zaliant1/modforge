import { useState } from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  TextField,
  Button,
  Avatar,
  IconButton,
  LinearProgress,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '~/api/assignments'
import { getProgressPercent } from '~/utils/progress'
import { styles } from './styles'
import { useStyles } from '~/hooks/useStyles'

export const AssignmentsTab = ({ issue, setIssue }) => {
  const [taskInput, setTaskInput] = useState('')
  const { id: issueId, assignments: issueAssignments = [] } = issue || {}
  const progress = getProgressPercent(issueAssignments)

  const toggleDone = async (assignment) => {
    const { id: assignmentId, done } = assignment || {}
    const updated = await updateAssignment(issueId, assignmentId, { done: !done })
    if (updated) {
      setIssue((prevIssue) => {
        const { assignments: prevAssignments = [] } = prevIssue || {}
        return {
          ...prevIssue,
          assignments: prevAssignments.map((existingAssignment) => {
            const { id: existingId } = existingAssignment || {}
            return existingId === assignmentId ? { ...existingAssignment, done: !done } : existingAssignment
          }),
        }
      })
    }
  }

  const addAssignment = async () => {
    if (!taskInput.trim()) return
    const created = await createAssignment(issueId, { task: taskInput })
    if (created) {
      setIssue((prevIssue) => {
        const { assignments: prevAssignments = [] } = prevIssue || {}
        return { ...prevIssue, assignments: [...prevAssignments, created] }
      })
      setTaskInput('')
    }
  }

  const remove = async (assignmentId) => {
    await deleteAssignment(issueId, assignmentId)
    setIssue((prevIssue) => {
      const { assignments: prevAssignments = [] } = prevIssue || {}
      return {
        ...prevIssue,
        assignments: prevAssignments.filter((existingAssignment) => {
          const { id: existingId } = existingAssignment || {}
          return existingId !== assignmentId
        }),
      }
    })
  }

  return (
    <Box>
      {progress !== null && (
        <Box sx={useStyles(styles, 'assignments-tab__progress-box')}>
          <Typography variant='body2' sx={useStyles(styles, 'assignments-tab__progress-label')}>
            Progress: {progress}%
          </Typography>
          <LinearProgress
            variant='determinate'
            value={progress}
            sx={useStyles(styles, 'assignments-tab__progress')}
          />
        </Box>
      )}

      <List disablePadding>
        {issueAssignments.map((assignment) => {
          const { id: assignmentId, done, task, assignee = {} } = assignment || {}
          const { avatar_url, username = '' } = assignee || {}
          return (
            <ListItem
              key={assignmentId}
              disablePadding
              sx={useStyles(styles, 'assignments-tab__item')}
              secondaryAction={
                <IconButton size='small' onClick={() => remove(assignmentId)}>
                  <DeleteIcon fontSize='small' />
                </IconButton>
              }
            >
              <Checkbox
                checked={done}
                onChange={() => toggleDone(assignment)}
                size='small'
              />
              <Avatar
                src={avatar_url}
                sx={useStyles(styles, 'assignments-tab__assignee')}
              >
                {username[0]}
              </Avatar>
              <ListItemText
                primary={task}
                primaryTypographyProps={{
                  sx: useStyles(
                    styles,
                    done ? 'assignments-tab__task--done' : 'assignments-tab__task',
                  ),
                }}
              />
            </ListItem>
          )
        })}
      </List>

      <Box sx={useStyles(styles, 'assignments-tab__form')}>
        <TextField
          size='small'
          placeholder='Add task...'
          value={taskInput}
          onChange={(event) => setTaskInput(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && addAssignment()}
          fullWidth
        />
        <Button variant='outlined' onClick={addAssignment}>
          Add
        </Button>
      </Box>
    </Box>
  )
}
