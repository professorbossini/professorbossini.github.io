import { Box, Chip, Grid, Stack, Typography } from '@mui/material'
import ArrowOutward from '@mui/icons-material/ArrowOutward'
import { fontMono } from '../theme'
import { redes } from '../data'
import MarcaIcone from './MarcaIcone'
import GlowCard from './GlowCard'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

export default function Links() {
  return (
    <Box component="section">
      <Reveal>
        <SectionTitle eyebrow="// conecte-se">Redes sociais</SectionTitle>
      </Reveal>
      <Grid container spacing={2}>
        {redes.map(({ href, marca, title, handle, text, featured }, i) => (
          <Grid key={href} size={{ xs: 12, sm: 6 }}>
            <Reveal delay={i * 80} sx={{ height: '100%' }}>
              <GlowCard href={href} featured={featured}>
                <Stack spacing={1.5} sx={{ width: '100%' }}>
                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <MarcaIcone marca={marca} />
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
