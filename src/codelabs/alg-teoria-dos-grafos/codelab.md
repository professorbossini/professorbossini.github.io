summary: Conheça os principais conceitos da Teoria dos Grafos: definição formal, função de incidência, vizinhança e grau, loops e arestas paralelas, famílias de grafos e as representações por matriz de incidências, matriz de adjacências e listas de adjacências.
id: alg-teoria-dos-grafos
categories: Algoritmos,Java
tags: analise de algoritmos,teoria dos grafos,grafos,vertices,arestas,bipartido,matriz de adjacencias,lista de adjacencias,java
status: Published
authors: Rodrigo Bossini
last updated: 2025-03-31
pdf: analise_de_algoritmos/07_apostila_analise_de_algoritmos_teoria_dos_grafos.pdf
exercicios: analise_de_algoritmos/07_01_exercicios_teoria_dos_grafos.pdf,analise_de_algoritmos/old/05_exercicios_01_analise_de_algoritmos_teoria_dos_grafos.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Teoria dos Grafos: conceitos e representações

## Visão geral
Duration: 3:00

Neste codelab estudaremos alguns dos principais tópicos da **Teoria dos Grafos**: da intuição por trás dos grafos até as formas de representá-los em um programa de computador.

### O que você vai aprender

* O que são vértices e arestas e como modelar situações do mundo real com grafos
* A definição formal de grafo, a função de incidência, a ordem e o tamanho de um grafo
* Os conceitos de adjacência, vizinhança, grau, loop, arestas paralelas e grafo simples
* Famílias de grafos: completos, vazios, bipartidos, estrelas, caminhos, ciclos, conexos e planares
* As representações por matriz de incidências, matriz de adjacências e listas de adjacências

### O que você vai precisar

* Noções de teoria dos conjuntos
* Um JDK instalado (`javac` e `java`) para os exercícios práticos

## Intuição
Duration: 5:00

Há muitas situações do mundo real que podem ser representadas por um diagrama que consiste de

* pontos
* ligações entre alguns desses pontos

Na Teoria dos Grafos, chamamos os pontos de **vértices** e as ligações entre eles de **arestas**. Veja alguns exemplos.

### Redes sociais

Uma rede social possui usuários que podem ser amigos entre si. O relacionamento amizade é mútuo. Cada pessoa é representada por um vértice e a amizade entre duas pessoas é representada por uma aresta. Veja um diagrama.

![Grafo com os vértices Bia, Ivo, Tom e Eva; arestas ligam Bia a Eva, Ivo a Tom, Ivo a Eva e Tom a Eva](img/p001-1.webp)

*Amizades em uma rede social.*

### Rede de computadores

Uma rede de computadores possui computadores conectados entre si. Cada computador é representado por um vértice e a conexão entre dois computadores é representada por uma aresta. Veja.

![Grafo com o vértice 192.168.0.1 ligado aos vértices 192.168.0.10, 192.168.0.11 e 192.168.0.12](img/p002-1.webp)

*Computadores conectados em rede.*

### Apartamentos de um prédio

Digamos que um prédio possui três andares. Cada andar possui um único apartamento. Um apartamento é constituído de cômodos. Existem portas entre alguns dos cômodos. Neste exemplo, cada andar pode ser representado por um vértice. A possibilidade de se mover de um andar a outro pode ser representada por uma aresta. Além disso, cada cômodo pode ser representado por um vértice e as portas podem ser representadas por arestas. Observe.

![Três andares empilhados; em cada andar, vértices representam os cômodos ligados por portas, e uma aresta vertical liga os andares entre si](img/p003-1.webp)

*Andares e cômodos de um prédio representados como grafo.*

É importante observar que a representação visual (vértices como círculos, por exemplo) ou a forma das arestas (curvas ou retas, por exemplo) não tem real importância.

## Definições formais
Duration: 10:00

Um grafo $G$ é um **par ordenado**

$$G = (V(G), E(G))$$

em que $V(G)$ é seu conjunto de vértices e $E(G)$ é seu conjunto de arestas. Claro, são conjuntos disjuntos entre si.

