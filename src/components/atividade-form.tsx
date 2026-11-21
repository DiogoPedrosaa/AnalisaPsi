"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useSyncExternalStore, useTransition } from "react";
import { ORDEM_RECEPTIVIDADE, RECEPTIVIDADE } from "@/components/receptividade";
import { TagDot } from "@/components/tag-chip";
import { criarTag, criarTurma, salvarAtividade } from "@/lib/actions";
import { adicionarDias, hojeLocal, nomeDiaSemana } from "@/lib/dates";
import { avisoTamanho, MAX_OBSERVACAO } from "@/lib/observacao";
import { hrefDaPasta } from "@/lib/pastas";
import { ordenarTurmas, turmaPreSelecionada } from "@/lib/turmas";
import type { Atividade, Receptividade, Tag, Turma } from "@/lib/types";

export type Sugestao = { titulo: string; tagIds: string[] };

type Props = {
  turmas: Turma[];
  tags: Tag[];
  sugestoes?: Sugestao[];
  /** Quando presente, o formulário edita essa atividade. */
  atividade?: Atividade;
  /** Para onde ir depois de salvar a edição (padrão: Histórico). */
  voltarPara?: string;
  /** Turma já marcada ao abrir (vem de "Registrar nesta turma", `?turma=`). */
  turmaInicial?: string;
};

const semInscricao = () => () => {};

/** Data de hoje segundo o relógio do computador (vazia durante o render no servidor). */
function useHoje() {
  return useSyncExternalStore(semInscricao, () => hojeLocal(), () => "");
}

export function AtividadeForm({
  turmas: turmasIniciais,
  tags: tagsIniciais,
  sugestoes = [],
  atividade,
  voltarPara = "/historico",
  turmaInicial,
}: Props) {
  const router = useRouter();
  const editando = Boolean(atividade);
  const tituloRef = useRef<HTMLInputElement>(null);
  const hoje = useHoje();

  const [turmas, setTurmas] = useState(turmasIniciais);
  const [tags, setTags] = useState(tagsIniciais);

  const [turmaId, setTurmaId] = useState(atividade?.turma.id ?? turmaPreSelecionada(turmasIniciais, turmaInicial));
  const [titulo, setTitulo] = useState(atividade?.titulo ?? "");
  const [tagIds, setTagIds] = useState<string[]>(atividade?.tags.map((t) => t.id) ?? []);
  const [receptividade, setReceptividade] = useState<Receptividade | null>(atividade?.receptividade ?? null);
  const [dataEscolhida, setDataEscolhida] = useState<string | null>(atividade?.data ?? null);
  const [observacao, setObservacao] = useState(atividade?.observacao ?? "");

  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<{ texto: string; turmaId: string } | null>(null);
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
        router.push(voltarPara);
        return;
      }

      const turma = turmas.find((t) => t.id === turmaId)?.nome;
      setSucesso({ texto: `“${titulo.trim()}” salva para ${turma} (${nomeDiaSemana(data).toLowerCase()}).`, turmaId });
      // Mantém turma e data para registrar a próxima atividade mais rápido.
      setTitulo("");
      setTagIds([]);
      setReceptividade(null);
      setObservacao("");
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
                className={`chip py-2 text-sm ${sel ? "chip-ativo" : "chip-inativo"}`}
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
              setTurmas((ts) => ordenarTurmas([...ts, res.data]));
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
          Tags <span className="font-normal tracking-normal text-muted normal-case">(pode marcar mais de uma)</span>
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
                className={`chip py-2 text-sm ${sel ? "chip-ativo" : "chip-inativo"}`}
              >
                <TagDot cor={t.cor} className="size-2.5 ring-1 ring-line/30" />
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
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {ORDEM_RECEPTIVIDADE.map((k) => {
            const r = RECEPTIVIDADE[k];
            const sel = receptividade === k;
            return (
              <button
                key={k}
                type="button"
                aria-pressed={sel}
                onClick={() => setReceptividade(k)}
                className={`flex flex-col items-center gap-0.5 rounded-xl border-2 p-2.5 text-center transition-all focus-visible:ring-2 focus-visible:ring-rosa-forte focus-visible:outline-none sm:p-3 ${
                  sel ? `${r.soft} ring-2 ${r.anel}` : "border-line bg-card text-ink hover:bg-card-2"
                }`}
              >
                <span className="mb-0.5 text-2xl leading-none" aria-hidden>
                  {r.emoji}
                </span>
                <span className="text-xs leading-tight font-extrabold">{r.label}</span>
                <span className="text-[10px] leading-tight text-ink-2">{r.descricao}</span>
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
                className={`chip py-2 text-sm ${data === hoje ? "chip-ativo" : "chip-inativo"}`}
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setDataEscolhida(ontem)}
                className={`chip py-2 text-sm ${data === ontem ? "chip-ativo" : "chip-inativo"}`}
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

      {/* Descrição: sempre aberta, porque os relatos costumam ser longos. */}
      <div>
        <label htmlFor="obs" className="label">
          Descrição <span className="font-normal tracking-normal text-muted normal-case">(opcional)</span>
        </label>
        <textarea
          id="obs"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          className="input field-sizing-content max-h-[70vh] min-h-48 resize-y leading-relaxed"
          placeholder="Planejamento, como foi a aplicação, o que funcionou, o que mudaria da próxima vez…"
          maxLength={MAX_OBSERVACAO}
          aria-describedby={avisoTamanho(observacao.length) ? "obs-tamanho" : undefined}
        />
        {avisoTamanho(observacao.length) && (
          <p id="obs-tamanho" className="mt-1 text-right text-xs text-muted tabular-nums">
            {avisoTamanho(observacao.length)}
          </p>
        )}
      </div>

      {erro && (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {erro}
        </p>
      )}
      {sucesso && (
        <p role="status" className="rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          ✓ {sucesso.texto}{" "}
          <Link href={hrefDaPasta(sucesso.turmaId)} className="font-semibold whitespace-nowrap underline underline-offset-2">
            Ver na pasta →
          </Link>
        </p>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-line/15 pt-4">
        {editando && (
          <button type="button" onClick={() => router.back()} className="btn-claro">
            Cancelar
          </button>
        )}
        <button type="submit" disabled={salvando} className="btn-primary flex-1 px-6 py-3 sm:flex-none">
          <CheckCircle2 className="size-4" aria-hidden />
          {salvando ? "Salvando…" : editando ? "Salvar alterações" : "Salvar no fichário"}
        </button>
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
        className="chip border-dashed bg-card py-2 text-sm text-ink-2 hover:bg-rosa-claro/60 hover:text-ink"
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
