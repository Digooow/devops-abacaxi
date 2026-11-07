import { createContext, useContext, useState } from 'react';

const ESTRELA_UNIDADE =
  '0,-1 0.225,-0.309 0.951,-0.309 0.363,0.118 0.588,0.809 0,0.382 -0.588,0.809 -0.363,0.118 -0.951,-0.309 -0.225,-0.309';

function BandeiraBrasil() {
  return (
    <svg className="bandeira-svg" viewBox="0 0 28 20" aria-hidden="true">
      <rect width="28" height="20" fill="#009c3b" />
      <polygon points="14,2.2 25.5,10 14,17.8 2.5,10" fill="#ffdf00" />
      <circle cx="14" cy="10" r="4.9" fill="#002776" />
      <path
        d="M9.6,8.9 Q14,7.7 18.4,11.2"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function BandeiraEUA() {
  return (
    <svg className="bandeira-svg" viewBox="0 0 36.4 26" aria-hidden="true">
      <rect width="36.4" height="26" fill="#ffffff" />
      {[0, 4, 8, 12, 16, 20, 24].map((y) => (
        <rect key={y} y={y} width="36.4" height="2" fill="#b22234" />
      ))}
      <rect width="15.6" height="14" fill="#3c3b6e" />
      {[2.4, 7.0, 11.6].map((y) =>
        [2.2, 5.0, 7.8, 10.6, 13.4].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.75" fill="#ffffff" />
        ))
      )}
      {[4.7, 9.3].map((y) =>
        [3.6, 6.4, 9.2, 12.0].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.75" fill="#ffffff" />
        ))
      )}
    </svg>
  );
}

function BandeiraChina() {
  return (
    <svg className="bandeira-svg" viewBox="0 0 28 20" aria-hidden="true">
      <rect width="28" height="20" fill="#de2910" />
      <polygon
        points={ESTRELA_UNIDADE}
        fill="#ffde00"
        transform="translate(5.2, 5.4) scale(3.1)"
      />
      <polygon
        points={ESTRELA_UNIDADE}
        fill="#ffde00"
        transform="translate(10.2, 2.2) rotate(25) scale(1.05)"
      />
      <polygon
        points={ESTRELA_UNIDADE}
        fill="#ffde00"
        transform="translate(12.1, 4.2) rotate(45) scale(1.05)"
      />
      <polygon
        points={ESTRELA_UNIDADE}
        fill="#ffde00"
        transform="translate(12.1, 7.0) scale(1.05)"
      />
      <polygon
        points={ESTRELA_UNIDADE}
        fill="#ffde00"
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
    colheitas: {
      tituloForm: 'Registrar colheita',
      data: 'Data',
      quantidade: 'Quantidade',
      observacao: 'Observação',
      salvar: 'Salvar',
      excluir: 'Excluir',
      thData: 'Data',
      thQuantidade: 'Quantidade',
      thObservacao: 'Observação',
      vazio: 'Nenhuma colheita registrada.',
    },
    vendas: {
      tituloForm: 'Registrar venda',
      data: 'Data',
      quantidade: 'Quantidade',
      precoUnitario: 'Preço unitário (R$)',
      cliente: 'Cliente',
      salvar: 'Salvar',
      excluir: 'Excluir',
      thData: 'Data',
      thCliente: 'Cliente',
      thQuantidade: 'Qtd.',
      thPreco: 'Preço un.',
      thTotal: 'Total',
      vazio: 'Nenhuma venda registrada.',
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
    colheitas: {
      tituloForm: 'Record harvest',
      data: 'Date',
      quantidade: 'Quantity',
      observacao: 'Notes',
      salvar: 'Save',
      excluir: 'Delete',
      thData: 'Date',
      thQuantidade: 'Quantity',
      thObservacao: 'Notes',
      vazio: 'No harvests recorded.',
    },
    vendas: {
      tituloForm: 'Record sale',
      data: 'Date',
      quantidade: 'Quantity',
      precoUnitario: 'Unit price (R$)',
      cliente: 'Customer',
      salvar: 'Save',
      excluir: 'Delete',
      thData: 'Date',
      thCliente: 'Customer',
      thQuantidade: 'Qty.',
      thPreco: 'Unit price',
      thTotal: 'Total',
      vazio: 'No sales recorded.',
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
      thPreco: '单价',
      thTotal: '总计',
      vazio: '暂无销售记录。',
    },
  },
};

const IdiomaContext = createContext();

export function IdiomaProvider({ children }) {
  const [idioma, setIdioma] = useState(() => {
    return localStorage.getItem('idioma') || 'pt';
  });

  const mudarIdioma = (novoIdioma) => {
    localStorage.setItem('idioma', novoIdioma);
    setIdioma(novoIdioma);
  };

  const t = (caminho) => {
    const chaves = caminho.split('.');
    let atual = TRADUCOES[idioma] || TRADUCOES.pt;
    for (const chave of chaves) {
      if (!atual || atual[chave] === undefined) {
        let fb = TRADUCOES.pt;
        for (const k of chaves) {
          fb = fb?.[k];
        }
        return fb || caminho;
      }
      atual = atual[chave];
    }
    return atual;
  };

  return (
    <IdiomaContext.Provider value={{ idioma, mudarIdioma, t }}>
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
    <div className={`seletor-idiomas ${className}`.trim()} role="group" aria-label="Seleção de idioma">
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
    </div>
  );
}
