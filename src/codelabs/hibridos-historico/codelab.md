summary: Entenda as quatro estratégias de desenvolvimento de aplicações (web, nativo, híbrido e multiplataforma), seus modelos de execução, tecnologias, vantagens e limitações, e como escolher entre elas.
id: hibridos-historico
categories: Mobile,React Native
tags: mobile,web,nativo,hibrido,multiplataforma,webview,pwa,flutter,react native,cordova,capacitor
status: Published
authors: Rodrigo Bossini
last updated: 2026-08-07
pdf: desenvolvimento_de_aplicativos_hibridos/01_apostila_dev_aplicativos_hibridos_historico.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Desenvolvimento de aplicações: web, nativo, híbrido e multiplataforma

## Visão geral
Duration: 3:00

Um mesmo produto hoje precisa existir no navegador, no Android, no iOS, no desktop e em outros dispositivos. Este codelab apresenta as quatro grandes estratégias para enfrentar esse problema (**web**, **nativo**, **híbrido** e **multiplataforma**), os fundamentos comuns a todas, um comparativo consolidado e um roteiro para decidir entre elas.

### O que você vai aprender

* Por que a fragmentação de plataformas deu origem a quatro caminhos de desenvolvimento
* O que é um WebView e por que ele separa o híbrido do multiplataforma
* O trade-off central entre reuso de código e proximidade da plataforma
* As camadas de uma aplicação, o vocabulário essencial e os critérios de avaliação
* Modelos de execução, tecnologias, vantagens e limitações de cada abordagem
* Como usar um fluxograma de decisão e analisar estudos de caso

### O que você vai precisar

* Nenhuma instalação: o conteúdo é conceitual
* Familiaridade básica com desenvolvimento web ajuda

## Panorama: por que existem quatro caminhos
Duration: 8:00

### O que esta parte aborda

* **1.1 Fragmentação de plataformas**: por que um mesmo produto precisa existir em ambientes tecnicamente incompatíveis.
* **1.2 As quatro abordagens**: definição objetiva de web, nativo, híbrido e multiplataforma.
* **1.3 O trade-off central**: a relação inversa entre reuso de código e proximidade da plataforma.
* **1.4 Linha do tempo**: como cada abordagem surgiu e a que problema respondia.

### 1.1 O problema da fragmentação de plataformas

*Foco: entender a origem do problema que todas as abordagens tentam resolver.*

Até meados dos anos 2000, "fazer um programa" significava, na prática, escolher entre Windows, algum sabor de Unix e pouco mais. A explosão dos smartphones a partir de 2007–2008 alterou esse cenário de forma irreversível: de repente, o mesmo produto precisava existir em Android, iOS, na web, no desktop e, mais recentemente, em relógios, televisores e sistemas embarcados automotivos.

Cada uma dessas plataformas traz consigo um conjunto próprio e incompatível de linguagens, bibliotecas de interface, modelos de ciclo de vida, políticas de distribuição e diretrizes de design. Escrever tudo separadamente multiplica o custo; escrever uma vez só costuma custar em desempenho ou em fidelidade visual. Toda estratégia de desenvolvimento discutida a seguir é, no fundo, uma resposta diferente a esse mesmo dilema.

![Diagrama: "Um produto (uma ideia de negócio)" ligado a Web (navegador), Android (Kotlin/Java), iOS (Swift) e Desktop (Win/macOS/Linux), e, por setas tracejadas, a Wearables, TV, Automotivo e IoT/Embarcado](img/fig-1-1.webp)

*Figura 1.1: A fragmentação de plataformas: um único produto precisa existir em ambientes tecnicamente incompatíveis entre si. As setas tracejadas indicam alvos secundários que se tornaram comuns na última década. Cada alvo possui SDK, linguagem, loja de distribuição e diretrizes de design próprios.*

### 1.2 As quatro abordagens em uma frase

*Foco: fixar as definições que serão usadas em todos os capítulos seguintes.*

> **Web**
>
> A aplicação é entregue por HTTP e executada pelo motor de renderização do navegador. Não há instalação obrigatória; a atualização é imediata para todos os usuários.

> **Nativo**
>
> A aplicação é compilada para o formato binário da plataforma, usando a linguagem e o SDK oficiais. Acesso total ao hardware e ao sistema, com o melhor desempenho possível, ao custo de uma base de código por plataforma.

> **Híbrido**
>
> A interface é construída com HTML, CSS e JavaScript, mas roda dentro de um WebView embarcado num aplicativo nativo. Plugins fazem a ponte para recursos do dispositivo.

> **Multiplataforma**
>
> Uma base de código única em uma linguagem intermediária gera aplicações que usam componentes nativos reais ou um motor gráfico próprio, sem WebView.

As definições acima usam duas vezes o mesmo termo, **WebView**, e é ele que separa o híbrido do multiplataforma. Vale, portanto, fixá-lo antes de seguir adiante.

> **O que é um WebView?**
>
> WebView é um componente fornecido pelo próprio sistema operacional que embute um motor de navegador dentro de um aplicativo instalado. Ele carrega e renderiza HTML, CSS e JavaScript exatamente como um navegador faria, mas sem barra de endereço, abas ou qualquer interface de navegação: para o usuário, aquilo é apenas mais uma tela do aplicativo. É a peça que define o desenvolvimento híbrido, e também a origem de suas principais limitações.

Características principais:

* **É nativo por fora, web por dentro.** O aplicativo tem ícone, ciclo de vida e presença na loja como qualquer outro; o conteúdo da tela, porém, é HTML, CSS e JavaScript.
* **Vem do sistema operacional.** No Android é a classe `android.webkit.WebView`; no iOS, o `WKWebView`. Não é preciso embutir um navegador no pacote.
* **Carrega conteúdo local ou remoto.** Os arquivos costumam vir de dentro do próprio pacote instalado, o que permite funcionar sem conexão.
* **Executa em área isolada (sandbox).** Sozinho, o código web não alcança câmera, GPS, biometria ou sistema de arquivos.
* **Depende de plugins para o hardware.** Uma camada de plugins traduz chamadas JavaScript em chamadas nativas: é por ela que passa todo acesso a recursos do dispositivo.
* **Custa desempenho e memória.** Renderizar via motor de navegador é mais lento que usar widgets nativos, e o componente consome memória de um navegador inteiro.
* **Permite atualizar sem passar pela loja.** Como a interface é conteúdo web, boa parte dela pode ser trocada sem publicar nova versão do aplicativo.

