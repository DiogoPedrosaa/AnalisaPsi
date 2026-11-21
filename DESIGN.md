# Design do AnalisaPsi

Padrões visuais e de interface do app. Todo componente novo deve seguir este documento, e todo
padrão novo deve ser registrado aqui.

## Princípios

- **Prático: poucas telas.** O dia a dia cabe em duas telas: **Pastas** (o início) e **Registrar**.
  Tudo o que dá para resolver na mesma tela fica nela (abrir a pasta de uma turma, filtrar, editar),
  em vez de virar mais uma aba. Histórico, Painel e Turmas e tags existem como chips do cabeçalho.
- **Rápido de usar no celular.** O registro de uma atividade deve levar menos de um minuto, com uma
  mão só. Alvos de toque grandes, chips em vez de selects sempre que a lista for curta, e valores
  padrão inteligentes (data de hoje, turma anterior, tags sugeridas).
- **Papelaria retrô / scrapbook (o "Diário de Estágio").** A referência visual é o HTML do *Diário de
  Estágio — Psicologia Escolar*: papel creme quadriculado de rosa, **tudo contornado em cacau** com
  **sombra de recorte sólida** (adesivos), cereja, rosa pastel, lavanda, azul-bebê e verde-oliva;
  títulos em serifa editorial pesada (Fraunces), recadinhos em letra de mão (Caveat), fitas washi,
  bloco espiral, folha de fichário, papel rasgado, bordas onduladas e listras com estrelinhas. Os
  enfeites são **pontuais**: emolduram blocos e títulos, nunca ficam atrás de texto corrido.
  Emojis aparecem com moderação (receptividade, estados vazios, dica).
- **Dados honestos.** Os gráficos mostram a composição real (adoraram / gostaram / neutro / não curtiram) e marcam quando há
  "poucos dados", em vez de exagerar conclusões.
- **Tudo em português do Brasil**, num tom próximo e direto ("Não rolou", "Leva menos de um minuto").

## Cores

As cores são variáveis CSS em `:root` ([src/app/globals.css](src/app/globals.css)), expostas ao
Tailwind via `@theme inline`. **Nunca use cores literais (`#hex`, `bg-blue-500`) em componentes**:
use sempre os tokens (`bg-card`, `text-ink-2`, `border-line`…). O tema escuro é automático
(`prefers-color-scheme`, variante `dark:`) e só funciona se os tokens forem respeitados.
Os nomes entre parênteses são os do HTML de referência.

### Superfícies e texto

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `page` | `#fdf9f2` (cream) | `#1f140f` | Fundo da página (com a grade rosa) |
| `card` | `#fdf9f2` (cream) | `#2a1c15` | Cartões, inputs, cabeçalho |
| `card-2` | `#f5ede0` (creamDark) | `#3a281e` | Faixa de filtros, hover, botões pequenos, skeleton |
| `ink` | `#4a2b1d` (cocoa) | `#fbefe2` | Texto principal |
| `ink-2` | `#6e5448` | `#e3cdb9` | Texto secundário, rótulos (cocoa a 80%) |
| `muted` | `#836d61` | `#b09886` | Texto de apoio, "nenhum dado" |
| `line` | `#4a2b1d` (cocoa) | `#a88a74` | **Contorno** de cartões, inputs, chips e botões. Divisórias usam `line/15` (`border-line/15`, `divide-line/15`) |

### Destaque e estados

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `accent` | `#c82333` (cherry) | `#f06a8a` | Ação principal, chip ativo, letreiro |
| `accent-ink` | `#fdf9f2` | `#2a0b12` | Texto sobre `accent` |
| `accent-soft` | `#fad2dc` (pastelPink) | `#4d2030` | Caixa de resumo do painel |
| `danger` | `#c82333` | `#ff7f8a` | Mensagens de erro |
| `success` | `#5b6836` | `#b8c78a` | Mensagem de sucesso (oliva escurecido para contraste) |

### Enfeites

