summary: Estude as coleções de Dart: listas, tuplas (records), conjuntos e mapas, null safety em listas, o operador as, coleções de coleções, collection-if, collection-for, operador spread e cópia de coleções.
id: dart-introducao-parte-3
categories: Flutter
tags: dart,colecoes,list,set,map,records,null safety,spread,collection-for
status: Published
authors: Rodrigo Bossini
last updated: 2023-08-14
pdf: dart_flutter/03_apostila_dart_introducao.pdf
exercicios: dart_flutter/03_exercicio_dart_introducao.pdf,dart_flutter/03_exercicio_dart_introducao_parte2.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Introdução ao Dart, parte 3: coleções

## Visão geral
Duration: 3:00

Neste material, prosseguimos com os estudos sobre as principais características da linguagem Dart. Este é o terceiro codelab de uma série de três e trata das coleções.

### O que você vai aprender

* Como receber argumentos pela função `main`
* Como criar, acessar, alterar e percorrer listas, e suas operações básicas
* Como listas se comportam com `final`, `const` e `null`
* Tuplas (records)
* Conjuntos (Sets) e as operações de união, interseção e diferença
* Mapas, o operador `as` e como iterar sobre chaves, valores e pares chave/valor
* Coleções de coleções
* Collection-if, collection-for e o operador spread
* Como copiar coleções de verdade

### O que você vai precisar

* O SDK de Dart instalado e o VS Code configurado (veja a parte 2 da série)
* Conhecimentos das partes 1 e 2 da série

## Criando o projeto e recebendo argumentos
Duration: 5:00

Dart possui quatro tipos comuns de coleções

* Listas
* Tuplas ou Records
* Conjuntos (Sets)
* Mapas

Vamos estudar sobre suas principais características. Comece criando um novo projeto com

**Terminal**

```bash
dart create colecoes -t console
```

Lembre-se de executar este comando fora de qualquer projeto. Embora seja comum utilizar a pasta `lib` para fazer a codificação, nestes exemplos iniciais vamos simplificar usando o arquivo `colecoes.dart` da pasta `bin`. Observe que ele já possui o método `main`.

<aside class="positive">

**Nota.** Observe que a função `main` do projeto possui um parâmetro do tipo `List<String>`. É uma lista que permite que entreguemos valores ao programa quando o inicializarmos.

</aside>

**bin/colecoes.dart**

```dart
void main(List<String> arguments) {
  print(arguments);
}
```

E execute o programa com

**Terminal**

```bash
dart run colecoes 2 3
```

Observe que a lista contém os dois valores passados como parâmetro.

## Listas: criação, acesso e iteração
Duration: 10:00

Listas podem ser manipuladas com o operador `[ ]`. Embora a notação seja semelhante a um vetor "baixo nível" de linguagens como Java e C, o objeto construído é do tipo `List<String>`. Observe, também, que o método `print` se encarrega de chamar o método `toString` caso não o façamos explicitamente.

```dart
void main(List<String> arguments) {
  var nomes = ['João', 'Pedro', 'Maria'];
  print(nomes);
  print(nomes.toString());
  print(nomes.runtimeType);
}
```

Podemos acessar os elementos de uma lista usando o operador `[ ]` também. Cada um tem a sua posição, começando a contagem do zero.

```dart
void main(List<String> arguments) {
  var nomes = ['João', 'Pedro', 'Maria'];
  print(nomes);
  print(nomes.toString());
  print(nomes.runtimeType);
  print(nomes[0]);
  print(nomes[1]);
}
```

Observe que causamos uma exceção do tipo `RangeError` caso tentemos acessar a lista utilizando uma posição inválida. Claro, trata-se de uma exceção que acontece em tempo de execução.

```dart
void main(List<String> arguments) {
  var nomes = ['João', 'Pedro', 'Maria'];
  print(nomes);
  print(nomes.toString());
  print(nomes.runtimeType);
  print(nomes[0]);
  print(nomes[1]);
  //RangeError
  print(nomes[-1]);
  //RangeError
  print(nomes[3]);
}
```

Veja a figura.

![Três caixas lado a lado com os nomes João, Pedro e Maria e, abaixo delas, as posições 0, 1 e 2](img/lista-indices.webp)

*As posições válidas da lista vão de 0 a 2.*

Também podemos alterar valores da coleção.

```dart
void main(List<String> arguments) {
  var nomes = ['João', 'Pedro', 'Maria'];
  nomes[0] = 'José';
  print(nomes);
}
```

Podemos iterar sobre uma lista usando uma estrutura de repetição "comum" ou um "for each". Observe que o número de elementos que a lista contém pode ser obtido por meio de sua propriedade `length`.

```dart
void main(List<String> arguments) {
  var nomes = ['João', 'Pedro', 'Maria'];
  //for comum
  for (int i = 0; i < nomes.length; i++){
    print(nomes[i]);
  }
  //for each
  for (final nome in nomes){
    print(nome);
  }
}
```

Dado que o compilador já inferiu o tipo `List<String>`, não podemos armazenar um objeto de qualquer outro tipo.

```dart
void main(List<String> arguments) {
  var nomes = ['João', 'Pedro', 'Maria'];
  //erro, a lista é de strings
  nomes[0] = 2;
}
```

Entretanto, se a lista for criada utilizando-se objetos de tipos diversos, o tipo inferido será `List<Object>`. Neste caso, podemos armazenar qualquer coisa que passe no teste **É-UM** `Object`.

```dart
void main(List<String> arguments) {
  var itensDiversos = ['Ana', true, 2, 2.5];
  print(itensDiversos);
  //List<Object>
  print(itensDiversos.runtimeType);
  //agora pode
  itensDiversos[0] = false;
  print(itensDiversos);
}
```

