import { Box, Button, ButtonBase, Stack, Tooltip, Typography } from '@mui/material'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import { aiGradient, easing } from '../theme'
import { materialDidatico, redes, topicos } from '../data'
import MarcaIcone from './MarcaIcone'
import PromptTicker from './PromptTicker'
import Reveal from './Reveal'

function FotoPerfil() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: 120, sm: 176 },
        height: { xs: 146, sm: 214 },
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

// Atalhos para as redes logo na página inicial, com os logos oficiais.
function RedesRapidas() {
  return (
    <Box
      component="nav"
      aria-label="Redes sociais"
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, auto)' },
        justifyContent: 'center',
      }}
    >
      {redes.map(({ href, marca, title, handle, curto }) => (
        <Tooltip key={href} title={handle}>
          <ButtonBase
            component="a"
            href={href}
            target="_blank"
            rel="noopener"
            aria-label={`${title}: ${handle}`}
            sx={{
              gap: 1.25,
              pl: 0.75,
              pr: 2.25,
              justifyContent: 'flex-start',
              py: 0.75,
              borderRadius: 999,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'var(--mui-palette-surface-container)',
              transition: `transform 250ms ${easing.emphasized}, box-shadow 250ms, border-color 250ms`,
              '&:hover': {
                transform: 'translateY(-3px)',
                borderColor: 'var(--mui-palette-surface-outline)',
                boxShadow: '0 10px 28px var(--mui-palette-surface-glow)',
              },
            }}
          >
            <MarcaIcone marca={marca} tamanho={34} />
            <Typography component="span" sx={{ fontWeight: 500, fontSize: 15 }}>
              {curto}
            </Typography>
          </ButtonBase>
        </Tooltip>
      ))}
    </Box>
  )
}

export default function Hero() {
  return (
    <Stack component="section" spacing={{ xs: 3, sm: 4 }} sx={{ alignItems: 'center', textAlign: 'center' }}>
      <Reveal>
        <FotoPerfil />
      </Reveal>

      <Reveal delay={100}>
        <Typography variant="overline" color="text.secondary">
          Professor universitário · Desenvolvedor de software
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: '2.6rem', sm: '4.5rem' }, mt: 1 }}>
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
        <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 560, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
          Mestre em Ciência da Computação pela USP. Ensino dos fundamentos à fronteira — do algoritmo à
          IA — para formar gente que entende o que constrói. Eterno aprendiz.
        </Typography>
      </Reveal>

      <Reveal delay={400}>
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
      </Reveal>

      <Reveal delay={500}>
        <RedesRapidas />
      </Reveal>
    </Stack>
  )
}
