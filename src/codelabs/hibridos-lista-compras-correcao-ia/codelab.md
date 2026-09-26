summary: Use o GitHub Copilot em modo Agent, com AGENTS.md e o servidor MCP do Expo, para consertar cinco defeitos de um app React Native de lista de compras e implementar uma funcionalidade com um SDK desconhecido, sempre escrevendo o critério antes do prompt e verificando no app rodando.
id: hibridos-lista-compras-correcao-ia
categories: React Native,IA,Mobile
tags: react native,expo,ia,github copilot,agentes,mcp,agents.md,expo-haptics,expo-clipboard,useeffect,usestate,flatlist
status: Published
authors: Rodrigo Bossini
last updated: 2026-08-28
pdf: desenvolvimento_de_aplicativos_hibridos/03_apostila_dev_aplicativos_hibridos_react_native_lista_compras_correcao_de_app_com_IA.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Programação assistida por agentes: consertando um app Expo com Copilot e MCP

## Visão geral
Duration: 4:00

Neste codelab você vai **consertar um aplicativo quebrado** e **implementar uma funcionalidade com um SDK desconhecido** usando o GitHub Copilot em modo Agent, o `AGENTS.md` e o servidor MCP do Expo. O aplicativo é uma lista de compras em React Native com cinco defeitos plantados de propósito; a habilidade central não é *pedir*, é **verificar**.

### O que você vai aprender

* A diferença entre os modos Ask e Agent do Copilot Chat e o contrato de cada um
* Por que um modelo de linguagem erra versões de pacotes do Expo, e como AGENTS.md, servidor MCP e Expo Skills resolvem isso
* Como configurar `AGENTS.md`, `.vscode/mcp.json` e `.github/copilot-instructions.md`
* O método "critério antes do prompt" e o ciclo sintoma → critério → prompt → diff → verificação → registro
* Como corrigir cinco defeitos clássicos de React Native (Flexbox, chaves da `FlatList`, `useEffect` em laço, mutação de estado e texto somado como número)
* Como adicionar retorno tátil com `expo-haptics` (ou copiar para a área de transferência com `expo-clipboard`) instalando na versão compatível com o SDK
* Os modos de falha típicos de um agente e uma lista de verificação antes de aceitar um diff

### O que você vai precisar

* VS Code instalado, com a extensão do GitHub Copilot ativa e uma conta com acesso ao Copilot
* Node.js e o `git` disponíveis no terminal
* Um celular com o aplicativo Expo Go instalado, na mesma rede Wi-Fi do computador
* Uma conta no Expo (gratuita serve) para autenticar o servidor MCP

## Do autocompletar ao agente
Duration: 8:00

**O que esta parte aborda.** A diferença entre um assistente que sugere texto e um agente que edita arquivos e executa comandos. Os modos do Copilot, o que muda no seu trabalho quando você deixa de digitar o código e passa a revisá-lo, e por que a habilidade central desta aula é *verificar*, não *pedir*.

### Dois modos, dois contratos

O GitHub Copilot dentro do VS Code não é uma ferramenta só. Ele oferece modos de conversa diferentes, e a diferença entre eles não é de qualidade: é de **permissão**. Cada modo estabelece um contrato distinto sobre quem encosta no seu código.

| Modo | O que ele faz | Quem altera o arquivo |
| --- | --- | --- |
| Ask | Responde no painel de conversa. Pode mostrar código, mas como texto. | Você. Copia e cola por conta própria. |
| Agent | Decide sozinho quais arquivos abrir, quais alterar, e pode executar comandos no terminal. | Ele, com escopo que ele mesmo define. |

*Tabela 1.1. Os dois modos do Copilot Chat e o contrato de cada um.*

No seletor você vai encontrar também o modo **Plan**, que monta um plano de implementação antes de encostar em qualquer arquivo: útil em tarefas grandes, e não usado nesta aula.

<aside class="positive">

**Se você encontrar tutoriais falando de um modo Edit.** Existiu um terceiro modo, o *Edit*, que alterava apenas os arquivos que você indicasse explicitamente. Ele foi retirado do seletor em fevereiro de 2026 e absorvido pelo Agent. Muito material na internet ainda o menciona; se você procurá-lo, não vai achar. O que ele fazia se obtém hoje pedindo no próprio Agent: nomeie os arquivos e diga para não tocar em mais nada.

</aside>

A passagem de Ask para Agent é a mudança relevante. No modo Ask, o código que aparece na tela ainda precisa passar pelas suas mãos para entrar no projeto, e esse trajeto, por mais mecânico que pareça, é uma revisão. Você lê enquanto copia. No modo Agent esse trajeto desaparece: o arquivo é alterado, o pacote é instalado, o servidor é reiniciado. Se você não abrir o *diff*, ninguém leu nada.

<aside class="positive">

**Toda esta aula acontece no modo Agent.** As ferramentas de MCP que configuraremos mais adiante só ficam visíveis no modo Agent. No modo Ask elas simplesmente não são oferecidas ao modelo, mesmo estando configuradas e conectadas. Se em algum momento o agente parecer estar respondendo de memória, a primeira coisa a conferir é o seletor de modo.

</aside>

### O que muda no seu trabalho

Quando o agente escreve o código, a parte cara do seu trabalho deixa de ser a digitação e passa a ser três outras coisas:

* **Descrever o resultado esperado.** Um pedido vago produz uma resposta plausível, e plausível é exatamente o tipo de erro difícil de enxergar.
* **Ler o diff.** O agente pode ter resolvido o que você pediu e, no caminho, renomeado uma variável, reformatado um arquivo inteiro ou instalado uma dependência que você não queria.
* **Verificar no aplicativo rodando.** A resposta do chat dizendo que o problema foi resolvido não é evidência de nada. O aplicativo no celular é.

Repare que nenhuma dessas três habilidades é sobre saber conversar com o modelo. Todas são sobre engenharia: especificar, revisar, testar. O agente não substitui essas etapas: ele aumenta o custo de pulá-las, porque produz volume de código muito mais rápido do que antes.

<aside class="positive">

**A pergunta que organiza a aula.** Ao longo de todo este material, uma pergunta se repete: *como eu sei que isso funcionou?* Se a resposta for "porque o agente disse que funcionou", a etapa não terminou.

</aside>

### Por que praticar com um aplicativo quebrado

Aprender a trabalhar com um agente escrevendo um aplicativo novo tem um problema: não existe gabarito. Se a tela aparece e nada explode, parece que deu certo, e você não tem como distinguir um bom resultado de um resultado apenas convincente.

Por isso o exercício desta aula parte de um aplicativo pronto e **deliberadamente quebrado**. Os defeitos são conhecidos, vêm de conceitos que você já viu, e cada um tem um sintoma visível na tela ou no console. Existe gabarito: ou o alinhamento consertou, ou não consertou. É essa objetividade que torna possível comparar o que você faria na mão com o que o agente faz e, principalmente, perceber quando ele resolve o sintoma sem tocar na causa.

O aplicativo é uma lista de compras, e isso também é uma escolha. O domínio é banal de propósito: ninguém precisa gastar atenção entendendo o que o programa faz, e a atenção fica inteira no que interessa.

### Como este material está organizado

Ele é para ser seguido com o computador ligado e o VS Code aberto. Onde houver um **Passo**, é para fazer, não para ler. As convenções usadas nos passos seguintes:

| Elemento | O que significa |
| --- | --- |
| **Passo** | Uma ação sua, em ordem. Não pule. |
| *Onde:* | Em qual janela, painel ou arquivo aquilo é feito. |
| Bloco **Prompt** | Texto para digitar no painel do Copilot Chat, em modo Agent. |
| Quadro **Critério de aceitação** | Critério de aceitação: você escreve no seu `CRITERIOS.md`. |
| Alerta **Sintoma** | O sintoma de um defeito: o que você deve estar vendo. |
| Quadro **Confira** | Conferência: o que precisa estar valendo antes de seguir. |

*Tabela 1.2. Convenções usadas ao longo do codelab (na apostila, caixas roxa, âmbar, vermelha e verde).*

<aside class="negative">

**Dois blocos parecidos, dois destinos diferentes.** O prompt e o critério aparecem quase sempre juntos, e é fácil confundi-los. O prompt vai para o Copilot. O critério **não vai**: ele é seu instrumento de medida e fica em um arquivo do seu projeto. O passo "Onde digitar cada coisa" explica isso em detalhe, e vale ler antes de começar os defeitos.

</aside>

## O problema do palpite
Duration: 8:00

**O que esta parte aborda.** Por que um modelo de linguagem erra a versão de um pacote do Expo mesmo acertando a lógica do código. As três peças que fornecem contexto atual ao agente (arquivos de projeto, servidor MCP e *skills*) e o que cada uma resolve.

### O modelo responde a partir do passado

Um modelo de linguagem foi treinado com um retrato da internet feito em determinado momento. Tudo que ele "sabe" sobre o Expo é a média do que existia até ali: versões de SDK, nomes de pacotes, APIs, padrões recomendados. Isso funciona razoavelmente bem para lógica de programação, que muda devagar, e mal para ecossistemas versionados, que mudam rápido.

O Expo é um caso extremo disso. Cada versão do SDK fixa versões compatíveis de dezenas de bibliotecas nativas. Instalar a versão mais recente de um pacote em um projeto que usa um SDK anterior é a forma mais comum de quebrar um aplicativo que estava funcionando, e é exatamente o que acontece quando o agente chuta a partir dos dados de treino.

<aside class="negative">

**O erro clássico.** `npm install expo-haptics` instala a versão mais recente publicada no npm. `npx expo install expo-haptics` instala a versão compatível com o SDK deste projeto. Os dois comandos parecem equivalentes e não são. Guarde esse par: ele volta na funcionalidade nova.

</aside>

### As três peças de contexto

O Expo oferece três mecanismos que, juntos, tiram o agente do palpite. Eles resolvem problemas diferentes e são complementares.

| Peça | O que resolve | Onde vive |
| --- | --- | --- |
| Arquivos de contexto | Dizem ao agente o que é este projeto: qual SDK, quais convenções, onde procurar documentação. Lidos no início de cada sessão. | No repositório (`AGENTS.md`) |
| Servidor MCP | Dá ao agente acesso **ao vivo** à documentação atual do Expo, ao histórico de builds do EAS e a ferramentas que executam ações reais. | Servidor remoto do Expo |
| Expo Skills | Ensina padrões conhecidamente bons para tarefas específicas (navegação, animação, publicação) em vez de deixar o agente improvisar. | Instalado por máquina |

*Tabela 2.1. As três peças que dão contexto específico de Expo a um agente.*

![Comparação lado a lado: à esquerda, dados de treino (retrato do passado) alimentam o agente, que roda npm install e obtém a versão mais recente, um palpite; à direita, AGENTS.md (SDK e convenções) e o servidor MCP (documentação atual) alimentam o agente, que roda npx expo install e obtém a versão compatível, verificado](img/fig-2-1.webp)

