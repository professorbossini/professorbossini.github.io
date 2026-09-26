import { Typography } from '@mui/material'

// Crédito do formato e aviso de que não há vínculo com o Google
export default function AvisoFormato({ sx }) {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      component="p"
      sx={{ mt: 6, pt: 2, borderTop: '1px solid', borderColor: 'divider', ...sx }}
    >
      Tutoriais no formato de código aberto do{' '}
      <a href="https://github.com/googlecodelabs/tools" target="_blank" rel="noopener" style={{ color: 'inherit' }}>
        Google Codelabs (claat)
      </a>
      . Sem afiliação com o Google.
    </Typography>
  )
}
