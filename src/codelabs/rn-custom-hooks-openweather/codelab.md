summary: Isole num custom hook a lógica de acesso à API de clima do OpenWeather, com estados de carregamento e erro, e use-o num app React Native com TypeScript.
id: rn-custom-hooks-openweather
categories: React Native,React,Mobile
tags: react native,expo,typescript,custom hooks,useeffect,fetch,openweather,api
status: Published
authors: Rodrigo Bossini
last updated: 2025-09-08
pdf: react_native/new/004_apostila_react_native_custom_hooks_openweather.pdf
exercicios: react_native/new/004_exercicios_react_native_custom_hooks_openweather.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# React Native: custom hook para a API OpenWeather

## Visão geral
Duration: 3:00

Neste material, vamos estudar sobre a criação de hooks próprios, visando a implementação de regras de negócio que podem se repetir em diferentes partes da aplicação. A motivação é a mesma que utilizamos quando criamos funções: promover reusabilidade, manutenabilidade e flexibilidade. Quando utilizamos Hooks, estamos optando por seguir tais princípios aderindo a convenções do React.

A aplicação que criaremos isola a lógica de acesso a uma API de condições climáticas. Ela se parece com o seguinte.

![Tela "Previsão do Tempo" com o campo de cidade preenchido com Itu, o botão Buscar e o resultado: Itu, 31°C, nublado](img/app-clima.webp)

*A aplicação de condições climáticas.*

### O que você vai aprender

* Definir tipos TypeScript de acordo com a resposta de uma API
* Escrever um custom hook que usa `useState`, `useEffect` e `fetch`
* Controlar os estados de carregamento e de erro de uma requisição
* Usar o hook num componente com `TextInput`, `Button` e `ActivityIndicator`

### O que você vai precisar

* Node.js e VS Code instalados
* Uma chave de API do OpenWeather ([https://openweathermap.org/](https://openweathermap.org/))
* Ter feito o codelab `rn-custom-hooks` ajuda

## Criando a aplicação
Duration: 6:00

Comece criando a aplicação com

**Terminal**

```bash
npx create-expo-app -t expo-template-blank-typescript custom-hooks-openweather
```

Uma pasta chamada `custom-hooks-openweather` terá sido criada para você. Use

**Terminal**

```bash
code custom-hooks-openweather
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

## O hook useWeather
Duration: 12:00

Crie a seguinte estrutura para isolar os hooks da aplicação.

![Explorer do VS Code com a pasta src, dentro dela a pasta hooks e o arquivo useWeather.ts](img/estrutura.webp)

*A estrutura src/hooks/useWeather.ts.*

### Tipos

No arquivo `useWeather.ts`, criamos o hook. Começamos com a definição de tipos em TypeScript.

<aside class="negative">

A constante `API_KEY` está vazia no material: preencha-a com a sua chave de API do OpenWeather, senão as requisições falham.

</aside>

**src/hooks/useWeather.ts**

```typescript
import { useState, useEffect } from 'react';

const API_KEY = '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

//define o tipo recebido da api
//estrutura criada de acordo com aquilo que o serviço devolve
interface WeatherInfo {
  description: string;
}

interface WeatherResponse {
  name: string;
  main: {
    temp: number;
  };
  weather: WeatherInfo[];
}

//definição daquilo que nosso hook devolve
interface UseWeatherReturn {
  dados: WeatherResponse | null;
  carregando: boolean;
  erro: string | null;
  buscarClima: () => Promise<void>;
}
```

### O hook

A seguir, a definição do hook.

**src/hooks/useWeather.ts**

```typescript
...
//definição daquilo que nosso hook devolve
interface UseWeatherReturn {
  dados: WeatherResponse | null;
  carregando: boolean;
  erro: string | null;
  buscarClima: () => Promise<void>;
}
...
export function useWeather(cidade: string = 'São Paulo'): UseWeatherReturn {
  const [dados, setDados] = useState<WeatherResponse | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarClima = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const resposta = await fetch(
        `${BASE_URL}?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt_br`
      );

      if (!resposta.ok) {
        throw new Error('Erro ao buscar dados do clima');
      }

      const json: WeatherResponse = await resposta.json();
      setDados(json);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarClima();
  }, [cidade]);

  return { dados, carregando, erro, buscarClima };
}
```

## Usando o hook no App
Duration: 12:00

Visite o arquivo `App.tsx` e apague todo o seu conteúdo. Começamos com os imports e definição de variáveis por meio de hooks. É nesse momento que utilizamos aquele que criamos.

**App.tsx**

```jsx
import { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Button, ActivityIndicator } from 'react-native';
import { useWeather } from './src/hooks/useWeather';

export default function App() {
  const [cidade, setCidade] = useState<string>('São Paulo');
  const { dados, carregando, erro, buscarClima } = useWeather(cidade);

  return (
    <View> Começando... </View>
  );
}
```

Agora, a expressão JSX do componente, além da sua definição de estilos.

**App.tsx**

```jsx
export default function App() {
  const [cidade, setCidade] = useState<string>('São Paulo');
  const { dados, carregando, erro, buscarClima } = useWeather(cidade);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🌦 Previsão do Tempo</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a cidade"
        value={cidade}
        onChangeText={setCidade}
      />

      <Button title="Buscar" onPress={buscarClima} />

      {carregando && <ActivityIndicator size="large" color="#0000ff" />}

      {erro && <Text style={styles.erro}>{erro}</Text>}

      {dados && !carregando && (
        <View style={styles.resultado}>
          <Text style={styles.cidade}>{dados.name}</Text>
          <Text style={styles.temperatura}>{Math.round(dados.main.temp)}°C</Text>
          <Text style={styles.descricao}>{dados.weather[0].description}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#fff',
  },
  erro: {
    color: 'red',
    marginTop: 10,
  },
  resultado: {
    marginTop: 20,
    alignItems: 'center',
  },
  cidade: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  temperatura: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  descricao: {
    fontSize: 20,
    fontStyle: 'italic',
  },
});
```

## Exercícios
Duration: 30:00

1. Adapte a aplicação vista em aula de modo que os parâmetros (unidade de medida da temperatura, idioma etc.) sejam especificados no momento em que o hook é usado.

2. A aplicação que escrevemos utiliza o serviço de condições climáticas atuais. Visite o link a seguir e estude sobre o serviço de previsão do tempo de 3 em 3 horas por 5 dias.

   [https://openweathermap.org/forecast5](https://openweathermap.org/forecast5)

   Faça uma nova aplicação que utiliza este serviço e exibe uma lista de previsões. Para cada previsão, inclua nome da cidade, temperaturas máxima e mínima, descrição e um ícone (cujo nome é provido pelo próprio serviço que estamos utilizando).

### Referências

* React Native. Learn once, write anywhere. 2025. Disponível em [https://reactnative.dev/](https://reactnative.dev/). Acesso em 2025.
