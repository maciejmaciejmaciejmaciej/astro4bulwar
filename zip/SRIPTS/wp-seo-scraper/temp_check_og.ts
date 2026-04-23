import axios from 'axios';
import * as cheerio from 'cheerio';

async function check() {
    const res = await axios.get('https://bulwarrestauracja.pl/');
    const $ = cheerio.load(res.data);
    
    // Find background image on header or similar wrapper
    const bgElem = $('.btPageHeadline');
    console.log('home page headline style:', bgElem.attr('style'));
    
    // Just find any inline style with background-image
    $('*[style*="background-image"]').each((_, el) => {
        console.log($(el).attr('class'), $(el).attr('style'));
    });
}
check();