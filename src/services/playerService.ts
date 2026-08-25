import { db, testFirebaseConnection } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';


export interface PlayerRecord {
  id: string;
  name: string;
  deviceMode?: 'desktop' | 'mobile';
  unlockedLevelIndex?: number;
  completedLevels: number;
  totalScore: number;
  maxCombo: number;
  createdAt?: string;
  lastActiveAt?: string;
  completedAt?: string;
  certificateIssued?: boolean;
  certificateId?: string;
}

export interface CertificateRecord {
  id: string; // e.g. KPSW-80L-XXXX
  certificateId?: string;
  studentName: string;
  totalScore: number;
  maxCombo: number;
  completedLevels?: number;
  completedLevelsCount?: number;
  issuedAt?: string;
  issuedDate?: string;
  formattedThaiDate?: string;
}

const LOCAL_PLAYERS_KEY = 'kpsw_firebase_players_cache_v2';
const LOCAL_CERTS_KEY = 'kpsw_firebase_certificates_cache_v2';

// 24 hours retention limit in milliseconds (1 day)
export const INCOMPLETE_RETENTION_MS = 24 * 60 * 60 * 1000;

/**
 * Check if an uncompleted player session has expired (inactive for more than 1 day / 24 hours)
 * Note: Completed players with 80 levels / certificates NEVER expire!
 */
export function isPlayerSessionExpired(player: PlayerRecord): boolean {
  const isCompleted = (player.completedLevels ?? 0) >= 80 || !!player.certificateIssued || !!player.certificateId;
  if (isCompleted) {
    return false; // Preserved permanently
  }

  const timestampStr = player.lastActiveAt || player.createdAt;
  if (!timestampStr) return false;

  const lastActiveTime = new Date(timestampStr).getTime();
  if (isNaN(lastActiveTime)) return false;

  return Date.now() - lastActiveTime > INCOMPLETE_RETENTION_MS;
}

// Helper to get local cache
function getLocalCache<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Helper to set local cache
function setLocalCache<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to set localStorage cache:', e);
  }
}

// Helper to sanitize objects for Firestore (removes undefined values completely)
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val !== undefined) {
      result[key] = val;
    }
  });
  return result;
}

export function getPlayerDocId(name: string): string {
  const clean = (name || '').trim().replace(/[\/\.\s#$\[\]]+/g, '_').toLowerCase();
  return `p_${clean || 'guest'}`;
}

/**
 * Save / Update Player in Firebase Firestore & Local Storage
 */
export async function savePlayerRecord(player: Partial<PlayerRecord> & { name: string }): Promise<PlayerRecord> {
  const name = (player.name || '').trim();
  if (!name) {
    throw new Error('Player name is required');
  }

  const playerId = player.id || getPlayerDocId(name);
  const now = new Date().toISOString();

  const record: PlayerRecord = {
    id: playerId,
    name: name,
    deviceMode: player.deviceMode || 'desktop',
    unlockedLevelIndex: Number(player.unlockedLevelIndex ?? player.completedLevels ?? 0),
    completedLevels: Number(player.completedLevels ?? 0),
    totalScore: Number(player.totalScore ?? 0),
    maxCombo: Number(player.maxCombo ?? 0),
    createdAt: player.createdAt || now,
    lastActiveAt: now,
    completedAt: player.completedAt || undefined,
    certificateIssued: typeof player.certificateIssued === 'boolean' ? player.certificateIssued : undefined,
    certificateId: player.certificateId || undefined,
  };

  // 1. Update Local Storage Cache immediately
  const localList = getLocalCache<PlayerRecord>(LOCAL_PLAYERS_KEY);
  const existingIdx = localList.findIndex(p => p.id === playerId || p.name.trim().toLowerCase() === name.toLowerCase());
  if (existingIdx >= 0) {
    localList[existingIdx] = { ...localList[existingIdx], ...record };
  } else {
    localList.unshift(record);
  }
  setLocalCache(LOCAL_PLAYERS_KEY, localList);

  // 2. Persist to Firebase Firestore without any undefined fields
  if (db) {
    try {
      const playerDocRef = doc(collection(db, 'players'), playerId);
      const firestoreData = sanitizeForFirestore({
        id: playerId,
        name: name,
        deviceMode: record.deviceMode,
        unlockedLevelIndex: record.unlockedLevelIndex,
        completedLevels: record.completedLevels,
        totalScore: record.totalScore,
        maxCombo: record.maxCombo,
        createdAt: record.createdAt,
        lastActiveAt: record.lastActiveAt,
        ...(record.completedAt ? { completedAt: record.completedAt } : {}),
        ...(typeof record.certificateIssued === 'boolean' ? { certificateIssued: record.certificateIssued } : {}),
        ...(record.certificateId ? { certificateId: record.certificateId } : {}),
      });

      await setDoc(playerDocRef, firestoreData, { merge: true });
      console.log('✅ บันทึกผู้เล่นลง Firestore สำเร็จ:', name, `(Doc ID: ${playerId})`, firestoreData);
    } catch (err) {
      console.error('❌ ไม่สามารถบันทึกผู้เล่นลง Firestore ได้:', err);
    }
  } else {
    console.warn('⚠️ Firestore db is not initialized, saved to local cache');
  }

  return record;
}

/**
 * Save Issued Certificate to Firebase Firestore & Local Storage
 */
export async function saveCertificateRecord(cert: Partial<CertificateRecord> & { studentName: string; totalScore: number }): Promise<CertificateRecord> {
  // Generate a clean verification code e.g. KPSW-80L-7892
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const certId = cert.certificateId || cert.id || `KPSW-80L-${randomSuffix}`;
  const now = new Date();
  const thaiYear = now.getFullYear() + 543;
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
  ];
  const thaiFormatted = `${now.getDate()} ${thaiMonths[now.getMonth()]} พ.ศ. ${thaiYear}`;

  const fullCert: CertificateRecord = {
    id: certId,
    certificateId: certId,
    studentName: cert.studentName,
    totalScore: Number(cert.totalScore || 0),
    maxCombo: Number(cert.maxCombo || 0),
    completedLevels: Number(cert.completedLevels || cert.completedLevelsCount || 80),
    completedLevelsCount: Number(cert.completedLevelsCount || cert.completedLevels || 80),
    issuedAt: cert.issuedAt || now.toISOString(),
    issuedDate: cert.issuedDate || thaiFormatted,
    formattedThaiDate: cert.formattedThaiDate || thaiFormatted,
  };

  // 1. Update Local Storage Cache immediately
  const localCerts = getLocalCache<CertificateRecord>(LOCAL_CERTS_KEY);
  const existingIdx = localCerts.findIndex(c => c.id === certId || (c.studentName === cert.studentName && c.totalScore === cert.totalScore));
  if (existingIdx >= 0) {
    localCerts[existingIdx] = fullCert;
  } else {
    localCerts.unshift(fullCert);
  }
  setLocalCache(LOCAL_CERTS_KEY, localCerts);

  // 2. Persist to Firebase Firestore
  if (db) {
    try {
      const certDocRef = doc(collection(db, 'certificates'), certId);
      const firestoreCert = sanitizeForFirestore(fullCert);
      await setDoc(certDocRef, firestoreCert, { merge: true });
      console.log('✅ บันทึกใบเกียรติบัตรลง Firestore สำเร็จ:', cert.studentName, `(ID: ${certId})`);
    } catch (err) {
      console.error('❌ ไม่สามารถบันทึกใบเกียรติบัตรลง Firestore ได้:', err);
    }
  }

  return fullCert;
}

/**
 * Get all issued certificates from Firestore or local cache
 */
export async function fetchAllCertificates(): Promise<CertificateRecord[]> {
  const localList = getLocalCache<CertificateRecord>(LOCAL_CERTS_KEY);

  if (db) {
    try {
      const q = query(collection(db, 'certificates'), orderBy('issuedAt', 'desc'), limit(200));
      const snap = await getDocs(q);
      const remoteList: CertificateRecord[] = [];
      snap.forEach(docSnap => {
        remoteList.push(docSnap.data() as CertificateRecord);
      });

      if (remoteList.length > 0) {
        // Merge with local cache
        const mergedMap = new Map<string, CertificateRecord>();
        [...remoteList, ...localList].forEach(c => mergedMap.set(c.id, c));
        const merged = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
        );
        setLocalCache(LOCAL_CERTS_KEY, merged);
        return merged;
      }
    } catch (err) {
      console.warn('Firestore fetch certificates error, using cache:', err);
    }
  }

  return localList;
}

