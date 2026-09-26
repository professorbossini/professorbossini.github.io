import { Box, Button, Card, CardActionArea, Grid, Stack, Typography } from '@mui/material'
import ArrowForward from '@mui/icons-material/ArrowForward'
import NewReleasesOutlined from '@mui/icons-material/NewReleasesOutlined'
import RocketLaunchOutlined from '@mui/icons-material/RocketLaunchOutlined'
import { codelabs, formatarDuracao } from '../codelabs'
import { numeros } from '../bossiniFaz'
import { gradienteTexto, transition } from '../theme'
import { CardCompacto, TituloSecao } from './codelabs/CodelabsDashboard'
import Reveal from './Reveal'

const formatoData = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })

// Abaixo da apresentação na página inicial: os codelabs mais recentes e os números da "Bossini faz".
// Carregado sob demanda, para não pesar na abertura do site.
export default function Destaques() {
  const recentes = codelabs.filter((c) => c.atualizado).slice(0, 3)
  return (
    <Stack spacing={6} sx={{ width: '100%', mt: { xs: 6, sm: 8 }, textAlign: 'left' }}>
      <Reveal>
        <Box component="section" aria-labelledby="titulo-novos-codelabs">
          <TituloSecao
            icone={NewReleasesOutlined}
            extra={
              <Button href="/codelabs/" endIcon={<ArrowForward />} sx={{ flexShrink: 0 }}>
                Ver todos
              </Button>
            }
          >
            <span id="titulo-novos-codelabs">Novos no Bossini Codelabs</span>
          </TituloSecao>
          <Grid container spacing={2}>
            {recentes.map((c) => (
              <Grid key={c.id} size={{ xs: 12, sm: 4 }}>
                <CardCompacto codelab={c}>
                  <Typography variant="caption" color="text.secondary">
                    {formatoData.format(c.atualizado)} · {formatarDuracao(c.duracaoTotal)}
                  </Typography>
                </CardCompacto>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Reveal>

      <Reveal>
        <Box component="section" aria-labelledby="titulo-bossini-faz">
          <TituloSecao
            icone={RocketLaunchOutlined}
            extra={
              <Button href="/bossini-faz/" endIcon={<ArrowForward />} sx={{ flexShrink: 0 }}>
                Ver mais
              </Button>
            }
          >
            <span id="titulo-bossini-faz">Bossini faz</span>
          </TituloSecao>
          <Card
            sx={(theme) => ({
              transition: transition(['border-color', 'box-shadow'], 'medium1'),
              '&:hover': {
                borderColor: theme.alpha(theme.vars.palette.primary.main, 0.7),
                boxShadow: `0 10px 28px -10px ${theme.alpha(theme.vars.palette.primary.main, 0.45)}`,
              },
            })}
          >
            <CardActionArea href="/bossini-faz/" sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Grid container spacing={2}>
                {numeros.map(({ valor, rotulo }) => (
                  <Grid key={rotulo} size={{ xs: 6, sm: 3 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: '2rem', sm: '2.4rem' },
                        fontWeight: 700,
                        lineHeight: 1.1,
                        background: gradienteTexto,
                        backgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      {valor}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{rotulo}</Typography>
                  </Grid>
                ))}
              </Grid>
            </CardActionArea>
          </Card>
        </Box>
      </Reveal>
    </Stack>
  )
}
