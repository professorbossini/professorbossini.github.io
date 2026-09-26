summary: Desenvolva um pequeno jogo em Java com um personagem isolado em uma ilha, evoluindo de uma classe simples para regras de negócio, encapsulamento e construtores, e reescreva o código com Lombok (Builder) e com Records do Java 16.
id: java-poo-jogo-personagem
categories: Java
tags: java,poo,classes,objetos,encapsulamento,construtores,lombok,builder,record,maven
status: Published
authors: Rodrigo Bossini
last updated: 2026-02-25
pdf: java/novo/006_apostila_2parte_poo_introducao_jogo_personagem.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# POO em Java: jogo do personagem na ilha

## Visão geral
Duration: 3:00

Neste material, utilizamos recursos de Programação Orientada a Objetos (POO) para desenvolver um pequeno jogo. O protagonista é um personagem isolado em uma ilha que precisa gerenciar suas necessidades básicas — fome, sono e energia — para se manter vivo.

Ao longo do material, evoluímos a implementação de forma progressiva: partimos de uma classe simples, introduzimos regras de negócio, aplicamos encapsulamento e construtores e, ao final, reescrevemos o mesmo código utilizando dois recursos modernos do ecossistema Java: a biblioteca **Lombok** e os **Records**, disponíveis a partir do Java 16.

### O que você vai aprender

* A diferença entre classe e objeto, na prática
* Coesão: separar a classe do personagem da classe que executa o jogo
* Implementar regras de negócio em métodos
* Encapsulamento com `private`
* Construtores com validação e delegação com `this(...)`
* Refatoração com Lombok (`@Getter`, `@Setter`, `@Builder`) em um projeto Maven
* Records imutáveis do Java 16+

### O que você vai precisar

* JDK 16 ou superior e o VS Code (com suporte a Java e Maven)
* Ter feito a primeira parte da introdução à POO

## Descrição do personagem
Duration: 6:00

O ponto de partida é a criação de uma classe. Uma classe é um modelo que descreve as características (**atributos**) e os comportamentos (**métodos**) de algo relevante para o sistema. Ao definir uma classe, estamos criando um novo tipo de dado — a partir do qual podemos construir objetos.

A primeira versão da classe `Personagem` define os atributos de estado (além do nome) e três métodos de comportamento:

**Personagem.java**

```java
public class Personagem {
    String nome;
    int energia;
    int fome;
    int sono;

    void cacar() {
        System.out.println(nome + " cacando");
    }

    void comer() {
        System.out.println(nome + " comendo");
    }

    void dormir() {
        System.out.println(nome + " dormindo");
    }
}
```

> **Classe vs. Objeto**
>
> A classe `Personagem` é o molde. Cada objeto criado a partir dela é uma instância independente, com seus próprios valores para `nome`, `energia`, `fome` e `sono`. Dois personagens podem coexistir sem que as ações de um interfiram no outro.

### Construindo um personagem

Para utilizar a classe `Personagem`, criamos uma segunda classe — chamada `Jogo` — que contém o método `main`. Essa separação mantém a classe `Personagem` coesa: ela tem uma única responsabilidade, que é descrever o que é um personagem.

**Jogo.java**

```java
public class Jogo {
    public static void main(String[] args) {
        Personagem cacador = new Personagem();
        cacador.nome = "John";
        cacador.cacar();
        cacador.comer();
        cacador.dormir();
    }
}
```

<aside class="positive">

**Boas práticas: coesão.** Uma classe coesa resolve apenas um problema. Misturar a lógica de inicialização do jogo dentro da classe `Personagem` quebraria esse princípio e tornaria o código mais difícil de manter e reutilizar.

</aside>

## Regras do jogo
Duration: 10:00

Com os atributos `energia`, `fome` e `sono` definidos, podemos implementar regras que tornam o jogo funcional. As restrições adotadas são:

* Os atributos `energia`, `fome` e `sono` aceitam apenas valores no intervalo [0, 10].
* O personagem inicia com `energia = 10`, `fome = 0` e `sono = 0`.
* **Ao caçar:** gasta 2 de energia (mínimo necessário: 2). Fome e sono sobem 1 ponto cada.
* **Ao comer:** requer fome ≥ 1. Fome cai 1 ponto e energia sobe 1.
* **Ao dormir:** requer sono ≥ 1. Sono cai 1 ponto e energia sobe 1.

A seguir, a implementação completa das regras na classe `Personagem`:

**Personagem.java**

```java
public class Personagem {
    String nome;
    int energia = 10;
    int fome    = 0;
    int sono    = 0;

    void cacar() {
        if (energia >= 2) {
            System.out.println(nome + " cacando");
            energia -= 2;
        } else {
            System.out.println(nome + " sem energia para cacar");
        }
        fome = Math.min(fome + 1, 10);
        sono = Math.min(sono + 1, 10);
    }

    void comer() {
        if (fome >= 1) {
            System.out.println(nome + " comendo.");
            energia = Math.min(energia + 1, 10);
            fome--;
        } else {
            System.out.println(nome + " sem fome.");
        }
    }

    void dormir() {
        if (sono >= 1) {
            System.out.println(nome + " dormindo.");
            sono--;
            energia = energia + 1 <= 10 ? energia + 1 : 10;
        } else {
            System.out.println(nome + " sem sono.");
        }
    }
}
```

Para observar o comportamento ao longo do tempo, colocamos as chamadas de método dentro de um loop e utilizamos `Thread.sleep()` para desacelerar a execução na tela:

**Jogo.java**

```java
public class Jogo {
    public static void main(String[] args) throws InterruptedException {
        Personagem cacador = new Personagem();
        cacador.nome = "John";
        while (true) {
            cacador.cacar();
            cacador.comer();
            cacador.dormir();
            cacador.cacar();
            cacador.cacar();
            cacador.cacar();
            System.out.println("====================");
            Thread.sleep(2000);
        }
    }
}
```

Também é possível adicionar um segundo personagem ao jogo. Cada instância mantém seu próprio estado, completamente independente das demais:

**Jogo.java**

```java
public class Jogo {
    public static void main(String[] args) throws InterruptedException {
        Personagem cacador = new Personagem();
        Personagem soneca  = new Personagem();
        cacador.nome = "John";
        soneca.nome  = "Soneca";
        while (true) {
            cacador.cacar();   soneca.dormir();
            cacador.comer();   soneca.dormir();
            cacador.dormir();  soneca.dormir();
            cacador.cacar();   soneca.comer();
            cacador.cacar();   soneca.cacar();
            System.out.println("====================");
            Thread.sleep(3000);
        }
    }
}
```

<aside class="positive">

**Observação: `Thread.sleep()`.** O método `Thread.sleep(ms)` pausa a execução pelo número de milissegundos informado. Exceções serão abordadas em um material futuro; por ora, basta saber que o método `main` precisa declarar `throws InterruptedException` para que o código compile. (Nas duas listagens acima a declaração já foi incluída; na apostila ela aparece apenas nesta observação.)

</aside>

## Encapsulamento
Duration: 5:00

O funcionamento correto do jogo depende de que os atributos do personagem sejam sempre válidos. No entanto, enquanto esses atributos forem públicos, qualquer classe externa poderá alterá-los diretamente — inclusive com valores inválidos — comprometendo o estado do jogo.

O **encapsulamento** é o mecanismo pelo qual uma classe esconde seus detalhes internos e assume a responsabilidade de manter o estado de seus objetos consistente. Em Java, utilizamos o modificador `private` para isso:

**Personagem.java · atributos**

```java
private int energia = 10;
private int fome    = 0;
private int sono    = 0;
```

Com essa alteração, qualquer tentativa de acessar `energia`, `fome` ou `sono` diretamente a partir da classe `Jogo` causará um erro de compilação. A classe `Personagem` passa a ser a única responsável por modificar esses valores.

<aside class="negative">

**Por que encapsular?** Sem encapsulamento, qualquer trecho de código poderia escrever, por exemplo:

```java
cacador.energia = 999;
```

