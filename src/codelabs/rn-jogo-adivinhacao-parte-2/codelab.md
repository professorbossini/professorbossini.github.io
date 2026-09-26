summary: Termine o jogo de adivinhação com React Native: validação da entrada, estado com useState, teclado, alertas, a tela do jogo com palpites do computador (useRef e useEffect) e a tela de fim de jogo.
id: rn-jogo-adivinhacao-parte-2
categories: React Native,Mobile
tags: react native,expo,usestate,useref,useeffect,alert,keyboard,renderizacao condicional,props
status: Published
authors: Rodrigo Bossini
last updated: 2021-02-22
pdf: react_native/old/06_react_native_aplicacao_apostila.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React Native: jogo de adivinhação (parte 2)

## Visão geral
Duration: 3:00

Neste material prosseguimos com o desenvolvimento da aplicação do jogo de adivinhação iniciada no codelab `rn-jogo-adivinhacao-parte-1`. Para relembrar, veja a sua tela inicial na Figura 1.1. Lembre-se que já desenvolvemos essa tela. As regras do jogo, porém, ainda não foram desenvolvidas.

![Tela do jogo com o cabeçalho azul "Adivinhe o número", o texto "Comece um jogo" e um cartão com o campo de número e os botões Reiniciar e Confirmar](img/tela-inicial.webp)

*Figura 1.1: A tela inicial desenvolvida na parte 1.*

### O que você vai aprender

* Usar a extensão RocketSeat React Native para gerar componentes com atalhos
* Validar a entrada com expressões regulares e guardar o texto no estado
* Esconder o teclado com `TouchableWithoutFeedback` e `Keyboard.dismiss`
* Exibir alertas com `Alert.alert`
* Gerar palpites aleatórios e manter valores entre renderizações com `useRef`
* Verificar o fim do jogo com `useEffect` e suas dependências
* Escolher a tela a ser exibida a partir do estado do componente principal

### O que você vai precisar

* O projeto da parte 1 funcionando
* VS Code
* Um celular com o Expo Go ou um emulador

## A extensão RocketSeat
Duration: 5:00

Observe como escrevemos código repetido a cada vez que um novo componente precisa ser criado. Desenvolver a memória muscular é interessante, mas chega um momento em que estamos interessados em produtividade. Por essa razão, vamos instalar uma extensão no Visual Studio Code. Ela fornece atalhos para os templates mais comumente utilizados na criação de aplicações React.

No VS Code, clique em **Extensions**, como mostra a Figura 2.1.1.

![Barra lateral do VS Code com o ícone Extensions destacado em vermelho](img/fig-2-1-1.webp)

*Figura 2.1.1: O ícone de extensões do VS Code.*

A seguir, busque por **RocketSeat**. Como na Figura 2.1.2, escolha **RocketSeat React Native** e clique em **Install**.

![Marketplace de extensões do VS Code com a busca "rocketseat", o item Rocketseat React Native destacado e o botão Install destacado na página da extensão](img/fig-2-1-2.webp)

*Figura 2.1.2: Instalando a extensão Rocketseat React Native.*

Se clicar em **Snippets** na página do plugin, você verá os atalhos oferecidos por ele:

| Gatilho | Conteúdo |
| --- | --- |
| `rnc` | Cria um Componente **Stateful** |
| `rnrc` | Cria um Componente **Stateful** conectado ao **Redux** |
| `rnsc` | Cria um Componente **Stateless** |
| `rnrsc` | Cria um Componente **Stateless** conectado ao **Redux** |
| `rnfc` | Cria um Componente **Functional** |
| `styled-rn` | Cria um arquivo de Estilização com **Styled Components** |
| `api` | Cria um arquivo de configuração do Axios |
| `mapstatetoprops` | Cria o método `mapStateToProps` vazio |
| `mapdispatchtoprops` | Cria o método `mapDispatchToProps` vazio |
| `create-store-rn` | Cria o arquivo de configuração do Redux, combinando os Ducks com os Sagas |
| `root-reducer` | Cria o arquivo que combina os Reducers |
| `root-saga` | Cria o arquivo que centraliza os Sagas |
| `duck` | Cria um Duck |
| `rsduck` | Cria um Duck com **Reduxsauce** |
| `reactotron-rn` | Cria arquivo de configuração do **Reactotron** |
| `reactotron-redux-rn` | Cria arquivo de configuração do **Reactotron** com **Redux + Redux Saga** |

*Figura 2.1.3: Os snippets da extensão.*

De momento, o atalho que usaremos é o `rnfc`, para criar componentes funcionais, aqueles que já vínhamos criando manualmente.

## Validação da entrada e o teclado
Duration: 12:00

### Validações

Note que, embora o teclado seja numérico, ainda é possível digitar os símbolos vírgula e ponto. Desejamos que somente números sejam digitados, por isso vamos remover esses símbolos do conteúdo digitado pelo usuário a cada vez que ele digitar algo no campo.

Antes de mais nada, vamos adicionar uma variável ao estado do componente, que será responsável por armazenar aquilo que ele digita. Veja a Listagem 2.2.1. Lembre-se que o componente que faz a entrada de dados se chama `Entrada` e ele foi usado no arquivo `TelaComecoDoJogo.js`.

