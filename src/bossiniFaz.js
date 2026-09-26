// Conteúdo da página "Bossini faz", selecionado do Currículo Lattes (atualizado em 25/08/2026).
import logoFatec from './assets/logos/fatec.svg'
import logoFiap from './assets/logos/fiap.jpg'
import logoFord from './assets/logos/ford.svg'
import logoInep from './assets/logos/inep.svg'
import logoMaua from './assets/logos/maua.svg'
import logoSamsung from './assets/logos/samsung.svg'
import logoUfscar from './assets/logos/ufscar.png'
import logoUnifieo from './assets/logos/unifieo.png'
import logoUsjt from './assets/logos/usjt.svg'

export const lattes = 'http://lattes.cnpq.br/6239865403144513'

const sites = {
  maua: 'https://maua.br',
  usjt: 'https://www.usjt.br',
  fatec: 'https://fatecipiranga.cps.sp.gov.br',
  unifieo: 'https://www.unifieo.br',
  fiap: 'https://www.fiap.com.br',
  ufscar: 'https://www.ufscar.br',
  enade: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enade',
  maratonaSbc: 'https://maratona.sbc.org.br',
  interfatecs: 'https://www.interfatecs.com.br',
  conic: 'https://conic-semesp.org.br',
  novotec: 'https://www.cps.sp.gov.br/novotec',
  telegramBots: 'https://core.telegram.org/bots/api',
}

export const numeros = [
  { valor: '14', rotulo: 'anos em sala de aula', detalhe: 'desde 2012' },
  { valor: '20', rotulo: 'maratonas, hackathons e concursos organizados' },
  { valor: '45', rotulo: 'orientações concluídas', detalhe: 'TCC e iniciação científica' },
  { valor: '68', rotulo: 'bancas de TCC' },
]

export const ondeLeciono = [
  {
    nome: 'Instituto Mauá de Tecnologia',
    logo: logoMaua,
    href: sites.maua,
    desde: 2020,
    cursos: 'Ciência da Computação e Engenharia de Computação',
    disciplinas: 'Desenvolvimento Full Stack e DevOps, Aplicações para Nuvem, Análise de Algoritmos, Desenvolvimento Multiplataforma',
  },
  {
    nome: 'Universidade São Judas Tadeu',
    logo: logoUsjt,
    href: sites.usjt,
    desde: 2015,
    cursos: 'Ciência da Computação, Sistemas de Informação e ADS',
    disciplinas: 'Desenvolvimento Web, Programação Orientada a Objetos, Sistemas Distribuídos e Mobile',
  },
  {
    nome: 'Fatec Ipiranga — Centro Paula Souza',
    logo: logoFatec,
    href: sites.fatec,
    desde: 2013,
    cursos: 'Análise e Desenvolvimento de Sistemas',
    disciplinas: 'Estruturas de Dados, Programação para Banco de Dados, Programação para Dispositivos Móveis',
  },
]

export const jaLecionei = [
  { nome: 'UNIFIEO', periodo: '2012–2022', logo: logoUnifieo, href: sites.unifieo },
  { nome: 'FIAP', periodo: '2019', logo: logoFiap, href: sites.fiap },
  { nome: 'UFSCar (tutor virtual)', periodo: '2011–2015', logo: logoUfscar, href: sites.ufscar },
]

export const avaliacaoNacional = [
  {
    titulo: 'Elaborador de questões do ENADE',
    texto: 'Provas de Engenharia de Computação, Ciência da Computação e Análise e Desenvolvimento de Sistemas.',
    logo: logoInep,
    href: sites.enade,
  },
  {
    titulo: 'Banco Nacional de Itens (BNI) do INEP',
    texto: 'Capacitação para a elaboração de itens do banco nacional, 2020.',
    logo: logoInep,
    href: sites.enade,
  },
  {
    titulo: 'Bancas e comissões',
    texto: '68 bancas de TCC, 5 comissões de concursos para docentes e avaliador em mais de 15 mostras e congressos.',
    icone: 'banca',
  },
]

