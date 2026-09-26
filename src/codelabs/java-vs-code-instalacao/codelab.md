summary: Instale o VS Code no Windows, crie uma pasta de trabalho na pasta do usuário, vincule o editor a ela e abra um terminal integrado.
id: java-vs-code-instalacao
categories: Java
tags: java,vs code,instalação,windows,terminal
status: Published
authors: Rodrigo Bossini
last updated: 2023-02-16
pdf: java/000_apostila_vs_code_instalacao_e_vinculo_a_pasta.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# VS Code: instalação e vínculo a uma pasta

## Visão geral
Duration: 3:00

O VS Code é um dos editores de código fonte mais utilizados atualmente. Ele pode ser utilizado para inúmeras finalidades, como

* Edição de texto comum
* Programação em Java
* Programação em Python
* Desenvolvimento Web com HTML, CSS e Javascript/Typescript

entre muitas outras possibilidades.

### O que você vai aprender

* Como fazer a instalação do VS Code
* Como vinculá-lo a uma pasta, o que simplifica bastante o trabalho
* Como trocar o tema de cores e abrir um terminal vinculado ao VS Code

### O que você vai precisar

* Um computador com Windows e acesso à internet
* Um navegador (neste material, o Google Chrome)

## Download do VS Code
Duration: 4:00

O primeiro passo é obter uma cópia da última versão do VS Code disponível para o seu sistema operacional. Para tal, basta visitar o link a seguir.

