import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import ArrowBack from '@mui/icons-material/ArrowBack'
import ArrowForward from '@mui/icons-material/ArrowForward'
import CheckRounded from '@mui/icons-material/CheckRounded'
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import FormatListNumbered from '@mui/icons-material/FormatListNumbered'
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined'
import ColorModeToggle from '../ColorModeToggle'
import { buscarCodelab, formatarDuracao, lerProgresso, salvarProgresso } from '../../codelabs'
import { renderizarPasso } from '../../codelabs/markdown'
import { transition } from '../../theme'
import { conteudoSx } from './conteudoSx'
import useBaixarPdf from './useBaixarPdf'

const LARGURA_PASSOS = 320

function ListaDePassos({ codelab, atual, visitado, onEscolher }) {
  return (
    <List component="nav" aria-label="Passos do codelab" sx={{ p: 1.5 }}>
      {codelab.passos.map((passo, i) => {
        const numero = i + 1
        const ativo = numero === atual
        const feito = numero <= visitado && !ativo
        return (
          <ListItemButton
            key={numero}
            selected={ativo}
            aria-current={ativo ? 'step' : undefined}
            onClick={() => onEscolher(numero)}
            sx={(theme) => ({
              borderRadius: 99,
              gap: 1.5,
              py: 1,
              mb: 0.25,
              alignItems: 'center',
              '&.Mui-selected, &.Mui-selected:hover': {
                bgcolor: theme.vars.palette.primary.container,
                color: theme.vars.palette.primary.onContainer,
              },
            })}
          >
            <Box
              sx={(theme) => ({
                flexShrink: 0,
                width: 26,
                height: 26,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: `1.5px solid ${theme.vars.palette.divider}`,
                color: theme.vars.palette.text.secondary,
                transition: transition(['background-color', 'color', 'border-color'], 'short4'),
                ...((ativo || feito) && {
                  bgcolor: theme.vars.palette.primary.main,
                  borderColor: theme.vars.palette.primary.main,
                  color: theme.vars.palette.primary.contrastText,
                }),
              })}
            >
              {feito ? <CheckRounded sx={{ fontSize: 16 }} /> : numero}
            </Box>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: ativo ? 600 : 400, lineHeight: 1.35 }}>
              {passo.titulo}
            </Typography>
          </ListItemButton>
        )
      })}
    </List>
  )
}

