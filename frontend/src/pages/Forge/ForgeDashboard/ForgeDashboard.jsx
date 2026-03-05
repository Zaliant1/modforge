import { Box } from '@mui/material'
import { Header } from '~/layout/Header'
import { ForgeView } from '~/components/Forge/ForgeView/ForgeView'

export default function ForgeDashboard() {
  return (
    <Box>
      <Header mode='forge' />
      <ForgeView />
    </Box>
  )
}
