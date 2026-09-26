summary: Revisão de modelagem entidade-relacionamento com relacionamentos ternários, atributos (inclusive com cardinalidade e em relacionamentos), identificadores de entidade e relacionamentos identificadores.
id: pg-modelagem-er-ternario-atributos
categories: Bancos de Dados
tags: modelagem,entidade-relacionamento,der,ternario,atributos,identificador,entidade-fraca
status: Published
authors: Rodrigo Bossini
last updated: 2022-02-07
pdf: postgresql/02_apostila_pbd_revisao_modelagem_er_ternario_atributos_ids.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Modelagem ER: relacionamentos ternários, atributos e identificadores

## Visão geral
Duration: 3:00

Este material mostra uma breve revisão sobre os principais conceitos da modelagem de dados baseada na abordagem entidade-relacionamento, dando continuidade à revisão de entidades, relacionamentos e cardinalidades.

### O que você vai aprender

* O que é um relacionamento ternário e como especificar suas cardinalidades
* O que são atributos de entidades e de relacionamentos
* Como representar a cardinalidade de atributos
* O que é um identificador de entidade
* O que é um relacionamento identificador e por que muitos autores evitam o termo "entidade fraca"

### O que você vai precisar

* Conhecer os conceitos de entidade, relacionamento e cardinalidade da revisão anterior
* Papel e lápis (ou uma ferramenta de desenho de diagramas) para os exercícios

## Relacionamento ternário
Duration: 8:00

> **Relacionamento ternário**
>
> Um relacionamento cujas ocorrências têm a elas associadas três ocorrências de entidades.

Veja um exemplo na figura a seguir.

![As entidades Cidade, Distribuidor e Produto ligadas a um único relacionamento Distribuição](img/p001-1.webp)

*Figura 2.1: relacionamento ternário Distribuição.*

Evidentemente, especificar as cardinalidades de um relacionamento ternário é fundamental. Veja a figura a seguir.

![Relacionamento ternário Distribuição com cardinalidades: Cidade N, Distribuidor 1, Produto N, e notas explicativas para cada uma](img/p002-1.webp)

*Figura 2.2: cardinalidades do relacionamento ternário Distribuição.*

Em um relacionamento ternário, a cardinalidade de cada entidade é lida a partir de um **par** de ocorrências das outras duas:

* **Cidade (N)**: dado um par (produto, distribuidor), diversas cidades podem ser abastecidas. Exemplo: o produto refrigerante pode ser distribuído pelo distribuidor A nas cidades de Itu, São Paulo e Itapeva.
* **Distribuidor (1)**: dado um par (cidade, produto), somente um distribuidor pode atuar ali. Exemplo: na cidade de Itu, o produto refrigerante somente pode ser distribuído pelo distribuidor A.
* **Produto (N)**: dado um par (cidade, distribuidor), diversos produtos podem ser distribuídos. Exemplo: na cidade de Itu, o distribuidor A pode distribuir refrigerante, arroz e diversos outros produtos.

### Exercício

Identifique um relacionamento ternário no mundo real e faça o seu diagrama ER, incluindo cardinalidade mínima e máxima.

## Atributos
Duration: 8:00

Entidades são descrições de "coisas" que fazem parte do mini mundo de interesse. Em geral, entidades possuem diversos atributos.

> **Atributo**
>
> Um dado que é associado a cada ocorrência de uma entidade ou de um relacionamento.

A figura a seguir mostra um exemplo de entidade com alguns atributos.

![Entidade Projeto com os atributos nome, código e tipo](img/p002-2.webp)

*Figura 2.3: entidade com atributos.*

Como a figura a seguir mostra, atributos também podem ter cardinalidade.

![Entidade Cliente com os atributos nome, código e telefone, este com cardinalidade (0, N)](img/p003-1.webp)

*Figura 2.4: atributo com cardinalidade: um cliente pode ter zero ou mais telefones.*

Nada impede que relacionamentos tenham atributos, como na figura a seguir.

![Relacionamento Atuação entre Engenheiro e Projeto, com o atributo função; relacionamento Financiamento entre Financeira e Venda, com os atributos taxa de juros e número de parcelas](img/p004-1.webp)

*Figura 2.5: relacionamentos com atributos.*

### Exercícios

Identifique um relacionamento 1xN no mundo real que possua atributos e faça o seu diagrama ER.

Identifique um relacionamento NxN no mundo real que possua atributos e faça o seu diagrama ER.

## Atributo identificador
Duration: 6:00

Em um banco de dados, é fundamental que seja possível diferenciar uma ocorrência de entidade das demais. Para tal, utilizamos o conceito de identificador de entidade.

> **Identificador de entidade**
>
> Um conjunto de um ou mais atributos e relacionamentos cujos valores servem para distinguir uma ocorrência da entidade das demais ocorrências da mesma entidade.

Veja os exemplos da figura a seguir.

![Entidade Cliente identificada pelo atributo código (círculo preenchido); entidade Prateleira identificada pelo par número do corredor e número da prateleira, ilustrada por corredores C1 a C3 com prateleiras P1 a P3](img/p005-1.webp)

*Figura 2.6: identificadores de entidade, representados por círculos preenchidos. Em Prateleira, o identificador é composto por dois atributos.*

### Exercícios

Identifique duas entidades do mundo real cujos identificadores sejam compostos por mais de um atributo e faça o seu diagrama ER.

## Relacionamento identificador
Duration: 8:00

Há também casos em que o identificador de uma entidade é composto não somente por atributos da própria entidade, mas também por relacionamentos dos quais a entidade participa. Um relacionamento com essa característica é um **relacionamento identificador**. Veja um exemplo na figura a seguir.

![Empregados E1 a E3 e seus dependentes numerados a partir de 1 para cada empregado; no DER, Dependente (0,N) liga-se a Empregado (1,1) por um relacionamento identificador e é identificado pelo número de sequência junto com o empregado](img/p006-1.webp)

*Figura 2.7: relacionamento identificador. Um dependente é identificado pelo empregado a que pertence e pelo seu número de sequência.*

Há algumas obras que qualificam a entidade Dependente como "fraca", pelo fato de suas ocorrências somente poderem existir mediante existência de uma ocorrência da entidade Empregado. Por outro lado, uma entidade pode estar relacionada a diversas outras, por meio de diferentes relacionamentos. Pelo fato de não necessariamente todos apresentarem essa característica, muitos autores evitam qualificar uma entidade como fraca. Veja um exemplo na figura a seguir.

![Grupos G1 e G2 com empresas E1 e E2 e suas filiais F1, F2, F3; no DER, Filial é identificada pelo número da filial e pela Empresa, que por sua vez é identificada pelo número da empresa e pelo Grupo](img/p007-1.webp)

*Figura 2.8: relacionamentos identificadores em cadeia: Grupo, Empresa e Filial.*

### Exercícios

Identifique um relacionamento no mundo real em que o conceito de relacionamento identificador ou entidade fraca apareça e faça o seu diagrama ER.

## Encerramento
Duration: 3:00

### Parabéns!

Você revisou relacionamentos ternários, atributos, identificadores de entidade e relacionamentos identificadores. O próximo passo da revisão aborda identificação de relacionamentos, generalização/especialização e entidades associativas.

### Bibliografia

* HEUSER, Carlos Alberto. **Projeto de Banco de Dados**. 6ª ed. Bookman, 2008.
