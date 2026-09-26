summary: Persista os dados do app de lugares com React Native: grave as fotos no sistema de arquivos com expo-file-system e os lugares em uma base SQLite com expo-sqlite, usando actions assíncronas do Redux Thunk.
id: rn-recursos-nativos-parte-3
categories: React Native,Mobile
tags: react native,expo,expo-file-system,expo-sqlite,sqlite,redux-thunk,promise,async await
status: Published
authors: Rodrigo Bossini
last updated: 2021-02-22
pdf: react_native/old/10_react_native_recursos_nativos_apostila.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Recursos nativos com React Native (parte 3): sistema de arquivos e SQLite

## Visão geral
Duration: 3:00

Neste material prosseguimos com o desenvolvimento da aplicação que ilustra o uso de diversos recursos nativos, como GPS, bases de dados SQLite etc. Ele é a continuação do codelab `rn-recursos-nativos-parte-2`: a foto tirada deixa de ficar em um diretório temporário e os lugares passam a ser gravados em uma base SQLite local.

### O que você vai aprender

* Mover arquivos para o diretório privado da aplicação com `expo-file-system`
* Escrever actions assíncronas com o Redux Thunk
* Criar uma base e uma tabela SQLite com `expo-sqlite`
* Envolver transações em Promises e usá-las com `async`/`await`
* Inserir e consultar registros e levar os dados da base ao estado centralizado

### O que você vai precisar

* O projeto da parte 2 (com Redux e Redux Thunk configurados)
* Um celular com o Expo Go ou um emulador

## Armazenando a foto no sistema de arquivos
Duration: 12:00

A foto que a aplicação tira, até então, fica armazenada em um diretório temporário. Ela é perdida quando a aplicação é fechada. Desejamos armazenar a foto de modo que, quando a aplicação for aberta novamente, ela ainda esteja disponível e possa ser exibida. Para isso, usaremos o pacote `expo-file-system`. Use o comando a seguir para fazer a sua instalação.

**Terminal**

```bash
expo install expo-file-system
```

Há diferentes pontos da aplicação em que a operação de persistência da foto poderia acontecer:

* **No momento em que a foto é tirada pelo componente `TiraFoto`.** Esse pode não ser um bom momento pois o usuário pode se arrepender da foto e simplesmente voltar para o componente anterior.
* **No componente `NovoLugarTela`.** Embora funcione, também pode não ser uma boa ideia já que o componente teria a responsabilidade de lidar com a API de manipulação de arquivos, o que tende a torná-lo mais complexo e de mais difícil manutenção.
* **Na própria action que faz a adição de lugar.** Este pode ser um bom ponto pois essa ação somente é disparada depois que o usuário tem certeza de que quer a foto e ela é, de fato, uma função criada para a adição de lugares. Usaremos essa alternativa.

Assim, abra o arquivo `lugares-actions.js` e importe o conteúdo do pacote instalado, como na Listagem 2.1.1.

**store/lugares-actions.js · Listagem 2.1.1**

```javascript
import * as FileSystem from 'expo-file-system';
```

A seguir, escrevemos uma arrow function que recebe o `dispatch` e o utiliza para enviar a ação. Note o uso de `async`, para que a função opere de maneira assíncrona, ou seja, não bloqueante. Veja a Listagem 2.1.2.

**store/lugares-actions.js · Listagem 2.1.2**

```javascript
export const addLugar = (nomeLugar, imagem) => {
  return async dispatch => {
  };
}
```

Antes de enviar a ação, precisamos decidir qual será o nome do arquivo e o diretório em que ele será salvo. O pacote `expo-file-system` possui diversos diretórios pré-definidos. Um deles se chama `documentDirectory`. Ele é um diretório exclusivo da aplicação que ela pode utilizar para armazenar de maneira privada todos os arquivos de que necessita. Ele é mantido pelo sistema operacional enquanto a aplicação estiver instalada no dispositivo. Assim, a foto será salva neste diretório. Seu nome será o nome original, gerado no momento em que ela foi tirada. Lembre-se que, no momento, o que temos em mãos é a URI da imagem, que é da forma `file://algumdiretorio/nome.png`. Para extrair o nome, vamos usar a função `split` do JavaScript para quebrar a string usando o símbolo `/` como separador e usar o método `pop` para pegar o último elemento do vetor. Veja a Listagem 2.1.3.