**telas/TelaComecoDoJogo.js · Listagem 2.2.1**

```jsx
import React, {useState} from 'react';

const TelaComecoDoJogo = (props) => {
  const [texto, setTexto] = useState ('');
```

A seguir, vamos criar uma função que recebe o valor digitado pelo usuário e substitui cada caractere que não for um número pela cadeia vazia. A função `replace` é própria do JavaScript. Note que ela opera sobre uma string gerando uma outra, sem alterar o conteúdo da original. Ela permite o uso de **expressões regulares**, um modelo matemático comum na programação usado para descrever linguagens. Seu poder é limitado, porém suficiente para descrever, por exemplo, a linguagem constituída por todos os símbolos que não sejam um número. Saiba que expressões regulares são usadas na construção de compiladores, com aplicação na análise léxica, por exemplo.

Para que a função `replace` entenda que o valor entregue a ela é uma expressão regular e não uma string comum, colocamos o conteúdo entre barras. A seguir, entre colchetes, especificamos o símbolo (ou intervalo de símbolos) desejado. O símbolo `^` representa o complemento do conjunto sobre o qual ele é aplicado. A letra `g` indica que a substituição deve ser feita globalmente, no texto completo. Veja a Listagem 2.2.2.

**telas/TelaComecoDoJogo.js · Listagem 2.2.2**

```jsx
const capturaTexto = (textoDigitado) => {
  textoDigitado = textoDigitado.replace (/[^0-9]/g, '');
  setTexto(textoDigitado);
};
```

A função precisa ser vinculada ao componente de entrada de dados e o valor digitado, uma vez validado, precisa ser entregue de volta a ele. Isso é feito usando as propriedades `onChangeText` e `value`, respectivamente. Lembre-se que o componente `Entrada` não possui essas propriedades, porém, ele as recebe e repassa para o `TextInput` que ele encapsula. Veja a Listagem 2.2.3. Ainda estamos no arquivo `TelaComecoDoJogo.js`.

**telas/TelaComecoDoJogo.js · Listagem 2.2.3**

```jsx
<Entrada
  style={estilos.entrada}
  autoCapitalize='none'
  blurOnSubmit
  autoCorrect={false}
  keyboardType="number-pad"
  maxLenth={2}
  onChangeText={capturaTexto}
  value={texto}/>
```

<aside class="positive">

Como visto no fim da parte 1, para o estilo ser aplicado pelo `Entrada` ele precisa chegar em `estilos=`, e o limite de caracteres do `TextInput` se chama `maxLength`.

</aside>

### Lidando com o teclado

Pode ser de interesse permitir que o teclado desapareça quando o usuário tocar em alguma parte da tela que não for a parte em que ele digita seus números. Para fazer isso, o primeiro passo é tornar a tela inteira "tocável". Já aprendemos a fazer isso, com os componentes do tipo *Touchable*. Neste caso, queremos um componente sem feedback visual, portanto usaremos o `TouchableWithoutFeedback`.

Comece criando um componente desse tipo e fazendo com que ele englobe a tela inteira, no arquivo `TelaComecoDoJogo.js`. Veja a Listagem 2.3.1.

**telas/TelaComecoDoJogo.js · Listagem 2.3.1**

```jsx
import { Text, View, StyleSheet, TextInput, Button, TouchableWithoutFeedback } from 'react-native';

return (
  <TouchableWithoutFeedback>
    <View style={estilos.tela}>
      .
      .
      .
    </View>
  </TouchableWithoutFeedback>
```

Agora podemos fazer com que o teclado desapareça quando a tela for tocada. Para isso, usaremos a classe `Keyboard`. Ela possui um método chamado `dismiss` que, como o nome sugere, faz o teclado desaparecer. Veja a Listagem 2.3.2.

**telas/TelaComecoDoJogo.js · Listagem 2.3.2**

```jsx
import { Text, View, StyleSheet, TextInput, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';

<TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
```

## Os botões Reiniciar e Confirmar
Duration: 10:00

### Reiniciando o jogo

Os botões da tela principal ainda não têm funcionalidade. Vamos começar especificando o que deve acontecer quando o botão **Reiniciar** for tocado. O que desejamos é muito simples: desejamos apagar todo o conteúdo que eventualmente existir no campo de entrada.

Começamos criando uma função, como na Listagem 2.4.1. Note que basta atribuir a cadeia vazia à string que faz parte do estado do componente.

**telas/TelaComecoDoJogo.js · Listagem 2.4.1**

```jsx
const reiniciaTexto = ( ) => {
  setTexto('');
}
```

A seguir, vinculamos a função criada ao evento `onPress` do botão reiniciar. Veja a Listagem 2.4.2.

**telas/TelaComecoDoJogo.js · Listagem 2.4.2**

```jsx
<View style={estilos.botao}>
  <Button
    title="Reiniciar"
    color={Cores.accent}
    onPress={reiniciaTexto}
  />
</View>
```

### Lidando com o botão Confirmar

