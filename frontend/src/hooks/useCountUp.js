import { useState, useEffect } from 'react'

const easeOut = (t) => 1 - Math.pow(1 - t, 4)

export const useCountUp = (target, duration = 1200) => {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target === 0) {
      setValue(0)
      return
    }

    setValue(0)
    const startTime = performance.now()

    let frame
    const step = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOut(progress)
      const current = target * eased

      setValue(current)

      if (progress < 1) {
        frame = requestAnimationFrame(step)
      }
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  const decimals = String(target).includes('.') ? (String(target).split('.')[1] || '').length : 0
  return decimals > 0 ? parseFloat(value.toFixed(decimals)) : Math.round(value)
}