export const gestaoAcademica = [
  { titulo: 'Núcleo Docente Estruturante de ADS', local: 'Fatec Ipiranga', periodo: '2017 – atual' },
  { titulo: 'Coordenador do Novotec Expresso', local: 'Fatec Ipiranga', periodo: '2019 – 2022', href: sites.novotec },
  { titulo: 'Coordenador do programa Minha Chance', local: 'Fatec Ipiranga', periodo: '2020' },
]

// tipo: maratona | hackathon | concurso | evento
export const eventosOrganizados = [
  {
    ano: 2020,
    eventos: [
      { nome: 'Primeira Maratona Ânima de Programação', tipo: 'maratona' },
      { nome: 'Primeira Maratona de Programação USJT/Una', tipo: 'maratona' },
      { nome: 'Primeiro Hackathon de Introdução ao Desenvolvimento de Sistemas', tipo: 'hackathon' },
      { nome: 'Segundo Hackathon de Introdução ao Desenvolvimento de Sistemas', tipo: 'hackathon' },
    ],
  },
  {
    ano: 2019,
    eventos: [
      { nome: 'Maratona de Programação Interfatecs', tipo: 'maratona', href: sites.interfatecs },
      { nome: 'Maratona de Programação USJT', tipo: 'maratona' },
      { nome: 'Encontro com o Futuro USJT — Mini Hackathon', tipo: 'hackathon' },
      { nome: 'Primeiro Hackathon Novotec Fatec Ipiranga', tipo: 'hackathon' },
      { nome: 'Primeiro Hackathon da Sexta Regional', tipo: 'hackathon' },
      { nome: 'II Concurso de Aplicações para Dispositivos Móveis', tipo: 'concurso' },
      { nome: 'Meu Primeiro Jogo em Python', tipo: 'evento' },
    ],
  },
  {
    ano: 2017,
    eventos: [
      { nome: 'XV Maratona de Programação Fatec Carapicuíba', tipo: 'maratona' },
      { nome: 'Primeiro Hackathon São Judas', tipo: 'hackathon' },
      { nome: 'I Hackathon Fatec Carapicuíba', tipo: 'hackathon' },
      { nome: 'III Simpósio de Gestão e Tecnologia Fatec Carapicuíba', tipo: 'evento' },
    ],
  },
  {
    ano: 2016,
    eventos: [
      { nome: 'Maratona de Programação Interfatecs', tipo: 'maratona', href: sites.interfatecs },
      { nome: 'Terceira Maratona Unifieo de Programação', tipo: 'maratona' },
      { nome: 'XIV Maratona de Programação Fatec Carapicuíba', tipo: 'maratona' },
      { nome: 'Primeiro Hackathon Fatec Ipiranga', tipo: 'hackathon' },
    ],
  },
  {
    ano: 2015,
    eventos: [{ nome: 'Segunda Maratona Unifieo de Programação', tipo: 'maratona' }],
  },
]

export const tecnicoDeEquipes = [
  { nome: 'Maratona de Programação Brasileira (SBC)', ano: 2014, href: sites.maratonaSbc },
  { nome: 'Maratona de Programação Interfatecs', ano: 2014, href: sites.interfatecs },
]

// tema: rótulo curto mostrado no chip
export const orientacoesDestaque = [
  { titulo: 'Identificação digital descentralizada com blockchain', ano: 2025, local: 'Mauá', tema: 'Blockchain' },
  { titulo: 'STUFF — inovação na gestão de ativos', ano: 2025, local: 'Mauá', tema: 'Publicado no CONIC' },
  { titulo: 'Acompanhamento nutricional com inteligência artificial', ano: 2024, local: 'Mauá', tema: 'IA' },
  { titulo: 'AnimaLink — aplicativo móvel para o mercado pet', ano: 2024, local: 'Mauá', tema: 'Mobile' },
  { titulo: 'Aplicação para estudos guiados por inteligência artificial', ano: 2023, local: 'Mauá', tema: 'IA' },
  { titulo: 'Sistema de recomendação de filmes baseado no teste MBTI', ano: 2023, local: 'São Judas', tema: 'Recomendação' },
  { titulo: 'Acessibilidade Dev', ano: 2023, local: 'Fatec Ipiranga', tema: 'Acessibilidade' },
  { titulo: 'Plataforma web para telemedicina', ano: 2022, local: 'Fatec Ipiranga', tema: 'Saúde' },
]

