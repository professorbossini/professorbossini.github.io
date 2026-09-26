import { lazy, Suspense, useEffect, useState } from 'react'
import { AppBar, Box, Container, CssBaseline, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import theme from './theme'
import ColorModeToggle from './components/ColorModeToggle'
import { PoweredByFaisca } from './components/brand/PoweredByFaisca'
import AuroraBackground from './components/AuroraBackground'
import Navegacao from './components/Navegacao'
import useHashRoute from './useHashRoute'
import { idsSecoes, secoes } from './secoes'

// leitor de codelab em tela cheia (#/codelabs/<id>/<passo>), carregado sob demanda
const CodelabViewer = lazy(() => import('./components/codelabs/CodelabViewer'))

const LARGURA_GAVETA = 300

const fundoGaveta = {
  width: LARGURA_GAVETA,
  border: 'none',
  bgcolor: 'background.paper',
  backgroundImage: 'none',
}

export default function App() {
  const [rota, navegar, parametros] = useHashRoute(idsSecoes, 'inicio')
  const [codelabId, passo] = rota === 'codelabs' ? parametros : []
  const [gavetaAberta, setGavetaAberta] = useState(false)
  const secao = secoes.find((s) => s.id === rota)
  const Secao = secao.componente

  useEffect(() => {
    if (codelabId) return // o leitor define o próprio título
    document.title = rota === 'inicio' ? 'Rodrigo Bossini — Professor e Desenvolvedor' : `${secao.rotulo} · Rodrigo Bossini`
    window.scrollTo(0, 0)
  }, [rota, secao, codelabId])

  const irPara = (id) => {
    navegar(id)
    setGavetaAberta(false)
  }

  if (codelabId) {
    return (
      <ThemeProvider theme={theme} defaultMode="dark">
        <CssBaseline enableColorScheme />
        <Suspense fallback={null}>
          <CodelabViewer id={codelabId} passo={passo} />
        </Suspense>
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
        <Navegacao rota={rota} onNavegar={irPara} />
      </Drawer>

      {/* desktop: gaveta fixa */}
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', md: 'block' }, width: LARGURA_GAVETA, flexShrink: 0 }}
        slotProps={{ paper: { sx: { ...fundoGaveta, bgcolor: 'transparent', borderRight: '1px solid', borderColor: 'divider' } } }}
      >
        <Navegacao rota={rota} onNavegar={irPara} />
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
          pb: 6,
        }}
      >
        {/* key força a remontagem, reiniciando as animações de entrada a cada troca de seção */}
        <Container key={rota} maxWidth={secao.largura ?? 'md'} sx={{ my: 'auto' }}>
          <Suspense fallback={null}>
            <Secao />
          </Suspense>
        </Container>
      </Box>

      {/* selo "feito com Faísca", só na página inicial */}
      {rota === 'inicio' && <PoweredByFaisca />}
    </ThemeProvider>
  )
}
