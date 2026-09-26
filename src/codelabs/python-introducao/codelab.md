summary: Introdução prática a Python para análise de dados, do zero ao pandas: variáveis, texto, coleções, decisões, laços, funções, tratamento de erros, DataFrames, limpeza, groupby, merge, a base Iris, uma mini-análise e gráficos, com exercícios e gabarito.
id: python-introducao
categories: Python
tags: python,pandas,matplotlib,analise-de-dados,limpeza-de-dados,iris,vscode
status: Published
authors: Rodrigo Bossini
last updated: 2026-08-21
pdf: administracao_de_dados/01_apostila_python_introducao.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Introdução ao Python para análise de dados

## Visão geral
Duration: 5:00

Uma apostila prática, do zero ao **pandas**. O texto explica cada conceito. Sempre que aparecer um bloco marcado **Digite comigo**, é a hora de escrever o código junto — linha por linha, sem pressa. Os blocos **Saída no console** mostram o que deve aparecer na tela. Os avisos de conceito, dica, atenção e desafio destacam o que merece cuidado. No fim há uma lista de exercícios com gabarito para praticar.

Python virou a linguagem mais usada no mundo dos dados por um motivo simples: ela é fácil de ler. Um programa em Python se parece bastante com uma receita escrita em português, com passos claros e poucos símbolos estranhos. Nesta disciplina você não vai virar programador — vai aprender o suficiente para *conversar com os dados*: carregar uma planilha, encontrar erros, limpar informação e responder perguntas de negócio.

A melhor forma de aprender a programar é programando. Por isso a apostila foi feita para ser *digitada*, não apenas lida. Cada bloco **Digite comigo** é um convite: abra o ambiente, escreva o código, execute e veja o resultado. Errar aqui é parte do processo — o computador reclama, você corrige e segue em frente.

> **O que é uma linguagem de programação**
>
> É um jeito de dar instruções ao computador usando palavras e regras bem definidas. O computador é obediente, mas literal: faz exatamente o que está escrito, na ordem em que está escrito. Boa parte de aprender a programar é aprender a ser preciso.

### O que você vai aprender

* Variáveis, tipos, contas e comparações
* Como limpar e formatar texto (f-strings, fatiamento e métodos de string)
* Listas, compreensão de lista, dicionários e conjuntos
* Decisões com `if` / `elif` / `else`, laços `for` e funções (inclusive `lambda`)
* Como tratar dados sujos com `try` / `except`
* pandas: `DataFrame`, leitura de CSV, seleção, filtros, limpeza, `apply`, `groupby`, datas e `merge`
* Uma análise com dados reais (base Iris) e gráficos com matplotlib

### O que você vai precisar

* **VS Code** • **Python 3** • **pandas** • **matplotlib**

## Antes de começar: VS Code e erros
Duration: 10:00

### Onde escrever o código: VS Code

Vamos usar o **Visual Studio Code** (VS Code), um editor gratuito. A preparação é feita *uma única vez*:

