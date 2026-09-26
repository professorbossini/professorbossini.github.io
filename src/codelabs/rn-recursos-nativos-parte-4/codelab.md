summary: Obtenha a localização do usuário com expo-location, peça permissões em tempo de execução e exiba um mapa com a Maps Static API do Google no app de lugares em React Native.
id: rn-recursos-nativos-parte-4
categories: React Native,Mobile
tags: react native,expo,expo-location,expo-permissions,gps,google maps,maps static api,activityindicator
status: Published
authors: Rodrigo Bossini
last updated: 2021-02-22
pdf: react_native/old/11_react_native_recursos_nativos_apostila.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Recursos nativos com React Native (parte 4): localização e mapas

## Visão geral
Duration: 3:00

Neste material prosseguimos com o desenvolvimento da aplicação que ilustra o uso de diversos recursos nativos, como mecanismos de localização, bases de dados SQLite etc. Ele é a continuação do codelab `rn-recursos-nativos-parte-3`: a aplicação passa a obter a localização atual do usuário e a exibi-la em um mapa.

### O que você vai aprender

* Obter a localização do dispositivo com `expo-location`
* Pedir permissões em tempo de execução com `expo-permissions`
* Mostrar um indicador de carregamento com `ActivityIndicator`
* Criar um projeto na nuvem do Google, habilitar APIs e gerar uma chave
* Exibir um mapa com a Maps Static API, guardando a chave fora do repositório

### O que você vai precisar

* O projeto da parte 3
* Um celular com o Expo Go (com localização ativada)
* Uma conta Google (a criação do projeto na nuvem pede um cartão de crédito)

## O componente CapturaLocalizacao
Duration: 10:00

A aplicação permitirá que o usuário utilize a sua localização atual para armazenar os lugares de interesse na base.

Usaremos o pacote `expo-location`. Ele pode ser instalado com o seguinte comando

**Terminal**

```bash
expo install expo-location
```

A aplicação terá um componente responsável pelo uso dos mecanismos de localização do dispositivo, de maneira análoga ao componente que lida com a câmera. Clique com o direito na pasta `componentes` e crie um arquivo chamado `CapturaLocalizacao.js`. Seu conteúdo inicial é a estrutura básica de um componente React definido com uma arrow function. Veja a Listagem 2.1.1.

**componentes/CapturaLocalizacao.js · Listagem 2.1.1**

```jsx
import React from 'react';
//um ActivityIndicator serve para mostrar um símbolo "carregando" na tela
//para o usuário saber que algo está por terminar
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';

const CapturaLocalizacao = (props) => {
  return <View />;
}

const estilos = StyleSheet.create({
});

export default CapturaLocalizacao;
```

Vamos desenvolver a expressão JSX do componente pouco a pouco. Primeiro, definimos um campo textual que informará que ainda não há nenhuma localização a ser exibida e, abaixo dele, um botão que poderá ser clicado para a captura de uma localização. Definimos também uma função que será chamada quando o botão for clicado, cujo corpo ainda está vazio. Veja a Listagem 2.2.2.

**componentes/CapturaLocalizacao.js · Listagem 2.2.2**

```jsx
import Cores from '../constantes/Cores'

const CapturaLocalizacao = (props) => {
  const capturarLocalizacao = () => {
  };
  return (
    <View>
      <View>
        <Text>Nenhuma localização disponível.</Text>
      </View>
      <Button
        title="Obter localização"
        color={Cores.primary}
        onPress={capturarLocalizacao}
      />
    </View>
  );
}
```

A Listagem 2.2.3 mostra os objetos de estilo aplicados aos componentes da tela.

**componentes/CapturaLocalizacao.js · Listagem 2.2.3**

```jsx
<View style={estilos.capturaLocalizacao}>
  <View style={estilos.previewDoMapa}>
    <Text>Nenhuma localização disponível.</Text>
  </View>
  <Button
    title="Obter localização"
    color={Cores.primary}
    onPress={capturarLocalizacao}
  />
</View>

const estilos = StyleSheet.create({
  capturaLocalizacao: {
    marginBottom: 15
  },
  previewDoMapa: {
    marginBottom: 10,
    width: '100%',
    height: 150,
    borderColor: '#DDD',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
```

