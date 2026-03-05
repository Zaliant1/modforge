import { Box } from '@mui/material'
import { Header } from '~/layout/Header'
import Sidenav from '~/layout/Sidenav'
import { ModView } from '~/components/Mod/ModView/ModView'
import { styles } from '~/layout/Main.styles'
import { useStyles } from '~/hooks/useStyles'

export default function ModBrowse() {
  return (
    <Box sx={useStyles(styles, 'main')}>
      <Box sx={useStyles(styles, 'main__header')}>
        <Header mode='mod' />
      </Box>
      <Sidenav />
      <Box sx={useStyles(styles, 'main__content')}>
        <ModView />
      </Box>
    </Box>
  )
}
