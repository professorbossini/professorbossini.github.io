summary: Entenda classes, objetos, atributos e métodos, construa passo a passo um livro de notas em Java (parâmetros, variáveis de instância, getters/setters e construtores), veja como os objetos ficam na memória da JVM e represente as classes em UML.
id: java-poo-introducao
categories: Java
tags: java,poo,orientação a objetos,classes,objetos,construtor,encapsulamento,uml,stack,heap
status: Published
authors: Rodrigo Bossini
last updated: 2022-03-24
pdf: java/006_apostila_1parte_poo_introducao.pdf
exercicios: java/ContaBancaria_Enunciado.pdf,java/ContaBancaria_Gabarito.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Introdução à programação orientada a objetos em Java

## Visão geral
Duration: 3:00

Neste codelab você dá os primeiros passos em **programação orientada a objetos** (POO) com Java. Depois de entender o que são classes, objetos, atributos e métodos, você implementa, de maneira incremental, um livro de notas para um professor, acompanhando como os objetos ficam organizados na memória da JVM e como as classes são representadas em UML.

### O que você vai aprender

* O que é o minimundo e como ele dá origem a classes e objetos
* O que são atributos e métodos (comportamentos)
* Como criar uma classe, instanciá-la com `new` e chamar seus métodos
* O princípio da alta coesão e o baixo acoplamento
* As regiões stack e heap da memória da JVM
* Diagramas de classes em UML
* Parâmetros de método, variáveis de instância, encapsulamento com `private`, getters/setters e construtores

### O que você vai precisar

* JDK instalado e um IDE ou editor de código
* Conhecer variáveis, entrada e saída, estruturas de seleção e de repetição

## Conceitos de orientação a objetos
Duration: 8:00

### Entendendo conceitos de orientação a objetos

Desenvolver softwares utilizando o paradigma conhecido como orientação a objetos envolve:

1. **Observação de partes de interesse do mundo real**, o que dá origem a o que alguns autores chamam de **minimundo**. Aquilo que faz parte de seu minimundo depende do problema que está resolvendo. Por exemplo, um sistema acadêmico poderia envolver alunos, professores, disciplinas etc. Um sistema usado por um banco poderia envolver clientes, contas, produtos financeiros como empréstimos, investimentos etc.
2. **Representação das partes de interesse utilizando componentes de software.** Uma vez detectadas as partes de interesse do mundo real, cabe ao programador descrevê-las de modo que possam ser utilizadas posteriormente. Aqui, o programador obtém modelos ou descrições do que lhe é de interesse. Na orientação a objetos, esses modelos são conhecidos como **classes**.
3. Uma vez feita a modelagem, ou seja, obtenção das classes de interesse, cabe ao programador construir **objetos** a partir delas, os quais, por sua vez, interagem entre si a fim de fazer com que o sistema funcione.

### Examinando alguns exemplos de classes e objetos

* Suponha que você deseja dirigir um carro. Antes de mais nada, o carro precisa ser projetado, o que envolve desenhos de engenharia, detalhes sobre suas partes elétricas, mecânicas etc. Essa descrição ou modelo (são sinônimos) é uma classe a partir da qual carros podem ser construídos. Terminada a descrição do veículo, cada um deles construído a partir dela é um objeto do tipo carro.
* Suponha que uma construtora deseja construir uma nova casa. Antes de mais nada, é preciso elaborar um documento que descreva suas medidas, seus detalhes de implementação. Ou seja, a planta da casa. A planta da casa, ou seja, seu modelo ou descrição, é uma classe a partir da qual objetos do tipo casa podem ser construídos.
* O ser humano possui características próprias. Em um sistema de software, é perfeitamente possível descrever partes de interesse que digam o que é um ser humano. Ou seja, é possível escrever um modelo que descreva um ser humano: tem dois olhos, duas pernas, uma cabeça que pode ter cabelo etc. Essa descrição é uma classe a partir da qual objetos do tipo ser humano podem ser construídos.

Note que uma classe é uma mera descrição. Nesses exemplos, uma casa propriamente dita (concreta) ou um carro propriamente dito (concreto) são objetos construídos a partir de suas classes.

### Entendendo atributos e métodos: o que compõe uma classe?

