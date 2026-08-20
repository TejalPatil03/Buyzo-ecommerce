import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GenAI instance
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "BuyZo API" });
});

// AI Shopping Assistant Endpoint
app.post("/api/assistant/chat", async (req, res) => {
  try {
    const { message, catalogContext, history } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        success: false,
        fallback: true,
        reply: null,
        message: "Gemini API key not configured, using smart rule engine.",
      });
    }

    const systemPrompt = `You are BuyZo Assistant, an intelligent, helpful, and concise shopping advisor on BuyZo, a modern multi-vendor marketplace in India.
Current Available Catalog Snapshot:
${JSON.stringify(catalogContext || [], null, 2)}

Instructions:
1. Provide helpful, conversational, and direct recommendations based on the user's inquiry.
2. In your JSON response, identify which products from the catalog best match (return their IDs in recommendedProductIds array).
3. If the user asks for comparison, compare key features, pros, and value.
4. Keep the tone friendly, modern, and concise. Always format prices in INR (₹).
5. Do NOT finalize any purchase directly; always guide them to review the product or add to cart.
6. Return a valid JSON structure with keys: "reply" (string with markdown formatting), "recommendedProductIds" (array of product IDs from catalog), "suggestions" (array of 2-3 quick follow-up prompt chips).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nUser request: ${message}` }],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    try {
      const parsed = JSON.parse(text);
      return res.json({
        success: true,
        ...parsed,
      });
    } catch {
      return res.json({
        success: true,
        reply: text,
        recommendedProductIds: [],
        suggestions: ["Find budget smartphones", "Best Kurtas for weddings", "Compare with top rated"],
      });
    }
  } catch (error: any) {
    console.error("AI Assistant error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to process AI assistant query",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
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
    console.log(`BuyZo Server running on http://localhost:${PORT}`);
  });
}

startServer();
