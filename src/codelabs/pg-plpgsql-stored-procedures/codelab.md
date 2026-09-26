summary: Stored procedures em PL/pgSQL: blocos armazenados no servidor, CREATE PROCEDURE e CALL, parâmetros IN, OUT, INOUT e VARIADIC, e a implementação do funcionamento básico de um restaurante com procedimentos.
id: pg-plpgsql-stored-procedures
categories: PostgreSQL,Bancos de Dados
tags: postgresql,plpgsql,stored-procedure,call,parametros,in,out,inout,variadic
status: Published
authors: Rodrigo Bossini
last updated: 2022-05-02
pdf: postgresql/11_apostila_pbd_plpgsql_stored_procedures.pdf
exercicios: postgresql/11_exercicios_pbd_plpgsql_stored_procedures.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# PL/pgSQL: stored procedures

## Visão geral
Duration: 3:00

Neste material, estudaremos blocos de código denominados **stored procedures**. Um stored procedure é um dos tipos de blocos de código armazenados pelo servidor. A página da documentação oficial sobre o assunto está em [https://www.postgresql.org/docs/current/sql-createprocedure.html](https://www.postgresql.org/docs/current/sql-createprocedure.html).

### O que você vai aprender

* A diferença entre blocos armazenados no cliente e no servidor
* Como criar um stored procedure com `CREATE OR REPLACE PROCEDURE` e executá-lo com `CALL`
* Os modos de parâmetro `IN`, `OUT` e `INOUT`
* Como receber uma quantidade variável de valores com `VARIADIC`
* Como implementar o funcionamento básico de um restaurante (clientes, pedidos, itens, conta e troco) com procedimentos

### O que você vai precisar

* PostgreSQL e pgAdmin 4 instalados
* Saber escrever blocos anônimos, estruturas de seleção e de repetição em PL/pgSQL

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
Duration: 5:00

Há blocos de código que são armazenados pelo próprio cliente, geralmente num arquivo de extensão `.sql`. Veja a figura a seguir.

![O script armazenado pelo cliente num arquivo .sql é enviado inteiro pelo pgAdmin ao PostgreSQL a cada requisição](img/p005-1.webp)

*Figura 2.2.1: bloco armazenado pelo cliente. A cada requisição, o cliente envia o bloco inteiro para o servidor.*

Há também diferentes tipos de blocos armazenados pelo servidor. Um desses tipos leva o nome de **stored procedure**. Veja a figura a seguir.

![O pgAdmin envia uma única vez o CREATE PROCEDURE somar ao PostgreSQL, que armazena o bloco; depois, basta enviar CALL somar com os parâmetros](img/p006-1.webp)

*Figura 2.2.2: bloco armazenado pelo servidor. O cliente especifica o bloco e solicita sua criação e armazenamento uma única vez; depois, apenas especifica o nome (e eventuais parâmetros) para solicitar sua execução.*

## Olá, procedures!
Duration: 6:00

O código a seguir mostra como fazer a criação de um stored procedure que exibe uma mensagem simples.

**pgAdmin · Query Tool**

```sql
--OR REPLACE: opcional
-- se o proc ainda não existir, ele será criado
-- se já existir, será substituído
CREATE OR REPLACE PROCEDURE sp_ola_procedures()
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE NOTICE 'Olá, procedures';
END;
$$;
```

O resultado esperado se parece com aquele exibido pela figura a seguir.

![pgAdmin com o procedimento sp_ola_procedures listado em Schemas, public, Procedures e, na aba Messages, a saída NOTICE: Olá, procedures](img/p007-1.webp)

*Figura 2.3.1: o procedimento criado e executado.*

O código a seguir, por sua vez, mostra como executar o procedimento criado.

**pgAdmin · Query Tool**

```sql
CALL sp_ola_procedures( );
```

### Usando um parâmetro

Stored procedures podem receber valores como parâmetro. Veja um exemplo no código a seguir.

**pgAdmin · Query Tool**

```sql
-- criando
CREATE OR REPLACE PROCEDURE sp_ola_usuario (nome VARCHAR(200))
LANGUAGE plpgsql
AS $$
BEGIN
    -- acessando parâmetro pelo nome
    RAISE NOTICE 'Olá, %', nome;
    -- assim também vale
    RAISE NOTICE 'Olá, %', $1;
END;
$$;

--colocando em execução
CALL sp_ola_usuario('Pedro');
```

## Parâmetros IN, OUT e INOUT
Duration: 10:00

Os parâmetros de um stored procedure têm um **modo** associado. Veja.

* **IN**: parâmetros de "entrada". Servem para que o cliente possa enviar dados a serem utilizados pelo procedimento. Não podem ser alterados. Quando um parâmetro não tem modo especificado explicitamente, `IN` é o seu modo padrão.
* **OUT**: parâmetros de saída. Podem ser utilizados para que o procedimento devolva valores ao cliente. Diferente dos parâmetros de modo `IN`, eles devem ter valor atribuído antes de o procedimento terminar.
* **INOUT**: é uma combinação dos modos `IN` e `OUT`. Quando o parâmetro tem modo igual a `INOUT`, o cliente é capaz de entregar um valor ao procedimento, que o utiliza em seu processamento e, eventualmente, lhe atribui novo valor, o qual é devolvido ao cliente.

### Parâmetros IN

O procedimento do código a seguir promete calcular o maior valor entre dois parâmetros recebidos.

**pgAdmin · Query Tool**

```sql
--criando
--ambos são IN, pois IN é o padrão
CREATE OR REPLACE PROCEDURE sp_acha_maior (IN valor1 INT, valor2 INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF valor1 > valor2 THEN
        RAISE NOTICE '% é o maior', $1;
    ELSE
        RAISE NOTICE '% é o maior', $2;
    END IF;
END;
$$;

-- colocando em execução
CALL sp_acha_maior (2, 3);
```

### Parâmetros OUT

Observe como os procedimentos não têm um tipo de retorno. De fato, eles não podem fazer uso da instrução `RETURN` para devolver valores. Entretanto, o uso de parâmetros em modo `OUT` permite que um procedimento entregue um resultado ao cliente. Veja o exemplo do código a seguir.

**pgAdmin · Query Tool**

```sql
-- aqui estamos removendo o proc de nome sp_acha_maior para poder reutilizar o nome
DROP PROCEDURE IF EXISTS sp_acha_maior;
CREATE OR REPLACE PROCEDURE sp_acha_maior (OUT resultado INT, IN valor1 INT, IN valor2 INT)
LANGUAGE plpgsql
AS $$
BEGIN
    CASE
        WHEN valor1 > valor2 THEN
            $1 := valor1;
        ELSE
            resultado := valor2;
    END CASE;
END;
$$;

--colocando em execução
DO $$
DECLARE
    resultado INT;
BEGIN
    CALL sp_acha_maior (resultado, 2, 3);
    RAISE NOTICE '% é o maior', resultado;
END;
$$
```

### Parâmetros INOUT

Quando um parâmetro tem modo igual a `INOUT`, como o nome sugere, ele é tanto de entrada quanto de saída. Isso quer dizer que o código cliente pode utilizar um mesmo parâmetro para enviar um valor de interesse para o procedimento operar e esperar que ele (o parâmetro) esteja alterado, armazenando o resultado esperado, quando o procedimento terminar. Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
DROP PROCEDURE IF EXISTS sp_acha_maior;
-- criando
CREATE OR REPLACE PROCEDURE sp_acha_maior (INOUT valor1 INT, IN valor2 INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF valor2 > valor1 THEN
        valor1 := valor2;
    END IF;
END;
$$;

-- colocando em execução
DO
$$
DECLARE
    valor1 INT := 2;
    valor2 INT := 3;

BEGIN
    CALL sp_acha_maior(valor1, valor2);
    RAISE NOTICE '% é o maior', valor1;
END;
$$
```

## Parâmetros VARIADIC
Duration: 5:00

Um parâmetro `VARIADIC` permite que o cliente especifique uma coleção de tamanho maior ou igual a 1. Veja o exemplo do código a seguir.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE PROCEDURE sp_calcula_media ( VARIADIC valores INT [])
LANGUAGE plpgsql
AS $$
DECLARE
    media NUMERIC(10, 2) := 0;
    valor INT;

BEGIN
    FOREACH valor IN ARRAY valores LOOP
        media := media + valor;
    END LOOP;
    --array_length calcula o número de elementos no array. O segundo parâmetro é o número de dimensões dele
    RAISE NOTICE 'A média é %', media / array_length(valores, 1);
END;
$$;

-- 1 parâmetro
CALL sp_calcula_media(1);

-- 2 parâmetros
CALL sp_calcula_media(1, 2);

-- 6 parâmetros
CALL sp_calcula_media(1, 2, 5, 6, 1, 8);

-- não funciona
CALL sp_calcula_media (ARRAY[1, 2]);
```

## Restaurante: tabelas e clientes
Duration: 10:00

A seguir, implementaremos o funcionamento básico de um restaurante utilizando stored procedures. O modelo de dados utilizado aparece na figura a seguir.

![DER do restaurante: Cliente (código, nome) 1 para N Pedido (código, status, data de criação, data de modificação); Pedido N para N Item (código, descrição, valor); Item N para 1 Tipo (código, descrição)](img/p012-1.webp)

*Figura 2.10.1: modelo de dados do restaurante.*

### Criação de tabelas

O código a seguir mostra a criação das tabelas e a inserção de alguns itens.

**pgAdmin · Query Tool**

```sql
DROP TABLE tb_cliente;
CREATE TABLE tb_cliente (
    cod_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL
);

SELECT * FROM tb_pedido;
DROP TABLE tb_pedido;
CREATE TABLE IF NOT EXISTS tb_pedido(
    cod_pedido SERIAL PRIMARY KEY,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR DEFAULT 'aberto',
    cod_cliente INT NOT NULL,
    CONSTRAINT fk_cliente FOREIGN KEY (cod_cliente) REFERENCES tb_cliente(cod_cliente)
);

DROP TABLE tb_tipo_item;
CREATE TABLE tb_tipo_item(
    cod_tipo SERIAL PRIMARY KEY,
    descricao VARCHAR(200) NOT NULL
);
INSERT INTO tb_tipo_item (descricao) VALUES ('Bebida'), ('Comida');
SELECT * FROM tb_tipo_item;

DROP TABLE tb_item;
CREATE TABLE IF NOT EXISTS tb_item(
    cod_item SERIAL PRIMARY KEY,
    descricao VARCHAR(200) NOT NULL,
    valor NUMERIC (10, 2) NOT NULL,
    cod_tipo INT NOT NULL,
    CONSTRAINT fk_tipo_item FOREIGN KEY (cod_tipo) REFERENCES tb_tipo_item(cod_tipo)
);

INSERT INTO tb_item (descricao, valor, cod_tipo) VALUES
('Refrigerante', 7, 1), ('Suco', 8, 1), ('Hamburguer', 12, 2), ('Batata frita', 9, 2);
SELECT * FROM tb_item;

DROP TABLE tb_item_pedido;
CREATE TABLE IF NOT EXISTS tb_item_pedido(
    --surrogate key, assim cod_item pode repetir
    cod_item_pedido SERIAL PRIMARY KEY,
    cod_item INT,
    cod_pedido INT,
    CONSTRAINT fk_item FOREIGN KEY (cod_item) REFERENCES tb_item (cod_item),
    CONSTRAINT fk_pedido FOREIGN KEY (cod_pedido) REFERENCES tb_pedido (cod_pedido)
);
```

<aside class="negative">

Os comandos `DROP TABLE` e o `SELECT * FROM tb_pedido` servem para quando você refaz o exercício. Na primeira execução as tabelas ainda não existem e esses comandos geram erro: execute cada `CREATE TABLE` (e os `INSERT`s) selecionando-os no Query Tool, ou use `DROP TABLE IF EXISTS`.

</aside>

### Cadastro de novos clientes

O código a seguir mostra um procedimento que faz o cadastro de clientes.

**pgAdmin · Query Tool**

```sql
-- cadastro de cliente
-- se um parâmetro com valor DEFAULT é especificado, aqueles que aparecem depois dele também devem ter valor DEFAULT
CREATE OR REPLACE PROCEDURE sp_cadastrar_cliente (IN nome VARCHAR(200), IN codigo INT DEFAULT NULL)
LANGUAGE plpgsql
AS $$
BEGIN
    IF codigo IS NULL THEN
        INSERT INTO tb_cliente (nome) VALUES (nome);
    ELSE
        INSERT INTO tb_cliente (cod_cliente, nome) VALUES (codigo, nome);
    END IF;
END;
$$;
CALL sp_cadastrar_cliente ('João da Silva');
CALL sp_cadastrar_cliente ('Maria Santos');
SELECT * FROM tb_cliente;
```

<aside class="positive">

Na apostila, o `INSERT` do `ELSE` usa a coluna `codigo`, que não existe em `tb_cliente`. Aqui ela foi trocada por `cod_cliente`, o nome real da coluna.

</aside>

## Restaurante: pedidos e itens
Duration: 10:00

### Inserção de novos pedidos, ainda sem itens

O procedimento do código a seguir faz a criação de um pedido para um cliente. A ideia é simular a entrada do cliente no restaurante, momento em que ele pega a sua comanda.

**pgAdmin · Query Tool**

```sql
-- criar um pedido, como se o cliente entrasse no restaurante e pegasse a comanda
CREATE OR REPLACE PROCEDURE sp_criar_pedido (OUT cod_pedido INT, cod_cliente INT)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO tb_pedido (cod_cliente) VALUES (cod_cliente);
    -- obtém o último valor gerado por SERIAL
    SELECT LASTVAL() INTO cod_pedido;
END;
$$;

DO
$$
DECLARE
    --para guardar o código de pedido gerado
    cod_pedido INT;
    -- o código do cliente que vai fazer o pedido
    cod_cliente INT;
BEGIN
    -- pega o código da pessoa cujo nome é "João da Silva"
    SELECT c.cod_cliente FROM tb_cliente c WHERE nome LIKE 'João da Silva' INTO cod_cliente;
    --cria o pedido
    CALL sp_criar_pedido (cod_pedido, cod_cliente);
    RAISE NOTICE 'Código do pedido recém criado: %', cod_pedido;

END;
$$
```

### Adição de item a um pedido

O procedimento do código a seguir viabiliza a associação de itens a um determinado pedido. Ele deve ser chamado quando um cliente desejar um novo item.

**pgAdmin · Query Tool**

```sql
-- adicionar um item a um pedido
CREATE OR REPLACE PROCEDURE sp_adicionar_item_a_pedido (IN cod_item INT, IN cod_pedido INT)
LANGUAGE plpgsql
AS $$
BEGIN
    --insere novo item
    INSERT INTO tb_item_pedido (cod_item, cod_pedido) VALUES ($1, $2);
    --atualiza data de modificação do pedido
    UPDATE tb_pedido p SET data_modificacao = CURRENT_TIMESTAMP WHERE p.cod_pedido = $2;
END;
$$;

CALL sp_adicionar_item_a_pedido (1, 1);
SELECT * FROM tb_item_pedido;
SELECT * FROM tb_pedido;
```

## Restaurante: conta e fechamento
Duration: 10:00

### Cálculo do valor total de um pedido

A qualquer momento, é natural que um cliente queira saber quanto já gastou, especialmente quando for pagar a conta. O procedimento do código a seguir faz as contas para um determinado pedido: o somatório dos valores de seus itens.

**pgAdmin · Query Tool**

```sql
--calcular valor total de um pedido
DROP PROCEDURE sp_calcular_valor_de_um_pedido;
CREATE OR REPLACE PROCEDURE sp_calcular_valor_de_um_pedido (IN p_cod_pedido INT, OUT valor_total INT)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT SUM(valor) FROM
        tb_pedido p
        INNER JOIN tb_item_pedido ip ON
        p.cod_pedido = ip.cod_pedido
        INNER JOIN tb_item i ON
        i.cod_item = ip.cod_item
        WHERE p.cod_pedido = $1
        INTO $2;
END;
$$;

DO $$
DECLARE
    valor_total INT;
BEGIN
    CALL sp_calcular_valor_de_um_pedido(1, valor_total);
    RAISE NOTICE 'Total do pedido %: R$%', 1, valor_total;

END;
$$
```

<aside class="positive">

Na primeira execução, o procedimento ainda não existe e o `DROP PROCEDURE` gera erro. Nesse caso, use `DROP PROCEDURE IF EXISTS` ou execute somente o `CREATE`.

</aside>

### Fechamento do pedido

O procedimento do código a seguir fecha um pedido, desde que o valor entregue pelo cliente seja suficiente para pagar a conta.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE PROCEDURE sp_fechar_pedido (IN valor_a_pagar INT, IN cod_pedido INT)
LANGUAGE plpgsql
AS $$
DECLARE
    valor_total INT;
BEGIN
    --vamos verificar se o valor_a_pagar é suficiente
    CALL sp_calcular_valor_de_um_pedido (cod_pedido, valor_total);
    IF valor_a_pagar < valor_total THEN
        RAISE 'R$% insuficiente para pagar a conta de R$%', valor_a_pagar, valor_total;
    ELSE
        UPDATE tb_pedido p SET
            data_modificacao = CURRENT_TIMESTAMP,
            status = 'fechado'
            WHERE p.cod_pedido = $2;
    END IF;
END;
$$;

DO $$
BEGIN
    CALL sp_fechar_pedido(200, 1);
END;
$$;
SELECT * FROM tb_pedido;
```

## Restaurante: troco
Duration: 8:00

### Cálculo do troco

Embora simples, o cálculo do troco pode ser útil em diferentes contextos. Por isso, pode ser de interesse fazer a implementação usando um procedimento, como mostra o código a seguir.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE PROCEDURE sp_calcular_troco (OUT troco INT, IN valor_a_pagar INT, IN valor_total INT)
LANGUAGE plpgsql
AS $$
BEGIN
    troco := valor_a_pagar - valor_total;
END;
$$;

DO
$$
DECLARE
    troco INT;
    valor_total INT;
    valor_a_pagar INT := 100;
BEGIN
    CALL sp_calcular_valor_de_um_pedido(1, valor_total);
    CALL sp_calcular_troco (troco, valor_a_pagar, valor_total);
    RAISE NOTICE 'A conta foi de R$% e você pagou %, portanto, seu troco é de R$%.', valor_total, valor_a_pagar, troco;
END;
$$
```

### Notas para compor o troco

O código a seguir mostra um procedimento que calcula as notas a serem utilizadas para compor um determinado valor de troco.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE PROCEDURE sp_obter_notas_para_compor_o_troco (OUT resultado VARCHAR(500), IN troco INT)
LANGUAGE plpgsql
AS $$
DECLARE
    notas200 INT := 0;
    notas100 INT := 0;
    notas50 INT := 0;
    notas20 INT := 0;
    notas10 INT := 0;
    notas5 INT := 0;
    notas2 INT := 0;
    moedas1 INT := 0;
BEGIN
    notas200 := troco / 200;
    notas100 := troco % 200 / 100;
    notas50 := troco % 200 % 100 / 50;
    notas20 := troco % 200 % 100 % 50 / 20;
    notas10 := troco % 200 % 100 % 50 % 20 / 10;
    notas5 := troco % 200 % 100 % 50 % 20 % 10 / 5;
    notas2 := troco % 200 % 100 % 50 % 20 % 10 % 5 / 2;
    moedas1 := troco % 200 % 100 % 50 % 20 % 10 % 5 % 2;
    resultado := concat (
        -- E é de escape. Para que \n tenha sentido
        -- || é um operador de concatenação
        'Notas de 200: ',
        notas200 || E'\n',
        'Notas de 100: ',
        notas100 || E'\n',
        'Notas de 50: ',
        notas50 || E'\n',
        'Notas de 20: ',
        notas20 || E'\n',
        'Notas de 10: ',
        notas10 || E'\n',
        'Notas de 5: ',
        notas5 || E'\n',
        'Notas de 2: ',
        notas2 || E'\n',
        'Moedas de 1: ',
        moedas1 || E'\n'
    );
END;
$$;

DO
$$
DECLARE
    resultado VARCHAR(500);
    troco INT := 43;
BEGIN
    CALL sp_obter_notas_para_compor_o_troco (resultado, troco);
    RAISE NOTICE '%', resultado;
END;
$$
```

### Bibliografia

* LOPES, A.; GARCIA, G. **Introdução à Programação: 500 Algoritmos Resolvidos**. 1ª ed. Elsevier, 2002.
* PostgreSQL: Documentation: 14: PostgreSQL 14.2 Documentation. PostgreSQL, 2022. Disponível em [https://www.postgresql.org/docs/current/index.html](https://www.postgresql.org/docs/current/index.html). Acesso em abril de 2022.

## Exercícios
Duration: 30:00

**1.1** Adicione uma tabela de log ao sistema do restaurante. Ajuste cada procedimento para que ele registre:

* a data em que a operação aconteceu
* o nome do procedimento executado

**1.2** Adicione um procedimento ao sistema do restaurante. Ele deve:

* receber um parâmetro de entrada (`IN`) que representa o código de um cliente
* exibir, com `RAISE NOTICE`, o total de pedidos que o cliente tem

**1.3** Reescreva o exercício 1.2 de modo que o total de pedidos seja armazenado em uma variável de saída (`OUT`).

**1.4** Adicione um procedimento ao sistema do restaurante. Ele deve:

* receber um parâmetro de entrada e saída (`INOUT`)
* na entrada, o parâmetro possui o código de um cliente
* na saída, o parâmetro deve possuir o número total de pedidos realizados pelo cliente

**1.5** Adicione um procedimento ao sistema do restaurante. Ele deve:

* receber um parâmetro `VARIADIC` contendo nomes de pessoas
* fazer uma inserção na tabela de clientes para cada nome recebido
* receber um parâmetro de saída que contém o seguinte texto: "Os clientes: Pedro, Ana, João etc foram cadastrados"

Evidentemente, o resultado deve conter os nomes que de fato foram enviados por meio do parâmetro `VARIADIC`.

**1.6** Para cada procedimento criado, escreva um bloco anônimo que o coloca em execução.
