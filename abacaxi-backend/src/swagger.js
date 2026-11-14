// Especificação OpenAPI 3.0 da API da Fazenda de Abacaxis
const JSON_MIME = 'application/json';
const TIPO_STRING = 'string';
const TIPO_INTEIRO = 'integer';
const TIPO_OBJETO = 'object';
const FORMATO_DATA_HORA = 'date-time';
const TAG_COLHEITAS = 'Colheitas';
const TAG_VENDAS = 'Vendas';
const DATA_EXEMPLO = '2026-11-13';

const SCHEMA_ERRO = { $ref: '#/components/schemas/Erro' };
const SEGURANCA_BEARER = [{ bearerAuth: [] }];

function respostaJson(description, schema, example) {
  return {
    description,
    content: {
      [JSON_MIME]: example === undefined ? { schema } : { schema, example },
    },
  };
}

function corpoJson(schema) {
  return {
    required: true,
    content: {
      [JSON_MIME]: { schema },
    },
  };
}

const RESPOSTA_NAO_AUTORIZADO = respostaJson('Token ausente, inválido ou expirado', SCHEMA_ERRO);

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API da Fazenda de Abacaxis 🍍',
    version: '1.0.0',
    description:
      'API REST para autenticação JWT, registro de colheitas, controle de vendas, cálculo dinâmico de estoque e resumo de faturamento.',
  },
  servers: [{ url: '/', description: 'Servidor atual' }],
  tags: [
    { name: 'Status', description: 'Verificação de saúde da API' },
    { name: 'Autenticação', description: 'Login e geração de token JWT' },
    { name: TAG_COLHEITAS, description: 'Cadastro e listagem de colheitas' },
    { name: TAG_VENDAS, description: 'Cadastro e listagem de vendas (com validação de estoque)' },
    { name: 'Resumo', description: 'Indicadores gerais do painel' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Cole aqui o token retornado pela rota POST /auth/login',
      },
    },
    schemas: {
      Erro: {
        type: TIPO_OBJETO,
        properties: {
          erro: { type: TIPO_STRING, example: 'Mensagem explicativa do erro' },
        },
      },
      LoginRequest: {
        type: TIPO_OBJETO,
        required: ['usuario', 'senha'],
        properties: {
          usuario: { type: TIPO_STRING, example: 'admin' },
          senha: {
            type: TIPO_STRING,
            format: 'password',
            description: 'Senha configurada em ADMIN_PASSWORD',
          },
        },
      },
      LoginResponse: {
        type: TIPO_OBJETO,
        properties: {
          token: { type: TIPO_STRING, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          usuario: { type: TIPO_STRING, example: 'admin' },
        },
      },
      Colheita: {
        type: TIPO_OBJETO,
        properties: {
          id: { type: TIPO_INTEIRO, example: 1 },
          data: { type: TIPO_STRING, format: 'date', example: DATA_EXEMPLO },
          quantidade: { type: TIPO_INTEIRO, example: 100 },
          observacao: { type: TIPO_STRING, nullable: true, example: 'Lote da manhã' },
          createdAt: { type: TIPO_STRING, format: FORMATO_DATA_HORA },
          updatedAt: { type: TIPO_STRING, format: FORMATO_DATA_HORA },
        },
      },
      NovaColheita: {
        type: TIPO_OBJETO,
        required: ['data', 'quantidade'],
        properties: {
          data: { type: TIPO_STRING, format: 'date', example: DATA_EXEMPLO },
          quantidade: { type: TIPO_INTEIRO, minimum: 1, example: 100 },
          observacao: { type: TIPO_STRING, example: 'Lote da manhã' },
        },
      },
      Venda: {
        type: TIPO_OBJETO,
        properties: {
          id: { type: TIPO_INTEIRO, example: 1 },
          data: { type: TIPO_STRING, format: 'date', example: DATA_EXEMPLO },
          quantidade: { type: TIPO_INTEIRO, example: 25 },
          preco_unitario: { type: TIPO_STRING, example: '8.50' },
          cliente: { type: TIPO_STRING, nullable: true, example: 'Supermercado Tropical' },
          createdAt: { type: TIPO_STRING, format: FORMATO_DATA_HORA },
          updatedAt: { type: TIPO_STRING, format: FORMATO_DATA_HORA },
        },
      },
      NovaVenda: {
        type: TIPO_OBJETO,
        required: ['data', 'quantidade', 'preco_unitario'],
        properties: {
          data: { type: TIPO_STRING, format: 'date', example: DATA_EXEMPLO },
          quantidade: { type: TIPO_INTEIRO, minimum: 1, example: 25 },
          preco_unitario: { type: 'number', minimum: 0.01, example: 8.5 },
          cliente: { type: TIPO_STRING, example: 'Supermercado Tropical' },
        },
      },
      Resumo: {
        type: TIPO_OBJETO,
        properties: {
          colhido: { type: TIPO_INTEIRO, example: 100 },
          vendido: { type: TIPO_INTEIRO, example: 25 },
          estoque: { type: TIPO_INTEIRO, example: 75 },
          faturamento: { type: 'number', example: 212.5 },
        },
      },
    },
  },
  paths: {
    '/': {
      get: {
        tags: ['Status'],
        summary: 'Testa se a API está no ar',
        responses: {
          200: respostaJson('API operacional', {
            type: TIPO_OBJETO,
            properties: {
              status: { type: TIPO_STRING, example: 'ok' },
              mensagem: { type: TIPO_STRING, example: 'API da Fazenda de Abacaxis 🍍' },
            },
          }),
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Autentica um usuário e retorna o token JWT (expira em 8h)',
        requestBody: corpoJson({ $ref: '#/components/schemas/LoginRequest' }),
        responses: {
          200: respostaJson('Login realizado com sucesso', {
            $ref: '#/components/schemas/LoginResponse',
          }),
          401: respostaJson('Credenciais inválidas', SCHEMA_ERRO, {
            erro: 'Usuário ou senha inválidos',
          }),
        },
      },
    },
    '/colheitas': {
      get: {
        tags: [TAG_COLHEITAS],
        summary: 'Lista todas as colheitas (mais recentes primeiro)',
        security: SEGURANCA_BEARER,
        responses: {
          200: respostaJson('Lista de colheitas', {
            type: 'array',
            items: { $ref: '#/components/schemas/Colheita' },
          }),
          401: RESPOSTA_NAO_AUTORIZADO,
        },
      },
      post: {
        tags: [TAG_COLHEITAS],
        summary: 'Registra uma nova colheita',
        security: SEGURANCA_BEARER,
        requestBody: corpoJson({ $ref: '#/components/schemas/NovaColheita' }),
        responses: {
          201: respostaJson('Colheita registrada', { $ref: '#/components/schemas/Colheita' }),
          400: respostaJson('Dados inválidos', SCHEMA_ERRO, {
            erro: 'Informe a data e uma quantidade maior que zero',
          }),
          401: RESPOSTA_NAO_AUTORIZADO,
        },
      },
    },
    '/colheitas/{id}': {
      delete: {
        tags: [TAG_COLHEITAS],
        summary: 'Exclui uma colheita (bloqueado se os abacaxis já tiverem sido vendidos)',
        security: SEGURANCA_BEARER,
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: TIPO_INTEIRO },
            description: 'ID da colheita',
          },
        ],
        responses: {
          204: { description: 'Colheita excluída com sucesso' },
          400: respostaJson('Exclusão deixaria o estoque negativo', SCHEMA_ERRO, {
            erro: 'Não é possível excluir: os abacaxis desta colheita já foram vendidos',
          }),
          401: RESPOSTA_NAO_AUTORIZADO,
          404: respostaJson('Colheita não encontrada', SCHEMA_ERRO, {
            erro: 'Colheita não encontrada',
          }),
        },
      },
    },
    '/vendas': {
      get: {
        tags: [TAG_VENDAS],
        summary: 'Lista todas as vendas (mais recentes primeiro)',
        security: SEGURANCA_BEARER,
        responses: {
          200: respostaJson('Lista de vendas', {
            type: 'array',
            items: { $ref: '#/components/schemas/Venda' },
          }),
          401: RESPOSTA_NAO_AUTORIZADO,
        },
      },
      post: {
        tags: [TAG_VENDAS],
        summary: 'Registra uma nova venda (valida se há estoque suficiente)',
        security: SEGURANCA_BEARER,
        requestBody: corpoJson({ $ref: '#/components/schemas/NovaVenda' }),
        responses: {
          201: respostaJson('Venda registrada', { $ref: '#/components/schemas/Venda' }),
          400: respostaJson('Dados inválidos ou estoque insuficiente', SCHEMA_ERRO, {
            erro: 'Estoque insuficiente. Disponível: 10',
          }),
          401: RESPOSTA_NAO_AUTORIZADO,
        },
      },
    },
    '/vendas/{id}': {
      delete: {
        tags: [TAG_VENDAS],
        summary: 'Exclui uma venda',
        security: SEGURANCA_BEARER,
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: TIPO_INTEIRO },
            description: 'ID da venda',
          },
        ],
        responses: {
          204: { description: 'Venda excluída com sucesso' },
          401: RESPOSTA_NAO_AUTORIZADO,
          404: respostaJson('Venda não encontrada', SCHEMA_ERRO, {
            erro: 'Venda não encontrada',
          }),
        },
      },
    },
    '/resumo': {
      get: {
        tags: ['Resumo'],
        summary: 'Retorna totais colhidos, vendidos, estoque atual e faturamento',
        security: SEGURANCA_BEARER,
        responses: {
          200: respostaJson('Totais consolidados', { $ref: '#/components/schemas/Resumo' }),
          401: RESPOSTA_NAO_AUTORIZADO,
        },
      },
    },
  },
};

module.exports = swaggerSpec;
