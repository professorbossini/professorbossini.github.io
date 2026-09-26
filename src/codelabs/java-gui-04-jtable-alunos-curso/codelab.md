summary: Quarta parte da série de interfaces gráficas em Java - modele o relacionamento entre alunos e cursos (conceitual, lógico e físico no MySQL), aprenda a usar a JTable com TableModel e exiba os alunos de um curso em uma nova tela.
id: java-gui-04-jtable-alunos-curso
categories: Java,MySQL,Bancos de Dados
tags: java,swing,netbeans,jtable,tablemodel,abstracttablemodel,mysql,modelo entidade relacionamento,jdbc
status: Published
authors: Rodrigo Bossini
last updated: 2023-04-27
pdf: java/015_apostila_poo_gui.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Interfaces gráficas em Java (parte 4): alunos por curso com JTable

## Visão geral
Duration: 3:00

Neste material ainda daremos continuidade ao desenvolvimento da aplicação da última aula. Vamos falar sobre o relacionamento entre alunos e cursos, desde o modelo conceitual dos dados, passando pelo mapeamento para o modelo relacional chegando à sua implementação no banco de dados. A aplicação receberá uma nova tela, que será chamada a partir da tela de cursos, que deverá exibir todos os alunos do curso, utilizando a `JTable` do pacote `javax.swing`.

Este é o quarto e último codelab da série sobre o sistema acadêmico:

1. Parte 1: Swing, JFrame e tela de login no NetBeans
2. Parte 2: login com MySQL, tela principal e tela de cursos
3. Parte 3: cadastro, atualização e remoção de cursos
4. **Parte 4 (este codelab): alunos por curso com JTable**

### O que você vai aprender

* Modelar um relacionamento n para n: modelos conceitual, lógico e físico
* Criar tabelas com chaves estrangeiras no MySQL
* Criar uma nova tela e passar dados entre telas pelo construtor
* Usar a `JTable` com matrizes, com `JScrollPane` e com um `TableModel` personalizado
* Exibir um `JComboBox` dentro de uma célula
* Alimentar uma `JTable` com dados do banco usando `AbstractTableModel`

### O que você vai precisar

* O projeto da **parte 3** (tela de cursos com cadastro, atualização e remoção)

## O modelo de dados
Duration: 10:00

### Modelagem conceitual

Sabemos que um dos modelos conceituais de bancos de dados é o **Modelo Entidade Relacionamento**, que contém as entidades sobre as quais devemos armazenar informações e os relacionamentos entre elas. Essas informações são representadas como seus atributos, que podem ser tanto de entidades quanto de relacionamentos. A Figura 2.1.1 mostra o modelo que vamos considerar para esta aula.

![Diagrama entidade relacionamento: curso, com id, nome e tipo, e aluno, com RA, nome e ano_nascimento, ligados pelo relacionamento contém, com cardinalidades (1,n) e (0,n) e atributos ano e semestre](img/fig-2-1-1.webp)

*Figura 2.1.1 – O relacionamento contém entre curso e aluno.*

### Modelo lógico

A fim de implementarmos esse modelo, devemos fazer o seu mapeamento do modelo conceitual para o **modelo lógico relacional**, pois o SGBD que utilizamos implementa esse modelo. A Listagem 2.2.1 mostra como fica esse mapeamento.

**Listagem 2.2.1**

```text
aluno (ra, nome, ano_nascimento)
curso (id, nome, tipo)
aluno_curso (ra, id, semestre, ano)
      ra referencia aluno
      id referencia curso
```

Conforme ilustra a Listagem 2.2.1, os atributos identificadores das entidades do modelo ER foram mapeados para as chaves primárias das relações (tabelas) que representam essas entidades e o relacionamento (n para n) foi mapeado para uma tabela, cuja chave primária é composta pelas chaves estrangeiras que referenciam cada tabela que representa suas respectivas entidades.

### Modelo físico

Finalmente, vamos implementar o modelo físico dos novos componentes, no nosso banco `db_sistema_academico`. A Listagem 2.3.1 contém a criação das tabelas aluno e aluno_curso.

**MySQL Workbench · Listagem 2.3.1**

