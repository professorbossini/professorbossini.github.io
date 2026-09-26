summary: Aprofunde-se em CSS com as propriedades display, border, padding e margin, o Box Model e o box-sizing, e dê os primeiros passos em responsividade com unidades de medida, ViewPort, layouts fluidos e Media Queries.
id: web-css-mais-recursos
categories: HTML e CSS
tags: css,html,display,border,padding,margin,box model,box-sizing,responsividade,viewport,media queries,devtools
status: Published
authors: Rodrigo Bossini
last updated: 2022-08-30
pdf: tti107_ads2001/05_apostila_css_mais_recursos.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# CSS: mais recursos (display, Box Model e responsividade)

## Visão geral
Duration: 3:00

Como vimos, a linguagem de marcação HTML5 é utilizada para descrever a **estrutura** de um documento, sem que sejam especificados detalhes sobre a sua aparência. Utilizamos **CSS** para estilizar elementos HTML. Neste codelab, vamos aprender mais recursos que o CSS oferece, sempre com trechos simples de HTML5 para ilustrar cada um deles.

### O que você vai aprender

* Os valores `block`, `inline`, `inline-block` e `none` da propriedade `display`
* Como especificar bordas com `border`, suas variações por lado e o arredondamento com `border-radius`
* O espaçamento interno (`padding`) e o externo (`margin`) de uma caixa, inclusive margens negativas e o valor `auto`
* O **Box Model** e a propriedade `box-sizing` (`content-box` e `border-box`)
* O que é **responsividade** e como as unidades pixel e percentual influenciam nela
* O que é o **ViewPort** e para que serve a meta tag `viewport`
* A diferença entre layouts **fixos** e **fluidos**
* Como usar **Media Queries** e breakpoints

### O que você vai precisar

* Um editor de código; os exemplos usam o **Visual Studio Code**
* O navegador **Google Chrome**, com o **Chrome DevTools** (abas Elements e Computed e o modo de dispositivos)
* Conhecimentos básicos de HTML e da introdução a CSS

## Preparando o ambiente
Duration: 3:00

### Criando uma pasta

Crie uma nova pasta para abrigar os exemplos. De preferência, ela não deve ter caracteres especiais e/ou espaços em seu nome. Cuidado também para não utilizar nenhuma pasta ou subpasta que tenha restrições de segurança impostas pelo seu sistema operacional.

### Abrindo o VS Code

Abra uma instância do VS Code vinculada a essa pasta. Isso pode ser feito abrindo-se o VS Code e clicando-se em **File >> Open Folder**. Também é possível abrir um terminal, navegar até a pasta criada e executar o comando:

**Terminal**

```bash
code .
```

As duas formas são equivalentes. Escolha a que for mais conveniente para você.

## A propriedade display
Duration: 15:00

Nesta seção, vamos estudar a propriedade `display`. Para isso, crie um arquivo HTML com nome **exemplo_display.html** em sua pasta. Seu conteúdo inicial é o seguinte.

**exemplo_display.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>A propriedade display</title>
    <style>
      p {
        background-color: #CCC;
      }
      a {
        background-color: rgb(202, 184, 231);
      }
      footer{
        background-color: beige;
      }
      button {
        background-color: greenyellow;
      }
    </style>
  </head>
  <body>
    <article id="cursos">
      <p class="engenharia">Engenharia</p>
      <p class="farmacia">Farmácia</p>
      <a class="professores" href="#">Veja a lista de professores aqui</a>
      <a class="Contato" href="#">Entre em contato</a>
      <footer class="rodape">Portal de cursos</footer>
      <button class="botao">Clique aqui para falar conosco</button>
      <p>Todos os direitos reservados</p>
    </article>
  </body>
</html>
```

Abra o arquivo no seu navegador e veja como se dá a exibição dos elementos. Note que alguns elementos aparecem um abaixo do outro, enquanto outros estão lado a lado. A propriedade que determina essa característica é a propriedade **display**.

Por enquanto, estamos lidando com dois valores associados à propriedade `display`: `block` e `inline`.

> **block**
>
> Quebras de linha são colocadas antes e depois do elemento.

> **inline**
>
> Sem quebras de linha: o próximo elemento será exibido na mesma linha, se couber. Ocupa somente o espaço necessário para o conteúdo.

### Inspecionando o valor de display

Clique com o botão direito em um link da página de exemplo e abra o **Chrome DevTools**. Vá até a aba **Computed**, como mostra a figura a seguir. Note que a propriedade `display` do link tem valor padrão **inline**.

![Chrome DevTools com a aba Computed aberta para um link da página: a propriedade display aparece com o valor inline, destacada em vermelho](img/fig-2-3-1.webp)

*Na aba Computed, o link inspecionado mostra display com o valor padrão inline.*

Repita o processo para olhar os outros elementos, como **button**, **p** e **footer**. Verifique qual o valor padrão de `display` para cada um deles.

### Largura e altura em elementos inline

Note que não podemos especificar **largura** e **altura** para elementos cujo valor de `display` é **inline**. Essas configurações não têm efeito já que, por definição, um elemento cujo display é inline ocupa somente o espaço necessário para seu conteúdo. Acrescente a regra a seguir ao elemento `<style>`.

**exemplo_display.html · dentro de `<style>`**

```css
.professores{
  width: 200px;
  height: 200px;
}
```

Atualize a página e verifique que nada mudou.

Contudo, alterando o `display` para `block`, as propriedades passam a ter efeito. Note também que uma quebra de linha é adicionada. Isso é padrão do valor `block`.

**exemplo_display.html · dentro de `<style>`**

```css
.professores{
  display: block;
  width: 200px;
  height: 200px;
}
```

Faça também a alteração a seguir, mudando o `display` de um `p` para `inline`.

**exemplo_display.html · dentro de `<style>`**

```css
.engenharia {
  display: inline;
}
```

### O valor inline-block

Agora suponha que desejamos especificar largura e altura para os dois cursos, porém queremos que eles fiquem lado a lado. Como vimos, a tentativa a seguir não vai funcionar como desejamos.

**exemplo_display.html · dentro de `<style>`**

```css
.engenharia {
  display: inline;
  width: 300px;
  height: 200px;
}

