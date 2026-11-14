# LuminaRead AI

## Deploy to Vercel (With Shared GEMINI_API_KEY)
1. Push this folder to GitHub or import it into **Vercel** (`vercel deploy`).
2. In your Vercel Dashboard, go to **Project Settings -> Environment Variables**.
3. Add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your Google Gemini API key
4. Redeploy. The app uses this server-side key for Gemini requests, so visitors don't need to enter their own key. Leave the Personal API Key field blank and select Gemini.

The key is only read by the `/api/gemini` serverless function; it is not exposed to browsers. The shared endpoint uses your Gemini quota, so monitor usage and configure limits for the API key and deployment.

## Privacy & Per-User Bookshelf
- Added/uploaded books are stored strictly in each user's own browser (`localStorage`), surviving refreshes and never visible to other users.
