summary: Use a aplicação de autenticação do Django com o Django Rest Framework para cadastrar usuários com validação de senha e fazer login com tokens JWT (access e refresh), usando um PostgreSQL na nuvem (Aiven).
id: django-autenticacao-autorizacao
categories: Django,Python
tags: django,python,django rest framework,autenticacao,autorizacao,jwt,simplejwt,user,serializers,validacao,postgresql,aiven,django-environ
status: Published
authors: Rodrigo Bossini
last updated: 2023-10-09
pdf: django/03_apostila_python_django_autenticacao_e_autorizacao.pdf
exercicios: django/03_exercicio_python_django_autenticacao_e_autorizacao.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Django: autenticação e autorização com DRF e JWT

## Visão geral
Duration: 4:00

Django é um framework **"batteries-included"**. Ele traz diversas funcionalidades comuns prontas para uso. Uma delas é uma aplicação capaz de lidar com **autenticação** e **autorização**. Veja as suas principais características.

* **Modelos predefinidos:** inclui uma classe de modelo que representa usuários, contendo muitos dos campos comuns necessários, como username, password e email.
* **Formulários de autenticação:** inclui templates HTML básicos para as operações mais elementares como login, logout e troca de senha, os quais podem ser personalizados.
* **Views e URLs associadas:** complementando os formulários, o Django já possui views (funções ou classes que determinam o que mostrar ao usuário) e URLs relacionadas para processar pedidos de autenticação. Por exemplo, há views para fazer login, fazer logout, mudar a senha e assim por diante.
* **Sistema de permissões:** além da autenticação básica, o Django oferece um sistema de autorização que permite definir permissões específicas para diferentes tipos de usuários.
* **Segurança:** as senhas são armazenadas criptografadas. Além disso, ele oferece proteção contra ataques de força bruta (tentativas repetidas de adivinhar uma senha, por exemplo).

Neste material, veremos como utilizar a aplicação com

* API REST com o Django Rest Framework (DRF)
* templates (páginas HTML já predefinidas)

### O que você vai aprender

* Como escolher o interpretador Python do ambiente virtual no VS Code
* Como criar um PostgreSQL gratuito na nuvem com o Aiven e acessá-lo pelo VS Code
* Como isolar os dados de acesso à base com o django-environ
* Como usar a classe de modelo `User` do Django e escrever uma serializadora para ela
* Como cadastrar usuários com uma `APIView` e validar senhas com expressões regulares
* O que são access token e refresh token no mecanismo JWT
* Como fazer login com o djangorestframework-simplejwt

### O que você vai precisar

* Python 3 instalado
* VS Code com as extensões Python e Thunder Client
* Uma instância do PostgreSQL (local ou no Aiven)

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

**Nota.** Se você já possuir um ambiente virtual com Django instalado, pode fazer uso dele.

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

![Terminal com a criação e ativação do ambiente e a saída de pip -V apontando para a pasta venv](img/p003-1.webp)

*O pip em uso é o do ambiente virtual.*

O nome do ambiente virtual que você criou também deve aparecer.

