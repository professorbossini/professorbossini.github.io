import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Link,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import AddRounded from '@mui/icons-material/AddRounded'
import ArrowBack from '@mui/icons-material/ArrowBack'
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded'
import GroupsOutlined from '@mui/icons-material/GroupsOutlined'
import LogoutRounded from '@mui/icons-material/LogoutRounded'
import PersonRemoveOutlined from '@mui/icons-material/PersonRemoveOutlined'
import { buscarCodelab, urlCodelab } from '../../codelabs'
import { buscarTrilha, trilhas } from '../../codelabs/trilhas'
import { api } from '../../conta/api'
import { useConta } from '../../conta/useConta'
import Reveal from '../Reveal'
import SectionTitle from '../SectionTitle'
import Duvidas from './DuvidasProfessor'
import { PrecisaEntrar } from './MinhaConta'

const linkDeEntrada = (codigo) => `${window.location.origin}/turmas/entrar/${codigo}/`

function useCarregar(fn, deps) {
  const [estado, setEstado] = useState({ carregando: true })
  const recarregar = useCallback(() => {
    setEstado((e) => ({ ...e, carregando: true }))
    fn()
      .then((dados) => setEstado({ dados }))
      .catch((erro) => setEstado({ erro: erro.message }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  useEffect(recarregar, [recarregar])
  return [estado, recarregar]
}

// ---------- aluno: entrar numa turma pelo código ----------

function EntrarNaTurma({ codigoInicial = '', aoEntrar }) {
  const [codigo, setCodigo] = useState(codigoInicial.toUpperCase())
  const [turma, setTurma] = useState(null)
  const [aceito, setAceito] = useState(false)
  const [estado, setEstado] = useState(null)

  useEffect(() => {
    setTurma(null)
    setAceito(false)
    if (!/^[A-Z0-9]{6}$/.test(codigo)) return
    let ativo = true
    api(`/turmas/codigo/${codigo}`, { autenticar: false })
      .then((r) => ativo && setTurma(r.turma))
      .catch((e) => ativo && setEstado(e.message))
    return () => {
      ativo = false
    }
  }, [codigo])

  const entrar = async () => {
    setEstado('entrando')
    try {
      await api('/turmas/entrar', { metodo: 'POST', corpo: { codigo, consentimento: true } })
      setEstado(null)
      setCodigo('')
      aoEntrar()
    } catch (e) {
      setEstado(e.message)
    }
  }

  return (
    <Card sx={{ p: { xs: 2.5, sm: 3 } }}>
      <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>Entrar numa turma</Typography>
      <TextField
        label="Código da turma"
        size="small"
        value={codigo}
        onChange={(e) => { setCodigo(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)); setEstado(null) }}
        placeholder="Ex.: K7M2QX"
        slotProps={{ htmlInput: { style: { letterSpacing: '0.2em', fontWeight: 600 } } }}
      />
      {turma && (
        <Box sx={{ mt: 2.5, p: 2, borderRadius: '14px', bgcolor: 'background.subtle', border: '1px solid', borderColor: 'divider' }}>
          <Typography sx={{ fontWeight: 600 }}>{turma.nome}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Professor: {turma.professor}{turma.trilha && buscarTrilha(turma.trilha) ? ` · trilha ${buscarTrilha(turma.trilha).titulo}` : ''}
          </Typography>
          <FormControlLabel
            control={<Checkbox checked={aceito} onChange={(e) => setAceito(e.target.checked)} />}
            label={
              <Typography variant="body2">
                Autorizo o professor desta turma a ver meu nome, e-mail e meu progresso nos codelabs. Posso sair da turma quando quiser.
              </Typography>
            }
          />
          <Button variant="contained" sx={{ mt: 1 }} disabled={!aceito || estado === 'entrando'} onClick={entrar}>
            Entrar na turma
          </Button>
        </Box>
      )}
      {estado && estado !== 'entrando' && <Alert severity="error" sx={{ mt: 2 }}>{estado}</Alert>}
    </Card>
  )
}

function MinhasTurmas({ participo, aoMudar }) {
  if (!participo.length) return null
  return (
    <Card sx={{ p: { xs: 2.5, sm: 3 } }}>
      <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>Turmas em que estou</Typography>
      <Stack spacing={1.5}>
        {participo.map((t) => {
          const trilha = t.trilha && buscarTrilha(t.trilha)
          return (
            <Stack key={t.id} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <GroupsOutlined color="primary" />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600 }}>{t.nome}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Professor: {t.professor}
                  {trilha && <> · <Link href={`/codelabs/trilha/${trilha.id}/`}>trilha {trilha.titulo}</Link></>}
                </Typography>
              </Box>
              <Tooltip title="Sair da turma (o professor deixa de ver seu progresso)">
                <IconButton
                  aria-label={`Sair da turma ${t.nome}`}
                  onClick={async () => {
                    if (!window.confirm(`Sair da turma "${t.nome}"? O professor deixa de ver seu progresso.`)) return
                    await api(`/turmas/${t.id}/matricula`, { metodo: 'DELETE' })
                    aoMudar()
                  }}
                >
                  <LogoutRounded />
                </IconButton>
              </Tooltip>
            </Stack>
          )
        })}
      </Stack>
    </Card>
  )
}

// ---------- professor ----------

function NovaTurma({ aoCriar }) {
  const [nome, setNome] = useState('')
  const [trilha, setTrilha] = useState('')
  const [erro, setErro] = useState(null)
  const criar = async (e) => {
    e.preventDefault()
    try {
      await api('/turmas', { metodo: 'POST', corpo: { nome, trilha: trilha || null } })
      setNome('')
      setTrilha('')
      aoCriar()
    } catch (er) {
      setErro(er.message)
    }
  }
  return (
    <Card component="form" onSubmit={criar} sx={{ p: { xs: 2.5, sm: 3 } }}>
      <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>Nova turma</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
        <TextField size="small" label="Nome" placeholder="Ex.: Mauá · Desenvolvimento Multiplataforma · 2026/2" value={nome} onChange={(e) => setNome(e.target.value)} required sx={{ flex: 2 }} slotProps={{ htmlInput: { maxLength: 120 } }} />
        <TextField size="small" select label="Trilha (opcional)" value={trilha} onChange={(e) => setTrilha(e.target.value)} sx={{ flex: 1, minWidth: 200 }}>
          <MenuItem value="">Sem trilha</MenuItem>
          {trilhas.map((t) => <MenuItem key={t.id} value={t.id}>{t.titulo}</MenuItem>)}
        </TextField>
        <Button type="submit" variant="contained" startIcon={<AddRounded />} disabled={!nome.trim()}>Criar</Button>
      </Stack>
      {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}
    </Card>
  )
}

function CodigoCopiavel({ codigo }) {
  const [copiado, setCopiado] = useState(false)
  return (
    <Tooltip title={copiado ? 'Link copiado!' : 'Copiar o link de entrada'}>
      <Chip
        label={codigo}
        icon={<ContentCopyRounded />}
        variant="soft"
        color="primary"
        onClick={async () => {
          await navigator.clipboard.writeText(linkDeEntrada(codigo)).catch(() => {})
          setCopiado(true)
          setTimeout(() => setCopiado(false), 1500)
        }}
        sx={{ fontWeight: 700, letterSpacing: '0.12em' }}
      />
    </Tooltip>
  )
}

// Matriz alunos × codelabs (os da trilha, ou os que alguém da turma já começou)
function PainelDaTurma({ id, voltar }) {
  const [{ dados, carregando, erro }, recarregar] = useCarregar(() => api(`/turmas/${id}`), [id])
  const colunas = useMemo(() => {
    if (!dados) return []
    const trilha = dados.turma.trilha && buscarTrilha(dados.turma.trilha)
    const ids = trilha ? trilha.codelabs : [...new Set(dados.alunos.flatMap((a) => a.progresso.map((p) => p.codelab)))]
    return ids.map(buscarCodelab).filter(Boolean)
  }, [dados])

  if (carregando && !dados) return <CircularProgress />
  if (erro) return <Alert severity="error">{erro}</Alert>
  const { turma, alunos } = dados

  return (
    <Stack spacing={2.5}>
      <Button startIcon={<ArrowBack />} onClick={voltar} sx={{ alignSelf: 'flex-start' }}>Todas as turmas</Button>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }} useFlexGap>
        <Typography variant="h5" component="h2">{turma.nome}</Typography>
        <CodigoCopiavel codigo={turma.codigo} />
        <Typography variant="body2" color="text.secondary">{alunos.length} {alunos.length === 1 ? 'aluno' : 'alunos'}</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        Compartilhe o link <b>{linkDeEntrada(turma.codigo)}</b> ou o código. Cada aluno entra com a conta Google e autoriza você a ver o progresso.
      </Typography>
      {!alunos.length ? (
        <Card sx={{ p: 3 }}><Typography color="text.secondary">Ninguém entrou ainda.</Typography></Card>
      ) : !colunas.length ? (
        <Card sx={{ p: 3 }}><Typography color="text.secondary">Os alunos ainda não abriram nenhum codelab.</Typography></Card>
      ) : (
        <TableContainer component={Card} sx={{ maxHeight: '70vh' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 200, position: 'sticky', left: 0, zIndex: 3, bgcolor: 'background.paper' }}>Aluno</TableCell>
                {colunas.map((c) => (
                  <TableCell key={c.id} align="center" sx={{ minWidth: 110, fontSize: 12, lineHeight: 1.3 }}>
                    <Link href={urlCodelab(c.id)} color="inherit" underline="hover">{c.titulo}</Link>
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {alunos.map((a) => {
                const porCodelab = Object.fromEntries(a.progresso.map((p) => [p.codelab, p]))
                return (
                  <TableRow key={a.id} hover>
                    <TableCell sx={{ position: 'sticky', left: 0, zIndex: 1, bgcolor: 'background.paper' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{a.nome}</Typography>
                      <Typography variant="caption" color="text.secondary">{a.email}</Typography>
                    </TableCell>
                    {colunas.map((c) => {
                      const p = porCodelab[c.id]
                      const total = c.passos.length
                      const fracao = p ? Math.min(p.passoMax / total, 1) : 0
                      return (
                        <TableCell key={c.id} align="center">
                          {p ? (
                            <Tooltip title={`Passo ${p.passoMax} de ${total} · ${new Date(p.quando).toLocaleDateString('pt-BR')}`}>
                              <Box>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: fracao >= 1 ? 'success.main' : 'text.primary' }}>
                                  {fracao >= 1 ? 'concluído' : `${p.passoMax}/${total}`}
                                </Typography>
                                <LinearProgress variant="determinate" value={fracao * 100} color={fracao >= 1 ? 'success' : 'primary'} sx={{ height: 4, borderRadius: 2, mt: 0.5 }} />
                              </Box>
                            </Tooltip>
                          ) : (
                            <Typography variant="caption" color="text.disabled">—</Typography>
                          )}
                        </TableCell>
                      )
                    })}
                    <TableCell>
                      <Tooltip title="Remover da turma">
                        <IconButton
                          size="small"
                          aria-label={`Remover ${a.nome}`}
                          onClick={async () => {
                            if (!window.confirm(`Remover ${a.nome} da turma?`)) return
                            await api(`/turmas/${turma.id}/alunos/${a.id}`, { metodo: 'DELETE' })
                            recarregar()
                          }}
                        >
                          <PersonRemoveOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  )
}

function TurmasDoProfessor({ criadas, aoMudar }) {
  const [aberta, setAberta] = useState(null)
  if (aberta) return <PainelDaTurma id={aberta} voltar={() => { setAberta(null); aoMudar() }} />
  return (
    <Stack spacing={2.5}>
      <NovaTurma aoCriar={aoMudar} />
      {criadas.map((t) => {
        const trilha = t.trilha && buscarTrilha(t.trilha)
        return (
          <Card key={t.id} sx={{ p: 2.5 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: { sm: 'center' } }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600 }}>{t.nome}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.alunos} {t.alunos === 1 ? 'aluno' : 'alunos'}{trilha ? ` · trilha ${trilha.titulo}` : ''}
                </Typography>
              </Box>
              <CodigoCopiavel codigo={t.codigo} />
              <Button variant="tonal" onClick={() => setAberta(t.id)}>Ver progresso</Button>
              <Tooltip title="Apagar a turma">
                <IconButton
                  aria-label={`Apagar a turma ${t.nome}`}
                  onClick={async () => {
                    if (!window.confirm(`Apagar a turma "${t.nome}"? As matrículas serão apagadas (o progresso dos alunos continua na conta de cada um).`)) return
                    await api(`/turmas/${t.id}`, { metodo: 'DELETE' })
                    aoMudar()
                  }}
                >
                  <DeleteOutlineRounded />
                </IconButton>
              </Tooltip>
            </Stack>
          </Card>
        )
      })}
    </Stack>
  )
}

export default function Turmas({ parametros = [] }) {
  const { usuario, ativo } = useConta()
  const codigoDoLink = parametros[0] === 'entrar' ? parametros[1] ?? '' : ''
  const [{ dados, erro }, recarregar] = useCarregar(() => (usuario ? api('/turmas') : Promise.resolve(null)), [usuario?.id])

  return (
    <Box>
      <Reveal>
        <SectionTitle eyebrow="// turmas">{usuario?.professor ? 'Turmas e dúvidas' : 'Minhas turmas'}</SectionTitle>
      </Reveal>
      {!ativo ? (
        <Typography color="text.secondary">As contas ainda não estão disponíveis.</Typography>
      ) : !usuario ? (
        <PrecisaEntrar texto={codigoDoLink ? 'Entre com sua conta Google para participar da turma.' : 'Entre com sua conta Google para participar das turmas do seu professor.'} />
      ) : erro ? (
        <Alert severity="error">{erro}</Alert>
      ) : !dados ? (
        <CircularProgress />
      ) : (
        <Stack spacing={4}>
          {usuario.professor && (
            <>
              <TurmasDoProfessor criadas={dados.criadas} aoMudar={recarregar} />
              <Duvidas />
            </>
          )}
          <Stack spacing={2.5}>
            <EntrarNaTurma codigoInicial={codigoDoLink} aoEntrar={recarregar} />
            <MinhasTurmas participo={dados.participo} aoMudar={recarregar} />
          </Stack>
        </Stack>
      )}
    </Box>
  )
}
