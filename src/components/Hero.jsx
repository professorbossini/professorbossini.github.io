import { Avatar, Box, Button, Stack, Typography } from '@mui/material'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import LinkedIn from '@mui/icons-material/LinkedIn'
import { aiGradient } from '../theme'
import { links, materialDidatico, topicos } from '../data'
import PromptTicker from './PromptTicker'
import Reveal from './Reveal'

function GradientAvatar() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 168,
        height: 168,
        display: 'grid',
        placeItems: 'center',
        // anel em gradiente girando, como um indicador de "pensando"
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #22c3ee, #4f7cff, #9b6bff, #ff6b9a, #22c3ee)',
          '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
          animation: 'spin 8s linear infinite',
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: -12,
          borderRadius: '50%',
          background: aiGradient,
          filter: 'blur(28px)',
          opacity: 0.35,
          zIndex: -1,
        },
      }}
    >
      <Avatar
        src="/images/perfil.jpg"
        alt="Rodrigo Bossini"
        sx={{
          width: 156,
          height: 156,
          border: '4px solid',
          borderColor: 'background.default',
        }}
      />
    </Box>
  )
}

export default function Hero() {
  return (
    <Stack component="section" spacing={4} sx={{ alignItems: 'center', textAlign: 'center' }}>
      <Reveal>
        <GradientAvatar />
      </Reveal>

      <Reveal delay={100}>
        <Typography variant="overline" color="text.secondary">
          Professor universitário · Desenvolvedor de software
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: '3rem', sm: '4.5rem' }, mt: 1 }}>
          Rodrigo{' '}
          <Box
            component="span"
            sx={{
              background: aiGradient,
              backgroundSize: '200% 100%',
              backgroundClip: 'text',
              color: 'transparent',
              '@keyframes shimmer': {
                '0%, 100%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
              },
              animation: 'shimmer 6s ease-in-out infinite',
            }}
          >
            Bossini
          </Box>
        </Typography>
      </Reveal>

      <Reveal delay={200}>
        <PromptTicker words={topicos} />
      </Reveal>

      <Reveal delay={300}>
        <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 560 }}>
          Mestre em Ciência da Computação pela USP. Ensino a construir software que roda na nuvem — e
          a entender os algoritmos por trás dele. Eterno aprendiz.
        </Typography>
      </Reveal>

      <Reveal delay={400}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button
            variant="contained"
            size="large"
            href={materialDidatico}
            target="_blank"
            rel="noopener"
            startIcon={<MenuBookOutlined />}
            sx={{
              background: aiGradient,
              backgroundSize: '150% 100%',
              color: '#fff',
              transition: 'background-position 400ms, transform 200ms, box-shadow 300ms',
              '&:hover': {
                backgroundPosition: '100% 0',
                boxShadow: '0 8px 28px var(--mui-palette-surface-glow)',
              },
            }}
          >
            Material didático
          </Button>
          <Button
            variant="outlined"
            size="large"
            href={links.linkedin}
            target="_blank"
            rel="noopener"
            startIcon={<LinkedIn />}
            sx={{ borderColor: 'var(--mui-palette-surface-outline)' }}
          >
            Fale comigo
          </Button>
        </Stack>
      </Reveal>
    </Stack>
  )
}
