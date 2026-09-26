summary: Entenda como o tempo de execução de um algoritmo cresce com o tamanho da instância, defina formalmente as notações O, Ômega e Teta e aplique-as na análise de programas Java.
id: alg-notacao-assintotica
categories: Algoritmos,Java
tags: analise de algoritmos,notacao assintotica,big o,omega,theta,complexidade,java
status: Published
authors: Rodrigo Bossini
last updated: 2025-03-10
pdf: analise_de_algoritmos/02_apostila_analise_de_algoritmos_notacao_assintotica.pdf
exercicios: analise_de_algoritmos/02_exercicios_01_analise_de_algoritmos_notacao_assintotica.pdf,analise_de_algoritmos/02_exercicios_02_analise_de_algoritmos_notacao_assintotica.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Notação assintótica: O, Ômega e Teta

## Visão geral
Duration: 3:00

Nosso objetivo é estudar a forma como o tempo de execução de um algoritmo varia em função da instância do problema sobre a qual ele opera. Também é de interesse comparar o desempenho de diferentes algoritmos quando operam sobre a mesma instância de um determinado problema.

### O que você vai aprender

* Por que o tempo de execução "real" de cada instrução é irrelevante quando comparamos algoritmos
* O que é a **taxa de crescimento** e o **comportamento assintótico** de um algoritmo
* As definições formais dos conjuntos $O(g(n))$, $\Omega(g(n))$ e $\Theta(g(n))$
* Como encontrar as constantes $c$ (ou $c_1$ e $c_2$) e $n_0$ que comprovam que uma função pertence a um desses conjuntos
* Como analisar o tempo de execução de programas Java com laços simples, laços aninhados e laços que dividem a entrada

### O que você vai precisar

* Um JDK instalado (`javac` e `java`) para testar os programas
* Noções básicas de Java e de funções matemáticas (polinômios e logaritmos)

## Somando os n primeiros números naturais
Duration: 10:00

Um primeiro problema com que vamos lidar é um tanto simples: desejamos realizar a soma dos $n$ primeiros números naturais. Uma solução um tanto simples envolve a criação de uma estrutura de repetição que faz com que uma variável "contadora" varie de 1 a $n$, acumulando seu valor a cada iteração. Observe.

**SomaNNaturaisV1.java**

```java
public class SomaNNaturaisV1 {
  public static void main(String[] args) {
    int n = Integer.parseInt(args[0]);
    int soma = 0;
    for (int i = 1; i <= n; i++)
      soma += i;
    System.out.println(soma);
  }
}
```

<aside class="positive">

**Nota.** Para testar este programa, você pode compilar e depois executar da seguinte forma.

</aside>

**Terminal**

```bash
javac SomaNNaturaisV1.java
java SomaNNaturaisV1 100
```

Esse programa pode ser executado em computadores diferentes, utilizando ambientes de interpretação Java (JVM) diferentes, compilados por compiladores diferentes etc. Além disso, caso ele seja executado duas vezes no mesmo computador, o tempo de execução pode variar de acordo com a situação de momento do computador (muitos programas em execução, por exemplo). O tipo de comparação que desejamos realizar implica em ignorar tais condições.

Considere as duas execuções do mesmo algoritmo a seguir. Para simplificar, vamos contar apenas o número de execuções da instrução que realiza o acúmulo do valor.

**Execução 1.** Nesta execução, vamos considerar que, a cada iteração, a instrução que realiza o acúmulo do valor levou, no máximo, 10 milissegundos para executar. Assim, o programa levou, no máximo $10 \cdot n$ milissegundos para terminar.

**Execução 2.** Nesta execução, vamos considerar que, a cada iteração, a instrução que realiza o acúmulo do valor levou, no máximo, 7 milissegundos para executar. Assim, o programa levou, no máximo $7 \cdot n$ milissegundos para terminar.

Na prática, a Execução 2 foi mais rápida. Entretanto, para valores de $n$ **suficientemente grandes**, essa diferença se torna irrelevante. Observe.

