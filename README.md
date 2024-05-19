# Ao Redor Dos EUA - Full Stack

Esse projeto faz parte da Sprint 16 do curso de Desenvolvedor Web da TripleTen. Este projeto consiste na criação de uma página web onde os usuários podem se registrar, fazer login, adicionar, remover e curtir fotos, além de editar informações e o avatar de seus perfis. Foram utilizadas biblioteca React para criar o aplicativo, foi feita refatoração do código do projeto anterior e adicionada uma página de registro e login com rotas protegidas, além disso, foi feita a criação de um servidor.

## Funcionalidades

- Utilização de Estados e Contextos para os botões de abertura e fechamento dos popups, submit e like dos cartões.
- Utilização dos Hooks Route, Switch, withRouter e useHistory para navegação entre páginas.
- Proteção da página principal com o componente "Protected Route", acessível apenas através do login de usuário registrado.
- Utilização do componente "Infotooltip" para alertar o usuário sobre o sucesso ou falha no registro.
- Implementação da Autorização para a URL própria, utilizando o método POST para login e registro e GET para obtenção do token que permite que o usuário permaneça logado.
- Criação de uma API própria.
- Criação de Esquemas e Modelos (GET, POST, PUT, DELETE para os cartões; GET e PATCH para usuários).
- Criação de rotas e controladores.
- Manipulacao de erros centralizada.

## Tecnologias Utilizadas

### Back-end

- JavaScript
- Node.js
- Express

### Front-end

- HTML
- CSS
- JavaScript/JSX
- React

## Acesso ao Aplicativo

O aplicativo está disponível em [https://devparaense.chickenkiller.com](https://devparaense.chickenkiller.com).