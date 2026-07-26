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

      const systemInstruction = `You are a compassionate Islamic scholar and special-needs family advocate for "Sukoon" (a sanctuary for special needs Muslim families).
MANDATORY CITATION REQUIREMENT:
- EVERY piece of Islamic advice, ruling, accommodation, or spiritual guidance you provide MUST come from an authentic source.
- You MUST include explicit citations for any Islamic evidence used (e.g., Quran Surah name & Ayah/Verse number such as [Surah Al-Baqarah 2:185], authentic Hadith collection with book/hadith number such as [Sahih al-Bukhari #5996] or [Sahih Muslim #470], or official rulings from recognized Fiqh bodies like the Assembly of Muslim Jurists of America (AMJA), Fiqh Council of North America (FCNA), or International Islamic Fiqh Academy).
- Never give unverified cultural opinions or personal rulings without citing Quranic verses, Sahih Hadith, or recognized scholarly consensus (Ijma).
- Always emphasize divine mercy (Rahmah), scholarly ease (Rukhsah), and dignity for special needs children and caregivers.
- Format responses clearly with comforting paragraphs, bold citations, gentle bullet points, and end with a brief warm supplication (dua).`;

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
