import { useState } from 'react'
import { Avatar, Box, Button, ButtonBase, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import GroupsOutlined from '@mui/icons-material/GroupsOutlined'
import LoginRounded from '@mui/icons-material/LoginRounded'
import LogoutRounded from '@mui/icons-material/LogoutRounded'
import ManageAccountsOutlined from '@mui/icons-material/ManageAccountsOutlined'
import { abrirEntrar } from '../../conta/abrirEntrar'
import { sair, useConta } from '../../conta/useConta'

function MenuConta({ ancora, onFechar, usuario }) {
  return (
    <Menu anchorEl={ancora} open={!!ancora} onClose={onFechar} slotProps={{ paper: { sx: { minWidth: 220, borderRadius: '16px' } } }}>
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{usuario.nome}</Typography>
        <Typography variant="caption" color="text.secondary" noWrap component="p">{usuario.email}</Typography>
      </Box>
      <Divider />
      <MenuItem component="a" href="/conta/" onClick={onFechar}>
        <ListItemIcon><ManageAccountsOutlined fontSize="small" /></ListItemIcon>
        Minha conta
      </MenuItem>
      <MenuItem component="a" href="/turmas/" onClick={onFechar}>
        <ListItemIcon><GroupsOutlined fontSize="small" /></ListItemIcon>
        {usuario.professor ? 'Turmas e dúvidas' : 'Minhas turmas'}
      </MenuItem>
      <MenuItem onClick={() => { onFechar(); sair() }}>
        <ListItemIcon><LogoutRounded fontSize="small" /></ListItemIcon>
        Sair
      </MenuItem>
    </Menu>
  )
}

// No menu lateral: convite para entrar, ou foto e nome com o menu da conta
export default function BotaoConta({ compacto = false, onNavegar }) {
  const { usuario, ativo } = useConta()
  const [ancora, setAncora] = useState(null)
  if (!ativo) return null

  if (!usuario) {
    return compacto ? (
      <Tooltip title="Entrar com Google">
        <IconButton onClick={() => abrirEntrar()} aria-label="Entrar com Google">
          <LoginRounded />
        </IconButton>
      </Tooltip>
    ) : (
      <Box sx={{ px: 1, pb: 1.5 }}>
        <Button fullWidth variant="tonal" startIcon={<LoginRounded />} onClick={() => abrirEntrar()}>
          Entrar com Google
        </Button>
        <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1, px: 1, textAlign: 'center' }}>
          Opcional: salva seu progresso, entra em turmas e libera as dúvidas.
        </Typography>
      </Box>
    )
  }

  const avatar = <Avatar src={usuario.foto ?? undefined} alt="" slotProps={{ img: { referrerPolicy: 'no-referrer' } }} sx={{ width: compacto ? 32 : 36, height: compacto ? 32 : 36 }}>{usuario.nome[0]}</Avatar>
  const fechar = () => {
    setAncora(null)
    onNavegar?.()
  }
  return (
    <>
      {compacto ? (
        <Tooltip title="Sua conta">
          <IconButton onClick={(e) => setAncora(e.currentTarget)} aria-label="Sua conta" sx={{ p: 0.5 }}>{avatar}</IconButton>
        </Tooltip>
      ) : (
        <ButtonBase
          onClick={(e) => setAncora(e.currentTarget)}
          sx={(theme) => ({ mx: 1, mb: 1.5, p: 1, gap: 1.5, borderRadius: '16px', justifyContent: 'flex-start', textAlign: 'left', '&:hover': { bgcolor: theme.alpha(theme.vars.palette.primary.main, 0.08) } })}
        >
          {avatar}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{usuario.nome}</Typography>
            <Typography variant="caption" color="text.secondary">{usuario.professor ? 'Professor' : 'Progresso salvo na conta'}</Typography>
          </Box>
        </ButtonBase>
      )}
      <MenuConta ancora={ancora} onFechar={fechar} usuario={usuario} />
    </>
  )
}
