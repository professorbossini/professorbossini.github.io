summary: Operadores lógicos e relacionais, predicados de comparação e as estruturas de seleção da linguagem PL/pgSQL (IF, IF/ELSE, IF/ELSIF/ELSE e as duas formas de CASE), com exercícios resolvidos.
id: pg-plpgsql-selecao
categories: PostgreSQL,Bancos de Dados
tags: postgresql,plpgsql,if,case,operadores-logicos,operadores-relacionais,null,between
status: Published
authors: Rodrigo Bossini
last updated: 2022-04-04
pdf: postgresql/09_apostila_pbd_plpgsql_operadores_logicos_e_relacionais_estruturas_de_selecao.pdf
exercicios: postgresql/09_exercicios_pbd_plpgsql_operadores_logicos_e_relacionais_estruturas_de_selecao.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# PL/pgSQL: operadores lógicos e relacionais e estruturas de seleção

## Visão geral
Duration: 3:00

Neste material, estudaremos as estruturas de seleção presentes na linguagem **PL/pgSQL**, precedidas pelos operadores e predicados usados para escrever as condições.

### O que você vai aprender

* Os operadores lógicos `AND`, `OR` e `NOT`
* Os operadores relacionais e seu comportamento com `NULL`, booleanos e strings
* Os predicados de comparação (`BETWEEN`, `IS DISTINCT FROM`, `IS NULL` e outros)
* As estruturas `IF THEN`, `IF THEN ELSE`, `IF THEN ELSIF THEN ELSE`
* As estruturas `CASE valor WHEN valor THEN ELSE` e `CASE WHEN THEN ELSE`
* Como criar uma função auxiliar para gerar valores aleatórios

### O que você vai precisar

* PostgreSQL e pgAdmin 4 instalados
* Saber escrever blocos anônimos com `DO $$ ... $$`

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

## Operadores lógicos e relacionais
Duration: 10:00

### Operadores lógicos

Os operadores lógicos presentes na linguagem PL/pgSQL são os seguintes.

* `AND`
* `OR`
* `NOT`

A tabela a seguir, que é uma tabela-verdade, relembra o funcionamento deles.

| A | B | A AND B | A OR B | NOT A | NOT B |
| --- | --- | --- | --- | --- | --- |
| TRUE | TRUE | TRUE | TRUE | FALSE | FALSE |
| TRUE | FALSE | FALSE | TRUE | FALSE | TRUE |
| FALSE | TRUE | FALSE | TRUE | TRUE | FALSE |
| FALSE | FALSE | FALSE | FALSE | TRUE | TRUE |

*Tabela 2.2.1: tabela-verdade dos operadores lógicos.*

### Operadores relacionais

A tabela a seguir mostra os operadores relacionais de PL/pgSQL e alguns exemplos.

| Operador | Significado | Exemplo | Resultado |
| --- | --- | --- | --- |
| `<` | Menor | `1 < 2` | TRUE |
| `>` | Maior | `1 > 2` | FALSE |
| `<=` | Menor ou igual | `1 <= 2` | TRUE |
| `>=` | Maior ou igual | `2 >= 2` | TRUE |
| `=` | Igual | `2 = 3` | FALSE |
| `<>` | Diferente | `2 <> 3` | TRUE |
| `!=` | Diferente | `2 != 3` | TRUE |

*Tabela 2.3.1: operadores relacionais.*

<aside class="positive">

**Nota.** O operador `!=` é um pseudônimo (nome fictício) de `<>`. Durante a compilação, ele é substituído por `<>`.

</aside>

<aside class="negative">

**Nota.** Todos os operadores relacionais são binários e devolvem um valor booleano. Como não é possível comparar um valor booleano com um valor inteiro, expressões como `1 < 2 < 3` não são válidas.

</aside>

Quando envolvem `NULL`, todos os operadores relacionais devolvem `NULL`. Veja a tabela a seguir.

