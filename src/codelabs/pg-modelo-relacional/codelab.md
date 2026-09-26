summary: Revisão do modelo relacional: tabelas, diferenças em relação a arquivos comuns, chaves primárias, estrangeiras e alternativas, e as restrições de integridade impostas pelas chaves estrangeiras.
id: pg-modelo-relacional
categories: Bancos de Dados
tags: modelo-relacional,tabela,chave-primaria,chave-estrangeira,integridade-referencial
status: Published
authors: Rodrigo Bossini
last updated: 2022-02-22
pdf: postgresql/04_apostila_pbd_revisao_modelo_relacional.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Revisão do modelo relacional

## Visão geral
Duration: 5:00

Neste material estudaremos as principais características do **modelo relacional**. O modelo relacional é aquele cuja implementação se baseia em **relações** ou **tabelas**.

<aside class="positive">

**Nota.** Relação e tabela são sinônimos. Por outro lado, as palavras **relacionamento** e **relação** nada têm a ver. A primeira é utilizada na abordagem entidade-relacionamento, quando estamos descrevendo conceitualmente detalhes do mundo real que nos são de interesse e que irão caracterizar nosso minimundo. Nesta abordagem, temos entidades e relacionamentos entre elas, daí o nome. Por outro lado, a palavra relação é sinônimo de tabela e ela aparece a partir do momento em que decidimos detalhes sobre a forma como o banco de dados será implementado. O modelo de dados cuja implementação se baseia em tabelas leva o nome de modelo relacional.

</aside>

### O que você vai aprender

* O que é uma tabela (relação) e como ela se compara a um arquivo comum
* O que são chave primária, chave estrangeira e chave alternativa
* Quais restrições uma chave estrangeira impõe na inclusão, alteração e remoção de linhas
* Como uma chave estrangeira pode referenciar a própria tabela para implementar auto-relacionamentos

### O que você vai precisar

* Conhecer os conceitos da abordagem entidade-relacionamento
* Papel e lápis para o exercício final

## Tabelas
Duration: 6:00

O principal "objeto" que caracteriza um banco de dados relacional é a relação ou tabela. Vejamos algumas definições.

> **Tabela (ou relação)**
>
> Um conjunto não ordenado de linhas (tuplas). Cada linha é composta por uma série de campos (atributos). Cada campo é identificado por um nome de campo.

Veja um exemplo na figura a seguir.

![Tabela com as colunas CodigoEmp, Nome, CodigoDepto e CategFuncional e quatro linhas de empregados, E5, E3, E2 e E1](img/p001-1.webp)

*Figura 2.1.1: uma tabela de empregados.*

### Tabelas e arquivos comuns

Veja algumas comparações entre uma tabela de um banco de dados relacional e um arquivo comum, como um simples txt.

* **As linhas de uma tabela não têm ordenação.** A ordem de recuperação feita pelo SGBD é arbitrária, a menos que o comando de consulta diga explicitamente a ordem desejada. Não existe a ideia de "primeira linha", "segunda linha" e assim por diante. Em arquivos comuns, a ordenação existe e é possível referenciar linhas pela sua posição relativa dentro do arquivo.
* **Os valores de campo de uma tabela são atômicos e monovalorados.** Quer dizer, um valor não pode ser composto de outros. Além disso, um campo somente pode possuir no máximo um valor.
* **As linguagens de consulta a bases de dados** (implementações de SQL como PL/SQL e Transact/SQL) permitem o acesso por quaisquer critérios envolvendo os campos de uma ou mais linhas. Em arquivos comuns, a busca por valores se dá de forma sequencial ou requer o uso de estruturas de dados como índices. Embora os índices sejam construções fundamentais em bancos de dados relacionais, seu uso é usualmente abstraído pelo SGBD.

## Chave primária e chave estrangeira
Duration: 8:00

Em um banco de dados relacional, o conceito de **chave** é muito importante. Há, pelo menos, três tipos.

### Chave primária

> **Chave primária**
>
> Uma coluna ou combinação de colunas cujos valores distinguem uma linha das demais dentro de uma tabela.

A figura a seguir mostra uma tabela cuja chave primária é a coluna `CodigoEmp`.

![Tabela de empregados com a coluna CodigoEmp destacada como chave primária simples, composta somente por uma coluna](img/p002-1.webp)

*Figura 2.3.1: chave primária simples: somente uma coluna.*

A figura a seguir mostra uma tabela cuja chave primária é composta por duas colunas.

![Tabela de dependentes com as colunas CodigoEmp, NumeroDep, Nome e Tipo; CodigoEmp e NumeroDep juntas formam a chave primária](img/p003-1.webp)

*Figura 2.3.2: chave primária composta: duas ou mais colunas.*

Naturalmente, poderíamos apontar o conjunto de todas as colunas de uma tabela como a sua chave primária. Entretanto, exige-se que o número seja o menor possível. Esse é o **princípio da minimalidade**.

### Chave estrangeira

> **Chave estrangeira**
>
> Uma coluna ou combinação de colunas cujos valores aparecem necessariamente na chave primária de uma tabela. A chave estrangeira é o mecanismo que permite a implementação de relacionamentos em um banco de dados relacional.

Veja um exemplo na figura a seguir.

![Tabela de departamentos (CodDepto, NomeDepto) cuja chave primária é referenciada pela coluna CodigoDepto da tabela de empregados; o empregado E1 tem CodigoDepto vazio](img/p004-1.webp)

