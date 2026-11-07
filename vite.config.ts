import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const codespaces = loadEnv(mode, ".", "CODESPACES").CODESPACES === "true";
  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      allowedHosts: [".app.github.dev"],
      hmr: codespaces ? { protocol: "wss", clientPort: 443 } : undefined,
    },
    preview: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      allowedHosts: [".app.github.dev"],
    },
  };
});
