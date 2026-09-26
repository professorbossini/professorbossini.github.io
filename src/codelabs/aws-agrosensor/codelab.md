summary: Uma introdução à computação em nuvem e à AWS feita com as mãos no console. Em sete fases, um sistema de telemetria para estufas agrícolas ganha servidor virtual, bancos NoSQL e relacional, armazenamento de objetos, balanceamento de carga, escalonamento automático, monitoramento e camadas de segurança.
id: aws-agrosensor
categories: AWS
tags: aws,ec2,vpc,dynamodb,rds,s3,elb,autoscaling,cloudwatch,sns,iam
status: Published
authors: Rodrigo Bossini
last updated: 2026-09-26
pdf: aws/aws_apostila_agrosensor.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# AWS na Prática: construindo uma arquitetura escalável na nuvem

## Visão geral
Duration: 3:00

Este codelab é uma introdução à **computação em nuvem** e à **Amazon Web Services (AWS)** feita com as mãos no console. Ao longo de sete fases, um pequeno sistema de telemetria para estufas agrícolas, o **AgroSensor**, ganha servidor virtual, banco de dados NoSQL, banco relacional gerenciado, armazenamento de objetos, balanceamento de carga, escalonamento automático, monitoramento e camadas de segurança, até se tornar uma arquitetura distribuída completa.

![Arquitetura final do AgroSensor na AWS](img/fig-12.webp)

*Arquitetura final do AgroSensor, que você vai construir passo a passo.*

### O que você vai aprender

* O que é computação em nuvem, seus modelos de serviço (IaaS, PaaS, SaaS) e de implantação
* Como a AWS se organiza: regiões, zonas de disponibilidade, responsabilidade compartilhada e cobrança
* Como criar redes, grupos de segurança e instâncias **Amazon EC2**
* Como guardar dados no **Amazon DynamoDB** (NoSQL) e no **Amazon RDS** (relacional)
* Como dar permissões sem chaves no código com **AWS IAM**
* Como usar o **Amazon S3** para artefatos e para publicar um site estático
* Como obter alta disponibilidade com **Application Load Balancer** e **EC2 Auto Scaling**
* Como monitorar com **Amazon CloudWatch** e receber alertas pelo **Amazon SNS**
* Como aplicar defesa em profundidade, menor privilégio, criptografia e backups

### O que você vai precisar

* Acesso ao **AWS Academy Learner Lab** e um navegador atualizado
* Um editor de texto no seu computador, como o Visual Studio Code, para criar os arquivos do painel
* Um endereço de e-mail para receber os alertas
* Um lugar para anotar valores que aparecem no caminho: IPs, endereços do banco e do balanceador, senha do banco

<aside class="positive">

**Mantenha um arquivo de anotações.** Crie agora um arquivo de texto chamado `anotacoes.txt` no seu computador. Sempre que o codelab pedir para anotar algo (um IP, um endpoint, uma senha), cole ali. Isso economiza muito tempo entre uma aula e outra.

</aside>

## Computação em nuvem
Duration: 12:00

Imagine uma pequena empresa que acabou de lançar um aplicativo. No primeiro mês, algumas centenas de pessoas o usam; no segundo, uma reportagem na televisão leva cem mil pessoas a baixá-lo na mesma noite. Se o sistema roda em dois servidores comprados e instalados numa sala da empresa, a noite da reportagem vira um pesadelo: o sistema fica lento, cai, e a oportunidade vai embora. Se, por outro lado, a empresa compra vinte servidores "para garantir", passa meses pagando por máquinas paradas.

A computação em nuvem nasceu para resolver exatamente esse dilema. Em vez de comprar e manter o próprio hardware, a empresa aluga recursos computacionais de um provedor, pela internet, na quantidade que precisar e pelo tempo que precisar, pagando apenas pelo que usar.

### O que é computação em nuvem

A definição mais citada, tanto na academia quanto no mercado, é a do NIST, o instituto de padrões e tecnologia do governo norte-americano.

> **Computação em nuvem (NIST)**
>
> Modelo que permite acesso conveniente, sob demanda e pela rede a um conjunto compartilhado de recursos computacionais configuráveis (redes, servidores, armazenamento, aplicações e serviços) que podem ser rapidamente provisionados e liberados com mínimo esforço de gerenciamento ou interação com o provedor.

Duas ideias dessa definição merecem destaque. A primeira é o **sob demanda**: você pede um servidor e ele fica pronto em minutos, sem pedido de compra, sem transportadora, sem instalação física. A segunda é o **rapidamente provisionados e liberados**: assim como se cria, se destrói. É essa capacidade de acompanhar a demanda que a figura a seguir compara com o modelo tradicional.

![Capacidade fixa de um data center próprio comparada à capacidade elástica da nuvem](img/fig-01.webp)

*Capacidade fixa de um data center próprio comparada à capacidade elástica da nuvem.*

No lado esquerdo, a empresa compra capacidade em degraus: durante boa parte do tempo sobra máquina (área hachurada, paga e ociosa) e, pouco antes de cada nova compra, falta máquina (área vermelha, em que o sistema fica lento ou fora do ar). No lado direito, a capacidade acompanha a demanda de perto, para cima e para baixo. Essa propriedade tem nome: **elasticidade**.

### As cinco características essenciais

O NIST lista cinco características que um serviço precisa ter para ser considerado computação em nuvem. Elas vão reaparecer, na prática, em quase todas as fases do projeto.

![As cinco características essenciais da computação em nuvem](img/fig-02.webp)

*As cinco características essenciais da computação em nuvem.*

1. **Autoatendimento sob demanda:** o usuário provisiona recursos sozinho, pelo console ou por API, sem falar com ninguém do provedor.
2. **Amplo acesso pela rede:** os recursos são acessados pela internet, de qualquer dispositivo: navegador, terminal, celular.
3. **Agrupamento de recursos:** o provedor compartilha um grande conjunto de máquinas entre muitos clientes, de forma isolada.
4. **Elasticidade rápida:** recursos aumentam e diminuem conforme a demanda, muitas vezes de forma automática.
5. **Serviço medido:** o uso é medido (horas, GB, requisições) e cobrado de acordo com o consumo.

Repare que nenhuma delas fala de uma tecnologia específica. Nuvem é um **modelo de fornecimento**: virtualização, redes de alta velocidade e automação são os meios que tornam esse modelo possível.

### Modelos de serviço: IaaS, PaaS e SaaS

Nem todo serviço de nuvem entrega a mesma coisa. A diferença está em **quem cuida de cada camada** da pilha de software e hardware. A figura mostra as camadas de um sistema, da rede física até a aplicação, e quem é responsável por cada uma em cada modelo.

![Divisão de responsabilidades nos modelos de serviço](img/fig-03.webp)

*Divisão de responsabilidades nos modelos de serviço.*

> **IaaS — Infraestrutura como Serviço**
>
> O provedor entrega a infraestrutura virtualizada: servidores, discos e redes. Você escolhe e administra o sistema operacional, instala o que quiser e cuida das atualizações. Exemplo: uma máquina virtual no Amazon EC2.

> **PaaS — Plataforma como Serviço**
>
> O provedor entrega uma plataforma pronta para executar código ou guardar dados. Você envia a aplicação e configura parâmetros; sistema operacional, correções e alta disponibilidade ficam com o provedor. Exemplos: AWS Elastic Beanstalk e Amazon RDS.

> **SaaS — Software como Serviço**
>
> O provedor entrega o software pronto, acessado pelo navegador ou por aplicativo. Você só usa e configura sua conta. Exemplos: Gmail, Microsoft 365, Canva.

Uma analogia clássica ajuda a fixar a ideia: a pizza. Fazer a pizza do zero em casa é como ter um data center próprio. Comprar uma pizza congelada e assá-la no próprio forno é como usar IaaS. Pedir um delivery é PaaS. Comer na pizzaria é SaaS.

![Analogia da pizza](img/fig-04.webp)

*Analogia da pizza: em azul, o que fica por sua conta; em laranja, o que outro faz por você.*

| Modelo | Na AWS | Fora da AWS |
| --- | --- | --- |
| IaaS | Amazon EC2, Amazon EBS, Amazon VPC | máquinas virtuais do Azure e do Google Cloud |
| PaaS | Amazon RDS, AWS Elastic Beanstalk, Amazon DynamoDB | Heroku, Google App Engine, Azure App Service |
| SaaS | Amazon WorkMail, Amazon Chime | Gmail, Microsoft 365, Salesforce, Canva |

<aside class="positive">

**No mercado: o que é serverless.** Hoje muitas equipes falam em *serverless* (sem servidor). Os servidores continuam existindo, mas o cliente nunca os vê: paga por requisição ou por milissegundo de execução, e a escala é automática. AWS Lambda (funções), Amazon DynamoDB e Amazon S3 são exemplos. Na prática, serverless é uma forma de PaaS levada ao extremo, e é muito usada em APIs, processamento de eventos e sistemas de IoT.

</aside>

### Modelos de implantação

Além de **o que** é entregue, a nuvem varia em **onde** e **para quem** ela funciona.

![Modelos de implantação da nuvem](img/fig-05.webp)

*Modelos de implantação da nuvem.*

A **nuvem pública** é a mais comum e é a que usaremos: recursos de um provedor compartilhados, de forma isolada, por muitos clientes. A **nuvem privada** oferece a mesma experiência de autoatendimento, mas com infraestrutura dedicada a uma organização, geralmente por exigência regulatória. A **nuvem híbrida** combina as duas: um banco, por exemplo, mantém o sistema central em seu data center e usa a nuvem pública para o aplicativo e para picos de acesso.

### Por que as empresas migram para a nuvem

* **Trocar investimento por despesa variável:** em vez de gastar muito antes, com hardware que talvez nem seja usado, paga-se conforme o consumo.
* **Economia de escala:** um provedor compra hardware e energia em volumes gigantescos e repassa parte dessa economia no preço.
* **Parar de adivinhar capacidade:** a primeira figura deste passo mostra o custo de errar para mais ou para menos.
* **Velocidade e agilidade:** um ambiente de testes que levaria semanas para ser montado fica pronto em minutos.
* **Foco no que diferencia o negócio:** o time deixa de trocar disco e cuidar de ar-condicionado e passa a cuidar do produto.
* **Alcance global:** é possível colocar um sistema perto de usuários em outro continente com alguns cliques.

> **CAPEX e OPEX**
>
> **CAPEX** (*capital expenditure*) é o investimento em bens duráveis, como servidores comprados. **OPEX** (*operational expenditure*) é a despesa operacional recorrente, como a conta mensal da nuvem. A nuvem transforma boa parte do CAPEX de TI em OPEX.

<aside class="negative">

**Nuvem não é automaticamente mais barata.** Recursos esquecidos ligados, máquinas maiores do que o necessário e tráfego de saída mal planejado podem deixar a nuvem mais cara que um data center. Ao longo do projeto você vai ver dicas de economia, e o penúltimo passo mostra como desligar e apagar tudo.

</aside>

## Amazon Web Services
Duration: 12:00

### O que é a AWS

A Amazon Web Services (AWS) é a divisão de computação em nuvem da Amazon. Ela começou a oferecer serviços ao público em 2006, com o Amazon S3 (armazenamento) e o Amazon EC2 (servidores virtuais), e hoje é o maior provedor de nuvem pública do mundo, com mais de duzentos serviços que vão de máquinas virtuais a modelos de inteligência artificial. Empresas de todos os portes rodam sistemas na AWS, de startups a bancos, redes de varejo e órgãos públicos.

A ideia central é sempre a mesma: cada serviço é um bloco de montar, acessível por uma API, que você combina com outros para construir o seu sistema. A graça, e o desafio, está em escolher os blocos certos e encaixá-los bem.

### Categorias de serviços

Os serviços são organizados em categorias. A figura mostra as principais, com alguns exemplos de cada uma. Os nomes em negrito são os que você vai usar no projeto.

![Algumas categorias de serviços da AWS](img/fig-06.webp)

*Algumas categorias de serviços da AWS; em negrito, os serviços usados no projeto.*

As cores da figura seguem uma convenção muito usada em diagramas de arquitetura na AWS: laranja para computação, verde para armazenamento, roxo para redes, magenta para bancos de dados, rosa para gerenciamento e integração e vermelho para segurança. Os diagramas do projeto usam a mesma convenção.

### Como interagir com a AWS

Tudo o que se faz na AWS, no fim das contas, é uma chamada a uma API. Há quatro formas principais de fazer essas chamadas.

![Formas de acesso aos serviços da AWS](img/fig-07.webp)

*Formas de acesso aos serviços da AWS.*

O **console de gerenciamento** é a interface web, ótima para aprender e explorar, e é a forma que usaremos na maior parte do tempo. A **AWS CLI** executa as mesmas ações por linha de comando e é útil para automatizar tarefas repetitivas. Os **SDKs** são bibliotecas para linguagens de programação; nossa API em JavaScript usará o SDK para gravar no DynamoDB. Por fim, a **infraestrutura como código** descreve todo o ambiente em arquivos de texto versionados.

<aside class="positive">

**No mercado: console para aprender, código para produção.** Em empresas maduras, quase nada é criado clicando no console em produção. Os recursos são descritos com AWS CloudFormation, AWS CDK ou Terraform, revisados como código e aplicados por pipelines. O console continua sendo usado para investigar problemas, conferir configurações e aprender. Entender bem o que cada campo do console faz é justamente o que permite escrever esse código depois.

</aside>

### Infraestrutura global: regiões, zonas de disponibilidade e locais de borda

A AWS mantém data centers espalhados pelo mundo, organizados em uma hierarquia com três níveis.

> **Região**
>
> Área geográfica isolada onde a AWS agrupa data centers, identificada por um código como `us-east-1` (Norte da Virgínia, EUA) ou `sa-east-1` (São Paulo). Cada região é independente das outras: um recurso criado em uma região não aparece nas demais.

> **Zona de disponibilidade (AZ)**
>
> Um ou mais data centers dentro de uma região, com energia, refrigeração e rede próprias, fisicamente separados das outras zonas por quilômetros, mas ligados a elas por fibra de baixa latência. Cada região tem no mínimo três zonas, identificadas por uma letra depois do código da região: `us-east-1a`, `us-east-1b` e assim por diante.

> **Local de borda (*edge location*)**
>
> Ponto de presença menor, em muitas cidades, usado para entregar conteúdo e respostas com baixa latência perto do usuário final, por serviços como Amazon CloudFront (rede de entrega de conteúdo) e Amazon Route 53 (DNS).

![Uma região com três zonas de disponibilidade e alguns locais de borda](img/fig-08.webp)

*Uma região com três zonas de disponibilidade e alguns locais de borda.*

Hoje a AWS opera mais de 35 regiões e mais de 110 zonas de disponibilidade, e esses números crescem todo ano; o mapa oficial fica na página de infraestrutura global da AWS. A importância prática das zonas é enorme: um incêndio, uma enchente ou uma queda de energia afeta uma zona, não a região inteira. Por isso, sistemas que não podem parar são distribuídos em pelo menos duas zonas, exatamente o que você fará na Fase 5.

| Código | Localização | Observação |
| --- | --- | --- |
| `us-east-1` | Norte da Virgínia (EUA) | a região mais antiga e com mais serviços; é a que usaremos |
| `us-west-2` | Oregon (EUA) | também disponível no ambiente de laboratório |
| `sa-east-1` | São Paulo (Brasil) | menor latência para usuários brasileiros; preços um pouco maiores |
| `mx-central-1` | México | região mais recente da América Latina |
| `eu-west-1` | Irlanda | muito usada para clientes europeus |

<aside class="positive">

**Como escolher uma região.** Quatro critérios costumam decidir: **conformidade** (a lei pode exigir que dados fiquem no país), **latência** (perto dos usuários), **serviços disponíveis** (nem todo serviço existe em toda região) e **preço** (o mesmo recurso custa diferente em cada região).

</aside>

### Modelo de responsabilidade compartilhada

Quem é responsável pela segurança de um sistema na nuvem? A resposta da AWS é: os dois lados, cada um na sua parte. A AWS cuida da segurança **da** nuvem; o cliente cuida da segurança **na** nuvem.

![Modelo de responsabilidade compartilhada](img/fig-09.webp)

*Modelo de responsabilidade compartilhada.*

A fronteira muda conforme o modelo de serviço. Numa instância EC2 (IaaS), atualizar o sistema operacional é tarefa sua. No Amazon RDS (PaaS), a AWS aplica as correções do banco; você continua responsável por quem pode se conectar e pelas senhas. No DynamoDB, nem existe sistema operacional à vista. A Fase 7 volta a esse modelo e mapeia, item por item, o que ficou com cada lado no projeto.

