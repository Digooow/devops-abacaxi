import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ESTRELA_UNIDADE =
  '0,-1 0.225,-0.309 0.951,-0.309 0.363,0.118 0.588,0.809 0,0.382 -0.588,0.809 -0.363,0.118 -0.951,-0.309 -0.225,-0.309';
const COR_BRANCO = '#ffffff';
const AMARELO_ESTRELA = '#ffde00';
const CLASSE_BANDEIRA = 'bandeira-svg';
const CHAVE_IDIOMA = 'idioma';
const LABEL_QTD_PT = 'Quantidade';
const LABEL_QTD_EN = 'Quantity';

function BandeiraBrasil() {
  return (
    <svg className={CLASSE_BANDEIRA} viewBox="0 0 28 20" aria-hidden="true">
      <rect width="28" height="20" fill="#009c3b" />
      <polygon points="14,2.2 25.5,10 14,17.8 2.5,10" fill="#ffdf00" />
      <circle cx="14" cy="10" r="4.9" fill="#002776" />
      <path
        d="M9.6,8.9 Q14,7.7 18.4,11.2"
        fill="none"
        stroke={COR_BRANCO}
        strokeWidth="1.2"
      />
    </svg>
  );
}

function BandeiraEUA() {
  return (
    <svg className={CLASSE_BANDEIRA} viewBox="0 0 36.4 26" aria-hidden="true">
      <rect width="36.4" height="26" fill={COR_BRANCO} />
      {[0, 4, 8, 12, 16, 20, 24].map((y) => (
        <rect key={y} y={y} width="36.4" height="2" fill="#b22234" />
      ))}
      <rect width="15.6" height="14" fill="#3c3b6e" />
      {[2.4, 7.0, 11.6].map((y) =>
        [2.2, 5.0, 7.8, 10.6, 13.4].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.75" fill={COR_BRANCO} />
        ))
      )}
      {[4.7, 9.3].map((y) =>
        [3.6, 6.4, 9.2, 12.0].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.75" fill={COR_BRANCO} />
        ))
      )}
    </svg>
  );
}

function BandeiraChina() {
  return (
    <svg className={CLASSE_BANDEIRA} viewBox="0 0 28 20" aria-hidden="true">
      <rect width="28" height="20" fill="#de2910" />
      <polygon
        points={ESTRELA_UNIDADE}
        fill={AMARELO_ESTRELA}
        transform="translate(5.2, 5.4) scale(3.1)"
      />
      <polygon
        points={ESTRELA_UNIDADE}
        fill={AMARELO_ESTRELA}
        transform="translate(10.2, 2.2) rotate(25) scale(1.05)"
      />
      <polygon
        points={ESTRELA_UNIDADE}
        fill={AMARELO_ESTRELA}
        transform="translate(12.1, 4.2) rotate(45) scale(1.05)"
      />
      <polygon
        points={ESTRELA_UNIDADE}
        fill={AMARELO_ESTRELA}
        transform="translate(12.1, 7.0) scale(1.05)"
      />
      <polygon
        points={ESTRELA_UNIDADE}
        fill={AMARELO_ESTRELA}
        transform="translate(10.2, 9.0) rotate(25) scale(1.05)"
      />
    </svg>
  );
}

export const IDIOMAS = [
  { codigo: 'pt', nome: 'Português', Bandeira: BandeiraBrasil },
  { codigo: 'en', nome: 'English', Bandeira: BandeiraEUA },
  { codigo: 'zh', nome: '中文', Bandeira: BandeiraChina },
];

