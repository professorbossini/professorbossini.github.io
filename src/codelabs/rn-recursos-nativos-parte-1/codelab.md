summary: Comece o app de lugares favoritos com React Native e Expo, configurando a navegação em pilha do React Navigation, botões no cabeçalho com ícones e a tela de cadastro de um novo lugar.
id: rn-recursos-nativos-parte-1
categories: React Native,Mobile
tags: react native,expo,react navigation,native stack,header buttons,vector icons,scrollview,usestate
status: Published
authors: Rodrigo Bossini
last updated: 2021-10-08
pdf: react_native/old/07_apostila_react_native_recursos_nativos.pdf
exercicios: react_native/old/07_exercicios_react_native_recursos_nativos.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Recursos nativos com React Native (parte 1): navegação e a tela de novo lugar

## Visão geral
Duration: 3:00

Neste material desenvolveremos uma aplicação que ilustra o uso de diversos recursos nativos, como a câmera, armazenamento local, GPS, além do uso de mapas. Nesta primeira parte, preparamos a estrutura da aplicação: as telas, a navegação entre elas e a tela de cadastro de um novo lugar.

### O que você vai aprender

* Organizar a aplicação em telas, componentes e constantes
* Configurar a navegação em pilha com `@react-navigation/native` e `@react-navigation/native-stack`
* Personalizar o cabeçalho das telas (cores e botões)
* Criar um botão de cabeçalho reutilizável com `react-navigation-header-buttons` e `@expo/vector-icons`
* Montar a tela de novo lugar com `ScrollView`, `TextInput` e estado

### O que você vai precisar

* Node.js e o Expo CLI (comando `expo`)
* VS Code
* Um celular com o Expo Go ou um emulador

## Criando o projeto e ajustes iniciais
Duration: 6:00

### Criando o projeto

Como sempre, o primeiro passo é criar um projeto em seu workspace. Depois, abra uma instância do VS Code vinculada ao diretório do projeto. Ao criar o projeto, escolha o template **Blank**. Coloque também o projeto em execução. Use os comandos a seguir.

**Terminal**

```bash
expo init nome_do_projeto
cd nome_do_projeto
code .
npm start
```

### Ajustes iniciais

Começamos com ajustes iniciais na aplicação. O conteúdo inicial de `App.js` é dado na Listagem 2.2.1.

**App.js · Listagem 2.2.1**

```jsx
import React from 'react';
import { View } from 'react-native';

export default function App() {
  return (
    <View>
    </View>
  );
}
```

Também criamos uma pasta para abrigar as cores que utilizaremos. Ela fica na raiz da aplicação e se chama `constantes`. Crie também um arquivo chamado `Cores.js` dentro dela e já adicione uma cor associada à chave `primary` (é só um nome, pode ser qualquer outro), como mostra a Listagem 2.2.2.

**constantes/Cores.js · Listagem 2.2.2**

```javascript
export default {
  primary: '#FC9208'
}
```

A seguir, na raiz do projeto, crie uma pasta chamada `telas` e os seguintes arquivos dentro dela. Cada um conterá a definição de uma tela da aplicação.

```text
MapaTela.js
NovoLugarTela.js
DetalhesDoLugarTela.js
ListaDeLugaresTela.js
```

## Navegação entre telas
Duration: 12:00

Utilizaremos pacotes específicos para a navegação entre telas. Eles podem ser instalados da seguinte forma.

<aside class="negative">

**Obs.:** Certifique-se de parar a execução do servidor (**CTRL+C** duplo no terminal). Muitas vezes o npm produz erros e deixa de instalar pacotes pelo fato de a aplicação estar em funcionamento. Depois da instalação, basta executar `npm start` para colocar a aplicação em funcionamento de novo.

</aside>

Comece instalando o pacote principal do React Native, próprio para navegação.

**Terminal**

```bash
npm install @react-navigation/native
```

A seguir, instale as seguintes dependências. Certifique-se de utilizar o expo para fazer a instalação. Ele se encarrega de fazer a instalação de pacotes de versões compatíveis.

**Terminal**

```bash
expo install react-native-screens react-native-safe-area-context
```

