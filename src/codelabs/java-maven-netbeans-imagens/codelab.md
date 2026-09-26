summary: Exiba imagens em um projeto Java com Swing criado no NetBeans e gerenciado pelo Maven, guardando as figuras em src/main/resources, usando-as como ícone de um JLabel e como imagem de fundo de um JFrame.
id: java-maven-netbeans-imagens
categories: Java
tags: java,swing,netbeans,maven,imagens,jlabel,jpanel,resources
status: Published
authors: Rodrigo Bossini
last updated: 2023-11-07
pdf: java/901_apostila_java_maven_netbeans_usando_figuras_dentro_do_projeto.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Imagens em projetos Java com Maven e NetBeans

## Visão geral
Duration: 2:00

Neste material, veremos como exibir imagens de diferentes formas num projeto criado com o NetBeans, gerenciado pelo Maven e que utiliza classes do pacote `javax.swing`.

### O que você vai aprender

* Onde guardar imagens (recursos) em um projeto Maven
* Exibir uma figura em um `JLabel` pela propriedade **icon**
* Conferir se a figura é referenciada a partir do projeto
* Exibir uma imagem de fundo em um `JFrame` com um `JPanel` personalizado

### O que você vai precisar

* NetBeans com JDK instalado
* Uma figura (por exemplo, `figura.jpg`)

## Projeto e pasta de recursos
Duration: 5:00

### Novo projeto

No NetBeans, clique **File >> New Project** para criar um projeto. Na tela a seguir, escolha **Java with Maven >> Java Application**. A seguir, escolha um nome para o seu projeto e o diretório em que ele ficará localizado. Os demais campos você pode manter com seu valor padrão. Clique em **Finish**.

### Pasta para recursos

Os recursos (como imagens) num projeto gerenciado pelo Maven devem ser armazenados numa pasta chamada `resources`. Ela deve ser subpasta de `src/main`. No NetBeans, clique na aba **Files**, no canto superior esquerdo. A seguir, crie a pasta `resources` como descrito. Veja a Figura 2.2.1.

![Aba Files do NetBeans com o menu de contexto da pasta main aberto em New >> Folder](img/fig-2-2-1.webp)

*Figura 2.2.1 – Criando a pasta resources dentro de src/main.*

Como subpasta de `resources`, crie uma pasta chamada `images`. A Figura 2.2.2 mostra o resultado esperado.

![Estrutura do projeto na aba Files: src/main com as pastas java e resources, e images dentro de resources](img/fig-2-2-2.webp)

*Figura 2.2.2 – A pasta images dentro de resources.*

Arraste a sua figura para dentro da pasta `images`. Veja a Figura 2.2.3.

![Arquivo figura.jpg dentro da pasta src/main/resources/images](img/fig-2-2-3.webp)

*Figura 2.2.3 – A figura dentro da pasta images.*

## Exibindo uma figura em um JLabel
Duration: 10:00

Agora vamos criar uma tela adicionando um `JFrame` ao projeto. Para tal, primeiro volte à aba **Projects** do NetBeans no canto superior esquerdo. Depois, clique com o direito no pacote principal do projeto (caixinha amarela) e escolha **New >> JFrame Form**. Veja a Figura 2.3.1.

![Aba Projects com o menu de contexto do pacote principal em New >> JFrame Form](img/fig-2-3-1.webp)

*Figura 2.3.1 – Criando um JFrame Form.*

A seguir, da aba **Palette** à direita, arraste um **Label** e solte no `JFrame`. Ajuste seu tamanho como desejar, talvez como na Figura 2.3.2.

![JFrame em modo Design com um JLabel grande ocupando a maior parte da tela](img/fig-2-3-2.webp)

*Figura 2.3.2 – O JLabel que exibirá a figura.*

Clique com o direito sobre o `JLabel` criado e escolha **Edit Text**. Apague todo o texto. Clique novamente com o direito sobre o `JLabel` e escolha **Change Variable Name**. Escolha o nome `imagemLabel`.

Como mostra a Figura 2.3.3, mantenha o `JLabel` selecionado e, no canto inferior direito, encontre a sua propriedade chamada **icon**. Clique em **...** do lado desta opção.

![NetBeans com o JLabel selecionado e, nas propriedades, o botão ao lado de icon destacado](img/fig-2-3-3.webp)