**store/lugares-actions.js · Listagem 2.1.3**

```javascript
export const addLugar = (nomeLugar, imagem) => {
  return async dispatch => {
    const nomeArquivo = imagem.split("/").pop();
    const novoPath = FileSystem.documentDirectory + nomeArquivo;
  };
}
```

Para salvar o arquivo na nova localização, usamos a função `moveAsync` do pacote. Ela recebe um objeto JSON com duas propriedades: `from` e `to`. Como o nome sugere, ela opera de forma não bloqueante. Como desejamos entregar a ação ao reducer somente depois de sua conclusão, vamos usar a primitiva `await` para aguardar o seu término. Adicione também um tratamento básico para possíveis exceções. Veja a Listagem 2.1.4.

**store/lugares-actions.js · Listagem 2.1.4**

```javascript
export const addLugar = (nomeLugar, imagem) => {
  return async dispatch => {
    const nomeArquivo = imagem.split("/").pop();
    const novoPath = FileSystem.documentDirectory + nomeArquivo;
    try{
      await FileSystem.moveAsync({
        from: imagem,
        to: novoPath
      })
    }
    catch (err){
      console.log (err);
      throw err;
    }
  };
}
```

Finalmente, entregamos a ação ao reducer para que ele opere sobre o estado centralizado, como antes. Note que alteramos o valor do atributo `imagem` no objeto `dadosLugar` para a nova localização. Veja a Listagem 2.1.5.

**store/lugares-actions.js · Listagem 2.1.5**

```javascript
export const addLugar = (nomeLugar, imagem) => {
  return async dispatch => {
    const nomeArquivo = imagem.split("/").pop();
    const novoPath = FileSystem.documentDirectory + nomeArquivo;
    try {
      await FileSystem.moveAsync({
        from: imagem,
        to: novoPath
      })
      dispatch({ type: ADD_LUGAR, dadosLugar: { nomeLugar: nomeLugar, imagem: novoPath } })
    }
    catch (err) {
      console.log(err);
      throw err;
    }
  };
}
```

<aside class="positive">

A action agora devolve uma função (`async dispatch => {...}`), e não um objeto. É o Redux Thunk, aplicado com `applyMiddleware` na parte 2, que permite esse formato.

</aside>

## Criando uma base SQLite
Duration: 15:00

Embora a aplicação já armazene as imagens em memória persistente, isso ainda não é verdade para os demais dados referentes a um lugar, como seu nome, endereço etc. Para isso, utilizaremos uma base **SQLite**. Trata-se de uma simples API que permite que se acesse o sistema de arquivos por meio de uma sintaxe muito parecida com SQL. Note, porém, que o armazenamento é feito na memória local do dispositivo. SQLite não é um SGBD que opera remotamente. É apenas uma API para acesso a arquivos locais, de novo, usando algo parecido com SQL.

O primeiro passo é instalar o pacote `expo-sqlite`, o que pode ser feito com

**Terminal**

```bash
expo install expo-sqlite
```

Para começar a utilizar o SQLite, crie uma pasta chamada `helpers` na raiz do projeto e, dentro dela, um arquivo chamado `db.js`. Ele servirá para isolarmos dos componentes da aplicação o código de acesso à base SQLite. Como sempre, os nomes de diretório e arquivo podem ser quaisquer.

Agora é preciso criar uma base de dados, o que pode ser feito com o método `openDatabase`. Ele recebe o nome da base e se encarrega de criar a base, caso ela ainda não exista. Veja a Listagem 2.2.1. Estamos no arquivo `db.js`.

**helpers/db.js · Listagem 2.2.1**

```javascript
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("lugares.db");
```

Como o nome sugere, o SQLite utiliza o modelo relacional. Por isso, uma vez criada a base de dados, precisamos criar tabelas em que os dados serão armazenados. Para tal, vamos criar uma função. Ela usa o método `transaction` do objeto `db`. Ele recebe uma função cujo parâmetro é um objeto que representa a transação a ser executada. Uma transação tem diversos aspectos de interesse. O principal para esse momento é o conceito de **atomicidade**. Ele se refere ao fato de que as operações especificadas em uma transação são tratadas como um único bloco indivisível: ou todas as operações são executadas com sucesso ou, se uma falhar, nenhuma delas é executada e a base é mantida no estado em que estava antes de a execução da transação começar.

