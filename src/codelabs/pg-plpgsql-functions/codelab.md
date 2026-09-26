summary: Functions em PL/pgSQL: criação com CREATE FUNCTION e RETURNS, formas de chamar (SELECT, PERFORM, atribuição), funções recebidas por nome e executadas com EXECUTE e format, as operações "existe" e "todos" sobre coleções VARIADIC e um pequeno sistema bancário.
id: pg-plpgsql-functions
categories: PostgreSQL,Bancos de Dados
tags: postgresql,plpgsql,function,returns,perform,execute,format,variadic,exception
status: Published
authors: Rodrigo Bossini
last updated: 2022-05-10
pdf: postgresql/12_apostila_pbd_plpgsql_functions.pdf
exercicios: postgresql/12_exercicios_pbd_plpgsql_functions.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# PL/pgSQL: functions

## Visão geral
Duration: 3:00

Neste material, estudaremos blocos de código denominados **functions**. Uma function é um dos tipos de blocos de código armazenados pelo servidor. A página da documentação oficial sobre o assunto está em [https://www.postgresql.org/docs/current/sql-createfunction.html](https://www.postgresql.org/docs/current/sql-createfunction.html).

### O que você vai aprender

* Como criar uma function com `CREATE FUNCTION ... RETURNS`
* As formas de chamar uma function: `SELECT`, `PERFORM`, atribuição e `SELECT ... INTO`
* Como receber o nome de uma function por parâmetro e executá-la com `EXECUTE` e `format`
* Como implementar os operadores "existe" (*some*) e "todos" (*all*) sobre coleções `VARIADIC`
* Como implementar o funcionamento básico de um sistema bancário com functions e tratamento de exceções

### O que você vai precisar

* PostgreSQL e pgAdmin 4 instalados
* Saber escrever blocos anônimos e stored procedures em PL/pgSQL

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

*Figura 2.2.1: bloco armazenado pelo cliente. A cada requisição, o cliente envia o bloco inteiro para o servidor.*

Há também diferentes tipos de blocos armazenados pelo servidor. Um desses tipos leva o nome de **function**. Veja a figura a seguir.

![O pgAdmin envia uma única vez o CREATE FUNCTION somar, com RETURNS INTEGER, ao PostgreSQL, que armazena o bloco; depois, basta enviar SELECT somar com os parâmetros](img/p006-1.webp)

*Figura 2.2.2: function armazenada pelo servidor. O cliente solicita sua criação uma única vez; depois, apenas especifica o nome (e eventuais parâmetros) para solicitar sua execução.*

## Olá, functions!
Duration: 6:00

O código a seguir mostra como fazer a criação de uma function que devolve uma mensagem simples e as diferentes formas de chamá-la.

**pgAdmin · Query Tool**

```sql
CREATE FUNCTION fn_hello ( ) RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN 'Hello, functions';
END;
$$;

--chamado sem bloco anônimo
--resultado é uma tabela
SELECT fn_hello();

--chamando com bloco anônimo
DO $$
DECLARE
    resultado TEXT;
BEGIN
    --não pode, call somente para procs
    --CALL fn_hello();
    --executa descartando..
    PERFORM fn_hello();
    --assim pode
    resultado := fn_hello();
    RAISE NOTICE '%', resultado;
    --assim também
    SELECT fn_hello() INTO resultado;
    RAISE NOTICE '%', resultado;
END;
$$
```

### Geração de valores aleatórios

A função do código a seguir gera um valor inteiro aleatório no intervalo especificado.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE FUNCTION fn_valor_aleatorio_entre (lim_inferior INT, lim_superior INT) RETURNS INT AS
$$
BEGIN
    RETURN FLOOR(RANDOM() * (lim_superior - lim_inferior + 1) + lim_inferior)::INT;
END;
$$ LANGUAGE plpgsql;

SELECT fn_valor_aleatorio_entre (2, 10);
```

### Verificando paridade

A função do código a seguir responde se um número inteiro recebido por parâmetro é par.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE FUNCTION fn_ehPar (IN n INT) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN n % 2 = 0;
END;
$$;

SELECT fn_ehPar(2);
```

## Função como parâmetro
Duration: 6:00

Uma função pode receber o nome de outra como parâmetro e colocá-la em execução com `EXECUTE`. No exemplo do código a seguir, a função definida recebe o nome de outra como parâmetro e a coloca em execução. Observe que ela também recebe um parâmetro que servirá de argumento para a função que ela coloca em execução.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE FUNCTION fn_Executa(IN fn_nomeFuncaoAExecutar TEXT, IN n INT) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    resultado BOOLEAN;
BEGIN
    --EXECUTE 'SELECT ' || fn_nomeFuncaoAExecutar || '(' || n || ')' INTO resultado;

    --também pode ser assim
    --%s: string, %I: identificador (nome de variável), %L: valor literal
    EXECUTE format('SELECT %s (%s)', fn_nomeFuncaoAExecutar, n) INTO resultado;
    RETURN resultado;
END;
$$;

SELECT fn_Executa ('fn_ehPar', 4);
```

## Some e all
Duration: 8:00

É muito comum implementar os operadores "existe" e "qualquer", comumente utilizados na teoria dos conjuntos. Eles funcionam assim:

* **Existe**: dado um conjunto, existe pelo menos um elemento nele que possui determinada propriedade?
* **Qualquer**: dado um conjunto, é verdade que todos os seus elementos possuem determinada propriedade?

No código a seguir, implementamos uma função que recebe uma coleção (`VARIADIC`) e responde se pelo menos um dos elementos especificados possui a propriedade descrita pela função cujo nome é recebido como primeiro parâmetro.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE FUNCTION fn_some(IN fn_funcao TEXT, VARIADIC elementos INT[]) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    elemento INT;
    resultado boolean;
BEGIN
    FOREACH elemento IN ARRAY elementos LOOP
        EXECUTE format ('SELECT %s (%s)', fn_funcao, elemento) INTO resultado;
        IF resultado = TRUE THEN
            RETURN TRUE;
        END IF;
    END LOOP;
    RETURN FALSE;
END;
$$;

DO $$
DECLARE
    resultado BOOLEAN;
BEGIN
    SELECT fn_some ('fn_ehPar', 1, 2) INTO resultado;
    RAISE NOTICE '%', resultado;
    SELECT fn_some ('fn_ehPar', 1, 3, 5) INTO resultado;
    RAISE NOTICE '%', resultado;
END;
$$
```

O código a seguir, por sua vez, verifica se todos os elementos da coleção possuem a propriedade descrita pela função cujo nome é recebido como parâmetro.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE FUNCTION fn_all (IN fn_funcao TEXT, VARIADIC elementos INT []) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    elemento INT;
    resultado BOOLEAN;
BEGIN
    FOREACH elemento IN ARRAY elementos LOOP
        EXECUTE format ('SELECT %s (%s)', fn_funcao, elemento) INTO resultado;
        IF NOT resultado THEN
            RETURN FALSE;
        END IF;
    END LOOP;
    RETURN TRUE;
END;
$$;

DO $$
DECLARE
    resultado BOOLEAN;
BEGIN
    SELECT fn_all ('fn_ehPar', 1, 2, 3, 4, 5, 6) INTO resultado;
    RAISE NOTICE '%', resultado;
    SELECT fn_all ('fn_ehPar', 2, 4, 6) INTO resultado;
    RAISE NOTICE '%', resultado;
END;
$$
```

## Sistema bancário: tabelas
Duration: 6:00

A seguir, implementaremos o funcionamento básico de um sistema bancário. O modelo de dados aparece na figura a seguir.

![DER do sistema bancário: Cliente (código, nome) 1 para N Conta (código, status, data de criação, data da última transação, saldo); Conta N para 1 Tipo (código, descrição)](img/p010-1.webp)

*Figura 2.8.1: modelo de dados do sistema bancário.*

Veja a implementação das tabelas no código a seguir.

**pgAdmin · Query Tool**

```sql
CREATE TABLE tb_cliente(
    cod_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL
);
INSERT INTO tb_cliente (nome) VALUES ('João Santos'), ('Maria Andrade');
SELECT * FROM tb_cliente;

CREATE TABLE tb_tipo_conta(
    cod_tipo_conta SERIAL PRIMARY KEY,
    descricao VARCHAR(200) NOT NULL
);

INSERT INTO tb_tipo_conta (descricao) VALUES ('Conta Corrente'), ('Conta Poupança');
SELECT * FROM tb_tipo_conta;

CREATE TABLE tb_conta (
    cod_conta SERIAL PRIMARY KEY,
    status VARCHAR(200) NOT NULL DEFAULT 'aberta',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_transacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    saldo NUMERIC(10, 2) NOT NULL DEFAULT 1000 CHECK (saldo >= 1000),
    cod_cliente INT NOT NULL,
    cod_tipo_conta INT NOT NULL,
    CONSTRAINT fk_cliente FOREIGN KEY (cod_cliente) REFERENCES tb_cliente(cod_cliente),
    CONSTRAINT fk_tipo_conta FOREIGN KEY (cod_tipo_conta) REFERENCES tb_tipo_conta(cod_tipo_conta)
);
SELECT * FROM tb_conta;
```

<aside class="negative">

Se você já criou uma tabela `tb_cliente` no codelab de stored procedures (sistema do restaurante), use outra base de dados ou remova a tabela antiga antes de criar esta.

</aside>

## Sistema bancário: abrindo uma conta
Duration: 6:00

A função do código a seguir faz a criação de uma conta, desde que o saldo inicial seja válido. Observe o tratamento feito com o bloco `EXCEPTION`.

**pgAdmin · Query Tool**

```sql
DROP FUNCTION IF EXISTS fn_abrir_conta;
CREATE OR REPLACE FUNCTION fn_abrir_conta (IN p_cod_cli INT, IN p_saldo NUMERIC(10, 2), IN p_cod_tipo_conta INT) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO tb_conta (cod_cliente, saldo, cod_tipo_conta) VALUES ($1, $2, $3);
    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

DO $$
DECLARE
    v_cod_cliente INT := 1;
    v_saldo NUMERIC (10, 2) := 500;
    v_cod_tipo_conta INT := 1;
    v_resultado BOOLEAN;
BEGIN
    SELECT fn_abrir_conta (v_cod_cliente, v_saldo, v_cod_tipo_conta) INTO v_resultado;
    RAISE NOTICE '%', format('Conta com saldo R$%s%s foi aberta', v_saldo, CASE WHEN v_resultado THEN '' ELSE ' não' END);
    v_saldo := 1000;
    SELECT fn_abrir_conta (v_cod_cliente, v_saldo, v_cod_tipo_conta) INTO v_resultado;
    RAISE NOTICE '%', format('Conta com saldo R$%s%s foi aberta', v_saldo, CASE WHEN v_resultado THEN '' ELSE ' não' END);
END;
$$
```

A primeira tentativa viola a restrição `CHECK (saldo >= 1000)`; a exceção é capturada e a função devolve `FALSE`. A segunda tentativa abre a conta.

## Sistema bancário: depositando valores
Duration: 6:00

A função do código a seguir faz o depósito de um valor em uma conta especificada.

**pgAdmin · Query Tool**

```sql
--routine se aplica a funções e procedimentos
DROP ROUTINE IF EXISTS fn_depositar;
CREATE OR REPLACE FUNCTION fn_depositar (IN p_cod_cliente INT, IN p_cod_conta INT, IN p_valor NUMERIC(10, 2)) RETURNS NUMERIC(10, 2)
LANGUAGE plpgsql
AS $$
DECLARE
    v_saldo_resultante NUMERIC(10, 2);
BEGIN
    UPDATE tb_conta SET saldo = saldo + p_valor WHERE cod_cliente = p_cod_cliente AND cod_conta = p_cod_conta;
    SELECT saldo FROM tb_conta c WHERE c.cod_cliente = p_cod_cliente AND c.cod_conta = p_cod_conta INTO v_saldo_resultante;
    RETURN v_saldo_resultante;
END;
$$;

DO $$
DECLARE
    v_cod_cliente INT := 1;
    v_cod_conta INT := 2;
    v_valor NUMERIC(10, 2) := 200;
    v_saldo_resultante NUMERIC (10, 2);
BEGIN
    SELECT fn_depositar (v_cod_cliente, v_cod_conta, v_valor) INTO v_saldo_resultante;
    RAISE NOTICE '%', format('Após depositar R$%s, o saldo resultante é de R$%s', v_valor, v_saldo_resultante);

END;
$$
```

### Bibliografia

* LOPES, A.; GARCIA, G. **Introdução à Programação: 500 Algoritmos Resolvidos**. 1ª ed. Elsevier, 2002.
* PostgreSQL: Documentation: 14: PostgreSQL 14.2 Documentation. PostgreSQL, 2022. Disponível em [https://www.postgresql.org/docs/current/index.html](https://www.postgresql.org/docs/current/index.html). Acesso em maio de 2022.

## Exercícios
Duration: 30:00

**1.1** Escreva a seguinte função.

* **nome**: `fn_consultar_saldo`
* **recebe**: código de cliente, código de conta
* **devolve**: o saldo da conta especificada

**1.2** Escreva a seguinte função.

* **nome**: `fn_transferir`
* **recebe**: código de cliente remetente, código de conta remetente, código de cliente destinatário, código de conta destinatário, valor da transferência
* **devolve**: um booleano que indica se a transferência ocorreu ou não. Uma transferência somente pode acontecer se nenhuma conta envolvida ficar no negativo.

**1.3** Escreva blocos anônimos para testar cada função.
