import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  FormControlLabel,
  IconButton,
  Link,
  Stack,
  Typography,
  useColorScheme,
} from '@mui/material'
import CloseRounded from '@mui/icons-material/CloseRounded'
import DevicesOutlined from '@mui/icons-material/DevicesOutlined'
import ForumOutlined from '@mui/icons-material/ForumOutlined'
import GroupsOutlined from '@mui/icons-material/GroupsOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import { VERSAO_POLITICA } from '../../conta/config'
import { desenharBotao } from '../../conta/google'
import { entrarComGoogle } from '../../conta/useConta'
import { BossiniMark } from '../brand/BossiniMark'

// O que a conta oferece; o mesmo texto aparece no convite da página de codelabs
export const VANTAGENS = [
  { icone: DevicesOutlined, titulo: 'Seu progresso em qualquer lugar', texto: 'Comece no laboratório e continue no celular ou em casa, de onde parou.' },
  { icone: GroupsOutlined, titulo: 'Turmas do seu professor', texto: 'Entre na turma com um código e acompanhe a trilha da disciplina.' },
  { icone: ForumOutlined, titulo: 'Dúvidas e passos úteis', texto: 'Pergunte em cada passo, veja as respostas e marque o que te ajudou.' },
]

function Vantagens() {
  return (
    <Stack spacing={1.75}>
      {VANTAGENS.map(({ icone: Icone, titulo, texto }) => (
        <Stack key={titulo} direction="row" spacing={1.5}>
          <Box sx={{ flexShrink: 0, width: 36, height: 36, borderRadius: '10px', display: 'grid', placeItems: 'center', bgcolor: 'primary.container', color: 'primary.onContainer' }}>
            <Icone sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{titulo}</Typography>
            <Typography variant="body2" color="text.secondary">{texto}</Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  )
}

// Primeira vez: resumo do que é guardado e aceite explícito da política
function Consentimento({ perfil, onAceitar, onCancelar, enviando }) {
  const [aceito, setAceito] = useState(false)
  return (
    <Stack spacing={2.25}>
      <Box>
        <Typography variant="h6" component="h2">Criar sua conta</Typography>
        <Typography variant="body2" color="text.secondary">{perfil.nome} · {perfil.email}</Typography>
      </Box>
      <Box sx={{ p: 2, borderRadius: '14px', bgcolor: 'background.subtle', border: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
          <LockOutlined sx={{ fontSize: 18, color: 'primary.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>O que fica guardado</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" component="div">
          <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 0.5 } }}>
            <li>Seu nome, e-mail e foto da conta Google.</li>
            <li>Até que passo você chegou em cada codelab.</li>
            <li>As turmas em que você entrar, as dúvidas que enviar e os passos que marcar como úteis.</li>
          </Box>
          Nas dúvidas, os outros veem só seu primeiro nome e a inicial do sobrenome. Você pode baixar ou
          apagar tudo quando quiser, em <b>Minha conta</b>.
        </Typography>
      </Box>
      <FormControlLabel
        control={<Checkbox checked={aceito} onChange={(e) => setAceito(e.target.checked)} />}
        label={
          <Typography variant="body2">
            Li e concordo com a{' '}
            <Link href="/privacidade/" target="_blank" rel="noopener">Política de Privacidade</Link>.
          </Typography>
        }
      />
      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onCancelar} disabled={enviando}>Cancelar</Button>
        <Button variant="contained" disabled={!aceito || enviando} onClick={onAceitar} startIcon={enviando ? <CircularProgress size={16} /> : null}>
          Criar conta
        </Button>
      </Stack>
    </Stack>
  )
}

export default function DialogoEntrar({ aberto, onFechar, titulo = 'Entre com sua conta Google' }) {
  const alvo = useRef(null)
  const { colorScheme } = useColorScheme()
  const [erro, setErro] = useState(null)
  const [pendente, setPendente] = useState(null) // conta nova esperando o aceite
  const [enviando, setEnviando] = useState(false)
  const [carregandoBotao, setCarregandoBotao] = useState(true)

  const concluir = async (credencial, consentimento) => {
    setErro(null)
    setEnviando(true)
    try {
      const r = await entrarComGoogle(credencial, consentimento)
      if (r.novo) setPendente({ ...r, credencial })
      else {
        setPendente(null)
        onFechar(true)
      }
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  // o botão do Google é desenhado quando a janela abre (e só então o script é baixado)
  useEffect(() => {
    if (!aberto || pendente) return
    let ativo = true
    setCarregandoBotao(true)
    const id = requestAnimationFrame(() => {
      if (!alvo.current) return
      desenharBotao(alvo.current, (credencial) => concluir(credencial), { escuro: colorScheme === 'dark' })
        .then(() => ativo && setCarregandoBotao(false))
        .catch((e) => ativo && setErro(e.message))
    })
    return () => {
      ativo = false
      cancelAnimationFrame(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto, pendente, colorScheme])

  const fechar = () => {
    setPendente(null)
    setErro(null)
    onFechar(false)
  }

  return (
    <Dialog open={aberto} onClose={fechar} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: '28px' } } }}>
      <IconButton onClick={fechar} aria-label="Fechar" sx={{ position: 'absolute', top: 12, right: 12 }}>
        <CloseRounded />
      </IconButton>
      <DialogContent sx={{ p: { xs: 3, sm: 4 } }}>
        {pendente ? (
          <Consentimento
            perfil={pendente}
            enviando={enviando}
            onCancelar={fechar}
            onAceitar={() => concluir(pendente.credencial, VERSAO_POLITICA)}
          />
        ) : (
          <Stack spacing={3}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', pr: 4 }}>
              <BossiniMark size={36} />
              <Typography variant="h6" component="h2" sx={{ lineHeight: 1.25 }}>{titulo}</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Entrar é opcional: todo o conteúdo continua aberto. Com a conta, você ganha:
            </Typography>
            <Vantagens />
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 48 }}>
              {carregandoBotao && !erro && <CircularProgress size={24} />}
              <Box ref={alvo} sx={{ display: carregandoBotao ? 'none' : 'block', colorScheme: 'light' }} />
            </Box>
            {enviando && <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>Entrando…</Typography>}
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
              Usamos só seu nome, e-mail e foto do Google. Veja a{' '}
              <Link href="/privacidade/" target="_blank" rel="noopener">Política de Privacidade</Link>.
            </Typography>
          </Stack>
        )}
        {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}
      </DialogContent>
    </Dialog>
  )
}
