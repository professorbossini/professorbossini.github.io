summary: Os blocos anônimos da linguagem PL/pgSQL: estrutura, delimitação com aspas e com $$, execução com DO, RAISE NOTICE com placeholders, variáveis, operadores aritméticos e geração de valores aleatórios com random.
id: pg-plpgsql-blocos-sequencial
categories: PostgreSQL,Bancos de Dados
tags: postgresql,plpgsql,bloco-anonimo,do,raise-notice,variaveis,operadores,random
status: Published
authors: Rodrigo Bossini
last updated: 2022-03-22
pdf: postgresql/08_apostila_pbd_plsql_blocos_estrutura_sequencial_aritmetica.pdf
exercicios: postgresql/08_exercicios_pbd_plsql_blocos_estrutura_sequencial_aritmetica.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# PL/pgSQL: blocos anônimos, estrutura sequencial e aritmética

## Visão geral
Duration: 3:00

Neste material, estudaremos os tipos de blocos que a linguagem **PL/pgSQL** permite utilizar, começando pelos blocos anônimos, e escreveremos pequenos programas sequenciais com variáveis, operadores aritméticos e valores aleatórios.

### O que você vai aprender

* A estrutura de um bloco anônimo PL/pgSQL (rótulo, `DECLARE`, `BEGIN` e `END`)
* Como delimitar blocos com aspas simples ou com `$$` e executá-los com `DO`
* Como exibir valores com `RAISE NOTICE` e o placeholder `%`
* Como declarar e inicializar variáveis
* Os principais operadores aritméticos do PostgreSQL
* Como gerar valores aleatórios em intervalos com `random` e `floor`

### O que você vai precisar

* PostgreSQL e pgAdmin 4 instalados

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

## Blocos anônimos
Duration: 10:00

A linguagem PL/pgSQL permite que criemos blocos de código que nada mais são do que pequenos programas de computador. Além de utilizar o padrão SQL, também é possível utilizar diversos recursos que a linguagem oferece que não fazem parte do padrão. Um bloco anônimo tem a estrutura a seguir.

**Estrutura de um bloco**

```sql
-- colchetes indicam que a região é opcional
[ rótulo ] -- o rótulo pode ser usado para qualificar variáveis, por exemplo
[
    DECLARE declarações de variáveis aqui
]

BEGIN
    comandos aqui;
END [ rótulo ];
```

O código a seguir exibe um primeiro bloco de código anônimo. Observe que ele ainda não está pronto para ser executado.

**pgAdmin · Query Tool**

```sql
BEGIN
    --para exibir valores no console
    RAISE NOTICE 'Meu primeiro Bloco anônimo!!';
END;
```

### Delimitando com aspas simples

Blocos anônimos devem ser delimitados por aspas simples. Assim, aspas internas devem ser "duplicadas". Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
'
BEGIN
    --para exibir valores no console
    RAISE NOTICE ''Meu primeiro Bloco anônimo!!'';
END;
'
```

### Executando com DO

Repare que o bloco ainda não pode ser executado. A sua execução pode ser feita aplicando-se o comando `DO`. Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
DO
'
BEGIN
    --para exibir valores no console
    RAISE NOTICE ''Meu primeiro Bloco anônimo!!'';
END;
'
```

No pgAdmin, clique no botão de execução para ver o resultado. Veja a figura a seguir.

![Query Tool com o bloco DO delimitado por aspas, o botão de execução destacado e, na aba Messages, NOTICE: Meu primeiro Bloco anônimo!! e Query returned successfully](img/p006-1.webp)

*Figura 2.2.1: resultado da execução do bloco anônimo.*

### Delimitando com $$

Ter de fazer o "escape" das aspas pode ser trabalhoso e inconveniente. Em geral, é mais comum utilizar o símbolo `$$` para delimitar strings que representam blocos de código. O programa anterior pode ser, portanto, escrito como mostra o código a seguir.

**pgAdmin · Query Tool**

```sql
DO
$$
BEGIN
    --para exibir valores no console
    RAISE NOTICE 'Meu primeiro Bloco anônimo!!';
END;
$$
```

## Placeholders e variáveis
Duration: 6:00

### Placeholder de expressões em strings

É possível "montar" strings escrevendo modelos que consistem de partes fixas de interesse e do símbolo `%` em cada ponto em que desejamos encaixar um valor resultante de uma expressão. Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
DO
$$
BEGIN
    RAISE NOTICE '% + % = %', 2, 2, 2 + 2;
END;
$$
```

### Variáveis

A declaração de variáveis envolve duas partes: tipo e nome. Veja alguns exemplos no código a seguir.

**pgAdmin · Query Tool**

```sql
DO $$
DECLARE
    codigo INTEGER := 1;
    nome_completo VARCHAR(200) := 'João Santos';
    -- 11 digitos no total, dois para valores decimais
    salario numeric (11, 2) := 20.5 ;
BEGIN
    RAISE NOTICE 'Meu código é %, me chamo % e meu salário é R$%', codigo, nome_completo, salario;
