import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { lerCodelab } from './src/codelabs/parser.js'
import paginasEstaticas from './build/paginasEstaticas.js'

const PASTA_CODELABS = path.resolve('src/codelabs')
const VIRTUAL = 'virtual:codelabs-indice'

// Lê todos os codelabs (texto completo), do mais recente para o mais antigo
function lerCodelabs() {
  return fs
    .readdirSync(PASTA_CODELABS, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(PASTA_CODELABS, d.name, 'codelab.md')))
    .map((d) => {
      const c = lerCodelab(d.name, fs.readFileSync(path.join(PASTA_CODELABS, d.name, 'codelab.md'), 'utf8'))
      return { ...c, atualizado: c.atualizado ? c.atualizado.toISOString().slice(0, 10) : null }
    })
    .sort((a, b) => (b.atualizado ?? '').localeCompare(a.atualizado ?? ''))
}

// Gera, no build, um índice leve dos codelabs (metadados + títulos e durações dos passos),
// para a página de listagem não precisar baixar o texto completo de todos eles.
function indiceCodelabs() {
  const gerar = () =>
    lerCodelabs().map((c) => ({ ...c, passos: c.passos.map(({ titulo, duracao }) => ({ titulo, duracao })) }))
  return {
    name: 'indice-codelabs',
    resolveId: (id) => (id === VIRTUAL ? '\0' + VIRTUAL : null),
    load: (id) => (id === '\0' + VIRTUAL ? `export default ${JSON.stringify(gerar())}` : null),
    configureServer(server) {
      server.watcher.add(PASTA_CODELABS)
      const atualizar = (arquivo) => {
        if (!arquivo.endsWith('codelab.md')) return
        const mod = server.moduleGraph.getModuleById('\0' + VIRTUAL)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('change', atualizar)
      server.watcher.on('add', atualizar)
      server.watcher.on('unlink', atualizar)
    },
  }
}

export default defineConfig({
  plugins: [react(), indiceCodelabs(), paginasEstaticas({ lerCodelabs })],
})
