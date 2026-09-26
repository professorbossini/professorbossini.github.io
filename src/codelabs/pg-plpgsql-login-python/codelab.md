summary: Uma aplicação Python 3 que se conecta ao PostgreSQL com o módulo psycopg para fazer login: criação da base e da tabela de usuários no pgAdmin, configuração do ambiente (Anaconda, VS Code, PATH do Windows) e um menu de login e logoff.
id: pg-plpgsql-login-python
categories: PostgreSQL,Bancos de Dados,Python
tags: postgresql,pgadmin,python,psycopg,login,vscode,anaconda
status: Published
authors: Rodrigo Bossini
last updated: 2022-03-07
pdf: postgresql/07_apostila_pbd_plsql_com_postgresql_pgadmin4_login_com_python3.pdf
exercicios: postgresql/07_exercicios_com_solucao_pbd_plsql_com_postgresql_pgadmin4_login_com_python3.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Login com Python 3 e PostgreSQL

## Visão geral
Duration: 3:00

Neste material desenvolveremos uma aplicação com Python 3 que se conecta a uma instância do PostgreSQL a fim de realizar um "login", ou seja, verificar se um determinado usuário, caracterizado por dados de login e senha informados pelo usuário, existe na base.

### O que você vai aprender

* Como criar uma base de dados e uma tabela pelo pgAdmin
* Como abrir o VS Code a partir do Anaconda Navigator e vinculá-lo a uma pasta de projeto
* Como colocar o diretório `bin` do PostgreSQL na variável de ambiente `path` (Windows)
* Como instalar e usar o módulo **psycopg** para acessar o PostgreSQL
* Como executar um `SELECT` parametrizado a partir do Python e interpretar o resultado
* Como montar um menu de login e logoff em modo texto

### O que você vai precisar

* PostgreSQL e pgAdmin 4 instalados (a apostila usa o PostgreSQL 14)
* Anaconda (com o Anaconda Navigator) e o VS Code
* Conhecimentos básicos de Python

## Criando a base e a tabela de usuários
Duration: 8:00

### Criando um database no PostgreSQL

Comece criando uma base de dados própria para este material. Utilizando o pgAdmin 4, você pode clicar com o botão direito em **Databases** e escolher **Create >> Database…**, como na figura a seguir.

![Árvore do pgAdmin com o menu de contexto de Databases aberto em Create e Database destacados](img/p001-1.webp)

*Figura 2.1.1: criando uma base de dados.*

Na tela seguinte, exibida pela figura a seguir, escolha um bom nome para a base e clique em **Save**.

![Janela Create - Database com o nome 20221_pessoal_db_login e o botão Save destacados](img/p002-1.webp)

*Figura 2.2.2: nome da nova base.*

### Criando a tabela para dados de usuários

Para criar a tabela que armazenará os dados dos usuários, mantenha a base que acaba de criar "selecionada" no menu à esquerda. Clique em **Tools >> Query Tool** para abrir o editor em que poderá digitar seus comandos SQL. Veja a figura a seguir.

![Base 20221_pessoal_db_login selecionada na árvore e o menu Tools aberto com Query Tool destacado](img/p002-2.webp)

*Figura 2.3.1: abrindo o Query Tool na nova base.*

Crie a tabela e insira alguns usuários utilizando o código a seguir. Por fim, verifique se os dados foram de fato inseridos com o comando `SELECT`. Use o botão **Execute** para executar.

**pgAdmin · Query Tool**

```sql
--cria a tabela
CREATE TABLE tb_usuario(
    cod_usuario SERIAL PRIMARY KEY,
    login VARCHAR(200) NOT NULL,
    senha VARCHAR(200) NOT NULL
);

-- insere dois usuários
INSERT INTO tb_usuario (login, senha) VALUES ('admin', 'admin');
INSERT INTO tb_usuario (login, senha) VALUES ('joao', '123456');

--busca os dados armazenados na tabela
SELECT * FROM tb_usuario;
```

![Query Tool com o botão Execute destacado e o resultado: usuários 1 admin/admin e 2 joao/123456](img/p003-1.webp)

*Figura 2.3.2: tabela criada e usuários inseridos.*

## Preparando o VS Code
Duration: 8:00

### Abrindo o VS Code com o Anaconda

Neste material, estamos utilizando o ambiente **Anaconda** e o IDE **VS Code**. O próprio Anaconda, em seu processo de instalação, sugere que seus diretórios do tipo "bin" não sejam adicionados à variável de ambiente `path` do sistema operacional. O procedimento recomendado é abrir as ferramentas desejadas por meio do **Anaconda Navigator**. Ele se encarrega de inicializar um ambiente Python e disponibilizá-lo para os IDEs que forem abertos por meio dele. Por isso, busque por Anaconda Navigator na lista de aplicativos de seu sistema operacional e abra-o, como na figura a seguir.

