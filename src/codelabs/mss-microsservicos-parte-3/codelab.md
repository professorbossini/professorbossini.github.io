summary: Conheça a arquitetura do Kubernetes, pratique com o kubectl (Deployments, Pods, Services, rótulos, escalabilidade e rolling updates) e implante os microsserviços de lembretes e o barramento de eventos no cluster com arquivos de configuração, imagens no Docker Hub e serviços NodePort e ClusterIP.
id: mss-microsservicos-parte-3
categories: Microsserviços,Kubernetes,Docker
tags: microsservicos,kubernetes,kubectl,minikube,docker,docker hub,deployment,pod,service,nodeport,clusterip,rolling update,yaml
status: Published
authors: Rodrigo Bossini
last updated: 2022-09-05
pdf: microsservicos/01_apostila_microsservicos.pdf
feedback link: https://github.com/professorbossini/professorbossini.github.io/issues

# Microsserviços, parte 3: orquestração com Kubernetes

## Visão geral
Duration: 3:00

Este codelab é a **parte 3 de 3** da apostila *Arquiteturas de Sistemas Computacionais*. Na parte 2, cada microsserviço da aplicação de lembretes passou a ser executado em um contêiner Docker. Agora você vai usar o **Kubernetes** para gerenciar esses contêineres.

### O que você vai aprender

* O que é o Kubernetes e como é a sua arquitetura (control plane, nós, Pods)
* Como habilitar o Kubernetes no Docker Desktop ou instalar o Minikube
* Como usar o `kubectl` para criar *Deployments*, inspecionar Pods, ver logs e executar comandos em contêineres
* Como usar *Go templates* para extrair informações da saída do `kubectl`
* O que são serviços (ClusterIP, NodePort e LoadBalancer), rótulos e seletores
* Como escalar uma aplicação, testar o balanceador de carga e fazer *rolling updates* e *rollbacks*
* Como definir Pods, Deployments e Services com arquivos de configuração YAML
* Como publicar imagens no Docker Hub e atualizar Deployments
* Como fazer microsserviços se comunicarem dentro do cluster

### O que você vai precisar

* Ter concluído as **partes 1 e 2** (codelabs `mss-microsservicos-parte-1` e `mss-microsservicos-parte-2`), com os `Dockerfile` dos microsserviços prontos
* **Docker Desktop** com Kubernetes habilitado (Windows) ou **Minikube** (Linux e MacOS)
* Uma conta gratuita no **Docker Hub**
* O **Postman** ou outro cliente HTTP, e o `curl`

## Kubernetes
Duration: 12:00

O uso de contêineres traz as diversas vantagens mencionadas. Entretanto, gerenciar a sua execução, em particular em um ambiente distribuído em que a demanda por processamento varia significativamente, pode se tornar bastante trabalhoso. É aí que entra o uso do **Kubernetes**. Segundo a documentação oficial, que pode ser acessada em [https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/), **o Kubernetes é uma plataforma para o gerenciamento de serviços que facilita a configuração declarativa e a automação**.

<aside class="positive">

**Nota.** O nome Kubernetes tem origem grega e significa algo como *timoneiro, homem do leme, tripulante responsável pela navegação*. A ideia é defini-lo como o **responsável pela condução de uma embarcação de contêineres**.

</aside>

<aside class="positive">

