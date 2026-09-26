summary: Desenvolva com Django e Django Rest Framework uma API REST de filmes persistida no PostgreSQL, com serializers, views genéricas, migrações, variáveis de ambiente com django-environ, relacionamento 1xN com gêneros e uma estrutura de pastas refatorada.
id: django-rest-api-filmes
categories: Django,Python
tags: django,python,django rest framework,drf,api rest,postgresql,psycopg2,pgadmin,migrations,serializers,django-environ,thunder client
status: Published
authors: Rodrigo Bossini
last updated: 2023-09-24
pdf: django/02_apostila_python_django_rest_api_filmes.pdf
exercicios: django/02_exercicio_python_django_rest_api_filmes.pdf,django/02_exercicio_para_g1_que_ja_fez_reposicao_python_django_rest_api_filmes.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Django: API REST de filmes com Django Rest Framework e PostgreSQL

## Visão geral
Duration: 3:00

Neste material, vamos utilizar o arcabouço **Django** para desenvolver uma **API REST** para manipulação de filmes. Nossa API terá os seguintes endpoints.

| Endpoint | Finalidade |
| --- | --- |
| `GET /filmes` | obtém a coleção de filmes |
| `GET /filmes/id` | obtém os dados do filme cujo id foi especificado como parâmetro de path |
| `POST /filmes` | armazena um novo filme enviado como JSON |
| `DELETE /filmes/id` | apaga o filme cujo id foi especificado como parâmetro de path |

### O que você vai aprender

* Como criar um projeto Django com o Django Rest Framework (DRF) e o driver psycopg2
* Como configurar o acesso ao PostgreSQL e criar um database com o pgAdmin
* Como definir classes de modelo, serializers e views genéricas do DRF
* Como mapear URLs com variáveis de path
* Como funcionam `makemigrations` e `migrate`, inclusive migrações de dados
* Como testar a API com a Thunder Client
* Como tirar senhas e chaves do código com o django-environ e o `.gitignore`
* Como criar um relacionamento 1xN e serializar objetos aninhados
* Como organizar models, serializers e views em pastas

### O que você vai precisar

* Python 3 instalado
* PostgreSQL e pgAdmin instalados
* VS Code com a extensão Thunder Client

## Ambiente virtual e novo projeto Django
Duration: 10:00

Crie uma pasta para abrigar seus projetos Django. No Windows, uma sugestão é

```text
C:\Users\usuario\Documents\dev\django
```

Em sistemas Unix-like, use

```text
/home/usuario/dev/django
```

<aside class="positive">

**Nota.** Se você já possuir um ambiente virtual com Django, pode fazer uso dele.

</aside>

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

![Terminal com os comandos de criação e ativação do ambiente e a saída de pip -V apontando para a pasta venv](img/p002-1.webp)

*O pip em uso é o do ambiente virtual.*

O nome do ambiente virtual que você criou também deve aparecer.

![Terminal com o prefixo (venv) destacado no início da linha de comando](img/p002-2.webp)

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
django-admin startproject filmes_project
```

Uma pasta deve ter sido criada, ao lado da pasta que representa o seu ambiente virtual.

![Gerenciador de arquivos com as pastas filmes_project e venv lado a lado](img/p003-1.webp)

*A pasta do projeto ao lado da pasta venv.*

Abra o VS Code e clique em **File >> Open Folder**. Navegue para encontrar a pasta de seu projeto e vincule o VS Code a ela. Veja o resultado esperado.

![Explorer do VS Code com o projeto FILMES_PROJECT contendo a pasta filmes_project e o arquivo manage.py](img/p003-2.webp)

*O projeto aberto no VS Code.*

<aside class="positive">

**Nota.** É recomendável manter o VS Code em modo de salvamento automático, clicando em **File >> Auto Save**.

</aside>

![Menu File do VS Code com a opção Auto Save em destaque](img/p004-1.webp)

*Ative o Auto Save.*

No VS Code, clique em **Terminal >> New terminal** para abrir um terminal interno do VS Code. Lembre-se de ativar o ambiente virtual que criamos anteriormente, assim ele será válido para essa instância de terminal que acabamos de abrir.

<aside class="negative">

**Cuidado.** O ambiente virtual se encontra numa pasta chamada `venv` que está um nível acima da pasta em que estamos no momento. Por isso, use `../` para acessá-la. Use o comando apropriado para o seu sistema operacional.

</aside>

Veja o resultado esperado.

![Terminal interno do VS Code com a ativação por ../venv/bin/activate e o prefixo (venv) em destaque](img/p004-2.webp)

*O ambiente virtual ativado no terminal do VS Code.*

## Dependências, aplicação e PostgreSQL
Duration: 12:00

### Django Rest Framework (DRF) e psycopg2 (driver PostgreSQL)

Para criar a API Rest, vamos utilizar o conhecido **DRF**. Se desejar saber mais sobre ele, visite [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/).

Além disso, nossa aplicação se conectará a uma instância do **PostgreSQL** e, para tal, ela precisa ser capaz de se comunicar utilizando o protocolo do PostgreSQL. Ele é implementado por diferentes pacotes, que geralmente levam o nome de "driver". Neste material, vamos utilizar o pacote **psycopg2**. No terminal do VS Code, use

**Terminal**

```bash
pip install django djangorestframework psycopg2
```

para instalar ambos.

### Nova aplicação

Até então, temos apenas um projeto Django. Agora precisamos criar uma aplicação que fará parte dele. Para isso, use

**Terminal**

```bash
python manage.py startapp filmes_app
```

### Adicionando aplicações ao projeto

No arquivo `settings.py` do projeto, precisamos adicionar a nossa aplicação como parte dele, na lista de `INSTALLED_APPS`. Como vamos usar o DRF, também precisamos adicionar uma aplicação chamada `rest_framework`. Veja.

**filmes_project/settings.py**

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
    "rest_framework",
    "filmes_app"
]

# MIDDLEWARE = [
# ...
```

### Configurando os dados de acesso ao PostgreSQL