A navegação entre telas pode envolver uma **pilha**, semelhante àquela utilizada pelos navegadores em que as páginas visitadas são empilhadas e desempilhadas conforme o usuário navega e clica no botão voltar. Instale o pacote a seguir. Ele nos fornece a implementação de uma pilha assim.

**Terminal**

```bash
npm install @react-navigation/native-stack
```

Agora, vamos criar um arquivo em que a navegação de telas vai ser especificada. Para isso, crie uma pasta chamada `navegacao` e, dentro dela, crie um arquivo chamado `LugaresNavigator.js`. Seu conteúdo aparece na Listagem 2.3.1.

**navegacao/LugaresNavigator.js · Listagem 2.3.1**

```jsx
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetalhesDoLugarTela from '../telas/DetalhesDoLugarTela';
import ListaDeLugaresTela from '../telas/ListaDeLugaresTela';
import MapaTela from '../telas/MapaTela';
import NovoLugarTela from '../telas/NovoLugarTela';

const Stack = createNativeStackNavigator()

const container = (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="ListaDeLugares">
      <Stack.Screen name="DetalhesDoLugar" component={DetalhesDoLugarTela}/>
      <Stack.Screen name="ListaDeLugares" component={ListaDeLugaresTela}/>
      <Stack.Screen name="Mapa" component={MapaTela}/>
      <Stack.Screen name="NovoLugar" component={NovoLugarTela}/>
    </Stack.Navigator>
  </NavigationContainer>
)

export default container
```

Podemos configurar algumas opções do cabeçalho. Na Listagem 2.3.3 estamos definindo cor para o cabeçalho e a cor *tint*, que será usada pelo título e outras partes no cabeçalho.

**navegacao/LugaresNavigator.js · Listagem 2.3.3**

```jsx
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetalhesDoLugarTela from '../telas/DetalhesDoLugarTela';
import ListaDeLugaresTela from '../telas/ListaDeLugaresTela';
import MapaTela from '../telas/MapaTela';
import NovoLugarTela from '../telas/NovoLugarTela';
import Cores from '../constantes/Cores'

const Stack = createNativeStackNavigator()

const container = (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="ListaDeLugares"
      screenOptions={{
        headerStyle: {backgroundColor: Cores.primary},
        headerTintColor: 'white'
      }}>
      <Stack.Screen name="DetalhesDoLugar" component={DetalhesDoLugarTela}/>
      <Stack.Screen name="ListaDeLugares" component={ListaDeLugaresTela}/>
      <Stack.Screen name="Mapa" component={MapaTela}/>
      <Stack.Screen name="NovoLugar" component={NovoLugarTela}/>
    </Stack.Navigator>
  </NavigationContainer>
)

export default container
```

A forma como esse componente pode ser utilizado é exibida na Listagem 2.3.4. Nosso componente principal irá retorná-lo. Estamos no arquivo `App.js` agora.

**App.js · Listagem 2.3.4**

```jsx
import React from 'react';
import container from './navegacao/LugaresNavigator'

export default function App() {
  return container;
}
```

## Conteúdo inicial das telas
Duration: 6:00

Vamos definir o conteúdo inicial de cada uma das telas. Veja as listagens de 2.4.1 a 2.4.4. Evidentemente, cada tela será definida no seu próprio arquivo, aqueles que criamos anteriormente na pasta `telas`.

**telas/DetalhesDoLugarTela.js · Listagem 2.4.1**

```jsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const DetalhesDoLugarTela = (props) => {
  return (
    <View>
      <Text>Detalhes do lugar Tela</Text>
    </View>
  )
};

const estilos = StyleSheet.create({
});

export default DetalhesDoLugarTela;
```

**telas/ListaDeLugaresTela.js · Listagem 2.4.2**

```jsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const ListaDeLugaresTela = (props) => {
  return (
    <View>
      <Text>Lista de Lugares</Text>
    </View>
  )
};

const estilos = StyleSheet.create({
});

export default ListaDeLugaresTela;
```

**telas/MapaTela.js · Listagem 2.4.3**

```jsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const MapaTela = (props) => {
  return (
    <View>
      <Text>MapaTela</Text>
    </View>
  )
};

const estilos = StyleSheet.create({
});

export default MapaTela;
```

