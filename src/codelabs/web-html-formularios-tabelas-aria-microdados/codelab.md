summary: Continue seus estudos de HTML construindo formulários com input, label, textarea, select, radio e checkbox, tabelas de dados semânticas, barras de progress e meter, e conheça WAI-ARIA e os microdados do schema.org.
id: web-html-formularios-tabelas-aria-microdados
categories: HTML e CSS
tags: html,formularios,form,input,label,select,fieldset,tabelas,table,tableless,aria,wai-aria,acessibilidade,progress,meter,microdados,schema.org
status: Published
authors: Rodrigo Bossini
last updated: 2023-02-09
pdf: tti107_ads2001/03_apostila_html_forms_tables_aria_microdados.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# HTML: formulários, tabelas, ARIA e microdados

## Visão geral
Duration: 3:00

Neste material, prosseguimos com nossos estudos sobre HTML. Você vai construir formulários com diferentes tipos de controle, tabelas para exibir dados, barras de progresso e medidores, e vai conhecer duas formas de enriquecer o significado das suas páginas: WAI-ARIA, voltada às tecnologias assistivas, e os microdados do schema.org, voltados aos buscadores.

### O que você vai aprender

* Criar formulários com o elemento `form` e controles `input` de diferentes tipos (`text`, `email`, `tel`, `color`, `file`, `submit`)
* Associar rótulos (`label`) aos controles, com e sem `id`
* Usar `textarea` para textos maiores
* Oferecer opções com `select`/`option`, `radio` e `checkbox`
* Agrupar controles com `fieldset` e `legend`
* Construir tabelas de dados com `table`, `tr`, `td`, `th`, `thead`, `tbody` e `tfoot`
* O que é o método *tableless*
* O que é WAI-ARIA e os princípios para usá-lo corretamente
* Exibir progresso e medidas com `progress` e `meter`
* Descrever o conteúdo da página com microdados do schema.org e validá-los

### O que você vai precisar

* Um navegador moderno
* Um editor de código (neste material, o Visual Studio Code) ou um ambiente on-line, como Replit, CodePen ou Visual Studio Code for the Web

## Preparando o ambiente
Duration: 4:00

### Ambiente

O primeiro passo é obter um ambiente para desenvolvermos nossos testes. Há diversos ambientes on-line de boa qualidade que nos permitem desenvolver sem ter de instalar um ambiente local. Um deles é o Replit:

[https://replit.com/](https://replit.com/)

Um outro muito bom é o CodePen:

[https://codepen.io/](https://codepen.io/)

Há também o Visual Studio Code for the Web:

[https://vscode.dev/](https://vscode.dev/)

Você pode testá-los e adotar aquele que achar mais interessante.

Há também a possibilidade de utilizar um ambiente local. Esta é a abordagem adotada neste material. O editor de texto/código que utilizamos é o Visual Studio Code:

[https://code.visualstudio.com/](https://code.visualstudio.com/)

### Uma pasta no seu sistema de arquivos

Comece criando uma pasta no seu sistema de arquivos. Se estiver usando o Windows, uma boa opção pode ser

```text
C:\Users\seuusuario\Documents\html
```

Depois disso, abra o VS Code e clique em **File >> Open Folder**. Navegue até a pasta que acabou de criar para vincular o VS Code a ela.

## Formulários: os elementos form e input
Duration: 6:00

### Forms

Quando desenvolvemos uma página HTML, muitas vezes ela possui elementos que permitem ao usuário digitar dados que serão enviados a um servidor. Para que esse envio seja possível, utilizamos um elemento do tipo **form**. Os filhos de um form podem ser de diferentes tipos. Eles podem permitir que o usuário:

- digite um texto
- escolha um item em um menu
- escolha uma cor
- escolha um número
- escolha uma data

Entre muitos outros. Cada elemento filho de um form que permite ao usuário realizar a entrada de algum tipo de dado recebe o nome de **controle**.

### Novo arquivo

Para este exemplo, comece criando um arquivo chamado `primeiro_form.html`. Veja seu conteúdo inicial:

**primeiro_form.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Forms</title>
  </head>
  <body>

  </body>
</html>
```

Veja como criamos um form. O nome do elemento é `form` mesmo:

**primeiro_form.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Forms</title>
  </head>
  <body>

    <form>

    </form>

  </body>
</html>
```

<aside class="positive">

**Nota.** Em geral, o navegador não exibirá coisa alguma por conta da existência de um elemento form no documento HTML. A razão de ser de um elemento form é simplesmente agrupar elementos capazes de receber dados do usuário e viabilizar seu envio - feito pelo navegador - a um servidor.

</aside>

### Elemento input

Dizemos que os controles de um form permitem que o usuário faça a **entrada de dados**. Há um elemento HTML chamado **input** próprio para este fim. Ele possui um atributo chamado **type** que permite variar o tipo dos valores que o usuário poderá informar. Veja como obter texto do usuário:

**primeiro_form.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Forms</title>
  </head>
  <body>

    <form>
      <input type="text">
    </form>

  </body>
</html>
```

Veja o resultado esperado:

![Campo de texto vazio renderizado pelo navegador, sem nenhum rótulo](img/input-texto.webp)

*Um input de type igual a text: já é possível digitar, mas não se sabe a que o campo se refere.*

## Rótulos: o elemento label
Duration: 8:00

### Rótulos

Observe que já é possível digitar no campo. Entretanto, o usuário não sabe a que se refere esse campo. Precisamos associar um rótulo a ele. Podemos fazê-lo utilizando um elemento HTML chamado **label**. Digamos que o campo serve para que o usuário digite o seu primeiro nome. Neste caso, vamos criar um label da seguinte forma:

- Seu corpo conterá o texto que desejamos como rótulo
- Seu atributo **for** terá um valor associado, que indicará o vínculo entre o label e o input a que se refere.
- O valor associado ao atributo for do label será o id do input, finalizando assim o vínculo entre eles.

Veja:

**primeiro_form.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Forms</title>
  </head>
  <body>

    <form>
      <label
        for="primeiroNome">
          Primeiro nome:
      </label>
      <input id="primeiroNome" type="text">
    </form>

  </body>
</html>
```

Veja o resultado esperado no navegador:

![Texto "Primeiro nome:" seguido de um campo de texto](img/label-primeiro-nome.webp)

*O rótulo "Primeiro nome:" aparece ao lado do campo.*

Observe que se você clicar sobre o texto "Primeiro nome:" no navegador, o cursor será levado automaticamente ao elemento input a que o label está associado. Entretanto, ainda mais importante que isso, é a semântica do código. Fica claro para quem lê o código (incluindo leitores de tela) que esse rótulo está associado a esse input.

Veja um novo campo em que o usuário pode digitar seu sobrenome:

**primeiro_form.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Forms</title>
  </head>
  <body>
    <form>
      <label
        for="primeiroNome">
          Primeiro nome:
      </label>
      <input id="primeiroNome" type="text">
      <label for="sobrenome">Sobrenome:</label>
      <input id="sobrenome" type="text">
    </form>
  </body>
</html>
```

Resultado esperado:

![Campos "Primeiro nome:" e "Sobrenome:" lado a lado, cada um com seu rótulo](img/label-sobrenome.webp)

*Dois campos de texto, cada um com seu rótulo.*

### Associação entre label e input sem id

A associação entre label e input pode ser feita sem a utilização de id. Basta aninhar o elemento input dentro do rótulo a que desejamos associá-lo. Observe:

**primeiro_form.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Forms</title>
  </head>
  <body>
    <form>
      <label>
        Primeiro nome:
        <input id="primeiroNome" type="text">
      </label>
      <label>
        Sobrenome:
        <input id="sobrenome" type="text">
      </label>
    </form>
  </body>
</html>
```

O resultado visual e a semântica que o código apresenta permanecem os mesmos.

## Envio do form e outros tipos de input
Duration: 12:00

### Envio de um form

Uma vez que tenha preenchido todos os campos, o usuário desejará enviar o form. Isso pode ser feito de diferentes formas. Uma delas envolve o uso de um elemento do tipo input com atributo type associado ao valor **submit**. O atributo **value** fica associado ao valor a ser exibido como texto do botão. Veja:

**primeiro_form.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Forms</title>
  </head>
  <body>
    <form>
      <label>
        Primeiro nome:
        <input id="primeiroNome" type="text">
      </label>
      <label>
        Sobrenome:
        <input id="sobrenome" type="text">
      </label>
      <input type="submit" value="Enviar">
    </form>
  </body>
</html>
```

Observe que um input com type igual a submit é apresentado ao usuário como um botão:

![Campos "Primeiro nome:" e "Sobrenome:" seguidos de um botão "Enviar"](img/submit.webp)

*O input de type igual a submit aparece como o botão "Enviar".*

### Outros tipos de input: email

Podemos associar diferentes valores ao atributo type de um elemento input. Um exemplo é o valor "**email**". Veja:

**primeiro_form.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Forms</title>
  </head>
  <body>
    <form>
      <label>
        Primeiro nome:
        <input id="primeiroNome" type="text">
      </label>
      <label>
        Sobrenome:
        <input id="sobrenome" type="text">
      </label>

      <label for="email">Email:</label>
      <input id="email" type="email">

      <input type="submit" value="Enviar">
    </form>
  </body>
</html>
```

No navegador, digite algo que não representa um e-mail válido e obtenha um resultado parecido com esse:

![Navegador exibindo o formulário com o campo Email preenchido com um texto inválido e o balão de validação pedindo que o endereço inclua o símbolo @](img/email-validacao.webp)

*O navegador valida o campo de type igual a email antes do envio.*

Além da validação, caso o usuário acesse essa página usando um dispositivo móvel, o teclado virtual pode aparecer de forma personalizada, com uma tecla reservada para o símbolo @, por exemplo.

### Outros tipos de input: telefone

Um campo apropriado para um número de telefone pode ser representado por um input de type igual a **tel**. Veja:

**primeiro_form.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Forms</title>
  </head>
  <body>
    <form>
      <label>
        Primeiro nome:
        <input id="primeiroNome" type="text">
      </label>
      <label>
        Sobrenome:
        <input id="sobrenome" type="text">
      </label>

      <label for="email">Email:</label>
      <input id="email" type="email">

      <label for="telefone">Telefone:</label>
      <input id="telefone" type="tel">

      <input type="submit" value="Enviar">
    </form>
  </body>
</html>
```

A exibição feita pelo navegador provavelmente não terá nada de especial. Entretanto, caso o usuário acesse o site com seu dispositivo móvel, o teclado virtual também poderá ser exibido de forma personalizada, talvez dando foco para valores numéricos.

### Outros tipos de input: cor

Veja um input apropriado para a coleta de uma cor escolhida pelo usuário:

**primeiro_form.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Forms</title>
  </head>
  <body>
    <form>
      <label>
        Primeiro nome:
        <input id="primeiroNome" type="text">
      </label>
      <label>
        Sobrenome:
        <input id="sobrenome" type="text">
      </label>

      <label for="email">Email:</label>
      <input id="email" type="email">

      <label for="telefone">Telefone:</label>
      <input id="telefone" type="tel">

      <label for="cor">Cor:</label>
      <input id="cor" type="color">

      <input type="submit" value="Enviar">
    </form>
  </body>
</html>
```

Veja como o navegador renderiza esse controle. Clique sobre a cor para escolher a que desejar.

![Formulário com os campos Primeiro nome, Sobrenome, Email e Telefone, seguidos do seletor de cor (um quadrado preto) e do botão Enviar](img/input-cor.webp)

*O input de type igual a color aparece como uma amostra de cor clicável.*

### Outros tipos de input: arquivo

Talvez seja necessário permitir que o usuário escolha um arquivo para fazer upload. Para isso, associamos o valor **file** ao atributo type de um elemento input. Observe:

**primeiro_form.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Forms</title>
  </head>
  <body>
    <form>
      <label>
        Primeiro nome:
        <input id="primeiroNome" type="text">
      </label>
      <label>
        Sobrenome:
        <input id="sobrenome" type="text">
      </label>

      <label for="email">Email:</label>
      <input id="email" type="email">

      <label for="telefone">Telefone:</label>
      <input id="telefone" type="tel">

      <label for="cor">Cor:</label>
      <input id="cor" type="color">

      <label for="arquivo">Arquivo:</label>
      <input id="arquivo" type="file">

      <input type="submit" value="Enviar">
    </form>
  </body>
</html>
```

Há uma lista muito grande de valores que podemos associar ao atributo type do elemento input. Visite o link a seguir para conhecê-los:

[https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)

Não deixe de fazer seus próprios testes!

## Textos maiores: o elemento textarea
Duration: 4:00

É comum utilizar um elemento do tipo **textarea** quando desejamos permitir que o usuário digite um texto potencialmente "grande". Veja como fazê-lo a seguir. Observe que um textarea possui os atributos **cols** e **rows**. Eles permitem especificar largura e altura da caixa.

**primeiro_form.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Forms</title>
  </head>
  <body>
    <form>
      <label>
        Primeiro nome:
        <input id="primeiroNome" type="text">
      </label>
      <label>
        Sobrenome:
        <input id="sobrenome" type="text">
      </label>

      <label for="email">Email:</label>
      <input id="email" type="email">

      <label for="telefone">Telefone:</label>
      <input id="telefone" type="tel">

      <label for="cor">Cor:</label>
      <input id="cor" type="color">

      <label for="arquivo">Arquivo:</label>
      <input id="arquivo" type="file">

      <label for="mensagem">Sua mensagem:</label>
      <textarea id="mensagem" cols="35" rows="10"></textarea>

      <input type="submit" value="Enviar">
    </form>
  </body>
</html>
```

## Escolha única em um menu: o elemento select
Duration: 5:00

### Conjunto fixo de opções de escolha única

Pode ser o caso de desejarmos que o usuário faça a escolha de um valor dentro de uma coleção de opções previamente definidas, ao invés de deixá-lo digitar um valor abertamente. Para exibir a coleção de opções como um menu, podemos usar um elemento do tipo **select**.

Para essa seção, crie um novo arquivo chamado `opcoes.html`. Veja seu conteúdo inicial:

**opcoes.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Opções</title>
  </head>
  <body>

  </body>
</html>
```

A criação de um elemento select, que representa um menu de opções, envolve o aninhamento de elementos do tipo **option** dentro dele, cada qual representando uma opção do menu. Observe:

**opcoes.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Opções</title>
  </head>
  <body>
    <label for="estado">Estado:</label>
    <select id="estado">
      <option>São Paulo</option>
      <option>Rio de Janeiro</option>
      <option>Minas Gerais</option>
      <option>Espírito Santo</option>
    </select>
  </body>
</html>
```

Veja o resultado esperado:

![Rótulo "Estado:" e menu aberto com as opções São Paulo (selecionada), Rio de Janeiro, Minas Gerais e Espírito Santo](img/select.webp)

*O select exibe as opções como um menu suspenso.*

## Escolha única com radio
Duration: 10:00

### O elemento input de type igual a radio

Também podemos apresentar uma coleção de opções ao usuário utilizando o elemento input com type associado ao valor **radio**. Veja um desses ainda não muito útil:

**opcoes.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Opções</title>
  </head>
  <body>
    <label for="estado">Estado:</label>
    <select id="estado">
      <option>São Paulo</option>
      <option>Rio de Janeiro</option>
      <option>Minas Gerais</option>
      <option>Espírito Santo</option>
    </select>

    <input type="radio">
  </body>
</html>
```

Ele deve ser apresentado pelo navegador assim:

![Menu "Estado:" com São Paulo selecionado, seguido de um único botão de rádio marcado](img/radio-um.webp)

*Um único input de type igual a radio ao lado do menu.*

### Atributo name para agrupar os elementos radio

Observe que se especificarmos diversos elementos assim, eles serão independentes e o usuário poderá marcar todos. Essa não é exatamente a ideia deste elemento. A ideia é que o usuário possa somente selecionar um. Veja:

**opcoes.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Opções</title>
  </head>
  <body>
    <label for="estado">Estado:</label>
    <select id="estado">
      <option>São Paulo</option>
      <option>Rio de Janeiro</option>
      <option>Minas Gerais</option>
      <option>Espírito Santo</option>
    </select>

    <input type="radio">
    <input type="radio">
    <input type="radio">
    <input type="radio">
    <input type="radio">
  </body>
</html>
```

Observe como é possível selecionar mais de um:

![Menu "Estado:" seguido de cinco botões de rádio, três deles marcados ao mesmo tempo](img/radio-varios.webp)

*Sem o atributo name, cada radio é independente e vários podem ficar marcados.*

Para explicar ao navegador que esses elementos fazem parte de um **grupo** e que somente um pode ser selecionado, associamos um valor ao atributo **name** deles. Claro, o valor deve ser igual para todos. Observe:

**opcoes.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Opções</title>
  </head>
  <body>
    <label for="estado">Estado:</label>
    <select id="estado">
      <option>São Paulo</option>
      <option>Rio de Janeiro</option>
      <option>Minas Gerais</option>
      <option>Espírito Santo</option>
    </select>

    <input type="radio" name="veiculo">
    <input type="radio" name="veiculo">
    <input type="radio" name="veiculo">
    <input type="radio" name="veiculo">
    <input type="radio" name="veiculo">
  </body>
</html>
```

Faça um novo teste no navegador e perceba que agora já não é possível selecionar mais de um elemento.

### Rótulos para os radios

Claro, agora precisamos associar um texto a cada elemento. Um elemento do tipo label desempenha esse papel de maneira muito apropriada. Veja:

**opcoes.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Opções</title>
  </head>
  <body>
    <label for="estado">Estado:</label>
    <select id="estado">
      <option>São Paulo</option>
      <option>Rio de Janeiro</option>
      <option>Minas Gerais</option>
      <option>Espírito Santo</option>
    </select>

    <input type="radio" name="veiculo">
    <label>X1</label>
    <input type="radio" name="veiculo">
    <label>XC60</label>
    <input type="radio" name="veiculo">
    <label>Q5</label>
    <input type="radio" name="veiculo">
    <label>Discovery</label>
    <input type="radio" name="veiculo">
    <label>Taycan</label>
  </body>
</html>
```

### Associando cada label a seu input

Não podemos esquecer da semântica da página e de, portanto, associar cada label a seu respectivo input:

**opcoes.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Opções</title>
  </head>
  <body>
    <label for="estado">Estado:</label>
    <select id="estado">
      <option>São Paulo</option>
      <option>Rio de Janeiro</option>
      <option>Minas Gerais</option>
      <option>Espírito Santo</option>
    </select>

    <input id="X1" type="radio" name="veiculo">
    <label for="X1">X1</label>
    <input id="XC60" type="radio" name="veiculo">
    <label for="XC60">XC60</label>
    <input id="Q5" type="radio" name="veiculo">
    <label for="Q5">Q5</label>
    <input id="Discovery" type="radio" name="veiculo">
    <label for="Discovery">Discovery</label>
    <input id="Taycan" type="radio" name="veiculo">
    <label for="Taycan">Taycan</label>
  </body>
</html>
```

## Agrupando controles: fieldset, legend e checkbox
Duration: 8:00

### Elemento fieldset: agrupando os elementos semanticamente e especificando uma pergunta

Ainda há a necessidade de agruparmos os elementos usando um elemento HTML apropriado. Cuidamos da semântica do documento e viabilizamos a especificação de uma potencial pergunta a que o usuário deve responder escolhendo um dos elementos. Para o agrupamento, vamos usar o elemento HTML **fieldset**. Veja parte de sua documentação, que revela seu propósito:

> *The fieldset element represents a set of form controls optionally grouped under a common name.*

A pergunta será especificada no corpo de um elemento **legend**. Veja parte de sua documentação, que também revela o seu propósito:

> *The legend element represents a caption for the rest of the contents of the legend element's parent fieldset element, if any.*

Fica assim:

**opcoes.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Opções</title>
  </head>
  <body>
    <label for="estado">Estado:</label>
    <select id="estado">
      <option>São Paulo</option>
      <option>Rio de Janeiro</option>
      <option>Minas Gerais</option>
      <option>Espírito Santo</option>
    </select>

    <fieldset>
      <legend>Escolha um veículo</legend>
      <input id="X1" type="radio" name="veiculo">
      <label for="X1">X1</label>
      <input id="XC60" type="radio" name="veiculo">
      <label for="XC60">XC60</label>
      <input id="Q5" type="radio" name="veiculo">
      <label for="Q5">Q5</label>
      <input id="Discovery" type="radio" name="veiculo">
      <label for="Discovery">Discovery</label>
      <input id="Taycan" type="radio" name="veiculo">
      <label for="Taycan">Taycan</label>
    </fieldset>
  </body>
</html>
```

Veja o resultado esperado:

![Menu "Estado:" e, abaixo, uma caixa com borda e o título "Escolha um veículo" contendo os radios X1, XC60, Q5, Discovery e Taycan, com Taycan marcado](img/fieldset.webp)

*O fieldset desenha uma borda em volta do grupo e a legend aparece sobre ela.*

Observe que a renderização de um fieldset pode envolver a especificação de uma borda e que o texto da pergunta pode ser posicionado sobre ela. Isso depende do software cliente utilizado para acessar a página. Evidentemente, um leitor de tela utilizado por um deficiente visual não possui um mecanismo assim. O uso dos elementos apropriados é fundamental para que o dispositivo possa explicar a estrutura da página o mais detalhadamente possível.

### Conjunto de opções de escolha múltipla: o elemento input de type igual a checkbox

Um elemento input com atributo type associado ao valor **checkbox** viabiliza a escolha de múltiplos valores feita pelo usuário. Veja um exemplo. Tal qual fizemos anteriormente, também faremos uso dos elementos fieldset e legend. As reticências (`…`) indicam trechos que não mudaram.

**opcoes.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Opções</title>
  </head>
  <body>
    <label for="estado">Estado:</label>
    <select id="estado">
      …
    </select>
    <fieldset>
      <legend>Escolha um veículo</legend>
      …
    </fieldset>

    <fieldset>
      <legend>De quais cores você gosta?</legend>
      <input
        id="vermelho"
        type="checkbox"
        name="cor">
      <label for="vermelho">Vermelho</label>
      <input
        id="amarelo"
        type="checkbox"
        name="cor">
      <label for="amarelo">Amarelo</label>
      <input
        id="preto"
        type="checkbox"
        name="cor">
      <label for="preto">Preto</label>
    </fieldset>
  </body>
</html>
```

## Tabelas de dados: o elemento table
Duration: 12:00

Nesta seção, construiremos uma tabela para a exibição de uma coleção de dados. Para tal, usamos o elemento **table**. Veja um trecho da sua documentação para entender o seu propósito:

> *The table element represents data with more than one dimension, in the form of a table.*

Para esta seção, crie um novo arquivo de exemplo chamado `tabelas.html`. Veja seu código inicial:

**tabelas.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Tabelas</title>
  </head>
  <body>

  </body>
</html>
```

O primeiro passo é definir um elemento do tipo **table**:

**tabelas.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Tabelas</title>
  </head>
  <body>
    <table>

    </table>
  </body>
</html>
```

### Linhas e colunas: tr e td

Cada linha de uma tabela é representada por um elemento **tr** (de *table row*). Aninhados dentro de um tr, podemos ter diversos elementos do tipo **td** (de *table data*). Cada td representa uma coluna da tabela. No exemplo a seguir, estamos exibindo alguns dados de dois alunos de uma instituição.

**tabelas.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Tabelas</title>
  </head>
  <body>
    <table>
      <!-- primeira linha -->
      <tr>
        <td>123456</td>
        <td>João</td>
        <td>Santos</td>
        <td>10</td>
      </tr>
      <!-- segunda linha -->
      <tr>
        <td>447744</td>
        <td>Maria</td>
        <td>Silva</td>
        <td>9</td>
      </tr>
    </table>
  </body>
</html>
```

Veja o resultado esperado:

![Duas linhas de dados sem cabeçalho: "123456 João Santos 10" e "447744 Maria Silva 9"](img/tabela-td.webp)

*A tabela só com dados: não fica claro o que cada coluna significa.*

### Cabeçalho: th

Observe que o significado de cada coluna não é claro para o usuário. Claro, desejamos adicionar um cabeçalho a ela. Podemos fazê-lo, com uma nova linha. Entretanto, seus filhos serão do tipo **th** (de *table header*). Veja:

**tabelas.html**

```html
…
  <body>
    <table>
      <!-- cabeçalho -->
      <tr>
        <th>RA</th>
        <th>Nome</th>
        <th>Sobrenome</th>
        <th>Média</th>
      </tr>
      <!-- primeira linha -->
      <tr>
        <td>123456</td>
        …
```

Resultado esperado:

![Tabela com cabeçalho em negrito "RA Nome Sobrenome Média" e as linhas de João Santos e Maria Silva](img/tabela-th.webp)

*Os elementos th aparecem em negrito e centralizados.*

### thead e tbody

Idealmente, promovemos a legibilidade do documento HTML englobando as informações do cabeçalho da tabela com um elemento do tipo **thead**. Observe:

**tabelas.html**

```html
…
  <body>
    <table>
      <!-- cabeçalho -->
      <thead>
        <tr>
          <th>RA</th>
          <th>Nome</th>
          <th>Sobrenome</th>
          <th>Média</th>
        </tr>
      </thead>
      <!-- primeira linha -->
      …
```

Há também um elemento idealmente utilizado para abrigar os dados da tabela, ou seja, seu "corpo" principal. É o **tbody**. Veja:

**tabelas.html**

```html
…
      <!-- cabeçalho -->
      <thead>
        <tr>
          <th>RA</th>
          <th>Nome</th>
          <th>Sobrenome</th>
          <th>Média</th>
        </tr>
      </thead>
      <tbody>
        <!-- primeira linha -->
        <tr>
          <td>123456</td>
          <td>João</td>
          <td>Santos</td>
          <td>10</td>
        </tr>
        <!-- segunda linha -->
        <tr>
          <td>447744</td>
          <td>Maria</td>
          <td>Silva</td>
          <td>9</td>
        </tr>
      </tbody>
    </table>
…
```

Repare que o uso dos elementos thead e tbody não necessariamente causa impacto visual:

![A mesma tabela com cabeçalho RA, Nome, Sobrenome e Média, visualmente idêntica à versão anterior](img/tabela-thead-tbody.webp)

*Com thead e tbody, a tabela continua com a mesma aparência.*

Entretanto, seu uso é fortemente recomendado por promover a legibilidade do documento HTML.

### Rodapé: tfoot

Tabelas também podem ter um rodapé. Ele é representado por um elemento HTML **tfoot**. Veja um exemplo:

**tabelas.html**

```html
…
    <table>
      <!-- cabeçalho -->
      <thead>
        <tr>
          <th>RA</th>
          <th>Nome</th>
          <th>Sobrenome</th>
          <th>Média</th>
        </tr>
      </thead>
      <tbody>
        <!-- primeira linha -->
        <tr>
          <td>123456</td>
          <td>João</td>
          <td>Santos</td>
          <td>10</td>
        </tr>
        <!-- segunda linha -->
        <tr>
          <td>447744</td>
          <td>Maria</td>
          <td>Silva</td>
          <td>9</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>9.5</td>
        </tr>
      </tfoot>
    </table>
…
```

## Tableless
Duration: 4:00

Observe que seria possível utilizar um elemento HTML table para organizar o leiaute de uma página. Ou seja, decidir se elementos devem ser exibidos lado a lado ou um abaixo do outro, por exemplo. Entretanto, elementos table somente devem ser utilizados para a exibição de dados. A definição do leiaute de uma página deve ser feita com CSS, que veremos posteriormente.

> **Tableless**
>
> Nome (que passa uma ideia parecida com "não use tabelas") costumeiramente associado ao método de Web Design que sugere que tabelas não devem ser utilizadas na definição do leiaute de páginas HTML.

Resumindo:

- Use elementos table normalmente, desde que seja com a finalidade de exibir dados.
- Não use elementos table caso seu objetivo seja lidar com o leiaute de sua página.

<aside class="negative">

Há muitos anos, muitos desenvolvedores fizeram uso de tabelas para definir o leiaute de suas páginas. Isso costumava dar origem a código difícil de ler e manter, além de comprometer a semântica do documento. Felizmente, essa fase já foi superada e já sabemos sobre o método tableless.

</aside>

## WAI-ARIA
Duration: 8:00

### Web Accessibility Initiative - Accessible Rich Internet Applications

Até então, temos falado bastante sobre HTML semântico e sobre como o uso de elementos HTML apropriados é importante para a acessibilidade de nossas páginas. Entretanto, nos dias atuais, o número de aplicações Web que produzem seu conteúdo HTML dinamicamente, ou seja, em tempo de requisição, é muito grande. Muitas vezes, esse uso massivo de Javascript torna mais difícil promover a acessibilidade de nossas páginas.

> **WAI-ARIA**
>
> Especificação que fornece uma coleção de mecanismos que permitem promover ainda mais a acessibilidade de nossas páginas.

A documentação oficial de WAI-ARIA pode ser encontrada a seguir:

[https://www.w3.org/TR/wai-aria-1.1](https://www.w3.org/TR/wai-aria-1.1)

Ela faz a seguinte comparação:

> *Roles, estados e propriedades ARIA são análogos ao CSS para tecnologias assistivas.*

Ou seja, assim como usamos CSS para explicar ao navegador aspectos visuais da página, usamos ARIA para explicar a estrutura da página às tecnologias assistivas, como leitores de tela.

<aside class="positive">

**Nota.** O uso de elementos ARIA não tem impacto visual algum. Eles são usados apenas por tecnologias assistivas.

</aside>

<aside class="negative">

**Nota.** Não usar ARIA é melhor do que usar ARIA especificado de forma incorreta.

</aside>

### Os dois princípios do ARIA

Veja esse link:

[https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)

Essa página cita dois princípios para uso do ARIA. Veja.

**Princípio ARIA 1: Uma role é uma promessa.** Quando associamos uma role (papel) a um elemento, estamos fazendo a promessa de que ele, de fato, desempenha aquele papel na página. No código seguinte:

**Exemplo**

```html
<div role="button">Place Order</div>
```

Estamos prometendo que a div desempenha o papel de botão. Escrever um documento HTML que não cumpre essa promessa é semelhante a colocar um botão "Comprar" num site que, quando clicado, deixa o pedido de lado e esvazia o carrinho.

**Princípio ARIA 2: ARIA pode ocultar e aprimorar, o que pode ser poderoso e perigoso.** Veja esse exemplo:

**Exemplo**

```html
<a role="menuitem">Assistive tech users perceive this element as an item in a menu, not a link.</a>
<a aria-label="Assistive tech users can only perceive the contents of this aria-label, not the link text">Link Text</a>
```

Observe como o uso da role sobrepõe o significado do elemento HTML. O uso de aria-label, por outro lado, aprimora o significado, entregando mais informações para dispositivos de acessibilidade.

Neste próximo exemplo:

**Exemplo**

```html
<button aria-pressed="false">Mute</button>
```

Observe como o desenvolvedor pode explicar textualmente que o botão não está pressionado no momento.

## Elementos progress e meter
Duration: 6:00

Um elemento HTML do tipo **progress** pode ser utilizado para exibir uma barra de progresso ao usuário. O elemento **meter** é semelhante. Veja algumas dicas:

- Usar **progress** para representar o percentual de conclusão de uma tarefa
- Usar **meter** para representar uma medida dentro de um intervalo definido.

Para esse exemplo, crie um arquivo chamado `progress_meter.html`. Veja seu conteúdo inicial a seguir. Começamos com um progress. Seus atributos têm o seguinte significado:

- **value**: valor atual
- **max**: valor máximo

**progress_meter.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="utf-8">
</head>

<body>
  <!-- value: valor atual -->
  <!-- max: valor máximo -->
  <progress value="20" max="100"></progress>
</body>

</html>
```

A seguir, vamos testar o elemento meter. Seus atributos têm o seguinte significado:

- **min**: valor mínimo
- **max**: valor máximo
- **low**: valor considerado "baixo"
- **high**: valor considerado "alto"
- **optimum**: valor considerado ótimo
- **value**: valor atual

No exemplo a seguir, definimos diversos elementos meter a fim de verificar a forma como cada um é renderizado. Variamos apenas o valor associado ao atributo value de cada um:

**progress_meter.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="utf-8">
</head>

<body>
  <!-- value: valor atual -->
  <!-- max: valor máximo -->
  <progress value="20" max="100"></progress>


  <meter
    min="0"
    max="10"
    low="3"
    high="7"
    optimum="9"
    value="0"
    >
  </meter>

  <meter
    min="0"
    max="10"
    low="3"
    high="7"
    optimum="9"
    value="1"
    >
  </meter>

  <meter
    min="0"
    max="10"
    low="3"
    high="7"
    optimum="9"
    value="4"
    >
  </meter>

  <meter
    min="0"
    max="10"
    low="3"
    high="7"
    optimum="9"
    value="7"
    >
  </meter>

  <meter
    min="0"
    max="10"
    low="3"
    high="7"
    optimum="9"
    value="10"
    >
  </meter>
</body>

</html>
```

## Microdados com schema.org
Duration: 12:00

### O que são microdados

Considere a figura a seguir. Ela mostra o resultado de uma busca feita no Google. Observe que há alguns conteúdos destacados em vermelho.

![Página de resultados do Google para "winston churchill", com destaques em vermelho na foto e nos dados do resultado da Wikipédia, na lista "People also ask" e no painel lateral com foto, datas, cônjuge, filhos e obras de arte](img/google-microdados.webp)

*Conteúdos extras exibidos pelo buscador a partir dos microdados das páginas.*

Tais conteúdos são os **microdados** de uma página. Como desenvolvedores, podemos especificar as informações que desejamos que os buscadores exibam como microdados de nossas páginas. Para isso, o primeiro passo é escolher um **vocabulário**, ou seja, uma coleção de nomes ou símbolos que serão utilizados em nossa página e que já são de conhecimento dos buscadores. Assim, quando quisermos explicar que uma div de nossa página representa um filme, por exemplo, temos o símbolo certo para isso, que já será entendido pelos buscadores.

O vocabulário provavelmente mais utilizado hoje é desenvolvido e mantido por grandes empresas como Google, Microsoft e outras. Veja a sua página oficial:

[https://schema.org/](https://schema.org/)

A página a seguir mostra um exemplo simples:

[https://schema.org/docs/gs.html](https://schema.org/docs/gs.html)

### A página de exemplo

Para este exemplo, crie um arquivo chamado `microdados.html`. Nosso objetivo será fazer a descrição de um filme. Veja:

**microdados.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>

    <meta charset="utf-8">
    <title>Microdados</title>
  </head>
  <body>

    <div>

      <article>
        <h1>
          A Star is Born
        </h1>
        <p>
          A musician helps a young singer find fame as age and alcoholism send his own career into a downward spiral.
        </p>
        <div>
          <img src="https://upload.wikimedia.org/wikipedia/en/thumb/3/39/A_Star_is_Born.png/220px-A_Star_is_Born.png" alt="A Star is Born Movie">
        </div>
        <footer>
          Diretor: Bradley Cooper. January 5, 1975.
        </footer>
      </article>

    </div>

  </body>
</html>
```

### O tipo Movie

Em nossa página, o elemento article representa o filme. Ele será do tipo **Movie** previsto no schema.org. Veja a sua página:

[https://schema.org/Movie](https://schema.org/Movie)

Observe como associar o tipo Movie ao elemento article:

**microdados.html**

```html
…
    <div>

      <article itemscope itemtype="https://schema.org/Movie">
…
```

A página do tipo Movie diz que ele tem algumas propriedades como **name**, **abstract** e **image**. Já temos elementos HTML com esse conteúdo, basta associar os tipos:

**microdados.html**

```html
<article itemscope itemtype="https://schema.org/Movie">
  <h1 itemprop="name">
    A Star is Born
  </h1>
  <p itemprop="abstract">
    A musician helps a young singer find fame as age and alcoholism send his own career into a downward spiral.
  </p>
  <div>
    <img itemprop="image" src="https://upload.wikimedia.org/wikipedia/en/thumb/3/39/A_Star_is_Born.png/220px-A_Star_is_Born.png" alt="">
  </div>
```

### O diretor: o tipo Person

Além disso, o tipo Movie tem também uma propriedade chamada **director**. Ocorre que ele é de um tipo específico do schema.org também: o tipo **Person**. Por isso, vamos especificá-lo da seguinte forma:

**microdados.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>

    <meta charset="utf-8">
    <title>Microdados</title>
  </head>
  <body>

    <div>

      <article itemscope itemtype="https://schema.org/Movie">
        <h1 itemprop="name">
          A Star is Born
        </h1>
        <p itemprop="abstract">
          A musician helps a young singer find fame as age and alcoholism send his own career into a downward spiral.
        </p>
        <div>
          <img itemprop="image" src="https://upload.wikimedia.org/wikipedia/en/thumb/3/39/A_Star_is_Born.png/220px-A_Star_is_Born.png" alt="">
        </div>
        <footer itemprop="director" itemscope itemtype="https://schema.org/Person">
          Diretor: Bradley Cooper. January 5, 1975.
        </footer>
      </article>

    </div>

  </body>
</html>
```

Por sua vez, o tipo Person tem as propriedades **name** e **birthDate**. Já temos essas duas informações no rodapé. Entretanto, somente podemos usar o atributo itemprop do HTML5 em elementos HTML. Por isso, vamos englobar cada informação (o nome separado da data de nascimento) em um elemento **span** do HTML5, que não causa alteração visual alguma. A ele aplicamos os tipos previstos no schema.org. Observe:

**microdados.html**

```html
…
      <article itemscope itemtype="https://schema.org/Movie">
        <h1 itemprop="name">
          A Star is Born
        </h1>
        <p itemprop="abstract">
          A musician helps a young singer find fame as age and alcoholism send his own career into a downward spiral.
        </p>
        <div>
          <img itemprop="image" src="https://upload.wikimedia.org/wikipedia/en/thumb/3/39/A_Star_is_Born.png/220px-A_Star_is_Born.png" alt="">
        </div>
        <footer itemprop="director" itemscope itemtype="https://schema.org/Person">
          Diretor: <span itemprop="name">Bradley Cooper</span>. <span itemprop="birthDate">January 5, 1975</span>
        </footer>
      </article>
…
```

## Validando os microdados
Duration: 6:00

### Schema Markup Validator

O site schema.org tem um validador de documentos que pode ser acessado a seguir:

[https://validator.schema.org/](https://validator.schema.org/)

Clique em **CODE SNIPPET** e cole o seu código HTML inteiro. A seguir, clique em **RUN TEST**:

![Janela "Test your structured data" com a aba CODE SNIPPET destacada, o código de microdados.html colado na área de texto e o botão RUN TEST destacado](img/validator-code-snippet.webp)

*Cole o documento na aba CODE SNIPPET e clique em RUN TEST.*

A esperança é que o resultado inclua as propriedades que especificamos e que mostre que não houve erro algum:

![Resultado do validador do schema.org: o código à esquerda e, à direita, o item Movie detectado com as propriedades name, abstract, image e director (Person, com name e birthDate), sem erros](img/validator-resultado.webp)

*O validador reconhece o Movie e o Person, com suas propriedades, e não aponta erros.*

### Teste de pesquisa aprimorada do Google

Também pode ser interessante testar o documento HTML e visualizar o conteúdo que seria gerado em função de nossos microdados em páginas de resultados do Google. Isso pode ser feito a seguir:

[https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)

Clique em **CÓDIGO**, cole seu código HTML inteiro e clique em **TESTAR URL**:

![Tela "Sua página é compatível com os resultados avançados?" com a aba CÓDIGO destacada, o código HTML colado e o botão TESTAR CÓDIGO destacado](img/rich-results-codigo.webp)

*Cole o documento na aba CÓDIGO e inicie o teste.*

A página resultante deverá ser parecida com a seguinte. Clique em **VER A PÁGINA TESTADA**, e, logo a seguir, em **CAPTURA DE TELA**:

![Resultado do teste do Google indicando 1 item válido detectado, com os botões VER A PÁGINA TESTADA e CAPTURA DE TELA destacados e, à direita, a captura da página com o título, o resumo e o cartaz do filme](img/rich-results-captura.webp)

*O teste detecta um item válido e mostra a captura de tela da página testada.*

## Encerramento
Duration: 2:00

Parabéns! Você construiu formulários com diferentes tipos de controle, rótulos e agrupamentos semânticos, montou uma tabela de dados com cabeçalho, corpo e rodapé, conheceu o método tableless e os princípios do WAI-ARIA, usou `progress` e `meter` e descreveu um filme com microdados do schema.org.

Para saber sobre os tipos definidos pelo vocabulário que estamos usando, visite a lista completa:

[https://schema.org/docs/full.html](https://schema.org/docs/full.html)

### Referências

* Tipos de input (MDN): [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
* WAI-ARIA 1.1: [https://www.w3.org/TR/wai-aria-1.1](https://www.w3.org/TR/wai-aria-1.1)
* ARIA Authoring Practices, *Read Me First*: [https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)
* schema.org: [https://schema.org/](https://schema.org/)
* Validador do schema.org: [https://validator.schema.org/](https://validator.schema.org/)
* Teste de pesquisa aprimorada do Google: [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
