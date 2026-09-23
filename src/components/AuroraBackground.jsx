import { Box } from '@mui/material'

// Manchas de luz desfocadas que se movem devagar atrás do conteúdo.
const blob = (color, size, top, left, delay) => ({
  position: 'absolute',
  top,
  left,
  width: size,
  height: size,
  borderRadius: '50%',
  background: color,
  filter: 'blur(90px)',
  opacity: 'var(--aurora-opacity)',
  animation: `aurora-drift 22s ease-in-out ${delay}s infinite alternate`,
})

export default function AuroraBackground() {
  return (
    <Box
      aria-hidden
      sx={(theme) => ({
        '--aurora-opacity': 0.35,
        ...theme.applyStyles('dark', { '--aurora-opacity': 0.28 }),
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
        '@keyframes aurora-drift': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(6vw, 4vh) scale(1.15)' },
        },
        '@media (prefers-reduced-motion: reduce)': {
          '& > div': { animation: 'none' },
        },
      })}
    >
      <Box sx={blob('#4f7cff', '42vmax', '-18vmax', '-12vmax', 0)} />
      <Box sx={blob('#9b6bff', '34vmax', '-10vmax', '55vw', -6)} />
      <Box sx={blob('#22c3ee', '26vmax', '55vh', '-8vmax', -12)} />
      <Box sx={blob('#ff6b9a', '22vmax', '70vh', '70vw', -3)} />
      {/* grade sutil de pontos para o ar "tech" */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(var(--mui-palette-text-primary) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.05,
          maskImage: 'radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)',
        }}
      />
    </Box>
  )
}
