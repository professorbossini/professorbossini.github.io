summary: Crie no VS Code um projeto Java que se conecta ao MySQL com JDBC, adicionando o driver como biblioteca referenciada, tratando exceções com try/catch e inserindo dados com PreparedStatement.
id: java-jdbc-vs-code
categories: Java,MySQL,Bancos de Dados
tags: java,jdbc,mysql,vs code,driver,preparedstatement,try/catch
status: Published
authors: Rodrigo Bossini
last updated: 2022-05-03
pdf: java/900_apostila_java_jdbc_vs_code.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Java e MySQL com JDBC no VS Code

## Visão geral
Duration: 2:00

Neste material, veremos como criar um projeto Java que se conecta a uma instância do MySQL utilizando o VS Code.

### O que você vai aprender

* Instalar a extensão Extension Pack for Java
* Baixar o driver JDBC do MySQL e adicioná-lo como biblioteca referenciada
* Tratar exceções com `try/catch` ao se conectar ao banco
* Criar banco e tabela no MySQL Workbench
* Inserir dados a partir da aplicação Java com `PreparedStatement`

### O que você vai precisar

* VS Code e JDK instalados
* MySQL Server em execução e MySQL Workbench

## Preparando o projeto no VS Code
Duration: 5:00

### Extensão

No VS Code, certifique-se de que você possui a extensão **Extension Pack for Java**. Para fazer a sua instalação, abra o Marketplace do VS Code. Como mostra a Figura 2.1.1, busque por Java. Clique sobre o nome da extensão e então clique em **Install**.

![Marketplace do VS Code com a busca por java e a página da extensão Extension Pack for Java aberta](img/fig-2-1-1.webp)

*Figura 2.1.1 – Instalando o Extension Pack for Java.*

### Vincule o VS Code a uma pasta

Crie uma pasta apropriada para este projeto, inicialmente vazia. A seguir, no VS Code, clique **File >> Open Folder** e abra essa pasta.

### Arquivo Java para teste

No VS Code, crie um arquivo chamado `TesteConexao.java`. Logo depois de criar o arquivo, certifique-se de que a aba **Java Projects** apareceu. Ela costuma aparecer no canto inferior esquerdo do VS Code. Expanda os itens existentes até encontrar o item chamado **Referenced Libraries**. Não faça nada com ele por enquanto. Veja a Figura 2.3.2.

![VS Code com o arquivo TesteConexao.java e, no canto inferior esquerdo, a aba Java Projects com o item Referenced Libraries destacado](img/fig-2-3-2.webp)

*Figura 2.3.2 – A aba Java Projects e o item Referenced Libraries.*

## Download do driver JDBC
Duration: 5:00

Estamos diante de um cenário em que duas aplicações desejam se comunicar: nossa aplicação Java e o servidor MySQL. Isso será feito utilizando-se um protocolo próprio, que é implementado pelo próprio fabricante do MySQL. Essa implementação nos é entregue como uma coleção de classes empacotadas num arquivo de extensão `jar`. Ela leva o nome de "**driver**". Visite o link a seguir para fazer o download.

