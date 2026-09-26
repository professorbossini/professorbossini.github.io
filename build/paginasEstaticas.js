// Gera, depois do build, um index.html para cada endereço do site (seções, codelabs e trilhas),
// com título, descrição e prévia para redes sociais próprios, além do texto da página para
// buscadores. Também gera o 404.html (que abre o app nos demais endereços), o sitemap.xml e o
// robots.txt. O React substitui o conteúdo pré-gerado ao carregar.
import fs from 'node:fs'
import path from 'node:path'
import { Marked } from 'marked'
import { NOME, SITE, paginas, tituloDaPagina, tituloDaTrilha } from '../src/paginas.js'
import { trilhas } from '../src/codelabs/trilhas.js'

const escapar = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const pessoa = {
  '@type': 'Person',
  name: 'Rodrigo Bossini Tavares Moreira',
  alternateName: NOME,
  url: `${SITE}/`,
  image: `${SITE}/images/perfil.webp`,
  jobTitle: 'Professor universitário e desenvolvedor de software',
  worksFor: [
    { '@type': 'CollegeOrUniversity', name: 'Instituto Mauá de Tecnologia', url: 'https://maua.br' },
    { '@type': 'CollegeOrUniversity', name: 'Universidade São Judas Tadeu', url: 'https://www.usjt.br' },
    { '@type': 'CollegeOrUniversity', name: 'Fatec Ipiranga', url: 'https://fatecipiranga.cps.sp.gov.br' },
  ],
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Universidade de São Paulo' },
    { '@type': 'CollegeOrUniversity', name: 'Centro Universitário FIEO' },
  ],
  sameAs: [
    'https://www.instagram.com/professorbossini',
    'https://www.linkedin.com/in/rodrigobossini',
    'https://github.com/professorbossini',
    'http://lattes.cnpq.br/6239865403144513',
  ],
}

