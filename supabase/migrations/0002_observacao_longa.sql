-- AnalisaPsi — descrição (observacao) longa
-- O limite de 1.000 caracteres era pouco para relatos completos (planejamento + como foi a aplicação).
-- Rode este arquivo no SQL Editor do Supabase (ou via `supabase db push`).
-- O novo limite precisa bater com MAX_OBSERVACAO em src/lib/observacao.ts.

alter table public.atividades drop constraint if exists atividades_observacao_check;

alter table public.atividades
  add constraint atividades_observacao_check
  check (observacao is null or char_length(observacao) <= 20000);
