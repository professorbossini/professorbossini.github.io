summary: Escreva programas Java de sequência simples (entrada, processamento e saída) usando variáveis de tipos primitivos, operadores aritméticos e as caixas de diálogo da classe JOptionPane.
id: java-variaveis-entrada-saida
categories: Java
tags: java,variáveis,tipos primitivos,joptionpane,entrada e saída,operadores
status: Published
authors: Rodrigo Bossini
last updated: 2022-02-23
pdf: java/002_apostila_java_variaveis_entrada_saida.pdf
exercicios: java/002_exercicios_java_variaveis_entrada_saida.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Java: variáveis, entrada e saída

## Visão geral
Duration: 3:00

Neste material estudaremos os algoritmos de sequência simples, ou seja, aqueles que envolvem um conjunto de entradas, processamento e um conjunto de saídas. Faremos a implementação desses algoritmos utilizando a linguagem Java. Para tanto, veremos também declaração de variáveis e métodos de entrada e saída.

### O que você vai aprender

* Como compilar e executar um programa Java com `javac` e `java`
* Boas práticas de escrita de código Java (indentação, nomes, CamelCase)
* A estrutura entrada – processamento – saída
* Variáveis e os tipos primitivos `int`, `double` e `boolean`
* Entrada e saída de dados com `JOptionPane.showInputDialog` e `JOptionPane.showMessageDialog`
* Os operadores aritméticos da linguagem Java

### O que você vai precisar

* JDK instalado
* Um IDE ou editor de código (por exemplo, o VS Code)

## Meu primeiro programa em Java
Duration: 6:00

Nosso primeiro programa em Java será aquele exibido no Bloco de Código 2.1.1.