![Celular com barra nativa do aplicativo no topo, uma área tracejada "WebView" com conteúdo renderizado a partir de HTML e CSS e um botão desenhado em HTML/CSS, e embaixo a camada de plugins (ponte JavaScript ↔ nativo) ligada aos recursos do dispositivo: câmera, GPS, arquivos e notificações](img/fig-1-2.webp)

*Figura 1.2: Um aplicativo com WebView. A casca é nativa (ícone, barra, ciclo de vida), mas a tela é uma página web renderizada pelo motor do sistema. Todo contato com o hardware atravessa a camada de plugins.*

## O trade-off central e a linha do tempo
Duration: 6:00

### 1.3 O trade-off central

*Foco: compreender por que nenhuma abordagem vence em todos os critérios.*

Existe uma relação inversa que atravessa todo o assunto: quanto maior a fatia de código compartilhada entre plataformas, maior a distância em relação às APIs e ao comportamento nativo. As abordagens modernas se distinguem justamente pelo quanto conseguem atenuar essa relação; nenhuma consegue eliminá-la.

![Eixo com Web, Híbrido, Multiplataforma e Nativo: uma seta para a esquerda indica maior reuso de código entre plataformas e outra para a direita indica maior proximidade das APIs, do desempenho e da aparência nativos](img/fig-1-3.webp)

*Figura 1.3: O trade-off central. As abordagens ordenam-se em um mesmo eixo: ganhar reuso de código significa, na mesma medida, afastar-se do comportamento nativo. Web: uma base de código para tudo; Híbrido: base web dentro de um WebView; Multiplataforma: base única com UI nativa ou motor próprio; Nativo: uma base por plataforma.*

### 1.4 Linha do tempo

*Foco: situar cada tecnologia no problema histórico que ela veio resolver.*

| Período | Marco | Consequência para o desenvolvedor |
| --- | --- | --- |
| 1995–2004 | Web estática e CGI | Páginas geradas no servidor; interatividade mínima. |
| 2005–2008 | AJAX e Web 2.0 | O navegador vira plataforma de aplicação; nasce o conceito de SPA. |
| 2008–2010 | App Store e Google Play | O modelo "aplicativo instalado" domina o mobile; surge a fragmentação Android/iOS. |
| 2009–2013 | PhoneGap / Cordova | Primeira resposta em massa à fragmentação: empacotar a web num contêiner. |
| 2015–2017 | React Native, PWA | Reaproveitamento de código sem WebView; a web ganha capacidades de app. |
| 2018–2021 | Flutter | Motores gráficos próprios e UI declarativa unificada amadurecem. |
| 2022–hoje | Compose Multiplatform, Tauri, WebAssembly | Compartilhamento seletivo de camadas; binários menores; web com desempenho quase nativo. |

*Tabela 1.1: Linha do tempo resumida das estratégias de desenvolvimento multi-alvo.*

<aside class="positive">

**Ideia-chave.** Não existe abordagem "melhor" em abstrato. Existe a abordagem mais adequada a um conjunto específico de restrições: orçamento, prazo, perfil da equipe, exigências de desempenho, necessidade de acesso a hardware e estratégia de distribuição.

</aside>

## Fundamentos comuns a todas as abordagens
Duration: 10:00

### O que esta parte aborda

* **2.1 Camadas de uma aplicação**: apresentação, estado, domínio e dados, e quais delas são reaproveitáveis.
* **2.2 Vocabulário essencial**: SDK, API nativa, renderização, ponte, AOT/JIT, hot reload, WebView.
* **2.3 Critérios de avaliação**: os oito eixos usados para comparar as abordagens no comparativo consolidado.

### 2.1 Camadas de uma aplicação moderna

*Foco: saber em que camada cada tecnologia atua, para evitar comparações injustas.*

Praticamente toda aplicação, independentemente da plataforma, pode ser lida em quatro camadas. Entender onde cada tecnologia atua evita comparações sem sentido: por exemplo, comparar React com Flutter é legítimo; comparar React com Node.js, não.

![Quatro camadas empilhadas: Apresentação (UI), Estado e Lógica de Apresentação, Domínio/Regras de Negócio e Dados e Infraestrutura; as duas de cima marcadas como mais sensíveis à plataforma e as duas de baixo com alta chance de reaproveitamento](img/fig-2-1.webp)

*Figura 2.1: As quatro camadas típicas. Quanto mais baixa a camada, maior a chance de ser compartilhada entre plataformas.*

* **Camada de Apresentação (UI)**: telas, componentes, animações, navegação, acessibilidade.
* **Camada de Estado e Lógica de Apresentação**: gerência de estado, validação de formulários, formatação.
* **Camada de Domínio / Regras de Negócio**: casos de uso, cálculos, políticas; idealmente independente de plataforma.
* **Camada de Dados e Infraestrutura**: HTTP/REST/GraphQL, banco local, cache, autenticação, sensores.

### 2.2 Vocabulário essencial

*Foco: fixar os sete termos que reaparecem em todos os capítulos.*

> **SDK (Software Development Kit)**
>
> Conjunto oficial de bibliotecas, compiladores, emuladores e ferramentas fornecido pelo dono da plataforma (Android SDK, iOS SDK).

> **API nativa**
>
> Interface de programação oferecida pelo sistema operacional para acessar câmera, GPS, Bluetooth, notificações, biometria, sistema de arquivos etc.

> **Renderização**
>
> Processo de transformar a descrição da interface em pixels na tela. Pode ser feita por widgets nativos, pelo motor do navegador ou por um motor gráfico próprio.

> **Ponte (bridge) / FFI**
>
> Mecanismo que permite a um código não-nativo chamar funções nativas. É frequentemente o gargalo de desempenho em abordagens híbridas e multiplataforma.

> **AOT e JIT**
>
> *Ahead-of-Time*: compilação para código de máquina antes da execução (melhor desempenho em produção). *Just-in-Time*: compilação durante a execução (permite hot reload em desenvolvimento).

