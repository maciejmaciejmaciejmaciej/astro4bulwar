const fs = require('fs');
let c = fs.readFileSync('zip/src/App.tsx', 'utf-8');
c = c.replace(/function ProductItem[\s\S]*?(?=import \{ CheckoutDrawer)/, `
import { ProductItem } from "./components/sections/ProductItem";
import { Project5a } from "./components/sections/Project5a";
import { About28 } from "./components/sections/About28";

`);
fs.writeFileSync('zip/src/App.tsx', c);