Também viram classes do Tailwind (`bg-rosa-claro`, `text-oliva`, `bg-ceu-claro`…). Não use para
significado (erro, receptividade).

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `rosa` | `#f694a8` | `#7a3346` | Faixa `grade-rosa`, papel rasgado, fita solta |
| `rosa-claro` | `#fad2dc` (pastelPink) | `#4d2030` | Fita washi, contagem do caderno, ícone do estado vazio, hover de chip |
| `rosa-forte` | `#f06a8a` (hotPink) | `#f06a8a` | Anel de foco, sublinhado ondulado |
| `cereja` | `#c82333` (cherry) | `#ea4a5a` | Ícones de destaque, recadinhos, setinha da aba, links da dica |
| `vinho` | `#8a1522` (cherryDark) | `#f4a3b0` | Títulos de página e da marca, hover do `btn-primary` |
| `creme` | `#fdf9f2` | `#fdf9f2` | Texto sobre `cereja` |
| `lavanda` / `lavanda-escura` | `#d6ccf2` / `#6a5b94` | `#3f3768` / `#c5b9f0` | `btn-secundario`, fita do fichário, reação "Neutro" |
| `ceu` / `ceu-claro` | `#c7ddf0` / `#dcebf7` (babyBlue / softBlue) | `#2a4258` / `#233547` | Fita washi, folha de fichário, caixa "Turma:" do cartão |
| `oliva` / `oliva-clara` | `#6f7d43` / `#dce3c3` (olive / oliveLight) | `#b6c48a` / `#3a4224` | Itálico dos títulos, medalhão, `etiqueta`, `btn-oliva`, reação "Adoraram" |
| `pessego` | `#ffa18f` | `#9a4c3e` | Selo `<Flor>` |
| `grade` | `#fbe2e1` | `#2b1d16` | Linhas do papel quadriculado (só no CSS) |
| `sombra` | `#4a2b1d` | `#0c0705` | Sombra de recorte (só no CSS, via `var(--sombra)`) |

### Reações dos alunos (receptividade: oliva → azul-bebê → lavanda → cereja)

Quatro níveis, como o termômetro do diário. No banco ficam as chaves `adoraram`, `gostaram`, `neutro` e
`nao_curtiram` (migração [0003](supabase/migrations/0003_quatro_reacoes.sql), que converteu as antigas
boa → gostaram, neutra → neutro, ruim → nao_curtiram).

| Token (barras) | Claro | Escuro | Reação | Pílula / selo |
|---|---|---|---|---|
| `adoraram` | `#6f7d43` | `#a9b97a` | 🤩 Adoraram — Alto engajamento | `oliva-clara` com borda `oliva` |
| `gostaram` | `#a9c8e6` | `#6f9ccc` | 🙂 Gostaram — Bom engajamento | `ceu` com borda `line` |
| `neutro` | `#c9bdee` | `#8f81c4` | 😐 Neutro — Regular / dispersos | `lavanda` com borda `lavanda-escura` |
| `nao-curtiram` | `#c82333` | `#ef5d6c` | 😕 Não curtiram — Baixo engajamento | `rosa-claro` com borda `cereja`, texto `vinho` |

- **Lógica** em [src/lib/receptividade.ts](src/lib/receptividade.ts): a ordem (`RECEPTIVIDADES`, sempre da melhor para
  a pior), os rótulos (`ROTULO_RECEPTIVIDADE`), `ehReceptividade()` para validar URL/formulário e a **aderência**
  (`calcularAderencia()`): média dos pesos **Adoraram 100%, Gostaram 67%, Neutro 33%, Não curtiram 0%**. Painel e
  pastas usam essa mesma função.
- **Classes** em `RECEPTIVIDADE` ([src/components/receptividade.tsx](src/components/receptividade.tsx)): `bg` (barras),
  `fundo` (pílulas do termômetro), `soft` (selo e opção marcada: borda + fundo pastel) e `anel` (anel da opção
  marcada). Não repita esses valores em outros lugares.

### Cores das tags

Paleta categórica de 8 cores (`--tag-1` … `--tag-8`), em ordem fixa. No banco, a tag guarda só o
índice (`cor`, de 1 a 8). Para aplicar, use `corDaTag(cor)` ou `<TagDot cor={…} />`
([src/components/tag-chip.tsx](src/components/tag-chip.tsx)); nunca guarde o hex.

### Cores das pastas

As mesmas do diário, pela **posição da turma na lista já ordenada** (`corDaPasta()` em
[src/lib/turmas.ts](src/lib/turmas.ts); a partir da 8ª turma, repetem). Use `fundoDaPasta(indice)`
([src/components/pasta.tsx](src/components/pasta.tsx)). Só a **aba aberta** é pintada; texto sempre `text-ink`.

| Token | Claro | Escuro | Na ordem padrão |
|---|---|---|---|
| `pasta-1` | `#c7ddf0` babyBlue | `#2a4258` | 6º ano |
| `pasta-2` | `#fad2dc` pastelPink | `#4d2030` | 7º ano |
| `pasta-3` | `#d6ccf2` lavender | `#3f3768` | 8º ano |
| `pasta-4` | `#dce3c3` oliveLight | `#3a4224` | 9º ano |
| `pasta-5` | `#dcebf7` softBlue | `#233547` | 1º médio |
| `pasta-6` | `#fad2dc` pastelPink | `#4d2030` | 2º médio |
| `pasta-7` | `#d6ccf2` lavender | `#3f3768` | 3º médio |

