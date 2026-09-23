import { CssBaseline, Box, Container, Stack, Typography } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import theme, { aiGradient } from './theme'
import ThemeToggle from './components/ThemeToggle'
import AuroraBackground from './components/AuroraBackground'

export default function App() {
  return (
    <ThemeProvider theme={theme} defaultMode="system">
      <CssBaseline enableColorScheme />
      <AuroraBackground />
      <Box component="header" sx={{ position: 'fixed', top: 16, right: 16, zIndex: 10 }}>
        <ThemeToggle />
      </Box>
      <Container component="main" maxWidth="md" sx={{ py: { xs: 10, md: 14 } }}>
        <Stack spacing={2} alignItems="center">
          <Typography
            variant="h1"
            sx={{ background: aiGradient, backgroundClip: 'text', color: 'transparent' }}
          >
            Rodrigo Bossini
          </Typography>
        </Stack>
      </Container>
    </ThemeProvider>
  )
}
