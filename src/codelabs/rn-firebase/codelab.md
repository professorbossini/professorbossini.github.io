summary: Crie um app React Native de lembretes que grava, lista em tempo real e remove documentos na base NoSQL Cloud Firestore do Firebase.
id: rn-firebase
categories: Firebase,React Native,Mobile
tags: react native,expo,firebase,firestore,nosql,onsnapshot,useeffect,flatlist,alert
status: Published
authors: Rodrigo Bossini
last updated: 2021-02-22
pdf: react_native/old/12_react_native_firebase_apostila.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React Native com Firebase: lembretes no Firestore

## Visão geral
Duration: 3:00

Neste material iremos desenvolver uma aplicação que permite que o usuário armazene seus lembretes em uma base de dados remota. Usaremos a base NoSQL **Firestore** do Firebase.

### O que você vai aprender

* Criar um projeto no console do Firebase e habilitar o Firestore
* Guardar a configuração do Firebase fora do repositório e inicializar o SDK
* Inserir documentos em uma coleção com `add`
* Observar a coleção em tempo real com `onSnapshot` dentro de um `useEffect`
* Exibir os lembretes em uma `FlatList` e removê-los com um toque longo e confirmação

### O que você vai precisar

* Node.js e o Expo CLI (comando `expo`)
* Uma conta Google para acessar o console do Firebase
* Um celular com o Expo Go ou um emulador

## Criando o projeto e instalando o Firebase
Duration: 5:00

### Criando um novo projeto expo

Vá até o seu workspace (uma pasta para seus projetos) e crie um novo projeto com

**Terminal**

```bash
expo init nome-do-projeto
```

A seguir, navegue até o diretório do projeto recém-criado e abra uma instância do VS Code vinculada a ele com

**Terminal**

```bash
cd nome-do-projeto
code .
```

O projeto pode ser colocado em execução com

**Terminal**

```bash
expo start
```

### Instalação do pacote do Firebase

O Firebase pode ser instalado com o seguinte comando.

**Terminal**

```bash
expo install firebase
```

<aside class="negative">

Este material usa a API com *namespaces* do Firebase (`import * as firebase from 'firebase'`, `firebase.firestore()`), das versões 7 e 8 do SDK. A partir da versão 9 o SDK passou a ser modular e esse código não funciona sem adaptação; para seguir o material como está, instale uma versão 8 (`npm install firebase@8`).

</aside>

## Projeto no console do Firebase
Duration: 10:00

Um projeto no Firebase é um agrupamento de configurações que nos permite especificar quais serviços estão habilitados, quais aplicações podem utilizá-los e assim por diante.

O console do Firebase pode ser acessado a partir do link a seguir.

