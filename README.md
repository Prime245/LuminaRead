# LuminaRead AI

An AI-powered book companion for stories and study, with visual lessons and narration. LuminaRead AI can search public book catalogs, process uploaded books, create study materials, and narrate lessons.

## Features

- Search Google Books and Open Library with a confidence-based results filter.
- Upload PDF, TXT, and Markdown books for chapter-based lessons.
- Switch between narrative Story Mode and structured Study Mode.
- Generate AI content using Ollama, Google Gemini, OpenAI, or Groq.
- Listen to lessons with browser speech synthesis and ambient audio.
- Review flashcards, quizzes, notes, summaries, and study visualizations.

## Requirements

- Python 3 (for the local web server).
- An internet connection for book search, web fonts, and the PDF.js CDN.
- An AI provider and its API key if you want to use a cloud AI engine. Ollama can be used locally instead.

No npm packages or build step are required.

## Run locally

In PowerShell, from the project folder:

```powershell
py -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Leave the terminal running while you use the app; press `Ctrl+C` to stop the server.

Alternatively, run this from any directory:

```powershell
py -m http.server 8000 --directory "C:\path\to\LuminaRead-AI"
```

## AI provider setup

Open **AI Engine** in the app, select a provider, and enter its settings. Ollama defaults to `http://localhost:11434` and the `llama3.2` model. For cloud providers, paste the provider API key into the app.

The current app is a static frontend: it does not read `.env` files. API keys entered in AI Engine settings are stored in that browser's local storage and sent directly from the browser to the selected provider. Do not use this key-handling approach for a public multi-user deployment; put provider credentials behind a server-side API instead. Never commit real API keys.

`.env` is ignored by Git. `.env.example` is a placeholder for a future server-side integration and is not read by this app.

## Deployment

This is a static website and can be deployed to GitHub Pages, Netlify, or Vercel. Cloud AI calls from a public static site expose API keys to the browser, so use a backend proxy before enabling cloud AI for public users.
