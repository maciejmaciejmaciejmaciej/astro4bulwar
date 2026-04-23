const fs = require('fs');
const path = require('path');
const outDir = path.join('SRIPTS', 'wp-seo-scraper', 'output');

function decodeHtmlEntities(text) {
  return text.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
             .replace(/&quot;/g, '"')
             .replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/â€“/g, '-')
             .replace(/Å¼/g, '¿')
             .replace(/Å›/g, 'œ')
             .replace(/Ä™/g, 'ê')
             .replace(/Å‚/g, '³')
             .replace(/Ã³/g, 'ó')
             .replace(/Å„/g, 'ñ')
             .replace(/Ä…/g, '¹')
             .replace(/Åº/g, 'Ÿ')
             .replace(/Åš/g, 'Œ')
             .replace(/Ã³/g, 'ó')
             .replace(/Ã³/g, 'ó')
             .replace(/Å /g, 'Œ')
             .replace(/Ä‡/g, 'æ')
             .replace(/Ã³/g, 'ó')
             .replace(/Ã³/g, 'ó')
             .replace(/Ã³/g, 'ó')
             .replace(/Ã³/g, 'ó')
             .replace(/WieczÃ³r/g, 'Wieczór');
}

const items = fs.readdirSync(outDir).filter(f => f.includes('portfolio')).map(folder => {
  const jsonPath = path.join(outDir, folder, 'seo-data.json');
  if(!fs.existsSync(jsonPath)) return null;
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  
  let mainText = json.ogTitle || json.title || folder;
  mainText = decodeHtmlEntities(mainText);
  mainText = mainText.split(' - BulwaR')[0].trim();
  mainText = mainText.split(' – BulwaR')[0].trim();
  mainText = mainText.split(' &#8211; BulwaR')[0].trim();
  
  let normalText = json.ogDescription || json.description || '';
  if (!normalText) {
    const mdPath = path.join(outDir, folder, 'content.md');
    if (fs.existsSync(mdPath)) {
      const md = fs.readFileSync(mdPath, 'utf8');
      const lines = md.split('\n');
      const textLines = lines.filter(line => 
        line.trim().length > 50 && 
        !line.startsWith('#') && 
        !line.startsWith('URL:') &&
        !line.startsWith('Title:')
      );
      if (textLines.length > 0) {
        normalText = textLines[0].substring(0, 140) + '...';
      }
    }
  }
  normalText = decodeHtmlEntities(normalText);
  
  return {
    image: json.featuredImage || 'https://picsum.photos/seed/biznes/800/600',
    mainText,
    normalText,
    link: '/' + folder
  };
}).filter(Boolean);

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/ofertaData.ts', 'import { OfertaItem } from \'../components/sections/OfertaSection\';\n\nexport const portfolioItems: OfertaItem[] = ' + JSON.stringify(items, null, 2) + ';\n');
console.log('Created src/data/ofertaData.ts');
