summary: Revisão de modelagem entidade-relacionamento com identificação de relacionamentos, generalização/especialização (total, parcial, exclusiva, compartilhada e em múltiplos níveis) e entidades associativas.
id: pg-modelagem-er-generalizacao-associativa
categories: Bancos de Dados
tags: modelagem,entidade-relacionamento,der,generalizacao,especializacao,entidade-associativa
status: Published
authors: Rodrigo Bossini
last updated: 2022-02-14
pdf: postgresql/03_apostila_pbd_revisao_modelagem_er_id_relacionamento_genesp_associativa.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Modelagem ER: identificação de relacionamentos, generalização e entidade associativa

## Visão geral
Duration: 3:00

Este material mostra uma breve revisão sobre os principais conceitos da modelagem de dados baseada na abordagem entidade-relacionamento, completando a revisão iniciada com entidades, relacionamentos, cardinalidades, atributos e identificadores.

### O que você vai aprender

* Quando um relacionamento precisa de um atributo identificador
* O princípio da minimalidade na escolha de identificadores
* O que é generalização/especialização e como ela se parece com a herança da orientação a objetos
* A diferença entre generalização/especialização total e parcial, exclusiva e compartilhada
* Como montar hierarquias de múltiplos níveis, inclusive com herança múltipla
* O que é uma entidade associativa e quando usá-la

### O que você vai precisar

* Conhecer entidades, relacionamentos, cardinalidades, atributos e identificadores
* Papel e lápis (ou uma ferramenta de desenho de diagramas) para os exercícios

## Identificação de relacionamentos
Duration: 6:00

Ocorrências de relacionamentos também devem ser diferenciadas umas das demais. Muitas vezes, isso se dá por meio das ocorrências de entidades envolvidas no relacionamento. Entretanto, há casos em que as ocorrências de entidades não são suficientes para essa diferenciação. Exemplos clássicos no mundo real são aqueles que envolvem datas, períodos etc. Veja a figura a seguir. Ela mostra o relacionamento "consulta" entre médico e paciente.

![Médico (N) e Paciente (N) ligados pelo relacionamento consulta](img/p001-1.webp)

*Figura 2.1: relacionamento consulta entre médico e paciente.*

Obviamente, uma pessoa pode ser atendida pelo mesmo médico diversas vezes. Assim, utilizar seu CPF em conjunto com o CRM do médico para diferenciar uma ocorrência de consulta das demais não é suficiente. Neste caso, é natural utilizar a data/hora da consulta, como ilustra a figura a seguir.

![O relacionamento consulta entre Médico e Paciente com o atributo identificador data/hora, representado por um círculo preenchido](img/p001-2.webp)

*Figura 2.2: a data/hora identifica cada consulta.*

### Exercícios

Identifique um relacionamento entre entidades do mundo real que demande um atributo identificador e faça seu DER.

<aside class="positive">

**Nota.** Um princípio a se considerar quando da escolha de atributos identificadores é o **princípio da minimalidade**, segundo o qual o número de atributos utilizado para identificar uma ocorrência, seja de entidade ou de relacionamento, deve ser o menor possível.

</aside>

## Generalização/especialização
Duration: 6:00

Também é possível atribuir propriedades a entidades por meio da **generalização/especialização**. A ideia é simples: descrevemos uma entidade A mais genérica cujos atributos são comuns a outra entidade B, esta mais específica. Ao especificarmos que B é especialização de A, B passa a ter, também, os atributos de A. Trata-se de um conceito semelhante àquele denominado **herança** da orientação a objetos. A figura a seguir mostra um exemplo, no qual:

* Cliente é generalização de Pessoa Física e de Pessoa Jurídica.
* Pessoa Física e Pessoa Jurídica são especializações de Cliente.
* Tanto Pessoa Física quanto Pessoa Jurídica possuem os atributos nome e código, muito embora eles não sejam apresentados explicitamente.

