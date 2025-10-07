import express from "express";
import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// 🧩 Ensure MongoDB connection (only once)
if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ Mongo Error:", err));
}

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ reply: "Please provide a valid message." });
  }

  try {
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("❌ API key missing");
      return res.status(500).json({ reply: "Server error: API key missing" });
    }

    // 🧠 Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a friendly AI Therapist chatbot for students. Reply in 2–3 short empathetic sentences."
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    console.log("🔹 OpenRouter Response:", JSON.stringify(data, null, 2));

    // 🧩 Extract reply safely
    const reply = data?.choices?.[0]?.message?.content?.trim() || "⚠️ No reply from AI";

    // 💾 Save chat history safely
    try {
      await Chat.create({ role: "user", message });
      await Chat.create({ role: "bot", message: reply });
    } catch (dbErr) {
      console.warn("⚠️ MongoDB Save Warning:", dbErr.message);
    }

    // ✅ Send AI reply
    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat Error:", err);
    res.status(500).json({
      reply: "Something went wrong, please try again.",
      details: err.message,
    });
  }
});

export default router;
