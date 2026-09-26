summary: Revisão dos conceitos básicos da modelagem de dados com a abordagem entidade-relacionamento: entidades, relacionamentos, auto-relacionamentos, papéis e cardinalidades mínima e máxima.
id: pg-modelagem-er-cardinalidade
categories: Bancos de Dados
tags: modelagem,entidade-relacionamento,der,cardinalidade,banco-de-dados
status: Published
authors: Rodrigo Bossini
last updated: 2022-02-07
pdf: postgresql/01_apostila_pbd_revisao_modelagem_er_entidade_relacionamento_cardinalidade.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Modelagem ER: entidades, relacionamentos e cardinalidade

## Visão geral
Duration: 3:00

Este material mostra uma breve revisão sobre os principais conceitos da modelagem de dados baseada na abordagem entidade-relacionamento.

### O que você vai aprender

* O que são banco de dados, SGBD, SGBDR, modelo de dados, modelo conceitual e modelo lógico
* As três fases do projeto de um banco de dados: modelagem conceitual, projeto lógico e projeto físico
* O que são entidades, ocorrências de entidade e relacionamentos
* Como ler um diagrama de ocorrências
* O que são auto-relacionamentos e papéis de entidade em relacionamento
* Como especificar cardinalidades máxima (1x1, 1xN, NxN) e mínima

### O que você vai precisar

* Papel e lápis (ou uma ferramenta de desenho de diagramas) para fazer os exercícios propostos ao longo do caminho

## Definições
Duration: 6:00

Façamos, antes de mais nada, algumas definições.

> **Banco de Dados**
>
> Um conjunto de dados integrados que tem por objetivo atender a uma comunidade de usuários.

> **Sistema Gerenciador de Banco de Dados (SGBD)**
>
> Um software que incorpora as funções de definição, recuperação e alteração de dados em um banco de dados.

> **Sistema Gerenciador de Banco de Dados Relacional (SGBDR)**
>
> Um SGBD cujo modelo de dados é, como o nome sugere, o relacional (baseado em tabelas).

> **Modelo de Dados**
>
> Uma descrição formal da estrutura de um banco de dados.

> **Abordagem de Modelagem**
>
> Um conjunto de conceitos usados para construir modelos.

> **Modelo Conceitual**
>
> Um modelo de dados abstrato que descreve a estrutura de um banco de dados de forma independente de um SGBD particular.

> **Modelo Lógico**
>
> Um modelo de dados que representa a estrutura de dados de um banco de dados conforme vista pelo usuário de um SGBD.

O projeto de um novo banco de dados pode ser realizado em três fases:

* **Modelagem conceitual**: aqui um modelo conceitual é construído, utilizando uma abordagem de modelagem escolhida.
* **Projeto lógico**: aqui visamos obter um modelo lógico em função do modelo conceitual previamente obtido. Lembre-se que o modelo lógico traz informações sobre como o banco de dados será implementado no SGBD escolhido.
* **Projeto físico**: nesta fase, o modelo do banco de dados é enriquecido com detalhes que influenciam no desempenho do banco de dados, mas não interferem em sua funcionalidade. Em geral, é um processo contínuo feito quando o banco de dados já está em funcionamento. É comum associar a esta fase o nome **sintonia** (*tuning*) de banco de dados.

## Entidades
Duration: 6:00

O mundo é repleto de coisas que se relacionam. Descrever um banco de dados consiste em observar quais coisas e potenciais relações do mundo real são de interesse. Por meio deste processo, obtemos algo chamado "mini mundo" por muitos autores. As descrições conceituais que faremos serão baseadas na abordagem entidade-relacionamento, em que os detalhes do mini mundo desejados são representados, como o nome sugere, por entidades e relacionamentos entre elas.

Quando a abordagem entidade-relacionamento é aplicada, o produto obtido é um **modelo entidade-relacionamento**. Quando desejamos representar o modelo obtido graficamente, fazemos a construção de um **diagrama entidade-relacionamento**.

> **Entidade**
>
> Um conjunto de objetos da realidade modelada sobre os quais deseja-se manter informações no banco de dados.

A figura a seguir mostra dois exemplos de entidade.

![Duas entidades representadas por retângulos: Pessoa e Departamento](img/p002-1.webp)

*Figura 3.1: exemplos de entidade.*

### Exercício

Escreva o nome de cinco entidades do mundo real. Faça também a sua representação gráfica.

Lembre-se que uma entidade representa um conjunto de objetos. Serve para descrever as suas propriedades. Considerando a entidade Pessoa como exemplo, ela descreve características que as pessoas têm. Quando desejamos nos referir a uma pessoa específica (que se chama José e tem 19 anos, por exemplo), utilizamos as expressões **ocorrência de entidade** ou **instância de entidade**.

**Exercício.** Identifique 5 entidades no mundo real e faça a sua representação gráfica.

## Relacionamentos e diagrama de ocorrências
Duration: 6:00

> **Relacionamento**
>
> Um conjunto de associações entre ocorrências de entidades.

A figura a seguir mostra um exemplo de relacionamento.

![As entidades Pessoa e Departamento ligadas pelo relacionamento Lotação, representado por um losango](img/p003-1.webp)

*Figura 3.2: exemplo de relacionamento.*

### Exercício

Identifique três relacionamentos entre entidades do mundo real. Faça a representação gráfica de cada um, incluindo as entidades envolvidas.

### Diagrama de ocorrências

Embora não faça parte da modelagem, um diagrama de ocorrências pode ter grande utilidade didática. Veja um exemplo na figura a seguir.

