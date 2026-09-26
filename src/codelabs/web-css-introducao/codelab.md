summary: Aprenda os fundamentos de CSS na prática: CSS inline, elemento style e arquivo externo, seletores por tipo, id e classe, seletores descendentes e de filhos diretos, efeito em cascata, especificidade, cores, fontes (inclusive Google Fonts) e inspeção de estilos com o Chrome DevTools.
id: web-css-introducao
categories: HTML e CSS
tags: css,html,seletores,cascata,especificidade,cores,fontes,google fonts,devtools
status: Published
authors: Rodrigo Bossini
last updated: 2022-08-24
pdf: tti107_ads2001/04_apostila_css_introducao.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Introdução a CSS

## Visão geral
Duration: 3:00

As páginas que visitamos são escritas utilizando-se HTML, que é uma linguagem apropriada para a especificação de sua **estrutura**. Por exemplo, usamos HTML para especificar que uma página possui um cabeçalho principal, uma seção principal, um rodapé, duas seções laterais etc.

A linguagem **CSS**, por sua vez, é utilizada para especificar o **estilo** das páginas. Cores, espaçamento, posicionamento, bordas e muitas outras características de uma página são especificadas utilizando-se CSS.

Neste codelab, você estuda os recursos de CSS de maneira prática, aplicando estilos a pequenas páginas HTML.

### O que você vai aprender

* O que é CSS e como a linguagem evoluiu (CSS 1, CSS 2, CSS3 e seus módulos)
* Três formas de aplicar CSS: inline, com o elemento `style` e com um arquivo externo importado pelo elemento `link`
* Herança de propriedades entre elementos pai e filhos
* Seletores por tipo, por id, por classe, com múltiplas classes e combinados
* Agrupamento de seletores, seletores descendentes e seletores de filhos diretos
* O efeito em cascata do CSS, o modificador `!important` e o algoritmo de especificidade
* Formas de especificar cores: nomes pré-definidos, `rgb` e hexadecimal
* Formatação de texto: famílias de fontes, serifas, Google Fonts, `font` e `text-decoration`
* Inspeção e alteração de estilos com o Chrome DevTools

### O que você vai precisar

* Um editor de texto (a apostila usa o **VS Code**)
* Um navegador (a apostila usa o **Google Chrome**)
* Opcionalmente, a extensão **Live Server** do VS Code

## CSS: o nome e as versões
Duration: 5:00

Antes de prosseguirmos, vejamos algumas informações importantes.

1. CSS é sigla para **Cascading Style Sheets** (algo como folhas de estilo em cascata). Entenderemos esse nome em breve.
2. A primeira versão de CSS, chamada **CSS 1**, foi lançada em 1996.
3. Em 1998, foi lançada a segunda versão de CSS, chamada **CSS 2**.
4. **CSS3** é a última versão de CSS e foi lançada em 1999.
5. CSS3 se encontra em contínuo desenvolvimento desde então.
6. CSS3 é dividida em **módulos**. Módulos para cor, para sombreamento etc. Cada módulo tem seu próprio esquema de versionamento. A ideia é prosseguir adicionando novos módulos e aprimorar cada um deles, dando origem a novas versões de módulos. Por isso, não há CSS4 ou algo parecido com isso. Veja a figura a seguir.

![Linha do tempo com CSS1 em 1996, CSS2 em 1998 e CSS3 em 1999, e CSS3 dividida em módulos, cada um com as suas próprias versões](img/p001-1.webp)

*Figura 1.1: evolução de CSS e a divisão de CSS3 em módulos versionados de forma independente.*

