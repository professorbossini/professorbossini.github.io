summary: Faça programas Java tomarem decisões com if/else (simples, encadeado e aninhado), switch/case com e sem lógica em queda e o operador ternário, partindo de pseudocódigo e fluxogramas.
id: java-estruturas-de-selecao
categories: Java
tags: java,estruturas de seleção,if,else,switch,operador ternário,fluxograma,pseudocódigo
status: Published
authors: Rodrigo Bossini
last updated: 2022-02-24
pdf: java/003_apostila_java_estruturas_de_selecao.pdf
exercicios: java/003_exercicios_java_estruturas_de_selecao.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Java: estruturas de seleção

## Visão geral
Duration: 3:00

É comum que programas de computador possuam trechos de código cuja execução seja condicional. Ou seja, de acordo com alguma condição especificada pelo programador, o trecho de código pode ou não ser executado. Isso é diferente do que vimos até agora. Os programas desenvolvidos até então consistem em uma única sequência de instruções, as quais executam uma após a outra, de maneira incondicional.

A linguagem Java possui três estruturas de seleção: **if/else** (e suas variações), **switch/case** e o **operador ternário**. Nos passos a seguir estudaremos as três estruturas.

### O que você vai aprender

* Como representar estruturas de seleção com pseudocódigo e fluxogramas
* As estruturas Se/Senão simples, encadeada e aninhada
* A estrutura Avalie/Caso e a sua lógica em queda
* Como usar `if`, `else`, `switch/case` e o operador ternário em Java

### O que você vai precisar

* JDK instalado e um IDE ou editor de código
* Conhecer variáveis, entrada e saída com `JOptionPane` (codelab anterior)

## Estrutura Se: pseudocódigo e fluxograma
Duration: 8:00

Programas de computador podem ser representados com **pseudocódigo**, **fluxogramas** e outras alternativas. Vejamos alguns exemplos de representação para estruturas de seleção.

### Se simples

O Bloco de Código 2.1.1 mostra um exemplo de representação de algoritmo que utiliza uma estrutura de seleção do tipo Se. O algoritmo opera sobre um valor de nota obtido por um aluno e decide se ele está aprovado. Note que esse tipo de notação admite muitas variações. O que importa é que o conteúdo apresentado seja claro e não ambíguo.

**Bloco de Código 2.1.1**

```text
Var
    nota: real;
Início
    Ler nota;
    Se nota maior ou igual a 70 Então
        Escrever "Aprovado"
    Fim Se
Fim
```

A Figura 2.1.1 mostra o mesmo algoritmo utilizando a representação chamada fluxograma.

![Fluxograma: início, leitura da nota, decisão nota >= 70; se verdadeiro escreve Aprovado; os dois caminhos se juntam antes do fim](img/fig-2-1-1.webp)

*Figura 2.1.1 – Fluxograma da estrutura Se simples.*

### Se com Senão

É possível associar um bloco "Senão" a uma estrutura de seleção do tipo Se. A execução deles é mutuamente exclusiva. Ou seja, se o bloco Se executar, o bloco Senão não executa. E vice-versa. Veja o Bloco de Código 2.1.2.

**Bloco de Código 2.1.2**

```text
Var
    nota: real;
Início
    Ler nota;
    Se nota maior ou igual a 70 Então
        Escrever "Aprovado"
    Senão
        Escrever "Reprovado"
    Fim Se
Fim
```

A Figura 2.1.2 mostra essa variação como um fluxograma.

![Fluxograma: decisão nota >= 70 com o ramo verdadeiro escrevendo Aprovado e o falso escrevendo Reprovado, ambos seguindo para o fim](img/fig-2-1-2.webp)

*Figura 2.1.2 – Fluxograma da estrutura Se/Senão.*

### Se encadeado

Há também uma variação chamada "**encadeada**". Veja um exemplo no Bloco de Código 2.1.3.

**Bloco de Código 2.1.3**

```text
Var
    nota: real;
Início
    Ler nota;
    Se nota maior ou igual a 90 Então
        Escrever "Conceito A"
    Senão Se nota maior ou igual a 80 Então
        Escrever "Conceito B"
    Senão Se nota maior ou igual a 70 Então
        Escrever "Conceito C"
    Senão
        Escrever "Reprovado"
    Fim Se
Fim
```

A Figura 2.1.3 mostra um fluxograma que faz uso de uma estrutura de seleção encadeada.

![Fluxograma com três decisões em sequência: nota >= 90 leva a Conceito A, senão nota >= 80 leva a Conceito B, senão nota >= 70 leva a Conceito C, senão Reprovado](img/fig-2-1-3.webp)