**telas/NovoLugarTela.js · Listagem 2.4.4**

```jsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const NovoLugarTela = (props) => {
  return (
    <View>
      <Text>Novo Lugar Tela</Text>
    </View>
  )
};

const estilos = StyleSheet.create({
});

export default NovoLugarTela;
```

## Botão no cabeçalho da lista de lugares
Duration: 12:00

Podemos alterar algumas características da barra de título de cada tela, trocando o título, exibindo botões etc.

Vamos trocar o título e adicionar um botão que permite ir até a tela de adição de lugares. Para adicionar o botão, precisamos instalar dois novos pacotes, veja:

**Terminal**

```bash
npm install --save react-navigation-header-buttons
npm install --save @expo/vector-icons
```

O botão será um componente reutilizável entre as diversas telas. Por isso, vamos criar um componente específico para ele. Comece criando uma pasta chamada `componentes`. A seguir, crie um arquivo chamado `BotaoCabecalho.js`. O seu conteúdo é dado na Listagem 2.5.1.

**componentes/BotaoCabecalho.js · Listagem 2.5.1**

```jsx
import React from 'react'
import { HeaderButton } from 'react-navigation-header-buttons'
import { Ionicons } from '@expo/vector-icons';

const BotaoCabecalho = (props) => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={23}
      color={'black'}
    />
  );
};

export default BotaoCabecalho;
```

A seguir, como mostra a Listagem 2.5.2, aplicamos o novo botão. Estamos no arquivo `LugaresNavigator.js`.

**navegacao/LugaresNavigator.js · Listagem 2.5.2**

```jsx
import React from 'react'
import { Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetalhesDoLugarTela from '../telas/DetalhesDoLugarTela';
import ListaDeLugaresTela from '../telas/ListaDeLugaresTela';
import MapaTela from '../telas/MapaTela';
import NovoLugarTela from '../telas/NovoLugarTela';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Cores from '../constantes/Cores'
import BotaoCabecalho from '../componentes/BotaoCabecalho';

const Stack = createNativeStackNavigator()

const container = (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="ListaDeLugares"
      screenOptions={{
        headerStyle: {backgroundColor: Cores.primary},
        headerTintColor: 'white'
      }}>
      <Stack.Screen name="DetalhesDoLugar" component={DetalhesDoLugarTela}/>
      <Stack.Screen
        name="ListaDeLugares"
        component={ListaDeLugaresTela}
        options={(props) => ({
          headerRight: () => <HeaderButtons
            HeaderButtonComponent={BotaoCabecalho}>
            <Item
              title="Adicionar"
              iconName='md-add'
              onPress={() =>{
                console.log ("Chamou")
                props.navigation.navigate('NovoLugar')
              }}
            />
          </HeaderButtons>
        })}
      />
      <Stack.Screen name="Mapa" component={MapaTela}/>
      <Stack.Screen name="NovoLugar" component={NovoLugarTela}/>
    </Stack.Navigator>
  </NavigationContainer>
)

export default container
```

<aside class="positive">

**Obs.:** `NovoLugar` é o identificador associado à tela `NovoLugarTela`, especificado no objeto de rotas.

</aside>

## A tela NovoLugarTela
Duration: 15:00

A tela `NovoLugarTela` permitirá que o usuário armazene novos lugares. Ela possui uma `ScrollView` que engloba os campos necessários para que o usuário possa fazer a inserção do nome do novo lugar e do botão que, quando clicado, irá armazenar o lugar. Veja a Listagem 2.6.1. Estamos no arquivo `NovoLugarTela.js`.

**telas/NovoLugarTela.js · Listagem 2.6.1**

```jsx
import React from 'react';
import Cores from '../constantes/Cores'
import {Button, View, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

const NovoLugarTela = (props) => {
  return (
    <ScrollView>
      <View>
        <Text>Novo lugar</Text>
        <TextInput />
        <Button
          title="Salvar Lugar"
          color={Cores.primary}
          onPress={() => { }}
        />
      </View>
    </ScrollView>
  )
};

export default NovoLugarTela;
```

