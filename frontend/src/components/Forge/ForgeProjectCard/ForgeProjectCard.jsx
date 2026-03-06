import { useState, useRef } from 'react'
import { Box, Typography, Slide } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { styles } from './ForgeProjectCard.styles'
import { getStyle, cx } from '~/hooks/useStyles'
import { GAME_ICONS } from '~/constants'
import { vars } from '~/theme'

export const ForgeProjectCard = ({ project, selected, onSelect }) => {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const {
    id: projectId,
    name = '',
    about = '',
    game = '',
    version = '',
    picture,
    member_count: memberCount = 0,
    views = 0,
    is_public: isPublic,
  } = project || {}

  const { icon: gameIcon, color: gameColor, scale: gameScale } = GAME_ICONS[game] || GAME_ICONS._default

  const handleClick = () => {
    if (onSelect) onSelect()
  }

  const handleOpen = (event) => {
    event.stopPropagation()
    navigate(`/forge/projects/${projectId}`)
  }

  return (
    <Box
      ref={containerRef}
      sx={cx(styles, 'pcard', selected && 'pcard--live')}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box sx={getStyle(styles, 'pcard-thumb')}>
        {picture ? (
          <Box
            component='img'
            src={picture}
            alt={name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          (name || '?')[0]
        )}
      </Box>
      <Box sx={getStyle(styles, 'pcard-body')}>
        <Box sx={getStyle(styles, 'pcard-top')}>
          <Typography sx={getStyle(styles, 'pcard-name')}>{name}</Typography>
          <Box sx={getStyle(styles, 'pcard-tag')}>v{version}</Box>
        </Box>
        <Typography sx={getStyle(styles, 'pcard-desc')}>{about}</Typography>
        <Box sx={getStyle(styles, 'pcard-pills')}>
          <Box sx={getStyle(styles, 'pp')}>{isPublic ? 'Public' : 'Private'}</Box>
          <Box sx={getStyle(styles, 'pp')}>{memberCount} members</Box>
          <Box sx={getStyle(styles, 'pp')}>{views} views</Box>
        </Box>
      </Box>
      <Box
        component='button'
        sx={getStyle(styles, 'pcard-caret')}
        onClick={handleOpen}
      >
        &#x203A;
      </Box>
      <Box sx={getStyle(styles, 'pcard-game-icon-wrap')}>
        <Slide container={containerRef.current} direction='left' in={hovered}>
          <Box sx={{ ...cx(styles, 'pcard-game-icon-inner'), background: `linear-gradient(to left, ${gameColor}30 0%, ${gameColor}18 30%, ${vars.card} 100%)` }}>
            <Box
              component='img'
              src={gameIcon}
              alt={game}
              sx={{ ...cx(styles, 'pcard-game-icon'), ...(gameScale ? { height: gameScale } : {}) }}
            />
          </Box>
        </Slide>
      </Box>
    </Box>
  )
}
