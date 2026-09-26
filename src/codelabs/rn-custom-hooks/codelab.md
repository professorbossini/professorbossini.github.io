summary: Crie seu primeiro custom hook em React Native com TypeScript, encapsulando o estado e as operações de um contador para reutilizá-los em diferentes partes da aplicação.
id: rn-custom-hooks
categories: React Native,React,Mobile
tags: react native,expo,typescript,hooks,custom hooks,usestate
status: Published
authors: Rodrigo Bossini
last updated: 2025-09-08
pdf: react_native/new/003_apostila_react_native_custom_hooks.pdf
exercicios: react_native/new/003_exercicios_react_native_custom_hooks.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React Native: custom hooks

## Visão geral
Duration: 3:00

Neste material, vamos estudar sobre a criação de hooks próprios, visando a implementação de regras de negócio que podem se repetir em diferentes partes da aplicação. A motivação é a mesma que utilizamos quando criamos funções: promover reusabilidade, manutenabilidade e flexibilidade. Quando utilizamos Hooks, estamos optando por seguir tais princípios aderindo a convenções do React.

A primeira aplicação que criaremos exibe um simples contador. Veja.

![Tela com o título "Nosso primeiro Custom hook", o número 0 em destaque e os botões Incrementar, Decrementar e Reiniciar](img/contador.webp)

*A aplicação do contador.*

### O que você vai aprender

* O que é um custom hook e por que usá-lo
* A convenção do prefixo `use` no nome dos hooks
* Como encapsular uma variável de estado e suas funções num hook próprio
* Como importar e usar o hook num componente

### O que você vai precisar

* Node.js e VS Code instalados
* Um navegador (para testar com o Expo na web)
* Conhecer o hook `useState` (veja o codelab `rn-lembretes`)

## Criando a aplicação
Duration: 6:00

Comece criando a aplicação com

**Terminal**

```bash
npx create-expo-app -t expo-template-blank-typescript custom-hooks
```

Uma pasta chamada `custom-hooks` terá sido criada para você. Use

**Terminal**

```bash
code custom-hooks
```

para abrir uma instância do VS Code vinculada a ela. No VS Code, clique **Terminal >> New Terminal**, obtendo um terminal interno. Como vamos testar a aplicação no navegador num primeiro momento, instale as dependências para tal com

**Terminal do VS Code**

```bash
npx expo install react-native-web react-dom @expo/metro-runtime
```

Coloque a aplicação para funcionar com

**Terminal do VS Code**

```bash
npm start
```

No terminal, aperte **w** para vê-la funcionar no navegador. Se necessário, abra o navegador manualmente e visite

```text
http://localhost:8081/
```

Abra o arquivo `App.tsx` e ajuste seu conteúdo como a seguir.

**App.tsx**

```jsx
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Nosso primeiro Custom hook</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## O hook useContador
Duration: 6:00

Criaremos um custom hook que encapsula

* uma variável de estado que representa o valor do contador
* as funções de incremento, decremento e reinício

Para tal, crie uma pasta chamada **hooks** na raiz da aplicação. A seguir, crie um arquivo chamado **useContador.ts** nesta pasta. Observe.

![Explorer do VS Code do projeto CUSTOM-HOOKS com a nova pasta hooks contendo o arquivo useContador.ts](img/pasta-hooks.webp)

*A pasta hooks com o arquivo useContador.ts.*

Veja a implementação do custom hook. Observe que se trata de uma função que, quando chamada, devolve um objeto contendo a variável de estado e as três funções de interesse.

<aside class="positive">

**Nota.** O prefixo **use** é uma convenção específica do React relacionada aos hooks. Por convenção, todo nome de hook começa com este prefixo, muito embora isso não seja obrigatório tecnicamente.

</aside>

**hooks/useContador.ts**

```typescript
import { useState } from 'react'

export default (valorInicial: number = 0) => {
  const [contador, setContador] = useState(valorInicial)

  const incrementar = () => setContador(contador + 1)
  const decrementar = () => setContador(contador - 1)
  const reiniciar = () => setContador(valorInicial)

  return {contador, incrementar, decrementar, reiniciar}
}
```

## Usando o hook no App
Duration: 8:00

No arquivo `App.tsx`, importe e use o hook da seguinte forma.

**App.tsx**

```jsx
import { StyleSheet, Text, View } from 'react-native';
import useContador from './hooks/useContador';

export default function App() {
  const { contador, incrementar, decrementar, reiniciar } = useContador(0)
  return (
...
```

No próximo passo, crie um componente para exibição do valor do contador.

**App.tsx**

```jsx
export default function App() {
  const { contador, incrementar, decrementar, reiniciar } = useContador(0)
  return (
    <View style={styles.container}>
      <Text>Nosso primeiro Custom hook</Text>
      <View
        style={styles.principal}>
        <Text style={styles.numero}>{contador}</Text>
      </View>
    </View>
  );
}
```

Veja a estilização da aplicação.

**App.tsx**

```jsx
import { StyleSheet, Text, View } from 'react-native';
import useContador from './hooks/useContador';

export default function App() {
  const { contador, incrementar, decrementar, reiniciar } = useContador(0)
  return (
    <View style={styles.container}>
      <Text>Nosso primeiro Custom hook</Text>
      <View
        style={styles.principal}>
        <Text style={styles.numero}>{contador}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  principal:{
    width: '80%',
  },
  numero: {
    fontSize: 48,
    marginBottom: 20,
    textAlign: 'center'
  }
});
```

<aside class="positive">

A apostila termina neste ponto. As funções `incrementar`, `decrementar` e `reiniciar` já estão disponíveis no componente: ligá-las a botões, como os da tela mostrada na Visão geral, é um bom próximo passo para praticar.

</aside>

## Exercícios
Duration: 20:00

1. Crie nova aplicação. Ela usa um custom hook para isolar a definição das operações de uma calculadora que faz soma, subtração, multiplicação e divisão. Utilize o custom hook em uma interface gráfica simples, que permite que o usuário realize as quatro operações.

### Referências

* React Native. Learn once, write anywhere. 2025. Disponível em [https://reactnative.dev/](https://reactnative.dev/). Acesso em 2025.
