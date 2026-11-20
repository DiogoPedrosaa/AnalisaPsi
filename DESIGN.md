# Design do AnalisaPsi

Padrões visuais e de interface do app. Todo componente novo deve seguir este documento, e todo
padrão novo deve ser registrado aqui.

## Princípios

- **Prático: poucas telas.** O dia a dia cabe em duas telas: **Pastas** (o início) e **Registrar**.
  Tudo o que dá para resolver na mesma tela fica nela (abrir a pasta de uma turma, filtrar, editar),
  em vez de virar mais uma aba. Histórico, Painel e Turmas e tags existem, mas ficam no grupo "Mais".
- **Rápido de usar no celular.** O registro de uma atividade deve levar menos de um minuto, com uma
  mão só. Alvos de toque grandes, chips em vez de selects sempre que a lista for curta, e valores
  padrão inteligentes (data de hoje, turma anterior, tags sugeridas).
- **Doceria retrô / caderno de recortes.** A estética vem de sites de doceria e de "scrapbook":
  papel creme quadriculado, vinho e cereja, rosa-chiclete, lavanda e azul-céu; títulos em serifa
  elegante, recadinhos em letra de mão, selos em forma de flor, babados, faixas xadrez, papel rasgado,
  fitas adesivas e adesivos (cereja, estrelas, brilhos). Os enfeites são **decorativos e pontuais**:
  ficam nas telas de entrada (Início, Login), em títulos e destaques — nunca atrapalhando formulários,
  listas e gráficos, que continuam limpos. Emojis aparecem com moderação (receptividade, estados vazios).
- **Dados honestos.** Os gráficos mostram a composição real (boa / neutra / ruim) e marcam quando há
  "poucos dados", em vez de exagerar conclusões.
- **Tudo em português do Brasil**, num tom próximo e direto ("Não rolou", "Leva menos de um minuto").

## Cores

As cores são variáveis CSS em `:root` ([src/app/globals.css](src/app/globals.css)), expostas ao
Tailwind via `@theme inline`. **Nunca use cores literais (`#hex`, `bg-blue-500`) em componentes**:
use sempre os tokens (`bg-card`, `text-ink-2`, `border-line`…). O tema escuro é automático
(`prefers-color-scheme`) e só funciona se os tokens forem respeitados.

### Superfícies e texto

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `page` | `#fdf6ee` | `#1d0b0f` | Fundo da página (creme; no escuro, chocolate-vinho) |
| `card` | `#fffcf7` | `#2a1217` | Cartões, inputs, menu lateral |
| `card-2` | `#fbeae6` | `#3a1a20` | Fundo secundário: hover, trilhos de barra, skeleton, chips de tag |
| `ink` | `#4b0f1c` | `#fbe8de` | Texto principal (vinho bem escuro) |
| `ink-2` | `#7c3442` | `#e7bcc0` | Texto secundário, rótulos, subtítulos |
| `muted` | `#94636b` | `#b48d91` | Texto de apoio, placeholders, "nenhum dado" |
| `line` | `#f0cdd2` | `#4d2229` | Bordas (rosadas) e divisórias |

### Destaque e estados

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `accent` | `#8a1430` | `#f7a1bf` | Vinho (no escuro, rosa): ações principais, item ativo, foco, links |
| `accent-ink` | `#fff3e6` | `#3a0a16` | Texto sobre `accent` |
| `accent-soft` | `#fde1e5` | `#4a1a28` | Fundo do item ativo da navegação, caixa de resumo |
| `danger` | `#c41e3a` | `#ff8a8f` | Mensagens de erro, ação de apagar |
| `success` | `#2e7d4f` | `#6fd39a` | Mensagem de sucesso |

### Enfeites (tema "doceria retrô")

