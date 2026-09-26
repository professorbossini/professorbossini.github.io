summary: Escreva um programa Python que usa a API da OpenAI para que o ChatGPT diga se uma frase digitada pelo usuário expressa sentimento positivo, neutro ou negativo.
id: chatgpt-python-analise-sentimentos
categories: IA,Python
tags: chatgpt,openai,python,venv,python-dotenv,analise de sentimentos,prompt,completion
status: Published
authors: Rodrigo Bossini
last updated: 2023-08-21
pdf: chatgpt/01_apostila_chatgpt_python_analise_sentimentos.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# ChatGPT com Python: análise de sentimentos

## Visão geral
Duration: 3:00

Neste material, desenvolveremos uma aplicação capaz de conversar com o **ChatGPT** por meio de sua API. A intenção é verificar o **sentimento** associado a uma frase digitada pelo usuário.

### O que você vai aprender

* Como criar e ativar um ambiente virtual Python
* Como obter uma chave de API da OpenAI
* Como guardar a chave em um arquivo `.env` e lê-la com o python-dotenv
* Como declarar dependências em um `requirements.txt`
* Como montar um prompt e obter um completion com o módulo `openai`

### O que você vai precisar

* Python 3 instalado
* VS Code
* Uma conta na OpenAI

## Nova pasta e ambiente virtual
Duration: 8:00

Crie uma pasta para abrigar os arquivos deste novo projeto. No Windows, uma sugestão é

```text
C:\Users\usuario\Documents\dev\chatgpt_python
```

Em sistemas Unix like, use

```text
/home/usuario/dev/chatgpt_python
```

A seguir, abra o VS Code e clique em **File >> Open Folder** para mantê-lo vinculado à nova pasta. Por fim, ainda no VS Code, clique em **Terminal >> New Terminal** para abrir um novo terminal interno do VS Code, o que vai simplificar diversas tarefas.

No terminal, use

**Terminal**

```bash
python -m venv venv
```

para criar um ambiente virtual Python chamado `venv` utilizando o módulo `venv`. Após a sua execução, uma pasta chamada `venv` deve ser criada na raiz de seu projeto, como na figura a seguir.

![Explorer do VS Code com a pasta CHATGPT_PYTHON contendo a pasta venv](img/p001-1.webp)

*Figura 2.2.1: a pasta venv criada na raiz do projeto.*

<aside class="positive">

**Nota.** Um ambiente virtual Python permite o uso de uma versão específica do Python e também de pacotes diversos. Isso permite que diferentes projetos Python com dependências de pacotes de versões diferentes possam ter vida sem impactar uns aos outros.

</aside>

Depois da criação do ambiente virtual, é preciso ativá-lo. Usuários Windows podem estar utilizando um terminal "cmd" ou um terminal "Powershell". Você pode verificar o seu no próprio VS Code, como na figura a seguir.

![Painel do terminal do VS Code com o tipo de terminal "cmd" destacado no canto superior direito](img/p002-1.webp)

*Figura 2.2.2: o tipo do terminal aparece no canto superior direito do painel.*

A tabela a seguir resume a forma como o ambiente virtual Python pode ser ativado em cada caso.

| Terminal | Comando(s) |
| --- | --- |
| Windows cmd | `venv\Scripts\activate.bat` |
| Windows Powershell | `Set-ExecutionPolicy -Scope CurrentUser unrestricted` e, depois, `venv\Scripts\Activate.ps1` |
| Unix Like terminals | `. venv/bin/activate` |

Em qualquer caso, você pode verificar se o ambiente foi ativado com sucesso com

**Terminal**

```bash
pip -V
```

Como mostra a figura a seguir, a pasta de seu ambiente virtual deve ser exibida.

![Terminal Powershell com o prefixo (venv) mostrando a saída de pip -V, com o caminho da pasta venv destacado](img/p002-2.webp)

*Figura 2.2.3: o pip em uso é o do ambiente virtual.*

## Chave de acesso ao ChatGPT
Duration: 6:00

O acesso ao ChatGPT por meio de sua API é pago. Entretanto, na época em que a apostila foi escrita, novos usuários podiam fazer seus testes utilizando cinco dólares de crédito pelos primeiros três meses, na versão TRIAL.

