# ☁️ How to Connect Your Free Lifetime Cloud Database (Firebase)

Your birthday website is now equipped with a **Lifetime Cloud Database** powered by **Google Firebase**. 

When connected, **any photo you or your girlfriend uploads from any phone or computer is saved forever** in Google Cloud and **appears instantly on both of your screens in real time**!

---

### ⏱️ Quick 2-Minute Setup (100% Free Forever)

Google Firebase provides **1GB of Database storage + 5GB of Image Cloud Storage** on their free tier with no credit card required.

#### Step 1: Create a Free Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/) and sign in with any Google account.
2. Click **"Add project"** (or **"Create a project"**).
3. Name it anything you like (e.g., `birthday-priyanka-2026`).
4. Disable Google Analytics (optional, to make setup faster) and click **"Create project"**.

#### Step 2: Register a Web App
1. On your Firebase Project dashboard, click the **Web icon `</>`** (or go to Project Settings -> General -> Your apps -> Add app).
2. Enter an app nickname (e.g., `Birthday Web`).
3. Click **"Register app"**.
4. You will see a `firebaseConfig` object on screen that looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "birthday-priyanka.firebaseapp.com",
     projectId: "birthday-priyanka",
     storageBucket: "birthday-priyanka.appspot.com",
     messagingSenderId: "123456789...",
     appId: "1:123456789:web:..."
   };
   ```

#### Step 3: Enable Cloud Firestore & Storage (1-Click)
1. In the left sidebar under **Build**, click **Firestore Database** -> Click **"Create database"** -> Select **"Start in test mode"** (allows both of you to read and upload photos) -> Click **Next** -> Choose a region (e.g. `nam5` or `asia-south1`) -> Click **Enable**.
2. In the left sidebar under **Build**, click **Storage** -> Click **"Get started"** -> Select **"Start in test mode"** -> Click **Next** -> Click **Done**.

#### Step 4: Paste Into Your Website!
You have **two easy options**:

- **Option A (Right from the Website UI — Recommended)**:
  1. Open your birthday website in the browser.
  2. Click the **"☁️ Cloud DB"** button in the top navigation bar (or inside the **Customize ⚙️** drawer).
  3. Paste your entire `const firebaseConfig = { ... };` snippet into the **"🪄 Quick Auto-Fill"** box.
  4. Click **"⚡ Auto-Fill Fields"** (it will automatically populate all fields).
  5. (Optional) Click **"🧪 Test Connection"** to verify everything is working.
  6. Click **"Save & Connect Cloud ❤️"**.
  7. You will immediately see the glowing green badge: **"🟢 Live Cloud Active (Lifetime Sync)"**!

- **Option B (In Code)**:
  1. Open [`firebase-config.js`](file:///d:/CLIENT%20PROJECT/birthday%2029th/New%20folder/firebase-config.js).
  2. Paste your keys inside `window.DEFAULT_FIREBASE_CONFIG`.
  3. Save the file. Done!

---

### 📱 Features You Get
- **Lifetime Image Storage**: Images stay permanently until either of you chooses to click the 🗑️ delete button.
- **Cross-Device Real-Time Sync**: If she uploads a picture from her iPhone or Android, your screen instantly receives and displays it without reloading!
- **Zero Storage Quota Warnings**: Photos are hosted in Google Cloud Storage, so you will never get a "Storage limit reached" error on your phone.
- **Offline Fallback**: Even without an active internet connection, photos are saved into your device's high-capacity **IndexedDB** database.
