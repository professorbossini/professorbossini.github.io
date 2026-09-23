import { Box, Button, Stack, Typography } from '@mui/material'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import LinkedIn from '@mui/icons-material/LinkedIn'
import { aiGradient } from '../theme'
import { links, materialDidatico, topicos } from '../data'
import PromptTicker from './PromptTicker'
import Reveal from './Reveal'

function FotoPerfil() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 176,
        height: 214,
        // brilho suave em gradiente atrás da foto
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: -16,
          borderRadius: '40px',
          background: aiGradient,
          filter: 'blur(32px)',
          opacity: 0.3,
          zIndex: -1,
        },
      }}
    >
      <Box
        component="img"
        src="/images/perfil.jpg"
        alt="Rodrigo Bossini"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '28px',
          display: 'block',
          boxShadow: '0 12px 40px var(--mui-palette-surface-glow)',
        }}
      />
    </Box>
  )
}

export default function Hero() {
  return (
    <Stack component="section" spacing={4} sx={{ alignItems: 'center', textAlign: 'center' }}>
      <Reveal>
        <FotoPerfil />
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
