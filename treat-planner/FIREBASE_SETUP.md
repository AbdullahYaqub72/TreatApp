# Firebase Setup Guide 🔥

Follow these steps to configure Firebase for your Treat Planner app.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `treat-planner` (or your choice)
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

## Step 2: Register Web App

1. In your Firebase project, click the **Web icon** (`</>`)
2. Register app nickname: `Treat Planner Web`
3. **Don't** check "Firebase Hosting" (unless you want to use it)
4. Click **"Register app"**
5. **Copy the configuration object** - you'll need this!

It will look like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "treat-planner-xxxxx.firebaseapp.com",
  projectId: "treat-planner-xxxxx",
  storageBucket: "treat-planner-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

## Step 3: Enable Google Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **"Get started"** if first time
3. Go to **"Sign-in method"** tab
4. Click on **"Google"**
5. Toggle **"Enable"**
6. Select a **support email** (your email)
7. Click **"Save"**

## Step 4: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose a location (closest to your users)
5. Click **"Enable"**

## Step 5: Set Up Firestore Security Rules

1. In Firestore Database, click on **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read their profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Day Plans: owner can do everything, others can read
    match /dayPlans/{planId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.ownerId;
    }
    
    // Events: authenticated users can read and update
    // (since members can update RSVPs and bills)
    match /events/{eventId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Step 6: Create Firestore Indexes (Optional but Recommended)

1. Go to **"Indexes"** tab in Firestore
2. Click **"Add index"**
3. Create index for `dayPlans`:
   - Collection ID: `dayPlans`
   - Field 1: `ownerId` (Ascending)
   - Field 2: `date` (Descending)
   - Query scope: Collection
4. Click **"Create index"** (takes a few minutes)

5. Create index for `events`:
   - Collection ID: `events`
   - Field 1: `dayPlanId` (Ascending)
   - Field 2: `dateTime` (Ascending)
   - Query scope: Collection
6. Click **"Create index"**

## Step 7: Configure Your App

### Option A: Direct Configuration (Quick)

Open `src/lib/firebase.ts` and paste your config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Option B: Environment Variables (Recommended for Production)

1. Create `.env` file in project root:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=treat-planner-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=treat-planner-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=treat-planner-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx
```

2. The app is already configured to use these env vars as fallback!

## Step 8: Test Your Setup

1. Start the dev server:
```bash
npm run dev
```

2. Open [http://localhost:5173](http://localhost:5173)

3. Click **"Sign in with Google"**

4. If successful, you should see:
   - Redirect to dashboard
   - Your name and avatar in top-right
   - "No day plans yet" message

5. Create a test day plan to verify everything works!

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Go to Firebase Console → Authentication → Settings
- Add `localhost` to Authorized domains
- For production, add your domain (e.g., `yourapp.vercel.app`)

### "Missing or insufficient permissions"
- Check Firestore Rules are published
- Make sure you're signed in
- Check browser console for detailed errors

### "Firebase not configured"
- Verify your config in `src/lib/firebase.ts`
- Check environment variables are loaded
- Restart dev server after adding `.env`

### Google Sign-in popup blocked
- Allow popups in your browser
- Or try different browser
- Check Firebase Auth is enabled

## Security Notes

⚠️ **Important Security Tips:**

1. **Never commit `.env` to Git** - add it to `.gitignore`
2. **Use environment variables** for production deployments
3. **API Key is safe to expose** - it's meant for the frontend
4. **Firestore Rules protect your data** - review them carefully
5. **Enable App Check** for production (optional but recommended)

## Production Deployment

When deploying to production:

1. **Add your domain** to Firebase Auth authorized domains
2. **Set environment variables** in your hosting platform:
   - Vercel: Settings → Environment Variables
   - Netlify: Site settings → Environment variables
   - Firebase Hosting: Use `.env.production`

3. **Test thoroughly** before going live

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com/)

---

**You're all set! 🎉 Happy coding!**

