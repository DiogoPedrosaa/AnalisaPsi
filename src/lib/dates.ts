export const DIAS_SEMANA = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const;

export const DIAS_SEMANA_CURTO = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Data local (do computador) no formato yyyy-mm-dd. */
export function hojeLocal(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Converte yyyy-mm-dd em Date local, sem o deslocamento de fuso que `new Date(str)` causa. */
export function parseData(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** 0 = domingo … 6 = sábado */
export function diaDaSemana(iso: string) {
  return parseData(iso).getDay();
}

export function nomeDiaSemana(iso: string) {
  return DIAS_SEMANA[diaDaSemana(iso)];
}

/** "segunda-feira, 17 de novembro" */
export function formatarDataLonga(iso: string, comAno = false) {
  return parseData(iso).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(comAno ? { year: "numeric" } : {}),
  });
}

/** "18/11/2026" ou, com `comDia`, "Qua, 18/11/2026" (data dos cartões de atividade). */
export function formatarDataCurta(iso: string, comDia = false) {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  const data = `${d}/${m}/${y}`;
  return comDia ? `${DIAS_SEMANA_CURTO[diaDaSemana(iso)]}, ${data}` : data;
}

export function adicionarDias(iso: string, dias: number) {
  const d = parseData(iso);
  d.setDate(d.getDate() + dias);
  return hojeLocal(d);
}

/** Fuso usado no servidor para saudações e "hoje" (o servidor costuma rodar em UTC). */
export const FUSO_PADRAO = "America/Sao_Paulo";

/** Hora (0–23) de `agora` no fuso indicado. */
export function horaNoFuso(agora: Date, fuso = FUSO_PADRAO) {
  const hora = new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: fuso }).format(agora);
  return Number(hora);
}

/** Data (yyyy-mm-dd) de `agora` no fuso indicado. */
export function hojeNoFuso(agora: Date, fuso = FUSO_PADRAO) {
  return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: fuso }).format(agora);
}

/** "Bom dia" (5h–11h), "Boa tarde" (12h–17h) ou "Boa noite". */
export function saudacao(hora: number) {
  if (hora >= 5 && hora < 12) return "Bom dia";
  if (hora >= 12 && hora < 18) return "Boa tarde";
  return "Boa noite";
}

/** "hoje", "ontem", "há 3 dias" (até uma semana) ou "em 2 de novembro". */
export function quandoFoi(iso: string, hoje: string) {
  const dias = Math.round((parseData(hoje).getTime() - parseData(iso).getTime()) / 86_400_000);
  if (dias <= 0) return "hoje";
  if (dias === 1) return "ontem";
  if (dias < 7) return `há ${dias} dias`;
  return `em ${parseData(iso).toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}`;
}
