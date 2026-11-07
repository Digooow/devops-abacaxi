# Instruções do GitHub Copilot — DevOps Abacaxi 🍍

## Visão Geral e Propósito

Este repositório (**Fazenda de Abacaxis**) é um **projeto didático** criado para ensinar deploy de aplicações web full-stack no **Render (plano gratuito)**. O sistema gerencia login, colheitas, vendas, controle de estoque e faturamento de uma fazenda de abacaxis.

### Diretrizes Fundamentais
- **Preserve a simplicidade didática**: A clareza e o código enxuto são intencionais. **Não** introduza TypeScript, novas bibliotecas (como `axios`, `react-router-dom`, Tailwind, Redux/Zustand, Prisma, bibliotecas de validação/migração) ou arquiteturas em múltiplas camadas (`controllers/`, `services/`, `repositories/`) a menos que seja explicitamente solicitado.
- **Idioma (pt-BR)**: Mantenha nomes de variáveis, funções, rotas, modelos/colunas do banco, comentários, textos de interface e mensagens de erro em **Português (pt-BR)**.

---

## Estrutura do Repositório

**Não há `package.json` na raiz.** O repositório contém dois projetos Node.js (`>=20`) independentes, publicados como serviços separados no Render (usando a configuração *Root Directory*):

```text
devops-abacaxi/
├── abacaxi-backend/          # Web Service no Render — API REST (CommonJS)
│   ├── docker-compose.yml    # MySQL 8.0 local (porta 3306, banco fazenda_abacaxi)
│   ├── .env.example          # Template de variáveis de ambiente da API
│   └── src/
│       ├── server.js         # Entrypoint, middlewares, sync do banco e seed do admin
│       ├── database.js       # Seleção automática: PostgreSQL (DATABASE_URL) ou MySQL (DB_*)
│       ├── models.js         # Modelos Sequelize: Usuario, Colheita, Venda
│       ├── estoque.js        # Cálculo dinâmico de estoque (colhido - vendido)
│       ├── middleware/auth.js# Validação de JWT (Authorization: Bearer <token>)
│       └── routes/           # Rotas: auth.js, colheitas.js, vendas.js, resumo.js
└── abacaxi-frontend/         # Static Site no Render — SPA React + Vite (ES Modules)
    ├── .env.example          # Template com VITE_API_URL
    └── src/
        ├── main.jsx          # Ponto de entrada React
        ├── App.jsx           # Controle de sessão e navegação por estado
        ├── api.js            # Wrapper de fetch + formatadores (data, moeda, hoje)
        ├── styles.css        # Folha de estilos global única
        └── pages/            # Telas: Login.jsx, Painel.jsx, Colheitas.jsx, Vendas.jsx
```

---

## Backend (`abacaxi-backend/`)

> 📖 **Instruções Detalhadas do Backend:**
> Consulte [Instruções do Copilot para Backend](abacaxi-backend/copilot-instructions.md) para convenções de models, rotas, regras de estoque dinâmico e ports de banco.

### Stack e Convenções de Código
- **Runtime e Módulos**: Node.js `>=20` usando **CommonJS** (`require` / `module.exports`). Não misture sintaxe ES Modules (`import`/`export`) no backend.
- **Express 5 (`^5.1.0`)**: O Express 5 captura automaticamente *promises* rejeitadas em handlers `async` e encaminha para o middleware global de erro em `src/server.js`. Evite blocos `try/catch` repetitivos nas rotas, exceto quando precisar tratar um erro específico.

### Banco de Dados Dual (`src/database.js`)
- **Produção (Render)**: Se `process.env.DATABASE_URL` existir, usa **PostgreSQL** (`pg`). `DB_SSL=true` só é necessário para *External Database URL*.
- **Desenvolvimento local**: Sem `DATABASE_URL`, usa **MySQL** (`mysql2`) via `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASSWORD`.
- **Portabilidade obrigatória**: Escreva consultas exclusivamente pela API do **Sequelize** (`DataTypes`, `findAll`, `sum`, `create`, `destroy`). Nunca use SQL puro específico de MySQL ou PostgreSQL.
- **Cuidado com `DECIMAL`**: `Venda.preco_unitario` usa `DataTypes.DECIMAL(10, 2)`, que drivers do Sequelize retornam como `string`. Sempre converta com `Number(v.preco_unitario)` antes de cálculos matemáticos (veja `src/routes/resumo.js`).

### Inicialização Zero-CLI (`src/server.js`)
- No plano gratuito do Render **não há acesso a Shell nem Pre-Deploy Command**.
- Por isso, `iniciar()` executa `sequelize.authenticate()`, `sequelize.sync()` e `criarAdmin()` automaticamente ao subir a API. Qualquer nova tabela ou dado inicial obrigatório deve funcionar automaticamente na inicialização, sem depender de comandos manuais no terminal.

