import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { easing } from '../theme'

// Faz o conteúdo surgir de baixo quando entra na tela.
export default function Reveal({ children, delay = 0, sx }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(24px)',
        transition: `opacity 700ms ${easing.emphasizedDecelerate} ${delay}ms, transform 700ms ${easing.emphasizedDecelerate} ${delay}ms`,
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', transform: 'none' },
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}
