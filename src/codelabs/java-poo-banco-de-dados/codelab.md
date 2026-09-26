summary: Persista objetos Java em um banco MySQL, aprendendo o modelo relacional, os comandos SQL básicos, o driver JDBC via Maven e as operações de cadastro, atualização, remoção e listagem com PreparedStatement.
id: java-poo-banco-de-dados
categories: Java,MySQL,Bancos de Dados
tags: java,jdbc,mysql,sql,crud,maven,netbeans,preparedstatement
status: Published
authors: Rodrigo Bossini
last updated: 2022-05-04
pdf: java/009_apostila_java_poo_bd.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Java e bancos de dados: CRUD com JDBC e MySQL

## Visão geral
Duration: 3:00

As aplicações que desenvolvemos até então representam os dados de interesse como objetos. Eles ficam armazenados na memória principal do computador, a memória RAM. Veja, por exemplo, a Figura 1.1. Ela ilustra alguns detalhes de interesse sobre a manipulação de objetos, como a existência de objetos e variáveis de referência, as memórias stack e heap entre outras coisas. Trata-se do nosso minimundo representado na memória gerenciada pela JVM.

![Memória da JVM com a variável empregados na stack referenciando um vetor na heap cujas posições apontam para objetos](img/fig-1-1.webp)

*Figura 1.1 – Objetos e variáveis de referência na memória da JVM.*

### O que você vai aprender

* Por que usar memória persistente e um SGBD
* O modelo relacional: tabelas, colunas e chave primária
* Os comandos SQL `CREATE DATABASE`, `USE`, `CREATE TABLE`, `INSERT`, `SELECT`, `UPDATE` e `DELETE`
* Como adicionar o driver JDBC do MySQL com o Maven
* A arquitetura cliente/servidor e o papel da conexão
* Como implementar as operações CRUD em Java com `PreparedStatement` e `ResultSet`

### O que você vai precisar

* MySQL Server e MySQL Workbench instalados
* NetBeans com um projeto Java gerenciado pelo Maven
* Conhecer classes, objetos e encapsulamento

## Memória persistente e SGBDs
Duration: 5:00

Uma característica inerente à memória principal do computador é o fato de ela ser **volátil**. Isso quer dizer que os dados nela armazenados são perdidos uma vez que o computador seja desligado, ou mesmo quando a aplicação for fechada.

Ocorre que isso pode não ser suficiente para resolver muitos problemas do mundo real. Por exemplo, considere o sistema acadêmico de uma universidade. Quando um aluno se matricula, seus dados precisam ser armazenados ao longo do tempo, não podem ser perdidos quando algum computador for desligado, por exemplo. Quando o professor (cujos dados também precisam ser armazenados) cadastrar suas notas e faltas, esses dados também não podem ser perdidos. Eles precisam ser armazenados em **meio persistente**. Uma possibilidade é armazenar os dados no HD do computador, que faz parte do que conhecemos como memória secundária.

O armazenamento de dados em arquivos comuns no sistema de arquivos é muito utilizado por diversas aplicações. Porém, seu uso é trabalhoso e as principais operações desejadas já possuem implementações eficientes e convenientes, que podem ser simplesmente reutilizadas.

As principais operações que desejamos realizar envolvendo memória persistente são:

* Inserção de dados
* Obtenção de dados
* Atualização de dados
* Remoção de dados

Essas operações são muito comumente identificadas como operações **CRUD**, do inglês *Create, Read, Update* e *Delete*.

> **SGBD**
>
> Um Sistema Gerenciador de Banco de Dados (SGBD) é um software que manipula a memória persistente oferecendo uma abstração que simplifica o código a ser escrito. Os arquivos são apresentados de acordo com um modelo predeterminado, que visa facilitar seu uso. Uma de suas principais características é simplificar a implementação das operações CRUD.

Neste material, iremos aprender a escrever uma aplicação Java que se comunica com um Sistema Gerenciador de Banco de Dados para fazer o armazenamento de dados em meio persistente.

## MySQL e o modelo relacional
Duration: 6:00

O SGBD que utilizaremos neste material é o **MySQL**, um SGBD gratuito e muito utilizado comercialmente. Ele pode ser obtido no link a seguir.

[https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)

Faça a instalação para **Developers**. O assistente de instalação deve oferecer essa opção. Não deixe de instalar também o **MySQL Workbench**, um cliente de interface gráfica para o MySQL.

