import { useState } from 'react';
import Login from './pages/Login.jsx';
import Painel from './pages/Painel.jsx';
import Colheitas from './pages/Colheitas.jsx';
import Vendas from './pages/Vendas.jsx';
import { useIdioma, SeletorIdioma } from './i18n.jsx';
import FundoBiquini from './FundoBiquini.jsx';

const PAGINA_PAINEL = 'painel';
const CHAVE_USUARIO = 'usuario';
const PAGINAS = [PAGINA_PAINEL, 'colheitas', 'vendas'];

export default function App() {
  const [usuario, setUsuario] = useState(localStorage.getItem(CHAVE_USUARIO));
  const [pagina, setPagina] = useState(PAGINA_PAINEL);
  const { t } = useIdioma();

  function sair() {
    localStorage.removeItem('token');
    localStorage.removeItem(CHAVE_USUARIO);
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
                  type="button"
                  className={pagina === chave ? 'ativo' : ''}
                  onClick={() => setPagina(chave)}
                >
                  {t(`nav.${chave}`)}
                </button>
              ))}
            </nav>
            <SeletorIdioma />
            <div className={CHAVE_USUARIO}>
              <span className="nome-usuario">🧽 {usuario}</span>
              <button type="button" onClick={sair}>{t('usuario.sair')}</button>
            </div>
          </header>
          <main>
            {pagina === PAGINA_PAINEL && <Painel />}
            {pagina === 'colheitas' && <Colheitas />}
            {pagina === 'vendas' && <Vendas />}
          </main>
        </div>
      )}
    </>
  );
}
