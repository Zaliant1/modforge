import { Box } from '@mui/material'
import { cx } from '~/hooks/useStyles'
import { styles } from './PriorityIcon.styles'
import lowSvg from '~/assets/svgs/low.svg'
import mediumSvg from '~/assets/svgs/medium.svg'
import highSvg from '~/assets/svgs/high.svg'

const ICONS = {
  low: lowSvg,
  medium: mediumSvg,
  high: highSvg,
}

export const PriorityIcon = ({ type, sx, ...rest }) => {
  const level = type || 'medium'

  return (
    <Box sx={{ ...cx(styles, 'priority-icon'), ...sx }} {...rest}>
      <img src={ICONS[level]} alt={level} />
    </Box>
  )
}
