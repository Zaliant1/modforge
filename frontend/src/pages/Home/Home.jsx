import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Header } from '~/layout/Header'
import { LandingView } from '~/components/Landing/LandingView/LandingView'
import { SlamTransition } from '~/components/Landing/SlamTransition/SlamTransition'
import { GOOGLE_FONTS_URL, VIEW_MODE_STORAGE_KEY } from '~/constants'
import { styles } from './Home.styles'
import { useStyles } from '~/hooks/useStyles'

const getStoredMode = () => {
  const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY)
  return stored === 'mod' || stored === 'forge' ? stored : null
}

export default function Home() {
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

  const handleLandingSelect = (next) => {
    setPendingMode(next)
  }

  const handleTransitionComplete = () => {
    if (pendingMode) {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, pendingMode)
      navigate(`/${pendingMode}`, { replace: true })
    }
    setPendingMode(null)
  }

  useEffect(() => {
    const existing = document.querySelector(`link[href="${GOOGLE_FONTS_URL}"]`)
    if (existing) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = GOOGLE_FONTS_URL
    document.head.appendChild(link)
    return () => { link.remove() }
  }, [])

  return (
    <Box sx={useStyles(styles, 'root')}>
      <Header />
      {!pendingMode && <LandingView onSelect={handleLandingSelect} />}
      {pendingMode && <SlamTransition mode={pendingMode} onComplete={handleTransitionComplete} />}
    </Box>
  )
}
