summary: Entenda como o Git faz controle de versão (commits, HEAD, branches, tags e remotes) e pratique construindo uma calculadora em Python, versão a versão, até publicá-la com tags no GitLab.
id: git-python-introducao
categories: Git,Python
tags: git,python,controle de versao,commit,tag,branch,head,remote,push,gitlab,vs code
status: Published
authors: Rodrigo Bossini
last updated: 2023-04-25
pdf: git/01_apostila_git_com_python_introducao.pdf
exercicios: git/01_exercicios_git_com_python_introducao.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Git com Python: introdução

## Visão geral
Duration: 3:00

Neste material, estudaremos as principais funcionalidades oferecidas pelo sistema de controle de versão chamado **"Git"**. Para tal, construiremos um sistema simples utilizando a linguagem de programação **Python**.

### O que você vai aprender

* Por que o controle de versão manual de documentos não escala
* Como o Git registra versões em um repositório (a pasta `.git`) por meio de commits
* O que são o ponteiro **HEAD**, as **branches** e as **tags**
* O que são repositórios remotos e a operação **push**
* Os estados de um arquivo: untracked, unmodified, modified e staged
* Comandos `init`, `config`, `status`, `add`, `commit`, `log`, `diff`, `tag`, `show`, `remote`, `branch` e `push`
* Como enviar commits e tags para o GitLab usando um token de acesso

### O que você vai precisar

