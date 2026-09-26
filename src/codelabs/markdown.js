import { Marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import sql from 'highlight.js/lib/languages/sql'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import ini from 'highlight.js/lib/languages/ini'
import plaintext from 'highlight.js/lib/languages/plaintext'
import yaml from 'highlight.js/lib/languages/yaml'
import java from 'highlight.js/lib/languages/java'
import python from 'highlight.js/lib/languages/python'
import dart from 'highlight.js/lib/languages/dart'
import typescript from 'highlight.js/lib/languages/typescript'
import graphql from 'highlight.js/lib/languages/graphql'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import markedKatex from 'marked-katex-extension'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('ini', ini)
hljs.registerLanguage('text', plaintext)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('java', java)
hljs.registerLanguage('python', python)
hljs.registerLanguage('dart', dart)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('graphql', graphql)
hljs.registerLanguage('dockerfile', dockerfile)
hljs.registerLanguage('xml', xml)
hljs.registerAliases(['jsx', 'js'], { languageName: 'javascript' })
hljs.registerAliases(['tsx', 'ts'], { languageName: 'typescript' })
hljs.registerAliases(['plaintext', 'txt'], { languageName: 'text' })
hljs.registerAliases(['sh', 'shell', 'console'], { languageName: 'bash' })
hljs.registerAliases(['py'], { languageName: 'python' })

const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Converte o Markdown de um passo em HTML. Imagens relativas (img/...) apontam para
// public/codelabs/<id>/, e cada bloco de código ganha cores e um botão de copiar.
export function renderizarPasso(markdown, codelabId) {
  const marked = new Marked({
    gfm: true,
    hooks: {
      // tabelas dentro de um contêiner que rola na horizontal em telas pequenas
      postprocess: (html) => html.replace(/<table>/g, '<div class="tabela"><table>').replace(/<\/table>/g, '</table></div>'),
    },
    renderer: {
      code({ text, lang }) {
        const linguagem = hljs.getLanguage(lang) ? lang : 'text'
        const html = hljs.highlight(text, { language: linguagem }).value
        return `<div class="bloco-codigo"><button type="button" class="copiar" data-copiar aria-label="Copiar código">Copiar</button><pre><code class="hljs language-${linguagem}">${html}</code></pre></div>`
      },
      image({ href, text }) {
        const src = /^(https?:)?\//.test(href) ? href : `/codelabs/${codelabId}/${href}`
        return `<img src="${escapar(src)}" alt="${escapar(text)}" loading="lazy">`
      },
      link({ href, tokens }) {
        const externo = /^https?:/.test(href)
        const alvo = externo ? ' target="_blank" rel="noopener"' : ''
        return `<a href="${escapar(href)}"${alvo}>${this.parser.parseInline(tokens)}</a>`
      },
    },
  })
  // matemática em LaTeX: $...$ no texto e $$...$$ em bloco
  marked.use(markedKatex({ throwOnError: false, nonStandard: true }))
  return marked.parse(markdown)
}
