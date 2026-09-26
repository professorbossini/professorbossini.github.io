summary: Repita trechos de código com as estruturas while, for e do/while em Java, partindo de pseudocódigo e fluxogramas, e pratique com exercícios resolvidos e propostos.
id: java-estruturas-de-repeticao
categories: Java
tags: java,estruturas de repetição,while,for,do/while,fluxograma,pseudocódigo
status: Published
authors: Rodrigo Bossini
last updated: 2021-08-11
pdf: java/005_apostila_estruturas_de_repeticao.pdf
exercicios: java/005_exercicios_java_estruturas_de_repeticao.pdf,java/005_exercicios_resolvidos_e_propostos_java_repeticao.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Java: estruturas de repetição

## Visão geral
Duration: 3:00

Muitas vezes nossos programas possuem trechos de código cuja execução deve ser repetida por um número determinado de vezes ou mesmo de maneira indefinida. Considere, por exemplo, um programa que permite a um professor informar as notas de seus alunos, uma a uma, a fim de calcular a média de cada um e, talvez, ao final, calcular também a média da turma. O programa deverá repetir a execução da entrada de dados. O que resta saber é como isso pode ser feito, já que copiar e colar código não é uma boa prática e pode haver casos em que o número de alunos sequer é conhecido.

### O que você vai aprender

* As estruturas de repetição while, for e do/while
* Como representá-las com pseudocódigo e fluxogramas
* A diferença entre testar a condição antes (while, for) e depois (do/while) do bloco
* Como implementá-las em Java

### O que você vai precisar

* JDK instalado e um IDE ou editor de código
* Conhecer variáveis, entrada e saída com `JOptionPane` e estruturas de seleção

## A estrutura while
Duration: 6:00

A linguagem de programação Java possui três estruturas de repetição: **while**, **for** e **do/while**. Como ocorre com as demais estruturas, elas podem ser representadas de várias formas diferentes. Vamos ilustrar seu uso por meio de um programa que permite ao professor informar a nota de 5 alunos, calculando a média de cada um e exibindo.

A representação por pseudocódigo da estrutura de repetição while é exibida na Listagem 2.1.1.

**Listagem 2.1.1**

```text
var nota1, nota2: real;
Início
    var contador: inteiro;
    contador = 1;
    Enquanto contador <= 10 Faça
        Ler nota1;
        Ler nota2;
        Escrever (nota1 + nota2)/2;
        contador = contador + 1;
    Fim Enquanto
Fim
```

<aside class="negative">

A Listagem 2.1.1 da apostila usa `contador <= 10`; para atender ao enunciado (5 alunos), como no fluxograma e nas demais listagens, a condição seria `contador <= 5`.

</aside>

O mesmo programa pode ser representado por um fluxograma, como na Figura 2.1.1.

![Fluxograma: início, contador = 1, ponto de junção, decisão contador <= 5; se verdadeiro lê nota1 e nota2, exibe (nota1 + nota2) / 2, faz contador = contador + 1 e volta ao ponto de junção; se falso segue para o fim](img/fig-2-1-1.webp)

*Figura 2.1.1 – Fluxograma da estrutura while: a condição é testada antes do bloco.*

## As estruturas for e do/while
Duration: 6:00

### A estrutura for

A estrutura for também pode ser utilizada para implementar o algoritmo de exemplo. Veja sua representação como pseudocódigo na Listagem 2.2.1. Note que ela é muito parecida com a estrutura while. Ocorre que as três partes de controle são especificadas de uma única vez em uma linha, potencialmente simplificando a leitura do código.

**Listagem 2.2.1**

```text
var nota1, nota2: real;
Início
    Para contador = 1 Até 5 Faça
        Ler nota1;
        Ler nota2;
        Escrever (nota1 + nota2) / 2;
    Fim Para
Fim
```

O fluxograma da estrutura for é análogo ao da estrutura while.

<aside class="positive">

**Importante.** Note que ambas estruturas for e while têm uma característica em comum: elas possuem um bloco a ser repetido e uma condição que precisa ser verdadeira para que o bloco repita mais uma vez. Ocorre que essa condição, em ambos os casos, é avaliada **antes** de o bloco ser executado. Isso quer dizer que, caso a condição seja avaliada como falsa logo de cara, o bloco não vai ser repetido nenhuma vez.

