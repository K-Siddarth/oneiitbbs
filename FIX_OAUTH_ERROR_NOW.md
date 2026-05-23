# 🚨 URGENT: Fix Google OAuth Error 400

## What's Blocking You
Your app is being rejected because the OAuth consent screen is NOT properly configured in Google Cloud Console.

---

## ✅ DO THESE EXACT STEPS NOW

### Step 1: Configure OAuth Consent Screen (MOST IMPORTANT)
1. Open: https://console.cloud.google.com/
2. Select project: **oneiitbbs**
3. Left menu → **APIs & Services** → **OAuth consent screen**

4. **Select User Type: Internal** (this is key!)
   - Internal = Your organization/test users
   - External = Public app
   
5. Click **Create** or **Edit**

6. Fill in:
   - **App name:** `One IIT BBS App`
   - **User support email:** `siddarth.kadambari@gmail.com` (use your email)
   - **Developer contact information:** `siddarth.kadambari@gmail.com`

7. Click **Save and Continue**

8. **Scopes** - Click **Add or Remove Scopes**
   - Search for and add:
     - `email`
     - `profile` 
     - `openid`
   - Click **Update** and then **Save and Continue**

9. **Test Users** - Click **Add Users**
   - Add your email: `siddarth.kadambari@gmail.com`
   - Click **Add**
   - Click **Save and Continue**

10. **Review** all information and click **Back to Dashboard**

---

### Step 2: Verify Web Client Credentials Exist
1. Still in **APIs & Services**
2. Click **Credentials**
3. Look for: **OAuth 2.0 Client IDs**
4. You should see:
   - Type: **Web application**
   - Name should be either "Web client" or has web in the name
   - Client ID: `208282390520-d81krkplg5qhfvljbl0qbn4lvhqcc1aq.apps.googleusercontent.com`

**If NOT found:**
1. Click **+ Create Credentials**
2. Choose **OAuth client ID**
3. Application type: **Web application**
4. Name: `One IIT BBS Web`
5. Authorized JavaScript origins:
   ```
   http://localhost:8081
   http://localhost:3000
   ```
6. Authorized redirect URIs:
   ```
   http://localhost:8081/
   http://localhost:3000/
   https://auth.expo.io/@siddarth/oneiitbbs
   https://auth.expo.io/
   ```
7. Click **Create**
8. **COPY** the Client ID and paste into `AuthContext.tsx`

---

### Step 3: Enable Required APIs
1. Still in **APIs & Services**
2. Click **Enabled APIs & services**
3. Check these are enabled:
   - ✅ **Google+ API**
   - ✅ **Identity Toolkit API**
   - ✅ **Firebase Management API**

If any are missing:
1. Click **+ Enable APIs and Services**
2. Search for the API name
3. Click **Enable**

---

### Step 4: Test on Your Device
1. Close the app completely
2. Clear app cache (or reinstall)
3. Tap "Sign In with Google"
4. You should now see a Google sign-in screen (not an error)

---

## 🔍 If You Still Get Error 400

### Check 1: Is OAuth Consent Screen set to "Internal"?
- Go back to OAuth consent screen
- Click "Edit App"
- Is "Internal" selected? If not, select it and save

### Check 2: Are you listed as a test user?
- OAuth consent screen
- Scroll down to "Test users"
- Is `siddarth.kadambari@gmail.com` listed?
- If not, add yourself

### Check 3: Clear Browser Cache
```bash
# On your computer
1. Press Ctrl+Shift+Delete (Chrome)
2. Select "All time"
3. Check "Cookies and other site data"
4. Click "Clear data"
```

### Check 4: Check App is Using Correct Client ID
In `lib/AuthContext.tsx`, verify line has:
```typescript
clientId: '208282390520-d81krkplg5qhfvljbl0qbn4lvhqcc1aq.apps.googleusercontent.com',
webClientId: '208282390520-d81krkplg5qhfvljbl0qbn4lvhqcc1aq.apps.googleusercontent.com',
```

---

## ⏱️ Timeline
1. **Right now:** Follow Steps 1-3 above
2. **After 2-5 minutes:** Changes propagate to Google servers
3. **Then:** Rebuild app and test sign-in

---

## 📱 Alternative: Use Dev Sign-In to Keep Working
While you fix OAuth, you can use the dev sign-in:

In `app/signin.tsx`, change:
```typescript
const handleSignIn = useCallback(async () => {
  try {
    await devSignIn(); // <-- Use dev sign-in instead
  } catch (error: any) {
    Alert.alert('Sign In Error', error.message || 'Failed to sign in');
  }
}, [devSignIn]);
```

This lets you test the rest of your app while OAuth setup completes.

---

## ✅ Success Indicators
- [ ] OAuth Consent Screen is set to "Internal"
- [ ] Your email is added as a test user
- [ ] Web Client credentials exist
- [ ] Clicking sign-in shows Google login page (no Error 400)
- [ ] App successfully logs in

**Don't move forward until all steps above are completed.**
