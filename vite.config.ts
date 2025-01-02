import { defineConfig } from "vite";
import Pages from "vite-plugin-pages";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

// Pattern for CSS files
const cssPattern = /\.css$/;
// Pattern for image files
const imagePattern = /\.(png|jpe?g|gif|svg|webp|avif)$/;

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    Pages({
      dirs: ["src/pages"],
    }),
    solidPlugin(),
  ],
  appType: "custom",
  publicDir: "public",
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
    manifest: true,
    emptyOutDir: true,
    outDir: "../wwwroot",
    assetsDir: "",
    rollupOptions: {
      input: "src/index.tsx",
      output: {
        // Save entry files to the appropriate folder
        entryFileNames: "js/[name].[hash].js",
        // Save chunk files to the js folder
        chunkFileNames: "js/[name]-chunk.js",
        // Save asset files to the appropriate folder
        assetFileNames: (info) => {
          for (const name of info.names) {
            // If the file is a CSS file, save it to the css folder
            if (cssPattern.test(name)) {
              return "css/[name][extname]";
            }
            // If the file is an image file, save it to the images folder
            if (imagePattern.test(name)) {
              return "images/[name][extname]";
            }
            // If the file is any other type of file, save it to the assets folder
            return "assets/[name][extname]";
          }
          // If the file name is not specified, save it to the output directory
          return "[name][extname]";
        },
      },
    },
    target: "esnext",
  },
});