Isso é importante pois é o principal aspecto que difere as estruturas for e while da estrutura do/while. A estrutura do/while também possui um bloco de código a repetir e uma condição que precisa ser avaliada como verdadeira para que a repetição ocorra. Porém, o bloco é executado uma primeira vez e, somente depois disso a condição é avaliada.

</aside>

### A estrutura do/while

A Listagem 2.3.1 mostra o programa de exemplo implementado utilizando-se uma estrutura do tipo do/while.

**Listagem 2.3.1**

```text
var: nota1, nota2: real;
var: contador: inteiro;
Início
    contador = 1;
    Faça
        Ler nota1;
        Ler nota2;
        Escrever (nota1 + nota2) / 2;
        contador = contador + 1
    Enquanto contador <= 5
Fim
```

A Figura 2.3.1 mostra a implementação do algoritmo como um fluxograma.

![Fluxograma: início, contador = 1, ponto de junção, leitura de nota1 e nota2, exibição de (nota1 + nota2) / 2, contador = contador + 1 e só então a decisão contador <= 5, que volta ao ponto de junção se verdadeira ou segue para o fim se falsa](img/fig-2-3-1.webp)

*Figura 2.3.1 – Fluxograma da estrutura do/while: o bloco executa antes de a condição ser testada.*

## Implementação em Java
Duration: 10:00

Como mencionado, a linguagem Java possui as três estruturas de repetição descritas. É importante observar que tudo o que pode ser feito com uma delas pode ser feito com qualquer outra, eventualmente ajustando alguns poucos detalhes. A seguir, vemos o problema de exemplo implementado utilizando cada uma delas.

### while

A Listagem 3.1.1 mostra o programa de exemplo implementado em Java, utilizando a estrutura while.

**ExemploWhile.java · Listagem 3.1.1**

```java
import javax.swing.JOptionPane;

public class ExemploWhile {
    public static void main(String[] args) {
        double nota1, nota2;
        int contador = 1;
        while (contador <= 5) {
            nota1 = Double.parseDouble(JOptionPane.showInputDialog("Digite a nota 1"));
            nota2 = Double.parseDouble(JOptionPane.showInputDialog("Digite a nota 2"));
            JOptionPane.showMessageDialog(null, "Média: " + (nota1 + nota2) / 2);
            contador = contador + 1;
        }
    }
}
```

### for

A Listagem 3.1.2 mostra como implementar o programa exemplo usando uma estrutura for.

**ExemploFor.java · Listagem 3.1.2**

```java
import javax.swing.JOptionPane;

public class ExemploFor {
    public static void main(String[] args) {
        double nota1, nota2;
        for (int contador = 1; contador <= 5; contador = contador + 1) {
            nota1 = Double.parseDouble(JOptionPane.showInputDialog("Digite a nota 1"));
            nota2 = Double.parseDouble(JOptionPane.showInputDialog("Digite a nota 2"));
            JOptionPane.showMessageDialog(null, "Média: " + (nota1 + nota2) / 2);
            contador = contador + 1;
        }
    }
}
```

<aside class="negative">

**Atenção a dois detalhes desta listagem.** A linha `import javax.swing.JOptionPane;` não aparece na apostila e foi incluída aqui para o programa compilar. Além disso, a linha `contador = contador + 1;` dentro do bloco repete o incremento que o `for` já faz na sua terceira parte: com ela, o contador avança de 2 em 2 e o programa pede as notas só 3 vezes. Remova essa linha para obter as 5 repetições pretendidas.

</aside>

### do/while

A estrutura do/while é ilustrada na Listagem 3.3.1.

**ExemploDoWhile.java · Listagem 3.3.1**

```java
import javax.swing.JOptionPane;

public class ExemploDoWhile {
    public static void main(String[] args) {
        double nota1, nota2;
        int contador = 1;
        do {
            nota1 = Double.parseDouble(JOptionPane.showInputDialog("Digite a nota 1"));
            nota2 = Double.parseDouble(JOptionPane.showInputDialog("Digite a nota 2"));
            JOptionPane.showMessageDialog(null, "Média: " + ((nota1 + nota2) / 2));
            contador = contador + 1;
        } while (contador <= 5);
    }
}
```

