summary: Construa o Duelo de Cartas, uma aplicação web responsiva com HTML, CSS, JavaScript e Bootstrap, API Node.js com autenticação JWT e persistência no DynamoDB, publicada no Amazon S3 e no Elastic Beanstalk por um pipeline GitLab CI/CD com lint, testes unitários e de integração.
id: duelo-cartas-gitlab
categories: AWS,GitLab
tags: aws,gitlab,ci/cd,s3,elastic beanstalk,dynamodb,secrets manager,node.js,express,jwt,docker,bootstrap
status: Published
authors: Rodrigo Bossini
last updated: 2026-09-26
pdf: tti107_ads2001/01_apostila_solucao_full_stack_na_aws_com_gitlab.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Duelo de Cartas: aplicação web e CI/CD com GitLab na AWS

## Visão geral
Duration: 4:00

Neste codelab você desenvolve o **Duelo de Cartas**, uma aplicação web responsiva com HTML, CSS e JavaScript, uma API Node.js com autenticação, persistência no DynamoDB e implantação automatizada no Amazon S3 e no AWS Elastic Beanstalk com **GitLab CI/CD**, tudo no AWS Academy Learner Lab.

![Entrada e painel da aplicação](img/fig-05.webp)

*Entrada e painel da aplicação: os controles visuais serão ligados à API ao longo da implementação.*

O projeto é construído em versões numeradas, de **C01** a **C13**. Cada versão termina com uma verificação e um commit, e o pipeline do GitLab cresce junto com a aplicação.

### O que você vai aprender

* Modelos de serviço (IaaS, PaaS, SaaS), regiões e zonas de disponibilidade
* Git, GitLab, pipelines, jobs e runners
* HTML, CSS e Bootstrap para montar telas responsivas
* HTTP, códigos de status e CORS
* Uma API com Node.js e Express, configurada por variáveis de ambiente
* Docker e DynamoDB Local para desenvolver sem a nuvem
* Modelagem no DynamoDB com chave simples e chave composta, leituras consistentes e transações
* Autenticação com bcrypt e JWT, com o segredo guardado no AWS Secrets Manager
* Lint, testes unitários e testes de integração dentro do pipeline
* Implantação da API no Elastic Beanstalk e do front no Amazon S3 pelo GitLab CI/CD

### O que você vai precisar

* Acesso ao **AWS Academy Learner Lab**
* Uma conta no **GitLab.com** com runners disponíveis
* Git, Node.js 22 ou superior, um editor de código e Docker (Desktop ou Engine com Compose)
* Um terminal Bash ou compatível (no Windows, use o WSL2)

<aside class="positive">

**Como ler os blocos de código.** Muitos blocos mostram primeiro algumas linhas que já existem no arquivo e, logo abaixo, o que deve ser acrescentado. As primeiras linhas servem só para você localizar o ponto de inserção. Quando o texto disser "substitua", troque o trecho inteiro.

</aside>

## Computação em nuvem e AWS
Duration: 10:00

### Recursos de TI sob demanda

Computação em nuvem é o acesso a recursos de TI por uma rede, com provisionamento sob demanda e capacidade ajustável. Em vez de comprar um servidor para cada necessidade, uma aplicação pode contratar processamento, armazenamento e bancos de dados como serviços. Esses recursos continuam executando em equipamentos físicos, nos centros de dados do provedor; a diferença está na forma de disponibilizá-los, administrá-los e pagar por seu uso.

A **Amazon Web Services (AWS)** reúne esses serviços em uma plataforma. O Console AWS é a interface web de administração. A mesma infraestrutura também pode ser configurada por chamadas de API, bibliotecas de programação e ferramentas de linha de comando. Uma conta AWS delimita a propriedade dos recursos, as permissões e a cobrança. No Learner Lab, a conta e as condições de acesso são fornecidas pelo ambiente educacional.

**Elasticidade** é ajustar capacidade à demanda; **escalabilidade** é conseguir atender ao crescimento de carga. A configuração determina se o ajuste será manual ou automático. Cobrança por consumo não significa custo zero enquanto ninguém abre o site: uma instância ligada, armazenamento e outros recursos podem continuar gerando cobrança.

### IaaS, PaaS e SaaS: quem administra cada parte

Os três modelos descrevem diferentes divisões de responsabilidade. Em **IaaS** (*Infrastructure as a Service*), são contratados recursos de infraestrutura: máquinas virtuais, rede e discos. A equipe instala e administra o sistema e sua aplicação. Em **PaaS** (*Platform as a Service*), uma plataforma prepara o ambiente de execução e oferece mecanismos de implantação; a equipe entrega o código e configura o serviço. Em **SaaS** (*Software as a Service*), o usuário acessa um software pronto, administrado pelo fornecedor.

![Modelos de serviço e divisão de responsabilidades](img/fig-01.webp)

*Quanto maior a abstração, mais camadas operacionais ficam sob a administração do fornecedor.*

| Modelo | Exemplo | Trabalho típico da equipe |
| --- | --- | --- |
| IaaS | Amazon EC2 | Escolher uma VM, configurar rede, instalar o runtime e manter a aplicação e o sistema. |
| PaaS | AWS Elastic Beanstalk | Enviar o pacote da aplicação e configurar variáveis, capacidade e atualizações da plataforma. |
| SaaS | GitLab.com; Google Workspace | Administrar usuários, permissões, dados e configurações do software já disponível. |

O Elastic Beanstalk é um exemplo de experiência de PaaS construída sobre recursos como EC2. Ele automatiza tarefas, mas não elimina decisões sobre rede, versões ou capacidade. Já o DynamoDB é um banco gerenciado: a equipe modela dados e acessos sem instalar seu servidor de banco. Um mesmo projeto pode combinar serviços com diferentes níveis de abstração.

<aside class="positive">

**No mercado.** A escolha depende do controle necessário e do custo de operação. Administrar VMs dá flexibilidade, mas exige manutenção do sistema. Serviços gerenciados reduzem tarefas de infraestrutura; a equipe continua responsável por código, dados, permissões e configuração. Orçamento, observabilidade e desligamento de recursos ociosos acompanham o desenvolvimento.

</aside>

### Regiões e zonas de disponibilidade

Uma **região** é uma área geográfica da infraestrutura AWS. Por exemplo, `us-east-1` identifica o Norte da Virgínia e `sa-east-1`, São Paulo. Cada região contém várias **zonas de disponibilidade**, ou AZs (*Availability Zones*). Uma AZ reúne um ou mais centros de dados com energia, conectividade e outros componentes de infraestrutura redundantes; AZs distintas são fisicamente separadas e conectadas por redes de baixa latência.

![Uma região contém várias zonas de disponibilidade](img/fig-02.webp)

*Região é o recorte geográfico; AZ é um domínio de isolamento de falhas dentro dela. O desenho mostra duas AZs por região apenas para simplificar.*

Uma **subnet** é uma subdivisão da rede virtual e pertence a uma única AZ. Uma instância EC2 é iniciada em uma dessas subnets. Distribuir instâncias por mais de uma AZ pode manter o atendimento diante da falha de uma zona, desde que a aplicação e o encaminhamento de tráfego tenham sido preparados para isso. Recursos em outra região não aparecem automaticamente como cópias dos recursos da primeira. Replicação entre regiões e recuperação de desastres exigem configuração própria.

| Recurso | Escopo relevante neste projeto |
| --- | --- |
| Instância EC2 | Fica em uma AZ; a subnet escolhida determina essa zona. |
| Ambiente Beanstalk | Pertence a uma região; as instâncias usam as subnets configuradas. |
| DynamoDB e Secrets Manager | Tabelas e segredos são criados na região selecionada. |
| Amazon S3 | Cada bucket é criado em uma região; o bucket de uso geral terá um nome único. |
| IAM | Administra identidades e permissões da conta; não é uma instância em uma AZ. |

<aside class="positive">

**Onde conferir a região.** No Console AWS, o seletor de região fica na barra superior. Antes de criar tabelas, segredos ou o ambiente Beanstalk, selecione `us-east-1`. Em ferramentas externas, a região também precisa estar configurada. Se um recurso parece ter desaparecido, confira primeiro a conta e a região selecionadas. O Learner Lab pode limitar as regiões e os serviços disponíveis.

</aside>

<aside class="positive">

**No mercado.** Região envolve latência, disponibilidade de serviços, custo e requisitos dos dados. Usar duas AZs de uma região atende a um objetivo diferente de operar em duas regiões. Uma API em instância única continua sendo um ponto único de falha, mesmo que o banco gerenciado distribua seus dados internamente.

</aside>

## AWS Academy Learner Lab e GitLab CI/CD
Duration: 8:00

### O que é o Learner Lab

O AWS Academy Learner Lab fornece uma conta AWS para experimentar serviços em um ambiente educacional. A sessão tem duração limitada, orçamento e restrições de permissões. O acesso ao Console é temporário; os serviços criados pertencem à conta do laboratório. Iniciar uma sessão e criar um recurso são ações distintas: uma sessão autoriza o acesso, enquanto um bucket, uma tabela ou um ambiente continuam sujeitos ao ciclo de vida e às políticas do laboratório.

Em **Start Lab**, a sessão é iniciada. Depois que o indicador de disponibilidade ficar verde, o botão **AWS** abre o Console. Em **AWS Details**, as credenciais temporárias permitem que ferramentas externas, como os jobs do GitLab, façam chamadas aos serviços. As três partes são `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` e `AWS_SESSION_TOKEN`.

![Learner Lab: sessão, conta AWS e credenciais](img/fig-03.webp)

*A sessão concede acesso temporário; os recursos possuem seu próprio ciclo de vida.*

<aside class="negative">

**Limites do ambiente.** Antes de criar recursos, abra as instruções **Readme / Environment overview** do próprio Learner Lab e confira serviços, região, tipos de instância, orçamento e identidades disponibilizadas. Os exemplos usam `us-east-1`, `LabRole` e `LabInstanceProfile`. As permissões efetivas da conta determinam quais opções do Console estarão disponíveis. Encerrar uma sessão não equivale a excluir todos os recursos.

</aside>

### Git, GitLab, pipeline, job e runner

**Git** é o sistema que registra versões dos arquivos. Um **commit** guarda um estado identificável do projeto; uma **branch** mantém uma linha de desenvolvimento. O **GitLab** hospeda o repositório remoto e reúne revisão de código, acompanhamento de mudanças e automação. `git push` envia os commits locais para esse repositório.

No CI/CD, um **pipeline** reúne tarefas automatizadas. Cada tarefa é um **job**; um **stage** agrupa jobs da mesma fase. O **runner** é o agente que executa essas tarefas. O arquivo `.gitlab-ci.yml`, na raiz do projeto, descreve imagens, comandos, dependências e regras de execução. Neste projeto, runners hospedados do GitLab.com executam os jobs.

![Do commit à aplicação publicada](img/fig-04.webp)

*GitLab organiza a execução; o runner executa os comandos do pipeline.*

| Termo | Significado prático |
| --- | --- |
| CI: integração contínua | Integrar mudanças com frequência e executar verificações automáticas. |
| Continuous delivery | Manter uma versão aprovada pronta para implantação; a liberação pode ser manual. |
| Continuous deployment | Implantar automaticamente as mudanças aprovadas. O push na branch padrão acionará esse comportamento. |

<aside class="positive">

**No mercado.** Equipes costumam trabalhar com branches curtas e merge requests: uma mudança recebe revisão humana e testes antes de entrar na branch principal. Credenciais federadas por OIDC reduzem a necessidade de copiar chaves. No Learner Lab, usaremos as credenciais temporárias já fornecidas pelo ambiente, renovando as três juntas quando expirarem.

</aside>

## Aplicação, arquitetura e ambiente
Duration: 12:00

### Duelo de Cartas

A aplicação compara duas cartas de um baralho de 52 cartas, uma para a pessoa autenticada e outra para a máquina. Ás vale 14; rei, dama e valete valem 13, 12 e 11. Os naipes não desempatam. Cada rodada utiliza duas cartas distintas; o backend registra o resultado e atualiza o placar. O projeto não envolve apostas, pagamentos ou recompensas.

A tela de entrada recebe e-mail e senha. Depois da autenticação, o painel mostra o placar, as cartas e o histórico, como na figura do passo anterior.

O **front-end** é a parte que executa no navegador: desenha as telas, lê os campos e envia pedidos. O **back-end** é o processo no servidor: valida o usuário, aplica as regras do jogo e controla os acessos aos dados. O **banco de dados** mantém usuários, rodadas e contadores entre as requisições. Uma resposta do back-end fornece dados para o front atualizar a tela; o navegador não acessará diretamente o DynamoDB.

![Front-end, back-end e banco têm funções diferentes](img/fig-06.webp)

*Responsabilidades e caminho de uma rodada: ação na tela, regra na API, persistência no banco e resposta ao navegador.*

O front-end usa HTML, CSS, JavaScript e Bootstrap. Seus arquivos ficam armazenados no Amazon S3, mas o JavaScript do front é executado no navegador. A API usa Node.js e Express em uma instância EC2 administrada pelo Elastic Beanstalk. O Nginx recebe as requisições e as encaminha ao processo Node.js. O DynamoDB mantém usuários e rodadas. O Secrets Manager guarda o segredo com que o backend assina e verifica os tokens de autenticação.

![Onde cada parte fica e quem faz as chamadas](img/fig-07.webp)

*As setas indicam os destinos das chamadas. O navegador solicita arquivos ao S3 e chama a API; somente o backend acessa DynamoDB e Secrets Manager.*

### Do navegador aos serviços: dois momentos

**Primeiro, o navegador carrega a interface.** Ao abrir o endereço do site, ele solicita ao S3 o HTML e os arquivos de CSS e JavaScript referenciados pela página. O S3 entrega esses arquivos. O navegador interpreta a estrutura HTML, aplica as regras CSS e executa o JavaScript. É nesse momento que os controles da página ganham comportamento.

**Depois, o JavaScript chama a API.** Ao clicar em **Entrar**, o código do formulário usa `fetch`, a função do navegador que faz requisições pela rede. Na aplicação, o endereço da API ficará em `API_URL`; o código acrescentará o caminho `/api/auth/login` e enviará e-mail e senha no corpo de uma requisição `POST`. `POST` é um método HTTP para enviar dados a um recurso; os métodos e códigos de resposta serão detalhados antes da implementação das rotas.

As setas de uma figura de sequência devem ser lidas de cima para baixo. A figura seguinte mostra um login válido: a API consulta o usuário, verifica a senha e devolve um **token**, isto é, um comprovante digital que o front apresentará nas chamadas protegidas. **JSON** é o formato textual usado para representar os dados dessas mensagens. O **JWT** é o formato de token adotado no projeto; o login inicial ainda não exige esse token.

![Dois momentos: carregar a página e usar a API](img/fig-08.webp)

*Carregamento da interface e envio do login são trocas distintas. As respostas retornam ao navegador; o S3 não encaminha o formulário à API.*

<aside class="positive">

**Quem envia o formulário?** O JavaScript que está rodando no navegador faz a chamada diretamente à API. O S3 apenas entrega os arquivos do front. A página pode continuar mostrando o endereço do site na barra do navegador enquanto `fetch` conversa com o endereço da API em segundo plano. Após o login, o front abre o painel e o navegador solicita ao S3 os arquivos dessa página.

</aside>

Como site e API usam endereços de origens diferentes, o backend precisará permitir que a página leia suas respostas. A política do navegador e a configuração dessa permissão serão explicadas na seção de HTTP, antes das primeiras rotas.

O acesso ao Secrets Manager ocorre no backend. No código deste codelab, quando o segredo não vem da configuração local, a primeira operação que precisa dele o busca nesse serviço e guarda o valor em memória para reutilização. O segredo não é enviado ao navegador. Já o **perfil de instância** fornece as credenciais e permissões AWS usadas pelo backend para acessar os serviços. Essas credenciais autorizam o servidor perante a AWS; o token JWT identifica o usuário perante a API.

### HTTP, origem e ambiente público de laboratório

Uma **URL** identifica um recurso. Sua **origem** é a combinação de protocolo, host e porta. Assim, `http://localhost:8080` e `http://localhost:3000` são origens diferentes. Uma API HTTP recebe uma requisição, interpreta método, endereço, cabeçalhos e corpo, e devolve status, cabeçalhos e dados; neste projeto, os dados são serializados como JSON.

<aside class="negative">

**HTTP no website endpoint do S3.** O endpoint de website do S3 oferece HTTP, sem TLS. O laboratório usará HTTP no front e na API. Isso não protege a senha ou o token durante o transporte: utilize somente dados fictícios e senha exclusiva do projeto. Abrir o front por HTTPS e chamar uma API HTTP pode gerar bloqueio por conteúdo misto. Essa limitação deve ser removida antes de atender usuários reais.

</aside>

<aside class="positive">

**No mercado.** Uma implantação profissional oferece HTTPS de ponta a ponta. Um caminho comum é S3 privado atrás do CloudFront, com controle de acesso à origem, e API atrás de um endpoint HTTPS. Autenticação pode ser delegada a um provedor de identidade. Cookies de sessão exigem avaliar `HttpOnly`, `Secure`, `SameSite` e proteção contra CSRF; escolher cookies não elimina esses requisitos.

</aside>

### Ferramentas e nomes do projeto

O desenvolvimento usa um terminal Bash ou compatível. No Windows, use um ambiente Linux via WSL2; no macOS, Terminal; no Linux, seu terminal usual. Instale Git, Node.js 22 ou superior, um editor e Docker Desktop ou Docker Engine com Compose. Os exemplos de CI e implantação usam a linha 22, sem exigir uma versão 22.x específica; não é necessário instalar a AWS CLI localmente.

