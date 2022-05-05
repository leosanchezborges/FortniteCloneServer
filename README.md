# FortniteCloneServer

O objetivo do projeto é criar um jogo similar ao popular "Fortnite", com suporte para partidas multijogador, formação de grupos para jogar e criação de "salas" de jogo.

![Fortnite](https://cdn2.unrealengine.com/fortnite-chapter-3-season-2-1900x600-c561fe397af1.jpg)

## Dependências

- [VsCode](https://code.visualstudio.com/download)
  - Plugins:
    - Docker
    - Remote - Container
- [Node.js](https://nodejs.org/en/download/)
- [Docker (versão 3)](https://docs.docker.com/desktop/windows/install/)
- [Dynamoose](https://dynamoosejs.com/guide/Document)

## Testes de requisicao

Na pasta docks existem os arquivos do post para realizar os testes de acesso ao endpoints do servidor. Para isso instale o [Postman](https://www.postman.com/downloads/) e importe os arquivosa necessarios.

## Meu Historico

~~~bash
mkdir FortniteCloneServer # cria a pasta
cd FortniteCloneServer/   # entra na pasta
npm init                  # inicializa um novo projeto
npm install express       # instala o modulo no projeto
npm i -g nodemon          # instala o modulo de forma geral
npm start                 # liga o servidor outra opcao seria `node index.js`
~~~
