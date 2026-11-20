import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // As pastas das turmas agora ficam na tela de início (`/?turma=…`); estes endereços são de links antigos.
  // Os filtros (?tag=…&receptividade=…) seguem junto.
  async redirects() {
    return [
      { source: "/turmas", destination: "/", permanent: false },
      { source: "/turmas/:id", destination: "/?turma=:id", permanent: false },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