Obtenha Node.js em [nodejs.org](https://nodejs.org/en/download), Git em [git-scm.com](https://git-scm.com/downloads) e Docker em [docs.docker.com](https://docs.docker.com/get-started/get-docker/). No macOS, selecione o instalador Apple Silicon quando aplicável. No Linux, siga a instalação do Engine e do plugin Compose correspondente à distribuição. Abra o Docker e aguarde o mecanismo ficar ativo.

**Computador local · conferir ferramentas**

```bash
node --version
npm --version
git --version
docker --version
docker compose version
```

| Recurso | Nome ou convenção |
| --- | --- |
| Repositório | `duelo-cartas` |
| Branch padrão | `main` |
| Aplicação / ambiente Beanstalk | `duelo-cartas-api` / `duelo-cartas-api-dev` |
| Tabelas | `duelo-usuarios` / `duelo-rodadas` |
| Segredo | `duelo-cartas/jwt` |
| Região | `us-east-1` |
| Buckets | Um nome globalmente único para o front e outro para os pacotes |

## C01: repositório e primeira página
Duration: 10:00

### Criar o repositório no GitLab

No grupo do GitLab.com, selecione **New project > Create blank project**. Use `duelo-cartas`; escolha a visibilidade apropriada e deixe desmarcada a inicialização com README. Copie a URL HTTPS. Substitua `SEU_GRUPO` pela identificação real do grupo nos comandos.

**Computador local · criar o projeto**

```bash
mkdir duelo-cartas
cd duelo-cartas
git init -b main
git config user.name "Seu Nome"
git config user.email "seu-email-de-commit@example.com"
git remote add origin https://gitlab.com/SEU_GRUPO/duelo-cartas.git
mkdir -p frontend/css frontend/js backend
```

Para autenticar por HTTPS, use um token com permissão de escrita no repositório quando solicitado. No GitLab, ele pode ser criado em **Edit profile > Access > Personal access tokens**; configure expiração e escopo `write_repository`. Informe seu usuário e use o token no campo de senha do Git. Não inclua o token na URL remota ou nos arquivos.

**Computador local · raiz de duelo-cartas**

```bash
touch .gitignore
```

As regras abaixo impedem que dependências instaladas, credenciais locais e resultados de empacotamento entrem no Git.

**.gitignore**

```text
# Dependências instaladas e arquivos sensíveis ficam fora do versionamento.
node_modules/
.env
.npm/
.dynamodb/
backend.zip
public/
coverage/
.DS_Store
```

### Criar e visualizar o primeiro HTML

HTML descreve a estrutura do documento. `head` contém metadados; `body` contém o conteúdo visível. `lang` identifica o idioma e `charset` permite representar a acentuação em UTF-8.

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p frontend
touch frontend/index.html
```

**frontend/index.html**

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <!-- Faz o layout acompanhar a largura da tela. -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Duelo de Cartas</title>
</head>
<body>
  <main>
    <h1>Duelo de Cartas</h1>
    <p>Aplicação web com histórico de rodadas.</p>
  </main>
</body>
</html>
```

Um servidor HTTP local também será necessário quando usarmos módulos JavaScript. O comando abaixo baixa e executa a versão indicada do utilitário `http-server`. Ele serve somente a pasta `frontend`, na porta 8080, com cache desativado. Mantenha esse terminal aberto; os próximos comandos usam outro terminal na raiz do projeto.

**Computador local · raiz de duelo-cartas**

```bash
npx --yes http-server@14.1.1 frontend -a 127.0.0.1 -p 8080 -c-1
```

Abra `http://localhost:8080`. A página deve exibir o título e o parágrafo. **Ctrl+C** encerra o servidor. Para iniciá-lo novamente, repita o mesmo comando na raiz do projeto.

**Computador local · terminal na raiz · versão C01**

```bash
git status
git add .gitignore frontend/index.html
git commit -m "front: cria primeira pagina"
git push -u origin main
```

<aside class="positive">

**No mercado.** O arquivo de ignore é criado no início. Uma credencial já enviada ao repositório não se torna segura ao ser adicionada ao ignore: é necessário revogá-la e tratar o histórico. Commits pequenos permitem relacionar uma alteração a um comportamento observável.

</aside>

## C02: Amazon S3 e primeiro pipeline
Duration: 20:00

### Criar o destino público do front

O S3 é armazenamento de objetos: um **bucket** contém objetos, cada um identificado por uma **chave**, como `css/styles.css`. Ele entrega os arquivos do site ao navegador; não executa Node.js, login ou consultas ao banco. O *website hosting* fornece a página inicial e caminhos de navegação.

1. Inicie o Learner Lab, abra o Console AWS e selecione **N. Virginia / us-east-1**.
2. Em **S3 > Create bucket**, escolha um bucket de uso geral e um nome único, por exemplo `duelo-front-grupo99-projeto01`.
3. Mantenha **ACLs disabled**. Para este bucket de site público, desmarque **Block all public access** e confirme o aviso.
4. Crie o bucket e abra **Properties > Static website hosting > Edit**.
5. Ative **Host a static website**, defina `index.html` como **Index document** e deixe o documento de erro sem configuração. Salve.
6. Copie o **Bucket website endpoint**. Use o endereço exibido, iniciado por `http://`, sem barra final; não construa a URL manualmente.

No Console AWS, dentro do bucket do front no S3, abra **Permissions > Bucket policy > Edit** e aplique a política abaixo, substituindo `NOME-DO-BUCKET`. JSON estrito não aceita comentários; por isso os campos são explicados imediatamente após o bloco.

**Console S3 · política do bucket do front**

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::NOME-DO-BUCKET/*"
  }]
}
```

`Version` identifica a linguagem da política. `Principal: "*"` inclui visitantes anônimos; `s3:GetObject` autoriza apenas leitura de objetos. O ARN identifica o recurso e o sufixo `/*` inclui as chaves dentro daquele bucket. Nenhuma permissão de upload público é concedida.

<aside class="positive">

**ARN do bucket e avisos de validação.** Em **S3 > bucket do front > Permissions > Bucket policy > Edit**, copie o **Bucket ARN** mostrado acima do editor e acrescente `/*` para formar `Resource`. Não deixe literalmente `NOME-DO-BUCKET`. Um aviso de falta de `access-analyzer:ValidatePolicy` diz respeito ao validador do editor; sozinho, não comprova falta de `s3:PutBucketPolicy`. Corrija o recurso e tente salvar. Se a gravação falhar, expanda **API response** no erro para identificar a causa concreta.

</aside>

<aside class="negative">

**Bloqueio público da conta.** O S3 combina políticas e bloqueios do bucket com os da conta. Se a política pública for recusada apesar da configuração correta do bucket, confira as restrições do laboratório. Não desabilite controles da conta inteira. O segundo bucket, destinado aos pacotes da API, permanecerá privado.

</aside>

### Habilitar runners e configurar variáveis

No projeto `duelo-cartas`, no GitLab.com, abra **Settings > CI/CD > Runners** e confirme a disponibilidade dos runners hospedados da instância para o projeto. Minutos de computação, verificação da conta ou políticas do grupo podem afetar a disponibilidade. Os jobs Linux abaixo não precisam de tags específicas. No mesmo projeto do GitLab, em **Settings > Repository > Branch rules / Protected branches**, proteja `main` e permita o push ao papel que administra o projeto.

No projeto `duelo-cartas`, no GitLab.com, abra **Settings > CI/CD > Variables** e cadastre as variáveis abaixo como tipo **Variable**, escopo `*`. Marque **Protected**; nas três credenciais, marque também **Masked** e desabilite a expansão de referências. Copie os três valores completos de **AWS Details**, na página do Learner Lab. Volte à aba do GitLab para cadastrá-los.

| Variável | Valor |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | Access key temporária do Learner Lab |
| `AWS_SECRET_ACCESS_KEY` | Secret key temporária do Learner Lab |
| `AWS_SESSION_TOKEN` | Token completo da mesma sessão |
| `AWS_DEFAULT_REGION` | `us-east-1` |
| `FRONTEND_BUCKET` | Somente o nome do bucket público |
| `FRONTEND_URL` | Website endpoint HTTP, sem barra final |

### Criar o pipeline imediatamente após o primeiro commit

YAML usa indentação para representar a hierarquia; use espaços, não tabulações. Uma lista começa com hífen. `image` escolhe o ambiente de execução do job: uma **imagem** reúne arquivos e programas; um **contêiner** é sua execução isolada. O runner iniciará esses ambientes automaticamente. A implementação local com Docker será detalhada antes do banco de desenvolvimento.

**Computador local · raiz de duelo-cartas**

```bash
touch .gitlab-ci.yml
```

Comece pela fase de validação. Alpine é uma imagem Linux pequena que já oferece os comandos simples utilizados aqui.

**.gitlab-ci.yml · parte 1 de 2**

```yaml
stages:
  - validate
  - deploy

front_smoke:
  stage: validate
  image: alpine:3.22
  script:
    - test -s frontend/index.html # Exige arquivo existente e não vazio.
    - grep -q 'Duelo de Cartas' frontend/index.html
```

O job de implantação usa uma imagem com a AWS CLI. `entrypoint` vazio substitui o ponto de entrada da imagem para o runner executar seu script. Acrescente-o logo depois de `front_smoke`.

**.gitlab-ci.yml · parte 2 de 2**

```yaml
    - grep -q 'Duelo de Cartas' frontend/index.html

deploy_frontend:
  stage: deploy
  image:
    name: public.ecr.aws/aws-cli/aws-cli:2.31.4
    entrypoint: [''] # Permite ao runner iniciar seu próprio shell.
  script:
    - aws sts get-caller-identity # Confirma qual conta recebeu as credenciais.
    - aws s3 sync frontend "s3://${FRONTEND_BUCKET}" --delete
  environment:
    name: production/frontend
    url: $FRONTEND_URL
  resource_group: learner-lab-deploy
  interruptible: false
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'
```

`sync --delete` faz o bucket refletir a pasta de origem: objetos extras no destino são excluídos. Esse bucket deve ser exclusivo do front. `resource_group` impede que dois jobs com o mesmo grupo executem simultaneamente no mesmo projeto. Por padrão, um stage só prossegue depois que os anteriores terminam com sucesso.

**Computador local · terminal na raiz · versão C02**

```bash
git add .gitlab-ci.yml
git commit -m "ci: valida e publica front no S3"
git push
```

No projeto do GitLab.com, em **Build > Pipelines**, abra os dois jobs. Ambos devem concluir com sucesso; o website endpoint deve exibir a página inicial. `ExpiredToken` exige renovar as três credenciais; um job em **Pending** exige verificar runners e cota de computação.

<aside class="positive">

**No mercado.** *Masked* reduz exposição acidental nos logs, mas um script ainda pode ler uma variável. Alterações em CI/CD recebem revisão cuidadosa antes de executar com credenciais. Em ambientes profissionais, papéis com menor privilégio e variáveis por ambiente limitam o alcance de cada implantação.

</aside>

## C03: página de entrada com HTML e CSS
Duration: 20:00

### Conectar as folhas de estilo à página existente

CSS seleciona elementos do HTML e aplica regras de apresentação. `.login-page`, por exemplo, seleciona um elemento cuja lista de classes contém `login-page`. Uma regra reúne um seletor e declarações entre chaves; cada declaração tem uma propriedade e um valor. O navegador recalcula a apresentação quando a folha é alterada e a página é recarregada.

O **Bootstrap** oferece estilos prontos para formulários, botões e organização da página. Sua folha virá de uma CDN, um serviço de distribuição de arquivos. `integrity` contém o hash SRI que permite conferir o conteúdo recebido; `crossorigin="anonymous"` permite essa verificação sem enviar credenciais à CDN. A folha própria virá depois para permitir ajustes sobre os estilos da biblioteca.

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p frontend/css
touch frontend/css/styles.css
```

No editor local, em `frontend/index.html`, substitua apenas o elemento `head` pelo seguinte. O `body` permanece intacto. A folha própria já existe, embora ainda esteja vazia.

**frontend/index.html**

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Entrar | Duelo de Cartas</title>
  <!-- A CDN entrega uma versão específica do Bootstrap. -->
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossorigin="anonymous">
  <link rel="stylesheet" href="css/styles.css">
</head>
```

Em `frontend/css/styles.css`, defina a paleta compartilhada. As propriedades iniciadas por `--` são variáveis CSS; aqui elas evitam repetir o mesmo valor em vários componentes.

**frontend/css/styles.css**

```css
/* :root corresponde à raiz do documento; as variáveis são herdadas. */
:root {
  --game-primary: #4158d0;
  --game-primary-dark: #2f3fa4;
  --game-ink: #172033;
  --game-bg: #f4f6fb;
}

body {
  color: var(--game-ink); /* var() consulta a variável definida na raiz. */
}
```

No navegador local, recarregue `http://localhost:8080`. O título e o parágrafo continuam visíveis e passam a usar a base visual do Bootstrap. Se a biblioteca não aparecer, confira a conexão com a CDN e a aba **Network** das ferramentas do navegador.

### Construir o cartão de entrada de fora para dentro

Bootstrap divide cada linha em 12 colunas. `col-12` ocupa a linha inteira; `col-md-8` usa oito colunas a partir de 768 px; `col-lg-5` usa cinco a partir de 992 px. A largura menor centraliza o formulário em telas amplas. `d-flex` ativa Flexbox; `align-items-center` centraliza no eixo transversal.

![Bootstrap: a grade tem 12 colunas em cada linha](img/fig-09.webp)

*A grade adapta a quantidade de colunas ocupadas à largura disponível.*

Em `frontend/index.html`, substitua o `body` antigo pela estrutura abaixo. Ela cria os limites externos do cartão. `min-vh-100` ocupa ao menos a altura da janela; `py-4` acrescenta espaço vertical. O cartão está vazio nesta etapa.

**frontend/index.html**

```html
<body class="login-page">
  <main class="container min-vh-100 d-flex align-items-center py-4">
    <div class="row justify-content-center w-100 mx-0">
      <div class="col-12 col-md-8 col-lg-5">
        <section class="card login-card border-0 shadow-lg">
          <div class="card-body p-4 p-sm-5"></div>
        </section>
      </div>
    </div>
  </main>
</body>
```

Acrescente estas regras ao final de `frontend/css/styles.css`. O degradê radial cria uma área de luz no canto superior; o linear preenche o restante do fundo. Recarregue a página: já será possível observar a área central e o fundo.

**frontend/css/styles.css**

```css
body {
  color: var(--game-ink); /* var() consulta a variável definida na raiz. */
}

.login-page {
  /* Duas camadas: a primeira é desenhada sobre a segunda. */
  background:
    radial-gradient(circle at 10% 15%, #4158d047, transparent 34rem), /* Luz circular. */
    linear-gradient(135deg, #f7f8ff, #eef1f8); /* Camada inferior, em diagonal. */
}

.login-card {
  border-radius: 1.5rem; /* Arredonda os cantos em unidades da fonte raiz. */
}
```

Dentro do cartão de `frontend/index.html`, preencha o `div.card-body`. O formulário ainda está vazio. `aria-hidden` retira o símbolo decorativo da leitura assistiva; `role="alert"` identifica mensagens de erro. A classe `d-none` mantém o alerta oculto até que haja uma mensagem.

**frontend/index.html**

```html
<div class="card-body p-4 p-sm-5">
  <div class="brand-mark mb-4" aria-hidden="true">♠</div>
  <p class="eyebrow mb-2">DUELO DE CARTAS</p>
  <h1 id="login-title" class="h2 fw-bold mb-2">Entre para jogar</h1>
  <p class="text-secondary mb-4">Vence a carta de maior valor.</p>
  <div id="login-alert" class="alert alert-danger d-none" role="alert"></div>
  <form id="login-form" novalidate></form>
</div>
```

No final de `frontend/css/styles.css`, estilize o símbolo e o texto acima do título. `rem` usa o tamanho da fonte da raiz; `em`, neste espaçamento, usa o tamanho da fonte do próprio elemento. Recarregue e compare o símbolo antes e depois dessas regras.

**frontend/css/styles.css**

```css
.login-card {
  border-radius: 1.5rem; /* Arredonda os cantos em unidades da fonte raiz. */
}

.brand-mark {
  width: 4rem; /* Reserva a largura do símbolo. */
  height: 4rem; /* Mantém a área externa quadrada. */
  display: grid; /* Cria uma grade para posicionar o conteúdo. */
  place-items: center; /* Centraliza o símbolo nos dois eixos. */
  border-radius: 1.25rem; /* Suaviza os cantos do quadrado. */
  background: var(--game-primary);
  color: white;
  font-size: 2rem;
}

.eyebrow {
  color: var(--game-primary);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em; /* Afasta as letras em relação ao tamanho do texto. */
}
```

### Acrescentar campos e botão dentro do formulário

O **DOM** representa o HTML em objetos acessíveis pelo JavaScript. Um `id` identifica um elemento; `label for` associa o rótulo ao campo de mesmo `id`. Elementos como `div`, `label` e `form` têm abertura e fechamento. `input`, `meta` e `link` são elementos vazios do HTML e não recebem uma tag de fechamento.

Em `frontend/index.html`, acrescente o campo dentro do `form` existente. `type="email"` e `required` definem restrições; `name` será usado para obter o valor. `novalidate` desliga a mensagem automática no envio, mas preserva as restrições que o controlador consultará com `checkValidity()`.

**frontend/index.html**

```html
<form id="login-form" novalidate>
  <div class="mb-3">
    <label for="email" class="form-label fw-semibold">E-mail</label>
    <input id="email" name="email" type="email"
           class="form-control form-control-lg" autocomplete="username" required>
    <div class="invalid-feedback">Informe um e-mail válido.</div>
  </div>
</form>
```

No mesmo formulário, o campo de senha entra abaixo do campo de e-mail. `autocomplete` informa ao navegador a finalidade do dado; `type="password"` mascara sua apresentação, mas não criptografa o transporte.

**frontend/index.html**

```html
<form id="login-form" novalidate>
  <div class="mb-3">
    <label for="email" class="form-label fw-semibold">E-mail</label>
    <input id="email" name="email" type="email"
           class="form-control form-control-lg" autocomplete="username" required>
    <div class="invalid-feedback">Informe um e-mail válido.</div>
  </div>
  <div class="mb-4">
    <label for="password" class="form-label fw-semibold">Senha</label>
    <input id="password" name="password" type="password"
           class="form-control form-control-lg" autocomplete="current-password"
           minlength="8" required>
    <div class="invalid-feedback">Use pelo menos 8 caracteres.</div>
  </div>
</form>
```

Depois do campo de senha e antes de `</form>`, acrescente o botão. Preserve os dois campos; o comentário apenas indica o lugar que eles já ocupam. `disabled` mantém o envio indisponível até a implementação do login.

**frontend/index.html**

```html
<form id="login-form" novalidate>
  <!-- Mantenha aqui os dois campos já existentes. -->
  <button id="login-button" class="btn btn-primary btn-lg w-100"
          type="submit" disabled>
    Entrar
  </button>
</form>
```

No final de `frontend/css/styles.css`, personalize o botão por suas variáveis oficiais. A biblioteca mantém o comportamento de foco e os estados do componente. O botão desabilitado ainda recebe o estilo visual próprio desse estado.

**frontend/css/styles.css**

```css
.eyebrow {
  color: var(--game-primary);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em; /* Afasta as letras em relação ao tamanho do texto. */
}

/* As variáveis --bs-btn-* pertencem ao componente de botão do Bootstrap. */
.btn-primary {
  --bs-btn-bg: var(--game-primary); /* Fundo no estado normal. */
  --bs-btn-border-color: var(--game-primary); /* Borda no estado normal. */
  --bs-btn-hover-bg: var(--game-primary-dark); /* Fundo ao passar o ponteiro. */
  --bs-btn-hover-border-color: var(--game-primary-dark); /* Borda no hover. */
}
```

Abra `http://localhost:8080` no navegador local. O formulário deve mostrar título, e-mail, senha e botão. Reduza a janela: o cartão deve permanecer dentro da tela. No navegador, as ferramentas de desenvolvimento permitem simular uma largura de celular.

**Computador local · terminal na raiz · versão C03**

```bash
git add frontend
git commit -m "front: cria formulario responsivo"
git push
```

## C04: painel, cartas e histórico
Duration: 30:00

### Criar a página do painel e sua moldura

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p frontend
touch frontend/dashboard.html
```

No computador local, crie `frontend/dashboard.html`. A página começa completa e vazia; ela usa as mesmas folhas de estilo já existentes.

**frontend/dashboard.html**

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Jogo | Duelo de Cartas</title>
  <!-- A CDN entrega uma versão específica do Bootstrap. -->
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossorigin="anonymous">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body class="dashboard-page">
</body>
</html>
```

Em `frontend/dashboard.html`, preencha o `body` com a barra de navegação e a região principal. Ambas já têm fechamento; seus conteúdos serão inseridos dentro delas.

**frontend/dashboard.html**

```html
<body class="dashboard-page">
  <nav class="navbar navbar-dark game-navbar shadow-sm">
    <div class="container"></div>
  </nav>
  <main class="container py-4 py-lg-5"></main>
</body>
```

No final de `frontend/css/styles.css`, acrescente o fundo e a barra do painel. Abra `http://localhost:8080/dashboard.html`: a região colorida superior já deve ser visível.

**frontend/css/styles.css**

```css
.dashboard-page {
  background: var(--game-bg);
  min-height: 100vh; /* Garante fundo em pelo menos toda a altura da janela. */
}

.game-navbar {
  /* 90deg faz a transição horizontal entre as duas cores. */
  background: linear-gradient(90deg, var(--game-primary-dark), var(--game-primary));
}
```

Dentro de `nav`, preencha seu `div.container`. `gap-3` separa os elementos; `d-none d-sm-inline` oculta o nome em telas pequenas e o exibe a partir de 576 px. O espaço para o nome ainda está vazio.

**frontend/dashboard.html**

```html
<div class="container">
  <a class="navbar-brand fw-bold" href="dashboard.html">♠ Duelo de Cartas</a>
  <div class="d-flex align-items-center gap-3">
    <span id="player-name" class="text-white d-none d-sm-inline"></span>
    <button id="logout-button" class="btn btn-outline-light btn-sm"
            type="button" disabled>Sair</button>
  </div>
</div>
```

Preencha `main` com o alerta e três seções: placar, jogo e histórico. Os identificadores tornam inequívoco o lugar de cada acréscimo. O alerta começa oculto e as seções começam vazias.

**frontend/dashboard.html**

```html
<main class="container py-4 py-lg-5">
  <div id="dashboard-alert" class="alert alert-danger d-none" role="alert"></div>
  <section id="stats-grid" class="row g-3 mb-4" aria-label="Placar acumulado"></section>
  <section id="game-panel" class="game-panel card border-0 shadow-sm mb-4"></section>
  <section id="history-panel" class="card border-0 shadow-sm"></section>
</main>
```

### Montar os indicadores e aplicar seus estilos

Dentro de `section#stats-grid`, acrescente os dois primeiros indicadores. Cada `col-6` ocupa metade da linha pequena; `col-lg-3` ocupa um quarto na tela grande. Os valores iniciais são zero.

**frontend/dashboard.html**

```html
<section id="stats-grid" class="row g-3 mb-4" aria-label="Placar acumulado">
  <div class="col-6 col-lg-3">
    <div class="stat-card">
      <span class="stat-label">Partidas</span>
      <strong id="games-stat" class="stat-value">0</strong>
    </div>
  </div>
  <div class="col-6 col-lg-3">
    <div class="stat-card stat-win">
      <span class="stat-label">Vitórias</span>
      <strong id="wins-stat" class="stat-value">0</strong>
    </div>
  </div>
</section>
```

No final de `frontend/css/styles.css`, defina o cartão do placar. A faixa lateral diferencia os resultados; o texto também identifica cada indicador, de modo que a informação não depende apenas da cor.

**frontend/css/styles.css**

```css
.game-navbar {
  /* 90deg faz a transição horizontal entre as duas cores. */
  background: linear-gradient(90deg, var(--game-primary-dark), var(--game-primary));
}

.stat-card {
  height: 100%; /* Faz o cartão preencher a altura da coluna da grade. */
  padding: 1.15rem; /* Afasta o conteúdo das quatro bordas. */
  border-radius: 1rem; /* Arredonda os cantos do cartão. */
  background: white;
  border-left: 0.35rem solid var(--game-primary); /* Faixa de identificação. */
  box-shadow: 0 0.35rem 1rem #1720330f; /* x, y, desfoque e cor da sombra. */
}

.stat-win { border-left-color: #198754; }
.stat-draw { border-left-color: #d28b00; }
.stat-loss { border-left-color: #dc3545; }
```

Na mesma seção do placar, preserve as duas colunas anteriores e insira **Empates** e **Derrotas** antes de `</section>`. O conjunto passa a ter duas colunas por linha no celular e quatro na tela grande.

**frontend/dashboard.html**

```html
<section id="stats-grid" class="row g-3 mb-4" aria-label="Placar acumulado">
  <!-- Mantenha aqui as colunas Partidas e Vitórias. -->
  <div class="col-6 col-lg-3">
    <div class="stat-card stat-draw">
      <span class="stat-label">Empates</span>
      <strong id="draws-stat" class="stat-value">0</strong>
    </div>
  </div>
  <div class="col-6 col-lg-3">
    <div class="stat-card stat-loss">
      <span class="stat-label">Derrotas</span>
      <strong id="losses-stat" class="stat-value">0</strong>
    </div>
  </div>
</section>
```

Acrescente os estilos de legenda e valor em `frontend/css/styles.css`. Recarregue o painel local e altere a largura da janela: os quatro cartões devem reorganizar-se, mantendo os números abaixo de suas legendas.

**frontend/css/styles.css**

```css
.stat-win { border-left-color: #198754; }
.stat-draw { border-left-color: #d28b00; }
.stat-loss { border-left-color: #dc3545; }

.stat-label {
  display: block; /* Coloca a legenda em uma linha própria. */
  color: #667085;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase; /* Muda a apresentação, preservando o texto no DOM. */
}

.stat-value {
  display: block; /* Separa o número da legenda. */
  margin-top: 0.25rem; /* Cria espaço externo acima do número. */
  font-size: 2rem;
}
```

### Construir a área de jogo e as cartas

Dentro de `section#game-panel`, acrescente o corpo do cartão. `p-4` define espaçamento interno; `p-lg-5` aumenta esse espaço a partir do breakpoint grande.

**frontend/dashboard.html**

```html
<section id="game-panel" class="game-panel card border-0 shadow-sm mb-4">
  <div class="card-body p-4 p-lg-5"></div>
</section>
```

Preencha o corpo da seção de jogo com o título e uma linha vazia para as cartas. `text-center` centraliza o texto; `justify-content-center` centraliza as colunas da grade.

**frontend/dashboard.html**

```html
<div class="card-body p-4 p-lg-5">
  <div class="text-center mb-4">
    <p class="eyebrow mb-2">CARTA MAIOR</p>
    <h1 id="game-title" class="h2 fw-bold">Você contra a máquina</h1>
    <p class="text-secondary mb-0">Duas cartas diferentes a cada rodada.</p>
  </div>
  <div id="cards-row" class="row justify-content-center align-items-center g-4 mb-4"></div>
</div>
```

No final de `frontend/css/styles.css`, ajuste os cantos da área de jogo. O fundo branco e a sombra vêm das classes do Bootstrap já aplicadas ao HTML.

**frontend/css/styles.css**

```css
.stat-value {
  display: block; /* Separa o número da legenda. */
  margin-top: 0.25rem; /* Cria espaço externo acima do número. */
  font-size: 2rem;
}

.game-panel {
  border-radius: 1.25rem; /* Arredonda o painel que agrupa as cartas. */
}
```

Dentro de `div#cards-row`, acrescente a coluna da primeira carta. `mx-auto` centraliza a carta por suas margens horizontais. `aria-live="polite"` permite anunciar mudanças de valor sem interromper imediatamente uma leitura assistiva.

**frontend/dashboard.html**

```html
<div id="cards-row" class="row justify-content-center align-items-center g-4 mb-4">
  <div class="col-6 col-md-4 text-center">
    <h2 class="h6 text-uppercase text-secondary">Sua carta</h2>
    <div id="player-card" class="playing-card mx-auto" aria-live="polite">
      <span class="card-rank">?</span>
      <span class="card-suit">♠</span>
    </div>
  </div>
</div>
```

Acrescente esta regra em `frontend/css/styles.css`. `24vw` equivale a 24% da largura da janela, mas `clamp` mantém o resultado entre os limites. Recarregue o painel: a primeira carta passa a ter proporção, borda e conteúdo centralizado.

**frontend/css/styles.css**

```css
.game-panel {
  border-radius: 1.25rem; /* Arredonda o painel que agrupa as cartas. */
}

.playing-card {
  width: clamp(7.5rem, 24vw, 10rem); /* Mínimo, largura fluida e máximo. */
  aspect-ratio: 5 / 7; /* Mantém a relação entre largura e altura. */
  display: flex; /* Organiza valor e naipe como itens flexíveis. */
  flex-direction: column; /* Empilha os itens; o eixo principal fica vertical. */
  align-items: center; /* Centraliza horizontalmente no eixo transversal. */
  justify-content: center; /* Centraliza verticalmente no eixo principal. */
  border: 0.2rem solid #d8deeb; /* Define espessura, tipo e cor da borda. */
  border-radius: 1rem; /* Arredonda os cantos da carta. */
  background: white;
  box-shadow: 0 0.7rem 1.5rem #1720331f; /* Cria profundidade abaixo da carta. */
}
```

Na linha das cartas, mantenha a coluna da pessoa e acrescente a coluna da máquina. O desenho é reutilizado pela classe `playing-card`; os `id`s diferentes permitirão atualizar os conteúdos separadamente.

**frontend/dashboard.html**

```html
<div id="cards-row" class="row justify-content-center align-items-center g-4 mb-4">
  <div class="col-6 col-md-4 text-center">
    <h2 class="h6 text-uppercase text-secondary">Sua carta</h2>
    <div id="player-card" class="playing-card mx-auto" aria-live="polite">
      <span class="card-rank">?</span>
      <span class="card-suit">♠</span>
    </div>
  </div>
  <div class="col-6 col-md-4 text-center">
    <h2 class="h6 text-uppercase text-secondary">Máquina</h2>
    <div id="machine-card" class="playing-card mx-auto" aria-live="polite">
      <span class="card-rank">?</span>
      <span class="card-suit">♠</span>
    </div>
  </div>
</div>
```

No final de `frontend/css/styles.css`, dimensione valor e naipe. Um seletor como `.playing-card.is-red` exige as duas classes no mesmo elemento. Mais adiante, o JavaScript acrescentará a classe da cor retornada pela API.

**frontend/css/styles.css**

```css
.playing-card.is-red { color: #c92a2a; }
.playing-card.is-black { color: #172033; }

.card-rank {
  font-size: clamp(2rem, 7vw, 3.25rem); /* Ajusta o valor à tela com limites. */
  font-weight: 800;
  line-height: 1; /* A altura da linha acompanha o tamanho da fonte. */
}

.card-suit {
  font-size: clamp(2.2rem, 8vw, 3.8rem); /* Ajusta o naipe à tela com limites. */
  line-height: 1; /* Evita altura de linha extra ao redor do símbolo. */
}
```

Dentro do corpo do painel de jogo, depois de `div#cards-row`, acrescente a mensagem e o botão. Preserve o cabeçalho e as duas cartas. `d-grid` permite que o botão ocupe a largura da coluna definida para ele.

**frontend/dashboard.html**

```html
<div class="card-body p-4 p-lg-5">
  <!-- Mantenha aqui o cabeçalho e div#cards-row completos. -->
  <p id="round-result" class="result-message text-center mb-4" aria-live="polite">
    Pronto para a primeira rodada?
  </p>
  <div class="d-grid col-12 col-sm-8 col-md-5 mx-auto">
    <button id="play-button" class="btn btn-primary btn-lg"
            type="button" disabled>Jogar uma rodada</button>
  </div>
</div>
```

No final de `frontend/css/styles.css`, reserve uma altura mínima para o resultado. Recarregue: o painel deve exibir as duas cartas, a mensagem e o botão desabilitado.

**frontend/css/styles.css**

```css
.card-suit {
  font-size: clamp(2.2rem, 8vw, 3.8rem); /* Ajusta o naipe à tela com limites. */
  line-height: 1; /* Evita altura de linha extra ao redor do símbolo. */
}

.result-message {
  min-height: 2rem; /* Reserva espaço e reduz saltos ao trocar a mensagem. */
  font-size: 1.15rem;
  font-weight: 700;
}
```

### Montar o histórico e ajustar telas estreitas

Dentro de `section#history-panel`, crie o corpo do cartão. A tabela ficará dentro desse corpo, depois de seu cabeçalho.

**frontend/dashboard.html**

```html
<section id="history-panel" class="card border-0 shadow-sm">
  <div class="card-body p-4"></div>
</section>
```

Preencha o corpo do histórico com título e botão. `justify-content-between` distribui os grupos nas extremidades; `flex-wrap` permite quebrar a linha quando faltar espaço, evitando sobreposição em celulares.

**frontend/dashboard.html**

```html
<div class="card-body p-4">
  <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
    <div>
      <p class="eyebrow mb-1">CRUD</p>
      <h2 id="history-title" class="h4 fw-bold mb-0">Histórico de rodadas</h2>
    </div>
    <button id="reset-button" class="btn btn-outline-danger btn-sm"
            type="button" disabled>Excluir histórico</button>
  </div>
</div>
```

Após o cabeçalho do histórico, ainda dentro do `card-body`, acrescente a tabela. `table-responsive` restringe a rolagem horizontal à região da tabela; `thead` reúne títulos e `tbody` receberá as rodadas.

**frontend/dashboard.html**

```html
<div class="card-body p-4">
  <!-- Mantenha aqui o cabeçalho e o botão Excluir histórico. -->
  <div class="table-responsive">
    <table class="table align-middle mb-0">
      <thead></thead>
      <tbody id="history-body"></tbody>
    </table>
  </div>
</div>
```

Dentro da tabela, preencha `thead`. Cada `th` identifica uma coluna; `scope="col"` explicita essa associação para tecnologias assistivas. O `tbody` permanece vazio até haver dados da API.

**frontend/dashboard.html**

```html
<thead>
  <tr>
    <th scope="col">Data</th>
    <th scope="col">Você</th>
    <th scope="col">Máquina</th>
    <th scope="col">Resultado</th>
  </tr>
</thead>
```

Depois do `div.table-responsive`, acrescente a mensagem de lista vazia. A aplicação ocultará essa mensagem quando receber rodadas. O painel exibirá até vinte registros recentes; os indicadores acumularão todas as rodadas armazenadas.

**frontend/dashboard.html**

```html
<div class="card-body p-4">
  <!-- Mantenha aqui o cabeçalho e a tabela completos. -->
  <p id="empty-history" class="text-secondary text-center py-4 mb-0">
    Nenhuma rodada registrada.
  </p>
</div>
```

Finalize `frontend/css/styles.css` com os ajustes de telas estreitas. `padding-inline` altera o espaço interno nas duas laterais da direção de escrita. O `!important` é necessário aqui porque os utilitários de espaçamento do Bootstrap também usam essa prioridade; o seletor mais específico resolve a disputa.

**frontend/css/styles.css**

```css
.result-message {
  min-height: 2rem; /* Reserva espaço e reduz saltos ao trocar a mensagem. */
  font-size: 1.15rem;
  font-weight: 700;
}

/* A consulta de mídia só ativa estas regras abaixo do breakpoint sm. */
@media (max-width: 575.98px) {
  .stat-card {
    padding: 0.9rem; /* Reduz o espaço interno em telas estreitas. */
  }

  .stat-value { font-size: 1.6rem; }

  .game-panel .card-body {
    padding-inline: 1rem !important; /* Supera o utilitário p-* do Bootstrap. */
  }
}
```

No navegador local, confira `http://localhost:8080/dashboard.html` em larguras de aproximadamente 390 px e 1280 px. A página deve acomodar o placar e as cartas sem rolagem horizontal global. Os botões continuam desabilitados, pois seus controladores ainda serão criados.

**Computador local · terminal na raiz · versão C04**

```bash
git add frontend
git commit -m "front: cria painel e historico"
git push
```

<aside class="positive">

**No mercado.** Componentes visuais são construídos e verificados em estados pequenos: vazio, carregando, sucesso e erro. Layout responsivo envolve largura, leitura, foco e conteúdo variável. A biblioteca visual ajuda na base, mas não substitui testes com teclado e revisão de contraste e de conteúdo em telas pequenas.

</aside>

## C05: HTTP, status e CORS
Duration: 15:00

### HTTP: requisição, endpoint e resposta

HTTP é o protocolo de comunicação usado entre cliente e servidor web. O cliente envia uma **requisição**: método, endereço, cabeçalhos e, quando necessário, um corpo. O servidor devolve uma **resposta**: código de status, cabeçalhos e eventualmente um corpo. Um **endpoint** é um ponto de acesso da API; na prática, o par método e caminho identifica a operação. `GET /api/rounds` consulta rodadas, enquanto `POST /api/rounds` cria uma rodada.

Cabeçalhos transportam metadados. `Content-Type: application/json` informa o formato do corpo. JSON representa objetos, listas, textos, números, valores booleanos e nulo; é um formato de troca de dados, diferente de um objeto JavaScript já carregado em memória. HTTPS acrescenta a proteção TLS à comunicação HTTP.

![A estrutura de uma troca HTTP](img/fig-10.webp)

*O método expressa a intenção; o status informa o resultado observado pelo cliente.*

Os métodos principais têm semânticas diferentes. Uma operação **segura** não solicita alteração do recurso, embora o servidor possa registrar logs. Uma operação **idempotente** produz o mesmo efeito pretendido quando repetida; isso não exige que todas as respostas tenham o mesmo status.

| Método | Uso e exemplo | Repetição |
| --- | --- | --- |
| GET | Obter uma representação. `GET /api/me` consultará o perfil. | Seguro e idempotente. |
| HEAD | Obter cabeçalhos equivalentes aos de GET, sem corpo de resposta. | Seguro e idempotente. |
| POST | Submeter dados ou criar um recurso. `POST /api/rounds` criará uma rodada. | Não é idempotente por definição. |
| PUT | Criar ou substituir o estado do recurso no endereço indicado. | Idempotente pela semântica. |
| PATCH | Aplicar modificações parciais; por exemplo, alterar somente um nome. | Depende da operação de alteração. |
| DELETE | Remover o recurso indicado. `DELETE /api/rounds` excluirá o histórico. | Idempotente pela semântica. |
| OPTIONS | Consultar opções de comunicação de um recurso. | Seguro e idempotente. |

PUT e PATCH aparecem na comparação por serem comuns em APIs; não haverá rotas desses métodos neste projeto. POST não significa sempre cadastro: o login também submete dados com POST. Repetir o POST de uma rodada pode criar outra rodada; a interface e os testes precisam considerar essa diferença.

### Interpretar os códigos de status HTTP

O primeiro dígito indica a família: **1xx**, informação intermediária; **2xx**, sucesso; **3xx**, redirecionamento ou uso de cache; **4xx**, requisição que não pôde ser atendida nas condições apresentadas; **5xx**, falha no lado servidor. O número HTTP é independente do texto JSON da resposta.

| Código | Significado | Exemplo de interpretação |
| --- | --- | --- |
| 200 OK | Requisição atendida. | Perfil obtido ou histórico excluído com um corpo de resultado. |
| 201 Created | Um recurso foi criado. | Nova rodada registrada pela API. |
| 204 No Content | Sucesso sem corpo. | Uma resposta de preflight pode terminar sem JSON. |
| 301 / 302 | Recurso redirecionado. | O cliente recebe outro endereço em `Location`. |
| 304 Not Modified | Pode reutilizar a cópia em cache. | Validação condicional de um arquivo já obtido. |

Nos erros, vale separar problemas de entrada, identidade e infraestrutura. Os exemplos abaixo são gerais; o código de cada endpoint define quais deles serão produzidos na aplicação.

| Código | Significado prático |
| --- | --- |
| 400 Bad Request | Dados ou formato da requisição inválidos, como JSON malformado. |
| 401 Unauthorized | Falta autenticação válida: token ausente, inválido ou expirado. |
| 403 Forbidden | Acesso recusado pelas regras aplicáveis à operação. |
| 404 Not Found | Recurso ou rota não encontrado. |
| 409 Conflict | Conflito com o estado atual, como uma gravação concorrente recusada. |
| 413 Content Too Large | Corpo maior que o limite aceito. |
| 429 Too Many Requests | Limite de requisições atingido. |
| 500 Internal Server Error | Falha interna no processamento da aplicação. |
| 502 Bad Gateway | Um proxy recebeu uma resposta inválida do serviço seguinte. |
| 503 Service Unavailable | Serviço temporariamente indisponível. |

<aside class="positive">

**No mercado.** Uma API profissional combina status apropriado, corpo de erro consistente e identificador de correlação. Senhas, tokens e rastros internos de execução não devem aparecer na resposta pública. Repetições automáticas respeitam a semântica do método e o contrato de idempotência do endpoint.

</aside>

### CORS antes da primeira rota

Uma **origem** combina protocolo, host e porta. O caminho não faz parte dela: `http://localhost:8080/index.html` e `http://localhost:8080/dashboard.html` têm a mesma origem. Já `http://localhost:3000` usa outra porta e, portanto, é outra origem. Trocar `localhost` por `127.0.0.1` também muda o host, mesmo quando os dois endereços chegam ao mesmo computador.

Por segurança, a **política de mesma origem** do navegador restringe a leitura de respostas de outra origem pelo JavaScript. **CORS** (*Cross-Origin Resource Sharing*) é o protocolo de cabeçalhos pelo qual o servidor declara quais origens podem acessar uma resposta nessas condições. O navegador aplica essa regra. Neste projeto, o front local estará em `http://localhost:8080` e a API em `http://localhost:3000`; por isso a API precisará permitir explicitamente a origem do front.

![CORS: a permissão é aplicada pelo navegador](img/fig-11.webp)

*O navegador consulta a permissão quando precisa de preflight e confere os cabeçalhos da resposta efetiva.*

Antes de certas requisições, o navegador envia um **preflight**: uma consulta automática com o método `OPTIONS`. Um POST entre origens com `Content-Type: application/json` exige essa consulta, assim como o uso do cabeçalho `Authorization`; uma permissão de preflight em cache pode evitar repetir a consulta a cada chamada. A API responde com a origem aceita e com os métodos e cabeçalhos autorizados.

| Cabeçalho | Quem envia e o que comunica |
| --- | --- |
| `Origin` | Navegador: origem da página que iniciou a chamada. |
| `Access-Control-Request-Method` | Navegador, no OPTIONS: método da requisição pretendida. |
| `Access-Control-Request-Headers` | Navegador, no OPTIONS: cabeçalhos adicionais pretendidos. |
| `Access-Control-Allow-Origin` | API: origem autorizada a ler a resposta. |
| `Access-Control-Allow-Methods` | API, no preflight: métodos permitidos. |
| `Access-Control-Allow-Headers` | API, no preflight: cabeçalhos aceitos. |

O middleware `cors`, que será instalado a seguir, produzirá esses cabeçalhos e tratará o `OPTIONS` antes das rotas de negócio. `CORS_ORIGINS` será nossa variável de configuração com a lista permitida. Ela não é uma opção especial do Node: o próprio código da aplicação lerá esse nome e o passará ao middleware.

<aside class="negative">

**CORS não substitui autenticação.** Uma chamada feita por `curl` não está sujeita à política de leitura do navegador. Além disso, certas requisições entre origens podem chegar ao servidor mesmo quando o navegador impede ler sua resposta. CORS não torna a API privada nem substitui a validação do usuário. A autenticação por token será aplicada às rotas protegidas. Não tente resolver um erro de CORS desativando a segurança do navegador.

</aside>

## C05: projeto Node.js e primeira API
Duration: 25:00

### Runtime, npm, módulos e dependências

Node.js executa JavaScript fora do navegador. O npm instala bibliotecas e executa scripts descritos em `package.json`. Um módulo ES exporta valores com `export` e importa dependências com `import`. A configuração `type=module` aplica esse formato aos arquivos `.js`. O comando de inicialização do projeto é `npm init -y`; ele cria o manifesto com valores padrão.

Crie o projeto da API dentro de `backend`. Instale primeiro apenas Express, CORS e dotenv. **Express** trata requisições e rotas; **CORS** fornece cabeçalhos de permissão de origem; **dotenv** lê o arquivo local de variáveis de ambiente.

**Computador local · raiz de duelo-cartas**

```bash
cd backend
npm init -y
npm pkg set name=duelo-cartas-api type=module main=server.js
npm pkg set private=true --json
npm pkg set 'engines.node=>=22'
npm pkg set 'scripts.start=node server.js'
npm pkg set 'scripts.dev=node --watch server.js'
npm install --save-exact express@5.2.1 cors@2.8.6 dotenv@17.4.2
mkdir -p src
cd ..
```

`npm install` atualiza o manifesto e gera `package-lock.json`, que registra a árvore de dependências. `--save-exact` remove faixas das dependências diretas. O pipeline usará `npm ci`: ele exige que o lockfile corresponda ao manifesto e instala a árvore registrada. Os arquivos de ambos devem acompanhar o commit; `node_modules` permanece fora dele.

<aside class="positive">

**No mercado.** Fixar versões torna uma execução reproduzível, mas não congela a manutenção. Atualizações de bibliotecas e imagens entram por mudanças revisadas, com testes. O lockfile fixa também dependências transitivas, que não aparecem diretamente no comando de instalação.

</aside>

### Configuração: do ambiente ao objeto config

O mesmo código da API será executado no computador, nos jobs de teste do GitLab e nas instâncias da AWS. A porta, o endereço do banco e a origem autorizada podem mudar entre esses ambientes. `backend/src/config.js` centraliza essa leitura para que o restante da aplicação use propriedades como `config.port`, sem espalhar nomes de variáveis por todas as rotas.

Uma **variável de ambiente** é um par nome/valor entregue ao processo que inicia o programa. O Node disponibiliza esses pares em `process.env`. Um valor existente é lido como texto: uma variável `PORT` configurada com 3000 fornece a string `"3000"`. Uma variável ausente fornece `undefined`. Portanto, o código precisa converter tipos e escolher valores padrão.

![Mesma aplicação, valores fornecidos por cada ambiente](img/fig-12.webp)

*O ambiente fornece valores; config.js transforma e centraliza o que a aplicação consumirá.*

Localmente, `dotenv/config` carrega as linhas de um arquivo `.env` para `process.env`. Por padrão, procura esse arquivo no diretório de trabalho do processo e não substitui variáveis que já existem. Executaremos os comandos da API dentro de `backend`; o arquivo local será criado na etapa do banco. Enquanto ele não existe, os valores padrão permitem iniciar o endpoint de saúde.

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend/src
touch backend/src/config.js
```

Comece pelo carregamento do ambiente e pela função `list`. Ela será usada pela lista de origens de CORS. O operador `??` é a **coalescência nula**: escolhe o operando da direita somente se o da esquerda for `null` ou `undefined`. Valores como `0`, `false` e `""` são preservados, diferentemente do operador `||`.

**backend/src/config.js · leitura e conversão da lista**

```javascript
import 'dotenv/config'; // Carrega o .env local, quando ele existir.

function list(value) {
  return (value ?? '') // Ausência de valor vira uma string vazia.
    .split(',') // Divide o texto em uma lista, usando a vírgula como separador.
    .map((item) => item.trim()) // Remove espaços nas extremidades de cada item.
    .filter(Boolean); // Descarta strings vazias: Boolean('') é false.
}
```

Considere a entrada `" http://localhost:8080, http://127.0.0.1:8080, "`. `split` produz três itens; `map` aplica `trim` em cada item; `filter` mantém somente os que passam no teste booleano. Nenhuma dessas etapas inicia uma requisição: elas apenas transformam texto em uma lista de strings.

| Etapa | Resultado |
| --- | --- |
| `split(',')` | `[" http://localhost:8080", " http://127.0.0.1:8080", " "]` |
| `map(...trim())` | `["http://localhost:8080", "http://127.0.0.1:8080", ""]` |
| `filter(Boolean)` | `["http://localhost:8080", "http://127.0.0.1:8080"]` |

Se a variável não existir, `list(undefined)` passa por `""`, depois por `[""]` e finalmente retorna `[]`. Uma lista vazia não autoriza a origem de uma página web. O endpoint de saúde ainda poderá ser chamado por um cliente sem cabeçalho `Origin`, como o `curl` usado nos testes locais.

Após o fechamento de `list`, acrescente a porta. `Number` converte o texto em número; o teste impede iniciar com uma porta vazia, fracionária, fora da faixa ou impossível de converter. `throw` interrompe a inicialização com uma mensagem de configuração.

**backend/src/config.js · após list**

```javascript
}

