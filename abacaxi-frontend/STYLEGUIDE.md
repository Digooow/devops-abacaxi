# 🎨 Guia de Estilo Visual e Design System — Fazenda de Abacaxis (Frontend)

Este documento especifica a identidade visual, paleta de cores, tipografia, ícones, botões e padrões de componentes do **abacaxi-frontend**. Ele serve como fonte de verdade para manter consistência visual e simplicidade no desenvolvimento da interface.

---

## 1. Identidade e Filosofia Visual

- **Tema**: Fazenda tropical / Agronegócio sustentável (Abacaxi).
- **Abordagem**: **CSS Puro e Leve**. Sem Tailwind, sem CSS-in-JS, sem frameworks pesados de UI (como MUI, Chakra ou Bootstrap).
- **Arquivo Único de Estilos**: Todas as regras globais e classes utilitárias vivem em [`src/styles.css`](file:///c:/Users/rodrigo62289216/Desktop/devops-abacaxi/abacaxi-frontend/src/styles.css).
- **Box Sizing**: Reset universal `* { box-sizing: border-box; }`.

---

## 2. Paleta de Cores

As cores refletem os tons naturais de uma fazenda de abacaxis: verde folha, amarelo fruto maduro e fundo acolhedor de palha/creme.

| Nome da Cor | Hex | Uso Principal | Exemplo Visual |
|---|---|---|---|
| **Verde Principal (Plantation Green)** | `#2e7d32` | Header, botões primários, títulos de destaque, valores do painel | `rgb(46, 125, 50)` |
| **Verde Escuro (Dark Forest)** | `#1b5e20` | Botão "Sair", estados de foco ou contraste elevado | `rgb(27, 94, 32)` |
| **Amarelo Abacaxi (Gold Pineapple)** | `#f9c80e` | Botão de navegação ativo (`nav button.ativo`), destaque | `rgb(249, 200, 14)` |
| **Fundo Creme (Warm Sand)** | `#fdf8e6` | Background da página (`body`) | `rgb(253, 248, 230)` |
| **Branco Puro (Surface White)** | `#ffffff` | Fundo de Cards (`.card`), inputs e tabelas | `rgb(255, 255, 255)` |
| **Texto Principal (Charcoal)** | `#333333` | Textos gerais, títulos e texto de botões ativos | `rgb(51, 51, 51)` |
| **Texto Suave / Muted (Slate Gray)** | `#666666` | Rótulos de métricas, textos auxiliares (`.dica`) | `rgb(102, 102, 102)` |
| **Vermelho Alerta (Crimson Danger)** | `#c62828` | Botões de exclusão (`button.excluir`), mensagens de erro (`.erro`) | `rgb(198, 40, 40)` |
| **Bordas Sutis (Light Gray)** | `#cccccc` / `#eeeeee` | Bordas de inputs (`#ccc`) e divisórias de linhas da tabela (`#eee`) | Linhas de separação |

---

## 3. Tipografia

- **Família Tipográfica**:
  ```css
  font-family: system-ui, sans-serif;
  ```
  Utiliza as fontes nativas do sistema operacional (San Francisco no macOS/iOS, Segoe UI no Windows, Roboto no Android/Linux), garantindo renderização instantânea sem download de fontes externas.

- **Hierarquia de Tamanhos e Pesos**:
  | Elemento | Tamanho | Peso | Cor | Observação |
  |---|---|---|---|---|
  | **Título do Login** | `1.4rem` | Negrito | `#2e7d32` | Centralizado |
  | **Título do Header** | `1.3rem` | Negrito | `#ffffff` | Sem margens |
  | **Título de Seção / Form** | `1.1rem` | Negrito | `#333333` | Largura 100% no formulário |
  | **Número de Indicador** | `1.8rem` | Negrito (`strong`) | `#2e7d32` | Destaque do painel |
  | **Texto dos Inputs** | `1rem` | Normal | `#333333` | Padding confortável |
  | **Botões** | `0.95rem` | Normal | `#ffffff` / `#333` | Alinhamento compacto |
  | **Labels / Rótulos** | `0.9rem` | Normal | `#333333` / `#666` | Em coluna com o input |
  | **Dica / Texto de Ajuda** | `0.85rem` | Normal | `#666666` | Alinhamento central |

---

## 4. Ícones e Elementos Gráficos

- **Zero Bibliotecas Externas**: Não instalar bibliotecas como Lucide, Heroicons, FontAwesome ou Material Icons.
- **Uso de Emojis Nativos**: Ícones contextuais devem usar caracteres Unicode / Emojis padrão para preservar zero-dependency:
  - 🍍 `U+1F34D` — Símbolo do projeto (Logotipo no header, tela de login, título).
  - Outros emojis contextuais recomendados:
    - 📊 Painel / Dashboard
    - 🚜 Colheitas
    - 💰 Vendas / Faturamento
    - 📦 Estoque
- **Favicon Dinâmico**:
  Gerado diretamente no [`index.html`](file:///c:/Users/rodrigo62289216/Desktop/devops-abacaxi/abacaxi-frontend/index.html) com SVG inline base64/data URI:
  ```html
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍍</text></svg>" />
  ```

---

## 5. Botões e Ações

Todos os botões compartilham as propriedades base:
```css
button {
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 0.95rem;
}
```

### Variantes de Botão:

1. **Botão Primário (Padrão)**:
   - Uso: "Entrar", "Salvar", ações principais de submissão.
   - Background: `#2e7d32` | Texto: `#ffffff` | Sem borda.
   - Desabilitado (`:disabled`): `opacity: 0.6; cursor: not-allowed;`.

2. **Botão de Navegação Inativo (`header nav button`)**:
   - Uso: Abas no cabeçalho (Painel, Colheitas, Vendas).
   - Background: `transparent` | Borda: `1px solid #ffffff` | Texto: `#ffffff`.

3. **Botão de Navegação Ativo (`header nav button.ativo`)**:
   - Uso: Aba atualmente aberta.
   - Background: `#f9c80e` | Borda: `1px solid #f9c80e` | Texto: `#333333`.

4. **Botão Secundário / Sair (`.usuario button`)**:
   - Uso: Desconectar usuário no topo direito.
   - Background: `#1b5e20` | Texto: `#ffffff` | Margem esquerda: `8px`.

5. **Botão Destrutivo / Excluir (`button.excluir`)**:
   - Uso: Excluir linha de colheita ou venda na tabela.
   - Background: `#c62828` | Texto: `#ffffff` | Padding reduzido: `4px 10px`.

---

## 6. Componentes e Estrutura de Layout

### 6.1 Header de Navegação
```html
<header>
  <h1>🍍 Fazenda de Abacaxis</h1>
  <nav>
    <button class="ativo">Painel</button>
    <button>Colheitas</button>
    <button>Vendas</button>
  </nav>
  <div class="usuario">
    admin <button>Sair</button>
  </div>
</header>
```
- Barra horizontal com `display: flex; flex-wrap: wrap; gap: 16px; padding: 12px 24px; background: #2e7d32;`.

### 6.2 Container Central (`main`)
- `max-width: 960px; margin: 24px auto; padding: 0 16px;`.

### 6.3 Card (`.card`)
- Superfície padrão para formulários, tabelas e métricas.
- `background: #fff; border-radius: 8px; padding: 16px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1); margin-bottom: 16px;`.

### 6.4 Formulários (`.formulario`)
- `display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end;`.
- Labels organizam o campo em coluna (`display: flex; flex-direction: column; gap: 4px; font-size: 0.9rem;`).
- Inputs têm `padding: 8px; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem;`.

### 6.5 Tabelas de Dados (`.tabela`)
- Wrapper com `.tabela` para rolagem horizontal em telas pequenas (`overflow-x: auto`).
- `table` ocupa `width: 100%`, `border-collapse: collapse`.
- Células `th` e `td` com `padding: 8px; text-align: left; border-bottom: 1px solid #eee;`.

### 6.6 Painel de Indicadores (`.indicadores`)
- Grid responsivo que se adapta automaticamente:
  ```css
  .indicadores {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
  }
  ```
- Cada indicador é um `.card` contendo:
  ```html
  <div class="card">
    <span>Total colhido</span>
    <strong>150</strong>
  </div>
  ```

### 6.7 Estados e Mensagens
- **Erro (`.erro`)**: `color: #c62828;` (abaixo de formulários ou telas de login).
- **Dica informativa (`.dica`)**: `color: #666; font-size: 0.85rem; text-align: center;` (ex: aviso de cold start no Render).
- **Carregando**: `<p>Carregando...</p>` ou texto no próprio botão (`{carregando ? 'Entrando...' : 'Entrar'}`).