7. Visite o link a seguir para ver a lista de especificações de CSS: [https://www.w3.org/Style/CSS/specs.en.html](https://www.w3.org/Style/CSS/specs.en.html)

Por curiosidade, veja o que a página fala sobre a primeira versão de CSS:

> Level 1 contains just the most basic properties of CSS, such as 'margin', 'padding', 'background', 'color' and 'font', with restrictions on the allowed values. It was the first level of CSS to be completed (in 1996) and matched the capabilities of implementations of the time. It is currently only of historical interest; all implementations should be able to support level 2 and probably large parts of level 3, too.

8. É importante observar que, conforme a especificação de CSS evolui, os navegadores as implementam pouco a pouco. Visite o link a seguir para verificar como se encontram as principais implementações no momento: [https://en.wikipedia.org/wiki/Comparison_of_browser_engines_(CSS_support)](https://en.wikipedia.org/wiki/Comparison_of_browser_engines_(CSS_support))

## Preparando o ambiente
Duration: 5:00

Passamos a estudar os recursos de CSS de maneira prática.

<aside class="positive">

**Nota.** Caso esteja utilizando o VS Code, a extensão **Live Server**, de Ritwick Dey, pode ser interessante. Ela permite a visualização das páginas desenvolvidas. Para utilizá-la, colocamos um servidor local em funcionamento que se encarrega de atualizar a página automaticamente conforme salvamos os arquivos que estamos editando.

</aside>

<aside class="positive">

**Nota.** A escrita de CSS requer apenas um editor de texto. Apesar disso, há diversas ferramentas que podem ser de interesse. Veja: [https://www.w3.org/Style/CSS/software#editors](https://www.w3.org/Style/CSS/software#editors)

</aside>

### Criando uma pasta e um arquivo

Crie uma pasta para os próximos experimentos. Caso esteja utilizando o sistema operacional Windows, uma sugestão é utilizar

**Pasta sugerida**

```text
C:\Users\seuUsuario\Documents\intro_css
```

<aside class="negative">

Tome sempre cuidado para não utilizar pastas que estejam sob o efeito do OneDrive, Dropbox ou outros.

</aside>

A seguir, vincule o VS Code à pasta criada clicando em **File >> Open Folder**:

![Menu File do VS Code aberto, com a opção Open Folder destacada](img/p003-1.webp)

*Abrindo a pasta do projeto no VS Code.*

A seguir, crie um arquivo chamado `index.html`:

![Explorer do VS Code com o botão de novo arquivo destacado e o nome index.html sendo digitado](img/p003-2.webp)

*Criando o arquivo index.html na pasta intro_css.*

Veja o conteúdo inicial do arquivo a seguir. Ele ainda não possui código CSS algum. Vamos usá-lo como um primeiro exemplo para aplicar estilos CSS.

**index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Cursos</title>
</head>
<body>
  <h1>Portal de cursos</h1>
  <p>Temos cursos nas mais diversas áreas.</p>
  <p>Venha conversar conosco e conhecer nossas ofertas de <strong>bolsas de estudos</strong>.</p>
</body>
</html>
```

## CSS inline
Duration: 5:00

A seguir, vamos alterar a cor de fonte do primeiro parágrafo. Para isso, usamos um atributo que o elemento possui. Neste caso, ele se chama `style`. Essa forma de escrever, diretamente no elemento, se chama **inline**. Logo veremos outras alternativas.

Ainda neste exemplo, dizemos que

* `color` é uma **propriedade** CSS
* `blue` é um **valor** associado à propriedade `color`
* `color: blue;`, escritos desta forma, caracterizam uma **regra CSS**

**index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Cursos</title>
</head>
<body>
  <h1>Portal de cursos</h1>
  <p style="color: blue">Temos cursos nas mais diversas áreas.</p>
  <p>Venha conversar conosco e conhecer nossas ofertas de <strong>bolsas de estudos</strong>.</p>
</body>
</html>
```

Abra o arquivo `index.html` utilizando seu navegador preferido para ver o resultado, que deve ser parecido com o seguinte:

![Página Portal de cursos com o primeiro parágrafo em azul e o restante em preto](img/p005-1.webp)

*O primeiro parágrafo aparece em azul.*

Altere também a cor de fonte dos demais elementos:

**index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Cursos</title>
</head>
<body>
  <h1 style="color: green">Portal de cursos</h1>
  <p style="color: blue">Temos cursos nas mais diversas áreas.</p>
  <p style="color: blue">Venha conversar conosco e conhecer nossas ofertas de <strong>bolsas de estudos</strong>.</p>
</body>
</html>
```

## O elemento style, seletores e herança
Duration: 6:00

### Problemas com CSS inline: usando o elemento style e seletores

Note que o CSS inline apresenta alguns problemas:

* não é possível reutilizar definições. Para deixar a cor de fonte dos dois parágrafos em azul, precisamos escrever o código duas vezes.
* as regras CSS ficam "misturadas" com o código HTML, o que pode tornar mais difícil a manutenção da página.

Uma outra possibilidade é fazer as definições desejadas em um elemento do tipo `style`, que deve ser definido como filho do `head` da página. Para isso, passaremos a utilizar os **seletores CSS**. Um seletor permite especificar o elemento ou elementos cujas propriedades desejamos alterar. Veja como fica a seguir. Não se esqueça de remover o CSS inline.

**index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Cursos</title>
  <style>
    /* selecionamos os elementos h1 aqui */
    h1 {
      color: green;
    }
    /* aqui selecionamos os elementos p */
    p {
      color: blue;
    }
  </style>
</head>
<body>
  <h1>Portal de cursos</h1>
  <p>Temos cursos nas mais diversas áreas.</p>
  <p>Venha conversar conosco e conhecer nossas ofertas de <strong>bolsas de estudos</strong>.</p>
</body>
</html>
```

### Herança de regras

Perceba, também, que o texto do elemento `strong` ficou azul, embora não tenhamos especificado isso. Ocorre que algumas propriedades são **herdadas** pelos elementos filhos. É o caso, por exemplo, da propriedade `color`. Caso queiramos, podemos definir outra cor para o `strong`:

**index.html**

```html
…
  <title>Cursos</title>
  <style>
    /* selecionamos os elementos h1 aqui */
    h1 {
      color: green;
    }
    /* aqui selecionamos os elementos p */
    p {
      color: blue;
    }
    strong {
      color: red;
    }
  </style>
…
```

## Separando o CSS em um arquivo
Duration: 8:00

Os estilos estão definidos no mesmo arquivo em que o conteúdo HTML está definido. Em geral, isso não é uma boa prática, pois compromete o nível de reusabilidade e manutenibilidade das definições. Para resolver isso, podemos criar um novo arquivo textual em que as definições serão feitas e importá-lo no arquivo HTML. Assim, ele pode ser importado por diferentes arquivos, se necessário.

* Comece criando uma pasta chamada `css` no mesmo diretório em que está o arquivo `index.html`. A criação da pasta é opcional e o nome é qualquer. É somente uma convenção bastante utilizada no mercado.
* A seguir, dentro da pasta recém-criada, crie um arquivo chamado `styles.css`. O nome também é só uma convenção, é possível usar qualquer nome.
* A seguir, recorte toda a definição feita anteriormente no elemento `style` e cole no arquivo recém-criado, sem incluir o elemento `style`.

Veja o arquivo `styles.css`:

**css/styles.css**

```css
/* arquivo styles.css */
/* selecionamos os elementos h1 aqui */
h1 {
  color: green;
}
/* aqui selecionamos os elementos p */
p {
  color: blue;
}
strong {
  color: red;
}
```

E agora o arquivo `index.html`:

**index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Cursos</title>
  <!-- o elemento style foi removido por completo -->
</head>
…
```

Observe que, neste momento, as regras CSS não têm mais efeito sobre os elementos HTML:

![Página Portal de cursos sem nenhum estilo, com todo o texto em preto](img/p010-1.webp)

*Sem o elemento style, a página volta à aparência padrão.*

### O elemento link

Resta saber como acessar o conteúdo definido no arquivo CSS a partir do arquivo HTML. Isso pode ser feito por meio de um elemento chamado `link`, definido como filho de `head`. Em seu atributo `href`, especificamos o endereço do arquivo a ser importado, considerando a pasta em que ele está. Não deixe de apagar o elemento `style` usado anteriormente.

<aside class="positive">

**Nota.** O atributo `rel` do elemento `link` vem de "relationship". A ideia é que estamos estabelecendo uma relação entre o arquivo atual e um recurso externo. Embora o elemento `link` seja muito mais comumente utilizado para importar arquivos CSS, ele também pode ser usado na definição de ícones e outros recursos. Veja mais aqui: [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)

</aside>

Veja seu uso no arquivo `index.html`:

**index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Cursos</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
…
```

A página deverá ser exibida já com o efeito das regras CSS novamente:

![Página Portal de cursos com título verde, parágrafos azuis e o texto bolsas de estudos em vermelho](img/p011-1.webp)

*As regras do arquivo styles.css voltam a valer.*

## Seletores por id e por classe
Duration: 10:00

Estamos utilizando seletores para especificar a quais elementos determinadas regras CSS devem ser aplicadas. Os seletores que utilizamos até então se baseiam no **tipo** do elemento. Também podemos utilizar seletores que se baseiam em **classes** e em **ids**.

### Seletor por id

Para usar um seletor baseado em id:

* especificamos um identificador para o elemento que desejamos selecionar usando seu atributo `id`.
* depois, no arquivo CSS, o selecionamos pelo id, precedendo o nome do id pelo símbolo `#`.

Para este exemplo, apague todo o conteúdo do arquivo `.css`. No arquivo `index.html`, especificamos um id para o elemento `h1`, por exemplo:

**index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Cursos</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <h1 id="titulo">Portal de cursos</h1>
…
```

No arquivo `styles.css`, aplicamos o seletor como descrito. Observe que aproveitamos para centralizar o texto com outra regra CSS.

**css/styles.css**

```css
#titulo {
  color: green;
  text-align: center;
}
```

Resultado esperado:

![Página com o título Portal de cursos verde e centralizado e os parágrafos em preto](img/p012-1.webp)

*O título, selecionado pelo id, fica verde e centralizado.*

### Seletor por tipo e id

Dá para ser mais específico, dizendo que somente elementos de um determinado tipo **e** com um id definido devem ser selecionados. No arquivo `index.html`:

**index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Cursos</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <h1 id="titulo">Portal de cursos</h1>
  <!-- somente o primeiro p tem id definido -->
  <p id="descricao">Temos cursos nas mais diversas áreas.</p>
…
```

No arquivo `styles.css`:

**css/styles.css**

```css
#titulo {
  color: green;
  text-align: center;
}
/* somente elementos do tipo p que tenham id igual a descrição */
p#descricao {
  color: blue;
}
```

Resultado esperado:

![Página com o título verde centralizado, o primeiro parágrafo azul e o segundo em preto](img/p013-1.webp)

*Apenas o parágrafo com id descricao fica azul.*

### Seletor por classe

Elementos HTML têm um atributo chamado `class`. Para usar um seletor baseado em classe:

* no arquivo HTML, especificamos um ou mais nomes que ficam associados ao atributo `class` do elemento.
* no arquivo CSS, para cada nome definido, escrevemos um seletor que consiste de seu nome precedido por um ponto (`.`).

Veja o exemplo a seguir, no arquivo `index.html`:

**index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Cursos</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <h1 id="titulo">Portal de cursos</h1>
  <!-- somente o primeiro p tem id definido -->
  <p id="descricao">Temos cursos nas mais diversas áreas.</p>
  <p class="promocao">Venha conversar conosco e conhecer nossas ofertas de <strong>bolsas de estudos</strong>.</p>
</body>
</html>
```

O arquivo `styles.css` fica assim:

**css/styles.css**

```css
#titulo {
  color: green;
  text-align: center;
}
/* somente elementos do tipo p que tenham id igual a descrição */
p#descricao {
  color: blue;
}
.promocao {
  text-align: center;
  background-color: lightgreen;
}
```

Resultado esperado:

![Página com o segundo parágrafo centralizado e com fundo verde-claro](img/p015-1.webp)

*O parágrafo com a classe promocao ganha fundo verde-claro e fica centralizado.*

### Seletor por tipo e classe

De maneira análoga ao que ocorre com o id, também podemos ser mais específicos quando usamos classes, dizendo que somente elementos de um determinado tipo e cuja classe seja alguma que definirmos devem ser selecionados. Veja como fica no arquivo `styles.css`:

**css/styles.css**

```css
#titulo {
  color: green;
  text-align: center;
}
/* somente elementos do tipo p que tenham id igual a descrição */
p#descricao {
  color: blue;
}
p.promocao {
  text-align: center;
  background-color: lightgreen;
}
```

Observe que o resultado visual não mudou neste caso, já que temos apenas um elemento do tipo `p` ao qual aplicamos a classe `promocao` e ele já estava sob o efeito dessa classe. Faça um teste com o seguinte seletor no arquivo `styles.css`:

**css/styles.css**

```css
…
h1.promocao {
  color: yellow
}
```

Estamos tentando selecionar todos os elementos do tipo `h1` que tenham a classe `promocao` aplicada a eles. Como não há nenhum, nada mudou graficamente. Pode apagar essa regra depois de realizar o teste.

## Múltiplas classes e seletores combinados
Duration: 7:00

### Múltiplas classes

O atributo `class` admite um número arbitrário de classes. Para especificá-las, basta separar seus nomes por um espaço em branco. Veja um exemplo no arquivo `styles.css`:

**css/styles.css**

```css
#titulo {
  color: green;
  text-align: center;
}
/* somente elementos do tipo p que tenham id igual a descrição */
p#descricao {
  color: blue;
}
p.promocao {
  text-align: center;
  background-color: lightgreen;
}
.nova {
  color: white;
}
```

O arquivo `index.html` fica assim:

**index.html**

```html
…
<body>
  <h1 id="titulo">Portal de cursos</h1>
  <!-- somente o primeiro p tem id definido -->
  <p id="descricao">Temos cursos nas mais diversas áreas.</p>
  <p class="nova promocao">Venha conversar conosco e conhecer nossas ofertas de <strong>bolsas de estudos</strong>.</p>
