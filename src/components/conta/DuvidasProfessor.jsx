import { useEffect, useState } from 'react'
import { Alert, Box, Card, Chip, CircularProgress, IconButton, Link, Stack, Tooltip, Typography } from '@mui/material'
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded'
import { buscarCodelab, urlCodelab } from '../../codelabs'
import { api } from '../../conta/api'
import RespostaProfessor from './RespostaProfessor'

const formatoData = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

// Professor: dúvidas de todos os codelabs, as sem resposta primeiro
export default function DuvidasProfessor() {
  const [duvidas, setDuvidas] = useState(null)
  const [erro, setErro] = useState(null)
  useEffect(() => {
    api('/duvidas').then((r) => setDuvidas(r.duvidas)).catch((e) => setErro(e.message))
  }, [])

  const semResposta = duvidas?.filter((d) => !d.resposta).length ?? 0
  return (
    <Box component="section">
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">Dúvidas dos codelabs</Typography>
        {semResposta > 0 && <Chip size="small" color="warning" variant="soft" label={`${semResposta} sem resposta`} />}
      </Stack>
      {erro && <Alert severity="error">{erro}</Alert>}
      {!duvidas && !erro && <CircularProgress />}
      {duvidas?.length === 0 && <Typography color="text.secondary">Nenhuma dúvida por enquanto.</Typography>}
      <Stack spacing={1.5}>
        {duvidas?.map((d) => {
          const c = buscarCodelab(d.codelab)
          return (
            <Card key={d.id} sx={{ p: 2, borderLeft: '4px solid', borderLeftColor: d.resposta ? 'success.main' : 'warning.main' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary">
                    <Link href={urlCodelab(d.codelab, d.passo)}>{c?.titulo ?? d.codelab} · passo {d.passo}</Link>
                    {' · '}{d.autor} · {formatoData.format(new Date(d.criada_em))}
                  </Typography>
                  <Typography sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>{d.texto}</Typography>
                  {d.resposta && (
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', mt: 1, pl: 1.5, borderLeft: '2px solid', borderColor: 'divider' }}>
                      {d.resposta}
                    </Typography>
                  )}
                  <RespostaProfessor duvida={d} aoResponder={(resposta) => setDuvidas((ds) => ds.map((x) => (x.id === d.id ? { ...x, resposta } : x)))} />
                </Box>
                <Tooltip title="Apagar a dúvida">
                  <IconButton
                    size="small"
                    aria-label="Apagar a dúvida"
                    onClick={async () => {
                      if (!window.confirm('Apagar esta dúvida?')) return
                      await api(`/duvidas/${d.id}`, { metodo: 'DELETE' })
                      setDuvidas((ds) => ds.filter((x) => x.id !== d.id))
                    }}
                  >
                    <DeleteOutlineRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Card>
          )
        })}
      </Stack>
    </Box>
  )
}
