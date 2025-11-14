import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { trimResponse } from "./utils/format.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Ava Backend is running ✔");
});

app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are Ava, a helpful assistant." },
        { role: "user", content: prompt }
      ]
    });
    res.json({ reply: trimResponse(completion.choices[0].message.content) });
  } catch (e) { res.status(500).json({ error: e.toString() }); }
});

app.post("/search", async (req, res) => {
  try {
    const { query } = req.body;
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Summarize web search results." },
        { role: "user", content: `Search the web for: ${query}` }
      ]
    });
    res.json({ result: trimResponse(completion.choices[0].message.content) });
  } catch (e) { res.status(500).json({ error: e.toString() }); }
});

app.post("/timer/parse", async (req, res) => {
  try {
    const { prompt } = req.body;
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Extract timer duration as JSON {seconds:number}" },
        { role: "user", content: prompt }
      ]
    });
    res.json({ parsed: completion.choices[0].message.content });
  } catch (e) { res.status(500).json({ error: e.toString() }); }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Ava backend running on port ${PORT}`));
