summary: Construa com Python e Tkinter uma aplicação gráfica que usa a API do ChatGPT para gerar perguntas sobre um assunto escolhido e para responder perguntas enviadas pelo usuário.
id: chatgpt-python-tkinter-perguntas
categories: IA,Python
tags: chatgpt,openai,python,tkinter,ttk,interface grafica,venv,python-dotenv,prompt,completion
status: Published
authors: Rodrigo Bossini
last updated: 2023-08-21
pdf: chatgpt/01_apostila_chatgpt_python_tkinter_perguntas_respostas.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# ChatGPT com Python e Tkinter: gerador e corretor de questões

## Visão geral
Duration: 4:00

Neste material, desenvolveremos uma aplicação capaz de conversar com o **ChatGPT** por meio de sua API. A intenção é que ela

* permita que o usuário informe um assunto sobre o qual deseja que uma pergunta de alternativas seja formulada
* solicite a correção de uma pergunta de alternativas

A figura a seguir mostra a interface gráfica desejada.

![Janela "ChatGPT - Gerador/Corretor de Questões" com a aba Gerar Questão: campo Assunto, opções de Tipo (Dissertativa, Alternativa) e Dificuldade (Fácil, Média, Difícil), caixa de Pergunta exemplo, caixa de Resposta e botão OK](img/p001-1.webp)

*Figura 1.1: a interface gráfica desejada.*

### O que você vai aprender

* Como elaborar prompts cada vez mais precisos
* Como criar e ativar um ambiente virtual Python e guardar a chave de API em um `.env`
* Como isolar o acesso ao ChatGPT em um módulo Python reutilizável
* Como criar interfaces gráficas com Tkinter: janelas, abas (Notebook), Labels, Entry, Radiobutton, Text e Button
* Como dispor widgets com o gerenciador de layout grid, usando `sticky` e pesos de linhas e colunas
* Como integrar a interface gráfica com as funções que conversam com o ChatGPT

### O que você vai precisar

* Python 3 com Tkinter
* VS Code
* Uma conta na OpenAI e uma chave de API

## O ChatGPT e a elaboração de prompts
Duration: 12:00

O ChatGPT é capaz de realizar diferentes tarefas. Veja alguns exemplos:

* Geração de conteúdo (como gerar perguntas sobre assuntos diversos)
* Tradução de texto
* Resumos de texto
* Análise de sentimentos em textos (embora não tenha sido projetado com esse foco)
* Geração de imagens em função de texto

E muito mais!

Seu funcionamento, em geral, se baseia num modelo em que o usuário informa um **prompt** a partir do qual ele produz um **completion**. Veja a figura a seguir.

![Um usuário envia ao ChatGPT o prompt "Por que o céu é azul?" e recebe a completion "O céu é azul por causa da luz do Sol"](img/p002-1.webp)

*Figura 1.2: prompt e completion.*

A elaboração de prompts precisos é fundamental para obter completions de qualidade. Façamos alguns testes. Visite [https://chat.openai.com/](https://chat.openai.com/) para ter acesso ao ChatGPT por meio de sua interface gráfica.

Faça um primeiro teste enviando o prompt

```text
Elabore uma questão
```

Observe como o resultado é, evidentemente, genérico. Podemos ser mais precisos dizendo um assunto. Tente esse prompt

```text
Elabore uma questão sobre Java
```

Já melhorou. Sejamos ainda mais específicos com esse prompt

```text
Elabore uma questão sobre estruturas de seleção em Java
```

E se desejarmos garantir que a questão é de alternativas? Tente esse prompt agora:

```text
Elabore uma questão de alternativas sobre estruturas de seleção em Java
```

Claro, também podemos dizer quantas alternativas desejamos, como mostra esse prompt

```text
Elabore uma questão de alternativas sobre estruturas de seleção em Java. Use 5 alternativas.
```

E se desejarmos escolher o nível de dificuldade da questão? Tente esse prompt

```text
Elabore uma questão de alternativas sobre estruturas de seleção em Java. Use 5 alternativas. Nível muito fácil.
```

Tente esse também

```text
Elabore uma questão de alternativas sobre estruturas de seleção em Java. Use 5 alternativas. Nível ultra hard core.
```

Peça também a resposta certa com esse prompt

```text
Elabore uma questão de alternativas sobre estruturas de seleção em Java. Use 5 alternativas. Nível ultra hard core. Inclua a resposta certa.
```

### Pedindo que o ChatGPT resolva uma questão

Para fechar, peça que ele tente resolver uma questão com o seguinte prompt.

> Uma pessoa acaba de encontrar uma lâmpada mágica e tem direito a fazer um pedido. A lógica está retratada no programa a seguir.

**SwitchCase.java (parte do prompt)**

```java
import javax.swing.JOptionPane;
public class SwitchCase{
  public static void main (String []args){
    String menu = "Faça seu pedido\n1. Ficar rico\n2. Tirar nota boa em todas as provas\n3. Um país sem corrupção\n";
    int op = Integer.parseInt(JOptionPane.showInputDialog(menu));
    switch(op){
      case 1:
        JOptionPane.showMessageDialog(null, "Você ganhou R$ 100.000.000,00");
      case 2:
        JOptionPane.showMessageDialog(null, "Você tirou 10 em todas as provas");
        break;
      case 3:
        JOptionPane.showMessageDialog(null, "Aí você pediu demais");
        break;
      default:
        if(op > 0){
          JOptionPane.showMessageDialog(null, "Agora você terá direito a mais " + op + "pedidos");
        }
        else{
          JOptionPane.showMessageDialog(null, "Infelizmente você não tem direito a nenhum pedido");
        }
    }
  }
}
```

> Analise as seguintes proposições.
>
> I. Se um usuário optar por ficar rico, ele também tirará 10 em todas as provas.
>
> II. Se um usuário optar por tirar 10 em todas as provas, ele também ficará rico.
>
> III. O programa termina com um erro em tempo de execução se o usuário digitar um valor negativo.
>
> É correto apenas o que se afirma em
>
> a) I
> b) II
> c) III
> d) I e II
> e) II e III

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

