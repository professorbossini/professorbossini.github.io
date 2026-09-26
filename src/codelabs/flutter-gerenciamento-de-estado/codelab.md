summary: Aprenda a gerenciar o estado de aplicações Flutter com o padrão Bloc, construindo uma tela de login com validação por streams, Provider baseado em InheritedWidget, combinação de streams com RxDart e exibição de Toast.
id: flutter-gerenciamento-de-estado
categories: Flutter,Mobile
tags: flutter,dart,bloc,gerenciamento-de-estado,streams,rxdart,inheritedwidget,provider
status: Published
authors: Rodrigo Bossini
last updated: 2023-11-11
pdf: dart_flutter/02_apostila_flutter_gerenciamento_de_estado.pdf
exercicios: dart_flutter/02_exercicio_flutter_gerenciamento_de_estado.pdf,dart_flutter/02_exercicio_com_resposta_flutter_gerenciamento_de_estado.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Flutter: gerenciamento de estado com o padrão Bloc

## Visão geral
Duration: 3:00

Neste codelab, vamos estudar diversas opções para realizar o gerenciamento de estado em aplicações Flutter e implementar, passo a passo, uma tela de login cujo estado é gerenciado com o padrão **Bloc** (*Business Logic Component*).

### O que você vai aprender

- Por que os `StatefulWidget`s podem dar origem a aplicações difíceis de manter.
- As principais opções de gerenciamento de estado no Flutter: `setState`, Provider, Riverpod, Bloc, Redux e MobX.
- Como funciona o padrão Bloc, baseado em eventos e *streams*.
- Como criar `StreamController`s, *getters* e `StreamTransformer`s de validação.
- Como usar o `StreamBuilder` e o `AsyncSnapshot` para atualizar a interface gráfica.
- A diferença entre uma única instância Bloc global e múltiplas instâncias de escopo restrito.
- Como escrever um `Provider` baseado em `InheritedWidget` e o que é **covariância** em Dart.
- Como combinar streams com o pacote **RxDart** (`CombineLatestStream`, `BehaviorSubject`) e o que são *broadcast streams*.
- Como exibir um **Toast** com o pacote `fluttertoast`.

### O que você vai precisar

- O SDK do Flutter instalado e configurado.
- O VS Code.
- Um navegador (Chrome), um emulador ou um dispositivo real para executar a aplicação.
- Conhecimentos básicos de Dart e de Widgets do Flutter (Widgets com e sem estado).

## Gerenciamento de estado: o problema e as opções
Duration: 8:00

Vimos que o estado de um Widget é caracterizado pela coleção de variáveis cujos valores podem ser alterados enquanto o Widget tem vida útil e que, em geral, são utilizados na renderização de partes da tela. O Flutter oferece os conhecidos **Stateful Widgets**. Eles permitem o gerenciamento e manipulação de estado. Porém, seu funcionamento é muito simples e pode dar origem a aplicações difíceis de se manter, especialmente aplicações de nível de complexidade razoável.

Considere uma aplicação que tem apenas duas telas.

![Esboço de duas telas: um Dashboard com "Bem vindo, João!" e botões Meus livros, Meu perfil, Opções e Sobre; e uma tela "Atualize seu perfil!" com os campos Novo nome (João) e Nova idade (22) e um botão OK](img/duas-telas.webp)

*Uma aplicação com duas telas que dependem do nome do usuário.*

Observe que o nome do usuário é necessário para a exibição de ambas as telas. Potencialmente, ele faz parte do estado da aplicação. Uma pergunta a ser feita é a seguinte: "Onde definir essa variável de estado?"

Uma resposta natural seria: "Podemos criar um Widget com estado (`StatefulWidget`) em que fazemos a definição desta variável. Em função da navegação do usuário, construímos um Widget diferente (um para o Dashboard, outro para a atualização de perfil) e a ele entregamos, via construtor, o valor da variável de estado que lhe interessa."

Essa abordagem funciona, mas ela se mostra demasiada complicada e difícil de manter, especialmente para aplicações mais complexas. Assim, neste material, vamos estudar sobre diversas opções para realizar o gerenciamento de estado em aplicações Flutter.

<aside class="positive">

**Nota.** Não há verdade absoluta a respeito do gerenciamento de estado de aplicações Flutter (isso também vale para outros ambientes, como aplicações React). Há diferentes formas de se resolver o problema, cada qual com suas vantagens e desvantagens.

</aside>

Algumas das principais são as seguintes.

- **método `setState`**: usado em conjunto com um `StatefulWidget`. É simples, provido pelo próprio framework Flutter, mas tende a comprometer a manutenibilidade de aplicações mais complexas.
- **pacote Provider**: é uma das bibliotecas mais populares para o gerenciamento de estado de aplicações Flutter. O framework Flutter oferece um Widget do tipo **InheritedWidget** ([https://api.flutter.dev/flutter/widgets/InheritedWidget-class.html](https://api.flutter.dev/flutter/widgets/InheritedWidget-class.html)) cuja finalidade é permitir que o estado de uma aplicação seja propagado para Widgets mais abaixo na árvore. Um Provider é um "wrapper" sobre este tipo de Widget e traz um nível mais alto de abstração. Visite-o no pub.dev: [https://pub.dev/packages/provider](https://pub.dev/packages/provider)
- **Riverpod** (observe que é um anagrama de *provider*): este pacote é baseado no provider e, segundo a sua documentação, oferece mais alto nível de abstração, mais flexibilidade e resolve problemas encontrados no uso do provider mais facilmente. Visite-o no pub.dev: [https://pub.dev/packages/riverpod](https://pub.dev/packages/riverpod)
- **Bloc** (*Business Logic Component*): esse é um padrão baseado em **eventos**. Regras de negócio e estado são separados da visualização. Eles se comunicam por meio de **streams**. Embora possa ser implementado sem pacotes extras, há também a possibilidade de fazê-lo utilizando pacotes, o que, em geral, promove a produtividade do desenvolvedor. Veja o site a seguir: [https://bloclibrary.dev](https://bloclibrary.dev)
- **Redux**: esse pacote é baseado no pacote de mesmo nome do ambiente Javascript. Ele define um estado global único a que todos os componentes interessados têm acesso e uma forma padronizada de atualizá-lo. Visite-o no pub.dev: [https://pub.dev/packages/redux](https://pub.dev/packages/redux)
- **Mobx**: este pacote oferece uma abordagem **reativa** para o gerenciamento de estado. A ideia é "observarmos" potenciais mudanças de estado e "reagirmos" a elas. Apesar do nome "impactante", a programação reativa se baseia num padrão de projetos muito antigo e elementar: o padrão **Observer**. Tudo se baseia na existência de objetos "observáveis" e objetos "observadores". Quando um observável sofre um evento de interesse, a coleção de observadores interessados neste evento é notificada e cada um reage da forma que achar apropriada. No contexto de interfaces gráficas incluindo variáveis de estado:
  - os observáveis são as variáveis de estado;
  - cada observador é uma função que executa automaticamente quando uma variável de estado é atualizada, alterando a interface gráfica.

  Visite-o no pub.dev: [https://pub.dev/packages/mobx](https://pub.dev/packages/mobx)

## O padrão Bloc
Duration: 6:00

Neste material, vamos implementar o gerenciamento de estado de uma aplicação Flutter utilizando o padrão **Bloc**. A figura a seguir o ilustra. Observe a existência de uma espécie de estado centralizado a que todas as telas têm acesso.

![Diagrama com um bloco central "Bloc (Business Logic Component)" contendo nome=João, ligado às duas telas da aplicação: o Dashboard e a tela de atualização de perfil](img/bloc-estado-centralizado.webp)

*O Bloc funciona como um estado centralizado acessado pelas telas.*

Como mencionamos, Bloc é um padrão baseado em **eventos** e **streams**. Eventos são originados a partir de "fontes de eventos". Um Widget qualquer pode ser uma fonte de evento. Um stream representa um processamento aplicado ao evento de interesse a fim de que o resultado esperado possa ser obtido. Veja.

![Três exemplos de evento, stream e resultado: usuário digita algo em um campo textual, stream, mensagem de validação exibida; usuário aperta um botão, stream, aplicação navega para outra tela; requisição externa (HTTP, por exemplo), stream, dados convertidos em um mapa (coleção de pares chave/valor)](img/eventos-streams.webp)

*Eventos, streams (fases de processamento) e resultados obtidos.*

No contexto do Flutter, teremos Widgets como fontes de eventos. Teremos também Widgets como **"alvos"**. Um Widget alvo é construído em função de um Stream e ele se encarrega, internamente, de se apresentar de acordo com o processamento que o stream representa. Observe.

![Diagrama: Widgets (fontes de eventos) enviam para um Stream (uma fase de processamento), que alimenta outro Widget; cada um é construído em função de um stream e se apresenta de acordo com o processamento do stream que o alimenta](img/widgets-fontes-alvos.webp)

*Widgets como fontes de eventos e como alvos.*

Seguindo a ideia que o padrão Bloc propõe, temos algo assim.

![Diagrama: stream de entrada a partir de um Widget, depois Bloc, depois stream de saída a entregar a um Widget](img/bloc-streams.webp)

*O Bloc recebe um stream de entrada e produz um stream de saída.*

O padrão Bloc pode ser implementado "manualmente" ou utilizando-se uma biblioteca específica, o que pode ser mais simples. Veja uma comparação entre o padrão Bloc e os Widgets com estado.

| StatefulWidget | Padrão Bloc |
| --- | --- |
| Uso muito simples | Uso pode ser complexo e a curva de aprendizado pode ser significativa |
| Não escala bem para aplicações de maior porte | Quando bem aplicado, atende às necessidades de aplicações de quaisquer níveis de complexidade. Recomendado pelo Google |

## Workspace, novo projeto Flutter e VS Code
Duration: 10:00

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
flutter create gerenciamento_de_estado
```

A seguir, no terminal, use

**Terminal**

```bash
code gerenciamento_de_estado
```

para abrir uma instância do VS Code vinculada à pasta recém-criada.

No VS Code, clique **Terminal >> New Terminal** para abrir um terminal interno do VS Code. Use

**Terminal (VS Code)**

```bash
flutter run
```

para colocar a aplicação em execução. Se houver mais de um dispositivo disponível, o Flutter pergunta qual deles usar. Veja um exemplo em que escolhemos o Chrome.

**Terminal (VS Code)**

```text
gerenciamento_de_estado $ flutter run
Connected devices:
Linux (desktop) • linux  • linux-x64      • Ubuntu 22.04.3 LTS 6.2.0-34-generic
Chrome (web)    • chrome • web-javascript • Google Chrome 117.0.5938.149
[1]: Linux (linux)
[2]: Chrome (chrome)
Please choose one (or "q" to quit): 2
Launching lib/main.dart on Chrome in debug mode...
Waiting for connection from debug service on Chrome...
```

![Aplicação padrão do Flutter em execução no Chrome: Flutter Demo Home Page com o contador em 0 e o botão de adicionar](img/app-padrao.webp)

*A aplicação padrão criada pelo `flutter create` em execução.*

### Desabilitando a dica `prefer_const_constructors`

<aside class="positive">

**Nota.** Ao longo do desenvolvimento, você verá mensagens sugerindo que você aplique `const` às chamadas de seus construtores, a fim de que o compilador possa produzir código otimizado. Você pode optar por adicionar `const` sempre que a dica surgir (e depois ter de remover, quando não for mais possível, o que acontece quando você chama um construtor não `const` num construtor que foi marcado como `const`) ou desabilitar essa dica no VS Code.

</aside>

Veja como fica a dica exibida pelo VS Code.

```text
Use 'const' with the constructor to improve performance.
Try adding the 'const' keyword to the constructor invocation. dart(prefer_const_constructors)
```

Observe que esse comportamento é causado por uma verificação do *linter* chamada **prefer_const_constructors**. Se desejar, você pode desabilitá-la. Para tal, abra o arquivo **analysis_options.yaml** (na raiz do projeto). Encontre a seção `rules` e desabilite a opção da seguinte forma.

**analysis_options.yaml**

```yaml
linter:
  # The lint rules applied to this project can be customized in the
  # section below to disable rules from the `package:flutter_lints/flutter.yaml`
  # included above or to enable additional rules. A list of all available lints
  # and their documentation is published at https://dart.dev/lints.
  #
  # Instead of disabling a lint rule for the entire project in the
  # section below, it can also be suppressed for a single line of code
  # or a specific dart file by using the `// ignore: name_of_lint` and
  # `// ignore_for_file: name_of_lint` syntax on the line or in the file
  # producing the lint.
  rules:
    prefer_const_constructors: false
    # avoid_print: false  # Uncomment to disable the `avoid_print` rule
    # prefer_single_quotes: true  # Uncomment to enable the `prefer_single_quotes` rule
```

## Estrutura inicial da aplicação
Duration: 8:00

Caracterize a estrutura inicial da aplicação da seguinte forma.

- Crie uma pasta chamada **src**, filha de **lib**.
- Crie um arquivo chamado **app.dart** na pasta **src**.
- Abra o arquivo **lib/main.dart** e **apague todo o seu conteúdo**.

```text
lib/
├── src/
│   └── app.dart
└── main.dart
```

No arquivo **app.dart**, crie um Widget sem estado chamado `App`. Ele usa

- **MaterialApp** - se encarrega de construir o mecanismo de navegação de telas
- **Scaffold** - esqueleto da aplicação, implementa a estrutura básica da especificação Material Design e viabiliza a definição das partes principais da tela, como uma barra inferior, a parte central, um botão de ação (FAB), um menu de "gaveta" etc.

No momento, ele apenas exibe um texto de teste.

**lib/src/app.dart**

```dart
import 'package:flutter/material.dart';

class App extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Login',
      home: Scaffold(
        body: Text("Começando..."),
      )
    );
  }
}
```

Passe a utilizar o Widget `App` no arquivo **main.dart**, iniciando a aplicação como de costume, usando a função `runApp`.

**lib/main.dart**

```dart
import 'package:flutter/material.dart';
import 'src/app.dart';

void main(){
  runApp(App());
}
```

### Uma tela para login

A primeira tela da aplicação permitirá que o usuário faça login. Para criá-la, crie uma pasta chamada **telas**, subpasta de **src**. Nela, crie um arquivo chamado **login_tela.dart**.

```text
lib/
├── src/
│   ├── telas/
│   │   └── login_tela.dart
│   └── app.dart
└── main.dart
```

Veja seu código inicial.

**lib/src/telas/login_tela.dart**

```dart
import 'package:flutter/material.dart';

class LoginTela extends StatelessWidget{
  @override
  Widget build(BuildContext context) {

  }
}
```

Na raiz, ele possui um **Container**. Veja a sua documentação.

[https://api.flutter.dev/flutter/widgets/Container-class.html](https://api.flutter.dev/flutter/widgets/Container-class.html)

Ele será utilizado para que possamos definir detalhes como uma margem separando o conteúdo principal das bordas do dispositivo.

**lib/src/telas/login_tela.dart**

```dart
...
Widget build(BuildContext context) {
  return Container(
    //20 pixels de margem esquerda, direita, em cima e embaixo
    margin: EdgeInsets.all(20.0),
  );
}
```

O conteúdo principal terá Widgets **empilhados**. Para isso, utilizaremos um gerenciador de leiautes do tipo **Column**.

**lib/src/telas/login_tela.dart**

```dart
...
Widget build(BuildContext context) {
  return Container(
    //20 pixels de margem esquerda, direita, em cima e embaixo
    margin: EdgeInsets.all(20.0),
    child: Column(

    ),
  );
}
```

Um `Column` pode ter vários filhos. Por isso, ele tem uma propriedade chamada `children` a que podemos associar uma coleção de Widgets.

**lib/src/telas/login_tela.dart**

```dart
...
Widget build(BuildContext context) {
  return Container(
    //20 pixels de margem esquerda, direita, em cima e embaixo
    margin: EdgeInsets.all(20.0),
    child: Column(
      children: [

      ],
    ),
  );
}
```

Passemos a utilizar o Widget recém-criado, o que pode ser feito no arquivo **app.dart**.

**lib/src/app.dart**

```dart
import 'package:flutter/material.dart';
import '../src/telas/login_tela.dart';

class App extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Login',
      home: Scaffold(
        body: LoginTela(),
      )
    );
  }
}
```

## Tela de login: campos e botão
Duration: 15:00

<aside class="positive">

**Nota.** O Flutter inclui diversos Widgets próprios para a construção de Forms. Por exemplo, poderíamos usar um **Form** como pai de alguns **TextFormField**. Porém, estes são Widgets **com estado**, ou seja, são StatefulWidgets. Veja a sua documentação: [https://api.flutter.dev/flutter/widgets/Form-class.html](https://api.flutter.dev/flutter/widgets/Form-class.html) e [https://api.flutter.dev/flutter/material/TextFormField-class.html](https://api.flutter.dev/flutter/material/TextFormField-class.html). Na documentação, você pode ver a hierarquia de classes à qual eles pertencem. Observe que são subclasses de StatefulWidget:

- Form: `Object > DiagnosticableTree > Widget > StatefulWidget > Form`
- TextFormField: `Object > DiagnosticableTree > Widget > StatefulWidget > FormField<String> > TextFormField`

Não estamos utilizando tais Widgets justamente por possuírem estado. Estamos optando por fazer o gerenciamento de estado com o padrão Bloc.

</aside>

<aside class="positive">

**Nota.** Lembre-se sempre de visitar o [https://pub.dev](https://pub.dev) em busca de pacotes de qualidade que lhe permitam evitar reinventar a roda. Quando estiver trabalhando com forms, talvez você queira considerar o seguinte pacote: [https://pub.dev/packages/flutter_login](https://pub.dev/packages/flutter_login). Observe como ele faz uso de recursos diversos, incluindo animações. Neste material, o nosso foco é o gerenciamento de estado. Não utilizaremos este Widget.

</aside>

Utilizaremos Widgets do tipo **TextField** para os campos de e-mail e senha. Eles serão construídos por métodos auxiliares, assim, a manutenção do código pode se tornar mais simples. No arquivo **login_tela.dart**, faça a definição do seguinte método.

**lib/src/telas/login_tela.dart**

```dart
import 'package:flutter/material.dart';

