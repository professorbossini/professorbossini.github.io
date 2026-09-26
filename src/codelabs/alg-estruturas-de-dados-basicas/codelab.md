summary: Estude arrays, listas ligadas simples e duplamente ligadas, pilhas e filas no estilo CLRS, com simulações das operações, análise de complexidade e implementações em Java.
id: alg-estruturas-de-dados-basicas
categories: Algoritmos,Java
tags: analise de algoritmos,estruturas de dados,array,lista ligada,lista duplamente ligada,pilha,fila,complexidade,java
status: Published
authors: Rodrigo Bossini
last updated: 2026-03-24
pdf: analise_de_algoritmos/05_apostila_analise_de_algoritmos_estruturas_dados_basicas.pdf
exercicios: analise_de_algoritmos/05_01_exercicios_analise_de_algoritmos_estruturas_dados_basicas.pdf,analise_de_algoritmos/05_02_exercicios_analise_de_algoritmos_estruturas_dados_basicas.pdf,analise_de_algoritmos/05_03_exercicios_analise_de_algoritmos_estruturas_dados_basicas.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Estruturas de dados básicas e complexidade

## Visão geral
Duration: 3:00

Estruturas de dados são formas de organizar e armazenar informações de modo que possam ser acessadas e modificadas de maneira eficiente. A escolha da estrutura adequada é uma das decisões mais importantes no projeto de um algoritmo: ela determina a complexidade das operações que o programa realizará com mais frequência.

Neste codelab, estudaremos quatro estruturas fundamentais — **arrays**, **listas encadeadas** (simples e duplamente encadeadas), **pilhas** e **filas** — seguindo a abordagem do CLRS (*Introduction to Algorithms*). Para cada estrutura, apresentaremos sua definição, ilustrações, as operações essenciais, análise de complexidade e implementação em Java.

Ao final, tabelas comparativas resumirão a complexidade de todas as operações, permitindo uma visão global das vantagens e desvantagens de cada escolha.

### O que você vai aprender

* Como arrays são representados em memória e por que o acesso por índice é $\Theta(1)$
* Como funcionam listas ligadas simples (com e sem ponteiro `tail`) e listas duplamente ligadas
* O custo de inserir, acessar, buscar e remover em cada estrutura
* Como implementar pilhas (LIFO) e filas (FIFO) com arrays, arrays circulares e listas
* Dois exemplos práticos: verificação de balanceamento de delimitadores e simulação de fila de atendimento

### O que você vai precisar

* Um JDK instalado (`javac` e `java`)
* Conhecimento das notações $O$, $\Omega$ e $\Theta$

## Arrays: conceito e representação
Duration: 6:00

### O que é um array

Um **array** (ou *arranjo*) é uma coleção de elementos do mesmo tipo armazenados em posições **contíguas de memória**. Cada elemento é identificado por um **índice** inteiro, tipicamente começando em 0 (em linguagens como Java e C) ou em 1 (na notação do CLRS).

A contiguidade na memória é a propriedade central do array: como os elementos estão lado a lado, o endereço de qualquer posição $i$ pode ser calculado diretamente a partir do endereço base, permitindo acesso em tempo constante.

### Onde arrays são usados

Arrays estão presentes em praticamente todos os programas. Alguns exemplos de uso incluem: armazenamento de pixels em imagens digitais, representação de vetores e matrizes em computação científica, tabelas de dados em memória, buffers de entrada e saída em sistemas operacionais, e como estrutura subjacente de outras estruturas como pilhas, filas e tabelas hash.

### Representação em memória

A figura abaixo ilustra um array $A$ de tamanho $n = 6$ armazenando os valores $[10, 25, 3, 47, 8, 16]$. Cada célula ocupa uma posição contígua na memória.

![Array A com as células 10, 25, 3, 47, 8 e 16 lado a lado, índices 0 a 5 abaixo e uma seta indicando o endereço base na primeira célula](img/array-memoria.webp)

*Array $A$ de tamanho 6 em posições contíguas de memória.*

### Acesso por índice (indexação)

Como os elementos são contíguos, o endereço do elemento $A[i]$ é calculado por:

$$\text{endereço}(A[i]) = \text{base} + i \times \text{tamanho\_do\_elemento}$$

Essa operação envolve apenas uma multiplicação e uma soma, independentemente do tamanho do array. Portanto:

$$T_{\text{acesso}}(n) = \Theta(1)$$

A figura abaixo ilustra o cálculo concreto. Suponha que o array $A$ de inteiros de 4 bytes começa no endereço de memória 200. Para acessar $A[3]$, calculamos: $\text{endereço}(A[3]) = 200 + 3 \times 4 = 212$.

![Array com endereços 200, 204, 208, 212, 216 e 220 acima de cada célula; a célula de índice 3, valor 47, está destacada com o cálculo 200 + 3 × 4 = 212](img/array-endereco.webp)

*Cada inteiro ocupa 4 bytes; $A[3]$ fica no endereço 212.*

## Arrays: operações e complexidade
Duration: 8:00

### Inserção no final

Se o array possui espaço disponível (ou seja, o número de elementos armazenados é menor que a capacidade alocada), basta colocar o novo elemento na primeira posição livre e incrementar o contador de tamanho. Nenhum deslocamento é necessário.

![Antes: array 10, 25, 3, 47 com duas posições livres (tamanho 4, capacidade 6). Depois de inserir 99 no final: 10, 25, 3, 47, 99 e uma posição livre](img/array-inserir-final.webp)

*Inserção no final sem deslocamentos.*

Complexidade: $T_{\text{inserir\_final}}(n) = \Theta(1)$ (assumindo que há espaço disponível).

### Inserção no início

Inserir no início requer deslocar todos os $n$ elementos uma posição para a direita, para abrir espaço na posição 0.

![Antes: 10, 25, 3, 47 (tamanho 4). Setas mostram cada elemento sendo deslocado uma posição para a direita. Depois de inserir 99 no início: 99, 10, 25, 3, 47](img/array-inserir-inicio.webp)

*Inserção no início: todos os elementos são deslocados para a direita.*

São necessários $n$ deslocamentos. Portanto:

$$T_{\text{inserir\_início}}(n) = \Theta(n)$$

### Busca sequencial

Para encontrar um elemento no array quando não há garantia de ordenação, é necessário percorrer os elementos um a um. No pior caso, o elemento procurado está na última posição ou não existe:

$$T_{\text{busca}}(n) = \Theta(n)$$

### Remoção na posição $i$

Remover o elemento na posição $i$ exige deslocar todos os elementos de $i + 1$ até $n - 1$ uma posição para a esquerda. No pior caso ($i = 0$), são $n - 1$ deslocamentos:

$$T_{\text{remoção}}(n) = \Theta(n)$$

### Resumo da complexidade — array

| Operação | Complexidade |
| --- | --- |
| Acesso por índice | $\Theta(1)$ |
| Inserção no final | $\Theta(1)$ |
| Inserção no início | $\Theta(n)$ |
| Busca (não ordenado) | $\Theta(n)$ |
| Remoção na posição $i$ (pior caso) | $\Theta(n)$ |

## Arrays: implementação em Java
Duration: 8:00

A classe a seguir reúne as operações básicas em array, com redimensionamento automático quando a capacidade se esgota.

**ArrayDinamico.java**

```java
public class ArrayDinamico {

    private int[] dados;
    private int tamanho;

    public ArrayDinamico(int capacidade) {
        dados = new int[capacidade];
        tamanho = 0;
    }

    // Acesso por indice - Theta(1)
    public int acessar(int i) {
        if (i < 0 || i >= tamanho)
            throw new IndexOutOfBoundsException();
        return dados[i];
    }

    // Insercao no final - Theta(1) amortizado
    public void inserirNoFinal(int valor) {
        if (tamanho == dados.length) {
            redimensionar(2 * dados.length);
        }
        dados[tamanho] = valor;
        tamanho++;
    }

    // Insercao no inicio - Theta(n)
    public void inserirNoInicio(int valor) {
        if (tamanho == dados.length) {
            redimensionar(2 * dados.length);
        }
        for (int i = tamanho; i > 0; i--) {
            dados[i] = dados[i - 1];
        }
        dados[0] = valor;
        tamanho++;
    }

    // Busca sequencial - Theta(n)
    public int buscar(int valor) {
        for (int i = 0; i < tamanho; i++) {
            if (dados[i] == valor) return i;
        }
        return -1;
    }

    private void redimensionar(int novaCapacidade) {
        int[] novo = new int[novaCapacidade];
        for (int i = 0; i < tamanho; i++) {
            novo[i] = dados[i];
        }
        dados = novo;
    }

    public int tamanho() {
        return tamanho;
    }
}
```

## Lista ligada simples: conceito e operações
Duration: 10:00

### O que é uma lista ligada simples

Uma **lista ligada simples** (ou *singly linked list*) é uma coleção de elementos chamados **nós**, onde cada nó armazena um valor e uma **referência** (ponteiro) para o próximo nó da sequência. O último nó aponta para `null`, indicando o fim da lista. Um ponteiro chamado **cabeça** (*head*) indica o primeiro nó.

