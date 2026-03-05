import { Box, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faDownload, faUsers } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { styles } from './ModCard.styles'
import { useStyles } from '~/hooks/useStyles'

export const ModCard = ({ project, small }) => {
  const navigate = useNavigate()
  const {
    id: projectId,
    name,
    version,
    about,
    picture,
    member_count: memberCount,
    views = 0,
    downloads = 0,
  } = project || {}

  return (
    <Box sx={useStyles(styles, 'mod-card')} onClick={() => navigate(`/mod/${projectId}`)}>
      <Box sx={useStyles(styles, small ? 'card-img-wrap--small' : 'card-img-wrap')}>
        {picture ? (
          <Box component='img' src={picture} alt={name} className='card-img' sx={useStyles(styles, 'card-img')} />
        ) : (
          <Box sx={useStyles(styles, 'card-img-placeholder')} />
        )}
        <Box sx={useStyles(styles, 'card-img-overlay')} />
      </Box>
      <Box sx={useStyles(styles, 'card-body')}>
        <Typography sx={useStyles(styles, 'card-name')}>{name}</Typography>
        <Typography sx={useStyles(styles, 'card-desc')}>{about}</Typography>
        <Box sx={useStyles(styles, 'card-stats')}>
          <Box sx={useStyles(styles, 'card-stat')}>
            <FontAwesomeIcon icon={faEye} size='xs' />
            <span>{views}</span> Views
          </Box>
          <Box sx={useStyles(styles, 'card-stat')}>
            <FontAwesomeIcon icon={faDownload} size='xs' />
            <span>{downloads}</span> Downloads
          </Box>
          <Box sx={useStyles(styles, 'card-stat')}>
            <FontAwesomeIcon icon={faUsers} size='xs' />
            <span>{memberCount || 0}</span> Members
          </Box>
        </Box>
      </Box>
      <Box sx={useStyles(styles, 'card-footer')}>
        <Box sx={useStyles(styles, 'card-author')}>
          <Box sx={{ ...useStyles(styles, 'author-av'), ...useStyles(styles, 'author-av--default') }}>
            {(name || '')[0] || '?'}
          </Box>
          <Typography sx={useStyles(styles, 'author-name')}>{name}</Typography>
        </Box>
        <Box sx={useStyles(styles, 'card-footer__ver')}>v{version}</Box>
      </Box>
    </Box>
  )
}
