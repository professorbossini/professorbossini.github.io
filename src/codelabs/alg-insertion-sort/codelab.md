summary: Estude o Insertion Sort no estilo CLRS: pseudocódigo, implementação em Java, prova de corretude por invariante de laço e análise do tempo de execução nos casos melhor, pior e médio.
id: alg-insertion-sort
categories: Algoritmos,Java
tags: analise de algoritmos,ordenacao,insertion sort,invariante de laco,clrs,complexidade,java
status: Published
authors: Rodrigo Bossini
last updated: 2026-03-06
pdf: analise_de_algoritmos/03_apostila_analise_de_algoritmos_insertion_sort.pdf
exercicios: analise_de_algoritmos/03_exercicios_analise_de_algoritmos_insertion_sort.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Insertion Sort: análise de complexidade

## Visão geral
Duration: 3:00

O **Insertion Sort** é um algoritmo de ordenação simples e intuitivo, frequentemente utilizado como primeiro exemplo de análise de algoritmos em cursos de Ciência da Computação. Sua importância reside não apenas em sua utilidade prática para conjuntos pequenos de dados, mas principalmente por ser um excelente veículo pedagógico para compreender conceitos fundamentais como invariante de laço, análise linha a linha e notação assintótica.

A ideia central do Insertion Sort é análoga ao modo como a maioria das pessoas organiza cartas de baralho nas mãos: começa-se com a mão esquerda vazia e as cartas viradas para baixo na mesa. Em seguida, retira-se uma carta por vez da mesa e insere-a na posição correta na mão esquerda. Para encontrar a posição correta de uma carta, compara-se com cada carta já presente na mão, da direita para a esquerda. A qualquer instante, as cartas na mão esquerda estão ordenadas.

Neste codelab, seguiremos a abordagem de Cormen et al. (*Introduction to Algorithms* — CLRS), realizando uma análise rigorosa do algoritmo: apresentaremos o pseudocódigo, provaremos sua corretude via invariante de laço, e calcularemos o tempo de execução nos casos melhor, pior e médio.

### O que você vai aprender

* O pseudocódigo do Insertion Sort no estilo CLRS e sua implementação em Java
* Como provar a corretude de um algoritmo com um **invariante de laço** (inicialização, manutenção e término)
* Como fazer a análise linha a linha do tempo de execução
* Por que o Insertion Sort é $\Theta(n)$ no melhor caso e $\Theta(n^2)$ nos casos pior e médio
* Em que situações o Insertion Sort é uma boa escolha

### O que você vai precisar

* Um JDK instalado (`javac` e `java`)
* Conhecimento das notações $O$, $\Omega$ e $\Theta$

## Pseudocódigo (estilo CLRS)
Duration: 5:00

O pseudocódigo abaixo segue a convenção do CLRS, onde os índices do arranjo começam em 1. A numeração das linhas será usada posteriormente na análise de custo.

**Pseudocódigo: INSERTION-SORT**

```text
1  INSERTION-SORT(A, n)
2    for j = 2 to n
3      chave = A[j]
4      // Insere A[j] na sequencia ordenada A[1..j-1]
5      i = j - 1
6      while i > 0 and A[i] > chave
7        A[i + 1] = A[i]
8        i = i - 1
9      A[i + 1] = chave
```

O procedimento recebe como parâmetros o arranjo $A$ e o número $n$ de elementos a serem ordenados. A cada iteração do laço **for** externo (linhas 2–9), o elemento $A[j]$ é a **chave** que será inserida no subarranjo já ordenado $A[1..j-1]$. O laço **while** interno (linhas 6–8) desloca os elementos maiores que a chave uma posição para a direita, abrindo espaço para a inserção.

## Implementação em Java
Duration: 8:00

A implementação em Java segue fielmente o pseudocódigo apresentado, com a diferença natural de que os índices de arrays em Java começam em 0 (e não em 1 como no CLRS). Abaixo temos uma classe completa com o algoritmo e um método `main` para testes.

**InsertionSort.java**

```java
public class InsertionSort {

    public static void insertionSort(int[] A) {
        int n = A.length;
        for (int j = 1; j < n; j++) {          // linha 2 do pseudocodigo
            int chave = A[j];                   // linha 3
            int i = j - 1;                      // linha 5
            while (i >= 0 && A[i] > chave) {    // linha 6
                A[i + 1] = A[i];                // linha 7
                i = i - 1;                      // linha 8
            }
            A[i + 1] = chave;                   // linha 9
        }
    }

    public static void main(String[] args) {
        int[] A = {5, 2, 4, 6, 1, 3};
        System.out.println("Antes: " + java.util.Arrays.toString(A));
        insertionSort(A);
        System.out.println("Depois: " + java.util.Arrays.toString(A));
    }
}
```