<aside class="positive">

**Nota.** Em inglês, vértice se escreve **vertex** (plural: **vertices**). Aresta se escreve **edge** (plural: **edges**). Daí as letras escolhidas para representar os conjuntos.

</aside>

Além disso, uma função de incidência

$$\varphi(e) = \{u, v\}$$

associa, a cada aresta $e$ de $G$, um par não ordenado de vértices $u$ e $v$.

O número de vértices de um grafo $G$ pode ser representado como

$$v(G)$$

ou ainda

$$|V(G)|$$

Também vale usar somente a letra **n** para representar o número de vértices de um grafo. Assim

$$v(G) = |V(G)| = n$$

Dizemos que este número é a **ordem** de $G$.

O número de arestas de um grafo $G$ pode ser representado assim

$$e(G)$$

e assim também

$$|E(G)|$$

Também vale usar apenas a letra **m** para representar o número de arestas de um grafo. Assim

$$e(G) = |E(G)| = m$$

Esse número é o **tamanho** de $G$.

<aside class="positive">

**Nota.** Dependendo do contexto, pode ser que estejamos trabalhando com um único grafo e seu nome (na maioria das vezes $G$) esteja implícito. Nestes casos, podemos escrever coisas como $|V|$ e $|E|$ para nos referirmos ao número de vértices e ao número de arestas do grafo em questão, respectivamente.

</aside>

### Exemplo

A título de exemplo, veja a definição de um grafo $G$ a seguir.

$$G = (V(G), E(G))$$

Seu conjunto de vértices é

$$V(G) = \{a, b, c, d, e\}$$

Seu conjunto de arestas é

$$E(G) = \{e_1, e_2, e_3, e_4, e_5, e_6\}$$

E a sua função de incidência

$$\varphi \colon E(G) \to \{\{u, v\} \mid u, v \in V(G)\}$$

é

$$\begin{aligned} \varphi(e_1) &= \{a, b\} \\ \varphi(e_2) &= \{a, c\} \\ \varphi(e_3) &= \{b, c\} \\ \varphi(e_4) &= \{b, d\} \\ \varphi(e_5) &= \{c, e\} \\ \varphi(e_6) &= \{d, e\} \end{aligned}$$

Desta forma, o diagrama que representa $G$ é

![Grafo com os vértices a, b, c, d e e; as arestas e1 (a–b), e2 (a–c), e3 (b–c), e4 (b–d), e5 (c–e) e e6 (d–e)](img/p007-1.webp)

*Diagrama do grafo $G$ definido acima.*

## Adjacência, vizinhança e grau
Duration: 8:00

A fim de simplificar a notação, pode-se também utilizar

$$\varphi(e) = uv$$

em vez de

$$\varphi(e) = \{u, v\}$$

Se $e$ é uma aresta, $u$ e $v$ são vértices tais que

$$\varphi(e) = uv$$

dizemos que $e$ **liga**, **une** ou **conecta** $u$ e $v$. Neste caso, dizemos que $u$ e $v$ são as **extremidades** de $e$. Diz-se que as extremidades de uma aresta são **incidentes** a ela. A aresta também é **incidente** aos vértices que ela conecta. Dois vértices que são incidentes a uma mesma aresta são **adjacentes**. Veja.

![Vértices u e v ligados pela aresta e](img/p008-1.webp)

*$u$ e $v$ são adjacentes.*

Duas arestas $e_1$ e $e_2$ que incidem sobre um mesmo vértice $u$ também são adjacentes. Veja.

![Vértice u ligado a x pela aresta e2 e a v pela aresta e1](img/p008-2.webp)

*As arestas $e_1$ e $e_2$ são adjacentes, pois incidem sobre $u$.*

Dois vértices $u$ e $v$ adjacentes e **distintos entre si** (observe que a definição dada até então não exige $u \neq v$) são **vizinhos**. O conjunto de vizinhos de um vértice $v$ de um grafo $G$ é denotado por

$$N_G(v)$$

Quando o grafo em questão for evidente a partir do contexto, poderemos simplificar escrevendo

