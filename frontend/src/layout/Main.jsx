import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import Sidenav from './Sidenav'
import { styles } from './Main.styles'
import { useStyles } from '~/hooks/useStyles'

export default function Main() {
  return (
    <Box sx={useStyles(styles, 'main')}>
      <Header />
      <Box sx={useStyles(styles, 'main__body')}>
        <Sidenav />
        <Box component='main' sx={useStyles(styles, 'main__content')}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