*Figura 2.1.3 – Fluxograma de uma estrutura de seleção encadeada.*

### Se aninhado

Por fim, vejamos a variação **aninhada**, ilustrada no Bloco de Código 2.1.4.

**Bloco de Código 2.1.4**

```text
Var
    nota: real;
Início
    Ler nota;
    Se nota maior ou igual a 90 Então
        Escrever "Conceito A"
    Senão
        Se nota maior ou igual a 80 Então
            Escrever "Conceito B"
        Senão
            Se nota maior ou igual a 70 Então
                Escrever "Conceito C"
            Senão
                Escrever "Reprovado"
            Fim Se
        Fim Se
    Fim Se
Fim
```

A Figura 2.1.4 mostra um fluxograma que utiliza uma estrutura de seleção aninhada.

![Fluxograma com decisões aninhadas: cada ramo falso contém uma nova decisão, e cada estrutura tem seu próprio ponto de junção antes do fim](img/fig-2-1-4.webp)

*Figura 2.1.4 – Fluxograma de uma estrutura de seleção aninhada.*

## Avalie/Caso e o operador ternário
Duration: 6:00

Muitas linguagens de programação disponibilizam uma estrutura chamada **switch/case**, que pode ser útil quando, por exemplo, há uma lista de valores finita envolvida na seleção do bloco a ser executado. Os blocos de código 2.2.1 e 2.2.2 mostram exemplos de pseudocódigo para essa estrutura.

**Bloco de Código 2.2.1**

```text
Var
    nota: inteiro;
Início
    Ler nota;
    Avalie nota:
        Caso 10:
            Escrever Parabéns!
            Escrever Conceito A.
            Pare
        Caso 9:
            Escrever Conceito A.
            Pare
        Caso 8:
            Escrever Conceito B.
            Pare
        Caso 7:
            Escrever Conceito C.
            Pare
        Caso Contrário:
            Escrever Reprovado.
    Fim Avalie
Fim
```

No Bloco de Código 2.2.2 a importância da instrução **Pare** fica evidente. A estrutura Avalie/Caso possui uma espécie de **lógica em queda** aplicada à sua execução: quando um caso é escolhido, a execução começa ali até uma de duas coisas acontecer: uma instrução "Pare" ser encontrada ou o fim da estrutura "Avalie" ser encontrado.

**Bloco de Código 2.2.2**

```text
Var
    nota: inteiro;
Início
    Ler nota;
    Avalie nota:
        Caso 10:
            Escrever Parabéns!
        Caso 9:
            Escrever Conceito A.
            Pare
        Caso 8:
            Escrever Conceito B.
            Pare
        Caso 7:
            Escrever Conceito C.
            Pare
        Caso Contrário:
            Escrever Reprovado.
    Fim Avalie
Fim
```

A estrutura de seleção conhecida como **operador ternário** tem funcionamento análogo à estrutura Se. É comum utilizá-la para simplificar o código, muitas vezes fazendo seleções em uma única linha. Sua representação como pseudocódigo ou fluxograma é análoga àquelas da estrutura Se.

## Java: if simples e if/else
Duration: 6:00

Como vimos, uma linguagem de programação pode disponibilizar diferentes estruturas de seleção. No caso da linguagem Java, as três estruturas mencionadas até então estão disponíveis. Vejamos como elas podem ser utilizadas.

### A estrutura if simples

O Bloco de Código 3.1.1 mostra a estrutura de seleção if simples em uso.

**IfSimples.java · Bloco de Código 3.1.1**

```java
import javax.swing.JOptionPane;

public class IfSimples {
    public static void main(String[] args) {
        double nota;
        nota = Double.parseDouble(JOptionPane.showInputDialog("Digite a nota"));
        if (nota >= 70) {
            JOptionPane.showMessageDialog(null, "Aprovado");
        }
    }
}
```

### Associando um bloco else (senão) a um bloco if

O Bloco de Código 3.2.1 mostra como um bloco `if` pode ter a ele associado um bloco `else`. Lembre-se que a execução deles é mutuamente exclusiva. Se um executa, o outro não executa. Um deles sempre executa.

**IfElse.java · Bloco de Código 3.2.1**

```java
import javax.swing.JOptionPane;

public class IfElse {
    public static void main(String[] args) {
        double nota;
        nota = Double.parseDouble(JOptionPane.showInputDialog("Digite a nota"));
        if (nota >= 70) {
            JOptionPane.showMessageDialog(null, "Aprovado");
        }
        else {
            JOptionPane.showMessageDialog(null, "Reprovado");
        }
    }
}
```

