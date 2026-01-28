import { openDB } from 'idb';

const DB_NAME = 'wallplayper-db';
const DB_VERSION = 2;

export const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion, tx) {
            if (!db.objectStoreNames.contains('wallpapers')) {
                db.createObjectStore('wallpapers', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('files')) {
                const fileStore = db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
                fileStore.createIndex('wallpaperId', 'wallpaperId');
            } else {
                // If 'files' store already exists, check if 'wallpaperId' index exists
                const fileStore = tx.objectStore('files');
                if (!fileStore.indexNames.contains('wallpaperId')) {
                    fileStore.createIndex('wallpaperId', 'wallpaperId');
                }
            }
        },
    });
};

export const saveWallpaper = async (serializedData) => {
    // Separate files from metadata to avoid storing blobs in the wallpapers store
    const { files, ...metadata } = serializedData;

    const db = await initDB();
    const tx = db.transaction(['wallpapers', 'files'], 'readwrite');

    const id = await tx.objectStore('wallpapers').add(metadata);

    if (files && Array.isArray(files)) {
        for (const file of files) {
            await tx.objectStore('files').add({
                ...file,
                wallpaperId: id
            });
        }
    }

    await tx.done;
    return id;
};

export const getWallpapers = async () => {
    const db = await initDB();
    return db.getAll('wallpapers');
};

export const getWallpaperFiles = async (wallpaperId) => {
    const db = await initDB();
    return db.getAllFromIndex('files', 'wallpaperId', wallpaperId);
};

export const deleteWallpaper = async (id) => {
    const db = await initDB();
    const tx = db.transaction(['wallpapers', 'files'], 'readwrite');

    // Delete files first
    const files = await tx.objectStore('files').index('wallpaperId').getAllKeys(id);
    for (const fileKey of files) {
        await tx.objectStore('files').delete(fileKey);
    }

    await tx.objectStore('wallpapers').delete(id);
    await tx.done;
};

export const updateWallpaper = async (wallpaper) => {
    const db = await initDB();
    return db.put('wallpapers', wallpaper);
};