class LoginTela extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    return Container(
      //20 pixels de margem esquerda, direita, em cima e embaixo
      margin: EdgeInsets.all(20.0),
      child: Column(
        children: [

        ],
      ),
    );
  }

  Widget emailField(){
    return TextField();
  }
}
```

Utilizaremos as seguintes propriedades do TextField.

- **keyboardType**: permite escolher o tipo de teclado. Neste caso, estamos escolhendo um apropriado para a digitação de endereços de e-mail.
- **decoration**: para exibir texto explicando ao usuário o que ele deseja fazer.

Como o método devolve um Widget, vamos fazer a sua chamada na primeira posição da lista que associamos à propriedade `children` do gerenciador de leiautes `Column`.

**lib/src/telas/login_tela.dart**

```dart
...
Widget build(BuildContext context) {
  return Container(
    //20 pixels de margem esquerda, direita, em cima e embaixo
    margin: EdgeInsets.all(20.0),
    child: Column(
      children: [
        emailField()
      ],
    ),
  );
}
Widget emailField(){
  return TextField(
    keyboardType: TextInputType.emailAddress,
    decoration: InputDecoration(
      //dica que aparece quando o usuário clica
      hintText: 'seu@email.com',
      //rótulo flutuante: usuário clica, ele "sobe"
      labelText: 'Endereço de e-mail'
    ),
  );
}
...
```

No terminal em que a aplicação está em execução, aperte **SHIFT + R** para fazer um *hot restart* e ver o resultado.

![Tela da aplicação no Chrome com um campo de texto rotulado "Endereço de e-mail"](img/campo-email.webp)

*O campo de e-mail.*

Clique no campo para ver o efeito.

![Campo de e-mail com foco: o rótulo "Endereço de e-mail" subiu e a dica seu@email.com é exibida](img/campo-email-foco.webp)

*Ao receber o foco, o rótulo flutua e a dica aparece.*

Faremos o mesmo para o campo de senha. Por ser um campo de senha, vamos usar a propriedade **obscureText** para ocultar o texto nele digitado. Defina o novo método e chame-o para que produza o segundo filho da coleção `children` do gerenciador de leiautes `Column`.

**lib/src/telas/login_tela.dart**

```dart
...
Widget build(BuildContext context) {
  return Container(
    //20 pixels de margem esquerda, direita, em cima e embaixo
    margin: EdgeInsets.all(20.0),
    child: Column(
      children: [
        emailField(),
        passwordField()
      ],
    ),
  );
}
Widget emailField(){
  return TextField(
    keyboardType: TextInputType.emailAddress,
    decoration: InputDecoration(
      //dica que aparece quando o usuário clica
      hintText: 'seu@email.com',
      //rótulo flutuante: usuário clica, ele "sobe"
      labelText: 'Endereço de e-mail'
    ),
  );
}
Widget passwordField(){
  return TextField(
    obscureText: true,
    decoration: InputDecoration(
      hintText: "Senha",
      labelText: "Senha"
    ),
  );
}
...
```

Faça novo hot restart (**SHIFT + R**) para ver o resultado.

![Tela com os campos Endereço de e-mail, preenchido com a@a.com, e Senha, com o texto oculto por pontos](img/campo-senha.webp)

*Os campos de e-mail e senha.*

Também vamos criar um botão para o envio do form. Ele será um **ElevatedButton**. Veja a sua documentação.

[https://api.flutter.dev/flutter/material/ElevatedButton-class.html](https://api.flutter.dev/flutter/material/ElevatedButton-class.html)

A definição será feita tal qual fizemos com os campos textuais: criaremos um método que devolve uma instância de interesse e o chamaremos para que produza o terceiro filho da lista `children` do gerenciador de leiautes `Column`. Veja.

**lib/src/telas/login_tela.dart**

```dart
...
    child: Column(
      children: [
        emailField(),
        passwordField(),
        submitButton()
      ],
    ),
  );
...
Widget passwordField(){
  ...
}
Widget submitButton(){
  return ElevatedButton(
    onPressed: (){}, //ainda não temos o que fazer, função vazia
    child: Text('Login')
  );
}
...
```

Faça novo Hot Restart (**SHIFT + R**) e veja que o resultado pode ser melhor.

![Tela com os campos de e-mail e senha e um pequeno botão Login centralizado, colado ao campo de senha](img/botao-login.webp)

*O botão Login, ainda sem margem e sem expandir.*

Vamos usar um novo Widget **Container** para adicionar um pouco de margem entre o campo de senha e o botão.

**lib/src/telas/login_tela.dart**

```dart
...
Widget build(BuildContext context) {
  return Container(
    //20 pixels de margem esquerda, direita, em cima e embaixo
    margin: EdgeInsets.all(20.0),
    child: Column(
      children: [
        emailField(),
        passwordField(),
        Container(
          margin: EdgeInsets.only(top: 12.0),
          child: submitButton(),
        )
      ],
    ),
  );
}
...
```

Além disso, vamos instruir o botão a tomar todo o espaço que ele pode com um Widget **Expanded**. Observe que, para que o botão faça a expansão na horizontal, será necessário fazer com que ele seja filho de um gerenciador de leiaute do tipo **Row**.

**lib/src/telas/login_tela.dart**

```dart
...
Widget build(BuildContext context) {
  return Container(
    //20 pixels de margem esquerda, direita, em cima e embaixo
    margin: EdgeInsets.all(20.0),
    child: Column(
      children: [
        emailField(),
        passwordField(),
        Container(
          margin: EdgeInsets.only(top: 12.0),
          child: Row(
            children: [
              Expanded(
                child: submitButton()
              )
            ],
          ),
        )
      ],
    ),
  );
}
...
```

Veja o resultado esperado. Lembre-se de fazer Hot Restart (**SHIFT + R**).

![Tela com os campos de e-mail e senha e o botão Login ocupando toda a largura, com margem acima dele](img/botao-expandido.webp)

*O botão expandido na horizontal.*

## Validação com Bloc: a classe Bloc e seus streams
Duration: 15:00

Quando o usuário digitar seu e-mail, desejamos verificar se está no formato correto. Também desejamos aplicar eventuais validações ao campo de senha. Para isso, vamos usar as seguintes propriedades.

- **onChanged**: propriedade do `TextField` a que podemos associar uma função a ser executada quando o usuário alterar o seu conteúdo.
- **errorText**: propriedade do `InputDecoration` (filho do `TextField`) a que podemos associar uma mensagem que será exibida caso o valor digitado esteja incondizente com o formato desejado.

Elas precisam ser vinculadas de alguma forma. Para tal, vamos

- criar uma classe para operar como nosso Bloc;
- a classe Bloc tem duas propriedades: `EmailStreamController` e `PasswordStreamController`. Ou seja, um stream para cada campo;
- cada controller receberá um evento de interesse por meio de sua propriedade "**sink**";
- para cada um, vamos criar um "**transformer**" de validação;
- atualizar os campos de exibição de mensagens de erro em função dos resultados obtidos pelos transformers.

Veja a figura a seguir.

![Diagrama: árvore de Widgets com Container, Column e dois TextFields (e-mail e senha); cada um tem onChanged e errorText; onChanged alimenta o sink do EmailStreamController ou do PasswordStreamController, cujo transformer de validação alimenta o stream que atualiza o errorText; os dois controllers ficam no BLOC, o estado centralizado](img/arquitetura-bloc.webp)

*Árvore de Widgets, streams e o Bloc como estado centralizado.*

Para começar a codificação, vamos criar uma pasta chamada **blocs**, subpasta de **src**. Depois, criamos um arquivo chamado **bloc.dart** nela.

```text
lib/
├── src/
│   ├── blocs/
│   │   └── bloc.dart
│   ├── telas/
│   │   └── login_tela.dart
│   └── app.dart
└── main.dart
```

Veja seu código inicial. Observe que as operações realizadas pelos streams são **assíncronas**, daí a necessidade do módulo `dart:async`.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';

class Bloc{

}
```

A seguir, definimos os dois streams.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';

class Bloc{
  //StreamController vem do pacote dart:async
  final emailController = StreamController();
  final passwordController = StreamController();
}
```

A classe `StreamController` é **genérica**: podemos especificar qual o tipo do dado envolvido em suas operações. Em ambos os casos, temos strings (e-mail e senha). Vamos aplicar o tipo paramétrico a fim de fazer uso do sistema de tipos estático de Dart. Nossos controllers manipulariam "dynamic" (ou seja, tipos quaisquer) caso não o fizéssemos.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';

class Bloc{
  //StreamController vem do pacote dart:async
  final emailController = StreamController<String>();
  final passwordController = StreamController<String>();
}
```

Para tornar o código cliente (aquele que a utiliza) mais simples, a classe Bloc oferecerá métodos para a manipulação de seus streams, ocultando seus detalhes de implementação.

- Para alimentar o stream de email, por exemplo, teríamos de escrever algo assim: `emailController.sink.add`. Para não deixar esse detalhe de implementação espalhado pelo código cliente, vamos escrever um método **getter**, simplificando a expressão. O método getter em questão dará acesso ao método `add` (sim, um getter que devolve um método).
- Para obter o conteúdo do stream, ou seja, o email sendo validado, escreveríamos algo assim: `emailController.stream.listen`. Também escreveremos um getter para o stream, permitindo a chamada à função `listen`.

### Getters e setters em Dart

<aside class="positive">

**Nota.** O método getter que escrevemos em Dart é semelhante àquele que escreveríamos em Java. O conceito é o mesmo. Entretanto, dizemos que Dart tem suporte "nativo" aos métodos getters/setters, tornando a escrita mais simples. Veja uma comparação a seguir. Primeiro, escrevemos uma classe clássica em Java. Depois, uma classe equivalente em Dart.