Diferentemente do array, os nós não precisam estar em posições contíguas de memória. Cada nó é alocado independentemente, e a sequência é determinada pelos ponteiros.

### Onde listas ligadas são usadas

Listas ligadas são fundamentais em diversas aplicações: implementação de pilhas e filas, representação de polinômios e matrizes esparsas, gerenciamento de memória livre em sistemas operacionais (listas de blocos livres), sistemas de desfazer/refazer (undo/redo) em editores de texto, e como base para estruturas mais avançadas como tabelas hash com encadeamento e grafos (listas de adjacência).

### Representação em memória

![Lista ligada com os nós 10, 25, 3 e 47; cada nó tem os campos valor e próx, o ponteiro head aponta para o nó 10 e o último nó aponta para null](img/lista-representacao.webp)

*Cada nó guarda o valor e o ponteiro para o próximo nó.*

### Inserção no início

Para inserir no início, basta criar um novo nó, apontar seu campo *próximo* para o nó atual da cabeça e atualizar a cabeça para o novo nó. Nenhum deslocamento de elementos é necessário.

![O novo nó 99 passa a ser apontado por head e seu campo próximo aponta para o antigo primeiro nó 10, seguido de 25 e 3](img/lista-inserir-inicio.webp)

*Inserção no início: apenas ajuste de ponteiros.*

Complexidade: $T_{\text{inserir\_início}}(n) = \Theta(1)$.

### Acesso por índice (indexação)

Diferentemente do array, não é possível calcular diretamente o endereço de um nó a partir de seu índice. É necessário percorrer a lista desde a cabeça, seguindo os ponteiros um a um, até alcançar a posição desejada. A figura abaixo ilustra o acesso ao nó de índice 3: partindo da cabeça, seguimos 3 ponteiros.

![Lista 10, 25, 3, 47 com setas tracejadas indicando os passos 1, 2 e 3 a partir de head até o nó de índice 3, valor 47, destacado](img/lista-acesso.webp)

*Acesso ao índice 3: três passos a partir da cabeça.*

Complexidade: $T_{\text{acesso}}(n) = \Theta(n)$ no pior caso (acessar o último elemento).

### Inserção no final — sem ponteiro para o último

Sem um ponteiro direto para o último nó, é necessário percorrer toda a lista desde a cabeça até encontrar o nó cujo campo *próximo* é `null`. Somente então o novo nó pode ser ligado ao final.

![Seta tracejada laranja percorre a lista 10, 25, 3 desde head até o último nó; o novo nó 99 é ligado ao final e aponta para null](img/lista-final-sem-tail.webp)

*Sem `tail`, é preciso percorrer a lista até o último nó.*

Complexidade: $T_{\text{inserir\_final}}(n) = \Theta(n)$.

### Inserção no final — com ponteiro para o último (tail)

Se a lista mantém, além da cabeça, um ponteiro **tail** para o último nó, a inserção no final é direta: basta criar o novo nó, fazer `tail.proximo` apontar para ele e atualizar `tail`.

![Lista 10, 25, 3, 99 com head no primeiro nó e tail apontando diretamente para o novo último nó 99](img/lista-final-com-tail.webp)

*Com `tail`, a inserção no final é direta.*

Complexidade: $T_{\text{inserir\_final}}(n) = \Theta(1)$ (com ponteiro `tail`).

### Remoção no final

Na lista ligada simples, mesmo com ponteiro `tail`, a remoção do último nó requer percorrer toda a lista. Isso ocorre porque, para remover o último nó, é necessário atualizar o campo *próximo* do **penúltimo** nó para `null` e redirecionar `tail`. Como os nós da lista simples não possuem referência ao nó anterior, o único modo de encontrar o penúltimo é percorrer a lista desde o início.

Complexidade: $T_{\text{remover\_final}}(n) = \Theta(n)$.

### Comparação: array versus lista ligada simples

| Operação | Array | Lista ligada simples |
| --- | --- | --- |
| Acesso por índice | $\Theta(1)$ | $\Theta(n)$ |
| Inserção no início | $\Theta(n)$ | $\Theta(1)$ |
| Inserção no final | $\Theta(1)$ | $\Theta(1)$ com `tail` / $\Theta(n)$ sem |
| Remoção no início | $\Theta(n)$ | $\Theta(1)$ |
| Remoção no final | $\Theta(1)$ | $\Theta(n)$ |
| Busca | $\Theta(n)$ | $\Theta(n)$ |

A escolha entre array e lista ligada depende do padrão de operações predominante. Se o programa realiza muitos acessos por índice, o array é preferível. Se as inserções e remoções no início são frequentes, a lista ligada simples é mais eficiente.

## Lista ligada simples: simulação detalhada
Duration: 12:00

Utilizaremos a lista $[10, 20, 30]$ como ponto de partida para a maioria das simulações. Em cada diagrama, os nós são representados como caixas com dois campos (valor e ponteiro `próximo`).

### Inserir no início — sem `tail`

Inserir o valor 5 no início da lista $[10, 20, 30]$ (apenas ponteiro `head`).

**Passo 1:** Criar o novo nó com valor 5. Fazer `novo.proximo = head`.

![Novo nó 5 acima da lista; seu campo próximo aponta, com seta tracejada vermelha, para o nó 10, ainda apontado por head](img/sim-inicio-passo1.webp)

*Passo 1: o novo nó aponta para a cabeça atual.*

**Passo 2:** Atualizar `head = novo`. Resultado final: $[5, 10, 20, 30]$.

![Lista 5, 10, 20, 30 com head apontando para o nó 5, destacado em verde](img/sim-inicio-passo2.webp)

*Passo 2: `head` passa a apontar para o novo nó.*

Ponteiros alterados: 1 (`novo.proximo`) + atualização de `head`. Complexidade: $\Theta(1)$.

### Inserir no início — com `tail`

A operação é idêntica à anterior, com um detalhe: se a lista estiver **vazia** antes da inserção, além de atualizar `head`, é preciso também fazer `tail = novo` (o único nó é primeiro e último ao mesmo tempo). Se a lista já tiver elementos, `tail` não muda. Complexidade: $\Theta(1)$.

### Inserir no final — sem `tail`

Inserir o valor 99 no final da lista $[10, 20, 30]$ (apenas ponteiro `head`).

**Passo 1:** Percorrer desde `head` até o último nó.

![Seta tracejada laranja percorre n−1 nós, de 10 até 30, a partir de head](img/sim-final-sem-tail-passo1.webp)

*Passo 1: percorre $n-1$ nós.*

**Passo 2:** Criar o novo nó e fazer `ultimo.proximo = novo`. Resultado: $[10, 20, 30, 99]$.

![Lista 10, 20, 30, 99 com o novo nó 99 destacado em verde no final](img/sim-final-sem-tail-passo2.webp)

*Passo 2: o novo nó é ligado ao final.*

Complexidade: $\Theta(n)$.

### Inserir no final — com `tail`

Com `tail`, nenhuma travessia é necessária: `tail.proximo = novo`, depois `tail = novo`.

![Lista 10, 20, 30, 99 com head no primeiro nó e tail no nó 99, destacado em verde](img/sim-final-com-tail.webp)

*Com `tail`, basta ligar o novo nó e atualizar `tail`.*

Complexidade: $\Theta(1)$.

### Acessar o $i$-ésimo elemento

Acessar o índice 2 na lista $[10, 20, 30, 40]$. Partindo de `head`, seguimos $i = 2$ ponteiros:

![Lista 10, 20, 30, 40 com setas tracejadas numeradas 1 e 2 levando de head ao nó de índice 2, valor 30, destacado com a indicação retorna 30](img/sim-acesso.webp)

*Dois passos até o índice 2, que retorna 30.*

Complexidade: $\Theta(n)$ no pior caso.

### Buscar um valor

Buscar o valor 20 na lista $[10, 20, 30, 40]$:

![Lista 10, 20, 30, 40; sob o nó 10 está 10 ≠ 20 e sob o nó 20, destacado em verde, está 20 = 20 com um sinal de confirmação](img/sim-busca.webp)

*O valor é encontrado na segunda comparação.*

Encontrado após 2 comparações. No pior caso: $\Theta(n)$.

### Remover do início — sem `tail`

Remover o primeiro elemento da lista $[10, 20, 30]$. Salvamos o valor de `head` e fazemos `head = head.proximo`:

![O nó 10 aparece esmaecido com a indicação removido; head passa a apontar para o nó 20, seguido de 30 e null](img/sim-remover-inicio.webp)

*O antigo primeiro nó deixa de fazer parte da lista.*

Resultado: $[20, 30]$. Retorna 10. Complexidade: $\Theta(1)$.

### Remover do início — com `tail`

Operação idêntica. Detalhe: se a lista ficar **vazia** (`head` tornou-se `null`), fazer `tail = null` também. Complexidade: $\Theta(1)$.

### Remover do final — sem `tail`

Remover o último elemento da lista $[10, 20, 30]$. Percorremos até o penúltimo:

![Seta tracejada laranja vai de 10 até o nó 20, marcado como penúltimo; o nó 30 aparece esmaecido como removido](img/sim-remover-final-sem-tail.webp)

*É preciso percorrer a lista até o penúltimo nó.*

Fazemos `penultimo.proximo = null`. Resultado: $[10, 20]$. Retorna 30. Complexidade: $\Theta(n)$.

### Remover do final — com `tail`

Mesmo com `tail`, a remoção **ainda** custa $\Theta(n)$: precisamos do penúltimo, que só é acessível percorrendo desde `head`.

![Mesmo com tail apontando para o nó 30, removido, a seta tracejada percorre a lista desde head até o penúltimo nó 20](img/sim-remover-final-com-tail.webp)

*O ponteiro `tail` não ajuda a encontrar o penúltimo.*

Após: `penultimo.proximo = null` e `tail = penultimo`. Complexidade: $\Theta(n)$.

Essa é a principal limitação da lista simples que a **lista duplamente ligada** resolve: com o ponteiro `anterior`, o penúltimo é acessado via `tail.anterior` em $\Theta(1)$.

## Lista ligada simples: implementação em Java
Duration: 10:00

**ListaLigadaSimples.java**

```java
public class ListaLigadaSimples {

    private static class No {
        int valor;
        No proximo;

        No(int valor) {
            this.valor = valor;
            this.proximo = null;
        }
    }

    private No head;
    private No tail;
    private int tamanho;

    public ListaLigadaSimples() {
        head = null;
        tail = null;
        tamanho = 0;
    }

    // Insercao no inicio - Theta(1)
    public void inserirNoInicio(int valor) {
        No novo = new No(valor);
        novo.proximo = head;
        head = novo;
        if (tail == null) {
            tail = novo;
        }
        tamanho++;
    }

    // Insercao no final - Theta(1) com tail
    public void inserirNoFinal(int valor) {
        No novo = new No(valor);
        if (tail == null) {
            head = novo;
            tail = novo;
        } else {
            tail.proximo = novo;
            tail = novo;
        }
        tamanho++;
    }

    // Acesso por indice - Theta(n)
    public int acessar(int indice) {
        if (indice < 0 || indice >= tamanho)
            throw new IndexOutOfBoundsException();
        No atual = head;
        for (int i = 0; i < indice; i++) {
            atual = atual.proximo;
        }
        return atual.valor;
    }

    // Busca - Theta(n)
    public boolean buscar(int valor) {
        No atual = head;
        while (atual != null) {
            if (atual.valor == valor) return true;
            atual = atual.proximo;
        }
        return false;
    }

    // Remocao no inicio - Theta(1)
    public int removerDoInicio() {
        if (head == null)
            throw new RuntimeException("Lista vazia");
        int valor = head.valor;
        head = head.proximo;
        if (head == null) {
            tail = null;
        }
        tamanho--;
        return valor;
    }

    // Remocao no final - Theta(n)
    public int removerDoFinal() {
        if (head == null)
            throw new RuntimeException("Lista vazia");
        int valor;
        if (head == tail) {
            valor = head.valor;
            head = null;
            tail = null;
        } else {
            No atual = head;
            while (atual.proximo != tail) {
                atual = atual.proximo;
            }
            valor = tail.valor;
            atual.proximo = null;
            tail = atual;
        }
        tamanho--;
        return valor;
    }

    public int tamanho() {
        return tamanho;
    }
}
```

## Lista duplamente ligada: conceito e operações
Duration: 8:00

### O que é uma lista duplamente ligada

Uma **lista duplamente ligada** (*doubly linked list*) é semelhante à lista simples, mas cada nó possui dois ponteiros: um para o **próximo** nó e outro para o nó **anterior**. Essa referência bidirecional permite percorrer a lista em ambas as direções.

### Onde são usadas

Listas duplamente ligadas são usadas em: navegação de histórico em navegadores web (avançar/voltar), implementação de caches LRU (*Least Recently Used*), editores de texto para navegação bidirecional pelo conteúdo, playlists de música (próxima/anterior), e como base para a classe `LinkedList` do Java.

### Vantagens em relação à lista simples

A principal vantagem da lista duplamente ligada é a possibilidade de **percorrer a lista de trás para frente**. Isso permite, por exemplo, remover o último nó em $\Theta(1)$ (com ponteiro `tail`), sem precisar percorrer a lista inteira para encontrar o penúltimo — algo que a lista simples não consegue fazer mesmo com ponteiro `tail`. O custo dessa vantagem é o uso de memória adicional por nó (um ponteiro extra) e uma complexidade ligeiramente maior na manutenção dos ponteiros durante inserções e remoções.

### Representação em memória

![Lista duplamente ligada com os nós 10, 25 e 3; cada nó tem os campos ant, valor e próx; setas azuis ligam cada nó ao próximo e setas vermelhas ao anterior; head aponta para 10, tail para 3, e as extremidades apontam para null](img/dupla-representacao.webp)

*Cada nó guarda o valor e os ponteiros `anterior` e `proximo`.*

### Inserção no início

Cria-se um novo nó com `anterior = null` e `proximo = head`. Se a lista não estiver vazia, atualiza-se `head.anterior` para apontar para o novo nó. Finalmente, atualiza-se `head`.

Complexidade: $T_{\text{inserir\_início}}(n) = \Theta(1)$.

### Inserção no final

Com o ponteiro `tail`, cria-se um novo nó com `proximo = null` e `anterior = tail`, atualiza-se `tail.proximo` para o novo nó e `tail` para o novo nó.

Complexidade: $T_{\text{inserir\_final}}(n) = \Theta(1)$.

### Acesso por índice

Assim como na lista simples, é necessário percorrer a lista sequencialmente. Porém, uma otimização é possível: se o índice está na segunda metade da lista, inicia-se a travessia pelo `tail`, percorrendo os ponteiros `anterior`. No pior caso, percorre-se $\lfloor n/2 \rfloor$ nós, mas assintoticamente:

Complexidade: $T_{\text{acesso}}(n) = \Theta(n)$.

### Remoção no final

Na lista simples com `tail`, remover o último nó exige percorrer a lista inteira para encontrar o penúltimo. Na lista duplamente ligada, basta usar `tail.anterior`:

Complexidade: $T_{\text{remover\_final}}(n) = \Theta(1)$.

### Resumo da complexidade — lista duplamente ligada

| Operação | Lista simples (c/ tail) | Lista dupla (c/ tail) |
| --- | --- | --- |
| Inserção no início | $\Theta(1)$ | $\Theta(1)$ |
| Inserção no final | $\Theta(1)$ | $\Theta(1)$ |
| Acesso por índice | $\Theta(n)$ | $\Theta(n)$ |
| Remoção no início | $\Theta(1)$ | $\Theta(1)$ |
| Remoção no final | $\Theta(n)$ | $\Theta(1)$ |

## Lista duplamente ligada: simulação detalhada
Duration: 8:00

Utilizaremos a lista $[10, 20, 30]$ como ponto de partida. Os nós da lista duplamente ligada possuem três campos: `anterior`, valor e `proximo`. Nos diagramas, setas azuis ($\rightarrow$) indicam `proximo` e setas vermelhas ($\leftarrow$) indicam `anterior`.

### Inserir no início

Inserir o valor 5 no início da lista $[10, 20, 30]$.

**Passo 1:** Criar o novo nó. Fazer `novo.proximo = head` e `head.anterior = novo`.

**Passo 2:** Atualizar `head = novo`. Resultado: $[5, 10, 20, 30]$.

![Lista duplamente ligada 5, 10, 20, 30 com o nó 5 destacado em verde, head apontando para ele e tail para o nó 30](img/dupla-inserir-inicio.webp)

*Resultado da inserção no início.*

Ponteiros alterados: `novo.proximo`, `head.anterior`, `head`. Complexidade: $\Theta(1)$.

### Inserir no final

Inserir o valor 99 no final da lista $[10, 20, 30]$. Com `tail`, acesso direto.

**Passo 1:** Criar o novo nó. Fazer `novo.anterior = tail` e `tail.proximo = novo`.

**Passo 2:** Atualizar `tail = novo`. Resultado: $[10, 20, 30, 99]$.

![Lista duplamente ligada 10, 20, 30, 99 com o nó 99 destacado em verde e apontado por tail](img/dupla-inserir-final.webp)

*Resultado da inserção no final.*

Complexidade: $\Theta(1)$ — sem travessia, acesso direto via `tail`.

### Acesso por índice

Acessar o índice 2 na lista $[10, 20, 30, 40]$. Como $2 < 4/2$, partimos do `head`:

![Lista duplamente ligada 10, 20, 30, 40 com setas tracejadas 1 e 2 partindo de head até o nó de índice 2, valor 30, com a indicação retorna 30](img/dupla-acesso.webp)

*Travessia a partir de `head` até o índice 2.*

Se o índice fosse 3, partiríamos do `tail` (apenas 1 passo: $4 - 1 - 3 = 0$). Complexidade: $\Theta(n)$ no pior caso, mas na prática percorre no máximo $\lfloor n/2 \rfloor$ nós.

