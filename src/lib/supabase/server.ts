import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ajustarCookieSessao, COOKIE_LEMBRAR, querLembrar } from "@/lib/sessao";

/** `lembrar` força o modo de "Lembrar de mim" (usado no login); sem ele, vale o cookie de preferência. */
export async function createClient(opcoes?: { lembrar?: boolean }) {
  const cookieStore = await cookies();
  // O auth do Supabase compara a expiração do token com Date.now(); com partialPrefetching,
  // cookies() resolve durante o prefetch e esse relógio cairia dentro do prerender.
  await connection();
  const lembrar = opcoes?.lembrar ?? querLembrar(cookieStore.get(COOKIE_LEMBRAR)?.value);

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, ajustarCookieSessao(options, lembrar)),
            );
          } catch {
            // Chamado a partir de um Server Component: o proxy já renova a sessão.
          }
        },
      },
    },
  );
}

/** Cliente Supabase + id da usuária logada. Redireciona para /login se não houver sessão. */
export async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/login");
  return { supabase, userId };
}
