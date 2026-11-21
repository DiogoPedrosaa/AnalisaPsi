-- AnalisaPsi — Ficha de registro de campo (igual ao Diário de Estágio)
-- A atividade passa a ter: Categoria da Prática, Tema / Objetivo Socioemocional,
-- Descrição Breve & Materiais (a antiga "descrição") e Observações da Estagiária.
-- A categoria substitui as tags no app.
--
-- Rode este arquivo no SQL Editor do Supabase (ou via `supabase db push`) DEPOIS da 0003 e ANTES de
-- publicar o código novo. As categorias precisam bater com CATEGORIAS em src/lib/categoria.ts.
--
-- As tabelas `tags` e `atividade_tags` NÃO são apagadas: os dados ficam guardados, só deixam de ser usados.
-- Para apagar de vez, depois de conferir: drop table public.atividade_tags; drop table public.tags;

begin;

-- ---------------------------------------------------------------------------
-- Colunas novas
-- ---------------------------------------------------------------------------

alter table public.atividades rename column observacao to descricao;
alter table public.atividades drop constraint if exists atividades_observacao_check;
alter table public.atividades
  add constraint atividades_descricao_check check (descricao is null or char_length(descricao) <= 20000);

alter table public.atividades
  add column categoria text not null default 'outro'
    constraint atividades_categoria_check
    check (categoria in ('roda_conversa', 'manual_artistica', 'dinamica_jogo', 'oficina_debate', 'outro')),
  add column tema text not null default ''
    constraint atividades_tema_check check (char_length(tema) <= 200),
  add column observacoes text
    constraint atividades_observacoes_check check (observacoes is null or char_length(observacoes) <= 20000);

-- ---------------------------------------------------------------------------
-- Categoria das atividades que já existem, pelo nome das tags delas
-- (quando a atividade tem tags de categorias diferentes, vale a primeira da lista abaixo)
-- ---------------------------------------------------------------------------

with palpites as (
  select at.atividade_id,
         case
           when g.nome ~* '\mroda' then 1
           when g.nome ~* '\m(arte|artes|art[ií]stica|manual|m[uú]sica|colagem|desenho|pintura)\M' then 2
           when g.nome ~* '\m(jogo|jogos|din[aâ]mica|din[aâ]micas|recreativa|f[ií]sica|brincadeira)' then 3
           when g.nome ~* '\m(oficina|debate|leitura)' then 4
         end as prioridade
    from public.atividade_tags at
    join public.tags g on g.id = at.tag_id
),
escolha as (
  select atividade_id, min(prioridade) as prioridade
    from palpites
   where prioridade is not null
   group by atividade_id
)
update public.atividades a
   set categoria = case e.prioridade
                     when 1 then 'roda_conversa'
                     when 2 then 'manual_artistica'
                     when 3 then 'dinamica_jogo'
                     when 4 then 'oficina_debate'
                   end
  from escolha e
 where e.atividade_id = a.id;

create index atividades_user_categoria_idx on public.atividades (user_id, categoria);

-- ---------------------------------------------------------------------------
-- Salvar atividade (cria ou atualiza), agora sem tags
-- ---------------------------------------------------------------------------

drop function if exists public.salvar_atividade(uuid, uuid, text, date, text, text, uuid[]);

create or replace function public.salvar_atividade(
  p_id uuid,
  p_turma_id uuid,
  p_titulo text,
  p_data date,
  p_categoria text,
  p_tema text,
  p_receptividade text,
  p_descricao text,
  p_observacoes text
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if p_id is null then
    insert into public.atividades (turma_id, titulo, data, categoria, tema, receptividade, descricao, observacoes)
    values (
      p_turma_id, btrim(p_titulo), p_data, p_categoria, btrim(coalesce(p_tema, '')), p_receptividade,
      nullif(btrim(p_descricao), ''), nullif(btrim(p_observacoes), '')
    )
    returning id into v_id;
  else
    update public.atividades
       set turma_id = p_turma_id,
           titulo = btrim(p_titulo),
           data = p_data,
           categoria = p_categoria,
           tema = btrim(coalesce(p_tema, '')),
           receptividade = p_receptividade,
           descricao = nullif(btrim(p_descricao), ''),
           observacoes = nullif(btrim(p_observacoes), '')
     where id = p_id
    returning id into v_id;

    if v_id is null then
      raise exception 'Atividade não encontrada';
    end if;
  end if;

  return v_id;
end;
$$;

revoke execute on function public.salvar_atividade from public, anon;
grant execute on function public.salvar_atividade to authenticated;

-- Contas novas não ganham mais tags padrão.
drop trigger if exists on_auth_user_created_tags on auth.users;
drop function if exists public.criar_tags_padrao();

commit;