### Remover do início

Remover o primeiro elemento da lista $[10, 20, 30]$:

**Passo 1:** Salvar valor de `head` (10). Fazer `head = head.proximo`.

**Passo 2:** Fazer `head.anterior = null`.

![O nó 10 aparece esmaecido como removido; head aponta para o nó 20, cujo anterior é null, e tail aponta para o nó 30](img/dupla-remover-inicio.webp)

*Remoção do início na lista duplamente ligada.*

Resultado: $[20, 30]$. Retorna 10. Complexidade: $\Theta(1)$.

### Remover do final

Remover o último elemento da lista $[10, 20, 30]$. Diferente da lista simples, temos acesso ao penúltimo via `tail.anterior`:

**Passo 1:** Salvar valor de `tail` (30). Fazer `tail = tail.anterior`.

**Passo 2:** Fazer `tail.proximo = null`.

![Lista 10, 20 com tail apontando para o nó 20, cujo próximo é null; o nó 30 aparece esmaecido como removido](img/dupla-remover-final.webp)

*Remoção do final sem travessia.*

Resultado: $[10, 20]$. Retorna 30. Complexidade: $\Theta(1)$ — nenhuma travessia necessária.

Essa é a grande vantagem da lista duplamente ligada sobre a simples: o ponteiro `anterior` permite acessar o penúltimo nó via `tail.anterior`, eliminando a travessia de $\Theta(n)$.

## Lista duplamente ligada: implementação em Java
Duration: 10:00

**ListaDuplamenteLigada.java**

```java
public class ListaDuplamenteLigada {

    private static class No {
        int valor;
        No anterior;
        No proximo;

        No(int valor) {
            this.valor = valor;
            this.anterior = null;
            this.proximo = null;
        }
    }

    private No head;
    private No tail;
    private int tamanho;

    public ListaDuplamenteLigada() {
        head = null;
        tail = null;
        tamanho = 0;
    }

    // Insercao no inicio - Theta(1)
    public void inserirNoInicio(int valor) {
        No novo = new No(valor);
        novo.proximo = head;
        if (head != null) {
            head.anterior = novo;
        } else {
            tail = novo;
        }
        head = novo;
        tamanho++;
    }

    // Insercao no final - Theta(1)
    public void inserirNoFinal(int valor) {
        No novo = new No(valor);
        novo.anterior = tail;
        if (tail != null) {
            tail.proximo = novo;
        } else {
            head = novo;
        }
        tail = novo;
        tamanho++;
    }

    // Acesso por indice - Theta(n)
    public int acessar(int indice) {
        if (indice < 0 || indice >= tamanho)
            throw new IndexOutOfBoundsException();
        No atual;
        if (indice < tamanho / 2) {
            atual = head;
            for (int i = 0; i < indice; i++)
                atual = atual.proximo;
        } else {
            atual = tail;
            for (int i = tamanho - 1; i > indice; i--)
                atual = atual.anterior;
        }
        return atual.valor;
    }

    // Remocao no inicio - Theta(1)
    public int removerDoInicio() {
        if (head == null)
            throw new RuntimeException("Lista vazia");
        int valor = head.valor;
        head = head.proximo;
        if (head != null) {
            head.anterior = null;
        } else {
            tail = null;
        }
        tamanho--;
        return valor;
    }

    // Remocao no final - Theta(1)
    public int removerDoFinal() {
        if (tail == null)
            throw new RuntimeException("Lista vazia");
        int valor = tail.valor;
        tail = tail.anterior;
        if (tail != null) {
            tail.proximo = null;
        } else {
            head = null;
        }
        tamanho--;
        return valor;
    }

    public int tamanho() {
        return tamanho;
    }
}
```

## Pilha: conceito e implementações
Duration: 12:00

### O que é uma pilha

Uma **pilha** (*stack*) é uma estrutura de dados que segue a política **LIFO** — *Last In, First Out* (último a entrar, primeiro a sair). Apenas duas operações fundamentais são definidas:

* **Push**: insere um elemento no topo da pilha.
* **Pop**: remove e retorna o elemento do topo da pilha.

A analogia clássica é uma pilha de pratos: o último prato colocado sobre a pilha é o primeiro a ser retirado.

### Onde pilhas são usadas

Pilhas são fundamentais em diversas áreas da computação: a pilha de chamadas (*call stack*) do sistema operacional gerencia as chamadas de função e variáveis locais durante a execução de programas; compiladores utilizam pilhas para avaliar expressões aritméticas e verificar o balanceamento de parênteses; algoritmos de busca em profundidade (DFS) em grafos podem ser implementados com uma pilha explícita; e a funcionalidade de desfazer (Ctrl+Z) em editores é tipicamente implementada com uma pilha.

### Representação visual

![Pilha vertical com 10 na base, depois 25, 3 e 47 no topo, destacado; setas indicam push entrando e pop saindo pelo topo](img/pilha.webp)

*Push e pop acontecem sempre no topo.*

### Implementação com array

A implementação com array é a mais direta: um inteiro `topo` indica a posição do elemento no topo. O *push* incrementa `topo` e armazena o valor; o *pop* retorna o valor na posição `topo` e o decrementa.

**PilhaArray.java**

```java
public class PilhaArray {

    private int[] dados;
    private int topo;

    public PilhaArray(int capacidade) {
        dados = new int[capacidade];
        topo = -1;
    }

    // Push - Theta(1)
    public void push(int valor) {
        if (topo == dados.length - 1)
            throw new RuntimeException("Pilha cheia");
        topo++;
        dados[topo] = valor;
    }

    // Pop - Theta(1)
    public int pop() {
        if (topo == -1)
            throw new RuntimeException("Pilha vazia");
        int valor = dados[topo];
        topo--;
        return valor;
    }

    // Consulta o topo sem remover - Theta(1)
    public int topo() {
        if (topo == -1)
            throw new RuntimeException("Pilha vazia");
        return dados[topo];
    }

    public boolean estaVazia() {
        return topo == -1;
    }
}
```

### Implementação com lista ligada simples

Na implementação com lista ligada, o topo da pilha corresponde à cabeça da lista. O *push* insere no início e o *pop* remove do início — ambas operações em $\Theta(1)$. Reutilizamos a classe `ListaLigadaSimples`, delegando as operações de manipulação de nós.

**PilhaListaSimples.java**

```java
public class PilhaListaSimples {

    private ListaLigadaSimples lista;

    public PilhaListaSimples() {
        lista = new ListaLigadaSimples();
    }

    // Push - Theta(1)
    public void push(int valor) {
        lista.inserirNoInicio(valor);
    }

    // Pop - Theta(1)
    public int pop() {
        return lista.removerDoInicio();
    }

    // Consulta o topo - Theta(1)
    public int topo() {
        return lista.acessar(0);
    }

    public boolean estaVazia() {
        return lista.tamanho() == 0;
    }
}
```

### Implementação com lista duplamente ligada

Embora uma lista duplamente ligada não traga vantagem adicional para uma pilha (pois as operações ocorrem em apenas uma extremidade), a implementação é possível e segue o mesmo princípio. Reutilizamos a classe `ListaDuplamenteLigada`.

**PilhaListaDupla.java**

```java
public class PilhaListaDupla {

    private ListaDuplamenteLigada lista;

    public PilhaListaDupla() {
        lista = new ListaDuplamenteLigada();
    }

    // Push - Theta(1)
    public void push(int valor) {
        lista.inserirNoInicio(valor);
    }

    // Pop - Theta(1)
    public int pop() {
        return lista.removerDoInicio();
    }

    // Consulta o topo - Theta(1)
    public int topo() {
        return lista.acessar(0);
    }

    public boolean estaVazia() {
        return lista.tamanho() == 0;
    }
}
```

### Comparação de complexidade — pilha

| Operação | Array | Lista simples | Lista dupla |
| --- | --- | --- | --- |
| Push | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ |
| Pop | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ |
| Consulta ao topo | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ |
| Busca | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ |

Todas as implementações oferecem $\Theta(1)$ para *push* e *pop*. A escolha entre elas depende de outros fatores: a implementação com array tem melhor **localidade de cache** (elementos contíguos em memória), mas exige que se defina uma capacidade máxima ou que se implemente redimensionamento. As implementações com listas alocam memória dinamicamente, sem limite fixo, mas possuem *overhead* de memória por nó (um ponteiro extra na lista simples, dois na lista dupla).

## Pilha: balanceamento de delimitadores
Duration: 10:00

Um dos usos mais clássicos de pilhas em compiladores e editores de código é a **verificação de balanceamento de delimitadores**: parênteses `()`, colchetes `[]` e chaves `{}`. A ideia é simples: ao percorrer uma expressão da esquerda para a direita, cada delimitador de abertura é empilhado. Quando um delimitador de fechamento é encontrado, o topo da pilha deve conter o delimitador de abertura correspondente. Se a pilha estiver vazia ao encontrar um fechamento, ou se o topo não corresponder, a expressão está desbalanceada. Ao final, a pilha deve estar vazia para que a expressão seja considerada válida.

