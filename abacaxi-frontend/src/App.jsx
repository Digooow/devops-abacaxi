import { useState } from 'react';
import Login from './pages/Login.jsx';
import Painel from './pages/Painel.jsx';
import Colheitas from './pages/Colheitas.jsx';
import Vendas from './pages/Vendas.jsx';
import { useIdioma, SeletorIdioma } from './i18n.jsx';
import FundoBiquini from './FundoBiquini.jsx';

const PAGINAS = ['painel', 'colheitas', 'vendas'];

export default function App() {
  const [usuario, setUsuario] = useState(localStorage.getItem('usuario'));
  const [pagina, setPagina] = useState('painel');
  const { t } = useIdioma();

  function sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  return (
    <>
      <FundoBiquini />
      {!usuario ? (
        <Login onLogin={setUsuario} />
      ) : (
        <div className="conteudo-app">
          <header>
            <h1>🍍 {t('titulo')}</h1>
            <nav>
              {PAGINAS.map((chave) => (
                <button
                  key={chave}
                  className={pagina === chave ? 'ativo' : ''}
                  onClick={() => setPagina(chave)}
                >
                  {t(`nav.${chave}`)}
                </button>
              ))}
            </nav>
            <SeletorIdioma />
            <div className="usuario">
              <span className="nome-usuario">🧽 {usuario}</span>
              <button onClick={sair}>{t('usuario.sair')}</button>
            </div>
          </header>
          <main>
            {pagina === 'painel' && <Painel />}
            {pagina === 'colheitas' && <Colheitas />}
            {pagina === 'vendas' && <Vendas />}
          </main>
        </div>
      )}
    </>
  );
}