Isso quebraria as regras do jogo. Com `private`, isso se torna impossível — o compilador rejeita o acesso e garante que os valores só mudem pelos métodos autorizados.

</aside>

## Construtores
Duration: 8:00

Com os atributos encapsulados, precisamos de uma forma segura de inicializar os objetos. Para isso, definimos **construtores** — métodos especiais chamados no momento em que o objeto é criado com `new`.

### Construtor básico com validação

**Personagem.java · construtor**

```java
public Personagem(int energia, int fome, int sono) {
    if (energia >= 0 && energia <= 10) this.energia = energia;
    if (fome    >= 0 && fome    <= 10) this.fome    = fome;
    if (sono    >= 0 && sono    <= 10) this.sono    = sono;
}
```

### Incluindo o nome no construtor

Podemos também encapsular o atributo `nome` e exigi-lo no construtor:

**Personagem.java · construtor com nome**

```java
private String nome;

public Personagem(String nome, int energia, int fome, int sono) {
    this.nome = nome;
    if (energia >= 0 && energia <= 10) this.energia = energia;
    if (fome    >= 0 && fome    <= 10) this.fome    = fome;
    if (sono    >= 0 && sono    <= 10) this.sono    = sono;
}
```

### Delegação entre construtores com this(...)

Quando há código repetido entre construtores, podemos usar `this(...)` para que um construtor chame outro, centralizando a lógica de validação em um único lugar e eliminando duplicação:

**Personagem.java e Jogo.java**

```java
// Construtor que delega para o outro usando this(...)
public Personagem(String nome, int energia, int fome, int sono) {
    this(energia, fome, sono);
    this.nome = nome;
}

// Uso na classe Jogo:
Personagem cacador = new Personagem("John",   10, 0, 0);
Personagem soneca  = new Personagem("Soneca",  2, 6, 4);
```

<aside class="positive">

**Dica: `this(...)`.** A chamada `this(...)` dentro de um construtor deve ser sempre a primeira instrução. Ela permite que construtores mais simples deleguem para construtores mais completos, evitando duplicação de código e facilitando futuras manutenções.

</aside>

### Exercícios

* Adicione um método `exibirEstado()` à classe `Personagem` que imprime o nome seguido dos valores de energia, fome e sono. Chame-o ao final de cada método de ação.
* Adicione um terceiro personagem ao loop do jogo com uma rotina de ações diferente dos demais.
* Implemente uma condição de derrota: se a energia do personagem chegar a zero, exiba 'Game Over' e encerre o loop.

## Configurando o projeto Maven com Lombok
Duration: 8:00

O **Lombok** é uma biblioteca que elimina código repetitivo em Java. Por meio de anotações, ele gera automaticamente — em tempo de compilação — getters, setters, construtores, builders e outros métodos padrão, mantendo o código-fonte limpo e legível sem sacrificar funcionalidade.

### Configurando o projeto no VS Code com Maven

Antes de usar o Lombok, é necessário ter um projeto Maven configurado. Siga os passos abaixo:

1. Abra o VS Code e pressione **Ctrl+Shift+P** para abrir a paleta de comandos.
2. Digite **Maven: Create Maven Project** e selecione a opção correspondente.
3. Escolha o archetype **maven-archetype-quickstart** — é o mais simples disponível.
4. Selecione a versão mais recente disponível (geralmente 1.4 ou superior).
5. Informe o **groupId** (ex.: `br.edu.faculdade`), o **artifactId** (ex.: `jogo-personagem`) e confirme as demais opções com Enter.
6. O VS Code criará automaticamente a estrutura de pastas do projeto e abrirá o arquivo `pom.xml`.

Com o projeto criado, localize o arquivo `pom.xml` e adicione a dependência do Lombok dentro da seção `<dependencies>`:

**pom.xml**

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.32</version>
    <scope>provided</scope>
