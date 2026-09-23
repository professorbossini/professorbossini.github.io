import { Box, Chip, Grid, Stack, Typography } from '@mui/material'
import Instagram from '@mui/icons-material/Instagram'
import LinkedIn from '@mui/icons-material/LinkedIn'
import GitHub from '@mui/icons-material/GitHub'
import ArrowOutward from '@mui/icons-material/ArrowOutward'
import { fontMono } from '../theme'
import { links } from '../data'
import GlowCard from './GlowCard'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

const redes = [
  {
    href: links.instagramProfessor,
    icon: Instagram,
    title: 'Programação e ensino',
    handle: '@professorbossini',
    text: 'IA, aulas, dicas de programação, algoritmos, AWS e DevOps.',
    featured: true,
  },
  {
    href: links.instagramPessoal,
    icon: Instagram,
    title: 'Perfil pessoal',
    handle: '@rodrigobossini',
    text: 'A vida fora da sala de aula: música, leituras e afins.',
  },
  {
    href: links.linkedin,
    icon: LinkedIn,
    title: 'LinkedIn',
    handle: 'in/rodrigobossini',
    text: 'Trajetória profissional, palestras e contato.',
  },
  {
    href: links.github,
    icon: GitHub,
    title: 'GitHub',
    handle: 'professorbossini',
    text: 'Código das aulas, exemplos e projetos.',
  },
]

export default function Links() {
  return (
    <Box component="section">
      <Reveal>
        <SectionTitle eyebrow="// conecte-se">Onde me encontrar</SectionTitle>
      </Reveal>
      <Grid container spacing={2}>
        {redes.map(({ href, icon: Icon, title, handle, text, featured }, i) => (
          <Grid key={href} size={{ xs: 12, sm: 6 }}>
            <Reveal delay={i * 80} sx={{ height: '100%' }}>
              <GlowCard href={href} featured={featured}>
                <Stack spacing={1.5} sx={{ width: '100%' }}>
                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '14px',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'var(--mui-palette-surface-containerHigh)',
                        color: 'primary.main',
                      }}
                    >
                      <Icon />
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      {featured && <Chip label="Principal" size="small" color="primary" variant="outlined" />}
                      <ArrowOutward sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </Stack>
                  </Stack>
                  <Box>
                    <Typography variant="h6" component="h3">{title}</Typography>
                    <Typography sx={{ fontFamily: fontMono, fontSize: 14, color: 'primary.main' }}>
                      {handle}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">{text}</Typography>
                </Stack>
              </GlowCard>
            </Reveal>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