### Ordem das turmas

Turmas aparecem **sempre na ordem da escola**, nunca em ordem alfabética: 1º–9º ano, depois 1º–3º médio,
depois turmas sem série reconhecível. Use `ordenarTurmas()` ([src/lib/turmas.ts](src/lib/turmas.ts)), que lê
a etapa e a série do nome livre ("6º Ano", "2ª série do Ensino Médio", "3º EM"). `getTurmas()` e
`getPastasDeTurmas()` já devolvem nessa ordem.

## Tipografia

Três famílias, todas com `next/font/google` em [src/app/layout.tsx](src/app/layout.tsx):

- **Fraunces** (`font-display`): títulos, nome da marca, nomes de turma, títulos de cartão, números de
  destaque. Sempre pesada: `font-extrabold` (às vezes `font-bold`). Ênfase em `<em>` **itálico
  `font-semibold` `text-oliva`** ("Boa tarde, *Ana*!", "Analisa*Psi*"); dentro de `titulo-pagina` o `em`
  já sai assim.
- **Caveat** (`font-script`): recadinhos à mão, curtos e decorativos ("Clique em uma aba para abrir o
  fichário", "registrar leva menos de um minuto!"), em `text-cereja` ou `text-ink/80`, de `text-xl` a
  `text-2xl`, às vezes com leve giro (`-rotate-2`). Nunca para informação essencial nem textos longos.
- **Plus Jakarta Sans** (`font-sans`): todo o resto (corpo, formulários, listas, botões).

Regras:

- Título de página (`h1`): `titulo-pagina` (`text-vinho`), seguido de `subtitulo-pagina`. Nos formulários
  o `h1` fica dentro da `<FolhaFichario>`.
- Título de seção (`h2`): `titulo-secao`, ou uma **fita washi** como rótulo de seção (ver abaixo).
- Rótulos, labels de campo e cabeçalhos pequenos: caixa alta, `font-extrabold`, `tracking-wider`
  (`rotulo`, `label`). Datas de destaque vão entre parênteses: "(sábado, 21 de novembro)".
- Corpo: `text-base` em inputs (evita zoom no iOS) e `text-sm` no restante; botões `text-sm font-bold`
  em caixa normal (não caixa alta).
- Números e porcentagens: `tabular-nums`.

## Utilitários de componente

Definidos com `@utility` em [globals.css](src/app/globals.css). Use-os em vez de repetir classes:

| Classe | Uso |
|---|---|
| `card` | Contêiner simples: `rounded-2xl`, contorno de 2px `line`, fundo `card`. Padding fica com quem usa. |
| `painel` | Bloco grande: `rounded-3xl`, contorno 2px e sombra de recorte de **6px**. Caderno da turma, seções do painel, Turmas e tags, estados vazios grandes. |
| `adesivo` | Cartão-adesivo (sticker-card): contorno de **2.5px** e sombra de 4px que sobe para 6px no hover (o cartão sobe 2px). Cartões de atividade e vitrine do login. Junte com `rounded-2xl bg-card`. |
| `input` | Inputs, selects e textareas: contorno 2px, `rounded-xl`, `font-medium`, foco com anel `cereja`. |
| `label` | Rótulo de campo/legend: `text-xs font-extrabold uppercase tracking-wider`. Complementos como "(opcional)" levam `font-normal tracking-normal normal-case`. |
| `btn` | Base sem contorno (layout, foco `rosa-forte`, desabilitado). Use só para criar variantes. |
| `btn-adesivo` | Botão-adesivo (sticker-btn): contorno 2px e sombra `3px`; ao clicar "afunda" 2px e a sombra vira 1px. Base das variantes abaixo. |
| `btn-primary` | Ação principal (cereja → `vinho` no hover). Uma por contexto. |
| `btn-secundario` | Lavanda. Segunda ação de destaque. |
| `btn-claro` | Creme. Ações neutras com peso: Cancelar, Sair, Limpar filtros, "Anotar nova prática". |
| `btn-oliva` | Verde-oliva. Chamada do estado vazio ("Registrar a primeira atividade"). |
| `btn-danger` | Confirmação destrutiva (só no modal de exclusão). |
| `btn-ghost` | Sem contorno: botões de ícone e ações muito discretas. |
| `chip` | Opção selecionável: `rounded-xl`, contorno 2px, `text-xs font-bold` (no formulário, `py-2 text-sm`). Sempre com `chip-ativo` ou `chip-inativo`. |
| `chip-ativo` | Cereja com texto creme e sombra de 2px (turma, tag, data, filtro e item de navegação ativos). |
| `chip-inativo` | Creme, hover `rosa-claro/60`. |
| `titulo-pagina` | `h1`: Fraunces extrabold `text-3xl sm:text-4xl` em `vinho`; `em` itálico oliva. |
| `subtitulo-pagina` | Frase abaixo do `h1` (`text-sm text-ink-2`, já com margens). |
| `titulo-secao` | `h2` de seções e cartões: Fraunces extrabold `text-xl sm:text-2xl`. |
| `rotulo` | Rótulo pequeno: `text-[11px] font-extrabold uppercase tracking-wider text-ink-2`. |
| `etiqueta` | Selo oliva da etapa ("ENSINO FUNDAMENTAL II"): `rounded-md bg-oliva`, texto `page` em caixa alta. |
| `washi` | **Fita adesiva washi**: contorno 1px, pontas listradas (pseudo-elementos), caixa alta extrabold. Cor (`bg-rosa-claro`, `bg-lavanda`, `bg-ceu`, `bg-oliva-clara`), tamanho e padding ficam com quem usa; costuma levar `-rotate-1`. Rótulos de seção ("Escolha a pasta da turma", "Últimos registros"), cabeçalho do fichário e topo dos cartões. |

### Estampas, papéis e fundos

| Classe | O que é | Onde |
|---|---|---|
| `estampa-azul` | Listras azul-bebê/creme com fio laranja e estrelinhas marrons ([SVG](public/estampas/listras-azul-estrelas.svg), copiado do diário) | Capa do caderno das turmas do **fundamental** |
| `estampa-rosa` | Listras rosa/creme/marrom com estrelinhas ([SVG](public/estampas/listras-rosa-estrelas.svg), do diário) | Capa do caderno das turmas do **médio**, rodapé, moldura do login |
| `estampa-estrelas`, `estampa-ceu`, `estampa-brilhos` | Estampas antigas (foto e SVGs) | Disponíveis |
| `quadriculado` | Papel quadriculado rosa (26px) num bloco (o `body` já tem) | Área dos cartões dentro do caderno |
| `grade-rosa` | Grade `cereja` a 45% (2px, 32px) sobre `rosa` | Faixa de dica no pé do caderno |
| `espiral` | Fileira de furos de bloco espiral no topo (`::before`); pede `pt-9` | Capa do caderno |
| `folha-fichario` | Folha azul pautada, margem vermelha e furos à esquerda (`::before`); conteúdo com `pl-14` | `<FolhaFichario>` |
| `babado` | Borda ondulada: semicírculos pendurados embaixo (`::after`, 12px); cor por `--babado` (padrão `card`) | Cabeçalho |
| `furos` | Bolinhas `cereja` na borda de cima, como ticket (`::before`); cor por `--furo` | Caixa "em resumo…" do painel (pede `mt-4 pt-7`) |
| `fita` | Fita adesiva rosa solta, semitransparente; posicione com `absolute` e gire | Cantos do cartão de login |
| `listras`, `faixa-xadrez`, `vichy` | Listras rosa/creme, xadrez vinho/rosa, vichy oliva | Disponíveis |
| `animate-correr` | Rolagem infinita do letreiro (28s; pausa no hover; para em `prefers-reduced-motion`) | `<FaixaCorrida>` |

As estampas são "tecido": cores fixas, que só escurecem um pouco no tema escuro (`filter`).

### Interruptor (liga/desliga)

Para preferências sim/não (ex.: "Lembrar de mim" no login). É um `<label>` com
`<input type="checkbox" role="switch" class="peer sr-only">` seguido do trilho desenhado:
`h-6 w-10 rounded-full border border-line bg-card-2`, bolinha `size-4.5 bg-muted`; ligado vira
`peer-checked:bg-accent peer-checked:border-accent` com bolinha `bg-accent-ink` deslocada
(`peer-checked:after:translate-x-4`). Foco com `peer-focus-visible:ring-2 ring-accent/40`.

## Enfeites

Componentes em [src/components/enfeites.tsx](src/components/enfeites.tsx); a geometria (flor, estrela,
rasgo) fica em [src/lib/formas.ts](src/lib/formas.ts), com testes. Tudo é `aria-hidden`.

- **`<FaixaCorrida>`:** letreiro `bg-cereja text-creme`, `text-xs font-bold tracking-widest`, com borda de
  baixo cacau e as frases separadas por ✦ e ✿ alternados. Frases em `FRASES_LETREIRO`
  ([src/components/cabecalho.tsx](src/components/cabecalho.tsx)). Topo de todas as telas e do login.
- **`<BordaRasgada>`:** papel rasgado colado em cima de uma seção da mesma cor (`text-rosa` antes da
  `grade-rosa`); `invertida` para a borda de baixo. Determinístico pela `semente`.
- **`<Flor>`:** selo em forma de flor. Ícones da vitrine do login e adesivo "oi! ♥".
- **Adesivos:** `<Cereja>`, `<Estrela>`, `<Estrela8>`, `<Brilho>`, `<Coracao>`, `<SetaRabisco>`. No máximo
  2–3 por bloco, nas bordas, com giro leve.
- **Marca** ([src/components/logo.tsx](src/components/logo.tsx)): `<Medalhao>` é o selo redondo do diário —
  aro `oliva` com contorno cacau, miolo `card` com borda tracejada oliva, **Ψ** em Fraunces extrabold
  `cereja`, o recadinho "caderno" em Caveat oliva (só a partir de `sm`) e uma estrelinha ✦ num círculo
  `rosa-claro` no canto. `grande={false}` mostra só o Ψ (tamanhos pequenos). `<Marca>` junta medalhão +
  "Analisa*Psi*" (Fraunces extrabold `vinho`, "Psi" em itálico oliva).

## Componentes recorrentes

- **TagChip / TagDot:** bolinha na cor da tag; em fundos coloridos, `ring-1 ring-line/30`.
- **ReceptividadeBadge:** pílula `rounded-full border text-xs font-extrabold` com emoji + rótulo e as
  classes `soft` da receptividade.
- **Seletor de reação (formulário):** grade de 4 cartões (**2 colunas no celular, 4 a partir de `sm`**), `rounded-xl border-2 p-2.5` com emoji
  `text-2xl`, rótulo `text-xs font-extrabold` e descrição `text-[10px]`. Marcado: `soft` + `ring-2` + `anel`.
- **Cartão de atividade** (`AtividadeLista` em [src/components/atividade-lista.tsx](src/components/atividade-lista.tsx)):
  grade de cartões `adesivo rounded-2xl bg-card p-5 sm:p-6`, **2 colunas a partir de `md`** (`compacta` força
  uma), `gap-x-6 gap-y-9`, na ordem recebida (mais recente primeiro). De cima para baixo:
  1. **Fita washi** colada no topo (`-mt-8`), com as bolinhas das tags e o texto `rotuloDaFita()` ("Arte • Jogo",
     ou ✨ "Atividade" sem tag); cor em rodízio por `corDaFita(indice)` (rosa, lavanda, céu, oliva) — ambos em
     [src/lib/cartao.ts](src/lib/cartao.ts).
  2. Data com ícone de calendário `text-cereja` (`formatarDataCurta(data, true)`: "Qua, 18/11/2026") e o selo de
     receptividade à direita.
  3. Título em Fraunces extrabold `text-xl`.
  4. Fora da pasta, caixa `bg-ceu-claro/70` com "**Turma:** 8º Ano" (some com `mostrarTurma={false}`).
  5. `rotulo` "Descrição" + texto `text-sm text-ink/90` (recolhido, ver abaixo).
  6. Rodapé com divisória `line/15` e os botões **Editar** e **Excluir** com texto.
- **Descrição recolhida:** descrições longas (`observacaoLonga()` em [src/lib/observacao.ts](src/lib/observacao.ts):
  mais de 280 caracteres ou 4 linhas) aparecem com `line-clamp-4` e um botão "Ler tudo" / "Mostrar menos"
  (`text-xs font-bold text-cereja`, com `aria-expanded`).
- **Campo de descrição (formulário):** sempre aberto; `textarea` com `field-sizing-content min-h-48 max-h-[70vh]
  resize-y leading-relaxed`; limite `MAX_OBSERVACAO` (20.000). O contador só aparece a partir de 90% (`avisoTamanho()`).
- **Folha de fichário** (`<FolhaFichario>` em [src/components/fichario.tsx](src/components/fichario.tsx)): moldura dos
  formulários de registrar e editar. `folha-fichario rounded-3xl border-2` com sombra de **8px**; cabeçalho
  `bg-card/70` com fita washi lavanda ("Ficha de registro de campo"), o `h1` em Fraunces extrabold `text-2xl` e
  uma frase; conteúdo com `pl-14` (para não cair nos furos). As faixas internas **não** levam `relative`, para
  os furos ficarem por cima. Botões do formulário à direita, depois de uma divisória: "Cancelar" (`btn-claro`) e
  "Salvar no fichário" (`btn-primary` com ícone de check).
- **Aba da turma** ([src/components/pasta.tsx](src/components/pasta.tsx)): `rounded-2xl border-2 p-3` com o selinho da
  etapa ("Fund. II", "Médio", de `rotuloEtapa()`; `text-[10px]` sobre `bg-card/80`) à esquerda, a contagem numa
  bolinha `bg-ink text-page size-6` à direita e o nome em Fraunces extrabold `text-base sm:text-lg`. **Fechada:**
  `bg-card`, `opacity-90`, sombra de 2px. **Aberta:** cor da turma (`fundoDaPasta`), sobe 4px, sombra de 4px,
  `aria-current="page"` e uma setinha `cereja` girada 45° embaixo. É um link (`/?turma=…`, `scroll={false}`).
  Grade: **2 colunas no celular → 4 no `sm` → 7 no `lg`**, `gap-2.5`.
- **Caderno da turma** (`<CadernoDaTurma>` em [src/components/inicio.tsx](src/components/inicio.tsx)): `painel overflow-hidden`
  em quatro faixas:
  1. **Capa:** `espiral` + `estampa-azul` (fundamental) ou `estampa-rosa` (médio; sem etapa, a cor da pasta), com um
     cartão `bg-card/95 backdrop-blur-sm` por cima: `etiqueta` da etapa, pílula `rosa-claro` "N atividades registradas",
     nome em Fraunces extrabold `text-2xl sm:text-3xl`, `detalhePasta()` e, à direita (empilhados no celular), o
     `btn-secundario` **"Copiar para IA"** (só com atividades) e o `btn-primary` **"Registrar nesta turma"**.
  2. **Filtros** (`bg-card-2/60`): chips de tag ("Todas as práticas" com ícone de camadas + só as tags usadas, com a
     contagem numa pílula) e, abaixo, o **Termômetro da turma**: pílulas `rounded-lg` com o `fundo` de cada
     reação ("🤩 Adoraram: 3"), que filtram ao tocar (ativa: contorno cheio + sombra de 2px; com zero, `opacity-50`
     e não clica). À direita, em itálico, "Da mais recente para a mais antiga · N% de aderência". Tudo muda a URL
     (`?turma=&tag=&receptividade=`, de `hrefDaPasta()`); tocar no ativo tira o filtro.
  3. **Folhas:** `quadriculado min-h-[380px]` com os cartões de atividade. Filtrando, "3 de 10 atividades" + "Limpar
     filtros" (`btn-claro`). Vazio: ícone de caderno num quadrado `rosa-claro` girado com sombra, "Nenhuma folha
     preenchida aqui ainda!" e `btn-oliva` "Registrar a primeira atividade".
  4. **Pé:** `<BordaRasgada className="text-rosa">` + faixa `grade-rosa` com a dica 💡 num cartão creme (link para o
     Painel) e o `btn-claro` "Anotar nova prática".
- **Copiar para IA** (`<BotaoCopiarIA>` em [src/components/botao-copiar-ia.tsx](src/components/botao-copiar-ia.tsx)): lavanda
  com ícone de brilho `lavanda-escura`. Copia o texto de `textoParaIA()` ([src/lib/relatorio-ia.ts](src/lib/relatorio-ia.ts)),
  montado no servidor com **todas** as atividades da turma (ignora os filtros da tela): cabeçalho "DIÁRIO DE ESTÁGIO —
  PSICOLOGIA ESCOLAR" com o nome da conta (`nomeCompleto()`) e a turma com a etapa ("8º Ano (Fund. II)", de
  `rotuloDaTurma()`), resumo por tag e por reação, as atividades da reação mais alta para a mais baixa
  (`ordenarPorReacao()`; título em caixa alta, data com dia da semana, tags, reação e descrição) e o prompt sugerido.
  Ao copiar, vira "Copiado! Cole na sua IA" com check `oliva` por 2,5s; se o navegador bloquear, balão de erro.