* Git e Python instalados
* O VS Code
* Uma conta no GitLab ([https://gitlab.com/](https://gitlab.com/))

## Intuição: controle de versão manual
Duration: 5:00

Considere que você está escrevendo um documento como uma dissertação de mestrado, uma tese de doutorado, um programa de computador ou mesmo uma notícia. Estes são alguns exemplos de documentos cuja elaboração pode levar alguns dias ou meses e cujo conteúdo evolui ao longo do tempo.

Após criar uma primeira versão do documento, para que possa continuar trabalhando nele posteriormente, você vai, obviamente, armazená-lo em meio persistente. Veja a figura a seguir.

![Um documento com algumas linhas de texto em azul](img/fig-2-1-1.webp)

*Figura 2.1.1: a primeira versão do documento.*

Depois disso, num próximo dia de trabalho, você edita o arquivo um pouco mais, obtendo o resultado exibido pela figura a seguir.

![O mesmo documento com linhas em azul e novas linhas em vermelho](img/fig-2-1-2.webp)

*Figura 2.1.2: o documento após o segundo dia de trabalho.*

No próximo dia de trabalho, você deseja fazer algumas correções no conteúdo já existente. Você abre o arquivo, trabalha nele e depois armazena as alterações em meio persistente. Veja a figura a seguir.

![O documento com linhas azuis, vermelhas e trechos alterados em amarelo](img/fig-2-1-3.webp)

*Figura 2.1.3: correções no conteúdo existente.*

No próximo dia, você percebe que partes do conteúdo removido são desejáveis novamente. Como você já armazenou as alterações e fechou o editor de texto, elas não podem ser mais recuperadas. Veja a figura a seguir.

![O documento com um trecho vazio destacado e a anotação: o conteúdo que existia aqui previamente é necessário, mas ele foi perdido](img/fig-2-1-4.webp)

*Figura 2.1.4: o conteúdo removido foi perdido.*

A partir deste momento, você decide fazer uma espécie de **controle de versão manual**. No final de cada dia de trabalho, você armazena todo o conteúdo em um novo arquivo, mantendo todos os outros criados previamente. Assim, se necessário, você pode recuperar conteúdo antigo. Veja a figura a seguir.

![Quatro cópias do documento, v1, v2, v3 e v4, com a anotação: agora o conteúdo pode ser facilmente recuperado de uma versão antiga](img/fig-2-1-5.webp)

*Figura 2.1.5: uma cópia do arquivo para cada versão.*

Embora funcione, ao longo do tempo, este controle de versão manual pode ser um tanto difícil de manter. Especialmente se muitas pessoas forem trabalhar simultaneamente com o arquivo. Veja algumas dificuldades.

* mesclar conteúdo produzido por pessoas diferentes em uma única versão
* esquecer de criar uma nova versão do arquivo antes de editar conteúdo existente
* perder conteúdo ao sobrescrever um arquivo sem intenção

É aí que entram os **sistemas de controle de versão**. Há diversos deles. Para o desenvolvimento de software, o Git é o mais utilizado. Veja algumas das vantagens que sistemas de controle de versão como o Git oferecem.

* voltar arquivos para versões anteriores, recuperando conteúdo sem perder o atual
* comparar alterações realizadas ao longo do tempo
* verificar quem foi o responsável por uma alteração que pode estar causando algum problema
* recuperar arquivos "perdidos" (se o sistema for utilizado direitinho)

## Controle de versão com o Git
Duration: 6:00

O primeiro passo é criar uma pasta que servirá de abrigo para os arquivos de interesse. Ela conterá uma subpasta oculta chamada `.git`. Ela é o **repositório Git** e ali ficam registradas as informações sobre o controle de versão realizado pelo Git. Veja a figura a seguir.

![Uma pasta de trabalho contendo a subpasta .git, com a anotação: seus arquivos ficam nesta pasta; alterações feitas neles serão registradas no repositório Git](img/fig-2-2-1.webp)

*Figura 2.2.1: a pasta de trabalho e o repositório Git.*

A seguir, digamos que você crie um primeiro arquivo. Ao final do primeiro dia de trabalho, você torna as suas alterações permanentes, fazendo uma operação do Git denominada **commit**. Uma vez que o faça, você pode fazer novas edições no arquivo, sabendo que o conteúdo atual está armazenado no repositório Git e pode ser recuperado a qualquer momento. Veja a figura a seguir.

![A pasta de trabalho com o documento e, dentro da pasta .git, uma cópia registrada da primeira versão](img/fig-2-2-2.webp)

*Figura 2.2.2: o primeiro commit.*

No segundo dia de trabalho, você faz novas edições no arquivo, tornando-as permanentes com mais uma operação commit. O seu diretório atual conterá somente o arquivo editado. Entretanto, o repositório Git conterá as duas versões. Observe como ele armazena um "ponteiro" para o conteúdo anterior, permitindo a navegação entre versões, se necessário. Veja a figura a seguir.

![A pasta de trabalho com a versão atual do documento e, na pasta .git, duas versões ligadas por uma seta da mais nova para a mais antiga](img/fig-2-2-3.webp)

*Figura 2.2.3: duas versões no repositório.*

Em mais um dia de trabalho, você faz as edições desejadas e as torna permanentes, fazendo um novo commit. O resultado é aquele exibido pela figura a seguir.

![A pasta .git com três versões encadeadas do documento](img/fig-2-2-4.webp)

*Figura 2.2.4: três versões no repositório.*

Agora, observe como o conteúdo mantido pelo Git em seu repositório torna simples a recuperação de conteúdos de versões antigas. Veja a figura a seguir.

![A pasta .git com quatro versões encadeadas do documento, todas recuperáveis](img/fig-2-2-5.webp)

*Figura 2.2.5: todas as versões ficam disponíveis no repositório.*

## HEAD, branches e tags
Duration: 5:00

### Branches e o ponteiro HEAD

Como o Git decide a versão do arquivo a ser mantida no diretório de trabalho? Há um ponteiro chamado **HEAD** que faz referência à versão atual. Veja a figura a seguir.

![A pasta .git com quatro versões encadeadas e o ponteiro HEAD apontando para a mais recente, que é a versão presente no diretório de trabalho](img/fig-2-3-1.webp)

*Figura 2.3.1: o ponteiro HEAD indica a versão presente no diretório de trabalho.*

Neste contexto, há também o conceito de **branch**. Uma branch também é um simples ponteiro que referencia um determinado "commit". Um único repositório Git pode possuir múltiplas branches e esse é um cenário muito comum no desenvolvimento de software. A figura a seguir mostra um cenário em que há duas branches: a principal (`main`) e uma outra, chamada `feature`. A ideia é ilustrar que, a partir de uma determinada versão, dois rumos diferentes podem ter sido seguidos, dando origem a versões diferentes do arquivo. Em algum momento no futuro, essas versões podem ser mescladas com a ajuda do Git.

![Histórico com as branches main e feature partindo de uma mesma versão, e HEAD apontando para main](img/fig-2-3-2.webp)

*Figura 2.3.2: as branches main e feature.*

### Tags

Ao longo do desenvolvimento, é natural que tenhamos uma versão final "entregável". Dependendo do tipo do projeto, é possível também que tenhamos entregas parciais. O Git oferece um mecanismo denominado **"tag"** que nos permite destacar um commit, mostrando que ele representa algo notável. Ou seja, é um mecanismo muito interessante para fazer a liberação de versões de interesse. Veja a figura a seguir. As versões com uma "estrela" foram marcadas com uma tag do Git, indicando que elas são importantes.

![Histórico com as branches main e feature em que duas versões estão marcadas com uma estrela, representando tags](img/fig-2-4-1.webp)

*Figura 2.4.1: versões marcadas com tags.*

## Repositórios remotos
Duration: 5:00

Observe que todo o controle de versão discutido até então é feito completamente localmente. O que ocorre se

* desejarmos compartilhar o repositório com outras pessoas, para que possam trabalhar simultaneamente?
* desejarmos fazer um backup de todo o controle de versão?

Em geral, utilizamos um **repositório remoto** para isso. Há diferentes provedores de computação em nuvem que oferecem o Git como serviço, viabilizando o backup, o compartilhamento e muito mais coisas, incluindo estruturas próprias para DevOps. Veja alguns exemplos:

* github.com
* gitlab.com
* bitbucket.org

A ideia é bastante simples. Criamos um repositório remoto e, utilizando comandos próprios do Git, fazemos "upload" do conteúdo de nosso repositório local. Esta é uma operação chamada **"push"**. Veja a figura a seguir.

![O repositório local enviando, com push, o seu histórico completo, incluindo branches e tags, para um repositório remoto](img/fig-2-5-1.webp)

*Figura 2.5.1: a operação push.*

Quando criamos um repositório remoto, ele tem um link de acesso. Claro, precisamos desse link para fazer as operações de upload (push). Ocorre que seria muito pouco prático ter de digitar o link todas as vezes que fôssemos fazer um push. É possível armazenar o link de um repositório remoto associado a um simples nome no repositório local e, a partir daí, usar apenas o nome escolhido no momento de fazer push. Veja a figura a seguir.

![Repositório remoto com o link https://gitlab.com/usuario/nome_do_repo.git e o repositório local, que guarda o mesmo link associado ao nome origin; o push envia o histórico do local para o remoto](img/fig-2-5-2.webp)

*Figura 2.5.2: o link do repositório remoto fica armazenado no repositório local, associado a um nome que escolhemos. Aqui, usamos "origin", mas pode ser qualquer outro nome.*

<aside class="positive">

**Nota.** O nome **origin** vem de "originally". A ideia é que podemos fazer o clone de um repositório remoto criando uma cópia local e o nome indica que ela foi "originalmente" clonada de tal repositório. Seu uso é bastante comum. Mas você pode usar qualquer outro, como "gitlab", "github" etc.

</aside>

O Git é um sistema de controle de versão muito poderoso e ele oferece inúmeras outras funcionalidades que estão fora do escopo deste documento.

## Preparando o projeto Python
Duration: 10:00

Neste exemplo, vamos implementar um programa em Python bastante simples. A ideia é a seguinte:

* O programa implementa as funcionalidades básicas de uma calculadora
* As versões que desejamos tornar permanentes são as seguintes. Observe o destaque naquelas que serão marcadas como especiais por serem entregáveis.
  * aquela que faz apenas a soma
  * aquela que testa a operação soma (**entregável**)
  * aquela que faz soma e subtração
  * aquela que testa as operações soma e subtração (**entregável**)
  * aquela que faz soma, subtração e multiplicação
  * aquela que testa as operações soma, subtração e multiplicação (**entregável**)
  * aquela que faz soma, subtração, multiplicação e divisão
  * aquela que testa as quatro operações (**entregável**)

### Novo diretório, vínculo com o VS Code e terminal interno

Comece criando um novo diretório. É importante que ele seja criado visando evitar os mecanismos de segurança do sistema operacional. Por isso, caso esteja usando o Windows, uma boa ideia pode ser utilizar o diretório Documents do usuário logado atualmente. Pode ser algo assim:

```text
C:\Users\usuario\Documents\dev\introducao_git
```

Em sistemas Unix-like, você pode criar algo assim:

```text
/home/usuario/dev/introducao_git
```

Uma vez que tenha criado o seu diretório, abra o VS Code e clique em **File >> Open Folder**. Navegue no sistema de arquivos e vincule o VS Code ao diretório. Veja as figuras a seguir.

![Menu File do VS Code com a opção Open Folder destacada](img/fig-2-6-1.webp)

*Figura 2.6.1: File >> Open Folder.*

![Explorer do VS Code exibindo a pasta INTRODUCAO_GIT](img/fig-2-6-2.webp)

*Figura 2.6.2: a pasta aberta no VS Code.*

Observe como o nome da pasta deve aparecer no Explorer do VS Code. A seguir, clique **Terminal >> New Terminal**, como na figura a seguir. Isso abrirá um terminal interno no VS Code, facilitando nossos trabalhos.

![Menu Terminal do VS Code com a opção New Terminal destacada](img/fig-2-6-3.webp)

*Figura 2.6.3: abrindo um terminal interno.*

### Criação do repositório Git (a pasta .git)

A criação do repositório é bastante simples. No terminal, use

**Terminal**

```bash
git init
```

### Algumas configurações Git

Tudo aquilo que fazemos no Git deve ser identificado. Em geral, é preciso informar, pelo menos, o nome e o e-mail do responsável pela operação. Isso pode ser feito da seguinte forma

**Terminal**

```bash
git config --local user.name "Rodrigo Bossini"
git config --local user.email professorbossini@gmail.com
```

No futuro, quando fizermos nossos "commits" veremos que será necessário associar uma mensagem a cada um deles: um pequeno pedaço de texto que descreve a razão de ser daquele commit. Isso pode ser feito com qualquer editor de texto e utilizar o próprio VS Code é bastante simples. Para isso, vamos configurar o Git para utilizá-lo na edição de mensagens de commit.

**Terminal**

```bash
git config --global core.editor "code --wait"
```

<aside class="positive">

**Nota.** `code` é o comando para abrir uma aba do VS Code. O parâmetro `wait` indica que é preciso "esperar" até que o arquivo seja fechado para que o commit seja confirmado.

</aside>

Quando fizermos nosso primeiro commit, criaremos também a nossa primeira branch. Toda branch tem um nome que podemos escolher. Há também um nome padrão, caso não escolhamos um. Historicamente, o nome `master` costumava ser utilizado. Entretanto, há uma iniciativa que sugere que o termo não seja mais utilizado, dando espaço para um nome mais inclusivo, evitando inclusive expressões comuns na computação como "master/slave". Por isso, vamos configurar o Git para que ele use o nome `main` como padrão para as novas branches.

**Terminal**

```bash
git config --global init.defaultBranch main
```

Se desejar visualizar as configurações realizadas, use

**Terminal**

```bash
git config --list
```

ou ainda

**Terminal**

```bash
git config --list --show-origin
```

## Estados de um arquivo
Duration: 4:00

Cada arquivo sob controle de versão tem o seu **"estado"**. Para entender os comandos que utilizaremos a seguir, precisamos entendê-los. Veja a figura a seguir.

![Diagrama dos estados Untracked e, dentro de Tracked, Unmodified, Modified e Staged: comando add leva de Untracked e de Modified para Staged; editar o arquivo leva de Unmodified para Modified; comando commit leva de Staged para Unmodified; comando rm leva de Unmodified para Untracked](img/fig-2-7-1.webp)

*Figura 2.7.1: os estados de um arquivo e os comandos que os alteram.*

* **Untracked**: arquivos neste estado se encontram no diretório de trabalho porém não estão sob controle de versão.
* **Tracked**: arquivos neste estado estão sob controle de versão. Observe que há três subestados deste.
  * **Unmodified**: a versão presente no diretório de trabalho é igual à última que foi tornada permanente.
  * **Modified**: a versão presente no diretório de trabalho está editada em relação à última que foi tornada permanente.
  * **Staged**: arquivos neste estado estão prontos para participar do próximo commit. Somente arquivos neste estado são tornados permanentes quando um comando commit é executado.

## Calculadora: a operação de soma
Duration: 8:00

No VS Code, crie um arquivo chamado `calculadora.py`. O código a seguir mostra a definição de uma função que faz a soma de dois valores recebidos como parâmetro.

**calculadora.py · Código 2.7.1**

```python
def somar (a, b):
    return a + b
```

Observe que esta é a primeira versão a ser tornada permanente. Se desejar saber o estado do arquivo atual, use

**Terminal**

```bash
git status
```

Também é possível verificar o estado do arquivo obtendo uma mensagem mais enxuta ou curta (*short*, daí a letra s)

**Terminal**

```bash
git status -s
```

Agora precisamos fazer com que o arquivo passe a fazer parte do sistema de controle de versão.

**Terminal**

```bash
git add calculadora.py
```

A seguir, consulte o seu estado novamente.

**Terminal**

```bash
git status -s
```

Observe que ele está "Staged". Torne esta primeira versão permanente com

**Terminal**

```bash
git commit
```

Você deverá ver uma aba do VS Code em que poderá digitar uma mensagem que descreve a razão de ser deste commit. Use algo como

```text
apostila02(git-python): funcao somar implementada
```

<aside class="positive">

**Nota.** Estamos utilizando uma convenção para a escrita de mensagens que descrevem commits. Leia mais sobre ela em [https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit) (Link 2.7.1).

</aside>

A seguir, salve o arquivo (ou clique **File >> Auto Save**) e feche a aba. Pronto, seu primeiro commit foi realizado!

Se perguntar sobre o estado novamente, você verá que o diretório de trabalho está "limpo". Ou seja, não há mudanças que ainda não tenham sido tornadas permanentes.

**Terminal**

```bash
git status -s
```

Se desejar, você pode visualizar a sua lista de commits.

**Terminal**

```bash
git log
```

Se desejar ver o código contido (*patch*) em cada commit, use

**Terminal**

```bash
git log -p
```

Teste também

**Terminal**

```bash
git log --pretty=oneline
```

Visite [https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History](https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History) (Link 2.7.2) para ver mais opções do comando `git log`.

## Teste da soma, subtração e tags
Duration: 12:00

Crie outro arquivo chamado `teste_calculadora.py`. Veja seu conteúdo inicial a seguir.

**teste_calculadora.py · Código 2.8.1**

```python
import calculadora
print (calculadora.somar(1, 2))
```

Verifique o estado dos arquivos novamente

**Terminal**

```bash
git status -s
```

Observe que cada arquivo tem o seu próprio estado.

Neste momento, seria interessante fazer um novo commit e torná-lo especial, marcando-o com uma tag. Entretanto, suponha que esqueçamos de fazê-lo e passemos a implementar a operação de subtração, no arquivo `calculadora.py`, como no código a seguir.

**calculadora.py · Código 2.8.2**

```python
def somar (a, b):
    return a + b

def subtrair(a, b):
    return a - b
```

Verifique o estado de cada arquivo.

**Terminal**

```bash
git status -s
```

Observe que cada um tem o seu próprio estado. Como desejamos tornar permanente apenas o arquivo `teste_calculadora.py`, vamos transportá-lo para o estado staged.

**Terminal**

```bash
git add teste_calculadora.py
```

Verifique o estado novamente.

**Terminal**

```bash
git status -s
```

Agora podemos fazer um novo commit.

**Terminal**

```bash
git commit
```

Use a seguinte mensagem.

```text
apostila02(git-python): teste da funcao somar
```

Observe que agora apenas o arquivo `calculadora.py` está modificado. Verifique seu conteúdo modificado com

**Terminal**

```bash
git diff
```

Veja que ele já possui a implementação da operação de subtração. Entretanto, antes de torná-lo permanente, vamos marcar o commit atual como importante, aplicando-lhe uma tag.

**Terminal**

```bash
git tag -a v1.0.0 -m "operação de somar implementada e testada"
```

<aside class="positive">

**Nota.** No Git, as tags podem ser **leves** ou **anotadas**. Uma tag leve é apenas um ponteiro temporário para algum commit. Uma tag anotada serve para destacar um commit como especial e ela inclui o nome do autor, uma mensagem, data etc. Leia mais em [https://git-scm.com/book/en/v2/Git-Basics-Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging) (Link 2.8.1).

</aside>

Visualize a tag criada com

**Terminal**

```bash
git tag --list
```

e também

**Terminal**

```bash
git show v1.0.0
```

Verifique uma vez mais o estado dos arquivos.

**Terminal**

```bash
git status -s
```

Observe que agora podemos tornar permanente a nova versão do arquivo `calculadora.py`. Se desejarmos, podemos "ignorar" o estado Staged se ele não for necessário. Veja.

**Terminal**

```bash
git commit -a
```

Use a mensagem

```text
apostila02(git-python): funcao subtrair implementada
```

Agora podemos implementar o teste da operação subtrair, tornar esta nova versão permanente e destacá-la com uma tag. Comece adicionando o teste, como no código a seguir.

**teste_calculadora.py · Código 2.8.3**

```python
import calculadora
print (calculadora.somar(1, 2))
print (calculadora.subtrair(1, 2))
```

Torne esta versão permanente e destaque-a como importante com

**Terminal**

```bash
git add teste_calculadora.py
git commit -m "apostila02(git-python): teste da funcao subtrair"
git tag -a v1.0.1 -m "operação de subtrair implementada e testada"
```

Visualize as suas tags.

**Terminal**

```bash
git tag
git show v1.0.0
git show v1.0.1
```

## Multiplicação e divisão
Duration: 10:00

### Operação de multiplicação e teste

Comecemos pelo arquivo `calculadora.py`, implementando a operação de multiplicação, como no código a seguir.

**calculadora.py · Código 2.9.1**

```python
def somar (a, b):
    return a + b

def subtrair(a, b):
    return a - b

def multiplicar(a, b):
    return a * b
```

A seguir, implemente o teste no arquivo `teste_calculadora.py`, como no código a seguir.

**teste_calculadora.py · Código 2.9.2**

```python
import calculadora
print (calculadora.somar(1, 2))
print (calculadora.subtrair(1, 2))
print (calculadora.multiplicar(1, 2))
```

Observe que desejamos dois commits. O primeiro deve incluir apenas a implementação da operação de multiplicação. O segundo deve incluir o teste. Por isso, vamos usar o estado Staged.

Leve o arquivo `calculadora.py` ao estado Staged com

**Terminal**

```bash
git add calculadora.py
```

E torne esta versão permanente.

**Terminal**

```bash
git commit -m "apostila02(git-python): funcao multiplicar implementada"
```

A seguir, leve o arquivo `teste_calculadora.py` ao estado Staged com

**Terminal**

```bash
git add teste_calculadora.py
```

E torne esta versão permanente.

**Terminal**

```bash
git commit -m "apostila02(git-python): teste da funcao multiplicar"
```

Além disso, torne esta versão especial com uma nova tag.

**Terminal**

```bash
git tag -a v1.0.2 -m "operação de multiplicar implementada e testada"
```

Visualize seus commits.

**Terminal**

```bash
git log --pretty=oneline
```

E as suas tags.

**Terminal**

```bash
git tag
git show v1.0.0
git show v1.0.1
git show v1.0.2
```

Verifique também o estado dos arquivos. Eles deverão estar todos "unmodified".

**Terminal**

```bash
git status -s
```

### Operação de divisão e teste

Repetiremos os passos para implementar a divisão e seu respectivo teste. Ajuste o arquivo `calculadora.py` como no código a seguir.

**calculadora.py · Código 2.10.1**

```python
def somar (a, b):
    return a + b

def subtrair(a, b):
    return a - b

def multiplicar(a, b):
    return a * b

def dividir (a, b):
    return a / b
```

Torne esta versão permanente com

**Terminal**

```bash
git commit -a
```

E a mensagem de commit

```text
apostila02(git-python): funcao dividir implementada
```

Agora, implemente o teste, como no código a seguir. Estamos no arquivo `teste_calculadora.py`.

**teste_calculadora.py · Código 2.10.2**

```python
import calculadora
print (calculadora.somar(1, 2))
print (calculadora.subtrair(1, 2))
print (calculadora.multiplicar(1, 2))
print (calculadora.dividir(1, 2))
```

Torne esta versão permanente com

**Terminal**

```bash
git commit -a -m "apostila02(git-python): teste da funcao dividir"
```

E não deixe de marcá-la como importante.

**Terminal**

```bash
git tag -a v1.0.3 -m "operação de dividir implementada e testada"
```

## Repositório remoto no GitLab
Duration: 15:00

O próximo passo consiste em criar um repositório remoto e fazer "upload" de nosso repositório local. Comece visitando [https://gitlab.com/](https://gitlab.com/) (Link 2.11.1) e crie uma conta GitLab caso ainda não possua uma.

Na página inicial, clique em **New Project**. A seguir, clique em **Create blank Project**.

<aside class="positive">

**Nota.** Um projeto no GitLab é uma coleção de recursos, incluindo

* um repositório
* configuração de CI/CD
* issues
* colaboradores

entre outras coisas.

</aside>

A seguir, escolha um nome para o seu repositório. Marque-o como público e desmarque as caixinhas para que ele nasça sem conteúdo algum. A seguir, clique em **Create Project**. Veja a figura a seguir.

![Formulário Create blank project com o nome do projeto, a visibilidade pública e as opções de configuração do projeto desmarcadas](img/fig-2-11-1.webp)

*Figura 2.11.1: criando o projeto vazio.*

Na tela seguinte, clique em **Clone >> Clone with HTTPS**, como na figura a seguir. Observe que não estamos clonando coisa alguma. Estamos apenas obtendo o link do repositório remoto para que ele possa ser adicionado ao repositório local.

![Página do projeto vazio com o menu Clone aberto e o botão de copiar do link Clone with HTTPS destacado](img/fig-2-11-2.webp)

*Figura 2.11.2: copiando o link HTTPS.*

### Token de acesso

Uma vez que tenha copiado o link, volte ao VS Code e cole-o em um arquivo temporário. Vamos voltar ao GitLab para gerar um **token de autenticação**, assim não será necessário digitar as credenciais para login a cada acesso.

Na página principal do GitLab, clique no seu avatar no canto superior direito e então clique em **Preferences**.

![Menu do avatar do GitLab com a opção Preferences](img/fig-2-11-3.webp)

*Figura 2.11.3: Preferences.*

A seguir, à esquerda, clique em **Access Tokens**.

![Menu User Settings do GitLab com a opção Access Tokens destacada](img/fig-2-11-4.webp)

*Figura 2.11.4: Access Tokens.*

Dê uma descrição para o seu token, escolha uma data de expiração e marque os escopos **read_repository** e **write_repository**, como na figura a seguir. A seguir, clique em **Create personal access token**.

![Formulário Add a personal access token com nome, data de expiração e os escopos read_repository e write_repository marcados](img/fig-2-11-5.webp)

*Figura 2.11.5: criando o token.*

Na tela seguinte, você deverá ser capaz de ver o seu token. Porém, ele ainda está oculto. Clique no botão destacado pela figura a seguir para visualizá-lo.

![Mensagem Your new personal access token has been created, com o token oculto e o botão de exibir destacado](img/fig-2-11-6.webp)

*Figura 2.11.6: exibindo o token.*

<aside class="negative">

Você deve copiar seu token agora. Se atualizar ou fechar a página, não poderá vê-lo novamente. Se isso acontecer, você precisará criar outro token.

</aside>

Uma vez que tenha copiado seu token, volte ao VS Code para montar a URL, incluindo o token. O formato padrão é assim:

```text
https://oauth:token@gitlab.com/usuario/repositorio.git/
```

Veja um exemplo completo, com um repositório válido (o token aparece aqui substituído por `glpat-xxxxxxxxxxxxxxxxxxxx`; use o seu):

```text
https://oauth:glpat-xxxxxxxxxxxxxxxxxxxx@gitlab.com/professorbossini/20231_pessoal_maua_vgti_tutorial_git_python.git/
```

### Adicionando o remote e fazendo push

Depois de montar o seu link com o token, adicione-o ao repositório local com

**Terminal**

```bash
git remote add origin https://oauth:glpat-xxxxxxxxxxxxxxxxxxxx@gitlab.com/professorbossini/20231_pessoal_maua_vgti_tutorial_git_python.git/
```

Aproveite e feche a aba temporária que você havia aberto no VS Code apenas para montar o link.

Agora já podemos fazer um push. Para tal, precisamos dizer o destino (o nome associado ao link do repositório remoto) e o objeto que será enviado (a branch `main`, neste caso). Se desejar, você pode verificar o nome do remote com

**Terminal**

```bash
git remote
```

ou

**Terminal**

```bash
git remote -v
```

para ver o link também. E para ver o nome da branch, use

**Terminal**

```bash
git branch
```

Para fazer o push, use

**Terminal**

```bash
git push origin main
```

<aside class="negative">

Observe que o seu token fica armazenado no seu repositório local e qualquer pessoa que tiver acesso a ele poderá visualizá-lo. Se desejar, você pode remover o endereço de seu remote, incluindo o token, com

```bash
git remote remove origin
```

Certifique-se de que ele foi removido com `git remote -v`.

</aside>

### Enviando as tags

No site do GitLab, visite a página do seu projeto. Se não conseguir encontrar, use os atalhos destacados na figura a seguir. Vasculhe a lista de projetos a fim de encontrar o seu.

![Menu principal do GitLab com Projects e o link View all projects destacados](img/fig-2-11-7.webp)

*Figura 2.11.7: encontrando o projeto.*

Observe que os commits estão por lá. No entanto, as tags ainda não. Veja a figura a seguir.

![Página do projeto no GitLab com os arquivos calculadora.py e teste_calculadora.py e o contador de tags em 0 destacado](img/fig-2-11-8.webp)

*Figura 2.11.8: os commits chegaram, as tags ainda não.*

Faça o push da primeira tag com

**Terminal**

```bash
git push origin v1.0.0
```

Verifique, no site do GitLab, se a tag foi mesmo enviada, como na figura a seguir. Não esqueça de atualizar a página no navegador.

![Página do projeto com o contador de tags em 1](img/fig-2-11-9.webp)

*Figura 2.11.9: a primeira tag no GitLab.*

Você também pode enviar todas as tags de uma vez com

**Terminal**

```bash
git push origin --tags
```

Visite mais uma vez a página de seu repositório remoto e veja se todas as tags estão por lá, como na figura a seguir. Não esqueça de atualizar a página.

![Página do projeto com o contador de tags em 4](img/fig-2-11-10.webp)

*Figura 2.11.10: todas as tags no GitLab.*

## Exercícios
Duration: 25:00

1. Adicione um arquivo chamado `README.md` à raiz de seu repositório. Nele, escreva o(s) nome(s) completo(s) (sem abreviações) e RA(s) do(s) integrante(s). A extensão `md` vem de "markdown". Se desejar conhecer mais, visite [https://about.gitlab.com/handbook/markdown-guide/](https://about.gitlab.com/handbook/markdown-guide/) (Link 1.1.1). Faça um "commit" incluindo apenas o arquivo `README.md`.
2. Crie um arquivo chamado `menu.py`.
3. Implemente uma função chamada `menu` que ofereça as seguintes opções ao usuário:

   ```text
   1.Somar
   2.Subtrair
   3.Multiplicar
   4.Dividir
   0.Sair
   ```

   A cada opção implementada, faça um novo commit.
4. Ao final, chame a função `menu`, faça um "commit" e marque-o como "importante", utilizando uma tag.
5. Faça "push" de todos os commits e da tag.

## Encerramento
Duration: 2:00

Você usou o Git para versionar uma calculadora em Python, commit a commit, marcou as entregas com tags anotadas e publicou tudo no GitLab.

### Referências

[1] KIM, G.; HUMBLE, J.; DEBOIS, P.; WILLIS, J.; FORSGREN, N. *The DevOps Handbook: How to Create World-Class Agility, Reliability, & Security in Technology Organizations*. 2. ed. IT Revolution Press, 2021.

[2] CHACON, S.; STRAUB, B. *Pro Git*. 2. ed. Apress, 2014.

* Histórico de commits: [https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History](https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History)
* Tags: [https://git-scm.com/book/en/v2/Git-Basics-Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