| Operador | Exemplo | Resultado |
| --- | --- | --- |
| `<` | `1 < NULL` | NULL |
| `>` | `NULL > 2` | NULL |
| `<=` | `NULL <= 2` | NULL |
| `>=` | `NULL >= 3` | NULL |
| `=` | `NULL = 1` | NULL |
| `<>` | `NULL <> 1` | NULL |
| `!=` | `NULL != 3` | NULL |
| `<` | `NULL < NULL` | NULL |
| `>` | `NULL > NULL` | NULL |
| `<=` | `NULL <= NULL` | NULL |
| `>=` | `NULL >= NULL` | NULL |
| `=` | `NULL = NULL` | NULL |
| `<>` | `NULL <> NULL` | NULL |
| `!=` | `NULL != NULL` | NULL |

*Tabela 2.3.2: operadores relacionais com NULL.*

<aside class="positive">

**Nota.** `NULL` representa um valor desconhecido. Por isso o resultado é também desconhecido.

</aside>

Também é possível comparar valores booleanos. Veja a tabela a seguir.

| A | B | A < B | A > B | A <= B | A >= B | A = B | A <> B | A != B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TRUE | TRUE | FALSE | FALSE | TRUE | TRUE | TRUE | FALSE | FALSE |
| TRUE | FALSE | FALSE | TRUE | FALSE | TRUE | FALSE | TRUE | TRUE |
| FALSE | TRUE | TRUE | FALSE | TRUE | FALSE | FALSE | TRUE | TRUE |
| FALSE | FALSE | FALSE | FALSE | TRUE | TRUE | TRUE | FALSE | FALSE |

*Tabela 2.3.3: comparação entre valores booleanos.*

A tabela a seguir mostra o funcionamento da comparação entre strings.

| A | B | A < B | A > B | A <= B | A >= B | A = B | A <> B | A != B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| bola | carro | TRUE | FALSE | TRUE | FALSE | FALSE | TRUE | TRUE |
| a10 | a9 | TRUE | FALSE | TRUE | FALSE | FALSE | TRUE | TRUE |
| a | A | TRUE | FALSE | TRUE | FALSE | FALSE | TRUE | TRUE |
| a | a | FALSE | FALSE | TRUE | TRUE | TRUE | FALSE | FALSE |

*Tabela 2.3.4: comparação entre strings.*

## Predicados de comparação
Duration: 6:00

A linguagem PL/pgSQL conta com os predicados de comparação ilustrados na tabela a seguir.

| Predicado | Exemplo | Resultado | Observação |
| --- | --- | --- | --- |
| BETWEEN | `2 BETWEEN 1 AND 3` | TRUE | |
| BETWEEN | `2 BETWEEN 1 AND 2` | TRUE | Intervalo fechado |
| NOT BETWEEN | `2 NOT BETWEEN 1 AND 3` | FALSE | |
| NOT BETWEEN | `2 NOT BETWEEN 1 AND 2` | FALSE | |
| BETWEEN | `2 BETWEEN 3 AND 1` | FALSE | |
| BETWEEN SYMMETRIC | `2 BETWEEN SYMMETRIC 3 AND 1` | TRUE | Ordena os dois limites |
| NOT BETWEEN SYMMETRIC | `2 NOT BETWEEN SYMMETRIC 3 AND 1` | FALSE | |
| IS DISTINCT FROM | `2 IS DISTINCT FROM NULL` | TRUE | Tratando null como algo comparável. Resultado é booleano e não NULL. |
| IS DISTINCT FROM | `NULL IS DISTINCT FROM NULL` | FALSE | |
| IS NOT DISTINCT FROM | `2 IS NOT DISTINCT FROM NULL` | FALSE | |
| IS NOT DISTINCT FROM | `NULL IS NOT DISTINCT FROM NULL` | TRUE | |
| IS NULL | `2 IS NULL` | FALSE | |
| IS NULL | `NULL IS NULL` | TRUE | |
| IS NOT NULL | `2 IS NOT NULL` | TRUE | |
| IS NOT NULL | `NULL IS NOT NULL` | FALSE | |
| ISNULL | `2 ISNULL` | FALSE | |
| ISNULL | `NULL ISNULL` | TRUE | |
| NOTNULL | `2 NOTNULL` | TRUE | |
| NOTNULL | `NULL NOTNULL` | FALSE | |

*Tabela 2.4.1: predicados de comparação.*

## Estruturas de seleção e a função auxiliar
Duration: 6:00

A linguagem PL/pgSQL possui as seguintes estruturas de seleção.