O novo componente será utilizado pelo componente chamado `NovoLugarTela`. Por isso, abra o arquivo `NovoLugarTela.js` e ajuste seu conteúdo como na Listagem 2.2.4. Veja que o componente que obtém a localização do usuário está sendo utilizado logo abaixo do componente que captura fotos.

**telas/NovoLugarTela.js · Listagem 2.2.4**

```jsx
import CapturaLocalizacao from '../componentes/CapturaLocalizacao';

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
      <CapturaLocalizacao />
      <Button
        title="Salvar Lugar"
        color={Cores.primary}
        onPress={adicionarLugar}
      />
    </View>
  </ScrollView>
)
```

## Permissões e a localização atual
Duration: 15:00

De volta ao componente `CapturaLocalizacao`, passamos a utilizar o pacote `expo-location` para extrair a localização do usuário. Para lidar com o mecanismo de localização, precisaremos pedir explicitamente a permissão do usuário em tempo de execução. Para isso, vamos instalar o pacote de permissões com o comando

**Terminal**

```bash
expo install expo-permissions
```

A seguir, vamos importar o conteúdo dos dois pacotes, como na Listagem 2.2.5. Estamos no arquivo `CapturaLocalizacao.js`.

**componentes/CapturaLocalizacao.js · Listagem 2.2.5**

```javascript
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
```

Para pedir permissões explicitamente, defina a função da Listagem 2.2.6.

**componentes/CapturaLocalizacao.js · Listagem 2.2.6**

```javascript
const verificarPermissoes = async () => {
  const resultado = await Permissions.askAsync(Permissions.LOCATION);
  if (resultado.status !== "granted") {
    Alert.alert(
      'Sem permissão para uso do mecanismo de localização',
      "É preciso liberar acesso ao mecanismo de localização",
      [{ text: "Ok" }]
    )
    return false;
  }
  return true;
}
```

A função `verificarPermissoes` será usada pela função `capturarLocalizacao`, cujo corpo já definimos. Ela passará a operar de maneira bloqueante com as primitivas `async`/`await`, para que possamos aguardar a resposta do usuário antes de tentar utilizar o mecanismo de localização do dispositivo. Veja a Listagem 2.2.7.

**componentes/CapturaLocalizacao.js · Listagem 2.2.7**

```javascript
const capturarLocalizacao = async () => {
  const temPermissao = await verificarPermissoes();
  if (temPermissao){
  }
};
```

A função `getCurrentPositionAsync` obtém a localização atual do usuário. Ela opera de maneira assíncrona, como o nome sugere. Além disso, recebe um objeto JSON que pode ser utilizado para configurar o funcionamento da obtenção de localização. Uma possibilidade é adicionar um `timeout` que, quando expirado, faz com que a promessa seja rejeitada. Outra opção se chama `accuracy`. Com ela podemos especificar qual o nível de precisão desejado. Quanto mais alto, maior o consumo de bateria. Se for configurado um nível baixo de precisão, possivelmente o dispositivo deixará de utilizar o hardware de GPS (e utilizará somente a rede GSM, por exemplo) poupando bateria e dando origem a localizações que podem ser um tanto distantes das reais, talvez com erros de até alguns quilômetros. Veja a Listagem 2.2.8. Até então, somente exibimos a localização capturada no log. A saída deve ser parecida com o que exibe a Figura 2.2.1.

**componentes/CapturaLocalizacao.js · Listagem 2.2.8**

```javascript
const capturarLocalizacao = async () => {
  const temPermissao = await verificarPermissoes();
  if (temPermissao) {
    try {
      const localizacao = await Location.getCurrentPositionAsync({ timeout: 8000 });
    }
    catch (err) {
      Alert.alert(
        "Impossível obter localização",
        "Tente novamente mais tarde ou escolha uma no mapa",
        [{ text: "Ok" }]
      );
    }
  }
};
```

**Log · Figura 2.2.1**

```text
Object {
  "coords": Object {
    "accuracy": 41.38100051879883,
    "altitude": 818.199951171875,
    "heading": 0,
    "latitude": -23.5515733,
    "longitude": -46.5884295,
    "speed": 0,
  },
  "mocked": false,
  "timestamp": 1590086542690,
}
```

