// Título e descrição de cada seção, usados nas páginas geradas no build (vite.config.js)
// e ao trocar de seção no navegador. Sem imports de componentes: o build lê este arquivo no Node.
export const SITE = 'https://professorbossini.dev'
export const NOME = 'Rodrigo Bossini'

export const paginas = {
  inicio: {
    titulo: 'Rodrigo Bossini — Professor e Desenvolvedor',
    descricao:
      'Professor universitário de Inteligência Artificial, Algoritmos, Computação em Nuvem e DevOps no Instituto Mauá, na São Judas e na Fatec. Material didático, codelabs e trajetória.',
  },
  material: {
    titulo: 'Material didático',
    descricao: 'Apostilas, slides e exercícios das disciplinas do professor Rodrigo Bossini: Java, web, mobile, bancos de dados, IA, AWS e DevOps.',
  },
  codelabs: {
    titulo: 'Bossini Codelabs',
    descricao:
      'Tutoriais gratuitos, passo a passo, para aprender fazendo: Java, React, React Native, Flutter, AWS, DevOps, bancos de dados, algoritmos e IA.',
    imagem: '/og-codelabs.png',
  },
  redes: {
    titulo: 'Redes sociais',
    descricao: 'Instagram, LinkedIn e GitHub do professor Rodrigo Bossini: aulas, dicas de programação, IA, AWS e DevOps.',
  },
  formacao: {
    titulo: 'Formação e certificações',
    descricao: 'Mestre em Ciência da Computação pela USP e bacharel pela UNIFIEO, com certificações AWS, Google e Sun.',
  },
  'bossini-faz': {
    titulo: 'Bossini faz',
    descricao:
      'Maratonas e hackathons organizados, orientações de TCC, questões do ENADE, extensão, software, publicações e reconhecimentos do professor Rodrigo Bossini.',
  },
  musica: {
    titulo: 'Fora da sala de aula',
    descricao: 'Música, palco e a vida do professor Rodrigo Bossini além das aulas.',
  },
}

// Título completo da aba: a página inicial já traz o nome, as demais recebem o sufixo
export const tituloDaPagina = (id) => (id === 'inicio' ? paginas.inicio.titulo : `${paginas[id].titulo} · ${NOME}`)

export const tituloDaTrilha = (trilha) => `Trilha ${trilha.titulo} · Bossini Codelabs`

// Atualiza título, descrição e endereço canônico ao navegar sem recarregar a página
export function definirMeta({ titulo, descricao, caminho }) {
  document.title = titulo
  if (descricao) document.querySelector('meta[name="description"]')?.setAttribute('content', descricao)
  if (caminho) document.querySelector('link[rel="canonical"]')?.setAttribute('href', SITE + caminho)
}