![Explorer do VS Code com a pasta CHATGPT_PYTHON contendo a pasta venv](img/p006-1.webp)

*Figura 2.2.1: a pasta venv criada na raiz do projeto.*

<aside class="positive">

**Nota.** Um ambiente virtual Python permite o uso de uma versão específica do Python e também de pacotes diversos. Isso permite que diferentes projetos Python com dependências de pacotes de versões diferentes possam ter vida sem impactar uns aos outros.

</aside>

Depois da criação do ambiente virtual, é preciso ativá-lo. Usuários Windows podem estar utilizando um terminal "cmd" ou um terminal "Powershell". Você pode verificar o seu no próprio VS Code, como na figura a seguir.

![Painel do terminal do VS Code com o tipo de terminal "cmd" destacado no canto superior direito](img/p007-1.webp)

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

![Terminal Powershell com o prefixo (venv) mostrando a saída de pip -V, com o caminho da pasta venv destacado](img/p007-2.webp)

*Figura 2.2.3: o pip em uso é o do ambiente virtual.*

## Arquivo .env e chave de acesso
Duration: 10:00

O acesso ao ChatGPT por meio de sua API é pago. Entretanto, na época em que a apostila foi escrita, novos usuários podiam fazer seus testes utilizando cinco dólares de crédito pelos primeiros três meses, na versão TRIAL.