> **Hot reload**
>
> Recarregamento do código em execução sem reiniciar a aplicação nem perder o estado: um ganho expressivo de produtividade.

> **WebView**
>
> Componente nativo que embute um motor de navegador dentro de um aplicativo (WKWebView no iOS, `android.webkit.WebView` no Android).

### 2.3 Critérios de avaliação

*Foco: definir os eixos de comparação antes de olhar para os nomes das tecnologias.*

1. **Desempenho**: tempo de inicialização, fluidez de animações, consumo de memória e bateria.
2. **Acesso a recursos nativos**: profundidade e imediatismo do acesso a APIs do sistema.
3. **Fidelidade de UX**: quão "natural" a aplicação parece na plataforma.
4. **Velocidade de desenvolvimento**: do zero ao primeiro release.
5. **Custo de manutenção**: esforço para manter várias plataformas em paridade.
6. **Disponibilidade de talentos**: facilidade de contratar e treinar.
7. **Maturidade do ecossistema**: bibliotecas, documentação, suporte comercial.
8. **Modelo de distribuição**: lojas, revisão, atualizações over-the-air.

<aside class="negative">

**Atenção.** Cuidado com benchmarks de marketing. Diferenças de desempenho entre frameworks modernos costumam ser irrelevantes diante de decisões de arquitetura ruins: listas sem reciclagem de itens, imagens não redimensionadas, requisições em série na thread principal e ausência de cache derrubam qualquer tecnologia, por mais "nativa" que seja.

</aside>

## Desenvolvimento Web
Duration: 12:00

### O que esta parte aborda

* **3.1 Modelo de execução**: a aplicação roda no navegador; o servidor entrega código e dados.
* **3.2 Padrões de renderização**: SSR, CSR, SSG, ISR e streaming: onde o HTML é gerado.
* **3.3 Tecnologias**: fundamentos da web, frameworks de interface e opções de back-end.
* **3.4 Progressive Web Apps**: como a web ganha instalação, funcionamento offline e notificações.
* **3.5 Vantagens e limitações**: alcance universal contra acesso restrito ao hardware.

### 3.1 Definição e modelo de execução

*Foco: o navegador como máquina virtual universal.*

No desenvolvimento web, a aplicação é hospedada em um servidor e executada pelo navegador do usuário. O artefato entregue não é um binário instalável, mas um conjunto de documentos HTML, folhas de estilo CSS e módulos JavaScript, transferidos sob demanda via HTTP. O navegador atua como uma **máquina virtual universal**: ele isola a aplicação em uma sandbox, gerencia memória, renderiza a interface e media todo acesso a recursos do dispositivo por meio de APIs padronizadas e sujeitas a permissão explícita.

![Arquitetura cliente-servidor: o cliente (navegador) com HTML/DOM e CSSOM, motor JavaScript, framework de interface e Web APIs; o servidor com CDN/Edge, aplicação, API REST/GraphQL e banco de dados; entre eles, HTTPS trafegando HTML, CSS, JS e JSON](img/fig-3-1.webp)

*Figura 3.1: Arquitetura cliente-servidor de uma aplicação web moderna. O navegador não apenas exibe conteúdo: ele executa a camada de apresentação inteira e conversa com o servidor apenas por dados.*

### 3.2 Padrões arquiteturais de renderização

*Foco: decidir onde o HTML é gerado, e o impacto disso em SEO, velocidade e custo.*

| Padrão | Como funciona | Indicado para |
| --- | --- | --- |
| SSR | O servidor monta o HTML a cada requisição e envia pronto; o JavaScript "hidrata" a página depois. | Conteúdo dinâmico e personalizado com forte exigência de SEO. |
| CSR (SPA) | O servidor envia um HTML mínimo; o JavaScript constrói toda a interface no navegador. | Painéis administrativos, ferramentas internas, apps atrás de login. |
| SSG | As páginas são geradas em tempo de build e servidas como arquivos estáticos. | Blogs, documentação, sites institucionais, landing pages. |
| ISR | SSG com revalidação periódica de páginas individuais. | Catálogos grandes que mudam com frequência moderada. |
| Streaming SSR | O HTML é enviado em pedaços conforme fica pronto, com Server Components. | Aplicações grandes que precisam de resposta percebida imediata. |

*Tabela 3.1: Estratégias de renderização web e seus cenários típicos. Frameworks modernos permitem misturar várias delas na mesma aplicação, rota a rota.*

### 3.3 Principais tecnologias e frameworks

*Foco: separar o que é fundamento da linguagem, o que é interface e o que é servidor.*

**Fundamentos**

* **HTML5**: estrutura semântica, formulários nativos, elementos de mídia e acessibilidade.
* **CSS3**: Flexbox, Grid, custom properties, container queries e animações.
* **JavaScript (ECMAScript)**: a linguagem universal da web: módulos ESM, async/await, iteradores e programação assíncrona.
* **TypeScript**: superconjunto tipado do JavaScript; hoje é o padrão de fato em projetos de médio e grande porte.
* **WebAssembly (Wasm)**: formato binário que permite executar código compilado de C/C++/Rust/Go no navegador com desempenho próximo ao nativo. Usado em editores de imagem, CAD, jogos e criptografia.

**Frameworks de interface (front-end)**

* **React**: biblioteca baseada em componentes e Virtual DOM, mantida pela Meta. Maior ecossistema do mercado; introduziu Hooks e, mais recentemente, Server Components.
* **Angular**: framework completo e opinativo da Google, em TypeScript, com injeção de dependências, RxJS e CLI robusta. Forte presença em ambientes corporativos.
* **Vue.js**: curva de aprendizado suave, sintaxe de template declarativa e Composition API. Muito adotado em equipes pequenas e médias.
* **Svelte**: compilador que elimina o runtime: o código é transformado em JavaScript imperativo mínimo em tempo de build, gerando bundles muito enxutos.

**Back-end e APIs**

* **Node.js** com Express, Fastify ou NestJS; runtimes alternativos Deno e Bun.
* **Python**: Django (completo, com ORM e admin) e FastAPI (assíncrono, tipado, ideal para APIs).
* **Java**: Spring Boot e Quarkus; **C#**: ASP.NET Core.
* **PHP**: Laravel e Symfony; **Ruby**: Ruby on Rails; **Go**: Gin, Echo; **Rust**: Axum, Actix.
* **GraphQL** e **tRPC** como alternativas ao REST tradicional.

