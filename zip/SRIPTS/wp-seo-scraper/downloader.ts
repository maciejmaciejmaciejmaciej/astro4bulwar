import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export function getSlugFromUrl(urlString: string): string {
    try {
        const parsed = new URL(urlString);
        let pathname = parsed.pathname;
        if (pathname === '/') {
            return 'home';
        }
        // Remove leading and trailing slashes, replace slashes with hyphens
        return pathname.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
    } catch {
        return 'unknown';
    }
}

export async function downloadImage(url: string, destDir: string): Promise<string> {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });

        // Ensure directory exists
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        let filename = path.basename(new URL(url).pathname);
        if (!filename) {
            filename = `image-${Date.now()}.bin`;
        }

        const destPath = path.join(destDir, filename);
        const writer = fs.createWriteStream(destPath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(destPath));
            writer.on('error', (err: Error) => reject(err));
        });
    } catch (error) {
        throw new Error(`Failed to download image from ${url}`);
    }
}
