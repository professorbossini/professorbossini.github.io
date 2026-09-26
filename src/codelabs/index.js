// Codelabs no formato de fonte do Google Codelabs (Markdown do claat):
// cabeçalho "chave: valor", "# Título" e um passo por "## ", com "Duration: mm:ss".
// Cada codelab fica em src/codelabs/<id>/codelab.md e as imagens em public/codelabs/<id>/img/.
const arquivos = import.meta.glob('./*/codelab.md', { query: '?raw', import: 'default', eager: true })

// "mm:ss" -> minutos
const lerDuracao = (texto) => {
  const [min = 0, seg = 0] = texto.split(':').map(Number)
  return min + seg / 60
}

export function lerCodelab(id, fonte) {
  const meta = {}
  let titulo = ''
  const passos = []
  let emCodigo = false
  let noCabecalho = true

  for (const linha of fonte.split('\n')) {
    if (linha.trimStart().startsWith('```')) emCodigo = !emCodigo
    const passo = passos.at(-1)

    if (!emCodigo && noCabecalho) {
      const par = linha.match(/^([A-Za-z][\w ]*):\s*(.*)$/)
      if (par) {
        meta[par[1].trim().toLowerCase()] = par[2].trim()
        continue
      }
      if (linha.startsWith('# ')) {
        titulo = linha.slice(2).trim()
        noCabecalho = false
      }
      continue
    }
    if (!emCodigo && linha.startsWith('## ')) {
      passos.push({ titulo: linha.slice(3).trim(), duracao: 0, linhas: [] })
      continue
    }
    if (!passo) continue
    const duracao = !emCodigo && passo.linhas.length === 0 && linha.match(/^Duration:\s*([\d:]+)/)
    if (duracao) {
      passo.duracao = lerDuracao(duracao[1])
      continue
    }
    passo.linhas.push(linha)
  }

  const lista = (texto = '') => texto.split(',').map((s) => s.trim()).filter(Boolean)
  return {
    id: meta.id || id,
    titulo,
    resumo: meta.summary || '',
    categorias: lista(meta.categories),
    tags: lista(meta.tags),
    autores: lista(meta.authors),
    atualizado: meta['last updated'] ? new Date(`${meta['last updated']}T12:00:00`) : null,
    pdf: meta.pdf || null,
    feedback: meta['feedback link'] || null,
    passos: passos.map(({ titulo: t, duracao, linhas }) => ({ titulo: t, duracao, markdown: linhas.join('\n').trim() })),
    duracaoTotal: Math.round(passos.reduce((soma, p) => soma + p.duracao, 0)),
  }
}

export const codelabs = Object.entries(arquivos)
  .map(([caminho, fonte]) => lerCodelab(caminho.split('/')[1], fonte))
  .sort((a, b) => (b.atualizado ?? 0) - (a.atualizado ?? 0))

export const buscarCodelab = (id) => codelabs.find((c) => c.id === id)

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
