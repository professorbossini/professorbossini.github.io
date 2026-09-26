summary: Nove exercícios resolvidos de lógica básica em Java, com programas sequenciais, de seleção (if/else e switch-case) e de repetição (while, for e do-while), usando JOptionPane e Scanner.
id: java-exercicios-logica-basica
categories: Java
tags: java,exercícios,lógica de programação,joptionpane,scanner,if,switch,while,for,do-while
status: Published
authors: Rodrigo Bossini
last updated: 2026-08-13
pdf: java/01_exercicios_logica_basica_java.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Exercícios: lógica básica em Java

## Visão geral
Duration: 2:00

Esta lista reúne nove exercícios de lógica básica em Java, organizados em três grupos: programas **sequenciais**, programas com **estruturas de seleção** e programas com **estruturas de repetição**. Alguns usam as caixas de diálogo da classe `JOptionPane`; outros usam a classe `Scanner` para ler do terminal.

Tente resolver cada exercício antes de abrir a solução.

### O que você vai praticar

* Entrada e saída com `JOptionPane` e com `Scanner`
* Cálculos com variáveis `double` e `int` e formatação com `String.format` e `printf`
* Seleção com `if/else`, `if/else if` e `switch-case`
* Repetição com `while`, `for` e `do-while`

### O que você vai precisar

* JDK instalado e um IDE ou editor de código
* Conhecer variáveis, entrada e saída, estruturas de seleção e de repetição

<aside class="positive">

Com `Scanner`, os valores decimais são lidos de acordo com a configuração regional do sistema: em um computador configurado em português, digite `5,5` em vez de `5.5`.

</aside>

## Exercícios sequenciais
Duration: 12:00

### 1. Conversão de temperatura (sequencial – JOptionPane)

Desenvolva um programa que solicite ao usuário uma temperatura em graus Celsius e calcule a temperatura correspondente em Fahrenheit. Utilize a fórmula $F = C \times 1{,}8 + 32$ e apresente o resultado com duas casas decimais.

<details><summary>Ver resposta</summary>

**Exercicio1.java**

```java
import javax.swing.JOptionPane;

public class Exercicio1 {
    public static void main(String[] args) {
        String entrada = JOptionPane.showInputDialog("Temperatura em Celsius:");
        double celsius = Double.parseDouble(entrada);
        double fahrenheit = celsius * 1.8 + 32;
        JOptionPane.showMessageDialog(null,
                String.format("Temperatura em Fahrenheit: %.2f °F", fahrenheit));
    }
}
```

</details>

### 2. Custo de uma viagem (sequencial – Scanner)

Crie um programa que leia a distância total de uma viagem em quilômetros, o consumo médio do veículo em quilômetros por litro e o preço do litro do combustível. Calcule e mostre a quantidade estimada de litros necessários e o custo total da viagem.

<details><summary>Ver resposta</summary>

**Exercicio2.java**

```java
import java.util.Scanner;

public class Exercicio2 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Distância da viagem em km: ");
        double distancia = scanner.nextDouble();
        System.out.print("Consumo do veículo em km/l: ");
        double consumo = scanner.nextDouble();
        System.out.print("Preço do litro do combustível: R$ ");
        double preco = scanner.nextDouble();
        double litros = distancia / consumo;
        double custo = litros * preco;
        System.out.printf("Litros necessários: %.2f%n", litros);
        System.out.printf("Custo total: R$ %.2f%n", custo);
        scanner.close();
    }
}
```

</details>

### 3. Média ponderada (sequencial – JOptionPane)

Elabore um programa que leia as notas de uma prova e de um trabalho. A prova possui peso 6 e o trabalho possui peso 4. Calcule e apresente a média ponderada do aluno.

<details><summary>Ver resposta</summary>

**Exercicio3.java**

```java
import javax.swing.JOptionPane;

public class Exercicio3 {
    public static void main(String[] args) {
        double prova = Double.parseDouble(
                JOptionPane.showInputDialog("Nota da prova:"));
        double trabalho = Double.parseDouble(
                JOptionPane.showInputDialog("Nota do trabalho:"));
        double media = (prova * 6 + trabalho * 4) / 10;
        JOptionPane.showMessageDialog(null,
                String.format("Média ponderada: %.2f", media));
    }
}
```

</details>

## Exercícios de seleção
Duration: 12:00

### 4. Número par ou ímpar (seleção – Scanner)

Faça um programa que leia um número inteiro e informe se ele é par ou ímpar. Utilize o operador de resto da divisão para realizar a verificação.

<details><summary>Ver resposta</summary>

**Exercicio4.java**

```java
import java.util.Scanner;

public class Exercicio4 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Digite um número inteiro: ");
        int numero = scanner.nextInt();
        if (numero % 2 == 0) {
            System.out.println("O número é par.");
        } else {
            System.out.println("O número é ímpar.");
        }
        scanner.close();
    }
}
```

</details>

### 5. Situação do aluno (seleção – JOptionPane)

Desenvolva um programa que leia a média final de um aluno. Se a média for maior ou igual a 6,0, mostre "Aprovado". Se estiver entre 4,0 e 5,9, mostre "Recuperação". Caso seja menor que 4,0, mostre "Reprovado".

