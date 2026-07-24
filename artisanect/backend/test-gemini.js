/**
 * test-gemini.js — standalone diagnostic for the Artisanect Gemini integration.
 *
 * Runs the REAL gemini.service.js functions (generateProductCopy, chatReply,
 * extractSearchIntent) directly against Google's live API — no Express, no
 * database, no frontend. Use this to confirm your GEMINI_API_KEY actually
 * works and to see exactly which step fails if something's wrong.
 *
 * Usage (from the backend/ folder):
 *   node test-gemini.js
 *
 * Requires GEMINI_API_KEY to already be set in backend/.env.
 */

import "dotenv/config";
import {
  generateProductCopy,
  chatReply,
  extractSearchIntent,
} from "./src/services/gemini.service.js";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

function pass(label, detail) {
  console.log(`${GREEN}✔ PASS${RESET}  ${label}`);
  if (detail) console.log(`         ${detail}`);
}

function fail(label, err) {
  console.log(`${RED}✘ FAIL${RESET}  ${label}`);
  console.log(`         ${err.message}`);
  if (err.status) console.log(`         (status: ${err.status})`);
}

async function main() {
  console.log("=== Artisanect Gemini Diagnostic ===\n");

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key") {
    console.log(`${RED}✘ GEMINI_API_KEY is missing or still the placeholder value.${RESET}`);
    console.log("  Set a real key in backend/.env, get one at https://aistudio.google.com/apikey");
    process.exit(1);
  }
  console.log(`${YELLOW}Using model:${RESET} ${process.env.GEMINI_MODEL || "gemini-2.5-flash"} (from GEMINI_MODEL, or default)\n`);

  // ── Test 1: description generation (JSON parsing path) ──
  try {
    const result = await generateProductCopy({
      name: "Hand-thrown Terracotta Vase",
      category: "Pottery",
      material: "Terracotta clay",
      price: 450,
      tags: "handmade, rustic, eco-friendly",
    });
    const shapeOk = typeof result.title === "string" && typeof result.description === "string" && Array.isArray(result.highlights);
    if (shapeOk) {
      pass("generateProductCopy() — real API call + JSON parsing", `title: "${result.title}"`);
    } else {
      fail("generateProductCopy() — response shape unexpected", new Error(JSON.stringify(result)));
    }
  } catch (err) {
    fail("generateProductCopy()", err);
  }

  console.log("");

  // ── Test 2: chat (plain text path) ──
  try {
    const reply = await chatReply("Suggest a handmade gift for a housewarming", []);
    if (typeof reply === "string" && reply.length > 0) {
      pass("chatReply() — real API call, on-topic message", `reply: "${reply.slice(0, 80)}..."`);
    } else {
      fail("chatReply() — empty or invalid reply", new Error("reply was empty"));
    }
  } catch (err) {
    fail("chatReply()", err);
  }

  console.log("");

  // ── Test 3: chat guardrail (off-topic decline) ──
  try {
    const reply = await chatReply("Write me a Python script to scrape a website", []);
    console.log(`${YELLOW}ℹ INFO${RESET}   chatReply() off-topic guardrail — reply below (verify it declines, not a hard PASS/FAIL since it depends on model judgment):`);
    console.log(`         "${reply}"`);
  } catch (err) {
    fail("chatReply() off-topic test", err);
  }

  console.log("");

  // ── Test 4: search intent extraction (JSON parsing path) ──
  try {
    const result = await extractSearchIntent("gift under 500");
    const shapeOk = typeof result.keywords === "string" && (result.maxPrice === null || typeof result.maxPrice === "number");
    if (shapeOk) {
      pass("extractSearchIntent() — real API call + JSON parsing", `keywords: "${result.keywords}", maxPrice: ${result.maxPrice}`);
    } else {
      fail("extractSearchIntent() — response shape unexpected", new Error(JSON.stringify(result)));
    }
  } catch (err) {
    fail("extractSearchIntent()", err);
  }

  console.log("\n=== Done ===");
  console.log("If all four show PASS, your Gemini integration is fully working.");
  console.log("If any show FAIL, the error message above tells you exactly what to fix");
  console.log("(bad key, disabled API, quota exceeded, or a response-format issue).");
}

main().catch((err) => {
  console.error("\nUnexpected crash:", err);
  process.exit(1);
});
