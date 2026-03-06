import { Box } from '@mui/material'
import { Header } from '~/layout/Header'
import Sidenav from '~/layout/Sidenav'
import { ModView } from '~/components/Mod/ModView/ModView'
import { vars } from '~/theme'
import { styles } from '~/layout/Main.styles'
import { getStyle } from '~/hooks/useStyles'

const washColor = vars.modBlue

export default function ModBrowse() {
  return (
    <Box sx={getStyle(styles, 'main')}>
      <Box sx={getStyle(styles, 'main__header')}>
        <Header mode='mod' />
      </Box>
      <Sidenav />
      <Box sx={getStyle(styles, 'main__content')}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '280px', background: `linear-gradient(to bottom, ${washColor}18 0%, ${washColor}08 40%, transparent 100%)`, pointerEvents: 'none', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: `linear-gradient(to top, ${washColor}10 0%, transparent 60%)`, pointerEvents: 'none', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, ${washColor}40 0%, ${washColor}15 40%, transparent 80%)`, pointerEvents: 'none', zIndex: 2 }} />
        <ModView />
      </Box>
    </Box>
  )
}
