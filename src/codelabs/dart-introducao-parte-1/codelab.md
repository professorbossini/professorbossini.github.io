summary: Dê os primeiros passos na linguagem Dart: DartPad, tipos de dados, strings, conversões, operadores, var/final/const, if/else e switch/case (incluindo switch expressions e patterns).
id: dart-introducao-parte-1
categories: Flutter
tags: dart,dartpad,tipos,operadores,final,const,if,switch,patterns
status: Published
authors: Rodrigo Bossini
last updated: 2023-08-09
pdf: dart_flutter/01_apostila_dart_introducao.pdf
exercicios: dart_flutter/01_exercicios_dart_introducao.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Introdução ao Dart, parte 1: tipos, operadores e seleção

## Visão geral
Duration: 3:00

Dart é uma linguagem de programação criada pelo Google em 2011, cuja versão 1.0 foi liberada em 2013. É a linguagem usada pelo Flutter. Este é o primeiro codelab de uma série de três sobre os fundamentos da linguagem.

### O que você vai aprender

* As principais características da linguagem Dart e de seus compiladores (just in time e ahead of time)
* Como consultar a documentação oficial e usar o DartPad
* Como escrever um "Hello, World" e comentários (inclusive de documentação)
* Os tipos de dados `int`, `double`, `num`, `String` e `bool`, e as regras para identificadores
* Concatenação, interpolação e multiplicação de strings
* Conversão entre tipos
* Operadores aritméticos, relacionais, lógicos e o operador ternário
* O sistema de tipos gradual de Dart, `dynamic` e inferência de tipos com `var`
* Constantes com `final` e `const`
* As estruturas de seleção `if/else` e `switch/case`, incluindo switch expressions

### O que você vai precisar