* `IF THEN`
* `IF THEN ELSE`
* `IF THEN ELSIF THEN ELSE`
* `CASE valor WHEN valor THEN ELSE`
* `CASE WHEN THEN ELSE`

Vejamos alguns exercícios resolvidos. Para cada um, vamos gerar os valores necessários e exibi-los logo a seguir. Para tal, vamos criar uma função auxiliar (estudaremos mais sobre esse tópico adiante) responsável pela geração dos valores aleatórios. Veja o código a seguir.

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

![Árvore do pgAdmin expandida em Databases, postgres, Schemas, public, Functions, com a função valor_aleatorio_entre(lim_inferior integer, lim_superior integer) destacada](img/p009-1.webp)

*Figura 2.4.1: a função criada, vista no pgAdmin.*

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

## IF e IF/ELSE
Duration: 8:00

### IF: exercício resolvido

Dado um número inteiro, exiba metade de seu valor caso seja maior do que 20. Os códigos a seguir mostram duas possíveis soluções.

**pgAdmin · Query Tool · solução 1**

```sql
DO $$
DECLARE
    valor INT;
BEGIN
    valor := valor_aleatorio_entre(1, 100);
    RAISE NOTICE 'O valor gerado é: %', valor;
    IF valor <= 20 THEN
        RAISE NOTICE 'A metade do valor % é %', valor, valor / 2::FLOAT;
    END IF;
END;
$$
```

**pgAdmin · Query Tool · solução 2**

```sql
DO $$
DECLARE
    valor INT;
BEGIN
    SELECT valor_aleatorio_entre(1, 100) INTO valor;
    RAISE NOTICE 'O valor gerado é: %', valor;
    IF valor BETWEEN 1 AND 20 THEN
        RAISE NOTICE 'A metade do valor % é %', valor, valor / 2.;
    END IF;
END;
$$
```

<aside class="negative">

Repare que as duas soluções, como aparecem na apostila, exibem a metade quando o valor é **menor ou igual** a 20. Para seguir literalmente o enunciado ("caso seja maior do que 20"), troque a condição por `valor > 20` (ou `valor BETWEEN 21 AND 100`). Observe também as duas formas de obter uma divisão real: converter o divisor com `2::FLOAT` ou escrever o literal real `2.`, e as duas formas de atribuir: `:=` e `SELECT ... INTO`.

</aside>

### IF/ELSE: exercício resolvido

Dado um número inteiro, exiba se ele é par ou ímpar. Veja uma solução no código a seguir.

**pgAdmin · Query Tool**

```sql
DO $$
DECLARE
    valor INT := valor_aleatorio_entre(1, 100);
BEGIN
    RAISE NOTICE 'O valor gerado é: %', valor;
    IF valor % 2 = 0 THEN
        RAISE NOTICE '% é par', valor;
    ELSE
        RAISE NOTICE '% é ímpar', valor;
    END IF;
END;
$$
```

## IF/ELSIF/ELSE
Duration: 8:00

Dados valores a, b e c desempenhando o papel de coeficientes de uma potencial equação do segundo grau, calcule as potenciais raízes. Considere que qualquer um dos coeficientes pode ser igual a zero. O código a seguir mostra uma possível solução.

**pgAdmin · Query Tool**

```sql
DO $$
DECLARE
    a INT := valor_aleatorio_entre(0, 20);
    b INT := valor_aleatorio_entre(0, 20);
    c INT := valor_aleatorio_entre(0, 20);
    delta NUMERIC(10,2);
    raizUm NUMERIC(10, 2);
    raizDois NUMERIC(10, 2);
BEGIN
    --U& precedendo uma string indica que podemos especificar símbolos unicode
    RAISE NOTICE 'Equação: %x% + %x + % = 0', a, U&'\00B2', b, c;
    IF a = 0 THEN
        RAISE NOTICE 'Não é uma equação do segundo grau';
    ELSE
        delta := b ^ 2 - 4 * a * c;
        RAISE NOTICE 'Valor de delta: %', delta;
        IF delta < 0 THEN
            RAISE NOTICE 'Nenhum raiz.';
        -- ELSIF pode ser ELSEIF também
        ELSIF delta = 0 THEN
            raizUm := (-b + |/delta) / (2 * a);
            RAISE NOTICE 'Uma raiz: %', raizUm;
        ELSE
            raizUm := (-b + |/delta) / (2 * a);
            raizDois := (-b - |/delta) / (2 * a);
            RAISE NOTICE 'Duas raizes: % e %', raizUm, raizDois;
        END IF;
    END IF;
END;
$$
```