### Exercícios da apostila

1. Escreva um programa que exibe os primeiros 100 números naturais. Faça versões usando for, while e do/while.
2. Reimplemente o exercício 1, fazendo com que os valores sejam exibidos em ordem reversa.
3. Escreva um programa que calcula o fatorial de um valor natural digitado pelo usuário.
4. Escreva um programa que verifica se um número natural digitado pelo usuário é primo.

## Exercícios resolvidos e propostos
Duration: 20:00

Estes exercícios, resolvidos e propostos, envolvem o uso de estruturas de repetição.

### 1. Lançamento de dados

Faça um programa que simula o lançamento de dois dados, d1 e d2, n vezes, e tem como saída o número de cada dado e a relação entre eles (>, <, =) de cada lançamento.

<details><summary>Ver resposta</summary>

**Ex32.java · Bloco de Código 2.1.1**

```java
import java.util.Random;
import java.util.Scanner;
public class Ex32 {
    public static void main(String[] args) {
        Random gerador = new Random();
        Scanner leitor = new Scanner(System.in);
        System.out.println("Qual o valor de n");
        int n = leitor.nextInt();
        for (int i = 1; i <= n; i++) {
            int d1 = gerador.nextInt(6) + 1;
            int d2 = gerador.nextInt(6) + 1;
            System.out.printf("%d %c %d\n", d1, d1 > d2 ? '>' : d2 > d1 ? '<' : '=', d2);
        }
        leitor.close();
    }
}
```

</details>

### 2. Área de n retângulos

Faça um programa que calcule a área de **n** retângulos de medidas (base = **b** e altura = **h**) digitadas pelo usuário. O programa deve garantir **n** > 0, **h** > 0 e **b** > 0.

<details><summary>Ver resposta</summary>

**Ex39.java · Bloco de Código 2.2.1**

```java
import javax.swing.JOptionPane;
//veja um exemplo de import static
import static java.lang.Integer.parseInt;
public class Ex39 {
    public static void main(String[] args) {
        int n;
        do {
            //Agora usamos sem qualificar com Integer
            n = parseInt(JOptionPane.showInputDialog("Qual o valor de n? Digite um valor positivo"));
        } while (n <= 0);

        int cont = 1;
        while (cont <= n) {
            int b, h;
            do {
                b = parseInt(JOptionPane.showInputDialog("Digite um valor de base positivo"));
            } while (b <= 0);
            do {
                h = parseInt(JOptionPane.showInputDialog("Digite um valor de altura positivo"));
            } while (h <= 0);
            JOptionPane.showMessageDialog(null,
                String.format(
                    "Área: %dm x %dm = %dm²\n",
                    b,
                    h,
                    b * h
                )
            );
            cont++;
        }

    }
}
```

</details>

### 3. Calculadora com menu

Faça um programa que apresente um menu de opções para o cálculo das seguintes operações entre dois números.

* adição (1)
* subtração (2)
* multiplicação (3)
* divisão (4)
* saída (5)

O programa deve possibilitar ao usuário a escolha da operação desejada, a exibição do resultado e a volta ao menu de opções. O programa só termina quando for escolhida a opção de saída (5). Use as estruturas do/while e switch/case.

### 4. Estatísticas de uma sequência

Faça um programa que leia valores inteiros continuamente, até que um valor menor ou igual a zero seja digitado. A seguir, o programa deve exibir:

* A soma dos números digitados
* A quantidade de números digitados
* A média dos números digitados
* O maior número digitado
* O menor número digitado
* A média dos números pares

## Lista de exercícios (1 a 13)
Duration: 30:00

1. Um funcionário de uma empresa recebe aumento salarial anualmente. Sabe-se que:
    1. esse funcionário foi contratado em 2005, com salário inicial de R\$ 1.000,00;
    2. em 2006 recebeu aumento de 1,5% sobre o salário inicial;
    3. a partir de 2007 (inclusive), os aumentos salariais sempre corresponderam ao dobro do percentual do ano anterior.

    Faça um programa que determine o salário atual desse funcionário.
