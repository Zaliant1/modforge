import { useEffect, useState } from 'react'
import { Box, Typography, Chip, Avatar } from '@mui/material'
import { OS_LABEL } from '~/constants'
import { styles } from './DetailsTab.styles'
import { useStyles } from '~/hooks/useStyles'

export const DetailsTab = ({ issue }) => {
  const {
    status = '',
    type,
    priority,
    category,
    version,
    description,
    author = {},
    operating_systems = [],
  } = issue || {}
  const { username = '' } = author || {}

  const [html, setHtml] = useState('')

  useEffect(() => {
    if (description) {
      fetch(description)
        .then((response) => response.text())
        .then(setHtml)
        .catch(() => {})
    }
  }, [description])

  const meta = [
    {
      label: 'STATUS',
      value: (
        <Chip
          label={status.replace('_', ' ').toUpperCase()}
          size='small'
          sx={useStyles(styles, `details-tab__status--${status}`)}
        />
      ),
    },
    { label: 'TYPE', value: type },
    { label: 'PRIORITY', value: priority },
    { label: 'CATEGORY', value: category },
    { label: 'VERSION', value: version },
    {
      label: 'AUTHOR',
      value: (
        <Box sx={useStyles(styles, 'details-tab__author')}>
          <Avatar sx={useStyles(styles, 'details-tab__author-avatar')}>
            {username[0]}
          </Avatar>
          <Typography variant='body2'>{username}</Typography>
        </Box>
      ),
    },
    {
      label: 'OS',
      value:
        operating_systems.map((operatingSystem) => OS_LABEL[operatingSystem]).join(', ') || 'N/A',
    },
  ]

  return (
    <Box sx={useStyles(styles, 'details-tab')}>
      <Box
        sx={useStyles(styles, 'details-tab__body')}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <Box sx={useStyles(styles, 'details-tab__sidebar')}>
        {meta.map(({ label: metaLabel, value }) => (
          <Box key={metaLabel}>
            <Typography
              variant='caption'
              color='text.secondary'
              sx={useStyles(styles, 'details-tab__meta-label')}
            >
              {metaLabel}:
            </Typography>
            <Box sx={useStyles(styles, 'details-tab__meta-value')}>
              {typeof value === 'string' ? (
                <Typography variant='body2'>{value}</Typography>
              ) : (
                value
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
