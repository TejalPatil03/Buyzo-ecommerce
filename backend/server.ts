import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createApp } from "./server/app";
import { ENV } from "./server/config/env";
import { logger } from "./server/config/logger";

async function startServer() {
  const app = await createApp();
  const PORT = ENV.PORT;

  if (process.env.NODE_ENV !== "production") {
    // Development: Vite dev server with HMR
    const vite = await createViteServer({
      configFile: path.resolve(process.cwd(), "frontend/vite.config.ts"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve the pre-built dist/ folder
    // server.cjs lives inside dist/ after build, so static files are in the same dir
    const distPath = path.resolve(__dirname);

    logger.info(`Serving static files from: ${distPath}`);

    // Serve static assets (JS, CSS, images)
    app.use(express.static(distPath, { index: false }));

    // All non-API routes serve index.html for React Router (SPA fallback)
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`BuyZo Server running on http://localhost:${PORT}`);
    logger.info(`API: http://localhost:${PORT}/api/v1`);
    logger.info(`Health: http://localhost:${PORT}/api/health`);
    logger.info(`ENV: ${ENV.NODE_ENV}`);
  });
}

startServer().catch((err) => {
  logger.error("Failed to start server:", err);
  process.exit(1);
});
