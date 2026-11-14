export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured in Vercel Environment Variables." });
  }

  const { prompt } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  let lastError = "Gemini request failed";

  for (const model of models) {
    try {
      const genCfg = { responseMimeType: "application/json" };
      if (model.includes("2.5")) genCfg.thinkingConfig = { thinkingBudget: 0 };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: genCfg
          })
        }
      );

      const data = await response.json().catch(() => ({}));
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (response.ok && text) {
        return res.status(200).json({ text });
      }
      lastError = data?.error?.message || `HTTP ${response.status} on ${model}`;
      if (response.status === 400 || response.status === 403) break;
    } catch (err) {
      lastError = err.message;
    }
  }

  return res.status(502).json({ error: lastError });
}
