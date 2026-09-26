summary: Terceira parte da série de interfaces gráficas em Java - implemente na tela de cursos o cadastro, a atualização e a remoção de cursos no MySQL, com confirmações do JOptionPane e métodos na classe DAO.
id: java-gui-03-crud-cursos
categories: Java,MySQL,Bancos de Dados
tags: java,swing,netbeans,jdbc,mysql,dao,crud,jcombobox
status: Published
authors: Rodrigo Bossini
last updated: 2023-04-27
pdf: java/011_apostila_poo_gui.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Interfaces gráficas em Java (parte 3): cadastro, atualização e remoção de cursos

## Visão geral
Duration: 2:00

Neste material daremos continuidade ao desenvolvimento da aplicação da última aula, implementando as operações da tela de cursos. Se necessário, pegue uma cópia do projeto no site da disciplina.

Este é o terceiro codelab da série sobre o sistema acadêmico:

1. Parte 1: Swing, JFrame e tela de login no NetBeans
2. Parte 2: login com MySQL, tela principal e tela de cursos
3. **Parte 3 (este codelab): cadastro, atualização e remoção de cursos**
4. Parte 4: relacionamento entre alunos e cursos e a JTable

### O que você vai aprender

* Inserir, atualizar e remover cursos com métodos da classe `DAO`
* Criar construtores adicionais na classe `Curso`
* Pedir confirmação com `JOptionPane.showConfirmDialog`
* Tratar o evento de seleção do `JComboBox`
* Voltar ao dashboard pelo botão Cancelar

### O que você vai precisar

* O projeto da **parte 2** (tela de cursos com o `JComboBox` alimentado pelo banco)

## Cadastrando novos cursos
Duration: 10:00

A classe `CursosTela` possui botões para a manipulação de cursos na base. Começaremos implementando a funcionalidade de inserção de cursos.

O primeiro passo é criar o método de inserção de cursos, o que deve ser feito na classe `DAO`. Veja a Listagem 2.1.1.

**DAO.java · Listagem 2.1.1**

```java
public void inserirCurso(Curso curso) throws Exception {
    String sql = "INSERT INTO tb_curso (nome, tipo) VALUES (?, ?);";
    try (Connection conexao = ConexaoBD.obterConexao();
            PreparedStatement ps = conexao.prepareStatement(sql)) {
        ps.setString(1, curso.getNome());
        ps.setString(2, curso.getTipo());
        ps.execute();
    }
}
```

Para cadastrar um curso, iremos utilizar somente seu nome e tipo, já que o id é gerado automaticamente pelo banco. Por isso, implemente o construtor da Listagem 2.1.2. Note que ele pertence à classe `Curso`.

**Curso.java · Listagem 2.1.2**

```java
public Curso(String nome, String tipo) {
    this.nome = nome;
    this.tipo = tipo;
}
```

Criaremos um enum para representar o estado em que a tela se encontra e decidir o que fazer em função dele.

Clique duas vezes no botão de inserção de cursos para editar o método que entra em execução quando ele é clicado pelo usuário. A inserção somente irá acontecer caso o usuário tenha preenchido os campos nome e tipo. Veja a sua implementação na Listagem 2.1.3.

**CursosTela.java · Listagem 2.1.3**

```java
private void novoCursoButtonActionPerformed(java.awt.event.ActionEvent evt) {
    String nomeCurso = nomeCursoTextField.getText();
    String tipoCurso = tipoCursoTextField.getText();
    if (nomeCurso == null || nomeCurso.length() == 0 ||
            tipoCurso == null || tipoCurso.length() == 0) {
        JOptionPane.showMessageDialog(null, "Preencha curso e tipo");
    }
    else {
        try {
            int escolha = JOptionPane.showConfirmDialog(null, "Confirmar cadastro de novo curso?");
            if (escolha == JOptionPane.YES_OPTION) {
                Curso curso = new Curso(nomeCurso, tipoCurso);
                DAO dao = new DAO();
                dao.inserirCurso(curso);
                JOptionPane.showMessageDialog(null, "Curso cadastrado com sucesso");
                nomeCursoTextField.setText("");
                tipoCursoTextField.setText("");
                buscarCursos();
            }
        }
        catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Falha técnica, tente mais tarde");
            e.printStackTrace();
        }
    }
}
```