### 3.4 Progressive Web Apps (PWA)

*Foco: as três peças que transformam um site em algo instalável e utilizável offline.*

PWAs são aplicações web que adotam um conjunto de tecnologias para se comportar como aplicativos instalados: funcionam offline, podem ser adicionadas à tela inicial, recebem notificações push e executam tarefas em segundo plano. Três elementos sustentam esse comportamento: o **Service Worker**, que intercepta as requisições de rede; o **armazenamento local** (Cache API e IndexedDB); e o **manifesto**, que descreve nome, ícone e tela inicial.

![Aplicação Web ligada ao Service Worker (proxy programável entre app e rede), que se comunica com Rede/API, Cache API (assets offline), IndexedDB (dados locais) e Push API (notificações); o Manifesto descreve ícone, nome e tela inicial](img/fig-3-2.webp)

*Figura 3.2: Anatomia de um PWA. O Service Worker intercepta as requisições e decide servir do cache ou da rede, viabilizando o funcionamento offline.*

<aside class="negative">

**Limites das PWAs no iOS.** Historicamente, o Safari restringe recursos de PWA em relação ao Android: cotas de armazenamento menores, ausência ou limitação de algumas APIs (Bluetooth Web, NFC, acesso a contatos) e um caminho de instalação menos evidente. Isso deve ser verificado a cada versão do sistema antes de assumir uma PWA como substituta integral de um app instalado.

</aside>

### 3.5 Vantagens e limitações

*Foco: alcance universal e atualização instantânea contra acesso restrito ao hardware.*

| Vantagens | Limitações |
| --- | --- |
| Alcance universal por uma URL, sem instalação. | Acesso limitado e mediado a sensores e hardware. |
| Atualização instantânea, sem revisão de loja. | Desempenho dependente do navegador e do dispositivo. |
| Uma base de código para todos os sistemas. | Funcionamento offline exige trabalho explícito. |
| Ferramental maduro e maior oferta de profissionais. | Diferenças de comportamento entre navegadores. |
| Indexável por buscadores; fácil de compartilhar. | Menor visibilidade comercial (fora das lojas de apps). |
| Custo de distribuição praticamente nulo. | Integrações profundas com o SO são restritas. |

*Tabela 3.2: Balanço do desenvolvimento web.*

<aside class="positive">

**Ideia-chave.** Use web quando o alcance importa mais que a profundidade de integração com o dispositivo, quando as atualizações precisam ser imediatas ou quando o produto é essencialmente conteúdo, formulários e dados.

</aside>

## Desenvolvimento Nativo
Duration: 10:00

### O que esta parte aborda

* **4.1 Modelo de execução**: código compilado que fala diretamente com o sistema operacional.
* **4.2 Pilhas por plataforma**: Android (Kotlin/Compose), Apple (Swift/SwiftUI) e desktop.
* **4.3 Convergência de paradigmas**: por que as UIs nativas ficaram parecidas entre si.
* **4.4 Vantagens e limitações**: desempenho máximo contra custo multiplicado.

### 4.1 Definição e modelo de execução

*Foco: o teto de desempenho e de capacidade, e o preço que se paga por ele.*

Desenvolvimento nativo é a construção de aplicações com a linguagem, o SDK, o compilador e as ferramentas oficiais fornecidos pelo fabricante da plataforma. O resultado é um binário que fala diretamente com o sistema operacional, sem camadas de tradução ou interpretação intermediárias. É, por definição, o teto de desempenho e de capacidade: qualquer recurso novo lançado pelo fabricante está disponível primeiro (e às vezes exclusivamente) aqui.

![Duas colunas: Pilha Android (Kotlin/Java; Jetpack Compose ou XML Views; Jetpack; Android Runtime; Kernel Linux, drivers e hardware) e Pilha iOS (Swift/Objective-C; SwiftUI ou UIKit; Frameworks Apple; Core Services e Core OS; Kernel Darwin/XNU e hardware)](img/fig-4-1.webp)

*Figura 4.1: Pilhas nativas de Android e iOS. Note a simetria conceitual, e a total incompatibilidade prática entre as duas colunas, que é a origem do custo do desenvolvimento nativo.*

### 4.2 Principais tecnologias por plataforma

*Foco: o ecossistema oficial de cada fabricante.*

**Android**

* **Kotlin**: linguagem oficial desde 2019: null-safety, corrotinas para concorrência, extension functions, sintaxe concisa.
* **Java**: ainda amplamente presente em bases legadas e bibliotecas.
* **Jetpack Compose**: kit de UI declarativo, hoje a abordagem recomendada; substitui os layouts XML.
* **Android Jetpack**: Room (persistência), Navigation, WorkManager (tarefas em segundo plano), ViewModel/Lifecycle, DataStore, Paging, Hilt (injeção de dependências).
* **Android Studio** e **Gradle**: IDE e sistema de build oficiais.
* **NDK** com C/C++ para código de altíssimo desempenho (codecs, jogos, processamento de sinal).

**iOS, iPadOS e demais sistemas Apple**

* **Swift**: linguagem moderna, segura em tipos e memória, com structured concurrency.
* **Objective-C**: presente em bases antigas e em partes do próprio sistema.
* **SwiftUI**: UI declarativa unificada para iOS, iPadOS, macOS, watchOS, tvOS e visionOS; UIKit continua indispensável em casos avançados.
* **Frameworks**: SwiftData/Core Data, Combine, Core ML, ARKit, AVFoundation, MapKit, HealthKit.
* **Xcode** e **Swift Package Manager**: ferramental oficial.

**Desktop nativo**

* **Windows**: WinUI 3 / Windows App SDK, WPF, Win32 com C++ ou C#.
* **macOS**: SwiftUI e AppKit com Swift.
* **Linux**: GTK (C, Vala, Python) e Qt (C++).

### 4.3 A convergência dos paradigmas

*Foco: as linguagens continuam incompatíveis, mas o modelo mental virou um só.*