<aside class="positive">

**Exercício.** Escreva um programa que faz a soma dos elementos recebidos como parâmetro pelo método `main`. Lembre-se de fazer conversões apropriadas. Execute o programa com `dart run colecoes 1 2 3`

</aside>

## Listas: operações básicas
Duration: 10:00

Vejamos algumas operações básicas que podemos realizar com listas. Veja os comentários.

```dart
void main(List<String> arguments) {
  var nomes = ['Ana', 'João', 'Maria'];
  //responde se a lista está vazia
  print(nomes.isEmpty);
  //responde se a lista não está vazia
  print(nomes.isNotEmpty);
  //devolve um Iterable<String> contendo os elementos em ordem reversa
  //não altera a lista atual
  print(nomes.reversed);
  //devolve o primeiro elemento da lista
  //se ela estiver vazia, causa um erro
  print(nomes.first);
  //devolve o primeiro ou null, sem causar erro
  print(nomes.firstOrNull);
  //lista vazia
  //Bad state: no element
  //print([].first);
  //aqui tudo bem,devolve null
  print([].firstOrNull);
  //o mesmo vale para o último elemento
  print(nomes.last);
  print(nomes.lastOrNull);
}
```

Podemos adicionar elementos a uma lista usando o método `add`. O elemento será adicionado ao final. Se desejarmos podemos adicionar um elemento usando o método `insert`. Neste caso, especificamos a posição em que desejamos que ele seja adicionado. O método `insert` desloca os elementos para a direita, se for o caso. Se a coleção possui n elementos, n é a última posição válida que podemos especificar.

```dart
void main(List<String> arguments) {
  var nomes = ['Ana', 'João', 'Maria'];
  //adiciona na última posição
  nomes.add('Cristina');
  print(nomes);
  //insere na posição 0
  nomes.insert(0, 'Ana Maria');
  //aqui a lista tem 5 elementos
  print(nomes);
  //podemos adicionar na posição 5
  //obtendo o mesmo funcionamento do add
  nomes.insert(5, 'Vagner');
  print(nomes);
  //aqui a lista tem 6 elementos
  //não podemos adicionar em qualquer posição a partir da 7
  //RangeError
  nomes.insert(7, 'Antônio');
}
```

O método `contains` responde se a lista contém um determinado elemento.

```dart
void main(List<String> arguments) {
  var nomes = ['Ana', 'João', 'Maria'];
  //true
  print(nomes.contains('Ana'));
  //false
  print(nomes.contains('ANA'));
  //false
  print(nomes.contains('Pedro'));
}
```

Sem usar inferência de tipo, podemos declarar uma lista da seguinte forma.

```dart
void main(List<String> arguments) {
  List<String> nomes = ['Ana', 'Pedro'];
  print(nomes.runtimeType);
  List<int> idades = [17, 22];
  print(idades.runtimeType);
  List<bool> deMaior = [false, true];
  print(deMaior.runtimeType);
  //podemos também ter uma lista de listas
  var listas = [nomes, idades, deMaior];
  //essa é uma List<List<Object>>
  print(listas.runtimeType);
  //sem o tipo genérico também pode
  //aqui temos uma lista de dynamic
  //ou seja, ela armazena qualquer coisa
  List lista = [];
  lista.add(true);
  lista.add("Ana");
  print(lista.runtimeType);
  print(lista);
}
```

Também podemos restringir o tipo do objeto armazenado numa lista usando **type annotation**. Observe.

```dart
void main(List<String> arguments) {
  //List<Object>
  var qualquerCoisa = [1, true, 'Ana'];
  //<List<String> com type annotation
  var somenteStrings = <String>['Ana', 'Pedro'];
  print(qualquerCoisa.runtimeType);
  print(somenteStrings.runtimeType);
}
```

<aside class="positive">

**Exercício.** Escreva um programa que:

* pede ao usuário que faça um jogo da mega sena com 6 números. Use uma lista para armazená-los. Não admita repetições.
* gera um jogo de 6 números da mega sena usando `Random` e guarda numa lista.
* exibe o jogo do usuário lado a lado com o jogo gerado, ambas ordenadas
* mostra ao usuário quais números ele acertou.

</aside>

## Listas: final, const e null
Duration: 10:00

Podemos usar a palavra `final` para declarar listas. Confira seu funcionamento.

```dart
void main(List<String> arguments) {
  //ok
  final nomes = ['Ana', 'Pedro'];
  //pode alterar o conteúdo da lista!
  nomes[0] = 'Ana Maria';
  //mas não pode alterar o objeto referenciado pela constante nomes
  //erro em tempo de compilação
  nomes = ['João', 'Maria'];
}
```

Também podemos usar `const`. Lembre-se que só é possível se a lista inteira for conhecida em tempo de compilação. Observe que o conteúdo da lista também não pode ser alterado neste caso.

```dart
void main(List<String> arguments) {
  //ok
  const nomes = ['Ana', 'Pedro'];
  //não podemos alterar o objeto referenciado
  //erro em tempo de compilação
  //nomes = ['João'];
  //também não podemos alterar o conteúdo
  //mas esse é um erro em tempo de execução!
  //o compilador Dart cria uma lista imutável neste caso
  nomes[0] = 'Ana Maria';
}
```

No que diz respeito à manipulação de **null**, queremos saber o seguinte:

* a variável que referencia a lista pode referenciar null
* a lista referenciada pode conter null

Dart possui construções para que lidemos com isso em tempo de compilação, evitando a famigerada "NullPointerException" que acontece em tempo de execução e costuma ser muito custosa. Veja os exemplos.