| Valor de n | Execução 1 | Execução 2 |
| --- | --- | --- |
| 1 | 1 * 10 | 1 * 7 |
| 100 | 100 * 10 | 100 * 7 |
| 1.000 | 1000 * 10 | 1000 * 7 |
| 1.000.000 | 1.000.000 * 10 | 1.000.000 * 7 |

Quando olhamos para valores de $n$ grandes o suficiente, o valor de $n$ é justamente o fator mais importante para determinar o tempo de cada execução, tornando o tempo de execução prático de cada instrução praticamente irrelevante. Quando realizamos tais comparações, estamos interessados essencialmente na **taxa de crescimento do tempo de execução do algoritmo**.

### Uma versão muito mais eficiente

Também podemos utilizar a seguinte propriedade matemática para escrever um algoritmo muito mais eficiente.

$$1 + 2 + \ldots + n = \frac{n(n+1)}{2}$$

Observe que, para qualquer valor de $n$, o programa precisa essencialmente realizar uma operação de soma, uma operação de multiplicação e, por fim, uma operação de divisão.

**SomaNNaturaisV2.java**

```java
public class SomaNNaturaisV2 {
  public static void main(String[] args) {
    int n = Integer.parseInt(args[0]);
    int soma = (n * (n + 1)) / 2;
    System.out.println(soma);
  }
}
```

Novamente, vamos considerar duas execuções para esse algoritmo. Digamos que, na primeira, cada operação aritmética leva, no máximo, 15 milissegundos para ser realizada. Na segunda, cada operação leva, no máximo, 27 milissegundos para ser executada.

| Valor de n | Execução 1 | Execução 2 |
| --- | --- | --- |
| 1 | 3 * 15 | 3 * 27 |
| 100 | 3 * 15 | 3 * 27 |
| 1.000 | 3 * 15 | 3 * 27 |
| 1.000.000 | 3 * 15 | 3 * 27 |

Na prática, a Execução 1 foi mais rápida. Entretanto, consideraremos que cada execução levou tempo constante, que não varia em função de $n$. Neste caso, consideramos que ambos os programas tiveram tempo de execução "igual".

## Notações O, Ômega e Teta
Duration: 5:00

As notações O, Ômega e Teta nos permitem expressar o tempo de execução de nossos algoritmos de modo a ocultar as constantes - e também termos - irrelevantes, dando destaque apenas para o termo que **domina** o tempo de execução quando o tamanho da instância sobre a qual estamos operando tende ao infinito. Veja alguns exemplos. A unidade de medida utilizada neles também é irrelevante.

| Tempo de execução "real" | Tempo de execução considerado |
| --- | --- |
| $10$ | Constante |
| $27$ | Constante |
| $10000000$ | Constante |
| $2n$ | $n$ |
| $10n + 3$ | $n$ |
| $1000n + 500000$ | $n$ |
| $10n^2$ | $n^2$ |
| $10n^2 + 2n$ | $n^2$ |
| $10n^2 + 2n + 10000$ | $n^2$ |
| $n^3 + 1000n^2 + 10n + 5$ | $n^3$ |
| $\log n + 5$ | $\log n$ |
| $3 \log n + 10$ | $\log n$ |
| $n \log n$ | $n \log n$ |
| $2n \log n + 100$ | $n \log n$ |
| $5n \log n + n^2$ | $n^2$ |
| $2^n$ | $2^n$ |
| $3 \cdot 2^n + 10n$ | $2^n$ |
| $2^{n+1} + n^3$ | $2^n$ |

O tempo de execução de um algoritmo será expresso como uma função que representaremos da seguinte forma.

$$T(n)$$

A forma como $T(n)$ se comporta **conforme o valor de $n$ tende ao infinito** é conhecido como seu **comportamento assintótico**.

Na prática, **o valor de $n$ simboliza algo inerente às características do problema que estamos estudando**. Consideramos que $n$ é o tamanho da instância do problema sendo tratada. Por exemplo, $n$ pode ser o tamanho de um vetor, o número de vértices ou arestas de um grafo e assim por diante. Assim, **uma instância de um problema pode ter tamanho menor, igual ou maior ao tamanho de outra instância do mesmo problema**, por exemplo. Eles são "comparáveis".