A aplicação terá uma variável booleana que indica se o usuário realmente quer iniciar o jogo. Ela começa valendo `false`. Quando o usuário clicar em **Confirmar**, começaremos invertendo seu valor.

Começamos definindo a variável como parte do estado do componente, como na Listagem 2.5.1.

**telas/TelaComecoDoJogo.js · Listagem 2.5.1**

```jsx
const [usuarioConfirmou, setUsuarioConfirmou] = useState (false);
```

A seguir, criamos uma função que, quando chamada, altera o valor dessa nova variável. Além disso, quando o usuário clicar em Reiniciar, desejamos voltar a variável para `false`, já que ele iniciará outro jogo. Veja a Listagem 2.5.2.

**telas/TelaComecoDoJogo.js · Listagem 2.5.2**

```jsx
const reiniciaTexto = () => {
  setTexto('');
  setUsuarioConfirmou(false);
}

const confirmaJogada = () => {
  setUsuarioConfirmou(true);
}
```

Depois de o usuário confirmar seu número escolhido, iremos armazená-lo em outra variável, após converter o texto digitado para número. A seguir, o texto inicial volta a ser a cadeia vazia. A definição da nova variável aparece na Listagem 2.5.3.

**telas/TelaComecoDoJogo.js · Listagem 2.5.3**

```jsx
const [numeroDigitado, setNumeroDigitado] = useState ();
```

O texto digitado pelo usuário é convertido para número e guardado na nova variável na função `confirmaJogada`. Ela também se encarrega de limpar o campo em que o usuário digitou o valor. Veja a Listagem 2.5.4.

**telas/TelaComecoDoJogo.js · Listagem 2.5.4**

```jsx
const confirmaJogada = () => {
  setUsuarioConfirmou(true);
  setNumeroDigitado (parseInt(texto));
  setTexto('');
}
```

A função deve ser vinculada ao evento `onPress` do botão **Confirmar**, como na Listagem 2.5.5.

**telas/TelaComecoDoJogo.js · Listagem 2.5.5**

```jsx
<View style={estilos.botao}>
  <Button
    title="Confirmar"
    color={Cores.accent}
    onPress={confirmaJogada}
  />
</View>
```

Vamos exibir o número digitado pelo usuário em um componente visual logo abaixo do cartão. Inicialmente, de uma maneira um tanto rústica que, a seguir, será refinada. A ideia é simples. Iremos declarar uma variável que terá o valor `undefined` a princípio mas que armazenará uma expressão JSX simples com o número digitado caso a variável booleana que definimos (ela representa o fato de o usuário ter confirmado a entrada, lembra?) contenha o valor `true`. Veja a Listagem 2.5.6.

**telas/TelaComecoDoJogo.js · Listagem 2.5.6**

```jsx
//no corpo da função principal
//fora de qualquer outra função
let numeroEscolhidoText;
if (usuarioConfirmou)
  numeroEscolhidoText = <Text>Número escolhido: {numeroDigitado}</Text>
```

E o componente pode ser exibido logo abaixo do cartão, como qualquer outra expressão JSX. Veja a Listagem 2.5.7.

**telas/TelaComecoDoJogo.js · Listagem 2.5.7**

```jsx
        </View>
      </Cartao>
      {numeroEscolhidoText}
    </View>
  </TouchableWithoutFeedback>
```

## Alerta e o número escolhido em destaque
Duration: 12:00

### Exibindo um alerta

Pode ser o caso de o usuário clicar no botão **Confirmar** sem ter digitado algo. Pode ser que ele tenha digitado zero também. Queremos garantir que ele tenha digitado algo e que esse valor seja maior do que zero. Caso essas condições não sejam satisfeitas, vamos mostrar um alerta ao usuário informando-o disso. Veja a Listagem 2.6.1.

**telas/TelaComecoDoJogo.js · Listagem 2.6.1**

```jsx
import { Text, View, StyleSheet,
  TextInput, Button, TouchableWithoutFeedback,
  Keyboard, Alert } from 'react-native';

const confirmaJogada = () => {
  const n = parseInt (texto);
  if (isNaN(n) || n <= 0){
    Alert.alert(
      'Número inválido', //título
      'Digite um valor entre 1 e 99', //mensagem
      [
        //coleção de botões, cada botão é um JSON
        //só temos um nesse caso
        {
          text: 'Ok',
          style: 'default',
          onPress: reiniciaTexto
        }
      ]
    );
    return;
  }
  setUsuarioConfirmou(true);
  setNumeroDigitado (n);
  setTexto('');
}
```

### Exibindo o número digitado em um cartão

Pode ser interessante exibir o número que o usuário digitou em um cartão. Sim, aquele mesmo que criamos como um componente reutilizável.

Como por padrão o componente não define margens (pois isso depende do contexto em que ele é usado), vamos definir um objeto de estilos para aplicar sobre ele. A seguir, utilizamos um cartão englobando o componente de texto que exibe o número digitado. Veja a Listagem 2.7.1.

**telas/TelaComecoDoJogo.js · Listagem 2.7.1**