Classes descrevem características (**atributos**) de seus objetos.

* Um carro possui cor, ano de fabricação, modelo, fabricante, número de portas, informações sobre seus acessórios etc. Esses são alguns possíveis atributos.
* Uma casa possui cor, número de cômodos, medida de cada cômodo, número de andares, valor venal, tipo de telhado etc. Esses são alguns possíveis atributos.
* Uma pessoa tem cor de olhos, cor de pele, altura, peso, número que calça, sexo, idade etc. Esses são alguns possíveis atributos.

Classes também descrevem os comportamentos (**métodos**) de seus objetos.

* Um carro é algo inanimado, porém, outros objetos podem interagir com ele, fazendo com que ele acelere, vire à esquerda, dê seta, estacione etc. Esses são alguns comportamentos possíveis de um carro.
* Uma casa também é inanimada. Porém, outros objetos podem interagir com ela fazendo com que seja fechada uma de suas portas, seja aberta uma janela etc. Também podemos fazer uma casa falar ou dormir, caso ela pertença a um jogo (um tanto criativo). Tudo depende do contexto (o minimundo) de interesse.
* Um ser humano é capaz de falar, dormir, estudar, namorar, piscar os olhos, escrever entre muitas outras coisas. Cada uma dessas atividades é um de seus possíveis comportamentos.

<aside class="positive">

**Nota 3.1.** Cada comportamento citado de cada classe é implementado por meio do uso de métodos.

**Nota 3.2.** Quando desejamos instruir um objeto a realizar determinada tarefa, **enviamos uma mensagem a ele** ou **chamamos um método sobre ele**. Essas duas expressões são sinônimas.

</aside>

## Implementando um livro de notas
Duration: 8:00

Um professor deseja fazer o controle de notas de seus alunos usando um software personalizado. Iremos escrever esse software para ele, de maneira incremental. A cada passo iremos adicionar novas funcionalidades.

1. Comece criando um novo projeto.
2. Crie uma nova classe cujo nome deverá ser `LivroDeNotas`. Essa classe descreve as características desejáveis em um livro de notas. Veja sua implementação inicial na Listagem 4.2.1.

**LivroDeNotas.java · Listagem 4.2.1**

```java
public class LivroDeNotas {

}
```

Um comportamento de nosso livro de notas será exibir uma mensagem de boas-vindas ao professor que o utilizar. Para implementar um comportamento, usamos um método, lembra? Dessa forma, escreva o método `exibirMensagem` como mostra a Listagem 4.3.1. Note que o nome do método deve ser escolhido de modo a promover a legibilidade do código e que ele deve respeitar o padrão camel case.

**LivroDeNotas.java · Listagem 4.3.1**

```java
public class LivroDeNotas {
    public void exibirMensagem() {
        System.out.println("Bem-vindo ao livro de notas");
    }
}
```

Agora iremos criar uma classe para testar a classe livro de notas. Ela terá o método `main` e nele iremos criar um objeto do tipo `LivroDeNotas` e, sobre ele, chamaremos o método `exibirMensagem`.

A razão pela qual optamos por criar uma nova classe para o teste (ao invés de criar o método `main` na classe `LivroDeNotas` mesmo) envolve um princípio conhecido como **alta coesão**. Quando escrevemos uma classe, desejamos que ela tenha um único propósito, uma única razão de ser, que resolva um único problema. A classe `LivroDeNotas` já possui um propósito: ela representa livros de notas. Adicionar o método `main` a ela implicaria em dar-lhe uma nova responsabilidade: servir para o teste. Violar esse princípio, em geral, implica em redução dos níveis de reusabilidade, flexibilidade, manutenibilidade entre outros de nossas classes. É comum que classes possuam relativamente um número pequeno de linhas de código.

Crie a classe da Listagem 4.4.1. Veja que ela possui um método `main`. Nele, criamos um objeto do tipo `LivroDeNotas` e enviamos a mensagem `exibirMensagem` para ele, usando uma **variável de referência** que o referencia após ter sido criado pelo operador `new`.

**TesteLivroDeNotas.java · Listagem 4.4.1**