```dart
void main(List<String> arguments) {
  var nomes1 = ['Ana', 'Pedro'];
  //não pode, o tipo já é List<String>
  //Strings obrigatórias, não pode null
  //erro em tempo de compilação
  //nomes1.add(null);
  //aqui o tipo é List<dynamic>
  var nomes2 = [];
  nomes2.add('Ana');
  //vale colocar null
  nomes2.add(null);
  //sem inferência não pode
  List<String> nomes3 = [];
  //erro em tempo de compilação
  //nomes3.add(null);
  //a menos que digamos que pode explicitamente
  //String? é algo como "opcional", pode ser String ou null
  List<String?> nomes4 = [];
  nomes4.add(null);
  //com type annotation
  //dá na mesma, não pode
  //var nomes5 = <String> [null];
  //a menos que digamos explicitamente que pode, com ?
  var nomes6 = <String?>[null];
  //observe que aqui é diferente
  //a variável lista pode ser null
  //mas a lista não pode conter null
  List<String>? podeSerNullMasNaoEh = [];
  //List<String>
  print(podeSerNullMasNaoEh.runtimeType);
  //não pode
  //podeSerNullMasNaoEh.add(null);
  List<String>? podeSerNullEEh = null;
  //Null
  print(podeSerNullEEh.runtimeType);
  //aqui, a variável pode ser null e a lista pode conter null
  List<String?>? podeSerEConterNull1;
  //null implicitamente
  print(podeSerEConterNull1);
  //contém null e uma String. int não pode
  List<String?>? podeSerEConterNull2 = [null, 'Ana'];
  print(podeSerEConterNull2);
}
```

## Tuplas e conjuntos
Duration: 12:00

### Tuplas

Tuplas são coleções ordenadas imutáveis. São criadas utilizando-se a notação `( )`.

```dart
void main(List<String> arguments) {
  var tupla = ('Ana', 18, true);
  print(tupla);
  //(String, int, bool) é o tipo
  print(tupla.runtimeType);
  //podemos acessar os elementos assim
  //contagem começa do 1
  print(tupla.$1);
  print(tupla.$2);
  print(tupla.$3);
  //erro em tempo de compilação
  //print(tupla.$4);
}
```

### Conjuntos (Sets)

Conjuntos são coleções que não admitem elementos repetidos. A construção de um conjunto deve ser feita utilizando-se o operador `{ }`.

```dart
void main(List<String> arguments) {
  //ok
  var nomes = {'Ana', 'João'};
  print(nomes);
  //_Set<String>
  print(nomes.runtimeType);
  //ok também, mas vai conter somente um "Brasil"
  var paises = {'Brasil', 'Brasil'};
  print(paises);
}
```

Se construímos um objeto usando `{ }` e ele possui pelo menos um elemento "comum", ele é um **conjunto**. Se construírmos um objeto usando o mesmo operador e ele não contiver elemento algum, ele é um **mapa**. Estudaremos sobre mapas adiante.

```dart
void main(List<String> arguments) {
  //tem um elemento, é um conjunto _Set<int>
  var numeros = {1};
  print(numeros.runtimeType);
  //vazio, é um _Map <dynamic, dynamic>
  //estudaremos mais sobre mapas adiante
  var nomes = {};
  print(nomes.runtimeType);
  //aqui estamos dizendo que ele contém Strings
  //com type annotation
  //é um conjunto _Set <String>
  var paises = <String>{};
  print(paises.runtimeType);
  //esse é um mapa com type annotation _Map<int, bool>
  var maiores = <int, bool>{};
  print(maiores.runtimeType);
}
```

Não podemos "indexar" um conjunto.

```dart
void main(List<String> arguments) {
  var nomes = {'Ana', 'João'};
  //erro em tempo de compilação
  print(nomes[0]);
  //também não dá, não existe esse operador
  print(nomes{0});
}
```

Podemos acessar um elemento com o método `elementAt`. A primeira posição válida também é zero, assim como ocorre com as listas. Além disso, também podemos iterar sobre um conjunto.

```dart
void main(List<String> arguments) {
  var nomes = {'Ana', 'João'};
  print(nomes.elementAt(0));
  //while comum (for e do/while também vale)
  for (int i = 0; i < nomes.length; i++){
    print(nomes.elementAt(i));
  }
  //for each
  for (final nome in nomes){
    print(nome);
  }
  //RangeError
  print(nomes.elementAt(2));
}
```

Matematicamente, as operações mais comuns envolvendo conjuntos são

* **união**. Se A e B são conjuntos, a sua união é um conjunto contendo todos os elementos contidos em A e todos os elementos contidos em B.
* **interseção**. Se A e B são conjuntos, a sua interseção é um conjunto contendo os elementos contidos simultaneamente em A e em B.
* **diferença**. Se A e B são conjuntos, $A \setminus B$ denota a diferença de A em relação a B e ela é o conjunto que contém todos os elementos de A que não são elementos de B. $B \setminus A$ é o conjunto que contém todos os elementos de B que não estão contidos em A.

```dart
void main(List<String> arguments) {
  var A = {1, 2, 3, 4, 5, 6};
  var B = {1, 3, 7};
  //1, 2, 3, 4, 5, 6, 7
  print(A.union(B));
  //1
  print(A.intersection(B));
  //2, 4, 5, 6
  print(A.difference(B));
  //7
  print(B.difference(A));
  //conjunto vazio
  print(A.difference(A));
}
```

<aside class="positive">

**Exercício.** Complete o seguinte programa. Ele deve mostrar

* Todos os países em que se fala português e todos os países da Europa.
* Todos os países em que se fala português e que são europeus.
* Todos os países em que se fala português e que não são europeus.
* Todos os países exceto aqueles em que se fala português e que são europeus (simultaneamente).

