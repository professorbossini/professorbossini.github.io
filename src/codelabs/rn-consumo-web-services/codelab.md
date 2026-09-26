summary: Construa um app React Native que consome o Web Service de previsão do tempo do OpenWeatherMap com fetch e exibe as previsões em uma FlatList de cartões com ícones.
id: rn-consumo-web-services
categories: React Native,Mobile
tags: react native,expo,web services,fetch,api,openweathermap,flatlist,image,json
status: Published
authors: Rodrigo Bossini
last updated: 2022-05-06
pdf: react_native/old/06_apostila_react_native_consumo_ws.pdf
exercicios: react_native/old/06_exercicios_react_native_consumo_ws.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React Native: consumo de Web Services

## Visão geral
Duration: 4:00

Em geral, aplicações para dispositivos móveis armazenam seus dados em servidores remotos. O acesso a bases remotas nunca é feito diretamente: a aplicação consome um **Web Service** (que nada mais é do que um serviço disponibilizado por uma aplicação web) que é responsável por acessar a base de interesse e entregar as informações solicitadas. A Figura 1.1 mostra como essa interação se dá tipicamente.

![Um celular troca requisições e respostas com uma aplicação web (onde fica o Web Service) na nuvem, que por sua vez acessa a base de dados de um SGBD como MySQL, Oracle ou SQL Server](img/fig-1-1.webp)

*Figura 1.1: A aplicação móvel acessa os dados por meio de um Web Service.*

Neste material iremos desenvolver uma aplicação cuja tela principal é exibida na Figura 1.2. Ela consome um Web Service que disponibiliza a previsão do tempo. Em particular, o serviço que utilizaremos disponibiliza previsões em intervalos de três horas para os próximos cinco dias.

![Tela do aplicativo com o campo "Sao Paulo" e o botão OK no topo e, abaixo, uma lista de cartões com ícone, horário, descrição (céu pouco nublado, nuvens dispersas, céu limpo) e temperaturas mínima, máxima e umidade](img/fig-1-2.webp)

*Figura 1.2: A tela principal da aplicação.*

### O que você vai aprender

* Criar uma conta e obter uma chave de API no OpenWeatherMap
* Consumir um Web Service com `fetch` e tratar a resposta JSON
* Guardar a entrada do usuário e o resultado da consulta no estado
* Exibir coleções com `FlatList` e um componente próprio por item
* Exibir imagens remotas com o componente `Image`
* Extrair dados de um JSON aninhado e formatar datas

### O que você vai precisar

* Node.js e o Expo CLI (comando `expo`)
* VS Code
* Uma conta gratuita no OpenWeatherMap
* Um celular com o Expo Go ou um emulador

## Criando o projeto e obtendo a chave
Duration: 8:00

### Criando um novo projeto

Crie um novo projeto com o comando a seguir

**Terminal**

```bash
expo init nome_do_seu_projeto
```

Escolha o template **blank** (*minimal app as clean as empty canvas*).

### Criando uma conta no serviço de previsões

Enquanto o projeto está sendo criado, visite o link a seguir e crie uma conta para você no serviço de previsões do tempo.