Cores de decoração, para faixas, selos, adesivos e estampas. Também viram classes do Tailwind
(`bg-rosa`, `text-cereja`, `text-pessego`…). Não use para significado (erro, receptividade).

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `rosa` | `#f59fc2` | `#6e2443` | Barra do topo e babado, seção de módulos, fita adesiva |
| `rosa-claro` | `#fcd3e1` | `#4a1b2b` | Flores dos ícones, fundo de `etiqueta`, selo de número |
| `cereja` | `#d42a3c` | `#e5566a` | Grade da seção de módulos, borda dos cartões de módulo, recadinhos, letreiro, furos |
| `vinho` | `#801026` | `#a0284a` | Faixa xadrez, selo de número escuro, estrelas, sombra de hover |
| `creme` | `#fff3e6` | `#fff0e4` | Texto sobre `vinho`/`cereja`, listras |
| `pessego` | `#ffa18f` | `#9a4c3e` | Selo de número |
| `lavanda` | `#c5c6f6` | `#3d3a6e` | `btn-secundario`, adesivo "oi!" (texto em `ink`) |
| `ceu` | `#b5ccde` | `#2c4257` | Reserva (combina com a estampa céu) |
| `grade` | `#f6dce0` | `#2a1419` | Linhas do papel quadriculado (só no CSS) |
| `sombra` | `#4b0f1c` | `#0d0406` | "Sombra de recorte" dos botões cheios (só no CSS) |

### Receptividade (escala divergente)

| Token | Claro | Escuro | Significado |
|---|---|---|---|
| `boa` | `#3b78c4` | `#5b97e0` | 😊 Boa: turma engajou |
| `neutra` | `#cdbab5` | `#7a6862` | 😐 Neutra: nem bem, nem mal |
| `ruim` | `#e0434f` | `#ef6a74` | 😕 Ruim: não rolou |

A ordem é sempre **boa → neutra → ruim** (`ORDEM_RECEPTIVIDADE`). Rótulos, emojis e classes ficam
centralizados em `RECEPTIVIDADE` ([src/components/receptividade.tsx](src/components/receptividade.tsx)):
não repita esses valores em outros lugares. Para fundos suaves, use opacidade sobre o token
(`bg-boa/12`, `bg-ruim/10`) com texto `text-ink`.

### Cores das tags

Paleta categórica de 8 cores (`--tag-1` … `--tag-8`), em ordem fixa. No banco, a tag guarda só o
índice (`cor`, de 1 a 8). Para aplicar, use `corDaTag(cor)` ou `<TagDot cor={…} />`
([src/components/tag-chip.tsx](src/components/tag-chip.tsx)); nunca guarde o hex.

### Cores das pastas

Cada turma tem a sua pasta colorida: 7 tons pastel (`--pasta-1` … `--pasta-7`, classes `bg-pasta-N`),
dados pela **posição da turma na lista já ordenada** (`corDaPasta()` em [src/lib/turmas.ts](src/lib/turmas.ts);
a partir da 8ª turma, repetem). Para aplicar, use `fundoDaPasta(indice)` ([src/components/pasta.tsx](src/components/pasta.tsx)).
Texto sempre `text-ink` por cima. É enfeite de identificação, não significado.

| Token | Claro | Escuro | Na ordem padrão |
|---|---|---|---|
| `pasta-1` | `#c9dcef` céu | `#26405a` | 6º ano |
| `pasta-2` | `#fcd3e1` rosa | `#57203a` | 7º ano |
| `pasta-3` | `#d9d3f7` lavanda | `#3a3570` | 8º ano |
| `pasta-4` | `#dfe6c4` oliva | `#3b4520` | 9º ano |
| `pasta-5` | `#ffd6c9` pêssego | `#5e3226` | 1º médio |
| `pasta-6` | `#f8e7a8` manteiga | `#54461a` | 2º médio |
| `pasta-7` | `#c8e8d8` menta | `#1f4a3c` | 3º médio |

### Ordem das turmas

Turmas aparecem **sempre na ordem da escola**, nunca em ordem alfabética: 1º–9º ano, depois 1º–3º médio,
depois turmas sem série reconhecível (ex.: 6º, 7º, 8º, 9º, 1º Médio, 2º Médio, 3º Médio). Use
`ordenarTurmas()` ([src/lib/turmas.ts](src/lib/turmas.ts)), que lê a etapa e a série do nome livre
("6º Ano", "2ª série do Ensino Médio", "3º EM"). `getTurmas()` e `getPastasDeTurmas()` já devolvem nessa ordem.

