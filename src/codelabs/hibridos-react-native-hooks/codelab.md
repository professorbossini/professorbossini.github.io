summary: Construa passo a passo um Timer de Foco com React Native e Expo e entenda de verdade os Hooks useState e useEffect, incluindo o bug clássico do setInterval, dependências, limpeza e SafeAreaView.
id: hibridos-react-native-hooks
categories: React Native,React,Mobile
tags: react native,expo,hooks,usestate,useeffect,setinterval,safeareaview,pomodoro
status: Published
authors: Rodrigo Bossini
last updated: 2026-08-22
pdf: desenvolvimento_de_aplicativos_hibridos/02_apostila_dev_aplicativos_hibridos_react_native_hooks_useEffect_useState.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React Hooks na prática: useState e useEffect com React Native e Expo

## Visão geral
Duration: 3:00

Neste codelab você constrói, passo a passo, um pequeno aplicativo de **Timer de Foco** para entender de verdade como o estado nasce, muda e se propaga pela interface.

![Tela escura do aplicativo com o título "Timer de Foco", o tempo 25:00 em destaque e os botões Iniciar e Reiniciar](img/fig-02.webp)

*A "cara" do aplicativo que vamos construir: um mostrador grande com o tempo restante e dois botões de controle.*

### O que você vai aprender

* Por que um aplicativo React Native não é uma página web dentro do celular
* A estrutura interna do React Native: código JavaScript, a ponte e os componentes nativos
* O papel do Expo e como criar o projeto
* O que é estado e como o `useState` guarda esse estado entre as renderizações
* O que são efeitos colaterais e como o `useEffect` roda, repete e faz a limpeza
* Como evitar o bug clássico do `setInterval`
* Como usar o `SafeAreaView` do pacote `react-native-safe-area-context`

### O que você vai precisar

* Node.js instalado
* Um celular com o aplicativo **Expo Go** (ou um emulador)
* Um editor de código, como o VS Code

## Como o React Native funciona
Duration: 8:00

### O que esta parte aborda

* Por que um aplicativo React Native não é uma página web dentro do celular.
* A estrutura interna: código JavaScript, a ponte e os componentes nativos.
* O papel do Expo e o comando que cria o nosso projeto.

### React Native não é "site dentro de um app"

*Foco: entender que a interface é composta por componentes nativos reais, não por HTML.*

Uma dúvida muito comum de quem começa é imaginar que o React Native apenas abre um navegador escondido e mostra uma página web. Não é isso que acontece. Aplicativos que fazem isso usam uma **WebView**, um navegador embutido que renderiza HTML e CSS. O React Native segue um caminho diferente: o seu código descreve a interface com componentes como `<View>` e `<Text>`, e o framework traduz cada um deles para o componente nativo equivalente de cada sistema operacional.

Na prática, um `<View>` vira um `UIView` no iOS e um `android.view.View` no Android; um `<Text>` vira um `UILabel` ou um `TextView`. Quem desenha os pixels na tela é o próprio sistema operacional, exatamente como faria um aplicativo escrito na linguagem nativa. Por isso a rolagem, os gestos e as animações têm o "peso" e a fluidez que o usuário espera de um app de verdade.

Para entender como o seu JavaScript consegue comandar esses componentes nativos, precisamos olhar a arquitetura interna do framework.

![Camadas empilhadas: seu código (componentes React em JSX e Hooks), motor JavaScript (Hermes ou JavaScriptCore), ponte JavaScript (Bridge/JSI) e camada nativa com componentes nativos reais (UIView e android.view.View); abaixo, a nota "Sem WebView: a tela é montada com views nativas, não com HTML"](img/fig-01.webp)

*Figura 1. Estrutura interna de um app React Native. O seu código roda em um motor JavaScript e conversa com a camada nativa por meio da ponte; quem desenha a interface são componentes nativos do próprio sistema.*

Vale destacar cada nível da Figura 1:

* **Seu código** é React puro: componentes que retornam JSX e usam Hooks. É aqui que você passará a maior parte do tempo.
* **Motor JavaScript** é o programa que executa esse código, em uma thread exclusiva de JavaScript. Nas versões modernas do React Native o motor padrão é o **Hermes**, otimizado para inicialização rápida em celulares.
* **Ponte** é o canal de comunicação. Historicamente ela funcionava de forma assíncrona, trocando mensagens serializadas entre os dois lados. As versões recentes substituem esse mecanismo pela **JSI** (JavaScript Interface), que permite ao JavaScript chamar código nativo de maneira mais direta e rápida. A ideia essencial permanece: há um mundo JavaScript e um mundo nativo, e algo os conecta.
* **Camada nativa** é onde vivem os componentes que aparecem na tela, na thread de interface do sistema. É por isso que o resultado é indistinguível de um app nativo.

