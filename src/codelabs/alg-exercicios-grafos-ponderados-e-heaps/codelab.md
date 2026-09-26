summary: Listas de exercícios práticos sobre grafos ponderados e heaps: caminhos mínimos com Dijkstra e Bellman-Ford, árvores geradoras mínimas com Kruskal e Prim, fila de prioridades com heap e Dijkstra com heap implementado à mão, em Java.
id: alg-exercicios-grafos-ponderados-e-heaps
categories: Algoritmos,Java
tags: analise de algoritmos,exercicios,grafos,dijkstra,bellman-ford,kruskal,prim,heap,fila de prioridades,java
status: Published
authors: Rodrigo Bossini
last updated: 2025-05-26
pdf: analise_de_algoritmos/old/06_exercicios_analise_de_algoritmos_teoria_dos_grafos_dijkstra.pdf
exercicios: analise_de_algoritmos/old/07_exercicios_analise_de_algoritmos_teoria_dos_grafos_bellmanford.pdf,analise_de_algoritmos/old/08_exercicios_analise_de_algoritmos_teoria_dos_grafos_kruskal_prim.pdf,analise_de_algoritmos/old/09_exercicios_analise_de_algoritmos_heapsort.pdf,analise_de_algoritmos/old/10_exercicios_analise_de_algoritmos_heap_miqueue_dijkstra.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Exercícios: caminhos mínimos, árvores geradoras e heaps

## Visão geral
Duration: 3:00

Este codelab reúne cinco listas de exercícios práticos da disciplina de Análise de Algoritmos sobre **grafos ponderados** e **heaps**. Elas partem das soluções desenvolvidas em aula e pedem adaptações e novas implementações em Java.

### O que você vai praticar

* Caminhos mínimos a partir de uma única origem com o algoritmo de **Dijkstra**
* Caminhos mínimos com pesos negativos e detecção de ciclos negativos com **Bellman-Ford**
* Árvores geradoras mínimas com **Kruskal** (com *path compression* e *union by rank*) e **Prim**
* Filas de prioridades implementadas com **heap**, como no livro do Cormen
* Dijkstra com fila de prioridades baseada em heap, implementada manualmente e com `PriorityQueue`

### O que você vai precisar

