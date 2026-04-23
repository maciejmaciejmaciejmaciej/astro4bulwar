const fs = require('fs');

const urls = [
"https://bulwarrestauracja.pl/lunch-firmowy-w-poznaniu-stary-rynek2/",
"https://bulwarrestauracja.pl/wigilia-firmowa-na-starym-rynku-w-poznaniu/",
"https://bulwarrestauracja.pl/portfolio/wieczor-panienski-i-kawalerski-na-starym-rynku-w-poznaniu/",
"https://bulwarrestauracja.pl/portfolio/przyjecia-slubne-w-poznaniu/",
"https://bulwarrestauracja.pl/portfolio/przyjecie-urodzinowe-poznan-stary-rynek/",
"https://bulwarrestauracja.pl/portfolio/spotkania-biznesowe-sniadania-na-strym-rynku-w-poznaniu/",
"https://bulwarrestauracja.pl/portfolio/kolacja-w-ciemnosci/",
"https://bulwarrestauracja.pl/portfolio/muzyka-na-zywo-restauracja-bulwar-na-starym-rynku-w-poznaniu/",
"https://bulwarrestauracja.pl/portfolio/lunch-firmowy-w-poznaniu-stary-rynek/",
"https://bulwarrestauracja.pl/portfolio/catering-domowy-i-swiateczny-z-dowozem-poznan/",
"https://bulwarrestauracja.pl/komunia-w-poznaniu-na-starym-rynku/",
"https://bulwarrestauracja.pl/portfolio/imprezy-firmowe-i-integracyjne-w-poznaniu/",
"https://bulwarrestauracja.pl/galeria/",
"https://bulwarrestauracja.pl/kontakt/",
"https://bulwarrestauracja.pl/menu/dania-glowne/",
"https://bulwarrestauracja.pl/menu/karta-win/",
"https://bulwarrestauracja.pl/menu-okolicznosciowe-2025-skrocone/",
"https://bulwarrestauracja.pl/menu-okolicznosciowe-platerowe-2025/",
"https://bulwarrestauracja.pl/menu/sniadania-breakfast/",
"https://bulwarrestauracja.pl/o-restauracji/",
"https://bulwarrestauracja.pl/oferta/",
];

const results = urls.map(u => {
  const p = new URL(u).pathname;
  const parts = p.split('/').filter(x => x);
  const name = parts.map(x => x.replace(/[^a-zA-Z0-9]/g, ' ').trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')).join('') + 'Page';
  return { path: p, name };
});

const imports = results.map(r => `import ${r.name} from './pages/${r.name}';`).join('\n');
const routes = results.map(r => `          <Route path="${r.path}" element={<${r.name} />} />`).join('\n');

const appContent = `import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";

${imports}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
${routes}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
`;

fs.writeFileSync('App.tsx', appContent);
