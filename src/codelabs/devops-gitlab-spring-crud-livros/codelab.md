summary: Desenvolva uma API Spring Boot para manipulação de livros e construa um pipeline GitLab CI completo: build com Gradle, teste ping pong, análise estática com PMD, testes unitários com JUnit e implantação no AWS Elastic Beanstalk (via S3 e AWS CLI) e no Heroku.
id: devops-gitlab-spring-crud-livros
categories: GitLab,Java,DevOps
tags: gitlab,ci/cd,spring boot,java,gradle,postman,aws,elastic beanstalk,s3,iam,aws cli,pmd,junit,heroku,dpl
status: Published
authors: Rodrigo Bossini
last updated: 2022-05-31
pdf: devops/04_apostila_devops_gitlab_spring_crud_livros.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# GitLab CI com Spring Boot: CRUD de livros do build à implantação

## Visão geral
Duration: 4:00

Neste material, vamos desenvolver uma **API para a manipulação de livros**. A ideia é termos uma aplicação simples que nos permitirá fazer a construção de um **Pipeline**, ilustrando alguns dos principais recursos que o GitLab oferece.

### O que você vai aprender

* Criar uma API REST com Spring Boot, Spring Data JPA, Lombok e H2
* Testar a API com o cliente HTTP do IntelliJ e com o Postman (workspaces, ambientes, variáveis e coleções)
* Fazer o build com o Gradle, pelo IDE e pela linha de comando
* Automatizar o build com o GitLab CI e guardar o `.jar` como artefato
* Criar um stage de teste "ping pong" que sobe a aplicação e a consulta com `curl`
* Implantar a aplicação no AWS Elastic Beanstalk, manualmente e pelo pipeline, usando S3, IAM e AWS CLI
* Usar variáveis do GitLab (de grupo, do arquivo e predefinidas, como `CI_PIPELINE_IID`)
* Verificar a qualidade do código com PMD
* Escrever testes unitários com JUnit, `TestRestTemplate` e `MockMvc` e exibir os relatórios no GitLab
* Implantar a aplicação no Heroku com a ferramenta DPL

### O que você vai precisar

