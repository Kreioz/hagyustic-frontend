import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Vite project configuration
export default defineConfig({
  plugins: [
    react(),         // Enables React support
    tailwindcss(),   // Adds Tailwind CSS plugin
  ],
  resolve: {
    alias: {
      // Path aliases to make imports cleaner
      Pages: path.resolve(__dirname, "src/pages"),
      Components: path.resolve(__dirname, "src/components"),
      Hooks: path.resolve(__dirname, "src/hooks"),
      Redux: path.resolve(__dirname, "src/redux"),
      Assets: path.resolve(__dirname, "src/assets"),
    },
  },
  build: {
    sourcemap: false, // Don’t generate source maps in production
  },
});
