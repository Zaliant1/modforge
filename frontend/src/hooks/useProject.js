import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useProjects } from '~/context/ProjectsContext'
import { getProject } from '~/api/projects'

export const useProject = () => {
  const { id } = useParams()
  const { projects, setProjects, project, setProject } = useProjects() || {}

  useEffect(() => {
    if (id) {
      getProject(id)
        .then(setProject)
        .catch(() => {})
    } else {
      setProject(null)
    }
  }, [id])

  return { project, setProject, projects, setProjects }
}