$$N(v)$$

em vez de

$$N_G(v)$$

No diagrama a seguir,

$$N_G(v) = \{a, b, c\}$$

e

$$|N_G(v)| = 3$$

Veja.

![Vértice v ligado aos vértices a, b e c](img/p009-3.webp)

*O vértice $v$ tem três vizinhos.*

Também dizemos que o vértice $v$ tem **grau** 3.

## Loops, arestas paralelas e grafos simples
Duration: 5:00

Se uma aresta $e$ tem extremidades $u$ e $v$ idênticas, então $e$ é um **loop**. Para simplificar o entendimento, entenda as letras $u$ e $v$ como rótulos que aplicamos aos vértices. Não necessariamente elas são aplicadas a vértices diferentes. Veja.

![Um único vértice rotulado u e v com uma aresta e que sai e volta a ele](img/p010-1.webp)

*Um loop: a aresta $e$ liga o vértice a ele mesmo.*

Se duas arestas $e_1$ e $e_2$ incidem sobre $u$ e $v$ com $u \neq v$, elas são **paralelas**. Veja.

![Vértices u e v ligados por duas arestas, e1 acima e e2 abaixo](img/p010-2.webp)

*$e_1$ e $e_2$ são arestas paralelas.*

Se um grafo não possui loops nem arestas paralelas, ele é um **grafo simples**.

Um grafo é **finito** se seus conjuntos de vértices e arestas são ambos finitos.

<aside class="positive">

**Nota.** A menos que no contexto apareça uma informação contrária, focaremos os estudos apenas em grafos finitos e simples.

</aside>

Se

$$G = (V(G), E(G))$$

e

$$V(G) = E(G) = \emptyset$$

$G$ é o **grafo nulo**.

Se um grafo possui um único vértice, ele - o grafo - é **trivial**. Qualquer outro grafo é **não trivial**.

## Famílias de grafos: completos, vazios e bipartidos
Duration: 8:00

Há alguns tipos de grafos que se destacam e que pertencem a famílias que levam nomes especiais.

Um grafo é **completo** quando todos os seus vértices são adjacentes entre si. Veja.

![Três grafos completos: um triângulo com a, b e c; um grafo com a, b, c e d em que todos se ligam; e um grafo com a, b, c, d e e em que todos se ligam](img/p011-3.webp)

*Grafos completos com 3, 4 e 5 vértices.*

Um grafo é **vazio** quando não possui aresta alguma. Veja.

![Três vértices a, b e c sem nenhuma aresta](img/p012-1.webp)

*Um grafo vazio.*

Um grafo é **bipartido** se seu conjunto de vértices $V$ pode ser particionado em dois subconjuntos $X$ e $Y$ de tal modo que cada aresta $e$ tenha uma extremidade em $X$ e outra em $Y$. Tal partição

$$(X, Y)$$

é dita uma **bipartição do grafo**, $X$ e $Y$ são as suas **partes** e denotamos o grafo assim

$$G[X, Y]$$

Se

$$G[X, Y]$$

é simples e cada vértice de $X$ é conectado a cada vértice de $Y$, então $G$ é um **grafo bipartido completo**. Veja.

![Vértices x1, x2 e x3 na linha de cima, cada um ligado a todos os vértices y1, y2 e y3 da linha de baixo](img/p013-2.webp)

*Um grafo bipartido completo com partes $\{x_1, x_2, x_3\}$ e $\{y_1, y_2, y_3\}$.*

Uma **estrela** é um grafo bipartido

$$G[X, Y]$$

com

$$|X| = 1$$

ou

$$|Y| = 1$$

Veja.

![Vértice central x1 ligado aos vértices y1, y2, y3, y4 e y5 ao seu redor](img/p014-1.webp)

*Uma estrela: a parte $X$ tem um único vértice.*

Essa família de grafos (os bipartidos em geral) é importante por servir de modelo para inúmeras situações do mundo real. Por exemplo