As notações

$$O(g(n)) \qquad \Omega(g(n)) \qquad e \qquad \Theta(g(n))$$

representam **conjuntos de funções**. Vamos defini-los formalmente nos próximos passos.

## Notação O (Big Oh)
Duration: 12:00

Eis a definição de $O(g(n))$.

$$O(g(n)) = \{ f(n) \mid \exists c > 0, \exists n_0 \geq 0 \text{ tal que } 0 \leq f(n) \leq c \cdot g(n), \forall n \geq n_0 \}$$

Observe que para que uma função $f(n)$ possa "morar" neste conjunto, $g(n)$ deve servir de **limite assintótico superior** para $f(n)$. Ou seja,

> **a partir de um determinado valor de $n$, deve ser possível multiplicar $g$ por uma constante, fazendo com que $f(n)$ não mais a ultrapasse.**

Veja isso graficamente:

![Gráfico com as curvas f(n) em azul, g(n) em vermelho e c·g(n) em verde; a partir do ponto n0 no eixo horizontal, a curva c·g(n) fica sempre acima de f(n)](img/grafico-o.webp)

*A partir de $n_0$, $c \cdot g(n)$ limita $f(n)$ superiormente.*

Observe como, antes do valor $n_0$, os comportamentos de $f$ e $g$ podem ser quaisquer entre si. Para que $f$ possa morar no conjunto $O(g(n))$, no entanto, deve ser verdade que, a partir de $n_0$, basta multiplicar $g(n)$ por uma constante para que $f(n)$ não a ultrapasse.

Neste caso, podemos dizer que

$$f(n) \in O(g(n))$$

<aside class="positive">

**Nota.** Tornou-se comum, na literatura, escrever

$$f(n) = O(g(n))$$

em vez de

$$f(n) \in O(g(n))$$

Esta convenção será também adotada neste material.

</aside>

<aside class="positive">

**Nota.** O conjunto em que moram todas - e apenas - as funções constantes é comumente denotado por

$$O(1)$$

</aside>

Veja alguns exemplos.

### Exemplo 1 - Big Oh

Sejam as funções.

$$f(n) = 5, \quad g(n) = 1$$

Tomando

$$c = 5, \quad n_0 = 1$$

Temos

$$5 \leq 5 \cdot 1, \quad \forall n \geq 1$$

### Exemplo 2 - Big Oh

Sejam as funções.

$$f(n) = 2, \quad g(n) = n$$

Tomando

$$c = 2, \quad n_0 = 1$$

Temos

$$2 \leq 2 \cdot n, \quad \forall n \geq 1$$

### Exemplo 3 - Big Oh

Sejam as funções.

$$f(n) = 2n + 10, \quad g(n) = n$$

Tomando

$$c = 3, \quad n_0 = 10$$

Temos

$$2n + 10 \leq 3n, \quad \forall n \geq 10$$

### Exemplo 4 - Big Oh

Sejam as funções.

$$f(n) = 3n + 15, \quad g(n) = n^2$$

Tomando

$$c = 1, \quad n_0 = 6$$

Temos

$$3n + 15 \leq 1 \cdot n^2, \quad \forall n \geq 6$$

## Notação Ômega
Duration: 8:00

Eis a definição de $\Omega(g(n))$.

$$\Omega(g(n)) = \{ f(n) \mid \exists c > 0, \exists n_0 \geq 0 \text{ tal que } 0 \leq c \cdot g(n) \leq f(n), \forall n \geq n_0 \}$$

Observe que para que uma função $f(n)$ possa "morar" neste conjunto, $g(n)$ deve servir de **limite assintótico inferior** para $f(n)$. Ou seja,

> **a partir de um determinado valor de $n$, deve ser possível multiplicar $g$ por uma constante, fazendo com que seu valor seja, no máximo, igual ao de $f(n)$.**

Veja graficamente.

