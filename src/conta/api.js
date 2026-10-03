// Chamadas à API com o token da sessão. Uma resposta 401 encerra a sessão local.
import { API_URL } from './config'
import { guardarSessao, token } from './sessao'

export class ErroApi extends Error {
  constructor(status, mensagem) {
    super(mensagem)
    this.status = status
  }
}

export async function api(caminho, { metodo = 'GET', corpo, autenticar = true } = {}) {
  const t = autenticar ? token() : null
  let resposta
  try {
    resposta = await fetch(API_URL + caminho, {
      method: metodo,
      headers: { ...(corpo !== undefined && { 'Content-Type': 'application/json' }), ...(t && { Authorization: `Bearer ${t}` }) },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    })
  } catch {
    throw new ErroApi(0, 'Sem conexão com o servidor. Tente de novo em instantes.')
  }
  const dados = await resposta.json().catch(() => ({}))
  if (resposta.status === 401 && t) guardarSessao(null)
  if (!resposta.ok) throw new ErroApi(resposta.status, dados.erro ?? 'Algo deu errado.')
  return dados
}
