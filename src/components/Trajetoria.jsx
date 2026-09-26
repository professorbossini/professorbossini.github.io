import { Box, Button, Chip, Grid, Stack, Typography } from '@mui/material'
import SchoolOutlined from '@mui/icons-material/SchoolOutlined'
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined'
import CodeOutlined from '@mui/icons-material/CodeOutlined'
import ArrowOutward from '@mui/icons-material/ArrowOutward'
import { areas, certificacoes, formacao } from '../data'
import { lattes } from '../bossiniFaz'
import { gradiente } from '../theme'
import { Logo, Painel } from './Painel'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

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
              {formacao.map(({ titulo, instituicao, logo, dissertacao }) => (
                <Stack key={titulo} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Logo src={logo} alt={instituicao} largura={96} altura={52} />
                  <Box sx={{ pl: 2, borderLeft: '2px solid', borderImage: `${gradiente.replace('90deg', '180deg')} 1` }}>
                    <Typography sx={{ fontWeight: 500 }}>{titulo}</Typography>
                    <Typography variant="body2" color="text.secondary">{instituicao}</Typography>
                    {dissertacao && (
                      <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.75, fontStyle: 'italic' }}>
                        Dissertação: {dissertacao}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              ))}
            </Stack>
            <Button
              href={lattes}
              target="_blank"
              rel="noopener"
              variant="tonal"
              size="small"
              endIcon={<ArrowOutward />}
              sx={{ mt: 3 }}
            >
              Currículo Lattes
            </Button>
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