const port = Number(process.env.PORT ?? 3000); // Converte a string em número.
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT deve ser um inteiro entre 1 e 65535.');
}
```

Abaixo da validação da porta, acrescente o objeto exportado. A forma curta `port` equivale a `port: port`. `export` permite importar o objeto em outros módulos. `Object.freeze` impede substituir suas propriedades; o congelamento é superficial e não torna valores secretos nem congela automaticamente o array interno.

**backend/src/config.js · configuração exportada**

```javascript
}

export const config = Object.freeze({
  port,
  region: process.env.AWS_REGION ?? 'us-east-1',
  dynamodbEndpoint: process.env.DYNAMODB_ENDPOINT,
  usersTable: process.env.USERS_TABLE ?? 'duelo-usuarios',
  roundsTable: process.env.ROUNDS_TABLE ?? 'duelo-rodadas',
  jwtSecret: process.env.JWT_SECRET,
  jwtSecretId: process.env.JWT_SECRET_ID,
  corsOrigins: list(process.env.CORS_ORIGINS) // A função já foi definida acima.
});
```

| Propriedade | Origem e finalidade |
| --- | --- |
| `port` | `PORT`; usa 3000 na ausência. É a porta que o processo Node escutará. |
| `region` | `AWS_REGION`; usa `us-east-1`. Define a região dos clientes AWS. |
| `dynamodbEndpoint` | `DYNAMODB_ENDPOINT`; ausente na AWS e definido para o banco local. |
| `usersTable` / `roundsTable` | `USERS_TABLE` e `ROUNDS_TABLE`; nomes das tabelas de usuários e rodadas. |
| `jwtSecret` | `JWT_SECRET`; valor usado localmente para assinar tokens, ainda não configurado. |
| `jwtSecretId` | `JWT_SECRET_ID`; nome do segredo no Secrets Manager, usado na implantação. |
| `corsOrigins` | `CORS_ORIGINS`; lista de origens autorizadas, separadas por vírgulas. |

O objeto é montado quando o módulo é carregado. Alterar `.env` enquanto o processo está rodando não reconstrói esse objeto: será necessário reiniciar a API. Não coloque access key, secret key ou token de sessão nesse arquivo para a implantação; a aplicação na EC2 usará as credenciais temporárias do perfil de instância.

### Express e ordem dos middlewares

Um **middleware** recebe requisição, resposta e a função `next`. Ele pode responder ou encaminhar o processamento. A ordem de registro é relevante: CORS vem antes das rotas, o leitor JSON prepara o corpo e o tratamento de erros fica no final. No Express 5, a rejeição de uma função `async` é encaminhada ao tratamento de erro.

![A ordem dos middlewares define o caminho da requisição](img/fig-13.webp)

*O processamento respeita a ordem; erros são tratados pelo middleware final.*

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend/src
touch backend/src/app.js
```