```jsx
//no objeto de estilos
numeroSelecionadoCartao: {
  marginTop : 20
}

if (usuarioConfirmou){
  numeroEscolhidoText =
    <Cartao estilos={estilos.numeroSelecionadoCartao}>
      <Text>Número escolhido: {numeroDigitado}</Text>
    </Cartao>
}
```

Vamos destacar o número digitado pelo usuário, adicionando estilos a ele. Para isso, criaremos um novo componente. Clique com o direito na pasta `components` e crie um arquivo chamado `NumeroEscolhido.js`.

A seguir, se desejar, use o atalho `rnfc` para criar o conteúdo inicial que define o componente. Faça os ajustes necessários para que o resultado final seja igual ao que exibe a Listagem 2.7.2.

**components/NumeroEscolhido.js · Listagem 2.7.2**

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NumeroEscolhido = (props) => {
  return (
    <View />
  );
}

const estilos = StyleSheet.create({
});

export default NumeroEscolhido;
```

O novo componente deverá exibir o número, que será recebido via props, por meio da propriedade `children`. Veja a Listagem 2.7.3.

**components/NumeroEscolhido.js · Listagem 2.7.3**

```jsx
const NumeroEscolhido = (props) => {
  return (
    <View>
      <Text>{props.children}</Text>
    </View>
  );
}
```

A seguir, definiremos a aparência da "caixa" que engloba o número. Além disso, também definiremos a aparência do texto propriamente dito. Veja algumas sugestões na Listagem 2.7.4.

**components/NumeroEscolhido.js · Listagem 2.7.4**

```jsx
import cores from '../cores/cores';