![Gráfico com as curvas f(n) em azul, g(n) em vermelho e c·g(n) em verde; a partir do ponto n0, a curva c·g(n) fica sempre abaixo de f(n)](img/grafico-omega.webp)

*A partir de $n_0$, $c \cdot g(n)$ limita $f(n)$ inferiormente.*

Neste caso, podemos dizer que

$$f(n) \in \Omega(g(n))$$

Ou, ainda, como é mais comum

$$f(n) = \Omega(g(n))$$

Veja alguns exemplos.

### Exemplo 1 - Omega

Sejam as funções.

$$f(n) = n, \quad g(n) = 1$$

Tomando

$$c = 1, \quad n_0 = 1$$

Temos

$$1 \cdot 1 \leq n, \quad \forall n \geq 1$$

### Exemplo 2 - Omega

Sejam as funções.

$$f(n) = n^2, \quad g(n) = n$$

Tomando

$$c = 1, \quad n_0 = 1$$

Temos

$$1 \cdot n \leq n^2, \quad \forall n \geq 1$$

### Exemplo 3 - Omega

Sejam as funções.

$$f(n) = n^2 - 2n, \quad g(n) = n^2$$

Tomando

$$c = \frac{1}{2}, \quad n_0 = 4$$

Temos

$$\frac{1}{2} \cdot n^2 \leq n^2 - 2n, \quad \forall n \geq 4$$

## Notação Teta
Duration: 8:00

Eis a definição de $\Theta(g(n))$.

$$\Theta(g(n)) = \{ f(n) \mid \exists c_1, c_2 > 0, \exists n_0 \geq 0 \text{ tal que } 0 \leq c_1 \cdot g(n) \leq f(n) \leq c_2 \cdot g(n), \forall n \geq n_0 \}$$

Observe que para que uma função $f(n)$ possa "morar" neste conjunto, $g(n)$ deve servir de **limite assintótico inferior e superior** para $f(n)$. Ou seja,

> **a partir de um determinado valor de $n$, deve ser possível multiplicar $g$ por duas constantes, $c_1$ e $c_2$, fazendo com que $c_1 g(n) \leq f(n) \leq c_2 g(n)$.**

Veja graficamente.

![Gráfico com f(n) em azul e g(n) em vermelho; a partir de n0, f(n) fica entre c1·g(n), em verde, abaixo, e c2·g(n), em amarelo, acima](img/grafico-theta.webp)

*A partir de $n_0$, $f(n)$ fica "ensanduichada" entre $c_1 \cdot g(n)$ e $c_2 \cdot g(n)$.*

Neste caso, podemos dizer que

$$f(n) \in \Theta(g(n))$$

Ou, ainda, como é mais comum

$$f(n) = \Theta(g(n))$$

Veja alguns exemplos.

### Exemplo 1 - Theta

Sejam as funções.

$$f(n) = 5, \quad g(n) = 1$$

Tomando

$$c_1 = 4, \quad c_2 = 6, \quad n_0 = 1$$

Temos

$$4 \cdot 1 \leq 5 \leq 6 \cdot 1, \quad \forall n \geq 1$$

### Exemplo 2 - Theta

Sejam as funções.

$$f(n) = 3n + 7, \quad g(n) = n$$

Tomando

$$c_1 = 2, \quad c_2 = 4, \quad n_0 = 1$$

Temos

$$2n \leq 3n + 7 \leq 4n, \quad \forall n \geq 7$$

### Exemplo 3

Sejam as funções.

$$f(n) = 2n^2 + 5n + 10, \quad g(n) = n^2$$

Tomando

$$c_1 = 2, \quad c_2 = 3, \quad n_0 = 1$$

Temos

$$2n^2 \leq 2n^2 + 5n + 10 \leq 3n^2, \quad \forall n \geq 7$$

## Analisando os algoritmos de soma de naturais
Duration: 8:00

Nesta seção, vamos determinar o tempo de execução dos algoritmos de soma dos primeiros $n$ números naturais apresentados anteriormente.

O primeiro algoritmo faz a soma utilizando uma estrutura de repetição. Veja, a seguir, uma análise mais precisa de seu tempo de execução.