```sql
CREATE TABLE `db_sistema_academico`.`tb_aluno` (
     `RA` INT(11) NOT NULL,
     `nome` VARCHAR(80) NOT NULL,
     `ano_nascimento` INT NULL,
     PRIMARY KEY (`RA`)
);

CREATE TABLE `db_sistema_academico`.`tb_aluno_curso` (
     `id_curso` INT(11) NOT NULL,
     `RA_aluno` INT(11) NOT NULL,
     `ano` INT NULL,
     `semestre` INT NULL,
     PRIMARY KEY (`id_curso`, `RA_aluno`),
     INDEX `fk_aluno_idx` (`RA_aluno` ASC),
     CONSTRAINT `fk_aluno`
        FOREIGN KEY (`RA_aluno`)
        REFERENCES `db_sistema_academico`.`tb_aluno` (`RA`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
     CONSTRAINT `fk_curso`
        FOREIGN KEY (`id_curso`)
        REFERENCES `db_sistema_academico`.`tb_curso` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);
```

As **chaves estrangeiras** permitem a verificação da **integridade referencial**, isto é, não é possível criar um registro na tabela aluno_curso sem que o aluno exista na tabela aluno e o curso exista na tabela curso. Mais adiante, vamos inserir alguns dados no banco para prepararmos os elementos para a nova tela.

## Criando a nova tela
Duration: 10:00

A tela do nosso dashboard não será alterada; você pode fazer como exercício o gerenciamento dos alunos, com base no gerenciamento de cursos (mais adiante, no passo com os dados de teste, você verá que serão acrescentados alguns detalhes importantes quanto à integridade dos dados). O que vamos implementar é uma funcionalidade na nossa tela de cursos que nos permite visualizar os alunos de um curso escolhido. Para isso, vamos alterar a nossa classe `CursosTela`, acrescentando um botão que abra a tela que deve conter os alunos do curso escolhido. A Figura 2.4.1 mostra como deve ficar essa tela. Não se esqueça de atualizar o nome da variável para o novo botão, seu texto e utilizar os 2 cliques sobre ele para que ele acrescente ao código o método `private void mostraAlunosButtonActionPerformed(java.awt.event.ActionEvent evt)`.

![Tela Gerenciamento de cursos com o novo botão Mostra Alunos abaixo dos botões Novo, Atualizar, Remover e Cancelar](img/fig-2-4-1.webp)

*Figura 2.4.1 – A tela de cursos com o botão Mostra Alunos.*

A ideia é que, ao clicarmos no botão `mostraAlunosButton`, seja exibida a tela `MostraAlunosCursoTela` ilustrada na Figura 2.4.2. Mais adiante, vamos acrescentar novas funcionalidades, mas por enquanto, vamos exibir os alunos de um determinado curso e voltar à tela anterior ou simplesmente sair da aplicação.

Antes da tela, vamos acrescentar a ação ao novo botão. A Listagem 2.4.1 mostra o código que devemos acrescentar ao método gerado quando clicamos 2 vezes no botão, durante a criação da tela.

**CursosTela.java · Listagem 2.4.1**

```java
private void mostraAlunosButtonActionPerformed(java.awt.event.ActionEvent evt) {
    MostraAlunosCursoTela ac = new MostraAlunosCursoTela();
    ac.setVisible(true);
    this.dispose();
}
```

![Tela MostraAlunosCursoTela com campos id curso, nome curso e tipo curso no topo, uma tabela com as colunas RA, Nome e Nascimento e os botões Voltar e Sair](img/fig-2-4-2.webp)

*Figura 2.4.2 – A tela de alunos por curso.*

As caixas de texto (`JTextField`s) já são conhecidas, vamos começar com elas. Não se esqueçam de nomes apropriados para as variáveis. Os botões também já ficaram fáceis: vamos alterar os textos exibidos, os nomes das variáveis e as ações que devem ser executadas quando clicados (2 cliques em cada um para gerar o esqueleto dos métodos `ButtonActionPerformed`). A Listagem 2.4.2 mostra o construtor com os ajustes necessários e os códigos associados a cada um dos botões.

**MostraAlunosCursoTela.java · Listagem 2.4.2**

```java
public MostraAlunosCursoTela() {
    super("Alunos por Curso");
    initComponents();
    setLocationRelativeTo(null);
}

private void voltarButtonActionPerformed(java.awt.event.ActionEvent evt) {
    CursosTela ct = new CursosTela();
    ct.setVisible(true);
    this.dispose();
}

private void sairButtonActionPerformed(java.awt.event.ActionEvent evt) {
    this.dispose();
}
```

