summary: As estruturas de repetição da linguagem PL/pgSQL (LOOP, WHILE, FOR e FOREACH), com EXIT, CONTINUE, rótulos, iteração sobre resultados de SELECT e fatias de arrays com SLICE, além do tratamento de erros com EXCEPTION.
id: pg-plpgsql-repeticao-excecoes
categories: PostgreSQL,Bancos de Dados
tags: postgresql,plpgsql,loop,while,for,foreach,array,exception,raise
status: Published
authors: Rodrigo Bossini
last updated: 2022-04-12
pdf: postgresql/10_apostila_pbd_plpgsql_estruturas_de_repeticao_excecoes.pdf
exercicios: postgresql/10_exercicios_pbd_plpgsql_estruturas_de_repeticao_excecoes.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# PL/pgSQL: estruturas de repetição e exceções

## Visão geral
Duration: 3:00

Neste material, estudaremos as estruturas de repetição presentes na linguagem **PL/pgSQL** e, ao final, a manipulação de erros com `EXCEPTION`. A documentação dessas estruturas pode ser encontrada em [https://www.postgresql.org/docs/current/plpgsql-control-structures.html](https://www.postgresql.org/docs/current/plpgsql-control-structures.html).

### O que você vai aprender

* As estruturas `LOOP`, `WHILE`, `FOR` e `FOREACH`
* Como encerrar e pular iterações com `EXIT`, `EXIT WHEN`, `CONTINUE` e `CONTINUE WHEN`
* Como usar rótulos em loops aninhados
* Como iterar sobre intervalos de inteiros e sobre resultados de um `SELECT`
* Como percorrer arrays e suas fatias com `FOREACH ... SLICE`
* Como tratar e gerar exceções com `EXCEPTION`, `RAISE`, `SQLSTATE` e `SQLERRM`

### O que você vai precisar

* PostgreSQL e pgAdmin 4 instalados
* Saber escrever blocos anônimos e usar estruturas de seleção em PL/pgSQL

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

## Estruturas de repetição e função auxiliar
Duration: 5:00

A linguagem PL/pgSQL possui as seguintes estruturas de repetição.

* `LOOP`
* `WHILE`
* `FOR`
* `FOREACH`

Como veremos, seu uso pode ser combinado com:

* rótulos
* `EXIT`
* `CONTINUE`

### Função para geração de valores aleatórios

Ao longo do material, faremos a geração de valores aleatórios em alguns exemplos. Para tal, utilizaremos a função dada no código a seguir.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE FUNCTION valor_aleatorio_entre (lim_inferior INT, lim_superior INT) RETURNS INT AS
$$
BEGIN
    RETURN FLOOR(RANDOM() * (lim_superior - lim_inferior + 1) + lim_inferior)::INT;
END;
$$ LANGUAGE plpgsql;
```

Basta executar o bloco de código para que a função seja criada. No pgAdmin, verifique a sua existência, como mostra a figura a seguir.

![Árvore do pgAdmin expandida até Functions, com a função valor_aleatorio_entre(lim_inferior integer, lim_superior integer) destacada](img/p006-1.webp)

*Figura 2.3.1: a função criada, vista no pgAdmin.*

Depois de criar a função, você pode testá-la como mostra o código a seguir.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE FUNCTION valor_aleatorio_entre (lim_inferior INT, lim_superior INT) RETURNS INT AS
$$
BEGIN
    RETURN FLOOR(RANDOM() * (lim_superior - lim_inferior + 1) + lim_inferior)::INT;
END;
$$ LANGUAGE plpgsql;

SELECT valor_aleatorio_entre (2, 10);
```

## LOOP, EXIT e CONTINUE
Duration: 8:00

Nesta seção e nas seguintes, veremos alguns exemplos básicos de uso de cada estrutura de repetição de PL/pgSQL.

### LOOP sem teste de continuidade

O código a seguir mostra um exemplo de loop sem condição de continuidade especificada.

**pgAdmin · Query Tool**

```sql
-- Observe como não é condição de continuidade
-- Estamos diante de um loop infinito
DO
$$
BEGIN
    LOOP
        RAISE NOTICE 'Teste loop simples...';
    END LOOP;
END;
$$
```

<aside class="negative">

Este bloco nunca termina sozinho. Se executá-lo, interrompa a execução pelo botão de parar do Query Tool.

</aside>

### LOOP com teste de continuidade usando IF/EXIT

O código a seguir mostra um exemplo em que controlamos o número de repetições com um contador. Seu encerramento é feito combinando-se `IF` e `EXIT`.

**pgAdmin · Query Tool**

```sql
-- Contando de 1 a 10
-- Saída com IF/EXIT
DO
$$
DECLARE
    contador INT := 1;
BEGIN
    LOOP
        RAISE NOTICE '%', contador;
        contador := contador + 1;
        IF contador > 10 THEN
            EXIT;
        END IF;
    END LOOP;
END;$$
```

### LOOP com teste de continuidade usando EXIT/WHEN

Observe, no código a seguir, como a condição de continuidade pode ser expressa combinando-se `EXIT`/`WHEN`, sem necessidade de uso do bloco `IF`.

**pgAdmin · Query Tool**

```sql
-- Contando de 1 a 10
-- Saída com EXIT/WHEN
DO
$$
DECLARE
    contador INT := 1;
BEGIN
    LOOP
        RAISE NOTICE '%', contador;
        contador := contador + 1;
        EXIT WHEN contador > 10;
    END LOOP;
END;
$$
```

### Ignorando iterações com CONTINUE

A construção `CONTINUE` nos possibilita ignorar iterações que tenham uma característica que podemos especificar. Veja dois exemplos no código a seguir.

**pgAdmin · Query Tool**

```sql
DO
$$
DECLARE
    contador INT := 0;
BEGIN
    LOOP
        contador := contador + 1;
        EXIT WHEN contador > 100;
        -- ignorando iteração da vez quando contador for múltiplo de 7 com IF/CONTINUE
        IF contador % 7 = 0 THEN
            CONTINUE;
        END IF;
        --ignorando iteração da vez quando contador for múltiplo de 11 com CONTINUE WHEN
        CONTINUE WHEN contador % 11 = 0;
        RAISE NOTICE '%', contador;
    END LOOP;
END;
$$
```

## Rótulos e loops aninhados
Duration: 6:00

Uma construção `LOOP` pode ter um rótulo associado. Ele pode ser usado pelas construções `EXIT` e `CONTINUE`, as quais funcionam da seguinte forma.

* Quando há um único `LOOP`, elas se referem a ele e o uso de rótulos é opcional.
* Quando há um `LOOP` aninhado, as construções `EXIT` e `CONTINUE` se referem ao mais interno por padrão. Podemos alterar esse funcionamento usando um rótulo.

O código a seguir mostra um exemplo de `LOOP` aninhado que usa rótulos e a construção `EXIT`.

**pgAdmin · Query Tool**

```sql
DO
$$
DECLARE
    i INT;
    j INT;
BEGIN
    i := 0;
    <<externo>>
    LOOP
        i := i + 1;
        EXIT WHEN i > 10;
        j := 1;
        <<interno>>
        LOOP
            RAISE NOTICE '% %', i, j;
            j := j + 1;
            EXIT WHEN j > 10;
            -- j vai contar até 5, o loop externo vai ser interrompido e o programa acaba
            EXIT externo WHEN j > 5;
        END LOOP;
    END LOOP;
END;
$$
```

O código a seguir mostra um exemplo de `LOOP` aninhado em que rótulos e a construção `CONTINUE` são usados.

**pgAdmin · Query Tool**

```sql
DO
$$
DECLARE
    i INT;
    j INT;
BEGIN
    i := 0;
    <<externo>>
    LOOP
        i := i + 1;
        EXIT WHEN i > 10;
        j := 1;
        <<interno>>
        LOOP
            RAISE NOTICE '% %', i, j;
            j := j + 1;
            EXIT WHEN j > 10;
            -- j vai contar até 5, o loop interno vai ser interrompido e prosseguimos para a próxima iteração do loop externo
            CONTINUE externo WHEN j > 5;
        END LOOP;
    END LOOP;
END;
$$
```

## WHILE
Duration: 5:00

A estrutura `WHILE` nos permite especificar uma condição de continuidade num campo apropriado para isso, sem a necessidade de se utilizar a construção `EXIT`. No código a seguir, fazemos o cálculo da média de uma coleção de notas geradas aleatoriamente. A repetição termina quando o valor gerado for negativo.

**pgAdmin · Query Tool**

```sql
DO
$$
DECLARE
    nota INT;
    media NUMERIC(10, 2) := 0;
    contador INT := 0;
BEGIN
    -- inicialmente, valores de 0 a 11
    -- com o -1, temos valores de -1 a 10
    SELECT valor_aleatorio_entre (0, 11) - 1 INTO nota;
    WHILE nota >= 0 LOOP
        RAISE NOTICE '%', nota;
        media := media + nota;
        contador := contador + 1;
        SELECT valor_aleatorio_entre (0, 11) - 1 INTO nota;
    END LOOP;
    IF contador > 0 THEN
        RAISE NOTICE 'Média %.', media / contador;
    ELSE
        RAISE NOTICE 'Nenhuma nota gerada.';
    END IF;
END;
$$
```

O uso de rótulos e das construções `CONTINUE` e `EXIT` funciona para a estrutura `WHILE` da mesma forma como funciona para a estrutura `LOOP`.

## FOR
Duration: 10:00

### Iterando sobre um intervalo de inteiros

Esta versão da estrutura `FOR` nos permite especificar um intervalo de inteiros sobre o qual iterar. Veja alguns exemplos no código a seguir.

**pgAdmin · Query Tool**

```sql
DO
$$
BEGIN
    --repare como não precisamos declarar a variável i
    -- de 1 a 10, pulando de um em um
    RAISE NOTICE 'de 1 a 10, pulando de um em um';
    FOR i IN 1..10 LOOP
        RAISE NOTICE '%', i;
    END LOOP;

    -- E agora? -- não mostra nada
    RAISE NOTICE 'E agora?';
    FOR i IN 10..1 LOOP
        RAISE NOTICE '%', i;
    END LOOP;

    -- de 10 a 1, pulando de um em um
    --repare que, usando reverse, é preciso escrever 10..1 em vez de 1..10.
    RAISE NOTICE 'de 10 a 1, pulando de um em um';
    FOR i IN REVERSE 10..1 LOOP
        RAISE NOTICE '%', i;
    END LOOP;

    -- de 1 a 50, pulando de dois em dois
    RAISE NOTICE 'de 1 a 50, pulando de dois em dois';
    FOR i IN 1..50 BY 2 LOOP
        RAISE NOTICE '%', i;
    END LOOP;

    -- de 50 a 1, pulando de dois em dois
    RAISE NOTICE 'de 50 a 1, pulando de dois em dois';
    FOR i IN REVERSE 50..1 BY 2 LOOP
        RAISE NOTICE '%', i;
    END LOOP;
END;
$$
```

### Iterando sobre resultados de um SELECT

A estrutura `FOR` também pode ser utilizada para iterar sobre resultados obtidos a partir de um `SELECT`. No código a seguir ilustramos isso da seguinte forma.

* criamos uma tabela capaz de armazenar médias de alunos
* criamos um bloco anônimo que popula a tabela com dez valores aleatórios
* criamos um bloco anônimo que ilustra o `FOR` iterando sobre os resultados de um `SELECT`

Observe como cada linha é do tipo `RECORD`.

**pgAdmin · Query Tool**

```sql
--criando a tabela
CREATE TABLE tb_aluno (
    cod_aluno SERIAL PRIMARY KEY,
    nota INT
);

-- gerando dez notas e inserindo na tabela
DO
$$
BEGIN

    ---geramos notas para 10 alunos
    FOR i in 1..10 LOOP
        INSERT INTO tb_aluno (nota) VALUES (valor_aleatorio_entre(0, 10));
    END LOOP;
END;
$$;
--verificando se tudo deu certo até agora
SELECT * FROM tb_aluno;

--calculando a média com um FOR
DO
$$
DECLARE
    aluno RECORD;
    media NUMERIC(10, 2) := 0;
    total INT;
BEGIN
    FOR aluno IN
        SELECT * FROM tb_aluno
    LOOP
        RAISE NOTICE 'Nota: %', aluno.nota;
        media := media + aluno.nota;
    END LOOP;
    SELECT COUNT(*) FROM tb_aluno INTO total;
    RAISE NOTICE 'Média: %', media / total;
END;
$$
```

<aside class="positive">

Se preferir, execute cada parte separadamente: selecione o trecho desejado no Query Tool antes de clicar em executar.

</aside>

## FOREACH e arrays
Duration: 10:00

### Iterando sobre valores de um array

A estrutura `FOREACH` nos permite iterar sobre valores de uma coleção. Para ilustrar o seu funcionamento, vamos calcular a soma dos valores armazenados em um array de 5 posições. Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
DO
$$
DECLARE
    valores INT[] := ARRAY[
        valor_aleatorio_entre(1, 10),
        valor_aleatorio_entre(1, 10),
        valor_aleatorio_entre(1, 10),
        valor_aleatorio_entre(1, 10),
        valor_aleatorio_entre(1, 10)
    ];
    valor INT;
    soma INT := 0;
BEGIN
    FOREACH valor IN ARRAY valores LOOP
        RAISE NOTICE 'Valor da vez: %', valor;
        soma := soma + valor;
    END LOOP;
    RAISE NOTICE 'Soma: %', soma;
END;
$$
```

### Fatias com SLICE

Usando a construção `SLICE`, podemos percorrer "fatias" de um array em PL/pgSQL. O valor de `SLICE` especificado representa o número de dimensões que desejamos que o objeto resultante tenha, a cada iteração. Ele não pode ser maior do que o número de dimensões do objeto original. Veja alguns exemplos no código a seguir.

**pgAdmin · Query Tool**

```sql
DO
$$
DECLARE
    vetor INT[] := ARRAY[1, 2, 3];
    matriz INT[] := ARRAY[
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];
    var_aux INT;
    vet_aux INT[];
BEGIN
    RAISE NOTICE 'SLICE %, vetor', 0;
    -- exemplo sem slice com vetor
    FOREACH var_aux IN ARRAY vetor LOOP
        RAISE NOTICE '%', var_aux;
    END LOOP;

    --exemplo com slice igual a 1, com vetor
    --observe que a variável deve ser um vetor
    --com slice igual a 1, pegamos o vetor inteiro
    RAISE NOTICE 'SLICE %, vetor', 1;
    FOREACH vet_aux SLICE 1 IN ARRAY vetor LOOP
        RAISE NOTICE '%', vet_aux;
        --podemos percorrer vet_aux
        FOREACH var_aux IN ARRAY vet_aux LOOP
            RAISE NOTICE '%', var_aux;
        END LOOP;
    END LOOP;

    --exemplo com slice igual a 0, com matriz
    RAISE NOTICE 'SLICE %, matriz', 0;
    FOREACH var_aux IN ARRAY matriz LOOP
        RAISE NOTICE '%', var_aux;
    END LOOP;

    --exemplo com slice igual a 1, com matriz
    --com slice igual a 1, pegamos um vetor (linha) por vez
    RAISE NOTICE 'SLICE %, matriz', 1;
    FOREACH vet_aux SLICE 1 IN ARRAY matriz LOOP
        RAISE NOTICE '%', vet_aux;
    END LOOP;

    --exemplo com slice igual a 2, com matriz
    --com slice igual a 2, pegamos a matriz inteira numa única iteraçao
    RAISE NOTICE 'SLICE %, matriz', 2;
    FOREACH vet_aux SLICE 2 IN ARRAY matriz LOOP
        RAISE NOTICE '%', vet_aux;
    END LOOP;
END;
$$
```

## Manipulação de erros
Duration: 8:00

Por padrão, quando um erro acontece, o processamento da função atual é interrompido. Podemos especificar um bloco de código a ser executado quando um erro acontecer com a construção `EXCEPTION`.

### Exemplo de divisão por zero

A divisão com divisor igual a zero causa um erro do tipo `division_by_zero`. Veja um programa que faz com que ele aconteça no código a seguir.

**pgAdmin · Query Tool**

```sql
DO
$$
BEGIN
    RAISE NOTICE '%', 1 / 0;
END;
$$
```

O resultado esperado aparece na figura a seguir.

![Mensagem ERROR: division by zero, com o contexto SQL statement SELECT 1 / 0 e SQL state: 22012 destacados](img/p017-1.webp)

*Figura 2.5.1: erro de divisão por zero e seu código SQL state.*

Observe como cada erro possui um código associado. Muitos deles são previstos no padrão SQL. Outros são específicos do PostgreSQL. Veja uma lista completa em [https://www.postgresql.org/docs/current/errcodes-appendix.html](https://www.postgresql.org/docs/current/errcodes-appendix.html).

### Tratando explicitamente

O código a seguir mostra como tratar erros especificando um bloco próprio para isso.

**pgAdmin · Query Tool**

```sql
DO
$$
BEGIN
    RAISE NOTICE '%', 1 / 0;
EXCEPTION
    WHEN division_by_zero THEN
        RAISE NOTICE 'Não é possível fazer divisão por zero.';
END;
$$
```

### Gerando exceções explicitamente

Observe, no código a seguir, como podemos gerar exceções explicitamente.

**pgAdmin · Query Tool**

```sql
DO
$$
DECLARE
    a INT := valor_aleatorio_entre(0, 5);
BEGIN
    IF a = 0 THEN
        RAISE 'a não pode ser zero';
    ELSE
        RAISE NOTICE 'Valor de a: %', a;
    END IF;
EXCEPTION WHEN OTHERS THEN
    --SQLState é o código da Exceção
    --SQLERRM é a mensagem (SQLERRM: SQL Error Message)
    RAISE NOTICE 'exceção: %, %', SQLSTATE, SQLERRM;
END;
$$
```

### Bibliografia

* LOPES, A.; GARCIA, G. **Introdução à Programação: 500 Algoritmos Resolvidos**. 1ª ed. Elsevier, 2002.
* PostgreSQL: Documentation: 14: PostgreSQL 14.2 Documentation. PostgreSQL, 2022. Disponível em [https://www.postgresql.org/docs/current/index.html](https://www.postgresql.org/docs/current/index.html). Acesso em abril de 2022.

## Exercícios
Duration: 30:00

**1.1** Resolva cada exercício a seguir usando `LOOP`, `WHILE`, `FOR` e `FOREACH`. Quando o enunciado disser que é preciso "ler" algum valor, gere-o aleatoriamente.

* [https://www.beecrowd.com.br/judge/pt/problems/view/1059](https://www.beecrowd.com.br/judge/pt/problems/view/1059)
* Gerar inteiros no intervalo de -50 a 50: [https://www.beecrowd.com.br/judge/pt/problems/view/1060](https://www.beecrowd.com.br/judge/pt/problems/view/1060)
* Gerar inteiros no intervalo de 20 a 50: [https://www.beecrowd.com.br/judge/pt/problems/view/1071](https://www.beecrowd.com.br/judge/pt/problems/view/1071)
* Gerar inteiros no intervalo de 1 a 100: [https://www.beecrowd.com.br/judge/pt/problems/view/1101](https://www.beecrowd.com.br/judge/pt/problems/view/1101)

**1.2** Faça um programa que calcule o determinante de uma matriz quadrada de ordem 3 utilizando a regra de Sarrus. Veja a regra aqui: [https://en.wikipedia.org/wiki/Rule_of_Sarrus](https://en.wikipedia.org/wiki/Rule_of_Sarrus).

Preencha a matriz com valores inteiros aleatórios no intervalo de 1 a 12.
