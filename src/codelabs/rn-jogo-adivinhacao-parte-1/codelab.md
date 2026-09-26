summary: Comece um jogo de adivinhação de números com React Native e Expo, criando componentes próprios (Cabecalho, Cartao, Entrada), telas, estilos com sombra e elevação e cores centralizadas.
id: rn-jogo-adivinhacao-parte-1
categories: React Native,Mobile
tags: react native,expo,componentes,props,children,stylesheet,flexbox,textinput,button
status: Published
authors: Rodrigo Bossini
last updated: 2021-02-22
pdf: react_native/old/05_react_native_aplicacao_apostila.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React Native: jogo de adivinhação (parte 1)

## Visão geral
Duration: 3:00

Neste material iremos desenvolver uma nova aplicação, ilustrando o uso de novos componentes prontos do React, a criação de novos componentes personalizados, o uso mais avançado de recursos para estilizar componentes entre outras coisas. A aplicação que criaremos é um jogo de adivinhação muito conhecido. A aplicação irá gerar um número aleatório e pedir que o usuário tente adivinhar que número é. Quando adivinhar, o jogo acaba. Veja sua tela inicial na Figura 1.1.

![Tela de celular Android com o cabeçalho azul "Adivinhe o número", o texto "Comece um jogo" e um cartão com "Escolha um número", um campo de entrada e os botões laranja Reiniciar e Confirmar](img/tela-inicial.webp)

*Figura 1.1: Tela inicial do jogo.*

### O que você vai aprender

* Organizar a aplicação em componentes (pasta `components`) e telas (pasta `telas`)
* Receber dados via `props` e conteúdo via `props.children`
* Estilizar com `StyleSheet`, Flexbox, sombras (iOS) e `elevation` (Android)
* Mesclar estilos próprios com estilos recebidos via props usando o operador spread
* Centralizar as cores da aplicação em um único arquivo
* Repassar propriedades de um componente para o `TextInput` que ele encapsula

### O que você vai precisar

* Node.js e o Expo CLI instalados (comando `expo`)
* VS Code
* Um celular com o Expo Go ou um emulador

## Criando o projeto
Duration: 5:00

### Criando um novo projeto

Abra um terminal e navegue até o seu workspace, que é a pasta que abriga todos os seus projetos React. Lembre-se que o workspace não é uma pasta específica de nenhum projeto. Use o seguinte comando para criar um novo projeto

**Terminal**

```bash
expo init nome_do_seu_app
```

### Abrindo o VS Code

Navegue até o diretório `nome_do_seu_app` e abra uma instância do VS Code vinculada a ele

**Terminal**

```bash
cd nome_do_seu_app
code .
```

### Iniciando o projeto

Coloque o projeto em execução com o comando

**Terminal**

```bash
npm start
```

que pode ser digitado a partir do terminal comum ou mesmo do terminal interno do VS Code.

### Apagando parte do conteúdo inicial

Comece fazendo uma limpeza no código entregue automaticamente pelo assistente do Expo, existente no arquivo `App.js`. Não precisaremos do componente textual e do objeto que define alguns estilos. Apagando esses trechos, o resultado deve ser parecido com o que mostra a Listagem 2.4.1.

**App.js · Listagem 2.4.1**

```jsx
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <View>
    </View>
  );
}

const estilos = StyleSheet.create({
});
```

## O componente Cabecalho
Duration: 12:00

Como aprendemos, é fortemente recomendável escrever aplicações compostas por diversos componentes, cada qual com uma pequena responsabilidade, ao invés de escrever uma aplicação com um único componente que resolve todos os problemas. Isso nos leva a uma solução de maior nível de reusabilidade e que permite que manutenções futuras sejam feitas com maior facilidade.

Comece criando uma pasta chamada `components` (o nome pode ser qualquer um) lado a lado com o arquivo `App.js`. A seguir, crie um arquivo chamado `Cabecalho.js` dentro da pasta `components`.

O componente será definido por meio de uma arrow function. Veja sua definição inicial na Listagem 2.5.1.

**components/Cabecalho.js · Listagem 2.5.1**

```jsx
const Cabecalho = (props) => {

};
```

Evidentemente precisaremos trazer o React para o contexto, além de alguns componentes próprios do React Native. Esse componente definirá seus objetos de estilo e, por fim, vamos também especificar que ele é exportado por padrão, como na Listagem 2.5.2.

