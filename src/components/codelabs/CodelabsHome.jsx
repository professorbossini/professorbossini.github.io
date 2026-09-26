import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined'
import FormatListNumbered from '@mui/icons-material/FormatListNumbered'
import EventOutlined from '@mui/icons-material/EventOutlined'
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded'
import AppsOutlined from '@mui/icons-material/AppsOutlined'
import { codelabs, formatarDuracao, lerProgresso } from '../../codelabs'
import { categoriaDe, categorias } from '../../codelabs/categorias'
import { transition } from '../../theme'
import Reveal from '../Reveal'
import SectionTitle from '../SectionTitle'
import useBaixarPdf from './useBaixarPdf'

const formatoData = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
const normalizar = (texto) => texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

// Logo da categoria num quadrado claro (o texto do logo da AWS é escuro)
function LogoCategoria({ categoria, tamanho = 40 }) {
  if (!categoria) return <AppsOutlined />
  return (
    <Box
      sx={{
        width: tamanho,
        height: tamanho,
        flexShrink: 0,
        borderRadius: `${tamanho * 0.28}px`,
        bgcolor: '#fff',
        border: '1px solid',
        borderColor: 'divider',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Box component="img" src={categoria.logo} alt="" sx={{ width: '72%', height: '72%', objectFit: 'contain' }} />
    </Box>
  )
}

function CardCodelab({ codelab, onBaixar, baixando }) {
  const categoria = categoriaDe(codelab)
  const progresso = lerProgresso(codelab.id)
  const url = `#/codelabs/${codelab.id}/${progresso || 1}`

  return (
    <Card
      sx={(theme) => ({
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: [
          transition(['border-color', 'box-shadow'], 'medium1'),
          transition('transform', 'medium2', 'springFast'),
        ].join(', '),
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: theme.alpha(theme.vars.palette.primary.main, 0.7),
          boxShadow: `0 12px 32px -10px ${theme.alpha(theme.vars.palette.primary.main, 0.45)}`,
        },
      })}
    >
      {/* faixa no topo com o ícone do codelab, na cor da categoria */}
      <Box
        sx={{
          position: 'relative',
          height: 116,
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
          background: categoria
            ? `radial-gradient(circle at 20% 20%, ${categoria.cor}40, transparent 60%), var(--site-gradiente)`
            : 'var(--site-gradiente)',
        }}
      >
        <LogoCategoria categoria={categoria} tamanho={64} />
        <Chip
          label={categoria?.nome ?? 'Codelab'}
          size="small"
          sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'rgba(255,255,255,0.9)', color: '#1C1433', fontWeight: 600 }}
        />
      </Box>

      <Stack spacing={1.5} sx={{ p: 2.5, flexGrow: 1 }}>
        <Typography variant="h6" component="h3" sx={{ lineHeight: 1.3 }}>
          {codelab.titulo}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {codelab.resumo}
        </Typography>
        <Stack direction="row" useFlexGap spacing={2} sx={{ flexWrap: 'wrap', color: 'text.secondary', mt: 'auto !important', pt: 1 }}>
          {[
            [ScheduleOutlined, formatarDuracao(codelab.duracaoTotal)],
            [FormatListNumbered, `${codelab.passos.length} passos`],
            codelab.atualizado && [EventOutlined, `Atualizado em ${formatoData.format(codelab.atualizado)}`],
          ]
            .filter(Boolean)
            .map(([Icone, texto]) => (
              <Stack key={texto} direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Icone sx={{ fontSize: 16 }} />
                <Typography variant="caption">{texto}</Typography>
              </Stack>
            ))}
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ px: 2.5, pb: 2.5, flexWrap: 'wrap', rowGap: 1 }}>
        <Button variant="contained" href={url} startIcon={<PlayArrowRounded />}>
          {progresso > 1 ? `Continuar do passo ${progresso}` : 'Começar'}
        </Button>
        {codelab.pdf && (
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlined />}
            onClick={() => onBaixar(codelab.pdf)}
            disabled={baixando}
          >
            {baixando ? 'Baixando…' : 'Baixar PDF'}
          </Button>
        )}
      </Stack>
    </Card>
  )
}