| Linha | Vezes que executa | Tempo de execução |
| --- | --- | --- |
| `int n = Integer.parseInt(args[0]);` | $1$ | $c_1$ |
| `int soma = 0;` | $1$ | $c_2$ |
| `for (int i = 1; i <= n; i++)` | $n + 1$ | $c_3 + c_4 + c_5$ |
| `soma += i;` | $n$ | $c_6$ |
| `System.out.println(soma);` | $1$ | $c_7$ |

O total é

$$T(n) = 1 \cdot c_1 + 1 \cdot c_2 + c_3 \cdot n + c_3 \cdot 1 + c_4 \cdot n + c_4 \cdot 1 + c_5 \cdot n + c_5 \cdot 1 + n \cdot c_6 + 1 \cdot c_7$$

Observe que estamos diante de uma equação linear que pode ser expressa como

$$T(n) = an + b$$

Assim, é verdade que

$$T(n) = \Theta(n)$$

Agora vamos analisar o tempo de execução do segundo algoritmo.

| Linha | Vezes que executa | Tempo de execução |
| --- | --- | --- |
| `int n = Integer.parseInt(args[0]);` | $1$ | $c_1$ |
| `int soma = (n * (n + 1)) / 2;` | $1$ | $c_2$ |
| `System.out.println(soma);` | $1$ | $c_3$ |

Assim,

$$T(n) = c_1 + c_2 + c_3$$

E, portanto

$$T(n) = \Theta(1)$$

## Juros simples, valor máximo e matriz identidade
Duration: 10:00

Nesta seção, vamos analisar o tempo de execução de mais alguns algoritmos.

### Cálculo de juros simples

O programa a seguir faz o cálculo de juros simples.

**JurosSimples.java**

```java
public class JurosSimples {
  public static void main(String[] args) {
    double capitalInicial = Double.parseDouble(args[0]);
    double taxaJurosAnual = Double.parseDouble(args[1]);
    int tempoAnos = Integer.parseInt(args[2]);
    double montanteFinal = capitalInicial + (capitalInicial * taxaJurosAnual * tempoAnos);
    System.out.println("Montante final após " + tempoAnos + " anos: R$" + montanteFinal);
  }
}
```

Observe que, cada linha, executa uma única vez. Não há variação alguma em função do tamanho da entrada. Poderíamos imaginar que cada instância tem seu tamanho caracterizado por três variáveis: o valor de capital inicial, a taxa de juros inicial e o tempo em anos. Assim,

$$T(c, tx, tp) = O(1)$$

### Valor máximo de um vetor

O programa a seguir encontra o valor máximo de um vetor. Observe que ele utiliza duas estruturas de repetição **sem aninhamento**.

**MaiorValor.java**

```java
public class MaiorValor {
  public static void main(String[] args) {
    int n = args.length;
    int[] valores = new int[n];

    for (int i = 0; i < n; i++) {
      valores[i] = Integer.parseInt(args[i]);
    }

    int maior = valores[0];

    for (int i = 1; i < n; i++) {
      if (valores[i] > maior) {
        maior = valores[i];
      }
    }

    System.out.println("Maior valor: " + maior);
  }
}
```

Qual a sua complexidade?

O número de iterações do primeiro `for` é proporcional a $n$. Assim como acontece com o segundo. Assim,

$$T(n) = \Theta(n) + \Theta(n) = \Theta(n)$$

### Matriz identidade

O programa a seguir lê a ordem de uma matriz quadrada e exibe uma matriz identidade.

**MatrizIdentidade.java**

```java
public class MatrizIdentidade {
  public static void main(String[] args) {
    int n = Integer.parseInt(args[0]);

    for (int i = 0; i < n; i++) {
      for (int j = 0; j < n; j++) {
        if (i == j) {
          System.out.print("1 ");
        } else {
          System.out.print("0 ");
        }
      }
      System.out.println();
    }
  }
}
```

Observe que o número de iterações do `for` externo é proporcional a $n$. A cada iteração, o `for` interno também executa uma quantidade de iterações proporcional a $n$. Temos $n$ iterações externas e cada uma custa $n$ iterações. Assim,

