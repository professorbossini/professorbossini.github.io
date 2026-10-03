// Testes de integração contra um banco PostgreSQL de verdade (uma branch de testes no Neon).
// A verificação do Google é trocada por uma falsa: a "credencial" é o próprio perfil em JSON.
//   DATABASE_URL=postgres://... npm test
import assert from 'node:assert/strict'
import { after, before, describe, test } from 'node:test'
import { VERSAO_POLITICA, criarApp } from '../src/app.js'
import { conectar, migrar } from '../src/db.js'

const sql = conectar(process.env.DATABASE_URL)
const app = criarApp({
  sql,
  segredo: 'segredo-de-teste-com-pelo-menos-32-bytes!!',
  professores: ['prof@exemplo.com'],
  origens: ['http://localhost:5173'],
  verificarCredencial: async (credencial) => JSON.parse(credencial),
})

async function chamar(metodo, caminho, { token, corpo } = {}) {
  const r = await app.request(caminho, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  })
  return { status: r.status, dados: await r.json() }
}

const perfil = (sub, email, name) => JSON.stringify({ sub, email, name, email_verified: true })

async function entrar(sub, email, nome) {
  const { dados } = await chamar('POST', '/auth/google', { corpo: { credencial: perfil(sub, email, nome), consentimento: VERSAO_POLITICA } })
  return dados.token
}

before(async () => {
  await migrar(sql)
  await sql`truncate usuarios restart identity cascade`
})
after(() => sql.end())

describe('contas', () => {
  test('conta nova exige consentimento', async () => {
    const r = await chamar('POST', '/auth/google', { corpo: { credencial: perfil('g1', 'ana@exemplo.com', 'Ana Souza') } })
    assert.equal(r.status, 200)
    assert.equal(r.dados.novo, true)
    assert.equal(r.dados.token, undefined)
    const [{ n }] = await sql`select count(*)::int as n from usuarios`
    assert.equal(n, 0)
  })

  test('com consentimento cria a conta e devolve a sessão', async () => {
    const token = await entrar('g1', 'ana@exemplo.com', 'Ana Souza')
    const r = await chamar('GET', '/eu', { token })
    assert.equal(r.dados.usuario.nome, 'Ana Souza')
    assert.equal(r.dados.usuario.professor, false)
    assert.equal(r.dados.usuario.consentimentoVersao, VERSAO_POLITICA)
  })

  test('sem sessão ou com sessão inválida recebe 401', async () => {
    assert.equal((await chamar('GET', '/eu')).status, 401)
    assert.equal((await chamar('GET', '/eu', { token: 'abc' })).status, 401)
  })

  test('credencial sem e-mail verificado é recusada', async () => {
    const r = await chamar('POST', '/auth/google', { corpo: { credencial: JSON.stringify({ sub: 'x', email: 'x@x.com', email_verified: false }) } })
    assert.equal(r.status, 401)
  })

  test('sair de todos invalida a sessão antiga', async () => {
    const token = await entrar('g9', 'zeca@exemplo.com', 'Zeca')
    await chamar('POST', '/eu/sair-de-todos', { token })
    assert.equal((await chamar('GET', '/eu', { token })).status, 401)
  })

  test('troca o nome exibido', async () => {
    const token = await entrar('g1', 'ana@exemplo.com', 'Ana Souza')
    const r = await chamar('PATCH', '/eu', { token, corpo: { nomeExibicao: 'Aninha' } })
    assert.equal(r.dados.usuario.nome, 'Aninha')
    await chamar('PATCH', '/eu', { token, corpo: { nomeExibicao: null } })
  })
})

