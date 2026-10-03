import { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, Typography } from '@mui/material'
import { VERSAO_POLITICA } from '../../conta/config'
import { fecharEntrar, useDialogoEntrar } from '../../conta/abrirEntrar'
import { aceitarPolitica, iniciarConta, sair, useConta } from '../../conta/useConta'
import DialogoEntrar from './DialogoEntrar'

// Montado uma vez: a janela de entrar e o pedido de novo aceite quando a política muda
export default function EntrarGlobal() {
  const { aberto, titulo } = useDialogoEntrar()
  const { usuario, ativo } = useConta()
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    iniciarConta()
  }, [])

  if (!ativo) return null
  const politicaNova = usuario && usuario.consentimentoVersao !== VERSAO_POLITICA

  return (
    <>
      <DialogoEntrar aberto={aberto} titulo={titulo} onFechar={fecharEntrar} />
      <Dialog open={!!politicaNova} maxWidth="xs">
        <DialogTitle>A Política de Privacidade mudou</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Atualizamos a <Link href="/privacidade/" target="_blank" rel="noopener">Política de Privacidade</Link>.
            Para continuar usando a conta, leia e confirme. Se preferir, saia: o conteúdo continua aberto.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => sair()}>Sair da conta</Button>
          <Button
            variant="contained"
            disabled={enviando}
            onClick={async () => {
              setEnviando(true)
              await aceitarPolitica(VERSAO_POLITICA).finally(() => setEnviando(false))
            }}
          >
            Li e concordo
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