No arquivo `settings.py` do projeto, temos uma variável chamada `DATABASES`. Ela referencia um dicionário Python que contém configurações de acesso a bases de dados. Observe que, por padrão, o Django usa o SQLite 3.

**filmes_project/settings.py (padrão)**

```python
# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
```

Vamos alterar para utilizar o PostgreSQL. Veja como fica.

**filmes_project/settings.py**

```python
# ...
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'pessoal_pdfs_rest_filmes',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
# ...
```

## Criando o database com o pgAdmin
Duration: 8:00

Observe que estamos utilizando um nome específico para o database. Embora possa lidar com a criação de tabelas, o Django não cria o database. Devemos fazê-lo manualmente. Para isso, abra o **pgAdmin**. Clique com o direito em **Servers** e escolha **Register >> Server**.

![pgAdmin com o menu de contexto de Servers aberto e a opção Register > Server em destaque](img/p007-1.webp)

*Registrando um servidor no pgAdmin.*

O nome pode ser algo como `localhost`. Na aba **Connection**, precisamos especificar os detalhes para acesso ao servidor local. Clique em **Save** a seguir.

![Aba Connection da janela Register - Server com Host localhost, porta 5432, banco postgres, usuário postgres e senha, e o botão Save em destaque](img/p007-2.webp)

*Os dados de conexão com o servidor local.*

Clique sobre `localhost` à direita, clique com o direito sobre **Databases** e escolha **Create >> Database**.

![pgAdmin com o menu de contexto de Databases aberto e a opção Create > Database em destaque](img/p008-1.webp)

*Criando um database.*

Coloque o mesmo nome que tenha especificado no arquivo `settings.py` do seu projeto Django. Clique em **Save** a seguir.

![Janela Create - Database com o nome pessoal_pdfs_rest_filmes e o botão Save em destaque](img/p009-1.webp)

*O nome do database igual ao do settings.py.*

## Modelo, serializer, views e URLs
Duration: 15:00

### Classe de modelo que descreve o que é um filme

No arquivo `models.py` da aplicação, faça a definição de uma classe. Ela herda de `models.Model` e descreve as propriedades de interesse de um filme, além de aplicar validações eventualmente desejadas. Podemos também definir o método `__str__`, responsável por produzir uma representação textual dos objetos da classe. Observe que, neste momento, estamos fazendo uso do mecanismo de mapeamento objeto relacional provido pelo Django.

**filmes_app/models.py**

```python
from django.db import models

# Create your models here.

class Filme(models.Model):
    titulo = models.CharField(max_length=100)
    descricao = models.TextField()
    diretor = models.CharField(max_length=100)

    def __str__(self):
        return self.titulo
```

### Serializers: convertendo um objeto Python em JSON e vice-versa

O DRF nos permite especificar a forma como um objeto Python deve ser convertido para JSON e vice-versa. Em geral, escolhemos os campos desejados e o trabalho "duro" fica todo por conta de classes utilitárias. Uma classe que desempenha tal papel é chamada de **Serializer**. Crie um arquivo chamado `serializers.py` na pasta da aplicação. Veja a definição de um serializer que converte objetos do tipo filme incluindo todos os seus campos.

**filmes_app/serializers.py**

```python
from rest_framework import serializers
from .models import Filme
class FilmeSerializer (serializers.ModelSerializer):
    class Meta:
        model = Filme
        fields = '__all__'
```

### Views para lidar com as requisições

Nossa API possui endpoints que são acessados utilizando métodos comuns do protocolo HTTP, como GET, POST etc. O DRF oferece classes genéricas que implementam os detalhes de mais baixo nível do protocolo e simplificam bastante a nossa tarefa. Neste exemplo, vamos usar duas classes:

* **ListCreateAPIView**: para implementar os endpoints `GET /filmes` e `POST /filmes`. Observe que o padrão de acesso é o mesmo, o que muda é o método do protocolo HTTP. Por isso faz sentido que uma única classe seja capaz de lidar com os dois endpoints.
* **RetrieveDestroyAPIView**: para implementar os endpoints `GET /filmes/{id}` e `DELETE /filmes/{id}`. Novamente, o padrão de acesso é o mesmo, o que muda é o método do protocolo HTTP. Essa classe é capaz de lidar com ambos, como o nome sugere.

<aside class="positive">

