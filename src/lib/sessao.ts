/**
 * "Lembrar de mim" no login.
 * - Lembrar: os cookies da sessão do Supabase valem 400 dias (padrão da lib).
 * - Não lembrar: viram cookies de sessão do navegador (sem maxAge/expires) e somem ao fechá-lo.
 * A escolha fica no cookie COOKIE_LEMBRAR, para que as renovações do token (proxy e servidor) mantenham o mesmo modo.
 */
export const COOKIE_LEMBRAR = "analisapsi-lembrar";

/** Só o valor "0" desliga; sem cookie, a sessão é lembrada (comportamento padrão). */
export function querLembrar(valor: string | undefined) {
  return valor !== "0";
}

type OpcoesCookie = { maxAge?: number; expires?: Date };

/** Cookie sendo apagado (maxAge ≤ 0 ou expires no passado): nunca mexa, senão o "Sair" para de funcionar. */
function estaApagando(opcoes: OpcoesCookie, agora: number) {
  if (opcoes.maxAge !== undefined && opcoes.maxAge <= 0) return true;
  return opcoes.expires !== undefined && opcoes.expires.getTime() <= agora;
}

/** Ajusta as opções de um cookie de sessão do Supabase conforme a preferência de lembrar. */
export function ajustarCookieSessao<T extends OpcoesCookie>(opcoes: T, lembrar: boolean, agora = Date.now()): T {
  if (lembrar || estaApagando(opcoes, agora)) return opcoes;
  const resto = { ...opcoes };
  delete resto.maxAge;
  delete resto.expires;
  return resto;
}

// ---------------------------------------------------------------------------
// Lado do navegador: lembra o e-mail e a última escolha para preencher o formulário.
// ---------------------------------------------------------------------------

export const CHAVE_LOGIN = "analisapsi:login";

export type PreferenciaLogin = { lembrar: boolean; email: string };

/** Lê o que foi salvo no localStorage; qualquer coisa inválida cai no padrão (lembrar, sem e-mail). */
export function lerPreferenciaLogin(salvo: string | null): PreferenciaLogin {
  try {
    const dados: unknown = JSON.parse(salvo ?? "");
    if (dados && typeof dados === "object") {
      const { lembrar, email } = dados as Record<string, unknown>;
      return {
        lembrar: lembrar !== false,
        email: lembrar !== false && typeof email === "string" ? email : "",
      };
    }
  } catch {}
  return { lembrar: true, email: "" };
}

/** O que salvar no localStorage. Sem "lembrar", o e-mail não é guardado. */
export function salvarPreferenciaLogin(lembrar: boolean, email: string) {
  return JSON.stringify(lembrar ? { lembrar, email: email.trim() } : { lembrar });
}