- Endereços antigos `/turmas` e `/turmas/[id]` redirecionam para o início (em `next.config.ts`), com os filtros.
- **Registro salvo:** a mensagem de sucesso termina com o link "Ver na pasta →".
- **Ações de editar e apagar** ([src/components/acoes.tsx](src/components/acoes.tsx)): `<BotaoEditar>` (caneta) e
  `<BotaoApagar>` (lixeira) do Lucide. **Com `texto`** (cartões de atividade) viram botões pequenos contornados
  `rounded-lg border border-line bg-card-2 text-xs font-bold` com ícone + texto ("Editar" com hover `ceu`, "Excluir"
  em `vinho` com hover `rosa-claro`). **Sem `texto`** (listas de turmas e tags) são só o ícone, `size-8`. `rotulo` é
  obrigatório e vira `aria-label` + `title`.
- **Modal de confirmação de exclusão:** toda exclusão passa por ele (já vem dentro do `<BotaoApagar>`); nunca use
  `confirm()`. `<dialog>` nativo (Esc e clique fora fecham), centralizado: `rounded-3xl border-2 bg-card p-6` com
  sombra de 6px, fundo `backdrop:bg-ink/60`, lixeira `cereja` num quadrado `rosa-claro` contornado, título em Fraunces
  extrabold e a frase do que acontece. Botões centralizados: "Cancelar" (`btn-claro`, foco inicial) e "Apagar"
  (`btn-danger`, vira "Apagando…"). Os textos ficam em [src/lib/exclusao.ts](src/lib/exclusao.ts).
