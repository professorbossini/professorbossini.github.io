import { Box, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'
import { gradiente, transition } from '../theme'
import { secoes } from '../secoes'

const itemSx = {
  borderRadius: 99,
  minHeight: 56,
  px: 2.5,
  mb: 0.5,
  transition: transition(['background-color', 'color'], 'short4'),
  '& .MuiListItemIcon-root': { minWidth: 40, color: 'inherit' },
  '&.Mui-selected': {
    color: 'primary.onContainer',
    bgcolor: 'primary.container',
    '& .MuiListItemText-primary': { fontWeight: 600 },
  },
  '&.Mui-selected:hover': { bgcolor: 'primary.container' },
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


      <Box sx={{ mt: 'auto', px: 2.5, pb: 2 }}>
        <Box sx={{ height: '1px', background: gradiente, opacity: 0.6, mb: 2 }} />
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Rodrigo Bossini
        </Typography>
      </Box>
    </Stack>
  )
}
