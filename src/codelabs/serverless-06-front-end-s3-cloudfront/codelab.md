summary: Implante no Amazon S3 a aplicação Front End em React que consome a API de livros, configurando o bucket como site estático, com política de leitura pública e CORS. Depois, distribua o site por uma CDN com o Amazon CloudFront.
id: serverless-06-front-end-s3-cloudfront
categories: AWS,Serverless,Node.js
tags: aws,serverless,s3,cloudfront,cdn,react,site-estatico,bucket-policy,cors
status: Published
authors: Rodrigo Bossini
last updated: 2023-09-20
pdf: topicos_avancados_em_backend/06_apostila_aws_serverless.pdf
exercicios: topicos_avancados_em_backend/06_exercicio_aws_serverless.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# AWS Serverless 06: Front End no S3 e CDN com CloudFront

## Visão geral
Duration: 3:00

Neste material, prosseguimos com o desenvolvimento da solução retratada a seguir.

![Arquitetura da solução: páginas no S3, autenticação com Cognito, API Gateway, função Lambda e tabela no DynamoDB](img/p001-1.webp)

*A solução que estamos desenvolvendo.*

Lembre-se que temos interesse na seguinte API (coleção de endpoints).

| Endpoint | Finalidade |
| --- | --- |
| `POST /livros` | cadastrar um livro novo |
| `GET /livros` | obter todos os livros |
| `GET /livros/{id}` | obter um livro pelo seu id |
| `PUT /livros/{id}` | atualizar um livro pelo seu id |
| `DELETE /livros/{id}` | apagar um livro pelo seu id |

Neste material, vamos implantar uma versão da aplicação Front End que utiliza apenas os endpoints

* `GET /livros` (obter todos os livros)
* `GET /livros/{id}` (obter um livro pelo seu id)

### O que você vai aprender

* As principais características do **Amazon S3** e suas classes de armazenamento
* Como gerar o build de produção de uma aplicação React
* Como criar um bucket no S3 e configurá-lo como **servidor web de conteúdo estático**
* Como escrever uma **bucket policy** de leitura pública e uma configuração de **CORS**
* Como fazer upload dos arquivos do Front End e acessar o site
* O que é uma **CDN** e como criar uma distribuição no **Amazon CloudFront**

### O que você vai precisar

* Uma conta na AWS com acesso ao console
* O Back End dos materiais anteriores (API Gateway + Lambda + DynamoDB), de preferência em execução
* **Git**, **Node.js/npm** e o **VS Code** instalados

## Amazon S3
Duration: 10:00

A implantação do Front End será realizada utilizando-se o **AWS S3**. Veja algumas características sobre ele.