$$T(n) = \underbrace{\Theta(n) + \Theta(n) + \cdots + \Theta(n)}_{n \text{ vezes}} = \Theta(n^2)$$

## Barra de progresso e divisões por 2
Duration: 12:00

### Barra de progresso

O programa a seguir lê $n$ valores inteiros e produz uma sequência de barras de progresso. Para a coleção

```text
2 3 4 1 5
```

por exemplo, a sua saída é

```text
[1] **
[2] ***
[3] ****
[4] *
[5] *****
```

**BarraDeProgresso.java**

```java
public class BarraDeProgresso {
  public static void main(String[] args) {
    int n = args.length;
    int[] valores = new int[n];

    for (int i = 0; i < n; i++) {
      valores[i] = Integer.parseInt(args[i]);
    }


    for (int i = 0; i < n; i++) {
      System.out.print("[" + (i + 1) + "] ");
      for (int j = 0; j < valores[i]; j++) {
        System.out.print("*");
      }
      System.out.println();
    }
  }
}
```

Determinar a complexidade deste algoritmo depende da forma como definimos as instâncias do problema e seu tamanho.

Por exemplo, podemos considerar que o tamanho de uma instância é dado em função apenas de $n$.

Neste caso, os valores contidos na coleção são todos constantes.

Assim, se a constante $k$ é a maior entre aquelas contidas na coleção, o `for` interno executa, no máximo, $k$ iterações.

O `for` externo executa $n$ iterações. Cada uma, portanto, custa no máximo $k = O(1)$. A ideia descrita aqui se assemelha à definição dada para uma técnica chamada **loop unrolling**.

Há, também, um `for` que apenas lê os valores. Assim,

$$T(n) = O(n) + \underbrace{O(1) + O(1) + \cdots + O(1)}_{n \text{ vezes}} = O(n)$$

Observe, entretanto, que a definição do problema e a forma como o tamanho de suas instâncias é caracterizado é fundamental. Os valores contidos na coleção são arbitrários, podendo, inclusive, serem maiores do que $n$. Assim, uma definição que envolva tais valores pode ser mais interessante. Suponha que $k$ é o maior valor contido na coleção. Sendo $k$ um valor que varia de maneira independente de $n$, sabemos novamente que cada iteração do loop externo custa $k$ iterações do loop interno. Assim,

$$T(n, k) = O(n) + \underbrace{O(k) + O(k) + \cdots + O(k)}_{n \text{ vezes}} = O(kn)$$

### Contagem de divisões por 2

O programa a seguir divide um número por 2 sucessivas vezes, até "exauri-lo", ou seja, enquanto ele for maior do que 1.

**DivisaoPorDois.java**

```java
public class DivisaoPorDois {
  public static void main(String[] args) {
    int n = Integer.parseInt(args[0]);
    int passos = 0;

    while (n > 1) {
      n /= 2;
      passos++;
    }

    System.out.println(passos);
  }
}
```

Quantas vezes podemos dividir um número por 2 até "esgotá-lo"? Veja a tabela a seguir, em que utilizamos potências de 2 para simplificar, muito embora o raciocínio se aplique a valores quaisquer.

| n | Quantidade de divisões |
| --- | --- |
| 2 | 1 |
| 4 | 2 |
| 8 | 3 |
| 16 | 4 |
| 32 | 5 |
| 64 | 6 |
| 128 | 7 |
| 256 | 8 |
| 512 | 9 |
| 1024 | 10 |

Por inspeção, concluímos que o número procurado é

$$\log_2 n$$

<aside class="positive">

**Nota.** Dado que

$$\log_b x = \frac{\log_c x}{\log_c b}$$

Veja um exemplo

$$\log_2 x = \frac{\log_{10} x}{\log_{10} 2}$$

consideramos que a base de logaritmos é irrelevante na análise de complexidade de algoritmos.

</aside>

Assim,

$$T(n) = O(\log n)$$

## Exercícios: definições
Duration: 25:00

