summary: Cursores em PL/pgSQL: percorrer o resultado de uma consulta linha a linha com cursores não vinculados e vinculados, queries dinâmicas, parâmetros, FOUND, FETCH, UPDATE/DELETE com WHERE CURRENT OF e SCROLL, usando uma base de canais do YouTube.
id: pg-cursores
categories: PostgreSQL,Bancos de Dados
tags: postgresql,plpgsql,cursor,refcursor,fetch,found,scroll,import-csv
status: Published
authors: Rodrigo Bossini
last updated: 2022-06-06
pdf: postgresql/16_apostila_pbd_cursores.pdf
exercicios: postgresql/16_exercicios_pbd_cursores.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# PL/pgSQL: cursores

## Visão geral
Duration: 3:00

Neste material, estudaremos **cursores**. Veja a sua documentação oficial em [https://www.postgresql.org/docs/current/plpgsql-cursors.html](https://www.postgresql.org/docs/current/plpgsql-cursors.html).

> **Cursor**
>
> Uma estrutura que encapsula uma consulta e viabiliza a leitura do resultado linha a linha.

Casos de uso típicos são:

* Processamento de consultas com potencial de trazer coleções muito grandes de dados, as quais podem demandar mais memória do que há disponível.
* Criação de funções que devolvem uma referência a um cursor, o que pode ser útil para devolver ao código cliente grandes coleções de tuplas.

### O que você vai aprender

* A diferença entre um `SELECT` regular e um `SELECT` encapsulado por um cursor
* Os passos para usar um cursor: declaração, abertura, recuperação de dados e fechamento
* Como importar um arquivo CSV com o pgAdmin
* Cursores não vinculados (*unbound*), inclusive com queries dinâmicas
* Cursores vinculados (*bound*) e cursores com parâmetros
* A variável especial `FOUND`
* Como fazer `UPDATE` e `DELETE` a partir de um cursor e percorrer o resultado de trás para frente

### O que você vai precisar

* PostgreSQL e pgAdmin 4 instalados
* A base de dados de canais do YouTube (veja o passo "Base de dados para os testes")

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

## SELECTs regulares e cursores
Duration: 5:00

Quando executamos um comando `SELECT` regular, o resultado completo da consulta nos é entregue, como mostra a figura a seguir. Utilizando SQL padrão, não temos como percorrer o resultado linha a linha para aplicar um processamento arbitrário.

![O pgAdmin envia SELECT * FROM tb_pessoas ao PostgreSQL e recebe de volta o resultado inteiro, com as linhas de Ana e Pedro](img/p005-1.webp)

*Figura 2.2.1: num SELECT comum, o cliente recebe o resultado "inteiro".*

Quando executamos um comando `SELECT` encapsulado por um cursor, temos a estrutura necessária para que seja possível percorrer o resultado linha a linha. Veja a figura a seguir.

![Uma tabela de pessoas com uma seta apontando para uma linha: 1. o cursor permite manipular uma linha específica; 2. o cursor pode ser movido e dar acesso a outra tupla; 3. dependendo do tipo do cursor, podemos até movê-lo para uma tupla pela qual já tenha passado](img/p006-1.webp)

*Figura 2.2.2: um cursor aponta para uma linha do resultado e pode ser movido.*

### O que é preciso fazer para usar um cursor

O uso de um cursor se dá por meio dos seguintes passos:

1. **Declaração**: o primeiro passo é declarar o cursor. Ele é sempre do tipo `refcursor`. A especificação do comando `SELECT` pode ser feita agora.
2. **Abertura**: o segundo passo é abrir o cursor. Aqui também é possível especificar o `SELECT` a que o cursor estará vinculado.
3. **Recuperação de dados**: o terceiro passo é a manipulação dos dados. Aqui podemos usar comandos como `FETCH` para obter a linha atual e `MOVE` para mover o cursor para uma linha desejada.
4. **Fechamento**: todo cursor deve ser fechado a fim de que recursos alocados sejam liberados.

## Base de dados para os testes
Duration: 10:00

Para realizar testes utilizando cursores, vamos utilizar a base de dados disponível em [https://www.kaggle.com/datasets/surajjha101/top-youtube-channels-data](https://www.kaggle.com/datasets/surajjha101/top-youtube-channels-data).

Trata-se de uma base de dados que contém informações sobre os canais dos principais "youtubers". As variáveis são as seguintes:

* **rank**: o ranking do canal em função do número de inscritos.
* **youtuber**: nome do youtuber dono do canal.
* **subscribers**: número de inscritos.
* **video views**: número de visualizações de todos os vídeos do canal.
* **video count**: número de vídeos do canal.
* **category**: categoria do canal.
* **started**: ano em que o canal começou as atividades.

Faça o download da base de dados e descompacte para ter acesso ao arquivo CSV.

<aside class="positive">

O arquivo CSV também está disponível na pasta `postgresql` dos materiais, com o nome `16_Top YouTube Channels Data .csv`.

</aside>

### Nova base de dados no PostgreSQL

No pgAdmin, crie um database como na figura a seguir.

![Menu de contexto de Databases com Create e Database destacados](img/p007-1.webp)

*Figura 2.4.1: criando um novo database.*

Escolha um nome apropriado para a base. Ainda no pgAdmin, clique em **Tools >> Query Tool** para ter acesso ao editor. Lembre-se de manter a base de dados criada há pouco selecionada, como na figura a seguir.

![Árvore do pgAdmin com a base pessoal_cursores selecionada e o Query Tool aberto sobre ela](img/p008-1.webp)

*Figura 2.4.2: Query Tool aberto na nova base.*

### Criando uma tabela

O código a seguir mostra como criar uma tabela apropriada para abrigar os dados.

**pgAdmin · Query Tool**

```sql
CREATE TABLE tb_top_youtubers(
    cod_top_youtubers SERIAL PRIMARY KEY,
    rank INT,
    youtuber VARCHAR(200),
    subscribers INT,
    video_views VARCHAR(200),
    video_count INT,
    category VARCHAR(200),
    started INT
);
```

## Importando o CSV
Duration: 6:00

Há diferentes formas para importar os dados de um arquivo `.csv` para uma base gerenciada pelo PostgreSQL. Uma delas é provida pelo próprio pgAdmin. Para utilizar esta funcionalidade, clique com o botão direito na tabela que acaba de criar (se necessário, clique com o direito em **Tables** e escolha **Refresh** para encontrá-la) e escolha a opção **Import/Export Data…**. Veja a figura a seguir.

![Árvore do pgAdmin com Schemas, public, Tables e tb_top_youtubers, e o menu de contexto com Import/Export Data destacado](img/p009-1.webp)

*Figura 2.4.3: abrindo a importação de dados.*

Na tela seguinte, escolha:

* **Import/Export**: Import
* **Filename**: clique na pastinha e navegue até o diretório em que se encontra seu arquivo
* **Header**: clique para informar que o arquivo possui cabeçalho
* **Delimiter**: `,`

Veja a figura a seguir.

![Janela Import/Export data com Import selecionado, o caminho do arquivo CSV em Filename, Header ativado e o delimitador destacado](img/p010-1.webp)

*Figura 2.4.4: opções da importação.*

Ainda nesta tela, clique na aba **Columns**. Como mostra a figura a seguir, clique no **x** próximo à coluna `cod_top_youtubers` para removê-la. Seu valor não será importado do CSV: ele será gerado automaticamente pelo PostgreSQL.

![Aba Columns com a lista de colunas a importar e o x ao lado de cod_top_youtubers destacado](img/p010-2.webp)

*Figura 2.4.5: removendo cod_top_youtubers da lista de colunas importadas.*

Clique em **OK**. A esperança é obter uma mensagem informativa como aquela que a figura a seguir exibe.

![Aviso Import - Copying table data informando a cópia para public.tb_top_youtubers e a mensagem Successfully completed](img/p011-1.webp)

*Figura 2.4.6: importação concluída.*

Apenas clique no **X** para fechá-la. Execute também um `SELECT` para verificar os dados.

## A variável FOUND
Duration: 5:00

Nos exemplos a seguir, faremos uso de uma variável especial chamada `FOUND`. Leia mais sobre ela em [https://www.postgresql.org/docs/current/plpgsql-statements.html](https://www.postgresql.org/docs/current/plpgsql-statements.html). A lista a seguir mostra um resumo sobre a variável `FOUND`, trazido da documentação oficial.

1. A SELECT INTO statement sets FOUND true if a row is assigned, false if no row is returned.
2. A PERFORM statement sets FOUND true if it produces (and discards) one or more rows, false if no row is produced.
3. UPDATE, INSERT, and DELETE statements set FOUND true if at least one row is affected, false if no row is affected.
4. A FETCH statement sets FOUND true if it returns a row, false if no row is returned.
5. A MOVE statement sets FOUND true if it successfully repositions the cursor, false otherwise.
6. A FOR or FOREACH statement sets FOUND true if it iterates one or more times, else false. FOUND is set this way when the loop exits; inside the execution of the loop, FOUND is not modified by the loop statement, although it might be changed by the execution of other statements within the loop body.
7. RETURN QUERY and RETURN QUERY EXECUTE statements set FOUND true if the query returns at least one row, false if no row is returned.
8. Other PL/pgSQL statements do not change the state of FOUND. Note in particular that EXECUTE changes the output of GET DIAGNOSTICS, but does not change FOUND.
9. FOUND is a local variable within each PL/pgSQL function; any changes to it affect only the current function.

*Tabela 2.5.1: resumo sobre a variável FOUND (documentação do PostgreSQL).*

## Cursor não vinculado (unbound)
Duration: 8:00

### Exibindo os nomes dos youtubers

Nesta seção vamos criar um cursor para fazer a exibição dos nomes dos youtubers. Dizemos que o cursor em questão é "não vinculado" por não estar associado a nenhuma query no momento da declaração. Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
DO $$
DECLARE
    --1. declaração do cursor
    --esse cursor é unbound por não ser associado a nenhuma query
    cur_nomes_youtubers REFCURSOR;
    --para armazenar o nome do youtuber a cada iteração
    v_youtuber VARCHAR(200);
BEGIN
    --2. abertura do cursor
    OPEN cur_nomes_youtubers FOR
        SELECT youtuber
        FROM
        tb_top_youtubers;

    LOOP
        --3. Recuperação dos dados de interesse
        FETCH cur_nomes_youtubers INTO v_youtuber;
        --FOUND é uma variável especial que indica
        EXIT WHEN NOT FOUND;
        RAISE NOTICE '%', v_youtuber;

    END LOOP;
    --4. Fechamento do cursos
    CLOSE cur_nomes_youtubers;
END;
$$
```

### Query dinâmica: youtubers que começaram a partir de um ano

Vejamos como criar um cursor capaz de operar com uma query qualquer, especificada como uma string. O código a seguir exibe os nomes dos youtubers que começaram a partir de um ano específico.

**pgAdmin · Query Tool**

```sql
DO $$
DECLARE
    cur_nomes_a_partir_de REFCURSOR;
    v_youtuber VARCHAR(200);
    v_ano INT := 2008;
    v_nome_tabela VARCHAR(200) := 'tb_top_youtubers';
BEGIN
    OPEN cur_nomes_a_partir_de FOR EXECUTE
        format
        (
            '
            SELECT
                youtuber
            FROM
                %s
            WHERE started >= $1
            '
            ,
            v_nome_tabela
        ) USING v_ano;
    LOOP

        FETCH cur_nomes_a_partir_de INTO v_youtuber;
        EXIT WHEN NOT FOUND;
        RAISE NOTICE '%', v_youtuber;
    END LOOP;
    CLOSE cur_nomes_a_partir_de;
END;
$$
```

## Cursor vinculado (bound) e parâmetros
Duration: 8:00

### Concatenando nome e número de inscritos

Um cursor é vinculado, ou *bound*, quando, no momento de sua declaração, já especificamos a query a que ficará associado. Neste exemplo, vamos montar uma string contendo os nomes e números de inscritos de cada canal. Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
DO $$
DECLARE
    --cursor vinculado (bound)
    cur_nomes_e_inscritos CURSOR FOR SELECT youtuber, subscribers FROM tb_top_youtubers;
    --capaz de abrigar uma tupla inteira
    --tupla.youtuber nos dá o nome do youtuber
    --tupla.subscribers nos dá o número de inscritos
    tupla RECORD;
    resultado TEXT DEFAULT '';
BEGIN
    OPEN cur_nomes_e_inscritos;
    FETCH cur_nomes_e_inscritos INTO tupla;
    WHILE FOUND LOOP
        resultado := resultado || tupla.youtuber || ':' || tupla.subscribers || ',';
        FETCH cur_nomes_e_inscritos INTO tupla;
    END LOOP;
    CLOSE cur_nomes_e_inscritos;
    RAISE NOTICE '%', resultado;
END;

$$
```

### Parâmetros nomeados e pela ordem

Um cursor pode receber parâmetros. Eles podem ser especificados por ordem e também por nome. No código a seguir, exibimos os nomes dos youtubers que começaram a partir de 2010 e que têm, pelo menos, 60 milhões de inscritos. Ilustramos as duas formas de passagem de parâmetro.

**pgAdmin · Query Tool**

```sql
DO $$
DECLARE
    v_ano INT := 2010;
    v_inscritos INT := 60_000_000;
    cur_ano_inscritos CURSOR (ano INT, inscritos INT) FOR SELECT youtuber FROM tb_top_youtubers WHERE started >= ano AND subscribers >= inscritos;
    v_youtuber VARCHAR(200);
BEGIN
    --execute apenas um dos dois comandos OPEN a seguir
    -- passando argumentos pela ordem
    OPEN cur_ano_inscritos (v_ano, v_inscritos);
    --passando argumentos por nome
    OPEN cur_ano_inscritos (inscritos := v_inscritos, ano := v_ano);
    LOOP
        FETCH cur_ano_inscritos INTO v_youtuber;
        EXIT WHEN NOT FOUND;
        RAISE NOTICE '%', v_youtuber;
    END LOOP;
    CLOSE cur_ano_inscritos;
END;
$$
```

<aside class="negative">

**Dois cuidados antes de executar.** Comente uma das duas linhas `OPEN` (abrir um cursor que já está aberto gera o erro "cursor already in use"). E o literal `60_000_000`, com sublinhados separando os milhares, só é aceito a partir do PostgreSQL 16: em versões anteriores, escreva `60000000`.

</aside>

## UPDATE e DELETE com cursores
Duration: 8:00

O processamento realizado por meio de um cursor pode envolver operações `UPDATE` e `DELETE`. No código a seguir, ilustramos um cursor que:

* remove todas as tuplas em que `video_count` é desconhecido
* exibe as tuplas remanescentes na tabela, de baixo para cima

**pgAdmin · Query Tool**

```sql
DO $$
DECLARE
    cur_delete REFCURSOR;
    tupla RECORD;
BEGIN
    -- scroll para poder voltar ao início
    OPEN cur_delete SCROLL FOR
        SELECT
            *
        FROM
            tb_top_youtubers;
    LOOP
        FETCH cur_delete INTO tupla;
        EXIT WHEN NOT FOUND;
        IF tupla.video_count IS NULL THEN
            DELETE FROM tb_top_youtubers WHERE CURRENT OF cur_delete;
        END IF;
    END LOOP;

    -- loop para exibir item a item, de baixo para cima
    LOOP
        FETCH BACKWARD FROM cur_delete INTO tupla;
        EXIT WHEN NOT FOUND;
        RAISE NOTICE '%', tupla;
    END LOOP;
    CLOSE cur_delete;
END;
$$
```

### Bibliografia

* PostgreSQL: Documentation: 14: PostgreSQL 14.2 Documentation. PostgreSQL, 2022. Disponível em [https://www.postgresql.org/docs/current/index.html](https://www.postgresql.org/docs/current/index.html). Acesso em junho de 2022.

## Exercícios
Duration: 25:00

**1.1** Escreva um cursor que exiba as variáveis `rank` e `youtuber` de toda tupla que tiver `video_count` pelo menos igual a 1000 e cuja `category` seja igual a Sports ou Music.

**1.2** Escreva um cursor que exibe todos os nomes dos youtubers em ordem reversa. Para tal:

* O `SELECT` deverá ordenar em ordem não reversa.
* O cursor deverá ser movido para a última tupla.
* Os dados deverão ser exibidos de baixo para cima.

**1.3** Faça uma pesquisa sobre o anti-pattern chamado **RBAR** (*Row By Agonizing Row*). Explique com suas palavras do que se trata.
