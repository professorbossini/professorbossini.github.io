summary: Construa uma tela responsiva em Flutter com LayoutBuilder, que exibe abas (TabBar e TabController) em telas pequenas e os conteúdos lado a lado em telas grandes, e entenda os mixins de Dart e o SingleTickerProviderStateMixin.
id: flutter-responsividade
categories: Flutter,Mobile
tags: flutter,dart,responsividade,layoutbuilder,mixin,tabbar,tabcontroller,genymotion
status: Published
authors: Rodrigo Bossini
last updated: 2023-09-24
pdf: dart_flutter/0x_apostila_flutter_responsividade.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Flutter: uma tela responsiva com LayoutBuilder e abas

## Visão geral
Duration: 3:00

Neste material, vamos desenvolver a seguinte aplicação. Ela mostra como fazer uma tela responsiva em Flutter. Para telas que tenham largura de, no máximo, 768 pixels, ela será apresentada assim.

![Aplicação no emulador em modo retrato, com a AppBar Aplicação responsiva simples, as abas Aba 1 e Aba 2 e o conteúdo da primeira aba](img/p001-1.webp)

*Em telas pequenas, os conteúdos aparecem em abas.*

Para telas maiores, ela será apresentada assim.

![Aplicação no emulador em modo paisagem, com os textos Conteúdo da primeira aba e Conteúdo da segunda aba lado a lado](img/p002-1.webp)

*Em telas maiores, os conteúdos aparecem lado a lado.*

### O que você vai aprender

* Como criar um projeto Flutter e executá-lo no emulador Genymotion ou no navegador
* Como usar o `LayoutBuilder` para escolher um Widget em função da largura da tela
* O que são os **mixins** de Dart e como resolver conflitos de nomes entre eles
* Como usar o `SingleTickerProviderStateMixin` com `TabController`, `TabBar` e `TabBarView`
* Como montar um layout com `Row`, `Expanded` e `Card`

### O que você vai precisar

* O SDK do Flutter instalado e o VS Code com a extensão Flutter
* Opcionalmente, o emulador Genymotion (ou um navegador para executar a aplicação)

## Workspace, novo projeto Flutter, VS Code e emulador
Duration: 8:00

Comece criando uma pasta para desempenhar o papel de **Workspace**. Ou seja, uma pasta que abriga subpastas, cada qual representando um projeto Flutter. No Windows, você pode usar algo assim:

```text
C:\Users\seuUsuario\Documents\dev\
```

A seguir, abra um terminal e vincule-o ao diretório que acabou de criar com

**Terminal**

```bash
cd C:\Users\seuUsuario\Documents\dev
```

Crie o projeto Flutter com

**Terminal**

```bash
flutter create responsividade
```

Abra o VS Code e clique em **File >> Open Folder**. Navegue até a pasta recém-criada. Abra o arquivo `lib/main.dart` e **apague todo o seu conteúdo**.

Clique **Terminal >> New terminal** para abrir um terminal interno do VS Code. Caso possua o emulador **Genymotion** instalado, abra o aplicativo agora e coloque um de seus dispositivos virtuais em execução.

![Janela do Genymotion com a lista de dispositivos virtuais e o botão de iniciar de um Samsung destacado](img/p003-1.webp)

*Iniciando um dispositivo virtual no Genymotion.*

Caso não possua o Genymotion, você pode executar a aplicação no navegador normalmente.

## Três Widgets e o Widget principal
Duration: 8:00

Nossa aplicação terá três widgets: aquele para telas pequenas, aquele para telas "não pequenas" e aquele que decide qual deve ser exibido.

* **MobileLayout**: ele constrói a tela a ser exibida em dispositivos de largura de, no máximo, 768 pixels.
* **WebLayout**: ele constrói a tela a ser exibida em dispositivos de largura maior do que 768 pixels.
* **MeuLayoutResponsivo**: utiliza a classe `LayoutBuilder` para decidir qual Widget exibir em função da largura da tela.

Além disso, ela terá também o Widget principal, cuja definição aparece a seguir.

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main() => runApp(App());

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aplicação responsiva simples',
      //um ThemeData armazena dados de um tema, como estilos de texto, cores, estilo da AppBar etc
      theme: ThemeData(
        primarySwatch: Colors.blue //swatch significa algo como "amostra"
      ),
      //essa classe decide qual Widget usar
      home: Text("Começando"),
    );
  }
}
```

A seguir, escrevemos o Widget **MeuLayoutResponsivo**. Ele define um `Scaffold` e, em função da largura da tela, obtida por meio da classe `LayoutBuilder`, decide o que exibir.

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main() => runApp(App());

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aplicação responsiva simples',
      //um ThemeData armazena dados de um tema, como estilos de texto, cores, estilo da AppBar etc
      theme: ThemeData(
        primarySwatch: Colors.blue //swatch significa algo como "amostra"
      ),
      //essa classe decide qual Widget usar
      home: MeuLayoutResponsivo(),
    );
  }
}

//essa classe decide qual Widget usar, de acordo com o tamanho da tela
class MeuLayoutResponsivo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Aplicação responsiva simples")),
      body: LayoutBuilder(builder: (context, constraints) {
        //breakpoint que definimos para dizer que a tela é pequena
        return constraints.maxWidth <= 578 ? Text("Pequena") : Text("Grande");
      }),
    );
  }
}
```