* **Recomendações em plataformas de streaming.** Aqui, os vértices de uma parte do grafo representam usuários. Os vértices da outra parte representam filmes. Uma aresta representa uma recomendação de um filme feita para um usuário.
* **Alocação de tarefas ou recursos.** Os vértices de uma parte do grafo representam funcionários. Os vértices da outra parte representam tarefas. Uma aresta representa que um funcionário pode representar determinada tarefa.
* **Relacionamento entre autores e publicações.** Os vértices de uma parte do grafo representam autores. Os vértices da outra parte representam publicações. Uma aresta indica que um autor participou da criação de uma publicação.

## Famílias de grafos: caminhos, ciclos, conexos e planares
Duration: 8:00

Um **caminho** (= *path*) é um grafo cujos vértices podem ser organizados numa sequência linear de tal modo que dois vértices são adjacentes se são consecutivos na sequência e não são adjacentes caso contrário. Veja.

![Caminho com os vértices u1, u2, u3 e u4 ligados em sequência](img/p015-1.webp)

*Um caminho $u_1 u_2 u_3 u_4$.*

Da mesma forma, um **ciclo** é um grafo cujos vértices podem ser organizados numa sequência cíclica de tal modo que dois vértices são adjacentes se são consecutivos na sequência e não são adjacentes caso contrário. Observe que um ciclo tem, pelo menos, 3 vértices. Veja.

![Ciclo com os vértices u1, u2, u3 e u4, em que u4 também se liga de volta a u1](img/p015-2.webp)

*Um ciclo com 4 vértices.*

Veja alguns nomes comuns

* 3-ciclo: triângulo
* 4-ciclo: quadrilátero
* 5-ciclo: pentágono
* 6-ciclo: hexágono

O **comprimento** de um caminho ou de um ciclo é igual ao seu número de arestas. Um caminho ou ciclo com **k** arestas é um **k-caminho** ou **k-ciclo**, respectivamente. Um caminho ou ciclo pode ser **par** ou **ímpar**, a depender da paridade de seu comprimento.

Um grafo é **conexo** se, para cada partição de seu conjunto de vértices em dois conjuntos não vazios $X$ e $Y$ existe pelo menos uma aresta com uma extremidade em $X$ e outra em $Y$. Veja.

![Grafo com quatro vértices em que todos estão ligados, direta ou indiretamente, entre si](img/p016-1.webp)

*Um grafo conexo.*

Caso contrário o grafo é **desconexo** ou **"não conexo"**. Veja.

![Parte X com três vértices formando um triângulo e parte Y com dois vértices ligados entre si; uma seta indica que não há arestas entre vértices de X e Y](img/p016-2.webp)

*Um grafo desconexo: não há arestas entre vértices de $X$ e $Y$.*

Um grafo é **planar** se ele pode ter seu diagrama desenhado no plano de tal modo que suas arestas "se encontram" apenas em suas extremidades em comum. Intuitivamente, as suas arestas não se cruzam entre si. Veja.

![Triângulo com três vértices, sem arestas se cruzando](img/p017-1.webp)

*Um grafo planar.*

O grafo a seguir também é planar, muito embora tenha sido desenhado com arestas cruzando-se entre si.

![Grafo com quatro vértices desenhado com duas arestas que se cruzam](img/p017-2.webp)

*Um desenho com cruzamento de arestas.*

Ele é planar pois o seguinte diagrama é equivalente.

![O mesmo grafo redesenhado: a aresta que cruzava, destacada em vermelho tracejado, passa a ser desenhada por fora, em azul, sem cruzamentos](img/p017-3.webp)

*Redesenhando a aresta por fora, nenhum cruzamento é necessário.*

## Representações computacionais
Duration: 12:00

Os diagramas apresentados são intuitivos e ótimos para estudos em alto nível de abstração. Entretanto, não são apropriados para o armazenamento em computadores. Como representar um grafo em um programa de computador, de modo que seja possível executar algoritmos sobre ele? Há algumas formas. Considere o seguinte grafo $G$.

<aside class="positive">

**Nota.** Nesta seção, estamos considerando a existência de grafos com loops e arestas paralelas.

</aside>

