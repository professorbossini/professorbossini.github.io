import { Box, Card, Stack, Typography } from '@mui/material'
import Reveal from './Reveal'

// Card com ícone e título, usado nas páginas Formação e Bossini faz
export function Painel({ icon: Icon, titulo, children, delay, sx }) {
  return (
    <Reveal delay={delay} sx={{ height: '100%' }}>
      <Card sx={[{ height: '100%', p: 3 }, ...(Array.isArray(sx) ? sx : [sx])]}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2.5 }}>
          <Icon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" component="h3">{titulo}</Typography>
        </Stack>
        {children}
      </Card>
    </Reveal>
  )
}

// Logo de instituição ou marca num cartão claro, legível também no tema escuro
export function Logo({ src, alt, largura, altura }) {
  return (
    <Box
      sx={{
        flexShrink: 0,
        width: largura,
        height: altura,
        p: 0.75,
        borderRadius: '10px',
        bgcolor: '#fff',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box component="img" src={src} alt={alt} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </Box>
  )
}
