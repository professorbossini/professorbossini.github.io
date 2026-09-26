summary: Crie seu primeiro pipeline no GitLab CI/CD para "fazer um bolo": escreva jobs no .gitlab-ci.yml, organize-os em stages, preserve arquivos com artefatos e depure falhas lendo os logs.
id: devops-gitlab-pipeline-bolo
categories: GitLab,DevOps
tags: gitlab,ci/cd,pipeline,gitlab-ci.yml,yaml,jobs,stages,artifacts
status: Published
authors: Rodrigo Bossini
last updated: 2022-02-14
pdf: devops/03_apostila_devops_gitlab_pipeline_bolo.pdf
exercicios: devops/03_exercicios_devops_gitlab_pipeline_bolo.pdf,devops/03_exercicios_com_solucao_devops_gitlab_pipeline_bolo.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# GitLab CI: um pipeline para fazer um bolo

## Visão geral
Duration: 3:00

Neste material, vamos desenvolver um **pipeline** simples utilizando ferramentas do **GitLab**. Utilizaremos nosso pipeline para uma tarefa simples: fazer um bolo.

### O que você vai aprender

* Criar um projeto no GitLab
* Descrever um pipeline no arquivo `.gitlab-ci.yml`, escrito em YAML
* Criar **Jobs** e acompanhar sua execução e seus logs
* Entender que Jobs executam em paralelo e organizá-los em **Stages** para obter execução sequencial
* Preservar arquivos entre Jobs com **artefatos**
* Diferenciar os operadores de redirecionamento `>` e `>>`

### O que você vai precisar