<details><summary>Ver resposta</summary>

**Exercicio5.java**

```java
import javax.swing.JOptionPane;

public class Exercicio5 {
    public static void main(String[] args) {
        double media = Double.parseDouble(
                JOptionPane.showInputDialog("Digite a média final:"));
        String situacao;
        if (media >= 6.0) {
            situacao = "Aprovado";
        } else if (media >= 4.0) {
            situacao = "Recuperação";
        } else {
            situacao = "Reprovado";
        }
        JOptionPane.showMessageDialog(null, "Situação: " + situacao);
    }
}
```

</details>

### 6. Dia da semana (seleção com switch-case – Scanner)

Crie um programa que leia um número inteiro de 1 a 7 e apresente o dia da semana correspondente, considerando 1 como domingo e 7 como sábado. Para qualquer valor fora desse intervalo, informe que a opção é inválida. Utilize switch-case.

<details><summary>Ver resposta</summary>

**Exercicio6.java**

```java
import java.util.Scanner;

public class Exercicio6 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Digite um número de 1 a 7: ");
        int numero = scanner.nextInt();
        switch (numero) {
            case 1: System.out.println("Domingo"); break;
            case 2: System.out.println("Segunda-feira"); break;
            case 3: System.out.println("Terça-feira"); break;
            case 4: System.out.println("Quarta-feira"); break;
            case 5: System.out.println("Quinta-feira"); break;
            case 6: System.out.println("Sexta-feira"); break;
            case 7: System.out.println("Sábado"); break;
            default: System.out.println("Opção inválida.");
        }
        scanner.close();
    }
}
```

</details>

## Exercícios de repetição
Duration: 15:00

### 7. Soma até zero (repetição com while – Scanner)

Faça um programa que leia números inteiros e acumule a soma dos valores digitados. A leitura deve continuar enquanto o usuário não digitar zero. Ao final, apresente a soma total e a quantidade de números diferentes de zero que foram informados.

<details><summary>Ver resposta</summary>

**Exercicio7.java**

```java
import java.util.Scanner;

public class Exercicio7 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int soma = 0;
        int quantidade = 0;
        System.out.print("Digite um número inteiro (0 para encerrar): ");
        int numero = scanner.nextInt();
        while (numero != 0) {
            soma += numero;
            quantidade++;
            System.out.print("Digite outro número (0 para encerrar): ");
            numero = scanner.nextInt();
        }
        System.out.println("Soma: " + soma);
        System.out.println("Quantidade de números: " + quantidade);
        scanner.close();
    }
}
```

</details>

### 8. Tabuada (repetição com for – JOptionPane)

Elabore um programa que leia um número inteiro e monte sua tabuada de 1 a 10. Utilize uma estrutura for e apresente toda a tabuada em uma única caixa de diálogo.

<details><summary>Ver resposta</summary>

**Exercicio8.java**

```java
import javax.swing.JOptionPane;

public class Exercicio8 {
    public static void main(String[] args) {
        int numero = Integer.parseInt(
                JOptionPane.showInputDialog("Digite um número inteiro:"));
        StringBuilder tabuada = new StringBuilder();
        for (int i = 1; i <= 10; i++) {
            tabuada.append(numero)
                   .append(" x ")
                   .append(i)
                   .append(" = ")
                   .append(numero * i)
                   .append("\n");
        }
        JOptionPane.showMessageDialog(null, tabuada.toString(),
                "Tabuada", JOptionPane.INFORMATION_MESSAGE);
    }
}
```

</details>

### 9. Menu de operações (repetição com do-while – Scanner)

Crie um programa que apresente repetidamente um menu com as opções 1 - Somar dois números, 2 - Multiplicar dois números e 0 - Sair. Quando o usuário escolher 1 ou 2, leia dois valores e mostre o resultado. O menu deve ser exibido pelo menos uma vez e continuar até que a opção 0 seja escolhida. Utilize do-while.

<details><summary>Ver resposta</summary>

**Exercicio9.java**

```java
import java.util.Scanner;

public class Exercicio9 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int opcao;
        do {
            System.out.println("1 - Somar");
            System.out.println("2 - Multiplicar");
            System.out.println("0 - Sair");
            System.out.print("Opção: ");
            opcao = scanner.nextInt();
            if (opcao == 1 || opcao == 2) {
                System.out.print("Primeiro número: ");
                double a = scanner.nextDouble();
                System.out.print("Segundo número: ");
                double b = scanner.nextDouble();
                if (opcao == 1) {
                    System.out.println("Resultado: " + (a + b));
                } else {
                    System.out.println("Resultado: " + (a * b));
                }
            } else if (opcao != 0) {
                System.out.println("Opção inválida.");
            }
        } while (opcao != 0);
        scanner.close();
    }
}
```

</details>

## Encerramento
Duration: 2:00

Você praticou os três tipos de estrutura da lógica básica: sequência, seleção e repetição, alternando entre `JOptionPane` e `Scanner` para a entrada e a saída de dados.

### Próximos passos

* Refaça os exercícios trocando `JOptionPane` por `Scanner` e vice-versa
* Siga para a introdução à programação orientada a objetos
