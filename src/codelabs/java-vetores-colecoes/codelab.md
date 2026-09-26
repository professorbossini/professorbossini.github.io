summary: Trabalhe com vetores em Java (preenchimento, busca linear, maior e menor valor), entenda suas limitações e passe para ArrayList e Generics, construindo um gerenciador de playlist ordenado com Comparable e Comparator.
id: java-vetores-colecoes
categories: Java
tags: java,vetores,arrays,arraylist,generics,comparable,comparator,coleções,poo
status: Published
authors: Rodrigo Bossini
last updated: 2026-03-26
pdf: java/novo/008_apostila_vetores_colecoes.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Vetores e coleções em Java

## Visão geral
Duration: 3:00

Neste codelab você começa pelos **vetores** (arrays) — o que são, como preenchê-los, como buscar valores neles — e, a partir das suas limitações, chega às **coleções** da biblioteca padrão do Java: `ArrayList`, **Generics** e as interfaces **Comparable** e **Comparator**, aplicadas em um projeto de playlist de músicas.

### O que você vai aprender

* Declarar, preencher e percorrer vetores
* Busca linear e busca do maior e do menor valor
* As limitações dos vetores: tamanho fixo, remoção com deslocamento e tipo fixo
* `ArrayList`, Generics e as classes wrapper
* Os métodos fundamentais de `List`
* Ordenação natural com `Comparable` e critérios alternativos com `Comparator`, lambda e method reference
* Encapsular uma coleção em uma classe com responsabilidades próprias

### O que você vai precisar

* JDK instalado e um IDE ou editor de código
* Conhecer classes, objetos, encapsulamento e construtores

## Vetores
Duration: 8:00

### O que é um vetor?

Um vetor (ou array) é uma estrutura de dados que armazena uma coleção de elementos do mesmo tipo em posições contíguas de memória. Cada elemento é acessado por meio de um índice numérico, que começa em 0 (zero).

As principais características de um vetor são: **tamanho fixo** (definido na criação), **acesso direto** a qualquer posição pelo índice e armazenamento de elementos do **mesmo tipo**.

A figura abaixo mostra um vetor de inteiros com 5 elementos. Observe que os índices vão de 0 a 4, e cada posição armazena um valor inteiro.

![Vetor com os valores 42, 17, 8, 55 e 23 nos índices 0 a 4, com uma seta indicando a posição 2](img/vetor.webp)

*Vetor de inteiros — representação visual.*

Em Java, declaramos e inicializamos um vetor da seguinte forma:

**Listagem 1.1 — Declaração de vetores em Java**

```java
int[] elementos = new int[5];  // vetor de 5 inteiros
elementos[0] = 42;              // atribuição direta
elementos[1] = 17;

// Ou de forma direta:
int[] valores = {42, 17, 8, 55, 23};
```

### Preenchendo um vetor da esquerda para a direita

A operação mais básica com vetores é o preenchimento sequencial: começamos pelo índice 0 e avançamos até preencher todas as posições. Usamos uma variável de controle para saber qual é a próxima posição livre.

![Quatro etapas do preenchimento: 10 no índice 0, 25 no índice 1, 7 no índice 2 e, por fim, o vetor preenchido com 10, 25, 7, 33 e 19](img/preenchimento.webp)

*Preenchendo um vetor da esquerda para a direita.*

**Listagem 1.2 — Preenchimento sequencial**

```java
int[] elementos = new int[5];
int quantidade = 0;

// Preencher com valores
elementos[quantidade] = 10;  quantidade++;  // índice 0
elementos[quantidade] = 25;  quantidade++;  // índice 1
elementos[quantidade] = 7;   quantidade++;  // índice 2
elementos[quantidade] = 33;  quantidade++;  // índice 3
elementos[quantidade] = 19;  quantidade++;  // índice 4
```

## Busca linear e maior valor
Duration: 8:00

### Buscando um elemento no vetor

A busca linear (ou sequencial) percorre o vetor do início ao fim, comparando cada elemento com o valor procurado. Se encontrar, retorna o índice; caso contrário, indica que o elemento não existe.