* **Modelo de Dados de Objeto:** o S3 armazena dados como objetos dentro de "buckets". Um objeto consiste em dados, um ID exclusivo e metadados.
* **Durabilidade e Disponibilidade:** o S3 oferece uma durabilidade de 99,999999999% (11 9's) e garante 99,99% de disponibilidade durante um ano.
* **Classes de Armazenamento:** o S3 oferece várias classes de armazenamento, incluindo STANDARD, INTELLIGENT_TIERING, ONEZONE_IA, GLACIER e GLACIER_DEEP_ARCHIVE. Cada classe tem seu próprio preço e uso recomendado com base na frequência de acesso e no período de retenção dos dados.

### Classes de armazenamento

Veja uma descrição sobre as classes de armazenamento.

**S3 Standard (STANDARD)**

* **Uso:** projetado para uso geral e armazenamento de dados frequentemente acessados.
* **Durabilidade:** 99,999999999% (11 9's) ao longo de um ano.
* **Disponibilidade:** 99,99% ao longo de um ano.
* **Recuperação:** recuperação em tempo real.
* **Custo:** geralmente maior do que os demais.

**S3 Intelligent-Tiering (INTELLIGENT_TIERING)**

* **Uso:** ideal para dados com padrões de acesso desconhecidos ou que mudam com o tempo.
* **Durabilidade:** 99,999999999%.
* **Disponibilidade:** 99,9%.
* **Recuperação:** em tempo real.
* **Custo:** taxas de monitoramento e automação são aplicadas, mas geralmente é mais barato do que o STANDARD para dados com padrões de acesso variáveis.

**S3 Standard-Infrequent Access (STANDARD_IA)**

* **Uso:** para dados menos acessados, mas que ainda precisam de recuperação rápida quando necessários.
* **Durabilidade:** 99,999999999%.
* **Disponibilidade:** 99,9%.
* **Recuperação:** em tempo real.
* **Custo:** menor custo de armazenamento por GB em comparação com o STANDARD, mas com taxas de recuperação.

**S3 One Zone-Infrequent Access (ONEZONE_IA)**

* **Uso:** para dados que podem ser recriados e são acessados com menos frequência, mas que ainda precisam de recuperação rápida.
* **Durabilidade:** 99,999999999%, mas armazenados em apenas uma zona de disponibilidade, portanto, menos resiliência a falhas em comparação com outras classes.
* **Disponibilidade:** 99,5%.
* **Recuperação:** em tempo real.
* **Custo:** menor do que o STANDARD_IA, pois utiliza apenas uma zona.

**S3 Glacier (GLACIER)**

* **Uso:** arquivamento de dados de longo prazo que podem tolerar tempo de recuperação de algumas horas.
* **Durabilidade:** 99,999999999%.
* **Disponibilidade:** não é imediata; a recuperação leva de alguns minutos a várias horas.
* **Recuperação:** de minutos a horas, dependendo do nível de recuperação escolhido.
* **Custo:** muito mais baixo do que classes de armazenamento em tempo real, mas com taxas de recuperação.

**S3 Glacier Deep Archive (GLACIER_DEEP_ARCHIVE)**

* **Uso:** arquivamento de dados de longo prazo que são acessados muito raramente.
* **Durabilidade:** 99,999999999%.
* **Disponibilidade:** não é imediata; a recuperação leva cerca de 12 horas.
* **Recuperação:** em torno de 12 horas.
* **Custo:** a classe de armazenamento mais barata no S3, mas com taxas de recuperação.

Estas classes permitem que os usuários otimizem custos, mantendo a durabilidade e disponibilidade necessárias para seus dados. Ao escolher uma classe de armazenamento, é importante considerar a frequência de acesso, o tempo de retenção desejado e o orçamento disponível.

### Outros recursos

* **Modelo de Segurança:** você pode controlar o acesso aos buckets e objetos usando a AWS Identity and Access Management (IAM), controlar o acesso público e usar políticas de bucket. Além disso, oferece recursos de criptografia para proteger os dados em trânsito e em repouso.
* **Transfer Acceleration:** esta funcionalidade usa a rede global da Amazon CloudFront para acelerar os uploads e downloads de objetos para e do S3. Como veremos, funciona como um CDN.
* **Versionamento:** permite preservar, recuperar e restaurar todas as versões de todos os objetos em um bucket. Isso é útil para recuperação de desastres e histórico.
* **Eventos:** é possível configurar notificações para serem acionadas em resposta a determinados eventos no S3, como a criação ou exclusão de objetos.
* **Replicação:** você pode configurar a replicação automática e assíncrona de objetos para um bucket diferente, potencialmente em uma região AWS diferente.
* **Hospedagem de Sites Estáticos:** os buckets do S3 podem ser configurados para hospedar sites estáticos sem a necessidade de servidores web tradicionais.

## Obtendo a aplicação Front End
Duration: 10:00

A aplicação Front se encontra no seguinte repositório no Github

[https://github.com/professorbossini/pessoal_react_aws_livros](https://github.com/professorbossini/pessoal_react_aws_livros)

Crie uma pasta vazia para você e vincule o VS Code a ela clicando em **File >> Open Folder**. Depois disso, abra um terminal interno dele com **Terminal >> New Terminal**. No terminal, use

**Terminal**

```bash
git clone https://github.com/professorbossini/pessoal_react_aws_livros.git .
```

para clonar o repositório. Para testar a aplicação localmente, comece baixando as dependências com

**Terminal**

```bash
npm install
```

E execute com

**Terminal**

```bash
npm start
```

Observe que a aplicação já "vem" com uma URL de Back End fixa. A ideia é que você possa encaixar a sua URL ali para testar o seu Back End. Clique em **Obter todos** para visualizar a lista de livros atual.

![Aplicação de livros em execução, com campos de id, título, edição e autor, botões Cadastrar, Atualizar, Remover, Obter pelo id e Obter todos, a URL do Back End e a lista de livros destacada](img/p005-1.webp)

*A aplicação exibindo a lista de livros depois de clicar em Obter todos.*

<aside class="negative">

**Cuidado.** É possível que a API cujo link de acesso vem fixo no código não esteja disponível quando você tentar fazer o teste.

</aside>

### Gerando o build

Uma aplicação React executa puramente no Front End. Observe como, em ambiente de desenvolvimento, ela possui uma estrutura própria para esse ambiente.

![Explorer do VS Code com a estrutura do projeto livros-app: node_modules, public, src com App.css, App.js e index.js, .gitignore, package-lock.json, package.json e README.md](img/p005-2.webp)

*A estrutura do projeto em ambiente de desenvolvimento.*

Ocorre que o navegador apenas "entende" HTML, CSS, Javascript e arquivos de recursos como áudio, vídeo etc. Assim, quando a aplicação está pronta para ser implantada, executamos um script que produz esse conteúdo em função daquilo que foi desenvolvido. No caso de uma aplicação React, o comando é

**Terminal**

```bash
npm run build
```

Observe como este comando criou uma pasta chamada `build`.

![Explorer do VS Code com a nova pasta build destacada, contendo static, asset-manifest.json, favicon.ico, index.html, logos, manifest.json e robots.txt](img/p006-1.webp)

*A pasta `build` gerada pelo comando.*

Esta coleção de arquivos é a nossa aplicação Front End. Agora vamos configurar um ambiente no AWS S3 para fazer a sua implantação. Como você verá, será tão simples quanto copiar e colar todos esses arquivos.

## Configurando um bucket no S3
Duration: 10:00

A fim de implantar a aplicação, vamos criar um **Bucket** no S3. Um Bucket pode ser utilizado para armazenar arquivos e também pode ser configurado para operar como um servidor web de conteúdo estático.

Na página inicial do S3, clique em **Create bucket**.

![Página inicial do Amazon S3 com o botão Create bucket](img/p006-2.webp)

*A página inicial do Amazon S3.*

Comece escolhendo um nome para o seu Bucket.

![Formulário Create bucket com o campo Bucket name preenchido com livros-pdfs e destacado](img/p007-1.webp)

*O nome do bucket.*

Ajuste as configurações de permissão de acesso como a seguir. Em particular, quando desmarcamos **Block all public access**, estamos permitindo que o bucket seja acessado externamente. Entretanto, também precisaremos dizer explicitamente como o seu conteúdo pode ser acessado (talvez em modo de leitura ou modo de escrita).

![Configurações do bucket com ACLs disabled selecionado, todas as opções de Block Public Access desmarcadas e a caixa de reconhecimento do aviso marcada, todos destacados](img/p009-2.webp)

*ACLs desabilitadas, Block all public access desmarcado e o aviso reconhecido.*

Mantenha as demais opções com seu valor padrão e clique em **Create bucket**.

![Final do formulário, com Tags, Default encryption e Advanced settings nos valores padrão e o botão Create bucket destacado](img/p009-1.webp)

*Criando o bucket.*

### Habilitando o site estático

Na tela resultante, clique no nome do seu bucket para ajustar as suas configurações.

![Lista de buckets com o bucket livros-pdfs destacado](img/p010-1.webp)

*Abra o seu bucket.*

No momento, nosso bucket apenas serve para armazenar arquivos. Ele ainda não opera como um servidor Web estático. Vamos ajustar isso. Comece clicando em **Properties**.

![Página do bucket livros-pdfs com a aba Properties destacada](img/p011-1.webp)

*A aba Properties.*

Role a página até encontrar a opção **Static website hosting** e clique em **Edit**.

![Seção Static website hosting da aba Properties com o botão Edit destacado](img/p011-2.webp)

*Editando a hospedagem de site estático.*

Marque a opção **Enable**. Preencha o campo **Index document** com `index.html` (esse é o nome do arquivo inicial gerado quando fizemos o build da nossa aplicação) e clique em **Save changes**.

![Formulário Edit static website hosting com a opção Enable e o campo Index document preenchido com index.html destacados](img/p012-1.webp)

*Habilitando o site estático com `index.html` como documento inicial.*

## Política de acesso e CORS
Duration: 10:00

No próximo passo, vamos configurar permissões de acesso aos objetos dentro do Bucket. Veja um trecho da documentação a esse respeito.

> **Bucket policies**
>
> "With Amazon S3 bucket policies, you can secure access to objects in your buckets, so that only users with the appropriate permissions can access them. You can even prevent authenticated users without the appropriate permissions from accessing your Amazon S3 resources."

Leia mais em

[https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html)

Neste exemplo, vamos dizer que todos os objetos do bucket têm acesso "somente leitura". Clique em **Permissions**.

![Página do bucket com a aba Permissions destacada](img/p013-1.webp)

*A aba Permissions.*

Encontre o campo **Bucket policy** e clique em **Edit**.

![Seção Bucket policy com o botão Edit destacado](img/p013-2.webp)

*Editando a bucket policy.*

Agora adicione o seguinte conteúdo.

**Bucket policy**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::livros-pdfs/*"
    }
  ]
}
```

<aside class="negative">

**Cuidado.** Lembre-se de especificar o nome do seu bucket no valor de `Resource` (no exemplo, `livros-pdfs`).

</aside>

Veja uma explicação para cada chave deste objeto JSON que define a policy.

* **Version:** versão da linguagem de política que estamos utilizando. É importante pois, ao longo do tempo, novas versões podem ser liberadas e seu funcionamento pode ser diferente.
* **Statement:** fica associado a uma coleção de declarações. Cada declaração é um objeto que caracteriza uma permissão.
* **Sid:** significa *Statement Id* e é opcional. É uma espécie de rótulo que pode te ajudar a lembrar sobre a razão de ser deste statement.
* **Effect:** especifica se este objeto define permissão ou negação de acesso. Os valores possíveis são `allow` e `deny`.
* **Principal:** especifica quais usuários estão envolvidos nesta declaração. O asterisco indica todos, autenticados ou não.
* **Action:** ação para a qual a permissão está sendo especificada. Valores possíveis são: `s3:CreateBucket`, `s3:DeleteBucket`, `s3:GetObject`, `s3:DeleteObject`. E assim por diante. Observe que temos ações envolvendo o bucket e ações que envolvem objetos dentro do bucket.
* **Resource:** qual recurso está envolvido nesta declaração. ARN vem de *Amazon Resource Name* e a notação `arn:aws:s3:::` é um padrão Amazon para identificar recursos do S3.

Quando terminar, clique em **Save changes**.

### CORS

A seguir, role a página e encontre a opção para configuração de **CORS**. Clique em **Edit**.

![Seção Cross-origin resource sharing (CORS) da aba Permissions com o botão Edit destacado](img/p015-2.webp)

*Editando a configuração de CORS.*

Use o seguinte objeto JSON para liberar o acesso sem restrições.

**Configuração de CORS**

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"]
  }
]
```

Veja uma explicação para cada chave neste objeto JSON. Em qualquer caso, o asterisco simboliza "tudo".

* **AllowedHeaders:** quais cabeçalhos podem estar presentes na requisição. Valores possíveis são "Authentication", "Content-type" e assim por diante.
* **AllowedMethods:** quais métodos do protocolo HTTP podem ser usados.
* **AllowedOrigins:** a partir de quais origens requisições podem ser atendidas. Lembrando que uma origem é caracterizada pelo protocolo, host e porta.

Clique em **Save changes**.

## Upload dos arquivos e teste
Duration: 8:00

Para fazer o upload dos arquivos da sua aplicação, volte à aba **Objects**. Observe que o campo inferior permite que você arraste e solte arquivos.

![Aba Objects do bucket, vazia, com a área para arrastar e soltar arquivos destacada](img/p017-1.webp)

*A área de upload da aba Objects.*

Arraste e solte os arquivos da sua pasta `build`. Não arraste a pasta, apenas o seu conteúdo.

![Conteúdo da pasta build selecionado no VS Code sendo arrastado até a área de upload do S3](img/p017-2.webp)

*Arraste o conteúdo da pasta `build`, não a pasta.*

Observe que o ambiente mostra a lista de arquivos que vai fazer parte do upload. Clique em **Upload**.

![Página Upload com a lista de arquivos e pastas a enviar destacada e o botão Upload](img/p018-1.webp)

*Os arquivos que farão parte do upload.*

Quando terminar, clique em **Close**.

![Página de status do upload concluído com sucesso e o botão Close](img/p019-1.webp)

*Upload concluído.*

Clique na aba **Properties** novamente. Agora vamos encontrar o link do nosso app.

![Página do bucket com a aba Properties destacada](img/p019-2.webp)

*Volte à aba Properties.*

Role a página até encontrá-lo. Geralmente é uma das últimas opções.

![Seção Static website hosting com o link Bucket website endpoint destacado](img/p020-1.webp)

*O endereço do site estático em Bucket website endpoint.*

Visite o link no seu navegador e veja se deu tudo certo.

![Aplicação de livros aberta no navegador a partir do endereço s3-website do bucket](img/p021-1.webp)

*A aplicação servida pelo S3.*

Se o Back End estiver em execução, deve ser possível obter a lista completa de livros.

![Aplicação servida pelo S3 exibindo a lista de livros depois de clicar em Obter todos](img/p022-1.webp)

*Obtendo todos os livros.*

![Aplicação com o id 1 digitado e os dados do livro Concrete Mathematics, de Donald Knuth, preenchidos depois de clicar em Obter pelo id](img/p023-1.webp)

*Obtendo um livro pelo id.*

## CDN com AWS CloudFront
Duration: 6:00

> **CDN (Content Delivery Network)**
>
> Coleção de servidores espalhados geograficamente responsáveis por entregar ao cliente determinado conteúdo.

A ideia é que todos os servidores sejam capazes de entregar o mesmo conteúdo e que o usuário final seja atendido pelo servidor que estiver mais próximo dele geograficamente, o que tende a diminuir a **latência** (tempo de espera entre a requisição e a resposta). Veja uma figura. A ideia que ela passa é que há diferentes grupos de usuários em diferentes regiões. Cada grupo é atendido por um servidor do CloudFront diferente. Observe que há também outros recursos que podem ser usados, como um Firewall e Caching.

![Diagrama do CloudFront: tráfego de usuários chega à AWS Edge Location mais próxima (Amazon CloudFront e CloudFront Functions), protegida por AWS Shield e AWS WAF, passa pelos Regional Edge Caches e pelo Origin Shield até a origem do conteúdo (S3, EC2, API Gateway etc.)](img/p024-1.webp)

*Como o CloudFront entrega conteúdo a usuários de diferentes regiões.*

<aside class="positive">

**Nota.** O **AWS Shield** que aparece na figura é um serviço de segurança focado em ataques **DDoS (Distributed Denial of Service)**, que são requisições (geralmente milhões ou bilhões por segundo) enviadas ao servidor com o intuito de esgotar seus recursos, inviabilizando o seu funcionamento.

O **AWS Web Application Firewall** opera na camada de aplicação. Ele nos protege de ataques como **XSS (Cross Site-Scripting)**, que ocorre quando uma página incorpora trechos de outro ambiente (outra página, outra origem etc) e este contém código Javascript malicioso que executa sem o usuário saber, e **SQL Injection**, que funciona da mesma forma, porém é código SQL incluído numa string que pode ser interpretado e executado pelo servidor.

</aside>

Veja algumas vantagens que o AWS CloudFront traz.

* **Desempenho:** tempo de latência reduzido, pela possibilidade de um dos servidores estar mais próximo do usuário final.
* **Redundância e disponibilidade:** como existem muitos servidores, a falha de um não compromete o funcionamento do sistema como um todo.
* **Distribuição de carga:** como existem muitos servidores, nenhum deles fica sobrecarregado.
* **Atualização e manutenção de conteúdo:** quando o conteúdo a ser entregue ao usuário final tiver de ser atualizado, o desenvolvedor pode fazê-lo em um único ponto. O AWS CloudFront possui um mecanismo de "invalidação", que instrui os servidores a obterem nova cópia atualizada junto à origem do recurso.

É comum que serviços de streaming, como o Netflix e o Amazon Prime, utilizem serviços de CDN. Frameworks CSS, como o Bootstrap, também costumam ser disponibilizados por meio de uma CDN.

## Criando uma distribuição no CloudFront
Duration: 12:00

Para utilizar o AWS CloudFront, vamos criar uma **distribuição**. Trata-se de uma coleção de configurações em que especificamos a origem dos recursos (o bucket S3 neste caso) e outras coisas, como questões de segurança e outras funcionalidades oferecidas por ele. Comece visitando a sua página no console.

Comece clicando em **Create distribution**. Talvez a sua tela seja um pouco diferente mas você deverá ver esta opção.

![Página Distributions do CloudFront com o botão Create distribution destacado](img/p025-1.webp)

*Criando uma distribuição.*

Clique no campo **Origin domain** e escolha seu bucket S3.

![Seção Origin com o campo Origin domain e o bucket livros-pdfs.s3.amazonaws.com na lista, destacados](img/p025-2.webp)

*Escolha o bucket S3 como origem.*

Caso ela apareça, clique para utilizar a recomendação da Amazon, que sugere que utilizemos a URL do site e não aquela direta do bucket S3.

![Aviso informando que o bucket tem hospedagem de site estático habilitada, com o botão Use website endpoint destacado](img/p026-1.webp)

*Use o endpoint do site em vez do endereço direto do bucket.*

Há algumas razões técnicas sutis para isso sobre as quais não falaremos no momento.

Vá rolando a página. Quando chegar em **Allowed HTTP methods**, faça os seguintes ajustes: escolha **GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE** e, em **Cache HTTP methods**, marque **OPTIONS**.

![Opções Allowed HTTP methods com GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE selecionado e a caixa OPTIONS de Cache HTTP methods marcada, ambos destacados](img/p026-2.webp)

*Métodos HTTP permitidos e cache do método OPTIONS.*

<aside class="positive">

**Nota.** Quando fazemos cache do método OPTIONS, estamos dizendo que o navegador pode fazer uma única requisição OPTIONS e, nas próximas, o resultado já estará em cache, sem ter de ser "recalculado", ou seja, obtido junto ao servidor.

</aside>

Role um pouco mais a página e escolha não utilizar o **WAF**. Ele tem um preço alto e não o utilizaremos no momento.

![Seção Web Application Firewall (WAF) com a opção Do not enable security protections selecionada e destacada](img/p027-1.webp)

*Não habilite o WAF.*

Observe que você pode escolher regiões do mundo onde deseja ter servidores do CloudFront. Mantenha as opções com seu valor padrão e clique em **Create distribution**.

![Configurações da distribuição com a seção Price class destacada, mostrando a opção Use all edge locations selecionada, e o botão Create distribution destacado](img/p027-2.webp)

*Em Price class você escolhe as regiões atendidas; mantenha o padrão.*

Na tela a seguir você já terá acesso a uma URL para acesso ao seu site por meio do CloudFront. Seu status deverá ser **deploying**. Pode demorar alguns minutos até que o conteúdo fique acessível.

![Detalhes da distribuição recém-criada com o Distribution domain name e o status Deploying destacados](img/p028-1.webp)

*A URL da distribuição e o status Deploying.*

Aguarde alguns minutos e faça um teste no seu navegador.

![Aplicação de livros aberta no navegador pelo endereço cloudfront.net da distribuição](img/p029-1.webp)

*A aplicação servida pelo CloudFront.*

## Exercícios
Duration: 40:00

A aplicação a seguir foi implementada com Flutter.

[https://github.com/professorbossini/pessoal_flutter_aws_livros.git](https://github.com/professorbossini/pessoal_flutter_aws_livros.git)

1. Faça deploy dela no S3.

   Para fazer build, você pode executar

   **Terminal**

   ```bash
   flutter build web
   ```

   Entretanto, pode ser o caso de seu ambiente não ter o flutter instalado. Por esta razão, o repositório já inclui o build para web pronto. Encontre-o na pasta `build`.

2. Crie uma distribuição para seu app usando o AWS CloudFront.

3. Faça novo deploy no S3, depois de atualizar a URL de Back End padrão, utilizando a sua. Se você tiver o ambiente flutter disponível e puder fazer novo build, ajuste a URL no código fonte da aplicação e faça novo build. Caso contrário, nos arquivos de build, encontre onde fica a URL de Back End e troque lá mesmo.

## Encerramento
Duration: 3:00

Parabéns! Você publicou o Front End da API de livros como um site estático no Amazon S3, com política de leitura pública e CORS, e o distribuiu mundialmente por meio de uma CDN com o Amazon CloudFront.

### Referências

1. Amazon Web Services (AWS) - Cloud Computing Services. 2023. Disponível em [https://aws.amazon.com/](https://aws.amazon.com/). Acesso em setembro de 2023.
2. PiCloud Launches Serverless Computing Platform To The Public | TechCrunch. 2023. Disponível em [https://techcrunch.com/2010/07/19/picloud-launches-serverless-computing-platform-to-the-public/](https://techcrunch.com/2010/07/19/picloud-launches-serverless-computing-platform-to-the-public/). Acesso em setembro de 2023.
3. Serverless Architectures. 2023. Disponível em [https://martinfowler.com/articles/serverless.html](https://martinfowler.com/articles/serverless.html). Acesso em setembro de 2023.
4. Who coined the term 'serverless'?. 2023. Disponível em [https://www.quora.com/Who-coined-the-term-serverless](https://www.quora.com/Who-coined-the-term-serverless). Acesso em setembro de 2023.