- **Filtros (Histórico, Painel):** selects `input py-2 text-sm` que atualizam a URL; filtro ativo ganha
  `border-accent`; "Limpar filtros" só quando há filtro.
- **Ranking** ([src/components/ranking.tsx](src/components/ranking.tsx)): nome, aderência em negrito, barra empilhada
  das 4 reações (`h-2.5 rounded-full`, `gap-[2px]`, trilho `bg-card-2`) e detalhe `text-xs text-muted`. Melhor/pior
  ganham `▲ melhor` / `▼ pior`; menos de `MIN_AMOSTRA` atividades mostra "poucos dados".
- **Destaque (painel):** `card` com sombra de 3px e faixa vertical de 4px à esquerda (`bg-adoraram` / `bg-nao-curtiram`), `rotulo`
  e valor em Fraunces extrabold `text-2xl sm:text-3xl`.
- **Caixa de resumo:** `card furos bg-accent-soft/60`, com o recadinho "em resumo…" (`font-script text-cereja`).

## Layout

- Largura máxima do conteúdo: `max-w-7xl`, com `px-4 sm:px-8`; `main` com `pt-10 pb-16`.
- **Cabeçalho** (`<Cabecalho>` em [src/components/cabecalho.tsx](src/components/cabecalho.tsx)), em todas as telas logadas:
  1. `<FaixaCorrida>` cereja.
  2. `header` `babado bg-card` com divisória `line/15`: à esquerda o `<Medalhao>` (`size-16 sm:size-24`), a pílula
     lavanda "Caderno de campo & planejamento" (a partir de `sm`), "Analisa*Psi*" em Fraunces extrabold `vinho`
     (+ "— Psicologia Escolar" em itálico oliva a partir de `md`) e o recadinho "Descubra o que ~funciona~ com cada
     turma" (sublinhado ondulado `rosa-forte`, a partir de `sm`). À direita, `btn-primary` **"Registrar atividade"**
     (largura cheia no celular), o **"Backup JSON"** e "Sair" (ambos `btn-claro`, só ícone no celular).
  - **Backup JSON** (`<BotaoBackup>` em [src/components/botao-backup.tsx](src/components/botao-backup.tsx)): ícone de
    download `cereja`; ao clicar faz `GET /api/atividades` (todas as atividades, formato em
    [src/lib/backup.ts](src/lib/backup.ts)) e baixa `backup-analisapsi-AAAA-MM-DD.json`. Enquanto busca, "Baixando…"
    (desabilitado); ao terminar, "Baixado!" com check `oliva` por 2,5s. Erro (sessão expirada, falha, sem internet)
    aparece num balão creme contornado com sombra de 3px logo abaixo do botão (`role="alert"`), que some em 6s.
  3. Navegação (`<NavTopo>` em [src/components/nav.tsx](src/components/nav.tsx)): chips com ícone para os itens de
     `MENU_TOPO` (Pastas, Histórico, Painel, Turmas e tags — "Registrar" já é o botão principal). Ativo `chip-ativo`
     com `aria-current="page"`, decidido por `itemAtivo()` ([src/lib/modulos.ts](src/lib/modulos.ts)). No celular a
     fileira rola de lado. Fica num `Suspense` com `<NavTopoEstatica>` (sem ativo) de fallback.