![Cliente, com os atributos nome e código, é generalização de Pessoa Física (cpf, sexo) e de Pessoa Jurídica (CNPJ, tipo de organização), ligadas por um triângulo](img/p002-1.webp)

*Figura 2.3: generalização/especialização de Cliente em Pessoa Física e Pessoa Jurídica.*

## Total ou parcial
Duration: 5:00

Uma pergunta natural é a seguinte: é verdade que toda ocorrência da entidade mais geral está associada a pelo menos uma ocorrência de alguma entidade mais específica? Para responder a essa pergunta, classificamos uma generalização/especialização como **parcial** ou **total**. Ela é parcial quando há instâncias da entidade mais geral não associadas a quaisquer instâncias de entidades mais específicas. E é total quando isso não acontece. A figura a seguir mostra um exemplo de generalização/especialização total.

![Cliente especializado em Pessoa Física e Pessoa Jurídica com a marcação t: toda ocorrência de Cliente é Pessoa Física ou Pessoa Jurídica](img/p003-1.webp)

*Figura 2.4: generalização/especialização total (t): toda ocorrência de Cliente é Pessoa Física ou Pessoa Jurídica.*

A figura a seguir mostra um exemplo de generalização/especialização parcial.

![Funcionário especializado em Motorista e Secretária com a marcação p: podem existir funcionários que não são nem motoristas nem secretárias](img/p003-2.webp)

*Figura 2.5: generalização/especialização parcial (p): podem existir funcionários que não são nem motoristas nem secretárias.*

## Exclusiva ou compartilhada
Duration: 6:00

Numa generalização/especialização **exclusiva**, a seguinte propriedade é verdadeira: dada uma ocorrência da entidade mais geral, ela é especializada somente uma vez. Quando a generalização/especialização é **compartilhada**, por outro lado, é possível que uma ocorrência da entidade mais geral seja especializada por mais de uma entidade na hierarquia. A figura a seguir mostra um exemplo de generalização/especialização compartilhada.

![Pessoa especializada em Professor, Funcionário e Aluno com a marcação c: uma pessoa pode ser professor e funcionário ao mesmo tempo, por exemplo](img/p004-1.webp)

*Figura 2.6: generalização/especialização compartilhada (c): uma pessoa pode ser professor e funcionário ao mesmo tempo, por exemplo.*

A figura a seguir mostra um exemplo de generalização/especialização exclusiva.

![Funcionário especializado em Motorista e Secretária com a marcação x: um funcionário é motorista ou secretária, nunca ambos](img/p004-2.webp)

*Figura 2.7: generalização/especialização exclusiva (x): um funcionário é motorista ou secretária, nunca ambos.*

A tabela a seguir mostra as quatro possíveis combinações.

| | Total (t) | Parcial (p) |
| --- | --- | --- |
| **Exclusiva (x)** | xt | xp |
| **Compartilhada (c)** | ct | cp |

*Tabela 2.1: combinações de generalização/especialização.*

### Exercícios

Identifique no mundo real algo que possa ser modelado como uma hierarquia de generalização/especialização do tipo **cp** e faça seu DER.

Identifique no mundo real algo que possa ser modelado como uma hierarquia de generalização/especialização do tipo **xt** e faça seu DER.

## Hierarquias de múltiplos níveis
Duration: 6:00

Uma hierarquia de generalização/especialização pode ter múltiplos níveis, como mostra a figura a seguir. Ela também ilustra um conceito semelhante àquele conhecido por **herança múltipla**, que é caracterizado quando uma entidade especializa duas entidades simultaneamente.

![Veículo especializado em Veículo Terrestre e Veículo Aquático; Veículo Terrestre em Automóvel e Tanque Anfíbio; Veículo Aquático em Tanque Anfíbio e Veículo Anfíbio. Tanque Anfíbio, com duas generalizações, destaca a herança múltipla](img/p005-1.webp)

*Figura 2.8: hierarquia de múltiplos níveis com herança múltipla (Tanque Anfíbio).*