A função de origem é definida antes de ser passada ao middleware. A lista vazia ainda aceita clientes sem `Origin`, como o health check.

**backend/src/app.js · parte 1 de 3**

```javascript
import express from 'express';
import cors from 'cors';
import { config } from './config.js';

function corsOrigin(origin, callback) {
  // curl e health checks podem não enviar Origin.
  if (!origin || config.corsOrigins.includes(origin)) {
    return callback(null, true);
  }
  const error = new Error('Origem não autorizada.');
  error.status = 403;
  return callback(error);
}
```

`createApp` cria a aplicação e registra o endpoint de saúde. O limite de 16 KiB se aplica ao corpo JSON.

**backend/src/app.js · parte 2 de 3**

```javascript
}

export function createApp() {
  const app = express();
  app.disable('x-powered-by');

  app.use(cors({
    origin: corsOrigin,
    allowedHeaders: ['Content-Type', 'Authorization']
  })); // Inclui a resposta automática ao preflight OPTIONS.
  app.use(express.json({ limit: '16kb' }));

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
  });
```

O fallback devolve 404. O handler com quatro parâmetros preserva erros do cliente como 400 e 413, evita expor detalhes internos e finaliza a resposta.

**backend/src/app.js · parte 3 de 3**

```javascript
  });

  app.use((_request, response) => {
    response.status(404).json({ message: 'Rota não encontrada.' });
  });

  // Os quatro parâmetros identificam o middleware de erro do Express.
  app.use((error, _request, response, _next) => {
    let status = Number(error.status ?? error.statusCode ?? 500);
    if (error.name === 'TransactionCanceledException') status = 409;
    if (status < 400 || status > 599) status = 500;
    // Não registra corpo, senha ou cabeçalho Authorization.
    console.error({ event: 'request_error', name: error.name, status });
    const message = status === 409 ? 'Conflito. Atualize e tente novamente.'
      : status < 500 ? 'Requisição inválida.' : 'Erro interno do servidor.';
    response.status(status).json({ message });
  });

  return app;
}
```

### Ponto de entrada e execução

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend
touch backend/server.js
```

Agora importe a aplicação já definida e abra a porta. Na plataforma Beanstalk, `PORT` é fornecida pelo ambiente; localmente, o valor padrão é 3000.

**backend/server.js**

```javascript
import { createApp } from './src/app.js';
import { config } from './src/config.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`API disponível na porta ${config.port}`);
});
```

O **Procfile** é um arquivo de declaração de processos. Quem o interpreta neste projeto é a plataforma gerenciada Node.js do **AWS Elastic Beanstalk**, instalada nas instâncias EC2 do ambiente. A plataforma inclui sistema operacional, Node, proxy e rotinas de implantação e supervisão. O arquivo informa o comando do processo web que ela deverá manter em execução.

![Quem interpreta Procfile e onde a API é iniciada](img/fig-14.webp)

*GitLab entrega o pacote; a plataforma Beanstalk prepara e inicia o processo da API na EC2.*

Durante a implantação, o Beanstalk prepara os arquivos e as dependências e usa a declaração para iniciar a aplicação. Quando uma nova versão é implantada, o processo passa a executar o novo código. A plataforma monitora processos declarados no Procfile e reinicia os que terminam. O comando não é executado a cada requisição: um processo permanece atendendo várias chamadas HTTP.

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend
touch backend/Procfile
```

No editor local, crie `backend/Procfile`, com P maiúsculo e sem extensão. O arquivo contém uma única linha:

**backend/Procfile**

```text
web: npm start
```

Em `web: npm start`, `web` identifica o processo principal de atendimento; o trecho depois dos dois-pontos é o comando. `npm start` lê o script `start` do `package.json`, que já foi definido como `node server.js`. Ao gerar o ZIP da API, o pipeline colocará Procfile e `package.json` na raiz do pacote, lado a lado.

No computador local, executar `npm start` usa diretamente o manifesto; o Node e o npm não interpretam Procfile automaticamente. No GitLab, o job de implantação enviará o pacote e solicitará a atualização do ambiente. O processo público da API será iniciado na EC2 pelo Beanstalk. O proxy Nginx recebe HTTP e encaminha as chamadas à porta fornecida pela plataforma em `PORT`.

No terminal local da API, entre em `backend` a partir da raiz do projeto e mantenha o processo em execução. Use outro terminal para as verificações HTTP.

**Computador local · terminal da API, iniciado na raiz**

```bash
cd backend
npm start
```

`curl` é um cliente de linha de comando para transferir dados. Sem outras opções, esta URL é consultada com GET e o corpo da resposta é escrito no terminal. Primeiro consulte o endpoint de saúde sem `--fail`.

**Computador local · outro terminal**

```bash
curl http://localhost:3000/health
# Exibe o corpo da resposta: {"status":"ok"}.
```

Agora repita com `--fail`. A resposta de sucesso é a mesma; a diferença está em tratar respostas HTTP de erro como falha do comando. Isso permite que um job de CI falhe quando um endpoint devolve, por exemplo, 404 ou 500.

**Computador local · comparar as opções**

```bash
curl --fail http://localhost:3000/health
# Em HTTP 200, continua exibindo o mesmo JSON.

curl -i http://localhost:3000/health
# -i inclui a linha de status e os cabeçalhos antes do corpo.
```

Para observar a diferença, use um caminho que não foi registrado. Sem `--fail`, a transferência da resposta 404 termina normalmente e `curl` mostra o JSON de erro. Com `--fail`, esse 404 produz o código de saída 22 e o corpo não é mostrado. `$?` consulta o código do comando imediatamente anterior no Bash.

**Computador local · comparar HTTP com código de saída**

```bash
curl http://localhost:3000/rota-inexistente
echo $? # 0: a resposta HTTP foi recebida, embora seu status seja 404.

curl --fail http://localhost:3000/rota-inexistente
echo $? # 22: --fail transformou o HTTP 404 em falha do comando.
```

O endpoint `/health` deve responder 200 e `{"status":"ok"}`. Ele comprova que o processo atende HTTP; ainda não consulta banco nem Secrets Manager. Para encerrar a API, use **Ctrl+C** no terminal que executa `npm start`. Após alterar configuração ou módulos, inicie novamente dentro de `backend`.

**Computador local · terminal na raiz · versão C05**

```bash
git add backend
git commit -m "back: cria API e health check"
git push
```

## C06: Docker e DynamoDB Local
Duration: 20:00

### Do servidor físico aos contêineres

Em uma implantação direta, aplicações e suas dependências são instaladas em um sistema operacional sobre hardware físico. A administração precisa conciliar versões, bibliotecas e recursos da mesma máquina. A **virtualização** acrescenta um hipervisor: cada máquina virtual recebe hardware virtual e seu próprio sistema operacional, aumentando o isolamento entre ambientes.

Um **contêiner** isola processos e sua visão de arquivos e recursos usando mecanismos do sistema operacional. Ele carrega a aplicação e suas dependências de espaço de usuário, mas compartilha o kernel do host; não carrega um sistema operacional convidado completo. Docker fornece ferramentas para construir, distribuir e executar essas unidades. Servidores físicos, VMs e contêineres coexistem: contêineres frequentemente executam dentro de VMs.

![Da máquina física aos contêineres](img/fig-15.webp)

*A fronteira de isolamento muda; um contêiner Linux compartilha um kernel Linux.*

No macOS e no Windows, Docker Desktop normalmente usa uma VM Linux para executar contêineres Linux. O compartilhamento de kernel ocorre com essa VM, não diretamente com o kernel do macOS. Em Linux, o Engine pode usar diretamente o kernel do sistema. Isso explica por que uma imagem Linux pode funcionar no computador de desenvolvimento e no runner.

### Imagem, tag, contêiner, porta e volume

Uma **imagem** é o conjunto de camadas de arquivos usado como modelo; um **contêiner** é uma instância em execução. Uma **tag**, como `3.0.0`, seleciona uma versão publicada; um **digest** identifica seu conteúdo criptograficamente. Um **volume** guarda dados fora da camada descartável do contêiner. Publicar uma **porta** liga uma porta do host à porta do processo no contêiner.

![Imagem, contêiner, porta e volume](img/fig-16.webp)

*O banco roda em um contêiner; a API local chega até ele pela porta publicada.*

<aside class="positive">

**No mercado.** Imagens profissionais costumam ter versão controlada, verificação de vulnerabilidades, execução sem root e limites de recursos. Digests fornecem controle de conteúdo mais forte que tags. O volume mantém dados entre recriações locais, mas não substitui backup. A imagem do DynamoDB Local serve a desenvolvimento e testes; a implantação pública utilizará o DynamoDB gerenciado.

</aside>

**Compose** descreve serviços e volumes em YAML. O arquivo abaixo fixa a imagem em uma versão publicada para as arquiteturas usuais e publica a porta somente em `127.0.0.1`. A opção `user: root` simplifica a permissão de escrita do volume neste ambiente local; ela não deve ser tomada como padrão para serviços de produção.

**Computador local · raiz de duelo-cartas**

```bash
touch docker-compose.yml
```

Crie o serviço do banco. A lista de `command` é passada como argumentos ao executável definido em `entrypoint`.

**docker-compose.yml**

```yaml
services:
  dynamodb:
    image: amazon/dynamodb-local:3.0.0
    # Torna explícito o executável que receberá command.
    entrypoint: ['java']
    command: ['-jar', 'DynamoDBLocal.jar', '-sharedDb', '-dbPath', './data']
    working_dir: /home/dynamodblocal
    user: 'root' # Simplificação local para gravar no volume nomeado.
    ports:
      - '127.0.0.1:8000:8000' # Publica a porta só no próprio computador.
    volumes:
      - dynamodb_data:/home/dynamodblocal/data

volumes:
  dynamodb_data: # Persiste quando o container é recriado sem remover o volume.
```

| Elemento | O que realmente significa |
| --- | --- |
| `entrypoint: [java]` | Executa a JVM presente na imagem. |
| `-jar DynamoDBLocal.jar` | Pede à JVM que execute a aplicação contida nesse arquivo JAR. |
| `-sharedDb` | Clientes locais usam a mesma base lógica, sem separação por credencial e região. |
| `-dbPath ./data` | Grava a base no diretório `data`, relativo ao `working_dir`. |
| `127.0.0.1:8000:8000` | Interface do host, porta do host e porta do contêiner, nessa ordem. |
| `dynamodb_data:/home/dynamodblocal/data` | Monta o volume nomeado no diretório de dados do contêiner. |

Inicie o serviço e confira seu estado. A primeira execução baixa a imagem. O script de criação das tabelas também aguardará o banco aceitar requisições; um contêiner iniciado pode ainda estar inicializando a aplicação.

**Computador local · raiz de duelo-cartas**

```bash
docker compose config
docker compose up -d
docker compose ps
docker compose logs dynamodb
```

<aside class="negative">

**Persistência local.** `docker compose stop` interrompe o serviço. `docker compose down` remove os contêineres e a rede criada, preservando o volume nomeado. `docker compose down -v` também apaga esse volume e seus dados. Use a última opção somente ao descartar o banco local.

</aside>

## C06: modelagem no DynamoDB e criação das tabelas
Duration: 25:00

### DynamoDB: itens, atributos e chave primária

O DynamoDB é um banco NoSQL gerenciado. Uma **tabela** contém **itens**; cada item reúne **atributos**, como texto, número, lista e mapa. Um mapa permite armazenar um objeto dentro do item, como os dados de uma carta. A **chave primária** identifica cada item de forma única dentro da tabela. Seus atributos e tipos são escolhidos na criação da tabela.

Uma **partition key**, ou chave de partição, é um atributo cujo valor participa da localização dos dados no armazenamento distribuído. O DynamoDB aplica uma função de hash a esse valor para determinar a distribuição interna. Ela não é o número de uma máquina e não cria um servidor por usuário. Uma tabela pode ter somente essa chave ou uma chave composta por partition key e **sort key**.

### Chave simples: um usuário por e-mail

Na tabela `duelo-usuarios`, o atributo `email` é a partition key, do tipo String, e é a chave primária completa. O valor `ana@exemplo.com` identifica um único item. Nome, hash de senha e contadores são atributos desse item, não partes da chave. Duas pessoas podem ter o mesmo nome; dois itens dessa tabela não podem coexistir com o mesmo valor de `email`.

![Chave simples: email identifica um único usuário](img/fig-17.webp)

*Com chave simples, a partition key sozinha identifica o item; os demais atributos não tornam a chave diferente.*

<aside class="negative">

**Repetir a chave não cria uma segunda linha.** Uma gravação `Put` com a mesma chave pode substituir o item existente quando não há condição que impeça a substituição. Portanto, unicidade não significa que toda tentativa de repetição será rejeitada automaticamente. O script de cadastro usará uma condição para recusar a sobrescrita de um usuário existente.

</aside>

### Chave composta: várias rodadas do mesmo usuário

Na tabela `duelo-rodadas`, `userId` é a partition key e `roundId` é a sort key, ou chave de classificação. Itens com o mesmo `userId` formam uma coleção lógica. Dentro dela, a sort key distingue os itens e define sua ordem. A chave primária completa é o par `(userId, roundId)`: repetir apenas um dos dois componentes é permitido.

![Chave composta: escolher a coleção e o item dentro dela](img/fig-18.webp)

*A partition key seleciona a coleção lógica; a sort key identifica e ordena os itens dentro dela.*

No projeto, `userId` guardará o e-mail normalizado. `roundId` combinará uma data UTC em formato ISO 8601, o caractere `#` e um UUID. UUID é um identificador de 128 bits; o valor aleatório gerado pela aplicação torna colisões extremamente improváveis. A data com largura fixa organiza cronologicamente as strings; o UUID distingue rodadas criadas no mesmo milissegundo, sem garantir ordem exata entre elas.

Este é um exemplo completo do item que a API produzirá. Ele apresenta dados de uma rodada e será gravado pelo código do jogo; não é uma inserção manual no Console. A partition key seleciona Ana e a sort key identifica esta rodada específica.

**Exemplo de item · tabela duelo-rodadas**

```json
{
  "userId": "ana@exemplo.com",
  "roundId": "2026-09-08T14:00:00.000Z#f746fa41-0d82-4b98-b49c-54de8fcd4416",
  "createdAt": "2026-09-08T14:00:00.000Z",
  "playerCard": {
    "rank": 14, "label": "A", "suit": "♠", "color": "black"
  },
  "machineCard": {
    "rank": 9, "label": "9", "suit": "♥", "color": "red"
  },
  "result": "win"
}
```

JSON estrito não permite comentários. No item acima, `createdAt` facilita exibir a data sem separar a sort key; `playerCard` e `machineCard` são mapas; `result` registra vitória, empate ou derrota. Nenhum desses atributos adicionais altera a unicidade do par de chaves.

| Combinação | Pode coexistir com o item acima? |
| --- | --- |
| Mesmo `userId` e outro `roundId` | Sim: é outra rodada de Ana. |
| Outro `userId` e o mesmo `roundId` | Sim: o par completo é diferente. |
| Mesmo `userId` e mesmo `roundId` | Não como segundo item: é a mesma chave primária. |
| Mesmo `createdAt` e outro UUID em `roundId` | Sim: a sort key inteira é diferente. |

O DynamoDB não cria uma chave estrangeira entre `userId` e `email` de outra tabela. A aplicação obterá a identidade do token autenticado e usará transações que exigem a existência do usuário. Para permitir mudança de e-mail em um sistema real, um identificador imutável separado costuma ser uma chave de usuário mais conveniente.

### Buscar uma rodada ou listar o histórico

Para `GetItem` de uma tabela com chave composta, informe os dois componentes. Com apenas `userId`, ainda existem várias rodadas possíveis. Uma `Query` usa a igualdade da partition key e pode acrescentar uma condição sobre a sort key, como prefixo ou intervalo. No histórico, ela selecionará um usuário e percorrerá suas rodadas da mais recente para a mais antiga.

![Query: escolher um usuário e percorrer sua sort key](img/fig-19.webp)

*Query restringe a partition key e percorre a sort key; a paginação continua da chave devolvida pelo serviço.*

| Necessidade | Informação necessária |
| --- | --- |
| Ler um usuário | `GetItem` em `duelo-usuarios`, com `email`. |
| Ler uma rodada | `GetItem` em `duelo-rodadas`, com `userId` e `roundId` completos. |
| Listar rodadas de Ana | `Query` com `userId` igual a `ana@exemplo.com`. |
| Mais recentes primeiro | `Query` com `ScanIndexForward` igual a `false`. |
| Continuar a próxima página | Usar `LastEvaluatedKey` como `ExclusiveStartKey` da próxima consulta. |

A sort key String é ordenada pelos bytes UTF-8; o formato de data usado mantém a ordem cronológica para os prefixos. `Limit=20` limita os itens avaliados em uma chamada; a resposta também pode ser limitada por tamanho. Sem filtro adicional, como neste histórico, os itens avaliados são os retornados. Uma `Scan` percorre a tabela e não é necessária para localizar rodadas pela chave do usuário.

<aside class="positive">

**No mercado.** A modelagem começa pelas consultas: buscar uma pessoa pelo identificador e suas rodadas em ordem. Ler toda a tabela e filtrar depois cresce mal. Chaves e índices devem atender aos padrões de acesso; uma concentração excessiva de tráfego em poucas chaves pode gerar contenção. Uma coleção lógica por usuário não deve ser confundida com uma partição física exclusiva.

</aside>

### Instalar o SDK e definir o ambiente local

O **AWS SDK** fornece clientes JavaScript que assinam e enviam as requisições aos serviços. O cliente documental converte objetos JavaScript para o formato de atributos do DynamoDB. Instale os pacotes antes de importá-los.

**Computador local · raiz de duelo-cartas**

```bash
cd backend
npm install --save-exact @aws-sdk/client-dynamodb@3.1125.0 \
  @aws-sdk/lib-dynamodb@3.1125.0
npm pkg set 'scripts.db:create=node scripts/create-tables.js'
mkdir -p scripts
cd ..
```

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend
touch backend/.env.example
```

O arquivo de exemplo guarda nomes e valores fictícios. `JWT_SECRET` fica vazio porque cada ambiente terá seu próprio valor. A senha de usuário abaixo pertence somente ao banco local.

**backend/.env.example**

```ini
PORT=3000
AWS_REGION=us-east-1
DYNAMODB_ENDPOINT=http://127.0.0.1:8000
USERS_TABLE=duelo-usuarios
ROUNDS_TABLE=duelo-rodadas
# Gere o valor e preencha apenas o arquivo .env.
JWT_SECRET=
CORS_ORIGINS=http://localhost:8080
SEED_NAME=Pessoa Exemplo
SEED_EMAIL=aluno@exemplo.com
# Senha fictícia exclusiva do banco local; não reutilize em outros sistemas.
SEED_PASSWORD=SenhaLocal123!
```

Copie o exemplo e gere 48 bytes aleatórios, codificados em Base64URL. Copie a saída para `JWT_SECRET=` apenas em `backend/.env`, sem aspas adicionais. Esse valor é um segredo da aplicação, não uma senha de usuário. Ele será usado quando a autenticação for implementada.

**Computador local · raiz de duelo-cartas**

```bash
cp backend/.env.example backend/.env
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
git check-ignore backend/.env
```

O último comando deve imprimir o caminho ignorado. Não cadastre as credenciais reais do Learner Lab nesse arquivo. O cliente abaixo fornece credenciais fictícias quando há endpoint local e usa a cadeia padrão do SDK quando o endpoint não existe.

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend/src
touch backend/src/dynamo.js
```

Defina as opções locais antes de criar o cliente. O operador ternário escolhe entre o conjunto local e um objeto vazio.

**backend/src/dynamo.js**

```javascript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { config } from './config.js';

// Somente o endpoint local recebe credenciais fictícias explícitas.
const localOptions = config.dynamodbEndpoint
  ? {
      endpoint: config.dynamodbEndpoint,
      credentials: {
        accessKeyId: 'local',
        secretAccessKey: 'local'
      }
    }
  : {};

export const lowLevelClient = new DynamoDBClient({
  region: config.region,
  ...localOptions // Espalha opções locais; na AWS o objeto está vazio.
});

// O DocumentClient converte objetos JavaScript para o formato do DynamoDB.
export const documentClient = DynamoDBDocumentClient.from(lowLevelClient, {
  marshallOptions: { removeUndefinedValues: true }
});
```

### Criar as tabelas sem corrida de inicialização

Um script **idempotente** pode ser repetido sem duplicar o efeito pretendido. A rotina abaixo só aceita endpoint local, espera o banco responder e ignora exclusivamente o erro de tabela já existente. Ela aguarda a tabela ficar disponível antes de prosseguir.

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend/scripts
touch backend/scripts/create-tables.js
```

Importe os comandos e valide o destino antes de enviar qualquer criação.

**backend/scripts/create-tables.js · parte 1 de 4**

```javascript
import { CreateTableCommand, ListTablesCommand, waitUntilTableExists }
  from '@aws-sdk/client-dynamodb';
import { setTimeout as delay } from 'node:timers/promises';
import { config } from '../src/config.js';
import { lowLevelClient } from '../src/dynamo.js';

// Evita que este provisionamento de desenvolvimento alcance a AWS.
if (!config.dynamodbEndpoint) {
  throw new Error('db:create exige DYNAMODB_ENDPOINT local.');
}
```

A espera repete uma consulta leve com intervalo, até a aplicação do banco estar pronta.

**backend/scripts/create-tables.js · parte 2 de 4**

```javascript
}

async function waitForDatabase() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      await lowLevelClient.send(new ListTablesCommand({ Limit: 1 }));
      return;
    } catch (error) {
      if (attempt === 39) throw error;
      await delay(500); // O container pode existir antes de aceitar conexões.
    }
  }
}
```

A criação pode ser repetida. O *waiter* acompanha a disponibilidade da tabela em vez de supor que uma solicitação de criação já a tornou utilizável.

**backend/scripts/create-tables.js · parte 3 de 4**

```javascript
}