</aside>

**Pessoa.java**

```java
//Java
public class Pessoa {
  private String nome;
  private int idade;

  public Pessoa(String nome, int idade) {
    this.nome = nome;
    this.idade = idade;
  }

  public String getNome() {
    return nome;
  }

  public void setNome(String nome) {
    this.nome = nome;
  }

  public int getIdade() {
    return idade;
  }

  public void setIdade(int idade) {
    this.idade = idade;
  }

  public static void main(String[] args) {
    Pessoa pessoa = new Pessoa("Joao", 25);
    System.out.println(pessoa.getNome());
    System.out.println(pessoa.getIdade());
  }
}
```

**pessoa.dart**

```dart
//Dart
class Pessoa {
  //_ como prefixo significa private
  String _nome;
  int _idade;

  //Construtor
  Pessoa(this._nome, this._idade);

  //arrow function
  String get nome => _nome;

  //arrow function
  set nome(String value) => _nome = value;

  //também pode com function "comum"
  //sem lista de parâmetros mesmo
  int get idade {return _idade;}

  //também daria para fazer "getIdade", mas ficaria estranho
  //já que o acesso é feito como se fosse uma propriedade
  //int get getIdade {return _idade;}

  //setter precisa de lista de parâmetros
  set idade(int value){_idade = value;}
}

//Função main está fora da classe. Em Dart pode
void main() {
  var pessoa = Pessoa('Joao', 25);
  print(pessoa.nome);
  print(pessoa.idade);
  pessoa.nome = 'Maria';
  print(pessoa.nome);
}
```

### Encapsulando os controllers e escrevendo os getters

Já que vamos oferecer acesso simplificado a detalhes internos de implementação, é razoável que ocultemos os detalhes de implementação que não precisarão mais ser acessados externamente. Para tal, basta preceder seus nomes com um símbolo `_`.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';

class Bloc{
  //StreamController vem do pacote dart:async
  final _emailController = StreamController<String>();
  final _passwordController = StreamController<String>();
}
```

A seguir, escrevemos os getters que dão acesso aos streams, viabilizando a chamada ao método `listen` (veremos em breve) e, portanto, tornando possível adicionarmos algo aos streams.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';

class Bloc{
  //StreamController vem do pacote dart:async
  final _emailController = StreamController<String>();
  final _passwordController = StreamController<String>();

  get email => _emailController.stream;

  get password => _passwordController.stream;
}
```

Para cada um, podemos escrever o tipo devolvido explicitamente. Neste caso, ambos devolvem `Stream<String>`.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';

class Bloc{
  //StreamController vem do pacote dart:async
  final _emailController = StreamController<String>();
  final _passwordController = StreamController<String>();

  Stream<String> get email => _emailController.stream;

  Stream<String> get password => _passwordController.stream;
}
```

A seguir, vamos escrever os getters que dão acesso ao método `add` de ambos os streams. Ele permite alterarmos os dados existentes.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';

class Bloc{
  //StreamController vem do pacote dart:async
  final _emailController = StreamController<String>();
  final _passwordController = StreamController<String>();

  Stream<String> get email => _emailController.stream;

  Stream<String> get password => _passwordController.stream;

  get changeEmail => _emailController.sink.add;

  get changePassword => _passwordController.sink.add;
}
```

Ambos devolvem `Function(String)`. Ou seja, uma função que recebe uma String. Podemos utilizar o sistema de tipos estático também neste caso.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';

class Bloc{
  //StreamController vem do pacote dart:async
  final _emailController = StreamController<String>();
  final _passwordController = StreamController<String>();

  Stream<String> get email => _emailController.stream;

  Stream<String> get password => _passwordController.stream;

  Function(String) get changeEmail => _emailController.sink.add;

  Function(String) get changePassword => _passwordController.sink.add;
}
```

## Transformers de validação e o método dispose
Duration: 12:00

O próximo passo será escrever os **transformers** de validação. Para cada um, vamos

- construir um objeto usando o método `fromHandlers` de `StreamTransformer`;
- sobrescrever o método `handleData`, personalizando o seu funcionamento de acordo com as nossas necessidades.

`StreamTransformer` é uma classe genérica. Ela tem dois tipos genéricos. O primeiro é o tipo manipulado pelo Stream, o tipo do dado de entrada. O segundo é o tipo do dado que será produzido. Se nosso transformer fosse converter um inteiro para uma String, por exemplo, a classe seria `StreamTransformer<int, String>`. Como vamos validar uma String e devolver a string validada, a classe será `StreamTransformer<String, String>`.

Para começar a implementação, na pasta **blocs**, crie um arquivo chamado **validators.dart**. Veja seu código inicial. Observe que optamos por escrever um **mixin**.

**lib/src/blocs/validators.dart**

```dart
mixin Validators{

}
```

A seguir, escrevemos o `StreamTransformer` para validação de e-mail. A validação pode ser feita de diferentes formas.

- Usando expressões regulares, com a classe `RegExp`.
- Usando uma biblioteca já pronta, como a **email_validator**, disponível no pub.dev: [https://pub.dev/packages/email_validator](https://pub.dev/packages/email_validator)

Utilizaremos a segunda. Para instalar a biblioteca, abra o seu arquivo **pubspec.yaml** e adicione seu nome e versão sob a seção **dependencies**.

**pubspec.yaml**

```yaml
...
dependencies:
  flutter:
    sdk: flutter
  email_validator: '^2.1.16'
...
```

A seguir, no terminal, execute

**Terminal (VS Code)**

```bash
flutter pub get
```

para que ela seja obtida do pub.dev. De volta ao arquivo **validators.dart**, importe a biblioteca.

**lib/src/blocs/validators.dart**

```dart
import 'package:email_validator/email_validator.dart';
mixin Validators{

}
```

Seguindo o passo a passo descrito, veja como fica o validador de e-mail.

**lib/src/blocs/validators.dart**

```dart
import 'dart:async';

import 'package:email_validator/email_validator.dart';
mixin Validators{
  //O primeiro String é o tipo do primeiro parâmetro do handleData
  //O segundo String é o tipo do segundo parâmetro do handleData
  final validateEmail = StreamTransformer<String, String>.fromHandlers(
    handleData: (email, sink){
      if (EmailValidator.validate(email)){
        //adicionamos ao sink, permitindo o "fluxo" do e-mail adiante
        sink.add(email);
      }
      else{
        //caso contrário, adicionamos um erro
        sink.addError("E-mail inválido");
      }
    }
  );
}
```

### Exercício: validador de senhas

Escreva um validador para senhas. Para ser válida, uma senha deve ter, pelo menos, 4 caracteres. Se desejar, pesquise sobre a classe `RegExp` e faça validações mais interessantes.

[https://api.flutter.dev/flutter/dart-core/RegExp-class.html](https://api.flutter.dev/flutter/dart-core/RegExp-class.html)

<details><summary>Ver resposta</summary>

**lib/src/blocs/validators.dart**

```dart
import 'dart:async';

import 'package:email_validator/email_validator.dart';
mixin Validators{
  //O primeiro String é o tipo do primeiro parâmetro do handleData
  //O segundo String é o tipo do valor manipulado pelo segundo parâmetro do handleData (o segundo parâmetro é um EventSink<String>)
  final validateEmail = StreamTransformer<String, String>.fromHandlers(
    handleData: (email, sink){
      if (EmailValidator.validate(email)){
        //adicionamos ao sink, permitindo o "fluxo" do e-mail adiante
        sink.add(email);
      }
      else{
        //caso contrário, adicionamos um erro
        sink.addError("E-mail inválido");
      }
    }
  );

  final validatePassword = StreamTransformer<String, String>.fromHandlers(
    handleData: (email, sink){
      if (email.length > 3){
        sink.add(email);
      }
      else{
        sink.addError("Senha deve ter, pelo menos, 4 caracteres");
      }
    }
  );
}
```

</details>

### Usando os validadores no Bloc

A seguir, no arquivo **bloc.dart**, podemos fazer com que a classe Bloc reutilize as funcionalidades providas pelo mixin.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';
import 'validators.dart';
class Bloc with Validators{
  ...
```

O uso dos validadores será feito da seguinte forma: sempre que um stream for solicitado, ele passará por uma transformação feita por um dos transformers de validação. Observe.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';
import 'validators.dart';
class Bloc with Validators{
  //StreamController vem do pacote dart:async
  final _emailController = StreamController<String>();
  final _passwordController = StreamController<String>();

  Stream<String> get email => _emailController.stream.transform(validateEmail);

  Stream<String> get password => _passwordController.stream.transform(validatePassword);

  Function(String) get changeEmail => _emailController.sink.add;

  Function(String) get changePassword => _passwordController.sink.add;
}
```

### Fechando o Bloc

Nosso Bloc é composto por recursos que podem - e devem - ser fechados. São os Streams. Eles representam recursos alocados e, quando não forem mais utilizados, devem ser liberados. Como de costume, isso pode ser feito utilizando-se o seu método `close`. Como o Bloc tem potencialmente vários streams, vamos escrever um método que agrupa as chamadas ao método `close` sobre cada um deles.

<aside class="positive">

**Nota.** "dispose" significa algo como "descartar".

</aside>

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';
import 'validators.dart';
class Bloc with Validators{
  //StreamController vem do pacote dart:async
  final _emailController = StreamController<String>();
  final _passwordController = StreamController<String>();

  Stream<String> get email => _emailController.stream.transform(validateEmail);

  Stream<String> get password => _passwordController.stream.transform(validatePassword);

  Function(String) get changeEmail => _emailController.sink.add;

  Function(String) get changePassword => _passwordController.sink.add;

  void dispose(){
    _emailController.close();
    _passwordController.close();
  }
}
```

## Escopo do Bloc: global ou restrito
Duration: 5:00

Podemos fazer uso do padrão Bloc de algumas formas diferentes. Veja duas delas.

- **Única instância global.** Neste cenário, temos uma única instância Bloc e ela é responsável por manipular o estado da aplicação inteira.
- **Múltiplas instâncias com escopo restrito.** Neste cenário, temos múltiplas instâncias Bloc, cada uma responsável por lidar com uma pequena parte do estado da aplicação.

<aside class="positive">

**Nota.** O primeiro cenário, com uma instância global, tende a ser mais simples e apropriado para aplicações mais simples. O segundo, com múltiplas instâncias, requer mais programação mas pode se mostrar vantajoso para aplicações mais sofisticadas, maiores, com mais Widgets e mais variáveis de estado. Entretanto, é sempre importante lembrar que não há verdade absoluta e que duas aplicações diferentes, ainda que com complexidade semelhante, podem ser implementadas com estratégias diferentes e com resultados semelhantes.

</aside>

O cenário com uma **única instância global** fica da seguinte forma.

![Árvore de Widgets com App, MaterialApp e dois ramos (Scaffold, LoginTela e Widgets; Scaffold, OutraTela e Widgets); LoginTela e OutraTela acessam a mesma instância Bloc global, definida na classe Bloc (arquivo bloc.dart)](img/bloc-global.webp)

*Uma única instância Bloc global.*

Veja como fica o cenário com **múltiplas instâncias com escopo restrito**.

![A mesma árvore de Widgets, mas agora a classe Bloc (arquivo bloc.dart) produz várias instâncias Bloc de escopo restrito, cada uma entregue a uma tela que tenha interesse (LoginTela e OutraTela)](img/bloc-escopo-restrito.webp)

*Múltiplas instâncias Bloc de escopo restrito.*

<aside class="positive">

**Nota.** Há um detalhe técnico sobre a forma como os Widgets "filhos" terão acesso ao bloc de seu antecessor, que envolve o uso de um **InheritedWidget**. Trataremos deste assunto posteriormente.

</aside>

## Usando uma única instância Bloc global
Duration: 15:00

Nesta seção, vamos utilizar a estratégia com uma **única instância global**. Ela será construída no arquivo **bloc.dart**. Ou seja, quaisquer arquivos `.dart` que o importem terão acesso a ela. Observe como ela é construída **fora do corpo da classe**.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';
import 'validators.dart';
class Bloc with Validators{
  //StreamController vem do pacote dart:async
  final _emailController = StreamController<String>();
  final _passwordController = StreamController<String>();

  Stream<String> get email => _emailController.stream.transform(validateEmail);

  Stream<String> get password => _passwordController.stream.transform(validatePassword);

  Function(String) get changeEmail => _emailController.sink.add;

  Function(String) get changePassword => _passwordController.sink.add;

  void dispose(){
    _emailController.close();
    _passwordController.close();
  }
}

final bloc = Bloc();
```

A seguir, no arquivo **login_tela.dart**, importamos o arquivo **bloc.dart**.

**lib/src/telas/login_tela.dart**

```dart
import 'package:flutter/material.dart';
import '../blocs/bloc.dart';

