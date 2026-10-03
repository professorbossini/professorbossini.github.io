// API do site: contas com Google, progresso nos codelabs, turmas e interação por passo.
// As dependências externas (banco, verificação do Google, segredo) chegam por parâmetro,
// para os testes poderem trocar a verificação do Google por uma falsa.
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { secureHeaders } from 'hono/secure-headers'
import { SignJWT, jwtVerify } from 'jose'

// Versão da Política de Privacidade; mudar aqui pede novo aceite a todos
export const VERSAO_POLITICA = '2026-10-02'
const DURACAO_SESSAO = '30d'
const RETENCAO_INATIVOS = '24 months'
const LIMITE_DUVIDAS_POR_HORA = 10

const CODELAB = /^[a-z0-9][a-z0-9-]{0,79}$/
const CODIGO_TURMA = /^[A-Z0-9]{6}$/
// sem 0/O e 1/I, que se confundem ao ditar o código em sala
const ALFABETO_CODIGO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

const erro = (status, mensagem) => new HTTPException(status, { message: mensagem })

function inteiro(valor, min, max, nome) {
  const n = Number(valor)
  if (!Number.isInteger(n) || n < min || n > max) throw erro(400, `${nome} inválido`)
  return n
}

function texto(valor, min, max, nome) {
  if (typeof valor !== 'string') throw erro(400, `${nome} inválido`)
  const t = valor.trim()
  if (t.length < min || t.length > max) throw erro(400, `${nome} deve ter de ${min} a ${max} caracteres`)
  return t
}

function codelab(valor) {
  if (typeof valor !== 'string' || !CODELAB.test(valor)) throw erro(400, 'codelab inválido')
  return valor
}

// "Ana Souza" -> "Ana S.": nas dúvidas públicas aparece só o primeiro nome e a inicial
function nomeCurto(nome) {
  const partes = nome.trim().split(/\s+/)
  return partes.length > 1 ? `${partes[0]} ${partes.at(-1)[0]}.` : partes[0]
}

function gerarCodigo() {
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  return [...bytes].map((b) => ALFABETO_CODIGO[b % ALFABETO_CODIGO.length]).join('')
}

const publico = (u, professores) => ({
  id: Number(u.id),
  nome: u.nome_exibicao || u.nome,
  nomeGoogle: u.nome,
  email: u.email,
  foto: u.foto,
  professor: professores.has(u.email.toLowerCase()),
  consentimentoVersao: u.consentimento_versao,
  consentimentoEm: u.consentimento_em,
  criadoEm: u.criado_em,
})