</body>
…
```

E o resultado esperado se parece com este:

![Página com o parágrafo de promoção em texto branco sobre fundo verde-claro](img/p018-1.webp)

*O parágrafo recebe as regras das duas classes: nova e promocao.*

### Seletores por id, classe e tipo

Existe também a possibilidade de se escrever seletores que envolvem o tipo, a classe e o id simultaneamente. Veja o exemplo a seguir, no arquivo `index.html`:

**index.html**

```html
…
<body>
  <h1 id="titulo">Portal de cursos</h1>
  <!-- somente o primeiro p tem id definido -->
  <p id="descricao">Temos cursos nas mais diversas áreas.</p>
  <p class="nova promocao">Venha conversar conosco e conhecer nossas ofertas de <strong>bolsas de estudos</strong>.</p>
  <!-- esse p tem somente classe -->
  <p class="final-pagina">Entre em contato: 11223344</p>
  <!-- esse p tem id e classe. a ordem não importa -->
  <p id="rodape" class="final-pagina">&copy; Todos os direitos reservados</p>
</body>
…
```

No arquivo `styles.css`:

**css/styles.css**

```css
#titulo {
  color: green;
  text-align: center;
}
/* somente elementos do tipo p que tenham id igual a descrição */
p#descricao {
  color: blue;
}
p.promocao {
  text-align: center;
  background-color: lightgreen;
}
.nova {
  color: white;
}
/* todo p que tenha a classe final-pagina e cujo id seja rodape */
p.final-pagina#rodape {
  background-color: lightgray;
  text-align: center;
}
```

## Agrupamento de seletores
Duration: 8:00

### Regras repetidas em seletores diferentes

Suponha que temos duas classes CSS que possuem algumas regras em comum, como a seguir, no arquivo `styles.css`:

**css/styles.css**

```css
…
/* todo p que tenha a classe final-pagina e cujo id seja rodape */
p.final-pagina#rodape {
  background-color: lightgray;
  text-align: center;
}
/* todo curso tem essa cor de fundo */
.curso {
  background-color: aliceblue;
}
/* veja a cor de fundo repetida para que possamos especificar uma regra não aplicável aos demais cursos */
.novo-curso {
  background-color: aliceblue;
  color: red;
}
```

No arquivo `index.html`:

**index.html**

```html
…
<body>
  <h1 id="titulo">Portal de cursos</h1>
  <!-- somente o primeiro p tem id definido -->
  <p id="descricao">Temos cursos nas mais diversas áreas.</p>
  <p class="nova promocao">Venha conversar conosco e conhecer nossas ofertas de <strong>bolsas de estudos</strong>.</p>
  <p>Cursos:</p>
  <p class="novo-curso">Ciência da Computação</p>
  <p class="curso">Engenharia de Computação</p>
  <p class="curso">Farmácia</p>
  <!-- esse p tem somente classe -->
  <p class="final-pagina">Entre em contato: 11223344</p>
  <!-- esse p tem id e classe. a ordem não importa -->
  <p id="rodape" class="final-pagina">&copy; Todos os direitos reservados</p>
</body>
…
```

Perceba que a cor de fundo para ambas as classes é a mesma. Ou seja, elas têm características em comum. E a classe `novo-curso` possui algumas outras propriedades. Essa definição pode ser reescrita como a seguir, agrupando classes de modo que definições comuns a elas sejam escritas uma única vez. O operador próprio para esse agrupamento é a **vírgula**:

**css/styles.css**

```css
…
/* todo p que tenha a classe final-pagina e cujo id seja rodape */
p.final-pagina#rodape {
  background-color: lightgray;
  text-align: center;
}
/* separamos os seletores usando uma vírgula. Ela faz um papel de "ou" lógico */
.curso, .novo-curso {
  background-color: aliceblue;
}
/* agora não precisamos mais repetir a cor de fundo */
.novo-curso {
  color: red;
}
```

Veja um próximo exemplo de agrupamento de seletores. Temos um seletor por id e dois por classe. No arquivo `styles.css`:

**css/styles.css**

```css
…
/* separamos os seletores usando uma vírgula. Ela faz um papel de "ou" lógico */
.curso, .novo-curso {
  background-color: aliceblue;
}
/* agora não precisamos mais repetir a cor de fundo */
.novo-curso {
  color: red;
}
.curso, .novo-curso, #contato {
  /* padding: espaço entre o conteúdo e a borda. Veremos mais sobre isso adiante */
  padding: 12px;
  /* estudaremos mais sobre bordas também */
  border: 1px solid lightgray;
}
```

No arquivo `index.html`:

**index.html**

```html
…
  <p>Cursos:</p>
  <p class="novo-curso">Ciência da Computação</p>
  <p class="curso">Engenharia de Computação</p>
  <p class="curso">Farmácia</p>
  <!-- esse p tem somente classe -->
  <p id="contato" class="final-pagina">Entre em contato: 11223344</p>
  <!-- esse p tem id e classe. a ordem não importa -->
  <p id="rodape" class="final-pagina">&copy; Todos os direitos reservados</p>
