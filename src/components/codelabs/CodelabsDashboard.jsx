import { useState } from 'react'
import { Box, Button, Card, CardActionArea, Chip, Grid, LinearProgress, Stack, Typography } from '@mui/material'
import ArrowBack from '@mui/icons-material/ArrowBack'
import ArrowForward from '@mui/icons-material/ArrowForward'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded'
import HistoryRounded from '@mui/icons-material/HistoryRounded'
import NewReleasesOutlined from '@mui/icons-material/NewReleasesOutlined'
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded'
import RouteOutlined from '@mui/icons-material/RouteOutlined'
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined'
import { buscarCodelab, codelabs, formatarDuracao, lerAcesso } from '../../codelabs'
import { categorias, categoriasDe } from '../../codelabs/categorias'
import { buscarTrilha, trilhas } from '../../codelabs/trilhas'
import { transition } from '../../theme'
import LogoCategoria from './LogoCategoria'

const formatoData = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
const TRINTA_DIAS = 30 * 24 * 60 * 60 * 1000
const concluidos = (n, total) => `${n} de ${total} ${n === 1 ? 'concluído' : 'concluídos'}`

// Situação de um codelab para quem está vendo: não iniciado, em andamento ou concluído
export function situacao(codelab) {
  const { maximo, atual, quando } = lerAcesso(codelab.id)
  const total = codelab.passos.length
  return {
    iniciado: maximo > 0,
    concluido: maximo >= total,
    maximo,
    atual: Math.min(atual || 1, total),
    quando,
    fracao: total ? maximo / total : 0,
  }
}

const linkCodelab = (codelab) => `#/codelabs/${codelab.id}/${situacao(codelab).atual}`

function efeitoHover(theme) {
  return {
    transition: [transition(['border-color', 'box-shadow'], 'medium1'), transition('transform', 'medium2', 'springFast')].join(', '),
    '&:hover': {
      transform: 'translateY(-2px)',
      borderColor: theme.alpha(theme.vars.palette.primary.main, 0.7),
      boxShadow: `0 10px 28px -10px ${theme.alpha(theme.vars.palette.primary.main, 0.45)}`,
    },
  }
}

function TituloSecao({ icone: Icone, children, extra }) {
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', mb: 2 }}>
      <Icone sx={{ color: 'primary.main' }} />
      <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
        {children}
      </Typography>
      {extra}
    </Stack>
  )
}

// Card compacto: logos, título e um rodapé (progresso, data...)
function CardCompacto({ codelab, children }) {
  const cats = categoriasDe(codelab)
  return (
    <Card sx={(theme) => ({ height: '100%', ...efeitoHover(theme) })}>
      <CardActionArea href={linkCodelab(codelab)} sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1.25 }}>
        <Stack direction="row" spacing={0.75}>
          {cats.slice(0, 3).map((c) => (
            <LogoCategoria key={c.nome} categoria={c} tamanho={30} />
          ))}
        </Stack>
        <Typography sx={{ fontWeight: 600, lineHeight: 1.3, flexGrow: 1 }}>{codelab.titulo}</Typography>
        {children}
      </CardActionArea>
    </Card>
  )
}

