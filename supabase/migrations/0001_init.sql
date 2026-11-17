-- AnalisaPsi — schema inicial
-- Rode este arquivo inteiro no SQL Editor do Supabase (ou via `supabase db push`).

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

create table public.turmas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome text not null check (char_length(btrim(nome)) between 1 and 60),
  created_at timestamptz not null default now(),
  unique (user_id, nome)
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome text not null check (char_length(btrim(nome)) between 1 and 40),
  -- índice de 1 a 8 na paleta de cores do app
  cor smallint not null default 1 check (cor between 1 and 8),
  created_at timestamptz not null default now(),
  unique (user_id, nome)
);

create table public.atividades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  turma_id uuid not null references public.turmas (id) on delete cascade,
  titulo text not null check (char_length(btrim(titulo)) between 1 and 120),
  data date not null default current_date,
  receptividade text not null check (receptividade in ('boa', 'neutra', 'ruim')),
  observacao text check (observacao is null or char_length(observacao) <= 1000),
  created_at timestamptz not null default now()
);

create index atividades_user_data_idx on public.atividades (user_id, data desc, created_at desc);
create index atividades_turma_idx on public.atividades (turma_id);

create table public.atividade_tags (
  atividade_id uuid not null references public.atividades (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  primary key (atividade_id, tag_id)
);

create index atividade_tags_tag_idx on public.atividade_tags (tag_id);

-- ---------------------------------------------------------------------------
-- Row Level Security: cada usuária só enxerga e altera os próprios dados
-- ---------------------------------------------------------------------------

alter table public.turmas enable row level security;
alter table public.tags enable row level security;
alter table public.atividades enable row level security;
alter table public.atividade_tags enable row level security;

create policy "turmas: dona" on public.turmas
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "tags: dona" on public.tags
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "atividades: dona" on public.atividades
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.turmas t
      where t.id = turma_id and t.user_id = (select auth.uid())
    )
  );

create policy "atividade_tags: dona" on public.atividade_tags
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.atividades a
      where a.id = atividade_id and a.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.tags g
      where g.id = tag_id and g.user_id = (select auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- Salvar atividade + tags de forma atômica (cria ou atualiza)
-- ---------------------------------------------------------------------------

create or replace function public.salvar_atividade(
  p_id uuid,
  p_turma_id uuid,
  p_titulo text,
  p_data date,
  p_receptividade text,
  p_observacao text,
  p_tag_ids uuid[]
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if p_id is null then
    insert into public.atividades (turma_id, titulo, data, receptividade, observacao)
    values (p_turma_id, btrim(p_titulo), p_data, p_receptividade, nullif(btrim(p_observacao), ''))
    returning id into v_id;
  else
    update public.atividades
       set turma_id = p_turma_id,
           titulo = btrim(p_titulo),
           data = p_data,
           receptividade = p_receptividade,
           observacao = nullif(btrim(p_observacao), '')
     where id = p_id
    returning id into v_id;

    if v_id is null then
      raise exception 'Atividade não encontrada';
    end if;

    delete from public.atividade_tags where atividade_id = v_id;
  end if;

  insert into public.atividade_tags (atividade_id, tag_id)
  select distinct v_id, t from unnest(coalesce(p_tag_ids, '{}'::uuid[])) as t;

  return v_id;
end;
$$;

revoke execute on function public.salvar_atividade from public, anon;
grant execute on function public.salvar_atividade to authenticated;

-- ---------------------------------------------------------------------------
-- Tags padrão para toda conta nova (e para as contas que já existem)
-- ---------------------------------------------------------------------------

create or replace function public.criar_tags_padrao()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.tags (user_id, nome, cor) values
    (new.id, 'Recreativa', 1),
    (new.id, 'Arte', 2),
    (new.id, 'Física', 3),
    (new.id, 'Música', 4),
    (new.id, 'Leitura', 5),
    (new.id, 'Jogos', 6),
    (new.id, 'Roda de conversa', 7)
  on conflict (user_id, nome) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created_tags
  after insert on auth.users
  for each row execute function public.criar_tags_padrao();

insert into public.tags (user_id, nome, cor)
select u.id, d.nome, d.cor
from auth.users u
cross join (values
  ('Recreativa', 1), ('Arte', 2), ('Física', 3), ('Música', 4),
  ('Leitura', 5), ('Jogos', 6), ('Roda de conversa', 7)
) as d (nome, cor)
on conflict (user_id, nome) do nothing;
