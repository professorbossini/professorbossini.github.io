import { Box, Link, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'
import { gradiente, transition } from '../theme'
import { caminhoDe, secoes } from '../secoes'
import BotaoConta from './conta/BotaoConta'

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
      {/* foto e nome levam para a página inicial */}
      <Stack
        component="a"
        href="/"
        onClick={onNavegar}
        aria-label="Rodrigo Bossini, página inicial"
        direction="row"
        spacing={1.5}
        sx={(theme) => ({
          alignItems: 'center',
          px: 1.5,
          py: 2.5,
          borderRadius: '20px',
          color: 'inherit',
          textDecoration: 'none',
          transition: transition('background-color', 'short4'),
          '&:hover': { bgcolor: theme.alpha(theme.vars.palette.primary.main, 0.08) },
          '&:focus-visible': { outline: `2px solid ${theme.vars.palette.primary.main}`, outlineOffset: -2 },
        })}
      >
        <Box
          component="img"
          src="/images/perfil.webp"
          alt=""
          sx={{ width: 44, height: 44, borderRadius: '14px', objectFit: 'cover' }}
        />
        <Box>
          <Typography sx={{ fontWeight: 600, lineHeight: 1.2 }}>Rodrigo Bossini</Typography>
          <Typography variant="body2" color="text.secondary">Professor e dev</Typography>
        </Box>
      </Stack>

      <List component="nav" aria-label="Seções do site" sx={{ mt: 1 }}>
        {secoes.filter((s) => !s.oculta).map(({ id, rotulo, icone: Icone }) => (
          <ListItemButton
            key={id}
            selected={rota === id}
            aria-current={rota === id ? 'page' : undefined}
            component="a"
            href={caminhoDe(id)}
            onClick={onNavegar}
            sx={itemSx}
          >
            <ListItemIcon><Icone /></ListItemIcon>
            <ListItemText primary={rotulo} />
          </ListItemButton>
        ))}
      </List>


      <Box sx={{ mt: 'auto' }}>
        <BotaoConta onNavegar={onNavegar} />
        <Box sx={{ px: 2.5, pb: 2 }}>
          <Box sx={{ height: '1px', background: gradiente, opacity: 0.6, mb: 2 }} />
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Rodrigo Bossini ·{' '}
            <Link href="/privacidade/" color="inherit" onClick={onNavegar}>Privacidade</Link>
          </Typography>
        </Box>
      </Box>
    </Stack>
  )
}