<aside class="positive">

**Por que isso importa para os Hooks.** Guarde esta imagem: quando, mais adiante, chamarmos `setSegundos(...)` no lado JavaScript, essa mudança de estado vai atravessar a ponte e fazer o sistema operacional atualizar um componente nativo real na tela. Os Hooks vivem no mundo JavaScript, mas o efeito deles é visível no mundo nativo.

</aside>

## Criando o projeto com o Expo
Duration: 6:00

*Foco: usar o Expo para criar e rodar o projeto sem configurar Android Studio ou Xcode.*

Escrever a parte nativa "na mão" exige instalar e configurar ferramentas pesadas (Android Studio, Xcode, SDKs). O **Expo** é um conjunto de ferramentas construído sobre o React Native que remove quase toda essa configuração inicial: com um comando você cria o projeto, e com o aplicativo **Expo Go** no seu celular você vê o app rodando na hora, sem cabo e sem compilar nada localmente.

Para nós, o Expo tem uma vantagem didática: permite ir direto ao que interessa (escrever componentes e Hooks) em vez de gastar a primeira aula lutando com instalação. Vamos criar o projeto do nosso Timer de Foco:

**Terminal**

```bash
# cria um novo projeto Expo em branco chamado "timer-foco"
npx create-expo-app@latest timer-foco --template blank

# entra na pasta do projeto
cd timer-foco

# inicia o servidor de desenvolvimento (mostra um QR Code)
npx expo start
```

Depois de rodar `npx expo start`, um QR Code aparece no terminal. Basta abri-lo com o app Expo Go (Android) ou com a câmera (iOS) para ver o aplicativo no seu próprio celular. Toda vez que você salvar o arquivo, a tela recarrega sozinha: esse recurso se chama **Fast Refresh** e será nosso melhor amigo durante a codificação ao vivo.

<aside class="positive">

**Trabalhando ao vivo.** Deixe o `npx expo start` rodando e o celular à vista durante toda a aula. Cada trecho de código que adicionarmos a seguir pode ser digitado, salvo e visto imediatamente. Aprender Hooks é, acima de tudo, ver o estado mudar na tela.

</aside>

## O Timer de Foco e a primeira tela
Duration: 8:00

### O que esta parte aborda

* Conhecer o aplicativo que vamos construir: um Timer de Foco.
* Escrever a primeira versão da tela, e descobrir por que ela "não faz nada".
* Entender o que é estado e como o `useState` guarda esse estado entre as renderizações.

### A aplicação: um Timer de Foco

*Foco: ter em mente o objetivo visual antes de programar.*

Nosso aplicativo é um cronômetro de estudo inspirado na técnica **Pomodoro**: ele mostra um tempo em contagem regressiva (começando em 25 minutos) e tem botões para iniciar/pausar e reiniciar. É um tema simples, mas perfeito para os dois Hooks que queremos ensinar: o tempo restante é um dado que muda (isso é **estado**, terreno do `useState`) e a contagem automática a cada segundo é uma ação que acontece "por fora" do fluxo normal de renderização (isso é um **efeito colateral**, terreno do `useEffect`). A tela final é a que aparece na Visão geral (Figura 2).

### Primeira versão: uma tela estática

*Foco: escrever a interface antes de dar "vida" a ela.*

Todo projeto Expo em branco já vem com um arquivo `App.js`. Vamos substituí-lo por uma tela que apenas mostra o tempo, sem nenhuma lógica ainda. Repare que usamos `<View>` (um contêiner, equivalente a uma "caixa" nativa) e `<Text>` (para exibir texto):

**App.js**

```jsx
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.tempo}>25:00</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempo: { fontSize: 72, color: '#ffffff', fontWeight: 'bold' },
});
```

Alguns pontos técnicos desse primeiro trecho:

* `App` é um **componente**: uma função que retorna a descrição da interface (o JSX). O React chama essa função para "desenhar" o componente: é o que chamamos de **renderizar**.
* `StyleSheet.create` organiza os estilos. Diferente da web, aqui não há CSS: os estilos são objetos JavaScript, e `flex: 1` faz o contêiner ocupar a tela inteira.
* O texto `25:00` está **fixo no código**. E é exatamente aí que mora o problema da próxima seção.

### O problema: nada muda

*Foco: perceber por que precisamos de estado.*

Se rodarmos o app agora, veremos `25:00` para sempre. Poderíamos pensar em "trocar" o texto com uma variável comum:

**tentativa ingênua (não funciona)**

```javascript
let segundos = 1500; // 25 minutos em segundos
// ... em algum lugar ...
segundos = segundos - 1; // muda a variável, mas a tela NÃO se atualiza
```

Isso não resolve. Uma variável comum até muda de valor na memória, mas o React não fica sabendo que precisa desenhar a tela de novo. O componente só é renderizado outra vez quando o React é avisado de que algo mudou. Esse "aviso" é justamente o papel do estado.

## O Hook useState
Duration: 10:00

> **O que é estado?**
>
> Estado é todo dado que pode mudar ao longo do tempo e que, ao mudar, deve provocar uma nova renderização da interface. No nosso app, o tempo restante e o fato de o timer estar rodando ou não são estados. A regra de ouro do React é: **a interface é uma função do estado**. Mude o estado da maneira correta, e a tela se redesenha sozinha para refleti-lo.

![Ciclo com quatro caixas: Estado (ex.: segundos = 1500) leva a "React renderiza" (desenha a UI a partir do estado), que leva a "Acontece algo" (toque / passou 1 segundo), que leva a "setEstado(...)" (agenda nova renderização), que volta ao Estado](img/fig-03.webp)

*Figura 3. O ciclo do estado. Enquanto ninguém chama a função que atualiza o estado, a interface permanece congelada; ao chamá-la, o React refaz a renderização.*

### Entra o useState

*Foco: declarar um estado e atualizá-lo pela função correta.*

O `useState` é o Hook que cria uma "caixinha" de estado dentro do componente. Ele devolve duas coisas em um par: o valor atual e uma função para mudar esse valor. A Figura 4 disseca a linha que vamos escrever.

![A linha que declara o estado segundos com useState(1500), com cada parte colorida e explicada: segundos é o valor atual do estado, setSegundos é a função que atualiza o estado e agenda uma nova renderização, useState(1500) é o valor inicial](img/fig-04.webp)

*Figura 4. Anatomia do useState. Ele entrega um par [valor, função]: você lê o valor para exibir e chama a função para mudá-lo.*

| Parte | Significado |
| --- | --- |
| `segundos` | valor atual do estado (lido a cada renderização) |
| `setSegundos` | função que atualiza o estado e agenda uma nova renderização |
| `useState(1500)` | valor inicial, usado somente na primeira renderização |

Vamos aplicar isso ao `App.js`. As novidades em relação à versão estática são o import do `useState` e do `Pressable`, o estado, os cálculos de minutos e segundos, o `Pressable` e os novos estilos:

**App.js**

```jsx
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [segundos, setSegundos] = useState(25 * 60);

  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;

  return (
    <View style={styles.container}>
      <Text style={styles.tempo}>
        {String(minutos).padStart(2, '0')}:{String(segs).padStart(2, '0')}
      </Text>
      <Pressable style={styles.botao} onPress={() => setSegundos(segundos - 1)}>
        <Text style={styles.textoBotao}>-1 segundo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempo: { fontSize: 72, color: '#ffffff', fontWeight: 'bold', marginBottom: 40 },
  botao: {
    backgroundColor: '#087ea4',
    paddingVertical: 14, paddingHorizontal: 48,
    borderRadius: 10,
  },
  textoBotao: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
});
```

O que cada novidade faz:

* `import { useState }`: trazemos o Hook do pacote `react`.
* `const [segundos, setSegundos] = useState(25 * 60)`: criamos o estado com valor inicial de 1500 segundos. A partir daqui, `segundos` sempre contém o valor mais recente a cada renderização.
* `minutos` e `segs`: são apenas cálculos **derivados** do estado. Não são estado: podem ser recalculados a qualquer momento a partir de `segundos`.
* O `<Pressable>` é um componente que responde ao toque. No `onPress`, chamamos `setSegundos(segundos - 1)`: essa é a **única forma correta** de mudar o estado. Ela avisa o React, que então renderiza o componente de novo com o novo valor.
* Como um componente visual novo entrou em cena, já definimos os estilos `botao` e `textoBotao` no `StyleSheet`, no mesmo passo; o `tempo` também ganhou uma `marginBottom` para separá-lo do botão. Componente e aparência nascem juntos.

