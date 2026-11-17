# Design do AnalisaPsi

Padrões visuais e de interface do app. Todo componente novo deve seguir este documento, e todo
padrão novo deve ser registrado aqui.

## Princípios

- **Rápido de usar no celular.** O registro de uma atividade deve levar menos de um minuto, com uma
  mão só. Alvos de toque grandes, chips em vez de selects sempre que a lista for curta, e valores
  padrão inteligentes (data de hoje, turma anterior, tags sugeridas).
- **Calmo e acolhedor.** Fundo off-white quente, cantos bem arredondados, pouca sombra, um único
  roxo de destaque. Emojis aparecem com moderação, para dar leveza (receptividade, estados vazios).
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
| `page` | `#f6f4ef` | `#0f0f0e` | Fundo da página |
| `card` | `#ffffff` | `#1a1a19` | Cartões, inputs, barras de navegação |
| `card-2` | `#f1eee7` | `#242422` | Fundo secundário: hover, trilhos de barra, skeleton, chips de tag |
| `ink` | `#1f1d1a` | `#f0efec` | Texto principal |
| `ink-2` | `#57534c` | `#c3c2b7` | Texto secundário, rótulos, subtítulos |
| `muted` | `#8a857c` | `#8f8b82` | Texto de apoio, placeholders, "nenhum dado" |
| `line` | `#e6e2d9` | `#2f2f2c` | Bordas e divisórias |

### Destaque e estados

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `accent` | `#4f3fc4` | `#9085e9` | Ações principais, item ativo, foco, links |
| `accent-ink` | `#ffffff` | `#0f0f0e` | Texto sobre `accent` |
| `accent-soft` | `#ebe8fb` | `#29254a` | Fundo do item ativo da navegação, caixa de resumo |
| `danger` | `#c4302f` | `#ef7b7a` | Mensagens de erro, ação de apagar |
| `success` | `#1d7a3a` | `#5cc97c` | Mensagem de sucesso |

### Receptividade (escala divergente)

| Token | Claro | Escuro | Significado |
|---|---|---|---|
| `boa` | `#2a78d6` | `#3987e5` | 😊 Boa: turma engajou |
| `neutra` | `#b9b7ae` | `#6b6a64` | 😐 Neutra: nem bem, nem mal |
| `ruim` | `#e34948` | `#e66767` | 😕 Ruim: não rolou |

A ordem é sempre **boa → neutra → ruim** (`ORDEM_RECEPTIVIDADE`). Rótulos, emojis e classes ficam
centralizados em `RECEPTIVIDADE` ([src/components/receptividade.tsx](src/components/receptividade.tsx)):
não repita esses valores em outros lugares. Para fundos suaves, use opacidade sobre o token
(`bg-boa/12`, `bg-ruim/10`) com texto `text-ink`.

### Cores das tags

Paleta categórica de 8 cores (`--tag-1` … `--tag-8`), em ordem fixa. No banco, a tag guarda só o
índice (`cor`, de 1 a 8). Para aplicar, use `corDaTag(cor)` ou `<TagDot cor={…} />`
([src/components/tag-chip.tsx](src/components/tag-chip.tsx)); nunca guarde o hex.

## Tipografia

- Fonte: **Geist** (`font-sans`); **Geist Mono** disponível em `font-mono`.
- Título de página (`h1`): `text-2xl font-bold tracking-tight`, seguido de um subtítulo
  `mt-1 mb-5 text-sm text-ink-2` explicando a tela em uma frase.
- Título de seção (`h2`): `text-lg font-semibold`.
- Cabeçalho de grupo (ex.: data no histórico): `text-sm font-semibold text-ink-2`.
- Corpo: `text-base` em inputs (evita zoom no iOS) e `text-sm` no restante.
- Detalhes e legendas: `text-xs text-muted`.
- Números e porcentagens: `tabular-nums`, para alinhar em listas.

## Utilitários de componente

Definidos com `@utility` em [globals.css](src/app/globals.css). Use-os em vez de repetir classes:

| Classe | Uso |
|---|---|
| `card` | Contêiner padrão: `rounded-2xl`, borda `line`, fundo `card`. Padding fica a cargo de quem usa (`p-4`, `p-5`, `sm:p-6`). |
| `input` | Inputs, selects e textareas. Foco com borda e anel `accent`. |
| `label` | Rótulo acima de campo ou `legend` de fieldset. |
| `btn-primary` | Ação principal da tela (uma por contexto). |
| `btn-danger` | Confirmação de ação destrutiva (só dentro do modal de exclusão). |
| `btn-ghost` | Ações secundárias: cancelar, sair, limpar filtros. |
| `chip` | Opções selecionáveis em forma de pílula (turmas, tags, atalhos de data). |

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

## Componentes recorrentes

- **TagChip / TagDot:** pílula pequena em `card-2` com bolinha na cor da tag.
- **ReceptividadeBadge:** pílula com emoji + rótulo, borda e fundo suave na cor da receptividade.
- **Seletor de receptividade:** grade de 3 botões grandes (`rounded-2xl border-2`) com emoji
  `text-3xl`, rótulo e descrição (descrição só a partir de `sm`).
- **Ranking:** nome à esquerda, aderência em negrito à direita, barra empilhada
  boa/neutra/ruim (`h-2.5 rounded-full`, `gap-[2px]`, trilho `bg-card-2`) e linha de detalhe em
  `text-xs text-muted`. Melhor/pior ganham selo `▲ melhor` / `▼ pior`. Grupos sem dados ficam com
  `opacity-50`; grupos com menos de `MIN_AMOSTRA` atividades mostram "poucos dados".
- **Destaque (painel):** `card` com faixa vertical de 4px à esquerda (`bg-boa` para melhor,
  `bg-ruim` para pior), rótulo pequeno e valor grande (`text-xl sm:text-2xl font-bold`).
- **Caixa de resumo:** `card border-accent/30 bg-accent-soft/60`, texto `leading-relaxed`.
- **Lista de atividades:** agrupada por dia, cada grupo é um `card divide-y divide-line`, com as ações
  de editar/apagar em ícone abaixo do selo de receptividade.
- **Ações de editar e apagar** ([src/components/acoes.tsx](src/components/acoes.tsx)): sempre ícones, nunca
  texto. `<BotaoEditar>` usa a caneta (`Pencil`) do Lucide, com `href` (link) ou `onClick` (ex.: renomear
  inline); `<BotaoApagar>` usa a lixeira (`Trash2`). Ambos são botões `size-8 rounded-lg` com ícone `size-4`
  em `text-ink-2`; hover `bg-card-2` na caneta e `bg-ruim/10 text-danger` na lixeira. Como não têm texto,
  `rotulo` é obrigatório e vira `aria-label` + `title` (ex.: `Apagar “Colagem”`).
- **Modal de confirmação de exclusão:** toda exclusão passa por ele, e ele já vem dentro do `<BotaoApagar>`;
  nunca use `confirm()`. É um `<dialog>` nativo (`showModal()`, Esc fecha, clique fora fecha) com
  `card max-w-sm p-6 shadow-sm`, fundo `backdrop:bg-ink/40`, lixeira num círculo `bg-ruim/10 text-danger`,
  título "Apagar …?" e uma frase dizendo o que acontece (inclusive com as atividades ligadas).
  Botões: "Cancelar" (`btn-ghost`, com foco inicial) e "Apagar" (`btn-danger`, vira "Apagando…").
  Erro aparece dentro do modal. Os textos ficam em [src/lib/exclusao.ts](src/lib/exclusao.ts).
- **Filtros:** selects com `input py-2 text-sm` que atualizam a URL; filtro ativo ganha
  `border-accent`; botão "Limpar filtros" aparece só quando há filtro.

## Layout

- Largura máxima do conteúdo: `max-w-5xl`, com `px-4` nas laterais.
- **Menu lateral** ([src/components/nav.tsx](src/components/nav.tsx)): `aside` fixo à esquerda (`w-64`,
  `bg-card`, borda direita `line`) com logo no topo, Início + módulos no meio e "Sair" no rodapé.
  - **Desktop (a partir de `md`):** aberto por padrão; o conteúdo ganha `md:pl-64`. Pode ser escondido a
    qualquer momento pelo botão da barra do topo, pela seta no topo do menu ou com **Ctrl/⌘ + B**.
    A escolha fica salva no `localStorage` (`CHAVE_MENU`) e vira `data-menu="fechado"` no `<html>`,
    aplicado por um script inline no `<head>` antes da primeira pintura (sem "piscar").
  - Para estilizar o estado escondido, use a variante **`menu-fechado:`** (definida em `globals.css`),
    sempre junto de `md:` — ex.: `md:menu-fechado:pl-0`, `md:menu-fechado:-translate-x-full`.
  - **Celular:** o menu vira gaveta por cima do conteúdo (`z-40`), com fundo `bg-ink/30` que fecha ao
    tocar; também fecha ao escolher um item ou apertar Esc.
  - Menu escondido também fica `invisible`, para os links saírem da ordem do Tab.