## Java: if/else encadeado e aninhado
Duration: 6:00

### If/else encadeado

Veja um exemplo de if/else encadeado no Bloco de Código 3.3.1.

**IfElseEncadeado.java · Bloco de Código 3.3.1**

```java
import javax.swing.JOptionPane;

public class IfElseEncadeado {
    public static void main(String[] args) {
        double nota;
        nota = Double.parseDouble(JOptionPane.showInputDialog("Digite a nota"));
        if (nota >= 90) {
            JOptionPane.showMessageDialog(null, "Parabéns");
            JOptionPane.showMessageDialog(null, "Conceito A");
        }
        else if (nota >= 80) {
            JOptionPane.showMessageDialog(null, "Conceito B");
        }
        else if (nota >= 70) {
            JOptionPane.showMessageDialog(null, "Conceito C");
        }
        else {
            JOptionPane.showMessageDialog(null, "Reprovado");
        }
    }
}
```

### If/else aninhado

Também é possível aninhar blocos. No Bloco de Código 3.4.1 ilustramos como isso pode ser feito com blocos if/else.

**IfElseAninhado.java · Bloco de Código 3.4.1**

```java
import javax.swing.JOptionPane;

public class IfElseAninhado {
    public static void main(String[] args) {
        double nota;
        nota = Double.parseDouble(JOptionPane.showInputDialog("Digite a nota"));
        if (nota >= 90) {
            JOptionPane.showMessageDialog(null, "Parabéns");
            JOptionPane.showMessageDialog(null, "Conceito A");
        }
        else {
            if (nota >= 80) {
                JOptionPane.showMessageDialog(null, "Conceito B");
            }
            else {
                if (nota >= 70) {
                    JOptionPane.showMessageDialog(null, "Conceito C");
                }
                else {
                    JOptionPane.showMessageDialog(null, "Reprovado");
                }
            }
        }
    }
}
```

## Java: a estrutura switch/case
Duration: 6:00

Nesta seção veremos como a estrutura switch/case pode ser utilizada na linguagem Java.

### Exemplo com cases independentes

No Bloco de Código 4.1.1 o código exibido faz uso de uma estrutura switch/case em que, para cada case, um bloco específico é determinado.

**SwitchCase.java · Bloco de Código 4.1.1**

```java
import javax.swing.JOptionPane;

public class SwitchCase {
    public static void main(String[] args) {
        int nota;
        nota = Integer.parseInt(JOptionPane.showInputDialog("Digite a nota"));
        switch (nota) {
            case 10:
                JOptionPane.showMessageDialog(null, "Parabéns");
                JOptionPane.showMessageDialog(null, "Conceito A");
                break;
            case 9:
                JOptionPane.showMessageDialog(null, "Conceito A");
                break;
            case 8:
                JOptionPane.showMessageDialog(null, "Conceito B");
                break;
            case 7:
                JOptionPane.showMessageDialog(null, "Conceito C");
                break;
            default:
                JOptionPane.showMessageDialog(null, "Reprovado");
                break;
        }
    }
}
```

### Exemplo usando a lógica em queda (fall-through)

Alguns cases podem ter trechos de código em comum. Neste caso, podemos empregar a lógica em queda do switch e escrever menos código, como mostra o Bloco de Código 4.2.1.

**SwitchCaseLogicaEmQueda.java · Bloco de Código 4.2.1**

```java
import javax.swing.JOptionPane;

public class SwitchCaseLogicaEmQueda {
    public static void main(String[] args) {
        int nota;
        nota = Integer.parseInt(JOptionPane.showInputDialog("Digite a nota"));
        switch (nota) {
            case 10:
                JOptionPane.showMessageDialog(null, "Parabéns");
            case 9:
                JOptionPane.showMessageDialog(null, "Conceito A");
                break;
            case 8:
                JOptionPane.showMessageDialog(null, "Conceito B");
                break;
            case 7:
                JOptionPane.showMessageDialog(null, "Conceito C");
                break;
            default:
                JOptionPane.showMessageDialog(null, "Reprovado");
                break;
        }
    }
}
```

## Java: o operador ternário
Duration: 5:00

O operador ternário (ele opera sobre três operandos, daí o nome) é uma construção da linguagem que tende a simplificar determinados blocos que envolvem decisões. Ele permite que decisões sejam realizadas em uma única linha.

### Atribuição simples com operador ternário

Considere o seguinte exemplo. Desejamos guardar em uma variável uma informação que indica se o usuário pode dirigir em função de sua idade. Obviamente isso pode ser feito com um if/else. O operador ternário permite que isso seja feito de maneira mais simples. No Bloco de Código 5.1.1 fazemos uso da estrutura if/else já vista. O Bloco de Código 5.1.2 mostra como fazer a mesma coisa usando o operador ternário.