### Exercícios

Construa um DER que retrate algo que pode ser observado no mundo real utilizando uma hierarquia de generalização/especialização com três níveis e que utilize a herança múltipla.

## Entidade associativa
Duration: 8:00

Lembre-se que um relacionamento é uma associação entre entidades. Não existe a possibilidade de estabelecer relacionamentos entre relacionamentos e entidades ou entre dois ou mais relacionamentos. O recurso denominado **entidade associativa** costuma ser empregado quando a realidade modelada parece demandar esse tipo de relacionamento.

Considere a figura a seguir.

![Médico (N) e Paciente (N) ligados pelo relacionamento consulta](img/p006-1.webp)

*Figura 2.9: o relacionamento consulta.*

Suponha que desejamos incluir uma nova entidade à realidade modelada: medicamento. Medicamentos possuem diversos atributos. Um medicamento pode estar associado a múltiplas consultas. Uma consulta pode ter a ela associados múltiplos medicamentos. É tentador resolver esse problema como a figura a seguir sugere. Entretanto, esse tipo de construção não está previsto na modelagem ER. Utilizá-lo é semelhante a tentar utilizar a palavra **se** no lugar da palavra reservada **if** em linguagens de programação como Java, por exemplo. Está errado, pois sequer faz parte da especificação.

![O relacionamento consulta ligado diretamente, por um relacionamento prescrição, à entidade Medicamento, destacado como Errado!!](img/p006-2.webp)

*Figura 2.10: construção inválida: relacionamento entre um relacionamento e uma entidade.*

Para resolver esse problema, podemos fazer uma espécie de redefinição do relacionamento consulta, fazendo com que ele passe a ser tratado como entidade também. Graficamente, isso é feito como mostra a figura a seguir.

![O losango consulta envolvido por um retângulo, indicando entidade associativa, ligado a Medicamento pelo relacionamento prescrição](img/p007-1.webp)

*Figura 2.11: consulta como entidade associativa.*

A realidade em questão pode também ser modelada sem o uso de uma entidade associativa: o relacionamento consulta pode ser uma entidade de fato. Veja a figura a seguir.

![Consulta como entidade, ligada a Médico (1,1), a Paciente (1,1) e, por um relacionamento N para N, a Medicamento](img/p008-1.webp)

*Figura 2.12: consulta modelada como entidade.*

## Exercícios finais e encerramento
Duration: 25:00

### Exercício 1

Faça um DER condizente com as seguintes restrições.

> Uma farmácia comercializa diversos produtos, os quais podem ser de dois tipos: medicamentos ou cosméticos. Uma venda pode envolver múltiplos produtos, de quaisquer tipos. Vendas de medicamentos, entretanto, podem demandar a apresentação de uma receita médica. Cada produto tem um único fabricante. Os produtos de um fabricante podem ser distribuídos por múltiplos fornecedores.

Dê bastante atenção à construção envolvendo as entidades e relacionamentos. Escolha alguns atributos para cada entidade que lhe pareçam apropriados.

### Exercício 2

Faça um DER condizente com as seguintes restrições.

> Uma empresa tem três tipos de empregados: gerente, secretária e engenheiro. Cada empregado pertence a um único departamento. Um gerente é responsável por múltiplos empregados, inclusive potencialmente outros gerentes. Uma secretária tem domínio sobre diversos aplicativos que utiliza no dia a dia. Engenheiros participam de diversos projetos ao longo de sua carreira.

Dê bastante atenção à construção envolvendo as entidades e relacionamentos. Escolha alguns atributos para cada entidade que lhe pareçam apropriados.

### Parabéns!

Você concluiu a revisão da abordagem entidade-relacionamento. O próximo passo é o modelo relacional, que leva esses conceitos para tabelas.

### Bibliografia

* HEUSER, Carlos Alberto. **Projeto de Banco de Dados**. 6ª ed. Bookman, 2008.