![Busca pelo valor 33 no vetor 10, 25, 7, 33, 19: nos passos 1 a 3 os valores 10, 25 e 7 são diferentes de 33; no passo 4, com i=3, o valor é encontrado](img/busca-linear.webp)

*Busca linear — procurando o valor 33.*

**Listagem 1.3 — Busca linear**

```java
public static int buscar(int[] vet, int quantidade, int alvo) {
    for (int i = 0; i < quantidade; i++) {
        if (vet[i] == alvo) {
            return i;  // encontrou! retorna o índice
        }
    }
    return -1;  // não encontrou
}
```

### Encontrando o maior valor

Para encontrar o maior valor, assumimos inicialmente que o primeiro elemento é o maior. Em seguida, percorremos o restante do vetor, atualizando o maior sempre que encontramos um valor superior.

![Cinco passos sobre o vetor 10, 25, 7, 33, 19: maior começa em 10, passa a 25, continua 25 ao ver 7, passa a 33 e termina em 33 ao ver 19](img/maior-valor.webp)

*Encontrando o maior valor do vetor.*

**Listagem 1.4 — Encontrar o maior valor**

```java
public static int maiorValor(int[] vet, int quantidade) {
    int maior = vet[0];
    for (int i = 1; i < quantidade; i++) {
        if (vet[i] > maior) {
            maior = vet[i];
        }
    }
    return maior;
}
```

## Programa prático: operações com vetores
Duration: 12:00

O programa a seguir demonstra um menu interativo que permite ao usuário realizar diversas operações sobre um vetor de inteiros. Ele usa um loop infinito com `switch/case` e `Thread.sleep` para dar ritmo à execução.

**OperacoesVetor.java · Listagem 1.5 — Programa completo com operações em vetor**

```java
import java.util.Scanner;

public class OperacoesVetor {
    static int[] elementos = new int[10];
    static int quantidade = 0;
    static Scanner sc = new Scanner(System.in);

    public static void main(String[] args) throws InterruptedException {
        while (true) {
            System.out.println("\n====== MENU DE OPERAÇÕES ======");
            System.out.println("1 - Adicionar elemento");
            System.out.println("2 - Exibir vetor");
            System.out.println("3 - Buscar elemento");
            System.out.println("4 - Maior valor");
            System.out.println("5 - Menor valor");
            System.out.println("0 - Sair");
            System.out.print("Opção: ");
            int opcao = sc.nextInt();

            switch (opcao) {
                case 1:
                    adicionar();
                    break;
                case 2:
                    exibir();
                    break;
                case 3:
                    buscar();
                    break;
                case 4:
                    maiorValor();
                    break;
                case 5:
                    menorValor();
                    break;
                case 0:
                    System.out.println("Encerrando...");
                    return;
                default:
                    System.out.println("Opção inválida!");
            }
            Thread.sleep(1000);
        }
    }

    static void adicionar() {
        if (quantidade >= elementos.length) {
            System.out.println("Vetor cheio! Não é possível adicionar.");
            return;
        }
        System.out.print("Digite o valor: ");
        int valor = sc.nextInt();
        elementos[quantidade] = valor;
        quantidade++;
        System.out.println("Adicionado com sucesso!");
    }

    static void exibir() {
        if (quantidade == 0) {
            System.out.println("Vetor vazio!");
            return;
        }
        System.out.print("Vetor: [ ");
        for (int i = 0; i < quantidade; i++) {
            System.out.print(elementos[i]);
            if (i < quantidade - 1) System.out.print(", ");
        }
        System.out.println(" ]");
        System.out.println("Quantidade: " + quantidade);
    }

    static void buscar() {
        System.out.print("Valor a buscar: ");
        int alvo = sc.nextInt();
        for (int i = 0; i < quantidade; i++) {
            if (elementos[i] == alvo) {
                System.out.println("Encontrado no índice " + i);
                return;
            }
        }
        System.out.println("Valor não encontrado.");
    }

    static void maiorValor() {
        if (quantidade == 0) {
            System.out.println("Vetor vazio!");
            return;
        }
        int maior = elementos[0];
        int idx = 0;
        for (int i = 1; i < quantidade; i++) {
            if (elementos[i] > maior) {
                maior = elementos[i];
                idx = i;
            }
        }
        System.out.println("Maior valor: " + maior + " (índice " + idx + ")");
    }

    static void menorValor() {
        if (quantidade == 0) {
            System.out.println("Vetor vazio!");
            return;
        }
        int menor = elementos[0];
        int idx = 0;
        for (int i = 1; i < quantidade; i++) {
            if (elementos[i] < menor) {
                menor = elementos[i];
                idx = i;
            }
        }
        System.out.println("Menor valor: " + menor + " (índice " + idx + ")");
    }
}
```