### Regras de Negócio e Contrato da API
- **Estoque dinâmico (`src/estoque.js`)**: `calcularEstoque()` calcula `{ colhido, vendido, estoque: colhido - vendido }` somando registros no banco. Não crie coluna física de estoque para evitar inconsistências.
- **Invariantes de estoque**:
  - `POST /vendas`: Rejeitar com `400` se `quantidade > estoque`.
  - `DELETE /colheitas/:id`: Rejeitar com `400` se `estoque - colheita.quantidade < 0` (impede excluir colheitas cujos abacaxis já foram vendidos).
- **Formato padrão de erro**: Sempre retorne JSON no formato `{ erro: 'Mensagem em português' }` com o status HTTP adequado (`400`, `401`, `404`, `500`). O frontend (`src/api.js`) lê especificamente a propriedade `dados.erro`.
- **Remoções (`DELETE`)**: Retorne `204 No Content` (`res.status(204).end()`).
- **Autenticação e Segurança**:
  - Rotas públicas: `GET /` (healthcheck usado pelo Render) e `POST /auth/login` (retorna `{ token, usuario }`, expiração de `8h`).
  - Demais rotas (`/colheitas`, `/vendas`, `/resumo`) exigem o middleware `src/middleware/auth.js`.
  - CORS liberado via `process.env.FRONTEND_URL` (sempre **sem barra `/` no final**).

---

## Frontend (`abacaxi-frontend/`)

> 📖 **Documentação Visual & Instruções Detalhadas:**
> - [Guia de Estilo Visual & Design System](abacaxi-frontend/STYLEGUIDE.md) — cores, fontes, ícones, botões e componentes.
> - [Instruções do Copilot para Frontend](abacaxi-frontend/copilot-instructions.md) — regras específicas para criação e manutenção do frontend.

### Stack e Convenções de Código
- **React 18 + Vite 6** com **ES Modules** (`"type": "module"`). Zero dependências extras em produção além de `react` e `react-dom`.
- **Navegação por estado (`src/App.jsx`)**: A troca de telas (`painel`, `colheitas`, `vendas`) usa `useState` em vez de rotas por URL, garantindo funcionamento imediato como *Static Site* no Render sem regras de *rewrite*. A sessão usa `localStorage` (`token` e `usuario`).
- **Comunicação com a API (`src/api.js`)**:
  - Centralize todas as chamadas HTTP na função `api(caminho, { method, body })`. Ela injeta o `Bearer` token, trata `204` retornando `null`, recarrega a página em `401` (token expirado) e lança `Error(dados.erro)` em falhas.
  - A variável `VITE_API_URL` é embutida **em tempo de build** pelo Vite (`import.meta.env.VITE_API_URL`).
  - Reutilize os utilitários exportados por `src/api.js`: `formatarData` (`AAAA-MM-DD` → `DD/MM/AAAA`), `formatarReais` (`BRL`) e `hoje` (`AAAA-MM-DD`).
- **Estilização e Cenário (`src/styles.css`, `src/FundoBiquini.jsx`)**: Mantenha os estilos centralizados em `src/styles.css` seguindo o tema submarino **Fenda do Biquíni / Bob Esponja** documentado em `abacaxi-frontend/STYLEGUIDE.md`, reutilizando as classes existentes (`.card`, `.formulario`, `.tabela`, `.indicadores`, `.login`, `.erro`, `.dica`, `button.excluir`, `button.ativo`).
- **Internacionalização (`src/i18n.jsx`)**: Suporte nativo a Português (`pt`, padrão), Inglês (`en`) e Chinês (`zh`), com seletor de bandeiras em SVG inline sem texto e persistência em `localStorage` (`idioma`).
- **Cold Start no Render Free**: O Web Service gratuito do Render hiberna após 15 minutos sem uso e leva ~1 minuto para acordar (por isso `Login.jsx` exibe `.dica` durante o carregamento).

---

## Fluxo de Desenvolvimento e Comandos

Sempre execute comandos `npm` **dentro** de `abacaxi-backend/` ou `abacaxi-frontend/` (nunca na raiz):

```bash
# Subir banco MySQL local (Docker)
cd abacaxi-backend && docker compose up -d

# Rodar API em modo desenvolvimento (http://localhost:3001 — login padrão: admin / admin123)
cd abacaxi-backend
npm install
cp .env.example .env   # manter DATABASE_URL comentada localmente
npm run dev            # node --watch src/server.js

# Rodar Frontend em modo desenvolvimento (http://localhost:5173)
cd abacaxi-frontend
npm install
cp .env.example .env
npm run dev            # vite

# Validar build de produção do Frontend (gera dist/)
cd abacaxi-frontend && npm run build
```

### Variáveis de Ambiente e Verificação
- **Segurança**: Nunca versione arquivos `.env`. Sempre que criar ou alterar uma variável de ambiente, atualize o `.env.example` correspondente (e a documentação nos `README.md`, se aplicável).
- **Verificação de mudanças**: Não há suíte de testes automatizados configurada no projeto. Ao modificar código:
  - No **frontend**, valide executando `npm run build` em `abacaxi-frontend/`.
  - No **backend**, valide a sintaxe (`node --check src/...`) e inicialização/rotas da API.