Jetpack Compose e SwiftUI usam linguagens incompatíveis, mas seguem hoje o mesmo paradigma: interfaces **declarativas, reativas e dirigidas por estado**. O desenvolvedor descreve como a tela deve parecer para um dado estado, e o framework se encarrega de atualizá-la quando esse estado muda.

<aside class="positive">

**Por que isso importa.** Um desenvolvedor que domina Compose aprende SwiftUI muito mais rápido do que a diferença de sintaxe sugere, e vice-versa. Esse mesmo modelo mental é o que Flutter e React Native adotam, o que reduz bastante o custo de transitar entre as abordagens.

</aside>

### 4.4 Vantagens e limitações

*Foco: quando o desempenho e a integração com o hardware são requisitos de produto.*

| Vantagens | Limitações |
| --- | --- |
| Máximo desempenho e menor consumo de bateria. | Custo multiplicado por plataforma (código, testes, QA). |
| Acesso imediato a todas as APIs e a recursos recém-lançados. | Necessidade de equipes especializadas distintas. |
| Aderência total às diretrizes de design de cada sistema. | Risco de divergência funcional entre as versões. |
| Melhor suporte a acessibilidade e integrações do SO. | Prazos maiores até o primeiro lançamento. |
| Ferramental de depuração e profiling superior. | Toda alteração precisa ser replicada em cada plataforma. |

*Tabela 4.1: Balanço do desenvolvimento nativo.*

<aside class="positive">

**Ideia-chave.** Nativo é a escolha certa quando desempenho, integração com hardware ou aderência à plataforma são requisitos de produto: jogos, edição de mídia, realidade aumentada, aplicações de saúde e finanças com biometria, ou apps cujo diferencial competitivo é a própria experiência.

</aside>

## Desenvolvimento Híbrido
Duration: 8:00

### O que esta parte aborda

* **5.1 Modelo de execução**: a web empacotada dentro de um contêiner nativo.
* **5.2 Tecnologias**: Cordova, Capacitor, Ionic, Quasar, Electron e Tauri.
* **5.3 Vantagens e limitações**: entrega rápida contra fluidez e consumo de memória.
* **5.4 Confusão terminológica**: por que Flutter e React Native não são híbridos.

### 5.1 Definição e modelo de execução

*Foco: casca nativa, miolo web, ponte de plugins.*

O desenvolvimento híbrido nasceu de uma ideia direta: se a equipe já sabe fazer web, por que não empacotar a aplicação web dentro de um invólucro nativo e distribuí-la pelas lojas? Na prática, o aplicativo instalado é uma **casca nativa** contendo um **WebView** que carrega HTML, CSS e JavaScript a partir do próprio pacote, e não da rede. Uma camada de plugins expõe as APIs do dispositivo ao JavaScript por meio de uma **ponte**.

![Aplicativo instalado contendo um WebView (WKWebView / android.webkit.WebView) com HTML + CSS (interface da aplicação) e JavaScript (Ionic, React, Vue, Angular); abaixo, a ponte JavaScript ↔ Nativo (plugins) ligada a câmera, GPS, notificações e biometria](img/fig-5-1.webp)

*Figura 5.1: Arquitetura híbrida: a interface inteira vive dentro de um WebView; toda interação com o hardware passa obrigatoriamente pela ponte de plugins, o ponto crítico de desempenho e de compatibilidade dessa abordagem.*

### 5.2 Principais tecnologias e frameworks

*Foco: contêineres para mobile e para desktop.*

* **Apache Cordova** (antigo PhoneGap): o pioneiro. Define o modelo de contêiner mais plugins que todos os demais herdaram. Hoje em modo de manutenção.
* **Capacitor**: sucessor moderno do Cordova, criado pela equipe do Ionic. Trata os projetos nativos como código de primeira classe, suporta plugins Cordova e integra-se com qualquer framework web.
* **Ionic Framework**: biblioteca de componentes de UI que imitam Material Design e o visual do iOS, com adaptação automática por plataforma. Funciona sobre Angular, React, Vue ou JavaScript puro.
* **Framework7** e **Quasar**: alternativas com componentes prontos e emulação de UI nativa; Quasar gera web, PWA, mobile e desktop a partir do mesmo código.
* **Electron**: o equivalente para desktop: empacota Chromium e Node.js num aplicativo instalável. Base do VS Code, Slack, Discord e Obsidian.
* **Tauri**: alternativa moderna ao Electron: usa o WebView do sistema operacional em vez de embutir o Chromium, e um núcleo em Rust. Gera binários uma ordem de grandeza menores.

### 5.3 Vantagens e limitações

*Foco: onde a economia compensa e onde a conta não fecha.*

| Vantagens | Limitações |
| --- | --- |
| Reaproveita integralmente equipes e código web existentes. | O WebView é mais lento que a renderização nativa, sobretudo em listas longas e animações. |
| Uma base de código para web, Android, iOS e desktop. | A experiência raramente é indistinguível de um app nativo. |
| Distribuição nas lojas com presença de marca. | Dependência de plugins de terceiros para recursos novos. |
| Atualização parcial do conteúdo web sem nova revisão de loja. | Consumo de memória mais alto, pois o WebView é um navegador inteiro. |
| Custo inicial e prazo de entrega significativamente menores. | As lojas rejeitam apps que sejam apenas um site empacotado sem valor adicional. |

*Tabela 5.1: Balanço do desenvolvimento híbrido.*

### 5.4 Uma confusão terminológica comum

*Foco: híbrido significa WebView, e nada além disso.*

<aside class="negative">

**Atenção.** Muitos textos usam "híbrido" como sinônimo de "qualquer coisa que não seja nativa", colocando React Native e Flutter na mesma categoria do Ionic. Tecnicamente isso é impreciso: híbrido implica renderização dentro de um WebView. React Native usa componentes nativos reais; Flutter desenha com um motor gráfico próprio. Nenhum dos dois usa WebView, e por isso são classificados como **multiplataforma**.

</aside>

<aside class="positive">

**Ideia-chave.** O híbrido é a escolha pragmática para aplicações corporativas internas, catálogos, portais de autoatendimento e MVPs: casos em que a interface é composta de formulários, listas e conteúdo, e a velocidade de entrega vale mais que os últimos 10% de fluidez.

