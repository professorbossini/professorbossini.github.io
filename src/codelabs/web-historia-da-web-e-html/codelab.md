summary: Conheça a origem da World Wide Web, os navegadores que marcaram sua história e a evolução das versões da linguagem HTML, do HTML Tags de 1991 ao HTML5.
id: web-historia-da-web-e-html
categories: HTML e CSS
tags: html,www,historia,navegadores,xhtml,html5,w3c,whatwg
status: Published
authors: Rodrigo Bossini
last updated: 2023-02-09
pdf: tti107_ads2001/01_apostila_html_www_historico.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# World Wide Web: histórico e versões do HTML

## Visão geral
Duration: 3:00

Neste material estudaremos sobre a World Wide Web, alguns navegadores históricos e sobre as versões da linguagem HTML.

### O que você vai aprender

* A diferença entre World Wide Web, internet e Internet
* Por que HTML não é uma linguagem de programação
* Os marcos da história da Web: Gopher, o primeiro sítio e os primeiros navegadores gráficos
* A história dos navegadores Erwise, ViolaWWW, Mosaic, Netscape, Internet Explorer, Mozilla Firefox e Google Chrome
* Quem mantém a especificação HTML (WHATWG e W3C)
* As versões do HTML: HTML Tags, HTML 2, HTML 3, HTML 4, XHTML e HTML5

### O que você vai precisar

* Um navegador para visitar os links históricos indicados ao longo do texto

## A World Wide Web e o HTML
Duration: 5:00

O cientista da computação inglês **Tim Berners-Lee** é reconhecido como criador da linguagem HTML e também da própria World Wide Web.

<aside class="positive">

**Nota.** Observe que **World Wide Web e Internet não são sinônimos**. A World Wide Web é uma coleção de recursos (originalmente documentos HTML, mas hoje outros tipos como áudio e vídeo estão incluídos) ligados uns aos outros (daí a ideia de Web (teia)) por meio de hiperlinks. A Internet, por outro lado, é um tipo de internet: há inúmeras internets (com i minúsculo) pelo mundo. Duas ou mais redes interconectadas formam uma internet. Por exemplo, a rede administrativa e a rede acadêmica de uma instituição de ensino, se estiverem interconectadas, formam uma internet. Por outro lado, Internet (um nome próprio, com letra maiúscula) é o nome associado à rede global por meio da qual as pessoas se comunicam.

</aside>

<aside class="negative">

**Nota.** **HTML não é uma linguagem de programação**. Uma linguagem de programação possui, em geral, construções (como estruturas de seleção, estruturas de repetição, funções etc.) que nos permitem expressar algoritmos (sequências de instruções a serem executadas por computadores).

</aside>

### 1989: Criação da World Wide Web

A WWW foi criada em 1989. Seu criador, Tim Berners-Lee, foi também responsável por implementar o primeiro servidor Web e o primeiro navegador.

### 1991: Protocolo Gopher

O protocolo Gopher foi criado em 1991 na Universidade de Minnesota. Ele permite acessar documentos on-line apresentando-os textualmente. A navegação assemelha-se a um simples sistema de arquivos. Veja este link sobre ele:

