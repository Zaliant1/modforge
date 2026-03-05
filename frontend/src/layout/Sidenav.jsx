import { Box, Typography } from '@mui/material'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useProject } from '~/hooks/useProject'
import { useAuth } from '~/hooks/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHexagonNodes, faTableColumns, faTag, faClockRotateLeft, faLayerGroup, faCompass, faPen, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { styles } from './Sidenav.styles'
import { useStyles } from '~/hooks/useStyles'

export default function Sidenav() {
  const { project, projects = [] } = useProject() || {}
  const { user } = useAuth() || {}
  const { id } = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  if (!project) return null

  const {
    name = '',
    picture,
    version,
    categories = [],
  } = project || {}

  const { username = '', avatar_url: avatarUrl, role: userRole } = user || {}

  const isOverview = pathname === `/forge/projects/${id}`
  const isKanban = categories.some((category) => pathname.includes(`/forge/projects/${id}/${category}`))
  const isSettings = pathname.includes('/settings')
  const isRequests = pathname.includes('/requests')

  const navItem = (label, icon, active, onClick, badge) => (
    <Box
      sx={useStyles(styles, active ? 'sn__item--active' : 'sn__item')}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} style={useStyles(styles, active ? 'sn__icon--active' : 'sn__icon')} />
      {label}
      {badge && (
        <Box sx={{ ...useStyles(styles, 'sn__badge'), ...useStyles(styles, badge.variant || 'sn__badge--default') }}>
          {badge.count}
        </Box>
      )}
    </Box>
  )

  return (
    <Box sx={useStyles(styles, 'sidenav')}>
      {/* Project switcher */}
      <Box sx={useStyles(styles, 'sn__project')}>
        <Box sx={useStyles(styles, 'sn__proj-thumb')}>
          {picture ? (
            <Box component='img' src={picture} alt={name} sx={useStyles(styles, 'sn__proj-thumb-img')} />
          ) : (
            (name || '?')[0]
          )}
        </Box>
        <Box sx={useStyles(styles, 'sn__proj-info')}>
          <Typography sx={useStyles(styles, 'sn__proj-name')}>{name}</Typography>
          <Typography sx={useStyles(styles, 'sn__proj-ver')}>
            {version ? `v${version}` : ''} {'\u00B7'} CURRENT
          </Typography>
        </Box>
        <Box sx={useStyles(styles, 'sn__chevron')}>
          <FontAwesomeIcon icon={faChevronDown} />
        </Box>
      </Box>

      {/* Nav */}
      <Box sx={useStyles(styles, 'sn__nav')}>
        <Typography sx={useStyles(styles, 'sn__section')}>Project</Typography>
        {navItem('Overview', faHexagonNodes, isOverview, () => navigate(`/forge/projects/${id}`))}
        {navItem('Kanban', faTableColumns, isKanban, () => {
          const firstCategory = categories[0] || ''
          if (firstCategory) navigate(`/forge/projects/${id}/${firstCategory}`)
        })}
        {navItem('Releases', faTag, false, () => navigate(`/forge/projects/${id}/releases`))}
        {navItem('Activity', faClockRotateLeft, false, () => navigate(`/forge/projects/${id}/activity`))}

        <Box sx={useStyles(styles, 'sn__divider')} />
        <Typography sx={useStyles(styles, 'sn__section')}>Workspace</Typography>
        {navItem('All Projects', faLayerGroup, false, () => navigate('/forge'), { count: projects.length, variant: 'sn__badge--default' })}
        {navItem('Discover', faCompass, false, () => navigate('/mod'))}
        {navItem('Blog', faPen, false, () => navigate('/blogs'))}
      </Box>

      {/* Footer */}
      <Box sx={useStyles(styles, 'sn__footer')}>
        <Box sx={useStyles(styles, 'sn__user')}>
          <Box sx={useStyles(styles, 'sn__user-av')}>
            {avatarUrl ? (
              <Box component='img' src={avatarUrl} alt={username} sx={useStyles(styles, 'sn__user-av-img')} />
            ) : (
              (username || '?')[0]
            )}
          </Box>
          <Box>
            <Typography sx={useStyles(styles, 'sn__user-name')}>{username}</Typography>
            <Typography sx={useStyles(styles, 'sn__user-role')}>{userRole || 'Member'}</Typography>
          </Box>
          <Box sx={useStyles(styles, 'sn__user-arrow')}>
            <FontAwesomeIcon icon={faChevronDown} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