Resolva cada exercício a seguir. Para cada um, apresente uma justificativa. Ou seja, em caso positivo, encontre os valores de $c$ e $n_0$ (ou $c_1$, $c_2$ e $n_0$, quando necessário). Em caso contrário, explique com suas palavras por que não.

1. A função $f(n) = 5n + 10$ pertence a $O(n^2)$?
2. A função $f(n) = n^2 + 4n$ pertence a $O(n^2)$?
3. A função $f(n) = 2n^2 + 7n + 5$ pertence a $O(n)$?
4. A função $f(n) = 100$ pertence a $O(1)$?
5. A função $f(n) = n^2 - 3n$ pertence a $O(n)$?
6. A função $f(n) = 2n^2 + 5n$ pertence a $\Omega(n^2)$?
7. A função $f(n) = 3n + 20$ pertence a $\Omega(n)$?
8. A função $f(n) = n^2 + 10n$ pertence a $\Omega(n^2)$?
9. A função $f(n) = 2n + 10$ pertence a $\Omega(n^2)$?
10. A função $f(n) = 5n + 100$ pertence a $\Omega(n)$?
11. A função $f(n) = 4n + 6$ pertence a $\Theta(n)$?
12. A função $f(n) = 2n^2 + 3n + 5$ pertence a $\Theta(n^2)$?
13. A função $f(n) = n^2 + 7n$ pertence a $\Theta(n^2)$?
14. A função $f(n) = 3n^2 + 5n$ pertence a $\Theta(n)$?
15. A função $f(n) = 10$ pertence a $\Theta(1)$?

## Exercícios: implementação e análise
Duration: 30:00

### Exercício 1

Leia um número inteiro positivo $n$ do teclado e preencha um vetor de tamanho $n$ com valores aleatórios. Para cada valor do vetor, encontre a maior potência de 10 que seja menor ou igual a esse valor.

**Exemplo de entrada e saída:**

* **Entrada:** $n = 5$. **Vetor gerado:** `[78, 4500, 3, 120, 9999]`
* **Saída:**

```text
10
1000
1
100
1000
```

### Exercício 2

Leia um número inteiro positivo $n$ do teclado e preencha um vetor de tamanho $n$ com valores aleatórios. Para cada valor do vetor, verifique se ele é um número primo. Não é permitido o uso de métodos de manipulação de strings. Após a implementação, determine a complexidade do algoritmo e expresse-a em notação $\Theta$.

**Exemplo de entrada e saída:**

* **Entrada:** $n = 6$. **Vetor gerado:** `[15, 7, 21, 31, 40, 97]`
* **Saída:**

```text
Não
Sim
Não
Sim
Não
Sim
```

### Exercício 3

Visite as documentações oficiais das classes `LinkedList` e `ArrayList` da linguagem Java. Escolha cinco métodos que ambas as classes possuem em comum e compare suas complexidades de tempo de execução. Após a análise, determine e escreva a complexidade de cada método em notação $\Theta$.

**Exemplo de métodos que podem ser analisados:**

* `add(E element)`
* `add(int index, E element)`
* `remove(int index)`
* `get(int index)`
* `contains(Object o)`

Após a comparação, explique as diferenças observadas entre as duas estruturas e justifique os tempos de execução com base na estrutura interna de cada implementação.

* [https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/LinkedList.html](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/LinkedList.html)
* [https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/ArrayList.html](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/ArrayList.html)

### Exercício 4

Leia um número inteiro positivo $n$ do teclado e preencha uma matriz quadrada de tamanho $n \times n$ com valores aleatórios. Para cada elemento da matriz, substitua-o pela soma de todos os elementos da mesma linha. Após a implementação, determine a complexidade do algoritmo e expresse-a em notação $\Theta$.

**Exemplo de entrada e saída:**

* **Entrada:** $n = 3$. **Matriz gerada:**

$$\begin{bmatrix} 2 & 4 & 6 \\ 1 & 5 & 3 \\ 7 & 8 & 2 \end{bmatrix}$$

* **Saída:**