</aside>

## Desenvolvimento Multiplataforma
Duration: 10:00

### O que esta parte aborda

* **6.1 Duas estratégias de renderização**: ponte para widgets nativos versus motor gráfico próprio.
* **6.2 Tecnologias**: Flutter, React Native e Compose Multiplatform.
* **6.3 Comparativo**: linguagem, renderização e perfil de uso ideal de cada uma.
* **6.4 Compartilhamento seletivo**: nem tudo precisa ser compartilhado.

### 6.1 Definição e modelo de execução

*Foco: a mesma meta do híbrido, mas sem WebView, por dois caminhos distintos.*

O desenvolvimento multiplataforma (*cross-platform*) busca o mesmo objetivo do híbrido (uma base de código, várias plataformas), mas descarta o WebView. Existem duas estratégias arquiteturais principais, e entender a diferença entre elas é a chave para escolher a ferramenta certa.

![Duas colunas. Estratégia A, ponte para widgets nativos (React Native): código único em JavaScript/TypeScript, ponte/JSI, widgets nativos reais e sistema operacional, com visual idêntico ao nativo. Estratégia B, motor gráfico próprio (Flutter, Compose Multiplatform): código único em Dart ou Kotlin, framework de widgets próprio, motor de renderização Skia/Impeller e canvas do SO/GPU, idêntico em toda plataforma](img/fig-6-1.webp)

*Figura 6.1: As duas arquiteturas multiplataforma. A escolha entre elas determina se o app vai parecer com a plataforma (A) ou parecer consigo mesmo em toda parte (B).*

* **Estratégia A: ponte para widgets nativos (React Native).** Código único em JavaScript/TypeScript → ponte/JSI (tradução de chamadas) → widgets nativos reais (`UIButton`, `android.widget.Button`) → sistema operacional. Visual idêntico ao nativo, pois é nativo.
* **Estratégia B: motor gráfico próprio (Flutter, Compose Multiplatform).** Código único em Dart ou Kotlin → framework de widgets próprio (árvore de widgets, layout, animação) → motor de renderização (Skia / Impeller, que desenha cada pixel) → canvas do SO e GPU. Idêntico em toda plataforma, mas não herda o visual do sistema.

### 6.2 Principais tecnologias e frameworks

*Foco: três representantes, um de cada filosofia.*

**Flutter.** Criado pela Google, usa a linguagem Dart e desenha toda a interface com motor próprio (Skia, sendo substituído pelo Impeller). Compila AOT para código de máquina em produção e usa JIT em desenvolvimento, o que viabiliza hot reload quase instantâneo. Oferece dois conjuntos completos de widgets (Material e Cupertino) e alcança mobile, web, Windows, macOS, Linux e sistemas embarcados a partir do mesmo código. Gerência de estado: Provider, Riverpod, BLoC, GetX.

**React Native.** Mantido pela Meta, permite escrever com React e JavaScript/TypeScript enquanto renderiza componentes nativos reais. A New Architecture (JSI, Fabric, TurboModules) eliminou a ponte assíncrona serializada que era o gargalo histórico. **Expo** é hoje o caminho recomendado: cuida de build, atualizações over-the-air, roteamento (Expo Router) e centenas de módulos nativos prontos.

**Compose Multiplatform.** Extensão do Jetpack Compose, da JetBrains, que leva a mesma UI declarativa em Kotlin para iOS, desktop e web, renderizando com motor próprio baseado em Skia. É a opção natural para equipes que já constroem interfaces Android com Compose e querem estender esse investimento a outras plataformas.

### 6.3 Comparativo entre os principais frameworks

*Foco: escolher entre eles é escolher uma estratégia de renderização.*

| Framework | Linguagem | Renderização | Perfil de uso ideal |
| --- | --- | --- | --- |
| Flutter | Dart | Motor próprio (Skia / Impeller) | Produtos com identidade visual forte e uniforme; animações elaboradas; alcance amplo de plataformas. |
| React Native | TypeScript / JavaScript | Componentes nativos | Equipes já fluentes em React; apps que devem parecer nativos; forte reuso com a web. |
| Compose Multiplatform | Kotlin | Motor próprio (Skia) | Times que já usam Jetpack Compose no Android e querem estender a iOS e desktop. |

*Tabela 6.1: Panorama dos principais frameworks multiplataforma.*

### 6.4 Compartilhamento seletivo

*Foco: compartilhar o núcleo e manter a interface nativa é uma alternativa válida.*

<aside class="positive">

**Dica prática.** Não é preciso escolher entre "tudo compartilhado" e "nada compartilhado". Uma arquitetura muito produtiva na prática é compartilhar o núcleo (modelos, regras, cliente HTTP, cache e sincronização) e escrever a interface nativamente em cada plataforma. Essa estratégia costuma capturar a maior parte do ganho de reuso sem abrir mão da experiência nativa.

</aside>

<aside class="positive">

**Ideia-chave.** Multiplataforma é o ponto de equilíbrio adotado pela maioria dos produtos comerciais atuais: entrega desempenho próximo ao nativo com uma fração do custo de manter bases separadas. A dúvida deixou de ser "multiplataforma ou não" e passou a ser "qual estratégia de renderização e quanto compartilhar".

</aside>

## Comparativo consolidado
Duration: 8:00

### O que esta parte aborda

* **7.1 Tabela por critérios**: as quatro abordagens lado a lado nos oito eixos dos fundamentos.
* **7.2 Leitura gráfica**: o formato dos trade-offs em um gráfico de barras.
* **7.3 Fluxograma de decisão**: um roteiro de perguntas para chegar a uma recomendação.
* **7.4 Estudos de caso**: quatro cenários reais e a justificativa de cada escolha.

### 7.1 Visão geral por critérios

*Foco: comparar as quatro abordagens em uma única leitura.*

