import logoGoogle from 'devicon/icons/google/google-original.svg'
import logoAws from './assets/logos/aws.svg'
import logoSun from './assets/logos/sun.svg'
import logoUnifieo from './assets/logos/unifieo.png'
import logoUsp from './assets/logos/usp.svg'

export const topicos = ['Algoritmos', 'Computação em Nuvem', 'DevOps', 'Inteligência Artificial', 'Desenvolvimento de Software']

export const links = {
  instagramProfessor: 'https://www.instagram.com/professorbossini',
  instagramPessoal: 'https://www.instagram.com/rodrigobossini',
  linkedin: 'https://www.linkedin.com/in/rodrigobossini',
  github: 'https://github.com/professorbossini',
}

export const formacao = [
  {
    titulo: 'Mestre em Ciência da Computação',
    instituicao: 'Universidade de São Paulo (USP)',
    logo: logoUsp,
    dissertacao:
      'Construção do livro de ofertas a partir de dados de alta frequência e um algoritmo para predição de valores baseado em agrupamento e regressão linear (2013)',
  },
  { titulo: 'Bacharel em Ciência da Computação', instituicao: 'Centro Universitário FIEO (UNIFIEO)', logo: logoUnifieo },
]

export const certificacoes = [
  { nome: 'AWS Certified AI Practitioner', emissor: 'AWS', logo: logoAws },
  { nome: 'AWS Certified Cloud Practitioner', emissor: 'AWS', logo: logoAws },
  { nome: 'Google Certified Educator Level 2', emissor: 'Google', logo: logoGoogle },
  { nome: 'Sun Certified Java Programmer', emissor: 'Sun', logo: logoSun },
  { nome: 'Sun Certified Web Component Developer', emissor: 'Sun', logo: logoSun },
]

export const areas = ['Inteligência Artificial', 'Análise de Algoritmos', 'Computação em Nuvem', 'DevOps', 'Desenvolvimento de Software']

export const fotos = [
  // foto em pé: no celular ela vira um quadro largo, então o corte parte do topo para não cortar a cabeça
  { src: '/images/palco-roxo.jpg', alt: 'Rodrigo tocando guitarra em um palco com luz roxa', posicao: 'center 12%' },
  { src: '/images/musica-1.jpg', alt: 'Rodrigo tocando guitarra em um show' },
  { src: '/images/musica-3.jpg', alt: 'Rodrigo cantando e tocando violão' },
  { src: '/images/musica-4.jpg', alt: 'Rodrigo tocando guitarra roxa em um ensaio' },
  { src: '/images/musica-5.jpg', alt: 'Rodrigo tocando guitarra em um evento' },
]

export const redes = [
  {
    href: links.instagramProfessor,
    marca: 'instagram',
    title: 'Programação e ensino',
    curto: 'Professor',
    handle: '@professorbossini',
    text: 'IA, aulas, dicas de programação, algoritmos, AWS e DevOps.',
    featured: true,
  },
  {
    href: links.instagramPessoal,
    marca: 'instagram',
    title: 'Perfil pessoal',
    curto: 'Pessoal',
    handle: '@rodrigobossini',
    text: 'A vida fora da sala de aula: música, leituras e afins.',
  },
  {
    href: links.linkedin,
    marca: 'linkedin',
    title: 'LinkedIn',
    curto: 'LinkedIn',
    handle: 'in/rodrigobossini',
    text: 'Trajetória profissional, palestras e contato.',
  },
  {
    href: links.github,
    marca: 'github',
    title: 'GitHub',
    curto: 'GitHub',
    handle: 'professorbossini',
    text: 'Código das aulas, exemplos e projetos.',
  },
]