*Figura 2.3.3 – A propriedade icon do JLabel.*

Na tela a seguir, exibida pela Figura 2.3.4, mantenha a opção **package** configurada como `images` e clique **Import to Project**.

![Diálogo do icon com Image Within Project selecionado, o pacote images e o botão Import to Project destacados](img/fig-2-3-4.webp)

*Figura 2.3.4 – Importando a figura para o projeto.*

A seguir, escolha a figura desejada. Como ilustra a Figura 2.3.5, certifique-se de selecionar a figura que se encontra na pasta `images` de seu projeto.

![Assistente Import images to project com a pasta images aberta e o arquivo figura.jpg selecionado](img/fig-2-3-5.webp)

*Figura 2.3.5 – Selecionando a figura na pasta images.*

A seguir, expanda as pastas até encontrar seu pacote principal. Clique em **Finish**. Veja a Figura 2.3.6.

![Passo Select target folder com o pacote principal do projeto selecionado em Source Packages](img/fig-2-3-6.webp)

*Figura 2.3.6 – Escolhendo a pasta de destino.*

Depois disso, veja um resultado parecido com aquele que a Figura 2.3.7 exibe. Clique em **OK** a seguir.

![Diálogo do icon com o pacote do projeto e o arquivo figura.jpg escolhidos e uma prévia da imagem](img/fig-2-3-7.webp)

*Figura 2.3.7 – A figura escolhida, com prévia.*

## Referenciando a figura a partir do projeto
Duration: 5:00

A seguir, clique uma vez mais em **...** do lado de **icon** nas propriedades do `JLabel` (deixe-o selecionado para isso). Depois disso, clique em **...** do lado de **File** (nome da figura) mantendo a opção **Image Within Project** selecionada. Você deverá ver a pasta `src/main/resources` também como opção para obter a imagem. Expanda e selecione a figura. Clique **Ok** e **Ok** a seguir. Veja a Figura 2.3.8.

![NetBeans exibindo a figura no JLabel e o diálogo de seleção de arquivo com src/main/resources/images/figura.jpg selecionado](img/fig-2-3-8.webp)

*Figura 2.3.8 – Selecionando a figura em src/main/resources.*

Se desejar certificar-se de que a figura está sendo referenciada a partir do projeto (e não de um diretório externo), clique em **Source**, encontre o método `initComponents` e "descubra" seu código clicando no botão **+** do lado do número da linha. A seguir, encontre a chamada ao método `setIcon` do `JLabel`. Veja a Figura 2.3.9.

![Código de initComponents com a chamada imagemLabel.setIcon destacada, carregando /images/figura.jpg com getResource](img/fig-2-3-9.webp)

*Figura 2.3.9 – A chamada a setIcon usa o caminho /images/figura.jpg, dentro do projeto.*

## Imagem de fundo em um JFrame
Duration: 12:00

Vejamos como exibir uma imagem de fundo em um `JFrame`. Comece clicando com o direito no pacote principal do projeto e escolha **New >> JFrame Form**. Seu nome pode ser algo como `TelaComImagemDeFundo`. Veja a Figura 2.4.1.

![Menu de contexto do pacote principal com New >> JFrame Form destacado](img/fig-2-4-1.webp)

*Figura 2.4.1 – Criando a tela TelaComImagemDeFundo.*

A seguir, clique com o direito no nome do pacote e escolha **New >> Java Class**. Escolha o nome `ImagePanel`. Veja a sua definição no Código 2.4.1. Esta classe será responsável por definir um painel que toma a tela inteira e exibe a imagem desejada.

**ImagePanel.java · Código 2.4.1**

```java
import javax.swing.*;
import java.awt.*;
import java.io.IOException;
import javax.imageio.ImageIO;
import java.net.URL;

public class ImagePanel extends JPanel {
    //armazenará uma referência à imagem
    private Image backgroundImage;

    public ImagePanel(URL url) {
        //leitura da imagem a partir de um objeto URL
        //URL é o tipo de retorno de getResource
        //deve ser utilizado em projetos Maven
        try {
            backgroundImage = ImageIO.read(url);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //aqui dizemos que, depois de o componente ser desenhado, desenhamos também a imagem sobre ele
    //a partir das coordenadas x = 0 e y = 0
    @Override
    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.drawImage(backgroundImage, 0, 0, this);
    }
}
```