async function createTable(input) {
  try {
    await lowLevelClient.send(new CreateTableCommand(input));
  } catch (error) {
    if (error.name !== 'ResourceInUseException') throw error;
    // Repetir a criação não apaga a tabela existente.
  }
  await waitUntilTableExists(
    { client: lowLevelClient, maxWaitTime: 30, minDelay: 1, maxDelay: 2 },
    { TableName: input.TableName }
  );
  console.log(`Tabela pronta: ${input.TableName}`);
}
```

Agora execute as funções já definidas e crie as duas tabelas. `HASH` e `RANGE` representam partition key e sort key; `S` significa String.

**backend/scripts/create-tables.js · parte 4 de 4**

```javascript
}

await waitForDatabase();

await createTable({
  TableName: config.usersTable,
  BillingMode: 'PAY_PER_REQUEST',
  AttributeDefinitions: [{ AttributeName: 'email', AttributeType: 'S' }],
  KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }]
}); // HASH significa partition key; S significa String.

await createTable({
  TableName: config.roundsTable,
  BillingMode: 'PAY_PER_REQUEST',
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'roundId', AttributeType: 'S' }
  ],
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' },
    { AttributeName: 'roundId', KeyType: 'RANGE' }
  ] // RANGE significa sort key; não é outra tabela ou índice.
});
```

`HASH` e `RANGE` são os nomes usados pela API para partition key e sort key; não representam algoritmos que precisam ser implementados. `PAY_PER_REQUEST` representa capacidade sob demanda no serviço gerenciado; o DynamoDB Local não simula cobrança nem todas as limitações operacionais.

**Computador local · raiz de duelo-cartas**

```bash
cd backend
npm run db:create
cd ..
```

A saída deve indicar que as duas tabelas estão prontas. Repita o comando: ele não deve apagar dados ou recriar tabelas existentes.

**Computador local · terminal na raiz · versão C06**

```bash
git add docker-compose.yml backend
git commit -m "dev: adiciona DynamoDB Local"
git push
```

## C07: autenticação com bcrypt e JWT
Duration: 30:00

### Senha, hash, segredo e token

**Autenticação** verifica quem está fazendo a requisição; **autorização** determina quais operações essa identidade pode realizar. O login compara a senha recebida com um hash armazenado. Um **hash de senha** é uma transformação projetada para tornar tentativas de descoberta caras; ele não é uma cifra que a API precisa reverter.

**bcrypt** incorpora um *salt* aleatório e um fator de custo no hash. O salt evita que senhas iguais produzam necessariamente o mesmo resultado; o custo controla o trabalho da comparação. Bcrypt considera no máximo 72 bytes de senha, por isso a API e o script de cadastro rejeitam entradas maiores; a quantidade de bytes pode exceder a quantidade de caracteres em UTF-8.

Após uma comparação válida, a API cria um **JWT**: um token com cabeçalho, payload e assinatura. Usaremos **HS256**, que assina por HMAC com SHA-256 e um segredo compartilhado apenas pela API. Assinatura protege a integridade do token; **o payload não está criptografado**. Não coloque senha, hash ou credenciais AWS nele. O campo `sub` identifica o usuário; `iss`, `aud` e `exp` restringem emissor, destinatário e validade.

![Três valores diferentes, três responsabilidades](img/fig-20.webp)

*O segredo JWT não é a senha de login e não substitui as credenciais AWS.*

![Autenticação: senha na entrada, token nas próximas chamadas](img/fig-21.webp)

*A senha participa do login; as rotas seguintes recebem um token verificável.*

<aside class="positive">

**No mercado.** Em projetos novos, Argon2id é uma escolha recomendada para armazenamento de senhas. Bcrypt continua presente em sistemas existentes e exige atenção ao limite de entrada e ao custo. Sistemas expostos também aplicam limite de tentativas, monitoramento e recuperação de conta. O exemplo implementa o mecanismo básico; não oferece toda a proteção de um provedor de identidade.

</aside>

### Instalar bibliotecas e resolver o segredo

Instale `bcryptjs`, `jsonwebtoken` e o cliente do Secrets Manager. O segredo local já foi gerado em `backend/.env`. Na AWS, será criado outro valor independente no Secrets Manager; a API receberá somente seu identificador.

**Computador local · raiz de duelo-cartas**

```bash
cd backend
npm install --save-exact bcryptjs@3.0.3 jsonwebtoken@9.0.3 \
  @aws-sdk/client-secrets-manager@3.1125.0
npm pkg set 'scripts.db:seed=node scripts/seed-user.js'
mkdir -p src/routes
cd ..
```

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend/src
touch backend/src/secrets.js
```

A validação exige texto com comprimento mínimo. Um valor longo escolhido manualmente não garante boa entropia; use o gerador aleatório já apresentado.

**backend/src/secrets.js · parte 1 de 2**

```javascript
import { GetSecretValueCommand, SecretsManagerClient }
  from '@aws-sdk/client-secrets-manager';
import { config } from './config.js';

const client = new SecretsManagerClient({ region: config.region });
let cachedSecret;

function validateSecret(value) {
  if (typeof value !== 'string' || value.length < 32) {
    throw new Error('JWT_SECRET deve ter pelo menos 32 caracteres.');
  }
  return value;
}
```

`getJwtSecret` retorna o valor local ou consulta o segredo JSON na AWS. O cache fica na memória do processo para evitar uma consulta por requisição.

**backend/src/secrets.js · parte 2 de 2**

```javascript
}

export async function getJwtSecret() {
  if (config.jwtSecret) return validateSecret(config.jwtSecret);
  if (cachedSecret) return cachedSecret;
  if (!config.jwtSecretId) {
    throw new Error('Defina JWT_SECRET ou JWT_SECRET_ID.');
  }

  const result = await client.send(new GetSecretValueCommand({
    SecretId: config.jwtSecretId
  }));
  // O segredo é um objeto JSON com a chave JWT_SECRET.
  const data = JSON.parse(result.SecretString ?? '{}');
  cachedSecret = validateSecret(data.JWT_SECRET);
  return cachedSecret;
}
```

<aside class="negative">

**Troca do segredo.** O cache permanece válido até o processo reiniciar. Após alterar o segredo armazenado, reinicie os servidores da aplicação no Beanstalk para carregá-lo novamente. Tokens assinados com o valor anterior deixarão de validar. Uma rotação sem interrupção exige projetar um período de convivência de chaves.

</aside>

### Definir funções antes de registrar as rotas

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend/src
touch backend/src/auth.js
```

A normalização trata o identificador. A assinatura informa explicitamente algoritmo, identidade, emissor, audiência e expiração.

**backend/src/auth.js · parte 1 de 3**

```javascript
import jwt from 'jsonwebtoken';
import { getJwtSecret } from './secrets.js';

export function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export async function createToken(user) {
  const secret = await getJwtSecret();
  return jwt.sign({ name: user.name }, secret, {
    algorithm: 'HS256', // Assina usando HMAC com SHA-256.
    subject: user.email, // sub identifica o usuário autenticado.
    issuer: 'duelo-api',
    audience: 'duelo-web',
    expiresIn: '1h'
  });
}
```

O middleware extrai o Bearer e verifica o token. O segredo é obtido antes do `try` de validação, distinguindo falha de infraestrutura de token inválido.

**backend/src/auth.js · parte 2 de 3**

```javascript
}

export async function requireAuth(request, response, next) {
  // A regex captura o texto após Bearer; ?. trata cabeçalho ausente.
  const match = request.get('authorization')?.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return response.status(401).json({ message: 'Token ausente.' });
  }

  // Falha ao obter o segredo é erro do servidor, não do usuário.
  const secret = await getJwtSecret();
  try {
    const payload = jwt.verify(match[1], secret, {
      algorithms: ['HS256'], // Recusa tokens com outro algoritmo.
      issuer: 'duelo-api',
      audience: 'duelo-web'
    });
    if (typeof payload.sub !== 'string' || !payload.sub) {
      throw new Error('Token sem identificação.');
    }
    request.user = { email: payload.sub, name: payload.name };
    return next();
```

Feche o tratamento da autenticação: assinatura incorreta, conteúdo inválido ou expiração resultam em 401.

**backend/src/auth.js · parte 3 de 3**

```javascript
    request.user = { email: payload.sub, name: payload.name };
    return next();
  } catch {
    return response.status(401).json({
      message: 'Token inválido ou expirado.'
    });
  }
}
```

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend/src/routes
touch backend/src/routes/auth-routes.js
```

A rota importa funções já definidas. O hash substituto mantém uma comparação bcrypt mesmo quando o e-mail não existe, reduzindo uma diferença óbvia de tempo.

**backend/src/routes/auth-routes.js · parte 1 de 2**

```javascript
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { createToken, normalizeEmail } from '../auth.js';
import { config } from '../config.js';
import { documentClient } from '../dynamo.js';

export const authRouter = Router();
// Um hash substituto reduz diferenças de tempo para e-mails inexistentes.
const dummyHash = bcrypt.hashSync('nao-e-uma-senha-de-usuario', 12);

authRouter.post('/login', async (request, response) => {
  const email = normalizeEmail(request.body?.email);
  const password = request.body?.password;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== 'string' || password.length < 8 ||
      Buffer.byteLength(password, 'utf8') > 72) {
    return response.status(400).json({ message: 'Dados inválidos.' });
  }
```

A validação verifica tipos, formato básico do e-mail e limite da senha. A leitura usa a chave completa da tabela de usuários.

**backend/src/routes/auth-routes.js · parte 2 de 2**

```javascript
  }

  const result = await documentClient.send(new GetCommand({
    TableName: config.usersTable,
    Key: { email },
    ConsistentRead: true // Enxerga gravações já confirmadas na tabela.
  }));
  const valid = await bcrypt.compare(
    password, result.Item?.passwordHash ?? dummyHash
  );
  if (!result.Item || !valid) {
    return response.status(401).json({
      message: 'E-mail ou senha inválidos.'
    });
  }

  const token = await createToken(result.Item);
  return response.json({
    token,
    user: { email: result.Item.email, name: result.Item.name }
  });
});
```

### Acrescentar a rota à aplicação existente

Em `backend/src/app.js`, acrescente a importação abaixo junto das importações já existentes. O módulo foi criado antes de ser utilizado.

**backend/src/app.js · importação**

```javascript
import { config } from './config.js';
import { authRouter } from './routes/auth-routes.js';

function corsOrigin(origin, callback) {
```

Depois do fechamento da rota `/health` e antes do middleware 404, acrescente o registro do roteador. O prefixo `/api/auth` somado a `/login` forma a URL final.

**backend/src/app.js · após health**

```javascript
    response.json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);

  app.use((_request, response) => {
```

### Criar o primeiro usuário

Um script de **seed** insere dados iniciais controlados. O script abaixo lê nome, e-mail e senha de variáveis de ambiente, gera um hash com custo 12 e usa uma condição de ausência: repetir o comando não substitui uma senha existente.

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend/scripts
touch backend/scripts/seed-user.js
```

Importe as dependências, leia as variáveis e valide nome, e-mail e limites da senha. Só então produza o hash bcrypt com custo 12.

**backend/scripts/seed-user.js · parte 1 de 3**

```javascript
import bcrypt from 'bcryptjs';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { config } from '../src/config.js';
import { documentClient } from '../src/dynamo.js';
import { normalizeEmail } from '../src/auth.js';

const name = String(process.env.SEED_NAME ?? '').trim();
const email = normalizeEmail(process.env.SEED_EMAIL);
const password = String(process.env.SEED_PASSWORD ?? '');

if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
  throw new Error('Defina nome, e-mail e senha de 8 caracteres até 72 bytes.');
}

// O custo 12 controla o trabalho; bcrypt gera um salt automaticamente.
const passwordHash = await bcrypt.hash(password, 12);
```

Grave o usuário com contadores zerados. A condição de ausência preserva um cadastro já existente.

**backend/scripts/seed-user.js · parte 2 de 3**

```javascript
const passwordHash = await bcrypt.hash(password, 12);

try {
  // A condição evita trocar silenciosamente a senha de um usuário já criado.
  await documentClient.send(
    new PutCommand({
      TableName: config.usersTable,
      Item: {
        email,
        name,
        passwordHash,
        games: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        createdAt: new Date().toISOString()
      },
      ConditionExpression: 'attribute_not_exists(email)'
    })
  );
  console.log(`Usuário criado: ${email}`);
```

Reconheça somente o erro de cadastro existente como uma repetição segura; outras falhas devem encerrar o script com erro.

**backend/scripts/seed-user.js · parte 3 de 3**

```javascript
  );
  console.log(`Usuário criado: ${email}`);
} catch (error) {
  if (error.name === 'ConditionalCheckFailedException') {
    console.log(`Usuário já existe; nenhuma senha foi alterada: ${email}`);
  } else {
    throw error;
  }
}
```

Com o contêiner iniciado e as tabelas prontas, execute o seed e reinicie a API. A senha abaixo vem de `backend/.env`; se você a alterou, use o valor correspondente no teste de login.

**Computador local · terminal da API, partindo da raiz**

```bash
cd backend
npm run db:seed
npm start
```

**Computador local · outro terminal · autenticação**

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"aluno@exemplo.com","password":"SenhaErrada123!"}'

curl -i -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"aluno@exemplo.com","password":"SenhaLocal123!"}'
```

A primeira chamada deve retornar 401; a segunda, 200 com token e identificação pública. `-H` acrescenta um cabeçalho; `-d` envia o corpo. Não publique tokens recebidos em logs, issues ou commits.

**Computador local · terminal na raiz · versão C07**

```bash
git add backend
git commit -m "back: implementa autenticacao com JWT"
git push
```

## C08: regra do jogo, persistência e consistência
Duration: 35:00

### Construir e testar a regra do jogo

A regra deve poder ser executada sem Express e sem banco. A função `createDeck` constrói 52 cartas; `playRound` retira duas cartas. Um parâmetro opcional permite substituir a fonte de aleatoriedade nos testes, sem alterar a regra.

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend/src
touch backend/src/game.js
```

Comece pelos naipes e pela função que converte valores numéricos em rótulos.

**backend/src/game.js · parte 1 de 3**

```javascript
import { randomInt } from 'node:crypto';

const suits = [
  { symbol: '♣', color: 'black' },
  { symbol: '♦', color: 'red' },
  { symbol: '♥', color: 'red' },
  { symbol: '♠', color: 'black' }
];

function labelFor(rank) {
  return { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' }[rank] ?? String(rank);
}
```

`Array.from` cria 13 valores por naipe e `flatMap` reúne as listas em um único baralho.

**backend/src/game.js · parte 2 de 3**

```javascript
}

export function createDeck() {
  // flatMap reúne as listas de 13 cartas dos quatro naipes.
  return suits.flatMap((suit) =>
    // Cria 13 posições; index vai de 0 até 12.
    Array.from({ length: 13 }, (_, index) => {
      const rank = index + 2;
      return {
        rank,
        label: labelFor(rank),
        suit: suit.symbol,
        color: suit.color
      };
    })
  );
}
```

`randomInt(n)` escolhe de zero até n-1. `splice` retira o item escolhido; assim, a segunda seleção não pode repetir a mesma carta.

**backend/src/game.js · parte 3 de 3**

```javascript
}

export function playRound(random = randomInt) {
  const deck = createDeck();
  // splice retira a carta sorteada e impede duplicação na mesma rodada.
  const playerCard = deck.splice(random(deck.length), 1)[0];
  const machineCard = deck.splice(random(deck.length), 1)[0];
  let result = 'draw';
  if (playerCard.rank > machineCard.rank) result = 'win';
  if (playerCard.rank < machineCard.rank) result = 'loss';
  return { playerCard, machineCard, result };
}
```

### Leituras consistentes e transações

Uma leitura **eventualmente consistente** pode observar por um curto período o valor anterior a uma escrita confirmada. Nas leituras da tabela base, `ConsistentRead: true` solicita **consistência forte**, útil para mostrar o resultado logo após jogar. Isso não cria uma fotografia única para várias consultas independentes: perfil e histórico lidos separadamente podem refletir instantes distintos se houver concorrência.

Uma **transação** agrupa operações que precisam confirmar juntas. Ao criar uma rodada, serão executados um `Put` do histórico e um `Update` dos contadores. Ao excluir, um `Delete` condicional e o decremento dos mesmos contadores. O uso de `ADD` evita o padrão vulnerável de ler, somar no JavaScript e sobrescrever um valor que outra requisição pode ter atualizado.

![Histórico e placar precisam mudar juntos](img/fig-22.webp)

*A mesma regra de atomicidade vale para criação e exclusão.*

<aside class="negative">

**Limites de uma exclusão de histórico.** Cada rodada é excluída atomicamente com seu ajuste de placar. A exclusão de todo o histórico percorre várias transações; se houver interrupção, parte do histórico pode permanecer, mas o placar continua compatível com as rodadas efetivamente removidas. Repetir a operação conclui o trabalho. Não há uma transação global de tamanho ilimitado; requisições concorrentes podem criar rodadas durante a exclusão.

</aside>

<aside class="positive">

**No mercado.** Contadores agregados exigem invariantes claras. Zerar o placar depois de apagar o histórico em operações independentes pode perder incrementos ou falhar no meio. Para volumes grandes, a exclusão costuma ser assíncrona, com acompanhamento de progresso. A API síncrona aqui atende ao pequeno histórico de laboratório; consultas extensas podem ultrapassar limites de tempo do proxy.

</aside>

### Criar o módulo de acesso aos dados

O módulo de repositório concentra as operações de banco. Funções auxiliares aparecem antes das funções que as invocam. Os atributos `#games` e `#stat` são aliases de nomes; os valores `:delta` e `:userId` são parâmetros das expressões, não concatenação de entrada em uma consulta.

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend/src
touch backend/src/repository.js
```

Importe os comandos e defina o mapa de resultado para contador. `statsFrom` normaliza o formato público do placar.

**backend/src/repository.js · parte 1 de 7**

```javascript
import { randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { GetCommand, QueryCommand, TransactWriteCommand }
  from '@aws-sdk/lib-dynamodb';
import { config } from './config.js';
import { documentClient } from './dynamo.js';

const counters = { win: 'wins', draw: 'draws', loss: 'losses' };

export function statsFrom(item = {}) {
  return {
    games: item.games ?? 0, wins: item.wins ?? 0,
    draws: item.draws ?? 0, losses: item.losses ?? 0
  };
}
```

As leituras usam a identidade recebida do backend. O histórico traz vinte itens por padrão e aceita um cursor para consultas posteriores.

**backend/src/repository.js · parte 2 de 7**

```javascript
}

export async function readUser(email) {
  const result = await documentClient.send(new GetCommand({
    TableName: config.usersTable, Key: { email },
    ConsistentRead: true // Evita devolver um placar anterior à escrita.
  }));
  return result.Item;
}

export async function listRounds(email, lastKey, limit = 20) {
  return documentClient.send(new QueryCommand({
    TableName: config.roundsTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': email },
    ScanIndexForward: false, // Sort key em ordem decrescente.
    ConsistentRead: true,
    Limit: limit,
    ExclusiveStartKey: lastKey // undefined é omitido pelo SDK.
  }));
}
```

A transação mantém o token durante as tentativas internas. Somente conflitos identificados são repetidos, com atraso crescente e *jitter*.

**backend/src/repository.js · parte 3 de 7**

```javascript
}

async function transact(items, token = randomUUID()) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await documentClient.send(new TransactWriteCommand({
        ClientRequestToken: token, // Reusa o token nas tentativas internas.
        TransactItems: items
      }));
    } catch (error) {
      const conflict = error.CancellationReasons?.some(
        (reason) => reason.Code === 'TransactionConflict'
      );
      if (!conflict || attempt === 4) throw error;
      // Backoff crescente com jitter reduz colisões entre requisições.
      await delay(50 * 2 ** attempt + Math.random() * 50);
    }
  }
}
```

O construtor associa o resultado ao nome de contador e exige um usuário existente. `ADD` permite incrementar ou decrementar sem ler e sobrescrever o valor.

**backend/src/repository.js · parte 4 de 7**

```javascript
}

function counterUpdate(email, result, amount) {
  return {
    Update: {
      TableName: config.usersTable,
      Key: { email },
      ConditionExpression: 'attribute_exists(email)',
      // ADD soma valores; amount negativo subtrai sem ler e regravar.
      UpdateExpression: 'ADD #games :delta, #stat :delta',
      ExpressionAttributeNames: {
        '#games': 'games', '#stat': counters[result]
      },
      ExpressionAttributeValues: { ':delta': amount }
    }
  };
}
```

Data e UUID compõem a chave da rodada. `Put` condicional e atualização do placar entram na mesma transação; o item só é devolvido depois da confirmação.

**backend/src/repository.js · parte 5 de 7**

```javascript
}

export async function saveRound(email, outcome) {
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const round = {
    userId: email,
    roundId: `${createdAt}#${id}`, // Data ordena; UUID evita colisões.
    createdAt,
    ...outcome // Copia playerCard, machineCard e result.
  };

  await transact([
    { Put: {
      TableName: config.roundsTable, Item: round,
      ConditionExpression: 'attribute_not_exists(roundId)'
    } },
    counterUpdate(email, round.result, 1)
  ], id);
  return round;
}
```

A exclusão exige uma rodada existente e desconta seu resultado atomicamente. Uma remoção concorrente já concluída não pode descontar novamente.

**backend/src/repository.js · parte 6 de 7**

```javascript
}

async function deleteRound(round) {
  try {
    await transact([
      { Delete: {
        TableName: config.roundsTable,
        Key: { userId: round.userId, roundId: round.roundId },
        ConditionExpression: 'attribute_exists(roundId)'
      } },
      counterUpdate(round.userId, round.result, -1)
    ]);
  } catch (error) {
    // Outra exclusão pode ter removido o mesmo item: não desconta duas vezes.
    if (error.CancellationReasons?.[0]?.Code ===
        'ConditionalCheckFailed') return;
    throw error;
  }
}
```

A exclusão do histórico percorre páginas. O cursor é guardado antes de remover os itens, permitindo continuar a consulta após a chave já processada.

**backend/src/repository.js · parte 7 de 7**

```javascript
}

export async function deleteHistory(email) {
  let lastKey;
  do {
    const page = await listRounds(email, lastKey, 25);
    // Guarda o cursor antes de remover os itens desta página.
    lastKey = page.LastEvaluatedKey;
    for (const round of page.Items ?? []) {
      await deleteRound(round);
    }
  } while (lastKey); // Prossegue além do limite de uma página da Query.
}
```

`ClientRequestToken` evita repetir o efeito da mesma chamada transacional dentro da janela de idempotência do DynamoDB, de dez minutos, quando os mesmos parâmetros são reenviados. Ele não transforma dois POSTs independentes em uma única rodada: cada nova requisição gera outro UUID. Uma idempotência HTTP completa exigiria chave de requisição fornecida pelo cliente e armazenamento do resultado.

### Registrar rotas protegidas

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend/src/routes
touch backend/src/routes/game-routes.js
```

O middleware de autenticação é registrado antes das rotas. O perfil seleciona campos públicos e não devolve o hash.

**backend/src/routes/game-routes.js · parte 1 de 2**

