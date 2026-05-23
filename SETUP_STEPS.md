# Complete Google OAuth 2.0 Setup Instructions

## ⚠️ Error You're Getting
```
Access blocked: Authorization Error
Error 400: invalid_request
```

**Why:** Your Android app package (`com.oneiitbbs.app`) doesn't have a registered OAuth credential with the correct certificate fingerprint in Google Cloud Console.

---

## 🔐 Your Debug Certificate Info
- **Package Name:** `com.oneiitbbs.app`
- **SHA-1 Fingerprint:** `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
- **SHA-256:** `FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C`

---

## 📋 Step-by-Step Setup

### Step 1️⃣ - Go to Google Cloud Console
1. Open https://console.cloud.google.com
2. Select project: **oneiitbbs**

### Step 2️⃣ - Navigate to Credentials
1. Left sidebar → **APIs & Services**
2. Click **Credentials**

### Step 3️⃣ - Create Android OAuth Credential
1. Click **+ Create Credentials**
2. Choose **OAuth client ID**
3. Application type: **Android**

You'll see a form:
```
Package name: [com.oneiitbbs.app]
SHA-1 certificate fingerprint: [5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25]
```

4. Click **Create**
5. ✅ **COPY the Android Client ID** (shown in the popup)
   - Format: `208282390520-XXXXXX.apps.googleusercontent.com`

### Step 4️⃣ - Update Your Code
1. Open `lib/AuthContext.tsx`
2. Find the line:
   ```typescript
   androidClientId: '208282390520-d81krkplg5qhfvljbl0qbn4lvhqcc1aq.apps.googleusercontent.com',
   ```
3. Replace with the Android Client ID from Step 3

### Step 5️⃣ - Configure OAuth Consent Screen
1. Still in APIs & Services → **OAuth consent screen**
2. Set up as **Internal** application
3. Add app information:
   - App name: `One IIT BBS App`
   - User support email: your IIT BBS email
   - Developer contact information: your email
4. Click **Save and Continue**
5. Add scopes (if prompted): `email`, `profile`
6. Click **Save and Continue**

### Step 6️⃣ - Test
1. Clear your browser cache (if testing on web)
2. Rebuild your Expo Go app or reinstall APK
3. Click "Sign In with Google"
4. It should now show the Google sign-in screen correctly

---

## 🔄 Testing on Different Platforms

### Expo Go (Easiest for Development)
- Uses the Web Client ID automatically
- No extra setup needed once Web Client ID is registered
- Works on iOS and Android simulators

### Native Android Build
- Uses the Android Client ID we just created
- Make sure the APK/app is signed with the debug.keystore
- Should now work with the new Android credential

### Native iOS Build
- Uses iOS Client ID from GoogleService-Info.plist
- Already configured with: `208282390520-vn2cpspjkm1ncachrthuch4imislek51.apps.googleusercontent.com`

### Web
- Uses Web Client ID (already set up)

---

## ✅ Verification Checklist

- [ ] Android OAuth credential created in Google Cloud Console
- [ ] Android Client ID copied and updated in `AuthContext.tsx`
- [ ] OAuth consent screen configured
- [ ] Browser cache cleared
- [ ] App reinstalled/rebuilt
- [ ] Sign-in button clicked and Google page appears (no Error 400)
- [ ] Google account selection screen appears
- [ ] Successfully logged in

---

## 🐛 Troubleshooting

### Still getting "Error 400: invalid_request"?
1. **Check:** Did you create the Android credential with the EXACT SHA-1 fingerprint?
   - Copy: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
2. **Try:** Clear Chrome cache → Settings → Privacy & Security → Clear browsing data
3. **Rebuild:** `expo prebuild --clean` then rebuild

### Getting "Authorization Error" with different message?
1. Check your OAuth consent screen is set to **Internal**
2. Make sure your test email is added to test users (if in development)
3. Sign out from your Google account in browser

### Expired certificates?
The debug keystore doesn't expire (it's set for 10,000 years), but if you need to:
```bash
keytool -list -v -keystore android/app/debug.keystore -storepass android -keypass android
```

---

## 📱 For Release Builds Later

When you're ready to release:
1. Create a release keystore (not the debug.keystore)
2. Get its SHA-1 fingerprint
3. Create ANOTHER Android OAuth credential with that fingerprint in Google Cloud Console
4. Update code to use the release client ID for release builds

---

## 📞 Need Help?

Check these files:
- [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) - Detailed setup guide
- [googleAuthConfig.ts](./googleAuthConfig.ts) - Current credentials reference
- [AuthContext.tsx](./AuthContext.tsx) - Implementation details

Error logs will appear in:
- React Native console (Expo Go)
- Logcat (native Android: `adb logcat | grep AUTH`)
- Browser console (web)
