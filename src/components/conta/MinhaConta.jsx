import { useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DeleteForeverOutlined from '@mui/icons-material/DeleteForeverOutlined'
import DevicesOtherOutlined from '@mui/icons-material/DevicesOtherOutlined'
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import LoginRounded from '@mui/icons-material/LoginRounded'
import { api } from '../../conta/api'
import { abrirEntrar } from '../../conta/abrirEntrar'
import { excluirConta, sair, trocarNome, useConta } from '../../conta/useConta'
import Reveal from '../Reveal'
import SectionTitle from '../SectionTitle'

const formatoData = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })

function Bloco({ titulo, children }) {
  return (
    <Card sx={{ p: { xs: 2.5, sm: 3 } }}>
      <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>{titulo}</Typography>
      {children}
    </Card>
  )
}

export function PrecisaEntrar({ texto }) {
  return (
    <Card sx={{ p: 4, textAlign: 'center' }}>
      <Typography sx={{ mb: 2 }}>{texto}</Typography>
      <Button variant="contained" startIcon={<LoginRounded />} onClick={() => abrirEntrar()}>Entrar com Google</Button>
    </Card>
  )
}

function Nome({ usuario }) {
  const [valor, setValor] = useState(usuario.nome === usuario.nomeGoogle ? '' : usuario.nome)
  const [estado, setEstado] = useState(null)
  const salvar = async (e) => {
    e.preventDefault()
    setEstado('salvando')
    try {
      await trocarNome(valor.trim() || null)
      setEstado('salvo')
    } catch (erro) {
      setEstado(erro.message)
    }
  }
  return (
    <Box component="form" onSubmit={salvar}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          size="small"
          label="Nome exibido"
          placeholder={usuario.nomeGoogle}
          value={valor}
          onChange={(e) => { setValor(e.target.value); setEstado(null) }}
          helperText="Vazio usa o nome da conta Google. Nas dúvidas aparecem só o primeiro nome e a inicial."
          slotProps={{ htmlInput: { maxLength: 60 } }}
          sx={{ flex: 1 }}
        />
        <Button type="submit" variant="tonal" disabled={estado === 'salvando'} sx={{ alignSelf: { sm: 'flex-start' }, mt: { sm: '2px' } }}>Salvar</Button>
      </Stack>
      {estado === 'salvo' && <Alert severity="success" sx={{ mt: 1.5 }}>Nome atualizado.</Alert>}
      {estado && !['salvo', 'salvando'].includes(estado) && <Alert severity="error" sx={{ mt: 1.5 }}>{estado}</Alert>}
    </Box>
  )
}

function Excluir() {
  const [aberto, setAberto] = useState(false)
  const [confirmacao, setConfirmacao] = useState('')
  const [excluindo, setExcluindo] = useState(false)
  const [erro, setErro] = useState(null)
  return (
    <>
      <Button color="error" variant="outlined" startIcon={<DeleteForeverOutlined />} onClick={() => setAberto(true)}>Excluir minha conta</Button>
      <Dialog open={aberto} onClose={() => !excluindo && setAberto(false)} maxWidth="xs">
        <DialogTitle>Excluir a conta?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Isto apaga para sempre seu progresso salvo, suas turmas, dúvidas e marcações de "útil". Não dá para desfazer.
            Digite <b>EXCLUIR</b> para confirmar.
          </Typography>
          <TextField fullWidth size="small" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} autoFocus />
          {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAberto(false)} disabled={excluindo}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            disabled={confirmacao.trim().toUpperCase() !== 'EXCLUIR' || excluindo}
            startIcon={excluindo ? <CircularProgress size={16} /> : null}
            onClick={async () => {
              setExcluindo(true)
              try {
                await excluirConta()
                window.location.href = '/'
              } catch (e) {
                setErro(e.message)
                setExcluindo(false)
              }
            }}
          >
            Excluir para sempre
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default function MinhaConta() {
  const { usuario, ativo } = useConta()
  const [baixando, setBaixando] = useState(false)

  const baixarDados = async () => {
    setBaixando(true)
    try {
      const dados = await api('/eu/dados')
      const url = URL.createObjectURL(new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' }))
      const a = Object.assign(document.createElement('a'), { href: url, download: 'meus-dados-professorbossini.json' })
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setBaixando(false)
    }
  }

  return (
    <Box>
      <Reveal>
        <SectionTitle eyebrow="// conta">Minha conta</SectionTitle>
      </Reveal>
      {!ativo ? (
        <Typography color="text.secondary">As contas ainda não estão disponíveis.</Typography>
      ) : !usuario ? (
        <PrecisaEntrar texto="Entre com sua conta Google para ver e gerenciar seus dados." />
      ) : (
        <Stack spacing={2.5}>
          <Bloco titulo="Perfil">
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2.5 }}>
              <Avatar src={usuario.foto ?? undefined} slotProps={{ img: { referrerPolicy: 'no-referrer' } }} sx={{ width: 56, height: 56 }}>{usuario.nome[0]}</Avatar>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{usuario.nome}</Typography>
                <Typography variant="body2" color="text.secondary">{usuario.email}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Conta criada em {formatoData.format(new Date(usuario.criadoEm))}
                  {usuario.professor && ' · professor'}
                </Typography>
              </Box>
            </Stack>
            <Nome usuario={usuario} />
          </Bloco>

          <Bloco titulo="Seus dados (LGPD)">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Você aceitou a <Link href="/privacidade/">Política de Privacidade</Link> (versão {usuario.consentimentoVersao}) em{' '}
              {formatoData.format(new Date(usuario.consentimentoEm))}. Aqui você exerce os direitos do art. 18 da LGPD, sem precisar pedir a ninguém.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
              <Button variant="tonal" startIcon={baixando ? <CircularProgress size={16} /> : <FileDownloadOutlined />} onClick={baixarDados} disabled={baixando}>
                Baixar meus dados
              </Button>
              <Button variant="outlined" startIcon={<DevicesOtherOutlined />} onClick={() => sair({ todosDispositivos: true })}>
                Sair de todos os dispositivos
              </Button>
              <Excluir />
            </Stack>
            <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 2 }}>
              Para deixar de compartilhar seu progresso com um professor, saia da turma em{' '}
              <Link href="/turmas/">Minhas turmas</Link>. Contas sem acesso há 24 meses são excluídas automaticamente.
            </Typography>
          </Bloco>
        </Stack>
      )}
    </Box>
  )
}
