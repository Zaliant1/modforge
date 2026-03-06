import { Box, Typography } from '@mui/material'
import { ACTIVITY_DOT_COLORS } from '~/constants'
import { relativeTime } from '~/utils/time'
import { styles } from './ActivityFeed.styles'
import { getStyle, cx } from '~/hooks/useStyles'

export const ActivityFeed = ({ activity = [], limit = 8 }) => {
  return (
    <Box sx={getStyle(styles, 'activity-feed')}>
      <Box sx={getStyle(styles, 'activity-feed__header')}>
        Recent Activity
        <Typography component='span' sx={getStyle(styles, 'activity-feed__link')}>All {'\u2192'}</Typography>
      </Box>
      <Box sx={getStyle(styles, 'activity-feed__list')}>
        {activity.slice(0, limit).map((item) => {
          const { id: itemId, action = '', detail = '', created_at: createdAt = '' } = item || {}
          const dotColor = ACTIVITY_DOT_COLORS[action] || 'd-b'
          return (
            <Box key={itemId} sx={getStyle(styles, 'activity-feed__row')}>
              <Box sx={cx(styles, 'activity-feed__dot', dotColor)} />
              <Box sx={getStyle(styles, 'activity-feed__body')}>
                <Typography sx={getStyle(styles, 'activity-feed__text')}>{detail}</Typography>
                <Typography sx={getStyle(styles, 'activity-feed__time')}>{relativeTime(createdAt)}</Typography>
              </Box>
            </Box>
          )
        })}
        {activity.length === 0 && (
          <Typography sx={getStyle(styles, 'activity-feed__text')}>No recent activity</Typography>
        )}
      </Box>
    </Box>
  )
}
