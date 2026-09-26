summary: Exercício de Flutter guiado por commits: construa um aplicativo de lembretes com cadastro, listagem, remoção, favoritos e filtro, publicado com tag e pull request.
id: flutter-exercicios-lembretes-favoritos
categories: Flutter,Mobile,Git
tags: flutter,exercicios,widgets,estado,lista,git,github,commits,tag
status: Published
authors: Rodrigo Bossini
last updated: 2025-09-20
pdf: dart_flutter/exercicio_flutter_lembretes_favoritos.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Exercícios: lembretes favoritos em Flutter

## Visão geral
Duration: 3:00

Este exercício é baseado no protótipo a seguir. Utilize o protótipo como inspiração. Seu aplicativo não precisa ser idêntico a ele. O importante é que ele tenha as funcionalidades descritas e que permita que sejam utilizadas facilmente, proporcionando boa experiência ao usuário.

![Protótipo desenhado à mão com um botão Apenas favoritos, a lista de lembretes Preparar aula de programação, Fazer feira e Preparar marmitas, cada um com ícones de estrela e lixeira, um campo Digite seu novo lembrete e um botão OK](img/prototipo.webp)

*Protótipo do aplicativo de lembretes.*

### O que você vai praticar

* Composição de widgets em Flutter, com um widget exclusivo para cada funcionalidade
* Atualização da tela em tempo real a partir de dados digitados pelo usuário
* Remoção, favoritos e filtro de itens de uma lista
* Um fluxo de trabalho com Git: fork, commits com mensagens padronizadas, tag e pull request

### O que você vai precisar

* O SDK do Flutter e um editor (como o VS Code)
* Git e uma conta no GitHub

## Instruções
Duration: 5:00

* O exercício pode ser feito em duplas.
* Não vale nota.
* Comece fazendo um **fork** do seguinte repositório.

[https://github.com/professorbossini/20252_maua_ecm252_exercicio_flutter_lembretes_favoritos_modelo](https://github.com/professorbossini/20252_maua_ecm252_exercicio_flutter_lembretes_favoritos_modelo)

Ele contém apenas uma aplicação Flutter padrão.

* No arquivo chamado `README.md` já existente no repositório, coloque os nomes e RAs de cada aluno.

**Mensagem do commit**

```text
docs: inclui nomes e ras
```

## Requisitos: widget principal, cadastro e lista fictícia
Duration: 20:00

### 1 Componente principal

O projeto deve ter um widget principal. Ele deve exibir o texto "Hello, Lembretes".

**Mensagem do commit**

```text
feat: cria widget principal e faz hello
```

### 2 Cadastro de novo lembrete

Deve ser possível digitar uma descrição de lembrete e clicar em um botão para cadastrá-lo. Essa funcionalidade deve ser implementada por um widget exclusivo para este fim. O Widget deve ser filho do principal, substituindo o texto "Hello, lembretes".

**Mensagem do commit**

```text
feat: cria widget de entrada
```

### 3 Exibição de lembretes fictícios

Deve ser possível visualizar uma lista de lembretes fictícios (ou seja, chumbados no código, nada que o usuário tenha digitado em tempo de requisição). A lista de lembretes chumbada, nesta versão, deve ser a mesma que o protótipo mostra. Essa funcionalidade deve ser implementada por um widget exclusivo para este fim. O widget deve ser filho do principal.

**Mensagem do commit**

```text
feat: exibe lista ficticia
```

## Requisitos: lista real, remoção, favoritos e filtro
Duration: 30:00

### 4 Exibição de lembretes informados pelo usuário

Deve ser possível visualizar os lembretes digitados pelo usuário. A lista é atualizada em tempo real, sempre que o usuário digita um lembrete novo. Nesta versão, a lista de lembretes fictícios não é mais exibida.

**Mensagem do commit**

```text
feat: exibe lista real
```

### 5 Remoção de lembretes

Deve ser possível remover lembretes. Cada um exibe um ícone que, quando clicado, causa a sua remoção.

**Mensagem do commit**

```text
feat: remove lembretes
```

### 6 Favoritar lembretes

Deve ser possível favoritar lembretes. Cada um exibe um ícone que viabiliza isso. Quando clicado, o ícone muda, mostrando que aquele é um lembrete favorito. Quando clicado novamente, o ícone volta ao normal, mostrando que ele não é mais favorito.

**Mensagem do commit**

```text
feat: favorita lembretes
```

### 7 Filtro de lembretes

Deve ser possível filtrar lembretes. Há duas opções: exibir todos eles ou exibir apenas os favoritos. A aplicação deve oferecer um mecanismo visual para que o usuário escolha o que deseja ver. Um botão, por exemplo.

**Mensagem do commit**

```text
feat: filtra lembretes
```

## Publicando a versão final
Duration: 5:00

Chegar até aqui é notável. Significa que o aplicativo está pronto. Marque o último commit como importante. Revele-o para o mundo. Faça nova **tag**.

**Rótulo da tag**

```text
v1.0.0
```

**Mensagem da tag**

```text
Aplicação de gerenciamento de lembretes. Nunca mais esqueça seus afazeres importantes. Favorite os principais.
```

A seguir, faça um **pull request** para o repositório do professor.

## Encerramento
Duration: 3:00

Parabéns! Seu aplicativo de lembretes cadastra, lista, remove, favorita e filtra lembretes, e cada etapa ficou registrada em um commit com mensagem padronizada, com a versão final marcada pela tag `v1.0.0`.
