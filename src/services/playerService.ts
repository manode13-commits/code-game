import { db } from './firebase';
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

/**
 * Save / Update Player in Firebase Firestore & Local Storage
 */
export async function savePlayerRecord(player: Partial<PlayerRecord> & { name: string }): Promise<PlayerRecord> {
  const playerId = player.id || `player_${player.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
  const now = new Date().toISOString();

  const record: PlayerRecord = {
    id: playerId,
    name: player.name,
    deviceMode: player.deviceMode || 'desktop',
    unlockedLevelIndex: Number(player.unlockedLevelIndex ?? player.completedLevels ?? 0),
    completedLevels: Number(player.completedLevels ?? 0),
    totalScore: Number(player.totalScore ?? 0),
    maxCombo: Number(player.maxCombo ?? 0),
    createdAt: player.createdAt || now,
    lastActiveAt: now,
    completedAt: player.completedAt,
    certificateIssued: player.certificateIssued,
    certificateId: player.certificateId,
  };

  // 1. Update Local Storage Cache immediately
  const localList = getLocalCache<PlayerRecord>(LOCAL_PLAYERS_KEY);
  const existingIdx = localList.findIndex(p => p.id === playerId || p.name === player.name);
  if (existingIdx >= 0) {
    localList[existingIdx] = { ...localList[existingIdx], ...record };
  } else {
    localList.unshift(record);
  }
  setLocalCache(LOCAL_PLAYERS_KEY, localList);

  // 2. Persist to Firebase Firestore if online/available
  if (db) {
    try {
      const playerDocRef = doc(collection(db, 'players'), playerId);
      await setDoc(playerDocRef, record, { merge: true });
    } catch (err) {
      console.warn('Could not sync player to Firestore (cached locally):', err);
    }
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
      await setDoc(certDocRef, fullCert, { merge: true });
    } catch (err) {
      console.warn('Could not sync certificate to Firestore (cached locally):', err);
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
      const q = query(collection(db, 'players'), orderBy('totalScore', 'desc'), limit(300));
      const snap = await getDocs(q);
      const remoteList: PlayerRecord[] = [];
      snap.forEach(docSnap => {
        remoteList.push(docSnap.data() as PlayerRecord);
      });

      if (remoteList.length > 0) {
        const mergedMap = new Map<string, PlayerRecord>();
        [...remoteList, ...localList].forEach(p => mergedMap.set(p.id, p));
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

  return activeList.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
}

/**
 * Fetch a specific player record to resume their saved progress
 */
export async function fetchPlayerByName(name: string): Promise<PlayerRecord | null> {
  if (!name.trim()) return null;
  const all = await fetchAllPlayers();
  const found = all.find(p => p.name.trim().toLowerCase() === name.trim().toLowerCase());
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