</body>
…
```

Veja o resultado esperado:

![Página com os cursos e o contato em caixas com borda cinza e fundo azul-claro, Ciência da Computação em vermelho e o rodapé centralizado com fundo cinza](img/p025-1.webp)

*Cursos e contato compartilham padding e borda graças ao agrupamento de seletores.*

<aside class="positive">

**Nota.** Por um lado, agrupar seletores evita escrever código repetido, o que simplifica manutenções futuras. Por outro lado, como veremos, em alguns casos estaremos interessados em escrever componentes (elementos HTML decorados com CSS) independentes e reutilizáveis, que possam existir em qualquer contexto, de maneira independente dos demais. Neste caso, o agrupamento pode não ser desejado. Há um meio-termo, portanto, a ser levado em consideração. Cabe ao programador decidir o que é melhor dentro de cada cenário.

</aside>

## Seletores descendentes
Duration: 10:00

Para este exemplo, crie um novo arquivo chamado `mais_seletores.html` na raiz do projeto, lado a lado com o arquivo `index.html`. Veja seu conteúdo inicial. Para simplificar, vamos especificar as regras CSS direto no arquivo HTML, sem usar um arquivo `.css`, portanto.

**mais_seletores.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="utf-8">
  <title>Mais seletores</title>
  <!-- vamos especificar as regras CSS aqui, para simplificar -->
  <style>

  </style>
</head>

<body>
  <main>
    <h1 id="titulo">Portal de cursos</h1>
    <p id="descricao">Possuímos cursos nas mais diversas áreas</p>

    <p class="promocao nova">Venha conversar conosco e conhecer nossas ofertas de <strong>bolsas de estudos</strong>.</p>

    <p>Cursos:</p>
    <article>
      <p class="novo-curso">Medicina</p>
      <p class="curso">Engenharia de Computação</p>
      <p class="curso">Farmácia</p>
    </article>

    <p id="contato" class="final-pagina">Entre em contato: 11223344</p>

    <p id="rodape" class="final-pagina">Todos os direitos reservados</p>
  </main>

</body>

</html>
```

Considere a necessidade de aumentar o padding e trocar a cor de fundo dos elementos que são cursos. Podemos aplicar, além dos recursos já vistos, **seletores descendentes**. No exemplo dado, definimos todo o conteúdo da página em um elemento `main`, e os parágrafos que representam cursos estão agrupados em um `article`. Desejamos aumentar o padding e trocar a cor de fundo de todos os elementos `p` que sejam filhos (diretos ou "subfilhos", "subsubfilhos" e assim por diante) de um `article`. Veja:

**mais_seletores.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="utf-8">
  <title>Mais seletores</title>
  <!-- vamos especificar as regras CSS aqui, para simplificar -->
  <style>
    /* esse é um seletor descendente, representado pelo espaço em branco. pegamos todos os p's que sejam filhos diretos ou indiretos de um article. */
    article p {
      padding: 12px;
      background-color: lightgray;
    }
  </style>
</head>
…
```

Observe o resultado. Somente os elementos `p` que são filhos de um `article` foram selecionados:

![Página em que apenas os três cursos, Medicina, Engenharia de Computação e Farmácia, têm fundo cinza e espaçamento interno](img/p028-1.webp)

*Somente os parágrafos dentro do article recebem fundo cinza e padding.*

Faça a alteração a seguir e note que o novo parágrafo, embora não seja filho direto de `article`, também sofre o efeito das regras CSS:

**mais_seletores.html**

```html
…
    <p>Cursos:</p>
    <article>
      <p class="novo-curso">Medicina</p>
      <p class="curso">Engenharia de Computação</p>
      <p class="curso">Farmácia</p>
      <section>
        <!-- esse p não é filho direto de article mas é descendente. as regras css o atingem também -->
        <p class="coordenadores">Saiba que nossos coordenadores estão à sua disposição!</p>
      </section>
    </article>
…
```

Seletores diferentes (por tipo, classe ou id) também podem ser "misturados", construindo um seletor descendente mais complexo:

**mais_seletores.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="utf-8">
  <title>Mais seletores</title>
  <!-- vamos especificar as regras CSS aqui, para simplificar -->
  <style>
    /* esse é um seletor descendente, representado pelo espaço em branco. pegamos todos os p's que sejam filhos diretos ou indiretos de um article. */
    article p {
      padding: 12px;
      background-color: lightgray;
    }
    /* todo p que tenha a classe promoção e que seja descendente de um elemento cujo id seja principal */
    #principal p.promocao {
      padding: 12px;
      background-color: aliceblue;
    }
  </style>
</head>

<body>
  <main id="principal">
    <h1 id="titulo">Portal de cursos</h1>
…
```

Resultado esperado:

![Página com o parágrafo de promoção em fundo azul-claro, os cursos e o texto dos coordenadores em caixas cinza](img/p030-1.webp)

*O parágrafo de promoção, descendente de #principal, ganha fundo azul-claro.*

Veja um exemplo ainda mais específico:

**mais_seletores.html**

```html
…
<head>
  <meta charset="utf-8">
  <title>Mais seletores</title>
  <!-- vamos especificar as regras CSS aqui, para simplificar -->
  <style>
    /* esse é um seletor descendente, representado pelo espaço em branco. pegamos todos os p's que sejam filhos diretos ou indiretos de um article. */
    article p {
      padding: 12px;
      background-color: lightgray;
    }
    /* todo p que tenha a classe promoção e que seja descendente de um elemento cujo id seja principal */
    #principal p.promocao {
      padding: 12px;
      background-color: aliceblue;
    }
    /* todo p que tenha a classe coordenadores, que seja descendente de um section, que seja descendente de um article, que seja descendente de um elemento de id igual a principal, que seja descendente de body */
    body #principal article section p.coordenadores {
      text-align: center;
    }
  </style>
</head>
```

Observe que o texto sobre os coordenadores deve ter sido centralizado horizontalmente:

![Página com o texto Saiba que nossos coordenadores estão à sua disposição centralizado dentro da caixa cinza](img/p032-1.webp)

*O parágrafo dos coordenadores fica centralizado.*

## Seletores de filhos diretos
Duration: 10:00

O símbolo `>` permite selecionar elementos que sejam **filhos diretos** de um determinado elemento. Suponha que desejamos selecionar todos os parágrafos que sejam filhos diretos de `article`, e somente eles. Podemos fazer assim:

**mais_seletores.html**

```html
…
  <style>
    /* esse é um seletor descendente, representado pelo espaço em branco. pegamos todos os p's que sejam filhos diretos ou indiretos de um article. */
    article p {
      padding: 12px;
      background-color: lightgray;
    }
    /* todo p que tenha a classe promoção e que seja descendente de um elemento cujo id seja principal */
    #principal p.promocao {
      padding: 12px;
      background-color: aliceblue;
    }
    /* todo p que tenha a classe coordenadores, que seja descendente de um section, que seja descendente de um article, que seja descendente de um elemento de id igual a principal, que seja descendente de body */
    body #principal article section p.coordenadores {
      text-align: center;
    }
    /* todos os p's que sejam filhos diretos de article. O p que é filho de section não é selecionado, portanto. */
    article > p {
      border: 1px solid black
    }
  </style>
…
```

Veja o resultado visual. Observe que somente os cursos têm borda:

![Página em que Medicina, Engenharia de Computação e Farmácia têm borda preta e a caixa dos coordenadores não tem](img/p034-1.webp)

*Com o seletor de filhos diretos, só os cursos recebem borda.*

Agora remova o símbolo `>`, deixando um espaço em branco:

**mais_seletores.html**

```html
…
  <style>
    /* esse é um seletor descendente, representado pelo espaço em branco. pegamos todos os p's que sejam filhos diretos ou indiretos de um article. */
    article p {
      padding: 12px;
      background-color: lightgray;
    }
    /* todo p que tenha a classe promoção e que seja descendente de um elemento cujo id seja principal */
    #principal p.promocao {
      padding: 12px;
      background-color: aliceblue;
    }
    /* todo p que tenha a classe coordenadores, que seja descendente de um section, que seja descendente de um article, que seja descendente de um elemento de id igual a principal, que seja descendente de body */
    body #principal article section p.coordenadores {
      text-align: center;
    }
    /* agora é seletor descendente. o p que é filho de section também é selecionado. */
    article p {
      border: 1px solid black
    }
  </style>
…
```