* Um JDK instalado (`javac` e `java`)
* Uma cópia das soluções vistas em aula, disponíveis no repositório [https://github.com/professorbossini/20251_maua_cic401](https://github.com/professorbossini/20251_maua_cic401)
* Conhecimento de grafos, busca em grafos e da notação assintótica

<aside class="positive">

Visite o repositório acima para obter uma cópia da solução em que você vai basear as soluções dos exercícios propostos em cada passo.

</aside>

## Dijkstra: exibindo os caminhos mínimos
Duration: 25:00

Base: a implementação do algoritmo de Dijkstra do repositório [https://github.com/professorbossini/20251_maua_cic401](https://github.com/professorbossini/20251_maua_cic401).

### Exercício 1

Adapte o programa fazendo com que cada caminho mínimo seja exibido no seguinte formato:

```text
a ->(p1) b ->(p2) -> c
```

Neste exemplo, `a`, `b` e `c` são vértices. `p1` e `p2` são os pesos das arestas que ligam o vértice `a` ao vértice `b` e o vértice `b` ao vértice `c`, respectivamente.

### Exercício 2

O programa mostra os menores caminhos a partir de um único vértice escolhido como origem. Adapte-o para que ele calcule e mostre os menores caminhos a partir de cada vértice do grafo.

## Bellman-Ford
Duration: 30:00

Base: a implementação do algoritmo de Bellman-Ford do repositório [https://github.com/professorbossini/20251_maua_cic401](https://github.com/professorbossini/20251_maua_cic401).

### Exercício 1

Execute o algoritmo de Bellman-Ford para o seguinte grafo.

![Grafo dirigido com os vértices s, t, x, y e z; s tem estimativa 0 e os demais infinito; arestas s→t (6), s→y (7), t→x (5), x→t (−2), t→y (8), t→z (−4), y→x (−3), y→z (9), z→x (7) e z→s (2)](img/bellman-ford-grafo.webp)

*Grafo do Exercício 1: a origem é $s$, com $d[s] = 0$ e $d[v] = \infty$ para os demais vértices.*

### Exercício 2

Adapte o algoritmo para que, caso um ciclo de peso negativo a partir da fonte seja encontrado, ele seja exibido.

### Exercício 3

Adapte o algoritmo para que ele exiba os menores caminhos tendo como fonte cada um dos vértices do grafo.

## Kruskal e Prim
Duration: 30:00

Base: a implementação do algoritmo de Kruskal do repositório [https://github.com/professorbossini/20251_maua_cic401](https://github.com/professorbossini/20251_maua_cic401).

### Exercício 1

Aprimore o algoritmo de Kruskal visto em aula, aplicando as técnicas **Path Compression** e **Union By Rank** do capítulo 21 do livro do Cormen.

### Exercício 2

Implemente o algoritmo de Prim.

## Heap: fila de prioridades
Duration: 30:00

Base: as soluções do repositório [https://github.com/professorbossini/20251_maua_cic401](https://github.com/professorbossini/20251_maua_cic401).

### Exercício 1

Os algoritmos a seguir envolvem o uso de uma estrutura de dados **Heap** para fazer a implementação de uma **fila de prioridades**, tal como descrito no livro do Cormen. Faça a sua implementação em Java.

**Pseudocódigo: HEAP-MAXIMUM(A)**

```text
1  return A[1]
```

**Pseudocódigo: HEAP-EXTRACT-MAX(A)**

```text
1  if A.heap-size < 1
2      error "heap underflow"
3  max = A[1]
4  A[1] = A[A.heap-size]
5  A.heap-size = A.heap-size - 1
6  MAX-HEAPIFY(A, 1)
7  return max
```

**Pseudocódigo: HEAP-INCREASE-KEY(A, i, key)**

```text
1  if key < A[i]
2      error "new key is smaller than current key"
3  A[i] = key
4  while i > 1 and A[PARENT(i)] < A[i]
5      exchange A[i] with A[PARENT(i)]
6      i = PARENT(i)
```

**Pseudocódigo: MAX-HEAP-INSERT(A, key)**

```text
1  A.heap-size = A.heap-size + 1
2  A[A.heap-size] = -∞
3  HEAP-INCREASE-KEY(A, A.heap-size, key)
```

<aside class="positive">

Nesses algoritmos, o heap é um vetor $A[1..n]$ em que $\text{PARENT}(i) = \lfloor i/2 \rfloor$, e MAX-HEAPIFY restaura a propriedade de heap de máximo a partir de uma posição. Com isso, HEAP-MAXIMUM custa $\Theta(1)$ e as demais operações custam $O(\lg n)$.

</aside>

## Dijkstra com heap
Duration: 30:00

Base: as soluções do repositório [https://github.com/professorbossini/20251_maua_cic401](https://github.com/professorbossini/20251_maua_cic401).

### Exercício 1

Uma empresa de logística quer transportar um item entre duas regiões da cidade utilizando rotas previamente mapeadas. A cidade é representada por um **grafo direcionado**, em que as regiões são os vértices e as vias entre elas são arestas com **pesos positivos**, representando o custo de deslocamento (tempo, distância, ou outro critério).

Para encontrar a melhor rota, a empresa precisa de um programa que calcule o caminho de menor custo entre uma região de origem e uma região de destino.

**O que o programa deve fazer:**

* Ler os dados do grafo: cada linha informa uma ligação entre duas regiões e o custo dessa ligação.
* Construir um grafo direcionado.
* Solicitar a região de origem e a região de destino.
* Calcular o caminho de menor custo entre origem e destino utilizando o algoritmo de Dijkstra.
* Implementar a fila de prioridade com base em heap **manualmente** (sem usar bibliotecas prontas como `PriorityQueue`). Use o que fizemos em aula.
* Exibir:
  * O caminho encontrado (na ordem correta, da origem ao destino).
  * O custo total do caminho.

**Entrada esperada:**

* Um número inteiro representando o número de vias (arestas).
* Em seguida, para cada via: uma linha com três valores: `regiao_origem regiao_destino custo`
* Depois, duas linhas com os nomes da região de origem e da região de destino.

**Saída esperada:**

* O caminho de menor custo entre origem e destino.
* O custo total do caminho.

### Exercício 2

Refaça usando `PriorityQueue` da API do Java.

## Encerramento
Duration: 2:00

Parabéns! Com estas listas você praticou os principais algoritmos sobre grafos ponderados — Dijkstra, Bellman-Ford, Kruskal e Prim — e a implementação de filas de prioridades com heap, peça-chave para deixar o Dijkstra eficiente.

### Referências

* BONDY, J. A.; MURTY, U. S. R. **Graph theory**. New York: Springer, 2008. (Graduate Texts in Mathematics, v. 244).
* CORMEN, Thomas H. et al. **Introduction to Algorithms**. 3. ed. Cambridge: MIT Press, 2009.
* FEOFILOFF, Paulo. **Análise de Algoritmos**. Disponível em: [https://www.ime.usp.br/~pf/analise_de_algoritmos/](https://www.ime.usp.br/~pf/analise_de_algoritmos/). Acesso em: março de 2025.
* KLEINBERG, Jon; TARDOS, Éva. **Algorithm Design**. Boston: Pearson, 2006.