/**
 * Search certificates by student name or certificate ID
 */
export async function searchCertificates(searchQuery: string): Promise<CertificateRecord[]> {
  const all = await fetchAllCertificates();
  if (!searchQuery.trim()) return all;

  const q = searchQuery.trim().toLowerCase();
  return all.filter(c => 
    c.studentName.toLowerCase().includes(q) || 
    c.id.toLowerCase().includes(q)
  );
}

/**
 * Fetch a single certificate by ID
 */
export async function fetchCertificateById(certId: string): Promise<CertificateRecord | null> {
  const localList = getLocalCache<CertificateRecord>(LOCAL_CERTS_KEY);
  const found = localList.find(c => c.id.toLowerCase() === certId.trim().toLowerCase());
  if (found) return found;

  if (db) {
    try {
      const docRef = doc(collection(db, 'certificates'), certId.trim());
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as CertificateRecord;
      }
    } catch (err) {
      console.warn('Firestore fetch single certificate error:', err);
    }
  }

  return null;
}

/**
 * Fetch all registered players from Firestore / local cache.
 * Automatically purges uncompleted players whose last activity was > 24 hours ago.
 */
export async function fetchAllPlayers(): Promise<PlayerRecord[]> {
  const localList = getLocalCache<PlayerRecord>(LOCAL_PLAYERS_KEY);

  let mergedList: PlayerRecord[] = localList;

  if (db) {
    try {
      // Query without strict single-field ordering to ensure newly created players (with 0 score) are included
      const q = query(collection(db, 'players'), limit(300));
      const snap = await getDocs(q);
      const remoteList: PlayerRecord[] = [];
      snap.forEach(docSnap => {
        const data = docSnap.data() as PlayerRecord;
        if (data && (data.name || data.id)) {
          remoteList.push(data);
        }
      });

      if (remoteList.length > 0) {
        const mergedMap = new Map<string, PlayerRecord>();
        // Remote data takes priority, merged with local cache
        localList.forEach(p => mergedMap.set(p.name?.trim().toLowerCase() || p.id, p));
        remoteList.forEach(p => mergedMap.set(p.name?.trim().toLowerCase() || p.id, p));
        mergedList = Array.from(mergedMap.values());
      }
    } catch (err) {
      console.warn('Firestore fetch players error, using cache:', err);
    }
  }

  // Filter out incomplete players that have been inactive for more than 24 hours (1 day)
  const activeList: PlayerRecord[] = [];
  const expiredPlayerIds: string[] = [];

  mergedList.forEach(player => {
    if (isPlayerSessionExpired(player)) {
      expiredPlayerIds.push(player.id);
    } else {
      activeList.push(player);
    }
  });

  // Asynchronously clean up expired in-progress players from Firestore & cache
  if (expiredPlayerIds.length > 0) {
    setLocalCache(LOCAL_PLAYERS_KEY, activeList);
    if (db) {
      expiredPlayerIds.forEach(id => {
        try {
          deleteDoc(doc(collection(db, 'players'), id)).catch(() => {});
        } catch {}
      });
    }
  } else {
    setLocalCache(LOCAL_PLAYERS_KEY, activeList);
  }

  return activeList.sort((a, b) => {
    const scoreDiff = (b.totalScore || 0) - (a.totalScore || 0);
    if (scoreDiff !== 0) return scoreDiff;
    const timeB = new Date(b.lastActiveAt || b.createdAt || 0).getTime();
    const timeA = new Date(a.lastActiveAt || a.createdAt || 0).getTime();
    return timeB - timeA;
  });
}

