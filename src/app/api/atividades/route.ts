import { unstable_rethrow } from "next/navigation";
import { montarBackup } from "@/lib/backup";
import { getAtividades } from "@/lib/data";

const SEM_CACHE = { "Cache-Control": "no-store" };

/**
 * GET /api/atividades: todas as atividades da usuária logada, no formato de backup (ver lib/backup.ts).
 * Sem sessão, o proxy já redireciona para /login antes de chegar aqui.
 */
export async function GET() {
  try {
    const atividades = await getAtividades();
    return Response.json(montarBackup(atividades), { headers: SEM_CACHE });
  } catch (erro) {
    // Deixa passar os erros internos do Next (ex.: o redirect() do requireUser se a sessão cair).
    unstable_rethrow(erro);
    console.error("Falha ao exportar as atividades:", erro);
    return Response.json({ erro: "Não foi possível buscar as atividades." }, { status: 500, headers: SEM_CACHE });
  }
}
