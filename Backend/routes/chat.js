import express from "express";
import Chat from "../models/Chat.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",  // ✅ recommended model
        messages: [
          {
            role: "system",
            content: "You are an AI Therapist chatbot for students. Always answer directly in 2-3 empathetic, supportive sentences. Never say you do not understand, never list options, and never refuse. If the student says 'hi', greet them warmly and ask about their feelings or day."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    console.log("🔹 OpenRouter Response:", JSON.stringify(data, null, 2));

    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "⚠️ AI did not return a proper reply.";

    await Chat.create({ role: "user", message });
    await Chat.create({ role: "bot", message: reply });

    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat Error:", err);
    res.status(500).json({ reply: "Something went wrong, please try again." });
  }
});

export default router;