</aside>

```dart
void main(List<String> arguments) {
  var portugues = {'Brasil', 'Portugal'};
  var europa = {'Alemanha', 'Portugal', 'Espanha'};
}
```

## Mapas
Duration: 15:00

Um **mapa** é uma coleção de pares chave/valor. Em outras linguagens, são muitas vezes chamados de dicionários.

<aside class="positive">

**Nota.** Tanto chave quanto valor podem ser de tipos quaisquer.

</aside>

```dart
void main(List<String> arguments) {
  var pessoa = {
    'nome': 'Ana',
    'idade': 22,
    'altura': 1.8
  };
  //_Map<String, Object>
  print(pessoa.runtimeType);
  var lembretes = {
    1: 'comprar café',
    2: 'ver um filme'
  };
  //_Map<int, String>
  print(lembretes.runtimeType);
}
```

Um mapa não pode conter chaves iguais, embora isso não seja um erro em tempo de compilação/execução. Se digitarmos um valor literal de mapa com duas chaves iguais, somente um deles prevalecerá, em geral, o último.

```dart
void main(List<String> arguments) {
  var pessoa = {
    'nome': 'Pedro',
    'nome': 'Ana'
  };
  print(pessoa);
}
```

Mapas podem ser declarados sem utilizar a inferência de tipo e também utilizando type annotations.

```dart
void main(List<String> arguments) {
  //sem inferência de tipo
  Map<String, Object> pessoa = {
    'nome': 'Pedro',
    'idade': 22
  };
  print(pessoa);
  //com type annotation
  var pessoa2 = <String, Object>{
    'nome': 'Ana',
    'idade': 22
  };
  print(pessoa2);
}
```

Utilizamos o operador `[ ]` para acessar os elementos de um mapa. Como "índice", utilizamos a chave de interesse. O resultado é o valor associado a ela. O acesso a um mapa utilizando uma chave que ele não possui produz o valor null.

```dart
void main(List<String> arguments) {
  var pessoa = {
    'nome': 'Pedro',
    'idade': 22
  };
  //não dá
  //print(pessoa.nome);
  //ok
  print(pessoa['nome']);
  //ok
  print(pessoa['idade']);
  //null
  print(pessoa['altura']);
}
```

### O operador as

Suponha que tenhamos um mapa cujos valores são do tipo "dynamic". Qual o resultado do seguinte programa?

```dart
void main(List<String> arguments) {
  var pessoa = <String, dynamic>{
    'nome': 'Pedro',
    'idade': 22
  };
  //String, tipo conhecido em tempo de execução
  print(pessoa['nome'].runtimeType);
}
```

Observe, entretanto, que o ambiente em tempo de desenvolvimento não conhece o tipo do objeto e não consegue nos ajudar completando quando digitamos o operador ponto. Digite a palavra `nome` e o símbolo ponto logo a seguir. Observe que a lista mostra apenas métodos da classe `Object`. Não aparece nenhum da classe `String`.

![VS Code sugerindo, após nome seguido de ponto, apenas membros de Object como hashCode, runtimeType e toString](img/autocomplete-dynamic.webp)

*Com dynamic, o editor sugere apenas membros de Object.*

Podemos usar o operador `as` neste caso. Observe que a lista inclui os métodos da classe `String`.

![VS Code com a expressão as String aplicada ao valor do mapa e a lista de sugestões mostrando membros de String como codeUnits, isEmpty, length e contains](img/autocomplete-as-string.webp)

*Com as String, o editor passa a sugerir os membros de String.*

Observe que precisamos ter cuidado ao utilizar o operador `as`. Seu uso pode causar erros em tempo de execução.

```dart
void main(List<String> arguments) {
  var pessoa = <String, dynamic>{
    'nome': 'Pedro',
    'idade': 22
  };
  //String, tipo conhecido em tempo de execução
  print(pessoa['nome'].runtimeType);
  //agora sim, falamos o tipo explicitamente
  var nome = pessoa['nome'] as String;
  //errado mas o compilador não sabe
  var idade = pessoa['idade'] as String;
  //int não tem toUpperCase
  //erro em tempo de execução
  print(idade.toUpperCase());
}
```

### Iterando sobre mapas

Não podemos iterar sobre um mapa, utilizando um for each, por exemplo. Mas podemos iterar sobre as chaves de um mapa. Para obter as chaves, usamos o método `keys`. Também podemos iterar sobre os valores diretamente, usando o método `values` para obter a coleção de valores. Além disso, podemos iterar sobre os pares chave/valor tendo acesso a cada um deles a cada iteração, utilizando o método `entries`.

```dart
void main(List<String> arguments) {
  var pessoa = <String, dynamic>{
    'nome': 'Pedro',
    'idade': 22
  };
  //errado
  //for (var prop in pessoa){
  //  print(prop);
  //}
  //Iterable de String
  var chaves = pessoa.keys;
  print(chaves.runtimeType);
  for (final propriedade in pessoa.keys){
    print(pessoa[propriedade]);
  }
  //Iterable de dynamic
  var valores = pessoa.values;
  print(valores.runtimeType);
  for (final valor in valores){
    print(valor);
  }
  //Iterable de
  var entries = pessoa.entries;
  //MappedIterable<String, MapEntry<String, dynamic>>
  print(entries.runtimeType);
  for (final entry in pessoa.entries){
    print(entry);
    print(entry.key);
    print(entry.value);
  }
}
```

<aside class="positive">

**Exercício.** Escreva um programa que permita ao usuário armazenar a sua lista de contatos.

