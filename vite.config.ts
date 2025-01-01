import { defineConfig } from "vite";
import Pages from "vite-plugin-pages";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    Pages({
      dirs: ["src/pages"],
    }),
    solidPlugin(),
  ],
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:8002",
      "/websocket": {
        target: "ws://localhost:8002",
        ws: true,
      },
    },
  },
  build: {
    target: "esnext",
  },
});
