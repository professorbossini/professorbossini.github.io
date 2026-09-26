summary: O roteiro do projeto do semestre de Data Warehouse, do zero ao dashboard: dados reais do Kaggle, modelagem dimensional snowflake e star no PostgreSQL, ETL com Python e Pandas, consultas analíticas em SQL e dashboards no Power BI.
id: dw-projeto-semestre
categories: PostgreSQL,Bancos de Dados,Python
tags: data-warehouse,projeto,postgresql,python,pandas,kaggle,power-bi,star-schema,snowflake
status: Published
authors: Rodrigo Bossini
last updated: 2026-02-24
pdf: postgresql/Projeto-do-Semestre-Data-Warehouse.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Projeto do semestre: Data Warehouse do zero ao dashboard

## Visão geral
Duration: 5:00

Da teoria à prática com **PostgreSQL**, **Python** e **Power BI**. Ao longo do semestre, vamos construir um pipeline completo de dados do zero, passando por todas as etapas que um engenheiro/analista de dados enfrenta no mercado real:

1. **Obtenção de dados reais do Kaggle** — download e exploração de datasets reais
2. **Modelagem de um Data Warehouse** — criação do modelo dimensional completo
3. **Carga e pré-processamento com Python** — tratamento e transformação dos dados
4. **Armazenamento em PostgreSQL** — implementação do banco de dados analítico
5. **Geração de insights com SQL** — queries complexas para análise de negócio
6. **Visualização com Power BI** — dashboards interativos e storytelling

### O que você vai aprender

* **Fundamentos de Data Warehouse** — modelagem dimensional completa
* **OLTP vs OLAP** — diferenças entre sistemas transacionais e analíticos
* **ETL vs ELT** — abordagens de integração de dados
* **Star e Snowflake** — modelagem na prática com trade-offs reais
* **Python e Pandas** — engenharia de dados profissional
* **PostgreSQL** — armazenamento analítico robusto
* **SQL avançado** — JOINs complexos e queries analíticas
* **Power BI** — visualização e storytelling com dados

### O que você vai precisar

| Tecnologia | Papel no projeto |
| --- | --- |
| Python 3 | Pandas + SQLAlchemy para ETL |
| PostgreSQL | Banco de dados analítico |
| Jupyter Notebook | Ambiente de desenvolvimento |
| Power BI Desktop | Visualização de dados |
| Kaggle API | Obtenção de datasets |
| Git | Versionamento de código |

## Conceitos: DW, OLTP e OLAP
Duration: 6:00

### O que é um Data Warehouse?

> **Data Warehouse**
>
> Um repositório central de dados integrados, históricos e organizados para fins de análise e tomada de decisão. Diferente de bancos de dados transacionais (OLTP), o DW é otimizado para consultas analíticas complexas.

Características fundamentais:

* **Orientado por assunto** — organizado por temas de negócio (vendas, clientes, produtos).
* **Integrado** — dados de múltiplas fontes consolidados com padrão único.
* **Variante no tempo** — histórico preservado para análise temporal.
* **Não volátil** — dados não são apagados, apenas adicionados.

### OLTP vs OLAP

**OLTP (Online Transaction Processing)** é usado em sistemas operacionais do dia a dia. Muitas transações pequenas e rápidas. Exemplos:

* Sistema de vendas
* ERP
* E-commerce

**OLAP (Online Analytical Processing)** é usado para análise de grandes volumes de dados históricos. Consultas complexas com agregações, filtros e comparações temporais. É aqui que o Data Warehouse vive. Exemplos de perguntas OLAP:

* Qual foi o produto mais vendido no último trimestre por região?
* Como evoluiu o ticket médio nos últimos 3 anos?
* Quais clientes têm maior risco de *churn*?

## Conceitos: ETL, fato e dimensões
Duration: 8:00

### ETL vs ELT

Duas abordagens diferentes para integração de dados no Data Warehouse, cada uma com suas vantagens dependendo do contexto tecnológico.

| ETL (Extract, Transform, Load) | ELT (Extract, Load, Transform) |
| --- | --- |
| Extrai, transforma e carrega dados antes do DW | Extrai, carrega no DW e transforma lá |
| Extrai dados das fontes | Extrai e **carrega primeiro** no DW (dados brutos) |
| Transforma (limpa, normaliza, enriquece) **antes** de carregar | Transforma dentro do próprio DW usando SQL ou ferramentas como dbt |
| Carrega os dados já prontos no DW | Mais moderno, usado em ambientes cloud com grande poder computacional (BigQuery, Snowflake, Redshift) |
| Mais tradicional, usado quando o DW tem capacidade limitada | |

<aside class="positive">

