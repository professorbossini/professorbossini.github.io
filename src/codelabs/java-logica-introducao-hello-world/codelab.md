summary: Entenda o que são lógica, algoritmos e linguagens de programação, como a CPU conversa com a memória (da linguagem de máquina ao alto nível) e dê os primeiros passos com a plataforma Java.
id: java-logica-introducao-hello-world
categories: Java
tags: java,lógica de programação,algoritmos,jvm,jdk,hello world
status: Published
authors: Rodrigo Bossini
last updated: 2022-02-14
pdf: java/001_apostila_logica_java_introducao_hello_world.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Lógica de programação e introdução ao Java: Hello, World

## Visão geral
Duration: 3:00

Neste material estudaremos sobre lógica de programação, algoritmos e suas possíveis representações e o desenvolvimento de programas de computador utilizando linguagens de programação.

### O que você vai aprender

* O que são lógica, algoritmo e linguagem de programação
* Como escrever algoritmos para problemas do dia a dia, com decisões e repetições
* Como funcionam a memória, a CPU e o banco de registradores
* A diferença entre linguagem de máquina, linguagem de montagem e linguagem de alto nível
* O ambiente de desenvolvimento Java: JDK, JVM, JRE, compilação e interpretação
* Como começar com o clássico "Hello, World"

### O que você vai precisar

* Um computador com o JDK instalado
* Um IDE ou editor de código (por exemplo, o VS Code)

## Definições
Duration: 3:00

> **Lógica**
>
> Raciocínio realizado de acordo com princípios muito bem definidos e considerados válidos, verdadeiros.

> **Algoritmo**
>
> Sequência de passos finita construída com o objetivo de solucionar um problema.

> **Linguagem de Programação**
>
> Ferramenta que permite que um algoritmo seja expresso de modo que o computador seja capaz de entendê-lo e executá-lo.

## Exemplos de algoritmos
Duration: 8:00

No dia a dia, nós desenvolvemos e aplicamos muitos algoritmos com o objetivo de solucionar problemas comuns. Veja alguns exemplos.

### Algoritmo (sequência de passos) para fritar um ovo

```text
1 – Pegar frigideira, ovo, óleo e sal
2 – Colocar óleo na frigideira
3 – Acender o fogo
4 – Colocar a frigideira no fogo
5 – Esperar o óleo esquentar
6 – Colocar o ovo
7 – Retirar quando pronto
```

### Algoritmo (sequência de passos) para mascar um chiclete

```text
1 – Pegar o chiclete
2 – Retirar o papel
3 – Mastigar
4 – Jogar o papel no lixo
```

### Algoritmo (sequência de passos) para trocar uma lâmpada

```text
1 – Se (lâmpada estiver fora de alcance)
        Pegar a escada
2 – Pegar a lâmpada
3 – Se (lâmpada estiver quente)
        Pegar pano
4 – Tirar lâmpada queimada
5 – Colocar lâmpada boa
```

### Algoritmo (sequência de passos) para o fim de semana

```text
1 – Ver a previsão do tempo
2 – Se (fizer Sol)
        Vou à praia
3 – Senão
        Vou estudar
4 – Ver televisão
5 – Dormir
```

### Algoritmo (sequência de passos) para descascar batatas

```text
1 – Pegar faca, bacia e batatas
2 – Colocar água na bacia
3 – Enquanto (houver batatas)
        descascar próxima batata
        colocar batata descascada na água
```

### Algoritmo (sequência de passos) para fazer uma prova

```text
1 – Ler a prova
2 – Pegar a caneta
3 – Enquanto (houver questão em branco) e (tempo não terminou) faça
        Se (souber a resposta para uma questão)
            Resolvê-la
        Senão
            Pular para outra ainda não avaliada
4 – Entregar a prova
5 – Rezar
```

### Exercícios propostos

1. Escreva um algoritmo que descreva o que você pretende fazer ao longo do semestre para ser aprovado nesta disciplina.
2. Considere um hábito de seu cotidiano, algo que você costuma fazer com frequência. Escreva a sequência de passos, ou seja, o algoritmo, que representa este hábito.