Observe que a caixa sobre os coordenadores agora também tem borda:

![Página em que os três cursos e a caixa dos coordenadores têm borda preta](img/p036-1.webp)

*Com o seletor descendente, a caixa dos coordenadores também recebe borda.*

Veja um exemplo mais específico:

**mais_seletores.html**

```html
…
  <style>
    /* esse é um seletor descendente, representado pelo espaço em branco. pegamos todos os p's que sejam filhos diretos ou indiretos de um article. */
    article p {
      padding: 12px;
      background-color: lightgray;
    }
    /* todo p que tenha a classe promoção e que seja descendente de um elemento cujo id seja principal */
    #principal p.promocao {
      padding: 12px;
      background-color: aliceblue;
    }
    /* todo p que tenha a classe coordenadores, que seja descendente de um section, que seja descendente de um article, que seja descendente de um elemento de id igual a principal, que seja descendente de body */
    body #principal article section p.coordenadores {
      text-align: center;
    }
    /* agora é seletor descendente. o p que é filho de section também é selecionado. */
    article p {
      border: 1px solid black
    }
    /* todo p que tenha a classe coordenadores, que seja filho direto de um section, que seja descendente de um article, que seja filho direto de um main */
    main > article section > p.coordenadores {
      font-weight: bold;
    }
  </style>
…
```

Resultado:

![Página com o texto dos coordenadores em negrito, centralizado, dentro de uma caixa cinza com borda](img/p037-1.webp)

*O texto dos coordenadores fica em negrito.*

### Resumo dos símbolos

A tabela a seguir mostra um breve resumo do significado dos símbolos que podemos utilizar para especificar seletores CSS.

| Símbolo | Significado | Exemplo | Funcionamento |
| --- | --- | --- | --- |
| espaço em branco | Seletor descendente, para filhos, "subfilhos", "subsubfilhos" etc. | `article .destaque` | Seleciona todos os elementos que tenham `destaque` como classe e que sejam descendentes de um `article`. |
| vírgula | Agrupamento. Funciona como um "ou" lógico. | `.destaque, .promocao` | Seleciona todos os elementos que tenham `destaque` ou `promocao` como classe. |
| `>` | Seletor de filhos diretos | `.principal > section` | Seleciona todos os elementos do tipo `section` que sejam filhos diretos de um elemento que tenha `principal` como classe. |

## O efeito em cascata do CSS
Duration: 12:00

Uma pergunta natural a ser feita é a seguinte: caso existam duas regras conflitantes (uma delas troca a cor da fonte para azul e a outra para vermelho, por exemplo) operando sobre o mesmo elemento, qual delas prevalece?

Para estudar esse tópico, crie um arquivo chamado `cascata_especificidade.html`. Veja seu conteúdo inicial:

**cascata_especificidade.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Cascata e especificidade</title>
</head>
<body>

</body>
</html>
```

Também precisaremos de um arquivo para abrigar regras CSS. Ele pode se chamar `cascata_especificidade.css` e ser criado na pasta `css` do projeto. Veja:

![Explorer do VS Code com o arquivo cascata_especificidade.css dentro da pasta css e cascata_especificidade.html na raiz, ambos destacados](img/p039-1.webp)

*Estrutura do projeto com os novos arquivos.*

Não deixe de importar o arquivo CSS no arquivo HTML:

**cascata_especificidade.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="css/cascata_especificidade.css">
  <title>Cascata e especificidade</title>
</head>
<body>

</body>
</html>
```

### Regra no arquivo .css

Considere a existência de um elemento `p` cuja cor alteramos escrevendo uma regra no arquivo CSS:

**css/cascata_especificidade.css**

```css
p {
  color: red;
}
```

Digamos que ele seja definido da seguinte forma no arquivo HTML:

**cascata_especificidade.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="css/cascata_especificidade.css">
  <title>Cascata e especificidade</title>
</head>
<body>
  <p>Um parágrafo</p>
</body>
</html>
```

Neste momento, claro, o texto "Um parágrafo" deve estar **vermelho**.

### Regras conflitantes no arquivo .css e no elemento style (o elemento style prevalece?)

A seguir, suponha que definamos uma regra CSS que altera a cor de todos os `p`'s para azul, utilizando o elemento `style` do arquivo HTML:

**cascata_especificidade.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="css/cascata_especificidade.css">
  <title>Cascata e especificidade</title>
  <style>
    p {
      color: blue;
    }
  </style>
</head>
<body>
  <p>Um parágrafo</p>
</body>
</html>
```

Observe que agora o texto ficou **azul**.

### Alterando a ordem dos elementos link e style

O que o exemplo anterior sugere é que regras CSS definidas no elemento `style` prevalecem sobre regras definidas em arquivos externos. Entretanto, façamos o seguinte teste: definamos o elemento `style` **antes** de fazer a importação do arquivo externo usando o elemento `link`. Veja:

**cascata_especificidade.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <style>
    p {
      color: blue;
    }
  </style>
  <link rel="stylesheet" href="css/cascata_especificidade.css">
  <title>Cascata e especificidade</title>
</head>
<body>
  <p>Um parágrafo</p>
</body>
</html>
```

O texto fica **vermelho**. Isso ilustra parte do **efeito cascata** do CSS: prevalece a regra definida por "último", considerando que o processamento do código se dá sempre **de cima para baixo**.

### Regras conflitantes com CSS inline

Agora, atribuamos a cor verde ao elemento `p` utilizando CSS inline:

**cascata_especificidade.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="css/cascata_especificidade.css">
  <title>Cascata e especificidade</title>
  <style>
    p {
      color: blue;
    }
  </style>
</head>
<body>
  <p style="color: green;">Um parágrafo</p>
</body>
</html>
```

Observe que o texto fica **verde**. Isso quer dizer que regras definidas por meio de CSS inline prevalecem sobre regras definidas por meio do elemento `style`.

Não faz muito sentido, mas podemos especificar uma segunda cor como CSS inline:

**cascata_especificidade.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="css/cascata_especificidade.css">
  <title>Cascata e especificidade</title>
  <style>
    p {
      color: blue;
    }
  </style>
</head>
<body>
  <p style="color: green; color: yellow">Um parágrafo</p>
</body>
</html>
```

Observe como o texto ficou **amarelo**. Assim, caso tenhamos duas regras conflitantes definidas por meio de CSS inline, a que prevalece é a **última**.

### Regras conflitantes no mesmo elemento style

Uma próxima pergunta a ser respondida é a seguinte: o que ocorre se tivermos duas regras conflitantes definidas no elemento `style`? Claro, para que o teste faça sentido, precisamos remover o CSS inline; caso contrário, ele prevalecerá:

**cascata_especificidade.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="css/cascata_especificidade.css">
  <title>Cascata e especificidade</title>
  <style>
    /* duas regras conflitantes */
    p {
      color: blue;
    }
    p {
      color: red;
    }
  </style>
</head>
<body>
  <!-- removemos o css inline -->
  <p>Um parágrafo</p>
</body>
</html>
```

Neste caso, o texto fica **vermelho**. Ou seja, caso tenhamos regras CSS conflitantes definidas no elemento `style`, a que prevalece é aquela que aparece por último (mais ou menos, ainda precisamos falar sobre especificidade).

### Regras conflitantes no arquivo .css

O mesmo vale para regras conflitantes definidas no arquivo `.css`: a que prevalece é a que aparece por último. No arquivo HTML, removemos as regras do elemento `style` para que as regras do arquivo tenham chance de causar efeito na página:

**cascata_especificidade.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="css/cascata_especificidade.css">
  <title>Cascata e especificidade</title>
  <style>
    /* removemos as regras, assim aquelas definidas no arquivo externo têm alguma chance */
  </style>
</head>
<body>
  <!-- removemos o css inline -->
  <p>Um parágrafo</p>
</body>
</html>
```

No arquivo CSS, escrevemos duas regras conflitantes:

**css/cascata_especificidade.css**

```css
p {
  color: red;
}
p {
  color: yellow;
}
```

Observe que o texto fica **amarelo**. Assim, estamos diante do **efeito em cascata do CSS**.

## O modificador !important
Duration: 5:00

O modificador `!important` permite que o efeito em cascata do CSS seja cancelado. Para testá-lo, aplique uma cor via CSS inline mais uma vez ao elemento `p`:

**cascata_especificidade.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="css/cascata_especificidade.css">
  <title>Cascata e especificidade</title>
  <style>
    /* removemos as regras, assim aquelas definidas no arquivo externo têm alguma chance */
  </style>
</head>
<body>
  <!-- removemos o css inline -->
  <p style="color: blue">Um parágrafo</p>
</body>
</html>
```

Apague todo o conteúdo do arquivo CSS e escreva somente uma regra:

**css/cascata_especificidade.css**

```css
p {
  color: red;
}
```

São duas regras conflitantes e, pelo efeito em cascata do CSS, a que prevalece é aquela definida com CSS inline. O texto fica **azul**.

Mas disso já sabíamos. Ocorre que esta seção é sobre o modificador `!important`. Aplique-o da seguinte forma à regra CSS definida no arquivo CSS:

**css/cascata_especificidade.css**

```css
p {
  color: red !important;
}
```

O texto fica **vermelho**. Assim,

* caso tenhamos diversas regras conflitantes, prevalece aquela definida pelo efeito em cascata do CSS.
* além disso, o modificador `!important` cancela o efeito em cascata e, caso aplicado, passa a valer a regra a que ele foi aplicado.
* caso o modificador `!important` seja aplicado a duas ou mais regras conflitantes, volta a valer o efeito cascata considerando apenas aquelas regras marcadas com `!important`.

<aside class="negative">

**Nota.** O uso do modificador `!important` tende a tornar o processamento do CSS menos intuitivo. É recomendado evitar o seu uso.

</aside>

## O algoritmo de especificidade
Duration: 10:00

Além do efeito em cascata do CSS que estudamos, há um algoritmo chamado **algoritmo de especificidade**, aplicado pelos navegadores para decidir, entre uma coleção de regras conflitantes, qual delas prevalece. Ele funciona da seguinte forma:

* para cada seletor, um peso é calculado
* o peso de um seletor é um valor de três colunas baseado em categorias
* as categorias são: id, classe e tipo
* para cada categoria existente no seletor, o algoritmo faz a seguinte soma:
  * se a categoria for **id**, adicione `1-0-0` ao peso do seletor
  * se a categoria for **classe**, adicione `0-1-0` ao peso do seletor
  * se a categoria for **tipo**, adicione `0-0-1` ao peso do seletor

Passemos aos nossos testes. Ajuste o conteúdo do arquivo `cascata_especificidade.html` da seguinte forma:

**cascata_especificidade.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="css/cascata_especificidade.css">
  <title>Cascata e especificidade</title>
  <style>

  </style>
</head>
<body>
  <main>
    <article>
      <p id="titulo" class="descricao">Algoritmo de especificidade do CSS</p>
    </article>
  </main>
</body>
</html>
```

A seguir, faça a especificação das seguintes regras CSS, na ordem em que aparecem. Vamos utilizar apenas o arquivo HTML neste exemplo. Certifique-se de remover todas as regras definidas no arquivo CSS, elas podem atrapalhar agora.

**cascata_especificidade.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="css/cascata_especificidade.css">
  <title>Cascata e especificidade</title>
  <style>
    /* especificidade: 1-0-0 */
    /* dá para pensar que é uma centena de pontos */
    #titulo {
      color: blue;
    }
    /* especificidade: 0-1-0 */
    /* dá para pensar que é uma dezena de pontos */
    .descricao {
      color: green;
    }
    /* especificidade: 0-0-1 */
    /* dá para pensar que é um único ponto */
    p {
      color: red;
    }
  </style>
</head>
<body>
  <main>
    <article>
      <p id="titulo" class="descricao">Algoritmo de especificidade do CSS</p>
    </article>
  </main>
</body>
</html>
```

O texto fica **azul**. Faça alguns testes alterando a ordem dos seletores. Observe que o texto permanece azul. Isso acontece pois o seletor por id tem maior especificidade: ele é **mais específico**.

A seguir, faça os seguintes ajustes no HTML:

**cascata_especificidade.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="css/cascata_especificidade.css">
  <title>Cascata e especificidade</title>
  <style>
    /* especificidade: 0-1-1 */
    /* 11 pontos */
    .principal article {
      background-color: lightblue;
    }
    /* especificidade: 0-0-2 */
    /* 2 pontos */
    main article {
      background-color: beige;
    }
  </style>
</head>
<body>
  <main class="principal">
    <article>
      <p id="titulo" class="descricao">Algoritmo de especificidade do CSS</p>
    </article>
  </main>
</body>
</html>
```

O fundo fica **azul** (`lightblue`). A regra que prevaleceu foi aquela que envolve uma classe e um tipo (11 pontos). A outra envolve dois tipos (2 pontos) e tem menor especificidade.

<aside class="positive">

**Dica.** Pause o mouse em cima de um seletor e veja a sua especificidade exibida pelo VS Code. Exemplo:

</aside>

![VS Code exibindo, ao pausar o mouse sobre o seletor main article, a dica Selector Specificity: (0, 0, 2)](img/p051-1.webp)

*O VS Code mostra a especificidade do seletor main article: (0, 0, 2).*

Observe que, quando utilizamos o operador vírgula, temos dois seletores, cada qual com a sua especificidade:

**cascata_especificidade.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="css/cascata_especificidade.css">
  <title>Cascata e especificidade</title>
  <style>
    /* main é um seletor e article é outro. main tem especificidade 1 (pois tem só um tipo) e article tem especificidade 1 (pois também tem somente um tipo) */
    main, article {
      border: 1px solid black;
    }
  </style>
</head>
<body>
  <main class="principal">
    <article>
      <p id="titulo" class="descricao">Algoritmo de especificidade do CSS</p>
    </article>
  </main>
</body>
</html>
```

## Cores
Duration: 10:00

Há diferentes formas de especificar cores em CSS. Nesta seção estudaremos algumas delas. O código HTML a ser usado de exemplo é o seguinte. Crie um arquivo chamado `exemplo_cores.html` para abrigá-lo.

**exemplo_cores.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Testando cores</title>
  <style>
    p {
      padding: 12px;
    }
  </style>
</head>
<body>
  <article id="cursos">
    <p class="engenharia">Engenharia de Computação</p>
    <p class="farmacia">Farmácia</p>
    <p class="biologia">Biologia</p>
    <p class="matematica">Matemática</p>
  </article>
</body>
</html>
```

### Nomes de cores pré-definidos

Como já vimos, uma das formas de especificar cores é por meio de **nomes pré-definidos**. Eles fazem parte da especificação da linguagem CSS. Veja a seguir. Faça as definições CSS no elemento `style` do próprio arquivo HTML, para simplificar o exemplo.

**exemplo_cores.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Testando cores</title>
  <style>
    p {
      padding: 12px;
    }
    .engenharia {
      background-color: green;
      color: azure;
    }
  </style>
</head>
…
```

### RGB

