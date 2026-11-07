# 🎨 Guia de Estilo Visual e Design System — Fazenda de Abacaxis (Tema Fenda do Biquíni)

Este documento especifica a identidade visual, paleta de cores, tipografia, ícones, botões, cenário interativo e componentes do **abacaxi-frontend**.

---

## 1. Identidade e Filosofia Visual

- **Tema**: **Fenda do Biquíni / Bob Esponja** — unindo o universo submarino do abacaxi mais famoso do mar com a gestão da Fazenda de Abacaxis.
- **Abordagem**: **CSS Puro + Canvas HTML5 + SVG Inline** (zero frameworks pesados de UI ou pacotes extras de ícones/animações).
- **Arquivos Visuais Centrais**:
  - [`src/styles.css`](file:///c:/Users/rodrigo62289216/Desktop/devops-abacaxi/abacaxi-frontend/src/styles.css) — todas as regras globais, paleta e componentes.
  - [`src/FundoBiquini.jsx`](file:///c:/Users/rodrigo62289216/Desktop/devops-abacaxi/abacaxi-frontend/src/FundoBiquini.jsx) — cenário subaquático animado e interativo ao mouse/clique.

---

## 2. Paleta de Cores

| Nome da Cor | Valor | Uso Principal |
|---|---|---|
| **Oceano Tropical (Gradiente)** | `#1bc8e8` → `#0ea2d4` → `#0774a8` → `#055280` | Fundo subaquático fixo da página (`body`) |
| **Amarelo Bob Esponja** | `#ffe135` / `#ffbe0b` (`#c28600` sombra 3D) | Botões principais, abas ativas, títulos e bordas de destaque |
| **Azul Lagoa Profundo** | `rgba(6, 68, 112, 0.88)` → `rgba(11, 110, 166, 0.86)` | Header translúcido com `backdrop-filter: blur(10px)` |
| **Creme Pérola / Bolha** | `rgba(255, 252, 235, 0.92)` | Superfície dos Cards (`.card`) sobre o oceano |
| **Azul Marinho Texto** | `#0b2e4a` / `#074773` | Texto principal de alto contraste, labels e cabeçalhos de tabela |
| **Laranja Casa de Abacaxi** | `#ff8500` / `#ff7b00` | Título do login, destaque do indicador de colheita e casa no cenário |
| **Rosa Patrick / Água-Viva** | `#ff85a9` → `#f0487c` | Botão "Sair" no cabeçalho e águas-vivas do fundo |
| **Vermelho Coral (Alerta)** | `#ff758f` → `#e63946` | Botão de exclusão (`button.excluir`) e caixa de erro (`.erro`) |
| **Areia Dourada** | `#f6d87e` / `#e7c15a` | Dunas de areia no rodapé submarino (`.cenario-areia`) |

---

## 3. Tipografia

- **Títulos e Botões (`Fredoka`)**:
  ```css
  font-family: 'Fredoka', 'Trebuchet MS', system-ui, sans-serif;
  ```
  Fonte arredondada estilo cartoon para `h1`, `h2`, `th`, valores de indicadores e botões.
- **Corpo e Dados (`Nunito`)**:
  ```css
  font-family: 'Nunito', system-ui, sans-serif;
  ```
  Alta legibilidade em tabelas, formulários e números.

---

## 4. Cenário Submarino Interativo (`FundoBiquini.jsx` e `personagensBiquini.js`)

- **Camada Canvas de Fundo (`.canvas-biquini`)**:
  - **Raios de sol subaquáticos** oscilando suavemente a partir da superfície.
  - **11 Flores do céu da Fenda do Biquíni** girando lentamente com efeito de paralaxe no mouse.
  - **Cardume de peixes cidadãos** e **6 águas-vivas rosa** nadando e reagindo à aproximação do cursor.
- **Camada SVG da Vizinhança e Skyline (`.cenario-areia`)**:
  - **Skyline de Downtown Bikini Bottom**: Prédios metálicos de tubulação com janelas iluminadas e a torre **Sea Needle** ao fundo.
  - **Vizinhança completa em primeiro plano**: **Redoma da Sandy**, **Rua da Concha** (**Pedra do Patrick**, **Casa Moai do Lula Molusco** e **Casa de Abacaxi do Bob Esponja**), **Barg'N-Mart**, prédios-tubo coloridos, ponto de ônibus, **Siri Cascudo** (armadilha de lagosta) e **Balde de Lixo** (com luva gigante no teto), além de calçada e avenida asfaltada de pista dupla.
- **Camada Canvas Frontal de Personagens e Trânsito (`.canvas-personagens`)**:
  - **Personagens animados caminhando na calçada**: **Bob Esponja** (com rede de caçar água-viva), **Patrick Estrela**, **Gary**, **Lula Molusco**, **Seu Siriguejo** (abrindo e fechando as garras no Siri Cascudo) e **Plankton** (saltitando no Balde de Lixo). Passar o mouse ou clicar perto do Bob Esponja ou do Patrick faz eles pularem comemorando!
  - **Trânsito submarino**: **Barcomóveis** coloridos e o **Ônibus submarino da Fenda do Biquíni** trafegando nas duas faixas e soltando bolhas pelo escapamento.
  - **Bolhas interativas**: rastro no cursor, estouro de bolhas grandes e rajadas de bolhas com ondulação ao clicar.
- Possui `pointer-events: none` (escutando eventos passivos em `window`) para nunca bloquear cliques nos formulários ou tabelas.

---

## 5. Ícones e Bandeiras

- **Zero Bibliotecas Externas**: Sem pacotes de ícones NPM.
- **Emojis Nativos**: `🍍` (marca principal e favicon SVG inline no `index.html`) e `🧽` (badge de usuário no header).
- **Bandeiras de Idioma em SVG Inline ([`src/i18n.jsx`](file:///c:/Users/rodrigo62289216/Desktop/devops-abacaxi/abacaxi-frontend/src/i18n.jsx))**:
  - Componentes vetoriais `BandeiraBrasil`, `BandeiraEUA` e `BandeiraChina` (`28×20px`), exibindo **somente as bandeiras sem siglas de texto** (evitando que o Windows renderize letras `BR`/`US`/`CN`).

---

## 6. Botões e Componentes

1. **Botão Primário Cartoon 3D (`button`)**:
   - Gradiente amarelo `#ffe94d` → `#ffbe0b`, texto `#073659`, `border-radius: 12px`, sombra sólida `0 4px 0 #c28600` com efeito de pressão no `:active`.
2. **Abas de Navegação (`header nav button` / `.ativo`)**:
   - Pílulas (`border-radius: 999px`) translúcidas quando inativas e amarelo vibrante com sombra 3D quando `.ativo`.
3. **Botão Sair (`.usuario button`)**:
   - Pílula rosa `#ff85a9` → `#f0487c` com sombra `#a8204d`.
4. **Botão Excluir (`button.excluir`)**:
   - Gradiente coral `#ff758f` → `#e63946` com sombra `#9e1924`.
5. **Cards de Bolha (`.card`)**:
   - Fundo creme translúcido `rgba(255, 252, 235, 0.92)` com `backdrop-filter: blur(10px)`, borda branca `3px`, `border-radius: 20px` e sombra cartoon `0 8px 0 rgba(5, 52, 89, 0.22)`.
6. **Seletor de Idiomas (`.seletor-idiomas`)**:
   - Cápsula no topo com as 3 bandeiras SVG, persistindo a escolha em `localStorage` (`idioma`).
