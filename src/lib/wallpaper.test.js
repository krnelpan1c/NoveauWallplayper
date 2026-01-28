import { describe, it, expect, vi } from 'vitest';
import { processVideo, processZip } from './wallpaper';
import JSZip from 'jszip';

describe('Wallpaper Processing', () => {
    it('should process a video file correctly', async () => {
        const mockFile = new File(['void'], 'test.mp4', { type: 'video/mp4' });
        const result = await processVideo(mockFile);

        expect(result.name).toBe('test.mp4');
        expect(result.type).toBe('video');
        expect(result.files).toHaveLength(1);
        expect(result.files[0].path).toBe('test.mp4');
        expect(result.entryPoint).toBe('test.mp4');
    });

    it('should process a basic ZIP file and find entry point', async () => {
        const zip = new JSZip();
        zip.file('index.html', '<html></html>');
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const mockFile = new File([zipBlob], 'wallpaper.zip', { type: 'application/zip' });

        const result = await processZip(mockFile);

        expect(result.name).toBe('wallpaper');
        expect(result.type).toBe('html');
        expect(result.entryPoint).toBe('index.html');
        expect(result.files.some(f => f.path === 'index.html')).toBe(true);
    });

    it('should parse LivelyInfo.json if present in ZIP', async () => {
        const zip = new JSZip();
        zip.file('LivelyInfo.json', JSON.stringify({
            Title: 'My Cool Wallpaper',
            FileName: 'main.html'
        }));
        zip.file('main.html', '<html></html>');
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const mockFile = new File([zipBlob], 'lively.zip', { type: 'application/zip' });

        const result = await processZip(mockFile);

        expect(result.name).toBe('My Cool Wallpaper');
        expect(result.entryPoint).toBe('main.html');
    });
});