![Grafo com os vértices u, v, x, y e z e as arestas a (u–v), b (u–x), c (u–y), d (v–x), e e f (duas arestas paralelas y–z) e g (loop em z)](img/p018-1.webp)

*Grafo $G$ com arestas paralelas ($e$ e $f$) e um loop ($g$).*

### Matriz de incidências

A sua **matriz de incidências**

$$M_G = (m_{ve})$$

é uma matriz $n \times m$ em que

$$m_{ve}$$

é o número de vezes (0, 1 ou 2) que o vértice $v$ e a aresta $e$ incidem entre si. Veja.

| | a | b | c | d | e | f | g |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **u** | 1 | 1 | 1 | 0 | 0 | 0 | 0 |
| **v** | 1 | 0 | 0 | 1 | 0 | 0 | 0 |
| **x** | 0 | 1 | 0 | 1 | 0 | 0 | 0 |
| **y** | 0 | 0 | 1 | 0 | 1 | 1 | 0 |
| **z** | 0 | 0 | 0 | 0 | 1 | 1 | 2 |

### Matriz de adjacências

A sua **matriz de adjacências**

$$A_G = (a_{uv})$$

é uma matriz $n \times n$ em que

$$a_{uv}$$

é o número de arestas que ligam $u$ a $v$, sendo que loops são contados duas vezes. Veja.

| | u | v | x | y | z |
| --- | --- | --- | --- | --- | --- |
| **u** | 0 | 1 | 1 | 1 | 0 |
| **v** | 1 | 0 | 1 | 0 | 0 |
| **x** | 1 | 1 | 0 | 0 | 0 |
| **y** | 1 | 0 | 0 | 0 | 2 |
| **z** | 0 | 0 | 0 | 2 | 2 |

### Listas de adjacências

Quando lidamos com grafos simples, podemos fazer a sua representação usando **listas de adjacências**. Para cada vértice $v$, seus vizinhos são listados em alguma ordem específica. Uma lista de listas desse tipo é uma lista de adjacências de $G$. Considere o grafo a seguir.

![Grafo simples com os vértices u, v, x, y e z e as arestas a (u–v), b (u–x), c (u–y), d (v–x) e e (y–z)](img/p020-2.webp)

*Grafo simples $G$.*

Veja a sua lista de adjacências.

![À esquerda, a lista de vértices u, v, x, y e z; à direita, para cada vértice, uma lista encadeada de vizinhos: u → v → x → y; v → u → x; x → u → v; y → u → z; z → y](img/p020-3.webp)

*Para cada vértice, uma lista de vizinhos.*

**Lista de adjacências**

```text
u: v -> x -> y
v: u -> x
x: u -> v
y: u -> z
z: y
```

## Exercícios teóricos
Duration: 25:00

Esta lista de exercícios tem por objetivo consolidar os conceitos de vértices, arestas, função de incidência, famílias de grafos e as três representações computacionais usuais: matriz de incidências, matriz de adjacências e listas de adjacências.

### Exercício 1 — Identificação dos elementos de um grafo

Considere o grafo $G$ representado pelo diagrama abaixo.

![Grafo com os vértices a, b, c, d e e e as arestas e1 (a–b), e2 (b–c), e3 (a–e), e4 (e–d), e5 (c–d), e6 (b–d) e e7 (a–c, curva)](img/exercicio-1.webp)

*Grafo $G$ do Exercício 1.*

Responda os seguintes itens:

a) Determine o conjunto de vértices $V(G)$ e o conjunto de arestas $E(G)$.

b) Escreva a função de incidência $\varphi$ de $G$, listando $\varphi(e_i)$ para cada aresta $e_i \in E(G)$, utilizando a notação simplificada $\varphi(e) = uv$.

c) Indique a ordem $|V(G)|$ e o tamanho $|E(G)|$ do grafo.

d) Liste o conjunto de vizinhos $N_G(b)$ e o conjunto de vizinhos $N_G(d)$. Em seguida, indique o grau de cada vértice de $G$.

e) O grafo $G$ é simples? Justifique sua resposta com base na definição (ausência de loops e de arestas paralelas).

