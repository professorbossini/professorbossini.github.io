summary: Aprenda os fundamentos da linguagem JavaScript: variáveis, tipos, coerção, comparação, vetores, funções, closures, JSON e o modelo de execução síncrona e assíncrona, com callbacks, promises e async/await.
id: web-javascript
categories: JavaScript
tags: javascript,variaveis,tipos,coercao,vetores,funcoes,arrow functions,closures,json,event loop,settimeout,callbacks,promises,async/await,axios
status: Published
authors: Rodrigo Bossini
last updated: 2021-03-23
pdf: tti107_ads2001/08_apostila_javascript.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Desenvolvimento com JavaScript

## Visão geral
Duration: 3:00

Neste codelab tratamos dos aspectos fundamentais da linguagem JavaScript, da representação de dados com JSON e do modelo de execução do JavaScript, que pode ser síncrono ou assíncrono.

### O que você vai aprender

* Declaração de variáveis e constantes com `let`, `var` e `const`, e o efeito de *hoisting* de `var`
* Tipos primitivos e objetos da linguagem
* Coerção implícita e explícita, e a diferença entre os operadores `==` e `===`
* Vetores e seus métodos utilitários (`filter`, `map`, `every`, `reduce`)
* Funções tradicionais, funções anônimas e *arrow functions*
* Funções de alta ordem, escopo léxico e **closures**
* Representação de dados com **JSON**
* O modelo *single threaded*, a execução síncrona (bloqueante) e assíncrona (não bloqueante), `setTimeout` e o *event loop*
* Funções *callback* e o inferno de callbacks
* **Promises**: estados, encadeamento com `then` e `catch` e construção de promises
* Consumo de um serviço web (OpenWeatherMap) com o pacote `axios`
* As palavras-chave `async` e `await`

### O que você vai precisar

* Node.js e npm instalados, para executar os exemplos (alguns deles usam os módulos `fs` e `axios`)
* Um editor de código e um terminal
* Uma conta gratuita no portal OpenWeatherMap, para o exemplo de encadeamento de promises

<aside class="positive">

**Como executar os exemplos.** Salve cada bloco de código em um arquivo `.js` e execute-o com `node nome_do_arquivo.js` no terminal. Observe a saída produzida e compare com os comentários do código.

</aside>

## Declaração de variáveis e constantes
Duration: 8:00

JavaScript é uma linguagem **dinamicamente tipada**. Isso quer dizer que o tipo de uma expressão é inferido em tempo de execução. Isso é diferente do que acontece com outras linguagens. Java, por exemplo, é uma linguagem estaticamente tipada. Isso quer dizer que o tipo das expressões é conhecido em tempo de compilação, o que permite que o compilador desempenhe diferentes tipos de validações.

Em JavaScript, há duas palavras reservadas para a declaração de variáveis: `let` e `var`. A palavra `const` é usada para a declaração de constantes. Veja o Bloco de Código 1.1.1.

**Bloco de Código 1.1.1**

```javascript
//declarando constantes
const nome = "Jose";
const idade = 27;
// aspas simples e duplas têm o mesmo efeito
const sexo = "M";
const endereco = 'Rua K, 12'
//declarando variáveis
//let: variável local com escopo de bloco
let a = 2;
let b = "abc";
//var: seu escopo é a função em que foi declarada ou global
var c = 2 + 3;
var d = "abcd"
```

A palavra `let` foi introduzida na especificação **ES6**. É preferível utilizá-la pois o funcionamento de `var` pode ser contraintuitivo. O Bloco de Código 1.1.2 mostra alguns exemplos. A palavra `var` é mantida na linguagem apenas por retrocompatibilidade.

**Bloco de Código 1.1.2**

```javascript
var linguagem = "Javascript";
console.log("Aprendendo " + linguagem);
//nome pode ser redeclarada
var linguagem = "Java";
console.log("Aprendendo, " + linguagem);

//escopo não restrito a bloco
var idade = 18;
//exibe undefined. Ou seja, a variável já existe aqui, só não teve valor atribuído.
//Ela é içada - do inglês hoist - para fora do bloco if
console.log(`Oi, ${nome}`);
if (idade >= 18) {
  var nome = "João";
  console.log(`Parabéns, ${nome}. Você pode dirigir`);
}
//ainda existe aqui
console.log(`Até mais, ${nome}.`);
```

<aside class="negative">

**Cuidado com `var`.** Repare que a variável `linguagem` pôde ser redeclarada sem erro e que `nome`, declarada dentro do bloco `if`, existe antes e depois dele. Com `let`, a redeclaração seria um erro e a variável ficaria restrita ao bloco em que foi declarada.

</aside>

## Tipos, coerção e comparação
Duration: 8:00

### Tipos

Como mencionado anteriormente, JavaScript é uma linguagem dinamicamente tipada. Veja os tipos existentes. É importante observar que valores primitivos são **imutáveis**. Objetos podem ser mutáveis ou imutáveis.

* Primitivos
  * boolean
  * null
  * number
  * string
  * undefined
* Objetos
  * JSON
  * Array
  * Classes Wrapper (String, Number, Boolean)
  * Date
  * Math
  * Funções

### Coerção

Algumas linguagens de programação possuem um mecanismo conhecido como **coerção**, do inglês *cast*. Quando dois primitivos de tipos diferentes estão envolvidos em uma expressão, um deles pode ter seu tipo alterado (mais precisamente, ser substituído por outro primitivo cujo tipo é o de interesse) para que a expressão faça sentido. A coerção se refere a essa troca de tipo. Ela pode ocorrer de maneira **explícita** ou **implícita**. Veja o Bloco de Código 1.3.1.

**Bloco de Código 1.3.1**

