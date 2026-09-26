summary: Crie no VS Code uma aplicação Java que consome uma API REST de cadastro de pessoas no Oracle Cloud com HttpClient, usando Lombok, arquivo properties, .gitignore e a biblioteca org.json para tratar o JSON.
id: java-http-api-rest-oracle-cloud
categories: Java
tags: java,http,api rest,httpclient,oracle cloud,json,org.json,lombok,properties,vs code
status: Published
authors: Rodrigo Bossini
last updated: 2022-10-27
pdf: java/903_apostila_java_http_oracle_cloud_api_rest_cadastro_pessoas.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Java e APIs REST: requisições HTTP ao Oracle Cloud

## Visão geral
Duration: 3:00

Neste material, o nosso intuito é desenvolver uma aplicação Java capaz de realizar requisições HTTP direcionadas a uma API REST hospedada no ambiente Oracle Cloud. Veja a Figura 1.1.

![Na Oracle Cloud, uma tabela de pessoas com cod_pessoa, nome, idade e hobby no Oracle Autonomous Database é exposta por uma API REST gerada automaticamente com GET, POST, PUT e DELETE em /pessoas, consumida pela aplicação Java](img/fig-1-1.webp)

*Figura 1.1 – A aplicação Java consome a API REST gerada a partir da base de dados no Oracle Cloud.*

<aside class="negative">

**Nota.** Será necessário ter o ambiente Oracle previamente alocado a fim de desenvolver esta aplicação.

</aside>

### O que você vai aprender

* Criar um projeto Java sem ferramenta de build no VS Code
* Usar a Lombok para gerar getters, setters e construtores
* Fazer requisições HTTP com `HttpClient`, `HttpRequest` e `HttpResponse`
* Tirar dados sensíveis do código com um arquivo properties
* Preparar o controle de versão com `.gitignore`
* Entender o formato JSON e tratá-lo com a biblioteca org.json

### O que você vai precisar

* VS Code com JDK 11 ou superior
* Uma API REST de cadastro de pessoas publicada no Oracle Cloud
* Git instalado

## Criando o projeto no VS Code
Duration: 8:00

### Extension Pack for Java

Caso ainda não possua, faça a instalação da extensão **Extension Pack for Java** do VS Code. Observe a Figura 2.1.1.

![Marketplace do VS Code com a busca por java e a extensão Extension Pack for Java destacada, com o botão Install](img/fig-2-1-1.webp)

*Figura 2.1.1 – A extensão Extension Pack for Java.*

### Pasta, VS Code, novo projeto

Se ainda não possuir, crie uma pasta para abrigar os seus projetos Java. A seguir, abra o VS Code. Aperte **CTRL + SHIFT + P** e digite **Java**. Escolha a opção **Java: Create Java Project**. Veja a Figura 2.2.1.

![Paleta de comandos do VS Code com a opção Java: Create Java Project destacada](img/fig-2-2-1.webp)

*Figura 2.2.1 – Java: Create Java Project.*

A seguir, escolha **No build tools**, como mostra a Figura 2.2.2.

![Seleção do tipo de projeto com a opção No build tools destacada](img/fig-2-2-2.webp)

*Figura 2.2.2 – Projeto sem ferramenta de build.*

A seguir, o VS Code exibirá um navegador de arquivos. Faça uso dele para encontrar a pasta que abriga todos os seus projetos Java e clique em **Select the project location**. Veja a Figura 2.2.3.

![Navegador de arquivos com a pasta de projetos java selecionada e o botão Select the project location destacado](img/fig-2-2-3.webp)

*Figura 2.2.3 – Escolhendo o local do projeto.*

Como mostra a Figura 2.2.4, digite o nome do seu projeto e aperte Enter.

![Campo de nome do projeto com oracle_cloud_rest_api_cadastro_pessoas digitado](img/fig-2-2-4.webp)

*Figura 2.2.4 – Nome do projeto.*

O resultado esperado aparece na Figura 2.2.5. Observe que uma pasta com o nome do projeto escolhido deve ter sido criada e o VS Code deve estar vinculado a ela.

![Explorer do VS Code com a pasta ORACLE_CLOUD_REST_API_CADASTRO_PESSOAS contendo .vscode, lib, src e README.md](img/fig-2-2-5.webp)

*Figura 2.2.5 – O projeto criado.*