**Nota.** O Kubernetes foi criado pelo Google. Hoje ele é mantido pela **Cloud Native Computing Foundation**. Acesse a sua página oficial em [https://www.cncf.io/](https://www.cncf.io/).

</aside>

A figura a seguir ilustra algumas das funcionalidades providas pelo Kubernetes.

![Ilustração do Kubernetes como timoneiro que recebe requisições de alta demanda do cliente e as distribui entre contêineres, com balanceamento de carga, substituição de contêineres com falha e armazenamento](img/p092-1.webp)

*O Kubernetes como "timoneiro" dos contêineres.*

Quando colocamos o Kubernetes em execução, obtemos um **cluster**. Um cluster é um conjunto de **máquinas trabalhadoras** (do inglês *worker machines*) que executam aplicações em contêineres. Todo cluster possui, pelo menos, uma máquina trabalhadora.

### Arquitetura do Kubernetes

A arquitetura do Kubernetes é composta por

* Uma **máquina trabalhadora** que executa **Pods**. Máquinas trabalhadoras são também chamadas de **nós**. Elas podem ser máquinas físicas ou virtuais.
* Um **Pod** é um conjunto de contêineres em execução.
* O **control plane** é a camada de orquestração que expõe uma API por meio da qual é possível implantar e gerenciar contêineres. Em ambiente de produção, a sua execução comumente é realizada por vários computadores, o que traz tolerância a falhas e alta disponibilidade.

Veja a figura a seguir.

![Diagrama oficial dos componentes de um cluster Kubernetes: o control plane com kube-apiserver, etcd, scheduler, controller manager e cloud controller manager, e os nós com kubelet e kube-proxy executando Pods](img/p093-1.webp)

*Componentes do Kubernetes. Fonte: https://kubernetes.io/docs/concepts/overview/components/*

### Detalhes sobre o control plane

O **control plane** é constituído por

* **kube-apiserver** Desempenha o papel de *front end* do control plane, expondo a API do Kubernetes.
* **etcd** Mecanismo de armazenamento baseado em pares chave/valor. Usado para armazenar dados referentes ao funcionamento do cluster.
* **kube-scheduler** Responsável por detectar novos Pods para os quais um nó ainda não foi alocado e providenciar a alocação.
* **kube-controller-manager** Executa *controllers*. Um *controller* verifica constantemente o estado do cluster e executa ações necessárias para alterar seu estado atual, levando-o para o estado desejado. Um exemplo de *controller* é o **Node controller**. Ele é responsável por informar quando um nó se torna inoperante.
* **cloud-controller-manager** É um tipo de control plane que viabiliza a conexão entre o cluster do Kubernetes e um provedor de computação em nuvem. Ele separa os componentes que interagem com o provedor de nuvem daqueles que interagem somente com o cluster local.

### Detalhes sobre os nós

Um nó ou máquina virtual, por sua vez, possui os seguintes componentes.

* **kubelet** Responsável por garantir que os contêineres estão em execução em um Pod, de acordo com especificações obtidas em **PodSpecs**. Um kubelet não se preocupa com contêineres em execução que eventualmente não tenham sido criados pelo Kubernetes.
* **kube-proxy** Implementa a ideia de **Service** do Kubernetes. Trata-se de uma maneira de expor um conjunto de Pods como um serviço em rede.
* **Container runtime** É o software responsável por executar os contêineres. Hoje o Docker é certamente o mais utilizado. Entretanto, qualquer um que implemente a especificação [CRI](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md) pode ser utilizado.

## Instalação do Kubernetes
Duration: 10:00

### Windows

A instalação do Kubernetes varia em função do sistema operacional utilizado. Para o **Windows**, basta instalar o **Docker Desktop**. Ele inclui uma implementação do Kubernetes que pode ser executada localmente. É preciso habilitar o uso do Kubernetes por meio da interface gráfica do Docker. Clique no ícone que fica na "system tray" do sistema operacional e então clique no botão **Settings**, como na figura a seguir.

![Menu do Docker Desktop aberto a partir da system tray, com o botão de configurações destacado](img/p095-1.webp)

*Abrindo as configurações do Docker Desktop.*

A seguir, clique na opção **Kubernetes**, marque a caixa **Enable Kubernetes** e clique **Apply & Restart**, como na figura a seguir.

![Configurações do Docker Desktop na opção Kubernetes, com a caixa Enable Kubernetes marcada e o botão Apply & Restart destacados](img/p096-1.webp)

*Habilitando o Kubernetes no Docker Desktop.*

O download da implementação do Kubernetes será iniciado e o Docker Desktop será reiniciado quando a instalação estiver concluída.

### Linux e MacOS

Caso esteja utilizando **Linux** ou **MacOS**, uma opção é fazer a instalação do **Minikube**. O procedimento é muito simples. Há pacotes oficiais apropriados para os dois sistemas operacionais. Siga as instruções disponíveis em [https://minikube.sigs.k8s.io/docs/start/](https://minikube.sigs.k8s.io/docs/start/).

## Hello, Kubernetes!
Duration: 10:00

Nesta seção utilizaremos diversos comandos do Kubernetes a fim de ilustrar o seu uso básico.

### Checando versões

Use

**Terminal**

```bash
kubectl version
```

para verificar a versão do cliente e do servidor. O cliente é o próprio `kubectl`. Ele é um cliente de linha de comando que permite acesso a clusters Kubernetes. O servidor, por outro lado, é o cluster Kubernetes.

### Visualizando máquinas trabalhadoras (nós)

Execute

**Terminal**

```bash
kubectl get nodes
```

para exibir os nós (máquinas trabalhadoras) disponíveis no cluster. Caso seja a sua primeira instalação do Kubernetes, provavelmente você verá um único nó, como mostra o resultado a seguir.

**Terminal**

```text
C:\Users\rodri>kubectl get nodes
NAME             STATUS   ROLES    AGE   VERSION
docker-desktop   Ready    master   72m   v1.19.7
```

### Forma geral de uso do kubectl

Digite apenas

**Terminal**

```bash
kubectl
```

para ver as formas como o `kubectl` pode ser utilizado. A forma geral é

```text
kubectl ação recurso
```

Para obter ajuda sobre um comando específico, use

**Terminal**

```bash
kubectl get nodes --help
```

### Criando um Deployment

A fim de implantar uma aplicação usando o Kubernetes, criamos uma configuração de **Deployment** que o instrui sobre como criar e atualizar instâncias da aplicação. Uma vez criado um Deployment, o **control plane** produz instâncias da aplicação que serão executadas em diferentes nós. Um **controller de Deployment** monitora cada instância. Se algum nó ficar inoperante e comprometer o funcionamento de uma instância da aplicação, esse *controller* se encarrega de colocar em execução uma nova instância dela em outro nó disponível. Use

**Terminal**

```bash
kubectl create deployment meu-primeiro-deployment --image=gcr.io/google-samples/kubernetes-bootcamp:v1
```

para criar seu primeiro Deployment.

<aside class="positive">

**Nota.** `gcr.io/google-samples/kubernetes-bootcamp:v1` é uma imagem que possui um servidor web simples que simplesmente devolve a requisição que recebeu.

</aside>

A seguir, verifique quais Deployments você possui com

**Terminal**

```bash
kubectl get deployments
```

O resultado deve ser parecido com o seguinte.

**Terminal**

```text
C:\Users\rodri>kubectl get deployments
NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
meu-primeiro-deployment   1/1     1            1           7m9s
```

## Pods: proxy, nomes, logs e comandos
Duration: 15:00

### Proxy para acesso aos Pods

A aplicação está em execução em um contêiner Docker. Cada contêiner sob controle do Kubernetes executa dentro de um **Pod**. Por padrão, Pods executam em uma rede privada, isolada do mundo externo. O `kubectl` pode criar um **proxy** entre a rede interna do cluster e o mundo externo com

**Terminal**

```bash
kubectl proxy
```

O resultado deve ser parecido com o seguinte.

**Terminal**

```text
C:\Users\rodri>kubectl get deployments
NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
meu-primeiro-deployment   1/1     1            1           5h32m

C:\Users\rodri>kubectl proxy
Starting to serve on 127.0.0.1:8001
```

Abra o Postman e faça uma requisição na porta exibida (`8001`). A saída deve ser parecida com a figura a seguir.

![Postman com um GET em localhost:8001 e a resposta JSON com a lista de caminhos (paths) da API do Kubernetes destacada](img/p099-1.webp)

*A API do cluster acessível pelo proxy.*

Cada linha do resultado é um endpoint para o qual requisições podem ser direcionadas. O Kubernetes gera um endpoint para cada Pod com base em seu nome.

### Nomes de Pods com Go templates

Vamos extrair o nome do Pod existente e guardar em uma variável de ambiente para uso futuro. O comando `kubectl get pods` traz uma quantidade bastante grande de informações sobre os Pods. Use

**Terminal**

```bash
kubectl get pods -o json
```

(ou `yaml`, se preferir) para visualizar todos os campos disponíveis. A saída deve ser parecida com o que exibe a figura a seguir.

![Trecho da saída JSON do kubectl get pods com apiVersion, items, metadata, name, labels e spec](img/p100-2.webp)

*Saída do kubectl get pods em JSON.*

Estude a estrutura do JSON e verifique que ele possui uma coleção associada à chave `items`. Cada item na lista é um Pod. Cada um deles possui um objeto JSON associado a uma chave chamada `metadata`. Entre muitas chaves, o objeto em questão possui uma chamada `name`. Ela está associada ao nome de cada Pod. Para extrair essa e outras informações de interesse em um formato específico, podemos utilizar um **Go template**. Veja a sua documentação oficial em [https://golang.org/pkg/text/template/](https://golang.org/pkg/text/template/).

Antes de prosseguir, vejamos alguns exemplos de uso de Go templates envolvendo a saída do `kubectl`.

* `kubectl get pods -o go-template='"Hello, Go templates!"'` - Ignora o que o `kubectl` produz e apenas mostra o texto especificado.
* `kubectl get pods -o go-template='{{.apiVersion}}'` - extrai o valor associado à chave `apiVersion`, existente na saída produzida pelo `kubectl`. O caractere `.` que precede o nome da propriedade é fundamental. Se ele for omitido, `apiVersion` será considerada uma tentativa de chamada de função. Note que `{{}}` é usado para avaliar expressões.
* `kubectl get pods -o go-template='{{.items}}'` - extrai os dados de todos os itens de uma só vez.
* `kubectl get pods -o go-template='{{range .items}}{{.metadata}}{{end}}'` - usa a função `range` para iterar sobre a coleção `items`. Exibe o objeto associado à chave `metadata` de cada Pod.
* `kubectl get pods -o go-template='{{range .items}}{{.metadata.name}}{{end}}'` - Exibe o nome de cada Pod. `{{end}}` encerra a repetição criada por `range`.

Como temos um único Pod no momento, vamos usar

**Terminal**

```text
kubectl get pods -o go-template='{{range .items}}{{.metadata.name}}{{end}}'
set POD_NAME=nome_obtido_aqui //Windows
export POD_NAME=nome_obtido_aqui //Unix-like
echo %POD_NAME% //Windows, para testar
echo $POD_NAME //Unix-like, para testar
```

para guardar o seu nome em uma variável de ambiente.

### Enviando requisições a um Pod

Execute

**Terminal**

```text
curl http://localhost:8001/api/v1/namespaces/default/pods/%POD_NAME% //Windows
curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME //Unix-like
```

para obter detalhes do Pod. Também é possível fazer essa requisição usando o Postman ou o navegador.

### Logs de um Pod

Use

**Terminal**

```text
kubectl logs %POD_NAME% //Windows
kubectl logs $POD_NAME //Unix-like
```

para visualizar os logs do seu Pod.

### Executando comandos "dentro" de um contêiner

Podemos executar comandos "dentro" de um contêiner com

**Terminal**

```text
//Lista conteúdo no diretório atual
kubectl exec %POD_NAME% -- ls //Windows
kubectl exec $POD_NAME -- ls //Unix-like
// Exibe as variáveis de ambiente
kubectl exec %POD_NAME% -- env //Windows
kubectl exec $POD_NAME -- env //Unix-like
// Obtém a data
kubectl exec %POD_NAME% -- date //Windows
kubectl exec $POD_NAME -- date //Unix-like
```

<aside class="positive">

**Nota.** Um Pod executa múltiplos contêineres. Entretanto, não há especificação sobre qual contêiner utilizar para cada comando dos exemplos. Isso ocorre pois o Pod que estamos usando possui um único contêiner em execução.

</aside>

### A aplicação implantada: código-fonte e teste

A aplicação que implantamos está definida em um arquivo chamado `server.js`. Para visualizar o seu conteúdo e testá-la a partir do próprio contêiner em que se encontra, vamos abrir um terminal vinculado ao contêiner. Faça isso com

**Terminal**

```text
kubectl exec -ti %POD_NAME% -- bash //Windows
kubectl exec -ti $POD_NAME -- bash //Unix-like
```

<aside class="positive">

**Nota.** As flags `i` e `t` usadas pelo comando `exec` fazem com que

* `i` - a entrada padrão do computador que estamos usando seja direcionada para o contêiner.
* `t` - o terminal que estamos abrindo no contêiner seja um **tty**. Assim, ele pode receber e enviar mensagens tal qual um *Teletypewriter*.

Resumidamente, em conjunto, essas flags viabilizam a comunicação entre o host e o contêiner por meio do terminal. Veja mais sobre o conceito de tty em [http://www.linusakesson.net/programming/tty/](http://www.linusakesson.net/programming/tty/).

</aside>

Para visualizar o conteúdo do arquivo `server.js`, no terminal vinculado ao contêiner, use

**Terminal (dentro do contêiner)**

```bash
cat server.js
```

Verifique que o servidor está em funcionamento com

**Terminal (dentro do contêiner)**

```bash
curl localhost:8080
```

## Serviços
Duration: 15:00

Considere a arquitetura retratada pela figura a seguir.

![Cluster Kubernetes com o control plane e dois nós, cada nó executando Pods com endereços IP próprios, como 10.10.1.50 e 10.10.1.51](img/p104-1.webp)

*Cada Pod possui o seu próprio endereço IP.*

Ela destaca um detalhe muito importante. **Pods possuem IP próprio, mesmo aqueles executando no mesmo nó.** Agora, suponha que uma aplicação deseja utilizar uma funcionalidade disponibilizada por contêineres executando no cluster. É possível que mais de um Pod esteja envolvido no atendimento a requisições feitas por ela. Eles são destacados na figura a seguir.

![Mesmo cluster com um cliente externo e os Pods que atendem às suas requisições destacados em vermelho, distribuídos em nós diferentes](img/p104-2.webp)

*Vários Pods, em nós diferentes, atendendo ao mesmo cliente.*

Quando um **nó** se torna inoperante, cabe ao Kubernetes colocar em execução novas instâncias dos Pods que estavam sob sua responsabilidade. Veja a figura a seguir.

![Cluster em que um dos nós ficou inoperante e seus Pods são recriados em outro nó](img/p105-1.webp)

*Pods de um nó inoperante são recriados em outro nó.*

É claro que esse tipo de alteração deve ser transparente para a aplicação cliente. Ela sequer deve saber que está sendo atendida por múltiplos Pods no cluster. É aí que entra o conceito de **serviço**. Um serviço é um agrupamento lógico de Pods. Quando um serviço é criado, ele pode ter um **tipo**. Cada tipo influencia a forma como o serviço é exposto para acesso a seus Pods.

<aside class="positive">

**Nota.** Um serviço fornece uma forma simples para acesso a todos os seus Pods, abstraindo detalhes como IPs e portas diferentes.

</aside>

* **ClusterIP** - O serviço é exposto somente dentro do próprio cluster.
* **NodePort** - Expõe o serviço externamente ao cluster usando a mesma porta de cada nó especificado. O padrão para acesso é `NodeIp:NodePort`.
* **LoadBalancer** - Cria um balanceador de carga e atribui a ele um único IP externo e fixo.

Um serviço agrupa Pods por meio de **rótulos** e **seletores**. Aplicamos rótulos a Pods que desejamos que façam parte daquele serviço e, na definição do serviço, especificamos aquele rótulo escolhido como seu seletor. Veja a figura a seguir.

![Cluster com um serviço que agrupa, por meio de um seletor, os Pods que possuem o mesmo rótulo, em nós diferentes](img/p106-1.webp)

*Um serviço seleciona Pods por rótulo.*

Comece verificando os serviços existentes com

**Terminal**

```bash
kubectl get services
```

A saída deve conter um único serviço, como mostra o resultado a seguir. Ele é criado por padrão pelo Kubernetes.

**Terminal**

```text
C:\Users\rodri>kubectl get services
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   8d
```

Crie um serviço com

**Terminal**

```bash
kubectl expose deployment/meu-primeiro-deployment --type="NodePort" --port 8080
```

Execute

**Terminal**

```bash
kubectl get services
```

novamente. Para verificar a porta do nó (campo `NodePort`) que foi exposta, use

**Terminal**

```bash
kubectl describe services/meu-primeiro-deployment
```

Vamos armazená-la em uma variável de ambiente para uso futuro. Para obtê-la, use

**Terminal**

```text
kubectl get services/meu-primeiro-deployment -o go-template="{{(index .spec.ports 0).nodePort}}"
set NODE_PORT=porta_obtida //Windows
export NODE_PORT=porta_obtida //Unix-like
echo %NODE_PORT% //Windows, para testar
echo $NODE_PORT //Unix-like, para testar
```

Obtenha o endereço IP da máquina com

**Terminal**

```text
ipconfig //Windows
ifconfig //Unix-like
```

<aside class="positive">

**Nota.** Caso esteja utilizando o Minikube, use `minikube ip` para obter o endereço do seu cluster.

</aside>

Faça um teste com

**Terminal**

```text
curl ip_da_sua_maquina:%NODE_PORT% //Windows
curl ip_da_sua_maquina:$NODE_PORT //Unix-like
```

## Rótulos e remoção de serviços
Duration: 10:00

### Manipulação de rótulos

Nosso Pod possui um rótulo que foi atribuído automaticamente quando criamos o Deployment. Use

**Terminal**

```bash
kubectl describe deployment
```

para visualizá-lo. Veja a figura a seguir.

![Saída do kubectl describe deployment com a linha Labels: app=meu-primeiro-deployment destacada](img/p108-1.webp)

*O rótulo app=meu-primeiro-deployment atribuído automaticamente.*

Podemos fazer uma busca por Pods e por serviços filtrando por rótulo. Para isso, use

**Terminal**

```bash
kubectl get pods -l chave=valor
kubectl get services -l chave=valor
```

Armazene o nome do Pod obtido com

**Terminal**

```text
kubectl get pods -o go-template --template "{{range .items}}{{.metadata.name}}{{end}}"
set POD_NAME=nome_aqui //Windows
export POD_NAME=nome_aqui //Unix-like
```

Aplique um rótulo ao Pod com

**Terminal**

```text
kubectl label pod %POD_NAME% versao=v1 //Windows
kubectl label pod $POD_NAME versao=v1 //Unix-like
```

Verifique que o novo rótulo foi aplicado com

**Terminal**

```text
kubectl describe pods %POD_NAME%
```

A figura a seguir exibe parte do resultado esperado.

![Saída do kubectl describe pods com os rótulos app=meu-primeiro-deployment, pod-template-hash e versao=v1 destacados](img/p109-1.webp)

*O Pod com o novo rótulo versao=v1.*

A busca pode ser realizada usando qualquer rótulo existente no objeto de interesse. Use, por exemplo

**Terminal**

```bash
kubectl get pods -l versao=v1
```

### Removendo serviços

Uma vez que não seja necessária a exposição causada por um serviço, ele pode ser removido. A sua remoção não implica na remoção dos Pods associados a ele. A remoção pode ser feita com

**Terminal**

```bash
kubectl delete service -l app=meu-primeiro-deployment
```

Verifique que o serviço já não está disponível com

**Terminal**

```bash
kubectl get services
```

Verifique também que não é mais possível realizar requisições usando a porta que havia sido exposta com

**Terminal**

```text
curl ip_da_sua_maquina:%NODE_PORT% //Windows
curl ip_da_sua_maquina:$NODE_PORT //Unix-like
```

Observe, entretanto, que a aplicação permanece executando dentro do Pod. Use

**Terminal**

```text
kubectl exec -ti %POD_NAME% -- curl localhost:8080 //Windows
kubectl exec -ti $POD_NAME -- curl localhost:8080 //Unix-like
```

para verificar. Ocorre que o Deployment está sob gerência do Kubernetes e ele garante uma instância da aplicação em execução. Para removê-la, seria necessário remover também o Deployment.

## Escalabilidade e balanceamento de carga
Duration: 12:00

### Escalabilidade

Quando a demanda a funcionalidades de sua aplicação aumenta, é de interesse que novos recursos sejam alocados para mantê-la operando e com tempo de resposta aceitável. No Kubernetes, a **escalabilidade** é obtida aumentando-se o número de **réplicas** especificadas no Deployment. Quando requisições são atendidas por múltiplas instâncias da aplicação, é preciso distribuir a carga de trabalho de alguma forma. Os serviços possuem um **balanceador de carga** embutido que se encarrega de fazê-lo. Serviços também se encarregam de **verificar esporadicamente se cada um de seus Pods está operando**, garantindo que requisições sejam atendidas somente por aqueles que estejam. Veja a figura a seguir.

![Cluster com um serviço que distribui requisições do cliente entre várias réplicas de Pods em nós diferentes](img/p110-2.webp)

*O serviço distribui a carga entre as réplicas.*

Obtenha a sua lista de Deployments com

**Terminal**

```bash
kubectl get deployments
```

Cada Deployment possui um **ReplicaSet**. O propósito de um ReplicaSet é viabilizar a replicação de Pods. Um ReplicaSet possui alguns campos, tais como

* um **seletor** usado para especificar quais Pods fazem parte dele
* um **número de réplicas** que indica quantos Pods devem ser mantidos em execução.

Use

**Terminal**

```bash
kubectl get rs
```

para verificar seus ReplicaSets. As colunas `DESIRED` e `CURRENT` indicam quantas réplicas da aplicação são desejadas e quantas estão atualmente em funcionamento, respectivamente. Veja o resultado a seguir.

**Terminal**

```text
C:\Users\rodri>kubectl get rs
NAME                                 DESIRED   CURRENT   READY   AGE
meu-primeiro-deployment-7cd85b47b7   1         1         1       88m
```

Podemos aumentar o número de réplicas desejadas com

**Terminal**

```bash
kubectl scale deployments/meu-primeiro-deployment --replicas=4
```

Verifique novamente a sua lista de Deployments com

**Terminal**

```bash
kubectl get deployments
```

Verifique também a sua lista de Pods com

**Terminal**

```text
kubectl get pods //simples
kubectl get pods -o wide //mais detalhes
```

A figura a seguir destaca que cada Pod tem seu próprio endereço IP.

![Saída do kubectl get pods -o wide com quatro Pods de meu-primeiro-deployment e a coluna IP destacada](img/p111-2.webp)

*Cada réplica tem seu próprio endereço IP.*

A descrição de objetos do Kubernetes, em geral, inclui os eventos que os envolveram ao longo do tempo. Ajustar o número de réplicas como fizemos é um evento que teve impacto no Deployment. Visualize isso com

**Terminal**

```bash
kubectl describe deployments/meu-primeiro-deployment
```

A figura a seguir destaca a lista de eventos.

![Saída do kubectl describe deployments com a seção Events destacada, mostrando o ReplicaSet escalado para 4](img/p112-1.webp)

*O ajuste de réplicas registrado nos eventos do Deployment.*

### Testando o balanceador de carga

Quando uma requisição é enviada ao serviço, ele deve usar o seu balanceador de carga para distribuir a carga de trabalho entre os Pods que gerencia. Como removemos o serviço anterior, será necessário criar um novo para testar o balanceador de carga. Faça isso com

**Terminal**

```bash
kubectl expose deployment/meu-primeiro-deployment --type="NodePort" --port 8080
```

A seguir, obtenha a porta exposta com

**Terminal**

```text
kubectl get service meu-primeiro-deployment -o go-template="{{(index .spec.ports 0).nodePort}}"
set NODE_PORT=porta //Windows
export NODE_PORT=porta //Unix-like
```

Execute

**Terminal**

```text
curl ip_da_sua_maquina:%NODE_PORT% //Windows
curl ip_da_sua_maquina:$NODE_PORT //Unix-like
```

diversas vezes e verifique o resultado. A figura a seguir destaca o nome do Pod responsável pelo atendimento a cada requisição.

![Várias execuções de curl com a resposta Hello Kubernetes bootcamp! Running on: meu-primeiro-deployment seguida de nomes de Pods diferentes destacados](img/p113-1.webp)

*Requisições atendidas por Pods diferentes.*

Para reduzir o número de réplicas, basta usar

**Terminal**

```bash
kubectl scale deployments/meu-primeiro-deployment --replicas=2
```

E para testar, use

**Terminal**

```text
kubectl get deployments //simples
kubectl get deployments -o wide //Mais detalhes
```

Volte a utilizar quatro réplicas para os testes a seguir, com

**Terminal**

```bash
kubectl scale deployments/meu-primeiro-deployment --replicas=4
```

## Implantando novas versões: rolling updates
Duration: 12:00

Nos dias atuais, é muito comum que desenvolvedores entreguem muitos **pequenos updates em um único dia** e que **muitos deles sejam implantados no mesmo dia**. Trata-se de uma prática comum de **DevOps**. Idealmente, a atualização acontece **sem que a aplicação passe por um período de indisponibilidade**. No Kubernetes, isso é obtido por meio de **Rolling Updates**. Um *rolling update* funciona substituindo gradualmente cada Pod existente por um novo. Enquanto um Pod é substituído, os demais permanecem atendendo as requisições dos clientes. Veja a figura a seguir.

![Sequência de estados de um cluster em que os Pods da versão antiga são substituídos um a um por Pods da nova versão enquanto o serviço continua atendendo](img/p114-1.webp)

*Rolling update: os Pods são substituídos gradualmente.*

Há algumas considerações importantes ainda sobre os *rolling updates*.

* Por padrão, no máximo **um** Pod pode ficar indisponível durante um *rolling update*.
* Por padrão, no máximo **um** Pod pode ser criado por vez durante um *rolling update*.
* Ambos valores citados podem ser reconfigurados.
* O Kubernetes aplica uma versão (um identificador) automaticamente a cada atualização realizada.
* Uma vez que uma atualização tenha sido realizada, é possível voltar para qualquer uma que tenha sido implantada com sucesso no passado.

Para testar o funcionamento dos *rolling updates*, comece usando

**Terminal**

```bash
kubectl get deployments
```

para visualizar os Deployments que possui no momento. A seguir, visualize os seus Pods com

**Terminal**

```bash
kubectl get pods
```

Visualize a imagem que está sendo executada pelos Pods com

**Terminal**

```bash
kubectl describe pods
```

Para atualizar a imagem sendo executada pelos Pods, use

**Terminal**

```bash
kubectl set image deployments/meu-primeiro-deployment kubernetes-bootcamp=jocatalin/kubernetes-bootcamp:v2
```

<aside class="positive">

**Nota.** `kubernetes-bootcamp` é o identificador do contêiner existente na imagem que implantamos desde o início.

</aside>

Logo depois, execute

**Terminal**

```bash
kubectl get pods
```

diversas vezes. Deverá ser possível ver informações sobre a criação e remoção de Pods, como ilustra a figura a seguir.

![Várias execuções de kubectl get pods com a coluna STATUS destacada, mostrando Pods em Terminating, ContainerCreating e Running](img/p116-1.webp)

*Pods sendo criados e removidos durante o rolling update.*

Para testar a atualização, use

**Terminal**

```text
curl ip_da_sua_maquina:%NODE_PORT% //Windows
curl ip_da_sua_maquina:$NODE_PORT //Unix-like
```

A figura a seguir destaca múltiplos Pods atendendo requisições. Perceba que todos eles estão usando a versão mais recente.

![Execuções de curl com respostas de Pods diferentes, todas terminando com v=2 destacado](img/p116-2.webp)

*Todos os Pods respondendo com a versão 2.*

Também é possível verificar o status da atualização com

**Terminal**

```bash
kubectl rollout status deployments/meu-primeiro-deployment
```

A seguir, vamos fazer uma atualização utilizando uma **imagem inexistente**. Assim, será necessário voltar à versão anterior. Para atualizar os Pods com a nova imagem, use

**Terminal**

```bash
kubectl set image deployments/meu-primeiro-deployment kubernetes-bootcamp=gcr.io/google-samples/kubernetes-bootcamp:v10
```

Observe, no resultado a seguir, que o número de Pods prontos não é o total (coluna `READY`). Um deles ficou comprometido com a tentativa de atualização utilizando uma imagem inexistente.

**Terminal**

```text
C:\Users\rodri>kubectl set image deployments/meu-primeiro-deployment kubernetes-bootcamp=gcr.io/google-samples/kubernetes-bootcamp:v10
deployment.apps/meu-primeiro-deployment image updated

C:\Users\rodri>kubectl get deployments
NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
meu-primeiro-deployment   3/4     2            3           3h50m
```

Execute

**Terminal**

```bash
kubectl get pods
kubectl describe pods
```

para visualizar mais informações sobre os Pods e entender o que houve. Podemos desfazer a última atualização realizada com

**Terminal**

```bash
kubectl rollout undo deployments/meu-primeiro-deployment
```

## Arquivos de configuração: um Pod
Duration: 15:00

Cada objeto ou recurso como Pods e Deployments que criamos até então pode também ser criado por meio da especificação de **arquivos de configuração**. Essa é a forma recomendada de fazê-lo por diferentes razões.

* Uma vez escritos, eles podem ser armazenados no sistema de controle de versão junto com o código-fonte. Conforme o sistema evolui, aquilo que é alocado para seu funcionamento também muda. Por isso, para cada versão, é importante saber quais objetos precisam ser alocados.
* Eles documentam aquilo que está sendo alocado no Kubernetes para o funcionamento da aplicação.

### Arquivo de configuração para um Pod: microsserviço de lembretes

Vamos escrever um arquivo de configuração em que especificamos um Pod para execução do microsserviço de lembretes.

Abra um terminal vinculado ao diretório em que se encontra o `Dockerfile` do seu microsserviço de lembretes. Vamos criar uma nova imagem com uma nova tag com

**Terminal (pasta lembretes)**

```bash
docker build -t rodbossini/lembretes:0.0.1 .
```

<aside class="positive">

**Nota.** Use o padrão `seu_id_no_docker_hub/nome_da_imagem:versao`. Caso não tenha um id no Docker Hub, crie um em [https://hub.docker.com/](https://hub.docker.com/). É grátis.

</aside>

<aside class="positive">

**Nota.** O simples fato de criar uma imagem com tag no padrão `seu_id_no_docker_hub/nome_da_imagem:versao` não faz com que ela seja armazenada no seu Docker Hub. Em breve utilizaremos um comando Docker para fazer isso. Neste momento, a sua imagem está armazenada localmente.

</aside>

**Há uma informação muito importante para usuários Minikube.** Por padrão, o Minikube possui o seu próprio ambiente Docker, como mostra a figura a seguir.

![Sua máquina com Docker e Minikube instalados: à esquerda o ambiente Docker da máquina com imagens, contêineres e Docker Daemon, ligado ao cliente (docker build, docker run, docker images); à direita o ambiente Minikube com Pods, Deployments, Services e seu próprio ambiente Docker](img/p118-3.webp)

*O cliente Docker, por padrão, conversa com o daemon da máquina host.*

Entretanto, o cliente Docker, por padrão, se comunica com o Docker daemon da máquina host, como ilustra a figura. O Docker daemon é um processo servidor responsável por atender às requisições feitas pelo cliente Docker. As imagens, contêineres etc criados ficam disponíveis na máquina host. Quando o Minikube tenta fazer uso de uma imagem por meio de seu rótulo, ele a procura localmente, em seu próprio ambiente Docker, e não na máquina host. Desta forma, caso a imagem tenha sido criada na máquina host, o Minikube irá reportar um erro do tipo **ErrImagePull**. Para resolver esse problema, podemos instruir o cliente Docker a enviar requisições ao Docker daemon que executa no ambiente Docker do Minikube. Isso pode ser feito com

**Terminal**

```text
eval $(minikube docker-env) //Unix-like
minikube docker-env | Invoke-Expression //Powershell, Windows 10
```

O efeito é destacado na figura a seguir.

![Mesmo diagrama, agora com o cliente Docker ligado ao Docker Daemon do ambiente do Minikube, conexão destacada em vermelho](img/p119-3.webp)

*O cliente Docker passa a conversar com o daemon do Minikube.*

Para fazer com que o cliente Docker passe a se comunicar novamente com o Docker daemon da máquina host, use

**Terminal**

```text
eval $(minikube docker-env -u) //Unix-like
minikube docker-env -u | Invoke-Expression //Powershell, Windows 10
```

Visite [https://minikube.sigs.k8s.io/docs/handbook/pushing/](https://minikube.sigs.k8s.io/docs/handbook/pushing/) para mais detalhes.

Prosseguindo, crie uma pasta chamada `implantacao` e, dentro dela, uma outra chamada `kubernetes`, como ilustra a figura a seguir.

![Explorador do VS Code com a pasta implantacao contendo a subpasta kubernetes, ao lado das pastas dos microsserviços](img/p120-1.webp)

*A pasta implantacao/kubernetes no workspace.*

Na pasta `kubernetes`, crie um arquivo chamado `lembretes.yaml`. Seu conteúdo aparece a seguir. Ele especifica

* **apiVersion** - Qual versão da API do Kubernetes está sendo usada para criar esse objeto. Ocorre que podemos especificar objetos customizados além daqueles disponíveis por padrão. Quando usamos `v1`, estamos dizendo que queremos criar objetos a partir da coleção padrão do Kubernetes. Quando criamos objetos customizados, eles fazem parte de uma nova versão que criamos e que pode ser especificada aqui.
* **kind** - Qual o tipo do objeto.
* **metadata** - Dados sobre o objeto, como o seu nome e um identificador.
* **spec** - Descrição do estado desejado para o objeto.

<aside class="positive">

**Nota.** Comentários em arquivos `.yaml` são definidos com o símbolo `#`. Há diversos validadores de sintaxe YAML disponíveis on-line. Um deles pode ser acessado em [https://codebeautify.org/yaml-validator](https://codebeautify.org/yaml-validator).

</aside>

**implantacao/kubernetes/lembretes.yaml**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: lembretes
spec:
  containers:
    - name: lembretes
      image: rodbossini/lembretes:0.0.1
      resources:
        limits:
          memory: 256Mi
          cpu: 1
```

<aside class="positive">

**Nota.** O Pod que estamos criando executará somente um contêiner. É aceitável e até desejável que tenham nomes iguais. No arquivo acima, o nome de ambos é `lembretes`.

</aside>

A seguir, a partir de um terminal vinculado à pasta em que se encontra o arquivo `lembretes.yaml`, use

**Terminal (pasta implantacao/kubernetes)**

```bash
kubectl apply -f lembretes.yaml
```

para criar o Pod. Verifique a sua existência com

**Terminal**

```bash
kubectl get pods/lembretes
kubectl describe pods/lembretes
```

<aside class="positive">

**Nota.** Caso deseje, um objeto do Kubernetes pode ser removido usando o mesmo arquivo usado na sua criação: `kubectl delete -f arquivo.yaml`.

</aside>

## Arquivos de configuração: um Deployment
Duration: 10:00

Como vimos, Deployments podem ser utilizados para tarefas importantes envolvendo replicação de Pods, atualização de versão de imagem em uso nos Pods e assim por diante. Eles também podem ser criados com arquivos de configuração. Nesta seção iremos definir um Deployment usando um arquivo de configuração. Os Pods a que ele estará associado também serão definidos assim, por isso, comece **removendo o arquivo `lembretes.yaml`**. Ele não causa nenhum dano mas não será mais usado. A seguir, crie um arquivo chamado `lembretes-deployment.yaml`. Seu conteúdo aparece a seguir.

**implantacao/kubernetes/lembretes-deployment.yaml**

```yaml
#deployments vem de apps/v1
apiVersion: apps/v1
#tipo
kind: Deployment
metadata:
  #nome do deployment
  name: lembretes-deployment
spec:
  #quantas cópias
  replicas: 1
  #para especificar o rótulo
  selector:
    matchLabels:
      #rótulo, app não tem nada de especial, pode ser qq coisa
      #Deployment vai selecionar todo Pod que tiver esse rótulo
      app: lembretes
  #modelo que vai ser usado para construção dos Pods
  template:
    metadata:
      labels:
        #os Pods terão esse rótulo, assim,
        #serão selecionados por esse deployment
        app: lembretes
    spec:
      containers:
        - name: lembretes
          image: rodbossini/lembretes:0.0.1
          resources:
            limits:
              memory: 256Mi
              cpu: 1
```

<aside class="negative">

Na apostila, a linha do rótulo dentro de `template.metadata.labels` aparece como `app:lembretes`, sem espaço depois dos dois-pontos. Em YAML, o espaço é obrigatório para formar o par chave/valor; sem ele, o rótulo não é criado e o Deployment não encontra os seus Pods. Use `app: lembretes`, como nas versões seguintes deste arquivo.

</aside>

Crie o Deployment com

**Terminal (pasta implantacao/kubernetes)**

```bash
kubectl apply -f lembretes-deployment.yaml
```

Verifique a existência de seu Deployment com

**Terminal**

```bash
kubectl get deployments
kubectl describe deployments
```

Verifique também que há um Pod em execução. Seu nome deve ser igual ao nome do Deployment seguido de um código gerado pelo Kubernetes. É interessante observar que um Deployment é uma configuração usada pelo Kubernetes para decidir quais Pods devem estar em execução. Se removermos o Pod, ele será recriado! Você pode testar isso com

**Terminal**

```text
//use o nome do pod que foi gerado na sua máquina
kubectl delete pod lembretes-deployment-76767c559c-x9m7g
//aguarde alguns segundos
kubectl get pods
```

Você deverá ver um novo Pod cujo nome contém o nome do Deployment. Note que o código em seu nome é diferente do anterior.

## Atualizando a imagem de um Deployment
Duration: 20:00

Uma imagem sendo utilizada por um Deployment pode ser atualizada de formas diferentes. Uma delas consiste em

* Fazer as atualizações desejadas no código-fonte da aplicação.
* Gerar uma nova imagem Docker.
* Atualizar o arquivo de configuração em que o Deployment foi especificado para que ele use a nova versão.
* Usar `kubectl apply` para informar o Kubernetes sobre a atualização.

Para testar essa possibilidade, abra o arquivo `index.js` do microsserviço de lembretes. Adicione a linha `console.log('Nova versão')`, como a seguir.

**lembretes/index.js**

```javascript
...
app.listen(4000, () => {
  console.log('Nova versão')
  console.log("Lembretes. Porta 4000");
});
```

A seguir, em um terminal vinculado ao diretório em que se encontram os arquivos do microsserviço de lembretes, execute

**Terminal (pasta lembretes)**

```bash
docker build -t rodbossini/lembretes:0.0.2 .
```

para gerar a nova imagem. Atualize o arquivo que descreve o Deployment como a seguir (a imagem passa a ser a versão `0.0.2`).

**implantacao/kubernetes/lembretes-deployment.yaml**

```yaml
#deployments vem de apps/v1
apiVersion: apps/v1
#tipo
kind: Deployment
metadata:
  #nome do deployment
  name: lembretes-deployment
spec:
  #quantas cópias
  replicas: 1
  #para especificar o rótulo
  selector:
    matchLabels:
      #rótulo, app não tem nada de especial, pode ser qq coisa
      #Deployment vai selecionar todo Pod que tiver esse rótulo
      app: lembretes
  #modelo que vai ser usado para construção dos Pods
  template:
    metadata:
      labels:
        #os Pods terão esse rótulo, assim,
        #serão selecionados por esse deployment
        app: lembretes
    spec:
      containers:
        - name: lembretes
          image: rodbossini/lembretes:0.0.2
```

Passe a utilizar o novo Deployment com

**Terminal (pasta implantacao/kubernetes)**

```bash
kubectl apply -f lembretes-deployment.yaml
```

Ao executar

**Terminal**

```bash
kubectl get pods
```

você deverá visualizar um novo Pod com tempo de vida de apenas alguns segundos. Copie o nome dele e use

**Terminal**

```text
kubectl logs lembretes-deployment-85968d5ff6-n2w9f //Use o nome do seu pod aqui
```

para visualizar seu log. O método que utilizamos pode se tornar mais difícil ao longo do tempo, especialmente quando os arquivos `.yaml` se tornarem maiores e mais complexos. Usando este método, toda vez que houver alguma alteração na aplicação, teremos de abrir o arquivo `.yaml` correspondente e atualizar a versão, como fizemos atualizando de `0.0.1` para `0.0.2`. Em outras palavras, violamos o **princípio aberto/fechado**. Além disso, podemos digitar o número errado da versão. Uma **segunda possibilidade** de implantação consiste nos seguintes passos.

* Deixar de especificar a versão explicitamente, o que instrui o Kubernetes a utilizar a última versão disponível. Podemos simplesmente não especificar coisa alguma ou escrever a palavra `latest` no lugar da versão. Dá na mesma.
* Atualizar o código-fonte da aplicação conforme desejado.
* Gerar uma nova versão da imagem com o Docker.
* Enviar a imagem para o **Docker Hub**.
* Aplicar a nova versão com `kubectl rollout`.

Comece atualizando o arquivo `lembretes-deployment.yaml` como a seguir (a imagem fica sem versão).

**implantacao/kubernetes/lembretes-deployment.yaml**

```yaml
#deployments vem de apps/v1
apiVersion: apps/v1
#tipo
kind: Deployment
metadata:
  #nome do deployment
  name: lembretes-deployment
spec:
  #quantas cópias
  replicas: 1
  #para especificar o rótulo
  selector:
    matchLabels:
      #rótulo, app não tem nada de especial, pode ser qq coisa
      #Deployment vai selecionar todo Pod que tiver esse rótulo
      app: lembretes
  #modelo que vai ser usado para construção dos Pods
  template:
    metadata:
      labels:
        #os Pods terão esse rótulo, assim,
        #serão selecionados por esse deployment
        app: lembretes
    spec:
      containers:
        - name: lembretes
          image: rodbossini/lembretes
```

A seguir, atualize o arquivo `index.js` do microsserviço de lembretes como a seguir.

**lembretes/index.js**

```javascript
...
app.listen(4000, () => {
  console.log("Nova versão");
  console.log("Agora usando o Docker Hub");
  console.log("Lembretes. Porta 4000");
});
```

O próximo passo é gerar uma nova imagem com o Docker. Com um terminal vinculado à pasta em que se encontra o arquivo `index.js` do microsserviço de lembretes, use

**Terminal (pasta lembretes)**

```bash
docker build -t rodbossini/lembretes .
```

Execute

**Terminal**

```bash
docker images
```

e verifique que a tag da nova imagem é **latest**, como no trecho de saída a seguir.

**Terminal**

```text
REPOSITORY             TAG
rodbossini/lembretes   latest
```

Para enviar a imagem para o **Docker Hub**, faça login na sua conta com

**Terminal**

```bash
docker login
```

A seguir, execute

**Terminal**

```bash
docker push rodbossini/lembretes
```

para enviar a imagem para um repositório público do seu Docker Hub.

<aside class="positive">

**Nota.** Depois de fazer um `docker push`, visite a página de seu Docker Hub. A imagem deve estar disponível lá. Por padrão, ela será armazenada em um repositório público. Contas grátis têm direito a um único repositório privado.

</aside>

<aside class="positive">

**Nota.** Caso uma imagem não exista localmente, ambos Kubernetes e Minikube irão tentar encontrá-la no ambiente Docker padrão (Docker Hub).

</aside>

Para atualizar a imagem utilizada no Deployment, use

**Terminal**

```bash
kubectl rollout restart deployment lembretes-deployment
```

Verifique novamente a sua lista de Deployments com

**Terminal**

```bash
kubectl get deployments
```

Verifique também a sua lista de Pods com

**Terminal**

```bash
kubectl get pods
```

Como destaca o resultado a seguir, deve haver um novo Pod com poucos segundos de tempo de vida.

**Terminal**

```text
NAME                                   READY   STATUS        RESTARTS   AGE
lembretes-deployment-6557d596fd-9rp7q  1/1     Running       0          7s
lembretes-deployment-75b97c596f-dd7tv  0/1     Terminating   0          4m55s
```

Anote o nome do novo Pod e use

**Terminal**

```text
//use o nome do seu pod
kubectl logs lembretes-deployment-6557d596fd-9rp7q
```

para visualizar os logs do contêiner executando no novo Pod. O resultado deve ser parecido com o seguinte.

**Terminal**

```text
[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
Nova versão
Agora usando o Docker Hub
Lembretes. Porta 4000
```

<aside class="negative">

**Nota.** Pode ser necessário reiniciar o Kubernetes e remover as imagens armazenadas localmente. No Windows, você pode reiniciar o Kubernetes nas configurações do Docker Desktop. Se estiver usando o Minikube, use `minikube delete`, apague as imagens com `docker image rm id_da_imagem` e, a seguir, use `minikube start`.

</aside>

<aside class="positive">

**Nota.** É possível instruir o Kubernetes e o Minikube para que utilizem somente imagens locais, com `imagePullPolicy: Never`. Veja o exemplo a seguir.

</aside>

**Exemplo: Pod que usa somente imagens locais**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: lembretes
spec:
  containers:
    - name: lembretes
      image: rodbossini/lembretes
      imagePullPolicy: Never
      resources:
        limits:
          memory: 256Mi
          cpu: 1
```

## Serviço para acessar o microsserviço de lembretes
Duration: 10:00

Nesta seção, vamos criar um **serviço** que irá viabilizar o acesso à aplicação que implantamos. Assim como os demais objetos, serviços também podem ser criados por meio de arquivos de configuração. Comece criando um arquivo chamado `lembretes-service.yaml` na pasta `implantacao/kubernetes`. Seu conteúdo aparece a seguir.

**implantacao/kubernetes/lembretes-service.yaml**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: lembretes-service
spec:
  #Ip externo, acessível fora do cluster
  type: NodePort
  selector:
    #todo Pod que tiver essa tag
    #fará parte desse serviço
    app: lembretes
  ports:
    - name: lembretes
      protocol: TCP
      #o nó recebe requisições nessa porta
      port: 4000
      # e direciona para essa porta do Pod
      targetPort: 4000
```

Para criar o serviço use

**Terminal (pasta implantacao/kubernetes)**

```bash
kubectl apply -f lembretes-service.yaml
```

Verifique a sua existência com

**Terminal**

```bash
kubectl get services
kubectl describe service lembretes-service
```

A figura a seguir destaca a porta aleatória que foi associada ao serviço. Esta é a porta que deve ser usada externamente. O cliente envia requisições para esta porta. Internamente, o serviço as redireciona para a porta `4000` do nó que, por sua vez, as entrega ao contêiner em sua porta `4000`.

![Saída do kubectl get services com o lembretes-service do tipo NodePort e a porta externa 32143 destacada em 4000:32143/TCP](img/p130-1.webp)

*A porta aleatória (aqui, 32143) associada ao serviço NodePort.*

Use o Postman para fazer uma requisição em `http://localhost:sua_porta/lembretes`.

<aside class="positive">

**Nota.** Caso esteja utilizando o Minikube, lembre-se de obter o seu IP com `minikube ip`.

</aside>

## Comunicação interna: serviços ClusterIP
Duration: 25:00

Até então, os microsserviços utilizam o endereço IP da máquina host para se comunicarem. Isso já não será possível uma vez que sejam executados por instâncias de Pods do Kubernetes. Para viabilizar a comunicação interna entre microsserviços executando em uma instância do Kubernetes, usamos serviços do tipo **Cluster IP**.

### Deployment e serviço ClusterIP para o barramento de eventos e para o microsserviço de lembretes

Começamos colocando o barramento de eventos em funcionamento e viabilizando a sua comunicação com o microsserviço de lembretes. Isso será feito da seguinte forma.

* Construir uma imagem Docker para o barramento de eventos.
* Enviar a imagem para o Docker Hub.
* Criar um Deployment para o barramento de eventos.
* Criar um serviço do tipo Cluster IP para o barramento de eventos e para o microsserviço de lembretes.

Para criar a imagem Docker para o barramento de eventos, vá até o diretório em que se encontra o respectivo arquivo `Dockerfile` e use

**Terminal (pasta barramento-de-eventos)**

```bash
docker build -t rodbossini/barramento-de-eventos .
```

Envie a imagem para o Docker Hub com

**Terminal (pasta barramento-de-eventos)**

```bash
docker push rodbossini/barramento-de-eventos
```

Repita o procedimento para a imagem Docker do microsserviço de lembretes. Crie uma nova com

**Terminal (pasta lembretes)**

```bash
docker build -t rodbossini/lembretes .
```

e envie para o Docker Hub com

**Terminal (pasta lembretes)**

```bash
docker push rodbossini/lembretes
```

Crie um arquivo chamado `barramento-de-eventos-deployment.yaml` na pasta `implantacao/kubernetes`. Seu conteúdo aparece a seguir.

**implantacao/kubernetes/barramento-de-eventos-deployment.yaml**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: barramento-de-eventos-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: barramento-de-eventos
  template:
    metadata:
      labels:
        app: barramento-de-eventos
    spec:
      containers:
        - name: barramento-de-eventos
          image: rodbossini/barramento-de-eventos
```

Para criar o novo Deployment, use

**Terminal (pasta implantacao/kubernetes)**

```bash
kubectl apply -f barramento-de-eventos-deployment.yaml
```

Execute

**Terminal**

```bash
kubectl get pods
```

para verificar se há um novo Pod em funcionamento. O prefixo de seu nome deve ser `barramento-de-eventos`. Seu tempo de vida deve ser de alguns segundos. O serviço do tipo Cluster IP para disponibilização interna do barramento de eventos também será criado no arquivo `barramento-de-eventos-deployment.yaml`, depois de um separador `---`. Veja o arquivo completo a seguir.

**implantacao/kubernetes/barramento-de-eventos-deployment.yaml**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: barramento-de-eventos-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: barramento-de-eventos
  template:
    metadata:
      labels:
        app: barramento-de-eventos
    spec:
      containers:
        - name: barramento-de-eventos
          image: rodbossini/barramento-de-eventos
---
apiVersion: v1
kind: Service
metadata:
  name: barramento-de-eventos-service
spec:
  selector:
    app: barramento-de-eventos
  #ip interno ao cluster
  type: ClusterIP
  ports:
    - name: barramento-de-eventos
      protocol: TCP
      port: 10000
      targetPort: 10000
```

Para confirmar a criação do serviço, use

**Terminal (pasta implantacao/kubernetes)**

```bash
kubectl apply -f barramento-de-eventos-deployment.yaml
```

O novo serviço criado pode ser visualizado com

**Terminal**

```bash
kubectl get services
```

O resultado deve ser parecido com aquele exibido pela figura a seguir.

![Saída do kubectl get services com a linha barramento-de-eventos-service, do tipo ClusterIP na porta 10000/TCP, destacada](img/p134-1.webp)

*O serviço ClusterIP do barramento de eventos.*

A criação do serviço de tipo Cluster IP para o microsserviço de lembretes é semelhante. Abra o arquivo `lembretes-deployment.yaml` e adicione o conteúdo a partir do separador `---`, como a seguir.

**implantacao/kubernetes/lembretes-deployment.yaml**

```yaml
#deployments vem de apps/v1
apiVersion: apps/v1
#tipo
kind: Deployment
metadata:
  name: lembretes-deployment #nome do deployment
spec:
  #quantas cópias
  replicas: 1
  #para especificar o rótulo
  selector:
    matchLabels:
      #rótulo, app não tem nada de especial, pode ser qq coisa
      #Deployment vai selecionar todo Pod que tiver esse rótulo
      app: lembretes
  #modelo que vai ser usado para construção dos Pods
  template:
    metadata:
      labels:
        #os Pods terão esse rótulo, assim,
        #serão selecionados por esse deployment
        app: lembretes
    spec:
      containers:
        - name: lembretes
          image: rodbossini/lembretes
---
apiVersion: v1
kind: Service
metadata:
  #nome diferente do outro de tipo NodePort
  #que havíamos criado
  name: lembretes-clusterip-service
spec:
  selector:
    app: lembretes
  ports:
    - name: lembretes
      protocol: TCP
      port: 4000
      targetPort: 4000
```

O barramento de eventos tenta se comunicar com todos os microsserviços. Vamos manter a sua comunicação somente com o microsserviço de lembretes para depois fazer os ajustes necessários. Veja o código a seguir.

**barramento-de-eventos/index.js**

```javascript
const eventos = [];
app.post("/eventos", (req, res) => {
  const evento = req.body;
  eventos.push(evento);
  //envia o evento para o microsserviço de lembretes
  axios.post("http://localhost:4000/eventos", evento);
  //envia o evento para o microsserviço de observações
  //axios.post("http://localhost:5000/eventos", evento);
  //envia o evento para o microsserviço de consulta
  // axios.post("http://localhost:6000/eventos", evento).catch((err) => {
  //   console.log("err", err);
  // });
  //envia o evento para o microsservico de classificacao
  //axios.post("http://localhost:7000/eventos", evento);
  res.status(200).send({ msg: "ok" });
});
```

Nossos microsserviços estão fazendo requisições direcionadas a `localhost`, o que já não funciona já que eles estão sob coordenação dos serviços Kubernetes que criamos. É preciso substituir a constante `localhost` usando os nomes dos serviços criados. Os nomes dos serviços são aqueles especificados nos arquivos `.yaml`. Também é possível obtê-los com

**Terminal**

```bash
kubectl get services
```

Veja o resultado na figura a seguir.

![Saída do kubectl get services com a coluna NAME destacada, listando barramento-de-eventos-service, kubernetes, lembretes-clusterip-service e lembretes-service](img/p136-2.webp)

*Os nomes dos serviços, usados no lugar de localhost.*

Comece ajustando o microsserviço de lembretes. Em seu arquivo `index.js`, substitua a constante `localhost` pelo nome do serviço Kubernetes que dá acesso ao barramento de eventos. Veja o código a seguir.

**lembretes/index.js**

```javascript
...
  //era assim
  //await axios.post("http://localhost:10000/eventos", {
  //fica assim
  await axios.post("http://barramento-de-eventos-service:10000/eventos", {
    tipo: "LembreteCriado",
    dados: {
      contador,
      texto,
    },
  });
  res.status(201).send(lembretes[contador]);
});
```

Faça o mesmo ajuste para o barramento de eventos. Faça com que ele use o nome do serviço Kubernetes que dá acesso interno ao microsserviço de lembretes, como no código a seguir.

**barramento-de-eventos/index.js**

```javascript
app.post("/eventos", (req, res) => {
  const evento = req.body;
  eventos.push(evento);
  //envia o evento para o microsserviço de lembretes
  //era assim
  //axios.post("http://localhost:4000/eventos", evento);
  //fica assim
  axios.post("http://lembretes-clusterip-service:4000/eventos", evento);
  //envia o evento para o microsserviço de observações
  //axios.post("http://localhost:5000/eventos", evento);
  //envia o evento para o microsserviço de consulta
  // axios.post("http://localhost:6000/eventos", evento).catch((err) => {
  //   console.log("err", err);
  // });
  //envia o evento para o microsservico de classificacao
  //axios.post("http://localhost:7000/eventos", evento);
  res.status(200).send({ msg: "ok" });
});
```

Feitas as atualizações, precisamos gerar novas imagens Docker. Vá até a pasta em que se encontra o arquivo `Dockerfile` do barramento de eventos e execute

**Terminal (pasta barramento-de-eventos)**

```bash
docker build -t rodbossini/barramento-de-eventos .
```

para gerar a nova imagem. A seguir, use

**Terminal (pasta barramento-de-eventos)**

```bash
docker push rodbossini/barramento-de-eventos
```

para enviá-la para o Docker Hub. **Repita o procedimento para o microsserviço de lembretes.** Na pasta em que se encontra o seu arquivo `Dockerfile`, execute

**Terminal (pasta lembretes)**

```bash
docker build -t rodbossini/lembretes .
```

A seguir, envie a imagem para o Docker Hub com

**Terminal (pasta lembretes)**

```bash
docker push rodbossini/lembretes
```

A seguir, precisamos atualizar os Deployments. Use

**Terminal**

```bash
kubectl get deployments
```

caso precise se lembrar de seus nomes. Veja o resultado a seguir.

**Terminal**

```text
NAME                               READY   UP-TO-DATE   AVAILABLE   AGE
barramento-de-eventos-deployment   1/1     1            1           6d20h
lembretes-deployment               1/1     1            1           7d12h
```

A atualização dos Deployments pode ser feita com

**Terminal**

```bash
kubectl rollout restart deployment barramento-de-eventos-deployment
```

e

**Terminal**

```bash
kubectl rollout restart deployment lembretes-deployment
```

Execute

**Terminal**

```bash
kubectl get pods
```

e verifique os novos Pods criados. Eles devem ter poucos segundos de tempo de vida. É possível que você ainda veja os antigos sendo destruídos, caso execute este comando logo após a atualização dos Deployments. Veja o resultado a seguir (colunas `STATUS` e `AGE`).

**Terminal**

```text
NAME                                                READY   STATUS        RESTARTS   AGE
barramento-de-eventos-deployment-6cb889765b-7xzjj   1/1     Running       0          23s
lembretes-deployment-6557d596fd-tzx55               0/1     Terminating   1          6d19h
lembretes-deployment-74f46c9b87-lzcp4               1/1     Running       0          8s
```

## Testando a comunicação interna
Duration: 12:00

Neste instante já deve ser possível testar a comunicação interna entre o microsserviço de lembretes e o barramento de eventos. Para isso, precisamos utilizar um cliente HTTP (como o Postman) para enviar uma requisição ao cluster Kubernetes. A requisição partirá de um ambiente externo ao cluster, por isso precisamos usar uma porta que tenha sido aberta previamente. Lembre-se que isso é feito utilizando um serviço Kubernetes do tipo **NodePort** ou **LoadBalancer**. O serviço Kubernetes do tipo NodePort que criamos anteriormente pode ser visualizado com

**Terminal**

```bash
kubectl get services
```

Veja o resultado na figura a seguir. Note que é possível visualizar a porta que foi aberta para o ambiente externo.

![Saída do kubectl get services com o tipo NodePort do lembretes-service e a porta externa 30686 destacados](img/p139-3.webp)

*A porta externa do serviço NodePort (aqui, 30686).*

O endereço IP a ser utilizado para fazer a requisição é aquele associado ao ambiente em que o cluster está em execução. Caso esteja utilizando o **Docker for Desktop**, basta utilizar a constante `localhost`. Usuários do Minikube podem obter o seu endereço IP com

**Terminal**

```bash
minikube ip
```

Abra o Postman e faça uma requisição **PUT** como ilustra a figura a seguir. Lembre-se de substituir `localhost` pelo IP apropriado, caso esteja utilizando o Minikube.

![Postman com um PUT em localhost:30686/lembretes, Body raw JSON com o texto Fazer café, status 200 OK e a resposta com o lembrete criado, todos destacados](img/p140-1.webp)

*Criando um lembrete no cluster pela porta do serviço NodePort.*

A seguir, faça também um **GET**, como na figura a seguir.

![Postman com um GET em localhost:30686/lembretes e a resposta com o lembrete Fazer café destacada](img/p140-2.webp)

*Obtendo os lembretes do microsserviço executado no cluster.*

Para ter certeza de que tudo deu certo, verifique os logs do Pod que executa o microsserviço de lembretes. Ele deve ter recebido um evento do barramento de eventos e exibido na saída padrão. Pegue o nome do Pod com

**Terminal**

```bash
kubectl get pods
```

Veja o resultado a seguir.

**Terminal**

```text
NAME                                                READY   STATUS    RESTARTS   AGE
barramento-de-eventos-deployment-6cb889765b-7xzjj   1/1     Running   0          28m
lembretes-deployment-78dc5fd895-lg9xr               1/1     Running   0          3m13s
```

A seguir, use

**Terminal**

```bash
kubectl logs nome_do_seu_pod
```

para visualizar seus logs. A saída deve ser parecida com a seguinte; a última linha mostra o evento recebido.

**Terminal**

```text
[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
Testando no Windows
Nova versão
Agora usando o Docker Hub
Lembretes. Porta 4000
Evento recebido: LembreteCriado
```

Caso a sua saída não exiba uma mensagem assim, pode ser que o seu microsserviço de lembretes não esteja registrando cada evento que recebe. Você pode ajustar isso como mostra o código a seguir. Estamos no arquivo `index.js` do microsserviço de lembretes.

**lembretes/index.js**

```javascript
...
app.post("/eventos", (req, res) => {
  console.log("Evento recebido: " + req.body.tipo);
  res.status(200).send({ msg: "ok" });
});
...
```

<aside class="negative">

**Nota.** Pode ser que um ou mais de seus microsserviços apresente alguma falha durante a execução, o que pode comprometer o funcionamento da solução como um todo. Nestes casos é recomendável verificar o log de cada Pod envolvido com `kubectl logs`. Se encontrar alguma mensagem de erro, investigue a sua causa e, se necessário, ajuste o código fonte. Depois disso, gere uma nova imagem Docker com `docker build`, envie a imagem para o Docker Hub com `docker push` e reinicie o Deployment envolvido com `kubectl rollout restart deployment`.

</aside>

## Exercício e encerramento
Duration: 20:00

### Exercício

Crie novos serviços Kubernetes do tipo Cluster IP e coloque os demais microsserviços em funcionamento. Faça um teste completo e certifique-se de que a solução está completamente funcional.

### Parabéns!

Você concluiu as três partes da apostila. Ao longo delas você:

* estudou arquitetura de software e a arquitetura baseada em microsserviços;
* construiu os microsserviços de lembretes, observações, consulta e classificação, ligados por um barramento de eventos próprio;
* executou cada microsserviço em um contêiner Docker;
* usou o Kubernetes para criar Deployments, Pods e Services, escalar, atualizar versões e fazer os microsserviços se comunicarem dentro do cluster.

### Referências

1. L. Bass, P. Clements e R. Kazman. *Software Architecture in Practice*. 3ª ed. Addison-Wesley Professional, 2012.
2. Dahl, R. *Node.js*. Disponível em: [https://nodejs.org/en/](https://nodejs.org/en/). Acesso em abril de 2021.
3. A. Fox e D. Patterson. *Engineering Software as a Service - An Agile Approach Using Cloud Computing*. 1ª ed. Strawberry Canyon LLC, 2018.
4. Martin Fowler. *Who Needs an Architect?* Disponível em: [https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf](https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf). Acesso em fevereiro de 2021.
5. TJ Holowaychuk. *Express - Node.js web application framework*. Disponível em: [https://expressjs.com](https://expressjs.com). Acesso em abril de 2021.