## Memória, CPU e banco de registradores
Duration: 6:00

Nesta seção iremos estudar sobre o funcionamento básico de um computador, considerando os aspectos mais importantes para o desenvolvedor de software.

### Memória e CPU

Programar um computador significa especificar o que ele deve fazer. Para isso, precisamos conhecer as partes mais importantes dele, que são a memória e a CPU. Além disso, precisamos conhecer como ambas interagem, que é por meio de operações comumente chamadas de **leitura** e **escrita**. Veja a Figura 4.1.1. Note que a memória é dividida em pequenos blocos, cada qual com o seu endereço. Em cada um deles podemos guardar um dado de interesse a fim de viabilizar a solução computacional de algum problema.

![CPU ligada à memória RAM por setas de leitura e escrita; a RAM tem blocos com endereços de 001 a 111](img/fig-4-1-1.webp)

*Figura 4.1.1 – A CPU lê e escreve dados em blocos endereçados da memória RAM.*

### O banco de registradores

A Figura 4.1.1 ilustra os componentes fundamentais de um computador. Porém há um detalhe muito importante a ser citado. A velocidade de processamento da CPU, nos dias atuais, é muito maior do que a velocidade com que a memória é capaz de disponibilizar os dados para que o processamento ocorra. Por exemplo, para calcular 10% de aumento sobre o salário de uma pessoa que está armazenado na memória, a CPU precisa fazer uma operação de leitura nela. Por ser muito mais rápida do que a memória, a tendência é que a CPU passe algum tempo ociosa aguardando até que o salário esteja disponível para ela poder processar, o que é um desperdício computacional. Para resolver esse problema, os computadores empregam um recurso conhecido como **hierarquia de memória**. O banco de registradores faz parte dele. Trata-se de um bloco de memória parecido com a memória RAM, porém menor e muito mais rápido. Ele fica entre a CPU e a memória. Veja a Figura 4.2.1.

![CPU ligada a um banco de registradores com quatro posições, que por sua vez troca dados com a memória RAM](img/fig-4-2-1.webp)

*Figura 4.2.1 – O banco de registradores fica entre a CPU e a memória RAM.*

Como a Figura 4.2.1 ilustra, a fim de realizar alguma computação, é preciso transportar dados da memória RAM para o banco de registradores para que só então a CPU possa manipulá-los.

## Da linguagem de máquina ao alto nível
Duration: 10:00

### Somando dois números com linguagem de máquina

Para programar um computador utilizamos uma linguagem de programação. Uma ferramenta que nos permite especificar à CPU o que ela deve fazer. A linguagem que a CPU entende nativamente é composta somente de 0s e 1s. Essa é a conhecida **linguagem de máquina**. A fim de ilustrar o uso de uma linguagem de máquina, vamos escrever um programa que realiza a soma de dois valores existentes na memória, armazenando o resultado nela no final. Para tal, precisamos de comandos para as operações descritas na Tabela 4.3.1.

*Tabela 4.3.1*

| Comando | Finalidade | Como utilizar? |
| --- | --- | --- |
| load | Transportar um dado da memória para o banco de registradores | 1001 |
| store | Transportar um dado do banco de registradores para a memória | 1100 |
| add | Somar dois valores | 1111 |

Na Tabela 4.3.1 especificamos três comandos para a nossa CPU fictícia. CPUs reais também possuem uma tabela dessa, bem mais complexa e com mais operações. Mas a ideia é exatamente a mesma. A Figura 4.3.1 mostra o que desejamos fazer.

![Os valores 2 e 3 estão na RAM nos endereços 001 e 011, são carregados nos registradores 001 e 010, somados no registrador 100 e o resultado 5 é gravado na RAM no endereço 110](img/fig-4-3-1.webp)

*Figura 4.3.1 – Somando 2 e 3: carregar nos registradores, somar e gravar o resultado na memória.*

