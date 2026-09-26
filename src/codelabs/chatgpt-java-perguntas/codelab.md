summary: Crie um projeto Java com Maven no VS Code que conversa com a API do ChatGPT para gerar perguntas de alternativas, usando Apache Commons Configuration, Lombok, GSON e OkHttp.
id: chatgpt-java-perguntas
categories: IA,Java
tags: chatgpt,openai,java,maven,vs code,lombok,gson,okhttp,json,commons configuration
status: Published
authors: Rodrigo Bossini
last updated: 2023-08-21
pdf: chatgpt/01_apostila_chatgpt_java_perguntas_respostas.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# ChatGPT com Java: gerando perguntas

## Visão geral
Duration: 4:00

Neste material, desenvolveremos uma aplicação Java capaz de conversar com o **ChatGPT** por meio de sua API. A intenção é que ela

* permita que o usuário informe um assunto sobre o qual deseja que uma pergunta de alternativas seja formulada
* solicite a correção de uma pergunta de alternativas

### O que você vai aprender

* Como elaborar prompts cada vez mais precisos
* Como criar um projeto Maven no VS Code
* Como guardar a chave de API em um `config.properties` e lê-la com a Apache Commons Configuration
* O que é a notação JSON e qual o formato da API de completions
* Como descrever requisição e resposta com classes Java, Lombok e GSON
* Como fazer requisições HTTP com a biblioteca OkHttp e autenticação Bearer

### O que você vai precisar

* JDK instalado (a apostila usa o Java 17)
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

Para fechar, peça que ele tente resolver a questão a seguir (Código 1.1).

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
          JOptionPane.showMessageDialog(null, "Agora você terá direito a mais "+ op + " pedidos");
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

## Projeto Maven no VS Code
Duration: 12:00

Comece criando uma pasta para abrir os seus projetos. Usuários do Windows podem desejar algo como

```text
C:\Users\usuario\Documents\dev\
```

Em sistemas Unix like, use

```text
/home/usuario/dev/
```

Vamos utilizar o VS Code para criar um projeto Java. Ele terá algumas bibliotecas externas que serão declaradas como suas dependências. Utilizaremos o **Maven** para resolvê-las. Por isso, abra o VS Code e comece instalando a extensão **Extension Pack for Java**, como mostra a figura a seguir. Observe que essa extensão é um pacote que já inclui diversas outras, entre elas aquela que necessitamos para criar projetos Maven (Maven for Java).

![Aba de extensões do VS Code com a busca "java" e o Extension Pack for Java em destaque](img/p005-1.webp)

*Figura 2.2.1: a extensão Extension Pack for Java.*

Agora, no VS Code, aperte **CTRL + SHIFT + P**. A seguir, busque por Maven e escolha a opção **Maven: Create Maven Project**.

![Paleta de comandos do VS Code com a busca "maven" e a opção Maven: Create Maven Project em destaque](img/p006-1.webp)

*Figura 2.2.2: Maven: Create Maven Project.*

Na tela a seguir, escolha a opção **maven-archetype-quickstart**.

![Lista "Create Maven Project" de archetypes com maven-archetype-quickstart (org.apache.maven.archetypes) em destaque](img/p006-2.webp)

*Figura 2.2.3: o archetype maven-archetype-quickstart.*

Na tela seguinte, escolha a versão mais atual do modelo. No momento em que esse documento foi escrito, a versão mais atual era a 1.4. Você pode tentar escolher uma mais nova, se disponível. Se perceber muitas diferenças, opte pela versão que utilizamos aqui para continuar até o final 🙂

![Lista de versões do maven-archetype-quickstart com a 1.4 em destaque](img/p007-1.webp)

*Figura 2.2.4: versão 1.4 do archetype.*

Agora, escolha um **group Id** para o seu projeto. Geralmente, colocamos um domínio inverso (www.whatever.com.br vira br.com.whatever). É uma prática de mercado. No projeto, esse será o nome do pacote principal da aplicação.