**components/Cabecalho.js · Listagem 2.5.2**

```jsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Titulo = (props) => {

};

const estilos = StyleSheet.create({
});

export default Titulo;
```

<aside class="positive">

A partir da Listagem 2.5.2, a apostila chama a função de `Titulo` dentro de `Cabecalho.js`. Como ela é exportada por padrão, o nome interno não importa para quem a importa: no `App.js` ela continuará sendo usada como `Cabecalho`.

</aside>

A seguir, vamos definir a expressão JSX que diz como se dá a apresentação visual do componente. Note que o texto que ele exibe como título é entregue a ele por meio de seu props. Veja a Listagem 2.5.3.

**components/Cabecalho.js · Listagem 2.5.3**

```jsx
const Titulo = (props) => {
  return (
    <View>
      <Text>{props.titulo}</Text>
    </View>
  );
};
```

Para estilizar o cabeçalho, vamos criar um objeto JSON como propriedade do objeto `estilos`, que já criamos. Escolhemos suas medidas, cor e alinhamento. Veja a Listagem 2.5.4.

**components/Cabecalho.js · Listagem 2.5.4**

```jsx
const estilos = StyleSheet.create({
  cabecalho: {
    width: '100%',
    height: 95,
    paddingTop: 40,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
```

A seguir, vamos estilizar o texto exibido no cabeçalho. Para isso, criaremos outro objeto JSON para agrupar as propriedades de interesse. Veja a Listagem 2.5.5.

**components/Cabecalho.js, no objeto estilos · Listagem 2.5.5**

```jsx
titulo: {
  color: '#000',
  fontSize: 22
}
```

Não deixe de aplicar os estilos aos componentes desejados, como na Listagem 2.5.6.

**components/Cabecalho.js · Listagem 2.5.6**

```jsx
<View style={estilos.cabecalho}>
  <Text style={estilos.titulo}>{props.titulo}</Text>
</View>
```

Para utilizar o componente, volte ao arquivo `App.js`. Como sabemos, um componente pode ser utilizado como se fosse uma tag. Ele será filho direto da `View` principal do componente `App`. Note que é preciso entregar para ele o texto que irá exibir como título, via props. A Listagem 2.5.7 ilustra isso.

**App.js · Listagem 2.5.7**

```jsx
import Cabecalho from './components/Cabecalho';

export default function App() {
  return (
    <View>
      <Cabecalho titulo={"Adivinhe o número"}/>
    </View>
  );
}
```

Crie um objeto de estilo para a `View` principal do arquivo `App.js` para indicar que ele toma a tela inteira do dispositivo, como na Listagem 2.5.8.

**App.js · Listagem 2.5.8**

```jsx
const estilos = StyleSheet.create({
  tela: {
    flex: 1
  }
});
```

## A tela TelaComecoDoJogo
Duration: 15:00

A tela principal da aplicação, que exibe o jogo, será definida por um novo componente. A aplicação terá três telas e vamos diferenciar os componentes que representam telas daqueles que não representam, muito embora todos eles sejam componentes.

Comece criando uma pasta chamada `telas` lado a lado com o arquivo `App.js`. A seguir, crie um arquivo chamado `TelaComecoDoJogo.js` na pasta `telas`.

A definição inicial dele é análoga à definição dos componentes que fizemos até então. Veja a Listagem 2.6.1.

**telas/TelaComecoDoJogo.js · Listagem 2.6.1**

```jsx
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const TelaComecoDoJogo = (props) => {

}

const estilos = StyleSheet.create({
});

export default TelaComecoDoJogo;
```

Crie um objeto JSON para estilizar o componente, como na Listagem 2.6.2.

**telas/TelaComecoDoJogo.js · Listagem 2.6.2**

```jsx
const TelaComecoDoJogo = (props) => {
  return (
    <View style={estilos.tela}>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1, //toma todo o espaço que puder
    padding: 10,
    alignItems: 'center'
  }
});
```

No arquivo `App.js`, passe a utilizar o componente por meio de sua tag, logo abaixo do cabeçalho, como mostra a Listagem 2.6.3.

**App.js · Listagem 2.6.3**

```jsx
import TelaComecoDoJogo from './telas/TelaComecoDoJogo';

export default function App() {
  return (
    <View style={estilos.tela}>
      <Cabecalho titulo={"Adivinhe o número"}/>
      <TelaComecoDoJogo />
    </View>
  );
}
```