[https://openweathermap.org/](https://openweathermap.org/)

Uma vez que tenha criado a conta, faça login e visite a página exibida pela Figura 2.2.1. Note que há uma opção chamada **API keys**. Clique nela.

![Página da conta no site OpenWeather, com o aviso "You are already signed in" e o menu da conta com a opção API keys destacada em vermelho](img/fig-2-2-1.webp)

*Figura 2.2.1: A opção API keys na página da conta.*

Na tela a seguir, você deverá ver a sua chave. Copie-a e deixe guardada no seu clipboard para o próximo passo.

### O endpoint e a chave

No arquivo `App.js`, vamos criar duas constantes para armazenar o endereço do Web Service e a chave. Veja a Listagem 2.3.1.

**App.js · Listagem 2.3.1**

```javascript
const endPoint = "https://api.openweathermap.org/data/2.5/forecast?lang=pt&units=metric&q=";
const apiKey = //sua chave aqui
```

<aside class="negative">

Cole a sua chave como uma string, entre aspas, no lugar do comentário. Evite publicar a chave em repositórios públicos.

</aside>

## A tela principal
Duration: 10:00

### A expressão JSX da tela principal

Note que a tela principal é um tanto simples. Ela possui um campo para entrada de dados textual e, lado a lado com ele, um botão. Ou seja, precisamos de uma `View` para abrigá-los cujo `flexDirection` seja `row`. A seguir, temos uma `FlatList` que será alimentada em breve. A Listagem 2.4.1 mostra a expressão JSX e a Listagem 2.4.2 mostra a definição dos objetos de estilo.

**App.js · Listagem 2.4.1**

```jsx
return (
  <View style={styles.container}>
    <View style={styles.entrada}>
      <TextInput
        style={styles.nomeCidade}
        placeholder="Digite o nome de uma cidade"
      />
      <Button
        title="Ok"
      />
    </View>
    <FlatList
    />
  </View>
);
}
```

**App.js · Listagem 2.4.2**

```jsx
const styles = StyleSheet.create({
  container: {
    padding: 40,
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fff'
  },
  nomeCidade: {
    padding: 10,
    borderBottomColor: '#BB96F3',
    borderBottomWidth: 2,
    textAlign: 'left',
    flexGrow: 0.9
  },
  entrada: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  }
});
```

<aside class="positive">

Lembre-se de importar de `'react-native'` os componentes usados (`TextInput`, `Button`, `FlatList`, `Text`, `Keyboard` etc.) e o `useState` de `'react'`, que aparece no próximo passo.

</aside>

### Capturando a cidade digitada

Quando o usuário digitar algo, iremos capturar esse valor para que ele possa ser usado na consulta ao Web Service. Por isso, o componente terá uma variável em seu estado para armazenar a cidade digitada. Além disso, teremos uma função que será chamada sempre que o usuário digitar algo. Veja a Listagem 2.5.1.

**App.js · Listagem 2.5.1**

```jsx
const [cidade, setCidade] = useState('');

const capturarCidade = (cidade) => {
  setCidade(cidade);
}

<TextInput
  style={styles.nomeCidade}
  placeholder="Digite o nome de uma cidade"
  value={cidade}
  onChangeText={capturarCidade}
/>
```

### Estado para a lista de previsões

Uma vez feita a consulta ao Web Service, a aplicação receberá o resultado e o armazenará em uma lista, que também faz parte do componente principal. A `FlatList` utilizará essa lista para exibir seus itens. A princípio, iremos exibir somente sua representação textual. Veja a Listagem 2.6.1.

**App.js · Listagem 2.6.1**

```jsx
const [previsoes, setPrevisoes] = useState([]);

<FlatList
  data={previsoes}
  renderItem={
    previsao => (
      <Text>{JSON.stringify(previsao)}</Text>
    )
  }
/>
```

## Consumindo o Web Service
Duration: 8:00

Quando o botão for tocado, a aplicação deverá consumir o Web Service e alimentar a `FlatList` adequadamente. A função da Listagem 2.7.1 é responsável pelo consumo do Web Service. Ela faz o seguinte

* Limpa a lista de previsões, para que resultados prévios sejam apagados e fique claro para o usuário que uma nova consulta está sendo realizada.
* Constrói o endereço do Web Service completo (chamamos de `target`), incluindo a cidade digitada pelo usuário e a chave.
* Consome o Web Service usando a função `fetch`.
* A primeira chamada à função `then` converte o objeto recebido para sua representação em JSON.
* A segunda chamada à função `then` configura o estado da aplicação, tomando o cuidado de extrair somente o vetor JSON associado à chave `list` do resultado recebido do Web Service e faz o teclado desaparecer.

Lembre-se que a função precisa ser vinculada ao botão. Veja a Listagem 2.7.1.

**App.js · Listagem 2.7.1**

```jsx
const obtemPrevisoes = () => {
  setPrevisoes([]);
  const target = endPoint + cidade + "&appid=" + apiKey;
  fetch(target)
    .then((dados) => dados.json())
    .then((dados) => {
      setPrevisoes(dados["list"])
      Keyboard.dismiss()
    });
}

<Button
  title="Ok"
  onPress={obtemPrevisoes}
/>
```

Faça um teste neste momento. A aplicação deveria exibir uma lista de objetos JSON na tela, completamente sem formatação ainda, evidentemente.

## Os componentes PrevisaoItem e Cartao
Duration: 12:00

### Novo componente para a exibição de previsões

Agora vamos criar um novo componente cuja finalidade será exibir as previsões. Crie uma nova pasta na raiz do projeto chamada `components`. Dentro dela, crie um arquivo chamado `PrevisaoItem.js`. Sua definição inicial é dada na Listagem 2.8.1.

**components/PrevisaoItem.js · Listagem 2.8.1**

```jsx
import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

const PrevisaoItem = (props) => {
  return (
    <View />
  );
}

const estilos = StyleSheet.create({});

export default PrevisaoItem;
```

### Usando cartões

Faremos uso de cartões para exibir cada previsão. O componente cartão é exibido na Listagem 2.9.1.

**components/Cartao.js · Listagem 2.9.1**

```jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Cartao = (props) => {
  return (
    <View style={{ ...estilos.cartao, ...props.estilos }}>
      {props.children}
    </View>
  );
};

const estilos = StyleSheet.create({
  cartao: {
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
    borderRadius: 12
  }
});

export default Cartao;
```

### A expressão JSX do componente PrevisaoItem

Cada previsão será exibida como um cartão. Como mostra a Figura 1.2, cada previsão tem uma figura que fica do lado de um componente visual com duas linhas. Na primeira linha, exibimos o horário da previsão e um texto descritivo. Na segunda linha, exibimos a temperatura mínima, a temperatura máxima e a umidade relativa do ar, todos lado a lado. Começamos adicionando um cartão à raiz do componente, como na Listagem 2.10.1.

**components/PrevisaoItem.js · Listagem 2.10.1**

```jsx
return (
  <Cartao estilos={estilos.cartao}>
  </Cartao>
);

//no objeto estilos
cartao: {
  marginBottom: 5
},
```

A seguir, definimos uma `View` cuja finalidade será colocar a imagem e os demais componentes lado a lado. Veja a Listagem 2.10.2.

**components/PrevisaoItem.js · Listagem 2.10.2**

```jsx
return (
  <Cartao estilos={estilos.cartao}>
    <View style={estilos.tela}>
    </View>
  </Cartao>
);

//no objeto estilos
tela: {
  flexDirection: 'row',
},
```

## Imagem e as duas linhas de dados
Duration: 10:00

Para exibir uma imagem, faremos uso do componente `Image`, próprio do React Native. Ele se encarrega de fazer o download da imagem, dada a sua URL. Quando fazemos a primeira requisição ao Web Service, ele nos entrega um objeto JSON que inclui, entre todas as outras coisas, o nome de uma figura que pode ser baixada. A seguir, podemos fazer o download dela a partir de um outro endpoint, também definido na documentação oficial. Faça o teste acessando o link a seguir.

[https://openweathermap.org/img/wn/01d.png](https://openweathermap.org/img/wn/01d.png)

A definição do componente `Image` é dada na Listagem 2.10.3. Note que o link da figura deve ser especificado na propriedade `source` (e não `src`). Em breve ajustaremos esse detalhe. Além disso, precisamos especificar as medidas da figura.

**components/PrevisaoItem.js · Listagem 2.10.3**

```jsx
<Cartao estilos={estilos.cartao}>
  <View style={estilos.tela}>
    <Image
      style={estilos.imagem}
      source={{ uri: "" }}
    />
  </View>
</Cartao>

//no objeto estilos
imagem: {
  width: 50,
  height: 50
},
```

A seguir, especificamos uma `View` que terá como finalidade abrigar as duas linhas. Sua existência é importante pois, por padrão, ela irá colocar seus filhos na vertical, já que o seu valor de `flexDirection` padrão é `column`. A primeira linha exibe a data e a descrição enquanto a segunda linha exibe temperaturas mínima e máxima e a umidade relativa do ar. Veja a Listagem 2.10.4.

**components/PrevisaoItem.js · Listagem 2.10.4**

```jsx
return (
  <Cartao estilos={estilos.cartao}>
    <View style={estilos.tela}>
      <Image
        style={estilos.imagem}
        source={{ uri: "" }}
      />
      <View>
        <View style={estilos.primeiraLinha}>
          <Text >data e descrição ficarão aqui</Text>
        </View>
        <View style={estilos.segundaLinha}>
          <Text style={estilos.valor}>Temperatura mínima aqui</Text>
          <Text style={estilos.valor}>Temperatura máxima aqui</Text>
          <Text style={estilos.valor}>Humidade aqui</Text>
        </View>
      </View>
    </View>
  </Cartao>
);
}

//no objeto estilos
primeiraLinha: {
  justifyContent: 'center',
  flexDirection: 'row'
},
segundaLinha: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 4,
  borderTopWidth: 1,
  borderTopColor: '#DDD'
},
valor: {
  marginHorizontal: 2,
}
```

<aside class="positive">

O `PrevisaoItem` usa `Image` e o componente `Cartao`: importe `Image` de `'react-native'` e `Cartao` de `'./Cartao'`.

</aside>

## Exibindo os dados reais
Duration: 12:00

### Usando o componente PrevisaoItem em App.js

Voltando ao arquivo `App.js`, especificamos uma expressão JSX que utiliza o componente `PrevisaoItem` para a exibição feita pela `FlatList`. Veja a Listagem 2.11.1. Note que entregamos ao componente a previsão que ele deverá renderizar, via props.

**App.js · Listagem 2.11.1**

```jsx
<FlatList
  data={previsoes}
  renderItem={
    previsao => (
      <PrevisaoItem previsao={previsao} />
    )
  }
/>
```

### Extraindo os dados de interesse em PrevisaoItem.js

De volta ao arquivo `PrevisaoItem.js`, podemos extrair os dados de interesse do objeto recebido. A estrutura do JSON com que estamos lidando é exibida na Listagem 2.12.1. Estamos interessados somente nos seguintes itens:

* `dt`: quantidade de segundos passados desde 01/01/1970 até a data em que a consulta foi feita
* `description`: descrição sucinta das condições climáticas.
* `temp_min`: temperatura mínima
* `temp_max`: temperatura máxima
* `humidity`: umidade relativa do ar
* `icon`: nome da figura a ser baixada que representa as condições previstas

**Resposta do Web Service (trecho) · Listagem 2.12.1**

```json
{
  "list": [
    {
      "dt": 1578409200,
      "main": {
        "temp": 284.92,
        "feels_like": 281.38,
        "temp_min": 283.58,
        "temp_max": 284.92,
        "pressure": 1020,
        "sea_level": 1020,
        "grnd_level": 1016,
        "humidity": 90,
        "temp_kf": 1.34
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": {
        "all": 100
      },
      "wind": {
        "speed": 5.19,
        "deg": 211
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2020-01-07 15:00:00"
    }
  ]
}
```

A Listagem 2.12.2 mostra como o componente `PrevisaoItem` utiliza esses dados.

**components/PrevisaoItem.js · Listagem 2.12.2**

```jsx
return (
  <Cartao estilos={estilos.cartao}>
    <View style={estilos.tela}>
      <Image
        style={estilos.imagem}
        source={{ uri: "https://openweathermap.org/img/wn/" +
          props.previsao.item.weather[0].icon + ".png" }}
      />
      <View>
        <View style={estilos.primeiraLinha}>
          <Text >{new Date(props.previsao.item.dt * 1000).toLocaleTimeString()} - {props.previsao.item.weather[0].description}</Text>
        </View>
        <View style={estilos.segundaLinha}>
          <Text style={estilos.valor}>Min: {props.previsao.item.main.temp_min + "°"}</Text>
          <Text style={estilos.valor}>Max: {props.previsao.item.main.temp_max + "°"}</Text>
          <Text style={estilos.valor}>Hum: {props.previsao.item.main.humidity}%</Text>
        </View>
      </View>
    </View>
  </Cartao>
);
```

<aside class="positive">

Na apostila, a Listagem 2.12.1 mostra só o trecho a partir de `"list"`; aqui ele aparece envolto em `{ }` para formar um JSON válido. Os valores de temperatura do exemplo (como 284.92) estão em Kelvin, a unidade padrão do serviço; com o parâmetro `units=metric` da nossa URL, eles chegam em graus Celsius.

</aside>

## Exercícios
Duration: 30:00

1. Estude a estrutura do Web Service descrito no link a seguir. Ele é diferente daquele que foi utilizado na aula.

   [https://openweathermap.org/api/one-call-api](https://openweathermap.org/api/one-call-api)

   Escreva uma aplicação React Native que, dado o nome de uma cidade, exiba o horário de nascer e pôr do Sol, uma figura e a sensação térmica (`feels_like`).

### Referências

* React: A JavaScript library for building user interfaces. 2020. Disponível em [https://reactjs.org/](https://reactjs.org/). Acesso em abril de 2020.
* React Native: A framework for building native apps using React. 2020. Disponível em [https://facebook.github.io/react-native/](https://facebook.github.io/react-native/). Acesso em abril de 2020.
* Current weather and forecast: OpenWeatherMap. 2020. Disponível em [https://openweathermap.org/](https://openweathermap.org/). Acesso em abril de 2020.
