# LuminaRead AI

## Deploy to Vercel (With Shared GEMINI_API_KEY)
1. Push this folder to GitHub or import it into **Vercel** (`vercel deploy`).
2. In your Vercel Dashboard, go to **Project Settings -> Environment Variables**.
3. Add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your Google Gemini API key
4. Redeploy. The app uses this server-side key for Gemini requests, so visitors don't need to enter their own key. Leave the Personal API Key field blank and select Gemini.

The deployment-level key is only read by the `/api/gemini` serverless function; it is not exposed to browsers. The shared endpoint uses your Gemini quota, so monitor usage and configure limits for the API key and deployment.
Gemini requests have a 55-second server-side time budget within Vercel's 60-second function limit. The browser allows 65 seconds for a response. Generated SVGs are kept compact to reduce generation time, and uploaded books are split into lessons of about 1,200 characters which generate on demand. The browser starts Gemini generation when a chapter is missing either mode's SVG, and switches to its local visual if generation fails or times out. Gemini requires the deployed Vercel endpoint when no personal API key is supplied; opening `index.html` directly does not provide that backend.

## Story Visual Recommendations
- A scrolling carousel of popular book picks appears in its own section above the workspace, independently of chapter visuals.
- Picks are ranked using titles, categories, and topics from the books saved on that user's private bookshelf, and update when that shelf changes. Select a cover to open its book.
- Story and Study chapter visuals remain in their existing visual panel.
- Until the current mode's AI visual is ready, that panel shows full-frame artwork from the supplied Hogwarts, The Winds of Winter, and Sherlock Holmes images, rotating every 10 seconds. Rotation is reduced for users who prefer less motion.
- Cover images use the largest size Google Books provides when available, with bundled cover fallbacks. Google Books does not guarantee 4K resolution.
- Book recommendations use a curated catalog; personalization is local to the user's browser.

## Privacy & Per-User Bookshelf
- Added/uploaded books are stored strictly in each user's own browser (`localStorage`), surviving refreshes and never visible to other users.
