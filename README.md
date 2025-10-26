# 📚 Sistema de Controle de Acesso à Biblioteca  

Aplicação web desenvolvida para **gerenciar e monitorar o acesso de alunos à biblioteca** de uma instituição de ensino.  
O sistema oferece **telas de cadastro, listagem e dashboard**, com áreas restritas acessíveis apenas por autenticação.  

---

## 🚀 Funcionalidades principais

- 🧾 **Cadastro de alunos:** registra nome, curso, período e data de entrada.  
- 📋 **Listagem de registros:** exibe todos os alunos que acessaram a biblioteca.  
- 📊 **Dashboard interativo:** mostra estatísticas gerais de uso.  
- 🔒 **Rotas protegidas:** apenas o bibliotecário tem acesso à listagem e ao painel.  
- 💬 **Modal de autenticação:** login direto pela Navbar.  
- 🧠 **Gerenciamento global de autenticação** com Context API.  

---

## 🧩 Tecnologias utilizadas

- **React.js** — construção da interface e componentes dinâmicos.  
- **React Router DOM** — controle de navegação e proteção de rotas.  
- **Node.js** — execução do servidor e integração com o backend.  
- **Express.js** — criação das rotas e controle da API.  
- **Firebase** — armazenamento de dados não-relacional e autenticação.  
- **CSS** — estilização e responsividade da aplicação.

---

## ⚙️ Como executar o projeto

### 🔧 Pré-requisitos
Antes de começar, você precisa ter instalado:
- [Node.js](https://nodejs.org/)  
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)  

---

## 💻 Passo a passo

### 👨‍💻 Front-End:

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git
2. **Acesse o diretório do projeto**
    ```bash
    cd nome-do-repositorio
3. **Acesse a pasta especifica do Front-End**
    ```bash
    cd frontend
4. **Instale as dependências**
   ```bash
   npm install
5. **Execute o Front-End** 
   ```bash
    npm start
6. **O aplicativo será executado em:**
   ```bash
   http://localhos:3000
   
### 🧑‍💻 Back-End:
1. **Na mesma pasta aonde acessamos o Front-End Acesse o Back-End**
   ```bash
    cd backend
2. **Instale as dependências**
    ```bash
    npm install
3. **Configure o arquivo .env com as credenciais da sua conta do Firebase**
    ```bash
    exemplo:
    API_KEY=sua_api_key
    AUTH_DOMAIN=seu_auth_domain
    PROJECT_ID=seu_project_id
    STORAGE_BUCKET=seu_storage_bucket
    MESSAGING_SENDER_ID=seu_messaging_sender_id
    APP_ID=seu_app_id
    MEASUREMENT_ID=seu_measurement_id

4. **Execute o Back-End**
    ```bash
    npm run dev
5. **O Back-End será executado na:**
    ```bash
    port: 3332

---
    
### 🔐 Destaques técnicos

  Implementação de rotas privadas com autenticação via modal.
  
  Utilização de um banco não relacional.
  
  Interface intuitiva e responsiva para facilitar o uso por bibliotecários.

---

### 🧾 Objetivo do projeto

Criar uma ferramenta simples e eficiente para controlar o fluxo de entrada de alunos na biblioteca, permitindo uma gestão segura e organizada dos registros de acesso.

---

### 👨‍💻 Autor

Guilherme Andrade
📍 São Paulo, Brasil
🎓 ETEC — Escola Técnica Estadual de São Paulo
🔗 LinkedIn
💻 GitHub

---

### 🤝 Colaboradores

Agradecimento especial a quem contribuiu para o desenvolvimento deste projeto:

👩‍💻 Gisely Aguiar
 — colaboração na implementação das rotas privadas e na lógica de autenticação com modal.