export const TRADUCOES = {
  pt: {
    titulo: 'Fazenda de Abacaxis',
    nav: {
      painel: 'Painel',
      colheitas: 'Colheitas',
      vendas: 'Vendas',
    },
    usuario: {
      sair: 'Sair',
    },
    login: {
      titulo: 'Fazenda de Abacaxis',
      usuario: 'Usuário',
      senha: 'Senha',
      entrar: 'Entrar',
      entrando: 'Entrando...',
      dicaRender: 'No plano gratuito do Render a API pode levar até 1 minuto para "acordar".',
      erroConexao: 'Não foi possível conectar à API',
    },
    painel: {
      totalColhido: 'Total colhido',
      totalVendido: 'Total vendido',
      emEstoque: 'Em estoque',
      faturamento: 'Faturamento',
      carregando: 'Carregando...',
    },
    moeda: {
      aviso: 'Valores consolidados em Reais (BRL / R$), sem conversão cambial.',
    },
    tabela: {
      acoes: 'Ações',
    },
    colheitas: {
      tituloForm: 'Registrar colheita',
      data: 'Data',
      quantidade: LABEL_QTD_PT,
      observacao: 'Observação',
      salvar: 'Salvar',
      excluir: 'Excluir',
      thData: 'Data',
      thQuantidade: LABEL_QTD_PT,
      thObservacao: 'Observação',
      vazio: 'Nenhuma colheita registrada.',
    },
    vendas: {
      tituloForm: 'Registrar venda',
      data: 'Data',
      quantidade: LABEL_QTD_PT,
      precoUnitario: 'Preço unitário (R$)',
      cliente: 'Cliente',
      salvar: 'Salvar',
      excluir: 'Excluir',
      thData: 'Data',
      thCliente: 'Cliente',
      thQuantidade: 'Qtd.',
      thPreco: 'Preço un. (R$)',
      thTotal: 'Total',
      vazio: 'Nenhuma venda registrada.',
    },
    erros: {
      credenciaisInvalidas: 'Usuário ou senha inválidos',
      colheitaInvalida: 'Informe a data e uma quantidade maior que zero',
      colheitaNaoEncontrada: 'Colheita não encontrada',
      colheitaJaVendida: 'Não é possível excluir: os abacaxis desta colheita já foram vendidos',
      vendaInvalida: 'Informe data, quantidade e preço maiores que zero',
      estoqueInsuficiente: 'Estoque insuficiente. Disponível: {quantidade}',
      vendaNaoEncontrada: 'Venda não encontrada',
      tokenAusente: 'Token não informado',
      tokenInvalido: 'Token inválido ou expirado',
      erroServidor: 'Erro interno no servidor',
      erroRequisicao: 'Erro na requisição',
    },
  },
  en: {
    titulo: 'Pineapple Farm',
    nav: {
      painel: 'Dashboard',
      colheitas: 'Harvests',
      vendas: 'Sales',
    },
    usuario: {
      sair: 'Sign Out',
    },
    login: {
      titulo: 'Pineapple Farm',
      usuario: 'Username',
      senha: 'Password',
      entrar: 'Sign In',
      entrando: 'Signing in...',
      dicaRender: "On Render's free tier the API may take up to 1 minute to wake up.",
      erroConexao: 'Could not connect to the API',
    },
    painel: {
      totalColhido: 'Total harvested',
      totalVendido: 'Total sold',
      emEstoque: 'In stock',
      faturamento: 'Revenue',
      carregando: 'Loading...',
    },
    moeda: {
      aviso: 'Values consolidated in Brazilian Reais (BRL / R$), with no currency conversion.',
    },
    tabela: {
      acoes: 'Actions',
    },
    colheitas: {
      tituloForm: 'Record harvest',
      data: 'Date',
      quantidade: LABEL_QTD_EN,
      observacao: 'Notes',
      salvar: 'Save',
      excluir: 'Delete',
      thData: 'Date',
      thQuantidade: LABEL_QTD_EN,
      thObservacao: 'Notes',
      vazio: 'No harvests recorded.',
    },
    vendas: {
      tituloForm: 'Record sale',
      data: 'Date',
      quantidade: LABEL_QTD_EN,
      precoUnitario: 'Unit price (R$)',
      cliente: 'Customer',
      salvar: 'Save',
      excluir: 'Delete',
      thData: 'Date',
      thCliente: 'Customer',
      thQuantidade: 'Qty.',
      thPreco: 'Unit price (R$)',
      thTotal: 'Total',
      vazio: 'No sales recorded.',
    },
    erros: {
      credenciaisInvalidas: 'Invalid username or password',
      colheitaInvalida: 'Enter a date and a quantity greater than zero',
      colheitaNaoEncontrada: 'Harvest not found',
      colheitaJaVendida: 'Cannot delete: pineapples from this harvest have already been sold',
      vendaInvalida: 'Enter a date, quantity, and price greater than zero',
      estoqueInsuficiente: 'Insufficient stock. Available: {quantidade}',
      vendaNaoEncontrada: 'Sale not found',
      tokenAusente: 'Token not provided',
      tokenInvalido: 'Invalid or expired token',
      erroServidor: 'Internal server error',
      erroRequisicao: 'Request failed',
    },
  },
  zh: {
    titulo: '菠萝农场',
    nav: {
      painel: '仪表盘',
      colheitas: '收获',
      vendas: '销售',
    },
    usuario: {
      sair: '退出',
    },
    login: {
      titulo: '菠萝农场',
      usuario: '用户名',
      senha: '密码',
      entrar: '登录',
      entrando: '登录中...',
      dicaRender: '在 Render 免费层上，API 可能需要长达 1 分钟才能启动。',
      erroConexao: '无法连接到 API',
    },
    painel: {
      totalColhido: '总收获量',
      totalVendido: '总销售量',
      emEstoque: '库存量',
      faturamento: '总营业额',
      carregando: '加载中...',
    },
    moeda: {
      aviso: '所有金额均以巴西雷亚尔（BRL / R$）统一结算，不进行汇率换算。',
    },
    tabela: {
      acoes: '操作',
    },
    colheitas: {
      tituloForm: '记录收获',
      data: '日期',
      quantidade: '数量',
      observacao: '备注',
      salvar: '保存',
      excluir: '删除',
      thData: '日期',
      thQuantidade: '数量',
      thObservacao: '备注',
      vazio: '暂无收获记录。',
    },
    vendas: {
      tituloForm: '记录销售',
      data: '日期',
      quantidade: '数量',
      precoUnitario: '单价 (R$)',
      cliente: '客户',
      salvar: '保存',
      excluir: '删除',
      thData: '日期',
      thCliente: '客户',
      thQuantidade: '数量',
      thPreco: '单价 (R$)',
      thTotal: '总计',
      vazio: '暂无销售记录。',
    },
    erros: {
      credenciaisInvalidas: '用户名或密码无效',
      colheitaInvalida: '请输入日期和大于零的数量',
      colheitaNaoEncontrada: '未找到收成记录',
      colheitaJaVendida: '无法删除：该批收成中的凤梨已售出',
      vendaInvalida: '请输入日期、大于零的数量和价格',
      estoqueInsuficiente: '库存不足。可用数量：{quantidade}',
      vendaNaoEncontrada: '未找到销售记录',
      tokenAusente: '未提供令牌',
      tokenInvalido: '令牌无效或已过期',
      erroServidor: '服务器内部错误',
      erroRequisicao: '请求失败',
    },
  },
};