## Tipografia

Três famílias, todas carregadas com `next/font/google` em [src/app/layout.tsx](src/app/layout.tsx):

- **Instrument Serif** (`font-display`): títulos, nomes de módulo, números grandes, saudação. Só peso
  400; para ênfase use `<em>` (itálico), geralmente em `text-accent` ("Boa noite, *Ana*!",
  "Analisa*Psi*"). Nunca use `font-bold` nela.
- **Caveat** (`font-script`): recadinhos à mão, curtos e decorativos ("leva menos de um minuto!",
  "em resumo…", "abrir →"), em `text-cereja`, de `text-xl` a `text-6xl`, às vezes com leve giro
  (`-rotate-2`). Nunca para informação essencial nem para textos longos.
- **Geist** (`font-sans`): todo o resto (corpo, formulários, listas). **Geist Mono** em `font-mono`.

Regras:

- Título de página (`h1`): `titulo-pagina`, seguido de `subtitulo-pagina` explicando a tela em uma frase.
- Título de seção (`h2`): `titulo-secao`.
- Rótulos, cabeçalhos de grupo (ex.: data no histórico), labels de campo e itens do menu: caixa alta
  pequena com espaçamento largo (`rotulo`, `label`). Datas de destaque vão entre parênteses:
  "(quarta-feira, 18 de novembro)".
- Corpo: `text-base` em inputs (evita zoom no iOS) e `text-sm` no restante.
- Detalhes e legendas: `text-xs text-muted`.
- Números e porcentagens: `tabular-nums`, para alinhar em listas.

## Utilitários de componente

Definidos com `@utility` em [globals.css](src/app/globals.css). Use-os em vez de repetir classes:

| Classe | Uso |
|---|---|
| `card` | Contêiner padrão: `rounded-2xl`, borda de 2px `line`, fundo `card`. Padding fica a cargo de quem usa (`p-4`, `p-5`, `sm:p-6`). |
| `input` | Inputs, selects e textareas (borda de 2px). Foco com borda e anel `accent`. |
| `label` | Rótulo acima de campo ou `legend` de fieldset (caixa alta, espaçamento largo). Complementos como "(opcional)" levam `font-normal tracking-normal normal-case`. |
| `btn-primary` | Ação principal da tela (uma por contexto). Vinho, texto em caixa alta, com "sombra de recorte" (`3px 3px` em `--sombra`) que cresce no hover e encolhe ao clicar. |
| `btn-secundario` | Segunda ação de destaque ao lado do primário (ex.: "Ver o painel"). Lavanda, mesma sombra. |
| `btn-danger` | Confirmação de ação destrutiva (só dentro do modal de exclusão). |
| `btn-ghost` | Ações discretas: cancelar, sair, limpar filtros, botões de ícone. |
| `chip` | Opções selecionáveis em forma de pílula, borda de 2px (turmas, tags, atalhos de data). |
| `titulo-pagina` | `h1` das telas: `font-display text-4xl sm:text-5xl`. |
| `subtitulo-pagina` | Frase abaixo do `h1` (`text-sm text-ink-2`, já com as margens). |
| `titulo-secao` | `h2` de seções, cartões e modal: `font-display text-2xl`. |
| `rotulo` | Rótulo pequeno em caixa alta (`text-[11px]`, `tracking-[0.18em]`, `text-ink-2`). |
| `etiqueta` | Pílula retangular com borda `cereja` e fundo `rosa-claro`, em caixa alta: nome do módulo no cartão. |

### Estampas e fundos

