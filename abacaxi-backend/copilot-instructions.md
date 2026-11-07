# Instruções do GitHub Copilot — Backend (API da Fazenda de Abacaxis) 🍍

Estas instruções aplicam-se a qualquer alteração ou criação de código dentro do diretório `abacaxi-backend/`.

---

## 1. Princípios e Diretrizes Gerais

- **Foco Didático e Simplicidade**: Esta API em **Node.js (>=20) + Express 5** foi criada para ensinar deploy no plano gratuito do Render. Mantenha o código enxuto, legível e direto ao ponto.
- **Proibição de Complexidade Desnecessária**:
  - **NÃO introduza** TypeScript.
  - **NÃO crie** camadas excessivas de abstração (`controllers/`, `services/`, `repositories/`, `dto/`). A arquitetura simples com rotas diretas chamando o Sequelize e funções utilitárias é intencional.
  - **NÃO instale** outros ORMs ou Query Builders (como Prisma, TypeORM ou Knex). Use exclusivamente o **Sequelize 6**.
  - **NÃO adicione** bibliotecas de validação pesadas (como `zod` ou `joi`). As validações simples com `if (!campo)` atendem ao escopo do projeto.
- **Idioma**: Nomes de arquivos, rotas, variáveis, funções, modelos, colunas do banco e mensagens de erro devem ser em **Português (pt-BR)**.
- **Módulos**: Use **CommonJS** (`require` / `module.exports`). Não use sintaxe ES Modules (`import`/`export`).

---

## 2. Banco de Dados Dual e Portabilidade ([src/database.js](file:///c:/Users/rodrigo62289216/Desktop/devops-abacaxi/abacaxi-backend/src/database.js))

- **PostgreSQL em Produção**: Se a variável `process.env.DATABASE_URL` estiver preenchida (ambiente Render), a API conecta automaticamente no PostgreSQL via driver `pg`. `DB_SSL=true` é usado apenas para a External URL.
- **MySQL em Desenvolvimento Local**: Sem `DATABASE_URL`, a API conecta ao MySQL via `mysql2` usando as variáveis `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASSWORD`.
- **Regra de Ouro**: **Nunca escreva SQL bruto** (queries manuais com `sequelize.query()`) dependente de sintaxe MySQL ou PostgreSQL. Use sempre métodos do Sequelize (`Model.findAll()`, `Model.sum()`, `Model.create()`, `Model.destroy()`).
- **Valores Monetários (`DECIMAL`)**:
  - `Venda.preco_unitario` é configurado como `DataTypes.DECIMAL(10, 2)`.
  - Drivers de banco retornam campos `DECIMAL` como `string`. Sempre converta com `Number(v.preco_unitario)` antes de cálculos matemáticos.

---

## 3. Inicialização Zero-CLI ([src/server.js](file:///c:/Users/rodrigo62289216/Desktop/devops-abacaxi/abacaxi-backend/src/server.js))

- No plano Free do Render **não há acesso a Terminal SSH nem Pre-Deploy Command**.
- Por isso, a função `iniciar()` roda `sequelize.sync()` para criar tabelas automaticamente e `criarAdmin()` para semear o usuário inicial com senha hash via `bcryptjs`.
- Se criar novos modelos ou dados necessários para o sistema inicializar, garanta que sejam criados automaticamente na inicialização, sem exigir comandos manuais do aluno.

---

## 4. Regras de Negócio e Contratos de API

### 4.1 Cálculo Dinâmico de Estoque ([src/estoque.js](file:///c:/Users/rodrigo62289216/Desktop/devops-abacaxi/abacaxi-backend/src/estoque.js))
- O estoque nunca é armazenado em coluna física para evitar inconsistências.
- `calcularEstoque()` calcula dinamicamente:
  `colhido = sum('quantidade') de Colheita`
  `vendido = sum('quantidade') de Venda`
  `estoque = colhido - vendido`
- **Validação em Vendas (`POST /vendas`)**: Se `quantidade > estoque`, rejeite com status `400` e `{ erro: 'Estoque insuficiente. Disponível: ...' }`.
- **Validação em Colheitas (`DELETE /colheitas/:id`)**: Se `estoque - colheita.quantidade < 0`, rejeite com status `400` e `{ erro: 'Não é possível excluir: os abacaxis desta colheita já foram vendidos' }`.

### 4.2 Respostas de Erro e Sucesso
- **Erros**: Sempre retorne `{ erro: 'Mensagem explicativa em português' }` com o código HTTP correto (`400`, `401`, `404`, `500`).
- **Exclusões**: Em operações `DELETE` bem-sucedidas, responda com status `204 No Content` (`res.status(204).end()`).
- **Express 5**: Rejeições de promises assíncronas nas rotas são capturadas automaticamente pelo middleware global de erro em `src/server.js`.

### 4.3 Autenticação e Rotas Protegidas
- Rota pública de healthcheck: `GET /` -> `{ status: 'ok', mensagem: 'API da Fazenda de Abacaxis 🍍' }`.
- Rota pública de login: `POST /auth/login` -> `{ token, usuario }` (token JWT assinado com `JWT_SECRET`, expira em `8h`).
- Rotas protegidas devem incluir o middleware `auth`:
  ```javascript
  const auth = require('./middleware/auth');
  app.use('/colheitas', auth, require('./routes/colheitas'));
  ```

---

## 5. Comandos de Desenvolvimento Local

```bash
# Subir MySQL via Docker
cd abacaxi-backend && docker compose up -d

# Instalar dependências
cd abacaxi-backend && npm install

# Rodar em desenvolvimento com auto-reload
npm run dev

# Verificar sintaxe sem rodar o servidor
node --check src/server.js
```
