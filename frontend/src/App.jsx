import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { UserProvider } from '~/context/AuthContext'
import { ProjectsProvider } from '~/context/ProjectsContext'
import AppRoutes from '~/routes'
import store from '~/store'
import theme from '~/theme'

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <UserProvider>
            <ProjectsProvider>
              <DndProvider backend={HTML5Backend}>
                <AppRoutes />
              </DndProvider>
            </ProjectsProvider>
          </UserProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}

export default App