| Classe | O que é | Onde |
|---|---|---|
| `estampa-estrelas` | Listras onduladas rosa/creme/marrom com estrelinhas ([public/estampas/listras-estrelas.webp](public/estampas/listras-estrelas.webp), recorte sem emenda da referência) | Moldura do formulário de login, recorte decorativo do menu, topo do caderno das turmas do **médio** |
| `estampa-brilhos` | Listras vermelhas com brilhos de 4 pontas ([SVG](public/estampas/listras-brilhos.svg)) | Disponível |
| `estampa-ceu` | Listras céu/creme com fio laranja e estrelas de 8 pontas ([SVG](public/estampas/listras-ceu.svg)) | Topo do caderno das turmas do **fundamental** |
| `quadriculado` | Papel quadriculado num bloco (o `body` já tem a grade no fundo de tudo) | Topo da tela de início |
| `grade-rosa` | Grade `cereja` grossa sobre `rosa` | Disponível |
| `listras` | Listras verticais `rosa`/`creme` que seguem o tema | Disponível |
| `faixa-xadrez` | Xadrez `vinho`/`rosa` de 16px, usado como faixa (`h-3`/`h-4`) | Rodapé do topo da tela de início, acima do "Sair" |
| `vichy` | Xadrez vichy verde-oliva (moldura de foto) | Disponível |
| `babado` | Bolinhas penduradas embaixo do elemento (`::after`); cor por `--babado` (padrão `rosa`) | Barra do topo e topo do menu |
| `furos` | Fileira de bolinhas `cereja` na borda de cima, como ticket picotado (`::before`); cor por `--furo` | Caixa "em resumo…" do painel (pede `mt-4 pt-7`) |
| `fita` | Fita adesiva rosa semitransparente com pontas serrilhadas; posicione com `absolute` e gire | Cantos do cartão de login, recorte do menu |
| `animate-correr` | Rolagem infinita do letreiro (para em `prefers-reduced-motion`) | `<FaixaCorrida>` |

As estampas são "tecido": cores fixas, que só escurecem um pouco no tema escuro (`filter`). Use-as
como moldura ou recorte decorativo, nunca atrás de texto corrido.

### Interruptor (liga/desliga)

Para preferências do tipo sim/não (ex.: "Lembrar de mim" no login). É um `<label>` com
`<input type="checkbox" role="switch" class="peer sr-only">` seguido do trilho desenhado:
`h-6 w-10 rounded-full border border-line bg-card-2`, bolinha `size-4.5 bg-muted`; ligado vira
`peer-checked:bg-accent peer-checked:border-accent` com bolinha `bg-accent-ink` deslocada
(`peer-checked:after:translate-x-4`). Foco com `peer-focus-visible:ring-2 ring-accent/40`. Ao lado, rótulo
`text-sm font-medium` e, se preciso, uma explicação curta em `text-xs text-muted`.

### Estados de chip

- Turma selecionada: `border-accent bg-accent text-accent-ink`.
- Tag selecionada: `border-ink bg-ink text-page` (tags usam neutro para não competir com as cores delas).
- Atalho selecionado (Hoje / Ontem): `border-accent bg-accent-soft text-accent`.
- Não selecionado: `border-line bg-card text-ink` com hover `hover:border-accent/50`.
- Adicionar novo: `border-dashed border-line text-ink-2`.

## Enfeites

Componentes em [src/components/enfeites.tsx](src/components/enfeites.tsx); a geometria (flor, estrela,
rasgo) fica em [src/lib/formas.ts](src/lib/formas.ts), com testes. Tudo é `aria-hidden`.

- **`<Flor>`:** selo em forma de flor (círculo de borda ondulada). `cor` pinta a flor (`text-pessego`,
  `text-vinho`, `text-rosa-claro`, `text-lavanda`), `className` estiliza o conteúdo por cima. Usos:
  ícones dos módulos na vitrine do login (`size-11`, flor `rosa-claro`, ícone `accent`) e adesivo "oi!" do login. Se você passar `absolute`, a flor não recebe `relative`.
- **`<BordaRasgada>`:** papel rasgado colado fora de uma seção da mesma cor (`absolute bottom-full`
  em cima; `invertida` + `absolute top-full` embaixo). O rasgo é determinístico pela `semente`.
- **Adesivos:** `<Cereja>`, `<Estrela>` (5 pontas, "à mão"), `<Estrela8>`, `<Brilho>` (4 pontas),
  `<Coracao>`, `<SetaRabisco>` (seta com laço, acompanha recadinhos). No máximo 2–3 por bloco,
  espalhados nas bordas, com giro leve.