Para obter uma chave de API, basta fazer login no sítio do ChatGPT por meio do link [https://platform.openai.com/](https://platform.openai.com/). A seguir, clique no seu avatar no canto superior direito e escolha **View API Keys**, como mostra a figura a seguir.

![Menu do avatar Personal aberto, com a opção View API keys em destaque](img/p008-1.webp)

*Figura 2.3.1: escolha View API keys.*

<aside class="positive">

**Nota.** Caso deseje visualizar seu consumo e a data de expiração de seu período trial, visite [https://platform.openai.com/account/usage](https://platform.openai.com/account/usage).

</aside>

Na parte central da tela, você deverá ver um botão **Create new secret key**, como na figura a seguir.

![Página API keys com a lista de chaves existentes e o botão Create new secret key em destaque](img/p008-2.webp)

*Figura 2.3.2: o botão Create new secret key.*

Clique nele e invente um nome para a sua chave. A seguir, basta copiá-la e clicar **Done**, como na figura a seguir.

![Janela Create new secret key exibindo a chave gerada (parcialmente oculta), o botão de copiar e o botão Done em destaque](img/p009-1.webp)

*Figura 2.3.3: copie a chave e clique em Done.*

<aside class="negative">

**Nota.** Você precisa copiar a chave agora. Depois de fechar a janela não será mais possível visualizá-la. Se isso acontecer, você poderá criar outra.

</aside>

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

![Terminal com o comando python app.py em destaque e, na linha seguinte, a chave exibida (oculta por uma tarja)](img/p010-1.webp)

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

## Módulo para o acesso ao ChatGPT: criar perguntas
Duration: 15:00

Criaremos um módulo Python a fim de isolar o código de acesso à API do ChatGPT, promovendo seu nível de reusabilidade e facilidade de manutenção. Comece criando um arquivo chamado `chatgpt.py` na raiz do projeto. Nosso novo módulo utilizará o módulo do ChatGPT e, por isso, este precisa ser descrito no arquivo `requirements.txt`.

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

A seguir, vamos escrever uma função cuja finalidade será interagir com o ChatGPT a fim de obter uma pergunta de acordo com os seguintes parâmetros:

* Chave de acesso à API do ChatGPT
* Assunto desejado
* Tipo desejado (dissertativa ou alternativa)
* Dificuldade (Fácil, Médio, Difícil)
* Pergunta exemplo (opcional) (uma pergunta em que o ChatGPT pode se basear)

A função começa produzindo um texto que explica mais detalhadamente o que desejamos. Ou seja, ela tenta deixar o nosso prompt o mais compreensível possível para o ChatGPT.

**Código 2.4.2 · chatgpt.py**

```python
import openai

def criar_pergunta(
    OPENAI_API_KEY,
    assunto,
    tipo,
    dificuldade,
    pergunta_exemplo = None
):
    openai.api_key = OPENAI_API_KEY
    assunto = f'Elabore uma pergunta sobre {assunto}'
    tipo = f'Ela deve ser {tipo}' + ' com 4 alternativas' if tipo == 'Alternativa' else ''
    dificuldade = f'Seu nível de dificuldade deve ser {dificuldade}'
    pergunta_exemplo = f'Utilize esta pergunta como exemplo: {pergunta_exemplo}' if pergunta_exemplo != None and pergunta_exemplo != '\n' else ''
    prompt = f'{assunto}.{tipo}.{dificuldade}.{pergunta_exemplo}'
```

Agora que temos o prompt em mãos, podemos enviá-lo ao ChatGPT na expectativa de obter um completion interessante.

Estamos utilizando os seguintes parâmetros da API:

* **engine**: o modelo de inteligência artificial que desejamos utilizar. Veja uma descrição daquele que escolhemos, extraída da documentação:

  > text-davinci-003: Can do any language task with better quality, longer output, and consistent instruction-following than the curie, babbage, or ada models. Also supports inserting completions within text.

* **max_tokens**: o número máximo de tokens que o completion produzido pode conter. É importante configurar este parâmetro pois seu valor padrão é 16, ou seja, apenas 16 tokens. Algo em torno de 16 * 4 = 64 letras.
* **prompt**: o prompt a partir do qual o completion será gerado.

Veja mais informações sobre os modelos visitando [https://platform.openai.com/docs/models/gpt-3-5](https://platform.openai.com/docs/models/gpt-3-5).

Observe que o resultado é **probabilístico**. Diferentes resultados são possíveis, uns com maior probabilidade e outros com menor probabilidade. Assim, o resultado é uma coleção de valores chamada `choices`. Para pegar aquela de maior probabilidade, acessamos a sua posição zero. A coleção é repleta de objetos do tipo `OpenAIObject`, os quais possuem propriedades como `logprobs`, `text` etc. No momento, o que nos interessa é a propriedade `text`. Utilizamos a função `strip` do Python para remover eventuais espaços em branco, tabs etc. do começo e do final da resposta.

**Código 2.4.3 · chatgpt.py**

```python
import openai
def criar_pergunta(
    OPENAI_API_KEY,
    assunto,
    tipo,
    dificuldade,
    pergunta_exemplo = None
):
    openai.api_key = OPENAI_API_KEY
    assunto = f'Elabore uma pergunta sobre {assunto}'
    tipo = f'Ela deve ser {tipo}' + ' com 4 alternativas' if tipo == 'Alternativa' else ''
    dificuldade = f'Seu nível de dificuldade deve ser {dificuldade}'
    pergunta_exemplo = f'Utilize esta pergunta como exemplo: {pergunta_exemplo}' if pergunta_exemplo != None and pergunta_exemplo != '\n' else ''
    prompt = f'{assunto}.{tipo}.{dificuldade}.{pergunta_exemplo}'

    resposta = openai.Completion.create(
        engine='text-davinci-003',
        prompt = prompt,
        max_tokens=150
    )
    return resposta.choices[0].text.strip()
```

### Testando a função

Vá ao arquivo `app.py` e faça um teste.

**Código 2.4.4 · app.py**

```python
import os
from dotenv import load_dotenv
import chatgpt
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
print(
    chatgpt.criar_pergunta(
        OPENAI_API_KEY,
        'java',
        'alternativa',
        'médio'
    )
)
```

Execute com

**Terminal**

```bash
python app.py
```

Teste também usando uma pergunta de exemplo.

**Código 2.4.5 · app.py**

```python
import os
from dotenv import load_dotenv
import chatgpt
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

pergunta_exemplo = 'import javax.swing.JOptionPane; public class SomatorioWhile{ public static void main (String [] args){ int n = Integer.parseInt(JOptionPane.showInputDialog("Digite um número")); int i = 1; int soma = 0; while (i <= n){ soma = soma + i % 2 == 0 ? i : 0; i = i + 1; } JOptionPane.showMessageDialog(null, soma); } } I> O programa calcula a soma dos números inteiros pares no intervalo fechado [0, n]. II. Se o usuário digitar um valor ímpar qualquer, o programa produzirá o valor zero. III. Se o usuário digitar o valor 2, o programa produzirá o valor 2. É correto apenas o que se afirma em a) I b) II c) III d) I e II e) II e III'

print(
    chatgpt.criar_pergunta(
        OPENAI_API_KEY,
        'java',
        'alternativa',
        'dificil',
        pergunta_exemplo
    )
)
```

<aside class="positive">

**Nota.** O código Java utilizado como exemplo, corretamente indentado, aparece a seguir, caso deseje visualizar a pergunta.

</aside>

**SomatorioWhile.java (Figura 2.4.1)**

```java
import javax.swing.JOptionPane;
public class SomatorioWhile{
  public static void main (String [] args){
    int n = Integer.parseInt(JOptionPane.showInputDialog("Digite um número"));
    int i = 1;
    int soma = 0;
    while (i <= n){
      soma = soma + i % 2 == 0 ? i : 0;
      i = i + 1;
    }
    JOptionPane.showMessageDialog(null, soma);
  }
}
```

Depois de fazer seus testes, apague o código de teste.

A figura a seguir mostra um exemplo de resultado esperado.

![Terminal após python app.py exibindo a pergunta gerada: "Qual dos seguintes componentes da linguagem Java é usado para criar variáveis e métodos?" com as alternativas a) Classe, b) Objeto, c) Pacote e d) Interface](img/p016-1.webp)

*Figura 2.4.2: uma pergunta gerada pelo ChatGPT.*

## Módulo para o acesso ao ChatGPT: responder perguntas
Duration: 8:00

De volta ao arquivo `chatgpt.py`, vamos escrever uma função que solicita ao ChatGPT que responda uma pergunta. Seus parâmetros são:

* Chave de acesso à API do ChatGPT
* Pergunta a ser respondida

Observe como ajustamos o texto para tornar o prompt mais apropriado e compreensível.

**chatgpt.py**

```python
import openai

def criar_pergunta(
    OPENAI_API_KEY,
    assunto,
    tipo,
    dificuldade,
    pergunta_exemplo = None
):
    openai.api_key = OPENAI_API_KEY
    assunto = f'Elabore uma pergunta sobre {assunto}'
    tipo = f'Ela deve ser {tipo}' + ' com 4 alternativas' if tipo == 'Alternativa' else ''
    dificuldade = f'Seu nível de dificuldade deve ser {dificuldade}'
    pergunta_exemplo = f'Utilize esta pergunta como exemplo: {pergunta_exemplo}' if pergunta_exemplo != None and pergunta_exemplo != '\n' else ''
    prompt = f'{assunto}.{tipo}.{dificuldade}.{pergunta_exemplo}'
    resposta = openai.Completion.create(
        engine='text-davinci-003',
        prompt = prompt,
        max_tokens=150
    )
    return resposta.choices[0].text.strip()

def responder_pergunta(
    OPENAI_API_KEY,
    pergunta_a_ser_respondida
):
    openai.api_key = OPENAI_API_KEY
    prompt = f'Responda a seguinte pergunta:{pergunta_a_ser_respondida}'
```

