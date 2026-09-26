summary: Transações no PostgreSQL: as propriedades ACID, os comandos BEGIN, COMMIT, ROLLBACK e SAVEPOINT, o isolamento entre duas conexões no pgAdmin, a opção Auto commit e a recuperação quando a conexão é perdida.
id: pg-transacoes
categories: PostgreSQL,Bancos de Dados
tags: postgresql,transacoes,acid,begin,commit,rollback,savepoint,pgadmin
status: Published
authors: Rodrigo Bossini
last updated: 2022-06-11
pdf: postgresql/17_apostila_pbd_transacoes.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Transações no PostgreSQL

## Visão geral
Duration: 3:00

Neste material, estudaremos **transações**. Veja a sua documentação oficial em [https://www.postgresql.org/docs/current/tutorial-transactions.html](https://www.postgresql.org/docs/current/tutorial-transactions.html).

> **Transação**
>
> Uma coleção de instruções que desejamos executar em modo "tudo ou nada": se todas as instruções executam com sucesso, então a execução da transação é confirmada; se pelo menos uma das instruções da transação falhar, então tudo aquilo que eventualmente tiver sido realizado é desfeito e o banco de dados é levado de volta ao estado original, como se a transação sequer tivesse começado a executar.

### O que você vai aprender

* As propriedades ACID: atomicidade, consistência, isolamento e durabilidade
* Os comandos `BEGIN`, `COMMIT`, `ROLLBACK` e `SAVEPOINT`
* Como abrir duas conexões simultâneas no pgAdmin e observar o isolamento
* O que acontece quando uma instrução falha dentro de uma transação
* A opção **Auto commit** do pgAdmin
* Como o servidor se recupera quando a conexão é perdida antes do `COMMIT`

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

## Propriedades ACID e comandos
Duration: 6:00

### Transações ACID

Há quatro propriedades fundamentais que fazem parte da definição de uma transação.

* **Atomicidade**: uma transação é indivisível. Essa é a propriedade que diz que uma transação sempre opera em modo "tudo ou nada".
* **Consistência**: uma transação somente pode levar a base de dados do estado atual válido para outro estado que também seja válido, de acordo com todas as regras previstas e implementadas por meio de quaisquer mecanismos como triggers, restrições de integridade etc.
* **Isolamento**: em geral, um SGBD atende múltiplas requisições simultaneamente. Potencialmente, múltiplos clientes estarão lendo e escrevendo numa tabela ao mesmo tempo. Essa propriedade está relacionada ao controle de concorrência implementado pelos SGBDs e diz que duas transações que executam simultaneamente deixam o banco de dados no mesmo estado que teriam deixado caso executassem sequencialmente.
* **Durabilidade**: os efeitos causados por uma transação são duráveis. Uma vez que ela tenha sido confirmada com uma operação `COMMIT`, seus efeitos são mantidos ainda que o sistema venha a sofrer falhas futuras.

### Principais comandos

Os principais comandos que viabilizam a manipulação de transações são os seguintes:

* **BEGIN**: indica o início de uma transação.
* **COMMIT**: torna permanentes as alterações realizadas por uma transação. Executado quando a transação termina sem que nenhuma de suas instruções falhe.
* **ROLLBACK**: quando uma transação começa, o banco de dados se encontra num determinado estado. Eventualmente, após executar algumas instruções, a transação falha. Quando isso acontece, desejamos garantir que o banco de dados permaneça no estado original, como se a transação não tivesse sido executada. Para isso serve o comando `ROLLBACK`.
* **SAVEPOINT**: permite que estados intermediários ao longo de uma transação sejam destacados. Se uma instrução da transação falhar depois de um estado intermediário ter sido destacado, é possível voltar até aquele estado intermediário, sem que seja necessário perder todo o trabalho potencialmente já realizado, apenas parte dele.

## Um exemplo: duas conexões
Duration: 8:00

Neste exemplo, vamos criar uma tabela que abriga dados de contas de pessoas, incluindo seu saldo e nome. Ao realizar operações sobre ela, ilustramos os principais conceitos de transações. O código a seguir mostra como criar a tabela.

**pgAdmin · Query Tool**

```sql
CREATE TABLE IF NOT EXISTS tb_conta(
    cod_conta SERIAL PRIMARY KEY,
    nome VARCHAR(200),
    saldo NUMERIC(10, 2)
);
```

A seguir, cadastre alguns dados, como no código a seguir.

**pgAdmin · Query Tool**

```sql
INSERT INTO tb_conta
    (nome, saldo)
VALUES
    ('João', 200),
    ('Maria', 200),
    ('Pedro', 200),
    ('Cristina', 200),
    ('Fernanda', 200);
```

### Abrindo duas conexões simultâneas com o pgAdmin

Quando abrimos um editor de texto no pgAdmin, ele estabelece uma conexão com o PostgreSQL Server por meio da qual ambos podem se comunicar. Neste exemplo, vamos criar uma segunda conexão com o PostgreSQL Server e simular algumas operações como se fossem realizadas por clientes executando em paralelo. Para tal, basta clicar em **Tools >> Query Tool** novamente. O resultado esperado aparece na figura a seguir: temos duas abas e cada uma representa uma conexão diferente com o PostgreSQL Server.

![pgAdmin com duas abas de Query Tool abertas para a base pessoal_transacoes, destacadas](img/p006-1.webp)

*Figura 2.4.1: duas abas, duas conexões.*

A seguir, clique em **Dashboard**, como na figura a seguir.

![Aba Dashboard destacada na barra de abas do pgAdmin](img/p007-1.webp)

*Figura 2.4.2: abrindo o Dashboard.*

Observe, como mostra a figura a seguir, que há uma conexão separada para cada aba aberta, incluindo a aba criada para exibir os gráficos do Dashboard.

![Dashboard do pgAdmin com gráficos de atividade e, destacada, a lista Server activity com três sessões abertas](img/p007-2.webp)

*Figura 2.4.3: uma sessão para cada aba.*

### Ícone de status da transação

Volte à aba da primeira conexão e passe o mouse sobre o ícone destacado na figura a seguir. Observe que a informação exibida indica que há uma sessão ociosa e que ela não está executando uma transação no momento.

![Ícone de status ao lado do nome da conexão com a dica The session is idle and there is no current transaction](img/p007-3.webp)

*Figura 2.4.4: sessão ociosa, sem transação.*

## BEGIN, erro e ROLLBACK
Duration: 8:00

### Iniciando uma transação com BEGIN

A seguir, use um simples `BEGIN;` como mostra o código a seguir e execute.

**pgAdmin · Query Tool · primeira conexão**

```sql
BEGIN;
```

Passe o mouse novamente sobre o ícone destacado na figura a seguir. Observe que a informação agora revela que há uma transação em andamento.

![Query Tool com BEGIN; executado e a dica do ícone de status indicando que a sessão está em um bloco de transação válido](img/p008-1.webp)

*Figura 2.4.5: transação em andamento na primeira conexão.*

Mude para a aba da segunda conexão e verifique o mesmo ícone. Observe que a segunda conexão não se encontra executando uma transação no momento. Veja a figura a seguir.

![Aba da segunda conexão com o ícone de status indicando sessão ociosa, sem transação](img/p008-2.webp)

*Figura 2.4.6: a segunda conexão não está em transação.*

### Executando um UPDATE com erro

De volta à aba da primeira conexão, execute o comando `UPDATE` do código a seguir. Observe que há um erro no `UPDATE`: esquecemos de digitar a palavra `SET`.

**pgAdmin · Query Tool · primeira conexão**

```sql
UPDATE
    tb_conta
    saldo = saldo + 50
WHERE nome = 'Cristina';
```

Observe, como na figura a seguir, que uma mensagem de erro aparece.

![Aba Messages com ERROR: current transaction is aborted, commands ignored until end of transaction block e SQL state: 25P02](img/p009-1.webp)

*Figura 2.4.7: mensagem de erro na transação.*

Como na figura a seguir, inspecione novamente o ícone de status da transação e veja a mensagem.

![Ícone de status com a dica The session is idle in a failed transaction block](img/p009-2.webp)

*Figura 2.4.8: a transação está em estado de falha.*

### Executando o UPDATE corrigido sem fazer ROLLBACK

Ocorre que a transação se encontra num estado de erro. Ainda que tentemos executar o `UPDATE` agora corrigido, como no código a seguir, a mensagem de erro permanecerá a mesma.

**pgAdmin · Query Tool · primeira conexão**

```sql
UPDATE
    tb_conta
SET
    saldo = saldo + 50
WHERE nome = 'Cristina';
```

### Fazendo ROLLBACK

Podemos usar o comando `ROLLBACK` para desfazer tudo aquilo que a transação havia feito até então, garantindo a consistência da base de dados. Basta executar o `ROLLBACK`, como no código a seguir.

**pgAdmin · Query Tool · primeira conexão**

```sql
ROLLBACK;
```

O resultado esperado é aquele da figura a seguir.

![Aba Messages com ROLLBACK e Query returned successfully](img/p010-1.webp)

*Figura 2.4.9: ROLLBACK executado.*

## COMMIT, isolamento e Auto commit
Duration: 10:00

### Nova transação com BEGIN, UPDATE e COMMIT

Com o `UPDATE` corrigido, execute uma sequência de `BEGIN`, `UPDATE` e `COMMIT`, como no código a seguir.

**pgAdmin · Query Tool · primeira conexão**

```sql
BEGIN;
    UPDATE
        tb_conta
    SET
        saldo = saldo + 50
    WHERE nome = 'Cristina';
COMMIT;
```

Faça um `SELECT` e certifique-se de que o saldo foi atualizado.

### UPDATE sem COMMIT: SELECT feito nas duas conexões

Façamos um novo `UPDATE`. Desta vez, entretanto, sem executar o `COMMIT`. Logo depois, executemos um `SELECT`. Tudo isso na aba da primeira conexão. Veja o código a seguir.

**pgAdmin · Query Tool · primeira conexão**

```sql
BEGIN;
    UPDATE
        tb_conta
    SET
        saldo = saldo + 50
    WHERE nome = 'Cristina';

SELECT * FROM tb_conta;
```

Observe que, para esta conexão, o saldo já deve ter sido atualizado novamente. Entretanto, vá para a aba da segunda conexão e execute o mesmo `SELECT`. Somente o `SELECT`. Observe que, do ponto de vista desta segunda conexão, o saldo ainda não foi atualizado. Isso ilustra o conceito de **isolamento** da definição de transações ACID.

Faça um `COMMIT` na aba da primeira conexão e execute um `SELECT` em cada uma das abas. A esperança é que ambas mostrem o saldo atualizado desta vez.

### A opção Auto commit do pgAdmin

Quando executamos um comando `UPDATE`, por exemplo, é natural que queiramos que o resultado seja imediato. É um comando tão simples que descartamos o uso de transações. Entretanto, elas estão presentes. O que acontece é que, por padrão, o pgAdmin tem a opção **Auto commit** habilitada. Para encontrá-la, clique na seta ao lado do botão de execução, como na figura a seguir.

![Menu aberto a partir da seta ao lado do botão de execução, com as opções Auto commit? e Auto rollback on error?](img/p011-1.webp)

*Figura 2.4.10: a opção Auto commit.*

Faça o seguinte teste:

1. Desabilite a opção Auto commit na aba da primeira conexão.
2. Execute um novo `UPDATE` na aba da primeira conexão, aumentando em 50 o saldo de um cliente qualquer.
3. Execute um `SELECT` na aba da primeira conexão.
4. Execute um `SELECT` na aba da segunda conexão.

Observe que a atualização ainda não foi tornada permanente e, portanto, somente será visível na aba da primeira conexão.

5. Execute `COMMIT` na aba da primeira conexão e faça `SELECT` nas duas abas novamente. Desta vez, a atualização deve ser vista em ambas as abas.

## Recuperação quando a conexão é perdida
Duration: 8:00

Suponha que estamos executando uma transação por meio do pgAdmin e que a conexão com o servidor seja perdida antes da operação `COMMIT`. Como podemos nos recuperar dessa falha? Para responder a essa pergunta, façamos um teste. Faça as atualizações descritas no código a seguir na aba da primeira conexão. Ou seja, uma transferência de valores entre duas contas.

**pgAdmin · Query Tool · primeira conexão**

```sql
BEGIN;
UPDATE
    tb_conta
SET
    saldo = saldo + 250
WHERE nome = 'Maria';

UPDATE
    tb_conta
SET
    saldo = saldo - 250
WHERE nome = 'Fernanda';

SELECT * FROM tb_conta;
```

Observe que ainda não fizemos `COMMIT`. O `SELECT` executado na aba da primeira conexão deve mostrar os valores atualizados. Um `SELECT` na aba da segunda conexão, entretanto, ainda não. Faça o teste.

Para simular a falha de conexão, vá até a aba **Dashboard**, como na figura a seguir. Clique para encerrar as duas conexões que temos abertas.

![Dashboard com a lista de sessões e os botões de encerrar sessão destacados nas duas conexões](img/p013-1.webp)

*Figura 2.5.1: encerrando as conexões pelo Dashboard.*

As duas conexões devem sumir, como na figura a seguir.

![Dashboard com a lista de sessões mostrando apenas a sessão do próprio Dashboard](img/p013-2.webp)

*Figura 2.5.2: as conexões foram encerradas.*

Volte à aba da primeira conexão e execute um novo `SELECT`. A mensagem esperada é exibida pela figura a seguir.

![Janela Connection Warning informando que a aplicação perdeu a conexão com o banco de dados e perguntando se deseja continuar e estabelecer uma nova sessão, com os botões Cancel e Continue](img/p014-1.webp)

*Figura 2.5.3: aviso de conexão perdida.*

Ainda que você clique em **Continue** (aliás, faça isso), o pgAdmin estabelecerá uma nova conexão com o servidor. Assim, tudo o que foi realizado na conexão anterior e não tornado permanente terá sido perdido. Ou seja, o `ROLLBACK` é feito automaticamente pelo servidor, neste caso.

## Savepoints
Duration: 8:00

Os comandos `COMMIT` e `ROLLBACK` permitem que confirmemos ou desfaçamos as operações de uma transação inteira. Com **savepoints**, podemos criar estados intermediários que podem ser tornados permanentes ou para os quais podemos voltar com um `ROLLBACK`, se necessário.

<aside class="positive">

**Nota.** Um `SAVEPOINT` permite criar um estado intermediário visível apenas para a transação atual. Criar um estado intermediário com `SAVEPOINT` não faz automaticamente um `COMMIT`.

</aside>

Façamos o seguinte exemplo:

1. Iniciar uma transação com `BEGIN`.
2. Atualizar os saldos de todos os clientes para o valor de 500.
3. Fazer um `SAVEPOINT`.
4. Transferir 100 de Fernanda para Maria.
5. Fazer um `SAVEPOINT`.
6. Transferir 50 de Maria para Cristina.
7. Supor que a transferência de Maria para Cristina não deveria ter acontecido e voltar ao estado imediatamente anterior a essa operação.
8. Fazer `COMMIT`.

Veja o código a seguir.

**pgAdmin · Query Tool**

```sql
SELECT * FROM tb_conta;
BEGIN;

UPDATE tb_conta SET saldo = 500;

SAVEPOINT saldos_em_500;

UPDATE tb_conta SET saldo = saldo - 100
WHERE nome = 'Fernanda';

UPDATE tb_conta SET saldo = saldo + 100
WHERE nome = 'Maria';

SAVEPOINT fernanda_para_maria;

UPDATE tb_conta SET saldo = saldo - 50
WHERE nome = 'maria';

UPDATE tb_conta SET saldo = saldo + 50
WHERE nome = 'Cristina';

ROLLBACK TO fernanda_para_maria;

COMMIT;
```

<aside class="positive">

Repare que a comparação de strings é sensível a maiúsculas: `nome = 'maria'` não encontra a linha de "Maria". Neste exemplo isso não altera o resultado final, porque essas duas atualizações são desfeitas pelo `ROLLBACK TO fernanda_para_maria`.

</aside>

## Encerramento
Duration: 3:00

### Parabéns!

Você viu na prática as propriedades ACID, controlou transações com `BEGIN`, `COMMIT`, `ROLLBACK` e `SAVEPOINT`, observou o isolamento entre duas conexões e a recuperação automática quando a conexão cai antes do `COMMIT`.

### Bibliografia

* PostgreSQL: Documentation: 14: PostgreSQL 14.2 Documentation. PostgreSQL, 2022. Disponível em [https://www.postgresql.org/docs/current/index.html](https://www.postgresql.org/docs/current/index.html). Acesso em junho de 2022.
