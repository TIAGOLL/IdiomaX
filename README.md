<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/TIAGOLL/IdiomaX?color=%2304D361">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/TIAGOLL/IdiomaX">

  <a href="https://github.com/TIAGOLL/IdiomaX/commits/main">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/TIAGOLL/IdiomaX">
  </a>
    
   <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen">
   <a href="https://github.com/TIAGOLL/IdiomaX/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/TIAGOLL/IdiomaX?style=social">
  </a>

  <a href="https://www.tiagoll.vercel.app/">
    <img alt="Feito pela Rocketseat" src="https://img.shields.io/badge/feito%20por-Tiago-%237519C1">
  </a>
  
  <a href="https://www.tiagoll.vercel.app/">
    <img alt="Stargazers" src="https://img.shields.io/badge/Portfólio-%237159c1?style=flat&logo=ghost">
  </a>
  
 
</p>

## 💻 Sobre o projeto

📒 - Um app criado para solucionar problemas de uma escola de idiomas local

---

## ⚙️ Funcionalidades

### Admin

- [x] Cadastro de alunos
- [x] Cadastro de cursos
- [x] Cadastro de turmas
- [x] Cadastro de matrículas
- [x] Cadastro de livros (Vinculados ao Canva)
- [x] Cadastro de lições
- [x] Tela para customizar configurações internas do app
- [ ] Cadastro de professores
- [ ] Dashboard com informações sobre a escola
- [ ] Cadastro de permissões
- [ ] Quadro de funcionários

### Aluno

- [x] Vizualização do seu livro
- [x] Vizualização das suas tarefas
- [ ] Vizualização das suas aulas
- [ ] Vizualização do seu progresso
- [ ] Vizualização do seu boletim
- [ ] Vizualização do seu perfil
- [ ] Vizualização dos seus colegas de classe

## ⚙️ Features

---

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:

- **[Git](https://git-scm.com)**
- **[Node.js](https://nodejs.org/en/).**
- **[VSCode](https://code.visualstudio.com/)**

#### 🎲 Rodando a aplicação

Este projeto é divido em duas partes:

1. Backend (pasta server)
2. Frontend (pasta web)

💡O Frontend precisa que o Backend esteja sendo executado para funcionar.

```bash

# Clone este repositório
$ git clone https://github.com/TIAGOLL/IdiomaX.git

# Acesse a pasta do projeto no terminal/cmd
$ cd ./Back-end

# 💡Configure o arquivo .env

# Instale as dependências
$ pnpm install

# Crie o banco de dados
$ npx prisma db push

# Crie um modelo para sincronizar o banco de dados com o seeder
$ pnpm run sync

# Execute o seeder
$ npx prisma db seed


# Execute a aplicação em modo de desenvolvimento
$ pnpm run dev

# O servidor inciará na porta:3030 - acesse http://localhost:3030
# De um CTRL + clique no link acima para abrir no navegador

# Abra outro terminal e acesse a pasta do repositório
$ cd IdiomaX

# Vá para a pasta da aplicação Front-End
$  cd ./Front-end

# 💡Configure o arquivo .env

# Instale as dependências
$ pnpm install

# Execute a aplicação em modo de desenvolvimento
$ pnpm run dev

# O servidor inciará na porta:5173 - acesse http://localhost:5173
# De um CTRL + clique no link acima para abrir no navegador

```

---

## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

#### **Website** ([React](https://reactjs.org/))

- **React Router Dom**
- **Lucide-react**
- **Axios**
- **Toastfy**
- **Tailwind**
- **Vite**
- **Shadcn**
- **Zod**
- **Cypress**
- **Eslint**

> Veja o arquivo [package.json](https://github.com/TIAGOLL/IdiomaX/blob/main/frontend/package.json)

#### **Server** ([NodeJS](https://nodejs.org/en/))

- **Express**
- **Prisma**
- **Tsup**
- **Tsx**
- **Nodemon**
- **@snaplet/seed**

> Veja o arquivo [package.json](https://github.com/TIAGOLL/IdiomaX/blob/main/backend/package.json)

- Editor: **[Visual Studio Code](https://code.visualstudio.com/)**
- Teste de API: **[Postman](https://www.postman.com/)**
- Teste de E2E: **[Cypress](https://www.cypress.io/)**
- Ícones: **[Lucide](https://lucide.dev/icons/)**

---

## 💪 Como contribuir para o projeto

1. Faça um **fork** do projeto.
2. Crie uma nova branch com as suas alterações: `git checkout -b my-feature`
3. Salve as alterações e crie uma mensagem de commit contando o que você fez: `git commit -m "feature: My new feature"`
4. Envie as suas alterações: `git push origin my-feature`

---

## 🦸 Autor

<a href="https://www.tiagoll.vercel.app/">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/107972949?v=4" width="100px;" alt=""/>
 <br />
 <sub><b>Tiago Emanuel</b></sub></a> <a href="https://www.tiagoll.vercel.app/" title="Portfólio">🚀</a>
 <br />

[![Linkedin Badge](https://img.shields.io/badge/-Tiago-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/tiago-emanuel-de-lima)](https://www.linkedin.com/in/tiago-emanuel-de-lima)

---

## 📝 Licença

Este projeto esta sobe a licença [MIT](./LICENSE).

Feito com ❤️ por Tiago Emanuel 👋🏽 [Entre em contato!](https://www.linkedin.com/in/tiago-emanuel-de-lima)
