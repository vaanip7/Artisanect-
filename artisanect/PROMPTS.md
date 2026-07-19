# PROMPTS.md — AI Prompt Engineering Log
**Project:** Artisanect | **Week:** 7 | **Intern ID:** 65
**AI Model:** Google Gemini 1.5 Flash | **Feature:** Product Description Generator

---

## Feature Overview

The AI description generator helps crafters write professional product listings. A crafter enters the product name, category, materials, and price — the AI generates a 2-paragraph description they can edit before uploading.

---

## Prompt Variation 1 — Too Vague (❌ Didn't work well)

**System instruction:** None

**Prompt:**
```
Write a product description for a handmade ${title} in the ${category} category.
```

**Example input:** title="Clay Mug", category="Pottery"

**Example output:**
> This is a clay mug. It is handmade and comes from the pottery category. You can use it for drinking tea or coffee. It is made by hand and is a great gift. Buy this clay mug today.

**Why it failed:**
Too short, repetitive, generic. No warmth or craft knowledge. The output sounds like a machine and would not convince anyone to buy the product. No mention of tradition, technique, or materials.

---

## Prompt Variation 2 — Better Structure, Still Generic (⚠️ Partially worked)

**System instruction:** "You are a product copywriter for a marketplace."

**Prompt:**
```
Write a 2-paragraph product description for:
Name: ${title}
Category: ${category}
Materials: ${materials}
Price: ₹${price}

Keep it professional and appealing.
```

**Example input:** title="Clay Mug", category="Pottery", materials="stoneware clay, food-safe glaze"

**Example output:**
> This beautiful clay mug is handcrafted from stoneware clay and finished with a food-safe glaze. It is perfect for enjoying your morning tea or coffee.
>
> Made by skilled artisans using traditional pottery techniques, this mug combines function and artistry. A wonderful addition to any kitchen or a thoughtful gift for someone special.

**Why it partially worked:**
Better tone, actual materials mentioned. But still slightly generic ("wonderful addition", "thoughtful gift"). The second paragraph lacks specificity. No cultural context or craft story.

---

## Prompt Variation 3 — Final Prompt (✅ Best result)

**System instruction:**
```
You are an expert product copywriter specialising in Indian handmade and artisan goods.
Write naturally and authentically.
```

**Prompt:**
```
You are a professional product copywriter for an Indian handmade goods marketplace called Artisanect.

Write a compelling product description for the following handcrafted item:

Product Name: ${title}
Category: ${category}
Materials: ${materialsText}
Price: ₹${price}
Keywords: ${tagsText}

Requirements:
- Write exactly 2 short paragraphs (3-4 sentences each)
- First paragraph: describe what the product is, the craft tradition, and what makes it special
- Second paragraph: describe materials, how it is made, and who it is perfect for
- Tone: warm, authentic, and passionate about handmade craft
- Do NOT use generic phrases like "one of a kind" or "perfect gift"
- Do NOT include the product name in the first word
- Write in plain text only — no bullet points, no markdown, no headings
- Keep total length under 120 words
```

**Example input:** title="Clay Mug", category="Pottery", materials="Stoneware clay, food-safe glaze"

**Example output:**
> Shaped on a hand-spun wheel and fired in a wood kiln, this rustic mug carries the warmth of a centuries-old pottery tradition alive in rural Rajasthan. Each piece bears the subtle marks of the wheel — no two are exactly alike, and that imperfection is entirely the point.
>
> Made from stoneware clay with a matte food-safe glaze, it holds heat beautifully and feels substantial in the hand. Microwave and dishwasher safe, it suits anyone who wants their everyday rituals to feel a little more grounded and intentional.

**Why it worked best:**
Specific, authentic, cultural context included. Avoids clichés. Both paragraphs serve different purposes (story vs. specs). The output feels like it was written by someone who genuinely cares about the craft, not an AI.

---

## What I Learned About Prompt Engineering

1. **Specificity beats brevity** — a longer, more structured prompt consistently produced better output than a short one-liner. The AI needs constraints to produce constrained output.

2. **System instructions matter** — adding a role-focused system instruction ("expert copywriter for Indian artisan goods") shifted the tone significantly compared to no system instruction.

3. **Negative constraints help** — explicitly saying "do NOT use 'one of a kind'" or "do NOT start with the product name" was more effective than saying "be creative". Telling the model what to avoid is just as important as telling it what to do.

---

## Other AI Features Implemented

### Feature 2: AI Natural Language Search (`POST /api/ai/search`)
Customers can type natural language like *"eco-friendly birthday gift under ₹500"* and Gemini interprets the intent to return the 3 most relevant products from the catalog.

**Prompt strategy:** Feed the full catalog as a compact summary, ask for IDs + a one-sentence interpretation in JSON format. Enforcing JSON output prevents free-text responses that are hard to parse.

### Feature 3: AI Customer Chatbot — "Kala" (`POST /api/ai/chat`)
A floating chat widget that knows the product catalog, delivery times, and marketplace details. Uses Gemini's multi-turn chat API with full conversation history passed on every request.

**Prompt strategy:** Detailed system instruction with personality ("warm, 2-4 sentences max, always end with a follow-up question"), hard facts about the marketplace embedded directly, and a clear instruction to admit uncertainty rather than invent answers.
