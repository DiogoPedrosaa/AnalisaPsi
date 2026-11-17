import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CHAVE_MENU } from "@/lib/modulos";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "AnalisaPsi", template: "%s · AnalisaPsi" },
  description: "Registre as atividades das turmas e descubra o que funciona melhor.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0e" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Esconde o menu lateral antes da primeira pintura, se a pessoa deixou ele fechado. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("${CHAVE_MENU}")==="fechado")document.documentElement.dataset.menu="fechado"}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
