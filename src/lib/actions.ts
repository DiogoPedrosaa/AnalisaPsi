"use server";

import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validarFicha } from "@/lib/ficha";
import { COOKIE_LEMBRAR } from "@/lib/sessao";
import { createClient, requireUser } from "@/lib/supabase/server";
import type { ActionResult, AtividadeInput, Turma } from "@/lib/types";

function erroAmigavel(error: { code?: string; message: string }, oQue: string) {
  if (error.code === "23505") return `Já existe ${oQue} com esse nome.`;
  if (error.code === "23514") return "Algum campo está vazio ou grande demais.";
  console.error(error);
  return "Não deu para salvar agora. Tente de novo em instantes.";
}

// ---------------------------------------------------------------------------
// Atividades
// ---------------------------------------------------------------------------

export async function salvarAtividade(input: AtividadeInput): Promise<ActionResult<{ id: string }>> {
  const problema = validarFicha(input);
  if (problema) return { ok: false, error: problema };

  const { supabase } = await requireUser();
  const { data, error } = await supabase.rpc("salvar_atividade", {
    p_id: input.id ?? null,
    p_turma_id: input.turmaId,
    p_titulo: input.titulo.trim(),
    p_data: input.data,
    p_categoria: input.categoria,
    p_tema: input.tema.trim(),
    p_receptividade: input.receptividade,
    p_descricao: input.descricao,
    p_observacoes: input.observacoes,
  });
  if (error) return { ok: false, error: erroAmigavel(error, "uma atividade") };

  refresh();
  return { ok: true, data: { id: data as string } };
}

export async function excluirAtividade(id: string): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("atividades").delete().eq("id", id);
  if (error) return { ok: false, error: erroAmigavel(error, "uma atividade") };
  refresh();
  return { ok: true, data: undefined };
}

// ---------------------------------------------------------------------------
// Turmas
// ---------------------------------------------------------------------------

export async function criarTurma(nome: string): Promise<ActionResult<Turma>> {
  nome = nome.trim();
  if (!nome) return { ok: false, error: "Digite o nome da turma." };

  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("turmas").insert({ nome }).select("id, nome").single();
  if (error) return { ok: false, error: erroAmigavel(error, "uma turma") };
  refresh();
  return { ok: true, data };
}

export async function renomearTurma(id: string, nome: string): Promise<ActionResult> {
  nome = nome.trim();
  if (!nome) return { ok: false, error: "O nome não pode ficar vazio." };

  const { supabase } = await requireUser();
  const { error } = await supabase.from("turmas").update({ nome }).eq("id", id);
  if (error) return { ok: false, error: erroAmigavel(error, "uma turma") };
  refresh();
  return { ok: true, data: undefined };
}

export async function excluirTurma(id: string): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("turmas").delete().eq("id", id);
  if (error) return { ok: false, error: erroAmigavel(error, "uma turma") };
  refresh();
  return { ok: true, data: undefined };
}

// ---------------------------------------------------------------------------
// Autenticação
// ---------------------------------------------------------------------------

type EstadoLogin = { error?: string; email?: string; lembrar?: boolean };

export async function entrar(_prev: EstadoLogin | undefined, formData: FormData): Promise<EstadoLogin> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const lembrar = formData.get("lembrar") === "on";
  if (!email || !password) return { error: "Preencha e-mail e senha.", email, lembrar };

  const supabase = await createClient({ lembrar });
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const msg =
      error.code === "invalid_credentials"
        ? "E-mail ou senha incorretos."
        : error.code === "email_not_confirmed"
          ? "Confirme seu e-mail antes de entrar."
          : "Não foi possível entrar agora. Tente de novo.";
    return { error: msg, email, lembrar };
  }

  // Guarda a escolha para as renovações do token. Sem lembrar, o próprio cookie também é de sessão.
  const cookieStore = await cookies();
  if (lembrar) cookieStore.delete(COOKIE_LEMBRAR);
  else
    cookieStore.set(COOKIE_LEMBRAR, "0", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  redirect("/");
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  (await cookies()).delete(COOKIE_LEMBRAR);
  redirect("/login");
}
