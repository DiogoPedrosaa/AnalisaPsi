import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/** Corpo, formulários e listas (sans limpa). */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

/** Títulos (serifa editorial, usada em 500–800 e itálico). */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

/** Letra de mão para recadinhos e anotações. */
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
    { media: "(prefers-color-scheme: light)", color: "#c82333" },
    { media: "(prefers-color-scheme: dark)", color: "#ea4a5a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${fraunces.variable} ${caveat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