* Contatos possuem um nome e um número de telefone
* Deve ser possível realizar as quatro operações básicas de um CRUD
* O armazenamento deve ser feito em um mapa
* Deve haver um menu: 1-C 2-R 3-U 4-D 5-Sair.
* Um par chave/valor tem como chave o nome do contato e seu valor associado é o seu número.

</aside>

## Coleções de coleções, collection-if, collection-for e spread
Duration: 10:00

### Coleções de coleções

Uma coleção pode armazenar outras coleções. No exemplo a seguir, temos uma lista de filmes. Cada filme tem

* título
* gênero
* notas

Cada filme é representado por um mapa. Além disso, a sua coleção de notas é uma lista de inteiros.

```dart
import 'dart:io';

void main(List<String> arguments) {
  //lista de mapas
  //cada item na lista é um mapa com chave String e valor dynamic
  var filmes = <Map<String, dynamic>>[];
  print(filmes.runtimeType);
  print("Titulo?");
  String? titulo = stdin.readLineSync();
  print("Gênero?");
  String? genero = stdin.readLineSync();
  var notas = [5, 5];
  filmes.add({
    'titulo': titulo,
    'genero': genero,
    'notas': notas
  });
  print(filmes);
}
```

### Collection-if

Podemos fazer a adição condicional de elementos a uma lista. Observe.

```dart
void main(List<String> arguments) {
  var idadePedro = 17;
  var idadeCristina = 18;
  var maioresDeIdade = [
    'Ana',
    'João',
    if (idadePedro >= 18) 'Pedro',
    if (idadeCristina >= 18) 'Cristina'
  ];
  //Ana, João e Cristina
  print(maioresDeIdade);
}
```

### Collection-for

Essa construção é semelhante. Observe. Aqui estamos adicionando todos os itens de uma coleção a outra já no momento em que ela é inicializada.

```dart
void main(List<String> arguments) {
  var nomes1 = ['Ana', 'Pedro'];
  var nomes2 = [
    'Cristina',
    for (var nome in nomes1) nome
  ];
  //Cristina, Ana, Pedro
  print(nomes2);
}
```

### Operador spread

**Spread** significa algo como espalhar. O operador spread nos permite extrair os elementos de uma coleção. Ele representa todos os elementos dela, porém fora dela. Poderíamos tentar adicionar os elementos de uma lista a outra da seguinte forma.

```dart
void main(List<String> arguments) {
  var nomes1 = ['Ana', 'Pedro'];
  var nomes2 = [
    'Cristina',
    nomes1
  ];
  //Cristina, [Ana, Pedro]
  print(nomes2);
}
```

Porém, observe que o resultado obtido é uma lista que contém o nome Cristina e uma lista contendo os nomes Ana e Pedro. Não é exatamente o que desejamos. Precisamos extrair Ana e Pedro da lista antes de adicionar. Precisamos "espalhar" os elementos da lista. A expressão resultante representa os elementos fora da lista. Aí podemos fazer a adição. Observe.

```dart
void main(List<String> arguments) {
  var nomes1 = ['Ana', 'Pedro'];
  var nomes2 = [
    'Cristina',
    ...nomes1 //operador spread
  ];
  //Cristina, Ana, Pedro
  print(nomes2);
}
```

## Cópia de coleções
Duration: 5:00

No exemplo a seguir, temos a intenção de fazer uma cópia da lista. Observe, entretanto, que não é isso exatamente o que acontece. Depois da atribuição, ambas as variáveis fazem referência ao mesmo objeto.

```dart
void main(List<String> arguments) {
  var nomes = ['Ana', 'Pedro'];
  var copia = nomes;
  //alterando a copia, também alteramos a original
  //porque na verdade somente há uma lista
  //e duas variáveis fazendo referência a ela
  copia[0] = "Ana Maria";
  print(nomes);
  print(copia);
}
```

Uma cópia de fato pode ser criada de diferentes formas. Podemos usar

* Collection-for
* operador spread

```dart
void main(List<String> arguments) {
  var nomes = ['Ana', 'Pedro'];
  var copiaComCollectionFor = [for (var nome in nomes) nome];
  copiaComCollectionFor[0] = 'Ana Maria';
  var copiaComOperadorSpread = [...nomes];
  copiaComOperadorSpread[0] = 'Cristina';
  //[Ana, Pedro]
  print(nomes);
  //[Ana Maria, Pedro]
  print(copiaComCollectionFor);
  //[Cristina, Pedro]
  print(copiaComOperadorSpread);
}
```

## Exercícios
Duration: 30:00

### Exercício: filmes

Considere o trecho de código para manipulação de filmes visto em aula.

```dart
import 'dart:io';

void main(List<String> arguments) {
  //lista de mapas
  //cada item na lista é um mapa com chave String e valor dynamic
  var filmes = <Map<String, dynamic>>[];
  print(filmes.runtimeType);
  print("Titulo?");
  String? titulo = stdin.readLineSync();
  print("Gênero?");
  String? genero = stdin.readLineSync();
  var notas = [5, 5];
  filmes.add({
    'titulo': titulo,
    'genero': genero,
    'notas': notas
  });
  print(filmes);
}
```

Complete o programa da seguinte forma.

* Deve haver o clássico menu CRUD/Sair. Ou seja, o usuário deve ser capaz de adicionar novos filmes, remover filmes existentes, visualizar os filmes e atualizar dado de um filme.
* Deve haver uma opção para, dado o título de um filme, visualizar a sua média de notas.
* Deve haver uma opção para, dado o título de um filme, adicionar uma avaliação a ele.
* Ajuste a estrutura de dados para que cada avaliação possua não só o valor, mas também o nome da pessoa responsável por ela. O usuário deve digitar o nome ao fazer uma avaliação. Não admita nomes iguais.

### Lista complementar: coleções