```java
public class TesteLivroDeNotas {
    public static void main(String[] args) {
        LivroDeNotas livroDeNotas = new LivroDeNotas();
        livroDeNotas.exibirMensagem();
    }
}
```

<aside class="negative">

Na apostila, a última linha do `main` aparece como `livro.exibirMensagem();`. Como a variável declarada se chama `livroDeNotas`, o nome foi corrigido aqui para o programa compilar.

</aside>

## O modelo de memória da JVM
Duration: 5:00

Lembre-se de que um computador, de maneira simplificada, opera utilizando dois componentes: sua CPU e sua memória principal. A CPU executa instruções aritméticas e lógicas e utiliza a memória para armazenar valores necessários para essas operações, seus resultados etc. Veja a Figura 5.1.

![Memória dividida em blocos trocando dados com a CPU, que contém a ULA, por meio de operações de leitura e escrita](img/fig-5-1.webp)

*Figura 5.1 – CPU (com a ULA) e memória principal.*

Quando a máquina virtual Java (JVM) entra em cena, o sistema operacional reserva um espaço de memória para que ela possa funcionar. A JVM, por sua vez, organiza a memória da forma exibida pela Figura 5.2, que mostra duas regiões importantes da memória: a região **stack** e a região **heap**. Note que na região stack ficam as variáveis de referência e que, na região heap, ficam os objetos. Uma variável de referência referencia um objeto na memória heap para que ele possa ser manipulado. Objetos para os quais não exista uma variável de referência não podem ser utilizados. A figura geométrica escolhida para cada região não tem importância. O que é importante é entender que cada uma delas representa um "pedaço" de memória reservado para a JVM e que, em geral, a memória heap fica com mais espaço do que a memória stack.

![Memória da JVM com duas regiões vazias: a stack, desenhada como um retângulo estreito, e a heap, desenhada como um círculo maior](img/fig-5-2.webp)

*Figura 5.2 – As regiões stack e heap da memória da JVM.*

No programa que escrevemos até então, temos uma variável de referência e um objeto, ambos do mesmo tipo (`LivroDeNotas`). Desta forma, quando a JVM está em execução e o interpreta, a memória fica como exibe a Figura 5.3.

![A variável livroDeNotas na stack com uma seta apontando para um objeto na heap](img/fig-5-3.webp)

*Figura 5.3 – A variável de referência livroDeNotas, na stack, referencia um objeto na heap.*

## Diagrama de classes e parâmetros de método
Duration: 7:00

### Descrevendo a classe LivroDeNotas graficamente

É muito comum descrever os mais diferentes componentes de um sistema orientado a objetos utilizando uma linguagem gráfica denominada **UML** (*Unified Modelling Language*). É um meio de expressar partes importantes de um sistema, de maneira independente de sua implementação. Assim, mesmo não programadores podem avaliar e entender os componentes do sistema. A Figura 6.1 mostra um diagrama de classes que mostra, graficamente, a classe `LivroDeNotas`. Note que há 3 compartimentos na classe. O superior mostra o nome da classe. O intermediário contém os atributos (nossa classe não tem atributos ainda, portanto, esse compartimento está vazio) e o último compartimento mostra os métodos da classe.

![Diagrama UML da classe LivroDeNotas com o compartimento de atributos vazio e o método + exibirMensagem()](img/fig-6-1.webp)

*Figura 6.1 – Diagrama de classes de LivroDeNotas.*

### Mostrando o nome do curso por meio de um parâmetro de método

Iremos agora alterar a classe `LivroDeNotas` de modo que, ao exibir as boas-vindas, ela mostre também o nome do curso que o professor estiver ministrando. Professores de cursos diferentes poderão fazer uso do livro, então o nome do curso não poderá ficar fixo na classe. Utilizaremos o recurso chamado **parâmetro de método** para deixar aberto esse valor e permitir que a classe cliente (neste caso, a classe `TesteLivroDeNotas`) especifique o valor a ser exibido. Adapte a classe `LivroDeNotas` como mostra a Listagem 7.1.

**LivroDeNotas.java · Listagem 7.1**

```java
public class LivroDeNotas {
    public void exibirMensagem(String nomeDoCurso) {
        System.out.printf("Bem-vindo ao livro de notas do curso %s", nomeDoCurso);
    }
}
```