1. Instale o Python a partir de [python.org](https://www.python.org) (no Windows, marque a opção **Add Python to PATH** durante a instalação).
2. Instale o **VS Code** e, dentro dele, a extensão **Python** da Microsoft (ícone de extensões na barra lateral).
3. Crie uma pasta para a disciplina, abra-a no VS Code e crie um arquivo terminado em `.py` — por exemplo, `aula.py`.
4. Abra o terminal integrado (menu **Terminal → New Terminal**) e instale as bibliotecas:

**Terminal**

```bash
pip install pandas matplotlib
```

Escreva o primeiro programa no arquivo. A função `print()` mostra algo na tela.

**Digite comigo · aula.py**

```python
print("Olá, mundo dos dados!")
```

Para executar, clique no botão **▷ Run Python File** (canto superior direito) ou digite no terminal:

**Terminal**

```bash
python aula.py
```

O resultado aparece no terminal.

**Saída no console**

```text
Olá, mundo dos dados!
```

<aside class="positive">

**Dica.** Para executar o código *em pequenos pedaços* (como os blocos **Digite comigo** pedem), divida o arquivo em blocos com o marcador `# %%` e use o botão **Run Cell** que aparece acima de cada bloco — ou crie um notebook `.ipynb` no próprio VS Code. Assim você roda uma parte de cada vez e vê o resultado na hora. Comentários começam com `#`: tudo depois dele na linha é ignorado pelo Python.

</aside>

### Quando algo dá errado

Mais cedo ou mais tarde o programa vai parar com uma mensagem em vermelho. Isso é normal e não quebra nada. A informação mais útil está quase sempre na **última linha** da mensagem, que resume o tipo do erro. Aprender a ler esse resumo economiza muito tempo.

**Digite comigo**

```python
print(10 / 0)
```

**Saída no console**

```text
ZeroDivisionError: division by zero
```

A última linha diz `ZeroDivisionError`: uma divisão por zero. O nome do erro já aponta o caminho da correção.

## Variáveis, tipos e contas
Duration: 10:00

### Guardando informação: variáveis e tipos

Para trabalhar com um dado, precisamos guardá-lo com um nome. Esse "lugar com nome" é uma **variável**. O sinal de igual (`=`) não significa "é igual a": ele significa "guarde o valor da direita na caixa da esquerda".

**Digite comigo**

```python
nome = "Maria"
idade = 34
ativo = True
print(nome, idade, ativo)
```

Todo valor tem um **tipo**. Os quatro básicos: texto (`str`), inteiro (`int`), decimal (`float`) e booleano (`bool`, apenas `True` ou `False`). A função `type()` revela o tipo — útil porque muitos erros vêm de um número guardado como texto.

**Digite comigo**

```python
print(type("Maria"))  # str
print(type(34))       # int
print(type(19.90))    # float
print(type(True))     # bool
```

<aside class="negative">

**Atenção.** O separador decimal em Python é o **ponto**: `19.90` é um número; `19,90` o Python entende como duas coisas separadas por vírgula. Guarde isto — vamos tratar o formato brasileiro (vírgula) na parte de limpeza de dados.

</aside>

### Convertendo tipos

Quando um número chega como texto (lido de uma planilha, por exemplo), convertemos com `int()`, `float()` ou `str()`.

**Digite comigo**

```python
preco_texto = "19.90"
preco = float(preco_texto)  # texto -> número decimal
print(preco * 2)            # agora dá para calcular
```

**Saída no console**

```text
39.8
```

### Contas e comparações

Python funciona como uma calculadora. Duas operações merecem atenção: `//` (divisão inteira, só a parte inteira) e `%` (resto da divisão, ótimo para saber se um número é par ou múltiplo de outro).

**Digite comigo**

```python
print(10 / 3)            # 3.3333333333333335
print(10 // 3)           # 3 (divisão inteira)
print(10 % 3)            # 1 (resto)
print(round(10 / 3, 2))  # 3.33 (arredonda com 2 casas)
```

Comparações (`>`, `<`, `==`, `!=`) sempre devolvem um booleano. Para combinar condições, use `and` (e), `or` (ou) e `not` (não).

**Digite comigo**

```python
idade = 20
print(idade == 20)                 # True
print(idade >= 18 and idade < 65)  # True: as DUAS condições valem
print(not (idade > 100))           # True
```

<aside class="negative">

**Atenção.** Um sinal de igual (`=`) guarda um valor; dois (`==`) comparam. Trocar um pelo outro é um dos erros mais frequentes de quem começa.

</aside>

## Trabalhando com texto
Duration: 12:00

Boa parte do trabalho com dados é lidar com texto bagunçado: nomes com espaços a mais, e-mails em maiúsculas, valores com símbolos. Por isso vale dominar as **strings**.

### Juntando texto: f-strings

A **f-string** monta uma frase misturando texto e variáveis: coloque um `f` antes das aspas e escreva as variáveis entre chaves. Ela também formata números.

**Digite comigo**

```python
nome = "Maria"
valor = 1234.5
print(f"{nome} gastou R$ {valor:.2f}")  # duas casas decimais
```

**Saída no console**

```text
Maria gastou R$ 1234.50
```

### Índice e fatiamento

Cada caractere de um texto tem uma posição, começando em **zero**. Podemos pegar um caractere pela posição ou uma "fatia" com `[inicio:fim]` (o fim não entra).

**Digite comigo**

```python
cpf = "12345678900"
print(cpf[0])    # 1 (primeiro caractere)
print(cpf[0:3])  # 123 (posições 0, 1 e 2)
print(cpf[-2:])  # 00 (os dois últimos)
```

### Métodos de texto

Métodos são "ferramentas embutidas" acionadas com um ponto. Os mais úteis na limpeza: `.strip()` (tira espaços das pontas), `.lower()` / `.upper()`, `.replace(a, b)` (troca trechos), `.split(sep)` (quebra em pedaços) e `.title()` (primeira letra maiúscula em cada palavra). Podemos encadear vários.

**Digite comigo**

```python
nome = "  maria   SILVA  "
limpo = nome.strip().title()
print(limpo)                    # "Maria   Silva"
print(" ".join(limpo.split()))  # "Maria Silva" (tira espaços duplos)
```

**Saída no console**

```text
Maria   Silva
Maria Silva
```

O truque `" ".join(texto.split())` é um clássico: `split()` quebra o texto em palavras (descartando espaços extras) e `join()` remonta com um único espaço.

<aside class="positive">

**Desafio.** Limpe um valor monetário no formato brasileiro e transforme em número. A ideia: remover o símbolo, remover o ponto de milhar e trocar a vírgula decimal por ponto.

</aside>

**Digite comigo**

```python
valor_txt = "R$ 1.234,56"
limpo = valor_txt.replace("R$", "").replace(".", "").replace(",", ".").strip()
valor = float(limpo)
print(valor + 10)  # 1244.56
```

> **Por que padronizar texto**
>
> "Maria", "maria" e " MARIA " são, para o computador, três textos diferentes. Se você contar clientes chamados "Maria" sem padronizar antes, vai contar errado. Uniformizar o texto é o primeiro passo de quase toda análise séria.

## Coleções: listas, dicionários e conjuntos
Duration: 12:00

### Listas

A **lista** é uma sequência ordenada, entre colchetes. Aceita índice e fatiamento (como as strings) e traz funções prontas: `len()`, `sum()`, `max()`, `min()`, além do método `.append()` para adicionar.

**Digite comigo**

```python
precos = [19.90, 45.00, 12.50, 89.90]
print(len(precos))  # 4 (quantos itens)
print(sum(precos))  # 167.3 (soma)
print(max(precos))  # 89.9 (maior)
precos.append(30.00)  # adiciona um item ao fim
print(precos[:2])   # [19.9, 45.0] (os dois primeiros)
```

### Compreensão de lista

Uma forma compacta e muito usada de criar uma lista a partir de outra. Leia como uma frase: "para cada `p` em `precos`, faça `p * 1.1`".

**Digite comigo**

```python
precos = [19.90, 45.00, 12.50, 89.90]
com_imposto = [p * 1.1 for p in precos]  # aplica 10% a todos
caros = [p for p in precos if p > 40]    # filtra os acima de 40
print(com_imposto)
print(caros)
```

**Saída no console**

```text
[21.89, 49.50, 13.75, 98.89]
[45.0, 89.9]
```

<aside class="positive">

Na prática, a primeira linha pode aparecer com mais casas decimais, como `49.50000000000001`: é o jeito como o computador representa números decimais. Para exibir arredondado, use `round()` ou uma f-string com `:.2f`.

</aside>

### Dicionários

O **dicionário** guarda pares *chave → valor*. Você acessa por um nome, não por posição. É ideal para representar um registro com vários atributos.

**Digite comigo**

```python
cliente = {"nome": "Maria", "idade": 34, "cidade": "São Paulo"}
print(cliente["cidade"])      # São Paulo
cliente["email"] = "m@x.com"  # adiciona um par novo
for chave, valor in cliente.items():
    print(chave, "->", valor)
```

> **Dicionário, lista de dicionários e tabela**
>
> Guarde esta ponte: um dicionário parece uma **linha de tabela** (as chaves são os nomes das colunas). Uma **lista de dicionários** parece uma tabela inteira. É exatamente assim que o pandas vai organizar os dados adiante.

**Digite comigo**

```python
tabela = [
    {"nome": "Maria", "valor": 150.0},
    {"nome": "João", "valor": 89.90},
    {"nome": "Ana", "valor": 230.5},
]
print(tabela[1]["nome"])  # João
```

### Conjuntos: valores únicos

O **conjunto** (`set`) guarda apenas valores *distintos* — perfeito para descobrir quantos valores diferentes existem ou detectar repetição.

**Digite comigo**

```python
cidades = ["SP", "RJ", "SP", "MG", "RJ", "SP"]
print(set(cidades))       # {'SP', 'RJ', 'MG'}
print(len(set(cidades)))  # 3 cidades distintas
```

## Decisões e laços
Duration: 10:00

### Tomando decisões: if / elif / else

Programas ficam úteis quando decidem o que fazer conforme os dados. O bloco que roda quando a condição é verdadeira fica **indentado** (deslocado à direita). Com mais de duas possibilidades, usamos `elif` no meio; o Python testa de cima para baixo e para na primeira condição verdadeira.

**Digite comigo**

```python
valor = 250
if valor >= 500:
    faixa = "alto"
elif valor >= 100:
    faixa = "medio"
else:
    faixa = "baixo"
print(f"Cliente de ticket {faixa}")
```

O operador `in` verifica se um valor está numa coleção — muito prático para validar.

**Digite comigo**

```python
uf = "SP"
validos = ["SP", "RJ", "MG", "PR", "RS"]
if uf in validos:
    print("UF reconhecida")
else:
    print("UF inválida")
```

<aside class="negative">

**Atenção.** A indentação *faz parte da linguagem*: tudo deslocado à direita depois dos dois-pontos "pertence" àquele bloco. O VS Code aplica a indentação sozinho ao apertar Enter. Misturar espaços de forma inconsistente gera `IndentationError`.

</aside>

### Repetindo tarefas: laços

Para não repetir o mesmo comando dezenas de vezes, pedimos ao computador que repita. O laço `for` percorre uma coleção, item por item.

**Digite comigo**

```python
precos = [19.90, 45.00, 12.50]
total = 0
for p in precos:
    total = total + p  # acumula
print(f"Total: R$ {total:.2f}")
```

O padrão acima (uma variável que vai somando) chama-se **acumulador**. Um primo dele é o **contador**, que soma 1 a cada item que satisfaz uma condição. Veja um exemplo mais completo: contar quantos e-mails de uma lista são inválidos (aqui, "sem @").

**Digite comigo**

```python
emails = ["ana@x.com", "joao.com", "maria@y.com", "sem-arroba"]
invalidos = 0
for email in emails:
    if "@" not in email:
        invalidos = invalidos + 1
        print(f"Inválido: {email}")
print(f"Total de inválidos: {invalidos}")
```

**Saída no console**

```text
Inválido: joao.com
Inválido: sem-arroba
Total de inválidos: 2
```

<aside class="positive">

**Dica.** Para repetir um número fixo de vezes, use `range()`: `for i in range(5)` vai de 0 a 4. E `enumerate()` entrega, a cada volta, a posição *e* o item ao mesmo tempo — útil quando você precisa saber "em qual linha estou".

</aside>

**Digite comigo**

```python
nomes = ["Maria", "João", "Ana"]
for i, nome in enumerate(nomes):
    print(i, nome)  # 0 Maria / 1 João / 2 Ana
```

## Funções, lambda e try/except
Duration: 12:00

### Organizando o código: funções

Quando um trecho é útil e se repete, transforme-o numa **função**: um bloco com nome que recebe entradas (*parâmetros*), faz algo e `return` devolve um resultado. Uma função pode ter parâmetros com **valor padrão** e devolver **mais de um valor**.

**Digite comigo**

```python
def resumo_vendas(valores, imposto=0.1):
    total = sum(valores)
    medio = total / len(valores)
    total_com_imposto = total * (1 + imposto)
    return total, medio, total_com_imposto

t, m, ti = resumo_vendas([100, 200, 300])
print(f"Total: {t} Médio: {m:.2f} Com imposto: {ti:.2f}")
```

**Saída no console**

```text
Total: 600 Médio: 200.00 Com imposto: 660.00
```

O parâmetro `imposto=0.1` tem valor padrão: se você não informar, ele vale 0,1. E o `return` devolveu três valores de uma vez, que capturamos em `t`, `m` e `ti`.

> **Por que usar funções**
>
> Funções evitam repetição e dão nome a uma ideia. Em vez de repetir a mesma conta em dez lugares, você a escreve uma vez, testa e chama pelo nome. Se precisar corrigir, corrige num lugar só. É a base para construir análises maiores sem se perder.

### Funções em uma linha: lambda

Às vezes precisamos de uma função tão pequena que criar um `def` inteiro parece exagero. Para esses casos existe a **lambda**: uma função curta, sem nome, escrita em uma única linha. Leia `lambda x: ...` como "dado um `x`, devolva ...". Ela não usa a palavra `return` — o resultado é o que vem depois dos dois-pontos.

**Exemplo 1 — dobrar um número.** A lambda abaixo faz exatamente o mesmo que uma função tradicional, só que em uma linha.

**Digite comigo**

```python
dobro = lambda x: x * 2
print(dobro(5))  # 10

# é equivalente a escrever:
def dobro_def(x):
    return x * 2

print(dobro_def(5))  # 10
```

**Exemplo 2 — decidir com uma condição.** A lambda também aceita um teste `if` / `else` na mesma linha — útil para classificar um valor.

**Digite comigo**

```python
situacao = lambda nota: "aprovado" if nota >= 70 else "reprovado"
print(situacao(85))  # aprovado
print(situacao(40))  # reprovado
```

<aside class="positive">

**Dica.** Na prática, quase nunca guardamos a lambda numa variável como acima — isso foi só para enxergar como ela funciona. O uso mais comum é passá-la direto para outra função, como o `apply()` do pandas, que veremos em instantes: ali a lambda é aplicada a cada valor de uma coluna.

</aside>

### Quando o dado está sujo: try / except

Dados reais vêm com surpresas: um campo que deveria ser número traz o texto `"abc"`, e a conversão `int("abc")` quebra o programa. O bloco `try` / `except` permite "tentar" uma operação e, se ela falhar, tratar o erro em vez de parar tudo.

**Digite comigo**

```python
valores = ["100", "abc", "250", ""]
for v in valores:
    try:
        numero = int(v)
        print(numero * 2)
    except ValueError:
        print(f"'{v}' não é um número válido")
```

**Saída no console**

```text
200
'abc' não é um número válido
500
'' não é um número válido
```

> **Robustez**
>
> Programas que lidam com dados precisam sobreviver ao inesperado. Em vez de confiar que todo valor está perfeito, prevemos a falha e decidimos o que fazer com ela — descartar, substituir por zero, registrar. Adiante, o pandas nos dará um atalho para isso (`errors="coerce"`), mas a ideia é a mesma.

## Bibliotecas e o DataFrame
Duration: 10:00

### Ampliando o Python: bibliotecas

O Python básico é enxuto de propósito. Tudo o que é mais especializado vem em **bibliotecas** que "importamos". O `as` cria um apelido curto: praticamente todo código de dados no mundo usa `pd` para o pandas e `plt` para o matplotlib.

**Digite comigo**

```python
import pandas as pd
import matplotlib.pyplot as plt
```

### pandas: a estrela da disciplina

O **pandas** transforma o Python numa ferramenta de análise. Uma planilha inteira vira uma variável que você consulta, filtra e resume com poucas linhas.

#### DataFrame: a tabela do pandas

A estrutura principal é o **DataFrame**: uma tabela com linhas e colunas nomeadas, como uma planilha. Cada coluna, isolada, é uma **Series**.

**Digite comigo**

```python
import pandas as pd

dados = {
    "cliente": ["Maria", "João", "Ana", "Bruno"],
    "cidade": ["São Paulo", "Recife", "Curitiba", "Recife"],
    "valor": [150.0, 89.90, 230.5, 60.0],
}
df = pd.DataFrame(dados)
print(df)
```

**Saída no console**

```text
  cliente     cidade   valor
0   Maria  São Paulo  150.00
1    João     Recife   89.90
2     Ana   Curitiba  230.50
3   Bruno     Recife   60.00
```

A numeração à esquerda é o **índice**, criado automaticamente para identificar cada linha.

#### Lendo dados de um arquivo

Na prática os dados vêm de um arquivo, quase sempre um **CSV**. A função `read_csv()` carrega tudo de uma vez. Atenção aos parâmetros — eles resolvem os problemas mais comuns com arquivos brasileiros.

**Digite comigo**

```python
df = pd.read_csv("clientes.csv",
                 sep=";",           # separador ; comum no Brasil
                 decimal=",",       # vírgula como separador decimal
                 encoding="utf-8")  # acentuação
```

<aside class="positive">

**Dica.** No VS Code, o jeito mais simples é deixar o arquivo CSV **na mesma pasta do seu script**: aí basta `pd.read_csv("clientes.csv")`. Também dá para ler direto de uma URL, passando o endereço dentro de `read_csv()`. Ao longo da disciplina usaremos o conjunto de e-commerce da **Olist**, que é brasileiro e bem próximo de dados reais.

</aside>

#### Conhecendo os dados

A primeira coisa após carregar é *olhar*. Estes comandos respondem às perguntas iniciais de qualquer análise.

**Digite comigo**

```python
df.head()                    # 5 primeiras linhas
df.shape                     # (linhas, colunas)
df.dtypes                    # tipo de cada coluna
df.info()                    # resumo: colunas, tipos e quantos valores preenchidos
df.describe()                # estatísticas das colunas numéricas
df["cidade"].value_counts()  # quantas vezes cada valor aparece
```

> **.info() e .value_counts()**
>
> O `.info()` é seu diagnóstico de qualidade: mostra, coluna a coluna, o tipo e quantos valores estão preenchidos — denuncia na hora um preço guardado como texto ou linhas com campo vazio. Já o `.value_counts()` revela a distribuição de uma coluna categórica: ótimo para achar categorias escritas de formas diferentes ("SP", "sp", "S.P.").

## pandas: selecionar, filtrar e limpar
Duration: 15:00

### Selecionando com loc e iloc

Para escolher linhas e colunas específicas, o pandas oferece dois seletores: `loc` trabalha por **rótulo** (nome da coluna, valor do índice) e `iloc` por **posição** (números).

**Digite comigo**

```python
df["cidade"]                         # uma coluna inteira (uma Series)
df.loc[0, "cidade"]                  # valor da linha de índice 0, coluna cidade
df.iloc[0, 1]                        # mesma célula, por posição (linha 0, coluna 1)
df.loc[df["valor"] > 100, "cliente"]  # clientes com valor acima de 100
```

### Filtrando linhas

Escreva uma condição entre colchetes; o pandas mantém as linhas em que ela é verdadeira. Vários atalhos deixam o filtro mais legível: `.isin()`, `.between()` e o acessor de texto `.str.contains()`.

**Digite comigo**

```python
df[df["valor"] > 100]                          # valor acima de 100
df[df["cidade"].isin(["Recife", "Curitiba"])]  # em uma lista de cidades
df[df["valor"].between(80, 200)]               # faixa de valores
df[df["cliente"].str.contains("a")]            # nome que contém "a"
# combinar condições: & para "e", | para "ou", cada uma entre parênteses
df[(df["valor"] > 100) & (df["cidade"] == "Curitiba")]
```

<aside class="negative">

**Atenção.** Ao combinar condições no pandas, cada uma fica **entre parênteses** e usamos `&` (e) e `|` (ou), não as palavras `and` e `or`. Esquecer os parênteses gera uma das mensagens de erro mais confusas para quem começa.

</aside>

### Criando e convertendo colunas

Uma coluna nova pode nascer de outras — o cálculo vale para todas as linhas de uma vez. E quando um número veio como texto (formato brasileiro, por exemplo), convertemos.

**Digite comigo**

```python
# coluna nova a partir de outras
df["com_frete"] = df["valor"] + 15

# converter texto no formato brasileiro para número
serie = pd.Series(["1.234,56", "89,90", "abc"])
numeros = serie.str.replace(".", "", regex=False)       # tira milhar
numeros = numeros.str.replace(",", ".", regex=False)    # vírgula -> ponto
numeros = pd.to_numeric(numeros, errors="coerce")       # texto ruim vira vazio
print(numeros)
```

**Saída no console**

```text
0    1234.56
1      89.90
2        NaN
dtype: float64
```

O `errors="coerce"` é o atalho prometido: em vez de quebrar em `"abc"`, o pandas troca o valor inválido por `NaN` (vazio) e segue.

### Encontrando problemas: ausentes e duplicatas

**Digite comigo**

```python
df.isnull().sum()                    # conta vazios em cada coluna
df["valor"].fillna(0)                # preenche vazios com 0
df.dropna(subset=["valor"])          # remove linhas sem valor
df.duplicated().sum()                # quantas linhas são duplicadas
df.drop_duplicates(subset="cliente")  # remove clientes repetidos
```

> **Limpeza é análise**
>
> Cada número que sai de uma análise carrega a qualidade dos dados que entraram. Um relatório construído sobre uma tabela cheia de duplicatas e campos vazios dá uma resposta *precisa e errada*. A limpeza não é uma etapa chata antes do "trabalho de verdade" — ela é o trabalho de verdade.

## pandas: apply, groupby, datas e merge
Duration: 15:00

### Transformando valores: apply e lambda

Às vezes queremos aplicar a cada valor de uma coluna uma regra que não é uma conta simples. O `apply()` faz isso, e a `lambda` é uma mini-função escrita na própria linha. Leia `lambda v: ...` como "dado um valor `v`, devolva ...".

**Digite comigo**

```python
df["faixa"] = df["valor"].apply(lambda v: "alto" if v > 100 else "baixo")
print(df[["cliente", "valor", "faixa"]])
```

**Saída no console**

```text
  cliente   valor  faixa
0   Maria  150.00   alto
1    João   89.90  baixo
2     Ana  230.50   alto
3   Bruno   60.00  baixo
```

### Agrupando e resumindo: groupby

Uma das operações mais poderosas. O `groupby` agrupa linhas por uma categoria e calcula um resumo por grupo — como a tabela dinâmica do Excel, em uma linha. Com `.agg()` calculamos várias medidas de uma vez e damos nome a cada uma.

**Digite comigo**

```python
# ticket médio por cidade
df.groupby("cidade")["valor"].mean()

# várias medidas de uma vez
df.groupby("cidade").agg(
    total=("valor", "sum"),
    media=("valor", "mean"),
    pedidos=("valor", "count"),
)
```

**Saída no console**

```text
           total   media  pedidos
cidade
Curitiba   230.5  230.50        1
Recife     149.9   74.95        2
São Paulo  150.0  150.00        1
```

Com `groupby` respondemos perguntas de negócio de verdade: qual cidade compra mais? Qual o ticket médio por categoria? Qual mês teve mais pedidos?

### Ordenando e o Top-N

Para ver rankings, ordene com `sort_values()` e pegue as primeiras linhas com `.head()`.

**Digite comigo**

```python
# as 3 maiores compras
df.sort_values("valor", ascending=False).head(3)
```

### Trabalhando com datas

Datas costumam chegar como texto. `pd.to_datetime()` as converte para um tipo de data de verdade, e o acessor `.dt` extrai partes (ano, mês, dia da semana).

**Digite comigo**

```python
df["data"] = pd.to_datetime(df["data"])  # texto -> data
df["mes"] = df["data"].dt.month          # extrai o mês
df["ano"] = df["data"].dt.year           # extrai o ano
# total por mês:
df.groupby("mes")["valor"].sum()
```

<aside class="positive">

Este trecho supõe um DataFrame com uma coluna `data`; o `df` de exemplo dos passos anteriores não tem essa coluna.

</aside>

### Juntando duas tabelas: merge

Raramente tudo está numa tabela só. Um arquivo tem os pedidos; outro, os dados dos clientes. O `merge` combina os dois por uma coluna em comum (a "chave") — a mesma ideia do PROCV do Excel, e a base da modelagem dimensional que veremos adiante.

**Digite comigo**

```python
pedidos = pd.DataFrame({
    "id_cliente": [1, 2, 1, 3],
    "valor": [100, 200, 50, 80],
})
clientes = pd.DataFrame({
    "id_cliente": [1, 2, 3],
    "nome": ["Ana", "Bruno", "Carla"],
    "cidade": ["SP", "RJ", "MG"],
})
completo = pedidos.merge(clientes, on="id_cliente")
print(completo)
```

**Saída no console**

```text
   id_cliente  valor   nome cidade
0           1    100    Ana     SP
1           1     50    Ana     SP
2           2    200  Bruno     RJ
3           3     80  Carla     MG
```

Depois do merge, cada pedido carrega o nome e a cidade do cliente — e podemos agrupar por cidade, mesmo que essa informação estivesse em outra tabela.

## Dados reais: a base Iris
Duration: 12:00

Até aqui usamos tabelas pequenas escritas à mão. Vamos abrir um arquivo de verdade. A base **Iris** é uma das menores e mais conhecidas do mundo dos dados: apenas **150 linhas**, cada uma descrevendo uma flor de íris. Foi organizada pelo estatístico Ronald Fisher em 1936 e desde então virou o "olá, mundo" da análise de dados — justamente por ser pequena, limpa e fácil de entender.

Cada flor pertence a uma de três espécies (*setosa*, *versicolor* e *virginica*), com 50 flores de cada. Para cada flor foram medidas quatro características, todas em centímetros. Duas dizem respeito à **pétala** (a parte colorida e chamativa da flor) e duas à **sépala** (a estrutura, em geral esverdeada, que protege o botão antes de a flor abrir e a sustenta por baixo). A ideia por trás da base é simples e poderosa: será que dá para descobrir a espécie de uma flor apenas olhando o tamanho das suas pétalas e sépalas?

> **O que é cada campo (dicionário de dados)**
>
> Antes de analisar qualquer tabela, vale montar seu **dicionário de dados**: uma lista que diz o que cada coluna significa. Para a base Iris, fica assim.

| Coluna | Significado |
| --- | --- |
| Id | Número que identifica cada flor (a linha da tabela). |
| SepalLengthCm | Comprimento da sépala, em centímetros. |
| SepalWidthCm | Largura da sépala, em centímetros. |
| PetalLengthCm | Comprimento da pétala, em centímetros. |
| PetalWidthCm | Largura da pétala, em centímetros. |
| Species | Espécie da flor: *Iris-setosa*, *Iris-versicolor* ou *Iris-virginica*. |

Baixe a base em [kaggle.com/datasets/uciml/iris](https://www.kaggle.com/datasets/uciml/iris) (arquivo `Iris.csv`) e salve-a na **mesma pasta** do seu script. Depois, carregue e dê uma primeira olhada.

**Digite comigo**

```python
import pandas as pd

df = pd.read_csv("Iris.csv")
print(df.shape)  # (150, 6): 150 linhas e 6 colunas
df.head()
```

**Saída no console**

```text
   Id  SepalLengthCm  SepalWidthCm  PetalLengthCm  PetalWidthCm      Species
0   1            5.1           3.5            1.4           0.2  Iris-setosa
1   2            4.9           3.0            1.4           0.2  Iris-setosa
2   3            4.7           3.2            1.3           0.2  Iris-setosa
3   4            4.6           3.1            1.5           0.2  Iris-setosa
4   5            5.0           3.6            1.4           0.2  Iris-setosa
```

Quantas flores de cada espécie existem? O `value_counts()` responde na hora.

**Digite comigo**

```python
df["Species"].value_counts()
```

**Saída no console**

```text
Species
Iris-setosa        50
Iris-versicolor    50
Iris-virginica     50
Name: count, dtype: int64
```

Agora a pergunta interessante: o tamanho da pétala muda conforme a espécie? Um `groupby` resolve — comprimento médio da pétala por espécie.

**Digite comigo**

```python
df.groupby("Species")["PetalLengthCm"].mean().round(3)
```

**Saída no console**

```text
Species
Iris-setosa        1.462
Iris-versicolor    4.260
Iris-virginica     5.552
Name: PetalLengthCm, dtype: float64
```

Repare como o comprimento médio da pétala separa bem as espécies: a *setosa* tem pétalas muito menores que as demais. Uma única linha de `groupby` já revelou um padrão real dos dados — exatamente o tipo de leitura que faremos o semestre inteiro, só que com bases maiores e brasileiras.

## Mini-análise e gráficos
Duration: 12:00

### Juntando tudo: uma mini-análise

Vamos encadear o que aprendemos numa situação realista. Uma tabela de pedidos chega suja: tem uma linha duplicada, um valor no formato brasileiro e um valor inválido. A pergunta de negócio é simples — *qual o nosso ticket médio?* — mas a resposta muda completamente se ignorarmos a sujeira.

**Digite comigo**

```python
import pandas as pd

dados = {
    "pedido": [1, 2, 2, 3, 4],
    "valor": ["100,00", "250,50", "250,50", "abc", "80,00"],
}
df = pd.DataFrame(dados)
print(df["valor"].dtype)  # object -> é TEXTO, não dá para tirar média ainda
```

Agora limpamos, passo a passo: remover a duplicata, converter o formato brasileiro, descartar o valor inválido — e só então calcular.

**Digite comigo**

```python
df = df.drop_duplicates(subset="pedido")  # tira o pedido 2 repetido
df["valor"] = df["valor"].str.replace(",", ".", regex=False)
df["valor"] = pd.to_numeric(df["valor"], errors="coerce")  # "abc" -> NaN
df = df.dropna(subset=["valor"])  # descarta o inválido

print(f"Pedidos válidos: {len(df)}")
print(f"Ticket médio: R$ {df['valor'].mean():.2f}")
```

**Saída no console**

```text
Pedidos válidos: 3
Ticket médio: R$ 143.50
```

> **O momento "por que isso importa"**
>
> Sem limpar, essa tabela não permitiria sequer calcular a média (a coluna era texto). Uma tentativa apressada de "consertar na marra" contaria o pedido duplicado e distorceria o resultado. O mesmo dado, tratado com cuidado, dá uma resposta em que dá para confiar — e é disso que trata toda a disciplina.

### Transformando números em gráficos

Uma tabela com centenas de linhas não conta uma história — um gráfico conta. O pandas se integra ao **matplotlib**, então dá para plotar direto do DataFrame.

**Digite comigo**

```python
import matplotlib.pyplot as plt

total_cidade = df.groupby("cidade")["valor"].sum()
total_cidade.sort_values().plot(kind="barh")  # barras horizontais
plt.title("Total vendido por cidade")
plt.xlabel("Valor (R$)")
plt.show()
```

<aside class="positive">

Este gráfico usa o DataFrame de clientes, com a coluna `cidade`, dos passos sobre pandas (a tabela da mini-análise não tem essa coluna).

</aside>

<aside class="positive">

**Dica.** Tipos mais comuns: `kind="bar"` (comparar categorias), `kind="line"` (evolução no tempo) e `kind="hist"` (distribuição de uma variável). Comece simples: um bom gráfico de barras já responde a maioria das perguntas.

</aside>

## Boas práticas e cola rápida
Duration: 5:00

Você percorreu o caminho completo: do primeiro `print()` até juntar tabelas, agrupar e plotar. Não precisa decorar nada — a fluência vem com a prática. Alguns hábitos ajudam desde já:

* **Execute em pequenos passos.** Escreva uma ou duas linhas, execute, confira, e só então continue. Não escreva vinte linhas para descobrir o erro no fim.
* **Leia a última linha do erro.** Ela quase sempre diz o tipo do problema.
* **Olhe os dados antes de analisá-los.** `.head()`, `.info()` e `.describe()` logo no início evitam conclusões erradas depois.
* **Nomeie bem as variáveis.** `ticket_medio` diz muito mais que `x`.

### Comandos que você mais vai usar

| Comando | O que faz |
| --- | --- |
| `print(x)` | mostra x na tela |
| `type(x)` | informa o tipo de x |
| `len(col)` | tamanho de uma coleção |
| `f"...{v:.2f}"` | texto com número (2 casas) |
| `[x for x in lista if ...]` | compreensão de lista com filtro |
| `import pandas as pd` | carrega o pandas |
| `pd.read_csv("a.csv", sep=";", decimal=",")` | lê CSV brasileiro |
| `df.head()` / `df.info()` | primeiras linhas / diagnóstico |
| `df["col"].value_counts()` | distribuição de uma coluna |
| `df.loc[lin, col]` / `df.iloc[i, j]` | selecionar por rótulo / posição |
| `df[df["v"] > 100]` | filtrar linhas por condição |
| `pd.to_numeric(s, errors="coerce")` | texto para número (sem quebrar) |
| `df.isnull().sum()` | conta valores ausentes |
| `df.drop_duplicates()` | remove duplicatas |
| `df["c"].apply(lambda v: ...)` | transforma cada valor |
| `df.groupby("c").agg(...)` | resumo por grupo |
| `a.merge(b, on="chave")` | junta duas tabelas |
| `pd.to_datetime(df["data"])` | texto para data |
| `df.sort_values("v").head(3)` | ranking Top-N |

## Exercícios
Duration: 30:00

Resolva no VS Code, executando aos poucos. Não precisa acertar de primeira — o objetivo é praticar. Consulte a resposta só depois de tentar. Muitas vezes há mais de um caminho correto — se o seu resultado bate, está valendo.

### Fundamentos

**1.** Crie variáveis `nome` (seu nome), `idade` e `cidade` e imprima uma frase usando uma f-string: "Meu nome é X, tenho Y anos e moro em Z."

**2.** Um produto custa R\$ 49,90 e você compra 3 unidades. Calcule e imprima o total com duas casas decimais.

**3.** Dado `n = 47`, use o operador `%` para descobrir e imprimir se `n` é par ou ímpar (dica: um número é par quando `n % 2 == 0`).

<details><summary>Ver resposta</summary>

```python
# 1
nome, idade, cidade = "Ana", 20, "Recife"
print(f"Meu nome é {nome}, tenho {idade} anos e moro em {cidade}.")

# 2
total = 49.90 * 3
print(f"R$ {total:.2f}")  # R$ 149.70

# 3
n = 47
if n % 2 == 0:
    print("par")
else:
    print("ímpar")  # ímpar
```

</details>

### Texto

**4.** A partir de `email = "  Joao.SILVA@Email.COM "`, produza a versão limpa `"joao.silva@email.com"` (sem espaços nas pontas e tudo minúsculo).

**5.** Dado `cpf = "123.456.789-00"`, imprima apenas os números (sem pontos e traço).

**6.** Converta o texto `"R$ 2.500,75"` para o número `2500.75` e some 100 a ele.

<details><summary>Ver resposta</summary>

```python
# 4
email = "  Joao.SILVA@Email.COM "
print(email.strip().lower())  # joao.silva@email.com

# 5
cpf = "123.456.789-00"
print(cpf.replace(".", "").replace("-", ""))  # 12345678900

# 6
txt = "R$ 2.500,75"
limpo = txt.replace("R$", "").replace(".", "").replace(",", ".").strip()
print(float(limpo) + 100)  # 2600.75
```

</details>

### Coleções e laços

**7.** Dada `precos = [30, 45, 12, 88, 60]`, imprima a soma, o maior e o menor valor.

**8.** Usando compreensão de lista, crie a lista dos preços acima de 40 a partir de `precos`.

**9.** Dada `ufs = ["SP", "RJ", "SP", "MG", "RJ", "SP"]`, descubra quantas UFs *distintas* existem.

**10.** Percorra `precos` com um laço `for` e conte quantos valores são maiores que 50.

<details><summary>Ver resposta</summary>

```python
precos = [30, 45, 12, 88, 60]

# 7
print(sum(precos), max(precos), min(precos))  # 235 88 12

# 8
print([p for p in precos if p > 40])  # [45, 88, 60]

# 9
ufs = ["SP", "RJ", "SP", "MG", "RJ", "SP"]
print(len(set(ufs)))  # 3

# 10
qtd = 0
for p in precos:
    if p > 50:
        qtd = qtd + 1
print(qtd)  # 2
```

</details>

### Decisões e funções

**11.** Escreva uma função `classifica(valor)` que devolve `"alto"` se `valor >= 200`, `"medio"` se `valor >= 100`, e `"baixo"` caso contrário. Teste com 250, 150 e 30.

**12.** Escreva uma função `email_valido(email)` que devolve `True` se o texto contém `"@"` e `"."`, e `False` caso contrário.

**13.** Usando `try` / `except`, percorra `["10", "x", "25"]` e imprima o dobro de cada valor que for um número válido, ignorando os demais.

<details><summary>Ver resposta</summary>

```python
# 11
def classifica(valor):
    if valor >= 200:
        return "alto"
    elif valor >= 100:
        return "medio"
    else:
        return "baixo"

print(classifica(250), classifica(150), classifica(30))  # alto medio baixo

# 12
def email_valido(email):
    return "@" in email and "." in email

print(email_valido("a@b.com"), email_valido("erro"))  # True False

# 13
for v in ["10", "x", "25"]:
    try:
        print(int(v) * 2)  # 20 e 50 (o "x" é ignorado)
    except ValueError:
        pass
```

</details>

### pandas — básico

Use este DataFrame como ponto de partida:

**Digite comigo**

```python
import pandas as pd

df = pd.DataFrame({
    "cliente": ["Ana", "Bruno", "Carla", "Diego", "Ana"],
    "cidade": ["SP", "RJ", "SP", "MG", "SP"],
    "valor": [120.0, 80.0, 200.0, 50.0, 120.0],
})
```

**14.** Mostre as primeiras linhas e descubra quantas linhas e colunas o DataFrame tem.

**15.** Quantas vezes cada cidade aparece na coluna `cidade`?

**16.** Filtre e mostre apenas os clientes com `valor` acima de 100.

**17.** Remova as linhas duplicadas e diga quantas linhas sobraram.

<details><summary>Ver resposta</summary>

```python
# 14
df.head()
print(df.shape)  # (5, 3)

# 15
print(df["cidade"].value_counts())  # SP 3, RJ 1, MG 1

# 16
print(df[df["valor"] > 100])  # Ana, Carla, Ana

# 17
limpo = df.drop_duplicates()
print(len(limpo))  # 4 (uma linha "Ana/SP/120" era repetida)
```

</details>

### pandas — análise

**18.** Calcule o *ticket médio* (média de `valor`) por cidade.

**19.** Crie uma coluna `faixa` com `"alto"` para `valor >= 100` e `"baixo"` caso contrário (use `apply` com `lambda`).

**20.** Mostre as 2 maiores compras (Top-2 por `valor`).

**21.** Junte (`merge`) o DataFrame de pedidos abaixo com o de clientes pela coluna `id_cliente` e calcule o total gasto por cliente:

**Digite comigo**

```python
pedidos = pd.DataFrame({"id_cliente": [1, 2, 1, 3],
                        "valor": [100, 200, 50, 80]})
clientes = pd.DataFrame({"id_cliente": [1, 2, 3],
                         "nome": ["Ana", "Bruno", "Carla"]})
```

<details><summary>Ver resposta</summary>

```python
# 18
print(df.groupby("cidade")["valor"].mean())

# 19
df["faixa"] = df["valor"].apply(lambda v: "alto" if v >= 100 else "baixo")

# 20
print(df.sort_values("valor", ascending=False).head(2))

# 21
completo = pedidos.merge(clientes, on="id_cliente")
print(completo.groupby("nome")["valor"].sum())  # Ana 150, Bruno 200, Carla 80
```

</details>

### Desafio

**Análise ponta a ponta.** Você recebe a tabela suja abaixo. Faça a limpeza completa (remover duplicata por `pedido`, converter o `valor` do formato brasileiro, descartar valores inválidos) e responda: quantos pedidos válidos restaram e qual o ticket médio?

**Digite comigo**

```python
sujo = pd.DataFrame({
    "pedido": [1, 2, 2, 3, 4, 5],
    "valor": ["199,90", "50,00", "50,00", "??", "300,00", "80,50"],
})
```

<details><summary>Ver resposta</summary>

```python
sujo = sujo.drop_duplicates(subset="pedido")
sujo["valor"] = sujo["valor"].str.replace(",", ".", regex=False)
sujo["valor"] = pd.to_numeric(sujo["valor"], errors="coerce")
sujo = sujo.dropna(subset=["valor"])

print(f"Pedidos válidos: {len(sujo)}")  # 4
print(f"Ticket médio: R$ {sujo['valor'].mean():.2f}")  # R$ 157.60
```

</details>

Bons estudos — e não esqueça: a melhor forma de aprender é *digitando*.