### Como a AWS cobra

A maioria dos serviços segue o modelo **pague pelo uso**, sem contrato mínimo. Três fatores aparecem em quase toda conta: **computação** (tempo de máquina ligada), **armazenamento** (gigabytes guardados por mês) e **transferência de dados** (principalmente a saída para a internet; a entrada costuma ser gratuita). A tabela dá uma ordem de grandeza dos recursos usados no projeto (região `us-east-1`, valores aproximados e sujeitos a mudança).

| Recurso | Preço aproximado |
| --- | --- |
| Instância EC2 `t3.micro` | cerca de US$ 0,01 por hora ligada |
| Endereço IPv4 público | cerca de US$ 0,005 por hora, por endereço |
| Application Load Balancer | cerca de US$ 0,023 por hora, mais uma parcela pelo tráfego |
| RDS PostgreSQL `db.t3.micro` | cerca de US$ 0,02 por hora, mais o disco |
| DynamoDB sob demanda | frações de dólar por milhão de leituras e gravações |
| Amazon S3 | cerca de US$ 0,023 por GB por mês |

<aside class="positive">

**Calculadora de preços.** Para estimar o custo de uma arquitetura antes de criá-la, use a [AWS Pricing Calculator](https://calculator.aws). É ali que se monta, por exemplo, a estimativa mensal de um projeto para apresentar a um cliente.

</aside>

### AWS Well-Architected

Depois de acompanhar milhares de clientes, a AWS reuniu boas práticas de arquitetura em um guia chamado **AWS Well-Architected Framework**, organizado em seis pilares. Eles são um ótimo roteiro para avaliar qualquer projeto, inclusive o seu.

| Pilar | Pergunta central |
| --- | --- |
| Excelência operacional | Como executamos, monitoramos e melhoramos o sistema continuamente? |
| Segurança | Como protegemos dados, identidades e recursos? |
| Confiabilidade | O sistema se recupera de falhas e atende à demanda? |
| Eficiência de desempenho | Usamos os recursos certos, no tamanho certo? |
| Otimização de custos | Evitamos gastos desnecessários? |
| Sustentabilidade | Minimizamos o impacto ambiental da carga de trabalho? |

## O ambiente de laboratório e o console
Duration: 8:00

Todo o projeto é feito em um ambiente de laboratório da AWS Academy, o **Learner Lab**. Ele entrega uma conta AWS real, com um orçamento em dólares e algumas restrições de segurança. Tudo o que você criar é de verdade: as instâncias rodam em data centers da AWS e ficam acessíveis pela internet.

### Iniciando o laboratório

O laboratório é aberto a partir da página do curso na AWS Academy, no módulo do Learner Lab. A figura mostra, de forma esquemática, os elementos da tela.

![Representação esquemática da tela do Learner Lab](img/fig-10.webp)

*Representação esquemática da tela do Learner Lab.*

1. Clique em **Start Lab** (1). A primeira inicialização pode levar alguns minutos.
2. Acompanhe o indicador ao lado da palavra **AWS** (2): vermelho significa laboratório parado, amarelo significa iniciando e verde significa pronto.
3. Com o indicador verde, clique em **AWS**. O console de gerenciamento abre em uma nova aba; se nada acontecer, libere as janelas *pop-up* do navegador para esse site.
4. Em **AWS Details** (3) ficam as credenciais da sessão, a chave SSH para download e outras informações da conta.
5. No topo aparecem o **orçamento consumido** e o **tempo restante** da sessão (4). Cada sessão dura algumas horas; clicar de novo em **Start Lab** reinicia a contagem.
6. **End Lab** (5) encerra a sessão. Os recursos criados continuam existindo para a próxima sessão.

<aside class="negative">

**Nunca clique em Reset sem querer.** O botão **Reset** (6) apaga todos os recursos da conta e devolve o laboratório ao estado inicial. Ele só deve ser usado quando você quiser, de propósito, começar do zero.

</aside>

<aside class="negative">

**Restrições do Learner Lab que afetam o projeto**

* Só as regiões `us-east-1` e `us-west-2` funcionam; usaremos `us-east-1`.
* Instâncias EC2 dos tamanhos `nano` a `large`, com no máximo 9 instâncias e 32 vCPUs ligadas ao mesmo tempo por região.
* Não é possível criar usuários nem papéis IAM. Um papel pronto, `LabRole`, e o perfil de instância `LabInstanceProfile` já existem para dar permissões às instâncias.
* O par de chaves `vockey` já existe na região `us-east-1`.
* No RDS, instâncias até `medium`, sem Multi-AZ e sem monitoramento avançado.
* Ao fim da sessão, o laboratório pode parar as instâncias EC2 ligadas; na sessão seguinte elas voltam com um **novo IP público**.

</aside>

<aside class="positive">

**E fora do laboratório?** Em uma conta AWS comum, os passos são praticamente os mesmos. As diferenças principais: você mesmo cria o papel IAM que as instâncias vão usar (no laboratório ele já vem pronto) e deve configurar um alerta de orçamento no AWS Budgets logo no primeiro dia, para não ter surpresas na fatura.

</aside>

### Conhecendo o console

Ao clicar em **AWS**, você cai na página inicial do console, chamada **Console Home**. A barra superior é a mesma em todos os serviços e vale a pena conhecê-la bem.

![Representação esquemática da barra superior do console](img/fig-11.webp)

*Representação esquemática da barra superior do console.*

1. **Menu de serviços:** lista todos os serviços, agrupados por categoria.
2. **Barra de busca:** o jeito mais rápido de chegar a qualquer serviço. Digite `EC2`, `S3` ou `DynamoDB` e pressione Enter. Nos resultados, a estrela ao lado do nome fixa o serviço como favorito na barra.
3. **CloudShell:** abre um terminal Linux no próprio navegador, já autenticado na sua conta.
4. **Configurações:** entre outras opções, permite trocar o idioma do console.
5. **Seletor de região:** mostra em qual região você está trabalhando. Confira sempre que esteja em **United States (N. Virginia)**.
6. **Menu da conta:** mostra o usuário da sessão e o número da conta.

<aside class="negative">

**"Sumiu tudo o que eu criei!"** Quase sempre é a região errada. Recursos como instâncias, bancos e tabelas pertencem a uma região; se o seletor mudar para outra, a lista aparece vazia. Volte para **N. Virginia** antes de entrar em pânico.

</aside>

<aside class="positive">

**Idioma do console.** Os passos deste codelab usam o console em **inglês**, que é o idioma da documentação oficial, dos fóruns e da maior parte das empresas. Se o seu console estiver em outro idioma, clique no ícone de configurações (4), escolha a opção de ver todas as configurações do usuário e, em **Language**, selecione **English (US)**.

</aside>

### AWS CloudShell

O CloudShell é um terminal Linux que roda no navegador, dentro da sua conta, com a AWS CLI e o Node.js já instalados. Ele será usado para rodar o simulador de sensores e para testar a API. Clique no ícone `>_` da barra superior; em alguns segundos, um terminal se abre na parte de baixo da tela. Rode os comandos a seguir para conferir a identidade da sessão e a versão do Node.js.

**CloudShell**

```bash
# Mostra qual conta e qual usuário estão autenticados
aws sts get-caller-identity

# Confere a versão do Node.js disponível
node --version
```

<aside class="positive">

**Arquivos no CloudShell.** A pasta pessoal do CloudShell (`/home/cloudshell-user`) é preservada entre sessões, mas cada região tem a sua. Os arquivos que você criar em `us-east-1` só aparecem quando o CloudShell for aberto nessa mesma região.

</aside>

## O projeto AgroSensor
Duration: 6:00

### O problema

Uma cooperativa agrícola mantém estufas de tomate, morango e alface. Cada cultura tem uma faixa ideal de temperatura: se a estufa esquenta demais ou esfria demais, a produção se perde. A cooperativa decidiu instalar sensores que medem temperatura e umidade e enviam uma leitura a cada poucos segundos pela internet, e precisa de um sistema na nuvem para receber, guardar e mostrar esses dados.

Os requisitos combinados com a cooperativa são:

* receber leituras enviadas pelos sensores por HTTP, em formato JSON;
* guardar todas as leituras de forma durável, com gravação rápida mesmo com muitos sensores;
* manter um cadastro das estufas (nome, cultura e faixa ideal de temperatura);
* oferecer um painel web que mostre as últimas leituras e destaque temperaturas fora da faixa;
* continuar funcionando se um servidor ou uma zona de disponibilidade falhar;
* suportar picos repentinos de tráfego, como quando todos os sensores religam de manhã;
* avisar a equipe por e-mail quando algo anormal acontecer;
* proteger os dados e o acesso aos serviços.

### A arquitetura que vamos construir

A figura mostra onde vamos chegar. Não se preocupe se muitos elementos ainda não fizerem sentido: cada um será apresentado, criado e testado em uma fase, e ao fim de cada fase o diagrama parcial mostrará o que já estará funcionando.

![Arquitetura final do AgroSensor na AWS](img/fig-12.webp)

*Arquitetura final do AgroSensor na AWS.*

Lendo o diagrama da esquerda para a direita: os **sensores** enviam leituras para um **Application Load Balancer**, que distribui as requisições entre instâncias **EC2** espalhadas em duas zonas de disponibilidade e controladas por um **Auto Scaling group**. As instâncias executam uma API em Node.js, que grava as leituras no **DynamoDB** e consulta o cadastro das estufas no **RDS**. O código da API fica guardado em um bucket **S3** de artefatos, e o **painel** é um site estático em outro bucket S3, que o navegador baixa e que consulta a API. O **CloudWatch** acompanha as métricas e, quando um alarme dispara, o **SNS** envia um e-mail para a equipe. Grupos de segurança encadeados e um papel IAM completam a proteção.

### Roteiro das fases

| Fase | Serviços | Ao final da fase |
| --- | --- | --- |
| 1 | VPC, grupos de segurança, EC2 | uma API recebendo leituras de sensores simulados |
| 2 | DynamoDB, IAM | leituras guardadas de forma durável, sem chaves no código |
| 3 | RDS (PostgreSQL) | cadastro das estufas em um banco relacional gerenciado |
| 4 | S3 | código da API guardado como artefato e painel web publicado |
| 5 | ELB, EC2 Auto Scaling | API em duas zonas, com balanceamento e escala automática |
| 6 | CloudWatch, SNS | painel de métricas, alarme por e-mail e teste de carga |
| 7 | IAM, VPC, KMS, Systems Manager | acesso restrito, criptografia, backups e acesso sem SSH |

### Convenções de nomes

Dar nomes consistentes aos recursos é um hábito profissional: facilita encontrar, entender e apagar cada coisa depois. Todos os recursos do projeto começam com `agrosensor-`. Os nomes de bucket S3 precisam ser **únicos no mundo inteiro**, por isso levam um sufixo seu, representado neste codelab por `SEU-SUFIXO`. Use suas iniciais e quatro números, em letras minúsculas, por exemplo `abc1234`.

| Nome | Tipo de recurso | Fase |
| --- | --- | --- |
| `agrosensor-dev-sg` | grupo de segurança do servidor de desenvolvimento | 1 |
| `agrosensor-dev` | instância EC2 de desenvolvimento | 1 |
| `agrosensor-leituras` | tabela do DynamoDB | 2 |
| `agrosensor-db-sg` | grupo de segurança do banco | 3 |
| `agrosensor-db` | instância do RDS PostgreSQL | 3 |
| `agrosensor-artefatos-SEU-SUFIXO` | bucket S3 privado com o código | 4 |
| `agrosensor-painel-SEU-SUFIXO` | bucket S3 com o site do painel | 4 |
| `agrosensor-alb-sg`, `agrosensor-app-sg` | grupos de segurança do balanceador e da aplicação | 5 |
| `agrosensor-tg` | target group | 5 |
| `agrosensor-alb` | Application Load Balancer | 5 |
| `agrosensor-lt` | launch template | 5 |
| `agrosensor-asg` | Auto Scaling group | 5 |
| `agrosensor-alertas` | tópico do SNS | 6 |
| `agrosensor-pico-trafego` | alarme do CloudWatch | 6 |
| `agrosensor` | painel (dashboard) do CloudWatch | 6 |

## Fase 1: a rede e o firewall
Duration: 8:00

A primeira fase coloca uma API no ar em um servidor virtual. Ao final, sensores simulados estarão enviando leituras pela internet e a API estará respondendo. Antes de criar o servidor, porém, é preciso entender onde ele vai morar: a rede.

### A rede: Amazon VPC

> **VPC — Virtual Private Cloud**
>
> Rede virtual isolada dentro da AWS, na qual você define a faixa de endereços IP, divide em sub-redes e controla as rotas. Tudo o que tem endereço IP no projeto (instâncias, balanceador, banco) fica dentro de uma VPC.

Toda conta já vem, em cada região, com uma **VPC padrão** pronta para uso, e é ela que usaremos. A figura mostra como ela é organizada.

![Organização da VPC padrão de uma região](img/fig-13.webp)

*Organização da VPC padrão de uma região (endereços ilustrativos).*

* A VPC padrão usa a faixa `172.31.0.0/16`, com cerca de 65 mil endereços privados.
* Ela tem uma **sub-rede** em cada zona de disponibilidade. Cada sub-rede pertence a uma única zona; é escolhendo a sub-rede que se escolhe em que zona um recurso fica.
* O **internet gateway** é a porta de saída e de entrada da VPC para a internet.
* A **tabela de rotas** diz para onde vai cada pacote: tráfego para `172.31.x.x` fica dentro da VPC; todo o resto (`0.0.0.0/0`) segue para o internet gateway.
* Como as sub-redes da VPC padrão têm rota para o internet gateway, são chamadas de **públicas**, e as instâncias criadas nelas recebem um IP público.

<aside class="positive">

**No mercado: sub-redes públicas e privadas.** Em produção, é comum criar uma VPC própria com dois tipos de sub-rede em cada zona: **públicas**, onde ficam apenas o balanceador de carga e gateways, e **privadas**, sem rota direta de entrada da internet, onde ficam as instâncias da aplicação e os bancos de dados. No projeto usamos a VPC padrão para ganhar tempo e compensamos com grupos de segurança bem restritos e com o banco sem acesso público.

</aside>

### Explorando a VPC padrão

**Caminho no console:** VPC ▸ Your VPCs

Na barra de busca, digite `VPC` e abra o serviço. No menu à esquerda, clique em **Your VPCs**. Deve haver uma VPC com a coluna **Default VPC** marcada como **Yes** e a faixa `172.31.0.0/16`. Em seguida clique em **Subnets**: aparecem seis sub-redes, uma por zona da região `us-east-1`. Observe as colunas **Availability Zone** e **IPv4 CIDR**; é por elas que você vai reconhecer a sub-rede da zona `us-east-1a` mais adiante.

### O firewall: grupos de segurança

> **Grupo de segurança (*security group*)**
>
> Firewall virtual associado a um recurso (instância, balanceador, banco). Suas **regras de entrada** dizem quais portas e origens podem se conectar; tudo o que não estiver liberado é bloqueado. Por padrão, todo o tráfego de saída é permitido.

![Funcionamento de um grupo de segurança](img/fig-14.webp)

*Funcionamento de um grupo de segurança.*

Um detalhe importante: grupos de segurança são **stateful**. Se uma conexão de entrada foi permitida, a resposta sai automaticamente, sem regra de saída específica. Cada regra tem um protocolo, uma porta (ou faixa de portas) e uma **origem**, que pode ser uma faixa de IPs (`0.0.0.0/0` significa "qualquer lugar") ou outro grupo de segurança, recurso que usaremos na Fase 3.

### Criando o grupo de segurança do servidor de desenvolvimento

**Caminho no console:** EC2 ▸ Network & Security ▸ Security Groups ▸ Create security group

Abra o serviço **EC2** pela barra de busca. No menu à esquerda, em **Network & Security**, clique em **Security Groups** e depois em **Create security group**. Preencha:

| Campo no console | Valor / ação |
| --- | --- |
| Security group name | `agrosensor-dev-sg` |
| Description | `Servidor de desenvolvimento do AgroSensor` |
| VPC | a VPC padrão (já vem selecionada) |
| Inbound rules | clique em **Add rule** duas vezes e crie as regras da tabela abaixo |
| Outbound rules | mantenha a regra padrão (todo o tráfego liberado) |

| Type | Port range | Source | Description |
| --- | --- | --- | --- |
| SSH | 22 | Anywhere-IPv4 (`0.0.0.0/0`) | Acesso pelo navegador |
| Custom TCP | 3000 | Anywhere-IPv4 (`0.0.0.0/0`) | API AgroSensor - testes |

Clique em **Create security group**.

<aside class="negative">

**SSH aberto para o mundo.** A porta 22 aberta para `0.0.0.0/0` é necessária aqui porque a conexão pelo navegador (EC2 Instance Connect) parte de endereços da própria AWS. Isso é aceitável em um servidor temporário de estudo, mas é justamente uma das coisas que a Fase 7 elimina.

</aside>

## Fase 1: lançando o servidor EC2
Duration: 10:00

> **Instância EC2**
>
> Máquina virtual executada nos servidores físicos da AWS. Você escolhe o sistema operacional, o tamanho (CPU e memória), o disco, a rede e as permissões, e paga por segundo enquanto ela estiver ligada.

Lançar uma instância é combinar um conjunto de peças, mostradas na figura.

![As peças que compõem uma instância EC2](img/fig-15.webp)

*As peças que compõem uma instância EC2.*

A **AMI** (*Amazon Machine Image*) é a imagem de disco a partir da qual a instância nasce, com o sistema operacional já instalado; usaremos o **Amazon Linux 2023**, distribuição mantida pela própria AWS. O **tipo de instância** define o hardware virtual, e o nome dele segue um padrão.

![Como ler o nome de um tipo de instância](img/fig-16.webp)

*Como ler o nome de um tipo de instância.*

| Tipo | vCPU | Memória | Uso típico |
| --- | --- | --- | --- |
| `t3.nano` | 2 | 0,5 GiB | testes muito simples |
| `t3.micro` | 2 | 1 GiB | APIs pequenas, estudo (**nossa escolha**) |
| `t3.small` | 2 | 2 GiB | aplicações leves |
| `t3.medium` | 2 | 4 GiB | aplicações com mais memória |
| `t3.large` | 2 | 8 GiB | maior tamanho permitido no laboratório |

O **volume EBS** (*Elastic Block Store*) é o disco da instância: continua existindo se ela for desligada. O **par de chaves** é o par criptográfico usado para login por SSH; no laboratório, o par `vockey` já existe. A instância também passa por **estados** ao longo da vida: *pending* (iniciando), *running* (ligada e cobrando), *stopped* (desligada, sem cobrança de computação, mas com cobrança do disco) e *terminated* (apagada para sempre).

### Lançando a instância

**Caminho no console:** EC2 ▸ Instances ▸ Launch instances

No menu à esquerda do EC2, clique em **Instances** e depois em **Launch instances**. A página de lançamento é longa e dividida em seções, representadas na figura; os números correspondem aos da tabela de campos.

![Representação esquemática da página de lançamento de instâncias](img/fig-17.webp)

*Representação esquemática da página de lançamento de instâncias.*

| Campo no console | Valor / ação |
| --- | --- |
| 1. Name and tags ▸ Name | `agrosensor-dev` |
| 2. Application and OS Images | aba **Quick Start** ▸ **Amazon Linux**; AMI **Amazon Linux 2023 AMI**, arquitetura **64-bit (x86)** |
| 3. Instance type | `t3.micro` |
| 4. Key pair (login) | `vockey` |
| 5. Network settings | clique em **Edit**. VPC: a padrão. Subnet: a da zona `us-east-1a`. Auto-assign public IP: **Enable**. Firewall: **Select existing security group** ▸ `agrosensor-dev-sg` |
| 6. Configure storage | mantenha 1x 8 GiB gp3 |
| 7. Advanced details | não altere nada por enquanto |
| 8. Summary | Number of instances: 1 ▸ clique em **Launch instance** |

Na tela de confirmação, clique no identificador da instância (algo como `i-0abc123...`) ou em **View all instances**. Em um ou dois minutos, a coluna **Instance state** passa para **Running** e a coluna **Status check** indica que todas as verificações passaram.

<aside class="positive">

**Ponto de verificação.** Selecione a instância na lista e, na aba **Details** logo abaixo, anote o **Public IPv4 address** no seu arquivo de anotações. Confira também, na aba **Networking**, que a zona de disponibilidade é `us-east-1a`.

</aside>

### Conectando ao servidor pelo navegador

**Caminho no console:** EC2 ▸ Instances ▸ (selecione `agrosensor-dev`) ▸ Connect

Com a instância selecionada, clique em **Connect**. Na aba **EC2 Instance Connect**, mantenha a conexão pelo IP público e o usuário `ec2-user`, e clique em **Connect**. Um terminal abre em uma nova aba do navegador, já dentro do servidor.

<aside class="positive">

**Colando texto no terminal do navegador.** No terminal do EC2 Instance Connect e no CloudShell, cole com **Ctrl+Shift+V** (Windows e Linux) ou **Cmd+V** (macOS). No editor `nano`, salve com **Ctrl+O** seguido de **Enter** e saia com **Ctrl+X**.

</aside>

### Instalando o Node.js

O Amazon Linux 2023 usa o gerenciador de pacotes `dnf`, e o Node.js 22 está disponível nos repositórios oficiais da distribuição.

**Terminal do servidor**

```bash
# Instala o Node.js 22 e o npm a partir dos repositórios do Amazon Linux
sudo dnf install -y nodejs22

# Confere as versões instaladas
node --version
npm --version
```

<aside class="negative">

**Se aparecer "node: command not found".** Em algumas versões da AMI, o pacote instala os comandos com a versão no nome (`node-22` e `npm-22`). Crie os atalhos com os comandos abaixo e teste de novo.

```bash
# Cria os atalhos node e npm apontando para a versão 22
sudo ln -sf /usr/bin/node-22 /usr/bin/node
sudo ln -sf /usr/bin/npm-22 /usr/bin/npm
```

</aside>

## Fase 1: criando a API
Duration: 15:00

A API do AgroSensor é escrita em JavaScript com o **Express**, o framework web mais usado no ecossistema Node.js. Ela terá três rotas nesta fase.

| Método | Caminho | O que faz |
| --- | --- | --- |
| GET | `/saude` | informa que a API está no ar e qual servidor respondeu |
| POST | `/leituras` | recebe uma leitura em JSON e a guarda |
| GET | `/leituras/:sensorId` | devolve as últimas leituras de um sensor |

> **HTTP em uma frase**
>
> O cliente envia uma requisição com um **método** (GET para buscar, POST para criar), um **caminho** e, às vezes, um **corpo**; o servidor devolve um **código de status** (200 ok, 201 criado, 400 requisição inválida, 500 erro no servidor) e um corpo, que aqui será sempre JSON.

Crie a pasta do projeto, inicialize o `package.json` e instale o Express:

**Terminal do servidor**

```bash
mkdir ~/agrosensor-api
cd ~/agrosensor-api

# Cria o package.json com valores padrão
npm init -y

# Instala o framework web Express
npm install express
```

A API vai separar **o que fazer** (as rotas) de **onde guardar** (o repositório). Nesta fase, as leituras ficam num vetor em memória. Essa separação vai render frutos na Fase 2, quando o armazenamento mudar sem que as rotas precisem mudar. Crie o arquivo com `nano repositorio.js`:

**repositorio.js**

```javascript
// repositorio.js - guarda as leituras (versão em memória)
// Atenção: tudo o que está aqui se perde quando a API é reiniciada!
const leituras = [];

async function salvarLeitura(leitura) {
  leituras.push(leitura);
}

async function listarLeituras(sensorId, limite) {
  return leituras
    .filter((l) => l.sensorId === sensorId) // só as do sensor pedido
    .slice(-limite)                         // as últimas "limite"
    .reverse();                             // mais recentes primeiro
}

module.exports = { salvarLeitura, listarLeituras };
```

As funções são `async` mesmo sem precisar ser: assim, quando elas passarem a falar com um banco de dados, quem as chama não precisa mudar. Agora crie o arquivo principal com `nano app.js`, começando pelo mínimo: a rota de saúde.

**app.js**

```javascript
// app.js - API do AgroSensor
const express = require('express');
const os = require('os');

const app = express();
const PORTA = process.env.PORTA || 3000;

app.use(express.json()); // transforma o corpo JSON das requisições em objeto

// Verificação de saúde: diz se a API está no ar e qual servidor respondeu
app.get('/saude', (req, res) => {
  res.json({ status: 'ok', servidor: os.hostname() });
});

app.listen(PORTA, () => {
  console.log(`API do AgroSensor ouvindo na porta ${PORTA}`);
});
```

Execute a API:

**Terminal do servidor**

```bash
node app.js
```

<aside class="positive">

**Ponto de verificação.** No navegador do seu computador, acesse `http://SEU-IP-PUBLICO:3000/saude`, trocando pelo IP anotado. A resposta deve ser um JSON como `{"status":"ok","servidor":"ip-172-31-..."}`. O campo `servidor` é o nome interno da instância e será muito útil na Fase 5.

</aside>

Pare a API com **Ctrl+C** e abra o `app.js` de novo. Acrescente a importação do repositório e a rota que recebe leituras. O arquivo fica assim:

**app.js**

```javascript
// app.js - API do AgroSensor
const express = require('express');
const os = require('os');
const repositorio = require('./repositorio');

const app = express();
const PORTA = process.env.PORTA || 3000;

app.use(express.json()); // transforma o corpo JSON das requisições em objeto

// Verificação de saúde: diz se a API está no ar e qual servidor respondeu
app.get('/saude', (req, res) => {
  res.json({ status: 'ok', servidor: os.hostname() });
});

// Recebe uma leitura enviada por um sensor
app.post('/leituras', async (req, res) => {
  const { sensorId, temperatura, umidade } = req.body;
  if (!sensorId || typeof temperatura !== 'number' || typeof umidade !== 'number') {
    return res.status(400).json({ erro: 'Informe sensorId, temperatura e umidade.' });
  }
  const leitura = {
    sensorId,
    timestamp: new Date().toISOString(), // data e hora em UTC (ISO 8601)
    temperatura,
    umidade,
    servidor: os.hostname() // qual instância processou
  };
  try {
    await repositorio.salvarLeitura(leitura);
    res.status(201).json(leitura);
  } catch (erro) {
    console.error('Erro ao salvar leitura:', erro);
    res.status(500).json({ erro: 'Não foi possível salvar a leitura.' });
  }
});

app.listen(PORTA, () => {
  console.log(`API do AgroSensor ouvindo na porta ${PORTA}`);
});
```

A rota valida o corpo antes de aceitar a leitura: se faltar o sensor ou se temperatura e umidade não forem números, responde `400`. Uma API exposta na internet nunca deve confiar cegamente no que recebe. Por fim, acrescente a rota de consulta, logo antes do `app.listen`:

**app.js**

```javascript
// app.js - API do AgroSensor
const express = require('express');
const os = require('os');
const repositorio = require('./repositorio');

const app = express();
const PORTA = process.env.PORTA || 3000;

app.use(express.json()); // transforma o corpo JSON das requisições em objeto

// Verificação de saúde: diz se a API está no ar e qual servidor respondeu
app.get('/saude', (req, res) => {
  res.json({ status: 'ok', servidor: os.hostname() });
});

// Recebe uma leitura enviada por um sensor
app.post('/leituras', async (req, res) => {
  const { sensorId, temperatura, umidade } = req.body;
  if (!sensorId || typeof temperatura !== 'number' || typeof umidade !== 'number') {
    return res.status(400).json({ erro: 'Informe sensorId, temperatura e umidade.' });
  }
  const leitura = {
    sensorId,
    timestamp: new Date().toISOString(), // data e hora em UTC (ISO 8601)
    temperatura,
    umidade,
    servidor: os.hostname() // qual instância processou
  };
  try {
    await repositorio.salvarLeitura(leitura);
    res.status(201).json(leitura);
  } catch (erro) {
    console.error('Erro ao salvar leitura:', erro);
    res.status(500).json({ erro: 'Não foi possível salvar a leitura.' });
  }
});

// Lista as leituras mais recentes de um sensor (ex.: /leituras/estufa-01?limite=10)
app.get('/leituras/:sensorId', async (req, res) => {
  const limite = Math.min(Number(req.query.limite) || 10, 100); // no máximo 100
  try {
    const leituras = await repositorio.listarLeituras(req.params.sensorId, limite);
    res.json(leituras);
  } catch (erro) {
    console.error('Erro ao listar leituras:', erro);
    res.status(500).json({ erro: 'Não foi possível consultar as leituras.' });
  }
});

app.listen(PORTA, () => {
  console.log(`API do AgroSensor ouvindo na porta ${PORTA}`);
});
```

Salve e rode de novo com `node app.js`. Deixe essa aba aberta com a API rodando.

## Fase 1: testando e simulando os sensores
Duration: 12:00

### Testando com o CloudShell

Abra o CloudShell pelo ícone `>_` do console. Guarde o endereço da API numa variável, para não precisar digitá-lo toda hora, e faça as primeiras requisições.

**CloudShell**

```bash
# Troque pelo IP público da sua instância
API=http://SEU-IP-PUBLICO:3000

# 1) Saúde da API
curl $API/saude

# 2) Uma leitura válida
curl -X POST $API/leituras -H "Content-Type: application/json" \
  -d '{"sensorId":"estufa-01","temperatura":24.5,"umidade":61}'

# 3) Uma leitura inválida (sem temperatura e umidade)
curl -X POST $API/leituras -H "Content-Type: application/json" \
  -d '{"sensorId":"estufa-01"}'

# 4) Consulta das últimas leituras
curl "$API/leituras/estufa-01?limite=5"
```

**Saída esperada**

```json
{"status":"ok","servidor":"ip-172-31-35-120.ec2.internal"}
{"sensorId":"estufa-01","timestamp":"2026-09-21T13:05:12.345Z","temperatura":24.5,"umidade":61,"servidor":"ip-172-31-35-120.ec2.internal"}
{"erro":"Informe sensorId, temperatura e umidade."}
[{"sensorId":"estufa-01","timestamp":"2026-09-21T13:05:12.345Z","temperatura":24.5,...}]
```

A figura resume o caminho de cada requisição.

![Sequência de uma gravação e de uma consulta na API](img/fig-18.webp)

*Sequência de uma gravação e de uma consulta na API.*

### Simulando os sensores

Sensores de verdade estariam nas estufas, com um microcontrolador e Wi-Fi. Para o projeto, um pequeno programa Node.js faz o papel deles, rodando no CloudShell. No CloudShell, crie o arquivo com `nano simulador.js`. A primeira versão envia uma única leitura, só para testar:

**simulador.js**

```javascript
// simulador.js - simula sensores de estufas enviando leituras pela internet
const URL_API = process.argv[2];                       // ex.: http://54.210.10.8:3000
const QTD_SENSORES = Number(process.argv[3]) || 3;     // quantas estufas simular
const INTERVALO_MS = Number(process.argv[4]) || 5000;  // intervalo entre envios

if (!URL_API) {
  console.log('Uso: node simulador.js <url-da-api> [sensores] [intervalo-ms]');
  process.exit(1);
}

// Sorteia um número entre min e max, com uma casa decimal
const sortear = (min, max) => Math.round((min + Math.random() * (max - min)) * 10) / 10;

async function enviarLeitura(sensorId) {
  const leitura = { sensorId, temperatura: sortear(16, 32), umidade: sortear(45, 90) };
  try {
    const resposta = await fetch(`${URL_API}/leituras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leitura)
    });
    const corpo = await resposta.json();
    console.log(`${resposta.status} ${sensorId} ${leitura.temperatura}°C ${leitura.umidade}% -> ${corpo.servidor}`);
  } catch (erro) {
    console.log(`Falha ao enviar (${sensorId}): ${erro.message}`);
  }
}

