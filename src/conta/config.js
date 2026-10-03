// Endereço da API (Cloud Run) e ID do cliente OAuth do Google. Ambos são públicos e ficam em
// .env.production / .env.development. Sem eles, o site funciona sem a parte de contas.
export const API_URL = import.meta.env.VITE_API_URL ?? ''
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''
export const CONTAS_ATIVAS = Boolean(API_URL && GOOGLE_CLIENT_ID)

// Versão da Política de Privacidade (a mesma de api/src/app.js)
export const VERSAO_POLITICA = '2026-10-02'