Outra possibilidade é fazer a especificação da cor desejada utilizando o sistema de cores **RGB**. Utilizamos valores numéricos entre 0 e 255 (ou seja, 8 bits por cor) para especificar a "quantidade" de cor desejada para cada uma das que compõem o nome do sistema: **R**ed, **G**reen e **B**lue. Veja um exemplo:

**exemplo_cores.html**

```html
…
  <style>
    p {
      padding: 12px;
    }
    .engenharia {
      background-color: green;
      color: azure;
    }
    .farmacia {
      /* cuidado para não colocar um espaço em branco entre rgb e o símbolo (, não funciona */
      color: rgb(255, 0, 0);
      /* observe que valores iguais para as três cores sempre resultam num tom de cinza. Quanto mais próximo de 0, mais próximo de preto. Quanto mais próximo de 255, mais próximo de branco. */
      background-color: rgb(240, 240, 240);
    }
  </style>
…
```

### Cores RGB por meio de números na base hexadecimal

Também é possível especificar cores usando o sistema de cores RGB sem utilizar a função `rgb`. Isso é feito por meio do uso de números na base hexadecimal. A notação envolvida inclui o símbolo `#`. Observe um exemplo:

**exemplo_cores.html**

```html
…
  <style>
    p {
      padding: 12px;
    }
    .engenharia {
      background-color: green;
      color: azure;
    }
    .farmacia {
      /* cuidado para não colocar um espaço em branco entre rgb e o símbolo (, não funciona */
      color: rgb(255, 0, 0);
      /* observe que valores iguais para as três cores sempre resultam num tom de cinza. Quanto mais próximo de 0, mais próximo de preto. Quanto mais próximo de 255, mais próximo de branco. */
      background-color: rgb(240, 240, 240);
    }
    .biologia {
      color: #057805;
      background-color: #00FF00;
    }
  </style>
…
```

<aside class="positive">

**Dica.** Busque por "hex color" na omnibox (a barra de busca) do Google Chrome para encontrar a ferramenta a seguir.

</aside>

![Resultado de busca do Google por hex color, exibindo a ferramenta Color picker com o seletor de cor e os códigos HEX, RGB, CMYK, HSV e HSL](img/p055-1.webp)

*O seletor de cores do Google.*

Observe que ela permite que você faça a escolha das cores visualmente e lhe entrega os códigos hexadecimais referentes a elas.

### Um atalho para a notação hexadecimal

No exemplo anterior, utilizamos 2 caracteres em base hexadecimal (de 0 a F) para representar cada uma das cores do sistema RGB. Também é possível fazer a especificação usando um único caractere por cor. Quando isso é feito, entende-se que o segundo caractere de cada cor é igual ao primeiro. Veja:

**exemplo_cores.html**

```html
…
  <style>
    p {
      padding: 12px;
    }
    .engenharia {
      background-color: green;
      color: azure;
    }
    .farmacia {
      /* cuidado para não colocar um espaço em branco entre rgb e o símbolo (, não funciona */
      color: rgb(255, 0, 0);
      /* observe que valores iguais para as três cores sempre resultam num tom de cinza. Quanto mais próximo de 0, mais próximo de preto. Quanto mais próximo de 255, mais próximo de branco. */
      background-color: rgb(240, 240, 240);
    }
    .biologia {
      color: #057805;
      background-color: #00FF00;
    }
    .matematica {
      background-color: #CCC;
      color: #000;
    }
  </style>
…
```

## Formatação de texto e famílias de fontes
Duration: 10:00

Nesta seção, passamos a estudar a formatação de texto com CSS. Para isso, crie um novo arquivo chamado `exemplo_texto.html`. Seu conteúdo inicial é o seguinte:

**exemplo_texto.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Formatando texto</title>
  <style>

  </style>
</head>
<body>
  <main>
    <article id="cursos">
      <p class="engenharia">Engenharia de Computação</p>
      <p class="farmacia">Farmácia</p>
    </article>
  </main>
</body>
</html>
```

Começamos alterando a sua cor (como já vimos), a fonte usada e o tamanho dela:

**exemplo_texto.html**

```html
…
  <style>
    .engenharia {
      color: #0000FF;
      font-family: 'Courier New';
      font-size: 20px;
    }
  </style>
…
```

Note que, para a fonte, especificamos uma "família" de fontes. Neste caso, o navegador irá utilizar a primeira, da esquerda para a direita, que estiver disponível no computador. Veja mais um exemplo:

**exemplo_texto.html**

```html
…
  <style>
    .engenharia {
      color: #0000FF;
      font-family: 'Courier New', Courier, monospace
    }
  </style>
…
```

### Fontes padrão do navegador e serifas

A fonte sendo exibida depende do navegador e do sistema operacional sendo utilizados. Cada navegador pode especificar as suas próprias fontes padrão, e cada sistema operacional pode ter seu próprio conjunto de fontes instalado. No Google Chrome, você pode verificar as suas fontes padrão clicando nos três pontinhos no canto superior direito e então em **Configurações >> Aparência >> Personalizar Fontes**. Veja:

![Tela Customize fonts das configurações do Chrome, com os campos Standard font, Serif font, Sans-serif font e Fixed-width font](img/p059-1.webp)

*Fontes padrão configuradas no Google Chrome.*

Observe que o navegador define:

* Uma fonte padrão
* Uma fonte com serifa
* Uma fonte sem serifa
* Uma fonte de largura fixa

<aside class="positive">

**Nota.** Serifas são os traços que ocorrem no fim das hastes das letras. A figura a seguir destaca as serifas da letra T usando a fonte **Times New Roman**, que é uma fonte que tem serifa.

</aside>

![Letra T na fonte Times New Roman com as serifas nas pontas das hastes destacadas em vermelho](img/serifa.webp)

*Letra T com serifas (Times New Roman).*

A figura a seguir mostra a letra T usando a fonte **Helvetica**, que é uma fonte sem serifa.

![Letra T na fonte Helvetica, sem traços nas pontas das hastes](img/sem-serifa.webp)

*Letra T sem serifas (Helvetica).*

Temos algumas opções para especificar a fonte a ser utilizada pelo navegador:

* `sans-serif`: instruímos o navegador a usar a sua fonte sem serifa padrão
* `serif`: instruímos o navegador a usar a sua fonte com serifa padrão
* `monospace`: instruímos o navegador a usar a sua fonte de largura fixa padrão
* nome: especificamos o nome da fonte que o navegador deve utilizar

Faça, um a um, os testes exibidos a seguir. Observe como especificamos uma "família de fontes". A primeira fonte especificada será utilizada caso esteja disponível no sistema operacional. Caso contrário, a segunda será utilizada. E assim por diante. Por isso é importante usar as palavras `sans-serif`, `serif` ou `monospace` como última opção. Se desejamos uma fonte sem serifa, especificamos a família desejada e, se nenhuma estiver disponível, a especificação `sans-serif` instrui o navegador a usar a fonte padrão. E assim por diante.

**exemplo_texto.html · teste 1**

```html
…
  <style>
    .engenharia {
      color: #0000FF;
      /* família de fontes com serifa */
      font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif
    }
  </style>
…
```

**exemplo_texto.html · teste 2**

```html
…
  <style>
    .engenharia {
      color: #0000FF;
      /* família de fontes sem serifa */
      font-family: Arial, Helvetica, sans-serif
    }
  </style>
…
```

**exemplo_texto.html · teste 3**

```html
…
  <style>
    .engenharia {
      color: #0000FF;
      /* família de fontes de largura fixa */
      font-family: 'Courier New', Courier, monospace
    }
  </style>
