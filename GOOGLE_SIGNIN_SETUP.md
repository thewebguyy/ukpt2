# Google Sign-In Setup Guide for Firebase

## 🚨 Problem
Google Sign-In button is not working on your website (account.html page).

## ✅ Solution
Google Sign-In must be enabled in Firebase Console. Follow these steps:

---

## Step 1: Enable Google Sign-In in Firebase Console

### 1.1 Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **cmuksite**

### 1.2 Navigate to Authentication
1. In the left sidebar, click **"Build"** → **"Authentication"**
2. Click on the **"Sign-in method"** tab at the top

### 1.3 Enable Google Provider
1. In the list of providers, find **"Google"**
2. Click on **"Google"** to open the configuration
3. Click the **"Enable"** toggle switch (turn it ON)
4. You'll see two required fields:
   - **Project public-facing name**: Enter `CustomiseMe UK` (or your preferred name)
   - **Project support email**: Select your email from the dropdown
5. Click **"Save"**

✅ **Google Sign-In is now enabled!**

---

## Step 2: Add Authorized Domains (Important!)

Firebase only allows sign-in from authorized domains for security.

### 2.1 Add Your Domain
1. Still in **Authentication** → **Settings** tab
2. Scroll down to **"Authorized domains"**
3. You should see:
   - `localhost` (already added by default)
   - `cmuksite.firebaseapp.com` (already added)
   - `cmuksite.web.app` (already added)

4. **Add your custom domain** if you're using one:
   - Click **"Add domain"**
   - Enter: `customisemeuk.com` (or whatever your domain is)
   - Click **"Add"**

### 2.2 For Testing Locally
- `localhost` should already be in the list
- If not, add it manually

---

## Step 3: Test Google Sign-In

### 3.1 Open Your Website
1. Navigate to: `http://localhost:5500/account.html` (or your local server)
2. You should see the sign-in page with the Google button

### 3.2 Click "Sign in with Google"
1. Click the **"Sign in with Google"** button
2. A Google popup should appear
3. Select your Google account
4. Grant permissions
5. You should be redirected to your dashboard

---

## 🐛 Troubleshooting

### Error: "This app is not authorized to use Firebase Authentication"
**Solution**: Make sure you've added your domain to the Authorized domains list (Step 2)

### Error: "popup_closed_by_user"
**Solution**: This is normal - user closed the popup. No action needed.

### Error: "auth/unauthorized-domain"
**Solution**: 
1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add the domain you're testing from (e.g., `localhost` or `customisemeuk.com`)

### Error: "auth/popup-blocked"
**Solution**: 
1. Allow popups in your browser for this site
2. Or use redirect instead of popup (see code modification below)

### Google Button Does Nothing
**Solution**: 
1. Open browser console (F12)
2. Check for JavaScript errors
3. Make sure `api-integration.js` is loaded correctly
4. Verify Firebase config is correct in `api-integration.js`

---

## 🔄 Alternative: Use Redirect Instead of Popup

If popups are being blocked, you can modify the code to use redirect flow:

### Current Code (Popup):
```javascript
static async loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return { success: true, user: this.formatUser(result.user) };
  } catch (error) {
    console.error('Google login error:', error);
    return { success: false, message: this.getErrorMessage(error) };
  }
}
```

### Alternative Code (Redirect):
```javascript
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';

static async loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
    // User will be redirected away and back
  } catch (error) {
    console.error('Google login error:', error);
    return { success: false, message: this.getErrorMessage(error) };
  }
}

// Add this to handle the redirect result when user comes back
static async handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return { success: true, user: this.formatUser(result.user) };
    }
  } catch (error) {
    console.error('Redirect result error:', error);
  }
}
```

---

## ✅ Verification Checklist

- [ ] Google provider is **enabled** in Firebase Console
- [ ] Project name and support email are set
- [ ] Your domain is in the **Authorized domains** list
- [ ] Browser allows popups from your site
- [ ] No console errors when clicking the button
- [ ] Firebase config in `api-integration.js` is correct

---

## 📝 Additional Configuration (Optional)

### Request Additional Scopes
If you need access to user's Google Calendar, Drive, etc.:

```javascript
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar');
provider.addScope('https://www.googleapis.com/auth/drive.file');
```

### Force Account Selection
Make users select an account every time:

```javascript
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});
```

---

## 🎯 Summary

**The main issue is that Google Sign-In is NOT enabled in Firebase Console.**

**Quick Fix:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Authentication → Sign-in method
4. Enable Google
5. Add your domain to Authorized domains
6. Test!

Your code is already correct - you just need to enable it in Firebase! 🚀
