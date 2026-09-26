summary: Construa com Flutter um aplicativo que exibe fotos obtidas por requisições HTTP à API da Pexels, aprendendo widgets básicos, StatelessWidget e StatefulWidget, JSON, classes de modelo, Futures e async/await.
id: flutter-app-fotos
categories: Flutter,Mobile
tags: flutter,dart,widgets,scaffold,statefulwidget,json,http,future,async,listview,pexels
status: Published
authors: Rodrigo Bossini
last updated: 2023-09-04
pdf: dart_flutter/01_apostila_flutter_app_fotos.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Flutter: aplicativo de fotos com a API da Pexels

## Visão geral
Duration: 4:00

**Flutter** é um framework criado pelo Google que permite a criação de aplicações "bonitas" para múltiplas plataformas. Veja a sua página oficial: [https://flutter.dev/](https://flutter.dev/). Algumas características:

* A partir de um único "codebase", podemos gerar aplicações para múltiplas plataformas, como Linux, Windows, MacOS, Android, iOS e Web.
* Compilação nativa para arquiteturas ARM e Intel. Também compila para Javascript.
* Interfaces gráficas construídas utilizando-se **Widgets**. Um Widget é um componente visual como um botão, um campo textual, um gerenciador de leiaute etc.
* Cada Widget é implementado como uma **classe Dart**.
* Flutter possui um vasto catálogo de Widgets, que pode ser encontrado em [https://docs.flutter.dev/ui/widgets](https://docs.flutter.dev/ui/widgets). É uma boa ideia manter esse link na sua barra de favoritos enquanto desenvolve.
* Também podemos criar nossos próprios Widgets.

Neste codelab, vamos desenvolver uma aplicação que exibe fotos obtidas por meio de requisições HTTP. Ela nos permitirá aprender o uso básico de Widgets Flutter, bem como alguns recursos interessantes, tais como o funcionamento do processamento assíncrono neste ambiente.

### O que você vai aprender

* Como criar e executar um projeto Flutter pelo terminal e pelo VS Code
* Como usar os Widgets `MaterialApp`, `Text`, `Scaffold`, `AppBar`, `FloatingActionButton`, `Icon`, `ListView` e `Image`
* Hot reload, hot restart e full restart
* Parâmetros nomeados e opcionais e funções (inclusive arrow functions) em Dart
* A diferença entre `StatelessWidget` e `StatefulWidget` e o uso de `setState`
* Como representar dados com JSON e manipulá-los em Dart com `dart:convert`
* Classes de modelo, construtores nomeados e o modificador `late`
* Requisições HTTP com o pacote `http` e a API da Pexels
* `Future`, `then` e `async`/`await`

### O que você vai precisar

* O Flutter SDK instalado e configurado
* O VS Code com a extensão Dart/Flutter
* O Google Chrome (para executar a aplicação na Web)
* Um navegador com acesso ao [DartPad](https://dartpad.dev/)
* Uma conta gratuita na [Pexels](https://www.pexels.com/) (criada ao longo do codelab)

## Workspace, novo projeto Flutter e VS Code
Duration: 8:00

Comece criando uma pasta para desempenhar o papel de **Workspace**, ou seja, uma pasta que abriga subpastas, cada qual representando um projeto Flutter. No Windows, você pode usar algo assim:

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
flutter create exibe_imagens
```

Abra o VS Code e clique em **File >> Open Folder**. Navegue até a pasta recém-criada. Veja o resultado esperado.

![VS Code com a pasta exibe_imagens aberta no Explorer, mostrando as pastas android, ios, lib, linux, macos, test, web, windows e o arquivo pubspec.yaml](img/p002-1.webp)

*Projeto exibe_imagens aberto no VS Code.*

Observe que no canto inferior direito há a possibilidade de escolher a plataforma em que a aplicação será colocada em execução. No exemplo a seguir, o padrão selecionado é Linux. Dependendo de seu ambiente, o padrão pode ser diferente. Clique sobre esta opção e escolha o **Chrome** para executarmos a aplicação na Web.

![Menu "Select a device to use" do VS Code com as opções Linux e Chrome, com Chrome destacado, e a barra de status mostrando Linux (linux-x64)](img/p003-1.webp)

*Escolha da plataforma de execução no VS Code.*

No VS Code, clique em **Terminal >> New Terminal**. Use

**Terminal**

```bash
flutter run
```

para executar a aplicação. É possível que você tenha de selecionar a plataforma alvo. Digite o número associado ao Google Chrome.

**Terminal**

```text
imagens$ flutter run
Connected devices:
Linux (desktop) • linux  • linux-x64      • Ubuntu 22.04.3 LTS 6.2.0-26-generic
Chrome (web)    • chrome • web-javascript • Google Chrome 116.0.5845.96
[1]: Linux (linux)
[2]: Chrome (chrome)
Please choose one (or "q" to quit):
```

A aplicação resultante apenas mostra um botão que, quando clicado, incrementa um contador exibido na parte central da tela.

![Aplicação de exemplo do Flutter no navegador, com o título Flutter Demo Home Page, um contador com valor 0 e um botão flutuante](img/p004-1.webp)

*A aplicação de exemplo criada pelo flutter create.*

Observe que temos uma pasta chamada **lib** e que, dentro dela, há um arquivo chamado **main.dart**. O código Dart da aplicação exemplo se encontra ali. O ponto de partida da aplicação se encontra neste arquivo. Seu nome deve ser **main.dart**.

![Explorer do VS Code com a pasta lib expandida e o arquivo main.dart destacado, aberto no editor](img/p005-1.webp)

*O arquivo lib/main.dart.*

## Exibindo um componente textual
Duration: 10:00

Apague todo o conteúdo do arquivo **main.dart** para começarmos a trabalhar em nossa aplicação do zero.

Vamos começar apenas exibindo um componente textual. Para isso, precisamos

* importar o pacote que contém o Widget desejado
* escrever uma função **main**, que é o ponto em que a aplicação começa
* criar o Widget capaz de exibir conteúdo textual
* exibir o Widget na tela

<aside class="positive">

**Nota.** Há três formas de se importar conteúdo num arquivo dart. Para entender cada uma, observe a figura a seguir.

</aside>

![Diagrama mostrando main.dart importando a biblioteca padrão Dart com import 'dart:io', a biblioteca do Flutter com import 'package:flutter/animation.dart', e bibliotecas próprias com import 'minha_biblioteca1.dart' (mesmo diretório) e import 'src/minha_biblioteca2.dart' (subdiretório de lib)](img/p006-1.webp)

*As três formas de import: bibliotecas padrão Dart, pacotes externos (como o flutter) e bibliotecas próprias.*

Assim, podemos importar bibliotecas do ambiente padrão dart, bibliotecas de pacotes externos - como o flutter - e bibliotecas próprias que criamos em qualquer diretório de nossa aplicação que seja subdiretório de **lib**.

Para utilizar componentes visuais do Flutter, vamos importar o pacote **material**.

<aside class="positive">

**Nota.** O pacote material traz a implementação da especificação conhecida como **Material Design**, do Google. Trata-se de um sistema de design com instruções para o desenvolvimento envolvendo UX, a implementação de componentes visuais, combinação de cores, feedback visual mediante interação do usuário etc. Para saber mais, visite [https://m3.material.io/](https://m3.material.io/).

</aside>

Veja o import. Estamos no arquivo **lib/main.dart**.

**lib/main.dart**

```dart
import 'package:flutter/material.dart';
```

A seguir, escrevemos a função main, como de costume.

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main(){

}
```

No momento, nosso objetivo é apenas exibir um componente textual. Vamos construir um Widget do tipo **MaterialApp**, para começar.

<aside class="positive">

**Nota.** O Widget MaterialApp se encarrega de realizar configurações básicas, como a possibilidade de **navegação entre diferentes telas**. Seu uso é bastante comum.

</aside>

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main(){
  var app = MaterialApp();
}
```

Observe que há uma sugestão de aplicar o modificador **const** à chamada do construtor. Isso acontece pois esse é um construtor que foi declarado como const. De maneira simplificada, isso quer dizer que ele constrói um objeto imutável. Quando aplicamos const à chamada de um construtor, o compilador nos entrega código otimizado.

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main(){
  var app = const MaterialApp();
}
```

Visite a documentação do Widget MaterialApp a seguir: [https://api.flutter.dev/flutter/material/MaterialApp-class.html](https://api.flutter.dev/flutter/material/MaterialApp-class.html).

Observe que seu construtor possui um parâmetro nomeado chamado **home**. Desejamos associar um novo Widget a esse parâmetro. Ele será exibido na região principal da tela. Neste momento, vamos apenas utilizar um Widget textual.

<aside class="positive">

**Nota.** Também poderíamos aplicar const à chamada do construtor Text. Isso seria redundante pelo fato de ele estar sendo utilizado como parâmetro de MaterialApp e por já termos aplicado const a esse construtor.

</aside>

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main(){
  var app = const MaterialApp(
    home: Text('Hello, Dart')
  );
}
```

## Formatação automática do código
Duration: 5:00

<aside class="positive">

**Nota.** Observe a forma como ajustamos o código no passo anterior. Salve o arquivo. É provável que ele seja reorganizado da seguinte forma.

</aside>

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main() {
  var app = const MaterialApp(home: Text('Hello, Dart'));
}
```

Se desejar evitar esse comportamento, você pode adicionar uma vírgula no final da definição do último componente. Observe.

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main() {
  var app = const MaterialApp(
    home: Text('Hello, Dart'),
  );
}
```

Salve o arquivo novamente e repare que o código permanece da forma como você deixou.

Se preferir, também é possível desabilitar esse funcionamento utilizando uma opção da extensão Dart, embora ela também envolva outros aspectos. No VS Code, clique **File >> Preferences >> Settings**. Clique **Extensions >> Dart >> Editor** e desmarque a opção **Dart: Enable SDK Formatter**.

![Tela de Settings do VS Code com Extensions, Dart e Editor destacados à esquerda e a opção Dart: Enable SDK Formatter destacada à direita](img/p011-1.webp)

*A opção Dart: Enable SDK Formatter nas configurações do VS Code.*

Observe, entretanto, que desmarcar esta opção envolve diversos outros tipos de ajustes feitos automaticamente e que estão de acordo com as recomendações oficiais Dart. Ainda nesta tela, clique **dart_style**. Se necessário, clique em **Open**. Leia algumas partes da página para entender as formatações que deixarão de ser realizadas caso desmarque essa opção.

Não tem certo ou errado. Você pode optar pela forma que preferir. Neste material, vamos optar por manter a opção habilitada e, quando desejado, colocar uma vírgula no final da definição de um componente para evitar o alinhamento que vimos.

## Executando com runApp
Duration: 6:00

Por enquanto, o código está assim.

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main() {
  var app = const MaterialApp(
    home: Text('Hello, Dart'),
  );
}
```

A simples definição da função main não é suficiente para que possamos colocar a aplicação em execução. Aplicações Flutter devem ser colocadas em execução de um jeito especial: utilizando uma função chamada **runApp**. Na função main, vamos chamar a função runApp entregando a ela o Widget "raiz" da aplicação.

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main() {
  var app = const MaterialApp(
    home: Text('Hello, Dart'),
  );
  runApp(app);
}
```

No VS Code, clique em **Terminal >> New Terminal** para abrir um terminal interno, caso ainda não possua um. Use

**Terminal**

```bash
flutter run
```

para executar a aplicação. No terminal, escolha a plataforma para execução digitando seu número associado. No exemplo a seguir, digitamos **2** para executar a aplicação no Google Chrome.

**Terminal**

```text
$ flutter run
Connected devices:
Linux (desktop) • linux  • linux-x64      • Ubuntu 22.04.3 LTS 6.2.0-26-generic
Chrome (web)    • chrome • web-javascript • Google Chrome 116.0.5845.96
[1]: Linux (linux)
[2]: Chrome (chrome)
Please choose one (or "q" to quit):
```

<aside class="positive">

**Nota.** É natural que este processo demore algo entre 30 segundos a 1 minuto. Ou talvez um pouco mais.

</aside>

A esperança é que uma aba do navegador seja aberta e que a aplicação seja exibida. Observe.

![Aba do Chrome em localhost exibindo o texto "Hello, Dart" grande, em vermelho, com sublinhado amarelo duplo e a faixa DEBUG no canto](img/p013-2.webp)

*O texto "Hello, Dart" exibido no navegador.*

Percebeu como o estilo do texto, incluindo as cores, não é lá dos melhores? Isso é de propósito. Veja o que a documentação da classe MaterialApp ([https://api.flutter.dev/flutter/material/MaterialApp-class.html](https://api.flutter.dev/flutter/material/MaterialApp-class.html)) fala sobre isso.

![Trecho da documentação de MaterialApp intitulado "Why is my app's text red with yellow underlines?", explicando que Text sem um ancestral Material é renderizado com esse estilo e que a correção típica é usar um Scaffold](img/p014-1.webp)

*A documentação explica o texto vermelho com sublinhado amarelo.*

A ideia é lembrar o desenvolvedor de fazer uso adequado de componentes que apliquem temas do Material Design.

## Hot reload, hot restart e full restart
Duration: 8:00

Conforme testamos nossa aplicação, estamos interessados em visualizar as modificações. Para isso, podemos usar as seguintes opções:

* **hot reload**: atualiza o trecho de código alterado direto na Dart VM e reconstrói a árvore de Widgets. Preserva o estado da aplicação. Não a atualiza executando novamente o método main. No terminal do VS Code em que você digitou `flutter run`, aperte a tecla **r** para utilizar.
* **hot restart**: atualiza o trecho de código alterado direto na Dart VM e reinicia a aplicação, o que faz com que o estado seja perdido. No terminal do VS Code em que você digitou `flutter run`, aperte **SHIFT + r** para utilizar.
* **full restart**: reinicia a aplicação completamente. Demora mais pois o código também é recompilado. Não há atalho no teclado. Basta encerrar o processo de execução da aplicação no terminal (**CTRL + C**) e executar novamente.

Faça um teste alterando o texto da aplicação e fazendo um hot reload logo a seguir. Testaremos outras situações ao longo do desenvolvimento.

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main() {
  var app = const MaterialApp(
    home: Text('Helloooo, Dart'),
  );
  runApp(app);
}
```

Lembre-se de apertar **r** no terminal em que executou o comando **flutter run**.

<aside class="negative">

**Nota.** Há casos em que o **hot reload e/ou o hot restart podem não funcionar**. Veja alguns exemplos da documentação (em inglês, no momento em que este material foi escrito):

* **An app is killed**: hot reload can break when the app is killed. For example, if the app was in the background for too long.
* **Compilation errors**: when a code change introduces a compilation error, hot reload generates an error message similar to the one below. In this situation, simply correct the errors on the specified lines of Dart code to keep using hot reload.
* **Enumerated types**: hot reload doesn't work when enumerated types are changed to regular classes or regular classes are changed to enumerated types.
* **Generic types**: hot reload won't work when generic type declarations are modified.
* **Native code**: if you've changed native code (such as Kotlin, Java, Swift, or Objective-C), you must perform a full restart (stop and restart the app) to see the changes take effect.

</aside>

Exemplo de mensagem de erro de compilação durante um hot reload:

**Terminal**

```text
Hot reload was rejected:
'/path/to/project/lib/main.dart': warning: line 16 pos 38: unbalanced '{' opens here
  Widget build(BuildContext context) {
                                     ^
'/path/to/project/lib/main.dart': error: line 33 pos 5: unbalanced ')'
    );
    ^
```

Exemplo de tipo enumerado. Antes da mudança:

```dart
enum Color {
  red,
  green,
  blue,
}
```

Depois da mudança (o hot reload não funciona):

```dart
class Color {
  Color(this.i, this.j);
  final int i;
  final int j;
}
```

Exemplo de tipo genérico. Antes da mudança:

```dart
class A<T> {
  T? i;
}
```

Depois da mudança (o hot reload não funciona):

```dart
class A<T, V> {
  T? i;
  V? v;
}
```

Para mais detalhes, visite [https://docs.flutter.dev/tools/hot-reload](https://docs.flutter.dev/tools/hot-reload).

## Usando um Widget Scaffold e parâmetros nomeados
Duration: 12:00

A fim de organizar a estrutura da aplicação, vamos fazer uso de um Widget chamado **Scaffold**. Veja a sua documentação: [https://api.flutter.dev/flutter/material/Scaffold-class.html](https://api.flutter.dev/flutter/material/Scaffold-class.html).

<aside class="positive">

**Nota.** "Scaffold" significa algo como "**esqueleto**" ou "**andaime**".

</aside>

O código dos exemplos da documentação pode envolver conceitos ainda não vistos neste momento. Não se preocupe com ele. Mas observe que um Scaffold permite especificarmos barras inferiores (**BottomAppBar**), botões flutuantes (**FloatingActionButton**) e assim por diante. Role a página até encontrar a parte que ilustra o construtor. A seguir, ilustramos dois exemplos de Widgets que podem ser entregues ao construtor de Scaffold.

![Documentação do construtor de Scaffold, com os parâmetros Widget? floatingActionButton e Widget? bottomNavigationBar destacados](img/p017-2.webp)

*Construtor de Scaffold: floatingActionButton e bottomNavigationBar.*

<aside class="positive">

**Nota.** O símbolo **?** que aparece colado ao tipo dos parâmetros indica que eles são opcionais.

</aside>

<aside class="positive">

**Nota.** Os parâmetros que se encontram entre `{ }` na lista de parâmetros do construtor são **parâmetros nomeados**. Eles são especificados na chamada do construtor assim: `ConstrutorQualquer(nomeDoParametro: objetoDesejado)`. Abra o [DartPad](https://dartpad.dev/) e faça o teste a seguir. **Não altere seu código no VS Code. Esse é apenas um teste no DartPad.**

</aside>

**DartPad**

```dart
//pode ser null
//e implicitamente é null, inicializado
//pelo compilador
void opcional({int? numero}){
  print(numero);
}

//assim não funciona pois int não pode ser null
//e o valor implícito é null
// void obrigatorio({int numero}){
// print(numero);
// }

void obrigatorio({int numero = 5}){
  print(numero);
}

void comParametrosSemNome(int semNome, {int? comNome}){
  print(semNome);
  print(comNome);
}

//não funciona
//nomeados (separados por { }) têm de aparecer depois
//de todos os sem nome
// void comParametrosSemNome(int? comNome}, int semNome){
// print(semNome);
// print(comNome);
// }

void main(){
  //exibe null
  opcional();
  //exibe 2
  opcional(numero: 2);
  //exibe 5
  obrigatorio();
  //exibe 10
  obrigatorio(numero: 10);
  //exibe 2 null
  comParametrosSemNome(2);
  //exibe 2 2
  comParametrosSemNome(2, comNome: 2);
}
```

<aside class="positive">

**Nota.** Não há sobrecarga de métodos/funções em Dart. Lembre-se que Dart é a linguagem de programação que estamos utilizando para programar com o Framework Flutter, que é escrito em Dart.

</aside>

<aside class="positive">

**Nota.** Observe que o primeiro parâmetro do construtor é do tipo **Key**. Esse parâmetro está associado à atualização de estado da aplicação, o que pode envolver a substituição de Widgets. Veja o que a documentação diz sobre a propriedade `key` (`Key? key`, final): *"Controls how one widget replaces another widget in the tree. If the runtimeType and key properties of the two widgets are operator==, respectively, then the new widget replaces the old widget by updating the underlying element (i.e., by calling Element.update with the new widget). Otherwise, the old element is removed from the tree, the new widget is inflated into an element, and the new element is inserted into the tree."* Leia mais em [https://api.flutter.dev/flutter/widgets/Widget/key.html](https://api.flutter.dev/flutter/widgets/Widget/key.html).

</aside>

### Exercício

Substitua o Widget Text por um Widget Scaffold da seguinte forma:

* Deve ser associado à propriedade **home** de MaterialApp.
* Deve ter um parâmetro nomeado **appBar** do tipo **AppBar**.
* Observe que o construtor de AppBar não é **const**. Remova const do construtor de MaterialApp.
* Faça hot reload e veja o resultado na tela. Você deverá ver uma barra superior.
* Faça push ao repositório Git.

<details><summary>Ver resposta</summary>

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main() {
  var app = MaterialApp(
    home: Scaffold(
      appBar: AppBar(),
    ),
  );
  runApp(app);
}
```

No navegador, o resultado deve ser o seguinte.

![Aplicação no Chrome exibindo apenas uma barra superior azul vazia](img/p021-1.webp)

*Scaffold com uma AppBar vazia.*

</details>

## Adicionando um título à AppBar
Duration: 6:00

Estudemos um pouco sobre o Widget **AppBar**. Sua documentação se encontra em [https://api.flutter.dev/flutter/material/AppBar-class.html](https://api.flutter.dev/flutter/material/AppBar-class.html). A figura a seguir, retirada da documentação, mostra o nome de Widgets importantes que podemos encaixar dentro de um AppBar. Veja também a lista de parâmetros de seu construtor na documentação.

![Diagrama da documentação de AppBar mostrando as regiões leading, title, actions, flexibleSpace e bottom](img/p021-2.webp)

*Regiões de uma AppBar: leading, title, actions, flexibleSpace e bottom.*

### Exercício

* Lendo a documentação de AppBar, descubra o nome do Widget que podemos utilizar para adicionar um título ao Widget AppBar. Adicione o título "Minhas Imagens".
* Faça hot reload e verifique o resultado no navegador.
* Faça push ao repositório Git.

<details><summary>Ver resposta</summary>

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main() {
  var app = MaterialApp(
    home: Scaffold(
      appBar: AppBar(
        title: const Text("Minhas Imagens"),
      ),
    ),
  );
  runApp(app);
}
```

</details>

## Funções em Dart
Duration: 10:00

A seguir, vamos lidar com um botão que, quando clicado, deve realizar uma tarefa. Essa tarefa é realizada por uma função. Por isso, vamos estudar um pouco sobre elas em Dart. Faça os seguintes exemplos no DartPad.

**DartPad**

```dart
void main(){
  final f1 = (){
    print('f1');
  };
  final f2 = (){
    print('f2');
    return "f2";
  };
  final f3 = () => print("f3");
  //parece uma função que pode ter várias linhas
  //mas é uma função que devolve um set ou map
  //delimitado por {}
  final f4 = () => {
    //esse print não vale pois {} não é o corpo de
    //uma função
    // print ("E agora?");
  };
  //devolve um Set com 1 e 2
  final f5 = () => {
    1, 2
  };
  //devolve um mapa com nome: 'Ana'
  final f6 = () => {
    'nome': 'Ana'
  };

  //sem inferência de tipo: funções são do tipo Function
  Function f7 = (){
    print('f7');
  };
  //funções podem receber funções
  final f8 = (f){
    print('f8');
    //chamando a função recebida
    f();
  };
  //com parâmetro
  final f9 = (int? a){
    print(a);
  };
  //f1 devolve null
  print(f1());
  //f2 devolve seu nome
  print(f2());
  //f3 devolve o que o print que ela chama
  //devolve. void neste caso
  //por isso, não podemos imprimir o retorno de f3
  //print(f3());
  //devolve um map vazio
  print(f4());
  //devolve um set com 1 e 2
  print(f5());
  //devolve um mapa com nome: Ana
  print(f6());
  //normal, mas sem inferência de tipo
  print(f7());
  //f8 recebe f1 e a coloca em execução
  print(f8(f1));
  //f8 recebe uma arrow function sem nome
  print(f8(() => print('oi')));
  //recebe 2 como parâmetro
  print(f9(2));
}
```

## FloatingActionButton e ícones
Duration: 12:00

### Exercício

* Lendo a documentação de **Scaffold**, descubra o nome do Widget que podemos utilizar para adicionar um botão flutuante ao Scaffold.
* Adicione um botão flutuante do tipo **FloatingActionButton**.
* Você terá obtido um erro, indicando que FloatingActionButton requer um parâmetro. Descubra qual é e corrija, lendo a documentação de FloatingActionButton: [https://api.flutter.dev/flutter/material/FloatingActionButton-class.html](https://api.flutter.dev/flutter/material/FloatingActionButton-class.html).
* Faça um hot reload e veja a saída no terminal e no console do navegador (Chrome Dev Tools: **CTRL + SHIFT + I**).
* Faça push ao repositório Git.

<details><summary>Ver resposta</summary>

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main() {
  var app = MaterialApp(
    home: Scaffold(
      appBar: AppBar(
        title: const Text("Minhas Imagens"),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          print("Hello!");
        },
      ),
    ),
  );
  runApp(app);
}
```

No navegador, o resultado esperado é o seguinte.

![Aplicação com a barra superior azul "Minhas Imagens" e um botão flutuante redondo, sem conteúdo, no canto inferior direito](img/p025-1.webp)

*O FloatingActionButton ainda sem conteúdo.*

</details>

O botão ainda não exibe conteúdo algum. Precisamos descobrir como fazê-lo mostrar algo. Talvez um símbolo "+" neste caso. Para tal, vamos inspecionar a sua documentação uma vez mais: [https://api.flutter.dev/flutter/material/FloatingActionButton-class.html](https://api.flutter.dev/flutter/material/FloatingActionButton-class.html).

Para exibir o conteúdo textual, vamos tentar fazer uso do parâmetro nomeado **child**.

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main() {
  var app = MaterialApp(
    home: Scaffold(
      appBar: AppBar(
        title: const Text("Minhas Imagens"),
      ),
      floatingActionButton: FloatingActionButton(
        child: const Text("+"),
        onPressed: () {
          print("Hello!");
        },
      ),
    ),
  );
  runApp(app);
}
```

Embora funcione, o resultado visual mostra um símbolo "+" muito pequeno.

![Aplicação com o botão flutuante exibindo um sinal de mais muito pequeno](img/p026-2.webp)

*O "+" como texto fica pequeno demais.*

Ocorre que não estamos exibindo o ícone "+" corretamente. Ele é um **ícone**, não apenas um texto. Precisamos encontrar o mecanismo apropriado para fazer a sua exibição. Ela pode ser feita usando a classe **Icon**.

### Exercício

* Estude a documentação da classe Icon e descubra como exibir o ícone "+": [https://api.flutter.dev/flutter/widgets/Icon-class.html](https://api.flutter.dev/flutter/widgets/Icon-class.html).

<aside class="positive">

**Dica.** Neste caso, vamos fazer uso de um parâmetro não nomeado.

</aside>

<aside class="positive">

**Dica.** Tente passar uma constante da classe **Icons** ao construtor da classe **Icon**. Para isso, estude também a documentação da classe Icons: [https://api.flutter.dev/flutter/material/Icons-class.html](https://api.flutter.dev/flutter/material/Icons-class.html).

</aside>

* Faça hot reload e veja o resultado no navegador.
* Faça push ao repositório Git.

<details><summary>Ver resposta</summary>

**lib/main.dart**

```dart
import 'package:flutter/material.dart';

void main() {
  var app = MaterialApp(
    home: Scaffold(
      appBar: AppBar(
        title: const Text("Minhas Imagens"),
      ),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () {
          print("Hello!");
        },
      ),
    ),
  );
  runApp(app);
}
```

O resultado no navegador é o seguinte.

![Aplicação com a barra "Minhas Imagens" e o botão flutuante exibindo o ícone de adição](img/p028-1.webp)

*O botão flutuante com o ícone Icons.add.*

</details>

## Criando um Widget Stateless
Duration: 15:00

Observe que a aplicação inteira está definida em um único arquivo. Claro, esse é um aspecto muito ruim para qualquer ambiente de desenvolvimento de software. Por isso, vamos criar um Widget próprio nosso, com a finalidade de isolar toda a definição que fizemos até então. Este é um bom momento para estudarmos os diferentes tipos de Widgets em Flutter.

> **Widget**
>
> Um Widget é uma descrição imutável de parte de uma interface gráfica. Documentação: [https://api.flutter.dev/flutter/widgets/Widget-class.html](https://api.flutter.dev/flutter/widgets/Widget-class.html)

> **StatelessWidget**
>
> Descreve parte de uma interface gráfica utilizando outros Widgets. "Sem estado" significa que aquilo que ele exibe depende apenas de sua configuração própria e do objeto BuildContext que recebe no método build. Documentação: [https://api.flutter.dev/flutter/widgets/StatelessWidget-class.html](https://api.flutter.dev/flutter/widgets/StatelessWidget-class.html)

> **StatefulWidget**
>
> Descreve parte de uma interface gráfica utilizando outros Widgets. "Com estado" significa que aquilo que ele exibe depende de informações que podem ser obtidas externamente quando ele é construído e que também podem ser alteradas enquanto ele está sendo exibido. Documentação: [https://api.flutter.dev/flutter/widgets/StatefulWidget-class.html](https://api.flutter.dev/flutter/widgets/StatefulWidget-class.html)

Veja a hierarquia de classes.

![Diagrama da hierarquia de classes: Widget no topo, com StatelessWidget e StatefulWidget como subclasses, cada um acompanhado de sua descrição](img/p030-2.webp)

*Hierarquia de classes: StatelessWidget e StatefulWidget herdam de Widget.*

### Exercício

* Crie uma subpasta de **lib** chamada **src**.
* Crie um arquivo chamado **app.dart** na pasta **src**.
* No arquivo **app.dart**, importe a biblioteca material do Flutter.
* No arquivo **app.dart**, crie uma classe chamada **App** e faça com que ela herde de **StatelessWidget**.

<aside class="positive">

**Dica.** O operador de herança em Dart é o **extends**.

</aside>

* Escreva um método chamado **build** cujo tipo de retorno é **Widget**. Ele deve receber um parâmetro do tipo **BuildContext**.
* Recorte o conteúdo do arquivo **main.dart**, a partir da definição de **MaterialApp**, e cole no método build, fazendo com que ele devolva o Widget MaterialApp. No arquivo **main.dart**, mantenha a declaração da variável app sem nada atribuído a ela neste momento.
* Faça o método print exibir outro texto, algo como "Estou no arquivo app.dart".
* Salve o arquivo **app.dart** para que o código seja indentado automaticamente.
* No arquivo **main.dart**, importe o arquivo app.dart.
* Construa uma instância de App no arquivo **main.dart** e faça com que a variável app a referencie.
* Faça hot reload e confira o resultado, clicando no FloatingActionButton.
* Faça push ao repositório Git.

<details><summary>Ver resposta</summary>

![Explorer do VS Code com lib/src/app.dart e lib/main.dart destacados](img/p031-1.webp)

*O novo arquivo lib/src/app.dart.*

No arquivo **app.dart**, a definição inicial fica assim.

**lib/src/app.dart**

```dart
import 'package:flutter/material.dart';

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {

  }
}
```

Depois disso, o método build passa a devolver o Widget MaterialApp outrora definido no arquivo main.dart. Recorte a sua definição do arquivo **main.dart** e cole no arquivo **app.dart**.

**lib/src/app.dart**

```dart
import 'package:flutter/material.dart';

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text("Minhas Imagens"),
        ),
        floatingActionButton: FloatingActionButton(
          child: const Icon(Icons.add),
          onPressed: () {
            print("Estou no arquivo app.dart!");
          },
        ),
      ),
    );
  }
}
```

No arquivo **main.dart**, importamos e passamos a utilizar o novo Widget.

**lib/main.dart**

```dart
import 'package:flutter/material.dart';
import 'src/app.dart';

void main() {
  var app = App();
  runApp(app);
}
```

</details>

Aperte **SHIFT + R** no terminal em que executou `flutter run`. Clique no FloatingActionButton e veja se funcionou. Veja o resultado esperado.

![Aplicação no Chrome com o Dev Tools aberto na aba Console, mostrando a mensagem "Estou no arquivo app.dart!"](img/p033-1.webp)

*A mensagem do print aparece no console do navegador.*

### A árvore de Widgets

A interface gráfica de uma aplicação Flutter é representada por uma **árvore de Widgets**. Veja a árvore que temos até este momento.

![Árvore de Widgets: App no topo, abaixo MaterialApp, abaixo Scaffold, que tem como filhos FloatingActionButton (com filho Icon) e AppBar (com filho Text)](img/p034-1.webp)

*A árvore de Widgets da aplicação até aqui.*

## Estado: utilizando um StatefulWidget
Duration: 15:00

Vamos ajustar a aplicação para que ela exiba o número de imagens exibidas, além das próprias imagens. Essa é uma informação que, evidentemente, será atualizada sempre que o usuário clicar no botão para adicionar nova imagem. Ela faz parte do **estado** do Widget. Por isso, vamos precisar de um Widget com estado. Assim, vamos refatorar a aplicação, deixando de utilizar um **StatelessWidget** e passando a utilizar um **StatefulWidget**.

A refatoração envolve os seguintes passos.

* Escrever duas classes: uma representa o estado da aplicação e a outra representa o Widget.
* A classe que representa o Widget deve possuir um método chamado **createState**. Ele devolve uma instância da classe que representa o estado do Widget.
* A classe que representa o estado da aplicação deve possuir um método chamado **build** que devolve a descrição do Widget de interesse.
* A classe que representa o estado da aplicação deve possuir variáveis de instância. Cada uma representa uma "fatia" do estado de interesse.
* Quando os dados forem alterados, ou seja, quando o usuário clicar no botão, vamos chamar o método **setState**.

### Exercício

* No arquivo **app.dart**, renomeie a classe **App** para **AppState**.
* No arquivo **app.dart**, crie uma classe chamada **App** que herda de **StatefulWidget**.
* Faça com que a classe **AppState** herde de **State&lt;App&gt;**. Repare no generics.
* Defina um método chamado **createState** na classe **App**. Seu tipo de retorno deve ser **State&lt;App&gt;**. Ele não recebe coisa alguma como parâmetro. Ele deve devolver uma instância de **AppState**.
* Adicione um inteiro como variável de instância à classe **AppState**. Ela deve se chamar **numeroImagens** e deve ser inicializada com zero.
* Quando o usuário clicar no botão, incremente o contador de imagens.
* Chame o método **setState** depois de incrementar. Passe como parâmetro uma arrow function. Ela deve incrementar o contador. Assim, deixe de incrementá-lo como havia feito anteriormente e apenas incremente na função entregue a setState.
* Estude a documentação de Scaffold e descubra como exibir um "corpo": [https://api.flutter.dev/flutter/material/Scaffold-class.html](https://api.flutter.dev/flutter/material/Scaffold-class.html).
* Use a propriedade encontrada como parâmetro nomeado de Scaffold. Associe a ela um Widget Text. Seu conteúdo deve ser o contador de imagens. Utilize interpolação para exibir seu valor.
* Faça push ao repositório Git.

<details><summary>Ver resposta</summary>

Clique algumas vezes no botão para testar.

![Aplicação "Minhas Imagens" com o Dev Tools aberto, depois de alguns cliques no botão flutuante](img/p036-1.webp)

*Testando o contador com cliques no botão.*

Primeiro renomeamos a classe **App**.

**lib/src/app.dart**

```dart
import 'package:flutter/material.dart';

class AppState extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    ...
```

Depois disso, criamos uma classe chamada **App** que herda de **StatefulWidget**. Ela possui o método **createState**. Ele devolve uma instância de AppState. Para tal, precisamos fazer com que AppState passe a herdar de **State&lt;App&gt;**.

**lib/src/app.dart**

```dart
import 'package:flutter/material.dart';

class App extends StatefulWidget {
  @override
  State<App> createState() {
    return AppState();
  }
}

class AppState extends State<App> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      ...
```

A seguir, adicionamos o contador de imagens à classe AppState.

**lib/src/app.dart**

```dart
...
class AppState extends State<App> {
  int numeroImagens = 0;
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      ...
```

Atualizamos o contador. Num primeiro momento, direto na função que é chamada quando o usuário clica no botão.

**lib/src/app.dart**

```dart
...
floatingActionButton: FloatingActionButton(
  child: const Icon(Icons.add),
  onPressed: () {
    numeroImagens++;
    print("Estou no arquivo app.dart!");
  },
),
...
```

Chamamos o método **setState** quando o usuário clicar no botão. Ele recebe uma função e incrementa o contador de imagens. O incremento passa a ser feito apenas ali. Também podemos remover a instrução print, que estávamos utilizando apenas para um teste inicial.

**lib/src/app.dart**

```dart
...
floatingActionButton: FloatingActionButton(
  child: const Icon(Icons.add),
  onPressed: () {
    setState(() => numeroImagens++);
  },
),
...
```

Adicionamos o parâmetro **body** ao Scaffold e a ele associamos uma instância de Text. Como parâmetro, ela recebe o número de imagens. Repare na interpolação.

**lib/src/app.dart**

```dart
...
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text("Minhas Imagens"),
        ),
        floatingActionButton: FloatingActionButton(
          child: const Icon(Icons.add),
          onPressed: () {
            setState(() => numeroImagens++);
          },
        ),
        body: Text('$numeroImagens'), //parâmetro entregue ao construtor de Scaffold
      ),
    );
  }
...
```

</details>

## Obtenção de imagens: Pexels
Duration: 5:00

Vamos obter imagens a partir do site **Pexels**. Para isso, comece acessando a sua página inicial e criando uma conta para você: [https://www.pexels.com/](https://www.pexels.com/).

O acesso ao conteúdo de Pexels é gratuito. Porém, há alguns limites para acessos realizados por meio de requisições direcionadas à sua API. Segundo a sua documentação, que pode ser acessada a partir do link a seguir, o limite atual é

* 200 requisições por hora
* 20000 requisições por mês

É possível entrar em contato com o suporte e solicitar um aumento gratuito. Basta apresentar razões e exemplos concretos. Se for de interesse da Pexels, você pode até mesmo obter acesso ilimitado. Documentação: [https://www.pexels.com/api/documentation/](https://www.pexels.com/api/documentation/).

Depois de criar a conta e fazer login, clique no seu avatar no canto superior direito e escolha **Image & Video API**.

![Menu do avatar no site da Pexels com a opção Image & Video API destacada](img/p040-1.webp)

*A opção Image & Video API no menu do avatar.*

Clique em **Your API Key** para visualizar a sua chave de API.

![Página "Start building with the power of Pexels" com o botão Your API Key](img/p040-2.webp)

*Página da API da Pexels com o botão Your API Key.*

## Trabalhando com objetos JSON
Duration: 12:00

**JSON** significa Javascript Object Notation. É uma notação bastante utilizada para a representação de dados que precisam ser enviados e recebidos por aplicações distintas, eventualmente escritas em diferentes linguagens de programação. Veja a sua especificação oficial: [https://www.json.org/json-en.html](https://www.json.org/json-en.html). Visite a página e estude os grafos sintáticos.

Veja alguns exemplos práticos.

Uma pessoa se chama Ana e tem 22 anos.

```json
{
  "nome": "Ana",
  "idade": 22
}
```

Uma pessoa se chama João, tem 30 anos e mora na Rua B, número 10, Vila J.

```json
{
  "nome": "João",
  "idade": 30,
  "endereco": {
    "logradouro": "Rua B",
    "numero": 10,
    "bairro": "Vila J"
  }
}
```

Uma coleção de pessoas. Cada pessoa tem apenas nome.

```json
[
  "Ana",
  "João",
  "Pedro"
]
```

Uma coleção de pessoas. Cada pessoa tem nome e idade.

```json
[
  {
    "nome": "Ana",
    "idade": 22
  },
  {
    "nome": "Pedro",
    "idade": 28
  }
]
```

Agora as pessoas são alunos de uma escola. A escola tem um nome.

```json
{
  "nome": "Escola A",
  "alunos": [
    {
      "nome": "Ana",
      "idade": 22
    },
    {
      "nome": "Pedro",
      "idade": 28
    }
  ]
}
```

### Exercício

Represente o seguinte com JSON. Uma concessionária tem um CNPJ e duas filiais. Cada filial tem nome, endereço (logradouro, numero e bairro) e uma coleção de veículos. Cada veículo tem modelo, placa e marca. Cada filial tem dois veículos.

<details><summary>Ver resposta</summary>

Os comentários `// filial 1` e `// filial 2` estão ali apenas para facilitar a leitura; JSON não admite comentários.

```text
{
  "cnpj": "123456789/0001",
  "filiais": [
    // filial 1
    {
      "nome": "Filial 1",
      "endereco": {
        "logradouro": "Rua A",
        "numero": 100,
        "bairro": "Vila A"
      },
      "veiculos": [
        {
          "modelo": "Gol",
          "marca": "VW",
          "placa": "ABC-1234"
        },
        {
          "modelo": "Celta",
          "marca": "Chevrolet",
          "placa": "DEF-5544"
        }
      ]
    },
    // filial 2
    {
      "nome": "Filial 2",
      "endereco": {
        "logradouro": "Rua B",
        "numero": 100,
        "bairro": "Vila B"
      },
      "veiculos": [
        {
          "modelo": "Corsa",
          "marca": "Chevrolet",
          "placa": "ERF-1122"
        },
        {
          "modelo": "Fusca",
          "marca": "VW",
          "placa": "DEF-1111"
        }
      ]
    }
  ]
}
```

</details>

## Manipulando JSON com Dart
Duration: 15:00

Nesta seção, vamos abrir uma instância do DartPad para aprender como podemos manipular objetos JSON em Dart. Lembre-se que o DartPad está disponível em [https://dartpad.dev/](https://dartpad.dev/).

Comece escrevendo uma função main. Ela define um JSON que representa uma pessoa.

**DartPad**

```dart
import 'dart:convert';

void main() {
  var pessoaJson = '{"nome": "Ana", "idade": 18}';
}
```

Observe que um JSON é uma criatura puramente textual. Se desejarmos extrair alguma informação a respeito da pessoa, como seu nome, teremos de aplicar algoritmos de manipulação de strings, o que pode ser muito repetitivo e trabalhoso. Seria muito mais prático se pudéssemos utilizar uma instrução como "me dê o valor associado à chave nome". De fato, podemos. Utilizando **mapas**. Para isso, basta convertermos o objeto JSON para uma estrutura do tipo mapa. Essa é uma operação muito comum em muitas linguagens de programação.

Em Dart, podemos fazê-lo utilizando o pacote **dart:convert**. Ele oferece um objeto chamado **json** e, por meio dele, acessamos o método **decode**. Ele recebe um JSON e devolve um mapa. Veja.

**DartPad**

```dart
import 'dart:convert';

void main() {
  var pessoaJson = '{"nome": "Ana", "idade": 18}';
  var pessoa = json.decode(pessoaJson);
  print(pessoa);
  //_JsonMap
  print(pessoa.runtimeType);
  print(pessoa['nome']);
  print(pessoa['idade']);
}
```

O mesmo vale para coleções. Observe como podemos iterar sobre elas com um **for each** e também com um **for "regular"**.

**DartPad**

```dart
import 'dart:convert';

void main() {
  var pessoaJson = '{"nome": "Ana", "idade": 18}';
  var pessoa = json.decode(pessoaJson);
  print(pessoa);
  //_JsonMap
  print(pessoa.runtimeType);
  print(pessoa['nome']);
  print(pessoa['idade']);
  var veiculosJson = '''[
    {
      "marca": "VW",
      "modelo": "Gol"
    },
    {
      "marca": "Chevrolet",
      "modelo": "Fusca"
    }
  ]''';
  var veiculos = json.decode(veiculosJson);
  print(veiculos);
  //_JSArray<dynamic>
  print(veiculos.runtimeType);
  for (final veiculo in veiculos) {
    print(veiculo);
    print(veiculo['marca']);
    print(veiculo['modelo']);
  }
  for (var i = 0; i < veiculos.length; i++) {
    print(veiculos[i]);
  }
}
```

### Exercício

Neste exercício, vamos utilizar o objeto "concessionária" previamente ilustrado. Por isso, copie a sua definição para o DartPad, fazendo os ajustes necessários.

* Adicione um preço a cada veículo de cada filial.
* Calcule e mostre o preço médio dos veículos, por filial.
* Calcule e mostre o preço médio dos veículos da concessionária como um todo. Mostre também o total de veículos da concessionária.

<details><summary>Ver resposta</summary>

**DartPad**

```dart
import 'dart:convert';

void main(){
  var concessionariaJSON = '''{
  "cnpj": "123456789/0001",
  "filiais": [
    {
      "nome": "Filial 1",
      "endereco": {
        "logradouro": "Rua A",
        "numero": 100,
        "bairro": "Vila A"
      },
      "veiculos": [
        {
          "modelo": "Gol",
          "marca": "VW",
          "placa": "ABC-1234",
          "preco": 20000
        },
        {
          "modelo": "Celta",
          "marca": "Chevrolet",
          "placa": "DEF-5544",
          "preco": 17000
        }
      ]
    },
    {
      "nome": "Filial 2",
      "endereco": {
        "logradouro": "Rua B",
        "numero": 100,
        "bairro": "Vila B"
      },
      "veiculos": [
        {
          "modelo": "Corsa",
          "marca": "Chevrolet",
          "placa": "ERF-1122",
          "preco": 12000
        },
        {
          "modelo": "Fusca",
          "marca": "VW",
          "placa": "DEF-1111",
          "preco": 15000
        }
      ]
    }
  ]
  }''';

  var concessionaria = json.decode(concessionariaJSON);
  print(concessionaria.runtimeType);
  var filiais = concessionaria['filiais'];
  print(filiais.runtimeType);
  double mediaTotal = 0;
  int totalVeiculos = 0;
  for (final filial in filiais){
    var veiculos = filial['veiculos'];
    double media = 0;
    for (final veiculo in veiculos){
      media += veiculo['preco'];
      mediaTotal += veiculo['preco'];
      totalVeiculos++;
    }
    print('Filial ${filial['nome']}: ${media/veiculos.length}');
  }
  print('Média total: ${mediaTotal / totalVeiculos }');
  print('Total de veículos: ${totalVeiculos}');
}
```

</details>

## Classes de modelo e construtores nomeados
Duration: 12:00

Os valores contidos na estrutura que a função decode nos entrega têm tipo conhecido somente em tempo de execução (**dynamic**). Podemos deixar o código mais seguro e previsível convertendo essa estrutura para uma **classe de modelo**. Esta classe contém os campos desejados e eles são definidos utilizando-se o sistema de tipos estático da linguagem.

No DartPad, volte para o seguinte modelo simples.

**DartPad**

```dart
import 'dart:convert';

void main(){
  var pessoaJson = '{"nome": "Ana", "idade": 18}';
}
```

Depois disso, escrevemos uma classe de Modelo. Ela tem as propriedades de interesse e um construtor.

**DartPad**

```dart
import 'dart:convert';

void main(){
  var pessoaJson = '{"nome": "Ana", "idade": 18}';
}

class PessoaModel {
  String nome;
  int idade;
  //construtor
  PessoaModel(this.nome, this.idade);
}
```

Por fim, fazemos a conversão com o método decode e construímos um objeto de modelo. O que ganhamos essencialmente foi o uso do sistema de tipos estático e, portanto, o suporte do compilador.

**DartPad**

```dart
import 'dart:convert';

void main(){
  var pessoaJson = '{"nome": "Ana", "idade": 18}';
  var pessoaDecoded = json.decode(pessoaJson);
  var pessoa = PessoaModel(
    pessoaDecoded['nome'],
    pessoaDecoded['idade']
  );
  //agora podemos acessar assim:
  print(pessoa.nome);
  print(pessoa.idade);
}

class PessoaModel {
  String nome;
  int idade;
  //construtor
  PessoaModel(this.nome, this.idade);
}
```

### Construtores nomeados

Nesta seção, vamos definir um **construtor nomeado**. Ele terá as seguintes propriedades:

* receberá o objeto JSON produzido pela função decode.
* devolverá um objeto construído a partir da classe de Modelo, já com os campos preenchidos.

O objetivo é isolar e escrever uma única vez o seguinte trecho:

**DartPad**

```dart
//não altere nada, apenas observe
var pessoa = PessoaModel(
  pessoaDecoded['nome'],
  pessoaDecoded['idade']
);
```

O trecho citado incomoda pois pode se tornar muito grande e repetitivo caso o objeto envolvido possua muitas propriedades.

Começamos definindo o construtor nomeado.

**DartPad**

```dart
...
class PessoaModel {
  String nome;
  int idade;
  //construtor
  PessoaModel(this.nome, this.idade);
  //construtor nomeado
  PessoaModel.fromJSON(decodedJSON){
    nome = decodedJSON['nome'];
    idade = decodedJSON['idade'];
  }
}
```

Observe que o código causa um erro.

![Editor mostrando o construtor nomeado PessoaModel.fromJSON sublinhado com o erro "Non-nullable instance field 'nome'..."](img/p050-1.webp)

*Erro: campo não anulável não inicializado.*

Ocorre que, quando o construtor nomeado entra em execução, o ambiente Dart já espera que os campos tenham sido inicializados. Podemos ajustar marcando-os como opcionais ou "prometendo" que eles terão sido inicializados posteriormente, antes de serem acessados. Escolhamos a segunda opção. Para isso, marcamos as variáveis com **late**.

**DartPad**

```dart
...
class PessoaModel {
  late String nome;
  late int idade;
  //construtor
  PessoaModel(this.nome, this.idade);
  //construtor nomeado
  PessoaModel.fromJSON(decodedJSON){
    nome = decodedJSON['nome'];
    idade = decodedJSON['idade'];
  }
}
```

Passamos a construir o objeto assim.

**DartPad**

```dart
import 'dart:convert';

void main() {
  var pessoaJson = '{"nome": "Ana", "idade": 18}';
  var pessoaDecoded = json.decode(pessoaJson);
  var pessoa = PessoaModel.fromJSON(pessoaDecoded);
  //agora podemos acessar assim:
  print(pessoa.nome);
  print(pessoa.idade);
}

class PessoaModel {
  late String nome;
  late int idade;
  //construtor
  PessoaModel(this.nome, this.idade);
  //construtor nomeado
  PessoaModel.fromJSON(decodedJSON){
    nome = decodedJSON['nome'];
    idade = decodedJSON['idade'];
  }
}
```

## Modelo para a imagem
Duration: 10:00

De volta ao projeto, vamos criar uma classe de modelo para as imagens que a Pexels nos entregará. Veja um exemplo (trecho) de JSON que ela nos entrega.

```json
{
  "page": 1,
  "per_page": 1,
  "photos": [
    {
      "id": 5637733,
      "width": 3840,
      "height": 5760,
      "url": "https://www.pexels.com/photo/man-in-yellow-jacket-and-black-pants-walking-on-sidewalk-5637733/",
      "photographer": "RDNE Stock project",
      "photographer_url": "https://www.pexels.com/@rdne",
      "photographer_id": 3149039,
      "avg_color": "#ADA9A4",
      "src": {
        "original": "https://images.pexels.com/photos/5637733/pexels-photo-5637733.jpeg",
        "large2x": "https://images.pexels.com/photos/5637733/pexels-photo-5637733.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "large": "https://images.pexels.com/photos/5637733/pexels-photo-5637733.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        "medium": "https://images.pexels.com/photos/5637733/pexels-photo-5637733.jpeg?auto=compress&cs=tinysrgb&h=350",
        "small": "https://images.pexels.com/photos/5637733/pexels-photo-5637733.jpeg?auto=compress&cs=tinysrgb&h=130",
        "portrait": "https://images.pexels.com/photos/5637733/pexels-photo-5637733.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        "landscape": "https://images.pexels.com/photos/5637733/pexels-photo-5637733.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        "tiny": "https://images.pexels.com/photos/5637733/pexels-photo-5637733.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
      },
      "liked": false,
      "alt": "Man in Yellow Jacket and Black Pants Walking on Sidewalk"
    }
  ],
  "total_results": 8000,
  "next_page": "https://api.pexels.com/v1/search/?page=2&per_page=1&query=people"
}
```

Observe que o resultado possui uma coleção chamada **photos**. Cada posição contém uma foto. Cada foto tem algumas propriedades, como:

* **url**: endereço dela que nos leva para uma página do site Pexels. Não é esse que desejamos.
* **src**: um JSON com propriedades como original, large2x, medium, small etc. É daí que escolheremos a URL a utilizar na aplicação. A foto é sempre a mesma, o que muda é o tamanho.
* **alt**: é uma descrição textual da foto.

Entre outras propriedades. Inspecione o resultado para conhecer mais.

Para criar o modelo de imagem, crie uma pasta chamada **models** na pasta **src** de seu projeto. A seguir, crie um arquivo chamado **image_model.dart**. Observe.

![Explorer do VS Code com lib/src/models/image_model.dart destacado](img/p053-1.webp)

*O arquivo lib/src/models/image_model.dart.*

Digamos que o modelo, a princípio, tem as seguintes propriedades: url e alt.

### Exercício

Escreva a classe de modelo com url e alt, considerando a estrutura do objeto devolvido pela Pexels.

<details><summary>Ver resposta</summary>

**lib/src/models/image_model.dart**

```dart
class ImageModel {
  late String url;
  late String alt;

  ImageModel(this.url, this.alt);

  ImageModel.fromJSON(Map<String, dynamic> decodedJSON) {
    //o resultado tem uma coleção de fotos
    //vamos pegar sempre a primeira
    //por isso, posição zero
    //dela, pegamos o tamanho médio (propriedade do objeto src)
    url = decodedJSON['photos'][0]['src']['medium'];
    alt = decodedJSON['photos'][0]['alt'];
  }
}
```

</details>

<aside class="positive">

**Nota.** Há uma outra forma de definição do corpo de um construtor (lista de inicialização). Veja. Neste material, entretanto, vamos manter a primeira forma.

</aside>

```dart
class ImageModel {
  late String url;
  late String alt;

  ImageModel(this.url, this.alt);

  // ImageModel.fromJSON(Map <String, dynamic> decodedJSON) {
  //   //o resultado tem uma coleção de fotos
  //   //vamos pegar sempre a primeira
  //   //por isso, posição zero
  //   //dela, pegamos o tamanho médio (propriedade do objeto src)
  //   url = decodedJSON['photos'][0]['src']['medium'];
  //   alt = decodedJSON['photos'][0]['alt'];
  // }

  ImageModel.fromJSON(Map <String, dynamic> decodedJSON)
    : url = decodedJSON['photos'][0]['src']['medium'],
      alt = decodedJSON['photos'][0]['alt'];
}
```

## Requisição HTTP: a função obterImagem e o pacote http
Duration: 12:00

Quando o usuário clicar no botão, desejamos disparar uma requisição HTTP direcionada aos servidores da Pexels a fim de obter uma imagem. Para isso, vamos escrever uma função que tem essa responsabilidade. Estamos no arquivo **app.dart**.

**lib/src/app.dart**

```dart
...
class AppState extends State<App> {
  int numeroImagens = 0;

  void obterImagem(){

  }

  @override
  Widget build(BuildContext context) {
  ...
```

A seguir, na função associada ao parâmetro **onPressed** do FloatingActionButton, vamos deixar de atualizar o estado e chamar a função criada.

**lib/src/app.dart**

```dart
...
floatingActionButton: FloatingActionButton(
  child: const Icon(Icons.add),
  onPressed: () {
    obterImagem();
  },
),
...
```

Observe que, agora, temos a especificação de uma função que não faz nada além de chamar outra. Assim, podemos especificar apenas o nome da função interna. Veja.

**lib/src/app.dart**

```dart
...
floatingActionButton: FloatingActionButton(
  child: const Icon(Icons.add),
  onPressed: obterImagem,
),
...
```

<aside class="negative">

**Cuidado.** Especificar apenas o nome da função significa deixá-la associada ao parâmetro nomeado no sentido de que ela deve ser chamada quando o evento envolvido acontecer. Isso é completamente diferente de chamá-la explicitamente, como no trecho abaixo. Em Dart, isso é um erro em tempo de compilação, pois a nossa função devolve "void". Assim que o método build é chamado, ela também é chamada (ao invés de apenas ser chamada quando o evento de clique no botão acontecer) e, assim, estamos tentando associar "void" ao parâmetro onPressed. É claro, não podemos fazer isso. Em outros ambientes, como no React, esse é um erro comum que faz com que a função seja chamada assim que o componente aparece na tela. Em geral, isso faz com que a tela seja atualizada e a função seja chamada de novo, causando uma recursão infinita.

</aside>

```dart
floatingActionButton: FloatingActionButton(
  child: const Icon(Icons.add),
  onPressed: obterImagem(), //errado, não faça isso
),
```

Para realizar as requisições HTTP, vamos utilizar o pacote **http**. O primeiro passo é fazer a sua instalação. Num terminal vinculado à raiz da aplicação, execute

**Terminal**

```bash
flutter pub add http
```

Investigue a seção **dependencies** de seu arquivo **pubspec.yaml**. A nova dependência deve ter sido adicionada ali.

**pubspec.yaml**

```yaml
dependencies:
  flutter:
    sdk: flutter


  # The following adds the Cupertino Icons font to your application.
  # Use with the CupertinoIcons class for iOS style icons.
  cupertino_icons: ^1.0.2
  http: ^1.1.0
```

Visite também a documentação do pacote para conhecer mais sobre ele: [https://pub.dev/packages/http](https://pub.dev/packages/http).

O próximo passo é importar o pacote no arquivo **app.dart**.

**lib/src/app.dart**

```dart
import 'package:flutter/material.dart';
import 'package:http/http.dart';
...
```

O import que fizemos foi "sem nome". Assim, as funções do pacote podem ser acessadas diretamente, sem qualificação. Veja como falamos **get** diretamente no código a seguir, sem qualificação.

**lib/src/app.dart**

```dart
...
void obterImagem() {
  get(Uri.parse(''));
}
...
```

Também podemos dar um nome ao pacote. Assim, o acesso a suas funções precisa ser qualificado. Observe.

**lib/src/app.dart**

```dart
...
import 'package:http/http.dart' as http;
...
void obterImagem() {
  http.get(Uri.parse(''));
}
...
```

<aside class="positive">

**Nota.** Há também as construções **show** e **hide**, que também podem ser envolvidas numa instrução import. A documentação em [https://dart.dev/language/libraries](https://dart.dev/language/libraries) explica isso. Além disso, há um mecanismo conhecido como **lazy loading**. Quando utilizado, a aplicação apenas importa a biblioteca quando ela é utilizada. Observe que ele funciona apenas na **web**. Visite sempre a documentação a fim de obter informações mais atualizadas.

</aside>

Neste material, vamos manter o import com nome e acesso qualificado.

**lib/src/app.dart**

```dart
...
import 'package:http/http.dart' as http;
...
void obterImagem() {
  http.get(Uri.parse(''));
}
...
```

## URL da Pexels e seus parâmetros
Duration: 10:00

A URL de acesso à Pexels é a seguinte.

```text
https://api.pexels.com/v1/search
```

Para especificar o assunto da foto que desejamos, utilizamos o parâmetro **query**. Fica assim:

```text
https://api.pexels.com/v1/search?query=people
```

Além disso, os resultados que a Pexels nos entrega são **paginados**. Isso funciona da seguinte forma:

* Uma consulta por **people** pode resultar numa coleção muito grande de resultados, contendo milhares ou milhões de fotos.
* Na primeira resposta, a Pexels nos entrega apenas uma quantidade pequena de fotos, digamos 15. Além disso, ela nos diz que estamos na "página 1".
* Na próxima requisição podemos obter mais 15 resultados, instruindo a Pexels a nos entregar os resultados da página 2. E assim por diante.

Os parâmetros envolvidos se chamam **page** e **per_page**. Eles indicam, respectivamente, o número da página de interesse e o número de itens por página. A URL final fica assim:

```text
https://api.pexels.com/v1/search?query=people&per_page=1&page=1
```

Para pedir uma nova foto, podemos acessar a URL

```text
https://api.pexels.com/v1/search?query=people&per_page=1&page=2
```

Ou seja, incrementamos o número da página. Claro, também podemos aumentar o número de resultados por página. Depende da natureza da aplicação.

Assim, podemos realizar a requisição.

### Exercício

No método **obterImagem**:

1. Construa um objeto **url** a partir de **Uri.https**.
   * primeiro parâmetro: host da pexels
   * segundo parâmetro: recurso
   * terceiro parâmetro: mapa de parâmetros da query
2. Construa um objeto **Request** (a partir do objeto http).
   * primeiro parâmetro: get (é o nome do método de interesse)
   * segundo parâmetro: o objeto url
3. Acesse a propriedade **headers** do objeto Request e dela, chame o método **addAll**.
   * primeiro parâmetro: um mapa com chave **Authorization** associada à sua chave Pexels.
4. Envie a requisição com **send**.

<details><summary>Ver resposta</summary>

<aside class="positive">

**Nota.** O valor de **page** está fixo em 1, neste momento. No futuro, a aplicação será atualizada para que este valor seja atualizado a cada requisição. Assim, teremos uma nova imagem a cada clique. No momento, cada clique nos produz exatamente a mesma imagem.

</aside>

**lib/src/app.dart**

```dart
...
void obterImagem() {
  var url = Uri.https(
    'api.pexels.com',
    '/v1/search',
    {'query': 'people', 'page': '1', 'per_page': '1'},
  );
  var req = http.Request('get', url);
  req.headers.addAll(
    {
      'Authorization':
      'chave',
    },
  );
  req.send();
}
...
```

</details>

<aside class="negative">

Substitua `'chave'` pela sua chave de API da Pexels.

</aside>

## Futures e a função then
Duration: 12:00

E agora, como verificar o resultado? Veja a documentação da função **get**: [https://pub.dev/documentation/http/latest/http/get.html](https://pub.dev/documentation/http/latest/http/get.html). Veja também a documentação da função **send** de **Request**: [https://pub.dev/documentation/http/latest/http/BaseRequest/send.html](https://pub.dev/documentation/http/latest/http/BaseRequest/send.html).

Ambas devolvem um objeto do tipo **Future**. O que é um objeto do tipo Future?

> **Future**
>
> Um Future é um objeto que fica associado a uma computação assíncrona, não bloqueante, potencialmente demorada. Ele nos permite obter o resultado calculado por esta computação, no futuro, quando ela terminar. Não bloqueante ou assíncrono quer dizer que o fluxo principal de nossa aplicação prossegue normalmente e a função demorada opera em background. Assim, não congelamos a interface com o usuário.

<aside class="positive">

**Nota.** Um Future em Dart é equivalente a uma Promise em Javascript. Não é necessário conhecer Promises para entender o que são Futures. E vice-versa. Essa é apenas uma analogia que pode ser útil.

</aside>

Já temos o objeto Future em mãos. Ele nos foi entregue pela função send. Agora precisamos descobrir como podemos acessar o resultado calculado pela função demorada, quando ela terminar. Neste caso, a função demorada é o acesso à Pexels e o resultado que desejamos é o objeto JSON. Podemos fazer uso da função **then** para obter o resultado.

<aside class="positive">

**Nota.** Entenda a função then da seguinte forma: "execute a computação demorada associada a este Future e **então**, execute o código da função entregue por parâmetro à função then".

</aside>

Vejamos um primeiro teste usando a função **then**.

**lib/src/app.dart**

```dart
...
void obterImagem() {
  var url = Uri.https(
    'api.pexels.com',
    '/v1/search',
    {'query': 'people', 'page': '1', 'per_page': '1'},
  );
  var req = http.Request('get', url);
  req.headers.addAll(
    {
      'Authorization':
      'chave',
    },
  );
  req.send().then((result) {
    print(result);
  });
}
...
```

Veja o resultado esperado.

**Terminal**

```text
Performing hot restart...
   621ms
Restarted application in 621ms.
Instance of 'StreamedResponse'
```

Ainda não tem muita graça. Temos uma instância de **StreamedResponse** em mãos. Veja a sua definição, dada pela documentação ([https://pub.dev/documentation/http/latest/http/StreamedResponse-class.html](https://pub.dev/documentation/http/latest/http/StreamedResponse-class.html)): *"An HTTP response where the response body is received asynchronously after the headers have been received."*

Temos um objeto cujos dados internos podem ser obtidos pouco a pouco, sob demanda. É um "fluxo (stream) de resposta". Dele podemos pegar a propriedade **stream**.

**lib/src/app.dart**

```dart
...
req.send().then((result) {
  print(result.stream);
});
...
```

Veja o resultado.

**Terminal**

```text
Restarted application in 460ms.
Instance of 'ByteStream'
```

Ainda não tem graça. Podemos verificar o código de status. Se ele for 200 (sucesso, segundo a especificação do protocolo HTTP), fazemos algo com o resultado. Neste caso, vamos converter nosso StreamedResponse para um **Response**. Um Response nos permite obter os dados de interesse por meio de propriedades previamente definidas. Como essa conversão também pode ser demorada, temos de lidar com um novo objeto Future. Veja.

**lib/src/app.dart**

```dart
...
req.send().then((result) {
  if (result.statusCode == 200) {
    http.Response.fromStream(result).then((response) {
      print(response.body);
    });
  } else {
    print('Falhou!');
  }
});
...
```

Agora o resultado ficou mais interessante.

**Terminal**

```text
Performing hot restart...
   408ms
Restarted application in 408ms.
{"page":1,"per_page":1,"photos":[{"id":5637733,"width":3840,"height":5760,"url":"https://www.pexels.com/photo/man-in-yellow-jacket-and-black-pants-walking-on-sidewalk-5637733/","photographer":"RDNE Stock project","photographer_url":"https://www.pexels.com/@rdne","photographer_id":3149039,"avg_color":"#ADA9A4","src":{"original":"https://images.pexels.com/photos/5637733/pexels-photo-5637733.jpeg","large2x":"https://images.pexels.com/photos/5637733/pexels-photo-5637733.jpeg?auto=compress\u0026cs=tinysrgb\u0026dpr=2\u0026h=650\u0026 ...
```

Podemos até decodificar o JSON recebido e converter para um ImageModel, não é mesmo?

**lib/src/app.dart**

```dart
import 'package:flutter/material.dart';
import 'dart:convert';
import 'models/image_model.dart';
import 'package:http/http.dart' as http;
...
req.send().then((result) {
  if (result.statusCode == 200) {
    http.Response.fromStream(result).then((response) {
      var decodedJSON = json.decode(response.body);
      var imagem = ImageModel.fromJSON(decodedJSON);
      print(imagem);
    });
  } else {
    print('Falhou!');
  }
});
...
```

Antes de executar, pode ser boa ideia fazer a sobrescrita do método **toString** da classe **ImageModel**. Assim, obtemos uma representação textual mais interessante de seus objetos. Vá até o arquivo **image_model.dart**.

### Exercício

Faça uma sobrescrita do método toString para a classe ImageModel. Ele deve produzir uma String contendo ambas as propriedades do objeto.

<details><summary>Ver resposta</summary>

Veja uma possível sobrescrita. Claro, você pode variar se desejar.

**lib/src/models/image_model.dart**

```dart
class ImageModel {
  late String url;
  late String alt;

  ImageModel(this.url, this.alt);

  ImageModel.fromJSON(Map<String, dynamic> decodedJSON) {
    //o resultado tem uma coleção de fotos
    //vamos pegar sempre a primeira
    //por isso, posição zero
    //dela, pegamos o tamanho médio (propriedade do objeto src)
    url = decodedJSON['photos'][0]['src']['medium'];
    alt = decodedJSON['photos'][0]['alt'];
  }

  @override
  String toString() {
    return 'url:$url, alt:$alt';
  }
}
```

</details>

Execute mais uma vez para ver o resultado.

**Terminal**

```text
Performing hot restart...
   410ms
Restarted application in 410ms.
url:https://images.pexels.com/photos/5637733/pexels-photo-5637733.jpeg?auto=compress&cs=tinysrgb&h=350, alt:Man in Yellow Jacket and Black Pants Walking on Sidewalk
```

Bem mais interessante, né?

## async/await
Duration: 8:00

Embora funcione, o código que envolve o método **then** pode ser difícil de entender e de manter. Há uma construção chamada **async/await** (também semelhante àquela de Javascript) que nos permite escrever código assíncrono num formato "sequencial", mais fácil de entender, manter e depurar. Começamos marcando a função que fará uso da construção como **async**.

**lib/src/app.dart**

```dart
...

void obterImagem() async {
  var url = Uri.https(
  ...
```

A seguir, deixamos de chamar a função then e "aguardamos" pelo resultado da computação demorada, guardando seu resultado de modo aparentemente sequencial. Para isso, marcamos a chamada à função que produz um Future com **await**. Veja.

**lib/src/app.dart**

```dart
void obterImagem() async {
  var url = Uri.https(
    'api.pexels.com',
    '/v1/search',
    {'query': 'people', 'page': '1', 'per_page': '1'},
  );
  var req = http.Request('get', url);
  req.headers.addAll(
    {
      'Authorization':
      'chave',
    },
  );

  final result = await req.send();
  if (result.statusCode == 200) {
    final response = await http.Response.fromStream(result);
    var decodedJSON = json.decode(response.body);
    var imagem = ImageModel.fromJSON(decodedJSON);
    print(imagem);
  } else {
    print('Falhou!');
  }
}
```

## Criando uma lista de ImageModel e o Widget ImageList
Duration: 15:00

Sempre que tivermos uma nova imagem, ela será representada por uma instância de ImageModel e armazenada em uma lista. Essa atualização de dados envolve a atualização da tela. Isso quer dizer que a lista será uma **variável de estado**. Veja.

**lib/src/app.dart**

```dart
...
class AppState extends State<App> {
  int numeroImagens = 0;
  List<ImageModel> imagens = [];
  ...
```

A cada clique, adicionamos uma nova instância de ImageModel à lista.

**lib/src/app.dart**

```dart
...
final result = await req.send();
if (result.statusCode == 200) {
  final response = await http.Response.fromStream(result);
  var decodedJSON = json.decode(response.body);
  var imagem = ImageModel.fromJSON(decodedJSON);
  imagens.add(imagem);
} else {
...
```

Lembre-se, entretanto, que estamos lidando com uma variável de estado. Assim, precisamos fazer a atualização de maneira adequada, usando o método **setState**. Ele se encarrega de atualizar a tela quando for a hora.

**lib/src/app.dart**

```dart
...
final result = await req.send();
if (result.statusCode == 200) {
  final response = await http.Response.fromStream(result);
  var decodedJSON = json.decode(response.body);
  var imagem = ImageModel.fromJSON(decodedJSON);
  setState(() {
    imagens.add(imagem);
  });
} else {
  print('Falhou!');
}
...
```

Neste ponto, a nossa aplicação merece nova refatoração. Observe como a classe AppState está bem grandinha.

### Exercício

1. Crie uma pasta **widgets**, subpasta de **src**.
2. Crie um arquivo chamado **image_list.dart** na pasta **widgets**.
3. Importe a biblioteca material de flutter.
4. Importe a classe ImageModel.
5. Defina uma classe chamada **ImageList**. Ela deve passar no teste É-UM **StatelessWidget**. Já já vemos por que ele não é um StatefulWidget.
6. Defina o método build: ele devolve Widget e recebe BuildContext.
7. No arquivo **app.dart**, importe o arquivo **image_list.dart**.
8. Ajuste a propriedade **body** de Scaffold. Ele deixa de exibir um Text e passa a exibir um ImageList.
9. Ainda em **app.dart**, ao construir um ImageList, passe como parâmetro a lista de ImageModel. Isso causará um erro em tempo de compilação.
10. No arquivo **image_list.dart**, defina uma variável de instância chamada **imagens**. Ela deve ser do tipo **List&lt;ImageModel&gt;**. Já que o widget é sem estado, ela deve ser marcada **final**.
11. No arquivo **image_list.dart**, escreva um construtor que recebe uma lista de ImageModel.

<aside class="positive">

**Nota.** O Widget que criamos é "sem estado" pois uma nova instância dele é construída a cada atualização de tela. Cada nova instância recebe, como parâmetro do construtor, a nova lista a ser exibida, já atualizada. A atualização da lista fica a cargo do Widget principal. Por essa razão, ele é "com estado".

</aside>

<details><summary>Ver resposta</summary>

![Explorer do VS Code com lib/src/models/image_model.dart, lib/src/widgets/image_list.dart, app.dart e main.dart](img/p069-1.webp)

*A pasta widgets com o arquivo image_list.dart.*

**lib/src/widgets/image_list.dart**

```dart
//arquivo image_list.dart
import 'package:flutter/material.dart';
import '../models/image_model.dart';

class ImageList extends StatelessWidget {
  final List<ImageModel> imagens;
  ImageList(this.imagens);

  @override
  Widget build(BuildContext context) {

  }
}
```

Arquivo **app.dart**.

**lib/src/app.dart**

```dart
import 'models/image_model.dart';
import 'widgets/image_list.dart';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
...
@override
Widget build(BuildContext context) {
  return MaterialApp(
    home: Scaffold(
      appBar: AppBar(
        title: const Text("Minhas Imagens"),
      ),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: obterImagem,
      ),
      body: ImageList(imagens),
  ));
}
...
```

</details>

## Exibição de widgets com ListView
Duration: 10:00

Um Widget do catálogo oficial capaz de exibir uma lista de widgets se chama **ListView**. Veja a sua documentação: [https://api.flutter.dev/flutter/widgets/ListView-class.html](https://api.flutter.dev/flutter/widgets/ListView-class.html).

Observe que ListView possui alguns construtores. Observe a descrição daquele que aparece primeiro na lista.

*Creates a scrollable, linear array of widgets from an explicit List.*

Já o segundo, chamado **builder**, é descrito assim.

*Creates a scrollable, linear array of widgets that are created on demand.*

O texto "**on demand**" faz toda a diferença. Se temos uma lista pequena, digamos com 5 elementos, o primeiro construtor resolve bem o problema. Ele constrói os 5 Widgets para exibição de cada elemento de uma vez. Porém, se tivermos 5 milhões de itens para exibir, não podemos construir um Widget para cada item assim que a lista for construída. A melhor abordagem é fazer a construção **sob demanda**, conforme o usuário navega na lista. Por isso, vamos utilizar o construtor chamado **builder**.

No arquivo **image_list.dart**, vamos construir e devolver um ListView a partir do método build. Os parâmetros que especificamos são os seguintes:

* **itemCount**: número de elementos na lista.
* **itemBuilder**: uma função que explica a forma como cada item da lista deve ser exibido. Ela recebe um objeto do tipo BuildContext, chamado **context**, e um objeto do tipo **int**, chamado **index**. Ela devolve um Widget que exibe o item na posição index da lista de imagens.

### Exercício

1. Faça o método build de ImageList devolver um ListView, construído pelo construtor chamado **builder**.
2. Entregue os dois parâmetros a ele: **itemCount** e **itemBuilder**.
   * itemCount deve ser o número de imagens existentes na lista.
   * itemBuilder deve ser uma função que recebe um BuildContext e um int.
   * Faça a função associada ao parâmetro itemBuilder devolver um Widget textual que exibe a representação textual do ImageModel contido na posição index.

<details><summary>Ver resposta</summary>

**lib/src/widgets/image_list.dart**

```dart
//arquivo image_list.dart
import 'package:flutter/material.dart';
import '../models/image_model.dart';

class ImageList extends StatelessWidget {
  final List<ImageModel> imagens;
  ImageList(this.imagens);

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: imagens.length,
      itemBuilder: (BuildContext context, int index) {
        return Text(imagens[index].toString());
      },
    );
  }
}
```

</details>

Teste a aplicação clicando algumas vezes no FloatingActionButton. Veja o resultado esperado.

![Aplicação "Minhas Imagens" exibindo várias linhas de texto repetidas, cada uma com a url e o alt da mesma foto](img/p073-1.webp)

*Cada clique adiciona à lista o texto do mesmo ImageModel.*

## Uma nova imagem a cada clique e o Widget Image
Duration: 12:00

### Exercício

Observe que, a cada clique, a aplicação exibe o mesmo texto e a mesma URL. Faça o ajuste necessário para que ela exiba um novo item a cada clique. Lembre-se de usar o número de imagens, variável de estado da classe AppState.

<details><summary>Ver resposta</summary>

**lib/src/app.dart**

```dart
class AppState extends State<App> {
  //começamos de 1 pois não há página 0 na Pexels
  int numeroImagens = 1;
  List<ImageModel> imagens = [];
  void obterImagem() async {
    var url = Uri.https(
      'api.pexels.com',
      '/v1/search',
      //número da página requisitada igual ao valor existente em numeroImagens
      {'query': 'people', 'page': '$numeroImagens', 'per_page': '1'},
    );
    var req = http.Request('get', url);
    req.headers.addAll(
      {
        'Authorization':
        'chave',
      },
    );

    final result = await req.send();
    if (result.statusCode == 200) {
      final response = await http.Response.fromStream(result);
      var decodedJSON = json.decode(response.body);
      var imagem = ImageModel.fromJSON(decodedJSON);
      setState(() {
        //incremento a cada clique
        numeroImagens++;
        imagens.add(imagem);
      });
    }
    else {
      print('Falhou!');
    }
  }
```

</details>

### Exibindo imagens com o Widget Image

Há um widget chamado **Image** capaz de fazer a exibição de imagens. Veja a sua documentação: [https://api.flutter.dev/flutter/widgets/Image-class.html](https://api.flutter.dev/flutter/widgets/Image-class.html).

### Exercício

Encontre o construtor apropriado para exibir uma imagem vinda da Internet. Lembre-se de utilizar a propriedade **url** do ImageModel.

<details><summary>Ver resposta</summary>

Estamos no arquivo **image_list.dart**.

**lib/src/widgets/image_list.dart**

```dart
...
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: imagens.length,
      itemBuilder: (BuildContext context, int index) {
        return Image.network(imagens[index].url);
      },
    );
  }
...
```

</details>

Teste novamente a aplicação e veja o resultado, após clicar algumas vezes no FloatingActionButton.

![Aplicação "Minhas Imagens" exibindo duas fotos de pessoas, uma no topo e outra bem abaixo, com grande espaço em branco entre elas](img/p076-1.webp)

*As fotos aparecem, mas distantes umas das outras.*

Observe que as imagens aparecem mas elas estão distantes umas das outras. Há alguns ajustes de posicionamento, borda, margem, padding etc. a serem realizados.

## Exercício final: leiaute
Duration: 25:00

Faça ajustes na aplicação para que as imagens fiquem "próximas" umas das outras. Também não permita que elas fiquem "coladas" às bordas da tela do dispositivo. Para isso, estude sobre leiautes: [https://docs.flutter.dev/ui/layout](https://docs.flutter.dev/ui/layout). Estude também sobre bordas: [https://docs.flutter.dev/ui/layout#container](https://docs.flutter.dev/ui/layout#container).

* Exiba a descrição de cada imagem logo abaixo dela.
* Acima da lista de imagens, exiba o texto: **Você tem n imagens**, sendo n o número de imagens atual.
* Troque o leiaute da aplicação. Passe a exibir duas imagens por linha.

## Encerramento
Duration: 3:00

Parabéns! Você construiu uma aplicação Flutter que busca fotos na API da Pexels e as exibe numa lista, passando por:

* criação e execução de projetos Flutter, hot reload e hot restart;
* os Widgets `MaterialApp`, `Scaffold`, `AppBar`, `FloatingActionButton`, `Icon`, `Text`, `ListView` e `Image`;
* `StatelessWidget`, `StatefulWidget` e `setState`;
* JSON, `dart:convert`, classes de modelo e construtores nomeados;
* requisições HTTP com o pacote `http`, `Future`, `then` e `async`/`await`.

### Referências

* Dart programming language | Dart. Google, 2023. Disponível em [https://dart.dev/](https://dart.dev/). Acesso em setembro de 2023.
* Flutter - Build apps for any screen. Google, 2023. Disponível em [https://flutter.dev/](https://flutter.dev/). Acesso em setembro de 2023.
