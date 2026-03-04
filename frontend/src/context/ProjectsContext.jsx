import { createContext, useContext, useState, useEffect } from 'react'
import { getProjects } from '~/api/projects'

export const ProjectsContext = createContext(null)

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [project, setProject] = useState(null)

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => {})
  }, [])

  return (
    <ProjectsContext.Provider
      value={{ projects, setProjects, project, setProject }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export const useProjects = () => useContext(ProjectsContext)