describe('progresso', () => {
  test('salva, junta em lote e nunca regride o passo máximo', async () => {
    const token = await entrar('g1', 'ana@exemplo.com', 'Ana Souza')
    await chamar('PUT', '/progresso/aws-agrosensor', { token, corpo: { passoMax: 5, passoAtual: 5, quando: Date.now() - 10000 } })
    await chamar('POST', '/progresso', { token, corpo: { itens: [
      { codelab: 'aws-agrosensor', passoMax: 3, passoAtual: 2, quando: Date.now() },
      { codelab: 'react-introducao', passoMax: 2, passoAtual: 2, quando: Date.now() },
    ] } })
    const { dados } = await chamar('GET', '/progresso', { token })
    const aws = dados.progresso.find((p) => p.codelab === 'aws-agrosensor')
    assert.equal(aws.passoMax, 5)
    assert.equal(aws.passoAtual, 2) // o mais recente vence
    assert.equal(dados.progresso.length, 2)
  })

  test('valida codelab e passo', async () => {
    const token = await entrar('g1', 'ana@exemplo.com', 'Ana Souza')
    assert.equal((await chamar('PUT', '/progresso/..%2Fetc', { token, corpo: { passoMax: 1 } })).status, 400)
    assert.equal((await chamar('PUT', '/progresso/aws', { token, corpo: { passoMax: 999 } })).status, 400)
  })
})

describe('turmas', () => {
  let prof, aluna, turma
  before(async () => {
    prof = await entrar('gp', 'prof@exemplo.com', 'Rodrigo Bossini')
    aluna = await entrar('g1', 'ana@exemplo.com', 'Ana Souza')
  })

  test('só o professor cria turma', async () => {
    assert.equal((await chamar('POST', '/turmas', { token: aluna, corpo: { nome: 'X' } })).status, 403)
    const r = await chamar('POST', '/turmas', { token: prof, corpo: { nome: 'Mauá 2026/2', trilha: 'react' } })
    assert.equal(r.status, 201)
    assert.match(r.dados.turma.codigo, /^[A-Z0-9]{6}$/)
    turma = r.dados.turma
  })

  test('aluna vê a turma pelo código e só entra com consentimento', async () => {
    const info = await chamar('GET', `/turmas/codigo/${turma.codigo.toLowerCase()}`)
    assert.equal(info.dados.turma.professor, 'Rodrigo Bossini')
    assert.equal((await chamar('POST', '/turmas/entrar', { token: aluna, corpo: { codigo: turma.codigo } })).status, 400)
    assert.equal((await chamar('POST', '/turmas/entrar', { token: aluna, corpo: { codigo: turma.codigo, consentimento: true } })).status, 200)
    const minhas = await chamar('GET', '/turmas', { token: aluna })
    assert.equal(minhas.dados.participo[0].nome, 'Mauá 2026/2')
    assert.equal(minhas.dados.criadas.length, 0)
  })

  test('professor vê os alunos e o progresso; aluna não vê', async () => {
    const r = await chamar('GET', `/turmas/${turma.id}`, { token: prof })
    assert.equal(r.dados.alunos.length, 1)
    assert.equal(r.dados.alunos[0].email, 'ana@exemplo.com')
    assert.ok(r.dados.alunos[0].progresso.some((p) => p.codelab === 'aws-agrosensor'))
    assert.equal((await chamar('GET', `/turmas/${turma.id}`, { token: aluna })).status, 403)
  })

  test('aluna sai da turma', async () => {
    await chamar('DELETE', `/turmas/${turma.id}/matricula`, { token: aluna })
    const r = await chamar('GET', `/turmas/${turma.id}`, { token: prof })
    assert.equal(r.dados.alunos.length, 0)
  })
})

