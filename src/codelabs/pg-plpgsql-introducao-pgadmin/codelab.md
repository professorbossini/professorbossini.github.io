summary: Primeiros passos com PostgreSQL e pgAdmin 4: o padrão SQL e suas extensões (como PL/pgSQL), a arquitetura cliente/servidor, o cadastro de um servidor no pgAdmin, o Query Tool e um primeiro teste com criação de tabela, inserção e consulta.
id: pg-plpgsql-introducao-pgadmin
categories: PostgreSQL,Bancos de Dados
tags: postgresql,pgadmin,sql,plpgsql,cliente-servidor
status: Published
authors: Rodrigo Bossini
last updated: 2022-03-07
pdf: postgresql/06_apostila_pbd_plsql_com_postgresql_pgadmin4_introducao.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# PL/pgSQL com PostgreSQL e pgAdmin 4: introdução

## Visão geral
Duration: 3:00

Neste codelab você conhece o padrão SQL e as extensões criadas pelos fabricantes de SGBDs, entende a arquitetura cliente/servidor do PostgreSQL e prepara o ambiente de trabalho no pgAdmin 4, terminando com um primeiro teste de criação de tabela, inserção e consulta.

### O que você vai aprender

* Quais comandos o padrão SQL prevê (DDL, DML, DCL, TCL e DQL)
* O que são extensões ao padrão SQL, como T-SQL, PL/SQL e PL/pgSQL
* Como funciona a arquitetura cliente/servidor do PostgreSQL
* Como cadastrar um servidor no pgAdmin
* Como abrir o editor SQL (Query Tool) e executar comandos
* Como visualizar e editar os dados de uma tabela graficamente

### O que você vai precisar

* PostgreSQL instalado (a apostila usa o PostgreSQL 14)
* pgAdmin 4 instalado
* A senha definida para o usuário `postgres` durante a instalação

## O padrão SQL e suas extensões
Duration: 6:00

SQL significa *Structured Query Language*. Trata-se de um padrão baseado na álgebra relacional. A tabela a seguir mostra os comandos previstos pelo padrão SQL.

| Data Definition Language | Data Manipulation Language | Data Control Language | Transaction Control Language | Data Query Language |
| --- | --- | --- | --- | --- |
| CREATE (criar tabela) | INSERT (inserir dados em tabelas) | GRANT (atribuir privilégios de acesso) | COMMIT (confirmar operações realizadas em transações) | SELECT (buscar dados em tabelas) |
| ALTER (alterar estrutura de tabela) | UPDATE (atualizar dados em tabelas) | REVOKE (remover privilégios de acesso) | ROLLBACK (desfazer operações realizadas em transações ainda não concluídas) | |
| DROP (apagar tabela) | DELETE (remover dados de tabelas) | | SAVEPOINT (criar pontos intermediários ao longo de transações, permitindo que apenas parte delas seja desfeita, quando necessário) | |
| TRUNCATE (apagar dados de tabela sem registrar remoções no log) | | | | |

*Tabela 1.1: comandos previstos pelo padrão SQL.*

Há muitas implementações do padrão SQL. Além das operações padrão previstas na especificação SQL, fabricantes de Sistemas Gerenciadores de Bancos de Dados Relacionais fazem a implementação de extensões, tornando seus produtos mais interessantes para os desenvolvedores. Entre muitos outros recursos, que variam de produto para produto, estas extensões costumam trazer a implementação de estruturas de seleção e de repetição, presentes nas linguagens de programação mais comuns. Veja alguns exemplos de extensões ao padrão SQL na tabela a seguir.

| Nome da implementação | Fabricante | SGBD |
| --- | --- | --- |
| Transact-SQL (T-SQL) | Microsoft | Microsoft SQL Server |
| PL/SQL | Oracle | Oracle |
| PL/pgSQL | PostgreSQL | PostgreSQL |

*Tabela 1.2: extensões ao padrão SQL.*

## Arquitetura cliente/servidor
Duration: 4:00

O uso do PostgreSQL se baseia na arquitetura cliente/servidor. O servidor PostgreSQL é responsável por:

* compilar e executar comandos SQL
* manipular os arquivos utilizados para o armazenamento de dados

entre outras muitas coisas. Ou seja, o servidor PostgreSQL é responsável por prover a abstração por meio da qual enxergamos nossos dados como se fossem armazenados em tabelas.

O acesso a ele requer o uso de um cliente. Podemos usar diferentes clientes, como o **pgAdmin** e o **SQL Shell (psql)**. Também podemos desenvolver nossos próprios clientes utilizando linguagens de programação das mais diversas. Veja a figura a seguir.

![Clientes (pgAdmin, SQL Shell, aplicação desktop escrita em Python, aplicação web escrita em Java) enviam requisições TCP ao servidor PostgreSQL e recebem respostas; o servidor usa o sistema de arquivos do sistema operacional para guardar os dados em disco](img/p003-1.webp)

*Figura 2.1: arquitetura cliente/servidor do PostgreSQL.*

## Criando um "servidor" no pgAdmin
Duration: 6:00

