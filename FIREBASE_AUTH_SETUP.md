# Firebase Authentication Setup Instructions

## Problem
SignUp button redirects to home page instead of creating an account.

## Most Likely Cause
Email/Password authentication is not enabled in Firebase Console.

## Solution Steps

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com

### 2. Select Your Project
Click on: **ai-resume-analyzer-13d49**

### 3. Navigate to Authentication
- In the left sidebar, click **"Build"**
- Click **"Authentication"**

### 4. Enable Email/Password Sign-in
- Click on the **"Sign-in method"** tab
- Find **"Email/Password"** in the list of providers
- Click on it
- Toggle **"Enable"** to ON
- Click **"Save"**

### 5. Test Again
- Go back to your app: http://localhost:5173/signup
- Open browser console (F12)
- Try to sign up with a test email
- Check the console logs for detailed information

## Alternative: Use Firebase Test Page
Visit: http://localhost:5173/firebase-test

This page will:
- Test Firebase connection directly
- Show exact error codes
- Provide troubleshooting guidance

## What to Look For in Console

### If Email/Password is NOT enabled:
```
Error code: auth/operation-not-allowed
Message: Email/Password sign-up is not enabled in Firebase Console
```

### If Email/Password IS enabled:
```
✅ User created successfully!
User ID: [some-uid]
User email: [your-email]
```

## Still Having Issues?

1. Check browser console (F12) for error messages
2. Copy the exact error code and message
3. Share it so we can diagnose further

## Common Error Codes

- `auth/operation-not-allowed` - Email/Password not enabled
- `auth/email-already-in-use` - Email already registered (try signing in)
- `auth/weak-password` - Password too weak (min 6 characters)
- `auth/invalid-email` - Invalid email format
- `auth/network-request-failed` - Network/internet issue