<aside class="positive">

**Nota.** Observe que o vetor foi criado com capacidade 10 (tamanho fixo). Se o usuário tentar adicionar mais de 10 elementos, o programa exibirá uma mensagem de erro. Essa é uma das principais limitações dos vetores que veremos a seguir.

</aside>

## Limitações dos vetores
Duration: 5:00

Apesar de serem muito eficientes para acesso direto a elementos, os vetores possuem limitações significativas que podem torná-los inconvenientes para diversos problemas computacionais.

### Tamanho fixo

Uma vez alocado, um vetor nunca pode ter seu tamanho alterado. Se criamos um vetor com 5 posições e ele fica cheio, não há como adicionar mais elementos. Precisaríamos criar um vetor novo, maior, e copiar tudo manualmente.

### Remoção com deslocamento

Quando removemos um elemento do meio do vetor, precisamos deslocar todos os elementos à direita para preencher o "buraco" deixado. Isso pode ser custoso em vetores grandes.

![Acima, um vetor cheio com 10, 25, 7, 33 e 19 em que não é possível adicionar o 42; abaixo, a remoção do índice 1 deixa um buraco e os elementos seguintes precisam ser deslocados para a esquerda](img/limitacoes.webp)

*Limitações dos vetores comuns.*

### Tipo de dado fixo

Um vetor de inteiros só armazena inteiros. Se quisermos uma coleção de Strings, precisamos criar outro vetor. Não há como reaproveitar a mesma estrutura para tipos diferentes sem escrever código duplicado.

**Essas limitações motivam o uso de estruturas de dados mais flexíveis, como a classe `ArrayList` da biblioteca padrão do Java.**

## ArrayList e Generics
Duration: 10:00

### O que é um ArrayList?

A classe `ArrayList`, do pacote `java.util`, é uma implementação de lista baseada em vetores que resolve as principais limitações que vimos. Ela oferece **redimensionamento automático**: quando a capacidade interna se esgota, o `ArrayList` cria internamente um novo vetor maior e copia os elementos, de forma transparente para o programador.

![ArrayList com 4 elementos e capacidade 4; ao chamar add(42) a capacidade dobra para 8 e o 42 é adicionado no índice 4](img/arraylist.webp)

*ArrayList — redimensionamento automático.*

Diferentemente de um vetor comum, o `ArrayList`: cresce e encolhe automaticamente, possui métodos prontos para adição, remoção, busca e ordenação, e funciona com qualquer tipo de objeto graças ao recurso de Generics.

### Generics

**Generics** é um recurso do Java que permite parametrizar o tipo de dados que uma classe manipula. Ao invés de fixar o tipo como `int` ou `String`, deixamos o tipo "aberto" e o especificamos no momento da instanciação.

**ExemploGenerics.java · Listagem 3.1 — Exemplos de uso de Generics com ArrayList**

```java
import java.util.ArrayList;
import java.util.List;

public class ExemploGenerics {
    public static void main(String[] args) {
        // ArrayList de Strings
        List<String> nomes = new ArrayList<>();
        nomes.add("Ana");
        nomes.add("Bruno");

        // ArrayList de Inteiros (usa wrapper Integer)
        List<Integer> numeros = new ArrayList<>();
        numeros.add(42);
        numeros.add(17);

        // ArrayList de objetos personalizados
        List<Musica> playlist = new ArrayList<>();
        playlist.add(new Musica("Bohemian Rhapsody"));

        System.out.println(nomes);    // [Ana, Bruno]
        System.out.println(numeros);  // [42, 17]
    }
}
```

