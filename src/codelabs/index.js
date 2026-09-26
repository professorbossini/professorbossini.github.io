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

// Progresso salvo no navegador: último passo visitado de cada codelab
const chave = (id) => `codelab:${id}:passo`
export function lerProgresso(id) {
  try {
    return Number(localStorage.getItem(chave(id))) || 0
  } catch {
    return 0
  }
}
export function salvarProgresso(id, passo) {
  try {
    localStorage.setItem(chave(id), String(passo))
  } catch {
    // navegação privada: segue sem salvar
  }
}
