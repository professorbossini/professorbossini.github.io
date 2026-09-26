import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { transition } from '../theme'

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
      // threshold 0 + margem: blocos muito altos (ex.: a grade de codelabs) também são revelados
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
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
        transition: transition(['opacity', 'transform'], 'long4', 'emphasizedDecelerate'),
        transitionDelay: `${delay}ms`,
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', transform: 'none' },
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}
