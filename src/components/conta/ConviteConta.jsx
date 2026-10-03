import { Box, Button, Card, Stack, Typography } from '@mui/material'
import LoginRounded from '@mui/icons-material/LoginRounded'
import { abrirEntrar } from '../../conta/abrirEntrar'
import { useConta } from '../../conta/useConta'
import { VANTAGENS } from './DialogoEntrar'

// Convite na página de codelabs, só para quem ainda não entrou
export default function ConviteConta() {
  const { usuario, ativo } = useConta()
  if (!ativo || usuario) return null
  return (
    <Card
      sx={(theme) => ({
        p: { xs: 2.5, sm: 3 },
        mb: 4,
        borderColor: theme.alpha(theme.vars.palette.primary.main, 0.45),
        backgroundImage: `linear-gradient(135deg, ${theme.alpha(theme.vars.palette.primary.main, 0.1)}, transparent 65%)`,
      })}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 3 }} sx={{ alignItems: { md: 'center' } }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" component="h2">Entre com Google e ganhe mais</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>Opcional e gratuito. Todo o conteúdo continua aberto sem conta.</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2.5 }}>
            {VANTAGENS.map(({ icone: Icone, titulo }) => (
              <Stack key={titulo} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Icone sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2">{titulo}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
        <Button variant="contained" startIcon={<LoginRounded />} onClick={() => abrirEntrar()} sx={{ flexShrink: 0, alignSelf: { xs: 'flex-start', md: 'center' } }}>
          Entrar com Google
        </Button>
      </Stack>
    </Card>
  )
}