**HelloWorld.java · Bloco de Código 2.1.1**

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World");
    }
}
```

O código de um programa de computador escrito na linguagem Java é compilado para uma forma intermediária de código denominada **bytecode**, que é interpretada pelas Máquinas Virtuais Java. Para isso, utilizamos o comando `javac` ou acionamos o item do IDE que o invoca. A sintaxe do comando é

**Terminal**

```bash
javac arquivo.java
```

Pronto, agora o nosso bytecode está pronto para ser interpretado pela JVM. Eles estão armazenados em um arquivo de extensão `.class` que foi gerado pelo compilador. Para colocar o programa em execução, use

**Terminal**

```bash
java arquivo
```

Mais precisamente, esse comando coloca uma instância da máquina virtual Java em execução e ela se encarrega de interpretar os bytecodes, explicando para o computador o que ele deve fazer a cada instrução. Repare que não colocamos extensões quando ela é colocada em execução.

### O arquivo HelloWorld.java

O exemplo mostra que a classe `HelloWorld` tem um método `main` que é quase sempre escrito da forma apresentada. Ele também admite algumas variações que veremos conforme aprofundamos os estudos. O método `println` exibe uma mensagem em tela de comando. Vamos praticar algumas variações, utilizando a classe `JOptionPane`, por exemplo.

### Observações importantes e boas práticas de programação

* Blocos são delimitados por `{}`, a menos que tenham uma única instrução. Neste caso, o uso de `{}` é opcional.
* Uma boa prática de programação é indentar sempre programas.
* Classes têm nomes iniciados por letra em caixa alta.
* Variáveis e métodos têm nome iniciados por letras em caixa baixa.
* Métodos sempre têm parênteses para parâmetros, mesmo que fiquem vazios.
* Para quaisquer nomes, respeitamos o padrão conhecido como **CamelCase**.

## Algoritmos básicos
Duration: 4:00

Um algoritmo básico ou de sequência simples tem a seguinte estrutura:

**entrada – processamento – saída**

A Figura 2.4.1 ilustra um fluxograma para essa estrutura.

![Fluxograma com três blocos ligados por setas: Entrada, Processamento e Saída](img/fig-2-4-1.webp)

*Figura 2.4.1 – Fluxograma de um algoritmo de sequência simples.*

### Um exemplo simples

Somar 2 números escolhidos pelo usuário e exibir o resultado.

**Entrada**: informações que são fornecidas ao programa para que ele seja executado. Nesse primeiro exemplo, são os 2 números escolhidos pelo usuário. Nesta fase, o programa irá:

* ler os valores digitados pelo usuário
* armazenar os valores em variáveis denominadas `primeiroValor` e `segundoValor`

**Processamento**: aquilo que o programa faz com a entrada para obter a saída desejada. Nesta fase, o programa irá:

* calcular a soma entre `primeiroValor` e `segundoValor`
* armazenar o resultado calculado em uma variável chamada `resultado`

**Saída**: entrega do resultado obtido. Neste exemplo, o programa irá:

* exibir o valor resultante na saída padrão

## Variáveis e tipos primitivos
Duration: 5:00

> **Variável**
>
> Uma área reservada na memória RAM, identificada por um nome, que pode armazenar valores de um determinado tipo.

Um **tipo de dado** define um conjunto de valores e um conjunto de operações válido. Pelo fato de especificarmos os tipos de nossas variáveis ainda em **tempo de compilação**, ou seja, entregarmos essa informação ao compilador, dizemos que a linguagem Java é **estaticamente tipada**.

No Java temos vários tipos chamados primitivos. Veja alguns bastante comuns:

* **int**: é o tipo de dado capaz de armazenar 32 bits, ou seja, de representar um número inteiro qualquer entre -2.147.483.648 e 2.147.483.647.
* **double**: permite armazenar valores de ponto flutuante IEEE 754 de 64 bits e dupla precisão. Essa é a opção padrão para valores decimais.
* **boolean**: armazena um único byte de informação, que pode ser representado pelas palavras `false` (falso) ou `true` (verdadeiro).

O Bloco de Código 2.6.1 mostra o esqueleto da classe `SomaDoisNumeros`, com a definição do bloco do método `main` e a declaração das 3 variáveis, do tipo `double`. Perceba a indentação do código.

**SomaDoisNumeros.java · Bloco de Código 2.6.1**

```java
public class SomaDoisNumeros {
    public static void main(String[] args) {
        double primeiroValor;
        double segundoValor;
        double resultado;
    }
}
```

## Entrada de dados
Duration: 6:00

O Java provê várias classes que podem realizar a entrada de dados. Vamos iniciar pela classe `JOptionPane`, que fornece, entre outros, métodos para entrada e saída. Essa classe está no pacote `javax.swing`, portanto, devemos importá-la para podermos usar. O método para entrada de dados é o `showInputDialog`.

O Bloco de Código 2.7.1 mostra agora a classe `SomaDoisNumeros`, com a linha de importação da classe `JOptionPane` e a leitura (entrada) dos valores que o usuário digita e são armazenados nas variáveis `primeiroValor` e `segundoValor`.

**SomaDoisNumeros.java · Bloco de Código 2.7.1**

```java
import javax.swing.JOptionPane;

