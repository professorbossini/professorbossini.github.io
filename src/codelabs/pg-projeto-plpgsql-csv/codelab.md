summary: Mini-projeto de PL/pgSQL: importar uma base de desempenho de estudantes (CSV do Kaggle) para uma tabela com COPY e escrever stored procedures e functions que respondem perguntas sobre os dados.
id: pg-projeto-plpgsql-csv
categories: PostgreSQL,Bancos de Dados
tags: postgresql,plpgsql,projeto,csv,copy,stored-procedure,function,kaggle
status: Published
authors: Rodrigo Bossini
last updated: 2022-05-17
pdf: postgresql/13_projeto_pbd_plpgsql_csv_sp_fn.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Projeto: CSV, stored procedures e functions em PL/pgSQL

## Visão geral
Duration: 3:00

Este é um mini-projeto que junta o que você estudou sobre PL/pgSQL: você vai carregar uma base de dados real, disponível em formato `.csv`, numa tabela do PostgreSQL e escrever stored procedures e functions que analisam esses dados.

### O que você vai praticar

* Criar uma tabela adequada a um conjunto de dados
* Copiar os dados de um arquivo `.csv` para a tabela com `COPY`
* Escrever stored procedures com parâmetros `IN` e `OUT`
* Escrever functions que devolvem `boolean` e valores numéricos
* Testar cada procedimento e cada função com um bloco anônimo

### O que você vai precisar

* PostgreSQL e pgAdmin 4 instalados
* Saber escrever stored procedures e functions em PL/pgSQL
* A base de dados do projeto (veja o próximo passo)

## A base de dados
Duration: 10:00

**1.1** Estude e faça o download da base de dados disponível no link a seguir.

[https://www.kaggle.com/datasets/csafrit2/higher-education-students-performance-evaluation](https://www.kaggle.com/datasets/csafrit2/higher-education-students-performance-evaluation)

<aside class="positive">

Uma versão reduzida da base, com as colunas `AGE`, `GENDER`, `SALARY`, `PREP_EXAM`, `NOTES` e `GRADE`, está disponível na pasta `postgresql` dos materiais, no arquivo `13_projeto_base_de_dados_student_prediction.csv`. O significado de cada código (faixa de idade, sexo, faixa de renda, preparo para as provas, anotações em aula e nota) está descrito na página do conjunto de dados no Kaggle.

</aside>

**1.2** Crie uma tabela apropriada para o armazenamento dos itens. Não se preocupe com a normalização. Uma tabela basta.

**1.3** Copie os dados do arquivo `.csv` para a sua tabela. Veja como na documentação do comando `COPY`:

[https://www.postgresql.org/docs/current/sql-copy.html](https://www.postgresql.org/docs/current/sql-copy.html)

## Stored procedures
Duration: 25:00

**1.4** Escreva os seguintes stored procedures (incluindo um bloco anônimo de teste para cada um):

**1.4.1** Exibe o número de estudantes maiores de idade.

**1.4.2** Exibe o percentual de estudantes de cada sexo.

**1.4.3** Recebe um sexo como parâmetro em modo `IN` e utiliza oito parâmetros em modo `OUT` para dizer qual o percentual de cada nota (variável *grade*) obtida por estudantes daquele sexo.

## Functions
Duration: 25:00

**1.5** Escreva as seguintes functions (incluindo um bloco anônimo de teste para cada uma):

**1.5.1** Responde (devolve `boolean`) se é verdade que todos os estudantes de renda acima de 410 são aprovados (*grade* > 0).

**1.5.2** Responde (devolve `boolean`) se é verdade que, entre os estudantes que fazem anotações pelo menos algumas vezes durante as aulas, pelo menos 70% são aprovados (*grade* > 0).

**1.5.3** Devolve o percentual de alunos que se preparam pelo menos um pouco para os "midterm exams" e que são aprovados (*grade* > 0).

## Encerramento
Duration: 3:00

### Bom trabalho!

Ao terminar, você terá uma pequena camada de lógica armazenada no servidor, capaz de responder perguntas sobre os dados com uma simples chamada.

### Bibliografia

* Kaggle: Your Home for Data Science. Kaggle, 2022. Disponível em [https://www.kaggle.com](https://www.kaggle.com). Acesso em maio de 2022.
* PostgreSQL: Documentation: 14: PostgreSQL 14.2 Documentation. PostgreSQL, 2022. Disponível em [https://www.postgresql.org/docs/current/index.html](https://www.postgresql.org/docs/current/index.html). Acesso em maio de 2022.
