# Google OAuth 2.0 Setup Guide for One IIT BBS App

## Your Debug Keystore Fingerprints
```
SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
SHA-256: FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
```

## Steps to Complete Google OAuth Setup

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Select Your Project
- Project ID: `oneiitbbs`
- Click on your project

### 3. Create Android OAuth Credential (if not already created)
**Location:** APIs & Services > Credentials

1. Click "Create Credentials" > "OAuth client ID"
2. Choose application type: **Android**
3. Fill in the required fields:
   - **Package name:** `com.oneiitbbs.app`
   - **SHA-1 certificate fingerprint:** `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
4. Click "Create"
5. **Copy the Android Client ID** (looks like: `208282390520-xxxxxx.apps.googleusercontent.com`)

### 4. Configure OAuth Consent Screen
**Location:** APIs & Services > OAuth consent screen

1. Make sure the app is configured as an **Internal** app (for testing with IIT BBS members)
2. Add the required information:
   - App name: One IIT BBS App
   - User support email: your email
   - Developer contact: your email
3. Click "Save"

### 5. Configure Web Client for Expo Go Testing
**Location:** APIs & Services > Credentials

1. If you need to test on **Expo Go** (in development):
   - Click "Create Credentials" > "OAuth client ID"
   - Choose: **Web application**
   - Name: "OneIITBBS Web Client"
   - Authorized redirect URIs:
     - `https://auth.expo.io/@yourusername/oneiitbbs`
     - `https://auth.expo.io/`
     - `http://localhost:8081`
   - Click "Create" (note the Web Client ID)

### 6. Special Setup for Native Android Build Testing

If testing direct APK builds (not Expo Go), you may need an additional Android credential with your release keystore SHA-1 once you create a release build.

## Expected Error After Setup
- Error should change from `Error 400: invalid_request` 
- To possibly asking for account permissions (this is normal)

## Troubleshooting
- If still getting invalid_request: Clear browser cache and sign out from your Google account
- If getting permission denied: Check that the app is set to "Internal" on the OAuth consent screen
- If URL not recognized: Make sure Expo Go is properly configured and you're using the correct Expo username
