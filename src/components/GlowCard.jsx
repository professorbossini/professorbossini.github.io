import { Card, CardActionArea } from '@mui/material'
import { aiGradient, easing } from '../theme'

// Card que ganha borda em gradiente e brilho ao passar o mouse.
// `featured` deixa a borda em gradiente sempre visível.
export default function GlowCard({ href, featured = false, children, sx }) {
  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        bgcolor: 'var(--mui-palette-surface-container)',
        border: '1px solid transparent',
        backgroundClip: 'padding-box',
        transition: `transform 300ms ${easing.emphasized}, box-shadow 300ms ${easing.emphasized}`,
        overflow: 'visible',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: -1,
          borderRadius: 'inherit',
          padding: '1px',
          background: aiGradient,
          mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)',
          opacity: featured ? 1 : 0,
          transition: 'opacity 300ms',
          pointerEvents: 'none',
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 16px 40px var(--mui-palette-surface-glow)',
          '&::before': { opacity: 1 },
        },
        ...sx,
      }}
    >
      <CardActionArea
        href={href}
        target="_blank"
        rel="noopener"
        sx={{ height: '100%', borderRadius: 'inherit', p: 3, alignItems: 'flex-start' }}
      >
        {children}
      </CardActionArea>
    </Card>
  )
}
