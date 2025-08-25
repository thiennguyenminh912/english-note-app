export type GeminiResult = {
  vietnamese_meaning: string;
  pronunciation: string;
  example_sentence: string;
};

const GEMINI_API_KEY = "AIzaSyBm9M3ptHeP00x4F-vb5OZZi6r0Ql4f9Xc";

const GEMINI_MODELS = [
  "gemma-3n-e2b-it",
  "gemma-3n-e4b-it",
  "gemma-3-1b-it",
  "gemma-3-4b-it",
  "gemma-3-12b-it",
  "gemma-3-27b-it",
];

export async function fetchWordData(word: string): Promise<GeminiResult> {
  const prompt = `Provide the Vietnamese meaning, pronunciation (IPA format), and a simple English example sentence for the English word "${word}", specifically within the context of the IT and software testing industry. The pronunciation should be in IPA format enclosed in slashes, e.g., /əˈɡraɪt/. Ensure the example sentence is relevant to software development or testing.`;
  const textModeInstruction =
    "Return ONLY a strict JSON object with keys: vietnamese_meaning, pronunciation, example_sentence. No commentary, no markdown fences.";
  const textModePayload = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${prompt}\n\n${textModeInstruction}` }],
      },
    ],
  } as const;

  function parseJsonFromText(text: string): GeminiResult {
    const fenced = text.match(/```json\s*([\s\S]*?)```/i);
    const candidate = fenced ? fenced[1] : text;
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const slice = candidate.slice(start, end + 1);
      return JSON.parse(slice) as GeminiResult;
    }
    return JSON.parse(candidate) as GeminiResult;
  }

  let lastError: unknown = null;

  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    try {
      const resTextMode = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(textModePayload),
      });
      if (!resTextMode.ok) throw new Error(`HTTP ${resTextMode.status}`);
      const json = await resTextMode.json();
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Empty response");
      return parseJsonFromText(text);
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 500));
      continue;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("All models failed");
}
