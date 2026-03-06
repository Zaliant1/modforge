import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom'
import { Header } from './Header'
import Sidenav from './Sidenav'
import { useProject } from '~/hooks/useProject'
import { useAuth } from '~/hooks/useAuth'
import { isMaintainer, isMember } from '~/utils/permissions'
import { getProjectStats } from '~/api/stats'
import { GAME_ICONS } from '~/constants'
import { styles } from './Main.styles'
import { getStyle, cx } from '~/hooks/useStyles'

const formatNum = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return String(num)
}

export default function Main() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { project } = useProject() || {}
  const { user } = useAuth() || {}
  const [stats, setStats] = useState({})

  useEffect(() => {
    if (!id) return
    getProjectStats(id).then((data) => setStats(data || {}))
  }, [id])

  const { name = '', game = '', user_role: userRole } = project || {}
  const { color: gameColor } = GAME_ICONS[game] || GAME_ICONS._default
  const washColor = gameColor
  const { username = '' } = user || {}
  const canManage = isMaintainer(userRole)
  const isProjectMember = isMember(userRole)
  const isKanban = pathname.includes(`/forge/projects/${id}/kanban`)
  const isIssue = pathname.includes(`/forge/projects/${id}/issues/`)

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
    <Box sx={getStyle(styles, 'main')}>
      <Box sx={getStyle(styles, 'main__header')}>
        <Header mode='forge' />
      </Box>
      <Sidenav />
      <Box sx={getStyle(styles, 'main__content')}>
        {/* Game color wash — fixed to viewport, not scrollable */}
        <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '280px', background: `linear-gradient(to bottom, ${washColor}${isKanban ? '10' : '18'} 0%, ${washColor}${isKanban ? '05' : '08'} 40%, transparent 100%)` }} />
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: `linear-gradient(to top, ${washColor}${isKanban ? '08' : '10'} 0%, transparent 60%)` }} />
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, ${washColor}40 0%, ${washColor}15 40%, transparent 80%)`, zIndex: 2 }} />
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '280px', background: `linear-gradient(to bottom, ${washColor}40 0%, ${washColor}15 40%, transparent 100%)`, zIndex: 2 }} />
        </Box>
        <Box sx={getStyle(styles, 'main__scroll')}>
          {!isKanban && !isIssue && (
            <>
              {/* Topbar */}
              <Box sx={getStyle(styles, 'main__topbar')}>
                <Box sx={getStyle(styles, 'main__breadcrumb')}>
                  <Typography component='span'>{username}</Typography>
                  <Typography component='span' sx={getStyle(styles, 'main__bc-sep')}>/</Typography>
                  <Typography component='span' sx={getStyle(styles, 'main__bc-active')}>{name}</Typography>
                </Box>
                <Box sx={getStyle(styles, 'main__topbar-actions')}>
                  {!isProjectMember && (
                    <Box component='button' sx={getStyle(styles, 'main__btn-ghost')} onClick={() => navigate(`/forge/projects/${id}/join`)}>
                      Join Project
                    </Box>
                  )}
                  {canManage && (
                    <Box component='button' sx={getStyle(styles, 'main__btn-ghost')} onClick={() => navigate(`/forge/projects/${id}/settings`)}>
                      Settings
                    </Box>
                  )}
                  <Box
                    component='button'
                    sx={getStyle(styles, 'main__btn-accent')}
                    onClick={() => navigate(`/forge/projects/${id}/issues/new`)}
                  >
                    + New Issue
                  </Box>
                </Box>
              </Box>

              {/* Metrics */}
              <Box sx={getStyle(styles, 'main__metrics')}>
                <Box sx={getStyle(styles, 'main__metric')}>
                  <Typography sx={getStyle(styles, 'main__metric-label')}>Downloads</Typography>
                  <Typography sx={getStyle(styles, 'main__metric-num')}>{formatNum(downloads)}</Typography>
                  <Typography sx={getStyle(styles, 'main__metric-delta')}>{'\u2191'} +{formatNum(downloadsWeek)} this week</Typography>
                </Box>
                <Box sx={getStyle(styles, 'main__metric')}>
                  <Typography sx={getStyle(styles, 'main__metric-label')}>Open Issues</Typography>
                  <Typography sx={cx(styles, 'main__metric-num', 'main__metric-num--red')}>{openIssues}</Typography>
                  <Typography sx={cx(styles, openIssuesToday > 0 ? 'main__metric-delta--neg' : 'main__metric-delta--neu')}>{'\u2191'} {openIssuesToday} new today</Typography>
                </Box>
                <Box sx={getStyle(styles, 'main__metric')}>
                  <Typography sx={getStyle(styles, 'main__metric-label')}>Bugs Closed</Typography>
                  <Typography sx={cx(styles, 'main__metric-num', 'main__metric-num--green')}>{bugsClosed}</Typography>
                  <Typography sx={getStyle(styles, 'main__metric-delta')}>{Math.round(closeRate * 100)}% closed</Typography>
                </Box>
                <Box sx={getStyle(styles, 'main__metric')}>
                  <Typography sx={getStyle(styles, 'main__metric-label')}>Avg Rating</Typography>
                  <Typography sx={cx(styles, 'main__metric-num', 'main__metric-num--accent')}>{avgRating}{'\u2605'}</Typography>
                  <Typography sx={cx(styles, 'main__metric-delta--neu')}>{ratingCount} reviews</Typography>
                </Box>
              </Box>
            </>
          )}

          {/* Page content */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
