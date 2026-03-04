import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  AvatarGroup,
  Box,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { styles } from './styles'
import { useStyles } from '~/hooks/useStyles'

export const ProjectCard = ({ project }) => {
  const navigate = useNavigate()
  const { id: projectId, name, version, about, picture, members = [] } = project || {}

  return (
    <Card onClick={() => navigate(`/projects/${projectId}`)} sx={useStyles(styles, 'project-card')}>
      <CardMedia
        component='img'
        image={picture || '/placeholder.png'}
        alt={name}
        sx={useStyles(styles, 'project-card__media')}
      />
      <CardContent sx={useStyles(styles, 'project-card__content')}>
        <Typography variant='h5' sx={useStyles(styles, 'project-card__name')}>
          {name}
        </Typography>
        <Typography
          variant='overline'
          color='text.secondary'
          display='block'
          sx={useStyles(styles, 'project-card__version')}
        >
          VERSION {version}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={useStyles(styles, 'project-card__about')}>
          {about}
        </Typography>
        <Box sx={useStyles(styles, 'project-card__avatars')}>
          <AvatarGroup max={7}>
            {members.map((member) => {
              const { discord_id, avatar_url, username = '' } = member || {}
              return (
                <Avatar
                  key={discord_id}
                  src={avatar_url}
                  alt={username}
                  sx={useStyles(styles, 'project-card__member-avatar')}
                >
                  {username[0]}
                </Avatar>
              )
            })}
          </AvatarGroup>
        </Box>
      </CardContent>
    </Card>
  )
}
