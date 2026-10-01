import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

// Vite builds the React application, TanStack Start handles routing and SSR,
// and Nitro creates the production server output for Vercel.
export default defineConfig({
  plugins: [tanstackStart(), nitro(), viteReact(), tailwindcss()],
  resolve: { tsconfigPaths: true },
  server: { port: 8080 },
});