*Figura 2.1. Sem contexto de projeto, o agente responde a partir do que aprendeu. Com AGENTS.md e o servidor MCP, ele responde a partir do que existe hoje neste projeto.*

### O que o servidor MCP do Expo entrega

**MCP** (*Model Context Protocol*) é um padrão que permite a um agente conversar com serviços externos por meio de ferramentas bem definidas. O Expo mantém um servidor MCP remoto que expõe um conjunto grande de ferramentas. Para esta aula, estas são as que importam:

| Ferramenta | O que faz |
| --- | --- |
| `add_library` | Adiciona uma biblioteca ao projeto usando `expo install`, na versão compatível com o SDK, e anexa instruções de uso quando existem. |
| `read_documentation` | Busca uma página da documentação oficial do Expo e devolve o conteúdo atual. |
| `learn` | Carrega o passo a passo de um tópico específico do Expo e o mantém na conversa. |
| `search_documentation` | Pesquisa a documentação inteira e devolve as páginas mais relevantes. |
| `collect_app_logs` | Coleta os *logs* do aplicativo em execução (console JavaScript e sistema nativo). |
| `automation_take_screenshot` | Tira uma captura de tela do aplicativo rodando no simulador. |

*Tabela 2.2. Subconjunto das ferramentas do servidor MCP do Expo usado nesta aula.*

<aside class="negative">

**Duas restrições que valem conhecer antes.**

* `search_documentation` exige um plano pago do EAS. Com conta gratuita, use `read_documentation` indicando a página, ou peça ao agente que use `learn`.
* As ferramentas de automação (captura de tela, toque, coleta de *logs*) são **capacidades locais**: exigem SDK 54 ou superior, o pacote `expo-mcp` instalado e o servidor de desenvolvimento rodando em um modo específico. No iOS, funcionam apenas em simulador e apenas em máquinas macOS.

</aside>

### Expo Skills, e o limite desta parte

As **Expo Skills** são arquivos de instrução que ensinam ao agente o jeito certo de fazer tarefas específicas (montar navegação, configurar Tailwind, publicar na loja) em vez de deixá-lo inventar. A documentação do Expo traz instalação para Claude Code, Codex e Cursor, além de um instalador genérico para os demais agentes.

<aside class="positive">

**Sobre o Copilot especificamente.** A documentação oficial do Expo trata em detalhe de Claude Code, Codex e Cursor. O Copilot no VS Code não tem uma página dedicada, mas as duas peças que usaremos (o `AGENTS.md` e o servidor MCP) funcionam nele: o VS Code lê `AGENTS.md` como instrução permanente e consta como cliente suportado do servidor MCP do Expo. O suporte a *skills* no VS Code é mais recente e ainda instável entre versões; trate-o como opcional. Nada neste codelab depende dele.

</aside>

## Obtendo e rodando o projeto
Duration: 15:00

**O que esta parte aborda.** Do zero até o aplicativo na tela do celular. Criar a pasta de trabalho, clonar o repositório trazendo as duas branches, rodar primeiro a versão que funciona para saber qual é a aparência correta, e só então voltar para a versão defeituosa.

<aside class="positive">

**Por que celular físico.** A segunda metade da aula usa vibração, que não existe em simulador iOS nem na maioria dos emuladores Android. Há uma alternativa para quem não tiver aparelho, mas o caminho principal supõe celular.

</aside>

### Criando a pasta de trabalho

**Passo 1: crie a pasta que vai abrigar o projeto.**

*Onde: terminal do sistema (Prompt de Comando, PowerShell ou Terminal).*

Escolha um lugar onde você guarda seus projetos e crie uma pasta para as aulas. Evite caminhos com acentos, espaços ou sincronização de nuvem: os três causam problemas no Metro, o empacotador do React Native.

**Terminal**

```bash
mkdir aulas-expo
cd aulas-expo
```

### Clonando o repositório

**Passo 1: clone o projeto do GitHub.**

*Onde: mesmo terminal, dentro de aulas-expo.*

**Terminal**

```bash
git clone https://github.com/professorbossini/20262_modelo_expo_ai_lista_compras.git lista-compras
cd lista-compras
```

O nome no final do comando é opcional: ele apenas renomeia a pasta local para algo mais curto do que o nome do repositório.

**Passo 2: confirme que as duas branches vieram.**

**Terminal**

```bash
git branch -a
```

Você deve ver algo assim:

**Saída esperada**

```text
* main
  remotes/origin/HEAD -> origin/main
  remotes/origin/main
  remotes/origin/solucao
```

O asterisco indica onde você está. Repare que `solucao` aparece com o prefixo `remotes/origin/`: ela ainda não existe localmente, mas o `git switch` cria a versão local automaticamente na primeira vez que você pedir por ela.

> **O que é uma branch, em uma frase**
>
> Uma linha do tempo paralela dentro do mesmo repositório. Os mesmos arquivos, em versões diferentes, sem duplicar pasta e sem perder nada. Trocar de branch reescreve os arquivos da sua pasta para o estado daquela linha.

### As duas branches deste projeto

| Branch | O que contém |
| --- | --- |
| `main` | O aplicativo com os cinco defeitos plantados. É onde a aula acontece e onde você vai trabalhar. |
| `solucao` | Todos os defeitos corrigidos, um *commit* por defeito, mais a funcionalidade de vibração. |

*Tabela 3.1. As duas linhas do tempo do repositório.*

A ordem em que vamos usá-las é deliberada: **primeiro a `solucao`, depois a `main`**. Parece contraintuitivo começar pelo gabarito, mas há uma razão prática. Você precisa saber qual é a aparência do aplicativo *funcionando* antes de julgar o aplicativo quebrado. Sem essa referência, "a linha está empilhada" é uma frase; com ela, é uma comparação. E o exercício inteiro da aula é comparar um estado observado com um estado esperado.

<aside class="negative">

**O que não fazer.** Rodar a `solucao` é para ver a tela, não para ler o código. Se você abrir o `App.js` dela agora, os cinco defeitos deixam de ser um exercício e viram uma leitura. Olhe o aplicativo no celular e volte.

</aside>

### Rodando primeiro a versão que funciona

**Passo 1: vá para a branch da solução.**

*Onde: terminal, dentro de lista-compras.*

**Terminal**

```bash
git switch solucao
```

**Passo 2: instale as dependências.**

**Terminal**

```bash
npm install
```

Isso baixa tudo que o projeto precisa para a pasta `node_modules`. Demora alguns minutos na primeira vez.

<aside class="positive">

**Por que instalar estando na solucao.** A branch `solucao` tem uma dependência a mais que a `main`: o `expo-haptics`. Instalando a partir dela, você baixa o conjunto completo de uma vez e não precisa repetir a instalação ao trocar de branch depois.

</aside>

**Passo 3: suba o servidor de desenvolvimento.**

**Terminal**

```bash
npx expo start
```

Um QR Code aparece no terminal. Leia com a câmera do celular (iOS) ou pelo próprio Expo Go (Android). O aplicativo abre em alguns segundos.

**Passo 4: observe o aplicativo funcionando e guarde a imagem.**

*Onde: no celular.*

Faça estas quatro coisas e repare no comportamento de cada uma:

1. Veja como uma linha da lista é montada: marcador redondo à esquerda, nome no meio, quantidade encostada na direita.
2. Toque em um item. Ele é marcado **na hora**: o círculo preenche, o nome fica riscado, o rodapé muda. Toque de novo e desfaz.
3. Adicione um item qualquer com quantidade 2. O total de unidades no rodapé passa de 6 para 8.
4. Olhe o terminal onde o `expo start` está rodando. Está quieto.

<aside class="positive">

**Confira antes de seguir.** Essas quatro observações são o seu gabarito visual para o resto da aula. Se qualquer uma delas não bater, algo está errado no ambiente: resolva agora, antes de seguir.

</aside>

### Voltando para a versão defeituosa

**Passo 1: pare o servidor e troque de branch.**

*Onde: terminal. Pressione Ctrl+C para parar o expo start.*

**Terminal**

```bash
git switch main
npx expo start
```

Note que não é preciso rodar `npm install` de novo: a `main` usa um subconjunto das dependências que você já instalou.

**Passo 2: abra o projeto no VS Code.**

*Onde: terminal, ou pelo menu Arquivo → Abrir Pasta do VS Code.*

**Terminal**

```bash
code .
```

O ponto significa "a pasta atual". Se o comando `code` não for reconhecido, abra o VS Code manualmente e use **Arquivo → Abrir Pasta**, apontando para `lista-compras`.

<aside class="negative">

**Abra a pasta, não os arquivos.** O agente enxerga o *espaço de trabalho* aberto no VS Code. Se você abrir apenas o `App.js` com dois cliques, o Copilot não terá acesso ao restante do projeto: nem ao `AGENTS.md`, nem ao `package.json`. Precisa ser a pasta inteira.

</aside>

**Passo 3: observe o aplicativo quebrado.**

*Onde: no celular, e no terminal do expo start.*

Compare com o que você viu há pouco. Três coisas aparecem sozinhas:

1. As linhas da lista estão empilhadas na vertical: marcador em cima, nome no meio, quantidade embaixo.
2. O terminal despeja `recalculando resumo` sem parar, e o aplicativo responde devagar ao toque.
3. Entre as mensagens aparece um aviso do React Native sobre chaves faltando na lista.

Outros dois defeitos não aparecem sozinhos: eles só se manifestam quando você *usa* o aplicativo. Isso já é uma lição: abrir a tela e ver que ela renderiza não é teste de nada.

### Se você ficar para trás durante a aula

O repositório tem marcações em pontos-chave da correção. Se a turma avançar e você travar, dá para pular para o estado combinado sem perder o que já fez:

**Terminal**

```bash
git stash # guarda seu trabalho atual de lado
git switch --detach v3-efeito
```

Para voltar ao seu próprio código:

**Terminal**

```bash
git switch main
git stash pop
```

| Marcação | Estado |
| --- | --- |
| `v0-quebrado` | Ponto de partida, igual à `main`. |
| `v1-layout` | Defeito 1 corrigido. |
| `v2-chaves` | Defeitos 1 e 2 corrigidos. |
| `v3-efeito` | Defeitos 1 a 3 corrigidos. |
| `v4-mutacao` | Defeitos 1 a 4 corrigidos. |
| `v5-numero` | Os cinco defeitos corrigidos. |
| `v6-haptics` | Com o retorno tátil da funcionalidade nova. |

*Tabela 3.2. Pontos de retomada. Cada um inclui tudo dos anteriores.*

## Onde digitar cada coisa
Duration: 5:00

Este passo existe porque é o ponto em que mais se tropeça. Daqui em diante você vai escrever textos de dois tipos, e eles vão para lugares diferentes.

### Os prompts vão no painel do Copilot Chat

*Onde: painel lateral do Copilot, aberto já em modo Agent com Ctrl+Shift+Alt+I.*

É o painel lateral, não a caixinha que aparece sobre o código quando você aperta **Ctrl+I**: essa é o chat *inline*, e ela não tem acesso às ferramentas do MCP.

