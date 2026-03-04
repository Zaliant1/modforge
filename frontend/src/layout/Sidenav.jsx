import { Box, List, ListItemButton, ListItemText } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useProject } from '~/hooks/useProject'
import { styles } from './Sidenav.styles'
import { useStyles } from '~/hooks/useStyles'

export default function Sidenav() {
  const { project } = useProject() || {}
  const { id, category } = useParams()
  const navigate = useNavigate()

  if (!project) return null

  const { categories = [] } = project || {}

  return (
    <Box sx={useStyles(styles, 'sidenav')}>
      <List disablePadding>
        {categories.map((projectCategory) => (
          <ListItemButton
            key={projectCategory}
            selected={category === projectCategory}
            onClick={() => navigate(`/projects/${id}/${projectCategory}`)}
            sx={useStyles(styles, 'sidenav__item')}
          >
            <ListItemText
              primary={projectCategory}
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}

