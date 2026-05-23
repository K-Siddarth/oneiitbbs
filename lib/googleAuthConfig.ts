/**
 * Google OAuth Configuration for One IIT BBS App
 * 
 * IMPORTANT: Replace the Android Client ID placeholder with your actual client ID
 * from Google Cloud Console once you complete the OAuth setup.
 */

export const GOOGLE_AUTH_CONFIG = {
  // Web Client ID (works for web and Expo Go)
  WEB_CLIENT_ID: '208282390520-d81krkplg5qhfvljbl0qbn4lvhqcc1aq.apps.googleusercontent.com',
  
  // iOS Client ID (from GoogleService-Info.plist)
  IOS_CLIENT_ID: '208282390520-vn2cpspjkm1ncachrthuch4imislek51.apps.googleusercontent.com',
  
  // Android Client ID - Generated in Google Cloud Console
  // Package: com.oneiitbbs.app
  // SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
  // TODO: Replace this after creating Android OAuth credential in GCP
  ANDROID_CLIENT_ID: '208282390520-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com',
  
  // Project ID
  PROJECT_ID: 'oneiitbbs',
  
  // Debug Keystore Fingerprints (for native Android builds)
  DEBUG_SHA1: '5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25',
  DEBUG_SHA256: 'FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C',
};

/**
 * SETUP CHECKLIST:
 * ✓ Firebase project created in Google Cloud Console
 * ✓ Firebase added to iOS and Android apps
 * ✓ Web Client ID created for Expo Go testing
 * ☐ Android OAuth credential created with package name and SHA-1 fingerprint
 * ☐ Returned Android Client ID and pasted into ANDROID_CLIENT_ID above
 * ☐ OAuth consent screen configured as "Internal" app
 * ☐ Tested Google sign-in on different platforms
 */
