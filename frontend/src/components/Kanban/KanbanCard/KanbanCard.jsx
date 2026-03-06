import { useState } from 'react'
import { Box, Typography, Menu, MenuItem } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import {
  PRIORITY_LABELS,
  PRIORITY_BADGE_STYLES,
  PRIORITY_ACCENT_COLORS,
  TAG_STYLES,
  AVATAR_GRADIENTS,
} from '~/constants'
import highIcon from '~/assets/svgs/high.svg'
import mediumIcon from '~/assets/svgs/medium.svg'
import lowIcon from '~/assets/svgs/low.svg'
import { styles } from './KanbanCard.styles'
import { getStyle } from '~/hooks/useStyles'

const PRIORITY_ICONS = {
  high: highIcon,
  medium: mediumIcon,
  low: lowIcon,
}

const getAvatarGradient = (name) => {
  const { length = 0 } = name || ''
  const index = length % AVATAR_GRADIENTS.length
  return AVATAR_GRADIENTS[index]
}

const buildTags = (type, tags = []) => {
  const result = [...tags]
  if (type && !result.includes(type)) result.unshift(type)
  return result
}

export const KanbanCard = ({ issue, showCategory, visible = true }) => {
  const navigate = useNavigate()
  const { id: projectId } = useParams()
  const [menuAnchor, setMenuAnchor] = useState(null)

  const {
    id: issueId,
    summary,
    priority,
    type,
    version,
    category,
    author = {},
    upvotes,
  } = issue || {}

  const { username: authorName = '' } = author || {}
  const accentColor = PRIORITY_ACCENT_COLORS[priority] || 'transparent'
  const { label: priorityLabel = '' } = PRIORITY_LABELS[priority] || {}
  const priorityIcon = PRIORITY_ICONS[priority] || null
  const { bg: priBg = '', border: priBorder = '', color: priColor = '' } = PRIORITY_BADGE_STYLES[priority] || {}
  const issueTags = buildTags(type)

  const openIssue = () => navigate(`/forge/projects/${projectId}/issues/${issueId}`)

  const stopAndOpen = (event, callback) => {
    event.stopPropagation()
    callback()
  }

  return (
    <Box sx={{
      ...getStyle(styles, 'kanban-card'),
      ...(visible ? {} : { opacity: 0, maxHeight: 0, p: 0, m: 0, border: 'none', overflow: 'hidden' }),
      transition: 'opacity 0.2s ease, max-height 0.3s ease, padding 0.3s ease, margin 0.3s ease, border 0.2s ease',
    }} onClick={visible ? openIssue : undefined}>
      {/* Priority accent bar */}
      <Box sx={{ ...getStyle(styles, 'kanban-card__accent'), bgcolor: accentColor }} />

      {/* Top: title + menu */}
      <Box sx={getStyle(styles, 'kanban-card__top')}>
        <Typography sx={getStyle(styles, 'kanban-card__title')}>{summary}</Typography>
        <Box
          component='button'
          className='card-menu-btn'
          sx={getStyle(styles, 'kanban-card__menu')}
          onClick={(event) => stopAndOpen(event, () => setMenuAnchor(event.currentTarget))}
        >
          &#x22EF;
        </Box>
      </Box>

      {/* Tags */}
      {issueTags.length > 0 && (
        <Box sx={getStyle(styles, 'kanban-card__tags')}>
          {issueTags.map((tag) => {
            const { bg = 'rgba(255,255,255,0.05)', border = 'rgba(255,255,255,0.1)', color = '#8a8aa0' } = TAG_STYLES[tag] || {}
            return (
              <Box
                key={tag}
                sx={{
                  ...getStyle(styles, 'kanban-card__tag'),
                  bgcolor: bg,
                  border: `1px solid ${border}`,
                  color,
                }}
              >
                {tag}
              </Box>
            )
          })}
        </Box>
      )}

      {/* Footer */}
      <Box sx={getStyle(styles, 'kanban-card__footer')}>
        <Box
          sx={{
            ...getStyle(styles, 'kanban-card__priority-badge'),
            bgcolor: priBg,
            border: `1px solid ${priBorder}`,
            color: priColor,
          }}
        >
          {priorityIcon && <Box component='img' src={priorityIcon} alt={priorityLabel} sx={getStyle(styles, 'kanban-card__priority-icon')} />}
          {priorityLabel}
        </Box>

        <Typography sx={getStyle(styles, 'kanban-card__version')}>{version}</Typography>

        {showCategory && category && (
          <Box sx={getStyle(styles, 'kanban-card__category')}>{category}</Box>
        )}

        <Box
          component='button'
          sx={getStyle(styles, 'kanban-card__upvote')}
          onClick={(event) => stopAndOpen(event, () => {})}
        >
          <FontAwesomeIcon icon={faArrowUp} />
          {upvotes || 0}
        </Box>

        <Box
          sx={{
            ...getStyle(styles, 'kanban-card__author'),
            background: getAvatarGradient(authorName),
          }}
        >
          {(authorName || '?')[0].toUpperCase()}
        </Box>
      </Box>

      {/* Context menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={(event) => {
          if (event && event.stopPropagation) event.stopPropagation()
          setMenuAnchor(null)
        }}
      >
        <MenuItem onClick={(event) => stopAndOpen(event, () => setMenuAnchor(null))}>
          Archive
        </MenuItem>
        <MenuItem
          sx={getStyle(styles, 'kanban-card__delete')}
          onClick={(event) => stopAndOpen(event, () => setMenuAnchor(null))}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  )
}
