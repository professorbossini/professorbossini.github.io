summary: Adicione o Widget do VLibras a uma página HTML simples para que seu conteúdo possa ser traduzido para Libras.
id: web-vlibras
categories: Acessibilidade,HTML e CSS
tags: vlibras,libras,acessibilidade,widget,html,javascript
status: Published
authors: Rodrigo Bossini
last updated: 2023-11-07
pdf: tti107_ads2001/01_apostila_vlibras.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# VLibras: tradução para Libras em páginas HTML

## Visão geral
Duration: 3:00

O **VLibras** é um conjunto de ferramentas capaz de traduzir conteúdo digital, incluindo texto, áudio e vídeo, para Libras, algo notável do ponto de vista da acessibilidade. Visite a sua página oficial:

[https://www.gov.br/governodigital/pt-br/vlibras](https://www.gov.br/governodigital/pt-br/vlibras)

Neste material, veremos como utilizar o VLibras em uma página HTML simples.

### O que você vai aprender

* O que é um Widget e como o VLibras é disponibilizado por meio dele
* Como inserir o Widget do VLibras em um documento HTML
* Como usar o Widget para traduzir o conteúdo da página para Libras

### O que você vai precisar

* Um editor de texto
* Um navegador com acesso à Internet

## O Widget e a página de teste
Duration: 5:00

### Widget Javascript

Um **Widget** é geralmente apresentado como um atalho gráfico que facilita o acesso a certas funcionalidades de uma aplicação. O uso do VLibras é feito por meio da inserção de seu Widget nas páginas HTML em que desejamos utilizá-lo. Veja a documentação:

[https://vlibras.gov.br/doc/widget/installation/webpageintegration.html](https://vlibras.gov.br/doc/widget/installation/webpageintegration.html)

### Novo documento HTML

Para testar o VLibras, crie um documento HTML chamado `index.html` com o conteúdo a seguir.

**index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teste vlibras</title>
</head>
<body>
  <p>Vamos testar o Widget do VLibras</p>
  <p>Aqui vai outro teste...</p>
</body>
</html>
```

## Usando o Widget
Duration: 8:00

O uso do Widget do VLibras é feito de maneira bastante simples: apenas copiamos e colamos um trecho de código pronto e disponível em sua página oficial. Veja como fica o documento.

**index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teste vlibras</title>
</head>
<body>
  <p>Vamos testar o Widget do VLibras</p>
  <p>Aqui vai outro teste...</p>
  <div vw class="enabled">
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper>
      <div class="vw-plugin-top-wrapper"></div>
    </div>
  </div>
  <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
  <script>
    new window.VLibras.Widget('https://vlibras.gov.br/app');
  </script>
</body>
</html>
```

Pronto! Abra a página em seu navegador para ver o resultado.

![Página com os dois parágrafos de teste e o ícone azul do VLibras destacado no canto inferior direito](img/fig-2-3-1.webp)

*O ícone do VLibras aparece no canto da página.*

Clique no ícone destacado para ver o boneco do VLibras.

![Página de teste com o painel do VLibras aberto, exibindo o avatar e a mensagem Boas-vindas](img/fig-2-3-2.webp)

*O painel do VLibras aberto, com o avatar.*

Quando o Widget está aberto, ou seja, o boneco está visível, basta clicar sobre algum conteúdo para que o boneco o reproduza em Libras. Vá em frente e clique nos parágrafos da página.

![Parágrafo Vamos testar o Widget do VLibras destacado e o avatar sinalizando, com uma mensagem de erro de conexão com o serviço de tradução do VLibras em destaque](img/fig-2-3-3.webp)

*Ao clicar em um parágrafo, o avatar o reproduz em Libras.*

<aside class="negative">

Observe que uma mensagem de erro está sendo exibida ("Não foi possível estabelecer conexão com o serviço de tradução do VLibras"). Quando isso acontece, o Widget é incapaz de fazer o download de todas as imagens que representam os gestos em Libras e, neste caso, soletra cada palavra.

</aside>

Este parece ser um erro do próprio Widget, uma vez que ele acontece na própria página oficial do governo. Visite:

[https://www.gov.br/pt-br](https://www.gov.br/pt-br)

Observe o que acontece quando tentamos acionar o Widget clicando em algum texto da página.

![Portal gov.br com o texto Serviços e Informações do Brasil destacado e o avatar do VLibras exibindo a mesma mensagem de erro de conexão](img/fig-2-3-4.webp)

*O mesmo erro aparece no portal gov.br.*

## Encerramento
Duration: 3:00

De toda forma, trata-se de um excelente mecanismo de acessibilidade e é fortemente recomendável adicioná-lo às nossas páginas.

### O que você fez

* Conheceu o VLibras e o conceito de Widget
* Criou uma página HTML de teste
* Inseriu o Widget do VLibras e usou o avatar para traduzir o conteúdo da página

### Referências da apostila

* Página oficial do VLibras: [https://www.gov.br/governodigital/pt-br/vlibras](https://www.gov.br/governodigital/pt-br/vlibras)
* Integração do Widget em páginas web: [https://vlibras.gov.br/doc/widget/installation/webpageintegration.html](https://vlibras.gov.br/doc/widget/installation/webpageintegration.html)