2. Faça um programa que leia um valor N inteiro e positivo, calcule e mostre o valor de E, conforme a fórmula a seguir:

    $$E = 1 + \frac{1}{1!} + \frac{1}{2!} + \frac{1}{3!} + \dots + \frac{1}{N!}$$

3. Faça um programa que leia um número N e que indique quantos valores inteiros e positivos devem ser lidos a seguir. Para cada número lido, mostre uma tabela contendo o valor lido e o fatorial desse valor.
4. Foi feita uma estatística em cinco cidades brasileiras para coletar dados sobre acidentes de trânsito. Foram obtidos os seguintes dados: (a) código da cidade; (b) número de veículos de passeio (em 2007); (c) número de acidentes de trânsito com vítimas (em 2007). Deseja-se saber:
    * Qual o maior e menor índice de acidentes de trânsito e a que cidades pertencem
    * Qual a média de veículos nas cinco cidades juntas
    * Qual a média de acidentes de trânsito nas cidades com menos de 2.000 veículos de passeio
5. Faça um programa que leia o número de termos e um valor positivo para X, calcule e mostre o valor da série a seguir:

    $$S = -\frac{x^2}{1!} + \frac{x^3}{2!} - \frac{x^4}{3!} + \frac{x^5}{4!} - \frac{x^6}{3!} + \frac{x^7}{2!} - \frac{x^8}{1!} + \frac{x^9}{2!} - \frac{x^{10}}{3!} + \frac{x^{11}}{4!} - \dots$$

6. Uma empresa possui dez funcionários com as seguintes características: código, número de horas trabalhadas no mês, turno de trabalho (M – Matutino, V – Vespertino ou N – Noturno), categoria (O – Operário ou G – Gerente), valor da hora trabalhada. Sabendo-se que essa empresa deseja informatizar sua folha de pagamento, faça um programa que:
    1. leia as informações dos funcionários, exceto o valor da hora trabalhada, não permitindo que sejam informados turnos nem categoria inexistentes. Trabalhe sempre com a digitação de letras maiúsculas;
    2. calcule o valor da hora trabalhada, conforme a tabela a seguir. Adote o valor de R\$ 450,00 para o salário mínimo.

        | Categoria | Turno | Valor da hora trabalhada |
        | --- | --- | --- |
        | G | N | 18% do salário mínimo |
        | G | M ou V | 15% do salário mínimo |
        | O | N | 13% do salário mínimo |
        | O | M ou V | 10% do salário mínimo |

    3. calcule o salário inicial dos funcionários com base no valor da hora trabalhada e no número de horas trabalhadas;
    4. calcule o valor do auxílio-alimentação recebido por funcionário de acordo com o seu salário inicial, conforme a tabela a seguir.

        | Salário Inicial | Auxílio-Alimentação |
        | --- | --- |
        | Até R\$ 300,00 | 20% do salário inicial |
        | Entre R\$ 300,00 e R\$ 600,00 | 15% do salário inicial |
        | Acima de R\$ 600,00 | 5% do salário inicial |

    5. mostre o código, número de horas trabalhadas, valor da hora trabalhada, salário inicial, auxílio-alimentação e salário final (salário inicial + auxílio-alimentação).
7. Faça um programa que monte os oito primeiros termos da sequência de Fibonacci.

    `0 – 1 – 1 – 2 – 3 – 5 – 8 – 13 – 21 – 34 – 55 – ...`

8. Faça um programa que leia o número de termos, determine e mostre os valores de acordo com a série abaixo:

    `Série: 2, 7, 3, 4, 21, 12, 8, 63, 48, 16, 189, 192, 32, 567, 768, ...`

9. Faça um programa que receba duas notas de 6 alunos, calcule e mostre:
    * a média aritmética das duas notas de cada aluno;
    * a mensagem que está na tabela a seguir:

        | Média aritmética | Mensagem |
        | --- | --- |
        | Até 3,0 | Reprovado |
        | Entre 3,0 e 7,0 | Exame |
        | Acima de 7,0 | Aprovado |

    * o total de alunos aprovados;
    * o total de alunos de exame;
    * o total de alunos reprovados;
    * a média da classe.