public class SomaDoisNumeros {
    public static void main(String[] args) {
        double primeiroValor;
        double segundoValor;
        double resultado;
        primeiroValor = Double.parseDouble(JOptionPane.showInputDialog("Digite o primeiro valor"));
        segundoValor = Double.parseDouble(JOptionPane.showInputDialog("Digite o segundo valor"));
    }
}
```

O método `showInputDialog` tem como parâmetro a mensagem que aparece para o usuário (sempre entre aspas). Note também que temos outro método: o `parseDouble` definido pela classe `Double`. Isso é necessário porque o método `showInputDialog` sempre devolve uma `String`, isto é, uma sequência de caracteres, portanto temos que transformá-la em valor numérico, neste caso em `double`.

## Processamento
Duration: 5:00

Estamos quase lá, a entrada está resolvida, vamos para o processamento. O programa tem por objetivo somar dois números. Utilizamos para isso o operador `+`. A Tabela 2.8.1 mostra os operadores aritméticos da linguagem Java.

*Tabela 2.8.1*

| Operação | Operador | Exemplo | Resultado |
| --- | --- | --- | --- |
| Soma | `+` | `2 + 3` | 5 |
| Subtração | `-` | `5 - 2` | 3 |
| Multiplicação | `*` | `6 * 5` | 30 |
| Divisão inteira | `/` | `5 / 2` | 2 |
| Divisão real | `/` | `5.0 / 2` ou `5 / 2.0` ou `5d / 2` ou `5 / 2d` | 2.5 |
| Módulo (resto de divisão inteira) | `%` | `5 % 2` | 1 |

O Bloco de Código 2.8.1 mostra a implementação da fase de processamento.

**SomaDoisNumeros.java · Bloco de Código 2.8.1**

```java
import javax.swing.JOptionPane;

public class SomaDoisNumeros {
    public static void main(String[] args) {
        double primeiroValor;
        double segundoValor;
        double resultado;
        primeiroValor = Double.parseDouble(JOptionPane.showInputDialog("Digite o primeiro valor"));
        segundoValor = Double.parseDouble(JOptionPane.showInputDialog("Digite o segundo valor"));
        resultado = primeiroValor + segundoValor;
    }
}
```

## Saída
Duration: 6:00

A saída é simples, uma caixa de diálogo para exibir mensagens. O método `showMessageDialog` se encarrega desta tarefa. Veja o Bloco de Código 2.9.1.

**SomaDoisNumeros.java · Bloco de Código 2.9.1**

```java
import javax.swing.JOptionPane;

public class SomaDoisNumeros {
    public static void main(String[] args) {
        double primeiroValor;
        double segundoValor;
        double resultado;
        primeiroValor = Double.parseDouble(JOptionPane.showInputDialog("Digite o primeiro valor"));
        segundoValor = Double.parseDouble(JOptionPane.showInputDialog("Digite o segundo valor"));
        resultado = primeiroValor + segundoValor;
        JOptionPane.showMessageDialog(null, resultado);
    }
}
```

Note que o primeiro parâmetro é a palavra reservada `null`, sobre a qual discutiremos mais adiante. O segundo parâmetro é a expressão que resulta no valor que se deseja exibir.

É possível exibir um simples valor numérico, uma sequência de caracteres e, utilizando o **operador de concatenação**, podemos montar uma sequência textual interessante. Veja o exemplo do Bloco de Código 2.9.2. Repare no comentário que fizemos para que o programa produza a saída uma única vez.

**SomaDoisNumeros.java · Bloco de Código 2.9.2**

```java
import javax.swing.JOptionPane;