<aside class="positive">

**Nota.** Generics não funcionam com tipos primitivos (`int`, `double`, `char`). Para esses tipos, usamos as classes wrapper correspondentes: `Integer`, `Double`, `Character` etc. O Java faz a conversão automática (autoboxing/unboxing). A classe `Musica`, usada no exemplo, é criada no próximo passo.

</aside>

### Operações básicas do ArrayList

**Listagem 3.2 — Métodos fundamentais do ArrayList**

```java
List<String> lista = new ArrayList<>();
lista.add("A");              // adiciona ao final
lista.add(0, "B");           // adiciona na posição 0
lista.get(0);                // acessa o elemento no índice 0
lista.set(1, "C");           // substitui o elemento no índice 1
lista.remove(0);             // remove pelo índice
lista.remove("C");           // remove pela referência do objeto
lista.size();                // retorna o tamanho atual
lista.contains("A");         // verifica se contém o elemento
lista.isEmpty();             // verifica se está vazia
lista.clear();               // remove todos os elementos
lista.indexOf("A");          // retorna o índice do elemento (-1 se não existir)
```

## Projeto: a classe Musica e Comparable
Duration: 10:00

Agora vamos aplicar tudo o que aprendemos em um projeto prático: um gerenciador de playlist. Criaremos três classes — `Musica`, `Playlist` e `GerenciadorPlaylist` — seguindo os princípios da Orientação a Objetos. O usuário poderá adicionar músicas, remover, listar, avaliar por nome e ordenar a playlist usando `Comparable` e `Comparator`.

### A classe Musica

Nossa classe `Musica` possui dois atributos: `nome` (`String`) e `avaliacao` (`int`, de 0 a 10). Ela implementa a interface `Comparable<Musica>` para permitir a ordenação natural por avaliação, e sobrescreve o método `toString` para uma representação textual legível.

**Musica.java · Listagem 4.1 — Classe Musica com Comparable**

```java
public class Musica implements Comparable<Musica> {
    private String nome;
    private int avaliacao;

    public Musica(String nome) {
        this.nome = nome;
        this.avaliacao = 0; // padrão: sem avaliação
    }

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public int getAvaliacao() {
        return avaliacao;
    }

    public void setAvaliacao(int avaliacao) {
        if (avaliacao >= 0 && avaliacao <= 10) {
            this.avaliacao = avaliacao;
        } else {
            System.out.println("Avaliação deve ser entre 0 e 10!");
        }
    }

    // Comparable: ordena por avaliação (maior primeiro)
    @Override
    public int compareTo(Musica outra) {
        return Integer.compare(outra.avaliacao, this.avaliacao);
    }

    // toString: representação textual
    @Override
    public String toString() {
        String estrelas = "★".repeat(avaliacao) + "☆".repeat(10 - avaliacao);
        return String.format("%-30s  %s (%d/10)", nome, estrelas, avaliacao);
    }
}
```

### Entendendo Comparable

A interface `Comparable<T>` define um único método: `compareTo(T outro)`. Quando uma classe implementa essa interface, ela está estabelecendo um contrato: seus objetos sabem se comparar entre si. O método retorna: um valor negativo se `this` é "menor" que outro, um valor positivo se `this` é "maior", e zero se são iguais.

No nosso caso, usamos `Integer.compare(outra.avaliacao, this.avaliacao)` para que músicas com maior avaliação venham primeiro (ordem decrescente). Se quiséssemos ordem crescente, bastaria inverter: `Integer.compare(this.avaliacao, outra.avaliacao)`.

### Entendendo Comparator

Enquanto `Comparable` define a ordenação natural (dentro da própria classe), `Comparator` permite criar critérios de ordenação alternativos sem modificar a classe. Isso é útil quando queremos múltiplas formas de ordenar os mesmos objetos.

**ComparadorPorNome.java · Listagem 4.2 — Comparator para ordenação por nome**

```java
import java.util.Comparator;

// Comparator para ordenar músicas por nome (A-Z)
class ComparadorPorNome implements Comparator<Musica> {
    @Override
    public int compare(Musica m1, Musica m2) {
        return m1.getNome().compareToIgnoreCase(m2.getNome());
    }
}
```

