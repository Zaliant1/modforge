import { Box, Typography, Avatar, AvatarGroup, Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useProject } from '~/hooks/useProject'
import { useAuth } from '~/hooks/useAuth'
import { KanbanBoard } from '~/components/Kanban/KanbanBoard'
import { KanbanProvider } from '~/context/KanbanContext'
import { styles } from './styles'
import { useStyles } from '~/hooks/useStyles'

export default function ProjectPage() {
  const { category, id } = useParams()
  const { project } = useProject() || {}
  const { isAuthenticated } = useAuth() || {}
  const navigate = useNavigate()

  if (!project) return null

  const { picture, name, about, categories = [], members = [] } = project || {}
  const activeCategory = category || categories[0]
  const isHeader = !category

  return (
    <Box>
      {isHeader && (
        <Box sx={useStyles(styles, 'project-page__header')}>
          <Box
            component='img'
            src={picture}
            alt={name}
            sx={useStyles(styles, 'project-page__picture')}
          />
          <Box sx={useStyles(styles, 'project-page__meta')}>
            <Typography variant='body1' sx={useStyles(styles, 'project-page__about')}>
              {about}
            </Typography>
            <AvatarGroup max={10}>
              {members.map((member) => {
                const { discord_id, avatar_url } = member || {}
                return <Avatar key={discord_id} src={avatar_url} />
              })}
            </AvatarGroup>
          </Box>
        </Box>
      )}

      {activeCategory && (
        <KanbanProvider>
          <KanbanBoard category={activeCategory} />
        </KanbanProvider>
      )}

      {isAuthenticated && (
        <Button
          variant='contained'
          size='small'
          sx={useStyles(styles, 'project-page__fab')}
          onClick={() => navigate(`/projects/${id}/issues/new`)}
        >
          + Issue
        </Button>
      )}
    </Box>
  )
}