Inicialmente, a expressão JSX que descreve o componente `TelaComecoDoJogo` incluirá

* Um `Text` para exibir uma mensagem inicial
* Uma `View` para abrir a parte principal da tela
* Um `Text` que instrui o usuário sobre o que fazer e um `TextInput` para ele poder digitar seu número, ambos filhos da `View` principal
* Uma `View` para abrir dois botões
* Um `Button` para reiniciar
* Um `Button` para jogar

Veja a listagem a seguir.

**telas/TelaComecoDoJogo.js · Listagem 2.6.3**

```jsx
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';

const TelaComecoDoJogo = (props) => {
  return (
    <View style={estilos.tela}>
      <Text>Comece um jogo</Text>
      <View>
        <Text>Escolha um número</Text>
        <TextInput />
        <View>
          <Button
            title="Reiniciar"
          />
          <Button
            title="Confirmar"/>
        </View>
      </View>
    </View>
  );
}
```

Para estilizar o componente, criaremos três objetos JSON.

* `titulo`: aplicado ao texto principal da tela
* `entradaView`: aplicado à `View` que abriga os elementos de entrada de dados, como `TextInput` e `Buttons`
* `buttonsView`: aplicado à `View` que abriga os botões

Veja a Listagem 2.6.4.

**telas/TelaComecoDoJogo.js · Listagem 2.6.4**

```jsx
const TelaComecoDoJogo = (props) => {
  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>Comece um jogo</Text>
      <View style={estilos.entradaView}>
        <Text>Escolha um número</Text>
        <TextInput />
        <View style={estilos.buttonsView}>
          <Button
            title="Reiniciar"
          />
          <Button
            title="Confirmar"/>
        </View>
      </View>
    </View>
  );
}

//filhos do objeto estilos
titulo: {
  fontSize: 20,
  marginVertical: 10,
},
entradaView: {
  //300 pontos de largura
  width: 300,
  //mas no máximo, 80% da tela
  maxWidth: '80%',
  //alinhamento no eixo perpendicular (horizontal, neste caso)
  alignItems: 'center'
},
buttonsView: {
  //o padrão é column
  flexDirection: 'row',
  width: '100%',
  // alinhamento no eixo principal (horizontal, neste caso)
  justifyContent: 'space-between',
  paddingHorizontal: 15
}
```

### Aparência de cartão

Um padrão muito comum utilizado em aplicações web e para dispositivos móveis é o uso de "cartões" para a exibição de conteúdo. Vamos aplicar mais algumas propriedades ao container de entrada de dados para que sua aparência seja como a de um cartão. Altere as propriedades como na Listagem 2.6.5.

**telas/TelaComecoDoJogo.js, no objeto estilos · Listagem 2.6.5**

```jsx
entradaView: {
  //300 pontos de largura
  width: 300,
  //mas no máximo, 80% da tela
  maxWidth: '80%',
  //alinhamento no eixo perpendicular (horizontal, neste caso)
  alignItems: 'center',
  shadowColor: 'black',
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowRadius: 6,
  shadowOpacity: 0.32,
  backgroundColor: 'white',
},
```

Perceba, porém, que os atributos de sombra (*shadow*) não funcionam em dispositivos Android. De fato, eles são exclusivos do iOS. Para obter esse efeito no Android, usamos a propriedade `elevation`. Ela envolve somente um número que indica a "elevação" no eixo z. Os demais atributos referentes à sombra ficam a cargo da especificação Material Design. Veja a Listagem 2.6.6.

**telas/TelaComecoDoJogo.js, no objeto estilos · Listagem 2.6.6**

```jsx
entradaView: {
  //300 pontos de largura
  width: 300,
  //mas no máximo, 80% da tela
  maxWidth: '80%',
  //alinhamento no eixo perpendicular (horizontal, neste caso)
  alignItems: 'center',
  shadowColor: 'black',
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowRadius: 6,
  shadowOpacity: 0.32,
  backgroundColor: 'white',
  elevation: 4
},
```

Os botões estão muito colados às bordas da `View` a que pertencem. Vale a pena adicionar um espaço ali, o que pode ser feito usando a propriedade `padding`. Além disso, vamos arredondar as bordas, com a propriedade `borderRadius`. Veja a Listagem 2.6.7.