const MENSAGENS_ERRO_API = {
  'Usuário ou senha inválidos': 'erros.credenciaisInvalidas',
  'Informe a data e uma quantidade maior que zero': 'erros.colheitaInvalida',
  'Colheita não encontrada': 'erros.colheitaNaoEncontrada',
  'Não é possível excluir: os abacaxis desta colheita já foram vendidos': 'erros.colheitaJaVendida',
  'Informe data, quantidade e preço maiores que zero': 'erros.vendaInvalida',
  'Venda não encontrada': 'erros.vendaNaoEncontrada',
  'Token não informado': 'erros.tokenAusente',
  'Token inválido ou expirado': 'erros.tokenInvalido',
  'Erro interno no servidor': 'erros.erroServidor',
  'Erro na requisição': 'erros.erroRequisicao',
};

const PREFIXO_ESTOQUE_INSUFICIENTE = 'Estoque insuficiente. Disponível: ';

function buscarChave(raiz, chaves) {
  let atual = raiz;
  for (const chave of chaves) {
    atual = atual?.[chave];
    if (atual === undefined) return undefined;
  }
  return atual;
}

export function traduzirChave(idioma, caminho) {
  const chaves = caminho.split('.');
  return buscarChave(TRADUCOES[idioma], chaves) ?? buscarChave(TRADUCOES.pt, chaves) ?? caminho;
}

export function traduzirErro(idioma, mensagem) {
  if (!mensagem) return traduzirChave(idioma, 'erros.erroRequisicao');
  if (mensagem === 'Failed to fetch' || mensagem === 'Load failed' || mensagem.startsWith('NetworkError')) {
    return traduzirChave(idioma, 'login.erroConexao');
  }

  if (mensagem.startsWith(PREFIXO_ESTOQUE_INSUFICIENTE)) {
    const quantidade = mensagem.slice(PREFIXO_ESTOQUE_INSUFICIENTE.length);
    return traduzirChave(idioma, 'erros.estoqueInsuficiente').replace('{quantidade}', quantidade);
  }

  const chave = MENSAGENS_ERRO_API[mensagem];
  return chave ? traduzirChave(idioma, chave) : mensagem;
}

const IdiomaContext = createContext(null);

export function IdiomaProvider({ children }) {
  const [idioma, setIdioma] = useState(() => {
    return localStorage.getItem(CHAVE_IDIOMA) || 'pt';
  });

  const mudarIdioma = useCallback((novoIdioma) => {
    localStorage.setItem(CHAVE_IDIOMA, novoIdioma);
    setIdioma(novoIdioma);
  }, []);

  const valorContexto = useMemo(
    () => ({
      idioma,
      mudarIdioma,
      t: (caminho) => traduzirChave(idioma, caminho),
      traduzirErro: (mensagem) => traduzirErro(idioma, mensagem),
    }),
    [idioma, mudarIdioma]
  );

  return (
    <IdiomaContext.Provider value={valorContexto}>
      {children}
    </IdiomaContext.Provider>
  );
}

export function useIdioma() {
  return useContext(IdiomaContext);
}

export function SeletorIdioma({ className = '' }) {
  const { idioma, mudarIdioma } = useIdioma();

  return (
    <fieldset className={`seletor-idiomas ${className}`.trim()} aria-label="Seleção de idioma">
      {IDIOMAS.map(({ codigo, nome, Bandeira }) => (
        <button
          key={codigo}
          type="button"
          className={`btn-idioma ${idioma === codigo ? 'ativo' : ''}`}
          onClick={() => mudarIdioma(codigo)}
          title={nome}
          aria-label={nome}
        >
          <Bandeira />
        </button>
      ))}
    </fieldset>
  );
}
