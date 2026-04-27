import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Puppeteer in Docker reaches the dev server via host.docker.internal; Vite blocks
    // unknown Host headers by default, so screenshots would capture the error page (and that
    // ends up in PNGs/PDF and on LinkedIn).
    allowedHosts: ["localhost", "127.0.0.1", "host.docker.internal"],
  },
});