No projeto usaremos a abordagem **ETL com Python + Pandas**.

</aside>

### Modelagem dimensional: tabela fato e dimensões

A tabela **FATO** é o coração do DW. Ela armazena os eventos do negócio (vendas, pedidos, transações) com métricas numéricas e chaves estrangeiras para as dimensões.

As tabelas **DIMENSÃO** descrevem o contexto desses eventos: quem comprou, quando, onde, qual produto.

Exemplo clássico de vendas:

| Tabela | Colunas |
| --- | --- |
| Fato_Vendas | id_venda, valor, quantidade, id_cliente, id_produto, id_tempo, id_loja |
| Dim_Cliente | id_cliente, nome, cidade, segmento |
| Dim_Produto | id_produto, nome, categoria, preço |
| Dim_Tempo | id_tempo, data, mês, trimestre, ano |
| Dim_Loja | id_loja, nome, região |

## Star schema e snowflake schema
Duration: 6:00

### Modelo estrela (star schema)

No star schema, a tabela fato fica no centro conectada diretamente a todas as dimensões. As dimensões são **desnormalizadas** — todos os atributos em uma única tabela, mesmo com alguma redundância.

| Vantagens | Desvantagens |
| --- | --- |
| Queries simples com poucos JOINs | Redundância de dados |
| Melhor performance de leitura | Maior uso de espaço em disco |
| Mais fácil para ferramentas de BI | |

### Modelo floco de neve (snowflake schema)

No snowflake schema, as dimensões são **normalizadas** e se ramificam em subtabelas. Por exemplo, Dim_Produto se conecta a Dim_Categoria, que se conecta a Dim_Subcategoria.

| Vantagens | Desvantagens |
| --- | --- |
| Menor redundância de dados | Queries mais complexas com mais JOINs |
| Mais integridade referencial | Menor performance de leitura |

<aside class="positive">

**No projeto:** começamos com snowflake e depois migramos para star — para sentir a diferença na prática!

</aside>

## As etapas do projeto
Duration: 4:00

| Etapa | O que é feito |
| --- | --- |
| 1. Obtenção da base no Kaggle | Download de dataset real via API |
| 2. Construção do DER | Diagrama Entidade-Relacionamento com fato e dimensões |
| 3. Implementação snowflake | Modelo normalizado no PostgreSQL |
| 4. Carga dos dados brutos | Python e Pandas para importação |
| 5. Pré-processamento | Normalização, padronização, nulos, one-hot encoding |
| 6. Armazenamento no DW | Inserção dos dados tratados |
| 7. Queries SQL snowflake | Insights com muitos JOINs |
| 8. Migração para star | Desnormalização das dimensões |
| 9. Queries SQL star | Mesmas queries com menos JOINs |
| 10. Dashboards Power BI | Visualização e relatórios finais |

## Etapa 1: dados do Kaggle
Duration: 8:00

O Kaggle é uma plataforma com milhares de datasets reais e gratuitos. Usaremos a API do Kaggle para baixar a base diretamente via Python.

O dataset escolhido será de um contexto de negócio real com múltiplas entidades, como vendas de e-commerce, dados hospitalares ou logística — garantindo riqueza para modelagem dimensional.

**Terminal**

```bash
# Instalação da API do Kaggle
pip install kaggle

# Download do dataset
kaggle datasets download -d nome-do-dataset
```

**Python**

```python
# Descompactação
import zipfile
with zipfile.ZipFile('dataset.zip', 'r') as zip_ref:
    zip_ref.extractall('data/')
```

## Etapas 2 e 3: DER e PostgreSQL
Duration: 10:00

Vamos modelar o Diagrama Entidade-Relacionamento identificando:

* **Entidade central (fato)** — a tabela que registra os eventos do negócio.
* **Entidades de contexto (dimensões)** — as tabelas que descrevem os atributos dos eventos.
* **Relacionamentos e chaves** — chaves primárias e estrangeiras que conectam as tabelas.

Em seguida, implementamos o modelo no PostgreSQL com scripts SQL completos de criação de tabelas, constraints e índices.

**PostgreSQL · exemplo**

```sql
CREATE TABLE dim_cliente (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    cidade VARCHAR(50),
    segmento VARCHAR(30)
);

CREATE TABLE fato_vendas (
    id_venda SERIAL PRIMARY KEY,
    valor DECIMAL(10,2),
    quantidade INTEGER,
    id_cliente INTEGER REFERENCES dim_cliente(id_cliente),
    id_produto INTEGER REFERENCES dim_produto(id_produto),
    id_tempo INTEGER REFERENCES dim_tempo(id_tempo)
);
```

<aside class="negative">

