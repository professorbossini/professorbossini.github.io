summary: Segunda parte da série de interfaces gráficas em Java - valide o login no MySQL com JDBC e uma classe DAO, crie a tela principal (dashboard) e a tela de cursos com um JComboBox alimentado pelo banco.
id: java-gui-02-login-mysql
categories: Java,MySQL,Bancos de Dados
tags: java,swing,netbeans,jdbc,mysql,dao,jcombobox,maven
status: Published
authors: Rodrigo Bossini
last updated: 2023-04-27
pdf: java/010_apostila_poo_gui_parte2.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Interfaces gráficas em Java (parte 2): login com MySQL, tela principal e tela de cursos

## Visão geral
Duration: 3:00

Neste material daremos continuidade ao desenvolvimento da aplicação da última aula. Começamos implementando a funcionalidade de login e ilustramos o uso de outros componentes visuais do pacote `javax.swing`. Se necessário, pegue uma cópia do projeto no site da disciplina.

Este é o segundo codelab da série sobre o sistema acadêmico:

1. Parte 1: Swing, JFrame e tela de login no NetBeans
2. **Parte 2 (este codelab): login com MySQL, tela principal e tela de cursos**
3. Parte 3: cadastro, atualização e remoção de cursos
4. Parte 4: relacionamento entre alunos e cursos e a JTable

### O que você vai aprender

* Criar o banco e a tabela de usuários no MySQL
* Centralizar as conexões em uma classe `ConexaoBD`
* Adicionar o driver do MySQL com o Maven
* Criar a classe `Usuario` e uma classe `DAO` (*Data Access Object*)
* Validar o login consultando o banco
* Criar a tela principal (dashboard) e navegar entre telas
* Montar a tela de cursos com um `JComboBox` alimentado pelo banco e sobrescrever `toString`

### O que você vai precisar

* O projeto da **parte 1** (tela de login no NetBeans)
* MySQL Server e MySQL Workbench

## Banco de dados e conexão
Duration: 8:00

Os dados de usuários do sistema serão armazenados em uma base relacional gerenciada pelo MySQL. Como sabemos, a fim de obter esses dados, a aplicação Java precisa estabelecer uma conexão com o MySQL Server, o que pode ser feito utilizando a API JDBC.

Começamos criando um database para o sistema. No Workbench, uma vez conectado com o MySQL Server, use os comandos a seguir para criar o novo database e informar ao MySQL Server que as próximas instruções deverão ter impacto sobre ele.

**MySQL Workbench**

```sql
CREATE DATABASE nome_do_seu_db;
USE nome_do_seu_db;
```

A seguir, crie uma tabela para armazenar os dados de usuários com

**MySQL Workbench**

```sql
CREATE TABLE tb_usuario (id INT PRIMARY KEY AUTO_INCREMENT, nome VARCHAR(200), senha VARCHAR(200));
```

Faça a inserção de um usuário com

**MySQL Workbench**

```sql
INSERT INTO tb_usuario (nome, senha) VALUES ('admin', 'admin');
```

Segundo o princípio conhecido como **alta coesão**, cada classe que criamos deve ter um único propósito, uma única razão de ser. Sendo assim, criaremos uma classe cuja única responsabilidade será a de gerenciar conexões com o banco. Veja a Listagem 2.1.1.

**ConexaoBD.java · Listagem 2.1.1**

```java
import java.sql.Connection;
import java.sql.DriverManager;

public class ConexaoBD {
    private static String host = "localhost";
    private static String porta = "3306";
    private static String db = "seubd";
    private static String usuario = "seusuario";
    private static String senha = "suasenha";

    public static Connection obterConexao() throws Exception {
        String url = String.format(
                "jdbc:mysql://%s:%s/%s",
                host,
                porta,
                db
        );
        return DriverManager.getConnection(url, usuario, senha);
    }
}
```

<aside class="negative">

Troque `seubd`, `seusuario` e `suasenha` pelo nome do database que você criou e pelas credenciais do seu MySQL.

</aside>

Lembre-se de abrir o arquivo `pom.xml` e especificar que o driver do MySQL deve ser baixado pelo Maven. O ajuste a ser feito é exibido na Listagem 2.1.2.