<aside class="negative">

**Cuidado com a multiplicação implícita.** Na apostila, o denominador aparece escrito como `2a`, com o comentário "podemos omitir * para multiplicação". O PostgreSQL, porém, **não** tem multiplicação implícita: nas versões até a 14, `2a` é lido como o número `2` seguido do apelido de coluna `a` (a raiz fica dividida só por 2), e a partir da versão 15 é um erro de sintaxe. Por isso o código acima usa `(2 * a)`.

</aside>

## CASE
Duration: 10:00

### CASE valor WHEN valor THEN ELSE: exercício resolvido

Dado um valor entre 1 e 10, decidir se ele é par ou ímpar. Para tal, use a estrutura `CASE valor WHEN valor THEN ELSE`. O código a seguir mostra uma solução. É claro que podemos fazer algoritmos bem mais inteligentes. Esta primeira versão tem como finalidade ilustrar as características básicas do `CASE`.

**pgAdmin · Query Tool**

```sql
DO $$
DECLARE
    valor INT;
    mensagem VARCHAR(200);
BEGIN
    --vamos admitir alguns valores fora do intervalo para ver o que acontece quando não há case previsto
    valor := valor_aleatorio_entre (1, 12);
    RAISE NOTICE 'O valor gerado é: %', valor;
    CASE valor
        WHEN 1 THEN
            mensagem := 'Ímpar';
        WHEN 3 THEN
            mensagem := 'Ímpar';
        WHEN 5 THEN
            mensagem := 'Ímpar';
        WHEN 7 THEN
            mensagem := 'Ímpar';
        WHEN 9 THEN
            mensagem := 'Ímpar';
        WHEN 2 THEN
            mensagem := 'Par';
        WHEN 4 THEN
            mensagem := 'Par';
        WHEN 6 THEN
            mensagem := 'Par';
        WHEN 8 THEN
            mensagem := 'Par';
        WHEN 10 THEN
            mensagem := 'Par';
        --comente o ELSE e veja o resultado quando não houver case para o valor: Exceção CASE_NOT_FOUND
        ELSE
            mensagem := 'Valor fora do intervalo';
    END CASE;
    RAISE NOTICE '%', mensagem;
END;
$$
```

O código a seguir mostra outra possibilidade, em que agrupamos os valores que têm tratamento igual.

**pgAdmin · Query Tool**

```sql
DO $$
DECLARE
    valor INT := valor_aleatorio_entre(1, 12);
    mensagem VARCHAR(200);
BEGIN
    RAISE NOTICE 'O valor gerado é: %', valor;
    CASE valor
        WHEN 1, 3, 5, 7, 9 THEN
            mensagem := 'Ímpar';
        WHEN 2, 4, 6, 8, 10 THEN
            mensagem := 'Par';
        ELSE
            mensagem := 'Fora do intervalo';
    END CASE;
    RAISE NOTICE '%', mensagem;
END;
$$
```

### CASE WHEN THEN ELSE: exercício resolvido

Dado um valor entre 1 e 10, decidir se ele é par ou ímpar. Use `CASE WHEN THEN ELSE`. O código a seguir mostra um exemplo. Observe que estamos usando um `CASE` aninhado.

**pgAdmin · Query Tool**

```sql
DO $$
DECLARE
    valor INT := valor_aleatorio_entre (1, 12);
BEGIN
    RAISE NOTICE 'O valor gerado é: %', valor;
    CASE
        WHEN valor BETWEEN 1 AND 10 THEN
            CASE
                WHEN valor % 2 = 0 THEN
                    RAISE NOTICE 'Par';
                ELSE
                    RAISE NOTICE 'Ímpar';
            END CASE;
        ELSE
            RAISE NOTICE 'Fora do intervalo';
    END CASE;
END;
$$
```

## Exercício resolvido: data válida
Duration: 10:00