**1.** Escreva um programa em Dart que receba, pelos argumentos do método main, uma quantidade qualquer de números inteiros. Converta os argumentos válidos e armazene-os em uma `List<int>`. Argumentos que não puderem ser convertidos devem ser ignorados, com a exibição de uma mensagem. Ao final, mostre a lista na ordem recebida, a lista em ordem inversa, o primeiro e o último número, a soma e a média aritmética. Caso nenhum inteiro válido seja recebido, informe a situação sem causar uma exceção.

<details><summary>Ver resposta</summary>

```dart
void main(List<String> arguments) {
  final numeros = <int>[];
  for (final argumento in arguments) {
    final numero = int.tryParse(argumento);
    if (numero == null) {
      print('Argumento ignorado: $argumento');
    } else {
      numeros.add(numero);
    }
  }
  if (numeros.isEmpty) {
    print('Nenhum número inteiro válido foi recebido.');
    return;
  }
  var soma = 0;
  for (final numero in numeros) {
    soma += numero;
  }
  final media = soma / numeros.length;
  print('Ordem recebida: $numeros');
  print('Ordem inversa: ${numeros.reversed.toList()}');
  print('Primeiro: ${numeros.first}');
  print('Último: ${numeros.last}');
  print('Soma: $soma');
  print('Média: ${media.toStringAsFixed(2)}');
}
```

</details>

**2.** Implemente uma fila de atendimento usando uma `List<String>`. O programa deve exibir repetidamente as opções: adicionar atendimento normal, adicionar atendimento prioritário, chamar a próxima pessoa, visualizar a fila e sair. Atendimentos normais entram no final da lista e prioritários entram na posição zero. Não permita nomes vazios nem repetidos. Ao chamar alguém, remova e mostre o primeiro nome da fila; se ela estiver vazia, exiba uma mensagem apropriada.

<details><summary>Ver resposta</summary>

```dart
import 'dart:io';

void main() {
  final fila = <String>[];
  while (true) {
    print('\n1-Normal 2-Prioritário 3-Chamar 4-Ver fila 5-Sair');
    final opcao = stdin.readLineSync()?.trim() ?? '';
    if (opcao == '1' || opcao == '2') {
      print('Nome:');
      final nome = stdin.readLineSync()?.trim() ?? '';
      if (nome.isEmpty) {
        print('O nome não pode ser vazio.');
      } else if (fila.contains(nome)) {
        print('Esse nome já está na fila.');
      } else if (opcao == '1') {
        fila.add(nome);
        print('Atendimento normal adicionado.');
      } else {
        fila.insert(0, nome);
        print('Atendimento prioritário adicionado.');
      }
    } else if (opcao == '3') {
      if (fila.isEmpty) {
        print('A fila está vazia.');
      } else {
        final chamado = fila.removeAt(0);
        print('Próxima pessoa: $chamado');
      }
    } else if (opcao == '4') {
      print(fila.isEmpty ? 'A fila está vazia.' : 'Fila: $fila');
    } else if (opcao == '5') {
      break;
    } else {
      print('Opção inválida.');
    }
  }
}
```

</details>

**3.** Cadastre exatamente três produtos em uma lista de records do tipo `List<(String, double, int)>`. Cada record deve armazenar, nessa ordem, nome, preço unitário e quantidade em estoque. Depois do cadastro, mostre todos os produtos, o valor total do estoque e os dados do produto com maior preço unitário. Não aceite nome vazio, preço negativo nem quantidade negativa.

<details><summary>Ver resposta</summary>

```dart
import 'dart:io';

void main() {
  final produtos = <(String, double, int)>[];
  for (var i = 1; i <= 3; i++) {
    String nome;
    do {
      print('Nome do produto $i:');
      nome = stdin.readLineSync()?.trim() ?? '';
    } while (nome.isEmpty);
    double? preco;
    do {
      print('Preço unitário:');
      preco = double.tryParse(
        (stdin.readLineSync() ?? '').replaceAll(',', '.'),
      );
    } while (preco == null || preco < 0);
    int? quantidade;
    do {
      print('Quantidade em estoque:');
      quantidade = int.tryParse(stdin.readLineSync() ?? '');
    } while (quantidade == null || quantidade < 0);
    produtos.add((nome, preco, quantidade));
  }
  var valorTotal = 0.0;
  var maisCaro = produtos.first;
  for (final produto in produtos) {
    final subtotal = produto.$2 * produto.$3;
    valorTotal += subtotal;
    if (produto.$2 > maisCaro.$2) {
      maisCaro = produto;
    }
    print(
      '${produto.$1}: R\$ ${produto.$2.toStringAsFixed(2)} '
      '- ${produto.$3} unidade(s)',
    );
  }
  print('Valor total: R\$ ${valorTotal.toStringAsFixed(2)}');
  print(
    'Maior preço: ${maisCaro.$1} '
    '(R\$ ${maisCaro.$2.toStringAsFixed(2)})',
  );
}
```

</details>

**4.** Escreva um programa que leia as habilidades dos integrantes de duas equipes. Para cada equipe, leia uma habilidade por vez até que o usuário digite uma linha vazia e armazene os valores em um `Set<String>`, eliminando automaticamente repetições. Em seguida, mostre: todas as habilidades presentes nas equipes, as habilidades comuns às duas, as exclusivas da primeira e as exclusivas da segunda.

<details><summary>Ver resposta</summary>