A Listagem 2.6.2 define alguns objetos de estilo a serem aplicados nos componentes da tela `NovoLugarTela`.

**telas/NovoLugarTela.js · Listagem 2.6.2**

```jsx
import React from 'react';
import Cores from '../constantes/Cores'
import {Button, View, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

const NovoLugarTela = (props) => {
  return (
    <ScrollView>
      <View style={estilos.form}>
        <Text style={estilos.titulo}>Novo lugar</Text>
        <TextInput style={estilos.textInput}/>
        <Button
          title="Salvar Lugar"
          color={Cores.primary}
          onPress={() => { }}
        />
      </View>
    </ScrollView>
  )
};

const estilos = StyleSheet.create({
  form: {
    margin: 30
  },
  titulo: {
    fontSize: 18,
    marginBottom: 15
  },
  textInput: {
    borderBottomColor: '#DDD',
    borderBottomWidth: 2,
    marginBottom: 15,
    paddingVertical: 4
  }});

export default NovoLugarTela;
```

Vamos adicionar uma variável ao estado do componente para armazenar o novo lugar digitado, e vinculá-la ao campo de entrada, como na Listagem 2.6.3.

**telas/NovoLugarTela.js · Listagem 2.6.3**

```jsx
import React, { useState } from 'react';
import Cores from '../constantes/Cores'
import {Button, View, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

const NovoLugarTela = (props) => {
  const [novoLugar, setNovoLugar] = useState('');
  const novoLugarAlterado = (texto) => {
    setNovoLugar(texto);
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
        <Button
          title="Salvar Lugar"
          color={Cores.primary}
          onPress={() => { }}
        />
      </View>
    </ScrollView>
  )
};

const estilos = StyleSheet.create({
  form: {
    margin: 30
  },
  titulo: {
    fontSize: 18,
    marginBottom: 15
  },
  textInput: {
    borderBottomColor: '#DDD',
    borderBottomWidth: 2,
    marginBottom: 15,
    paddingVertical: 4
  }});

export default NovoLugarTela;
```

<aside class="positive">

Como o componente passa a usar `useState`, importe-o de `'react'`: `import React, { useState } from 'react';`.

</aside>

A seguir, como na Listagem 2.6.4, definimos uma função e a vinculamos ao evento `onPress` do botão. Ela será implementada em breve.

**telas/NovoLugarTela.js · Listagem 2.6.4**

```jsx
import React, { useState } from 'react';
import Cores from '../constantes/Cores'
import {Button, View, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

const NovoLugarTela = (props) => {
  const [novoLugar, setNovoLugar] = useState('');
  const novoLugarAlterado = (texto) => {
    setNovoLugar(texto);
  }
  const adicionarLugar = () => {
    console.log ("Adicionando...")
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
        <Button
          title="Salvar Lugar"
          color={Cores.primary}
          onPress={adicionarLugar}
        />
      </View>
    </ScrollView>
  )
};

const estilos = StyleSheet.create({
  form: {
    margin: 30
  },
  titulo: {
    fontSize: 18,
    marginBottom: 15
  },
  textInput: {
    borderBottomColor: '#DDD',
    borderBottomWidth: 2,
    marginBottom: 15,
    paddingVertical: 4
  }});

export default NovoLugarTela;
```

## Exercícios
Duration: 20:00

1. Utilize a sua aplicação de cadastro de contatos para esse exercício.

   1.1 Permita que o usuário cadastre novos contatos utilizando uma nova tela. Ela deve ser acionada por meio do mecanismo de navegação visto em aula.

### Próximos passos

* A aplicação continua no codelab `rn-recursos-nativos-parte-2` (Redux e câmera).

### Referências

* React: A JavaScript library for building user interfaces. 2020. Disponível em [https://reactjs.org/](https://reactjs.org/). Acesso em abril de 2020.
* React Native: A framework for building native apps using React. 2020. Disponível em [https://facebook.github.io/react-native/](https://facebook.github.io/react-native/). Acesso em abril de 2020.
* React Navigation. 2021. Disponível em [https://reactnavigation.org](https://reactnavigation.org). Acesso em outubro de 2021.