function ContinueDeOndeParou() {
  const emAndamento = codelabs
    .map((c) => ({ c, s: situacao(c) }))
    .filter(({ s }) => s.iniciado && !s.concluido)
    .sort((a, b) => b.s.quando - a.s.quando)
    .slice(0, 4)
  if (!emAndamento.length) return null

  return (
    <Box component="section" aria-labelledby="titulo-continuar">
      <TituloSecao icone={HistoryRounded}>
        <span id="titulo-continuar">Continue de onde parou</span>
      </TituloSecao>
      <Grid container spacing={2}>
        {emAndamento.map(({ c, s }) => (
          <Grid key={c.id} size={{ xs: 12, sm: 6, lg: 3 }}>
            <CardCompacto codelab={c}>
              <LinearProgress variant="determinate" value={s.fracao * 100} aria-label={`${Math.round(s.fracao * 100)}% concluído`} />
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Passo {s.atual} de {c.passos.length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  Continuar <ArrowForward sx={{ fontSize: 14 }} />
                </Typography>
              </Stack>
            </CardCompacto>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

// Resumo de uma trilha: codelabs existentes, concluídos, tempo total e próximo a fazer
export function resumoTrilha(trilha) {
  const itens = trilha.codelabs.map(buscarCodelab).filter(Boolean)
  const estados = itens.map((c) => ({ c, s: situacao(c) }))
  const concluidos = estados.filter(({ s }) => s.concluido).length
  const proximo = estados.find(({ s }) => !s.concluido)?.c ?? itens[0]
  return {
    itens,
    estados,
    concluidos,
    iniciada: estados.some(({ s }) => s.iniciado),
    minutos: itens.reduce((soma, c) => soma + c.duracaoTotal, 0),
    proximo,
  }
}

function CardTrilha({ trilha }) {
  const r = resumoTrilha(trilha)
  const categoria = categorias[trilha.icone]
  return (
    <Card sx={(theme) => ({ height: '100%', display: 'flex', flexDirection: 'column', ...efeitoHover(theme) })}>
      <CardActionArea href={`#/codelabs/trilha/${trilha.id}`} sx={{ p: 2.25, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1.25 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <LogoCategoria categoria={categoria} tamanho={40} />
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 650, lineHeight: 1.25 }}>{trilha.titulo}</Typography>
            <Typography variant="caption" color="text.secondary">
              {r.itens.length} codelabs · {formatarDuracao(r.minutos)}
            </Typography>
          </Box>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexGrow: 1 }}
        >
          {trilha.descricao}
        </Typography>
        {r.iniciada && (
          <Stack spacing={0.5}>
            <LinearProgress variant="determinate" value={(r.concluidos / r.itens.length) * 100} aria-label={concluidos(r.concluidos, r.itens.length)} />
            <Typography variant="caption" color="text.secondary">
              {concluidos(r.concluidos, r.itens.length)}
            </Typography>
          </Stack>
        )}
      </CardActionArea>
    </Card>
  )
}

function Trilhas() {
  const [todas, setTodas] = useState(false)
  // trilhas já começadas aparecem primeiro
  const ordenadas = [...trilhas].sort((a, b) => Number(resumoTrilha(b).iniciada) - Number(resumoTrilha(a).iniciada))
  const visiveis = todas ? ordenadas : ordenadas.slice(0, 6)
  return (
    <Box component="section" aria-labelledby="titulo-trilhas">
      <TituloSecao icone={RouteOutlined}>
        <span id="titulo-trilhas">Trilhas</span>
      </TituloSecao>
      <Grid container spacing={2}>
        {visiveis.map((t) => (
          <Grid key={t.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <CardTrilha trilha={t} />
          </Grid>
        ))}
      </Grid>
      {trilhas.length > 6 && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            onClick={() => setTodas(!todas)}
            endIcon={<ExpandMoreRounded sx={{ transform: todas ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />}
          >
            {todas ? 'Mostrar menos' : `Ver todas as ${trilhas.length} trilhas`}
          </Button>
        </Box>
      )}
    </Box>
  )
}

function Novidades() {
  const recentes = [...codelabs].filter((c) => c.atualizado).sort((a, b) => b.atualizado - a.atualizado).slice(0, 6)
  return (
    <Box component="section" aria-labelledby="titulo-novidades">
      <TituloSecao icone={NewReleasesOutlined}>
        <span id="titulo-novidades">Novidades</span>
      </TituloSecao>
      <Grid container spacing={2}>
        {recentes.map((c) => (
          <Grid key={c.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <CardCompacto codelab={c}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                {Date.now() - c.atualizado < TRINTA_DIAS && <Chip label="novo" size="small" color="lime" variant="soft" />}
                <Typography variant="caption" color="text.secondary">
                  Atualizado em {formatoData.format(c.atualizado)} · {formatarDuracao(c.duracaoTotal)}
                </Typography>
              </Stack>
            </CardCompacto>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

// Painel de entrada da página de codelabs
export default function CodelabsDashboard() {
  return (
    <Stack spacing={5} sx={{ mb: 6 }}>
      <ContinueDeOndeParou />
      <Trilhas />
      <Novidades />
    </Stack>
  )
}

// Página de uma trilha: a sequência numerada de codelabs, com o progresso de cada um
export function PaginaTrilha({ id }) {
  const trilha = buscarTrilha(id)
  if (!trilha) {
    return (
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Typography variant="h5">Trilha não encontrada</Typography>
        <Button href="#/codelabs" startIcon={<ArrowBack />}>Ver todos os codelabs</Button>
      </Stack>
    )
  }
  const r = resumoTrilha(trilha)
  return (
    <Box component="section">
      <Button href="#/codelabs" startIcon={<ArrowBack />} sx={{ mb: 2 }}>
        Codelabs
      </Button>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 1.5 }}>
        <LogoCategoria categoria={categorias[trilha.icone]} tamanho={56} />
        <Box>
          <Typography variant="overline" color="primary" component="p">
            Trilha
          </Typography>
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '1.6rem', sm: '2.1rem' } }}>
            {trilha.titulo}
          </Typography>
        </Box>
      </Stack>
      <Typography color="text.secondary" sx={{ mb: 2, maxWidth: 720 }}>
        {trilha.descricao}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4, alignItems: { sm: 'center' } }}>
        <Button variant="contained" size="large" href={linkCodelab(r.proximo)} startIcon={<PlayArrowRounded />}>
          {r.iniciada ? 'Continuar a trilha' : 'Começar a trilha'}
        </Button>
        <Typography variant="body2" color="text.secondary">
          {r.itens.length} codelabs · {formatarDuracao(r.minutos)} · {concluidos(r.concluidos, r.itens.length)}
        </Typography>
      </Stack>

      <Stack component="ol" spacing={1.5} sx={{ p: 0, m: 0, listStyle: 'none' }}>
        {r.estados.map(({ c, s }, i) => (
          <Card key={c.id} component="li" sx={(theme) => efeitoHover(theme)}>
            <CardActionArea href={linkCodelab(c)} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={(theme) => ({
                  flexShrink: 0,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 700,
                  border: `1.5px solid ${theme.vars.palette.divider}`,
                  color: theme.vars.palette.text.secondary,
                  ...(s.concluido && { bgcolor: theme.vars.palette.primary.main, borderColor: theme.vars.palette.primary.main, color: theme.vars.palette.primary.contrastText }),
                  ...(s.iniciado && !s.concluido && { borderColor: theme.vars.palette.primary.main, color: theme.vars.palette.primary.main }),
                })}
              >
                {s.concluido ? <CheckCircleRounded sx={{ fontSize: 20 }} /> : i + 1}
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600, lineHeight: 1.3 }}>{c.titulo}</Typography>
                <Stack direction="row" spacing={1.5} sx={{ color: 'text.secondary', alignItems: 'center', mt: 0.5, flexWrap: 'wrap' }}>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <ScheduleOutlined sx={{ fontSize: 15 }} />
                    <Typography variant="caption">{formatarDuracao(c.duracaoTotal)}</Typography>
                  </Stack>
                  <Typography variant="caption">
                    {s.concluido ? 'Concluído' : s.iniciado ? `Em andamento · passo ${s.atual} de ${c.passos.length}` : `${c.passos.length} passos`}
                  </Typography>
                </Stack>
              </Box>
              <ArrowForward sx={{ color: 'text.secondary', flexShrink: 0 }} />
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