A estrutura criada contém os seguintes itens:

* `.vscode/` – pasta oculta que abriga um arquivo de configurações
* `.vscode/settings.json` – arquivo de configurações
* `lib` – pasta que poderemos utilizar para armazenar bibliotecas de interesse
* `src` – pasta utilizada para armazenar o código fonte (arquivos `.java`)
* `src/App.java` – arquivo que contém um "Hello, World"
* `README.md` – um arquivo com informações sobre a organização do projeto

Apenas por curiosidade, abra o arquivo `.vscode/settings.json`. Seu conteúdo deve ser semelhante àquele do Código 2.2.1. Observe como as instruções indicam as pastas em que deverão ser armazenados o código-fonte, o código compilado e as bibliotecas. Não precisa alterar nada neste arquivo, ele foi aberto apenas para inspeção e aprendizado.

**.vscode/settings.json · Código 2.2.1**

```json
{
    "java.project.sourcePaths": ["src"],
    "java.project.outputPath": "bin",
    "java.project.referencedLibraries": [
        "lib/**/*.jar"
    ]
}
```

## Menu e a classe Pessoa com Lombok
Duration: 10:00

### Menu de opções

Nosso aplicativo oferecerá um menu ao usuário que ele poderá utilizar para escolher operações que deseja realizar. A sua implementação inicial aparece no Código 2.3.1. Estamos no arquivo `App.java`.

**src/App.java · Código 2.3.1**

```java
import static java.lang.Integer.parseInt;
import static javax.swing.JOptionPane.showInputDialog;
import static javax.swing.JOptionPane.showMessageDialog;

public class App {
    public static void main(String[] args) {
        int op;
        String menu = "1-Cadastrar\n2-Atualizar\n-3-Listar\n4-Remover\n0-Sair";
        do {
            op = parseInt(showInputDialog(menu));
            switch (op) {
                case 1: {
                    break;
                }
                case 2: {
                    break;
                }
                case 3: {
                    break;
                }
                case 4: {
                    break;
                }
                case 0: {
                    showMessageDialog(null, "Até mais");
                    break;
                }
                default: {
                    showMessageDialog(null, "Opção inválida");
                    break;
                }
            }
        } while (op != 0);
    }
}
```

### Classe Pessoa

Vamos criar uma classe para descrever o que é uma pessoa. Crie um novo arquivo chamado `Pessoa.java` na pasta `src`. Seu conteúdo aparece no Código 2.4.1.

**src/Pessoa.java · Código 2.4.1**

```java
public class Pessoa {
    private int codigo;
    private String nome;
    private int idade;
    private String hobby;
}
```

Observe como ela não possui métodos getters/setters nem construtores. Isso acontece pois optaremos por utilizar uma biblioteca chamada **Lombok**. Por meio de anotações, ela nos permite especificar os atributos para os quais desejamos que existam métodos getters/setters e os gera automaticamente. Visite a sua página oficial por meio do link a seguir.