public class SomaDoisNumeros {
    public static void main(String[] args) {
        double primeiroValor;
        double segundoValor;
        double resultado;
        primeiroValor = Double.parseDouble(JOptionPane.showInputDialog("Digite o primeiro valor"));
        segundoValor = Double.parseDouble(JOptionPane.showInputDialog("Digite o segundo valor"));
        resultado = primeiroValor + segundoValor;
        //JOptionPane.showMessageDialog(null, resultado);
        JOptionPane.showMessageDialog(null, "O resultado é " + resultado);
    }
}
```

<aside class="positive">

**Desafio.** Ajuste o programa para que ele exiba um texto contendo os valores digitados pelo usuário e o resultado final, no seguinte formato: `a + b = c`. Por exemplo, se o usuário digitar 2 e 3, seu programa deve exibir: `2 + 3 = 5`.

</aside>

## Exercícios
Duration: 30:00

1. Ler a cotação do dólar e a quantidade de dólares. Converter para real e mostrar o resultado.
2. Ler 4 números, calcular o quadrado para cada um, somar todos os quadrados e mostrar o resultado.
3. Calcular o pagamento de comissão de vendedores de peças, levando-se em consideração que sua comissão será de 5% do total da venda e que você tem os seguintes dados: preço unitário da peça e quantidade vendida.
4. Ler um valor inteiro e exibir seu antecessor.
5. Ler as dimensões de um retângulo (base e altura), calcular e escrever a área do retângulo.
6. Ler a idade de uma pessoa expressa em anos e exibir expressa em dias (considere que um ano tem 365 dias).
7. Ler a idade de uma pessoa expressa em anos, meses e dias e exibir a idade dessa pessoa expressa apenas em dias. Considerar ano com 365 dias e mês com 30 dias.
8. Ler o número total de eleitores de um município, o número de votos brancos, nulos e válidos. Calcular e escrever o percentual que cada um representa em relação ao total de eleitores.
9. Ler o salário mensal atual de um funcionário e o percentual de reajuste. Calcular e exibir o valor do novo salário.
10. O custo de um carro novo ao consumidor é a soma do custo de fábrica com a porcentagem do distribuidor e dos impostos (aplicados ao custo de fábrica). Supondo que o percentual do distribuidor seja de 28% e os impostos de 45%, ler o custo de fábrica de um carro, calcular e escrever o custo final ao consumidor.
11. Uma revendedora de carros usados paga a seus funcionários vendedores um salário fixo por mês, mais uma comissão também fixa para cada carro vendido e mais 5% do valor das vendas por ele efetuadas. Ler o número de carros por ele vendidos, o valor total de suas vendas, o salário fixo e o valor que ele recebe por carro vendido. Calcular e exibir o salário final do vendedor.
12. No plano cartesiano, a distância entre dois pontos $p_1(x_1, y_1)$ e $p_2(x_2, y_2)$ é definida como

    $$dist(p_1, p_2) = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

    Escreva um programa que lê os valores x1, y1, x2 e y2 nesta ordem e exibe a distância entre p1 e p2. Utilize valores reais. Vasculhe a documentação da classe `Math` no link a seguir e encontre um método apropriado para o cálculo da raiz quadrada. [https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Math.html](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Math.html)
13. A área de um círculo pode ser calculada da seguinte forma

    $$A = \pi \cdot r^2$$

    Faça um programa que lê o valor do raio e exibe a área calculada. Vasculhe a documentação da classe `Math` no link a seguir e utilize a sua constante que representa o valor de pi. [https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Math.html](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Math.html)
14. Suponha que um aluno tem três notas: A, B e C. Para calcular a média final, seu professor aplica os pesos 2, 3 e 5, respectivamente. Escreva um programa que lê os valores A, B e C e seus respectivos pesos. O programa deve produzir a média ponderada conforme descrito.
15. Escreva um programa que lê dois valores inteiros A e B e exibe o texto "Soma: " seguido da soma de A e B. Se A = 2 e B = 3, por exemplo, o programa deve exibir `Soma: 5`.
16. Faça um programa que lê um número inteiro e calcula o menor número de notas suficiente para representar tal valor. Considere a existência de notas de valores 200, 100, 50, 20, 10, 5, 2 e 1. Por exemplo, se o valor lido for 643, esse valor pode ser representado por:
    * 3 notas de 200
    * 2 notas de 20
    * 1 nota de 2
    * 1 nota de 1

    Assim, seu programa deve exibir o texto "7 notas". **Dica**: use os operadores `/` e `%`.

## Encerramento
Duration: 2:00

Você escreveu programas de sequência simples em Java: declarou variáveis de tipos primitivos, leu dados com `showInputDialog`, converteu textos em números com `Double.parseDouble`, fez cálculos com os operadores aritméticos e exibiu resultados com `showMessageDialog`.

### Próximos passos

* Resolva o desafio e os exercícios deste codelab
* Siga para o codelab de estruturas de seleção, em que os programas passam a tomar decisões
