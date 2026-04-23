const fs = require('fs');
const urls = fs.readFileSync('../../SRIPTS/wp-seo-scraper/urls.txt', 'utf8').trim().split('\n');

const results = [];

for (const u of urls) {
  const p = new URL(u).pathname.replace(/\/$/, '');
  const slug = p.split('/').pop() || p;
  const parts = p.split('/').filter(x => x);
  const name = parts.map(x => x.replace(/[^a-zA-Z0-9]/g, ' ').trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')).join('') + 'Page';
  
  const code = `export default function ${name}() {
  return (
    <div className="container mx-auto py-24 px-4 min-h-screen pt-32">
      <h1 className="text-4xl font-bold mb-8 capitalize">${slug.replace(/-/g, ' ')}</h1>
      <p>This is a placeholder component for the ${slug} page.</p>
    </div>
  );
}
`;
  fs.writeFileSync('./' + name + '.tsx', code);
  results.push(name);
}
console.log(results);
