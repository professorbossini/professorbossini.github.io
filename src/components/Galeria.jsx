import { useState } from 'react'
import { Box, ButtonBase, Dialog, Typography } from '@mui/material'
import MusicNoteOutlined from '@mui/icons-material/MusicNoteOutlined'
import { fotos } from '../data'
import { transition } from '../theme'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

export default function Galeria() {
  const [aberta, setAberta] = useState(null)

  return (
    <Box component="section">
      <Reveal>
        <SectionTitle eyebrow="// fora da sala de aula">Guitarra, voz e barulho</SectionTitle>
        <Typography color="text.secondary" sx={{ mt: -2, mb: 4, display: 'flex', gap: 1, alignItems: 'center' }}>
          <MusicNoteOutlined fontSize="small" />
          Guitarrista e cantor entusiasta. Caso perdido.
        </Typography>
      </Reveal>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr 1fr', md: '1.2fr 1fr 1fr' },
          gridAutoRows: { xs: 160, sm: 200 },
        }}
      >
        {fotos.map((foto, i) => (
          <Reveal
            key={foto.src}
            delay={i * 70}
            sx={i === 0 ? { gridRow: 'span 2', gridColumn: { xs: 'span 2', md: 'auto' } } : undefined}
          >
            <ButtonBase
              onClick={() => setAberta(foto)}
              aria-label={`Ampliar: ${foto.alt}`}
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '24px',
                overflow: 'hidden',
                '& img': {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: transition(['transform', 'filter'], 'long4', 'emphasized'),
                  filter: 'saturate(0.9)',
                },
                '&:hover img, &:focus-visible img': { transform: 'scale(1.06)', filter: 'saturate(1.1)' },
              }}
            >
              <img src={foto.src} alt={foto.alt} loading="lazy" style={{ objectPosition: foto.posicao }} />
            </ButtonBase>
          </Reveal>
        ))}
      </Box>

      <Dialog
        open={!!aberta}
        onClose={() => setAberta(null)}
        maxWidth="md"
        slotProps={{ paper: { sx: { borderRadius: '24px', overflow: 'hidden', bgcolor: 'transparent' } } }}
      >
        {aberta && (
          <Box
            component="img"
            src={aberta.src}
            alt={aberta.alt}
            onClick={() => setAberta(null)}
            sx={{ display: 'block', maxWidth: '100%', maxHeight: '85vh', cursor: 'zoom-out' }}
          />
        )}
      </Dialog>
    </Box>
  )
}