```javascript
import { Router } from 'express';
import { requireAuth } from '../auth.js';
import { playRound } from '../game.js';
import { readUser, listRounds, saveRound, deleteHistory, statsFrom }
  from '../repository.js';

export const gameRouter = Router();
gameRouter.use(requireAuth); // Protege todas as rotas registradas abaixo.

gameRouter.get('/me', async (request, response) => {
  const user = await readUser(request.user.email);
  if (!user) {
    return response.status(404).json({ message: 'Usuário inexistente.' });
  }
  return response.json({ user: {
    email: user.email, name: user.name, stats: statsFrom(user)
  } }); // Seleciona campos públicos; não envia passwordHash.
});
```

A criação usa o usuário extraído do token e ignora uma identidade enviada no corpo. O histórico também é consultado apenas para essa identidade.

**backend/src/routes/game-routes.js · parte 2 de 2**

```javascript
});

gameRouter.get('/rounds', async (request, response) => {
  const page = await listRounds(request.user.email);
  return response.json({ rounds: page.Items ?? [] });
});

gameRouter.post('/rounds', async (request, response) => {
  const email = request.user.email; // Identidade vem do JWT verificado.
  const round = await saveRound(email, playRound());
  const user = await readUser(email);
  return response.status(201).json({ round, stats: statsFrom(user) });
});

gameRouter.delete('/rounds', async (request, response) => {
  const email = request.user.email;
  await deleteHistory(email);
  const user = await readUser(email);
  return response.json({ stats: statsFrom(user) });
});
```

Acrescente a importação do roteador de jogo em `backend/src/app.js`, imediatamente depois da importação de autenticação.

**backend/src/app.js · importação do jogo**

```javascript
import { authRouter } from './routes/auth-routes.js';
import { gameRouter } from './routes/game-routes.js';

function corsOrigin(origin, callback) {
```

Registre o roteador de jogo depois do roteador de autenticação e antes do 404. O caminho `/api` será combinado com `/me` e `/rounds`.

**backend/src/app.js · registro do jogo**

```javascript
  app.use('/api/auth', authRouter);
  app.use('/api', gameRouter);

  app.use((_request, response) => {
```

### Verificar a API por HTTP

Reinicie a API. Em outro terminal, guarde a resposta do login em uma variável. O segundo comando lê JSON pela entrada padrão e retorna somente um token válido; ele falha se o login não tiver produzido um token.

**Computador local · outro terminal · obter o token**

```bash
LOGIN=$(curl --fail --silent --show-error \
  -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"aluno@exemplo.com","password":"SenhaLocal123!"}')

TOKEN=$(printf '%s' "$LOGIN" | node -e '
  let text = "";
  process.stdin.on("data", chunk => text += chunk);
  process.stdin.on("end", () => {
    const data = JSON.parse(text);
    if (!data.token) process.exit(1);
    process.stdout.write(data.token);
  });')
```

`$(...)` captura a saída de um comando. `Authorization` transporta o esquema Bearer e o token. Crie uma rodada, consulte perfil e histórico e, por fim, exclua. O método HTTP define a operação sobre o recurso.

**Computador local · outro terminal · operações autenticadas**

```bash
curl --fail -X POST http://localhost:3000/api/rounds \
  -H "Authorization: Bearer $TOKEN"

curl --fail http://localhost:3000/api/me \
  -H "Authorization: Bearer $TOKEN"

curl --fail http://localhost:3000/api/rounds \
  -H "Authorization: Bearer $TOKEN"

curl --fail -X DELETE http://localhost:3000/api/rounds \
  -H "Authorization: Bearer $TOKEN"
```

| Operação | Resultado esperado |
| --- | --- |
| `POST /api/rounds` | 201; uma rodada e placar atualizado |
| `GET /api/rounds` | 200; até vinte rodadas recentes |
| `GET /api/me` | 200; identificação pública e contadores |
| `DELETE /api/rounds` | 200; contadores após a exclusão |
| Rotas protegidas sem token | 401; nenhuma alteração de dados |

Repita perfil e histórico depois da exclusão: sem outras chamadas concorrentes, a lista deve estar vazia e os quatro contadores, zerados. Não edite os itens do banco manualmente durante essa verificação.

**Computador local · terminal na raiz · versão C08**

```bash
git add backend/src
git commit -m "game: persiste rodadas com transacoes"
git push
```

## C09: integrar o front à API
Duration: 35:00

### Conferir as origens antes de conectar as páginas

A API já tem o middleware de CORS. Agora o navegador fará chamadas reais a ela, por isso a origem configurada precisa corresponder exatamente ao endereço usado para abrir o front. No navegador, a aba **Network** permite conferir `Origin`, `OPTIONS` e os cabeçalhos de resposta.

`backend/.env` já contém `CORS_ORIGINS=http://localhost:8080`. Abra o front exatamente por essa origem; `127.0.0.1:8080` é outra origem para CORS. O módulo da API usará `http://localhost:3000`. Reinicie a API após alterar variáveis de ambiente.

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p frontend/js
touch frontend/js/config.js
```

Crie primeiro a configuração pública. `Object.freeze` impede alterações diretas nas propriedades; ele não torna o conteúdo secreto.

**frontend/js/config.js**

```javascript
window.APP_CONFIG = Object.freeze({ API_URL: 'http://localhost:3000' });
```

### HTTP e armazenamento do token

`fetch` inicia a requisição e retorna uma `Promise`. `await` aguarda sua conclusão sem bloquear a execução de todo o processo. Erros HTTP como 401 não rejeitam automaticamente a Promise do `fetch`; é necessário examinar `response.ok` ou o status. O corpo JSON também é lido de forma assíncrona.

`sessionStorage` mantém o token por origem e contexto de navegação da aba. Ele não é um cofre: scripts da mesma origem podem ler o conteúdo. Uma duplicação ou abertura de aba pode copiar o estado inicial em certos fluxos do navegador. O token continua sujeito à expiração validada na API. O código usará `textContent` ao exibir dados, evitando interpretá-los como HTML.

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p frontend/js
touch frontend/js/api.js
```

Normalize a URL e defina as funções de acesso ao token antes da função HTTP.

**frontend/js/api.js · parte 1 de 3**

```javascript
// ?. trata configuração ausente; a expressão remove a barra final.
const baseUrl = window.APP_CONFIG?.API_URL?.replace(/\/$/, '');
// sessionStorage limita o token à guia atual; não é uma solução para HTTPS ausente.
const tokenKey = 'duelo-cartas-token';

export function getToken() {
  return sessionStorage.getItem(tokenKey);
}

export function setToken(token) {
  sessionStorage.setItem(tokenKey, token);
}

export function clearToken() {
  sessionStorage.removeItem(tokenKey);
}
```

A função `request` compõe os cabeçalhos: JSON quando existe corpo, Bearer quando existe token e `Accept` para a resposta esperada.

**frontend/js/api.js · parte 2 de 3**

```javascript
}

export async function request(path, options = {}) {
  if (!baseUrl) {
    throw new Error('A URL da API não foi configurada.');
  }

  // Headers permite compor cabeçalhos sem perder os recebidos em options.
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
```

Envie a requisição, leia a resposta e trate erros HTTP. Sessão inválida em rota protegida remove o token; erro de login permanece na tela de entrada.

**frontend/js/api.js · parte 3 de 3**

```javascript
  }

  // Toda chamada passa pelo mesmo tratamento de cabeçalhos e de erros.
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));

  if (response.status === 401 && path !== '/api/auth/login') {
    clearToken();
    window.location.replace('index.html');
    throw new Error('Sua sessão expirou. Entre novamente.');
  }
  if (!response.ok) {
    throw new Error(payload.message ?? 'Não foi possível concluir a operação.');
  }
  return payload;
}
```

### Controlador do formulário

O evento `submit` representa o envio do formulário. `preventDefault` impede o envio HTML tradicional, permitindo executar o login pelo `fetch`. `checkValidity` consulta as restrições dos campos. O bloco `finally` restaura o botão tanto em sucesso quanto em erro.

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p frontend/js
touch frontend/js/login.js
```

Importe o cliente HTTP, selecione os elementos existentes e inicie o tratamento de `submit`.

**frontend/js/login.js · parte 1 de 3**

```javascript
import { getToken, request, setToken } from './api.js';

if (getToken()) {
  window.location.replace('dashboard.html');
}

const form = document.querySelector('#login-form');
const alertBox = document.querySelector('#login-alert');
const button = document.querySelector('#login-button');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  alertBox.classList.add('d-none');
```

Consulte a validação nativa, bloqueie o botão e envie os campos como JSON. `namedItem` encontra os controles pelo atributo `name`.

**frontend/js/login.js · parte 2 de 3**

```javascript
  alertBox.classList.add('d-none');
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  button.disabled = true;
  button.textContent = 'Entrando...';
  try {
    // A senha segue apenas no corpo desta requisição e nunca é persistida no front.
    const payload = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: form.elements.namedItem('email').value,
        password: form.elements.namedItem('password').value
      })
    });
```

Grave o token apenas após sucesso; erros são exibidos como texto. `finally` restaura o botão em ambos os caminhos.

**frontend/js/login.js · parte 3 de 3**

```javascript
    });
    setToken(payload.token);
    window.location.replace('dashboard.html');
  } catch (error) {
    alertBox.textContent = error.message;
    alertBox.classList.remove('d-none');
  } finally {
    button.disabled = false;
    button.textContent = 'Entrar';
  }
});
```

### Renderização e eventos do painel

O controlador separa obtenção de dados, renderização e tratamento de eventos. `querySelector` retorna o primeiro elemento que corresponde ao seletor. `classList.toggle` com nome e condição mantém ou remove uma classe conforme a condição. `Promise.all` permite aguardar duas consultas independentes em paralelo.

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p frontend/js
touch frontend/js/dashboard.js
```

Importe o cliente e capture as referências dos elementos que já existem no painel.

**frontend/js/dashboard.js · parte 1 de 9**

```javascript
import { clearToken, getToken, request } from './api.js';

const elements = {
  alert: document.querySelector('#dashboard-alert'),
  playerName: document.querySelector('#player-name'),
  games: document.querySelector('#games-stat'),
  wins: document.querySelector('#wins-stat'),
  draws: document.querySelector('#draws-stat'),
  losses: document.querySelector('#losses-stat'),
  playerCard: document.querySelector('#player-card'),
  machineCard: document.querySelector('#machine-card'),
  result: document.querySelector('#round-result'),
  playButton: document.querySelector('#play-button'),
  resetButton: document.querySelector('#reset-button'),
  logoutButton: document.querySelector('#logout-button'),
  historyBody: document.querySelector('#history-body'),
  emptyHistory: document.querySelector('#empty-history')
};
```

Defina os textos de resultado e as funções de exibição e limpeza de erro antes dos eventos.

**frontend/js/dashboard.js · parte 2 de 9**

```javascript
};

const resultLabels = {
  win: 'Você venceu!',
  draw: 'Empate.',
  loss: 'A máquina venceu.'
};

function showError(error) {
  elements.alert.textContent = error.message;
  elements.alert.classList.remove('d-none');
}

function clearError() {
  elements.alert.classList.add('d-none');
}
```

Renderize placar e cartas com texto e classes. O início de `renderHistory` limpa as linhas anteriores e ajusta a mensagem de vazio.

**frontend/js/dashboard.js · parte 3 de 9**

```javascript
}

function renderStats(stats) {
  elements.games.textContent = stats.games ?? 0;
  elements.wins.textContent = stats.wins ?? 0;
  elements.draws.textContent = stats.draws ?? 0;
  elements.losses.textContent = stats.losses ?? 0;
}

function renderCard(container, card) {
  container.querySelector('.card-rank').textContent = card.label;
  container.querySelector('.card-suit').textContent = card.suit;
  container.classList.toggle('is-red', card.color === 'red');
  container.classList.toggle('is-black', card.color === 'black');
}

function renderHistory(rounds) {
  // createElement/textContent evitam interpretar dados da API como HTML.
  elements.historyBody.replaceChildren();
  elements.emptyHistory.classList.toggle('d-none', rounds.length > 0);
```

Para cada rodada, crie uma linha e suas células. `textContent` impede que os valores retornados pela API sejam interpretados como HTML.

**frontend/js/dashboard.js · parte 4 de 9**

```javascript
  elements.emptyHistory.classList.toggle('d-none', rounds.length > 0);
  for (const round of rounds) {
    const row = document.createElement('tr');
    const values = [
      new Date(round.createdAt).toLocaleString('pt-BR'),
      `${round.playerCard.label}${round.playerCard.suit}`,
      `${round.machineCard.label}${round.machineCard.suit}`,
      resultLabels[round.result]
    ];
    for (const value of values) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    }
    elements.historyBody.appendChild(row);
  }
}
```

`loadDashboard` consulta perfil e histórico em paralelo e entrega os resultados às funções de renderização já definidas.

**frontend/js/dashboard.js · parte 5 de 9**

```javascript
}

async function loadDashboard() {
  clearError();
  try {
    // Perfil e histórico são independentes e podem ser buscados em paralelo.
    const [profile, history] = await Promise.all([
      request('/api/me'),
      request('/api/rounds')
    ]);
    elements.playerName.textContent = profile.user.name;
    renderStats(profile.user.stats);
    renderHistory(history.rounds);
  } catch (error) {
    showError(error);
  }
}
```

`setBusy` bloqueia jogar e excluir na mesma aba. O evento de jogar pede uma rodada à API e apresenta as cartas e o placar recebidos.

**frontend/js/dashboard.js · parte 6 de 9**

```javascript
}

function setBusy(busy) {
  elements.playButton.disabled = busy;
  elements.resetButton.disabled = busy;
}

elements.playButton.addEventListener('click', async () => {
  clearError();
  setBusy(true);
  elements.playButton.textContent = 'Sorteando...';
  try {
    const payload = await request('/api/rounds', { method: 'POST' });
    renderCard(elements.playerCard, payload.round.playerCard);
    renderCard(elements.machineCard, payload.round.machineCard);
    elements.result.textContent = resultLabels[payload.round.result];
    renderStats(payload.stats);
```

Conclua o evento de jogar relendo o histórico e liberando os controles. Depois, comece o evento de exclusão solicitando confirmação.

**frontend/js/dashboard.js · parte 7 de 9**

```javascript
    renderStats(payload.stats);
    const history = await request('/api/rounds');
    renderHistory(history.rounds);
  } catch (error) {
    showError(error);
  } finally {
    setBusy(false);
    elements.playButton.textContent = 'Jogar uma rodada';
  }
});

elements.resetButton.addEventListener('click', async () => {
  const confirmed = window.confirm('Excluir todo o histórico e zerar o placar?');
  if (!confirmed) return;
```

A exclusão bloqueia os controles, chama `DELETE` e relê o histórico. Os valores visuais das cartas são limpos; `finally` libera os botões mesmo em erro.

**frontend/js/dashboard.js · parte 8 de 9**

```javascript
  if (!confirmed) return;
  clearError();
  setBusy(true);
  try {
    const payload = await request('/api/rounds', { method: 'DELETE' });
    renderStats(payload.stats);
    const history = await request('/api/rounds');
    renderHistory(history.rounds);
    for (const container of [elements.playerCard, elements.machineCard]) {
      container.querySelector('.card-rank').textContent = '?';
      container.classList.remove('is-red', 'is-black');
    }
    elements.result.textContent = 'Histórico atualizado. Vamos recomeçar?';
  } catch (error) {
    showError(error);
  } finally {
    setBusy(false);
  }
});
```

Sair remove o token. Ao abrir o painel, carregue os dados somente se existe token; a autorização efetiva continua sob responsabilidade da API.

**frontend/js/dashboard.js · parte 9 de 9**

```javascript
});

elements.logoutButton.addEventListener('click', () => {
  clearToken();
  window.location.replace('index.html');
});

if (getToken()) {
  loadDashboard();
} else {
  window.location.replace('index.html');
}
```

### Ativar os módulos somente depois de criá-los

Em `frontend/index.html`, o botão `login-button` já tem controlador definido. Remova apenas o atributo `disabled`; mantenha seu texto e as demais propriedades.

**frontend/index.html**

```html
<button id="login-button" class="btn btn-primary btn-lg w-100"
        type="submit">
  Entrar
</button>
```

No final de `frontend/index.html`, dentro de `body` e depois de todo o conteúdo visual, acrescente os scripts abaixo. A configuração é carregada antes do módulo que a consulta.

**frontend/index.html**

```html
<body class="login-page">
  <!-- Mantenha aqui todo o conteúdo visual já existente. -->
  <script src="js/config.js"></script>
  <!-- Módulos aceitam import e executam após a análise do HTML. -->
  <script type="module" src="js/login.js"></script>
</body>
```

Em `frontend/dashboard.html`, os botões `logout-button`, `play-button` e `reset-button` já têm controladores definidos. Remova apenas o atributo `disabled` de cada um; mantenha seus textos e as demais propriedades.

**frontend/dashboard.html**

```html
<button id="logout-button" class="btn btn-outline-light btn-sm"
        type="button">Sair</button>

<button id="play-button" class="btn btn-primary btn-lg"
        type="button">Jogar uma rodada</button>

<button id="reset-button" class="btn btn-outline-danger btn-sm"
        type="button">Excluir histórico</button>
```

No final de `frontend/dashboard.html`, dentro de `body` e depois de todo o conteúdo visual, acrescente os scripts abaixo.

**frontend/dashboard.html**

```html
<body class="dashboard-page">
  <!-- Mantenha aqui todo o conteúdo visual já existente. -->
  <script src="js/config.js"></script>
  <!-- Módulos aceitam import e executam após a análise do HTML. -->
  <script type="module" src="js/dashboard.js"></script>
</body>
```

Com DynamoDB e API ativos, inicie o servidor estático na raiz se ele estiver parado. Abra `http://localhost:8080`; entre com `aluno@exemplo.com` e a senha local definida. Jogue, recarregue e confirme persistência; exclua e confirme o ajuste do placar. O botão **Sair** deve levar ao login.

**Computador local · raiz de duelo-cartas**

```bash
npx --yes http-server@14.1.1 frontend -a 127.0.0.1 -p 8080 -c-1
```

<aside class="negative">

**Endereço local e endereço publicado.** Por enquanto, `config.js` aponta para `localhost`. O teste completo deve ser feito no endereço local. Na publicação definitiva, o pipeline criará outra cópia desse arquivo com o endereço público da API. Uma URL `localhost` entregue pelo S3 continuaria apontando para o computador de cada visitante, não para o Beanstalk.

</aside>

**Computador local · terminal na raiz · versão C09**

```bash
git add frontend
git commit -m "front: integra autenticacao e jogo"
git push
```

<aside class="positive">

**No mercado.** Aplicações profissionais centralizam o transporte HTTP para padronizar cabeçalhos, tratamento de falhas e telemetria. Repetir automaticamente uma requisição de escrita pode duplicar efeitos; retries de POST exigem um contrato de idempotência. O botão desabilitado melhora a interface, mas não controla concorrência entre abas ou instâncias da API.

</aside>

## C10: lint e testes unitários no pipeline
Duration: 20:00

### Lint e testes verificam aspectos diferentes

**Lint** identifica problemas estáticos, como nomes inexistentes e variáveis não usadas. Um **teste unitário** executa uma unidade pequena com entradas conhecidas e compara o resultado esperado. Ambos são úteis: sintaxe válida não demonstra regra correta, e alguns testes aprovados não eliminam todo erro possível.

Crie um manifesto separado na raiz para as ferramentas que inspecionam front e back. O manifesto da API, dentro de `backend`, continua independente. Instale o ESLint e as descrições de ambientes antes de importar suas configurações.

**Computador local · raiz de duelo-cartas**

```bash
npm init -y
npm pkg set type=module
npm pkg set private=true --json
npm install --save-dev --save-exact eslint@9.39.5 \
  @eslint/js@9.39.5 globals@16.5.0
npm pkg set 'scripts.lint=eslint frontend/js backend/src backend/scripts backend/test backend/server.js'
mkdir -p backend/test/unit scripts
```

<aside class="negative">

**Compatibilidade do lint.** A versão 9 do ESLint aceita Node 22 desde a versão inicial dessa linha. Ela é usada aqui para manter essa compatibilidade ampla. Sua manutenção oficial terminou em agosto de 2026, portanto o npm pode emitir um aviso de descontinuação; esse aviso não impede a instalação. Em projetos mantidos, atualize o Node e a ferramenta para versões com suporte ativo.

</aside>

**Computador local · raiz de duelo-cartas**

```bash
touch eslint.config.js
```

A configuração plana é uma lista de objetos. Cada objeto ajusta o conjunto de arquivos e o ambiente a que suas regras se aplicam. No navegador existem `window` e `document`; no Node, `process` e `Buffer`. O prefixo de parâmetro `_` sinaliza argumentos exigidos pela API que o código não utiliza.

**eslint.config.js**

```javascript
import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['**/node_modules/**', 'frontend/js/config.js']
  },
  js.configs.recommended, // Regras de erros comuns de JavaScript.
  {
    files: ['frontend/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser // window, document e sessionStorage.
    }
  },
  {
    files: ['backend/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node // process, Buffer e outros globais do Node.
    },
    rules: {
      'no-console': 'off',
      // _ indica um parâmetro exigido pela API, mas não usado aqui.
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
];
```

### Testar o baralho e a normalização

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend/test/unit
touch backend/test/unit/game.test.js
```

A função de sequência injeta índices conhecidos. Ela é declarada antes dos testes e não depende da fonte real de aleatoriedade. Os casos verificam cartas únicas, vitória e empate com valores determinísticos.

**backend/test/unit/game.test.js**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { createDeck, playRound } from '../../src/game.js';

function sequence(values) {
  return (maximum) => Math.min(values.shift(), maximum - 1);
}

test('o baralho possui 52 cartas únicas', () => {
  const deck = createDeck();
  const identities = new Set(deck.map((card) => `${card.rank}${card.suit}`));
  assert.equal(deck.length, 52);
  assert.equal(identities.size, 52);
});

test('a carta de maior valor vence', () => {
  const round = playRound(sequence([51, 0]));
  assert.equal(round.playerCard.label, 'A');
  assert.equal(round.machineCard.label, '2');
  assert.equal(round.result, 'win');
});

test('cartas de mesmo valor empatam', () => {
  const round = playRound(sequence([0, 12]));
  assert.equal(round.playerCard.rank, round.machineCard.rank);
  assert.equal(round.result, 'draw');
});
```

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend/test/unit
touch backend/test/unit/auth.test.js
```

A normalização deve retirar espaços externos, converter para minúsculas e tratar ausência de valor.

**backend/test/unit/auth.test.js**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEmail } from '../../src/auth.js';

test('normaliza espaços e letras maiúsculas do e-mail', () => {
  assert.equal(normalizeEmail(' Aluno@Exemplo.COM '), 'aluno@exemplo.com');
});

test('converte valor ausente em texto vazio', () => {
  assert.equal(normalizeEmail(), '');
});
```

