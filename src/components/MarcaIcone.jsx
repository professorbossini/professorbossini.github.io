import { Box, SvgIcon } from '@mui/material'
import Instagram from '@mui/icons-material/Instagram'

// Logos das redes nas cores oficiais de cada marca, no formato de ícone de app.
const LinkedInLogo = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
  </SvgIcon>
)

const GitHubLogo = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3" />
  </SvgIcon>
)

const marcas = {
  instagram: {
    Logo: Instagram,
    fundo: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)',
    cor: '#fff',
  },
  linkedin: { Logo: LinkedInLogo, fundo: '#0a66c2', cor: '#fff' },
  // GitHub: tile preto no tema claro e branco no escuro, para manter o contraste
  github: { Logo: GitHubLogo, fundo: '#181717', cor: '#fff', escuro: { fundo: '#fff', cor: '#181717' } },
}

export default function MarcaIcone({ marca, tamanho = 44 }) {
  const { Logo, fundo, cor, escuro } = marcas[marca]
  return (
    <Box
      aria-hidden
      sx={(theme) => ({
        width: tamanho,
        height: tamanho,
        flexShrink: 0,
        borderRadius: `${tamanho * 0.28}px`,
        display: 'grid',
        placeItems: 'center',
        background: fundo,
        color: cor,
        ...(escuro && theme.applyStyles('dark', { background: escuro.fundo, color: escuro.cor })),
      })}
    >
      <Logo sx={{ fontSize: tamanho * 0.6 }} />
    </Box>
  )
}