O objeto transação é que permite especificarmos o comando SQL a ser executado. Veja a Listagem 2.2.2. Note que a tabela já possui colunas para o endereço e para as coordenadas latitude/longitude que serão extraídas usando o GPS. Em breve passaremos a utilizá-las.

**helpers/db.js · Listagem 2.2.2**

```javascript
export const init = () => {
  db.transaction((tx) => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS tb_lugar (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, imagemUri TEXT NOT NULL, endereco TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL);');
  });
}
```

A função `executeSql` recebe ainda outros parâmetros. O segundo é um vetor que pode armazenar dados a serem injetados dinamicamente no comando SQL. O terceiro é uma função a ser executada caso o comando tenha sido executado com sucesso. O quarto é uma função a ser executada caso o comando não execute com sucesso. Veja a Listagem 2.2.3. Não nos preocupamos em dar um nome significativo para o comando já que ele não será usado pela função.

**helpers/db.js · Listagem 2.2.3**

```javascript
export const init = () => {
  db.transaction((tx) => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS tb_lugar (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, imagemUri TEXT NOT NULL, endereco TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL);',
      [],
      () => { },
      (_, err) => { }
    );
  });
}
```

A fim de executar a função `transaction`, vamos empacotá-la em uma **Promise**, que representa algo que pode ser obtido no futuro. Uma Promise recebe duas funções. Uma delas é executada quando a Promise terminar com sucesso e a segunda é executada quando ela termina com alguma falha. Veja a Listagem 2.2.4. Note que a função de erro recebe dois parâmetros. O primeiro é o comando SQL. O segundo é o erro propriamente dito. Ao final, devolvemos a promise.

**helpers/db.js · Listagem 2.2.4**

```javascript
export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tb_lugar (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, imagemUri TEXT NOT NULL, endereco TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL);',
        [],
        () => { resolve() },
        (_, err) => { reject(err) }
      );
    });
  });
  return promise;
}
```

<aside class="negative">

Nas listagens 2.2.2 e 2.2.3 impressas, a coluna da imagem se chama `imageUri`; a partir da Listagem 2.2.4 e no `INSERT`, ela passa a se chamar `imagemUri`. Aqui usamos `imagemUri` em todas, para que a tabela criada combine com o comando de inserção. Se você já criou a tabela com o nome antigo, desinstale o app (ou apague a base) antes de testar.

</aside>

A função `init` precisa ser chamada assim que a aplicação começa para que a base já fique disponível. Por isso, o componente principal se encarregará de chamá-la. Abra o arquivo `App.js`, importe e coloque em execução a função `init`, como na Listagem 2.2.5. Note que usamos as funções `then` e `catch`. Elas são executadas caso a promessa devolvida por `init` execute com sucesso ou falha, respectivamente. A chamada à função `init` fica fora da função que define o componente, logo após os imports.

**App.js · Listagem 2.2.5**

```javascript
import { init } from './helpers/db';

init().then(() => {
  console.log("Criação da base ocorreu com sucesso.");
}).catch((err) => {
  console.log('Criação da base falhou.');
  console.log(err);
});
```

## Armazenando dados na base
Duration: 15:00

Uma vez construída a base, podemos começar a inserir os dados das localizações escolhidas pelo usuário em meio persistente.

Começamos definindo uma função no arquivo `helpers/db.js` que recebe os dados de uma localização. Veja a Listagem 2.3.1.

**helpers/db.js · Listagem 2.3.1**

```javascript
export const inserirLugar = (nomeLugar, imagemUri, endereco, lat, lng) => {
}
```

A estrutura desejada é a mesma utilizada para a criação da tabela: a função precisa executar os comandos a serem especificados em uma transação e devolver uma Promise. Veja a Listagem 2.3.2.

**helpers/db.js · Listagem 2.3.2**

```javascript
export const inserirLugar = (nomeLugar, imagemUri, endereco, lat, lng) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('',
        [],
        () => { resolve() },
        (_, err) => { reject(err) }
      );
    });
  });
  return promise;
}
```

