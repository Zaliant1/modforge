import { useEffect, useRef, useCallback } from 'react'
import { Box } from '@mui/material'
import { vars } from '~/theme'
import { styles } from './SlamTransition.styles'
import { useStyles } from '~/hooks/useStyles'

export const SlamTransition = ({ mode, onComplete }) => {
  const overlayRef = useRef(null)
  const modLetterRef = useRef(null)
  const forgeLetterRef = useRef(null)
  const flashRef = useRef(null)
  const ringRef = useRef(null)

  const animate = useCallback(() => {
    const modLetter = modLetterRef.current
    const forgeLetter = forgeLetterRef.current
    const flash = flashRef.current
    const ring = ringRef.current
    const overlay = overlayRef.current
    if (!modLetter || !forgeLetter || !flash || !ring || !overlay) return

    const modColor = mode === 'mod' ? vars.modBlue : vars.text
    const forgeColor = mode === 'forge' ? vars.accent : vars.text
    const glowColor = mode === 'mod' ? vars.modGlow : vars.accGlow
    const glowRgba = mode === 'mod' ? 'rgba(96,165,250,' : 'rgba(249,115,22,'

    // Set colors
    modLetter.style.color = modColor
    forgeLetter.style.color = forgeColor

    // Reset
    modLetter.style.transition = ''
    forgeLetter.style.transition = ''
    modLetter.style.opacity = ''
    forgeLetter.style.opacity = ''

    // M: right:50%, so right edge at center. translateX(-100vw) pushes it far left off-screen.
    // At translateX(0) its right edge touches center.
    modLetter.style.transform = 'translateY(-50%) translateX(-100vw)'
    // F: left:50%, so left edge at center. translateX(100vw) pushes it far right off-screen.
    // At translateX(0) its left edge touches center.
    forgeLetter.style.transform = 'translateY(-50%) translateX(100vw)'

    modLetter.style.textShadow = `0 0 0px ${glowRgba}0)`
    forgeLetter.style.textShadow = `0 0 0px ${glowRgba}0)`

    // Reset flash and ring
    flash.style.opacity = '0'
    flash.style.transition = ''
    flash.style.background = mode === 'mod'
      ? `radial-gradient(ellipse at center, ${glowRgba}0.6) 0%, ${glowRgba}0.0) 60%)`
      : `radial-gradient(ellipse at center, ${glowRgba}0.6) 0%, ${glowRgba}0.0) 60%)`

    ring.style.transform = 'translate(-50%,-50%) scale(0)'
    ring.style.opacity = '0'
    ring.style.transition = ''
    ring.style.borderColor = mode === 'mod' ? `${glowRgba}0.9)` : `${glowRgba}0.9)`

    overlay.style.transition = ''
    overlay.style.opacity = ''

    const duration = 400
    const startTime = performance.now()

    function easeOutCubic(progress) {
      return 1 - Math.pow(1 - progress, 3)
    }

    function animateSlide(timestamp) {
      let progress = (timestamp - startTime) / duration
      if (progress > 1) progress = 1
      const eased = easeOutCubic(progress)

      // M slides from -100vw to 0 (right edge meets center)
      const modX = -100 + 100 * eased
      modLetter.style.transform = `translateY(-50%) translateX(${modX}vw)`

      // F slides from 100vw to 0 (left edge meets center)
      const forgeX = 100 - 100 * eased
      forgeLetter.style.transform = `translateY(-50%) translateX(${forgeX}vw)`

      // Build glow as letters approach
      const glowSize = 30 * progress
      modLetter.style.textShadow = `0 0 ${glowSize}px ${glowRgba}${0.5 * progress})`
      forgeLetter.style.textShadow = `0 0 ${glowSize}px ${glowRgba}${0.5 * progress})`

      if (progress < 1) {
        requestAnimationFrame(animateSlide)
      } else {
        impact()
      }
    }

    function impact() {
      // Flash burst
      flash.style.transition = 'opacity 0.08s'
      flash.style.opacity = '1'
      setTimeout(() => {
        flash.style.transition = 'opacity 0.5s'
        flash.style.opacity = '0'
      }, 80)

      // Shockwave ring
      ring.style.opacity = '1'
      ring.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out'
      ring.style.transform = 'translate(-50%,-50%) scale(12)'
      setTimeout(() => { ring.style.opacity = '0' }, 50)

      // Screen shake
      document.body.style.transition = 'none'
      let shakeCount = 6
      let shakeIndex = 0
      function shake() {
        if (shakeIndex >= shakeCount) {
          document.body.style.transform = ''
          afterImpact()
          return
        }
        const offsetX = (Math.random() - 0.5) * (12 - shakeIndex * 1.5)
        const offsetY = (Math.random() - 0.5) * (8 - shakeIndex)
        document.body.style.transform = `translate(${offsetX}px,${offsetY}px)`
        shakeIndex++
        setTimeout(shake, 35)
      }
      shake()

      // Glow burst on letters
      modLetter.style.textShadow = `0 0 60px ${glowRgba}0.8), 0 0 120px ${glowRgba}0.3)`
      forgeLetter.style.textShadow = `0 0 60px ${glowRgba}0.8), 0 0 120px ${glowRgba}0.3)`
    }

    function afterImpact() {
      // Letters drift apart and fade
      setTimeout(() => {
        modLetter.style.transition = 'transform 0.6s ease-out, opacity 0.5s'
        forgeLetter.style.transition = 'transform 0.6s ease-out, opacity 0.5s'
        modLetter.style.transform = 'translateY(-50%) translateX(-10vw)'
        forgeLetter.style.transform = 'translateY(-50%) translateX(10vw)'
        modLetter.style.opacity = '0.3'
        forgeLetter.style.opacity = '0.3'
      }, 100)

      // Fade overlay then complete
      setTimeout(() => {
        overlay.style.transition = 'opacity 0.4s'
        overlay.style.opacity = '0'
        setTimeout(() => {
          if (onComplete) onComplete()
        }, 450)
      }, 500)
    }

    requestAnimationFrame(animateSlide)
  }, [mode, onComplete])

  useEffect(() => {
    animate()
  }, [animate])

  return (
    <Box ref={overlayRef} sx={useStyles(styles, 'overlay')}>
      <Box ref={flashRef} sx={useStyles(styles, 'flash')} />
      <Box ref={ringRef} sx={useStyles(styles, 'ring')} />
      <Box ref={modLetterRef} sx={useStyles(styles, 'letter-m')}>M</Box>
      <Box ref={forgeLetterRef} sx={useStyles(styles, 'letter-f')}>F</Box>
    </Box>
  )
}
