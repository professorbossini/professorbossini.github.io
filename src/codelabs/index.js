// Codelabs no formato de fonte do Google Codelabs (Markdown do claat).
// Cada codelab fica em src/codelabs/<id>/codelab.md e as imagens em public/codelabs/<id>/img/.
import indice from 'virtual:codelabs-indice'
import { lerCodelab } from './parser'

export { lerCodelab }

// Índice leve (metadados e títulos/durações dos passos), gerado no build pelo plugin do vite.config.js
export const codelabs = indice
  .map((c) => ({ ...c, atualizado: c.atualizado ? new Date(`${c.atualizado}T12:00:00`) : null }))
  .sort((a, b) => (b.atualizado ?? 0) - (a.atualizado ?? 0))

export const buscarCodelab = (id) => codelabs.find((c) => c.id === id)

// O texto completo de cada codelab só é baixado quando ele é aberto
const fontes = import.meta.glob('./*/codelab.md', { query: '?raw', import: 'default' })
export async function carregarCodelab(id) {
  const carregar = fontes[`./${id}/codelab.md`]
  if (!carregar) return null
  const completo = lerCodelab(id, await carregar())
  return { ...buscarCodelab(id), passos: completo.passos }
}

// 281 -> "4 h 41 min"
export function formatarDuracao(minutos) {
  const h = Math.floor(minutos / 60)
  const m = Math.round(minutos % 60)
  if (!h) return `${m} min`
  return m ? `${h} h ${m} min` : `${h} h`
}

// Progresso salvo no navegador, por codelab: passo mais adiantado visitado (`passo`),
// último passo aberto (`atual`) e data do último acesso (`quando`).
const chave = (id, campo) => `codelab:${id}:${campo}`
const ler = (id, campo) => {
  try {
    return Number(localStorage.getItem(chave(id, campo))) || 0
  } catch {
    return 0
  }
}

export const lerProgresso = (id) => ler(id, 'passo')

export function lerAcesso(id) {
  const maximo = ler(id, 'passo')
  return { maximo, atual: ler(id, 'atual') || maximo, quando: ler(id, 'quando') }
}

export function registrarAcesso(id, passo) {
  try {
    if (passo > ler(id, 'passo')) localStorage.setItem(chave(id, 'passo'), String(passo))
    localStorage.setItem(chave(id, 'atual'), String(passo))
    localStorage.setItem(chave(id, 'quando'), String(Date.now()))
  } catch {
    // navegação privada: segue sem salvar
  }
}