![Campo "Input group Id of your project" preenchido com br.bossini.pdf](img/p007-2.webp)

*Figura 2.2.5: o group Id.*

Depois, escolha o **artifact Id** de seu projeto. São detalhes do Maven que não nos importam neste momento. Use algo como a figura a seguir mostra.

![Campo "Input artifact Id of your project" preenchido com chatgpt-java-questoes](img/p007-3.webp)

*Figura 2.2.6: o artifact Id.*

A seguir, encontre a pasta que você havia criado anteriormente e confirme.

<aside class="positive">

**Nota.** A sua tela pode ser um pouco diferente pois o screenshot exibido foi produzido num ambiente Linux.

</aside>

![Janela de seleção de pasta com a pasta dev escolhida e o botão Select Destination Folder em destaque](img/p008-1.webp)

*Figura 2.2.7: escolha a pasta de destino.*

No próximo passo, no terminal interno do VS Code, você precisará escolher uma **version**. Basta apertar Enter para confirmar o valor padrão.

![Terminal do VS Code com a saída do maven-archetype-plugin, groupId br.bossini.pdf, artifactId chatgpt-java-questoes e a pergunta "Define value for property 'version' 1.0-SNAPSHOT"](img/p008-2.webp)

*Figura 2.2.8: confirme a version padrão com Enter.*

Faça o mesmo (aperte Enter) para todas as demais opções que surgirem, mantendo seu valor padrão.

Observe que o VS Code deverá exibir uma janela com a opção **Open**. Clique nela.

![Notificação "Maven project chatgpt-java-pdf is created under: /home/rodrigo/workspaces/producao_de_aulas/java/dev" com o botão Open em destaque](img/p009-1.webp)

*Figura 2.2.9: clique em Open.*

Depois disso, uma nova instância do VS Code será aberta. Você já pode fechar a anterior, utilizada apenas para criar o projeto. Veja o resultado esperado.

![Explorer do VS Code com o projeto CHATGPT-JAVA-PDF contendo a pasta src e o arquivo pom.xml](img/p009-2.webp)

*Figura 2.2.10: o projeto Maven criado.*

## Chave de acesso e config.properties
Duration: 12:00

O acesso ao ChatGPT por meio de sua API é pago. Entretanto, na época em que a apostila foi escrita, novos usuários podiam fazer seus testes utilizando cinco dólares de crédito pelos primeiros três meses, na versão TRIAL.

