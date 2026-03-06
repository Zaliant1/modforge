import { Box, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines, faDownload } from '@fortawesome/free-solid-svg-icons'
import { styles } from './ModlogTab.styles'
import { getStyle } from '~/hooks/useStyles'

export const ModlogTab = ({ issue }) => {
  const { modlog } = issue || {}

  if (!modlog) {
    return (
      <Box sx={getStyle(styles, 'modlog-tab__empty')}>
        <FontAwesomeIcon icon={faFileLines} style={getStyle(styles, 'modlog-tab__empty-icon')} />
        <Typography sx={getStyle(styles, 'modlog-tab__empty-text')}>No mod log attached to this issue.</Typography>
      </Box>
    )
  }

  const handleDownload = () => {
    const blob = new Blob([modlog], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `modlog-${issue.id || 'issue'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Box sx={getStyle(styles, 'modlog-tab')}>
      <Box sx={getStyle(styles, 'modlog-tab__header')}>
        <Box sx={getStyle(styles, 'modlog-tab__file-info')}>
          <FontAwesomeIcon icon={faFileLines} style={getStyle(styles, 'modlog-tab__file-icon')} />
          <Typography sx={getStyle(styles, 'modlog-tab__file-name')}>modlog.txt</Typography>
          <Typography sx={getStyle(styles, 'modlog-tab__file-size')}>
            {modlog.length} chars
          </Typography>
        </Box>
        <Box component='button' sx={getStyle(styles, 'modlog-tab__download')} onClick={handleDownload}>
          <FontAwesomeIcon icon={faDownload} />
          Download
        </Box>
      </Box>
      <Box component='pre' sx={getStyle(styles, 'modlog-tab__content')}>
        {modlog}
      </Box>
    </Box>
  )
}