<aside class="positive">

**Observe** que o código usa 578 como breakpoint, embora a descrição da aplicação fale em 768 pixels. Se quiser seguir exatamente a descrição, troque o valor na comparação `constraints.maxWidth <= 578`.

</aside>

No emulador, veja o resultado quando ele está em modo retrato. Lembre-se de fazer **hot restart** antes, apertando **SHIFT+R** no terminal em que você executou o comando `flutter run`.

![Emulador em modo retrato exibindo a AppBar e o texto Pequena](img/p006-1.webp)

*Em modo retrato, a tela é considerada pequena.*

Você pode clicar no botão destacado a seguir para ver o resultado quando o dispositivo está em modo paisagem.

![Emulador Genymotion com o botão de rotação da barra lateral destacado](img/p007-1.webp)

*O botão de rotação do Genymotion.*

Veja o resultado.

![Emulador em modo paisagem exibindo a AppBar e o texto Grande](img/p007-2.webp)

*Em modo paisagem, a tela é considerada grande.*

## Dart: o recurso chamado Mixins
Duration: 10:00

Dart possui um recurso chamado **Mixin**. Um Mixin permite utilizarmos código sem termos de utilizar herança. Veja algumas características dos mixins.

* São definidos como classes. Mas trocamos a palavra `class` por `mixin`.
* Quando uma classe decide utilizar um mixin que definimos, ela o faz utilizando a palavra `with`, em vez de `extends`.
* Mixins não podem ser instanciados diretamente.

<aside class="positive">

**Nota.** Uma tradução direta da palavra mixin poderia ser algo como "**misturar**" ou "**combinar**". No ambiente de desenvolvimento de software, geralmente se mantém a palavra original, sem tradução mesmo.

</aside>

