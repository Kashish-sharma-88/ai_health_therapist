import express from "express";
import Chat from "../models/Chat.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("❌ API key missing in .env");
      return res.status(500).json({ reply: "Server config error: API key missing" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ✅ recommended free model
        messages: [
          { role: "system", content: "You are a friendly AI Therapist chatbot for students. Reply in 2-3 short empathetic sentences." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    console.log("🔹 OpenRouter Response:", JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(500).json({ reply: `API Error: ${data.error.message}` });
    }

    const reply = data?.choices?.[0]?.message?.content || "⚠️ No reply from AI";

    await Chat.create({ role: "user", message });
    await Chat.create({ role: "bot", message: reply });

    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat Error:", err);
    res.status(500).json({ reply: "Something went wrong, please try again." });
  }
});

export default router;