END $$;
```

## Operadores aritméticos
Duration: 10:00

A linguagem PL/pgSQL define diversos operadores aritméticos. Veja alguns dos principais na tabela a seguir.

| Operação | Operador | Exemplo | Resultado |
| --- | --- | --- | --- |
| Soma | `+` | `2 + 2` | 4 |
| + unário | `+` | `+ 2` | 2 |
| Subtração | `-` | `2 - 2` | 0 |
| - unário | `-` | `-5` | -5 |
| Multiplicação | `*` | `2 * 2` | 4 |
| Divisão inteira (trunca) | `/` | `5 / 2` | 2 |
| Divisão real | `/` | `5 / 2` | 2.5 |
| Módulo | `%` | `5 % 2` | 1 |
| Exponenciação | `^` | `2 ^ 3` | 8 |
| Raiz quadrada | `\|/` | `\|/25` | 5 |
| Raiz cúbica | `\|\|/` | `\|\|/8` | 2 |
| Valor absoluto | `@` | `@-5` | 5 |

*Tabela 2.5.1: operadores aritméticos.*

O código a seguir mostra alguns exemplos.

**pgAdmin · Query Tool**

```sql
DO $$
DECLARE
    n1 INTEGER := 5;
    n2 INTEGER := 2;
    n3 NUMERIC(5, 2) := 5;
    n4 INTEGER := -5;
BEGIN
    -- adição
    RAISE NOTICE '% + % = %', n1, n2, n1 + n2;
    -- + unário: sem efeito
    RAISE NOTICE '%', +n1;
    -- subtração
    RAISE NOTICE '% - % = %', n1, n2, n1 - n2;
    -- - uniário: negação
    RAISE NOTICE '%', -n1;
    -- multiplicação
    RAISE NOTICE '% * % = %', n1, n2, n1 * n2;
    -- divisão (para inteiros, trunca o resultado em direção ao zero)
    RAISE NOTICE '% / % = %', n1, n2, n1 / n2;
    -- divisão (se envolve um real, a divisão é real)
    RAISE NOTICE '% / % = %', n3, n2, n3 / n2;
    -- divisão (formatando) Veja: https://www.postgresql.org/docs/current/functions-formatting.html
    RAISE NOTICE '% / % = %', n3, n2, to_char(n3 / n2, '99.99');
    -- resto da divisão
    -- usamos %% para escapar um %
    RAISE NOTICE '% %% % = %', n1, n2, n1 % n2;
    -- exponenciação
    RAISE NOTICE '% ^ % = %', n1, n2, n1 ^ n2;
    -- raiz quadrada
    RAISE NOTICE '|/ % = %', n1, |/ n1;
    -- raiz cubica
    RAISE NOTICE '||/ % = %', n1, ||/ n1;
    -- valor absoluto
    RAISE NOTICE '@% = % e @% = %', n1, @n1, n4, @n4;
END $$;
```

## Valores aleatórios
Duration: 6:00

A função `random` produz um valor real $0 \le n < 1$. Com algumas operações aritméticas, podemos obter resultados interessantes. Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
DO $$
DECLARE
    n1 NUMERIC (5, 2);
    n2 INTEGER;
    limite_inferior INTEGER := 5;
    limite_superior INTEGER := 17;
BEGIN
    -- 0 <= n1 < 1 (real)
    n1 := random();
    RAISE NOTICE '%', n1;
    -- 1 <= n1 < 10 (real)
    n1 := random() * 10 + 1;
    RAISE NOTICE '%', n1;
    -- 1 <= n2 <10 (:: faz type cast) (floor arredonda para baixo)
    n2 := floor(random() * 10 + 1)::int;
    RAISE NOTICE '%', n2;
    -- limite_inferior <= n2 <= limite_superior
    n2 := floor(random() * (limite_superior - limite_inferior + 1) + limite_inferior)::int;
    RAISE NOTICE '%', n2;
END $$;
```

<aside class="positive">

A fórmula do último exemplo é a que você vai usar sempre que precisar de um inteiro em um intervalo fechado: `floor(random() * (limite_superior - limite_inferior + 1) + limite_inferior)::int`.

</aside>

## Exercícios
Duration: 30:00

Para os exercícios que não especifiquem intervalos explicitamente, considere os seguintes intervalos.

* Números inteiros: $[1, 100]$
* Números reais: $[1, 10]$

**1.1** Faça um programa que gere um valor inteiro e o exiba.

**1.2** Faça um programa que gere um valor real e o exiba.

**1.3** Faça um programa que gere um valor real no intervalo $[20, 30]$ que representa uma temperatura em graus Celsius. Faça a conversão para Fahrenheit e exiba.

**1.4** Faça um programa que gere três valores reais a, b e c e mostre o valor de delta: aquele que calculamos para chegar às potenciais raízes de uma equação do segundo grau.

**1.5** Faça um programa que gere um número inteiro e mostre a raiz cúbica de seu antecessor e a raiz quadrada de seu sucessor.

**1.6** Faça um programa que gere medidas reais de um terreno retangular. Gere também um valor real no intervalo $[60, 70]$ que representa o preço por metro quadrado. O programa deve exibir o valor total do terreno.

**1.7** Escreva um programa que gere um inteiro que representa o ano de nascimento de uma pessoa no intervalo $[1980, 2000]$ e gere um inteiro que representa o ano atual no intervalo $[2010, 2020]$. O programa deve exibir a idade da pessoa em anos. Desconsidere detalhes envolvendo dias, meses, anos bissextos etc.
