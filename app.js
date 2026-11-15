let currentMode = 'story';
let activeChapterIdx = 0;
let activeStageTab = 'lesson';
let lastSearchCandidates = [];
let forceTopCount = null;
let lastCertaintyScore = 92;
let visualSeed = 101;

let isSpeaking = false;
let speechRate = 1.0;
let selectedVoiceURI = "";
let availableVoices = [];
let audioCtx = null;
let ambientNodes = [];
let ambientGain = null;

let pomoSeconds = 25 * 60;
let pomoInterval = null;
const masteredDefs = new Set();
const completedChapters = new Set();

let aiConfig = JSON.parse(localStorage.getItem("luminaread_ai_config") || "null") || {
  provider: "gemini",
  ollamaUrl: "http://localhost:11434",
  ollamaModel: "llama3.2",
  apiKey: "",
  openaiModel: "gpt-4o-mini"
};
if (aiConfig.provider === "ollama" && !aiConfig.apiKey) aiConfig.provider = "gemini";

const BOOK_LIBRARY = {
  "atomic-habits": {
    title: "Atomic Habits",
    author: "James Clear",
    year: "2018",
    category: "Behavioral Psychology & Systems",
    coverEmoji: "⚛️",
    coverUrl: "https://covers.openlibrary.org/b/id/10521270-M.jpg",
    summaryIntro: "Imagine two pilots taking off from Los Angeles bound for New York. Before takeoff, one pilot adjusts the heading by just 3.5 degrees south. At first, nobody notices. Yet across the continent, that tiny shift lands the plane in Washington D.C. instead of New York. Atomic Habits is the story of how invisible daily adjustments reshape human destiny.",
    storyActs: [
      { act: "Act I: The Invisible Compass", title: "Why Tiny Changes Outperform Grand Ambitions", story: "Our hero begins trapped in the Valley of Disappointment, working hard for weeks with zero visible reward. Then they discover the secret of the melting ice cube: ice sits at 29, 30, and 31 degrees with no change, until a single degree shift to 32 unleashes a torrent." },
      { act: "Act II: The Mirror of Identity", title: "Becoming the Architect Instead of the Prisoner", story: "Most travelers try to change what they do without changing who they believe they are. In Act Two, the protagonist casts tiny daily votes for a new self-image." },
      { act: "Act III: The Four Laws of the Forge", title: "Designing Environments Where Good Choices Are Automatic", story: "Rather than relying on exhausting willpower, our protagonist redesigns the castle itself, placing tools of craft in plain sight, shrinking action to two minutes, and celebrating every stone laid." },
      { act: "Act IV: The Goldilocks Mastery", title: "Staying on the Edge of Flow Without Complacency", story: "At the summit, the master learns that habits make actions automatic, while deliberate reflection keeps skill alive." }
    ],
    chapters: [
      {
        number: 1,
        title: "The Surprising Power of Tiny 1% Shifts",
        aiEnhanced: true,
        storyVisualCaption: "Story Scene: British Cycling's workshop and the 1% compass adjustment across a starry ocean.",
        studyVisualCaption: "Study Schematic: Exponential Compounding Curve versus the Valley of Disappointment.",
        storyNarrative: [
          "In 2003, British Cycling had endured nearly a century of mediocrity, winning just a single gold medal in a hundred years and being turned away by bike manufacturers who feared their brand would suffer.",
          "Then arrived Dave Brailsford with a quiet philosophy called the aggregation of marginal gains: break everything about riding a bicycle down and improve each tiny piece by just one percent.",
          "They redesigned bike seats, rubbed alcohol on tires for grip, tested massage gels, and even taught riders how to wash their hands to avoid catching colds during training.",
          "No single adjustment looked heroic on its own, yet just five years later at the Beijing Olympics, British riders captured 60 percent of all available gold medals.",
          "Like an ice cube sitting in a cold room that suddenly melts at 32 degrees, your daily habits store invisible potential until you cross the Plateau of Latent Potential."
        ],
        studyNarrative: [
          "Core Principle: Behavioral outcomes follow a non-linear compounding trajectory governed by Vf = V0(1 + r)^t.",
          "A 1% daily improvement (1.01^365 = 37.78) yields a 37x capability gain over one year, whereas a 1% daily decline degrades performance to near zero.",
          "The Plateau of Latent Potential describes the phase lag between behavioral effort and observable output, often misdiagnosed as failure during the Valley of Disappointment.",
          "Systems vs. Goals: Goals define desired directional endpoints, whereas Systems define the continuous feedback loops and processes that generate those endpoints reliably."
        ],
        storyMoral: "Think of an ice cube on a table at 26 degrees, then 28, then 31. Nothing seems to happen, yet no energy was wasted. At 32 degrees, a single degree unleashes the thaw.",
        studyTakeaway: "Optimize for system throughput rather than static goals. Delayed gratification requires surviving the non-linear lag phase.",
        storyCharacters: ["Dave Brailsford (The Systems Architect)", "British Cycling Team (The Underdogs)", "The Melting Ice Cube (Metaphor for Thresholds)"],
        storyNextBridge: "Once you see how tiny 1% shifts compound, Chapter 2 reveals why changing your identity is the fastest way to lock those shifts in forever.",
        chapterSummary: "Small 1% daily improvements compound exponentially over time, but early results lag behind expectations inside the Valley of Disappointment. Lasting success comes from building reliable daily systems rather than obsessing over one-time goals.",
        pointsToRemember: [
          "1% better every day for a year makes you 37.78x better; 1% worse drops you to 0.03.",
          "Breakthrough moments are the delayed result of many previous actions reaching a critical threshold.",
          "Winners and losers often share the exact same goals—systems are what separate them.",
          "Survive the Valley of Disappointment by trusting your daily process."
        ],
        topicsCovered: ["Marginal Gains", "Compound Curves", "Plateau of Latent Potential", "Systems vs. Goals"],
        definitions: [
          { term: "Aggregation of Marginal Gains", cat: "Core Principle", def: "Isolating every micro-component of a complex process and improving each by 1% to achieve exponential cumulative advantage.", ex: "Optimizing sleep pillows, tire grip, and nutrition simultaneously." },
          { term: "Plateau of Latent Potential", cat: "System Dynamics", def: "The threshold phase where accumulated effort stores energy invisibly before producing an abrupt, visible breakthrough.", ex: "Bamboo growing underground roots for 5 years before shooting 90 feet in 6 weeks." },
          { term: "Valley of Disappointment", cat: "Cognitive Bias", def: "The gap between linear human expectations and exponential reality during the early stages of a habit.", ex: "Quitting gym workouts in week 3 because visible changes lag behind neural adaptation." }
        ],
        graphData: {
          lineLabels: ["M1", "M2", "M4", "M6", "M9", "M12"],
          primarySeries: [2, 5, 11, 24, 55, 98],
          secondarySeries: [15, 30, 45, 60, 75, 90],
          primaryLabel: "Compound Output", secondaryLabel: "Linear Expectation",
          barLabels: ["System Design", "Consistency", "Environment", "Willpower"],
          barValues: [94, 91, 86, 32]
        },
        quiz: [
          { q: "Why do people most commonly abandon productive habits during the first few weeks?", options: ["They expect progress to be linear and get discouraged in the Valley of Disappointment", "1% improvements mathematically cancel each other out", "Goals are more important than daily systems"], answer: 0, explanation: "Because compounding starts flat, people expect linear results and quit before crossing the Plateau of Latent Potential." },
          { q: "What is the key difference between Goals and Systems?", options: ["Goals are for results you want; Systems are the processes that lead to those results", "Goals are permanent; Systems are temporary", "There is no practical difference"], answer: 0, explanation: "Fixing your inputs (systems) automatically fixes your outputs (goals)." },
          { q: "Mathematically, what does a 1% daily improvement over 365 days equal?", options: ["3.65x", "37.78x", "10.0x"], answer: 1, explanation: "1.01 raised to the 365th power equals 37.78." }
        ]
      }
    ]
  }
};

let activeBook = BOOK_LIBRARY["atomic-habits"];

/* ==========================================================================
   1. REAL AI ENGINE (OLLAMA + GEMINI + OPENAI + GROQ)
   ========================================================================== */
function openAiModal() {
  document.getElementById("aiProviderSelect").value = aiConfig.provider;
  document.getElementById("ollamaUrlInput").value = aiConfig.ollamaUrl;
  document.getElementById("ollamaModelInput").value = aiConfig.ollamaModel;
  document.getElementById("apiKeyInput").value = aiConfig.apiKey || "";
  document.getElementById("openaiModelInput").value = aiConfig.openaiModel || "gpt-4o-mini";
  toggleAiProviderFields();
  document.getElementById("aiModal").classList.remove("hidden");
  if (aiConfig.provider === "ollama") detectOllamaModels();
}
function closeAiModal() { document.getElementById("aiModal").classList.add("hidden"); }
function toggleAiProviderFields() {
  const p = document.getElementById("aiProviderSelect").value;
  document.getElementById("ollamaFields").classList.toggle("hidden", p !== "ollama");
  document.getElementById("cloudApiFields").classList.toggle("hidden", p === "ollama");
}

function chapterNeedsAI(ch) {
  return !ch.aiEnhanced || !ch.storySvg || !ch.studySvg;
}