- **`<FaixaCorrida>`:** letreiro `cereja` em caixa alta que passa no topo da tela de login.
- **Logo** ([src/components/logo.tsx](src/components/logo.tsx)): `<Logo>` é uma flor `accent` com três
  barras crescentes; `<Marca>` junta logo + "Analisa*Psi*" em `font-display`.

## Componentes recorrentes

- **TagChip / TagDot:** pílula pequena em `card-2` com bolinha na cor da tag.
- **ReceptividadeBadge:** pílula com emoji + rótulo, borda e fundo suave na cor da receptividade.
- **Seletor de receptividade:** grade de 3 botões grandes (`rounded-2xl border-2`) com emoji
  `text-3xl`, rótulo e descrição (descrição só a partir de `sm`).
- **BarraReceptividade** ([src/components/ranking.tsx](src/components/ranking.tsx)): barra empilhada
  boa/neutra/ruim usada no Ranking do painel. Altura por `className`
  (padrão `h-2.5`).
- **Ranking:** nome à esquerda, aderência em negrito à direita, barra empilhada
  boa/neutra/ruim (`h-2.5 rounded-full`, `gap-[2px]`, trilho `bg-card-2`) e linha de detalhe em
  `text-xs text-muted`. Melhor/pior ganham selo `▲ melhor` / `▼ pior`. Grupos sem dados ficam com
  `opacity-50`; grupos com menos de `MIN_AMOSTRA` atividades mostram "poucos dados".
- **Destaque (painel):** `card` com faixa vertical de 4px à esquerda (`bg-boa` para melhor,
  `bg-ruim` para pior), `rotulo` e valor grande em serifa (`font-display text-2xl sm:text-3xl`).
- **Caixa de resumo:** `card furos border-cereja/40 bg-accent-soft/60`, com o recadinho "em resumo…"
  (`font-script text-cereja`) e o texto `leading-relaxed`.
- **Lista de atividades:** agrupada por dia, cada grupo é um `card divide-y divide-line`, com as ações
  de editar/apagar em ícone abaixo do selo de receptividade. Dentro da pasta de uma turma, o nome da
  turma some de cada item (`mostrarTurma={false}`) e a edição volta para a pasta (`voltarPara`).
- **Descrição recolhida:** descrições longas (`observacaoLonga()` em [src/lib/observacao.ts](src/lib/observacao.ts):
  mais de 280 caracteres ou 4 linhas) aparecem com `line-clamp-4` e um botão de texto "Ler tudo" /
  "Mostrar menos" (`text-xs font-semibold text-accent`, com `aria-expanded`).
- **Campo de descrição (formulário):** sempre aberto, porque os relatos costumam ser longos (planejamento
  + como foi). `textarea` com `field-sizing-content min-h-48 max-h-[70vh] resize-y leading-relaxed`;
  limite em `MAX_OBSERVACAO` (20.000, igual ao banco). O contador "18.000 de 20.000 caracteres"
  (`text-xs text-muted`, à direita) só aparece a partir de 90% do limite (`avisoTamanho()`).
- **Pasta** ([src/components/pasta.tsx](src/components/pasta.tsx)): pasta **compacta** da grade do início.
  Aba de arquivo pequena (`h-3 w-2/5 rounded-t-md border-2 border-b-0`, `-mb-0.5`) e corpo
  `rounded-xl rounded-tl-none border-2 px-2.5 pt-2 pb-2.5`, ambos na cor da turma (`fundoDaPasta`). Dentro:
  nome em `font-display text-lg sm:text-xl`, contador de atividades numa bolinha `bg-ink text-page`
  (`h-5 min-w-5 text-[11px]`) à direita e a etapa curta ("Fund. II", "Médio", de `rotuloEtapa()`) em caixa
  alta `text-[10px]`. Fechada: borda `line`, hover sobe 2px. **Aberta:** borda `ink`, sobe 4px, sombra de
  recorte `--sombra` via `drop-shadow` sem desfoque (segue o contorno da aba), `aria-current="page"` e
  uma setinha `cereja` girada 45° embaixo, apontando para o caderno. É um link (`/?turma=…`, `scroll={false}`).
  Grade: **3 colunas no celular → 4 no `sm` → 7 (todas numa linha) no `lg`**, `gap-x-2 sm:gap-x-3 gap-y-3`.
