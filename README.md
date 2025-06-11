# Projeto Boscov - Frontend

Este é o frontend do Projeto Boscov, desenvolvido com **React**, **Next.js (App Router)** e **Tailwind CSS**.

> ⚠️ **Antes de iniciar este projeto, é necessário que o backend esteja em execução.**
> Acesse: [https://github.com/dxyrell/Projeto-Boscov](https://github.com/dxyrell/Projeto-Boscov)

---

## 🚀 Pré-requisitos

* Node.js v18+
* Git
* Backend rodando localmente ou em ambiente acessível via HTTP
* Token ou mecanismo de autenticação configurado (se aplicável)

---

## 🔧 Instalação

Clone o repositório:

```bash
git clone https://github.com/dxyrell/Projeto-Boscov-Frontend.git
cd Projeto-Boscov-Frontend
```

Instale as dependências:

```bash
npm install --force
```

---

## ▶️ Executando em modo de desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto estará disponível em:

```
http://localhost:3000
```

---

## 🌐 Integração com o Backend

Certifique-se de que o backend está rodando em:

```
http://localhost:3000
```

Caso precise alterar a URL da API, edite o arquivo:

```ts
// lib/api.ts
const API_BASE_URL = "http://localhost:3000";
```

---

## 📁 Estrutura do Projeto

```bash
app/              # Páginas e rotas (Next.js App Router)
components/       # Componentes reutilizáveis
contexts/         # Context API (ex: AuthContext)
hooks/            # Hooks personalizados (ex: useToast)
lib/              # API client e utilitários
public/           # Assets públicos (imagens, ícones, etc)
styles/           # Arquivos CSS globais
```

---

## ✨ Tecnologias Utilizadas

* [React](https://reactjs.org/)
* [Next.js](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [ShadCN UI](https://ui.shadcn.dev/) (Componentes visuais)
* [TypeScript](https://www.typescriptlang.org/)

---

## 🤝 Contribuições

Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro para discutir o que você gostaria de modificar.

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