/**
 * Fetch a specific player record to resume their saved progress
 */
export async function fetchPlayerByName(name: string): Promise<PlayerRecord | null> {
  const cleanName = (name || '').trim();
  if (!cleanName) return null;

  // 1. Try direct Firestore getDoc by ID for fast lookup
  if (db) {
    try {
      const docId = getPlayerDocId(cleanName);
      const docRef = doc(collection(db, 'players'), docId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as PlayerRecord;
      }
    } catch (err) {
      console.warn('Firestore direct player lookup note:', err);
    }
  }

  // 2. Fallback to scanning all players
  const all = await fetchAllPlayers();
  const found = all.find(p => (p.name || '').trim().toLowerCase() === cleanName.toLowerCase());
  return found || null;
}

export interface PlayerHistoryEntry {
  id: string;
  studentName: string;
  completedLevels: number;
  totalScore: number;
  maxCombo: number;
  isComplete80: boolean;
  certificate?: CertificateRecord | null;
  lastActiveAt?: string;
  createdAt?: string;
  formattedDate?: string;
}

/**
 * Fetch unified player entries combining all players who entered to play and their certificate eligibility
 */
export async function fetchPlayerHistoryEntries(): Promise<PlayerHistoryEntry[]> {
  const [allPlayers, allCerts] = await Promise.all([
    fetchAllPlayers(),
    fetchAllCertificates(),
  ]);

  // Create a map of certificates by student name and ID
  const certsByNameMap = new Map<string, CertificateRecord>();
  allCerts.forEach(c => {
    certsByNameMap.set(c.studentName.trim().toLowerCase(), c);
  });

  const entryMap = new Map<string, PlayerHistoryEntry>();

  // 1. Process all registered players
  allPlayers.forEach(player => {
    if (!player.name || !player.name.trim()) return;
    const normName = player.name.trim().toLowerCase();
    const cert = certsByNameMap.get(normName);
    const completedCount = Number(player.completedLevels ?? player.unlockedLevelIndex ?? 0);
    const isComplete = completedCount >= 80 || !!cert || !!player.certificateIssued;

    let certRecord: CertificateRecord | null = null;
    if (isComplete) {
      if (cert) {
        certRecord = cert;
      } else {
        const now = new Date(player.completedAt || player.lastActiveAt || Date.now());
        const thaiYear = now.getFullYear() + 543;
        const thaiMonths = [
          'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
          'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
        ];
        const thaiDate = `${now.getDate()} ${thaiMonths[now.getMonth()]} พ.ศ. ${thaiYear}`;
        certRecord = {
          id: player.certificateId || `KPSW-80L-${Math.floor(1000 + Math.random() * 9000)}`,
          studentName: player.name,
          totalScore: player.totalScore,
          maxCombo: player.maxCombo,
          completedLevels: 80,
          completedLevelsCount: 80,
          issuedAt: player.completedAt || player.lastActiveAt || now.toISOString(),
          issuedDate: thaiDate,
          formattedThaiDate: thaiDate,
        };
      }
    }

    const dateToFormat = player.lastActiveAt || player.createdAt || (cert ? cert.issuedAt : new Date().toISOString());
    const d = new Date(dateToFormat);
    const formattedDate = !isNaN(d.getTime())
      ? `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear() + 543} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} น.`
      : '-';

    entryMap.set(normName, {
      id: player.id || `player_${normName}`,
      studentName: player.name,
      completedLevels: Math.min(completedCount, 80),
      totalScore: Number(player.totalScore || (cert ? cert.totalScore : 0)),
      maxCombo: Number(player.maxCombo || (cert ? cert.maxCombo : 0)),
      isComplete80: isComplete,
      certificate: certRecord,
      lastActiveAt: player.lastActiveAt,
      createdAt: player.createdAt,
      formattedDate,
    });
  });

  // 2. Include certificates whose players might not have been recorded separately
  allCerts.forEach(cert => {
    if (!cert.studentName || !cert.studentName.trim()) return;
    const normName = cert.studentName.trim().toLowerCase();
    if (!entryMap.has(normName)) {
      const d = new Date(cert.issuedAt || Date.now());
      const formattedDate = !isNaN(d.getTime())
        ? `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear() + 543} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} น.`
        : (cert.formattedThaiDate || '-');

      entryMap.set(normName, {
        id: `cert_${cert.id}`,
        studentName: cert.studentName,
        completedLevels: 80,
        totalScore: Number(cert.totalScore || 0),
        maxCombo: Number(cert.maxCombo || 0),
        isComplete80: true,
        certificate: cert,
        lastActiveAt: cert.issuedAt,
        formattedDate,
      });
    }
  });

  return Array.from(entryMap.values()).sort((a, b) => {
    if (a.isComplete80 !== b.isComplete80) {
      return a.isComplete80 ? -1 : 1;
    }
    return b.totalScore - a.totalScore;
  });
}

