import { precacheAndRoute } from 'workbox-precaching';

// Skip waiting and claim clients immediately so the SW becomes active right away
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

try {
    precacheAndRoute(self.__WB_MANIFEST || []);
} catch (e) {
    console.log('Workbox precaching skipped');
}

const DB_NAME = 'wallplayper-db';
const DB_VERSION = 2;

const getFileFromDB = async (wallpaperId, filePath) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject('Database error');
        request.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction(['files'], 'readonly');
            const store = tx.objectStore('files');
            const index = store.index('wallpaperId');
            const getRequest = index.getAll(Number(wallpaperId));

            getRequest.onsuccess = () => {
                const files = getRequest.result;
                console.log(`[SW] DB has ${files.length} files for wallpaper ${wallpaperId}. Available paths:`, files.map(f => f.path));
                // 1. Try exact match
                let file = files.find(f => f.path === filePath);

                // 2. Try normalized path match
                if (!file) {
                    const normalizedPath = filePath.replace(/^\/+/, '');
                    file = files.find(f => f.path.replace(/^\/+/, '') === normalizedPath);
                }

                if (file) {
                    resolve(file.blob);
                } else {
                    resolve(null);
                }
            };
            getRequest.onerror = () => reject('Fetch error');
        };
    });
};

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (url.pathname.startsWith('/wallplayper-content/')) {
        const parts = url.pathname.split('/');
        const wallpaperId = parts[2];
        const filePath = decodeURIComponent(parts.slice(3).join('/'));

        event.respondWith(
            (async () => {
                try {
                    const blob = await getFileFromDB(wallpaperId, filePath);
                    if (blob) {
                        console.log(`[SW] Serving: ${filePath}`);
                        return new Response(blob, {
                            headers: {
                                'Content-Type': blob.type || 'application/octet-stream',
                                'Cache-Control': 'no-cache'
                            }
                        });
                    }
                    console.warn(`[SW] Not found: ${filePath}`);
                } catch (error) {
                    console.error('[SW] Error:', error);
                }
                return new Response('File not found in database', { status: 404 });
            })()
        );
    }
});
