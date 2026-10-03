// Sincroniza o progresso dos codelabs entre o navegador e a conta.
// O localStorage continua sendo a fonte rápida; com sessão, cada mudança também vai para a API
// e, ao entrar, o progresso das duas pontas é juntado (vale o passo mais adiantado).
import { codelabs, lerAcesso, mesclarAcesso } from '../codelabs'
import { api } from './api'
import { token } from './sessao'

const pendentes = new Map()
let timer

function enviarPendentes() {
  timer = null
  const itens = [...pendentes.entries()].map(([codelab, a]) => ({ codelab, passoMax: a.maximo, passoAtual: a.atual, quando: a.quando }))
  pendentes.clear()
  if (!itens.length || !token()) return
  api('/progresso', { metodo: 'POST', corpo: { itens } }).catch(() => {
    // sem conexão: volta para a fila e tenta na próxima mudança
    for (const i of itens) if (!pendentes.has(i.codelab)) pendentes.set(i.codelab, { maximo: i.passoMax, atual: i.passoAtual, quando: i.quando })
  })
}

// Chamado a cada troca de passo (evento disparado por registrarAcesso)
function aoMudar(e) {
  if (!token()) return
  pendentes.set(e.detail.id, lerAcesso(e.detail.id))
  clearTimeout(timer)
  timer = setTimeout(enviarPendentes, 1500)
}

// Ao entrar: traz o progresso da conta para o navegador e manda o que só existe aqui
export async function sincronizarAoEntrar() {
  const { progresso } = await api('/progresso')
  const daConta = new Map(progresso.map((p) => [p.codelab, p]))
  for (const p of progresso) mesclarAcesso(p.codelab, { maximo: p.passoMax, atual: p.passoAtual, quando: p.quando })
  const itens = []
  for (const c of codelabs) {
    const local = lerAcesso(c.id)
    const remoto = daConta.get(c.id)
    if (local.maximo && (!remoto || local.maximo > remoto.passoMax || local.quando > remoto.quando)) {
      itens.push({ codelab: c.id, passoMax: local.maximo, passoAtual: local.atual, quando: local.quando || Date.now() })
    }
  }
  if (itens.length) await api('/progresso', { metodo: 'POST', corpo: { itens } })
}

if (typeof window !== 'undefined') {
  window.addEventListener('codelab:progresso', aoMudar)
  window.addEventListener('pagehide', () => timer && enviarPendentes())
}