[https://console.firebase.google.com/](https://console.firebase.google.com/)

* Crie um novo projeto clicando em **Adicionar projeto** e na tela a seguir dê a ele um nome.
* Depois disso, escolha se deseja habilitar o Google Analytics e clique em **Continuar**. Por fim, clique em **criar projeto**.
* Vamos começar habilitando um dos serviços de bases de dados não relacionais disponíveis no Firebase, que é o **Firestore**. Para isso, clique em **Database** e, a seguir, **Criar banco de dados**. Para simplificar, inicie em **modo de teste**. Depois disso, escolha a região para armazenamento e clique em **Concluído**.

<aside class="negative">

No modo de teste, todo dado armazenado será mundialmente acessível. Quando a aplicação for para produção, evidentemente as regras de acesso devem ser alteradas, incluindo mecanismos de autenticação.

</aside>

A seguir, clique em **Visão Geral do Projeto** e, então, no símbolo **</>**, como mostra a Figura 2.3.1. Registre o app com um apelido para obter um objeto JSON com as informações necessárias para acessar os serviços do Firebase.

![Console do Firebase com o item "Visão geral do projeto" do menu lateral e o ícone </> (web) da seção Selecionar uma plataforma destacados em vermelho](img/fig-2-3-1.webp)

*Figura 2.3.1: Registrando um app web no projeto.*

## Configurando e inicializando o Firebase
Duration: 8:00

Na raiz da sua aplicação React Native, crie um arquivo chamado `env.js`. Cole o objeto JSON copiado nele, exportando-o como padrão. Veja a Listagem 2.3.1. Mantenha todas as chaves no seu arquivo.

**env.js · Listagem 2.3.1**

```javascript
export default {
  apiKey: "",
  authDomain: "pessoal-firebase.firebaseapp.com",
  databaseURL: "https://pessoal-firebase.firebaseio.com",
  projectId: "pessoal-firebase",
  storageBucket: "pessoal-firebase.appspot.com",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
```

Ajuste o arquivo `.gitignore` para que ele não seja enviado para o servidor git remoto, principalmente se seu repositório for público. Para isso, basta acrescentar a linha `env.js`, como na Listagem 2.3.2.

**.gitignore · Listagem 2.3.2**

```text
node_modules/**/*
.expo/*
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
web-report/
env.js

# macOS
.DS_Store
```

No arquivo `App.js`, que fica na raiz da aplicação, vamos inicializar o Firebase. Primeiro, importamos o arquivo com as configurações e o conteúdo do pacote `firebase`. A seguir, chamamos a função `initializeApp` passando a ela como parâmetro o objeto de configurações. Veja a Listagem 2.3.3.

**App.js · Listagem 2.3.3**

```jsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ENV from './env';
import * as firebase from 'firebase';

if (!firebase.apps.length)
  firebase.initializeApp(ENV);

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
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

## Entrada de texto e inserção no Firestore
Duration: 12:00

### Componente para a entrada de texto e um botão

A tela inicial terá um campo textual em que o usuário poderá digitar os seus lembretes. Depois de digitar, ele irá clicar em um botão para fazer a inserção. Eles são do tipo `TextInput` e `Button`, respectivamente. A Listagem 2.4.1 mostra como adicioná-los no arquivo `App.js`. Além disso, eles são estilizados com objetos JSON cuja definição aparece na Listagem 2.4.2.

**App.js · Listagem 2.4.1**

```jsx
export default function App() {
  return (
    <View style={styles.container}>
      <TextInput style={styles.entrada} placeholder="Digite seu lembrete" />
      <View style={styles.botao}>
        <Button
          title="OK"
        />
      </View>
    </View>
  );
}
```

**App.js · Listagem 2.4.2**

```jsx
const styles = StyleSheet.create({
  container: {
    padding: 40,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  entrada: {
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    fontSize: 14,
    textAlign: 'center',
    width: '80%',
    marginBottom: 8
  },
  botao: {
    width: '80%'
  }
});
```

<aside class="positive">

Lembre-se de acrescentar à importação de `'react-native'` os componentes que passam a ser usados (`TextInput`, `Button` e, adiante, `FlatList`), e de importar o `useState` de `'react'`.

</aside>

### Variável para armazenar o lembrete digitado localmente

Conforme o usuário digita um lembrete, desejamos armazenar o seu conteúdo para que, no momento em que o botão for clicado, ele possa ser enviado ao Firebase. Para isso, vamos usar o Hook `useState`, declarando uma variável e uma função que pode alterar o seu valor. Ela fica vinculada ao campo `value` do `TextInput`. A função `capturarLembrete` é chamada a cada alteração no campo. Veja a Listagem 2.5.1.

**App.js · Listagem 2.5.1**

```jsx
export default function App() {
  const [lembrete, setLembrete] = useState('');
  const capturarLembrete = (lembrete) => {
    setLembrete(lembrete);
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.entrada}
        placeholder="Digite seu lembrete"
        onChangeText={capturarLembrete}
        value={lembrete}
      />
      <View style={styles.botao}>
        <Button
          title="OK"
        />
      </View>
    </View>
  );
}
```

### Função para inserir um lembrete no Firestore

A função da listagem a seguir faz a inserção de um lembrete na base de dados do Firestore. Ela acessa a coleção de lembretes e usa o método `add` para criar um novo documento nela. A propriedade `onPress` do botão a referencia. Cada documento tem um id único gerado automaticamente pelo Firestore. Ao final, atualizamos o lembrete para limpar o `TextInput`.

**App.js**

```jsx
import 'firebase/firestore'

const db = firebase.firestore() // fora da função que define o componente

const adicionarLembrete = () => {
  db.collection('lembretes').add({
    texto: lembrete,
    data: new Date()
  })
  setLembrete('')
}

return (
  <View style={styles.container}>
    <TextInput
      style={styles.entrada}
      placeholder="Digite seu lembrete"
      onChangeText={capturarLembrete}
      value={lembrete}
    />
    <View style={styles.botao}>
      <Button
        title="OK"
        onPress={adicionarLembrete}
      />
    </View>
  </View>
);
```

## Observando a coleção e exibindo os lembretes
Duration: 12:00

Para buscar os dados do Firestore, vamos registrar um **observador** que será notificado sempre que uma alteração acontecer. Desejamos fazer isso uma única vez, logo depois de o componente principal da aplicação ter sido renderizado pela primeira vez. Podemos obter esse efeito com o Hook `useEffect`. Especificamos uma função que deve ser executada e uma lista de objetos que são dependências para que ela seja executada. Passamos uma lista vazia para que, depois da primeira renderização, ela não seja mais executada, pois ela somente seria caso algum elemento da lista fosse alterado. Além disso, armazenamos os lembretes em outra variável do estado do componente. Veja a Listagem 2.5.2.

**App.js · Listagem 2.5.2**

```jsx
import React, { useState, useEffect } from 'react';

const [lembretes, setLembretes] = useState([]);

useEffect(() => {
  db.collection('lembretes').onSnapshot((snapshot) => {
    let aux = [];
    snapshot.forEach(doc => {
      aux.push(doc.data());
    });
    setLembretes(aux);
  });
}, []);
```

### Exibindo os dados

A aplicação irá exibir os lembretes em um componente do React Native chamado `FlatList`. Para isso, basta especificar qual a coleção de dados a ser exibida e uma função que mapeia cada item da coleção a uma expressão que descreve sua representação visual. Ela ficará logo abaixo do botão. Veja a Listagem 2.6.1.

**App.js · Listagem 2.6.1**

```jsx
return (
  <View style={styles.container}>
    <TextInput
      style={styles.entrada}
      placeholder="Digite seu lembrete"
      onChangeText={capturarLembrete}
      value={lembrete}
    />
    <View style={styles.botao}>
      <Button
        title="OK"
        onPress={adicionarLembrete}
      />
      <FlatList
        style={{ marginTop: 4 }}
        data={lembretes}
        renderItem={l => (
          <View style={styles.itemLista}>
            <Text>{l.item.texto}</Text>
            <Text>{l.item.data.toDate().toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  </View> );
```

O objeto de estilos de cada elemento exibido na `FlatList` aparece na Listagem 2.6.2.

**App.js · Listagem 2.6.2**

```jsx
const styles = StyleSheet.create({
  itemLista: {
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    alignItems: "center",
    justifyContent: 'center',
    padding: 8
  },
  container: {
    padding: 40,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  entrada: {
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    fontSize: 14,
    textAlign: 'center',
    width: '80%',
    marginBottom: 8
  },
  botao: {
    width: '80%'
  }
});
```

## Removendo lembretes
Duration: 10:00

Para viabilizar a remoção de lembretes, precisamos armazenar o seu id no estado local da aplicação. Ele é uma propriedade acessível a partir de cada documento (`doc.id`).

Começamos ajustando a função entregue para o Hook `useEffect`, como na Listagem 2.7.1.

**App.js · Listagem 2.7.1**

```jsx
useEffect(() => {
  db.collection('lembretes').onSnapshot((snapshot) => {
    let aux = [];
    snapshot.forEach(doc => {
      aux.push({
        data: doc.data().data,
        texto: doc.data().texto,
        chave: doc.id
      });
    });
    setLembretes(aux);
  });
}, []);
```

A seguir, precisamos tornar os itens da lista "tocáveis". Para isso, basta englobar a expressão que define sua representação visual com algum tipo de *Touchable*, por exemplo, `TouchableOpacity`. Veja a Listagem 2.7.2.

**App.js · Listagem 2.7.2**

```jsx
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';

<FlatList
  style={{ marginTop: 4 }}
  data={lembretes}
  renderItem={l => (
    <TouchableOpacity>
      <View style={styles.itemLista}>
        <Text>{l.item.texto}</Text>
        <Text>{l.item.data.toDate().toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  )}
/>
```

A função da Listagem 2.7.3 fica vinculada ao evento `onLongPress` do componente *Touchable*. Ela usa o objeto `db` para fazer a remoção do item tocado, dado o seu id.

**App.js · Listagem 2.7.3**

```jsx
const removerItem = (chave) => {
  db.collection('lembretes').doc(chave).delete();
}

<TouchableOpacity onLongPress={() => { removerItem(l.item.chave) }}>
  <View style={styles.itemLista}>
    <Text>{l.item.texto}</Text>
    <Text>{l.item.data.toDate().toLocaleString()}</Text>
  </View>
</TouchableOpacity>
```

Pode ser de interesse apresentar um alerta ao usuário antes de fazer a remoção do item de fato. Isso pode ser feito com o método `alert` do componente `Alert`. Veja a Listagem 2.7.4.

**App.js · Listagem 2.7.4**

```jsx
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';

const removerItem = (chave) => {
  Alert.alert(
    "Apagar?",
    "Quer mesmo apagar seu lembrete?",
    [
      {
        text: "Cancelar",
      },
      {
        text: "Confirmar",
        onPress: () => db.collection('lembretes').doc(chave).delete()
      }
    ]
  )
}
```

## Encerramento
Duration: 3:00

A aplicação grava lembretes no Cloud Firestore, recebe as alterações em tempo real por meio de um observador (`onSnapshot`) e permite apagar um lembrete com um toque longo, depois de confirmar em um alerta.

### Referências

* Cloud Firestore: Firebase. 2020. Disponível em [https://firebase.google.com/docs/firestore/](https://firebase.google.com/docs/firestore/). Acesso em maio de 2020.
* React: A JavaScript library for building user interfaces. 2020. Disponível em [https://reactjs.org/](https://reactjs.org/). Acesso em maio de 2020.
* React Native: A framework for building native apps using React. 2020. Disponível em [https://facebook.github.io/react-native/](https://facebook.github.io/react-native/). Acesso em maio de 2020.