<aside class="positive">

O NetBeans nomeia o método a partir do nome da variável do botão. Aqui o botão se chama `novoCursoButton`; se você manteve o nome `adicionarCursoButton` da parte 2, o método se chamará `adicionarCursoButtonActionPerformed`, com o mesmo corpo.

</aside>

## Atualizando cursos
Duration: 10:00

Para atualizar um curso, antes de mais nada, o usuário deve selecioná-lo no ComboBox. Quando esse evento acontecer, desejamos obter o curso selecionado e preencher os campos textuais com os valores que fazem parte de seu estado. O evento desejado pode ser encontrado clicando-se com o direito no ComboBox e então em **Events >> Action >> actionPerformed**. Veja a implementação do método na Listagem 2.2.1.

**CursosTela.java · Listagem 2.2.1**

```java
private void cursosComboBoxActionPerformed(java.awt.event.ActionEvent evt) {
    Curso curso = (Curso) cursosComboBox.getSelectedItem();
    idCursoTextField.setText(Integer.toString(curso.getId()));
    nomeCursoTextField.setText(curso.getNome());
    tipoCursoTextField.setText(curso.getTipo());
}
```

Cabe à classe `DAO` isolar o código JDBC que acessa a base. Por isso, crie o método da Listagem 2.2.2 nela.

**DAO.java · Listagem 2.2.2**

```java
public void atualizarCurso(Curso curso) throws Exception {
    String sql = "UPDATE tb_curso SET nome = ?, tipo = ? WHERE id = ?";
    try (Connection conexao = ConexaoBD.obterConexao();
            PreparedStatement ps = conexao.prepareStatement(sql)) {
        ps.setString(1, curso.getNome());
        ps.setString(2, curso.getTipo());
        ps.setInt(3, curso.getId());
        ps.execute();
    }
}
```

A seguir, podemos implementar o funcionamento do método que executa quando o usuário clica no botão **Atualizar**. Para isso, na classe `CursosTela`, clique duas vezes sobre ele. A implementação é dada na Listagem 2.2.3.

**CursosTela.java · Listagem 2.2.3**

```java
private void atualizarCursoButtonActionPerformed(java.awt.event.ActionEvent evt) {
    int escolha = JOptionPane.showConfirmDialog(null, "Atualizar curso?");
    if (escolha == JOptionPane.YES_OPTION) {
        try {
            int id = Integer.parseInt(idCursoTextField.getText());
            String nome = nomeCursoTextField.getText();
            String tipo = tipoCursoTextField.getText();
            Curso curso = new Curso(id, nome, tipo);
            DAO dao = new DAO();
            dao.atualizarCurso(curso);
            JOptionPane.showMessageDialog(null, "Curso atualizado com sucesso");
            buscarCursos();
            idCursoTextField.setText("");
            nomeCursoTextField.setText("");
            tipoCursoTextField.setText("");
        }
        catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Falha técnica. Tente novamente mais tarde.");
            e.printStackTrace();
        }
    }
}
```

## Removendo cursos e o botão Cancelar
Duration: 10:00

### Removendo cursos

O procedimento para remoção de cursos é análogo. Começamos escrevendo o método de acesso à base na classe `DAO`, como na Listagem 2.3.1.

**DAO.java · Listagem 2.3.1**

```java
public void removerCurso(Curso curso) throws Exception {
    String sql = "DELETE FROM tb_curso WHERE id = ?";
    try (Connection conexao = ConexaoBD.obterConexao();
            PreparedStatement ps = conexao.prepareStatement(sql);) {
        ps.setInt(1, curso.getId());
        ps.execute();
    }
}
```

A seguir, implementamos o método que executa quando o botão de remoção é clicado. Basta clicar duas vezes sobre o botão para encontrar o método. A implementação é dada na Listagem 2.3.2. Note que precisamos de um novo construtor na classe `Curso`, para receber somente o id, já que esse campo é suficiente para a operação de remoção.

