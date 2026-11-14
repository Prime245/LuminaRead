# LuminaRead AI

## Deploy to Vercel (With Shared GEMINI_API_KEY)
1. Push this folder to GitHub or import it into **Vercel** (`vercel deploy`).
2. In your Vercel Dashboard, go to **Project Settings -> Environment Variables**.
3. Add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your Google Gemini API key
4. Redeploy. Every user visiting your site will now use the AI automatically without needing to enter any API key!

## Privacy & Per-User Bookshelf
- Added/uploaded books are stored strictly in each user's own browser (`localStorage`), surviving refreshes and never visible to other users.