…
```

## Fontes Google
Duration: 10:00

Podemos também fazer uso de fontes que não se encontram instaladas no sistema operacional em uso. Isso pode ser feito, por exemplo, utilizando-se as fontes Google. Para tal, comece visitando o link a seguir:

[https://fonts.google.com/](https://fonts.google.com/)

Escolha uma das fontes disponíveis. Neste exemplo, escolhemos a fonte chamada **Comforter**. Caso ela não esteja aparecendo na tela inicial, basta buscar pelo seu nome:

![Google Fonts com a busca por comforter e o cartão da fonte Comforter destacado nos resultados](img/p061-1.webp)

*Buscando a fonte Comforter no Google Fonts.*

Depois de encontrá-la, clique sobre o cartão que exibe seu nome e uma amostra. Role a tela para baixo até encontrar a opção **Regular 400**. Observe que ela tem um sinal de **+** do lado:

![Página da fonte Comforter com a seção Styles e o botão de seleção do estilo Regular 400 destacado](img/p062-1.webp)

*Selecionando o estilo Regular 400.*

A seguir, deve ser possível clicar no botão de fontes selecionadas no canto superior direito da tela. Veja:

![Barra superior do Google Fonts com o botão de famílias selecionadas destacado no canto direito](img/p062-2.webp)

*Botão de fontes selecionadas.*

Para usar a fonte, basta manter a opção **link** selecionada e copiar o código que aparece abaixo dela:

![Painel Selected family com a opção link marcada e o trecho de código com os elementos link destacado](img/p063-1.webp)

*Código para incorporar a fonte à página.*

O código que você copiou precisa ser colado na seção `head` do seu documento HTML. A seguir, basta associar a família de fontes à propriedade do elemento desejado:

**exemplo_texto.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Comforter&display=swap" rel="stylesheet">
  <title>Formatando texto</title>
  <style>
    .engenharia {
      color: #0000FF;
      /* família de fontes de largura fixa*/
      font-family: 'Comforter', cursive;
    }
  </style>
</head>
<body>
  <main>
    <article id="cursos">
      <p class="engenharia">Engenharia de Computação</p>
      <p class="farmacia">Farmácia</p>
    </article>
  </main>
</body>
</html>
```

<aside class="positive">

**Nota.** `cursive` é uma palavra genérica que estamos utilizando para instruir o navegador a utilizar uma fonte "manuscrita", em que as letras são ligadas umas às outras, caso a fonte Comforter não seja encontrada.

</aside>

Veja o resultado esperado:

![Texto Engenharia de Computação em azul com a fonte manuscrita Comforter e Farmácia na fonte padrão](img/p065-1.webp)

*Engenharia de Computação exibida com a fonte Comforter.*

## Propriedades de fonte e text-decoration
Duration: 7:00

Há diversas propriedades relativas à fonte a ser utilizada. Veja:

**exemplo_texto.html**

```html
…
  <style>
    .engenharia {
      color: #0000FF;
      /* família de fontes de largura fixa*/
      font-family: 'Comforter', cursive;
    }
    .farmacia {
      /* família de fontes */
      font-family: Arial, Helvetica, sans-serif;
      /* tamanho */
      font-size: 20px;
      /* itálico */
      font-style: italic;
      /* negrito */
      font-weight: bold;
    }
  </style>
…
```

Veja o resultado esperado:

![Engenharia de Computação na fonte Comforter e Farmácia em Arial, itálico e negrito](img/p066-1.webp)

*Farmácia em itálico e negrito.*

### O atalho font

Há um atalho para especificar todas as propriedades referentes à fonte de uma única vez:

**exemplo_texto.html**

```html
…
    .engenharia {
      color: #0000FF;
      /* família de fontes de largura fixa*/
      font-family: 'Comforter', cursive;
    }
    .farmacia {
      font: italic bold 20px Arial, Helvetica, sans-serif;
    }
…
```

<aside class="positive">

**Dica.** Verifique a documentação da propriedade `font` para entender a ordem em que os valores devem ser especificados. Se você pausar o mouse em cima da palavra `font` no VS Code, ele também mostrará as regras. Veja:

</aside>

![Dica do VS Code sobre a propriedade font, com a sintaxe font-style, font-variant, font-weight, font-stretch, font-size, line-height e font-family destacada](img/p066-2.webp)

*O VS Code exibe a sintaxe da propriedade font.*

### text-decoration: sublinhando, riscando etc.

Podemos riscar ou sublinhar (entre muitas outras coisas) o texto com a propriedade `text-decoration`:

**exemplo_texto.html**

```html
…
  <style>
    .engenharia {
      color: #0000FF;
      /* família de fontes de largura fixa*/
      font-family: 'Comforter', cursive;
    }
    .farmacia {
      font: italic bold 20px Arial, Helvetica, sans-serif;
      /* teste outros valores */
      text-decoration: line-through;
    }
  </style>
…
```

## Chrome DevTools
Duration: 6:00

No Google Chrome, aperte **CTRL + Shift + I** para abrir o Chrome DevTools ([https://developers.google.com/web/tools/chrome-devtools](https://developers.google.com/web/tools/chrome-devtools)). Ele permite inspecionar nossos elementos e mesmo alterar algumas de suas propriedades. Veja a seguir. Vá até a aba **Elements** e então escolha a aba **Styles**.

![Página com Farmácia riscado e o Chrome DevTools aberto na parte de baixo, com as abas Elements e Styles destacadas](img/p068-1.webp)

*Abas Elements e Styles do Chrome DevTools.*

<aside class="positive">

**Nota.** O Chrome DevTools pode ser posicionado de qualquer lado da tela, abaixo da tela ou, ainda, separado dela. Para fazer a sua escolha, basta clicar nos três pontinhos no canto superior direito e usar uma das opções de **Dock side**:

</aside>

![Menu de três pontinhos do DevTools aberto, com as opções de Dock side destacadas](img/p069-1.webp)

*Opções de posicionamento (Dock side) do DevTools.*

Usando o Chrome DevTools, estando em **Elements** e **Styles**, selecione um dos elementos `p`. A seguir, clique no nome da fonte que está atribuída a ele e troque para algo como `Arial`. Veja:

![DevTools com o parágrafo engenharia selecionado e a font-family alterada para Arial no painel Styles; na página, Engenharia de Computação aparece em Arial](img/p069-2.webp)

*Alterando a fonte diretamente no DevTools: a mudança aparece na hora, mas não é salva no arquivo.*

## Encerramento
Duration: 3:00

Parabéns! Você deu os primeiros passos com CSS.

### O que você viu

* CSS inline, o elemento `style` e arquivos externos importados com `link`
* Herança de propriedades como `color`
* Seletores por tipo, id e classe, múltiplas classes e combinações
* Agrupamento com vírgula, seletores descendentes (espaço) e de filhos diretos (`>`)
* O efeito em cascata, o modificador `!important` e o algoritmo de especificidade
* Cores com nomes, `rgb` e hexadecimal
* Famílias de fontes, serifas, Google Fonts, o atalho `font` e `text-decoration`
* Inspeção e edição de estilos com o Chrome DevTools

### Referências

* Especificações de CSS: [https://www.w3.org/Style/CSS/specs.en.html](https://www.w3.org/Style/CSS/specs.en.html)
* Suporte a CSS nos navegadores: [https://en.wikipedia.org/wiki/Comparison_of_browser_engines_(CSS_support)](https://en.wikipedia.org/wiki/Comparison_of_browser_engines_(CSS_support))
* Ferramentas para CSS: [https://www.w3.org/Style/CSS/software#editors](https://www.w3.org/Style/CSS/software#editors)
* Elemento `link` (MDN): [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)
* Google Fonts: [https://fonts.google.com/](https://fonts.google.com/)
* Chrome DevTools: [https://developers.google.com/web/tools/chrome-devtools](https://developers.google.com/web/tools/chrome-devtools)