A seguir, apenas enviamos o prompt ao ChatGPT e tratamos o completion gerado por ele.

**chatgpt.py**

```python
# ...
def responder_pergunta(
    OPENAI_API_KEY,
    pergunta_a_ser_respondida
):
    openai.api_key = OPENAI_API_KEY
    prompt = f'Responda a seguinte pergunta:{pergunta_a_ser_respondida}'
    resposta = openai.Completion.create(
        engine='text-davinci-003',
        prompt = prompt,
        max_tokens = 150
    )
    return resposta.choices[0].text.strip()
```

No arquivo `app.py`, façamos um teste da nova função.

**app.py**

```python
import os
from dotenv import load_dotenv
import chatgpt
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

pergunta = 'import javax.swing.JOptionPane; public class SomatorioWhile{ public static void main (String [] args){ int n = Integer.parseInt(JOptionPane.showInputDialog("Digite um número")); int i = 1; int soma = 0; while (i <= n){ soma = soma + i % 2 == 0 ? i : 0; i = i + 1; } JOptionPane.showMessageDialog(null, soma); } } I> O programa calcula a soma dos números inteiros pares no intervalo fechado [0, n]. II. Se o usuário digitar um valor ímpar qualquer, o programa produzirá o valor zero. III. Se o usuário digitar o valor 2, o programa produzirá o valor 2. É correto apenas o que se afirma em a) I b) II c) III d) I e II e) II e III'

print(chatgpt.responder_pergunta(OPENAI_API_KEY, pergunta))
```

Apague seus testes quando terminar.

<aside class="negative">

Este código usa a interface do módulo `openai` anterior à versão 1.0 (`openai.api_key` e `openai.Completion.create`) e o modelo `text-davinci-003`, disponíveis quando a apostila foi escrita (2023). Nas versões atuais do módulo, a chamada equivalente usa um cliente `OpenAI()` e `client.chat.completions.create(...)` com um modelo de chat vigente.

</aside>

## Tkinter: introdução e Hello World
Duration: 8:00

**Tkinter** é uma biblioteca que permite a criação de interfaces gráficas em Python. Trata-se de uma interface para que possamos acessar a biblioteca **Tk** em Python. Por sua vez, Tk é uma biblioteca gráfica que pode ser utilizada com diferentes linguagens de programação como

