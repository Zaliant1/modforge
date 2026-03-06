import { useState, useEffect } from 'react'
import { Box, Typography, TextField, Button, Fade, Slide } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTrash, faPlus, faPen } from '@fortawesome/free-solid-svg-icons'
import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '~/api/assignments'
import { AVATAR_GRADIENTS } from '~/constants'
import { styles } from './AssignmentsTab.styles'
import { getStyle, cx } from '~/hooks/useStyles'

export const AssignmentsTab = ({ issue, setIssue }) => {
  const [taskInput, setTaskInput] = useState('')
  const [mounted, setMounted] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const { id: issueId, assignments = [] } = issue || {}

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const doneCount = assignments.filter((a) => a.done).length
  const total = assignments.length
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0

  const toggleDone = async (assignment) => {
    const { id: assignmentId, done } = assignment || {}
    const updated = await updateAssignment(issueId, assignmentId, { done: !done })
    if (updated) {
      setIssue((prev) => ({
        ...prev,
        assignments: prev.assignments.map((a) =>
          a.id === assignmentId ? { ...a, done: !done } : a
        ),
      }))
    }
  }

  const addAssignment = async () => {
    if (!taskInput.trim()) return
    const created = await createAssignment(issueId, { task: taskInput })
    if (created) {
      setIssue((prev) => ({ ...prev, assignments: [...(prev.assignments || []), created] }))
      setTaskInput('')
    }
  }

  const remove = async (assignmentId) => {
    await deleteAssignment(issueId, assignmentId)
    setIssue((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== assignmentId),
    }))
  }

  const startEdit = (assignment) => {
    setEditingId(assignment.id)
    setEditText(assignment.task)
  }

  const saveEdit = async (assignmentId) => {
    if (!editText.trim()) return
    const updated = await updateAssignment(issueId, assignmentId, { task: editText })
    if (updated) {
      setIssue((prev) => ({
        ...prev,
        assignments: prev.assignments.map((a) =>
          a.id === assignmentId ? { ...a, task: editText } : a
        ),
      }))
    }
    setEditingId(null)
    setEditText('')
  }

  return (
    <Box sx={getStyle(styles, 'assign')}>
      {/* Progress */}
      {total > 0 && (
        <Fade in={mounted} timeout={400}>
          <Box sx={getStyle(styles, 'assign__progress')}>
            <Box sx={getStyle(styles, 'assign__progress-header')}>
              <Typography sx={getStyle(styles, 'assign__progress-label')}>Progress</Typography>
              <Typography sx={getStyle(styles, 'assign__progress-pct')}>
                {doneCount}/{total} ({pct}%)
              </Typography>
            </Box>
            <Box sx={getStyle(styles, 'assign__progress-track')}>
              <Box sx={{ ...cx(styles, 'assign__progress-fill'), width: mounted ? `${pct}%` : '0%' }} />
            </Box>
          </Box>
        </Fade>
      )}

      {/* Assignment grid */}
      <Box sx={getStyle(styles, 'assign__grid')}>
        {assignments.map((assignment, index) => {
          const { id: assignmentId, done, task, assignee = {} } = assignment || {}
          const { avatar_url: avatarUrl, username = '' } = assignee || {}
          return (
            <Slide key={assignmentId} direction='up' in={mounted} timeout={300 + index * 80}>
              <Box sx={cx(styles, 'assign__card', done && 'assign__card--done')} onClick={() => toggleDone(assignment)}>
                <Box sx={getStyle(styles, 'assign__card-head')}>
                  <Box
                    component='button'
                    sx={cx(styles, 'assign__check', done && 'assign__check--done')}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {done && <FontAwesomeIcon icon={faCheck} />}
                  </Box>
                  <Box sx={{ ...cx(styles, 'assign__avatar'), ...(!avatarUrl ? { background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] } : {}) }}>
                    {avatarUrl ? (
                      <Box component='img' src={avatarUrl} alt={username} sx={getStyle(styles, 'assign__avatar-img')} />
                    ) : (
                      (username || '?')[0]
                    )}
                  </Box>
                  <Typography sx={getStyle(styles, 'assign__assignee')}>{username}</Typography>
                </Box>
                {editingId === assignmentId ? (
                  <TextField
                    size='small'
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(assignmentId)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    onBlur={() => saveEdit(assignmentId)}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                    fullWidth
                    sx={getStyle(styles, 'assign__edit-input')}
                  />
                ) : (
                  <Typography sx={cx(styles, 'assign__task', done && 'assign__task--done')}>{task}</Typography>
                )}
                <Box className='assign-actions' sx={getStyle(styles, 'assign__actions')}>
                  <Box
                    component='button'
                    sx={getStyle(styles, 'assign__action-btn')}
                    onClick={(e) => { e.stopPropagation(); startEdit(assignment) }}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </Box>
                  <Box
                    component='button'
                    sx={cx(styles, 'assign__action-btn', 'assign__action-btn--danger')}
                    onClick={(e) => { e.stopPropagation(); remove(assignmentId) }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Box>
                </Box>
              </Box>
            </Slide>
          )
        })}
      </Box>

      {/* Empty state */}
      {total === 0 && (
        <Fade in={mounted} timeout={500}>
          <Box sx={getStyle(styles, 'assign__empty')}>No assignments yet.</Box>
        </Fade>
      )}

      {/* Add form */}
      <Fade in={mounted} timeout={600}>
        <Box sx={getStyle(styles, 'assign__form')}>
          <TextField
            size='small'
            placeholder='Add a task...'
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addAssignment()}
            fullWidth
            sx={getStyle(styles, 'assign__input')}
          />
          <Button
            variant='outlined'
            onClick={addAssignment}
            sx={getStyle(styles, 'assign__add-btn')}
          >
            <FontAwesomeIcon icon={faPlus} /> Add
          </Button>
        </Box>
      </Fade>
    </Box>
  )
}
