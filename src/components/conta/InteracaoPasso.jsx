import { useEffect, useState } from 'react'
import { Alert, Box, Button, Card, CircularProgress, Collapse, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded'
import ForumOutlined from '@mui/icons-material/ForumOutlined'
import SchoolOutlined from '@mui/icons-material/SchoolOutlined'
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined'
import ThumbUpAltRounded from '@mui/icons-material/ThumbUpAltRounded'
import { api } from '../../conta/api'
import { abrirEntrar } from '../../conta/abrirEntrar'
import { useConta } from '../../conta/useConta'
import RespostaProfessor from './RespostaProfessor'

const formatoData = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })

function Duvida({ duvida, professor, aoApagar, aoResponder }) {
  return (
    <Box sx={{ py: 1.75, '&:not(:last-of-type)': { borderBottom: '1px solid', borderColor: 'divider' } }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary">
            {duvida.minha ? 'Você' : duvida.autor} · {formatoData.format(new Date(duvida.criadaEm))}
          </Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{duvida.texto}</Typography>
          {duvida.resposta && (
            <Box sx={{ mt: 1.25, p: 1.5, borderRadius: '12px', bgcolor: 'primary.container', color: 'primary.onContainer' }}>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.5 }}>
                <SchoolOutlined sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 700 }}>Resposta do professor</Typography>
              </Stack>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{duvida.resposta}</Typography>
            </Box>
          )}
          {professor && <RespostaProfessor duvida={duvida} aoResponder={aoResponder} />}
        </Box>
        {(duvida.minha || professor) && (
          <Tooltip title="Apagar">
            <IconButton size="small" aria-label="Apagar a dúvida" onClick={aoApagar}>
              <DeleteOutlineRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  )
}

// Abaixo de cada passo: "este passo me ajudou" e as dúvidas, com respostas do professor
export default function InteracaoPasso({ codelab, passo }) {
  const { usuario, ativo } = useConta()
  const [dados, setDados] = useState(null)
  const [aberto, setAberto] = useState(false)
  const [texto, setTexto] = useState('')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (!ativo) return
    let vivo = true
    setDados(null)
    setAberto(false)
    setErro(null)
    api(`/passos/${codelab}/${passo}`)
      .then((r) => vivo && setDados(r))
      .catch(() => vivo && setDados({ uteis: 0, util: false, duvidas: [], indisponivel: true }))
    return () => {
      vivo = false
    }
  }, [ativo, codelab, passo, usuario?.id])

  if (!ativo) return null

  const marcarUtil = async () => {
    if (!usuario) return abrirEntrar('Entre para marcar os passos que te ajudaram')
    const r = await api(`/passos/${codelab}/${passo}/util`, { metodo: 'POST' })
    setDados((d) => ({ ...d, ...r }))
  }

  const enviar = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    try {
      const { duvida } = await api(`/passos/${codelab}/${passo}/duvidas`, { metodo: 'POST', corpo: { texto } })
      setDados((d) => ({ ...d, duvidas: [...d.duvidas, duvida] }))
      setTexto('')
    } catch (er) {
      setErro(er.message)
    } finally {
      setEnviando(false)
    }
  }

  const n = dados?.duvidas.length ?? 0
  return (
    <Card variant="outlined" sx={{ maxWidth: 860, mx: 'auto', mt: 3, p: { xs: 2, sm: 2.5 } }}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>Este passo te ajudou?</Typography>
        <Button
          size="small"
          variant={dados?.util ? 'contained' : 'tonal'}
          startIcon={dados?.util ? <ThumbUpAltRounded /> : <ThumbUpAltOutlined />}
          onClick={marcarUtil}
          disabled={!dados || dados.indisponivel}
          aria-pressed={!!dados?.util}
        >
          Útil{dados?.uteis ? ` · ${dados.uteis}` : ''}
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button size="small" startIcon={<ForumOutlined />} onClick={() => setAberto((a) => !a)} disabled={!dados || dados.indisponivel} aria-expanded={aberto}>
          {n ? `${n} ${n === 1 ? 'dúvida' : 'dúvidas'}` : 'Tirar uma dúvida'}
        </Button>
      </Stack>
      {!dados && <CircularProgress size={18} sx={{ mt: 1 }} />}
      <Collapse in={aberto && !!dados} unmountOnExit>
        <Box sx={{ mt: 1.5 }}>
          {dados?.duvidas.map((d) => (
            <Duvida
              key={d.id}
              duvida={d}
              professor={!!usuario?.professor}
              aoResponder={(resposta) => setDados((x) => ({ ...x, duvidas: x.duvidas.map((y) => (y.id === d.id ? { ...y, resposta } : y)) }))}
              aoApagar={async () => {
                if (!window.confirm('Apagar esta dúvida?')) return
                await api(`/duvidas/${d.id}`, { metodo: 'DELETE' })
                setDados((x) => ({ ...x, duvidas: x.duvidas.filter((y) => y.id !== d.id) }))
              }}
            />
          ))}
          {usuario ? (
            <Box component="form" onSubmit={enviar} sx={{ mt: 1.5 }}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                size="small"
                placeholder="Escreva sua dúvida sobre este passo…"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 2000 } }}
                helperText="Fica visível para todos, com seu primeiro nome e a inicial do sobrenome."
              />
              <Button type="submit" variant="contained" size="small" sx={{ mt: 1 }} disabled={texto.trim().length < 3 || enviando}>
                Enviar dúvida
              </Button>
              {erro && <Alert severity="error" sx={{ mt: 1.5 }}>{erro}</Alert>}
            </Box>
          ) : (
            <Box sx={{ mt: 1.5, textAlign: 'center' }}>
              <Button variant="tonal" onClick={() => abrirEntrar('Entre para tirar dúvidas em cada passo')}>Entrar para perguntar</Button>
            </Box>
          )}
        </Box>
      </Collapse>
    </Card>
  )
}