Por exemplo, a expressão `{a + [b * (c - d)]}` é válida, pois cada fechamento corresponde ao último delimitador aberto. Já a expressão `(a + [b) ]` é inválida: o `)` tenta fechar o `[`, que não é seu par.

A tabela abaixo mostra o estado da pilha ao processar `{a + [b * (c - d)]}`:

| Caractere | Ação | Pilha (topo →) | Resultado |
| --- | --- | --- | --- |
| `{` | empilha | `{` | — |
| `[` | empilha | `{ [` | — |
| `(` | empilha | `{ [ (` | — |
| `)` | desempilha, confere par de `(` | `{ [` | corresponde |
| `]` | desempilha, confere par de `[` | `{` | corresponde |
| `}` | desempilha, confere par de `{` | (vazia) | corresponde |

**VerificadorBalanceamento.java**

```java
public class VerificadorBalanceamento {

    public static boolean estaBalanceado(String expressao) {
        PilhaArray pilha = new PilhaArray(expressao.length());

        for (int k = 0; k < expressao.length(); k++) {
            char c = expressao.charAt(k);

            if (c == '(' || c == '[' || c == '{') {
                pilha.push(c);
            } else if (c == ')' || c == ']' || c == '}') {
                if (pilha.estaVazia()) {
                    return false;
                }
                char topo = (char) pilha.pop();
                if (!corresponde(topo, c)) {
                    return false;
                }
            }
        }

        return pilha.estaVazia();
    }

    private static boolean corresponde(char abertura, char fechamento) {
        return (abertura == '(' && fechamento == ')')
            || (abertura == '[' && fechamento == ']')
            || (abertura == '{' && fechamento == '}');
    }

    public static void main(String[] args) {
        String expr1 = "{a + [b * (c - d)]}";
        String expr2 = "(a + [b)";

        System.out.println(expr1 + " -> "
            + (estaBalanceado(expr1) ? "balanceado" : "desbalanceado"));
        System.out.println(expr2 + " -> "
            + (estaBalanceado(expr2) ? "balanceado" : "desbalanceado"));
    }
}
```

**Saída esperada:**

```text
{a + [b * (c - d)]} -> balanceado
(a + [b) -> desbalanceado
```

Observe que a complexidade do algoritmo é $\Theta(n)$, onde $n$ é o comprimento da expressão: cada caractere é examinado exatamente uma vez, e cada operação de *push* e *pop* é $\Theta(1)$.

## Fila: conceito e implementações com array
Duration: 12:00

### O que é uma fila

Uma **fila** (*queue*) é uma estrutura de dados que segue a política **FIFO** — *First In, First Out* (primeiro a entrar, primeiro a sair). As duas operações fundamentais são:

* **Enqueue** (enfileirar): insere um elemento no final da fila.
* **Dequeue** (desenfileirar): remove e retorna o elemento do início da fila.

A analogia é uma fila de pessoas em uma bilheteria: quem chega primeiro é atendido primeiro.

### Onde filas são usadas

Filas aparecem em diversos contextos: escalonamento de processos em sistemas operacionais (fila de processos prontos), gerenciamento de requisições em servidores web, buffers de impressão (*print queue*), busca em largura (BFS) em grafos, e sistemas de mensageria como filas de mensagens (RabbitMQ, Apache Kafka).

### Representação visual

![Fila horizontal com os elementos 10, 25, 3 e 47; uma seta verde marca o início (dequeue) no 10 e uma seta azul marca o final (enqueue) no 47](img/fila.webp)

*Remoção pelo início e inserção pelo final.*

### Implementação ingênua com array

A abordagem mais simples usa um array onde os elementos são inseridos no final e removidos do início. Porém, a cada *dequeue*, **todos os elementos restantes devem ser deslocados** uma posição para a esquerda, resultando em custo $\Theta(n)$.

**FilaArrayIngenua.java**

```java
public class FilaArrayIngenua {

    private int[] dados;
    private int tamanho;

    public FilaArrayIngenua(int capacidade) {
        dados = new int[capacidade];
        tamanho = 0;
    }

    // Enqueue - Theta(1)
    public void enqueue(int valor) {
        if (tamanho == dados.length)
            throw new RuntimeException("Fila cheia");
        dados[tamanho] = valor;
        tamanho++;
    }

    // Dequeue - Theta(n) por causa do deslocamento
    public int dequeue() {
        if (tamanho == 0)
            throw new RuntimeException("Fila vazia");
        int valor = dados[0];
        for (int i = 0; i < tamanho - 1; i++) {
            dados[i] = dados[i + 1];
        }
        tamanho--;
        return valor;
    }

    public int frente() {
        if (tamanho == 0)
            throw new RuntimeException("Fila vazia");
        return dados[0];
    }

    public boolean estaVazia() {
        return tamanho == 0;
    }
}
```

### Implementação com array circular

A solução para eliminar o custo do deslocamento é usar um **array circular**: dois índices, `inicio` e `fim`, avançam circularmente pelo array. Quando um índice ultrapassa a última posição, ele volta ao início por meio da operação módulo. Dessa forma, tanto *enqueue* quanto *dequeue* operam em $\Theta(1)$.

![Array de 7 posições (0 a 6) com os valores 10, 25 e 3 nas posições 2, 3 e 4; inicio=2 e fim=4 marcados acima e uma seta tracejada indicando o wrap-around (i + 1) mod capacidade](img/fila-circular.webp)

*Os índices avançam com $(i + 1) \bmod \text{capacidade}$.*

**FilaArrayCircular.java**

```java
public class FilaArrayCircular {

    private int[] dados;
    private int inicio;
    private int fim;
    private int tamanho;

    public FilaArrayCircular(int capacidade) {
        dados = new int[capacidade];
        inicio = 0;
        fim = -1;
        tamanho = 0;
    }

    // Enqueue - Theta(1)
    public void enqueue(int valor) {
        if (tamanho == dados.length)
            throw new RuntimeException("Fila cheia");
        fim = (fim + 1) % dados.length;
        dados[fim] = valor;
        tamanho++;
    }

    // Dequeue - Theta(1)
    public int dequeue() {
        if (tamanho == 0)
            throw new RuntimeException("Fila vazia");
        int valor = dados[inicio];
        inicio = (inicio + 1) % dados.length;
        tamanho--;
        return valor;
    }

    // Consulta o inicio - Theta(1)
    public int frente() {
        if (tamanho == 0)
            throw new RuntimeException("Fila vazia");
        return dados[inicio];
    }

    public boolean estaVazia() {
        return tamanho == 0;
    }
}
```

## Fila: implementações com listas
Duration: 8:00

### Implementação com lista ligada simples

Usando a classe `ListaLigadaSimples` já implementada: o *enqueue* insere no final (via `tail`, em $\Theta(1)$) e o *dequeue* remove do início (via `head`, em $\Theta(1)$).

**FilaListaSimples.java**

```java
public class FilaListaSimples {

    private ListaLigadaSimples lista;

    public FilaListaSimples() {
        lista = new ListaLigadaSimples();
    }

    // Enqueue - Theta(1)
    public void enqueue(int valor) {
        lista.inserirNoFinal(valor);
    }

    // Dequeue - Theta(1)
    public int dequeue() {
        return lista.removerDoInicio();
    }

    // Consulta o inicio - Theta(1)
    public int frente() {
        return lista.acessar(0);
    }

    public boolean estaVazia() {
        return lista.tamanho() == 0;
    }

    public int tamanho() {
        return lista.tamanho();
    }
}
```

### Implementação com lista duplamente ligada

Com a classe `ListaDuplamenteLigada`, tanto *enqueue* quanto *dequeue* permanecem $\Theta(1)$. A lista dupla não traz vantagem sobre a simples para uma fila padrão, mas é útil caso se deseje uma **fila dupla** (*deque*), que permite inserção e remoção em ambas as extremidades.

**FilaListaDupla.java**

```java
public class FilaListaDupla {

    private ListaDuplamenteLigada lista;

    public FilaListaDupla() {
        lista = new ListaDuplamenteLigada();
    }

    // Enqueue - Theta(1)
    public void enqueue(int valor) {
        lista.inserirNoFinal(valor);
    }

    // Dequeue - Theta(1)
    public int dequeue() {
        return lista.removerDoInicio();
    }

    // Consulta o inicio - Theta(1)
    public int frente() {
        return lista.acessar(0);
    }

    public boolean estaVazia() {
        return lista.tamanho() == 0;
    }

    public int tamanho() {
        return lista.tamanho();
    }
}
```

### Comparação de complexidade — fila

| Operação | Array ingênuo | Array circular | Lista simples | Lista dupla |
| --- | --- | --- | --- | --- |
| Enqueue | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ |
| Dequeue | $\Theta(n)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ |
| Consulta à frente | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ |
| Busca | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ |

## Fila: simulação de atendimento
Duration: 8:00

Um uso cotidiano de filas é o gerenciamento de **atendimento em ordem de chegada**. Em bancos, hospitais, centrais de suporte técnico e *call centers*, os clientes são atendidos na ordem em que chegam — exatamente o comportamento FIFO de uma fila. Sistemas de impressão também funcionam assim: documentos enviados à impressora entram em uma fila e são impressos na ordem de envio.