**Nota.** Há também os conhecidos **mixins**, que implementam métodos separadamente, sem fazer combinações com as classes que escolhemos. Veja mais em [https://www.django-rest-framework.org/api-guide/generic-views/](https://www.django-rest-framework.org/api-guide/generic-views/).

</aside>

Observe que, em nossa implementação, fazemos uso de dois atributos. Ambos são definidos pela classe da qual herdamos.

* `queryset`: associamos a esse atributo a coleção sobre a qual desejamos operar. Tanto para indicar qual lista de objetos deve ser devolvida quanto para indicar a qual lista um novo objeto deve ser adicionado.
* `serializer_class`: associamos a esse atributo o nome de uma classe que é responsável por fazer eventuais validações e conversões de objeto Python para JSON e vice-versa. Ou seja, a classe Serializer que criamos há pouco.

Veja como fica. Use o arquivo `views.py` da aplicação.

**filmes_app/views.py**

```python
from rest_framework import generics
from .models import Filme
from .serializers import FilmeSerializer

class FilmeListCreate(generics.ListCreateAPIView):
    queryset = Filme.objects.all()
    serializer_class = FilmeSerializer

class FilmeRetrieveDestroy(generics.RetrieveDestroyAPIView):
    queryset = Filme.objects.all()
    serializer_class = FilmeSerializer
```

### Mapeamento de URLs

Precisamos fazer o mapeamento URL/View como a seguir.

| URL | View |
| --- | --- |
| `filmes/` | `FilmeListCreate` |
| `filmes/<int:pk>` | `FilmeRetrieveDestroy` |

<aside class="positive">

**Nota.** Usamos a notação `<int:pk>` para definir uma **variável de path**. Isso quer dizer que, no código, teremos acesso a uma variável chamada `pk` que dá acesso ao valor que tenha sido especificado na região em que ela foi definida na path. Além disso, há a validação de que ela deve ser int. O nome `pk` não é obrigatório, mas é bastante comum, especialmente pelo fato de, internamente, ele ser usado como parâmetro nomeado por métodos do DRF.

</aside>

Crie um arquivo chamado `urls.py` na pasta da aplicação. Veja seu conteúdo.

**filmes_app/urls.py**

```python
from django.urls import path
from . import views

urlpatterns = [
    path ('filmes/', views.FilmeListCreate.as_view(), name="filme-list-create"),
    path('filmes/<int:pk>', views.FilmeRetrieveDestroy.as_view(), name='filme-retrieve-destroy')
]
```

Lembre-se que é necessário incluir o módulo `urls` da aplicação que acabamos de criar no módulo principal do projeto. O arquivo também se chama `urls.py` e se encontra na pasta do projeto. Veja como fica.

**filmes_project/urls.py**

```python
# ... (docstring do arquivo)
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', include('filmes_app.urls')),
]
```

## Migrações: criando a estrutura da base
Duration: 10:00

O mecanismo de mapeamento objeto relacional do Django permite que criemos as tabelas do banco de dados em função de classes de modelo que tenhamos definido. Além disso, contamos com um sistema de migração que permite alternarmos entre diferentes versões da base conforme a necessidade. Todo o histórico de alterações é mantido em tabelas também criadas na nossa base pelo Django. Temos dois comandos

* `makemigrations`: detecta eventuais diferenças entre suas classes de modelo e a estrutura da base de dados atual. Cria arquivos que, se executados, fazem as transformações necessárias. Ou seja, aqui a base não é alterada ainda, o que dá maior flexibilidade ao desenvolvedor. São gerados arquivos de migração que ficam armazenados na pasta `migrations` da aplicação.
* `migrate`: executa os arquivos criados pelo comando `makemigrations`, alterando a estrutura da base.

No terminal do VS Code, execute o primeiro com

**Terminal**

```bash
python manage.py makemigrations filmes_app
```

Veja o feedback textual dado no terminal.

![Terminal com a saída "Migrations for 'filmes_app': filmes_app/migrations/0001_initial.py - Create model Filme"](img/p013-1.webp)

*O arquivo de migração criado.*

Por curiosidade, expanda a pasta `migrations` da aplicação. Observe que um arquivo chamado `0001_initial.py` foi criado. Abra-o e veja seu conteúdo. Ali temos código Python que, quando executado, altera a estrutura da base. Não precisamos mexer neste arquivo, embora possamos.

**filmes_app/migrations/0001_initial.py**

```python
# Generated by Django 4.2.5 on 2023-09-11 03:23

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Filme",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("titulo", models.CharField(max_length=100)),
                ("descricao", models.TextField()),
                ("diretor", models.CharField(max_length=100)),
            ],
        ),
    ]
```

Se você abrir o pgAdmin, expandir até encontrar a seção de tabelas e clicar em **Refresh**, como na figura a seguir, perceberá que nenhuma tabela foi criada ainda.

![Árvore do pgAdmin com o database pessoal_pdfs_rest_filmes expandido até Schemas > public > Tables e a opção Refresh em destaque](img/p015-1.webp)

*Ainda não há tabelas no database.*

Execute o próximo comando no terminal do VS Code

**Terminal**

```bash
python manage.py migrate
```

Veja o feedback textual no terminal.

![Saída do comando migrate com as migrações de contenttypes, auth, admin, filmes_app e sessions aplicadas com OK](img/p016-1.webp)

*As migrações aplicadas.*

Volte ao pgAdmin e clique **Refresh** sobre Tables novamente. Veja que foram criadas diversas tabelas. Neste momento, a maioria é referente ao próprio controle realizado pelo Django. Observe que uma delas serve para abrigar dados de filmes.

![Lista de tabelas no pgAdmin, com as tabelas auth_*, django_* e a tabela filmes_app_filme com as colunas id, titulo, descricao e diretor](img/p016-2.webp)

*As tabelas criadas, entre elas filmes_app_filme.*

## Testando com a Thunder Client
Duration: 12:00

Agora podemos verificar se a aplicação está funcionando corretamente. Comece colocando o servidor em execução com

**Terminal**

```bash
python manage.py runserver
```

Veja o feedback textual esperado.

![Terminal com o servidor em execução: "System check identified no issues", "Django version 4.2.5" e "Starting development server at http://127.0.0.1:8000/"](img/p017-1.webp)

*O servidor em execução.*

Há uma extensão para o VS Code chamada **Thunder Client**. Trata-se de um cliente HTTP que nos permite construir requisições mais detalhadamente do que faríamos com um navegador comum. É uma ferramenta essencial para o desenvolvedor. Se você ainda não tiver, faça a sua instalação.

![Página da extensão Thunder Client no VS Code](img/p017-2.webp)

*A extensão Thunder Client.*

Uma vez que ela tenha sido instalada, você deve ser capaz de ver seu ícone na barra lateral esquerda do VS Code.

![Barra lateral do VS Code com o ícone de raio da Thunder Client em destaque](img/p018-1.webp)

*O ícone da Thunder Client.*

Comece criando uma nova coleção. Vamos utilizá-la para agrupar as requisições referentes a este projeto.

![Thunder Client com a aba Collections e a opção New Collection em destaque](img/p019-1.webp)

*Criando uma coleção.*

Depois de escolher um nome para a coleção, clique com o direito sobre seu nome e escolha **New Request**.

![Menu de contexto de uma coleção da Thunder Client com a opção New Request em destaque](img/p020-1.webp)

*Criando uma requisição na coleção.*

Dê um nome para a requisição e aperte Enter. Esta primeira requisição servirá para salvarmos um filme na base.

![Campo de nome da requisição preenchido com "Salvar Filme" na coleção pessoal_pdfs_rest_filmes](img/p021-1.webp)

*A requisição Salvar Filme.*

Faça os ajustes destacados a seguir e clique em **Send** para fazer uma requisição.

**Corpo da requisição (JSON) · POST localhost:8000/filmes/**

```json
{
  "titulo": "Titanic",
  "descricao": "Um filme sobre o Titanic",
  "diretor": "{{#name}}"
}
```

![Thunder Client com POST localhost:8000/filmes/, o corpo JSON acima e a resposta 201 Created com id 1 e diretor "Botsford"](img/p021-2.webp)

*O filme salvo, com um nome de diretor gerado aleatoriamente.*

<aside class="positive">

**Nota.** Estamos utilizando a notação `{{#name}}` da Thunder Client para gerar um nome aleatório. Ela possui outras construções semelhantes, que permitem gerar números, datas etc. Veja mais em [https://github.com/rangav/thunder-client-support#system-variables](https://github.com/rangav/thunder-client-support#system-variables).

</aside>

No pgAdmin, mantenha seu database selecionado (basta clicar no seu nome) e clique em **Tools >> Query Tool**.

![Menu Tools do pgAdmin com a opção Query Tool em destaque e a observação "mantenha o database selecionado"](img/p022-1.webp)

*Abrindo a Query Tool.*

Execute um SELECT e verifique que os dados foram armazenados na tabela.

**Query Tool**

```sql
SELECT * FROM filmes_app_filme;
```

![Query Tool com o SELECT e, no resultado, a linha do filme Titanic](img/p023-1.webp)

*O filme armazenado na tabela.*

Como exercício, crie as demais requisições na Thunder Client e faça novos testes.

## Variáveis de ambiente com django-environ
Duration: 15:00

Considere os seguintes valores de que projetos geralmente dependem para funcionar

* senhas
* chaves de API
* URL de acesso à base de dados

entre muitos outros. Estes valores não devem ser armazenados diretamente ("chumbados") no código Python por, pelo menos, duas razões:

* são valores que variam em função do ambiente: se estamos em tempo de desenvolvimento, provavelmente estamos acessando uma base própria para isso, apenas para os testes do desenvolvedor, isolada de outros ambientes, especialmente de produção
* são valores que não devem fazer parte do controle de versão, especialmente se estivermos utilizando um repositório público.

As diferentes linguagens de programação possuem diferentes mecanismos para lidar com isso. Em Python, algumas opções são:

* python-decouple: [https://pypi.org/project/python-decouple/](https://pypi.org/project/python-decouple/)
* python-dotenv: [https://pypi.org/project/python-dotenv/](https://pypi.org/project/python-dotenv/)
* django-environ: [https://pypi.org/project/django-environ/](https://pypi.org/project/django-environ/)

Entre outros. Neste material, utilizaremos o pacote **django-environ**. O primeiro passo é fazer a sua instalação.

**Terminal**

```bash
pip install django-environ
```

A seguir, criamos um arquivo chamado `.env` na raiz do projeto, lado a lado com o arquivo `manage.py`.

![Explorer do VS Code com o arquivo .env na raiz do projeto, ao lado de manage.py](img/p024-1.webp)

*O arquivo .env na raiz do projeto.*

Quando um projeto Django é colocado em execução, o arquivo `settings.py` é executado automaticamente. Por isso, vamos fazer a leitura do arquivo `.env` nele. Para tal

* importamos o módulo `environ`
* construímos um objeto do tipo `environ.Env`
* usamos o método `read_env` para ler o conteúdo

Observe que vamos utilizar o "diretório base" da aplicação, que é a pasta que contém o arquivo `.env` que criamos. Ele já vem definido por padrão e se encontra na variável `BASE_DIR`.

<aside class="positive">

**Nota.** Há uma sobrecarga do operador `/` para objetos do tipo `Path` do módulo `pathlib`. Quando o operador `/` opera com operandos do tipo `Path`, ele significa "separador de path independente de sistema operacional".

</aside>

Veja como ficou até agora.

**filmes_project/settings.py**

```python
# ...
from pathlib import Path
import environ

env = environ.Env()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
environ.Env.read_env(BASE_DIR / Path(".env"))
# ...
```

Ainda no arquivo `settings.py`, observe que temos dois valores.

**SECRET_KEY**: utilizada pelo Django em funcionalidades como

* assinatura criptográfica de dados mantidos em sessão, para que seja possível verificar que os dados enviados pelo cliente não foram adulterados
* geração de tokens para reconfiguração de senha perdida

**DEBUG**: valor booleano que indica que a aplicação está em modo de depuração. Devemos configurá-la como `True` apenas em tempo de desenvolvimento. Veja algumas de suas características.

* Quando vale `True`, o Django exibe a pilha de chamada de métodos quando um erro acontece.
* Mantém as queries de consulta ao banco em memória, o que é bom para depuração mas causa impacto no desempenho da aplicação, algo desnecessário em tempo de produção.
* Por questões de segurança, ela nunca deve valer `True` em tempo de produção, já que uma pessoa mal-intencionada poderia utilizar técnicas para tentar atacar a aplicação e encontrar as informações mantidas em memória sobre seu funcionamento.

Assim, vamos definir ambas no arquivo `.env`.

**.env**

```ini
SECRET_KEY=django-insecure-9^t&7y^1hb*j8d=15+_^l0tnb7jqy)!-oyu8o$o5u)5-@1c*-4
DEBUG=True
```

A seguir, passamos a utilizá-las no arquivo `settings.py`.

**filmes_project/settings.py**

```python
# ...

env = environ.Env()
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
environ.Env.read_env(BASE_DIR / Path(".env"))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')
# ...
```

Se desejar, você pode testar a configuração exibindo os valores das variáveis.

**filmes_project/settings.py**

```python
# ...
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')
print(SECRET_KEY, DEBUG)
# ...
```

Para executar e ver o resultado, use

**Terminal**

```bash
python filmes_project/settings.py
```

Observe.

![Terminal com o comando python filmes_project/settings.py e, na linha seguinte, a SECRET_KEY e o valor True](img/p027-1.webp)

*Os valores lidos do arquivo .env.*

Depois do teste, você pode remover a instrução `print`.

Também podemos fazer a construção do objeto `Env` mantendo algumas variáveis com valor padrão. Elas terão aquele valor a menos que o arquivo `.env` indique outro. Como é recomendável usar `DEBUG=True` apenas em ambiente de desenvolvimento, podemos adotar a seguinte estratégia:

* ao construir o objeto `Env`, indicamos que o valor de `DEBUG` é igual a `False`
* redefinimos o valor de `DEBUG` (como já está feito neste exemplo) no arquivo `.env`.

Fica assim. Observe que atribuímos à variável `DEBUG` uma tupla: o primeiro valor indica o tipo ao qual o segundo será convertido.

**filmes_project/settings.py**

```python
from pathlib import Path
import environ

env = environ.Env(
    DEBUG = (bool, False)
)
```

Neste exemplo, o valor que prevalece é aquele definido no arquivo `.env`. Se não houver definição no arquivo `.env`, fica valendo o valor definido na construção do objeto `Env`.

### Dados de acesso à base

Nossa aplicação possui dados de acesso a bases de dados. Estes também são variáveis de ambiente, já que podem variar em função do ambiente (desenvolvimento, produção etc.). Assim, é interessante fazer a sua definição num arquivo isolado, como o arquivo `.env`. Veja como fica o arquivo `.env`.

<aside class="positive">

**Nota.** Um projeto Django pode manipular múltiplas bases de dados. Por isso, ao especificar as chaves no arquivo `.env`, vamos qualificá-las com a palavra "DEFAULT", indicando que aquelas configurações se referem à base de dados a ser utilizada por padrão. Caso desejemos especificar novas variáveis para outras bases de dados, utilizaremos nomes diferentes para qualificá-las.

</aside>

**.env**

```ini
SECRET_KEY=django-insecure-9^t&7y^1hb*j8d=15+_^l0tnb7jqy)!-oyu8o$o5u)5-@1c*-4
DEBUG=TRUE
DATABASE_DEFAULT_NAME=pessoal_pdfs_rest_filmes
DATABASE_DEFAULT_USER=postgres
DATABASE_DEFAULT_PASSWORD=postgres
DATABASE_DEFAULT_HOST=localhost
DATABASE_DEFAULT_PORT=5432
```

A seguir, no arquivo `settings.py`, passamos a utilizá-las.

**filmes_project/settings.py**

```python
# ...
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DATABASE_DEFAULT_NAME'),
        'USER': env('DATABASE_DEFAULT_USER'),
        'PASSWORD': env('DATABASE_DEFAULT_PASSWORD'),
        'HOST': env('DATABASE_DEFAULT_HOST'),
        'PORT': env('DATABASE_DEFAULT_PORT'),
    }
}
# ...
```

Execute a aplicação com

**Terminal**

```bash
python manage.py runserver
```

e faça nova requisição com a Thunder Client, certificando-se de que os novos ajustes estão corretos.

![Thunder Client com uma nova requisição de filme e a resposta de sucesso](img/p029-1.webp)

*A API funcionando com as configurações lidas do .env.*

## .gitignore
Duration: 6:00

É fundamental utilizarmos um arquivo chamado `.gitignore` na raiz da aplicação e, entre outras coisas, especificar que o arquivo `.env` não deve entrar no controle de versão. Caso ainda não possua um arquivo `.gitignore`, crie um na raiz.

![Explorer do VS Code com o arquivo .gitignore na raiz do projeto em destaque](img/p029-2.webp)

*O arquivo .gitignore na raiz.*

Além do arquivo `.env`, há diversos outros arquivos que podemos estar interessados em especificar num arquivo `.gitignore` de um projeto Django. Veja um possível conteúdo para ele.

**.gitignore**

```text
#pasta com código compilado (bytecode) em cache
__pycache__/
#código compilado ou arquivos para otimização
*.py[cod]
#código compilado para Jython
*$py.class

#a base de dados SQLite
db.sqlite3

#o arquivo .env
.env

#do MacOS
.DS_Store

#arquivos de log
*.log
```

Há diversos outros arquivos que, ao longo do tempo, podem ser adicionados ao `.gitignore`, conforme o projeto passa a utilizar mais recursos. O site [https://www.toptal.com/developers/gitignore](https://www.toptal.com/developers/gitignore) oferece uma boa ferramenta geradora de arquivos `.gitignore`. Basta buscar pelo tipo desejado. Caso deseje testar, basta buscar por Django. Há também uma extensão para o VS Code, caso deseje verificar. Seu nome é **"gi"**.

![Aba de extensões do VS Code com a busca "gi" e a extensão gi, "Generating .gitignore files made easy", com o botão Install em destaque](img/p030-1.webp)

*A extensão gi.*

Para utilizá-la, basta apertar **CTRL+SHIFT+P** e buscar por gi. Talvez você precise "rolar" a lista até encontrar a extensão de nome gi.

![Paleta de comandos do VS Code com a busca "gi" e o comando gi em destaque](img/p031-1.webp)

*O comando gi na paleta de comandos.*

Depois de selecioná-la, busque pelo tipo desejado. Neste caso, Django. Você pode buscar por nome de IDE (VS Code, Eclipse etc.), nome de linguagem de programação (Java, C++ etc.) e mais.

![Campo de busca do comando gi com o texto "django" e a opção django listada](img/p031-2.webp)

*Gerando um .gitignore para Django.*

## Relacionamento 1xN: gêneros e migração de dados
Duration: 15:00

Neste exemplo, vamos adicionar um novo modelo ao projeto Django. Passaremos a lidar com objetos do tipo **Gênero**, os quais terão id e descrição. Além disso, há um relacionamento 1xN entre gênero e filme: um filme tem um gênero; um gênero pode estar associado a N filmes. Abra o arquivo `models.py` da aplicação e defina a nova classe de modelo, responsável por dizer o que é um Gênero. Observe que, para testes futuros, já sobrescrevemos o método `__str__`.

**filmes_app/models.py**

```python
from django.db import models

# Create your models here.

class Genero(models.Model):
    descricao = models.CharField(max_length=100)

    def __str__(self):
        return self.descricao

class Filme(models.Model):
    titulo = models.CharField(max_length=100)
    descricao = models.TextField()
    diretor = models.CharField(max_length=100)

    def __str__(self):
        return self.titulo
```

A seguir, vamos criar um arquivo de migração para que a tabela correspondente à classe `Genero` seja criada.

**Terminal**

```bash
python manage.py makemigrations
```

Observe que um novo arquivo de migração foi criado.

![Explorer do VS Code com o arquivo migrations/0002_genero.py em destaque](img/p033-1.webp)

*O arquivo 0002_genero.py.*

Por curiosidade, abra o arquivo e inspecione o seu conteúdo. Apenas observe, não há nada para alterar.

**filmes_app/migrations/0002_genero.py**

```python
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("filmes_app", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Genero",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("descricao", models.CharField(max_length=100)),
            ],
        ),
    ]
```

### Uma migração de dados

Antes de executar a migração, vamos criar uma nova, inicialmente vazia. Ela terá como finalidade fazer o cadastro de um novo gênero. Para isso, use

**Terminal**

```bash
python manage.py makemigrations filmes_app --empty --name inserir_genero_inicial
```

Veja o arquivo criado.

![Explorer do VS Code com a pasta migrations contendo 0001_initial.py, 0002_genero.py e o novo 0003_inserir_genero_inicial.py em destaque](img/p034-1.webp)

*A migração vazia 0003_inserir_genero_inicial.py.*

Como esta é uma migração vazia, vamos abrir o arquivo e escrever código explicando o que ela deve fazer, quando aplicada. Começamos definindo uma função que

* obtém uma referência ao modelo Gênero
* utiliza o método `create` de sua propriedade `objects` a fim de criar um novo gênero

**filmes_app/migrations/0003_inserir_genero_inicial.py**

```python
from django.db import migrations

def inserir_genero_inicial(apps, schema_editor):
    Genero = apps.get_model('filmes_app', 'Genero')
    Genero.objects.create(descricao="Romance")

class Migration(migrations.Migration):
    dependencies = [
        ("filmes_app", "0002_genero"),
    ]

    operations = []
```

Observe que a migração possui um campo chamado `dependencies`. Ele indica que ela somente pode ser executada depois de a migração ali especificada ter sido executada. Isso faz sentido, afinal, um gênero somente pode ser criado caso a tabela capaz de armazená-lo exista.

A seguir, na lista `operations`, incluímos a função que criamos anteriormente, responsável pelo cadastro do novo gênero.

**filmes_app/migrations/0003_inserir_genero_inicial.py**

```python
from django.db import migrations

def inserir_genero_inicial(apps, schema_editor):
    Genero = apps.get_model('filmes_app', 'Genero')
    Genero.objects.create(descricao="Romance")

class Migration(migrations.Migration):
    dependencies = [
        ("filmes_app", "0002_genero"),
    ]

    operations = [
        migrations.RunPython(inserir_genero_inicial)
    ]
```

Depois disso, podemos executar as migrações.

**Terminal**

```bash
python manage.py migrate
```

Já no pgAdmin, encontre o seu database, clique sobre ele, expanda **Schemas >> public** e encontre **Tables**. Expanda Tables, encontre as tabelas referentes a filmes e a gêneros e veja as suas colunas.

![Árvore do pgAdmin com Schemas > public > Tables expandido e a tabela filmes_app_genero em destaque](img/p036-1.webp)

*As tabelas de filmes e de gêneros.*

![Árvore do pgAdmin com as colunas das tabelas filmes_app_filme e filmes_app_genero em destaque](img/p037-1.webp)

*As colunas das tabelas.*

## A chave estrangeira entre filme e gênero
Duration: 15:00

A seguir, precisamos estabelecer o relacionamento entre filme e gênero. Para isso, vamos usar uma **chave estrangeira**. Cada filme tem um novo campo. Ele referencia o id do gênero a que aquele filme está associado.

<aside class="positive">

**Nota.** Estamos utilizando o valor `models.CASCADE` associado à propriedade `on_delete`. Isso quer dizer que, caso um gênero seja apagado, todos os filmes que estiverem associados a ele também serão apagados. Há outros possíveis valores como `models.SET_NULL` (para deixar cada filme sem gênero) e `models.PROTECT` (para não deixar que uma remoção de gênero aconteça, caso exista pelo menos um filme associado a ele).

</aside>

<aside class="positive">

**Nota.** Caso desejássemos que filmes pudessem existir sem gênero (relacionamento opcional), poderíamos usar `null=True`, como em `genero = models.ForeignKey(Genero, on_delete=models.CASCADE, null=True)`. No momento, entretanto, vamos manter o padrão (que é False) e verificar o que acontece quando tentarmos executar uma nova migração.

</aside>

**filmes_app/models.py**

```python
from django.db import models

# Create your models here.
class Genero(models.Model):
    descricao = models.CharField(max_length=100)
    def __str__(self):
        return self.descricao

class Filme(models.Model):
    titulo = models.CharField(max_length=100)
    descricao = models.TextField()
    diretor = models.CharField(max_length=100)
    genero = models.ForeignKey(Genero, on_delete=models.CASCADE)

    def __str__(self):
        return self.titulo
```

Como fizemos alterações nas classes de modelo, precisamos realizar o processo de migração novamente. Primeiro, geramos o código Python que fará as alterações necessárias na base, sem ainda, entretanto, executá-lo.

**Terminal**

```bash
python manage.py makemigrations
```

Veja a mensagem obtida.

![Terminal com a mensagem "It is impossible to add a non-nullable field 'genero' to filme without specifying a default" e as opções 1) Provide a one-off default now e 2) Quit and manually define a default value in models.py](img/p039-1.webp)

*O Django pede um valor para os filmes já existentes.*

A sua aparição é natural. Como o relacionamento entre filmes e gêneros é obrigatório (não pode existir filme sem gênero), não podemos adicionar essa nova coluna à tabela de filmes, já que, no momento, ela já possui algumas linhas. Se a coluna fosse adicionada, qual valor ela teria? Temos algumas opções:

* especificar agora, na linha de comando, um valor de id de gênero já existente, que será inserido para cada filme já existente.
* apertar CTRL+C no terminal agora e ajustar um valor padrão no arquivo `models.py`.

Vamos optar pela primeira. Assim, digite 1.

![Terminal após escolher a opção 1, pedindo "Please enter the default value as valid Python"](img/p039-2.webp)

*O Django pede o valor padrão.*

A seguir, você deverá digitar o valor desejado. Basta digitar 1 novamente, que é o id do único gênero existente.

![Terminal após digitar 1, com a saída "Migrations for 'filmes_app': filmes_app/migrations/0004_filme_genero.py - Add field genero to filme"](img/p039-3.webp)

*A migração 0004_filme_genero.py criada.*

Agora podemos executar a nova migração.

**Terminal**

```bash
python manage.py migrate
```

No pgAdmin, execute um SELECT na tabela de filmes e observe que a nova coluna existe. Cada filme existente tem o valor padrão associado a ele.

![Query Tool com SELECT * FROM filmes_app_genero e SELECT * FROM filmes_app_filme, e o resultado com a coluna genero_id preenchida com 1](img/p040-1.webp)

*A nova coluna genero_id na tabela de filmes.*

Na Thunder Client, faça uma requisição e veja o resultado.

![Thunder Client com GET localhost:8000/filmes/ e a resposta com dois filmes, cada um com "genero": 1](img/p040-2.webp)

*Cada filme traz apenas o id do gênero.*

### Serializando o gênero completo

Observe que cada filme possui apenas o id do gênero a que está associado. Podemos personalizar isso, fazendo com que cada filme possua o objeto JSON que representa seu gênero por completo.

Para isso, no arquivo `serializers.py`, especifique uma classe serializadora para os gêneros, explicando que ela deve incluir todos os campos de gênero. Depois disso, na classe serializadora de filmes, explique que a forma a ser utilizada para serializar um gênero de um filme é aquela determinada pelo serializador de gênero, ou seja, incluindo todos os campos.

**filmes_app/serializers.py**

```python
from rest_framework import serializers
from .models import Filme
from .models import Genero

class GeneroSerializer (serializers.ModelSerializer):
    class Meta:
        model = Genero
        fields = '__all__'

class FilmeSerializer (serializers.ModelSerializer):
    #o nome genero deve ser igual ao nome especificado no modelo de filme
    genero = GeneroSerializer()
    class Meta:
        model = Filme
        fields = '__all__'
```

## Refatorando: models, serializers e views em pastas
Duration: 15:00

À medida que a aplicação cresce, pode ser difícil mantê-la caso tenhamos

* um único arquivo para abrigar as classes de modelo
* um único arquivo para abrigar as views
* um único arquivo para abrigar as classes serializadoras

Vamos organizar a estrutura da aplicação criando uma pasta para cada item desses e, dentro dela, um arquivo separado para cada classe.

### Models

Começamos pelas classes de modelo. Crie uma pasta chamada `models` na raiz da aplicação. Na pasta `models`, crie um arquivo chamado `genero.py`. Ele servirá para definir a classe de modelo que descreve o que é um gênero.

![Explorer do VS Code com a pasta filmes_app/models criada](img/p042-1.webp)

*A pasta models.*

O código do arquivo `genero.py` é o mesmo que tínhamos anteriormente no arquivo `models.py`.

**filmes_app/models/genero.py**

```python
from django.db import models
class Genero(models.Model):
    descricao = models.CharField(max_length=100)
    def __str__(self):
        return self.descricao
```

Repita os passos para a classe de modelo `Filme`, criando um arquivo `filme.py` para ela na pasta `models`. Observe que ela precisa importar o modelo de gênero também. Veja o código do arquivo `filme.py`. É o mesmo que tínhamos antes também.

**filmes_app/models/filme.py**

```python
from django.db import models
from .genero import Genero
class Filme(models.Model):
    titulo = models.CharField(max_length=100)
    descricao = models.TextField()
    diretor = models.CharField(max_length=100)
    genero = models.ForeignKey(Genero, on_delete=models.CASCADE)

    def __str__(self):
        return self.titulo
```

Na pasta `models`, vamos criar um arquivo chamado `__init__.py` (dois underscores de cada lado). Ele serve para designar o diretório em que se encontra como um pacote Python, permitindo que módulos ali existentes sejam importados por outros. Ele também pode ter código de inicialização do pacote, entre outras coisas.

![Explorer do VS Code com models/__init__.py, filme.py e genero.py](img/p044-1.webp)

*O arquivo __init__.py na pasta models.*

Neste arquivo, vamos importar nossas classes de modelo.

**filmes_app/models/\_\_init\_\_.py**

```python
from .filme import Filme
from .genero import Genero
```

Observe que a existência do arquivo `__init__.py` numa pasta chamada `models` nos permite continuar com os mesmos imports que antes faziam referência ao arquivo original `models.py`. Assim, você pode apagá-lo, ele não será mais necessário.

### Serializers

Agora vamos repetir o processo para as classes serializadoras. Comece criando uma pasta chamada `serializers` na raiz da sua aplicação.

![Explorer do VS Code com a nova pasta filmes_app/serializers em destaque](img/p045-1.webp)

*A pasta serializers.*

Crie um arquivo chamado `genero_serializer.py` dentro da pasta recém-criada. Veja seu conteúdo. Observe que, agora, os imports de modelos precisam ser relativos à existência das duas pastas. Não se esqueça de ajustar, indicando que a pasta `models` é subpasta de `filmes_app`. A definição do serializer é exatamente a mesma que tínhamos antes. Só o import mudou.

**filmes_app/serializers/genero_serializer.py**

```python
from rest_framework import serializers
#lembre-se de ajustar o import
from filmes_app.models import Genero

class GeneroSerializer (serializers.ModelSerializer):
    class Meta:
        model = Genero
        fields = '__all__'
```

Crie um arquivo chamado `filme_serializer.py` dentro da pasta recém-criada. Veja seu conteúdo. Idêntico ao anterior também, a menos do import.

**filmes_app/serializers/filme_serializer.py**

```python
from rest_framework import serializers
#lembre-se de ajustar os imports
from filmes_app.models import Filme
from .genero_serializer import GeneroSerializer

class FilmeSerializer (serializers.ModelSerializer):
    #o nome genero deve ser igual ao nome especificado no modelo de filme
    genero = GeneroSerializer()
    class Meta:
        model = Filme
        fields = '__all__'
```

Crie também um arquivo chamado `__init__.py` na sua pasta `serializers` e importe as classes serializadoras.

**filmes_app/serializers/\_\_init\_\_.py**

```python
from .filme_serializer import FilmeSerializer
from .genero_serializer import GeneroSerializer
```

Neste momento, já podemos apagar o arquivo `serializers.py` original.

### Views

O processo para as views é análogo. Crie uma pasta chamada `views` na raiz da aplicação. Dentro dela, crie um arquivo chamado `__init__.py`.

![Explorer do VS Code com a pasta filmes_app/views e o arquivo __init__.py em destaque](img/p046-1.webp)

*A pasta views.*

A seguir, crie um arquivo chamado `filme_views.py`. Seu conteúdo é o mesmo que tínhamos anteriormente, a menos dos imports. Veja.

**filmes_app/views/filme_views.py**

```python
from rest_framework import generics
#ajuste os imports
from filmes_app.models import Filme
from filmes_app.serializers import FilmeSerializer

class FilmeListCreate(generics.ListCreateAPIView):
    queryset = Filme.objects.all()
    serializer_class = FilmeSerializer

class FilmeRetrieveDestroy(generics.RetrieveDestroyAPIView):
    queryset = Filme.objects.all()
    serializer_class = FilmeSerializer
```

No arquivo `__init__.py` da pasta recém-criada, faça o import das views a partir do novo arquivo.

**filmes_app/views/\_\_init\_\_.py**

```python
from .filme_views import FilmeListCreate, FilmeRetrieveDestroy
```

Neste momento, também já é possível apagar o arquivo `views.py` original.

Pode ser uma boa ideia reiniciar o servidor e realizar novos testes.

## Exercícios
Duration: 30:00

### Exercício 1: pessoas, diretores e atores

Comece clonando o repositório de seu grupo.

**Terminal (G1)**

```bash
git clone https://github.com/professorbossini/20232_maua_tti203_g1_rest_filmes.git .
```

**Terminal (G2)**

```bash
git clone https://github.com/professorbossini/20232_maua_tti203_g2_rest_filmes .
```

* Adicione um novo modelo para representar pessoas. Pessoas têm nome e idade. Implemente endpoints para CRUD básico de pessoas (POST, DELETE, GET e PUT).
* No momento, filmes têm diretor representado como String. Faça com que diretores sejam do tipo Pessoa. Estabeleça um relacionamento 1xN entre filmes e diretores: um filme tem um diretor; um diretor dirige muitos filmes.
* Adicione atores aos filmes, com um relacionamento do tipo NxN. Atores são pessoas. Um filme tem muitos atores; um ator atua em muitos filmes.

Estude sobre relacionamento NxN aqui: [https://docs.djangoproject.com/en/4.2/topics/db/examples/many_to_many/](https://docs.djangoproject.com/en/4.2/topics/db/examples/many_to_many/).

### Exercício 2: filtro por bilheteria

Este exercício foi proposto para quem é do G1 e já fez a aula de reposição do dia 11/09.

Se desejar, clone o projeto do professor. Para tal, crie uma pasta nova, vazia e use

**Terminal**

```bash
git clone https://github.com/professorbossini/pessoal_django_filmes.git .
```

Lembre-se de ativar o ambiente virtual Python (veja o passo "Ambiente virtual e novo projeto Django").

* Adicione um campo "bilheteria" (número real positivo) ao modelo que descreve o que é um filme.
* Execute os passos necessários (migrations) para alterar a estrutura da base de dados gerenciada pelo PostgreSQL.
* Defina um novo endpoint que recebe um valor de bilheteria como **parâmetro de query**. Ou seja, assim: `localhost:8000/filmes?bilheteria=1000` (o trecho `bilheteria=1000` é um parâmetro de query).

O endpoint deve devolver somente os filmes que tenham valor de bilheteria maior ou igual àquele especificado como parâmetro de query. Para fazer esse endpoint, você vai querer estudar o link a seguir: [https://www.django-rest-framework.org/api-guide/filtering/#filtering-against-query-parameters](https://www.django-rest-framework.org/api-guide/filtering/#filtering-against-query-parameters).

<details><summary>Ver resposta</summary>

Veja um exemplo de como poderia ficar. Tente fazer você mesmo antes, estudando a documentação.

**filmes_app/views/filme_views.py**

```python
class FilmeListCreate(generics.ListCreateAPIView):
    serializer_class = FilmeSerializer

    def get_queryset(self):
        queryset = Filme.objects.all()
        min_bilheteria = self.request.query_params.get('bilheteria', None)
        if min_bilheteria is not None:
            queryset = queryset.filter(bilheteria__gte=min_bilheteria)

        return queryset
```

</details>

### Referências

* Django Rest Framework: [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/)
* Generic views do DRF: [https://www.django-rest-framework.org/api-guide/generic-views/](https://www.django-rest-framework.org/api-guide/generic-views/)
* django-environ: [https://pypi.org/project/django-environ/](https://pypi.org/project/django-environ/)
* Gerador de .gitignore: [https://www.toptal.com/developers/gitignore](https://www.toptal.com/developers/gitignore)