O seletor de modo é o botão que mostra o modo atual no rodapé do campo de digitação, à direita do sinal de mais. Clicando nele abre a lista: no topo ficam **Agent**, **Ask** e **Plan**; abaixo de um separador, agentes personalizados que variam de máquina para máquina, conforme as extensões instaladas. Essa parte de baixo pode estar vazia na sua, e não faz falta nenhuma: ignore.

Para quebrar linha sem enviar a mensagem, use **Shift+Enter**. Os prompts deste material costumam ter dois ou três parágrafos.

### Os critérios de aceitação vão em um arquivo seu

*Onde: arquivo CRITERIOS.md, na raiz do projeto, já incluído no repositório.*

O critério **não** é digitado no Copilot. Ele é o seu instrumento de medida: você o escreve *antes* de acionar o agente, justamente para que o resultado dele não defina sozinho o que contava como sucesso. Depois de aplicar a correção, você volta ao arquivo e marca.

O `CRITERIOS.md` já vem com as seções vazias, uma por defeito. Abra-o agora no VS Code e deixe-o em uma aba ao lado: você vai voltar nele umas dez vezes hoje.

<aside class="negative">

**Uma tentação que custa caro.** Dá para colar o critério dentro do prompt, e às vezes o resultado sai melhor porque o agente tem o alvo explícito. Mas aí ele passa a otimizar para o seu critério e a afirmar que o atendeu, e você perde a medida independente.

Nos cinco defeitos os prompts descrevem apenas o *sintoma*, de propósito. Na funcionalidade nova, quando o objetivo passa a ser obter uma funcionalidade e não medir o agente, o critério vai junto no prompt. A diferença é intencional.

</aside>

<aside class="negative">

**E não peça ao agente para escrever seus critérios.** Seria rápido e destruiria o exercício. Um critério escrito pelo agente mede o entendimento dele, não o seu, e os defeitos dependem justamente de você descobrir onde o seu entendimento estava incompleto.

</aside>

| Bloco | Vai para | Quando |
| --- | --- | --- |
| Prompt | Painel do Copilot, modo Agent | Depois de escrever o critério |
| Critério | Seu `CRITERIOS.md` | Antes de acionar o agente |
| Sintoma | Lugar nenhum: é o que observar | Antes de tudo |

*Tabela 3.3. Resumo dos destinos.*

## Os arquivos que controlam a IA
Duration: 15:00

**O que esta parte aborda.** Todo agente lê arquivos antes de responder. Esta parte abre um por um: o que cada um faz, quem o lê, o que já vem pronto no projeto e o que você vai acrescentar. Ao final, o servidor MCP conectado e três provas de que o agente está mesmo enxergando o repositório.

### O panorama

Abra a raiz do projeto no explorador do VS Code. Alguns arquivos não têm nada a ver com o aplicativo: eles existem para configurar o agente.

| Arquivo | Para que serve | Já existe? |
| --- | --- | --- |
| `AGENTS.md` | Instruções permanentes de projeto, lidas por qualquer agente no início da sessão. | Sim |
| `CLAUDE.md` | Ponteiro para o `AGENTS.md`, lido pelo Claude Code. | Sim |
| `.claude/settings.json` | Plugins do Claude Code. | Sim |
| `.vscode/mcp.json` | Servidores MCP do repositório, lidos pelo VS Code. | Não |
| `.github/copilot-instructions.md` | Instruções específicas do Copilot. | Não |
| `CRITERIOS.md` | Seu registro de verificação. Não é lido por agente nenhum. | Sim |

*Tabela 4.1. Arquivos de configuração de agente no projeto.*

<aside class="positive">

**Por que arquivos de ferramentas que você não usa.** O `CLAUDE.md` e o `.claude/` vêm do próprio modelo de projeto do Expo, que tenta atender vários agentes de uma vez. Deixe-os quietos. Eles ilustram uma realidade do ecossistema: cada ferramenta inventou seu formato, e os projetos acabam carregando um arquivo para cada. O `AGENTS.md` é a tentativa de padrão comum, e é o que o VS Code lê.

</aside>

### AGENTS.md: o contexto do projeto

**Passo 1: abra o AGENTS.md e leia.**

*Onde: explorador do VS Code, raiz do projeto.*

Ele é curto. O modelo de projeto do Expo gera algo assim:

**AGENTS.md (como vem)**

```text
# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.
```

<aside class="positive">

**O que esse arquivo está fazendo.** Três linhas resolvendo o problema do palpite. O agente foi treinado com uma mistura de várias versões do Expo; esse arquivo aponta para a documentação *da versão exata deste projeto* e manda ler antes de escrever código. É o contexto mínimo, e ele já vem pronto porque errar a versão é o erro mais caro e mais comum.

</aside>

O arquivo serve também para convenções de equipe. Vamos acrescentar quatro.

**Passo 2: adicione a seção de convenções ao final do AGENTS.md.**

*Onde: editor do VS Code, arquivo AGENTS.md. Digite ao final, sem apagar o que já está lá.*

- **Acrescentar ao final do AGENTS.md**

   ```text
   ## Convenções deste projeto

   - Instale dependências sempre com `npx expo install`, nunca com `npm install`.
   - Não altere arquivos fora do escopo pedido. Explique cada alteração.
   - Componentes ficam em `components/`, um arquivo por componente.
   - Estado nunca é modificado no lugar: sempre gere um novo valor.
   ```

Salve com **Ctrl+S**. Vale entender por que cada linha está ali:

* A primeira ataca diretamente o erro de versão do problema do palpite.
* A segunda é a que mais economiza tempo na prática: sem ela, um pedido pontual volta com um arquivo inteiro reformatado, e o *diff* fica ilegível.
* A terceira é organização de pastas: o tipo de coisa que o agente não tem como adivinhar.
* A quarta é a causa de um dos defeitos que você vai consertar. Guarde-a; ela reaparece no Exercício 3.

<aside class="positive">

**Regras são para o comportamento, não para a tarefa.** O que entra no `AGENTS.md` é o que vale para *todas* as conversas deste projeto. O que vale só para agora vai no prompt. Encher o arquivo de instruções pontuais o torna longo, e um arquivo longo é lido com menos atenção, por pessoas e por modelos.

</aside>

### .vscode/mcp.json: conectando o servidor do Expo

**Passo 1: crie a pasta .vscode e o arquivo mcp.json.**

*Onde: explorador do VS Code. Clique com o botão direito na área vazia, escolha Nova Pasta, chame de .vscode. Dentro dela, Novo Arquivo, chamado mcp.json.*

**.vscode/mcp.json**

```json
{
  "servers": {
    "expo": {
      "type": "http",
      "url": "https://mcp.expo.dev/mcp"
    }
  }
}
```

<aside class="positive">

**O que esse arquivo está fazendo.** Declarando um servidor de ferramentas para o agente. `"expo"` é só um apelido local. `"type": "http"` diz que o servidor é remoto e falado por HTTP, em vez de um processo iniciado na sua máquina. A URL é o endereço público do servidor MCP do Expo.

Como o arquivo mora dentro do repositório, ele é versionado: quem clonar o projeto recebe a mesma configuração sem precisar montar nada.

</aside>

<aside class="negative">

**Dois erros de digitação que custam a aula inteira.**

* A chave raiz no VS Code é `"servers"`. Outros editores usam `"mcpServers"`. Copiar a configuração de um tutorial de Cursor ou Claude Desktop sem trocar a chave é o erro mais comum.
* O campo `"type"` é obrigatório no VS Code. Em outros clientes ele é deduzido pelas demais chaves; aqui, não.

</aside>

**Passo 2: inicie o servidor e autentique.**

*Onde: paleta de comandos, Ctrl+Shift+P (ou Cmd+Shift+P).*

Ao salvar o arquivo, o VS Code normalmente oferece iniciar o servidor logo acima da primeira linha. Se não oferecer, abra a paleta e execute:

**Paleta de comandos**

```text
MCP: List Servers
```

Selecione `expo` e mande iniciar. O navegador abre pedindo autenticação: entre com sua conta Expo e autorize. O token é gerado e guardado sozinho: você não precisa copiar nada.

**Passo 3: confirme que as ferramentas apareceram.**

*Onde: painel do Copilot Chat, modo Agent. Clique no ícone de ferramentas na caixa de mensagem.*

A lista deve conter entradas do Expo, como `read_documentation` e `add_library`. Se a lista estiver sem elas, o servidor não subiu: volte à paleta e verifique os *logs* em **MCP: List Servers**.

<aside class="positive">

**Confira antes de seguir.** O servidor `expo` aparece como iniciado, e as ferramentas dele estão visíveis no seletor do painel do Copilot com o modo em Agent.

</aside>

### .github/copilot-instructions.md: instruções do Copilot

O `AGENTS.md` é o padrão aberto, lido por vários agentes. O Copilot tem também um arquivo próprio, e ele é útil para o que é específico do seu jeito de trabalhar com *esta* ferramenta.

**Passo 1: crie a pasta .github e o arquivo de instruções.**

*Onde: explorador do VS Code, mesma mecânica de antes.*

- **.github/copilot-instructions.md**

   ```text
   # Instruções para o Copilot neste projeto

   Este é um projeto Expo. Leia o `AGENTS.md` da raiz antes de responder.

   ## Como responder

   - Antes de alterar arquivos, diga em uma frase qual é a causa do problema.
   - Faça a menor alteração que resolve. Não reformate código que não pediram.
   - Ao terminar, liste os arquivos que você alterou e por quê.
   - Para instalar bibliotecas, use as ferramentas do Expo disponíveis.
   ```

<aside class="positive">

**O que esse arquivo está fazendo.** Moldando o *formato* da resposta, não o conteúdo. As duas primeiras regras existem para esta aula: pedir a causa antes da correção é o que torna possível perceber quando o agente conserta o sintoma, e limitar o tamanho da alteração é o que mantém o *diff* legível. A terceira facilita a revisão. A quarta reforça o `expo install` por um segundo caminho: redundância proposital, porque é o erro mais caro.

</aside>

<aside class="positive">

**Os dois arquivos brigam?** Não. O VS Code soma as instruções dos dois. A separação prática é: o `AGENTS.md` descreve o projeto e vale para qualquer agente; o `copilot-instructions.md` descreve como você quer ser respondido *por esta ferramenta*. Em caso de contradição direta, o resultado é imprevisível, então evite repetir a mesma regra nos dois com palavras diferentes.

</aside>

### Três provas de que está tudo conectado

Não vá para os defeitos sem fazer estes três testes. Eles levam dois minutos e evitam meia hora de confusão.

**Passo 1: prova 1, o agente enxerga o repositório.**

*Onde: painel do Copilot Chat, modo Agent.*

**Prompt**

```text
Abra o package.json deste projeto e me diga qual versão do SDK do Expo ele usa.
```

Abra você também o `package.json` e compare. Se a resposta bater com o que está escrito no arquivo, o agente está lendo o projeto. Se ele responder de forma genérica, ou pedir que você cole o conteúdo, o espaço de trabalho não está aberto corretamente: volte a "Voltando para a versão defeituosa".