Para testar, será necessário enviar o nome do curso como um **argumento** para o método. Veja a Listagem 7.2.

**TesteLivroDeNotas.java · Listagem 7.2**

```java
import javax.swing.JOptionPane;

public class TesteLivroDeNotas {
    public static void main(String[] args) {
        LivroDeNotas livroDeNotas = new LivroDeNotas();
        String nomeDoCurso = JOptionPane.showInputDialog("Prof, qual o nome do curso?");
        livroDeNotas.exibirMensagem(nomeDoCurso);
    }
}
```

<aside class="positive">

As listagens de teste da apostila usam `JOptionPane` sem mostrar a linha de importação. Ela foi incluída aqui, no início do arquivo, para que o código compile.

</aside>

### Diagrama de classes com método com parâmetro

A classe `LivroDeNotas` agora pode ser representada graficamente (usando a linguagem UML) como mostra a Figura 8.1.

![Diagrama UML da classe LivroDeNotas com o método + exibirMensagem(nomeDoCurso : String)](img/fig-8-1.webp)

*Figura 8.1 – O método exibirMensagem agora recebe um parâmetro.*

## Variável de instância, getters e setters
Duration: 8:00

Ao longo da execução do programa, talvez seja de interesse permitir que o nome de curso associado a um livro de notas seja utilizado mais de uma vez ou mesmo alterado. Por essa razão, iremos utilizar um recurso chamado de **variável de instância** (instância é sinônimo de objeto) para especificar que cada objeto do tipo `LivroDeNotas` possui um atributo que representa o nome do curso.

É muito comum (mas não uma regra absoluta) que variáveis de instância sejam marcadas com o modificador de acesso `private`. Ele indica que aquela variável somente pode ser acessada pelos métodos da classe em que foi declarada e serve para a implementação de um recurso chave da orientação a objetos conhecido como **encapsulamento**. Aprenderemos que esse recurso está intimamente relacionado com o princípio conhecido como **baixo acoplamento**, que indica que duas classes que interagem entre si sabem poucos detalhes de implementação uma da outra, o que quer dizer que, se uma tiver sua implementação alterada, a outra pode continuar funcionando sem precisar ser alterada também. Para permitir que as classes clientes manipulem indiretamente suas variáveis de instância, uma classe pode oferecer os conhecidos métodos **getters/setters**. A alteração aparece na Listagem 9.1.

**LivroDeNotas.java · Listagem 9.1**

```java
public class LivroDeNotas {
    private String nomeDoCurso;

    public void exibirMensagem() {
        System.out.printf("Bem-vindo ao livro de notas do curso %s", getNomeDoCurso());
    }
    public String getNomeDoCurso() {
        return nomeDoCurso;
    }
    public void setNomeDoCurso(String nomeDoCurso) {
        this.nomeDoCurso = nomeDoCurso;
    }
}
```

A classe da Listagem 9.2 testa a nova versão do livro de notas.

**TesteLivroDeNotas.java · Listagem 9.2**

```java
import javax.swing.JOptionPane;

public class TesteLivroDeNotas {
    public static void main(String[] args) {
        LivroDeNotas livroDeNotas = new LivroDeNotas();
        String nomeDoCurso = JOptionPane.showInputDialog("Prof, qual o nome do curso?");
        livroDeNotas.setNomeDoCurso(nomeDoCurso);
        livroDeNotas.exibirMensagem();
    }
}
```

### Diagrama de classes com variável de instância e métodos getters/setters

O diagrama da Figura 10.1 mostra, graficamente, a nova versão da classe `LivroDeNotas`.

![Diagrama UML da classe LivroDeNotas com o atributo - nomeDoCurso: String e os métodos + setNomeDoCurso(nomeDoCurso: String), + getNomeDoCurso() : String e + exibirMensagem()](img/fig-10-1.webp)

*Figura 10.1 – O sinal "-" indica atributo privado; o sinal "+", método público.*

### Variável de instância na memória da JVM

Quando tivermos um objeto `LivroDeNotas` construído e com nome atribuído, o que teremos na memória é aquilo que exibe a Figura 11.1.