10. Em um campeonato de futebol existem cinco times e cada time possui onze jogadores. Faça um programa que receba a idade, o peso e a altura de cada um dos jogadores, calcule e mostre:
    * A quantidade de jogadores com idade inferior a 18 anos;
    * A média das alturas de todos os jogadores de cada time;
    * A média das alturas de todos os jogadores do campeonato;
    * A percentagem de jogadores com mais de 80 quilos entre todos os jogadores do campeonato.
11. Faça um programa que receba um número inteiro maior que 1 e verifique se o número fornecido é primo ou não. Mostrar mensagem de número primo ou de número não primo. Um número é primo quando é divisível apenas pelo número um e por ele mesmo.
12. Em uma fábrica trabalham homens e mulheres divididos em três classes:
    * Trabalhadores que fazem até 30 peças por mês – Classe 1;
    * Trabalhadores que fazem de 21 a 31 peças por mês – Classe 2;
    * Trabalhadores que fazem mais de 21 peças por mês – Classe 3.

    A classe 1 recebe salário mínimo. A classe 2 recebe salário mínimo mais 3% do salário mínimo por peça, acima de 30 peças iniciais. A classe 3 recebe salário mínimo mais 5% do salário mínimo por peça, acima das 30 peças iniciais. Faça um programa que receba o número do operário, o número de peças fabricadas no mês, o sexo do operário, e que também calcule e mostre:
    * O número do operário e seu salário;
    * O total da folha de pagamento da fábrica;
    * O número total de peças fabricadas no mês;
    * A média de peças fabricadas pelos homens;
    * A média de peças fabricadas pelas mulheres;
    * O número do operário ou operária de maior salário.

    A fábrica possui 15 operários.
13. Foi feita uma pesquisa para determinar o índice de mortalidade infantil em um certo período. Faça um programa que:
    * Leia o número de crianças nascidas no período;
    * O sexo (M ou F) e o tempo de vida para cada criança nascida;

    Calcule e mostre:
    * A percentagem de crianças do sexo feminino mortas no período;
    * A percentagem de crianças do sexo masculino mortas no período;
    * A percentagem de crianças que viveram 24 meses ou menos no período.

## Lista de exercícios (14 a 25)
Duration: 30:00

14. Faça um programa que receba o valor de uma dívida e mostre uma tabela com os seguintes dados: valor da dívida, valor dos juros, quantidade de parcelas e valor da parcela. Os juros e a quantidade de parcelas seguem a tabela abaixo:

    | Quantidade de parcelas | % de juros sobre o valor inicial da dívida |
    | --- | --- |
    | 1 | 0 |
    | 3 | 10 |
    | 6 | 15 |
    | 9 | 20 |
    | 12 | 25 |

    Exemplo de saída do programa:

    | Valor da dívida | Valor dos juros | Quantidade de parcelas | Valor da parcela |
    | --- | --- | --- | --- |
    | R\$ 1.000,00 | 0 | 1 | R\$ 1.000,00 |
    | R\$ 1.100,00 | 100 | 3 | R\$ 366,67 |
    | R\$ 1.150,00 | 150 | 6 | R\$ 191,67 |

15. Faça um programa que receba o preço unitário, a refrigeração (S para os produtos que necessitam de refrigeração e N para os que não necessitam de refrigeração) e a categoria (A – alimentação, L – limpeza e V – vestuário) de 12 produtos. Calcule e mostre:
    * O custo de estocagem calculado de acordo com a tabela a seguir:

        | Preço Unitário | Refrigeração | Categoria | Custo de Estocagem |
        | --- | --- | --- | --- |
        | Até R\$ 20,00 | | A | R\$ 2,00 |
        | Até R\$ 20,00 | | L | R\$ 3,00 |
        | Até R\$ 20,00 | | V | R\$ 4,00 |
        | Entre R\$ 20,00 e R\$ 50,00 (inclusive) | S | | R\$ 6,00 |
        | Entre R\$ 20,00 e R\$ 50,00 (inclusive) | N | | R\$ 0,00 |
        | Maior que R\$ 50,00 | S | A | R\$ 5,00 |
        | Maior que R\$ 50,00 | S | L | R\$ 2,00 |
        | Maior que R\$ 50,00 | S | V | R\$ 4,00 |
        | Maior que R\$ 50,00 | N | A ou V | R\$ 0,00 |
        | Maior que R\$ 50,00 | N | L | R\$ 1,00 |

    * O imposto é calculado de acordo com as regras a seguir: se o produto **não preencher** nenhum dos requisitos abaixo, seu imposto será de 2% sobre o preço unitário; caso contrário, será de 4%. Os requisitos são: Categoria – A e Refrigeração S.
    * O preço final é calculado observando as informações anteriores, ou seja, preço unitário mais custo de estocagem mais imposto;
    * A classificação é calculada usando a tabela a seguir:

        | Preço final | Classificação |
        | --- | --- |
        | Até R\$ 20,00 | Barato |
        | Entre R\$ 20,00 e R\$ 100,00 | Normal |
        | Acima de R\$ 100,00 | Caro |

    * A média dos valores adicionais, ou seja, a média dos custos de estocagem e dos impostos dos 12 produtos;
    * O maior preço final;
    * O menor preço final;
    * O total de impostos;
    * A quantidade de produtos com classificação barato;
    * A quantidade de produtos com classificação caro;
    * A quantidade de produtos com classificação normal.