```javascript
const n1 = 2;
const n2 = '3';
//coerção implícita de n1, concatenação acontece
const n3 = n1 + n2;
console.log(n3);
//coeração explícita, soma acontece
const n4 = n1 + Number(n2)
console.log(n4)
```

### Comparação

JavaScript possui dois operadores de comparação.

* `==` A comparação leva em conta somente os valores envolvidos. Isso quer dizer que, caso sejam de tipos diferentes, ocorrerão coerções implícitas, as quais nem sempre têm o funcionamento mais intuitivo.
* `===` Este operador não realiza coerções. O resultado da comparação é `true` caso os valores e seus respectivos tipos forem iguais. Caso contrário, o resultado é `false`.

Veja alguns exemplos no Bloco de Código 1.4.1.

**Bloco de Código 1.4.1**

```javascript
console.log(1 == 1) //true
console.log(1 == "1") //true
console.log(1 === 1) //true
console.log(1 === "1") //false
console.log(true == 1) //true
console.log(1 == [1]) //true
console.log(null == null) //true
console.log(null == undefined) //true
console.log([] == false) //true
console.log([] == []) //false
```

O link a seguir mostra uma tabela de comparação utilizando o operador `==`. Seu funcionamento é mantido nas versões mais modernas de JavaScript por razões como a retrocompatibilidade. Entretanto, é recomendável não utilizá-lo.