* JDK 17 e um IDE Java. O material usa o **IntelliJ Ultimate**, mas fique à vontade para utilizar aquele que você preferir.
* Git e uma conta no **GitLab** ([https://gitlab.com/](https://gitlab.com/))
* O **Postman** ([https://www.postman.com/](https://www.postman.com/))
* Opcional: uma conta na **AWS** e uma conta no **Heroku** para as seções de implantação

<aside class="positive">

**Nota.** Considere utilizar o protocolo SSH em suas conexões com servidores Git, como o GitLab e o GitHub. Veja mais informações em [https://docs.gitlab.com/ee/ssh/](https://docs.gitlab.com/ee/ssh/) (Link 2.1) e [https://docs.github.com/pt/authentication/connecting-to-github-with-ssh](https://docs.github.com/pt/authentication/connecting-to-github-with-ssh) (Link 2.2). É uma sugestão para você olhar com calma mais tarde e fazer as configurações necessárias.

</aside>

## Novo projeto Spring Boot
Duration: 10:00

### Novo projeto

Comece clicando em **New Project** na tela inicial do IntelliJ. Preencha os campos da tela seguinte como mostra a figura a seguir e clique em **Next**.

![Tela New Project do IntelliJ com o gerador Spring Initializr selecionado e os campos do projeto preenchidos: nome pessoal_gitlab_api_livros, linguagem Java, tipo Gradle, grupo br.com.bossini e Java 17](img/fig-2-2.webp)

*Figura 2.2: dados do novo projeto.*

### Dependências

Na tela seguinte, vamos escolher as dependências de nosso projeto. São elas.

* Categoria **Developer Tools**
  * **Spring Boot DevTools**. Traz diversos utilitários que simplificam o desenvolvimento, como LiveReload: atualização do navegador automática quando um recurso é alterado, sem a necessidade de reiniciar o servidor.
  * **Lombok**. Biblioteca que permite especificar métodos getters/setters, equals etc. utilizando apenas anotações.
  * **Spring Configuration Processor**. Oferece, por exemplo, "auto-complete" e sugestões dependentes de contexto quando editamos arquivos de configuração.
* Categoria **Web**
  * **Spring Web**. Inclui o Spring MVC e um Apache Tomcat embutido.
* Categoria **SQL**
  * **Spring Data JPA**. Persistência de dados usando a JPA, Spring Data e Hibernate.
  * **H2 Database**. O H2 é uma espécie de banco de dados que executa somente em memória volátil. É bom para testes iniciais.

<aside class="positive">

**Nota.** Pelo simples fato de adicionarmos a dependência H2 ao projeto, o Spring Boot se encarrega de especificar alguns valores padrão para que possamos utilizá-la da maneira mais fácil possível. Inicialmente, a base pode ser acessada com um usuário chamado "sa" e senha vazia. As configurações iniciais podem ser alteradas no arquivo `src/main/resources/application.properties`.

</aside>

![Tela de dependências do Spring Initializr com Spring Boot DevTools, Lombok, Spring Configuration Processor, Spring Web, Spring Data JPA e H2 Database selecionadas](img/fig-2-3.webp)

*Figura 2.3: dependências do projeto.*

A seguir, clique em **Finish**. O IDE pode levar alguns minutos para finalizar o primeiro build. Quando ele terminar, você deverá ver a mensagem **BUILD SUCCESSFUL**, como na figura a seguir.

![Janela do IntelliJ com o projeto aberto e a mensagem BUILD SUCCESSFUL destacada no painel inferior](img/fig-2-4.webp)

*Figura 2.4: primeiro build concluído.*

### Checando o arquivo build.gradle

Projetos gerenciados pelo Gradle possuem um arquivo chamado `build.gradle`. Entre outras coisas, ele contém a descrição das dependências de nosso projeto. Seu conteúdo deve ser parecido com aquele que o bloco de código a seguir exibe. Compare com o seu. Caso tenha esquecido de selecionar alguma dependência durante a criação do projeto, basta verificar a seção `dependencies` deste arquivo e ajustar conforme necessário.

**build.gradle · Bloco de Código 2.1**

```text
plugins {
    id 'org.springframework.boot' version '2.6.2'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
    id 'java'
}

group = 'br.com.bossini'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '17'

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    compileOnly 'org.projectlombok:lombok'
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
    runtimeOnly 'com.h2database:h2'
    annotationProcessor 'org.springframework.boot:spring-boot-configuration-processor'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

test {
    useJUnitPlatform()
}
```

## Modelo, repositório e serviço
Duration: 12:00

### Classe de modelo: Livro

Comecemos descrevendo o que é um livro, ou seja, escrevendo uma clássica classe POJO. Antes disso, vamos criar um pacote para abrigar classes de modelo. Para tal, clique com o direito no pacote da aplicação (**main >> java >> pacote**) e escolha **New >> Package**. O nome dele pode ser algo como `model`.

A seguir, clique com o direito sobre o pacote que acaba de criar e crie uma classe chamada `Livro`. A sua implementação aparece no bloco de código a seguir. Observe como utilizamos a biblioteca Lombok para gerar os métodos getters/setters e dois construtores ao invés de escrevê-los explicitamente.

**model/Livro.java · Bloco de Código 2.2**

```java
package br.com.bossini.pessoal_gitlab_api_livros.model;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

//construtor padrão
@NoArgsConstructor
//construtor com todos os parâmetros, na ordem de declaração
@AllArgsConstructor
//quando aplicados a uma classe
//geram getters/setters para todos os campos não marcados como static
@Getter
@Setter
@Entity
public class Livro {
    @Id
    @GeneratedValue
    private Long id;
    private String titulo;
    private String autor;
    private int edicao;
}
```

### Acesso à base de dados: LivroRepository usando Spring Data JPA

O acesso a bases de dados em geral, incluindo as relacionais, é bastante simplificado quando usamos o **Spring Data JPA**. A implementação de métodos que realizam operações triviais consiste na simples implementação de uma interface. Ela deve:

* Estender a interface `JpaRepository`
* Especificar o tipo de dado manipulado e o tipo do atributo que será mapeado como chave primária no "generics" da interface `JpaRepository`.

Clique com o direito no pacote da aplicação como feito anteriormente e crie um pacote cujo nome pode ser algo como `repository`.

A seguir, clique com o direito sobre o pacote que acaba de criar e escolha **New >> Java Class >> Interface**. Seu nome pode ser algo como `LivroRepository`. O bloco de código a seguir mostra a sua implementação.

**repository/LivroRepository.java · Bloco de Código 2.3**

```java
package br.com.bossini.pessoal_gitlab_api_livros.repository;

import br.com.bossini.pessoal_gitlab_api_livros.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LivroRepository extends JpaRepository <Livro, Long> {
}
```

### Classe de serviço: LivroService

As funcionalidades envolvendo livros serão oferecidas por uma **classe de serviço**. Comece criando um pacote para as classes de serviço chamado `service`, tal qual feito anteriormente com os demais pacotes. A seguir, crie uma classe chamada `LivroService` neste pacote. Veja a sua implementação inicial no bloco de código a seguir. Observe como utilizamos o mecanismo **"injeção de dependência"** instruindo o Spring a construir uma instância de classe que implemente a interface `LivroRepository` e a nos entregá-la pronta para uso.

**service/LivroService.java · Bloco de Código 2.3**

```java
package br.com.bossini.pessoal_gitlab_api_livros.service;

import br.com.bossini.pessoal_gitlab_api_livros.model.Livro;
import br.com.bossini.pessoal_gitlab_api_livros.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LivroService {

    //injeção de dependência
    @Autowired
    private LivroRepository livroRepository;

    //acessa a base usando o livroRepository
    //save é um método que foi implementado automaticamente
    //ele faz um insert numa base relacional
    public void salvar (Livro livro){
        this.livroRepository.save(livro);
    }

    //findAll é um método que foi implementado automaticamente
    //ele faz um SELECT * numa base relacional
    public List<Livro> listar (){
        return this.livroRepository.findAll();
    }
}
```

## Controllers e um primeiro teste no IDE
Duration: 12:00

### Controller para manipulação de livros

No Spring, o atendimento de requisições é responsabilidade de **controllers**. Criaremos uma primeira classe que terá as seguintes características:

* Será anotada com `@RestController`. Isso quer dizer que ela é capaz de atender requisições e que os corpos de seus métodos definem aquilo que será devolvido de fato, ao invés de direcionarem para outros recursos como páginas JSP. `@RestController` é uma combinação de `@Controller` e `@ResponseBody`.
* Será anotada com `@RequestMapping`, o que quer dizer que as requisições terão o padrão inicial ali especificado. Por exemplo, `@RequestMapping("/livros")` indica que as requisições por ela atendidas deverão ter o formato `host:porta/livros`.
* Terá uma instância de `LivroService` injetada pelo Spring.
* Atenderá requisições **POST** definindo um método que recebe um objeto `Livro` e o armazena na base.
* Atenderá requisições **GET** definindo um método que devolve a coleção completa de livros.

Comece criando um pacote cujo nome pode ser algo parecido com `controller`, também no pacote principal da aplicação, tal qual feito com os demais. Veja a implementação inicial do Controller no bloco de código a seguir.

**controller/LivroController.java · Bloco de Código 2.4**

```java
package br.com.bossini.pessoal_gitlab_api_livros.controller;

import br.com.bossini.pessoal_gitlab_api_livros.model.Livro;
import br.com.bossini.pessoal_gitlab_api_livros.service.LivroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/livros")
public class LivroController {

    @Autowired
    private LivroService livroService;

    @PostMapping("/salvar")
    public void salvar (@RequestBody Livro livro){
        this.livroService.salvar(livro);
    }

    @GetMapping
    public List<Livro> listar (){
        return this.livroService.listar();
    }
}
```

### Controller para teste de funcionamento

Um tipo de teste bastante comum consiste na simples verificação de funcionalidade do sistema: um cliente envia uma mensagem de teste e aguarda por uma resposta de confirmação. Neste exemplo, vamos implementar um controller que recebe uma requisição no padrão `host:porta/ping` e que responde "pong". Também no pacote de controllers criado por você anteriormente, crie uma classe chamada `PingPongController`. Veja a sua implementação no bloco de código a seguir.

**controller/PingPongController.java · Bloco de Código 2.5**

```java
package br.com.bossini.pessoal_gitlab_api_livros.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ping")
public class PingPongController {
    @GetMapping
    public String executando (){
        return "pong";
    }
}
```

### Ping/pong: um breve teste

Antes de prosseguirmos, executemos um breve teste diretamente no IDE. Para tal, antes de mais nada, certifique-se de colocar o servidor em execução: no canto superior direito do IDE, clique em **Gradle**. Depois disso, clique no nome do projeto para expandir e expanda também **Tasks** e **application**. Clique duas vezes em **bootRun** para colocar a aplicação em execução. Veja a figura a seguir.

![Painel Gradle do IntelliJ com Tasks, application e a tarefa bootRun destacadas](img/fig-2-6.webp)

*Figura 2.6: executando a aplicação com a tarefa bootRun.*

Agora desejamos executar uma requisição HTTP para fazer o teste. Isso pode ser feito de maneira muito simples. Abra o arquivo `PingPongController`. Repare que ele mostra um "globinho" à frente do mapeamento `GetMapping`. Clique sobre o globinho e escolha a opção **Generate request in HTTP client**, como mostra a figura a seguir. É possível que você veja um pequeno menu com opções: basta escolher a primeira.

![Menu do globinho ao lado do GetMapping com a opção Generate request in HTTP client destacada](img/fig-2-8.webp)

*Figura 2.8: gerando uma requisição no cliente HTTP do IntelliJ.*

Para executar o teste, basta clicar no botão destacado pela figura a seguir.

![Arquivo de requisição HTTP com GET http://localhost:8080/ping e o botão de execução destacado](img/fig-2-10.webp)

*Figura 2.10: executando a requisição.*

O resultado esperado se parece com aquele exibido pela figura a seguir.

![Painel de resultado com a resposta HTTP 200 e o corpo pong destacados](img/fig-2-11.webp)

*Figura 2.11: a resposta pong.*

## Testando funcionalidades com o Postman
Duration: 15:00

Também podemos realizar nossos testes de consumo de API por meio de requisições HTTP utilizando diferentes clientes HTTP. Um dos mais utilizados é o **Postman**. Ele pode ser encontrado em [https://www.postman.com/](https://www.postman.com/) (Link 2.3). Antes de prosseguir, veja detalhes importantes sobre o funcionamento do Postman visitando [este link](https://drive.google.com/file/d/1FG7vIUiWtlSzDqqPAA6uzBJoLriuUKbY/view?usp=sharing) (Link 2.4).

### Novo Workspace no Postman

No Postman, vamos começar criando uma coleção para as requisições envolvendo livros. Clique em **Workspaces >> Create Workspace**, como mostra a figura a seguir.

![Menu Workspaces do Postman aberto com o botão Create Workspace destacado](img/fig-2-12.webp)

*Figura 2.12: criando um workspace.*

Na tela seguinte, escolha um nome para ele e clique em **Create Workspace**. Escolha também a visibilidade que desejar. Um bom nome poderia ser parecido com `gitlab_crud_livros`.

![Formulário Create workspace com nome, resumo e visibilidade Personal selecionada](img/fig-2-13.webp)

*Figura 2.13: dados do workspace.*

### Novo ambiente no Postman

A seguir, clique em **Environments** e então no símbolo **+** para criar um ambiente do Postman. Ele abrigará as variáveis referentes aos testes que serão realizados localmente. Escolha um nome que seja suficiente para lembrar de duas coisas:

* ele é um ambiente
* suas variáveis representam o ambiente local

Um bom nome poderia ser `env_gitlab_crud_livros_local`. Na tela seguinte, crie as variáveis exibidas pela tabela a seguir.

*Tabela 2.1*

| chave | valor |
| --- | --- |
| `base_url` | `localhost` |
| `port` | `8080` |

<aside class="positive">

**Nota.** Quando iniciamos a aplicação, uma instância do Apache Tomcat é colocada em execução e, por padrão, ele utiliza a porta 8080. Se desejar trocar essa porta, você pode fazê-lo utilizando o arquivo `src/main/resources/application.properties`. Veja um exemplo:

```ini
server.port=8081
```

Neste exemplo, trocamos a porta padrão para 8081. Esse passo não é obrigatório. Faça somente se desejar. Se alterar a porta neste arquivo, será necessário trocar o valor da variável `port` no Postman também.

</aside>

![Ambiente env_gitlab_crud_livros_local no Postman com as variáveis base_url igual a localhost e port igual a 8080](img/fig-2-15.webp)

*Figura 2.15: variáveis do ambiente local.*

Ainda nesta tela, repare que há uma opção chamada **Globals**, logo acima da lista de nomes de ambientes. Clique sobre Globals e crie as variáveis retratadas pela tabela a seguir.

![Tela Globals do Postman com as variáveis endpoint_livros e endpoint_teste_ping_pong](img/fig-2-16.webp)

*Figura 2.16: variáveis globais.*

*Tabela 2.2*

| chave | valor |
| --- | --- |
| `endpoint_livros` | `livros` |
| `endpoint_teste_ping_pong` | `ping` |

### Nova coleção: requisições de manipulação de livros

No Postman, clique em **Collections** e então no símbolo **+**. Vamos criar uma coleção para abrigar as requisições de manipulação de livros. Você pode escolher o nome na tela seguinte.

Para criar uma requisição para armazenamento de livros, clique com o direito sobre o nome da coleção e escolha **Add Request**. Seu nome pode ser algo como **Salvar Livro**. O método deve ser **POST** e a sua URL será

```text
{{base_url}}:{{port}}/{{endpoint_livros}}/salvar
```

Certifique-se, também, de selecionar o ambiente atual no Postman. Além disso, clique em **Body >> raw >> Text >> JSON** e digite o conteúdo do bloco de código a seguir.

**Body da requisição Salvar Livro · Bloco de Código 2.6**

```json
{
  "titulo": "{{$randomProductName}}",
  "autor": "{{$randomFullName}}",
  "edicao": "{{$randomInt}}"
}
```

Veja todos os detalhes na figura a seguir.

![Requisição Salvar Livro no Postman com método POST, a URL com variáveis, o corpo JSON raw e o ambiente local selecionado](img/fig-2-19.webp)

*Figura 2.19: a requisição Salvar Livro.*

A criação da requisição para listagem de livros é análoga. Clique com o direito sobre o nome da coleção e escolha **Add Request**. Seu nome pode ser algo como **Listar Livros**. O método deve ser **GET** e a URL será

```text
{{base_url}}:{{port}}/{{endpoint_livros}}
```

![Requisição Listar Livros no Postman com método GET e a URL com variáveis](img/fig-2-20.webp)

*Figura 2.20: a requisição Listar Livros.*

### Nova coleção: requisições para testes

Siga o mesmo passo a passo para

* criar uma coleção para abrigar requisições de testes. Seu nome pode ser algo como `colecao_crud_gitlab_livros_testes`
* criar uma requisição para executar o teste "ping pong". Seu nome pode ser algo como **Teste Ping Pong**. O método deve ser **GET** e a URL deve ser

```text
{{base_url}}:{{port}}/{{endpoint_teste_ping_pong}}
```

![Requisição Teste Ping Pong na coleção de testes do Postman com método GET](img/fig-2-21.webp)

*Figura 2.21: a requisição Teste Ping Pong.*

### Alguns testes

Certifique-se de que o servidor está em funcionamento. Clique em **Gradle** e expanda o nome do projeto, **Tasks** e **application** para clicar duas vezes em **bootRun**, se necessário. Depois disso, no Postman abra a requisição de armazenamento de livros e clique em **Send** algumas vezes. A seguir, abra a requisição de listagem de livros e clique em **Send** uma vez. O resultado esperado é parecido com aquele que a figura a seguir exibe.

![Resposta da requisição Listar Livros com um array JSON de livros, cada um com id, titulo, autor e edicao](img/fig-2-24.webp)

*Figura 2.24: livros listados.*

Execute também o teste ping pong para obter o resultado exibido pela figura a seguir.

![Resposta da requisição Teste Ping Pong com o corpo pong](img/fig-2-25.webp)

*Figura 2.25: resultado do teste ping pong.*

## Build da aplicação
Duration: 8:00

Evidentemente, quando executamos a aplicação diretamente no IDE, ela passou por um processo de **"build"** (compilação e geração do entregável) feito automaticamente pelo IDE. Podemos também realizar o build de maneira independente, o que será fundamental quando estivermos especificando nossos jobs e pipelines.

Para fazer o build da aplicação, clique em **Gradle** e clique no nome do projeto para expandir. Expanda também **Tasks** e **build**. Observe que há um item chamado justamente **build**, como mostra a figura a seguir.

![Painel Gradle com Tasks, build e a tarefa build destacadas](img/fig-2-26.webp)

*Figura 2.26: a tarefa build do Gradle.*

Clique duas vezes sobre o item **build**. Quando o processo terminar, seu IDE deverá mostrar uma mensagem de sucesso. Uma pasta chamada `build` deverá ter sido gerada. Ela pode ser encontrada no canto superior esquerdo do IDE. Ela tem uma subpasta chamada `libs`. Expanda ambas. Você deverá encontrar dois arquivos de extensão `.jar`. Um deles possui a palavra **"plain"** no nome. Trata-se do projeto compilado que inclui somente o código desenvolvido. Ele não inclui as bibliotecas. O outro arquivo, que não leva a palavra plain no nome, inclui tudo: código e bibliotecas. É desse que precisamos para fazer nossas implantações futuras. Veja a figura a seguir.

![Árvore do projeto com a pasta build/libs expandida mostrando os arquivos pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar e pessoal_gitlab_api_livros-0.0.1-SNAPSHOT-plain.jar](img/fig-2-28.webp)

*Figura 2.28: os dois arquivos .jar gerados.*

Observe que realizamos o build utilizando recursos gráficos do IDE. Isso não será possível quando estivermos definindo nossos pipelines. Por isso, vejamos como fazer o build pela linha de comando. O IntelliJ possui um terminal embutido, na parte inferior da janela. O comando para fazer o build é

**Terminal**

```bash
./gradlew build
```

O resultado esperado se parece com aquele que a figura a seguir exibe.

![Terminal do IntelliJ com a execução de ./gradlew build terminando em BUILD SUCCESSFUL](img/fig-2-30.webp)

*Figura 2.30: build pela linha de comando.*

Se desejar remover builds feitos anteriormente, você pode usar o comando

**Terminal**

```bash
./gradlew clean
```

o que removerá todo o conteúdo da pasta `build`. Use `./gradlew build` para gerar um novo build.

## O arquivo .gitlab-ci.yml e o repositório no GitLab
Duration: 15:00

### Criando o arquivo .gitlab-ci.yml

Nesta seção, criaremos o arquivo `.gitlab-ci.yml` a fim de automatizar o build da aplicação. Para tal, clique com o direito no nome do projeto e escolha **New >> File**. Dê o nome `.gitlab-ci.yml` ao arquivo e aperte Enter. É possível que o IDE lhe mostre uma mensagem parecida com aquela que a figura a seguir exibe.

![Diálogo Add File to Git perguntando se o arquivo .gitlab-ci.yml deve ser adicionado ao Git, com a opção Don't ask again e o botão Add](img/fig-2-32.webp)

*Figura 2.32: adicionando o arquivo ao Git.*

Ele está perguntando se você deseja colocar o arquivo que criamos sob controle de versão, ou seja, se deseja executar um `git add`. Você pode marcar a caixinha **"Don't ask again"** e clicar **Add**.

<aside class="positive">

**Nota.** É possível que a mensagem não apareça para você. Isso pode acontecer caso o seu projeto ainda não esteja sob controle de versão. Se desejar habilitar agora, você pode clicar em **VCS >> Create Git Repository…** como mostra a figura a seguir.

</aside>

![Menu VCS do IntelliJ com a opção Create Git Repository destacada](img/fig-2-33.webp)

*Figura 2.33: colocando o projeto sob controle de versão.*

O conteúdo inicial do arquivo `.gitlab-ci.yml` aparece no bloco de código a seguir. O que fazemos é o seguinte:

* Definimos um stage chamado `build`
* Definimos um job que se chama `build` e pertence ao stage `build`
* Especificamos uma imagem Docker a ser usada que contém o Java 17
* Usamos o comando `gradlew` para fazer o build, tal qual fizemos localmente
* Indicamos o artefato produzido, ou seja, o conteúdo que desejamos que não seja perdido uma vez que o contêiner Docker seja desalocado

Veja também os comentários no código.

**.gitlab-ci.yml · Bloco de Código 2.7**

```yaml
#nossos stages
stages:
  #primeiro stage se chama build
  - build

#primeiro job se chama build
build:
  #job build pertence ao stage build
  stage: build
  #imagem docker com java 17 e ferramentas como apt-get
  image: openjdk:17-bullseye
  #o script desse job faz apenas um build usando o gradle
  script:
    - ./gradlew build
  #produto final, acessível por outros stages
  artifacts:
    paths:
      - ./build/libs/
```

### Novo repositório no GitLab

O próximo passo é criar um repositório no GitLab. Para isso, visite [https://gitlab.com/](https://gitlab.com/) (Link 2.5) e faça login na sua conta. A seguir, clique em **New Project** e, depois, em **Create blank project**.

O nome do projeto no GitLab pode ser igual ao nome de seu projeto local, muito embora isso não seja obrigatório. Preencha o campo **Project name** e perceba que o campo **Project slug** é preenchido automaticamente. O project slug é apenas o sufixo do repositório no GitLab. Cada repositório no GitLab tem uma URL própria, com o seguinte formato:

```text
https://gitlab.com/nomeUsuario/slugDoProjeto
```

Desmarque a caixa **"Initialize repository with a README"** para não ter de se preocupar com uma operação pull do Git neste momento. Marque também o repositório como **public**. Mantenha os demais campos com seu valor padrão e clique em **Create project**, como na figura a seguir.

![Formulário Create blank project com nome e slug do projeto, visibilidade Public e a opção Initialize repository with a README desmarcada](img/fig-2-35.webp)

*Figura 2.35: criando o projeto no GitLab.*

Na tela seguinte, você terá acesso a um botão chamado **Clone**. Clicando sobre ele, você verá dois links. Um deles utiliza o protocolo SSH e o outro utiliza o protocolo HTTPS. Se você já tiver feito a configuração para acesso SSH, é recomendável utilizar esta opção. Caso contrário, providencie a configuração ou use o protocolo HTTPS por enquanto.

![Página do projeto vazio no GitLab com o botão Clone aberto mostrando os links Clone with SSH e Clone with HTTPS](img/fig-2-36.webp)

*Figura 2.36: links de clonagem do repositório.*

### Ligando o repositório local ao GitLab

Copie o link (SSH ou HTTPS, dependendo de suas configurações) e volte ao IntelliJ. Já no IDE, clique em **Git >> Manage Remotes…**, como mostra a figura a seguir.

![Menu Git do IntelliJ com a opção Manage Remotes destacada](img/fig-2-37.webp)

*Figura 2.37: gerenciando os remotes.*

Estamos adicionando uma referência ao repositório remoto a nosso repositório local, o que viabiliza as operações push do Git. Na tela seguinte, clique em **+**. Na próxima tela, você pode manter o nome **origin** ou escolher algum outro, caso desejar. Esse é apenas um apelido que fica associado ao link que estamos adicionando. O nome escolhido agora será utilizado nas operações push futuras. No campo **URL**, cole o link copiado da página do GitLab, que pode ser SSH ou HTTPS, dependendo de sua escolha. Lembre-se que se você ainda não fez as suas configurações SSH, deverá utilizar o protocolo HTTPS. Clique em **OK** a seguir.

![Diálogo Define Remote com o nome origin e a URL SSH do repositório GitLab, e o botão OK destacado](img/fig-2-39.webp)

*Figura 2.39: definindo o remote origin.*

A tela seguinte mostra o remote adicionado. Apenas clique em **OK**.

Agora podemos fazer um **Commit** e um **Push**, o que torna permanentes as alterações em arquivos que fizemos até então, além de enviar todo o conteúdo para o repositório remoto. Dada a existência do arquivo `.gitlab-ci.yml`, o GitLab executará os scripts ali especificados automaticamente. Clique em **Git >> Commit**. Na tela seguinte, indique quais arquivos devem ser tornados permanentes e também enviados ao repositório remoto. Além disso, digite uma mensagem que descreve o commit sendo criado. Por fim, clique em **Commit >> Commit and Push**.

![Janela de commit do IntelliJ com os arquivos selecionados, a mensagem de commit e o botão Commit and Push](img/fig-2-42.webp)

*Figura 2.42: Commit and Push.*

Pode ser que uma tela solicitando a confirmação da operação push seja exibida. Apenas clique em **Push**.

## O primeiro pipeline
Duration: 6:00

Vá até a página inicial do GitLab e clique sobre o nome do seu projeto. Clique em **CI/CD >> Pipelines**. Pode ser que o seu pipeline ainda esteja em execução quando você visitar essa página. Aguarde alguns minutos e clique em atualizar no seu navegador, se necessário.

![Lista de pipelines do projeto com o primeiro pipeline e seu status destacados](img/fig-2-45.webp)

*Figura 2.45: a lista de pipelines.*

O status deve ser **Passed**. Observe que cada pipeline tem um identificador, assim como acontece com os commits. Clique sobre o identificador do pipeline. A tela resultante mostra uma figura que representa o pipeline. Ela pode ser clicada. Vá em frente e clique sobre ela. A figura a seguir mostra o resultado esperado.

![Log do job build no GitLab mostrando o download do Gradle, a execução de ./gradlew build, o upload do artefato build/libs e Job succeeded](img/fig-2-47.webp)

*Figura 2.47: log do job build.*

Clique novamente em **CI/CD >> Pipelines**. Observe que há um botão "três pontinhos" à frente do nome do pipeline. Clicando sobre ele, é possível baixar o artefato produzido. Faça o download e descompacte o arquivo. Você deverá se deparar com um arquivo `.jar`, semelhante àquele que produzimos localmente, usando o IDE.

![Lista de pipelines com o menu de três pontinhos aberto e a opção de download do artefato build destacada](img/fig-2-48.webp)

*Figura 2.48: baixando o artefato.*

## Stage de teste: Ping Pong
Duration: 8:00

Neste próximo passo executaremos o teste Ping Pong, da seguinte forma:

* Definiremos um stage do GitLab próprio para esse teste
* O novo stage possui um Job que executa depois do stage de build
* Quando entra em execução, o novo Job coloca a aplicação para funcionar
* Depois de alguns segundos, o Job dispara uma requisição HTTP usando o `curl`

Faça os ajustes do bloco de código a seguir no arquivo `.gitlab-ci.yml`.

**.gitlab-ci.yml · Bloco de Código 2.8**

```yaml
#nossos stages
stages:
  #primeiro stage se chama build
  - build
  #segundo stage se chama test
  - test

#primeiro job se chama build
build:
  #job build pertence ao stage build
  stage: build
  #imagem docker com java 17 e ferramentas como apt-get
  image: openjdk:17-bullseye
  #o script desse job faz apenas um build usando o gradle
  script:
    - ./gradlew build
  #produto final, acessível por outros stages
  artifacts:
    paths:
      - ./build/libs/

#job para o teste ping pong
teste ping pong:
  stage: test
  image: openjdk:17-bullseye
  script:
    #executando a aplicação (& para executar em background)
    - java -jar ./build/libs/pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar &
    #aguardamos alguns segundos antes de executar o teste, até que o Tomcat esteja pronto
    - sleep 20
    #executamos o curl e entregamos a sua saida ao grep, que busca pelo texto pong
    - curl http://localhost:8080/ping | grep "pong"
```

No IntelliJ, clique novamente **Git >> Commit**. Certifique-se de que o arquivo `.gitlab-ci.yml` está selecionado e digite uma mensagem para o novo Commit. Clique **Commit >> Commit and Push** logo a seguir, assim como fizemos anteriormente.

Visite a página de seu projeto no GitLab e clique em **CI/CD >> Pipelines** novamente. Clique sobre o identificador do pipeline e aguarde até que ambos os stages tenham completado a sua execução. Quando ambos os stages tiverem completado a sua execução, e se tudo tiver corrido bem, ambos deverão ser exibidos em verde, como na figura a seguir.

![Página do pipeline com os stages Build e Test concluídos com sucesso, com o job teste ping pong destacado](img/fig-2-50.webp)

*Figura 2.50: os dois stages concluídos.*

Clique no stage de teste para visualizar o resultado, que deve ser parecido com aquele que a figura a seguir exibe.

![Log do job teste ping pong mostrando a inicialização do Spring Boot, o sleep 20 e a saída do curl contendo pong](img/fig-2-51.webp)

*Figura 2.51: o teste ping pong no pipeline.*

## Elastic Beanstalk: implantação manual
Duration: 15:00

<aside class="negative">

**Nota.** Esta seção é opcional. O uso da computação em nuvem da Amazon tem custos. Eles podem ser consultados em [https://aws.amazon.com/pt/pricing/](https://aws.amazon.com/pt/pricing/) (Link 2.6).

Para criar uma conta, você precisará fornecer um cartão de crédito. Há diversos serviços que podem ser utilizados gratuitamente até um certo limite. Se o limite for excedido, a cobrança passa a ser realizada automaticamente, sem a necessidade de você expressar explicitamente que está de acordo com ela.

Por isso, faça a implantação na Amazon apenas se desejar e se estiver de acordo com as eventuais cobranças. Caso contrário, você pode seguir a aula normalmente, apenas acompanhando o passo a passo realizado pelo professor.

</aside>

### Sobre o Elastic Beanstalk

Visite [https://aws.amazon.com/](https://aws.amazon.com/) (Link 2.7) e crie uma conta AWS para você, caso ainda não possua. Se já possuir, utilize o mesmo link para fazer login.

Os serviços da Amazon podem ser acessados de diferentes formas:

* por meio do console
* por meio de SDKs
* por meio do AWS CLI

Neste material, ele será acessado por meio do **console**, que é a interface gráfica acessível por meio do navegador. Assim que fizer login, é possível que lhe seja oferecida a chance de alterar para a versão mais moderna do console. Clique em **Switch to the new Console Home**.

O serviço que utilizaremos para fazer a implantação se chama **Elastic Beanstalk**. É uma espécie de **PaaS** (*Platform as a Service*) que nos entrega um ambiente próprio para a implantação de acordo com a tecnologia que escolhemos, sem que tenhamos de nos preocupar com detalhes subjacentes. Algumas das características do Beanstalk são:

* O deploy é feito com um simples upload: o Beanstalk se encarrega de ajustar todo o ambiente
* Balanceamento de carga automático
* Escalabilidade automática

Veja mais sobre o serviço em [https://aws.amazon.com/elasticbeanstalk](https://aws.amazon.com/elasticbeanstalk) (Link 2.8).

### Procedimento manual

Para fazer a implantação manual da aplicação, visite o console AWS ([https://console.aws.amazon.com/](https://console.aws.amazon.com/), Link 2.9) e busque por **Beanstalk**, como mostra a figura a seguir. Clique sobre **Elastic Beanstalk**.

![Busca por beanstalk no console AWS com o serviço Elastic Beanstalk destacado nos resultados](img/fig-2-53.webp)

*Figura 2.53: buscando o Elastic Beanstalk.*

Na tela a seguir, clique em **Create Application**. Na tela seguinte, você deverá escolher um nome. Se desejar, o nome pode ser igual ao que utilizamos no IntelliJ e no GitLab, embora não seja obrigatório. Preencha os demais valores da seguinte forma.

* **Application tags**: você pode criar pares chave/valor que servem para identificar recursos alocados por você. Neste momento, não desejamos utilizar; deixe em branco.
* **Platform**: Java
* **Platform Branch**: a mais recente disponível
* **Platform Version**: a mais recente disponível, ou a que estiver marcada como recomendada.
* **Application code**: escolha **Sample application**, apenas para entendermos como o ambiente funciona.

Clique em **Create application**. Veja a figura a seguir.

![Formulário Create a web app do Elastic Beanstalk com nome da aplicação, plataforma Java e Sample application destacados](img/fig-2-55.webp)

*Figura 2.55: criando a aplicação no Beanstalk.*

A alocação dos recursos pode demorar alguns minutos. O Beanstalk fará coisas como

* alocar uma máquina virtual EC2
* alocar um bucket S3 para armazenar dados de configuração
* criar um grupo de escalabilidade automática
* criar um grupo de segurança que representa uma espécie de firewall

entre outras atividades. Quando o processo terminar, a tela resultante deverá ser parecida com aquela exibida pela figura a seguir. Observe que há um link para a sua aplicação. Clique sobre ele para obter uma tela parecida com aquela que a Figura 2.57 exibe.

![Painel do ambiente no Elastic Beanstalk com a saúde Ok, a versão em execução e o link da aplicação no topo](img/fig-2-56.webp)

*Figura 2.56: o ambiente criado.*

![Página Congratulations da aplicação de exemplo do Elastic Beanstalk](img/fig-2-57.webp)

*Figura 2.57: a aplicação de exemplo em execução.*

<aside class="positive">

**Nota.** Na tela do Beanstalk, há uma opção chamada **Environments** no menu que fica à esquerda. Quando clicado, uma lista de ambientes que possuímos é exibida. Um **ambiente** é uma coleção de recursos (máquina virtual, balanceador de carga etc.) alocada pelo Beanstalk a fim de viabilizar a implantação de nossa aplicação. Quando terminar os trabalhos, você pode selecionar o ambiente e clicar **Actions >> Terminate Environment**, como mostra a figura a seguir. Isso fará com que todos os recursos alocados sejam liberados, o que fará com que eventuais cobranças não mais ocorram.

</aside>

![Lista All environments com um ambiente selecionado e o menu Actions aberto na opção Terminate environment](img/fig-2-59.webp)

*Figura 2.59: encerrando um ambiente.*

### Upload da aplicação

Para fazer o upload da aplicação, clique no nome do ambiente. Na tela seguinte, clique em **Upload and deploy**.

![Painel do ambiente com o botão Upload and deploy destacado](img/fig-2-61.webp)

*Figura 2.61: Upload and deploy.*

A seguir, clique em **Choose File** e navegue no seu sistema de arquivos para encontrar o arquivo `.jar` a ser implantado. Lembre-se: ele se encontra na pasta `build` que fica dentro da pasta de seu projeto no IntelliJ. Se necessário, você pode fazer o build novamente usando Gradle. Escolha o arquivo que **não** possui a palavra plain no nome. Como **Version label**, escolha algo como mostra a figura a seguir. Ao final, clique em **Deploy**.

![Diálogo Upload and deploy com o arquivo pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar escolhido e o Version label pessoal_gitlab_api_livros_1](img/fig-2-62.webp)

*Figura 2.62: escolhendo o .jar e a versão.*

## Corrigindo a implantação: Java 11 e porta 5000
Duration: 15:00

### Possíveis falhas: inspecionando os logs

Talvez a implantação tenha falhado, como mostra a figura a seguir. Para descobrir a causa, clique em **Logs**, no menu à esquerda.

![Painel do ambiente com a saúde em estado de erro após a implantação](img/fig-2-63.webp)

*Figura 2.63: a implantação falhou.*

Na tela seguinte, clique em **Request Logs >> Last 100 lines**. A seguir, clique em **Download**.

![Tela Logs do Beanstalk com o menu Request Logs e a opção Last 100 lines destacados](img/fig-2-64.webp)

*Figura 2.64: solicitando os logs.*

Agora será necessário inspecionar o arquivo e tentar encontrar alguma mensagem de erro que ajude. Depois de alguma inspeção, é possível que você encontre uma mensagem parecida com aquelas destacadas pela figura a seguir.

![Trecho do log com UnsupportedClassVersionError indicando que a classe foi compilada por uma versão mais recente do Java do que a disponível no ambiente](img/fig-2-65.webp)

*Figura 2.65: o erro encontrado nos logs.*

Observe que, neste caso, trata-se de um erro Java "comum", que nada tem a ver com o Beanstalk. A mensagem diz que o código foi compilado por um compilador mais moderno do que o ambiente Java que está sendo usado em produção. De fato, isso aconteceu: utilizamos a versão 17 do Java localmente, enquanto o Beanstalk apenas suporta a versão 11.

### Compilando para o Java 11

Para resolver esse problema, volte ao IntelliJ e clique **File >> Project Structure**. Na tela seguinte, mantenha o SDK atual. Entretanto, altere o **Language level** para **11**, como destaca a figura a seguir. Clique em **Apply** e **OK** a seguir.

![Janela Project Structure com o SDK mantido e o Language level alterado para 11](img/fig-2-67.webp)

*Figura 2.67: Language level 11.*

Ainda no IntelliJ, clique em **File >> Settings**. Na tela resultante, clique em **Build, Execution, Deployment >> Java Compiler**. A seguir, configure o **Project bytecode version** como **11**. Finalmente, clique em **Apply** e em **OK**.

![Configurações do Java Compiler com o Project bytecode version definido como 11](img/fig-2-69.webp)

*Figura 2.69: bytecode version 11.*

Agora abra o arquivo `build.gradle` e faça o ajuste do bloco de código a seguir (as linhas `sourceCompatibility` e `targetCompatibility`).

**build.gradle · Bloco de Código 2.9**

```text
plugins {
    id 'org.springframework.boot' version '2.6.2'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
    id 'java'
}

group = 'br.com.bossini'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '11'
targetCompatibility = '11'

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    compileOnly 'org.projectlombok:lombok'
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
    runtimeOnly 'com.h2database:h2'
    annotationProcessor 'org.springframework.boot:spring-boot-configuration-processor'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

test {
    useJUnitPlatform()
}
```

### A porta esperada pelo Beanstalk: 5000

O Beanstalk espera que a aplicação espere por requisições na **porta 5000**. É preciso ajustar esta configuração também. Antes de mais nada, abra o seu arquivo `src/main/resources/application.properties` e certifique-se de que ele não tem a configuração `server.port`.

<aside class="positive">

**Nota.** Esta informação referente à porta usada pelo Beanstalk pode ser encontrada em [https://aws.amazon.com/blogs/devops/deploying-a-spring-boot-application-on-aws-using-aws-elastic-beanstalk/](https://aws.amazon.com/blogs/devops/deploying-a-spring-boot-application-on-aws-using-aws-elastic-beanstalk/) (Link 2.10).

</aside>

A seguir, faça um novo build usando o Gradle, pelo menu à direita. É importante fazer um **clean** e depois o **build**.

Antes de fazer um novo deploy no Beanstalk, visite as configurações de seu ambiente (**Configuration**) e clique na opção **Edit** que fica à frente de **Software**. Na tela seguinte, adicione uma variável chamada `SERVER_PORT` e associe a ela o valor `5000`. Clique em **Apply**.

![Seção Environment properties da configuração de Software com a propriedade SERVER_PORT igual a 5000](img/fig-2-72.webp)

*Figura 2.72: a variável SERVER_PORT.*

Clique em **Environments** e clique sobre o nome do seu ambiente. Na tela seguinte, clique em **Upload and Deploy** e siga o mesmo passo a passo para fazer o upload do novo arquivo `.jar`. A esperança é que o resultado seja parecido com aquele que a figura a seguir exibe. Lembre-se de copiar a URL que aparece na parte superior desta página. Ela dá acesso à aplicação.

![Painel do ambiente com a saúde Ok e a nova versão em execução](img/fig-2-74.webp)

*Figura 2.74: implantação bem-sucedida.*

### Testando a aplicação na AWS com o Postman

Lembre-se que a aplicação não possui uma interface gráfica. Ela possui alguns endpoints que podem ser acessados por meio de requisições HTTP, as quais podemos fazer por meio do Postman, por exemplo. Para fazê-lo, vamos criar um ambiente no Postman. Ele será uma cópia do que temos atualmente. Apenas alteraremos a URL base e a porta. No Postman, para fazer uma cópia do ambiente que temos atualmente, clique **Environments** e clique sobre o nome do ambiente atual. No canto superior direito, clique nos "três pontinhos" e escolha **Duplicate**.

Inclua a palavra **producao** no nome do novo ambiente e altere os valores de suas variáveis, como destaca a figura a seguir.

<aside class="positive">

**Nota.** A porta a ser usada é a **porta 80**. Por segurança, todas as requisições externas são esperadas pelo Beanstalk na porta 80. Internamente são feitos os redirecionamentos necessários para que nosso serviço que opera na porta 5000 seja acionado.

</aside>

![Ambiente de produção no Postman com base_url apontando para o endereço do Elastic Beanstalk e port igual a 80](img/fig-2-76.webp)

*Figura 2.76: o ambiente de produção no Postman.*

Tome o cuidado de não deixar uma `/` como sufixo do endereço da Amazon. Neste exemplo, o endereço é:

```text
http://pessoalgitlabapilivros-env.eba-2mmumhyk.us-east-1.elasticbeanstalk.com
```

Repare que não há uma barra no final. Ela seria um problema pela forma como organizamos as URLs no Postman. Não deixe de salvar as alterações no ambiente apertando **CTRL + S**.

Use o menu na parte superior direita para tornar o novo ambiente ativo. Abra a coleção de testes e realize um teste Ping Pong. Faça também requisições para armazenar novos livros e listar livros existentes.

<aside class="negative">

Quando terminar os testes, lembre-se de **desalocar os recursos** (Actions >> Terminate Environment) para evitar cobranças extras.

</aside>

## Deploy pelo GitLab: bucket S3 e variáveis de grupo
Duration: 15:00

Nesta seção, veremos como fazer a implantação da aplicação de maneira automatizada, utilizando o GitLab. Como mencionado, os serviços AWS podem ser acessados de diferentes formas, dentre elas:

* o console por meio do navegador, como fizemos até então
* o **AWS CLI**, que permite acessar os serviços pela linha de comando
* diversos SDKs que permitem o acesso a serviços utilizando diferentes linguagens de programação.

### AWS CLI

Para fazer a implantação usando o GitLab, vamos utilizar o AWS CLI. Sua página oficial pode ser encontrada em [https://aws.amazon.com/cli/](https://aws.amazon.com/cli/) (Link 2.11). Siga as instruções presentes na página para fazer a sua instalação.

### Upload da aplicação usando o Amazon S3

O **Amazon S3** é um serviço da AWS apropriado para o armazenamento de arquivos. Veja a sua página oficial em [https://aws.amazon.com/s3/](https://aws.amazon.com/s3/) (Link 2.12).

Nesta seção, veremos como fazer o upload da aplicação para um **bucket** do S3. Um bucket é semelhante a uma pasta em um sistema de arquivos, embora tenha muitos outros recursos associados, como poder ser utilizado para a hospedagem de aplicações e mecanismos de segurança.

Visite o console AWS ([https://console.aws.amazon.com/](https://console.aws.amazon.com/), Link 2.13) e busque por **S3**. Clique sobre seu nome. Na tela seguinte, clique em **Buckets >> Create bucket**.

<aside class="positive">

**Nota.** Observe, ainda na tela principal do S3, como já existe um bucket. Ele foi criado a fim de abrigar os arquivos referentes às implantações que fizemos manualmente.

</aside>

![Tela inicial do Amazon S3 com o item Buckets e o botão Create bucket destacados](img/fig-2-80.webp)

*Figura 2.80: criando um bucket.*

Dê um nome para seu bucket e mantenha as demais opções com seu valor padrão. Ao final, clique em **Create bucket**.

![Formulário Create bucket com o campo Bucket name preenchido e a região US East (N. Virginia) us-east-1](img/fig-2-81.webp)

*Figura 2.81: nome do bucket.*

Na tela seguinte, observe que o bucket foi criado com sucesso. Clique sobre seu nome e observe que é possível armazenar arquivos manualmente também. A tela resultante mostra o nome do Bucket.

![Página do bucket pessoal-implantacao-gitlab-api-livros com seu nome destacado e a lista de objetos vazia](img/fig-2-84.webp)

*Figura 2.84: o bucket criado.*

É provável que utilizemos este nome algumas vezes no script de implantação da aplicação, por isso, vamos copiá-lo e armazená-lo em uma **variável de ambiente do GitLab**. Neste momento, copie o nome de seu bucket. Neste exemplo, ele se chama

```text
pessoal-implantacao-gitlab-api-livros
```

### Grupo no GitLab

No GitLab, variáveis podem ser associadas a um projeto específico e também a **grupos**. Um grupo no GitLab pode ser utilizado para, como o nome sugere, agrupar projetos que compartilham recursos como variáveis, permissões de acesso etc.

Vamos criar um grupo no GitLab, adicionar o projeto a ele e adicionar o nome do bucket do S3 como variável de ambiente do grupo. Comece visitando a página inicial do GitLab ([https://gitlab.com/](https://gitlab.com/), Link 2.14). A seguir, clique no botão **+** do topo e em **New group**. Na tela seguinte, clique em **Create group**. Preencha os campos adequadamente e clique em **Create group**.

![Formulário Create group com o nome do grupo, a URL do grupo, a visibilidade Public e o botão Create group destacados](img/fig-2-87.webp)

*Figura 2.87: criando o grupo.*

Após criar o grupo, visite a página inicial do GitLab ([https://gitlab.com/](https://gitlab.com/), Link 2.15) para encontrar o seu projeto. Clique sobre ele e, na tela seguinte, clique em **Settings >> General**. Role a tela um pouco para encontrar a opção **Advanced**. Clique em **Expand**.

Role a tela mais um pouco e encontre a opção **Transfer project**. Clique sobre **Select a new namespace** e clique sobre o nome do grupo criado há pouco. A seguir, clique em **Transfer project**. Veja a figura a seguir.

![Seção Transfer project das configurações avançadas com o novo namespace selecionado e o botão Transfer project](img/fig-2-91.webp)

*Figura 2.91: transferindo o projeto para o grupo.*

Na tela seguinte, basta digitar o nome do projeto e clicar em **Confirm**.

### Atualizando o remote local

Feita esta alteração, o link de acesso ao repositório terá mudado. Por esta razão, será necessário atualizar o link do "remote" armazenado no repositório Git local. Clique no nome do projeto e depois clique em **Clone**. Copie o novo link do projeto. Utilize SSH ou HTTPS, conforme estava utilizando anteriormente.

Abra o IntelliJ e clique em **Git >> Manage Remotes…**. A seguir, clique no nome do remote e, a seguir, na "canetinha" para editar. Veja a figura a seguir.

![Diálogo Git Remotes com o remote origin selecionado (1) e o botão de edição em forma de caneta (2)](img/fig-2-95.webp)

*Figura 2.95: editando o remote.*

Basta colar o link copiado do GitLab e clicar em **OK**. A tela anterior provavelmente permanecerá aberta. Clique em **OK** também.

Se desejar verificar se o novo remote está configurado corretamente, abra um terminal no IntelliJ e use

**Terminal**

```bash
git ls-remote -h git@gitlab.com:pessoal_grupo_gitlab_api_livros/pessoal_gitlab_api_livros.git
```

A figura a seguir mostra onde se encontra o terminal e a resposta esperada. Neste exemplo, você precisa substituir o link usado pelo link de seu próprio repositório.

![Terminal do IntelliJ com o comando git ls-remote -h e a resposta listando o hash da branch remota](img/fig-2-97.webp)

*Figura 2.97: conferindo o novo remote.*

### A variável S3_BUCKET

Agora podemos adicionar o nome do bucket S3 como uma variável de ambiente do grupo a que associamos o projeto. No GitLab, clique em **Menu >> Groups >> Your Groups**. Na tela seguinte, clique no nome do grupo e, depois, em **Settings >> CI/CD**. A seguir, encontre a opção **Variables** e clique em **Expand**.

![Página Settings > CI/CD do grupo com a seção Variables e o botão Expand destacados](img/fig-2-101.webp)

*Figura 2.101: a seção Variables do grupo.*

Clique em **Add variable**. Na tela seguinte, preencha os campos como mostra a figura a seguir e clique em **Add variable**.

![Diálogo Add variable com a chave S3_BUCKET, o valor pessoal-implantacao-gitlab-api-livros e as opções Protect variable e Mask variable desmarcadas](img/fig-2-103.webp)

*Figura 2.103: a variável S3_BUCKET.*

## Stage de deploy com o AWS CLI
Duration: 15:00

O upload da aplicação será feito de forma automatizada, utilizando o GitLab CI para executar os comandos próprios para upload de arquivos no AWS S3. No IntelliJ, abra o arquivo `.gitlab-ci.yml`. Vamos definir um novo stage e um job associado a ele. Eles serão usados para esta fase de implantação. Veja a sua definição no bloco de código a seguir. Dê especial atenção aos comentários. Observe que estamos utilizando uma **imagem Docker própria da Amazon**. Ela possui, por exemplo, o AWS CLI versão 2 já instalado. Se desejar saber mais sobre ela, visite [https://hub.docker.com/r/amazon/aws-cli](https://hub.docker.com/r/amazon/aws-cli) (Link 2.16).

**.gitlab-ci.yml · Bloco de Código 2.10**

```yaml
#lista de stages
stages:
  - build
  - test
  #novo stage para implantação
  - deploy

#job chamado build que pertence ao stage chamado build
build:
  stage: build
  image: openjdk:17-bullseye
  script:
    - ./gradlew build
  artifacts:
    paths:
      - ./build/libs/

#job chamado teste ping pong
teste ping pong:
  stage: test
  image: openjdk:17-bullseye
  script:
    - java -jar ./build/libs/pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar &
    - sleep 20
    - curl http://localhost:8080/ping | grep "pong"

#novo job para implantação
deploy:
  #esse job pertence ao stage deploy
  stage: deploy
  #imagem que possui o AWS CLI, mantida oficialmente pela Amazon
  image:
    name: amazon/aws-cli
  script:
    #us-east-1 região que usamos ao criar o bucket
    - aws configure set region us-east-1
    #copiando o jar para o bucket
    - aws s3 cp ./build/libs/pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar s3://$S3_BUCKET/pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar
```

Façamos um commit/push para verificarmos o resultado. No IntelliJ, clique em **Git >> Commit** e digite uma mensagem. Se aparecer alguma mensagem de "warning", confirme clicando em commit novamente. A seguir, clique em **Git >> Push**. Na tela seguinte, confirme clicando em **Push** mais uma vez.

Agora visite o seu pipeline no GitLab. Lembre-se que, para isso, basta visitar a página do projeto, que neste exemplo é

```text
https://gitlab.com/pessoal_grupo_gitlab_api_livros/pessoal_gitlab_api_livros
```

e clicar em **CI/CD >> Pipelines**. Clique no pipeline no topo da lista. Provavelmente ele ainda estará em execução. Como mostra a figura a seguir, a execução do job de implantação deverá falhar. Clique sobre ela para ver mais detalhes.

![Página do pipeline com build e teste ping pong concluídos e o job deploy com falha, destacado](img/fig-2-108.webp)

*Figura 2.108: o job de deploy falhou.*

### Sobrepondo o entrypoint da imagem

Observe, na figura a seguir, que a imagem da Amazon está configurada para executar o comando `aws` assim que entra em execução. Ocorre que não temos essa necessidade e a sua simples execução sem opções especificadas faz com que ele produza um código de erro, encerrando a execução de nosso script com erro.

![Log do job deploy em que o comando aws é executado sem argumentos e exibe sua mensagem de uso, terminando com erro](img/fig-2-109.webp)

*Figura 2.109: o entrypoint da imagem executa o aws sem argumentos.*

Para resolver esse problema, podemos sobrepor o **entrypoint** da imagem, como mostra o bloco de código a seguir. Estamos no arquivo `.gitlab-ci.yml`, no IntelliJ.

**.gitlab-ci.yml · Bloco de Código 2.11**

```yaml
#lista de stages
stages:
  - build
  - test
  #novo stage para implantação
  - deploy

#job chamado build que pertence ao stage chamado build
build:
  stage: build
  image: openjdk:17-bullseye
  script:
    - ./gradlew build
  artifacts:
    paths:
      - ./build/libs/

#job chamado teste ping pong
teste ping pong:
  stage: test
  image: openjdk:17-bullseye
  script:
    - java -jar ./build/libs/pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar &
    - sleep 20
    - curl http://localhost:8080/ping | grep "pong"

#novo job para implantação
deploy:
  #esse job pertence ao stage deploy
  stage: deploy
  #imagem que possui o AWS CLI, mantida oficialmente pela Amazon
  image:
    name: amazon/aws-cli
    #sobrepõe o entrypoint que faz com que o comando aws seja executado automaticamente
    entrypoint: [""]
  script:
    #us-east-1 região que usamos ao criar o bucket
    - aws configure set region us-east-1
    #copiando o jar para o bucket
    - aws s3 cp ./build/libs/pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar s3://$S3_BUCKET/pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar
```

No IntelliJ, faça novo commit e push. Visite novamente a página de seu projeto no GitLab e encontre a seção de pipelines. A execução deve ter falhado novamente, agora causando o erro exibido pela figura a seguir.

![Log do job deploy com erro de credenciais: Unable to locate credentials ao executar aws s3 cp](img/fig-2-110.webp)

*Figura 2.110: o AWS CLI não encontrou credenciais.*

O que acontece é que tentamos acessar o bucket no S3 sem nos identificarmos.

### Credenciais usando o IAM

**IAM** significa *Identity and Access Management*. Na Amazon, é um serviço que nos permite criar usuários (entre outros objetos) e associar permissões de acesso a eles. Por exemplo, podemos criar um usuário que tenha permissão somente para acessar buckets S3. É isso que desejamos fazer nesta seção. Para tal, visite o console AWS e busque por **IAM**. Clique sobre IAM.

Na tela seguinte, clique em **Users** e, depois, em **Add users**. A seguir

* dê um nome para o usuário
* marque a caixa **Access key - Programmatic access**

e clique em **Next: Permissions**. Veja a figura a seguir.

![Tela Add user do IAM com o nome do usuário e a opção Access key - Programmatic access marcada](img/fig-2-114.webp)

*Figura 2.114: criando um usuário com acesso programático.*

Podemos criar um grupo de permissões específico ou utilizar algo já existente. O que desejamos é permitir que o usuário acesse o S3 e apenas isso: **princípio do menor privilégio**. O acesso ao S3 já possui uma **"policy"** pré-definida. Clique em **Attach existing policies directly** para encontrá-la. Na tela seguinte, busque por S3 e escolha a policy **AmazonS3FullAccess**. Clique em **Next: Tags** a seguir.

![Lista de policies filtrada por S3 com AmazonS3FullAccess marcada](img/fig-2-116.webp)

*Figura 2.116: a policy AmazonS3FullAccess.*

A tela seguinte permite que especifiquemos tags a serem associadas ao usuário sendo criado. São pares chave/valor que podem ajudar a identificar este objeto dentro de um contexto maior. Neste caso, não temos esta necessidade. Por isso, clique em **Next: Review**. A tela seguinte apenas permite que façamos uma última revisão antes de criar o usuário. Clique em **Create user**.

Na tela seguinte, podemos ver um **Access key ID** e a **Secret access key** (clique em show para vê-la). Precisamos copiar estes dois valores para defini-los como variáveis no GitLab. Portanto, copie ambos e guarde em uma aba temporária de um editor de texto qualquer.

<aside class="negative">

Tome bastante cuidado, pois se sair desta página não será mais possível ver a senha novamente. Se ela for perdida, será necessário criar um outro usuário.

</aside>

Agora, visite a página inicial do GitLab novamente ([https://gitlab.com](https://gitlab.com), Link 2.17). Clique em **Menu >> Groups >> Your Groups** para encontrar o grupo a que seu projeto está associado e clique sobre o nome do seu grupo. Na tela seguinte, clique em **Settings >> CI/CD**. Clique em **Expand** ao lado de **Variables** e adicione os dois valores copiados do ambiente AWS. Utilize exatamente os nomes de variáveis `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`: eles são esperados pelo AWS CLI.

<aside class="positive">

**Anotações para o AWS Academy Learner Lab.** No Learner Lab não é possível criar usuários IAM. Na máquina virtual do Learner Lab, execute `cat ~/.aws/config` e `cat ~/.aws/credentials` para obter as variáveis `region`, `aws_access_key_id`, `aws_secret_access_key` e `aws_session_token`. No GitLab, configure-as como variáveis de ambiente, usando exatamente esses nomes, em maiúsculas.

</aside>

Volte à página inicial de seu projeto e clique em **CI/CD >> Pipelines**. A seguir, clique em **Run pipeline**. Assim o pipeline será executado sem que seja necessário fazer um novo commit.

Na tela seguinte, você tem a oportunidade de configurar variáveis de ambiente que serão utilizadas especificamente nesta execução. As que definimos anteriormente serão usadas por padrão. Não temos mais variáveis para especificar no momento, portanto, apenas clique em **Run pipeline**.

![Tela Run pipeline com a branch selecionada, a área de variáveis vazia e o botão Run pipeline](img/fig-2-124.webp)

*Figura 2.124: executando o pipeline manualmente.*

Aguarde até que todos os jobs sejam executados. Se tudo der certo, o resultado deverá ser parecido com o que exibe a figura a seguir. Clique sobre o job de implantação para ver mais detalhes.

![Pipeline com os stages Build, Test e Deploy concluídos com sucesso e o job deploy destacado](img/fig-2-126.webp)

*Figura 2.126: pipeline completo com sucesso.*

![Log do job deploy mostrando aws configure set region us-east-1 e o upload do .jar para s3://pessoal-implantacao-gitlab-api-livros](img/fig-2-127.webp)

*Figura 2.127: o upload para o S3 no log do job.*

Agora, verifique se o seu arquivo foi, de fato, armazenado no S3 da Amazon. Para tal, visite o console da Amazon, busque por S3 e clique sobre o nome de seu bucket. Na tela seguinte, verifique a existência do arquivo. É boa ideia verificar também o seu tamanho. Se ele tiver tamanho 0 MB, certamente aconteceu algo de errado.

![Lista de objetos do bucket com o arquivo pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar e seu tamanho](img/fig-2-130.webp)

*Figura 2.130: o .jar armazenado no bucket.*

## Variáveis no .gitlab-ci.yml e o CI_PIPELINE_IID
Duration: 12:00

### Armazenando o nome da aplicação em uma variável

O nome da aplicação aparece diversas vezes ao longo do código no arquivo `.gitlab-ci.yml`. Pode ser uma boa ideia guardar esse nome numa variável. Podemos fazê-lo como o bloco de código a seguir ilustra. Estamos no arquivo `.gitlab-ci.yml`, no IntelliJ.

**.gitlab-ci.yml · Bloco de Código 2.12**

```yaml
variables:
  #definimos uma variável que armazena o nome do app
  APP_NAME: pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar

#lista de stages
stages:
  - build
  - test
  #novo stage para implantação
  - deploy

#job chamado build que pertence ao stage chamado build
build:
  stage: build
  image: openjdk:17-bullseye
  script:
    - ./gradlew build
  artifacts:
    paths:
      - ./build/libs/

#job chamado teste ping pong
teste ping pong:
  stage: test
  image: openjdk:17-bullseye
  script:
    #usamos a variável aqui
    - java -jar ./build/libs/$APP_NAME &
    - sleep 20
    - curl http://localhost:8080/ping | grep "pong"

#novo job para implantação
deploy:
  #esse job pertence ao stage deploy
  stage: deploy
  #imagem que possui o AWS CLI, mantida oficialmente pela Amazon
  image:
    name: amazon/aws-cli
    #sobrepõe o entrypoint que faz com que o comando aws seja executado automaticamente
    entrypoint: [""]
  script:
    #us-east-1 região que usamos ao criar o bucket
    - aws configure set region us-east-1
    #copiando o jar para o bucket
    #usamos a variável aqui
    - aws s3 cp ./build/libs/$APP_NAME s3://$S3_BUCKET/$APP_NAME
```

Faça um novo commit/push no IntelliJ e verifique o resultado da execução do pipeline para ter certeza de que a alteração funcionou.

### Um identificador único para cada versão

Para que possamos fazer o deploy da aplicação usando o AWS Beanstalk, precisamos fazer duas atividades, tal qual fizemos manualmente.

* A primeira é criar a versão da aplicação.
* A segunda é atualizar o ambiente com a nova aplicação.

Para cada deploy, precisamos de um valor único que sirva de id para aquela versão da aplicação. O próprio GitLab possui diversas variáveis de ambiente que ele utiliza ao longo da execução dos pipelines. Veja [https://docs.gitlab.com/ee/ci/variables/predefined_variables.html](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html) (Link 2.18). Ele mostra a lista de variáveis de ambiente do GitLab.

Procure pelas variáveis `CI_PIPELINE_ID` e `CI_PIPELINE_IID`. Veja seu significado.

* `CI_PIPELINE_ID`: é o identificador do pipeline atual. Valor único para todos os projetos da mesma instância do GitLab.
* `CI_PIPELINE_IID`: é o identificador do pipeline atual, porém é um valor único dentro apenas do projeto atual.

Façamos um breve teste, a fim de verificar os valores que elas assumem a cada execução de um novo pipeline. Ajuste o arquivo `.gitlab-ci.yml` como mostra o bloco de código a seguir. Observe que criamos um stage com um job que exibe os valores das variáveis. Os demais stages e jobs foram comentados temporariamente.

**.gitlab-ci.yml · Bloco de Código 2.13**

```yaml
variables:
  #definimos uma variável que armazena o nome do app
  APP_NAME: pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar
#lista de stages
stages:
  - test_env_variables
  #- build
  #- test
  #novo stage para implantação
  #- deploy

show env variables:
  stage: test_env_variables
  script:
    - echo "ID" $CI_PIPELINE_ID
    - echo "IID" $CI_PIPELINE_IID
#job chamado build que pertence ao stage chamado build
#build:
#  stage: build
#  image: openjdk:17-bullseye
#  script:
#    - ./gradlew build
#  artifacts:
#    paths:
#      - ./build/libs/
#
##job chamado teste ping pong
#teste ping pong:
#  stage: test
#  image: openjdk:17-bullseye
#  script:
#    #usamos a variável aqui
#    - java -jar ./build/libs/$APP_NAME &
#    - sleep 20
#    - curl http://localhost:8080/ping | grep "pong"
#
##novo job para implantação
#deploy:
#  #esse job pertence ao stage deploy
#  stage: deploy
#  #imagem que possui o AWS CLI, mantida oficialmente pela Amazon
#  image:
#    name: amazon/aws-cli
#    #sobrepõe o entrypoint que faz com que o comando aws seja executado automaticamente
#    entrypoint: [""]
#  script:
#    #us-east-1 região que usamos ao criar o bucket
#    - aws configure set region us-east-1
#    #copiando o jar para o bucket
#    #usamos a variável aqui
#    - aws s3 cp ./build/libs/$APP_NAME s3://$S3_BUCKET/$APP_NAME
```

No IntelliJ, clique em **Git >> Commit**. Digite uma mensagem de commit como "testando variáveis ID e IID" e clique **Commit and Push**. Visite a página principal do GitLab ([https://gitlab.com/](https://gitlab.com/), Link 2.19), encontre o seu projeto na lista e clique sobre ele. A seguir, clique em **CI/CD >> Pipelines**, clique sobre o número identificador do pipeline e, depois, sobre o nome do Job. O resultado esperado se parece com aquele exibido pela figura a seguir.

![Log do job show env variables exibindo as linhas ID e IID com seus valores](img/fig-2-135.webp)

*Figura 2.135: os valores de CI_PIPELINE_ID e CI_PIPELINE_IID.*

Ainda nesta tela, clique em **CI/CD >> Pipelines** novamente. No canto superior direito, clique **Run pipeline** e, na tela seguinte, em **Run pipeline**. Basta clicar mais uma vez sobre o nome do job na tela seguinte. Observe que os valores devem ser diferentes, como exibe a figura a seguir.

![Log da segunda execução do job show env variables com valores de ID e IID diferentes dos anteriores](img/fig-2-139.webp)

*Figura 2.139: a cada execução, valores diferentes.*

Assim, podemos usar uma dessas variáveis como versão da aplicação já que, a cada execução de pipeline, elas têm valor diferente. Vamos optar, neste exemplo, pela variável `CI_PIPELINE_IID`, já que ela é um simples contador com escopo limitado ao projeto atual e é suficiente para nosso propósito.

## Deploy no Elastic Beanstalk pelo pipeline
Duration: 20:00

O arquivo `.gitlab-ci.yml` precisa ser ajustado como mostra o bloco de código a seguir. Os ajustes necessários são os seguintes.

* Alterar o `APP_NAME` para que ele inclua o valor da variável `CI_PIPELINE_IID`.
* Criar uma variável que armazena o nome original da aplicação, sem a variável `CI_PIPELINE_IID`.
* Usar o comando `mv` para renomear o arquivo. Ele deixa de ter o nome original e passa a ter o novo nome, incluindo o valor da variável `CI_PIPELINE_IID`.
* Comentar a definição do stage e do job responsáveis por testar as variáveis `CI_PIPELINE_ID` e `CI_PIPELINE_IID`.
* Remover os comentários dos demais stages e jobs.
* Usar o Beanstalk para criar a versão da aplicação
* Usar o Beanstalk para atualizar o ambiente com a nova versão

**.gitlab-ci.yml · Bloco de Código 2.14**

```yaml
variables:
  #nome original
  APP_ORIGINAL_NAME: pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar
  #nome incluindo o valor da variável CI_PIPELINE_IID.
  APP_NAME: pessoal_gitlab_api_livros-v$CI_PIPELINE_IID.jar
#lista de stages
stages:
  # - test_env_variables
  - build
  - test
  #novo stage para implantação
  - deploy

#show env variables:
#  stage: test_env_variables
#  script:
#    - echo "ID" $CI_PIPELINE_ID
#    - echo "IID" $CI_PIPELINE_IID
#job chamado build que pertence ao stage chamado build
build:
  stage: build
  image: openjdk:17-bullseye
  script:
    - ./gradlew build
    #renomeamos com o comando move(mv)
    - mv ./build/libs/$APP_ORIGINAL_NAME ./build/libs/$APP_NAME
  artifacts:
    paths:
      - ./build/libs/

#job chamado teste ping pong
teste ping pong:
  stage: test
  image: openjdk:17-bullseye
  script:
    #usamos a variável aqui
    - java -jar ./build/libs/$APP_NAME &
    - sleep 20
    - curl http://localhost:8080/ping | grep "pong"

#novo job para implantação
deploy:
  #esse job pertence ao stage deploy
  stage: deploy
  #imagem que possui o AWS CLI, mantida oficialmente pela Amazon
  image:
    name: amazon/aws-cli
    #sobrepõe o entrypoint que faz com que o comando aws seja executado automaticamente
    entrypoint: [""]
  script:
    #us-east-1 região que usamos ao criar o bucket
    - aws configure set region us-east-1
    #copiando o jar para o bucket
    #usamos a variável aqui
    - aws s3 cp ./build/libs/$APP_NAME s3://$S3_BUCKET/$APP_NAME
    #criamos uma versão para a aplicação
    - aws elasticbeanstalk create-application-version --application-name $APP_NAME --version-label $CI_PIPELINE_IID --source-bundle S3Bucket=$S3_BUCKET,S3Key=$APP_NAME
    - aws elasticbeanstalk update-environment --application-name $APP_NAME --environment-name="production" --version-label $CI_PIPELINE_IID
```

No IntelliJ, clique em **Git >> Commit**. Escolha uma mensagem para o commit e clique em **Commit and Push**. No GitLab, na página do seu projeto (basta visitar a página principal do GitLab e clicar no seu projeto na lista de projetos), clique em **CI/CD >> Pipelines**. Clique sobre o Pipeline mais recente. É possível que ele ainda esteja em execução.

Quando a execução do pipeline terminar, observe que o job de Deploy falhou. Clique sobre seu nome para descobrir o motivo. Inspecione a figura a seguir.

![Log do job deploy em que aws elasticbeanstalk create-application-version falha com AccessDenied: o usuário IAM não está autorizado a executar elasticbeanstalk:CreateApplicationVersion](img/fig-2-143.webp)

*Figura 2.143: erro AccessDenied.*

Observe que o erro envolve a mensagem **AccessDenied**. O que está acontecendo é que o usuário IAM que criamos não tem permissão para acessar os recursos do Beanstalk. Por enquanto, ele está autorizado apenas a utilizar o S3.

### Permissão para o Beanstalk

Para resolver o problema, visite o console AWS (console.aws.amazon.com, Link 2.20) e busque por **IAM**. Após clicar sobre IAM, clique em **Users** do lado esquerdo. A seguir, clique sobre o nome do seu usuário IAM.

Na tela seguinte, clique em **Add permissions**. A seguir, clique em **Attach existing policies directly**. Busque por beanstalk e escolha **AdministratorAccess-AWSElasticBeanstalk**. Clique em **Next: Review** a seguir. Veja a figura a seguir.

![Tela Add permissions do IAM com Attach existing policies directly e a policy AdministratorAccess-AWSElasticBeanstalk marcada](img/fig-2-146.webp)

*Figura 2.146: a policy AdministratorAccess-AWSElasticBeanstalk.*

Basta clicar em **Add permissions** na tela seguinte.

Na página de seu projeto no GitLab, clique em **CI/CD >> Pipelines**. Clique em **Run pipeline** para executar o pipeline mais uma vez. Como não houve alteração no código, não há necessidade de fazer novo commit/push. Na tela seguinte, clique em **Run pipeline**. Aguarde a execução do pipeline para ver o resultado. Observe que o erro agora potencialmente é outro. Clique sobre o nome do job de deploy para ver aquilo que exibe a figura a seguir.

![Log do job deploy com erro ao criar a versão: a aplicação informada não existe no Elastic Beanstalk](img/fig-2-148.webp)

*Figura 2.148: a aplicação ainda não existe.*

### Criando a aplicação no Beanstalk

Esse erro pode acontecer caso ainda não tenha criado uma aplicação no Elastic Beanstalk. Uma aplicação pode, por exemplo, ser criada uma única vez, manualmente, por meio do console. Depois disso, o comando `create-application-version` do AWS CLI se encarrega de criar versões daquela aplicação.

<aside class="positive">

**Nota.** O comando `create-application` do AWS CLI também pode ser usado para a criação de uma aplicação.

</aside>

Para criar uma aplicação, visite novamente o console AWS (console.aws.amazon.com, Link 2.21). Busque por Beanstalk, clique no serviço **Elastic Beanstalk** e clique em **Create Application**. A tela pode ser um pouco diferente caso já tenha criado uma aplicação. Basta encontrar a opção Create Application. Faça as escolhas destacadas na figura a seguir e clique em **Create application**.

![Formulário de criação da aplicação no Beanstalk com o nome pessoal_gitlab_api_livros, a plataforma Java e Sample application destacados](img/fig-2-150.webp)

*Figura 2.150: criando a aplicação pessoal_gitlab_api_livros.*

Ainda no AWS Console, lembre-se de configurar a porta a que o Tomcat ficará vinculado. O Beanstalk espera utilizar a porta 5000. Para tal, clique em **Configuration** e então no botão **Edit** que fica ao lado da opção **Software**. A seguir, adicione a variável `SERVER_PORT` com o valor `5000` associado. Clique em **Apply**.

![Environment properties com SERVER_PORT igual a 5000](img/fig-2-152.webp)

*Figura 2.152: SERVER_PORT no novo ambiente.*

No IntelliJ, abra o arquivo `.gitlab-ci.yml` e faça os ajustes do bloco de código a seguir (a nova variável `APP_SIMPLE_NAME`, usada no `create-application-version`).

**.gitlab-ci.yml · Bloco de Código 2.15**

```yaml
variables:
  #nome original
  APP_ORIGINAL_NAME: pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar
  #nome incluindo o valor da variável CI_PIPELINE_IID.
  APP_NAME: pessoal_gitlab_api_livros-v$CI_PIPELINE_IID.jar
  #deve ser o mesmo nome escolhido no AWS console
  APP_SIMPLE_NAME: pessoal_gitlab_api_livros
#lista de stages
stages:
  # - test_env_variables
  - build
  - test
  #novo stage para implantação
  - deploy

#show env variables:
#  stage: test_env_variables
#  script:
#    - echo "ID" $CI_PIPELINE_ID
#    - echo "IID" $CI_PIPELINE_IID
#job chamado build que pertence ao stage chamado build
build:
  stage: build
  image: openjdk:17-bullseye
  script:
    - ./gradlew build
    #renomeamos com o comando move(mv)
    - mv ./build/libs/$APP_ORIGINAL_NAME ./build/libs/$APP_NAME
  artifacts:
    paths:
      - ./build/libs/

#job chamado teste ping pong
teste ping pong:
  stage: test
  image: openjdk:17-bullseye
  script:
    #usamos a variável aqui
    - java -jar ./build/libs/$APP_NAME &
    - sleep 20
    - curl http://localhost:8080/ping | grep "pong"

#novo job para implantação
deploy:
  #esse job pertence ao stage deploy
  stage: deploy
  #imagem que possui o AWS CLI, mantida oficialmente pela Amazon
  image:
    name: amazon/aws-cli
    #sobrepõe o entrypoint que faz com que o comando aws seja executado automaticamente
    entrypoint: [""]
  script:
    #us-east-1 região que usamos ao criar o bucket
    - aws configure set region us-east-1
    #copiando o jar para o bucket
    #usamos a variável aqui
    - aws s3 cp ./build/libs/$APP_NAME s3://$S3_BUCKET/$APP_NAME
    #criamos uma versão para a aplicação
    - aws elasticbeanstalk create-application-version --application-name $APP_SIMPLE_NAME --version-label $CI_PIPELINE_IID --source-bundle S3Bucket=$S3_BUCKET,S3Key=$APP_NAME
    - aws elasticbeanstalk update-environment --application-name $APP_NAME --environment-name="production" --version-label $CI_PIPELINE_IID
```

A seguir, faça novo commit/push por meio do IntelliJ. No GitLab, clique em **CI/CD >> Pipelines** na página do seu projeto para ver o resultado. Acompanhe a execução de cada Job. O job de deploy deve ter falhado novamente. O erro deve ser parecido com aquele que exibe a figura a seguir.

![Log do job deploy com a versão criada, mas update-environment falhando porque o ambiente production não existe](img/fig-2-153.webp)

*Figura 2.153: o ambiente production não foi encontrado.*

### O nome do ambiente

O erro está associado ao nome do ambiente do Beanstalk que estamos tentando utilizar. Estamos tentando utilizar um ambiente chamado `production`. Apesar disso, após termos criado a aplicação por meio do console, o nome de seu ambiente padrão é outro. Visite o AWS Console para verificar.

![Menu lateral do Elastic Beanstalk com o nome do ambiente Pessoalgitlabapilivros-env destacado](img/fig-2-154.webp)

*Figura 2.154: o nome real do ambiente.*

Sendo assim, copie o nome do ambiente e abra o arquivo `.gitlab-ci.yml` no IntelliJ para passar a utilizá-lo. Veja o bloco de código a seguir.

**.gitlab-ci.yml · Bloco de Código 2.16**

```yaml
variables:
  #nome original
  APP_ORIGINAL_NAME: pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar
  #nome incluindo o valor da variável CI_PIPELINE_IID.
  APP_NAME: pessoal_gitlab_api_livros-v$CI_PIPELINE_IID.jar
  #deve ser o mesmo nome escolhido no AWS console
  APP_SIMPLE_NAME: pessoal_gitlab_api_livros
  ENV_NAME: Pessoalgitlabapilivros-env
#lista de stages
stages:
  # - test_env_variables
  - build
  - test
  #novo stage para implantação
  - deploy

#show env variables:
#  stage: test_env_variables
#  script:
#    - echo "ID" $CI_PIPELINE_ID
#    - echo "IID" $CI_PIPELINE_IID
#job chamado build que pertence ao stage chamado build
build:
  stage: build
  image: openjdk:17-bullseye
  script:
    - ./gradlew build
    #renomeamos com o comando move(mv)
    - mv ./build/libs/$APP_ORIGINAL_NAME ./build/libs/$APP_NAME
  artifacts:
    paths:
      - ./build/libs/

#job chamado teste ping pong
teste ping pong:
  stage: test
  image: openjdk:17-bullseye
  script:
    #usamos a variável aqui
    - java -jar ./build/libs/$APP_NAME &
    - sleep 20
    - curl http://localhost:8080/ping | grep "pong"

#novo job para implantação
deploy:
  #esse job pertence ao stage deploy
  stage: deploy
  #imagem que possui o AWS CLI, mantida oficialmente pela Amazon
  image:
    name: amazon/aws-cli
    #sobrepõe o entrypoint que faz com que o comando aws seja executado automaticamente
    entrypoint: [""]
  script:
    #us-east-1 região que usamos ao criar o bucket
    - aws configure set region us-east-1
    #copiando o jar para o bucket
    #usamos a variável aqui
    - aws s3 cp ./build/libs/$APP_NAME s3://$S3_BUCKET/$APP_NAME
    #criamos uma versão para a aplicação
    - aws elasticbeanstalk create-application-version --application-name $APP_SIMPLE_NAME --version-label $CI_PIPELINE_IID --source-bundle S3Bucket=$S3_BUCKET,S3Key=$APP_NAME
    - aws elasticbeanstalk update-environment --application-name $APP_NAME --environment-name=$ENV_NAME --version-label $CI_PIPELINE_IID
```

Faça novo commit/push no IntelliJ e clique **CI/CD >> Pipelines** na página de seu projeto no GitLab. Clique no pipeline mais recente e aguarde a execução de todos os jobs. Se tudo funcionar como esperado, o resultado deve ser parecido com aquele exibido pela figura a seguir.

![Pipeline com os jobs build, teste ping pong e deploy concluídos com sucesso](img/fig-2-155.webp)

*Figura 2.155: primeiro deploy com o AWS Beanstalk.*

Se desejar, clique sobre o job de deploy para observar os detalhes de sua execução. O resultado deve ser parecido com o que exibe a figura a seguir.

![Log do job deploy com a saída JSON de create-application-version e de update-environment](img/fig-2-156.webp)

*Figura 2.156: detalhes do job de deploy.*

Visite o AWS Console para obter o link para acesso à sua aplicação.

![Painel do ambiente Pessoalgitlabapilivros-env com o link da aplicação destacado](img/fig-2-157.webp)

*Figura 2.157: o link da aplicação.*

### Testes com o Postman

Abra o Postman, escolha o Workspace em que definiu as coleções de requisições e ative o ambiente de produção. Visite a página de ambientes do Postman e configure a variável `base_url` para que ela armazene o endereço da nova aplicação.

![Ambiente de produção do Postman com base_url atualizada para o endereço do novo ambiente](img/fig-2-159.webp)

*Figura 2.159: atualizando a URL base.*

Não deixe de apertar **CTRL + S** para salvar as alterações feitas no ambiente.

<aside class="negative">

**Nota.** Cuidado para não deixar uma barra ( / ) no final da URL. É preciso removê-la, caso exista.

</aside>

Clique em **Collections** e escolha a requisição de **Teste Ping Pong**. Clique em **Send**. O corpo da resposta deverá exibir o texto `pong`.

![Requisição Teste Ping Pong no ambiente de produção com a resposta pong](img/fig-2-160.webp)

*Figura 2.160: ping pong em produção.*

Armazene dois ou três livros usando a requisição **Salvar Livro** e depois faça a sua listagem com a requisição **Listar Livros**.

## Qualidade de código com PMD
Duration: 20:00

**PMD** é uma ferramenta capaz de realizar **análise estática de código**. Veja a sua página oficial em [https://pmd.github.io/](https://pmd.github.io/) (Link 2.22).

Veja alguns exemplos de verificações que a ferramenta PMD é capaz de realizar de maneira automatizada.

* **AvoidPrintStackTrace**: é considerada boa prática utilizar um framework de log para fazer os logs da aplicação, como o Log4J. Usar `e.printStackTrace` geralmente não é recomendado.
* **AvoidUsingHardCodedIP**: usar endereços IP "chumbados" no código é uma má prática.
* **DefaultLabelNotLastInSwitchStmt**: considera-se boa prática utilizar a cláusula `default` de um switch/case depois de todos os cases.
* **ForLoopCanBeForeach**: se possível, é melhor usar um for/each em vez de um for comum.
* **AtLeastOneConstructor**: toda classe deve definir pelo menos um construtor.
* **BooleanGetMethodName**: métodos getters que devolvem booleano devem ter seu nome iniciando com `is` em vez de `get`.
* **SystemPrintln**: código em produção não deve usar `System.out.println`.
* **UnusedLocalVariable**: variáveis locais declaradas mas não utilizadas.

Veja [https://pmd.github.io/latest/pmd_rules_java.html](https://pmd.github.io/latest/pmd_rules_java.html) (Link 2.23) para a lista completa de regras pré-definidas.

### O arquivo de regras

Para definir as regras de interesse, comece criando um arquivo chamado `pmd-ruleset.xml` na raiz da aplicação. Para tal, clique com o direito sobre o nome do projeto e escolha **New >> File**. O modelo inicial pode ser obtido em [https://pmd.github.io/latest/pmd_userdocs_making_rulesets.html](https://pmd.github.io/latest/pmd_userdocs_making_rulesets.html) (Link 2.24). Assim, o conteúdo inicial de seu arquivo deve ser aquele do bloco de código a seguir.

**pmd-ruleset.xml · Bloco de Código 2.17**

```xml
<?xml version="1.0"?>
<ruleset name="Custom Rules"
         xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd">

    <description>
        Minhas regras
    </description>
</ruleset>
```

Vamos adicionar duas regras de verificação: variáveis locais não utilizadas e o uso do `System.out.println`. Veja o bloco de código a seguir.

**pmd-ruleset.xml · Bloco de Código 2.18**

```xml
<?xml version="1.0"?>
<ruleset name="Custom Rules"
         xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd">

    <description>
        Minhas regras
    </description>

    <rule ref="category/java/bestpractices.xml/SystemPrintln" />
    <rule ref="category/java/bestpractices.xml/UnusedLocalVariable" />
</ruleset>
```

### O plugin PMD do Gradle

A seguir, precisamos configurar o Gradle para que ele faça uso do plugin do PMD. Quando isso é feito, o Gradle tem acesso a novas tarefas, definidas pelo plugin. Abra o arquivo `build.gradle` e faça os ajustes do bloco de código a seguir (o plugin `pmd` e o bloco `pmd { }`).

**build.gradle · Bloco de Código 2.19**

```text
plugins {
    id 'org.springframework.boot' version '2.6.4'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
    id 'java'
    //instala o plugin pmd do Gradle
    id 'pmd'
}
pmd {
    //versão
    toolVersion = "6.44.0"
    //arquivo com as regras
    ruleSetFiles = files("pmd-ruleset.xml")
    //evita usar a configuração de regras padrão
    ruleSets = []
    //deixar o build continuar ainda que regras falhem
    ignoreFailures = false

}
group = 'br.com.bossini'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '11'
targetCompatibility = '11'

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    compileOnly 'org.projectlombok:lombok'
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
    runtimeOnly 'com.h2database:h2'
    annotationProcessor 'org.springframework.boot:spring-boot-configuration-processor'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

### Violando as regras de propósito

Precisamos ajustar o código para que ele viole as duas regras a fim de que possamos ver os resultados do PMD. Abra o arquivo principal de sua aplicação, aquele que define o método `main`. Ajuste o método `main` como mostra o bloco de código a seguir. Observe que agora temos uma variável não utilizada e um uso do `System.out.println`.

**PessoalGitlabApiLivrosApplication.java · Bloco de Código 2.20**

```java
package br.com.bossini.pessoal_gitlab_api_livros;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PessoalGitlabApiLivrosApplication {
    public static void main(String[] args) {
        int a;
        System.out.println("teste PMD");
        SpringApplication.run(PessoalGitlabApiLivrosApplication.class, args);
    }
}
```

No IntelliJ, no canto superior direito, clique em **Gradle** e então clique no botão para atualizar a lista de tarefas.

![Painel Gradle com o botão de recarregar os projetos Gradle destacado](img/fig-2-163.webp)

*Figura 2.163: atualizando a lista de tarefas do Gradle.*

Clique em **other** e clique duas vezes sobre a tarefa **pmdMain**. Ela dispara a execução das regras "contra" código de produção. A tarefa **pmdTest**, por sua vez, dispara a execução de regras "contra" código de teste. Poderíamos, por exemplo, usar regras para verificar se testes unitários estão de acordo com determinados padrões, o que ainda não nos é de interesse.

![Execução da tarefa pmdMain no IntelliJ com a mensagem de que 2 violações de regras do PMD foram encontradas e o link para o relatório](img/fig-2-164.webp)

*Figura 2.164: pmdMain encontrou duas violações.*

Observe que, na parte inferior, onde os resultados são exibidos, apareceu uma mensagem indicando que duas violações de regras foram detectadas. Clique sobre o link e veja o resultado, que deve ser parecido com aquele que a figura a seguir exibe.

![Relatório HTML do PMD listando as violações UnusedLocalVariable e SystemPrintln no arquivo da aplicação](img/fig-2-165.webp)

*Figura 2.165: o relatório do PMD.*

Para executar a task **pmdMain** na linha de comando, no IntelliJ, na parte inferior, clique em **Terminal**. Use

**Terminal**

```bash
./gradlew pmdMain
```

para colocá-la em execução. O resultado deve ser o mesmo.

![Terminal do IntelliJ com ./gradlew pmdMain terminando em BUILD FAILED por 2 violações de regras do PMD](img/fig-2-166.webp)

*Figura 2.166: pmdMain pela linha de comando.*

### PMD no pipeline

Assim, podemos adicionar a checagem de código como parte do pipeline da aplicação. Essas verificações automatizadas têm grande potencial de reduzir os trabalhos manuais realizados pela equipe de QA. Para tal, adicionaremos um novo job ao stage de testes, o qual executará **em paralelo** com o teste de Ping Pong. Abra o arquivo `.gitlab-ci.yml` e faça os ajustes do bloco de código a seguir (o job `teste qualidade de codigo`).

**.gitlab-ci.yml · Bloco de Código 2.21**

```yaml
variables:
  #nome original
  APP_ORIGINAL_NAME: pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar
  #nome incluindo o valor da variável CI_PIPELINE_IID.
  APP_NAME: pessoal_gitlab_api_livros-v$CI_PIPELINE_IID.jar
  #deve ser o mesmo nome escolhido no AWS console
  APP_SIMPLE_NAME: pessoal_gitlab_api_livros
  ENV_NAME: Pessoalgitlabapilivros-env
#lista de stages
stages:
  # - test_env_variables
  - build
  - test
  #novo stage para implantação
  - deploy

#show env variables:
#  stage: test_env_variables
#  script:
#    - echo "ID" $CI_PIPELINE_ID
#    - echo "IID" $CI_PIPELINE_IID
#job chamado build que pertence ao stage chamado build
build:
  stage: build
  image: openjdk:17-bullseye
  script:
    - ./gradlew build
    #renomeamos com o comando move(mv)
    - mv ./build/libs/$APP_ORIGINAL_NAME ./build/libs/$APP_NAME
  artifacts:
    paths:
      - ./build/libs/

#job chamado teste ping pong
teste ping pong:
  stage: test
  image: openjdk:17-bullseye
  script:
    #usamos a variável aqui
    - java -jar ./build/libs/$APP_NAME &
    - sleep 20
    - curl http://localhost:8080/ping | grep "pong"
#job para teste de qualidade de código
teste qualidade de codigo:
  #pertence ao stage de testes
  stage: test
  #imagem com jdk para usar o Gradle
  image: openjdk:17-bullseye
  script:
    #executa a task pmdMain
    - ./gradlew pmdMain
  #o arquivo com os potenciais erros é mantido como artefato
  artifacts:
    #mesmo que falhe - e especialmente quando falhe - queremos esse artefato
    when: always
    paths:
      #basta olhar na estrutura do projeto do IntelliJ para descobrir esse diretório
      - ./build/reports/pmd/

#novo job para implantação
deploy:
  #esse job pertence ao stage deploy
  stage: deploy
  #imagem que possui o AWS CLI, mantida oficialmente pela Amazon
  image:
    name: amazon/aws-cli
    #sobrepõe o entrypoint que faz com que o comando aws seja executado automaticamente
    entrypoint: [""]
  script:
    #us-east-1 região que usamos ao criar o bucket
    - aws configure set region us-east-1
    #copiando o jar para o bucket
    #usamos a variável aqui
    - aws s3 cp ./build/libs/$APP_NAME s3://$S3_BUCKET/$APP_NAME
    #criamos uma versão para a aplicação
    - aws elasticbeanstalk create-application-version --application-name $APP_SIMPLE_NAME --version-label $CI_PIPELINE_IID --source-bundle S3Bucket=$S3_BUCKET,S3Key=$APP_NAME
    - aws elasticbeanstalk update-environment --application-name $APP_NAME --environment-name=$ENV_NAME --version-label $CI_PIPELINE_IID
```

No IntelliJ, faça novo commit/push. Na página de seu projeto no GitLab, clique em **CI/CD >> Pipelines**. Observe como os jobs de teste pertencem ao mesmo stage e executam em paralelo. Ainda que violações de regras tenham sido detectadas, o job de teste de qualidade de código termina com sucesso.

![Pipeline com o stage Test contendo os jobs teste ping pong e teste qualidade de codigo, ambos com sucesso, antes do Deploy](img/fig-2-168.webp)

*Figura 2.168: os dois jobs de teste em paralelo.*

Observe novamente a configuração do plugin PMD no bloco de código a seguir.

**build.gradle · Bloco de Código 2.22**

```text
pmd {
    //versão
    toolVersion = "6.44.0"
    //arquivo com as regras
    ruleSetFiles = files("pmd-ruleset.xml")
    //evita usar a configuração de regras padrão
    ruleSets = []
    //deixar o build continuar ainda que regras falhem
    ignoreFailures = true

}
```

A configuração `ignoreFailures` é muito importante. Se ela for configurada com o valor `false`, o job de build falhará antes mesmo do stage de testes entrar em funcionamento (o `./gradlew build` também executa o PMD). Esse pode ou não ser o comportamento de interesse para o projeto, depende de cada projeto.

<aside class="positive">

Repare que o Bloco de Código 2.19 usa `ignoreFailures = false` e o Bloco de Código 2.22, `ignoreFailures = true`. Para obter o comportamento descrito acima (job de qualidade concluído com sucesso mesmo com violações), use `true`.

</aside>

No GitLab, caso deseje verificar o report com as mensagens de erro sobre as violações de qualidade de código, clique em **CI/CD >> Pipelines** e clique sobre os três pontinhos à frente do pipeline mais recente. Escolha o archive desejado.

![Lista de pipelines com o menu de três pontinhos aberto mostrando os artefatos build e teste qualidade de codigo para download](img/fig-2-169.webp)

*Figura 2.169: baixando o relatório do PMD.*

## Testes unitários com JUnit
Duration: 20:00

### Teste principal já existente: a anotação SpringBootTest

Observe que o projeto possui um arquivo chamado `NomeDaAplicacaoTests` que fica na pasta `src/test/java/pacote`. Este arquivo deve possuir um conteúdo semelhante àquele exibido pelo bloco de código a seguir.

**PessoalGitlabApiLivrosApplicationTests.java · Bloco de Código 3.1.1**

```java
@SpringBootTest
class PessoalGitlabApiLivrosApplicationTests {

    @Test
    void contextLoads() {
    }

}
```

A anotação `SpringBootTest` instrui o Spring Boot a procurar por uma classe anotada com `SpringBootApplication` e utilizá-la para carregar um contexto Spring. Cada método especificado pela classe representa um teste a ser executado. Como o método especificado está vazio, ele serve para testar se o contexto está subindo adequadamente. Para executá-lo, use

**Terminal**

```bash
./gradlew test
```

no terminal do IntelliJ (lembre-se de apertar **CTRL + Enter**). O resultado deve ser parecido com o que exibe a figura a seguir.

![Painel de execução do IntelliJ com o teste contextLoads aprovado e as tarefas do Gradle executadas](img/fig-3-1-1.webp)

*Figura 3.1.1: o teste contextLoads.*

### Um controller para lidar com requisições na raiz e um teste para ele

No seu pacote de controllers (`src/main/java/pacote/controller`) clique com o direito e crie uma classe chamada `HomeController`. Ela será responsável por receber requisições na raiz da aplicação. Veja sua definição no bloco de código a seguir.

**controller/HomeController.java · Bloco de Código 3.2.1**

```java
package br.com.bossini.pessoal_gitlab_api_livros.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public String home(){
        return "hey";
    }
}
```

Faça um teste rápido: abra o arquivo principal (`src/main/java/pacote/NomeAppApplication`), clique com o direito e escolha **Run…**. Volte à classe `HomeController`, clique no globo e escolha a opção **Generate Request in HTTP Client**.

![Menu do globo ao lado do GetMapping no HomeController com a opção Generate request in HTTP Client destacada](img/fig-3-2-1.webp)

*Figura 3.2.1: gerando a requisição para a raiz.*

Na tela resultante, clique no botão verde para executar. O resultado esperado se parece com aquele exibido pela figura a seguir.

![Resposta da requisição GET http://localhost:8080/ com status 200 e corpo hey](img/fig-3-2-3.webp)

*Figura 3.2.3: a resposta hey.*

De volta ao arquivo chamado `NomeDaAplicacaoTests` que fica na pasta `src/test/java/pacote`, vamos instruir o Spring a injetar uma instância de nosso `HomeController` e verificar se ele está sendo de fato instanciado quando a aplicação inicia. Veja o bloco de código a seguir.

**PessoalGitlabApiLivrosApplicationTests.java · Bloco de Código 3.2.2**

```java
package br.com.bossini.pessoal_gitlab_api_livros;

import br.com.bossini.pessoal_gitlab_api_livros.controller.HomeController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
class PessoalGitlabApiLivrosApplicationTests {

    @Autowired
    private HomeController homeController;
    @Test
    void contextLoads() {
        assertThat(homeController).isNotNull();
    }
}
```

Para executar, use `./gradlew test`.

### Testando o conteúdo devolvido pelo HomeController

No próximo teste, vamos incluir a verificação de conteúdo, certificando-nos de que o `HomeController` devolve o texto esperado. Veja os detalhes:

* `webEnvironment = WebEnvironment.RANDOM_PORT`: quando a aplicação estiver sendo executada num ambiente de teste, utilizamos uma porta aleatória.
* `LocalServerPort`: a injeção da porta é feita aqui.
* `TestRestTemplate`: injetamos um objeto desse tipo que é capaz de simular requisições HTTP, particularmente o consumo de Web Services REST.

Para defini-lo, crie um arquivo chamado `ConteudoRaizTest` na mesma pasta de testes (`src/test/java/pacote`).

**ConteudoRaizTest.java · Bloco de Código 3.3.1**

```java
package br.com.bossini.pessoal_gitlab_api_livros;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest (webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ConteudoRaizTest {
    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Test
    public void textoRaizTest() throws Exception{
        assertThat(
            testRestTemplate.getForObject(
                String.format(
                    "http://localhost:%d",
                    port
                ),
                //devolve string
                String.class
            )
        ).contains("hey");
    }

}
```

Como a figura a seguir mostra, há alguns ícones que permitem que os testes do arquivo atual sejam executados sem que seja necessário utilizar a linha de comando. Clicando no ícone ao lado do nome da classe, executamos todos os testes que ela define. Clicando no ícone ao lado do nome de um método, executamos apenas aquele teste.

![Editor com ConteudoRaizTest e os ícones de execução destacados ao lado do nome da classe e do método textoRaizTest](img/fig-3-3-1.webp)

*Figura 3.3.1: ícones para executar os testes.*

Clique no botão ao lado do nome do método e escolha a opção **Run…**. Veja o resultado esperado na figura a seguir.

![Painel de execução com o teste textoRaizTest aprovado](img/fig-3-3-3.webp)

*Figura 3.3.3: o teste passou.*

Troque o texto esperado como mostra o bloco de código a seguir.

**ConteudoRaizTest.java · Bloco de Código 3.3.2**

```java
package br.com.bossini.pessoal_gitlab_api_livros;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest (webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ConteudoRaizTest {
    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Test
    public void textoRaizTest() throws Exception{
        assertThat(
            testRestTemplate.getForObject(
                String.format(
                    "http://localhost:%d",
                    port
                ),
                //devolve string
                String.class
            )
        ).contains("oi");
    }
}
```

Execute o teste novamente e obtenha o resultado exibido pela figura a seguir.

![Painel de execução com o teste textoRaizTest falhando: Expecting actual "hey" to contain "oi"](img/fig-3-3-4.webp)

*Figura 3.3.4: o teste falhou, como esperado.*

Lembre-se de ajustar o texto esperado para que o teste volte a funcionar adequadamente.

### Evitando subir o servidor

O Spring Boot possui um mecanismo que permite que requisições HTTP sejam testadas sem que seja necessário colocar o servidor completo em execução, o que pode ser bastante custoso. Para fazer este novo teste, utilizaremos os seguintes detalhes:

* `MockMvc`: vamos usar para simular o servidor
* `AutoConfigureMockMvc`: viabiliza a injeção de `MockMvc`

Na mesma pasta de testes, crie uma classe chamada `MockConteudoRaizTest`. Veja a sua definição no bloco de código a seguir.

**MockConteudoRaizTest.java · Bloco de Código 3.4.1**

```java
package br.com.bossini.pessoal_gitlab_api_livros;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class MockConteudoRaizTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void textoRaizTest () throws Exception{
        mockMvc
        //realiza a requisição
        .perform(
            get("/")
        )
        //exibe detalhes
        .andDo(print())
        //verifica se o status é igual a 200
        .andExpect(status().isOk())
        //verifica se o corpo da resposta contém a palavra hey
        .andExpect(content().string(containsString("hey")));
    }
}
```

Clique no botão ao lado do nome do método para executar o teste, como feito anteriormente. A figura a seguir mostra o resultado esperado.

![Painel de execução com MockConteudoRaizTest aprovado e a saída de print mostrando a requisição e a resposta simuladas](img/fig-3-4-1.webp)

*Figura 3.4.1: o teste com MockMvc.*

### A task test do Gradle executa todos os testes

Caso deseje executar todos os testes, use

**Terminal**

```bash
./gradlew test
```

no terminal do IntelliJ. Para executar usando o Gradle do próprio IntelliJ, lembre-se de apertar **CTRL + Enter**. Veja o resultado esperado na figura a seguir.

![Painel de execução do IntelliJ com todos os testes da aplicação aprovados](img/fig-3-5-1.webp)

*Figura 3.5.1: todos os testes aprovados.*

## Testes unitários no GitLab CI
Duration: 12:00

A execução dos testes unitários usando o GitLab CI é muito simples: basta executarmos a task `test` do Gradle. Quando ela terminar, precisamos armazenar como artefatos os relatórios produzidos. A figura a seguir mostra onde eles podem ser localizados.

![Árvore do projeto com build/reports/tests contendo o relatório em HTML e build/test-results/test contendo os relatórios específicos do JUnit em XML](img/fig-3-6-1.webp)

*Figura 3.6.1: relatórios em HTML e relatórios do JUnit em XML.*

Veja o novo job criado no arquivo `.gitlab-ci.yml` no bloco de código a seguir. Observe que, para poupar recursos, desabilitamos a execução do stage de deploy na Amazon.

**.gitlab-ci.yml · Bloco de Código 3.6.1**

```yaml
variables:
  #nome original
  APP_ORIGINAL_NAME: pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar
  #nome incluindo o valor da variável CI_PIPELINE_IID.
  APP_NAME: pessoal_gitlab_api_livros-v$CI_PIPELINE_IID.jar
  #deve ser o mesmo nome escolhido no AWS console
  APP_SIMPLE_NAME: pessoal_gitlab_api_livros
  ENV_NAME: Pessoalgitlabapilivros-env
#lista de stages
stages:
  # - test_env_variables
  - build
  - test
  #novo stage para implantação
  #- deploy

#show env variables:
#  stage: test_env_variables
#  script:
#    - echo "ID" $CI_PIPELINE_ID
#    - echo "IID" $CI_PIPELINE_IID
#job chamado build que pertence ao stage chamado build
build:
  stage: build
  image: openjdk:17-bullseye
  script:
    - ./gradlew build
    #renomeamos com o comando move(mv)
    - mv ./build/libs/$APP_ORIGINAL_NAME ./build/libs/$APP_NAME
  artifacts:
    paths:
      - ./build/libs/

#job chamado teste ping pong
teste ping pong:
  stage: test
  image: openjdk:17-bullseye
  script:
    #usamos a variável aqui
    - java -jar ./build/libs/$APP_NAME &
    - sleep 20
    - curl http://localhost:8080/ping | grep "pong"
#job para teste de qualidade de código
teste qualidade de codigo:
  #pertence ao stage de testes
  stage: test
  #imagem com jdk para usar o Gradle
  image: openjdk:17-bullseye
  script:
    #executa a task pmdMain
    - ./gradlew pmdMain
  #o arquivo com os potenciais erros é mantido como artefato
  artifacts:
    #mesmo que falhe - e especialmente quando falhe - queremos esse artefato
    when: always
    paths:
      #basta olhar na estrutura do projeto do IntelliJ para descobrir esse diretório
      - ./build/reports/pmd/

teste unitario:
  #pertence ao stage de testes
  stage: test
  #imagem com jdk para usar o Gradle
  image: openjdk:17-bullseye
  script:
    - ./gradlew test
  artifacts:
    when: always
    paths:
      #relatórios em HTML ficam nessa pasta
      - build/reports/tests
    #relatórios gerados pelo JUnit ficam nessa pasta, em formato XML
    reports:
      junit: build/test-results/test/*.xml

#novo job para implantação
#deploy:
#  #esse job pertence ao stage deploy
#  stage: deploy
#  #imagem que possui o AWS CLI, mantida oficialmente pela Amazon
#  image:
#    name: amazon/aws-cli
#    #sobrepõe o entrypoint que faz com que o comando aws seja executado automaticamente
#    entrypoint: [""]
#  script:
#    #us-east-1 região que usamos ao criar o bucket
#    - aws configure set region us-east-1
#    #copiando o jar para o bucket
#    #usamos a variável aqui
#    - aws s3 cp ./build/libs/$APP_NAME s3://$S3_BUCKET/$APP_NAME
#    #criamos uma versão para a aplicação
#    - aws elasticbeanstalk create-application-version --application-name $APP_SIMPLE_NAME --version-label $CI_PIPELINE_IID --source-bundle S3Bucket=$S3_BUCKET,S3Key=$APP_NAME
#    - aws elasticbeanstalk update-environment --application-name $APP_NAME --environment-name=$ENV_NAME --version-label $CI_PIPELINE_IID
```

Faça commit/push. Na página de seu projeto no GitLab, clique em **CI/CD >> Pipelines** e clique sobre o número do pipeline mais recente na lista. Quando a execução do pipeline terminar, observe que haverá uma nova aba chamada **Tests**, como mostra a figura a seguir.

![Página do pipeline com os jobs teste ping pong, teste qualidade de codigo e teste unitario concluídos e a aba Tests destacada](img/fig-3-6-4.webp)

*Figura 3.6.4: a nova aba Tests.*

Clique na aba e então clique sobre o nome do job de testes. Veja o resultado esperado na figura a seguir.

![Aba Tests com a lista de testes executados, todos aprovados, e seus tempos de execução](img/fig-3-6-6.webp)

*Figura 3.6.6: os testes no GitLab.*

Para voltar à exibição do pipeline, basta clicar na aba **Pipeline**. Clique também sobre o job de teste unitário e, ao lado direito, clique em **Browse**.

![Log do job teste unitario com a seção Job artifacts à direita e o botão Browse destacado](img/fig-3-6-9.webp)

*Figura 3.6.9: navegando pelos artefatos do job.*

A seguir, clique nas pastas **build >> reports >> tests >> test** e clique no arquivo `index.html` para ver um resultado parecido com aquele que ilustra a figura a seguir.

![Relatório HTML do Gradle Test Summary com 100% de sucesso](img/fig-3-6-10.webp)

*Figura 3.6.10: o relatório HTML dos testes.*

## Exercício: preço médio dos livros
Duration: 25:00

I. Adicione a propriedade `preco` (real) à classe `Livro`.

II. Adicione uma funcionalidade que permite obter o valor médio de todos os livros cadastrados na base.

III. Adicione um teste unitário que

* constrói dois livros com preços 200 e 300
* declara uma variável que armazena o preço médio esperado (250)
* faz o cadastro dos dois livros e realiza uma requisição (simulada) a fim de verificar se o preço médio obtido é igual ao esperado.

<details><summary>Ver resposta</summary>

**I. Adicione a propriedade preco (real) à classe Livro.** O bloco de código a seguir mostra a definição da variável solicitada. Observe que as anotações `@Setter` e `@Getter` já garantem a existência dos métodos de acesso e modificadores para essa variável.

**model/Livro.java · Bloco de Código 3.7.1**

```java
package br.com.bossini.pessoal_gitlab_api_livros.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Entity
public class Livro {
    @Id
    @GeneratedValue
    private Long id;
    private String titulo;
    private String autor;
    private int edicao;
    private double preco;
}
```

**II. Adicione uma funcionalidade que permite obter o valor médio de todos os livros cadastrados na base.** A funcionalidade de cálculo de média de preço ficará a cargo do `LivroService`. Veja uma possível implementação no bloco de código a seguir.

**service/LivroService.java · Bloco de Código 3.7.2**

```java
package br.com.bossini.pessoal_gitlab_api_livros.service;

import br.com.bossini.pessoal_gitlab_api_livros.model.Livro;
import br.com.bossini.pessoal_gitlab_api_livros.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LivroService {

    @Autowired
    private LivroRepository livroRepository;
    public void salvar (Livro livro){
        this.livroRepository.save(livro);
    }
    public List<Livro> listar(){
        return this.livroRepository.findAll();
    }

    public double obterPrecoMedio(){
        //listamos a coleção de livros
        //obtemos um fluxo (stream) sequencial sobre o qual operar
        //mapeamos cada livro a um double (seu preço)
        //calculamos a média
        //obtemos o resultado como double
        return
            this.listar()
            .stream()
            .mapToDouble(Livro::getPreco)
            .average()
            .getAsDouble();
    }
}
```

A seguir, criamos um endpoint que dá acesso à nova funcionalidade. Ele fica a cargo do `LivroController`. Veja o bloco de código a seguir.

**controller/LivroController.java · Bloco de Código 3.7.3**

```java
package br.com.bossini.pessoal_gitlab_api_livros.controller;

import br.com.bossini.pessoal_gitlab_api_livros.model.Livro;
import br.com.bossini.pessoal_gitlab_api_livros.service.LivroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping ("/livros")
@RestController
public class LivroController {

    @Autowired
    private LivroService livroService;

    @PostMapping ("/salvar")
    public void salvar (@RequestBody Livro livro){
        this.livroService.salvar(livro);
    }
    @GetMapping
    public List<Livro> listar (){
        return this.livroService.listar();
    }

    @GetMapping("/precoMedio")
    public double getPrecoMedio(){
        return this.livroService.obterPrecoMedio();
    }
}
```

**III. Adicione um teste unitário que constrói dois livros com preços 200 e 300, declara uma variável que armazena o preço médio esperado (250), faz o cadastro dos dois livros e realiza uma requisição (simulada) a fim de verificar se o preço médio obtido é igual ao esperado.** A seguir, implementamos o teste unitário.

* Crie uma classe chamada `PrecoMedioTest` na pasta `src/test/java/pacote`.
* Veja a implementação do teste no bloco de código a seguir.

**PrecoMedioTest.java · Bloco de Código 3.7.4**

```java
package br.com.bossini.pessoal_gitlab_api_livros;

import br.com.bossini.pessoal_gitlab_api_livros.model.Livro;
import br.com.bossini.pessoal_gitlab_api_livros.service.LivroService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class PrecoMedioTest {

    //para simular as requisições
    @Autowired
    private MockMvc mockMvc;

    @Test
    public void test() throws Exception{
        //construção dos dois livros
        Livro l1 = new Livro(1l, "Livro1", "Autor1", 1, 200);
        Livro l2 = new Livro(2l, "Livro1", "Autor1", 1, 300);

        //valor esperado
        double valorMedioEsperado = 250;
        //usamos a biblioteca JACKSON para converter de objeto Java para JSON textual
        ObjectWriter objectWriter = new ObjectMapper().writer();

        //armazenando o primeiro livro
        mockMvc.perform(
            MockMvcRequestBuilders
            .post("/livros/salvar")
            //observe como o método writeValueAsString converte o objeto Java para JSON
            .content(objectWriter.writeValueAsString(l1))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isOk());

        //armazenando o segundo livro
        mockMvc.perform(
            MockMvcRequestBuilders
            .post("/livros/salvar",l2)
            .content(objectWriter.writeValueAsString(l2))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isOk());
        //obtendo o valor médio
        mockMvc
        //realiza a requisição
        .perform(
            get("/livros/precoMedio")
        )
        //isOk: 200 OK
        .andExpect(status().isOk())
        //comparando o resultado obtido com o resultado esperado
        .andExpect(content().string(containsString(Double.toString(valorMedioEsperado))));
    }
}
```

**Executando localmente pela linha de comando.** Caso deseje testar localmente, abra o terminal do IntelliJ e use

**Terminal**

```bash
./gradlew test
```

para executar a bateria de testes. Todos eles serão executados. Lembre-se de apertar **CTRL + Enter** no terminal para usar o Gradle embutido do IntelliJ. Veja o resultado esperado na figura a seguir. Observe que todos os testes terminaram com sucesso.

![Terminal e painel de execução do IntelliJ com todos os testes, incluindo PrecoMedioTest, aprovados](img/fig-3-7-2.webp)

*Figura 3.7.2: todos os testes aprovados.*

**Executando no GitLab.** Para executar remotamente no GitLab, basta fazer um Commit/Push no IntelliJ. Para tal, lembre-se de clicar **Git >> Commit**, escrever uma mensagem de commit e clicar **Commit and Push**.

**Visualizando os testes no GitLab.** Visite a página oficial do seu projeto no GitLab (cujo link deve ser parecido com `https://gitlab.com/pessoal_grupo_gitlab_api_livros/pessoal_gitlab_api_livros/`) e clique **CI/CD >> Pipelines**. A seguir, clique no identificador do último pipeline disponível e na aba **Tests** e averigue os resultados.

![Página do pipeline Testes unitários. Testando a funcionalidade do preço médio, com a aba Tests destacada](img/fig-3-7-5.webp)

*Figura 3.7.5: a aba Tests do pipeline.*

Nesta mesma tela, clique também sobre o teste unitário e clique **Browse**. Navegue pelas pastas e encontre um arquivo chamado `index.html`. Clique sobre ele para ver os resultados.

</details>

## Implantação com Heroku
Duration: 20:00

O **Heroku** é um serviço de computação em nuvem da categoria *Platform as a Service*. Oferece suporte a múltiplas linguagens de programação. Veja a sua página oficial em [https://www.heroku.com/](https://www.heroku.com/) (Link 4.1). Nesta seção, vamos criar um stage para implantar a aplicação no Heroku.

### Criando uma conta e um app no Heroku

Caso ainda não possua uma conta, será necessário criar uma por meio de [https://signup.heroku.com/](https://signup.heroku.com/) (Link 4.1.1). A seguir, faça login na sua conta.

Já no dashboard do Heroku, que pode ser acessado por meio de [https://dashboard.heroku.com/apps](https://dashboard.heroku.com/apps) (Link 4.2.1), podemos criar um aplicativo, o que é necessário para a implantação. Para criar a aplicação, clique **New >> Create new app** como na figura a seguir.

![Dashboard do Heroku com o menu New aberto e a opção Create new app destacada](img/fig-4-2-1.webp)

*Figura 4.2.1: criando um app no Heroku.*

Escolha um nome para o app (que deve começar com uma letra minúscula) e clique **Create app**.

![Formulário Create New App do Heroku com o nome do app disponível e a região United States](img/fig-4-2-2.webp)

*Figura 4.2.2: nome do app.*

Anote em uma aba auxiliar o nome da sua aplicação criada no Heroku, usando um editor de texto simples qualquer. Daqui a pouco vamos configurá-lo como variável de ambiente no GitLab.

### A API Key do Heroku

Para fazer a implantação de nossa aplicação, vamos precisar da **API Key** do Heroku. Detentores desta chave podem utilizá-la para se autenticar e realizar operações na sua conta. Para obtê-la, clique no seu perfil no canto superior direito e escolha **Account settings**. Role a página até encontrar **API Key**. Clique **Reveal** e copie a chave, guardando-a na mesma aba auxiliar em que você guardou o nome da aplicação.

<aside class="positive">

**Nota.** Se você alterar a senha da sua conta, pode ser necessário gerar uma nova chave.

</aside>

### Configurando as variáveis de ambiente no GitLab

O próximo passo consiste em adicionar o nome da aplicação e a chave como variáveis de ambiente no GitLab. Para tal, visite a página principal do grupo do GitLab que abriga o seu projeto: na página inicial do GitLab, clique em **Menu >> Groups >> Your Groups**. Na tela seguinte, clique sobre o nome do seu grupo. Depois disso, clique em **Settings >> CI/CD**.

E então clique em **Expand** próximo de **Variables**. Clique em **Add Variable** e adicione o nome de sua aplicação Heroku, como mostra a figura a seguir. Clique em **Add Variable** depois de preencher.

![Diálogo Add variable com a chave HEROKU_APP_NAME e o nome do app Heroku como valor](img/fig-4-4-3.webp)

*Figura 4.4.3: a variável HEROKU_APP_NAME.*

Siga os mesmos passos para adicionar a sua API Key do Heroku como variável de ambiente no GitLab, com a chave `HEROKU_API_KEY`.

### Deploy com DPL

**DPL** é o nome de uma ferramenta usada pelo Travis CI (que é um serviço de integração contínua) capaz de fazer a implantação de aplicações em diferentes ambientes. Veja a sua página oficial em [https://github.com/travis-ci/dpl](https://github.com/travis-ci/dpl) (Link 4.5.1).

Nesta seção, vamos fazer uso desta ferramenta para fazer a implantação de nossa aplicação no Heroku. Veja também [https://docs.gitlab.com/ee/ci/examples/deployment/](https://docs.gitlab.com/ee/ci/examples/deployment/) (Link 4.5.2), em que a documentação do GitLab cita a ferramenta DPL.

### Heroku usa o Java 8 por padrão: o arquivo system.properties

O Heroku usa, por padrão, a versão 8 do Java. Isso está documentado em [https://devcenter.heroku.com/articles/java-support#specifying-a-java-version](https://devcenter.heroku.com/articles/java-support#specifying-a-java-version) (Link 4.5.3).

Anteriormente configuramos a nossa aplicação para que ela fizesse uso do Java versão 11. Por isso, vamos criar um arquivo chamado `system.properties` na raiz do projeto no qual podemos instruir o Heroku a usar a versão 11. Para criá-lo, clique com o direito na raiz do projeto e escolha **New File**. Dê o nome `system.properties` a ele. Seu conteúdo aparece no bloco de código a seguir.

**system.properties · Bloco de Código 4.5.1**

```ini
java.runtime.version=11
```

Se necessário, observe a figura a seguir para entender como ficou a estrutura do projeto.

![Árvore do projeto no IntelliJ com o arquivo system.properties na raiz, ao lado de build.gradle e pmd-ruleset.xml](img/fig-4-5-1.webp)

*Figura 4.5.1: system.properties na raiz do projeto.*

### Gerando apenas o .jar completo

Por padrão, o Gradle gera dois arquivos `.jar` (especificamente em projetos Spring Boot). Um deles leva **plain** no nome e é um arquivo que contém somente o código compilado, sem as bibliotecas necessárias para a execução. O outro é completo. Ocorre que o Heroku, por padrão, tenta executar todos os arquivos `.jar` que ele encontra na pasta `build/libs`, o que vai causar um erro já que esse arquivo não pode ser executado. Leia mais sobre a geração destes arquivos em [https://docs.spring.io/spring-boot/docs/current/gradle-plugin/reference/htmlsingle/#packaging-executable.and-plain-archives](https://docs.spring.io/spring-boot/docs/current/gradle-plugin/reference/htmlsingle/#packaging-executable.and-plain-archives) (Link 4.5.4).

O bloco de código a seguir mostra como instruir o Gradle a deixar de gerar o arquivo `.jar` plain (o bloco `jar { enabled = false }`). Estamos no arquivo `build.gradle`.

**build.gradle · Bloco de Código 4.5.2**

```text
plugins {
    id 'org.springframework.boot' version '2.6.4'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
    id 'java'
    //instala o plugin pmd do Gradle
    id 'pmd'
}
pmd {
    //versão
    toolVersion = "6.44.0"
    //arquivo com as regras
    ruleSetFiles = files("pmd-ruleset.xml")
    //evita usar a configuração de regras padrão
    ruleSets = []
    //deixar o build continuar ainda que regras falhem
    ignoreFailures = true

}
group = 'br.com.bossini'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '11'
targetCompatibility = '11'

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

jar {
    enabled = false
}

dependencies {
    // https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    compileOnly 'org.projectlombok:lombok'
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
    runtimeOnly 'com.h2database:h2'
    annotationProcessor 'org.springframework.boot:spring-boot-configuration-processor'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'

}

tasks.named('test') {
    useJUnitPlatform()
}
```

### Novo stage no arquivo .gitlab-ci.yml

Para fazer a implantação, vamos adicionar um stage ao arquivo `.gitlab-ci.yml`. A ferramenta DPL é distribuída como um **gem do Ruby**. Por isso, vamos usar uma imagem que possui o Ruby. Veja o bloco de código a seguir. Observe que o Heroku se encarregará de todo o processo, inclusive do build. Por isso, para testar apenas a implantação no Heroku vamos comentar os outros stages.

**.gitlab-ci.yml · Bloco de Código 4.5.3**

```yaml
variables:
  #nome original
  APP_ORIGINAL_NAME: pessoal_gitlab_api_livros-0.0.1-SNAPSHOT.jar
  #nome incluindo o valor da variável CI_PIPELINE_IID.
  APP_NAME: pessoal_gitlab_api_livros-v$CI_PIPELINE_IID.jar
  #deve ser o mesmo nome escolhido no AWS console
  APP_SIMPLE_NAME: pessoal_gitlab_api_livros
  ENV_NAME: Pessoalgitlabapilivros-env
#lista de stages
stages:
  # - test_env_variables
  # - build
  # - test
  #novo stage para implantação
  #- deploy
  - deploy_heroku

# job para implantação no Heroku
implantacao no heroku:
  stage: deploy_heroku
  #usamos a imagem ruby oficial para poder obter o DPL
  image: ruby
  before_script:
    - gem install dpl
  script:
    - dpl --provider=heroku --app=$HEROKU_APP_NAME --api_key=$HEROKU_API_KEY

##a partir daqui, tudo está comentado
```

Os demais jobs (`build`, `teste ping pong`, `teste qualidade de codigo`, `teste unitario` e `deploy`) continuam no arquivo, todos comentados.

A seguir, clique em **Git >> Commit >> Commit and Push** no IntelliJ. Isso fará com que um novo pipeline entre em execução. Visite a página de seu projeto no GitLab e clique em **CI/CD >> Pipelines**. Clique, então, no ID do último pipeline executado. A figura a seguir mostra que nosso pipeline tem apenas um stage com um único job, já que comentamos todos os demais. Clique sobre o nome do job.

![Página do pipeline Deploy Heroku com DPL com um único stage Deploy_heroku e o job implantacao no heroku concluído](img/fig-4-5-3.webp)

*Figura 4.5.3: o pipeline com um único job.*

Observe que há um link. Ele dá acesso à aplicação. Veja a figura a seguir.

![Log do job implantacao no heroku com a instalação do dpl, o build feito pelo Heroku e, ao final, o link da aplicação destacado](img/fig-4-5-4.webp)

*Figura 4.5.4: o link da aplicação no Heroku.*

Copie e cole no seu navegador. O resultado deve ser uma página com o texto **"hey"**, já que esse é o conteúdo devolvido pelo nosso `HomeController`.

## Parabéns!
Duration: 3:00

Você construiu um pipeline completo no GitLab CI para uma API Spring Boot:

* **build** com o Gradle, guardando o `.jar` como artefato
* **testes** em paralelo: ping pong com `curl`, qualidade de código com PMD e testes unitários com JUnit, com relatórios na aba Tests
* **deploy** no AWS Elastic Beanstalk via S3 e AWS CLI, com credenciais IAM em variáveis de grupo e versões identificadas por `CI_PIPELINE_IID`
* **deploy** alternativo no Heroku com DPL

<aside class="negative">

Lembre-se de encerrar os ambientes do Elastic Beanstalk e remover recursos que não usa mais (buckets, usuários IAM) para evitar cobranças.

</aside>

### Referências

* GitLab SSH: [https://docs.gitlab.com/ee/ssh/](https://docs.gitlab.com/ee/ssh/)
* Variáveis predefinidas do GitLab: [https://docs.gitlab.com/ee/ci/variables/predefined_variables.html](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)
* Elastic Beanstalk: [https://aws.amazon.com/elasticbeanstalk](https://aws.amazon.com/elasticbeanstalk)
* AWS CLI: [https://aws.amazon.com/cli/](https://aws.amazon.com/cli/)
* Imagem Docker amazon/aws-cli: [https://hub.docker.com/r/amazon/aws-cli](https://hub.docker.com/r/amazon/aws-cli)
* PMD: [https://pmd.github.io/](https://pmd.github.io/)
* DPL: [https://github.com/travis-ci/dpl](https://github.com/travis-ci/dpl)
* Heroku: [https://www.heroku.com/](https://www.heroku.com/)