A seguir, especificamos o comando a ser executado. Note que ele possui "placeholders", representados pelo símbolo `?`. São códigos que serão substituídos por valores armazenados no vetor que é o segundo parâmetro da função. Veja a Listagem 2.3.3.

**helpers/db.js · Listagem 2.3.3**

```javascript
export const inserirLugar = (nomeLugar, imagemUri, endereco, lat, lng) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO tb_lugar (nome, imagemUri, endereco, lat, lng) VALUES (?,?,?,?,?)',
        [nomeLugar, imagemUri, endereco, lat, lng],
        () => { resolve() },
        (_, err) => { reject(err) }
      );
    });
  });
  return promise;
}
```

A seguir, ajuste a função que executa em caso de sucesso para que ela receba como parâmetro o resultado. Veja a Listagem 2.3.4.

**helpers/db.js · Listagem 2.3.4**

```javascript
export const inserirLugar = (nomeLugar, imagemUri, endereco, lat, lng) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO tb_lugar (nome, imagemUri, endereco, lat, lng) VALUES (?,?,?,?,?)',
        [nomeLugar, imagemUri, endereco, lat, lng],
        (_, resultado) => { resolve(resultado) },
        (_, err) => { reject(err) }
      );
    });
  });
  return promise;
}
```

A função `inserirLugar` também será chamada no arquivo `lugares-actions.js`. Isso será feito na função `addLugar`. Comece importando a função `inserirLugar`, como na Listagem 2.3.5.

**store/lugares-actions.js · Listagem 2.3.5**

```javascript
import { inserirLugar } from '../helpers/db';
```

A seguir, chamamos a função entregando a ela os dados que já temos disponíveis. Ou seja, por enquanto, somente o nome do lugar e o endereço da imagem. Para os demais, passamos valores quaisquer que serão substituídos no futuro. Como a função devolve uma Promise (e, portanto, executa de forma não bloqueante) e desejamos redirecionar a ação ao reducer somente depois de seu término, vamos aplicar a primitiva `await` em sua chamada. Ao final, exibimos no console o resultado da operação. Veja a Listagem 2.3.6.

**store/lugares-actions.js · Listagem 2.3.6**

```javascript
export const addLugar = (nomeLugar, imagem) => {
  return async dispatch => {
    const nomeArquivo = imagem.split("/").pop();
    const novoPath = FileSystem.documentDirectory + nomeArquivo;
    try {
      await FileSystem.moveAsync({
        from: imagem,
        to: novoPath
      })
      const resultadoDB = await inserirLugar(
        nomeLugar,
        novoPath,
        'Torre Eiffel',
        48.8584,
        2.2945
      );
      console.log(resultadoDB);
      dispatch({ type: ADD_LUGAR, dadosLugar: { nomeLugar: nomeLugar, imagem: novoPath } })
    }
    catch (err) {
      console.log(err);
      throw err;
    }
  };
}
```

Até então, o id que utilizamos era simplesmente a data atual do sistema. O SQLite gera um id automaticamente a cada vez que um novo dado é inserido. Podemos passar a utilizá-lo. É uma propriedade que pode ser obtida do objeto `resultadoDB`. Veja a Listagem 2.3.7.

**store/lugares-actions.js · Listagem 2.3.7**

```javascript
export const addLugar = (nomeLugar, imagem) => {
  return async dispatch => {
    const nomeArquivo = imagem.split("/").pop();
    const novoPath = FileSystem.documentDirectory + nomeArquivo;
    try {
      await FileSystem.moveAsync({
        from: imagem,
        to: novoPath
      })
      const resultadoDB = await inserirLugar(
        nomeLugar,
        novoPath,
        'Torre Eiffel',
        48.8584,
        2.2945
      );
      console.log(resultadoDB);
      dispatch({ type: ADD_LUGAR, dadosLugar: { id: resultadoDB.insertId, nomeLugar: nomeLugar, imagem: novoPath } })
    }
    catch (err) {
      console.log(err);
      throw err;
    }
  };
}
```

E passamos a utilizá-lo no arquivo `lugares-reducer.js`, como na Listagem 2.3.8.

**store/lugares-reducer.js · Listagem 2.3.8**