## Indicador de carregamento e a localização no estado
Duration: 12:00

Para utilizar o `ActivityIndicator` (ou seja, o feedback visual de que algo está acontecendo e irá terminar logo) vamos declarar uma nova variável que fará parte do estado local do componente. Ela armazenará um valor booleano que indica se a captura da localização está acontecendo ou não. Inicialmente, o usuário ainda não clicou no botão, portanto seu valor padrão é `false`. Quando o usuário clicar no botão, seu valor passa a ser `true` (o que fará com que o `ActivityIndicator` seja exibido) e, assim que a captura da localização terminar, ela passará a ser `false` novamente (o que fará com que o `ActivityIndicator` desapareça). Defina o par variável/função como mostra a Listagem 2.2.9.

**componentes/CapturaLocalizacao.js · Listagem 2.2.9**

```jsx
import React, { useState } from 'react';

const [estaCapturando, setEstaCapturando] = useState(false);
```

Altere o valor da variável como descrito e como exibe a Listagem 2.2.10.

**componentes/CapturaLocalizacao.js · Listagem 2.2.10**

```javascript
const capturarLocalizacao = async () => {
  const temPermissao = await verificarPermissoes();
  if (temPermissao) {
    setEstaCapturando(true);
    try {
      const localizacao = await Location.getCurrentPositionAsync({ timeout: 8000 });
      console.log(localizacao);
    }
    catch (err) {
      Alert.alert(
        "Impossível obter localização",
        "Tente novamente mais tarde ou escolha uma no mapa",
        [{ text: "Ok" }]
      );
    }
    setEstaCapturando(false);
  }
};
```

A exibição do `ActivityIndicator` é condicional. Ela é dada em função da variável `estaCapturando`. Quando ela for `true`, ele é exibido. Quando ela for `false`, o texto é exibido. Para tomar a decisão sobre qual componente exibir, vamos usar uma expressão condicional. No futuro, lidaremos também com o mapa. Veja a Listagem 2.2.11.

**componentes/CapturaLocalizacao.js · Listagem 2.2.11**

```jsx
return (
  <View style={estilos.capturaLocalizacao}>
    <View style={estilos.previewDoMapa}>
      {
        estaCapturando ?
          <ActivityIndicator
            size="large"
            color={Cores.primary}
          /> :
          <Text>Nenhuma localização disponível.</Text>
      }
    </View>
    <Button
      title="Obter localização"
      color={Cores.primary}
      onPress={capturarLocalizacao}
    />
  </View>
);
```

Vamos guardar o objeto localização em uma variável do estado local do componente para que ela possa ser usada posteriormente. Defina o par variável/função como a seguir.

**componentes/CapturaLocalizacao.js**

```javascript
const [localizacaoSelecionada, setLocalizacaoSelecionada] = useState();
```

A seguir, guarde um objeto que tem como propriedades somente a latitude e longitude da localização capturada. Estude a estrutura do objeto na Figura 2.2.1 e descubra que essas informações podem ser obtidas em `localizacao.coords.latitude` e `localizacao.coords.longitude`. Veja a Listagem 2.2.12.

**componentes/CapturaLocalizacao.js · Listagem 2.2.12**

```javascript
const capturarLocalizacao = async () => {
  const temPermissao = await verificarPermissoes();
  if (temPermissao) {
    setEstaCapturando(true);
    try {
      const localizacao = await Location.getCurrentPositionAsync({ timeout: 8000 });
      //console.log(localizacao);
      setLocalizacaoSelecionada({
        lat: localizacao.coords.latitude,
        lng: localizacao.coords.longitude
      });
    }
    catch (err) {
      Alert.alert(
        "Impossível obter localização",
        "Tente novamente mais tarde ou escolha uma no mapa",
        [{ text: "Ok" }]
      );
    }
    setEstaCapturando(false);
  }
};
```

## Um projeto na nuvem do Google
Duration: 12:00

Com a localização do usuário em mãos, podemos exibir um mapa que exiba onde ele está. Há diferentes formas de se exibir um "Google Map" em uma aplicação que usa JavaScript, como veremos.

Talvez a forma mais simples de se exibir um mapa seja por meio da API estática que o Google oferece. Veja a sua documentação no link a seguir.

