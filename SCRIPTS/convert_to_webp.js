const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Folder docelowy, ktory skrypt bedzie przetwarzal
const TARGET_DIR = path.join(__dirname, '../zip/SRIPTS/wp-seo-scraper/output');

let convertedCount = 0;
let skippedCount = 0;

async function processDirectory(currentDir) {
    if (!fs.existsSync(currentDir)) {
        console.error('Nie znaleziono folderu: ' + currentDir);
        return;
    }

    const items = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const item of items) {
        const itemPath = path.join(currentDir, item.name);
        
        if (item.isDirectory()) {
            await processDirectory(itemPath);
        } else {
            const ext = path.extname(item.name).toLowerCase();
            
            // Konwersja obrazkow
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                const outputFileName = item.name.replace(new RegExp(ext + '$', 'i'), '.webp');
                const outputPath = path.join(currentDir, outputFileName);

                // Sprawdzamy czy plik webp juz istnieje
                if (fs.existsSync(outputPath)) {
                    skippedCount++;
                    continue;
                }

                console.log('Dorabianie WebP z: ' + item.name + ' -> ' + outputFileName);

                try {
                    await sharp(itemPath)
                        .webp({ quality: 80 })
                        .toFile(outputPath);
                    
                    // Zostawiamy stary plik nienaruszony (nie ma fs.unlinkSync)
                    convertedCount++;
                } catch (err) {
                    console.error('Blad przy konwersji pliku ' + item.name + ':', err.message);
                }
            }
        }
    }
}

async function start() {
    console.log('Rozpoczynam prace w katalogu: ' + TARGET_DIR);
    try {
        await processDirectory(TARGET_DIR);
        console.log('\nZakonczono pomyslnie!');
        console.log('Dorobiono nowych plikow WebP: ' + convertedCount);
        if (skippedCount > 0) console.log('Pominieto (WebP juz istnialo): ' + skippedCount);
    } catch (error) {
        console.error('Wystapil blad krytyczny:', error);
    }
}

start();