O exemplo a seguir simula uma central de atendimento. A cada iteração de um laço infinito, sorteia-se aleatoriamente se um novo cliente chega (e entra na fila) ou se o próximo cliente da fila é atendido (e sai). O programa roda indefinidamente até ser interrompido pelo usuário (Ctrl+C). Utilizamos a classe `FilaListaSimples` implementada anteriormente.

**CentralAtendimento.java**

```java
import java.util.Random;

public class CentralAtendimento {

    public static void main(String[] args)
            throws InterruptedException {
        FilaListaSimples fila = new FilaListaSimples();
        Random random = new Random();
        int proximaSenha = 1;

        System.out.println("=== Central de Atendimento ===");
        System.out.println("(Ctrl+C para encerrar)\n");

        while (true) {
            boolean chegaCliente = random.nextBoolean();

            if (chegaCliente) {
                fila.enqueue(proximaSenha);
                System.out.println("[CHEGOU] Cliente "
                    + proximaSenha
                    + " entrou na fila. Tamanho: "
                    + fila.tamanho());
                proximaSenha++;
            } else {
                if (!fila.estaVazia()) {
                    int atendido = fila.dequeue();
                    System.out.println("[ATENDIDO] Cliente "
                        + atendido
                        + " foi atendido. Tamanho: "
                        + fila.tamanho());
                } else {
                    System.out.println("[VAZIA] "
                        + "Nenhum cliente na fila.");
                }
            }

            Thread.sleep(1000);
        }
    }
}
```

Exemplo de uma possível saída (os resultados variam a cada execução, pois dependem do sorteio aleatório):

```text
=== Central de Atendimento ===
(Ctrl+C para encerrar)

[CHEGOU] Cliente 1 entrou na fila. Tamanho: 1
[CHEGOU] Cliente 2 entrou na fila. Tamanho: 2
[ATENDIDO] Cliente 1 foi atendido. Tamanho: 1
[CHEGOU] Cliente 3 entrou na fila. Tamanho: 2
[CHEGOU] Cliente 4 entrou na fila. Tamanho: 3
[ATENDIDO] Cliente 2 foi atendido. Tamanho: 2
[ATENDIDO] Cliente 3 foi atendido. Tamanho: 1
[CHEGOU] Cliente 5 entrou na fila. Tamanho: 2
[VAZIA] Nenhum cliente na fila.
```

Observe que, independentemente da ordem de chegada, os clientes são sempre atendidos na sequência correta: o cliente 1 sai antes do cliente 2, que sai antes do cliente 3. Essa é a garantia fundamental da política FIFO. Cada operação de *enqueue* e *dequeue* é $\Theta(1)$.

## Tabela comparativa geral
Duration: 4:00

As tabelas abaixo reúnem a complexidade de pior caso das operações fundamentais para todas as estruturas discutidas neste codelab.

### Estruturas de dados elementares

| Operação | Array | Lista ligada simples (c/ tail) | Lista duplamente ligada (c/ tail) |
| --- | --- | --- | --- |
| Acesso por índice | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ |
| Inserção no início | $\Theta(n)$ | $\Theta(1)$ | $\Theta(1)$ |
| Inserção no final | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ |
| Remoção no início | $\Theta(n)$ | $\Theta(1)$ | $\Theta(1)$ |
| Remoção no final | $\Theta(1)$ | $\Theta(n)$ | $\Theta(1)$ |
| Busca | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ |

### Pilha

| Operação | Array | Lista simples | Lista dupla |
| --- | --- | --- | --- |
| Push | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ |
| Pop | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ |
| Consulta ao topo | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ |
| Busca | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ |

### Fila

| Operação | Array ingênuo | Array circular | Lista simples | Lista dupla |
| --- | --- | --- | --- | --- |
| Enqueue | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ |
| Dequeue | $\Theta(n)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ |
| Consulta à frente | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ |
| Busca | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ |

## Exercícios: arrays
Duration: 30:00

### Exercícios teóricos

#### Exercício 1 — Rastreando uma sequência de operações

Considere um `ArrayDinamico` com capacidade inicial 4 e tamanho 0. A seguinte sequência de operações é executada:

`inserirNoFinal(10)`, `inserirNoFinal(20)`, `inserirNoInicio(5)`, `inserirNoFinal(30)`, `inserirNoFinal(40)`, `inserirNoFinal(50)`.

Lembre-se de que, quando o array fica cheio, a estratégia de redimensionamento **dobra** a capacidade.

a) Desenhe o estado do array (conteúdo, tamanho e capacidade) após cada operação.

b) Para cada operação, indique quantos deslocamentos ou cópias de elementos foram necessários (inserção no início desloca elementos; redimensionamento copia todos).

c) Em qual operação ocorreu o redimensionamento? Qual era a capacidade antes e depois?

d) Qual foi o custo total (soma de todos os deslocamentos e cópias) da sequência inteira?

#### Exercício 2 — Encontrando o erro

Um programador implementou o seguinte método na classe `ArrayDinamico` para remover todas as ocorrências de um valor $v$:

**Método com erro**

```java
public void removerTodos(int v) {
    for (int i = 0; i < tamanho; i++) {
        if (dados[i] == v) {
            removerNaPosicao(i);
        }
    }
}
```

Considere que `removerNaPosicao(i)` desloca os elementos seguintes para a esquerda e decrementa `tamanho`.

a) Teste mentalmente o método para $A = [3, 7, 3, 3, 5]$ com $v = 3$. Mostre o estado do array e o valor de $i$ a cada iteração do laço. O método funciona corretamente?

b) Identifique o erro e explique por que ele ocorre.

c) Proponha uma correção e reescreva o método corrigido.

#### Exercício 3 — Endereçamento em memória

Um array de inteiros $A$ de tamanho 8 começa no endereço de memória 500. Cada `int` ocupa 4 bytes.

a) Calcule o endereço de memória de $A[0]$, $A[3]$ e $A[7]$.

b) Um programador acessa $A[8]$ por engano. Qual endereço de memória seria lido? Esse endereço pertence ao array?

c) Suponha que imediatamente após $A$ na memória exista uma variável `int x` (no endereço 532). Se o programador executar `A[8] = 99`, o que acontece com o valor de `x`? Como se chama esse tipo de erro?

#### Exercício 4 — Contando comparações

Considere o seguinte método que verifica se um array contém algum valor duplicado:

**Verificação de duplicatas**

```java
public static boolean temDuplicata(int[] A) {
    for (int i = 0; i < A.length; i++) {
        for (int j = i + 1; j < A.length; j++) {
            if (A[i] == A[j]) return true;
        }
    }
    return false;
}
```

a) Para $A = [4, 1, 7, 1, 9]$, em qual par $(i, j)$ o método retorna `true`? Quantas comparações (`A[i] == A[j]`) são feitas até esse ponto?

b) Para $A = [4, 1, 7, 3, 9]$ (sem duplicatas), quantas comparações são feitas no total?

c) Generalize: para um array de tamanho $n$ sem duplicatas, quantas comparações são feitas? Qual é a complexidade assintótica de pior caso?

#### Exercício 5 — Quando o redimensionamento importa

Considere dois cenários para inserir $n = 1000$ elementos no final de um `ArrayDinamico` com capacidade inicial 1:

* **Estratégia A:** quando o array fica cheio, a capacidade é **dobrada**.
* **Estratégia B:** quando o array fica cheio, a capacidade é **aumentada em 1**.

a) Na Estratégia A, quantas vezes ocorre redimensionamento para inserir 1000 elementos? Quais são as capacidades após cada redimensionamento?

b) Na Estratégia A, qual é o número total aproximado de cópias causadas pelos redimensionamentos? (Dica: é a soma $1 + 2 + 4 + 8 + \cdots$)

c) Na Estratégia B, quantas vezes ocorre redimensionamento? Qual é o número total de cópias? (Dica: é a soma $1 + 2 + 3 + \cdots + 999$)

d) Compare os dois totais. Qual estratégia é mais eficiente? Em termos de custo médio por inserção, qual é a ordem de grandeza de cada uma?

### Exercícios práticos

#### Exercício 6 — Remover todas as ocorrências

Com base no problema identificado no Exercício 2, implemente em Java um método correto `removerTodos(int v)` na classe `ArrayDinamico` que remove todas as ocorrências do valor $v$. O método deve funcionar mesmo quando há valores repetidos consecutivos.

Inclua um `main` que teste com $A = [3, 7, 3, 3, 5, 3, 8]$ removendo $v = 3$ e imprima o resultado esperado $[7, 5, 8]$.

#### Exercício 7 — Compactar zeros

Implemente em Java um método `compactarZeros()` na classe `ArrayDinamico` que move todos os zeros para o final do array, mantendo a ordem relativa dos demais elementos. O método deve operar *in-place* (sem criar um novo array).

Por exemplo, $[0, 3, 0, 0, 5, 7, 0, 2]$ deve se tornar $[3, 5, 7, 2, 0, 0, 0, 0]$.