function metas({ caminho, titulo, descricao, imagem = '/og.png', tipo = 'website', jsonLd, indexar = true }) {
  const url = SITE + caminho
  return [
    `<title>${escapar(titulo)}</title>`,
    `<meta name="description" content="${escapar(descricao)}" />`,
    indexar ? `<link rel="canonical" href="${url}" />` : '<meta name="robots" content="noindex" />',
    `<meta property="og:type" content="${tipo}" />`,
    `<meta property="og:site_name" content="${NOME}" />`,
    '<meta property="og:locale" content="pt_BR" />',
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${escapar(titulo)}" />`,
    `<meta property="og:description" content="${escapar(descricao)}" />`,
    `<meta property="og:image" content="${SITE}${imagem}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    jsonLd && `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...jsonLd }).replace(/</g, '\\u003c')}</script>`,
  ]
    .filter(Boolean)
    .map((linha) => `    ${linha}`)
    .join('\n')
}

// Menu com links para as seções, para os buscadores encontrarem todas as páginas
const menu = () =>
  `<nav><ul>${Object.entries(paginas)
    .map(([id, p]) => `<li><a href="${id === 'inicio' ? '/' : `/${id}`}">${escapar(p.titulo)}</a></li>`)
    .join('')}</ul></nav>`

function markdownParaHtml(markdown, codelabId) {
  const marked = new Marked({
    gfm: true,
    renderer: {
      image({ href, text }) {
        const src = /^(https?:)?\//.test(href) ? href : `/codelabs/${codelabId}/${href}`
        return `<img src="${escapar(src)}" alt="${escapar(text)}" loading="lazy">`
      },
    },
  })
  return marked.parse(markdown)
}

const minutos = (passos) => Math.max(1, Math.round(passos.reduce((s, p) => s + p.duracao, 0)))

export default function paginasEstaticas({ lerCodelabs }) {
  let saida
  return {
    name: 'paginas-estaticas',
    apply: 'build',
    configResolved(config) {
      saida = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const modelo = fs.readFileSync(path.join(saida, 'index.html'), 'utf8')
      const inicio = modelo.indexOf('<!-- meta:inicio')
      const fim = modelo.indexOf('<!-- meta:fim -->') + '<!-- meta:fim -->'.length
      if (inicio < 0 || fim < inicio) throw new Error('paginas-estaticas: marcadores meta:inicio/meta:fim não encontrados no index.html')

      const montar = (meta, corpo) =>
        (modelo.slice(0, inicio).trimEnd() + '\n' + metas(meta) + '\n' + modelo.slice(fim).replace(/^\n/, '')).replace(
          '<div id="root"></div>',
          `<div id="root"><div class="estatico">${corpo}${menu()}</div></div>`,
        )

      const escrever = (caminho, html) => {
        const destino = path.join(saida, caminho, 'index.html')
        fs.mkdirSync(path.dirname(destino), { recursive: true })
        fs.writeFileSync(destino, html)
      }

      const codelabs = lerCodelabs()
      const hoje = new Date().toISOString().slice(0, 10)
      const sitemap = []

      // seções
      for (const [id, p] of Object.entries(paginas)) {
        const caminho = id === 'inicio' ? '/' : `/${id}/`
        let corpo = `<h1>${escapar(p.titulo)}</h1><p>${escapar(p.descricao)}</p>`
        if (id === 'codelabs') {
          corpo += `<h2>Trilhas</h2><ul>${trilhas
            .map((t) => `<li><a href="/codelabs/trilha/${t.id}/">${escapar(t.titulo)}</a>: ${escapar(t.descricao)}</li>`)
            .join('')}</ul><h2>Todos os codelabs</h2><ul>${codelabs
            .map((c) => `<li><a href="/codelabs/${c.id}/">${escapar(c.titulo)}</a>: ${escapar(c.resumo)}</li>`)
            .join('')}</ul>`
        }
        const jsonLd =
          id === 'inicio'
            ? { '@type': 'ProfilePage', mainEntity: pessoa }
            : id === 'codelabs'
              ? { '@type': 'CollectionPage', name: p.titulo, description: p.descricao, url: SITE + caminho }
              : undefined
        escrever(caminho, montar({ caminho, titulo: tituloDaPagina(id), descricao: p.descricao, imagem: p.imagem, jsonLd }, corpo))
        sitemap.push({ caminho, data: hoje, prioridade: id === 'inicio' ? '1.0' : id === 'codelabs' ? '0.9' : '0.7' })
      }

      // codelabs
      for (const c of codelabs) {
        const caminho = `/codelabs/${c.id}/`
        const corpo =
          `<article><h1>${escapar(c.titulo)}</h1><p>${escapar(c.resumo)}</p>` +
          c.passos.map((p, i) => `<section><h2>${i + 1}. ${escapar(p.titulo)}</h2>${markdownParaHtml(p.markdown, c.id)}</section>`).join('') +
          `<p><a href="/codelabs/">Todos os codelabs</a></p></article>`
        const jsonLd = {
          '@type': 'TechArticle',
          headline: c.titulo,
          description: c.resumo,
          inLanguage: 'pt-BR',
          url: SITE + caminho,
          image: `${SITE}/og-codelabs.png`,
          author: pessoa,
          keywords: [...c.categorias, ...c.tags].join(', '),
          timeRequired: `PT${minutos(c.passos)}M`,
          ...(c.atualizado && { dateModified: c.atualizado }),
          isPartOf: { '@type': 'CollectionPage', name: 'Bossini Codelabs', url: `${SITE}/codelabs/` },
        }
        escrever(
          caminho,
          montar({ caminho, titulo: `${c.titulo} · Bossini Codelabs`, descricao: c.resumo, imagem: '/og-codelabs.png', tipo: 'article', jsonLd }, corpo),
        )
        sitemap.push({ caminho, data: c.atualizado ?? hoje, prioridade: '0.8' })
      }

      // trilhas
      const porId = Object.fromEntries(codelabs.map((c) => [c.id, c]))
      for (const t of trilhas) {
        const caminho = `/codelabs/trilha/${t.id}/`
        const itens = t.codelabs.map((id) => porId[id]).filter(Boolean)
        const corpo = `<h1>Trilha ${escapar(t.titulo)}</h1><p>${escapar(t.descricao)}</p><ol>${itens
          .map((c) => `<li><a href="/codelabs/${c.id}/">${escapar(c.titulo)}</a></li>`)
          .join('')}</ol>`
        const jsonLd = {
          '@type': 'ItemList',
          name: `Trilha ${t.titulo}`,
          description: t.descricao,
          itemListElement: itens.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/codelabs/${c.id}/` })),
        }
        escrever(caminho, montar({ caminho, titulo: tituloDaTrilha(t), descricao: t.descricao, imagem: '/og-codelabs.png', jsonLd }, corpo))
        sitemap.push({ caminho, data: hoje, prioridade: '0.6' })
      }

      // 404: abre o app nos endereços sem página própria (ex.: /codelabs/<id>/<passo>)
      const naoEncontrada = montar(
        { caminho: '/', titulo: paginas.inicio.titulo, descricao: paginas.inicio.descricao, indexar: false },
        '<h1>Rodrigo Bossini</h1><p>Carregando…</p>',
      )
      fs.writeFileSync(path.join(saida, '404.html'), naoEncontrada)

      fs.writeFileSync(
        path.join(saida, 'sitemap.xml'),
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          sitemap
            .map(({ caminho, data, prioridade }) => `  <url><loc>${SITE}${caminho}</loc><lastmod>${data}</lastmod><priority>${prioridade}</priority></url>`)
            .join('\n') +
          '\n</urlset>\n',
      )
      fs.writeFileSync(path.join(saida, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)

      console.log(`paginas-estaticas: ${sitemap.length} páginas, 404.html, sitemap.xml e robots.txt`)
    },
  }
}
