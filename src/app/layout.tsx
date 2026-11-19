import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
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

/** Títulos (serifa fina e elegante, como "The Swedish Candy Cart of Your Dreams"). */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

/** Letra de mão para recadinhos e anotações ("catch me if you candy!"). */
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "AnalisaPsi", template: "%s · AnalisaPsi" },
  description: "Registre as atividades das turmas e descubra o que funciona melhor.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f59fc2" },
    { media: "(prefers-color-scheme: dark)", color: "#6e2443" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${caveat.variable} h-full antialiased`}
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
