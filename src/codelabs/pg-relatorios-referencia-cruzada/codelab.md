summary: Relatórios de referência cruzada (tabelas pivô) no PostgreSQL com a função crosstab da extensão tablefunc: notas de alunos por disciplina e dias de chuva por localização e ano, carregados com o psql.
id: pg-relatorios-referencia-cruzada
categories: PostgreSQL,Bancos de Dados
tags: postgresql,crosstab,tablefunc,tabela-pivo,referencia-cruzada,psql,relatorios
status: Published
authors: Rodrigo Bossini
last updated: 2022-06-04
pdf: postgresql/15_apostila_relatorios_de_referencia_cruzada.pdf
exercicios: postgresql/15_exercicios_relatorios_de_referencia_cruzada.pdf,postgresql/15_exercicios_com_respostas_relatorios_de_referencia_cruzada.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Relatórios de referência cruzada com crosstab

## Visão geral
Duration: 3:00

Neste material, estudaremos a criação de **relatórios de referência cruzada**.

Um relatório de referência cruzada (ou **tabela pivô**, ou **tabela invertida**) é uma técnica usada para a compilação e análise de dados que simplifica a busca por padrões e tendências. Um relatório de referência cruzada permite agregar, ordenar, organizar, reorganizar, agrupar e reduzir com funções de redução (soma, média etc.) os dados, o que viabiliza um melhor entendimento sobre eles.

### O que você vai aprender

* O que é um relatório de referência cruzada
* Como instalar a extensão `tablefunc` e verificar as extensões instaladas
* Como usar a função `crosstab` e por que a ordem dos dados importa
* Como carregar um arquivo `.sql` com o `psql`
* Como montar relatórios com funções de agregação, como `SUM`

### O que você vai precisar

* PostgreSQL e pgAdmin 4 instalados
* O arquivo `rainfalldata.sql`, disponível na pasta `postgresql` dos materiais

## Preparando o ambiente no pgAdmin
Duration: 5:00

Caso ainda não possua um servidor, abra o pgAdmin 4 e clique em **Add New Server**, como mostra a figura a seguir.

![Tela inicial do pgAdmin com o atalho Add New Server destacado](img/p001-1.webp)

*Figura 2.1.1: adicionando um novo servidor.*

O nome do servidor pode ser algo que lhe ajude a lembrar a razão de ser dele. Como é um servidor que está executando localmente, podemos chamá-lo de algo como **localhost**, como na figura a seguir. Depois de preencher o nome, clique na aba **Connection**.

![Janela Register - Server, aba General, com o nome localhost destacado](img/p002-1.webp)

*Figura 2.1.2: nome do servidor.*

Agora, na aba **Connection**, preencha os campos como destacado na figura a seguir e clique em **Save**.

![Aba Connection com Host localhost, porta 5432, usuário e senha destacados e o botão Save](img/p002-2.webp)

*Figura 2.1.3: dados de conexão.*

<aside class="positive">

**Nota.** Usuário e senha dependerão de suas configurações. No Windows, é comum a existência de um usuário chamado `postgres` com a senha também igual a `postgres`.

</aside>

No canto superior esquerdo, encontre o seu servidor e clique sobre ele. Expanda **Databases** e encontre o database chamado **postgres**, cuja existência é muito comum. Veja a figura a seguir.

![Árvore do pgAdmin com localhost, Databases e postgres destacados](img/p003-1.webp)

*Figura 2.1.4: o database postgres.*

Para abrir um editor em que possa digitar seus comandos SQL, clique em **Tools >> Query Tool**, como mostra a figura a seguir.

![Menu Tools com a opção Query Tool destacada](img/p004-1.webp)

*Figura 2.1.5: abrindo o Query Tool.*

## Um exemplo de referência cruzada
Duration: 4:00

Suponha que temos dados de alunos sobre seu desempenho em diversas disciplinas, como mostra a tabela a seguir.

| Nome | Disciplina | Nota | Data |
| --- | --- | --- | --- |
| Ana | Matemática | 9 | 02/01/2020 |
| Ana | Inglês | 10 | 02/02/2020 |
| Ana | Biologia | 8 | 02/03/2020 |
| Ana | História | 10 | 02/04/2020 |
| João | Matemática | 8 | 02/01/2020 |
| João | Inglês | 7 | 02/02/2020 |
| João | Biologia | 6 | 02/03/2020 |
| João | História | 10 | 02/04/2020 |

*Tabela 2.2.1: notas dos alunos.*

Um relatório de referência cruzada construído em função dela pode ser parecido com aquele exibido pela tabela a seguir.