.farmacia {
  display: inline;
  width: 300px;
  height: 200px;
}
```

Como mostra a figura abaixo, o próprio assistente do Visual Studio Code nos informa quais propriedades são ignoradas quando a propriedade `display` é utilizada: *"Property is ignored due to the display. With 'display: inline', the width, height, margin-top, margin-bottom, and float properties have no effect."*

![Dica do VS Code sobre a propriedade width avisando que ela é ignorada por causa do display inline](img/fig-2-3-2.webp)

*O VS Code avisa que width, height, margin-top, margin-bottom e float não têm efeito com display: inline.*

O valor **inline-block** associado à propriedade `display` permite que essa combinação seja realizada. Teremos os elementos lado a lado e eles poderão definir largura e altura.

**exemplo_display.html · dentro de `<style>`**

```css
.engenharia {
  display: inline-block;
  width: 300px;
  height: 200px;
}

.farmacia {
  display: inline-block;
  width: 300px;
  height: 200px;
}
```

### O valor none

O valor **none** da propriedade `display` esconde o elemento, embora ele ainda exista na árvore DOM.

**exemplo_display.html · dentro de `<style>`**

```css
.rodape{
  display: none;
}
```

## A propriedade border
Duration: 15:00

Podemos especificar bordas para nossos elementos, dizendo qual a sua cor, espessura, forma, entre outras coisas. Para este exemplo, crie um arquivo chamado **exemplo_bordas.html**. Seu conteúdo inicial é o seguinte.

**exemplo_bordas.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Bordas</title>
  </head>
  <style>
  </style>
  <body>
    <main>
      <div id="cursos">
        <p class="engenharia">Engenharia</p>
        <p class="farmacia">Farmácia</p>
        <a href="#">Mais informações</a>
      </div>
    </main>
  </body>
</html>
```

### Largura, cor e estilo

Os nomes das propriedades referentes a bordas começam com `border`. Veja alguns exemplos.

**exemplo_bordas.html · dentro de `<style>`**

```css
a {
  border-width: thin;
  border-color: red;
  border-style: solid;
}
```

Faça testes com outros valores para width e style, sugeridos pelo VS Code.

### O atalho border

Há também o atalho `border`, que pode ser utilizado para especificar todos os valores referentes à borda de uma única vez.

**exemplo_bordas.html · dentro de `<style>`**

```css
a {
  /*border-width: thin;
  border-color: red;
  border-style: solid;*/
  border: thin black dashed;
}
```

### Bordas em apenas alguns lados

Note que, ao especificarmos a borda, ela apareceu em cima, embaixo e dos dois lados da caixa. Também é possível especificar que desejamos bordas somente em uma ou algumas dessas regiões, não necessariamente as quatro.

**exemplo_bordas.html · dentro de `<style>`**

```css
a {
  /*border-width: thin;
  border-color: red;
  border-style: solid;*/
  border: thick black dashed;
  border-top: 10px solid blue;
}

.farmacia {
  border-bottom: 5px solid #CCC;
}

.engenharia{
  border-left: 1px solid green;
}
```

Perceba, neste exemplo, que a propriedade mais específica (`border-top`) tem precedência sobre a mais geral (`border`).

### Arredondando a borda com border-radius

A propriedade `border-radius` permite arredondar a borda.

**exemplo_bordas.html · dentro de `<style>`**

```css
.engenharia{
  border: 5px solid green;
  border-radius: 5px;
}
```

Repare no que acontece com a cor de fundo e com o conteúdo conforme a borda fica mais arredondada.

**exemplo_bordas.html · dentro de `<style>`**

```css
.engenharia{
  border: 5px solid green;
  border-radius: 75px;
  background-color: beige;
  width: 200px;
  height: 200px;
}
```

Veja agora como arredondar somente um dos cantos, como o canto superior esquerdo.

**exemplo_bordas.html · dentro de `<style>`**

```css
.engenharia{
  border: 5px solid green;
  border-radius: 75px;
  background-color: beige;
  width: 200px;
  height: 200px;
  border-top-left-radius: 120px;
}
```

A própria propriedade `border-radius` pode servir de atalho para que sejam especificados diversos valores de uma única vez. A seguir, especificamos **dois** valores.

**exemplo_bordas.html · dentro de `<style>`**

```css
.engenharia{
  border: 5px solid green;
  border-radius: 20px 50px;
  background-color: beige;
  width: 200px;
  height: 200px;
}
```

Repare que o primeiro valor se aplica às bordas superior esquerda e inferior direita e o segundo, às bordas superior direita e inferior esquerda.

Se especificarmos **quatro** valores, eles se aplicam a cada uma das bordas, começando da borda superior esquerda, em sentido horário.

**exemplo_bordas.html · dentro de `<style>`**