- **Barra do topo** (`h-14`, `sticky`, `bg-page/90 backdrop-blur`, borda inferior): botão de mostrar/esconder
  o menu e, quando o menu não está visível, o logo.
- Telas de duas colunas só a partir de `lg` (ex.: formulário + últimos registros, login).
- Espaçamento vertical entre blocos: `space-y-6` (seções), `gap-3` (grades de cartões), `gap-2` (chips).
- Item de menu: `rounded-xl px-3 py-2.5 text-sm font-medium` com ícone `size-5`; ativo
  `bg-accent-soft text-accent`, sempre com `aria-current="page"`. Qual item está ativo é decidido por
  `itemAtivo()` ([src/lib/modulos.ts](src/lib/modulos.ts)).

## Telas de entrada

- **Módulos** são definidos uma vez em `MODULOS` ([src/lib/modulos.ts](src/lib/modulos.ts)) — rota,
  rótulo, descrição e ícone — e alimentam o menu, o Início e o login. Módulo novo entra só ali.
- **Início (`/`):** cartão de boas-vindas (`card p-6 sm:p-8`, círculo decorativo `bg-accent-soft` no canto),
  com a data em `text-sm font-medium text-accent`, saudação por horário ("Bom dia, Ana! 👋",
  `text-2xl sm:text-3xl font-bold`), uma frase de status e as ações "Registrar atividade" (`btn-primary`)
  e "Ver o painel" (`btn-ghost`). Abaixo, a grade de **cartões de módulo**.
- **Cartão de módulo:** `card group flex gap-4 p-5` clicável inteiro, `hover:border-accent/50`; ícone em
  quadrado `size-11 rounded-xl bg-accent-soft text-accent`, título `font-semibold` com seta que anda e fica
  `accent` no hover, descrição `text-sm text-ink-2` e uma linha de números `text-xs text-muted tabular-nums`
  (`detalheModulo()`), que mostra um skeleton enquanto carrega.
- **Login:** duas colunas a partir de `lg`: à esquerda logo, chamada (`text-3xl font-bold`) e a vitrine dos
  módulos em cartões pequenos (não clicáveis); à direita o cartão do formulário com "Que bom ver você! 👋".
  No celular, o formulário vem primeiro e a vitrine depois.
- Saudações e mensagens de boas-vindas evitam marcar gênero: "Boas-vindas", "Que bom ver você".

## Bordas, sombras e ícones

- Raios: `rounded-2xl` para cartões e botões grandes, `rounded-xl` para inputs, botões e avisos,
  `rounded-lg`/`rounded-md` para itens pequenos, `rounded-full` para chips e badges.
- Sombras quase não são usadas: só `shadow-sm` no cartão de login e no modal. A separação vem de bordas `line`.
- Ícones: em traço (`stroke="currentColor"`, `strokeWidth={2}`, pontas arredondadas, `size-5`, ou
  `size-4` em botões pequenos), sempre com `aria-hidden`. Para ícones novos, use o **Lucide**
  (`lucide-react`, ex.: `<Pencil className="size-4" aria-hidden />`). Os ícones antigos do menu e dos
  módulos ainda usam `<Icone d="…" />` ([src/components/icone.tsx](src/components/icone.tsx)), com o mesmo traço.
- Logo: quadrado arredondado `accent` com três barras crescentes ([src/components/logo.tsx](src/components/logo.tsx)).

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
- Emojis e ícones decorativos com `aria-hidden`; o significado vem sempre do texto ao lado.
- Cor nunca é a única informação: receptividade tem emoji + rótulo, rankings têm porcentagem e contagem.
- `lang="pt-BR"` no `html`; datas e dias da semana formatados em pt-BR ([src/lib/dates.ts](src/lib/dates.ts)).
