import { useState, useEffect } from 'react'
import { Box, Typography, Avatar, Chip } from '@mui/material'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faEye, faStar, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Header } from '~/layout/Header'
import { getProject } from '~/api/projects'
import { getProjectStats } from '~/api/stats'
import { styles } from './ModDetail.styles'
import { useStyles } from '~/hooks/useStyles'

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
  } = project || {}

  const {
    downloads = 0,
    avg_rating: avgRating = 0,
    rating_count: ratingCount = 0,
  } = stats || {}

  const { views = 0 } = project || {}

  return (
    <Box>
      <Header mode='mod' />
      <Box sx={useStyles(styles, 'mod-detail')}>
        <Box sx={useStyles(styles, 'mod-detail__hero')}>
          {picture && (
            <Box
              component='img'
              src={picture}
              alt={name}
              sx={useStyles(styles, 'mod-detail__picture')}
            />
          )}
          <Box sx={useStyles(styles, 'mod-detail__info')}>
            <Typography variant='h4' sx={useStyles(styles, 'mod-detail__name')}>
              {name}
            </Typography>
            <Chip label={`v${version}`} size='small' sx={useStyles(styles, 'mod-detail__version')} />
            <Typography sx={useStyles(styles, 'mod-detail__about')}>
              {about}
            </Typography>
            <Box sx={useStyles(styles, 'mod-detail__stats')}>
              <Box sx={useStyles(styles, 'mod-detail__stat')}>
                <FontAwesomeIcon icon={faDownload} />
                <Typography>{downloads}</Typography>
                <Typography sx={useStyles(styles, 'mod-detail__stat-label')}>Downloads</Typography>
              </Box>
              <Box sx={useStyles(styles, 'mod-detail__stat')}>
                <FontAwesomeIcon icon={faEye} />
                <Typography>{views}</Typography>
                <Typography sx={useStyles(styles, 'mod-detail__stat-label')}>Views</Typography>
              </Box>
              <Box sx={useStyles(styles, 'mod-detail__stat')}>
                <FontAwesomeIcon icon={faStar} />
                <Typography>{avgRating}</Typography>
                <Typography sx={useStyles(styles, 'mod-detail__stat-label')}>{ratingCount} ratings</Typography>
              </Box>
              <Box sx={useStyles(styles, 'mod-detail__stat')}>
                <FontAwesomeIcon icon={faUsers} />
                <Typography>{members.length}</Typography>
                <Typography sx={useStyles(styles, 'mod-detail__stat-label')}>Members</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={useStyles(styles, 'mod-detail__body')}>
          <Box sx={useStyles(styles, 'mod-detail__categories')}>
            <Typography variant='subtitle2' sx={useStyles(styles, 'mod-detail__section-title')}>
              Categories
            </Typography>
            <Box sx={useStyles(styles, 'mod-detail__chip-row')}>
              {categories.map((category) => (
                <Chip key={category} label={category} size='small' sx={useStyles(styles, 'mod-detail__chip')} />
              ))}
            </Box>
          </Box>
          <Box sx={useStyles(styles, 'mod-detail__members')}>
            <Typography variant='subtitle2' sx={useStyles(styles, 'mod-detail__section-title')}>
              Team
            </Typography>
            {members.map((member) => {
              const { discord_id: memberId, username = '', avatar_url: avatarUrl, role = '' } = member || {}
              return (
                <Box key={memberId} sx={useStyles(styles, 'mod-detail__member')}>
                  <Avatar src={avatarUrl} alt={username} sx={useStyles(styles, 'mod-detail__avatar')}>
                    {(username || '?')[0]}
                  </Avatar>
                  <Box>
                    <Typography sx={useStyles(styles, 'mod-detail__member-name')}>{username}</Typography>
                    <Typography sx={useStyles(styles, 'mod-detail__member-role')}>{role}</Typography>
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