export { testFirebaseConnection };

/**
 * Subscribe to real-time player updates from Firestore
 */
export function subscribeToPlayers(callback: (players: PlayerRecord[]) => void): () => void {
  if (!db) {
    callback(getLocalCache<PlayerRecord>(LOCAL_PLAYERS_KEY));
    return () => {};
  }
  try {
    const q = query(collection(db, 'players'), orderBy('totalScore', 'desc'), limit(300));
    return onSnapshot(q, (snap) => {
      const remoteList: PlayerRecord[] = [];
      snap.forEach((d) => remoteList.push(d.data() as PlayerRecord));
      if (remoteList.length > 0) {
        setLocalCache(LOCAL_PLAYERS_KEY, remoteList);
        callback(remoteList);
      } else {
        callback(getLocalCache<PlayerRecord>(LOCAL_PLAYERS_KEY));
      }
    }, (err) => {
      console.warn('Real-time players snapshot listener error:', err);
      callback(getLocalCache<PlayerRecord>(LOCAL_PLAYERS_KEY));
    });
  } catch (err) {
    console.warn('Could not setup players snapshot listener:', err);
    callback(getLocalCache<PlayerRecord>(LOCAL_PLAYERS_KEY));
    return () => {};
  }
}

/**
 * Subscribe to real-time certificates updates from Firestore
 */
export function subscribeToCertificates(callback: (certs: CertificateRecord[]) => void): () => void {
  if (!db) {
    callback(getLocalCache<CertificateRecord>(LOCAL_CERTS_KEY));
    return () => {};
  }
  try {
    const q = query(collection(db, 'certificates'), orderBy('issuedAt', 'desc'), limit(200));
    return onSnapshot(q, (snap) => {
      const remoteList: CertificateRecord[] = [];
      snap.forEach((d) => remoteList.push(d.data() as CertificateRecord));
      if (remoteList.length > 0) {
        setLocalCache(LOCAL_CERTS_KEY, remoteList);
        callback(remoteList);
      } else {
        callback(getLocalCache<CertificateRecord>(LOCAL_CERTS_KEY));
      }
    }, (err) => {
      console.warn('Real-time certs snapshot listener error:', err);
      callback(getLocalCache<CertificateRecord>(LOCAL_CERTS_KEY));
    });
  } catch (err) {
    console.warn('Could not setup certs snapshot listener:', err);
    callback(getLocalCache<CertificateRecord>(LOCAL_CERTS_KEY));
    return () => {};
  }
}


