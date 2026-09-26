import { useEffect, useState } from 'react'

// Rotas por caminho (/secao/param1/param2). No GitHub Pages, cada página tem um index.html
// gerado no build (plugin paginasEstaticas, em vite.config.js) e o 404.html abre o app nas
// demais, como /codelabs/<id>/<passo>.
const EVENTO = 'rota'

const lerCaminho = (ids, padrao) => {
  const [id, ...parametros] = window.location.pathname.split('/').filter(Boolean).map(decodeURIComponent)
  return ids.includes(id) ? { rota: id, parametros } : { rota: padrao, parametros: [] }
}

// Navega sem recarregar a página
export function irPara(caminho, { substituir = false } = {}) {
  if (caminho === window.location.pathname + window.location.search) return
  window.history[substituir ? 'replaceState' : 'pushState'](null, '', caminho)
  window.dispatchEvent(new Event(EVENTO))
}

// Links antigos com hash (#/codelabs/...) continuam funcionando
export function converterHashAntigo() {
  const { hash } = window.location
  if (!hash.startsWith('#/')) return
  // termina com barra, como as páginas geradas no build, exceto nos passos (/codelabs/<id>/<n>)
  const caminho = hash.slice(1).replace(/\/?$/, (fim, i, s) => (/\/\d+$/.test(s) ? '' : '/'))
  window.history.replaceState(null, '', caminho)
}

export default function useRota(ids, padrao) {
  const [estado, setEstado] = useState(() => lerCaminho(ids, padrao))

  useEffect(() => {
    const aoMudar = () => setEstado(lerCaminho(ids, padrao))
    const aoMudarHash = () => {
      converterHashAntigo()
      aoMudar()
    }
    // cliques em links internos (<a href="/codelabs">) trocam de página sem recarregar
    const aoClicar = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest?.('a[href]')
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const url = new URL(a.href)
      if (url.hash && url.pathname === window.location.pathname) return // âncora na mesma página
      const [primeiro] = url.pathname.split('/').filter(Boolean)
      const ehArquivo = /\.[a-z0-9]+$/i.test(url.pathname)
      if (url.origin !== window.location.origin || ehArquivo || (primeiro && !ids.includes(primeiro))) return
      e.preventDefault()
      irPara(url.pathname + url.search)
    }
    window.addEventListener('popstate', aoMudar)
    window.addEventListener('hashchange', aoMudarHash)
    window.addEventListener(EVENTO, aoMudar)
    document.addEventListener('click', aoClicar)
    return () => {
      window.removeEventListener('popstate', aoMudar)
      window.removeEventListener('hashchange', aoMudarHash)
      window.removeEventListener(EVENTO, aoMudar)
      document.removeEventListener('click', aoClicar)
    }
  }, [ids, padrao])

  return [estado.rota, estado.parametros]
}
