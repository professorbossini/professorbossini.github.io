// "Entrar com Google" (Google Identity Services). O script do Google só é carregado quando a
// pessoa abre a janela de entrar: quem não entra não troca nenhum dado com o Google.
import { GOOGLE_CLIENT_ID } from './config'

let carregamento

export function carregarGoogle() {
  carregamento ??= new Promise((resolver, rejeitar) => {
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.onload = () => resolver(window.google)
    s.onerror = () => {
      carregamento = null
      rejeitar(new Error('Não foi possível carregar o login do Google.'))
    }
    document.head.appendChild(s)
  })
  return carregamento
}

// Desenha o botão oficial do Google dentro de `elemento`; `aoEntrar` recebe a credencial (JWT)
export async function desenharBotao(elemento, aoEntrar, { escuro = false, largura = 280 } = {}) {
  const google = await carregarGoogle()
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (r) => aoEntrar(r.credential),
    ux_mode: 'popup',
    use_fedcm_for_button: true,
    context: 'signin',
  })
  google.accounts.id.renderButton(elemento, {
    type: 'standard',
    theme: escuro ? 'filled_black' : 'outline',
    size: 'large',
    shape: 'pill',
    text: 'continue_with',
    logo_alignment: 'left',
    locale: 'pt-BR',
    width: largura,
  })
}

export const desativarEntradaAutomatica = () => window.google?.accounts?.id?.disableAutoSelect()
