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
import { ACTIVITY_DOT_COLORS, GAME_ICONS } from '~/constants'
import { relativeTime } from '~/utils/time'
import { styles } from './ForgeView.styles'
import { useStyles } from '~/hooks/useStyles'
import { useCountUp } from '~/hooks/useCountUp'

const formatNum = (num) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return String(num)
}

export const ForgeView = () => {
  const { user } = useAuth() || {}
  const { username } = user || {}
  const { projects = [], setProject } = useProjects() || {}
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)
  const [stats, setStats] = useState({})
  const [activity, setActivity] = useState([])

  const firstProject = projects[0] || null
  const activeProject = selectedProject || firstProject

  useEffect(() => {
    if (!activeProject) return
    if (setProject) setProject(activeProject)
    const { id: projectId } = activeProject || {}
    getProjectStats(projectId).then(setStats).catch(() => {})
    getProjectActivity(projectId).then(setActivity).catch(() => {})
  }, [activeProject])

  const {
    id: activeId,
    name: activeName = '',
    game: activeGame = '',
  } = activeProject || {}

  const { color: gameColor } = GAME_ICONS[activeGame] || GAME_ICONS._default

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

  const animDownloads = useCountUp(downloads)
  const animDownloadsWeek = useCountUp(downloadsWeek)
  const animOpenIssues = useCountUp(openIssues)
  const animOpenIssuesToday = useCountUp(openIssuesToday)
  const animBugsClosed = useCountUp(bugsClosed)
  const animCloseRate = useCountUp(closeRate)
  const animAvgRating = useCountUp(avgRating)
  const animRatingCount = useCountUp(ratingCount)

  return (
    <Box sx={useStyles(styles, 'forge-main')}>
      {/* Game color wash */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '280px', background: `linear-gradient(to bottom, ${gameColor}18 0%, ${gameColor}08 40%, transparent 100%)`, pointerEvents: 'none', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: `linear-gradient(to top, ${gameColor}10 0%, transparent 60%)`, pointerEvents: 'none', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, ${gameColor}40 0%, ${gameColor}15 40%, transparent 80%)`, pointerEvents: 'none', zIndex: 2 }} />
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '280px', background: `linear-gradient(to bottom, ${gameColor}40 0%, ${gameColor}15 40%, transparent 100%)`, pointerEvents: 'none', zIndex: 2 }} />
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
            <Typography sx={useStyles(styles, 'metric-num')}>{formatNum(animDownloads)}</Typography>
            <Typography sx={useStyles(styles, 'metric-delta')}>{'\u2191'} +{formatNum(animDownloadsWeek)} this week</Typography>
          </Box>
          <Box sx={useStyles(styles, 'metric-cell')}>
            <Typography sx={useStyles(styles, 'metric-label')}>Open Issues</Typography>
            <Typography sx={{ ...useStyles(styles, 'metric-num'), ...useStyles(styles, 'metric-num--red') }}>{animOpenIssues}</Typography>
            <Typography sx={useStyles(styles, openIssuesToday > 0 ? 'metric-delta--neg' : 'metric-delta--neu')}>{'\u2191'} {animOpenIssuesToday} new today</Typography>
          </Box>
          <Box sx={useStyles(styles, 'metric-cell')}>
            <Typography sx={useStyles(styles, 'metric-label')}>Bugs Closed</Typography>
            <Typography sx={{ ...useStyles(styles, 'metric-num'), ...useStyles(styles, 'metric-num--green') }}>{animBugsClosed}</Typography>
            <Typography sx={useStyles(styles, 'metric-delta')}>{Math.round(animCloseRate * 100)}% closed</Typography>
          </Box>
          <Box sx={useStyles(styles, 'metric-cell')}>
            <Typography sx={useStyles(styles, 'metric-label')}>Avg Rating</Typography>
            <Typography sx={{ ...useStyles(styles, 'metric-num'), ...useStyles(styles, 'metric-num--accent') }}>{animAvgRating}{'\u2605'}</Typography>
            <Typography sx={useStyles(styles, 'metric-delta--neu')}>{animRatingCount} reviews</Typography>
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
  )
}