</dependency>
```

Após salvar o `pom.xml`, clique em **Update** no aviso que o VS Code exibe — ou execute **Maven: Update Project** pela paleta de comandos. O Lombok será baixado automaticamente. Instale também a extensão **Lombok Annotations Support for VS Code** na aba de extensões para que o editor reconheça as anotações corretamente.

### Como o Lombok funciona?

| Anotação | O que gera |
| --- | --- |
| `@Getter` | getters para todos os atributos (`getNome()`, `getEnergia()`...) |
| `@Setter` | setters para todos os atributos (`setNome()`, `setEnergia()`...) |
| `@Builder` | uma API fluente de construção: `Personagem.builder()...` |
| `@Builder.Default` | define o valor padrão de um campo ao usar o builder |

## Refatoração com Lombok
Duration: 8:00

### Classe Personagem com Lombok

**Personagem.java**

```java
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;

@Getter
@Setter
@Builder
public class Personagem {
    private String nome;
    @Builder.Default private int energia = 10;
    @Builder.Default private int fome    = 0;
    @Builder.Default private int sono    = 0;

    public void cacar() {
        if (energia >= 2) {
            System.out.println(nome + " cacando");
            energia -= 2;
        } else {
            System.out.println(nome + " sem energia para cacar");
        }
        fome = Math.min(fome + 1, 10);
        sono = Math.min(sono + 1, 10);
    }

    public void comer() {
        if (fome >= 1) {
            System.out.println(nome + " comendo.");
            energia = Math.min(energia + 1, 10);
            fome--;
        } else {
            System.out.println(nome + " sem fome.");
        }
    }

    public void dormir() {
        if (sono >= 1) {
            System.out.println(nome + " dormindo.");
            sono--;
            energia = Math.min(energia + 1, 10);
        } else {
            System.out.println(nome + " sem sono.");
        }
    }

    public void exibirEstado() {
        System.out.printf("%s -> Energia: %d | Fome: %d | Sono: %d%n",
            nome, energia, fome, sono);
    }
}
```

### Classe Jogo utilizando o Builder

Com o Builder gerado pelo Lombok, a criação de objetos fica mais expressiva e legível — cada parâmetro é nomeado explicitamente, eliminando a dúvida sobre a ordem dos argumentos:

**Jogo.java**

```java
public class Jogo {
    public static void main(String[] args) throws InterruptedException {
        Personagem cacador = Personagem.builder()
            .nome("John").energia(10).fome(0).sono(0)
            .build();
        Personagem soneca = Personagem.builder()
            .nome("Soneca").energia(2).fome(6).sono(4)
            .build();
        while (true) {
            cacador.cacar();    soneca.dormir();
            cacador.comer();    soneca.dormir();
            System.out.println("== Estado ==");
            cacador.exibirEstado();
            soneca.exibirEstado();
            System.out.println("====================");
            Thread.sleep(2000);
        }
    }
}
```

<aside class="positive">

**Vantagens do Builder Pattern**

* **Parâmetros nomeados:** fica claro o que cada valor representa (`.nome()`, `.energia()`...).
* **Ordem flexível:** os parâmetros podem ser fornecidos em qualquer sequência.
* **Valores opcionais:** campos com `@Builder.Default` são omitidos se não forem informados.
* **Legibilidade:** código mais fácil de ler e manter, especialmente com muitos parâmetros.

</aside>

## Refatoração com Record (Java 16+)
Duration: 10:00

Introduzidos no Java 16, os **Records** são uma forma concisa de declarar classes cujo propósito principal é armazenar dados. A partir de uma única linha de declaração, o compilador gera automaticamente:

* Construtor canônico com todos os campos.
* Getters no estilo `nome()`, `energia()` — sem o prefixo 'get'.
* Implementações de `equals()`, `hashCode()` e `toString()`.

<aside class="negative">

**Importante: Records são imutáveis.** Os campos de um Record são implicitamente `final` — não é possível alterar seus valores após a construção do objeto. Isso muda a abordagem: em vez de modificar o personagem, cada ação retorna um **novo** `Personagem` com o estado atualizado. Esse estilo é chamado de programação funcional com imutabilidade.

</aside>

### Classe Personagem como Record

**Personagem.java**

```java
public record Personagem(String nome, int energia, int fome, int sono) {

