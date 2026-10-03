import { useState } from 'react'
import { Alert, Button, Stack, TextField } from '@mui/material'
import { api } from '../../conta/api'

// Campo para o professor responder (ou editar a resposta de) uma dúvida
export default function RespostaProfessor({ duvida, aoResponder }) {
  const [texto, setTexto] = useState(duvida.resposta ?? '')
  const [aberto, setAberto] = useState(!duvida.resposta)
  const [erro, setErro] = useState(null)
  if (!aberto) return <Button size="small" onClick={() => setAberto(true)}>Editar resposta</Button>
  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
      <TextField size="small" multiline minRows={2} placeholder="Responder como professor…" value={texto} onChange={(e) => setTexto(e.target.value)} slotProps={{ htmlInput: { maxLength: 4000 } }} />
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="contained"
          disabled={!texto.trim()}
          onClick={async () => {
            try {
              await api(`/duvidas/${duvida.id}/resposta`, { metodo: 'PUT', corpo: { texto } })
              setAberto(false)
              aoResponder(texto.trim())
            } catch (e) {
              setErro(e.message)
            }
          }}
        >
          Responder
        </Button>
        {duvida.resposta && <Button size="small" onClick={() => setAberto(false)}>Cancelar</Button>}
      </Stack>
      {erro && <Alert severity="error">{erro}</Alert>}
    </Stack>
  )
}
