import { useState, useEffect } from 'react'
import { Box, Typography, Avatar, Chip } from '@mui/material'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faEye, faStar, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Header } from '~/layout/Header'
import Sidenav from '~/layout/Sidenav'
import { getProject } from '~/api/projects'
import { getProjectStats } from '~/api/stats'
import { GAME_ICONS } from '~/constants'
import { styles } from './ModDetail.styles'
import { getStyle } from '~/hooks/useStyles'

export default function ModDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    if (id) {
      getProject(id).then(setProject).catch(() => {})
      getProjectStats(id).then(setStats).catch(() => {})
    }
  }, [id])

  if (!project) return null

  const {
    name = '',
    about = '',
    picture,
    version = '',
    categories = [],
    members = [],
    game = '',
  } = project || {}

  const {
    downloads = 0,
    avg_rating: avgRating = 0,
    rating_count: ratingCount = 0,
  } = stats || {}

  const { views = 0 } = project || {}

  const { color: gameColor } = GAME_ICONS[game] || GAME_ICONS._default
  const washColor = gameColor

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header mode='mod' />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidenav />
        <Box sx={{ flex: 1, position: 'relative', overflow: 'auto' }}>
          {/* Mod blue wash */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '280px', background: `linear-gradient(to bottom, ${washColor}18 0%, ${washColor}08 40%, transparent 100%)`, pointerEvents: 'none', zIndex: 0 }} />
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: `linear-gradient(to top, ${washColor}10 0%, transparent 60%)`, pointerEvents: 'none', zIndex: 0 }} />
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, ${washColor}40 0%, ${washColor}15 40%, transparent 80%)`, pointerEvents: 'none', zIndex: 2 }} />
          <Box sx={getStyle(styles, 'mod-detail')}>
        <Box sx={getStyle(styles, 'mod-detail__hero')}>
          {picture && (
            <Box
              component='img'
              src={picture}
              alt={name}
              sx={getStyle(styles, 'mod-detail__picture')}
            />
          )}
          <Box sx={getStyle(styles, 'mod-detail__info')}>
            <Typography variant='h4' sx={getStyle(styles, 'mod-detail__name')}>
              {name}
            </Typography>
            <Chip label={`v${version}`} size='small' sx={getStyle(styles, 'mod-detail__version')} />
            <Typography sx={getStyle(styles, 'mod-detail__about')}>
              {about}
            </Typography>
            <Box sx={getStyle(styles, 'mod-detail__stats')}>
              <Box sx={getStyle(styles, 'mod-detail__stat')}>
                <FontAwesomeIcon icon={faDownload} />
                <Typography>{downloads}</Typography>
                <Typography sx={getStyle(styles, 'mod-detail__stat-label')}>Downloads</Typography>
              </Box>
              <Box sx={getStyle(styles, 'mod-detail__stat')}>
                <FontAwesomeIcon icon={faEye} />
                <Typography>{views}</Typography>
                <Typography sx={getStyle(styles, 'mod-detail__stat-label')}>Views</Typography>
              </Box>
              <Box sx={getStyle(styles, 'mod-detail__stat')}>
                <FontAwesomeIcon icon={faStar} />
                <Typography>{avgRating}</Typography>
                <Typography sx={getStyle(styles, 'mod-detail__stat-label')}>{ratingCount} ratings</Typography>
              </Box>
              <Box sx={getStyle(styles, 'mod-detail__stat')}>
                <FontAwesomeIcon icon={faUsers} />
                <Typography>{members.length}</Typography>
                <Typography sx={getStyle(styles, 'mod-detail__stat-label')}>Members</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={getStyle(styles, 'mod-detail__body')}>
          <Box sx={getStyle(styles, 'mod-detail__categories')}>
            <Typography variant='subtitle2' sx={getStyle(styles, 'mod-detail__section-title')}>
              Categories
            </Typography>
            <Box sx={getStyle(styles, 'mod-detail__chip-row')}>
              {categories.map((category) => (
                <Chip key={category} label={category} size='small' sx={getStyle(styles, 'mod-detail__chip')} />
              ))}
            </Box>
          </Box>
          <Box sx={getStyle(styles, 'mod-detail__members')}>
            <Typography variant='subtitle2' sx={getStyle(styles, 'mod-detail__section-title')}>
              Team
            </Typography>
            {members.map((member) => {
              const { discord_id: memberId, username = '', avatar_url: avatarUrl, role = '' } = member || {}
              return (
                <Box key={memberId} sx={getStyle(styles, 'mod-detail__member')}>
                  <Avatar src={avatarUrl} alt={username} sx={getStyle(styles, 'mod-detail__avatar')}>
                    {(username || '?')[0]}
                  </Avatar>
                  <Box>
                    <Typography sx={getStyle(styles, 'mod-detail__member-name')}>{username}</Typography>
                    <Typography sx={getStyle(styles, 'mod-detail__member-role')}>{role}</Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>
        </Box>
      </Box>
      </Box>
    </Box>
  )
}
