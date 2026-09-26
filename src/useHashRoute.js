import { useEffect, useState } from 'react'

// Rota simples baseada no hash (#/secao/param1/param2): funciona no GitHub Pages sem
// configuração de servidor e mantém o botão voltar do navegador.
const lerHash = (ids, padrao) => {
  const [id, ...parametros] = window.location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent)
  return ids.includes(id) ? { rota: id, parametros } : { rota: padrao, parametros: [] }
}

export default function useHashRoute(ids, padrao) {
  const [estado, setEstado] = useState(() => lerHash(ids, padrao))

  useEffect(() => {
    const aoMudar = () => setEstado(lerHash(ids, padrao))
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [ids, padrao])

  const navegar = (id) => {
    window.location.hash = `/${id}`
  }

  return [estado.rota, navegar, estado.parametros]
}