enviarLeitura('estufa-01'); // teste: uma única leitura
```

**CloudShell**

```bash
node simulador.js $API
```

Deve aparecer uma linha começando por `201`. Agora troque a última linha do arquivo pelo laço abaixo, que cria vários sensores, cada um enviando uma leitura a cada intervalo:

**simulador.js (fim do arquivo)**

```javascript
// Cada sensor envia uma leitura a cada INTERVALO_MS milissegundos
for (let i = 1; i <= QTD_SENSORES; i++) {
  const sensorId = `estufa-${String(i).padStart(2, '0')}`; // estufa-01, estufa-02...
  setInterval(() => enviarLeitura(sensorId), INTERVALO_MS);
}
console.log(`Simulando ${QTD_SENSORES} sensor(es) a cada ${INTERVALO_MS} ms. Ctrl+C para parar.`);
```

**CloudShell**

```bash
# 3 sensores, uma leitura a cada 5 segundos cada
node simulador.js $API 3 5000
```

**Saída esperada**

```text
Simulando 3 sensor(es) a cada 5000 ms. Ctrl+C para parar.
201 estufa-01 27.4°C 63.1% -> ip-172-31-35-120.ec2.internal
201 estufa-02 18.9°C 80.2% -> ip-172-31-35-120.ec2.internal
201 estufa-03 21.3°C 55.7% -> ip-172-31-35-120.ec2.internal
```

<aside class="positive">

**Ponto de verificação.** Com o simulador rodando, abra no navegador `http://SEU-IP-PUBLICO:3000/leituras/estufa-02?limite=5`. A lista deve mudar a cada atualização da página.