```css
.engenharia{
  border: 5px solid green;
  border-radius: 20px 50px 80px 100px;
  background-color: beige;
  width: 200px;
  height: 200px;
}
```

## A propriedade padding
Duration: 10:00

Podemos especificar medidas para que os conteúdos de nossas caixas não fiquem colados às suas bordas. Essa medida se chama **padding**. Para este exemplo, crie um novo arquivo chamado **exemplo_padding.html**. Seu conteúdo inicial é o seguinte.

**exemplo_padding.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Padding</title>
    <style>
      .primeiro, .segundo{
        width: 200px;
        display: inline-block;
        border: 2px solid black;
        background-color: #CCC;
      }
    </style>
  </head>
  <body>
    <article>
      <p class="primeiro">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat aspernatur culpa officiis odio quisquam, autem deserunt earum excepturi voluptas. Nisi voluptatem quas quis voluptate voluptates ipsam perspiciatis excepturi voluptatibus perferendis?
      </p>
      <p class="segundo">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat aspernatur culpa officiis odio quisquam, autem deserunt earum excepturi voluptas. Nisi voluptatem quas quis voluptate voluptates ipsam perspiciatis excepturi voluptatibus perferendis?
      </p>
    </article>
  </body>
</html>
```

No primeiro exemplo, vamos colocar padding nas duas caixas, usando possibilidades diferentes: um único valor (aplicado aos quatro lados) e dois valores (o primeiro para cima e para baixo, o segundo para a esquerda e para a direita).

**exemplo_padding.html · dentro de `<style>`**

```css
.primeiro, .segundo{
  width: 200px;
  display: inline-block;
  border: 2px solid black;
  background-color: #CCC;
}

.primeiro{
  padding: 20px;
}

.segundo {
  padding: 20px 40px;
}
```

Note que também há as propriedades `padding-left`, `padding-right` etc., de maneira análoga a propriedades que já vimos.

Veja o que ocorre quando adicionamos padding ao `article` da página. Adicionamos também uma borda para o resultado ficar bem claro.

**exemplo_padding.html · dentro de `<style>`**

```css
article{
  border: 2px solid blue;
  padding: 30px;
}
```

Também é possível ajustar o próprio `body` do documento.

**exemplo_padding.html · dentro de `<style>`**

```css
body{
  border: 2px solid black;
  padding: 50px;
}
```

<aside class="negative">

**Observação importante.** Note que as caixas têm **largura fixa em 200px**. Porém, quando adicionamos **padding**, o espaço que ocupam aumenta daquela quantidade, embora a caixa continue utilizando 200 pixels para seu conteúdo. **Aumente o padding da segunda caixa para 400px para ver o resultado.** Essa forma de funcionamento é padrão no navegador e pode ser alterada, como veremos no passo sobre o Box Model.

</aside>

## A propriedade margin
Duration: 15:00

A **margem** de um elemento é a medida que há entre suas bordas e os elementos externos. Para este exemplo, crie um arquivo chamado **exemplo_margin.html**. Seu conteúdo inicial é o seguinte.

**exemplo_margin.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Margin</title>
    <style>
    </style>
  </head>
  <body>
    <article>
      <p class="primeira">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam molestiae, asperiores ducimus esse quidem sequi quasi? Eius voluptate quo fuga quibusdam optio, aperiam eum dolorum est! Ex laboriosam ullam a.
      </p>
      <p class="segunda">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam molestiae, asperiores ducimus esse quidem sequi quasi? Eius voluptate quo fuga quibusdam optio, aperiam eum dolorum est! Ex laboriosam ullam a.
      </p>
    </article>
  </body>
</html>
```

<aside class="positive">

Na apostila, a listagem inicial mostra os dois parágrafos sem classe, mas todas as regras seguintes (e o print do DevTools mais abaixo) usam as classes `primeira` e `segunda`. Por isso elas já aparecem aqui.

</aside>

### Margem à esquerda

Comece mexendo na margem à esquerda da primeira caixa.

**exemplo_margin.html · dentro de `<style>`**

```css
.primeira {
  margin-left: 30px;
}
```

Note que, zerando a margem da primeira caixa, ela não fica completamente colada na tela.

**exemplo_margin.html · dentro de `<style>`**

```css
.primeira {
  margin-left: 0px;
}
```

### A margem padrão do body

Coloque uma borda no elemento `body` para que isso fique mais claro.

**exemplo_margin.html · dentro de `<style>`**

```css
body{
  border: 1px solid blue;
}
```

Sendo assim, coloque uma borda no elemento `html` também.

**exemplo_margin.html · dentro de `<style>`**

```css
html{
  border: 1px solid red;
}
```

Repare nos espaços existentes entre as bordas de `html` e `body`. Vamos abrir o Chrome DevTools para entender o que está acontecendo. Aperte **CTRL + SHIFT + I**. Vá até a aba **Computed** e passe o mouse sobre o `body`. Verifique o que está ocorrendo com as suas margens. Por padrão, o navegador colocou **8 pixels** de margem no `body`.

![DevTools inspecionando o body: a aba Computed mostra margin-top, margin-right, margin-bottom e margin-left com 8px, destacados em vermelho](img/fig-2-6-1.webp)

*Por padrão, o navegador aplica 8px de margem em todos os lados do body.*

Evidentemente, podemos remover essa medida, caso desejado. Basta **zerar** a margem do elemento `body`.

**exemplo_margin.html · dentro de `<style>`**

```css
body{
  margin: 0px;
  border: 1px solid blue;
}
```

