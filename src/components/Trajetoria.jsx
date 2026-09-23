import { Box, Card, Chip, Grid, Stack, Typography } from '@mui/material'
import SchoolOutlined from '@mui/icons-material/SchoolOutlined'
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined'
import CodeOutlined from '@mui/icons-material/CodeOutlined'
import { areas, certificacoes, formacao } from '../data'
import { fontMono } from '../theme'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

function Painel({ icon: Icon, titulo, children, delay }) {
  return (
    <Reveal delay={delay} sx={{ height: '100%' }}>
      <Card sx={{ height: '100%', p: 3, bgcolor: 'var(--mui-palette-surface-container)' }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2.5 }}>
          <Icon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" component="h3">{titulo}</Typography>
        </Stack>
        {children}
      </Card>
    </Reveal>
  )
}

export default function Trajetoria() {
  return (
    <Box component="section">
      <Reveal>
        <SectionTitle eyebrow="// trajetória">Formação e certificações</SectionTitle>
      </Reveal>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Painel icon={SchoolOutlined} titulo="Formação">
            <Stack spacing={2.5}>
              {formacao.map(({ titulo, instituicao }) => (
                <Box
                  key={titulo}
                  sx={{ pl: 2, borderLeft: '2px solid', borderImage: 'linear-gradient(#4f7cff, #9b6bff) 1' }}
                >
                  <Typography sx={{ fontWeight: 500 }}>{titulo}</Typography>
                  <Typography variant="body2" color="text.secondary">{instituicao}</Typography>
                </Box>
              ))}
            </Stack>
          </Painel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Painel icon={WorkspacePremiumOutlined} titulo="Certificações" delay={80}>
            <Stack spacing={1.25}>
              {certificacoes.map(({ nome, emissor }) => (
                <Stack key={nome} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Box
                    sx={{
                      fontFamily: fontMono,
                      fontSize: 11,
                      fontWeight: 500,
                      minWidth: 40,
                      textAlign: 'center',
                      py: 0.25,
                      borderRadius: '6px',
                      bgcolor: 'var(--mui-palette-surface-containerHigh)',
                      color: 'primary.main',
                    }}
                  >
                    {emissor}
                  </Box>
                  <Typography variant="body2">{nome}</Typography>
                </Stack>
              ))}
            </Stack>
          </Painel>
        </Grid>
        <Grid size={12}>
          <Painel icon={CodeOutlined} titulo="Áreas em que leciono" delay={160}>
            <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
              {areas.map((area) => (
                <Chip key={area} label={area} variant="outlined" sx={{ borderColor: 'var(--mui-palette-surface-outline)' }} />
              ))}
            </Stack>
          </Painel>
        </Grid>
      </Grid>
    </Box>
  )
}
