import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Support both generated firebase-applet-config.json and environment variables
const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

const firebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey || env.VITE_FIREBASE_API_KEY || 'demo-kpsw-coding-quest-api-key',
  authDomain: firebaseAppletConfig.authDomain || env.VITE_FIREBASE_AUTH_DOMAIN || 'kpsw-coding-quest.firebaseapp.com',
  projectId: firebaseAppletConfig.projectId || env.VITE_FIREBASE_PROJECT_ID || 'kpsw-coding-quest-2026',
  storageBucket: firebaseAppletConfig.storageBucket || env.VITE_FIREBASE_STORAGE_BUCKET || 'kpsw-coding-quest-2026.appspot.com',
  messagingSenderId: firebaseAppletConfig.messagingSenderId || env.VITE_FIREBASE_MESSAGING_SENDER_ID || '687317091921',
  appId: firebaseAppletConfig.appId || env.VITE_FIREBASE_APP_ID || '1:687317091921:web:9069cf8570166d5d3a5a70',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let isFirebaseInitialized = false;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize Firestore with specific databaseId if specified in config, otherwise default
  const databaseId = firebaseAppletConfig.firestoreDatabaseId;
  if (databaseId && databaseId !== '(default)') {
    try {
      db = getFirestore(app, databaseId);
    } catch {
      db = getFirestore(app);
    }
  } else {
    db = getFirestore(app);
  }
  
  isFirebaseInitialized = true;
} catch (err) {
  console.warn('Firebase initialization notice (falling back to hybrid local sync):', err);
}

export { app, db, isFirebaseInitialized };
