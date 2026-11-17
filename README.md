# AnalisaPsi

> Registre as atividades das turmas e descubra o que funciona melhor.

O **AnalisaPsi** nasceu de um problema bem real: minha namorada está no estágio de Psicologia e
conduz atividades com várias turmas ao longo da semana. Algumas atividades rendem muito, outras
nem tanto, e depende da turma, do tipo de atividade e até do dia da semana. Anotar isso em caderno
ou planilha funcionava, mas tirar alguma conclusão daquilo dava trabalho.

Então fiz este app para ela. A ideia é simples:

1. **Depois de cada atividade**, ela registra em poucos segundos (pelo celular, inclusive)
   qual turma, o que foi feito, o tipo de atividade e como a turma recebeu.
2. **Com o tempo**, o painel mostra o que funciona melhor: quais turmas são mais receptivas,
   quais tipos de atividade têm mais adesão e quais dias da semana rendem mais.

Assim fica mais fácil planejar as próximas atividades, escrever relatórios do estágio e levar
dados concretos para a supervisão.

## O que dá para fazer

- **Registrar atividades:** turma, nome da atividade, tags (Recreativa, Arte, Música, Jogos…),
  receptividade (😊 boa / 😐 neutra / 😕 ruim), data e uma observação opcional.
  O formulário lembra a turma e a data entre um registro e outro e sugere atividades que já
  foram feitas antes, preenchendo as tags automaticamente.
- **Consultar o histórico:** todas as atividades agrupadas por dia, com filtros por turma,
  tag e receptividade. Dá para editar e apagar.
- **Ver o painel:** um resumo em texto, destaques (melhor turma, tags com mais e menos adesão,
  melhor e pior dia) e rankings com barras, filtrando por período e turma.
- **Organizar turmas e tags:** cadastrar, renomear, apagar e escolher a cor de cada tag.

Funciona bem no celular e no computador, com tema claro e escuro.

### Como a aderência é calculada

```
aderência = (boas + 0,5 × neutras) / total
```

Grupos com menos de 3 atividades aparecem marcados como "poucos dados" e ficam fora dos
destaques enquanto houver grupos com mais dados, para que uma única atividade boa não
distorça o resultado (`src/lib/stats.ts`).

## Tecnologias

- [Next.js 16](https://nextjs.org) (App Router, Server Actions, Cache Components)
- [Supabase](https://supabase.com) (autenticação + Postgres com Row Level Security)
- [Tailwind CSS 4](https://tailwindcss.com)
- TypeScript

## Como rodar

1. **Crie um projeto no [Supabase](https://supabase.com/dashboard).**

2. **Crie o banco:** no Supabase, abra **SQL Editor**, cole todo o conteúdo de
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) e clique em **Run**.

3. **Crie a usuária:** **Authentication → Users → Add user → Create new user**
   (marque *Auto Confirm User*). Ela já começa com as tags padrão
   (Recreativa, Arte, Física, Música, Leitura, Jogos, Roda de conversa).
   - Recomendado: em **Authentication → Sign In / Providers**, desligue *Allow new users to sign up*,
     já que o app não tem tela de cadastro.

4. **Configure as variáveis:** copie `.env.example` para `.env.local` e preencha com os dados de
   **Project Settings → API Keys** (URL do projeto + *publishable key*).

5. **Rode:**
   ```bash
   npm install
   npm run dev
   ```
   Abra http://localhost:3000.

## Telas

| Rota | O que faz |
|---|---|
| `/login` | Login com e-mail e senha. Qualquer rota sem sessão redireciona para cá (`src/proxy.ts`). |
| `/` | Registrar uma nova atividade. |
| `/historico` | Lista de atividades por dia, com filtros, edição e exclusão. |
| `/dashboard` | Painel com resumo, destaques e rankings. |
| `/turmas-e-tags` | Gerenciar turmas e tags. |

## Estrutura

```
src/
  proxy.ts                 # renova a sessão do Supabase e redireciona quem não está logado
  app/login/               # tela de login
  app/(app)/               # área logada (layout com navegação)
  components/              # formulário, listas, rankings, filtros…
  lib/
    supabase/server.ts     # cliente Supabase do servidor + requireUser()
    data.ts                # consultas (server-only)
    actions.ts             # Server Actions (salvar, apagar, login/logout…)
    stats.ts               # cálculo do painel
    dates.ts               # datas locais e dias da semana em pt-BR
supabase/migrations/       # schema, RLS, função salvar_atividade e tags padrão
```

## Privacidade

Cada usuária só vê os próprios dados: todas as tabelas têm Row Level Security por `user_id`.
O app foi pensado para registrar informações sobre as **atividades e as turmas**, não dados
pessoais de alunos ou pacientes (vale lembrar disso também no campo de observação).

---

Feito com carinho para ajudar no estágio. 💜