**PodeDirigirIfElse.java · Bloco de Código 5.1.1**

```java
import javax.swing.JOptionPane;

public class PodeDirigirIfElse {
    public static void main(String[] args) {
        int idade = Integer.parseInt(JOptionPane.showInputDialog("Quantos anos você tem?"));
        String podeDirigir;
        if (idade >= 18)
            podeDirigir = "Sim, você pode dirigir";
        else
            podeDirigir = "Não, você não pode dirigir por enquanto";
        JOptionPane.showMessageDialog(null, podeDirigir);
    }
}
```

<aside class="negative">

A linha `import javax.swing.JOptionPane;` não aparece no Bloco de Código 5.1.1 da apostila; ela foi incluída aqui porque sem ela o programa não compila.

</aside>

**PodeDirigirTernario.java · Bloco de Código 5.1.2**

```java
import javax.swing.JOptionPane;

public class PodeDirigirTernario {
    public static void main(String[] args) {
        int idade = Integer.parseInt(JOptionPane.showInputDialog("Quantos anos você tem?"));
        String podeDirigir;
        podeDirigir = idade >= 18 ? "Sim, você pode dirigir" : "Não, você não pode dirigir por enquanto";
        JOptionPane.showMessageDialog(null, podeDirigir);
    }
}
```

## Exercícios
Duration: 30:00

### Exercícios da apostila

1. Ler um número inteiro e exibir se ele é positivo, negativo ou neutro (0).
2. Ler coeficientes reais a, b e c de uma equação de segundo grau e exibir a(s) raiz(es), caso exista(m). Lembretes: calcule o valor de delta. Se ele for negativo, não há raízes. Se for igual a zero, há uma única raiz. Se delta for maior do que zero, então há duas raízes.
3. Ler três valores reais e exibir o maior valor entre eles. Suponha que eles sejam diferentes.
4. Ler um inteiro no intervalo [1, 7] e exibir o dia da semana associado a ele, como a seguir: 1: Domingo, 2: Segunda, 3: Terça. E assim por diante.
5. Ler um número inteiro no intervalo [1, 12]. Considerando que cada número representa um mês da seguinte forma: 1: Janeiro, 2: Fevereiro e assim por diante, exiba o número de dias que o mês cujo respectivo número digitado possui.
6. Ler um número inteiro e responder se ele é bissexto ou não. Um ano bissexto tem as seguintes características:
    * é múltiplo de quatro e não é múltiplo de 100 ou
    * é múltiplo de 400

### Lista de exercícios

1. Escreva um programa que faz a leitura de um número inteiro e um número real. Caso o número inteiro seja menor do que o número real, o programa deve imprimir uma mensagem dizendo isso ao usuário. Caso contrário, o programa somente termina.
2. Escreva um programa que faz a leitura de dois números reais e verifica se eles são iguais. Se forem, o programa deve mostrar uma mensagem ao usuário informando-o disso. Caso contrário, o programa somente termina.
3. Escreva um programa que faz a leitura de 2 números inteiros. Caso o primeiro seja maior do que o segundo, o programa imprime "primeiro maior do que o segundo". Caso contrário, o programa imprime "segundo maior do que o primeiro".
4. Escreva um programa que pede para o usuário inserir dois números, obtém os números do usuário e então imprime o maior número seguido pelas palavras "é o maior". Se os números forem iguais, imprime a mensagem "Estes números são iguais".
5. Escreva um programa que lê três inteiros a partir do teclado e imprime a soma, a média, o produto, o menor e o maior desses números.
6. Escreva um programa que lê dois valores reais. O primeiro valor é o saldo de uma conta bancária e o segundo é um valor que o usuário deseja sacar desta conta. Caso seja possível efetuar o saque (ou seja, o saldo não fique negativo), o programa deve mostrar o saldo remanescente. Caso contrário, deve informar o usuário que não foi possível realizar o saque.
7. Faça um programa que lê um valor real, representando o valor de uma peça de roupa. A seguir, o programa deve ler um inteiro (0, 1 ou 2) os quais representam as seguintes opções:
    * 0 – Compra à vista
    * 1 – Compra parcelada no cartão
    * 2 – Crediário

    Na opção 0, o programa deve calcular quanto custa a peça de roupa com 10% de desconto. Na opção 1, o programa deve perguntar ao usuário quantas parcelas deseja utilizar e exibir o valor da parcela. Na opção 2, o usuário pagará juros de 10% sobre o valor total. O programa deve ler o número de parcelas desejado e exibir o valor de cada parcela, que é calculado sobre o valor com juros. Caso o usuário digite alguma opção diferente de 0, 1 ou 2, o programa deve informar "opção inválida" e terminar.
