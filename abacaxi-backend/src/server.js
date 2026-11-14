require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { sequelize, Usuario } = require('./models');
const auth = require('./middleware/auth');

const app = express();
app.disable('x-powered-by');

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Rota pública para testar se a API está no ar (usada também pelo Render)
app.get('/', (req, res) => {
  res.json({ status: 'ok', mensagem: 'API da Fazenda de Abacaxis 🍍' });
});

// Documentação interativa Swagger / OpenAPI
app.get('/docs.json', (req, res) => res.json(swaggerSpec));
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'API Fazenda de Abacaxis — Swagger 🍍',
    swaggerOptions: { persistAuthorization: true },
  })
);

app.use('/auth', require('./routes/auth'));

// Rotas protegidas: exigem login
app.use('/colheitas', auth, require('./routes/colheitas'));
app.use('/vendas', auth, require('./routes/vendas'));
app.use('/resumo', auth, require('./routes/resumo'));

// Tratamento de erros inesperados
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err);
  return res.status(500).json({ erro: 'Erro interno no servidor' });
});

// Cria o usuário administrador se ele ainda não existir
async function criarAdmin() {
  const usuario = process.env.ADMIN_USER || 'admin';
  const senhaInicial = process.env.ADMIN_PASSWORD;
  const existe = await Usuario.findOne({ where: { usuario } });
  if (!existe) {
    if (!senhaInicial) {
      console.warn(`ADMIN_PASSWORD não definida; usuário "${usuario}" não criado automaticamente.`);
      return;
    }
    const senha_hash = await bcrypt.hash(senhaInicial, 10);
    await Usuario.create({ usuario, senha_hash });
    console.log(`Usuário "${usuario}" criado`);
  }
}

async function iniciar() {
  await sequelize.authenticate();
  await sequelize.sync(); // cria as tabelas que ainda não existem
  await criarAdmin();

  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
    console.log(`Swagger disponível em http://localhost:${port}/docs`);
  });
}

iniciar().catch((err) => {
  console.error('Falha ao iniciar a API:', err.message);
  process.exit(1);
});
