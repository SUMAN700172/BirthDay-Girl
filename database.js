/**
 * ============================================================================
 * "FOR YOU, MY LOVE ❤️" — UNIFIED LIFETIME DATABASE ENGINE (Cloud + Offline)
 * ============================================================================
 * Features:
 * 1. Google Firebase Cloud Storage & Firestore (Real-Time Cross-Device Sync)
 *    - Full-resolution photos stored forever in Google Cloud Storage.
 *    - Metadata (captions, tags, dates, categories) synced via Firestore.
 *    - Real-time listeners: photos uploaded on one phone appear instantly on the other!
 * 2. Persistent IndexedDB Engine (Zero-quota limits, 100% offline persistence)
 *    - Guaranteed lifetime storage on-device even before cloud keys are configured.
 * 3. Unified API: CloudDB.uploadPhoto(), CloudDB.deletePhoto(), CloudDB.init()
 * ============================================================================
 */

(function (window) {
  'use strict';

  // State
  const dbState = {
    isFirebaseReady: false,
    firestore: null,
    storage: null,
    indexedDb: null,
    unsubscribeRealtime: null
  };

  // ==========================================================================
  // 1. INDEXEDDB ENGINE (Offline Persistent Storage)
  // ==========================================================================
  const IDB_NAME = 'ForYouRomanticPhotosDB_v1';
  const IDB_STORE = 'photos';

  function openIndexedDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported on this browser.');
        resolve(null);
        return;
      }

      const request = indexedDB.open(IDB_NAME, 1);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          const store = db.createObjectStore(IDB_STORE, { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = (e) => {
        dbState.indexedDb = e.target.result;
        resolve(dbState.indexedDb);
      };

      request.onerror = (e) => {
        console.error('IndexedDB open error:', e);
        resolve(null);
      };
    });
  }

  function savePhotoToIndexedDB(photo) {
    return new Promise((resolve) => {
      if (!dbState.indexedDb) {
        resolve(false);
        return;
      }
      try {
        const tx = dbState.indexedDb.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.put(photo);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (err) {
        console.warn('IndexedDB put error:', err);
        resolve(false);
      }
    });
  }

  function getAllPhotosFromIndexedDB() {
    return new Promise((resolve) => {
      if (!dbState.indexedDb) {
        resolve([]);
        return;
      }
      try {
        const tx = dbState.indexedDb.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (err) {
        resolve([]);
      }
    });
  }

  function deletePhotoFromIndexedDB(id) {
    return new Promise((resolve) => {
      if (!dbState.indexedDb) {
        resolve(false);
        return;
      }
      try {
        const tx = dbState.indexedDb.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.delete(id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (err) {
        resolve(false);
      }
    });
  }

  // ==========================================================================
  // 2. FIREBASE CLOUD ENGINE (Real-Time Database & Storage)
  // ==========================================================================
  function getActiveFirebaseConfig() {
    // 1. Try saved custom config from localStorage
    const saved = localStorage.getItem('for_you_firebase_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.apiKey && parsed.projectId) {
          return parsed;
        }
      } catch (e) {
        console.warn('Invalid saved Firebase config');
      }
    }

    // 2. Try window.DEFAULT_FIREBASE_CONFIG from firebase-config.js
    if (window.DEFAULT_FIREBASE_CONFIG && window.DEFAULT_FIREBASE_CONFIG.apiKey && window.DEFAULT_FIREBASE_CONFIG.projectId) {
      return window.DEFAULT_FIREBASE_CONFIG;
    }

    return null;
  }

  function initFirebase() {
    const config = getActiveFirebaseConfig();
    if (!config || !window.firebase) {
      dbState.isFirebaseReady = false;
      updateCloudStatusUI(false);
      return false;
    }

    try {
      // Check if already initialized
      let app;
      if (!firebase.apps.length) {
        app = firebase.initializeApp(config);
      } else {
        app = firebase.app();
      }

      dbState.firestore = firebase.firestore(app);
      dbState.storage = firebase.storage(app);
      dbState.isFirebaseReady = true;

      updateCloudStatusUI(true);
      startRealtimeSync();
      return true;
    } catch (err) {
      console.warn('Firebase initialization error:', err);
      dbState.isFirebaseReady = false;
      updateCloudStatusUI(false);
      return false;
    }
  }

  // Real-Time Listener: When photos are added/deleted from ANY device, sync immediately!
  function startRealtimeSync() {
    if (!dbState.isFirebaseReady || !dbState.firestore) return;

    if (dbState.unsubscribeRealtime) {
      dbState.unsubscribeRealtime();
    }

    try {
      dbState.unsubscribeRealtime = dbState.firestore
        .collection('romantic_photos')
        .orderBy('createdAt', 'asc')
        .onSnapshot(
          (snapshot) => {
            const cloudPhotos = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              cloudPhotos.push({
                id: doc.id,
                src: data.src,
                caption: data.caption || '',
                date: data.date || '',
                tag: data.tag || '',
                location: data.location || '',
                category: data.category || 'her',
                createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
              });
            });

            // Dispatch event to main logic engine
            window.dispatchEvent(
              new CustomEvent('cloud-photos-updated', {
                detail: { photos: cloudPhotos }
              })
            );
          },
          (error) => {
            console.warn('Firebase real-time sync notice:', error.message);
          }
        );
    } catch (e) {
      console.warn('Could not attach real-time listener:', e);
    }
  }

  // Upload Photo to Firebase Storage and Save Record in Firestore
  async function uploadToCloud({ file, base64, category, caption, date, tag, location }) {
    if (!dbState.isFirebaseReady || !dbState.storage || !dbState.firestore) {
      throw new Error('Firebase cloud is not configured or ready.');
    }

    const photoId = 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const fileName = `${photoId}.jpg`;
    const storageRef = dbState.storage.ref().child(`uploads/${fileName}`);

    let uploadTask;
    // Prefer uploading base64 data_url because it has already been smoothly compressed for web/mobile
    if (base64) {
      uploadTask = await storageRef.putString(base64, 'data_url');
    } else if (file) {
      uploadTask = await storageRef.put(file, { contentType: file.type || 'image/jpeg' });
    } else {
      throw new Error('No image payload provided.');
    }

    const downloadUrl = await uploadTask.ref.getDownloadURL();

    // Store metadata document in Firestore
    const photoDoc = {
      src: downloadUrl,
      category: category || 'her',
      caption: caption || 'A beautiful memory ❤️',
      date: date || 'October 2026',
      tag: tag || (category === 'her' ? 'Radiant ✨' : ''),
      location: location || (category === 'couple' ? 'Together' : ''),
      storagePath: `uploads/${fileName}`,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    await dbState.firestore.collection('romantic_photos').doc(photoId).set(photoDoc);

    return {
      id: photoId,
      ...photoDoc,
      src: downloadUrl,
      createdAt: new Date().toISOString()
    };
  }

  // Delete Photo from Cloud
  async function deleteFromCloud(photoId) {
    if (!dbState.isFirebaseReady || !dbState.firestore) return false;

    try {
      const docRef = dbState.firestore.collection('romantic_photos').doc(photoId);
      const doc = await docRef.get();
      if (doc.exists) {
        const data = doc.data();
        if (data.storagePath && dbState.storage) {
          try {
            await dbState.storage.ref().child(data.storagePath).delete();
          } catch (storageErr) {
            console.warn('Storage file deletion note:', storageErr);
          }
        }
        await docRef.delete();
      }
      return true;
    } catch (err) {
      console.error('Delete from cloud error:', err);
      return false;
    }
  }

  // Live Test Firebase Connection
  async function testConnection(customConfig) {
    if (!window.firebase) {
      return { success: false, message: 'Firebase library not loaded.' };
    }
    const config = customConfig || getActiveFirebaseConfig();
    if (!config || !config.apiKey || !config.projectId) {
      return { success: false, message: 'Please enter at least API Key and Project ID.' };
    }

    try {
      const testAppName = 'test-app-' + Date.now();
      const testApp = firebase.initializeApp(config, testAppName);
      const testFirestore = firebase.firestore(testApp);

      // Verify connection by reading collection
      await testFirestore.collection('romantic_photos').limit(1).get();

      // Clean up test app
      await testApp.delete();

      return {
        success: true,
        message: '🎉 Cloud connection successful! Google Firestore is live and ready for lifetime photo sync.'
      };
    } catch (err) {
      console.warn('Firebase test connection error:', err);
      let errMsg = err.message || err.toString();
      if (errMsg.includes('permission-denied') || errMsg.includes('insufficient permissions')) {
        errMsg = 'Permission denied. Please ensure Cloud Firestore is created in "Test Mode" in your Firebase console.';
      }
      return {
        success: false,
        message: 'Connection failed: ' + errMsg
      };
    }
  }

  // ==========================================================================
  // 3. UNIFIED PUBLIC DATABASE INTERFACE (CloudDB)
  // ==========================================================================
  const CloudDB = {
    async init() {
      await openIndexedDB();
      const fbSuccess = initFirebase();
      return { isCloudActive: fbSuccess };
    },

    isCloudActive() {
      return dbState.isFirebaseReady;
    },

    getActiveConfig() {
      return getActiveFirebaseConfig();
    },

    saveConfig(configObj) {
      if (!configObj || !configObj.apiKey) {
        localStorage.removeItem('for_you_firebase_config');
      } else {
        localStorage.setItem('for_you_firebase_config', JSON.stringify(configObj));
      }
      return initFirebase();
    },

    testConnection,

    async uploadPhoto({ file, base64, category, caption, date, tag, location }) {
      const photoId = 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      const localPhotoRecord = {
        id: photoId,
        src: base64,
        category: category || 'her',
        caption: caption || 'A beautiful memory ❤️',
        date: date || 'October 2026',
        tag: tag || (category === 'her' ? 'Radiant ✨' : ''),
        location: location || (category === 'couple' ? 'Together' : ''),
        createdAt: new Date().toISOString()
      };

      // 1. Always save in persistent IndexedDB first (guarantees offline availability)
      await savePhotoToIndexedDB(localPhotoRecord);

      // 2. If Firebase Cloud is configured, upload to Google Cloud for lifetime sync!
      if (dbState.isFirebaseReady) {
        try {
          const cloudRecord = await uploadToCloud({
            file,
            base64,
            category,
            caption,
            date,
            tag,
            location
          });
          // Update local IndexedDB with cloud URL
          await savePhotoToIndexedDB(cloudRecord);
          return { success: true, photo: cloudRecord, cloudSynced: true };
        } catch (cloudErr) {
          console.warn('Cloud upload failed, preserved in local IndexedDB:', cloudErr);
          return { success: true, photo: localPhotoRecord, cloudSynced: false, error: cloudErr.message };
        }
      }

      return { success: true, photo: localPhotoRecord, cloudSynced: false };
    },

    async deletePhoto(photoId) {
      // 1. Delete from local IndexedDB
      await deletePhotoFromIndexedDB(photoId);

      // 2. Delete from Firebase Cloud if active
      if (dbState.isFirebaseReady) {
        await deleteFromCloud(photoId);
      }

      return true;
    },

    async getLocalPhotos() {
      return await getAllPhotosFromIndexedDB();
    },

    updateCloudStatusUI
  };

  // ==========================================================================
  // 4. UI STATUS UPDATER
  // ==========================================================================
  function updateCloudStatusUI(isConnected) {
    const btn = document.getElementById('btn-cloud-sync');
    const badge = document.getElementById('cloud-sync-status-badge');
    const text = document.getElementById('cloud-sync-text');
    const icon = document.getElementById('cloud-sync-icon');
    const dot = document.getElementById('cloud-indicator-dot');
    const explainer = document.getElementById('cloud-status-explainer');
    const drawerBadge = document.getElementById('drawer-cloud-status-badge');
    const disconnectBtn = document.getElementById('btn-disconnect-cloud');

    if (btn) {
      btn.classList.toggle('cloud-connected', !!isConnected);
      btn.classList.toggle('cloud-offline', !isConnected);
    }

    if (dot) {
      dot.className = isConnected ? 'cloud-indicator-dot online' : 'cloud-indicator-dot offline';
    }

    if (badge) {
      if (isConnected) {
        badge.innerHTML = `<span class="status-dot green"></span> Live Cloud Active (Lifetime Sync)`;
        badge.className = 'status-indicator-badge connected';
      } else {
        badge.innerHTML = `<span class="status-dot yellow"></span> Local Storage (Offline Mode)`;
        badge.className = 'status-indicator-badge offline';
      }
    }

    if (explainer) {
      if (isConnected) {
        explainer.innerHTML = `<strong>✨ Lifetime Google Cloud Storage is Active!</strong> Any photograph uploaded by you or Priyanka from any phone or computer will synchronize instantly and stay preserved permanently.`;
      } else {
        explainer.innerHTML = `Photos you upload right now are saved safely on this device via high-capacity IndexedDB. Connect your free Firebase project below to make all photos sync to her phone in real time and stay saved for a lifetime!`;
      }
    }

    if (drawerBadge) {
      if (isConnected) {
        drawerBadge.innerHTML = `<span class="status-dot green"></span> Live Cloud Active`;
        drawerBadge.className = 'drawer-cloud-status connected';
      } else {
        drawerBadge.innerHTML = `<span class="status-dot yellow"></span> Local Storage`;
        drawerBadge.className = 'drawer-cloud-status offline';
      }
    }

    if (disconnectBtn) {
      disconnectBtn.style.display = isConnected ? 'inline-flex' : 'none';
    }

    if (text) {
      text.textContent = isConnected ? 'Cloud Sync' : 'Cloud DB';
    }

    if (icon) {
      icon.textContent = '☁️';
    }
  }

  // Export to window
  window.CloudDB = CloudDB;

})(window);
