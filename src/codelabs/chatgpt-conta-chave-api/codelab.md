summary: Crie uma conta gratuita no ChatGPT e gere uma chave de API da OpenAI para acessar os serviços por meio de programas de computador.
id: chatgpt-conta-chave-api
categories: IA
tags: chatgpt,openai,api key,chave de api,conta
status: Published
authors: Rodrigo Bossini
last updated: 2023-08-21
pdf: chatgpt/01_apostila_chatgpt_criando_conta_obtendo_chave_api.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# ChatGPT: criando uma conta e obtendo a chave de API

## Visão geral
Duration: 3:00

Neste material, veremos como criar uma conta gratuita no ambiente **ChatGPT** e obter uma **chave de API** para acesso aos serviços por meio de programas de computador.

Na data de produção deste documento (maio de 2023), a chave de API gerada gratuitamente permitia o uso de até US$5 durante o período *trial*, que era de três meses. É um bom valor, suficiente para testar a API utilizando seus diferentes endpoints. Se desejar, visite [https://openai.com/pricing#language-models](https://openai.com/pricing#language-models) para conhecer os preços.

### O que você vai aprender

* Como criar uma conta no ChatGPT usando uma conta Google
* Como fazer um primeiro teste no ChatGPT
* Como gerar e guardar uma chave de API da OpenAI

### O que você vai precisar

* Uma conta Google (Gmail)
* Um número de celular válido, para receber um código via SMS
* Um navegador

<aside class="negative">

As telas da OpenAI mudam com frequência. Os passos e as imagens a seguir retratam o site em maio de 2023; os nomes dos botões podem estar diferentes hoje.

</aside>

## Criando uma conta
Duration: 8:00

Comece visitando [https://chat.openai.com/auth/login](https://chat.openai.com/auth/login) e clique em **Sign up**, como na figura a seguir.

![Tela "Welcome to ChatGPT" com os botões Log in e Sign up, com destaque em Sign up](img/p001-1.webp)

*Figura 2.1.1: clique em Sign up.*

<aside class="negative">

**Nota.** Na data de produção deste documento, a criação de novas contas apresentava uma mensagem que dizia que "*sign up is currently unavailable*". Porém, foi possível criar uma conta ChatGPT usando uma conta Google. Por isso, recomendamos esta abordagem.

</aside>

A tela a seguir permite a escolha de uso de uma conta Google. Observe.

![Tela "Create your account" com campo de e-mail e, em destaque, o botão Continue with Google](img/p002-1.webp)

*Figura 2.1.2: escolha Continue with Google.*

Depois disso, como mostra a figura a seguir, clique na conta Gmail que pretende usar. Caso seu navegador não esteja associado a nenhuma conta Gmail, você provavelmente terá de fazer login na sua conta Gmail antes.

![Tela "Choose an account" do Google, com a conta do usuário em destaque](img/p002-2.webp)

*Figura 2.1.3: escolha a conta Gmail.*

A seguir, será necessário informar seu nome, sobrenome e data de nascimento, como destaca a figura a seguir. Então, clique em **Continue**.

![Tela "Tell us about you" com os campos de nome, sobrenome e data de nascimento e o botão Continue em destaque](img/p003-1.webp)

*Figura 2.1.4: informe nome, sobrenome e data de nascimento.*

Depois disso, na tela a seguir, informe um número de celular válido e clique em **Send code**. Você deverá receber um código via SMS. Verifique seu celular.

![Tela "Verify your phone number" com o código do país +55, o campo do número e o botão Send code em destaque](img/p003-2.webp)

*Figura 2.1.5: informe o número do celular e clique em Send code.*

Na tela seguinte, informe o código recebido via SMS.

![Tela "Enter code" com o campo para o código de seis dígitos em destaque](img/p004-1.webp)

*Figura 2.1.6: digite o código recebido via SMS.*

Assim que digitar o código corretamente, você deverá ser levado à tela seguinte.

![Tela inicial do ChatGPT, com exemplos, recursos e limitações e a caixa de mensagem na parte inferior](img/p004-2.webp)

*Figura 2.1.7: tela inicial do ChatGPT.*

Vá em frente e faça um teste qualquer, como na figura a seguir.

![Conversa no ChatGPT com a pergunta "Por que o céu é azul?" destacada na caixa de mensagem e a resposta do ChatGPT destacada acima](img/p005-1.webp)

*Figura 2.1.8: sua pergunta, embaixo, e a resposta do ChatGPT.*

Faça novos testes, se desejar! 🙂

## Obtendo a chave de API
Duration: 6:00

Para escrevermos programas que "conversam" com o ChatGPT, precisamos obter uma **chave de API**. A cada requisição enviada, ela é utilizada para que possamos ser identificados e para que possamos pagar conforme utilizamos os recursos oferecidos.

Comece visitando [https://platform.openai.com/overview](https://platform.openai.com/overview) para obter a página exibida a seguir. Clique em **Personal** no canto superior direito.

![Página "Welcome to OpenAI" da plataforma, com o menu Personal destacado no canto superior direito](img/p006-1.webp)

*Figura 2.2.1: página inicial da plataforma OpenAI.*

A seguir, como mostra a figura, clique em **View API keys**.

![Menu Personal aberto, com as opções Manage account, View API keys (em destaque), Invite team, Help, Pricing, Terms & policies e Log out](img/p006-2.webp)

*Figura 2.2.2: clique em View API keys.*

Na tela seguinte, clique em **Create new secret key**.

![Página "API keys" informando que ainda não há chaves, com o botão Create new secret key em destaque](img/p007-1.webp)

*Figura 2.2.3: clique em Create new secret key.*

O próximo passo é associar um nome à chave. O nome você escolhe. Geralmente, algo descritivo, que te ajude a lembrar a razão de ser daquela chave, ou seja, qual era seu objetivo quando a criou. Clique em **Create secret key** a seguir.

![Janela "Create new secret key" com o campo Name preenchido com "Aula Python/Java com o prof. Bossini" e o botão Create secret key em destaque](img/p007-2.webp)

*Figura 2.2.4: dê um nome à chave e clique em Create secret key.*

A tela seguinte deve exibir a sua chave. É importante copiá-la agora. **Não será possível visualizá-la novamente depois.** Se você perdê-la, precisará gerar outra. Depois de copiar a sua chave e armazená-la num local seguro, é só clicar em **Done**.

![Janela "Create new secret key" exibindo o campo onde a chave aparece, o botão de copiar e o botão Done](img/p008-1.webp)

*Figura 2.2.5: copie a chave e clique em Done.*

Pronto!

## Encerramento
Duration: 2:00

Parabéns! Você criou uma conta no ChatGPT, fez seus primeiros testes e gerou uma chave de API. Com ela, você pode escrever programas que se comunicam com o ChatGPT, como nos codelabs de back end com NodeJS, de perguntas e respostas com Python e Java e de análise de sentimentos.

### Referências

* OpenAI. OpenAI, 2023. Disponível em [https://openai.com/](https://openai.com/). Acesso em maio de 2023.
* Preços: [https://openai.com/pricing#language-models](https://openai.com/pricing#language-models)