$$\begin{bmatrix} 12 & 12 & 12 \\ 9 & 9 & 9 \\ 17 & 17 & 17 \end{bmatrix}$$

### Exercício 5

Leia um número inteiro positivo $n$ do teclado e preencha duas matrizes quadradas de tamanho $n \times n$ com valores aleatórios. Em seguida, calcule o produto das duas matrizes. Após a implementação, determine a complexidade do algoritmo e expresse-a em notação $\Theta$.

**Exemplo de entrada e saída:**

* **Entrada:** $n = 2$. **Matriz A:**

$$\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$$

* **Matriz B:**

$$\begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix}$$

* **Saída: Matriz Resultado:**

$$\begin{bmatrix} 19 & 22 \\ 43 & 50 \end{bmatrix}$$

### Exercício 6

Leia um número inteiro positivo $n$ do teclado e preencha um vetor de tamanho $n$ com valores aleatórios. Em seguida, calcule a variância e o desvio padrão dos valores no vetor. Após a implementação, determine a complexidade do algoritmo e expresse-a em notação $\Theta$.

**Fórmulas utilizadas:**

* Média:

$$\mu = \frac{1}{n} \sum_{i=1}^{n} x_i$$

* Variância:

$$\sigma^2 = \frac{1}{n} \sum_{i=1}^{n} (x_i - \mu)^2$$

* Desvio Padrão:

$$\sigma = \sqrt{\sigma^2}$$

### Exercício 7

Leia um número inteiro positivo $n$ do teclado e preencha um `HashSet` com $n$ objetos do tipo `Pessoa`, onde cada pessoa possui apenas um nome como propriedade. O `Set` não permite duplicatas, então pessoas com o mesmo nome não devem ser inseridas. Após a inserção, exiba todos os elementos do conjunto. Em seguida, ajuste a implementação para garantir que a ordem de inserção dos elementos seja preservada, substituindo o `HashSet` por outra implementação de `Set` que mantenha essa característica.

Para garantir a correta funcionalidade do `Set`, implemente os métodos `equals()` e `hashCode()` na classe `Pessoa`. Duas instâncias de `Pessoa` devem ser consideradas iguais se possuírem o mesmo nome.

Além disso, estude e explique a importância da implementação correta do método `hashCode()` para evitar colisões e garantir eficiência na estrutura de dados. Analise como a comparação de `String` no método `equals()` afeta a complexidade assintótica da busca e inserção dos elementos no `Set`.

**Exemplo de entrada e saída:**

* **Entrada:** $n = 2$. **Nomes gerados:** `["Ana", "Carlos"]`
* **Saída com HashSet:**

```text
Carlos
Ana
```

* **Saída após ajuste para preservar a ordem de inserção:**

```text
Ana
Carlos
```

## Encerramento
Duration: 3:00

Parabéns! Você viu por que comparamos algoritmos pela **taxa de crescimento** do tempo de execução, conheceu as definições formais de $O$, $\Omega$ e $\Theta$ e analisou programas com complexidades $\Theta(1)$, $\Theta(n)$, $\Theta(n^2)$, $O(kn)$ e $O(\log n)$.

### Referências

* CORMEN, Thomas H. et al. **Introduction to Algorithms**. 3. ed. Cambridge: MIT Press, 2009.
* FEOFILOFF, Paulo. **Análise de Algoritmos**. Disponível em: [https://www.ime.usp.br/~pf/analise_de_algoritmos/](https://www.ime.usp.br/~pf/analise_de_algoritmos/). Acesso em: março de 2025.
* FEOFILOFF, Paulo. **Anotações sobre Algoritmos: Slides**. São Paulo: Instituto de Matemática e Estatística – USP, [s.d.]. Disponível em: [https://www.ime.usp.br/~pf/livrinho-AA/downloads/AA-SLIDES.pdf](https://www.ime.usp.br/~pf/livrinho-AA/downloads/AA-SLIDES.pdf). Acesso em: março de 2025.
* KLEINBERG, Jon; TARDOS, Éva. **Algorithm Design**. Boston: Pearson, 2006.