Para obter uma chave de API, basta fazer login no sítio do ChatGPT por meio do link [https://platform.openai.com/](https://platform.openai.com/). A seguir, clique no seu avatar no canto superior direito e escolha **View API Keys**.

![Menu do avatar Personal aberto, com a opção View API keys em destaque](img/p010-1.webp)

*Figura 2.3.1: escolha View API keys.*

<aside class="positive">

**Nota.** Caso deseje visualizar seu consumo e a data de expiração de seu período trial, visite [https://platform.openai.com/account/usage](https://platform.openai.com/account/usage).

</aside>

Na parte central da tela, você deverá ver um botão **Create new secret key**.

![Página API keys com a lista de chaves existentes e o botão Create new secret key em destaque](img/p011-1.webp)

*Figura 2.3.2: o botão Create new secret key.*

Clique nele e invente um nome para a sua chave. A seguir, basta copiá-la e clicar **Done**.

![Janela Create new secret key exibindo a chave gerada (parcialmente oculta), o botão de copiar e o botão Done em destaque](img/p011-2.webp)

*Figura 2.3.3: copie a chave e clique em Done.*

<aside class="negative">

**Nota.** Você precisa copiar a chave agora. Depois de fechar a janela não será mais possível visualizá-la. Se isso acontecer, você poderá criar outra.

</aside>

Evidentemente, nosso programa fará uso da chave. Porém, é fundamental que ela não fique escrita explicitamente junto com o código. Isso por, pelo menos, duas razões:

* o controle de versão pode ser feito em repositórios públicos
* a chave a ser utilizada varia em função do ambiente (desenvolvimento, homologação, produção etc.). Por isso, ela é chamada "variável de ambiente" e desejamos uma maneira simples de fazer a troca de chave conforme o ambiente muda.

Diferentes ambientes utilizam diferentes mecanismos para isso. Em Java, vamos criar um arquivo chamado `config.properties`. Observe que ele deve ser criado na pasta `src/main/resources`.

![Explorer do VS Code com src/main/resources/config.properties em destaque](img/p012-1.webp)

*Figura 2.3.4: o arquivo config.properties em src/main/resources.*

Veja seu conteúdo.

**Código 2.3.1 · src/main/resources/config.properties**

```ini
OPENAI_API_KEY=coloque a sua chave aqui
```

A fim de manipularmos o conteúdo do arquivo de configurações, vamos utilizar a biblioteca **Apache Commons Configuration**. Ela, por sua vez, depende da biblioteca **Commons BeanUtils**. Para adicioná-las ao projeto, vamos utilizar o arquivo `pom.xml`.

**Código 2.3.2 · pom.xml**

```xml
...
  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
    <!-- https://mvnrepository.com/artifact/org.apache.commons/commons-configuration2 -->
    <dependency>
      <groupId>org.apache.commons</groupId>
      <artifactId>commons-configuration2</artifactId>
      <version>2.9.0</version>
    </dependency>

    <!-- https://mvnrepository.com/artifact/commons-beanutils/commons-beanutils -->
    <dependency>
      <groupId>commons-beanutils</groupId>
      <artifactId>commons-beanutils</artifactId>
      <version>1.9.4</version>
    </dependency>

  </dependencies>

...
```

Depois disso, você verá as opções exibidas pela figura a seguir. Clique em uma das opções destacadas. Isso fará com que o Maven faça o download das dependências declaradas.

![pom.xml aberto no VS Code com a notificação "A build file was modified. Do you want to synchronize the Java classpath/configuration?", o botão Always e o ícone de sincronização em destaque](img/p014-1.webp)

*Figura 2.3.5: sincronize o classpath para baixar as dependências.*

A seguir, abra o arquivo `App.java` e faça a obtenção do conteúdo do arquivo como mostra o código a seguir.

<aside class="positive">

Os arquivos do projeto ficam no pacote principal (`br.bossini.pdf`, o group Id escolhido), e cada um começa com a declaração `package br.bossini.pdf;`, que o VS Code mantém no topo. Os códigos da apostila a omitem.

</aside>

**Código 2.3.3 · App.java**

```java
import javax.swing.JOptionPane;

import org.apache.commons.configuration2.Configuration;
import org.apache.commons.configuration2.builder.fluent.Configurations;

public class App
{
    public static void main( String[] args )
    {
        try {
            Configurations configurations = new Configurations();
            Configuration config = null;
            config = configurations.properties("config.properties");
            String OPENAI_API_KEY = config.getString("OPENAI_API_KEY");
            JOptionPane.showMessageDialog(null, OPENAI_API_KEY);
        }
        catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(null, "Falha técnica, tente novamente mais tarde");
        }
    }
}
```

Execute a aplicação para obter o resultado exibido pela figura a seguir.

![VS Code com o botão de executar destacado e uma caixa de diálogo "Message" exibindo o texto "sua chave de API deve aparecer aqui"](img/p015-1.webp)

*Figura 2.3.6: a chave lida do config.properties.*

## A notação JSON e a API do ChatGPT
Duration: 8:00

Nosso aplicativo Java conversará com os sistemas da OpenAI e, para tal, será necessário representar os dados a serem enviados e recebidos, de modo que possam se entender. Um dos formatos mais utilizados atualmente é o **JSON**. Veja alguns exemplos de "coisas" do mundo real representadas como objetos JSON (Código 2.4.1).

Uma pessoa se chama Pedro e tem 25 anos:

```json
{
  "nome": "Pedro",
  "idade": 25
}
```

Uma pessoa se chama João, tem 30 anos e mora na Rua 1, número 123:

```json
{
  "nome": "João",
  "idade": 30,
  "endereco": {
    "rua": "Rua 1",
    "numero": 123
  }
}
```

Uma concessionária se chama "Concessionária A" e possui dois veículos. Cada um deles tem nome, ano e valor:

```json
{
  "nome": "Concessionaria A",
  "veiculos": [
    {
      "nome": "Celta",
      "ano": 2010,
      "valor": 10000
    },
    {
      "nome": "Gol",
      "ano": 2012,
      "valor": 15000
    }
  ]
}
```

### A API do ChatGPT

A documentação oficial do ChatGPT mostra o formato esperado: [https://platform.openai.com/docs/api-reference/completions/create](https://platform.openai.com/docs/api-reference/completions/create). A figura a seguir mostra os valores que enviaremos ao ChatGPT.

![Trechos da documentação com os parâmetros model (string, obrigatório), prompt (string ou array, opcional) e max_tokens (inteiro, opcional, padrão 16) em destaque](img/p017-1.webp)

*Figura 2.5.1: os parâmetros model, prompt e max_tokens.*

Assim, precisaremos de um objeto composto por esses três campos.

Por outro lado, a resposta que receberemos do ChatGPT se parece com o exemplo a seguir, extraído da documentação.

**Resposta (Figura 2.5.2)**

```json
{
  "id": "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
  "object": "text_completion",
  "created": 1589478378,
  "model": "text-davinci-003",
  "choices": [
    {
      "text": "\n\nThis is indeed a test",
      "index": 0,
      "logprobs": null,
      "finish_reason": "length"
    }
  ],
  "usage": {
    "prompt_tokens": 5,
    "completion_tokens": 7,
    "total_tokens": 12
  }
}
```

Observe que a resposta possui uma coleção chamada `choices`. Ela possui objetos que representam possíveis respostas do ChatGPT. Cada objeto possui um campo `text`. É neste campo que estamos interessados.

## Classes Java e Lombok
Duration: 12:00

Seguindo o formalismo da orientação a objetos comumente presente em programas escritos em Java, vamos descrever a estrutura de interesse por meio da criação de classes. Começamos explicando como é o corpo de uma requisição esperada pelo ChatGPT. Para tal, crie um arquivo chamado `RequisicaoChatGPT.java` na pasta principal do projeto, lado a lado com o arquivo `App.java`.

**Código 2.6.1 · RequisicaoChatGPT.java**

```java
public class RequisicaoChatGPT {
    private String model;
    private String prompt;
    private int max_tokens;
}
```

A seguir, vamos explicar como é a estrutura de uma resposta produzida pelo ChatGPT, destacando apenas as partes que nos são de interesse. Neste caso, apenas a coleção de "choices". Por isso, primeiro criamos uma classe que revela a estrutura de um Choice num arquivo chamado `Choice.java`.

**Código 2.6.2 · Choice.java**

```java
public class Choice {
    private String text;
}
```

A classe a seguir mostra a estrutura de uma resposta produzida pelo ChatGPT: um objeto que contém uma coleção de "choices" chamada `choices`. Crie um arquivo chamado `RespostaChatGPT.java` para fazer esta nova definição.

**Código 2.6.3 · RespostaChatGPT.java**

```java
import java.util.*;
public class RespostaChatGPT {
    private List<Choice> choices;
}
```

Observe que, seguindo as boas práticas, utilizamos o **encapsulamento**. Assim, para acessar os membros das classes, teremos de usar os famosos métodos de acesso (getters/setters). Eles poderiam ser escritos manualmente ou mesmo gerados automaticamente pelo IDE. Podemos fazer algo ainda mais simples: utilizando a biblioteca **Lombok**, apenas "anotamos" as classes indicando quais membros desejamos que elas possuam, como métodos getters/setters, construtores etc. Para usar a Lombok, vamos especificá-la como dependência no arquivo `pom.xml`.

**Código 2.6.4 · pom.xml**

```xml
...
    <!-- https://mvnrepository.com/artifact/org.apache.commons/commons-configuration2 -->
    <dependency>
      <groupId>org.apache.commons</groupId>
      <artifactId>commons-configuration2</artifactId>
      <version>2.9.0</version>
    </dependency>

    <!-- https://mvnrepository.com/artifact/commons-beanutils/commons-beanutils -->
    <dependency>
      <groupId>commons-beanutils</groupId>
      <artifactId>commons-beanutils</artifactId>
      <version>1.9.4</version>
    </dependency>

    <!-- lombok -->
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <version>1.18.26</version>
      <!-- "fornecido" pelo ambiente de implantação. exemplo: servlets pelo tomcat -->
      <!-- inclusa somente em tempo de compilação -->
      <!-- não usamos compile pois é a padrão e seria incluída em todas as fases -->
      <scope>provided</scope>
    </dependency>

  </dependencies>

...
```

Passamos a fazer as anotações. Veja como fica a classe `RequisicaoChatGPT`.

**Código 2.6.5 · RequisicaoChatGPT.java**

```java
import lombok.*;

//getters
@Getter
//setters
@Setter
//construtor com todos os argumentos
@AllArgsConstructor
//construtor sem argumentos
@NoArgsConstructor
public class RequisicaoChatGPT {
    private String model;
    private String prompt;
    private int max_tokens;
}
```

O código a seguir mostra a classe `Choice`, agora anotada.

**Código 2.6.6 · Choice.java**

```java
import lombok.*;
//getters
@Getter
//setters
@Setter
//construtor com todos os argumentos
@AllArgsConstructor
//construtor sem argumentos
@NoArgsConstructor
public class Choice {
    private String text;
}
```

Veja a classe `RespostaChatGPT`, agora anotada.

**Código 2.6.7 · RespostaChatGPT.java**

```java
import lombok.*;
import java.util.*;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RespostaChatGPT {
    private List <Choice> choices;
}
```

## Convertendo objetos com a GSON
Duration: 10:00

Uma requisição será um objeto Java. E ele precisa ser representado como um objeto JSON para que ela possa ser enviada ao ChatGPT. Veja a correspondência entre a classe Java e o JSON (Figura 2.6.1).

**Classe Java**

```java
public class RequisicaoChatGPT {
    private String model;
    private String prompt;
    private int max_tokens;
}
```

**JSON correspondente**

```json
{
  "model": "text-davinci-003",
  "prompt": "Por que o céu é azul?",
  "max_tokens": 5
}
```

O mesmo acontece para a resposta que receberemos dele. Essa conversão poderia ser feita manualmente. Porém, seria um tanto trabalhoso e repetitivo fazê-lo. Há diferentes bibliotecas capazes de nos auxiliar nesta tarefa. Uma delas se chama **GSON**. Entregamos a ela um objeto Java e ela nos devolve a sua representação JSON. Ela também é capaz de instanciar um objeto Java a partir de uma representação textual em JSON. Para utilizá-la, declare-a como dependência. Estamos no arquivo `pom.xml`.

**Código 2.6.8 · pom.xml**

```xml
...
    <!-- lombok -->
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <version>1.18.26</version>
      <!-- "fornecido" pelo ambiente de implantação. exemplo: servlets pelo tomcat -->
      <!-- inclusa somente em tempo de compilação -->
      <!-- não usamos compile pois é a padrão e seria inclusa em todas as fases -->
      <scope>provided</scope>
    </dependency>

    <!-- https://mvnrepository.com/artifact/com.google.code.gson/gson -->
    <dependency>
      <groupId>com.google.code.gson</groupId>
      <artifactId>gson</artifactId>
      <version>2.10.1</version>
    </dependency>

  </dependencies>

...
```

Para entender o seu funcionamento, crie um arquivo chamado `TesteGSON.java` lado a lado com o arquivo `App.java`. As tarefas que realizaremos serão as seguintes:

* construção de um objeto Java que representa uma requisição a ser enviada ao ChatGPT
* construção de um objeto Gson, capaz de fazer as conversões mencionadas
* conversão do objeto Java para JSON usando o objeto Gson
* exibição do resultado

**Código 2.6.9 · TesteGSON.java**

```java
import com.google.gson.Gson;

public class TesteGSON {
    public static void main(String[] args) {
        //constrói um objeto RequisicaoChatGPT
        RequisicaoChatGPT requisicaoChatGPT = new RequisicaoChatGPT("text-davinci-003", "Qual a capital do Brasil?", 5);
        //constrói um objeto Gson
        Gson gson = new Gson();
        //converte o objeto RequisicaoChatGPT em uma String JSON
        String json = gson.toJson(requisicaoChatGPT);
        //imprime a String JSON
        System.out.println(json);
    }
}
```

Execute o código e obtenha o resultado a seguir no terminal (Figura 2.6.2).

**Terminal (saída)**

```text
{"model":"text-davinci-003","prompt":"Qual a capital do Brasil?","max_tokens":5}
```

Sem os comentários, a classe fica assim:

**TesteGSON.java**

```java
import com.google.gson.Gson;

public class TesteGSON {
    public static void main(String[] args) {
        RequisicaoChatGPT requisicaoChatGPT = new RequisicaoChatGPT("text-davinci-003", "Qual a capital do Brasil?", 5);
        Gson gson = new Gson();
        String json = gson.toJson(requisicaoChatGPT);
        System.out.println(json);
    }
}
```

## Requisições HTTP com a OkHttp
Duration: 15:00

Agora estamos prontos para escrever uma classe que representa um cliente HTTP capaz de conversar com o ChatGPT. Podemos fazer requisições HTTP em Java de diferentes formas. Veja alguns exemplos:

* Classe HttpURLConnection (API oficial, desde o JDK 1.1): [documentação](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/net/HttpURLConnection.html)
* Classe java.net.http.HttpClient (API oficial, desde o JDK 11): [documentação](https://docs.oracle.com/en/java/javase/11/docs/api/java.net.http/java/net/http/HttpClient.html)
* Apache HttpClient: [https://hc.apache.org/httpcomponents-client-5.2.x/](https://hc.apache.org/httpcomponents-client-5.2.x/)
* OkHttp: [https://square.github.io/okhttp/](https://square.github.io/okhttp/)
* Retrofit: [https://square.github.io/retrofit/](https://square.github.io/retrofit/)

Neste material, escolhemos a biblioteca **OkHttp**. O primeiro passo para utilizá-la é instruir o Maven a fazer o seu download. Para tal, editamos o arquivo `pom.xml`.

**Código 2.7.1 · pom.xml**

```xml
...
    <!-- https://mvnrepository.com/artifact/com.google.code.gson/gson -->
    <dependency>
      <groupId>com.google.code.gson</groupId>
      <artifactId>gson</artifactId>
      <version>2.10.1</version>
    </dependency>

    <!-- https://mvnrepository.com/artifact/com.squareup.okhttp3/okhttp -->
    <dependency>
      <groupId>com.squareup.okhttp3</groupId>
      <artifactId>okhttp</artifactId>
      <version>4.11.0</version>
    </dependency>

  </dependencies>
...
```

Passamos a escrever uma classe que representa um cliente HTTP capaz de se comunicar com o ChatGPT. Primeiro, crie um arquivo chamado `ChatGPTClient.java` no pacote principal da aplicação.

Começamos escrevendo um método capaz de solicitar ao ChatGPT que crie uma questão. Ele tem as seguintes características:

* Recebe a chave de API, assunto, tipo, dificuldade e uma pergunta de exemplo como parâmetros.
* Devolve uma string (a pergunta gerada pelo ChatGPT).
* Por operar em ambiente de IO, "avisa" que pode causar uma exceção.

**Código 2.7.2 · ChatGPTClient.java**

```java
public class ChatGPTClient {
    public String criarPergunta(
        String OPENAI_API_KEY,
        String assunto,
        String tipo,
        String dificuldade,
        String perguntaExemplo) throws Exception {

    }
}
```

O método começa montando o prompt em função dos parâmetros.

**Código 2.7.3 · ChatGPTClient.java**

```java
public class ChatGPTClient {
    public String criarPergunta(
        String OPENAI_API_KEY,
        String assunto,
        String tipo,
        String dificuldade,
        String perguntaExemplo) throws Exception {

        String prompt = "Elabore uma questão sobre %s, do tipo %s com 4 alternativas, de dificuldade %s.".formatted(assunto,
            tipo, dificuldade);
        prompt += perguntaExemplo == null ? "" : String.format("Use a seguinte questão de exemplo: %s", perguntaExemplo);
    }
}
```

A seguir, desempenhamos as seguintes tarefas.

* Construímos um objeto Java que representa o corpo de uma requisição a ser enviada ao ChatGPT, contendo model, prompt e max_tokens.
* Construímos um objeto GSON que será utilizado para produzir a representação JSON do objeto Java.
* Construímos o corpo de uma requisição segundo as abstrações da OkHttp.

**Código 2.7.4 · ChatGPTClient.java**

```java
import com.google.gson.Gson;

import okhttp3.MediaType;
import okhttp3.RequestBody;

public class ChatGPTClient {
    public String criarPergunta(
        String OPENAI_API_KEY,
        String assunto,
        String tipo,
        String dificuldade,
        String perguntaExemplo) throws Exception {

        String prompt = "Elabore uma questão sobre %s, do tipo %s com 4 alternativas, de dificuldade %s.".formatted(assunto,
            tipo, dificuldade);
        prompt += perguntaExemplo == null ? "" : String.format("Use a seguinte questão de exemplo: %s", perguntaExemplo);

        RequisicaoChatGPT requisicao = new RequisicaoChatGPT("text-davinci-003", prompt, 100);
        Gson gson = new Gson();
        RequestBody requestBody = RequestBody.create(gson.toJson(requisicao), MediaType.parse("application/json"));

    }
}
```

Depois disso, realizamos as seguintes tarefas

* Construímos um objeto da OkHttp que representa o cliente HTTP capaz de enviar uma requisição.
* Construímos um objeto que representa uma requisição HTTP segundo as abstrações da OkHttp. Em particular, ele inclui a URL, cabeçalhos (incluindo a chave de API), o tipo da requisição (post) e, no corpo, o JSON que o ChatGPT espera.

<aside class="positive">

**Nota.** Utilizamos um mecanismo de autenticação denominado **Bearer**. Bearer significa algo como "detentor". Indicamos que o detentor da chave de API enviada tem direito de realizar as operações associadas a ela no servidor. Isso é necessário pois diferentes servidores podem fazer uso de diferentes mecanismos de autenticação. Quando concatenamos a palavra Bearer, estamos indicando explicitamente o mecanismo a ser utilizado. Outros mecanismos possíveis são

* **Basic**: geralmente os dados de autenticação são codificados como Base64 e podem facilmente ser decodificados. Base64 não é criptografia.
* **Digest**: semelhante à Basic, mas as credenciais não são enviadas de cliente a servidor. No lugar delas, envia-se um código hash a partir do qual as credenciais não podem ser obtidas.
* **JWT**: o servidor produz um token (sequência de caracteres) utilizando uma senha que somente ele conhece e entrega ao cliente. A partir daí, o cliente armazena o token e, a cada requisição, o envia ao servidor, que tem meios de verificar se o token é válido, se ainda está no período válido de uso etc.

</aside>

**Código 2.7.5 · ChatGPTClient.java**

```java
import com.google.gson.Gson;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;

public class ChatGPTClient {
    public String criarPergunta(
        String OPENAI_API_KEY,
        String assunto,
        String tipo,
        String dificuldade,
        String perguntaExemplo) throws Exception {

        String prompt = "Elabore uma questão sobre %s, do tipo %s com 4 alternativas, de dificuldade %s.".formatted(assunto,
            tipo, dificuldade);
        prompt += perguntaExemplo == null ? "" : String.format("Use a seguinte questão de exemplo: %s", perguntaExemplo);

        RequisicaoChatGPT requisicao = new RequisicaoChatGPT("text-davinci-003", prompt, 100);
        Gson gson = new Gson();
        RequestBody requestBody = RequestBody.create(gson.toJson(requisicao), MediaType.parse("application/json"));

        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
            .url("https://api.openai.com/v1/completions")
            .addHeader("Content-Type", "application/json")
            .addHeader("Authorization", "Bearer " + OPENAI_API_KEY)
            .post(requestBody)
            .build();

    }
}
```

## Tratando a resposta e testando
Duration: 10:00

Agora, podemos fazer a requisição e tratar a resposta:

* Disparamos a requisição utilizando o cliente da OkHttp.
* A resposta é representada por um objeto `Response`, também da OkHttp.
* Utilizamos a GSON para converter o corpo da resposta que o ChatGPT nos entregou (que é um JSON) para um objeto Java `RespostaChatGPT`.
* Acessamos a propriedade de interesse que representa o completion e a devolvemos.

**Código 2.7.6 · ChatGPTClient.java**

```java
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ChatGPTClient {
    public String criarPergunta(
        String OPENAI_API_KEY,
        String assunto,
        String tipo,
        String dificuldade,
        String perguntaExemplo) throws Exception {
        // ...
        Request request = new Request.Builder()
            .url("https://api.openai.com/v1/completions")
            .addHeader("Content-Type", "application/json")
            .addHeader("Authorization", "Bearer " + OPENAI_API_KEY)
            .post(requestBody)
            .build();

        Response response = client.newCall(request).execute();
        RespostaChatGPT resposta = gson.fromJson(response.body().string(), RespostaChatGPT.class);
        String completion = resposta.getChoices().get(0).getText().trim();
        return completion;

    }
}
```

Agora podemos testar a aplicação. Estamos no arquivo `App.java`.

**Código 2.7.7 · App.java**

```java
// ...
    public static void main( String[] args ){
        try {
            Configurations configurations = new Configurations();
            Configuration config = null;
            config = configurations.properties("config.properties");
            String OPENAI_API_KEY = config.getString("OPENAI_API_KEY");
            String assunto = "Java";
            String dificuldade = "Fácil";
            String tipo = "alternativa";
            ChatGPTClient client = new ChatGPTClient();
            String perguntaCriada = client.criarPergunta(OPENAI_API_KEY, assunto, tipo, dificuldade, tipo);
            JOptionPane.showMessageDialog(null, perguntaCriada);
        }
        catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(null, "Falha técnica, tente novamente mais tarde");
        }
    }
// ...
```

<aside class="positive">

O último argumento de `criarPergunta` é a pergunta de exemplo. No teste da apostila, ele recebe a variável `tipo`; para gerar a pergunta sem exemplo, passe `null`.

</aside>

<aside class="negative">

O endpoint `https://api.openai.com/v1/completions` e o modelo `text-davinci-003` eram os disponíveis quando a apostila foi escrita (2023). O modelo foi descontinuado pela OpenAI; hoje a API equivalente é a de chat (`/v1/chat/completions`), com um modelo de chat vigente e um corpo com `messages` no lugar de `prompt`.

</aside>

## Encerramento
Duration: 2:00

Parabéns! Você criou um projeto Java com Maven que lê a chave de API de um arquivo de configurações, monta um prompt, representa requisição e resposta com classes anotadas pela Lombok, converte-as com a GSON e conversa com o ChatGPT por meio da OkHttp.

### Referências

* OpenAI. OpenAI, 2023. Disponível em [https://openai.com/](https://openai.com/). Acesso em maio de 2023.
* API de completions: [https://platform.openai.com/docs/api-reference/completions/create](https://platform.openai.com/docs/api-reference/completions/create)
* OkHttp: [https://square.github.io/okhttp/](https://square.github.io/okhttp/)
