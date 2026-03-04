import { Box, Container, Divider, Grid, Typography } from '@mui/material'
import { Header } from '~/layout/Header'
import { ProjectCard } from '~/components/Project/ProjectCard'
import { useProjects } from '~/context/ProjectsContext'
import { useAuth } from '~/hooks/useAuth'
import { styles } from './styles'
import { useStyles } from '~/hooks/useStyles'

export default function Home() {
  const { projects } = useProjects() || {}
  const { isAuthenticated } = useAuth() || {}

  const myProjects = isAuthenticated
    ? projects.filter((project) => {
        const { is_member: isMember } = project || {}
        return isMember
      })
    : []
  const publicProjects = projects.filter((project) => {
    const { is_member: isMember, is_public: isPublic } = project || {}
    return !isMember && isPublic
  })
  return (
    <Box sx={useStyles(styles, 'home')}>
      <Header />
      <Container maxWidth='xl' sx={useStyles(styles, 'home__container')}>
        <Typography variant='h4' align='center' gutterBottom>
          Welcome to ModForge
        </Typography>
        <Divider sx={useStyles(styles, 'home__divider')} />
        <Typography
          variant='body2'
          color='text.secondary'
          align='left'
          sx={useStyles(styles, 'home__tagline')}
        >
          ModForge is currently in beta. Thank you for helping test and make
          this application grow.
        </Typography>

        {isAuthenticated && myProjects.length > 0 && (
          <>
            <Typography variant='h6' sx={useStyles(styles, 'home__section-title')}>
              Your Projects
            </Typography>
            <Grid container spacing={3} sx={useStyles(styles, 'home__my-projects')}>
              {myProjects.map((project) => {
                const { id: projectId } = project || {}
                return (
                  <Grid item key={projectId} xs={12} sm={6} md={3}>
                    <ProjectCard project={project} />
                  </Grid>
                )
              })}
            </Grid>
          </>
        )}

        {publicProjects.length > 0 && (
          <>
            <Typography variant='h6' sx={useStyles(styles, 'home__section-title')}>
              Public Projects
            </Typography>
            <Grid container spacing={3}>
              {publicProjects.map((project) => {
                const { id: projectId } = project || {}
                return (
                  <Grid item key={projectId} xs={12} sm={6} md={3}>
                    <ProjectCard project={project} />
                  </Grid>
                )
              })}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  )
}
