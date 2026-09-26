summary: Triggers em PL/pgSQL: eventos, momentos (BEFORE, AFTER, INSTEAD OF) e níveis (ROW, STATEMENT), funções de trigger, variáveis especiais como NEW, OLD e TG_ARGV, o papel do RETURN e um sistema com validação e auditoria.
id: pg-plpgsql-triggers
categories: PostgreSQL,Bancos de Dados
tags: postgresql,plpgsql,trigger,before,after,new,old,auditoria,sequence
status: Published
authors: Rodrigo Bossini
last updated: 2022-05-29
pdf: postgresql/14_apostila_pbd_plpgsql_triggers.pdf
exercicios: postgresql/14_exercicios_pbd_plpgsql_triggers.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# PL/pgSQL: triggers

## Visão geral
Duration: 3:00

Neste material, estudaremos blocos de código denominados **triggers**. Um trigger é um dos tipos de blocos de código armazenados pelo servidor. A página da documentação oficial sobre o assunto está em [https://www.postgresql.org/docs/current/sql-createtrigger.html](https://www.postgresql.org/docs/current/sql-createtrigger.html).

### O que você vai aprender

* O que é um trigger e quais eventos podem dispará-lo
* Os momentos `BEFORE`, `AFTER` e `INSTEAD OF` e os níveis `ROW` e `STATEMENT`
* Vantagens e desvantagens do uso de triggers
* Como escrever uma função `RETURNS TRIGGER` e vinculá-la a uma tabela com `CREATE TRIGGER`
* Onde encontrar funções de trigger e triggers no pgAdmin
* As variáveis especiais `NEW`, `OLD`, `TG_NAME`, `TG_LEVEL`, `TG_ARGV` e outras
* A importância do valor devolvido por uma função de trigger
* Como implementar validação e auditoria com triggers, e por que sequences podem ter lacunas

### O que você vai precisar

* PostgreSQL 14 ou superior e pgAdmin 4 (os exemplos usam `CREATE OR REPLACE TRIGGER`, disponível a partir da versão 14)
* Saber escrever functions em PL/pgSQL

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

## Blocos armazenados no cliente e no servidor
Duration: 4:00

Há blocos de código que são armazenados pelo próprio cliente, geralmente num arquivo de extensão `.sql`. Veja a figura a seguir.

![O script armazenado pelo cliente num arquivo .sql é enviado inteiro pelo pgAdmin ao PostgreSQL a cada requisição](img/p005-1.webp)

*Figura 2.2.1: bloco armazenado pelo cliente.*

Há também diferentes tipos de blocos armazenados pelo servidor. Um desses tipos leva o nome de **trigger**. Veja a figura a seguir.

![O cliente cria a tabela tb_pessoa e um trigger tg_meu_trigger associado a ela, que fica armazenado no servidor; a cada nova operação INSERT, o trigger dispara automaticamente](img/p006-1.webp)

*Figura 2.2.2: o trigger fica armazenado no servidor, associado a uma tabela, e dispara automaticamente a cada nova operação.*

## Características dos triggers
Duration: 10:00

Esta seção apresenta as principais características dos triggers.

> **Trigger**
>
> Um bloco de código armazenado pelo servidor que executa automaticamente quando um evento específico acontece.

<aside class="positive">

**Nota.** Diferente de functions e stored procedures, triggers não podem ser chamados explicitamente pelo programador.

</aside>

* **Evento**: os eventos que podem causar a execução automática de um trigger são `INSERT`, `UPDATE`, `DELETE` e `TRUNCATE`.
* **Quando?** Um trigger pode executar automaticamente:
  * antes (`BEFORE`) de as restrições serem verificadas e antes de o evento especificado acontecer;
  * depois (`AFTER`) de as restrições serem verificadas e depois de o evento especificado acontecer;
  * ao invés (`INSTEAD OF`) do evento especificado.
* **Nível**: um trigger pode ter um de dois níveis:
  * `ROW`: o trigger executa uma vez para cada linha (*row*) envolvida na operação;
  * `STATEMENT`: o trigger executa uma única vez mesmo nos casos em que múltiplas linhas são envolvidas na operação.

<aside class="positive">

**Nota.** O nível `STATEMENT` é o padrão caso nenhum seja especificado.

</aside>

A tabela a seguir, retirada da documentação oficial, faz um resumo das possíveis combinações.

| When | Event | Row-level | Statement-level |
| --- | --- | --- | --- |
| BEFORE | INSERT/UPDATE/DELETE | Tables and foreign tables | Tables, views, and foreign tables |
| BEFORE | TRUNCATE | — | Tables |
| AFTER | INSERT/UPDATE/DELETE | Tables and foreign tables | Tables, views, and foreign tables |
| AFTER | TRUNCATE | — | Tables |
| INSTEAD OF | INSERT/UPDATE/DELETE | Views | — |
| INSTEAD OF | TRUNCATE | — | — |

*Tabela 2.3.1: combinações de momento, evento e nível (documentação do PostgreSQL).*

<aside class="positive">

**Nota.** *Foreign Table* é um mecanismo utilizado para acesso a tabelas definidas em servidores remotos, inclusive diferentes do PostgreSQL, como MySQL ou Oracle. Embora não estejamos abordando o assunto no momento, talvez lhe seja de interesse. Se for o caso, comece visitando a documentação oficial em [https://www.postgresql.org/docs/current/sql-createforeigntable.html](https://www.postgresql.org/docs/current/sql-createforeigntable.html).

</aside>

Mais algumas características:

* Podemos associar um número ilimitado de triggers a uma tabela.
* Quando uma tabela tem a ela associados pelo menos dois triggers, eles são executados em ordem alfabética.
* Triggers não podem receber parâmetros (do jeito tradicional).

### Vantagens e desvantagens

A tabela a seguir mostra algumas vantagens e desvantagens quanto ao uso de triggers.

| Vantagens | Desvantagens |
| --- | --- |
| Implementar triggers é tão simples quanto implementar functions ou stored procedures. | Pode ser difícil descobrir sobre a existência de triggers, o que requer documentação constantemente atualizada. |
| Triggers simplificam a implementação de mecanismos de auditoria: armazenar linhas removidas de uma tabela em uma outra de log, por exemplo. | Evidentemente, a execução de um trigger faz com que a instrução DML envolvida leve maior tempo para terminar. |
| É possível chamar stored procedures e functions a partir de um trigger. | Triggers sempre disparam. Num cenário em que desejamos fazer auditoria envolvendo operações realizadas por uma única function, por exemplo, esse funcionamento pode ser inadequado. |
| Triggers podem fazer referência a tabelas existentes em bancos diferentes (*foreign tables*) e podem ser usados para implementar verificações de integridade, como simular o funcionamento de uma chave estrangeira. | Múltiplos triggers associados a uma única tabela podem tornar a manutenção mais difícil. |
| Triggers podem executar validações "complexas", além dos testes simples que uma restrição `CHECK` pode fazer. Pense numa regra já implementada por uma function, por exemplo. | |
| Triggers podem ser recursivos. O "disparo" de um trigger pode fazer com que ele dispare novamente, o que é particularmente útil em cenários que incluem a implementação de autorreferência. | |

*Tabela 2.3.2: vantagens e desvantagens dos triggers.*

## Primeiros testes: BEFORE INSERT
Duration: 8:00

Triggers são funções associadas a tabelas ou views. Por isso, para esse primeiro teste, vamos criar uma tabela como mostra o código a seguir.

**pgAdmin · Query Tool**

```sql
CREATE TABLE tb_teste_trigger(
    cod_teste_trigger SERIAL PRIMARY KEY,
    texto VARCHAR(200)
);
```

### Função que define o que o trigger deve fazer

O próximo passo para criar um trigger é escrever uma function cujo tipo de retorno é `TRIGGER`. Nela definimos o que o trigger deve fazer. Observe que, neste momento, ainda não há vínculo entre a function e a tabela. Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
--esta função especifica o que o trigger vai fazer
--observe que a function é independente do momento em que o trigger vai disparar
--pode não ser uma boa ideia incluir essa informação (antes de um insert) em seu nome, portanto
CREATE OR REPLACE FUNCTION fn_antes_de_um_insert() RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    --aqui escrevemos o que o trigger deve fazer
    RAISE NOTICE 'Trigger foi chamado antes do INSERT!!';
    --mais sobre isso adiante
    RETURN NULL;
END;
$$
```

### Vínculo entre function e tabela: BEFORE INSERT

A seguir, vinculamos a função à tabela com `CREATE TRIGGER`. É nesse momento que especificamos detalhes como o tipo do evento, o momento em que o trigger dispara e o nível do trigger. Observe que especificamos que o trigger deve disparar antes de uma inserção acontecer. Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
--aqui associamos o trigger à tabela de interesse
CREATE OR REPLACE TRIGGER tg_antes_do_insert
-- antes de uma inserção acontecer na tabela tb_teste_trigger
BEFORE INSERT ON tb_teste_trigger
--executa apenas uma vez
FOR EACH STATEMENT
--aqui não faz diferença usar PROCEDURE OU FUNCTION
--mas não pode usar ROUTINE
EXECUTE PROCEDURE fn_antes_de_um_insert();
```

### Fazendo um INSERT

Um comando `INSERT` deve fazer com que o trigger dispare. Veja o código a seguir. O resultado esperado aparece na figura logo depois.

**pgAdmin · Query Tool**

```sql
INSERT INTO tb_teste_trigger (texto) VALUES ('testando trigger..');
```

![Aba Messages com NOTICE: Trigger foi chamado antes do INSERT!!, INSERT 0 1 e Query returned successfully](img/p010-1.webp)

*Figura 2.4.1: o trigger BEFORE disparou.*

## AFTER INSERT e ordem de execução
Duration: 8:00

Nos códigos a seguir, criamos outro trigger associado à mesma tabela. Ele dispara após a ocorrência de uma inserção.

<aside class="negative">

**Nota.** Neste momento, pode ser tentador fazer algo parecido com o seguinte:

`CREATE OR REPLACE FUNCTION fn_antes_de_um_insert(texto VARCHAR(200))`

Ou seja, permitir que a função receba o texto que vai exibir. Entretanto, isso não é possível para esse tipo de função. Caso tente fazer isso, você deve ver uma mensagem de erro parecida com aquela exibida na figura a seguir. Observe que a própria mensagem já sugere como resolver o problema: usando os parâmetros `TG_NARGS` e `TG_ARGV`, os quais não são objeto de estudo ainda.

</aside>

![Mensagem ERROR: funções de gatilho não podem ter argumentos declarados, com a dica de que os argumentos de um gatilho podem ser acessados através de TG_NARGS e TG_ARGV](img/p010-2.webp)

*Figura 2.4.2: funções de trigger não podem ter argumentos declarados.*

**pgAdmin · Query Tool · primeiro a função**

```sql
--primeiro a função
CREATE OR REPLACE FUNCTION fn_depois_de_um_insert()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
    RAISE NOTICE 'Trigger foi chamado depois do INSERT!!';
    RETURN NULL;
END;
$$
```

**pgAdmin · Query Tool · depois o vínculo**

```sql
--depois o vínculo da função à tabela
CREATE OR REPLACE TRIGGER tg_depois_do_insert
AFTER INSERT ON tb_teste_trigger
FOR STATEMENT
EXECUTE FUNCTION fn_depois_de_um_insert();
```

**pgAdmin · Query Tool · inserindo**

```sql
--inserindo
INSERT INTO tb_teste_trigger (texto) VALUES ('testando trigger..');
```

Veja o resultado na figura a seguir.

![Aba Messages com os avisos Trigger foi chamado antes do INSERT!! e Trigger foi chamado depois do INSERT!!, seguidos de INSERT 0 1](img/p011-1.webp)

*Figura 2.4.3: os triggers BEFORE e AFTER disparam em torno do INSERT.*

### Execução em ordem alfabética

Neste passo, vamos verificar a ordem de execução dos triggers. Para tal, crie os dois triggers do código a seguir.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE TRIGGER tg_antes_do_insert2
BEFORE INSERT ON tb_teste_trigger
FOR EACH STATEMENT
EXECUTE PROCEDURE fn_antes_de_um_insert();

CREATE OR REPLACE TRIGGER tg_depois_do_insert2
AFTER INSERT ON tb_teste_trigger
FOR EACH STATEMENT
EXECUTE FUNCTION fn_depois_de_um_insert();
```

A seguir, execute um novo `INSERT`, como no código a seguir.

**pgAdmin · Query Tool**

```sql
INSERT INTO tb_teste_trigger (texto) VALUES ('testando trigger..');
```

O resultado esperado aparece na figura a seguir.

![Aba Messages com dois avisos antes do INSERT e dois avisos depois do INSERT](img/p012-1.webp)

*Figura 2.4.4: com dois triggers de cada tipo, cada aviso aparece duas vezes.*

## Triggers no pgAdmin
Duration: 4:00

No pgAdmin, podemos encontrar tanto as definições das funções que especificam o que os triggers devem fazer quanto as definições dos próprios triggers. As funções ficam na seção **Trigger Functions**, como mostra a figura a seguir. Se necessário, clique com o botão direito em Trigger Functions e escolha **Refresh**.

![Árvore do pgAdmin com a seção Trigger Functions expandida, mostrando fn_antes_de_um_insert e fn_depois_de_um_insert](img/p013-1.webp)

*Figura 2.4.5: as funções de trigger no pgAdmin.*

Por outro lado, um trigger é sempre associado a uma estrutura como uma tabela. Por isso, precisamos encontrar a estrutura a que ele está associado primeiro. Na figura a seguir, veja como primeiro encontramos a tabela a que o trigger está vinculado para depois encontrá-lo na seção **Triggers**. Se necessário, clique com o botão direito em Triggers e escolha **Refresh**.

![Árvore do pgAdmin com Tables, tb_teste_trigger e sua seção Triggers expandida, mostrando os quatro triggers criados](img/p014-1.webp)

*Figura 2.4.6: os triggers ficam dentro da tabela a que estão vinculados.*

## Argumentos e variáveis especiais
Duration: 8:00

Como destacamos, funções associadas a tabelas por meio de triggers não podem receber parâmetros da maneira convencional. Há, entretanto, um mecanismo que viabiliza a passagem de parâmetros. Além disso, no contexto de uma função assim, há diversas variáveis especiais, sobre as quais estudaremos. Visite [https://www.postgresql.org/docs/current/plpgsql-trigger.html](https://www.postgresql.org/docs/current/plpgsql-trigger.html) para conhecer algumas delas. A tabela a seguir destaca algumas bastante comuns.

| Nome | Finalidade |
| --- | --- |
| `NEW` | É do tipo `RECORD`. Ela dá acesso aos novos dados da tupla que está sendo inserida ou atualizada. Vale `NULL` para operações `DELETE`, por razões óbvias. |
| `OLD` | É do tipo `RECORD`. Ela dá acesso aos antigos dados da tupla que está sendo atualizada ou removida. Vale `NULL` para operações `INSERT`, por razões óbvias. |
| `TG_NAME` | Nome do trigger que disparou. |
| `TG_LEVEL` | Nível do trigger. Pode ser `ROW` ou `STATEMENT`. |
| `TG_WHEN` | Momento do disparo: `BEFORE`, `AFTER` ou `INSTEAD OF`. |
| `TG_TABLE_NAME` | Nome da tabela que sofreu a operação que causou o disparo do trigger. Nota: `TG_RELNAME` tem o mesmo propósito, mas é obsoleta e pode deixar de existir em novas versões da linguagem. |
| `TG_ARGV[]` | É um vetor de tipo `TEXT`. Indexado a partir de zero, contém os parâmetros passados para o trigger. Acessá-lo fora dos limites resulta em `NULL`. |
| `TG_NARGS` | É um inteiro que representa a quantidade de parâmetros entregues ao trigger. |

*Tabela 2.5.1: variáveis especiais disponíveis em funções de trigger.*

<aside class="positive">

Na apostila, `TG_WHEN` aparece descrita como o evento (`INSERT`, `UPDATE` ou `DELETE`). Como a saída dos testes a seguir confirma, ela guarda o **momento** do disparo; o evento fica na variável `TG_OP`.

</aside>

### Preparando o teste

Vejamos quem é quem no seguinte teste. Primeiro, apague todos os dados da tabela como mostra o código a seguir. Reinicie também o contador usado na chave primária, como também destacado. Além disso, remova dois triggers: um `BEFORE` e um `AFTER`.

**pgAdmin · Query Tool**

```sql
--removendo todos os dados
DELETE FROM tb_teste_trigger;

--visualizar detalhes do sequence usado na geração de valores para a tabela
SELECT * FROM tb_teste_trigger_cod_teste_trigger_seq;

--começa do 1 de novo. Use WITH n para começar de n
ALTER SEQUENCE tb_teste_trigger_cod_teste_trigger_seq RESTART WITH 1;

--removendo dois triggers
DROP TRIGGER IF EXISTS tg_antes_do_insert2 ON tb_teste_trigger;
DROP TRIGGER IF EXISTS tg_depois_do_insert2 ON tb_teste_trigger;
```

<aside class="positive">

**Nota.** Para descobrir o nome de seus sequences, expanda **Sequences** como na figura a seguir. Caso deseje, clique com o botão direito sobre uma das sequences e escolha **CREATE Script** para visualizar a forma como ela foi criada.

</aside>

![Árvore do pgAdmin com Sequences expandida, a sequence tb_teste_trigger_cod_teste_trigger_seq selecionada e o menu de contexto com CREATE Script destacado](img/p016-1.webp)

*Figura 2.5.1: encontrando as sequences no pgAdmin.*

O código a seguir mostra um exemplo de criação de sequence, a título de curiosidade. Não precisa executar, apenas inspecione.

**CREATE Script gerado pelo pgAdmin**

```sql
-- SEQUENCE: public.tb_teste_trigger_cod_teste_trigger_seq

-- DROP SEQUENCE IF EXISTS public.tb_teste_trigger_cod_teste_trigger_seq;

CREATE SEQUENCE IF NOT EXISTS public.tb_teste_trigger_cod_teste_trigger_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
    OWNED BY tb_teste_trigger.cod_teste_trigger;

ALTER SEQUENCE public.tb_teste_trigger_cod_teste_trigger_seq
    OWNER TO rodrigo;
```

## Testando as variáveis especiais
Duration: 12:00

### Ajuste nos triggers

O próximo passo consiste em ajustar os triggers para que eles passem alguns valores para as functions que chamam, ainda que elas não possuam coisa alguma em sua lista de parâmetros. Observe que também ajustamos para que os triggers disparem com eventos do tipo `UPDATE`. Assim poderemos ver os dados acessíveis por meio do nome `OLD`. Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
--before trigger
CREATE OR REPLACE TRIGGER tg_antes_do_insert
BEFORE INSERT OR UPDATE ON tb_teste_trigger
FOR EACH STATEMENT
EXECUTE PROCEDURE fn_antes_de_um_insert('Antes: V1', 'Antes: V2');

--after trigger
CREATE OR REPLACE TRIGGER tg_depois_do_insert
AFTER INSERT OR UPDATE ON tb_teste_trigger
FOR EACH STATEMENT
EXECUTE PROCEDURE fn_depois_de_um_insert('Depois: V1', 'Depois: V2', 'Depois: V3');
```

### Ajuste nas functions

As functions passam a exibir os valores existentes nas variáveis especiais. Veja os ajustes do código a seguir.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE FUNCTION fn_antes_de_um_insert() RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    --vamos testar as variáveis agora
    RAISE NOTICE 'Estamos no trigger BEFORE';
    RAISE NOTICE 'OLD: %', OLD;
    RAISE NOTICE 'NEW: %', NEW;
    RAISE NOTICE 'OLD.texto: %', OLD.texto;
    RAISE NOTICE 'NEW.texto: %', NEW.texto;
    RAISE NOTICE 'TG_NAME: %', TG_NAME;
    RAISE NOTICE 'TG_LEVEL: %', TG_LEVEL;
    RAISE NOTICE 'TG_WHEN: %', TG_WHEN;
    RAISE NOTICE 'TG_TABLE_NAME: %', TG_TABLE_NAME;
    RAISE NOTICE 'TG_NARGS: %', TG_NARGS;
    FOR i IN 0..TG_NARGS - 1 LOOP
        RAISE NOTICE '%', TG_ARGV[i];
    END LOOP;
    --deve ser NULL ou algo com a estrutura da tabela
    --é o que vai ser entregue para o próximo trigger ou para a operação alvo
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION fn_depois_de_um_insert()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
    --vamos testar as variáveis agora
    RAISE NOTICE 'Estamos no trigger AFTER';
    RAISE NOTICE 'OLD: %', OLD;
    RAISE NOTICE 'NEW: %', NEW;
    RAISE NOTICE 'OLD.texto: %', OLD.texto;
    RAISE NOTICE 'NEW.texto: %', NEW.texto;
    RAISE NOTICE 'TG_NAME: %', TG_NAME;
    RAISE NOTICE 'TG_LEVEL: %', TG_LEVEL;
    RAISE NOTICE 'TG_WHEN: %', TG_WHEN;
    RAISE NOTICE 'TG_TABLE_NAME: %', TG_TABLE_NAME;
    RAISE NOTICE 'TG_NARGS: %', TG_NARGS;
    FOR i IN 0..TG_NARGS - 1 LOOP
        RAISE NOTICE '%', TG_ARGV[i];
    END LOOP;
    RETURN NEW;
END;
$$
```

Execute uma nova operação de inserção como mostra o código a seguir.

**pgAdmin · Query Tool**

```sql
INSERT INTO tb_teste_trigger (texto) VALUES ('Texto sendo inserido');
```

Observe o resultado que aparece na figura a seguir. Repare que os valores, em grande parte, fazem sentido. Entretanto, as variáveis `NEW` e `OLD` são `NULL`.

![Saída dos triggers de nível STATEMENT: OLD e NEW nulos, TG_NAME, TG_LEVEL STATEMENT, TG_WHEN BEFORE e AFTER, TG_TABLE_NAME tb_teste_trigger, TG_NARGS 2 e 3 e os argumentos Antes: V1, Antes: V2, Depois: V1, Depois: V2, Depois: V3](img/p019-1.webp)

*Figura 2.5.2: em triggers de nível STATEMENT, NEW e OLD são NULL.*

### Mudando o nível para ROW

Os triggers que definimos têm nível `STATEMENT`, o que quer dizer que executam uma única vez por evento, e não uma vez por tupla impactada. Numa única operação de `UPDATE`, por exemplo, múltiplas tuplas podem ser afetadas e, assim, não faz sentido usar `NEW` e `OLD`. Por isso, altere o nível dos dois triggers para `ROW` como no código a seguir.

**pgAdmin · Query Tool**

```sql
--before trigger
CREATE OR REPLACE TRIGGER tg_antes_do_insert
BEFORE INSERT OR UPDATE ON tb_teste_trigger
FOR EACH ROW
EXECUTE PROCEDURE fn_antes_de_um_insert('Antes: V1', 'Antes: V2');

--after trigger
CREATE OR REPLACE TRIGGER tg_depois_do_insert
AFTER INSERT OR UPDATE ON tb_teste_trigger
FOR EACH ROW
EXECUTE PROCEDURE fn_depois_de_um_insert('Depois: V1', 'Depois: V2', 'Depois: V3');
```

Execute uma nova inserção como no código a seguir e veja o resultado, que deve ser parecido com aquele que a figura logo depois exibe.

**pgAdmin · Query Tool**

```sql
INSERT INTO tb_teste_trigger (texto) VALUES ('Texto sendo inserido');
```

![Saída dos triggers de nível ROW no INSERT: OLD nulo, NEW (13,"Texto sendo inserido"), NEW.texto Texto sendo inserido e TG_LEVEL ROW](img/p020-1.webp)

*Figura 2.5.3: no INSERT com nível ROW, NEW traz a nova tupla e OLD é NULL.*

Faça um `UPDATE` como no código a seguir. Certifique-se de utilizar um código existente na tabela. Se necessário, execute um `SELECT` para pegar um.

**pgAdmin · Query Tool**

```sql
UPDATE tb_teste_trigger SET texto='Texto sendo atualizado' WHERE cod_teste_trigger = 1;
```

Veja o resultado na figura a seguir. Observe especialmente os valores de `OLD` e `NEW`.

![Saída dos triggers de nível ROW no UPDATE: OLD e NEW (1,"Texto sendo atualizado") e UPDATE 1](img/p021-1.webp)

*Figura 2.5.4: no UPDATE, OLD e NEW ficam disponíveis.*

## A importância do RETURN
Duration: 6:00

Observe que as nossas functions de trigger devolvem `NEW`. Quando um trigger `BEFORE` devolve algo, ele está passando esse valor para o próximo trigger `BEFORE` ou para a operação alvo. Depois de a operação alvo acontecer, cada trigger `AFTER` entra em cena, e o repasse se dá da mesma forma. Veja a figura a seguir.

![Um INSERT enviado pelo pgAdmin passa pelos triggers tg_before_1, tg_before_2 até tg_before_n, cada um devolvendo NEW (nome Maria, idade 20) ao seguinte; a linha é inserida na tabela e depois passa pelos triggers tg_after_1 a tg_after_n, que também devolvem NEW](img/p022-1.webp)

*Figura 2.6.1: o valor devolvido por cada trigger é repassado ao seguinte e à operação alvo.*

Veja algumas observações importantes sobre o retorno de um trigger.

* Todo trigger deve devolver `NULL` ou um objeto com a mesma estrutura da tabela que sofreu o evento que causou a sua execução.
* Quando um trigger `BEFORE` de nível `ROW` devolve `NULL`, ele sinaliza que as execuções dos triggers seguintes e da própria operação alvo devem ser interrompidas.
* Quando um trigger `BEFORE` associado ao evento `DELETE` dispara, ele deve devolver algo diferente de `NULL` para que a operação aconteça, ainda que o valor que ele devolve não tenha muita serventia. É comum devolver `OLD` nestes casos.

## Auditoria: tabelas e validação de saldo
Duration: 10:00

Suponha que temos uma tabela que armazena dados de pessoas, incluindo valores monetários que possuem. Desejamos registrar em uma tabela todas as movimentações monetárias realizadas: tanto novos cadastros quanto a atualização dos já existentes. O código a seguir cria as tabelas.

**pgAdmin · Query Tool**

```sql
DROP TABLE IF EXISTS tb_pessoa;
CREATE TABLE IF NOT EXISTS tb_pessoa(
    cod_pessoa SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    idade INT NOT NULL,
    saldo NUMERIC(10, 2) NOT NULL
);

DROP TABLE IF EXISTS tb_auditoria;
CREATE TABLE IF NOT EXISTS tb_auditoria(
    cod_auditoria SERIAL PRIMARY KEY,
    cod_pessoa INT NOT NULL,
    nome VARCHAR(200) NOT NULL,
    idade INT NOT NULL,
    saldo_antigo NUMERIC (10, 2),
    saldo_atual NUMERIC(10, 2)
);
```

<aside class="positive">

Na apostila, `tb_auditoria` não tem a coluna `nome`, mas as funções de log mais adiante gravam `NEW.nome` nela. A coluna foi acrescentada aqui para que o exemplo funcione.

</aside>

### Trigger para não permitir valores negativos

Digamos que não é permitido que o saldo de uma pessoa fique negativo. Vamos criar um trigger que faz essa verificação tanto para operações `INSERT` quanto para operações `UPDATE`. Primeiro, crie a function validadora do código a seguir.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE FUNCTION fn_validador_de_saldo()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.saldo >= 0 THEN
        RETURN NEW;
    ELSE
        RAISE NOTICE 'Valor de saldor R$% inválido', NEW.saldo;
        RETURN NULL;
    END IF;
END;
$$
```

A seguir, crie o trigger do código a seguir para fazer o vínculo entre a function e a tabela.

**pgAdmin · Query Tool**

```sql
CREATE TRIGGER tg_validador_de_saldo
BEFORE INSERT OR UPDATE ON tb_pessoa
FOR EACH ROW
EXECUTE PROCEDURE fn_validador_de_saldo();
```

A seguir, tente fazer a operação `INSERT` do código a seguir. Observe que uma das inserções deve falhar, dado o saldo negativo.

**pgAdmin · Query Tool**

```sql
INSERT INTO tb_pessoa
(nome, idade, saldo)
VALUES
('João', 20, 100),
('Pedro', 22, -100),
('Maria', 22, 400);
```

O resultado esperado é o seguinte.

**Resultado (aba Messages)**

```text
NOTICE:  Valor de saldor R$-100.00 inválido
INSERT 0 2

Query returned successfully in 84 msec.
```

Faça um `SELECT` como no código a seguir e veja que as duas pessoas de saldo positivo foram inseridas.

**pgAdmin · Query Tool**

```sql
SELECT * FROM tb_pessoa;
```

## Sequences e lacunas
Duration: 6:00

Observe, entretanto, que pelo fato de termos tentado executar uma operação `INSERT`, o valor da `SEQUENCE` usada para os valores de `cod_pessoa` foi incrementado. Veja o resultado do `SELECT`:

| | cod_pessoa | nome | idade | saldo |
| --- | --- | --- | --- | --- |
| 1 | 1 | João | 20 | 100.00 |
| 2 | 3 | Maria | 22 | 400.00 |

*Figura 2.6.2: o código 2 foi consumido pela inserção que falhou.*

Veja o que a documentação diz a respeito.

> "… sequence objects cannot be used if "gapless" assignment of sequence numbers is needed. …"

Leia mais sobre o assunto em [https://www.postgresql.org/docs/current/sql-createsequence.html](https://www.postgresql.org/docs/current/sql-createsequence.html).

Ou seja, não é viável usar `SEQUENCE`s caso seja necessário que a chave primária não tenha lacunas entre seus valores. Poderíamos pensar em atualizar o valor da sequence manualmente, caso o `INSERT` falhe. A figura a seguir ilustra por que isso não é boa ideia.

![Linha do tempo com duas sessões: a sessão 1 tenta um INSERT (sequence vai a 2) que falha; enquanto ela trabalha, a sessão 2 tenta um INSERT (sequence vai a 3) que dá certo usando o valor 2, quando deveria usar o valor 1; a sessão 1 então volta a sequence de 3 para 2, e sua próxima tentativa de INSERT (sequence vai a 3) falha por violar a chave primária](img/p025-1.webp)

*Figura 2.6.3: atualizar a sequence manualmente não é atômico e, com sessões concorrentes, gera lacunas e violações de chave primária.*

Tente também fazer um `UPDATE` como no código a seguir. Observe que a operação também deve falhar, já que estamos tentando armazenar um valor de saldo negativo.

**pgAdmin · Query Tool**

```sql
UPDATE tb_pessoa SET saldo = -100 WHERE cod_pessoa = 1;
```

Faça um `SELECT` e certifique-se de que os dados permanecem inalterados.

## Auditoria: log de INSERT e UPDATE
Duration: 10:00

### Trigger para fazer log de operações INSERT

Queremos deixar registradas as operações `INSERT` na tabela. Façamos isso com um novo trigger. Comece criando a function do código a seguir.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE FUNCTION fn_log_pessoa_insert()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO tb_auditoria
    (cod_pessoa, nome, idade, saldo_antigo, saldo_atual)
    --lembre-se que é uma função para log de INSERT
    --OLD aqui é NULL
    VALUES (NEW.cod_pessoa, NEW.nome, NEW.idade, NULL, NEW.saldo);
    --vai ser ignorado, mas precisa ter
    RETURN NULL;
END;
$$
```

O trigger aparece a seguir.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE TRIGGER tg_log_pessoa_insert
AFTER INSERT ON tb_pessoa
FOR EACH ROW
    EXECUTE PROCEDURE fn_log_pessoa_insert();
```

Faça novas operações `INSERT`, como no código a seguir. Em seguida, faça um `SELECT` na tabela de auditoria.

**pgAdmin · Query Tool**

```sql
--inserts
INSERT INTO tb_pessoa
(nome, idade, saldo)
VALUES
('João', 20, 100),
('Pedro', 22, 100),
('Maria', 22, 400);

--select
SELECT * FROM tb_auditoria;
```

### Trigger para fazer log de operações UPDATE

O passo a passo para criar um trigger que faz log de operações `UPDATE` é análogo. Comece pela função.

**pgAdmin · Query Tool**

```sql
--função que faz log de operações update na tabela pessoa
CREATE OR REPLACE FUNCTION fn_log_pessoa_update()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN

    INSERT INTO tb_auditoria
    (cod_pessoa, nome, idade, saldo_antigo, saldo_atual)
    VALUES
    (NEW.cod_pessoa, NEW.nome, NEW.idade, OLD.saldo, NEW.saldo);
    RETURN NEW;

END;
$$
```

<aside class="positive">

A apostila termina neste ponto: os dois blocos seguintes (o trigger e o teste do log de `UPDATE`) não aparecem no PDF. Eles seguem o mesmo padrão do log de `INSERT`: um trigger `AFTER UPDATE ON tb_pessoa FOR EACH ROW` que executa `fn_log_pessoa_update()`, seguido de um `UPDATE` em `tb_pessoa` e de um `SELECT` em `tb_auditoria`.

</aside>

### Bibliografia

* PostgreSQL: Documentation: 14: PostgreSQL 14.2 Documentation. PostgreSQL, 2022. Disponível em [https://www.postgresql.org/docs/current/index.html](https://www.postgresql.org/docs/current/index.html). Acesso em maio de 2022.

## Exercícios
Duration: 25:00

**1.1** Adicione uma coluna à tabela `tb_pessoa` chamada `ativo`. Ela indica se a pessoa está ativa no sistema ou não. Ela deve ser capaz de armazenar um valor booleano. Por padrão, toda pessoa cadastrada no sistema está ativa. Se necessário, consulte [https://www.postgresql.org/docs/current/sql-altertable.html](https://www.postgresql.org/docs/current/sql-altertable.html).

**1.2** Associe um trigger de `DELETE` à tabela. Quando um `DELETE` for executado, o trigger deve atribuir `FALSE` à coluna `ativo` das linhas envolvidas. Além disso, o trigger não deve permitir que nenhuma pessoa seja removida.
