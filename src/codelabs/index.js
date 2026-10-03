// Codelabs no formato de fonte do Google Codelabs (Markdown do claat).
// Cada codelab fica em src/codelabs/<id>/codelab.md e as imagens em public/codelabs/<id>/img/.
import indice from 'virtual:codelabs-indice'
import { lerCodelab } from './parser'

export { lerCodelab }

// Índice leve (metadados e títulos/durações dos passos), gerado no build pelo plugin do vite.config.js
// Séries numeradas pelo id: serverless-01-api-gateway, java-gui-02-login-mysql, dart-introducao-parte-3...
const SERIE = /^(.+?)-(?:parte-)?(\d+)(?:-|$)/
function serieDe(id) {
  const [, serie, parte] = id.match(SERIE) ?? []
  return serie ? { serie, parte: Number(parte) } : { serie: id, parte: 0 }
}

const lista = indice.map((c) => ({
  ...c,
  ...serieDe(c.id),
  atualizado: c.atualizado ? new Date(`${c.atualizado}T12:00:00`) : null,
}))

// Uma série fica junta, na data da parte mais recente, e as partes seguem em ordem crescente
const dataDaSerie = {}
for (const c of lista) dataDaSerie[c.serie] = Math.max(dataDaSerie[c.serie] ?? 0, c.atualizado ?? 0)

export const compararRecentes = (a, b) =>
  dataDaSerie[b.serie] - dataDaSerie[a.serie] || a.serie.localeCompare(b.serie) || a.parte - b.parte

export const codelabs = lista.sort(compararRecentes)

export const buscarCodelab = (id) => codelabs.find((c) => c.id === id)

// O passo 1 fica no endereço do próprio codelab, que é o que vai para o sitemap
export const urlCodelab = (id, passo = 1) => (passo > 1 ? `/codelabs/${id}/${passo}` : `/codelabs/${id}/`)

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
  // com a conta conectada, o progresso também vai para o servidor (src/conta/progresso.js)
  window.dispatchEvent(new CustomEvent('codelab:progresso', { detail: { id } }))
}

// Junta o progresso vindo da conta com o do navegador: vale o passo mais adiantado e,
// para o "continue de onde parou", o acesso mais recente
export function mesclarAcesso(id, { maximo, atual, quando }) {
  const local = lerAcesso(id)
  try {
    if (maximo > local.maximo) localStorage.setItem(chave(id, 'passo'), String(maximo))
    if (quando > local.quando) {
      localStorage.setItem(chave(id, 'atual'), String(atual))
      localStorage.setItem(chave(id, 'quando'), String(quando))
    }
  } catch {
    // navegação privada
  }
}

// Ao sair da conta neste navegador, o progresso local é apagado (ele continua salvo na conta)
export function limparProgressoLocal() {
  try {
    for (const k of Object.keys(localStorage)) if (k.startsWith('codelab:')) localStorage.removeItem(k)
  } catch {
    // navegação privada
  }
}