```dart
import 'dart:io';

Set<String> lerHabilidades(String equipe) {
  final habilidades = <String>{};
  print('Habilidades da $equipe; linha vazia encerra:');
  while (true) {
    final habilidade = stdin.readLineSync()?.trim() ?? '';
    if (habilidade.isEmpty) {
      break;
    }
    habilidades.add(habilidade.toLowerCase());
  }
  return habilidades;
}

void main() {
  final equipeA = lerHabilidades('equipe A');
  final equipeB = lerHabilidades('equipe B');
  print('Todas: ${equipeA.union(equipeB)}');
  print('Comuns: ${equipeA.intersection(equipeB)}');
  print('Exclusivas da equipe A: ${equipeA.difference(equipeB)}');
  print('Exclusivas da equipe B: ${equipeB.difference(equipeA)}');
}
```

</details>

**5.** Crie um contador de palavras usando um `Map<String, int>`. Leia uma palavra por vez até que seja digitada uma linha vazia. Considere iguais palavras que diferem apenas entre letras maiúsculas e minúsculas. Ao final, percorra os pares chave/valor do mapa e mostre cada palavra acompanhada de sua quantidade de ocorrências, além do número de palavras distintas.

<details><summary>Ver resposta</summary>

```dart
import 'dart:io';

void main() {
  final ocorrencias = <String, int>{};
  print('Digite uma palavra por linha; linha vazia encerra:');
  while (true) {
    final palavra = stdin.readLineSync()?.trim().toLowerCase() ?? '';
    if (palavra.isEmpty) {
      break;
    }
    if (ocorrencias.containsKey(palavra)) {
      ocorrencias[palavra] = ocorrencias[palavra]! + 1;
    } else {
      ocorrencias[palavra] = 1;
    }
  }
  for (final entry in ocorrencias.entries) {
    print('${entry.key}: ${entry.value} ocorrência(s)');
  }
  print('Palavras distintas: ${ocorrencias.length}');
}
```

</details>

**6.** Implemente um boletim usando um `Map<String, List<double>>`, no qual a chave é o nome de uma disciplina e o valor é sua lista de notas. O menu deve permitir cadastrar uma disciplina, adicionar uma nota a uma disciplina existente, mostrar o boletim completo e sair. Não aceite disciplinas vazias ou repetidas, nem notas fora do intervalo de 0 a 10. Ao mostrar o boletim, exiba as notas e a média de cada disciplina; uma disciplina sem notas deve aparecer com a indicação “sem notas”.

<details><summary>Ver resposta</summary>

```dart
import 'dart:io';

void main() {
  final boletim = <String, List<double>>{};
  while (true) {
    print('\n1-Cadastrar disciplina 2-Adicionar nota');
    print('3-Mostrar boletim 4-Sair');
    final opcao = stdin.readLineSync()?.trim() ?? '';
    if (opcao == '1') {
      print('Nome da disciplina:');
      final disciplina = stdin.readLineSync()?.trim() ?? '';
      if (disciplina.isEmpty) {
        print('O nome não pode ser vazio.');
      } else if (boletim.containsKey(disciplina)) {
        print('A disciplina já existe.');
      } else {
        boletim[disciplina] = <double>[];
        print('Disciplina cadastrada.');
      }
    } else if (opcao == '2') {
      print('Disciplina:');
      final disciplina = stdin.readLineSync()?.trim() ?? '';
      if (!boletim.containsKey(disciplina)) {
        print('Disciplina não encontrada.');
        continue;
      }
      print('Nota de 0 a 10:');
      final nota = double.tryParse(
        (stdin.readLineSync() ?? '').replaceAll(',', '.'),
      );
      if (nota == null || nota < 0 || nota > 10) {
        print('Nota inválida.');
      } else {
        boletim[disciplina]!.add(nota);
        print('Nota adicionada.');
      }
    } else if (opcao == '3') {
      if (boletim.isEmpty) {
        print('Nenhuma disciplina cadastrada.');
        continue;
      }
      for (final entry in boletim.entries) {
        final notas = entry.value;
        if (notas.isEmpty) {
          print('${entry.key}: sem notas');
          continue;
        }
        var soma = 0.0;
        for (final nota in notas) {
          soma += nota;
        }
        final media = soma / notas.length;
        print('${entry.key}: $notas - média ${media.toStringAsFixed(2)}');
      }
    } else if (opcao == '4') {
      break;
    } else {
      print('Opção inválida.');
    }
  }
}
```

</details>

**7.** Leia cinco observações textuais e armazene-as em uma `List<String?>`. Quando a entrada for vazia, armazene null; caso contrário, armazene o texto sem espaços no início e no fim. Depois, percorra a lista e mostre a posição e o conteúdo de cada observação preenchida, indique as posições sem resposta e informe quantas observações ficaram ausentes.

<details><summary>Ver resposta</summary>

```dart
import 'dart:io';

void main() {
  final observacoes = <String?>[];
  for (var i = 1; i <= 5; i++) {
    print('Observação $i:');
    final texto = stdin.readLineSync()?.trim();
    observacoes.add(texto == null || texto.isEmpty ? null : texto);
  }
  var ausentes = 0;
  for (var i = 0; i < observacoes.length; i++) {
    final observacao = observacoes[i];
    if (observacao == null) {
      ausentes++;
      print('Posição ${i + 1}: sem resposta');
    } else {
      print('Posição ${i + 1}: $observacao');
    }
  }
  print('Observações ausentes: $ausentes');
}
```

</details>

**8.** Monte dinamicamente as opções de um sistema usando collection-for e collection-if. O programa deve ler um perfil, que pode ser aluno ou admin, e depois ler nomes de módulos até receber uma linha vazia. Crie uma única lista literal contendo: “Início”; uma opção “Acessar NOME” para cada módulo informado; “Gerenciar usuários” somente para o perfil admin; “Resumo dos módulos” somente quando houver pelo menos um módulo; e “Sair”. Não use add para montar essa lista. Por fim, numere e mostre todas as opções.

