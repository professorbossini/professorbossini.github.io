import { Button, Card, Stack, Typography } from '@mui/material'
import ForumOutlined from '@mui/icons-material/ForumOutlined'
import { links } from '../data'
import MarcaIcone from './MarcaIcone'
import Reveal from './Reveal'

// Convite para contato: palestras, bancas, cursos e parcerias, pelos canais já públicos
export default function FaleComigo({ sx }) {
  return (
    <Reveal sx={sx}>
      <Card
        sx={(theme) => ({
          p: { xs: 3, sm: 4 },
          borderColor: theme.alpha(theme.vars.palette.primary.main, 0.5),
          backgroundImage: `linear-gradient(135deg, ${theme.alpha(theme.vars.palette.primary.main, 0.1)}, transparent 60%)`,
        })}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
            <ForumOutlined sx={{ color: 'primary.main', fontSize: 32, mt: 0.25 }} />
            <div>
              <Typography variant="h5" component="h2">Fale comigo</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5, maxWidth: 520 }}>
                Palestras, bancas, cursos, maratonas de programação ou parcerias com a sua instituição: me mande uma mensagem.
              </Typography>
            </div>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ flexShrink: 0 }}>
            <Button
              variant="contained"
              href={links.instagramDirect}
              target="_blank"
              rel="noopener"
              startIcon={<MarcaIcone marca="instagram" tamanho={24} />}
            >
              Direct no Instagram
            </Button>
            <Button
              variant="tonal"
              href={links.linkedin}
              target="_blank"
              rel="noopener"
              startIcon={<MarcaIcone marca="linkedin" tamanho={24} />}
            >
              LinkedIn
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Reveal>
  )
}