![A variável livroDeNotas na stack referencia um objeto na heap cujo nome do curso é POO](img/fig-11-1.webp)

*Figura 11.1 – O objeto na heap guarda o valor da sua variável de instância (POO).*

## Inicializando com o construtor
Duration: 8:00

Quando utilizamos o operador `new`, como vimos, estamos construindo um objeto da classe envolvida na instrução. Isso é feito por um bloco denominado **construtor**. O que temos feito é utilizar o **construtor padrão** da classe, que o compilador nos entrega gratuitamente. Porém, quando um livro de notas é construído, a princípio ele não tem valor nenhum no campo `nomeDoCurso` e, posteriormente, temos de fazer a atribuição. Por meio da escrita de um construtor personalizado podemos construir o objeto e fazer a atribuição de valores de variáveis de instância simultaneamente. A classe exibida na Listagem 12.1 faz uso de um construtor assim. O operador `this` permite diferenciar a variável de instância da variável do parâmetro, chamada de **variável local**.

**LivroDeNotas.java · Listagem 12.1**

```java
public class LivroDeNotas {
    private String nomeDoCurso;

    public LivroDeNotas(String nomeDoCurso) {
        this.nomeDoCurso = nomeDoCurso;
    }

    public void exibirMensagem() {
        System.out.printf("Bem vindo ao livro de notas do curso %s", getNomeDoCurso());
    }
    public String getNomeDoCurso() {
        return nomeDoCurso;
    }
    public void setNomeDoCurso(String nomeDoCurso) {
        this.nomeDoCurso = nomeDoCurso;
    }
}
```

A classe da Listagem 12.2 testa a nova versão da classe `LivroDeNotas`. Note que estamos construindo dois objetos do tipo `LivroDeNotas` e que cada um possui seu próprio `nomeDoCurso`. É por isso que `nomeDoCurso` é uma variável de instância; cada instância (ou objeto) tem sua própria cópia, independente de qualquer outra instância.

**TesteLivroDeNotas.java · Listagem 12.2**

```java
import javax.swing.JOptionPane;

public class TesteLivroDeNotas {
    public static void main(String[] args) {

        String primeiroCurso = JOptionPane.showInputDialog("Prof, qual o nome do primeiro curso?");
        String segundoCurso = JOptionPane.showInputDialog("Prof. qual o nome do segundo curso?");

        LivroDeNotas livroDeNotas1 = new LivroDeNotas(primeiroCurso);
        LivroDeNotas livroDeNotas2 = new LivroDeNotas(segundoCurso);

        livroDeNotas1.exibirMensagem();
        livroDeNotas2.exibirMensagem();
    }
}
```

### Diagrama de classes com construtor

A Figura 13.1 mostra, graficamente, a nova classe `LivroDeNotas`.

![Diagrama UML da classe LivroDeNotas com o construtor << constructor >> LivroDeNotas (nomeDoCurso: String) além do atributo e dos métodos anteriores](img/fig-13-1.webp)

*Figura 13.1 – Diagrama de classes com o construtor.*

### Dois objetos na memória

A Figura 14.1 mostra o estado da memória da JVM após dois objetos terem sido construídos.

![Na stack, livroDeNotas1 referencia o objeto POO e livroDeNotas2 referencia o objeto Big Data, ambos na heap](img/fig-14-1.webp)

*Figura 14.1 – Cada objeto tem sua própria cópia da variável de instância.*

## Exercícios da apostila
Duration: 20:00

1. Escreva uma classe para representar carros. Adicione a ela dois atributos e dois métodos que lhe pareçam razoáveis. Os dois atributos devem ser encapsulados. Escreva métodos getters/setters para cada um deles.
2. Escreva uma classe de teste que:
    1. Instancia dois veículos.
    2. Obtém valores para seus atributos e os atribui adequadamente.
    3. Chama cada um dos métodos que você criou.
    4. Exibe os valores das variáveis, usando os métodos getters.
3. Reescreva a classe do exercício 1 adicionando a ela um construtor que recebe valores a serem atribuídos às duas variáveis de instância da classe carro.
4. Note que a classe de teste deixou de funcionar após a adição do construtor. Faça os ajustes necessários para que ela volte a funcionar.

