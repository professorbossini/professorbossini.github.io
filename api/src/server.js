// Ponto de entrada no Cloud Run. Configuração por variáveis de ambiente (os segredos vêm do
// Secret Manager): DATABASE_URL, SESSION_SECRET, GOOGLE_CLIENT_ID, PROFESSORES, ORIGENS.
import { serve } from '@hono/node-server'
import { OAuth2Client } from 'google-auth-library'
import { criarApp } from './app.js'
import { conectar, migrar } from './db.js'

const obrigatoria = (nome) => {
  const v = process.env[nome]
  if (!v) throw new Error(`variável de ambiente ${nome} não definida`)
  return v
}

const clienteId = obrigatoria('GOOGLE_CLIENT_ID')
const google = new OAuth2Client(clienteId)
const sql = conectar(obrigatoria('DATABASE_URL'))
await migrar(sql)

const app = criarApp({
  sql,
  segredo: obrigatoria('SESSION_SECRET'),
  professores: (process.env.PROFESSORES ?? '').split(','),
  origens: (process.env.ORIGENS ?? 'https://professorbossini.dev').split(','),
  async verificarCredencial(credencial) {
    const ticket = await google.verifyIdToken({ idToken: credencial, audience: clienteId })
    return ticket.getPayload()
  },
})

const porta = Number(process.env.PORT ?? 8080)
serve({ fetch: app.fetch, port: porta }, () => console.log(`API ouvindo na porta ${porta}`))
