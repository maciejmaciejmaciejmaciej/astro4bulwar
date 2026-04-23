const fs = require('fs');
const appCode = fs.readFileSync('src/App.tmp.utf8.tsx', 'utf8');

const files = [
  'About28', 'BlogSection', 'Footer', 'ModernInterior', 'Navbar', 'OfertaSection', 'OurServices', 
  'Project5a', 'QuoteSection', 'ReservationQuickBar', 'SpecialOfferSection', 'StickyCartControls', 
  'TheSelection', 'WielkanocSection'
];

// Let's just find the text blocks manually for each
const searchStrings = {
  'About28': 'const About28 =',
  'BlogSection': 'ANDÉ BLOG',
  'Footer': 'ul. Klasztorna 2',
  'ModernInterior': 'Nowoczesne wnêtrze',
  'Navbar': 'Rezerwacja',
  'OfertaSection': 'OFERTA',
  'OurServices': 'Menu Skrócone',
  'Project5a': 'const Project5a =',
  'QuoteSection': 'Culinary art is the only science',
  'ReservationQuickBar': 'ZAREZERWUJ STOLIK', // maybe?
  'SpecialOfferSection': 'Specjalna Oferta',
  'StickyCartControls': 'Twoje zamówienie',
  'TheSelection': 'Wyselekcjonowane', // check
  'WielkanocSection': 'WIELKANOC'
};

for (const f of files) {
  const content = fs.readFileSync('src/components/sections/' + f + '.tsx', 'utf8');
  console.log(f, 'has text-[10px]?', content.includes('text-[10px]'));
}
