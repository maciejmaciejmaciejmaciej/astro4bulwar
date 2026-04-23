const fs = require('fs');
const https = require('https');

let allPages = [];

function fetchPages(page = 1) {
  const url = 'https://bulwarrestauracja.pl/wp-json/wp/v2/pages?per_page=100&page=' + page;
  https.get(url, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const pages = JSON.parse(data);
          if (Array.isArray(pages)) {
            pages.forEach(p => allPages.push({ title: p.title.rendered, slug: p.slug, link: p.link }));
            if (pages.length === 100) {
              fetchPages(page + 1);
            } else {
              const content = allPages.map(p => p.title + ' | ' + p.slug + ' | ' + p.link).join('\n');
              fs.writeFileSync('stare_linki_bulwar.txt', content);
              console.log('Zapisano ' + allPages.length + ' adresów do pliku stare_linki_bulwar.txt');
            }
          }
        } catch(e) {
          console.error(e);
        }
      } else {
          console.log('Koniec lub b³¹d paginacji: ' + res.statusCode);
      }
    });
  }).on('error', err => console.error(err));
}

fetchPages(1);