![Diagrama de ocorrências: pessoas e1 a e8 ligadas, por meio de ocorrências do relacionamento Lotação, aos departamentos d1 a d4](img/p003-2.webp)

*Figura 3.3: diagrama de ocorrências do relacionamento Lotação.*

### Exercício

Escolha dois relacionamentos que você identificou no exercício anterior e faça um diagrama de ocorrências para cada um deles.

## Auto-relacionamento e papéis
Duration: 5:00

Não necessariamente um relacionamento associa ocorrências de entidades diferentes. Quando um relacionamento associa ocorrências de uma mesma entidade, temos um **auto-relacionamento**. É importante, neste caso, destacar o papel de cada ocorrência de entidade no relacionamento.

> **Papel de entidade em relacionamento**
>
> Uma função que uma instância de entidade cumpre dentro de uma instância do relacionamento.

A figura a seguir mostra um exemplo de auto-relacionamento.

![A entidade Pessoa ligada a si mesma pelo relacionamento Casamento, com os papéis Marido e Esposa](img/p004-1.webp)

*Figura 3.4: auto-relacionamento Casamento, com os papéis Marido e Esposa.*

### Exercício

Identifique um auto-relacionamento no mundo real e faça o seu diagrama ER.

## Cardinalidade máxima
Duration: 10:00

Um aspecto fundamental a ser incluído no modelo é a quantidade de ocorrências de uma entidade que podem estar associadas a uma ocorrência de entidade por meio de um relacionamento.

> **Cardinalidade mínima/máxima de entidade em relacionamento**
>
> O número mínimo/máximo de ocorrências de entidade associadas a uma ocorrência da entidade em questão através do relacionamento.

Observe que, sem a especificação de cardinalidade, o diagrama de ocorrências da figura a seguir está de acordo com o que descreve o DER da Figura 3.4, muito embora algumas ocorrências possam ser incondizentes com as leis de alguns países.

![Diagrama de ocorrências do relacionamento Casamento, em que algumas pessoas participam de mais de um casamento como marido ou esposa](img/p005-1.webp)

*Figura 3.5: ocorrências do relacionamento Casamento sem restrição de cardinalidade.*

Vejamos alguns exemplos em que a cardinalidade máxima aparece. Na figura a seguir temos um relacionamento **1xN** entre as entidades Pessoa e Departamento.

![Pessoa (N) e Departamento (1) ligadas por Lotação, com notas: dado um departamento, quantas pessoas podem estar a ele associadas? Dada uma pessoa, a quantos departamentos ela pode estar associada?](img/p005-2.webp)

*Figura 3.6: relacionamento 1xN entre Pessoa e Departamento. A cardinalidade anotada junto a cada entidade responde à pergunta feita a partir da entidade do outro lado.*

A figura a seguir mostra exemplos de relacionamentos **1x1**.

![Dois relacionamentos 1x1: o auto-relacionamento Casamento em Pessoa (Marido 1, Esposa 1) e Alocação entre Empregado (1) e Mesa (1)](img/p006-1.webp)

*Figura 3.7: exemplos de relacionamentos 1x1.*

Veja mais alguns exemplos de relacionamentos **1xN** na figura a seguir.

![Relacionamentos 1xN: Inscrição entre Aluno (N) e Curso (1); Empregado (1) e Dependente (N); auto-relacionamento Supervisão em Empregado com os papéis Supervisor (1) e Supervisionado (N)](img/p006-2.webp)

*Figura 3.8: exemplos de relacionamentos 1xN.*

A figura a seguir mostra alguns exemplos de relacionamento **NxN**.

![Relacionamentos NxN: Alocação entre Engenheiro e Projeto; Consulta entre Médico e Paciente; Fornecimento entre Peça e Fornecedor; auto-relacionamento Composição em Produto com os papéis Composto e Componente](img/p007-1.webp)

*Figura 3.9: exemplos de relacionamentos NxN.*

## Cardinalidade mínima
Duration: 6:00

Também podemos especificar a **cardinalidade mínima**, como mostra a figura a seguir.

![Empregado (0,1) e Mesa (1,1) ligados por Alocação. Dada uma mesa, ela pode estar não alocada ou alocada a exatamente um empregado. Dado um empregado, ele pode estar alocado a pelo menos uma mesa e no máximo uma mesa](img/p008-1.webp)

*Figura 3.10: cardinalidades mínima e máxima. Um empregado deve estar associado a exatamente uma mesa; uma mesa pode estar livre ou alocada a um único empregado.*

### Exercício

Preencha a cardinalidade mínima e a cardinalidade máxima dos relacionamentos que você identificou nos exercícios anteriores.

Identifique dois relacionamentos NxN do mundo real cujas cardinalidades mínimas sejam iguais a 0.

## Exercício final e encerramento
Duration: 15:00

### Exercício

Construa um Diagrama Entidade-Relacionamento condizente com a descrição textual a seguir.

> Uma escola oferece cursos, os quais são compostos por disciplinas. Há algumas disciplinas com diversos pré-requisitos, enquanto outras são básicas e não demandam conhecimento prévio. Costumeiramente, um curso é oferecido a 20 alunos. Há, também, cursos novos que ainda não foram oferecidos. A escola possui departamentos. Alguns deles são responsáveis por disciplinas. Uma disciplina é sempre elaborada e conduzida por um departamento.

### Parabéns!

Você revisou os conceitos fundamentais da abordagem entidade-relacionamento: entidades, relacionamentos, auto-relacionamentos, papéis e cardinalidades. O próximo passo é estudar relacionamentos ternários, atributos e identificadores.

### Bibliografia

* HEUSER, Carlos Alberto. **Projeto de Banco de Dados**. 6ª ed. Bookman, 2008.
