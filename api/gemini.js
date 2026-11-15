module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Set GEMINI_API_KEY in Vercel Environment Variables." });
  }

  const { prompt, responseJsonSchema } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  const models = ["gemini-3.8-flash", "gemini-3.6-flash"];
  const totalTimeoutMs = 55000;
  const deadline = Date.now() + totalTimeoutMs;
  const generationConfig = { responseMimeType: "application/json", maxOutputTokens: 8192 };
  if (responseJsonSchema) generationConfig.responseJsonSchema = responseJsonSchema;
  let lastError = "Gemini request failed";

  for (const model of models) {
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) break;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), remainingMs);
    let response, data;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig
          }),
          signal: controller.signal
        }
      );
      data = await response.json();
    } catch (err) {
      lastError = controller.signal.aborted
        ? `Gemini exceeded the ${totalTimeoutMs / 1000}-second total request budget while using ${model}.`
        : err.message;
      if (controller.signal.aborted) break;
      continue;
    } finally {
      clearTimeout(timeoutId);
    }

    const candidate = data?.candidates?.[0];
    if (response.ok && candidate?.finishReason === "MAX_TOKENS") {
      lastError = `Gemini reached the output token limit on ${model}; try a smaller lesson.`;
      continue;
    }
    const text = candidate?.content?.parts?.[0]?.text;
    if (response.ok && text) {
      return res.status(200).json({ text });
    }
    lastError = data?.error?.message || `HTTP ${response.status} on ${model}`;
    if ([400, 401, 403, 429].includes(response.status)) break;
  }

  return res.status(502).json({ error: lastError === "Gemini request failed" ? `Gemini request exceeded its ${totalTimeoutMs / 1000}-second time budget.` : lastError });
}
