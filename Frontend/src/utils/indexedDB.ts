/**
 * IndexedDB storage abstraction for large GIS files and profile avatars.
 * Prevents exceeding localStorage 5MB quota and maintains fast memory performance.
 */

const DB_NAME = "CadastraSpatialDB";
const DB_VERSION = 1;
const STORE_FILES = "uploaded_files";
const STORE_AVATARS = "user_avatars";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_FILES)) {
        db.createObjectStore(STORE_FILES, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_AVATARS)) {
        db.createObjectStore(STORE_AVATARS, { keyPath: "userId" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredFileRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  blob: Blob;
  status: "ready" | "processing" | "error";
}

// File Operations
export async function saveFileToIndexedDB(fileRecord: StoredFileRecord): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_FILES, "readwrite");
    const store = tx.objectStore(STORE_FILES);
    const req = store.put(fileRecord);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getFileFromIndexedDB(id: string): Promise<StoredFileRecord | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_FILES, "readonly");
    const store = tx.objectStore(STORE_FILES);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllFilesFromIndexedDB(): Promise<StoredFileRecord[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_FILES, "readonly");
    const store = tx.objectStore(STORE_FILES);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteFileFromIndexedDB(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_FILES, "readwrite");
    const store = tx.objectStore(STORE_FILES);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Avatar Operations
export async function saveAvatarToIndexedDB(userId: string, imageBlob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_AVATARS, "readwrite");
    const store = tx.objectStore(STORE_AVATARS);
    const req = store.put({ userId, blob: imageBlob, updatedAt: new Date().toISOString() });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getAvatarFromIndexedDB(userId: string): Promise<string | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_AVATARS, "readonly");
    const store = tx.objectStore(STORE_AVATARS);
    const req = store.get(userId);
    req.onsuccess = () => {
      if (req.result && req.result.blob) {
        const url = URL.createObjectURL(req.result.blob);
        resolve(url);
      } else {
        resolve(undefined);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function removeAvatarFromIndexedDB(userId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_AVATARS, "readwrite");
    const store = tx.objectStore(STORE_AVATARS);
    const req = store.delete(userId);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