- **Rodapé** (`<Rodape>`): `estampa-rosa` com borda de cima cacau e um cartão creme contornado com sombra de 3px.
- **Fundo:** o `body` é papel quadriculado (linhas `--grade` a cada 26px) em todas as telas.
- Telas de duas colunas só a partir de `lg` (ex.: formulário + últimos registros, login).
- Espaçamento vertical entre blocos: `space-y-8` (início), `space-y-6` (seções), `gap-2.5` (abas), `gap-2` (chips).

## Telas de entrada

- **Módulos** são definidos uma vez em `MODULOS` ([src/lib/modulos.ts](src/lib/modulos.ts)) — rota, rótulo, descrição,
  ícone e grupo — e alimentam a navegação do cabeçalho (`MENU_TOPO`) e a vitrine do login.
- As peças visuais do Início ficam em [src/components/inicio.tsx](src/components/inicio.tsx) (recebem dados por props);
  a página só busca os dados.
- **Início (`/`) = tela das pastas.** De cima para baixo:
  1. **Saudação** (`<CabecalhoInicio>`): data entre parênteses em `rotulo`, `h1` `titulo-pagina` "Boa tarde, *Ana*!",
     a frase de status (último registro) e, a partir de `sm`, o recadinho "registrar leva menos de um minuto!".
  2. **Abas das turmas** (`<GradePastas>`): fita washi `rosa-claro` "Escolha a pasta da turma" como `h2`, o recadinho
     "Clique em uma aba para abrir o fichário" (a partir de `sm`), o total de turmas e a grade de abas.
  3. **Caderno da turma aberta** (`<CadernoDaTurma>`). Sem `?turma=`, abre a pasta da atividade mais recente
     (`pastaMaisRecente()`); sem nenhuma atividade, a primeira.
  Sem turmas cadastradas, um `painel` vazio com "Cadastrar turmas".