**Passo 2: prova 2, o agente leu o AGENTS.md.**

**Prompt**

```text
Quais convenções deste projeto você deve seguir? Cite o arquivo de onde tirou a informação.
```

A resposta deve mencionar as quatro regras que você acabou de escrever e citar o `AGENTS.md`. Se ele listar boas práticas genéricas de React sem citar o arquivo, o conteúdo não chegou até ele: confira se você salvou.

**Passo 3: prova 3, o MCP está sendo usado.**

**Prompt**

```text
Usando as ferramentas do Expo, leia a documentação de expo-haptics e me diga quais funções o
pacote expõe. Cite a página que você consultou.
```

Aqui o que interessa não é a resposta, e sim **ver a ferramenta sendo acionada** no painel: normalmente aparece uma linha indicando a chamada, que dá para expandir. Se o agente responder direto, sem acionar ferramenta nenhuma, ele está respondendo de memória, que é exatamente o que queríamos evitar.

<aside class="positive">

**Forçando a ferramenta.** Se ele insistir em responder de memória, dá para chamar a ferramenta pelo nome, digitando `#` na caixa de mensagem e escolhendo na lista que aparece. É útil para diagnóstico, mas não vale como hábito: no dia a dia você quer que o agente decida sozinho quando precisa consultar.

</aside>

### CRITERIOS.md: o arquivo que é só seu

**Passo 1: abra o CRITERIOS.md e deixe em uma aba ao lado.**

*Onde: explorador do VS Code, raiz do projeto.*

Ele já vem com as seções vazias, uma por defeito, mais a lista de verificação do *diff*. Não é lido por agente nenhum: é onde você registra, antes de pedir qualquer coisa, como vai saber que funcionou.

- **CRITERIOS.md (trecho, como vem)**

   ```text
   ## Defeito 1 — a linha empilhada

   - [ ]
   - [ ]
   - [ ]

   **Verificado em:** ( ) aparelho físico ( ) emulador
   **Resultado:** ( ) passou ( ) reprovou
   ```

Os colchetes vazios são para você preencher. O VS Code renderiza o Markdown com **Ctrl+Shift+V**, se preferir ver como lista de tarefas.

<aside class="positive">

**Fim da preparação.**

* Projeto clonado, `npm install` feito, aplicativo rodando na branch `main`.
* `AGENTS.md` com as quatro convenções acrescentadas.
* `.vscode/mcp.json` criado e servidor `expo` iniciado.
* `.github/copilot-instructions.md` criado.
* As três provas passaram.
* `CRITERIOS.md` aberto em uma aba.

</aside>

## O aplicativo desta aula
Duration: 12:00

**O que esta parte aborda.** O código completo, arquivo por arquivo, no estado em que você o recebe na branch `main`. Uma leitura guiada antes de acionar o agente, porque revisar o trabalho dele sem conhecer o terreno é impossível.

### Um aplicativo deliberadamente chato

Uma lista de compras não precisa de explicação. Você abre, vê itens com quantidade, marca o que já pegou, adiciona o que faltou. Essa banalidade é proposital: nenhum minuto da aula vai embora entendendo regras de negócio.

O aplicativo tem três arquivos e uma tela só. Não há navegação, não há persistência, não há chamada de rede. Tudo que ele faz depende apenas de conceitos que você já viu: `View`, `Text`, `Pressable`, `TextInput`, `FlatList`, `useState`, `useEffect`, `StyleSheet` e Flexbox.

| Arquivo | Responsabilidade |
| --- | --- |
| `data/itens.js` | Os itens iniciais da lista, como dados fixos. |
| `components/ItemLista.js` | Uma linha da lista: marcador, nome e quantidade. |
| `App.js` | A tela: formulário de inclusão, lista e rodapé com o resumo. |

*Tabela 5.1. Estrutura do projeto.*

<aside class="positive">

**Leia com o arquivo aberto ao lado.** Esta parte fica muito mais útil se você abrir cada arquivo no VS Code enquanto lê. Os defeitos estão todos aqui, à vista, e uma parte da turma vai identificar alguns antes de acionar o agente. Isso não é problema: descobrir na leitura e descobrir pelo agente são duas experiências, e comparar as duas é metade da aula.

</aside>

### Os dados iniciais

**data/itens.js**

```javascript
export const ITENS_INICIAIS = [
  { codigo: 'a1', nome: 'Arroz', quantidade: 1, comprado: false },
  { codigo: 'b2', nome: 'Feijão', quantidade: 2, comprado: false },
  { codigo: 'c3', nome: 'Café', quantidade: 3, comprado: true },
];
```

Repare no nome do campo identificador: `codigo`, e não `id`. Guarde isso: essa escolha aparentemente inofensiva é a razão de um dos avisos que você viu no terminal. Repare também que as quantidades são **números**: 1, 2 e 3, sem aspas. Somam 6, que é o total que aparece no rodapé ao abrir.

### A linha da lista

**components/ItemLista.js · parte 1 de 2 (o componente)**

```jsx
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ItemLista({ item, onAlternar }) {
  return (
    <Pressable style={styles.linha} onPress={() => onAlternar(item.codigo)}>
      <View style={styles.marcador}>
        <Text style={styles.marcadorTexto}>{item.comprado ? '✓' : ''}</Text>
      </View>
      <Text style={[styles.nome, item.comprado && styles.nomeRiscado]}>
        {item.nome}
      </Text>
      <Text style={styles.quantidade}>{item.quantidade}</Text>
    </Pressable>
  );
}
```

**components/ItemLista.js · parte 2 de 2 (os estilos)**

```jsx
const styles = StyleSheet.create({
  linha: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  marcador: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#15467A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marcadorTexto: { color: '#15467A', fontWeight: 'bold' },
  nome: { flex: 1, marginHorizontal: 12, fontSize: 16 },
  nomeRiscado: { textDecorationLine: 'line-through', color: '#9AA0A6' },
  quantidade: { fontSize: 16, fontWeight: 'bold', color: '#5B6472' },
});
```

O componente recebe duas coisas: o `item` a desenhar e a função `onAlternar`, que ele chama quando alguém toca na linha. Ele não decide nada sobre o estado: só avisa quem chamou. Essa separação é o que permite que o defeito de estado esteja no `App.js` e não aqui.

### A tela

O `App.js` vem a seguir em sete blocos, na ordem em que aparecem no arquivo. Junte-os e você tem o arquivo inteiro.

**App.js · bloco 1 de 7 (importações e estado)**

```jsx
import { useEffect, useState } from 'react';
import {
  FlatList, Pressable, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ItemLista from './components/ItemLista';
import { ITENS_INICIAIS } from './data/itens';

export default function App() {
  const [itens, setItens] = useState(ITENS_INICIAIS);
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [resumo, setResumo] = useState({ total: 0, comprados: 0 });
```

Quatro estados. Os três primeiros são inevitáveis: a lista, e os dois campos do formulário. O quarto merece uma pergunta que vamos responder nos defeitos: *o resumo é mesmo uma informação nova, ou dá para calculá-lo a partir da lista?*

**App.js · bloco 2 de 7 (resumo e total)**

```jsx
  useEffect(() => {
    console.log('recalculando resumo');
    setResumo({
      total: itens.length,
      comprados: itens.filter((item) => item.comprado).length,
    });
  });

  const totalUnidades = itens.reduce((soma, item) => soma + item.quantidade, 0);
```

O `console.log` está aí de propósito: é ele que enche o terminal e torna o problema audível. `totalUnidades`, logo abaixo, é calculado direto no render, sem estado, sem efeito. Compare os dois jeitos de obter um valor derivado; a diferença entre eles é o assunto de uma seção inteira mais adiante.

**App.js · bloco 3 de 7 (manipuladores)**

```jsx
  function adicionarItem() {
    if (nome.trim() === '') return;
    const novo = {
      codigo: String(Date.now()),
      nome: nome.trim(),
      quantidade: quantidade,
      comprado: false,
    };
    setItens([...itens, novo]);
    setNome('');
    setQuantidade('');
  }

  function alternarComprado(codigo) {
    const item = itens.find((i) => i.codigo === codigo);
    item.comprado = !item.comprado;
    setItens(itens);
  }
```

As duas funções fazem coisas parecidas (mudam a lista) de jeitos bem diferentes. Uma delas gera um array novo; a outra não. Volte a este bloco depois de ler o defeito 4.

**App.js · bloco 4 de 7 (título e formulário)**

```jsx
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Lista de compras</Text>

      <View style={styles.formulario}>
        <TextInput
          style={styles.campoNome}
          placeholder="Item"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.campoQuantidade}
          placeholder="Qtd"
          keyboardType="numeric"
          value={quantidade}
          onChangeText={setQuantidade}
        />
        <Pressable style={styles.botao} onPress={adicionarItem}>
          <Text style={styles.textoBotao}>Adicionar</Text>
        </Pressable>
      </View>
```

O bloco seguinte continua de dentro do mesmo `return`: a lista e o rodapé, e o fechamento do componente.

**App.js · bloco 5 de 7 (lista e rodapé)**

```jsx
      <FlatList
        data={itens}
        renderItem={({ item }) => (
          <ItemLista item={item} onAlternar={alternarComprado} />
        )}
      />

      <View style={styles.rodape}>
        <Text style={styles.rodapeTexto}>
          {resumo.comprados} de {resumo.total} itens · {totalUnidades} unidades
        </Text>
      </View>
    </SafeAreaView>
  );
}
```

**App.js · bloco 6 de 7 (estilos da tela e do formulário)**

```jsx
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  titulo: {
    fontSize: 24, fontWeight: 'bold', color: '#15467A',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
  },
  formulario: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 12, gap: 8,
  },
  campoNome: {
    flex: 1, borderWidth: 1, borderColor: '#D6D9DE',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8,
  },
  campoQuantidade: {
    width: 60, borderWidth: 1, borderColor: '#D6D9DE',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8,
    textAlign: 'center',
  },
```

O último bloco fecha o `StyleSheet.create` aberto acima.

**App.js · bloco 7 de 7 (estilos do botão e do rodapé)**

```jsx
  botao: {
    backgroundColor: '#15467A', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  textoBotao: { color: '#FFFFFF', fontWeight: 'bold' },
  rodape: {
    borderTopWidth: 1, borderTopColor: '#E5E5E5',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  rodapeTexto: { color: '#5B6472', fontSize: 14 },
});
```

<aside class="positive">

**Um detalhe que vale notar.** O estilo `formulario`, aqui no `App.js`, tem `flexDirection: 'row'`. O estilo `linha`, no `ItemLista.js`, não tem. Os dois querem elementos lado a lado. Um funciona, o outro não.

</aside>

### Uma primeira conversa com o agente sobre o código

Antes de consertar qualquer coisa, vale usar o agente para o que ele faz bem: explicar código que você não escreveu. Este é também um bom momento para calibrar a desconfiança, porque aqui você tem como conferir cada afirmação.

