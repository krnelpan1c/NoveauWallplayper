import JSZip from 'jszip';
const MIME_TYPES = {
    'html': 'text/html',
    'js': 'application/javascript',
    'css': 'text/css',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'json': 'application/json',
    'mp4': 'video/mp4',
    'webm': 'video/webm'
};

const getMimeType = (path) => {
    const ext = path.split('.').pop().toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
};

export const processZip = async (file) => {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    const files = [];
    let entryPoint = '';
    let metadata = {};

    // Check for LivelyInfo.json
    let infoFile = contents.file('LivelyInfo.json');
    if (!infoFile) {
        const matches = contents.file(/[/\\]LivelyInfo.json$/);
        if (matches.length > 0) infoFile = matches[0];
    }

    if (infoFile) {
        try {
            const infoText = await infoFile.async('string');
            // Remove BOM if present
            const cleanText = infoText.replace(/^\uFEFF/, '');
            metadata = JSON.parse(cleanText);
            entryPoint = metadata.FileName || metadata.filename || '';
        } catch (e) {
            console.warn('Failed to parse LivelyInfo.json', e);
        }
    }

    const filePromises = [];

    contents.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir) {
            filePromises.push(
                zipEntry.async('blob').then(rawBlob => {
                    const type = getMimeType(relativePath);
                    const blob = new Blob([rawBlob], { type });
                    files.push({
                        path: relativePath,
                        blob,
                        type
                    });

                    // Fallback entry point if not in LivelyInfo or if LivelyInfo entryPoint doesn't exist
                    const isHtml = relativePath.toLowerCase().endsWith('.html');
                    if (isHtml && !relativePath.includes('/') && !entryPoint) {
                        entryPoint = relativePath;
                    }
                })
            );
        }
    });

    await Promise.all(filePromises);

    // Try to find a preview image
    let preview = null;
    const title = metadata.Title || metadata.title || metadata.Name || metadata.name || file.name.replace(/\.zip$/i, '');
    const thumbnail = metadata.Thumbnail || metadata.thumbnail || 'preview.gif';

    const previewFile = files.find(f =>
        f.path.toLowerCase() === thumbnail.toLowerCase() ||
        f.path.toLowerCase().endsWith('/' + thumbnail.toLowerCase()) ||
        f.path.toLowerCase().endsWith('\\' + thumbnail.toLowerCase())
    );

    if (previewFile) {
        preview = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(previewFile.blob);
        });
    }

    // If still no entry point, find the first HTML file available in the list
    if (!entryPoint || !files.find(f => f.path === entryPoint)) {
        const htmlFile = files.find(f => f.path.toLowerCase().endsWith('.html'));
        if (htmlFile) {
            entryPoint = htmlFile.path;
        } else {
            throw new Error('No index.html or entry point found in the ZIP package.');
        }
    }

    return {
        name: title,
        type: 'html',
        entryPoint,
        files,
        preview
    };
};

export const processVideo = async (file) => {
    return {
        name: file.name,
        type: 'video',
        files: [{
            path: file.name,
            blob: file,
            type: file.type
        }],
        entryPoint: file.name,
        preview: null
    };
};

export const generatePreview = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
};