const estilos = StyleSheet.create({
  caixaNumeroEscolhido: {
    borderBottomColor: cores.accent,
    borderBottomWidth: 2,
    marginVertical: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  numeroEscolhido: {
    color: cores.accent,
    fontSize: 22
  }
});

return (
  <View style={estilos.caixaNumeroEscolhido}>
    <Text style={estilos.numeroEscolhido}>{props.children}</Text>
  </View>
);
```

Agora já podemos utilizar o novo componente. Volte ao arquivo `TelaComecoDoJogo.js` e faça os ajustes exibidos na Listagem 2.7.5.

**telas/TelaComecoDoJogo.js · Listagem 2.7.5**

```jsx
import NumeroEscolhido from '../components/NumeroEscolhido';

if (usuarioConfirmou){
  numeroEscolhidoText =
    <Cartao estilos={estilos.numeroSelecionadoCartao}>
      <Text>Número escolhido:</Text>
      <NumeroEscolhido>
        {numeroDigitado}
      </NumeroEscolhido>
    </Cartao>
}
```

A seguir, vamos adicionar um botão para que o jogo possa começar. Além disso, pode ser uma boa ideia fazer com que o teclado desapareça uma vez que o usuário confirme o número escolhido. Veja a Listagem 2.7.6.

**telas/TelaComecoDoJogo.js · Listagem 2.7.6**

```jsx
const confirmaJogada = () => {
  .
  .
  .
  setTexto('');
  Keyboard.dismiss();
}

if (usuarioConfirmou){
  numeroEscolhidoText =
    <Cartao estilos={estilos.numeroSelecionadoCartao}>
      <Text>Número escolhido:</Text>
      <NumeroEscolhido>
        {numeroDigitado}
      </NumeroEscolhido>
      <Button
        title="Começar"
      />
    </Cartao>
}
```

## A tela do jogo
Duration: 12:00

Quando o usuário clicar no botão **Começar**, ele será levado a outra tela da aplicação, em que o jogo realmente acontecerá.

Comece criando um novo arquivo chamado `TelaJogo.js` na pasta `telas`. O conteúdo inicial é exibido na Listagem 2.8.1. Caso deseje, utilize o atalho `rnfc` da extensão da RocketSeat.

**telas/TelaJogo.js · Listagem 2.8.1**

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TelaJogo = (props) => {
  return (
    <View />
  );
}

const estilos = StyleSheet.create({
});

export default TelaJogo;
```

Caberá ao componente `TelaJogo` gerar valores aleatórios conforme o jogo acontece. Para isso, começaremos escrevendo uma função que gera um valor aleatório em um intervalo especificado, excluindo o valor que o usuário tenha digitado na primeira tela, assim a aplicação não poderá adivinhar o número logo na primeira tentativa. A função que gera o valor aleatório é definida na Listagem 2.8.2. Fique atento aos comentários no código.

**telas/TelaJogo.js · Listagem 2.8.2**

```javascript
//fora da função que define o componente TelaJogo
const geraValor = (min, max, excluir) => {
  //calcula o teto de min
  min = Math.ceil (min);
  //calcula o chão de max
  max = Math.floor(max);
  //número aleatório
  //Math.random() devolve um valor entre 0 e 1
  const gerado = Math.floor(Math.random () * (max - min)) + min;
  //caso o valor gerado seja igual àquele
  //que deve ser excluído, gera outro
  if (gerado === excluir)
    return geraValor (min, max, excluir);
  return gerado;
}
```

A seguir, vamos definir uma variável para armazenar a tentativa atual do computador. Ela faz parte do estado do componente, como mostra a Listagem 2.8.3.

**telas/TelaJogo.js · Listagem 2.8.3**

```jsx
import React, { useState } from 'react';

//quando o componente for utilizado, ele receberá
//o valor digitado pelo usuário via props
const [tentativaAtual, setTentativaAtual] =
  useState (geraValor(1, 100, props.valorDigitado));
```

A representação visual do componente `TelaJogo` é definida por uma expressão JSX. Ela exibirá um texto inicial indicando que o valor a seguir se trata do palpite do computador. A seguir, usamos o componente `NumeroEscolhido` novamente, desta vez para exibir o valor escolhido pelo computador. Veja a Listagem 2.8.4.

**telas/TelaJogo.js · Listagem 2.8.4**

```jsx
import NumeroEscolhido from '../components/NumeroEscolhido';

return (
  <View>
    <Text>Palpite do computador</Text>
    <NumeroEscolhido>
      {tentativaAtual}
    </NumeroEscolhido>
  </View>
);
```

Ainda na definição da tela do componente `TelaJogo`, desejamos adicionar dois botões que poderão ser usados para informar se o valor escolhido é menor ou maior do que o valor digitado na primeira tela. Eles serão exibidos em um componente do tipo `Cartao`. Veja a Listagem 2.8.5.

**telas/TelaJogo.js · Listagem 2.8.5**

```jsx
import Cartao from '../components/Cartao';

return (
  <View>
    <Text>Palpite do computador</Text>
    <NumeroEscolhido>
      {tentativaAtual}
    </NumeroEscolhido>
    <Cartao>
      <Button
        title="É menor"
      />
      <Button
        title="É maior"
      />
    </Cartao>
  </View>
);
```

A seguir, podemos definir os estilos do componente `TelaJogo`. Como de costume, definiremos objetos JSON para agrupar as configurações de interesse para cada componente usado no componente principal. A Listagem 2.8.6 mostra as definições.

**telas/TelaJogo.js · Listagem 2.8.6**

```jsx
const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    padding: 10,
    alignItems: 'center'
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: 300,
    maxWidth: '80%'
  }
});
```

<aside class="positive">

A `TelaJogo` usa `Button` (e, adiante, `Alert`): inclua-os na importação de `'react-native'` do arquivo.

</aside>

## Escolhendo a tela a ser renderizada
Duration: 12:00

Quando a aplicação é iniciada, ela deve exibir a tela definida pelo componente `TelaComecoDoJogo`. Porém, uma vez que o usuário clique no botão "Começar", a tela exibida deve ser outra: aquela definida pelo componente `TelaJogo`. Assim, a renderização de cada um desses componentes é **condicional**: ambos dependem de o usuário ter clicado em Começar. Expressaremos isso da seguinte forma:

* o componente principal (app) armazena em uma variável o componente a ser exibido. Inicialmente, ele é o `TelaComecoDoJogo`.
* o componente principal (app) tem uma variável em seu estado usada pra determinar se o usuário clicou em começar ou não. A princípio, ela é `undefined`.
* para detectar o clique em Começar, o componente principal (app) entrega para o componente `TelaComecoDoJogo` uma função que ele deverá chamar quando o clique acontecer. Claro, essa entrega será feita via props.
* O componente `TelaComecoDoJogo` chama a função que lhe foi entregue, o que faz com que o estado do componente principal (app) mude, deixando de ser `undefined`.
* Quando o estado do componente principal (app) muda, o conteúdo a ser exibido também muda: ele passa a ser aquele definido pelo componente `TelaJogo`.

Vejamos como isso vai acontecer na prática.

Começamos adicionando uma variável ao estado do componente principal (app), como na Listagem 2.9.1. Estamos no arquivo `App.js` agora.

**App.js · Listagem 2.9.1**

```jsx
import React, {useState} from 'react';

const [numeroDigitado, setNumeroDigitado] = useState ();
```

A seguir, definimos uma função capaz de alterar seu estado. Ela será entregue via props ao componente `TelaComecoDoJogo`. Veja a Listagem 2.9.2.

**App.js · Listagem 2.9.2**

```jsx
const jogoComecou = (numeroDigitado) => {
  setNumeroDigitado(numeroDigitado);
};
```

Com o estado definido, podemos decidir qual componente renderizar. Veja que sua expressão JSX será armazenada em uma variável. Qual expressão é armazenada de fato depende do valor de `numeroDigitado`. A Listagem 2.9.3 mostra essa lógica.

**App.js · Listagem 2.9.3**

```jsx
//por padrão exibimos TelaComecoDoJogo
let conteudo = <TelaComecoDoJogo />
//dependendo do estado, alteramos para TelaJogo
if (numeroDigitado){
  conteudo = <TelaJogo/>
}
```

Depois disso, ainda no componente principal, indicamos que a expressão JSX que ele deve exibir é aquela armazenada na variável `conteudo`, como na Listagem 2.9.4.

**App.js · Listagem 2.9.4**

```jsx
return (
  <View style={estilos.tela}>
    <Cabecalho titulo={"Adivinhe o número"}/>
    {conteudo}
  </View>
);
```

Lembre-se que o componente principal precisa entregar a função `jogoComecou` ao componente `TelaComecoDoJogo` para que ele seja capaz de alterar o seu estado. Como exibe a Listagem 2.9.5, isso pode ser feito via props. O nome `onJogoComecou` é qualquer, como sempre.

**App.js · Listagem 2.9.5**

```jsx
//por padrão exibimos TelaComecoDoJogo
let conteudo = <TelaComecoDoJogo onJogoComecou={jogoComecou} />
```

O componente `TelaComecoDoJogo` tem que chamar a função recebida no momento certo, que é quando o usuário clicar no botão começar. Além disso, ela deve passar como parâmetro o número que o usuário escolheu, que pode ser obtido em uma das variáveis que fazem parte de seu estado. Isso é feito na Listagem 2.9.6. Agora já estamos no arquivo `TelaComecoDoJogo.js`.

**telas/TelaComecoDoJogo.js · Listagem 2.9.6**

```jsx
if (usuarioConfirmou){
  numeroEscolhidoText =
    <Cartao estilos={estilos.numeroSelecionadoCartao}>
      <Text>Número escolhido:</Text>
      <NumeroEscolhido>
        {numeroDigitado}
      </NumeroEscolhido>
      <Button
        title="Começar"
        onPress={() => {props.onJogoComecou(numeroDigitado)}}
      />
    </Cartao>
}
```

Lembre-se que o componente `TelaJogo` precisa saber qual o número digitado pelo usuário para gerar um valor aleatório. Como ele está no estado do componente app, fica fácil de entregá-lo via props ao `TelaJogo`. No arquivo `App.js`, faça a alteração da Listagem 2.9.7.

**App.js · Listagem 2.9.7**

```jsx
//dependendo do estado, alteramos para TelaJogo
if (numeroDigitado){
  conteudo = <TelaJogo valorDigitado={numeroDigitado}/>
}
```

## Os botões Menor e Maior
Duration: 10:00

Quando o usuário clica em um desses botões, o jogo deve gerar um novo valor tentando acertar o número. Claro que ele deve respeitar a dica dada, de acordo com o botão clicado.

Começamos criando a função da Listagem 2.10.1. Ela pertence ao componente `TelaJogo`. Note que ela só verifica se a dica dada foi incorreta.

**telas/TelaJogo.js · Listagem 2.10.1**

```jsx
const geraNovoPalpite = (dica) => {
  //verificamos se a dica está errada
  if (dica === 'menor' && tentativaAtual < props.valorDigitado
      || dica ==='maior' && tentativaAtual > props.valorDigitado){
    Alert.alert('Dica inválida!', 'Dica errada...', [{text: "OK", style: 'cancel'}])
    return;
  }
};
```

A chamada à função `geraNovoPalpite` deve ser vinculada à propriedade `onPress` dos dois botões. Ela deve ser chamada com um argumento, que é a dica. Usamos novamente a função `bind` para gerar uma nova função que será chamada com o argumento desejado. Veja a Listagem 2.10.2.

**telas/TelaJogo.js · Listagem 2.10.2**

```jsx
<Cartao estilos={estilos.botoes}>
  <Button
    title="É menor"
    onPress={geraNovoPalpite.bind(this, 'menor')}
  />
  <Button
    title="É maior"
    onPress={geraNovoPalpite.bind(this, 'maior')}
  />
</Cartao>
```

Caso a dica dada seja verdadeira, o computador precisa gerar outro número. Para isso, ele precisa saber quais os valores de máximo e mínimo que tinha e atualizar. Porém, esses valores devem persistir ao longo de renderizações do componente, razão pela qual usaremos o operador (hook do React) `useRef`. Veja a Listagem 2.10.3.

<aside class="positive">

**Nota:** Perceba a semelhança entre `useRef` e `useState`. Ambos são utilizados para preservar dados conforme novas renderizações acontecem. Ocorre que, diferente do que acontece com `useState`, atualizar um valor criado com `useRef` não dispara um novo ciclo de renderização.

</aside>

**telas/TelaJogo.js · Listagem 2.10.3**

```jsx
import React, { useState, useRef } from 'react';

//no corpo da função que define o componente
const minAtual = useRef(1);
const maxAtual = useRef(100);
```

Agora a função `geraNovoPalpite` pode usar esses valores para gerar um novo intervalo, considerando a dica. Veja a Listagem 2.10.4.

**telas/TelaJogo.js · Listagem 2.10.4**

```jsx
const geraNovoPalpite = (dica) => {
  //verificamos se a dica está errada
  if (dica === 'menor' && tentativaAtual < props.valorDigitado
      || dica ==='maior' && tentativaAtual > props.valorDigitado){
    Alert.alert('Dica inválida!', 'Dica errada...', [{text: "OK", style: 'cancel'}])
    return;
  }
  if (dica === 'menor'){
    //o valor máximo não pode ser maior do que a tentativa
    maxAtual.current = tentativaAtual;
  }else{
    minAtual.current = tentativaAtual;
  }
  //não dá o mesmo palpite
  const n = geraValor(minAtual.current, maxAtual.current, tentativaAtual);
  setTentativaAtual(n);
};
```

## Verificando se houve ganho
Duration: 12:00

Quando o computador acertar o número, o jogo deve informar o usuário disso. Para tal, usaremos outro operador, chamado `useEffect`. Ele recebe uma função que garantidamente é chamada após o ciclo de renderização do componente. Ou seja, momento adequado para verificar se houve ganho ou não.

Sua definição aparece na Listagem 2.11.1.

**telas/TelaJogo.js · Listagem 2.11.1**

```jsx
import React, { useState, useRef, useEffect } from 'react';

//no corpo da função que define o componente
useEffect(() => {

});
```

O usuário será levado para uma tela de fim de jogo quando o computador acertar. Para isso, vamos criar um novo componente, chamado `TelaFimDeJogo`. Crie um novo arquivo na pasta `telas`, chamado `TelaFimDeJogo.js`. Seu conteúdo inicial é dado na Listagem 2.11.2.

**telas/TelaFimDeJogo.js · Listagem 2.11.2**

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TelaFimDeJogo = (props) => {

};

const estilos = StyleSheet.create({
});

export default TelaFimDeJogo;
```

Inicialmente, o componente terá uma única `View` que mostra o texto indicando que o jogo acabou. Veja a Listagem 2.11.3.

**telas/TelaFimDeJogo.js · Listagem 2.11.3**

```jsx
const TelaFimDeJogo = (props) => {
  return (
    <View style={estilos.tela}>
      <Text>O jogo acabou.</Text>
    </View>
  );
};

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
```

O componente principal precisará saber se o jogo acabou, para renderizar a nova tela adequadamente. Para isso, ele terá uma nova variável em seu estado, que indica quantas foram as tentativas do computador. Veja a Listagem 2.11.4. Estamos no arquivo `App.js`.

**App.js · Listagem 2.11.4**

```jsx
const [rodadas, setRodadas] = useState(0);
```

Como de costume, o componente principal irá definir uma função que permite que outros componentes acessem seu estado. Ela recebe o número de rodadas e atualiza seu estado, como na Listagem 2.11.5.

**App.js · Listagem 2.11.5**

```jsx
const atualizaRodadas = (numRodadas) => {
  setRodadas(numRodadas)
}

if (numeroDigitado){
  conteudo = <TelaJogo valorDigitado={numeroDigitado}
    onJogoAcabou={atualizaRodadas}/>
}

const jogoComecou = (numeroDigitado) => {
  setNumeroDigitado(numeroDigitado);
  setRodadas(0);
};
```

A lógica para escolha da tela a ser renderizada também muda, evidentemente. Ela depende do número de rodadas. Veja os ajustes na Listagem 2.11.6.

**App.js · Listagem 2.11.6**

```jsx
import TelaFimDeJogo from './telas/TelaFimDeJogo';

//por padrão exibimos TelaComecoDoJogo
let conteudo = <TelaComecoDoJogo onJogoComecou={jogoComecou} />
//dependendo do estado, alteramos para TelaJogo
if (numeroDigitado && rodadas <= 0){
  conteudo = <TelaJogo valorDigitado={numeroDigitado}
    onJogoAcabou={atualizaRodadas}/>
}
else if (rodadas > 0){
  conteudo = <TelaFimDeJogo />
}
```

Agora precisamos usar a função que foi passada ao componente `TelaJogo` por meio da propriedade `onJogoAcabou`. Para isso, abra o arquivo `TelaJogo.js`. Ele precisa de uma nova variável em seu estado para armazenar o número de rodadas. Veja a Listagem 2.11.7.

**telas/TelaJogo.js · Listagem 2.11.7**

```jsx
const [rodadas, setRodadas] = useState (0);
```

A função `onJogoAcabou` agora pode ser chamada pela arrow function do operador (hook) `useEffect`. Note, porém, que ela só deve ser chamada caso o computador tenha acertado o número. Caso contrário o jogo terminará logo na primeira rodada. Veja a Listagem 2.11.8.

**telas/TelaJogo.js · Listagem 2.11.8**

```jsx
//no corpo da função que define o componente
useEffect(() => {
  if (tentativaAtual === props.valorDigitado) {
    props.onJogoAcabou(rodadas);
  }
});
```

Além disso, a variável `rodadas` deve ser atualizada a cada nova rodada. Isso pode ser feito a cada vez que um novo número é gerado, o que ocorre na função `geraNovoPalpite`. Veja a Listagem 2.11.9.

**telas/TelaJogo.js · Listagem 2.11.9**

```jsx
const geraNovoPalpite = (dica) => {
  //verificamos se a dica está errada
  if (dica === 'menor' && tentativaAtual < props.valorDigitado
      || dica ==='maior' && tentativaAtual > props.valorDigitado){
    Alert.alert('Dica inválida!', 'Dica errada...', [{text: "OK", style: 'cancel'}])
    return;
  }
  if (dica === 'menor'){
    //o valor máximo não pode ser maior do que a tentativa
    maxAtual.current = tentativaAtual;
  }else{
    minAtual.current = tentativaAtual;
  }
  //não dá o mesmo palpite
  const n = geraValor(minAtual.current, maxAtual.current, tentativaAtual);
  setTentativaAtual(n);
  setRodadas( rodadas => rodadas + 1);
};
```

### Dependências do useEffect

A função `useEffect` pode receber um segundo argumento que é um vetor de variáveis. Ali especificamos as suas dependências. Fazer isso é um ajuste fino que elimina chamadas à função `useEffect` desnecessárias. Da forma como está agora, sem o segundo argumento, a função `useEffect` entra em execução no final de cada renderização do componente. Porém, caso as variáveis que ela utiliza não tenham sido alteradas, não é necessário que ela seja executada. Assim, vamos identificar as variáveis das quais `useEffect` depende e entregá-las em um vetor em seu segundo argumento.

Comece extraindo as propriedades desejadas, usando a **desestruturação de objeto**, recurso que faz parte da especificação ES6. Com ele, extraímos propriedades de interesse de um objeto JSON, as quais podem ser usadas como variáveis após isso, sem que seja necessário especificar o nome do objeto JSON para cada uma delas. Veja a Listagem 2.11.10.

**telas/TelaJogo.js · Listagem 2.11.10**

```jsx
const {valorDigitado, onJogoAcabou} = props;

//no corpo da função que define o componente
useEffect(() => {
  if (tentativaAtual === props.valorDigitado) {
    props.onJogoAcabou(rodadas);
  }
});
```

A seguir, especifique as dependências em um vetor, entregue como segundo argumento da função `useEffect`, como na Listagem 2.11.11. Note que ela também depende da tentativa atual.

**telas/TelaJogo.js · Listagem 2.11.11**

```jsx
const { valorDigitado, onJogoAcabou } = props;

//no corpo da função que define o componente
useEffect(() => {
  if (tentativaAtual === props.valorDigitado) {
    props.onJogoAcabou(rodadas);
  }
}, [tentativaAtual, valorDigitado, onJogoAcabou]);
```

## A tela de fim de jogo
Duration: 8:00

Na tela de final de jogo, pode ser de interesse exibir quantas vezes o computador precisou tentar para encontrar o número, além do próprio número. Essas informações já estão disponíveis no componente `App`. Basta que ele as entregue ao componente `TelaFimDeJogo` que, por sua vez, deve reservar espaço na tela para exibi-las. Veja as listagens 2.11.12 e 2.11.13.

**telas/TelaFimDeJogo.js · Listagem 2.11.12**

```jsx
const TelaFimDeJogo = (props) => {
  return (
    <View style={estilos.tela}>
      <Text>O jogo acabou.</Text>
      <Text>Número de tentativas: {props.rodadas}</Text>
      <Text>O número era: {props.numeroDigitado}</Text>
    </View>
  );
};
```

**App.js · Listagem 2.11.13**

```jsx
else if (rodadas > 0){
  conteudo = <TelaFimDeJogo rodadas={rodadas} numeroDigitado={numeroDigitado} />
}
```

Na tela de fim de jogo, também pode ser de interesse colocar um botão que permite reiniciar o jogo. Para isso, é preciso alterar as variáveis que fazem parte do estado do componente principal (em `App.js`) que são utilizadas para decidir qual tela exibir. Cabe ao componente principal disponibilizar uma função que permita que a `TelaFimDeJogo` faça as alterações necessárias, que são: zerar o número de rodadas e anular a existência do número selecionado pelo usuário. Assim o jogo vai começar da tela inicial. Veja as listagens 2.11.14 e 2.11.15.

**App.js · Listagem 2.11.14**

```jsx
const iniciarNovoJogo = () => {
  setRodadas(0);
  setNumeroDigitado(null);
}

else if (rodadas > 0) {
  conteudo = <TelaFimDeJogo rodadas={rodadas} numeroDigitado={numeroDigitado}
    onIniciarNovoJogo={iniciarNovoJogo} />
}
```

**telas/TelaFimDeJogo.js · Listagem 2.11.15**

```jsx
import { View, Text, StyleSheet, Button } from 'react-native';

const TelaFimDeJogo = (props) => {
  return (
    <View style={estilos.tela}>
      <Text>O jogo acabou.</Text>
      <Text>Número de tentativas: {props.rodadas}</Text>
      <Text>O número era: {props.numeroDigitado}</Text>
      <Button
        title="Novo Jogo"
        onPress={props.onIniciarNovoJogo}
      />
    </View>
  );
};
```

## Encerramento
Duration: 3:00

O jogo de adivinhação está completo: o usuário escolhe um número, o computador tenta adivinhá-lo seguindo as dicas "É menor" e "É maior", e a tela de fim de jogo mostra quantas tentativas foram necessárias, com a opção de começar um novo jogo.

### Referências

* React: A JavaScript library for building user interfaces. 2020. Disponível em [https://reactjs.org/](https://reactjs.org/). Acesso em janeiro de 2020.
* React Native: A framework for building native apps using React. 2020. Disponível em [https://facebook.github.io/react-native/](https://facebook.github.io/react-native/). Acesso em janeiro de 2020.