**Dica:** use um índice auxiliar que marca a próxima posição onde um valor diferente de zero deve ser colocado. Percorra o array e, sempre que encontrar um valor diferente de zero, coloque-o na posição marcada e avance o índice.

Inclua um `main` para teste. Qual é a complexidade do seu método?

#### Exercício 8 — Intercalação de dois arrays ordenados

Implemente em Java um método estático `intercalar(int[] A, int[] B)` que recebe dois arrays já ordenados em ordem crescente e retorna um novo array contendo todos os elementos de ambos, também em ordem crescente. O método deve operar em $\Theta(n + m)$, onde $n$ e $m$ são os tamanhos de $A$ e $B$: use dois índices, um para cada array, e a cada passo copie o menor elemento para o array resultado.

Inclua um `main` que teste com $A = [1, 5, 8, 12]$ e $B = [2, 3, 9, 20]$, imprimindo o resultado esperado $[1, 2, 3, 5, 8, 9, 12, 20]$.

#### Exercício 9 — Histograma de notas

Implemente em Java uma classe `Histograma` que recebe um array de inteiros (notas de 0 a 100) e exibe a quantidade de notas em cada faixa de 10 pontos: $[0, 10), [10, 20), \ldots, [90, 100]$.

Use um array de 10 posições como tabela de contagem. A faixa de cada nota deve ser calculada por divisão inteira (sem `if` encadeados). A nota 100 deve ser tratada como pertencente à última faixa $[90, 100]$.

O método `exibir()` deve imprimir cada faixa com sua contagem e uma barra visual feita de caracteres `#`. Exemplo: `[70, 80): 5 #####`.

Inclua um `main` que teste com o array `[85, 42, 73, 91, 68, 55, 100, 37, 78, 62, 90, 44, 71, 88, 59]`.

#### Exercício 10 — Rotação circular

Implemente em Java um método `rotacionar(int k)` na classe `ArrayDinamico` que desloca todos os elementos $k$ posições para a direita de forma circular: o elemento que "sai" pela direita volta pela esquerda.

Por exemplo, $[1, 2, 3, 4, 5]$ com $k = 2$ resulta em $[4, 5, 1, 2, 3]$.

É permitido usar um array auxiliar de tamanho $n$. O método deve funcionar para qualquer $k \geq 0$ (inclusive $k > n$).

**Dica:** para $k > n$, observe que rotacionar $n$ posições retorna ao array original. Portanto, basta considerar $k \bmod n$.

Inclua um `main` que teste com $k = 2$ e com $k = 7$ para um array de 5 elementos.

## Exercícios: listas ligadas
Duration: 30:00

### Lista ligada simples — exercícios teóricos

#### Exercício 1 — Rastreando operações

Considere uma `ListaLigadaSimples` inicialmente vazia (com ponteiros `head` e `tail`). A seguinte sequência de operações é executada:

`inserirNoFinal(10)`, `inserirNoFinal(20)`, `inserirNoInicio(5)`, `inserirNoFinal(30)`, `removerDoInicio()`, `inserirNoInicio(1)`, `removerDoFinal()`.

a) Desenhe o estado da lista (nós com ponteiros) após cada operação, indicando os ponteiros `head` e `tail`.

b) Para cada operação, indique quantos nós foram percorridos (desconsidere a criação do nó em si — conte apenas travessias de ponteiros `proximo`).

c) Qual das operações acima teve o maior custo? Por quê?

#### Exercício 2 — Encontrando o erro

Um programador implementou o seguinte método na classe `ListaLigadaSimples` para inserir um valor na posição $i$:

**Método com erro**

```java
public void inserirNaPosicao(int indice, int valor) {
    No novo = new No(valor);
    No atual = head;
    for (int i = 0; i < indice; i++) {
        atual = atual.proximo;
    }
    novo.proximo = atual.proximo;
    atual.proximo = novo;
    tamanho++;
}
```

a) Teste mentalmente para a lista $[10, 20, 30]$ inserindo o valor 99 na posição 1. Funciona?

b) Teste para inserir na posição 0 (no início da lista). O que acontece?

c) O método atualiza o ponteiro `tail` quando necessário? Identifique todos os casos que faltam ser tratados.

d) Reescreva o método corrigido, tratando todos os casos especiais.

#### Exercício 3 — Contando atualizações de ponteiros

Para cada operação abaixo em uma `ListaLigadaSimples` com $n$ nós e ponteiros `head` e `tail`, indique: (i) quantos ponteiros `proximo` de nós são alterados; (ii) se `head` e/ou `tail` precisam ser atualizados; (iii) a complexidade da operação.

a) Inserir no início.

b) Inserir no final (com `tail`).

c) Remover do início.

d) Remover do final (com `tail`).

e) Remover um nó do meio, dado que já temos referência ao nó anterior a ele.

### Lista ligada simples — exercícios práticos

#### Exercício 4 — Concatenar duas listas

Implemente em Java um método `concatenar(ListaLigadaSimples outra)` na classe `ListaLigadaSimples` que anexa todos os nós de `outra` ao final da lista atual. Após a operação, a lista atual deve conter os elementos de ambas, e a lista `outra` deve ficar vazia. O método deve operar em $\Theta(1)$ (apenas ajuste de ponteiros, sem percorrer nós).

Inclua um `main` que crie a lista $A = [1, 2, 3]$ e $B = [4, 5, 6]$, concatene $B$ ao final de $A$ e imprima o resultado esperado $[1, 2, 3, 4, 5, 6]$. Verifique que $B$ ficou vazia.

#### Exercício 5 — Penúltimo elemento e contagem

Implemente em Java dois métodos na classe `ListaLigadaSimples`:

a) `penultimo()`: retorna o valor do penúltimo nó da lista. Lance exceção se a lista tiver menos de 2 elementos. O método deve percorrer a lista uma única vez.

b) `contarOcorrencias(int valor)`: retorna quantas vezes o valor aparece na lista.

Inclua um `main` que crie a lista $[5, 3, 8, 3, 12, 3, 7]$, imprima o penúltimo (esperado: 3) e o número de ocorrências de 3 (esperado: 3).

### Lista duplamente ligada — exercícios teóricos

#### Exercício 6 — Rastreando operações

Considere uma `ListaDuplamenteLigada` inicialmente vazia (com ponteiros `head` e `tail`). Execute a sequência:

`inserirNoFinal(10)`, `inserirNoFinal(20)`, `inserirNoInicio(5)`, `removerDoFinal()`, `inserirNoFinal(30)`, `removerDoInicio()`.

a) Desenhe o estado da lista após cada operação, mostrando os ponteiros `anterior` e `proximo` de cada nó, além de `head` e `tail`.

b) Compare a operação `removerDoFinal()` desta lista com a mesma operação em uma lista **simples**. Quantos nós são percorridos em cada caso?

#### Exercício 7 — Remoção de nó com referência direta

Na lista duplamente ligada, suponha que você já possua uma referência direta a um nó $x$ no meio da lista (ou seja, não é o primeiro nem o último).

a) Descreva passo a passo como remover $x$ da lista, indicando quais ponteiros devem ser atualizados.

b) Quantas atribuições de ponteiros são necessárias?

c) Qual é a complexidade dessa remoção? Compare com o custo de remover um nó do meio quando se tem apenas o **valor** a ser removido (e é preciso buscá-lo primeiro).

d) Essa remoção em $\Theta(1)$ seria possível em uma lista ligada **simples**, mesmo com a referência ao nó $x$? Explique.

#### Exercício 8 — Travessia bidirecional

Considere uma lista duplamente ligada com os elementos $[2, 7, 4, 9, 1, 8, 3]$ ($n = 7$).

a) Um método precisa acessar o elemento de índice 5. Se ele partir do `head`, quantos nós percorre? E se partir do `tail`?

b) Para quais valores de índice (de 0 a 6) é mais vantajoso partir do `tail`?

c) Escreva, em palavras, o critério que decide de qual extremidade começar a travessia. Esse critério depende do índice solicitado e de qual outra informação?

### Lista duplamente ligada — exercícios práticos

#### Exercício 9 — Imprimir ao contrário

Implemente em Java um método `imprimirReverso()` na classe `ListaDuplamenteLigada` que imprime os elementos da lista do último para o primeiro, separados por `" <-> "`, terminando com `"null"`.

Por exemplo, para a lista $[10, 20, 30, 40]$, a saída deve ser:

```text
40 <-> 30 <-> 20 <-> 10 <-> null
```

O método deve percorrer a lista a partir do `tail` usando os ponteiros `anterior` — sem inverter a lista, sem usar estrutura auxiliar.

Inclua um `main` para teste.

#### Exercício 10 — Trocar dois nós adjacentes

Implemente em Java um método `trocarAdjacentes(int indice)` na classe `ListaDuplamenteLigada` que troca de posição o nó no índice informado com o nó imediatamente seguinte. A troca deve ser feita **alterando ponteiros** (não apenas os valores). Trate o caso em que o índice é inválido ou é o último nó (sem nó seguinte para trocar).

