summary: Conheça o Django, crie um projeto e uma aplicação, escreva sua primeira view, organize as URLs com include e gere HTML com templates, variáveis e arquivos estáticos (imagens, CSS e JavaScript).
id: django-introducao-templates-static
categories: Django,Python
tags: django,python,venv,projeto,aplicacao,views,urls,templates,static,css,javascript
status: Published
authors: Rodrigo Bossini
last updated: 2023-09-11
pdf: django/01_apostila_python_django_introducao_projeto_aplicacao_template_static.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Django: introdução, projeto, aplicação, templates e arquivos estáticos

## Visão geral
Duration: 3:00

Neste material, estudaremos sobre Python e sobre o desenvolvimento com o arcabouço **Django**. Vamos desenvolver uma aplicação com Django que ilustra as suas principais funcionalidades: criação de projeto e aplicação, views, mapeamento de URLs, templates e arquivos estáticos.

### O que você vai aprender

* As principais características do Django e a arquitetura MTV
* A diferença entre projeto e aplicação Django
* Como criar um ambiente virtual Python e instalar o Django
* Como executar o servidor de desenvolvimento e aplicar as migrações padrão
* Como escrever uma view e mapeá-la a uma URL, inclusive com `include`
* Como gerar HTML com templates e variáveis de template
* Como servir imagens, CSS e JavaScript como arquivos estáticos

### O que você vai precisar

* Python 3 instalado
* VS Code
* Um navegador

## Conhecendo o Django
Duration: 10:00

