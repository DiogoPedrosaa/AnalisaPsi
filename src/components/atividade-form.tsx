"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useSyncExternalStore, useTransition } from "react";
import { ORDEM_RECEPTIVIDADE, RECEPTIVIDADE } from "@/components/receptividade";
import { TagDot } from "@/components/tag-chip";
import { criarTag, criarTurma, salvarAtividade } from "@/lib/actions";
import { adicionarDias, hojeLocal, nomeDiaSemana } from "@/lib/dates";
import type { Atividade, Receptividade, Tag, Turma } from "@/lib/types";

export type Sugestao = { titulo: string; tagIds: string[] };

type Props = {
  turmas: Turma[];
  tags: Tag[];
  sugestoes?: Sugestao[];
  /** Quando presente, o formulário edita essa atividade. */
  atividade?: Atividade;
};

const semInscricao = () => () => {};

/** Data de hoje segundo o relógio do computador (vazia durante o render no servidor). */
function useHoje() {
  return useSyncExternalStore(semInscricao, () => hojeLocal(), () => "");
}

export function AtividadeForm({ turmas: turmasIniciais, tags: tagsIniciais, sugestoes = [], atividade }: Props) {
  const router = useRouter();
  const editando = Boolean(atividade);
  const tituloRef = useRef<HTMLInputElement>(null);
  const hoje = useHoje();

  const [turmas, setTurmas] = useState(turmasIniciais);
  const [tags, setTags] = useState(tagsIniciais);

  const [turmaId, setTurmaId] = useState(
    atividade?.turma.id ?? (turmasIniciais.length === 1 ? turmasIniciais[0].id : ""),
  );
  const [titulo, setTitulo] = useState(atividade?.titulo ?? "");
  const [tagIds, setTagIds] = useState<string[]>(atividade?.tags.map((t) => t.id) ?? []);
  const [receptividade, setReceptividade] = useState<Receptividade | null>(atividade?.receptividade ?? null);
  const [dataEscolhida, setDataEscolhida] = useState<string | null>(atividade?.data ?? null);
  const [observacao, setObservacao] = useState(atividade?.observacao ?? "");
  const [mostrarObs, setMostrarObs] = useState(Boolean(atividade?.observacao));

  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [salvando, startSalvar] = useTransition();

  const data = dataEscolhida ?? hoje;
  const ontem = hoje ? adicionarDias(hoje, -1) : "";

  function alternarTag(id: string) {
    setTagIds((atual) => (atual.includes(id) ? atual.filter((t) => t !== id) : [...atual, id]));
  }

  function aoMudarTitulo(valor: string) {
    setTitulo(valor);
    // Atividade repetida: reaproveita as tags usadas da última vez.
    if (tagIds.length === 0) {
      const igual = sugestoes.find((s) => s.titulo.toLowerCase() === valor.trim().toLowerCase());
      if (igual) setTagIds(igual.tagIds.filter((id) => tags.some((t) => t.id === id)));
    }
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!turmaId) return setErro("Escolha a turma.");
    if (!titulo.trim()) return setErro("Dê um nome para a atividade.");
    if (!receptividade) return setErro("Marque como a turma recebeu a atividade.");
    if (!data) return setErro("Escolha a data.");

    startSalvar(async () => {
      const res = await salvarAtividade({
        id: atividade?.id,
        turmaId,
        titulo,
        data,
        receptividade,
        observacao,
        tagIds,
      });
      if (!res.ok) return setErro(res.error);

      if (editando) {
        router.push("/historico");
        return;
      }

      const turma = turmas.find((t) => t.id === turmaId)?.nome;
      setSucesso(`“${titulo.trim()}” salva para ${turma} (${nomeDiaSemana(data).toLowerCase()}).`);
      // Mantém turma e data para registrar a próxima atividade mais rápido.
      setTitulo("");
      setTagIds([]);
      setReceptividade(null);
      setObservacao("");
      setMostrarObs(false);
      tituloRef.current?.focus();
    });
  }

  return (
    <form onSubmit={enviar} className="space-y-6" noValidate>
      {/* Turma */}
      <fieldset>
        <legend className="label">Turma</legend>
        <div className="flex flex-wrap gap-2">
          {turmas.map((t) => {
            const sel = t.id === turmaId;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={sel}
                onClick={() => setTurmaId(t.id)}
                className={`chip ${sel ? "border-accent bg-accent text-accent-ink" : "border-line bg-card text-ink hover:border-accent/50"}`}
              >
                {t.nome}
              </button>
            );
          })}
          <CriarInline
            rotulo={turmas.length ? "Nova turma" : "Cadastrar primeira turma"}
            placeholder="Ex.: 3º ano B"
            onCriar={async (nome) => {
              const res = await criarTurma(nome);
              if (!res.ok) return res.error;
              setTurmas((ts) => [...ts, res.data].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { numeric: true })));
              setTurmaId(res.data.id);
            }}
          />
        </div>
      </fieldset>

      {/* Atividade */}
      <div>
        <label htmlFor="titulo" className="label">
          Atividade
        </label>
        <input
          ref={tituloRef}
          id="titulo"
          value={titulo}
          onChange={(e) => aoMudarTitulo(e.target.value)}
          className="input"
          placeholder="Ex.: Pintura com guache"
          list="sugestoes-atividades"
          autoComplete="off"
          maxLength={120}
        />
        <datalist id="sugestoes-atividades">
          {sugestoes.map((s) => (
            <option key={s.titulo} value={s.titulo} />
          ))}
        </datalist>
      </div>

      {/* Tags */}
      <fieldset>
        <legend className="label">
          Tags <span className="font-normal text-muted">(pode marcar mais de uma)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => {
            const sel = tagIds.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={sel}
                onClick={() => alternarTag(t.id)}
                className={`chip ${sel ? "border-ink bg-ink text-page" : "border-line bg-card text-ink hover:border-ink/40"}`}
              >
                <TagDot cor={t.cor} />
                {t.nome}
              </button>
            );
          })}
          <CriarInline
            rotulo="Nova tag"
            placeholder="Ex.: Dança"
            onCriar={async (nome) => {
              const res = await criarTag(nome);
              if (!res.ok) return res.error;
              setTags((ts) => [...ts, res.data].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")));
              setTagIds((ids) => [...ids, res.data.id]);
            }}
          />
        </div>
      </fieldset>

      {/* Receptividade */}
      <fieldset>
        <legend className="label">Como a turma recebeu?</legend>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {ORDEM_RECEPTIVIDADE.map((k) => {
            const r = RECEPTIVIDADE[k];
            const sel = receptividade === k;
            return (
              <button
                key={k}
                type="button"
                aria-pressed={sel}
                onClick={() => setReceptividade(k)}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:py-4 ${
                  sel ? r.soft : "border-line bg-card hover:border-ink/30"
                }`}
              >
                <span className="text-3xl leading-none" aria-hidden>
                  {r.emoji}
                </span>
                <span className="text-sm font-semibold">{r.label}</span>
                <span className="hidden text-xs text-ink-2 sm:block">{r.descricao}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Data */}
      <div>
        <label htmlFor="data" className="label">
          Data
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            id="data"
            type="date"
            value={data}
            max={hoje || undefined}
            onChange={(e) => setDataEscolhida(e.target.value || null)}
            className="input w-auto"
          />
          {!editando && (
            <>
              <button
                type="button"
                onClick={() => setDataEscolhida(null)}
                className={`chip ${data === hoje ? "border-accent bg-accent-soft text-accent" : "border-line bg-card text-ink-2"}`}
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setDataEscolhida(ontem)}
                className={`chip ${data === ontem ? "border-accent bg-accent-soft text-accent" : "border-line bg-card text-ink-2"}`}
              >
                Ontem
              </button>
            </>
          )}
        </div>
        <p className="mt-1.5 text-sm text-ink-2">
          {data ? (
            <>
              Dia da semana: <strong className="text-ink">{nomeDiaSemana(data)}</strong>
            </>
          ) : (
            " "
          )}
        </p>
      </div>

      {/* Observação */}
      <div>
        {mostrarObs ? (
          <>
            <label htmlFor="obs" className="label">
              Observação <span className="font-normal text-muted">(opcional)</span>
            </label>
            <textarea
              id="obs"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="input min-h-24 resize-y"
              placeholder="O que funcionou, o que mudaria da próxima vez…"
              maxLength={1000}
              autoFocus={!editando}
            />
          </>
        ) : (
          <button type="button" onClick={() => setMostrarObs(true)} className="text-sm font-medium text-accent hover:underline">
            + Adicionar observação
          </button>
        )}
      </div>

      {erro && (
        <p role="alert" className="rounded-xl bg-ruim/10 px-4 py-3 text-sm font-medium text-danger">
          {erro}
        </p>
      )}
      {sucesso && (
        <p role="status" className="rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          ✓ {sucesso}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={salvando} className="btn-primary flex-1 py-3.5 text-base sm:flex-none sm:px-8">
          {salvando ? "Salvando…" : editando ? "Salvar alterações" : "Salvar atividade"}
        </button>
        {editando && (
          <button type="button" onClick={() => router.back()} className="btn-ghost">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

/** Chip "+ Novo" que vira um campo de texto para cadastrar sem sair da tela. */
function CriarInline({
  rotulo,
  placeholder,
  onCriar,
}: {
  rotulo: string;
  placeholder: string;
  /** Retorna uma mensagem de erro, ou nada em caso de sucesso. */
  onCriar: (nome: string) => Promise<string | void>;
}) {
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  function confirmar() {
    if (!nome.trim()) return setAberto(false);
    startTransition(async () => {
      const e = await onCriar(nome);
      if (e) return setErro(e);
      setNome("");
      setErro(null);
      setAberto(false);
    });
  }

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="chip border-dashed border-line text-ink-2 hover:border-accent hover:text-accent"
      >
        + {rotulo}
      </button>
    );
  }

  return (
    <div className="flex w-full flex-col gap-1 sm:w-auto">
      <div className="flex items-center gap-1.5">
        <input
          autoFocus
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              confirmar();
            }
            if (e.key === "Escape") setAberto(false);
          }}
          placeholder={placeholder}
          className="input py-1.5 text-sm sm:w-44"
          maxLength={60}
        />
        <button type="button" onClick={confirmar} disabled={pendente} className="btn-primary px-3 py-1.5">
          {pendente ? "…" : "Criar"}
        </button>
        <button type="button" onClick={() => setAberto(false)} className="btn-ghost px-2 py-1.5" aria-label="Cancelar">
          ✕
        </button>
      </div>
      {erro && <p className="text-xs text-danger">{erro}</p>}
    </div>
  );
}
