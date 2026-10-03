// Abre a janela de entrar de qualquer lugar do site (menu, leitor, dúvidas, convites)
import { useSyncExternalStore } from 'react'

let estado = { aberto: false, titulo: undefined }
const assinantes = new Set()
const emitir = (novo) => {
  estado = novo
  assinantes.forEach((fn) => fn())
}

export const abrirEntrar = (titulo) => emitir({ aberto: true, titulo })
export const fecharEntrar = () => emitir({ aberto: false, titulo: undefined })
export const useDialogoEntrar = () =>
  useSyncExternalStore((fn) => (assinantes.add(fn), () => assinantes.delete(fn)), () => estado)