![Terminal com o prefixo (venv) destacado no início da linha de comando](img/p003-2.webp)

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
django-admin startproject exemplo_autenticacao_autorizacao
```

Uma pasta deve ter sido criada, ao lado da pasta que representa o seu ambiente virtual.

![Gerenciador de arquivos com a pasta exemplo_autenticacao_autorizacao ao lado de outras pastas de projetos e da pasta venv](img/p004-1.webp)

*A pasta do novo projeto.*

Abra o VS Code e clique em **File >> Open Folder**. Navegue para encontrar a pasta de seu projeto e vincule o VS Code a ela. Veja o resultado esperado.

![Explorer do VS Code com o projeto EXEMPLO_AUTENTICACAO_AUTORIZACAO contendo a pasta exemplo_autenticacao_autorizacao e o arquivo manage.py](img/p005-1.webp)

*O projeto aberto no VS Code.*

<aside class="positive">

**Nota.** É recomendável manter o VS Code em modo de salvamento automático, clicando em **File >> Auto Save**.

</aside>

![Menu File do VS Code com a opção Auto Save em destaque](img/p005-2.webp)

*Ative o Auto Save.*

No VS Code, clique em **Terminal >> New terminal** para abrir um terminal interno do VS Code. Lembre-se de ativar o ambiente virtual que criamos anteriormente, assim ele será válido para essa instância de terminal que acabamos de abrir.

<aside class="negative">

**Cuidado.** O ambiente virtual se encontra numa pasta chamada `venv` que está um nível acima da pasta em que estamos no momento. Por isso, use `../` para acessá-la. Em seu ambiente, é possível que ela esteja num diretório diferente. Se tiver dúvidas, use seu path completo. Por exemplo: `C:\Users\usuario\Documents\dev\django\venv` se estiver no Windows.

</aside>

Veja o resultado esperado. Use o comando apropriado para o seu sistema operacional.

![Terminal interno do VS Code com o ambiente virtual ativado](img/p006-1.webp)

*O ambiente virtual ativado no terminal do VS Code.*

## O interpretador Python no VS Code
Duration: 8:00

Caso ainda não tenha feito, instale a extensão **Python** no VS Code.

![Aba de extensões do VS Code com a extensão Python da Microsoft selecionada](img/p006-2.webp)

*A extensão Python para o VS Code.*

A extensão Python para o VS Code inclui diversas outras. Uma delas se chama **PyLance**. Ela oferece dicas para completar código, permite a "navegação no código" (clicar num nome e ir até a sua definição), entre outras coisas. A PyLance baseia o seu funcionamento no ambiente Python ativo no momento. Embora tenhamos ativado o ambiente que inclui o Django em nossos terminais, pode ser que o VS Code esteja utilizando outro ambiente. Se for o caso, a PyLance não será capaz de dar dicas envolvendo os pacotes específicos do nosso ambiente virtual. Abra, por exemplo, o arquivo `urls.py` do projeto. É possível que os imports do Django apareçam sublinhados em amarelo.

![Arquivo urls.py do projeto aberto no VS Code com os imports do Django sublinhados em amarelo](img/p007-1.webp)

*Imports do Django sublinhados: o VS Code não está usando o venv.*

Se for o caso, você pode trocar o ambiente Python utilizado pelo VS Code. Ele aparece na barra azul de status, na parte inferior do VS Code. No exemplo a seguir, não estamos usando o venv.

![VS Code com a versão do Python destacada na barra de status inferior](img/p008-1.webp)

*O interpretador em uso aparece na barra de status.*

Clique nesta região. Você poderá escolher o seu ambiente.

![Lista "Select Interpreter" aberta com a opção Enter interpreter path em destaque](img/p009-1.webp)

*Escolhendo o interpretador.*

Clique em **Find**.

![Campo "Enter path to a Python interpreter" com a opção Find... em destaque](img/p009-2.webp)

*Clique em Find.*

Navegue no seu sistema de arquivos para encontrar o executável Python de seu ambiente. Observe que ele fica na sua pasta `venv`. A sua versão pode ser diferente.

![Janela "Select Python Interpreter" navegando até venv/bin, com python3.11 selecionado e o botão Select Interpreter em destaque](img/p009-3.webp)

*O executável Python do venv.*

Veja o resultado depois da troca.

![VS Code com o interpretador do venv na barra de status e os imports sem sublinhado](img/p010-1.webp)

*O VS Code agora usa o ambiente virtual.*

## Dependências e PostgreSQL no Aiven
Duration: 15:00

Como comentamos, as funcionalidades de autenticação/autorização serão oferecidas por meio de

* templates
* API REST

Por conta da API Rest, vamos instalar o **Django Rest Framework (DRF)**. Veja o site do DRF: [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/).

Além disso, nossa aplicação se conectará a uma instância do PostgreSQL e, para tal, ela precisa ser capaz de se comunicar utilizando o protocolo do PostgreSQL. Ele é implementado por diferentes pacotes, que geralmente levam o nome de "driver". Neste material, vamos utilizar o pacote **psycopg2**. No terminal do VS Code, use

**Terminal**

```bash
pip install djangorestframework psycopg2
```

para instalar ambos.

### Um PostgreSQL na nuvem com o Aiven

<aside class="positive">

**Nota.** Talvez você queira fazer uso de um serviço de computação em nuvem que ofereça uma instância do PostgreSQL gratuitamente. Uma opção é o **Aiven**. Veja sua página oficial: [https://aiven.io/](https://aiven.io/).

</aside>

Clique em **Get Started for Free**.

![Página inicial do Aiven com o botão Get started for free em destaque](img/p011-1.webp)

*A página do Aiven.*

Depois de criar a conta, você receberá um e-mail de confirmação. É preciso realizar esta confirmação antes de utilizar o ambiente.

![E-mail de boas-vindas do Aiven com o link Activate your account](img/p012-1.webp)

*O e-mail de confirmação da conta.*

Depois de fazer login, você precisa criar um serviço.

![Tela Services do Aiven com o botão Create service em destaque](img/p012-2.webp)

*Criando um serviço.*

Escolha o PostgreSQL.

![Tela "Select service" do Aiven com a opção PostgreSQL em destaque](img/p013-1.webp)

*Escolha o PostgreSQL.*

Escolha o plano grátis e clique para criar um serviço. Se desejar, na parte inferior da tela, altere o nome do serviço. Use um nome que te ajude a lembrar a razão de ser do serviço, seu propósito, sua finalidade.

![Tela de criação do serviço PostgreSQL com o plano Free e o botão de criar em destaque](img/p013-2.webp)

*O plano grátis.*

No próximo passo, você pode adicionar os endereços IP a partir dos quais seu serviço aceitará conexões. É uma medida de segurança. No momento, não precisamos nos preocupar com isso. Clique **Next**.

![Tela "Allowed inbound IP addresses" do Aiven com o botão Next](img/p014-1.webp)

*Endereços IP permitidos.*

A seguir, você também pode adicionar dados de bases de dados que eventualmente já possua. Também não estamos interessados no momento. Clique **Next**.

![Tela "Add data to your database" do Aiven com o botão Next](img/p014-2.webp)

*Migração de dados existentes (opcional).*

Depois disso, você pode escolher extensões que eventualmente deseje instalar.

![Tela de extensões do PostgreSQL no Aiven](img/p015-1.webp)

*Extensões do PostgreSQL.*

Apenas instale aquelas de que realmente precisa. Se você estiver na dúvida, não instale nenhuma, por enquanto. Clique para finalizar quando terminar.

Observe que, agora, você pode obter os dados para acesso à sua base de dados remota.

![Tela Overview do serviço no Aiven com os dados de conexão: host, porta, usuário, senha e nome do banco](img/p015-2.webp)

*Os dados de acesso à base remota.*

Você pode utilizar diferentes clientes para se conectar à sua base. Neste exemplo, vamos utilizar a seguinte extensão do VS Code.

![Página da extensão Database Client (MySQL, PostgreSQL e outros bancos) no VS Code](img/p016-1.webp)

*A extensão Database Client.*

Depois da instalação, você pode criar uma conexão.

![Painel da extensão Database com o botão de criar conexão em destaque](img/p016-2.webp)

*Criando uma conexão.*

A seguir, preencha os campos, clique em **Save** e **Connect**.

![Formulário de conexão com o tipo PostgreSQL e os campos de host, porta, usuário, senha e banco preenchidos, com o botão Save em destaque](img/p017-1.webp)

*Os dados da conexão.*

Se tudo deu certo, você deverá ver a mensagem **Connect success**.

![Formulário de conexão com a mensagem Connect success](img/p017-2.webp)

*Conexão bem-sucedida.*

Agora é preciso expandir a conexão e o banco de dados, além de clicar no ícone destacado a seguir.

![Árvore da conexão expandida com o ícone de abrir uma nova consulta em destaque](img/p018-1.webp)

*Abrindo um editor de consultas.*

Você terá acesso a um editor em que poderá digitar seus comandos SQL. Faça o seguinte teste.

**Editor SQL**

```sql
CREATE TABLE tb_teste(
    cod_teste SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

INSERT INTO tb_teste(nome) VALUES('teste1');
SELECT * FROM tb_teste;
```

Selecione o código e aperte **CTRL + Enter** para executar.

![Editor SQL com os comandos de teste e o resultado do SELECT com a linha teste1](img/p018-2.webp)

*O teste executado no PostgreSQL remoto.*

## Aplicação e variáveis de ambiente
Duration: 12:00

### Nova aplicação

Até então, temos apenas um projeto Django. Agora precisamos criar uma aplicação que fará parte dele. Para isso, use

**Terminal**

```bash
python manage.py startapp exemplo_autenticacao_autorizacao_app
```

Veja o resultado esperado.

![Explorer do VS Code com a nova pasta exemplo_autenticacao_autorizacao_app em destaque](img/p019-1.webp)

*A pasta da nova aplicação.*

### Adicionando aplicações ao projeto

No arquivo `settings.py` do projeto, precisamos adicionar a nossa aplicação como parte dele, na lista de `INSTALLED_APPS`. Como vamos usar o DRF, também precisamos adicionar uma aplicação chamada `rest_framework`. Veja.

**exemplo_autenticacao_autorizacao/settings.py**

```python
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
    "exemplo_autenticacao_autorizacao_app"
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    # ...
]
```

<aside class="negative">

Na apostila, este trecho lista a aplicação como `"exemplo_autenticacao_autorizacao"`, sem o sufixo `_app`. Use o nome exato da aplicação criada pelo `startapp`: `exemplo_autenticacao_autorizacao_app`.

</aside>

### Isolando os dados de acesso à base com django-environ

Desejamos isolar os dados de acesso à base de dados por duas razões, pelo menos.

* controle de versão em repositórios públicos
* facilidade de alteração dos valores em função do ambiente (desenvolvimento, produção etc.)

Para defini-los, vamos usar o pacote **django-environ**. Faça a sua instalação com

**Terminal**

```bash
pip install django-environ
```

A seguir, crie um arquivo chamado `.env` na raiz do projeto, fora de qualquer pasta, lado a lado com o arquivo `manage.py`.

![Explorer do VS Code com o arquivo .env na raiz do projeto, ao lado de manage.py](img/p020-1.webp)

*O arquivo .env na raiz do projeto.*

Veja seu conteúdo. Neste exemplo, estamos utilizando um banco de dados gerenciado pelo PostgreSQL por meio do serviço Aiven. Você também pode usar uma base local, se desejar.

<aside class="positive">

**Nota.** O valor de `SECRET_KEY`, neste exemplo, foi obtido do próprio arquivo `settings.py` criado originalmente quando criamos o projeto. Basta copiar seu conteúdo.

</aside>

**.env**

```ini
SECRET_KEY=django-insecure-es!1$*fjkcfm7j_c=tyy-it9r#w9+eh6f0v2by80cpi6jf4^u!
DEBUG=True
DATABASE_DEFAULT_NAME=defaultdb
DATABASE_DEFAULT_USER=avnadmin
DATABASE_DEFAULT_PASSWORD=sua senha do Aiven aqui
DATABASE_DEFAULT_HOST=pg-1bd68abd-professorbossini.aivencloud.com
DATABASE_DEFAULT_PORT=12956
```

Já no arquivo `settings.py` do projeto, faça a leitura do seu arquivo `.env` e, então, passe a utilizar os valores nele definidos, por meio da função `env`.

**exemplo_autenticacao_autorizacao/settings.py**

```python
# ...
from pathlib import Path
import environ
env = environ.Env(
    #deixamos False por padrão
    #caso o .env não defina, por segurança, é melhor, já que o ambiente pode ser o de produção
    DEBUG = (bool, False)
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
environ.Env.read_env(BASE_DIR / Path(".env"))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

ALLOWED_HOSTS = []
# Application definition
# INSTALLED_APPS = [
# ...

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

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

Faça uma primeira execução de migração, atualizando as bases referentes às aplicações já existentes no projeto.

**Terminal**

```bash
python manage.py migrate
```

Se tudo deu certo, você deverá visualizar as tabelas criadas pelo Django.

![Extensão Database do VS Code listando as tabelas criadas pelo Django, como auth_user, auth_group e django_migrations](img/p022-1.webp)

*As tabelas criadas pelas migrações.*

## A classe User e a serializadora
Duration: 12:00

A aplicação de autenticação/autorização do Django possui uma classe de modelo chamada **User**. Como o nome sugere, ela serve para representar possíveis usuários do sistema. Se desejar, você pode averiguar seu código fonte. Ele pode ser encontrado em seu diretório venv. Algo como

```text
venv/lib/python3.11/site-packages/django/contrib/auth/
```

Se desejar, você também pode encontrar o código fonte no Github: [https://github.com/django/django/blob/main/django/contrib/auth/models.py](https://github.com/django/django/blob/main/django/contrib/auth/models.py).

Veja um trecho da classe `User`.

**django/contrib/auth/models.py (trecho)**

```python
class User(AbstractUser):
    """
    Users within the Django authentication system are represented by this
    model.

    Username and password are required. Other fields are optional.
    """

    class Meta(AbstractUser.Meta):
        swappable = "AUTH_USER_MODEL"
```

Observe como ela herda de `AbstractUser`. Veja um trecho dela.

**django/contrib/auth/models.py (trecho)**

```python
class AbstractUser(AbstractBaseUser, PermissionsMixin):
    """
    An abstract base class implementing a fully featured User model with
    admin-compliant permissions.

    Username and password are required. Other fields are optional.
    """

    username_validator = UnicodeUsernameValidator()

    username = models.CharField(
        _("username"),
        max_length=150,
        unique=True,
        help_text=_(
            "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )
    first_name = models.CharField(_("first name"), max_length=150, blank=True)
    last_name = models.CharField(_("last name"), max_length=150, blank=True)
    email = models.EmailField(_("email address"), blank=True)
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
```

Veja uma descrição de alguns campos que a classe `User` possui.

* **username**: o nome de usuário, único, usado para autenticar o usuário. É um campo obrigatório.
* **password**: senha do usuário, criptografada pelo Django antes de ser armazenada.
* **email**: endereço de email do usuário.
* **first_name** e **last_name**: primeiro e último nome do usuário.
* **groups**: um relacionamento muitos para muitos (`ManyToManyField`) com o modelo `Group`, permitindo que você agrupe usuários e atribua permissões a esses grupos.
* **user_permissions**: um relacionamento muitos para muitos (`ManyToManyField`) com o modelo `Permission`, permitindo que você atribua permissões específicas a um usuário específico, independentemente dos grupos.

### A serializadora de usuários

Como a classe de modelo já está pronta, vamos criar uma classe serializadora para escolher os campos que nos são de interesse. Para isso, crie uma pasta chamada `serializers` na raiz da aplicação e, dentro dela, um arquivo chamado `__init__.py`, vazio num primeiro momento. Crie também um arquivo chamado `user_serializer.py`.

![Explorer do VS Code com a pasta serializers contendo __init__.py e user_serializer.py em destaque](img/p024-1.webp)

*A pasta serializers.*

No arquivo `user_serializer.py`, escreva a classe `UserSerializer`. Vamos escolher quais campos farão parte das operações da aplicação (farão parte do objeto JSON recebido e produzido e, por consequência, do objeto Python envolvido nas conversões).

<aside class="positive">

**Nota.** A classe `Meta` existe a fim de manter o código organizado. Seu corpo contém, como seu nome sugere, metadados. São, em geral, dados de configurações. Classes de modelo também podem ter uma classe `Meta`, como no exemplo a seguir, em que a funcionalidade primária da classe `Book` é representar livros e a classe `Meta`, interna a ela, especifica que os registros devem ser ordenados de acordo com a coluna `title`.

</aside>

**Exemplo: classe Meta num modelo**

```python
class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    class Meta:
        ordering = ['title']
```

Veja o código da serializadora de usuários.

**exemplo_autenticacao_autorizacao_app/serializers/user_serializer.py**

```python
from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
```

A fim de simplificar o import a ser realizado em outros módulos externos, importe a classe `UserSerializer` no arquivo `__init__.py` que criamos há pouco.

**exemplo_autenticacao_autorizacao_app/serializers/\_\_init\_\_.py**

```python
#arquivo serializers/__init__.py
from .user_serializer import UserSerializer
```

## Cadastro de novos usuários
Duration: 15:00

A seguir, definimos uma View que viabiliza o cadastro de novos usuários. Para defini-la, crie uma pasta chamada `views` na raiz da aplicação. A seguir, crie um arquivo chamado `__init__.py` e outro chamado `usuario_views.py`.

![Explorer do VS Code com a pasta views contendo __init__.py e usuario_views.py, e uma seta indicando que o views.py original deve ser apagado](img/p026-1.webp)

*A pasta views (o views.py original pode ser apagado).*

Veja o código do arquivo `views/__init__.py`.

**exemplo_autenticacao_autorizacao_app/views/\_\_init\_\_.py**

```python
from .usuario_views import CadastroNovoUsuarioView
```

Veja as características da nova view.

* Se chama `CadastroNovoUsuarioView`.
* Herda de `views.APIView`. Essa é uma classe base para views do DRF. Ela oferece acesso mais direto aos dados da requisição e nos permite especificar explicitamente os métodos do protocolo HTTP desejados.
* Possui um método chamado `post`. Ele é acionado quando uma requisição do tipo post for recebida. Como parâmetro, ele tem um objeto chamado `request`. Ele dá acesso aos dados recebidos na requisição.
* Instanciamos um `UserSerializer` e a ele entregamos os campos da request, acessíveis por meio do seu campo `data`. Internamente, cada serializadora tem seu próprio campo também chamado `data`. Esse é um dicionário que contém todos os dados sobre os quais a serializadora opera.
* Verificamos se os dados recebidos são "válidos" usando o método `is_valid`. Neste momento, por exemplo, a serializadora verifica, no banco de dados, se o username recebido já existe por lá. Se for o caso, a requisição terá como resposta um erro da família 400, ou seja, causado pela aplicação cliente. Há diversas validações padrão e também podemos especificar outras que nos sejam de interesse.
* Acessamos a coleção de usuários e criamos um novo usuário. Após a validação, os campos validados se encontram na propriedade `validated_data` da classe serializadora. Observe que usamos o operador `**` para "desestruturar" o dicionário `validated_data`. Isso acontece pois o método `create_user` espera receber uma coleção de pares chave/valor "avulsos", não incluídos em um dicionário.
* Se o cadastro foi feito corretamente, devolvemos um objeto `Response`. Ele contém os dados de interesse (geralmente os dados do próprio objeto que foi criado) e o status do protocolo HTTP **201 Created**, indicando que um recurso foi criado.
* Se o cadastro falhou, devolvemos o objeto `errors` da classe serializadora. Ele contém as mensagens de erro que explicam os erros eventualmente encontrados. Além disso, o código de status do protocolo HTTP será **400 Bad Request**, indicando que houve um erro causado pela requisição que foi enviada pelo cliente (e não foi um erro interno do servidor).

<aside class="positive">

**Nota.** Inspire-se no código a seguir para lembrar sobre o funcionamento do `kwargs` do Python.

</aside>

**Exemplo: argumentos nomeados e o operador \*\***

```python
def exibe_nomes(**nomes):
    for nome in nomes.values():
        print(nome)

#passando valores como argumentos nomeados, ou seja, chave=valor, avulsos, sem precisar de um dicionário
exibe_nomes(nome1='João', nome2='Maria', nome3='José')

#construindo um dicionário
pessoa = {'nome':'João'}

#tentando passar o dicionário inteiro
#vai dar erro, pois, assim, o dicionário é um argumento posicional, e a função espera argumentos nomeados
exibe_nomes(pessoa)

#para passar os dados do dicionário como argumentos nomeados, usamos o operador **, desempacotando o dicionário
exibe_nomes(**pessoa)
```

Veja o código da view.

**exemplo_autenticacao_autorizacao_app/views/usuario_views.py**

```python
from rest_framework import views, status
from rest_framework.response import Response
from exemplo_autenticacao_autorizacao_app.serializers import UserSerializer
from django.contrib.auth.models import User
class CadastroNovoUsuarioView(views.APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(**serializer.validated_data)
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

A seguir, criamos um arquivo `urls.py` para definir os mapeamentos específicos da aplicação.

![Explorer do VS Code com o arquivo urls.py dentro da pasta da aplicação em destaque](img/p028-1.webp)

*O urls.py da aplicação.*

Veja seu conteúdo. Fazemos um primeiro mapeamento.

**exemplo_autenticacao_autorizacao_app/urls.py**

```python
from django.urls import path
from exemplo_autenticacao_autorizacao_app.views import CadastroNovoUsuarioView
urlpatterns = [
    path('signup/', CadastroNovoUsuarioView.as_view(), name='signup'),
]
```

<aside class="positive">

**Nota.** O parâmetro `name` serve para algumas coisas.

* **Reversão de URL:** permite recuperarmos a URL, sem ser necessário digitá-la explicitamente no código, o que poderia ser pouco prático para manutenções futuras.
* **Uso da url em templates:** num template (página HTML) você pode usar a URL por meio de seu nome, também sem ter de digitá-la explicitamente, como em `<a href="{% url 'signup' %}">Cadastre-se</a>`.

</aside>

A seguir, precisamos incluir as urls da aplicação ao arquivo `urls.py` do projeto. Lembre-se que ele fica na pasta do projeto.

![Explorer do VS Code com o urls.py da pasta do projeto em destaque](img/p029-1.webp)

*O urls.py do projeto.*

**exemplo_autenticacao_autorizacao/urls.py**

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', include('exemplo_autenticacao_autorizacao_app.urls'))
]
```

Certifique-se de que o servidor está em execução.

**Terminal**

```bash
python manage.py runserver
```

![Terminal com o servidor Django em execução em http://127.0.0.1:8000/](img/p030-1.webp)

*O servidor em execução.*

Na Thunder Client, faça um teste.

![Thunder Client com POST para localhost:8000/signup/, corpo JSON com username, email e password e resposta 201 Created com id, username e email](img/p031-1.webp)

*Cadastro de um usuário: a senha não aparece na resposta.*

Faça um SELECT no banco e verifique se o usuário foi, de fato, cadastrado. Observe que a senha foi criptografada antes de ser armazenada. Inspecione também os demais campos.

![Resultado de SELECT * FROM auth_user com o usuário cadastrado e a senha armazenada criptografada](img/p031-2.webp)

*A senha armazenada criptografada.*

De volta à Thunder Client, tente cadastrar um novo usuário com username igual ao do anterior. Veja o erro causado.

![Thunder Client com resposta 400 Bad Request e a mensagem "A user with that username already exists."](img/p032-1.webp)

*Username repetido.*

Altere o username. Ao mesmo tempo, especifique um e-mail inválido. Veja o erro.

![Thunder Client com resposta 400 Bad Request e a mensagem "Enter a valid email address."](img/p032-2.webp)

*E-mail inválido.*

## Validando a senha
Duration: 15:00

Observe que estamos admitindo senhas não muito seguras. Caso queiramos especificar uma validação específica para um determinado campo, temos diferentes alternativas.

* escrever um método `validate_nome_do_campo` na classe serializadora.
* sobrescrever o método `validate` da classe serializadora (isso nos permite validar diversos campos de uma só vez). Ele recebe um parâmetro `data` e pegamos um campo assim: `data.get('nome_do_campo')`.
* escrever uma função num arquivo à parte, próprio para armazenar validadores, e depois utilizá-la numa classe de modelo. Veja um exemplo. Apenas observe, não vamos utilizar este modo ainda.

**Exemplo (apenas observe)**

```python
#arquivo qualquer
def validar_password(password):
    #logica de validacao
    pass
#numa classe de modelo
password = models.CharField(validators=[validar_password])
```

Neste momento, vamos utilizar a primeira estratégia. Na classe serializadora, escreva o seguinte método. Esta implementação informa que toda senha é inválida. Claro, vamos aprimorar a seguir. Estamos no arquivo `user_serializer.py`.

**exemplo_autenticacao_autorizacao_app/serializers/user_serializer.py**

```python
from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    #tem que ser esse nome: validate_nome_do_campo
    def validate_password(self, password):
        raise serializers.ValidationError("Senha inválida")

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
```

Vamos validar utilizando **expressões regulares**. As regras serão as seguintes:

* Pelo menos uma letra maiúscula
* Pelo menos uma letra minúscula
* Pelo menos um número
* Pelo menos um símbolo especial
* Pelo menos oito caracteres

Se desejar, estude mais sobre expressões regulares em Python em [https://docs.python.org/3/library/re.html](https://docs.python.org/3/library/re.html).

<aside class="positive">

**Nota.** Em Python, uma string escrita assim: `r'abc'` é uma **raw string**. Significa que seu conteúdo é tratado literalmente. Não há caracteres de escape antecedidos por barra invertida. É útil, por exemplo, para a especificação de diretórios. Também é útil no contexto de expressões regulares. Neste contexto, `\d` simboliza um dígito qualquer.

</aside>

**Exemplo: raw strings**

```python
#sem raw string
path1 = 'C:\\Users\\rodrigo\\Documents'

#com raw string
path2 = r'C:\Users\rodrigo\Documents'

#sem raw string
digito_qualquer = '\\d'

#com raw string
digito_qualquer = r'\d'
```

Veja a implementação do validador.

**exemplo_autenticacao_autorizacao_app/serializers/user_serializer.py**

```python
from django.contrib.auth.models import User
from rest_framework import serializers
import re

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    #tem que ser esse nome: validate_nome_do_campo
    def validate_password(self, password):
        #pelo menos uma letra maiuscula
        if not re.search('[A-Z]', password):
            raise serializers.ValidationError("A senha deve conter pelo menos uma letra maiúscula")
        #pelo menos uma letra minuscula
        if not re.search('[a-z]', password):
            raise serializers.ValidationError("A senha deve conter pelo menos uma letra minúscula")
        #pelo menos um numero
        if not re.search('[0-9]', password):
            raise serializers.ValidationError("A senha deve conter pelo menos um número")
        #pelo menos um caracter especial (o ^ é para negar)
        if not re.search('[^a-zA-Z0-9]', password):
            raise serializers.ValidationError("A senha deve conter pelo menos um caracter especial")
        #pelo menos oito caracteres
        if len(password) < 8:
            raise serializers.ValidationError("A senha deve conter pelo menos oito caracteres")
        return password

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
```

Na Thunder Client, faça novos testes. Veja alguns exemplos.

![Thunder Client com senha sem letra maiúscula e a resposta 400 "A senha deve conter pelo menos uma letra maiúscula"](img/p035-1.webp)

*Senha sem letra maiúscula.*

![Thunder Client com senha sem letra minúscula e a resposta 400 "A senha deve conter pelo menos uma letra minúscula"](img/p035-2.webp)

*Senha sem letra minúscula.*

![Thunder Client com senha sem número e a resposta 400 "A senha deve conter pelo menos um número"](img/p036-1.webp)

*Senha sem número.*

![Thunder Client com senha sem caractere especial e a resposta 400 "A senha deve conter pelo menos um caracter especial"](img/p036-2.webp)

*Senha sem caractere especial.*

![Thunder Client com senha curta e a resposta 400 "A senha deve conter pelo menos oito caracteres"](img/p036-3.webp)

*Senha com menos de oito caracteres.*

![Thunder Client com uma senha válida e a resposta 201 Created com o usuário cadastrado](img/p036-4.webp)

*Senha válida: usuário cadastrado.*

## Login com JWT
Duration: 18:00

Para fazer login, o usuário precisa mostrar-se autêntico. Há diferentes mecanismos de autenticação, como Bearer Token Authentication, Basic, Digest, entre outros. Neste material, vamos utilizar o mecanismo **Bearer Token Authentication com JWT** (JSON Web Token).

**Como funciona:** após o login bem-sucedido, o servidor envia um token que o cliente deve incluir nas solicitações subsequentes para acessar recursos protegidos. Esse token é geralmente incluído no cabeçalho da requisição, precedido pela palavra "Bearer".

<aside class="positive">

**Nota.** Bearer significa algo como "detentor".

</aside>

Em geral, quando utilizamos o mecanismo JWT, dois tipos de tokens estão envolvidos:

> **Access Token**
>
> O token de acesso (access token) é usado para acessar e autenticar requisições em endpoints protegidos. Ele tem todas as informações necessárias para identificar e autorizar um usuário.

* **Duração:** ele tem uma duração curta, o que significa que expira rapidamente. Isso é intencional, pois se um token de acesso for comprometido, ele poderá ser utilizado com más intenções por pouco tempo.
* **Informações:** normalmente, carrega informações sobre o usuário e/ou suas permissões. Isso permite que o servidor saiba quem está fazendo a requisição e o que essa pessoa tem permissão para acessar.

> **Refresh Token**
>
> O token de atualização (refresh token) não é usado para acessar endpoints diretamente. Ele é usado para obter um novo token de acesso quando o anterior expira.

* **Duração:** geralmente tem uma duração muito mais longa do que o token de acesso. Pode durar dias, semanas ou até mais, dependendo da implementação.
* **Segurança:** em muitas implementações, o refresh token é guardado de maneira segura no lado do servidor. Se um refresh token for comprometido, o impacto pode ser significativo, já que ele pode ser usado para obter tokens de acesso continuamente até sua expiração.
* **Rotação:** algumas implementações usam a técnica de rotação de token. Nela, cada vez que um refresh token é usado para obter um novo access token, um novo refresh token é também gerado e o anterior é invalidado. Isso garante que, se um refresh token for comprometido, ele só possa ser usado uma vez.

### djangorestframework-simplejwt

Para utilizar este mecanismo com Django, vamos usar o pacote **djangorestframework-simplejwt**. Faça a sua instalação com

**Terminal**

```bash
pip install djangorestframework-simplejwt
```

A seguir, no arquivo `settings.py`, vamos fazer os seguintes ajustes.

* Adicionar a nova aplicação à lista de aplicações instaladas no projeto.
* Apontar qual a classe responsável pela autenticação.
* Fazer configurações quanto ao funcionamento do mecanismo de autenticação JWT.

**exemplo_autenticacao_autorizacao/settings.py**

```python
# ...

from pathlib import Path
import environ
#representa uma duração de tempo
from datetime import timedelta

# ...

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "exemplo_autenticacao_autorizacao_app",
    "rest_framework_simplejwt.token_blacklist"
]

# ...

SIMPLE_JWT = {
    #quanto tempo o token vai durar
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    #quanto tempo o refresh token vai durar
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    #se o refresh token vai ser rotacionado
    'ROTATE_REFRESH_TOKENS': False,
    #algoritmo de criptografia
    'ALGORITHM': 'HS256',
    #chave de criptografia
    'SIGNING_KEY': env('SECRET_KEY'),
    #tipos de autenticação, vamos usar apenas o Bearer. Tem que ser uma tupla, por isso a virgula no final
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ...
```

<aside class="negative">

Na apostila, a lista `INSTALLED_APPS` deste trecho mostra `"filmes_app"` (de outro projeto) no lugar da aplicação deste projeto. Mantenha `"exemplo_autenticacao_autorizacao_app"`, como acima.

</aside>

O próximo passo é dar acesso às funcionalidades de obtenção dos tokens de acesso e de atualização. Para tal, podemos usar views definidas pelo próprio `rest_framework_simplejwt` que instalamos. No arquivo `urls.py` do projeto, faça o ajuste a seguir.

**exemplo_autenticacao_autorizacao/urls.py**

```python
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    #para obter um access token e um refresh token em função de um username e password
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    #para obter um novo access token em função de um refresh token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include('exemplo_autenticacao_autorizacao_app.urls'))
]
```

Reinicie a aplicação com

**Terminal**

```bash
python manage.py runserver
```

Observe que a aplicação que instalamos (`token_blacklist`) possui migrações necessárias para seu correto funcionamento.

![Terminal com o aviso de migrações não aplicadas para token_blacklist e a instrução "Run 'python manage.py migrate' to apply them."](img/p040-1.webp)

*Migrações pendentes do token_blacklist.*

Por isso, execute

**Terminal**

```bash
python manage.py migrate
```

![Saída do migrate aplicando as migrações do token_blacklist com OK](img/p041-1.webp)

*As migrações do token_blacklist aplicadas.*

Coloque o servidor em execução uma vez mais com

**Terminal**

```bash
python manage.py runserver
```

Para testar, comece criando um usuário com a Thunder Client, caso ainda não tenha um ou não se lembre da senha daqueles que já foram cadastrados.

![Thunder Client com POST para localhost:8000/signup/ e a resposta 201 Created do novo usuário](img/p041-2.webp)

*Criando um usuário para o teste de login.*

Agora tente obter um token de acesso. Observe que o método a ser usado é o **POST**.

![Thunder Client com POST para localhost:8000/token/, corpo com username e password e resposta contendo refresh e access](img/p042-1.webp)

*O login devolve um refresh token e um access token.*

A resposta contém um access token e um refresh token. Copie o refresh token e faça novo teste, a fim de obter um novo access token.

![Thunder Client com POST para localhost:8000/token/refresh/, corpo com o refresh token e resposta contendo um novo access token](img/p042-2.webp)

*Um novo access token obtido com o refresh token.*

## Exercícios
Duration: 30:00

Neste exercício, você criará um endpoint para **redefinição de senha**. Para acessá-lo, o aplicativo cliente enviará um objeto JSON com um campo de email apenas. O servidor deve montar uma URL que, quando acessada, permite a redefinição de senha. A seguir, ele envia um email para o usuário, instruindo-o a utilizar o link para reconfigurar a sua senha. Para isso, utilize as seguintes dicas.

### Configurações de e-mail

Faça as seguintes configurações no `settings.py`.

**settings.py**

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'seu_email@gmail.com'
EMAIL_HOST_PASSWORD = 'sua_senha'
```

<aside class="positive">

**Dica.** Se desejar, utilize seu Gmail. Para tal, visite [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) e gere uma senha de aplicativo. Assim você não utilizará a sua senha pessoal. A senha gerada deve ser usada normalmente, onde você usaria a sua senha.

</aside>

### Modelo e endpoints

Crie uma classe de modelo `PasswordResetToken` com

* `user` (ForeignKey apontando para `User` de `django.contrib.auth.models`)
* `token` (UUIDField, importe o pacote `uuid` para gerar)
* `created_at` (DateTimeField)

Crie um arquivo para views chamado `reset_password_views.py`. Implemente o seguinte endpoint:

```python
@api_view(['POST'])
def request_password_reset(request):
    ...
```

Ele deve:

* Obter o email da request.
* Verificar se, na base, há um usuário com aquele e-mail cadastrado (`User.objects.get`). Devolver 404 se não existir.
* Construir um `PasswordResetToken` vinculado ao usuário (`reset_token = PasswordResetToken(user=user)`) e salvar no banco com `save`.
* Montar um link para reset de password: `reset_link = f"https://localhost:8000/reset-password/{reset_token.token}"`
* Enviar o e-mail com a função `send_mail` (`from django.core.mail import send_mail`): [https://docs.djangoproject.com/en/3.2/topics/email/#send-mail](https://docs.djangoproject.com/en/3.2/topics/email/#send-mail)
* Devolver 200 e uma mensagem dizendo que o e-mail foi enviado com sucesso.

Ainda no arquivo `reset_password_views.py`, crie outro endpoint:

```python
@api_view(['POST'])
def reset_password(request, token):
    ...
```

Ele deve

* Verificar se o token existe (`reset_token = PasswordResetToken.objects.get(token=token)`). Se não existir, devolver 400.
* Da requisição, pegar a senha do JSON enviado pelo cliente: `{"password": "nova-senha"}`.
* Configurar a nova senha do usuário com `reset_token.user.set_password(new_password)` e `reset_token.user.save()`.
* Apagar o token com `reset_token.delete()`.
* Devolver 200.

Configure as novas URLs.

**urls.py da aplicação (trecho)**

```python
urlpatterns = [
    # ... (mapeamentos já existentes)
    path('request-password-reset/', request_password_reset, name='request_password_reset'),
    path('reset-password/<uuid:token>/', reset_password, name='reset_password'),
]
```

Envie novas requisições POST a fim de

* obter novo token para nova senha
* configurar nova senha (token como path e password no corpo da requisição)

### Referências

* Django Rest Framework: [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/)
* Código fonte da classe User: [https://github.com/django/django/blob/main/django/contrib/auth/models.py](https://github.com/django/django/blob/main/django/contrib/auth/models.py)
* Expressões regulares em Python: [https://docs.python.org/3/library/re.html](https://docs.python.org/3/library/re.html)
* Aiven: [https://aiven.io/](https://aiven.io/)