**telas/TelaComecoDoJogo.js, no objeto estilos · Listagem 2.6.7**

```jsx
entradaView: {
  //300 pontos de largura
  width: 300,
  //mas no máximo, 80% da tela
  maxWidth: '80%',
  //alinhamento no eixo perpendicular (horizontal, neste caso)
  alignItems: 'center',
  shadowColor: 'black',
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowRadius: 6,
  shadowOpacity: 0.32,
  backgroundColor: 'white',
  elevation: 4,
  padding: 12,
  borderRadius: 8
},
```

## Refatoração: o componente Cartao
Duration: 12:00

Um cartão se parece bastante com um componente independente que potencialmente será utilizado em outras partes da aplicação. Parece uma boa ideia criar um componente "cartão" que possa ser utilizado em diversas partes da aplicação.

Comece criando um novo arquivo chamado `Cartao.js` na pasta `components`. Seu conteúdo inicial é dado na Listagem 2.7.1.

**components/Cartao.js · Listagem 2.7.1**

```jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Cartao = (props) => {

};

const estilos = StyleSheet.create({
});

export default Cartao;
```

O estilo a ser aplicado no cartão é aquele já definido para a `View` de entrada de dados, do componente `TelaComecoDoJogo`. Por isso, traga as configurações para o arquivo `Cartao.js`, criando um novo objeto JSON para agrupá-las. Note que a largura e o alinhamento não necessariamente são iguais para todos os cartões, por isso removemos essas configurações. Veja a Listagem 2.7.2.

**components/Cartao.js · Listagem 2.7.2**

```jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Cartao = (props) => {

};

const estilos = StyleSheet.create({
  cartao: {
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 6,
    shadowOpacity: 0.32,
    backgroundColor: 'white',
    elevation: 4,
    padding: 12,
    borderRadius: 12
  }
});

export default Cartao;
```

A expressão JSX do cartão é uma simples `View` decorada com o objeto JSON que criamos. Além disso, a ideia é que esse seja um componente cujo conteúdo seja diferente, dependendo do contexto em que for utilizado. Ou seja, deve ser possível entregar para ele o conteúdo que ele deve exibir, no momento em que for usado. Isso pode ser feito via props, lembra? Neste caso, há um nome especial para acesso ao conteúdo de uma `View`: **children**. Veja o resultado na Listagem 2.7.3.

**components/Cartao.js · Listagem 2.7.3**

```jsx
const Cartao = (props) => {
  return (
    <View style={estilos.cartao}>{props.children}</View>
  );
};
```

É natural desejarmos viabilizar a passagem de estilos para um componente genérico como um cartão. Porém, no momento ele já ocupa a propriedade `style` de sua `View` principal com o objeto de estilos que ele mesmo define. Precisamos de algum mecanismo para mesclar essas configurações com configurações eventualmente enviadas via props. A ideia é muito simples. Vamos construir um novo objeto JSON constituído por todos os pares chave/valor que já existem no objeto `cartao` e por todos os pares chave/valor que existirem no objeto de estilo possivelmente entregue ao componente via props. Para isso, basta aplicar o operador **spread** em ambos. Veja o resultado na Listagem 2.7.4.

**components/Cartao.js · Listagem 2.7.4**

```jsx
const Cartao = (props) => {
  return (
    <View style={{...estilos.cartao, ...props.estilos}}>
      {props.children}
    </View>
  );
};
```

Agora o componente `TelaComecoDoJogo` já pode usar o componente `Cartao` que criamos. A Listagem 2.7.5 mostra como. Veja que apenas substituímos a tag `View` por uma tag `Cartao`.

**telas/TelaComecoDoJogo.js · Listagem 2.7.5**

```jsx
import Cartao from '../components/Cartao'

const TelaComecoDoJogo = (props) => {
  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>Comece um jogo</Text>
      <Cartao estilos={estilos.entradaView}>
        <Text>Escolha um número</Text>
        <TextInput />
        <View style={estilos.buttonsView}>
          <Button
            title="Reiniciar"
          />
          <Button
            title="Confirmar"/>
        </View>
      </Cartao>
    </View>
  );
}
```

Além disso, precisamos também retirar as configurações de estilo próprias do cartão e manter somente as de largura e alinhamento, próprias desse componente específico, o `TelaComecoDoJogo`. Remova-as como na Listagem 2.7.6.