Por exemplo, para a lista $[10, 20, 30, 40]$, chamar `trocarAdjacentes(1)` resulta em $[10, 30, 20, 40]$.

Inclua um `main` que teste a troca no início (índice 0), no meio e em um índice inválido.

## Exercícios: pilhas e filas
Duration: 30:00

### Pilha — exercícios teóricos

#### Exercício 1 — Rastreando operações

Considere uma `PilhaArray` com capacidade 6 e `topo` $= -1$ (vazia). Execute a sequência de operações abaixo. Para cada operação, desenhe o estado do array interno e indique o valor de `topo`.

`push(10)`, `push(20)`, `push(30)`, `pop()`, `push(40)`, `push(50)`, `pop()`, `pop()`, `push(60)`.

a) Qual é o conteúdo do array e o valor de `topo` após cada operação?

b) Quais valores foram retornados pelas chamadas de `pop()`?

c) Após toda a sequência, qual valor seria retornado por um `pop()` adicional?

#### Exercício 2 — Encontrando o erro

Um programador implementou o seguinte método que tenta usar uma pilha para verificar se uma string é um palíndromo (lida igual de trás para frente):

**Método com erro**

```java
public static boolean ehPalindromo(String s) {
    PilhaArray pilha = new PilhaArray(s.length());
    for (int i = 0; i < s.length(); i++) {
        pilha.push(s.charAt(i));
    }
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) != pilha.pop()) {
            return true;
        }
    }
    return false;
}
```

a) Teste mentalmente para a string `"aba"`. Mostre o conteúdo da pilha após os empilhamentos e o que acontece em cada comparação do segundo laço. Qual é o retorno?

b) Teste para a string `"abc"`. Qual é o retorno?

c) Identifique os erros e reescreva o método corrigido.

#### Exercício 3 — Rastreamento de balanceamento

Considere o algoritmo de verificação de balanceamento de delimitadores visto neste codelab. Rastreie sua execução para a expressão `([)]`.

a) Para cada caractere, indique a ação (*push* ou *pop*) e o estado da pilha.

b) Em qual caractere o algoritmo detecta o erro? Explique o que acontece.

c) Modifique a expressão minimamente para torná-la balanceada e mostre o rastreamento da versão corrigida.

#### Exercício 4 — Pilha com mínimo

Suponha que você precise de uma pilha que, além de *push* e *pop*, ofereça uma operação `minimo()` que retorna o menor valor atualmente na pilha — tudo em $\Theta(1)$.

a) Explique por que simplesmente guardar o menor valor em uma variável não é suficiente (considere o que acontece após um `pop()` que remove o mínimo atual).

b) Descreva uma estratégia que utiliza uma **segunda pilha auxiliar** para manter o mínimo atualizado. Explique o que é empilhado na pilha auxiliar a cada *push* e o que acontece a cada *pop*.

c) Rastreie sua estratégia para a sequência: `push(5)`, `push(3)`, `push(7)`, `push(2)`, `pop()`, `pop()`, mostrando o estado das duas pilhas e o valor de `minimo()` após cada operação.

#### Exercício 5 — Avaliação de expressão pós-fixa (teórico)

Considere a expressão infixa $(6 + 2) \times (5 - 3)$.

a) Converta-a para notação pós-fixa.

b) Avalie a expressão pós-fixa passo a passo usando uma pilha: para cada *token*, indique a ação (empilhar ou operar) e o estado da pilha.

c) Qual é o resultado final?

### Pilha — exercícios práticos

#### Exercício 6 — Inverter um array usando pilha

Implemente em Java um método estático `inverter(int[] A)` que recebe um array de inteiros e inverte a ordem dos seus elementos **usando uma pilha**. O método deve empilhar todos os elementos e depois desempilhá-los de volta no array. Use a classe `PilhaArray` deste codelab.

Inclua um `main` que teste com $A = [1, 2, 3, 4, 5]$ e imprima o resultado esperado $[5, 4, 3, 2, 1]$.

#### Exercício 7 — Verificador de tags HTML

Implemente em Java uma classe `VerificadorHTML` que verifica se uma string contendo tags HTML está corretamente aninhada. Considere apenas tags simples no formato `<nome>` (abertura) e `</nome>` (fechamento), sem atributos. A lógica é análoga ao balanceamento de parênteses: ao encontrar uma tag de abertura, empilhe o nome; ao encontrar uma de fechamento, desempilhe e verifique se os nomes coincidem.

Inclua um `main` que teste com:

* `"<html><body><p>texto</p></body></html>"` — válido.
* `"<html><body><p>texto</body></html>"` — inválido (falta `</p>`).

#### Exercício 8 — Avaliador de expressão pós-fixa

Implemente em Java uma classe `AvaliadorPosFixa` que avalia expressões aritméticas em notação pós-fixa. Percorra os *tokens*: se for número, empilhe; se for operador (`+`, `-`, `*`, `/`), desempilhe dois operandos, aplique a operação e empilhe o resultado. Use a classe `PilhaArray` deste codelab.

Inclua um `main` que teste com as expressões `"6 2 + 5 3 - *"` (esperado: 16), `"3 4 + 2 *"` (esperado: 14) e `"8 2 / 3 +"` (esperado: 7).

### Fila — exercícios teóricos

#### Exercício 9 — Rastreando um array circular

Considere uma `FilaArrayCircular` com capacidade 5, `inicio = 0`, `fim = -1`, `tamanho = 0`. Execute a seguinte sequência:

`enqueue(10)`, `enqueue(20)`, `enqueue(30)`, `dequeue()`, `dequeue()`, `enqueue(40)`, `enqueue(50)`, `enqueue(60)`.

a) Para cada operação, mostre o estado do array (5 posições), os valores de `inicio`, `fim` e `tamanho`.

b) Em qual operação o índice `fim` "dá a volta" (*wrap-around*) no array? Qual posição ele assume?

c) Após toda a sequência, quais posições do array estão ocupadas e quais estão livres?

#### Exercício 10 — Encontrando o erro

Um programador implementou a operação `dequeue()` de uma fila circular da seguinte forma:

**Método com erro**

```java
public int dequeue() {
    if (tamanho == 0)
        throw new RuntimeException("Fila vazia");
    int valor = dados[inicio];
    inicio = inicio + 1;
    tamanho--;
    return valor;
}
```

a) Considere uma fila de capacidade 4. Faça *enqueue* de 4 elementos, *dequeue* de 3, e depois *enqueue* de mais 2. Rastreie os valores de `inicio` e `fim` a cada passo. O que acontece?

b) Identifique o erro e explique por que ele causa falha.

c) Reescreva o método corrigido.

#### Exercício 11 — Fila ingênua: contando deslocamentos

Na implementação ingênua de fila com array (sem ser circular), cada *dequeue* desloca todos os elementos restantes uma posição para a esquerda.

a) Se a fila tem $n = 8$ elementos e fazemos 5 operações *dequeue* consecutivas, quantos deslocamentos totais de elementos são realizados?

b) Generalize: se a fila tem $n$ elementos e fazemos $k$ operações *dequeue*, quantos deslocamentos totais são realizados?

c) Compare com a fila circular, onde cada *dequeue* custa $\Theta(1)$. Para $n = 1000$ e $k = 500$, qual é a diferença de operações entre as duas implementações?

### Fila — exercícios práticos

#### Exercício 12 — Intercalar duas filas

Implemente em Java um método estático `intercalar(FilaListaSimples f1, FilaListaSimples f2)` que retorna uma nova fila contendo os elementos de `f1` e `f2` alternados: primeiro um de `f1`, depois um de `f2`, depois um de `f1`, e assim por diante. Se uma fila acabar antes da outra, os elementos restantes da fila maior devem ser adicionados ao final.

Inclua um `main` que teste com $f_1 = [1, 3, 5]$ e $f_2 = [2, 4, 6, 8, 10]$, imprimindo o resultado esperado $[1, 2, 3, 4, 5, 6, 8, 10]$.

#### Exercício 13 — Batata quente

Implemente em Java o jogo da **Batata Quente** usando uma fila. O jogo funciona assim: $n$ crianças ficam em roda. Uma batata é passada de mão em mão. A cada passagem, faça *dequeue* seguido de *enqueue* (a criança volta para o fim da roda). Após $k$ passagens, faça apenas *dequeue* (a criança é eliminada). O jogo continua até sobrar uma, a vencedora.

Inclua um `main` que teste com os nomes `["Ana", "Bruno", "Carla", "Daniel", "Eva"]` e $k = 3$, imprimindo quem é eliminado em cada rodada e quem vence.

## Encerramento
Duration: 2:00

Parabéns! Você estudou arrays, listas ligadas simples e duplamente ligadas, pilhas e filas, simulou suas operações, analisou a complexidade de cada uma e as implementou em Java. As tabelas comparativas do passo anterior resumem quando cada estrutura é a melhor escolha.

### Referências

* CORMEN, Thomas H.; LEISERSON, Charles E.; RIVEST, Ronald L.; STEIN, Clifford. **Introduction to Algorithms**. 4th edition. MIT Press, 2022. Capítulo 10: Elementary Data Structures.
