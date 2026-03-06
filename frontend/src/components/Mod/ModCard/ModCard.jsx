import { Box, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faDownload, faUsers } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { styles } from './ModCard.styles'
import { getStyle, cx } from '~/hooks/useStyles'

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
    <Box sx={getStyle(styles, 'mod-card')} onClick={() => navigate(`/mod/${projectId}`)}>
      <Box sx={cx(styles, 'card-img-wrap', small && 'card-img-wrap--small')}>
        {picture ? (
          <Box component='img' src={picture} alt={name} className='card-img' sx={getStyle(styles, 'card-img')} />
        ) : (
          <Box sx={getStyle(styles, 'card-img-placeholder')} />
        )}
        <Box sx={getStyle(styles, 'card-img-overlay')} />
      </Box>
      <Box sx={getStyle(styles, 'card-body')}>
        <Typography sx={getStyle(styles, 'card-name')}>{name}</Typography>
        <Typography sx={getStyle(styles, 'card-desc')}>{about}</Typography>
        <Box sx={getStyle(styles, 'card-stats')}>
          <Box sx={getStyle(styles, 'card-stat')}>
            <FontAwesomeIcon icon={faEye} size='xs' />
            <span>{views}</span> Views
          </Box>
          <Box sx={getStyle(styles, 'card-stat')}>
            <FontAwesomeIcon icon={faDownload} size='xs' />
            <span>{downloads}</span> Downloads
          </Box>
          <Box sx={getStyle(styles, 'card-stat')}>
            <FontAwesomeIcon icon={faUsers} size='xs' />
            <span>{memberCount || 0}</span> Members
          </Box>
        </Box>
      </Box>
      <Box sx={getStyle(styles, 'card-footer')}>
        <Box sx={getStyle(styles, 'card-author')}>
          <Box sx={cx(styles, 'author-av', 'author-av--default')}>
            {(name || '')[0] || '?'}
          </Box>
          <Typography sx={getStyle(styles, 'author-name')}>{name}</Typography>
        </Box>
        <Box sx={getStyle(styles, 'card-footer__ver')}>v{version}</Box>
      </Box>
    </Box>
  )
}