Agora, cada toque no botão diminui um segundo e a tela reflete a mudança **na hora**. Compare com a variável comum da seção anterior: a diferença não está no "menos um", e sim em **quem** muda o valor. Ao usar `setSegundos`, entramos no ciclo da Figura 3.

<aside class="negative">

**Nunca mude o estado "na mão".** Escrever `segundos = segundos - 1` não funciona e ainda pode causar bugs difíceis. O valor lido em `segundos` deve ser tratado como **somente leitura** dentro do render; para alterá-lo, use sempre a função `setSegundos`. Só ela agenda uma nova renderização.

</aside>

<aside class="positive">

**Atualização baseada no valor anterior.** Quando o novo valor depende do valor atual, prefira a forma com função: `setSegundos((s) => s - 1)`. Assim o React garante que você está partindo do estado mais recente, mesmo que várias atualizações aconteçam em sequência, um cuidado que fará diferença no capítulo do `useEffect`.

</aside>

## Efeitos colaterais e o ciclo de vida do useEffect
Duration: 8:00

### O que esta parte aborda

* Descobrir por que a contagem automática precisa de um Hook diferente.
* Entender o ciclo de vida do `useEffect`: quando ele roda e quando faz a limpeza.
* Cometer (de propósito!) um bug clássico com `setInterval` e depois corrigi-lo.
* Finalizar o app com `SafeAreaView` e os botões de verdade.

### Por que o useState não basta

*Foco: separar "mudar um dado" de "interagir com o mundo fora do React".*

Até aqui, o tempo só muda quando o usuário toca no botão. Mas queremos que ele diminua **sozinho, a cada segundo**. Para isso precisamos de um temporizador do JavaScript, o `setInterval`, que executa uma função repetidamente em intervalos de tempo.

O problema é que ligar um temporizador não é "renderizar". É uma ação que acontece por fora da simples transformação "estado → tela". Coisas assim (temporizadores, requisições de rede, acesso a sensores, assinaturas de eventos) são chamadas de **efeitos colaterais**. Elas não cabem no corpo da função do componente, porque esse corpo é executado a cada renderização e deve ser "limpo", sem surpresas. O Hook criado exatamente para acomodar efeitos colaterais é o `useEffect`.

> **Efeito colateral, em uma frase**
>
> É qualquer coisa que o componente faz além de calcular e devolver a interface: falar com o mundo externo (rede, tempo, armazenamento) ou reagir a ele. O `useEffect` é o lugar certo para isso.

### O ciclo de vida do useEffect

*Foco: saber quando o efeito roda, quando roda de novo e quando é limpo.*

O `useEffect` recebe duas partes: uma **função com o efeito** e um **array de dependências**. O React executa o efeito **depois** de renderizar (quando a tela já foi pintada) e decide se deve rodá-lo de novo comparando as dependências. A função pode ainda retornar outra função, a **limpeza** (*cleanup*), que o React chama antes de rodar o efeito de novo e quando o componente sai da tela.

![Linha do tempo: Montagem (1º render), Efeito roda (liga o intervalo), dependência mudou, Limpeza (desliga o intervalo), Efeito roda de novo, desmontagem, Limpeza final (na saída da tela)](img/fig-05.webp)

*Figura 5. Ciclo de vida do useEffect. O efeito roda após o render; se uma dependência muda, o React primeiro executa a limpeza e depois roda o efeito outra vez. Ao sair da tela, roda a limpeza final.*

A tabela mental para o array de dependências é curta e vale memorizar:

* **Sem array** → o efeito roda depois de **toda** renderização.
* **Array vazio `[]`** → o efeito roda **uma única vez**, na montagem.
* **Array `[a, b]`** → roda na montagem e **sempre que `a` ou `b` mudarem**.

## Um bug de propósito e a correção
Duration: 12:00

### Primeira tentativa, e um bug de propósito

*Foco: ver o que acontece quando esquecemos a limpeza e as dependências.*

Vamos ligar o temporizador do jeito mais direto (e errado). Adicione o `useEffect`:

**App.js (versão com bug)**

```jsx
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [segundos, setSegundos] = useState(25 * 60);

  useEffect(() => {
    setInterval(() => {
      setSegundos((s) => s - 1);
    }, 1000);
  }); // sem array de dependências e sem limpeza

  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;
  // ... (o mesmo return de antes)
}
```

À primeira vista parece funcionar: o número começa a cair. Mas logo ele despenca cada vez mais rápido. Por quê? Como não passamos array de dependências, o efeito roda **depois de cada renderização**. Cada segundo que passa muda o estado, o que provoca uma nova renderização, que dispara o efeito de novo, criando **mais um** `setInterval`. Em poucos segundos há dezenas de temporizadores ativos ao mesmo tempo, todos descontando segundos. E, como nunca chamamos `clearInterval`, nenhum deles é desligado.

<aside class="negative">

**O bug clássico do setInterval.** Dois descuidos se somam aqui: (1) faltou o **array de dependências**, então o efeito se repete a cada render; (2) faltou a **limpeza**, então os temporizadores antigos nunca são desligados e se acumulam. É o erro mais comum de quem está aprendendo `useEffect`, e por isso vale vê-lo acontecer.

</aside>

### Corrigindo: dependências e limpeza

*Foco: controlar quando o efeito liga e garantir que ele desliga.*

A correção tem duas ideias. Primeiro, o efeito só deve ligar o temporizador **quando o timer estiver rodando**; então criamos um estado `rodando` e o colocamos no array de dependências. Segundo, o efeito deve **retornar uma função de limpeza** que chama `clearInterval`, para que o temporizador antigo seja desligado antes de qualquer novo ser criado.

**App.js (versão corrigida)**

```jsx
export default function App() {
  const [segundos, setSegundos] = useState(25 * 60);
  const [rodando, setRodando] = useState(false);

  useEffect(() => {
    if (!rodando) return; // só liga se estiver rodando

    const id = setInterval(() => {
      setSegundos((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(id); // limpeza: desliga o intervalo
  }, [rodando]); // depende de "rodando"

  // ... restante do componente
}
```

Acompanhando pelo ciclo de vida da Figura 5:

* Quando `rodando` passa de `false` para `true`, o efeito roda, cria um intervalo e guarda o seu `id`.
* Enquanto `rodando` não muda, o efeito **não** roda de novo, mesmo que `segundos` mude a cada tique. Isso acontece porque `segundos` não está nas dependências, e porque usamos a forma `setSegundos((s) => ...)`, que sempre parte do valor mais recente sem precisar "ver" `segundos` de fora.
* Quando `rodando` volta a `false` (ou o app sai da tela), o React executa a limpeza `clearInterval(id)` e o temporizador é desligado. Nunca há dois intervalos vivos ao mesmo tempo.

<aside class="positive">

**Por que `setSegundos((s) => s - 1)` e não `setSegundos(segundos - 1)`?** Dentro do intervalo, a variável `segundos` ficaria "presa" no valor que tinha quando o efeito rodou (um *closure* antigo). A forma com função pede ao React o valor mais recente na hora de atualizar, evitando esse valor desatualizado. É por isso que ela é a escolha certa em temporizadores.

</aside>

## Versão final: botões de verdade e SafeAreaView
Duration: 12:00

*Foco: montar a interface completa e respeitar as áreas seguras da tela.*

Falta ligar os botões e cuidar de um detalhe visual importante em celulares: os cantos com notch, câmera e barras do sistema. Para o conteúdo não ficar escondido atrás deles, envolvemos tudo em um `SafeAreaView`.

Esse componente vem do pacote `react-native-safe-area-context`, que não acompanha o template blank do Expo. Precisamos instalá-lo antes de importar, sempre com `npx expo install`, que escolhe a versão certa para a versão do Expo em uso (usar `npm install` pode trazer uma versão incompatível):

**Terminal**

```bash
# instala a biblioteca de áreas seguras (versão compatível com o Expo)
npx expo install react-native-safe-area-context
```

> **O que é o SafeAreaView?**
>
> É um contêiner que respeita as **áreas seguras** do aparelho: as regiões livres de notch, câmera frontal, barra de status e barra de gestos. Colocando a interface dentro dele, o conteúdo nunca fica sobreposto por esses elementos do sistema, em qualquer modelo de celular. Ele funciona como um `<View>` comum, mas com margens automáticas nessas bordas.

