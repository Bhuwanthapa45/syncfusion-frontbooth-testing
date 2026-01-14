const DB_NAME = 'DocManagerDB';
const STORE_NAME = 'files';

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Error opening database');
  });
};

export const storeFile = async (file: File, customId?: string): Promise<string> => {
  const db = await initDB();
  const id = customId || crypto.randomUUID(); // Use provided ID or generate new one
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const request = store.put({ id, file, name: file.name, type: file.type });
    
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject('Error storing file');
  });
};

export const getFileFromDB = async (id: string): Promise<File | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.file : null);
    };
    request.onerror = () => reject('Error retrieving file');
  });
};