[https://projectlombok.org/](https://projectlombok.org/)

O download pode ser realizado por meio do link a seguir.

[https://projectlombok.org/downloads/lombok.jar](https://projectlombok.org/downloads/lombok.jar)

Faça o download do arquivo. Trata-se de um único arquivo de extensão `.jar`. Coloque esse arquivo dentro da pasta `lib` de seu projeto. O resultado esperado aparece na Figura 2.4.1.

![Explorer do VS Code com lombok.jar dentro da pasta lib destacado](img/fig-2-4-1.webp)

*Figura 2.4.1 – A Lombok na pasta lib.*

O Código 2.4.2 mostra como é simples utilizar anotações da Lombok para gerar os métodos de acesso e modificadores. Neste exemplo, aplicamos as anotações à classe como um todo, o que quer dizer que os métodos serão gerados para todos os atributos. Também é possível aplicar as anotações em um atributo específico, o que faz com que os métodos sejam gerados apenas para ele.

**src/Pessoa.java · Código 2.4.2**

```java
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Pessoa {
    private int codigo;
    private String nome;
    private int idade;
    private String hobby;
}
```

Se desejar, faça o teste que o Código 2.4.3 mostra. Apenas para ter certeza de que os métodos foram gerados mesmo. Depois do teste, apague o método `main` da classe `Pessoa` (apenas esse).

**src/Pessoa.java · Código 2.4.3**

```java
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Pessoa {
    private int codigo;
    private String nome;
    private int idade;
    private String hobby;

    //apenas para testar
    //depois do teste, pode apagar
    public static void main(String[] args) {
        Pessoa p = new Pessoa();
        p.setNome("João");
        System.out.println(p.getNome());
    }
}
```

## Serviço para requisições HTTP
Duration: 10:00

Nesta seção, vamos criar uma classe de "serviço" para isolar a realização das requisições HTTP. Clique com o direito na pasta `src` e crie um arquivo chamado `PessoaService.java`. Veja seu conteúdo inicial no Código 2.5.1.

**src/PessoaService.java · Código 2.5.1**

```java
public class PessoaService {

}
```

A classe `HttpClient` foi adicionada à especificação Java desde a versão 11. Faremos uso dela para realizar as requisições. Uma instância do tipo `HttpClient` representa, como o nome sugere, um cliente HTTP, tal qual um navegador. Na classe `PessoaService`, vamos construir uma instância dessa classe. Já aproveitamos e armazenamos a URL de acesso à API REST no ambiente OC também. Veja o Código 2.5.2.

**src/PessoaService.java · Código 2.5.2**

```java
import java.net.http.HttpClient;

public class PessoaService {
    private HttpClient client = HttpClient.newHttpClient();
    private String url = "sua url aqui";
}
```

### Obtenção dos dados

A seguir, escrevemos um método capaz de obter a coleção armazenada na base. Para tal, precisamos construir um objeto do tipo `HttpRequest`. Ele representa, como o nome sugere, a requisição que realizaremos. A resposta é representada por um objeto do tipo `HttpResponse`. Sua propriedade `body` nos dá acesso ao conteúdo de interesse. Veja o Código 2.5.3.

**src/PessoaService.java · Código 2.5.3**

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse.BodyHandlers;

public class PessoaService {
    private HttpClient client = HttpClient.newHttpClient();
    private String url = "sua url aqui";

    public void listar() throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .build();
        var res = client.send(req, BodyHandlers.ofString());
        System.out.println(res.body());
    }
}
```

Para testar o método recém-criado, vamos chamá-lo no método `main` da classe `App`. Ajuste seu método `main` como no Código 2.5.4, comentando o menu por enquanto.

**src/App.java · Código 2.5.4**

```java
public class App {
    public static void main(String[] args) throws Exception {
        PessoaService service = new PessoaService();
        service.listar();
        //comente por enquanto
        // int op;
        // String menu = "1-Cadastrar\n2-Atualizar\n-3-Listar\n4-Remover\n0-Sair";
        …
    }
}
```

No VS Code, clique no botão de execução, como na Figura 2.5.1.

![Barra de abas do VS Code com o botão de execução, no canto superior direito, destacado](img/fig-2-5-1.webp)

*Figura 2.5.1 – Executando a aplicação.*

Veja o resultado esperado na Figura 2.5.2. Observe como os dados armazenados na base aparecem no terminal.

![Terminal exibindo o JSON devolvido pela API, com a lista items contendo pessoas como Pedro e Rodrigo](img/fig-2-5-2.webp)

*Figura 2.5.2 – Os dados da base no terminal.*

Agora já podemos remover o teste realizado do método `main`.

## Dados sensíveis em um arquivo properties
Duration: 10:00

### Ajuste rápido: properties

Observe que a URL de acesso à base está fixa no código. Além disso, é possível que, no futuro, tenhamos a necessidade de fazer uso de dados sensíveis como usuários e senhas. Não desejamos que esse tipo de dado esteja disponível no código da aplicação, pelo menos por duas razões:

* **Controle de versão**, pois talvez estejamos utilizando repositórios públicos
* **Variação em função do ambiente**: em função do ambiente (desenvolvimento, homologação, produção etc.) o aplicativo pode ter de utilizar usuários/senhas etc. diferentes. Desejamos um meio simples de ajustar esses valores sem ter de recompilar o código a cada alteração.

É aí que entra o uso do "properties". A ideia é bem simples: criamos um arquivo — geralmente com extensão `properties`, mas pode ser qualquer outra — e escrevemos uma coleção de pares chave/valor, armazenando os dados de interesse. Para começar, crie um arquivo chamado `app.properties` na pasta `src`. Observe, no Código 2.6.1, como armazenaremos a url de acesso à API REST.

**src/app.properties · Código 2.6.1**

```ini
#não use aspas e não coloque espaços em branco
URL=suaurlaqui
```

Faça o teste como mostra o Código 2.6.2.

**src/App.java · Código 2.6.2**

```java
import java.io.FileInputStream;
import java.util.Properties;

public class App {
    public static void main(String[] args) throws Exception {
        Properties properties = new Properties();
        properties.load(new FileInputStream("src/app.properties"));
        System.out.println(properties.getProperty("URL"));
        …
```

O resultado esperado se parece com aquele exibido na Figura 2.6.1.

![Terminal exibindo a URL da API lida do arquivo app.properties](img/fig-2-6-1.webp)

*Figura 2.6.1 – A URL lida do arquivo properties.*

Agora você também já pode remover a instrução que exibe o valor da URL. Era apenas um teste.

### Service utilizando o properties

O próximo passo é fazer com que a classe `PessoaService` utilize o conteúdo do arquivo properties. Para isso, vamos ajustá-la da seguinte forma. O Código 2.7.1 mostra como criamos um construtor que recebe a URL utilizando a Lombok.

**src/PessoaService.java · Código 2.7.1**

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse.BodyHandlers;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PessoaService {
    private HttpClient client = HttpClient.newHttpClient();
    //construtor gerado apenas para campos que requerem tratamento
    //por ser final, precisa ser inicializado
    private final String url;

    public void listar() throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .build();
        var res = client.send(req, BodyHandlers.ofString());
        System.out.println(res.body());
    }
}
```

A seguir, no arquivo `App.java`, instanciamos um `PessoaService` passando a ele a URL obtida do properties, como mostra o Código 2.7.2. Já aproveitamos e fazemos novo teste chamando o método `listar`.

**src/App.java · Código 2.7.2**

```java
import java.io.FileInputStream;
import java.util.Properties;

public class App {
    public static void main(String[] args) throws Exception {
        Properties properties = new Properties();
        properties.load(new FileInputStream("src/app.properties"));
        PessoaService service = new PessoaService(properties.getProperty("URL"));
        service.listar();
        //comente por enquanto
        // int op;
        // String menu = "1-Cadastrar\n2-Atualizar\n-3-Listar\n4-Remover\n0-Sair";
    }
}
```

Execute o programa para obter, no terminal, algo parecido com o que a Figura 2.7.1 exibe.

![Terminal com o JSON de pessoas devolvido pela API, agora usando a URL do arquivo properties](img/fig-2-7-1.webp)

*Figura 2.7.1 – A listagem com a URL vinda do properties.*

## Controle de versão
Duration: 4:00

Em algum momento teremos de realizar o controle de versão. Que tal agora? Comece criando um arquivo `.gitignore` na raiz do projeto. Há bastante conteúdo para "ignorar". Veja o Código 2.8.1.

**.gitignore · Código 2.8.1**

```text
bin
*.class
.vscode
lib
src/app.properties
```

A seguir, use

**Terminal**

```bash
git init
git add .
git commit -m "oracle_cloud(http_requests): menu, modelo pessoa, properties, service, .gitignore, requisições HTTP GET"
```

## Representação de dados com JSON
Duration: 8:00

Inspecione uma vez mais o resultado obtido a partir da requisição realizada. A Figura 2.9.1 destaca alguns trechos de interesse.

![Saída do terminal com trechos destacados, cada um com um objeto de pessoa contendo cod_pessoa, nome, idade e hobby](img/fig-2-9-1.webp)

*Figura 2.9.1 – Cada trecho destacado é uma pessoa representada em JSON.*

Os trechos destacados representam pessoas no formato "JSON", que vem de *JavaScript Object Notation*. Não é algo específico da linguagem JavaScript, pelo contrário. É uma notação baseada em um recurso da linguagem JavaScript mas utilizada em qualquer ambiente. O problema que o uso de objetos JSON resolve é elementar: como representar dados de modo que dois aplicativos possam se comunicar e a representação seja independente de sua implementação? Há diferentes formas de fazê-lo, como utilizar um formato proprietário ou XML. Um formato proprietário, em geral, não é boa ideia. Afinal, cada sistema que pretende utilizá-lo precisa se ajustar para lidar com os dados de forma apropriada. O formato XML já foi bastante utilizado e ainda há muitos aplicativos que o utilizam. Entretanto, o formato JSON é o mais amplamente utilizado.

Vejamos alguns exemplos de objetos JSON. No Código 2.9.1 representamos uma pessoa que tem

* nome igual a João
* idade igual a 32

**Código 2.9.1**

```json
{
    "nome": "João",
    "idade": 32
}
```

No Código 2.9.2 representamos uma pessoa que tem

* nome igual a Maria
* idade igual a 27
* endereco composto por
    * logradouro igual a Rua B,
    * numero igual a 12,
    * bairro igual a Vila K

Este é um exemplo de **objeto JSON aninhado**.

**Código 2.9.2**

```json
{
    "nome": "Maria",
    "idade": 27,
    "endereco": {
        "logradouro": "Rua B",
        "numero": 12,
        "bairro": "Vila K"
    }
}
```

O Código 2.9.3, por sua vez, mostra uma coleção de veículos. Ela possui dois veículos. Cada veículo possui

* placa
* ano
* dono, composto por
    * nome
    * idade

**Código 2.9.3**

```json
[
    {
        "placa": "ABC-1234",
        "ano": 1990,
        "dono": {
            "nome": "Pedro",
            "idade": 28
        }
    },
    {
        "placa": "DEF-4567",
        "ano": 2000,
        "dono": {
            "nome": "Cristina",
            "idade": 30
        }
    }
]
```

## Objetos JSON em Java com org.json
Duration: 10:00

Observe que cada objeto JSON exibido pode ser representado com uma estrutura própria da linguagem Java. Felizmente, não temos de varrer a string caractere a caractere em busca das chaves e valores. Esse trabalho já foi feito em inúmeras bibliotecas. Nesta seção, faremos uso da **org.json**. O link a seguir dá acesso à sua página no GitHub.

[https://github.com/stleary/JSON-java](https://github.com/stleary/JSON-java)

Faça o download do arquivo jar clicando em **Click here if you just want the latest release jar file** e encaixe-o no seu projeto, como na Figura 2.10.1.

![Explorer do VS Code com json-20220924.jar dentro da pasta lib destacado](img/fig-2-10-1.webp)

*Figura 2.10.1 – O jar da org.json na pasta lib.*

Certifique-se, também, de que ela aparece na seção **Referenced Libraries**, sob **Java Projects**, como destaca a Figura 2.10.2.

![Seção Java Projects com json-20220924.jar listado em Referenced Libraries](img/fig-2-10-2.webp)

*Figura 2.10.2 – A org.json nas bibliotecas referenciadas.*

O Código 2.10.1 mostra um primeiro tratamento dos dados.

**src/PessoaService.java · Código 2.10.1**

```java
…
public void listar() throws Exception {
    HttpRequest req = HttpRequest.newBuilder()
        .uri(URI.create(url))
        .build();
    var res = client.send(req, BodyHandlers.ofString());
    // System.out.println(res.body());
    //obtemos a raiz do resultado que é um objeto JSON
    JSONObject raiz = new JSONObject(res.body());
    // System.out.println(raiz);
    // dela pegamos a propriedade items, que é um Array, uma coleção
    JSONArray items = raiz.getJSONArray("items");
    // System.out.println(items);
    //iteramos sobre a coleção
    //cada valor dentro dela é um objeto JSON
    for (int i = 0; i < items.length(); i++) {
        JSONObject pessoa = items.getJSONObject(i);
        // System.out.println(pessoa);
        //de cada pessoa, pegamos nome, idade e hobby
        System.out.println("Nome: " + pessoa.getString("nome"));
        System.out.println("Idade: " + pessoa.getInt("idade"));
        System.out.println("Hobby: " + pessoa.getString("hobby"));
        System.out.println("**************************");
    }
}
…
```

<aside class="positive">

Acrescente ao início de `PessoaService.java` as linhas `import org.json.JSONArray;` e `import org.json.JSONObject;`.

</aside>

## Encerramento
Duration: 2:00

Você criou um projeto Java no VS Code que lista as pessoas de uma API REST no Oracle Cloud usando `HttpClient`, guardou a URL em um arquivo properties fora do controle de versão, gerou código com a Lombok e percorreu o JSON devolvido com a biblioteca org.json.

### Próximos passos

* Implemente as opções de cadastrar (POST), atualizar (PUT) e remover (DELETE) do menu, usando a mesma estrutura do método `listar`