[https://minitex.umn.edu/news/2022-05/gopher-project-early-internet-and-u-m-libraries](https://minitex.umn.edu/news/2022-05/gopher-project-early-internet-and-u-m-libraries)

![Terminal exibindo o menu textual do The Gopher Project, com itens numerados como A Brief Introduction to Gopherspace e Using Gopher](img/gopher.webp)

*Navegação textual na rede Gopher.*

Até hoje ainda é possível navegar na rede gopher. Veja um cliente para o Windows:

[https://apps.microsoft.com/store/detail/simple-gopher-client/9P5J5GGQ2FG2?hl=en-us&gl=US](https://apps.microsoft.com/store/detail/simple-gopher-client/9P5J5GGQ2FG2?hl=en-us&gl=US)

Para distros Linux, em geral, é possível encontrar um cliente chamado gopher na coleção de pacotes padrão.

### 1991: Primeiro sítio

Em 1991, o primeiro website (sítio) foi publicado. Ele ainda pode ser acessado, veja:

[http://info.cern.ch/hypertext/WWW/TheProject.html](http://info.cern.ch/hypertext/WWW/TheProject.html)

## Os navegadores históricos
Duration: 8:00

### 1992: Primeiro navegador com recursos gráficos: Erwise

Há um consenso de que o primeiro navegador com interface gráfica foi o **Erwise**. Ele foi escrito em C, nasceu em 1992 e a sua última versão foi disponibilizada em 1994. Veja:

![Janela azul do navegador Erwise com uma página em finlandês e a caixa de diálogo Info mostrando WorldWideWeb browser for the X Window System, Version 0.1 Alpha](img/erwise.webp)

*O navegador Erwise.*

### 1992: Primeiro navegador com suporte a linguagens de script e folhas de estilos: ViolaWWW

**ViolaWWW** é o nome de um navegador cuja primeira versão foi liberada em 1992. Há um consenso de que ele foi o primeiro a oferecer suporte a linguagens de script e folhas de estilos. Ele ainda possui uma página com recursos históricos, veja:

[http://viola.org/](http://viola.org/)

Veja também com o que ele se parecia:

![Cinco capturas do ViolaWWW lado a lado, rotuladas Image, Applet, Tables, Stylesheet e Frames](img/violawww.webp)

*Recursos do ViolaWWW: imagens, applets, tabelas, folhas de estilos e frames.*

### 1993: Navegador Mosaic

Muitas vezes, o navegador **Mosaic** é descrito como o primeiro navegador com suporte a interfaces gráficas o que, como vimos, não é verdade. Entretanto, foi um navegador muito importante e bastante utilizado entre 1993 e 1997, com suporte aos protocolos HTTP, FTP, Gopher e outros. Ele possui uma página oficial:

[http://www.ncsa.illinois.edu/research/project-highlights/ncsa-mosaic/](http://www.ncsa.illinois.edu/research/project-highlights/ncsa-mosaic/)

Seu código-fonte está disponível em um repositório do Github:

[https://github.com/alandipert/ncsa-mosaic](https://github.com/alandipert/ncsa-mosaic)

Veja com o que ele se parece:

![Janela do NCSA Mosaic exibindo a página Hypertext and WWW information do CERN, com barra de ferramentas e campo de URL](img/mosaic.webp)

*O navegador NCSA Mosaic.*

### 1994: Netscape

Em 1994 a Netscape Communications Corporation desenvolveu o navegador **Netscape**, tendo como desenvolvedores muitos dos responsáveis pelo Mosaic. Rapidamente ele se tornou o mais utilizado na época. Veja com o que ele se parece:

![Janela do Netscape Navigator exibindo o Netscape Handbook, com botões Back, Forward, Home e campo Location](img/netscape.webp)

*O navegador Netscape.*

Uma das grandes inovações implementadas pelo Netscape foi o carregamento de página feito "**on-the-fly**", ou seja, o navegador se encarregava de fazer o download dos conteúdos da página e apresentá-los ao usuário simultaneamente, conforme se tornavam disponíveis.

<aside class="positive">

**Nota.** Em 1995 a linguagem Javascript foi criada por **Brendan Eich**, enquanto era funcionário da Netscape.

</aside>

### 1995: Internet Explorer

A primeira versão do **Internet Explorer** foi lançada em 1995. Nesta época, em torno de 90% das pessoas utilizavam o Netscape. Após 2 anos, e após a Microsoft lançar uma versão do IE já acoplada ao sistema operacional Windows, o IE passou a ser utilizado por 90% dos usuários no mundo todo. Nesta época, houve a conhecida "**guerra de navegadores**", época em que a Netscape processou a Microsoft por "impor" o uso do IE. A Netscape teve ganho de causa, mas isso não foi suficiente para tornar o Netscape popular novamente.

### 1999: Mozilla

Em 1999, a Netscape foi vendida para a AOL e os programadores, à essa época, criaram a fundação **Mozilla** e implementaram o navegador Mozilla Firefox, um dos mais utilizados até hoje.

### 2008: Google Chrome

Em 2008, a Google lança o **Google Chrome**, que também teve grande adoção. Hoje, o Google Chrome parece ter mais de 60% dos usuários. Veja:

![Gráfico Browser Market Share Worldwide de julho de 2021 a julho de 2022: Chrome 65,14%, Safari 18,82%, Edge 4,11%, Firefox 3,3%, Samsung Internet 2,95% e Opera 2,12%](img/market-share.webp)

*Participação de mercado dos navegadores no mundo, julho de 2022. Fonte: [https://gs.statcounter.com/browser-market-share](https://gs.statcounter.com/browser-market-share).*

## A especificação e as versões do HTML
Duration: 10:00

### Especificação HTML

A especificação HTML desenvolvida pelo **Web Hypertext Application Technology Working Group (WHATWG)** pode ser encontrada no link a seguir:

[https://html.spec.whatwg.org/](https://html.spec.whatwg.org/)

Ao longo dos anos, houve também uma especificação mantida pelo **World Wide Web Consortium (W3C)**. Entretanto, desde 2019, há um acordo entre ambos para que exista apenas uma versão da especificação. Veja:

* [https://www.w3.org/html/](https://www.w3.org/html/)
* [https://www.w3.org/blog/news/archives/7753](https://www.w3.org/blog/news/archives/7753)

A ideia é simples: em função da especificação, cada navegador fornece a sua própria implementação. Vejamos o histórico de versões.

### 1991: HTML versão 1

A primeira versão do HTML, criada em 1991, foi algo chamado de **HTML Tags**. Lembre-se que ela foi criada por Tim Berners-Lee. Veja:

[http://info.cern.ch/hypertext/WWW/MarkUp/Tags.html](http://info.cern.ch/hypertext/WWW/MarkUp/Tags.html)

### 1995: HTML 2

A segunda versão do HTML foi publicada em 1995, por meio da RFC (Request for Comment) 1866. Veja:

[https://datatracker.ietf.org/doc/html/rfc1866](https://datatracker.ietf.org/doc/html/rfc1866)

### 1997: HTML 3

A terceira versão do HTML foi publicada em janeiro de 1997. Veja:

[https://www.w3.org/MarkUp/html3/Contents.html](https://www.w3.org/MarkUp/html3/Contents.html)

Veja algumas observações sobre ela:

> HTML 3.0, as a result, includes support for customised lists; fine positioning control with entities like horizontal tabs and horizontal alignment of headers and paragraph text. Additional features include a static banner area for corporate logos, disclaimers and customized navigation/search controls.

### 1997: HTML 4

Em dezembro de 1997 foi publicada a versão 4 do HTML. Veja:

[https://www.w3.org/TR/1998/REC-html40-19980424/](https://www.w3.org/TR/1998/REC-html40-19980424/)

Veja algumas observações sobre essa versão:

> This specification defines the HyperText Markup Language (HTML), version 4.0, the publishing language of the World Wide Web. In addition to the text, multimedia, and hyperlink features of the previous versions of HTML, HTML 4.0 supports more multimedia options, scripting languages, style sheets, better printing facilities, and documents that are more accessible to users with disabilities. HTML 4.0 also takes great strides towards the internationalization of documents, with the goal of making the Web truly World Wide.

### 2000: XHTML

Em 2000, foi publicada a especificação da linguagem **XHTML**, baseada em XML. Veja:

[https://www.w3.org/TR/xhtml1/#xhtml](https://www.w3.org/TR/xhtml1/#xhtml)

Veja um exemplo de código em XHTML:

**Exemplo XHTML**

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Título</title>
</head>
<body>

  Aqui vai o conteúdo da página...

</body>
</html>
```

Algumas observações:

* A anotação `<!DOCTYPE>` é obrigatória.
* A especificação do `xmlns` é obrigatória.
* Os elementos devem sempre ser fechados.
* Os valores dos atributos devem estar sempre entre aspas.

Ou seja, trata-se de uma linguagem cuja verificação é muito mais rigorosa, o que pode ser mais trabalhoso para o desenvolvedor. Alguns detalhes simples que representam erros de sintaxe em XHTML e que fazem com que páginas não possam ser carregadas podem ser resolvidos pelo navegador sem verificações tão precisas.

### 2007: HTML5

Em 2007 a especificação de XHTML foi deixada de lado e, em 2008, a primeira versão de **HTML5** foi publicada. Veja:

[https://html.spec.whatwg.org/](https://html.spec.whatwg.org/)

Uma das premissas da especificação é associar **semântica** aos elementos que ela define, além de separar estrutura, estilos e interatividade. Veja um exemplo de código em HTML5. O mais importante é observar que cada elemento tem um nome próprio, que deixa clara a sua razão de ser, o seu significado.

**Exemplo HTML5**

```html
<!DOCTYPE html>
<html>
<head>
 <title>Exemplo HTML5</title>
</head>
<body>
 <main>
   <nav>
     <ul>
       <li>HTML5</li>
       <li>Javascript</li>
     </ul>
   </nav>
   <article>
     <header>
       <h2>Exemplo de página HTML5</h2>
     </header>
   </article>
 </main>
</body>
</html>
```

## Encerramento
Duration: 3:00

Você percorreu a história da World Wide Web, desde a sua criação por Tim Berners-Lee em 1989, passando pelo protocolo Gopher, pelo primeiro sítio e pelos navegadores Erwise, ViolaWWW, Mosaic, Netscape, Internet Explorer, Mozilla Firefox e Google Chrome, até a evolução da linguagem HTML: HTML Tags, HTML 2, HTML 3, HTML 4, XHTML e HTML5.

### Referências da apostila

* Especificação HTML (WHATWG): [https://html.spec.whatwg.org/](https://html.spec.whatwg.org/)
* HTML no W3C: [https://www.w3.org/html/](https://www.w3.org/html/)
* Primeiro sítio: [http://info.cern.ch/hypertext/WWW/TheProject.html](http://info.cern.ch/hypertext/WWW/TheProject.html)
* Participação de mercado dos navegadores: [https://gs.statcounter.com/browser-market-share](https://gs.statcounter.com/browser-market-share)

### Próximos passos

Com o contexto histórico em mãos, siga para os elementos básicos do HTML e comece a escrever suas próprias páginas.