| Nome | Matemática | Inglês | Biologia | História |
| --- | --- | --- | --- | --- |
| Ana | 9 | 10 | 8 | 10 |
| João | 8 | 7 | 6 | 10 |

*Tabela 2.2.2: relatório de referência cruzada: uma linha por aluno, uma coluna por disciplina.*

## A extensão tablefunc
Duration: 4:00

A geração de relatórios de referência cruzada no PostgreSQL requer a instalação de um módulo chamado **tablefunc**. A instalação pode ser feita como no código a seguir. A documentação do módulo tablefunc pode ser consultada em [https://www.postgresql.org/docs/current/tablefunc.html](https://www.postgresql.org/docs/current/tablefunc.html).

**pgAdmin · Query Tool**

```sql
CREATE EXTENSION IF NOT EXISTS tablefunc;
```

É possível verificar quais extensões estão instaladas no momento. Elas ficam armazenadas na tabela `pg_extension`. Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
SELECT * FROM pg_extension;
```

A figura a seguir mostra o resultado esperado.

![Resultado de SELECT * FROM pg_extension com duas linhas: plpgsql e tablefunc, versão 1.0](img/p006-1.webp)

*Figura 2.3.1: a extensão tablefunc instalada.*

## A tabela de notas
Duration: 4:00

Para este primeiro exemplo, vamos definir uma tabela que armazena dados de alunos que incluem:

* seu nome
* uma disciplina cursada
* a nota obtida
* a data em que a nota foi obtida

Veja o código a seguir para fazer a criação da tabela.

**pgAdmin · Query Tool**

```sql
CREATE TABLE tb_nota(
    cod_nota SERIAL PRIMARY KEY,
    nome_aluno VARCHAR(200),
    disciplina VARCHAR(200),
    nota NUMERIC (10, 2),
    data_obtencao DATE
);
```

A seguir, faça a inserção de alguns dados, como mostra o código a seguir.

**pgAdmin · Query Tool**

```sql
INSERT INTO tb_nota(
    nome_aluno, disciplina, nota, data_obtencao
)
VALUES
('Ana', 'Matemática', 9, '2020-01-02'),
('Ana', 'Inglês', 10, '2020-02-02'),
('Ana', 'Biologia', 8, '2020-03-02'),
('Ana', 'História', 10, '2020-04-02'),
('João', 'Matemática', 7, '2020-01-02'),
('João', 'Inglês', 10, '2020-02-02'),
('João', 'Biologia', 5, '2020-03-02'),
('João', 'História', 7, '2020-04-02');
```

## A função crosstab
Duration: 10:00

A construção do relatório de referência cruzada será feita pela função `crosstab`. O código a seguir mostra a sintaxe para uso da função.

**Formato geral (não execute)**

```sql
--esse é apenas o formato geral, não tente executar
-- veja como crosstab é uma função
-- e estamos passando um comando SQL como parâmetro
SELECT * FROM crosstab
(
    'Um comando SELECT aqui'
) AS nome_para_a_tabela_resultante
(
    --quais colunas a tabela de referência cruzada terá
    coluna1 tipo,
    coluna2 tipo,
    coluna3 tipo,
    ...,
    colunaN tipo
)
```

### Criando a tabela de referência cruzada

O comando `SELECT` que entregamos para a função `crosstab` precisa produzir uma tabela com três colunas:

* a primeira coluna contém os itens que deverão aparecer por linha. Neste caso, teremos um nome por linha.
* a segunda coluna contém os valores que deverão aparecer para cada coluna. Neste caso, teremos uma coluna para cada disciplina.
* a terceira coluna deve devolver os valores que devem estar contidos em cada célula.

Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
SELECT * FROM crosstab(
    '
    SELECT
        -- uma linha por nome de aluno
        nome_aluno,
        -- uma coluna por disciplina
        disciplina,
        -- cada célula terá uma nota
        nota
    FROM
        tb_nota
    '
) AS tb_ref_cruzada
(
    nome VARCHAR(200),
    biologia NUMERIC(10, 2),
    historia NUMERIC(10, 2),
    ingles NUMERIC(10, 2),
    matematica NUMERIC(10, 2)
);
```

Veja o resultado esperado na figura a seguir.

![Resultado do crosstab com uma linha por aluno: Ana 9, 10, 8, 10 e João 7, 10, 5, 7](img/fig-2-5-1.webp)

*Figura 2.5.1: primeiro resultado do crosstab.*

### Os dados estão errados! A ordem importa

Compare os dados da tabela de referência cruzada com os dados da tabela original. Observe que os dados que a tabela de referência cruzada exibe estão errados. O que ocorre é que **os dados devolvidos pelo SELECT que especificamos (os nomes das disciplinas, neste caso) devem estar na mesma ordem que utilizamos na especificação das colunas da tabela resultante**.

Observe que os nomes das colunas da tabela resultante estão em ordem alfabética. Basta, então, ordenar o resultado do `SELECT` usando a coluna com o nome da disciplina como critério. É claro, entretanto, que primeiro precisamos ordenar por nome. Assim, as disciplinas de cada pessoa aparecerão em ordem e são esses os valores a serem usados na construção de cada linha. Veja o ajuste a ser feito no código a seguir.

**pgAdmin · Query Tool**

```sql
SELECT * FROM crosstab(
    '
    SELECT
        -- uma linha por nome de aluno
        nome_aluno,
        -- uma coluna por disciplina
        disciplina,
        -- cada célula terá uma nota
        nota
    FROM
        tb_nota
    ORDER BY nome_aluno, disciplina
    '
) AS tb_ref_cruzada
(
    nome VARCHAR(200),
    biologia NUMERIC(10, 2),
    historia NUMERIC(10, 2),
    ingles NUMERIC(10, 2),
    matematica NUMERIC(10, 2)
);
```

## O psql e a variável path
Duration: 8:00

Para o próximo exemplo, vamos fazer a leitura de dados de um arquivo por meio da linha de comando. Para tal, utilizaremos o **psql**. Para utilizá-lo, é necessário garantir que o diretório em que se encontra o seu executável faz parte da variável de ambiente `path` do sistema operacional. Caso o PostgreSQL tenha sido instalado no diretório padrão, o diretório de interesse é

```text
C:\Progra~1\PostgreSQL\14\bin
```

É preciso colocar esse diretório na variável de ambiente `path` do sistema operacional para que o arquivo `psql.exe` possa ser encontrado. É importante estar ciente de que esta configuração será válida apenas para esta instância atual do terminal em uso. Por isso, quando for executar o programa, utilize sempre o terminal em que fez a configuração.

<aside class="positive">

**Nota.** Caso tenha privilégios de administrador no computador, pode ser interessante fazer a configuração de maneira definitiva.

</aside>

### PowerShell

Se estiver usando o PowerShell, use o comando a seguir para visualizar o que você possui em sua variável de ambiente `path` no momento.

**Terminal (PowerShell)**

```bash
$Env:path
```

O resultado deve ser parecido com o que exibe a figura a seguir.

![Terminal PowerShell com a saída de $Env:path](img/p010-1.webp)

*Figura 2.6.1: conteúdo atual da variável path no PowerShell.*

Use o comando a seguir para adicionar o diretório bin do PostgreSQL à variável de ambiente `path`.

**Terminal (PowerShell)**

```bash
$Env:path += ';C:\Progra~1\PostgreSQL\14\bin'
```

Use `$Env:path` novamente para certificar-se de que a configuração foi feita com sucesso. Veja o resultado esperado na figura a seguir.

![Saída de $Env:path terminando com o diretório bin do PostgreSQL](img/p010-2.webp)

*Figura 2.6.2: o diretório bin do PostgreSQL no path.*

### Prompt de comando

Se estiver usando o prompt de comando comum, use o comando a seguir para visualizar o que você possui em sua variável de ambiente `path` no momento.

**Terminal (prompt de comando)**

```bash
echo %PATH%
```

O resultado deve ser parecido com o que exibe a figura a seguir.

![Prompt de comando com a saída de echo %PATH%](img/p011-1.webp)

*Figura 2.6.3: conteúdo atual da variável PATH no prompt de comando.*

Use o comando a seguir para adicionar o diretório bin do PostgreSQL à variável de ambiente `path`.

**Terminal (prompt de comando)**

```bash
set PATH=%PATH%;C:\Progra~1\PostgreSQL\14\bin
```

Use `echo %PATH%` novamente para certificar-se de que a configuração foi feita com sucesso. Veja o resultado esperado na figura a seguir.

![Saída de echo %PATH% terminando com o diretório bin do PostgreSQL](img/p011-2.webp)

*Figura 2.6.4: o diretório bin do PostgreSQL no PATH.*

<aside class="negative">

A partir de agora, não feche mais o terminal que utilizou para configurar esta variável de ambiente. Caso o faça, será necessário refazer o procedimento utilizando um novo terminal.

</aside>

### Conectando com o psql

Navegue até o diretório em que você armazenará o arquivo cujo conteúdo deseja obter usando o psql. Para se conectar ao PostgreSQL usando o psql, use o comando a seguir, trocando `seu_database` pelo nome da sua base e `postgres` pelo seu usuário, se for o caso.

**Terminal**

```bash
psql -h localhost -d seu_database -U postgres
```

Depois disso, o psql deve pedir a senha do usuário que você escolheu.

## Carregando os dados de chuva
Duration: 6:00

Faça o download do arquivo `rainfalldata.sql`, disponível na pasta `postgresql` dos materiais. O trecho a seguir mostra o início de seu conteúdo.

**rainfalldata.sql · início**

```text
CREATE TABLE rainfalls (
    location text,
    year integer,
    month integer,
    raindays integer
);

COPY rainfalls (location, year, month, raindays) FROM stdin;
Germany	2017	1	9
Germany	2017	2	10
Germany	2017	3	9
Germany	2017	4	2
Germany	2017	5	9
Germany	2017	6	9
Germany	2017	7	7
Germany	2017	8	13
Germany	2017	9	12
Germany	2017	10	9
Germany	2017	11	15
Germany	2017	12	9
```

As colunas são as seguintes:

* `location`: nome de um país
* `year`: ano de ocorrência dos dias de chuva
* `month`: mês de ocorrência dos dias de chuva
* `raindays`: quantidade de dias em que houve chuva naquele mês/ano

Para ler os dados usando o psql, use o comando a seguir.

**psql**

```bash
\i rainfalldata.sql
```

O resultado esperado é o seguinte.

**psql · resultado**

```text
pessoal_crosstab_reports=# \i rainfalldata.sql
CREATE TABLE
COPY 648
pessoal_crosstab_reports=#
```

Já no pgAdmin, você deve encontrar a tabela `rainfalls` como mostra a figura a seguir.

![Árvore do pgAdmin com a base pessoal_crosstab_reports, Schemas, public, Tables e a tabela rainfalls destacada](img/p013-2.webp)

*Figura 2.7.3: a tabela rainfalls no pgAdmin.*

Execute um `SELECT` para verificar os dados, caso deseje.

## Soma de dias de chuva por localização e ano
Duration: 8:00

Nesta seção, vamos construir uma tabela de referência cruzada que mostra a soma de todos os dias de chuva por localização para cada ano.

### O SELECT que alimentará a função crosstab

O `SELECT` que desejamos trará os dados das colunas:

* `location`
* `year`
* `raindays` (a soma, neste caso)

Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
SELECT
    location,
    year,
    SUM(raindays)
FROM
    rainfalls
--lembre-se de que SUM é uma função de agregação
GROUP BY
    location, year
--ordenamos para que os resultados sejam condizentes com a ordem das colunas da tabela de referência cruzada que vamos produzir
ORDER BY location, year;
```

### Usando a função crosstab

A seguir, usamos a função `crosstab` para produzir a tabela de referência cruzada desejada. Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
SELECT * FROM crosstab (
    '
    SELECT
        location,
        year,
        --SUM devolve bigint, convertemos para int para ser compatível com a especificação da tabela resultante
        --que faremos
        SUM(raindays)::int
    FROM
        rainfalls
    --lembre-se de que SUM é uma função de agregação
    GROUP BY
        location, year
    --ordenamos para que os resultados sejam condizentes com a ordem das colunas da tabela de referência
    --cruzada que vamos produzir
    ORDER BY location, year;
    '
) AS tab_ref_cruzada (
    "Location" TEXT,
    "2012" INT,
    "2013" INT,
    "2014" INT,
    "2015" INT,
    "2016" INT,
    "2017" INT
)
```

### Bibliografia

* PostgreSQL: Documentation: 14: PostgreSQL 14.2 Documentation. PostgreSQL, 2022. Disponível em [https://www.postgresql.org/docs/current/index.html](https://www.postgresql.org/docs/current/index.html). Acesso em maio de 2022.

## Exercícios
Duration: 15:00

**1.1** Monte uma tabela de referência cruzada que mostre, para cada localização, a média de dias de chuva por mês. O resultado deve ser parecido com aquele exibido pela figura a seguir.

![Tabela de referência cruzada com as colunas location e jan a dez e uma linha por localização: Dubai, France, Germany, London, Malaysia, Qatar, Singapore, Sydney e Tokyo](img/ex-1-1-1.webp)

*Figura 1.1.1: média de dias de chuva por mês, para cada localização.*

<details><summary>Ver resposta</summary>

O código a seguir mostra uma possível solução.

**pgAdmin · Query Tool**

```sql
SELECT * FROM crosstab(
    '
    SELECT
        location, month, AVG(raindays)::int
    FROM
        rainfalls
    GROUP BY
        location, month
    ORDER BY
        location, month
    '
) AS tab_ref_cruzada(
    location TEXT,
    jan INT,
    fev INT,
    mar INT,
    abr INT,
    mai INT,
    jun INT,
    jul INT,
    ago INT,
    set INT,
    out INT,
    nov INT,
    dez INT
)
```

</details>