<aside class="negative">

**Atenção ao import.** O `SafeAreaView` que vinha do próprio `react-native` está descontinuado (*deprecated*). Hoje usamos a versão do pacote `react-native-safe-area-context` (instalado no passo anterior), que funciona de forma consistente em todos os aparelhos:

`import { SafeAreaView } from 'react-native-safe-area-context';`

</aside>

Eis o `App.js` completo. Além do `SafeAreaView`, importamos também o `SafeAreaProvider` do mesmo pacote e o colocamos na raiz da árvore: é ele que mede as áreas seguras do aparelho e as fornece ao `SafeAreaView`. Sem esse provedor, o `SafeAreaView` funciona como um `<View>` qualquer e as margens de segurança não são aplicadas. O que mudou em relação à versão corrigida: os imports do pacote, o `SafeAreaProvider` e o `SafeAreaView` envolvendo a tela, e os dois botões de verdade.

**App.js (versão final)**

```jsx
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

export default function App() {
  const [segundos, setSegundos] = useState(25 * 60);
  const [rodando, setRodando] = useState(false);

  useEffect(() => {
    if (!rodando) return;
    const id = setInterval(() => {
      setSegundos((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [rodando]);

  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.tempo}>
          {String(minutos).padStart(2, '0')}:{String(segs).padStart(2, '0')}
        </Text>

        <Pressable style={styles.botao} onPress={() => setRodando((r) => !r)}>
          <Text style={styles.textoBotao}>{rodando ? 'Pausar' : 'Iniciar'}</Text>
        </Pressable>

        <Pressable
          style={styles.botaoSecundario}
          onPress={() => { setRodando(false); setSegundos(25 * 60); }}
        >
          <Text style={styles.textoBotao}>Reiniciar</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
```

Como surgiu um novo botão (o de reiniciar), fechamos o fluxo adicionando o estilo dele no `StyleSheet`. O botão principal também ganha uma margem embaixo para separá-lo do de baixo. Os demais estilos continuam como já estavam:

**App.js (acréscimo no StyleSheet)**

```jsx
const styles = StyleSheet.create({
  // container, tempo e textoBotao continuam iguais
  botao: {
    // ...as mesmas regras de antes...
    marginBottom: 14, // separa do botão de reiniciar
  },
  botaoSecundario: {
    backgroundColor: '#334155',
    paddingVertical: 14, paddingHorizontal: 48,
    borderRadius: 10,
  },
});
```

Analisando os botões da versão final:

* **Iniciar/Pausar**: um único botão que alterna `rodando` com `setRodando((r) => !r)`. Quando `rodando` muda, o `useEffect` liga ou desliga o intervalo, exatamente o comportamento que projetamos. O texto do botão também muda porque ele é calculado a partir do estado.
* **Reiniciar**: faz duas atualizações de estado: para o timer (`setRodando(false)`) e volta o tempo para 1500 segundos (`setSegundos(25 * 60)`). Como `rodando` vira `false`, a limpeza do efeito desliga qualquer intervalo ativo.

## Juntando as peças
Duration: 5:00

*Foco: ver os dois Hooks cooperando.*

O aplicativo final é pequeno, mas mostra a divisão de trabalho entre os dois Hooks com clareza:

* O **`useState`** guarda o que a tela deve mostrar: o tempo restante e se o timer está rodando. Toda mudança passa pelas funções `setSegundos` e `setRodando`, que agendam novas renderizações.
* O **`useEffect`** cuida do efeito colateral de contar o tempo: liga o `setInterval` quando `rodando` é verdadeiro e o desliga na limpeza, sem nunca deixar temporizadores acumulados.

Se você acompanhou digitando cada trecho, viu o estado "ganhar vida" na tela, provocou o bug dos temporizadores de propósito e o corrigiu com dependências e limpeza. Esse é o cerne de `useState` e `useEffect`, e a base sobre a qual praticamente todo aplicativo React Native é construído.

### Para praticar e estender

Alguns desafios naturais a partir daqui:

* mostrar um aviso quando o tempo chegar a zero;
* adicionar um botão **+5 min**;
* alternar entre foco e descanso;
* salvar quantos ciclos foram concluídos.

Cada um deles é resolvido combinando os mesmos dois Hooks que você já domina.
