summary: Conheça as principais características do DevOps: dos modelos em cascata e ágil à integração contínua, pipelines, entrega contínua e implantação contínua, com um estudo de caso real.
id: devops-introducao
categories: DevOps
tags: devops,cascata,agil,manifesto agil,integracao continua,entrega continua,implantacao continua,pipeline,ci/cd
status: Published
authors: Rodrigo Bossini
last updated: 2022-02-14
pdf: devops/01_apostila_devops_introducao.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# DevOps: introdução

## Visão geral
Duration: 3:00

Neste material, veremos as principais características daquilo que hoje é conhecido como "DevOps". Patrick Debois é um dos desbravadores neste campo. Veja uma frase sua de seu livro [1]:

> "DevOps é tudo aquilo que você faz para superar as barreiras entre silos."

<aside class="positive">

**Nota.** Neste contexto, um **silo** é caracterizado quando departamentos (desenvolvimento e operações, por exemplo) trabalham com mentalidades diferentes, quando são estruturados para operar de maneira independente, com sua própria visão e objetivo.

</aside>

### O que você vai aprender

* As fases, vantagens e desvantagens do modelo em cascata
* O que é o Desenvolvimento Ágil: o manifesto, seus valores e seus 12 princípios
* Frameworks e metodologias que derivam dos princípios ágeis (Scrum, Kanban, Extreme Programming)
* O ciclo DevOps e ferramentas usadas em cada fase
* Integração contínua, pipelines, entrega contínua e implantação contínua
* Um estudo de caso: o sistema de ranking **Avante**, desenvolvido e implantado com práticas DevOps

### O que você vai precisar

* Nenhum software: este é um material conceitual
* Familiaridade básica com desenvolvimento de software e Git ajuda a acompanhar os exemplos

## Modelo em cascata
Duration: 6:00

A fim de estudarmos DevOps, é interessante olharmos um pouco para o passado, relembrando os principais modelos de desenvolvimento de software.

O modelo de desenvolvimento em cascata é um tanto antigo. Seu funcionamento se dá de acordo com uma **sequência de fases**. Veja a figura a seguir.

<aside class="positive">

**Nota.** Diferentes autores e obras abordam a sequência de fases do modelo em cascata com diferenças sutis, embora mantendo a sua essência.

</aside>

![Diagrama em escada com as fases do modelo em cascata: Requisitos, Análise, Design, Codificação, Testes e Operações](img/p002-1.webp)

*Figura 2.1.1: as fases do modelo em cascata.*

* **Requisitos**: aqui é feito o levantamento de requisitos, os quais são retratados em um documento próprio.
* **Análise**: resultados obtidos aqui são **modelos** (descrições de aspectos do mundo real relevantes para o problema) e **regras de negócio**.
* **Design**: nesta fase, define-se a **arquitetura de software**.
* **Codificação**: como o nome sugere, o sistema é codificado nesta fase. A execução de **testes unitários** e a **integração de pequenas partes do sistema** também acontece aqui.
* **Testes**: aqui são executados diferentes tipos de testes, os quais permitem a detecção de "bugs" depois de a integração ter sido concluída.
* **Operações**: a implantação do sistema e a sua manutenção enquanto está em funcionamento acontece aqui.

### Vantagens

Algumas características do modelo em cascata que podem ser **vantajosas** são:

* Passar tempo considerável nas fases iniciais pode reduzir custos. Um levantamento de requisitos mais detalhado, por exemplo, pode permitir que um problema seja resolvido antes de uma solução computacional errada ser implementada.
* A grande ênfase na documentação pode ser considerada interessante, considerando possíveis trocas de membros da equipe.

### Desvantagens

Há também diversos aspectos do modelo em cascata que podem ser considerados **desvantagens**. Veja:

