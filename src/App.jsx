import { CssBaseline, Box, Container, Stack } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import ThemeToggle from './components/ThemeToggle'
import AuroraBackground from './components/AuroraBackground'
import Hero from './components/Hero'
import Links from './components/Links'

export default function App() {
  return (
    <ThemeProvider theme={theme} defaultMode="system">
      <CssBaseline enableColorScheme />
      <AuroraBackground />
      <Box component="header" sx={{ position: 'fixed', top: 16, right: 16, zIndex: 10 }}>
        <ThemeToggle />
      </Box>
      <Container component="main" maxWidth="md" sx={{ py: { xs: 10, md: 14 } }}>
        <Stack spacing={{ xs: 12, md: 16 }}>
          <Hero />
          <Links />
        </Stack>
      </Container>
    </ThemeProvider>
  )
}