- **Registrar:** `<FolhaFichario>` com o formulário à esquerda e, a partir de `lg`, "Últimos registros" (fita washi
  `ceu` + "Ver tudo") com os cartões em uma coluna (`compacta`).
- **Login:** `<FaixaCorrida>` no topo. Duas colunas a partir de `lg`: à esquerda `<Marca>`, "(Seu caderno de
  atividades)", chamada em Fraunces extrabold `text-5xl` `vinho` com "funciona" em itálico oliva, recadinho com seta e
  a vitrine dos módulos (cartões `adesivo` com ícone em flor, não clicáveis); à direita o formulário num `card` com
  sombra de 4px, preso por duas `fita`s sobre uma moldura `estampa-rosa` contornada (`rounded-[2rem]`, sombra de
  6px), com o adesivo "oi! ♥" (flor lavanda) e uma `<Estrela8>`. O `main` usa `overflow-x-clip`.
- Saudações e mensagens de boas-vindas evitam marcar gênero: "Boas-vindas", "Que bom ver você".

## Bordas, sombras e ícones

- **Contorno cacau em tudo** que é interativo ou é um bloco: 2px (`card`, `painel`, `input`, `chip`, botões),
  2.5px nos cartões `adesivo`, 1px em fitas washi e pílulas pequenas. Divisórias internas em `line/10`–`line/20`.
