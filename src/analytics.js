// Contador de visitas do GoatCounter: sem cookies e sem dados pessoais, por isso não precisa de
// aviso de consentimento. Para ativar, crie a conta em https://www.goatcounter.com e coloque aqui o
// código escolhido (o "xxx" de xxx.goatcounter.com). Vazio, nada é carregado.
export const GOATCOUNTER = 'professorbossini'

let script

function carregar() {
  if (script) return script
  script = document.createElement('script')
  script.async = true
  script.src = 'https://gc.zgo.at/count.js'
  script.dataset.goatcounter = `https://${GOATCOUNTER}.goatcounter.com/count`
  // o app conta cada troca de página; sem isso, o script contaria só a primeira
  script.dataset.goatcounterSettings = JSON.stringify({ no_onload: true })
  document.head.appendChild(script)
  return script
}

// Registra a visita a um endereço (chamado a cada troca de página)
export function registrarVisita(caminho) {
  if (!GOATCOUNTER || import.meta.env.DEV) return
  const contar = () => window.goatcounter?.count?.({ path: caminho })
  if (window.goatcounter?.count) contar()
  else carregar().addEventListener('load', contar, { once: true })
}
