// Especificação OpenAPI 3.0 da API da Fazenda de Abacaxis
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
    { name: 'Colheitas', description: 'Cadastro e listagem de colheitas' },
    { name: 'Vendas', description: 'Cadastro e listagem de vendas (com validação de estoque)' },
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
        type: 'object',
        properties: {
          erro: { type: 'string', example: 'Mensagem explicativa do erro' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['usuario', 'senha'],
        properties: {
          usuario: { type: 'string', example: 'admin' },
          senha: { type: 'string', format: 'password', example: 'admin123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          usuario: { type: 'string', example: 'admin' },
        },
      },
      Colheita: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          data: { type: 'string', format: 'date', example: '2026-11-13' },
          quantidade: { type: 'integer', example: 100 },
          observacao: { type: 'string', nullable: true, example: 'Lote da manhã' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      NovaColheita: {
        type: 'object',
        required: ['data', 'quantidade'],
        properties: {
          data: { type: 'string', format: 'date', example: '2026-11-13' },
          quantidade: { type: 'integer', minimum: 1, example: 100 },
          observacao: { type: 'string', example: 'Lote da manhã' },
        },
      },
      Venda: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          data: { type: 'string', format: 'date', example: '2026-11-13' },
          quantidade: { type: 'integer', example: 25 },
          preco_unitario: { type: 'string', example: '8.50' },
          cliente: { type: 'string', nullable: true, example: 'Supermercado Tropical' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      NovaVenda: {
        type: 'object',
        required: ['data', 'quantidade', 'preco_unitario'],
        properties: {
          data: { type: 'string', format: 'date', example: '2026-11-13' },
          quantidade: { type: 'integer', minimum: 1, example: 25 },
          preco_unitario: { type: 'number', minimum: 0.01, example: 8.5 },
          cliente: { type: 'string', example: 'Supermercado Tropical' },
        },
      },
      Resumo: {
        type: 'object',
        properties: {
          colhido: { type: 'integer', example: 100 },
          vendido: { type: 'integer', example: 25 },
          estoque: { type: 'integer', example: 75 },
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
          200: {
            description: 'API operacional',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    mensagem: { type: 'string', example: 'API da Fazenda de Abacaxis 🍍' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Autentica um usuário e retorna o token JWT (expira em 8h)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          401: {
            description: 'Credenciais inválidas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { erro: 'Usuário ou senha inválidos' },
              },
            },
          },
        },
      },
    },
    '/colheitas': {
      get: {
        tags: ['Colheitas'],
        summary: 'Lista todas as colheitas (mais recentes primeiro)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de colheitas',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Colheita' },
                },
              },
            },
          },
          401: {
            description: 'Token ausente, inválido ou expirado',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
            },
          },
        },
      },
      post: {
        tags: ['Colheitas'],
        summary: 'Registra uma nova colheita',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NovaColheita' },
            },
          },
        },
        responses: {
          201: {
            description: 'Colheita registrada',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Colheita' } },
            },
          },
          400: {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { erro: 'Informe a data e uma quantidade maior que zero' },
              },
            },
          },
          401: {
            description: 'Token ausente, inválido ou expirado',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
            },
          },
        },
      },
    },
    '/colheitas/{id}': {
      delete: {
        tags: ['Colheitas'],
        summary: 'Exclui uma colheita (bloqueado se os abacaxis já tiverem sido vendidos)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'ID da colheita',
          },
        ],
        responses: {
          204: { description: 'Colheita excluída com sucesso' },
          400: {
            description: 'Exclusão deixaria o estoque negativo',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: {
                  erro: 'Não é possível excluir: os abacaxis desta colheita já foram vendidos',
                },
              },
            },
          },
          401: {
            description: 'Token ausente, inválido ou expirado',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
            },
          },
          404: {
            description: 'Colheita não encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { erro: 'Colheita não encontrada' },
              },
            },
          },
        },
      },
    },
    '/vendas': {
      get: {
        tags: ['Vendas'],
        summary: 'Lista todas as vendas (mais recentes primeiro)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de vendas',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Venda' },
                },
              },
            },
          },
          401: {
            description: 'Token ausente, inválido ou expirado',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
            },
          },
        },
      },
      post: {
        tags: ['Vendas'],
        summary: 'Registra uma nova venda (valida se há estoque suficiente)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NovaVenda' },
            },
          },
        },
        responses: {
          201: {
            description: 'Venda registrada',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Venda' } },
            },
          },
          400: {
            description: 'Dados inválidos ou estoque insuficiente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { erro: 'Estoque insuficiente. Disponível: 10' },
              },
            },
          },
          401: {
            description: 'Token ausente, inválido ou expirado',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
            },
          },
        },
      },
    },
    '/vendas/{id}': {
      delete: {
        tags: ['Vendas'],
        summary: 'Exclui uma venda',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'ID da venda',
          },
        ],
        responses: {
          204: { description: 'Venda excluída com sucesso' },
          401: {
            description: 'Token ausente, inválido ou expirado',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
            },
          },
          404: {
            description: 'Venda não encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { erro: 'Venda não encontrada' },
              },
            },
          },
        },
      },
    },
    '/resumo': {
      get: {
        tags: ['Resumo'],
        summary: 'Retorna totais colhidos, vendidos, estoque atual e faturamento',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Totais consolidados',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Resumo' } },
            },
          },
          401: {
            description: 'Token ausente, inválido ou expirado',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