**Passo 1: peça uma explicação do fluxo de dados.**

*Onde: painel do Copilot Chat, modo Agent.*

**Prompt**

```text
Explique o fluxo de dados deste aplicativo: onde o estado mora, quem o altera e como uma
alteração chega até a tela. Não altere nenhum arquivo. Responda em no máximo dois parágrafos.
```

Confira a resposta contra o que você acabou de ler. Ele acertou quem chama `alternarComprado`? Mencionou que o `ItemLista.js` não guarda estado nenhum?

**Passo 2: peça a lista de conceitos usados.**

**Prompt**

```text
Liste os hooks do React e os componentes do React Native usados neste projeto, indicando em
qual arquivo cada um aparece.
```

Essa resposta é fácil de auditar linha por linha, e serve como aquecimento para o hábito que a aula inteira vai exigir: ler a saída do agente *com* o arquivo aberto ao lado, não *no lugar* dele.

<aside class="negative">

**O que não perguntar agora.** Não peça ao agente para procurar os defeitos. Além de estragar o exercício, você perderia a chance de comparar duas coisas diferentes: o que *você* consegue enxergar lendo, e o que *ele* consegue. Os passos seguintes tratam os defeitos um a um, com método.

</aside>

## O método: critério antes do prompt
Duration: 8:00

**O que esta parte aborda.** A regra que organiza todo o restante da aula: escrever, em uma frase, como você vai saber que deu certo, *antes* de acionar o agente. Por que a ordem importa, como é a anatomia de um critério que serve para alguma coisa, e o ciclo completo de trabalho.

### Por que escrever antes

Se você aciona o agente primeiro e olha o resultado depois, acontece uma coisa previsível: você lê a saída dele e conclui que está certa *porque parece certa*. O texto é fluente, o código compila, a explicação faz sentido. Não há nada ali que dispare desconfiança, e é justamente por isso que o erro passa.

Escrever o critério antes inverte a ordem. Você define o que conta como sucesso enquanto ainda não tem nada para defender. Depois, o resultado do agente ou atende ao que você escreveu, ou não atende. Vira uma comparação, não uma impressão.

<aside class="positive">

**Uma frase, no arquivo.** O critério não precisa ser um documento. Uma linha no `CRITERIOS.md` resolve. O que não pode é ficar só na cabeça: um critério que você não escreveu se ajusta sozinho para caber no que você recebeu.

</aside>

### Anatomia de um critério que funciona

Compare os dois:

> **Critério ruim**
>
> - ☐ O layout do item precisa ficar certo.

> **Critério bom**
>
> - ☐ o marcador circular, o nome e a quantidade aparecem lado a lado na horizontal
> - ☐ o nome ocupa o espaço restante da linha
> - ☐ a quantidade fica encostada na margem direita

O primeiro não decide nada: qualquer resultado pode ser chamado de "certo". O segundo tem três propriedades:

* **Fala do que se vê ou se mede, não da implementação.** Ele não diz `flexDirection: 'row'`: diz o que aparece na tela. Se dissesse a solução, você não estaria testando o agente, estaria ditando.
* **É verificável por outra pessoa.** Alguém que não acompanhou a conversa consegue olhar o aplicativo e dizer se passou.
* **Tem um jeito claro de falhar.** Se a quantidade ficar centrada em vez de à direita, o critério reprova. Um critério que nunca reprova não é critério.

### Como escrever no CRITERIOS.md

O arquivo usa a sintaxe de lista de tarefas do Markdown. Cada item vira uma condição verificável, no formato "o que eu deveria ver".

- **CRITERIOS.md · exemplo preenchido**

   ```text
   ## Defeito 1 — a linha empilhada

   - [ ] marcador, nome e quantidade aparecem lado a lado na horizontal
   - [ ] o nome ocupa o espaço do meio, esticando conforme o texto
   - [ ] a quantidade fica encostada na margem direita

   **Verificado em:** (x) aparelho físico ( ) emulador
   **Resultado:** ( ) passou ( ) reprovou
   ```

Depois de aplicar a correção e olhar o aplicativo, você troca os colchetes vazios por `[x]` nos que passaram, e marca o resultado. Se algum item reprovar, o defeito não está resolvido, mesmo que o agente diga que está.

<aside class="positive">

**Por que registrar onde você verificou.** Porque alguns comportamentos diferem entre aparelho físico e emulador. Anotar evita a conversa de "aqui funcionou" que consome quinze minutos de aula sem chegar a lugar nenhum.

</aside>

### O ciclo

![Ciclo com seis etapas: Sintoma (o que eu vejo), Critério (como saberei), Prompt (o que eu peço), Diff (o que mudou), Verificação (no app rodando) e Registro (passou ou não), com uma seta tracejada de Registro de volta ao Sintoma com a anotação "reprovou: refine o critério, não só o prompt"](img/fig-6-1.webp)

*Figura 6.1. O ciclo de trabalho com o agente. A seta de retorno é a parte que se costuma pular.*

Os seis passos, com o lugar de cada um:

| Etapa | Onde | O que fazer |
| --- | --- | --- |
| Sintoma | Celular e terminal | Observar e descrever sem interpretar |
| Critério | `CRITERIOS.md` | Escrever as condições, antes de tudo |
| Prompt | Painel do Copilot | Descrever o sintoma, pedir a causa antes da correção |
| Diff | Painel do Copilot | Ler o que mudou antes de aceitar |
| Verificação | Celular e terminal | Conferir cada condição do critério |
| Registro | `CRITERIOS.md` | Marcar passou ou reprovou |

*Tabela 6.1. Onde cada etapa do ciclo acontece.*

A seta tracejada merece atenção. Quando o resultado reprova, o reflexo é reescrever o prompt e tentar de novo. Às vezes é isso mesmo. Mas com frequência o problema é que o critério estava frouxo: você pediu uma coisa e aceitaria três resultados diferentes. Refinar o critério costuma resolver mais rápido do que refinar o pedido.

### Como ler um diff no Copilot

Quando o agente altera arquivos, o painel mostra a lista do que mudou e oferece aceitar ou descartar. Não aceite em bloco por reflexo. O caminho é:

1. Clique no nome do arquivo alterado para abrir a comparação. As linhas removidas aparecem de um lado, as acrescentadas do outro.
2. Confira se só os arquivos que você esperava foram tocados.
3. Leia as linhas acrescentadas. Você consegue explicar cada uma?
4. Só então aceite, e vá verificar no aplicativo.

<aside class="positive">

**Leia o diff antes da explicação.** A explicação do agente predispõe você a enxergar o que ela descreve. Se você ler primeiro o texto e depois o código, vai encontrar no código aquilo que o texto anunciou. Na ordem inversa, você percebe o que ficou de fora.

</aside>

## Defeitos 1 e 2: a linha empilhada e o aviso de chaves
Duration: 15:00

**O que esta parte aborda.** O núcleo da aula. Cada defeito segue a mesma sequência de passos: observar o sintoma, escrever o critério no seu arquivo, enviar o prompt, ler o *diff*, verificar no aplicativo e registrar. A causa e a correção vêm depois, de propósito, para você tentar antes de ler.

<aside class="positive">

**Confira antes de seguir.** Aplicativo rodando na branch `main`, `CRITERIOS.md` aberto em uma aba, painel do Copilot aberto em modo Agent, ferramentas do Expo visíveis no seletor. Se algum desses itens falhar, volte aos arquivos que controlam a IA.

</aside>

Uma observação sobre como usar os próximos passos. Cada seção coloca o sintoma e o critério primeiro, e a causa depois. Isso é intencional: dá para trabalhar de cima para baixo, tentar de verdade, e só então ler a explicação. Se você ler tudo antes de começar, o exercício vira leitura.

### A ordem importa

Os cinco defeitos não são independentes. Um deles esconde outro, e dois só aparecem quando você usa o aplicativo em vez de apenas abri-lo.

![Duas colunas: "visível ao abrir" com 1. linha empilhada (layout), 2. aviso de chaves (console) e 3. efeito em laço (console e lentidão); "só ao usar o app" com 4. toque não marca (mutação de estado) e 5. total vira "62" (texto somado); uma seta "esconde" vai do defeito 3 ao 4, com a nota "enquanto o defeito 3 existe, a tela redesenha sozinha e o toque parece funcionar"](img/fig-7-1.webp)

*Figura 7.1. Relação entre os defeitos. Corrigir o terceiro é o que revela o quarto.*

<aside class="positive">

**Consequência prática: siga a numeração.** Trabalhe na ordem 1, 2, 3, 4, 5. O que importa é que o defeito 3 esteja resolvido antes de você tentar o 4: enquanto o efeito estiver em laço, o componente é redesenhado dezenas de vezes por segundo e qualquer alteração no estado aparece na tela por acidente, inclusive as que deveriam falhar. Você estaria depurando com um instrumento quebrado.

</aside>

### Defeito 1: a linha empilhada

<aside class="negative">

**Sintoma.** Cada item da lista ocupa três linhas verticais: o círculo do marcador em cima, o nome no meio e a quantidade embaixo. O esperado é que os três fiquem lado a lado, como você viu na branch `solucao`.

</aside>

**Passo 1: escreva o critério.**

*Onde: arquivo CRITERIOS.md, seção "Defeito 1".*

Escreva com suas palavras antes de olhar o quadro abaixo. Depois compare.

> **Critério de aceitação**
>
> - ☐ o marcador, o nome e a quantidade aparecem lado a lado na horizontal
> - ☐ o nome ocupa o espaço central disponível
> - ☐ a quantidade fica encostada na margem direita

**Passo 2: envie o prompt.**

*Onde: painel do Copilot Chat, modo Agent.*

**Prompt**

```text
No arquivo components/ItemLista.js, cada item da lista está sendo desenhado com os três
elementos empilhados verticalmente. Eles precisam ficar lado a lado na horizontal, com o nome
ocupando o espaço do meio e a quantidade à direita.

Diga a causa antes de alterar. Altere apenas o necessário.
```

**Passo 3: leia o diff antes de aceitar.**

Uma linha alterada é o esperado. Se o *diff* tiver quinze, alguma coisa foi feita sem você pedir.

**Passo 4: verifique no celular e registre.**

*Onde: celular, e depois CRITERIOS.md.*

Confira as três condições do critério, uma por uma. Marque `[x]` nas que passaram.

**A causa**

No React Native, ao contrário do CSS da web, o eixo padrão de um contêiner Flexbox é `column`. Quem vem da web assume o oposto e não escreve o `flexDirection`, porque na web ele não seria necessário. Aqui, sem ele, os filhos empilham.

**components/ItemLista.js (correção)**

```jsx
const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    ...
```

<aside class="positive">

**Onde o agente costuma acertar, e o que observar mesmo assim.** Este é o defeito mais fácil de todos, e o agente resolve quase sempre. O que vale observar é o *tamanho* da alteração: não é raro ele reescrever o bloco de estilos inteiro, reordenar propriedades ou trocar `justifyContent` por outra coisa "já que estamos aqui". Foi para isso que você escreveu a segunda regra do `AGENTS.md`; este é o momento de ver se ela está sendo respeitada.

