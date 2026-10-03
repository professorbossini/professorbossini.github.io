// Conexão com o Neon (PostgreSQL). O endereço com "-pooler" passa pelo PgBouncer em modo
// de transação, que não guarda comandos preparados: por isso prepare: false.
import fs from 'node:fs'
import postgres from 'postgres'

export function conectar(url) {
  // banco local de testes (sem TLS) ou Neon (TLS obrigatório)
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url)
  return postgres(url, { ssl: local ? false : 'require', prepare: false, max: local ? 1 : 5, idle_timeout: 20, connect_timeout: 15, onnotice: () => {} })
}

// Aplica o esquema (idempotente), com trava para duas instâncias não rodarem ao mesmo tempo
export async function migrar(sql) {
  const esquema = fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf8')
  await sql.begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(424242)`
    await tx.unsafe(esquema)
  })
}