![Menu Iniciar do Windows com a busca por Anaconda Navigator (anaconda3) destacada](img/p004-1.webp)

*Figura 2.4.1: abrindo o Anaconda Navigator.*

Por meio de sua interface gráfica, abra o VS Code, como mostra a figura a seguir.

![Tela inicial do Anaconda Navigator com os aplicativos disponíveis e o botão Launch do VS Code destacado](img/p005-1.webp)

*Figura 2.4.2: abrindo o VS Code pelo Anaconda Navigator.*

<aside class="positive">

**Nota.** Caso o VS Code ainda não esteja instalado, você deverá ver um botão chamado **Install** no lugar do botão **Launch**. Basta clicar sobre ele para fazer a instalação. A partir daí, você deverá ver a opção Launch.

</aside>

### Criando uma pasta para o projeto e vinculando o VS Code a ela

É muito importante criar uma pasta em seu sistema de arquivos para abrigar os arquivos referentes a este projeto. Além disso, é muito importante vincular o VS Code a ela uma vez que ela tenha sido criada. Utilize o navegador de arquivos de seu sistema operacional (Windows Explorer, por exemplo: aquela pastinha amarela) e crie uma pasta de acordo com as seguintes boas práticas:

* Não escolha um diretório que possua espaços em branco ou acentos no nome.
* Não coloque espaços em branco e/ou acentos nos nomes dos arquivos que criar.
* No Windows, para evitar problemas com o mecanismo de permissão do sistema operacional, procure usar uma pasta como `C:\Users\seuUsuario\Documents\meus_projetos_python`.

Uma vez que tenha criado a pasta, clique em **File >> Open Folder** no VS Code e navegue no sistema de arquivos até encontrá-la para que fiquem vinculados. Veja a figura a seguir.

![Menu File do VS Code aberto com a opção Open Folder destacada](img/p006-1.webp)

*Figura 2.5.1: vinculando o VS Code à pasta do projeto.*

### Abrindo um terminal interno do VS Code

Os trabalhos poderão ficar mais simples caso utilizemos um terminal interno do VS Code. Para tal, basta clicar em **Terminal >> New Terminal**, como mostra a figura a seguir.

![Menu Terminal do VS Code com a opção New Terminal destacada](img/p006-2.webp)

*Figura 2.6.1: abrindo um terminal interno.*

É possível que você obtenha uma instância do PowerShell do Windows ou do prompt de comando comum. Essa informação é importante para o passo seguinte. Verifique qual você está usando no canto direito do painel do terminal, como destaca a figura a seguir.

![Painel do terminal do VS Code com a indicação powershell destacada no canto direito](img/p007-1.webp)

*Figura 2.6.2: identificando o tipo de terminal.*

Observe que há uma opção para que você possa utilizar o que preferir. Veja a figura a seguir.

![Menu de seleção de perfil do terminal aberto, com opções como PowerShell e Command Prompt](img/p007-2.webp)

*Figura 2.6.3: escolhendo o tipo de terminal.*

## O diretório bin do PostgreSQL no path
Duration: 8:00

No Windows, o módulo que implementa a especificação de conexão com bancos de dados que utilizaremos depende de um arquivo .DLL chamado **libpq.dll**. Ele pode ser encontrado no diretório "bin" do PostgreSQL. Caso ele tenha sido instalado no diretório padrão, o diretório bin pode ser encontrado em

```text
C:\Progra~1\PostgreSQL\14\bin
```

É preciso colocar esse diretório na variável de ambiente `path` do sistema operacional para que o arquivo libpq.dll possa ser encontrado. Isso pode ser feito utilizando-se o terminal do próprio VS Code. É importante estar ciente de que esta configuração será válida apenas para esta instância atual do terminal em uso. Por isso, quando for executar o programa, utilize sempre o terminal em que fez a configuração.

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

![Terminal PowerShell com a saída de $Env:path listando diretórios do Anaconda, do Windows e do VS Code](img/p008-1.webp)

*Figura 2.7.1: conteúdo atual da variável path no PowerShell.*

Use o comando a seguir para adicionar o diretório bin do PostgreSQL à variável de ambiente `path` do sistema operacional.

**Terminal (PowerShell)**

```bash
$Env:path += ';C:\Progra~1\PostgreSQL\14\bin'
```

Use `$Env:path` novamente para certificar-se de que a configuração foi feita com sucesso. Veja o resultado esperado na figura a seguir.

![Saída de $Env:path terminando com C:\Progra~1\PostgreSQL\14\bin, destacado](img/p008-2.webp)

*Figura 2.7.2: o diretório bin do PostgreSQL no final da variável path.*

### Prompt de comando