Para obter uma chave de API, basta fazer login no sítio do ChatGPT por meio do link [https://platform.openai.com/](https://platform.openai.com/).

A seguir, clique no seu avatar no canto superior direito e escolha **View API Keys**, como mostra a figura a seguir.

![Menu do avatar Personal aberto, com a opção View API keys em destaque](img/p003-1.webp)

*Figura 2.3.1: escolha View API keys.*

<aside class="positive">

**Nota.** Caso deseje visualizar seu consumo e a data de expiração de seu período trial, visite [https://platform.openai.com/account/usage](https://platform.openai.com/account/usage).

</aside>

Na parte central da tela, você deverá ver um botão **Create new secret key**, como na figura a seguir.

![Página API keys com a lista de chaves existentes e o botão Create new secret key em destaque](img/p003-2.webp)

*Figura 2.3.2: o botão Create new secret key.*

Clique nele e invente um nome para a sua chave. A seguir, basta copiá-la e clicar **Done**, como na figura a seguir.

![Janela Create new secret key exibindo a chave gerada (parcialmente oculta), o botão de copiar e o botão Done em destaque](img/p004-1.webp)

*Figura 2.3.3: copie a chave e clique em Done.*

<aside class="negative">

**Nota.** Você precisa copiar a chave agora. Depois de fechar a janela não será mais possível visualizá-la. Se isso acontecer, você poderá criar outra.

</aside>

## Arquivo .env e python-dotenv
Duration: 10:00

Evidentemente, nosso programa fará uso da chave. Porém, é fundamental que ela não fique escrita explicitamente junto com o código. Isso por, pelo menos, duas razões:

* o controle de versão pode ser feito em repositórios públicos
* a chave a ser utilizada varia em função do ambiente (desenvolvimento, homologação, produção etc.). Por isso, ela é chamada "variável de ambiente" e desejamos uma maneira simples de fazer a troca de chave conforme o ambiente muda.

Diferentes ambientes utilizam diferentes mecanismos para isso. Em Python, vamos criar um arquivo chamado `.env` (o nome começa com "." para que ele seja oculto e "env" é de "environment", ou seja, ambiente, um arquivo capaz de abrigar variáveis de ambiente) e armazenar a chave nele.

**Código 2.3.1 · .env**

```ini
OPENAI_API_KEY=coloque a sua chave aqui
```

Agora é necessário tornar a chave disponível como uma variável de ambiente. Para tal, utilizaremos o módulo do Python chamado **python-dotenv**. Ele será uma dependência de nosso projeto. Ou seja, para que a aplicação funcione, ela depende de sua existência. Em geral, módulos dos quais uma aplicação Python depende são declarados num arquivo chamado `requirements.txt`. Por isso crie um arquivo com este nome na raiz do seu projeto e adicione o conteúdo a seguir a ele.

**Código 2.3.2 · requirements.txt**

```text
python-dotenv
```

No terminal, execute

**Terminal**

```bash
pip install -r requirements.txt
```

para fazer a instalação deste módulo.

A seguir, vamos realizar um teste e verificar se já é possível acessar as variáveis de ambiente. Para tal, crie um arquivo chamado `app.py`. Vamos importar a função `load_dotenv` pois ela é capaz de ler o conteúdo do arquivo `.env` e disponibilizar seu conteúdo como variáveis de ambiente. Importamos também o módulo `os` para utilizar a sua função `getenv`. A ela entregamos o nome de uma variável de ambiente e ela nos devolve o valor de interesse.

**Código 2.3.3 · app.py**

```python
import os
from dotenv import load_dotenv
load_dotenv()
#exibindo o valor associado à chave OPENAI_API_KEY
print (os.getenv('OPENAI_API_KEY'))
```

Use

**Terminal**

```bash
python app.py
```

no terminal. Se tudo deu certo, você deverá visualizar a sua chave de acesso ao ChatGPT.

![Terminal com o comando python app.py em destaque e, na linha seguinte, a chave exibida (oculta por uma tarja)](img/p005-1.webp)

*Figura 2.3.4: a chave lida do arquivo .env.*

Agora podemos deixar de exibir a chave. Como mostra o código a seguir, basta comentar a linha. Ela pode ser útil no futuro.

**Código 2.3.4 · app.py**

```python
import os
from dotenv import load_dotenv
load_dotenv()
#exibindo o valor associado à chave OPENAI_API_KEY
#print (os.getenv('OPENAI_API_KEY'))
```

## Verificando o sentimento de uma frase
Duration: 12:00

Utilizaremos o ChatGPT para detectar se uma frase expressa sentimento

* POSITIVO
* NEUTRO
* NEGATIVO

Para isso, precisamos construir um **prompt**. Um prompt é um simples texto que entregamos ao ChatGPT. A intenção é que ele produza um **"completion"**, ou seja, um texto probabilisticamente condizente com o prompt. Nosso prompt será o seguinte:

> "Qual o sentimento na seguinte frase? Responda com apenas uma palavra: Positivo, Negativo ou Neutro. Eis a frase: "

Juntaremos a essa frase padrão um texto que o usuário final poderá informar.

Para acessar a API, o primeiro passo é declarar o módulo `openai` como dependência da aplicação, o que pode ser feito no arquivo `requirements.txt`.

**Código 2.4.1 · requirements.txt**

```text
python-dotenv
openai
```

Instale a nova dependência com

**Terminal**

```bash
pip install -r requirements.txt
```

A seguir, no arquivo `app.py`, importamos o módulo e configuramos a chave de acesso à API.

**Código 2.4.2 · app.py**

```python
import os
import openai
from dotenv import load_dotenv
load_dotenv()
#exibindo o valor associado à chave OPENAI_API_KEY
#print (os.getenv('OPENAI_API_KEY'))
openai.api_key = os.getenv('OPENAI_API_KEY')
```

O próximo passo é montar o prompt. Observe como ele é composto por uma frase previamente definida e por um texto digitado pelo usuário. Claro, dependendo da finalidade de seu aplicativo, o prompt pode ser completamente diferente.

**Código 2.4.3 · app.py**

```python
import os
import openai
from dotenv import load_dotenv
load_dotenv()
#exibindo o valor associado à chave OPENAI_API_KEY
#print (os.getenv('OPENAI_API_KEY'))

openai.api_key = os.getenv('OPENAI_API_KEY')

pergunta_padrao = 'Qual o sentimento na seguinte frase? Responda com apenas uma palavra: Positivo, Negativo ou Neutro. Eis a frase: '

frase_do_usuario = input('Escreva uma frase para enviarmos ao ChatGPT\n')

prompt = f'{pergunta_padrao}{frase_do_usuario}'
```

O próximo passo é utilizar a API de completions da OpenAI. Enviamos o prompt na esperança de obter um completion condizente com aquilo que o prompt descreve.

**Código 2.4.4 · app.py**

```python
import os
import openai
from dotenv import load_dotenv
load_dotenv()
#exibindo o valor associado à chave OPENAI_API_KEY
#print (os.getenv('OPENAI_API_KEY'))

openai.api_key = os.getenv('OPENAI_API_KEY')

pergunta_padrao = 'Qual o sentimento na seguinte frase? Responda com apenas uma palavra: Positivo, Negativo ou Neutro. Eis a frase: '

frase_do_usuario = input('Escreva uma frase para enviarmos ao ChatGPT\n')

prompt = f'{pergunta_padrao}{frase_do_usuario}'

resposta = openai.Completion.create(
    engine='text-davinci-003',
    prompt=prompt
)
```

Por fim, exibimos o resultado. Observe que o resultado é **probabilístico**. Diferentes resultados são possíveis, uns com maior probabilidade e outros com menor probabilidade. Assim, o resultado é uma coleção de valores chamada `choices`. Para pegar aquela de maior probabilidade, acessamos a sua posição zero. A coleção é repleta de objetos do tipo `OpenAIObject`, os quais possuem propriedades como `logprobs`, `text` etc. No momento, o que nos interessa é a propriedade `text`. Assim, apenas a acessamos e a exibimos na tela.

**Código 2.4.5 · app.py**

```python
import os
import openai
from dotenv import load_dotenv
load_dotenv()
#exibindo o valor associado à chave OPENAI_API_KEY
#print (os.getenv('OPENAI_API_KEY'))

openai.api_key = os.getenv('OPENAI_API_KEY')

pergunta_padrao = 'Qual o sentimento na seguinte frase? Responda com apenas uma palavra: Positivo, Negativo ou Neutro. Eis a frase: '

frase_do_usuario = input('Escreva uma frase para enviarmos ao ChatGPT\n')

prompt = f'{pergunta_padrao}{frase_do_usuario}'

resposta = openai.Completion.create(
    engine='text-davinci-003',
    prompt=prompt
)

print(resposta.choices[0].text)
```

Para executar o programa, use

**Terminal**

```bash
python app.py
```

<aside class="negative">

Este código usa a interface do módulo `openai` anterior à versão 1.0 (`openai.api_key` e `openai.Completion.create`) e o modelo `text-davinci-003`, disponíveis quando a apostila foi escrita (2023). Nas versões atuais do módulo, a chamada equivalente usa um cliente `OpenAI()` e `client.chat.completions.create(...)` com um modelo de chat vigente.

</aside>

## Encerramento
Duration: 2:00

Parabéns! Você escreveu um programa Python que monta um prompt com a frase do usuário, envia-o ao ChatGPT pela API da OpenAI e exibe o sentimento detectado: Positivo, Negativo ou Neutro.

### Referências

* Plataforma da OpenAI: [https://platform.openai.com/](https://platform.openai.com/)
* Consumo e período trial: [https://platform.openai.com/account/usage](https://platform.openai.com/account/usage)