</aside>

### Defeito 2: o aviso de chaves

<aside class="negative">

**Sintoma.** O terminal onde o `expo start` está rodando mostra um aviso do React Native informando que os itens da lista estão sem chave, e sugerindo definir uma propriedade `key` ou `id` nos dados, ou fornecer um `keyExtractor`.

</aside>

**Passo 1: escreva o critério.**

*Onde: arquivo CRITERIOS.md, seção "Defeito 2".*

> **Critério de aceitação**
>
> - ☐ o aviso sobre chaves desaparece do terminal
> - ☐ cada linha é identificada pelo campo `codigo` do item
> - ☐ a identificação não usa a posição do item na lista

Repare que o critério menciona o `codigo` explicitamente. Sem isso, uma correção que usa o índice da posição passaria, e ela não conserta nada.

**Passo 2: envie o prompt.**

**Prompt**

```text
A FlatList do App.js está gerando aviso de chaves faltando no console. Os itens têm um
identificador único no campo codigo. Corrija usando esse campo.
```

**Passo 3: verifique e registre.**

*Onde: terminal do expo start. Pare com Ctrl+C e suba de novo para limpar as mensagens antigas.*

**A causa**

Sem um `keyExtractor`, a `FlatList` procura sozinha, em cada item, um campo chamado `key` e depois um chamado `id`. Os nossos itens não têm nenhum dos dois: o identificador se chama `codigo`. Não encontrando, ela cai no índice do array e emite o aviso.

**App.js (correção)**

```jsx
<FlatList
  data={itens}
  keyExtractor={(item) => item.codigo}
  renderItem={({ item }) => (
    <ItemLista item={item} onAlternar={alternarComprado} />
  )}
/>
```

<aside class="negative">

**A correção preguiçosa que também apaga o aviso.** `keyExtractor={(item, index) => String(index)}` faz o aviso sumir e não conserta nada: a chave volta a ser a posição, que é exatamente o que a `FlatList` já estava fazendo. Se o seu critério fosse apenas "o aviso some", essa resposta passaria, e este é o primeiro exemplo concreto de um critério frouxo aceitando um resultado errado.

</aside>

## Defeito 3: o efeito em laço
Duration: 15:00

<aside class="negative">

**Sintoma.** A mensagem `recalculando resumo` aparece no terminal continuamente, sem nenhuma ação sua. O aplicativo fica lento. Depois de alguns segundos o React emite um erro avisando que a profundidade máxima de atualizações foi excedida, e mencionando `setState` dentro de `useEffect` sem array de dependências.

</aside>

Este é o defeito central da aula. Faça os passos, e depois leia com atenção a subseção sobre as duas correções: ela é o motivo pelo qual este defeito está aqui.

**Passo 1: escreva o critério.**

*Onde: arquivo CRITERIOS.md, seção "Defeito 3".*

> **Critério de aceitação: primeira versão**
>
> - ☐ a mensagem `recalculando resumo` deixa de aparecer repetidamente
> - ☐ o erro de profundidade máxima de atualizações não ocorre mais
> - ☐ o rodapé continua mostrando a contagem correta de comprados e do total

**Passo 2: envie o prompt.**

**Prompt**

```text
O useEffect do App.js está executando indefinidamente e o React reclama de profundidade máxima
de atualizações.

Explique a causa antes de alterar qualquer coisa. Depois corrija.
```

**Passo 3: leia a explicação com atenção.**

Antes de aceitar o *diff*, releia o parágrafo em que ele explica a causa. Ele falou em **identidade de objeto**, ou parou no **array de dependências**? Guarde a resposta: ela vai importar daqui a pouco.

**Passo 4: verifique e registre.**

### A causa

Um `useEffect` sem array de dependências roda depois de *todo* render. Esse efeito chama `setResumo` com um **objeto literal**, e um objeto literal é um valor novo a cada execução, mesmo que os campos sejam idênticos. O React compara por identidade, conclui que o estado mudou, agenda outro render, que dispara o efeito de novo. O laço não se fecha nunca.

<aside class="positive">

**Por que um número não causaria isso.** Se o efeito guardasse um número em vez de um objeto (por exemplo `setTotal(itens.length)`), o laço pararia sozinho depois de uma volta. O React descarta a atualização quando o novo valor é idêntico ao atual, e dois números iguais são idênticos. Dois objetos com o mesmo conteúdo não são. Essa distinção é a raiz do defeito.

</aside>

### A correção que o agente costuma dar

**App.js (correção rasa)**

```jsx
useEffect(() => {
  console.log('recalculando resumo');
  setResumo({
    total: itens.length,
    comprados: itens.filter((item) => item.comprado).length,
  });
}, [itens]);
```

Isso atende ao critério que você escreveu. O laço para, o terminal silencia, o rodapé mostra os números certos. Se a aula terminasse aqui, todo mundo iria embora achando que resolveu.

### A correção que resolve o problema

Só que o defeito não era a falta do array. Era a **existência do estado**. `resumo` é inteiramente derivável de `itens`: não há informação nova nele. Estado que pode ser calculado não deve ser estado:

**App.js (correção real)**

```jsx
const resumo = {
  total: itens.length,
  comprados: itens.filter((item) => item.comprado).length,
};
// o useEffect e o useState de resumo desaparecem do arquivo
```

Some o efeito, some o estado, some a possibilidade do laço, e o rodapé passa a ser sempre coerente com a lista, porque é calculado no mesmo render, e não um render depois. Repare que é exatamente assim que `totalUnidades` já era calculado, três linhas abaixo. A resposta estava no próprio arquivo.

**Passo 5: se o agente deu a correção rasa, insista.**

*Onde: painel do Copilot Chat, na mesma conversa.*

**Prompt**

```text
Você corrigiu o laço adicionando o array de dependências. Existe alguma razão para esse estado
existir? Ele poderia ser calculado durante o render, como totalUnidades já é?
```

<aside class="negative">

**O que isso ensina sobre o critério.** O critério que você escreveu era verificável, específico e falseável. E ainda assim aceitava uma correção que trata o sintoma. Não porque estava mal escrito, mas porque foi escrito a partir do sintoma, e o sintoma era o terminal, não a arquitetura.

Um critério só enxerga até onde vai o seu entendimento do problema. Essa é a limitação real do método, e não existe truque de prompt que a contorne. O que existe é: pedir a explicação da causa antes da correção, como o prompt deste defeito fez, e lê-la com desconfiança.

</aside>

**Passo 6: reescreva o critério e registre os dois.**

*Onde: arquivo CRITERIOS.md, seção "Defeito 3".*

Deixe as duas versões no arquivo. A diferença entre elas é o registro do que você aprendeu neste defeito.

> **Critério de aceitação: segunda versão**
>
> - ☐ o laço para
> - ☐ o arquivo não contém nenhum `useState` cujo valor possa ser calculado a partir de `itens`
> - ☐ o arquivo não contém nenhum `useEffect` cuja única função seja manter esse valor

## Defeitos 4 e 5: o toque que não marca e o 6 mais 2 que dá 62
Duration: 15:00

### Defeito 4: o toque que não marca

<aside class="negative">

**Corrija o defeito 3 antes de continuar.** Enquanto o efeito estiver em laço, este defeito fica invisível: a tela é redesenhada o tempo todo e o marcador parece responder ao toque normalmente.

</aside>

<aside class="negative">

**Sintoma.** Você toca em um item da lista e nada acontece. O marcador não fica preenchido, o nome não é riscado, o rodapé não muda. Mas se em seguida você digitar qualquer letra no campo de nome, todos os itens que você tocou aparecem marcados de uma vez.

</aside>

**Passo 1: escreva o critério.**

*Onde: arquivo CRITERIOS.md, seção "Defeito 4".*

> **Critério de aceitação**
>
> - ☐ tocar em um item preenche o marcador e risca o nome no mesmo instante
> - ☐ a contagem do rodapé muda junto com o toque
> - ☐ tocar de novo no mesmo item desfaz as três coisas
> - ☐ nenhuma marcação aparece com atraso, ao digitar em outro campo

**Passo 2: envie o prompt.**

**Prompt**

```text
Em App.js, a função alternarComprado não atualiza a tela quando um item é tocado, embora o
dado pareça mudar: as alterações aparecem depois, todas de uma vez, quando eu digito no campo
de nome.

Identifique a causa e corrija, sem alterar o restante do arquivo.
```

**Passo 3: verifique e registre.**

Teste também o caso do sintoma: toque em dois itens, depois digite uma letra no campo de nome. Depois da correção, nada deve "aparecer atrasado".

**A causa**

A função encontra o item dentro do array e altera a propriedade `comprado` nele mesmo. Depois entrega ao `setItens` o **mesmo array** de antes. Para o React, nada mudou: a referência é idêntica à atual, e ele descarta a atualização sem redesenhar coisa alguma. O dado mudou; a tela não ficou sabendo.

O detalhe cruel é o segundo parágrafo do sintoma. As alterações aconteceram de verdade: estão no array. Quando qualquer outra coisa provoca um render (o `setNome` ao digitar, por exemplo), elas aparecem todas juntas. Um estado que muda sem avisar é pior do que um estado que não muda: ele produz telas que discordam dos dados por um tempo indeterminado.

**App.js (correção)**

```jsx
function alternarComprado(codigo) {
  setItens(
    itens.map((item) =>
      item.codigo === codigo ? { ...item, comprado: !item.comprado } : item
    )
  );
}
```

O `map` devolve um array novo, e o item alterado é um objeto novo. Os demais itens continuam sendo os mesmos objetos, o que é desejável, e não descuido: apenas o que mudou tem identidade nova.

<aside class="positive">

**A regra, em uma frase.** Nunca modifique um valor que está no estado. Gere um novo e entregue esse. Isso vale para `push`, `splice`, `sort` e para atribuição direta de propriedade, como aqui. É a quarta regra que você escreveu no `AGENTS.md`, e o Exercício 3 investiga se ela fez diferença.

</aside>

### Defeito 5: 6 mais 2 dá 62

<aside class="negative">

**Sintoma.** O rodapé mostra "6 unidades" ao abrir. Você adiciona um item com quantidade 2 e ele passa a mostrar "62 unidades".

</aside>

**Passo 1: reproduza o sintoma.**

*Onde: no celular.*

Digite um nome qualquer, quantidade `2`, e toque em **Adicionar**. Olhe o rodapé. Este defeito é *latente*: ele não existe até você usar o formulário.

**Passo 2: escreva o critério.**

*Onde: arquivo CRITERIOS.md, seção "Defeito 5".*

> **Critério de aceitação**
>
> - ☐ adicionar um item com quantidade 2 a uma lista de 6 unidades leva o rodapé a 8
> - ☐ campo de quantidade vazio não quebra o total
> - ☐ texto não numérico no campo de quantidade não quebra o total
> - ☐ o rodapé nunca mostra `NaN`

