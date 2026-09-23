import { useEffect, useState } from 'react'

// Rota simples baseada no hash (#/secao): funciona no GitHub Pages sem
// configuração de servidor e mantém o botão voltar do navegador.
const lerHash = (ids, padrao) => {
  const id = window.location.hash.replace(/^#\/?/, '')
  return ids.includes(id) ? id : padrao
}

export default function useHashRoute(ids, padrao) {
  const [rota, setRota] = useState(() => lerHash(ids, padrao))

  useEffect(() => {
    const aoMudar = () => setRota(lerHash(ids, padrao))
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [ids, padrao])

  const navegar = (id) => {
    window.location.hash = `/${id}`
  }

  return [rota, navegar]
}