</aside>

### O problema da memória

Pare o simulador com **Ctrl+C**. Na aba do servidor, pare a API com **Ctrl+C**, inicie de novo com `node app.js` e consulte as leituras: a lista volta vazia. Tudo o que estava no vetor sumiu. E há um segundo problema, mais sutil: se houvesse dois servidores, cada um teria o seu próprio vetor, e uma consulta mostraria só metade das leituras. **Guardar estado na memória do servidor impede que ele seja substituído ou multiplicado.** A Fase 2 resolve isso levando os dados para um banco de dados gerenciado.

<aside class="positive">

**Entre uma aula e outra.** Quando a sessão do laboratório termina, a instância pode ser parada. Na próxima aula, ligue-a em **Instances ▸ Instance state ▸ Start instance**, anote o **novo** IP público e rode de novo `cd ~/agrosensor-api` e `node app.js`.

</aside>

### Arquitetura ao final da Fase 1

![Arquitetura ao final da Fase 1](img/fig-19.webp)

*Arquitetura ao final da Fase 1.*

Uma instância EC2 em uma sub-rede pública da zona `us-east-1a`, protegida por um grupo de segurança, recebe requisições HTTP dos sensores simulados na porta 3000, entrando na VPC pelo internet gateway.

## Fase 2: o banco NoSQL DynamoDB
Duration: 8:00

### Bancos de dados NoSQL

Bancos relacionais, como PostgreSQL e MySQL, organizam dados em tabelas com esquema fixo e relacionamentos, consultados com SQL. Eles são excelentes para dados estruturados e consultas flexíveis. Leituras de sensores têm outro perfil: chegam em enorme quantidade, quase nunca são alteradas e são consultadas sempre do mesmo jeito (as últimas de um sensor). Para esse perfil, bancos NoSQL costumam escalar melhor e custar menos.

> **NoSQL**
>
> Família de bancos de dados que não usa o modelo relacional tradicional. Em troca de consultas menos flexíveis, oferecem escalabilidade horizontal, esquema flexível e desempenho previsível em grandes volumes. Os principais tipos são chave-valor, documentos, colunas largas e grafos.

| | Relacional (ex.: RDS PostgreSQL) | NoSQL chave-valor (ex.: DynamoDB) |
| --- | --- | --- |
| Esquema | fixo, definido antes (tabelas e colunas) | flexível: cada item pode ter atributos diferentes |
| Consultas | SQL, com junções e filtros livres | pela chave; outras consultas exigem índices |
| Escala | principalmente vertical (máquina maior) | horizontal e automática |
| Relacionamentos | chaves estrangeiras e junções | modelados na própria chave ou evitados |
| Melhor para | cadastros, transações, relatórios | grandes volumes, acesso por chave, IoT, sessões |

### Amazon DynamoDB

O DynamoDB é o banco NoSQL chave-valor e de documentos da AWS. Ele é **serverless**: não há servidor para escolher, ligar ou atualizar. Você cria uma tabela e começa a gravar; a AWS distribui os dados em partições espalhadas por várias zonas de disponibilidade e replica cada gravação automaticamente.

Toda tabela tem uma **chave primária**, que pode ser simples ou composta:

* a **chave de partição** decide em qual partição o item fica. O DynamoDB aplica uma função de hash sobre ela e itens com o mesmo valor ficam juntos;
* a **chave de ordenação**, opcional, ordena os itens dentro da mesma partição e permite consultas por faixa (os mais recentes, os de um dia, etc.).

Para o AgroSensor, a consulta principal é "as últimas leituras de um sensor". Então a chave de partição será `sensorId` e a de ordenação será `timestamp`. Como o `timestamp` está no formato ISO 8601 (`2026-09-21T13:05:12Z`), a ordem alfabética coincide com a ordem cronológica.

![Itens da tabela agrosensor-leituras e sua distribuição em partições](img/fig-20.webp)

*Itens da tabela `agrosensor-leituras` e sua distribuição em partições.*

<aside class="positive">

**No mercado: modele pelas consultas.** Em bancos relacionais, primeiro se modelam as entidades e depois se escrevem as consultas. No DynamoDB é o contrário: primeiro se listam os **padrões de acesso** (quais consultas o sistema faz) e a chave é desenhada para atendê-los. Uma chave mal escolhida obriga a usar a operação `Scan`, que lê a tabela inteira e fica cara e lenta à medida que os dados crescem.

</aside>

O DynamoDB tem dois modos de capacidade. No **sob demanda** (*on-demand*), padrão atual, você paga por requisição e a tabela se ajusta sozinha ao tráfego. No **provisionado**, você reserva uma capacidade de leitura e gravação por segundo, o que pode sair mais barato para cargas estáveis e previsíveis.

### Criando a tabela

**Caminho no console:** DynamoDB ▸ Tables ▸ Create table

Abra o DynamoDB pela barra de busca, clique em **Tables** no menu à esquerda e depois em **Create table**.

| Campo no console | Valor / ação |
| --- | --- |
| Table name | `agrosensor-leituras` |
| Partition key | `sensorId`, tipo **String** |
| Sort key - optional | `timestamp`, tipo **String** |
| Table settings | **Default settings** (modo sob demanda) |

Clique em **Create table**. Em alguns segundos o **Status** passa de *Creating* para *Active*.

## Fase 2: IAM e o novo repositório
Duration: 12:00

### Identidade e acesso: AWS IAM

A API vai precisar de permissão para gravar na tabela. Na AWS, quem controla **quem pode fazer o quê** é o IAM.

> **AWS IAM — Identity and Access Management**
>
> Serviço que gerencia identidades e permissões. Seus elementos principais são: **usuários** (pessoas ou sistemas com credenciais permanentes), **grupos** (conjuntos de usuários), **papéis** (identidades assumidas temporariamente por serviços, aplicações ou pessoas) e **políticas** (documentos JSON que dizem quais ações são permitidas em quais recursos).

Existem duas formas de dar permissões a um programa que roda numa instância, e só uma delas é aceitável.

![Chaves no código versus papel IAM anexado à instância](img/fig-21.webp)

*Chaves no código versus papel IAM anexado à instância.*

Com um **papel IAM anexado à instância**, o SDK busca credenciais temporárias no serviço de metadados da instância, que a AWS renova automaticamente. O código não guarda nenhum segredo. No laboratório, o papel `LabRole` já existe e é anexado às instâncias por meio do perfil `LabInstanceProfile`.

### Trocando o repositório

Volte ao terminal do servidor, pare a API com **Ctrl+C** se estiver rodando, e instale o SDK da AWS para o DynamoDB. O pacote `lib-dynamodb` converte objetos JavaScript comuns para o formato do DynamoDB e vice-versa.

**Terminal do servidor**

```bash
cd ~/agrosensor-api
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

Agora substitua o conteúdo do `repositorio.js` pela versão abaixo. Para apagar o conteúdo antigo de uma vez, rode `> repositorio.js` antes de abrir o `nano`.

**repositorio.js**

```javascript
// repositorio.js - guarda as leituras no Amazon DynamoDB
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const TABELA = process.env.TABELA || 'agrosensor-leituras';

// O cliente descobre as credenciais sozinho (papel IAM da instância).
// Nenhuma chave de acesso aparece no código.
const cliente = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const db = DynamoDBDocumentClient.from(cliente);

// Grava um item; sensorId e timestamp formam a chave primária
async function salvarLeitura(leitura) {
  await db.send(new PutCommand({ TableName: TABELA, Item: leitura }));
}

// Busca os itens de um sensor, do timestamp mais recente para o mais antigo
async function listarLeituras(sensorId, limite) {
  const resposta = await db.send(new QueryCommand({
    TableName: TABELA,
    KeyConditionExpression: 'sensorId = :s',
    ExpressionAttributeValues: { ':s': sensorId },
    ScanIndexForward: false, // ordem decrescente da chave de ordenação
    Limit: limite
  }));
  return resposta.Items;
}

module.exports = { salvarLeitura, listarLeituras };
```

Repare que as assinaturas das funções continuam as mesmas, e por isso o `app.js` não precisa de nenhuma mudança. Essa é a vantagem de ter separado as responsabilidades na Fase 1. Rode a API e, no CloudShell, envie uma leitura:

**CloudShell**

```bash
curl -X POST $API/leituras -H "Content-Type: application/json" \
  -d '{"sensorId":"estufa-01","temperatura":24.5,"umidade":61}'
```

A resposta é `{"erro":"Não foi possível salvar a leitura."}`, e no terminal do servidor aparece um erro parecido com este:

**Terminal do servidor**

```text
Erro ao salvar leitura: CredentialsProviderError: Could not load credentials from any providers
```

O SDK procurou credenciais e não encontrou nenhuma: a instância ainda não tem papel IAM. É exatamente o comportamento seguro esperado. Pare a API com **Ctrl+C** e anexe o papel.

**Caminho no console:** EC2 ▸ Instances ▸ (selecione `agrosensor-dev`) ▸ Actions ▸ Security ▸ Modify IAM role

| Campo no console | Valor / ação |
| --- | --- |
| IAM role | `LabInstanceProfile` |

Clique em **Update IAM role**. Aguarde alguns segundos, rode `node app.js` de novo e repita o `curl`: agora a resposta é o `201` com a leitura. Inicie também o simulador no CloudShell.

**CloudShell**

```bash
node simulador.js $API 3 5000
```

### Conferindo os dados no console

**Caminho no console:** DynamoDB ▸ Explore items ▸ agrosensor-leituras

No menu à esquerda do DynamoDB, clique em **Explore items** e escolha a tabela. Os itens aparecem na parte de baixo. Para ver só um sensor, abra o painel **Scan or query items**, escolha **Query**, digite `estufa-02` no campo `sensorId` (Partition key), marque **Sort descending** e clique em **Run**.

<aside class="positive">

**Ponto de verificação.** Pare e reinicie a API, como no fim da Fase 1, e consulte `$API/leituras/estufa-01`. As leituras continuam lá: agora elas estão no DynamoDB, e não na memória do servidor.

</aside>

<aside class="positive">

**No mercado: expiração automática de dados antigos.** Telemetria cresce sem parar. O DynamoDB tem um recurso chamado **TTL** (*Time to Live*): basta gravar em cada item um atributo com a data de expiração, em segundos desde 1970, e ativar o TTL na tabela apontando para esse atributo; o DynamoDB apaga os itens vencidos sem custo de gravação. Os dados antigos costumam ser exportados antes para o S3, onde o armazenamento é mais barato.

</aside>

### Arquitetura ao final da Fase 2

![Arquitetura ao final da Fase 2](img/fig-22.webp)

*Arquitetura ao final da Fase 2.*

A instância agora tem o papel `LabRole`, e a API grava e consulta as leituras no DynamoDB. O DynamoDB é um serviço regional: não fica dentro da VPC, e a instância o acessa por HTTPS, com requisições assinadas pelas credenciais temporárias do papel.

## Fase 3: o banco relacional RDS
Duration: 15:00

### Por que um segundo banco de dados

As leituras estão bem guardadas no DynamoDB, mas a cooperativa também precisa de um **cadastro das estufas**: nome, cultura plantada e faixa ideal de temperatura. Esses dados têm outro perfil. São poucos registros, bem estruturados, alterados de vez em quando e, no futuro, vão se relacionar com outras entidades (técnicos responsáveis, lotes de plantio, manutenções). É o terreno natural de um banco **relacional**, consultado com SQL.

<aside class="positive">

**No mercado: persistência poliglota.** Sistemas modernos raramente usam um único banco. É comum combinar um banco relacional para cadastros e transações, um NoSQL para grandes volumes com acesso por chave, um cache em memória para respostas rápidas e um armazenamento de objetos para arquivos. Essa prática tem nome: **persistência poliglota**. A regra é escolher o banco pelo padrão de acesso de cada tipo de dado.

</aside>

### Amazon RDS

> **Amazon RDS — Relational Database Service**
>
> Serviço de banco de dados relacional gerenciado. Você escolhe o motor (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server ou Db2), o tamanho e o armazenamento; a AWS instala, aplica correções, faz backups automáticos e, se configurado, mantém uma réplica em outra zona para assumir em caso de falha.

A diferença entre instalar o PostgreSQL numa instância EC2 e usar o RDS aparece na figura: no RDS, sobra para você só o que é realmente do seu negócio, o esquema e as consultas.

![Banco em uma instância EC2 versus Amazon RDS](img/fig-23.webp)

*O que fica com você e o que fica com a AWS: banco em uma instância EC2 versus Amazon RDS.*

Alguns recursos do RDS merecem nome próprio:

* **Multi-AZ:** o RDS mantém uma cópia síncrona do banco em outra zona e, se a principal falhar, troca para ela automaticamente, mantendo o mesmo endereço.
* **Réplicas de leitura:** cópias assíncronas que atendem consultas, aliviando o banco principal.
* **Backups automáticos:** cópias diárias com retenção configurável, que permitem restaurar o banco em qualquer ponto dentro do período.
* **Endpoint:** o nome DNS pelo qual as aplicações se conectam. Ele não muda, mesmo que a máquina por trás seja substituída.

<aside class="negative">

**RDS no Learner Lab.** No laboratório não é possível ativar Multi-AZ nem o monitoramento avançado (Enhanced Monitoring), e as instâncias vão até o tamanho `medium`. O banco continua sendo um RDS de verdade, com backups e criptografia.

</aside>

### O grupo de segurança do banco

O banco não terá acesso público e aceitará conexões apenas de quem estiver em um grupo de segurança autorizado. Em vez de liberar uma faixa de IPs, a regra vai apontar para o **grupo de segurança do servidor**: qualquer instância que estiver no grupo `agrosensor-dev-sg` poderá se conectar, e nenhuma outra.

**Caminho no console:** EC2 ▸ Network & Security ▸ Security Groups ▸ Create security group

| Campo no console | Valor / ação |
| --- | --- |
| Security group name | `agrosensor-db-sg` |
| Description | `Banco PostgreSQL do AgroSensor` |
| VPC | a VPC padrão |
| Inbound rules | **Add rule**: Type **PostgreSQL** (porta 5432 preenchida automaticamente); Source **Custom**; no campo de busca ao lado, digite `agrosensor` e escolha o grupo `agrosensor-dev-sg` |

Clique em **Create security group**.

### Criando o banco

**Caminho no console:** Aurora and RDS ▸ Databases ▸ Create database

Abra o serviço pela barra de busca (digite `RDS`). No menu à esquerda, clique em **Databases** e depois em **Create database**. A página é longa; preencha seção por seção.

| Campo no console | Valor / ação |
| --- | --- |
| Choose a database creation method | **Standard create** |
| Engine options ▸ Engine type | **PostgreSQL**; mantenha a versão sugerida |
| Templates | **Free tier** ou **Sandbox**; se nenhum aparecer, **Dev/Test** |
| Availability and durability | a opção de instância única: **Single-AZ DB instance deployment** |
| Settings ▸ DB instance identifier | `agrosensor-db` |
| Master username | `postgres` |
| Credentials management | **Self managed** |
| Master password / Confirm | uma senha forte, com pelo menos 8 caracteres, sem `@`, `/`, aspas ou espaços. **Anote-a** |
| Instance configuration | **Burstable classes** ▸ `db.t3.micro` (ou `db.t4g.micro`) |
| Storage | **General Purpose SSD (gp2)**, 20 GiB; em **Additional storage configuration**, desmarque o *storage autoscaling* |
| Connectivity ▸ Compute resource | **Don't connect to an EC2 compute resource** |
| Virtual private cloud (VPC) | a VPC padrão; **DB subnet group**: o padrão |
| Public access | **No** |
| VPC security group (firewall) | **Choose existing**; remova o `default` e selecione `agrosensor-db-sg` |
| Availability Zone | `us-east-1a` |
| Database authentication | **Password authentication** |
| Monitoring | desmarque **Enable Enhanced monitoring** |
| Additional configuration ▸ Initial database name | `agrosensor` (sem isso, o banco da aplicação não é criado) |
| Backup | mantenha os backups automáticos; retenção de **1 dia** é suficiente |
| Encryption | mantenha **Enable encryption** marcado |
| Deletion protection | desmarcado, para facilitar a limpeza no fim |

Confira a estimativa de custo no fim da página e clique em **Create database**. Se aparecer uma janela oferecendo complementos, feche-a. A criação leva de cinco a quinze minutos; o **Status** passa de *Creating* para *Backing-up* e, por fim, *Available*.

<aside class="positive">

**Ponto de verificação.** Clique no nome `agrosensor-db` e, na aba **Connectivity & security**, anote o **Endpoint**, algo como `agrosensor-db.abc123xyz.us-east-1.rds.amazonaws.com`. Confira ali mesmo que **Publicly accessible** está como **No** e que o grupo de segurança é o `agrosensor-db-sg`.

</aside>

## Fase 3: conectando a API ao banco
Duration: 15:00

No terminal do servidor, pare a API e instale o `pg`, o cliente PostgreSQL mais usado no Node.js:

**Terminal do servidor**

```bash
cd ~/agrosensor-api
npm install pg
```

Os dados de conexão não devem ficar escritos no código. Eles vão num arquivo `.env`, lido pelo próprio Node.js com a opção `--env-file`. Crie o arquivo com `nano .env`, trocando os valores pelos seus:

**.env**

```ini
TABELA=agrosensor-leituras
DB_HOST=agrosensor-db.abc123xyz.us-east-1.rds.amazonaws.com
DB_USUARIO=postgres
DB_SENHA=SUA-SENHA-DO-BANCO
DB_NOME=agrosensor
```

Agora crie o módulo que conversa com o banco, `cadastro.js`. Ele usa um **pool de conexões**: em vez de abrir uma conexão nova a cada requisição, o pool mantém algumas abertas e as reaproveita.

**cadastro.js**

```javascript
// cadastro.js - cadastro das estufas no Amazon RDS (PostgreSQL)
const { Pool } = require('pg');

