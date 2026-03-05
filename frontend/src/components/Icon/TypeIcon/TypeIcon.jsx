import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBug, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { Box } from '@mui/material'
import { useStyles } from '~/hooks/useStyles'
import { styles } from './TypeIcon.styles'

export const TypeIcon = ({ type, sx, size = 'lg', ...rest }) => {
  if (type === null || type === undefined || type === 'bug') {
    return (
      <Box sx={{ ...useStyles(styles, 'type-icon--bug'), ...sx }} {...rest}>
        <FontAwesomeIcon icon={faBug} size={size} />
      </Box>
    )
  }

  if (type === 'suggestion') {
    return (
      <Box sx={{ ...useStyles(styles, 'type-icon'), ...sx }} {...rest}>
        <FontAwesomeIcon icon={faLightbulb} size={size} />
      </Box>
    )
  }
}