Cadastre o script na API e execute as duas verificações. O executor `node --test` já acompanha o runtime, sem outra biblioteca de testes.

**Computador local · raiz de duelo-cartas**

```bash
cd backend
npm pkg set 'scripts.test:unit=node --test test/unit/*.test.js'
npm run test:unit
cd ..
npm run lint
```

O resultado esperado é cinco testes aprovados e nenhum erro de lint. As assertivas comparam resultados; falha de uma assertiva encerra o processo com status de erro, fazendo o job falhar.

### Evoluir a esteira sem duplicar o arquivo

Em `.gitlab-ci.yml`, acrescente `test` entre `validate` e `deploy` e o bloco `default` logo após a lista. Jobs de teste poderão ser interrompidos em fluxos configurados para cancelar pipelines redundantes; o deploy já define `interruptible: false`.

**.gitlab-ci.yml · início**

```yaml
stages:
  - validate
  - test
  - deploy

default:
  interruptible: true

front_smoke:
```

Acrescente os dois jobs abaixo antes de `deploy_frontend`. Eles ficam no nível superior do YAML, sem indentação extra. Jobs do mesmo stage podem executar em paralelo; o deploy continua aguardando os stages anteriores. O lint instala as ferramentas da raiz com `npm ci` e executa o script do manifesto; os testes entram na pasta `backend` e instalam a árvore de dependências própria da API.

**.gitlab-ci.yml · novos jobs**

```yaml
code_quality:
  stage: validate
  image: node:22-alpine
  before_script:
    - npm ci
  script:
    - npm run lint

unit_tests:
  stage: test
  image: node:22-alpine
  before_script:
    - cd backend
    - npm ci
  script:
    - npm run test:unit
```

No job `front_smoke`, mantenha a imagem e substitua somente a lista `script` pelo trecho abaixo. As verificações agora acompanham os arquivos da aplicação integrada.

**.gitlab-ci.yml · script de front_smoke**

```yaml
  image: alpine:3.22
  script:
    - test -s frontend/index.html
    - test -s frontend/dashboard.html
    - test -s frontend/css/styles.css
    - test -s frontend/js/api.js
    - grep -q 'type="module"' frontend/index.html
```

**Computador local · terminal na raiz · versão C10**

```bash
git add package.json package-lock.json eslint.config.js backend .gitlab-ci.yml
git commit -m "test: adiciona lint e testes unitarios"
git push
```

<aside class="positive">

**No mercado.** Uma verificação só oferece proteção quando participa do caminho de liberação. Testes e lint precisam impedir o empacotamento ou deploy após falha. O cache de pacotes pode acelerar a instalação, mas não substitui o lockfile nem deve ser a única fonte de arquivos necessários.

</aside>

## C11: testes de integração com DynamoDB no CI
Duration: 25:00

### Teste de integração e isolamento de dados

O **teste de integração** percorre Express, autenticação, repositório e o protocolo do DynamoDB. **Supertest** permite enviar requisições para a aplicação Express durante a execução do teste. O banco é real para o ambiente local; não é um objeto mockado. Os nomes das tabelas recebem prefixo `test-`, separando os dados de teste dos dados usados ao explorar a aplicação.

**Computador local · raiz de duelo-cartas**

```bash
cd backend
npm install --save-dev --save-exact supertest@7.2.2
npm pkg set 'scripts.test:integration=node --test --test-concurrency=1 test/integration/*.test.js'
mkdir -p test/integration
cd ..
```

Os testes usam um usuário exclusivo por execução. `before` cria a massa e obtém um token; `after` limpa somente os itens desse usuário. A execução serial mantém a ordem dos casos que compartilham esse cenário. A guarda inicial impede rodar sem endpoint local ou em tabelas sem o prefixo de teste.

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p backend/test/integration
touch backend/test/integration/api.test.js
```

Importe o executor, as assertivas, a aplicação e os clientes já implementados. A guarda verifica o destino de testes. Um UUID identifica o usuário temporário sem colisão com execuções anteriores.

**backend/test/integration/api.test.js · parte 1 de 5**

```javascript
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { createApp } from '../../src/app.js';
import { config } from '../../src/config.js';
import { documentClient } from '../../src/dynamo.js';
import { deleteHistory } from '../../src/repository.js';

if (!config.dynamodbEndpoint ||
    !config.usersTable.startsWith('test-') ||
    !config.roundsTable.startsWith('test-')) {
  throw new Error('Use endpoint local e tabelas com prefixo test-.');
}

const app = createApp();
const credentials = {
  email: `teste-${randomUUID()}@exemplo.com`,
  password: 'SenhaDeTeste123!'
};
let authorization;
```

`before` cria a massa descartável e obtém um token. O custo reduzido do hash vale somente para esse usuário de teste. `after` limpa os itens criados.

**backend/test/integration/api.test.js · parte 2 de 5**

```javascript
let authorization;

before(async () => {
  await documentClient.send(new PutCommand({
    TableName: config.usersTable,
    Item: {
      email: credentials.email, name: 'Pessoa de Teste',
      // Custo menor somente para acelerar a massa descartável de testes.
      passwordHash: await bcrypt.hash(credentials.password, 4),
      games: 0, wins: 0, draws: 0, losses: 0
    }
  }));
  const login = await request(app).post('/api/auth/login')
    .send(credentials).expect(200);
  authorization = `Bearer ${login.body.token}`;
});

after(async () => {
  await deleteHistory(credentials.email);
  await documentClient.send(new DeleteCommand({
    TableName: config.usersTable, Key: { email: credentials.email }
  }));
  documentClient.destroy(); // Libera as conexões usadas pela suíte.
});
```

Os primeiros testes verificam saúde e recusa de tokens ausentes ou inválidos, senha incorreta, tipo inválido de e-mail e JSON malformado. Entradas inválidas devem retornar erro do cliente.

**backend/test/integration/api.test.js · parte 3 de 5**

```javascript
});

test('health responde sem autenticação', async () => {
  const result = await request(app).get('/health').expect(200);
  assert.equal(result.body.status, 'ok');
});

test('recusa token ausente ou adulterado', async () => {
  await request(app).get('/api/rounds').expect(401);
  await request(app).post('/api/rounds')
    .set('Authorization', 'Bearer token-invalido').expect(401);
});

test('recusa senha incorreta e entrada inválida', async () => {
  await request(app).post('/api/auth/login')
    .send({ ...credentials, password: 'SenhaErrada123!' }).expect(401);
  await request(app).post('/api/auth/login')
    .send({ email: ['invalido'], password: 'SenhaDeTeste123!' }).expect(400);
});

test('JSON inválido é erro 400, não erro interno', async () => {
  await request(app).post('/api/auth/login')
    .set('Content-Type', 'application/json').send('{').expect(400);
});
```

Confira o preflight, a recusa de origem não autorizada e a ausência de `passwordHash` na resposta pública do perfil.

**backend/test/integration/api.test.js · parte 4 de 5**

```javascript
});

test('CORS autoriza a origem local e recusa outra origem', async () => {
  const result = await request(app).options('/api/rounds')
    .set('Origin', 'http://localhost:8080')
    .set('Access-Control-Request-Method', 'POST').expect(204);
  assert.equal(result.headers['access-control-allow-origin'],
    'http://localhost:8080');
  await request(app).get('/health')
    .set('Origin', 'http://origem-invalida.example').expect(403);
});

test('perfil não revela o hash da senha', async () => {
  const result = await request(app).get('/api/me')
    .set('Authorization', authorization).expect(200);
  assert.equal(result.body.user.email, credentials.email);
  assert.equal('passwordHash' in result.body.user, false);
});
```

A criação deve usar a identidade do token mesmo se outro `userId` for enviado no corpo. Confira também cartas distintas e leitura da rodada persistida. Depois, crie um histórico maior que uma página. Após excluir, confira todos os contadores, histórico vazio e sucesso de uma repetição da exclusão.

**backend/test/integration/api.test.js · parte 5 de 5**

```javascript
});

test('persiste rodada, atualiza placar e isola a identidade', async () => {
  const created = await request(app).post('/api/rounds')
    .set('Authorization', authorization)
    .send({ userId: 'outra-pessoa@exemplo.com' }).expect(201);
  assert.equal(created.body.round.userId, credentials.email);
  assert.equal(created.body.stats.games, 1);
  const { playerCard, machineCard } = created.body.round;
  assert.notEqual(`${playerCard.rank}${playerCard.suit}`,
    `${machineCard.rank}${machineCard.suit}`);
  const history = await request(app).get('/api/rounds')
    .set('Authorization', authorization).expect(200);
  assert.equal(history.body.rounds.length, 1);
});

test('exclui além de uma página sem desalinhar contadores', async () => {
  // 27 novas rodadas mais a anterior ultrapassam a página de 25 itens.
  for (let index = 0; index < 27; index += 1) {
    await request(app).post('/api/rounds')
      .set('Authorization', authorization).expect(201);
  }
  const history = await request(app).get('/api/rounds')
    .set('Authorization', authorization).expect(200);
  assert.equal(history.body.rounds.length, 20);
  await request(app).delete('/api/rounds')
    .set('Authorization', authorization).expect(200);
  const profile = await request(app).get('/api/me')
    .set('Authorization', authorization).expect(200);
  assert.deepEqual(profile.body.user.stats,
    { games: 0, wins: 0, draws: 0, losses: 0 });
  const empty = await request(app).get('/api/rounds')
    .set('Authorization', authorization).expect(200);
  assert.deepEqual(empty.body.rounds, []);
  await request(app).delete('/api/rounds')
    .set('Authorization', authorization).expect(200);
});
```

### Executar contra o banco local

As variáveis são aplicadas em um subshell, delimitado por parênteses. Ao terminar, elas não alteram o terminal usado para iniciar a API de desenvolvimento. O segredo JWT abaixo foi escolhido apenas para testes descartáveis e não vem da AWS. Ele tem comprimento suficiente para passar pela validação e pode ser conhecido porque não protege dados reais.

**Computador local · raiz de duelo-cartas**

```bash
(
  cd backend
  export DYNAMODB_ENDPOINT=http://127.0.0.1:8000
  export USERS_TABLE=test-usuarios ROUNDS_TABLE=test-rodadas
  export JWT_SECRET=segredo-apenas-do-teste-de-integracao
  export CORS_ORIGINS=http://localhost:8080
  npm run db:create
  npm run test:integration
)
```

Oito testes de integração devem passar. Eles incluem entradas inválidas, CORS, dados públicos, identidade derivada do token e exclusão com mais de 25 itens. O ciclo de vida de teste usa custo bcrypt 4 apenas na massa descartável; o script de criação de usuário continua usando 12.

### Adicionar o contêiner de serviço ao job

![No CI, cada contêiner possui seu próprio localhost](img/fig-23.webp)

*No runner, localhost é o próprio contêiner do job; o banco é alcançado pelo alias dynamodb.*

Acrescente o bloco global `variables` logo após `stages`, antes de `default`. As regiões e nomes de tabelas são públicos. `AWS_EC2_METADATA_DISABLED` impede o SDK de procurar um perfil de instância no runner; no Beanstalk essa variável não será configurada.

**.gitlab-ci.yml · bloco global**

```yaml
variables:
  AWS_REGION: 'us-east-1'
  AWS_DEFAULT_REGION: 'us-east-1'
  USERS_TABLE: 'duelo-usuarios'
  ROUNDS_TABLE: 'duelo-rodadas'
  AWS_EC2_METADATA_DISABLED: 'true'
  AWS_PAGER: '' # Desativa paginação interativa da CLI.
```

Acrescente `integration_tests` depois de `unit_tests`. Ele pertence ao mesmo stage, mas possui seu próprio banco. Não é preciso Docker-in-Docker: o runner inicia o serviço declarado em `services`. A imagem do serviço é a mesma usada no Compose. Aqui não há volume: o banco é descartado no fim do job.

**.gitlab-ci.yml · integration_tests**

```yaml
integration_tests:
  stage: test
  image: node:22-alpine
  services:
    - name: amazon/dynamodb-local:3.0.0
      alias: dynamodb # DNS interno do banco, acessível apenas ao job.
      entrypoint: ['java']
      command: ['-jar', 'DynamoDBLocal.jar', '-sharedDb', '-inMemory']
  variables:
    DYNAMODB_ENDPOINT: 'http://dynamodb:8000'
    USERS_TABLE: 'test-usuarios'
    ROUNDS_TABLE: 'test-rodadas'
    JWT_SECRET: 'segredo-apenas-do-teste-de-integracao'
    CORS_ORIGINS: 'http://localhost:8080'
  before_script:
    - cd backend
    - npm ci
  script:
    - npm run db:create # O script aguarda a prontidão do banco.
    - npm run test:integration
```

<aside class="positive">

**O significado exato de command.** `entrypoint: [java]` escolhe o programa. A lista `[-jar, DynamoDBLocal.jar, -sharedDb, -inMemory]` fornece seus argumentos, na ordem: executar o JAR, compartilhar a base local e manter os dados apenas em memória. O comando efetivo é `java -jar DynamoDBLocal.jar -sharedDb -inMemory`. Não se usa `-dbPath` junto com `-inMemory`. A lista não é executada como um shell, portanto cada argumento ocupa um elemento.

</aside>

<aside class="negative">

**Segredo de teste e precedência de variáveis.** `JWT_SECRET: segredo-apenas-do-teste-de-integracao` é uma constante pública do ambiente de teste. Não a cadastre como segredo real. Também não crie variáveis de projeto com os nomes `DYNAMODB_ENDPOINT`, `JWT_SECRET`, `USERS_TABLE` ou `ROUNDS_TABLE`: variáveis do projeto têm precedência sobre as do YAML e poderiam desfazer o isolamento planejado.

</aside>

**Computador local · terminal na raiz · versão C11**

```bash
git add backend .gitlab-ci.yml
git commit -m "test: valida integracao com DynamoDB"
git push
```

<aside class="positive">

**No mercado.** O teste local valida o contrato e a lógica, mas não comprova permissões IAM, rede da conta, escalabilidade, custos ou todos os modos de falha do serviço gerenciado. Uma estratégia profissional acrescenta verificação em ambiente AWS controlado. Falhas transacionais por concorrência e throttling também merecem testes específicos. Não trate a velocidade do emulador como previsão de desempenho da nuvem.

</aside>

## Infraestrutura AWS para a aplicação pública
Duration: 30:00

### IAM e responsabilidades no Beanstalk

**IAM** define quem pode executar quais ações sobre quais recursos. Um **role** fornece permissões que podem ser assumidas por serviços ou identidades; um **instance profile** associa um role à instância EC2. O SDK pode obter credenciais temporárias dessa instância automaticamente, sem access key no código.

**Elastic Beanstalk** é uma plataforma que provisiona e coordena recursos para executar a aplicação. Na plataforma Node.js, o proxy Nginx recebe HTTP e encaminha para o processo da API. O deploy enviará um ZIP de código; não construiremos uma imagem Docker para a API. Docker é usado no desenvolvimento do banco e nos ambientes dos jobs.

![Elastic Beanstalk: plataforma gerenciada, aplicação Node.js](img/fig-24.webp)

*O processo web executa dentro da EC2 gerenciada pela plataforma.*

O **service role** permite ao Beanstalk administrar o ambiente. O **instance profile** permite à aplicação acessar os serviços autorizados. No Learner Lab, selecione as identidades preexistentes previstas nas instruções: `LabRole` e `LabInstanceProfile`. Confira esses nomes na conta antes de criar o ambiente; não tente contornar a política criando permissões que o laboratório não permite.

<aside class="positive">

**No mercado.** Em produção, as permissões costumam ser separadas por responsabilidade: o processo de aplicação lê o segredo e opera tabelas específicas; a identidade de implantação publica versões; a plataforma gerencia infraestrutura. Um role amplo de laboratório não é um modelo de menor privilégio. Infraestrutura como código torna essas decisões repetíveis e revisáveis.

</aside>

### Criar as tabelas no Console

Inicie uma sessão válida e confirme `us-east-1`. No Console AWS, em **DynamoDB > Tables > Create table**, crie as tabelas abaixo. Para cada uma, escolha **Customize settings > Read/write capacity > On-demand**, mantenha as demais opções apropriadas ao laboratório e aguarde status **Active**.

| Tabela | Partition key | Sort key |
| --- | --- | --- |
| `duelo-usuarios` | `email` (String) | Não possui |
| `duelo-rodadas` | `userId` (String) | `roundId` (String) |

Não declare atributos de dados como `name`, `passwordHash` ou `playerCard` na criação: a definição antecipada é necessária apenas para as chaves e índices. O esquema da chave primária não é editável depois. Se uma tabela vazia foi criada com chave errada, exclua somente essa tabela e recrie-a com o esquema correto.

### Criar o segredo da implantação

Gere um **novo segredo**, diferente daquele do arquivo local. O comando produz aleatoriedade, não uma senha fácil de memorizar. Copie apenas a saída.

**Computador local · raiz de duelo-cartas**

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

1. Abra **Secrets Manager > Store a new secret > Other type of secret**.
2. Use o modo de pares chave/valor: chave `JWT_SECRET`, valor igual à saída recém-gerada.
3. Mantenha a chave de criptografia padrão do serviço, se permitida no laboratório.
4. Use o nome `duelo-cartas/jwt` e deixe rotação automática desativada neste ambiente.
5. Revise e armazene. A aplicação lerá o JSON com essa chave; não troque por um texto sem estrutura.

`JWT_SECRET_ID` receberá o nome `duelo-cartas/jwt`. O valor secreto não vai para o GitLab, o repositório ou o front. A instância precisa de permissão `secretsmanager:GetSecretValue`; com uma chave KMS própria, também haveria requisitos de descriptografia correspondentes.

### Criar o bucket privado de pacotes

No Console AWS, em **S3 > Create bucket**, crie um segundo bucket de uso geral, em `us-east-1`, por exemplo `duelo-releases-grupo99-projeto01`. Mantenha ACLs desabilitadas e todas as opções de bloqueio de acesso público ativadas. Não habilite website hosting. O bucket guarda os ZIPs de versões, não arquivos para o navegador.

### Criar aplicação e ambiente no Beanstalk

1. No Console AWS, em **Elastic Beanstalk > Create application**, informe `duelo-cartas-api`.
2. Escolha **Web server environment**, nome `duelo-cartas-api-dev` e um domínio disponível.
3. Escolha plataforma gerenciada **Node.js**, branch **Node.js 22 running on 64bit Amazon Linux 2023**, com a versão de plataforma mantida mais recente disponível dessa branch.
4. Selecione **Sample application**. Ela permite criar o ambiente antes da primeira implantação do código.
5. Use a predefinição **Single instance**. Em acesso ao serviço, selecione `LabRole` como service role e `LabInstanceProfile` como EC2 instance profile.
6. Se um par de chaves for exigido, selecione o existente `vockey`; a implantação não utilizará SSH.
7. Use a VPC padrão disponível. Selecione subnet pública com rota para Internet Gateway e habilite endereço IPv4 público quando a tela apresentar a opção.
8. Escolha uma única instância x86_64 `t3.micro`, se admitida pela conta; não associe RDS. Mantenha o proxy Nginx.

A **VPC** isola uma rede na AWS; uma **subnet** é uma faixa de endereços dentro dela. Uma subnet é pública quando sua tabela de rotas permite alcançar um Internet Gateway. O IP público permite tráfego com a internet; o **security group** filtra tráfego da instância. Para essa API HTTP, o ambiente precisa receber TCP 80 e alcançar os endpoints dos serviços e os repositórios de pacotes. Não abra 3000 ou 8000 ao público.

<aside class="negative">

**Saúde e atualizações gerenciadas.** Escolha o modo de saúde básico e desabilite atualizações gerenciadas da plataforma neste laboratório se essas opções estiverem disponíveis. Isso evita exigir um role adicional de atualizações automáticas não fornecido pela conta. Um erro de permissão deve ser confrontado com o evento específico e a política vigente do Learner Lab, não corrigido com permissões genéricas.

</aside>

<aside class="positive">

**No mercado.** Uma instância única simplifica custo e operação, mas cria um ponto único de falha. Disponibilidade maior normalmente envolve balanceador, múltiplas instâncias e zonas, TLS, monitoramento e estratégia de implantação. Durante uma substituição ou reinício de instância única pode haver indisponibilidade.

</aside>

### Propriedades da aplicação

No Console AWS, abra **Elastic Beanstalk > Environments > duelo-cartas-api-dev**. Dentro desse ambiente, em **Configuration > Updates, monitoring and logging > Environment properties**, ou na etapa equivalente da criação, configure os valores abaixo. O caminho visual pode mudar; procure as propriedades de ambiente do processo.

| Propriedade | Valor |
| --- | --- |
| `AWS_REGION` | `us-east-1` |
| `USERS_TABLE` | `duelo-usuarios` |
| `ROUNDS_TABLE` | `duelo-rodadas` |
| `JWT_SECRET_ID` | `duelo-cartas/jwt` |
| `CORS_ORIGINS` | Website endpoint HTTP do S3, sem barra final |
| `NODE_ENV` | `production` |

Não defina `DYNAMODB_ENDPOINT`, `JWT_SECRET`, access key, secret key ou session token no Beanstalk. A ausência de endpoint seleciona o DynamoDB gerenciado; a ausência de `JWT_SECRET` faz o resolvedor buscar o Secrets Manager. Deixe a plataforma fornecer `PORT`. Salve e aguarde o ambiente ficar **Ready**. A URL deve exibir a aplicação de exemplo; `/health` do projeto ainda não existe ali.

No Console AWS, abra **EC2 > Instances**, selecione a instância criada pelo Beanstalk e, na aba **Security**, abra o security group associado. Confira a entrada HTTP na porta 80 e a saída necessária. Se o ambiente não iniciar, abra **Events** dentro do ambiente Beanstalk e encontre o primeiro erro. Confirme a disponibilidade de subnet pública, perfil, role e tipo de instância antes de repetir a criação.

### Variáveis finais no GitLab

No GitLab.com, abra o projeto `duelo-cartas` e cadastre em **Settings > CI/CD > Variables** os nomes abaixo, com escopo `*` e proteção habilitada. URLs e nomes não são segredos; as três credenciais AWS permanecem mascaradas e protegidas. Se uma sessão nova foi iniciada, atualize as três juntas.

| Variável | Valor |
| --- | --- |
| `ARTIFACTS_BUCKET` | Nome do bucket privado |
| `EB_APPLICATION` | `duelo-cartas-api` |
| `EB_ENVIRONMENT` | `duelo-cartas-api-dev` |
| `API_URL` | URL HTTP do Beanstalk, sem barra final |

Não cadastre os nomes de tabelas como variáveis de projeto: o pipeline já os define e os testes os substituem no escopo do job. A distinção evita que a precedência do GitLab faça um teste usar tabelas de outro ambiente.

## C12: empacotar e implantar pelo GitLab
Duration: 30:00

### Artefatos e configuração pública

Um **artefato** de pipeline é um arquivo produzido por um job e preservado para etapas seguintes. O ZIP da API é um *source bundle*: o código e o manifesto que a plataforma instalará. O front terá uma cópia própria de publicação com a URL pública da API. A configuração local permanece útil ao desenvolvimento.

Crie o script abaixo antes de incluí-lo no pipeline. Ele usa somente bibliotecas internas do Node. `new URL` valida e decompõe o endereço; a validação exige apenas protocolo, host e eventual porta. `JSON.stringify` serializa a configuração sem depender de concatenação manual de aspas.

**Computador local · raiz de duelo-cartas**

```bash
mkdir -p scripts
touch scripts/build-frontend.js
```

O script lê `API_URL` e exige um endereço HTTP ou HTTPS sem usuário, senha, caminho adicional, consulta ou fragmento.

**scripts/build-frontend.js**

```javascript
import { cp, mkdir, writeFile } from 'node:fs/promises';

