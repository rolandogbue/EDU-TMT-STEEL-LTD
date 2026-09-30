import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({ server: { entry: "server" } }),
    nitro({ preset: process.env.VERCEL ? "vercel" : "cloudflare-module" }),
    viteReact(),
  ],
  resolve: { tsconfigPaths: true },
  server: { port: 8080, strictPort: true },
});