f) O grafo $G$ é conexo? Justifique sua resposta exibindo, caso seja conexo, um caminho entre $a$ e $d$; caso seja desconexo, exiba uma partição $(X, Y)$ do conjunto de vértices que demonstre isso.

g) $G$ é completo? Justifique. Se não for, indique um par de vértices não adjacentes.

### Exercício 2 — Representações computacionais

Considere um grafo simples $H$ cujo conjunto de vértices é $V(H) = \{u_1, u_2, u_3, u_4, u_5\}$ e cuja matriz de adjacências $A_H = (a_{ij})$ é dada a seguir.

| | $u_1$ | $u_2$ | $u_3$ | $u_4$ | $u_5$ |
| --- | --- | --- | --- | --- | --- |
| $u_1$ | 0 | 1 | 1 | 0 | 1 |
| $u_2$ | 1 | 0 | 1 | 1 | 0 |
| $u_3$ | 1 | 1 | 0 | 0 | 0 |
| $u_4$ | 0 | 1 | 0 | 0 | 1 |
| $u_5$ | 1 | 0 | 0 | 1 | 0 |

Responda os seguintes itens:

a) Desenhe um diagrama que represente o grafo $H$. Lembre-se de que a posição geométrica dos vértices não é relevante — apenas as adjacências importam.

b) Liste o conjunto de arestas $E(H)$ usando pares não ordenados de vértices. Em seguida, indique a ordem e o tamanho de $H$.

c) Construa a lista de adjacências de $H$, listando os vizinhos de cada vértice em ordem crescente de índice (por exemplo, $N(u_1) = (u_2, u_3, u_5)$).

d) Indique o grau de cada vértice. Em seguida, calcule a soma $\sum_{v \in V(H)} \text{grau}(v)$ e verifique se essa soma é igual a $2 \cdot |E(H)|$. Explique brevemente, em palavras, por que essa igualdade sempre vale para qualquer grafo.

e) $H$ é um grafo bipartido? Para responder, tente construir uma bipartição $(X, Y)$ de $V(H)$ tal que toda aresta tenha uma extremidade em $X$ e outra em $Y$. Caso seja possível, exiba a bipartição; caso seja impossível, justifique exibindo um ciclo de comprimento ímpar em $H$.

f) $H$ é completo? E é um caminho? E um ciclo? Justifique cada resposta com base nas definições apresentadas neste codelab.

## Exercícios práticos
Duration: 30:00

### Exercício 3 — Implementação de grafo com matriz de adjacências

Implemente em Java uma classe `GrafoMatriz` que represente um grafo **simples** (sem loops e sem arestas paralelas) e **não direcionado** utilizando uma matriz de adjacências interna.

A classe deve possuir:

* Um construtor `GrafoMatriz(int n)` que recebe o número de vértices $n$ e cria internamente uma matriz $n \times n$ inicializada com zeros. Os vértices são identificados pelos índices $0, 1, \ldots, n - 1$.
* Um método `adicionarAresta(int u, int v)` que insere a aresta $\{u, v\}$ no grafo. Como o grafo é não direcionado, a operação deve atualizar tanto a posição $(u, v)$ quanto a posição $(v, u)$ da matriz. O método deve **rejeitar** tentativas de inserir loops (quando $u = v$) e tentativas de inserir uma aresta que já exista, exibindo uma mensagem informativa em ambos os casos.
* Um método `removerAresta(int u, int v)` que remove a aresta $\{u, v\}$, atualizando ambas as posições simétricas da matriz.
* Um método `ehAdjacente(int u, int v)` que retorna `true` se existe uma aresta entre $u$ e $v$, e `false` caso contrário.
* Um método `grau(int v)` que retorna o grau do vértice $v$, calculado como o número de uns na linha $v$ da matriz.
* Um método `imprimirMatriz()` que exibe a matriz de adjacências no formato tabular, com cabeçalhos de linha e coluna indicando os índices dos vértices.

No método `main`, construa o grafo $G$ exibido a seguir, identificando os vértices $a, b, c, d, e$ pelos índices $0, 1, 2, 3, 4$, respectivamente.

