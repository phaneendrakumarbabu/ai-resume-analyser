# Gemini API Setup - Quick Start

## Get Your FREE API Key (2 minutes)

1. Visit: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key

## Add to Your Project

Open `.env` file and add:
```
VITE_GEMINI_API_KEY=paste_your_key_here
```

## Restart & Test

```bash
# Restart dev server
npm run dev
```

Then refresh your browser and test resume analysis!

## Why Gemini?

- ✅ **FREE** - No credit card required
- ✅ **15 requests/minute** - Generous free tier
- ✅ **Fast** - Gemini 1.5 Flash optimized for speed
- ✅ **Easy** - Just get a key and go

## For Vercel Deployment

1. Vercel Dashboard → Settings → Environment Variables
2. Add: `VITE_GEMINI_API_KEY` = your key
3. Deploy

That's it! 🚀