Visite o DartPad em [https://dartpad.dev/](https://dartpad.dev/) e faça o seguinte teste. Leia os comentários com atenção, ok?

```dart
//esse mixin define um método
mixin DizerOla{
  String ola(){
    return "Olá";
  }
}

//esse mixin define outro método
mixin DizerMeuMixin{
  String meuMixin(){
    return "meu mixin";
  }
}

//essa classe usa os dois mixins
class OlaMeuMixin with DizerOla, DizerMeuMixin {
  olaMeuMixin(){
    //observe como ela pode chamar cada método
    print('${ola()}, ${meuMixin()}');
  }
}

void main(){
  var teste = OlaMeuMixin();
  teste.olaMeuMixin();
}
```

Veja o resultado esperado.

![DartPad com o código dos mixins e o console exibindo Olá, meu mixin](img/p009-1.webp)

*O console exibe "Olá, meu mixin".*

Ocorre que dois mixins podem definir métodos de nomes iguais. O que acontece quando uma classe utiliza ambos? Veja o exemplo a seguir.

```dart
//esse mixin define um método
mixin DizerOla{
  String ola(){
    return "Olá";
  }

  void quemSouEu(){
    print("Me chamo DizerOla");
  }
}

//esse mixin define outro método
mixin DizerMeuMixin{
  String meuMixin(){
    return "meu mixin";
  }

  void quemSouEu(){
    print("Me chamo DizerMeuMixin");
  }
}

//essa classe usa os dois mixins
class OlaMeuMixin with DizerOla, DizerMeuMixin {
  olaMeuMixin(){
    //observe como ela pode chamar cada método
    print('${ola()}, ${meuMixin()}');
  }
}

void main(){
  var teste = OlaMeuMixin();
  teste.olaMeuMixin();
  teste.quemSouEu();
}
```

Veja o resultado esperado.

![DartPad com o console exibindo Olá, meu mixin e, destacado, Me chamo DizerMeuMixin](img/p010-1.webp)

*Prevalece o método do mixin DizerMeuMixin.*

Observe que aparece o texto produzido pelo mixin "DizerMeuMixin". Por que isso aconteceu? É simples. Ele foi o último, da esquerda para a direita, definido na lista de mixins da classe, após a palavra `with`. Inverta a ordem e confira o resultado.

```dart
class OlaMeuMixin with DizerMeuMixin, DizerOla {
```

![DartPad com a ordem dos mixins invertida e o console exibindo, destacado, Me chamo DizerOla](img/p010-2.webp)

*Com a ordem invertida, prevalece o método de DizerOla.*

## O mixin SingleTickerProviderStateMixin e o layout para telas pequenas
Duration: 15:00

Agora que sabemos o que são os mixins, podemos fazer uso de um que o Flutter oferece: **SingleTickerProviderStateMixin**.

Um **Ticker** é uma espécie de relógio que faz "tick" a cada frame de uma animação. Você se lembra das expressões 30fps ou 60fps? Elas indicam o número de **frames per second** de uma aplicação. Ou seja, quantas trocas de quadros ou frames acontecem por segundo. Um Ticker é um objeto que faz tick a cada troca de quadro. Neste caso, fazer tick significa notificar a quem estiver interessado que aquele intervalo de tempo passou.

Neste exemplo, vamos utilizar este mixin para fazer a animação que ocorre na transição de abas. Para construir as abas, vamos precisar de

* **TabController**: gerencia a seleção de abas e as animações entre elas. Quando a instanciamos, informamos o número de abas e um `TickerProvider`, que poderá ser a nossa própria classe, por conta do uso do `SingleTickerProviderStateMixin`.
* **TabBar**: Widget que exibe uma barra de abas.
* **TabBarView**: Widget que exibe o conteúdo de uma aba selecionada.

Como este vai ser um Widget stateful, vamos escrever duas classes: aquela que define o Widget e aquela que define seu estado.

**lib/main.dart**

```dart
//Widget para telas "pequenas". Vamos exibir uma tela com duas abas.
class MobileLayout extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    //vai ser definida a seguir
    return MobileLayoutState();
  }
}

//classe que representa o estado do Widget para telas pequenas
class MobileLayoutState extends State<MobileLayout>
    with SingleTickerProviderStateMixin {
  //para lidar com as abas
  TabController? tabController;

  @override
  void initState() {
    super.initState();
    //vsync deve ser um tickerprovider
    //pode ser this por conta do uso do mixin
    tabController = TabController(length: 2, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    //gerenciador de layout que empilha seus filhos (coluna)
    return Column(
      children: [
        //A barra que exibe as abas
        TabBar(
          labelColor: Colors.black,
          controller: tabController,
          tabs: [Tab(text: "Aba 1"), Tab(text: 'Aba 2')],
        ),
        //gerenciador de layout para expandir seu conteúdo no eixo principal
        Expanded(
          child: TabBarView(
            controller: tabController,
            children: [
              Center(child: Text("Conteúdo da primeira aba")),
              Center(child: Text("Conteúdo da segunda aba"))
            ],
          ))
      ],
    );
  }
}
```

Já podemos utilizá-lo. Veja.

**lib/main.dart**

```dart
...
//essa classe decide qual Widget usar, de acordo com o tamanho da tela
class MeuLayoutResponsivo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Aplicação responsiva simples")),
      body: LayoutBuilder(builder: (context, constraints) {
        //breakpoint que definimos para dizer que a tela é pequena
        return constraints.maxWidth <= 578 ? MobileLayout() : Text("Grande");
      }),
    );
  }
}
...
```

A seguir, veja o resultado no emulador. (Lembre-se de fazer hot restart (SHIFT+R)).

![Emulador em modo retrato exibindo as abas Aba 1 e Aba 2 e o texto Conteúdo da primeira aba](img/p013-1.webp)

*O MobileLayout exibindo as duas abas.*

## O layout para telas maiores
Duration: 8:00

Resta fazer a definição do Widget (e de seu estado) para telas maiores.

<aside class="positive">

**Nota.** Lembre-se sempre de passar o mouse em cima do nome do recurso que você não conhecer para ler a sua documentação. Veja um exemplo de `MainAxisAlignment.spaceEvenly`.

</aside>

![Janela de documentação do VS Code para MainAxisAlignment spaceEvenly, com a descrição Place the free space evenly between the children as well as before and after the first and last child destacada](img/p014-1.webp)

*Documentação exibida ao passar o mouse sobre MainAxisAlignment.spaceEvenly.*

O Widget e seu estado ficam assim.

**lib/main.dart**

```dart
//Widget para telas "grandes". Vamos exibir os conteúdos das abas lado a lado.
class WebLayout extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return WebLayoutState();
  }
}

//classe que representa o estado do Widget para telas grandes
class WebLayoutState extends State<WebLayout> {
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        Expanded(
          child: Card(
            child: Center(child: Text("Conteúdo da primeira aba"))
          )
        ),
        Expanded(
          child: Card(
            child: Center(
              child: Text('Conteúdo da segunda aba'),
            )
          )
        )
      ],
    );
  }
}
```

Para que o `WebLayout` seja exibido em telas grandes, o `MeuLayoutResponsivo` deve devolvê-lo no lugar do `Text("Grande")` (ajuste implícito na apostila):

**lib/main.dart**

```dart
return constraints.maxWidth <= 578 ? MobileLayout() : WebLayout();
```

Faça hot restart e novos testes.

## Encerramento
Duration: 3:00

Parabéns! Você construiu uma tela responsiva em Flutter: o `LayoutBuilder` decide, pela largura disponível, entre o `MobileLayout`, com abas animadas graças ao `SingleTickerProviderStateMixin`, e o `WebLayout`, com os conteúdos lado a lado. No caminho, você também conheceu os mixins de Dart.

### Referências

* Dart programming language | Dart. Google, 2023. Disponível em [https://dart.dev/](https://dart.dev/). Acesso em setembro de 2023.
* Flutter - Build apps for any screen. Google, 2023. Disponível em [https://flutter.dev/](https://flutter.dev/). Acesso em setembro de 2023.