| Critério | Web | Híbrido | Multiplataforma | Nativo |
| --- | --- | --- | --- | --- |
| Desempenho | Médio | Médio-baixo | Alto | Máximo |
| Acesso a hardware | Limitado | Via plugins | Amplo | Total |
| Fidelidade de UX | Web | Aproximada | Alta | Perfeita |
| Reuso de código | 100% | 90–100% | 70–95% | 0–20% |
| Tempo até o 1º release | Muito curto | Curto | Médio | Longo |
| Custo de manutenção | Baixo | Baixo | Médio | Alto |
| Funciona offline | Requer PWA | Sim | Sim | Sim |
| Distribuição | URL | Lojas | Lojas | Lojas |
| Atualização | Instantânea | Parcial OTA | Parcial OTA | Revisão de loja |
| Tamanho do aplicativo | — | Médio | Médio | Pequeno |
| Oferta de talentos | Muito alta | Alta | Alta | Média |

*Tabela 7.1: Comparativo consolidado das quatro abordagens segundo os critérios definidos nos fundamentos.*

### 7.2 Leitura gráfica dos trade-offs

*Foco: visualizar que nenhuma abordagem lidera em todos os eixos.*

![Gráfico de barras com pontuação relativa de 0 a 10 para Web, Híbrido, Multiplataforma e Nativo nos eixos desempenho, acesso nativo, fidelidade UX, reuso de código, velocidade e custo baixo: Nativo lidera em desempenho, acesso e fidelidade; Web lidera em reuso, velocidade e custo baixo](img/fig-7-1.webp)

*Figura 7.1: Comparação visual das quatro abordagens. Os valores são estimativas didáticas de ordem de grandeza, não medições: servem para evidenciar o formato dos trade-offs, não para ranquear tecnologias.*

### 7.3 Fluxograma de decisão

*Foco: transformar os critérios em uma sequência de perguntas objetivas.*

![Fluxograma a partir de "Novo projeto" com as perguntas: precisa de desempenho extremo, AR/3D ou hardware especializado (sim: Nativo); a distribuição em lojas é essencial (não: Web/PWA); a UI precisa parecer nativa e ter animações fluidas (não: Híbrido, Ionic + Capacitor); a equipe já domina React/TypeScript (sim: React Native + Expo); a equipe já constrói interfaces com Jetpack Compose (sim: Compose Multiplatform; não: Flutter)](img/fig-7-2.webp)

*Figura 7.2: Fluxograma de apoio à decisão. Trata-se de um guia heurístico: restrições reais de orçamento, prazo e contratação frequentemente sobrepõem-se ao resultado técnico ideal.*

## Estudos de caso
Duration: 6:00

*Foco: aplicar os critérios a quatro situações concretas.*

### Caso 1: banco digital com biometria e leitura de documentos

* **Requisitos:** segurança forte, biometria, leitura de documentos com a câmera, integração com carteiras do sistema, tempo de inicialização mínimo.
* **Decisão:** nativo (Kotlin e Swift).
* **Justificativa:** recursos de segurança e integrações do sistema evoluem rapidamente e são liberados primeiro nos SDKs oficiais; a auditoria de segurança é mais simples sem camadas intermediárias.

### Caso 2: aplicativo interno de inventário para 400 funcionários

* **Requisitos:** leitura de código de barras, formulários, sincronização offline, distribuição interna, prazo de 3 meses.
* **Decisão:** híbrido (Ionic com Capacitor) ou PWA.
* **Justificativa:** a interface é dominada por listas e formulários; a equipe já é de desenvolvedores web; o custo de manter duas bases nativas não se justifica para uso interno.

### Caso 3: marketplace de consumo com forte identidade visual

* **Requisitos:** milhões de usuários, animações e transições sofisticadas, iteração rápida de produto, paridade absoluta entre Android e iOS.
* **Decisão:** Flutter ou React Native.
* **Justificativa:** o equilíbrio entre desempenho e custo é o melhor possível; a paridade visual entre plataformas é garantida por construção (Flutter) ou obtida com esforço moderado (React Native).

### Caso 4: ferramenta de produtividade para desktop

* **Requisitos:** Windows, macOS e Linux; edição de texto e arquivos locais; ciclo de atualização semanal.
* **Decisão:** Electron (se o ecossistema de bibliotecas web for decisivo) ou Tauri (se tamanho do binário e consumo de memória forem críticos).
* **Justificativa:** ambos reaproveitam a stack web; Tauri usa o WebView do sistema e produz binários muito menores, ao custo de mais variação de comportamento entre sistemas.

## Tendências e considerações finais
Duration: 6:00

### O que esta parte aborda

* **8.1 Para onde o campo está indo**: Wasm, UI declarativa, server-driven UI e novos alvos.
* **8.2 Recomendações práticas**: sete princípios para conduzir a decisão de arquitetura.

### 8.1 Para onde o campo está indo

*Foco: as forças que estão redesenhando a matriz de decisão.*

* **WebAssembly como camada universal**: permite reaproveitar código em Rust, C++ ou Go entre web, mobile e servidor, apagando parte da fronteira entre "web" e "nativo".
* **UI declarativa como padrão único**: SwiftUI, Jetpack Compose, Flutter, React e Vue convergiram para o mesmo modelo mental (estado → interface), o que reduz o custo de transição entre plataformas.
* **Compartilhamento seletivo**: em vez de "tudo ou nada", cresce a prática de compartilhar domínio e dados mantendo a interface nativa.
* **Server-driven UI**: a interface é descrita pelo servidor e interpretada pelo cliente nativo, permitindo mudar telas sem publicar nova versão. Muito usado por grandes aplicativos de consumo.
* **Ferramental unificado**: Expo, Firebase, Supabase, Sentry e sistemas de CI/CD reduzem a diferença operacional entre as abordagens.
* **Novos alvos**: realidade mista, sistemas embarcados automotivos e wearables passam a fazer parte da matriz de decisão.

### 8.2 Sete recomendações práticas

*Foco: princípios que sobrevivem à troca de tecnologia.*

