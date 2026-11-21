/** Reação dos alunos à atividade (ver lib/receptividade.ts). */
export type Receptividade = "adoraram" | "gostaram" | "neutro" | "nao_curtiram";

export type Turma = { id: string; nome: string };

export type Tag = { id: string; nome: string; cor: number };

export type Atividade = {
  id: string;
  titulo: string;
  /** yyyy-mm-dd */
  data: string;
  receptividade: Receptividade;
  observacao: string | null;
  turma: Turma;
  tags: Tag[];
};

export type AtividadeInput = {
  id?: string;
  turmaId: string;
  titulo: string;
  data: string;
  receptividade: Receptividade;
  observacao: string;
  tagIds: string[];
};

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };
