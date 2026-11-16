import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createRequire } from "node:module";

// Local development only: answer the cat with the same brain the CMS uses, so the conversation
// works on localhost. The key is read from .env and never reaches the browser.
const catBrain = (key) => ({
  name: "cat-brain-dev",
  configureServer(server) {
    server.middlewares.use("/api/companion/talk", (req, res) => {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", async () => {
        process.env.GEMINI_API_KEY ||= key || "";
        const { talk } = createRequire(import.meta.url)("./cms/src/api/companion/services/brain.js");
        let out;
        try { out = await talk(JSON.parse(body || "{}")); } catch { out = { ok: false }; }
        res.statusCode = out.ok ? 200 : 503;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(out.ok ? { reply: out.reply, mood: out.mood } : { error: "unavailable" }));
      });
    });
    // The free audit, with the same engine. No lead is stored locally.
    server.middlewares.use("/api/audit/run", (req, res) => {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", async () => {
        process.env.GEMINI_API_KEY ||= key || "";
        const { run } = createRequire(import.meta.url)("./cms/src/api/audit/services/audit.js");
        let out;
        try { out = await run(JSON.parse(body || "{}")); } catch { out = { ok: false, reason: "failed" }; }
        res.statusCode = out.ok ? 200 : out.reason === "bad-url" ? 400 : 422;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(out.ok ? out : { error: out.reason }));
      });
    });
  },
});

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), catBrain(loadEnv(mode, process.cwd(), "").GEMINI_API_KEY)],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["motion", "gsap", "@gsap/react", "lenis"],
          three: ["three", "@react-three/fiber"],
        },
      },
    },
  },
}));
