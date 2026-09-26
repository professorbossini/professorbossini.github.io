summary: Continue o app de lugares com React Native: estado centralizado com Redux (actions, reducers, useDispatch e useSelector), lista de lugares e fotos com a câmera do dispositivo via expo-image-picker.
id: rn-recursos-nativos-parte-2
categories: React Native,Redux,Mobile
tags: react native,expo,redux,react-redux,redux-thunk,usedispatch,useselector,expo-image-picker,camera
status: Published
authors: Rodrigo Bossini
last updated: 2021-02-22
pdf: react_native/old/09_react_native_recursos_nativos_apostila.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Recursos nativos com React Native (parte 2): Redux e câmera

## Visão geral
Duration: 5:00

Neste material prosseguimos com o desenvolvimento da aplicação que ilustra o uso de diversos recursos nativos, como GPS, bases de dados SQLite etc. Ele é a continuação do codelab `rn-recursos-nativos-parte-1`: aqui o estado da aplicação passa a ser gerenciado pelo Redux, a lista de lugares ganha forma e o usuário passa a poder tirar fotos com a câmera do dispositivo.

### O que você vai aprender

* Por que e como centralizar o estado com Redux
* Criar actions, reducers e a store com `createStore`, `combineReducers` e `applyMiddleware` (Redux Thunk)
* Entregar a store aos componentes com `Provider` e acessá-la com `useDispatch` e `useSelector`
* Exibir a lista de lugares com um componente próprio
* Tirar fotos com `expo-image-picker` e exibi-las com `Image`

### O que você vai precisar

* O projeto da parte 1
* Um celular com o Expo Go (a câmera não existe na maioria dos emuladores)

<aside class="negative">

**Versão do React Navigation.** Esta parte foi escrita para a primeira edição da parte 1, que usava o React Navigation antigo (`createStackNavigator`/`createAppContainer`, com o navegador exportado como o componente `LugaresNavigator`). A parte 1 atual usa `@react-navigation/native-stack`. Se você seguiu a parte 1 atual, adapte três pontos: (1) no `App.js`, coloque o elemento `container` dentro do `Provider` (`<Provider store={store}>{container}</Provider>`); (2) opções de cabeçalho definidas em `Tela.navigationOptions` vão para a propriedade `options` do `Stack.Screen` correspondente, e `navigation.getParam('x')` vira `route.params.x`; (3) a rota de detalhes se chama `DetalhesDoLugar` na parte 1 atual, e não `DetalheDoLugar`.

</aside>

## Redux: conceitos
Duration: 8:00

Em geral, aplicações React/React Native possuem diversos componentes. É comum que alguns deles possuam estado. Gerenciar o estado de uma aplicação pode ser uma tarefa um tanto complexa, principalmente quando ela possui diversos componentes. Considere o exemplo da Figura 2.1.

![Esboço de aplicação com uma tela de login (login, senha, OK) que leva a um dashboard com os botões Meus livros e Editar perfil; Meus livros leva a uma tela de livros e Editar perfil a uma tela com nome e idade; as duas telas perguntam "O usuário ainda está logado?"](img/fig-2-1.webp)

*Figura 2.1: Diferentes telas precisam consultar o mesmo estado.*

Note que, na aplicação da Figura 2.1, o estado da aplicação precisa ser consultado por diferentes componentes:

* Para acessar a lista de livros, é preciso saber qual usuário está logado para fazer a busca na base.
* Uma vez que o usuário atualize suas informações, outros componentes que as exibam em sua barra de títulos (por exemplo, em uma mensagem "Olá, Usuário") precisarão saber dessa atualização.

Esse cenário pode se tornar mais complexo conforme o número de componentes da aplicação aumenta e conforme a quantidade de itens pertencentes a seu estado aumenta também.

**Redux** é um "container de estado", como sua definição oficial diz, no link a seguir.

