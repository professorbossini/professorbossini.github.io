import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import OpenInNew from '@mui/icons-material/OpenInNew'
import RefreshOutlined from '@mui/icons-material/RefreshOutlined'
import { aiGradient, fontMono } from '../theme'
import { categorias, pcloudRaiz, usePastas } from '../material'
import GlowCard from './GlowCard'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

const formatoMes = new Intl.DateTimeFormat('pt-BR', { month: 'short' })
// "mai 2026" em vez de "mai. de 2026", que quebrava linha nos cards
const formatarData = (data) => `${formatoMes.format(data).replace('.', '')} ${data.getFullYear()}`

// Ignora acentos e maiúsculas na busca
const normalizar = (texto) => texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

function IconePasta({ pasta }) {
  const { logo, icone: Icone, filtroEscuro } = pasta
  return (
    <Box
      sx={{
        width: 48,
        height: 48,
        flexShrink: 0,
        borderRadius: '14px',
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'var(--mui-palette-surface-containerHigh)',
        color: 'primary.main',
      }}
    >
      {logo ? (
        <Box
          component="img"
          src={logo}
          alt=""
          sx={(theme) => ({
            width: 28,
            height: 28,
            ...(filtroEscuro && theme.applyStyles('dark', { filter: filtroEscuro })),
          })}
        />
      ) : (
        <Icone />
      )}
    </Box>
  )
}

function CardPasta({ pasta }) {
  return (
    <GlowCard href={pasta.url}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', width: '100%' }}>
        <IconePasta pasta={pasta} />
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography sx={{ fontWeight: 500, lineHeight: 1.3 }}>{pasta.nome}</Typography>
          <Stack direction="row" useFlexGap spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', mt: 0.5 }}>
            <Typography sx={{ fontFamily: fontMono, fontSize: 12, color: 'text.secondary', whiteSpace: 'nowrap' }}>
              {pasta.itens} {pasta.itens === 1 ? 'item' : 'itens'} · {formatarData(pasta.modificado)}
            </Typography>
            {pasta.novo && (
              <Box
                sx={{
                  px: 0.75,
                  borderRadius: '6px',
                  fontSize: 11,
                  fontWeight: 600,
                  lineHeight: '18px',
                  color: '#fff',
                  background: aiGradient,
                }}
              >
                novo
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </GlowCard>
  )
}

export default function Material() {
  const { status, pastas, tentarDeNovo } = usePastas()
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState(null)
  const [ordem, setOrdem] = useState('az')

  const visiveis = useMemo(() => {
    if (!pastas) return []
    const termo = normalizar(busca.trim())
    return pastas
      .filter((p) => !categoria || p.categoria === categoria)
      .filter((p) => !termo || normalizar(p.nome).includes(termo))
      .sort((a, b) => (ordem === 'az' ? a.nome.localeCompare(b.nome, 'pt') : b.modificado - a.modificado))
  }, [pastas, busca, categoria, ordem])

  const contagem = (cat) => pastas?.filter((p) => p.categoria === cat).length ?? 0

  return (
    <Box component="section">
      <Reveal>
        <SectionTitle eyebrow="// material didático">Material didático</SectionTitle>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mt: -2, mb: 4, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
        >
          <Typography color="text.secondary">
            Apostilas, slides e exercícios das minhas disciplinas. Escolha uma pasta para abri-la no pCloud.
          </Typography>
          <Button
            variant="outlined"
            href={pcloudRaiz}
            target="_blank"
            rel="noopener"
            endIcon={<OpenInNew />}
            sx={{ flexShrink: 0, alignSelf: { xs: 'flex-start', sm: 'auto' }, borderColor: 'var(--mui-palette-surface-outline)' }}
          >
            Abrir tudo no pCloud
          </Button>
        </Stack>
      </Reveal>

      <Reveal delay={80}>
        <TextField
          fullWidth
          placeholder="Buscar pasta…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
              'aria-label': 'Buscar pasta',
            },
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 999,
              bgcolor: 'var(--mui-palette-surface-container)',
              height: 56,
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'var(--mui-palette-surface-outline)' },
            },
          }}
        />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{ mb: 3, justifyContent: 'space-between', alignItems: { md: 'center' } }}
        >
          <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Chip
              label="Todas"
              onClick={() => setCategoria(null)}
              color={categoria === null ? 'primary' : 'default'}
              variant={categoria === null ? 'filled' : 'outlined'}
            />
            {categorias.map((cat) => (
              <Chip
                key={cat}
                label={pastas ? `${cat} · ${contagem(cat)}` : cat}
                onClick={() => setCategoria(categoria === cat ? null : cat)}
                color={categoria === cat ? 'primary' : 'default'}
                variant={categoria === cat ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={ordem}
            onChange={(_, valor) => valor && setOrdem(valor)}
            aria-label="Ordenar pastas"
            sx={{ flexShrink: 0, '& .MuiToggleButton-root': { px: 2, textTransform: 'none', borderRadius: 999 } }}
          >
            <ToggleButton value="az">A–Z</ToggleButton>
            <ToggleButton value="recentes">Recentes</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Reveal>

      {status === 'carregando' && (
        <Grid container spacing={2}>
          {Array.from({ length: 9 }, (_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={96} sx={{ borderRadius: '28px' }} />
            </Grid>
          ))}
        </Grid>
      )}

      {status === 'erro' && (
        <Alert
          severity="warning"
          sx={{ borderRadius: '20px' }}
          action={
            <Stack direction="row" spacing={1}>
              <Button color="inherit" size="small" startIcon={<RefreshOutlined />} onClick={tentarDeNovo}>
                Tentar de novo
              </Button>
              <Button color="inherit" size="small" href={pcloudRaiz} target="_blank" rel="noopener">
                Abrir no pCloud
              </Button>
            </Stack>
          }
        >
          Não consegui carregar a lista de pastas agora.
        </Alert>
      )}

      {status === 'ok' && visiveis.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
          Nenhuma pasta encontrada{busca && <> para “{busca}”</>}.
        </Typography>
      )}

      {status === 'ok' && (
        <Grid container spacing={2}>
          {visiveis.map((pasta, i) => (
            <Grid key={pasta.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Reveal delay={Math.min(i * 30, 400)} sx={{ height: '100%' }}>
                <CardPasta pasta={pasta} />
              </Reveal>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