* Um navegador e uma conta no GitLab ([https://gitlab.com/](https://gitlab.com/))
* Noções de comandos de terminal Unix (`mkdir`, `cd`, `touch`, `echo`, `grep`) ajudam, mas cada um é explicado ao longo do texto

## Conta e novo projeto no GitLab
Duration: 5:00

### Conta no GitLab

O primeiro passo é criar uma conta no GitLab, caso ainda não possua. Você pode fazê-lo visitando o link a seguir.

**Link 2.1**: [https://gitlab.com/](https://gitlab.com/)

### Novo projeto

Depois de fazer login, você deverá ver uma tela parecida com aquela que a figura a seguir exibe. Clique em **New Project**.

![Tela Projects do GitLab com o botão New project destacado no canto superior direito](img/fig-2-01.webp)

*Figura 2.1: botão New project.*

Na tela exibida pela figura a seguir, clique em **Create blank project**.

<aside class="positive">

**Nota.** Um projeto no GitLab é um agrupamento de objetos e configurações que pode incluir repositórios, mecanismos de CI/CD, controle de incidentes (*issue tracking*) etc.

</aside>

![Tela Create new project com a opção Create blank project destacada, acima de Create from template e Import project](img/fig-2-02.webp)

*Figura 2.2: opção Create blank project.*

Escolha um nome parecido com `meu_primeiro_pipeline` como **Project Name**. Ao digitá-lo, o **Project slug** deverá ser preenchido automaticamente: ele é apenas o trecho final da URL do repositório que está sendo criado. Mantenha as demais opções com seus valores padrão e clique **Create project**, como na figura a seguir.

![Formulário Create blank project com nome, URL e slug do projeto preenchidos e o botão Create project destacado](img/fig-2-03.webp)

*Figura 2.3: criando o projeto.*

## O arquivo .gitlab-ci.yml
Duration: 5:00

No GitLab, as fases de um pipeline são descritas utilizando-se um arquivo chamado `.gitlab-ci.yml`. Observe que seu repositório já possui um arquivo com esse nome, além do arquivo `README.md`, utilizado para descrever o repositório. Clique no arquivo `.gitlab-ci.yml`, como na figura a seguir.

![Página inicial do repositório com a lista de arquivos, com .gitlab-ci.yml destacado acima de README.md](img/fig-2-04.webp)

*Figura 2.4: o arquivo .gitlab-ci.yml no repositório.*

<aside class="positive">

**Nota.** A extensão do arquivo (`.yml`) refere-se ao formato **YAML**. Trata-se de uma linguagem comumente utilizada para a escrita de arquivos de configurações, tal qual se faz com JSON. Aliás, YAML é superconjunto de JSON. A página [https://yaml.org/](https://yaml.org/) (Link 2.2) dá acesso à especificação da linguagem, além de diversas ferramentas.

Caso deseje aprender mais sobre YAML, acesse, por exemplo, [https://www.redhat.com/sysadmin/yaml-beginners](https://www.redhat.com/sysadmin/yaml-beginners) (Link 2.3).

</aside>

Para editar o arquivo, clique em **Edit in Web IDE**, como na figura a seguir.

![Visualização do arquivo .gitlab-ci.yml com o botão Edit in Web IDE destacado](img/fig-2-05.webp)

*Figura 2.5: botão Edit in Web IDE.*

Observe que o arquivo original possui algum conteúdo de exemplo, criado automaticamente. **Apague esse conteúdo.**

## Primeiro Job: ingredientes do bolo
Duration: 8:00

Para especificar os ingredientes do bolo, vamos criar um **Job** do GitLab. Trata-se da especificação de uma tarefa que desejamos que o GitLab execute. Os ingredientes serão armazenados em um arquivo que criaremos. Veja o bloco de código a seguir.

**.gitlab-ci.yml · Bloco de Código 2.1**

```yaml
#Comentários YAML começam com #
#OBS: Não há comentários de múltiplas linhas
#3 hífens indicam o início do documento YAML
#na verdade, são opcionais
# podem ser usados diversas vezes para especificar diretivas
---

#nome do Job
obter ingredientes do bolo:
  #dois espaços e, então, a palavra scripts
  script:
    #dois espaços de novo
    #utilizaremos comandos tipicamente utilizados em terminais Unix
    #uma pasta para fazer o bolo
    - mkdir build
    - cd build
    - touch bolo.txt #touch cria um arquivo
    #echo exibe texto na saída padrão
    # > direciona para o arquivo especificado
    - echo "2 xícaras de farinha de trigo" > bolo.txt
    - echo "2 xícaras de açúcar" > bolo.txt
    - echo "2 colheres de manteiga" > bolo.txt
    - echo "3 ovos" > bolo.txt
    - echo "1 xícara de leite" > bolo.txt
    - echo "1 colher de sopa de fermento" > bolo.txt
```

Quando terminar, clique em **Commit**, como a figura a seguir destaca.

![Web IDE com o arquivo .gitlab-ci.yml editado e o botão Commit destacado na parte inferior esquerda](img/fig-2-06.webp)

*Figura 2.6: botão Commit na Web IDE.*

A seguir, o GitLab deverá perguntar se desejamos criar uma nova branch ou fazer o Commit diretamente na branch principal, que se chama `main`. Por simplicidade, vamos escolher fazer o Commit na branch principal. Por isso, clique em **Commit to main branch**, como a figura a seguir mostra.

![Painel de commit com o campo Commit Message, a opção Commit to main branch selecionada e o botão Commit destacados](img/fig-2-07.webp)

*Figura 2.7: Commit to main branch.*

Ainda na figura anterior, depois de selecionar **Commit to main branch**, clique **Commit**. Se desejar, especifique uma mensagem que descreve o que fizemos até então, no campo **Commit Message**.

## Verificando a execução do Job
Duration: 6:00

Logo após ter clicado em Commit, o GitLab colocou o seu Job em execução. Você pode verificar o resultado clicando no pequeno ícone de pipelines. Ele fica no canto superior direito, como mostra a figura a seguir.

<aside class="positive">

**Nota.** Um **Pipeline** do GitLab (por enquanto) é uma sequência de Jobs. Adiante aprenderemos mais recursos que podem ser envolvidos.

</aside>

<aside class="positive">

**Nota.** A edição do arquivo `.gitlab-ci.yml` disparou uma nova execução de um Pipeline. Isso não vale apenas para esse arquivo, entretanto. A edição de qualquer arquivo seguida de um Commit fará com que uma nova execução de Pipeline entre em execução.

</aside>

![Web IDE após o commit, com o ícone de pipelines destacado no canto superior direito](img/fig-2-08.webp)

*Figura 2.8: ícone de pipelines.*

Se tudo estiver certo, você deverá ver um símbolo verde como destaca a figura a seguir.

![Painel do pipeline com o símbolo verde de sucesso destacado ao lado do número do pipeline e a lista de Jobs](img/fig-2-09.webp)

*Figura 2.9: pipeline executado com sucesso.*

Observe, ainda na figura anterior, que cada Pipeline possui um número. Ele aparece precedido pelo símbolo `#`. Clique nele para visualizar a tela exibida pela figura a seguir. Como ela destaca, é possível clicar no nome do Job, o que permitirá ver a execução dos comandos (Figura 2.11).

![Página do pipeline com o Job obter ingredientes do bolo destacado no stage test](img/fig-2-10.webp)

*Figura 2.10: o Job dentro do pipeline.*

![Log do Job no terminal do GitLab, mostrando a preparação do executor Docker e a execução de cada comando do script](img/fig-2-11.webp)

*Figura 2.11: log de execução dos comandos do Job.*

Observe que o GitLab se encarrega de executar os comandos especificados utilizando um **contêiner Docker**.

## Novo Job: verificando os ingredientes
Duration: 8:00

O próximo passo é preparar e assar o bolo. Antes disso, entretanto, vamos especificar um novo Job que se encarregará de verificar se todos os ingredientes foram especificados. Para isso, volte à tela inicial do seu repositório (é só clicar no canto superior esquerdo, como na figura a seguir) e clique novamente sobre o nome do arquivo `.gitlab-ci.yml` para editá-lo, como na Figura 2.13.

![Log de um Job com o nome do projeto destacado no canto superior esquerdo do menu lateral](img/fig-2-12.webp)

*Figura 2.12: voltando à tela inicial do repositório.*

![Página inicial do repositório com o arquivo .gitlab-ci.yml destacado](img/fig-2-13.webp)

*Figura 2.13: abrindo o .gitlab-ci.yml novamente.*

Como na figura a seguir, clique em **Edit in Web IDE**.

![Visualização do arquivo .gitlab-ci.yml com o botão Edit in Web IDE destacado](img/fig-2-14.webp)

*Figura 2.14: Edit in Web IDE.*

Veja a especificação do novo Job no bloco de código a seguir.

**.gitlab-ci.yml · Bloco de Código 2.2**

```yaml
#Comentários YAML começam com #
#OBS: Não há comentários de múltiplas linhas
#3 hífens indicam o início do documento YAML
#na verdade, são opcionais
# podem ser usados diversas vezes para especificar diretivas
---

#nome do Job
obter ingredientes do bolo:
  #dois espaços e, então, a palavra scripts
  script:
    #dois espaços de novo
    #utilizaremos comandos tipicamente utilizados em terminais Unix
    #uma pasta para fazer o bolo
    - mkdir build
    - cd build
    - touch bolo.txt #touch cria um arquivo
    #echo exibe texto na saída padrão
    # > direciona para o arquivo especificado
    - echo "2 xícaras de farinha de trigo" > bolo.txt
    - echo "2 xícaras de açúcar" > bolo.txt
    - echo "2 colheres de manteiga" > bolo.txt
    - echo "3 ovos" > bolo.txt
    - echo "1 xícara de leite" > bolo.txt
    - echo "1 colher de sopa de fermento" > bolo.txt

#Job para testar se todos os ingredientes foram especificados
verificar lista de ingredientes:
  script:
    #variável temporária do terminal para guardar o nome do arquivo
    - NOME_ARQ=bolo.txt
    #test realiza testes em geral envolvendo arquivos
    #aqui, estamos verificando a sua existência
    - test -f build/$NOME_ARQ
    - cd build
    - grep "farinha de trigo" $NOME_ARQ
    - grep "açúcar" $NOME_ARQ
    - grep "manteiga" $NOME_ARQ
    - grep "ovos" $NOME_ARQ
    - grep "leite" $NOME_ARQ
    - grep "fermento" $NOME_ARQ
```

A seguir, clique em **Commit** e escolha novamente a opção **Commit to main branch**. Clique no ícone de pipelines no canto superior direito e, então, no número do pipeline como na figura a seguir.

![Painel de pipelines com o número do pipeline e o ícone de pipelines destacados; o pipeline aparece com falha](img/fig-2-15.webp)

*Figura 2.15: abrindo o pipeline pelo seu número.*

Na tela a seguir, observe que o primeiro Job executou com sucesso. O segundo, entretanto, falhou. Clique sobre seu nome para verificar o que houve.

![Página do pipeline com status failed: obter ingredientes do bolo com sucesso e verificar lista de ingredientes com falha, destacado](img/fig-2-16.webp)

*Figura 2.16: o segundo Job falhou.*

A figura a seguir mostra que o erro foi causado pelo comando `test`.

![Log do Job verificar lista de ingredientes terminando no comando test -f build/$NOME_ARQ seguido de ERROR: Job failed: exit code 1](img/fig-2-17.webp)

*Figura 2.17: o comando test causou a falha.*

## Jobs executam em paralelo: Stages
Duration: 8:00

### Jobs do GitLab executam em paralelo

Uma possível causa é a seguinte: a menos que especifiquemos explicitamente, o GitLab potencialmente executará nossos Jobs **em paralelo**. Ou seja, pode ser que o comando `test` do segundo Job execute antes mesmo de o comando `touch` do primeiro Job ter sido executado. Veja a figura a seguir.

![Linha do tempo com Job 1 (mkdir build, cd build, touch bolo.txt) e Job 2 (NOME_ARQ=bolo.txt, test -f build/$NOME_ARQ com ERRO) em paralelo: a verificação da existência do arquivo pode executar antes de sua criação](img/fig-2-18.webp)

*Figura 2.18: observe como a verificação da existência do arquivo pode executar antes de sua criação.*

### Execução sequencial: criação de Stages

Evidentemente, a execução em paralelo pode ser de interesse em muitos casos. Como acontece no nosso exemplo, a execução sequencial é fundamental. Podemos explicar isso ao GitLab por meio da criação de **Stages**.

<aside class="positive">

**Nota.** Um Stage do GitLab pode conter diversos Jobs. Os Jobs de um Stage podem executar em paralelo. Podemos especificar múltiplos Stages e dizer qual a sua ordem de execução desejada. Assim, nossos Stages não executarão em paralelo.

</aside>

Ajuste o arquivo `.gitlab-ci.yml` como mostra o bloco de código a seguir.

**.gitlab-ci.yml · Bloco de Código 2.3**

```yaml
---
#definimos os Stages e a sua ordem de execução assim
stages:
  - obter_ingredientes
  - verificar_ingredientes

#nome do Job
obter ingredientes do bolo:
  #esse Job pertence a esse Stage
  stage: obter_ingredientes
  #dois espaços e, então, a palavra scripts
  script:
    #dois espaços de novo
    #utilizaremos comandos tipicamente utilizados em terminais Unix
    #uma pasta para fazer o bolo
    - mkdir build
    - cd build
    - touch bolo.txt #touch cria um arquivo
    #echo exibe texto na saída padrão
    # > direciona para o arquivo especificado
    - echo "2 xícaras de farinha de trigo" > bolo.txt
    - echo "2 xícaras de açúcar" > bolo.txt
    - echo "2 colheres de manteiga" > bolo.txt
    - echo "3 ovos" > bolo.txt
    - echo "1 xícara de leite" > bolo.txt
    - echo "1 colher de sopa de fermento" > bolo.txt

#Job para testar se todos os ingredientes foram especificados
verificar lista de ingredientes:
  #esse Job pertence a esse Stage
  stage: verificar_ingredientes
  script:
    #variável temporária do terminal para guardar o nome do arquivo
    - NOME_ARQ=bolo.txt
    #test realiza testes em geral envolvendo arquivos
    #aqui, estamos verificando a sua existência
    - test -f build/$NOME_ARQ
    - cd build
    - grep "farinha de trigo" $NOME_ARQ
    - grep "açúcar" $NOME_ARQ
    - grep "manteiga" $NOME_ARQ
    - grep "ovos" $NOME_ARQ
    - grep "leite" $NOME_ARQ
    - grep "fermento" $NOME_ARQ
```

Feitos os ajustes, clique em **Commit**, escolha **Commit to main branch** e clique em **Commit**. Clique novamente no ícone de Pipelines no canto superior direito e, a seguir, no número do Pipeline, como na figura a seguir.

![Painel do pipeline com o número do pipeline e o ícone de pipelines destacados, mostrando o stage verificar_ingredientes com falha](img/fig-2-19.webp)

*Figura 2.19: abrindo o novo pipeline.*

A tela seguinte mostra que temos dois Stages em nosso Pipeline: `obter_ingredientes` e `verificar_ingredientes`. Como mostra a figura a seguir, clique no segundo para verificar o erro.

![Página do pipeline com os stages Obter_ingredientes (sucesso) e Verificar_ingredientes (falha), com o Job verificar lista de ingredientes destacado](img/fig-2-20.webp)

*Figura 2.20: agora há dois Stages; o segundo falhou.*

## Artefatos: preservando arquivos entre Jobs
Duration: 6:00

O comando `test` do segundo Job é o culpado novamente. O que houve dessa vez? Trata-se de uma outra característica inerente ao funcionamento dos Pipelines do GitLab: por padrão, **os Jobs não compartilham seu ambiente de execução** e, quando encerrados, qualquer coisa que tenham criado poderá (e eventualmente será) destruída. Precisamos dizer explicitamente quais conteúdos criados por um Job deverão ser mantidos ao longo da execução do Pipeline.

### Produção de artefatos

O recurso que desejamos utilizar é a produção de **artefatos**. Na especificação de um Job, podemos dizer que ele produz um artefato. O efeito disso é a garantia de que aquilo que foi especificado permanecerá disponível ao longo da execução do Pipeline mesmo após o encerramento da execução do Job. Veja como fazê-lo no bloco de código a seguir.

**.gitlab-ci.yml · Bloco de Código 2.4**

```yaml
---
#definimos os Stages e a sua ordem de execução assim
stages:
  - obter_ingredientes
  - verificar_ingredientes

#nome do Job
obter ingredientes do bolo:
  #esse Job pertence a esse Stage
  stage: obter_ingredientes
  #dois espaços e, então, a palavra scripts
  script:
    #dois espaços de novo
    #utilizaremos comandos tipicamente utilizados em terminais Unix
    #uma pasta para fazer o bolo
    - mkdir build
    - cd build
    - touch bolo.txt #touch cria um arquivo
    #echo exibe texto na saída padrão
    # > direciona para o arquivo especificado
    - echo "2 xícaras de farinha de trigo" > bolo.txt
    - echo "2 xícaras de açúcar" > bolo.txt
    - echo "2 colheres de manteiga" > bolo.txt
    - echo "3 ovos" > bolo.txt
    - echo "1 xícara de leite" > bolo.txt
    - echo "1 colher de sopa de fermento" > bolo.txt
  artifacts:
    #tudo o que estiver na pasta build será preservado
    paths:
      - build/
#Job para testar se todos os ingredientes foram especificados
verificar lista de ingredientes:
…
```

O Job `verificar lista de ingredientes` continua igual ao do bloco anterior.

Clique uma vez mais em **Commit**, **Commit to main branch** e **Commit**. Clique no ícone de Pipelines (canto superior direito de novo) e no número do Pipeline para visualizar o resultado. Como a figura a seguir mostra, a execução do segundo Stage falhou de novo.

![Página do pipeline com status failed: Obter_ingredientes com sucesso e verificar lista de ingredientes com falha, destacado](img/fig-2-21.webp)

*Figura 2.21: o segundo Stage falhou de novo.*

## Trocando o operador > pelo >>
Duration: 8:00

Clique sobre seu nome para verificar o motivo. Observe, na figura a seguir, que o causador do erro agora foi o comando `grep`.

![Log do Job mostrando o download dos artefatos, o test -f bem-sucedido e a falha em grep "farinha de trigo" $NOME_ARQ com exit code 1](img/fig-2-22.webp)

*Figura 2.22: agora o erro foi causado pelo grep.*

Por que isso aconteceu? O comando `grep` tentou buscar o texto "farinha de trigo" no arquivo `bolo.txt` e, como ele devolveu algo diferente de 0 (1, neste caso), isso quer dizer que ele não encontrou. O comando `cat` permite verificar o conteúdo do arquivo. Faça o ajuste do bloco de código a seguir e verifique o resultado.

**.gitlab-ci.yml · Bloco de Código 2.5**

```yaml
#definimos os Stages e a sua ordem de execução assim
stages:
  - obter_ingredientes
  - verificar_ingredientes

#nome do Job
obter ingredientes do bolo:
  …

#Job para testar se todos os ingredientes foram especificados
verificar lista de ingredientes:
  #esse Job pertence a esse Stage
  stage: verificar_ingredientes
  script:
    #variável temporária do terminal para guardar o nome do arquivo
    - NOME_ARQ=bolo.txt
    #vejamos o que há no arquivo
    - cat build/$NOME_ARQ
    #test realiza testes em geral envolvendo arquivos
    #aqui, estamos verificando a sua existência
    - test -f build/$NOME_ARQ
    - cd build
    - grep "farinha de trigo" $NOME_ARQ
    - grep "açúcar" $NOME_ARQ
    - grep "manteiga" $NOME_ARQ
    - grep "ovos" $NOME_ARQ
    - grep "leite" $NOME_ARQ
    - grep "fermento" $NOME_ARQ
```

Feita a edição, lembre-se de clicar em **Commit**, **Commit to main branch** e **Commit**. Clique no ícone de Pipelines no canto superior direito e, então, no número do Pipeline. Na tela resultante, aguarde a execução dos dois Stages e clique no Stage `verificar_ingredientes` que, obviamente, continua falhando. O resultado esperado aparece na figura a seguir.

![Log do Job em que cat build/$NOME_ARQ mostra apenas a linha "1 colher de sopa de fermento", seguido de test, cd build e da falha em grep "farinha de trigo"](img/fig-2-23.webp)

*Figura 2.23: o cat mostra apenas a última linha do arquivo.*

Observe que o comando `cat` mostrou apenas a última linha do arquivo. Na verdade, ela é a única linha existente nele, pois o operador de redirecionamento `>` tem como característica **sobrescrever** o arquivo sobre o qual opera. Como desejamos manter o conteúdo existente a cada novo redirecionamento, devemos utilizar o operador `>>`. Assim, faça o ajuste do bloco de código a seguir.

**.gitlab-ci.yml · Bloco de Código 2.6**

```yaml
---
#definimos os Stages e a sua ordem de execução assim
stages:
  - obter_ingredientes
  - verificar_ingredientes

#nome do Job
obter ingredientes do bolo:
  #esse Job pertence a esse Stage
  stage: obter_ingredientes
  #dois espaços e, então, a palavra scripts
  script:
    #dois espaços de novo
    #utilizaremos comandos tipicamente utilizados em terminais Unix
    #uma pasta para fazer o bolo
    - mkdir build
    - cd build
    - touch bolo.txt #touch cria um arquivo
    #echo exibe texto na saída padrão
    # >> direciona para o arquivo especificado, mantendo eventual conteúdo prévio
    - echo "2 xícaras de farinha de trigo" >> bolo.txt
    - echo "2 xícaras de açúcar" >> bolo.txt
    - echo "2 colheres de manteiga" >> bolo.txt
    - echo "3 ovos" >> bolo.txt
    - echo "1 xícara de leite" >> bolo.txt
    - echo "1 colher de sopa de fermento" >> bolo.txt
  artifacts:
    #tudo o que estiver na pasta build será preservado
    paths:
      - build/

#Job para testar se todos os ingredientes foram especificados
verificar lista de ingredientes:
  #esse Job pertence a esse Stage
  stage: verificar_ingredientes
  script:
    #variável temporária do terminal para guardar o nome do arquivo
    - NOME_ARQ=bolo.txt
    #remova também o cat, ele não será necessário
    #- cat build/$NOME_ARQ
    #test realiza testes em geral envolvendo arquivos
    #aqui, estamos verificando a sua existência
    - test -f build/$NOME_ARQ
    - cd build
    - grep "farinha de trigo" $NOME_ARQ
    - grep "açúcar" $NOME_ARQ
    - grep "manteiga" $NOME_ARQ
    - grep "ovos" $NOME_ARQ
    - grep "leite" $NOME_ARQ
    - grep "fermento" $NOME_ARQ
```

Clique **Commit**, **Commit to main branch** e **Commit**. Clique no ícone de Pipelines no canto superior direito e no número do Pipeline. Veja o resultado esperado na figura a seguir.

![Página do pipeline com status passed e os Jobs obter ingredientes do bolo e verificar lista de ingredientes com sucesso, destacados](img/fig-2-24.webp)

*Figura 2.24: ambos os Stages executaram com sucesso.*

Observe que ambos os Stages executaram com sucesso. Clique em cada um deles para ver o histórico de comandos executados.

<aside class="positive">

**Nota.** Caso deseje visualizar todas as suas execuções de Pipeline, você pode clicar no identificador do projeto (canto superior esquerdo) e escolher a opção **CI/CD >> Pipelines**. Veja a figura a seguir.

</aside>

![Lista de todas as execuções de pipeline do projeto, com status passed e failed, acessada pelo menu CI/CD > Pipelines destacado](img/fig-2-25.webp)

*Figura 2.25: todas as execuções de Pipeline em CI/CD >> Pipelines.*

## Exercícios
Duration: 15:00

Crie um Stage chamado `preparar_bolo` que

* Executa logo após a verificação dos ingredientes
* Produz um arquivo chamado `bolo_pronto.txt` com o seguinte conteúdo:
  * Misturando…
  * Cada ingrediente existente no arquivo `bolo.txt`, necessariamente obtido dele, incluindo as quantidades
  * Assando…
  * Bolo pronto!

Evidentemente, o novo Stage somente pode executar após o término dos demais.

<details><summary>Ver resposta</summary>

Veja uma possível solução no bloco de código a seguir.

**.gitlab-ci.yml · Bloco de Código 2.1 (solução)**

```yaml
#Comentários YAML começam com #
#OBS: Não há comentários de múltiplas linhas
#3 hífens indicam o início do documento YAML
#na verdade, são opcionais
# podem ser usados diversas vezes para especificar diretivas
---
#definimos os Stages e a sua ordem de execução assim
stages:
  - obter_ingredientes
  - verificar_ingredientes
  #novo Stage, nesta ordem
  - preparar_bolo

#novo Job
preparar o bolo:
  stage: preparar_bolo
  script:
    - ARQ_IN=bolo.txt
    - ARQ_OUT=bolo_pronto.txt
    - DIR=build
    - test $DIR/$ARQ_IN
    - cd $DIR
    - touch $ARQ_OUT
    - echo >> "Misturando..."
    - cat $ARQ_IN >> $ARQ_OUT
    - echo >> "Assando..."
    - echo >> "Bolo pronto!"

#nome do Job
obter ingredientes do bolo:
  #esse Job pertence a esse Stage
  stage: obter_ingredientes
  #dois espaços e, então, a palavra scripts
  script:
    #dois espaços de novo
    #utilizaremos comandos tipicamente utilizados em terminais Unix
    #uma pasta para fazer o bolo
    - mkdir build
    - cd build
    - touch bolo.txt #touch cria um arquivo
    #echo exibe texto na saída padrão
    # >> direciona para o arquivo especificado, mantendo eventual conteúdo prévio
    - echo "2 xícaras de farinha de trigo" >> bolo.txt
    - echo "2 xícaras de açúcar" >> bolo.txt
    - echo "2 colheres de manteiga" >> bolo.txt
    - echo "3 ovos" >> bolo.txt
    - echo "1 xícara de leite" >> bolo.txt
    - echo "1 colher de sopa de fermento" >> bolo.txt
  artifacts:
    #tudo o que estiver na pasta build será preservado
    paths:
      - build/

#Job para testar se todos os ingredientes foram especificados
verificar lista de ingredientes:
  #esse Job pertence a esse Stage
  stage: verificar_ingredientes
  script:
    #variável temporária do terminal para guardar o nome do arquivo
    - NOME_ARQ=bolo.txt
    #remova também o cat, ele não será necessário
    #- cat build/$NOME_ARQ
    #test realiza testes em geral envolvendo arquivos
    #aqui, estamos verificando a sua existência
    - test -f build/$NOME_ARQ
    - cd build
    - grep "farinha de trigo" $NOME_ARQ
    - grep "açúcar" $NOME_ARQ
    - grep "manteiga" $NOME_ARQ
    - grep "ovos" $NOME_ARQ
    - grep "leite" $NOME_ARQ
    - grep "fermento" $NOME_ARQ
```

<aside class="negative">

**Atenção ao redirecionamento.** Na solução original, as linhas `echo >> "Misturando..."`, `echo >> "Assando..."` e `echo >> "Bolo pronto!"` redirecionam uma linha vazia para arquivos chamados `Misturando...`, `Assando...` e `Bolo pronto!`, em vez de gravar o texto em `bolo_pronto.txt`. Para que o texto vá para o arquivo, use a forma `echo "Misturando..." >> $ARQ_OUT` (e o mesmo para as outras duas). Da mesma forma, `test -f $DIR/$ARQ_IN` verifica de fato a existência do arquivo.

</aside>

Clique em **CI/CD >> Pipelines** no menu à esquerda. O resultado esperado aparece na figura a seguir.

![Página do pipeline com status passed e três stages com sucesso: obter ingredientes do bolo, verificar lista de ingredientes e preparar o bolo](img/sol-2-1.webp)

*Figura 2.1 (solução): os três Stages executados com sucesso.*

Para verificar a existência do arquivo final e seu conteúdo, clique em **CI/CD >> Pipelines** e no símbolo de "três pontinhos" do Pipeline executado mais recentemente, como na figura a seguir. Observe que é possível fazer o download de diversos arquivos, cada um refletindo um estado no tempo em que a pasta `build` se encontrava, de acordo com a especificação dos Jobs.

![Lista de pipelines com o menu de três pontinhos do pipeline mais recente aberto, mostrando os artefatos disponíveis para download](img/sol-2-2.webp)

*Figura 2.2 (solução): download dos artefatos do pipeline.*

</details>

## Parabéns!
Duration: 2:00

Você criou seu primeiro pipeline no GitLab CI/CD. Ao longo do caminho, você:

* Criou um projeto e editou o `.gitlab-ci.yml` na Web IDE
* Viu que Jobs executam em paralelo por padrão e usou **Stages** para ordená-los
* Usou **artefatos** para preservar a pasta `build` entre Jobs
* Leu os logs dos Jobs para descobrir a causa de cada falha

### Referências

* GitLab: [https://gitlab.com/](https://gitlab.com/)
* YAML: [https://yaml.org/](https://yaml.org/)
* YAML para iniciantes: [https://www.redhat.com/sysadmin/yaml-beginners](https://www.redhat.com/sysadmin/yaml-beginners)