[https://dorey.github.io/JavaScript-Equality-Table/unified/](https://dorey.github.io/JavaScript-Equality-Table/unified/)

## Vetores
Duration: 6:00

O Bloco de Código 1.5.1 mostra alguns exemplos de uso de vetores.

**Bloco de Código 1.5.1**

```javascript
//declaração
v1 = [];
//podemos acessar qualquer posição, começando de zero
v1[0] = 3.4;
v1[10] = 2;
v1[2] = "abc"
//aqui, v1 tem comprimento igual a 11
console.log(v1.length)
//inicializando na declaração
v2 = [2, "abc", true]
console.log(v2)
//iterando
for (let i = 0; i < v2.length; i++){
  console.log(v2[i])
}
```

Em JavaScript, vetores possuem diversos métodos utilitários. Veja os exemplos do Bloco de Código 1.5.2.

**Bloco de Código 1.5.2**

```javascript
const nomes = ["Ana Maria", "Antonio", "Rodrigo", "Alex", "Cristina"];
const apenasComA = nomes.filter((n) => n.startsWith("A"));
console.log(apenasComA);

const res = nomes.map((nome) => nome.charAt(0));
console.log(res);

const todosComecamComA = nomes.every((n) => n.startsWith("A"));
console.log(todosComecamComA);

const valores = [1, 2, 3, 4];
const soma = valores.reduce((ac, v) => ac + v);
console.log(soma);
```

## Funções
Duration: 10:00

JavaScript possui formas diferentes para se criar funções: blocos de código com nome - ou não - que podem ser colocados em execução em algum momento. A forma tradicional para se criar funções em JavaScript envolve a palavra `function`. Veja os exemplos do Bloco de Código 1.6.1.

**Bloco de Código 1.6.1**

```javascript
function hello(){
  console.log('Oi')
}
hello()
//cuidado, aqui redefinimos a função sem parâmetros
function hello(nome){
  console.log('Hello, ' + nome)
}
hello('Pedro')

function soma(a, b) {
  return a + b;
}
const res = soma(2, 3)
console.log(res)
```

### Funções anônimas

Também é possível criar funções anônimas. Uma vez criadas, elas podem ser atribuídas a variáveis ou constantes, como no Bloco de Código 1.6.2.

**Bloco de Código 1.6.2**

```javascript
const dobro = function (n) {
  return n * 2;
};
const res = dobro(4);
console.log(res);
//valor padrão para o parâmetro
const triplo = function (n = 5) {
  return 3 * n;
};
console.log(triplo());
console.log(triplo(10));
```

### Arrow functions

A terceira possibilidade envolve o recurso chamado **arrow function**. Quando escrevemos uma arrow function, especificamos somente a sua lista de parâmetros e o seu corpo. Há um símbolo `=>` - daí o nome *arrow* - entre eles. Uma arrow function não tem nome e também pode ser armazenada em constantes ou variáveis. Além disso, arrow functions têm as seguintes características.

* Quando a lista de parâmetros possui um único argumento, os parênteses podem ser omitidos.
* Quando o corpo possui uma única instrução, as chaves podem ser omitidas.
* Quando o corpo possui uma única instrução que produz um valor a ser devolvido, a instrução `return` é opcional: se usar as chaves, deve-se usar o `return`. Caso contrário, ele não pode ser usado.

Veja os exemplos do Bloco de Código 1.6.3.

**Bloco de Código 1.6.3**

```javascript
const hello = () => console.log("Hello");
hello();
const dobro = (valor) => valor * 2;
console.log(dobro(10));
const triplo = (valor) => {
  return valor * 3;
};
console.log(triplo(10));
//e agora?
const ehPar = (n) => {
  n % 2 === 0;
};
console.log(ehPar(10));
```

<details><summary>Ver resposta</summary>

A função `ehPar` usa chaves no corpo, mas não usa `return`. Por isso, ela não devolve coisa alguma e `console.log(ehPar(10))` exibe `undefined`. Para funcionar, escreva `(n) => n % 2 === 0` ou mantenha as chaves e use `return n % 2 === 0;`.

</details>

## Closures
Duration: 15:00

### Funções como cidadãs de primeira classe

Para entender o que é um **closure**, é importante estudar alguns conceitos. Primeiro, em JavaScript, funções são **cidadãs de primeira classe**. Informalmente, um cidadão de primeira classe em uma linguagem de programação é uma entidade que oferece suporte a operações como as seguintes.

* Ser passada como argumento para uma função.
* Ser devolvida por uma função.
* Ser atribuída a uma variável.

O Bloco de Código 1.7.1 mostra como funções em JavaScript podem estar envolvidas em todas as operações mencionadas. Há também o conceito de **função de alta ordem**. Uma função de alta ordem é aquela que recebe pelo menos uma função como parâmetro e/ou devolve uma função quando seu processamento termina.

**Bloco de Código 1.7.1**

```javascript
/*uma função pode ser atribuída
a uma variável*/
let umaFuncao = function () {
  console.log("Fui armazenada em uma variável");
}
//e pode ser chamada assim
umaFuncao()
/*f recebe uma função como parâmetro e, por isso
é uma função de alta ordem.
Por devolver uma função, g também é de alta ordem.
*/
function f(funcao) {
  //chamando a função
  //note como a tipagem dinâmica tem seu preço
  funcao()
}
function g() {
  function outraFuncao(){
    console.log("Fui criada por g");
  }
  return outraFuncao;
}
//f pode ser chamada assim
f(function (){
  console.log('Estou sendo passada para f')
})
//e g pode ser chamada assim
const gResult = g()
gResult()
//e assim também
g()()
//outros testes
/* f chama g, que somente devolve uma função.
Nada é exibido.*/
f(g)
/*f chama a função devolvida por g.
"Fui criada por g" é exibido.*/
f(g())
/*f tenta chamar o que a função criada por g
devolve. Ela não devolve coisa alguma. Por isso,
um erro - somente em tempo de execução - acontece. */
f(g()())
//O que acontece?
f(1)
```

<aside class="negative">

**Erro proposital.** A chamada `f(g()())` produz um erro em tempo de execução (`TypeError: funcao is not a function`) e interrompe o script. Por isso, a última linha, `f(1)`, só será executada se você comentar a linha anterior. Faça o teste e descubra o que acontece.

</aside>

### Escopo léxico

Uma função, quando definida por outra, é chamada **função interna** e tem dois escopos: o **escopo interno** e o **escopo externo**. Seu escopo interno é delimitado pelas chaves que definem seu corpo. Seu escopo externo é delimitado pelas chaves que definem o corpo da função que a define. Seu escopo externo é também chamado de **escopo léxico**. Uma função interna pode acessar as variáveis definidas em seu escopo externo. Veja o exemplo do Bloco de Código 1.7.2.

**Bloco de Código 1.7.2**

```javascript
function f() {
  let nome = 'João';
  function g() {
    console.log(nome);
  }
  g()
}
f()
```

### Closures

Os exemplos exibidos pelo Bloco de Código 1.7.3 funcionam, muito embora as funções `ola` e `saudacoesFactory` já tenham terminado a sua execução no momento em que as funções que produzem são chamadas, o que sugere que suas variáveis locais já não estão acessíveis.

**Bloco de Código 1.7.3**

```javascript
function ola(){
  let nome = 'João';
  return function (){
    console.log('Olá, João');
  }
}

let olaResult = ola();
/*perceba que aqui a função ola já terminou.
É de se esperar que a variável nome já não
possa ser acessada.*/
olaResult();

//também vale com parâmetros
function saudacoesFactory(saudacao, nome){
  return function (){
    console.log(saudacao + ', ' + nome);
  }
}
let olaJoao = saudacoesFactory('Olá', 'João');
let tchauJoao = saudacoesFactory('Tchau', 'João');
olaJoao();
tchauJoao();
```

> **Closure**
>
> Uma função interna em conjunto com as variáveis de seu escopo externo é o que chamamos de closure.

O funcionamento de funções envolvendo closures, em alguns casos, pode ser contraintuitivo. Veja o Bloco de Código 1.7.4.

**Bloco de Código 1.7.4**

```javascript
function eAgora(){
  let cont = 1;
  function f1(){
    console.log(cont);
  }
  cont++;
  function f2(){
    console.log(cont);
  }
  //JSON contendo as duas funções
  return {f1, f2}
}

let eAgoraResult = eAgora();

/* neste momento, a funcao eAgora já
executou por completo e a variável
cont já foi incrementada. Seu valor final
é mantido e, assim, ambas f1 e f2 exibirão 2.
*/
eAgoraResult.f1();
eAgoraResult.f2();
```

## JSON - JavaScript Object Notation
Duration: 12:00

Nesta etapa tratamos da representação de dados utilizando **JSON** - *JavaScript Object Notation*.

### Intuição

JSON é um formato para representação de dados independente de tecnologia. Nos dias atuais, é de longe o mais utilizado na troca de mensagens (feitas por requisições HTTP, por exemplo) entre sistemas computacionais. A ideia é representar dados como coleções de pares **chave/valor**. Veja alguns exemplos de representações de coisas do mundo real usando JSON.

### Uma pessoa se chama João e tem 17 anos

Sua representação JSON é exibida no Bloco de Código 2.1.1.

**Bloco de Código 2.1.1**

```javascript
let pessoa = {
  nome: "João",
  idade: 17,
}
//o acesso a propriedades pode ser feito com ponto
console.log("Me chamo " + pessoa.nome);
//e com [] também
console.log("Tenho " + pessoa["idade"] + " anos");
```

### Uma pessoa se chama Maria, tem 21 anos e mora na rua B, número 121

Sua representação JSON é exibida no Bloco de Código 2.1.2.

**Bloco de Código 2.1.2**

```javascript
let pessoaComEndereco = {
  nome: "Maria",
  idade: 21,
  endereco: {
    logradouro: "Rua B",
    numero: 121,
  },
};
console.log(
  `Sou ${pessoaComEndereco.nome},
  tenho ${pessoaComEndereco.idade} anos
  e moro na rua ${pessoaComEndereco.endereco["logradouro"]}
  número ${pessoaComEndereco["endereco"]["numero"]}`
);
```

### Uma concessionária tem CNPJ e endereço

Ela possui alguns carros em estoque. Cada um deles tem marca, modelo e ano de fabricação. Sua representação JSON é exibida no Bloco de Código 2.1.3.

**Bloco de Código 2.1.3**

```javascript
let concessionaria = {
  cnpj: "00011122210001-45",
  endereco: {
    logradouro: "Rua A",
    numero: 10,
    bairro: "Vila J",
  },
  veiculos: [
    {
      marca: "Ford",
      modelo: "Ecosport",
      anoDeFabricacao: 2018,
    },
    {
      marca: "Chevrolet",
      modelo: "Onix",
      anoDeFabricacao: 2020,
    },
    {
      marca: "Volkswagen",
      modelo: "Nivus",
      anoDeFabricacao: 2020,
    },
  ],
};
for (let veiculo of concessionaria.veiculos) {
  console.log(`Marca: ${veiculo.marca}`);
  console.log(`Modelo: ${veiculo.modelo}`);
  console.log(`Ano de Fabricação: ${veiculo.anoDeFabricacao}`);
}
```

### Uma calculadora realiza as operações de soma e subtração

Nada impede que funções sejam armazenadas em objetos JSON. Veja o Bloco de Código 2.1.4.

**Bloco de Código 2.1.4**

```javascript
let calculadora = {
  //pode ser arrow function
  soma: (a, b) => a + b,
  //e função comum também
  subtracao: function (a, b) {
    return a - b;
  },
};
console.log(`2 + 3 = ${calculadora.soma(2, 3)}`);
console.log(`2 - 3 = ${calculadora.subtracao(2, 3)}`);
```

Evidentemente, há uma especificação precisa que diz o que é um objeto JSON válido. Ela pode ser encontrada na página a seguir. Visite essa página e estude os grafos sintáticos ali definidos.

[https://www.json.org/json-en.html](https://www.json.org/json-en.html)

## Execução síncrona e o modelo single threaded
Duration: 15:00

Nesta etapa e nas próximas tratamos do modelo de execução do JavaScript.

### Modelo single threaded

Ambientes de execução JavaScript são **single threaded**. Isso quer dizer que há um único fluxo de execução. Não há execução de código em paralelo. Como mostra o Bloco de Código 3.1.1, as instruções são executadas uma após a outra, na ordem em que foram definidas. Não há a possibilidade de uma instrução $i$ executar antes de outra instrução $j$ $(\forall i > j)$.

**Bloco de Código 3.1.1**

```javascript
console.log('Eu primeiro')
console.log("Agora eu")
console.log("Sempre vou ser a última...:(")
```

Este pode ser um funcionamento desejável, como mostra o Bloco de Código 3.1.2.

**Bloco de Código 3.1.2**

```javascript
const a = 2 + 7
const b = 5
//só faz sentido se os valores a e b já estiverem disponíveis
console.log(a + b)
```

Entretanto, pode ser o caso de uma determinada instrução não depender de uma outra, anterior a ela, para poder executar corretamente. Isso pode ser um problema pois a instrução que a antecede pode ser demorada. Para ilustrar essa possibilidade, vamos usar uma função cuja execução demora uma quantidade de segundos. A instrução que vem depois de sua chamada não depende do resultado que ela produz. Veja o Bloco de Código 3.1.3.

<aside class="positive">

**Nota.** Não se preocupe com o eventual *warning* sobre *memory leak*. A função `demorada` emprega uma técnica conhecida como **espera ocupada** apenas para simular um procedimento computacional demorado.

</aside>

**Bloco de Código 3.1.3**

```javascript
function demorada(){
  const atualMais2Segundos = new Date().getTime() + 2000
    //não esqueça do ;, única instrução no corpo do while
    while (new Date().getTime() <= atualMais2Segundos);
    const d = 8 + 4
    return d
}
const a = 2 + 3
const b = 5 + 9
const d = demorada()
/*
o valor de e não depende do valor devolvido
pela função demorada.
*/
const e = 2 + a + b
console.log(e)
```

### Execução assíncrona com setTimeout

Esse modelo de execução é conhecido como **síncrono** ou **bloqueante**. Ambientes JavaScript (como um navegador ou o NodeJS) são responsáveis por ele. Podemos empregar diferentes técnicas para obter um outro tipo de execução conhecido como **assíncrono** ou **não bloqueante**. Uma forma bastante simples - e antiga, embora suficiente para ilustrar didaticamente o conceito - consiste no uso da função `setTimeout`. Ela recebe dois parâmetros: uma função e um valor em milissegundos. A execução da função somente ocorre uma vez que pelo menos a quantidade de milissegundos especificada se esgote. Enquanto isso, as instruções que vêm depois da chamada à função continuam executando normalmente, sem ficar esperando. Elas não ficam **bloqueadas**. Daí o nome do modelo. Veja um exemplo no Bloco de Código 3.1.4.

**Bloco de Código 3.1.4**

```javascript
function demorada(){
  const atualMais2Segundos = new Date().getTime() + 2000
    //não esqueça do ;, única instrução no corpo do while
    while (new Date().getTime() <= atualMais2Segundos);
    const d = 8 + 4
    return d
}
const a = 2 + 3
const b = 5 + 9
//função será executada depois de, pelo menos, 500 milissegundos
setTimeout(function(){
    const d = demorada()
    console.log(d)
}, 500)

//enquanto isso, essas linhas prosseguem executando
//sem ficar esperando
const e = a + b
console.log(e)
```

### Enfileiramento

Embora o Bloco de Código 3.1.4 ilustre o processamento não bloqueante, é importante observar uma característica importante. A função que foi entregue como parâmetro à função `setTimeout` foi, na verdade, **enfileirada**. Ela somente vai executar depois de o bloco principal ter sido completamente executado. Veja o exemplo do Bloco de Código 3.1.5. Note que especificamos 0 no segundo argumento. Tecnicamente, ela poderia executar imediatamente. Porém, isso não acontecerá, devido ao enfileiramento.

**Bloco de Código 3.1.5**

```javascript
setTimeout(function(){
console.log('dentro da timeout', 0)
})
const a = new Date().getTime() + 1000
//não esqueça do ;, única instrução no corpo do while
while (new Date().getTime() <= a);
console.log('fora da timeout')
```

<aside class="positive">

**Observação.** Na apostila, o `0` aparece dentro da chamada a `console.log`, e não como segundo argumento de `setTimeout`. O resultado é o mesmo: quando o segundo argumento de `setTimeout` é omitido, o tempo de espera é 0. Se preferir deixar explícito, escreva `setTimeout(function(){ console.log('dentro da timeout') }, 0)`.

</aside>

Veja também o exemplo do Bloco de Código 3.1.6. Ele ilustra como o enfileiramento somente acontece depois de o tempo especificado no segundo parâmetro da função `setTimeout` se esgotar.

**Bloco de Código 3.1.6**

```javascript
function demorada(tempo) {
  console.log(`demorada ${tempo}`);
  const atualMaisTempo = new Date().getTime() + tempo;
  //não esqueça do ;, única instrução no corpo do while
  while (new Date().getTime() <= atualMaisTempo);
  const d = 8 + 4;
  return d;
}
setTimeout(function (){demorada(2000)}, 2000);
setTimeout(function (){demorada(1000)}, 1000);
console.log("chegou ao fim do script principal");
```

### Event loop

A figura a seguir ilustra a estrutura denominada **event loop** - algo como laço de evento em português - existente em ambientes de execução JavaScript.

![Diagrama do event loop: a fila de tarefas contém o script principal, f1 e f2. O script principal executa e chama setTimeout(f1, n) e setTimeout(f2, m); f1 entra na fila depois de pelo menos n milissegundos e f2 depois de pelo menos m milissegundos; em seguida, cada próxima função da fila é executada e, com a fila vazia, o ambiente fica esperando novas atividades](img/event-loop.webp)

*Event loop: (1) a execução começa pelo script principal; (2) f1 entra na fila depois de, pelo menos, n milissegundos; (3) f2 entra na fila depois de, pelo menos, m milissegundos; (4 e 5) a próxima função da fila é executada; (6) com a fila vazia, o ambiente fica esperando até que existam mais atividades para executar.*

## Threads do ambiente e callbacks
Duration: 10:00

### Quem cria as outras threads

Concluímos, assim, que todo o código JavaScript que escrevemos executa em uma única thread. Entretanto, é importante observar que há, de fato, instruções que executam em threads diferentes. Essas são gerenciadas pelo próprio ambiente de execução JavaScript (NodeJS, navegador etc.). Dizemos que o modelo é single threaded pois o desenvolvedor tem acesso somente a uma thread. Ele não escreve código para criar e gerenciar outras threads explicitamente. Isso fica a cargo do ambiente.

No exemplo do Bloco de Código 3.1.7 usamos um módulo para acesso ao sistema de arquivos. Fazemos a leitura do conteúdo de um arquivo. Quando ela termina, o conteúdo é exibido. Todo o código que escrevemos executa em uma única thread. Entretanto, a leitura do arquivo, realizada pela função `readFile`, pode executar em uma thread separada.

**Bloco de Código 3.1.7**

```javascript
const fs = require("fs");
const abrirArquivo = function (nomeArquivo) {
  const exibirConteudo = function (erro, conteudo) {
    if (erro) {
      console.log(`Deu erro: ${erro}`);
    } else {
      console.log(conteudo.toString());
    }
  };
  fs.readFile(nomeArquivo, exibirConteudo);
};
//crie um arquivo chamado arquivo.txt com o conteúdo "2" (sem as aspas)
//no mesmo diretório em que se encontra seu script
abrirArquivo("arquivo.txt");
```

### O inferno de callbacks

As funções que entregamos como argumento para a função `setTimeout` e a função `exibirConteudo` usada no Bloco de Código 3.1.7 são exemplos de funções **callback**. A definição de uma função callback é responsabilidade do desenvolvedor. Colocá-la em execução, por outro lado, é responsabilidade do ambiente JavaScript. Uma função callback entra em execução quando um evento determinado acontece.

Há um fenômeno conhecido como **callback hell** ou **inferno de callbacks** que consiste no aninhamento de funções callback. Veja um exemplo no Bloco de Código 3.2.1. Desejamos dobrar o valor lido do arquivo `arquivo.txt` e armazenar o valor obtido em um arquivo chamado `dobro.txt`.

**Bloco de Código 3.2.1**

```javascript
const fs = require("fs");
const abrirArquivo = function (nomeArquivo) {
  const exibirConteudo = function (erro, conteudo) {
    if (erro) {
      console.log(`Deu erro: ${erro}`);
    } else {
      console.log(conteudo.toString());
      const dobro = +conteudo.toString() * 2;
      const finalizar = function (erro){
        if(erro){
          console.log('Deu erro tentando salvar o dobro')
        }
        else{
          console.log("Salvou o dobro com sucesso");
        }
      }
      fs.writeFile('dobro.txt', dobro.toString(), finalizar);
    }
  };

  fs.readFile(nomeArquivo, exibirConteudo);
};
abrirArquivo("arquivo.txt");
```

O aninhamento de funções callback compromete a legibilidade do código. Daí o singelo nome **inferno de callbacks**. Há, ainda, outras características indesejáveis inerentes ao uso de callbacks.

* **A ordem dos parâmetros de uma função callback varia.** A função `exibirConteudo` do Bloco de Código 3.2.1, por exemplo, recebe um objeto com dados referentes a um possível erro e um objeto com os dados caso a execução ocorra com sucesso, **nesta ordem**. Outras funções callback podem ser chamadas com a ordem invertida. Não há garantia. É sempre necessário verificar a documentação antes.

## Promises: estados e encadeamento
Duration: 10:00

Desde a especificação **ECMAScript 2015**, a linguagem JavaScript conta com um recurso chamado **Promise**. Trata-se de um mecanismo próprio para a manipulação de código assíncrono que visa simplificar as características inerentes ao uso de callbacks. A sua especificação oficial pode ser vista no link a seguir.

[https://tc39.es/ecma262/#sec-promise-objects](https://tc39.es/ecma262/#sec-promise-objects)

<aside class="positive">

**Nota.** O uso de promises não implica na execução de código em paralelo. A ideia é simplificar a manipulação de código cuja execução se dá de maneira assíncrona. Como mostra a figura do event loop, no passo anterior, é possível que código assíncrono execute em uma única thread. Promises podem ser usadas tanto neste contexto quanto em outros em que exista a execução de código em paralelo gerenciada pelo ambiente JavaScript.

</aside>

> **Promise**
>
> Uma Promise é um objeto por meio do qual uma função pode propagar um resultado ou um erro em algum momento no futuro.

### Os três estados de uma promise

Como mostra a figura a seguir, uma promise pode estar em um de três estados.

![Diagrama de estados de uma promise: do estado Pending saem duas setas, uma para Fulfilled e outra para Rejected](img/promise-estados.webp)

*Estados de uma promise: Pending, Fulfilled e Rejected.*

Seu significado e transição são os seguintes.

* Quando uma promise é produzida e o processamento associado a ela ainda não está concluído, ela está no estado **Pending**.
* Quando o processamento associado a uma promise termina com sucesso, ela passa para o estado **Fulfilled**.
* Quando o processamento associado a uma promise termina com erro, ela passa para o estado **Rejected**.
* Os estados **Fulfilled** e **Rejected** são **estados finais**. Uma vez que uma promise se encontre em um desses estados, ela nunca transita para outro estado.
* Uma promise pode ser criada em qualquer um dos três estados.

### Encadeamento com then e catch

Uma das vantagens obtidas pelo uso de promises é a simplificação da passagem de parâmetros entre funções assíncronas. Como mostra a figura a seguir, a sua execução pode ser **encadeada**.

![Encadeamento de promises com then: as funções assíncronas f1, f2, f3 e f4 devolvem cada uma uma promise; quando a Promise 1 passa de Pending para Fulfilled, entrega o resultado R1 para f2 por meio de then(R1); a Promise 2 entrega R2 para f3 com then(R2); a Promise 3 entrega R3 para f4 com then(R3); f4 produz R4 e a cadeia se encerra](img/promise-then.webp)

*Encadeamento de promises em que todas terminam com sucesso: (1) a execução de f1 inicia; (2) f1 devolve uma promise e prossegue executando de maneira assíncrona; (3) eventualmente, f1 termina a sua execução, produzindo o resultado R1; (4) a Promise 1 passa de Pending para Fulfilled e entrega R1 para f2; os passos se repetem para f2, f3 e f4 até (14), quando f4 produz R4 e a cadeia de promises se encerra.*

A figura ilustra um fluxo em que todas as promises envolvidas terminam com sucesso, passando do estado Pending para o estado Fulfilled. O encadeamento, neste caso, é feito por meio da função `then`. Também pode ser o caso de alguma delas terminar com erro. Neste caso, o encadeamento é feito por meio da função `catch`. Ao longo de um encadeamento, as funções `then` e `catch` podem ser mescladas. Veja a figura a seguir.

![Encadeamento de promises mesclando then e catch: igual ao anterior, mas f2 termina com erro, a Promise 2 passa de Pending para Rejected e entrega R2 para f3 por meio de catch(R2), destacado em vermelho; depois, a Promise 3 entrega R3 para f4 com then(R3)](img/promise-catch.webp)

*Encadeamento com erro: eventualmente, f2 termina a sua execução produzindo o resultado R2, neste caso um erro (7); a Promise 2 passa de Pending para Rejected e entrega R2 para f3 por meio de catch (8).*

O uso das funções `then` e `catch` resolve um dos problemas inerentes ao uso de callbacks: não é necessário verificar a documentação de cada biblioteca utilizada para descobrir qual dos dois é entregue como primeiro argumento. O tratamento de resultados sempre se dá na função `then` e o tratamento de erros sempre se dá na função `catch`.

## Construindo promises
Duration: 12:00

Uma função cuja execução tem potencial para demorar idealmente executa de maneira assíncrona. Ela constrói um objeto do tipo `Promise` e o devolve imediatamente, no estado Pending. A seguir, prossegue com a sua computação. Ela pode terminar com sucesso ou com erro. Caso termine com sucesso, a função especificada pelo cliente no bloco `then` entra em execução. Caso contrário, aquela especificada no bloco `catch` executa.

No Bloco de Código 3.3.1, a função assíncrona devolve uma promise em estado Pending. Quando termina, ela chama a função `resolve`, o que quer dizer que a promise passou de Pending para Fulfilled.

**Bloco de Código 3.3.1**

```javascript
function calculoDemorado(numero) {
  return new Promise(function (resolve, reject) {
    let res = 0;
    for (let i = 1; i <= numero; i++) {
      res += i;
    }
    resolve(res);
  });
}
calculoDemorado(10).then((resultado) => {
  console.log(resultado)
})
```

### Promises já resolvidas

Uma função assíncrona pode também devolver uma promise cujo estado é Fulfilled. Isso pode acontecer quando ela detectar que a resposta para o problema que pretende resolver é imediata. O somatório realizado no Bloco de Código 3.3.1 utiliza força bruta. O resultado pode ser obtido por meio de uma fórmula fechada, como mostra a Equação 3.3.1.

$$\sum_{i=0}^{n} i = \frac{n(n+1)}{2} \quad \forall n \geq 0 \qquad (3.3.1)$$

Há quem diga que Gauss foi o responsável por obter esse resultado. Há também quem diga que ele é conhecido desde a Grécia antiga. Veja o link a seguir.

[https://hsm.stackexchange.com/questions/384/did-gauss-find-the-formula-for-123-ldotsn-2n-1n-in-elementary-school](https://hsm.stackexchange.com/questions/384/did-gauss-find-the-formula-for-123-ldotsn-2n-1n-in-elementary-school)

Dado que o cálculo não precisa ser demorado, a função assíncrona pode devolver uma promise já no estado Fulfilled, como no Bloco de Código 3.3.2.

**Bloco de Código 3.3.2**

```javascript
function calculoRapidinho(numero){
  return Promise.resolve((numero * (numero + 1)) / 2);
}
calculoRapidinho(10).then(resultado =>{
  console.log(resultado)
})
//Executa primeiro, mesmo que a promise já esteja fullfilled
console.log('Esperando...')
```

### Promises já rejeitadas

Uma promise também pode ser devolvida já no estado Rejected. Para este exemplo, pode ser interessante fazê-lo caso o valor entregue para a função assíncrona seja negativo, como no Bloco de Código 3.3.3. Note que o código cliente pode especificar funções para ambas as possibilidades. Somente uma delas executará.

**Bloco de Código 3.3.3**

```javascript
function calculoRapidinho(numero) {
  return numero >= 0
    ? Promise.resolve((numero * (numero + 1)) / 2)
    : Promise.reject("Somente valores positivos, por favor");
}

calculoRapidinho(10)
  .then((resultado) => {
    console.log(resultado);
  })
  .catch((err) => {
    console.log(err);
  });
calculoRapidinho(-1)
  .then((resultado) => {
    console.log(resultado);
  })
  .catch((err) => {
    console.log(err);
  });
console.log("esperando...");
```

## Encadeando promises com OpenWeatherMap
Duration: 20:00

Há diversos serviços disponíveis no portal **OpenWeatherMap**, acessível por meio do link a seguir, que permitem realizar consultas referentes a previsões do tempo.

[https://openweathermap.org/](https://openweathermap.org/)

Dentre aqueles que permitem acesso gratuito, encontra-se o serviço **5 Day / 3 Hour Forecast**. Ele entrega previsões do tempo para até os próximos cinco dias, de três em três horas. Veja a sua documentação no link a seguir.

[https://openweathermap.org/forecast5](https://openweathermap.org/forecast5)

### Obtendo uma chave de API

A seguir, utilizaremos este serviço para ilustrar o uso do encadeamento de promises. Antes de mais nada, crie uma conta para você no portal. Uma vez que tenha criado a conta - é possível que receba um email para confirmá-la - e feito login, clique no canto superior direito em **seu nome → My API Keys**, como mostra a figura a seguir.

![Página de documentação do 5 day weather forecast no portal OpenWeatherMap, com o menu do usuário aberto no canto superior direito e a opção My API Keys destacada em vermelho](img/openweathermap-api-keys.webp)

*Acesso à opção My API Keys no menu do usuário do OpenWeatherMap.*

Na tela seguinte, gere uma chave de API para você. Escolha um nome que achar apropriado.

### Instalando o axios e declarando as constantes

Para realizar as requisições, utilizaremos o pacote **axios**. Ele pode ser instalado com

**Terminal**

```bash
npm install axios
```

Feita a instalação, importe o pacote e declare as constantes ilustradas no Bloco de Código 3.3.4.

**Bloco de Código 3.3.4**

```javascript
const axios = require("axios");
//sua chave aqui
const appid = "sua_chave_aqui";
//cidade desejada
const q = "Itu";
//unidade de medida de temperatura
const units = "metric";
//idioma
const lang = "pt_BR";
//quantidade de resultados
const cnt = "10"
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${q}&units=${units}&appid=${appid}&lang=${lang}&cnt=${cnt}`;
```

### Fazendo a requisição e encadeando promises

O Bloco de Código 3.3.5 mostra como fazer uma requisição e encadear diversas promises. Cada função especificada resolve um problema possivelmente de interesse. Quando termina, repassa o resultado por meio de uma nova promise. Coloque-o no mesmo arquivo, logo abaixo do Bloco de Código 3.3.4.

**Bloco de Código 3.3.5**

```javascript
//faz a requisição
axios
  .get(url)
  .then((res) => {
    //mostra o resultado e devolve somente a parte de interesse
    console.log(res);
    return res.data;
  })
  .then((res) => {
    //mostra o total e devolve o resultado
    console.log(res.cnt);
    return res;
  })
  .then((res) => {
    //devolve somente a lista de previsões
    console.log("aqui", res);
    return res["list"];
  })
  .then((res) => {
    //para cada resultado, mostra algumas informações
    for (let previsao of res) {
      console.log(`
          ${new Date(+previsao.dt * 1000).toLocaleString()},
          ${'Min: ' + previsao.main.temp_min}°C,
          ${'Max: ' + previsao.main.temp_max}°C,
          ${'Hum: ' + previsao.main.humidity}%,
          ${previsao.weather[0].description}
        `);
    }
    return res;
  })
  .then((res) => {
      //verifica quantas previsões têm percepção humana de tempertura acima de 30 graus
      const lista = res.filter(r => r.main.feels_like >= 30);
      console.log(`${lista.length} previsões têm percepção humana de temperatura acima de 30 graus`)
  });
```

<aside class="positive">

**Dica.** `°` é o código Unicode do símbolo de grau (°). Troque `"sua_chave_aqui"` pela chave gerada no portal; chaves recém-criadas podem levar alguns minutos para serem ativadas.

</aside>

## Async/await
Duration: 12:00

É verdade que o uso de promises é vantajoso quando comparado ao uso de callbacks. Entretanto, o encadeamento de promises usando `then` e `catch` é significativamente mais complexo do que a execução sequencial bloqueante. A especificação **ECMAScript 2017** inclui um recurso que permite a execução de funções assíncronas envolvendo promises sem ter de lidar diretamente com as funções `then` e `catch`. Este recurso é caracterizado pelas palavras-chave `async` e `await`. A palavra `async` pode preceder o nome de uma função, no momento em que ela é definida. Os efeitos são os seguintes.

* A função executa de forma assíncrona. Caso em sua definição original ela devolva um valor qualquer, uma vez que tenha sido marcada com `async`, ela passa a devolver uma promise que permite a obtenção daquele valor.
* Uma chamada de função assíncrona feita por ela pode ser precedida pela palavra `await`. Neste caso, a função chamada deixará de retornar uma promise imediatamente. Ela irá prosseguir com seu processamento e somente devolver o resultado quando estiver pronto. Ela executa, portanto, como se fosse síncrona.

### async

O Bloco de Código 3.3.6 mostra um exemplo em que uma função que originalmente executa de maneira síncrona é marcada com a palavra `async`. Ela passa a devolver uma promise que permite a obtenção do resultado. O código cliente pode, portanto, aplicar as funções `then` e `catch`.

**Bloco de Código 3.3.6**

```javascript
async function hello(nome) {
  return "Oi, " + nome;
}
const boasVindas = hello("João");
console.log(boasVindas);
boasVindas.then((res) => console.log(res));
```

### await

Para ilustrar o uso da palavra `await`, vamos utilizar uma função assíncrona que calcula o fatorial de um número inteiro recebido como parâmetro. Ela toma o cuidado de verificar se o valor passado é negativo. Veja o Bloco de Código 3.3.7.

**Bloco de Código 3.3.7**

```javascript
function fatorial(n) {
  if (n < 0) return Promise.reject("Valor não pode ser negativo");
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return Promise.resolve(res);
}
```

Como vimos, ela pode ser chamada e ter seu resultado tratado com as funções `then` e `catch`. Veja o Bloco de Código 3.3.8.

**Bloco de Código 3.3.8**

```javascript
function chamadaComThenCatch() {
  fatorial(5)
    .then((res) => console.log(res))
    .catch((res) => console.log(res));

  fatorial(-1)
    .then((res) => console.log(res))
    .catch((res) => console.log(res));
}
chamadaComThenCatch();
```

Usando a palavra `await`, podemos fazer chamadas mais simples, sem utilizar `then` e `catch`. Veja o Bloco de Código 3.3.9.

**Bloco de Código 3.3.9**

```javascript
//para usar await tem que ser async
async function chamadaComAwait() {
  //note que não há paralelismo implícito
  //somente haverá paralelismo se a função chamada utilizar explicitamente
  const f1 = await fatorial(5);
  console.log(f1);
  const f2 = await fatorial(-1);
  console.log(f2);
}
```

<aside class="negative">

**Promise rejeitada com await.** Quando a promise aguardada com `await` é rejeitada, como em `fatorial(-1)`, o erro é lançado dentro da função `async`. Para chamar `chamadaComAwait()` e tratar esse erro, envolva as chamadas com `try`/`catch` ou use `chamadaComAwait().catch(...)`.

</aside>

Assim, a palavra `async` pode ser usada para tornar uma função síncrona em uma função assíncrona. As palavras `async` e `await` podem ser utilizadas em conjunto para simplificar o uso de promises, descartando o uso de `then` e `catch`.

## Parabéns!
Duration: 3:00

Você concluiu o codelab **Desenvolvimento com JavaScript**. Neste percurso, você:

* Declarou variáveis e constantes e viu por que `let` é preferível a `var`
* Conheceu os tipos da linguagem, a coerção e a diferença entre `==` e `===`
* Usou vetores e seus métodos utilitários
* Escreveu funções tradicionais, anônimas e arrow functions
* Entendeu funções de alta ordem, escopo léxico e closures
* Representou dados do mundo real com JSON
* Estudou o modelo single threaded, o event loop e a execução assíncrona com `setTimeout` e callbacks
* Construiu e encadeou promises, inclusive consumindo o serviço de previsão do tempo do OpenWeatherMap com `axios`
* Simplificou o uso de promises com `async` e `await`

### Referências

* Tabela de comparação com `==`: [https://dorey.github.io/JavaScript-Equality-Table/unified/](https://dorey.github.io/JavaScript-Equality-Table/unified/)
* Especificação do JSON: [https://www.json.org/json-en.html](https://www.json.org/json-en.html)
* Especificação de Promise (ECMAScript): [https://tc39.es/ecma262/#sec-promise-objects](https://tc39.es/ecma262/#sec-promise-objects)
* OpenWeatherMap: [https://openweathermap.org/](https://openweathermap.org/) e a documentação do 5 Day / 3 Hour Forecast: [https://openweathermap.org/forecast5](https://openweathermap.org/forecast5)
