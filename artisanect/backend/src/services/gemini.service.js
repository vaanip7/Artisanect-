import { GoogleGenAI } from "@google/genai";

/**
 * gemini.service.js — centralised Gemini AI client for Artisanect.
 *
 * Every AI feature (description generation, chat assistant, natural
 * language search) goes through this file so there is exactly one place
 * that touches the Gemini SDK, reads GEMINI_API_KEY, and knows the model
 * name. Controllers never import `@google/genai` directly.
 *
 * The API key is read from process.env.GEMINI_API_KEY (set in backend/.env,
 * which is git-ignored) and is never sent to the frontend or logged.
 */

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let client = null;

/**
 * Lazily creates the GoogleGenAI client on first use so a missing API key
 * doesn't crash the server at boot — it only fails the specific AI request.
 */
function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    const err = new Error(
      "AI features are not configured. GEMINI_API_KEY is missing on the server."
    );
    err.status = 503;
    throw err;
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}

/**
 * Strips ```json fences and stray text some models wrap around JSON output,
 * then parses it. Throws a friendly error if the model didn't return valid JSON.
 *
 * @param {string} text
 * @returns {any}
 */
function parseJsonResponse(text) {
  const cleaned = String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const err = new Error("AI returned an unexpected response format. Please try again.");
    err.status = 502;
    throw err;
  }
}

/**
 * Wraps a Gemini call so upstream/network failures become a clean,
 * consistent 502/503 error the controller can forward to the client.
 *
 * @template T
 * @param {() => Promise<T>} fn
 * @returns {Promise<T>}
 */
async function callGemini(fn) {
  try {
    return await fn();
  } catch (err) {
    if (err.status) throw err; // already a shaped error (e.g. missing key)
    console.error("[gemini.service] Gemini API call failed:", err.message);
    const wrapped = new Error("The AI service is temporarily unavailable. Please try again shortly.");
    wrapped.status = 502;
    throw wrapped;
  }
}

// ─────────────────────────────────────────────
// FEATURE 1 — Product description generation
// ─────────────────────────────────────────────

/**
 * Generates a professional product title, description, and selling
 * highlights for a crafter's product listing.
 *
 * @param {{ name: string, category: string, material: string, price: string|number, tags?: string }} input
 * @returns {Promise<{ title: string, description: string, highlights: string[] }>}
 */
export async function generateProductCopy({ name, category, material, price, tags }) {
  const ai = getClient();

  const prompt = `You are an expert e-commerce copywriter for Artisanect, a marketplace connecting
independent artisans with buyers who care about handmade, small-batch craftsmanship.

Write professional, warm, and honest product copy for the listing below. Do not invent
specific claims (awards, certifications, exact dimensions) that were not provided.

Product name: ${name}
Category: ${category}
Material: ${material}
Price: ₹${price}
Tags: ${tags || "none provided"}

Respond with ONLY a JSON object in this exact shape, no markdown fences, no extra text:
{
  "title": "a polished, sellable product title (max 70 characters)",
  "description": "a 2-3 sentence product description (60-90 words) that highlights the craftsmanship, material, and use-case",
  "highlights": ["3 to 5 short selling-point bullet phrases, each under 8 words"]
}`;

  const response = await callGemini(() =>
    ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { temperature: 0.7 },
    })
  );

  const parsed = parseJsonResponse(response.text);

  if (!parsed.title || !parsed.description) {
    const err = new Error("AI did not return a complete listing. Please try again.");
    err.status = 502;
    throw err;
  }

  return {
    title: String(parsed.title).trim(),
    description: String(parsed.description).trim(),
    highlights: Array.isArray(parsed.highlights)
      ? parsed.highlights.map((h) => String(h).trim()).filter(Boolean).slice(0, 5)
      : [],
  };
}

// ─────────────────────────────────────────────
// FEATURE 2 — ArtisanAI chat assistant
// ─────────────────────────────────────────────

const CHAT_SYSTEM_INSTRUCTION = `You are ArtisanAI, the friendly shopping assistant for Artisanect — a
marketplace for handmade goods made by independent artisans.

You ONLY discuss topics related to: handmade products, artisans and craftsmanship, shopping
and gift advice on Artisanect, home decor, materials/techniques, and caring for handmade items.

If the user asks about anything outside that scope (coding, politics, unrelated general
knowledge, etc.), politely decline in one short sentence and steer the conversation back to
how you can help them with handmade products, gifts, or artisans. Never pretend to browse
the live product catalog or invent specific product names, prices, or stock — speak in
general terms and suggest the person use the Shop search for exact listings.

Keep replies concise (2-5 sentences unless the person asks for a list), warm, and helpful.`;

/**
 * Sends a chat message (with prior turns for context) to Gemini, scoped to
 * Artisanect-relevant topics via a system instruction.
 *
 * @param {string} message - the new user message
 * @param {{role: "user"|"assistant", content: string}[]} [history] - prior turns from this session
 * @returns {Promise<string>} the assistant's reply text
 */
export async function chatReply(message, history = []) {
  const ai = getClient();

  // Gemini expects roles "user" | "model". Map our "assistant" -> "model",
  // and cap history so a long session doesn't blow up token usage.
  const contents = [
    ...history.slice(-12).map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: String(turn.content || "") }],
    })),
    { role: "user", parts: [{ text: String(message) }] },
  ];

  const response = await callGemini(() =>
    ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: CHAT_SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
    })
  );

  const text = String(response.text || "").trim();
  if (!text) {
    const err = new Error("AI did not return a reply. Please try again.");
    err.status = 502;
    throw err;
  }
  return text;
}

// ─────────────────────────────────────────────
// FEATURE 3 — Natural language product search
// ─────────────────────────────────────────────

/**
 * Converts a natural-language shopping query ("gift under 500", "eco
 * friendly decor") into a short, optimized keyword string suitable for the
 * existing /api/products/search?q= endpoint, plus an optional max price
 * extracted from the query.
 *
 * @param {string} query
 * @returns {Promise<{ keywords: string, maxPrice: number|null }>}
 */
export async function extractSearchIntent(query) {
  const ai = getClient();

  const prompt = `You convert shopping search queries into optimized keyword search terms for a
handmade-goods marketplace database. The database matches keywords against product title,
description, category, and artisan name using simple substring matching (no semantic search),
so keywords must be concrete, literal words likely to appear in product listings.

User query: "${query}"

Respond with ONLY a JSON object in this exact shape, no markdown fences, no extra text:
{
  "keywords": "1-4 concrete keywords, space separated, e.g. 'pottery' or 'wooden decor'",
  "maxPrice": a number if the user implied a price ceiling (e.g. 'under 500' -> 500), otherwise null
}`;

  const response = await callGemini(() =>
    ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { temperature: 0.2 },
    })
  );

  const parsed = parseJsonResponse(response.text);

  return {
    keywords: String(parsed.keywords || query).trim(),
    maxPrice:
      typeof parsed.maxPrice === "number" && parsed.maxPrice > 0 ? parsed.maxPrice : null,
  };
}
