import { lazy, Suspense, useEffect, useState } from 'react'
import { AppBar, Box, Container, CssBaseline, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import theme from './theme'
import ColorModeToggle from './components/ColorModeToggle'
import { PoweredByFaisca } from './components/brand/PoweredByFaisca'
import AuroraBackground from './components/AuroraBackground'
import Navegacao from './components/Navegacao'
import EntrarGlobal from './components/conta/EntrarGlobal'
import useRota from './useRota'
import { caminhoDe, idsSecoes, secoes } from './secoes'
import { definirMeta, paginas, tituloDaPagina, tituloDaTrilha } from './paginas'
import { buscarTrilha } from './codelabs/trilhas'
import { registrarVisita } from './analytics'

// leitor de codelab em tela cheia (/codelabs/<id>/<passo>), carregado sob demanda
const CodelabViewer = lazy(() => import('./components/codelabs/CodelabViewer'))

const LARGURA_GAVETA = 300

const fundoGaveta = {
  width: LARGURA_GAVETA,
  border: 'none',
  bgcolor: 'background.paper',
  backgroundImage: 'none',
}

export default function App() {
  const [rota, parametros] = useRota(idsSecoes, 'inicio')
  // /codelabs/<id>/<passo> abre o leitor; /codelabs/trilha/<id> fica na página de codelabs
  const [codelabId, passo] = rota === 'codelabs' && parametros[0] !== 'trilha' ? parametros : []
  const [gavetaAberta, setGavetaAberta] = useState(false)
  const secao = secoes.find((s) => s.id === rota)
  const Secao = secao.componente

  const trilhaId = rota === 'codelabs' && parametros[0] === 'trilha' ? parametros[1] : null
  const caminho = window.location.pathname

  useEffect(() => registrarVisita(caminho), [caminho])

  useEffect(() => {
    if (codelabId) return // o leitor define o próprio título
    const trilha = trilhaId && buscarTrilha(trilhaId)
    definirMeta(
      trilha
        ? { titulo: tituloDaTrilha(trilha), descricao: trilha.descricao, caminho: `/codelabs/trilha/${trilha.id}/` }
        : { titulo: tituloDaPagina(rota), descricao: paginas[rota].descricao, caminho: caminhoDe(rota) },
    )
    window.scrollTo(0, 0)
  }, [rota, codelabId, trilhaId])

  const fecharGaveta = () => setGavetaAberta(false)

  if (codelabId) {
    return (
      <ThemeProvider theme={theme} defaultMode="dark">
        <CssBaseline enableColorScheme />
        <Suspense fallback={null}>
          <CodelabViewer id={codelabId} passo={passo} />
        </Suspense>
        <EntrarGlobal />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline enableColorScheme />
      <AuroraBackground />

      {/* celular: barra superior com botão de menu */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ display: { md: 'none' } }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton edge="start" aria-label="Abrir menu" onClick={() => setGavetaAberta(true)}>
            <MenuIcon />
          </IconButton>
          <Typography sx={{ flexGrow: 1, fontWeight: 500 }} noWrap>
            {secao.rotulo}
          </Typography>
          <ColorModeToggle />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={gavetaAberta}
        onClose={() => setGavetaAberta(false)}
        sx={{ display: { md: 'none' } }}
        slotProps={{ paper: { sx: { ...fundoGaveta, borderRadius: '0 28px 28px 0' } } }}
      >
        <Navegacao rota={rota} onNavegar={fecharGaveta} />
      </Drawer>

      {/* desktop: gaveta fixa */}
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', md: 'block' }, width: LARGURA_GAVETA, flexShrink: 0 }}
        slotProps={{ paper: { sx: { ...fundoGaveta, bgcolor: 'transparent', borderRight: '1px solid', borderColor: 'divider' } } }}
      >
        <Navegacao rota={rota} />
      </Drawer>

      <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'fixed', top: 16, right: 16, zIndex: 10 }}>
        <ColorModeToggle />
      </Box>

      <Box
        component="main"
        sx={{
          ml: { md: `${LARGURA_GAVETA}px` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: 10, md: 6 },
          pb: rota === 'inicio' ? 12 : 6, // espaço para o selo fixo do Faísca no fim da página inicial
        }}
      >
        {/* key força a remontagem, reiniciando as animações de entrada a cada troca de seção */}
        <Container key={rota} maxWidth={secao.largura ?? 'md'} sx={{ my: 'auto' }}>
          <Suspense fallback={null}>
            <Secao parametros={parametros} />
          </Suspense>
        </Container>
      </Box>

      <EntrarGlobal />

      {/* selo "feito com Faísca", só na página inicial */}
      {rota === 'inicio' && <PoweredByFaisca />}
    </ThemeProvider>
  )
}