De acordo com a linguagem que especificamos para a nossa CPU, o programa que realiza essas operações é exibido na Listagem 4.3.1.

**Listagem 4.3.1**

```text
1001 001 001
1001 011 010
1111 001 010 100
1100 100 110
```

### Somando dois números com linguagem de montagem

Perceba como a programação de computadores utilizando linguagem de máquina pode ser difícil e propensa a erros. Por essa razão, as CPUs oferecem um mecanismo conhecido como **montador** ou **assembler**. Isso permite que o programador especifique seu programa sem dizer diretamente os números que representam as operações que deseja. Como exemplo, vamos usar a linguagem de montagem especificada na Tabela 4.4.1. Note que as operações agora têm um apelido.

*Tabela 4.4.1*

| Comando | Finalidade | Como utilizar? |
| --- | --- | --- |
| load | Transportar um dado da memória para o banco de registradores | lw |
| store | Transportar um dado do banco de registradores para a memória | sw |
| add | Somar dois valores | add |

Utilizando essa linguagem de montagem, nosso programa agora fica como mostra a Listagem 4.4.1.

**Listagem 4.4.1**

```text
lw 001 001
lw 011 010
add 001 010 100
sw 100 110
```

### Somando dois números com uma linguagem de alto nível

Embora a linguagem de montagem tenha simplificado a programação até certo ponto, quando a utiliza, o programador ainda tem de se preocupar com detalhes muito próximos do hardware. Por exemplo, ele tem de saber da existência do banco de registradores e fazer uso apropriado dele. Além disso, é muito inconveniente, difícil e propenso a erros ter de lembrar os endereços em que está armazenado cada um dos valores de interesse. Por essa razão, é comum o uso de **linguagens de programação de alto nível**. Elas têm como principal característica permitir ao programador desenvolver seus programas sem se preocupar com muitos detalhes de hardware. Dizemos que elas são mais próximas do ser humano e mais distantes dos detalhes de funcionamento do computador. Porém, é necessário que seja feita uma espécie de **tradução** do programa escrito em alto nível para uma linguagem que o computador entenda. Em geral, esse processo é feito por um componente de software chamado **compilador**.

Um dos recursos mais importantes existentes em uma linguagem de alto nível é a **declaração de variáveis**. Trata-se de um recurso que permite que sejam atribuídos nomes ou apelidos a posições de memória de modo que não seja necessário lembrar de seus endereços. Veja como ficaria nosso programa de soma de dois números usando uma possível linguagem de programação de alto nível na Listagem 4.5.1, de acordo com a organização da Figura 4.5.1. Ele usa uma operação de atribuição.

![RAM com os nomes primeiro_valor no endereço 001 com valor 2, segundo_valor no endereço 011 com valor 3 e resultado no endereço 110 com valor 5](img/fig-4-5-1.webp)

*Figura 4.5.1 – Variáveis dão nomes às posições de memória.*

**Listagem 4.5.1**

```text
resultado = primeiro_valor + segundo_valor
```

Assim, concluímos nosso estudo inicial sobre as características principais de funcionamento de um computador.

## Programação com Java
Duration: 8:00

A linguagem de programação que utilizaremos neste curso chama-se **Java**. Trata-se de uma linguagem de programação de alto nível com as características vistas na seção anterior. Há alguns conceitos fundamentais que todo desenvolvedor deve conhecer, os quais estudaremos nesta seção.

### O ambiente de desenvolvimento típico Java

O ambiente de desenvolvimento típico Java é ilustrado na Figura 5.1.1.

![Cinco fases: edita (editor grava o arquivo .java no disco), compila (o compilador gera bytecodes em arquivos .class), carrega (o carregador de classe coloca os bytecodes na memória), verifica (o verificador confirma que os bytecodes são válidos e seguros) e executa (a JVM traduz os bytecodes just-in-time e os executa)](img/fig-5-1-1.webp)

*Figura 5.1.1 – As cinco fases do ambiente de desenvolvimento Java: edita, compila, carrega, verifica e executa.*