async function fetchJsonWithTimeout(url, options, timeoutMs = 45000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    let data;
    try {
      data = await response.json();
    } catch (error) {
      if (controller.signal.aborted) throw error;
      throw new Error(`Gemini returned invalid JSON (HTTP ${response.status}): ${error.message}`);
    }
    return { response, data };
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`Gemini request timed out after ${Math.round(timeoutMs / 1000)} seconds.`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function detectOllamaModels() {
  const url = (document.getElementById("ollamaUrlInput").value || "http://localhost:11434").replace(/\/$/, "");
  const statusEl = document.getElementById("ollamaStatus");
  statusEl.textContent = "Checking local Ollama...";
  try {
    const res = await fetch(`${url}/api/tags`);
    if (!res.ok) throw new Error("Not reachable");
    const data = await res.json();
    const models = (data.models || []).map(m => m.name);
    if (models.length) {
      statusEl.textContent = `✅ Connected! Models: ${models.slice(0, 4).join(", ")}`;
      if (!models.includes(document.getElementById("ollamaModelInput").value)) document.getElementById("ollamaModelInput").value = models[0];
    } else statusEl.textContent = "⚠️ Ollama running, no models pulled yet.";
  } catch { statusEl.textContent = "⚠️ Ollama not detected at localhost:11434"; }
}

function saveAiSettings() {
  aiConfig = {
    provider: document.getElementById("aiProviderSelect").value,
    ollamaUrl: document.getElementById("ollamaUrlInput").value.trim().replace(/\/$/, "") || "http://localhost:11434",
    ollamaModel: document.getElementById("ollamaModelInput").value.trim() || "llama3.2",
    apiKey: document.getElementById("apiKeyInput").value.trim(),
    openaiModel: document.getElementById("openaiModelInput").value.trim() || "gpt-4o-mini"
  };
  localStorage.setItem("luminaread_ai_config", JSON.stringify(aiConfig));
  closeAiModal();
  showToast(`🤖 AI Engine set to ${aiConfig.provider.toUpperCase()}`);
  const ch = activeBook.chapters[activeChapterIdx];
  if (ch) generateChapterWithAI(ch, true);
}

async function callConfiguredLLM(promptText) {
  if (aiConfig.provider === "ollama") {
    const res = await fetch(`${aiConfig.ollamaUrl}/api/generate`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: aiConfig.ollamaModel, prompt: promptText, stream: false, format: "json" })
    });
    if (!res.ok) throw new Error("Ollama error");
    return (await res.json()).response;
  }
  if (aiConfig.provider === "gemini") {
    if (!aiConfig.apiKey) {
      if (location.protocol === "file:") {
        throw new Error("Gemini needs the deployed Vercel app or a local API server; opening index.html directly cannot reach /api/gemini.");
      }
      const { response: proxyRes, data: proxyData } = await fetchJsonWithTimeout("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText })
      });
      if (proxyRes.status === 404) throw new Error("Gemini endpoint /api/gemini was not found. Deploy the project to Vercel.");
      if (proxyRes.ok && proxyData.text) return proxyData.text;
      throw new Error(proxyData.error || `Gemini service returned HTTP ${proxyRes.status}.`);
    }
    let lastError = "Gemini API request failed.";
    for (const model of ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite"]) {
      const { response: res, data } = await fetchJsonWithTimeout(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(aiConfig.apiKey)}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }], generationConfig: { responseMimeType: "application/json" } })
      });
      if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) return data.candidates[0].content.parts[0].text;
      lastError = data?.error?.message || `Gemini API returned HTTP ${res.status} for ${model}.`;
      if ([400, 401, 403, 429].includes(res.status)) throw new Error(lastError);
    }
    throw new Error(lastError);
  }
  if ((aiConfig.provider === "openai" || aiConfig.provider === "groq") && aiConfig.apiKey) {
    const endpoint = aiConfig.provider === "groq" ? "https://api.groq.com/openai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
    const model = aiConfig.provider === "groq" ? "llama-3.3-70b-versatile" : (aiConfig.openaiModel || "gpt-4o-mini");
    const res = await fetch(endpoint, {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${aiConfig.apiKey}` },
      body: JSON.stringify({ model, response_format: { type: "json_object" }, messages: [{ role: "user", content: promptText }] })
    });
    if (!res.ok) throw new Error("Cloud API error");
    return (await res.json()).choices[0].message.content;
  }
  throw new Error("No active AI provider configured");
}

async function generateChapterWithAI(ch, forceRefresh = false) {
  if (!chapterNeedsAI(ch) && !forceRefresh) return;
  ch.aiGenerationFailed = false;
  const banner = document.getElementById("aiStatusBanner"), statusText = document.getElementById("aiBannerText");
  banner.classList.remove("hidden"); banner.classList.add("generating");
  statusText.textContent = `🤖 ${aiConfig.provider.toUpperCase()} is crafting Story, Study Cheat Sheet, Quiz & Custom SVG Visuals for Chapter ${ch.number}...`;

  const prompt = `You are a world-class educator and master storyteller. Analyze this book chapter and return ONLY valid JSON.
Book: "${activeBook.title}" by ${activeBook.author}
Chapter ${ch.number}: "${ch.title}"
Source Material: """${(ch.rawExcerpt || ch.storyNarrative.join(" ")).slice(0, 3200)}"""

Return strictly this JSON:
{
  "cleanTitle": "Clear, engaging chapter title",
  "storyNarrative": ["4 to 5 vivid storytelling sentences teaching this chapter's lesson naturally"],
  "studyNarrative": ["4 crisp academic sentences explaining the concepts and mechanisms"],
  "storyMoral": "One memorable metaphor or moral takeaway",
  "studyTakeaway": "One concise analytical takeaway",
  "storyCharacters": ["Key Character or Concept 1 (Role)", "Key Character or Theme 2 (Role)"],
  "storyNextBridge": "One sentence bridging this story to the next lesson",
  "chapterSummary": "2-sentence executive summary of this chapter",
  "pointsToRemember": ["High-yield point 1", "High-yield point 2", "High-yield point 3", "High-yield point 4"],
  "topicsCovered": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"],
  "storySvg": "A valid, colorful 800x350 <svg viewBox='0 0 800 350'>...</svg> scene illustrating this chapter's story (gradients, shapes, labels, no script tags)",
  "studySvg": "A valid, clean dark-blueprint 800x350 <svg viewBox='0 0 800 350'>...</svg> concept flowchart for Study Mode (boxes, arrows, labels, no script tags)",
  "definitions": [
    {"term": "Term 1", "cat": "Category", "def": "Clear definition", "ex": "Concrete example"},
    {"term": "Term 2", "cat": "Category", "def": "Clear definition", "ex": "Concrete example"},
    {"term": "Term 3", "cat": "Category", "def": "Clear definition", "ex": "Concrete example"}
  ],
  "quiz": [
    {"q": "Conceptual question 1", "options": ["Correct", "Wrong 1", "Wrong 2"], "answer": 0, "explanation": "Why this is right"},
    {"q": "Conceptual question 2", "options": ["Wrong 1", "Correct", "Wrong 2"], "answer": 1, "explanation": "Why this is right"},
    {"q": "Conceptual question 3", "options": ["Correct", "Wrong 1", "Wrong 2"], "answer": 0, "explanation": "Why this is right"}
  ]
}`;

  try {
    const rawJson = await callConfiguredLLM(prompt);
    const parsed = JSON.parse(rawJson.replace(/```json|```/g, "").trim());
    if (parsed.cleanTitle) ch.title = parsed.cleanTitle;
    if (Array.isArray(parsed.storyNarrative) && parsed.storyNarrative.length) ch.storyNarrative = parsed.storyNarrative;
    if (Array.isArray(parsed.studyNarrative) && parsed.studyNarrative.length) ch.studyNarrative = parsed.studyNarrative;
    if (parsed.storyMoral) ch.storyMoral = parsed.storyMoral;
    if (parsed.studyTakeaway) ch.studyTakeaway = parsed.studyTakeaway;
    if (Array.isArray(parsed.storyCharacters)) ch.storyCharacters = parsed.storyCharacters;
    if (parsed.storyNextBridge) ch.storyNextBridge = parsed.storyNextBridge;
    if (parsed.chapterSummary) ch.chapterSummary = parsed.chapterSummary;
    if (Array.isArray(parsed.pointsToRemember)) ch.pointsToRemember = parsed.pointsToRemember;
    if (Array.isArray(parsed.topicsCovered)) ch.topicsCovered = parsed.topicsCovered;
    if (parsed.storySvg && parsed.storySvg.includes("<svg")) ch.storySvg = parsed.storySvg.replace(/<script[\s\S]*?<\/script>/gi, "");
    if (parsed.studySvg && parsed.studySvg.includes("<svg")) ch.studySvg = parsed.studySvg.replace(/<script[\s\S]*?<\/script>/gi, "");
    if (Array.isArray(parsed.definitions) && parsed.definitions.length) ch.definitions = parsed.definitions;
    if (Array.isArray(parsed.quiz) && parsed.quiz.length) ch.quiz = parsed.quiz;

    ch.aiEnhanced = true;
    ch.aiGenerationFailed = !ch.storySvg || !ch.studySvg;
    saveBookToUserShelf(activeBook); banner.classList.remove("generating");
    statusText.textContent = ch.aiGenerationFailed
      ? `⚠️ ${aiConfig.provider.toUpperCase()} returned no SVG; showing the local visual instead.`
      : `✨ AI-Generated Lesson & Custom Visuals (${aiConfig.provider.toUpperCase()})`;
    renderBookWorkspace();
    showToast(`✨ Chapter ${ch.number} generated by AI!`);
  } catch (err) {
    ch.aiGenerationFailed = true;
    banner.classList.remove("generating");
    statusText.textContent = `⚠️ AI: ${err.message} — Using Smart Local Mode`;
    if (activeBook.chapters[activeChapterIdx] === ch) renderChapterContent();
  }
}

async function generateBookStorySummaryWithAI() {
  showToast("🤖 Synthesizing 4-Act Book Story...");
  const allTitles = activeBook.chapters.map(c => `Ch.${c.number}: ${c.title}`).join("; ");
  const prompt = `Summarize "${activeBook.title}" by ${activeBook.author} (${allTitles}) into a 4-Act Story. Return ONLY JSON:
{
  "summaryIntro": "Engaging 2-sentence story hook",
  "storyActs": [
    {"act": "Act I: The Spark", "title": "Title", "story": "2-3 vivid sentences"},
    {"act": "Act II: The Rising Conflict", "title": "Title", "story": "2-3 vivid sentences"},
    {"act": "Act III: The Breakthrough", "title": "Title", "story": "2-3 vivid sentences"},
    {"act": "Act IV: The Legacy", "title": "Title", "story": "2-3 vivid sentences"}
  ]
}`;
  try {
    const parsed = JSON.parse((await callConfiguredLLM(prompt)).replace(/```json|```/g, "").trim());
    if (parsed.summaryIntro) activeBook.summaryIntro = parsed.summaryIntro;
    if (Array.isArray(parsed.storyActs)) activeBook.storyActs = parsed.storyActs;
    renderBookStorySummary();
    showToast("🌟 4-Act Book Story updated by AI!");
  } catch (e) { showToast(`⚠️ ${e.message}`); }
}

function autoGenerpZEAWYtiB6bJ16NuLbGCc6CZ6jJdKfb63() {
  const ch = activeBook.chapters[activeChapterIdx];
  const notes = getSavedNotes();
  (ch.pointsToRemember || ch.studyNarrative).slice(0, 3).forEach(pt => {
    notes.unshift({ ch: `Ch. ${ch.number} (Auto)`, text: pt, date: new Date().toLocaleTimeString() });
  });
  saveNotesList(notes);
  renderNotesTab();
  showToast("📝 Added chapter key points to your Study Notes!");
}

/* ==========================================================================
   2. DRY METADATA FILTER & INTELLIGENT SPEECH PREPROCESSOR
   ========================================================================== */
function stripDryMetadata(rawText) {
  if (!rawText) return "";
  return String(rawText)
    .replace(/https?:\/\/\S+|www\.\S+/gi, " ").replace(/\bISBN[-\s:]*[\dXx-]+/gi, " ")
    .replace(/Copyright\s*©?.*?(\n|$)/gi, " ").replace(/All rights reserved\.?/gi, " ")
    .replace(/\b(?:Week|Topic|Module|Unit|Lecture|Slide|Page|Part|Sec(?:tion)?)\s*(?:\d+|[IVXLCDM]+)\s*[:\-–.|]?\s*/gi, "")
    .replace(/^\s*(?:Table of Contents|Contents|Index|Preface|Acknowledgements|Bibliography)\s*$/gim, "")
    .replace(/\bPage\s+\d+\s+of\s+\d+\b/gi, " ").replace(/(?:^|\s)\d{1,3}\s*$/gm, " ")
    .replace(/\.{3,}\s*\d+/g, " ").replace(/[\r\n]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

function prepareSpeechText(rawText) {
  if (!rawText) return "";
  return stripDryMetadata(rawText).replace(/[*_`~#<>[\]{}|\\]/g, " ")
    .replace(/\bCh\.\s*(\d+)/gi, "Chapter $1").replace(/\bDr\./g, "Doctor").replace(/\be\.g\./gi, "for example")
    .replace(/\bi\.e\./gi, "that is").replace(/\bvs\./gi, "versus").replace(/\betc\./gi, "and so on")
    .replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g, "$1 to the power of $2")
    .replace(/(\d+)\s*x\b/gi, "$1 times").replace(/%/g, " percent").replace(/\s*&\s*/g, " and ")
    .replace(/\s*→\s*|\s*->\s*/g, " leads to ").replace(/\s*=\s*/g, " equals ").replace(/\s*\+\s*/g, " plus ")
    .replace(/([A-Za-z0-9])\s*\/\s*([A-Za-z0-9])/g, "$1 or $2").replace(/\//g, " ")
    .replace(/\.{2,}/g, ", ").replace(/[•▪▫◦–—]/g, ", ").replace(/["'“”‘’()]/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1").replace(/([.,!?;:])\1+/g, "$1").replace(/\s{2,}/g, " ").trim().replace(/[.,;:]+$/, "");
}

function loadAvailableVoices() {
  if (!("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return;
  const ranked = [...voices].sort((a, b) => {
    const score = (v) => (v.lang.startsWith("en") ? 50 : 0) + (/natural|neural|online|google|samantha|aria|jenny|daniel|guy/i.test(v.name) ? 35 : 0);
    return score(b) - score(a);
  });
  availableVoices = ranked;
  const sel = document.getElementById("voiceSelect");
  if (sel) {
    sel.innerHTML = ranked.slice(0, 12).map(v => `<option value="${escapeHtml(v.voiceURI)}">${escapeHtml(v.name.slice(0, 32))} (${v.lang})</option>`).join("");
    if (!selectedVoiceURI && ranked[0]) selectedVoiceURI = ranked[0].voiceURI;
    sel.value = selectedVoiceURI;
  }
}
if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = loadAvailableVoices;

/* ==========================================================================
   3. HYBRID VISUAL ENGINE (AI SVG + PROCEDURAL CANVAS)
   ========================================================================== */
function renderProceduralCanvasArt(canvas, chapter, mode, seedOffset = 0) {
  if (!canvas) return;
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = rect.width || 800, h = rect.height || 350, dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr);
  const seed = (chapter.number * 97 + visualSeed + seedOffset) % 360;
  if (mode === "story") {
    const sky = ctx.createLinearGradient(0, 0, w, h);
    sky.addColorStop(0, `hsl(${(seed + 220) % 360}, 52%, 12%)`);
    sky.addColorStop(0.55, `hsl(${(seed + 260) % 360}, 48%, 18%)`);
    sky.addColorStop(1, `hsl(${(seed + 20) % 360}, 65%, 16%)`);
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
    const orbX = w * (0.3 + ((seed % 40) / 100)), orbY = h * 0.36;
    const glow = ctx.createRadialGradient(orbX, orbY, 12, orbX, orbY, 170);
    glow.addColorStop(0, "rgba(251, 191, 36, 0.85)"); glow.addColorStop(0.35, "rgba(236, 72, 153, 0.32)"); glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(orbX, orbY, 170, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 65; i++) {
      ctx.fillStyle = `rgba(255, 250, 235, ${0.35 + (i % 5) * 0.12})`;
      ctx.beginPath(); ctx.arc(((i * 137 + seed * 13) % w), ((i * 89 + seed * 7) % (h * 0.68)), (i % 3 === 0) ? 1.8 : 0.9, 0, Math.PI * 2); ctx.fill();
    }
    const drawRidge = (yBase, amp, color, phase) => {
      ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 18) ctx.lineTo(x, yBase + Math.sin(x * 0.012 + phase) * amp + Math.cos(x * 0.025 + phase) * (amp * 0.4));
      ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
    };
    drawRidge(h * 0.68, 26, "rgba(32, 22, 52, 0.78)", seed * 0.1);
    drawRidge(h * 0.79, 20, "rgba(18, 13, 30, 0.92)", seed * 0.2 + 2);
    drawRidge(h * 0.89, 10, "#090710", seed * 0.3 + 4);
  } else {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#040c18"); bg.addColorStop(1, "#09182d");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(6, 182, 212, 0.11)"; ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  }
}

function buildChapterSvgOverlay(chapter, mode) {
  const chNum = chapter.number;
  if (mode === "story") {
    return `<svg viewBox="0 0 800 350" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><g transform="translate(400, 145)"><circle r="56" fill="none" stroke="#f59e0b" stroke-opacity="0.7" stroke-width="1.8" stroke-dasharray="6 4"/><circle r="38" fill="rgba(12, 9, 20, 0.55)" stroke="#ec4899" stroke-width="1.5"/><polygon points="0,-28 7,-7 28,0 7,7 0,28 -7,7 -28,0 -7,-7" fill="#fbbf24" opacity="0.95"/></g><text x="400" y="325" text-anchor="middle" fill="#faf6ee" font-family="Playfair Display, serif" font-size="15" font-style="italic">Chapter ${chNum}: "${escapeHtml(chapter.title.slice(0, 56))}"</text></svg>`;
  }
  const defs = chapter.definitions || [];
  const n1 = defs[0] ? defs[0].term.slice(0, 22) : "Input Trigger", n2 = defs[1] ? defs[1].term.slice(0, 22) : "Core Mechanism", n3 = defs[2] ? defs[2].term.slice(0, 22) : "Equilibrium";
  return `<svg viewBox="0 0 800 350" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><path d="M235,170 L310,170" stroke="#06b6d4" stroke-width="2.5"/><path d="M490,170 L565,170" stroke="#3b82f6" stroke-width="2.5"/><path d="M650,120 Q400,38 150,120" fill="none" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="5 4"/><text x="400" y="65" text-anchor="middle" fill="#fbbf24" font-family="JetBrains Mono, monospace" font-size="11">CONCEPT FLOW &amp; REINFORCEMENT LOOP</text><g transform="translate(65, 125)"><rect width="170" height="90" rx="12" fill="rgba(9, 20, 36, 0.9)" stroke="#06b6d4" stroke-width="2"/><text x="85" y="28" text-anchor="middle" fill="#06b6d4" font-size="10.5" font-weight="700">01 • CONCEPT</text><text x="85" y="55" text-anchor="middle" fill="#eef6ff" font-size="12.5" font-weight="600">${escapeHtml(n1)}</text></g><g transform="translate(315, 125)"><rect width="170" height="90" rx="12" fill="rgba(9, 20, 36, 0.9)" stroke="#3b82f6" stroke-width="2"/><text x="85" y="28" text-anchor="middle" fill="#3b82f6" font-size="10.5" font-weight="700">02 • MECHANISM</text><text x="85" y="55" text-anchor="middle" fill="#eef6ff" font-size="12.5" font-weight="600">${escapeHtml(n2)}</text></g><g transform="translate(565, 125)"><rect width="170" height="90" rx="12" fill="rgba(9, 20, 36, 0.9)" stroke="#10b981" stroke-width="2"/><text x="85" y="28" text-anchor="middle" fill="#10b981" font-size="10.5" font-weight="700">03 • OUTCOME</text><text x="85" y="55" text-anchor="middle" fill="#eef6ff" font-size="12.5" font-weight="600">${escapeHtml(n3)}</text></g></svg>`;
}

const TRENDING_BOOKS_CATALOG = [
  { title: "Atomic Habits", author: "James Clear", year: "2018", category: "Behavioral Psychology", tags: ["habits", "behavioral", "psychology", "productivity", "systems"], coverUrl: "https://covers.openlibrary.org/b/id/10521270-L.jpg" },
  { title: "Sapiens", author: "Yuval Noah Harari", year: "2011", category: "History & Anthropology", tags: ["history", "anthropology", "human", "civilization", "science"], coverUrl: "https://covers.openlibrary.org/b/id/8375046-L.jpg" },
  { title: "The Psychology of Money", author: "Morgan Housel", year: "2020", category: "Finance & Behavior", tags: ["finance", "money", "behavior", "psychology", "investing"], coverUrl: "https://covers.openlibrary.org/b/id/10604642-L.jpg" },
  { title: "Dune", author: "Frank Herbert", year: "1965", category: "Science Fiction", tags: ["science", "fiction", "fantasy", "adventure", "politics"], coverUrl: "https://covers.openlibrary.org/b/id/12627392-L.jpg" },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", year: "2011", category: "Psychology & Decision Science", tags: ["psychology", "decision", "science", "behavior", "thinking"], coverUrl: "https://covers.openlibrary.org/b/id/8231990-L.jpg" },
  { title: "The Alchemist", author: "Paulo Coelho", year: "1988", category: "Philosophy & Fiction", tags: ["philosophy", "fiction", "journey", "meaning", "inspiration"], coverUrl: "https://covers.openlibrary.org/b/id/12547191-L.jpg" },
  { title: "Deep Work", author: "Cal Newport", year: "2016", category: "Productivity & Focus", tags: ["productivity", "focus", "work", "habits", "attention"], coverUrl: "https://covers.openlibrary.org/b/id/8228691-L.jpg" },
  { title: "Meditations", author: "Marcus Aurelius", year: "180", category: "Philosophy & Stoicism", tags: ["philosophy", "stoicism", "history", "mindfulness", "meaning"], coverUrl: "https://covers.openlibrary.org/b/id/12860354-L.jpg" },
  { title: "1984", author: "George Orwell", year: "1949", category: "Classic Fiction", tags: ["fiction", "classic", "politics", "dystopia", "society"], coverUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg" },
  { title: "Zero to One", author: "Peter Thiel", year: "2014", category: "Startups & Innovation", tags: ["startups", "innovation", "business", "technology", "entrepreneurship"], coverUrl: "https://covers.openlibrary.org/b/id/8259443-L.jpg" }
];

function getPersonalizedCatalog() {
  const stopWords = new Set(["about", "after", "also", "book", "from", "into", "that", "their", "them", "there", "these", "this", "with"]);
  const interests = new Set();
  getUserBookshelf().forEach(book => {
    const topics = (book.chapters || []).flatMap(chapter => chapter.topicsCovered || []);
    `${book.title || ""} ${book.author || ""} ${book.category || ""} ${topics.join(" ")}`.toLowerCase()
      .match(/[a-z0-9]{3,}/g)?.forEach(word => {
        if (!stopWords.has(word)) interests.add(word);
      });
  });

  return TRENDING_BOOKS_CATALOG.map((book, index) => {
    const terms = `${book.title} ${book.author} ${book.category} ${book.tags.join(" ")}`.toLowerCase()
      .match(/[a-z0-9]{3,}/g) || [];
    const score = terms.reduce((total, term) => total + (interests.has(term) ? 1 : 0), 0);
    return { ...book, isForYou: score > 0, score, index };
  }).sort((a, b) => b.score - a.score || a.index - b.index);
}

function renderBookCoverCarousel() {
  const catalog = getPersonalizedCatalog();
  const buildCard = (book, index) => `
    <button class="carousel-book-card" type="button" onclick="selectCarouselBook(${index})" aria-label="Open ${escapeHtml(book.title)} by ${escapeHtml(book.author)}">
      <span class="carousel-badge">${book.isForYou ? "✨ For You" : "🔥 Trending"}</span>
      <img class="carousel-cover" src="${escapeHtml(book.coverUrl)}" data-fallback-src="${escapeHtml(book.fallbackCoverUrl || "")}" alt="Cover of ${escapeHtml(book.title)}" onerror="if(this.dataset.fallbackSrc){this.src=this.dataset.fallbackSrc;this.dataset.fallbackSrc=''}else{this.hidden=true;this.nextElementSibling.hidden=false}" />
      <span class="carousel-cover-placeholder" hidden aria-hidden="true">📘</span>
      <span class="carousel-book-title">${escapeHtml(book.title)}</span>
      <span class="carousel-book-author">${escapeHtml(book.author)}</span>
    </button>`;
  const cardsHtml = catalog.map(buildCard).join("");
  return `
    <div class="book-carousel-wrap" role="region" aria-label="Book recommendations">
      <div class="carousel-header-label">
        <span>📚 Popular Around the World · Picked For You</span>
        <span class="carousel-hint">Hover or focus to pause · Select a cover to open</span>
      </div>
      <div class="carousel-marquee">
        <div class="carousel-track">${cardsHtml}</div>
        <div class="carousel-track" aria-hidden="true" inert>${cardsHtml}</div>
      </div>
    </div>`;
}

function renderTopTrendingCarousel() {
  const host = document.getElementById("trendingCarouselSection");
  if (host) host.innerHTML = renderBookCoverCarousel();
}

const WAITING_FAMOUS_COVERS = [
  { title: "Hogsmeade & Hogwarts", author: "Wizarding World", coverUrl: "assets/covers/hogwarts-hogsmeade.png", localCover: true, imageAlt: "Hogsmeade and Hogwarts signs inside a warmly lit prop shop.", bg: "radial-gradient(circle at 30% 20%, #7c2d12 0%, #1e1b4b 55%, #090d16 100%)" },
  { title: "Hogwarts Great Hall", author: "Wizarding World", coverUrl: "assets/covers/hogwarts-great-hall.png", localCover: true, imageAlt: "A grand stone hall with vaulted beams and sunlit windows.", bg: "radial-gradient(circle at 50% 25%, #b08a50 0%, #40321f 55%, #090d16 100%)" },
  { title: "The Winds of Winter", author: "George R. R. Martin", coverUrl: "assets/covers/winds-of-winter.png", localCover: true, imageAlt: "The Winds of Winter title against a snowy forest.", bg: "radial-gradient(circle at 50% 25%, #38bdf8 0%, #1e3a5f 40%, #090d16 100%)" },
  { title: "The Complete Sherlock Holmes", author: "Arthur Conan Doyle", coverUrl: "assets/covers/complete-sherlock-holmes.png", localCover: true, imageFit: "contain", imageAlt: "The Complete Sherlock Holmes cover with a teal 221B Baker Street doorway.", bg: "radial-gradient(circle at 50% 25%, #0f766e 0%, #134e4a 50%, #090d16 100%)" }
];
const googleBooksCoverRequests = new Map();
let waitingCoverIndex = 0;
let waitingCoverTimer = null;

function getBestGoogleBookCover(imageLinks) {
  const imageUrl = imageLinks && (imageLinks.extraLarge || imageLinks.large || imageLinks.medium || imageLinks.small || imageLinks.thumbnail || imageLinks.smallThumbnail);
  if (!imageUrl) return "";
  try {
    const url = new URL(imageUrl);
    url.protocol = "https:";
    url.searchParams.set("zoom", "3");
    return url.href;
  } catch (error) {
    console.warn("Google Books returned an invalid cover URL.", error);
    return "";
  }
}

async function fetchGoogleBookCover(book) {
  const cacheKey = normalizeStr(`${book.title} ${book.author}`);
  if (googleBooksCoverRequests.has(cacheKey)) return googleBooksCoverRequests.get(cacheKey);
  const request = (async () => {
    try {
      const query = `intitle:"${book.title}" inauthor:"${book.author}"`;
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5&printType=books`);
      if (!response.ok) return { error: new Error(`Google Books returned ${response.status}`), status: response.status };
      const data = await response.json();
      const targetTitle = normalizeStr(book.title);
      const match = (data.items || []).find(volume => normalizeStr(volume.volumeInfo?.title).includes(targetTitle));
      return { coverUrl: match ? getBestGoogleBookCover(match.volumeInfo?.imageLinks) : "" };
    } catch (error) {
      return { error, status: 0 };
    }
  })();
  googleBooksCoverRequests.set(cacheKey, request);
  return request;
}

async function loadGoogleBookCovers() {
  const booksByTitle = new Map();
  [...TRENDING_BOOKS_CATALOG, ...WAITING_FAMOUS_COVERS].forEach(book => {
    if (!book.coverUrl || book.localCover) return;
    const key = normalizeStr(`${book.title} ${book.author}`);
    if (!booksByTitle.has(key)) booksByTitle.set(key, []);
    booksByTitle.get(key).push(book);
  });
  const books = Array.from(booksByTitle.values());
  let trendingUpdated = false, waitingUpdated = false;
  for (let index = 0; index < books.length; index += 3) {
    const results = await Promise.all(books.slice(index, index + 3).map(async group => ({
      group,
      result: await fetchGoogleBookCover(group[0])
    })));
    const failures = results.filter(entry => entry.result.error);
    results.forEach(({ group, result }) => {
      if (!result.coverUrl) return;
      group.forEach(book => {
        if (!book.fallbackCoverUrl) book.fallbackCoverUrl = book.coverUrl;
        book.coverUrl = result.coverUrl;
        if (TRENDING_BOOKS_CATALOG.includes(book)) trendingUpdated = true;
        if (WAITING_FAMOUS_COVERS.includes(book)) waitingUpdated = true;
      });
    });
    if (failures.length) {
      const rateLimited = failures.some(entry => entry.result.status === 429);
      console.warn(
        rateLimited
          ? "Google Books cover requests were rate limited; keeping the bundled cover fallbacks."
          : "Some Google Books cover requests failed; keeping the bundled cover fallbacks.",
        failures[0].result.error
      );
      break;
    }
  }
  if (trendingUpdated) renderTopTrendingCarousel();
  if (waitingUpdated && WAITING_FAMOUS_COVERS[waitingCoverIndex].coverUrl) renderWaitingCoverBox();
}

function renderWaitingCoverBox() {
  const stage = document.querySelector(".visual-stage");
  if (!stage) return;
  const item = WAITING_FAMOUS_COVERS[waitingCoverIndex];
  let box = stage.querySelector(".waiting-cover-box");
  if (!box) {
    box = document.createElement("div");
    box.className = "waiting-cover-box";
    stage.appendChild(box);
  }
  box.setAttribute("role", "img");
  box.setAttribute("aria-label", `Featured artwork: ${item.title} by ${item.author}`);
  const imageFitClass = item.imageFit === "contain" ? " waiting-cover-img-contain" : "";
  const image = item.coverUrl
    ? `<img class="waiting-cover-img${imageFitClass}" src="${escapeHtml(item.coverUrl)}" data-fallback-src="${escapeHtml(item.fallbackCoverUrl || "")}" alt="${escapeHtml(item.imageAlt || `${item.title} cover`)}" onload="this.classList.add('is-loaded')" onerror="if(this.dataset.fallbackSrc){this.src=this.dataset.fallbackSrc;this.dataset.fallbackSrc=''}else{this.hidden=true}" />`
    : "";
  box.innerHTML = `
    <div class="waiting-cover-fallback" style="background: ${item.bg};">
      <span class="wc-eyebrow">Featured Book</span>
      <strong class="wc-title">${escapeHtml(item.title)}</strong>
      <span class="wc-author">by ${escapeHtml(item.author)}</span>
    </div>
    ${image}
    <div class="waiting-cover-overlay">
      <div class="waiting-cover-meta">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.author)}</span>
      </div>
      <span class="waiting-cover-pill">Preparing chapter visual…</span>
    </div>`;
}

function startWaitingCoverSlideshow() {
  renderWaitingCoverBox();
  if (waitingCoverTimer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  waitingCoverTimer = setInterval(() => {
    waitingCoverIndex = (waitingCoverIndex + 1) % WAITING_FAMOUS_COVERS.length;
    renderWaitingCoverBox();
  }, 10000);
}

function stopWaitingCoverSlideshow() {
  if (waitingCoverTimer) {
    clearInterval(waitingCoverTimer);
    waitingCoverTimer = null;
  }
  document.querySelector(".waiting-cover-box")?.remove();
}

function loadChapterVisuals(ch) {
  renderProceduralCanvasArt(document.getElementById("procVisualCanvas"), ch, currentMode);
  const aiSvg = currentMode === "story" ? ch.storySvg : ch.studySvg;
  const container = document.getElementById("svgVisualContainer");
  container.innerHTML = aiSvg ? aiSvg : buildChapterSvgOverlay(ch, currentMode);
  if (aiSvg) {
    stopWaitingCoverSlideshow();
    document.getElementById("visualStatusPill").textContent = "✨ AI-Crafted SVG Visual";
  } else if (ch.aiGenerationFailed) {
    stopWaitingCoverSlideshow();
    document.getElementById("visualStatusPill").textContent = "✨ Smart Local Visual";
  } else {
    startWaitingCoverSlideshow();
    document.getElementById("visualStatusPill").textContent = "📚 Waiting for chapter visual";
  }
}

function selectCarouselBook(index) {
  const book = getPersonalizedCatalog()[index];
  if (!book) return;
  activeBook = normalizeStr(book.title).includes("atomic habits")
    ? BOOK_LIBRARY["atomic-habits"]
    : synthesizeBookPackage({
      ...book,
      description: `An interactive exploration of ${book.title} by ${book.author} (${book.category}).`
    });
  activeChapterIdx = 0;
  saveBookToUserShelf(activeBook);
  renderBookWorkspace();
  stopAllAudio();
  showToast(`📚 Opened "${activeBook.title}"`);
  if (chapterNeedsAI(activeBook.chapters[0])) generateChapterWithAI(activeBook.chapters[0]);
}

function toggleVisualFrame() {
  const frame = document.querySelector(".visual-frame"), btn = document.getElementById("toggleVisBtn");
  if (!frame) return;
  const hidden = frame.classList.toggle("hidden");
  if (btn) btn.textContent = hidden ? "👁️ Show Visual" : "🙈 Hide Visual";
}

/* ==========================================================================
   4. SEARCH & BOOK UPLOAD
   ========================================================================== */
function normalizeStr(s) { return (s || "").toLowerCase().replace(/[^a-z0-9\s]/g, "").trim(); }

function computeMatchCertainty(query, topCandidate) {
  const q = normalizeStr(query), t = normalizeStr(topCandidate.title), a = normalizeStr(topCandidate.author);
  if (!q || !t) return 50;
  if (t === q || (`${t} ${a}`.includes(q) && q.split(" ").length >= 2)) return 94;
  if (t.startsWith(q) && q.length >= 8) return 88;
  const qTokens = q.split(/\s+/).filter(Boolean), tTokens = new Set([...t.split(/\s+/), ...a.split(/\s+/)]);
  let hits = 0; qTokens.forEach(tok => { if (tTokens.has(tok)) hits++; });
  if (qTokens.length === 1 && q.length <= 10 && t !== q) return 62;
  return Math.min(96, Math.max(48, Math.round((hits / Math.max(1, qTokens.length)) * 85 + (qTokens.length > 2 ? 10 : -5))));
}

async function searchInternetBooks() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;
  const btn = document.getElementById("searchBtn");
  btn.textContent = "⏳ Searching..."; btn.disabled = true; forceTopCount = null;
  try {
    const [gbData, olData] = await Promise.all([
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=8`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8`).then(r => r.ok ? r.json() : null).catch(() => null)
    ]);
    const candidates = [], seenTitles = new Set();
    if (gbData?.items) {
      gbData.items.forEach(item => {
        const info = item.volumeInfo || {}, title = info.title || "Untitled Book", key = normalizeStr(title);
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          candidates.push({ id: item.id, title, author: info.authors?.[0] || "Unknown Author", year: (info.publishedDate || "2020").slice(0, 4), category: info.categories?.[0] || "Non-Fiction & Literature", description: stripDryMetadata(info.description || ""), coverUrl: getBestGoogleBookCover(info.imageLinks) });
        }
      });
    }
    if (olData?.docs) {
      olData.docs.forEach(doc => {
        const title = doc.title || "Untitled", key = normalizeStr(title);
        if (!seenTitles.has(key) && candidates.length < 8) {
          seenTitles.add(key);
          candidates.push({ id: doc.key || key, title, author: doc.author_name?.[0] || "Unknown Author", year: String(doc.first_publish_year || "2019"), category: doc.subject?.[0] || "Literature & Knowledge", description: stripDryMetadata(doc.first_sentence ? (Array.isArray(doc.first_sentence) ? doc.first_sentence[0] : doc.first_sentence) : ""), coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : "" });
        }
      });
    }
    if (!candidates.length) candidates.push({ id: "custom-" + Date.now(), title: query, author: "Global Archive", year: "2024", category: "Universal Synthesis", description: `Comprehensive exploration of ${query}.`, coverUrl: "" });
    lastSearchCandidates = candidates.slice(0, 5);
    lastCertaintyScore = computeMatchCertainty(query, lastSearchCandidates[0]);
    renderSearchResults();
  } finally { btn.textContent = "🔍 Search Internet"; btn.disabled = false; }
}

function quickSearch(q) { document.getElementById("searchInput").value = q; searchInternetBooks(); }
function toggleTopCountOverride() { forceTopCount = getEffectiveResultCount() === 3 ? 5 : 3; renderSearchResults(); }
function getEffectiveResultCount() { return forceTopCount ? forceTopCount : (lastCertaintyScore >= 80 ? 3 : 5); }

function renderSearchResults() {
  const drawer = document.getElementById("searchResultsDrawer"), badge = document.getElementById("certaintyBadge"), grid = document.getElementById("resultsGrid");
  drawer.classList.remove("hidden");
  const countToShow = getEffectiveResultCount();
  badge.className = (lastCertaintyScore >= 80 && countToShow === 3) ? "cert-badge cert-high" : "cert-badge cert-broad";
  badge.textContent = (lastCertaintyScore >= 80 && countToShow === 3) ? `🎯 High Certainty Match (${lastCertaintyScore}%) — Top 3 Selected` : `🧭 Broad Query (${lastCertaintyScore}% Certainty) — Top ${countToShow} Results`;
  grid.innerHTML = lastSearchCandidates.slice(0, countToShow).map((cand, idx) => {
    const coverHtml = cand.coverUrl ? `<img src="${cand.coverUrl}" class="result-cover" alt="Cover" onerror="this.outerHTML='<div class=\\'result-cover\\'>📘</div>'" />` : `<div class="result-cover">📘</div>`;
    return `<div class="result-card ${idx === 0 ? 'active' : ''}" onclick="selectSearchedBook(${idx})">${coverHtml}<div class="result-meta"><div class="result-rank">Match #${idx + 1} • ${Math.max(65, lastCertaintyScore - idx * 5)}%</div><div class="result-title">${escapeHtml(cand.title)}</div><div class="result-author">${escapeHtml(cand.author)} (${cand.year})</div><span class="match-pill">${escapeHtml(cand.category.slice(0, 26))}</span></div></div>`;
  }).join("");
}

function selectSearchedBook(idx) {
  const cand = lastSearchCandidates[idx]; if (!cand) return;
  activeBook = normalizeStr(cand.title).includes("atomic habits") ? BOOK_LIBRARY["atomic-habits"] : synthesizeBookPackage(cand);
  activeChapterIdx = 0; saveBookToUserShelf(activeBook); renderBookWorkspace(); stopAllAudio(); showToast(`Loaded "${activeBook.title}"`);
  if (chapterNeedsAI(activeBook.chapters[0])) generateChapterWithAI(activeBook.chapters[0]);
}

function extractKeyTermsFromText(text) {
  const words = (text || "").match(/\b[A-Z][a-z]{3,}(?:\s+[A-Z][a-z]{3,})?\b/g) || [];
  const freq = {}, stop = new Set(["Chapter", "Section", "Week", "Topic", "Module", "These", "There", "Their", "Where", "Which", "While", "About", "After", "Before", "Through"]);
  words.forEach(w => { if (!stop.has(w)) freq[w] = (freq[w] || 0) + 1; });
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
  while (top.length < 3) top.push(["Core Framework", "Causal Mechanism", "Synthesis Principle"][top.length]);
  return top;
}

function synthesizeBookPackage(meta, rawChapters = null) {
  const title = meta.title || "Selected Book", author = meta.author || "Distinguished Author", category = meta.category || "Interdisciplinary Mastery";
  const desc = stripDryMetadata(meta.description) || `An exploration of ${title} by ${author}.`;
  const chapters = (rawChapters && rawChapters.length > 0) ? rawChapters : [
    { heading: `The Catalyst & Core Premise of ${title}`, excerpt: desc.slice(0, 420) },
    { heading: `Hidden Architecture & Forces at Play`, excerpt: `Beneath the surface events of ${title}, ${author} reveals the invisible feedback loops and drivers.` },
    { heading: `The Crucible: Turning Theory Into Action`, excerpt: `When principles are tested under real-world pressure, only resilient mental models survive.` },
    { heading: `Synthesis, Legacy & Mastery`, excerpt: `In the culmination of ${title}, individual threads unite into a lasting philosophy.` }
  ];

  const builtChapters = chapters.slice(0, 6).map((ch, i) => {
    const chNum = i + 1, cleanExcerpt = stripDryMetadata(ch.excerpt), cleanHeading = stripDryMetadata(ch.heading) || `Chapter ${chNum}`;
    const sentences = cleanExcerpt.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 20);
    const lead = sentences[0] || cleanExcerpt.slice(0, 220), next = sentences[1] || `Connecting these ideas reveals the bigger picture of ${title}.`;
    const terms = extractKeyTermsFromText(cleanExcerpt);
    return {
      number: chNum, title: cleanHeading, rawExcerpt: cleanExcerpt, aiEnhanced: false,
      storyVisualCaption: `Story Scene (Ch. ${chNum}): Visual narrative of ${cleanHeading}.`,
      studyVisualCaption: `Study Schematic (Ch. ${chNum}): Analytical architecture for ${cleanHeading}.`,
      storyNarrative: [`Imagine stepping into ${title}, where ${terms[0]} sets this chapter in motion.`, lead, next, `Together, ${terms[0]} and ${terms[1]} illuminate the core lesson.`],
      studyNarrative: [`Core Thesis (Ch. ${chNum}): Examines ${terms[0]} and ${terms[1]} in ${category}.`, lead, next, `Analytical Takeaway: Focus on how ${terms[0]} drives measurable outcomes.`],
      storyMoral: `Like an archstone holding a bridge aloft, ${terms[0]} carries the weight of this chapter.`,
      studyTakeaway: `Master the structural relationship between ${terms[0]} and ${terms[1]}.`,
      storyCharacters: [`${terms[0]} (Central Idea)`, `${terms[1]} (Catalyst)`],
      storyNextBridge: `This insight prepares us for the next step in ${title}.`,
      chapterSummary: `${cleanHeading} explores how ${terms[0]} and ${terms[1]} operate together inside ${title}.`,
      pointsToRemember: [lead.slice(0, 120), `Focus on the interplay between ${terms[0]} and ${terms[1]}.`, `Apply these principles to concrete real-world examples.`],
      topicsCovered: terms,
      definitions: terms.map((term, tIdx) => ({ term, cat: ["Key Concept", "Core Mechanism", "Study Pillar"][tIdx], def: `Central principle from Ch. ${chNum} of ${title} governing ${term}.`, ex: `Applying ${term} in ${cleanHeading}.` })),
      graphData: { lineLabels: ["P1", "P2", "P3", "P4", "P5", "P6"], primarySeries: [18 + i * 3, 34, 52, 71, 85, 95], secondarySeries: [25, 32, 40, 48, 55, 62], primaryLabel: "Mastery", secondaryLabel: "Baseline", barLabels: ["Depth", "Utility", "Rigor", "Retention"], barValues: [88, 92, 86, 94] },
      quiz: [{ q: `Which key concept anchors Ch. ${chNum} (${cleanHeading})?`, options: [`${terms[0]} and ${terms[1]}`, `Ignoring systemic loops`, `Memorizing headers`], answer: 0, explanation: `${terms[0]} is the central mechanism discussed in this section.` }]
    };
  });

  return {
    title, author, year: meta.year || "2024", category, coverEmoji: "📚", coverUrl: meta.coverUrl || "",
    summaryIntro: `The complete overarching story of ${title} by ${author}, woven into a four-act narrative.`,
    storyActs: [
      { act: "Act I: The Spark", title: `The World Before ${title}`, story: `Our story begins with a puzzle in ${category}. ${desc.slice(0, 200)}` },
      { act: "Act II: The Hidden Machinery", title: "Unveiling Unseen Patterns", story: `What looked like random chance reveals an intricate web of cause and effect.` },
      { act: "Act III: The Crucible", title: "Testing Wisdom in Action", story: `Armed with new eyes, the protagonist applies the core principles under pressure.` },
      { act: "Act IV: The Legacy", title: `Living ${title}`, story: `The journey comes full circle with a timeless compass for ${category}.` }
    ],
    chapters: builtChapters
  };
}

async function handleBookUpload(event) {
  const file = event.target.files[0]; if (!file) return;
  showToast(`Dividing "${file.name}" into chapters...`);
  const ext = file.name.split(".").pop().toLowerCase();
  let rawText = "";
  if (ext === "pdf" && window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    for (let p = 1; p <= Math.min(pdf.numPages, 30); p++) {
      const page = await pdf.getPage(p), content = await page.getTextContent();
      const pageStr = content.items.map(it => it.str).join(" ");
      if (!/table of contents|all rights reserved|isbn/i.test(pageStr.slice(0, 220))) rawText += pageStr + "\n\n";
    }
  } else rawText = await file.text();

  const cleanText = stripDryMetadata(rawText), cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
  const sentences = cleanText.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 25);
  const chunkCount = Math.min(5, Math.max(3, Math.ceil(sentences.length / 6))), perChunk = Math.max(2, Math.ceil(sentences.length / chunkCount));
  const extractedChapters = [];
  for (let i = 0; i < chunkCount; i++) {
    const slice = sentences.slice(i * perChunk, (i + 1) * perChunk).join(" ");
    if (!slice) continue;
    const terms = extractKeyTermsFromText(slice);
    extractedChapters.push({ heading: `${terms[0]} & ${terms[1]}`, excerpt: slice.slice(0, 1800) });
  }
  activeBook = synthesizeBookPackage({ title: cleanTitle, author: "Uploaded Book Edition", year: new Date().getFullYear().toString(), category: `Uploaded (${ext.toUpperCase()})`, description: cleanText.slice(0, 320) }, extractedChapters);
  activeChapterIdx = 0; saveBookToUserShelf(activeBook); renderBookWorkspace(); stopAllAudio(); generateChapterWithAI(activeBook.chapters[0]);
}

/* ==========================================================================
   5. GRAPHS, WORKSPACE, PROGRESS, QUIZ & AUDIO
   ========================================================================== */
function drawStudyGraphs(chapter) {
  const g = chapter.graphData; if (!g) return;
  const dpr = window.devicePixelRatio || 1;
  const c1 = document.getElementById("studyChart1");
  if (c1) {
    const w = c1.parentElement.clientWidth || 380, h = 230; c1.width = w * dpr; c1.height = h * dpr;
    const ctx = c1.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    const padL = 36, padR = 18, padT = 30, padB = 34, plotW = w - padL - padR, plotH = h - padT - padB;
    const accent = currentMode === "study" ? "#06b6d4" : "#f59e0b";
    ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { const y = padT + (plotH * i) / 4; ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke(); ctx.fillStyle = "#64748b"; ctx.font = "10px sans-serif"; ctx.textAlign = "right"; ctx.fillText(`${100 - i * 25}%`, padL - 6, y + 3); }
    ctx.strokeStyle = "#94a3b8"; ctx.setLineDash([5, 4]); ctx.lineWidth = 2; ctx.beginPath();
    g.secondarySeries.forEach((val, idx) => { const x = padL + (plotW * idx) / (g.secondarySeries.length - 1), y = padT + plotH - (val / 100) * plotH; if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = accent; ctx.lineWidth = 3; ctx.beginPath();
    g.primarySeries.forEach((val, idx) => { const x = padL + (plotW * idx) / (g.primarySeries.length - 1), y = padT + plotH - (val / 100) * plotH; if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke();
    g.lineLabels.forEach((lbl, idx) => { const x = padL + (plotW * idx) / (g.lineLabels.length - 1), y = padT + plotH - (g.primarySeries[idx] / 100) * plotH; ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#94a3b8"; ctx.font = "10.5px sans-serif"; ctx.textAlign = "center"; ctx.fillText(lbl, x, h - 10); });
    ctx.font = "10.5px sans-serif"; ctx.textAlign = "left"; ctx.fillStyle = accent; ctx.fillText(`● ${g.primaryLabel || "Primary"}`, padL, 14); ctx.fillStyle = "#94a3b8"; ctx.fillText(`--- ${g.secondaryLabel || "Baseline"}`, padL + 135, 14);
  }
  const c2 = document.getElementById("studyChart2");
  if (c2) {
    const w = c2.parentElement.clientWidth || 380, h = 230; c2.width = w * dpr; c2.height = h * dpr;
    const ctx = c2.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    const rowH = (h - 20) / g.barLabels.length;
    g.barLabels.forEach((lbl, idx) => {
      const val = g.barValues[idx], y = 14 + idx * rowH;
      ctx.fillStyle = "#e2e8f0"; ctx.font = "12px sans-serif"; ctx.textAlign = "left"; ctx.fillText(`${lbl} (${val}%)`, 10, y + 14);
      ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(10, y + 21, w - 24, 12);
      const grad = ctx.createLinearGradient(10, 0, w - 24, 0);
      if (currentMode === "study") { grad.addColorStop(0, "#06b6d4"); grad.addColorStop(1, "#3b82f6"); } else { grad.addColorStop(0, "#f59e0b"); grad.addColorStop(1, "#ec4899"); }
      ctx.fillStyle = grad; ctx.fillRect(10, y + 21, ((w - 24) * val) / 100, 12);
    });
  }
}

function setAppMode(mode) {
  currentMode = mode;
  document.body.classList.toggle("mode-study", mode === "study");
  document.getElementById("btnStoryMode").classList.toggle("active", mode === "story");
  document.getElementById("btnStudyMode").classList.toggle("active", mode === "study");
  document.getElementById("brandIcon").textContent = mode === "story" ? "📖" : "📐";
  document.getElementById("modeSubtitle").textContent = mode === "story" ? "Story Mode • Narrative Immersion & Visual Storytelling" : "Study Mode • Cheat Sheets, Definitions, Quizzes & Graphs";
  document.getElementById("audioModeLabel").textContent = mode === "story" ? "Warm Storyteller Voice + Cinematic Pad" : "Crisp Academic Voice + 40Hz Study Focus Tune";
  renderChapterContent();
  if (isSpeaking) startAmbientSoundscape();
}

function switchStageTab(tab) {
  activeStageTab = tab;
  ["lesson", "summary", "quiz", "notes"].forEach(t => {
    document.getElementById("tab" + t.charAt(0).toUpperCase() + t.slice(1)).classList.toggle("active", tab === t);
    document.getElementById("view" + t.charAt(0).toUpperCase() + t.slice(1)).classList.toggle("hidden", tab !== t);
  });
  if (tab === "lesson") renderChapterContent();
  if (tab === "summary") renderBookStorySummary();
  if (tab === "quiz") renderChapterQuiz();
  if (tab === "notes") renderNotesTab();
}

function toggleChapterComplete(idx) {
  const key = `${activeBook.title}-ch-${idx + 1}`;
  if (completedChapters.has(key)) completedChapters.delete(key); else completedChapters.add(key);
  renderBookWorkspace();
}

function renderBookWorkspace() {
  document.getElementById("activeBookTitle").textContent = activeBook.title;
  document.getElementById("activeBookAuthor").textContent = `by ${activeBook.author}`;
  document.getElementById("activeBookCategory").textContent = `${activeBook.category} • ${activeBook.year}`;
  const coverEl = document.getElementById("activeBookCover");
  coverEl.innerHTML = activeBook.coverUrl ? `<img src="${activeBook.coverUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:9px;" onerror="this.parentElement.textContent='📘'" />` : (activeBook.coverEmoji || "📘");

  const totalCh = activeBook.chapters.length;
  const doneCh = activeBook.chapters.filter((_, i) => completedChapters.has(`${activeBook.title}-ch-${i + 1}`)).length;
  document.getElementById("bookProgressText").textContent = `${doneCh}/${totalCh} Completed`;
  document.getElementById("bookProgressFill").style.width = `${Math.round((doneCh / Math.max(1, totalCh)) * 100)}%`;
  document.getElementById("chapterCountLabel").textContent = `${totalCh} Lessons`;

  document.getElementById("chapterList").innerHTML = activeBook.chapters.map((ch, idx) => {
    const isDone = completedChapters.has(`${activeBook.title}-ch-${idx + 1}`);
    return `<button class="chapter-item ${idx === activeChapterIdx ? 'active' : ''}" onclick="selectChapter(${idx})"><div style="display:flex;align-items:center;gap:0.6rem;"><span class="ch-badge">${ch.number}</span><span style="line-height: 1.3;">${escapeHtml(ch.title)}</span></div><span>${isDone ? '✅' : ''}</span></button>`;
  }).join("");
  renderChapterContent(); renderBookStorySummary(); renderChapterQuiz(); renderNotesTab();
}

function selectChapter(idx) {
  activeChapterIdx = idx; switchStageTab("lesson"); renderBookWorkspace(); stopAllAudio();
  const ch = activeBook.chapters[idx];
  if (ch && chapterNeedsAI(ch)) generateChapterWithAI(ch);
}

function regenerateVisualScene() { visualSeed = Math.floor(Math.random() * 9000) + 100; renderChapterContent(); }

function renderChapterContent() {
  const ch = activeBook.chapters[activeChapterIdx] || activeBook.chapters[0]; if (!ch) return;
  const isStory = currentMode === "story";
  document.getElementById("lessonEyebrow").textContent = `CHAPTER ${ch.number} • ${isStory ? "STORY IMMERSION MODE" : "STUDY & ANALYTICAL MODE"}`;
  document.getElementById("lessonTitle").textContent = ch.title;
  const isDone = completedChapters.has(`${activeBook.title}-ch-${activeChapterIdx + 1}`);
  document.getElementById("completeChBtn").textContent = isDone ? "✅ Completed" : "☑️ Mark Complete";

  loadChapterVisuals(ch);
  document.getElementById("visualCaption").textContent = isStory ? ch.storyVisualCaption : ch.studyVisualCaption;

  const sentences = isStory ? ch.storyNarrative : ch.studyNarrative;
  document.getElementById("lessonNarrativeBox").innerHTML = sentences.map((s, idx) => `
    <span class="sent-wrap">
      <span class="sent" id="sent-${idx}" onclick="speakFromSentence(${idx})">${escapeHtml(s)}</span>
      <button class="btn btn-sm" style="padding:0.08rem 0.38rem;font-size:0.68rem;margin:0 4px 0 1px;opacity:0.65;" title="Save to Notes" onclick="saveSentenceNote(${idx})">📌</button>
    </span>`).join("");

  document.getElementById("calloutHeading").textContent = isStory ? "✨ Core Story Moral & Metaphor" : "📐 Key Analytical Takeaway & Mental Model";
  document.getElementById("calloutBody").textContent = isStory ? ch.storyMoral : ch.studyTakeaway;

  // Toggle Mode-Specific Enrichment Blocks
  document.getElementById("storyEnrichmentBlock").classList.toggle("hidden", !isStory);
  document.getElementById("studyEnrichmentBlock").classList.toggle("hidden", isStory);

  if (isStory) {
    document.getElementById("storyCharactersList").innerHTML = (ch.storyCharacters || ["Central Theme"]).map(c => `<li>${escapeHtml(c)}</li>`).join("");
    document.getElementById("storyNextBridgeText").textContent = ch.storyNextBridge || "Continue to the next chapter to see how this insight evolves.";
  } else {
    document.getElementById("studyChapterSummary").textContent = ch.chapterSummary || ch.studyTakeaway;
    document.getElementById("studyTopicsPills").innerHTML = (ch.topicsCovered || ["Core Concept"]).map(t => `<span class="topic-pill">${escapeHtml(t)}</span>`).join("");
    document.getElementById("studyPointsList").innerHTML = (ch.pointsToRemember || ch.studyNarrative).map(p => `<li>${escapeHtml(p)}</li>`).join("");
  }

  const defs = ch.definitions || [];
  document.getElementById("definitionsGrid").innerHTML = defs.map((d) => {
    const key = `${activeBook.title}-${ch.number}-${d.term}`, isMastered = masteredDefs.has(key);
    return `<div class="def-card ${isMastered ? 'mastered' : ''}" onclick="this.querySelector('.def-answer').classList.toggle('hidden')"><div><div class="def-term"><span>${escapeHtml(d.term)}</span><span class="match-pill">${escapeHtml(d.cat)}</span></div><div class="def-answer"><div class="def-body">${escapeHtml(d.def)}</div><div class="def-ex">Example: ${escapeHtml(d.ex)}</div></div></div><div style="margin-top:0.65rem;display:flex;justify-content:space-between;align-items:center;"><span style="font-size:0.7rem;color:var(--text-muted);">Click to flip</span><button class="btn btn-sm" onclick="event.stopPropagation();toggleMastered('${escapeHtml(key)}')">${isMastered ? '✅ Mastered' : 'Mark Mastered'}</button></div></div>`;
  }).join("");
  updateMasteryProgress(defs, ch.number);
  setTimeout(() => drawStudyGraphs(ch), 60);
  document.getElementById("audioTrackName").textContent = `Ch. ${ch.number}: ${ch.title}`;
}

function toggleMastered(key) { if (masteredDefs.has(key)) masteredDefs.delete(key); else masteredDefs.add(key); renderChapterContent(); }
function updateMasteryProgress(defs, chNum) {
  const total = Math.max(1, defs.length), done = defs.filter(d => masteredDefs.has(`${activeBook.title}-${chNum}-${d.term}`)).length;
  document.getElementById("masteryText").textContent = `${done}/${total} Mastered`;
  document.getElementById("masteryFill").style.width = `${Math.round((done / total) * 100)}%`;
}

function renderBookStorySummary() {
  document.getElementById("summaryBookTitle").textContent = `The Story of ${activeBook.title}`;
  document.getElementById("summaryIntroText").textContent = activeBook.summaryIntro;
  document.getElementById("storySummaryActs").innerHTML = (activeBook.storyActs || []).map((act, idx) => `
    <div class="act-card">
      <div class="act-thumb"><canvas id="actCanvas-${idx}"></canvas></div>
      <div><div class="eyebrow">${escapeHtml(act.act)}</div><h3 style="font-family:var(--font-heading);font-size:1.2rem;margin:0.2rem 0 0.45rem;">${escapeHtml(act.title)}</h3><p style="font-size:0.94rem;color:var(--text-secondary);">${escapeHtml(act.story)}</p></div>
    </div>`).join("");
  (activeBook.storyActs || []).forEach((_, idx) => renderProceduralCanvasArt(document.getElementById(`actCanvas-${idx}`), { number: idx + 1 }, "story", idx * 45));
}

function renderChapterQuiz() {
  const ch = activeBook.chapters[activeChapterIdx] || activeBook.chapters[0];
  document.getElementById("quizContainer").innerHTML = (ch.quiz || []).map((qItem, qIdx) => `
    <div class="quiz-item">
      <div style="font-weight:700;margin-bottom:0.6rem;">Q${qIdx + 1}: ${escapeHtml(qItem.q)}</div>
      ${qItem.options.map((opt, oIdx) => `<button class="quiz-opt" onclick="checkQuizAnswer(this, ${oIdx === qItem.answer}, '${escapeHtml(qItem.explanation || "Great job!")}')">${escapeHtml(opt)}</button>`).join("")}
      <div class="quiz-exp hidden"></div>
    </div>`).join("");
}

function checkQuizAnswer(btn, isCorrect, explanation) {
  const parent = btn.parentElement;
  parent.querySelectorAll(".quiz-opt").forEach(b => b.classList.remove("correct", "wrong"));
  btn.classList.add(isCorrect ? "correct" : "wrong");
  const expEl = parent.querySelector(".quiz-exp");
  if (expEl) { expEl.textContent = (isCorrect ? "✅ Correct! " : "❌ Not quite. ") + explanation; expEl.classList.remove("hidden"); }
}

function getNotesKey() { return `luminaread_notes_${normalizeStr(activeBook.title)}`; }
function getSavedNotes() { try { return JSON.parse(localStorage.getItem(getNotesKey()) || "[]"); } catch { return []; } }
function saveNotesList(arr) { localStorage.setItem(getNotesKey(), JSON.stringify(arr)); }

function saveSentenceNote(idx) {
  const ch = activeBook.chapters[activeChapterIdx], text = (currentMode === "story" ? ch.storyNarrative : ch.studyNarrative)[idx];
  if (!text) return;
  const notes = getSavedNotes(); notes.unshift({ ch: `Ch. ${ch.number}`, text, date: new Date().toLocaleTimeString() });
  saveNotesList(notes); renderNotesTab(); showToast("📌 Highlight saved to Study Notes!");
}

function addCustomNote() {
  const inp = document.getElementById("customNoteInput"), text = inp.value.trim(); if (!text) return;
  const ch = activeBook.chapters[activeChapterIdx], notes = getSavedNotes();
  notes.unshift({ ch: `Ch. ${ch.number}`, text, date: new Date().toLocaleTimeString() });
  saveNotesList(notes); inp.value = ""; renderNotesTab();
}

function deleteNote(idx) { const notes = getSavedNotes(); notes.splice(idx, 1); saveNotesList(notes); renderNotesTab(); }

function renderNotesTab() {
  const container = document.getElementById("notesListContainer"); if (!container) return;
  const notes = getSavedNotes();
  container.innerHTML = !notes.length
    ? `<p style="color:var(--text-muted);font-size:0.9rem;">No notes yet. Click 📌 next to any sentence, click "Auto-Generate Notes" in Study Mode, or write your own note above.</p>`
    : notes.map((n, i) => `<div class="note-item"><div><span class="match-pill" style="margin-bottom:0.35rem;">${escapeHtml(n.ch)} • ${escapeHtml(n.date)}</span><div style="font-size:0.92rem;">${escapeHtml(n.text)}</div></div><button class="btn btn-sm" onclick="deleteNote(${i})">🗑️</button></div>`).join("");
}

function initAudioContext() { if (!audioCtx) { const AudioContext = window.AudioContext || window.webkitAudioContext; audioCtx = new AudioContext(); } if (audioCtx.state === "suspended") audioCtx.resume(); }
function startAmbientSoundscape() {
  stopAmbientSoundscape();
  const tuneChoice = document.getElementById("bgTuneSelect").value; if (tuneChoice === "off") return;
  initAudioContext();
  const effectiveTune = tuneChoice === "auto" ? (currentMode === "story" ? "story_pad" : "study_binaural") : tuneChoice;
  ambientGain = audioCtx.createGain(); ambientGain.gain.setValueAtTime(0.03, audioCtx.currentTime); ambientGain.connect(audioCtx.destination);
  const freqs = effectiveTune === "story_pad" ? [130.81, 196.00, 329.63] : effectiveTune === "study_binaural" ? [200, 240] : [174.61, 220.00, 261.63, 329.63];
  freqs.forEach(freq => { const osc = audioCtx.createOscillator(); osc.type = effectiveTune === "study_lofi" ? "triangle" : "sine"; osc.frequency.setValueAtTime(freq, audioCtx.currentTime); osc.connect(ambientGain); osc.start(); ambientNodes.push(osc); });
}
function stopAmbientSoundscape() { ambientNodes.forEach(n => { try { n.stop(); n.disconnect(); } catch (e) {} }); ambientNodes = []; }
function changeAmbientTune() { if (isSpeaking) startAmbientSoundscape(); }
function changeNarratorVoice(uri) { selectedVoiceURI = uri; if (isSpeaking) { stopAllAudio(); toggleSpeechPlayback(); } }
function updateSpeechRate(val) { speechRate = parseFloat(val) || 1.0; if (isSpeaking) { stopAllAudio(); toggleSpeechPlayback(); } }
function toggleSpeechPlayback() { if (isSpeaking) stopAllAudio(); else speakFromSentence(0); }

function speakFromSentence(startIndex) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  if (!availableVoices.length) loadAvailableVoices();
  const ch = activeBook.chapters[activeChapterIdx] || activeBook.chapters[0];
  const sentences = currentMode === "story" ? ch.storyNarrative : ch.studyNarrative;
  isSpeaking = true; updateAudioUiState(true); startAmbientSoundscape();
  let idx = startIndex;
  function speakNext() {
    if (!isSpeaking || idx >= sentences.length) { stopAllAudio(); return; }
    document.querySelectorAll(".sent").forEach(el => el.classList.remove("speaking"));
    const activeSpan = document.getElementById(`sent-${idx}`);
    if (activeSpan) { activeSpan.classList.add("speaking"); activeSpan.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
    const utter = new SpeechSynthesisUtterance(prepareSpeechText(sentences[idx]));
    const chosenVoice = availableVoices.find(v => v.voiceURI === selectedVoiceURI);
    if (chosenVoice) utter.voice = chosenVoice;
    utter.rate = speechRate * (currentMode === "story" ? 0.96 : 1.03);
    utter.pitch = currentMode === "story" ? 0.98 : 1.02;
    utter.onend = () => { idx++; speakNext(); };
    utter.onerror = () => stopAllAudio();
    window.speechSynthesis.speak(utter);
  }
  speakNext();
}

function speakFullBookStory() {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  if (!availableVoices.length) loadAvailableVoices();
  isSpeaking = true; updateAudioUiState(true); startAmbientSoundscape();
  const rawScript = [activeBook.summaryIntro, ...(activeBook.storyActs || []).map(a => `${a.act}. ${a.title}. ${a.story}`)].join(". ");
  const utter = new SpeechSynthesisUtterance(prepareSpeechText(rawScript));
  const chosenVoice = availableVoices.find(v => v.voiceURI === selectedVoiceURI);
  if (chosenVoice) utter.voice = chosenVoice;
  utter.rate = speechRate * 0.97; utter.onend = () => stopAllAudio();
  window.speechSynthesis.speak(utter);
}

function stopAllAudio() { isSpeaking = false; if ("speechSynthesis" in window) window.speechSynthesis.cancel(); stopAmbientSoundscape(); document.querySelectorAll(".sent").forEach(el => el.classList.remove("speaking")); updateAudioUiState(false); }
function updateAudioUiState(playing) { document.getElementById("dockPlayBtn").textContent = playing ? "⏸" : "▶"; document.getElementById("heroSpeakBtn").textContent = playing ? "⏸ Pause Audio" : "🔊 Listen to Lesson"; document.getElementById("eqVisualizer").classList.toggle("active", playing); }

function togglePomodoro() {
  const btn = document.getElementById("pomoBtn");
  if (pomoInterval) { clearInterval(pomoInterval); pomoInterval = null; btn.textContent = "Start"; }
  else {
    btn.textContent = "Pause";
    pomoInterval = setInterval(() => {
      if (pomoSeconds > 0) { pomoSeconds--; document.getElementById("pomoDisplay").textContent = `${String(Math.floor(pomoSeconds / 60)).padStart(2, "0")}:${String(pomoSeconds % 60).padStart(2, "0")}`; }
      else { clearInterval(pomoInterval); pomoInterval = null; pomoSeconds = 25 * 60; btn.textContent = "Start"; }
    }, 1000);
  }
}

function exportBookGuide() {
  let md = `# ${activeBook.title} — Dual-Mode Story & Study Companion\n**Author:** ${activeBook.author} | **Category:** ${activeBook.category}\n\n`;
  md += `## Full Book Summary (As a Story)\n${activeBook.summaryIntro}\n\n`;
  (activeBook.storyActs || []).forEach(a => { md += `### ${a.act}: ${a.title}\n${a.story}\n\n`; });
  md += `---\n## Chapters\n\n`;
  activeBook.chapters.forEach(c => {
    md += `### Chapter ${c.number}: ${c.title}\n**Summary:** ${c.chapterSummary || ""}\n\n#### Story Mode\n${c.storyNarrative.join(" ")}\n\n#### Points to Remember\n- ${(c.pointsToRemember || []).join("\n- ")}\n\n#### Key Definitions\n${(c.definitions || []).map(d => `- **${d.term}**: ${d.def}`).join("\n")}\n\n`;
  });
  const notes = getSavedNotes();
  if (notes.length) md += `---\n## Personal Study Notes\n${notes.map(n => `- [${n.ch}] ${n.text}`).join("\n")}\n`;
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" }), a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = `${activeBook.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-guide.md`; a.click();
  showToast("📥 Exported Complete Guide!");
}

function showToast(msg) { const el = document.getElementById("toast"); el.textContent = msg; el.classList.remove("hidden"); clearTimeout(window._toastTimer); window._toastTimer = setTimeout(() => el.classList.add("hidden"), 2800); }
function escapeHtml(str) { return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

window.addEventListener("DOMContentLoaded", () => {
  loadAvailableVoices(); const _savedShelf = getUserBookshelf(); const _lastTitle = localStorage.getItem(ACTIVE_BOOK_KEY); const _found = _savedShelf.find(b => b.title === _lastTitle) || _savedShelf[0]; if (_found) activeBook = _found; renderTopTrendingCarousel(); renderBookWorkspace(); renderUserBookshelf(); const initialChapter = activeBook.chapters[activeChapterIdx]; if (initialChapter && chapterNeedsAI(initialChapter)) generateChapterWithAI(initialChapter); loadGoogleBookCovers();
  window.addEventListener("resize", () => { const ch = activeBook.chapters[activeChapterIdx]; if (ch) { drawStudyGraphs(ch); renderProceduralCanvasArt(document.getElementById("procVisualCanvas"), ch, currentMode); } });
  window.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
    if (e.code === "Space") { e.preventDefault(); toggleSpeechPlayback(); }
    if (e.key === "ArrowRight" && activeChapterIdx < activeBook.chapters.length - 1) selectChapter(activeChapterIdx + 1);
    if (e.key === "ArrowLeft" && activeChapterIdx > 0) selectChapter(activeChapterIdx - 1);
    if (e.key.toLowerCase() === "m") setAppMode(currentMode === "story" ? "study" : "story");
  });
});


/* ==========================================================================
   6. PRIVATE PER-USER BOOKSHELF (PERSISTS ON REFRESH, ISOLATED PER USER)
   ========================================================================== */
const SHELF_KEY = "luminaread_user_bookshelf_v1";
const ACTIVE_BOOK_KEY = "luminaread_active_book_title_v1";

function getUserBookshelf() {
  try { return JSON.parse(localStorage.getItem(SHELF_KEY) || "[]"); } catch { return []; }
}

function saveBookToUserShelf(bookObj) {
  if (!bookObj || !bookObj.title) return;
  const shelf = getUserBookshelf();
  const idx = shelf.findIndex(b => normalizeStr(b.title) === normalizeStr(bookObj.title));
  if (idx >= 0) shelf[idx] = bookObj;
  else shelf.unshift(bookObj);
  try {
    localStorage.setItem(SHELF_KEY, JSON.stringify(shelf.slice(0, 15)));
    localStorage.setItem(ACTIVE_BOOK_KEY, bookObj.title);
  } catch (e) {
    console.warn("Storage quota reached", e);
  }
  renderUserBookshelf();
  renderTopTrendingCarousel();
}

function loadBookFromUserShelf(idx) {
  const shelf = getUserBookshelf();
  if (!shelf[idx]) return;
  activeBook = shelf[idx];
  activeChapterIdx = 0;
  localStorage.setItem(ACTIVE_BOOK_KEY, activeBook.title);
  renderBookWorkspace();
  stopAllAudio();
  renderTopTrendingCarousel();
  showToast(`📖 Opened "${activeBook.title}"`);
}

function deleteBookFromUserShelf(idx, event) {
  event.stopPropagation();
  const shelf = getUserBookshelf();
  const removed = shelf.splice(idx, 1)[0];
  localStorage.setItem(SHELF_KEY, JSON.stringify(shelf));
  if (removed && normalizeStr(activeBook.title) === normalizeStr(removed.title)) {
    activeBook = shelf[0] || BOOK_LIBRARY["atomic-habits"];
    activeChapterIdx = 0;
    localStorage.setItem(ACTIVE_BOOK_KEY, activeBook.title);
    renderBookWorkspace();
  } else {
    renderUserBookshelf();
  }
  renderTopTrendingCarousel();
  showToast(`🗑️ Removed "${removed?.title || 'Book'}" from your private shelf`);
}

function renderUserBookshelf() {
  const container = document.getElementById("userBookshelfList");
  if (!container) return;
  const shelf = getUserBookshelf();
  if (!shelf.length) {
    container.innerHTML = `<div style="font-size:0.75rem;color:var(--text-muted);padding:0.35rem 0;">Books you search or upload are saved privately here.</div>`;
    return;
  }
  container.innerHTML = shelf.map((b, idx) => {
    const isAct = normalizeStr(b.title) === normalizeStr(activeBook.title);
    return `
      <div class="chapter-item ${isAct ? 'active' : ''}" onclick="loadBookFromUserShelf(${idx})" style="padding:0.45rem 0.65rem;">
        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;font-size:0.8rem;">📘 ${escapeHtml(b.title)}</span>
        <button class="btn btn-sm" style="padding:0.12rem 0.4rem;font-size:0.7rem;" onclick="deleteBookFromUserShelf(${idx}, event)" title="Delete from my bookshelf">🗑️</button>
      </div>`;
  }).join("");
}