- **Caderno da turma** (`<CadernoDaTurma>` em [src/components/inicio.tsx](src/components/inicio.tsx)): o que
  antes era a página `/turmas/[id]` agora abre logo abaixo das pastas. `card` com sombra de recorte `--line`,
  em três faixas:
  1. **Capa:** `estampa-ceu` (fundamental) ou `estampa-estrelas` (médio; sem etapa, a cor da pasta) com um
     `card` por cima: `etiqueta` com a etapa por extenso, pílula na cor da pasta com "N atividades", nome em
     `font-display text-4xl`, `detalhePasta()` e o `btn-primary` **"Registrar nesta turma"** (`/registrar?turma=…`,
     que já abre com a turma marcada). Um `<Brilho>` no canto.
  2. **Filtros em chips** (`bg-card-2/50`): linha "Tags" (Todas + só as tags usadas na turma, com contagem) e
     linha "Termômetro da turma" (Boa / Neutra / Ruim com contagem; com zero ficam `opacity-50` e não clicam) e
     a aderência. Cada chip é um link que muda a URL (`?turma=&tag=&receptividade=`, de `hrefDaPasta()`);
     tocar no chip ativo tira o filtro. Ativo: tag `border-ink bg-ink text-page`; receptividade `RECEPTIVIDADE[k].soft`.
  3. **Lista:** `AtividadeLista` sem o nome da turma, voltando para a mesma pasta e filtros ao editar.
     Filtrando, aparece "3 de 10 atividades" + "Limpar filtros". Pasta vazia: 🗂️, "Nenhuma folha preenchida
     aqui ainda!" e "Registrar nesta turma".
- Endereços antigos `/turmas` e `/turmas/[id]` redirecionam para o início (em `next.config.ts`), com os filtros.
- **Registro salvo:** a mensagem de sucesso termina com o link "Ver na pasta →", que abre a pasta da turma.
- **Ações de editar e apagar** ([src/components/acoes.tsx](src/components/acoes.tsx)): sempre ícones, nunca
  texto. `<BotaoEditar>` usa a caneta (`Pencil`) do Lucide, com `href` (link) ou `onClick` (ex.: renomear
  inline); `<BotaoApagar>` usa a lixeira (`Trash2`). Ambos são botões `size-8 rounded-lg` com ícone `size-4`
  em `text-ink-2`; hover `bg-card-2` na caneta e `bg-ruim/10 text-danger` na lixeira. Como não têm texto,
  `rotulo` é obrigatório e vira `aria-label` + `title` (ex.: `Apagar “Colagem”`).
- **Modal de confirmação de exclusão:** toda exclusão passa por ele, e ele já vem dentro do `<BotaoApagar>`;
  nunca use `confirm()`. É um `<dialog>` nativo (`showModal()`, Esc fecha, clique fora fecha) com
  `card max-w-sm p-6` e sombra de recorte, título em `titulo-secao`, fundo `backdrop:bg-ink/40`, lixeira num círculo `bg-ruim/10 text-danger`,
  título "Apagar …?" e uma frase dizendo o que acontece (inclusive com as atividades ligadas).
  Botões: "Cancelar" (`btn-ghost`, com foco inicial) e "Apagar" (`btn-danger`, vira "Apagando…").
  Erro aparece dentro do modal. Os textos ficam em [src/lib/exclusao.ts](src/lib/exclusao.ts).
- **Filtros:** selects com `input py-2 text-sm` que atualizam a URL; filtro ativo ganha
  `border-accent`; botão "Limpar filtros" aparece só quando há filtro.

## Layout