De volta ao arquivo `TelaComImagemDeFundo.java`, em modo **Design**, arraste e solte um **Panel** ao frame principal. A seguir, expanda-o fazendo com que tome o frame inteiro. Veja a Figura 2.4.2.

![Modo Design com um Panel ocupando todo o JFrame](img/fig-2-4-2.webp)

*Figura 2.4.2 – O Panel ocupando o frame inteiro.*

Agora em modo **Source**, ainda no arquivo `TelaComImagemDeFundo.java`, encontre o construtor padrão da classe e ajuste-o como no Código 2.4.3. Observe que o Panel que arrastamos será responsável por abrigar os componentes que desejamos que a tela possua (botões, campos textuais etc). Por outro lado, o `ImagePanel` abrigará o Panel que foi arrastado.

**TelaComImagemDeFundo.java · Código 2.4.3**

```java
...
import java.awt.BorderLayout;

public class TelaComImagemDeFundo extends javax.swing.JFrame {

    public TelaComImagemDeFundo() {
        initComponents();
        ImagePanel imagePanel = new ImagePanel(getClass().getResource("/images/figura.jpg"));
        this.setContentPane(imagePanel);
        this.setLayout(new BorderLayout());
        // Certifique-se de que todos os componentes são adicionados ao painel da imagem
        imagePanel.add(jPanel1);
        // Certifique-se de que a janela está corretamente dimensionada
        this.pack();
    }
...
```

De volta ao modo **Design**, ainda no arquivo `TelaComImagemDeFundo.java`, arraste e solte os componentes que desejar. Neste exemplo, arrastamos apenas dois botões para fins de ilustração. Veja a Figura 2.4.3.

![Modo Design com dois botões, jButton1 e jButton2, sobre o Panel](img/fig-2-4-3.webp)

*Figura 2.4.3 – Componentes sobre o Panel.*

<aside class="positive">

**Nota.** Pelo fato de a imagem não ter sido adicionada com a ferramenta de arrastar e soltar do NetBeans, o preview não exibirá a imagem. Porém, ela será exibida quando o projeto for executado.

</aside>

<aside class="negative">

**Nota.** É possível fazer com que a imagem apareça já em modo de preview. A estratégia para isso é diferente: configuramos o leiaute do Frame principal como **AbsoluteLayout**, o que nos permite posicionar, como o nome sugere, os componentes em pontos fixos, absolutos. Isso não é recomendável pois, ao redimensionar a tela, eles ficarão fixos no ponto em que foram posicionados a princípio.

</aside>

## Painel transparente e janelas do NetBeans
Duration: 5:00

Ainda precisamos ajustar um detalhe: tornar o Panel que abriga os componentes da tela **transparente**. Assim, o Panel que o abriga — e contém a imagem — poderá aparecer. Para tal, clique com o direito no Panel — aba **Navigator**, que geralmente fica no canto inferior esquerdo — escolha **Properties** e encontre a propriedade **opaque**. Desmarque a caixa e clique **Close**. Veja a Figura 2.4.4.

![Aba Navigator com jPanel1 selecionado e a janela de propriedades com a caixa opaque desmarcada e o botão Close destacado](img/fig-2-4-4.webp)

*Figura 2.4.4 – Desmarcando a propriedade opaque do Panel.*

<aside class="positive">

**Nota.** Talvez o Navigator não esteja aparecendo para você. Para visualizá-lo, você pode clicar **Window >> Navigator**, como na Figura 2.4.5.

</aside>

![Menu Window do NetBeans com a opção Navigator destacada](img/fig-2-4-5.webp)

*Figura 2.4.5 – Window >> Navigator.*

Também é possível ajustar o NetBeans para que ele se apresente como na forma original. Geralmente isso é útil para os casos em que você alterou algumas janelas ou fechou algumas sem querer. Se desejar, faça isso com a opção **Window >> Reset Windows**, como na Figura 2.4.6.

![Menu Window do NetBeans com a opção Reset Windows destacada](img/fig-2-4-6.webp)

*Figura 2.4.6 – Window >> Reset Windows.*

## Encerramento
Duration: 2:00

Você guardou figuras em `src/main/resources/images`, exibiu uma delas em um `JLabel` pela propriedade icon e criou um `ImagePanel` para desenhar uma imagem de fundo em um `JFrame`, sobre a qual ficam os demais componentes.
