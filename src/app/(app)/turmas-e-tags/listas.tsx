"use client";

import { useState, useTransition } from "react";
import { BotaoApagar, BotaoEditar } from "@/components/acoes";
import { corDaTag, TagDot } from "@/components/tag-chip";
import {
  atualizarTag,
  criarTag,
  criarTurma,
  excluirTag,
  excluirTurma,
  renomearTurma,
} from "@/lib/actions";
import { avisoExcluirTag, avisoExcluirTurma, type AvisoExclusao } from "@/lib/exclusao";
import type { ActionResult } from "@/lib/types";

type TurmaItem = { id: string; nome: string; total: number };
type TagItem = { id: string; nome: string; cor: number; total: number };

function plural(n: number) {
  return `${n} ${n === 1 ? "atividade" : "atividades"}`;
}

export function ListaTurmas({ turmas }: { turmas: TurmaItem[] }) {
  return (
    <section className="painel p-5 sm:p-6">
      <h2 className="titulo-secao">Turmas</h2>
      <p className="mb-4 text-sm text-ink-2">{turmas.length ? `${turmas.length} cadastradas` : "Nenhuma ainda"}</p>
      <NovoItem placeholder="Nome da turma (ex.: 3º ano B)" criar={criarTurma} />
      <ul className="mt-4 divide-y divide-line/15">
        {turmas.map((t) => (
          <Item
            key={t.id}
            nome={t.nome}
            total={t.total}
            renomear={(nome) => renomearTurma(t.id, nome)}
            excluir={() => excluirTurma(t.id)}
            avisoExcluir={avisoExcluirTurma(t.nome, t.total)}
          />
        ))}
      </ul>
    </section>
  );
}

export function ListaTags({ tags }: { tags: TagItem[] }) {
  return (
    <section className="painel p-5 sm:p-6">
      <h2 className="titulo-secao">Tags</h2>
      <p className="mb-4 text-sm text-ink-2">Tipos de atividade. Clique na bolinha para trocar a cor.</p>
      <NovoItem placeholder="Nome da tag (ex.: Dança)" criar={criarTag} />
      <ul className="mt-4 divide-y divide-line/15">
        {tags.map((t) => (
          <Item
            key={t.id}
            nome={t.nome}
            total={t.total}
            cor={t.cor}
            trocarCor={(cor) => atualizarTag(t.id, { cor })}
            renomear={(nome) => atualizarTag(t.id, { nome })}
            excluir={() => excluirTag(t.id)}
            avisoExcluir={avisoExcluirTag(t.nome, t.total)}
          />
        ))}
      </ul>
    </section>
  );
}

function NovoItem({ placeholder, criar }: { placeholder: string; criar: (nome: string) => Promise<ActionResult<unknown>> }) {
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    startTransition(async () => {
      const res = await criar(nome);
      if (!res.ok) return setErro(res.error);
      setNome("");
      setErro(null);
    });
  }

  return (
    <form onSubmit={enviar}>
      <div className="flex gap-2">
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder={placeholder} className="input py-2" maxLength={60} />
        <button type="submit" disabled={pendente || !nome.trim()} className="btn-primary shrink-0 py-2">
          {pendente ? "…" : "Adicionar"}
        </button>
      </div>
      {erro && <p className="mt-1.5 text-sm text-danger">{erro}</p>}
    </form>
  );
}

function Item({
  nome,
  total,
  cor,
  renomear,
  excluir,
  trocarCor,
  avisoExcluir,
}: {
  nome: string;
  total: number;
  cor?: number;
  renomear: (nome: string) => Promise<ActionResult>;
  excluir: () => Promise<ActionResult>;
  trocarCor?: (cor: number) => Promise<ActionResult>;
  avisoExcluir: AvisoExclusao;
}) {
  const [editando, setEditando] = useState(false);
  const [escolhendoCor, setEscolhendoCor] = useState(false);
  const [rascunho, setRascunho] = useState(nome);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  function rodar(acao: () => Promise<ActionResult>, depois?: () => void) {
    startTransition(async () => {
      const res = await acao();
      if (!res.ok) return setErro(res.error);
      setErro(null);
      depois?.();
    });
  }

  function salvarNome() {
    if (rascunho.trim() === nome) return setEditando(false);
    rodar(() => renomear(rascunho), () => setEditando(false));
  }

  return (
    <li className={`py-3 ${pendente ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-3">
        {trocarCor && (
          <button
            type="button"
            onClick={() => setEscolhendoCor((v) => !v)}
            className="grid size-7 shrink-0 place-items-center rounded-full hover:bg-card-2"
            aria-label="Trocar cor"
          >
            <TagDot cor={cor} className="size-3.5" />
          </button>
        )}

        {editando ? (
          <form
            className="flex flex-1 gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              salvarNome();
            }}
          >
            <input
              autoFocus
              value={rascunho}
              onChange={(e) => setRascunho(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setRascunho(nome);
                  setEditando(false);
                }
              }}
              className="input py-1.5"
              maxLength={60}
            />
            <button type="submit" className="btn-primary py-1.5">
              Salvar
            </button>
          </form>
        ) : (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{nome}</p>
              <p className="text-xs text-muted">{plural(total)}</p>
            </div>
            <div className="flex shrink-0 gap-0.5">
              <BotaoEditar
                rotulo={`Renomear “${nome}”`}
                onClick={() => {
                  setRascunho(nome);
                  setEditando(true);
                }}
              />
              <BotaoApagar rotulo={`Apagar “${nome}”`} aviso={avisoExcluir} apagar={excluir} />
            </div>
          </>
        )}
      </div>

      {escolhendoCor && trocarCor && (
        <div className="mt-2 ml-10 flex flex-wrap gap-2">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => rodar(() => trocarCor(c), () => setEscolhendoCor(false))}
              aria-label={`Cor ${c}`}
              aria-pressed={c === cor}
              className={`size-7 rounded-full ring-offset-2 ring-offset-card transition hover:scale-110 ${c === cor ? "ring-2 ring-ink" : ""}`}
              style={{ background: corDaTag(c) }}
            />
          ))}
        </div>
      )}

      {erro && <p className="mt-1.5 text-sm text-danger">{erro}</p>}
    </li>
  );
}