- Largura máxima do conteúdo: `max-w-5xl`, com `px-4` nas laterais.
- **Menu lateral** ([src/components/nav.tsx](src/components/nav.tsx)): `aside` fixo à esquerda (`w-64`,
  `bg-card`, borda direita `line`) com logo no topo, os módulos no meio e "Sair" no rodapé. Os módulos vêm em
  dois grupos (`grupo` em `MODULOS`): **principais** (Pastas, Registrar) no tamanho normal e, abaixo de um
  `rotulo` "Mais" em `text-muted`, os demais (Histórico, Painel, Turmas e tags) menores (`py-2 text-[11px]`,
  ícone `size-4`).
  - **Desktop (a partir de `md`):** aberto por padrão; o conteúdo ganha `md:pl-64`. Pode ser escondido a
    qualquer momento pelo botão da barra do topo, pela seta no topo do menu ou com **Ctrl/⌘ + B**.
    A escolha fica salva no `localStorage` (`CHAVE_MENU`) e vira `data-menu="fechado"` no `<html>`,
    aplicado por um script inline no `<head>` antes da primeira pintura (sem "piscar").
  - Para estilizar o estado escondido, use a variante **`menu-fechado:`** (definida em `globals.css`),
    sempre junto de `md:` — ex.: `md:menu-fechado:pl-0`, `md:menu-fechado:-translate-x-full`.
  - **Celular:** o menu vira gaveta por cima do conteúdo (`z-40`), com fundo `bg-ink/30` que fecha ao
    tocar; também fecha ao escolher um item ou apertar Esc.
  - Menu escondido também fica `invisible`, para os links saírem da ordem do Tab.
- **Barra do topo** (`h-14`, `sticky`, `bg-rosa babado`): faixa rosa com babado de bolinhas, como o topo
  de uma doceria; botão de mostrar/esconder o menu e, quando o menu não está visível, a `<Marca>`.
  O topo do menu lateral repete a mesma faixa rosa com babado, para as duas se alinharem.
- **Menu lateral (enfeites):** abaixo dos itens, um recorte da `estampa-estrelas` com fita e o recadinho
  "seu caderno ♥" (só em telas com altura ≥ 640px), e uma `faixa-xadrez` antes do "Sair".
- **Fundo:** o `body` é papel quadriculado (linhas `--grade` a cada 28px) em todas as telas.
- Telas de duas colunas só a partir de `lg` (ex.: formulário + últimos registros, login).
- Espaçamento vertical entre blocos: `space-y-6` (seções), `gap-3` (grades de cartões), `gap-2` (chips).
- Item de menu: `rounded-lg px-3 py-2.5 text-xs font-bold uppercase tracking-[0.14em]` com ícone `size-5`;
  ativo `bg-accent-soft text-accent` com um `<Brilho>` à direita, sempre com `aria-current="page"`. Qual item está ativo é decidido por
  `itemAtivo()` ([src/lib/modulos.ts](src/lib/modulos.ts)).

## Telas de entrada

- **Módulos** são definidos uma vez em `MODULOS` ([src/lib/modulos.ts](src/lib/modulos.ts)) — rota,
  rótulo, descrição, ícone e grupo — e alimentam o menu e a vitrine do login. Módulo novo entra só ali, de
  preferência no grupo `mais`.
- As peças visuais do Início ficam em [src/components/inicio.tsx](src/components/inicio.tsx) (recebem dados
  por props); a página só busca os dados.
- **Início (`/`) = tela das pastas.** De cima para baixo, numa tela só:
  1. **Topo** (`<CabecalhoInicio>`): `card quadriculado` compacto com a data entre parênteses em `rotulo`,
     saudação em `font-display text-4xl sm:text-5xl` com o nome em itálico `accent`, uma frase de status
     (último registro) e, à direita, o `btn-primary` **"Registrar atividade"** (largura total no celular) com o
     recadinho "leva menos de um minuto!" (só a partir de `sm`). Uma `<Cereja>` no canto (a partir de `sm`) e
     uma `faixa-xadrez h-3` embaixo.
  2. **Pastas das turmas** (`<GradePastas>`): `titulo-secao` + total de turmas e a grade de `Pasta`s.
  3. **Caderno da turma aberta** (`<CadernoDaTurma>`). Sem `?turma=`, abre a pasta da atividade mais recente
     (`pastaMaisRecente()`); sem nenhuma atividade, a primeira.
  Sem turmas cadastradas, a tela mostra um estado vazio com "Cadastrar turmas".
