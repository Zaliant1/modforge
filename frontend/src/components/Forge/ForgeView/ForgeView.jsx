import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~/hooks/useAuth'
import { useProjects } from '~/context/ProjectsContext'
import { getProjectStats } from '~/api/stats'
import { getProjectActivity } from '~/api/activity'
import { ForgeProjectCard } from '~/components/Forge/ForgeProjectCard/ForgeProjectCard'
import { ACTIVITY_DOT_COLORS } from '~/constants'
import { relativeTime } from '~/utils/time'
import { styles } from './ForgeView.styles'
import { useStyles } from '~/hooks/useStyles'

const formatNum = (num) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return String(num)
}

export const ForgeView = () => {
  const { user } = useAuth() || {}
  const { username } = user || {}
  const { projects = [] } = useProjects() || {}
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)
  const [stats, setStats] = useState({})
  const [activity, setActivity] = useState([])

  const firstProject = projects[0] || null
  const activeProject = selectedProject || firstProject

  useEffect(() => {
    if (!activeProject) return
    const { id: projectId } = activeProject || {}
    getProjectStats(projectId).then(setStats).catch(() => {})
    getProjectActivity(projectId).then(setActivity).catch(() => {})
  }, [activeProject])

  const {
    id: activeId,
    name: activeName = '',
    version: activeVersion = '',
  } = activeProject || {}

  const {
    downloads = 0,
    downloads_week: downloadsWeek = 0,
    open_issues: openIssues = 0,
    open_issues_today: openIssuesToday = 0,
    bugs_closed: bugsClosed = 0,
    close_rate: closeRate = 0,
    avg_rating: avgRating = 0,
    rating_count: ratingCount = 0,
  } = stats || {}

  return (
    <Box sx={useStyles(styles, 'forge-layout')}>
      {/* Sidebar */}
      <Box sx={useStyles(styles, 'forge-sidebar')}>
        <Box sx={useStyles(styles, 'fsb-project')} onClick={() => activeId && navigate(`/forge/projects/${activeId}`)}>
          <Box sx={useStyles(styles, 'fsb-proj-img')}>
            {(activeName || '?')[0]}
          </Box>
          <Box>
            <Typography sx={useStyles(styles, 'fsb-proj-name')}>{activeName}</Typography>
            <Typography sx={useStyles(styles, 'fsb-proj-sub')}>v{activeVersion} {'\u00B7'} CURRENT</Typography>
          </Box>
          <Box sx={useStyles(styles, 'fsb-chevron')}>{'\u2304'}</Box>
        </Box>
        <Box sx={useStyles(styles, 'fsb-nav')}>
          <Typography sx={useStyles(styles, 'fsb-label')}>Project</Typography>
          <Box sx={useStyles(styles, 'fsb-item--active')}>
            <Box component='span' sx={useStyles(styles, 'fsb-icon--active')}>{'\u2B21'}</Box> Overview
          </Box>
          <Box sx={useStyles(styles, 'fsb-item')} onClick={() => activeId && navigate(`/forge/projects/${activeId}`)}>
            <Box component='span' sx={useStyles(styles, 'fsb-icon')}>{'\u229E'}</Box> Kanban
          </Box>
          <Box sx={useStyles(styles, 'fsb-item')}>
            <Box component='span' sx={useStyles(styles, 'fsb-icon')}>{'\u2B15'}</Box> Releases
          </Box>
          <Box sx={useStyles(styles, 'fsb-item')}>
            <Box component='span' sx={useStyles(styles, 'fsb-icon')}>{'\u21BB'}</Box> Activity
          </Box>
          <Box sx={useStyles(styles, 'fsb-divider')} />
          <Typography sx={useStyles(styles, 'fsb-label')}>Workspace</Typography>
          <Box sx={useStyles(styles, 'fsb-item')}>
            <Box component='span' sx={useStyles(styles, 'fsb-icon')}>{'\u2B21'}</Box> All Projects
            <Box component='span' sx={{ ...useStyles(styles, 'fsb-chip'), ...useStyles(styles, 'chip-def') }}>{projects.length}</Box>
          </Box>
          <Box sx={useStyles(styles, 'fsb-item')}>
            <Box component='span' sx={useStyles(styles, 'fsb-icon')}>{'\u25CE'}</Box> Discover
          </Box>
          <Box sx={useStyles(styles, 'fsb-item')}>
            <Box component='span' sx={useStyles(styles, 'fsb-icon')}>{'\u25C7'}</Box> Blog
          </Box>
        </Box>
        <Box sx={useStyles(styles, 'fsb-footer')}>
          <Box sx={useStyles(styles, 'fsb-user')}>
            <Box sx={useStyles(styles, 'fsb-uav')}>{(username || 'G')[0]}</Box>
            <Box>
              <Typography sx={useStyles(styles, 'fsb-uname')}>{username || 'Guest'}</Typography>
              <Typography sx={useStyles(styles, 'fsb-usub')}>Forge Master</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={useStyles(styles, 'forge-main')}>
        {/* Topbar */}
        <Box sx={useStyles(styles, 'forge-topbar')}>
          <Box sx={useStyles(styles, 'ftb-crumb')}>
            <Box component='span'>{username || 'Guest'}</Box>
            <Box component='span' sx={useStyles(styles, 'ftb-sep')}>/</Box>
            <Box component='span' sx={useStyles(styles, 'ftb-active')}>{activeName}</Box>
          </Box>
          <Box sx={useStyles(styles, 'ftb-right')}>
            <Box component='button' sx={useStyles(styles, 'sm-btn')}>Filter {'\u2304'}</Box>
            <Box
              component='button'
              sx={useStyles(styles, 'btn-accent')}
              onClick={() => activeId && navigate(`/forge/projects/${activeId}/issues/new`)}
            >
              <FontAwesomeIcon icon={faPlus} /> New Issue
            </Box>
          </Box>
        </Box>

        {/* Metrics */}
        <Box sx={useStyles(styles, 'metric-strip')}>
          <Box sx={useStyles(styles, 'metric-cell')}>
            <Typography sx={useStyles(styles, 'metric-label')}>Downloads</Typography>
            <Typography sx={useStyles(styles, 'metric-num')}>{formatNum(downloads)}</Typography>
            <Typography sx={useStyles(styles, 'metric-delta')}>{'\u2191'} +{formatNum(downloadsWeek)} this week</Typography>
          </Box>
          <Box sx={useStyles(styles, 'metric-cell')}>
            <Typography sx={useStyles(styles, 'metric-label')}>Open Issues</Typography>
            <Typography sx={{ ...useStyles(styles, 'metric-num'), ...useStyles(styles, 'metric-num--red') }}>{openIssues}</Typography>
            <Typography sx={useStyles(styles, openIssuesToday > 0 ? 'metric-delta--neg' : 'metric-delta--neu')}>{'\u2191'} {openIssuesToday} new today</Typography>
          </Box>
          <Box sx={useStyles(styles, 'metric-cell')}>
            <Typography sx={useStyles(styles, 'metric-label')}>Bugs Closed</Typography>
            <Typography sx={{ ...useStyles(styles, 'metric-num'), ...useStyles(styles, 'metric-num--green') }}>{bugsClosed}</Typography>
            <Typography sx={useStyles(styles, 'metric-delta')}>{Math.round(closeRate * 100)}% closed</Typography>
          </Box>
          <Box sx={useStyles(styles, 'metric-cell')}>
            <Typography sx={useStyles(styles, 'metric-label')}>Avg Rating</Typography>
            <Typography sx={{ ...useStyles(styles, 'metric-num'), ...useStyles(styles, 'metric-num--accent') }}>{avgRating}{'\u2605'}</Typography>
            <Typography sx={useStyles(styles, 'metric-delta--neu')}>{ratingCount} reviews</Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={useStyles(styles, 'forge-content')}>
          {/* Projects column */}
          <Box sx={useStyles(styles, 'proj-col')}>
            <Box sx={useStyles(styles, 'proj-col-head')}>
              <Box sx={useStyles(styles, 'proj-col-title')}>
                My Projects <Box component='span' sx={useStyles(styles, 'proj-count')}>{projects.length}</Box>
              </Box>
            </Box>
            <Box sx={useStyles(styles, 'filter-pills')}>
              {['All', 'Public', 'Private'].map((filter) => (
                <Box
                  key={filter}
                  component='button'
                  sx={useStyles(styles, filter === activeFilter ? 'fpill--active' : 'fpill')}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </Box>
              ))}
            </Box>
            <Box sx={useStyles(styles, 'proj-list')}>
              {projects
                .filter((project) => {
                  const { is_public: isPublic } = project || {}
                  if (activeFilter === 'Public') return isPublic
                  if (activeFilter === 'Private') return !isPublic
                  return true
                })
                .sort((a, b) => {
                  const { id: activeId } = activeProject || {}
                  if (a.id === activeId) return -1
                  if (b.id === activeId) return 1
                  return 0
                })
                .map((project) => {
                  const { id: projectId } = project || {}
                  return (
                    <ForgeProjectCard
                      key={projectId}
                      project={project}
                      selected={activeProject && activeProject.id === projectId}
                      onSelect={() => setSelectedProject(project)}
                    />
                  )
                })}
            </Box>
          </Box>

          {/* Activity panel */}
          <Box sx={useStyles(styles, 'right-panel')}>
            <Box>
              <Box sx={useStyles(styles, 'widget-hl')}>
                Recent Activity
                <Typography component='span' sx={useStyles(styles, 'widget-link')}>all {'\u2192'}</Typography>
              </Box>
              {activity.slice(0, 10).map((item) => {
                const { id: itemId, action = '', detail = '', created_at: createdAt = '' } = item || {}
                const dotColor = ACTIVITY_DOT_COLORS[action] || 'd-b'
                return (
                  <Box key={itemId} sx={useStyles(styles, 'act-item')}>
                    <Box sx={{ ...useStyles(styles, 'act-dot'), ...useStyles(styles, dotColor) }} />
                    <Box>
                      <Typography sx={useStyles(styles, 'act-txt')}>{detail}</Typography>
                      <Typography sx={useStyles(styles, 'act-time')}>{relativeTime(createdAt)}</Typography>
                    </Box>
                  </Box>
                )
              })}
              {activity.length === 0 && (
                <Typography sx={useStyles(styles, 'act-txt')}>No recent activity</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