**telas/TelaComecoDoJogo.js, no objeto estilos · Listagem 2.7.6**

```jsx
entradaView: {
  //300 pontos de largura
  width: 300,
  //mas no máximo, 80% da tela
  maxWidth: '80%',
  //apagar todos os outros daqui
},
```

## Ajustes nos botões e cores centralizadas
Duration: 10:00

Ajustar as cores, tamanho e outras propriedades dos componentes visuais é tão importante quanto as funcionalidades da aplicação. Vamos ajustar alguns aspectos dos botões.

Começamos aplicando um estilo aos botões de modo que eles tenham o mesmo tamanho. Veja a Listagem 2.8.1.

**telas/TelaComecoDoJogo.js · Listagem 2.8.1**

```jsx
const TelaComecoDoJogo = (props) => {
  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>Comece um jogo</Text>
      <Cartao estilos={estilos.entradaView}>
        <Text>Escolha um número</Text>
        <TextInput />
        <View style={estilos.buttonsView}>
          <View style={estilos.botao}>
            <Button
              title="Reiniciar"
            />
          </View>
          <View style={estilos.botao}>
            <Button
              title="Confirmar"
            />
          </View>
        </View>
      </Cartao>
    </View>
  );
}

//no objeto estilos
botao: {
  width: 100
}
```

Agora desejamos alterar a cor dos botões. Porém, faremos isso de uma maneira inteligente. Dado que as cores poderão ser utilizadas diversas vezes por diferentes componentes da aplicação, iremos defini-las em um único arquivo centralizado, dando nome a cada uma delas. Assim, sempre que for necessário usar uma cor, faremos isso pelo seu nome. No futuro, se uma cor for alterada, a alteração será refletida automaticamente em todos os componentes que a utilizam, simplificando a manutenção. Crie uma pasta chamada `cores`. Dentro dela, crie um arquivo chamado `cores.js`. O conteúdo inicial do arquivo é dado na Listagem 2.8.2. Os nomes das cores que utilizaremos são os mesmos utilizados no padrão Material Design.

**cores/cores.js · Listagem 2.8.2**

```javascript
export default {
  accent: '#FFA726'
}
```

Aplique a cor associada a `accent` aos dois botões, como na Listagem 2.8.3.

**telas/TelaComecoDoJogo.js · Listagem 2.8.3**

```jsx
import Cores from '../cores/cores'

<View style={estilos.botao}>
  <Button
    title="Reiniciar"
    color={Cores.accent}
  />
</View>
<View style={estilos.botao}>
  <Button
    title="Confirmar"
    color={Cores.accent}
  />
</View>
```

Aproveite também para definir o azul que o componente `Cabecalho` utiliza. A Listagem 2.8.4 ilustra como.

**cores/cores.js e components/Cabecalho.js · Listagem 2.8.4**

```jsx
export default {
  accent: '#FFA726',
  primary: '#2196F3'
}

//no Cabecalho.js
import Cores from '../cores/cores';

cabecalho: {
  width: '100%',
  height: 95,
  paddingTop: 40,
  backgroundColor: Cores.primary,
  alignItems: 'center',
  justifyContent: 'center'
},
```

## Um componente para a entrada de dados
Duration: 12:00

O componente `TextInput` mal pode ser visto no momento. Vamos resolver isso criando um novo componente e estilizando-o.

Na pasta `components`, crie um arquivo chamado `Entrada.js`. Seu conteúdo inicial é dado na Listagem 2.9.1.

**components/Entrada.js · Listagem 2.9.1**

```jsx
import React from 'react'
import { TextInput, StyleSheet } from 'react-native';

const Entrada = (props) => {

};

export default Entrada;
```

A seguir, crie um objeto chamado `entrada` para abrigar suas configurações de estilo. Use a mesma técnica já vista para mesclar os atributos de estilo do componente com os atributos de estilo eventualmente recebidos via props. A expressão JSX a ser devolvida contém somente um `TextInput`. Veja a Listagem 2.9.2.

**components/Entrada.js · Listagem 2.9.2**

```jsx
const Entrada = (props) => {
  return (
    <TextInput style={{...estilos.entrada, ...props.estilos}}/>
  );
};

const estilos = StyleSheet.create({
  entrada: {
  }
});

export default Entrada;
```

A Listagem 2.9.3 mostra algumas possíveis propriedades a serem alteradas para o `TextInput`. Adicionamos borda inferior, margem em cima e embaixo, além de alterar a altura do componente.