```javascript
export default (estado = estadoInicial, action) => {
  switch (action.type) {
    case ADD_LUGAR:
      const l = new Lugar(action.dadosLugar.id.toString(), action.dadosLugar.nomeLugar,
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

## Usando os dados armazenados
Duration: 12:00

A aplicação ainda não utiliza os dados armazenados na base. Nesta seção, faremos com que ela os utilize.

Vamos começar criando uma função no arquivo `helpers/db.js`. Assim como as demais, ela realiza as operações em uma transação e devolve uma Promise. Sendo assim, seu corpo inicial é dado na Listagem 2.4.1.

**helpers/db.js · Listagem 2.4.1**

```javascript
export const buscarLugares = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        '',
        [],
        (_, resultado) => { resolve(resultado) },
        (_, err) => { reject(err) }
      );
    });
  });
  return promise;
};
```

Ela deve executar um comando `SELECT`, como na Listagem 2.4.2.

**helpers/db.js · Listagem 2.4.2**

```javascript
export const buscarLugares = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM tb_lugar',
        [],
        (_, resultado) => { resolve(resultado) },
        (_, err) => { reject(err) }
      );
    });
  });
  return promise;
};
```

O componente que exibe a lista, por exemplo, precisará disparar uma ação para obtê-la. Por isso, começamos definindo uma nova ação no arquivo `lugares-actions.js`. Veja a Listagem 2.4.3.

**store/lugares-actions.js · Listagem 2.4.3**

```javascript
import { inserirLugar, buscarLugares } from '../helpers/db';

export const LISTA_LUGARES = 'LISTA_LUGARES';
export const listarLugares = () => {
  return async dispatch => {
    try {
      const resultadoDB = await buscarLugares();
      dispatch({ type: LISTA_LUGARES, lugares: resultadoDB.rows._array });
    }
    catch (err) {
      console.log(err);
      throw err;
    }
  }
};
```

No componente `ListaDeLugaresTela`, importamos o conteúdo do arquivo `lugares-actions.js` para que ele possa enviar a ação. Usando o hook `useEffect`, quando o componente carregar, podemos enviar a ação. Veja a Listagem 2.4.4.

**telas/ListaDeLugaresTela.js · Listagem 2.4.4**

```jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as lugaresActions from '../store/lugares-actions';

const ListaDeLugaresTela = (props) => {
  const lugares = useSelector(estado => estado.lugares.lugares);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(lugaresActions.listarLugares())
  }, [dispatch]);
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
};
```

O reducer precisa lidar com esse possível novo tipo de ação. Para isso, adicionamos uma nova cláusula `case` ao `switch`, como na Listagem 2.4.5. Note como convertemos cada item do vetor para um objeto do tipo `Lugar` com a função `map`.

**store/lugares-reducer.js · Listagem 2.4.5**

```javascript
import { ADD_LUGAR, LISTA_LUGARES } from './lugares-actions'

case LISTA_LUGARES:
  return {
    lugares: action.lugares.map(l => new Lugar(l.id.toString(), l.nome, l.imagemUri))
  }
```

<aside class="negative">

Na Listagem 2.4.5 impressa, o `map` usa `l.nomeLugar` e `l.imagem`; os registros que vêm da base, porém, têm os nomes das colunas da tabela (`nome` e `imagemUri`), por isso aqui usamos `l.nome` e `l.imagemUri`. Da mesma forma, o id enviado na navegação é `lugar.item.id`.

</aside>

Teste novamente a aplicação. Neste momento, a lista já deve utilizar os dados salvos em meio persistente.

## Encerramento
Duration: 3:00

As fotos agora ficam no diretório privado da aplicação e os lugares são gravados em uma base SQLite local; ao abrir a aplicação, a lista é carregada da base para o estado centralizado.

### Próximos passos

* Na parte 4 (codelab `rn-recursos-nativos-parte-4`), a aplicação passa a obter a localização do usuário e a exibir mapas.

### Referências

* React: A JavaScript library for building user interfaces. 2020. Disponível em [https://reactjs.org/](https://reactjs.org/). Acesso em maio de 2020.
* React Native: A framework for building native apps using React. 2020. Disponível em [https://facebook.github.io/react-native/](https://facebook.github.io/react-native/). Acesso em maio de 2020.
