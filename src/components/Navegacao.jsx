import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import ArrowOutward from '@mui/icons-material/ArrowOutward'
import { aiGradient, easing } from '../theme'
import { materialDidatico } from '../data'
import { secoes } from '../secoes'

const itemSx = {
  borderRadius: 999,
  minHeight: 56,
  px: 2.5,
  mb: 0.5,
  transition: `background-color 250ms ${easing.emphasized}, color 250ms`,
  '& .MuiListItemIcon-root': { minWidth: 40, color: 'inherit' },
  '&.Mui-selected': {
    color: 'primary.main',
    bgcolor: 'var(--mui-palette-surface-containerHigh)',
    '& .MuiListItemText-primary': { fontWeight: 600 },
  },
  '&.Mui-selected:hover': { bgcolor: 'var(--mui-palette-surface-containerHigh)' },
}

export default function Navegacao({ rota, onNavegar }) {
  return (
    <Stack sx={{ height: '100%', p: 1.5 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', px: 1.5, py: 2.5 }}>
        <Box
          component="img"
          src="/images/perfil.jpg"
          alt=""
          sx={{ width: 44, height: 44, borderRadius: '14px', objectFit: 'cover' }}
        />
        <Box>
          <Typography sx={{ fontWeight: 600, lineHeight: 1.2 }}>Rodrigo Bossini</Typography>
          <Typography variant="body2" color="text.secondary">Professor e dev</Typography>
        </Box>
      </Stack>

      <List component="nav" aria-label="Seções do site" sx={{ mt: 1 }}>
        {secoes.map(({ id, rotulo, icone: Icone }) => (
          <ListItemButton
            key={id}
            selected={rota === id}
            aria-current={rota === id ? 'page' : undefined}
            onClick={() => onNavegar(id)}
            sx={itemSx}
          >
            <ListItemIcon><Icone /></ListItemIcon>
            <ListItemText primary={rotulo} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 1.5, mx: 2 }} />

      <List>
        <ListItemButton component="a" href={materialDidatico} target="_blank" rel="noopener" sx={itemSx}>
          <ListItemIcon><MenuBookOutlined /></ListItemIcon>
          <ListItemText primary="Material didático" />
          <ArrowOutward sx={{ fontSize: 18, color: 'text.secondary' }} />
        </ListItemButton>
      </List>

      <Box sx={{ mt: 'auto', px: 2.5, pb: 2 }}>
        <Box sx={{ height: '1px', background: aiGradient, opacity: 0.5, mb: 2 }} />
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Rodrigo Bossini
        </Typography>
      </Box>
    </Stack>
  )
}