[https://dev.mysql.com/downloads/connector/j/](https://dev.mysql.com/downloads/connector/j/)

Escolha a opção **Platform Independent** e faça o download do arquivo em formato **zip**, como na Figura 2.4.1.

![Página de download do Connector/J com Platform Independent selecionado e o botão Download do arquivo ZIP destacado](img/fig-2-4-1.webp)

*Figura 2.4.1 – Baixando o Connector/J em formato zip.*

Na tela seguinte, exibida pela Figura 2.4.2, apenas clique em **No thanks, just start my download**.

![Tela de login da Oracle com o link No thanks, just start my download destacado](img/fig-2-4-2.webp)

*Figura 2.4.2 – Iniciando o download sem criar conta.*

Quando o download terminar, você precisará descompactar o arquivo. Uma vez que tenha feito isso, você se deparará com o conteúdo exibido pela Figura 2.4.3.

![Conteúdo do arquivo descompactado, com a pasta src, arquivos de licença e o arquivo mysql-connector-java-8.0.29.jar](img/fig-2-4-3.webp)

*Figura 2.4.3 – O arquivo .jar do driver.*

## Adicionando o driver ao projeto
Duration: 5:00

O arquivo que desejamos é aquele de extensão `.jar`. Ele precisará ser adicionado ao **classpath** de nosso projeto. Há inúmeras formas de fazê-lo. Uma delas consiste nos seguintes passos:

* Crie uma pasta chamada `lib` como subpasta daquela a que seu VS Code está vinculado. Você pode fazer isso a partir do próprio VS Code.
* Copie o arquivo `.jar` para dentro da pasta `lib`. Por enquanto, o resultado esperado é aquele exibido pela Figura 2.5.1.

![Explorer do VS Code com a pasta lib contendo mysql-connector-java-8.0.29.jar e o arquivo TesteConexao.java](img/fig-2-5-1.webp)

*Figura 2.5.1 – O driver dentro da pasta lib.*

* No VS Code, no canto inferior esquerdo, clique no botão **+** que fica à frente de **Referenced Libraries**. Navegue até a pasta `lib` que você criou e adicione o arquivo `.jar`. Veja o resultado esperado na Figura 2.5.2.

![Aba Java Projects com o driver mysql-connector-java-8.0.29.jar listado em Referenced Libraries](img/fig-2-5-2.webp)

*Figura 2.5.2 – O driver adicionado como biblioteca referenciada.*

## Método main e exceções
Duration: 10:00

Estamos diante de um cenário em que dois programas de computador desejam se comunicar. Por um lado, temos o programa que escreveremos em Java. Por outro lado, o servidor MySQL. O programa em Java deseja enviar comandos SQL para o MySQL Server, na esperança de ele os receber, compilar, executar e devolver uma resposta indicando o resultado. Observe, entretanto, que há diferentes situações em que essa comunicação pode falhar.

* Esquecemos de adicionar o driver JDBC ao classpath de nossa aplicação. Ele é o responsável pela implementação do protocolo de comunicação entre as aplicações.
* Deixamos de instalar ou colocar o MySQL Server em execução.
* O MySQL Server está vinculado a uma porta diferente daquela que o programa em Java está tentando utilizar para enviar os comandos SQL.
* O programa em Java tenta usar um banco de dados que não existe no MySQL Server.
* O programa em Java envia um comando SQL que faz referência a uma tabela ou a uma coluna que não existe no banco de dados referenciado.

Todas essas situações são representadas como **exceções**. Quando temos um bloco de código que pode dar origem a uma exceção, desejamos ser capazes de especificar um outro cuja execução deve iniciar caso uma exceção seja detectada, da seguinte forma.

* "Tentamos" executar o bloco de código principal. Se nenhuma exceção acontecer, ele termina a sua execução e nada mais acontece.
* "Tentamos" executar o bloco de código principal. Se uma exceção for detectada, o fluxo de execução desvia imediatamente para outro bloco de código que também especificamos, fazendo com que o fluxo alternativo de execução entre em funcionamento. Neste cenário, estamos tratando a exceção para que o programa não encerre a sua execução abruptamente.

A construção que desejamos utilizar para isso é a **try/catch**. Assim, defina o método `main` como mostra o Bloco de Código 2.6.1. Ele usa a API JDBC para tentar realizar uma conexão com o MySQL Server. O bloco `try` é o principal. O `catch` é o alternativo, cuja execução ocorre somente mediante uma exceção.

**TesteConexao.java · Bloco de Código 2.6.1**

```java
import java.sql.DriverManager;
import java.sql.Connection;

public class TesteConexao {
    public static void main(String[] args) {
        try {
            Connection conexao = DriverManager.getConnection(
                //essa é a conhecida string de conexão
                "jdbc:mysql://localhost:3306/teste",
                "root",
                "1234"
            );
            if (conexao != null) {
                System.out.println("Conexão estabelecida com sucesso!");
            }
            else {
                System.out.println("Conexão não estabelecida!");
            }
        }
        catch (Exception e) {
            System.out.println("Exceção: " + e.getMessage());
        }
    }
}
```

Observe que estamos fazendo referência a um banco de dados chamado `teste`. Como ele ainda não existe, o fluxo de execução desvia para o bloco `catch` e exibe uma mensagem parecida com aquela que a Figura 2.6.1 exibe.

![Terminal do VS Code com a mensagem Exceção: Unknown database 'teste' destacada](img/fig-2-6-1.webp)

*Figura 2.6.1 – O banco teste ainda não existe.*

<aside class="negative">

Se a mensagem for `No suitable driver found for jdbc:mysql://localhost:3306/teste`, o driver não está no classpath: confira o passo anterior.

</aside>

## Banco e tabela no MySQL Workbench
Duration: 5:00

### Criando um banco de dados

Abra o MySQL Workbench e crie um banco de dados com o comando exibido pelo Bloco de Código 2.7.1.

**MySQL Workbench · Bloco de Código 2.7.1**

```sql
-- cria o banco
CREATE DATABASE teste;
-- explica ao MySQL Server que os comandos a seguir deverão ter impacto neste banco
USE teste;
```

### Criando uma tabela

A seguir, vamos criar uma tabela para testar operações CRUD (*Create, Read, Update, Delete*). Para tal, use o comando do Bloco de Código 2.8.1.

**MySQL Workbench · Bloco de Código 2.8.1**

```sql
CREATE TABLE tb_pessoa(
    cod_pessoa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    idade INT NOT NULL
);
```

### Inserindo pessoas com o MySQL Workbench

Use o comando do Bloco de Código 2.9.1 para inserir dados na tabela.

**MySQL Workbench · Bloco de Código 2.9.1**

```sql
-- insere duas pessoas
INSERT INTO tb_pessoa (nome, idade) VALUES ('Pedro', 17), ('João', 22);
```

## Inserindo pessoas com a aplicação Java
Duration: 8:00

De volta ao VS Code, ajuste seu método `main` para fazer a inserção dos dados de uma pessoa digitados pelo usuário. Veja o Bloco de Código 2.10.1.

**TesteConexao.java · Bloco de Código 2.10.1**

```java
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import javax.swing.JOptionPane;
import java.sql.Connection;

public class TesteConexao {
    public static void main(String[] args) {
        try {
            Connection conexao = DriverManager.getConnection(
                //essa é a conhecida string de conexão
                "jdbc:mysql://localhost:3306/teste",
                "root",
                "1234"
            );
            if (conexao != null) {
                System.out.println("Conexão estabelecida com sucesso!");
                String nome = JOptionPane.showInputDialog("Qual o nome?");
                int idade = Integer.parseInt(JOptionPane.showInputDialog("Qual a idade?"));
                //o comando a ser executado é uma simples string
                //os símbolos ? reservam o lugar de valores a serem especificados
                String sql = "INSERT INTO tb_pessoa (nome, idade) VALUES (?, ?)";
                //uma estrutura que representa o comando é "preparada". Assim, ele pode ser executado diversas vezes com dados diferentes
                PreparedStatement ps = conexao.prepareStatement(sql);
                //configuramos os valores a serem inseridos
                ps.setString(1, nome);
                ps.setInt(2, idade);
                //executamos o comando
                ps.execute();
                //fechamos a conexão para que o MySQL Server possa liberar recursos
                conexao.close();
                JOptionPane.showMessageDialog(null, "Dados inseridos com sucesso!");
            }
            else {
                System.out.println("Conexão não estabelecida!");
            }
        }
        catch (Exception e) {
            System.out.println("Exceção: " + e.getMessage());
        }
    }
}
```

Execute o programa, informe um nome e uma idade e confira no Workbench, com um `SELECT * FROM tb_pessoa;`, que a nova linha foi gravada.

## Encerramento
Duration: 2:00

Você configurou um projeto Java no VS Code com o driver JDBC do MySQL como biblioteca referenciada, tratou as falhas de conexão com `try/catch`, criou banco e tabela no Workbench e inseriu dados a partir da aplicação com `PreparedStatement`.

### Próximos passos

* Implemente as demais operações CRUD (listar, atualizar e apagar) seguindo o mesmo padrão