* Tcl (originalmente desenvolvida para essa linguagem): [https://www.tcl.tk/](https://www.tcl.tk/)
* Python (Tkinter): [https://docs.python.org/3/library/tkinter.html](https://docs.python.org/3/library/tkinter.html)
* Java (Jython, permite a execução de código Python em Java): [https://www.jython.org/](https://www.jython.org/)
* Lisp (LispWorks): [http://www.lispworks.com/](http://www.lispworks.com/)

<aside class="positive">

**Nota.** O nome Tkinter vem de **Tk Inter**face.

</aside>

Em seu terminal, execute

**Terminal**

```bash
python -m tkinter
```

para certificar-se de que a biblioteca está instalada em seu ambiente. O resultado esperado se parece com aquele exibido pela figura a seguir.

![Pequena janela "tk" com o texto "This is Tcl/Tk version 8.6 - This should be a cedilla: ç" e os botões "Click me!" e "QUIT"](img/p019-1.webp)

*Figura 2.5.1: a janela de teste da Tkinter.*

### Hello World com Tkinter

Começamos escrevendo uma aplicação Hello, World com a Tkinter. Para tal, crie um arquivo chamado `tela.py` na raiz de seu projeto.

Começamos importando a tkinter, pois ela dá acesso aos componentes visuais de interesse (**widgets**).

A seguir, importamos o módulo **ttk**. Segundo a sua documentação, ele permite que o comportamento de um componente seja separado de sua aparência. Por meio deste módulo, podemos trocar o tema (coleção de cores) utilizado na exibição dos componentes. Em particular, podemos acessar os novos componentes disponibilizados a partir da versão 8.5 da Tkinter.

A função `Tk` constrói um componente "top level". Ele representa a tela a que adicionaremos novos widgets.

Por meio do módulo ttk, construímos um componente `Button` e, usando o método `grid`, o adicionamos à raiz. Observe que o método `Button` recebe o componente de quem o botão será filho, além de propriedades de interesse para o botão.

O método `mainloop` dispara a "thread principal de execução". Ela é responsável por lidar com os eventos gerados pelo usuário.

**Código 2.6.1 · tela.py**

```python
from tkinter import *
from tkinter import ttk
root = Tk()
ttk.Button(root, text="Hello, World").grid()
root.mainloop()
```

## Disposição dos widgets com um grid
Duration: 5:00

Os widgets de nosso aplicativo serão dispostos na tela usando o gerenciador de layout **grid** da tkinter. Veja a figura a seguir.

![Janela da aplicação com linhas vermelhas marcando um grid de 4 colunas (0 a 3) e 8 linhas (0 a 7): Assunto na linha 0, Tipo na 1, Dificuldade na 2, Pergunta exemplo na 3, a caixa de texto na 4, Resposta na 5, a caixa de resposta na 6 e o botão OK na 7](img/p020-1.webp)

*Figura 2.7.1: linhas e colunas do grid da primeira aba.*

<aside class="positive">

**Nota.** Muitos widgets farão uso do parâmetro **sticky**. Ele representa em quais cantos o widget "cola" quando a tela for expandida. N, S, E, W significam, respectivamente, North, South, East e West. Veja a figura a seguir.

</aside>

![Janela da aplicação com as letras N acima, S abaixo, W à esquerda e E à direita, indicando os pontos cardeais usados pelo parâmetro sticky](img/p021-1.webp)

*Figura 2.7.2: os pontos cardeais do parâmetro sticky.*

Observe que eles farão mais sentido depois de configurarmos o peso de cada linha e de cada coluna, o que será feito no final da criação da aba. Depois disso, vamos realizar alguns testes alterando os valores.

## A janela principal e o Notebook
Duration: 10:00

Começamos criando a tela principal e dando a ela um título. Estamos no arquivo `tela.py`.

**Código 2.8.1 · tela.py**

```python
import tkinter as tk
# Cria a janela principal
window = tk.Tk()
window.title('ChatGPT - Gerador/Corretor de Questões')
# Inicia o loop principal
window.mainloop()
```

Como a figura a seguir mostra, o resultado ainda não tem muita graça.

![Janela vazia com o título abreviado "ChatG...stões"](img/p022-1.webp)

*Figura 2.8.1: a janela principal, ainda vazia.*

Para adicionar abas à aplicação, utilizamos um widget do tipo **Notebook**. Um notebook serve de contêiner para múltiplos Frames e, neste contexto, cada Frame representa uma aba. Há dois parâmetros que merecem explicação:

* `expand=True`: caso o usuário expanda a tela, novo espaço será alocado ao Notebook para que ele possa aumentar de tamanho também, muito embora ainda não faça isso
* `fill='both'`: o Notebook deve ocupar espaço nos dois eixos. Tente as opções `'x'`, `'y'` e `'none'` também.

**Código 2.8.2 · tela.py**

```python
import tkinter as tk
from tkinter import ttk

# Cria a janela principal
window = tk.Tk()
window.title('ChatGPT - Gerador/Corretor de Questões')

# # Cria o notebook (o container para as abas)
# #padding é a medida entre as bordas da janela e o notebook
notebook = ttk.Notebook(window, padding=10)

# Coloca o notebook na janela
#expand serve que mais espaço seja reservado para o notebook caso o usuário expanda a tela
# fill both serve para dizer que o componente deve ocupar o espaço novo tanto na horizontal quanto na vertical. Também poderia ser x, y ou none
notebook.pack(expand=True, fill='both')

# Inicia o loop principal
window.mainloop()
```

O resultado continua sem graça: a janela aparece minúscula, só com a barra de título.

Agora vamos escrever uma função cuja finalidade será criar os componentes para a primeira aba. Ela começa criando um Frame que representa justamente a primeira aba. A função recebe o Notebook, já que a aba precisa ser colocada dentro dele.

<aside class="positive">

**Nota.** Depois desse ajuste, teste novamente variando os valores de `expand` e `fill`.

</aside>

**Código 2.8.3 · tela.py**

```python
import tkinter as tk
from tkinter import ttk

#função para criar a primeira aba
def criar_aba1(notebook):
    tab1 = ttk.Frame(notebook)
    notebook.add(tab1, text='Gerar pergunta')
    return tab1

window = tk.Tk()
window.title('ChatGPT - Gerador/Corretor de Questões')

notebook = ttk.Notebook(window, padding=10)

#cria a primeir aba
tab1 = criar_aba1(notebook)


notebook.pack(expand=True, fill='both')

window.mainloop()
```

Agora o resultado visual já está mais divertido. Veja a figura a seguir.

![Janela pequena com uma única aba chamada "Gerar Questão"](img/p024-1.webp)

*Figura 2.8.3: a primeira aba.*

## Primeira aba: assunto, tipo e dificuldade
Duration: 12:00

A linha 0 do grid possui dois widgets.

* **Label**: para exibir o texto não editável "Assunto:"
* **Entry**: para permitir que o usuário digite algo.

**Código 2.8.4 · tela.py**

```python
# ...
#função para criar a primeira aba
def criar_aba1(notebook):
    tab1 = ttk.Frame(notebook)
    notebook.add(tab1, text='Gerar pergunta')

    #linha 0
    tk.Label(tab1, text='Assunto:').grid(row=0, column=0, sticky='W', padx=5, pady=5)
    assunto_entry = tk.Entry(tab1)
    assunto_entry.grid(row=0, column=1, columnspan=3, sticky='WE', padx=5, pady=5)
    return tab1
# ...
```

O resultado esperado aparece na figura a seguir.

![Aba Gerar Questão com o rótulo Assunto e um campo de texto ao lado](img/p025-1.webp)

*Figura 2.8.4: a linha 0.*

Na linha 1, teremos

* **Label**: para exibir o texto não editável "Tipo".
* **Radiobutton**: são dois, para exibir "Dissertativa" e "Alternativa"

Observe que também declaramos um **StringVar**. Ele servirá para armazenar a opção selecionada pelo usuário.

Os parâmetros `text` e `value` de um Radiobutton representam, respectivamente, o texto apresentado na tela e o valor que será de fato utilizado caso o usuário selecione aquela opção.

**Código 2.8.5 · tela.py**

```python
def criar_aba1(notebook):
    tab1 = ttk.Frame(notebook)
    notebook.add(tab1, text='Gerar pergunta')
    #linha 0
    tk.Label(tab1, text='Assunto:').grid(row=0, column=0, sticky='W', padx=5, pady=5)
    assunto_entry = tk.Entry(tab1)
    assunto_entry.grid(row=0, column=1, columnspan=3, sticky='WE', padx=5, pady=5)

    #linha 1
    tk.Label(tab1, text='Tipo:').grid(row=1, column=0, sticky='W', padx=5, pady=5)
    tipo_var = tk.StringVar()
    tk.Radiobutton(tab1, text='Dissertativa', variable=tipo_var, value='Dissertativa').grid(row=1, column=1, sticky='W', padx=5, pady=5)
    tk.Radiobutton(tab1, text='Alternativa', variable=tipo_var, value='Alternativa').grid(row=1, column=2, sticky='W', padx=5, pady=5)
    return tab1
```

A figura a seguir mostra o resultado esperado.

![Aba com o campo Assunto e, abaixo, o rótulo Tipo com as opções Dissertativa e Alternativa](img/p026-1.webp)

*Figura 2.8.5: a linha 1.*

Na linha 2, teremos

* **Label**: para exibir o texto não editável "Dificuldade"
* **Radiobutton**: são três, para exibir "Fácil", "Média" e "Difícil"

Observe que também temos um StringVar, também responsável por armazenar o que o usuário escolher.

**Código 2.8.6 · tela.py**

```python
#função para criar a primeira aba
def criar_aba1(notebook):
    tab1 = ttk.Frame(notebook)
    notebook.add(tab1, text='Gerar pergunta')
    #linha 0
    tk.Label(tab1, text='Assunto:').grid(row=0, column=0, sticky='W', padx=5, pady=5)
    assunto_entry = tk.Entry(tab1)
    assunto_entry.grid(row=0, column=1, columnspan=3, sticky='WE', padx=5, pady=5)

    #linha 1
    tk.Label(tab1, text='Tipo:').grid(row=1, column=0, sticky='W', padx=5, pady=5)
    tipo_var = tk.StringVar()
    tk.Radiobutton(tab1, text='Dissertativa', variable=tipo_var, value='Dissertativa').grid(row=1, column=1, sticky='W', padx=5, pady=5)
    tk.Radiobutton(tab1, text='Alternativa', variable=tipo_var, value='Alternativa').grid(row=1, column=2, sticky='W', padx=5, pady=5)

    #linha 2
    tk.Label(tab1, text='Dificuldade:').grid(row=2, column=0, sticky='W', padx=5, pady=5)
    dificuldade_var = tk.StringVar()
    tk.Radiobutton(tab1, text='Fácil', variable=dificuldade_var, value='Fácil').grid(row=2, column=1, sticky='W', padx=5, pady=5)
    tk.Radiobutton(tab1, text='Média', variable=dificuldade_var, value='Média').grid(row=2, column=2, sticky='W', padx=5, pady=5)
    tk.Radiobutton(tab1, text='Difícil', variable=dificuldade_var, value='Difícil').grid(row=2, column=3, sticky='W', padx=5, pady=5)

    return tab1
```

![Aba com Assunto, Tipo (Dissertativa, Alternativa) e Dificuldade (Fácil, Média, Difícil)](img/p027-1.webp)

*Figura 2.8.6: a linha 2.*

## Primeira aba: pergunta exemplo, resposta e botão
Duration: 12:00

A linha 3 terá

* **Label**: para exibir o texto fixo "Pergunta exemplo".

**Código 2.8.7 · tela.py**

```python
# ...
    #linha 2
    tk.Label(tab1, text='Dificuldade:').grid(row=2, column=0, sticky='W', padx=5, pady=5)
    dificuldade_var = tk.StringVar()
    tk.Radiobutton(tab1, text='Fácil', variable=dificuldade_var, value='Fácil').grid(row=2, column=1, sticky='W', padx=5, pady=5)
    tk.Radiobutton(tab1, text='Média', variable=dificuldade_var, value='Média').grid(row=2, column=2, sticky='W', padx=5, pady=5)
    tk.Radiobutton(tab1, text='Difícil', variable=dificuldade_var, value='Difícil').grid(row=2, column=3, sticky='W', padx=5, pady=5)

    #linha 3
    tk.Label(tab1, text='Pergunta exemplo:').grid(row=3, column=0, sticky='W', padx=5, pady=5)
    return tab1
```

![Aba com Assunto, Tipo, Dificuldade e o rótulo Pergunta exemplo](img/p028-1.webp)

*Figura 2.8.7: a linha 3.*

A linha 4 terá

* **Text**: para permitir que o usuário informe uma pergunta de exemplo.

**Código 2.8.8 · tela.py**

```python
# ...
    #linha 3
    tk.Label(tab1, text='Pergunta exemplo:').grid(row=3, column=0, sticky='W', padx=5, pady=5)

    #linha 4
    pergunta_exemplo = tk.Text(tab1)
    #20 linhas de texto
    pergunta_exemplo.configure(height=20)
    pergunta_exemplo.grid(row=4, column=0, columnspan=4, sticky='WE', padx=5, pady=5)
    return tab1
```

![Aba com os campos anteriores e uma grande caixa de texto abaixo de Pergunta exemplo](img/p029-1.webp)

*Figura 2.8.8: a linha 4.*

A linha 5 terá

* **Label**: para exibir o texto não editável "Resposta:"

**Código 2.8.9 · tela.py**

```python
# ...

    #linha 4
    pergunta_exemplo = tk.Text(tab1)
    #20 linhas de texto
    pergunta_exemplo.configure(height=20)
    pergunta_exemplo.grid(row=4, column=0, columnspan=4, sticky='WE', padx=5, pady=5)

    #linha 5
    tk.Label(tab1, text='Resposta:').grid(row=5, column=0, sticky='W', padx=5, pady=5)
    return tab1

# ...
```

![Aba com a caixa de Pergunta exemplo e, abaixo dela, o rótulo Resposta](img/p030-1.webp)

*Figura 2.8.9: a linha 5.*

A linha 6 terá

* **Text**: utilizado para exibir a resposta do ChatGPT.

**Código 2.8.10 · tela.py**

```python
    #linha 5
    tk.Label(tab1, text='Resposta:').grid(row=5, column=0, sticky='W', padx=5, pady=5)

    #linha 6
    resposta_text = tk.Text(tab1)
    #20 linhas de texto
    resposta_text.configure(height=20)
    resposta_text.grid(row=6, column=0, columnspan=4, sticky='WE', padx=5, pady=5)
    return tab1
```

![Aba com duas grandes caixas de texto: Pergunta exemplo e Resposta](img/p031-1.webp)

*Figura 2.8.10: a linha 6.*

A linha 7 terá

* **Button**: quando clicado, ele acionará o ChatGPT a fim de obter uma pergunta de acordo com as especificações do usuário.

**Código 2.8.11 · tela.py**

```python
# ...

    #linha 6
    resposta_text = tk.Text(tab1)
    #20 linhas de texto
    resposta_text.configure(height=20)
    resposta_text.grid(row=6, column=0, columnspan=4, sticky='WE', padx=5, pady=5)

    #linha 7
    ok_button = tk.Button(tab1, text='OK')
    ok_button.grid(row=7, column=0, columnspan=4, sticky='WE', padx=5, pady=5)
    return tab1

# ...
```

![A primeira aba completa, com o botão OK ocupando toda a largura na parte inferior](img/p033-1.webp)

*Figura 2.8.11: a linha 7.*

## Pesos das linhas e colunas e tamanho mínimo
Duration: 10:00

Expanda um pouco a tela e verifique que os componentes permanecem fixos, como na figura a seguir.

![Janela expandida em que os componentes ficam do mesmo tamanho, no canto superior esquerdo, sobrando espaço vazio](img/p034-1.webp)

*Figura 2.8.12: ao expandir a janela, os componentes não a acompanham.*

Para ajustar isso, basta indicarmos qual a proporção a ser atribuída a cada linha e a cada coluna do grid. Atribuímos peso igual a 1 para todas. Como temos 4 colunas, cada uma terá 1/4 da tela. Como temos 8 linhas, cada uma terá 1/8 da tela.

**Código 2.8.12 · tela.py**

```python
# ...

    #linha 7
    ok_button = tk.Button(tab1, text='OK')
    ok_button.grid(row=7, column=0, columnspan=4, sticky='WE', padx=5, pady=5)

    #peso 1 para cada linha conforme o usuário expande
    for i in range(8):  # para 8 linhas (0-7)
        tab1.grid_rowconfigure(i, weight=1)  # expande com peso 1
    #peso 1 para cada coluna conforme o usuário expande
    for i in range(4):  # para 4 colunas (0-3)
        tab1.grid_columnconfigure(i, weight=1)  # expande com peso 1
    return tab1

# ...
```

Expanda novamente a tela e veja que os componentes agora a acompanham.

Agora faz sentido testar os valores atribuídos ao parâmetro `sticky`. Troque alguns de `EW` para `W` etc. Faça seus experimentos e se familiarize com a biblioteca!

Observe também que, se o usuário reduzir muito o tamanho da tela, os widgets somem, como na figura a seguir.

![Janela reduzida em que a maior parte dos widgets desapareceu, restando só as caixas de texto](img/p035-1.webp)

*Figura 2.8.13: com a janela muito pequena, os widgets somem.*

Para evitar isso, configure um tamanho mínimo para a janela.

**Código 2.8.13 · tela.py**

```python
# ...
window = tk.Tk()
window.title('ChatGPT - Gerador/Corretor de Questões')
window.minsize(800, 600)
# ...
```

Por fim, vamos ajustar o módulo `tela.py` para que ele apenas defina uma função que cria a tela. Assim, ele pode ser importado e seu cliente pode chamar a função quando desejar.

**Código 2.8.14 · tela.py**

```python
import tkinter as tk
from tkinter import ttk

#função para criar a primeira aba
def criar_aba1(notebook):
    ...
    return tab1

def criar_tela():
    window = tk.Tk()
    window.title('ChatGPT - Gerador/Corretor de Questões')
    window.minsize(800, 600)

    notebook = ttk.Notebook(window, padding=10)

    #cria a primeir aba
    tab1 = criar_aba1(notebook)
    notebook.pack(expand=True, fill='both')
    window.mainloop()
```

## Integrando tudo
Duration: 10:00

O módulo principal da aplicação deve agora importar os módulos `chatgpt` e `tela` e realizar a integração.

Para criar a tela, ele passa uma função como parâmetro. Ela será associada ao botão que, quando clicado, deve acionar o ChatGPT. Estamos no arquivo `app.py`.

**Código 2.9.1 · app.py**

```python
import os
from dotenv import load_dotenv
import chatgpt
import tela
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

def criar_pergunta(assunto, tipo, dificuldade, pergunta_exemplo):
    return chatgpt.criar_pergunta(
        OPENAI_API_KEY,
        assunto,
        tipo,
        dificuldade,
        pergunta_exemplo
    )

tela.criar_tela(criar_pergunta)
```

Claro, a assinatura da função `criar_tela` deve ser atualizada para que ela admita receber a função. Observe que, por sua vez, ela passa a função recebida como parâmetro para a função `criar_aba1` a fim de que ela possa associá-la ao botão. Estamos agora no arquivo `tela.py`.

**Código 2.9.2 · tela.py**

```python
def criar_tela(criar_pergunta):
    window = tk.Tk()
    window.title('ChatGPT - Gerador/Corretor de Questões')
    window.minsize(800, 600)

    notebook = ttk.Notebook(window, padding=10)

    #cria a primeir aba
    tab1 = criar_aba1(notebook, criar_pergunta)
    notebook.pack(expand=True, fill='both')
    window.mainloop()
```

Ajustamos agora a função `criar_aba1` para que ela receba a função e a associe ao botão. Observe que a função precisa ser chamada com alguns parâmetros, os quais devem ser extraídos dos componentes visuais com os quais o usuário interage. Por isso, vamos definir uma função que opera sobre eles pegando os dados e então chama a função recebida. Ainda estamos no arquivo `tela.py`.

**Código 2.9.3 · tela.py**

```python
def criar_aba1(notebook, criar_pergunta):
    # ...
    #linha 7
    def executar():
        #num Text TKinter '1.0' representa número da linha (começa do 1) e da coluna (começa do zero)
        #end é uma constante especial que representa "até o último caractere"
        #limpamos para casos de perguntas anteriores
        resposta_text.delete("1.0", 'end')
        resposta = criar_pergunta(assunto_entry.get(), tipo_var.get(), dificuldade_var.get(), pergunta_exemplo.get('1.0', 'end'))
        resposta_text.insert("1.0", resposta)
    ok_button = tk.Button(tab1, text='OK', command=executar)
    ok_button.grid(row=7, column=0, columnspan=4, sticky='WE', padx=5, pady=5)

    #peso 1 para cada linha conforme o usuário expande
    for i in range(8):  # para 8 linhas (0-7)
        tab1.grid_rowconfigure(i, weight=1)  # expande com peso 1
    #peso 1 para cada coluna conforme o usuário expande
    for i in range(4):  # para 4 colunas (0-3)
        tab1.grid_columnconfigure(i, weight=1)  # expande com peso 1
    return tab1
```

## A segunda aba
Duration: 12:00

A segunda aba permitirá que enviemos perguntas ao ChatGPT para que ele as responda. Veja a figura a seguir.

![Aba Responder pergunta com o rótulo "Escreva aqui a sua pergunta:", uma caixa de texto, o rótulo "Eis a resposta do ChatGPT:", outra caixa de texto e o botão OK](img/p039-1.webp)

*Figura 2.10.1: a segunda aba.*

A função que define a segunda aba é semelhante àquela que define a primeira. Estamos no arquivo `tela.py`.

**Código 2.10.1 · tela.py**

```python
import tkinter as tk
from tkinter import ttk

def criar_aba2 (notebook, responder_pergunta):
    tab2 = ttk.Frame(notebook)
    notebook.add(tab2, text='Responder pergunta')
    #linha 0
    tk.Label(tab2, text='Escreva aqui a sua pergunta:').grid(row=0, column=0, sticky='W', padx=5, pady=0)
    #linha 1
    pergunta_text = tk.Text(tab2)
    #20 linhas de texto
    pergunta_text.configure(height=20)
    pergunta_text.grid(row=1, column=0, sticky='WEN', padx=5, pady=0)

    #linha 2
    tk.Label(tab2, text='Eis a resposta do ChatGPT:').grid(row=2, column=0, sticky='W', padx=5, pady=0)
    #linha 3
    resposta_text = tk.Text(tab2)
    #20 linhas de texto
    resposta_text.configure(height=20)
    resposta_text.grid(row=3, column=0, sticky='WEN', padx=5, pady=0)

    #linha 4
    def executar():
        resposta = responder_pergunta( pergunta_text.get('1.0', 'end'))
        resposta_text.delete('1.0', 'end')
        resposta_text.insert('1.0', resposta)
    ok_button = tk.Button(tab2, text='OK', command=executar)
    ok_button.grid(row=4, column=0, sticky='WE', padx=5, pady=5)
    # ...
```

Ainda no arquivo `tela.py`, a função `criar_tela` a utiliza como mostra o código a seguir.

**Código 2.10.2 · tela.py**

```python
def criar_tela(criar_pergunta, responder_pergunta):
    window = tk.Tk()
    window.title('ChatGPT - Gerador/Corretor de Questões')
    window.minsize(800, 600)

    notebook = ttk.Notebook(window, padding=10)

    #cria a primeir aba
    tab1 = criar_aba1(notebook, criar_pergunta)
    #cria a segunda aba
    tab2 = criar_aba2(notebook, responder_pergunta)
    notebook.pack(expand=True, fill='both')
    window.mainloop()
```

No arquivo `app.py`, definimos uma função que utiliza o ChatGPT e a entregamos como parâmetro para a função `criar_tela`.

**Código 2.10.3 · app.py**

```python
import os
from dotenv import load_dotenv
import chatgpt
import tela
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

def criar_pergunta(assunto, tipo, dificuldade, pergunta_exemplo):
    return chatgpt.criar_pergunta(
        OPENAI_API_KEY,
        assunto,
        tipo,
        dificuldade,
        pergunta_exemplo
    )

def responder_pergunta (pergunta_a_ser_respondida):
    return chatgpt.responder_pergunta(
        OPENAI_API_KEY,
        pergunta_a_ser_respondida
    )
tela.criar_tela(criar_pergunta, responder_pergunta)
```

Execute a aplicação com `python app.py` e teste as duas abas.

## Encerramento
Duration: 2:00

Parabéns! Você construiu uma aplicação gráfica com Python e Tkinter que conversa com o ChatGPT para gerar perguntas conforme assunto, tipo e dificuldade, e para responder perguntas enviadas pelo usuário.

### Referências

* OpenAI. OpenAI, 2023. Disponível em [https://openai.com/](https://openai.com/). Acesso em maio de 2023.
* Tkinter: [https://docs.python.org/3/library/tkinter.html](https://docs.python.org/3/library/tkinter.html)
* Modelos GPT-3.5: [https://platform.openai.com/docs/models/gpt-3-5](https://platform.openai.com/docs/models/gpt-3-5)