Também é possível criar Comparators de forma mais concisa usando expressões lambda:

**Listagem 4.3 — Comparators com Lambda e Method Reference**

```java
// Usando lambda — equivalente ao Comparator acima
Collections.sort(this.musicas, (m1, m2) ->
    m1.getNome().compareToIgnoreCase(m2.getNome())
);

// Ou usando method reference com Comparator.comparing
this.musicas.sort(Comparator.comparing(Musica::getNome, String.CASE_INSENSITIVE_ORDER));
```

## A classe Playlist
Duration: 10:00

Ao invés de colocar toda a lógica no método `main` com métodos estáticos, vamos criar uma classe `Playlist` que encapsula o `ArrayList<Musica>` e oferece todos os métodos necessários para manipular a coleção. Isso é mais alinhado com os princípios da Orientação a Objetos: cada classe cuida de suas próprias responsabilidades.

A classe `Playlist` possui um atributo `musicas` (`ArrayList<Musica>`) e métodos de instância para adicionar, remover, listar, buscar, avaliar e ordenar. Nenhum método é estático — todos operam sobre o estado do objeto.

**Playlist.java · Listagem 4.4 — Classe Playlist (encapsula o ArrayList)**

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class Playlist {
    private List<Musica> musicas;

    public Playlist() {
        this.musicas = new ArrayList<>();
    }

    public void adicionar(String nome) {
        this.musicas.add(new Musica(nome));
        System.out.println("Música adicionada: " + nome);
    }

    public void remover(int indice) {
        if (indice >= 0 && indice < this.musicas.size()) {
            Musica removida = this.musicas.remove(indice);
            System.out.println("Removida: " + removida.getNome());
        } else {
            System.out.println("Índice inválido!");
        }
    }

    public void listar() {
        if (this.musicas.isEmpty()) {
            System.out.println("A playlist está vazia!");
            return;
        }
        System.out.println("\n--- PLAYLIST ---");
        for (int i = 0; i < this.musicas.size(); i++) {
            System.out.printf("%2d. %s\n", i + 1, this.musicas.get(i));
        }
        System.out.println("Total: " + this.musicas.size() + " música(s)");
    }

    public Musica buscarPorNome(String nome) {
        for (Musica m : this.musicas) {
            if (m.getNome().equalsIgnoreCase(nome)) {
                return m;
            }
        }
        return null;
    }

    public void avaliar(String nome, int nota) {
        Musica encontrada = buscarPorNome(nome);
        if (encontrada == null) {
            System.out.println("Música não encontrada!");
            return;
        }
        encontrada.setAvaliacao(nota);
        System.out.println("Avaliação registrada: " + encontrada);
    }

    public void ordenarPorAvaliacao() {
        // Usa o compareTo da classe Musica (Comparable)
        Collections.sort(this.musicas);
        System.out.println("Ordenada por avaliação!");
        listar();
    }

    public void ordenarPorNome() {
        // Usa um Comparator externo
        Collections.sort(this.musicas, new ComparadorPorNome());
        System.out.println("Ordenada por nome!");
        listar();
    }

    public boolean estaVazia() {
        return this.musicas.isEmpty();
    }

    public int tamanho() {
        return this.musicas.size();
    }
}
```

<aside class="positive">

**Nota.** Observe que todos os métodos usam `this.musicas`, operando sobre o estado do próprio objeto. Isso é muito diferente de usar variáveis e métodos estáticos. Podemos, inclusive, criar múltiplas instâncias de `Playlist`, cada uma com suas próprias músicas — algo impossível com métodos estáticos.

</aside>

## Programa principal: usando a Playlist
Duration: 10:00

O programa principal agora é simples: cria um objeto `Playlist` e delega todas as operações a ele. O `main` cuida apenas do menu e da leitura de dados do usuário, enquanto a lógica de negócio fica na classe `Playlist`.

**GerenciadorPlaylist.java · Listagem 4.5 — GerenciadorPlaylist.java (usa a classe Playlist)**

```java
import java.util.Scanner;