**components/Entrada.js · Listagem 2.9.3**

```jsx
const estilos = StyleSheet.create({
  entrada: {
    height: 30,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    marginVertical: 10
  }
});
```

Para utilizar o novo componente, vá até o arquivo `TelaComecoDoJogo.js` e faça as alterações exibidas pela Listagem 2.9.4. Note que substituímos o componente `TextInput` pelo componente `Entrada`.

**telas/TelaComecoDoJogo.js · Listagem 2.9.4**

```jsx
import Entrada from '../components/Entrada'

const TelaComecoDoJogo = (props) => {
  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>Comece um jogo</Text>
      <Cartao estilos={estilos.entradaView}>
        <Text>Escolha um número</Text>
        <Entrada />
        <View style={estilos.buttonsView}>
          <View style={estilos.botao}>
            <Button
              title="Reiniciar"
              color={Cores.accent}
            />
          </View>
          <View style={estilos.botao}>
            <Button
              title="Confirmar"
              color={Cores.accent}
            />
          </View>
        </View>
      </Cartao>
    </View>
  );
}
```

Note que pode ser de interesse tornar o componente mais largo, além de não permitir que ele cresça horizontalmente conforme o usuário digita. Essas são configurações que dependem do contexto em que o componente está sendo utilizado, por isso, caberá ao componente `TelaComecoDoJogo` fazer as definições. Veja a Listagem 2.9.5.

**telas/TelaComecoDoJogo.js · Listagem 2.9.5**

```jsx
//no objeto estilos
entrada: {
  width: 50,
  textAlign: 'center'
}

//no uso do componente
<Entrada
  style={estilos.entrada}
/>
```

### Repassando propriedades ao TextInput

Em geral, os componentes React possuem diversas propriedades que podem ser alteradas. Nosso componente `Entrada` encapsula um `TextInput` e, assim, as propriedades dele ficam escondidas do código cliente do componente `Entrada`. Há um meio de permitir a especificação de propriedades esperadas pelo `TextInput` de modo que o componente `Entrada` as receba e as repasse para ele. Basta aplicar o operador spread no componente `TextInput`. Veja a Listagem 2.9.6.

**components/Entrada.js · Listagem 2.9.6**

```jsx
const Entrada = (props) => {
  return (
    <TextInput {...props} style={{...estilos.entrada, ...props.estilos}}/>
  );
};
```

Assim, todas as propriedades recebidas pelo componente `Entrada` serão repassadas para o componente `TextInput`.

Agora, no ponto em que o componente `Entrada` é usado, podemos especificar propriedades que ele entregará para o componente `TextInput` encapsulado por ele. Veja a Listagem 2.9.7.

**telas/TelaComecoDoJogo.js · Listagem 2.9.7**

```jsx
<Entrada
  style={estilos.entrada}
  autoCapitalize='none'
  blurOnSubmit
  autoCorrect={false}
  keyboardType="number-pad"
  maxLenth={2}
/>
```

<aside class="negative">

Dois detalhes da listagem original merecem atenção. O `Entrada` mescla o estilo recebido em `props.estilos` (e o `style` do spread é sobrescrito pelo `style` escrito depois dele); para que `estilos.entrada` seja de fato aplicado, passe-o como `estilos={estilos.entrada}`. E a propriedade do `TextInput` que limita o número de caracteres se chama `maxLength`: grafada `maxLenth`, ela é ignorada.

</aside>

## Encerramento
Duration: 3:00

A tela inicial do jogo está pronta visualmente: cabeçalho, cartão com a entrada de dados e botões estilizados, construídos a partir de componentes reutilizáveis (`Cabecalho`, `Cartao` e `Entrada`) e de cores centralizadas.

### Próximos passos

* Na parte 2 (codelab `rn-jogo-adivinhacao-parte-2`), você implementa as regras do jogo: validação da entrada, estado, alertas, a tela do jogo, os palpites do computador e a tela de fim de jogo.

### Referências

* React: A JavaScript library for building user interfaces. 2020. Disponível em [https://reactjs.org/](https://reactjs.org/). Acesso em janeiro de 2020.
* React Native: A framework for building native apps using React. 2020. Disponível em [https://facebook.github.io/react-native/](https://facebook.github.io/react-native/). Acesso em janeiro de 2020.