- **Login:** `<FaixaCorrida>` no topo. Duas colunas a partir de `lg`: à esquerda `<Marca>`, "(Seu caderno
  de atividades)", chamada em `font-display text-5xl` com "funciona" em itálico, recadinho com seta e a
  vitrine dos módulos (cartões pequenos com ícone em flor, não clicáveis); à direita o formulário num
  `card` com sombra de recorte, preso por duas `fita`s sobre uma moldura `estampa-estrelas`
  (`rounded-[2rem]`), com o adesivo "oi! ♥" (flor lavanda) no canto e uma `<Estrela8>`. No celular, o
  formulário vem primeiro e a vitrine depois; o `main` usa `overflow-x-clip` para os enfeites não
  criarem rolagem lateral.
- Saudações e mensagens de boas-vindas evitam marcar gênero: "Boas-vindas", "Que bom ver você".

## Bordas, sombras e ícones

- Raios: `rounded-2xl` para cartões, `rounded-xl` para inputs e avisos, `rounded-lg` para botões e itens
  do menu, `rounded-md` para `etiqueta`, `rounded-full` para chips e badges.
- Bordas de 2px (`card`, `input`, `chip`); 3px só nos cartões de módulo.
- **Sem sombras borradas.** A única sombra é a "de recorte": deslocada e sólida, como papel colado
  (`shadow-[3px_3px_0_0_var(--sombra)]` nos botões cheios; `4px` no cartão de login e no modal;
  `var(--vinho)` no hover dos cartões de módulo; `var(--line)` em molduras decorativas).
- Ícones: em traço (`stroke="currentColor"`, `strokeWidth={2}`, pontas arredondadas, `size-5`, ou
  `size-4` em botões pequenos), sempre com `aria-hidden`. Para ícones novos, use o **Lucide**
  (`lucide-react`, ex.: `<Pencil className="size-4" aria-hidden />`). Os ícones antigos do menu e dos
  módulos ainda usam `<Icone d="…" />` ([src/components/icone.tsx](src/components/icone.tsx)), com o mesmo traço.
- Logo: flor `accent` com três barras crescentes ([src/components/logo.tsx](src/components/logo.tsx)).

## Estados

- **Carregando:** `<SkeletonBloco linhas={n} />` (barras `bg-card-2` com `animate-pulse`) como
  fallback de `Suspense`. Ações em andamento reduzem a opacidade (`opacity-40` a `opacity-60`) e
  desabilitam botões.
- **Vazio:** `card` centralizado com emoji grande opcional (`text-3xl`), frase curta e, quando fizer
  sentido, um `btn-primary` levando à ação (ex.: "Registrar atividade").
- **Erro de página:** cartão centralizado com 😕, título "Algo deu errado" e botão "Tentar de novo".
- **Erro de formulário:** `rounded-xl bg-ruim/10 px-4 py-3 text-sm font-medium text-danger`
  com `role="alert"`.
- **Sucesso:** `rounded-xl bg-success/10 … text-success` com `role="status"`.

## Acessibilidade

- Foco visível sempre: `focus-visible:ring-2 focus-visible:ring-accent/40` (já incluso em `btn` e `chip`).
- Grupos de opções em `fieldset` + `legend`; campos com `label htmlFor`.
- Emojis, ícones e enfeites decorativos com `aria-hidden`; o significado vem sempre do texto ao lado.
- Recadinhos em `font-script` são enfeite: a informação deles também aparece em texto comum na tela.
- Animações (letreiro) param com `prefers-reduced-motion`.
- Cor nunca é a única informação: receptividade tem emoji + rótulo, rankings têm porcentagem e contagem.
- `lang="pt-BR"` no `html`; datas e dias da semana formatados em pt-BR ([src/lib/dates.ts](src/lib/dates.ts)).
