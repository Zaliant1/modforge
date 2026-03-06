import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Header } from '~/layout/Header'
import { SlamTransition } from '~/components/Landing/SlamTransition/SlamTransition'
import { MOD_FEATURES, FORGE_FEATURES, GOOGLE_FONTS_URL, VIEW_MODE_STORAGE_KEY } from '~/constants'
import { styles } from './LandingView.styles'
import { getStyle, cx } from '~/hooks/useStyles'

const getStoredMode = () => {
  const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY)
  return stored === 'mod' || stored === 'forge' ? stored : null
}

export const LandingView = () => {
  const navigate = useNavigate()
  const [pendingMode, setPendingMode] = useState(null)

  useEffect(() => {
    const stored = getStoredMode()
    if (stored === 'mod') {
      navigate('/mod', { replace: true })
    } else if (stored === 'forge') {
      navigate('/forge', { replace: true })
    }
  }, [])

  useEffect(() => {
    const existing = document.querySelector(`link[href="${GOOGLE_FONTS_URL}"]`)
    if (existing) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = GOOGLE_FONTS_URL
    document.head.appendChild(link)
    return () => { link.remove() }
  }, [])

  const handleSelect = (next) => {
    setPendingMode(next)
  }

  const handleTransitionComplete = () => {
    if (pendingMode) {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, pendingMode)
      navigate(`/${pendingMode}`, { replace: true })
    }
    setPendingMode(null)
  }

  return (
    <Box sx={getStyle(styles, 'landing')}>
      <Header />
      {pendingMode ? (
        <SlamTransition mode={pendingMode} onComplete={handleTransitionComplete} />
      ) : (
        <Box sx={getStyle(styles, 'landing__body')}>
          {/* Mod card */}
          <Box
            sx={cx(styles, 'landing__card', 'landing__card--mod')}
            onClick={() => handleSelect('mod')}
          >
            <Box sx={cx(styles, 'landing__card-icon', 'landing__card-icon--mod')}>
              {'\u{1F3AE}'}
            </Box>
            <Typography sx={getStyle(styles, 'landing__card-title')}>
              MOD YOUR<br />
              <Box component='span' sx={getStyle(styles, 'landing__card-title--mod-accent')}>GAME</Box>
            </Typography>
            <Typography sx={getStyle(styles, 'landing__card-subtitle')}>
              Browse thousands of mods across your favourite games. Find what&apos;s trending, discover hidden gems, and install in one click.
            </Typography>
            <Box sx={getStyle(styles, 'landing__card-features')}>
              {MOD_FEATURES.map((feature) => (
                <Box key={feature} sx={getStyle(styles, 'landing__feature')}>
                  <Box sx={cx(styles, 'landing__feature-dot', 'landing__feature-dot--mod')} />
                  {feature}
                </Box>
              ))}
            </Box>
            <Box component='button' sx={cx(styles, 'landing__card-cta', 'landing__card-cta--mod')}>
              Find Mods <Box component='span' sx={getStyle(styles, 'landing__cta-arrow')}>{'\u2192'}</Box>
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={getStyle(styles, 'landing__divider')}>
            <Box sx={getStyle(styles, 'landing__divider-line')} />
            or
            <Box sx={getStyle(styles, 'landing__divider-line')} />
          </Box>

          {/* Forge card */}
          <Box
            sx={cx(styles, 'landing__card', 'landing__card--forge')}
            onClick={() => handleSelect('forge')}
          >
            <Box sx={cx(styles, 'landing__card-icon', 'landing__card-icon--forge')}>
              {'\u{2699}\u{FE0F}'}
            </Box>
            <Typography sx={getStyle(styles, 'landing__card-title')}>
              FORGE YOUR<br />
              <Box component='span' sx={getStyle(styles, 'landing__card-title--forge-accent')}>PROJECT</Box>
            </Typography>
            <Typography sx={getStyle(styles, 'landing__card-subtitle')}>
              Everything a mod creator needs — project management, bug tracking, kanban boards, release pipelines, and community metrics in one place.
            </Typography>
            <Box sx={getStyle(styles, 'landing__card-features')}>
              {FORGE_FEATURES.map((feature) => (
                <Box key={feature} sx={getStyle(styles, 'landing__feature')}>
                  <Box sx={cx(styles, 'landing__feature-dot', 'landing__feature-dot--forge')} />
                  {feature}
                </Box>
              ))}
            </Box>
            <Box component='button' sx={cx(styles, 'landing__card-cta', 'landing__card-cta--forge')}>
              Forge Ahead <Box component='span' sx={getStyle(styles, 'landing__cta-arrow')}>{'\u2192'}</Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