A segunda frase é o que separa um critério bom de um apressado. Teste o campo vazio antes de dar o defeito por resolvido.

**Passo 3: envie o prompt.**

**Prompt**

```text
Em App.js, o total de unidades no rodapé concatena em vez de somar quando um item novo é
adicionado pelo formulário.

Corrija na origem do problema, não no cálculo do total. Trate também o caso de campo vazio.
```

**Passo 4: verifique os dois casos e registre.**

Adicione um item com quantidade 2 e confira o total. Depois adicione outro deixando a quantidade em branco e confira se o rodapé continua com um número.

**A causa**

O valor de um `TextInput` é sempre texto. `keyboardType="numeric"` muda o teclado que aparece no aparelho, não muda o tipo do dado. Os itens iniciais têm quantidade numérica; o item novo entra com quantidade em texto. O `reduce` então começa somando números e, ao chegar no item novo, o operador `+` muda de comportamento: com um texto de um lado, ele concatena. `6 + '2'` é `'62'`.

**App.js (correção)**

```jsx
const novo = {
  codigo: String(Date.now()),
  nome: nome.trim(),
  quantidade: Number(quantidade) || 1,
  comprado: false,
};
```

O `Number()` converte **na fronteira**, no ponto exato em que o texto vira dado da aplicação. O `|| 1` cobre campo vazio e texto não numérico, em que `Number()` devolveria `NaN`: sem isso, o total inteiro viraria `NaN` e o rodapé mostraria "NaN unidades".

<aside class="negative">

**A correção que o agente costuma propor.** É comum o agente consertar no *cálculo*, escrevendo algo como `soma + Number(item.quantidade)` dentro do `reduce`. O total passa a ficar certo e o critério, se estivesse escrito só como "o rodapé mostra 8", passaria.

Mas o dado errado continua no estado, com tipo inconsistente entre itens. O próximo lugar que usar `quantidade` (uma ordenação, uma comparação, um envio para uma API) vai encontrar o mesmo problema de novo. Converter na fronteira conserta uma vez; converter no consumo conserta em cada consumo, e você só descobre que esqueceu um quando ele quebra. Por isso o prompt deste defeito diz "na origem do problema".

</aside>

### Fechando os defeitos

<aside class="positive">

**Antes de ir para a funcionalidade nova.**

* Os cinco defeitos verificados no aplicativo rodando, não no chat.
* `CRITERIOS.md` preenchido, incluindo as duas versões do critério do defeito 3.
* Você consegue explicar, sem consultar, por que o defeito 3 escondia o defeito 4.

</aside>

<aside class="positive">

**Compare com o gabarito, agora sim.** Este é o momento de olhar a branch `solucao`. Rode `git diff solucao -- App.js` para ver as diferenças entre o seu resultado e o de referência, ou abra os arquivos direto. Diferenças de estilo são esperadas; o que interessa é se alguma correção sua tratou o sintoma em vez da causa.

</aside>

## Uma funcionalidade com um SDK que você não conhece
Duration: 15:00

**O que esta parte aborda.** A segunda metade do exercício: em vez de consertar o que existe, acrescentar algo novo usando um pacote que ninguém na sala já usou. É aqui que a diferença entre um agente com contexto e um agente chutando deixa de ser teoria.

### Por que esta tarefa e não outra

Consertar defeitos exercita a leitura de código e a verificação. Não exercita a parte em que o agente é mais útil e mais perigoso ao mesmo tempo: escrever algo que você não sabe escrever.

A tarefa é dar **retorno tátil** ao marcar um item: o aparelho vibra por um instante quando você toca. O pacote é o `expo-haptics`. A escolha atende a três requisitos:

* **Ninguém sabe a API de cor.** Você não tem como avaliar o código pelo reconhecimento. Vai ter que verificar de outro jeito.
* **A verificação é trivial.** Vibrou ou não vibrou. Não há margem para interpretação.
* **Exige instalar um pacote na versão compatível com o SDK**, que é exatamente o ponto em que o modelo sozinho erra e o servidor MCP acerta.

<aside class="negative">

**Requer aparelho físico.** Vibração tátil não existe no simulador do iOS e, na maioria dos emuladores de Android, também não. Faça esta parte com o aplicativo aberto no seu celular, pelo Expo Go. Se não for possível, use a alternativa do próximo passo, que produz um resultado igualmente verificável e funciona em emulador.

</aside>

### O critério, antes de tudo

**Passo 1: escreva o critério.**

*Onde: arquivo CRITERIOS.md, seção "Funcionalidade nova".*

> **Critério de aceitação**
>
> - ☐ tocar em um item da lista produz uma vibração curta e única
> - ☐ a vibração ocorre tanto ao marcar quanto ao desmarcar
> - ☐ tocar no botão Adicionar não produz vibração
> - ☐ tocar nos campos de texto não produz vibração

A última frase parece supérflua e não é. Um agente instruído a "adicionar retorno tátil ao aplicativo" pode espalhar chamadas por todos os elementos tocáveis. Sem essa cláusula, um resultado exagerado passaria.

### O prompt

**Passo 1: envie o prompt.**

*Onde: painel do Copilot Chat, modo Agent.*

**Prompt**

```text
Quero retorno tátil neste aplicativo: ao tocar em um item da lista para marcar ou desmarcar, o
aparelho deve emitir uma vibração curta e única. Nenhum outro toque na tela deve vibrar.

Use as ferramentas do Expo para consultar a documentação e para instalar a dependência na
versão compatível com o SDK deste projeto.

Antes de alterar qualquer arquivo, me diga qual pacote vai usar, qual função dele resolve isso
e por que essa função e não outra.
```

Três coisas foram pedidas de propósito nesse prompt: consultar a documentação, instalar pela ferramenta certa e justificar a escolha antes de executar.

<aside class="positive">

**Aqui o critério foi junto no prompt, e isso é diferente.** Repare que este prompt embute o critério, ao contrário dos prompts dos defeitos. A razão é que o objetivo mudou. Nos defeitos você estava *medindo* o agente contra um resultado conhecido, e por isso a medida precisava ficar de fora. Aqui você quer *obter* uma funcionalidade, e dar o alvo explícito melhora o resultado. Saber quando fazer cada coisa é parte da habilidade.

</aside>

**Passo 2: observe as ferramentas sendo acionadas.**

*Onde: painel do Copilot, enquanto ele trabalha.*

Você deve ver chamadas às ferramentas do Expo. Se nenhuma for acionada, ele está respondendo de memória, e o resultado precisa ser tratado com a desconfiança que isso merece.

### O que deve acontecer

O agente deve instalar o pacote com o comando do Expo, e não com o do npm:

**Terminal**

```bash
npx expo install expo-haptics
```

E a alteração no `App.js` deve ser mínima: uma importação e uma linha dentro da função que já existe:

**App.js (com retorno tátil)**

```jsx
import * as Haptics from 'expo-haptics';

function alternarComprado(codigo) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  setItens(
    itens.map((item) =>
      item.codigo === codigo ? { ...item, comprado: !item.comprado } : item
    )
  );
}
```

<aside class="positive">

**Por que impactAsync e não outra.** O pacote oferece três famílias de retorno tátil, com propósitos distintos: `impactAsync` para o feedback de um toque direto em algo, `notificationAsync` para comunicar o desfecho de uma operação (sucesso, alerta, erro) e `selectionAsync` para mudança de seleção em um seletor. Marcar um item é um toque direto: `impactAsync` com intensidade `Light`. Essa justificativa é o que o prompt pediu antes da execução, e é o que você deve conferir na resposta.

</aside>

**Passo 1: reinicie o aplicativo e verifique.**

*Onde: terminal e celular.*

Instalar um pacote nativo exige recarregar o aplicativo. Pare o servidor com **Ctrl+C**, rode `npx expo start` de novo e leia o QR Code outra vez. Depois teste as três condições do critério, inclusive a última: toque no botão **Adicionar** e confirme que ele *não* vibra.

### Um segundo pedido, para exercitar o escopo

**Passo 1: peça uma variação e observe o tamanho do diff.**

**Prompt**

```text
Quero que a vibração seja um pouco mais forte apenas quando o item está sendo marcado como
comprado, e permaneça leve quando está sendo desmarcado.
```

É uma alteração de duas ou três linhas. Se o *diff* vier grande, você tem um exemplo concreto de escopo escapando, e vale recusar e pedir de novo, citando a regra do `AGENTS.md`.

## Alternativa para quem está em emulador: copiar a lista
Duration: 15:00

Se não houver celular físico disponível, troque a tarefa da vibração por esta. O objetivo pedagógico é idêntico: um pacote que você não conhece, uma instalação que precisa respeitar o SDK e uma verificação que não admite interpretação. Só o resultado observável muda: em vez de sentir a vibração, você cola o texto em outro aplicativo e confere.

A tarefa é um botão que copia a lista inteira, em formato de texto, para a área de transferência do aparelho. O pacote é o `expo-clipboard`.

### O critério, antes de tudo

**Passo 1: escreva o critério.**

*Onde: arquivo CRITERIOS.md, seção "Funcionalidade nova".*

> **Critério de aceitação**
>
> - ☐ tocar em "Copiar lista" envia o conteúdo atual da lista para a área de transferência
> - ☐ colar em outro aplicativo reproduz uma linha por item
> - ☐ cada linha indica se o item já foi comprado
> - ☐ há uma quebra de linha entre os itens, e não tudo emendado
> - ☐ a lista do aplicativo continua igual depois de copiar

As duas últimas frases fazem trabalho. "Com uma quebra de linha entre os itens" impede que passe uma versão que junte tudo em uma linha só, o que acontece se o agente esquecer o separador no `join`. E "o botão não altera a lista" delimita o escopo: copiar é uma operação de leitura, e um agente que aproveitasse a viagem para marcar itens como copiados estaria inventando requisito.

### O prompt

**Passo 2: envie o prompt.**

*Onde: painel do Copilot Chat, modo Agent.*

**Prompt**

```text
Quero um botão "Copiar lista" no rodapé deste aplicativo. Ao ser tocado, ele deve copiar a
lista inteira para a área de transferência como texto, uma linha por item, indicando quais já
foram comprados. O botão não deve alterar a lista.

Use as ferramentas do Expo para consultar a documentação e para instalar a dependência na
versão compatível com o SDK deste projeto.

Antes de alterar qualquer arquivo, me diga qual pacote vai usar, qual função dele resolve isso
e por que essa função e não outra.
```

É o mesmo formato do prompt da vibração, e pelo mesmo motivo: o critério vai junto porque aqui o objetivo é obter a funcionalidade, e a justificativa é pedida antes da execução para que você tenha o que auditar.

**Passo 3: observe as ferramentas sendo acionadas.**

*Onde: painel do Copilot, enquanto ele trabalha.*

Se nenhuma ferramenta do Expo for chamada, ele está respondendo de memória. Vale interromper e pedir explicitamente que consulte a documentação antes de seguir.

### O que deve acontecer