[https://code.visualstudio.com/](https://code.visualstudio.com/)

Você deverá se deparar com uma tela parecida com aquela que a Figura 2.1.1 mostra. Basta clicar em **Download**.

![Página inicial do site do VS Code com o botão Download for Windows destacado](img/fig-2-1-1.webp)

*Figura 2.1.1 – Página de download do VS Code.*

A tela seguinte deverá ser semelhante àquela exibida pela Figura 2.1.2. Observe que, uma vez que o download tenha terminado, o seu navegador poderá exibir uma "caixa" no canto inferior esquerdo que, quando clicada, coloca o instalador em execução. Vá em frente e clique sobre ela.

<aside class="positive">

**Nota.** É possível que seu navegador tenha um comportamento um pouco diferente. Neste material estamos utilizando o Google Chrome.

</aside>

![Página de agradecimento pelo download com o arquivo baixado destacado no canto inferior esquerdo do navegador](img/fig-2-1-2.webp)

*Figura 2.1.2 – Download concluído: clique no arquivo para executar o instalador.*

## Executando o instalador
Duration: 5:00

Na primeira tela do instalador, exibida pela Figura 2.1.3, é preciso concordar com os termos de uso e clicar em **Próximo**.

![Tela do Acordo de Licença do instalador com a opção Eu aceito o acordo marcada](img/fig-2-1-3.webp)

*Figura 2.1.3 – Acordo de licença.*

A tela seguinte, exibida pela Figura 2.1.4, permite escolher o diretório de instalação do VS Code. Basta manter o valor padrão e clicar em **Próximo**.

![Tela Selecione o Local de Destino com o caminho padrão de instalação](img/fig-2-1-4.webp)

*Figura 2.1.4 – Diretório de instalação.*

A tela seguinte, exibida pela Figura 2.1.5, pergunta se você deseja que seja criado um atalho para o VS Code no menu iniciar do sistema operacional. Faça a sua escolha e clique em **Próximo**. Neste material, mantivemos tudo como estava, o que quer dizer que o atalho será criado.

![Tela Selecionar a Pasta do Menu Iniciar com o nome Visual Studio Code](img/fig-2-1-5.webp)

*Figura 2.1.5 – Atalho no menu iniciar.*

A seguir, como a Figura 2.1.6 exibe, é possível optar pela criação de mais atalhos, como aqueles que aparecem nos menus de contexto (quando clicamos com o direito numa pasta, por exemplo) e um ícone na área de trabalho. Eles podem ser muito úteis. Por isso, marcamos todas as caixinhas. A seguir, clique em **Próximo**.

![Tela Selecionar Tarefas Adicionais com todas as caixas marcadas](img/fig-2-1-6.webp)

*Figura 2.1.6 – Tarefas adicionais: todas as opções marcadas.*

Finalmente chegamos ao ponto em que a instalação pode começar. Na tela exibida pela Figura 2.1.7, basta clicar em **Instalar**.

![Tela Pronto para Instalar com o resumo das opções e o botão Instalar](img/fig-2-1-7.webp)

*Figura 2.1.7 – Pronto para instalar.*

Quando a instalação terminar, você deverá se deparar com uma tela parecida com aquela que a Figura 2.1.8 exibe. Podemos optar por abrir o VS Code neste momento, o que ainda não é necessário. Por isso, desmarque a caixinha. A seguir, clique em **Concluir**.

![Tela final do assistente de instalação com a caixa Executar Visual Studio Code desmarcada](img/fig-2-1-8.webp)

*Figura 2.1.8 – Instalação concluída.*

## Criando a pasta de trabalho
Duration: 8:00

### Vinculando o VS Code a uma pasta

Uma das melhores formas para se trabalhar com o VS Code é fazendo com que ele opere "vinculado" a uma pasta. O processo é bastante simples:

* Criamos uma pasta no Windows
* Abrimos o VS Code
* No VS Code, escolhemos a opção **Arquivo >> Abrir pasta** e pronto. O VS Code está vinculado a uma pasta.

A partir daí, ele

* exibirá os arquivos existentes nesta pasta no menu lateral
* criará novos arquivos e novas pastas nesta pasta a que está vinculado
* fará uso de um "terminal" que, automaticamente, é aberto associado à pasta a que está vinculado.

### Abrindo o Explorador de Arquivos do Windows

O primeiro passo é abrir o navegador de arquivos do Windows. Para tal, clique no botão da barra Iniciar e busque por **Explorador**. Após clicar no botão, basta começar a digitar. Você deverá se deparar com algo semelhante àquilo que a Figura 2.2.1 exibe.

![Menu Iniciar do Windows com a busca por explorador e o aplicativo Explorador de Arquivos destacado](img/fig-2-2-1.webp)

*Figura 2.2.1 – Buscando o Explorador de Arquivos.*

### Navegando até a pasta do usuário

O ideal é criarmos uma pasta que seja subpasta da pasta do usuário atualmente logado no sistema operacional. Assim podemos evitar eventuais problemas envolvendo o mecanismo de permissões do sistema operacional. Por isso, vamos criar uma pasta como subpasta da pasta de documentos do usuário. Para encontrá-la, comece clicando em **Este Computador**, como na Figura 2.2.2.

![Explorador de Arquivos com a opção Este Computador destacada no menu lateral](img/fig-2-2-2.webp)

*Figura 2.2.2 – Este Computador.*

<aside class="negative">

**Nota.** Observe que o menu lateral possui uma opção chamada Documentos. Aparentemente, é a pasta que desejamos visitar. Entretanto, este atalho pode ser enganoso. Muitas vezes ele nos leva para uma pasta diferente, talvez uma pasta gerenciada pelo OneDrive. Por isso, evite utilizá-lo e siga os passos descritos neste documento.

</aside>

Na tela seguinte, exibida pela Figura 2.2.3, clique duas vezes em **Disco Local (C:)**.

![Este Computador com a unidade Disco Local C destacada](img/fig-2-2-3.webp)

*Figura 2.2.3 – Disco Local (C:).*

A seguir, encontre a pasta chamada **Usuários** — ou **Users**, depende do idioma do seu sistema operacional — e clique duas vezes sobre ela. Veja a Figura 2.2.4.

![Conteúdo do disco C com a pasta Usuários destacada](img/fig-2-2-4.webp)

*Figura 2.2.4 – Pasta Usuários.*

As pastas exibidas na tela seguinte, exibida pela Figura 2.2.5, são referentes a cada usuário existente no sistema operacional. Cada um tem a sua. Encontre a pasta que leva o nome do usuário que você utilizou para acessar o sistema operacional do seu computador e clique duas vezes sobre ela. Neste exemplo, o usuário se chama **Aulas**. Claro, o nome do seu usuário provavelmente será diferente.

![Pasta Usuários com a pasta do usuário Aulas destacada](img/fig-2-2-5.webp)

*Figura 2.2.5 – Pasta do usuário.*

Na pasta seguinte, exibida pela Figura 2.2.6, deverá ser possível encontrar uma pasta chamada **Documentos** — ou **Documents**. Clique duas vezes sobre ela.

![Pasta do usuário com a pasta Documentos destacada](img/fig-2-2-6.webp)

*Figura 2.2.6 – Pasta Documentos.*

### Criando as pastas java e aula01

Agora podemos criar uma pasta. Digamos que teremos diversas aulas de Java, apenas como exemplo. Uma boa ideia seria criar uma pasta chamada `java` que teria como finalidade abrigar diversas subpastas, uma para cada aula. Façamos isso. Comece clicando com o direito no "vazio" para obter o menu de contexto exibido pela Figura 2.2.7.

![Menu de contexto do Explorador com as opções Novo e Pasta destacadas](img/fig-2-2-7.webp)

*Figura 2.2.7 – Novo >> Pasta.*

Como na Figura 2.2.8, escolha o nome "java", sem as aspas. A seguir, aperte **Enter** para confirmar o nome da pasta.

![Nova pasta sendo nomeada como java dentro de Documentos](img/fig-2-2-8.webp)

*Figura 2.2.8 – Pasta java.*

Clique duas vezes sobre a pasta que acaba de criar. Na tela resultante, clique com o direito novamente na região "vazia", crie uma nova pasta e escolha o nome "aula01". Aperte **Enter** a seguir. Veja as figuras 2.2.9 e 2.2.10.

![Menu de contexto aberto dentro da pasta java para criar uma nova pasta](img/fig-2-2-9.webp)

*Figura 2.2.9 – Criando uma subpasta dentro de java.*

![Nova pasta sendo nomeada como aula01 com a instrução para apertar Enter](img/fig-2-2-10.webp)

*Figura 2.2.10 – Pasta aula01.*

<aside class="negative">

**Nota.** Em qualquer ambiente de desenvolvimento de software, seja utilizando o VS Code, Java ou qualquer outra ferramenta ou linguagem, sempre utilize nomes de pastas e arquivos que não possuam caracteres especiais ou espaços em branco no nome. Eles podem causar problemas difíceis de se encontrar.

</aside>

## Abrindo o VS Code vinculado à pasta
Duration: 6:00

Agora podemos abrir o VS Code, vinculando-o à pasta criada. Para tal, clique no botão iniciar do Windows e busque por **VS Code**, como mostra a Figura 2.2.11.

![Menu Iniciar com a busca vs code e o aplicativo Visual Studio Code destacado](img/fig-2-2-11.webp)

*Figura 2.2.11 – Abrindo o VS Code.*

Provavelmente, o VS Code dará a opção de fazer a instalação do pacote de idiomas que inclui o português do Brasil. Façamos isso. Clique na opção destacada pela Figura 2.2.12.

![Tela inicial do VS Code com a notificação para instalar o pacote de idioma português destacada](img/fig-2-2-12.webp)

*Figura 2.2.12 – Instalando o pacote de idioma.*

Feita a instalação, o VS Code deve reiniciar-se automaticamente. Agora vamos fazer o vínculo com a pasta. Clique em **Arquivo >> Abrir pasta**, como na Figura 2.2.13.

![Menu Arquivo do VS Code com a opção Abrir Pasta destacada](img/fig-2-2-13.webp)

*Figura 2.2.13 – Arquivo >> Abrir pasta.*

Na tela resultante, clique **Este Computador >> Disco Local (C:) >> Usuários >> nomeDoSeuUsuario >> java >> aula01**. A esperança é obter um resultado semelhante àquele exibido pela Figura 2.2.14. Clique em **Selecionar Pasta**.

![Janela Abrir Pasta com o caminho até aula01 e o botão Selecionar pasta destacados](img/fig-2-2-14.webp)

*Figura 2.2.14 – Selecionando a pasta aula01.*

O VS Code possui recursos capazes de executar arquivos automaticamente. Por isso, ele pergunta se você confia nos autores desta pasta. Em outras palavras, se os arquivos que serão armazenados nela são confiáveis. Marque a caixinha e clique no botão destacado pela Figura 2.2.15.

![Diálogo Você confia nos autores dos arquivos nesta pasta com a caixa marcada e o botão Sim, confio nos autores destacado](img/fig-2-2-15.webp)

*Figura 2.2.15 – Confiando nos autores da pasta.*

Agora, o VS Code deve estar exibindo uma tela com diversos links. Repare que alguns deles dão acesso a tutoriais sobre o uso do VS Code e podem ser muito interessantes. Procure visitá-los quando possível. Neste momento, você pode fechar esta aba, como mostra a Figura 2.2.16.

![Aba Introdução do VS Code com o botão de fechar a aba destacado](img/fig-2-2-16.webp)

*Figura 2.2.16 – Fechando a aba de introdução.*

Observe que o menu à esquerda mostra o nome da pasta. Veja a Figura 2.2.17. Agora estamos prontos para trabalhar com o VS Code. Ele está vinculado a uma pasta!

![Explorador do VS Code exibindo a pasta AULA01](img/fig-2-2-17.webp)

*Figura 2.2.17 – VS Code vinculado à pasta aula01.*

O menu à esquerda se chama **Explorador**. Você pode ocultá-lo — para ganhar mais espaço para trabalhar nos seus arquivos, por exemplo — e exibi-lo novamente clicando no botão destacado pela Figura 2.2.18.

![VS Code com o botão do Explorador destacado e o explorador oculto](img/fig-2-2-18.webp)

*Figura 2.2.18 – Ocultando e exibindo o Explorador.*

## Trocando o tema de cores
Duration: 3:00

Por padrão, o VS Code utiliza um tema escuro. Se desejar trocar, você pode fazê-lo clicando em **Arquivo >> Preferências >> Tema de Cores**, como mostra a Figura 2.2.19.

![Menu Arquivo, Preferências, Tema de Cores do VS Code](img/fig-2-2-19.webp)

*Figura 2.2.19 – Arquivo >> Preferências >> Tema de Cores.*

Na tela resultante, exibida pela Figura 2.2.20, escolha, por exemplo, o tema **Claro+ (claro padrão)**.

![Lista de temas de cores com a opção Claro+ (claro padrão) destacada](img/fig-2-2-20.webp)

*Figura 2.2.20 – Escolhendo o tema Claro+.*

Volte ao VS Code e verifique o resultado. Se desejar, teste outras opções e verifique a que lhe agrada mais!

## Abrindo um terminal vinculado ao VS Code
Duration: 4:00

Quando interagimos com o sistema operacional, estamos interessados em realizar alguma tarefa, o que é, em geral, feito por algum programa que solicitamos que seja aberto. A forma mais comum de fazê-lo se dá por meio do uso de interfaces gráficas ou "janelas". Também é possível interagir com o sistema operacional solicitando que ele, por exemplo, execute programas, **textualmente**. Ou seja, digitando comandos que devem ser executados. Isso é feito pela conhecida **linha de comando**. As expressões shell, terminal, bash, prompt de comando etc. são utilizadas para se referir a este mecanismo.

O VS Code permite que terminais internos sejam abertos, o que facilita bastante o trabalho. Para tal, basta clicar em **Terminal >> Novo Terminal** como na Figura 2.2.21.

![Menu Terminal do VS Code com a opção Novo Terminal destacada](img/fig-2-2-21.webp)

*Figura 2.2.21 – Terminal >> Novo Terminal.*

O resultado esperado se parece com aquele que a Figura 2.2.22 exibe.

![VS Code com o painel do terminal aberto na parte inferior](img/fig-2-2-22.webp)

*Figura 2.2.22 – Terminal aberto no VS Code.*

Digite, por exemplo, o comando `pwd` — de *print working directory*. O resultado deve ser semelhante ao que a Figura 2.2.23 exibe. Este comando exibe o diretório a que o terminal se encontra vinculado no momento.

**Terminal**

```bash
pwd
```

![Terminal PowerShell mostrando o comando pwd e o caminho C:\Users\Aulas\Documents\java\aula01](img/fig-2-2-23.webp)

*Figura 2.2.23 – Resultado do comando pwd: o terminal está na pasta aula01.*

## Parabéns!
Duration: 2:00

Você instalou o VS Code, criou uma pasta de trabalho dentro da pasta do seu usuário, vinculou o editor a ela, ajustou o tema de cores e abriu um terminal integrado já posicionado na pasta.

### Próximos passos

* Visite os tutoriais oferecidos na tela de boas-vindas do VS Code
* Siga para o codelab de introdução à lógica de programação e ao primeiro programa em Java