export default function CodelabViewer({ id, passo: passoDaUrl }) {
  const codelab = buscarCodelab(id)
  const total = codelab?.passos.length ?? 0
  const atual = Math.min(Math.max(Number(passoDaUrl) || 1, 1), total || 1)
  const [visitado, setVisitado] = useState(() => (codelab ? lerProgresso(codelab.id) : 0))
  const [gavetaAberta, setGavetaAberta] = useState(false)
  const conteudo = useRef(null)
  const { baixar, baixando, aviso } = useBaixarPdf()

  const irPara = (numero) => {
    window.location.hash = `/codelabs/${id}/${numero}`
    setGavetaAberta(false)
  }

  // guarda o passo mais adiantado já visitado e sobe para o topo a cada troca
  useEffect(() => {
    if (!codelab) return
    window.scrollTo(0, 0)
    document.title = `${codelab.passos[atual - 1].titulo} · ${codelab.titulo}`
    if (atual > visitado) {
      setVisitado(atual)
      salvarProgresso(codelab.id, atual)
    }
  }, [atual, codelab, visitado])

  // setas do teclado navegam entre os passos
  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.target.closest('input, textarea, [contenteditable]') || e.altKey || e.metaKey || e.ctrlKey) return
      if (e.key === 'ArrowRight' && atual < total) irPara(atual + 1)
      if (e.key === 'ArrowLeft' && atual > 1) irPara(atual - 1)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  })

  const html = useMemo(
    () => (codelab ? renderizarPasso(codelab.passos[atual - 1].markdown, codelab.id) : ''),
    [codelab, atual],
  )

  // botão "Copiar" dos blocos de código (delegação de eventos no HTML renderizado)
  const aoClicarNoConteudo = async (e) => {
    const botao = e.target.closest('[data-copiar]')
    if (!botao) return
    const codigo = botao.parentElement.querySelector('code').innerText
    try {
      await navigator.clipboard.writeText(codigo)
      botao.textContent = 'Copiado!'
      botao.classList.add('copiado')
      setTimeout(() => {
        botao.textContent = 'Copiar'
        botao.classList.remove('copiado')
      }, 1600)
    } catch {
      botao.textContent = 'Selecione e copie'
    }
  }

  if (!codelab) {
    return (
      <Stack sx={{ minHeight: '100vh', alignItems: 'center', justifyContent: 'center', gap: 2, p: 3 }}>
        <Typography variant="h4" component="h1">Codelab não encontrado</Typography>
        <Button variant="contained" href="#/codelabs" startIcon={<ArrowBack />}>Ver todos os codelabs</Button>
      </Stack>
    )
  }

  const passo = codelab.passos[atual - 1]
  const restante = codelab.passos.slice(atual - 1).reduce((soma, p) => soma + p.duracao, 0)
  const ultimo = atual === total

  const lista = <ListaDePassos codelab={codelab} atual={atual} visitado={visitado} onEscolher={irPara} />

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar sx={{ gap: 1 }}>
          <Tooltip title="Todos os codelabs">
            <IconButton edge="start" href="#/codelabs" aria-label="Voltar para todos os codelabs">
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <IconButton
            aria-label="Ver os passos"
            onClick={() => setGavetaAberta(true)}
            sx={{ display: { md: 'none' } }}
          >
            <FormatListNumbered />
          </IconButton>
          <Typography component="h1" sx={{ flexGrow: 1, fontWeight: 600, fontSize: { xs: '0.95rem', sm: '1.05rem' } }} noWrap>
            {codelab.titulo}
          </Typography>
          <Chip
            icon={<ScheduleOutlined />}
            label={`${formatarDuracao(restante)} restantes`}
            variant="soft"
            color="primary"
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          />
          {codelab.pdf && (
            <Tooltip title="Baixar a apostila em PDF">
              <IconButton onClick={() => baixar(codelab.pdf)} disabled={baixando} aria-label="Baixar PDF">
                <FileDownloadOutlined />
              </IconButton>
            </Tooltip>
          )}
          <ColorModeToggle />
        </Toolbar>
        <LinearProgress
          variant="determinate"
          value={(atual / total) * 100}
          aria-label={`Passo ${atual} de ${total}`}
          sx={{ height: 3, borderRadius: 0 }}
        />
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', md: 'block' } }}
        slotProps={{
          paper: {
            sx: {
              width: LARGURA_PASSOS,
              top: 67,
              height: 'calc(100% - 67px)',
              bgcolor: 'background.default',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          },
        }}
      >
        {lista}
      </Drawer>
      <Drawer
        variant="temporary"
        open={gavetaAberta}
        onClose={() => setGavetaAberta(false)}
        sx={{ display: { md: 'none' } }}
        slotProps={{ paper: { sx: { width: LARGURA_PASSOS, borderRadius: '0 28px 28px 0' } } }}
      >
        <Typography variant="overline" sx={{ px: 3, pt: 2.5, color: 'text.secondary' }}>
          Passos
        </Typography>
        {lista}
      </Drawer>

      <Box component="main" sx={{ ml: { md: `${LARGURA_PASSOS}px` }, pt: { xs: 11, sm: 12 }, pb: 16, px: { xs: 1.5, sm: 3 } }}>
        <Paper
          key={atual}
          variant="outlined"
          sx={{
            maxWidth: 860,
            mx: 'auto',
            p: { xs: 2.5, sm: 5 },
            '@keyframes entrarPasso': {
              from: { opacity: 0, transform: 'translateY(12px)' },
              to: { opacity: 1, transform: 'none' },
            },
            animation: 'entrarPasso 400ms cubic-bezier(0.05, 0.7, 0.1, 1)',
          }}
        >
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Passo {atual} de {total} · {formatarDuracao(passo.duracao)}
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', sm: '2rem' }, mb: 3 }}>
            {atual}. {passo.titulo}
          </Typography>
          <Box ref={conteudo} onClick={aoClicarNoConteudo} sx={conteudoSx} dangerouslySetInnerHTML={{ __html: html }} />
        </Paper>
      </Box>

      {/* navegação entre passos, como no Google Codelabs */}
      <Box
        sx={(theme) => ({
          position: 'fixed',
          bottom: 0,
          left: { xs: 0, md: LARGURA_PASSOS },
          right: 0,
          px: { xs: 1.5, sm: 3 },
          py: 1.5,
          display: 'flex',
          justifyContent: 'center',
          bgcolor: theme.alpha(theme.vars.palette.background.default, 0.82),
          backdropFilter: 'saturate(180%) blur(14px)',
          borderTop: `1px solid ${theme.vars.palette.divider}`,
        })}
      >
        <Stack direction="row" sx={{ width: '100%', maxWidth: 860, justifyContent: 'space-between' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => irPara(atual - 1)}
            sx={{ visibility: atual > 1 ? 'visible' : 'hidden' }}
          >
            Voltar
          </Button>
          {ultimo ? (
            <Button variant="contained" size="large" href="#/codelabs" endIcon={<CheckRounded />}>
              Concluir
            </Button>
          ) : (
            <Button variant="contained" size="large" onClick={() => irPara(atual + 1)} endIcon={<ArrowForward />}>
              Próximo
            </Button>
          )}
        </Stack>
      </Box>
      {aviso}
    </Box>
  )
}