* É muito comum que os clientes **não saibam exatamente o que querem**. É comum que amadureçam as ideias depois de ver o sistema em funcionamento. No modelo em cascata, o cliente demora a ver uma primeira versão em funcionamento. Caso deseje alterar requisitos, a sua implementação pode ser mais difícil e demorada, o que implica em maiores custos.
* A fase de design consiste na **escolha da arquitetura de software**. Quando tomam as suas decisões, os membros da equipe podem não visualizar com clareza potenciais problemas futuros e insistir numa arquitetura que não estará de acordo com novos requisitos ou restrições.

## Desenvolvimento Ágil
Duration: 8:00

O Desenvolvimento Ágil pode ser definido como

> "Um conjunto de valores e princípios"

Ele é definido no "Manifesto Ágil". Visite o link a seguir para saber mais.

**Link 2.2.1**: [https://agilemanifesto.org/](https://agilemanifesto.org/)

<aside class="positive">

**Nota.** Um "manifesto" é uma declaração trazida a público para fins diversos.

</aside>

### Princípios ágeis versus ferramentas e técnicas que deles derivam

É comum confundir com princípios ágeis, ferramentas e técnicas que potencialmente deles derivam.

Por exemplo, uma equipe pode decidir realizar reuniões diárias com uma duração específica. Fazê-lo não faz parte dos princípios ágeis, é apenas uma decisão que a equipe tomou em função de um princípio ágil por acreditar que as reuniões trazem algum tipo de benefício. Veja a figura a seguir.

![Fluxo: Princípios Ágeis levam a decisões tomadas em função dos princípios, que levam ao Desenvolvimento de Software](img/p004-1.webp)

*Figura 2.2.1.1: decisões tomadas em função dos princípios, por acreditar que eles trazem algum benefício (por exemplo, realizar uma reunião ou usar uma ferramenta específica).*

A tabela a seguir resume o manifesto ágil.

*Tabela 2.2.1.1*

| Mais valiosos | | Menos valiosos |
| --- | --- | --- |
| Indivíduos e interações | mais que | processos e ferramentas |
| Software em funcionamento | mais que | documentação abrangente |
| Colaboração com o cliente | mais que | negociação de contratos |
| Responder a mudanças | mais que | seguir um plano |

### Princípios ágeis

Os 12 princípios ágeis aparecem a seguir. Eles são os fundamentos do manifesto ágil.

1. A entrega de software de qualidade ao cliente sem demora e de forma contínua tem a maior prioridade.
2. Mudanças nos requisitos são bem-vindas, mesmo tempos depois de o desenvolvimento ter começado. Processos ágeis se adequam às mudanças e, assim, o cliente pode ser mais competitivo.
3. Entregar software funcionando com frequência, em intervalos de duas semanas a dois meses, com preferência para intervalos menores.
4. Profissionais de negócios e desenvolvedores devem trabalhar juntos dia a dia ao longo do projeto.
5. Construir projetos mantendo a motivação individual, dando às pessoas o ambiente e suporte de que precisam, além de confiar que serão capazes de concluir suas tarefas.
6. A forma mais eficiente (fazer certo as coisas) e eficaz (fazer as coisas certas) de transmitir informações para e entre membros de uma equipe é por meio de uma conversa cara a cara.
7. Software funcionando é a principal medida de progresso.
8. Processos ágeis promovem desenvolvimento sustentável. Os financiadores, desenvolvedores e usuários devem ser capazes de manter um ritmo constante sempre.
9. Atenção contínua à excelência técnica e bom design promovem a agilidade.
10. Simplicidade (a arte de maximizar a quantidade de trabalho que não precisa ser feito) é essencial.
11. As melhores arquiteturas, requisitos e designs são obtidos por times auto-organizados.
12. Em intervalos regulares, a equipe deve refletir sobre como pode se tornar mais efetiva e fazer os ajustes necessários para tal.

### Frameworks, metodologias e técnicas

Dos valores e princípios ágeis derivam diversos frameworks, metodologias, coleções de técnicas etc. A tabela a seguir mostra alguns dos mais conhecidos.

*Tabela 2.2.2.1*

| Framework/Metodologia/Técnicas | Breve descrição |
| --- | --- |
| Scrum | Desenvolvimento e entrega de produtos em ambientes complexos feitos por uma equipe composta por um **Product Owner** (responsável pelo backlog, ou seja, a lista de itens a serem desenvolvidos associados a prioridades), **Desenvolvedores** que se encarregam de realizar as tarefas a cada **sprint** (espaço de tempo em que um produto de valor é criado) e um **Scrum Master** (responsável por garantir o correto funcionamento do framework, ele ajuda o PO a manter o backlog de modo que o fluxo de trabalho seja bem compreendido, ajuda o time a entender o produto com dados colhidos dos clientes etc.). |
| Kanban | Trabalho gerenciado principalmente por meio do uso de um "quadro Kanban" que possui itens como o **backlog**, as **tarefas em progresso**, as **tarefas em teste**, as **tarefas concluídas** etc. Algumas das métricas consideradas são a **velocidade do time** (quantas tarefas o time é capaz de entregar num dado período de tempo), **tempo de ciclo** (tempo médio para a conclusão de uma tarefa), **métricas ágeis acionáveis** (usa o tempo de ciclo para prever quando um item do projeto será concluído). |
| Extreme Programming | Alguns princípios envolvidos são a **entrega contínua**, **programação em par** (em que dois programadores trabalham juntos num único computador), **ampla revisão de código**, **testes unitários para todas as funcionalidades**, **não desenvolver uma funcionalidade a menos que ela seja de fato necessária** etc. |

## DevOps e seu ciclo
Duration: 5:00

Lembremos, novamente, da definição dada por Patrick Debois:

> "DevOps é tudo aquilo que você faz para superar as barreiras entre silos."

Observe como essa definição é **abrangente** e **flexível**. Inclusive, **não há um manifesto DevOps semelhante ao manifesto ágil**.

Uma definição mais relacionada ao ambiente de desenvolvimento de software é a seguinte.

> "DevOps é uma abordagem de desenvolvimento de software composta por Codificação Contínua, Teste Contínuo, Integração Contínua, Entrega Contínua e Monitoramento Contínuo".

A figura a seguir dá uma visão geral do ciclo. Observe como ele nunca "termina".

![Ciclo DevOps: do lado Dev, Planejamento, Codificação, Build e Teste; do lado Ops, Implantação, Operação e Monitoramento; Integração no centro e Ágil na base, ligando os dois lados](img/p008-1.webp)

*Figura 2.3.1: o ciclo DevOps.*

Observe que as diversas definições não englobam quaisquer ferramentas específicas. Se cumprir com o propósito, qualquer ferramenta pode ser utilizada. Veja algumas das mais utilizadas para cada fase.

* **Planejamento**: Jira, ClickUp, Trello, Notion.
* **Codificação**: IDEs em geral, Git.
* **Build**: Maven, Gradle, CMake, Ant.
* **Teste**: JUnit (testes unitários), Selenium (testes funcionais).
* **Deploy e Operação**: Ansible, Puppet, Chef.
* **Monitoramento**: Akamai mPulse, AppDynamics, ChaosSearch, Prometheus, Sensu.
* **Integração**: Jenkins, CircleCI, GitLab CI, GitHub Actions.

## Um ambiente sem integração contínua
Duration: 6:00

A seguir, descrevemos um cenário típico em que **práticas DevOps não são aplicadas**. A figura logo abaixo mostra a ideia geral. Repare nas seguintes características.

* A equipe de desenvolvimento é dividida em três grupos, cada qual responsável por uma funcionalidade do sistema.
* O controle de versão é feito utilizando-se um único repositório Git.
* Cada equipe faz uso de suas próprias branches no repositório, evitando assim possíveis conflitos entre códigos desenvolvidos pelas diferentes equipes.
* A equipe de integração se reúne, ao final de cada sprint, com um membro de cada equipe de desenvolvimento para integrar os códigos.
* A equipe de integração realiza o build e o entrega para a equipe de operações.
* A equipe de operações implanta o build em ambiente de testes.
* A equipe de Garantia de Qualidade entra em cena e decide se o build pode ser implantado em produção ou se deve voltar para ajustes, na fase de desenvolvimento.

![Fluxo sem integração contínua: equipes de Pagamentos, Catálogo de produtos e Login (SSO) trabalham em branches de um repositório Git; ao final de cada sprint (2 semanas a 2 meses), um membro de cada equipe integra os códigos, faz compilação e build; o time de operações implanta em ambiente de testes, o time de garantia de qualidade avalia e, se aprovado, o build vai para produção](img/p010-1.webp)

*Figura 2.3.1.1: um ambiente de desenvolvimento sem integração contínua.*

### Aspectos indesejáveis do ambiente apresentado

O ambiente apresentado possui diversos aspectos indesejáveis. Vejamos alguns.

* O ponto principal talvez esteja na **fase de integração**. Ela ocorre somente ao final de cada sprint. Isso quer dizer que a quantidade de códigos a serem integrados é muito grande, o que obviamente aumenta a dificuldade neste processo.
* Quando a integração estiver ocorrendo, provavelmente os desenvolvedores já estarão trabalhando em outras funcionalidades e terão facilmente esquecido os detalhes daquelas que estão em integração no momento.
* Ao longo da fase de desenvolvimento, uma equipe pode perceber que seu módulo tem dependências com outro módulo e decidir que é necessário realizar uma integração antes do final do sprint, o que pode levar muito tempo e impedir que os times prossigam com o desenvolvimento enquanto isso.
* Uma equipe pode desenvolver um código que possui **erros funcionais**. Aqueles que não necessariamente causam erro em tempo de compilação. Isso quer dizer que eles potencialmente serão detectados somente na fase de testes, ou seja, somente depois do final do sprint atual. Claro, o próprio desenvolvedor pode realizar seus testes unitários. Entretanto, este pode ser um defeito que somente aparece após a integração com códigos de outras equipes.
* Novas funcionalidades são entregues aos clientes somente ao final de um sprint, o que é inaceitável para a maioria dos sistemas modernos.

## Integração contínua e pipelines
Duration: 8:00

Grande parte dos aspectos indesejáveis apresentados pode ser resolvida por meio do uso da **integração contínua**, um dos pilares do DevOps. Veja uma possível definição.

> "A integração contínua se caracteriza quando os desenvolvedores integram seu código utilizando um repositório compartilhado múltiplas vezes por dia"

A figura a seguir ilustra a ideia.

![As equipes de Pagamentos, Catálogo de produtos e Login (SSO) integram seu código na branch main de um repositório Git compartilhado várias vezes, em curtos intervalos de tempo](img/p011-1.webp)

*Figura 2.3.3.1: integração contínua: múltiplas integrações realizadas em curtos intervalos de tempo, geralmente num único dia.*

Após cada integração, é fundamental verificar se o código pode ser compilado e se um novo build pode ser produzido. Num cenário DevOps, esse processo é **automatizado**. A cada integração realizada por uma equipe, o processo de compilação e build é disparado automaticamente. Testes automatizados também podem (e geralmente são) executados caso o build seja produzido com sucesso. Além disso, caso alguma coisa falhe, o time responsável é imediatamente avisado. Veja a figura a seguir.

![Cada integração no repositório compartilhado dispara um servidor de build que faz compilação, build e testes automatizados; em caso de erro, a equipe é avisada](img/p012-1.webp)

*Figura 2.3.3.2: a cada integração, compilação, build e testes são disparados automaticamente, e a equipe é avisada em caso de erro.*

As principais características da integração contínua são, portanto:

* A existência de um **único repositório** de controle de versão de código que é compartilhado entre todas as equipes envolvidas no projeto.
* Os desenvolvedores integram seu código à branch principal **múltiplas vezes**. Em geral, muitas vezes no mesmo dia.
* Quando uma integração acontece, o processo **compilação > build > testes** é disparado automaticamente.
* Quando algum erro de compilação, build ou na fase de testes é detectado, a equipe é **imediatamente notificada**.

### Pipelines

A ideia de **pipeline** é muito importante no contexto de DevOps. Vejamos do que se trata. A figura a seguir mostra o que descrevemos até o momento. Temos quatro fases pelas quais um item desenvolvido passa.

![Quatro fases em sequência: integração com a branch principal, compilação, build e testes](img/p012-2.webp)

*Figura 2.3.4.1: as quatro fases pelas quais um item desenvolvido passa.*

Digamos que cada fase leva uma unidade de tempo para ser executada. Se a execução ocorrer de maneira puramente sequencial, precisaríamos de 8 unidades de tempo para concluir a execução das fases de dois itens desenvolvidos. Ocorre que, conforme um item desenvolvido é transportado ao longo das fases, aquelas pelas quais ele passou ficam **ociosas**. Veja a figura a seguir.

![Quatro instantes de tempo: um único item avança uma fase por vez enquanto as demais fases ficam ociosas](img/p013-1.webp)

*Figura 2.3.4.2: execução sequencial: as fases pelas quais o item já passou ficam ociosas.*

É natural considerar a possibilidade de produzir mais itens em paralelo, ocupando as fases que ficam ociosas. A figura a seguir mostra um pipeline caracterizado.

![Quatro instantes de tempo: a cada instante um novo item entra na primeira fase enquanto os anteriores avançam, ocupando todas as fases ao mesmo tempo](img/p014-1.webp)

*Figura 2.3.4.3: um pipeline: vários itens em fases diferentes ao mesmo tempo.*

## Entrega contínua e implantação contínua
Duration: 8:00

### Um ambiente de desenvolvimento sem entrega contínua

A **entrega contínua** é um dos pilares do DevOps. A seguir, ilustramos o funcionamento de um ambiente em que ela não é utilizada. A figura a seguir mostra o que temos até então. Digamos que a equipe de desenvolvimento já opera utilizando a integração contínua e um servidor automatizado. O produto gerado é entregue ao time de operações.

![A equipe de desenvolvimento, com integração contínua, compilação, build e testes automatizados, entrega o build e um documento de instruções à equipe de operações](img/p015-1.webp)

*Figura 2.3.5.1: a equipe de desenvolvimento entrega o build final com instruções para a sua implantação.*

Sem utilizar a entrega contínua, a equipe de operações atua como a figura a seguir ilustra.

![A equipe de operações aloca manualmente o ambiente de testes, implanta nele, a garantia de qualidade avalia e, se aprovado, aloca o ambiente de produção e implanta; se reprovado, volta ao desenvolvimento](img/p015-2.webp)

*Figura 2.3.5.2: a equipe de operações sem entrega contínua.*

Muitas vezes o time não preza pelos valores e princípios ágeis e o procedimento é praticamente todo manual. Algumas das características indesejáveis neste ambiente são:

* Procedimentos manuais são muito mais suscetíveis a erros do que aqueles que são automatizados.
* Um erro muito comum é utilizar informações apropriadas para o ambiente de teste (aquelas que colocamos no arquivo `.env`) no ambiente de produção.
* O tempo levado para que a implantação em produção seja concluída tende a ser muito elevado.

### Entrega contínua

Veja uma possível definição para entrega contínua.

> "A entrega contínua se caracteriza quando a produção de entregáveis se dá em curtos períodos de tempo, garantindo que novas funcionalidades ou correções possam ser implantadas rapidamente, embora a implantação em produção não se dê de forma automatizada"

O primeiro passo é considerar que as instruções recebidas pelo time de operações podem, na verdade, ser executadas automaticamente. Ao invés de o time de desenvolvimento entregar instruções, ele se encarrega de escrever **scripts** que realizam os passos necessários de maneira automatizada. Veja alguns exemplos.

* Configuração das variáveis de ambiente com o comando `export`.
* Criação de pastas e arquivos com `mkdir` e `touch`.
* Alocação de máquinas virtuais AWS com o AWS CLI.

A figura a seguir ilustra este cenário.

![Um script, no lugar de instruções, faz automaticamente a alocação do ambiente de testes, a implantação em testes, a alocação do ambiente de produção e a implantação em produção; apenas a garantia de qualidade continua manual](img/p016-1.webp)

*Figura 2.3.6.1: entrega contínua: scripts no lugar de instruções; a garantia de qualidade ainda é manual.*

### Implantação contínua

Veja uma definição para implantação contínua.

> "A implantação contínua se caracteriza quando a produção de entregáveis se dá em curtos períodos de tempo. Quando a implantação contínua entra em cena, as novas funcionalidades ou correções são implantadas automaticamente em produção."

Observe como a implantação contínua é **poderosa** e, ao mesmo tempo, **perigosa**. Um simples `git push` feito por um desenvolvedor altera características daquilo que já está em produção, sem nenhuma verificação manual.

Nosso ambiente ainda não contempla a implantação contínua pois os testes de garantia de qualidade são realizados manualmente, como mostra a figura a seguir.

![Integração contínua (integração, compilação, build, testes) seguida de entrega contínua (alocação e implantação em testes, testes de garantia de qualidade manuais, alocação e implantação em produção)](img/p017-1.webp)

*Figura 2.3.7.1: os testes de garantia de qualidade ainda são manuais.*

Um tipo de teste bastante comum realizado pela equipe de garantia de qualidade é o **teste de aceitação do usuário**. Há diversas ferramentas que permitem automatizar a sua execução. Se pudermos automatizar essa fase, a implantação contínua estará caracterizada. Veja a figura a seguir.

![Integração contínua (DEV) seguida de entrega contínua (OPS) com os testes de garantia de qualidade automatizados; o conjunto todo caracteriza a implantação contínua](img/p017-2.webp)

*Figura 2.3.7.2: com os testes de garantia de qualidade automatizados, temos implantação contínua.*

<aside class="positive">

**Nota.** Você perceberá que a expressão "CI/CD" aparece com significados diferentes em contextos diferentes. CI significa *Continuous Integration* sempre. CD, por outro lado, pode ser *Continuous Delivery*, *Continuous Deployment* ou *Continuous Delivery/Deployment*, ou seja, englobar os dois conceitos.

</aside>

Os conceitos apresentados até aqui são os principais pilares daquilo que chamamos de DevOps.

## Estudo de caso: o sistema Avante
Duration: 8:00

Nesta seção, veremos uma situação em que técnicas e ferramentas de DevOps foram aplicadas na implementação de um **sistema de ranking** que foi utilizado por aproximadamente 400 alunos de uma universidade. O objetivo era fornecer um sistema de competição visando motivar os alunos para a realização da prova Enade do ano de 2021.

### Aspectos fundamentais

A fim de entender o sistema e a forma como ele foi implementado, precisamos considerar os seguintes aspectos.

* O sistema foi batizado de **Avante**.
* A interface do sistema com os alunos foi implementada inicialmente como uma **aplicação Web**.
* A seguir, as funcionalidades foram disponibilizadas por meio de um **Bot** do aplicativo **Telegram**.
* A sua implementação e uso ocorreram a partir de meados do mês de setembro de 2021 até meados do mês de novembro de 2021. Ou seja, o aplicativo permanecia em **contínuo desenvolvimento e implantação** conforme os usuários faziam uso dele.
* Ao longo do período informado, o sistema passou a ser predominantemente utilizado por meio do Bot Telegram. Por isso, as diversas funcionalidades de interesse identificadas foram implementadas como comandos do Bot, como mostra a tabela a seguir.

*Tabela 2.4.1.1*

| Funcionalidade | Comando implementado | Descrição |
| --- | --- | --- |
| Consultar pontuação. | `/avtcoins` | Alunos realizam tarefas como a resolução de exercícios e simulados e ganham avtcoins, que podem ser consultados utilizando-se esse comando. |
| Verificar os ~~100~~ 50 primeiros. | ~~`/top100`~~ `/top50` | Alunos consultam as 100 primeiras posições do ranking utilizando este comando. Por limitações no número de caracteres admitido para respostas do Telegram, o comando foi ajustado para exibir apenas os 50 primeiros. |
| Verificar a forma como os avtcoins foram conquistados. | `/historico` | Algumas vezes os alunos não concordam com seu total de avtcoins e questionam sobre as atividades a partir das quais eles são conquistados. Esse comando permite consultar a forma como cada avtcoin é conquistado. |
| Verificar as datas em que novas atualizações na pontuação foram realizadas. | `/news` | De tempos em tempos, é necessário atualizar a base de dados, incluindo os novos avtcoins conquistados pelos alunos. Esse comando permite consultar as datas e horários em que as atualizações são realizadas. |
| Verificar desempenho individual no Enade. | `/meuEnade` | Depois de realizar a prova oficial, os alunos gostariam de saber seu percentual de acerto e questões que acertaram e erraram. Esse comando dá acesso a essa funcionalidade. |
| Consultar o desempenho global do Enade. | `/resultadoGeralEnade` | Coordenadores desejam consultar o desempenho geral de seus alunos, funcionalidade acessível por meio deste comando. |

A figura a seguir mostra a interface gráfica da aplicação web.

![Tela Top 100 da aplicação web, mostrando o 1º lugar do ranking com o nome do aluno e 803 avtcoins](img/p020-1.webp)

*Figura 2.4.1.1: a interface gráfica da aplicação web.*

A figura a seguir mostra a forma como o sistema podia ser usado por meio do Bot Telegram.

![Sequência de comandos enviados pelo usuário ao Bot Telegram, como /avtcoins, /top50, /historico e /meuEnade, e as respostas do Bot](img/p021-1.webp)

*Figura 2.4.1.2: comandos e respostas do Bot Telegram.*

### Arquitetura

A arquitetura do sistema é exibida pela figura a seguir.

![Usuários conversam com o Bot no Telegram; os servidores Telegram repassam os comandos a uma instância Node.js no Heroku que recebe os comandos, e ela chama outra instância Node.js que implementa as regras de negócio e acessa um banco PostgreSQL; a aplicação web fica no GitHub Pages e também se comunica por HTTPS com a instância de regras de negócio](img/p022-1.webp)

*Figura 2.4.1.3: a arquitetura do sistema Avante.*

### Ambientes e implantação

O projeto contou com um único ambiente para teste e desenvolvimento, dada a sua razoável simplicidade e, principalmente, tempo para desenvolvimento e entrega de resultados. As implantações eram, evidentemente, realizadas num ambiente próprio para isso. Veja a figura a seguir.

![O desenvolvedor testa comandos no Bot de teste ligado ao ambiente local (arquivo .env com url localhost, porta 3000, protocolo http e a chave do bot de teste), usa o GitHub para controle de versão com git push origin master e implanta com git push heroku master; o Heroku aloca um Dyno, instala a versão do Node.js indicada no package.json, baixa as dependências e implanta a aplicação no ambiente de produção, ligado ao Bot de produção](img/p023-1.webp)

*Figura 2.4.1.4: os ambientes de desenvolvimento/teste (localhost) e de produção (Heroku) e o fluxo de implantação.*

## Encerramento
Duration: 3:00

Neste codelab você viu:

* Por que o modelo em cascata tem dificuldade para lidar com mudanças de requisitos
* O manifesto ágil, seus valores e princípios, e ferramentas que deles derivam
* O ciclo DevOps e ferramentas para cada fase
* Integração contínua, pipelines, entrega contínua e implantação contínua
* Um sistema real desenvolvido e implantado continuamente enquanto era usado

### Próximos passos

Para saber de onde veio o termo "DevOps", continue com o codelab sobre a origem do nome. Depois, pratique criando um pipeline no GitLab CI.

### Referências

[1] KIM, G.; HUMBLE, J.; DEBOIS, P.; WILLIS, J.; FORSGREN, N. *The DevOps Handbook: How to Create World-Class Agility, Reliability, & Security in Technology Organizations*. 2. ed. IT Revolution Press, 2021.

* Manifesto Ágil: [https://agilemanifesto.org/](https://agilemanifesto.org/)
