import { Box, Card, Chip, Grid, Stack, Typography } from '@mui/material'
import SchoolOutlined from '@mui/icons-material/SchoolOutlined'
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined'
import CodeOutlined from '@mui/icons-material/CodeOutlined'
import { areas, certificacoes, formacao } from '../data'
import { gradiente } from '../theme'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

// logo da instituição num cartão claro, legível também no tema escuro
function Logo({ src, alt, largura, altura }) {
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

function Painel({ icon: Icon, titulo, children, delay }) {
  return (
    <Reveal delay={delay} sx={{ height: '100%' }}>
      <Card sx={{ height: '100%', p: 3 }}>
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
              {formacao.map(({ titulo, instituicao, logo }) => (
                <Stack key={titulo} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Logo src={logo} alt={instituicao} largura={96} altura={52} />
                  <Box sx={{ pl: 2, borderLeft: '2px solid', borderImage: `${gradiente.replace('90deg', '180deg')} 1` }}>
                    <Typography sx={{ fontWeight: 500 }}>{titulo}</Typography>
                    <Typography variant="body2" color="text.secondary">{instituicao}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Painel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Painel icon={WorkspacePremiumOutlined} titulo="Certificações" delay={80}>
            <Stack spacing={1.75}>
              {certificacoes.map(({ nome, emissor, logo }) => (
                <Stack key={nome} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Logo src={logo} alt={emissor} largura={72} altura={40} />
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
                <Chip key={area} label={area} variant="soft" color="primary" />
              ))}
            </Stack>
          </Painel>
        </Grid>
      </Grid>
    </Box>
  )
}