[https://developers.google.com/maps/documentation/maps-static/intro](https://developers.google.com/maps/documentation/maps-static/intro)

Note que a documentação descreve a necessidade de criarmos um **projeto** na nuvem do Google. Um projeto nada mais é do que um agrupamento de configurações em que indicamos aspectos como:

* Quais APIs (Maps, Places, Youtube, Google Drive, Machine Learning, Vision etc.) estão habilitadas.
* Quais aplicações podem se conectar e usar as APIs habilitadas nesse projeto.
* Um cartão de crédito que pode ser usado para o pagamento caso a quota gratuita seja ultrapassada.

<aside class="negative">

Para criar um projeto, iremos precisar de um cartão de crédito. As cobranças somente ocorrerão caso a quota gratuita seja ultrapassada, o que certamente não acontecerá enquanto fazemos pequenos testes e poucas requisições diárias.

</aside>

Para criar um projeto, clique em **YOUR_API_KEY** na página da documentação, como mostra a Figura 2.3.1.

![Página Overview da documentação da Maps Static API com um exemplo de URL e o trecho YOUR_API_KEY destacado em vermelho, acima de um mapa de Nova York com marcadores](img/fig-2-3-1.webp)

*Figura 2.3.1: O link YOUR_API_KEY na documentação.*

Você pode escolher um projeto que eventualmente já possua na nuvem do Google ou criar um novo. Clique em **Developers Console** para criar um novo.

No console, é possível que você veja informações sobre algum projeto que já possui ou veja somente um botão para criar um novo projeto, caso ainda não tenha nenhum. Vamos criar um novo clicando em **Dashboard**, no nome do projeto selecionado (caso já exista um) e, então, em **New Project**. Veja a Figura 2.3.2.

![Console de APIs do Google com o seletor de projeto aberto na janela "Select a project" e o botão New Project destacado, além dos itens Dashboard e do nome do projeto destacados](img/fig-2-3-2.webp)

*Figura 2.3.2: Criando um novo projeto no console.*

* Na tela a seguir, escolha um nome qualquer para o projeto e clique em **create**.
* A seguir, clique em **Enable APIs and Services**. Você precisa habilitar as seguintes:
  * **Maps Static API**
  * **Places API**
* Após habilitar ambas, visite a página a seguir, que permitirá a criação da chave de acesso ao projeto.

[https://console.developers.google.com/apis/credentials](https://console.developers.google.com/apis/credentials)

Clique em **Credentials** e então, **Create Credentials**, como na Figura 2.3.3.

![Página Credentials do console de APIs com o item Credentials do menu lateral e o botão Create Credentials destacados em vermelho](img/fig-2-3-3.webp)

*Figura 2.3.3: Criando uma credencial.*

Escolha **API Key** e crie a sua chave. Copie a chave e guarde em um bloco de notas.

## O componente PreviewDoMapa
Duration: 15:00

Para exibir o mapa, vamos criar um novo componente. Para isso, clique com o direito na pasta `componentes` e crie um arquivo chamado `PreviewDoMapa.js`. O componente possui uma única imagem para a exibição do mapa. Usaremos a URL disponível na documentação da Maps Static API. Veja a definição do componente na Listagem 2.3.1.

**componentes/PreviewDoMapa.js · Listagem 2.3.1**

```jsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const PreviewDoMapa = (props) => { };

const estilos = StyleSheet.create({
});

export default PreviewDoMapa;
```

Declare uma variável para armazenar a URL, como na Listagem 2.3.2. Use a notação com crase para permitir a inserção de conteúdo na String.

**componentes/PreviewDoMapa.js · Listagem 2.3.2**

```jsx
const PreviewDoMapa = (props) => {
  const mapaURL = 'https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=YOUR_API_KEY';
};

const estilos = StyleSheet.create({
});

export default PreviewDoMapa;
```

Note que, por padrão, o mapa está centralizado em Nova York. Vamos substituir esse valor para algo que será entregue ao componente via props. Veja a Listagem 2.3.3.

**componentes/PreviewDoMapa.js · Listagem 2.3.3**

```javascript
const mapaURL = `https://maps.googleapis.com/maps/api/staticmap?center=${props.localizacao.lat},${props.localizacao.lng}&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=YOUR_API_KEY`;
```

Altere também o zoom para 14 e as medidas da imagem para 400x200 como na Listagem 2.3.4.

**componentes/PreviewDoMapa.js · Listagem 2.3.4**

```javascript
const mapaURL = `https://maps.googleapis.com/maps/api/staticmap?center=${props.localizacao.lat},${props.localizacao.lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=YOUR_API_KEY`;
```

Perceba que há diversos **markers** no mapa. Cada um deles é um ponto marcado no mapa. Remova todos eles exceto o último, para que ele sirva de modelo para que possamos colocar a localização do usuário. Veja a Listagem 2.3.5.

**componentes/PreviewDoMapa.js · Listagem 2.3.5**

```javascript
const mapaURL = `https://maps.googleapis.com/maps/api/staticmap?center=${props.localizacao.lat},${props.localizacao.lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=YOUR_API_KEY`;
```

Altere as coordenadas do marker para os valores que chegam via props, como na Listagem 2.3.6.

**componentes/PreviewDoMapa.js · Listagem 2.3.6**

```javascript
const mapaURL = `https://maps.googleapis.com/maps/api/staticmap?center=${props.localizacao.lat},${props.localizacao.lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:C%7C${props.localizacao.lat},${props.localizacao.lng}&key=YOUR_API_KEY`;
```

### Guardando a chave fora do repositório

Finalmente, precisamos substituir o texto `YOUR_API_KEY` com a chave gerada no console. Para isso, iremos criar um arquivo separado para armazená-la. Inclusive, já tomaremos o cuidado de incluí-lo no arquivo `.gitignore`, para que ele não seja enviado para o repositório (o que é fundamental se você está usando um repositório público). Crie um arquivo chamado `env.js` na raiz do projeto. Seu conteúdo é um objeto JSON com a chave. Veja a Listagem 2.3.7.

**env.js · Listagem 2.3.7**

```javascript
const ENV = {
  apiKey: 'coloque a sua chave aqui'
}

export default ENV;
```

Abra o arquivo `.gitignore` e adicione o arquivo `env.js` como na Listagem 2.3.8.

**.gitignore · Listagem 2.3.8**

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

A seguir, podemos importar o objeto do arquivo `env.js` no componente `PreviewDoMapa` e colocar a chave na URL. Veja a Listagem 2.3.9.

**componentes/PreviewDoMapa.js · Listagem 2.3.9**

```javascript
import ENV from '../env';

const mapaURL = `https://maps.googleapis.com/maps/api/staticmap?center=${props.localizacao.lat},${props.localizacao.lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:C%7C${props.localizacao.lat},${props.localizacao.lng}&key=${ENV.apiKey}`;
```

## Exibindo o mapa
Duration: 12:00

A expressão JSX do componente `PreviewDoMapa` irá operar como um container que somente exibe seus filhos, por meio da propriedade `children`. Veja a Listagem 2.3.10.

**componentes/PreviewDoMapa.js · Listagem 2.3.10**

```jsx
const PreviewDoMapa = (props) => {
  const mapaURL = `https://maps.googleapis.com/maps/api/staticmap?center=${props.localizacao.lat},${props.localizacao.lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:C%7C${props.localizacao.lat},${props.localizacao.lng}&key=${ENV.apiKey}`;
  return (
    <View style={estilos.previewDoMapa}>
      {props.children}
    </View>
  )
};
```

Isso ocorre pois o mapa somente será exibido caso exista uma localização já disponível. O conteúdo de `children` vai ser exibido de maneira condicional. Para decidir o que exibir, vamos declarar a URL como uma variável e atribuir a ela o valor desejado somente no caso em que a localização entregue via props já existir. Veja a Listagem 2.3.11.

**componentes/PreviewDoMapa.js · Listagem 2.3.11**

```jsx
const PreviewDoMapa = (props) => {
  let mapaURL;
  if (props.localizacao){
    mapaURL = `https://maps.googleapis.com/maps/api/staticmap?center=${props.localizacao.lat},${props.localizacao.lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:C%7C${props.localizacao.lat},${props.localizacao.lng}&key=${ENV.apiKey}`;
  }
  return (
    <View style={estilos.previewDoMapa}>
      {props.children}
    </View>
  )
};
```

Assim, podemos usar uma expressão condicional para decidir entre exibir um mapa ou os filhos entregues via props. Veja a Listagem 2.3.12.

**componentes/PreviewDoMapa.js · Listagem 2.3.12**

```jsx
return (
  <View style={estilos.previewDoMapa}>
    {
      props.localizacao ?
        <Image
          style={estilos.mapaImagem}
          source={{uri: mapaURL}} /> :
        props.children
    }
  </View>
)
```

O componente `PreviewDoMapa` é usado pelo componente `CapturaLocalizacao`. Ele irá substituir uma de suas Views. Veja a Listagem 2.3.13.

**componentes/CapturaLocalizacao.js · Listagem 2.3.13**

```jsx
import PreviewDoMapa from './PreviewDoMapa'

return (
  <View style={estilos.capturaLocalizacao}>
    <PreviewDoMapa style={estilos.previewDoMapa}>
      {
        estaCapturando ?
          <ActivityIndicator
            size="large"
            color={Cores.primary}
          /> :
          <Text>Nenhuma localização disponível.</Text>
      }
    </PreviewDoMapa>
    <Button
      title="Obter localização"
      color={Cores.primary}
      onPress={capturarLocalizacao}
    />
  </View>
);
```

No arquivo `PreviewDoMapa.js`, iremos mesclar os estilos passados via props com aqueles definidos pelo próprio componente. Veja a Listagem 2.3.14.

**componentes/PreviewDoMapa.js · Listagem 2.3.14**

```jsx
return (
  <View style={{ ...estilos.previewDoMapa, ...props.style }}>
    {
      props.localizacao ?
        <Image
          style={estilos.mapaImagem}
          source={{uri: mapaURL}} /> :
        props.children
    }
  </View >
)
```

Ainda no arquivo `PreviewDoMapa.js`, definimos os objetos de estilo usados pelo componente, como na Listagem 2.3.15.

**componentes/PreviewDoMapa.js · Listagem 2.3.15**

```jsx
const estilos = StyleSheet.create({
  previewDoMapa: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  mapaImagem: {
    width: '100%',
    height: '100%'
  }
});
```

O componente `CapturaLocalizacao` precisa entregar a localização capturada ao componente `PreviewDoMapa`. Ele faz isso, claro, via props. Veja a Listagem 2.3.16.

**componentes/CapturaLocalizacao.js · Listagem 2.3.16**

```jsx
return (
  <View style={estilos.capturaLocalizacao}>
    <PreviewDoMapa
      style={estilos.previewDoMapa}
      localizacao={localizacaoSelecionada}>
      {
        estaCapturando ?
          <ActivityIndicator
            size="large"
            color={Cores.primary}
          /> :
          <Text>Nenhuma localização disponível.</Text>
      }
    </PreviewDoMapa>
    <Button
      title="Obter localização"
      color={Cores.primary}
      onPress={capturarLocalizacao}
    />
  </View>
);
```

<aside class="negative">

**Correções em relação à apostila.** Nas listagens impressas: 2.3.10 e 2.3.11 escrevem `props.children` sem chaves (o React exibiria o texto literal); 2.3.12 usa `style={mapaImagem}` e `source={uri: mapaURL}` (corrigidos na própria apostila na 2.3.14); e 2.3.13 e 2.3.16 fecham a `View` externa com `</PreviewDoMapa>`. Aqui essas listagens já aparecem corrigidas. As URLs, quebradas em várias linhas no PDF, estão em uma linha só.

</aside>

<aside class="positive">

Hoje o `expo-permissions` está descontinuado: nas versões atuais do Expo, a permissão de localização é pedida pelo próprio `expo-location`, com `Location.requestForegroundPermissionsAsync()`.

</aside>

## Encerramento
Duration: 3:00

A tela de novo lugar agora obtém a localização do usuário, com pedido de permissão e indicador de carregamento, e exibe um mapa estático do Google centralizado nela.

### Referências

* React: A JavaScript library for building user interfaces. 2020. Disponível em [https://reactjs.org/](https://reactjs.org/). Acesso em maio de 2020.
* React Native: A framework for building native apps using React. 2020. Disponível em [https://facebook.github.io/react-native/](https://facebook.github.io/react-native/). Acesso em maio de 2020.
