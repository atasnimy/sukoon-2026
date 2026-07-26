import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Sukoon Community" });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        return res.status(503).json({
          error: "NO_API_KEY",
          message: "Gemini API key is not configured in server environment."
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `You are a compassionate Islamic scholar and special-needs family advocate for the "Sukoon Community" (a sanctuary for special needs Muslim families).
Provide empathetic, practical, and scholar-grounded answers that relieve parental guilt and emphasize ease (Yusr).
Always cite principles of mercy, ease (Rukhsah), and dignity for every child of Allah.
Highlight rulings from major Islamic jurisprudential bodies regarding accommodations for caregivers, sensory overload exemptions, and inclusive mosque etiquettes.
Format responses with soft, comforting paragraphs, gentle bullet points when appropriate, and end with a brief warm supplication (dua).`;

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const msg of history) {
          if (msg.text || msg.content) {
            contents.push({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text || msg.content }]
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "May Allah surround your family with barakah and peace. Please ask if you need further clarity.";

      return res.json({ reply: replyText });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      return res.status(500).json({
        error: "GEMINI_ERROR",
        message: err.message || "An error occurred while generating a response."
      });
    }
  });

  // Vite middleware for development
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
    console.log(`Sukoon Community server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
