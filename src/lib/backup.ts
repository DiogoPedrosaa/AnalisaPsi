import type { Atividade } from "@/lib/types";

/* Backup em JSON de todas as atividades (botão "Backup JSON" do cabeçalho, rota GET /api/atividades). */

/** Versão do formato do arquivo; aumente se a estrutura mudar. */
export const VERSAO_BACKUP = 1;

export type Backup = {
  app: "AnalisaPsi";
  versao: typeof VERSAO_BACKUP;
  /** Data e hora da exportação, em ISO 8601 (UTC). */
  exportadoEm: string;
  total: number;
  atividades: Atividade[];
};

/** Monta o conteúdo do backup, com as atividades na ordem recebida (a mais recente primeiro). */
export function montarBackup(atividades: Atividade[], agora = new Date()): Backup {
  return {
    app: "AnalisaPsi",
    versao: VERSAO_BACKUP,
    exportadoEm: agora.toISOString(),
    total: atividades.length,
    atividades: atividades.map((a) => ({
      id: a.id,
      titulo: a.titulo,
      data: a.data,
      receptividade: a.receptividade,
      observacao: a.observacao,
      turma: { id: a.turma.id, nome: a.turma.nome },
      tags: a.tags.map((t) => ({ id: t.id, nome: t.nome, cor: t.cor })),
    })),
  };
}

/** Nome do arquivo baixado: "backup-analisapsi-2026-11-21.json" (`hoje` em yyyy-mm-dd). */
export function nomeDoBackup(hoje: string) {
  return `backup-analisapsi-${hoje}.json`;
}

/** Diz se a resposta do GET é mesmo o backup (e não, por exemplo, a página de login depois de um redirecionamento). */
export function ehBackup(dados: unknown): dados is Backup {
  if (typeof dados !== "object" || dados === null) return false;
  const b = dados as Partial<Backup>;
  return b.app === "AnalisaPsi" && Array.isArray(b.atividades) && typeof b.total === "number";
}
