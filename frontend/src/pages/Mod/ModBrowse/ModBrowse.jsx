import { Box } from '@mui/material'
import { Header } from '~/layout/Header'
import { ModView } from '~/components/Mod/ModView/ModView'

export default function ModBrowse() {
  return (
    <Box>
      <Header mode='mod' />
      <ModView />
    </Box>
  )
}