## Exercício: conta bancária
Duration: 25:00

**Objetivo:** praticar os conceitos fundamentais de orientação a objetos em Java: criação de classes, atributos, métodos, instanciação de objetos e interação entre objetos.

Crie um projeto Java com duas classes, conforme descrito a seguir.

### Classe ContaBancaria

Crie uma classe chamada `ContaBancaria` que represente uma conta bancária. Ela deve possuir os seguintes **atributos**:

* `titular` – nome do titular da conta (`String`)
* `numero` – número da conta (`String`)
* `saldo` – saldo atual da conta (`double`)

A classe deve possuir os seguintes comportamentos (**métodos**):

* `depositar(double valor)` – adiciona o valor informado ao saldo. O valor deve ser positivo; caso contrário, exiba uma mensagem de erro.
* `sacar(double valor)` – subtrai o valor informado do saldo. O valor deve ser positivo e não pode ser maior que o saldo atual. Em caso de violação dessas condições, exiba uma mensagem de erro.
* `transferir(ContaBancaria destino, double valor)` – realiza uma transferência da conta atual para a conta de destino. Internamente, deve sacar da conta atual e depositar na conta de destino. As mesmas validações de saque se aplicam.
* `consultarSaldo()` – exibe no console o número da conta, o nome do titular e o saldo atual formatado com duas casas decimais.
* `exibirExtrato()` – exibe no console uma linha separadora, o nome do titular, o número da conta, o saldo atual e outra linha separadora, simulando um extrato resumido.

Além dos métodos acima, crie um **construtor** que receba o titular, o número da conta e o saldo inicial.

### Classe TesteConta

Crie uma classe chamada `TesteConta` com o método `main`. Nela:

1. Instancie duas contas bancárias com dados fictícios e saldo inicial de `1000.00` cada.
2. Implemente um **loop infinito** (`while (true)`). A cada iteração:
    1. Sorteie aleatoriamente qual das duas contas será a **conta ativa** naquela iteração (use `Random`).
    2. Sorteie aleatoriamente uma **operação** entre as seguintes: depósito, saque e transferência.
    3. Sorteie um **valor** aleatório entre `1.00` e `500.00`.
    4. Execute a operação sorteada sobre a conta ativa:
        * Se for **depósito**, deposite o valor na conta ativa.
        * Se for **saque**, tente sacar o valor da conta ativa.
        * Se for **transferência**, transfira o valor da conta ativa para a outra conta.
    5. Após a operação, exiba o extrato das duas contas.
    6. Faça o programa pausar por `1 segundo` entre cada iteração (use `Thread.sleep(1000)`).

### Dicas

* Para gerar números aleatórios, utilize a classe `java.util.Random`.
* Para gerar valores `double` em um intervalo, use `random.nextDouble() * (max - min) + min`.
* Para formatar valores monetários, use `String.format("%.2f", valor)`.
* Declare `throws InterruptedException` na assinatura do método `main` para tratar a exceção lançada por `Thread.sleep`.

### Exemplo de saída esperada

A cada iteração, o programa deve exibir algo semelhante a:

**Terminal**

```text
=== Operacao: DEPOSITO na conta de Ana ===
Deposito de R$ 237.45 realizado com sucesso.

--- Extrato ---
Titular: Ana
Conta: 1001
Saldo: R$ 1237.45
---------------

--- Extrato ---
Titular: Bruno
Conta: 1002
Saldo: R$ 1000.00
---------------
```

<details><summary>Ver resposta</summary>

**ContaBancaria.java**

