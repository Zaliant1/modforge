import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { styles } from './ForgeProjectCard.styles'
import { useStyles } from '~/hooks/useStyles'

export const ForgeProjectCard = ({ project, selected, onSelect }) => {
  const navigate = useNavigate()
  const {
    id: projectId,
    name = '',
    about = '',
    version = '',
    picture,
    member_count: memberCount = 0,
    views = 0,
    is_public: isPublic,
  } = project || {}

  const handleClick = () => {
    if (onSelect) onSelect()
  }

  const handleOpen = (event) => {
    event.stopPropagation()
    navigate(`/forge/projects/${projectId}`)
  }

  return (
    <Box
      sx={{
        ...useStyles(styles, 'pcard'),
        ...(selected ? useStyles(styles, 'pcard--live') : {}),
      }}
      onClick={handleClick}
    >
      <Box sx={useStyles(styles, 'pcard-thumb')}>
        {picture ? (
          <Box
            component='img'
            src={picture}
            alt={name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          (name || '?')[0]
        )}
      </Box>
      <Box sx={useStyles(styles, 'pcard-body')}>
        <Box sx={useStyles(styles, 'pcard-top')}>
          <Typography sx={useStyles(styles, 'pcard-name')}>{name}</Typography>
          <Box sx={useStyles(styles, 'pcard-tag')}>v{version}</Box>
        </Box>
        <Typography sx={useStyles(styles, 'pcard-desc')}>{about}</Typography>
        <Box sx={useStyles(styles, 'pcard-pills')}>
          <Box sx={useStyles(styles, 'pp')}>{isPublic ? 'Public' : 'Private'}</Box>
          <Box sx={useStyles(styles, 'pp')}>{memberCount} members</Box>
          <Box sx={useStyles(styles, 'pp')}>{views} views</Box>
        </Box>
      </Box>
      <Box sx={useStyles(styles, 'pcard-right')}>
        <Box component='button' sx={useStyles(styles, 'sm-btn--pri')} onClick={handleOpen}>Open</Box>
      </Box>
    </Box>
  )
}
