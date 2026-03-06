import { Box } from '@mui/material'
import { Header } from '~/layout/Header'
import Sidenav from '~/layout/Sidenav'
import { ForgeView } from '~/components/Forge/ForgeView/ForgeView'
import { styles } from '~/layout/Main.styles'
import { getStyle } from '~/hooks/useStyles'

export default function ForgeDashboard() {
  return (
    <Box sx={getStyle(styles, 'main')}>
      <Box sx={getStyle(styles, 'main__header')}>
        <Header mode='forge' />
      </Box>
      <Sidenav />
      <Box sx={getStyle(styles, 'main__content')}>
        <ForgeView />
      </Box>
    </Box>
  )
}