Veja que os elementos `p` também têm margem padrão, que podemos zerar.

**exemplo_margin.html · dentro de `<style>`**

```css
.primeira, .segunda {
  background-color: #CCC;
  border: 1px solid black;
  padding: 20px;
  width: 300px;
  margin: 0px;
}
```

### Margens com dois ou quatro valores

Também dá para especificar as margens usando dois ou quatro valores. Caso dois valores sejam especificados, o primeiro será aplicado às margens superior e inferior, e o segundo às margens esquerda e direita. Caso quatro valores sejam especificados, eles são usados pelas margens superior, direita, inferior e esquerda, nesta ordem.

Acrescente dois parágrafos ao `article`, logo depois dos que já existem:

**exemplo_margin.html · dentro de `<article>`**

```html
<p class="terceira">
  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam molestiae, asperiores ducimus esse quidem sequi quasi? Eius voluptate quo fuga quibusdam optio, aperiam eum dolorum est! Ex laboriosam ullam a.
</p>
<p class="quarta">
  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam molestiae, asperiores ducimus esse quidem sequi quasi? Eius voluptate quo fuga quibusdam optio, aperiam eum dolorum est! Ex laboriosam ullam a.
</p>
```

E as regras correspondentes:

**exemplo_margin.html · dentro de `<style>`**

```css
.terceira, .quarta{
  border: 1px solid green;
}

.terceira{
  margin: 20px 50px;
}

.quarta {
  margin: 10px 50px 100px 200px;
}
```

Note, ainda neste exemplo, que as margens positivas (verticais) de elementos vizinhos se sobrepõem.

### Margens negativas

As margens também podem ser **negativas**. Acrescente mais um parágrafo ao `article` e a regra correspondente:

**exemplo_margin.html · dentro de `<article>`**

```html
<p class="quinta">
  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam molestiae, asperiores ducimus esse quidem sequi quasi? Eius voluptate quo fuga quibusdam optio, aperiam eum dolorum est! Ex laboriosam ullam a.
</p>
```

**exemplo_margin.html · dentro de `<style>`**

```css
.quinta{
  margin-top: -50px;
  border: 1px solid yellow;
}
```

Note que da margem inferior do quarto elemento `p` são subtraídos 50 pixels, que é a margem superior (negativa) do quinto elemento `p`.

### O valor auto

