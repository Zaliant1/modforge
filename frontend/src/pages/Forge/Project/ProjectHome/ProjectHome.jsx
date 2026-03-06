import { useState, useEffect } from 'react'
import { Box, Typography, Fade, Slide } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useProject } from '~/hooks/useProject'
import { getProjectStats } from '~/api/stats'
import { getProjectActivity } from '~/api/activity'
import { relativeTime } from '~/utils/time'
import { ROLES, CATEGORY_COLORS, AVATAR_GRADIENTS, ROLE_STYLE_MAP, ROLE_LABEL_MAP } from '~/constants'
import { isMaintainer } from '~/utils/permissions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faDownload, faUsers, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { ActivityFeed } from '~/components/Common/ActivityFeed/ActivityFeed'
import { styles } from './ProjectHome.styles'
import { getStyle, cx } from '~/hooks/useStyles'
import { useCountUp } from '~/hooks/useCountUp'

const formatNumber = (number) => {
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`
  return String(number)
}

export default function ProjectHome() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { project } = useProject() || {}

  const [stats, setStats] = useState({})
  const [activity, setActivity] = useState([])

  useEffect(() => {
    if (!id) return
    getProjectStats(id).then((data) => setStats(data || {}))
    getProjectActivity(id).then((data) => setActivity(data || []))
  }, [id])

  const {
    picture,
    name = '',
    about = '',
    version,
    categories = [],
    members = [],
    category_stats: categoryStats = {},
    game,
    views = 0,
    user_role: userRole,
    is_public: isPublic,
    created_at: createdAt,
  } = project || {}

  const isGame = Boolean(game)

  const {
    downloads = 0,
    open_issues: openIssues = 0,
    close_rate: closeRate = 0,
    avg_rating: avgRating = 0,
    rating_count: ratingCount = 0,
  } = stats || {}

  const animatedViews = useCountUp(views)
  const animatedDownloads = useCountUp(downloads)
  const animatedMembers = useCountUp(members.length)
  const animatedOpenIssues = useCountUp(openIssues)
  const animatedAvgRating = useCountUp(avgRating)
  const animatedRatingCount = useCountUp(ratingCount)
  const animatedCloseRate = useCountUp(closeRate)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  if (!project) return null

  const canManage = isMaintainer(userRole)
  const owner = members.find((member) => {
    const { role } = member || {}
    return role === ROLES.OWNER
  })
  const { username: ownerName = '', avatar_url: ownerAvatar } = owner || {}

  return (
    <Box sx={getStyle(styles, 'pp')}>
      {/* Left column */}
      <Box sx={getStyle(styles, 'pp__left')}>

        {/* Top row: Hero + Activity Feed */}
        <Box sx={getStyle(styles, 'pp__top-row')}>
          {/* Hero card */}
          <Fade in={mounted} timeout={500}>
            <Box sx={getStyle(styles, 'pp-hero')}>
              <Box sx={getStyle(styles, 'pp-hero__banner')}>
                {picture && (
                  <Box component='img' src={picture} alt={name} sx={getStyle(styles, 'pp-hero__banner-img')} />
                )}
                <Box sx={getStyle(styles, 'pp-hero__banner-glow')} />
                <Box sx={getStyle(styles, 'pp-hero__banner-accent')} />
              </Box>
              <Box sx={getStyle(styles, 'pp-hero__body')}>
                <Box sx={getStyle(styles, 'pp-hero__title-row')}>
                  <Box sx={getStyle(styles, 'pp-hero__avatar')}>
                    {picture ? (
                      <Box component='img' src={picture} alt={name} sx={getStyle(styles, 'pp-hero__avatar-img')} />
                    ) : (
                      (name || '?')[0]
                    )}
                  </Box>
                  <Box sx={getStyle(styles, 'pp-hero__title-info')}>
                    <Typography sx={getStyle(styles, 'pp-hero__name')}>{name}</Typography>
                    <Box sx={getStyle(styles, 'pp-hero__meta-row')}>
                      {version && <Box sx={getStyle(styles, 'pp-hero__version-badge')}>v{version}</Box>}
                      <Box sx={cx(styles, 'pp-hero__status-pill', isPublic && 'pp-hero__status-pill--public', !isPublic && 'pp-hero__status-pill--private')}>
                        <Box sx={getStyle(styles, 'pp-hero__status-dot')} />
                        {isPublic ? 'Public' : 'Private'}
                      </Box>
                      <Box
                        component='button'
                        sx={getStyle(styles, 'pp-hero__history-button')}
                        onClick={() => navigate(`/forge/projects/${id}/changelog`)}
                      >
                        <FontAwesomeIcon icon={faClockRotateLeft} />
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box sx={getStyle(styles, 'pp-hero__owner-row')}>
                  <Box sx={getStyle(styles, 'pp-hero__owner-avatar')}>
                    {ownerAvatar ? (
                      <Box component='img' src={ownerAvatar} alt={ownerName} sx={getStyle(styles, 'pp-hero__owner-avatar-img')} />
                    ) : (
                      (ownerName || '?')[0]
                    )}
                  </Box>
                  <Typography sx={getStyle(styles, 'pp-hero__owner-name')}>{ownerName}</Typography>
                </Box>

                <Typography sx={getStyle(styles, 'pp-hero__description')}>{about}</Typography>

                <Box sx={getStyle(styles, 'pp-hero__stats-row')}>
                  <Box sx={getStyle(styles, 'pp-hero__stat')}>
                    <FontAwesomeIcon icon={faEye} style={getStyle(styles, 'pp-hero__stat-icon')} />
                    <Typography sx={getStyle(styles, 'pp-hero__stat-value')}>{formatNumber(animatedViews)}</Typography>
                    <Typography sx={getStyle(styles, 'pp-hero__stat-label')}>Views</Typography>
                  </Box>
                  {isGame && (
                    <Box sx={getStyle(styles, 'pp-hero__stat')}>
                      <FontAwesomeIcon icon={faDownload} style={getStyle(styles, 'pp-hero__stat-icon')} />
                      <Typography sx={getStyle(styles, 'pp-hero__stat-value')}>{formatNumber(animatedDownloads)}</Typography>
                      <Typography sx={getStyle(styles, 'pp-hero__stat-label')}>Downloads</Typography>
                    </Box>
                  )}
                  <Box sx={getStyle(styles, 'pp-hero__stat')}>
                    <FontAwesomeIcon icon={faUsers} style={getStyle(styles, 'pp-hero__stat-icon')} />
                    <Typography sx={getStyle(styles, 'pp-hero__stat-value')}>{animatedMembers}</Typography>
                    <Typography sx={getStyle(styles, 'pp-hero__stat-label')}>Members</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Fade>

          {/* Activity Feed */}
          <Fade in={mounted} timeout={500} style={{ transitionDelay: mounted ? '120ms' : '0ms' }}>
            <Box>
              <ActivityFeed activity={activity} limit={8} />
            </Box>
          </Fade>
        </Box>

        {/* Bottom row: Members + Categories */}
        <Box sx={getStyle(styles, 'pp__bottom-row')}>
          {/* Members */}
          <Fade in={mounted} timeout={500} style={{ transitionDelay: mounted ? '240ms' : '0ms' }}>
            <Box sx={getStyle(styles, 'pp-member__wrapper')}>
              <Box sx={getStyle(styles, 'pp-section__head')}>
                <Box sx={getStyle(styles, 'pp-section__title')}>
                  Members
                  <Box component='span' sx={getStyle(styles, 'pp-section__count')}>{members.length}</Box>
                  {canManage && (
                    <Box component='span' sx={getStyle(styles, 'pp-section__action')}>+ Invite</Box>
                  )}
                </Box>
              </Box>
              <Box sx={getStyle(styles, 'pp-member')}>
                <Box sx={getStyle(styles, 'pp-member__list')}>
                  {members.map((member, memberIndex) => {
                    const { discord_id: discordId, username = '', avatar_url: avatarUrl, role = '' } = member || {}
                    const avatarBackground = !avatarUrl ? AVATAR_GRADIENTS[memberIndex % AVATAR_GRADIENTS.length] : undefined
                    return (
                      <Box key={discordId} sx={getStyle(styles, 'pp-member__row')}>
                        <Box sx={{ ...getStyle(styles, 'pp-member__avatar'), ...(avatarBackground ? { background: avatarBackground } : {}) }}>
                          {avatarUrl ? (
                            <Box component='img' src={avatarUrl} alt={username} sx={getStyle(styles, 'pp-member__avatar-img')} />
                          ) : (
                            (username || '?')[0]
                          )}
                        </Box>
                        <Typography sx={getStyle(styles, 'pp-member__name')}>{username}</Typography>
                        <Box sx={cx(styles, 'pp-member__role', ROLE_STYLE_MAP[role] || 'pp-member__role--contributor')}>
                          {ROLE_LABEL_MAP[role] || role}
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            </Box>
          </Fade>

          {/* Categories */}
          <Fade in={mounted} timeout={500} style={{ transitionDelay: mounted ? '300ms' : '0ms' }}>
            <Box>
              <Box sx={getStyle(styles, 'pp-section__head')}>
                <Box sx={getStyle(styles, 'pp-section__title')}>
                  Categories
                  <Box component='span' sx={getStyle(styles, 'pp-section__count')}>{categories.length}</Box>
                  {canManage && (
                    <Box
                      component='span'
                      sx={getStyle(styles, 'pp-section__action')}
                      onClick={() => navigate(`/forge/projects/${id}/categories/new`)}
                    >
                      + Add
                    </Box>
                  )}
                </Box>
              </Box>
              <Box sx={getStyle(styles, 'pp-category__grid')}>
                {categories.map((category, index) => {
                  const categoryName = typeof category === 'string' ? category : (category || {}).name || category
                  const categoryColor = CATEGORY_COLORS[index % CATEGORY_COLORS.length]
                  const { total = 0, completed = 0, wont_fix: wontFix = 0 } = categoryStats[categoryName] || {}
                  const resolved = completed + wontFix
                  const percent = total > 0 ? Math.round((resolved / total) * 100) : 0
                  return (
                    <Box
                      key={categoryName}
                      sx={getStyle(styles, 'pp-category')}
                      onClick={() => navigate(`/forge/projects/${id}/kanban/${categoryName}`)}
                    >
                      <Box sx={{ ...getStyle(styles, 'pp-category__dot'), bgcolor: categoryColor }} />
                      <Typography sx={getStyle(styles, 'pp-category__name')}>{categoryName}</Typography>
                      <Box sx={getStyle(styles, 'pp-category__progress')}>
                        <Box sx={getStyle(styles, 'pp-category__bar')}>
                          <Box sx={{ ...getStyle(styles, 'pp-category__fill'), width: `${percent}%`, bgcolor: categoryColor }} />
                        </Box>
                        <Box component='span'>{resolved}/{total}</Box>
                      </Box>
                      <Box sx={getStyle(styles, 'pp-category__progress-line')}>
                        <Box sx={{ ...getStyle(styles, 'pp-category__progress-line-fill'), width: `${percent}%`, bgcolor: categoryColor }} />
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Fade>
        </Box>
      </Box>

      {/* Right panel */}
      <Box sx={getStyle(styles, 'pp__right')}>

        {/* Project info */}
        <Slide direction='left' in={mounted} timeout={400} mountOnEnter>
          <Box>
            <Fade in={mounted} timeout={500} style={{ transitionDelay: mounted ? '100ms' : '0ms' }}>
              <Box>
                <Box sx={getStyle(styles, 'pp-widget__label')}>Project Info</Box>
                <Box sx={getStyle(styles, 'pp-info__rows')}>
                  <Box sx={getStyle(styles, 'pp-info__row')}>
                    <Typography sx={getStyle(styles, 'pp-info__key')}>Owner</Typography>
                    <Typography sx={getStyle(styles, 'pp-info__value')}>{ownerName}</Typography>
                  </Box>
                  {isGame && (
                    <Box sx={getStyle(styles, 'pp-info__row')}>
                      <Typography sx={getStyle(styles, 'pp-info__key')}>Game</Typography>
                      <Typography sx={getStyle(styles, 'pp-info__value')}>{game}</Typography>
                    </Box>
                  )}
                  <Box sx={getStyle(styles, 'pp-info__row')}>
                    <Typography sx={getStyle(styles, 'pp-info__key')}>Visibility</Typography>
                    <Typography sx={cx(styles, 'pp-info__value', isPublic && 'pp-info__value--green', !isPublic && 'pp-info__value--accent')}>
                      {isPublic ? 'Public' : 'Private'}
                    </Typography>
                  </Box>
                  {version && (
                    <Box sx={getStyle(styles, 'pp-info__row')}>
                      <Typography sx={getStyle(styles, 'pp-info__key')}>Version</Typography>
                      <Typography sx={cx(styles, 'pp-info__value', 'pp-info__value--accent')}>v{version}</Typography>
                    </Box>
                  )}
                  <Box sx={getStyle(styles, 'pp-info__row')}>
                    <Typography sx={getStyle(styles, 'pp-info__key')}>Members</Typography>
                    <Typography sx={getStyle(styles, 'pp-info__value')}>{members.length}</Typography>
                  </Box>
                  <Box sx={getStyle(styles, 'pp-info__row')}>
                    <Typography sx={getStyle(styles, 'pp-info__key')}>Categories</Typography>
                    <Typography sx={getStyle(styles, 'pp-info__value')}>{categories.length}</Typography>
                  </Box>
                  <Box sx={getStyle(styles, 'pp-info__row')}>
                    <Typography sx={getStyle(styles, 'pp-info__key')}>Open Issues</Typography>
                    <Typography sx={cx(styles, 'pp-info__value', 'pp-info__value--accent')}>{animatedOpenIssues}</Typography>
                  </Box>
                  <Box sx={getStyle(styles, 'pp-info__row')}>
                    <Typography sx={getStyle(styles, 'pp-info__key')}>Resolved Issues</Typography>
                    <Typography sx={cx(styles, 'pp-info__value', 'pp-info__value--green')}>
                      {Math.round(animatedCloseRate * 100)}%
                    </Typography>
                  </Box>
                  {isGame && (
                    <>
                      <Box sx={getStyle(styles, 'pp-info__row')}>
                        <Typography sx={getStyle(styles, 'pp-info__key')}>Downloads</Typography>
                        <Typography sx={getStyle(styles, 'pp-info__value')}>{formatNumber(animatedDownloads)}</Typography>
                      </Box>
                      <Box sx={getStyle(styles, 'pp-info__row')}>
                        <Typography sx={getStyle(styles, 'pp-info__key')}>Avg Rating</Typography>
                        <Typography sx={cx(styles, 'pp-info__value', 'pp-info__value--accent')}>
                          {animatedAvgRating}{'\u2605'} ({animatedRatingCount})
                        </Typography>
                      </Box>
                    </>
                  )}
                  <Box sx={getStyle(styles, 'pp-info__row')}>
                    <Typography sx={getStyle(styles, 'pp-info__key')}>Created</Typography>
                    <Typography sx={getStyle(styles, 'pp-info__value')}>{relativeTime(createdAt)}</Typography>
                  </Box>
                  {userRole && (
                    <Box sx={getStyle(styles, 'pp-info__row')}>
                      <Typography sx={getStyle(styles, 'pp-info__key')}>Your Role</Typography>
                      <Typography sx={cx(styles, 'pp-info__value', 'pp-info__value--accent')}>
                        {ROLE_LABEL_MAP[userRole] || userRole}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Fade>
          </Box>
        </Slide>

      </Box>
    </Box>
  )
}
