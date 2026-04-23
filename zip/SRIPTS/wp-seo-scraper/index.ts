import * as fs from 'fs';
import * as path from 'path';
import { processUrls } from './extractor';
import { downloadImage, getSlugFromUrl } from './downloader';

async function main() {
    const urlsFile = path.join(__dirname, 'urls.txt');
    if (!fs.existsSync(urlsFile)) {
        console.error(`Error: Could not find ${urlsFile}`);
        process.exit(1);
    }

    // Read URLs, split by lines, trim, and filter out empties
    const urls = fs.readFileSync(urlsFile, 'utf8')
        .split(/\r?\n/)
        .map((u) => u.trim())
        .filter(Boolean);

    if (urls.length === 0) {
        console.error('No URLs found in urls.txt');
        process.exit(1);
    }

    console.log(`Znaleziono ${urls.length} adresów URL do przetworzenia.`);

    // Wykorzystujemy funkcję processUrls (choć ona nie oddaje kontroli na bieżąco, 
    // zrobimy to po prostu wywołując własną pętlę dla lepszych logów)
    const { fetchWithRetry, extractData } = await import('./extractor');

    for (const url of urls) {
        console.log(`\n========================================`);
        console.log(`-> Pobieranie danych z: ${url}`);
        
        try {
            const html = await fetchWithRetry(url);
            const seoData = extractData(url, html);
            
            const slug = getSlugFromUrl(url);
            const outputDir = path.join(__dirname, 'output', slug);
            
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Save JSON data
            const jsonPath = path.join(outputDir, 'seo-data.json');
            fs.writeFileSync(jsonPath, JSON.stringify(seoData, null, 2), 'utf8');
            console.log(` Zapisano dane SEO: ${jsonPath}`);

            // Save Markdown data
            const mdPath = path.join(outputDir, 'content.md');
            fs.writeFileSync(mdPath, seoData.rawContent, 'utf8');
            console.log(` Zapisano treść w formacie Markdown: ${mdPath}`);

            // Download Featured Image
            if (seoData.featuredImage) {
                console.log(` Znaleziono Featured Image. Rozpoczynam pobieranie...`);
                try {
                    const featSavedPath = await downloadImage(seoData.featuredImage, outputDir);
                    // Oznaczamy w nazwie by bylo to widoczne łatwo
                    const parsedName = path.basename(featSavedPath);
                    const newFeatPath = path.join(outputDir, `FEATURED_${parsedName}`);
                    if (fs.existsSync(featSavedPath) && !fs.existsSync(newFeatPath)) {
                        fs.renameSync(featSavedPath, newFeatPath);
                    }
                    console.log(` Pobrano pomyślnie Featured Image.`);
                } catch (err: any) {
                    console.error(`   Błąd podczas pobierania Featured Image ${seoData.featuredImage}: ${err.message}`);
                }
            }

            // Download Images
            const validImages = seoData.images.filter(img => img.src);
            if (validImages.length > 0) {
                console.log(` Znaleziono ${validImages.length} obrazów. Rozpoczynam pobieranie...`);
                let successCount = 0;
                for (const img of validImages) {
                    if (img.src) {
                        try {
                            const savedPath = await downloadImage(img.src, outputDir);
                            // console.log(`   Pobrano: ${path.basename(savedPath)}`);
                            successCount++;
                        } catch (err: any) {
                            console.error(`   Błąd podczas pobierania obrazu ${img.src}: ${err.message}`);
                        }
                    }
                }
                console.log(` Pobrano pomyślnie ${successCount}/${validImages.length} obrazów.`);
            } else {
                console.log(` Brak obrazów do pobrania.`);
            }

            // Download PDFs
            if (seoData.pdfs && seoData.pdfs.length > 0) {
                console.log(` Znaleziono ${seoData.pdfs.length} plików PDF. Rozpoczynam pobieranie...`);
                let successCount = 0;
                for (const pdfUrl of seoData.pdfs) {
                    try {
                        const savedPath = await downloadImage(pdfUrl, outputDir);
                        // console.log(`   Pobrano PDF: ${path.basename(savedPath)}`);
                        successCount++;
                    } catch (err: any) {
                        console.error(`   Błąd podczas pobierania PDF ${pdfUrl}: ${err.message}`);
                    }
                }
                console.log(` Pobrano pomyślnie ${successCount}/${seoData.pdfs.length} plików PDF.`);
            } else {
                console.log(` Brak plików PDF do pobrania.`);
            }
            
        } catch (err: any) {
            console.error(`! Błąd podczas przetwarzania ${url}: ${err.message}`);
        }
    }

    console.log(`\n========================================`);
    console.log(`Zakończono! Wyniki znajdują się w folderze 'output/'.`);
}

main().catch(err => {
    console.error('Błąd krytyczny skryptu:', err);
});

