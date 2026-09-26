// Tema do template Faísca (https://github.com/professorbossini/faisca-auth-starter),
// portado para JavaScript. tokens.js, motion.js e theme.js seguem o original.
import { theme } from './theme'

export { theme, fontFamily, monoFontFamily } from './theme'
export { easing, duration, transition, stateLayer } from './motion'
export * as tokens from './tokens'

// Gradientes e brilho da marca (lima + violeta), definidos no CssBaseline do tema.
export const gradiente = 'var(--site-gradiente)'
export const gradienteTexto = 'var(--site-gradiente-texto)'
export const brilho = 'var(--site-brilho)'

export default theme