describe('interação por passo', () => {
  let prof, aluna, outra
  before(async () => {
    prof = await entrar('gp', 'prof@exemplo.com', 'Rodrigo Bossini')
    aluna = await entrar('g1', 'ana@exemplo.com', 'Ana Souza')
    outra = await entrar('g2', 'bia@exemplo.com', 'Beatriz Lima')
  })

  test('útil alterna e conta', async () => {
    let r = await chamar('POST', '/passos/react-introducao/3/util', { token: aluna })
    assert.deepEqual(r.dados, { util: true, uteis: 1 })
    await chamar('POST', '/passos/react-introducao/3/util', { token: outra })
    r = await chamar('POST', '/passos/react-introducao/3/util', { token: aluna })
    assert.deepEqual(r.dados, { util: false, uteis: 1 })
  })

  test('dúvida pública mostra só o nome curto, e a resposta do professor aparece', async () => {
    const criada = await chamar('POST', '/passos/react-introducao/3/duvidas', { token: aluna, corpo: { texto: 'Por que o useEffect roda duas vezes?' } })
    assert.equal(criada.status, 201)
    await chamar('PUT', `/duvidas/${criada.dados.duvida.id}/resposta`, { token: prof, corpo: { texto: 'É o StrictMode, só no desenvolvimento.' } })
    const publico = await chamar('GET', '/passos/react-introducao/3')
    const d = publico.dados.duvidas[0]
    assert.equal(d.autor, 'Ana S.')
    assert.equal(d.minha, false)
    assert.equal(d.resposta, 'É o StrictMode, só no desenvolvimento.')
    assert.equal(JSON.stringify(publico.dados).includes('ana@exemplo.com'), false)
    const daAutora = await chamar('GET', '/passos/react-introducao/3', { token: aluna })
    assert.equal(daAutora.dados.duvidas[0].minha, true)
  })

  test('só a autora ou o professor apagam; aluna não responde', async () => {
    const criada = await chamar('POST', '/passos/react-introducao/4/duvidas', { token: aluna, corpo: { texto: 'Outra dúvida' } })
    assert.equal((await chamar('PUT', `/duvidas/${criada.dados.duvida.id}/resposta`, { token: outra, corpo: { texto: 'x' } })).status, 403)
    assert.equal((await chamar('DELETE', `/duvidas/${criada.dados.duvida.id}`, { token: outra })).status, 404)
    assert.equal((await chamar('DELETE', `/duvidas/${criada.dados.duvida.id}`, { token: prof })).status, 200)
  })

  test('limite de dúvidas por hora', async () => {
    for (let i = 0; i < 9; i++) await chamar('POST', '/passos/git/1/duvidas', { token: outra, corpo: { texto: `dúvida ${i}` } })
    assert.equal((await chamar('POST', '/passos/git/1/duvidas', { token: outra, corpo: { texto: 'mais uma' } })).status, 201)
    assert.equal((await chamar('POST', '/passos/git/1/duvidas', { token: outra, corpo: { texto: 'passou do limite' } })).status, 429)
  })
})

describe('LGPD', () => {
  test('exporta todos os dados da conta', async () => {
    const token = await entrar('g1', 'ana@exemplo.com', 'Ana Souza')
    const { dados } = await chamar('GET', '/eu/dados', { token })
    assert.equal(dados.conta.email, 'ana@exemplo.com')
    assert.ok(dados.progresso.length >= 2)
    assert.ok(dados.duvidas.length >= 1)
  })

  test('excluir a conta apaga tudo em cascata', async () => {
    const token = await entrar('g1', 'ana@exemplo.com', 'Ana Souza')
    assert.equal((await chamar('DELETE', '/eu', { token })).status, 200)
    const [{ p, d }] = await sql`
      select (select count(*) from progresso p join usuarios u on u.id = p.usuario_id where u.google_sub = 'g1')::int as p,
             (select count(*) from duvidas d join usuarios u on u.id = d.usuario_id where u.google_sub = 'g1')::int as d`
    assert.equal(p + d, 0)
    assert.equal((await sql`select 1 from usuarios where google_sub = 'g1'`).length, 0)
    assert.equal((await chamar('GET', '/eu', { token })).status, 401)
  })

  test('CORS só libera as origens configuradas', async () => {
    const ok = await app.request('/saude', { headers: { Origin: 'http://localhost:5173' } })
    assert.equal(ok.headers.get('access-control-allow-origin'), 'http://localhost:5173')
    const outro = await app.request('/saude', { headers: { Origin: 'https://malicioso.com' } })
    assert.equal(outro.headers.get('access-control-allow-origin'), null)
  })
})
