import { Box, Typography } from '@mui/material'
import { styles } from './ModlogTab.styles'
import { useStyles } from '~/hooks/useStyles'

export const ModlogTab = ({ issue }) => {
  const { modlog } = issue || {}

  if (!modlog) {
    return (
      <Typography color='text.secondary'>No modlog attached.</Typography>
    )
  }

  return (
    <Box component='pre' sx={useStyles(styles, 'modlog-tab__content')}>
      {modlog}
    </Box>
  )
}