O valor **auto** costuma ser utilizado para centralizar uma caixa. Informalmente, ele instrui o navegador a escolher um valor conveniente, de acordo com o contexto. Para mais informações sobre o valor `auto`, veja a especificação: [Computing widths and margins](https://drafts.csswg.org/css2/visudet.html#Computing_widths_and_margins).

**exemplo_margin.html · dentro de `<style>`**

```css
.quinta{
  margin-top: -50px;
  border: 1px solid yellow;
  margin: 20px auto;
  width: 300px;
}
```

### Resumo das medidas

Concluindo, a figura a seguir ilustra as medidas estudadas até então.

![Diagrama de caixas aninhadas: o conteúdo no centro, envolvido pelo padding, depois pela borda e, por fora, pela margem](img/fig-2-6-2.webp)

*Do centro para fora: conteúdo, padding, borda e margem.*

## Box Model e box-sizing
Duration: 12:00

Conforme especificamos valores de medidas para as propriedades de borda, padding etc., o navegador faz seus cálculos para renderizar a caixa da maneira mais adequada. Nesta seção, vamos estudar o **Box Model** e a propriedade **box-sizing** do CSS. Crie um arquivo chamado **exemplo_boxmodel.html**. Seu conteúdo inicial é o seguinte.

**exemplo_boxmodel.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Box Model</title>
    <style>
      body{
        margin: 0px;
      }
      .caixa1, .caixa2{
        width: 300px;
        text-align: justify;
        background-color: #CCC;
        border: 1px solid black;
      }
      .rodape{
        background-color: aliceblue;
        padding: 12px;
        border: 1px solid #EEE;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <article>
      <p class="caixa1">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, nam! Velit corporis, facere sapiente ex vero accusantium minima. Excepturi consequatur fugiat incidunt ipsam molestiae soluta magnam quo neque magni adipisci.
      </p>
      <p class="caixa2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, nam! Velit corporis, facere sapiente ex vero accusantium minima. Excepturi consequatur fugiat incidunt ipsam molestiae soluta magnam quo neque magni adipisci.
      </p>
      <footer class="rodape">
        Volte sempre
      </footer>
    </article>
  </body>
</html>
```

### Borda e padding aumentam a caixa

Vamos começar adicionando uma borda ao primeiro `p`.

**exemplo_boxmodel.html · dentro de `<style>`**

```css
.caixa1{
  border: 5px solid black;
}
```

Note que, graças à borda, embora ambas as caixas possuam largura de 300 pixels, a primeira caixa parece ser mais larga.

Especificando um padding, a caixa aumenta ainda mais.

**exemplo_boxmodel.html · dentro de `<style>`**

```css
.caixa1{
  border: 5px solid black;
  padding: 50px;
}
```

### content-box

É aí que entra a propriedade `box-sizing`. Ela tem alguns valores possíveis e o valor padrão é **content-box**. Ele indica que a medida `width` se refere **somente ao conteúdo**. As demais propriedades (`border` e `padding`) não entram na conta.

Embora seja padrão, podemos deixar esse valor explícito.

**exemplo_boxmodel.html · dentro de `<style>`**

```css
.caixa1{
  border: 5px solid black;
  padding: 50px;
  box-sizing: content-box; /*padrão, não vai mudar nada*/
}
```

### border-box

Podemos fazer diferente. Podemos indicar ao navegador que a largura configurada na propriedade `width` é a desejada para o **somatório de conteúdo, padding e borda**. Para tal, basta trocar o valor de `box-sizing` para **border-box**, desta vez na segunda caixa.

**exemplo_boxmodel.html · dentro de `<style>`**

```css
.caixa2{
  border: 5px solid black;
  padding: 50px;
  box-sizing: border-box; /*padrão, não vai mudar nada*/
}
```

<aside class="negative">

O comentário `/*padrão, não vai mudar nada*/` foi mantido como aparece na apostila, mas ele vale apenas para `content-box`. Com `border-box` o resultado **muda**: a caixa 2 passa a ocupar exatamente os 300 pixels definidos em `width`.

</aside>

É interessante inspecionar os elementos com o Chrome DevTools. Na aba **Computed**, verifique os valores que compõem a largura de cada um.

![Box model da caixa1 no DevTools: conteúdo de 300 × 108, padding de 50 e borda de 5 de cada lado](img/fig-2-7-1.webp)

*caixa1 (content-box): o conteúdo mantém 300px, e padding e borda são somados por fora.*

![Box model da caixa2 no DevTools: conteúdo de 190 × 162, padding de 50 e borda de 5 de cada lado](img/fig-2-7-2.webp)

*caixa2 (border-box): o conteúdo encolhe para 190px, para que conteúdo, padding e borda somem os 300px.*

## Responsividade e a unidade pixel
Duration: 10:00

Passamos agora a falar de um tópico muito importante no desenvolvimento web: a **responsividade**. Nos dias atuais, usuários acessam web sites utilizando dispositivos com as mais variadas características. Em particular, utilizando dispositivos que têm tamanho de tela diferente, resolução diferente, entre outras coisas.

Quando fazemos nossas páginas Web, o ideal é que elas exibam conteúdo de maneira apropriada para o dispositivo que está em uso. Ou seja, que elas se adaptem de acordo com as necessidades do usuário. Se o dispositivo tem tela pequena, por exemplo, é melhor exibir um pouco de conteúdo por vez e permitir que o usuário faça rolagem do que tentar exibir muito conteúdo, que ficaria muito pequeno ou cortado. Com uma tela grande, o site pode exibir mais conteúdo, com objetos maiores, de uma única vez.

> **Responsividade**
>
> Característica de adaptação de uma página quanto ao tamanho da tela do dispositivo.

Há diversos frameworks que fornecem muitas funcionalidades voltadas para isso. Nesta seção, veremos que é possível utilizar CSS puro para conseguir um bom nível de responsividade.

Veja, no link a seguir, um exemplo de site **não responsivo**. Reduza a largura de seu navegador e repare no menu superior: [https://spark.apache.org/docs/latest/](https://spark.apache.org/docs/latest/)

Por outro lado, este é um exemplo de site **responsivo**: [https://ionicframework.com/](https://ionicframework.com/)

### Pixel

As telas dos dispositivos têm uma quantidade determinada de pixels. Por exemplo, se sua tela é **Full HD**, ela tem 1920 pixels horizontalmente e 1080 pixels verticalmente. Se a tela é **HD**, ela tem 1280 pixels horizontalmente e 720 pixels verticalmente. Dispositivos **4K** têm diferentes quantidades de pixels. Uma bastante comum é 3840 pixels horizontalmente e 2160 pixels verticalmente. Aliás, 4K vem da ideia de o dispositivo ter em torno de 4 mil (4K) pixels na horizontal.

Começamos a discussão considerando unidades de medida. A primeira será o **pixel**. Para este exemplo, crie um arquivo chamado **exemplo_pixel.html**. Seu conteúdo é o seguinte.

**exemplo_pixel.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
    </style>
    <title>Pixel</title>
  </head>
  <body>
    <article>
      <h1>Desenvolvimento de aplicações web</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo voluptatum rem, magnam ad minima tempore. Corrupti asperiores hic, amet nam magni impedit possimus, saepe vel blanditiis ea, nihil a reprehenderit.
      </p>
    </article>
  </body>
</html>
```

### O tamanho padrão da fonte

Note que, evidentemente, a fonte exibida pelo navegador tem um tamanho predeterminado. Esse tamanho é definido pelo próprio navegador, caso o desenvolvedor não especifique um tamanho. Isso pode ser alterado pelo usuário nas configurações do navegador. No Chrome, clique nas três bolinhas no canto superior direito e escolha **Settings (Configurações)**. Busque por *font* na barra de pesquisa e note que ele oferece algumas opções para alteração de tamanho.

Em geral, o tamanho padrão da fonte é **16px**. Você pode checar isso no Chrome DevTools. Para isso, é preciso **especificar explicitamente o tamanho da fonte como 100%**. Não alteramos nada, só deixamos explícito para ser possível visualizar no Chrome.

**exemplo_pixel.html · dentro de `<style>`**

```css
html{
  font-size: 100%;
}
```

Como vimos, podemos especificar o tamanho de fonte usando `font-size`. Faça a alteração a seguir e faça os testes no Chrome novamente, tentando alterar o tamanho de fonte.

**exemplo_pixel.html · dentro de `<style>`**

```css
body{
  font-size: 14px;
}
```

<aside class="negative">

Configurando o tamanho de fonte usando a medida pixel, acabamos tirando a chance de o usuário alterar o tamanho da fonte de acordo com suas necessidades.

</aside>

### Largura em pixels

Agora vamos especificar a largura do elemento `article`. Digamos que ele tem 800 pixels.

**exemplo_pixel.html · dentro de `<style>`**

```css
article{
  border: 2px solid #CCC;
  background-color: aliceblue;
  width: 800px;
}
```

Diminua a largura do seu navegador e veja que a caixa permanece fixa, com seus 800 pixels de largura.

Caso o padding seja configurado, como a seguir, o resultado é o mesmo: a aparência não muda conforme a largura do navegador muda.

**exemplo_pixel.html · dentro de `<style>`**

```css
article{
  border: 2px solid #CCC;
  background-color: aliceblue;
  width: 800px;
  padding: 20px;
}
```

Perceba, portanto, que a unidade pixel, quando aplicada a determinados elementos, pode ser indesejável do ponto de vista da responsividade.

## A unidade percentual
Duration: 15:00

Começamos agora a falar sobre a medida **percentual**, que pode ser mais apropriada em alguns cenários. Para esta seção, crie um arquivo chamado **exemplo_percentual.html**. Seu conteúdo inicial é o seguinte.

**exemplo_percentual.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Percentual</title>
    <style>
    </style>
  </head>
  <body>
    <main class="principal">
      <article class="postagem">
        <h1>Programação para dispositivos móveis</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, laudantium eaque enim fugiat hic similique laboriosam dolores obcaecati, totam soluta asperiores officia nemo nulla neque iure tempore tenetur modi quod.
        </p>
      </article>
    </main>
  </body>
</html>
```

### Tamanho de fonte em percentual

Vamos começar alterando o tamanho da fonte.

**exemplo_percentual.html · dentro de `<style>`**

```css
p{
  font-size: 200%;
}
```

Vá no Chrome DevTools e inspecione o elemento `p` na aba **Computed**. Veja o valor associado à propriedade `font-size`. Tente também alterar o tamanho de fonte nas configurações do Chrome.

A seguir, especifique o tamanho de fonte do elemento `article`. Lembre-se de que algumas propriedades são **herdadas**, como é o caso de `font-size`. Use o DevTools para encontrar o tamanho de fonte do parágrafo agora.

**exemplo_percentual.html · elemento `<style>`**

```html
<style>
  p{
    font-size: 200%;
  }
  article{
    font-size: 200%;
  }
</style>
```

### Calculando o percentual desejado

Embora seja interessante utilizar a medida percentual, muitas vezes podemos desejar especificar uma medida determinada, que depende da configuração do navegador do usuário. Por exemplo, talvez queiramos especificar que o tamanho de fonte deve ser de 24 pixels caso o usuário tenha configurado seu navegador para o tamanho de fonte padrão, que é 16px. Não queremos fazer isso usando a medida pixel, para não tirar do usuário a possibilidade de alterar o tamanho da fonte. Queremos especificar, portanto, o tamanho de nossa fonte como um percentual em relação à fonte escolhida pelo usuário.

Em uma conta básica, encontramos o percentual que 24 representa de 16:

$$24 / 16 = 1{,}5$$

Neste caso, 150%, ou seja, 50% maior. Assim, podemos fazer a especificação usando a medida percentual.

**exemplo_percentual.html · elemento `<style>`**

```html
<style>
  p{
    font-size: 150%;
  }
  /*não vamos usar por enquanto
  article{
    font-size: 200%;
  }*/
</style>
```

Use novamente o Chrome DevTools para checar o tamanho da fonte computado para o elemento `p`.

### A base 10 (62,5%)

A conta pode se tornar mais simples se tomarmos como base de comparação o valor 10. Para isso, vamos primeiro calcular o percentual que 10 representa de 16:

$$10 / 16 = 0{,}625$$

Ou seja, 10 é igual a 62,5% de 16. Sendo assim, vamos dizer que a fonte inicial é essa, em percentual.

**exemplo_percentual.html · dentro de `<style>`**

```css
html{
  font-size: 62.5%;
}
```

Feito isso, para que o tamanho da fonte de `p` seja de 24 pixels caso o usuário tenha a configuração padrão em seu navegador, precisamos do seguinte ajuste.

**exemplo_percentual.html · dentro de `<style>`**

```css
p{
  font-size: 240%;
}
```

### Largura e margem em percentual

Agora vamos utilizar a medida percentual para ajustar a largura do elemento `article`. Quando o fazemos, a medida é calculada **em relação ao elemento de que ele é filho**.

**exemplo_percentual.html · dentro de `<style>`**

```css
article{
  background-color: aliceblue;
  border: 1px solid #CCC;
  width: 40%
}
```

Abra o Chrome DevTools novamente e faça testes alterando a largura do navegador, olhando a largura dos componentes na aba **Computed**.

A medida para componentes é sempre relativa à **largura** do componente em que estiverem inseridos, mesmo para medidas verticais. Veja o exemplo a seguir, em que alteramos a margem superior do `article`.

**exemplo_percentual.html · dentro de `<style>`**

```css
article{
  background-color: aliceblue;
  border: 1px solid #CCC;
  width: 40%;
  margin-top: 25%;
}
```

Novamente, faça testes alterando a largura do navegador e olhando os resultados na aba **Computed** do Chrome DevTools.

Com a alteração a seguir, verificaremos que o percentual aplicado sempre se refere ao **pai** do componente.

**exemplo_percentual.html · dentro de `<style>`**

```css
.principal{
  background-color: cornsilk;
  width: 1200px;
  margin: 0 auto;
}
```

Testando no DevTools, veja que a largura do `article` não muda, já que ela está configurada para 40% de 1200 pixels, que é a medida fixa de seu pai.

## A área visível da página: ViewPort
Duration: 15:00

A expressão **ViewPort** se refere à área visível, ou à área útil, de um site. Nesta seção, veremos sua importância relacionada à responsividade. A figura a seguir destaca o ViewPort do site [www.ionicframework.com](https://ionicframework.com/).

![Página inicial do Ionic Framework no navegador, com a área visível do site destacada por um retângulo vermelho](img/fig-2-9-1.webp)

*O ViewPort é a área em que o conteúdo do site é exibido.*

### Simulando dispositivos no DevTools

Outro utilitário que o DevTools do Chrome oferece é a possibilidade de acessar um site como se estivéssemos utilizando um dispositivo, como mostra a figura a seguir.

![Barra de abas do DevTools com o botão de alternar a barra de dispositivos destacado em vermelho](img/fig-2-9-2.webp)

*O botão de alternância da barra de dispositivos (Toggle device toolbar), à esquerda da aba Elements.*

Note também que, uma vez escolhido esse modo, podemos escolher alguns dispositivos conhecidos, ou até fixar uma resolução qualquer.

![Barra de dispositivos do DevTools no modo Responsive, com largura 110 e altura 860 destacadas em vermelho](img/fig-2-9-3.webp)

*No modo Responsive, é possível escolher um dispositivo ou digitar largura e altura.*

Escolha um dispositivo e faça alguns testes em alguns sites que você conhece.

### O zoom dos navegadores móveis

Os navegadores como esse que estamos utilizando aplicam **zoom** a uma página não responsiva para que ela caiba na tela, supondo que ela foi feita para desktops. Para verificar isso, acesse um site não responsivo, como o [https://spark.apache.org/docs/latest/](https://spark.apache.org/docs/latest/), abra o DevTools e visualize o site com diferentes dispositivos. Na aba **Computed**, verifique o que ocorre com o atributo `width`.

Para os testes desta seção, crie um arquivo chamado **exemplo_viewport.html** em seu workspace. Seu conteúdo inicial é o seguinte. Note que há um pequeno trecho de código JavaScript que permite a obtenção da largura e da altura da tela.

**exemplo_viewport.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>ViewPort</title>
    <style>
      body {
        margin: 0px;
      }
      h1{
        margin: 0px;
      }
      .principal{
        width: 400px;
        height: 400px;
        background-color: aliceblue;
      }
    </style>
  </head>
  <body>
    <main class="principal">
      <h1>Entendendo o ViewPort</h1>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet repudiandae quis, obcaecati asperiores enim beatae necessitatibus iusto blanditiis neque explicabo cum cumque dolores tempore distinctio ullam unde? Assumenda, iure quos.
      </p>
    </main>
    <script>
      document.write("<p>" + window.innerWidth + "x" + window.innerHeight + "</p>");
    </script>
  </body>
</html>
```

Abra o DevTools e veja que os navegadores "móveis" dão um zoom de modo a exibir o conteúdo inteiro da tela, tornando os elementos menores.

![Página de exemplo em um dispositivo simulado: o título e o texto aparecem bem pequenos e o tamanho informado é 952x947](img/fig-2-9-4.webp)

*Sem a meta tag viewport, o navegador simula uma tela mais larga e reduz o conteúdo.*

Clique também em **Show Rulers**, sob os três pontinhos, como mostra a figura a seguir. Essa opção mostrará as réguas que tornarão claras as medidas que estão sendo usadas de fato.

![Barra de dispositivos com o Galaxy S5 selecionado, o menu de três pontinhos destacado e as réguas exibidas acima da página](img/fig-2-9-5.webp)

*A opção Show Rulers, no menu de três pontinhos, exibe réguas com as medidas reais.*

### A meta tag viewport

Quando fazemos um site responsivo, devemos instruir o navegador sobre isso. Devemos dizer a ele que o site está pronto para ser acessado por um dispositivo móvel e que ele não deve fazer esse zoom que vimos. Isso é feito por meio da meta tag **viewport**. Com ela, especificamos duas coisas:

* A largura a ser usada é igual à largura real do dispositivo: ele não deve tentar simular uma largura maior para fazer o conteúdo caber na tela.
* O nível de zoom, em que especificamos que nenhum zoom deve ser feito.

A meta tag deve ser especificada como a seguir. Ela deve ser filha do elemento `head`.

**exemplo_viewport.html · dentro de `<head>`**

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Depois do ajuste, verifique o resultado com dispositivos diferentes no DevTools.

Resumindo, essa configuração serviu para instruirmos o navegador a não tentar fazer ajustes ao exibir a página, pois o nosso site está projetado para ser acessado por dispositivos móveis.

## Layouts fixos e fluidos
Duration: 10:00

Quando desenvolvemos um site responsivo, precisamos tomar o cuidado de ajustar a largura dos componentes conforme o tamanho da tela diminui. A unidade percentual pode nos ajudar nisso. Para esta seção, crie um arquivo chamado **exemplo_fixo_fluido.html**. Seu conteúdo inicial é o seguinte.

**exemplo_fixo_fluido.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Layout Fixo versus Layout Fluido</title>
    <style>
      body{
        margin: 0;
        font-size: 32px;
      }
      .engenharia, .farmacia, .matematica{
        display: inline-block;
        border: solid 1px black;
        padding: 12px;
        width: 300px;
        height: 80px;
      }
    </style>
  </head>
  <body>
    <main>
      <article class="engenharia">
        Engenharia
      </article>
      <article class="farmacia">
        Farmácia
      </article>
      <article class="matematica">
        Matemática
      </article>
    </main>
  </body>
</html>
```

### Layout fixo

Começamos com um exemplo de **layout fixo**. Vamos determinar uma medida de largura para o elemento `main` e centralizá-lo.

**exemplo_fixo_fluido.html · dentro de `<style>`**

```css
main{
  border: solid 1px black;
  width: 1280px;
  margin: 0 auto;
  text-align: center;
}
```

Veja o que ocorre quando a largura do navegador é reduzida. Dado que a medida do contêiner principal está fixa em pixels, em algum momento parte do conteúdo deixa de ser visível.

A seguir, vamos especificar a largura de cada `article`. Podemos tentar ajustá-la, já que ela também está definida com pixels. Altere para, por exemplo, 20%.

**exemplo_fixo_fluido.html · dentro de `<style>`**

```css
.engenharia, .farmacia, .matematica{
  display: inline-block;
  border: solid 1px black;
  padding: 12px;
  width: 20%;
  height: 50px;
}
```

Note que nada mudou. Isso ocorre pois o percentual dos elementos `article` se refere à medida de seu pai, que é o elemento `main`. Como `main` tem largura fixa em 1280 pixels, a largura de cada `article` está dada e é fixa:

$$1280 \times 0{,}2 = 256 \text{ pixels}$$

### Layout fluido

Vamos, portanto, definir a largura do componente `main` usando a medida percentual também. Para simplificar, digamos que `main` toma 100% da largura da tela. Conforme a largura da tela diminui, o valor computado de `main` diminui e, por consequência, o valor de todos os seus filhos também.

**exemplo_fixo_fluido.html · dentro de `<style>`**

```css
main{
  border: solid 1px black;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
```

Esse é um exemplo de **layout fluido**. Note, contudo, que quando a tela fica muito pequena horizontalmente, a apresentação se torna inadequada. Precisamos de mais recursos.

## Media Queries
Duration: 10:00

Esse recurso permite especificarmos valores para propriedades que devem ser usados de acordo com a medida da tela sendo utilizada pelo usuário. Para esta seção, usaremos o mesmo código (**exemplo_fixo_fluido.html**) do passo anterior.

> **Breakpoint**
>
> Ponto de quebra que nos permite indicar, por exemplo, uma quantidade mínima de pixels necessária para que determinadas propriedades sejam aplicadas.

### Empilhando os cursos

Antes de mais nada, vamos fazer com que os cursos fiquem empilhados, comentando as propriedades `display` e `width`.

**exemplo_fixo_fluido.html · dentro de `<style>`**

```css
.engenharia, .farmacia, .matematica{
  /*display: inline-block;*/
  border: solid 1px black;
  padding: 12px;
  /*width: 20%;*/
  height: 50px;
}
```

### O primeiro breakpoint

A seguir, vamos especificar nosso primeiro breakpoint, indicando que a exibição deve mudar a partir de uma medida mínima em pixels.

**exemplo_fixo_fluido.html · dentro de `<style>`**

```css
@media(min-width: 900px){
  .engenharia, .farmacia, .matematica{
    display: inline-block;
    width: 20%;
  }
}
```

Faça testes alterando a largura do seu navegador. Teste também com o modo para dispositivos móveis do Chrome DevTools.

### Qualquer propriedade pode mudar

Veja que quaisquer propriedades podem ser alteradas em uma Media Query. A seguir, fazemos ajustes para alterar a cor de fundo (e comentamos o tamanho de fonte do `body`).

**exemplo_fixo_fluido.html · dentro de `<style>`**

```css
body{
  margin: 0;
  /*font-size: 32px;*/
}

@media (min-width: 550px){
  .engenharia, .farmacia, .matematica{
    background-color: aliceblue;
  }
}
```

Teste novamente com diferentes larguras: abaixo de 550px os cursos ficam empilhados e sem cor de fundo; entre 550px e 900px, empilhados e com fundo `aliceblue`; a partir de 900px, lado a lado.

## Encerramento
Duration: 3:00

Parabéns! Neste codelab você:

* Controlou como os elementos são exibidos com `display` (`block`, `inline`, `inline-block` e `none`)
* Estilizou bordas com `border`, suas variações e `border-radius`
* Ajustou espaçamentos internos e externos com `padding` e `margin`, inclusive margens negativas e `auto`
* Entendeu o Box Model e a diferença entre `content-box` e `border-box`
* Comparou as unidades pixel e percentual do ponto de vista da responsividade
* Configurou a meta tag `viewport` e simulou dispositivos no Chrome DevTools
* Transformou um layout fixo em fluido e aplicou breakpoints com Media Queries

### Referências

* Web Hypertext Application Technology Working Group (WHATWG). 2020. Disponível em [https://whatwg.org/](https://whatwg.org/). Acesso em março de 2020.
* MDN Web Docs. Disponível em [https://developer.mozilla.org/en-US/](https://developer.mozilla.org/en-US/). Acesso em março de 2020.
* CSS Working Group. *Visual formatting model details: Computing widths and margins*. Disponível em [https://drafts.csswg.org/css2/visudet.html#Computing_widths_and_margins](https://drafts.csswg.org/css2/visudet.html#Computing_widths_and_margins).
