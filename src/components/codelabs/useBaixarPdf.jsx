import { useState } from 'react'
import { Alert, Button, Snackbar } from '@mui/material'
import { baixarDoPcloud, pcloudRaiz } from '../../pcloud'

// Baixa o PDF de um codelab direto do pCloud e mostra um aviso se algo der errado.
export default function useBaixarPdf() {
  const [baixando, setBaixando] = useState(false)
  const [erro, setErro] = useState(false)

  const baixar = async (caminho) => {
    setBaixando(true)
    try {
      await baixarDoPcloud(caminho)
    } catch (e) {
      console.error(e)
      setErro(true)
    } finally {
      // o download segue no navegador; libera o botão logo depois
      setTimeout(() => setBaixando(false), 1200)
    }
  }

  const aviso = (
    <Snackbar open={erro} autoHideDuration={8000} onClose={() => setErro(false)}>
      <Alert
        severity="warning"
        onClose={() => setErro(false)}
        action={
          <Button color="inherit" size="small" href={pcloudRaiz} target="_blank" rel="noopener">
            Abrir no pCloud
          </Button>
        }
      >
        Não consegui baixar o PDF agora.
      </Alert>
    </Snackbar>
  )

  return { baixar, baixando, aviso }
}