const apiUrl = new URL(process.env.API_URL ?? '');
if (!['http:', 'https:'].includes(apiUrl.protocol) ||
    apiUrl.username || apiUrl.password || apiUrl.pathname !== '/' ||
    apiUrl.search || apiUrl.hash) {
  throw new Error('API_URL deve conter apenas protocolo, host e porta.');
}

await mkdir('public', { recursive: true });
await cp('frontend', 'public', { recursive: true });
// JSON.stringify escapa o valor antes de incorporá-lo ao JavaScript.
const content = `window.APP_CONFIG = Object.freeze(${JSON.stringify({
  API_URL: apiUrl.origin
})});\n`;
await writeFile('public/js/config.js', content);
```

Inclua a nova pasta de scripts no lint e teste a geração com o endpoint local. Como o argumento vale apenas para esse comando, ele não muda o valor configurado no GitLab.

**Computador local · raiz de duelo-cartas**

```bash
npm pkg set 'scripts.lint=eslint frontend/js backend/src backend/scripts backend/test backend/server.js scripts'
API_URL=http://localhost:3000 node scripts/build-frontend.js
npm run lint
```

A pasta `public` deve conter os arquivos do front e `js/config.js`. Ela é ignorada pelo Git. No job, a mesma geração usará `API_URL` do ambiente Beanstalk.

### Adicionar o estágio e os jobs de pacote

Em `.gitlab-ci.yml`, acrescente `package` entre `test` e `deploy`. Mantenha o bloco `variables` e todos os jobs de qualidade já existentes.

**.gitlab-ci.yml · stages**

```yaml
stages:
  - validate
  - test
  - package
  - deploy
```

Acrescente os dois jobs abaixo antes dos jobs de deploy. Como não declaram `needs`, eles respeitam a conclusão de todos os stages anteriores. Um erro em qualquer teste impede o empacotamento. O primeiro job instala `zip` dentro de sua própria imagem Alpine; ao entrar em `backend` antes de compactar, coloca `package.json` na raiz do ZIP. O pacote do front é gerado em Node e preservado como artefato para o job de publicação.

**.gitlab-ci.yml · jobs de pacote**

```yaml
package_backend:
  stage: package
  image: alpine:3.22
  before_script:
    - apk add --no-cache zip
  script:
    - cd backend
    - zip -r ../backend.zip package.json package-lock.json Procfile server.js src
  artifacts:
    paths: [backend.zip] # Disponibiliza o ZIP aos próximos jobs.
    expire_in: 1 day
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'

package_frontend:
  stage: package
  image: node:22-alpine
  script:
    - node scripts/build-frontend.js
  artifacts:
    paths: [public/]
    expire_in: 1 day
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'
```

<aside class="positive">

**Conteúdo correto do ZIP.** A raiz do pacote deve conter `package.json`, `package-lock.json`, `Procfile`, `server.js` e `src/`. Não inclua uma pasta externa `backend`, o arquivo `.env` ou `node_modules`. O Beanstalk instalará as dependências necessárias na plataforma. O script de seed não precisa estar no ZIP: seu job executa diretamente o código do repositório.

</aside>

### Implantar a API e verificar a versão aplicada

Acrescente `deploy_backend` antes de `deploy_frontend`. `needs` cria uma dependência explícita e traz o ZIP desse job de pacote. A imagem AWS CLI já contém o executável `aws`; `entrypoint` vazio permite ao runner usar seu shell. O job consome o artefato da API e impede cancelamento automático durante a atualização do ambiente. O rótulo combina o identificador do commit e o número do pipeline; o ZIP é enviado ao bucket privado.

**.gitlab-ci.yml · deploy_backend**

```yaml
deploy_backend:
  stage: deploy
  image:
    name: public.ecr.aws/aws-cli/aws-cli:2.31.4
    entrypoint: [''] # Entrega o controle ao shell do runner.
  interruptible: false
  needs:
    - job: package_backend
      artifacts: true
  script:
    - aws sts get-caller-identity
    - VERSION_LABEL="${CI_COMMIT_SHORT_SHA}-${CI_PIPELINE_IID}"
    - S3_KEY="releases/${VERSION_LABEL}.zip"
    - aws s3 cp backend.zip "s3://${ARTIFACTS_BUCKET}/${S3_KEY}"
    - |
      # Evita recriar o mesmo rótulo ao repetir um job.
      CURRENT=$(aws elasticbeanstalk describe-application-versions \
        --application-name "$EB_APPLICATION" \
        --version-labels "$VERSION_LABEL" \
        --query 'ApplicationVersions[0].VersionLabel' --output text)
      if [ "$CURRENT" != "$VERSION_LABEL" ]; then
        aws elasticbeanstalk create-application-version \
          --application-name "$EB_APPLICATION" \
          --version-label "$VERSION_LABEL" \
          --source-bundle S3Bucket="$ARTIFACTS_BUCKET",S3Key="$S3_KEY"
      fi
    - |
      aws elasticbeanstalk update-environment \
        --environment-name "$EB_ENVIRONMENT" --version-label "$VERSION_LABEL"
      aws elasticbeanstalk wait environment-updated \
        --environment-name "$EB_ENVIRONMENT"
      # Ready também pode ocorrer após rollback; confira a versão aplicada.
      DEPLOYED=$(aws elasticbeanstalk describe-environments \
        --environment-names "$EB_ENVIRONMENT" \
        --query 'Environments[0].VersionLabel' --output text)
      test "$DEPLOYED" = "$VERSION_LABEL"
  environment:
    name: production/backend
    url: $API_URL
  resource_group: learner-lab-deploy # Exclusão mútua por job e projeto.
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'
```

A consulta verifica se o rótulo já existe. O bloco literal YAML com `|` preserva as quebras de linha de um script de shell. `--query` aplica uma expressão JMESPath à resposta da AWS CLI; `--output text` permite comparar o valor no shell. A barra invertida no final da linha continua o mesmo comando. O teste final devolve status diferente de zero se o ambiente não executar o rótulo esperado, impedindo que a falha seja tratada como uma entrega bem-sucedida.

### Atualizar somente o job de publicação do front

Substitua o bloco inteiro `deploy_frontend` existente pelo trecho abaixo, mantendo todos os demais jobs. Esse job recebe o pacote do front e aguarda o deploy da API. `artifacts: false` na dependência da API evita tentar baixar arquivos de um job que serve apenas como requisito de ordem.

**.gitlab-ci.yml · deploy_frontend**

```yaml
deploy_frontend:
  stage: deploy
  image:
    name: public.ecr.aws/aws-cli/aws-cli:2.31.4
    entrypoint: ['']
  interruptible: false
  needs:
    - job: deploy_backend # Só publica o front após concluir a API.
      artifacts: false
    - job: package_frontend
      artifacts: true
  script:
    - aws s3 sync public "s3://${FRONTEND_BUCKET}" --delete --cache-control no-cache
    - |
      aws s3 cp public/js/config.js "s3://${FRONTEND_BUCKET}/js/config.js" \
        --content-type application/javascript --cache-control no-store
  environment:
    name: production/frontend
    url: $FRONTEND_URL
  resource_group: learner-lab-deploy
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'
```

`resource_group` serializa os jobs que usam a mesma chave, mas não transforma uma sequência inteira de deploys em uma transação nem garante, sozinho, a ordem entre pipelines diferentes. No projeto do GitLab.com, em **Settings > CI/CD > General pipelines**, habilite a prevenção de jobs de implantação desatualizados quando disponível. Evite iniciar várias liberações simultâneas para o mesmo ambiente de laboratório.

**Computador local · terminal na raiz · versão C12**

```bash
git add scripts package.json .gitlab-ci.yml
git commit -m "deploy: publica API e front integrados"
git push
```

O pipeline deve concluir validação, testes, pacote e deploy. No Beanstalk, a versão aplicada deve conter o rótulo do commit e pipeline; `API_URL/health` deve responder. No S3, `js/config.js` deve conter a origem pública da API, sem `localhost`. O login ainda pode recusar as credenciais porque o usuário público será criado no próximo passo.

<aside class="positive">

**No mercado.** Um artefato aprovado deve ser promovido de forma rastreável. Em produção, alterações de API e front precisam tolerar algum intervalo entre versões; publicar arquivos estáticos por `sync` não é uma troca atômica do site. Estratégias com nomes versionados, manifestos, CDN e compatibilidade de contratos reduzem esse risco.

</aside>

## C13: verificação pública e usuário inicial
Duration: 20:00

### Configurar o usuário de laboratório

O usuário do DynamoDB Local não existe automaticamente no DynamoDB da conta AWS. Cadastre as variáveis abaixo no GitLab, com escopo `*` e proteção habilitada. Mascare a senha e desative expansão de referências. Defina uma senha exclusiva para esse ambiente: o script aceita no mínimo oito caracteres e no máximo 72 bytes UTF-8.

| Variável | Valor |
| --- | --- |
| `SEED_NAME` | `Pessoa Exemplo` |
| `SEED_EMAIL` | `aluno@exemplo.com` |
| `SEED_PASSWORD` | Uma nova senha exclusiva do laboratório público |

Esses valores serão consumidos pelo job manual de seed. A senha não é `JWT_SECRET`: um valor autentica a pessoa; o outro assina os tokens emitidos pela API. Reexecutar o seed para o mesmo e-mail preserva a senha já cadastrada.

### Verificação e bootstrap no pipeline

Acrescente `verify` ao final dos stages e mantenha as fases já existentes.

**.gitlab-ci.yml · stage final**

```yaml
stages:
  - validate
  - test
  - package
  - deploy
  - verify
```

Acrescente o *smoke test* após os deploys. O uso de `--fail` faz um erro HTTP resultar em falha do job. Salvar o HTML antes de pesquisá-lo mantém as duas verificações separadas e visíveis. O job aguarda a publicação do front, que já depende da API. Ele testa os endpoints públicos sem gravar dados.

**.gitlab-ci.yml · smoke_production**

```yaml
smoke_production:
  stage: verify
  image:
    name: curlimages/curl:8.15.0
    entrypoint: ['']
  needs: [deploy_frontend]
  script:
    - curl --fail --silent --show-error --retry 5 "$API_URL/health"
    - curl --fail --silent --show-error "$FRONTEND_URL" -o home.html
    - grep -q 'Duelo de Cartas' home.html
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'
```

Acrescente o job de seed depois do smoke test. A opção `when: manual` exige acionar o job; `allow_failure: true` permite que pipelines futuros terminem sem recriar usuários. É necessário conferir o resultado do seed na primeira execução, mesmo se os jobs automáticos estiverem verdes. O job instala apenas dependências de execução da API e verifica que nenhum endpoint local foi configurado.

**.gitlab-ci.yml · seed_production_user**

```yaml
seed_production_user:
  stage: verify
  image: node:22-alpine
  interruptible: false
  needs: [smoke_production]
  before_script:
    - cd backend
    - npm ci --omit=dev
  script:
    - test -z "$DYNAMODB_ENDPOINT" # Seed público não pode usar banco local.
    - npm run db:seed
  environment:
    name: production/bootstrap
    action: prepare
  when: manual
  allow_failure: true # O bootstrap é opcional após a primeira criação.
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'
```

![Pipeline final: qualidade antes da implantação](img/fig-25.webp)

*Stages controlam as fases; needs explicita pacote e ordem entre os jobs de implantação.*

**Computador local · terminal na raiz · versão C13**

```bash
git add .gitlab-ci.yml
git commit -m "ops: verifica endpoints e cria usuario inicial"
git push
```

Aguarde o smoke test passar. No mesmo pipeline, execute manualmente `seed_production_user`. O log deve indicar usuário criado ou já existente. Se aparecer `AccessDenied`, confira sessão, região, nomes de tabela e permissões da identidade do runner. Não transforme uma falha de seed em criação manual de senha em texto puro no DynamoDB.

### Validar o fluxo completo no navegador

1. Abra o website endpoint do S3, por HTTP.
2. Tente uma senha incorreta e confira a mensagem genérica de autenticação.
3. Entre com `SEED_EMAIL` e a senha definida no GitLab.
4. Jogue três rodadas; recarregue a página e confira placar e histórico persistidos.
5. Em **Network**, confira respostas JSON e o cabeçalho `Authorization` nas rotas protegidas. Não deve aparecer `passwordHash` ou segredo em respostas.
6. Exclua o histórico; após concluir, recarregue e confirme a ausência de rodadas e o ajuste dos contadores.
7. Saia. O acesso ao painel deve levar ao login; requisições sem token para rotas protegidas devem receber 401.

O health check verifica somente o processo. O login confirma acesso ao usuário e ao segredo; jogar e consultar confirmam persistência; excluir confirma o caminho de remoção. Essas verificações observam responsabilidades diferentes e não devem ser substituídas por uma única URL que retorna 200.

## Operação, diagnóstico e evolução
Duration: 15:00

### Retomar uma sessão

Inicie o Learner Lab e aguarde disponibilidade. Atualize access key, secret key e session token no GitLab. Confira o estado do ambiente Beanstalk e as tabelas. Só depois faça o push ou execute **Run pipeline** na branch `main`. Recursos podem permanecer armazenados enquanto sessões mudam; processos e instâncias podem ser interrompidos ou sujeitos às políticas do laboratório.

Para retomar o ambiente local, inicie Docker, o banco e a API. O comando de criação é seguro para tabelas locais já existentes. Em outro terminal na raiz, inicie o servidor estático.

**Computador local · raiz de duelo-cartas**

```bash
docker compose up -d
cd backend
npm run db:create
npm start
```

**Computador local · outro terminal na raiz · front local**

```bash
npx --yes http-server@14.1.1 frontend -a 127.0.0.1 -p 8080 -c-1
```

### Branches, revisão e rollback

Uma branch permite modificar o código sem alterar diretamente a versão publicada. Crie uma branch, edite e execute as verificações apropriadas. Depois, envie-a e abra um *merge request* no GitLab. Pelas regras do pipeline, branches comuns executam validação e testes; somente a branch padrão publica.

**Computador local · raiz de duelo-cartas**

```bash
git switch -c feature/melhora-acessibilidade
# Após editar e verificar as alterações:
git add frontend
git commit -m "front: melhora navegacao por teclado"
git push -u origin feature/melhora-acessibilidade
```

Após o merge, retorne à branch principal e sincronize seu conteúdo. Para desfazer uma mudança já publicada, um *revert* cria um novo commit que inverte a alteração, preservando o histórico; substitua o identificador pelo commit real que precisa ser revertido.

**Computador local · raiz de duelo-cartas**

```bash
git switch main
git pull --ff-only
# Execute apenas quando houver uma alteração específica a desfazer:
git revert HASH_DO_COMMIT
git push
```

Para uma reversão imediata da API pelo Console AWS, abra **Elastic Beanstalk > Application versions**, selecione uma versão anterior conhecida e implante no ambiente. Depois alinhe o repositório com a correção para que o próximo pipeline não publique novamente o defeito. Não edite objetos do front pelo Console como solução permanente.

<aside class="positive">

**No mercado.** Logs profissionais usam eventos estruturados e identificadores de correlação. Métricas de latência, taxa de erros e disponibilidade permitem detectar regressões após uma liberação. Tokens, senhas e valores de segredos não pertencem aos logs. Rollback de código também precisa considerar compatibilidade com o estado dos dados.

</aside>

### Diagnóstico por sintoma

| Sintoma | Causa possível | Verificação |
| --- | --- | --- |
| Job Pending | Runner, cota ou tags | Confira runners habilitados, computação disponível e ausência de tags não atendidas. |
| ExpiredToken | Credenciais da sessão anterior | Renove as três variáveis AWS da mesma sessão; execute novo pipeline. |
| `npm ci` falha | Manifesto e lockfile divergentes | Execute `npm install` na pasta correta, teste e envie manifesto e lockfile juntos. |
| ECONNREFUSED | Banco ainda indisponível ou endereço errado | No host use `127.0.0.1:8000`; no CI use `dynamodb:8000`. Confira logs e a espera de prontidão. |
| Erro de chave no DynamoDB | Esquema da tabela incorreto | Compare nome, tipo e capitalização de `email`, `userId` e `roundId`. |
| 403 no website S3 | Política, bloqueio público ou objeto ausente | Confira endpoint de website, objeto `index.html`, `GetObject` e ARN do bucket. |
| CORS no navegador | Origem diferente da lista | Compare protocolo, host e porta exatamente; remova barra final do valor configurado. |
| Login retorna 400 | Corpo ou dados inválidos | Confira JSON, tipos, formato do e-mail e limites da senha. |
| Login retorna 401 | Credenciais incorretas | Confirme que o seed ocorreu nesse banco e que não se espera trocar senha ao repetir o seed. |
| Login retorna 500 | Banco ou segredo indisponível | No Console AWS, confira os logs do ambiente Beanstalk e o segredo no Secrets Manager. |
| Beanstalk retorna 502 | Processo web não iniciou | Confira Procfile, `npm start`, logs de instalação, Node 22 e uso de `PORT`. |
| Deploy Ready, mas falhou | Rollback da versão | Compare o rótulo desejado ao `VersionLabel` real; leia o primeiro erro em Events. |
| Histórico ou placar parcial | Operação interrompida | Releia os dados. A exclusão pode ser repetida; cada rodada e contador são alterados juntos. |
| Front chama localhost | Configuração pública não foi gerada | Confira o artefato `public` e o `config.js` no S3; execute pacote e deploy do mesmo pipeline. |

### Encerrar os recursos do projeto

Quando o ambiente não for mais necessário, confirme os nomes antes de excluir recursos. Termine o ambiente Beanstalk e aguarde sua remoção; depois remova a aplicação sem ambientes ativos. Esvazie e exclua somente os dois buckets do projeto, remova as tabelas correspondentes e programe a exclusão do segredo. Retire credenciais e variáveis sensíveis do GitLab. Recursos de armazenamento, segredos e endereços podem ter ciclo de cobrança diferente do processo web.

Localmente, `docker compose down` encerra o banco preservando o volume. Se a intenção for apagar os dados locais, use a opção `-v` já apresentada. Encerrar o servidor estático e a API exige **Ctrl+C** em seus terminais.

## Parabéns!
Duration: 5:00

Você construiu o Duelo de Cartas de ponta a ponta: front responsivo, API autenticada, persistência com transações e um pipeline GitLab que valida, testa, empacota, implanta e verifica a aplicação na AWS.

### Exercícios

1. Calcule e exiba a taxa de vitórias, com uma casa decimal. Defina o resultado para zero rodadas e teste os casos de borda.
2. Acrescente um teste para o resultado de derrota e verifique que as 52 identidades do baralho continuam únicas.
3. Implemente paginação do histórico usando `LastEvaluatedKey`. A API deve devolver um cursor opaco, validado e associado ao usuário autenticado; a interface não deve repetir itens.
4. Projete uma identidade estável de usuário independente do e-mail. Descreva a mudança das chaves e uma estratégia para dados já existentes.
5. Implemente uma chave de idempotência para `POST /api/rounds`. Reenvios com a mesma chave devem recuperar o mesmo resultado; cargas diferentes com a mesma chave devem ser rejeitadas.
6. Crie testes com dois usuários e demonstre que consultar, criar e excluir rodadas de um não altera os dados do outro.
7. Simule falhas durante a exclusão de histórico. Verifique que os contadores correspondem às rodadas remanescentes e que a operação pode ser concluída ao repetir a chamada.
8. Adapte o pipeline para um ambiente de homologação separado, com tabelas, segredo, bucket e ambiente Beanstalk próprios. Defina os escopos das variáveis e as regras de promoção.
9. Proponha uma implantação HTTPS com S3 privado e CloudFront, além de TLS na API. Compare `sessionStorage` com sessão em cookie considerando XSS, CSRF e expiração.
10. Adicione logs estruturados com identificador de requisição e testes que impeçam a exposição de senha, hash, JWT ou credenciais AWS. Explique quais sinais indicariam uma regressão após deploy.

### Referências

* OPENJS FOUNDATION. [ESLint: version support](https://eslint.org/version-support/).
* AMAZON WEB SERVICES. [Types of cloud computing](https://aws.amazon.com/types-of-cloud-computing/).
* AMAZON WEB SERVICES. [Regions and Zones](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html).
* MDN CONTRIBUTORS. [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods).
* MDN CONTRIBUTORS. [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status).
* MDN CONTRIBUTORS. [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS).
* OPENJS FOUNDATION. [Node.js: environment variables](https://nodejs.org/api/environment_variables.html).
* AMAZON WEB SERVICES. [Configuring custom start commands with a Procfile on Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/nodejs-configuration-procfile.html).
* AMAZON WEB SERVICES. [Buildfile and Procfile](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/platforms-linux-extend.build-proc.html).
* AMAZON WEB SERVICES. [Best practices for using sort keys to organize data](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-sort-keys.html).
* AMAZON WEB SERVICES. [Querying tables in DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html).
* AMAZON WEB SERVICES. [Configuring a static website on Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html).
* AMAZON WEB SERVICES. [Website endpoints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html).
* AMAZON WEB SERVICES. [Using the Elastic Beanstalk Node.js platform](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.container.html).
* AMAZON WEB SERVICES. [Core components of Amazon DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html).
* AMAZON WEB SERVICES. [DynamoDB local usage notes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.UsageNotes.html).
* AMAZON WEB SERVICES. [Amazon DynamoDB transactions: how it works](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html).
* AMAZON WEB SERVICES. [AWS SDK for JavaScript v3 Developer Guide](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html).
* BOOTSTRAP TEAM. [Bootstrap 5.3: documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/).
* DOCKER. [What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)
* DOCKER. [What is an image?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/)
* OPENJS FOUNDATION. [Express: error handling](https://expressjs.com/en/guide/error-handling/).
* GITLAB. [GitLab CI/CD variables](https://docs.gitlab.com/ci/variables/).
* GITLAB. [Services](https://docs.gitlab.com/ci/services/).
* GITLAB. [Resource groups](https://docs.gitlab.com/ci/resource_groups/).
* GITLAB. [Deployment safety](https://docs.gitlab.com/ci/environments/deployment_safety/).
* OWASP FOUNDATION. [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
* OWASP FOUNDATION. [HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html).
