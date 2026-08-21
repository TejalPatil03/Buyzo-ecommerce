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
    const vite = await createViteServer({
      // Vite config now lives in frontend/ — point to it explicitly
      configFile: path.resolve(process.cwd(), "frontend/vite.config.ts"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`BuyZo Production-Ready API Server running on http://localhost:${PORT}`);
    logger.info(`API v1 Base Endpoint: http://localhost:${PORT}/api/v1`);
    logger.info(`Health Endpoint: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  logger.error("Failed to start server:", err);
  process.exit(1);
});
