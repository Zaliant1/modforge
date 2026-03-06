import { Routes, Route } from 'react-router-dom'
import Main from '~/layout/Main'
import { LandingView } from '~/components/Landing/LandingView/LandingView'
import ModBrowse from '~/pages/Mod/ModBrowse/ModBrowse'
import ModDetail from '~/pages/Mod/ModDetail/ModDetail'
import ForgeDashboard from '~/pages/Forge/ForgeDashboard/ForgeDashboard'
import CreateProject from '~/pages/Forge/Project/ProjectEdit/ProjectEdit'
import ProjectHome from '~/pages/Forge/Project/ProjectHome/ProjectHome'
import KanbanPage from '~/pages/Forge/Kanban/KanbanPage'
import { IssuePage } from '~/components/Issue/IssuePage/IssuePage'
import IssueCreate from '~/pages/Forge/Issue/IssueCreate/IssueCreate'
import ProjectSettings from '~/pages/Forge/Project/ProjectSettings/ProjectSettings'
import ChangeRequests from '~/pages/Forge/Project/ProjectChangeRequest/ProjectChangeRequest'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Shared */}
      <Route path='/' element={<LandingView />} />

      {/* Mod View */}
      <Route path='/mod' element={<ModBrowse />} />
      <Route path='/mod/:id' element={<ModDetail />} />

      {/* Forge View */}
      <Route path='/forge' element={<ForgeDashboard />} />
      <Route path='/forge/projects/new' element={<CreateProject />} />

      <Route path='/forge/projects/:id' element={<Main />}>
        <Route index element={<ProjectHome />} />
        <Route path='kanban' element={<KanbanPage />} />
        <Route path='kanban/:category' element={<KanbanPage />} />
        <Route path='issues/new' element={<IssueCreate />} />
        <Route path='issues/:issueId' element={<IssuePage />} />
        <Route path='settings' element={<ProjectSettings />} />
        <Route path='requests' element={<ChangeRequests />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