![Grafo com os vértices a, b, c, d e e e as arestas a–b, b–c, a–c, c–d, d–e e e–a](img/exercicio-3.webp)

*Grafo $G$ do Exercício 3.*

Após construir o grafo, faça o programa:

1. Imprimir a matriz de adjacências.
2. Imprimir o grau de cada um dos cinco vértices.
3. Verificar e exibir se os pares $(a, c)$, $(b, e)$ e $(b, d)$ são adjacentes.
4. Tentar adicionar a aresta $\{a, b\}$ novamente e exibir a mensagem de rejeição da operação.
5. Tentar adicionar um loop no vértice $c$ (ou seja, $\{c, c\}$) e exibir a mensagem de rejeição.
6. Remover a aresta $\{a, c\}$ e imprimir novamente a matriz, mostrando que a posição correspondente foi zerada simetricamente.

**Saída esperada (resumida):** a matriz inicial deve ter exatamente 12 uns (6 arestas $\times 2$); após a remoção da aresta $\{a, c\}$, a matriz deve apresentar 10 uns. Os graus dos vértices na configuração inicial devem ser $\text{grau}(a) = 3$, $\text{grau}(b) = 2$, $\text{grau}(c) = 3$, $\text{grau}(d) = 2$, $\text{grau}(e) = 2$.

### Exercício 4 — Implementação de grafo com lista de adjacências

Implemente em Java uma classe `GrafoLista` que represente um grafo **simples** e **não direcionado** utilizando, internamente, um arranjo de listas encadeadas (uma lista de vizinhos para cada vértice). Você deve utilizar a classe `java.util.LinkedList` da biblioteca padrão, criando um arranjo `LinkedList<Integer>[] listas` de tamanho $n$.

A classe deve possuir:

* Um construtor `GrafoLista(int n)` que recebe o número de vértices $n$ e inicializa o arranjo de listas. Cada posição do arranjo deve ser inicializada com uma `LinkedList<Integer>` vazia. Os vértices são identificados pelos índices $0, 1, \ldots, n - 1$.
* Um método `adicionarAresta(int u, int v)` que insere a aresta $\{u, v\}$. Como o grafo é não direcionado, $v$ deve ser inserido na lista de $u$ e $u$ deve ser inserido na lista de $v$. O método deve rejeitar loops e a inserção de uma aresta já existente, com mensagem informativa em ambos os casos.
* Um método `vizinhos(int v)` que retorna a lista de vizinhos do vértice $v$ (ou seja, retorna a `LinkedList<Integer>` associada a $v$).
* Um método `grau(int v)` que retorna o grau do vértice $v$, definido como o tamanho da sua lista de vizinhos.
* Um método `imprimirListaAdjacencias()` que exibe, para cada vértice, sua lista de vizinhos no formato:

```text
0 -> 1 -> 2 -> 4
1 -> 0 -> 2 -> 3
...
```

* Um método `ehCompleto()` que retorna `true` se o grafo for completo, isto é, se todos os pares de vértices distintos forem adjacentes. Use a propriedade de que um grafo simples com $n$ vértices é completo se e somente se cada vértice tem grau $n - 1$.

No método `main`:

1. Construa um grafo $G_1$ com 5 vértices ($0, 1, 2, 3, 4$) e as seguintes arestas: $\{0, 1\}, \{0, 2\}, \{0, 4\}, \{1, 2\}, \{1, 3\}, \{3, 4\}$. Imprima a lista de adjacências, o grau de cada vértice e o resultado de `ehCompleto()`.
2. Construa um grafo $G_2$ com 4 vértices que seja completo (ou seja, com todas as $\binom{4}{2} = 6$ arestas possíveis). Imprima a lista de adjacências, o grau de cada vértice (que deve ser 3 em todos os vértices) e o resultado de `ehCompleto()`.
3. Construa um grafo $G_3$ com 4 vértices que represente um 4-ciclo (quadrilátero), com arestas $\{0, 1\}$, $\{1, 2\}$, $\{2, 3\}$ e $\{3, 0\}$. Imprima a lista de adjacências, verifique que o grau de cada vértice é 2 e mostre que `ehCompleto()` retorna `false`.