Note que a tela para a qual desejamos voltar é a tela de cursos, pois é possível que o usuário queira escolher outro curso para exibir seus alunos ou, de lá, ele pode voltar para o Dashboard. É importante termos esse mapa de navegação; ele está de acordo com o diagrama de sequência que descreve a sequência das ações no seu sistema.

## Dados da tela anterior e dados de teste
Duration: 8:00

### Trazendo as informações da tela anterior

Note que a tela de alunos por curso traz as informações do curso, que foi escolhido na classe `CursosTela`. Parece natural, então, que a classe `MostraAlunosCursoTela` seja iniciada com essas informações; podemos fazer isso passando a instância de curso como parâmetro em seu construtor. Veja a Listagem 2.5.1.

**MostraAlunosCursoTela.java · Listagem 2.5.1**

```java
public MostraAlunosCursoTela(Curso curso) {
    super("Alunos por Curso");
    initComponents();
    idCursoLabel.setText(Integer.toString(curso.getId()));
    nomeCursoLabel.setText(curso.getNome());
    tipoCursoLabel.setText(curso.getTipo());
    setLocationRelativeTo(null);
}
```

Como sugerido anteriormente, podemos deixar esses campos não editáveis, pois eles vêm da tela anterior. Podemos fazer essa alteração desmarcando a propriedade **editable** de cada um deles.

<aside class="positive">

Com esse construtor, a chamada da Listagem 2.4.1 precisa entregar o curso selecionado: `new MostraAlunosCursoTela((Curso) cursosComboBox.getSelectedItem())`.

</aside>

### Voltando aos dados

Nós deixamos o modelo do banco preparado para receber alunos, que serão matriculados em um curso. Lembre-se: para cadastrar um aluno num curso, é necessário que o aluno e o curso estejam cadastrados. Vamos fazer alguns testes. A Listagem 2.6.1 contém algumas inserções para realizarmos alguns testes. Vejam, é possível realizar múltiplas inserções.

**MySQL Workbench · Listagem 2.6.1**

```sql
INSERT INTO tb_aluno (RA, nome, ano_nascimento) VALUES
       (123456, "João Henrique", 2000),
       (345678, "Ana Maria", 2001),
       (875321, "Paulo Rogerio", 2000),
       (456789, "Maria Regina", 1999)
;
```

A Listagem 2.6.2 mostra como registrar que um determinado aluno está associado a um determinado curso em um determinado período.

**MySQL Workbench · Listagem 2.6.2**

```sql
INSERT INTO tb_aluno_curso VALUES (1, 123456, 2020, 1);
```

## JTable: o exemplo mais simples
Duration: 10:00

`JTable` é uma classe do pacote `javax.swing` usada para exibir e editar tabelas bidimensionais de itens denominados "células". Sua documentação oficial pode ser encontrada no link a seguir.

[https://docs.oracle.com/javase/8/docs/api/javax/swing/JTable.html](https://docs.oracle.com/javase/8/docs/api/javax/swing/JTable.html)

O link a seguir mostra um tutorial detalhado.

[https://docs.oracle.com/javase/tutorial/uiswing/components/table.html](https://docs.oracle.com/javase/tutorial/uiswing/components/table.html)

Nesta seção criaremos pequenos exemplos a fim de ilustrar o uso do componente. Na próxima seção o aplicaremos no projeto.

### Um pouco sobre matrizes

Vimos que vetores são estruturas que nos permitem armazenar uma lista de valores e acessá-los utilizando índices, o que é muito eficiente. A listagem a seguir mostra alguns exemplos, para lembrarmos que podemos declarar e iniciar um vetor ou ainda instanciá-lo e preenchê-lo conforme necessidade da aplicação.

**Vetores**

```java
int[] primos = { 2,3,5,7,11,13,17,19 };
char[] dd = { 'd','s','t','q','q','s','s'};
String[] meses = {"jan","fev","mar","abr" };
int[] fibonacci = new int[20];
fibonacci[0] = 1;
fibonacci[1] = 1;
for (int i=2; i<20; i++) {
    fibonacci[i] = fibonacci[i-2] + fibonacci[i-1];
}
```

Uma **matriz** é basicamente um vetor onde cada elemento é, por sua vez, um vetor. No exemplo a seguir, `mat` é uma matriz com 10 linhas e 9 colunas.

**Matriz**

```java
int[][] mat = new int[10][9];
for(int i = 0; i < 10; i++) {
    for(int j = 0; j < 9; j++) {
        mat[i][j] = i*j;
    }
}
```

<aside class="positive">

Esta revisão de vetores e matrizes vem da versão anterior desta apostila (`java/012_apostila_poo_gui.pdf`), que não a repete na versão atual.

</aside>

### A primeira JTable

O uso mais simples de uma `JTable` envolve a especificação dos nomes de suas colunas, o que pode ser feito utilizando-se um vetor simples. A seguir, definimos uma matriz, responsável por armazenar os dados.

Comece criando uma nova classe chamada `TesteJTable1` com um método `main`. Defina um vetor de nomes de colunas como na Listagem 2.7.1.1.

**TesteJTable1.java · Listagem 2.7.1.1**

```java
String [] colunas = {"Nome", "Idade", "Sexo", "Endereço"};
```

A seguir, defina uma matriz de `Object`, responsável por armazenar alguns dados. Veja a Listagem 2.7.1.2.

**TesteJTable1.java · Listagem 2.7.1.2**

```java
Object [][] dados = {
    {"José", 15, 'M', "Rua B, 23"},
    {"Maria", 22, 'F', "Rua J, 255"},
    {"Pedro", 34, 'M', "Rua K, 10"}
};
```

A classe `JTable` possui um construtor que recebe uma matriz de `Object` (com os dados) e um vetor de `String`s (com os nomes das colunas), nesta ordem. A Listagem 2.7.1.3 ilustra seu uso.

**TesteJTable1.java · Listagem 2.7.1.3**

```java
JTable table = new JTable (dados, colunas);
```

O código da Listagem 2.7.1.4 constrói um `JFrame`, adiciona a tabela a ele e faz os ajustes para sua exibição.

**TesteJTable1.java · Listagem 2.7.1.4**

```java
JFrame frame = new JFrame ();
frame.getContentPane().add(table);
frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
frame.setLocationRelativeTo(null);
frame.pack();
frame.setVisible(true);
```

Também pode ser de interesse exibir barras de rolagem caso a tabela possua muitos dados. Para isso, basta utilizar um `JScrollPane`. A classe completa, já com o `JScrollPane` da Listagem 2.7.1.5, fica assim:

**TesteJTable1.java · Listagem 2.7.1.5**

```java
import javax.swing.JFrame;
import javax.swing.JScrollPane;
import javax.swing.JTable;

public class TesteJTable1 {
    public static void main(String[] args) {
        String[] colunas = {"Nome", "Idade", "Sexo", "Endereço"};
        Object[][] dados = {
            {"José", 15, 'M', "Rua B, 23"},
            {"Maria", 22, 'F', "Rua J, 255"},
            {"Pedro", 34, 'M', "Rua K, 10"}
        };
        JTable table = new JTable(dados, colunas);
        JScrollPane scrollPane = new JScrollPane(table);
        JFrame frame = new JFrame();
        frame.getContentPane().add(scrollPane);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLocationRelativeTo(null);
        frame.pack();
        frame.setVisible(true);
    }
}
```

Faça os seguintes testes para conhecer algumas características que uma `JTable` tem por padrão.

* Clique em uma célula: a linha inteira é destacada.
* Arraste uma coluna para a direita ou para a esquerda, clicando no seu nome.
* Clique duas vezes em uma célula: é possível editar seu conteúdo.
* Clique no separador entre duas colunas e arraste: é possível alterar a largura das colunas.
* Aumente o tamanho da tela e veja como as colunas se adaptam automaticamente, ocupando todo o espaço.

## JTable com TableModel
Duration: 15:00

O primeiro exemplo é muito simples de se utilizar, porém tem muitas limitações. As características destacadas (todas as células editáveis, por exemplo) podem ser indesejáveis. Além disso, pode ser de interesse exibir os dados de uma coluna de uma forma diferente, de acordo com o seu tipo.

Adicione uma nova coluna à coleção de dados do exemplo anterior. Ela indica se a pessoa é vegetariana com um valor booleano. Adicione também o nome da coluna. Veja a Listagem 2.7.2.1.

**Listagem 2.7.2.1**

```java
String [] colunas = {"Nome", "Idade", "Sexo", "Endereço", "Vegetariana(o)?"};
Object [][] dados = {
    {"José", 15, 'M', "Rua B, 23", false},
    {"Maria", 22, 'F', "Rua J, 255", false},
    {"Pedro", 34, 'M', "Rua K, 10", true}
};
```

Execute o exemplo e veja que os valores booleanos são exibidos textualmente. Neste caso, poderia ser muito mais interessante exibir um checkbox. Para isso, precisamos criar um modelo de dados personalizado para a tabela.

A forma como uma `JTable` lida com um modelo de dados é ilustrada na Figura 2.7.2.1. Note que o modelo de dados é um intermediário entre a `JTable` (a parte gráfica) e os dados propriamente ditos (que até então estão armazenados em uma matriz de `Object`, mas que poderia ser qualquer estrutura de dados).

![Uma JTable de exemplo ligada a um Table Model Object, que por sua vez se liga aos dados da tabela (Table Data)](img/fig-2-7-2-1.webp)

*Figura 2.7.2.1 – O modelo de dados fica entre a JTable e os dados.*

Em geral, para criar um modelo de dados personalizado, escrevemos uma classe que herda de **AbstractTableModel** e fazemos a sobrescrita somente dos métodos de interesse. Como o nome sugere, ela é abstrata. Há três métodos abstratos que devem ser sobrescritos obrigatoriamente (`getRowCount`, `getColumnCount` e `getValueAt`). Vamos manter o armazenamento de dados como no exemplo anterior neste momento (Listagem 2.7.2.2).

Para alterar a forma como a `JTable` exibe um elemento, basta fazer a sobrescrita do método `getColumnClass`. Ele devolve a classe do elemento. Por exemplo, para valores booleanos, esse método devolve a constante de classe `Boolean`. Assim a `JTable` decidirá sobre a melhor forma de exibi-lo (Listagem 2.7.2.3).

Note também que os nomes das colunas ainda não foram utilizados. Outro detalhe é o fato de as células não serem editáveis. Podemos alterar essas características sobrescrevendo os métodos `getColumnName`, `isCellEditable` e `setValueAt` (Listagem 2.7.2.5). A classe completa, reunindo as três listagens, fica assim:

**ExibicaoPersonalizadaTableModel.java · Listagens 2.7.2.2, 2.7.2.3 e 2.7.2.5**

```java
import javax.swing.table.AbstractTableModel;

public class ExibicaoPersonalizadaTableModel extends AbstractTableModel {

    public ExibicaoPersonalizadaTableModel(Object[][] dados, String[] colunas) {
        this.dados = dados;
        this.colunas = colunas;
    }
    private Object[][] dados;
    String[] colunas;

    @Override
    public int getRowCount() {
        return dados.length;
    }

    @Override
    public int getColumnCount() {
        return colunas.length;
    }

    @Override
    public Object getValueAt(int rowIndex, int columnIndex) {
        return dados[rowIndex][columnIndex];
    }

    @Override
    public Class getColumnClass(int columnIndex) {
        return getValueAt(0, columnIndex).getClass();
    }

    @Override
    public String getColumnName(int column) {
        return this.colunas[column];
    }

    @Override
    public boolean isCellEditable(int rowIndex, int columnIndex) {
        return true;
    }

    public void setValueAt(Object value, int row, int col) {
        dados[row][col] = value;
        fireTableCellUpdated(row, col);
    }
}
```

Para utilizar o modelo, basta instanciá-lo entregando-lhe os dados e colunas por meio de seu construtor. A seguir, a `JTable` pode ser instanciada recebendo o modelo como parâmetro. Crie uma nova classe para esse teste, chamada `TesteJTable2`. Veja a Listagem 2.7.2.4.

**TesteJTable2.java · Listagem 2.7.2.4**

```java
import javax.swing.JFrame;
import javax.swing.JScrollPane;
import javax.swing.JTable;

public class TesteJTable2 {
    public static void main(String[] args) {
        String[] colunas = {"Nome", "Idade", "Sexo", "Endereço", "Vegetariana(o)?"};
        Object[][] dados = {
            {"José", 15, 'M', "Rua B, 23", false},
            {"Maria", 22, 'F', "Rua J, 255", false},
            {"Pedro", 34, 'M', "Rua K, 10", true}
        };
        JTable table = new JTable(new ExibicaoPersonalizadaTableModel(dados, colunas));
        JScrollPane scrollPane = new JScrollPane(table);
        JFrame frame = new JFrame();
        frame.getContentPane().add(scrollPane);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLocationRelativeTo(null);
        frame.pack();
        frame.setVisible(true);
    }
}
```

### Exibindo um ComboBox em uma tabela

Uma célula pode exibir uma coleção de opções em um `JComboBox`. Para isso, basta alterar o seu editor padrão. Implemente a classe da Listagem 2.7.3.1 para esse novo teste. Note que há uma nova coluna para que seja selecionado o esporte preferido de cada pessoa.

**TesteJTable3.java · Listagem 2.7.3.1**

```java
import javax.swing.DefaultCellEditor;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.table.TableColumn;
import javax.swing.table.TableModel;

public class TesteJTable3 {
    public static void main(String[] args) {
        String[] colunas = {"Nome", "Idade", "Sexo", "Endereço", "Vegetariana(o)?", "Esporte"};
        Object[][] dados = {
            {"José", 15, 'M', "Rua B, 23", false, "Volei"},
            {"Maria", 22, 'F', "Rua J, 255", false, "Futebol"},
            {"Pedro", 34, 'M', "Rua K, 10", true, "Volei"}
        };
        TableModel model = new ExibicaoPersonalizadaTableModel(dados, colunas);
        JTable table = new JTable(model);
        setComboBox(table, model);
        JScrollPane scrollPane = new JScrollPane(table);
        JFrame frame = new JFrame();
        frame.getContentPane().add(scrollPane);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLocationRelativeTo(null);
        frame.pack();
        frame.setVisible(true);
    }

    public static void setComboBox(JTable table, TableModel model) {
        TableColumn column = table.getColumnModel().getColumn(model.getColumnCount() - 1);
        JComboBox<String> comboBox = new JComboBox<>();
        comboBox.addItem("Futebol");
        comboBox.addItem("Basquete");
        comboBox.addItem("Volei");
        column.setCellEditor(new DefaultCellEditor(comboBox));
    }
}
```

## A JTable da tela MostraAlunosCursoTela
Duration: 15:00

Já adicionamos uma `JTable` à tela que exibe alunos por curso. Agora é necessário realizar uma busca no banco para dizer quais dados ela deve exibir.

* Antes de mais nada, altere o nome da variável para `alunosTable`.
* A seguir, clique com o direito sobre a tabela e escolha **Table Contents >> User Specified**. Com esse ajuste estamos removendo os dados que o NetBeans coloca por padrão na tabela e estamos nos responsabilizando por eles.

<aside class="positive">

Antes desse ajuste, o código gerado pelo NetBeans para a tabela (na versão anterior desta apostila) já mostra a ideia de matriz de dados e vetor de nomes de colunas: `alunosTable.setModel(new javax.swing.table.DefaultTableModel(new Object[][] {...}, new String[] {"RA", "Nome", "Nascimento"}) {...})`, além de um vetor de tipos, um para cada coluna, e um método `getColumnClass` que devolve o tipo de cada coluna.

</aside>

A busca devolverá uma lista de alunos associados ao curso escolhido. Por isso, precisamos escrever uma classe cuja finalidade é representar alunos. Veja a sua implementação na Listagem 2.8.1.

**Aluno.java · Listagem 2.8.1**

```java
public class Aluno {
    private int ra;
    private String nome;
    private int anoNascimento;

    public Aluno(int ra, String nome, int anoNascimento) {
        this.ra = ra;
        this.nome = nome;
        this.anoNascimento = anoNascimento;
    }

    //getters/setters
    public int getRa() { return ra; }
    public void setRa(int ra) { this.ra = ra; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public int getAnoNascimento() { return anoNascimento; }
    public void setAnoNascimento(int anoNascimento) { this.anoNascimento = anoNascimento; }
}
```

A classe `DAO` é responsável por isolar o código de acesso à base. Por isso, cabe a ela implementar o método que busca os dados de alunos associados ao curso selecionado. Sua implementação é dada na Listagem 2.8.2.

**DAO.java · Listagem 2.8.2**

```java
public List<Aluno> buscaAlunosPorCurso(Curso curso) throws Exception {
    String sql = "SELECT ra, nome, ano_nascimento FROM tb_aluno INNER JOIN tb_aluno_curso ON tb_aluno.ra = tb_aluno_curso.ra_aluno WHERE id_curso = ?";
    List<Aluno> alunos = new ArrayList<>();
    try (Connection conexao = ConexaoBD.obterConexao();
            PreparedStatement ps = conexao.prepareStatement(sql)) {
        ps.setInt(1, curso.getId());
        try (ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                int ra = rs.getInt("ra");
                String nome = rs.getString("nome");
                int anoNascimento = rs.getInt("ano_nascimento");
                alunos.add(new Aluno(ra, nome, anoNascimento));
            }
        }
    }
    return alunos;
}
```

<aside class="positive">

A classe `DAO` precisa importar `java.util.List` e `java.util.ArrayList`, além das classes de `java.sql` já usadas.

</aside>

Uma subclasse de `AbstractTableModel` pode ser utilizada para obter e representar adequadamente os dados de interesse, alimentando a `JTable` sempre que ela precisar. A classe da Listagem 2.8.3 representa os dados em uma coleção do tipo `ArrayList`, cujo funcionamento interno se baseia em um vetor. Ocorre que seu método `add` se encarrega de verificar, antes de uma nova inserção, se o vetor já está cheio. Se já estiver, um novo é alocado para que o novo elemento caiba na coleção.

**AlunosPorCursoTableModel.java · Listagem 2.8.3**

```java
import java.util.List;
import javax.swing.table.AbstractTableModel;

public class AlunosPorCursoTableModel extends AbstractTableModel {
    private List<Aluno> alunos;
    private String[] colunas = {"ra", "nome", "ano de nascimento"};

    public AlunosPorCursoTableModel(Curso curso) throws Exception {
        DAO dao = new DAO();
        this.alunos = dao.buscaAlunosPorCurso(curso);
    }

    @Override
    public int getRowCount() {
        return alunos.size();
    }

    @Override
    public int getColumnCount() {
        return 3;
    }

    @Override
    public Object getValueAt(int rowIndex, int columnIndex) {
        switch (columnIndex) {
            case 0:
                return this.alunos.get(rowIndex).getRa();
            case 1:
                return this.alunos.get(rowIndex).getNome();
            case 2:
                return this.alunos.get(rowIndex).getAnoNascimento();
            default:
                return null;
        }
    }

    @Override
    public String getColumnName(int column) {
        return this.colunas[column];
    }
}
```

O construtor da classe `MostraAlunosCursoTela` passa, portanto, a utilizar o `TableModel`. Veja a Listagem 2.8.4.

**MostraAlunosCursoTela.java · Listagem 2.8.4**

```java
public MostraAlunosCursoTela(Curso curso) {
    super("Alunos por Curso");
    initComponents();
    idCursoLabel.setText(Integer.toString(curso.getId()));
    nomeCursoLabel.setText(curso.getNome());
    tipoCursoLabel.setText(curso.getTipo());
    setLocationRelativeTo(null);
    try {
        this.alunosTable.setModel(new AlunosPorCursoTableModel(curso));
    }
    catch (Exception e) {
        e.printStackTrace();
        JOptionPane.showMessageDialog(null, "Falha técnica. Tente novamente mais tarde.");
    }
}
```

## Encerramento
Duration: 3:00

Você modelou o relacionamento entre alunos e cursos, criou as tabelas com chaves estrangeiras, construiu a tela de alunos por curso e aprendeu a usar a `JTable` com matrizes, com um `TableModel` personalizado e, por fim, com dados vindos do MySQL.

Com isso termina a série **Interfaces gráficas em Java**. Como exercício, implemente o gerenciamento de alunos (cadastro, atualização e remoção) com base no gerenciamento de cursos das partes 2 e 3.

### Referências

* DEITEL, P. e DEITEL, H. *Java Como Programar*. 8ª Edição. São Paulo, SP: Pearson, 2010.
* ORACLE Java Tutorials. *Java Tutorials Learning Paths*. Acesso em: [https://docs.oracle.com/javase/tutorial/tutorialLearningPaths.html](https://docs.oracle.com/javase/tutorial/tutorialLearningPaths.html).