Observe a correspondência direta entre cada linha do código Java e o pseudocódigo CLRS. A única adaptação necessária é o ajuste dos índices: o laço `for` inicia em `j = 1` (correspondente a $j = 2$ no pseudocódigo) e a condição do `while` verifica $i \geq 0$ (correspondente a $i > 0$).

## Corretude: invariante de laço
Duration: 8:00

Seguindo a metodologia do CLRS, provaremos a corretude do Insertion Sort por meio de um **invariante de laço**. Um invariante de laço é uma propriedade que se mantém verdadeira antes de cada iteração do laço. Para provar que o algoritmo está correto, devemos demonstrar três coisas sobre o invariante.

> **Invariante**
>
> No início de cada iteração do laço **for** (indexado por $j$), o subarranjo $A[1..j-1]$ consiste dos elementos que estavam originalmente em $A[1..j-1]$, porém em ordem classificada.

### Inicialização

Antes da primeira iteração do laço, temos $j = 2$. O subarranjo $A[1..j-1] = A[1..1]$ consiste em apenas um elemento, $A[1]$. Um subarranjo com um único elemento está trivialmente ordenado. Além disso, esse elemento é o que estava originalmente em $A[1]$. Portanto, o invariante é satisfeito antes da primeira iteração.

### Manutenção

Suponha que o invariante seja verdadeiro no início de uma iteração, ou seja, $A[1..j-1]$ está ordenado. O corpo do laço **for** move os elementos $A[j-1], A[j-2], \ldots$ uma posição para a direita até encontrar a posição correta para $A[j]$ (armazenado em *chave*). Em seguida, insere *chave* nessa posição. Após essa operação, o subarranjo $A[1..j]$ passa a estar ordenado. Como $j$ é incrementado para a próxima iteração ($j + 1$), o subarranjo $A[1..(j+1)-1] = A[1..j]$ está ordenado, e o invariante continua válido.

### Término

O laço **for** termina quando $j = n + 1$. Substituindo $j$ por $n + 1$ no invariante, obtemos que o subarranjo $A[1..n]$ — ou seja, o arranjo inteiro — consiste dos elementos originais em ordem classificada. Portanto, o algoritmo está correto.

## Análise do tempo de execução
Duration: 12:00

Seguindo o método de Cormen et al., analisaremos o tempo de execução do Insertion Sort contando o número de vezes que cada linha é executada e atribuindo um custo constante a cada execução de linha. Seja $t_j$ o número de vezes que o teste do laço **while** é executado para um dado valor de $j$.

| Linha | Código | Custo | Vezes |
| --- | --- | --- | --- |
| 2 | `for j = 2 to n` | $c_1$ | $n$ |
| 3 | `chave = A[j]` | $c_2$ | $n - 1$ |
| 5 | `i = j - 1` | $c_3$ | $n - 1$ |
| 6 | `while i > 0 and A[i] > chave` | $c_4$ | $\sum_{j=2}^{n} t_j$ |
| 7 | `A[i+1] = A[i]` | $c_5$ | $\sum_{j=2}^{n} (t_j - 1)$ |
| 8 | `i = i - 1` | $c_6$ | $\sum_{j=2}^{n} (t_j - 1)$ |
| 9 | `A[i+1] = chave` | $c_7$ | $n - 1$ |

Na tabela acima, os somatórios $\sum$ são computados para $j$ variando de 2 até $n$. O valor de $t_j$ depende da entrada específica e determina o comportamento do algoritmo. O tempo total de execução $T(n)$ é dado por:

$$T(n) = c_1 n + c_2(n-1) + c_3(n-1) + c_4 \sum_{j=2}^{n} t_j + c_5 \sum_{j=2}^{n} (t_j - 1) + c_6 \sum_{j=2}^{n} (t_j - 1) + c_7(n-1)$$

### Melhor caso: arranjo já ordenado

O melhor caso ocorre quando o arranjo de entrada já está ordenado. Nessa situação, para cada $j$, o teste do **while** na linha 6 falha imediatamente (pois $A[i] \leq chave$), e portanto $t_j = 1$ para todo $j$ de 2 a $n$. O corpo do laço **while** (linhas 7–8) nunca é executado.

Substituindo $t_j = 1$ na expressão de $T(n)$:

$$T(n) = c_1 n + c_2(n-1) + c_3(n-1) + c_4(n-1) + c_7(n-1)$$

$$T(n) = (c_1 + c_2 + c_3 + c_4 + c_7)\,n - (c_2 + c_3 + c_4 + c_7)$$

Essa expressão pode ser escrita na forma $an + b$, onde $a$ e $b$ são constantes que dependem dos custos $c_i$. Portanto, no melhor caso, $T(n)$ é uma função linear de $n$. Em notação assintótica:

$$T(n) = \Theta(n)$$

### Pior caso: arranjo em ordem decrescente

O pior caso ocorre quando o arranjo está em ordem decrescente (inversamente ordenado). Nesse caso, cada novo elemento $A[j]$ deve ser comparado com todos os $j-1$ elementos já ordenados, pois todos são maiores que a chave. Assim, $t_j = j$ para cada $j$ de 2 a $n$.

Precisamos calcular os somatórios. Para $\sum_{j=2}^{n} t_j$:

$$\sum_{j=2}^{n} j = 2 + 3 + \cdots + n = \frac{n(n+1)}{2} - 1$$

Para $\sum_{j=2}^{n} (t_j - 1)$:

$$\sum_{j=2}^{n} (j - 1) = 1 + 2 + \cdots + (n-1) = \frac{n(n-1)}{2}$$

Substituindo na expressão de $T(n)$ e simplificando, obtemos uma expressão da forma $an^2 + bn + c$, onde $a$, $b$ e $c$ são constantes. Portanto, no pior caso, o tempo de execução é uma função quadrática de $n$:

$$T(n) = \Theta(n^2)$$

### Caso médio

No caso médio, consideramos que cada elemento $A[j]$ tem igual probabilidade de ser inserido em qualquer posição do subarranjo $A[1..j-1]$. Na média, metade dos elementos em $A[1..j-1]$ são maiores que $A[j]$, de modo que $t_j = j/2$ em média.

Substituindo $t_j = j/2$ nos somatórios, obtemos:

$$\sum_{j=2}^{n} \frac{j}{2} = \frac{1}{2} \cdot \left[ \frac{n(n+1)}{2} - 1 \right]$$

O resultado ainda é uma função quadrática de $n$, apenas com constantes menores em relação ao pior caso. Portanto, o caso médio também é:

$$T(n) = \Theta(n^2)$$

Esse resultado é fundamental: mesmo no caso médio, o Insertion Sort é quadrático, o que o torna impraticável para grandes conjuntos de dados. Porém, para entradas pequenas (tipicamente $n < 50$), o Insertion Sort é frequentemente mais rápido que algoritmos assintoticamente melhores como Merge Sort, devido às suas constantes menores e à ausência de *overhead* de recursão.

### Resumo da complexidade

| Caso | $t_j$ | Complexidade |
| --- | --- | --- |
| Melhor (ordenado) | $1$ | $\Theta(n)$ |
| Pior (invertido) | $j$ | $\Theta(n^2)$ |
| Médio | $j/2$ | $\Theta(n^2)$ |

## Execução passo a passo e quando utilizar
Duration: 6:00

Para consolidar a compreensão, vamos rastrear a execução do Insertion Sort sobre o arranjo $A = [5, 2, 4, 6, 1, 3]$. A cada iteração, destacamos a chave e o estado do arranjo:

| $j$ | Chave | Estado do arranjo |
| --- | --- | --- |
| — | — | `[5, 2, 4, 6, 1, 3]` (original) |
| 2 | **2** | `[2, 5, 4, 6, 1, 3]` |
| 3 | **4** | `[2, 4, 5, 6, 1, 3]` |
| 4 | **6** | `[2, 4, 5, 6, 1, 3]` |
| 5 | **1** | `[1, 2, 4, 5, 6, 3]` |
| 6 | **3** | `[1, 2, 3, 4, 5, 6]` |

Na iteração $j = 4$, a chave 6 já é maior que todos os elementos à sua esquerda, de modo que nenhum deslocamento é necessário (melhor caso local). Já na iteração $j = 5$, a chave 1 precisa percorrer todo o subarranjo até a primeira posição (pior caso local), realizando 4 comparações e 4 deslocamentos.

### Quando utilizar o Insertion Sort

Apesar de sua complexidade quadrática, o Insertion Sort possui características que o tornam vantajoso em cenários específicos:

* **Entradas pequenas.** Para arranjos com poucas dezenas de elementos, o Insertion Sort é mais rápido que algoritmos como Merge Sort e Quick Sort, pois não possui *overhead* de recursão e tem constantes multiplicativas pequenas. Na prática, implementações híbridas (como o Timsort do Java e Python) utilizam o Insertion Sort para subarranjos pequenos.
* **Entradas quase ordenadas.** Quando o arranjo já está quase ordenado (poucos elementos fora da posição), o Insertion Sort se aproxima do comportamento linear $\Theta(n)$, pois o laço **while** interno realiza poucas iterações.
* **Ordenação estável e *in-place*.** O Insertion Sort é **estável** (preserva a ordem relativa de elementos iguais) e ***in-place*** (utiliza apenas $O(1)$ de memória extra). Essas propriedades são desejáveis em muitas aplicações práticas.
* **Ordenação *online*.** O algoritmo pode ordenar os elementos à medida que os recebe (um por vez), sem necessidade de ter todos os dados disponíveis antecipadamente. Isso o torna adequado para cenários de ordenação *online*.