16. Faça um programa para calcular a área de um triângulo. Esse programa não pode permitir a entrada de dados inválidos, ou seja, medidas menores ou iguais a 0.
17. Faça um programa que receba o salário de um funcionário chamado Carlos. Sabe-se que o funcionário João tem um salário equivalente a um terço do salário de Carlos. Carlos aplicará seu salário integralmente na caderneta de poupança, que está rendendo 2% ao mês e João aplicará seu salário integralmente no fundo de renda fixa, que está rendendo 5% ao mês. Calcule e mostre a quantidade de meses necessários para que o valor pertencente a João iguale ou ultrapasse o valor pertencente a Carlos.
18. Faça um programa que leia um conjunto não determinado de valores, um de cada vez, e imprima uma tabela com cabeçalho. A tabela deverá conter o valor lido, seu quadrado, seu cubo e sua raiz quadrada. Finalizar a entrada de dados com um valor negativo ou 0.
19. Faça um programa que leia dois números não determinado de valores [m,n], todos inteiros e positivos, e que calcule e mostre a soma de todos os números inteiros entre m e n (inclusive). A digitação terminará quando m for maior ou igual a n.
20. Faça um programa para ler o código, o sexo (M – masculino, F – feminino) e o número de horas/aula dadas mensalmente pelos professores de uma universidade, sabendo-se que cada hora/aula vale R\$ 30,00. Emita uma listagem contendo o código, o salário bruto e o salário líquido (levando em consideração os descontos explicados a seguir) de todos os professores. Mostre também a média dos salários líquidos dos professores do sexo masculino e a média dos salários líquidos dos professores do sexo feminino. Considere:
    * Desconto para homens, 10% e, para mulheres, 5%;
    * As informações terminarão quando for lido o código = 99999.
21. Faça um programa que receba vários números, calcule e mostre:
    * A soma dos números digitados;
    * A quantidade de números digitados;
    * A média dos números digitados;
    * O maior número digitado;
    * O menor número digitado;
    * A média dos números pares;
    * A percentagem dos números ímpares entre todos os números digitados.

    Finalize a entrada de dados com a digitação do número 30.000.
22. Uma empresa decidiu fazer um levantamento em relação aos candidatos que se apresentarem para preenchimento de vagas em seu quadro de funcionários. Supondo que você seja o programador dessa empresa, faça um programa que leia, para cada candidato, a idade, o sexo (M ou F) e a experiência no serviço (S ou N). Para encerrar a entrada de dados, digite zero para a idade. O programa também deve calcular e mostrar:
    * O número de candidatos do sexo feminino;
    * O número de candidatos do sexo masculino;
    * A idade média dos homens que já têm experiência no serviço;
    * A percentagem dos homens com mais de 45 anos entre o total dos homens;
    * O número de mulheres com idade inferior a 21 anos e com experiência no serviço;
    * A menor idade entre as mulheres que já têm experiência no serviço.
