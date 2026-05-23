# Expo Go + Google OAuth Setup

## ✅ Good News: Expo Go DOES Work with Google OAuth

But you need these exact settings in Google Cloud Console.

---

## 🔧 Expo Go Redirect URI Configuration

When using Expo Go, the redirect URI is:
```
https://auth.expo.io/
```

This is automatically handled by `expo-auth-session`. You just need to register it in Google Cloud Console.

---

## 📋 EXACT Steps for Expo Go

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com/
2. Project: **oneiitbbs**
3. APIs & Services → **Credentials**

### Step 2: Create/Update Web OAuth Credential
1. Click **+ Create Credentials** → **OAuth client ID**
2. Application type: **Web application**
3. Name: `Expo Go - One IITBBS`

4. **Authorized redirect URIs** - Add ALL of these:
   ```
   https://auth.expo.io/
   https://auth.expo.io
   http://localhost:8081
   ```

5. Click **Create**
6. Copy the **Client ID** shown

### Step 3: Set OAuth Consent Screen to Internal ⚠️ CRITICAL
1. Still in APIs & Services → **OAuth consent screen**
2. Click **Edit App** (if already created) or **Create**
3. **User Type: Internal** ← THIS IS KEY
4. Fill in app info:
   - App name: `One IIT BBS App`
   - User support email: your IIT BBS email
   - Developer contact: your IIT BBS email
5. Save

### Step 4: Add Yourself as Test User
1. OAuth consent screen page
2. Scroll to **Test users** section
3. Click **+ Add Users**
4. Email: `siddarth.kadambari@gmail.com`
5. Click **Add**
6. Save changes

### Step 5: Verify in Your Code
Check `lib/AuthContext.tsx` has:
```typescript
clientId: '208282390520-d81krkplg5qhfvljbl0qbn4lvhqcc1aq.apps.googleusercontent.com',
webClientId: '208282390520-d81krkplg5qhfvljbl0qbn4lvhqcc1aq.apps.googleusercontent.com',
```

### Step 6: Rebuild and Test
```bash
# Terminal 1: Clear and rebuild
expo prebuild --clean

# Terminal 2: Start Expo Go
expo start

# Then scan QR code with Expo Go app
```

---

## ✅ Success Checklist

- [ ] OAuth consent screen is **Internal** (not External)
- [ ] You're added as a test user
- [ ] Web OAuth credential created
- [ ] Redirect URI includes `https://auth.expo.io/`
- [ ] Code has correct Web Client ID
- [ ] Clicked "Sign In with Google"
- [ ] Redirected to Google login page (NOT error page)

---

## 🐛 Common Expo Go Issues

### Issue: Still getting "Error 400: invalid_request"
**Fix:** 
1. OAuth consent screen must be "Internal" ❌ Don't use "External"
2. You must be added as a test user
3. Go back and re-save the settings (takes 1-2 minutes to propagate)

### Issue: "This app doesn't comply with Google policy"
**Fix:** Same as above - OAuth consent screen needs to be "Internal"

### Issue: "Redirect URI mismatch"
**Fix:** Make sure `https://auth.expo.io/` is in the authorized redirect URIs list

### Issue: QR code works but then shows error
**Fix:** 
1. Switch to same WiFi as computer
2. Close Expo Go completely
3. Clear browser cookies (Ctrl+Shift+Delete)
4. Restart Expo Go
5. Scan QR code again

---

## 📱 Testing Tips for Expo Go

1. **Use Development Build (Easier):**
   ```bash
   eas build --platform ios --profile development
   eas build --platform android --profile development
   ```
   Then install on device - this is more reliable than Expo Go.

2. **Or Use Expo Go with Correct Setup:**
   - Make sure on same WiFi
   - URL shown in terminal should load in browser without errors
   - If browser shows 404, Expo server isn't running properly

3. **Check Expo Go is Updated:**
   - Open Expo Go app
   - Profile → Check for updates
   - Make sure you have latest version

---

## 🚀 Once OAuth Is Working

Your app will:
1. Show Google login when you tap "Sign In with Google"
2. Redirect to choose Google account
3. Return to app and log you in
4. Store your user info in Firebase

---

## Alternative: Use Dev Sign-In While Fixing

If OAuth still isn't working after these steps:
1. Tap "⚙️ Dev Options" button
2. Tap "Dev Sign In (Test Mode)"
3. This logs you in without Google (for testing app features)
4. Fix OAuth setup in parallel

---

**Key Point:** The issue isn't Expo Go - it's the OAuth consent screen configuration. Once you set it to "Internal" and add yourself as a test user, Expo Go will work perfectly with Google OAuth. ✅