<details><summary>Ver resposta</summary>

```dart
import 'dart:io';

void main() {
  String perfil;
  do {
    print('Perfil (aluno ou admin):');
    perfil = stdin.readLineSync()?.trim().toLowerCase() ?? '';
  } while (perfil != 'aluno' && perfil != 'admin');
  final modulos = <String>[];
  print('Digite os módulos; linha vazia encerra:');
  while (true) {
    final modulo = stdin.readLineSync()?.trim() ?? '';
    if (modulo.isEmpty) {
      break;
    }
    modulos.add(modulo);
  }
  final opcoes = <String>[
    'Início',
    for (final modulo in modulos) 'Acessar $modulo',
    if (perfil == 'admin') 'Gerenciar usuários',
    if (modulos.isNotEmpty) 'Resumo dos módulos',
    'Sair',
  ];
  for (var i = 0; i < opcoes.length; i++) {
    print('${i + 1} - ${opcoes[i]}');
  }
}
```

</details>

**9.** Considere duas listas de tarefas, uma de tarefas prioritárias e outra de tarefas regulares. Crie uma terceira lista que reúna os elementos das duas, com as prioritárias primeiro, usando o operador spread e sem produzir uma lista aninhada. Em seguida, faça duas cópias independentes da lista resultante: uma com spread e outra com collection-for. Altere um elemento de cada cópia e mostre as três listas para comprovar que a lista original não foi modificada.

<details><summary>Ver resposta</summary>

```dart
void main() {
  final prioritarias = <String>['Corrigir falha de acesso', 'Revisar entrega'];
  final regulares = <String>['Atualizar documentação', 'Organizar arquivos'];
  final tarefas = <String>[...prioritarias, ...regulares];
  final copiaComSpread = <String>[...tarefas];
  final copiaComCollectionFor = <String>[for (final tarefa in tarefas) tarefa];
  copiaComSpread[0] = 'Tarefa alterada na cópia com spread';
  copiaComCollectionFor[1] = 'Tarefa alterada na cópia com collection-for';
  print('Original: $tarefas');
  print('Cópia com spread: $copiaComSpread');
  print('Cópia com collection-for: $copiaComCollectionFor');
}
```

</details>

**10.** Desenvolva um sistema de inscrições em oficinas usando um `Map<String, Set<String>>`. Cada chave representa o nome de uma oficina e o conjunto associado contém os nomes de seus participantes. O menu deve permitir criar uma oficina, inscrever uma pessoa, cancelar uma inscrição, listar todas as oficinas com seus participantes e sair. Não aceite nomes vazios, oficinas repetidas nem a mesma pessoa duas vezes na mesma oficina. As operações de inscrição e cancelamento devem verificar se a oficina existe.

<details><summary>Ver resposta</summary>

```dart
import 'dart:io';

void main() {
  final oficinas = <String, Set<String>>{};
  while (true) {
    print('\n1-Criar oficina 2-Inscrever pessoa 3-Cancelar inscrição');
    print('4-Listar 5-Sair');
    final opcao = stdin.readLineSync()?.trim() ?? '';
    if (opcao == '1') {
      print('Nome da oficina:');
      final oficina = stdin.readLineSync()?.trim() ?? '';
      if (oficina.isEmpty) {
        print('O nome não pode ser vazio.');
      } else if (oficinas.containsKey(oficina)) {
        print('Essa oficina já existe.');
      } else {
        oficinas[oficina] = <String>{};
        print('Oficina criada.');
      }
    } else if (opcao == '2') {
      print('Oficina:');
      final oficina = stdin.readLineSync()?.trim() ?? '';
      if (!oficinas.containsKey(oficina)) {
        print('Oficina não encontrada.');
        continue;
      }
      print('Nome da pessoa:');
      final pessoa = stdin.readLineSync()?.trim() ?? '';
      if (pessoa.isEmpty) {
        print('O nome não pode ser vazio.');
      } else if (!oficinas[oficina]!.add(pessoa)) {
        print('Essa pessoa já está inscrita.');
      } else {
        print('Inscrição realizada.');
      }
    } else if (opcao == '3') {
      print('Oficina:');
      final oficina = stdin.readLineSync()?.trim() ?? '';
      if (!oficinas.containsKey(oficina)) {
        print('Oficina não encontrada.');
        continue;
      }
      print('Nome da pessoa:');
      final pessoa = stdin.readLineSync()?.trim() ?? '';
      if (pessoa.isEmpty) {
        print('O nome não pode ser vazio.');
      } else if (oficinas[oficina]!.remove(pessoa)) {
        print('Inscrição cancelada.');
      } else {
        print('A pessoa não estava inscrita nessa oficina.');
      }
    } else if (opcao == '4') {
      if (oficinas.isEmpty) {
        print('Nenhuma oficina cadastrada.');
        continue;
      }
      for (final entry in oficinas.entries) {
        if (entry.value.isEmpty) {
          print('${entry.key}: sem participantes');
        } else {
          print('${entry.key}: ${entry.value}');
        }
      }
    } else if (opcao == '5') {
      break;
    } else {
      print('Opção inválida.');
    }
  }
}
```

</details>

## Encerramento
Duration: 3:00

Parabéns! Você concluiu a série de introdução ao Dart. Neste codelab, trabalhou com listas, tuplas, conjuntos e mapas, lidou com null em coleções, usou o operador `as`, montou coleções de coleções e aplicou collection-if, collection-for e o operador spread, inclusive para copiar coleções.

### Referências

* Dart programming language | Dart. Google, 2023. Disponível em [https://dart.dev/](https://dart.dev/). Acesso em agosto de 2023.