8. Escreva um programa que lê a altura e peso do usuário e calcula o seu IMC, índice de massa corpórea. O programa deve exibir um texto para o usuário conforme a tabela abaixo:

    | IMC | Texto |
    | --- | --- |
    | Abaixo de 18,5 | Abaixo do peso ideal. |
    | Entre 18,5 e 24,9 | Peso ideal, muito bem. |
    | Entre 25,0 e 29,9 | Sobrepeso, um regime leve pode ajudar. |
    | Entre 30,0 e 34,9 | Obesidade leve. |
    | Entre 35,0 e 39,9 | Obesidade moderada. |
    | Acima de 40 | Obesidade mórbida. |

9. Escreva um programa que lê duas notas de um estudante, ambas sendo valores reais. O programa deve calcular a média e exibir um texto para o usuário conforme a tabela a seguir:

    | Nota | Texto |
    | --- | --- |
    | média >= 9 | Parabéns, continue assim! |
    | 7 <= média < 9 | Aprovado. |
    | 6 <= média < 7 | Aprovado no limite, estude um pouco mais. |
    | 2 <= média < 6 | Não está aprovado mas ainda pode fazer a segunda época |
    | média < 2 | Reprovado. Nos vemos semestre que vem. |

10. Escreva um programa que oferece para o usuário as seguintes opções:
    * 1 – Misto quente R\$5,50
    * 2 – Salada Chinesa R\$10,20
    * 3 – Suco de Laranja R\$4,00
    * 4 – Suco de Manga R\$3,50

    Se o usuário digitar qualquer número diferente de 1, 2, 3 ou 4, o seu programa deve exibir uma mensagem de erro e terminar. Caso contrário, se o usuário escolher alguma bebida, o programa deve exibir "tenha um excelente drink, vai lhe custar" seguido do valor da bebida. Se o usuário escolher alguma comida, o programa deve exibir "bom apetite, vai lhe custar" seguido do valor da comida.
11. Faça um programa que lê os seguintes dados:
    * código de estado (um inteiro de 1 a 5)
    * valor inicial de carga

    Seu programa deve calcular qual o valor final de uma carga de acordo com as seguintes regras. Caso o código de estado seja 2 ou 5 o valor final da carga é o valor inicial menos 12%. Caso o código de estado seja 1, 3 ou 4, o valor final da carga é o valor inicial menos 15%.
12. Escreva um programa que verifica se um dado número inteiro de quatro dígitos é uma senha válida. Para ser considerado como uma senha válida, um número tem que ter as seguintes características:
    * O primeiro dígito da esquerda para a direita tem que ser 8 ou 5
    * O quarto dígito da esquerda para a direita tem que ser 5 ou 1
    * A soma do segundo com o terceiro dígitos tem que ser 3 caso o quarto dígito seja 5 e 0 caso ele seja 1

    Por exemplo, o número 8125 é uma senha válida pois começa com 8, termina com 5 e a soma dos dois dígitos do meio é 3.
13. Escreva um programa que lê três números inteiros diferentes e os exibe em ordem crescente. Se o usuário digitar números iguais, seu programa deve exibir uma mensagem de erro e terminar.
14. Escreva um programa que lê as notas de 10 alunos e calcula a média aritmética delas. Caso a média seja pelo menos 6, o programa deve exibir a quantidade de alunos que tiveram nota maior do que 8. Caso contrário, o programa deve exibir a quantidade de alunos que tiraram nota 0.
15. Faça um programa que lê os seguintes dados:
    * valor/hora (é um número real positivo)
    * horas trabalhadas (é um inteiro)
    * imposto (um real entre 0 e 1, inclusive)
    * comissão (é um real positivo)

    Seu programa deve calcular e exibir para o usuário os seguintes valores: **salário bruto**, que é igual ao valor/hora multiplicado pelo número de horas trabalhadas; **salário líquido**, que é igual ao salário bruto menos o imposto mais a comissão. Note que a comissão somente entrará nos cálculos caso o número de horas trabalhadas seja pelo menos 120.

## Encerramento
Duration: 2:00

Você representou decisões com pseudocódigo e fluxogramas e as implementou em Java com `if`, `else`, `if/else` encadeado e aninhado, `switch/case` (com e sem lógica em queda) e o operador ternário.

### Próximos passos

* Resolva os exercícios deste codelab
* Siga para o codelab de strings em Java
