import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK with User-Agent header for telemetry
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "CraftDocs Server" });
});

// Gemini AI Assistant & Spellcheck Route
app.post("/api/gemini/assist", async (req, res) => {
  try {
    const { action, text, prompt, context } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response if API key is not yet set in environment
      return res.status(200).json({
        success: true,
        result: generateLocalFallback(action, text, prompt),
        fallback: true,
        message: "Generated via local enchantment heuristics (add GEMINI_API_KEY in Settings for full Gemini AI power)",
      });
    }

    let systemInstruction = "You are the Enchantment Table AI and master scribe for CraftDocs, a document editor. You assist users with editing, spellchecking, rephrasing, formatting, and creative writing. Return clear, directly usable text without unnecessary markdown wrappers unless requested.";
    let userPrompt = "";

    if (action === "spellcheck") {
      systemInstruction = "You are a precise proofreader and grammar wizard. Review the provided text, identify spelling errors, grammatical mistakes, punctuation issues, and awkward phrasing. Return a JSON object with: { \"correctedText\": string, \"issues\": [{\"original\": string, \"replacement\": string, \"reason\": string}] }";
      userPrompt = `Please proofread and fix all spelling/grammar errors in the following text:\n\n${text}`;
    } else if (action === "polish") {
      userPrompt = `Improve and polish the following text to sound clear, engaging, professional, and well-structured while keeping its original meaning:\n\n${text}`;
    } else if (action === "minecraft_lore") {
      userPrompt = `Rewrite the following text in an epic, mysterious, and captivating Minecraft lore / ancient scribe style:\n\n${text}`;
    } else if (action === "summarize") {
      userPrompt = `Provide a clean, concise bullet-point summary of the following document:\n\n${text}`;
    } else if (action === "expand") {
      userPrompt = `Expand upon the following thoughts with rich details, helpful context, and well-organized paragraphs:\n\n${text}`;
    } else if (action === "continue") {
      userPrompt = `Continue writing smoothly from where this text left off:\n\n${text}\n\nContext/Topic: ${context || "Document content"}`;
    } else if (action === "translate") {
      userPrompt = `Translate the following text into ${prompt || "Spanish"}:\n\n${text}`;
    } else {
      userPrompt = `${prompt || "Improve the following text"}:\n\n${text}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: action === "spellcheck" ? 0.2 : 0.7,
      },
    });

    const resultText = response.text || "";
    return res.json({
      success: true,
      result: resultText,
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Return friendly error + local fallback so the user experience is never blocked
    const fallbackText = generateLocalFallback(req.body.action, req.body.text, req.body.prompt);
    return res.status(200).json({
      success: true,
      result: fallbackText,
      fallback: true,
      error: error.message || "Failed to reach Gemini API",
    });
  }
});

// Helper for offline / fallback enchanted suggestions
function generateLocalFallback(action: string, text: string = "", prompt?: string): string {
  if (action === "spellcheck") {
    return JSON.stringify({
      correctedText: text,
      issues: [],
    });
  }
  if (action === "minecraft_lore") {
    return `In the ancient records of the Overworld, it was written: "${text}" - May the scribes of the Nether and the End honor these words.`;
  }
  if (action === "summarize") {
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    return `• Key Highlight: ${lines[0] || text.slice(0, 100)}\n• Word count: ${text.split(/\s+/).length} words\n• Status: Ready for crafting`;
  }
  if (action === "expand") {
    return `${text}\n\nFurthermore, careful observation reveals that additional dimensions of this subject warrant deeper exploration, crafting a more cohesive narrative with enhanced clarity and depth.`;
  }
  return text;
}

// Vite middleware setup
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
    console.log(`CraftDocs server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
