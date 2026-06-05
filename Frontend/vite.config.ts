import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  envPrefix: ["VITE_", "OPENAI_"],
  resolve: {
    tsconfigPaths: true,
  },
});