Assim, concluímos que Java é uma linguagem **compilada** e **interpretada**.

### Siglas importantes

As principais siglas encontradas em um ambiente de desenvolvimento Java são as seguintes.

* **JDK** – *Java Development Kit* – Contém as ferramentas necessárias para o desenvolvimento e execução de programas em Java.
* **JVM** – *Java Virtual Machine* – Responsável por interpretar programas Java compilados.
* **JRE** – *Java Runtime Environment* – Inclui a JVM, bibliotecas (código escrito previamente e reutilizável) entre outras coisas que viabilizam a execução de aplicativos Java.

### Java é uma plataforma

Java não é somente uma linguagem de programação. Dizemos que Java é uma **Plataforma**, composta pela linguagem, a API e a máquina virtual. Java possui uma especificação e muitas possíveis implementações como a oficial mantida pela Oracle e o OpenJDK.

Java possui um lema conhecido como **"Write Once, Run Anywhere"**, o que a caracteriza como uma linguagem **portável**.

Hoje, Java é usado, por exemplo, nos seguintes cenários:

* Desenvolvimento de aplicações WEB
* Computação em Nuvem
* Computação para Dispositivos Móveis
* Java Embedded (Raspberry PI)
* Eletrônicos em Geral (TV, máquina de lavar etc.)
* Veículos

Veja no link a seguir um ranking de popularidade de linguagens de programação.

[https://www.tiobe.com/tiobe-index/](https://www.tiobe.com/tiobe-index/)

### Links fundamentais

Os links a seguir são fundamentais para todo desenvolvedor Java.

* Download do JDK (você precisa desse para programar em Java)
  * Implementação da Oracle: [https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/)
  * Implementação da Amazon: [https://aws.amazon.com/corretto/](https://aws.amazon.com/corretto/)
* Especificação da linguagem e plataforma: [https://docs.oracle.com/javase/specs/](https://docs.oracle.com/javase/specs/)
* The Java Tutorials: [https://docs.oracle.com/javase/tutorial/](https://docs.oracle.com/javase/tutorial/)
* Javadoc: [https://docs.oracle.com/en/java/javase/17/docs/api/index.html](https://docs.oracle.com/en/java/javase/17/docs/api/index.html)

## Hello, World
Duration: 10:00

Tradicionalmente, quando aprendemos uma nova tecnologia para o desenvolvimento de software, começamos o aprendizado por meio do desenvolvimento de uma aplicação "Hello, World". Trata-se de uma aplicação que entra em execução e exibe o texto "Hello, World".

Junto com o seu professor, abra o IDE escolhido e desenvolva um programa "Hello, World" em Java. Faça variações que exibem a mensagem tanto no terminal quanto em uma interface gráfica.

<details><summary>Ver uma possível solução</summary>

A apostila deixa este programa para ser feito em aula; o código a seguir é apenas uma sugestão, com uma versão para o terminal e outra com a classe `JOptionPane`, do pacote `javax.swing`.

**HelloWorld.java**

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World");
    }
}
```

**HelloWorldGUI.java**

```java
import javax.swing.JOptionPane;

public class HelloWorldGUI {
    public static void main(String[] args) {
        JOptionPane.showMessageDialog(null, "Hello, World");
    }
}
```

**Terminal**

```bash
javac HelloWorld.java
java HelloWorld
```

</details>

## Encerramento
Duration: 2:00

Você viu o que são lógica, algoritmos e linguagens de programação, escreveu algoritmos com decisões e repetições, entendeu como a CPU interage com a memória e por que usamos linguagens de alto nível, e conheceu o ambiente de desenvolvimento Java.

### Referências

* DEITEL, P. e DEITEL, H. *Java Como Programar*. 8ª Edição. São Paulo, SP: Pearson, 2010.
* LOPES, A. e GARCIA, G. *Introdução à Programação – 500 Algoritmos Resolvidos*. 1ª Edição. São Paulo, SP: Elsevier, 2002.
