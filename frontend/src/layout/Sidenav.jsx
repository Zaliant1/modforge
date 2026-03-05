import { Box, Typography } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useProject } from '~/hooks/useProject'
import { useAuth } from '~/hooks/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHexagonNodes, faTableColumns, faTag, faClockRotateLeft, faLayerGroup, faCompass, faPen, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { CATEGORY_COLORS, GAME_ICONS } from '~/constants'
import { styles } from './Sidenav.styles'
import { useStyles } from '~/hooks/useStyles'

export default function Sidenav() {
  const { project, projects = [] } = useProject() || {}
  const { user } = useAuth() || {}
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const {
    game = '',
    categories = [],
    category_stats: categoryStats = {},
    open_issues: openIssues,
  } = project || {}

  const { color: gameColor } = GAME_ICONS[game] || GAME_ICONS._default

  const { username = '', avatar_url: avatarUrl, role: userRole } = user || {}

  const isForge = pathname.startsWith('/forge')
  const isMod = pathname.startsWith('/mod')

  const projectMatch = pathname.match(/^\/forge\/projects\/([^/]+)/)
  const projectId = projectMatch ? projectMatch[1] : null
  const isProject = Boolean(projectId)
  const isOverview = pathname === `/forge/projects/${projectId}`
  const isKanban = pathname.includes(`/forge/projects/${projectId}/kanban`)

  const totalOpenIssues = openIssues || categories.reduce((sum, category) => {
    const catName = typeof category === 'string' ? category : (category || {}).name || ''
    const { total = 0, completed = 0, wont_fix: wontFix = 0 } = categoryStats[catName] || {}
    return sum + (total - completed - wontFix)
  }, 0)

  const NavItem = ({ label, icon, active, onClick, badge }) => {
    const { count, variant = 'sn__badge--default' } = badge || {}
    return (
      <Box
        sx={useStyles(styles, active ? 'sn__item--active' : 'sn__item')}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={icon} style={useStyles(styles, active ? 'sn__icon--active' : 'sn__icon')} />
        {label}
        {badge && (
          <Box sx={{ ...useStyles(styles, 'sn__badge'), ...useStyles(styles, variant) }}>
            {count}
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box sx={useStyles(styles, 'sidenav')}>
      {/* Game color wash */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '280px', background: `linear-gradient(to bottom, ${gameColor}12 0%, transparent 100%)`, pointerEvents: 'none', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: `linear-gradient(to top, ${gameColor}0a 0%, transparent 60%)`, pointerEvents: 'none', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, ${gameColor}30 0%, transparent 80%)`, pointerEvents: 'none', zIndex: 2 }} />
      {/* Nav */}
      <Box sx={useStyles(styles, 'sn__nav')}>
        {isProject && (
          <>
            <Typography sx={useStyles(styles, 'sn__section')}>Project</Typography>
            <NavItem label='Overview' icon={faHexagonNodes} active={isOverview} onClick={() => navigate(`/forge/projects/${projectId}`)} />
            <NavItem label='Kanban' icon={faTableColumns} active={isKanban} onClick={() => navigate(`/forge/projects/${projectId}/kanban`)} badge={{ count: totalOpenIssues, variant: 'sn__badge--red' }} />
            <NavItem label='Releases' icon={faTag} active={false} onClick={() => navigate(`/forge/projects/${projectId}/releases`)} />
            <NavItem label='Activity' icon={faClockRotateLeft} active={false} onClick={() => navigate(`/forge/projects/${projectId}/activity`)} />
          </>
        )}

        {/* Categories — only visible on kanban */}
        {isKanban && categories.length > 0 && (
          <>
            <Box sx={useStyles(styles, 'sn__divider')} />
            <Typography sx={useStyles(styles, 'sn__section')}>Categories</Typography>
            {categories.map((category, index) => {
              const catName = typeof category === 'string' ? category : (category || {}).name || ''
              const catColor = CATEGORY_COLORS[index % CATEGORY_COLORS.length]
              const { total = 0 } = categoryStats[catName] || {}
              const isCatActive = pathname === `/forge/projects/${projectId}/kanban/${catName}`
              return (
                <Box
                  key={catName}
                  sx={useStyles(styles, isCatActive ? 'sn__cat-item--active' : 'sn__cat-item')}
                  onClick={() => navigate(`/forge/projects/${projectId}/kanban/${catName}`)}
                >
                  <Box sx={{ ...useStyles(styles, 'sn__cat-dot'), bgcolor: catColor }} />
                  {catName}
                  <Box component='span' sx={useStyles(styles, 'sn__cat-count')}>{total}</Box>
                </Box>
              )
            })}
          </>
        )}

        {isProject && <Box sx={useStyles(styles, 'sn__divider')} />}
        <Typography sx={useStyles(styles, 'sn__section')}>Workspace</Typography>
        {isForge && <NavItem label='All Projects' icon={faLayerGroup} active={pathname === '/forge'} onClick={() => navigate('/forge')} badge={{ count: projects.length, variant: 'sn__badge--default' }} />}
        {isMod && <NavItem label='Browse Mods' icon={faCompass} active={pathname === '/mod'} onClick={() => navigate('/mod')} />}
        <NavItem label={isForge ? 'Discover' : 'Forge'} icon={isForge ? faCompass : faLayerGroup} active={false} onClick={() => navigate(isForge ? '/mod' : '/forge')} />
        <NavItem label='Blog' icon={faPen} active={false} onClick={() => navigate('/blogs')} />
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
