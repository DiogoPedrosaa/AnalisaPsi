-- AnalisaPsi — 4 reações dos alunos: Adoraram, Gostaram, Neutro, Não curtiram
-- Antes eram 3 (boa, neutra, ruim). As atividades já salvas são convertidas assim:
--   boa → gostaram · neutra → neutro · ruim → nao_curtiram
-- ("adoraram" fica para o que for marcado daqui para a frente.)
-- Rode este arquivo no SQL Editor do Supabase (ou via `supabase db push`) ANTES de publicar o código novo:
-- o app novo só aceita os valores novos. Os valores precisam bater com RECEPTIVIDADES em src/lib/receptividade.ts.

begin;

alter table public.atividades drop constraint if exists atividades_receptividade_check;

update public.atividades
   set receptividade = case receptividade
                         when 'boa' then 'gostaram'
                         when 'neutra' then 'neutro'
                         when 'ruim' then 'nao_curtiram'
                       end
 where receptividade in ('boa', 'neutra', 'ruim');

alter table public.atividades
  add constraint atividades_receptividade_check
  check (receptividade in ('adoraram', 'gostaram', 'neutro', 'nao_curtiram'));

commit;