Se estiver usando o prompt de comando comum, use o comando a seguir para visualizar o que você possui em sua variável de ambiente `path` no momento.

**Terminal (prompt de comando)**

```bash
echo %PATH%
```

O resultado deve ser parecido com o que exibe a figura a seguir.

![Prompt de comando com a saída de echo %PATH%](img/p009-1.webp)

*Figura 2.7.3: conteúdo atual da variável PATH no prompt de comando.*

Use o comando a seguir para adicionar o diretório bin do PostgreSQL à variável de ambiente `path` do sistema operacional.

**Terminal (prompt de comando)**

```bash
set PATH=%PATH%;C:\Progra~1\PostgreSQL\14\bin
```

Use `echo %PATH%` novamente para certificar-se de que a configuração foi feita com sucesso. Veja o resultado esperado na figura a seguir.

![Saída de echo %PATH% terminando com C:\Progra~1\PostgreSQL\14\bin, destacado](img/p009-2.webp)

*Figura 2.7.4: o diretório bin do PostgreSQL no final da variável PATH.*

<aside class="negative">

A partir de agora, não feche mais o terminal que utilizou para configurar esta variável de ambiente. Caso o faça, será necessário refazer o procedimento utilizando um novo terminal.

</aside>

## O módulo psycopg
Duration: 5:00