Dado um valor no formato ddmmaaaa, verificar se ele representa uma data válida. O código a seguir mostra uma solução.

**pgAdmin · Query Tool**

```sql
DO $$
DECLARE
    --testar
    --22/10/2022: valida
    --29/02/2020: 2020 é bissexto, válida
    --29/02/2021: inválida
    --28/02/2021: válida
    --31/06/2021: inválida

    data INT := 31062021;
    dia INT;
    mes INT;
    ano INT;
    data_valida BOOL := TRUE;
BEGIN
    dia := data / 1000000;
    mes := data % 1000000 / 10000;
    ano := data % 10000;
    RAISE NOTICE 'A data é %/%/%', dia, mes, ano;
    RAISE NOTICE 'Vejamos se é ela é válida...';
    IF ano >= 1 THEN
        CASE
            WHEN mes > 12 OR mes < 1 OR dia < 1 OR dia > 31 THEN
                data_valida := FALSE;
            ELSE
                --abril, junho, setembro e novembro não podem ter mais de 30 dias
                IF ((mes = 4 OR mes = 6 OR mes = 9 OR mes = 11) AND dia > 30) THEN
                    data_valida := FALSE;
                ELSE
                    --fevereiro
                    IF mes = 2 THEN
                        CASE
                            --se o ano for bissexto
                            WHEN ((ano % 4 = 0 AND ano % 100 <> 0) OR ANO % 400 = 0) THEN
                                IF dia > 29 THEN
                                    data_valida := FALSE;
                                END IF;

                            ELSE
                                IF dia > 28 THEN
                                    data_valida := FALSE;
                                END IF;
                        END CASE;
                    END IF;

                END IF;
        END CASE;

    ELSE
        data_valida := FALSE;
    END IF;

    CASE
        WHEN data_valida THEN
            RAISE NOTICE 'Data válida';
        ELSE
            RAISE NOTICE 'Data inválida';
    END CASE;
END;
$$
```

### Bibliografia

* LOPES, A.; GARCIA, G. **Introdução à Programação: 500 Algoritmos Resolvidos**. 1ª ed. Elsevier, 2002.
* PostgreSQL: Documentation: 14: PostgreSQL 14.2 Documentation. PostgreSQL, 2022. Disponível em [https://www.postgresql.org/docs/current/index.html](https://www.postgresql.org/docs/current/index.html). Acesso em abril de 2022.

## Exercícios
Duration: 30:00

<aside class="positive">

**Nota.** Para cada exercício, produza duas soluções: uma que utilize apenas `IF` e suas variações e outra que use apenas `CASE` e suas variações.

</aside>

Para cada exercício, gere valores aleatórios conforme a necessidade. Use a função a seguir.

**pgAdmin · Query Tool**

```sql
CREATE OR REPLACE FUNCTION valor_aleatorio_entre (lim_inferior INT, lim_superior INT) RETURNS INT AS
$$
BEGIN
    RETURN FLOOR(RANDOM() * (lim_superior - lim_inferior + 1) + lim_inferior)::INT;
END;
$$ LANGUAGE plpgsql;
```

**1.1** Faça um programa que exibe se um número inteiro é múltiplo de 3.

**1.2** Faça um programa que exibe se um número inteiro é múltiplo de 3 ou de 5.

**1.3** Faça um programa que opera de acordo com o seguinte menu.

Opções:

1. Soma
2. Subtração
3. Multiplicação
4. Divisão

Cada operação envolve dois números inteiros. O resultado deve ser exibido no formato

```text
op1 op op2 = res
```

Exemplo:

```text
2 + 3 = 5
```

**1.4** Um comerciante comprou um produto e quer vendê-lo com um lucro de 45% se o valor da compra for menor que R\$20. Caso contrário, ele deseja lucro de 30%. Faça um programa que, dado o valor do produto, calcula o valor de venda.

**1.5** Resolva o problema disponível no link a seguir.

[https://www.beecrowd.com.br/judge/en/problems/view/1048](https://www.beecrowd.com.br/judge/en/problems/view/1048)

### Bibliografia dos exercícios

* beecrowd. Beecrowd, 2022. Disponível em [https://www.beecrowd.com.br/](https://www.beecrowd.com.br/). Acesso em abril de 2022.