export const resumoOrientacoes = '38 TCCs, 6 iniciações científicas e 1 monitoria concluídos, na Mauá, na São Judas, na Fatec Ipiranga e na UNIFIEO.'

// icone: telegram | python | codigo | grupo | terminal
export const extensao = [
  { titulo: 'Avante: chatbot com a API do Telegram', icone: 'telegram', href: sites.telegramBots },
  { titulo: 'Treinamento para maratonas de programação em Python 3', icone: 'python' },
  { titulo: '#Include', icone: 'codigo' },
  { titulo: 'Programa de pré-programação', icone: 'terminal' },
  { titulo: 'Avante TI — USJT', icone: 'grupo' },
]

export const cursosMinistrados = [
  { titulo: 'Python, Java e ChatGPT', ano: '2023' },
  { titulo: 'Tópicos para Engenharia', ano: '2014' },
  { titulo: 'Programação para dispositivos móveis com Android', ano: '2013–2015', detalhe: '5 turmas de extensão' },
]

export const softwares = [
  { nome: 'Avante', descricao: 'Chatbot com a API do Telegram', ano: '2021', icone: 'telegram' },
  { nome: 'Quero essa', ano: '2015' },
  { nome: 'Caminho na palma da mão', descricao: 'App de orientação para usuários de transporte público', ano: '2013–2014' },
  { nome: 'Controle de Horas', ano: '2013' },
  { nome: 'ChannelRating', descricao: 'Com T. S. Alencar', ano: '2011' },
]

export const publicacoes = [
  {
    titulo: 'Processamento paralelo e a nova API Fork/Join',
    onde: 'Revista MundoJ, p. 6–15',
    ano: 2012,
  },
  {
    titulo: 'STUFF — Inovação na Gestão de Ativos',
    onde: '25º CONIC-SEMESP, com alunos',
    ano: 2025,
    href: sites.conic,
  },
  {
    titulo: 'EventHub: Onde Eventos Ganham Vida',
    onde: '25º CONIC-SEMESP, com alunos',
    ano: 2025,
    href: sites.conic,
  },
  {
    titulo: 'Estudo e Aplicação: Aprimorando o Cadastramento e a Geração de Relatórios',
    onde: '23º CONIC-SEMESP, com alunos',
    ano: 2023,
    href: sites.conic,
  },
  {
    titulo: '4 artigos completos com alunos',
    onde: 'UrbanFix Web (SIMGETEC), Teacher’s Job (CONCISTEC), SII e Vem Vê (CONIC)',
    ano: '2016–2018',
  },
]

export const mercado = [
  { empresa: 'LiberTI', cargo: 'Analista desenvolvedor', periodo: '2012' },
  { empresa: 'M2G — Message To Garcia', cargo: 'Analista de desenvolvimento', periodo: '2009–2010' },
]

export const reconhecimentos = [
  {
    titulo: '4º lugar no Hackathon Ford',
    texto: 'Maratona de 24 horas criando aplicativos para automóveis, que virou entrevista na mídia.',
    ano: 2015,
    logo: logoFord,
  },
  { titulo: 'Paraninfo da turma de Engenharia de Computação', texto: 'Centro Universitário UNIFIEO', ano: 2014, logo: logoUnifieo },
  { titulo: '10º lugar no concurso Samsung Smart TV Apps', texto: 'Samsung', ano: 2011, logo: logoSamsung },
  { titulo: '2º lugar na 1ª Maratona UNIFIEO de Programação', texto: 'UNIFIEO e Borland', ano: 2007, logo: logoUnifieo },
  { titulo: 'Honra ao Mérito', texto: 'Tellus do Brasil — Pinnacle USA', ano: 2007 },
  { titulo: 'Honra ao Mérito', texto: 'Segundo Batalhão de Polícia do Exército', ano: 2005 },
]
