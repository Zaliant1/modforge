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
import { getStyle, cx } from '~/hooks/useStyles'
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
    reported_issues: reportedIssues = 0,
    in_progress_issues: inProgressIssues = 0,
    bugs_closed: bugsClosed = 0,
    close_rate: closeRate = 0,
    avg_rating: avgRating = 0,
    rating_count: ratingCount = 0,
    total_categories: totalCategories = 0,
  } = stats || {}

  const isGame = Boolean(activeGame)

  const animDownloads = useCountUp(downloads)
  const animDownloadsWeek = useCountUp(downloadsWeek)
  const animOpenIssues = useCountUp(openIssues)
  const animOpenIssuesToday = useCountUp(openIssuesToday)
  const animReportedIssues = useCountUp(reportedIssues)
  const animInProgressIssues = useCountUp(inProgressIssues)
  const animBugsClosed = useCountUp(bugsClosed)
  const animCloseRate = useCountUp(closeRate)
  const animAvgRating = useCountUp(avgRating)
  const animRatingCount = useCountUp(ratingCount)
  const animTotalCategories = useCountUp(totalCategories)

  return (
    <Box sx={getStyle(styles, 'forge-main')}>
      {/* Game color wash — fixed to container, not scrollable */}
      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '280px', background: `linear-gradient(to bottom, ${gameColor}18 0%, ${gameColor}08 40%, transparent 100%)` }} />
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: `linear-gradient(to top, ${gameColor}10 0%, transparent 60%)` }} />
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, ${gameColor}40 0%, ${gameColor}15 40%, transparent 80%)`, zIndex: 2 }} />
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '280px', background: `linear-gradient(to bottom, ${gameColor}40 0%, ${gameColor}15 40%, transparent 100%)`, zIndex: 2 }} />
      </Box>
      <Box sx={getStyle(styles, 'forge-scroll')}>
        {/* Topbar */}
        <Box sx={getStyle(styles, 'forge-topbar')}>
          <Box sx={getStyle(styles, 'ftb-crumb')}>
            <Box component='span'>{username || 'Guest'}</Box>
            <Box component='span' sx={getStyle(styles, 'ftb-sep')}>/</Box>
            <Box component='span' sx={getStyle(styles, 'ftb-active')}>{activeName}</Box>
          </Box>
          <Box sx={getStyle(styles, 'ftb-right')}>
            <Box component='button' sx={getStyle(styles, 'sm-btn')}>Filter {'\u2304'}</Box>
            <Box
              component='button'
              sx={getStyle(styles, 'btn-accent')}
              onClick={() => activeId && navigate(`/forge/projects/${activeId}/issues/new`)}
            >
              <FontAwesomeIcon icon={faPlus} /> New Issue
            </Box>
          </Box>
        </Box>

        {/* Metrics */}
        <Box sx={getStyle(styles, 'metric-strip')}>
          {isGame ? (
            <>
              <Box sx={getStyle(styles, 'metric-cell')}>
                <Typography sx={getStyle(styles, 'metric-label')}>Downloads</Typography>
                <Typography sx={getStyle(styles, 'metric-num')}>{formatNum(animDownloads)}</Typography>
                <Typography sx={getStyle(styles, 'metric-delta')}>{'\u2191'} +{formatNum(animDownloadsWeek)} this week</Typography>
              </Box>
              <Box sx={getStyle(styles, 'metric-cell')}>
                <Typography sx={getStyle(styles, 'metric-label')}>Open Issues</Typography>
                <Typography sx={cx(styles, 'metric-num', 'metric-num--red')}>{animOpenIssues}</Typography>
                <Typography sx={cx(styles, openIssuesToday > 0 ? 'metric-delta--neg' : 'metric-delta--neu')}>{'\u2191'} {animOpenIssuesToday} new today</Typography>
              </Box>
              <Box sx={getStyle(styles, 'metric-cell')}>
                <Typography sx={getStyle(styles, 'metric-label')}>Bugs Closed</Typography>
                <Typography sx={cx(styles, 'metric-num', 'metric-num--green')}>{animBugsClosed}</Typography>
                <Typography sx={getStyle(styles, 'metric-delta')}>{Math.round(animCloseRate * 100)}% closed</Typography>
              </Box>
              <Box sx={getStyle(styles, 'metric-cell')}>
                <Typography sx={getStyle(styles, 'metric-label')}>Avg Rating</Typography>
                <Typography sx={cx(styles, 'metric-num', 'metric-num--accent')}>{animAvgRating}{'\u2605'}</Typography>
                <Typography sx={getStyle(styles, 'metric-delta--neu')}>{animRatingCount} reviews</Typography>
              </Box>
            </>
          ) : (
            <>
              <Box sx={getStyle(styles, 'metric-cell')}>
                <Typography sx={getStyle(styles, 'metric-label')}>Reported</Typography>
                <Typography sx={cx(styles, 'metric-num', 'metric-num--red')}>{animReportedIssues}</Typography>
                <Typography sx={cx(styles, openIssuesToday > 0 ? 'metric-delta--neg' : 'metric-delta--neu')}>{'\u2191'} {animOpenIssuesToday} new today</Typography>
              </Box>
              <Box sx={getStyle(styles, 'metric-cell')}>
                <Typography sx={getStyle(styles, 'metric-label')}>In Progress</Typography>
                <Typography sx={cx(styles, 'metric-num', 'metric-num--accent')}>{animInProgressIssues}</Typography>
                <Typography sx={getStyle(styles, 'metric-delta--neu')}>{animOpenIssues} total open</Typography>
              </Box>
              <Box sx={getStyle(styles, 'metric-cell')}>
                <Typography sx={getStyle(styles, 'metric-label')}>Bugs Closed</Typography>
                <Typography sx={cx(styles, 'metric-num', 'metric-num--green')}>{animBugsClosed}</Typography>
                <Typography sx={getStyle(styles, 'metric-delta')}>{Math.round(animCloseRate * 100)}% closed</Typography>
              </Box>
              <Box sx={getStyle(styles, 'metric-cell')}>
                <Typography sx={getStyle(styles, 'metric-label')}>Categories</Typography>
                <Typography sx={getStyle(styles, 'metric-num')}>{animTotalCategories}</Typography>
                <Typography sx={getStyle(styles, 'metric-delta--neu')}>{animOpenIssues} open across all</Typography>
              </Box>
            </>
          )}
        </Box>

        {/* Content */}
        <Box sx={getStyle(styles, 'forge-content')}>
          {/* Projects column */}
          <Box sx={getStyle(styles, 'proj-col')}>
            <Box sx={getStyle(styles, 'proj-col-head')}>
              <Box sx={getStyle(styles, 'proj-col-title')}>
                My Projects <Box component='span' sx={getStyle(styles, 'proj-count')}>{projects.length}</Box>
              </Box>
            </Box>
            <Box sx={getStyle(styles, 'filter-pills')}>
              {['All', 'Public', 'Private'].map((filter) => (
                <Box
                  key={filter}
                  component='button'
                  sx={cx(styles, 'fpill', filter === activeFilter && 'fpill--active')}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </Box>
              ))}
            </Box>
            <Box sx={getStyle(styles, 'proj-list')}>
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
          <Box sx={getStyle(styles, 'right-panel')}>
            <Box>
              <Box sx={getStyle(styles, 'widget-hl')}>
                Recent Activity
                <Typography component='span' sx={getStyle(styles, 'widget-link')}>all {'\u2192'}</Typography>
              </Box>
              {activity.slice(0, 10).map((item) => {
                const { id: itemId, action = '', detail = '', created_at: createdAt = '' } = item || {}
                const dotColor = ACTIVITY_DOT_COLORS[action] || 'd-b'
                return (
                  <Box key={itemId} sx={getStyle(styles, 'act-item')}>
                    <Box sx={cx(styles, 'act-dot', dotColor)} />
                    <Box>
                      <Typography sx={getStyle(styles, 'act-txt')}>{detail}</Typography>
                      <Typography sx={getStyle(styles, 'act-time')}>{relativeTime(createdAt)}</Typography>
                    </Box>
                  </Box>
                )
              })}
              {activity.length === 0 && (
                <Typography sx={getStyle(styles, 'act-txt')}>No recent activity</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