## Exercícios
Duration: 30:00

### Exercícios teóricos

#### Exercício 1 — Análise de complexidade linha a linha

Considere o algoritmo Insertion Sort aplicado a um arranjo $A$ de tamanho $n$.

a) Realize a análise linha a linha do tempo de execução do Insertion Sort para o arranjo $A = [10, 8, 6, 4, 2]$, preenchendo a tabela abaixo. Indique o valor de $t_j$ (número de execuções do teste do **while**) para cada valor de $j$.

| Linha | Código | Custo | Vezes |
| --- | --- | --- | --- |
| 2 | `for j = 2 to n` | $c_1$ | |
| 3 | `chave = A[j]` | $c_2$ | |
| 5 | `i = j - 1` | $c_3$ | |
| 6 | `while i > 0 and A[i] > chave` | $c_4$ | |
| 7 | `A[i+1] = A[i]` | $c_5$ | |
| 8 | `i = i - 1` | $c_6$ | |
| 9 | `A[i+1] = chave` | $c_7$ | |

b) Com base na tabela preenchida, calcule $T(n)$ em função das constantes $c_i$ e mostre que $T(n) = \Theta(n^2)$ para essa entrada.

c) Explique por que o arranjo $[10, 8, 6, 4, 2]$ representa o pior caso do Insertion Sort e qual é a relação entre a ordem dos elementos e o número de comparações realizadas pelo laço **while**.

### Exercícios práticos

#### Exercício 2 — Implementação com contagem de operações

Implemente em Java uma classe `InsertionSortContador` que realize a ordenação de um arranjo de inteiros utilizando o Insertion Sort e, além de ordenar, conte o número total de **comparações** e o número total de **trocas** (deslocamentos) realizados pelo algoritmo.

O programa deve:

1. Ler um número inteiro positivo $n$ do teclado.
2. Preencher um vetor de tamanho $n$ com valores aleatórios entre 1 e 1000.
3. Exibir o vetor antes da ordenação.
4. Executar o Insertion Sort, contando comparações e deslocamentos.
5. Exibir o vetor após a ordenação, o número de comparações e o número de deslocamentos.

Em seguida, execute o programa para os seguintes cenários e compare os resultados:

* $n = 10$ com vetor já ordenado em ordem crescente.
* $n = 10$ com vetor em ordem decrescente.
* $n = 10$ com vetor aleatório.

Após a implementação, determine a complexidade do algoritmo e expresse-a em notação $\Theta$ para cada cenário.

**Exemplo de entrada e saída:**

Entrada: $n = 5$, vetor gerado: `[34, 12, 45, 7, 23]`

Saída:

```text
Antes: [34, 12, 45, 7, 23]
Depois: [7, 12, 23, 34, 45]
Comparações: 7
Deslocamentos: 5
```

#### Exercício 3 — Insertion Sort em lista encadeada

Implemente em Java uma classe `InsertionSortListaEncadeada` que realize a ordenação de uma lista simplesmente encadeada de inteiros utilizando o algoritmo Insertion Sort. Você deve implementar a lista encadeada manualmente (sem usar `java.util.LinkedList`), definindo a classe interna `No` com os atributos `valor` e `proximo`.

O programa deve:

1. Ler um número inteiro positivo $n$ do teclado.
2. Inserir $n$ valores aleatórios (entre 1 e 100) na lista encadeada.
3. Exibir a lista antes da ordenação.
4. Executar o Insertion Sort adaptado para lista encadeada.
5. Exibir a lista após a ordenação.

**Exemplo de entrada e saída:**

Entrada: $n = 6$

Saída:

```text
Antes: 42 -> 15 -> 78 -> 3 -> 51 -> 27 -> null
Depois: 3 -> 15 -> 27 -> 42 -> 51 -> 78 -> null
```

Após a implementação, analise: a complexidade assintótica no pior caso muda em relação à versão com arranjo? Justifique com base nas operações de acesso e inserção em uma lista encadeada *versus* um arranjo.

## Encerramento
Duration: 2:00

Parabéns! Você estudou o Insertion Sort do pseudocódigo à implementação em Java, provou sua corretude com um invariante de laço e mostrou que ele é $\Theta(n)$ no melhor caso e $\Theta(n^2)$ nos casos pior e médio.

### Referências

* CORMEN, Thomas H.; LEISERSON, Charles E.; RIVEST, Ronald L.; STEIN, Clifford. **Introduction to Algorithms**. 4th edition. MIT Press, 2022. Capítulo 2: Getting Started.