**Saída esperada para $G_1$:**

```text
Lista de adjacências de G1:
0 -> 1 -> 2 -> 4
1 -> 0 -> 2 -> 3
2 -> 0 -> 1
3 -> 1 -> 4
4 -> 0 -> 3
Graus: [3, 3, 2, 2, 2]
G1 é completo? false
```

## Exercícios extras: vizinhança e função de incidência
Duration: 20:00

Estes dois exercícios vêm de uma lista de 2025 e também exercitam a representação de grafos em Java.

### Vizinhos e grau com lista de adjacências

Implemente uma classe em Java que represente um grafo simples e não direcionado utilizando uma lista de adjacências com a estrutura `LinkedList<Integer>` para armazenar os vizinhos de cada vértice. O programa deve ler o grafo da entrada padrão e, para cada vértice $v$, produzir:

* O conjunto de vizinhos $N(v)$
* O grau de $v$

**Entrada**

* Um número inteiro $n$ representando o número de vértices (numerados de 0 a $n - 1$).
* Um número inteiro $m$ representando o número de arestas.
* Em seguida, $m$ linhas com dois inteiros $u$ e $v$, indicando que existe uma aresta entre os vértices $u$ e $v$.

**Saída**

Para cada vértice $v$, o programa deve imprimir os vizinhos $N(v)$ e o grau do vértice, no formato:

```text
N(v) = [...], grau = k
```

**Exemplo — entrada:**

```text
4
4
0 1
0 2
1 2
2 3
```

**Saída esperada:**

```text
N(0) = [1, 2], grau = 2
N(1) = [0, 2], grau = 2
N(2) = [0, 1, 3], grau = 3
N(3) = [2], grau = 1
```

### Função de incidência com Map

Implemente uma classe em Java para representar um grafo simples e não direcionado, em que cada aresta possui um identificador textual. Utilize um objeto do tipo `Map<String, Set<Integer>>` para armazenar a função de incidência $\varphi$, cuja finalidade é associar cada aresta ao conjunto dos dois vértices que ela conecta. O programa deve ler as arestas da entrada padrão e, ao final, exibir a função de incidência $\varphi$, considerando que $\varphi(e) = \{u, v\}$ representa que a aresta $e$ liga os vértices $u$ e $v$.

**Entrada**

* Um número inteiro $m$ representando a quantidade de arestas.
* Em seguida, $m$ linhas contendo uma string $e$ (identificador da aresta) e dois inteiros $u$ e $v$, indicando que a aresta $e$ conecta os vértices $u$ e $v$.

**Saída**

Para cada aresta, exiba a função de incidência no formato:

```text
phi(e) = {u, v}
```

**Exemplo — entrada:**

```text
3
e1 0 1
e2 0 2
e3 1 3
```

**Saída esperada:**

```text
phi(e1) = {0, 1}
phi(e2) = {0, 2}
phi(e3) = {1, 3}
```

## Encerramento
Duration: 2:00

Parabéns! Você conheceu os conceitos fundamentais da Teoria dos Grafos — definição formal, incidência, adjacência, vizinhança, grau, as principais famílias de grafos — e as três formas usuais de representar um grafo em um programa: matriz de incidências, matriz de adjacências e listas de adjacências.

### Referências

* BONDY, J. A.; MURTY, U. S. R. **Graph theory**. New York: Springer, 2008. (Graduate Texts in Mathematics, v. 244).
* CORMEN, Thomas H. et al. **Introduction to Algorithms**. 3. ed. Cambridge: MIT Press, 2009.
* FEOFILOFF, Paulo. **Análise de Algoritmos**. Disponível em: [https://www.ime.usp.br/~pf/analise_de_algoritmos/](https://www.ime.usp.br/~pf/analise_de_algoritmos/). Acesso em: março de 2025.
* KLEINBERG, Jon; TARDOS, Éva. **Algorithm Design**. Boston: Pearson, 2006.
