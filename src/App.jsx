import { Suspense, useEffect } from 'react'
import { Box, Container, CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import ThemeToggle from './components/ThemeToggle'
import AuroraBackground from './components/AuroraBackground'
import Dock from './components/Dock'
import useHashRoute from './useHashRoute'
import { idsSecoes, secoes } from './secoes'

export default function App() {
  const [rota, navegar] = useHashRoute(idsSecoes, 'inicio')
  const secao = secoes.find((s) => s.id === rota)
  const Secao = secao.componente

  useEffect(() => {
    document.title = rota === 'inicio' ? 'Rodrigo Bossini — Professor e Desenvolvedor' : `${secao.rotulo} · Rodrigo Bossini`
    window.scrollTo(0, 0)
  }, [rota, secao])

  return (
    <ThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline enableColorScheme />
      <AuroraBackground />

      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 10 }}>
        <ThemeToggle />
      </Box>

      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: 9, md: 6 },
          // espaço para o conteúdo não ficar escondido atrás do dock
          pb: { xs: 14, sm: 16 },
        }}
      >
        {/* key força a remontagem, reiniciando as animações de entrada a cada troca de seção */}
        <Container key={rota} maxWidth="md" sx={{ my: 'auto' }}>
          <Suspense fallback={null}>
            <Secao />
          </Suspense>
        </Container>
      </Box>

      <Dock rota={rota} onNavegar={navegar} />
    </ThemeProvider>
  )
}
