import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindows, faApple, faLinux } from '@fortawesome/free-brands-svg-icons'
import { faGamepad } from '@fortawesome/free-solid-svg-icons'
import { Box, Typography } from '@mui/material'
import { getStyle } from '~/hooks/useStyles'
import { styles } from './OsIcon.styles'

const OS_ICONS = {
  windows: faWindows,
  macOS: faApple,
  linux: faLinux,
  handheld: faGamepad,
}

export const OsIcon = ({ os, showNa = false }) => {
  return (
    <Box sx={getStyle(styles, 'os-icon')}>
      {(!os || os.length === 0) && showNa && (
        <Typography variant='body'>N/A</Typography>
      )}
      {os && Object.entries(OS_ICONS).map(([key, icon]) =>
        os.indexOf(key) > -1 && (
          <FontAwesomeIcon key={key} icon={icon} size='lg' />
        )
      )}
    </Box>
  )
}
