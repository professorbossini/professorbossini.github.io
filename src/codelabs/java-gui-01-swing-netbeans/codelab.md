summary: Primeira parte da série de interfaces gráficas em Java - crie telas com JFrame, JLabel, JTextField e JButton, trate eventos de clique, monte um conversor de temperatura e comece o sistema acadêmico com a tela de login no NetBeans.
id: java-gui-01-swing-netbeans
categories: Java
tags: java,swing,gui,jframe,jlabel,jbutton,eventos,netbeans
status: Published
authors: Rodrigo Bossini
last updated: 2023-04-27
pdf: java/007_apostila_poo_gui.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Interfaces gráficas em Java (parte 1): Swing, JFrame e tela de login no NetBeans

## Visão geral
Duration: 3:00

O pacote `javax.swing` e seus subpacotes possuem classes úteis para a criação de interfaces gráficas para o usuário (GUI: *Graphical User Interface*). Até então, fizemos uso de uma delas, a `JOptionPane`. Neste material estudaremos a criação de interfaces gráficas utilizando diferentes recursos, indo além da simples exibição de caixas de diálogo.

Este é o primeiro codelab de uma série de quatro, em que construímos um sistema acadêmico com Swing, NetBeans e MySQL:

1. **Parte 1 (este codelab): Swing, JFrame e tela de login no NetBeans**
2. Parte 2: login com MySQL, tela principal e tela de cursos
3. Parte 3: cadastro, atualização e remoção de cursos
4. Parte 4: relacionamento entre alunos e cursos e a JTable

### O que você vai aprender

* O que são `JFrame` e seu painel de conteúdo
* Exibir textos com `JLabel` e iniciar a interface com `SwingUtilities.invokeLater`
* Montar uma tela com `JTextField`, `JButton` e `GridLayout`
* Tratar o evento de clique com `addActionListener`
* Criar telas no NetBeans arrastando e soltando componentes
* Tratar eventos e personalizar o construtor de uma tela gerada pelo NetBeans

### O que você vai precisar

* JDK instalado
* NetBeans (para a parte do sistema acadêmico)

## A classe JFrame e o Hello, Swing
Duration: 10:00

### A classe JFrame

A criação de uma interface gráfica (uma tela) envolve o uso da classe `JFrame`, que faz parte do pacote `javax.swing`. A palavra *frame* significa moldura. A ideia é construirmos uma moldura e então adicionarmos conteúdo a ela, como botões, campos textuais, tabelas, menus etc. Um `JFrame` possui um **painel de conteúdo** (do inglês *content pane*). Trata-se de um objeto capaz de armazenar outros objetos. Não adicionamos conteúdo diretamente a um `JFrame`. Uma vez que tenhamos um `JFrame` em mãos, obtemos uma referência ao seu painel de conteúdo e adicionamos conteúdo a ele.

### Hello, Swing

Vamos criar um primeiro exemplo para ilustrar o uso de duas classes do pacote Swing: `JFrame` e `JLabel`. Criaremos uma aplicação que exibe uma tela com o texto *Hello, Swing*.

* Crie um novo projeto e dê a ele um nome que esteja de acordo com o contexto estudado.
* Crie a classe `HelloSwingTela` e adicione a ela um método auxiliar, como na Listagem 2.2.1.

**HelloSwingTela.java · Listagem 2.2.1**

```java
public class HelloSwingTela {
    public static void criarTela() {
    }
}
```

Para instanciar um `JFrame`, podemos utilizar um construtor que recebe uma `String`. Ela será utilizada como título da tela. Na Listagem 2.2.2, além de fazermos isso, também utilizamos um método para especificar qual o comportamento esperado quando a tela for fechada pelo usuário. Essa operação é necessária pois, por padrão, caso o usuário feche a aplicação, a tela somente ficará invisível, mas o programa continuará em execução.

**HelloSwingTela.java · Listagem 2.2.2**

```java
public static void criarTela() {
    JFrame tela = new JFrame("Hello, Swing!!!");
    tela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
}
```

A finalidade da classe `JLabel` é exibir conteúdo textual que o usuário não pode editar. Para fazer isso, é preciso construir um objeto desse tipo, informar o texto a ser exibido no construtor e adicionar o objeto ao painel de conteúdo do `JFrame`. Veja a Listagem 2.2.3.

**HelloSwingTela.java · Listagem 2.2.3**

```java
//constroi um JLabel
JLabel helloSwingLabel = new JLabel("Hello, Swing!!!!!!!");
//obtem o painel de conteúdo
Container painelDeConteudo = tela.getContentPane();
//adiciona o JLabel ao painel de conteúdo
painelDeConteudo.add(helloSwingLabel);
```