A página oficial do Django pode ser encontrada em [https://www.djangoproject.com/](https://www.djangoproject.com/).

<aside class="positive">

**Nota.** Django possui uma filosofia conhecida como **"batteries-included"**. Como veremos a seguir, isso quer dizer que o arcabouço já inclui funcionalidades que muitas aplicações costumam precisar.

</aside>

Veja algumas de suas principais características.

**Criação de interface "admin" automática.** Em função de metadados incluídos em nosso código, Django cria uma interface gráfica que nos permite manipular conteúdo da aplicação graficamente.

**Mapeamento objeto relacional.** No que diz respeito ao desenvolvimento de aplicações, o principal paradigma utilizado é aquele baseado na orientação a objetos. Por outro lado, o modelo de dados mais utilizado para a persistência de dados ainda é, de longe, o modelo relacional. Ou seja, aquele baseado em tabelas. Uma aplicação desenvolvida utilizando OO precisa "explicar" como seus dados devem ser armazenados em tabelas. É aí que entra o conhecido Mapeamento Objeto Relacional (*Object Relational Mapping*, ORM, em inglês). Django inclui construções que trazem alto nível de abstração para resolver este problema.

**Arquitetura MTV (Model-Template-View).** A arquitetura MTV é muito semelhante ao padrão composto MVC (Model-View-Controller). Em Django,

* a camada de visualização (produção de HTML, JSON etc.) é implementada por **Templates** (T). Semelhante à camada View de uma arquitetura MVC.
* a camada de modelo (representação da base de dados) é implementada por classes de **modelo** (M).
* a forma como os dados são apresentados é decidida na camada **view** (V). Em geral, essa é uma camada intermediária entre Model e Templates. É semelhante ao Controller de uma arquitetura MVC.
* Em geral, as regras de negócio podem ser implementadas tanto na view quanto no model. É um assunto que causa bastante debate. Há uma prática conhecida como "fat model, thin view", que sugere que as regras de negócio fiquem principalmente no model, deixando-o mais gordinho.

**Uso de funções middleware.** Quando desenvolvemos uma aplicação Web, a arquitetura de comunicação predominante é aquela conhecida como cliente/servidor. O cliente produz uma requisição e a envia ao servidor. O servidor processa a requisição e produz uma resposta, que é entregue ao cliente.

![Diagrama cliente/servidor: o Cliente envia uma Requisição ao Servidor, que devolve uma Resposta](img/p002-1.webp)

*Arquitetura cliente/servidor.*

Django traz construções que viabilizam o uso de conhecidas **funções middleware**. São computações arbitrárias que podemos especificar que ficam "no meio do caminho" entre o cliente e a função alvo no servidor. Antes de a requisição chegar no alvo, ela é processada por uma função middleware.

![Diagrama em que a requisição do Cliente passa por uma Função middleware antes de chegar ao Servidor, que devolve a Resposta ao Cliente](img/p002-2.webp)

*A função middleware fica entre o cliente e o servidor.*

<aside class="positive">

**Nota.** Middleware significa algo como "intermediário".

</aside>

Uma função middleware pode

* fazer log
* controlar autenticação e autorização
* fazer pré-processamento da requisição, como transformá-la para uma forma mais apropriada, esperada pelo servidor.

**Manipulação de forms e validação de campos.** Django possui classes e funções próprias para a manipulação de forms. Podemos, por exemplo, definir uma classe de modelo e deixá-la "vinculada" a um form, junto com regras de validação. Utilizando Django, a execução das validações e a construção de um objeto de modelo a partir dos dados do formulário são feitas em alto nível de abstração.

**Suporte à autenticação e à autorização.** Autenticação e autorização são requisitos básicos de praticamente qualquer aplicação. Django inclui um sistema para tal, constituído por views, forms, classes de modelo, controle de login, logout, recuperação de senha etc.

**Roteamento de URLs.** Mecanismo baseado em expressões regulares para direcionar uma requisição ao componente correto, de acordo com a URL de acesso.

**Engine para a geração de templates.** Caso deseje construir a camada de visualização produzindo HTML do lado do servidor, Django possui um mecanismo simples para isso.

**Melhoria de desempenho com cache.** Diferentes formas para fazer "cache" de conteúdo da aplicação, o que, em geral, traz benefícios do ponto de vista do desempenho.

**Internacionalização.** Suporte para a construção de aplicações que utilizam múltiplos idiomas, simplificando a troca de idiomas de acordo com a preferência do usuário.

**Signals: programação baseada em eventos.** O sistema "Signals" de Django permite que uma função qualquer seja executada mediante a ocorrência de um evento de interesse. Ele pode ser interessante para

* realização de logs
* interação com aplicações externas
* envio de notificações por e-mail

**Servidor Web de teste embutido.** Django inclui um servidor web simples, próprio para o teste de aplicações em tempo de desenvolvimento.

**Database migrations.** Trata-se de um sistema que permite que o "schema" (coleção de tabelas) do banco de dados evolua conforme a aplicação evolui, além da manutenção de um histórico de versões que permite "migrar" de uma a outra, conforme a necessidade.

**Documentação.** Django foi criado por desenvolvedores do jornal impresso Lawrence Journal-World, que circula em Kansas, nos Estados Unidos. Dizem que, por ter sido criado dentro de um jornal, a sua documentação é muito bem escrita e organizada.

### Projetos e aplicações

<aside class="positive">

**Nota.** Quando trabalhamos com Django, criamos **projetos** e **aplicações**.

Um projeto é uma coleção de aplicações e de configurações que garantem o seu funcionamento.

Uma aplicação está contida em um projeto. Ela implementa uma funcionalidade de interesse. Por exemplo, em um mesmo projeto Django podemos ter uma aplicação que lida com autenticação, outra que lida com um CRUD de livros, outra que lida com um CRUD de comentários, outra que lida com acessos ao ChatGPT e assim por diante. Essa arquitetura dá origem à expressão **"pluggable apps"**. A ideia é que uma aplicação é uma pequena criatura que pode ser plugada em e desplugada de diferentes projetos, o que promove alto nível de reusabilidade.

</aside>

## Ambiente virtual e novo projeto Django
Duration: 12:00

Crie uma pasta para abrigar seus projetos Django. No Windows, uma sugestão é

```text
C:\Users\usuario\Documents\dev\django
```

Em sistemas Unix-like, use

```text
/home/usuario/dev/django
```

Abra um terminal (CMD no Windows, Bash em sistemas Unix-like) e navegue até o diretório recém-criado.

**Terminal (Windows)**

```bash
cd C:\Users\usuario\Documents\dev\django
```

**Terminal (Unix-like)**

```bash
cd /home/usuario/dev/django
```

Use

**Terminal**

```bash
python -m venv venv
```

para criar um ambiente virtual Python chamado `venv` utilizando o módulo `venv`. Após a sua execução, uma pasta chamada `venv` deve ser criada na raiz de seu projeto.

<aside class="positive">

**Nota.** Um ambiente virtual Python permite o uso de uma versão específica do Python e também de pacotes diversos. Isso permite que diferentes projetos Python com dependências de pacotes de versões diferentes tenham vida sem impactar uns aos outros, operando de maneira isolada.

</aside>

Depois da criação do ambiente virtual, é preciso ativá-lo. Usuários Windows podem utilizar um terminal "cmd" ou um terminal "Powershell". A tabela a seguir resume a forma como o ambiente virtual Python pode ser ativado em qualquer caso.

| Terminal | Comando(s) |
| --- | --- |
| Windows cmd | `venv\Scripts\activate.bat` |
| Windows Powershell | `Set-ExecutionPolicy -Scope CurrentUser unrestricted` e, depois, `venv\Scripts\Activate.ps1` |
| Unix-like terminals | `. venv/bin/activate` |

Em qualquer caso, você pode verificar se o ambiente foi ativado com sucesso com

**Terminal**

```bash
pip -V
```

A pasta de seu ambiente virtual deve ser exibida.

![Terminal com os comandos python -m venv venv, . venv/bin/activate e pip -V, cuja saída mostra o pip dentro da pasta venv](img/p005-1.webp)

*O pip em uso é o do ambiente virtual.*

O nome do ambiente virtual que você criou também deve aparecer.

![Terminal com o prefixo (venv) destacado no início da linha de comando](img/p005-2.webp)

*O nome do ambiente virtual ativo aparece no prompt.*

A seguir, podemos instalar o pacote Django. Essa instalação será válida apenas para o ambiente virtual Python ativo no momento.

**Terminal**

```bash
pip install django
```

Assim, temos um ambiente virtual Python que já inclui o Django, que poderemos utilizar sempre que necessário.

O próximo passo é criar um projeto Django. Um projeto Django é uma coleção de aplicações Django e configurações. Em geral, ele possui

* um "CLI" (command line interface) que nos permite interagir com seu conteúdo
* arquivos de configurações
* arquivos de definição de URLs

Podemos criar o projeto com

**Terminal**

```bash
django-admin startproject primeiro_projeto
```

Uma pasta deve ter sido criada, ao lado da pasta que representa o seu ambiente virtual.

![Gerenciador de arquivos com as pastas primeiro_projeto e venv lado a lado](img/p006-1.webp)

*A pasta do projeto ao lado da pasta venv.*

Abra o VS Code e clique em **File >> Open Folder**. Navegue para encontrar a pasta de seu projeto e vincule o VS Code a ela. Veja o resultado esperado.

![Explorer do VS Code com o projeto PRIMEIRO_PROJETO contendo a pasta primeiro_projeto (com __init__.py, asgi.py, settings.py, urls.py e wsgi.py) e o arquivo manage.py](img/p007-1.webp)

*O projeto aberto no VS Code.*

<aside class="positive">

**Nota.** É recomendável manter o VS Code em modo de salvamento automático, clicando em **File >> Auto Save**.

</aside>

![Menu File do VS Code aberto com a opção Auto Save em destaque](img/p007-2.webp)

*Ative o Auto Save.*

## Arquivos do projeto e servidor local
Duration: 12:00

Veja uma breve explicação sobre cada arquivo.

* `__init__.py`: um arquivo Python vazio. Seu nome é especial e indica ao ambiente Python que este diretório é um pacote ou módulo Python.
* `asgi.py`: ASGI significa *Asynchronous Server Gateway Interface*. Fornece uma interface padrão entre aplicações Python assíncronas. Veja mais sobre ASGI em [https://asgi.readthedocs.io/en/latest/](https://asgi.readthedocs.io/en/latest/).
* `settings.py`: configurações do projeto, como funções Middleware, aplicações que fazem parte do projeto etc.
* `urls.py`: neste arquivo, armazenamos os mapeamentos de URL/funções e URL/classes de nossa aplicação. Ou seja, dado um acesso a uma URL, qual funcionalidade de nosso projeto deve ser acionada?
* `wsgi.py`: WSGI significa *Web Server Gateway Interface*. É uma especificação que diz como um servidor web "conversa" com aplicações web e como aplicações web podem ser encadeadas para lidar com uma requisição. Importante para a fase de implantação da aplicação. Veja mais sobre WSGI em [https://wsgi.readthedocs.io/en/latest/what.html](https://wsgi.readthedocs.io/en/latest/what.html).
* `manage.py`: contém uma "CLI" (Command line interface) que utilizaremos para realizar tarefas diversas conforme desenvolvemos.

<aside class="positive">

**Nota.** Em projetos Python, ainda que fora do contexto Django, a existência de um arquivo `__init__.py` dentro de um diretório o caracteriza como um módulo que pode ser importado por outros módulos. Em geral, este diretório tem diversos outros arquivos .py que podem ser executados e é bastante comum que o arquivo `__init__.py` permaneça vazio.

</aside>

No VS Code, clique em **Terminal >> New terminal** para abrir um terminal interno do VS Code. Lembre-se de ativar o ambiente virtual que criamos anteriormente, assim ele será válido para essa instância de terminal que acabamos de abrir.

<aside class="negative">

**Cuidado.** O ambiente virtual se encontra numa pasta chamada `venv` que está um nível acima da pasta em que estamos no momento. Por isso, use `../` para acessá-la (por exemplo, `. ../venv/bin/activate`). Use o comando apropriado para o seu sistema operacional.

</aside>

Veja o resultado esperado.

![Terminal interno do VS Code após ativar o ambiente com ../venv/bin/activate, com o prefixo (venv) destacado](img/p009-1.webp)

*O ambiente virtual ativado no terminal do VS Code.*

### Executando um servidor local e as migrations das aplicações padrão

Use

**Terminal**

```bash
python manage.py runserver
```

para colocar um servidor em execução. A seguir, visite `localhost:8000` usando uma aba de seu navegador para ver algo parecido com

![Página padrão do Django com o foguete e a mensagem "The install worked successfully! Congratulations!"](img/p009-2.webp)

*A página inicial padrão de um projeto Django.*

<aside class="positive">

**Nota.** Se desejar utilizar outra porta, como a 8080, execute `python manage.py runserver 8080`. Aqui, vamos manter o uso da porta padrão, a 8000.

</aside>

Observe a mensagem que aparece no terminal.

![Terminal do VS Code com o servidor em execução e, em destaque, a mensagem "You have 18 unapplied migration(s)... Run 'python manage.py migrate' to apply them."](img/p010-1.webp)

*O aviso de migrações pendentes.*

Por padrão, o projeto que criamos já inclui diversas aplicações prontas, como admin, auth, contenttypes e sessions. Elas estão relacionadas à filosofia "batteries-included" do Django, pois oferecem funcionalidades que, em geral, muitas aplicações precisam. Elas possuem as suas próprias bases de dados e a mensagem diz que há novos modelos de dados para elas, os quais podem ser obtidos por meio da realização de uma migração. No terminal, encerre a execução do servidor com CTRL+C. A seguir, use

**Terminal**

```bash
python manage.py migrate
```

para fazer as migrações.

![Saída do comando migrate listando "Applying contenttypes.0001_initial... OK", "Applying auth.0001_initial... OK" e as demais migrações](img/p010-2.webp)

*As migrações aplicadas.*

Execute o servidor novamente com

**Terminal**

```bash
python manage.py runserver
```

Observe que a mensagem sobre migrações não deve mais aparecer.

![Terminal com o servidor em execução sem o aviso de migrações pendentes](img/p011-1.webp)

*O servidor em execução, sem avisos de migração.*

<aside class="positive">

**Nota.** Acabamos de criar nosso primeiro projeto Django e sequer conhecemos tais aplicações que já estão incluídas nele. Assim, a migração de base de dados feita no momento pode não fazer muito sentido. Aprenderemos mais sobre isso no futuro.

</aside>

No seu navegador, visite novamente `localhost:8000` para certificar-se de que está tudo ok.

## Nova aplicação Django
Duration: 10:00

Agora vamos criar uma aplicação Django que fará parte do projeto atual. Lembre-se: um projeto Django é uma coleção de aplicações, além de configurações diversas que garantem o seu funcionamento. Para criar uma aplicação, use

**Terminal**

```bash
python manage.py startapp primeira_aplicacao
```

Para isso, se desejar manter o servidor em execução, abra um novo terminal no VS Code.

![Painel do terminal do VS Code com o botão + para abrir um novo terminal em destaque](img/p012-2.webp)

*Abrindo um novo terminal no VS Code.*

Se fizer desta forma, com o novo terminal, lembre-se de ativar o ambiente virtual Python para ele também.

![Novo terminal com a ativação do ambiente virtual e o comando python manage.py startapp primeira_aplicacao em destaque](img/p013-1.webp)

*Criando a aplicação no novo terminal.*

Veja o resultado esperado.

![Explorer do VS Code com a nova pasta primeira_aplicacao contendo migrations, __init__.py, admin.py, apps.py, models.py, tests.py e views.py](img/p013-2.webp)

*Os arquivos da nova aplicação.*

Estudemos o significado de cada arquivo/pasta de uma aplicação Django.

* `__init__.py`: um arquivo vazio que indica que este diretório é um pacote/módulo Python. Quando executarmos este módulo, este arquivo entrará em execução.
* `admin.py`: aqui podemos registrar nossos modelos, os quais serão usados pelo Django para criar a interface gráfica de admin, para gerenciamento da aplicação.
* `apps.py`: configurações da aplicação.
* `models.py`: aqui especificamos as nossas classes de modelo. É onde fazemos o mapeamento objeto relacional.
* `tests.py`: funções para testes unitários.
* `views.py`: aqui definimos nossas views, ou seja, classes Python que recebem requisições, interagem com o modelo e devolvem respostas. É o V da arquitetura MTV do Django, semelhante aos controllers do MVC.
* pasta `migrations`: é um pacote/módulo Python, pois internamente possui um arquivo `__init__.py`. Quando executado, faz a migração de nossa base acontecer. Em geral, quando atualizamos nossas classes de modelo, novos arquivos serão incluídos neste diretório, representando o código necessário para deixar o modelo do banco de dados de acordo com as classes de modelo.

O arquivo `settings.py` (dentro da pasta do projeto) possui uma variável chamada `INSTALLED_APPS`, associada a uma lista Python que contém os nomes das aplicações que fazem parte deste projeto. Vamos incluir o nome de nossa aplicação ali.

**primeiro_projeto/settings.py**

```python
# ...
ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "primeira_aplicacao"
]

# MIDDLEWARE = [
# ...
```

No terminal em que o servidor está em execução, observe que um **Hot Reload** acontece.

![Terminal com a mensagem "primeiro_projeto/settings.py changed, reloading." e o servidor reiniciado](img/p015-1.webp)

*O servidor recarrega sozinho quando settings.py muda.*

Tente também digitar um nome errado e verifique que o servidor passa a falhar.

**primeiro_projeto/settings.py**

```python
# ...
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "nome_errado"
]
# ...
```

![Terminal com o traceback terminando em "ModuleNotFoundError: No module named 'nome_errado'"](img/p016-1.webp)

*Com um nome errado, o servidor falha.*

Depois disso, ajuste o nome da aplicação, deixando o correto.

## View "Hello, World"
Duration: 10:00

Lembre-se que uma **view** é responsável por receber requisições, eventualmente interagir com o modelo e devolver uma resposta ao cliente. Neste passo, vamos escrever uma view simples que faz um "Hello, World" com Django acontecer. Comece abrindo o arquivo `views.py`, dentro do diretório da aplicação.

A nossa view vai receber uma requisição HTTP e, por consequência, devolver uma resposta HTTP. Por isso, vamos importar a classe `HttpResponse`.

**primeira_aplicacao/views.py**

```python
from django.shortcuts import render
from django.http import HttpResponse
```

Agora, vamos escrever uma função chamada `index`. Ela recebe um objeto que representa a requisição e devolve um objeto do tipo `HttpResponse`, construído com o texto "Hello, Django".

**primeira_aplicacao/views.py**

```python
from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return HttpResponse('Hello, Django')
```

<aside class="positive">

**Nota.** Os nomes `index` e `request` são convenções muito comuns. Porém, não são obrigatórios.

</aside>

O próximo passo é explicar a forma como essa função pode ser acionada. Qual URL precisa ser acessada para que ela entre em execução? Podemos fazer isso no arquivo `urls.py` do projeto.

![Explorer do VS Code com primeira_aplicacao/views.py e primeiro_projeto/urls.py em destaque](img/p018-1.webp)

*O arquivo urls.py do projeto.*

Neste arquivo, vamos importar o módulo `views` de nossa aplicação. A seguir, vamos dizer que a função `index` dele deve entrar em execução quando uma requisição direcionada à raiz da aplicação for realizada.

**primeiro_projeto/urls.py**

```python
# ... (docstring do arquivo)
from django.contrib import admin
from django.urls import path
from primeira_aplicacao import views

urlpatterns = [
    path("admin/", admin.site.urls),
    #cadeia vazia indica raiz da aplicação
    #chamamos a função index do módulo views
    #damos um nome (index) a este mapeamento para que possamos fazer
    #referência a ele no código posteriormente, se necessário
    path('', views.index, name="index"),
]
```

Conforme editamos os arquivos, o Hot Reload do servidor deve se encarregar de tornar disponíveis as novas funcionalidades, em geral, sem que seja necessário reiniciar o servidor.

Em seu navegador, visite novamente `localhost:8000` para obter algo como

![Navegador em localhost:8000 exibindo o texto "Hello, Django"](img/p019-1.webp)

*A primeira view em funcionamento.*

<aside class="positive">

**Nota.** A função `path` foi introduzida na versão 2 do Django. Antes de sua existência, o mapeamento era realizado com a função `url`. Ela ainda existe e funciona baseando-se em expressões regulares. Há também uma função chamada `re_path`, que opera como a `path` mas que admite o uso de expressões regulares. Se estiver curioso, descubra mais em [https://docs.djangoproject.com/en/4.2/ref/urls/](https://docs.djangoproject.com/en/4.2/ref/urls/).

</aside>

## URLs da aplicação com include
Duration: 12:00

Temos um único projeto que pode ser constituído por múltiplas aplicações e, no momento, temos um único arquivo `urls.py` de projeto, no qual especificamos as URLs de todas as aplicações dele. Uma das vantagens de termos um projeto com múltiplas aplicações é a reusabilidade. Uma aplicação deve ser um componente reutilizável, que pode ser desplugado de um projeto e plugado em outro. Assim, as suas URLs não podem ser definidas num arquivo de projeto. Idealmente, elas são definidas num arquivo próprio da aplicação e, quando a aplicação for incluída em um projeto, apenas indicamos a existência deste arquivo de alguma forma no projeto. Para isso, vamos usar a função `include`.

No arquivo `urls.py` do projeto, vamos importar a função `include` e, a seguir, explicar que requisições direcionadas a `host/primeira_aplicacao` devem ser resolvidas por funções escritas num arquivo de urls específico da aplicação chamada `primeira_aplicacao`.

**primeiro_projeto/urls.py**

```python
# ... (docstring do arquivo)
from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from primeira_aplicacao import views

urlpatterns = [
    path("admin/", admin.site.urls),
    #cadeia vazia indica raiz da aplicação
    #chamamos a função index do módulo views
    #damos um nome (index) a este mapeamento para que possamos fazer
    #referência a ele no código posteriormente, se necessário
    path('', views.index, name="index"),
    path('primeira_aplicacao/', include('primeira_aplicacao.urls'))
]
# ...
```

<aside class="negative">

**Cuidado.** É fundamental a existência da `/` depois do nome de interesse. Ou seja, `"primeira_aplicacao/"` funciona. `"primeira_aplicacao"` não funciona.

</aside>

Observe que estamos "incluindo" o módulo `urls` da `primeira_aplicacao`. Um módulo é um simples arquivo .py. Entretanto, não há um arquivo chamado `urls.py` no diretório `primeira_aplicacao`. Por isso, vamos criar um.

![Explorer do VS Code com o novo arquivo urls.py dentro de primeira_aplicacao em destaque](img/p021-1.webp)

*O arquivo urls.py da aplicação.*

Neste arquivo, precisamos especificar uma variável chamada `urlpatterns` (o nome precisa ser esse mesmo) e ela deve referenciar uma lista. A lista contém os mapeamentos desejados, como antes. Neste caso, vamos dizer que requisições direcionadas à raiz devem ser atendidas pela função `index`.

**primeira_aplicacao/urls.py**

```python
from django.urls import path
from primeira_aplicacao import views

urlpatterns = [
    path('', views.index, name="index")
]
```

Observe que "raiz", neste caso, significa `host:porta/primeira_aplicacao/`. Essa é a raiz desta aplicação. A raiz `host:porta/` continua sendo do projeto e a função a ser acionada mediante este acesso permanece sendo definida no arquivo `urls.py` do projeto. Por acaso, ela ainda é a função `index` desta aplicação.

No seu navegador, acesse `localhost:8000/primeira_aplicacao`. Veja o resultado esperado.

![Navegador em localhost:8000/primeira_aplicacao exibindo "Hello, Django"](img/p022-1.webp)

*A view acessada pela raiz da aplicação.*

Observe que o padrão `localhost:8000/primeira_aplicacao` foi utilizado por simplicidade. Podemos escolher qualquer padrão de acesso para nossa aplicação. No arquivo `urls.py` do projeto, faça o seguinte ajuste.

**primeiro_projeto/urls.py**

```python
# ... (docstring do arquivo)
from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from primeira_aplicacao import views

urlpatterns = [
    path("admin/", admin.site.urls),
    #cadeia vazia indica raiz da aplicação
    #chamamos a função index do módulo views
    #damos um nome (index) a este mapeamento para que possamos fazer
    #referência a ele no código posteriormente, se necessário
    path('', views.index, name="index"),
    path('outro_nome/', include('primeira_aplicacao.urls'))
]
```

Em seu navegador, acesse `localhost:8000/outro_nome` e observe o resultado.

![Navegador em localhost:8000/outro_nome/ exibindo "Hello, Django"](img/p023-1.webp)

*A mesma aplicação acessada por outro padrão.*

Volte ao normal, mantendo o texto `primeira_aplicacao`.

**primeiro_projeto/urls.py**

```python
# ... (docstring do arquivo)
from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from primeira_aplicacao import views

urlpatterns = [
    path("admin/", admin.site.urls),
    #cadeia vazia indica raiz da aplicação
    #chamamos a função index do módulo views
    #damos um nome (index) a este mapeamento para que possamos fazer
    #referência a ele no código posteriormente, se necessário
    path('', views.index, name="index"),
    path('primeira_aplicacao/', include('primeira_aplicacao.urls'))
]
# ...
```

## HTML do lado do servidor com templates
Duration: 15:00

Django oferece **tags de template**, as quais nos permitem gerar código HTML do lado do servidor. O primeiro passo para utilizar templates é criar um diretório chamado `templates` na raiz do projeto. Observe que ele fica fora do diretório da aplicação e fora do diretório interno que leva o nome do projeto, onde se encontram os arquivos de configuração.

![Explorer do VS Code com a pasta templates na raiz do projeto, ao lado de primeira_aplicacao e primeiro_projeto](img/p024-1.webp)

*O diretório templates na raiz do projeto.*

Depois disso, precisamos dizer ao Django que esse diretório existe e que ele contém arquivos de template. Para tal, abra o arquivo `settings.py` do projeto. Observe que este arquivo possui uma variável chamada `BASE_DIR`. Ela representa a raiz do projeto. Por ter sido construída como um objeto `Path`, a sua representação é independente de sistema operacional. Apenas observe.

**primeiro_projeto/settings.py**

```python
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
```

Vamos definir uma variável chamada `TEMPLATE_DIR` (nome arbitrário) da seguinte forma.

**primeiro_projeto/settings.py**

```python
# ...

ROOT_URLCONF = "primeiro_projeto.urls"

#operador / sobrecarregado para objetos Path
#representa um separador independente de SO
TEMPLATE_DIR = BASE_DIR / Path('templates')
# TEMPLATES = [
# ...
```

Ela referencia um objeto `Path` que representa o diretório de templates de maneira independente de sistema operacional.

O próximo passo é incluir este objeto na lista `"DIRS"` de `TEMPLATES`. O restante da variável `TEMPLATES` permanece como o Django o gerou.

**primeiro_projeto/settings.py**

```python
# ...
ROOT_URLCONF = "primeiro_projeto.urls"

#operador / sobrecarregado para objetos Path
#representa um separador independente de SO
TEMPLATE_DIR = BASE_DIR / Path('templates')
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [TEMPLATE_DIR],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
# ...
```

A seguir, criamos um arquivo chamado `index.html` na pasta `templates`.

![Explorer do VS Code com templates/index.html em destaque](img/p026-1.webp)

*O arquivo index.html na pasta templates.*

Veja seu conteúdo inicial.

**templates/index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Primeira aplicação</title>
  </head>
  <body>
    <h1>Estamos no arquivo index.html!</h1>
  </body>
</html>
```

Podemos definir **variáveis de template** Django e a elas associar valores arbitrários. Depois disso, utilizamos o operador de interpolação (`{{}}`) para fazer a substituição da variável pelo seu valor associado, no contexto em que ela aparece. Veja este exemplo.

**templates/index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Primeira aplicação</title>
  </head>
  <body>
    <h1>Estamos no arquivo index.html!</h1>
    <p>{{minha_primeira_variavel}}</p>
  </body>
</html>
```

Resta definir a variável. Vamos ao arquivo `views.py` da aplicação para tal.

Neste arquivo, vamos utilizar a própria função `index` para fazer a definição das variáveis. Elas são colocadas num dicionário Python. A função `render` recebe

* a requisição HTTP
* o nome do arquivo html ao qual direcionar a requisição
* a coleção de variáveis

Observe que a função `render` já havia sido importada previamente.

<aside class="positive">

**Nota.** A palavra *render* tem diferentes significados dependendo do contexto em que é utilizada. De modo geral, podemos entender que renderizar significa produzir algo em função de matéria-prima bruta. Ou seja, "tornar pronto". No contexto em que estamos, renderizar significa produzir o arquivo HTML que será entregue ao cliente, em função das diferentes matérias-primas envolvidas, como as variáveis, conteúdos vindos do banco de dados etc.

</aside>

**primeira_aplicacao/views.py**

```python
from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    variaveis = {
        'minha_primeira_variavel': "Hello, variáveis!!"
    }
    return render(request, 'index.html', context=variaveis)
```

Em seu navegador, acesse `http://localhost:8000/primeira_aplicacao/` para obter o seguinte resultado. Se necessário, reinicie o servidor.

![Navegador exibindo o título "Estamos no arquivo index.html!" e o parágrafo "Hello, variáveis!!"](img/p029-1.webp)

*O template renderizado com a variável.*

### Um diretório de templates por aplicação

Pode ser interessante separar os templates de aplicações diferentes. É uma prática comum criar um subdiretório dentro do diretório `templates` com o nome de cada aplicação. Façamos isso para a aplicação `primeira_aplicacao`. Depois disso, arrastamos o arquivo `index.html` para dentro desse novo diretório.

![Explorer do VS Code com templates/primeira_aplicacao/index.html em destaque](img/p030-1.webp)

*O index.html dentro de templates/primeira_aplicacao.*

No arquivo `views.py` da aplicação, ajustamos a referência para que o novo diretório seja considerado. Ajuste também o texto associado à variável.

**primeira_aplicacao/views.py**

```python
from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    variaveis = {
        'minha_primeira_variavel': "Hello, variáveis depois de alterar o diretório!"
    }
    return render(request, 'primeira_aplicacao/index.html', context=variaveis)
```

No seu navegador, faça um novo teste em `http://localhost:8000/primeira_aplicacao/`.

![Navegador exibindo "Estamos no arquivo index.html!" e "Hello, variáveis depois de alterar o diretório!"](img/p031-1.webp)

*O template encontrado no novo diretório.*

## Arquivos estáticos: imagens
Duration: 12:00

Nesta parte, veremos como podemos incluir figuras em páginas HTML geradas pelo Django. A ideia é fazermos as configurações adequadas para que uma figura possa ser acessada de uma forma parecida como fizemos com texto: associamos a figura a uma variável de template e usamos a variável de template no arquivo HTML.

Comece criando um diretório chamado `static` na raiz do projeto, fora da pasta da aplicação e fora da pasta que leva o nome do projeto, aquela que contém os arquivos de configuração. Ela fica no mesmo nível da pasta de templates que criamos antes.

![Explorer do VS Code com a pasta static na raiz do projeto em destaque](img/p031-2.webp)

*A pasta static na raiz do projeto.*

Temos diversos tipos de arquivos estáticos, como arquivos .css e .js também. Assim, vamos criar uma pasta própria para o armazenamento de imagens, chamada `images`, subpasta de `static`.

![Explorer do VS Code com a subpasta static/images em destaque](img/p032-1.webp)

*A subpasta images.*

Tal qual fizemos com o diretório de templates, vamos usar o arquivo `settings.py` do projeto para explicar onde se encontram os arquivos estáticos da aplicação.

**primeiro_projeto/settings.py**

```python
# ...
USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_DIR = BASE_DIR / Path('static')
STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
# ...
```

Observe que já existe uma variável chamada `STATIC_URL`. Como seu nome no singular sugere, ela aponta para um único diretório. Ocorre que podemos estar interessados em especificar uma coleção de diretórios, um para cada aplicação diferente, tal como fizemos com os templates. Por isso, vamos criar uma variável chamada `STATICFILES_DIRS` (o nome tem que ser exatamente esse) e a ela associar uma lista contendo o nosso novo diretório.

**primeiro_projeto/settings.py**

```python
# ...
STATIC_DIR = BASE_DIR / Path('static')
STATICFILES_DIRS = [
    STATIC_DIR
]
STATIC_URL = "static/"
# ...
```

Visite o site Pexels ([www.pexels.com](https://www.pexels.com)) e faça o download de uma foto qualquer.

Feito o download, armazene a foto em sua pasta `static/images`. Se desejar, renomeie a foto para simplificar. Neste exemplo, seu nome passou a ser `foto.jpg`.

![Explorer do VS Code com static/images/foto.jpg em destaque](img/p034-1.webp)

*A foto armazenada em static/images.*

Observe que os recursos estáticos, por padrão, podem ser acessados diretamente. No seu navegador, visite `http://localhost:8000/static/images/foto.jpg` e obtenha o seguinte resultado. Se necessário, reinicie o servidor.

![Navegador exibindo diretamente a foto de uma rua movimentada, cheia de pessoas, acessada pela URL static/images/foto.jpg](img/p035-1.webp)

*A foto acessada diretamente pela URL de arquivos estáticos.*

Claro, talvez não seja de interesse permitir que todos os arquivos estáticos da aplicação sejam acessados diretamente assim. No futuro veremos como prevenir isso.

### Incluindo a figura na página

Agora queremos incluir essa figura na página HTML que possuímos. No arquivo `templates/primeira_aplicacao/index.html`, o primeiro passo é utilizar uma instrução própria do Django que faz com que os recursos estáticos se tornem acessíveis na página.

**templates/primeira_aplicacao/index.html**

```html
<!DOCTYPE html>
{% load static %}
<html lang="en">
<head>
...
```

Agora podemos acessar arquivos estáticos nesta página HTML. Para acessar uma imagem, vamos usar a tag `img` regular do HTML, porém usando uma tag de template do Django como `src`.

**templates/primeira_aplicacao/index.html**

```html
<!DOCTYPE html>
{% load static %}
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Primeira aplicação</title>
  </head>
  <body>
    <h1>Estamos no arquivo index.html!</h1>
    <p>{{minha_primeira_variavel}}</p>
    <p>Veja uma imagem:</p>
    <img src="{% static 'images/foto.jpg' %}" alt="Uma foto">
  </body>
</html>
```

No seu navegador, acesse `http://localhost:8000/` ou `http://localhost:8000/primeira_aplicacao/` e obtenha o seguinte resultado.

![Página com o título "Estamos no arquivo index.html!", os parágrafos com a variável e "Veja uma imagem:" e, abaixo, a foto da rua](img/p037-1.webp)

*A página com a imagem estática.*

<aside class="positive">

**Nota.** As duas URLs podem ser acessadas pois ainda temos a mesma view mapeada para atendimento nos dois padrões.

</aside>

## Arquivos estáticos: CSS e JavaScript
Duration: 10:00

Claro, também podemos incluir arquivos css. Comece criando uma pasta chamada `css`, subpasta de `static`. Crie também um arquivo chamado `styles.css`.

![Explorer do VS Code com static/css/styles.css em destaque](img/p038-1.webp)

*O arquivo static/css/styles.css.*

Veja o conteúdo do arquivo `styles.css`. Um seletor simples com uma única regra que tem impacto sobre todos os parágrafos da página.

**static/css/styles.css**

```css
p{
  color: blue;
}
```

No arquivo `index.html`, precisamos importar o arquivo css.

**templates/primeira_aplicacao/index.html**

```html
<!DOCTYPE html>
{% load static %}
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{% static 'css/styles.css' %}">
    <title>Primeira aplicação</title>
  </head>
...
```

Acesse a página novamente no navegador, em `http://localhost:8000/primeira_aplicacao/`. Veja o resultado.

![Página com os parágrafos agora em azul acima da foto da rua](img/p040-1.webp)

*Os parágrafos ficam azuis com o CSS.*

Faça também um teste com Javascript. Crie uma pasta chamada `js`, subpasta de `static`. Nela, crie um arquivo chamado `script.js`.

![Explorer do VS Code com static/js/script.js em destaque](img/p041-1.webp)

*O arquivo static/js/script.js.*

Veja o conteúdo do arquivo `script.js`.

**static/js/script.js**

```javascript
function hey () {
  alert('hey')
}
```

No arquivo `index.html`

* defina um botão e vincule a função `hey` ao seu evento `onclick`
* importe o arquivo `script.js` usando uma tag de template do Django

**templates/primeira_aplicacao/index.html**

```html
<!DOCTYPE html>
{% load static %}
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{% static 'css/styles.css' %}">
    <title>Primeira aplicação</title>
  </head>
  <body>
    <h1>Estamos no arquivo index.html!</h1>
    <button onclick="hey()">Hey</button>
    <p>{{minha_primeira_variavel}}</p>
    <p>Veja uma imagem:</p>
    <img src="{% static 'images/foto.jpg' %}" alt="Uma foto">
    <script src="{% static 'js/script.js' %}"></script>
  </body>
</html>
```

Recarregue a página e clique no botão **Hey** para ver o alerta.

## Encerramento
Duration: 2:00

Parabéns! Você criou um projeto e uma aplicação Django, escreveu sua primeira view, organizou as URLs com `include`, gerou HTML com templates e variáveis e serviu imagens, CSS e JavaScript como arquivos estáticos.

### Referências

* Django: [https://www.djangoproject.com/](https://www.djangoproject.com/)
* URLs no Django: [https://docs.djangoproject.com/en/4.2/ref/urls/](https://docs.djangoproject.com/en/4.2/ref/urls/)
* Arquivos estáticos: [https://docs.djangoproject.com/en/4.2/howto/static-files/](https://docs.djangoproject.com/en/4.2/howto/static-files/)
* ASGI: [https://asgi.readthedocs.io/en/latest/](https://asgi.readthedocs.io/en/latest/)
* WSGI: [https://wsgi.readthedocs.io/en/latest/what.html](https://wsgi.readthedocs.io/en/latest/what.html)
