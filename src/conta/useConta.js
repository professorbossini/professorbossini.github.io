import { useSyncExternalStore } from 'react'
import { limparProgressoLocal } from '../codelabs'
import { api } from './api'
import { CONTAS_ATIVAS } from './config'
import { desativarEntradaAutomatica } from './google'
import { sincronizarAoEntrar } from './progresso'
import { assinar, atualizarUsuario, guardarSessao, obterEstado, token } from './sessao'

export function useConta() {
  const { sessao, carregando } = useSyncExternalStore(assinar, obterEstado)
  return { usuario: sessao?.usuario ?? null, carregando, ativo: CONTAS_ATIVAS }
}

// Envia a credencial do Google. Para conta nova sem consentimento, devolve { novo: true, ... }
// e nada é gravado; com consentimento (versão da política), cria a conta e abre a sessão.
export async function entrarComGoogle(credencial, consentimento) {
  const r = await api('/auth/google', { metodo: 'POST', corpo: { credencial, consentimento }, autenticar: false })
  if (r.novo) return r
  guardarSessao({ token: r.token, usuario: r.usuario })
  sincronizarAoEntrar().catch(() => {})
  return r
}

export async function sair({ todosDispositivos = false } = {}) {
  if (todosDispositivos) await api('/eu/sair-de-todos', { metodo: 'POST' }).catch(() => {})
  guardarSessao(null)
  limparProgressoLocal()
  desativarEntradaAutomatica()
}

export async function aceitarPolitica(versao) {
  const { usuario } = await api('/eu/consentimento', { metodo: 'POST', corpo: { versao } })
  atualizarUsuario(usuario)
}

export async function trocarNome(nomeExibicao) {
  const { usuario } = await api('/eu', { metodo: 'PATCH', corpo: { nomeExibicao } })
  atualizarUsuario(usuario)
}

export async function excluirConta() {
  await api('/eu', { metodo: 'DELETE' })
  guardarSessao(null)
  limparProgressoLocal()
  desativarEntradaAutomatica()
}

// Ao abrir o site com sessão: confirma que ela vale, atualiza o perfil e traz o progresso
let iniciado = false
export function iniciarConta() {
  if (iniciado || !CONTAS_ATIVAS || !token()) return
  iniciado = true
  api('/eu')
    .then(({ usuario }) => {
      atualizarUsuario(usuario)
      return sincronizarAoEntrar()
    })
    .catch(() => {})
}
