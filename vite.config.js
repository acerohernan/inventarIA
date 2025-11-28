import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  server: {
    allowedHosts: true,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "pages",
          dest: "",
        },
        {
          src: "images",
          dest: "",
        },
      ],
    }),
  ],
});
