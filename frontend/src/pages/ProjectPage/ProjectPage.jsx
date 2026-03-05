import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useProject } from '~/hooks/useProject'

import { getProjectStats } from '~/api/stats'
import { getProjectActivity } from '~/api/activity'
import { relativeTime } from '~/utils/time'
import { ROLES, ACTIVITY_DOT_COLORS, CATEGORY_COLORS, AVATAR_GRADIENTS } from '~/constants'
import { isMaintainer } from '~/utils/permissions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faDownload, faArrowUp, faUsers, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { styles } from './ProjectPage.styles'
import { useStyles } from '~/hooks/useStyles'
import { useCountUp } from '~/hooks/useCountUp'

const formatNum = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return String(num)
}

const ROLE_STYLE_MAP = {
  owner: 'mg__role--owner',
  maintainer: 'mg__role--maintainer',
  contributor: 'mg__role--contributor',
}

const ROLE_LABEL_MAP = {
  owner: 'Owner',
  maintainer: 'Dev',
  contributor: 'Contrib',
}

export default function ProjectPage() {
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

    views = 0,
    user_role: userRole,
  } = project || {}

  const {
    downloads = 0,
    open_issues: openIssues = 0,

    close_rate: closeRate = 0,
    avg_rating: avgRating = 0,
    rating_count: ratingCount = 0,
  } = stats || {}

  const animViews = useCountUp(views)
  const animDownloads = useCountUp(downloads)
  const animMembers = useCountUp(members.length)
  const animOpenIssues = useCountUp(openIssues)
  const animAvgRating = useCountUp(avgRating)
  const animRatingCount = useCountUp(ratingCount)
  const animCloseRate = useCountUp(closeRate)

  if (!project) return null

  const canManage = isMaintainer(userRole)
  const owner = members.find((member) => member.role === ROLES.OWNER)
  const { username: ownerName = '', avatar_url: ownerAvatar } = owner || {}

  const maintainers = members.filter((member) => member.role === ROLES.OWNER || member.role === ROLES.MAINTAINER)
  const contributors = members.filter((member) => member.role === ROLES.CONTRIBUTOR)

  return (
    <Box sx={useStyles(styles, 'pp')}>
      {/* Left column */}
      <Box sx={useStyles(styles, 'pp__left')}>

        {/* Hero card */}
        <Box sx={useStyles(styles, 'hero')}>
          <Box sx={useStyles(styles, 'hero__banner')}>
            {picture && (
              <Box component='img' src={picture} alt={name} sx={useStyles(styles, 'hero__banner-img')} />
            )}
            <Box sx={useStyles(styles, 'hero__banner-glow')} />
            <Box sx={useStyles(styles, 'hero__banner-accent')} />
          </Box>
          <Box sx={useStyles(styles, 'hero__body')}>
            <Box sx={useStyles(styles, 'hero__title-row')}>
              <Box sx={useStyles(styles, 'hero__avatar')}>
                {picture ? (
                  <Box component='img' src={picture} alt={name} sx={useStyles(styles, 'hero__avatar-img')} />
                ) : (
                  (name || '?')[0]
                )}
              </Box>
              <Box sx={useStyles(styles, 'hero__title-info')}>
                <Typography sx={useStyles(styles, 'hero__name')}>{name}</Typography>
                <Box sx={useStyles(styles, 'hero__meta-row')}>
                  {version && <Box sx={useStyles(styles, 'hero__ver-badge')}>v{version}</Box>}
                  <Box sx={{ ...useStyles(styles, 'hero__status-pill'), ...useStyles(styles, 'hero__status-pill--live') }}>
                    <Box sx={useStyles(styles, 'hero__status-dot')} />
                    Live
                  </Box>
                  <Box
                    component='button'
                    sx={useStyles(styles, 'hero__history-btn')}
                    onClick={() => navigate(`/forge/projects/${id}/changelog`)}
                  >
                    <FontAwesomeIcon icon={faClockRotateLeft} />
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={useStyles(styles, 'hero__owner-row')}>
              <Box sx={useStyles(styles, 'hero__owner-av')}>
                {ownerAvatar ? (
                  <Box component='img' src={ownerAvatar} alt={ownerName} sx={useStyles(styles, 'hero__owner-av-img')} />
                ) : (
                  (ownerName || '?')[0]
                )}
              </Box>
              <Typography sx={useStyles(styles, 'hero__owner-name')}>{ownerName}</Typography>
            </Box>

            <Typography sx={useStyles(styles, 'hero__desc')}>{about}</Typography>

            <Box sx={useStyles(styles, 'hero__stats-row')}>
              <Box sx={useStyles(styles, 'hero__stat')}>
                <FontAwesomeIcon icon={faEye} style={useStyles(styles, 'hero__stat-icon')} />
                <Typography sx={useStyles(styles, 'hero__stat-val')}>{formatNum(animViews)}</Typography>
                <Typography sx={useStyles(styles, 'hero__stat-label')}>Views</Typography>
              </Box>
              <Box sx={useStyles(styles, 'hero__stat')}>
                <FontAwesomeIcon icon={faDownload} style={useStyles(styles, 'hero__stat-icon')} />
                <Typography sx={useStyles(styles, 'hero__stat-val')}>{formatNum(animDownloads)}</Typography>
                <Typography sx={useStyles(styles, 'hero__stat-label')}>Downloads</Typography>
              </Box>
              <Box sx={useStyles(styles, 'hero__stat')}>
                <FontAwesomeIcon icon={faArrowUp} style={useStyles(styles, 'hero__stat-icon')} />
                <Typography sx={useStyles(styles, 'hero__stat-val')}>{formatNum(0)}</Typography>
                <Typography sx={useStyles(styles, 'hero__stat-label')}>Upvotes</Typography>
              </Box>
              <Box sx={useStyles(styles, 'hero__stat')}>
                <FontAwesomeIcon icon={faUsers} style={useStyles(styles, 'hero__stat-icon')} />
                <Typography sx={useStyles(styles, 'hero__stat-val')}>{animMembers}</Typography>
                <Typography sx={useStyles(styles, 'hero__stat-label')}>Members</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Members */}
        <Box>
          <Box sx={useStyles(styles, 'section-head')}>
            <Box sx={useStyles(styles, 'section-title')}>
              Members
              <Box component='span' sx={useStyles(styles, 'section-count')}>{members.length}</Box>
            </Box>
            {canManage && (
              <Box component='span' sx={useStyles(styles, 'section-action')}>+ Invite</Box>
            )}
          </Box>
          <Box sx={useStyles(styles, 'members-grid')}>
            <Box sx={useStyles(styles, 'mg')}>
              <Box sx={useStyles(styles, 'mg__label')}>
                Maintainers <Box component='span' sx={useStyles(styles, 'mg__count')}>{maintainers.length}</Box>
              </Box>
              <Box sx={useStyles(styles, 'mg__list')}>
                {maintainers.map((member, memberIndex) => {
                  const { discord_id: discordId, username = '', avatar_url: avatarUrl, role = '' } = member || {}
                  return (
                    <Box key={discordId} sx={useStyles(styles, 'mg__row')}>
                      <Box sx={{ ...useStyles(styles, 'mg__av'), ...(!avatarUrl ? { background: AVATAR_GRADIENTS[memberIndex % AVATAR_GRADIENTS.length] } : {}) }}>
                        {avatarUrl ? (
                          <Box component='img' src={avatarUrl} alt={username} sx={useStyles(styles, 'mg__av-img')} />
                        ) : (
                          (username || '?')[0]
                        )}
                      </Box>
                      <Typography sx={useStyles(styles, 'mg__name')}>{username}</Typography>
                      <Box sx={{ ...useStyles(styles, 'mg__role'), ...useStyles(styles, ROLE_STYLE_MAP[role] || 'mg__role--contributor') }}>
                        {ROLE_LABEL_MAP[role] || role}
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
            <Box sx={useStyles(styles, 'mg')}>
              <Box sx={useStyles(styles, 'mg__label')}>
                Contributors <Box component='span' sx={useStyles(styles, 'mg__count')}>{contributors.length}</Box>
              </Box>
              <Box sx={useStyles(styles, 'mg__list')}>
                {contributors.map((member, memberIndex) => {
                  const { discord_id: discordId, username = '', avatar_url: avatarUrl } = member || {}
                  return (
                    <Box key={discordId} sx={useStyles(styles, 'mg__row')}>
                      <Box sx={{ ...useStyles(styles, 'mg__av'), ...(!avatarUrl ? { background: AVATAR_GRADIENTS[(memberIndex + maintainers.length) % AVATAR_GRADIENTS.length] } : {}) }}>
                        {avatarUrl ? (
                          <Box component='img' src={avatarUrl} alt={username} sx={useStyles(styles, 'mg__av-img')} />
                        ) : (
                          (username || '?')[0]
                        )}
                      </Box>
                      <Typography sx={useStyles(styles, 'mg__name')}>{username}</Typography>
                      <Box sx={{ ...useStyles(styles, 'mg__role'), ...useStyles(styles, 'mg__role--contributor') }}>
                        Contrib
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Categories */}
        {categories.length > 0 && (
          <Box>
            <Box sx={useStyles(styles, 'section-head')}>
              <Box sx={useStyles(styles, 'section-title')}>
                Categories
                <Box component='span' sx={useStyles(styles, 'section-count')}>{categories.length}</Box>
              </Box>
              {canManage && (
                <Box
                  component='span'
                  sx={useStyles(styles, 'section-action')}
                  onClick={() => navigate(`/forge/projects/${id}/categories/new`)}
                >
                  + Add
                </Box>
              )}
            </Box>
            <Box sx={useStyles(styles, 'cats-grid')}>
              {categories.map((category, index) => {
                const catName = typeof category === 'string' ? category : category.name || category
                const catColor = CATEGORY_COLORS[index % CATEGORY_COLORS.length]
                const { total = 0, completed = 0, wont_fix: wontFix = 0 } = categoryStats[catName] || {}
                const resolved = completed + wontFix
                const pct = total > 0 ? Math.round((resolved / total) * 100) : 0
                return (
                  <Box
                    key={catName}
                    sx={useStyles(styles, 'cat')}
                    onClick={() => navigate(`/forge/projects/${id}/kanban/${catName}`)}
                  >
                    <Box sx={{ ...useStyles(styles, 'cat__dot'), bgcolor: catColor }} />
                    <Typography sx={useStyles(styles, 'cat__name')}>{catName}</Typography>
                    <Box sx={useStyles(styles, 'cat__progress')}>
                      <Box sx={useStyles(styles, 'cat__bar')}>
                        <Box sx={{ ...useStyles(styles, 'cat__fill'), width: `${pct}%`, bgcolor: catColor }} />
                      </Box>
                      <Box component='span'>{resolved}/{total}</Box>
                    </Box>
                    <Box sx={useStyles(styles, 'cat__prog-line')}>
                      <Box sx={{ ...useStyles(styles, 'cat__prog-line-fill'), width: `${pct}%`, bgcolor: catColor }} />
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
        )}
      </Box>

      {/* Right panel */}
      <Box sx={useStyles(styles, 'pp__right')}>

        {/* Quick actions */}
        <Box>
          <Box sx={useStyles(styles, 'widget-label')}>Quick Actions</Box>
          <Box sx={useStyles(styles, 'qa')}>
            <Box
              sx={useStyles(styles, 'qa__btn--primary')}
              onClick={() => navigate(`/forge/projects/${id}/kanban`)}
            >
              <Box sx={{ ...useStyles(styles, 'qa__icon'), ...useStyles(styles, 'qa__icon--accent') }}>
                <FontAwesomeIcon icon={faEye} />
              </Box>
              <Box sx={useStyles(styles, 'qa__label')}>
                <Box>Open Kanban</Box>
                <Box sx={useStyles(styles, 'qa__meta')}>{animOpenIssues} open issues</Box>
              </Box>
              <Box component='span' sx={useStyles(styles, 'qa__arrow')}>{'\u2192'}</Box>
            </Box>
            <Box sx={useStyles(styles, 'qa__btn')} onClick={() => navigate(`/forge/projects/${id}/issues/new`)}>
              <Box sx={{ ...useStyles(styles, 'qa__icon'), ...useStyles(styles, 'qa__icon--default') }}>+</Box>
              <Box sx={useStyles(styles, 'qa__label')}>
                <Box>New Issue</Box>
                <Box sx={useStyles(styles, 'qa__meta')}>Report a bug or suggestion</Box>
              </Box>
              <Box component='span' sx={useStyles(styles, 'qa__arrow')}>{'\u2192'}</Box>
            </Box>
            {canManage && (
              <Box sx={useStyles(styles, 'qa__btn')} onClick={() => navigate(`/forge/projects/${id}/settings`)}>
                <Box sx={{ ...useStyles(styles, 'qa__icon'), ...useStyles(styles, 'qa__icon--default') }}>
                  <FontAwesomeIcon icon={faUsers} />
                </Box>
                <Box sx={useStyles(styles, 'qa__label')}>
                  <Box>Project Settings</Box>
                  <Box sx={useStyles(styles, 'qa__meta')}>{members.length} members</Box>
                </Box>
                <Box component='span' sx={useStyles(styles, 'qa__arrow')}>{'\u2192'}</Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Project info */}
        <Box>
          <Box sx={useStyles(styles, 'widget-label')}>Project Info</Box>
          <Box sx={useStyles(styles, 'info-rows')}>
            <Box sx={useStyles(styles, 'info-row')}>
              <Typography sx={useStyles(styles, 'info-key')}>Visibility</Typography>
              <Typography sx={{ ...useStyles(styles, 'info-val'), ...useStyles(styles, 'info-val--green') }}>
                {(project || {}).is_public ? 'Public' : 'Private'}
              </Typography>
            </Box>
            {version && (
              <Box sx={useStyles(styles, 'info-row')}>
                <Typography sx={useStyles(styles, 'info-key')}>Version</Typography>
                <Typography sx={{ ...useStyles(styles, 'info-val'), ...useStyles(styles, 'info-val--accent') }}>
                  v{version}
                </Typography>
              </Box>
            )}
            <Box sx={useStyles(styles, 'info-row')}>
              <Typography sx={useStyles(styles, 'info-key')}>Avg Rating</Typography>
              <Typography sx={{ ...useStyles(styles, 'info-val'), ...useStyles(styles, 'info-val--accent') }}>
                {animAvgRating}{'\u2605'} ({animRatingCount})
              </Typography>
            </Box>
            <Box sx={useStyles(styles, 'info-row')}>
              <Typography sx={useStyles(styles, 'info-key')}>Close rate</Typography>
              <Typography sx={{ ...useStyles(styles, 'info-val'), ...useStyles(styles, 'info-val--green') }}>
                {Math.round(animCloseRate * 100)}%
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Activity */}
        <Box>
          <Box sx={useStyles(styles, 'widget-label')}>
            Recent Activity
            <Typography component='span' sx={useStyles(styles, 'widget-link')}>All {'\u2192'}</Typography>
          </Box>
          <Box sx={useStyles(styles, 'act-feed')}>
            {activity.slice(0, 8).map((item) => {
              const { id: itemId, action = '', detail = '', created_at: createdAt = '' } = item || {}
              const dotColor = ACTIVITY_DOT_COLORS[action] || 'd-b'
              return (
                <Box key={itemId} sx={useStyles(styles, 'act-row')}>
                  <Box sx={{ ...useStyles(styles, 'act-dot'), ...useStyles(styles, dotColor) }} />
                  <Box sx={useStyles(styles, 'act-body')}>
                    <Typography sx={useStyles(styles, 'act-text')}>{detail}</Typography>
                    <Typography sx={useStyles(styles, 'act-time')}>{relativeTime(createdAt)}</Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>

      </Box>
    </Box>
  )
}