1. **Comece pelos requisitos, não pela tecnologia.** Liste exigências de hardware, desempenho e distribuição antes de discutir nomes de frameworks.
2. **Considere a equipe que você tem.** Um time excelente em React entrega mais com React Native do que um time inexperiente com Flutter, ainda que Flutter "ganhe" no papel.
3. **Isole a lógica de negócio.** Mantenha regras, modelos e integrações independentes da camada de interface: isso preserva a liberdade de mudar de abordagem no futuro.
4. **Prototipe o caso mais difícil primeiro.** Se há um requisito arriscado (Bluetooth, vídeo, offline complexo), valide-o em uma prova de conceito antes de decidir.
5. **Meça em dispositivos reais e antigos.** Emuladores em máquinas modernas escondem os problemas que os usuários efetivamente enfrentam.
6. **Não confunda multiplataforma com solução única.** É legítimo usar web para o painel administrativo, multiplataforma para o app de consumo e nativo para um módulo crítico.
7. **Planeje a manutenção.** Frameworks mudam; avalie o histórico de breaking changes, a cadência de releases e o suporte a versões novas de Android e iOS.

<aside class="positive">

**Encerramento.** As quatro abordagens não formam uma escala de qualidade, mas um espaço de decisão com eixos conflitantes. O desenvolvedor maduro não é o que defende uma tecnologia, e sim o que consegue explicar, em termos de requisitos, custo e risco, por que escolheu uma delas em um contexto específico, e sob quais condições mudaria de ideia.

</aside>

## Referência rápida e glossário
Duration: 5:00

### Referência rápida de tecnologias

| Abordagem | Linguagens | Principais tecnologias e frameworks |
| --- | --- | --- |
| Web (front-end) | HTML, CSS, JavaScript, TypeScript | React, Angular, Vue, Svelte; Vite, Webpack; Tailwind, Sass; WebAssembly |
| Web (back-end) | JS/TS, Python, Java, C#, PHP, Ruby, Go, Rust | Node.js (Express, Fastify, NestJS), Deno, Bun; Django, FastAPI; Spring Boot, Quarkus; ASP.NET Core; Laravel, Symfony; Rails; Gin, Echo; Axum, Actix; GraphQL, tRPC |
| Nativo Android | Kotlin, Java, C/C++ | Jetpack Compose, XML Views, Room, Navigation, WorkManager, Hilt, DataStore, Android Studio, Gradle, NDK |
| Nativo Apple | Swift, Objective-C | SwiftUI, UIKit, SwiftData, Core Data, Combine, Core ML, ARKit, AVFoundation, MapKit, HealthKit, Xcode |
| Nativo desktop | C#, C++, Swift, Vala | WinUI 3, WPF, Win32, AppKit, GTK, Qt |
| Híbrido | HTML, CSS, JavaScript | Apache Cordova, Capacitor, Ionic Framework, Framework7, Quasar, Electron, Tauri |
| Multiplataforma | Dart, TypeScript, Kotlin | Flutter, React Native com Expo, Compose Multiplatform |

*Tabela A.1: Referência rápida: abordagem, linguagens e ecossistema.*

### Glossário

| Termo | Significado |
| --- | --- |
| AOT / JIT | Compilação antecipada (antes da execução) versus compilação em tempo de execução. |
| Bridge (ponte) | Camada de comunicação entre código não-nativo e APIs nativas. |
| CSR / SSR / SSG / ISR | Renderização no cliente / no servidor / em tempo de build / incremental. |
| Expo | Plataforma e conjunto de ferramentas que simplifica o desenvolvimento com React Native. |
| FFI | Foreign Function Interface: chamada de funções escritas em outra linguagem. |
| Hot reload | Atualização do código em execução sem perder o estado da aplicação. |
| Impeller / Skia | Motores de renderização gráfica usados pelo Flutter. |
| JSI | JavaScript Interface: mecanismo síncrono da nova arquitetura do React Native. |
| OTA | Over-the-air: atualização entregue diretamente ao app, sem passar pela loja. |
| PWA | Progressive Web App: aplicação web instalável, com suporte offline e notificações. |
| Sandbox | Ambiente isolado que restringe o que a aplicação pode acessar. |
| Server-driven UI | Interface descrita pelo servidor e interpretada pelo cliente em tempo de execução. |
| SDK | Conjunto oficial de ferramentas de desenvolvimento de uma plataforma. |
| WebAssembly (Wasm) | Formato binário executável no navegador com desempenho próximo ao nativo. |
| WebView | Componente nativo que embute um motor de navegador dentro de um aplicativo. |

## Exercícios
Duration: 30:00

### Questões conceituais

*Foco: verificar o domínio das definições e das arquiteturas.*

1. Explique o que é um WebView e por que ele é a peça que define o desenvolvimento híbrido.
2. Descreva a diferença técnica entre uma aplicação híbrida e uma aplicação multiplataforma. Por que é incorreto chamar o Flutter de "híbrido"?
3. Qual o papel do Service Worker em uma PWA? Cite dois recursos que ele viabiliza.
4. O que significa dizer que o Flutter usa AOT em produção e JIT em desenvolvimento? Qual benefício prático cada modo traz?
5. Compare as duas estratégias de renderização multiplataforma (widgets nativos versus motor gráfico próprio), citando uma vantagem e uma desvantagem de cada.
6. Explique por que a camada de domínio é a mais fácil de compartilhar entre plataformas, com base na Figura 2.1.
7. Qual a diferença entre SSR, CSR e SSG? Dê um exemplo de aplicação adequada a cada um.
8. Por que o Tauri gera binários muito menores que o Electron? Qual o custo dessa escolha?

### Análise de cenários

*Foco: aplicar o fluxograma de decisão a situações abertas.*

Para cada cenário, indique a abordagem recomendada e justifique com pelo menos três argumentos técnicos.

* **A.** Uma startup de saúde precisa lançar em 10 semanas um app que sincroniza dados de relógios inteligentes, lê frequência cardíaca em tempo real e exibe gráficos. Equipe: dois desenvolvedores, ambos com experiência em TypeScript.
* **B.** Uma rede de supermercados quer um app de fidelidade com carteira de cupons, notificações por proximidade e leitura de QR Code, para Android e iOS, com orçamento limitado.
* **C.** Uma universidade precisa disponibilizar o sistema acadêmico (matrícula, notas, histórico) para alunos e professores, com acesso por celular e computador, e atualizações frequentes durante o período de matrícula.
* **D.** Um estúdio quer desenvolver um jogo casual 2D com física simples para mobile e, futuramente, para consoles.
* **E.** Uma indústria precisa de um painel de supervisão em tempo real rodando em terminais Linux embarcados dentro da fábrica, com atualização de dados a cada 100 ms.