class LoginTela extends StatelessWidget{
  ...
```

### StreamBuilder

No próximo passo, vamos "englobar" o `TextField` de e-mail utilizando um **StreamBuilder**. Visite a sua documentação.

[https://api.flutter.dev/flutter/widgets/StreamBuilder-class.html](https://api.flutter.dev/flutter/widgets/StreamBuilder-class.html)

Ele opera da seguinte forma:

- É construído em função de um stream e de um Widget.
- Uma nova atualização do stream gera um "**snapshot**".
- Se reconstrói (ou seja, atualiza graficamente o Widget que ele empacota) sempre que um novo snapshot estiver disponível.

Veja.

**lib/src/telas/login_tela.dart**

```dart
...
Widget emailField(){
  return StreamBuilder(
    //stream que, quando atualizado, produz um snapshot
    //observe como usamos o stream definido no bloc
    stream: bloc.email,
    //função que, quando chamada, causa a atualização do Widget (TextField, neste caso) empacotado pelo StreamBuilder
    builder: ((context, snapshot){
      return TextField(
        keyboardType: TextInputType.emailAddress,
        decoration: InputDecoration(
          //dica que aparece quando o usuário clica
          hintText: 'seu@email.com',
          //rótulo flutuante: usuário clica, ele "sobe"
          labelText: 'Endereço de e-mail'
        ),
      );
    }),
  );
}
...
```

Neste ponto, o que implementamos é destacado a seguir.

![Diagrama da arquitetura com destaque: o TextField (e-mail) agora é empacotado por um StreamBuilder e construído em função do stream alimentado pelo EmailStreamController](img/implementado-streambuilder.webp)

*O StreamBuilder empacota o TextField e é alimentado por um stream.*

### Vinculando o onChanged ao Bloc

O próximo passo é responder a seguinte pergunta: **Quando um snapshot novo vai ser gerado?** A resposta é simples: um novo snapshot é gerado sempre que o usuário atualiza o campo de e-mail. Em outras palavras, precisamos vincular a propriedade `onChanged` do `TextField` ao método `add` do stream correspondente. Sim, aquele mesmo que definimos no Bloc. Observe.

**lib/src/telas/login_tela.dart**

```dart
...
    builder: ((context, snapshot){
      return TextField(
        onChanged: (newValue){
          bloc.changeEmail(newValue);
        },
        keyboardType: TextInputType.emailAddress,
        decoration: InputDecoration(
          //dica que aparece quando o usuário clica
          hintText: 'seu@email.com',
          //rótulo flutuante: usuário clica, ele "sobe"
          labelText: 'Endereço de e-mail'
        ),
      );
    }),
...
```

<aside class="positive">

**Nota.** Também poderíamos especificar apenas o nome da função a ser associada à propriedade `onChanged`, ao invés de especificar uma função que a chama explicitamente. Ficaria como no bloco a seguir. A chamada e a passagem do novo valor estão implícitas. O resultado é o mesmo. Mantenha a que você preferir. De preferência, teste as duas. :)

</aside>

**lib/src/telas/login_tela.dart**

```dart
...
    builder: ((context, snapshot){
      return TextField(
        onChanged: bloc.changeEmail,
        keyboardType: TextInputType.emailAddress,
        decoration: InputDecoration(
          //dica que aparece quando o usuário clica
          hintText: 'seu@email.com',
          //rótulo flutuante: usuário clica, ele "sobe"
          labelText: 'Endereço de e-mail'
        ),
      );
    }),
...
```

Agora, o que temos implementado é ilustrado a seguir.

![Diagrama da arquitetura com destaque: quando o usuário altera o texto, o onChanged envia o valor ao sink do EmailStreamController e o StreamBuilder é alimentado pelo stream; o errorText ainda não está ligado](img/implementado-onchanged.webp)

*O onChanged alimenta o stream do Bloc.*

### O AsyncSnapshot

Observe que o campo "errorText" ainda não está sabendo a respeito das interações do usuário. Ele não sabe ainda que deve se atualizar. Aliás, para fazê-lo, ele precisa saber qual texto exibir, que é disponibilizado pelo snapshot! O snapshot é do tipo `AsyncSnapshot<String>`. Veja a sua documentação.

[https://api.flutter.dev/flutter/widgets/AsyncSnapshot-class.html](https://api.flutter.dev/flutter/widgets/AsyncSnapshot-class.html)

Em particular, veja o seguinte trecho.

![Trecho da documentação de AsyncSnapshot com as propriedades data (The latest data received by the asynchronous computation), error (The latest error object received by the asynchronous computation), hasData (Returns whether this snapshot contains a non-null data value) e hasError (Returns whether this snapshot contains a non-null error value)](img/asyncsnapshot-doc.webp)

*Propriedades de AsyncSnapshot: data, error, hasData e hasError.*

Os campos `data` e `error` permitem a obtenção de dados "comuns" ou de erros recebidos na última atualização do snapshot. Lembra que adicionamos conteúdo ao sink usando os métodos `add` e `addError`? Agora está clara a diferença! Além disso, os métodos `hasData` e `hasError` permitem verificar se há dados comuns ou se há erros.

Aplique o tipo estático do snapshot. Embora não seja obrigatório, utilizar o sistema de tipos estático é sempre uma boa prática.

**lib/src/telas/login_tela.dart**

```dart
...
  return StreamBuilder(
    //stream que, quando atualizado, produz um snapshot
    //observe como usamos o stream definido no bloc
    stream: bloc.email,
    //função que, quando chamada, causa a atualização do Widget (TextField, neste caso) empacotado pelo StreamBuilder
    builder: ((context, AsyncSnapshot<String> snapshot){
      return TextField(
        onChanged: bloc.changeEmail,
        keyboardType: TextInputType.emailAddress,
        decoration: InputDecoration(
          //dica que aparece quando o usuário clica
          hintText: 'seu@email.com',
          //rótulo flutuante: usuário clica, ele "sobe"
          labelText: 'Endereço de e-mail'
        ),
      );
    }),
...
```

Assim, basta associar a propriedade `error` do snapshot à propriedade `errorText` do `InputDecoration` associado ao `TextField`, filho do `StreamBuilder`.

**lib/src/telas/login_tela.dart**

```dart
...
    builder: ((BuildContext context, AsyncSnapshot<String> snapshot){
      return TextField(
        onChanged: bloc.changeEmail,
        keyboardType: TextInputType.emailAddress,
        decoration: InputDecoration(
          //dica que aparece quando o usuário clica
          hintText: 'seu@email.com',
          //rótulo flutuante: usuário clica, ele "sobe"
          labelText: 'Endereço de e-mail',
          //o erro não necessariamente é String, por isso seu tipo é Object?, daí o uso do toString()
          errorText: snapshot.error.toString()
        ),
      );
    }),
...
```

Agora a nossa implementação ficou assim.

![Diagrama da arquitetura completo para o e-mail: quando o usuário altera o texto, o valor passa pelo sink, pelo transformer de validação e pelo stream, e o StreamBuilder atualiza o errorText do TextField](img/implementado-errortext.webp)

*Fluxo completo para o campo de e-mail.*

## Exibindo os erros e testando
Duration: 10:00

Tudo pronto para o campo de e-mail. Façamos um teste. Primeiro, certifique-se de que a aplicação está em execução. Se necessário, use

**Terminal (VS Code)**

```bash
flutter run
```

para executá-la, claro, num terminal do VS Code, para facilitar.

![Tela de login em que o campo de e-mail já aparece vermelho, com o texto "null" como mensagem de erro, logo que a aplicação inicia](img/erro-null.webp)

*Ao iniciar, o campo de e-mail exibe o erro "null".*

Observe que, assim que a aplicação inicia, o campo de e-mail já está vermelho e exibindo uma mensagem "null" abaixo. Ocorre que estamos pegando a representação textual de `snapshot.error` (que está valendo `null` e que, portanto, tem representação textual - aquela calculada pelo `toString` - igual a `null`) e associando à propriedade `errorText` de maneira incondicional. Façamos uso do operador ternário, em conjunto com o método `hasError` para consertar.

**lib/src/telas/login_tela.dart**

```dart
...
          errorText: snapshot.hasError ? snapshot.error.toString() : null
...
```

Faça **shift + R** no terminal e teste novamente. Veja o resultado esperado.

![Tela de login com os campos Endereço de e-mail e Senha sem erros e o botão Login](img/form-inicial.webp)

*O form, ao iniciar, não exibe mais o erro.*

Comece a digitar e verifique o resultado. Esse é um exemplo em que digitamos algo que ainda não é um e-mail válido.

![Campo de e-mail preenchido com abc@ em vermelho e a mensagem E-mail inválido](img/email-invalido.webp)

*E-mail inválido.*

Quando completamos o texto caracterizando um e-mail válido, a coisa fica assim.

![Campo de e-mail preenchido com abc@email.com, sem mensagem de erro](img/email-valido.webp)

*E-mail válido.*

### O campo de senha

A seguir, precisamos fazer a mesma implementação para o stream de password. A alteração é idêntica, apenas envolve o outro stream. Veja.

**lib/src/telas/login_tela.dart**

```dart
...
Widget passwordField(){
  return StreamBuilder(
    stream: bloc.password,
    builder: (context, AsyncSnapshot<String> snapshot){
      return TextField(
        onChanged: bloc.changePassword,
        obscureText: true,
        decoration: InputDecoration(
          hintText: "Senha",
          labelText: "Senha",
          errorText: snapshot.hasError ? snapshot.error.toString() : null
        ),
      );
    },
  );
}
...
```

Aperte **SHIFT + R** no terminal novamente e faça testes. Quando a aplicação começa, ela não mostra erro algum, como na tela inicial mostrada acima.

<aside class="positive">

**Nota.** Este é um form que acabou de nascer. Ele jamais foi tocado. Muitas vezes utilizamos a expressão "**pristine**" para nos referirmos a forms assim. Dizemos que esse form está "pristine". Pristine significa algo como "imaculado", "em bom estado", "impecável", "puro de qualquer nódoa moral", "inocente".

</aside>

Faça uma atualização digitando apenas uma letra no campo de senha. Veja a mensagem de erro. Observe que, agora, o form já foi tocado. Ele já não é mais puro (pristine).

![Campo de senha em vermelho com um caractere digitado e a mensagem Senha deve ter, pelo menos, 4 caracteres](img/senha-invalida.webp)

*Senha com menos de 4 caracteres.*

Prossiga atualizando o campo de senha, atualizando-o para que contenha, pelo menos, quatro caracteres. Veja que a mensagem de erro desaparece.

![Campo de senha com quatro caracteres ocultos, sem mensagem de erro](img/senha-valida.webp)

*Senha válida: a mensagem de erro desaparece.*

## Múltiplas instâncias Bloc: o Widget Provider
Duration: 10:00

Nesta seção, vamos refatorar a aplicação, ilustrando o uso da abordagem em que temos **múltiplas instâncias Bloc de escopo restrito**. Relembre a figura que ilustra esta estratégia, apresentada no passo "Escopo do Bloc: global ou restrito".

![Árvore de Widgets em que a classe Bloc (arquivo bloc.dart) produz várias instâncias Bloc de escopo restrito, cada uma entregue a uma tela que tenha interesse](img/bloc-escopo-restrito.webp)

*Relembrando: múltiplas instâncias Bloc de escopo restrito.*

Há um detalhe que esta figura não revela: os Widgets filhos têm acesso ao bloc de escopo restrito que foi entregue a seu antecessor graças ao uso de um **InheritedWidget**. Veja uma nova versão da figura, mais completa tecnicamente.

![Árvore de Widgets em que LoginTela e OutraTela estão, cada uma, dentro de um InheritedWidget que guarda uma instância Bloc de escopo restrito; uma nota explica que um InheritedWidget engloba um Widget e uma instância Bloc e que, como efeito colateral, ela se torna disponível para todos os sucessores do Widget empacotado; todos na hierarquia têm acesso à instância Bloc](img/bloc-inheritedwidget.webp)

*Graças ao InheritedWidget, todos os sucessores têm acesso à instância Bloc.*

### Implementando um Widget Provider

Para implementar a solução baseada em múltiplas instâncias Bloc de escopo restrito, vamos escrever uma classe chamada **Provider**. Ou seja, será uma classe responsável por desempenhar o papel de "fornecedora". Ela "fornecerá" uma instância Bloc a um Widget interessado. Daí o nome. Veja a figura.

![A mesma árvore, com setas indicando que cada InheritedWidget desempenha o papel de Provider, "fornecendo" uma instância Bloc a um Widget interessado](img/provider-papel.webp)

*O InheritedWidget desempenha o papel de Provider.*

Comece criando um arquivo chamado **provider.dart** na pasta **blocs**. Inicialmente, importamos o Flutter e o Bloc.

**lib/src/blocs/provider.dart**

```dart
import 'package:flutter/material.dart';
import 'bloc.dart';
```

A classe `Provider` que vamos escrever é subclasse de `InheritedWidget`.

**lib/src/blocs/provider.dart**

```dart
import 'package:flutter/material.dart';
import 'bloc.dart';

class Provider extends InheritedWidget{

}
```

Como ainda não compila, você passa o mouse sobre o "vermelho" (sem clicar) e descobre a razão.

```text
Missing concrete implementation of
'InheritedWidget.updateShouldNotify'.
Try implementing the missing method, or make the class
abstract. dart(non_abstract_class_inherits_abstract_member)

The superclass 'InheritedWidget' doesn't have a zero argument
constructor.
Try declaring a zero argument constructor in 'InheritedWidget',
or declaring a constructor in Provider that explicitly invokes a
constructor in
'InheritedWidget'. dart(no_default_super_constructor)
```

A mensagem diz que estamos lidando com uma classe concreta (`Provider`) que não implementa um método abstrato chamado **updateShouldNotify**. Precisamos ler a sua documentação para entender como fazê-lo, bem como o seu propósito. Visite a documentação de `InheritedWidget`.

[https://api.flutter.dev/flutter/widgets/InheritedWidget-class.html](https://api.flutter.dev/flutter/widgets/InheritedWidget-class.html)

Encontre o método `updateShouldNotify`. Clique sobre o seu nome e leia a sua documentação.

> **updateShouldNotify abstract method**
>
> `@protected bool updateShouldNotify(covariant InheritedWidget oldWidget)`
>
> Whether the framework should notify widgets that inherit from this widget.
>
> When this widget is rebuilt, sometimes we need to rebuild the widgets that inherit from this widget but sometimes we do not. For example, if the data held by this widget is the same as the data held by `oldWidget`, then we do not need to rebuild the widgets that inherited the data held by `oldWidget`.
>
> The framework distinguishes these cases by calling this function with the widget that previously occupied this location in the tree as an argument. The given widget is guaranteed to have the same `runtimeType` as this object.

Para entender o que a documentação diz, precisamos lembrar que os Widgets são **imutáveis**. Quando a tela precisa ser atualizada, o Widget nela existente é descartado e outro é construído, atualizado a fim de exibir os novos "dados". Observe esse trechinho da documentação:

"*For example, if the data held by this widget is the same as the data held by oldWidget, then we do not need to rebuild the widgets that inherited the data held by oldWidget.*"

Intuitivo, não? A atualização da tela depende de dados (variáveis de estado). O método `updateShouldNotify` responde (ele devolve `bool`) se a tela deve ser atualizada ou não. Enquanto prosseguimos com o passo a passo, vá pensando sobre qual condição faz sentido envolver no teste realizado pelo método `updateShouldNotify` para a aplicação que estamos desenvolvendo. Enquanto isso, vamos apenas escrever uma versão que devolve `true` de maneira incondicional, deixando o compilador feliz.

**lib/src/blocs/provider.dart**

```dart
class Provider extends InheritedWidget{
  bool updateShouldNotify(covariant InheritedWidget oldWidget) => true;
}
```

## Covariância em Dart
Duration: 12:00

<aside class="positive">

**Nota.** Utilizamos a palavra reservada "**covariant**" do Dart. Como o nome sugere, ela serve para implementarmos o conceito de **covariância**. Ele está relacionado à maneira como os tipos de dados podem mudar (ou "variar") em relação uns aos outros através de hierarquias de herança ou de implementação de interfaces.

</aside>

Como exemplo, considere o seguinte cenário.

1. Há animais dos tipos Cachorro, Gato e Papagaio.
2. Cachorros e Papagaios podem fazer amizade com quaisquer tipos de animais.
3. Gatos somente fazem amizade com gatos.

Começamos escrevendo uma superclasse para representar todos os tipos. Visite o DartPad para fazer o teste a seguir.

[https://dartpad.dev/](https://dartpad.dev/)

**DartPad**

```dart
abstract class Animal{
  //lista de amigos, _ para encapsular (tipo o private)
  final _amigos = [];
  //animais têm um nome
  final nome;
  //construtor que recebe nome e atribui à variável de instância
  Animal(this.nome);
  //método sem corpo é abstrato
  void fazerAmizade(Animal a);
  //para as subclasses chamarem
  void adicionar(Animal a){
    _amigos.add(a);
  }
  //representação textual
  String toString(){
    return nome;
  }
  //exibimos os amigos para testar
  void exibir(){
    //a exibição da lista causa a exibição de cada bicho, o que causa a execução
    //do método toString
    print(_amigos);
  }
}
```

Depois, escrevemos as classes `Papagaio` e `Cachorro`. Testamos, mostrando que os cachorros topam ser amigos de todos, assim como os papagaios.

**DartPad**

```dart
abstract class Animal{
  ...
}

class Cachorro extends Animal{
  Cachorro(super.nome);
  void fazerAmizade(Animal a){
    adicionar(a);
  }
}

class Papagaio extends Animal{
  Papagaio(super.nome);
  void fazerAmizade(Animal a){
    adicionar(a);
  }
}

void main(){
  var c1 = Cachorro('Odie');
  var c2 = Cachorro('Luna');
  var p1 = Papagaio('Zazu');
  var p2 = Papagaio('Lola');
  //c1 é amigo de c2, e p2;
  c1.fazerAmizade(c2);
  c1.fazerAmizade(p2);
  //p1 também é amigo de c2 e p2
  p1.fazerAmizade(c2);
  p1.fazerAmizade(p2);
  //amizades duradouras
  c1.exibir();
  p1.exibir();
}
```

Veja o resultado, ao executar.

**Console (DartPad)**

```text
[Luna, Lola]
[Luna, Lola]
```

Para representar Gatos, escrevemos a seguinte classe. Observe que ela **não atende às regras de negócio**, pois admite que gatos façam amizade com outros tipos de bichos.

**DartPad**

```dart
abstract class Animal{
  ...
}

class Cachorro extends Animal{
  ...
}

class Papagaio extends Animal{
  ...
}

class Gato extends Animal{
  Gato(super.nome);
  //aceita qualquer tipo de animal, não pode!
  void fazerAmizade(Animal a){
    adicionar(a);
  }
}

void main(){
  var c1 = Cachorro('Odie');
  ...
  //amizades duradouras
  c1.exibir();
  p1.exibir();
  //Garfield amigo do Odie!!!!
  var g1 = Gato('Garfield');
  g1.fazerAmizade(c1);
  g1.exibir();
}
```

Execute e veja o resultado.

**Console (DartPad)**

```text
[Luna, Lola]
[Luna, Lola]
[Odie]
```

Para corrigir, tentamos ajustar a assinatura da sobrescrita do método `fazerAmizade` da classe `Animal`, trocando o tipo do bicho recebido como parâmetro. Agora somente gatos são aceitos.

**DartPad**

```dart
class Gato extends Animal{
  Gato(super.nome);
  //queríamos fazer isso, mas não funciona!
  void fazerAmizade(Gato a){
    adicionar(a);
  }
}
```

A coisa não funciona, pois não é mais uma sobrescrita válida. Veja o resultado quando tentamos executar.

**Console (DartPad)**

```text
Error: The parameter 'a' of the method 'Gato.fazerAmizade' has type 'Gato', wh...
 - 'Gato' is from 'package:dartpad_sample/main.dart' ('lib/main.dart').
 - 'Animal' is from 'package:dartpad_sample/main.dart' ('lib/main.dart').
  void fazerAmizade(Gato a){
                         ^
lib/main.dart:11:8:
Info: This is the overridden method ('fazerAmizade').
  void fazerAmizade(Animal a);
       ^
```

O próprio DartPad também aponta: `'Gato.fazerAmizade' ('void Function(Gato)') isn't a valid override of 'Animal.fazerAmizade' ('void Function(Animal)')`.

Ou seja, a covariância de tipo não acontece por padrão. Se um método recebe `Animal`, uma sobrescrita sua deve receber `Animal` também. É aí que entra a palavra `covariant`. Quando a utilizamos, estamos dizendo que este fenômeno é desejado neste caso. Ajuste como a seguir e teste novamente.

**DartPad**

```dart
...
class Gato extends Animal{
  Gato(super.nome);
  //agora funciona, por causa do covariant
  void fazerAmizade(covariant Gato a){
    adicionar(a);
  }
}
...
```

Ao executar, observe que o erro é outro. É justamente o que desejamos: o compilador não admite que tentemos fazer com que Gatos tenham amizade com outros bichos.

**Console (DartPad)**

```text
Error compiling to JavaScript:
lib/main.dart:71:19:
Error: The argument type 'Cachorro' can't be assigned to the parameter type 'Ga...
 - 'Cachorro' is from 'package:dartpad_sample/main.dart' ('lib/main.dart').
 - 'Gato' is from 'package:dartpad_sample/main.dart' ('lib/main.dart').
  g1.fazerAmizade(c1);
                  ^
Error: Compilation failed.
```

Para consertar, é preciso remover a linha a seguir.

**DartPad**

```dart
...
//Garfield não pode mais ser amigo do Odie
var g1 = Gato('Garfield');
//g1.fazerAmizade(c1);
g1.exibir();
...
```

## Provider: construtor, instância Bloc e o método of
Duration: 10:00

A classe `Provider` ainda não compila, pois a classe `InheritedWidget` não possui um construtor de lista de parâmetros vazia, e ele é chamado por padrão pelo construtor padrão de `Provider`. Por isso, vamos escrever um construtor que recebe dois parâmetros nomeados e os repassa para o construtor da superclasse (`InheritedWidget`):

- O primeiro é do tipo `Key` e é opcional (ainda não estamos usando esse recurso).
- O segundo é um Widget. É o Widget que será empacotado pelo Provider.

<aside class="positive">

**Nota.** Um objeto **Key** é um identificador de Widgets (e outros elementos). O Flutter pode utilizá-lo para decidir entre apenas atualizar parte da tela ou construir um novo Widget para ela, o que pode ter impacto no desempenho da aplicação. Se desejar, leia mais aqui: [https://api.flutter.dev/flutter/foundation/Key-class.html](https://api.flutter.dev/flutter/foundation/Key-class.html)

</aside>

Observe.

**lib/src/blocs/provider.dart**

```dart
import 'package:flutter/material.dart';
import 'bloc.dart';

class Provider extends InheritedWidget{

  Provider({Key? key, required Widget child}): super(key: key , child: child);

  bool updateShouldNotify(covariant InheritedWidget oldWidget) => true;
}
```

Um Provider precisa fornecer acesso a um Bloc ao Widget que ele pretende empacotar. Assim, nossa classe `Provider` terá uma instância de `Bloc`.

**lib/src/blocs/provider.dart**

```dart
import 'package:flutter/material.dart';
import 'bloc.dart';

class Provider extends InheritedWidget{

  Provider({Key? key, required Widget child}): super(key: key , child: child);

  final bloc = Bloc();

  bool updateShouldNotify(covariant InheritedWidget oldWidget) => true;
}
```

Eventualmente, os Widgets na árvore precisarão acessar o Bloc. Para isso, precisamos viabilizar que eles encontrem o `InheritedWidget` que possui o Bloc. De baixo para cima, é o primeiro `InheritedWidget` na árvore que eles possam encontrar.

![Árvore de Widgets em que vários Widgets abaixo de LoginTela, em diferentes níveis, sobem na árvore até o InheritedWidget mais próximo para acessar a instância Bloc de escopo restrito; uma nota diz que, para acessar o Bloc, os Widgets na árvore precisam de acesso ao InheritedWidget que esteja mais próximo deles](img/busca-inheritedwidget.webp)

*Os Widgets buscam, de baixo para cima, o InheritedWidget mais próximo.*

### O método of

Para resolver este problema, aplicamos uma convenção bastante comum.

- Escrevemos um método chamado "**of**".
- Ele recebe um `BuildContext` (pois ele dá acesso ao método que realiza a obtenção do `InheritedWidget` de interesse, na árvore).
- Ele devolve o dado de interesse (o Bloc inteiro, neste caso).
- Ele é **estático**, para que não seja necessário construir uma instância para chamá-lo.
- O método `of` usa o método `dependOnInheritedWidgetOfExactType` de `BuildContext` para obter o primeiro `InheritedWidget` da árvore e dele acessar o Bloc, devolvendo-o a seguir.

<aside class="positive">

**Nota.** O nome `of` é apenas uma convenção. Esse nome não é obrigatório. Seu uso está associado à funcionalidade de busca de uma instância de (*of*) algum tipo de dado ou objeto na árvore.

</aside>

- Quando olhamos para um Widget e, a partir dele, tentamos encontrar um `InheritedWidget` "subindo" na árvore, é possível que não encontremos nenhum. Assim, o método `dependOnInheritedWidgetOfExactType` pode devolver `null`. Utilizamos o operador "`!`" dizendo ao Dart que garantimos que a expressão será diferente de `null`. Em outras palavras, saltamos do bote que não afunda e topamos nos molhar, garantindo ao Dart que sabemos nadar. Se não soubermos (se a expressão for `null`), o Dart lava as mãos (nós mesmos dissemos que ele pode fazer isso quando saltamos do bote) e a gente se afoga (tomamos uma *NullPointerException*). Ou seja, falamos explicitamente a ele que estamos dispostos a lidar com `null`.

A figura a seguir mostra uma propriedade importante a respeito do objeto `BuildContext`. Cada Widget tem o seu próprio contexto e, a partir de seu contexto, um Widget pode obter o contexto do seu antecessor. É o que viabiliza a busca de baixo para cima, na árvore.

![À esquerda, uma árvore de Widgets qualquer: App, MaterialApp, Scaffold e LoginTela. À direita, a mesma árvore com os contexts destacados em caixas aninhadas: o contexto do LoginTela tem acesso ao contexto do Scaffold, que tem acesso ao do MaterialApp, que tem acesso ao do App](img/buildcontext-arvore.webp)

*Cada contexto tem acesso ao contexto do seu antecessor.*

Veja como fica o código.

**lib/src/blocs/provider.dart**

```dart
import 'package:flutter/material.dart';
import 'bloc.dart';

class Provider extends InheritedWidget{

  Provider({Key? key, required Widget child}): super(key: key , child: child);

  final bloc = Bloc();

  bool updateShouldNotify(covariant InheritedWidget oldWidget) => true;

  static Bloc of (BuildContext context){
    //o operador ! garante que a expressão que o antecede
    //(context.dependOnInheritedWidgetOfExactType<Provider>(), neste caso) é diferente
    //de null podemos acessar a propriedade bloc sem casting pois a classe é genérica
    //(informamos o tipo <Provider>)
    return context.dependOnInheritedWidgetOfExactType<Provider>()!.bloc;
  }

}
```

## Substituindo a instância global por instâncias de escopo restrito
Duration: 10:00

Em nossa primeira implementação, utilizamos uma única instância Bloc de escopo global. Agora que terminamos de implementar um Provider, vamos substituir esta implementação por aquela em que fazemos uso de múltiplas instâncias Bloc de escopo restrito.

O primeiro passo é empacotar o Widget `MaterialApp` com um `Provider`. Isso pode ser feito no arquivo em que ele foi definido: **app.dart**.

**lib/src/app.dart**

```dart
import 'package:flutter/material.dart';
import '../src/telas/login_tela.dart';
//importamos o arquivo provider
import 'blocs/provider.dart';

class App extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    //empacotamos o MaterialApp com um Provider
    return Provider(
      child: MaterialApp(
        title: 'Login',
        home: Scaffold(
          body: LoginTela(),
        )
      )
    );
  }
}
```

Não vamos mais utilizar a instância Bloc global. Sempre que precisarmos de uma instância Bloc, vamos construir um Provider. Cada Provider já nasce com a instância Bloc que promete fornecer. Por isso, no arquivo **bloc.dart**, vamos apagar a instância global.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';
import 'validators.dart';
class Bloc with Validators{
  ...
}

//essa é a instância global e ela não será mais usada, pode apagar ou comentar
//final bloc = Bloc();
```

Abra o arquivo **login_tela.dart** para perceber que o bloc global não está mais disponível: o VS Code passa a apontar erros em todos os usos de `bloc` (por exemplo, `bloc.email`, `bloc.changeEmail`, `bloc.password` e `bloc.changePassword`).

Para ajustar, começamos importando o arquivo **provider.dart** no arquivo **login_tela.dart**. Embora não mais utilizemos a instância global (até porque ela nem existe mais), vamos manter a importação do arquivo **bloc.dart**. Daqui a pouco vamos aplicar o tipo `Bloc` em variáveis recebidas por métodos internos.

**lib/src/telas/login_tela.dart**

```dart
import 'package:flutter/material.dart';
import '../blocs/bloc.dart';
import '../blocs/provider.dart';

class LoginTela extends StatelessWidget{
  ...
```

Depois disso, obtemos a instância Bloc utilizando o método `of` do `Provider`. Ele recebe um `BuildContext` e, felizmente, estamos num método (`build`) que tem acesso a um.

**lib/src/telas/login_tela.dart**

```dart
...
class LoginTela extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    final bloc = Provider.of(context);
    return Container(
      //20 pixels de margem esquerda, direita, em cima e embaixo
      margin: EdgeInsets.all(20.0),
...
```

Os Widgets que precisam acessar a instância Bloc são construídos por métodos separados, altamente coesos. Eles não têm acesso à instância Bloc obtida, já que ela foi definida pelo método `build`. Dado que o método `build` os chama, ele pode entregar a instância Bloc como argumento. Claro, a lista de parâmetros de cada um deve ser ajustada de acordo.

**lib/src/telas/login_tela.dart**

```dart
...
Widget build(BuildContext context) {
  final bloc = Provider.of(context);
  return Container(
    //20 pixels de margem esquerda, direita, em cima e embaixo
    margin: EdgeInsets.all(20.0),
    child: Column(
      children: [
        emailField(bloc),
        passwordField(bloc),
        Container(
          margin: EdgeInsets.only(top: 12.0),
          child: Row(
...
}

Widget emailField(Bloc bloc){
  return StreamBuilder(
  ...
}

Widget passwordField(Bloc bloc){
  return StreamBuilder(
  ...
}

Widget submitButton(){
  ...
}
```

Certifique-se de que a aplicação está em execução para fazer novos testes.

**Terminal (VS Code)**

```bash
flutter run
```

Veja como deve ficar com e-mail e senha inválidos.

![Tela de login com o e-mail fwa e a mensagem E-mail inválido, e a senha com três caracteres e a mensagem Senha deve ter, pelo menos, 4 caracteres](img/provider-invalidos.webp)

*E-mail e senha inválidos.*

E agora com e-mail e senha válidos.

![Tela de login com o e-mail teste@email.com e uma senha de quatro caracteres, sem mensagens de erro](img/provider-validos.webp)

*E-mail e senha válidos.*

## Submissão do form: manipulando dois streams
Duration: 10:00

Desejamos permitir que o form seja enviado apenas quando o form estiver num **estado válido**. Ou seja, quando seus dois campos contiverem valores condizentes com as validações realizadas. Para isso, precisamos olhar para ambos os streams do Bloc. Lembre-se que eles funcionam assim:

- Quando há um erro, o método `addError` é chamado.
- Quando não há erro algum, o método `add` é chamado.

Veja um exemplo conforme o tempo passa, quando o usuário digita uma senha.

![Linha do tempo com o usuário digitando a senha 123456: ao digitar 1, 2 e 3 o método chamado é addError; ao digitar 4, 5 e 6 o método chamado é add, pois o validador de senha considera que apenas senhas com pelo menos 4 caracteres são válidas](img/linha-tempo-senha.webp)

*Métodos chamados enquanto o usuário digita a senha.*

O mesmo vale para o validador de e-mail. Veja.

![Linha do tempo com o usuário digitando o e-mail teste@email.com: a cada caractere até o ponto o método chamado é addError; a partir do "c" depois do ponto, o método chamado é add, pois o validador de e-mail que utilizamos apenas considera válido um e-mail que tenha uma letra depois do ponto](img/linha-tempo-email.webp)

*Métodos chamados enquanto o usuário digita o e-mail.*

Precisamos encontrar uma forma de manipular os dois streams simultaneamente. Talvez você pense em construir o botão empacotado por um `StreamBuilder`. Seu Stream seria um dos dois, de e-mail ou de senha. Para desabilitar o botão, bastaria associar `null` à sua propriedade `onPressed`. Ou seja, quando o método `hasError` devolvesse `true`, associaríamos `null` a ela. Quando ele devolvesse `false`, associaríamos uma função. Depois disso, poderíamos empacotar o `StreamBuilder` utilizando outro `StreamBuilder`, a fim de condicionar a exibição do botão à validação do outro campo. Veja como ficaria. É uma ideia razoável, verdade. Estamos no arquivo **login_tela.dart**.

**lib/src/telas/login_tela.dart**

```dart
...
Widget submitButton(Bloc bloc){
  return StreamBuilder(
    //tentando usar o stream de email
    stream: bloc.email,
    builder: (context, AsyncSnapshot<String> snapshot){
      return ElevatedButton(
        //se tiver erro, associamos null à propriedade onPressed, desabilitando o botão
        onPressed: snapshot.hasError ? null : (){},
        child: Text('Login'),
      );
    }
  );
}
...
```

Embora razoável, essa ideia não funciona. Veja a mensagem de erro.

![A aplicação exibindo, no lugar do botão, uma caixa vermelha com a mensagem Bad state: Stream has already been listened to.](img/erro-stream-listened.webp)

*Erro: Bad state: Stream has already been listened to.*

Ela revela que somente podemos "escutar" o resultado de um stream uma única vez. Está tudo bem. Você foi um tanto criativo com essa ideia! Precisamos de uma alternativa. Por isso, volte a implementação ao que tínhamos antes.

**lib/src/telas/login_tela.dart**

```dart
...
Widget submitButton(Bloc bloc){
  return ElevatedButton(
    onPressed:(){},
    child: Text('Login'),
  );
}
...
```

## O pacote RxDart e a combinação de streams
Duration: 12:00

O pacote **rxDart** é uma espécie de extensão à API de Streams e de processamento assíncrono do Dart. Veja a sua página no pub.dev.

[https://pub.dev/packages/rxdart](https://pub.dev/packages/rxdart)

E um trecho que o descreve sucintamente.

> "RxDart extends the capabilities of Dart Streams and StreamControllers. Dart comes with a very decent Streams API out-of-the-box; rather than attempting to provide an alternative to this API, RxDart adds functionality from the reactive extensions specification on top of it. RxDart does not provide its Observable class as a replacement for Dart Streams. Instead, it offers several additional Stream classes, operators (extension methods on the Stream class), and Subjects."

Observe, também, que RxDart é uma implementação Dart da API **ReactiveX**. Trata-se de uma API para programação assíncrona utilizando streams "observáveis". Ou seja, a sua implementação se baseia no clássico padrão de projeto **Observer**. Veja a sua página oficial.

[https://reactivex.io/](https://reactivex.io/)

Há implementações de ReactiveX para diversas linguagens de programação. Veja a lista de linguagens para as quais há uma implementação de ReactiveX.

[https://reactivex.io/languages.html](https://reactivex.io/languages.html)

No momento em que este documento foi escrito, as linguagens para as quais havia uma implementação de ReactiveX eram as seguintes.

- Java: RxJava
- JavaScript: RxJS
- C#: Rx.NET
- C#(Unity): UniRx
- Scala: RxScala
- Clojure: RxClojure
- C++: RxCpp
- Lua: RxLua
- Ruby: Rx.rb
- Python: RxPY
- Go: RxGo
- Groovy: RxGroovy
- JRuby: RxJRuby
- Kotlin: RxKotlin
- Swift: RxSwift
- PHP: RxPHP
- Elixir: reaxive
- Dart: RxDart

Vamos utilizar o pacote RxDart, implementação de ReactiveX em Dart, para resolver o problema de habilitar/desabilitar o botão em função dos streams que já possuímos. Para isso, temos a intenção de, de alguma forma, "**combinar**" ou "mesclar" os streams a fim de que saibamos sobre o estado deles a partir de um único objeto. Veja a figura a seguir.

![As linhas do tempo do e-mail teste@email.com e da senha 123456 lado a lado; uma linha tracejada marca o momento, ao digitar o "c" depois do ponto, em que ambos os streams passam a chamar add, com a nota: este é o momento em que desejamos ser notificados quanto à validade do form completo, ambos os streams reportam isso](img/combinar-streams.webp)

*A ideia: combinar os dois streams.*

### Combinação de Streams

Para combinar os streams, vamos usar a classe **CombineLatestStream**. Veja a sua documentação.

[https://pub.dev/documentation/rxdart/latest/rx/CombineLatestStream-class.html](https://pub.dev/documentation/rxdart/latest/rx/CombineLatestStream-class.html)

O link a seguir mostra um gráfico interativo que ilustra a combinação de dois streams. Ajuste os valores numéricos e letras e veja o resultado na última linha.

[https://rxmarbles.com/#combineLatest](https://rxmarbles.com/#combineLatest)

![Diagrama interativo do RxMarbles: duas linhas do tempo, uma com números e outra com letras, combinadas por combineLatest((x, y) => "" + x + y) numa terceira linha com os pares resultantes](img/rxmarbles.webp)

*O combineLatest no RxMarbles.*

Da classe `CombineLatestStream`, queremos usar o método **combine2**, já que temos 2 streams para combinar. Veja o exemplo da documentação ("Example with a specific number of Streams": *If you wish to combine a specific number of Streams together with proper types information for the value of each Stream, use the combine2 - combine9 operators.*).

**Exemplo da documentação do rxdart**

```dart
CombineLatestStream.combine2(
  Stream.fromIterable([1]),
  Stream.fromIterable([2, 3]),
  (a, b) => a + b,
)
.listen(print); // prints 3, 4
```

O exemplo mostra que a função `combine2` espera três argumentos:

- o primeiro Stream;
- o segundo Stream;
- uma função que explica como se dá a combinação dos valores produzidos pelos streams.

Para instalar o pacote, use

**Terminal (VS Code)**

```bash
flutter pub add rxdart
```

Veja a saída esperada.

**Terminal (VS Code)**

```text
gerenciamento_de_estado $ flutter pub add rxdart
Resolving dependencies...
  collection 1.17.2 (1.18.0 available)
  flutter_lints 2.0.3 (3.0.1 available)
  lints 2.1.1 (3.0.0 available)
  material_color_utilities 0.5.0 (0.8.0 available)
  meta 1.9.1 (1.11.0 available)
+ rxdart 0.27.7
  stack_trace 1.11.0 (1.11.1 available)
  stream_channel 2.1.1 (2.1.2 available)
  test_api 0.6.0 (0.6.1 available)
  web 0.1.4-beta (0.3.0 available)
Changed 1 dependency!
```

Abra o seu arquivo **pubspec.yaml** e repare que a dependência foi adicionada por ali.

**pubspec.yaml**

```yaml
dependencies:
  flutter:
    sdk: flutter
  email_validator: '^2.1.16'


  # The following adds the Cupertino Icons font to your application.
  # Use with the CupertinoIcons class for iOS style icons.
  cupertino_icons: ^1.0.2
  rxdart: ^0.27.7
```

<aside class="positive">

**Nota.** A instalação também poderia ter sido realizada adicionando a dependência manualmente ao arquivo **pubspec.yaml** e, então, executando-se o comando `flutter pub get`.

</aside>

Para usar as funcionalidades do pacote, precisamos importá-lo no arquivo **bloc.dart**.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';
import 'validators.dart';
import 'package:rxdart/rxdart.dart';
class Bloc with Validators{
  ...
```

### O stream combinado

A seguir, escrevemos um novo método getter. Ele devolve um stream que representa a combinação dos já existentes (e-mail e password), operando da seguinte forma.

- Ele responde se o botão submit pode ser habilitado.
- Aquilo que ele produz não será realmente de interesse: o conteúdo combinado dos dois streams originais não é de interesse para a decisão sobre habilitar ou não o botão. Assim, vamos apenas devolver algo como `true`, indicando que "sim, o form pode ser enviado". Isso faz sentido, pois a emissão do stream combinado somente vai acontecer quando os demais fizerem uma emissão.

Ainda no arquivo **bloc.dart**, escrevemos o novo stream.

**lib/src/blocs/bloc.dart**

```dart
...
class Bloc with Validators{
  //StreamController vem do pacote dart:async
  final _emailController = StreamController<String>();
  final _passwordController = StreamController<String>();

  Stream<String> get email => _emailController.stream.transform(validateEmail);

  Stream<String> get password => _passwordController.stream.transform(validatePassword);

  Stream<bool> get emailPasswordAreOk => CombineLatestStream.combine2(email, password, (e, p) => true);

  Function(String) get changeEmail => _emailController.sink.add;

  Function(String) get changePassword => _passwordController.sink.add;

  void dispose(){
    _emailController.close();
    _passwordController.close();
  }
}
...
```

De volta ao arquivo **login_tela.dart**, passamos a utilizar o novo stream. O primeiro passo é "empacotar" o botão utilizando um `StreamBuilder`. Claro, entregando o stream combinado como parâmetro a ele. Observe.

**lib/src/telas/login_tela.dart**

```dart
...
Widget submitButton(Bloc bloc){
  return StreamBuilder(
    stream: bloc.emailPasswordAreOk,
    builder: (context, snapshot){
      return ElevatedButton(
        onPressed: (){},
        child: Text('Login'),
      );
    },
  );
}
...
```

Mantendo o padrão dos demais, vamos utilizar o sistema de tipos estático com o snapshot. Ele é um `AsyncSnapshot<bool>`.

**lib/src/telas/login_tela.dart**

```dart
...
Widget submitButton(Bloc bloc){
  return StreamBuilder(
    stream: bloc.emailPasswordAreOk,
    builder: (context, AsyncSnapshot<bool> snapshot){
      return ElevatedButton(
        onPressed: (){},
        child: Text('Login'),
      );
    },
  );
}
...
```

Para desabilitar o botão, lembre-se mais uma vez das propriedades que um `AsyncSnapshot` possui, visitando a sua documentação, se necessário (ou consulte a imagem a seguir).

[https://api.flutter.dev/flutter/widgets/AsyncSnapshot-class.html](https://api.flutter.dev/flutter/widgets/AsyncSnapshot-class.html)

![Trecho da documentação de AsyncSnapshot com as propriedades data, error, hasData e hasError](img/asyncsnapshot-doc.webp)

*Propriedades de AsyncSnapshot.*

Um método que resolve o nosso problema é o `hasError`. Ele resulta em

- `true`, se um dos dois streams tiver erro;
- `false`, caso contrário.

Com esse valor, decidimos entre

- associar `null` à propriedade `onPressed` do botão, o que faz com que ele seja desabilitado;
- associar uma função, tornando-o clicável.

**lib/src/telas/login_tela.dart**

```dart
...
Widget submitButton(Bloc bloc){
  return StreamBuilder(
    stream: bloc.emailPasswordAreOk,
    builder: (context, AsyncSnapshot<bool> snapshot){
      return ElevatedButton(
        onPressed: snapshot.hasError ? null : (){},
        child: Text('Login'),
      );
    },
  );
}
...
```

Lembre-se de passar o bloc também na chamada: no método `build`, troque `submitButton()` por `submitButton(bloc)`.

## Broadcast streams e o método hasData
Duration: 10:00

Execute a aplicação

**Terminal (VS Code)**

```bash
flutter run
```

para ver que isso não funciona. O terminal exibe o erro a seguir.

**Terminal (VS Code)**

```text
Error: Bad state: Stream has already been listened to.
```

### Broadcast streams

Embora estejamos combinando streams, estamos de volta ao ponto em que - dessa vez, indiretamente - estamos tentando nos registrar junto a um stream mais de uma vez. Isso não é possível, a menos que tenhamos um stream capaz de fazer **broadcast**. A documentação da classe `Stream` explica o fenômeno.

[https://api.flutter.dev/flutter/dart-async/Stream-class.html](https://api.flutter.dev/flutter/dart-async/Stream-class.html)

> There are two kinds of streams: "Single-subscription" streams and "broadcast" streams.
>
> *A single-subscription stream* allows only a single listener during the whole lifetime of the stream. [...]
>
> Listening twice on a single-subscription stream is not allowed, even after the first subscription has been canceled.
>
> [...]
>
> *A broadcast stream* allows any number of listeners, and it fires its events when they are ready, whether there are listeners or not.
>
> [...]
>
> If several listeners want to listen to a single-subscription stream, use asBroadcastStream to create a broadcast stream on top of the non-broadcast stream.

Felizmente, podemos converter um "single-subscription stream" em um "broadcast stream" de maneira muito simples. Vá até o arquivo **bloc.dart** e chame o método `broadcast` na construção dos objetos `StreamController`.

**lib/src/blocs/bloc.dart**

```dart
class Bloc with Validators{
  //StreamController vem do pacote dart:async
  final _emailController = StreamController<String>.broadcast();
  final _passwordController = StreamController<String>.broadcast();

  Stream<String> get email => _emailController.stream.transform(validateEmail);

  Stream<String> get password => _passwordController.stream.transform(validatePassword);

  Stream<bool> get emailPasswordAreOk => CombineLatestStream.combine2(email, password, (e, p) => true);
...
```

Faça novo hot restart (**SHIFT + R**) e veja o resultado. O botão nasce habilitado. Porém, faça algumas edições nos campos, fazendo com que ele seja desabilitado. Por fim, digite valores válidos nos dois campos, tornando o botão habilitado novamente.

Botão nasce habilitado (isso acontece pois, quando a aplicação inicia, nenhum stream emitiu erro algum):

![Tela de login com os campos vazios e o botão Login habilitado](img/botao-habilitado-inicio.webp)

*O botão nasce habilitado.*

Se um dos campos estiver inválido, isso desabilita o botão.

![Tela de login com o e-mail "a", a mensagem E-mail inválido e o botão Login desabilitado, em cinza](img/botao-desabilitado.webp)

*Com um campo inválido, o botão é desabilitado.*

Digitar valores válidos nos dois campos faz com que o botão seja habilitado novamente.

![Tela de login com o e-mail teste@email.com, uma senha de quatro caracteres e o botão Login habilitado](img/botao-habilitado.webp)

*Com os dois campos válidos, o botão volta a ficar habilitado.*

### Trocando hasError por hasData

Claro, queremos que o botão nasça desabilitado, afinal, não desejamos que o usuário seja capaz de enviar um form com campos vazios. Para isso, vamos trocar o método `hasError` pelo método **hasData**, pois

- quando a aplicação inicia, nenhum stream emitiu valor algum, o método `hasData` devolve `false` e não habilitamos o botão;
- quando um campo está inválido, o método `hasError` devolve `true` e, portanto, o método `hasData` devolve `false`;
- quando ambos os campos estão válidos, o método `hasError` devolve `false` e, portanto, o método `hasData` devolve `true`.

O funcionamento do método `hasData` é exatamente o que precisamos para decidir sobre a renderização do botão, incluindo o momento de nascimento da aplicação. Claro, precisamos "inverter" a função e o valor `null` no ternário.

**lib/src/telas/login_tela.dart**

```dart
...
Widget submitButton(Bloc bloc){
  return StreamBuilder(
    stream: bloc.emailPasswordAreOk,
    builder: (context, AsyncSnapshot<bool> snapshot){
      return ElevatedButton(
        onPressed: snapshot.hasData ? (){} : null,
        child: Text('Login'),
      );
    },
  );
}
...
```

Faça novo **SHIFT + R** e novos testes, especialmente observando a aplicação quando ela nasce, com algum campo com valor inválido e com os dois campos com valores válidos.

## Acessando os valores com BehaviorSubject
Duration: 10:00

Quando o usuário clicar no botão e ele se encontrar num estado válido, desejamos acessar os valores digitados para enviar a um servidor. Mas como fazê-lo? Utilizando o Bloc, vamos fazer a definição da função - seu processamento não tem muito a ver com interface gráfica, certo? - de maneira isolada. Começamos escrevendo um novo método no arquivo **bloc.dart**.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';
import 'validators.dart';
import 'package:rxdart/rxdart.dart';
class Bloc with Validators{
  //StreamController vem do pacote dart:async
  final _emailController = StreamController<String>.broadcast();
  final _passwordController = StreamController<String>.broadcast();

  Stream<String> get email => _emailController.stream.transform(validateEmail);

  Stream<String> get password => _passwordController.stream.transform(validatePassword);

  Stream<bool> get emailPasswordAreOk => CombineLatestStream.combine2(email, password, (e, p) => true);

  Function(String) get changeEmail => _emailController.sink.add;

  Function(String) get changePassword => _passwordController.sink.add;

  void submitForm(){

  }

  void dispose(){
    _emailController.close();
    _passwordController.close();
  }
}
```

A seguir, no arquivo **login_tela.dart**, podemos chamar a função quando o botão for clicado.

**lib/src/telas/login_tela.dart**

```dart
...
Widget submitButton(Bloc bloc){
  return StreamBuilder(
    stream: bloc.emailPasswordAreOk,
    builder: (context, AsyncSnapshot<bool> snapshot){
      return ElevatedButton(
        onPressed: snapshot.hasData ? bloc.submitForm : null,
        child: Text('Login'),
      );
    },
  );
}
...
```

Entretanto, os valores digitados pelo usuário são emitidos pelos streams e somente podem ser obtidos por meio dos objetos de tipo `AsyncSnapshot`. E eles se encontram justamente no arquivo (**login_tela.dart**) de onde acabamos de remover a definição da função.

Para obtê-los, vamos utilizar um novo recurso da API rxDart. Veja a sua documentação.

[https://pub.dev/documentation/rxdart/latest/rx/BehaviorSubject-class.html](https://pub.dev/documentation/rxdart/latest/rx/BehaviorSubject-class.html)

> **BehaviorSubject&lt;T&gt; class**
>
> A special StreamController that captures the latest item that has been added to the controller, and emits that as the first item to any new listener.
>
> This subject allows sending data, error and done events to the listener. The latest item that has been added to the subject will be sent to any new listeners of the subject. After that, any new events will be appropriately sent to the listeners. It is possible to provide a seed value that will be emitted if no items have been added to the subject.
>
> BehaviorSubject is, by default, a broadcast (aka hot) controller, in order to fulfill the Rx Subject contract. This means the Subject's `stream` can be listened to multiple times.

A primeira frase diz coisas muito importantes.

- Um `BehaviorSubject` nada mais é do que um tipo específico de `StreamController`.
- Diferente do que acontece com os `StreamController`s "comuns" que temos utilizado, eles têm a habilidade de capturar um item já emitido e entregar a um novo objeto que esteja interessado nele.

Observe, ainda na documentação, que um `BehaviorSubject` é um controller "broadcast". Fundamental para que ele possa funcionar da forma como promete. Lembra-se que havíamos convertido nosso "single-subscription stream" em um "broadcast stream"? Dada a natureza do `BehaviorSubject` descrita na sua documentação, isso não será mais necessário.

O pequeno exemplo que a documentação mostra é um tanto intuitivo. Observe.

**Exemplo da documentação do rxdart**

```dart
final subject = BehaviorSubject<int>();

subject.add(1);
subject.add(2);
subject.add(3);

subject.stream.listen(print); // prints 3
subject.stream.listen(print); // prints 3
subject.stream.listen(print); // prints 3
```

A alteração é, portanto, um tanto simples. No arquivo **bloc.dart**, troque o tipo dos controllers: eles deixam de ser do tipo `StreamController` e passam a ser do tipo `BehaviorSubject`. Lembre-se de que não é mais necessário chamar o método `broadcast`.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';
import 'validators.dart';
import 'package:rxdart/rxdart.dart';
class Bloc with Validators{
  //StreamController vem do pacote dart:async
  //BehaviorSubject vem do pacote rxdart
  final _emailController = BehaviorSubject<String>();
  final _passwordController = BehaviorSubject<String>();
  ...
```

Ainda no arquivo **bloc.dart**, agora podemos implementar o método de envio fictício do form, graças à funcionalidade provida pelo `BehaviorSubject`. Para encontrar o último valor emitido por ele, basta usar a sua propriedade `value`.

**lib/src/blocs/bloc.dart**

```dart
class Bloc with Validators{
  ...
  void submitForm(){
    final email = _emailController.value;
    final password = _passwordController.value;
    print('$email, $password');
  }
  ...
}
```

Faça novo hot restart (**SHIFT + R**), digite valores válidos nos dois campos, clique no botão e veja o resultado no terminal.

![VS Code com o arquivo bloc.dart aberto e, no terminal, a linha teste@email.com, 1234 impressa pelo submitForm; ao lado, a aplicação no Chrome com o e-mail teste@email.com, a senha e o botão Login](img/submit-terminal.webp)

*Os valores de e-mail e senha exibidos no terminal.*

## Exibindo os valores num Toast
Duration: 10:00

Talvez queiramos exibir os valores num **Toast**.

<aside class="positive">

**Nota.** Toast vem de "torrada". É uma mensagem temporária que "sobe", aparecendo na tela, e depois de pouco tempo "desce". Como se fosse uma torrada pulando de uma torradeira.

</aside>

A fim de evitarmos reinventar a roda, façamos uma busca no pub.dev tentando encontrar algum pacote capaz de produzir um toast. Há inúmeras opções. Veja os resultados obtidos no momento em que esse documento foi escrito.

![Resultados da busca por toast no pub.dev, com diversos pacotes listados, incluindo o fluttertoast](img/pubdev-toast.webp)

*Busca por "toast" no pub.dev.*

O pacote "**fluttertoast**" parece ser o mais popular no momento. Vejamos se a sua página oficial oferece um exemplo de uso.

[https://pub.dev/packages/fluttertoast](https://pub.dev/packages/fluttertoast)

<aside class="negative">

**Cuidado.** O teste a seguir foi realizado num emulador. Com o código de exemplo, esse Toast somente funciona em emuladores ou dispositivos reais. Não funciona na Web. Vale olhar os exemplos na documentação e também buscar por outros pacotes para a web.

</aside>

Sim! Há um exemplo um tanto intuitivo (seção "Toast with No Build Context (Android & iOS)" da página do pacote).

**Exemplo da documentação do fluttertoast**

```dart
Fluttertoast.showToast(
        msg: "This is Center Short Toast",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.CENTER,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0
    );
```

Observe que a documentação também mostra como fazer a instalação do pacote e como fazer o import no código.

```yaml
# add this line to your dependencies
fluttertoast: ^8.2.2
```

```dart
import 'package:fluttertoast/fluttertoast.dart';
```

Num terminal do VS Code, use

**Terminal (VS Code)**

```bash
flutter pub add fluttertoast
```

Veja o resultado esperado.

**Terminal (VS Code)**

```text
gerenciamento_de_estado $ flutter pub add fluttertoast
Resolving dependencies...
  collection 1.17.2 (1.18.0 available)
  flutter_lints 2.0.3 (3.0.1 available)
+ flutter_web_plugins 0.0.0 from sdk flutter
+ fluttertoast 8.2.2
  lints 2.1.1 (3.0.0 available)
  material_color_utilities 0.5.0 (0.8.0 available)
  meta 1.9.1 (1.11.0 available)
  stack_trace 1.11.0 (1.11.1 available)
  stream_channel 2.1.1 (2.1.2 available)
  test_api 0.6.0 (0.6.1 available)
  web 0.1.4-beta (0.3.0 available)
Changed 2 dependencies!
```

Investigue, também, seu arquivo **pubspec.yaml** e certifique-se de que a dependência apareceu por lá (por razões didáticas apenas. Não há motivo algum para ela não estar. É o comportamento padrão da ferramenta pub).

**pubspec.yaml**

```yaml
dependencies:
  flutter:
    sdk: flutter
  email_validator: '^2.1.16'


  # The following adds the Cupertino Icons font to your application.
  # Use with the CupertinoIcons class for iOS style icons.
  cupertino_icons: ^1.0.2
  rxdart: ^0.27.7
  fluttertoast: ^8.2.2
```

No arquivo **bloc.dart**, importamos o pacote e utilizamos o exemplo da documentação. Observe que vamos utilizar a classe `Colors` do Flutter. Por isso, importamos o Flutter também.

**lib/src/blocs/bloc.dart**

```dart
import 'dart:async';
import 'validators.dart';
import 'package:rxdart/rxdart.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:flutter/material.dart';
class Bloc with Validators{
  ...
  void submitForm(){
    final email = _emailController.value;
    final password = _passwordController.value;
    //print('$email, $password');
    Fluttertoast.showToast(
      msg: 'E-mail: $email, Password: $password',
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.CENTER,
      timeInSecForIosWeb: 1,
      backgroundColor: Colors.blue,
      textColor: Colors.white,
      fontSize: 16.0
    );
  }

  void dispose(){
    _emailController.close();
    _passwordController.close();
  }
}
```

Os nomes das propriedades do Toast são auto-explicativos. Inspecione a documentação e troque os valores das propriedades!

Faça novo teste.

- **SHIFT + R** no terminal.
- Digite valores válidos nos dois campos.
- Clique no botão.
- Veja o Toast.

![Aplicação em execução num emulador Android com os campos preenchidos e, no centro da tela, um Toast azul com o texto E-mail: teste@email.com, Password: 12345](img/toast.webp)

*O Toast exibindo o e-mail e a senha.*

## Exercícios
Duration: 30:00

### Exercício: gerenciador de contatos

Escreva uma nova aplicação Flutter com as seguintes características.

- Dois campos textuais em que o usuário pode digitar nome e telefone de um contato seu.
- Uma lista que mostra o nome e o telefone de cada contato.
- Um botão que permite o cadastro de um contato.
- Somente nomes válidos podem ser cadastrados. Um nome é válido somente se
  - começa com maiúscula;
  - tem, pelo menos, três letras;
  - tem, pelo menos, um sobrenome.
- Somente números válidos podem ser cadastrados. Um número é válido somente se
  - está no formato (xx) xxxxx-xxxx (o usuário tem que digitar todos os símbolos).
- Validações feitas com uma única instância Bloc global.
- Refatoração utilizando Bloc com múltiplas instâncias de escopo restrito.

<details><summary>Ver resposta</summary>

Comece criando uma aplicação.

<aside class="positive">

**Nota.** O código completo se encontra em [https://github.com/professorbossini/20232_pessoal_flutter_bloc_contatos_improve_it.git](https://github.com/professorbossini/20232_pessoal_flutter_bloc_contatos_improve_it.git)

</aside>

**Terminal**

```bash
flutter create gerenciador_de_contatos
```

Vincule o VS Code à pasta criada.

**Terminal**

```bash
code .
```

Clique **Terminal >> New Terminal** e abra um terminal interno do VS Code. Execute a aplicação.

**Terminal (VS Code)**

```bash
flutter run
```

Crie a seguinte estrutura de arquivos e pastas.

- pasta **blocs**: abriga todo o conteúdo referente ao padrão Bloc
  - arquivo **bloc.dart**: definição da classe Bloc e eventual instância global
  - arquivo **validators.dart**: transformers de validação
- pasta **models**: abriga as classes de modelo (tipo POJOs em Java)
  - arquivo **contato_model.dart**: modelo que descreve o que é um contato (nome e número)
- pasta **telas**: abriga widgets que são telas
  - **contatos_tela.dart**: tela principal da aplicação, vai exibir os campos para entrada de dados, botão e a lista de contatos
- pasta **widgets**: abriga widgets diversos que não são telas
  - arquivo **contato_widget.dart**: widget para a exibição de um contato
  - arquivo **contatos_widget.dart**: widget para a exibição de uma lista de contatos

Podemos começar criando a classe que descreve o que é um contato, no arquivo **contato_model.dart**.

**lib/src/models/contato_model.dart**

```dart
class Contato{
  String _nome;
  String _numero;

  Contato(this._nome, this._numero);

  String get nome => _nome;
  String get numero => _numero;

  set nome(String nome) => _nome = nome;
  set numero(String numero) => _numero = numero;
}
```

A seguir, podemos definir o Bloc. Para tal, dado que ele será responsável por aplicar validações por meio de transformers, vamos começar definindo os validadores, no arquivo **validators.dart**. Observe como utilizamos expressões regulares para fazer as validações. Se quiser saber mais sobre elas, visite [https://api.flutter.dev/flutter/dart-core/RegExp-class.html](https://api.flutter.dev/flutter/dart-core/RegExp-class.html).

**lib/src/blocs/validators.dart**

```dart
import 'dart:async';

mixin Validators{
  //começa com maiúscula, tem, pelos menos, duas letras minúsculas antes de um espaço em branco obrigatório e um sobrenome a seguir (com pelo menos uma letra)
  static final regExpNome = RegExp('[A-Z][a-z]{2,} [A-Za-z]+');
  //começa com parênteses, tem dois dígitos, fecha parênteses, tem um espaço em branco, tem 5 dígitos, tem um traço, tem 4 dígitos
  static final regExpNumero = RegExp('^\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}\$');

  final validarNome = StreamTransformer<String, String>.fromHandlers(
    handleData: (nome, sink){
      //busca por todas as ocorrências da expressão regular no nome e verifica se tem só uma
      if (regExpNome.allMatches(nome).length == 1){
        sink.add(nome);
      }
      else{
        sink.addError('Nome deve começar com letra maiúscula, ter pelo menos 3 letras e um sobrenome');
      }
    }
  );

  final validarNumero = StreamTransformer<String, String>.fromHandlers(
    handleData: (numero, sink){
      //busca por todas as ocorrências da expressão regular no número e verifica se tem só uma
      if (regExpNumero.allMatches(numero).length == 1){
        sink.add(numero);
      }
      else{
        sink.addError('Número deve estar no formato (xx)xxxxx-xxxx');
      }
    }
  );
}
```

Depois disso, a definição do Bloc, no arquivo **bloc.dart**.

**lib/src/blocs/bloc.dart**

```dart
import 'validators.dart';
import 'dart:async';
import '../models/contato_model.dart';

class Bloc with Validators{
  //streams de validação
  final _nomeController = StreamController<String>();
  final _numeroController = StreamController<String>();
  Stream<String> get nome => _nomeController.stream.transform(validarNome);
  Stream<String> get numero => _numeroController.stream.transform(validarNumero);
  Function(String) get mudarNome => _nomeController.sink.add;
  Function(String) get mudarNumero => _numeroController.sink.add;

  //stream que lida com uma lista de contatos
  final _contatosController = StreamController<List<Contato>>();
  Stream<List<Contato>> get contatos => _contatosController.stream;

  //a lista de contatos
  List<Contato> _contatos = [];

  //adicionamos na lista e o sink a absorve a seguir
  void adicionarContato(Contato contato) {
    _contatos.add(contato);
    _contatosController.sink.add(_contatos);
  }

  void dispose(){
    _nomeController.close();
    _numeroController.close();
    _contatosController.close();
  }
}

//instância global do bloc
final bloc = Bloc();
```

Depois, implementamos a exibição de um Contato. Estamos no arquivo **contato_widget.dart**.

**lib/src/widgets/contato_widget.dart**

```dart
import 'package:flutter/material.dart';

//mostrar um contato com nome e numero
//cada contato deve ter uma borda clara entre nome e numero
//cada par nome/numero deve ser englobado num card com sombra
class ContatoWidget extends StatelessWidget {
  final String nome;
  final String numero;
  ContatoWidget(this.nome, this.numero);
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Container(
        padding: EdgeInsets.all(20.0),
        child: Column(
          children: [
            Text(
              nome,
              style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
            ),
            Container(
              margin: EdgeInsets.only(top: 10.0),
              child: Text(
                numero,
                style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
              )
            )
          ],
        ),
      ),
    );
  }
}
```

A seguir, escrevemos a classe de exibição de uma lista de contatos. Ela fica no arquivo **contatos_widget.dart**. Observe que os métodos que produzem os Widgets que constituem a tela tiveram a sua implementação omitida. Elas aparecem a seguir.

**lib/src/widgets/contatos_widget.dart**

```dart
import 'package:flutter/material.dart';
import '../blocs/bloc.dart';
import '../models/contato_model.dart';
import '../widgets/contato_widget.dart';

class ContatosWidget extends StatelessWidget {
  String nomeAtual = '';
  String numeroAtual = '';
  List<Contato> contatos = [Contato('Ana', '1')];
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.all(20.0),
      child: Column(
        children: <Widget>[
          nomeField(),
          numeroField(),
          Container(
            margin: EdgeInsets.only(top: 12.0),
            child: Row(
              children: <Widget>[
                Expanded(
                  child: submitButton(),
                ),
              ],
            ),
          ),
          contatosList()
        ],
      )
    );
  }

  Widget nomeField(){
    ...
  }

  Widget numeroField(){
    ...
  }

  Widget submitButton(){
    ...
  }

  Widget contatosList(){
    ...
  }
}
```

Veja a implementação de cada método.

**lib/src/widgets/contatos_widget.dart · nomeField e numeroField**

```dart
...
Widget nomeField(){
  return StreamBuilder(
    stream: bloc.nome,
    builder: (context, snapshot){
      return TextField(
        onChanged: (valor){
          bloc.mudarNome(valor);
          nomeAtual = valor;
        },
        keyboardType: TextInputType.name,
        decoration: InputDecoration(
          labelText: 'Nome',
          hintText: 'Digite seu nome',
          errorText: snapshot.hasError ? snapshot.error.toString() : null,
        ),
      );
    },
  );
}
...
Widget numeroField(){
  return StreamBuilder(
    stream: bloc.numero,
    builder: (context, snapshot){
      return TextField(
        onChanged: (valor){
          bloc.mudarNumero(valor);
          numeroAtual = valor;
        },
        keyboardType: TextInputType.number,
        decoration: InputDecoration(
          labelText: 'Número',
          hintText: 'Digite seu número',
          errorText: snapshot.hasError ? snapshot.error.toString() : null,
        ),
      );
    },
  );
}
...
```

**lib/src/widgets/contatos_widget.dart · submitButton e contatosList**

```dart
...
Widget submitButton(){
  return ElevatedButton(
    child: Text('Salvar'),
    onPressed: () => bloc.adicionarContato(Contato(nomeAtual, numeroAtual)),
  );
}
...
Widget contatosList(){
  return Container(
    margin: EdgeInsets.only(top: 12.0),
    child: StreamBuilder(
      stream: bloc.contatos,
      builder: (context, snapshot){
        if (snapshot.hasData){
          return Column(
            children: snapshot.data!.map<Widget>(
              (contato) => ContatoWidget(contato.nome, contato.numero)).toList(),
          );
        }
        else{
          return Text('Nenhum contato adicionado');
        }
      },
    ),
  );
}
...
```

No arquivo **contatos_tela.dart**, definimos a tela principal. Ela apenas exibe um `ContatosWidget` e controla as margens para que o conteúdo não fique colado nas bordas da tela do dispositivo.

**lib/src/telas/contatos_tela.dart**

```dart
import 'package:flutter/material.dart';
import '../widgets/contatos_widget.dart';

class ContatosTela extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.all(20.0),
      child: Column(
        children: [
          ContatosWidget(),
        ],
      )
    );
  }
}
```

O Widget `App`, definido no arquivo **app.dart**, se encarrega da estrutura clássica, com um `MaterialApp` e um `Scaffold`.

**lib/src/app.dart**

```dart
import 'package:contatos_com_bloc/src/telas/contatos_tela.dart';
import 'package:flutter/material.dart';

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Contatos',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: Scaffold(
        body: ContatosTela(),
      ),
    );
  }
}
```

Finalmente, no arquivo **main.dart**, o método `main` coloca a aplicação em execução, começando por uma instância de `App`.

**lib/main.dart**

```dart
import 'package:flutter/material.dart';
import 'src/app.dart';

void main() {
  runApp(App());
}
```

<aside class="negative">

O import `package:contatos_com_bloc/...` do arquivo **app.dart** usa o nome do projeto do repositório de referência. Se você criou o projeto com `flutter create gerenciador_de_contatos`, ajuste o nome do pacote (ou use o import relativo `'telas/contatos_tela.dart'`).

</aside>

</details>

## Parabéns!
Duration: 3:00

Você construiu uma tela de login cujo estado é gerenciado com o padrão Bloc, passando por:

- `StreamController`s, *getters*, `StreamTransformer`s de validação e o método `dispose`;
- `StreamBuilder` e `AsyncSnapshot` para atualizar a interface gráfica;
- uma instância Bloc global e, depois, múltiplas instâncias de escopo restrito com um `Provider` baseado em `InheritedWidget` (e a palavra `covariant`);
- combinação de streams com `CombineLatestStream`, *broadcast streams* e `BehaviorSubject` do RxDart;
- exibição de um Toast com o pacote `fluttertoast`.

### Próximos passos

- Pense sobre qual condição faz sentido no método `updateShouldNotify` do seu `Provider`.
- Experimente as outras opções de gerenciamento de estado citadas no início: Provider, Riverpod, Redux e MobX.
- Troque os valores das propriedades do Toast e explore a documentação dos pacotes utilizados.

### Referências

- Dart programming language | Dart. Google, 2023. Disponível em [https://dart.dev/](https://dart.dev/). Acesso em novembro de 2023.
- Flutter - Build apps for any screen. Google, 2023. Disponível em [https://flutter.dev/](https://flutter.dev/). Acesso em novembro de 2023.