    // Construtor compacto com validação dos parâmetros
    public Personagem {
        if (energia < 0 || energia > 10)
            throw new IllegalArgumentException("Energia inválida: " + energia);
        if (fome < 0 || fome > 10)
            throw new IllegalArgumentException("Fome inválida: " + fome);
        if (sono < 0 || sono > 10)
            throw new IllegalArgumentException("Sono inválido: " + sono);
    }

    // Método de fábrica — cria personagem com estado inicial padrão
    public static Personagem criar(String nome) {
        return new Personagem(nome, 10, 0, 0);
    }

    // Cada ação retorna um NOVO Personagem com o estado atualizado
    public Personagem cacar() {
        if (energia < 2) {
            System.out.println(nome + " sem energia para cacar");
            return new Personagem(nome, energia,
                Math.min(fome + 1, 10), Math.min(sono + 1, 10));
        }
        System.out.println(nome + " cacando");
        return new Personagem(nome, energia - 2,
            Math.min(fome + 1, 10), Math.min(sono + 1, 10));
    }

    public Personagem comer() {
        if (fome < 1) {
            System.out.println(nome + " sem fome.");
            return this;
        }
        System.out.println(nome + " comendo.");
        return new Personagem(nome, Math.min(energia + 1, 10), fome - 1, sono);
    }

    public Personagem dormir() {
        if (sono < 1) {
            System.out.println(nome + " sem sono.");
            return this;
        }
        System.out.println(nome + " dormindo.");
        return new Personagem(nome, Math.min(energia + 1, 10), fome, sono - 1);
    }

    public void exibirEstado() {
        System.out.printf("%s -> Energia: %d | Fome: %d | Sono: %d%n",
            nome, energia, fome, sono);
    }
}
```

### Classe Jogo com Record

Como cada ação retorna um novo objeto, precisamos reatribuir a variável a cada chamada — caso contrário o estado atualizado se perde:

**Jogo.java**

```java
public class Jogo {
    public static void main(String[] args) throws Exception {
        // Criamos os personagens com o método de fábrica ou construtor direto
        Personagem cacador = Personagem.criar("John");
        Personagem soneca  = new Personagem("Soneca", 2, 6, 4);

        while (true) {
            // IMPORTANTE: cada ação retorna novo objeto; devemos reatribuir!
            cacador = cacador.cacar();
            soneca  = soneca.dormir();
            cacador = cacador.comer();
            soneca  = soneca.dormir();
            cacador = cacador.dormir();
            soneca  = soneca.cacar();
            System.out.println("== Estado ==");
            cacador.exibirEstado();
            soneca.exibirEstado();
            System.out.println("====================");
            Thread.sleep(2000);
        }
    }
}
```

### Record vs. classe tradicional vs. Lombok

| Abordagem | Características |
| --- | --- |
| Classe tradicional | controle total, mutável, mais verbosa |
| Classe com Lombok | mutável, menos verbosa, requer dependência externa |
| Record | imutável, extremamente conciso, nativo do Java 16+ |

Use Record quando o objeto representa um valor de dados (DTO, resultado, estado imutável). Prefira classe tradicional ou Lombok quando precisar de mutabilidade ou de comportamentos mais complexos.

## Encerramento
Duration: 2:00

Você construiu o jogo do personagem na ilha partindo de uma classe simples, acrescentou regras de negócio, protegeu o estado com encapsulamento e construtores e, por fim, reescreveu a classe com Lombok e com um Record imutável.

### Referências

* DEITEL, P.; DEITEL, H. *Java Como Programar*. 8. ed. São Paulo: Pearson, 2010.
* LOPES, A.; GARCIA, G. *Introdução à Programação — 500 Algoritmos Resolvidos*. 1. ed. São Paulo: Elsevier, 2002.
* PROJECT LOMBOK. Disponível em: [https://projectlombok.org](https://projectlombok.org). Acesso em: fev. 2026.
* ORACLE. *Java SE 16 — Records (JEP 395)*. Disponível em: [https://openjdk.org/jeps/395](https://openjdk.org/jeps/395). Acesso em: fev. 2026.