public class GerenciadorPlaylist {
    public static void main(String[] args) throws InterruptedException {
        Playlist playlist = new Playlist();
        Scanner sc = new Scanner(System.in);

        while (true) {
            System.out.println("\n♫ ====== GERENCIADOR DE PLAYLIST ====== ♫");
            System.out.println("1 - Adicionar música");
            System.out.println("2 - Remover música");
            System.out.println("3 - Listar músicas");
            System.out.println("4 - Avaliar música");
            System.out.println("5 - Ordenar por avaliação (Comparable)");
            System.out.println("6 - Ordenar por nome (Comparator)");
            System.out.println("0 - Sair");
            System.out.print("Opção: ");
            int opcao = sc.nextInt();
            sc.nextLine();

            switch (opcao) {
                case 1:
                    System.out.print("Nome da música: ");
                    String nome = sc.nextLine();
                    playlist.adicionar(nome);
                    break;
                case 2:
                    if (playlist.estaVazia()) {
                        System.out.println("A playlist está vazia!");
                    } else {
                        playlist.listar();
                        System.out.print("Número da música a remover: ");
                        int idx = sc.nextInt() - 1;
                        sc.nextLine();
                        playlist.remover(idx);
                    }
                    break;
                case 3:
                    playlist.listar();
                    break;
                case 4:
                    System.out.print("Nome da música a avaliar: ");
                    String nomeAvaliar = sc.nextLine();
                    System.out.print("Nota (0 a 10): ");
                    int nota = sc.nextInt();
                    sc.nextLine();
                    playlist.avaliar(nomeAvaliar, nota);
                    break;
                case 5:
                    playlist.ordenarPorAvaliacao();
                    break;
                case 6:
                    playlist.ordenarPorNome();
                    break;
                case 0:
                    System.out.println("Até mais! ♫");
                    return;
                default:
                    System.out.println("Opção inválida!");
            }
            Thread.sleep(1000);
        }
    }
}
```

<aside class="positive">

**Nota.** Compare esta versão com uma que usa apenas métodos estáticos: aqui, o `main` não sabe como as músicas são armazenadas internamente (poderia ser um `ArrayList`, um `LinkedList`, ou qualquer outra estrutura). Essa separação entre "o que fazer" e "como fazer" é o princípio de encapsulamento da POO.

</aside>

## Resumo comparativo
Duration: 4:00

A tabela abaixo resume as principais diferenças entre vetores comuns e `ArrayList`:

| Característica | Vetor (Array) | ArrayList |
| --- | --- | --- |
| Tamanho | Fixo | Dinâmico (cresce/encolhe) |
| Tipos | Primitivos e objetos | Apenas objetos (wrappers) |
| Adição | Manual (controlar índice) | Método `add()` |
| Remoção | Manual (deslocar elem.) | Método `remove()` |
| Ordenação | Implementar manualmente | `Collections.sort()` |
| Generics | Não suporta | Suporta |

### Comparable vs Comparator

Ambas as interfaces servem para definir critérios de ordenação, mas têm propósitos diferentes:

| Aspecto | Comparable | Comparator |
| --- | --- | --- |
| Pacote | `java.lang` | `java.util` |
| Método | `compareTo(T o)` | `compare(T o1, T o2)` |
| Onde define | Na própria classe | Em classe externa / lambda |
| Qtde critérios | 1 (ordenação natural) | Ilimitados |

### Referências

* DEITEL, P.; DEITEL, H. *Java: como programar*. 8. ed. São Paulo: Pearson, 2010.
* LOPES, A.; GARCIA, G. *Introdução à programação: 500 algoritmos resolvidos*. 1. ed. São Paulo: Elsevier, 2002.
* ORACLE. *The Java Tutorials: Generics*. Disponível em: [https://docs.oracle.com/javase/tutorial/java/generics/](https://docs.oracle.com/javase/tutorial/java/generics/). Acesso em: 26 mar. 2026.
* ORACLE. *Java Platform SE 17: Class ArrayList*. Disponível em: [https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/ArrayList.html](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/ArrayList.html). Acesso em: 26 mar. 2026.