```java
public class ContaBancaria {

    private String titular;
    private String numero;
    private double saldo;

    public ContaBancaria(String titular, String numero, double saldoInicial) {
        this.titular = titular;
        this.numero = numero;
        this.saldo = saldoInicial;
    }

    public void depositar(double valor) {
        if (valor <= 0) {
            System.out.println("Erro: o valor do deposito deve ser positivo.");
            return;
        }
        saldo += valor;
        System.out.println("Deposito de R$ " + String.format("%.2f", valor)
            + " realizado com sucesso.");
    }

    public void sacar(double valor) {
        if (valor <= 0) {
            System.out.println("Erro: o valor do saque deve ser positivo.");
            return;
        }
        if (valor > saldo) {
            System.out.println("Erro: saldo insuficiente para saque de R$ "
                + String.format("%.2f", valor) + ".");
            return;
        }
        saldo -= valor;
        System.out.println("Saque de R$ " + String.format("%.2f", valor)
            + " realizado com sucesso.");
    }

    public void transferir(ContaBancaria destino, double valor) {
        if (valor <= 0) {
            System.out.println("Erro: o valor da transferencia deve ser positivo.");
            return;
        }
        if (valor > saldo) {
            System.out.println("Erro: saldo insuficiente para transferencia de R$ "
                + String.format("%.2f", valor) + ".");
            return;
        }
        saldo -= valor;
        destino.saldo += valor;
        System.out.println("Transferencia de R$ " + String.format("%.2f", valor)
            + " de " + titular + " para " + destino.titular
            + " realizada com sucesso.");
    }

    public void consultarSaldo() {
        System.out.println("Conta: " + numero + " | Titular: " + titular
            + " | Saldo: R$ " + String.format("%.2f", saldo));
    }

    public void exibirExtrato() {
        System.out.println("--- Extrato ---");
        System.out.println("Titular: " + titular);
        System.out.println("Conta: " + numero);
        System.out.println("Saldo: R$ " + String.format("%.2f", saldo));
        System.out.println("---------------");
    }

    public String getTitular() {
        return titular;
    }

    public double getSaldo() {
        return saldo;
    }
}
```

**TesteConta.java**

```java
import java.util.Random;

public class TesteConta {

    public static void main(String[] args) throws InterruptedException {
        ContaBancaria conta1 = new ContaBancaria("Ana", "1001", 1000.00);
        ContaBancaria conta2 = new ContaBancaria("Bruno", "1002", 1000.00);

        Random random = new Random();
        String[] operacoes = {"DEPOSITO", "SAQUE", "TRANSFERENCIA"};

        while (true) {
            // Sorteia qual conta sera a conta ativa
            ContaBancaria contaAtiva;
            ContaBancaria outraConta;

            if (random.nextInt(2) == 0) {
                contaAtiva = conta1;
                outraConta = conta2;
            } else {
                contaAtiva = conta2;
                outraConta = conta1;
            }

            // Sorteia a operacao
            String operacao = operacoes[random.nextInt(operacoes.length)];

            // Sorteia um valor entre 1.00 e 500.00
            double valor = random.nextDouble() * 499.00 + 1.00;
            valor = Math.round(valor * 100.0) / 100.0;

            System.out.println("\n=== Operacao: " + operacao
                + " na conta de " + contaAtiva.getTitular() + " ===");

            // Executa a operacao sorteada
            switch (operacao) {
                case "DEPOSITO":
                    contaAtiva.depositar(valor);
                    break;
                case "SAQUE":
                    contaAtiva.sacar(valor);
                    break;
                case "TRANSFERENCIA":
                    contaAtiva.transferir(outraConta, valor);
                    break;
            }

            // Exibe o extrato de ambas as contas
            System.out.println();
            conta1.exibirExtrato();
            System.out.println();
            conta2.exibirExtrato();

            // Pausa de 1 segundo
            Thread.sleep(1000);
        }
    }
}
```

</details>

## Encerramento
Duration: 2:00

Você modelou partes do mundo real como classes, criou objetos com `new`, enviou mensagens a eles, usou parâmetros, variáveis de instância encapsuladas, getters/setters e construtores, e acompanhou como tudo isso fica na memória da JVM e nos diagramas UML.

### Próximos passos

* Siga para a segunda parte da introdução à POO, em que você desenvolve um jogo com um personagem isolado em uma ilha

### Referências

* DEITEL, P. e DEITEL, H. *Java Como Programar*. 8ª Edição. São Paulo, SP: Pearson, 2010.
* LOPES, A. e GARCIA, G. *Introdução à Programação – 500 Algoritmos Resolvidos*. 1ª Edição. São Paulo, SP: Elsevier, 2002.
* ORACLE. *Java SE Documentation*. Disponível em: [https://docs.oracle.com/en/java/](https://docs.oracle.com/en/java/). Acesso em: mar. 2026.
