// Sessão do usuário: o token da API fica no localStorage (sem cookies) e o perfil em memória.
// Um pequeno "store" com assinantes, usado pelo hook useConta (useSyncExternalStore).
const CHAVE = 'conta:sessao'

const ler = () => {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) ?? null
  } catch {
    return null
  }
}

let estado = { sessao: ler(), carregando: false }
const assinantes = new Set()

export const obterEstado = () => estado
export function assinar(fn) {
  assinantes.add(fn)
  return () => assinantes.delete(fn)
}
function emitir(novo) {
  estado = { ...estado, ...novo }
  assinantes.forEach((fn) => fn())
}

export const token = () => estado.sessao?.token ?? null
export const usuario = () => estado.sessao?.usuario ?? null

export function guardarSessao(sessao) {
  try {
    if (sessao) localStorage.setItem(CHAVE, JSON.stringify(sessao))
    else localStorage.removeItem(CHAVE)
  } catch {
    // navegação privada: a sessão vale só nesta aba
  }
  emitir({ sessao })
}

export const atualizarUsuario = (u) => estado.sessao && guardarSessao({ ...estado.sessao, usuario: u })
export const definirCarregando = (carregando) => emitir({ carregando })

// outra aba entrou ou saiu
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => e.key === CHAVE && emitir({ sessao: ler() }))
}