A instalação, como sempre, pelo comando do Expo:

**Terminal**

```bash
npx expo install expo-clipboard
```

E três alterações no `App.js`. A primeira é a importação e a função que monta o texto:

**App.js (importação e função)**

```jsx
import * as Clipboard from 'expo-clipboard';

async function copiarLista() {
  const texto = itens
    .map((i) => `${i.comprado ? '[x]' : '[ ]'} ${i.nome} - ${i.quantidade}`)
    .join('\n');
  await Clipboard.setStringAsync(texto);
}
```

O `map` transforma cada item em uma linha de texto, e o `join` cola as linhas separadas por quebra de linha. O resultado, para a lista inicial, é este:

**O que vai para a área de transferência**

```text
[ ] Arroz - 1
[ ] Feijão - 2
[x] Café - 3
```

A segunda alteração é o botão em si, dentro do rodapé que já existia (as linhas novas são as do `Pressable`):

**App.js (o botão no rodapé)**

```jsx
<View style={styles.rodape}>
  <Text style={styles.rodapeTexto}>
    {resumo.comprados} de {resumo.total} itens · {totalUnidades} unidades
  </Text>
  <Pressable style={styles.botaoCopiar} onPress={copiarLista}>
    <Text style={styles.textoBotaoCopiar}>Copiar lista</Text>
  </Pressable>
</View>
```

E a terceira são os estilos. O `rodape` ganha três propriedades para acomodar dois filhos lado a lado, e dois estilos novos aparecem:

**App.js (estilos)**

```jsx
rodape: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTopWidth: 1, borderTopColor: '#E5E5E5',
  paddingHorizontal: 16, paddingVertical: 12,
},
rodapeTexto: { color: '#5B6472', fontSize: 14 },
botaoCopiar: {
  borderWidth: 1, borderColor: '#15467A', borderRadius: 8,
  paddingHorizontal: 12, paddingVertical: 6,
},
textoBotaoCopiar: { color: '#15467A', fontWeight: 'bold', fontSize: 13 },
```

<aside class="positive">

**Por que setStringAsync e não outra.** O pacote expõe pares de funções para cada tipo de conteúdo: `setStringAsync` e `getStringAsync` para texto, além de variantes para imagem e URL. Copiar é escrita, então é a função `set`. O sufixo `Async` não é decorativo: a operação conversa com o sistema operacional e devolve uma promessa, por isso a função que a chama é declarada `async` e usa `await`.

Essa justificativa é o que o prompt pediu antes da execução, e é o que você deve conferir na resposta antes de aceitar o *diff*.

</aside>

**Passo 4: reinicie o aplicativo.**

*Onde: terminal. Ctrl+C para parar, depois npx expo start.*

Instalar um pacote novo exige recarregar. Leia o QR Code outra vez.

**Passo 5: verifique as quatro condições do critério.**

*Onde: no celular ou emulador, e depois em qualquer aplicativo de texto.*

1. Toque em "Copiar lista".
2. Abra um aplicativo de mensagens, notas ou e-mail e cole.
3. Confira: são três linhas, uma por item, com `[x]` apenas no Café?
4. Volte ao aplicativo. A lista continua igual: nada foi marcado nem removido?

**Passo 6: registre no CRITERIOS.md.**

Marque cada condição e o resultado. Se a colagem vier em uma linha só, o critério reprova mesmo que o texto esteja correto: era exatamente isso que a cláusula da quebra de linha existia para pegar.

### Um segundo pedido, para exercitar o escopo

**Passo 7: peça uma variação e observe o tamanho do diff.**

**Prompt**

```text
Quero que o texto copiado traga apenas os itens que ainda não foram comprados, e que o botão
fique desabilitado quando não houver nenhum item pendente.
```

São poucas linhas: um `filter` antes do `map`, e a propriedade `disabled` no `Pressable`. Se o *diff* vier grande, você tem um exemplo concreto de escopo escapando, e vale recusar e pedir de novo, citando a segunda regra do `AGENTS.md`.

<aside class="positive">

**Um detalhe que costuma passar em branco.** Um botão desabilitado que continua com a mesma aparência de um habilitado é um defeito de interface, não de lógica. Se o agente adicionar apenas o `disabled` sem mudar nada visualmente, o critério "o botão fica desabilitado" passa no código e falha para quem usa. Vale escrever o critério pensando no que se vê, como sempre.

</aside>

### O que esta alternativa não cobre

Uma diferença honesta em relação à tarefa da vibração: o `expo-clipboard` tem uma API mais previsível, e o agente erra menos com ela. A chance de você presenciar uma função inventada (como o `Haptics.vibrate()` citado em "Onde o agente falha", que não existe) é menor aqui.

Em compensação, a verificação é mais rica: são quatro condições em vez de três, e uma delas (a quebra de linha) falha de um jeito silencioso, que só aparece quando você realmente cola o texto em algum lugar. Se você tiver tempo e um aparelho disponível depois, vale fazer as duas.

### O ponto da funcionalidade inteira

Compare os dois comandos:

| Comando | O que ele instala |
| --- | --- |
| `npm install expo-haptics` | A versão mais recente publicada, sem consultar o SDK deste projeto. Pode funcionar. Pode quebrar o build de forma que só aparece depois. |
| `npx expo install expo-haptics` | A versão que o SDK deste projeto declara como compatível. |

*Tabela 8.1. A diferença que o servidor MCP faz na prática.*

Um agente sem contexto tende ao primeiro, porque é o comando mais comum nos dados com que foi treinado. Um agente com o servidor MCP conectado usa o segundo, porque a ferramenta que instala biblioteca no Expo faz isso por construção. É uma diferença de uma palavra no terminal e de horas de depuração depois.

## Onde o agente falha
Duration: 8:00

**O que esta parte aborda.** Um catálogo dos modos de falha que apareceram ao longo do exercício, o que cada um tem de característico, e uma lista de verificação para ler o *diff* antes de aceitar.

### Consertar o sintoma sem tocar na causa

Foi o que aconteceu no defeito 3, e é o modo de falha mais difícil de perceber, porque o resultado passa no teste. O laço parou. O terminal silenciou. Nada no comportamento denuncia que a causa continua ali.

O sinal de alerta é a forma da correção: uma alteração pequena, cirúrgica, feita exatamente no ponto que a mensagem de erro apontava. Mensagens de erro descrevem onde o problema se *manifesta*, não onde ele *nasce*. Quando a correção é literalmente o que a mensagem sugeria, vale perguntar mais uma vez.

### Inventar uma API que não existe

Modelos completam padrões. Se um pacote se chama `expo-haptics` e o React Native tem um módulo `Vibration` com um método `vibrate()`, é plausível (e errado) que apareça `Haptics.vibrate()` em algum lugar. A função não existe no pacote.

Esse tipo de erro costuma ser barato, porque quebra na hora. Fica caro quando o código inventado está num caminho que não é exercitado durante a aula: um tratamento de erro, uma tela pouco visitada. Aí ele espera.

### Alterar coisas que ninguém pediu

Um pedido pontual pode voltar com um arquivo inteiro reformatado, importações reordenadas, uma variável renomeada "para ficar mais claro". Nada disso é malicioso e quase nada disso quebra o aplicativo, mas destrói a sua capacidade de saber o que mudou, porque agora o *diff* tem oitenta linhas e a correção real são duas.

É por isso que quase todos os prompts deste material terminam pedindo para alterar apenas o necessário, e por isso a mesma regra está no `AGENTS.md`. Não é preciosismo: é manter o *diff* legível.

### Concordar com você

Se você afirma que o problema está no arquivo X, o agente tende a procurar no arquivo X e a encontrar alguma coisa lá. Descreva sintomas, não diagnósticos: "o toque não marca o item" funciona melhor do que "acho que o `setItens` está errado", porque o segundo já entrega a conclusão e elimina a chance de ele discordar de você.

### Perder o fio em conversas longas

Depois de muitas mensagens, o começo da conversa pesa menos. Um agente que respeitava suas regras no início pode passar a ignorá-las: é um dos motivos pelos quais as regras ficam em arquivo, e não só no primeiro prompt. Se o comportamento degradar, comece uma conversa nova: o `AGENTS.md` e o `copilot-instructions.md` são lidos de novo, e você recupera o contexto sem redigitar nada.

### Lista de verificação antes de aceitar o diff

1. **Quais arquivos mudaram?** Algum que você não esperava?
2. **Quantas linhas?** Se for muito mais do que o problema exige, procure o que entrou de carona.
3. **A causa foi tocada, ou só o sintoma?** Consegue explicar por que o problema acontecia?
4. **Entrou alguma dependência nova?** Instalada com qual comando, em qual versão?
5. **Você consegue explicar cada linha alterada?** Se não, pergunte antes de aceitar. Aceitar código que você não entende é assumir uma dívida cujo vencimento você não escolhe.
6. **O critério foi verificado no aplicativo rodando, e não na resposta do chat?**

Essa lista também está no final do `CRITERIOS.md`, para você responder por escrito quando quiser, e o Exercício 5 pede exatamente isso.

## Exercícios
Duration: 30:00

1. Corrija os defeitos 1 e 2 **sem usar o agente**, escrevendo o código à mão, e cronometre. Corrija os defeitos 4 e 5 **pelo agente**, e cronometre também. Registre no `CRITERIOS.md` os dois tempos, e responda por escrito: em qual dos dois caminhos você consegue explicar melhor por que o defeito acontecia, e houve alguma correção que você aceitou sem conseguir explicar.

2. Abra uma conversa nova com o Copilot e envie o pedido abaixo. Compare a resposta com o passo "Defeito 3: o efeito em laço" e escreva o que faltou nela.

   **Prompt**

   ```text
   Sem alterar nenhum arquivo: explique por que um useEffect sem array de dependências
   que chama setState com um objeto literal entra em laço infinito, e por que o mesmo não
   aconteceria se ele guardasse um número.
   ```

3. Desfaça a correção do defeito 4 com `git checkout v3-efeito -- App.js`. Remova do `AGENTS.md` a regra "estado nunca é modificado no lugar", abra uma conversa nova e peça a correção; registre o que veio. Recoloque a regra, abra outra conversa nova, peça a mesma coisa com o mesmo texto e registre de novo. Compare as duas respostas.

4. Plante um defeito no aplicativo, de um conceito que você já domina, e passe o projeto para um colega. Ele deve observar o sintoma, escrever o critério, acionar o agente e verificar, nessa ordem. Ao final, comparem se o critério que ele escreveu descrevia o defeito que você plantou.

5. Implemente a remoção de itens da lista usando o agente, seguindo o ciclo do método "critério antes do prompt". Escreva o critério antes, considerando o que acontece com o rodapé e o que deve acontecer se a lista ficar vazia. Peça a causa e o plano antes da implementação, leia o *diff* antes da explicação e verifique no aplicativo rodando. Responda por escrito aos seis pontos da lista de verificação antes de aceitar o *diff* e entregue o `CRITERIOS.md` preenchido junto com o código.
