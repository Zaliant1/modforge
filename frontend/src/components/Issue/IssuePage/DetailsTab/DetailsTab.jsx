import { useState, useEffect } from 'react'
import { Box, Typography, Fade, Slide } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { OS_LABEL, AVATAR_GRADIENTS } from '~/constants'
import { PriorityIcon } from '~/components/Icon/PriorityIcon/PriorityIcon'
import { TypeIcon } from '~/components/Icon/TypeIcon/TypeIcon'
import { OsIcon } from '~/components/Icon/OsIcon/OsIcon'
import { styles } from './DetailsTab.styles'
import { getStyle, cx } from '~/hooks/useStyles'

const STATUS_STYLE = {
  reported: 'details-tab__status--reported',
  in_progress: 'details-tab__status--in_progress',
  completed: 'details-tab__status--completed',
  wont_fix: 'details-tab__status--wont_fix',
}

const STATUS_LABEL = {
  reported: 'Reported',
  in_progress: 'In Progress',
  completed: 'Completed',
  wont_fix: "Won't Fix",
}

export const DetailsTab = ({ issue }) => {
  const {
    status = '',
    type,
    priority,
    category,
    version,
    description = '',
    author = {},
    operating_systems: operatingSystems = [],
    created_at: createdAt,
    is_visitor_issue: isVisitor,
    upvotes = 0,
  } = issue || {}
  const { username = '', avatar_url: avatarUrl } = author || {}

  const [mounted, setMounted] = useState(false)
  const [sidebarLanded, setSidebarLanded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const handleSidebarEntered = () => {
    setSidebarLanded(true)
  }

  // Build sidebar fields as an array for staggered fade
  const fields = []

  fields.push(
    <Box key='status' sx={getStyle(styles, 'details-tab__field')}>
      <Typography sx={getStyle(styles, 'details-tab__label')}>Status</Typography>
      <Box sx={cx(styles, 'details-tab__status', STATUS_STYLE[status])}>
        {STATUS_LABEL[status] || status}
      </Box>
    </Box>
  )

  fields.push(
    <Box key='type' sx={getStyle(styles, 'details-tab__field')}>
      <Typography sx={getStyle(styles, 'details-tab__label')}>Type</Typography>
      <Box sx={getStyle(styles, 'details-tab__val-row')}>
        <TypeIcon type={type} size={14} />
        <Typography sx={getStyle(styles, 'details-tab__val')}>{type}</Typography>
      </Box>
    </Box>
  )

  fields.push(
    <Box key='priority' sx={getStyle(styles, 'details-tab__field')}>
      <Typography sx={getStyle(styles, 'details-tab__label')}>Priority</Typography>
      <Box sx={getStyle(styles, 'details-tab__val-row')}>
        <PriorityIcon priority={priority} size={14} />
        <Typography sx={getStyle(styles, 'details-tab__val')}>{priority}</Typography>
      </Box>
    </Box>
  )

  fields.push(
    <Box key='category' sx={getStyle(styles, 'details-tab__field')}>
      <Typography sx={getStyle(styles, 'details-tab__label')}>Category</Typography>
      <Typography sx={getStyle(styles, 'details-tab__val')}>{category}</Typography>
    </Box>
  )

  if (version) {
    fields.push(
      <Box key='version' sx={getStyle(styles, 'details-tab__field')}>
        <Typography sx={getStyle(styles, 'details-tab__label')}>Version</Typography>
        <Typography sx={cx(styles, 'details-tab__val', 'details-tab__val--mono')}>{version}</Typography>
      </Box>
    )
  }

  fields.push(
    <Box key='author' sx={getStyle(styles, 'details-tab__field')}>
      <Typography sx={getStyle(styles, 'details-tab__label')}>Author</Typography>
      <Box sx={getStyle(styles, 'details-tab__author')}>
        <Box sx={{ ...cx(styles, 'details-tab__author-av'), ...(!avatarUrl ? { background: AVATAR_GRADIENTS[0] } : {}) }}>
          {avatarUrl ? (
            <Box component='img' src={avatarUrl} alt={username} sx={getStyle(styles, 'details-tab__author-av-img')} />
          ) : (
            (username || '?')[0]
          )}
        </Box>
        <Typography sx={getStyle(styles, 'details-tab__val')}>{username}</Typography>
        {isVisitor && <Box sx={getStyle(styles, 'details-tab__visitor-badge')}>Visitor</Box>}
      </Box>
    </Box>
  )

  if (operatingSystems.length > 0) {
    fields.push(
      <Box key='os' sx={getStyle(styles, 'details-tab__field')}>
        <Typography sx={getStyle(styles, 'details-tab__label')}>Platform</Typography>
        <Box sx={getStyle(styles, 'details-tab__os-list')}>
          {operatingSystems.map((os) => (
            <Box key={os} sx={getStyle(styles, 'details-tab__os-chip')}>
              <OsIcon os={os} size={12} />
              {OS_LABEL[os] || os}
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  fields.push(
    <Box key='upvotes' sx={getStyle(styles, 'details-tab__field')}>
      <Typography sx={getStyle(styles, 'details-tab__label')}>Upvotes</Typography>
      <Box sx={getStyle(styles, 'details-tab__val-row')}>
        <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: 12, color: '#22c55e' }} />
        <Typography sx={getStyle(styles, 'details-tab__val')}>{upvotes}</Typography>
      </Box>
    </Box>
  )

  if (createdAt) {
    fields.push(
      <Box key='created' sx={getStyle(styles, 'details-tab__field')}>
        <Typography sx={getStyle(styles, 'details-tab__label')}>Created</Typography>
        <Typography sx={cx(styles, 'details-tab__val', 'details-tab__val--mono')}>
          {new Date(createdAt).toLocaleDateString()}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={getStyle(styles, 'details-tab')}>
      {/* Rich text body — fade in */}
      <Fade in={mounted} timeout={500}>
        <Box sx={getStyle(styles, 'details-tab__main')}>
          <Box sx={getStyle(styles, 'details-tab__body-label')}>Description</Box>
          {description ? (
            <Box sx={getStyle(styles, 'details-tab__body')}>
              <Typography sx={getStyle(styles, 'details-tab__body-text')}>{description}</Typography>
            </Box>
          ) : (
            <Box sx={getStyle(styles, 'details-tab__empty')}>No description provided.</Box>
          )}
        </Box>
      </Fade>

      {/* Meta sidebar — slide in from right, then stagger-fade fields */}
      <Slide direction='left' in={mounted} timeout={400} onEntered={handleSidebarEntered}>
        <Box sx={getStyle(styles, 'details-tab__sidebar')}>
          {fields.map((field, i) => (
            <Fade key={field.key} in={sidebarLanded} timeout={300 + i * 100}>
              {field}
            </Fade>
          ))}
        </Box>
      </Slide>
    </Box>
  )
}
