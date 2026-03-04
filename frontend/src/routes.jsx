import { Routes, Route } from 'react-router-dom'
import Main from '~/layout/Main'
import Home from '~/pages/Home'
import CreateProject from '~/pages/Project/ProjectEdit'
import ProjectPage from '~/pages/ProjectPage'
import { IssuePage } from '~/components/Issue/IssuePage'
import IssueCreate from '~/pages/Issue/IssueCreate'
import ProjectSettings from '~/pages/Project/ProjectSettings'
import ChangeRequests from '~/pages/Project/ProjectChangeRequest'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/projects/new' element={<CreateProject />} />

      <Route path='/projects/:id' element={<Main />}>
        <Route index element={<ProjectPage />} />
        <Route path=':category' element={<ProjectPage />} />
        <Route path='issues/new' element={<IssueCreate />} />
        <Route path='issues/:issueId' element={<IssuePage />} />
        <Route path='settings' element={<ProjectSettings />} />
        <Route path='requests' element={<ChangeRequests />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
