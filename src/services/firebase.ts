import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, doc, setDoc, getDoc, collection } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, Auth } from 'firebase/auth';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Support both generated firebase-applet-config.json and environment variables
const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

const firebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey || env.VITE_FIREBASE_API_KEY || 'demo-kpsw-coding-quest-api-key',
  authDomain: firebaseAppletConfig.authDomain || env.VITE_FIREBASE_AUTH_DOMAIN || 'gen-lang-client-0080548899.firebaseapp.com',
  projectId: firebaseAppletConfig.projectId || env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0080548899',
  storageBucket: firebaseAppletConfig.storageBucket || env.VITE_FIREBASE_STORAGE_BUCKET || 'gen-lang-client-0080548899.firebasestorage.app',
  messagingSenderId: firebaseAppletConfig.messagingSenderId || env.VITE_FIREBASE_MESSAGING_SENDER_ID || '687317091921',
  appId: firebaseAppletConfig.appId || env.VITE_FIREBASE_APP_ID || '1:687317091921:web:9069cf8570166d5d3a5a70',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
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

  // Initialize Firebase Auth & Anonymous Sign-in for seamless student session management
  try {
    auth = getAuth(app);
    signInAnonymously(auth).catch((authErr) => {
      console.info('Firebase anonymous auth note:', authErr?.message || authErr);
    });
  } catch (authInitErr) {
    console.info('Firebase auth setup note:', authInitErr);
  }
  
  isFirebaseInitialized = true;
} catch (err) {
  console.warn('Firebase initialization notice (falling back to hybrid local sync):', err);
}

export interface ConnectionStatus {
  online: boolean;
  message: string;
  databaseId?: string;
  projectId?: string;
  latencyMs?: number;
  lastChecked?: string;
}

/**
 * Ping and test real-time write/read connection to Cloud Firestore
 */
export async function testFirebaseConnection(): Promise<ConnectionStatus> {
  const start = Date.now();
  const dbId = firebaseAppletConfig.firestoreDatabaseId || '(default)';
  const projId = firebaseAppletConfig.projectId || 'gen-lang-client-0080548899';

  if (!db) {
    return {
      online: false,
      message: 'Firestore client is not initialized',
      databaseId: dbId,
      projectId: projId,
      lastChecked: new Date().toISOString(),
    };
  }

  try {
    const testDocRef = doc(collection(db, '_connection_test'), 'status');
    const nowIso = new Date().toISOString();
    await setDoc(testDocRef, {
      status: 'active',
      testedAt: nowIso,
      appName: 'KPSW Coding Quest 2026',
    }, { merge: true });

    const snap = await getDoc(testDocRef);
    const latencyMs = Date.now() - start;

    if (snap.exists()) {
      return {
        online: true,
        message: `เชื่อมต่อ Cloud Firestore สำเร็จ (${latencyMs}ms)`,
        databaseId: dbId,
        projectId: projId,
        latencyMs,
        lastChecked: nowIso,
      };
    } else {
      return {
        online: false,
        message: 'บันทึกสำเร็จแต่ไม่พบข้อมูลจากการอ่านกลับ',
        databaseId: dbId,
        projectId: projId,
        latencyMs,
        lastChecked: nowIso,
      };
    }
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : String(err);
    console.warn('Firebase Firestore test check:', errMessage);
    return {
      online: false,
      message: `ไม่สามารถเข้าถึง Firestore ได้: ${errMessage}`,
      databaseId: dbId,
      projectId: projId,
      latencyMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
    };
  }
}

export { app, db, auth, isFirebaseInitialized, firebaseAppletConfig };

