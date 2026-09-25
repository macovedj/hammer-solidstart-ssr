import { solidStart } from "@solidjs/start/config";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solidStart({ solid: { hot: false } }), nitro()],
  nitro: {
    preset: "node_server",
    prerender: {
      routes: ["/static"],
    },
  },
});