### O modelo de dados

O modelo de dados utilizado pelo MySQL é o **modelo relacional**. A palavra relacional vem de relação, que é sinônimo de tabela. Ou seja, todos os dados que manipularemos no MySQL serão representados como tabelas. Tabelas possuem colunas, cada qual com o seu nome. Veja um exemplo na Figura 2.1.1. Trata-se de uma tabela capaz de armazenar dados de pessoas. Neste minimundo, pessoas têm nome, telefone e e-mail.

![Tabela com as colunas Nome, Telefone e Email e três linhas: José, João e Maria](img/fig-2-1-1.webp)

*Figura 2.1.1 – Uma tabela de pessoas.*

* Note que cada coluna tem um nome único. A ordem delas não importa. Cada linha contém os dados de uma pessoa específica.
* Quando utilizamos o modelo relacional, precisamos tomar o cuidado de garantir que cada linha de uma tabela possa ser diferenciada das demais. Isso é necessário pois pessoas podem ter muitos dados iguais, como nome, idade etc.
* O mecanismo utilizado para viabilizar a distinção entre linhas de uma tabela chama-se **chave primária**. Informalmente, trata-se de uma coluna cujos valores permitem diferenciar uma linha das demais. Ou seja, um determinado valor nunca ocorre em mais de uma linha.
* É comum (mas não obrigatório) adicionar uma coluna chamada código ou id às tabelas e, para cada linha, armazenar um número inteiro que tenha as características descritas. Veja o exemplo da Figura 2.1.2.

![A mesma tabela com uma coluna Codigo à esquerda, com os valores 1, 2 e 3](img/fig-2-1-2.webp)

*Figura 2.1.2 – A coluna Codigo identifica cada linha.*

* O modelo relacional possui muito mais características do que as apresentadas nesta seção. O que apresentamos é suficiente para essa primeira aula de acesso a bases de dados.

## Comandos SQL no Workbench
Duration: 10:00

### Criando uma base de dados

O MySQL é um Sistema Gerenciador de Bancos de Dados, ou seja, um software capaz de gerenciar diversos bancos de dados. O primeiro passo para utilizá-lo é criar um novo banco de dados. Faremos isso usando o MySQL Workbench.

Abra o Workbench e digite o comando da Listagem 2.2.1.

**MySQL Workbench · Listagem 2.2.1**

```sql
CREATE DATABASE db_pessoas;
```

A seguir, precisamos indicar que os comandos que virão, por exemplo, para a criação de tabelas, terão impacto sobre esse banco de dados recém-criado. Isso é necessário porque o MySQL pode gerenciar diversos bancos de dados. Por isso, ele precisa saber em qual banco de dados executar os comandos que iremos utilizar. Veja a Listagem 2.2.2.

**MySQL Workbench · Listagem 2.2.2**

```sql
USE db_pessoas;
```

### Criando uma tabela

Agora podemos criar nossa primeira tabela. Precisamos especificar um nome para a tabela, o nome de cada coluna de interesse, o tipo de cada coluna, eventuais restrições e qual coluna será a sua chave primária. Veja a Listagem 2.3.1.

**MySQL Workbench · Listagem 2.3.1**

```sql
CREATE TABLE tb_pessoa(
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(200),
    fone VARCHAR(200),
    email VARCHAR(200)
);
```

### Inserção de dados

A seguir, podemos fazer a inserção de alguns dados na tabela recém-criada. Veja a Listagem 2.3.2.

**MySQL Workbench · Listagem 2.3.2**

```sql
INSERT INTO tb_pessoa (nome, fone, email) VALUES ('Jose', '11223344', 'jose@email.com');
INSERT INTO tb_pessoa (nome, fone, email) VALUES ('Joao', '22334455', 'joao@email.com');
INSERT INTO tb_pessoa (nome, fone, email) VALUES ('Maria', '00117788', 'maria@email.com');
```

### Obtenção de dados

Podemos verificar os dados armazenados na tabela com o comando `SELECT`, como na Listagem 2.5.1.

**MySQL Workbench · Listagem 2.5.1**

```sql
SELECT * FROM tb_pessoa;
```

### Atualização de dados

Podemos alterar os dados existentes em uma tabela, eventualmente especificando um critério para que a atualização tenha impacto somente sobre uma linha. Veja o exemplo da Listagem 2.6.1.

**MySQL Workbench · Listagem 2.6.1**