**CursosTela.java e Curso.java · Listagem 2.3.2**

```java
private void removerCursoButtonActionPerformed(java.awt.event.ActionEvent evt) {
    int escolha = JOptionPane.showConfirmDialog(null, "Remover curso?");
    if (escolha == JOptionPane.YES_OPTION) {
        try {
            int id = Integer.parseInt(idCursoTextField.getText());
            Curso curso = new Curso(id);
            DAO dao = new DAO();
            dao.removerCurso(curso);
            JOptionPane.showMessageDialog(null, "Curso removido com sucesso!");
            buscarCursos();
            nomeCursoTextField.setText("");
            tipoCursoTextField.setText("");
            idCursoTextField.setText("");
        }
        catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Falha técnica. Tente novamente mais tarde.");
            e.printStackTrace();
        }
    }
}

//na classe Curso
public Curso(int id) {
    this.id = id;
}
```

### O botão Cancelar

O funcionamento do botão cancelar é simples. Quando clicado, a tela atual se fecha e a anterior (`DashboardTela`) é exibida. Veja a implementação na Listagem 2.4.1.

**CursosTela.java · Listagem 2.4.1**

```java
private void cancelarCursoButtonActionPerformed(java.awt.event.ActionEvent evt) {
    DashboardTela dt = new DashboardTela();
    dt.setVisible(true);
    this.dispose();
}
```

<details><summary>Ver as classes DAO e Curso como ficam ao final</summary>

As classes abaixo reúnem os métodos e construtores das partes 2 e 3 da série.

**DAO.java**

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

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

    public void inserirCurso(Curso curso) throws Exception {
        String sql = "INSERT INTO tb_curso (nome, tipo) VALUES (?, ?);";
        try (Connection conexao = ConexaoBD.obterConexao();
                PreparedStatement ps = conexao.prepareStatement(sql)) {
            ps.setString(1, curso.getNome());
            ps.setString(2, curso.getTipo());
            ps.execute();
        }
    }

    public void atualizarCurso(Curso curso) throws Exception {
        String sql = "UPDATE tb_curso SET nome = ?, tipo = ? WHERE id = ?";
        try (Connection conexao = ConexaoBD.obterConexao();
                PreparedStatement ps = conexao.prepareStatement(sql)) {
            ps.setString(1, curso.getNome());
            ps.setString(2, curso.getTipo());
            ps.setInt(3, curso.getId());
            ps.execute();
        }
    }

    public void removerCurso(Curso curso) throws Exception {
        String sql = "DELETE FROM tb_curso WHERE id = ?";
        try (Connection conexao = ConexaoBD.obterConexao();
                PreparedStatement ps = conexao.prepareStatement(sql);) {
            ps.setInt(1, curso.getId());
            ps.execute();
        }
    }
}
```

**Curso.java**

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

    public Curso(String nome, String tipo) {
        this.nome = nome;
        this.tipo = tipo;
    }

    public Curso(int id) {
        this.id = id;
    }
}
```

</details>

## Exercícios
Duration: 10:00

1. Note que a aplicação tenta fazer a atualização e a remoção de cursos mesmo nos casos em que o usuário ainda não selecionou nenhum curso no ComboBox. Tente realizar uma operação dessas e veja o que acontece. Ajuste a aplicação para que, quando um desses dois botões forem clicados, ela informe ao usuário que ele precisa selecionar o curso envolvido na operação, caso ainda não o tenha feito.

## Encerramento
Duration: 2:00

A tela de cursos agora cadastra, atualiza e remove cursos no MySQL, sempre pedindo confirmação ao usuário e recarregando o `JComboBox` depois de cada operação.

### Próximo codelab da série

* **Interfaces gráficas em Java (parte 4): alunos por curso com JTable**, em que modelamos o relacionamento entre alunos e cursos e exibimos os alunos de um curso em uma tabela.

### Referências

* DEITEL, P. e DEITEL, H. *Java Como Programar*. 8ª Edição. São Paulo, SP: Pearson, 2010.