[https://redux.js.org/](https://redux.js.org/)

### Características do Redux segundo a documentação

A documentação oficial cita as seguintes características como benefícios obtidos ao se utilizar Redux.

* **Previsibilidade**: aplicações se comportam de maneira consistente em diferentes ambientes (cliente, servidor e nativo) e podem ser testadas facilmente.
* **Centralização do estado**: com Redux, o estado e a lógica da aplicação ficam centralizados, simplificando implementações e viabilizando operações como desfazer/refazer, operações de persistência etc.
* **Debug**: Redux inclui o conhecido Redux DevTools que ajuda a descobrir quando, onde, porque e como o estado da aplicação foi alterado.
* **Flexibilidade**: é possível utilizar qualquer framework para interface gráfica.

### Funcionamento básico do Redux

O funcionamento do Redux ocorre da seguinte forma.

* Todo o estado da aplicação é armazenado de maneira centralizada e gerenciado pelo Redux.
* Quando um componente deseja interagir com o estado, ele **despacha** ou **envia** (do inglês *dispatch*) uma **ação**.
* A ação é direcionada a um **reducer**, que é uma função que recebe a ação e **atualiza o estado** conforme instruções recebidas.
* Quando uma atualização no estado é feita por um reducer, é possível que outras funções previamente especificadas sejam notificadas e entrem em execução, o que se assemelha ao padrão de projeto **Observer**. Elas podem, por exemplo, avisar componentes interessados na alteração, enviando-lhes as partes do estado que lhes são de interesse por meio do objeto **props**.

A Figura 2.1.2.1 ilustra o funcionamento básico do Redux.

![Diagrama: componentes da aplicação enviam (dispatch) uma Action quando desejam manipular o estado; o Reducer recebe a action, executa instruções e atualiza o estado centralizado; a atualização dispara os "observadores", que enviam dados atualizados via props aos componentes](img/fig-2-1-2-1.webp)

*Figura 2.1.2.1: O funcionamento básico do Redux.*

## Configurando o Redux
Duration: 12:00

### Instalação do Redux

Use o comando a seguir para instalar o Redux e o Redux Thunk. O Redux Thunk será usado quando precisarmos fazer chamadas assíncronas, enviar ações depois de um intervalo determinado, enviar ações somente se uma condição desejada for verdadeira etc.

**Terminal**

```bash
npm install --save redux react-redux redux-thunk
```

### Configuração inicial do Redux

É comum criar uma pasta para abrigar actions e reducers que serão utilizadas pelo Redux. Um nome comum é `store`, já que o uso do Redux tem muito a ver com a centralização de estado, muito embora esse nome seja completamente arbitrário.

Crie uma pasta chamada `store` na raiz do projeto. A seguir, crie os arquivos `lugares-actions.js` e `lugares-reducer.js`.

No arquivo `lugares-reducer.js` crie um objeto para representar o estado inicial da aplicação. Trata-se de um simples objeto JSON. Ele terá um único vetor como propriedade, que armazenará os lugares salvos pelo usuário. Veja a Listagem 2.1.4.1.

**store/lugares-reducer.js · Listagem 2.1.4.1**

```javascript
const estadoInicial = {
  lugares: []
};
```

Lembre-se que um reducer é puramente uma função que opera sobre o estado da aplicação. Um reducer é acionado por uma ação recebida. Assim, vamos definir uma função que recebe o estado atual da aplicação (que será alterado ao longo do tempo, claro) e uma ação. No momento, ela somente devolve o estado como ele já era. Veja a Listagem 2.1.4.2.

**store/lugares-reducer.js · Listagem 2.1.4.2**

```javascript
export default (estado = estadoInicial, action) => {
  return estado;
}
```

A seguir, no arquivo `lugares-actions.js`, vamos definir uma ação para a inserção de lugares. Cada ação tem um identificador (cujo valor escolhemos arbitrariamente) que será enviado ao reducer correspondente. Na Listagem 2.1.4.3, definimos um identificador para a ação e uma função que é a própria ação. Ela recebe o nome do lugar a ser inserido e devolve um objeto constituído pelo tipo da ação e um objeto que contém o nome do lugar, momentaneamente.

**store/lugares-actions.js · Listagem 2.1.4.3**

```javascript
export const ADD_LUGAR = 'ADD_LUGAR';
export const addLugar = nomeLugar => {
  return {
    type: ADD_LUGAR, dadosLugar: { nomeLugar: nomeLugar }
  }
}
```

No componente principal da aplicação (arquivo `App.js`), ajuste os imports como na Listagem 2.1.4.4. A função `createStore` permite criar o estado centralizado inicial da aplicação. A função `combineReducers` permite mapear reducers a identificadores. A função `applyMiddleware` será utilizada para aplicarmos o Redux Thunk. Ele operará como um interceptador das ações. Quando uma ação for enviada (*dispatch*), ele a interceptará antes de ela chegar ao reducer destinatário. O componente `Provider` é o mecanismo que utilizaremos (como uma simples tag) para entregar o estado centralizado aos componentes que se interessam por ele.

**App.js · Listagem 2.1.4.4**

```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
```

Os elementos importados são utilizados como descrito na Listagem 2.1.4.5. O uso é feito fora da função que define o componente `App`. Ainda estamos no arquivo `App.js`.

**App.js · Listagem 2.1.4.5**

```javascript
//mapeamento o reducer ao identificador "lugares"
const rootReducer = combineReducers({
  lugares: lugaresReducer
});
//criando o estado centralizado
const store = createStore(rootReducer, applyMiddleware(reduxThunk));
```

<aside class="positive">

O `lugaresReducer` é o reducer exportado por padrão em `store/lugares-reducer.js`: importe-o no `App.js` com `import lugaresReducer from './store/lugares-reducer';`.

</aside>

Para entregar o estado aos componentes da aplicação, vamos definir o componente principal (o navegador) como filho de um `Provider`, o mecanismo utilizado para entregar o estado aos componentes. Ele tem um props chamado `store` com o qual associamos nosso objeto também chamado `store`. Veja a Listagem 2.1.4.6.

**App.js · Listagem 2.1.4.6**

```jsx
export default function App() {
  return (
    <Provider store={store}>
      <LugaresNavigator />
    </Provider>
  );
}
```

## Adicionando um novo lugar
Duration: 10:00

Na tela `NovoLugarTela`, vamos implementar a função `adicionarLugar`. Ela fará isso usando o Redux. Por isso, ela precisará enviar (*dispatch*) uma ação direcionada a um reducer. Para tal, ela fará uso do hook `useDispatch`.

Começamos importando o hook e chamando-o no corpo da função que define o componente (fora das funções internas, como `adicionarLugar`), como na Listagem 2.2.1.

**telas/NovoLugarTela.js · Listagem 2.2.1**

```jsx
import { useDispatch } from 'react-redux';

const dispatch = useDispatch ();
```

Também vamos importar os elementos definidos no arquivo de ações. Assim o componente poderá enviar a ação desejada. Ele faz isso na função `adicionarLugar`. Além de enviar a ação, ela faz com que a tela atual seja fechada, voltando à tela anterior. Veja a Listagem 2.2.2.

**telas/NovoLugarTela.js · Listagem 2.2.2**

```jsx
import * as lugaresActions from '../store/lugares-actions';

const adicionarLugar = () => {
  dispatch(lugaresActions.addLugar(novoLugar));
  props.navigation.goBack();
}
```

O reducer alvo, por sua vez, pode reagir adequadamente quando a ação de inserção de lugar for recebida. Ele verifica o identificador da ação recebida e decide o que fazer com uma estrutura de seleção. Veja a Listagem 2.2.3.

**store/lugares-reducer.js · Listagem 2.2.3**

```javascript
export default (estado = estadoInicial, action) => {
  switch (action.type) {
    case ADD_LUGAR:
    //lógica aqui
    default:
      return estado;
  }
}
```

No momento, os lugares possuem somente um nome. No futuro, porém, terão diversas outras propriedades. Por essa razão, iremos definir uma classe que descreve o que é um lugar. Crie uma pasta chamada `modelo` na raiz da aplicação e, dentro dela, um arquivo chamado `Lugar.js`. O código é dado na Listagem 2.2.4.

**modelo/Lugar.js · Listagem 2.2.4**

```javascript
class Lugar {
  constructor(id, titulo) {
    this.id = id;
    this.titulo = titulo;
  }
}

export default Lugar;
```

De volta ao arquivo `lugares-reducer.js`, completamos a lógica inicial de inserção de lugar. Construímos um objeto do tipo `Lugar` com a informação passada e, temporariamente, utilizamos a data atual do sistema como seu id. Ele é simplesmente concatenado à lista de lugares que pertence ao estado centralizado. Note que a inserção é completamente feita em memória volátil neste momento. Ao final, devolvemos o estado alterado. Veja a Listagem 2.2.5.

**store/lugares-reducer.js · Listagem 2.2.5**

```javascript
export default (estado = estadoInicial, action) => {
  switch (action.type) {
    case ADD_LUGAR:
      const l = new Lugar(new Date().toString(), action.dadosLugar.nomeLugar);
      return {
        lugares: estado.lugares.concat(l)
      };
    default:
      return estado;
  }
}
```

<aside class="negative">

**Correções em relação à apostila.** Nas listagens 2.2.3 e 2.2.5 impressas, o `switch` é feito sobre `action` (o correto, usado mais adiante na Listagem 2.5.16, é `action.type`) e o `default` devolve `state` em vez de `estado`; aqui já aparecem corrigidos. Lembre-se também de importar no reducer o identificador da ação e a classe: `import { ADD_LUGAR } from './lugares-actions';` e `import Lugar from '../modelo/Lugar';`. Hooks como `useDispatch` só podem ser chamados dentro do componente.

</aside>

## Exibindo a lista de lugares
Duration: 12:00

O estado da aplicação está centralizado e, conforme o usuário adiciona lugares, ele armazena uma lista deles. O componente que exibe a lista de lugares fará uso do estado centralizado para exibi-los. Ele faz uso de uma `FlatList`. A fim de escolher uma "fatia" do estado, ou seja, somente aquela parte que lhe interessa, ele fará uso do hook `useSelector`.

Veja os imports e a definição inicial da `FlatList` na Listagem 2.3.1. Estamos no arquivo `ListaDeLugaresTela.js`.

**telas/ListaDeLugaresTela.js · Listagem 2.3.1**

```jsx
import { View, StyleSheet, Text, Platform, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

const ListaDeLugaresTela = (props) => {
  return (
    <FlatList />
  )
};
```

A fatia do estado de interesse é a coleção de lugares. A Listagem 2.3.2 mostra como ela pode ser selecionada pelo componente. Repare na notação `estado.lugares.lugares`. Ela significa o seguinte: `estado` representa o estado completo da aplicação. O primeiro `lugares` é o identificador do reducer definido em `App.js`. Isso nos leva até a definição do reducer. O segundo `lugares` é o nome da fatia do estado definida no reducer. Por acaso eles são iguais.

**telas/ListaDeLugaresTela.js · Listagem 2.3.2**

```jsx
const ListaDeLugaresTela = (props) => {
  const lugares = useSelector(estado => estado.lugares.lugares);
  return (
    <FlatList />
  )
};
```

A seguir, podemos alimentar a `FlatList` com os dados recebidos, como feito na Listagem 2.3.3. Inicialmente, apenas exibimos os lugares textualmente.

**telas/ListaDeLugaresTela.js · Listagem 2.3.3**

```jsx
const ListaDeLugaresTela = (props) => {
  const lugares = useSelector(estado => estado.lugares.lugares);
  return (
    <FlatList
      data={lugares}
      keyExtractor={lugar => lugar.id}
      renderItem={lugar => <Text>{JSON.stringify(lugar)}</Text>}
    />
  )
};
```

### O componente LugarItem

Em breve, cada lugar terá mais propriedades, como um endereço e uma imagem. Por isso, criaremos um componente próprio para sua exibição. Na pasta `componentes`, clique com o direito e crie um arquivo chamado `LugarItem.js`. O componente exibirá a imagem lado a lado com as demais informações. Note que ele recebe o seguinte via props:

* `onSelect`: função a ser chamada quando for tocado
* `nomeLugar`: nome do lugar
* `endereco`: endereço do lugar
* `imagem`: o endereço da imagem do lugar

Além disso, aplicamos estilos cujas definições aparecem na Listagem 2.3.5. Veja a sua definição na Listagem 2.3.4.

**componentes/LugarItem.js · Listagem 2.3.4**

```jsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Cores from '../constantes/Cores';

const LugarItem = props => {
  return (
    <TouchableOpacity onPress={props.onSelect} style={styles.lugarItem}>
      <Image style={styles.imagem} source={{ uri: props.imagem }} />
      <View style={styles.infoContainer}>
        <Text style={styles.nomeLugar}>{props.nomeLugar}</Text>
        <Text style={styles.endereco}>{props.endereco}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LugarItem;
```

**componentes/LugarItem.js · Listagem 2.3.5**

```jsx
const styles = StyleSheet.create({
  lugarItem: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center'
  },
  imagem: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ccc',
    borderColor: Cores.primary,
    borderWidth: 1
  },
  infoContainer: {
    marginLeft: 25,
    width: 250,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  nomeLugar: {
    color: 'black',
    fontSize: 18,
    marginBottom: 5
  },
  endereco: {
    color: '#666',
    fontSize: 16
  }
});
```

A `FlatList` (no arquivo `ListaDeLugaresTela.js`) deve passar a utilizar esse componente. No momento, temos somente o nome do lugar. Também sabemos para qual tela ir quando um item for tocado: para a tela que exibe seus detalhes. Note que, na navegação, enviamos o nome e o id do lugar. Os demais valores serão especificados em breve. Veja a Listagem 2.3.6.

**telas/ListaDeLugaresTela.js · Listagem 2.3.6**

```jsx
import LugarItem from '../componentes/LugarItem';

<FlatList
  data={lugares}
  keyExtractor={lugar => lugar.id}
  renderItem={lugar =>
    <LugarItem
      nomeLugar={lugar.item.titulo}
      onSelect={() =>
        props.navigation.navigate('DetalheDoLugar', { tituloLugar: lugar.item.titulo, idLugar: lugar.item.id })}
      imagem={null}
      endereco={null}
    />
  }
/>
```

<aside class="positive">

Na apostila impressa, o id é enviado como `lugar.id`; dentro do `renderItem`, o lugar fica em `lugar.item`, por isso o correto é `lugar.item.id`.

</aside>

### Exibindo detalhes de um lugar

Quando um lugar é tocado na lista, a aplicação navega para a tela de exibição de detalhes, a qual passaremos a implementar agora.

No arquivo `DetalhesDoLugarTela.js`, comece ajustando o cabeçalho a fim de exibir o nome do lugar. Como feito anteriormente, a especificação da propriedade `navigationOptions` deve ser feita logo abaixo da função que define o componente, fora dela. Veja a Listagem 2.4.1.

**telas/DetalhesDoLugarTela.js · Listagem 2.4.1**

```javascript
DetalhesDoLugarTela.navigationOptions = (dadosNav) => {
  return {
    headerTitle: dadosNav.navigation.getParam('tituloLugar')
  }
};
```

## A câmera: o componente TiraFoto
Duration: 12:00

O Expo oferece diversos pacotes que simplificam a configuração necessária para acesso a recursos nativos do dispositivo. Veja a página a seguir.

[https://docs.expo.io/versions/latest/](https://docs.expo.io/versions/latest/)

Desejamos utilizar a câmera para permitir que o usuário tire fotos dos seus lugares preferidos. Poderíamos fazer isso usando o pacote `expo-camera`, porém ele é um tanto sofisticado e oferece acesso a diversas funcionalidades para manipulação explícita da câmera, o que não precisamos para esse aplicativo. Só desejamos tirar fotos, o que pode ser feito pela aplicação que lida com a câmera já instalada no dispositivo do usuário. Por isso, usaremos o pacote `expo-image-picker`.

Para instalar o Image Picker, use o comando

**Terminal**

```bash
expo install expo-image-picker
```

Para tirar as fotos, vamos criar um novo componente React. Clique com o direito na pasta `componentes` e crie um arquivo chamado `TiraFoto.js`. O conteúdo inicial do componente é dado na Listagem 2.5.1.

**componentes/TiraFoto.js · Listagem 2.5.1**

```jsx
import React from 'react';
import { View, Button, Image, Text, StyleSheet } from 'react-native';

const TiraFoto = props => {

};

const estilos = StyleSheet.create({
});

export default TiraFoto;
```

Inicialmente, a expressão JSX que descreve a tela do componente irá exibir um texto que indica que nenhuma foto foi tirada e um botão que permite acessar a câmera. Veja a Listagem 2.5.2.

**componentes/TiraFoto.js · Listagem 2.5.2**

```jsx
import Cores from '../constantes/Cores'

return (
  <View>
    <View><Text>Nenhuma foto.</Text></View>
    <Button
      title="Tirar foto"
      color={Cores.primary}
      onPress={() => {}}
    />
  </View>
)
```

A seguir, adicionamos um componente capaz de exibir uma imagem e estilizamos os componentes, como na Listagem 2.5.3.

**componentes/TiraFoto.js · Listagem 2.5.3**

```jsx
return (
  <View style={estilos.principal}>
    <View style={estilos.previewDaImagem}>
      <Text>Nenhuma foto.</Text>
      <Image style={estilos.imagem} />
    </View>
    <Button
      title="Tirar foto"
      color={Cores.primary}
      onPress={() => {}}
    />
  </View>
)
```

<aside class="positive">

Na apostila, o `onPress` desses dois botões aparece vazio (`onPress={}`), apenas como marcação de onde a função entrará; como `{}` vazio não é JSX válido, aqui usamos uma função vazia até a Listagem 2.5.5.

</aside>

Os objetos de estilo são aqueles da Listagem 2.5.4.

**componentes/TiraFoto.js · Listagem 2.5.4**

```jsx
const estilos = StyleSheet.create({
  principal: {
    alignItems: 'center',
    marginBottom: 15
  },
  previewDaImagem: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#CCC',
    borderWidth: 1
  },
  imagem: {
    width: '100%',
    height: '100%'
  }
});
```

Precisamos especificar uma função que será chamada quando o botão for tocado. Ela será responsável por abrir a aplicação de câmera do dispositivo. Sua definição e vínculo com o botão são dados na Listagem 2.5.5. A função `launchCameraAsync` irá abrir a câmera do dispositivo.

**componentes/TiraFoto.js · Listagem 2.5.5**

```jsx
import * as ImagePicker from 'expo-image-picker';

const tirarFoto = () => {
  ImagePicker.launchCameraAsync();
}

<Button
  title="Tirar foto"
  color={Cores.primary}
  onPress={tirarFoto}
/>
```

Para utilizar o componente recém-criado, vá até o arquivo `NovoLugarTela.js` e adicione-o à expressão JSX, como na Listagem 2.5.6.

**telas/NovoLugarTela.js · Listagem 2.5.6**

```jsx
import TiraFoto from '../componentes/TiraFoto';

return (
  <ScrollView>
    <View style={estilos.form}>
      <Text style={estilos.titulo}>Novo lugar</Text>
      <TextInput
        style={estilos.textInput}
        onChangeText={novoLugarAlterado}
        value={novoLugar}
      />
      <TiraFoto />
      <Button
        title="Salvar Lugar"
        color={Cores.primary}
        onPress={adicionarLugar}
      />
    </View>
  </ScrollView>
)
```

<aside class="positive">

**Nota:** Para dispositivos Android, o mecanismo de permissões em tempo de execução é tratado automaticamente pelo componente `ImagePicker`. Para dispositivos Apple, é necessário lidar explicitamente utilizando o pacote `expo-permissions`. Veja mais em [https://docs.expo.io/versions/v37.0.0/sdk/permissions/](https://docs.expo.io/versions/v37.0.0/sdk/permissions/).

</aside>

Execute a aplicação agora e veja que o botão de tirar foto já funciona.

## Guardando e exibindo a foto
Duration: 15:00

Podemos personalizar o funcionamento da aplicação câmera entregando para a função `launchCameraAsync` um objeto JSON. Veja o exemplo da Listagem 2.5.7. Lembre-se de voltar para o arquivo `TiraFoto.js`.

**componentes/TiraFoto.js · Listagem 2.5.7**

```javascript
ImagePicker.launchCameraAsync({
  allowsEditing: true,
  aspect: [16, 9],
  quality: 1
});
```

A função `launchCameraAsync`, como o nome sugere, opera de maneira assíncrona, não bloqueante. Ela devolve uma promessa cujo resultado é a foto tirada ou uma indicação de que ela não foi tirada. Desejamos aguardar pelo resultado na mesma linha em que ela é chamada, por isso vamos usar a primitiva `await` do JavaScript, bloqueando a execução da função até que o resultado esteja disponível. Ela só pode ser usada em uma função assíncrona, marcada com `async`. Exiba o resultado no console para ver as propriedades da imagem. Veja a Listagem 2.5.8.

**componentes/TiraFoto.js · Listagem 2.5.8**

```javascript
const tirarFoto = async () => {
  const foto = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [16, 9],
    quality: 1
  });
  console.log(foto);
}
```

Para colocar o URI da foto no estado do componente, vamos utilizar o hook `useState`. Feito esse armazenamento, podemos fazer com que o componente de exibição de imagem a exiba. Veja a Listagem 2.5.9.

**componentes/TiraFoto.js · Listagem 2.5.9**

```jsx
import React, { useState } from 'react';

const [imagemURI, setImagemURI] = useState();

const tirarFoto = async () => {
  const foto = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [16, 9],
    quality: 1
  });
  //console.log(foto);
  setImagemURI(foto.uri);
}

return (
  <View style={estilos.principal}>
    <View style={estilos.previewDaImagem}>
      <Text>Nenhuma foto.</Text>
      <Image
        style={estilos.imagem}
        source={{ uri: imagemURI }}
      />
    </View>
    <Button
      title="Tirar foto"
      color={Cores.primary}
      onPress={tirarFoto}
    />
  </View>
)
```

A expressão JSX ainda exibe o texto que informa que nenhuma foto foi tirada mesmo depois de a foto ter sido tirada. Precisamos decidir o que renderizar: o componente `Text`, caso ainda não exista foto, ou o componente `Image` quando já existir uma foto. Podemos usar uma expressão condicional para isso, como na Listagem 2.5.10.

**componentes/TiraFoto.js · Listagem 2.5.10**

```jsx
return (
  <View style={estilos.principal}>
    <View style={estilos.previewDaImagem}>
      {
        !imagemURI ?
          <Text>Nenhuma foto.</Text>
          :
          <Image
            style={estilos.imagem}
            source={{ uri: imagemURI }}
          />
      }
    </View>
    <Button
      title="Tirar foto"
      color={Cores.primary}
      onPress={tirarFoto}
    />
  </View>
)
```

O componente `NovoLugarTela` usa o componente `TiraFoto` e precisa de acesso à foto uma vez que ela tenha sido tirada. Por isso, ele enviará uma função (via props) que será chamada uma vez que a foto esteja pronta. No componente `TiraFoto`, faça o ajuste da Listagem 2.5.11.

**componentes/TiraFoto.js · Listagem 2.5.11**

```javascript
const tirarFoto = async () => {
  const foto = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [16, 9],
    quality: 1
  });
  //console.log(foto);
  setImagemURI(foto.uri);
  props.onFotoTirada(foto.uri);
}
```

No componente `NovoLugarTela`, precisamos enviar a função via props quando o `TiraFoto` é usado. Ela armazena a foto em uma variável do estado do componente. Veja a Listagem 2.5.12.

**telas/NovoLugarTela.js · Listagem 2.5.12**

```jsx
const [imagemURI, setImagemURI] = useState();

const fotoTirada = imagemURI => {
  setImagemURI(imagemURI);
}

return (
  <ScrollView>
    <View style={estilos.form}>
      <Text style={estilos.titulo}>Novo lugar</Text>
      <TextInput
        style={estilos.textInput}
        onChangeText={novoLugarAlterado}
        value={novoLugar}
      />
      <TiraFoto onFotoTirada={fotoTirada} />
      <Button
        title="Salvar Lugar"
        color={Cores.primary}
        onPress={adicionarLugar}
      />
    </View>
  </ScrollView>
)
```

## A foto no estado centralizado
Duration: 10:00

Uma vez que o botão para salvar o lugar tenha sido clicado, desejamos enviar a imagem para que o componente que lista os lugares tenha acesso a ela. Ela pode ser enviada como parâmetro do método `addLugar`, como na Listagem 2.5.13.

**telas/NovoLugarTela.js · Listagem 2.5.13**

```javascript
const adicionarLugar = () => {
  dispatch(lugaresActions.addLugar(novoLugar, imagemURI));
  props.navigation.goBack();
}
```

Isso requer um ajuste na função `addLugar`, que está definida no arquivo `lugares-actions.js`. Veja a Listagem 2.5.14.

**store/lugares-actions.js · Listagem 2.5.14**

```javascript
export const ADD_LUGAR = 'ADD_LUGAR';
export const addLugar = (nomeLugar, imagem) => {
  return {
    type: ADD_LUGAR, dadosLugar: { nomeLugar: nomeLugar, imagem: imagem }
  }
}
```

A classe que modela lugares precisa ser ajustada também, já que lugares agora possuem uma imagem. Veja a Listagem 2.5.15.

**modelo/Lugar.js · Listagem 2.5.15**

```javascript
class Lugar {
  constructor(id, titulo, imagemURI) {
    this.id = id;
    this.titulo = titulo;
    this.imagemURI = imagemURI;
  }
}

export default Lugar;
```

Lembre-se que no reducer construímos um objeto `Lugar` e adicionamos ao estado central da aplicação. Essa construção agora deve levar em conta o endereço da imagem. Faça o ajuste da Listagem 2.5.16 no arquivo `lugares-reducer.js`.

**store/lugares-reducer.js · Listagem 2.5.16**

```javascript
export default (estado = estadoInicial, action) => {
  switch (action.type) {
    case ADD_LUGAR:
      const l = new Lugar(new Date().toString(), action.dadosLugar.nomeLugar,
        action.dadosLugar.imagem);
      console.log(JSON.stringify(l))
      return {
        lugares: estado.lugares.concat(l)
      };
    default:
      console.log('aqui' + JSON.stringify(action))
      return estado;
  }
}
```

Agora a lista de lugares pode fazer uso da imagem existente no objeto lugar. Abra o arquivo `ListaDeLugaresTela.js` para passar o valor adequado como na Listagem 2.5.17.

**telas/ListaDeLugaresTela.js · Listagem 2.5.17**

```jsx
return (
  <FlatList
    data={lugares}
    keyExtractor={lugar => lugar.id}
    renderItem={lugar =>
      <LugarItem
        nomeLugar={lugar.item.titulo}
        onSelect={() =>
          props.navigation.navigate('DetalheDoLugar', { tituloLugar: lugar.item.titulo, idLugar: lugar.item.id })}
        imagem={lugar.item.imagemURI}
        endereco={null}
      />
    }
  />
)
```

## Encerramento
Duration: 3:00

A aplicação agora guarda os lugares no estado centralizado do Redux, exibe a lista de lugares com foto e permite tirar fotos com a câmera do dispositivo. As fotos, porém, ainda ficam em um diretório temporário e os lugares vivem apenas em memória.

### Próximos passos

* Na parte 3 (codelab `rn-recursos-nativos-parte-3`), a foto passa a ser gravada no sistema de arquivos e os lugares em uma base SQLite.

### Referências

* React: A JavaScript library for building user interfaces. 2020. Disponível em [https://reactjs.org/](https://reactjs.org/). Acesso em abril de 2020.
* React Native: A framework for building native apps using React. 2020. Disponível em [https://facebook.github.io/react-native/](https://facebook.github.io/react-native/). Acesso em abril de 2020.