// O pool mantém algumas conexões abertas e as reaproveita entre requisições
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USUARIO || 'postgres',
  password: process.env.DB_SENHA,
  database: process.env.DB_NOME || 'agrosensor',
  port: 5432,
  ssl: { rejectUnauthorized: false }, // o RDS exige conexão cifrada (TLS)
  max: 5
});

async function listarEstufas() {
  const resultado = await pool.query(
    'SELECT id, nome, cultura, temp_min, temp_max FROM estufas ORDER BY id'
  );
  return resultado.rows;
}

module.exports = { pool, listarEstufas };
```

<aside class="negative">

**Sobre o `rejectUnauthorized: false`.** O PostgreSQL do RDS exige conexões cifradas. Com essa opção, a conexão é cifrada, mas o certificado do servidor não é conferido. Em produção, baixa-se o pacote de certificados do RDS e o cliente passa a validar a identidade do banco; a Fase 7 volta ao assunto.

</aside>

A tabela ainda não existe. Um pequeno script cria a tabela e insere o cadastro inicial, usando SQL comum. Crie `preparar-banco.js`:

**preparar-banco.js**

```javascript
// preparar-banco.js - cria a tabela de estufas e insere o cadastro inicial
const { pool } = require('./cadastro');

async function preparar() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS estufas (
      id       VARCHAR(20) PRIMARY KEY,
      nome     VARCHAR(60) NOT NULL,
      cultura  VARCHAR(40) NOT NULL,
      temp_min REAL NOT NULL,
      temp_max REAL NOT NULL
    )`);
  await pool.query(`
    INSERT INTO estufas (id, nome, cultura, temp_min, temp_max) VALUES
      ('estufa-01', 'Estufa Norte', 'Tomate', 20, 28),
      ('estufa-02', 'Estufa Sul', 'Morango', 15, 24),
      ('estufa-03', 'Estufa Leste', 'Alface', 15, 22)
    ON CONFLICT (id) DO NOTHING`); // não duplica se o script rodar de novo
  const { rows } = await pool.query('SELECT * FROM estufas ORDER BY id');
  console.table(rows);
  await pool.end();
}

preparar().catch((erro) => {
  console.error('Falha ao preparar o banco:', erro.message);
  process.exit(1);
});
```

**Terminal do servidor**

```bash
node --env-file=.env preparar-banco.js
```

**Saída esperada**

```text
┌─────────┬─────────────┬────────────────┬───────────┬──────────┬──────────┐
│ (index) │ id          │ nome           │ cultura   │ temp_min │ temp_max │
├─────────┼─────────────┼────────────────┼───────────┼──────────┼──────────┤
│ 0       │ 'estufa-01' │ 'Estufa Norte' │ 'Tomate'  │ 20       │ 28       │
│ 1       │ 'estufa-02' │ 'Estufa Sul'   │ 'Morango' │ 15       │ 24       │
│ 2       │ 'estufa-03' │ 'Estufa Leste' │ 'Alface'  │ 15       │ 22       │
└─────────┴─────────────┴────────────────┴───────────┴──────────┴──────────┘
```

<aside class="negative">

**Se o script ficar parado e der timeout.** Quase sempre é o grupo de segurança. Confira se a regra de entrada do `agrosensor-db-sg` aponta para o **grupo** `agrosensor-dev-sg` (e não para um IP) e se a instância `agrosensor-dev` está mesmo nesse grupo. Se o erro for de senha ou de banco inexistente, revise o `.env` e o campo **Initial database name**.

</aside>

Falta a rota que expõe o cadastro. Abra o `app.js` e acrescente a importação do módulo e a rota `GET /estufas`, antes do `app.listen`. O arquivo completo fica assim:

**app.js**

```javascript
// app.js - API do AgroSensor
const express = require('express');
const os = require('os');
const repositorio = require('./repositorio'); // leituras (DynamoDB)
const cadastro = require('./cadastro');       // estufas (RDS)

const app = express();
const PORTA = process.env.PORTA || 3000;

app.use(express.json()); // transforma o corpo JSON das requisições em objeto

// Verificação de saúde: diz se a API está no ar e qual servidor respondeu
app.get('/saude', (req, res) => {
  res.json({ status: 'ok', servidor: os.hostname() });
});

// Recebe uma leitura enviada por um sensor
app.post('/leituras', async (req, res) => {
  const { sensorId, temperatura, umidade } = req.body;
  if (!sensorId || typeof temperatura !== 'number' || typeof umidade !== 'number') {
    return res.status(400).json({ erro: 'Informe sensorId, temperatura e umidade.' });
  }
  const leitura = {
    sensorId,
    timestamp: new Date().toISOString(), // data e hora em UTC (ISO 8601)
    temperatura,
    umidade,
    servidor: os.hostname() // qual instância processou
  };
  try {
    await repositorio.salvarLeitura(leitura);
    res.status(201).json(leitura);
  } catch (erro) {
    console.error('Erro ao salvar leitura:', erro);
    res.status(500).json({ erro: 'Não foi possível salvar a leitura.' });
  }
});

// Lista as leituras mais recentes de um sensor (ex.: /leituras/estufa-01?limite=10)
app.get('/leituras/:sensorId', async (req, res) => {
  const limite = Math.min(Number(req.query.limite) || 10, 100); // no máximo 100
  try {
    const leituras = await repositorio.listarLeituras(req.params.sensorId, limite);
    res.json(leituras);
  } catch (erro) {
    console.error('Erro ao listar leituras:', erro);
    res.status(500).json({ erro: 'Não foi possível consultar as leituras.' });
  }
});

// Lista o cadastro das estufas (dados relacionais no RDS)
app.get('/estufas', async (req, res) => {
  try {
    res.json(await cadastro.listarEstufas());
  } catch (erro) {
    console.error('Erro ao listar estufas:', erro);
    res.status(500).json({ erro: 'Não foi possível consultar as estufas.' });
  }
});

app.listen(PORTA, () => {
  console.log(`API do AgroSensor ouvindo na porta ${PORTA}`);
});
```

A partir de agora, a API é iniciada com o arquivo de configuração:

**Terminal do servidor**

```bash
node --env-file=.env app.js
```

**CloudShell**

```bash
curl $API/estufas
```

**Saída esperada**

```json
[{"id":"estufa-01","nome":"Estufa Norte","cultura":"Tomate","temp_min":20,"temp_max":28},
 {"id":"estufa-02","nome":"Estufa Sul","cultura":"Morango","temp_min":15,"temp_max":24},
 {"id":"estufa-03","nome":"Estufa Leste","cultura":"Alface","temp_min":15,"temp_max":22}]
```

<aside class="positive">

**Ponto de verificação.** A API agora fala com dois bancos: `/leituras` vem do DynamoDB e `/estufas` vem do RDS. Tente conectar ao endpoint do banco de fora da VPC, por exemplo do seu computador: não funciona, porque o banco não tem acesso público e o grupo de segurança só aceita o servidor.

</aside>

<aside class="positive">

**Entre uma aula e outra.** Um RDS ligado consome orçamento o tempo todo. Ao fim da aula, em **Databases**, selecione `agrosensor-db` e use **Actions ▸ Stop temporarily**. Na aula seguinte, **Actions ▸ Start**. Um banco parado volta a ligar sozinho depois de sete dias.

</aside>

### Arquitetura ao final da Fase 3

![Arquitetura ao final da Fase 3](img/fig-24.webp)

*Arquitetura ao final da Fase 3.*

O RDS PostgreSQL está na mesma zona e na mesma VPC do servidor, sem IP público, e aceita conexões na porta 5432 apenas do grupo de segurança do servidor.

## Fase 4: S3, artefatos e CORS
Duration: 10:00

Esta fase usa o S3 para duas coisas bem diferentes: guardar o código da API como um **artefato**, de onde novos servidores poderão baixá-lo na Fase 5, e publicar o **painel web** da cooperativa como um site estático.

### Armazenamento de objetos

> **Amazon S3 — Simple Storage Service**
>
> Serviço de armazenamento de **objetos**. Um objeto é um arquivo (de poucos bytes a vários terabytes) mais os seus metadados, identificado por uma **chave**. Objetos ficam em **buckets**, contêineres com nome único no mundo, criados em uma região. O S3 é projetado para 99,999999999% (onze noves) de durabilidade.

Não existem pastas de verdade no S3: uma chave como `api/app.js` é só um nome com uma barra, que o console exibe como se fosse uma pasta. Essa parte antes da barra é chamada de **prefixo**. A figura mostra os dois buckets do projeto.

![Os dois buckets do projeto: artefatos (privado) e painel (público)](img/fig-25.webp)

*Os dois buckets do projeto: artefatos (privado) e painel (público).*

| Classe | Quando usar |
| --- | --- |
| S3 Standard | dados acessados com frequência (padrão; é o que usaremos) |
| S3 Intelligent-Tiering | padrão de acesso desconhecido; o S3 move os objetos entre camadas sozinho |
| S3 Standard-IA | acesso raro, mas com recuperação imediata quando necessário |
| S3 Glacier (Instant, Flexible, Deep Archive) | arquivamento de longo prazo, com custo muito baixo |

Por padrão, tudo no S3 é **privado**. O **Block Public Access**, ligado em todo bucket novo, impede que qualquer configuração torne o conteúdo público por engano. Além disso, todo objeto novo é cifrado automaticamente em repouso, com chaves gerenciadas pelo próprio S3 (SSE-S3).

### O bucket de artefatos

**Caminho no console:** S3 ▸ General purpose buckets ▸ Create bucket

| Campo no console | Valor / ação |
| --- | --- |
| AWS Region | confira que é **US East (N. Virginia) us-east-1** |
| Bucket type | **General purpose** |
| Bucket name | `agrosensor-artefatos-SEU-SUFIXO` |
| Object Ownership | **ACLs disabled (recommended)** |
| Block Public Access settings | mantenha **Block all public access** marcado |
| Bucket Versioning | **Disable** por enquanto (a Fase 7 liga) |
| Default encryption | mantenha **SSE-S3** |

Clique em **Create bucket**. Anote o nome exato do bucket.

### Preparando a API para o painel: CORS

O painel será uma página hospedada no S3, com um endereço diferente do endereço da API. Por segurança, o navegador só deixa o JavaScript de uma página ler respostas de **outra origem** (outro domínio, porta ou protocolo) se o servidor autorizar explicitamente. Esse mecanismo é o **CORS**.

![Por que a API precisa enviar o cabeçalho de CORS](img/fig-26.webp)

*Por que a API precisa enviar o cabeçalho de CORS.*

No terminal do servidor, abra o `app.js` e acrescente o trecho de CORS logo abaixo da linha do `express.json()`. O início do arquivo fica assim; o restante continua igual.

**app.js (início do arquivo)**

```javascript
// app.js - API do AgroSensor
const express = require('express');
const os = require('os');
const repositorio = require('./repositorio'); // leituras (DynamoDB)
const cadastro = require('./cadastro');       // estufas (RDS)

const app = express();
const PORTA = process.env.PORTA || 3000;

app.use(express.json()); // transforma o corpo JSON das requisições em objeto

// Permite que o painel, hospedado em outra origem (S3), consulte a API (CORS)
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

// Verificação de saúde: diz se a API está no ar e qual servidor respondeu
app.get('/saude', (req, res) => {
  res.json({ status: 'ok', servidor: os.hostname() });
});
```

Reinicie a API com `node --env-file=.env app.js`.

<aside class="positive">

**No mercado: CORS restrito.** O asterisco libera qualquer origem, o que é aceitável para uma API de leitura pública em estudo. Em produção, o cabeçalho informa só a origem do próprio site (por exemplo, `https://painel.cooperativa.com.br`) e a biblioteca `cors` do Express costuma ser usada para configurar métodos e cabeçalhos permitidos.

</aside>

### Enviando o código para o S3

A instância já tem o papel `LabRole`, que permite usar o S3. Abra uma **segunda** conexão do EC2 Instance Connect (a primeira está com a API rodando) e sincronize a pasta do projeto com o bucket, deixando de fora as dependências e o arquivo com a senha:

**Terminal do servidor**

```bash
cd ~/agrosensor-api

# Copia o projeto para o prefixo api/ do bucket (sem node_modules e sem o .env)
aws s3 sync . s3://agrosensor-artefatos-SEU-SUFIXO/api/ \
  --exclude "node_modules/*" --exclude ".env"

# Lista o que foi enviado
aws s3 ls s3://agrosensor-artefatos-SEU-SUFIXO/api/
```

**Saída esperada**

```text
2026-09-21 14:10:02       2561 app.js
2026-09-21 14:10:02        588 cadastro.js
2026-09-21 14:10:02      61234 package-lock.json
2026-09-21 14:10:02        412 package.json
2026-09-21 14:10:02        913 preparar-banco.js
2026-09-21 14:10:02       1103 repositorio.js
```

<aside class="positive">

**Segredos fora dos artefatos.** O `.env` contém a senha do banco e **nunca** deve ir para um bucket, um repositório Git ou uma imagem. As dependências também não vão: elas são reinstaladas a partir do `package-lock.json`, garantindo as mesmas versões em todo servidor.

</aside>

<aside class="positive">

**Ponto de verificação.** No console do S3, abra o bucket de artefatos: deve aparecer a "pasta" `api/` com os seis arquivos. Tente abrir a **Object URL** de um deles no navegador: o S3 responde `AccessDenied`, porque o bucket é privado.

</aside>

## Fase 4: o painel como site estático
Duration: 20:00

### O bucket do painel

**Caminho no console:** S3 ▸ General purpose buckets ▸ Create bucket

| Campo no console | Valor / ação |
| --- | --- |
| Bucket name | `agrosensor-painel-SEU-SUFIXO` |
| Block Public Access settings | **desmarque** Block all public access e marque a caixa de confirmação que aparece logo abaixo |
| Demais campos | mantenha os valores padrão |

Clique em **Create bucket**. Desmarcar o bloqueio ainda não torna nada público: apenas permite que uma política faça isso. Agora ative a hospedagem de site.

**Caminho no console:** S3 ▸ agrosensor-painel-SEU-SUFIXO ▸ Properties ▸ Static website hosting ▸ Edit

| Campo no console | Valor / ação |
| --- | --- |
| Static website hosting | **Enable** |
| Hosting type | **Host a static website** |
| Index document | `index.html` |

Clique em **Save changes**. De volta à aba **Properties**, role até o fim e anote o **Bucket website endpoint**, algo como `http://agrosensor-painel-SEU-SUFIXO.s3-website-us-east-1.amazonaws.com`. Por fim, crie a política que libera a leitura dos objetos para qualquer pessoa.

**Caminho no console:** S3 ▸ agrosensor-painel-SEU-SUFIXO ▸ Permissions ▸ Bucket policy ▸ Edit