*Figura 2.3.3: a coluna CodigoDepto de Empregado é chave estrangeira. Os valores ali aparecem necessariamente na chave primária referenciada. Campos vazios são válidos, o que pode acontecer quando o relacionamento for opcional.*

## Restrições impostas pela chave estrangeira
Duration: 10:00

A existência de uma chave estrangeira impõe restrições. Veja.

### Inclusão de linha

Quando uma linha é inserida numa tabela que possui uma chave estrangeira, é necessário garantir que o valor da chave estrangeira existe na chave primária referenciada. Veja a figura a seguir.

![Duas novas linhas a serem inseridas na tabela Empregado: E6 Antônio no departamento D1, que existe e pode ser inserida, e E7 Souza no departamento D5, que não existe na chave primária referenciada e não pode ser inserida](img/p005-1.webp)

*Figura 2.3.4: na inclusão, o SGBD busca o valor da chave estrangeira na chave primária referenciada.*

### Alteração da chave estrangeira

Se o valor de uma chave estrangeira for alterado, deve-se garantir que o novo valor exista na chave primária referenciada. Veja a figura a seguir.

![Duas atualizações desejadas na tabela Empregado: mudar o CodigoDepto de E3 para D1, que existe e pode ser feita, e para D5, que não existe e não pode acontecer](img/p005-2.webp)

*Figura 2.3.5: ao alterar uma chave estrangeira, o novo valor precisa existir na chave primária referenciada.*

### Remoção na tabela referenciada

Caso uma linha da tabela que possui a chave primária referenciada seja excluída, deve-se garantir que o valor removido não mais exista na chave estrangeira que a referencia. Há algumas opções para isso: remoção da linha que contém o valor de chave estrangeira envolvido, atualização para "null" caso o relacionamento seja opcional e o bloqueio da operação, ou seja, neste caso, o SGBD não permite que a remoção aconteça. Veja a figura a seguir.

![Remoção do departamento D1 (DELETE WHERE CodDepto = D1) e três opções: 1) remover as linhas de empregados de D1; 2) configurar CodigoDepto como null nessas linhas; 3) não permitir a remoção, deixando ambas as tabelas inalteradas](img/p006-1.webp)

*Figura 2.3.6: as três opções para a remoção de uma linha referenciada.*

### Alteração na tabela referenciada

Caso uma linha da tabela que possui a chave primária referenciada seja alterada, deve-se garantir que as linhas cujas chaves estrangeiras a referenciam não mais possuam o valor antigo. Isso pode ser feito por meio do bloqueio da operação ou da atualização dos valores automaticamente. Veja a figura a seguir.

![Alteração do código do departamento D1 para D8 (UPDATE WHERE CodDepto = D1 SET CodDepto D8) e duas opções: 1) bloquear a operação; 2) atualizar para D8 os valores da chave estrangeira em Empregado](img/p006-2.webp)

*Figura 2.3.7: as duas opções para a alteração de uma chave primária referenciada.*

## Chave alternativa e auto-relacionamento
Duration: 6:00

### Chave alternativa

Há casos em que mais de uma coluna ou combinação de colunas pode servir para diferenciar uma ocorrência das demais. Neste caso, uma delas é escolhida como chave primária. As demais são consideradas **chaves alternativas**. Veja um exemplo na figura a seguir.

![Tabela de empregados com as colunas CodigoEmp, escolhida como chave primária, e CPF, que poderia ser chave primária e fica sendo uma chave alternativa](img/p007-1.webp)

*Figura 2.3.8: CodigoEmp foi escolhida como chave primária; CPF fica sendo uma chave alternativa.*

### Chaves primária e estrangeira na mesma tabela

Nada impede que uma chave estrangeira referencie a chave primária da tabela a que pertence. Esse é um mecanismo muito comum utilizado na implementação de auto-relacionamentos. Veja um exemplo na figura a seguir.

![Tabela de empregados com a coluna CodigoGerente, chave estrangeira que referencia a chave primária CodigoEmp da própria tabela; E1 não tem gerente (null), E2 e E3 são gerenciados por E1 e E5 por E2](img/p007-2.webp)

*Figura 2.4.1: a coluna CodigoGerente referencia a chave primária da própria tabela.*

## Exercícios e encerramento
Duration: 15:00

### Exercícios

Use tabelas para implementar o seguinte "minimundo".

> Pessoas possuem CPF, nome e idade. Veículos possuem placa, modelo e marca. Pessoas podem possuir diversos veículos. Um veículo possui apenas um proprietário.
>
> A tabela Pessoa deve possuir duas ocorrências de pessoa, P1 e P2, as quais devem possuir os CPFs 123456 e 654321, respectivamente. A tabela de veículos deve possuir 3 ocorrências de veículos.
>
> A pessoa P1 possui 2 veículos. A pessoa P2 possui apenas um veículo.

1. Desenhe as tabelas de acordo com as restrições descritas.
2. Mostre as tabelas após P2 comprar um veículo de P1.
3. Mostre as tabelas caso o CPF de P1 seja atualizado para 111111.
4. Remova P2 da base e mostre as tabelas resultantes.

### Parabéns!

Você revisou os fundamentos do modelo relacional. O próximo passo é o projeto lógico: transformar um modelo entidade-relacionamento em tabelas.

### Bibliografia

* HEUSER, Carlos Alberto. **Projeto de Banco de Dados**. 6ª ed. Bookman, 2008.