* Um navegador com acesso ao [DartPad](https://dartpad.dartlang.org/)
* Opcionalmente, o SDK do Dart instalado localmente

## Características da linguagem
Duration: 5:00

Vejamos algumas das principais características de Dart.

**Dart é uma linguagem compilada e interpretada.**

Código Dart pode ser compilado para:

* código de máquina (Linux, MacOS, Windows);
* Web (Javascript e WebAssembly (baixo nível como assembly, desempenho quase nativo, integrável com Javascript));
* Mobile (Android e iOS).

Dart possui compiladores **Just in time** e **Ahead of time**.

Seu compilador **just in time** tem as seguintes características:

* Código compilado apenas no momento em que for executado.
* Compilação sob demanda (somente arquivos acessados são compilados).
* Desenvolvedor não precisa esperar que a aplicação seja compilada por completo para testá-la.
* A cada nova alteração de código, não há a necessidade de recompilar a aplicação.
* Viabiliza o hot reload.
* Se fossemos fazer o deploy da aplicação, seria necessário incluir o código fonte original e o compilador (que, por si só, pode ser maior que a aplicação).
* Próprio para desenvolvimento e testes.

Seu compilador **ahead of time**:

* Aplicação compilada por completo, antes de ser colocada em execução.
* Código fonte original e compilador não são incluídos no produto final.
* Aplicação mais "leve" (menos bytes).
* Próprio para deploy em produção.

Dart dá suporte aos seguintes paradigmas: Orientação a Objetos, Funcional, Imperativo e Reflexivo (inspeção da estrutura do programa em tempo de execução).

Seu sistema de tipos é **gradual**. Uma espécie de mistura de tipagem estática e dinâmica que veremos em breve. Também inclui inferência de tipos.

## Documentação oficial e DartPad
Duration: 5:00

### Documentação oficial

A documentação oficial de Dart, semelhante ao Javadoc do Java, pode ser encontrada em

[https://api.dart.dev/stable](https://api.dart.dev/stable)

As principais classes, como `String`, `int`, `bool` etc se encontram no pacote `dart:core`. Veja.

![Página da biblioteca dart:core na documentação oficial, com a lista de classes destacada à direita](img/documentacao-dart-core.webp)

*A biblioteca dart:core na documentação oficial.*

### DartPad - Editor online

O ambiente Dart inclui o **DartPad**, um editor on-line que viabiliza a execução de testes rápidos, particularmente útil para quem está começando. Ele pode ser visitado em

[https://dartpad.dartlang.org/](https://dartpad.dartlang.org/)

Ao visitar o DartPad, você verá três regiões e um botão para execução do código.

* A região principal em que escrevemos código.
* O **Console**. Ele exibe o resultado do programa após clicarmos no botão para execução.
* **Documentation**. Exibe a documentação do item sobre o qual clicarmos.

O exemplo a seguir mostra um trecho de código que veio pré-definido no momento em que abrimos o DartPad. Nele, já clicamos no botão para execução e, a seguir, clicamos sobre a função `print`, a fim de exibir a sua documentação.

![DartPad com um laço que imprime hello 1 a hello 5 no console e a documentação da função print no painel Documentation](img/dartpad-regioes.webp)

*As regiões do DartPad: editor, Console e Documentation.*

Para começarmos nossos testes, apague todo o código pré-definido. Observe que não é possível executar um programa que não possua uma **função principal**.

![DartPad com o editor vazio e o console exibindo o erro No 'main' method found](img/dartpad-sem-main.webp)

*Sem a função main, o DartPad acusa erro de compilação.*

## Hello, World e comentários
Duration: 6:00

### Hello, World com Dart

Para escrever um programa "Hello, World" com Dart, o primeiro passo é definir uma função principal. Veja.

```dart
void main() {

}
```

A função `print` é responsável por exibir conteúdo no console. Strings são delimitadas por aspas simples ou duplas. Não se esqueça de incluir o ponto-e-vírgula no final.

```dart
void main() {
  print('Hello, World');
}
```

### Comentários em Dart

Há dois tipos de comentários em Dart. Aqueles de uma única linha e aqueles de múltiplas linhas. Veja.

```dart
void main() {
  //sou um comentário de uma única linha
  /**
   *
   * Sou um comentário de múltiplas linhas
   */
}
```

Há também os comentários utilizados para gerar **documentação**. Se precisar de uma única linha, use barras triplas (`///`). Se precisar de múltiplas linhas, use `/**` para começar e `*/` para terminar. Lembre-se de clicar no nome da função `main` para ver a documentação no DartPad. Veja um exemplo de comentário de documentação de única linha.

```dart
/// doc para a função main com uma só linha
void main(){


}
```

![DartPad exibindo, no painel Documentation, o texto do comentário de documentação de uma linha da função main](img/doc-uma-linha.webp)

*Comentário de documentação de uma única linha.*

Agora um exemplo de comentário de documentação de múltiplas linhas.

```dart
/**
 * Doc para a função main
 * usando
 * múltiplas
 * linhas
 *
 **/
void main(){


}
```

![DartPad exibindo, no painel Documentation, o texto Doc para a função main usando múltiplas linhas](img/doc-multiplas-linhas.webp)

*Comentário de documentação de múltiplas linhas.*

Se desejarmos, podemos fazer referência a um elemento de código (como um método, classe etc) colocando seu nome dentro de colchetes. Veja a diferença.

```dart
/**
 * O que acontece
 * se o nome da função [main]
 * for colocando entre colchetes?
 **/
void main(){


}
```

![DartPad exibindo a documentação da função main com a palavra main destacada em outra cor](img/doc-colchetes.webp)

*O nome entre colchetes aparece destacado na documentação.*

No DartPad, o nome do elemento fica destacado com outra cor. Se eventualmente gerarmos essa documentação para publicação, ele se torna um link para o elemento, viabilizando a navegação entre elementos, assim como acontece na documentação oficial de Dart.

## Tipos de dados, variáveis e inicialização
Duration: 10:00

Os tipos de dados em Dart são os seguintes.

| Tipo | Observação | Exemplo |
| --- | --- | --- |
| `int` | Números inteiros (64 bits). | `int a = 2;` |
| `double` | Números reais (64 bits) | `double d = 2.5;` |
| `num` | Tipo numérico genérico. Admite a atribuição de `int` ou `double`. `num` é superclasse de `int` e de `double`. | `num n1 = 2;` `num n2 = 2.5;` |
| `String` | Uma sequência de zero ou mais caracteres representados em UTF-16. Pode ser delimitada por **aspas simples ou duplas**. Podemos criar strings de **múltiplas linhas** usando aspas simples ou duplas "triplas". Podemos criar strings "**raw**" precedendo o seu valor com a letra `r`. Assim, caracteres de escape são ignorados. | `String s1 = 'abc';` `String s2 = "abc";` `String s3 = '''uma string de múltiplas linhas com aspas simples''';` `String s4 = """uma string de múltiplas linhas com aspas duplas""";` `String s5 = r'O \n serve para pular uma linha';` |
| `bool` | Valores booleanos | `bool deMaior = false;` `bool alto = true;` |

<aside class="positive">

**Nota.** Há outros tipos em Dart, como Records, Lists, Sets, Maps, Runes e Symbols, os quais estudaremos em outro momento. Veja mais em [https://dart.dev/language/built-in-types](https://dart.dev/language/built-in-types).

</aside>

Os identificadores (nomes de variáveis, métodos, classes etc) devem estar de acordo com as seguintes regras.

* Podem incluir letras maiúsculas.
* Podem incluir letras minúsculas.
* Podem incluir dígitos.
* Podem incluir o símbolo underscore (`_`).
* Podem incluir o símbolo `$`.
* Não podem começar com dígito.

<aside class="positive">

**Nota.** É comum utilizar a notação **camel case** em programas Dart.

</aside>

Veja um programa que faz uso de alguns dos tipos mencionados.

```dart
void main(){
  String nome = "João"; //aspas duplas
  String sobrenome = 'Silva'; //aspas simples
  String endereco = '''
  Rua B,
  número 1234,
  Vila J'''; //aspas simples triplas
  bool deMaior = false;
  int idade = 17;
  num peso = 80.5;
  double altura = 1.82;
  //string raw
  String comoPularLinha = r"Pule uma linha com \n";
  print(nome);
  print(sobrenome);
  print(endereco);
  print(deMaior);
  print(idade);
  print(peso);
  print(altura);
  print(comoPularLinha);
}
```

Se desejar, você pode exibir o tipo de uma variável com `runtimeType`. Veja alguns exemplos.

```dart
void main() {
  int a = 2;
  double b = 3.5;
  String c = "abc";
  bool d = true;
  num e = 2;
  num f = 2.2;
  print(a.runtimeType);
  print(b.runtimeType);
  print(c.runtimeType);
  print(d.runtimeType);
  print(e.runtimeType);
  print(f.runtimeType);
  //também dá para exibir o tipo de literais
  print(2.runtimeType);
  print(true.runtimeType);
}
```

## Concatenação, interpolação e multiplicação de Strings
Duration: 8:00

Em Dart, concatenamos Strings utilizando o operador `+`. Veja.

```dart
void main(){
  String nome = "João";
  String sobrenome = 'Silva';
  String endereco = '''
  Rua B,
  número 1234,
  Vila J''';
  bool deMaior = false;
  int idade = 17;
  num peso = 80.5;
  double altura = 1.82;
  print('Me chamo ' + nome);
}
```

Observe que variáveis de tipos diferentes não podem ser concatenadas com `+`. Entretanto, podemos resolver isso obtendo a representação textual do objeto que desejamos envolver na concatenação. Cabe ao método `toString` produzi-las. Veja.

```dart
void main(){
  String nome = "João";
  String sobrenome = 'Silva';
  String endereco = '''
  Rua B,
  número 1234,
  Vila J''';
  bool deMaior = false;
  int idade = 17;
  num peso = 80.5;
  double altura = 1.82;
  //erro, concatenando string com int, não pode
  //print ('Minha idade é ' + idade);
  //mas podemos concatenar string com string, convertendo antes
  print('Minha idade é ' + idade.toString());
}
```

O efeito da concatenação pode ser obtido utilizando-se a **interpolação**. Em geral, o código fica mais fácil de entender, além de permitir o uso de variáveis de outros tipos além de Strings. O símbolo utilizado para a interpolação é o `$`. A notação é `$variavel` ou `${expressao}`.

```dart
void main(){
  String nome = "João";
  String sobrenome = 'Silva';
  String endereco = '''
  Rua B,
  número 1234,
  Vila J''';
  bool deMaior = false;
  int idade = 17;
  num peso = 80.5;
  double altura = 1.82;
  //interpolação com $variavel
  print('Me chamo $nome');
  //interpolação com ${expressão}
  print('Meu sobrenome é ${sobrenome}');
  //com int e double
  print("Tenho $idade anos e $peso kg");
}
```

Observe que há um espaço em branco entre o peso e a sigla kg. Talvez queiramos deixar de exibi-lo. Também é possível que desejemos avaliar uma expressão como uma soma de dois valores. Para tal, podemos usar `${expressao}`. Veja.

```dart
void main(){
  String nome = "João";
  String sobrenome = 'Silva';
  String endereco = '''Rua B,
  número 1234,
  Vila J''';
  bool deMaior = false;
  int idade = 17;
  num peso = 80.5;
  double altura = 1.82;
  print('Me chamo $nome');
  print('Meu sobrenome é ${sobrenome}');
  //com int e double
  print("Tenho $idade anos e ${peso}kg");
  print('Ano que vem terei ${idade + 1} anos.');
}
```

Podemos **multiplicar** uma string por um número inteiro N. O resultado será a concatenação da string N vezes.

```dart
void main() {
  var letra = 'x';
  print(letra * 10);
}
```

## Conversão entre tipos
Duration: 8:00

Podemos utilizar os métodos `parse` e `toString` para converter de String para número e de número para String, respectivamente. Veja.

```dart
void main(){
  //de string para int
  String idadeTextual = "25";
  int idade = int.parse(idadeTextual);
  print(idade);
  //de string para double
  String pesoTextual = '85.2';
  double peso = double.parse(pesoTextual);
  print(peso);
  //de string para num
  String alturaTextual = '1.8';
  num altura = num.parse(alturaTextual);
  print(altura);
  String logradouro = "Rua B";
  int numero = 325;
  //não podemos concatenar string com int, lembra?
  //print(logradouro + ', número: ' + numero);
  //mas podemos converter para String antes
  print(logradouro + ', número: ' + numero.toString());
}
```

Não podemos atribuir uma variável `int` a uma variável `double`, embora possamos atribuir um valor inteiro literal a um `double`. Observe. Isso acontece pois ambas as classes `int` e `double` herdam da classe `num`. Porém, a classe `int` não herda da classe `double`. Ou seja, a classe `int` não passa no teste **É-UM** `double`. Veremos mais sobre isso quando estudarmos sobre herança.

```dart
void main(){
  //aqui tudo bem, 2 é um literal inteiro
  //promoção implícita feita pelo compilador
  double d1 = 2;
  int i1 = 2;
  //erro em tempo de compilação
  //não dá pois i1 é um inteiro e d2 é um double
  //a classe int não passa no teste é-um double
  double d2 = i1;
  //podemos resolver assim
  double d2 = i1.toDouble();
  print(d2);
}
```

Observe que o tipo de coerção a seguir não existe em Dart. Se desejarmos obter a parte inteira de um número real, podemos usar métodos apropriados. Observe.

```dart
void main(){
  double a = 1.2;
  //erro
  //int b = (int) a;
  //mas podemos usar métodos
  //arredonda
  int b = a.round();
  print(b);
  //teto
  b = a.ceil();
  print(b);
  //chão
  b = a.floor();
  print(b);
}
```

<aside class="positive">

**Nota.** Mais adiante, estudaremos sobre o operador `as`.

</aside>

## Operadores aritméticos
Duration: 8:00

Vejamos os operadores aritméticos da linguagem Dart.

| Operador | Observação | Exemplo |
| --- | --- | --- |
| `+` | soma (ou concatenação de strings) | `int a = 5 + 2; // 7` `String s = "a" + "bc" //abc;` |
| `-` | Subtração | `int a = 5 - 2; //3` |
| `*` | multiplicação | `int a = 5 * 2; //10` |
| `/` | divisão real | `double a = 5 / 2; // 2.5` `//int a = 5 / 2;` é um erro, pois `5 / 2` é `double` |
| `~/` | divisão inteira | `int a = 5 ~/ 2 //2;` `//double a = 5 ~/ 2;` é um erro, pois `int` não herda de `double` |
| `%` | resto de divisão inteira | `int a = 5 % 2; // 1` |

Dart possui os seguintes **operadores aritméticos compostos**.

| Operador | Observação | Exemplo |
| --- | --- | --- |
| `+=` | soma e atribuição | `int a = 2; a += 2; //4` |
| `-=` | subtração e atribuição | `int a = 2; a -= 2; // 0;` |
| `*=` | multiplicação e atribuição | `int a = 2; a *= 2; //4` |
| `/=` | divisão real e atribuição | `double a = 5; a /= 2; //2.5` |
| `~/=` | divisão inteira e atribuição | `int a = 5; a ~/= 2; // 2` |
| `%=` | resto de divisão inteira e atribuição | `int a = 5; a %= 2; // 1` |

Assim como em outras linguagens, também temos os operadores de **incremento** e **decremento**.

| Operador | Observação | Exemplo |
| --- | --- | --- |
| `++` | Soma e incremento (pós) | `int a = 2; int b = a++; //pós incremento, b vale 2` |
| `++` | Soma e incremento (pré) | `int a = 2; int b = ++a; // pré incremento, b vale 3` |
| `--` | Subtração e decremento (pós) | `int a = 2; int b = a--; //pós decremento, b vale 2` |
| `--` | Subtração e decremento (pré) | `int a = 2; int b = --a; //pré decremento, b vale 1` |

Relembremos a diferença entre os operadores de pré e pós incremento.

* Quando a operação de incremento é a única existente no contexto, tanto faz usar pré ou pós incremento.
* Quando o contexto possui uma operação qualquer e uma operação de pré incremento, o pré incremento acontece **antes** da outra operação.
* Quando o contexto possui uma operação qualquer e uma operação de pós incremento, o pós incremento acontece **depois** da outra operação.

```dart
void main() {
  int a = 2;
  //somente pré incremento, a vale 3
  ++a;
  print(a);
  //somente pós incremento, a vale 4
  a++;
  print(a);
  //duas operações no contexto
  //print e pré incremento
  //primeiro incrementa e depois exibe
  //vai exibir 5
  print(++a);
  //duas operações no contexto
  //print e pós incremento
  //primeiro exibe e depois incrementa
  //vai exibir 5
  print(a++);
  //agora a vale 6
  print(a);
}
```

A lógica é a mesma para os operadores de pré e pós decremento.

## Operadores relacionais, lógicos e ternário
Duration: 8:00

### Operadores relacionais

Os operadores relacionais de Dart são os seguintes. Dê especial atenção aos operadores `==` e `!=` quando eles operam sobre **strings**.

| Operador | Observação | Exemplo |
| --- | --- | --- |
| `==` | comparação por igualdade | `2 == 2 //true` `2 == 3 // false` `"abc" == "abc" // true` (sim, strings são comparadas assim) `"abc" == "ab" // false` `2 == 2.0 // true` |
| `!=` | comparação por diferença | `2 != 2 // false` `2 != 3 // true` `"abc" != "abc" // false` `"abc" != "ab" //true` `2 != 2.0 // false` |
| `<` | menor | `2 < 2 // false` `2 < 3 // true` `3 < 2 // false` `2 < 2.0 // false` |
| `>` | maior | `2 > 2 // false` `2 > 3 // false` `3 > 2 // true` `2 > 2.0 // false` |
| `<=` | menor ou igual | `2 <= 2 // true` `2 <= 3 // true` `3 <= 2 // false` `2 <= 2.0 // true` |
| `>=` | maior ou igual | `2 >= 2 // true` `2 >= 3 // false` `3 >= 2 // true` `2 >= 2.0 // true` |

<aside class="negative">

**Atenção.** Strings **não** podem ser comparadas utilizando-se os operadores `<`, `>`, `<=` e `>=`.

</aside>

### Operadores lógicos

Os operadores lógicos de Dart são os seguintes.

* **Ou lógico**: `||`
* **E lógico**: `&&`
* **Negação**: `!`

Eles funcionam como esperado, de acordo com a seguinte tabela-verdade. Considere que A e B são duas expressões booleanas.

| A | B | !A | !B | A \|\| B | A && B |
| --- | --- | --- | --- | --- | --- |
| V | V | F | F | V | V |
| V | F | F | V | V | F |
| F | V | V | F | V | F |
| F | F | V | V | F | F |

### Operador ternário

Dart possui um operador ternário que opera como uma espécie de if/else de uma linha só. Veja um exemplo.

```dart
void main(){
  bool vaiChover = true;
  String levarGuardaChuva = vaiChover ? "SIM!" : "NÃO";
  print(levarGuardaChuva);
  int idade = 17;
  String podeDirigir = idade >= 18 ? "SIM!" : "NÃO";
  print(podeDirigir);
}
```

## Sistema de tipos gradual e inferência
Duration: 7:00

O sistema de tipos de Dart é **gradual**. Uma espécie de mistura de tipagem estática e dinâmica.

> **Linguagem estaticamente tipada**
>
> É aquela cuja verificação de tipo é feita pelo compilador. Exemplos de linguagens estaticamente tipadas são **Java**, **Kotlin**, **C++** e **Scala**.

> **Linguagem dinamicamente tipada**
>
> É aquela cuja verificação de tipo é feita em tempo de execução. Exemplos de linguagens dinamicamente tipadas são **Javascript** e **Python**.

> **Linguagem com sistema de tipos gradual**
>
> Possui tipagem **estática e dinâmica**. Exemplos de linguagens assim são **Typescript**, **C#** e **Dart**.

Veja os exemplos a seguir.

```dart
void main() {
  //variável estaticamente tipada (int)
  //em tempo de compilação e em tempo de execução é int
  int a = 2;
  print(a.runtimeType); //int
  //erro em tempo de compilação, tentativa de chamar um método que a classe int não possui
  //a.indexOf("b");
  //erro, atribuição de string a variável de tipo int
  //a = "abc";
  //variável dinamicamente tipada
  //em tempo de compilação não há checagem
  //em tempo de execução o tipo é int
  dynamic b = 2;
  //erro somente em tempo de execução
  //b.indexOf("2");
  print(b.runtimeType); // int
  b = "abc";
  print(b.runtimeType); // String
}
```

Dart também inclui **inferência de tipos**. Ela entra em cena quando utilizamos a palavra `var`. Veja.

```dart
void main(){
  //é claro que "João" é uma String, não precisamos dizer isso explicitamente
  //String nome = "João";
  var nome = "João";
  print(nome.runtimeType);
  //observe que uma vez que o tipo tenha sido inferido, não vale tentar mudar
  //erro, nome é String
  //nome = 2;
  //o mesmo vale para idade, que é int
  //int idade = 25;
  var idade = 25;
  print(idade.runtimeType);
  //e assim por diante
  var vaiChover = true;
  print(vaiChover.runtimeType);
  var salario = 2532.2;
  print(salario.runtimeType);
}
```

## Constantes: final versus const
Duration: 10:00

Também podemos declarar **constantes**. Isso também envolve a inferência de tipos e mais: uma vez que a variável tenha sido inicializada, o ambiente Dart não permitirá que façamos nova atribuição. Aqui vamos utilizar a palavra chave `final`.

```dart
void main(){
  final nome = "João";
  print(nome);
  final idade = 17;
  print(idade);
  //String
  print(nome.runtimeType);
  //int
  print(idade.runtimeType);
  //erro, nome é constante
  //nome = "Pedro";
  //erro, idade também é constante
  //idade++;
  //observe que podemos falar o tipo explicitamente, embora não seja necessário
  final String endereco = "Rua J";
  print(endereco);
  //String
  print(endereco.runtimeType);
  //observe que não necessariamente a inicializamos no momento em que é declarada
  final peso;
  //mas é um erro tentar usar
  //erro, peso não foi inicializada
  //print(peso);
  //erro, se não foi inicializada também não tem tipo
  //print(peso.runtimeType);
}
```

Também podemos criar constantes com a palavra `const`. São constantes criadas em **tempo de compilação** e o ambiente Dart é capaz de gerar **código otimizado** quando as utilizamos. Mas quando utilizá-las? Utilizamos constantes com `const` quando

* sabemos seu valor no momento em que são declaradas e, portanto, já as inicializamos neste momento;
* o valor atribuído é conhecido em tempo de compilação.

```dart
void main(){
  //tudo bem, inicializado com valor literal, conhecido em tempo de compilação
  const nome = "Ana";
  //também pode falar o tipo explicitamente, embora seja desnecessário
  const String sobrenome = "Silva";
  //também vale com outros tipos
  const int idade = 18;
  const bool vaiChover = true;
  const deMaior = false;
  //também vale com interpolação de string
  const nomeCompletoInterpolacao = '$nome $sobrenome';
  //e com concatenação
  const nomeCompletoConcatenacao = nome + ' ' + sobrenome;
  //String String int bool bool String String
  print('${nome.runtimeType} ${sobrenome.runtimeType} ${idade.runtimeType} ${vaiChover.runtimeType} ${deMaior.runtimeType} ${nomeCompletoInterpolacao.runtimeType} ${nomeCompletoConcatenacao.runtimeType}');
  //erro, não está sendo inicializada
  //const outroNome;
  //erro, o valor é conhecido somente em tempo de execução
  //o compilador não é responsável por chamar o método toUpperCase
  //const maiusculas = nome.toUpperCase();
  //observe que assim, tudo bem
  //o compilador é capaz de fazer continhas
  const soma = 2 + 2;
  print(soma);
  print(soma.runtimeType);
  //tudo bem também
  const n1 = 2, n2 = 3;
  const n3 = n1 + n2;
  print('$n1 + $n2 = $n3');
  var n4 = 2;
  //erro, var somente é conhecido em tempo de execução, o compilador não pode resolver
  //const n5 = n4 + 2;
  final n6 = 5;
  //com final também não dá, pois a inicialização em tempo de compilação não é obrigatória
  //const n7 = n6 + 2;
}
```

<aside class="positive">

**Nota. Como decidir entre var, final e const?** Observe que `var` resolve o problema de maneira generalizada. Tudo aquilo que fazemos com `final` e `const` podemos fazer com `var`. Então por que não apenas utilizar `var`? Pelo **princípio do menor privilégio** e pela possibilidade de **otimização de código**. Resumindo, use:

* `var`: se for necessário alterar o valor ao longo do tempo. Ou seja, se existirem funcionalidades que requeiram este privilégio.
* `final`: se após a primeira atribuição o valor não puder mais ser alterado, mas ele não for conhecido no momento em que a constante for declarada ou não for literal.
* `const`: se após a primeira atribuição o valor não puder ser mais alterado e, além disso, ele já for conhecido no momento em que a constante for declarada e for literal, conhecido em tempo de compilação.

Comece por `const`. Se não puder usar, use `final`. Se não puder, use `var`.

</aside>

## Estruturas de seleção: if/else
Duration: 6:00

Dart possui as seguintes estruturas de seleção.

* If, if/else, if/else encadeado, if/else aninhado
* Switch/case (switch statements, switch expressions)

Veja algumas variações da estrutura if/else.

```dart
void main(){
  //if sem else (lembre-se do efeito das chaves)
  const idade = 19;
  if (idade > 18)
    print('Pode dirigir'); //dentro do if
  print('Até logo'); //fora do if
  if (idade > 18){
    //dentro do if
    print('Pode dirigir');
  }
  //fora do if
  print("Até logo");
  //if/else
  const nome = "Ana";
  if (nome.startsWith('A'))
    print('O nome começa com A');
  else
    print('O nome não começa com A');
  //também pode usar chaves (só no if, só no else ou em ambos, você escolhe)
  if (nome.startsWith('A')){
    print('O nome começa com A');
  }
  else{
    print('O nome não começa com A');
  }
  //if/else encadeado
  const nota = 10;
  if (nota >= 9)
    print("A");
  else if (nota >= 7)
    print("B");
  else if (nota >= 5)
    print("C");
  else
    print("R");
  //if/else aninhado
  const numero = 18;
  if (numero % 2 == 0){
    print("É par");
    if (numero % 4 == 0)
      print("Divisível por 4");
    else
      print("Não é divisível por 4");
  }
  else{
    print("É ímpar");
    if (numero % 3 == 0){
      print("Divisível por 3 também");
    }
    else{
      print("Não é divisível por três");
    }
  }
}
```

## Estruturas de seleção: switch/case
Duration: 15:00

A linguagem Dart também possui a clássica estrutura **switch/case**. Veja um exemplo típico. Observe que estamos usando o comando `break` para cada cláusula `case`, supostamente enviando a lógica em queda do switch (fall-through).

```dart
void main() {
  const nota = 9;
  switch (nota) {
    case 10:
      print('A');
      break;
    case 9:
      print('A');
      break;
    case 8:
      print('B');
      break;
    case 7:
      print('C');
      break;
    case 6:
      print('D');
      break;
    case 5:
      print('E');
      break;
    default:
      print('R');
      break;
  }
}
```

Há um aspecto importante a ser considerado quanto ao funcionamento da execução fall-through do switch/case em Dart: ele somente acontece para cláusulas `case` que **não possuam comando algum**. Aquelas que possuem pelo menos um comando, como um `print`, têm um `break` implícito. Veja o exemplo a seguir.

```dart
void main() {
  //observe que o Dart não tem suporte à execução fall-through para cláusulas case não vazias (aquela em que não especificamos break e múltiplos cases são executados)
  //assim, as instruções break do primeiro exemplo são redundantes e desnecessárias
  //isso vale a partir da versão 3.0.0 do Dart
  const nota = 10;
  switch (nota) {
    case 10:
      print('A');
      //break implícito
    case 9:
      print('A');
      //break implícito
    case 8:
      print('B');
      //break implícito
    case 7:
      print('C');
      //break implícito
    case 6:
      print('D');
      //break implícito
    case 5:
      print('E');
      //break implícito
    default:
      print('R');
      //break implícito
  }
  //fall-through para cláusulas case vazias
  switch (nota) {
    case 10: //cláusula case vazia, sem break implícito, fall-through acontece
    case 9:
      print('A');
    case 8:
      print('B');
    case 7:
      print('C');
    case 6:
      print('D');
    case 5:
      print('E');
    default:
      print('R');
  }
}
```

Há uma outra forma de fazer um único tratamento para valores diferentes. Podemos utilizar o operador `||`. Veja.

```dart
void main() {
  //veja outro exemplo que permite que dois valores sejam tratados no mesmo case
  const nota = 10;
  switch (nota) {
    case 10 || 9:
      print('A');
    case 8:
      print('B');
    case 7:
      print('C');
    case 6:
      print('D');
    case 5:
      print('E');
    default:
      print('R');
  }
}
```

O switch/case de Dart também é capaz de lidar com **Strings**. Há uma restrição: as strings que aparecem nas cláusulas `case` têm de ser conhecidas em tempo de compilação.

```dart
void main(){
  //com strings
  var vaiChover = "Sim";
  switch (vaiChover){
    case 'Sim':
      print("Leve guarda chuva");
    default:
      print("Não leve guarda chuva");
  }
}
```

Também é possível manipular valores reais.

```dart
void main() {
  double nota = 9.7;
  switch (nota) {
    case > 9 && <= 10:
      print('A');
    case > 8 && <= 9:
      print('B');
    case > 7 && <= 8:
      print('C');
    case > 6 && <= 7:
      print('D');
    case > 5 && <= 6:
      print('E');
    default:
      print('R');
  }
}
```

E até listas.

```dart
void main() {
  var frutas = ['banana', 'laranja'];
  //switch com a lista inteira
  switch (frutas) {
    case ['banana', 'laranja']:
      print('banana e laranja');
    case ['banana', 'maçã']:
      print('banana e maçã');
    default:
      print('não sei');
  }
}
```

Na verdade, o switch/case de Dart é capaz de lidar com quaisquer **Patterns**. Veja mais no link a seguir.

[https://dart.dev/language/pattern-types](https://dart.dev/language/pattern-types)

Veja como utilizar o switch/case com `continue` em conjunto com um **rótulo**. Observe que não necessariamente os cases devem ser sequenciais.

```dart
void main() {
  var nota = 10;
  switch (nota) {
    case 10:
      print("Parabéns, você tirou 10!");
      continue conceito; //vai desviar para o rótulo conceito
    conceito: //rótulo
    case 9:
      print("Você tirou um A!");
  }
}
```

Há um tipo de switch chamado de **switch expression**. Ele pode ser utilizado para produzir um valor que pode ser atribuído a uma variável, por exemplo.

* O símbolo `=>` separa o valor envolvido no teste do switch do valor a ser produzido
* Cada cláusula é separada por vírgula
* Não escrevemos a palavra `case`
* O `default` é representado pelo símbolo `_`.

```dart
void main(){
  var mediaFinal = 5;
  final conceito = switch (mediaFinal){
    10 || 9 => 'A',
    8 => 'B',
    7 => 'C',
    6 => 'D',
    5 => 'E',
    _ => 'R' //_faz o papel do default
  };
  print(conceito);
}
```

## Exercícios
Duration: 30:00

### Exercícios da apostila

1. Calcule a área de um círculo com um raio de 5. (Use a fórmula da área do círculo: $\pi r^2$).
2. Encontre as raízes de uma equação quadrática com a = 1, b = -3 e c = 2. (Use a fórmula do discriminante: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$). **Nota**: pesquise sobre a biblioteca `math` na documentação oficial e descubra como importá-la.
3. Calcule o volume de uma esfera com raio 4. (Use a fórmula do volume de uma esfera: $\frac{4}{3}\pi r^3$)
4. Determine o valor final obtido pela seguinte expressão numérica: $2 + 3 \cdot 4 - (2 \cdot 3) + 2^3$.
5. Converta uma temperatura de 100 graus Fahrenheit para Celsius. (Use a fórmula: $C = (F - 32) \cdot 5/9$).
6. Converta uma temperatura de 36 graus Celsius para Fahrenheit. (Use a fórmula: $F = C \cdot 9/5 + 32$)
7. Converta uma distância de 100 quilômetros para milhas. (Use a fórmula: $M = Km \cdot 0.62137$).
8. Converta uma distância de 60 milhas para quilômetros. (Use a fórmula: $Km = M \cdot 1.60934$)
9. Converta 100 libras para quilogramas. (Use a fórmula: $Kg = Lb \cdot 0.453592$).
10. Converta 72 polegadas em metros. (1 polegada = 0.0254 metro).
11. Converta 3 litros em galões americanos. (1 litro = 0.264172 galão americano).
12. Converta 48 onças para gramas. (1 onça = 28.3495 gramas).
13. Converta 5 metros quadrados para pés quadrados. (1 metro quadrado = 10.7639 pés quadrados).
14. Converta 120 milhas por hora para metros por segundo. (1 milha por hora = 0.44704 metros por segundo).
15. Você tem um restaurante que funciona das 8h às 20h. Se um cliente chegar fora desse horário, ele deve ser informado de que o restaurante está fechado. Além disso, se o cliente vier entre as 14h e as 16h, ele deve ser informado de que é a hora do almoço.
16. Você é um bibliotecário e precisa verificar se um livro pode ser emprestado. Se o livro estiver disponível e não for um dos mais procurados, ele pode ser emprestado por 14 dias. Se for um dos mais procurados, só pode ser emprestado por 7 dias. Se o livro não estiver disponível, ele não pode ser emprestado.
17. Você é um consultor de viagens e precisa informar aos clientes sobre o clima de seu destino de viagem. Se o destino for tropical, o clima será quente. Se for no norte, será frio. Se for no deserto, será quente durante o dia e frio à noite. Se for na montanha, será frio e possivelmente com neve.
18. Você precisa calcular o IMC de uma pessoa e classificá-la como "abaixo do peso", "normal", "sobrepeso" ou "obesidade", com base nos resultados.
19. Você está analisando os dados de uma postagem nas redes sociais. Se a postagem tiver mais de 100 curtidas e mais de 50 compartilhamentos, ela será considerada "popular". Se tiver menos de 10 curtidas e menos de 5 compartilhamentos, será considerada "não popular". Todas as outras postagens serão consideradas "médias".
20. Você está planejando um evento e precisa determinar a melhor data. Se a data proposta for durante a semana de trabalho e não houver outro evento programado para o mesmo dia, ela será considerada "ótima". Se for no fim de semana ou houver outro evento no mesmo dia, será considerada "ruim".
21. Você é um analista de ações e precisa aconselhar seus clientes sobre quando comprar ou vender ações. Se a ação estiver em alta e a empresa tiver bons lucros, é hora de vender. Se a ação estiver em baixa e a empresa tiver prejuízo, é hora de comprar. Em todos os outros cenários, é melhor esperar.
22. Você está jogando um jogo de estratégia e precisa determinar a melhor ação a tomar. Se o inimigo estiver atacando e suas defesas estiverem baixas, é melhor fortalecer suas defesas. Se o inimigo estiver atacando e suas defesas estiverem fortes, é melhor contra-atacar. Se o inimigo não estiver atacando, é melhor focar na coleta de recursos.
23. Você é um meteorologista e precisa prever o tempo para amanhã. Se a pressão do ar estiver caindo e houver umidade no ar, é provável que chova. Se a pressão do ar estiver subindo e o ar estiver seco, é provável que esteja ensolarado. Em todos os outros cenários, o tempo será parcialmente nublado.
24. Você é um detetive e precisa determinar se um suspeito é culpado ou inocente. Se o suspeito tiver um álibi sólido, ele é inocente. Se o suspeito não tiver um álibi e houver evidências físicas que o liguem ao crime, ele é culpado. Em todos os outros casos, mais investigação é necessária.
25. Dados dia e mês de nascimento, determine o signo da pessoa usando switch/case.
26. Dado um alimento predefinido, seu programa deve ser capaz de exibir a quantidade de calorias desse alimento. Pesquise 5 alimentos na Internet.
27. O programa deve simular uma rodada de pedra, papel e tesoura. As escolhas do jogador e do computador podem ser predefinidas.

Resolva os seguintes exercícios do Beecrowd. Os valores "lidos" podem ser fixos no programa. Ou se desejar, pesquise sobre o pacote `dart:io`. Observe que o DartPad não tem suporte a este pacote.

* [https://www.beecrowd.com.br/judge/pt/problems/view/1008](https://www.beecrowd.com.br/judge/pt/problems/view/1008)
* [https://www.beecrowd.com.br/judge/pt/problems/view/1019](https://www.beecrowd.com.br/judge/pt/problems/view/1019)
* [https://www.beecrowd.com.br/judge/pt/problems/view/1018](https://www.beecrowd.com.br/judge/pt/problems/view/1018)

### Lista complementar: operações aritméticas

**Exercício 1 - Decomposição de um número inteiro**

Crie um programa que armazene um número inteiro de exatamente quatro algarismos.

```dart
int numero = 5837;
```

O programa deverá separar e exibir individualmente a unidade de milhar, a centena, a dezena e a unidade. Para o valor 5837, a saída deverá indicar: milhar 5, centena 8, dezena 3 e unidade 7. Utilize apenas operações aritméticas e os operadores `~/` e `%`.

**Exercício 2 - Número invertido**

Crie um programa que armazene um número inteiro de três algarismos e produza outro número contendo os mesmos algarismos em ordem inversa. Exemplo: para o número 527, o programa deverá produzir 725. Não transforme o número em String. Utilize somente operações aritméticas.

**Exercício 3 - Troco em notas e moedas**

Uma máquina precisa devolver um determinado valor inteiro em reais utilizando a menor quantidade possível de notas e moedas. Considere notas de R$ 100, R$ 50, R$ 20, R$ 10, R$ 5 e R$ 2, além de moedas de R$ 1.

```dart
int valor = 387;
```

Calcule quantas notas ou moedas de cada valor serão necessárias para representar exatamente o valor informado. Utilize os operadores `~/` e `%`.

**Exercício 4 - Diferença entre dois horários**

Considere dois horários ocorridos no mesmo dia.

```dart
int horaInicial = 8;
int minutoInicial = 37;
int segundoInicial = 45;
int horaFinal = 15;
int minutoFinal = 12;
int segundoFinal = 18;
```

Calcule o intervalo entre os dois horários e apresente o resultado no formato: X horas, Y minutos e Z segundos. Uma estratégia possível é transformar inicialmente cada horário em uma quantidade total de segundos.

**Exercício 5 - Média ponderada e nota necessária**

Um aluno possui três atividades com pesos 2, 3 e 5, respectivamente. Crie um programa que armazene as três notas e calcule a média ponderada. Depois, considere uma quarta avaliação com peso 4. Calcule qual nota o aluno precisaria obter nessa quarta avaliação para terminar com média final exatamente igual a 7,0. Não utilize estruturas condicionais.

**Exercício 6 - Distância e ponto médio**

Considere dois pontos no plano cartesiano: A(x1, y1) e B(x2, y2). Crie um programa que calcule a distância entre os pontos e as coordenadas do ponto médio.

```text
d = sqrt((x2 - x1)^2 + (y2 - y1)^2)
xm = (x1 + x2) / 2
ym = (y1 + y2) / 2
```

Utilize `import 'dart:math';` para acessar as funções matemáticas necessárias.

**Exercício 7 - Simulação de viagem**

Um motorista deseja realizar uma viagem. Considere os seguintes dados:

```dart
double distanciaKm = 735.0;
double velocidadeMedia = 95.0;
double consumoKmLitro = 11.5;
double precoLitro = 6.19;
```

Calcule o tempo estimado da viagem em horas, a quantidade de combustível necessária e o custo total de combustível. Depois, converta o tempo estimado para uma representação com quantidade de horas inteiras e minutos restantes.

**Exercício 8 - Cálculo de IMC e índice energético**

Crie um programa que armazene peso em quilogramas, altura em metros e idade. Calcule inicialmente o IMC:

```text
IMC = peso / altura^2
```

Depois, para fins exclusivamente matemáticos do exercício, converta a altura para centímetros e calcule o índice energético E:

```text
E = 10 * peso + 6.25 * alturaCm - 5 * idade
```

Apresente todos os valores utilizados e calculados. Não é necessário classificar os resultados.

**Exercício 9 - Movimento uniformemente variado**

Um veículo possui velocidade inicial, aceleração constante e tempo de movimento. Crie um programa que calcule a velocidade final e o espaço percorrido.

```text
v = v0 + a * t
s = v0 * t + (a * t^2) / 2
```

Depois, calcule também a velocidade média durante o intervalo:

```text
vm = (v0 + v) / 2
```

Considere todas as unidades no Sistema Internacional.

**Exercício 10 - Coordenadas polares e cartesianas**

Um ponto é representado por uma distância r em relação à origem e por um ângulo em graus. Crie um programa que converta esse ponto para coordenadas cartesianas.

```text
x = r * cos(theta)
y = r * sin(theta)
```

Como as funções `sin()` e `cos()` do Dart trabalham com radianos, faça primeiro a conversão:

```text
radianos = graus * pi / 180
```

Utilize `import 'dart:math';`. Apresente o valor de r, o ângulo em graus, o ângulo em radianos e as coordenadas X e Y calculadas.

## Encerramento
Duration: 3:00

Parabéns! Você conheceu as características da linguagem Dart, usou o DartPad, trabalhou com os tipos básicos, strings, conversões, operadores, constantes e as estruturas de seleção `if/else` e `switch/case`.

### Próximos passos

Siga para a parte 2 da série, que trata de estruturas de repetição, enums, instalação local do SDK, entrada e saída de dados, valores aleatórios e de um jogo de pedra, papel e tesoura.

### Referências

* Dart programming language | Dart. Google, 2023. Disponível em [https://dart.dev/](https://dart.dev/). Acesso em agosto de 2023.