O trecho é um exemplo: `fato_vendas` referencia `dim_produto` e `dim_tempo`, que precisam ser criadas antes dela no seu modelo.

</aside>

## Etapas 4 e 5: Python e pré-processamento
Duration: 10:00

Com Pandas, vamos realizar todas as transformações necessárias antes de carregar os dados no banco:

* **Carregar CSV/JSON** — importação do Kaggle
* **Tratar nulos** — remoção ou imputação
* **Normalizar** — variáveis numéricas
* **One-Hot Encoding** — variáveis categóricas
* **Padronizar** — datas e strings

Todo esse processo ocorre em memória antes de tocar o banco de dados.

**Python · exemplo de pré-processamento**

```python
import pandas as pd
from sklearn.preprocessing import StandardScaler

# Carregar dados
df = pd.read_csv('vendas.csv')

# Tratar nulos
df['valor'].fillna(df['valor'].mean(), inplace=True)

# Normalização
scaler = StandardScaler()
df['valor_norm'] = scaler.fit_transform(df[['valor']])

# One-Hot Encoding
df = pd.get_dummies(df, columns=['categoria'])
```

## Etapas 6 e 7: carga no DW e queries SQL
Duration: 10:00

### Carga no PostgreSQL

Após o pré-processamento, inserimos os dados no PostgreSQL usando SQLAlchemy ou psycopg2.

**Python · carga com SQLAlchemy**

```python
from sqlalchemy import create_engine

engine = create_engine(
    'postgresql://user:pass@localhost/dw'
)

df.to_sql(
    'fato_vendas',
    engine,
    if_exists='append',
    index=False
)
```

### Queries SQL analíticas

Com o DW populado no modelo snowflake, escrevemos queries SQL para gerar insights de negócio — explorando JOINs entre fato e múltiplas dimensões normalizadas. Exemplo: ranking de produtos por receita por trimestre por região.

**PostgreSQL**

```sql
SELECT
    p.nome_produto,
    t.trimestre,
    l.regiao,
    SUM(f.valor) as receita_total
FROM fato_vendas f
JOIN dim_produto p ON f.id_produto = p.id_produto
JOIN dim_tempo t ON f.id_tempo = t.id_tempo
JOIN dim_loja l ON f.id_loja = l.id_loja
GROUP BY p.nome_produto, t.trimestre, l.regiao
ORDER BY receita_total DESC;
```

## Etapas 8 e 9: migração para star e comparação
Duration: 8:00

Desnormalizamos as tabelas dimensão, consolidando subtabelas em dimensões únicas e mais largas.

* **Desnormalização** — consolidamos Dim_Produto + Dim_Categoria + Dim_Subcategoria em uma única Dim_Produto expandida.
* **Reescrita de queries** — mesmas análises agora com menos JOINs e código SQL mais simples.
* **Comparação de performance** — medimos tempo de execução, complexidade e facilidade de manutenção.

Esta etapa é fundamental para entender o *trade-off* entre os dois modelos.

**Query snowflake (5 JOINs) · trecho**

```sql
SELECT p.nome, c.categoria, sc.subcategoria
FROM fato_vendas f
JOIN dim_produto p ON f.id_produto = p.id_produto
JOIN dim_categoria c ON p.id_categoria = c.id_categoria
JOIN dim_subcategoria sc ON c.id_subcat = sc.id_subcat
...
```

**Query star (2 JOINs) · trecho**

```sql
SELECT p.nome, p.categoria, p.subcategoria
FROM fato_vendas f
JOIN dim_produto p ON f.id_produto = p.id_produto
...
```

## Etapa 10: Power BI
Duration: 5:00

Conectamos o Power BI diretamente ao PostgreSQL e criamos visualizações profissionais para comunicar os insights:

* **Dashboards com KPIs principais** — métricas de negócio em destaque
* **Gráficos de evolução temporal** — tendências ao longo do tempo
* **Rankings e comparativos** — análise por dimensão
* **Filtros interativos (slicers)** — exploração dinâmica dos dados

## Bora começar!
Duration: 3:00

> "Sem dados, você é apenas mais uma pessoa com uma opinião."
>
> — W. Edwards Deming

Este projeto vai te transformar em alguém que trabalha com dados de verdade.

* **Mãos à obra** — prepare seu ambiente de desenvolvimento e vamos começar a construir!
* **Aprendizado prático** — cada etapa será uma experiência real de mercado.
* **Portfólio profissional** — ao final, você terá um projeto completo para mostrar.

Para ver na prática a construção de um DW, com star schema, camadas e consultas analíticas no PostgreSQL, faça o codelab **Data Warehouse com PostgreSQL: star schema passo a passo**.