export default function CodelabsHome() {
  const [categoria, setCategoria] = useState(null)
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState('recentes')
  const { baixar, baixando, aviso } = useBaixarPdf()

  const contagem = (chave) => codelabs.filter((c) => c.categorias.includes(chave)).length
  const opcoes = [
    { chave: null, nome: 'Todas', total: codelabs.length },
    ...Object.entries(categorias).map(([chave, c]) => ({ chave, nome: c.nome, total: contagem(chave), categoria: c })),
  ]

  const visiveis = useMemo(() => {
    const termo = normalizar(busca.trim())
    return codelabs
      .filter((c) => !categoria || c.categorias.includes(categoria))
      .filter((c) => !termo || normalizar([c.titulo, c.resumo, ...c.tags].join(' ')).includes(termo))
      .sort((a, b) => {
        if (ordem === 'az') return a.titulo.localeCompare(b.titulo, 'pt')
        if (ordem === 'duracao') return a.duracaoTotal - b.duracaoTotal
        return (b.atualizado ?? 0) - (a.atualizado ?? 0)
      })
  }, [categoria, busca, ordem])

  return (
    <Box component="section">
      <Reveal>
        <SectionTitle eyebrow="// codelabs">Codelabs</SectionTitle>
        <Typography color="text.secondary" sx={{ mt: -2, mb: 4, maxWidth: 640 }}>
          Tutoriais guiados, passo a passo, para aprender fazendo. Cada codelab também tem a apostila
          completa em PDF.
        </Typography>
      </Reveal>

      <Grid container spacing={3}>
        {/* categorias: coluna à esquerda no desktop, chips no celular */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Reveal delay={60}>
            <Typography variant="overline" color="text.secondary" component="p" sx={{ mb: 1, display: { xs: 'none', md: 'block' } }}>
              Categorias
            </Typography>
            <List component="nav" aria-label="Categorias" sx={{ display: { xs: 'none', md: 'block' }, p: 0 }}>
              {opcoes.map((o) => (
                <ListItemButton
                  key={o.nome}
                  selected={categoria === o.chave}
                  onClick={() => setCategoria(o.chave)}
                  sx={(theme) => ({
                    borderRadius: 99,
                    mb: 0.5,
                    '&.Mui-selected, &.Mui-selected:hover': {
                      bgcolor: theme.vars.palette.primary.container,
                      color: theme.vars.palette.primary.onContainer,
                    },
                  })}
                >
                  <ListItemIcon sx={{ mr: 1.5 }}>
                    {o.categoria ? <LogoCategoria categoria={o.categoria} tamanho={28} /> : <AppsOutlined />}
                  </ListItemIcon>
                  <ListItemText primary={o.nome} />
                  <Typography variant="caption" color="text.secondary">{o.total}</Typography>
                </ListItemButton>
              ))}
            </List>
            <Stack direction="row" useFlexGap spacing={1} sx={{ display: { xs: 'flex', md: 'none' }, flexWrap: 'wrap' }}>
              {opcoes.map((o) => (
                <Chip
                  key={o.nome}
                  label={`${o.nome} · ${o.total}`}
                  onClick={() => setCategoria(o.chave)}
                  color={categoria === o.chave ? 'primary' : 'default'}
                  variant={categoria === o.chave ? 'soft' : 'outlined'}
                />
              ))}
            </Stack>
          </Reveal>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Reveal delay={120}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 3, alignItems: { sm: 'center' } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar codelab…"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined />
                      </InputAdornment>
                    ),
                    'aria-label': 'Buscar codelab',
                  },
                }}
              />
              <ToggleButtonGroup
                size="small"
                exclusive
                value={ordem}
                onChange={(_, valor) => valor && setOrdem(valor)}
                aria-label="Ordenar codelabs"
                sx={{ flexShrink: 0 }}
              >
                <ToggleButton value="recentes">Recentes</ToggleButton>
                <ToggleButton value="az">A–Z</ToggleButton>
                <ToggleButton value="duracao">Duração</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            {visiveis.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
                Nenhum codelab encontrado.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {visiveis.map((c) => (
                  <Grid key={c.id} size={{ xs: 12, sm: 6 }}>
                    <CardCodelab codelab={c} onBaixar={baixar} baixando={baixando} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Reveal>
        </Grid>
      </Grid>
      {aviso}
    </Box>
  )
}