23. Faça um programa que receba o valor do salário mínimo, uma lista contendo a quantidade de quilowatts gasta por consumidor e o tipo de consumidor (1 – residencial, 2 – comercial ou 3 – industrial) e que calcule e mostre:
    * O valor de cada quilowatt, sabendo que o quilowatt custa um oitavo do salário mínimo;
    * O valor a ser pago por cada consumidor (conta final mais acréscimo). O acréscimo encontra-se na tabela a seguir:

        | Tipo | % de acréscimo sobre o valor gasto |
        | --- | --- |
        | 1 | 5 |
        | 2 | 10 |
        | 3 | 15 |

    * O faturamento geral da empresa;
    * A quantidade de consumidores que pagam entre R\$ 500,00 e R\$ 1.000,00.

    Termine a entrada de dados com quantidade de quilowatts igual a zero.
24. Faça um programa que apresente o menu de opções a seguir, permita ao usuário escolher a opção desejada, receba os dados necessários para executar a operação e mostre o resultado. Verifique a possibilidade de opção inválida e não se preocupe com restrições do tipo salário inválido.

    ```text
    Menu de opções:
    1. Imposto
    2. Novo salário
    3. Classificação
    4. Finalizar o programa
    5. Digite a opção desejada
    ```

    Na **opção 1**: receber o salário de um funcionário, calcular e mostrar o valor do imposto usando as regras a seguir:

    | Salários | % do imposto |
    | --- | --- |
    | Menor que R\$ 500,00 | 5 |
    | De R\$ 500,00 a R\$ 850,00 | 10 |
    | Acima de R\$ 850,00 | 15 |

    Na **opção 2**: receber o salário de um funcionário, calcular e mostrar o valor do novo salário usando as regras a seguir:

    | Salários | Aumento |
    | --- | --- |
    | Maiores que R\$ 1.500,00 | R\$ 25,00 |
    | De R\$ 750,00 (inclusive) a R\$ 1.500,00 (inclusive) | R\$ 50,00 |
    | De R\$ 450,00 (inclusive) a R\$ 750,00 | R\$ 75,00 |
    | Menores que R\$ 450,00 | R\$ 100,00 |

    Na **opção 3**: receber o salário de um funcionário e mostrar sua classificação usando esta tabela:

    | Salários | Classificação |
    | --- | --- |
    | Até R\$ 750,00 | Mal remunerado |
    | Maiores que R\$ 750,00 | Bem remunerado |

25. Faça um programa que receba os dados a seguir de vários produtos: preço unitário, país de origem (1 – Estados Unidos, 2 – México, 3 – Outros), meio de transporte (T – terrestre, F – fluvial, A – aéreo), carga perigosa (S – Sim, N – Não), finalize a entrada de dados com um preço inválido, ou seja, menor ou igual a zero e que calcule e mostre:
    * O valor do imposto, usando a tabela a seguir:

        | Preço Unitário | Percentual de imposto sobre o preço unitário |
        | --- | --- |
        | Até R\$ 100,00 | 5% |
        | Maior que R\$ 100,00 | 10% |

    * O valor do transporte usando a tabela a seguir:

        | Carga Perigosa | País de Origem | Valor do transporte |
        | --- | --- | --- |
        | S | 1 | R\$ 50,00 |
        | S | 2 | R\$ 21,00 |
        | S | 3 | R\$ 24,00 |
        | N | 1 | R\$ 12,00 |
        | N | 2 | R\$ 21,00 |
        | N | 3 | R\$ 60,00 |

    * O valor do seguro, usando a regra a seguir: os produtos que vêm do México e os produtos que utilizam transporte aéreo pagam metade do valor do seu preço unitário como seguro.
    * O preço final, ou seja, preço unitário mais imposto mais valor do transporte mais valor do seguro.
    * Total dos impostos.

## Encerramento
Duration: 2:00

Você representou repetições com pseudocódigo e fluxogramas, viu a diferença entre testar a condição antes (while e for) ou depois (do/while) do bloco e implementou o mesmo programa em Java com as três estruturas.

### Referências

* DEITEL, P. e DEITEL, H. *Java Como Programar*. 8ª Edição. São Paulo, SP: Pearson, 2010.
* LOPES, A. e GARCIA, G. *Introdução à Programação – 500 Algoritmos Resolvidos*. 1ª Edição. São Paulo, SP: Elsevier, 2002.