Por padrão, objetos `JFrame` são invisíveis. Precisamos tornar o objeto que criamos visível. Isso pode ser feito com o método `setVisible`. Além disso, usamos o método `pack` para fazer com que sua largura e altura se ajustem de acordo com as medidas de seu conteúdo. Veja a Listagem 2.2.4.

**HelloSwingTela.java · Listagem 2.2.4**

```java
//ajusta largura e altura da tela conforme seu conteúdo
tela.pack();
//torna a tela visível
tela.setVisible(true);
```

A fim de colocar o programa em execução, precisamos criar o método `main`. Ocorre que o método `main` é executado pelo fluxo principal (que chamamos de *thread* principal). Códigos que envolvem a atualização de componentes visuais devem ser executados em um fluxo de execução à parte, que executa de maneira independente do principal e é reservado somente para isso. A programação concorrente foge do escopo da disciplina, porém é importante ter essa noção básica. A forma correta de se colocar em execução o nosso programa é exibida na Listagem 2.2.5. Não se preocupe com alguns detalhes. Isso se aprende com o tempo. Por hora, lembre-se de iniciar seu programa com interfaces gráficas sempre dessa forma.

**HelloSwingTela.java · Listagem 2.2.5**

```java
public static void main(String[] args) {
    SwingUtilities.invokeLater(() -> {
        criarTela();
    });
}
```

<details><summary>Ver a classe HelloSwingTela completa</summary>

A classe abaixo reúne as listagens deste passo, com as linhas de `import` necessárias.

**HelloSwingTela.java**

```java
import java.awt.Container;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.SwingUtilities;

public class HelloSwingTela {
    public static void criarTela() {
        JFrame tela = new JFrame("Hello, Swing!!!");
        tela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        //constroi um JLabel
        JLabel helloSwingLabel = new JLabel("Hello, Swing!!!!!!!");
        //obtem o painel de conteúdo
        Container painelDeConteudo = tela.getContentPane();
        //adiciona o JLabel ao painel de conteúdo
        painelDeConteudo.add(helloSwingLabel);
        //ajusta largura e altura da tela conforme seu conteúdo
        tela.pack();
        //torna a tela visível
        tela.setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            criarTela();
        });
    }
}
```

</details>

## Conversor de Celsius para Fahrenheit
Duration: 12:00

No Brasil, a temperatura é, em geral, medida em graus Celsius. Em outros países, é comum o uso de graus Fahrenheit. Vamos escrever um programa que permite ao usuário informar um valor em graus Celsius e fazer a conversão para Fahrenheit. Sua tela será parecida com a exibida pela Figura 2.3.1.

![Janela Conversor com o valor 30 digitado, o rótulo °C, o botão Converter e o resultado 86,00°F](img/fig-2-3-1.webp)

*Figura 2.3.1 – O conversor de temperatura.*

* Comece criando um novo projeto/programa com um nome adequado para o contexto.
* Crie a classe da Listagem 2.3.1. Seu método `criarTela`, como o nome sugere, será o responsável por criar a tela da aplicação. Ele já instancia um `JFrame`.

**ConversorDeTemperatura.java · Listagem 2.3.1**

```java
public class ConversorDeTemperatura {

    public static void criarTela() {
        JFrame tela = new JFrame("Conversor");

    }
}
```

Utilizaremos as classes da Tabela 2.3.1 para montar a tela.

*Tabela 2.3.1*

| Classe | Finalidade |
| --- | --- |
| `JButton` | Botões |
| `JLabel` | Componentes textuais não editáveis pelo usuário |
| `JTextField` | Componentes textuais editáveis pelo usuário |

A construção de cada um deles é exibida na Listagem 2.3.2.

**ConversorDeTemperatura.java · Listagem 2.3.2**

```java
public static void criarTela() {
    JFrame tela = new JFrame("Conversor");
    JTextField celsiusTextField = new JTextField(10);
    JLabel celsiusLabel = new JLabel("°C");
    JButton convertButton = new JButton("Converter");
    JLabel valorConvertidoLabel = new JLabel("");
}
```

Para que apareçam na tela, os componentes precisam ser adicionados ao painel de conteúdo do `JFrame`. Isso é feito na Listagem 2.3.3.

**ConversorDeTemperatura.java · Listagem 2.3.3**