O acesso a bases de dados relacionais por aplicativos Python é feito utilizando-se mecanismos previstos na especificação "Python Database API Specification v2.0". Há diferentes implementações para esta especificação. Uma das mais comuns e utilizadas se chama **psycopg**. Veja a sua página oficial em [https://www.psycopg.org/](https://www.psycopg.org/).

Seu uso requer a instalação de um módulo Python. No terminal interno do VS Code, use o comando a seguir para fazer a instalação.

**Terminal**

```bash
pip install psycopg[binary]
```

### Novo arquivo e teste da psycopg

No VS Code, clique em **File >> New File** e crie um arquivo chamado `login.py`. Faça como o código a seguir mostra para verificar se o módulo está configurado corretamente.

**login.py**

```python
import psycopg
print (psycopg)
```

No terminal interno do VS Code (o mesmo em que você configurou a variável de ambiente `path`), use o comando a seguir para testar.

**Terminal**

```bash
python login.py
```

O resultado esperado se parece com aquele que a figura a seguir exibe.

![Terminal exibindo a execução de python login.py e a saída module 'psycopg' from ... destacada](img/p010-1.webp)

*Figura 2.9.1: o módulo psycopg foi encontrado.*

## A classe Usuario e a verificação no banco
Duration: 10:00

### Classe para representar usuários

Na aplicação Python, usuários serão representados por objetos do tipo `Usuario`, graças a uma classe que definimos, como mostra o código a seguir.

**login.py**

```python
import psycopg
print (psycopg)
class Usuario:
    def __init__(self, login, senha):
        self.login = login
        self.senha = senha
```

### Método que abre conexão com o PostgreSQL e verifica se o usuário existe

O método do código a seguir desempenha as seguintes tarefas:

* Abre uma conexão com o PostgreSQL
* Por meio da conexão, obtém uma abstração do tipo "cursor"
* Por meio do cursor, executa um comando `SELECT`
* Usa um método do cursor para verificar o resultado do comando `SELECT`
* Devolve `True` ou `False`, dependendo do resultado

**login.py**

```python
import psycopg
print (psycopg)
class Usuario:
    def __init__(self, login, senha):
        self.login = login
        self.senha = senha
#definição do método: ele recebe um objeto do tipo Usuario
def existe (usuario):
    #Abre a conexão
    with psycopg.connect(
        host="localhost",
        port=5432,
        dbname="20221_pessoal_db_login",
        user="postgres",
        password="postgres"
    ) as conexao:
        #obtém um cursor
        with conexao.cursor() as cursor:
            #executa o comando
            cursor.execute('SELECT * FROM tb_usuario WHERE login=%s AND senha=%s', (f'{usuario.login}', f'{usuario.senha}'))
            #obtém o resultado
            result = cursor.fetchone()
            #verifica se o resultado é diferente de None, o que indica que o usuário existe na base
            return result != None
```

<aside class="positive">

Ajuste `dbname`, `user` e `password` para os valores da sua instalação: `dbname` é o nome da base que você criou no primeiro passo.

</aside>

## Menu de opções
Duration: 10:00

A seguir, escrevemos uma função que dá as seguintes opções ao usuário:

* 0: Sair
* 1: Fazer login
* 2: Fazer logoff

Veja o código a seguir. Repare que na última linha tomamos o cuidado de chamar a função `menu`.

**login.py**

```python
import psycopg
print (psycopg)
class Usuario:
    def __init__(self, login, senha):
        self.login = login
        self.senha = senha
#definição do método: ele recebe um objeto do tipo Usuario
def existe (usuario):
    #Abre a conexão
    with psycopg.connect(
        host="localhost",
        port=5432,
        dbname="20221_pessoal_db_login",
        user="postgres",
        password="postgres"
    ) as conexao:
        #obtém um cursor
        with conexao.cursor() as cursor:
            #executa o comando
            cursor.execute('SELECT * FROM tb_usuario WHERE login=%s AND senha=%s', (f'{usuario.login}', f'{usuario.senha}'))
            #obtém o resultado
            result = cursor.fetchone()
            #verifica se o resultado é diferente de None, o que indica que o usuário existe na base
            return result != None
#definição da função menu
def menu():
    #texto a ser exibido
    texto = "0-Fechar Sistema\n1-Login\n2-Logoff\n"
    #usuário ainda não existe
    usuario = None
    #capturamos a opção do usuário
    op = int (input (texto))
    #enquanto ele não digitar zero
    while op != 0:
        #se digitar 1, capturamos login e senha e verificamos se o usuário existe na base
        if op == 1:
            login = input ("Digite seu login\n")
            senha = input ("Digite sua senha\n")
            usuario = Usuario (login, senha)
            print ("Usuário OK!!!" if existe(usuario) else "Usuário NOK!!!")
        #se ele digitar 2, configuramos o usuario como "None" novamente
        elif op == 2:
            usuario = None
            print ("Logoff realizado com sucesso")
        op = int (input (texto))
    else:
        #se digitar zero, dizemos adeus. Observe que esse else está associado ao while
        print ("Até mais")
#chamamos a função menu
menu()
```

Execute com `python login.py` no mesmo terminal em que configurou a variável `path` e teste o login com os usuários `admin`/`admin` e `joao`/`123456`.

## Exercícios
Duration: 20:00

Adicione a opção número **3** ao menu. Ela deve permitir que o usuário faça a inserção de novos usuários na base gerenciada pelo PostgreSQL.

<details><summary>Ver resposta</summary>

Veja uma possível solução.

**login.py**

```python
import psycopg
print (psycopg)
class Usuario:
    def __init__(self, login, senha):
        self.login = login
        self.senha = senha

#definição do método: ele recebe um objeto do tipo Usuario
def existe (usuario):
    #Abre a conexão
    with psycopg.connect(
        host="localhost",
        port=5432,
        dbname="20221_pessoal_db_login",
        user="postgres",
        password="postgres"
    ) as conexao:
        #obtém um cursor
        with conexao.cursor() as cursor:
            #executa o comando
            cursor.execute('SELECT * FROM tb_usuario WHERE login=%s AND senha=%s', (f'{usuario.login}', f'{usuario.senha}'))
            #obtém o resultado
            result = cursor.fetchone()
            #verifica se o resultado é diferente de None, o que indica que o usuário existe na base
            return result != None

#método que insere usuário na base
def inserir (usuario):
    with psycopg.connect(
        host="localhost",
        port=5432,
        dbname="20221_pessoal_db_login",
        user="postgres",
        password="postgres"
    ) as conexao:
        with conexao.cursor() as cursor:
            cursor.execute ('INSERT INTO tb_usuario (login, senha) VALUES (%s, %s)', (f'{usuario.login}', f'{usuario.senha}'))
            return cursor.rowcount >= 1

#definição da função
def menu():
    #texto a ser exibido
    texto = "0-Fechar Sistema\n1-Login\n2-Logoff\n3-Cadastrar novo usuário\n"
    #usuário ainda não existe
    usuario = None
    #capturamos a opção do usuário
    op = int (input (texto))
    #enquanto ele não digitar zero
    while op != 0:
        #se digitar 1, capturamos login e senha e verificamos se o usuário existe na base
        if op == 1:
            login = input ("Digite seu login\n")
            senha = input ("Digite sua senha\n")
            usuario = Usuario (login, senha)
            print ("Usuário OK!!!" if existe(usuario) else "Usuário NOK!!!")
        #se ele digitar 2, configuramos o usuario como "None" novamente
        elif op == 2:
            usuario = None
            print ("Logoff realizado com sucesso")
        elif op == 3:
            login = input ("Digite login do novo usuário\n")
            senha = input ("Digite senha do novo usuário\n")
            novoUsuario = Usuario (login, senha)
            print ("Inserção OK!!!" if inserir(novoUsuario) else "Inserção NOK")
        else:
            print ("Opção inválida")
        op = int (input (texto))
    else:
        #se digitar zero, dizemos adeus. Observe que esse else está associado ao while
        print ("Até mais")

#chamamos a função menu
menu()
```

</details>

### Bibliografia

* HEUSER, Carlos Alberto. **Projeto de Banco de Dados**. 6ª ed. Bookman, 2008.
