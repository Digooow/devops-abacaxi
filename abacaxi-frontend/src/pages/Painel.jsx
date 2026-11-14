import { useEffect, useState } from 'react';
import { api, formatarReais } from '../api.js';
import { useIdioma } from '../i18n.jsx';

export default function Painel() {
  const [resumo, setResumo] = useState(null);
  const [erro, setErro] = useState('');
  const { t, idioma, traduzirErro } = useIdioma();

  useEffect(() => {
    api('/resumo').then(setResumo).catch((err) => setErro(err.message));
  }, []);

  if (erro) return <p className="erro">{traduzirErro(erro)}</p>;
  if (!resumo) return <p>{t('painel.carregando')}</p>;

  return (
    <div className="indicadores">
      <div className="card"><span>{t('painel.totalColhido')}</span><strong>{resumo.colhido}</strong></div>
      <div className="card"><span>{t('painel.totalVendido')}</span><strong>{resumo.vendido}</strong></div>
      <div className="card"><span>{t('painel.emEstoque')}</span><strong>{resumo.estoque}</strong></div>
      <div className="card">
        <span>{t('painel.faturamento')}</span>
        <strong>{formatarReais(resumo.faturamento, idioma)}</strong>
        <small className="aviso-moeda">{t('moeda.aviso')}</small>
      </div>
    </div>
  );
}