```sql
UPDATE tb_pessoa SET nome='José da Silva' WHERE codigo = 1;
```

### Apagando dados

Para apagar dados de uma tabela, usamos o comando `DELETE`. Veja a Listagem 2.7.1.

**MySQL Workbench · Listagem 2.7.1**

```sql
DELETE FROM tb_pessoa WHERE codigo=3;
```

## Driver do MySQL para JDBC
Duration: 6:00

A API que utilizaremos para acessar o MySQL usando a linguagem Java chama-se **JDBC**. A comunicação entre a aplicação Java e o SGBD MySQL é implementada por uma coleção de classes que é disponibilizada pelo fabricante do MySQL. Essa coleção de classes chama-se **Driver**. Precisamos fazer o download do driver do MySQL e adicioná-lo ao **classpath** do projeto, ou seja, a variável utilizada pelo compilador e pela JVM para decidir quais classes considerar no momento de compilação e interpretação, respectivamente. O Driver do MySQL para JDBC pode ser obtido manualmente no link a seguir.

[https://dev.mysql.com/downloads/connector/j/](https://dev.mysql.com/downloads/connector/j/)

No NetBeans, temos criado projetos gerenciados pelo **Maven** que, entre outras coisas, é capaz de fazer o download de dependências e ajustá-las adequadamente. Para fazer o download do driver do MySQL usando o Maven, expanda o seu projeto e encontre a opção **Project Files**, como na Figura 2.8.1.

![Aba Projects do NetBeans com o projeto expandido mostrando Project Files e o arquivo pom.xml](img/fig-2-8-1.webp)

*Figura 2.8.1 – O arquivo pom.xml em Project Files.*

Note que há um arquivo chamado `pom.xml`. É ali que especificaremos nossas dependências. Abra o arquivo e adicione o conteúdo da Listagem 2.8.2.

**pom.xml · Listagem 2.8.2**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>br.com.bossini</groupId>
    <artifactId>pessoal_teste_db2</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
    </properties>
    <dependencies>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.19</version>
        </dependency>
    </dependencies>
</project>
```

## Cliente/servidor e a conexão
Duration: 6:00

### Arquitetura cliente/servidor

Quando fizemos uso do MySQL por meio do Workbench, fizemos uso da arquitetura conhecida como **cliente/servidor**. A ideia é muito simples. De um lado, temos um software em execução esperando por requisições a serem feitas (o MySQL); de outro lado, temos um software em execução que, de tempos em tempos, pode realizar requisições a um servidor (o Workbench). Veja a Figura 2.9.1.

![O Workbench envia comandos SQL como SELECT e INSERT ao MySQL, que guarda a tabela tb_pessoa no banco db_pessoa e responde](img/fig-2-9-1.webp)

*Figura 2.9.1 – O Workbench faz requisições ao MySQL, que responde.*

### Conexão entre a aplicação Java e o servidor MySQL

Entender a arquitetura cliente/servidor é fundamental pois a aplicação Java que implementaremos desempenhará o papel de cliente. Ela enviará comandos ao MySQL que, por sua vez, os executará e devolverá respostas de acordo.

O primeiro passo é obter uma **conexão** com o banco. Ou seja, um canal de comunicação que permita o envio de comandos e o recebimento de respostas. Veja a Figura 2.10.1.

![Nossa aplicação Java envia comandos ao MySQL por meio de uma conexão, representada como um canal entre os dois, e recebe as respostas](img/fig-2-10-1.webp)

*Figura 2.10.1 – A conexão é o canal entre a aplicação Java e o MySQL.*

Segundo o princípio conhecido como **alta coesão**, é interessante criarmos uma classe cuja única razão de ser seja a manipulação de conexões com o MySQL. Sua implementação é dada na Listagem 2.10.1.

**ConnectionFactory.java · Listagem 2.10.1**

```java
import java.sql.Connection;
import java.sql.DriverManager;

public class ConnectionFactory {

    private String usuario = "root";
    private String senha = "1234";
    private String host = "localhost";
    private String porta = "3306";
    private String bd = "db_pessoas";

    public Connection obtemConexao() {
        try {
            Connection c = DriverManager.getConnection(
                "jdbc:mysql://" + host + ":" + porta + "/" + bd,
                usuario,
                senha
            );
            return c;
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
```

<aside class="negative">

Ajuste `usuario` e `senha` para os dados do seu MySQL. A senha "1234" é só um exemplo.

</aside>

## A classe Pessoa e o menu
Duration: 6:00

### A classe Pessoa

Agora iremos definir uma classe para representar pessoas. Ela terá um campo apropriado para cada coluna existente na base, pois nosso objetivo é armazenar objetos do tipo pessoa na base. Além disso, caberá à classe `Pessoa` definir as operações de acesso à base. Embora estejamos violando o princípio da alta coesão, isso simplifica a solução e permite que tenhamos foco na parte técnica. Futuramente aplicaremos um procedimento chamado **refatoração** ao código, respeitando as boas práticas e obtendo código mais facilmente reutilizável e de mais fácil manutenção. Veja a Listagem 2.11.1.

**Pessoa.java · Listagem 2.11.1**

```java
public class Pessoa {
    private int codigo;
    private String nome;
    private String fone;
    private String email;

    //getters/setters
}
```

### Menu para operações na base

Vamos implementar uma classe que oferece o seguinte menu ao usuário:

```text
1- Cadastrar pessoa
2- Atualizar pessoa
3- Apagar pessoa
4- Listar pessoas
0- Sair
```

A classe com o menu principal é exibida na Listagem 2.12.1.

**Principal.java · Listagem 2.12.1**

```java
public class Principal {
    public static void main(String[] args) {
        String menu = "1-Cadastrar\n2-Atualizar\n3-Apagar\n4-Listar\n0-Sair";
        int op;
        do {
            op = Integer.parseInt(JOptionPane.showInputDialog(menu));
            switch (op) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 0:
                    break;
                default:
                    JOptionPane.showMessageDialog(null, "Opção inválida");
            }
        } while (op != 0);
    }
}
```

## Cadastrando e atualizando pessoas
Duration: 10:00

### Cadastro

Na Listagem 2.12.2 fazemos o cadastro de uma `Pessoa`. O método faz parte da classe `Pessoa`.

**Pessoa.java · Listagem 2.12.2**

```java
public void inserir() {
    //1: Definir o comando SQL
    String sql = "INSERT INTO tb_pessoa(nome, fone, email) VALUES (?, ?, ?)";
    //2: Abrir uma conexão
    ConnectionFactory factory = new ConnectionFactory();
    try (Connection c = factory.obtemConexao()) {
        //3: Pré compila o comando
        PreparedStatement ps = c.prepareStatement(sql);
        //4: Preenche os dados faltantes
        ps.setString(1, nome);
        ps.setString(2, fone);
        ps.setString(3, email);
        //5: Executa o comando
        ps.execute();
    }
    catch (Exception e) {
        e.printStackTrace();
    }
}
```

O comando já pode ser usado no menu, como mostra a Listagem 2.12.3.

**Principal.java · Listagem 2.12.3**

```java
case 1: {
    String nome = JOptionPane.showInputDialog("Nome?");
    String fone = JOptionPane.showInputDialog("Fone?");
    String email = JOptionPane.showInputDialog("Email?");
    Pessoa p = new Pessoa();
    p.setNome(nome);
    p.setFone(fone);
    p.setEmail(email);
    p.inserir();
    break;
}
```

### Atualização

As estruturas dos métodos de acesso à base são sempre muito semelhantes. A Listagem 2.12.4 mostra como atualizar os dados de uma pessoa cujo código é informado pelo usuário. O método pertence à classe `Pessoa`.

**Pessoa.java · Listagem 2.12.4**

```java
public void atualizar() {
    //1: Definir o comando SQL
    String sql = "UPDATE tb_pessoa SET nome = ?, fone = ?, email = ? WHERE codigo = ?";
    //2: Abrir uma conexão
    ConnectionFactory factory = new ConnectionFactory();
    try (Connection c = factory.obtemConexao()) {
        //3: Pré compila o comando
        PreparedStatement ps = c.prepareStatement(sql);
        //4: Preenche os dados faltantes
        ps.setString(1, nome);
        ps.setString(2, fone);
        ps.setString(3, email);
        ps.setInt(4, codigo);
        //5: Executa o comando
        ps.execute();
    }
    catch (Exception e) {
        e.printStackTrace();
    }
}
```

A seguir, adicione o método ao menu, como na Listagem 2.12.5.

**Principal.java · Listagem 2.12.5**

```java
case 2: {
    String nome = JOptionPane.showInputDialog("Nome?");
    String fone = JOptionPane.showInputDialog("Fone?");
    String email = JOptionPane.showInputDialog("Email?");
    int codigo = Integer.parseInt(JOptionPane.showInputDialog("Codigo?"));
    Pessoa p = new Pessoa();
    p.setNome(nome);
    p.setFone(fone);
    p.setEmail(email);
    p.setCodigo(codigo);
    p.atualizar();
    break;
}
```

## Apagando e listando pessoas
Duration: 10:00

### Remoção

O método que permite a remoção de pessoas é exibido na Listagem 2.12.6. Ele pertence à classe `Pessoa`.

**Pessoa.java · Listagem 2.12.6**

```java
public void apagar() {
    //1: Definir o comando SQL
    String sql = "DELETE FROM tb_pessoa WHERE codigo = ?";
    //2: Abrir uma conexão
    ConnectionFactory factory = new ConnectionFactory();
    try (Connection c = factory.obtemConexao()) {
        //3: Pré compila o comando
        PreparedStatement ps = c.prepareStatement(sql);
        //4: Preenche os dados faltantes
        ps.setInt(1, codigo);
        //5: Executa o comando
        ps.execute();
    }
    catch (Exception e) {
        e.printStackTrace();
    }
}
```

Ajuste o menu principal para utilizá-lo, como na Listagem 2.12.7.

**Principal.java · Listagem 2.12.7**

```java
case 3: {
    int codigo =
        Integer.parseInt(JOptionPane.showInputDialog("Codigo?"));
    Pessoa p = new Pessoa();
    p.setCodigo(codigo);
    p.apagar();
    break;
}
```

### Listagem

O método para listar todos os clientes é semelhante. Porém, ele faz uso de um objeto do tipo `ResultSet` para representar os dados trazidos da base. Veja a Listagem 2.12.8. Note que ela faz uso da classe `JOptionPane`, o que certamente não é ideal. Como mencionado, o código deverá passar por um processo de refatoração.

**Pessoa.java · Listagem 2.12.8**

```java
public void listar() {
    //1: Definir o comando SQL
    String sql = "SELECT * FROM tb_pessoa";
    //2: Abrir uma conexão
    ConnectionFactory factory = new ConnectionFactory();
    try (Connection c = factory.obtemConexao()) {
        //3: Pré compila o comando
        PreparedStatement ps = c.prepareStatement(sql);
        //4: Executa o comando e guarda
        //o resultado em um ResultSet
        ResultSet rs = ps.executeQuery();
        //5: itera sobre o resultado
        while (rs.next()) {
            int codigo = rs.getInt("codigo");
            String nome = rs.getString("nome");
            String fone = rs.getString("fone");
            String email = rs.getString("email");
            String aux = String.format(
                "Código: %d, Nome: %s, Fone: %s, Email: %s",
                codigo,
                nome,
                fone,
                email
            );
            JOptionPane.showMessageDialog(null, aux);
        }
    }
    catch (Exception e) {
        e.printStackTrace();
    }
}
```

Encaixe o método no menu principal, como exibe a Listagem 2.12.9.

**Principal.java · Listagem 2.12.9**

```java
case 4: {
    Pessoa p = new Pessoa();
    p.listar();
    break;
}
```

### As classes completas

<details><summary>Ver Pessoa.java e Principal.java montadas</summary>

As duas classes abaixo reúnem os trechos deste codelab, com as linhas de `import` e os getters/setters que a apostila indica apenas com comentários.

**Pessoa.java**

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.swing.JOptionPane;

public class Pessoa {
    private int codigo;
    private String nome;
    private String fone;
    private String email;

    public int getCodigo() {
        return codigo;
    }
    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getFone() {
        return fone;
    }
    public void setFone(String fone) {
        this.fone = fone;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public void inserir() {
        //1: Definir o comando SQL
        String sql = "INSERT INTO tb_pessoa(nome, fone, email) VALUES (?, ?, ?)";
        //2: Abrir uma conexão
        ConnectionFactory factory = new ConnectionFactory();
        try (Connection c = factory.obtemConexao()) {
            //3: Pré compila o comando
            PreparedStatement ps = c.prepareStatement(sql);
            //4: Preenche os dados faltantes
            ps.setString(1, nome);
            ps.setString(2, fone);
            ps.setString(3, email);
            //5: Executa o comando
            ps.execute();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void atualizar() {
        //1: Definir o comando SQL
        String sql = "UPDATE tb_pessoa SET nome = ?, fone = ?, email = ? WHERE codigo = ?";
        //2: Abrir uma conexão
        ConnectionFactory factory = new ConnectionFactory();
        try (Connection c = factory.obtemConexao()) {
            //3: Pré compila o comando
            PreparedStatement ps = c.prepareStatement(sql);
            //4: Preenche os dados faltantes
            ps.setString(1, nome);
            ps.setString(2, fone);
            ps.setString(3, email);
            ps.setInt(4, codigo);
            //5: Executa o comando
            ps.execute();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void apagar() {
        //1: Definir o comando SQL
        String sql = "DELETE FROM tb_pessoa WHERE codigo = ?";
        //2: Abrir uma conexão
        ConnectionFactory factory = new ConnectionFactory();
        try (Connection c = factory.obtemConexao()) {
            //3: Pré compila o comando
            PreparedStatement ps = c.prepareStatement(sql);
            //4: Preenche os dados faltantes
            ps.setInt(1, codigo);
            //5: Executa o comando
            ps.execute();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void listar() {
        //1: Definir o comando SQL
        String sql = "SELECT * FROM tb_pessoa";
        //2: Abrir uma conexão
        ConnectionFactory factory = new ConnectionFactory();
        try (Connection c = factory.obtemConexao()) {
            //3: Pré compila o comando
            PreparedStatement ps = c.prepareStatement(sql);
            //4: Executa o comando e guarda
            //o resultado em um ResultSet
            ResultSet rs = ps.executeQuery();
            //5: itera sobre o resultado
            while (rs.next()) {
                int codigo = rs.getInt("codigo");
                String nome = rs.getString("nome");
                String fone = rs.getString("fone");
                String email = rs.getString("email");
                String aux = String.format(
                    "Código: %d, Nome: %s, Fone: %s, Email: %s",
                    codigo,
                    nome,
                    fone,
                    email
                );
                JOptionPane.showMessageDialog(null, aux);
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

**Principal.java**

```java
import javax.swing.JOptionPane;

public class Principal {
    public static void main(String[] args) {
        String menu = "1-Cadastrar\n2-Atualizar\n3-Apagar\n4-Listar\n0-Sair";
        int op;
        do {
            op = Integer.parseInt(JOptionPane.showInputDialog(menu));
            switch (op) {
                case 1: {
                    String nome = JOptionPane.showInputDialog("Nome?");
                    String fone = JOptionPane.showInputDialog("Fone?");
                    String email = JOptionPane.showInputDialog("Email?");
                    Pessoa p = new Pessoa();
                    p.setNome(nome);
                    p.setFone(fone);
                    p.setEmail(email);
                    p.inserir();
                    break;
                }
                case 2: {
                    String nome = JOptionPane.showInputDialog("Nome?");
                    String fone = JOptionPane.showInputDialog("Fone?");
                    String email = JOptionPane.showInputDialog("Email?");
                    int codigo = Integer.parseInt(JOptionPane.showInputDialog("Codigo?"));
                    Pessoa p = new Pessoa();
                    p.setNome(nome);
                    p.setFone(fone);
                    p.setEmail(email);
                    p.setCodigo(codigo);
                    p.atualizar();
                    break;
                }
                case 3: {
                    int codigo =
                        Integer.parseInt(JOptionPane.showInputDialog("Codigo?"));
                    Pessoa p = new Pessoa();
                    p.setCodigo(codigo);
                    p.apagar();
                    break;
                }
                case 4: {
                    Pessoa p = new Pessoa();
                    p.listar();
                    break;
                }
                case 0:
                    break;
                default:
                    JOptionPane.showMessageDialog(null, "Opção inválida");
            }
        } while (op != 0);
    }
}
```

</details>

## Encerramento
Duration: 2:00

Você criou um banco de dados e uma tabela no MySQL, praticou os comandos SQL básicos, adicionou o driver JDBC ao projeto com o Maven e implementou em Java as quatro operações CRUD usando `Connection`, `PreparedStatement` e `ResultSet`.

### Referências

* DEITEL, P. e DEITEL, H. *Java Como Programar*. 8ª Edição. São Paulo, SP: Pearson, 2010.
* LOPES, A. e GARCIA, G. *Introdução à Programação – 500 Algoritmos Resolvidos*. 1ª Edição. São Paulo, SP: Elsevier, 2002.