```java
public static void criarTela() {
    JFrame tela = new JFrame("Conversor");
    JTextField celsiusTextField = new JTextField(10);
    JLabel celsiusLabel = new JLabel("°C");
    JButton convertButton = new JButton("Converter");
    JLabel valorConvertidoLabel = new JLabel("");
    Container painelDeConteudo = tela.getContentPane();
    painelDeConteudo.setLayout(new GridLayout(2, 4, 2, 4));
    painelDeConteudo.add(celsiusTextField);
    painelDeConteudo.add(celsiusLabel);
    painelDeConteudo.add(convertButton);
    painelDeConteudo.add(valorConvertidoLabel);
}
```

O botão é um componente que pode sofrer um evento de interesse. Ele pode ser clicado. Desejamos especificar um método que será executado quando esse evento acontecer, pois é nesse momento que a conversão deve acontecer. O tratamento de eventos com Swing é feito por meio da aplicação do padrão de projetos **Observer**. Veja uma possível implementação na Listagem 2.3.4.

**ConversorDeTemperatura.java · Listagem 2.3.4 (trecho acrescentado ao final de criarTela)**

```java
convertButton.addActionListener((e) -> {
    double celsius = Double.parseDouble(
            celsiusTextField.getText()
    );
    double fahrenheit = celsius / 5 * 9 + 32;
    valorConvertidoLabel.setText(
            String.format("%.2f°F", fahrenheit)
    );
});
```

Finalmente, fazemos os ajustes para que o `JFrame` seja exibido adequadamente, como na Listagem 2.3.5, e, para executar a aplicação, criamos um método `main` e utilizamos o método `invokeLater` de `SwingUtilities` para chamar o método `criarTela` apropriadamente (Listagem 2.3.6). A classe completa, com as linhas de `import`, fica assim:

**ConversorDeTemperatura.java · Listagens 2.3.5 e 2.3.6**

```java
import java.awt.Container;
import java.awt.GridLayout;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;

public class ConversorDeTemperatura {
    public static void criarTela() {
        JFrame tela = new JFrame("Conversor");
        JTextField celsiusTextField = new JTextField(10);
        JLabel celsiusLabel = new JLabel("°C");
        JButton convertButton = new JButton("Converter");
        JLabel valorConvertidoLabel = new JLabel("");
        Container painelDeConteudo = tela.getContentPane();
        painelDeConteudo.setLayout(new GridLayout(2, 4, 2, 4));
        painelDeConteudo.add(celsiusTextField);
        painelDeConteudo.add(celsiusLabel);
        painelDeConteudo.add(convertButton);
        painelDeConteudo.add(valorConvertidoLabel);
        convertButton.addActionListener((e) -> {
            double celsius = Double.parseDouble(
                    celsiusTextField.getText()
            );
            double fahrenheit = celsius / 5 * 9 + 32;
            valorConvertidoLabel.setText(
                    String.format("%.2f°F", fahrenheit)
            );
        });
        //ajusta largura e altura de acordo com o conteúdo
        //tela.pack();
        //centraliza
        tela.setLocationRelativeTo(null);
        //altera comportamento padrão do botão fechar
        tela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        //torna a tela visível
        tela.setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            criarTela();
        });
    }
}
```

## Sistema acadêmico no NetBeans: tela de login
Duration: 12:00

Nesta seção passaremos a utilizar o plugin de arrastar e soltar componentes do NetBeans para implementar um sistema acadêmico. O sistema irá permitir operações básicas de acesso a uma base de dados contendo dados de alunos e cursos de uma instituição de ensino.

### Criando o projeto

Comece criando um novo projeto/programa com nome de acordo com o contexto.

### Criando a tela de login

A primeira tela do sistema permitirá que o usuário insira seus dados de acesso. Para criá-la, clique com o direito no pacote principal da aplicação e escolha **New >> JFrame Form**. Seu nome será `LoginTela`.

### Campo para login

O usuário irá digitar seu login em um `JTextField`. Note que há uma paleta de componentes à direita. Arraste um componente do tipo **Text Field** para a tela. Faça os seguintes ajustes:

* Largura: 270
* Altura: 54
* Clique com o direito, escolha **Edit Text** e apague o texto que ele exibe por padrão.
* Clique com o direito, escolha **Change Variable Name** e digite `loginTextField`.
* Mantenha-o selecionado e veja suas propriedades na parte inferior direita da tela. Encontre a propriedade **border**. Escolha **Titled Border** e digite *Digite seu login* no campo **Title**.

### Campo para senha

Arraste e solte um componente do tipo **Password Field** logo abaixo do `loginTextField`. Faça os seguintes ajustes:

* Posição, largura e altura iguais aos do `loginTextField`.
* Clique com o direito, escolha **Edit Text** e apague o texto que ele exibe por padrão.
* Clique com o direito, escolha **Change Variable Name** e digite `senhaPasswordField`.
* Mantenha-o selecionado e veja suas propriedades na parte inferior direita da tela. Encontre a propriedade **border**. Escolha **Titled Border** e digite *Digite sua senha* no campo **Title**.

### Botões para sair e para fazer login

Arraste e solte dois componentes **Button** e faça ajustes para que o resultado seja parecido com o que exibe a Figura 2.4.5.1.

![Tela de login com os campos Digite seu login e Digite sua senha, com bordas com título, e os botões Sair e Login](img/fig-2-4-5-1.webp)

*Figura 2.4.5.1 – A tela de login montada no NetBeans.*

* Clique com o direito em cada botão, escolha **Change Variable Name** e altere seus nomes para `sairButton` e `loginButton`.

## Eventos e ajustes na tela de login
Duration: 8:00

### Tratando o evento "clique" dos botões

Há uma tarefa específica a ser executada quando cada um dos botões for clicado.

No caso do botão `sairButton`, apenas desejamos encerrar a aplicação. Para isso, basta clicar duas vezes sobre ele e completar o corpo do método que irá aparecer, como mostra a Listagem 2.4.6.1. Note que o registro do observador já foi feito automaticamente.

**LoginTela.java · Listagem 2.4.6.1**

```java
private void sairButtonActionPerformed(java.awt.event.ActionEvent evt) {
    this.dispose();
}
```

Para o botão `loginButton`, iremos especificar uma lógica simples, que ainda não acessa a base:

* Primeiro, pegamos o login que o usuário digitou.
* Depois, pegamos a senha. Note que a senha é entregue como um vetor de `char`. É preciso converter para `String`.
* Depois, verificamos se ambos são iguais a **admin** (isso vai ser alterado quando passarmos a usar uma base de dados). Em caso positivo, o sistema mostra uma mensagem de boas-vindas. Caso contrário, mostra uma mensagem de usuário inválido. Veja a Listagem 2.4.6.2.

**LoginTela.java · Listagem 2.4.6.2**

```java
private void loginButtonActionPerformed(java.awt.event.ActionEvent evt) {
    //pega o login do usuário
    String login = loginTextField.getText();
    //pega a senha do usuário como char[] e converte para String
    String senha = new String(senhaPasswordField.getPassword());
    //verifica se o usuário é válido
    if (login.equals("admin") && senha.equals("admin"))
        JOptionPane.showMessageDialog(null, "Bem vindo!");
    else
        JOptionPane.showMessageDialog(null, "Usuário inválido");
}
```

### Ajustes finos no código gerado pelo NetBeans

Para demonstrar a possibilidade de personalização no código gerado pelo NetBeans, vamos centralizar a tela e adicionar um título à moldura. Não podemos editar o código gerado por ele. Podemos, porém, adicionar código ao construtor.

Encontre o construtor e adicione as linhas `super(...)` e `setLocationRelativeTo`, como na Listagem 2.4.7.1.

**LoginTela.java · Listagem 2.4.7.1**

```java
public LoginTela() {
    super("Sistema Acadêmico");
    initComponents();
    this.setLocationRelativeTo(null);
}
```

## Exercícios
Duration: 20:00

1. Implemente um programa com interface gráfica como o conversor de temperatura. Ele deve permitir que o usuário digite um único valor numérico. Esse valor, que será digitado em centímetros, pode ser convertido para metros, milímetros e quilômetros. Deve haver três botões na aplicação, um para cada possível conversão. Deve haver somente um campo de resultado.
2. Ajuste a aplicação de login e senha para que o usuário seja validado em uma base de dados que tenha uma tabela de usuários.

## Encerramento
Duration: 2:00

Você criou telas com `JFrame`, `JLabel`, `JTextField` e `JButton`, tratou cliques com `addActionListener` e começou o sistema acadêmico com a tela de login desenhada no NetBeans.

### Próximo codelab da série

* **Interfaces gráficas em Java (parte 2): login com MySQL, tela principal e tela de cursos**, em que a validação do login passa a consultar o banco de dados.

### Referências

* DEITEL, P. e DEITEL, H. *Java Como Programar*. 8ª Edição. São Paulo, SP: Pearson, 2010.
* LOPES, A. e GARCIA, G. *Introdução à Programação – 500 Algoritmos Resolvidos*. 1ª Edição. São Paulo, SP: Elsevier, 2002.
