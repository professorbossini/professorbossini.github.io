import { IconButton, Tooltip, Box } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlined from '@mui/icons-material/LightModeOutlined'
import { easing } from '../theme'

const iconSx = (visible) => ({
  position: 'absolute',
  inset: 0,
  display: 'grid',
  placeItems: 'center',
  transition: `transform 400ms ${easing.emphasized}, opacity 250ms`,
  transform: visible ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.5)',
  opacity: visible ? 1 : 0,
})

export default function ThemeToggle() {
  const { mode, systemMode, setMode } = useColorScheme()
  if (!mode) return null

  const resolved = mode === 'system' ? systemMode : mode
  const isDark = resolved === 'dark'
  const label = isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={() => setMode(isDark ? 'light' : 'dark')}
        aria-label={label}
        sx={{
          width: 48,
          height: 48,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'var(--mui-palette-surface-container)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Box sx={{ position: 'relative', width: 24, height: 24 }}>
          <Box sx={iconSx(!isDark)}><DarkModeOutlined /></Box>
          <Box sx={iconSx(isDark)}><LightModeOutlined /></Box>
        </Box>
      </IconButton>
    </Tooltip>
  )
}
