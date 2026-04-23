import axios from 'axios';
import * as cheerio from 'cheerio';

async function check() {
    const res = await axios.get('https://bulwarrestauracja.pl/menu/dania-glowne/');
    const $ = cheerio.load(res.data);
    
    // find menu items
    const menuItems = $('.btMenuItem');
    // or bt_bb_menu_item
    console.log("Found menu items?", menuItems.length);
    
    if (menuItems.length > 0) {
        console.log($.html(menuItems.first()));
    } else {
        const other = $('.bt_bb_menu_item, .menu-item');
        console.log("other:", other.length);
        if (other.length) console.log($.html(other.first()));
    }
}
check();