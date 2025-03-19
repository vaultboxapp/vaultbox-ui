// Opens the IndexedDB database
export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('VaultBoxDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('keys')) {
                db.createObjectStore('keys', { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Stores the private key in IndexedDB
export async function storePrivateKey(privateKey) {
    const db = await openDatabase();
    const transaction = db.transaction('keys', 'readwrite');
    const store = transaction.objectStore('keys');

    store.put({ id: 'privateKey', key: privateKey });
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => reject(transaction.error);
    });
}

// Retrieves the private key from IndexedDB
export async function getPrivateKey() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('keys', 'readonly');
        const store = transaction.objectStore('keys');
        const request = store.get('privateKey');

        request.onsuccess = () => resolve(request.result ? request.result.key : null);
        request.onerror = () => reject(request.error);
    });
}

// Store a per-channel encryption key (for group chats)
export async function storeChannelKey(channelId, key) {
    const db = await openDatabase();
    const transaction = db.transaction('keys', 'readwrite');
    const store = transaction.objectStore('keys');

    store.put({ id: `channel_${channelId}`, key });
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => reject(transaction.error);
    });
}

// Retrieve a channel encryption key
export async function getChannelKey(channelId) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('keys', 'readonly');
        const store = transaction.objectStore('keys');
        const request = store.get(`channel_${channelId}`);

        request.onsuccess = () => resolve(request.result ? request.result.key : null);
        request.onerror = () => reject(request.error);
    });
}

// Store user-specific encryption data
export async function storeUserEncryptionData(userId, data) {
    const db = await openDatabase();
    const transaction = db.transaction('keys', 'readwrite');
    const store = transaction.objectStore('keys');

    store.put({ id: `user_${userId}`, ...data });
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => reject(transaction.error);
    });
}

// Get user-specific encryption data
export async function getUserEncryptionData(userId) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('keys', 'readonly');
        const store = transaction.objectStore('keys');
        const request = store.get(`user_${userId}`);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}
  