import { Box, Typography } from '@mui/material'
import { aiGradient } from '../theme'

export default function Rodape() {
  return (
    <Box component="footer" sx={{ textAlign: 'center', pb: 6 }}>
      <Box sx={{ height: '1px', background: aiGradient, opacity: 0.5, mb: 4 }} />
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Rodrigo Bossini · Eterno aprendiz
      </Typography>
    </Box>
  )
}