export function criarApp({ sql, verificarCredencial, segredo, professores = [], origens = [] }) {
  const chave = new TextEncoder().encode(segredo)
  const listaProfessores = new Set(professores.map((e) => e.trim().toLowerCase()).filter(Boolean))
  const app = new Hono()

  app.use('*', secureHeaders())
  app.use('*', cors({ origin: origens, allowHeaders: ['Authorization', 'Content-Type'], allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], maxAge: 86400 }))
  app.use('*', bodyLimit({ maxSize: 64 * 1024, onError: () => { throw erro(413, 'requisição grande demais') } }))

  app.onError((e, c) => {
    if (e instanceof HTTPException) return c.json({ erro: e.message }, e.status)
    console.error(e)
    return c.json({ erro: 'erro interno' }, 500)
  })

  // Retenção: contas sem acesso há 24 meses são excluídas. Roda no máximo a cada 12 horas
  // por instância, aproveitando uma requisição qualquer (não há processo agendado).
  let ultimaLimpeza = 0
  app.use('*', async (_c, next) => {
    if (Date.now() - ultimaLimpeza > 12 * 3600 * 1000) {
      ultimaLimpeza = Date.now()
      sql`delete from usuarios where ultimo_acesso < now() - ${RETENCAO_INATIVOS}::interval`.catch((e) => console.error('limpeza', e))
    }
    await next()
  })

  const emitirSessao = (u) =>
    new SignJWT({ v: u.versao_sessao }).setProtectedHeader({ alg: 'HS256' }).setSubject(String(u.id)).setIssuedAt().setExpirationTime(DURACAO_SESSAO).sign(chave)

  // Lê a sessão do cabeçalho Authorization. Obrigatória em `exigir`, opcional em `talvez`.
  async function usuarioDa(c) {
    const cabecalho = c.req.header('Authorization') ?? ''
    if (!cabecalho.startsWith('Bearer ')) return null
    try {
      const { payload } = await jwtVerify(cabecalho.slice(7), chave, { algorithms: ['HS256'] })
      const [u] = await sql`select * from usuarios where id = ${payload.sub}`
      if (!u || u.versao_sessao !== payload.v) return null
      return u
    } catch {
      return null
    }
  }
  const talvez = async (c, next) => {
    c.set('usuario', await usuarioDa(c))
    await next()
  }
  const exigir = async (c, next) => {
    const u = await usuarioDa(c)
    if (!u) throw erro(401, 'entre com sua conta Google')
    c.set('usuario', u)
    await next()
  }
  const ehProfessor = (u) => !!u && listaProfessores.has(u.email.toLowerCase())
  const exigirProfessor = async (c, next) => {
    if (!ehProfessor(c.get('usuario'))) throw erro(403, 'apenas o professor')
    await next()
  }
  const corpo = async (c) => {
    try {
      return await c.req.json()
    } catch {
      throw erro(400, 'JSON inválido')
    }
  }

  app.get('/saude', (c) => c.json({ ok: true }))

  // ---------- contas ----------

  // Recebe a credencial do "Entrar com Google". Conta nova só é criada com consentimento.
  app.post('/auth/google', async (c) => {
    const { credencial, consentimento } = await corpo(c)
    if (typeof credencial !== 'string') throw erro(400, 'credencial ausente')
    let perfil
    try {
      perfil = await verificarCredencial(credencial)
    } catch {
      throw erro(401, 'credencial do Google inválida')
    }
    if (!perfil?.sub || !perfil.email || perfil.email_verified === false) throw erro(401, 'conta Google sem e-mail verificado')

    let [u] = await sql`select * from usuarios where google_sub = ${perfil.sub}`
    if (!u) {
      if (consentimento !== VERSAO_POLITICA) {
        // ainda não há conta: o site mostra o resumo da política e pede o aceite
        return c.json({ novo: true, nome: perfil.name ?? perfil.email, email: perfil.email, versaoPolitica: VERSAO_POLITICA })
      }
      ;[u] = await sql`
        insert into usuarios (google_sub, email, nome, foto, consentimento_versao, consentimento_em)
        values (${perfil.sub}, ${perfil.email}, ${perfil.name ?? perfil.email}, ${perfil.picture ?? null}, ${VERSAO_POLITICA}, now())
        returning *`
    } else {
      // nome, e-mail e foto acompanham a conta Google; novo aceite quando a política muda
      const aceite = consentimento === VERSAO_POLITICA
      ;[u] = await sql`
        update usuarios set email = ${perfil.email}, nome = ${perfil.name ?? u.nome}, foto = ${perfil.picture ?? null},
          ultimo_acesso = now(),
          consentimento_versao = case when ${aceite} then ${VERSAO_POLITICA} else consentimento_versao end,
          consentimento_em = case when ${aceite} then now() else consentimento_em end
        where id = ${u.id} returning *`
    }
    return c.json({ token: await emitirSessao(u), usuario: publico(u, listaProfessores), versaoPolitica: VERSAO_POLITICA })
  })

  app.get('/eu', exigir, async (c) => {
    const u = c.get('usuario')
    await sql`update usuarios set ultimo_acesso = now() where id = ${u.id} and ultimo_acesso < now() - interval '1 day'`
    return c.json({ usuario: publico(u, listaProfessores), versaoPolitica: VERSAO_POLITICA })
  })

  app.post('/eu/consentimento', exigir, async (c) => {
    const { versao } = await corpo(c)
    if (versao !== VERSAO_POLITICA) throw erro(400, 'versão da política desatualizada')
    const [u] = await sql`update usuarios set consentimento_versao = ${VERSAO_POLITICA}, consentimento_em = now() where id = ${c.get('usuario').id} returning *`
    return c.json({ usuario: publico(u, listaProfessores) })
  })

  // Correção de dados (art. 18, III): o nome exibido pode ser trocado
  app.patch('/eu', exigir, async (c) => {
    const { nomeExibicao } = await corpo(c)
    const nome = nomeExibicao === null || nomeExibicao === '' ? null : texto(nomeExibicao, 2, 60, 'nome')
    const [u] = await sql`update usuarios set nome_exibicao = ${nome} where id = ${c.get('usuario').id} returning *`
    return c.json({ usuario: publico(u, listaProfessores) })
  })

  // Acesso e portabilidade (art. 18, II e V): todos os dados da conta, em JSON
  app.get('/eu/dados', exigir, async (c) => {
    const u = c.get('usuario')
    const [progresso, matriculas, uteis, duvidas] = await Promise.all([
      sql`select codelab, passo_max, passo_atual, quando from progresso where usuario_id = ${u.id} order by quando desc`,
      sql`select t.nome as turma, m.consentimento_em, m.entrou_em from matriculas m join turmas t on t.id = m.turma_id where m.usuario_id = ${u.id}`,
      sql`select codelab, passo, criado_em from uteis where usuario_id = ${u.id}`,
      sql`select codelab, passo, texto, resposta, criada_em, respondida_em from duvidas where usuario_id = ${u.id} order by criada_em`,
    ])
    const turmasCriadas = ehProfessor(u) ? await sql`select nome, codigo, trilha, criada_em from turmas where professor_id = ${u.id}` : []
    c.header('Content-Disposition', 'attachment; filename="meus-dados-professorbossini.json"')
    return c.json({
      geradoEm: new Date().toISOString(),
      conta: {
        email: u.email, nome: u.nome, nomeExibicao: u.nome_exibicao, foto: u.foto,
        consentimentoVersao: u.consentimento_versao, consentimentoEm: u.consentimento_em,
        criadoEm: u.criado_em, ultimoAcesso: u.ultimo_acesso,
      },
      progresso, matriculas, uteis, duvidas, turmasCriadas,
    })
  })

  // Encerra a sessão em todos os dispositivos
  app.post('/eu/sair-de-todos', exigir, async (c) => {
    await sql`update usuarios set versao_sessao = versao_sessao + 1 where id = ${c.get('usuario').id}`
    return c.json({ ok: true })
  })

  // Eliminação (art. 18, VI): apaga a conta e, em cascata, tudo o que pertence a ela
  app.delete('/eu', exigir, async (c) => {
    await sql`delete from usuarios where id = ${c.get('usuario').id}`
    return c.json({ ok: true })
  })

  // ---------- progresso ----------

  const salvarProgresso = (usuarioId, itens) =>
    sql`
      insert into progresso ${sql(itens.map((i) => ({ usuario_id: usuarioId, ...i })))}
      on conflict (usuario_id, codelab) do update set
        passo_max = greatest(progresso.passo_max, excluded.passo_max),
        passo_atual = case when excluded.quando >= progresso.quando then excluded.passo_atual else progresso.passo_atual end,
        quando = greatest(progresso.quando, excluded.quando)`

  const itemDeProgresso = (codelabId, { passoMax, passoAtual, quando }) => {
    const max = inteiro(passoMax, 1, 200, 'passoMax')
    const data = new Date(Number(quando) || Date.now())
    return {
      codelab: codelab(codelabId),
      passo_max: max,
      passo_atual: Math.min(inteiro(passoAtual ?? max, 1, 200, 'passoAtual'), 200),
      // não aceita data no futuro
      quando: data > new Date() ? new Date() : data,
    }
  }

  app.get('/progresso', exigir, async (c) => {
    const linhas = await sql`select codelab, passo_max, passo_atual, quando from progresso where usuario_id = ${c.get('usuario').id}`
    return c.json({
      progresso: linhas.map((l) => ({ codelab: l.codelab, passoMax: l.passo_max, passoAtual: l.passo_atual, quando: new Date(l.quando).getTime() })),
    })
  })

  app.put('/progresso/:codelab', exigir, async (c) => {
    await salvarProgresso(c.get('usuario').id, [itemDeProgresso(c.req.param('codelab'), await corpo(c))])
    return c.json({ ok: true })
  })

  // Envio em lote, usado ao entrar: junta o progresso do navegador com o da conta
  app.post('/progresso', exigir, async (c) => {
    const { itens } = await corpo(c)
    if (!Array.isArray(itens) || itens.length > 500) throw erro(400, 'itens inválidos')
    if (itens.length) await salvarProgresso(c.get('usuario').id, itens.map((i) => itemDeProgresso(i.codelab, i)))
    return c.json({ ok: true })
  })

  // ---------- turmas ----------

  app.post('/turmas', exigir, exigirProfessor, async (c) => {
    const { nome, trilha } = await corpo(c)
    const nomeTurma = texto(nome, 1, 120, 'nome')
    const trilhaId = trilha ? codelab(trilha) : null
    for (let tentativa = 0; tentativa < 5; tentativa++) {
      try {
        const [t] = await sql`insert into turmas (professor_id, nome, codigo, trilha) values (${c.get('usuario').id}, ${nomeTurma}, ${gerarCodigo()}, ${trilhaId}) returning *`
        return c.json({ turma: { id: Number(t.id), nome: t.nome, codigo: t.codigo, trilha: t.trilha, alunos: 0 } }, 201)
      } catch (e) {
        if (e.code !== '23505') throw e // código repetido: tenta outro
      }
    }
    throw erro(500, 'não foi possível gerar um código')
  })

  app.patch('/turmas/:id', exigir, exigirProfessor, async (c) => {
    const { nome, trilha } = await corpo(c)
    const [t] = await sql`
      update turmas set nome = ${texto(nome, 1, 120, 'nome')}, trilha = ${trilha ? codelab(trilha) : null}
      where id = ${inteiro(c.req.param('id'), 1, Number.MAX_SAFE_INTEGER, 'turma')} and professor_id = ${c.get('usuario').id} returning *`
    if (!t) throw erro(404, 'turma não encontrada')
    return c.json({ ok: true })
  })

  // Professor: turmas que criou. Aluno: turmas em que está.
  app.get('/turmas', exigir, async (c) => {
    const u = c.get('usuario')
    const minhas = await sql`
      select t.id, t.nome, t.codigo, t.trilha, t.criada_em, count(m.usuario_id)::int as alunos
      from turmas t left join matriculas m on m.turma_id = t.id
      where t.professor_id = ${u.id} group by t.id order by t.criada_em desc`
    const participo = await sql`
      select t.id, t.nome, t.trilha, m.entrou_em, p.nome as professor
      from matriculas m join turmas t on t.id = m.turma_id join usuarios p on p.id = t.professor_id
      where m.usuario_id = ${u.id} order by m.entrou_em desc`
    return c.json({
      criadas: ehProfessor(u) ? minhas.map((t) => ({ ...t, id: Number(t.id) })) : [],
      participo: participo.map((t) => ({ ...t, id: Number(t.id) })),
    })
  })

  // Antes de entrar: mostra de quem é a turma e o que será compartilhado
  app.get('/turmas/codigo/:codigo', async (c) => {
    const codigo = c.req.param('codigo').toUpperCase()
    if (!CODIGO_TURMA.test(codigo)) throw erro(400, 'código inválido')
    const [t] = await sql`select t.nome, t.trilha, p.nome as professor from turmas t join usuarios p on p.id = t.professor_id where t.codigo = ${codigo}`
    if (!t) throw erro(404, 'turma não encontrada')
    return c.json({ turma: t })
  })

  app.post('/turmas/entrar', exigir, async (c) => {
    const { codigo, consentimento } = await corpo(c)
    if (consentimento !== true) throw erro(400, 'é preciso concordar em compartilhar o progresso com o professor')
    const cod = String(codigo ?? '').toUpperCase()
    if (!CODIGO_TURMA.test(cod)) throw erro(400, 'código inválido')
    const [t] = await sql`select id, nome from turmas where codigo = ${cod}`
    if (!t) throw erro(404, 'turma não encontrada')
    await sql`insert into matriculas (turma_id, usuario_id, consentimento_em) values (${t.id}, ${c.get('usuario').id}, now()) on conflict do nothing`
    return c.json({ turma: { id: Number(t.id), nome: t.nome } })
  })

  // Aluno sai da turma (revoga o compartilhamento com o professor)
  app.delete('/turmas/:id/matricula', exigir, async (c) => {
    await sql`delete from matriculas where turma_id = ${inteiro(c.req.param('id'), 1, Number.MAX_SAFE_INTEGER, 'turma')} and usuario_id = ${c.get('usuario').id}`
    return c.json({ ok: true })
  })

  // Professor: alunos da turma e o progresso de cada um
  app.get('/turmas/:id', exigir, exigirProfessor, async (c) => {
    const id = inteiro(c.req.param('id'), 1, Number.MAX_SAFE_INTEGER, 'turma')
    const [t] = await sql`select * from turmas where id = ${id} and professor_id = ${c.get('usuario').id}`
    if (!t) throw erro(404, 'turma não encontrada')
    const alunos = await sql`
      select u.id, coalesce(u.nome_exibicao, u.nome) as nome, u.email, m.entrou_em,
        coalesce(json_agg(json_build_object('codelab', p.codelab, 'passoMax', p.passo_max, 'quando', p.quando)) filter (where p.codelab is not null), '[]') as progresso
      from matriculas m join usuarios u on u.id = m.usuario_id
      left join progresso p on p.usuario_id = u.id
      where m.turma_id = ${id}
      group by u.id, m.entrou_em order by nome`
    return c.json({
      turma: { id: Number(t.id), nome: t.nome, codigo: t.codigo, trilha: t.trilha, criadaEm: t.criada_em },
      alunos: alunos.map((a) => ({ ...a, id: Number(a.id) })),
    })
  })

  app.delete('/turmas/:id/alunos/:aluno', exigir, exigirProfessor, async (c) => {
    const id = inteiro(c.req.param('id'), 1, Number.MAX_SAFE_INTEGER, 'turma')
    const aluno = inteiro(c.req.param('aluno'), 1, Number.MAX_SAFE_INTEGER, 'aluno')
    await sql`delete from matriculas m using turmas t where m.turma_id = t.id and t.id = ${id} and t.professor_id = ${c.get('usuario').id} and m.usuario_id = ${aluno}`
    return c.json({ ok: true })
  })

  app.delete('/turmas/:id', exigir, exigirProfessor, async (c) => {
    await sql`delete from turmas where id = ${inteiro(c.req.param('id'), 1, Number.MAX_SAFE_INTEGER, 'turma')} and professor_id = ${c.get('usuario').id}`
    return c.json({ ok: true })
  })

  // ---------- interação por passo ----------

  const passoDe = (c) => ({ codelab: codelab(c.req.param('codelab')), passo: inteiro(c.req.param('passo'), 1, 200, 'passo') })

  // Público: quantos acharam o passo útil e as dúvidas (com nome curto). Com sessão, diz o que é seu.
  app.get('/passos/:codelab/:passo', talvez, async (c) => {
    const { codelab: cl, passo } = passoDe(c)
    const u = c.get('usuario')
    const [{ uteis }] = await sql`select count(*)::int as uteis from uteis where codelab = ${cl} and passo = ${passo}`
    const marcado = u ? (await sql`select 1 from uteis where usuario_id = ${u.id} and codelab = ${cl} and passo = ${passo}`).length > 0 : false
    const duvidas = await sql`
      select d.id, d.usuario_id, coalesce(u.nome_exibicao, u.nome) as nome, d.texto, d.resposta, d.criada_em, d.respondida_em
      from duvidas d join usuarios u on u.id = d.usuario_id
      where d.codelab = ${cl} and d.passo = ${passo} order by d.criada_em`
    return c.json({
      uteis,
      util: marcado,
      duvidas: duvidas.map((d) => ({
        id: Number(d.id),
        autor: nomeCurto(d.nome),
        texto: d.texto,
        resposta: d.resposta,
        criadaEm: d.criada_em,
        respondidaEm: d.respondida_em,
        minha: !!u && Number(d.usuario_id) === Number(u.id),
      })),
    })
  })

  app.post('/passos/:codelab/:passo/util', exigir, async (c) => {
    const { codelab: cl, passo } = passoDe(c)
    const id = c.get('usuario').id
    const apagadas = await sql`delete from uteis where usuario_id = ${id} and codelab = ${cl} and passo = ${passo} returning 1`
    if (!apagadas.length) await sql`insert into uteis (usuario_id, codelab, passo) values (${id}, ${cl}, ${passo}) on conflict do nothing`
    const [{ uteis }] = await sql`select count(*)::int as uteis from uteis where codelab = ${cl} and passo = ${passo}`
    return c.json({ util: !apagadas.length, uteis })
  })

  app.post('/passos/:codelab/:passo/duvidas', exigir, async (c) => {
    const { codelab: cl, passo } = passoDe(c)
    const u = c.get('usuario')
    const { texto: t } = await corpo(c)
    const conteudo = texto(t, 3, 2000, 'dúvida')
    const [{ n }] = await sql`select count(*)::int as n from duvidas where usuario_id = ${u.id} and criada_em > now() - interval '1 hour'`
    if (n >= LIMITE_DUVIDAS_POR_HORA && !ehProfessor(u)) throw erro(429, 'muitas dúvidas em pouco tempo; tente daqui a pouco')
    const [d] = await sql`insert into duvidas (usuario_id, codelab, passo, texto) values (${u.id}, ${cl}, ${passo}, ${conteudo}) returning id, criada_em`
    return c.json({ duvida: { id: Number(d.id), autor: nomeCurto(u.nome_exibicao || u.nome), texto: conteudo, resposta: null, criadaEm: d.criada_em, minha: true } }, 201)
  })

  // Autor ou professor apagam a dúvida
  app.delete('/duvidas/:id', exigir, async (c) => {
    const u = c.get('usuario')
    const id = inteiro(c.req.param('id'), 1, Number.MAX_SAFE_INTEGER, 'dúvida')
    const apagadas = ehProfessor(u)
      ? await sql`delete from duvidas where id = ${id} returning 1`
      : await sql`delete from duvidas where id = ${id} and usuario_id = ${u.id} returning 1`
    if (!apagadas.length) throw erro(404, 'dúvida não encontrada')
    return c.json({ ok: true })
  })

  app.put('/duvidas/:id/resposta', exigir, exigirProfessor, async (c) => {
    const { texto: t } = await corpo(c)
    const resposta = t === null || t === '' ? null : texto(t, 1, 4000, 'resposta')
    const [d] = await sql`
      update duvidas set resposta = ${resposta}, respondida_em = case when ${resposta}::text is null then null else now() end
      where id = ${inteiro(c.req.param('id'), 1, Number.MAX_SAFE_INTEGER, 'dúvida')} returning id`
    if (!d) throw erro(404, 'dúvida não encontrada')
    return c.json({ ok: true })
  })

  // Professor: dúvidas recentes de todos os codelabs, as sem resposta primeiro
  app.get('/duvidas', exigir, exigirProfessor, async (c) => {
    const linhas = await sql`
      select d.id, d.codelab, d.passo, coalesce(u.nome_exibicao, u.nome) as nome, d.texto, d.resposta, d.criada_em
      from duvidas d join usuarios u on u.id = d.usuario_id
      order by (d.resposta is null) desc, d.criada_em desc limit 100`
    return c.json({ duvidas: linhas.map((d) => ({ ...d, id: Number(d.id), autor: nomeCurto(d.nome), nome: undefined })) })
  })

  app.notFound((c) => c.json({ erro: 'rota não encontrada' }, 404))
  return app
}
