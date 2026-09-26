// Trilhas: sequências de codelabs recomendadas, na ordem em que devem ser feitos.
// `icone` é a chave de uma categoria (src/codelabs/categorias.js), usada para o logo da trilha.
// Abrem em /codelabs/trilha/<id>.
export const trilhas = [
  {
    id: 'java-do-zero',
    titulo: 'Java do zero',
    descricao: 'Da instalação do VS Code à orientação a objetos: lógica, seleção, repetição, strings, coleções, herança e polimorfismo.',
    icone: 'Java',
    codelabs: [
      'java-vs-code-instalacao', 'java-logica-introducao-hello-world', 'java-variaveis-entrada-saida',
      'java-estruturas-de-selecao', 'java-strings', 'java-estruturas-de-repeticao', 'java-exercicios-logica-basica',
      'java-vetores-colecoes', 'java-poo-introducao', 'java-poo-jogo-personagem', 'java-poo-heranca',
      'java-poo-sobrecarga-de-metodos', 'java-poo-polimorfismo',
    ],
  },
  {
    id: 'java-banco-e-interfaces',
    titulo: 'Java com banco de dados e interfaces gráficas',
    descricao: 'JDBC e MySQL, telas em Swing com NetBeans, Maven e consumo de APIs REST.',
    icone: 'Java',
    codelabs: [
      'java-poo-banco-de-dados', 'java-jdbc-vs-code', 'java-gui-01-swing-netbeans', 'java-gui-02-login-mysql',
      'java-gui-03-crud-cursos', 'java-gui-04-jtable-alunos-curso', 'java-maven-netbeans-imagens',
      'java-http-api-rest-oracle-cloud',
    ],
  },
  {
    id: 'analise-de-algoritmos',
    titulo: 'Análise de algoritmos',
    descricao: 'Notação assintótica, ordenação, estruturas de dados, algoritmos gulosos, grafos e tabelas hash.',
    icone: 'Algoritmos',
    codelabs: [
      'alg-notacao-assintotica', 'alg-insertion-sort', 'alg-merge-sort', 'alg-estruturas-de-dados-basicas',
      'alg-algoritmos-gulosos', 'alg-teoria-dos-grafos', 'alg-busca-em-grafos', 'alg-tabela-hash',
      'alg-exercicios-grafos-ponderados-e-heaps',
    ],
  },
  {
    id: 'web-do-zero',
    titulo: 'Desenvolvimento web do zero',
    descricao: 'HTML, CSS, Bootstrap e JavaScript no navegador, depois Node.js, MySQL e MongoDB no back end.',
    icone: 'HTML e CSS',
    codelabs: [
      'web-historia-da-web-e-html', 'web-html-elementos-basicos', 'web-html-formularios-tabelas-aria-microdados',
      'web-vlibras', 'web-css-introducao', 'web-css-mais-recursos', 'web-bootstrap-grid-system', 'web-javascript',
      'node-introducao-instalacao', 'node-mysql', 'web-html-js-nodejs-mongodb',
    ],
  },
  {
    id: 'react',
    titulo: 'React',
    descricao: 'Componentes, props, hooks, ciclo de vida, formulários, Redux e um CRUD full stack.',
    icone: 'React',
    codelabs: [
      'react-introducao', 'react-props', 'react-componentes-funcionais-usestate', 'react-useeffect',
      'react-componentes-com-classes', 'react-ciclo-de-vida', 'react-forms-eventos-listas', 'react-hooks',
      'react-redux-fundamentos', 'react-react-redux', 'react-contador-vite-github-pages', 'react-crud-nodejs-mysql',
    ],
  },
  {
    id: 'react-native',
    titulo: 'Aplicativos com React Native',
    descricao: 'Do Hello World ao uso de câmera, arquivos, mapas e Firebase, com hooks e consumo de APIs.',
    icone: 'React Native',
    codelabs: [
      'hibridos-historico', 'rn-introducao-hello-world', 'rn-lembretes', 'hibridos-react-native-hooks',
      'rn-custom-hooks', 'rn-custom-hooks-openweather', 'rn-jogo-adivinhacao-parte-1', 'rn-jogo-adivinhacao-parte-2',
      'rn-consumo-web-services', 'rn-recursos-nativos-parte-1', 'rn-recursos-nativos-parte-2',
      'rn-recursos-nativos-parte-3', 'rn-recursos-nativos-parte-4', 'rn-firebase', 'hibridos-lista-compras-correcao-ia',
    ],
  },
  {
    id: 'flutter',
    titulo: 'Dart e Flutter',
    descricao: 'A linguagem Dart, apps em Flutter com APIs, responsividade e Bloc, e um back end em Dart.',
    icone: 'Flutter',
    codelabs: [
      'dart-introducao-parte-1', 'dart-introducao-parte-2', 'dart-introducao-parte-3', 'flutter-app-fotos',
      'flutter-responsividade', 'flutter-gerenciamento-de-estado', 'flutter-exercicios-previsao-do-tempo',
      'flutter-exercicios-lembretes-favoritos', 'dart-backend-api-rest',
    ],
  },
  {
    id: 'bancos-de-dados',
    titulo: 'Bancos de dados: da modelagem ao PL/pgSQL',
    descricao: 'Modelagem ER, modelo relacional, projeto lógico e programação no PostgreSQL até triggers, cursores e transações.',
    icone: 'PostgreSQL',
    codelabs: [
      'pg-modelagem-er-cardinalidade', 'pg-modelagem-er-ternario-atributos', 'pg-modelagem-er-generalizacao-associativa',
      'pg-modelo-relacional', 'pg-projeto-logico', 'pg-plpgsql-introducao-pgadmin', 'pg-plpgsql-login-python',
      'pg-plpgsql-blocos-sequencial', 'pg-plpgsql-selecao', 'pg-plpgsql-repeticao-excecoes',
      'pg-plpgsql-stored-procedures', 'pg-plpgsql-functions', 'pg-projeto-plpgsql-csv', 'pg-plpgsql-triggers',
      'pg-relatorios-referencia-cruzada', 'pg-cursores', 'pg-transacoes',
    ],
  },
  {
    id: 'data-warehouse',
    titulo: 'Data Warehouse',
    descricao: 'Python para análise de dados, conceitos de DW, star schema no PostgreSQL e o projeto do semestre.',
    icone: 'Bancos de Dados',
    codelabs: ['python-introducao', 'dw-introducao', 'dw-postgresql-star-schema', 'dw-projeto-semestre'],
  },
  {
    id: 'aws',
    titulo: 'AWS: da nuvem ao serverless',
    descricao: 'Uma arquitetura escalável com EC2, bancos, S3 e Auto Scaling, e depois APIs serverless com Lambda e API Gateway.',
    icone: 'AWS',
    codelabs: [
      'aws-agrosensor', 'serverless-01-api-gateway', 'serverless-02-lambda-api-gateway',
      'serverless-03-mapping-templates-validacao', 'serverless-04-dynamodb', 'serverless-05-endpoints-lambda-unica',
      'serverless-06-front-end-s3-cloudfront',
    ],
  },
  {
    id: 'devops',
    titulo: 'DevOps e CI/CD',
    descricao: 'A cultura DevOps, Git e pipelines no GitLab, do primeiro job à implantação de uma aplicação completa.',
    icone: 'DevOps',
    codelabs: [
      'devops-introducao', 'devops-origem-do-nome', 'git-python-introducao', 'devops-gitlab-pipeline-bolo',
      'devops-gitlab-spring-crud-livros', 'duelo-cartas-gitlab',
    ],
  },
  {
    id: 'microsservicos',
    titulo: 'Microsserviços',
    descricao: 'HTTP, arquitetura orientada a eventos, Docker e orquestração com Kubernetes.',
    icone: 'Microsserviços',
    codelabs: [
      'mss-http', 'mss-microsservicos-parte-1', 'mss-microsservicos-parte-2', 'mss-microsservicos-parte-3',
      'mss-lembretes-docker-kubernetes-skaffold',
    ],
  },
  {
    id: 'graphql',
    titulo: 'GraphQL',
    descricao: 'Da primeira API a relações, mutations e subscriptions.',
    icone: 'GraphQL',
    codelabs: [
      'graphql-introducao', 'graphql-argumentos-colecoes-relacoes', 'graphql-relacoes', 'graphql-mutations',
      'graphql-remocao-refatoracao', 'graphql-atualizacao', 'graphql-subscriptions',
    ],
  },
  {
    id: 'django',
    titulo: 'Django',
    descricao: 'Projeto e templates, uma API REST com Django Rest Framework e autenticação com JWT.',
    icone: 'Django',
    codelabs: ['django-introducao-templates-static', 'django-rest-api-filmes', 'django-autenticacao-autorizacao'],
  },
  {
    id: 'ia-chatgpt',
    titulo: 'IA com a API do ChatGPT',
    descricao: 'Da chave de API a aplicações em Node.js, Python e Java.',
    icone: 'IA',
    codelabs: [
      'chatgpt-conta-chave-api', 'chatgpt-backend-nodejs', 'chatgpt-python-analise-sentimentos',
      'chatgpt-python-tkinter-perguntas', 'chatgpt-java-perguntas',
    ],
  },
]

export const buscarTrilha = (id) => trilhas.find((t) => t.id === id)