**política do bucket do painel**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "LeituraPublicaDoPainel",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::agrosensor-painel-SEU-SUFIXO/*"
    }
  ]
}
```

Troque `SEU-SUFIXO` pelo seu sufixo e clique em **Save changes**. A política permite uma única ação, `s3:GetObject` (baixar objetos), para qualquer principal (`"*"`), em qualquer objeto do bucket (`/*`). Ninguém de fora consegue listar, enviar ou apagar arquivos.

### Construindo o painel

O painel é feito de três arquivos: HTML, CSS e JavaScript puros, sem framework. Crie uma pasta chamada `painel` no seu computador e abra-a no seu editor de texto. Comece pela estrutura da página:

**index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AgroSensor - Painel</title>
  <link rel="stylesheet" href="estilo.css">
</head>
<body>
  <header>
    <h1>AgroSensor</h1>
    <p>Monitoramento das estufas em tempo (quase) real</p>
  </header>
  <main>
    <label for="estufa">Estufa:</label>
    <select id="estufa"></select>
    <p id="descricao"></p>
    <section class="cartoes">
      <div class="cartao"><span>Temperatura</span><strong id="temperatura">--</strong></div>
      <div class="cartao"><span>Umidade</span><strong id="umidade">--</strong></div>
    </section>
    <table>
      <thead>
        <tr><th>Horário</th><th>Temperatura (°C)</th><th>Umidade (%)</th><th>Servidor</th></tr>
      </thead>
      <tbody id="linhas"></tbody>
    </table>
    <p id="status">Carregando...</p>
  </main>
  <script src="painel.js"></script>
</body>
</html>
```

Depois, a aparência. A classe `alerta` será usada para destacar o cartão de temperatura quando a leitura sair da faixa ideal da cultura.

**estilo.css**

```css
/* estilo.css - aparência do painel */
body { font-family: system-ui, sans-serif; margin: 0; background: #f4f6f3; color: #1f2a1f; }
header { background: #2e7d32; color: white; padding: 1rem 2rem; }
header h1 { margin: 0; }
main { max-width: 820px; margin: 1.5rem auto; padding: 0 1rem; }
select { font-size: 1rem; padding: 0.3rem; }

.cartoes { display: flex; gap: 1rem; margin: 1rem 0; }
.cartao {
  flex: 1;
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}
.cartao span { display: block; color: #5f6b5f; }
.cartao strong { font-size: 2rem; }
.cartao.alerta { outline: 3px solid #c62828; background: #fdecea; }

table { width: 100%; border-collapse: collapse; background: white; }
th, td { padding: 0.5rem; border-bottom: 1px solid #e0e0e0; text-align: left; }
th { background: #e8f0e8; }
#status { color: #5f6b5f; font-size: 0.9rem; }
```

Agora o comportamento. O `painel.js` tem três partes: a primeira busca o cadastro das estufas no RDS, por meio da API, e monta a lista de seleção; a segunda busca as leituras da estufa escolhida no DynamoDB, sempre por meio da API, e preenche os cartões e a tabela; a última inicializa a página: carrega o cadastro, reage à troca de estufa e atualiza as leituras a cada cinco segundos. Troque o endereço da constante `URL_API` pelo IP público do seu servidor.

**painel.js**

```javascript
// painel.js - busca os dados na API e atualiza a tela
const URL_API = 'http://SEU-IP-PUBLICO:3000'; // endereço da sua API

const seletor = document.getElementById('estufa');
let estufas = []; // cadastro vindo do RDS

// Carrega o cadastro das estufas e monta a lista de seleção
async function carregarEstufas() {
  const resposta = await fetch(`${URL_API}/estufas`);
  estufas = await resposta.json();
  seletor.innerHTML = estufas
    .map((e) => `<option value="${e.id}">${e.nome} (${e.cultura})</option>`)
    .join('');
}

// Busca as últimas leituras da estufa escolhida
async function atualizar() {
  const estufa = estufas.find((e) => e.id === seletor.value);
  if (!estufa) return;
  document.getElementById('descricao').textContent =
    `Faixa ideal para ${estufa.cultura}: de ${estufa.temp_min} °C a ${estufa.temp_max} °C`;
  try {
    const resposta = await fetch(`${URL_API}/leituras/${estufa.id}?limite=10`);
    const leituras = await resposta.json();
    mostrar(leituras, estufa);
    document.getElementById('status').textContent =
      `Atualizado às ${new Date().toLocaleTimeString('pt-BR')}`;
  } catch (erro) {
    document.getElementById('status').textContent = 'Não foi possível falar com a API.';
  }
}

// Preenche cartões e tabela; destaca temperatura fora da faixa ideal
function mostrar(leituras, estufa) {
  const ultima = leituras[0];
  const temperatura = document.getElementById('temperatura');
  temperatura.textContent = ultima ? `${ultima.temperatura} °C` : '--';
  document.getElementById('umidade').textContent = ultima ? `${ultima.umidade} %` : '--';
  const fora = ultima && (ultima.temperatura < estufa.temp_min || ultima.temperatura > estufa.temp_max);
  temperatura.parentElement.classList.toggle('alerta', Boolean(fora));
  document.getElementById('linhas').innerHTML = leituras.map((l) => `
    <tr>
      <td>${new Date(l.timestamp).toLocaleTimeString('pt-BR')}</td>
      <td>${l.temperatura}</td>
      <td>${l.umidade}</td>
      <td>${l.servidor}</td>
    </tr>`).join('');
}

// Inicialização: carrega o cadastro e atualiza a cada 5 segundos
async function iniciar() {
  try {
    await carregarEstufas();
    seletor.addEventListener('change', atualizar);
    atualizar();
    setInterval(atualizar, 5000);
  } catch (erro) {
    document.getElementById('status').textContent = 'Não foi possível carregar as estufas.';
  }
}

iniciar();
```

<aside class="positive">

**Ponto de verificação.** Antes de publicar, teste no seu computador: com a API e o simulador rodando, dê um duplo clique no `index.html`. O painel deve mostrar as três estufas, os cartões e a tabela atualizando a cada cinco segundos. Quando a temperatura sair da faixa da cultura, o cartão fica vermelho.

</aside>

### Publicando o painel

**Caminho no console:** S3 ▸ agrosensor-painel-SEU-SUFIXO ▸ Objects ▸ Upload

Clique em **Add files**, selecione os três arquivos da pasta `painel` e clique em **Upload**. Quando terminar, abra o **Bucket website endpoint** anotado.

<aside class="positive">

**Ponto de verificação.** O painel abre pelo endereço do S3, acessível de qualquer navegador, inclusive do celular. Se aparecer `403 Forbidden`, revise a política do bucket; se a página abrir mas mostrar "Não foi possível carregar as estufas", confira a `URL_API` e se a API está rodando com o cabeçalho de CORS.

</aside>

<aside class="positive">

**No mercado: CloudFront na frente do S3.** Sites estáticos em produção raramente são servidos direto pelo endpoint de site do S3, que só funciona com HTTP. O padrão é colocar o **Amazon CloudFront** na frente: ele entrega o conteúdo a partir dos locais de borda, com HTTPS, domínio próprio e cache, enquanto o bucket continua privado e acessível só pelo CloudFront.

</aside>

### Arquitetura ao final da Fase 4

![Arquitetura ao final da Fase 4](img/fig-27.webp)

*Arquitetura ao final da Fase 4.*

O navegador baixa o painel do bucket público e consulta a API diretamente; o código da API está guardado no bucket privado de artefatos. Ainda há um ponto fraco evidente: tudo depende de um único servidor, numa única zona, com um IP que muda a cada sessão.

## Fase 5: balanceador e target group
Duration: 15:00

Até aqui, o AgroSensor inteiro depende de uma única instância. Se ela cair, se a zona `us-east-1a` tiver um problema ou se o tráfego triplicar, o sistema para. Nesta fase, a API passa a rodar em várias instâncias idênticas, espalhadas em duas zonas, atrás de um balanceador de carga e controladas por um grupo que cria e destrói instâncias conforme a necessidade.

### Escalar para cima ou para os lados

![Escalabilidade vertical e horizontal](img/fig-28.webp)

*Escalabilidade vertical e horizontal.*

Escalar **verticalmente** é trocar a máquina por uma maior. É simples, mas tem teto e costuma exigir parada. Escalar **horizontalmente** é acrescentar mais cópias da aplicação e dividir o trabalho entre elas. Não tem teto prático e ainda protege contra falhas, mas só funciona se a aplicação for **sem estado**.

> **Aplicação sem estado (*stateless*)**
>
> Aplicação que não guarda na memória nem no disco local nada que precise sobreviver entre requisições. Qualquer instância pode atender qualquer requisição, porque os dados ficam em serviços externos. A API do AgroSensor se tornou sem estado na Fase 2, quando as leituras foram para o DynamoDB, e o cadastro já nasceu no RDS.

### As peças da escalabilidade na AWS

Quatro componentes trabalham juntos, como mostra a figura.

![Balanceador, target group, Auto Scaling group e launch template](img/fig-29.webp)

*Balanceador, target group, Auto Scaling group e launch template.*

> **Elastic Load Balancing**
>
> Serviço de balanceadores de carga gerenciados, que distribuem requisições entre vários destinos em várias zonas. O **Application Load Balancer (ALB)** trabalha com HTTP e HTTPS e decide o destino olhando para a requisição (caminho, cabeçalhos). Um **listener** escuta uma porta, como a 80, e encaminha o tráfego para um **target group**.

> **Target group e verificação de saúde**
>
> Grupo de destinos (instâncias, por exemplo) que recebem o tráfego de um balanceador. O target group testa periodicamente cada destino com uma requisição de **health check**, no nosso caso `GET /saude`; só os destinos sadios recebem tráfego.

> **Launch template**
>
> "Receita" de uma instância: AMI, tipo, grupo de segurança, papel IAM e **user data**, o script que roda automaticamente na primeira inicialização. É o que permite criar instâncias idênticas sem ninguém digitar comandos.

> **EC2 Auto Scaling group**
>
> Conjunto de instâncias criadas a partir de um launch template, com capacidade **mínima**, **desejada** e **máxima**. O grupo mantém sempre a quantidade desejada: se uma instância falha, ele a substitui. Uma **política de escalonamento** ajusta a capacidade desejada conforme uma métrica.

| Tipo | Camada | Uso típico |
| --- | --- | --- |
| Application Load Balancer | 7 (HTTP/HTTPS) | APIs e sites; roteamento por caminho ou domínio (**nossa escolha**) |
| Network Load Balancer | 4 (TCP/UDP) | altíssimo desempenho, IP fixo, protocolos que não são HTTP |
| Gateway Load Balancer | 3 (IP) | aparelhos de segurança de terceiros, como firewalls |

A política que usaremos é a de **rastreamento de alvo** (*target tracking*): você escolhe uma métrica e um valor, e o Auto Scaling cria e remove instâncias para mantê-la perto desse valor, como um termostato. Nossa métrica será a quantidade de requisições por instância por minuto, com alvo de 100.

### Grupos de segurança da aplicação

Agora a porta de entrada será o balanceador. As instâncias da aplicação não precisam, e não devem, aceitar conexões vindas direto da internet: só do balanceador. Crie dois grupos.

**Caminho no console:** EC2 ▸ Network & Security ▸ Security Groups ▸ Create security group

| Campo no console | Valor / ação |
| --- | --- |
| Security group name | `agrosensor-alb-sg` |
| Description | `Balanceador do AgroSensor` |
| Inbound rules | Type **HTTP** (porta 80), Source **Anywhere-IPv4** |

Crie o grupo e repita o processo para o grupo da aplicação:

| Campo no console | Valor / ação |
| --- | --- |
| Security group name | `agrosensor-app-sg` |
| Description | `Instancias da API do AgroSensor` |
| Inbound rules | Type **Custom TCP**, Port range **3000**, Source **Custom** ▸ grupo `agrosensor-alb-sg` |

Por fim, o banco precisa aceitar as novas instâncias. Selecione o grupo `agrosensor-db-sg`, abra a aba **Inbound rules** e clique em **Edit inbound rules**. Clique em **Add rule**, escolha Type **PostgreSQL**, Source **Custom** ▸ grupo `agrosensor-app-sg`, e clique em **Save rules**.

### Target group

**Caminho no console:** EC2 ▸ Load Balancing ▸ Target Groups ▸ Create target group

| Campo no console | Valor / ação |
| --- | --- |
| Choose a target type | **Instances** |
| Target group name | `agrosensor-tg` |
| Protocol : Port | **HTTP : 3000** |
| IP address type | **IPv4** |
| VPC | a VPC padrão |
| Protocol version | **HTTP1** |
| Health check path | `/saude` |
| Advanced health check settings | Healthy threshold **2**; Interval **10** segundos |

Clique em **Next**. Na tela **Register targets**, **não** selecione nenhuma instância: quem vai registrar as instâncias é o Auto Scaling. Clique em **Create target group**.

### Application Load Balancer

**Caminho no console:** EC2 ▸ Load Balancing ▸ Load Balancers ▸ Create load balancer

Em **Application Load Balancer**, clique em **Create**.

| Campo no console | Valor / ação |
| --- | --- |
| Load balancer name | `agrosensor-alb` |
| Scheme | **Internet-facing** |
| Load balancer IP address type | **IPv4** |
| Network mapping ▸ VPC | a VPC padrão |
| Availability Zones and subnets | marque `us-east-1a` e `us-east-1b` (a sub-rede de cada zona é selecionada automaticamente) |
| Security groups | remova o `default` e selecione `agrosensor-alb-sg` |
| Listeners and routing | Protocol **HTTP**, Port **80**, Default action: **Forward to target group** ▸ `agrosensor-tg` |

Mantenha as demais seções como estão e clique em **Create load balancer**. O **State** começa como *Provisioning* e passa para *Active* em alguns minutos. Na aba **Details**, copie o **DNS name**, algo como `agrosensor-alb-1234567890.us-east-1.elb.amazonaws.com`, e anote-o. Esse endereço não muda, ao contrário do IP das instâncias.

## Fase 5: launch template e Auto Scaling
Duration: 15:00

### Launch template com user data

O launch template precisa deixar cada instância nova pronta sozinha, do zero: instalar o Node.js, baixar o código do bucket de artefatos, instalar as dependências e registrar a API como um serviço do sistema. É o que o **user data** faz, passo a passo.

![O que acontece desde o lançamento até a instância receber tráfego](img/fig-30.webp)

*O que acontece desde o lançamento até a instância receber tráfego.*

A API vai rodar como um serviço do **systemd**, o gerenciador de serviços do Linux: ele a inicia no boot, reinicia se ela cair e guarda os logs. As variáveis de ambiente, que no servidor de desenvolvimento vinham do `.env`, passam a vir da definição do serviço. Prepare o script num editor de texto, trocando os três valores em maiúsculas pelos seus:

**user data do launch template**

```bash
#!/bin/bash
# Executado como root na primeira inicialização da instância
export HOME=/root

# 1. Instala o Node.js 22 e garante os comandos node e npm
dnf install -y nodejs22
[ -x /usr/bin/node ] || ln -s /usr/bin/node-22 /usr/bin/node
[ -x /usr/bin/npm ] || ln -s /usr/bin/npm-22 /usr/bin/npm

# 2. Baixa o código da API do bucket de artefatos e instala as dependências
mkdir -p /opt/agrosensor
aws s3 sync s3://agrosensor-artefatos-SEU-SUFIXO/api/ /opt/agrosensor/
cd /opt/agrosensor
npm ci --omit=dev

# 3. Registra a API como serviço do sistema
cat > /etc/systemd/system/agrosensor.service << 'EOF'
[Unit]
Description=API do AgroSensor
After=network-online.target

[Service]
WorkingDirectory=/opt/agrosensor
ExecStart=/usr/bin/node app.js
Restart=always
Environment=PORTA=3000
Environment=TABELA=agrosensor-leituras
Environment=DB_HOST=ENDPOINT-DO-RDS
Environment=DB_USUARIO=postgres
Environment=DB_SENHA=SENHA-DO-BANCO
Environment=DB_NOME=agrosensor

[Install]
WantedBy=multi-user.target
EOF

# 4. Inicia o serviço agora e a cada reinicialização
systemctl daemon-reload
systemctl enable --now agrosensor
```

<aside class="negative">

**A senha do banco no user data.** O user data pode ser lido por qualquer pessoa com permissão de consultar as instâncias. Deixar a senha ali é uma simplificação didática; a Fase 7 discute como isso é feito corretamente.

</aside>

**Caminho no console:** EC2 ▸ Instances ▸ Launch Templates ▸ Create launch template

| Campo no console | Valor / ação |
| --- | --- |
| Launch template name | `agrosensor-lt` |
| Template version description | `API AgroSensor v1` |
| Auto Scaling guidance | marque **Provide guidance to help me set up a template that I can use with EC2 Auto Scaling** |
| Application and OS Images | **Quick Start** ▸ **Amazon Linux** ▸ **Amazon Linux 2023 AMI** |
| Instance type | `t3.micro` |
| Key pair (login) | **Don't include in launch template** |
| Network settings ▸ Subnet | **Don't include in launch template** |
| Firewall (security groups) | **Select existing security group** ▸ `agrosensor-app-sg` |
| Advanced details ▸ IAM instance profile | `LabInstanceProfile` |
| Advanced details ▸ Metadata version | **V2 only (token required)** |
| Advanced details ▸ User data | cole o script acima, já com os seus valores |

Clique em **Create launch template**.

### Auto Scaling group

**Caminho no console:** EC2 ▸ Auto Scaling ▸ Auto Scaling Groups ▸ Create Auto Scaling group

O assistente tem sete etapas.

![Etapas do assistente de criação do Auto Scaling group](img/fig-31.webp)

*Etapas do assistente de criação do Auto Scaling group.*

| Campo no console | Valor / ação |
| --- | --- |
| 1. Auto Scaling group name | `agrosensor-asg` |
| 1. Launch template | `agrosensor-lt`, versão **Default** |
| 2. VPC | a VPC padrão |
| 2. Availability Zones and subnets | as sub-redes de `us-east-1a` e `us-east-1b` |
| 3. Load balancing | **Attach to an existing load balancer** ▸ **Choose from your load balancer target groups** ▸ `agrosensor-tg` |
| 3. Health checks | marque **Turn on Elastic Load Balancing health checks**; mantenha o *grace period* de 300 segundos |
| 4. Desired capacity | **2** |
| 4. Scaling limits | Min desired capacity **2**; Max desired capacity **4** |
| 4. Automatic scaling | **Target tracking scaling policy** |
| 4. Metric type | **Application Load Balancer request count per target**, target group `agrosensor-tg` |
| 4. Target value | **100**; Instance warmup **60** segundos |
| 4. Additional settings | marque **Enable group metrics collection within CloudWatch** |
| 5. Add notifications | não adicione nada; **Next** |
| 6. Add tags | **Add tag**: Key `Name`, Value `agrosensor-app` |
| 7. Review | confira tudo e clique em **Create Auto Scaling group** |

## Fase 5: balanceamento e resiliência
Duration: 10:00

### Verificando o balanceamento

Em **Instances**, aparecem duas instâncias `agrosensor-app`, uma em cada zona. Em **Target Groups ▸ agrosensor-tg ▸** aba **Targets**, o **Health status** começa como *initial* e, depois de alguns minutos, fica *healthy*. Quando as duas estiverem sadias, teste pelo CloudShell:

**CloudShell**

```bash
# Troque pelo DNS name do seu balanceador
ALB=http://agrosensor-alb-1234567890.us-east-1.elb.amazonaws.com

# Seis chamadas seguidas: repare no campo "servidor"
for i in 1 2 3 4 5 6; do curl -s $ALB/saude; echo; done
```

**Saída esperada**

```json
{"status":"ok","servidor":"ip-172-31-41-18.ec2.internal"}
{"status":"ok","servidor":"ip-172-31-90-201.ec2.internal"}
{"status":"ok","servidor":"ip-172-31-41-18.ec2.internal"}
{"status":"ok","servidor":"ip-172-31-90-201.ec2.internal"}
...
```

As respostas se alternam entre as duas instâncias. Agora aponte o simulador para o balanceador:

**CloudShell**

```bash
node simulador.js $ALB 3 5000
```

<aside class="negative">

**Se os alvos ficarem *unhealthy*.** Conecte-se a uma das instâncias pelo Session Manager (**Instances** ▸ selecione a instância ▸ **Connect** ▸ aba **Session Manager** ▸ **Connect**) e veja o log do user data com `sudo tail -50 /var/log/cloud-init-output.log`. Os erros mais comuns são nome do bucket errado, endpoint ou senha do banco errados e a regra do `agrosensor-app-sg` apontando para uma origem diferente do grupo do balanceador. Depois de corrigir o launch template, crie uma nova versão, defina-a como padrão e encerre as instâncias antigas: o grupo cria outras já com a versão nova.

</aside>

Falta o painel. No seu computador, altere a primeira linha do `painel.js` para usar o balanceador, sem porta, já que ele escuta na porta 80:

**painel.js (início do arquivo)**

```javascript
// painel.js - busca os dados na API e atualiza a tela
const URL_API = 'http://agrosensor-alb-1234567890.us-east-1.elb.amazonaws.com';
```

Envie de novo o `painel.js` para o bucket do painel (**Objects ▸ Upload**; o arquivo antigo é substituído) e recarregue o site com **Ctrl+F5**.

<aside class="positive">

**Ponto de verificação.** No painel, a coluna **Servidor** passa a mostrar os nomes das duas instâncias, alternando. O painel não depende mais do IP de uma máquina específica.

</aside>

### Teste de resiliência

Com o simulador e o painel funcionando, simule uma falha: em **Instances**, selecione uma das instâncias `agrosensor-app` e use **Instance state ▸ Terminate (delete) instance**. Observe:

1. o painel e o simulador continuam funcionando, agora sempre com o mesmo servidor;
2. em **Auto Scaling Groups ▸ agrosensor-asg ▸** aba **Activity**, aparece o registro da instância encerrada e, logo depois, o lançamento de uma substituta;
3. alguns minutos depois, a nova instância fica *healthy* no target group e volta a receber tráfego.

Ninguém precisou fazer nada: o grupo percebeu que havia menos instâncias do que o desejado e corrigiu. Isso é **autorrecuperação**.

<aside class="positive">

**Economizando o orçamento entre aulas.** Ao fim da aula, zere o grupo: em `agrosensor-asg`, na seção **Group details**, clique em **Edit** e defina **Desired capacity 0** e **Min desired capacity 0**. As instâncias são encerradas. Na aula seguinte, volte para 2 e 2. Assim o laboratório também não tenta repor instâncias paradas enquanto a sessão estiver fechada.

</aside>

### Arquitetura ao final da Fase 5

![Arquitetura ao final da Fase 5](img/fig-32.webp)

*Arquitetura ao final da Fase 5.*

O tráfego entra pelo balanceador, que o distribui entre instâncias em duas zonas, todas criadas a partir do launch template e com o código baixado do bucket de artefatos no boot. As instâncias gravam no DynamoDB e consultam o RDS. O servidor de desenvolvimento ainda existe, mas deixou de fazer parte do caminho do tráfego e não aparece mais no diagrama.

## Fase 6: CloudWatch e SNS
Duration: 15:00

Um sistema distribuído tem muitas peças, e é impossível acompanhar cada uma olhando consoles. É preciso **medir tudo continuamente** e **ser avisado** quando algo sai do normal.

### Amazon CloudWatch

> **Amazon CloudWatch**
>
> Serviço de observabilidade da AWS. Recebe **métricas** de praticamente todos os serviços, armazena **logs**, avalia **alarmes** e exibe **painéis** (*dashboards*).

Alguns termos aparecem o tempo todo:

* **métrica:** uma série de valores ao longo do tempo, como `CPUUtilization` ou `RequestCount`;
* **namespace:** o "endereço" da métrica, normalmente o serviço de origem, como `AWS/EC2` ou `AWS/ApplicationELB`;
* **dimensão:** o recurso a que a métrica se refere, como um balanceador ou um Auto Scaling group específico;
* **estatística e período:** como agregar os valores (soma, média, máximo) e em que janela (1 minuto, 5 minutos).

Um **alarme** observa uma métrica e muda de estado conforme ela se compara a um limite; a cada mudança, pode executar ações, como mostra a figura.

![Métrica, estados de um alarme e ações](img/fig-33.webp)

*Métrica, estados de um alarme e ações.*

> **Amazon SNS — Simple Notification Service**
>
> Serviço de mensagens do tipo publicar e assinar. Um produtor publica uma mensagem em um **tópico**, e o SNS entrega uma cópia para cada **assinatura**: e-mail, SMS, uma fila, uma função, um endereço HTTP.

### O tópico de alertas

**Caminho no console:** Simple Notification Service ▸ Topics ▸ Create topic

| Campo no console | Valor / ação |
| --- | --- |
| Type | **Standard** |
| Name | `agrosensor-alertas` |

Clique em **Create topic**. Na página do tópico, clique em **Create subscription**:

| Campo no console | Valor / ação |
| --- | --- |
| Protocol | **Email** |
| Endpoint | o seu endereço de e-mail |

Clique em **Create subscription**. Em poucos minutos chega um e-mail com o assunto "AWS Notification - Subscription Confirmation"; clique no link **Confirm subscription**. No console, o **Status** da assinatura muda de *Pending confirmation* para *Confirmed*.

### Alarme de pico de tráfego

**Caminho no console:** CloudWatch ▸ Alarms ▸ All alarms ▸ Create alarm

Clique em **Select metric** e navegue por **ApplicationELB ▸ Per AppELB Metrics**. Marque a linha da métrica `RequestCount` do balanceador `agrosensor-alb` e clique em **Select metric**.

| Campo no console | Valor / ação |
| --- | --- |
| Statistic | **Sum** |
| Period | **1 minute** |
| Threshold type | **Static** |
| Whenever RequestCount is... | **Greater** ▸ **1000** |
| Additional configuration | Datapoints to alarm **1 de 1**; Missing data treatment: **Treat missing data as good** |

Clique em **Next**. Em **Notification**, mantenha **In alarm**, escolha **Select an existing SNS topic** e selecione `agrosensor-alertas`. Clique em **Next**, dê o nome `agrosensor-pico-trafego`, clique em **Next** e, por fim, em **Create alarm**.

<aside class="positive">

**Os alarmes que você não criou.** A lista de alarmes também mostra dois alarmes com nomes como `TargetTracking-agrosensor-asg-AlarmHigh-...` e `...AlarmLow-...`. Eles foram criados pela política de escalonamento da Fase 5 e são eles que decidem quando o grupo cresce ou encolhe. Não os altere: se a política for removida, eles somem junto.

</aside>

### O painel de métricas

**Caminho no console:** CloudWatch ▸ Dashboards ▸ Create dashboard

Dê o nome `agrosensor` e clique em **Create dashboard**. Para cada linha da tabela abaixo, adicione um widget: escolha o tipo, clique em **Next**, navegue até a métrica, marque o recurso e clique em **Create widget**. Use o botão **+** para adicionar os seguintes.

| Tipo | Caminho da métrica | Métrica e ajuste |
| --- | --- | --- |
| Line | ApplicationELB ▸ Per AppELB Metrics | `RequestCount`, estatística **Sum**, período 1 minuto |
| Number | AutoScaling ▸ Group Metrics | `GroupInServiceInstances` do `agrosensor-asg` |
| Line | EC2 ▸ By Auto Scaling Group | `CPUUtilization` do `agrosensor-asg` |
| Line | DynamoDB ▸ Table Metrics | `ConsumedWriteCapacityUnits` de `agrosensor-leituras` |
| Line | RDS ▸ Per-Database Metrics | `DatabaseConnections` de `agrosensor-db` |

Ajuste o intervalo de tempo no topo para **1h**, ative a atualização automática a cada 10 segundos e clique em **Save**.

## Fase 6: teste de carga
Duration: 15:00

É hora de provocar um pico, como o da manhã em que todos os sensores religam. Pare o simulador que estiver rodando e inicie outro com 20 sensores, cada um enviando duas leituras por segundo, o que dá cerca de 2.400 requisições por minuto:

**CloudShell**

```bash
node simulador.js $ALB 20 500
```

Deixe o simulador rodando por uns dez minutos e acompanhe o painel do CloudWatch, a aba **Activity** do Auto Scaling group e a lista de instâncias. O comportamento esperado aparece na figura.

![Comportamento esperado durante o teste de carga](img/fig-34.webp)

*Comportamento esperado durante o teste de carga (dados ilustrativos).*

1. Em um ou dois minutos, as requisições por instância passam muito do alvo de 100. O alarme `agrosensor-pico-trafego` entra em **ALARM** e o e-mail chega.
2. Depois de três minutos acima do alvo, o alarme **AlarmHigh** da política dispara e o grupo aumenta a capacidade desejada. Novas instâncias são lançadas, até o máximo de 4.
3. Assim que as novas instâncias ficam sadias, a carga se divide por mais servidores e o painel do AgroSensor passa a mostrar mais nomes na coluna **Servidor**.
4. Pare o simulador com **Ctrl+C**. O tráfego despenca, o alarme de pico volta a **OK** e, cerca de quinze minutos depois, o **AlarmLow** faz o grupo voltar para 2 instâncias.

<aside class="positive">

**Por que diminuir é mais lento que aumentar.** A política reage rápido ao aumento, porque falta de capacidade prejudica usuários, e devagar à redução, porque encerrar instâncias cedo demais e ter de criá-las de novo no pico seguinte custa tempo e dinheiro.

</aside>

<aside class="positive">

**No mercado: logs, rastreamento e SLOs.** Além de métricas, equipes enviam os logs das aplicações ao CloudWatch Logs (com o agente do CloudWatch ou direto da aplicação), usam **rastreamento distribuído** para seguir uma requisição por vários serviços (AWS X-Ray, OpenTelemetry) e definem **objetivos de nível de serviço**, como "99,9% das requisições respondidas em menos de 300 ms", com alarmes ligados a eles.

</aside>

### Arquitetura ao final da Fase 6

![Arquitetura ao final da Fase 6](img/fig-35.webp)

*Arquitetura ao final da Fase 6.*

O CloudWatch recebe métricas do balanceador, das instâncias, do grupo e dos bancos; quando um alarme dispara, o SNS entrega o aviso por e-mail à equipe.

## Fase 7: segurança em camadas
Duration: 20:00

O sistema funciona, escala e avisa quando algo dá errado. Esta fase revisa a arquitetura com olhos de quem quer invadi-la ou de quem precisa garantir que os dados sobrevivam a qualquer acidente.

### Defesa em profundidade

Nenhuma medida isolada protege um sistema. A ideia de **defesa em profundidade** é empilhar camadas independentes, de modo que a falha de uma não comprometa tudo.

![Camadas de segurança do AgroSensor](img/fig-36.webp)

*Camadas de segurança do AgroSensor.*

A tabela aplica o modelo de responsabilidade compartilhada, visto no passo sobre a AWS, ao projeto.

| Item | Responsável | No projeto |
| --- | --- | --- |
| Data centers, hardware e rede física | AWS | — |
| Infraestrutura do DynamoDB, S3 e balanceador | AWS | — |
| Correções do PostgreSQL | AWS (RDS) | aplicadas na janela de manutenção |
| Sistema operacional das instâncias | cliente | cada instância nova nasce da AMI atual do Amazon Linux |
| Regras de rede | cliente | grupos de segurança encadeados e banco sem acesso público |
| Identidades e permissões | cliente | papel IAM na instância; nenhuma chave no código |
| Criptografia dos dados | cliente configura | ativada em S3, DynamoDB e RDS; TLS até os serviços |
| Código da aplicação | cliente | validação de entrada, dependências fixadas no lockfile |

### Rede: grupos de segurança encadeados

Os três grupos criados formam uma corrente: a internet só alcança o balanceador; o balanceador só alcança as instâncias; as instâncias só alcançam o banco.

![Grupos de segurança encadeados](img/fig-37.webp)

*Grupos de segurança encadeados.*

<aside class="positive">

**Ponto de verificação.** Em **Instances**, copie o **Public IPv4 address** de uma instância `agrosensor-app` e tente acessá-la direto pelo CloudShell com `curl --max-time 5 http://IP-DA-INSTANCIA:3000/saude`. O comando termina com *timeout*: só o balanceador pode falar com a porta 3000. Pelo `$ALB/saude`, tudo continua funcionando.

</aside>

### Aposentando o servidor de desenvolvimento

O servidor `agrosensor-dev` tem a porta 22 e a porta 3000 abertas para o mundo e não é mais necessário. Removê-lo exige uma ordem, porque o grupo dele é citado numa regra do grupo do banco.

1. **Remova a referência:** em **Security Groups**, selecione `agrosensor-db-sg`, clique em **Edit inbound rules**, apague a regra cuja origem é `agrosensor-dev-sg` (fica só a regra do `agrosensor-app-sg`) e clique em **Save rules**.
2. **Encerre a instância:** em **Instances**, selecione `agrosensor-dev` e use **Instance state ▸ Terminate (delete) instance**.
3. **Apague o grupo:** quando a instância estiver *Terminated*, selecione `agrosensor-dev-sg` e use **Actions ▸ Delete security groups**.

<aside class="positive">

**"The security group is referenced by another security group".** Essa mensagem aparece quando se tenta apagar um grupo ainda citado em regras de outro grupo. Remova a regra que o referencia e tente de novo.

</aside>

### Acesso às instâncias sem SSH

Nenhuma instância em produção tem mais a porta 22 aberta, mas a equipe ainda precisa, às vezes, olhar um servidor por dentro. O **AWS Systems Manager Session Manager** abre um terminal no navegador por meio de um agente que já vem instalado no Amazon Linux e que se conecta **de dentro para fora** com a AWS, usando as permissões do papel da instância. Não há porta aberta nem chave SSH para guardar, e cada sessão pode ser registrada para auditoria.

**Caminho no console:** EC2 ▸ Instances ▸ (selecione uma `agrosensor-app`) ▸ Connect ▸ Session Manager

Clique em **Connect** e rode alguns comandos de diagnóstico:

**Session Manager**

```bash
# Estado do serviço da API
sudo systemctl status agrosensor --no-pager

# Últimas linhas do log da API
sudo journalctl -u agrosensor -n 20 --no-pager

# A API respondendo localmente
curl -s localhost:3000/saude
```

### Identidade: o princípio do menor privilégio

> **Menor privilégio**
>
> Cada identidade recebe apenas as permissões estritamente necessárias para a sua tarefa, nos recursos específicos em que atua, e nada além.

O `LabRole` do laboratório é propositalmente amplo, para facilitar os estudos. Em uma conta real, as instâncias do AgroSensor teriam um papel próprio com uma política como a abaixo, que só permite gravar e consultar a tabela do projeto e baixar o código do bucket de artefatos. Para o Session Manager, seria anexada também a política gerenciada `AmazonSSMManagedInstanceCore`.

**política de menor privilégio (exemplo para contas reais)**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "LeiturasNoDynamoDB",
      "Effect": "Allow",
      "Action": ["dynamodb:PutItem", "dynamodb:Query"],
      "Resource": "arn:aws:dynamodb:us-east-1:ID-DA-CONTA:table/agrosensor-leituras"
    },
    {
      "Sid": "CodigoNoS3",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::agrosensor-artefatos-SEU-SUFIXO",
        "arn:aws:s3:::agrosensor-artefatos-SEU-SUFIXO/api/*"
      ]
    }
  ]
}
```

<aside class="negative">

**Permissões com asterisco.** Políticas com `"Action": "*"` e `"Resource": "*"` resolvem qualquer erro de permissão na hora, e por isso são tão tentadoras. Elas transformam qualquer falha na aplicação, como uma dependência comprometida, em acesso total à conta.

</aside>

### Criptografia em repouso e em trânsito

Em repouso, os três serviços de dados do projeto já cifram tudo o que guardam. Confira no console:

| Campo no console | Valor / ação |
| --- | --- |
| DynamoDB ▸ agrosensor-leituras ▸ Additional settings | Encryption: **Owned by Amazon DynamoDB** |
| S3 ▸ cada bucket ▸ Properties | Default encryption: **SSE-S3** |
| RDS ▸ agrosensor-db ▸ Configuration | Encryption: **Enabled**, chave `aws/rds` do AWS KMS |

> **AWS KMS — Key Management Service**
>
> Serviço que cria e guarda chaves criptográficas e controla quem pode usá-las. Os serviços da AWS usam chaves do KMS para cifrar dados; é possível usar chaves gerenciadas pela AWS ou chaves próprias, com política de acesso e rotação definidas pelo cliente.

Os discos EBS das instâncias podem ser cifrados marcando **Encrypted** na seção de armazenamento do launch template, ou para a conta inteira, em **EC2 Dashboard ▸ Account attributes ▸ Data protection and security**, quando essa configuração estiver disponível.

Em trânsito, o SDK fala com o DynamoDB e a CLI fala com o S3 sempre por HTTPS, e a conexão com o RDS usa TLS. O trecho ainda sem criptografia é o dos sensores e do navegador até o balanceador, que usa HTTP.

<aside class="positive">

**No mercado: HTTPS no balanceador e certificados validados.** Em produção, a organização registra um domínio (por exemplo, com o Amazon Route 53), emite um certificado gratuito no AWS Certificate Manager, cria um listener **HTTPS** na porta 443 no balanceador e configura o listener da porta 80 para redirecionar para o 443. Na conexão com o banco, o cliente passa a validar o certificado do RDS com o pacote oficial de certificados, em vez de usar `rejectUnauthorized: false`. Para dispositivos IoT, é comum usar o AWS IoT Core, com MQTT sobre TLS e um certificado X.509 por dispositivo.

</aside>

### Segredos

A senha do banco está escrita no user data do launch template, e qualquer pessoa com permissão de ler as configurações das instâncias consegue vê-la. É um atalho didático que não se usa fora da sala de aula.

<aside class="positive">

**No mercado: AWS Secrets Manager e Parameter Store.** Senhas e chaves ficam no **AWS Secrets Manager**, que também troca a senha do banco periodicamente sem intervenção humana, ou em um parâmetro `SecureString` do **Systems Manager Parameter Store**. A instância lê o segredo no boot, usando as permissões do seu papel IAM, e nada sensível aparece no user data, no código ou no repositório.

</aside>

## Fase 7: confiabilidade e arquitetura final
Duration: 10:00

A Fase 5 protegeu o sistema contra a falha de servidores e de uma zona. Falta proteger os **dados** contra erros humanos, como um arquivo sobrescrito ou uma tabela apagada.

### Versionamento do bucket de artefatos

**Caminho no console:** S3 ▸ agrosensor-artefatos-SEU-SUFIXO ▸ Properties ▸ Bucket Versioning ▸ Edit

Selecione **Enable** e clique em **Save changes**. A partir de agora, sobrescrever ou apagar um objeto preserva a versão anterior. Para ver, envie de novo o código a partir de uma instância e, na aba **Objects**, ative a opção **Show versions**.

### Recuperação a um ponto no tempo no DynamoDB

**Caminho no console:** DynamoDB ▸ Tables ▸ agrosensor-leituras ▸ Backups ▸ Point-in-time recovery ▸ Edit

Ative **Point-in-time recovery** e clique em **Save changes**. O DynamoDB passa a permitir restaurar a tabela como ela estava em qualquer segundo do período de retenção, criando uma tabela nova com os dados daquele instante.

### Backups do RDS

**Caminho no console:** Aurora and RDS ▸ Databases ▸ agrosensor-db ▸ Maintenance & backups

Os backups automáticos já estão ativos desde a criação do banco. Nessa aba aparecem o período de retenção e o horário da janela de backup; a opção **Actions ▸ Restore to point in time** cria um novo banco a partir de qualquer instante dentro da retenção.

<aside class="negative">

**O ponto único de falha que restou.** O RDS do projeto está numa única zona, porque o laboratório não permite Multi-AZ. Se a zona `us-east-1a` falhar, as instâncias da zona `us-east-1b` continuam gravando leituras no DynamoDB, mas a rota `/estufas` para de responder até o banco voltar. Em produção, o banco seria criado com Multi-AZ.

</aside>

### Arquitetura final

![Arquitetura final do AgroSensor](img/fig-38.webp)

*Arquitetura final do AgroSensor.*

A arquitetura final combina sete categorias de serviços: rede (VPC e grupos de segurança), computação elástica (EC2, launch template e Auto Scaling em duas zonas), balanceamento de carga (ALB), dois modelos de banco de dados (DynamoDB para a telemetria e RDS para o cadastro), armazenamento de objetos (S3 para artefatos e para o site), observabilidade (CloudWatch e SNS) e identidade (papel IAM), com os dados cifrados em repouso e protegidos por backups e versionamento.

## Encerramento e limpeza
Duration: 10:00

### Economizando entre aulas

| Recurso | Ao fim da aula | Na aula seguinte |
| --- | --- | --- |
| Auto Scaling group | capacidade desejada e mínima em 0 | voltar para 2 e 2 |
| RDS | **Actions ▸ Stop temporarily** | **Actions ▸ Start** (leva alguns minutos) |
| Instância de desenvolvimento | **Stop instance** | **Start instance** e anotar o novo IP |
| Application Load Balancer | manter, se a próxima aula for em poucos dias | — |
| DynamoDB, S3, CloudWatch, SNS | manter (custo quase nulo) | — |

### Limpeza completa

Quando o projeto terminar, apague tudo nesta ordem, que respeita as dependências entre os recursos:

1. Pare o simulador no CloudShell com **Ctrl+C**.
2. **Auto Scaling group:** selecione `agrosensor-asg`, **Actions ▸ Delete**, digite `delete` e confirme. As instâncias e os alarmes da política vão junto.
3. **Load balancer:** selecione `agrosensor-alb`, **Actions ▸ Delete load balancer**, digite `confirm`.
4. **Target group:** selecione `agrosensor-tg`, **Actions ▸ Delete**.
5. **Launch template:** selecione `agrosensor-lt`, **Actions ▸ Delete template**.
6. **RDS:** selecione `agrosensor-db`, **Actions ▸ Delete**; desmarque **Create final snapshot** e **Retain automated backups**, marque a confirmação e digite `delete me`.
7. **DynamoDB:** selecione a tabela `agrosensor-leituras`, **Delete**, digite `confirm`.
8. **S3:** para cada bucket, use **Empty** (digite `permanently delete`) e, depois, **Delete** (digite o nome do bucket).
9. **CloudWatch:** apague o alarme `agrosensor-pico-trafego` e o painel `agrosensor`.
10. **SNS:** apague a assinatura e o tópico `agrosensor-alertas`.
11. **Grupos de segurança**, quando nada mais os usar, nesta ordem: `agrosensor-db-sg`, `agrosensor-app-sg` e `agrosensor-alb-sg`.

## Parabéns!
Duration: 5:00

Você construiu, fase a fase, uma arquitetura distribuída completa na AWS.

### O que foi construído

| Serviço | Modelo | Papel no AgroSensor |
| --- | --- | --- |
| Amazon VPC | IaaS | rede isolada, sub-redes em duas zonas e internet gateway |
| Amazon EC2 | IaaS | instâncias que executam a API em Node.js |
| EC2 Auto Scaling | gerenciado | mantém de 2 a 4 instâncias, substitui falhas e escala pela demanda |
| Elastic Load Balancing | gerenciado | ponto de entrada único, distribui o tráfego e verifica a saúde |
| Amazon DynamoDB | serverless | grava e consulta as leituras dos sensores |
| Amazon RDS | PaaS | banco PostgreSQL com o cadastro das estufas |
| Amazon S3 | serverless | guarda o código da API e hospeda o painel web |
| Amazon CloudWatch | gerenciado | métricas, painel, alarmes e escalonamento |
| Amazon SNS | serverless | entrega os alertas por e-mail |
| AWS IAM | gerenciado | permissões da instância sem chaves no código |
| AWS Systems Manager | gerenciado | acesso às instâncias sem SSH |

<aside class="positive">

**No mercado: os próximos passos.** O mesmo problema costuma ganhar outras formas em empresas. A API pode rodar em contêineres no **Amazon ECS com AWS Fargate**, sem gerenciar instâncias. Pode virar uma arquitetura serverless, com **Amazon API Gateway** e **AWS Lambda** na frente do DynamoDB. Os sensores podem falar MQTT com o **AWS IoT Core**. E toda a infraestrutura criada neste codelab pode ser descrita em código com AWS CloudFormation, AWS CDK ou Terraform e implantada por um pipeline a cada alteração.

</aside>

### Exercícios

1. Classifique cada serviço usado no projeto como IaaS, PaaS ou serverless e explique, para cada um, uma tarefa que ficou com você e uma que ficou com a AWS.
2. Explique por que a Fase 2 era pré-requisito para a Fase 5. O que aconteceria com o painel se as instâncias do Auto Scaling group usassem o repositório em memória da Fase 1?
3. Desenhe a arquitetura final indicando os pontos únicos de falha que ainda existem e proponha, para cada um, uma mudança que o elimine.
4. Acrescente aos sensores um campo `luminosidade`, em lux: o simulador deve gerar o valor, a API deve validá-lo, o DynamoDB deve guardá-lo e o painel deve mostrá-lo em um terceiro cartão.
5. Crie a rota `POST /estufas`, que cadastra uma estufa no RDS. Use consultas parametrizadas (`$1`, `$2`...) e explique por que concatenar os valores na string SQL abriria uma brecha de injeção de SQL.
6. Faça as leituras expirarem sozinhas depois de sete dias: grave em cada item um atributo `expiraEm` com a data de expiração em segundos desde 1970 e ative o TTL da tabela apontando para ele.
7. Crie um alarme para a métrica `UnHealthyHostCount` do target group, notificando o tópico `agrosensor-alertas`. Para testá-lo, pare o serviço de uma instância pelo Session Manager com `sudo systemctl stop agrosensor` e observe o que o balanceador e o Auto Scaling fazem.
8. Troque a política de escalonamento para média de uso de CPU com alvo de 50%. Repita o teste de carga e compare com a política por requisições: qual reage melhor ao tipo de carga da API? Por quê?
9. Use a AWS Pricing Calculator para estimar o custo mensal da arquitetura final ligada 24 horas por dia, com 2 instâncias, 10 sensores enviando uma leitura por minuto e o painel aberto em horário comercial.
10. Guarde a senha do banco como um parâmetro `SecureString` no Systems Manager Parameter Store, altere o user data para lê-la com a AWS CLI no boot, crie uma nova versão do launch template e use um *instance refresh* do Auto Scaling group para substituir as instâncias.
11. Substitua o `rejectUnauthorized: false` do `cadastro.js` pela validação do certificado do RDS, usando o pacote oficial de certificados baixado no user data.
12. Proponha uma versão serverless do AgroSensor com Amazon API Gateway, AWS Lambda e DynamoDB. Desenhe o diagrama e compare as duas arquiteturas quanto a custo em baixa carga, escala, limites e esforço de operação.

### Referências

* AMAZON WEB SERVICES. [Amazon CloudWatch: user guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/). AWS, 2026.
* AMAZON WEB SERVICES. [Amazon DynamoDB: developer guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/). AWS, 2026.
* AMAZON WEB SERVICES. [Amazon EC2 Auto Scaling: user guide](https://docs.aws.amazon.com/autoscaling/ec2/userguide/). AWS, 2026.
* AMAZON WEB SERVICES. [Amazon Elastic Compute Cloud: user guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/). AWS, 2026.
* AMAZON WEB SERVICES. [Amazon Relational Database Service: user guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/). AWS, 2026.
* AMAZON WEB SERVICES. [Amazon Simple Notification Service: developer guide](https://docs.aws.amazon.com/sns/latest/dg/). AWS, 2026.
* AMAZON WEB SERVICES. [Amazon Simple Storage Service: user guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/). AWS, 2026.
* AMAZON WEB SERVICES. [Amazon Virtual Private Cloud: user guide](https://docs.aws.amazon.com/vpc/latest/userguide/). AWS, 2026.
* AMAZON WEB SERVICES. [AWS Identity and Access Management: user guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/). AWS, 2026.
* AMAZON WEB SERVICES. [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/). AWS, 2026.
* AMAZON WEB SERVICES. [Elastic Load Balancing: Application Load Balancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/). AWS, 2026.
* AMAZON WEB SERVICES. [Global infrastructure: regions and availability zones](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/). AWS, 2026.
* AMAZON WEB SERVICES. [Overview of Amazon Web Services: AWS whitepaper](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/). AWS, 2026.
* AMAZON WEB SERVICES. [Shared responsibility model](https://aws.amazon.com/compliance/shared-responsibility-model/). AWS, 2026.
* COULOURIS, George; DOLLIMORE, Jean; KINDBERG, Tim; BLAIR, Gordon. *Sistemas distribuídos: conceitos e projeto*. 5. ed. Porto Alegre: Bookman, 2013.
* MELL, Peter; GRANCE, Timothy. [*The NIST definition of cloud computing*](https://doi.org/10.6028/NIST.SP.800-145). Gaithersburg: NIST, 2011. (NIST Special Publication 800-145).
* TANENBAUM, Andrew S.; VAN STEEN, Maarten. *Sistemas distribuídos: princípios e paradigmas*. 2. ed. São Paulo: Pearson Prentice Hall, 2007.
