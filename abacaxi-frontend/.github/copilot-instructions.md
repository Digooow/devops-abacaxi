# Instruções do GitHub Copilot — Frontend (Fazenda de Abacaxis) 🍍

Estas instruções aplicam-se a qualquer alteração ou criação de código dentro do frontend (`abacaxi-frontend/`).

> 🎨 **REFERÊNCIA VISUAL OBRIGATÓRIA:**
> O arquivo [`STYLEGUIDE.md`](../STYLEGUIDE.md) é o **Guia Oficial de Estilo Visual e Design System** deste frontend. Sempre consulte e siga estritamente suas definições para paleta de cores, tipografia, ícones/emojis, botões, formulários, tabelas e layouts antes de gerar ou modificar código visual.

---

## 1. Princípios e Diretrizes Gerais

- **Foco Didático e Simplicidade**: Este frontend é uma SPA minimalista em **React 18 + Vite 6** construída para demonstrar deploy como *Static Site* no Render.
- **Proibição de Novas Bibliotecas**:
  - **NÃO adicione** bibliotecas de estilização (Tailwind, Bootstrap, styled-components, Sass/SCSS).
  - **NÃO adicione** bibliotecas de roteamento (`react-router-dom`). A troca de telas é intencionalmente baseada em estado (`useState`) para funcionar em qualquer servidor estático sem necessidade de configuração de *rewrite/SPA fallback*.
  - **NÃO adicione** bibliotecas HTTP (`axios`, `swr`, `react-query`). Use exclusivamente o helper `api()` de [`src/api.js`](file:///c:/Users/rodrigo62289216/Desktop/devops-abacaxi/abacaxi-frontend/src/api.js).
  - **NÃO adicione** pacotes de ícones (`lucide-react`, `heroicons`, `font-awesome`, `@mui/icons-material`).
  - **NÃO adicione** gerenciadores de estado (`redux`, `zustand`) ou validação de formulários (`formik`, `zod`, `react-hook-form`).
- **Idioma**: Todos os textos de interface (labels, botões, mensagens, títulos), nomes de variáveis, estados e funções devem ser escritos em **Português (pt-BR)**.

---

## 2. Design System e Estilização Obrigatória

Consulte o guia completo em [`STYLEGUIDE.md`](../STYLEGUIDE.md), que descreve detalhadamente cada token visual, variante de botão, espaçamentos e componentes. Toda implementação de interface deve ser 100% aderente a ele.

### 2.1 Arquivo Central de CSS
- Todas as regras visuais devem ser mantidas exclusivamente em [`src/styles.css`](file:///c:/Users/rodrigo62289216/Desktop/devops-abacaxi/abacaxi-frontend/src/styles.css).
- Não crie arquivos `.module.css` nem estilizações inline repetitivas. Consulte as classes prontas documentadas no [`STYLEGUIDE.md`](../STYLEGUIDE.md) (`.card`, `.formulario`, `.tabela`, `.indicadores`, `.login`, `.erro`, `.dica`, `button.excluir`, `button.ativo`).

### 2.2 Paleta de Cores e Tema Fenda do Biquíni
Sempre reutilize o tema submarino/Bob Esponja definido no [`STYLEGUIDE.md`](../STYLEGUIDE.md):
- **Oceano Tropical (`#1bc8e8` → `#055280`)**: Gradiente fixo de fundo acompanhado pelo cenário interativo `src/FundoBiquini.jsx` (flores do céu, bolhas, águas-vivas e fundo de areia com casa de abacaxi).
- **Amarelo Bob Esponja (`#ffe135` / `#ffbe0b`)**: Botões principais cartoon 3D (`button`), abas ativas (`header nav button.ativo`) e bordas de destaque.
- **Azul Lagoa (`rgba(6, 68, 112, 0.88)`)**: Header translúcido com `backdrop-filter: blur(10px)`.
- **Creme Pérola (`rgba(255, 252, 235, 0.92)`)**: Superfície translúcida dos cards (`.card`).
- **Azul Marinho (`#0b2e4a` / `#074773`)**: Texto principal, labels e cabeçalhos de tabela.
- **Rosa Patrick (`#ff85a9` → `#f0487c`)** e **Vermelho Coral (`#e63946`)**: Botão "Sair" e ações destrutivas/erros (`button.excluir`, `.erro`).

### 2.3 Tipografia
- Títulos, abas e botões: `font-family: 'Fredoka', 'Trebuchet MS', system-ui, sans-serif;`.
- Corpo, inputs e tabelas: `font-family: 'Nunito', system-ui, sans-serif;`.

### 2.4 Ícones, Bandeiras e Favicon
- Utilize emojis nativos pontuais (`🍍`, `🧽`) e **SVG inline** para bandeiras de idioma (`BandeiraBrasil`, `BandeiraEUA`, `BandeiraChina` em `src/i18n.jsx`, sempre sem letras no botão).

### 2.5 Padrão de Botões
Reutilize as classes e estilos existentes:
- **Salvar / Submeter / Entrar**: `<button type="submit">Salvar</button>` (amarelo cartoon 3D).
- **Excluir linha**: `<button className="excluir" onClick={...}>Excluir</button>` (vermelho coral).
- **Navegação**: `<button className={pagina === chave ? 'ativo' : ''}>` no `header nav`.
- **Desabilitado**: Propriedade `disabled={carregando}`.

---

## 3. Padrões de Componentes e Estrutura React

### 3.1 Adicionando Novas Telas
A navegação é centralizada em [`src/App.jsx`](file:///c:/Users/rodrigo62289216/Desktop/devops-abacaxi/abacaxi-frontend/src/App.jsx):
1. Crie o componente da tela dentro de `src/pages/NomeDaPagina.jsx`.
2. Adicione a chave no objeto `PAGINAS` em `src/App.jsx`:
   ```javascript
   const PAGINAS = { painel: 'Painel', colheitas: 'Colheitas', vendas: 'Vendas', novapagina: 'Nova Página' };
   ```
3. Renderize condicionalmente dentro do `<main>`:
   ```jsx
   {pagina === 'novapagina' && <NovaPagina />}
   ```

### 3.2 Estrutura Padrão de Formulário
Mantenha a consistência com `Colheitas.jsx` e `Vendas.jsx`:
```jsx
<form className="card formulario" onSubmit={salvar}>
  <h2>Título da Ação</h2>
  <label>
    Campo
    <input value={valor} onChange={(e) => setValor(e.target.value)} required />
  </label>
  <button type="submit" disabled={salvando}>Salvar</button>
</form>
{erro && <p className="erro">{erro}</p>}
```

### 3.3 Estrutura Padrão de Tabela
Sempre envolva a `table` em uma div `.card.tabela`:
```jsx
<div className="card tabela">
  <table>
    <thead>
      <tr><th>Coluna 1</th><th>Coluna 2</th><th></th></tr>
    </thead>
    <tbody>
      {itens.map((item) => (
        <tr key={item.id}>
          <td>{item.campo}</td>
          <td>{formatarReais(item.valor)}</td>
          <td><button className="excluir" onClick={() => excluir(item.id)}>Excluir</button></td>
        </tr>
      ))}
      {itens.length === 0 && <tr><td colSpan="3">Nenhum registro encontrado.</td></tr>}
    </tbody>
  </table>
</div>
```

---

## 4. Comunicação com a API e Helpers ([src/api.js](file:///c:/Users/rodrigo62289216/Desktop/devops-abacaxi/abacaxi-frontend/src/api.js))

- **Consumo HTTP**:
  ```javascript
  import { api, formatarData, formatarReais, hoje } from '../api.js';

  // GET
  const dados = await api('/recurso');

  // POST
  await api('/recurso', { method: 'POST', body: { ... } });

  // DELETE
  await api(`/recurso/${id}`, { method: 'DELETE' });
  ```
- **Tratamento de Erros**:
  Capture o erro com `catch (err) { setErro(err.message); }`. A função `api()` já extrai a mensagem retornada pelo backend (`dados.erro`).
- **Formatadores Globais**:
  - `formatarData('2026-10-15')` → `"15/10/2026"`.
  - `formatarReais(1250.5)` → `"R$ 1.250,50"`.
  - `hoje()` → `"2026-10-15"` (ideal para `<input type="date">`).

---

## 5. Validação de Build

Antes de finalizar qualquer modificação no frontend, certifique-se de que o build do Vite executa sem erros:
```bash
cd abacaxi-frontend
npm run build
```
O build gera os artefatos na pasta `dist/`, validando sintaxe JSX e integridade dos módulos.