Como vimos, o pgAdmin é um cliente próprio para o PostgreSQL. Ele pode ser utilizado para acessar múltiplos servidores PostgreSQL. Por isso, precisamos especificar os detalhes que caracterizam o servidor a ser utilizado:

* endereço do host em que ele se encontra executando
* porta em que ele está executando
* usuário e senha a serem utilizados para autenticação/autorização

A tela inicial do pgAdmin é exibida pela figura a seguir. Comece clicando em **Add New Server**.

![Tela inicial do pgAdmin 4 com o atalho Add New Server destacado em Quick Links](img/p004-1.webp)

*Figura 2.2.1: tela inicial do pgAdmin.*

A seguir, dê um nome para o servidor cujos dados serão armazenados pelo pgAdmin. Esse pode ser um nome qualquer, que você possa utilizar para facilmente se lembrar a que servidor se refere (`localhost`, `dev`, `producao` são exemplos). Como o servidor está em execução no mesmo computador em que o cliente está, podemos escolher um nome intuitivo como **localhost**. A seguir, clique na aba **Connection**. Veja a figura a seguir.

![Janela Create - Server, aba General, com o nome localhost preenchido e a aba Connection destacada](img/p004-2.webp)

*Figura 2.2.2: nome do servidor na aba General.*

Já na aba **Connection**, como mostra a figura a seguir, preencha os campos destacados e clique em **Save**.

![Aba Connection com Host 127.0.0.1, porta 5432, banco de manutenção postgres, usuário postgres, a senha preenchida e a opção Save password ativada; botão Save destacado](img/p005-1.webp)

*Figura 2.2.3: dados de conexão do servidor.*

<aside class="positive">

**Nota.** No Windows, a senha é normalmente especificada no momento em que o PostgreSQL é instalado.

</aside>

## Databases e o editor SQL
Duration: 4:00

### Databases

No PostgreSQL, cada usuário tem, por padrão, uma base de dados com o seu nome. Ela pode ser vista no canto esquerdo do pgAdmin, como destaca a figura a seguir. Neste momento, clique sobre ela.

![Árvore do pgAdmin com Servers, localhost, Databases e a base postgres destacada](img/p006-1.webp)

*Figura 2.3.1: a base de dados postgres.*

### Editor SQL

Clicando em **Tools >> Query Tool**, como na figura a seguir, podemos abrir um editor de texto em que comandos SQL podem ser digitados.

![Menu Tools do pgAdmin aberto com a opção Query Tool destacada](img/p006-2.webp)

*Figura 2.4.1: abrindo o Query Tool.*

## Teste: tabela, inserção e consulta
Duration: 10:00

Use os comandos a seguir para:

* criar uma tabela
* inserir uma linha
* buscar os dados da tabela

**pgAdmin · Query Tool**

```sql
CREATE TABLE tb_livro (
    cod_livro INTEGER PRIMARY KEY,
    titulo VARCHAR(200),
    autor VARCHAR(200)
);

INSERT INTO tb_livro (cod_livro, titulo, autor) VALUES (1, 'Concrete Mathematics', 'Donald Knuth');

SELECT * FROM tb_livro;
```

Selecione todo o conteúdo e clique em **Execute**, como destaca a figura a seguir. Ela também destaca o resultado esperado, logo abaixo.

![Query Tool com os três comandos selecionados, o botão Execute destacado e, na aba Data Output, a linha 1, Concrete Mathematics, Donald Knuth](img/p007-1.webp)

*Figura 2.5.1: execução dos comandos e resultado esperado.*

Clique com o botão direito em **Databases >> Refresh**, como na figura a seguir.

![Menu de contexto de Databases com a opção Refresh destacada](img/p008-1.webp)

*Figura 2.5.2: atualizando a árvore de objetos.*

A seguir, faça as expansões destacadas pela figura a seguir e veja como é possível interagir com a tabela criada graficamente.

![Árvore expandida em localhost, Databases, postgres, Schemas, public, Tables, até a tabela tb_livro](img/p008-2.webp)

*Figura 2.5.3: a tabela tb_livro na árvore de objetos.*

Clique duas vezes na "linha em branco" logo abaixo da primeira linha preenchida, como destaca a figura a seguir. Repare como é possível inserir dados na tabela graficamente. Clique duas vezes em cada campo da linha em branco para registrar um dado de interesse. Ao final, clique em **Save Data Changes**, opção cujo botão também é destacado.

![Grade de dados com uma segunda linha preenchida (2, How to prove it, Daniel Velleman) e o botão Save Data Changes destacado na barra de ferramentas](img/p009-1.webp)

*Figura 2.5.4: inserindo dados graficamente e salvando as alterações.*

## Encerramento
Duration: 3:00

### Parabéns!

Seu ambiente está pronto: você cadastrou um servidor no pgAdmin, abriu o Query Tool e executou comandos SQL de criação, inserção e consulta, além de editar dados graficamente. No próximo codelab, você vai acessar o PostgreSQL a partir de um programa em Python.

### Bibliografia

* HEUSER, Carlos Alberto. **Projeto de Banco de Dados**. 6ª ed. Bookman, 2008.