**pom.xml · Listagem 2.1.2**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>br.com.bossini</groupId>
    <artifactId>pessoal_sistema_academico_com_netbeans_para_montar_pdf</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>14</maven.compiler.source>
        <maven.compiler.target>14</maven.compiler.target>
    </properties>
    <dependencies>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.20</version>
        </dependency>
    </dependencies>
</project>
```

## Usuário, DAO e o login pelo banco
Duration: 10:00

Um sistema desenvolvido com linguagem que tem suporte à orientação a objetos é uma representação simplificada do mundo real (lembra do minimundo?). Assim, vamos criar uma classe para representar o que é um usuário do sistema. No momento, usuários possuem apenas duas coisas de interesse: login e senha. Veja a definição da classe que descreve o que é um usuário na Listagem 2.1.3.

**Usuario.java · Listagem 2.1.3**

```java
public class Usuario {
    private String nome;
    private String senha;

    public Usuario(String nome, String senha) {
        this.nome = nome;
        this.senha = senha;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
```

A seguir, vamos criar uma classe que será responsável por todas as operações de persistência de dados da aplicação. Embora não seja a melhor prática possível, fazê-lo nesse momento tende a dar origem a código de mais fácil compreensão. No futuro (em semestres mais avançados) aprenderemos a escrever códigos melhor organizados, que usam padrões de projeto e que tendem a ter maior nível de reusabilidade e tendem a ser mais fáceis de se manter. Neste momento, o que nos é mais importante é a simplicidade. Assim, crie a classe da Listagem 2.1.4. No momento, o único método que ela possui se encarrega de verificar se um determinado usuário existe ou não na base de dados.

> **DAO**
>
> DAO é um acrônimo para *Data Access Object*, ou seja, Objeto de Acesso aos Dados. Trata-se de um dos padrões de desenvolvimento de software mais antigos. Uma classe DAO tem a finalidade de encapsular código de acesso a bases de dados. É comum que um projeto possua muitas classes DAO, cada qual apropriada para a manipulação de diferentes tipos de objetos. Por simplicidade, como mencionado, teremos uma única classe DAO.

**DAO.java · Listagem 2.1.4**

```java
public class DAO {
    public boolean existe(Usuario usuario) throws Exception {
        String sql = "SELECT * FROM tb_usuario WHERE nome = ? AND senha = ?";
        try (Connection conn = ConexaoBD.obterConexao();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, usuario.getNome());
            ps.setString(2, usuario.getSenha());
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }
}
```

<aside class="positive">

A classe precisa importar `java.sql.Connection`, `java.sql.PreparedStatement` e `java.sql.ResultSet` (o NetBeans sugere os imports automaticamente).

</aside>

O método acionado quando o botão de login é clicado será cliente do método `existe`. Assim ele passa a validar os dados do usuário em função do que existe realmente na base. Veja a Listagem 2.1.5.

**LoginTela.java · Listagem 2.1.5**

```java
private void loginButtonActionPerformed(java.awt.event.ActionEvent evt) {
    //pega o login do usuário
    String login = loginTextField.getText();
    //pega a senha do usuário como char[] e converte para String
    String senha = new String(senhaPasswordField.getPassword());
    try {
        //verifica se o usuário é válido
        Usuario usuario = new Usuario(login, senha);
        DAO dao = new DAO();
        if (dao.existe(usuario)) {
            JOptionPane.showMessageDialog(null, "Bem vindo, " + usuario.getNome() + "!");
        }
        else {
            JOptionPane.showMessageDialog(null, "Usuário inválido");
        }
    }
    catch (Exception e) {
        JOptionPane.showMessageDialog(null, "Problemas técnicos. Tente novamente mais tarde");
        e.printStackTrace();
    }
}
```

## A tela principal (dashboard)
Duration: 10:00

Uma vez feito o login, a aplicação irá mostrar para o usuário uma espécie de **Dashboard** que ele pode utilizar para escolher quais funcionalidades deseja utilizar. Ela permitirá o acesso ao cadastro de cursos e ao cadastro de alunos.

Para criar a nova tela, clique com o direito no pacote principal da aplicação e escolha **New >> JFrame Form**. Escolha o nome `DashboardTela`.

Arraste e solte um **Panel**. Ajuste suas propriedades para que ele tenha o aspecto exibido na Figura 2.2.1.

![JFrame com um painel com a borda com título Cadastro de cursos e alunos](img/fig-2-2-1.webp)

*Figura 2.2.1 – O painel do dashboard.*

Arraste e solte dois botões. O primeiro será usado para a manipulação de dados de cursos. O segundo, para manipulação de dados de alunos. Altere seus nomes para `gerenciarCursosButton` e `gerenciarAlunosButton`, respectivamente. Para isso, basta clicar com o direito sobre cada um deles e escolher a opção **Change Variable Name**. O resultado visual é exibido na Figura 2.2.2.

![Painel Cadastro de cursos e alunos com os botões Gerenciar Cursos e Gerenciar alunos](img/fig-2-2-2.webp)

*Figura 2.2.2 – O dashboard com os dois botões.*

Como fizemos com a tela de login, vamos centralizar a tela que exibe o dashboard e configurar seu título. Encontre seu construtor padrão e faça os ajustes (as linhas `super(...)` e `setLocationRelativeTo`) da Listagem 2.2.1.

**DashboardTela.java · Listagem 2.2.1**

```java
public DashboardTela() {
    super("Cadastro de cursos e alunos");
    initComponents();
    setLocationRelativeTo(null);
}
```

No momento, quando o usuário loga com sucesso na aplicação, ela somente exibe uma mensagem de boas-vindas. Desejamos que ela abra a tela que exibe o dashboard. Para isso, uma vez feito o login, basta fazer o seguinte:

* Instanciar a classe `DashboardTela`
* Tornar a tela de dashboard visível com `setVisible(true)`
* Fechar a tela de login

Abra o método `loginButtonActionPerformed` e ajuste-o como mostra a Listagem 2.2.2.

**LoginTela.java · Listagem 2.2.2**

```java
private void loginButtonActionPerformed(java.awt.event.ActionEvent evt) {
    //pega o login do usuário
    String login = loginTextField.getText();
    //pega a senha do usuário como char[] e converte para String
    String senha = new String(senhaPasswordField.getPassword());
    try {
        //verifica se o usuário é válido
        Usuario usuario = new Usuario(login, senha);
        DAO dao = new DAO();
        if (dao.existe(usuario)) {
            JOptionPane.showMessageDialog(null, "Bem vindo, " + usuario.getNome() + "!");
            DashboardTela dt = new DashboardTela();
            dt.setVisible(true);
            this.dispose();
        }
        else {
            JOptionPane.showMessageDialog(null, "Usuário inválido");
        }
    }
    catch (Exception e) {
        JOptionPane.showMessageDialog(null, "Problemas técnicos. Tente novamente mais tarde");
        e.printStackTrace();
    }
}
```

Execute a aplicação (começando pela tela de login) e verifique se tudo está funcionando corretamente.

## Montando a tela de cursos
Duration: 12:00

A tela de gerenciamento de cursos irá exibir a lista de cursos existentes no banco e também irá permitir a realização de operações junto ao banco, como o cadastro e remoção de cursos. A lista de cursos será exibida em um objeto do tipo `JComboBox`. Trata-se de um componente visual que permite a exibição de uma lista de dados em um menu e a seleção de um ou mais deles.

Comece criando uma nova tela. Para isso, clique com o direito no pacote principal da aplicação e escolha **New >> JFrame Form**. Seu nome será `CursosTela`.

Arraste um **Panel** e adicione a ele uma borda com título, mantendo o padrão usado até então. Veja o resultado esperado na Figura 2.3.1.

![JFrame com um painel com a borda com título Gerenciamento de cursos](img/fig-2-3-1.webp)

*Figura 2.3.1 – O painel da tela de cursos.*

Arraste um **Combo Box** para a tela, como mostra a figura a seguir. Troque seu nome para `cursosComboBox`. Para isso, clique com o direito no componente que acabou de arrastar e escolha **Change Variable Name**.

![Painel Gerenciamento de cursos com um JComboBox exibindo Item 1](img/fig-2-3-2a.webp)

*Figura 2.3.2 – O JComboBox de cursos.*

A tela também terá campos que permitirão a inserção, exibição, remoção e atualização de dados de cursos. Cursos terão os atributos **id**, **nome** e **tipo**. Quando um curso for selecionado na caixa, desejamos que seus dados sejam exibidos na tela apropriadamente. Veja como a tela deve ficar na figura a seguir. Cada componente textual é um **JTextField**. Troque os nomes dos componentes para `idCursoTextField`, `nomeCursoTextField` e `tipoCursoTextField`. Por padrão, eles serão **desabilitados para edição**. Isso também é uma propriedade que você pode editar na mesma região em que edita as demais propriedades.

![Painel com o JComboBox e três campos de texto com bordas com título id, nome e tipo](img/fig-2-3-2b.webp)

*Figura 2.3.2 (continuação) – Os campos id, nome e tipo.*

Teremos também botões para as operações de acesso à base:

* O botão de **novo curso**, quando clicado, irá habilitar os campos textuais. Além disso, seu texto será alterado para **Confirmar**. Isso quer dizer que, para adicionar um novo curso, será necessário clicar uma vez no botão para habilitar os campos, digitar os valores e clicar novamente para confirmar.
* O botão de **atualização de curso** opera de maneira similar. Ele é desabilitado por padrão e somente é habilitado quando um curso é selecionado no menu. Quando clicado, ele habilita os campos textuais e seu texto é alterado para confirmar. Quando clicado novamente, a atualização dos dados acontece, ele volta a ficar desabilitado e os campos textuais também são desabilitados e limpos.
* O botão de **remover** deve ser clicado duas vezes para que o curso selecionado seja removido. Seu funcionamento é análogo aos demais.
* O botão de **cancelar** deve ser usado quando o usuário clica em algum dos outros e se arrepende. Quando clicado, ele desabilitará os campos textuais e os limpará. Os demais botões também serão desabilitados por ele.

Os nomes dos botões serão `adicionarCursoButton`, `atualizarCursoButton`, `removerCursoButton` e `cancelarCursoButton`. Veja o resultado esperado na Figura 2.3.3.

![Tela de cursos completa com o JComboBox, os campos id, nome e tipo e os botões Novo, Atualizar, Remover e Cancelar, sendo que apenas Novo está habilitado](img/fig-2-3-3.webp)

*Figura 2.3.3 – A tela de cursos com os botões.*

## Cursos no banco e no JComboBox
Duration: 12:00

Evidentemente, os cursos serão armazenados na base de dados. Por isso, acesse a base com o Workbench e crie uma tabela apropriada para o armazenamento de cursos com

**MySQL Workbench**

```sql
CREATE TABLE tb_curso (id INT PRIMARY KEY AUTO_INCREMENT, nome VARCHAR (200) NOT NULL, tipo VARCHAR (200) NOT NULL);
```

A seguir, faça a inserção de um curso para que tenhamos um primeiro dado de teste. Para isso, use

**MySQL Workbench**

```sql
INSERT INTO tb_curso (nome, tipo) VALUES ('Ciência da Computação', 'Bacharelado');
```

Crie a classe `Curso` com os campos, métodos e construtores apropriados, como na Listagem 2.3.1 (o método `toString` ao final é acrescentado mais adiante, na Listagem 2.3.6).

**Curso.java · Listagem 2.3.1**

```java
public class Curso {
    private int id;
    private String nome;
    private String tipo;

    public Curso(int id, String nome, String tipo) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    @Override
    public String toString() {
        return this.nome;
    }
}
```

Agora vamos implementar o método que acessa a base e traz para a memória principal a lista de cursos cadastrados. Ele faz parte da classe `DAO`. Veja a sua implementação na Listagem 2.3.2. O método precisa devolver uma coleção de itens. Utilizaremos um vetor temporariamente. No futuro, aprenderemos formas muito mais sofisticadas para a representação de coleções de objetos.

**DAO.java · Listagem 2.3.2**

```java
public Curso[] obterCursos() throws Exception {
    String sql = "SELECT * FROM tb_curso";
    try (Connection conn = ConexaoBD.obterConexao();
            PreparedStatement ps =
                    conn.prepareStatement(sql,
                            ResultSet.TYPE_SCROLL_INSENSITIVE,
                            ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = ps.executeQuery()) {
        int totalDeCursos = rs.last() ? rs.getRow() : 0;
        Curso[] cursos = new Curso[totalDeCursos];
        rs.beforeFirst();
        int contador = 0;
        while (rs.next()) {
            int id = rs.getInt("id");
            String nome = rs.getString("nome");
            String tipo = rs.getString("tipo");
            cursos[contador++] = new Curso(id, nome, tipo);
        }
        return cursos;
    }
}
```

Quando o ComboBox foi arrastado para a tela, seu código foi gerado automaticamente pelo NetBeans. Um ComboBox é um componente capaz de lidar com uma coleção de itens cujo tipo precisa ser definido. Por padrão, o NetBeans gera um ComboBox que é capaz de lidar com objetos do tipo `String`. Porém, a coleção que temos em mãos armazena objetos do tipo `Curso`. Assim, é preciso alterar o tipo de dado armazenado pelo ComboBox de `String` para `Curso`. Isso pode ser feito selecionando o ComboBox, por meio de sua propriedade **Type Parameters**. Veja a Figura 2.3.4.

![NetBeans com o cursosComboBox selecionado e, na aba Code das propriedades, o campo Type Parameters preenchido com Curso entre sinais de menor e maior](img/fig-2-3-4.webp)

*Figura 2.3.4 – Alterando o Type Parameters do JComboBox.*

Na classe `CursosTela`, defina o método da Listagem 2.3.3. Ele busca os dados de cursos na base (usando o método da classe `DAO`) e coloca em um novo modelo de dados que alimenta o `JComboBox`.

**CursosTela.java · Listagem 2.3.3**

```java
private void buscarCursos() {
    try {
        DAO dao = new DAO();
        Curso[] cursos = dao.obterCursos();
        cursosComboBox.setModel(new DefaultComboBoxModel<>(cursos));
    }
    catch (Exception e) {
        JOptionPane.showMessageDialog(null, "Cursos indisponíveis, tente novamente mais tarde.");
        e.printStackTrace();
    }
}
```

O construtor da classe `CursosTela` será cliente do método `buscarCursos`. Faça os ajustes da Listagem 2.3.4.

**CursosTela.java · Listagem 2.3.4**

```java
public CursosTela() {
    super("Cursos");
    initComponents();
    buscarCursos();
    setLocationRelativeTo(null);
}
```

Na classe `DashboardTela`, é preciso viabilizar a navegação até a classe `CursosTela` por meio do clique no botão de gerenciamento de cursos. Isso pode ser feito como mostra a Listagem 2.3.5. Para acessar esse método (que é criado automaticamente pelo NetBeans), basta clicar duas vezes sobre o botão.

**DashboardTela.java · Listagem 2.3.5**

```java
private void gerenciarCursosButtonActionPerformed(java.awt.event.ActionEvent evt) {
    CursosTela ct = new CursosTela();
    ct.setVisible(true);
    this.dispose();
}
```

Execute a aplicação e veja que o ComboBox exibe um valor sem muito significado para o usuário final. Ocorre que ele é um componente capaz de exibir texto e entregamos para ele uma coleção de Cursos. O que ele faz é obter a representação textual de cada curso da coleção e exibi-la. Ele o faz por meio do uso do método `toString`, que é definido pela classe `Object` (da qual todas as demais herdam, inclusive `Curso`). A implementação padrão de `toString` devolve `nomeCompletamenteQualificadoDaClasse@HashCode`. Para personalizar isso, basta sobrescrever o método `toString` na classe `Curso`. Ele poderia, por exemplo, devolver somente o nome do curso, como na Listagem 2.3.6.

**Curso.java · Listagem 2.3.6**

```java
@Override
public String toString() {
    return this.nome;
}
```

Execute novamente e veja o resultado.

## Exercícios
Duration: 15:00

* Faça com que o `JComboBox` de Cursos exiba o nome do curso seguido de um hífen seguido do tipo do curso. Por exemplo: *Ciência da Computação - Bacharelado*.
* Adicione um botão "Sair" em cada tela da aplicação. Quando clicado, ele deve exibir um diálogo que confirma se o usuário deseja mesmo sair. Pesquise, na classe `JOptionPane`, qual método poderá te ajudar com isso.

## Encerramento
Duration: 2:00

O login agora é validado no MySQL por meio da classe `DAO`, o usuário é levado ao dashboard e a tela de cursos lista os cursos do banco em um `JComboBox`.

### Próximo codelab da série

* **Interfaces gráficas em Java (parte 3): cadastro, atualização e remoção de cursos**, em que os botões Novo, Atualizar, Remover e Cancelar ganham vida.

### Referências

* DEITEL, P. e DEITEL, H. *Java Como Programar*. 8ª Edição. São Paulo, SP: Pearson, 2010.
