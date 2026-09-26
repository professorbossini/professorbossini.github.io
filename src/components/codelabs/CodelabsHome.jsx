import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Chip,
  ButtonBase,
  Grid,
  InputAdornment,
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
import { categoriasDe, categorias } from '../../codelabs/categorias'
import { transition } from '../../theme'
import Reveal from '../Reveal'
import { BossiniMark } from '../brand/BossiniMark'
import AvisoFormato from './AvisoFormato'
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

// Menu lateral estreito com as categorias, no estilo "navigation rail" do Material 3:
// ícone em cima, nome embaixo e o destaque em pílula no item ativo. No celular vira uma fileira.
function TrilhoCategorias({ opcoes, atual, onEscolher }) {
  return (
    <Box
      component="nav"
      aria-label="Categorias de codelabs"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'row', md: 'column' },
        gap: { xs: 1, md: 1.5 },
        overflowX: { xs: 'auto', md: 'visible' },
        width: { md: 88 },
        py: { md: 1.5 },
        borderRadius: '20px',
        border: { md: '1px solid' },
        borderColor: { md: 'divider' },
        bgcolor: { md: 'background.paper' },
      }}
    >
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'center', fontSize: '0.625rem' }}
      >
        Categorias
      </Typography>
      {opcoes.map((o) => {
        const ativo = atual === o.chave
        return (
          <ButtonBase
            key={o.nome}
            onClick={() => onEscolher(o.chave)}
            aria-pressed={ativo}
            aria-label={`${o.nome} (${o.total} ${o.total === 1 ? 'codelab' : 'codelabs'})`}
            sx={{
              flexDirection: 'column',
              gap: 0.5,
              px: 1,
              py: 0.5,
              minWidth: 72,
              borderRadius: '16px',
              flexShrink: 0,
              '&:hover .indicador': { bgcolor: ativo ? 'primary.container' : 'action.hover' },
            }}
          >
            <Box
              className="indicador"
              sx={{
                width: 56,
                height: 32,
                borderRadius: 99,
                display: 'grid',
                placeItems: 'center',
                bgcolor: ativo ? 'primary.container' : 'transparent',
                color: ativo ? 'primary.onContainer' : 'text.secondary',
                transition: transition(['background-color', 'color'], 'short4'),
              }}
            >
              {o.categoria ? <LogoCategoria categoria={o.categoria} tamanho={24} /> : <AppsOutlined fontSize="small" />}
            </Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: ativo ? 700 : 500,
                color: ativo ? 'text.primary' : 'text.secondary',
                lineHeight: 1.2,
                textAlign: 'center',
              }}
            >
              {o.nome}
            </Typography>
          </ButtonBase>
        )
      })}
    </Box>
  )
}

// Tags com ícone e nome de cada categoria a que o codelab pertence
function TagsCategorias({ categorias: lista }) {
  if (!lista.length) return null
  return (
    <Stack direction="row" useFlexGap spacing={0.75} sx={{ flexWrap: 'wrap' }} aria-label="Categorias">
      {lista.map((c) => (
        <Chip
          key={c.nome}
          size="small"
          variant="soft"
          color="neutral"
          icon={<LogoCategoria categoria={c} tamanho={18} />}
          label={c.nome}
          sx={{ pl: 0.5, '& .MuiChip-icon': { ml: 0 } }}
        />
      ))}
    </Stack>
  )
}

function CardCodelab({ codelab, onBaixar, baixando }) {
  const cats = categoriasDe(codelab)
  const categoria = cats[0] ?? null
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
        {/* logos de todas as categorias do codelab, lado a lado */}
        <Stack direction="row" spacing={1.5}>
          {cats.length ? (
            cats.map((c) => <LogoCategoria key={c.nome} categoria={c} tamanho={64} />)
          ) : (
            <LogoCategoria categoria={null} tamanho={64} />
          )}
        </Stack>
      </Box>

      <Stack spacing={1.5} sx={{ p: 2.5, flexGrow: 1 }}>
        <TagsCategorias categorias={cats} />
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
        <Typography variant="overline" color="primary" component="p">
          // codelabs
        </Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
          <BossiniMark size={52} />
          <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', sm: '2.4rem' } }}>
            Bossini Codelabs
          </Typography>
        </Stack>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 640 }}>
          Tutoriais guiados, passo a passo, para aprender fazendo. Cada codelab também tem a apostila
          completa em PDF.
        </Typography>
      </Reveal>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 4 }, alignItems: 'flex-start' }}>
        <Reveal delay={60} sx={{ position: { md: 'sticky' }, top: { md: 24 }, flexShrink: 0, width: { xs: '100%', md: 'auto' } }}>
          <TrilhoCategorias opcoes={opcoes} atual={categoria} onEscolher={setCategoria} />
        </Reveal>

        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
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
        </Box>
      </Box>
      <AvisoFormato />
      {aviso}
    </Box>
  )
}
