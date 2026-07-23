# Gemini API Setup Guide

## Why Gemini?

✅ **FREE** - Generous free tier with no credit card required  
✅ **Fast** - Gemini 1.5 Flash is optimized for speed  
✅ **Powerful** - Excellent for resume analysis and text processing  
✅ **Easy** - Simple setup, no billing configuration needed  

## Step 1: Get Your Free API Key

1. **Visit Google AI Studio**: https://makersuite.google.com/app/apikey

2. **Sign in** with your Google account

3. **Click "Create API Key"**
   - Select "Create API key in new project" (or use existing project)
   - Copy the generated API key

4. **Save your key** - You'll need it in the next step

## Step 2: Add API Key to Your Project

### For Local Development:

1. Open the `.env` file in your project root
2. Replace the placeholder with your actual API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Save the file

### For Production (Vercel):

1. Go to your Vercel Dashboard
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: Your Gemini API key
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**
6. Redeploy your application

## Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C if running)
# Then restart:
npm run dev
```

## Step 4: Verify It's Working

1. **Open your browser** at http://localhost:8081/

2. **Check the console** - You should see:
   ```
   🔧 Environment Configuration
   Mode: Development
   API Key Present: true
   API Key Length: 39 (or similar)
   Validation Status: ✅ Valid
   ```

3. **Test resume analysis**:
   - Click "Load Sample" to load a sample resume
   - Select a job role (e.g., "Frontend Developer")
   - Click "Analyze Resume"
   - You should see: "AI Analysis Complete" toast
   - Results page shows AI-powered analysis

## Gemini API Features

### Free Tier Limits:
- **15 requests per minute**
- **1 million tokens per minute**
- **1,500 requests per day**

This is more than enough for most resume analysis applications!

### Models Available:
- **gemini-1.5-flash** (used by this app) - Fast and efficient
- **gemini-1.5-pro** - More powerful for complex tasks
- **gemini-pro** - Previous generation

## Troubleshooting

### Issue: "API key is not set"

**Solution:**
1. Check that `.env` file exists in project root
2. Verify the variable name is exactly `VITE_GEMINI_API_KEY`
3. Ensure there are no spaces around the `=` sign
4. Restart the dev server

### Issue: "Invalid API key"

**Solution:**
1. Verify you copied the entire API key
2. Check for extra spaces or line breaks
3. Generate a new API key if needed
4. Make sure you're using the key from Google AI Studio

### Issue: "Quota exceeded"

**Solution:**
- Free tier has rate limits (15 requests/minute)
- Wait a minute and try again
- For higher limits, check Google AI Studio for paid plans

### Issue: API key not loading in browser

**Solution:**
1. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Restart the dev server
4. Check browser console for any errors

## Comparison: Gemini vs OpenAI

| Feature | Gemini (Free) | OpenAI (Paid) |
|---------|---------------|---------------|
| Cost | FREE | Requires billing |
| Setup | No credit card | Credit card required |
| Rate Limits | 15 req/min | Varies by plan |
| Quality | Excellent | Excellent |
| Speed | Very fast | Fast |
| Best For | Development, small apps | Production, high volume |

## Security Notes

⚠️ **Important**: The API key is visible in client-side JavaScript. For production:

1. **Monitor Usage**: Check https://makersuite.google.com/ regularly
2. **Restrict API Key**: Add HTTP referrer restrictions in Google Cloud Console
3. **Consider Backend Proxy**: For high-traffic apps, use a backend API
4. **Rotate Keys**: Regularly rotate API keys for security

## Additional Resources

- **Google AI Studio**: https://makersuite.google.com/
- **Gemini API Documentation**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing
- **API Key Management**: https://makersuite.google.com/app/apikey

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key at https://makersuite.google.com/app/apikey
3. Review the Gemini API documentation
4. Check the application logs for detailed error information

---

**Ready to go!** Once you've added your API key and restarted the server, your resume analyzer will be powered by Google's Gemini AI. 🚀