- Raios: `rounded-3xl` para painéis, modal e fichário; `rounded-2xl` para cartões e abas; `rounded-xl` para
  inputs, botões e chips; `rounded-lg` para pílulas do termômetro e botões pequenos; `rounded-md` para `etiqueta`;
  `rounded-full` para selos de receptividade e contagens.
- **Sem sombras borradas** (exceto o leve `shadow-sm` do medalhão e dos cartões por cima de estampas). A sombra
  padrão é a "de recorte": sólida, deslocada, em `var(--sombra)` — 2px (chip ativo, aba fechada), 3px (botões,
  destaques, rodapé), 4px (cartões, aba aberta, cartão do login), 6px (painéis, modal, moldura do login),
  8px (folha de fichário).
- Ícones: **Lucide** (`lucide-react`), `size-4` em botões e `size-3.5` em chips e botões pequenos, sempre com
  `aria-hidden`. Os ícones dos módulos ainda usam `<Icone d="…" />` ([src/components/icone.tsx](src/components/icone.tsx)),
  com o mesmo traço.

## Estados

- **Carregando:** `<SkeletonBloco linhas={n} />` (barras `bg-card-2` com `animate-pulse`) como fallback de
  `Suspense`. Ações em andamento reduzem a opacidade (`opacity-40` a `opacity-60`) e desabilitam botões.
- **Vazio:** ícone num quadrado `rosa-claro` girado com sombra de recorte (ou emoji grande), título em Fraunces,
  frase curta e, quando fizer sentido, um botão levando à ação.
- **Erro de página:** cartão centralizado com 😕, título "Algo deu errado" e botão "Tentar de novo".
- **Erro de formulário:** `rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger` com `role="alert"`.
- **Sucesso:** `rounded-xl bg-success/10 … text-success` com `role="status"`.

## Acessibilidade

- Foco visível sempre: anel `rosa-forte` (já incluso em `btn` e `chip`; inputs usam anel `cereja`).
- Grupos de opções em `fieldset` + `legend`; campos com `label htmlFor`.
- Emojis, ícones e enfeites decorativos com `aria-hidden`; o significado vem sempre do texto ao lado.
- Recadinhos em `font-script` são enfeite: a informação deles também aparece em texto comum na tela.
- Animações (letreiro) param com `prefers-reduced-motion` e pausam no hover.
- Cor nunca é a única informação: receptividade tem emoji + rótulo, rankings têm porcentagem e contagem.
- `lang="pt-BR"` no `html`; datas formatadas em pt-BR ([src/lib/dates.ts](src/lib/dates.ts)).
