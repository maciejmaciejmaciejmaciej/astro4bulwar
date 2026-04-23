import axios from 'axios';
import * as cheerio from 'cheerio';

export interface SeoData {
    url: string;
    title: string | null;
    description: string | null;
    canonical: string | null;
    ogTags: Record<string, string>;
    featuredImage: string | null;
    headers: {
        h1: string[];
        h2: string[];
        h3: string[];
        h4: string[];
        h5: string[];
        h6: string[];
    };
    paragraphs: string[];
    images: {
        src: string | null;
        alt: string | undefined;
        title: string | undefined;
    }[];
    pdfs: string[];
    rawContent: string;
}

function resolveUrl(base: string, path: string): string {
    try {
        return new URL(path, base).href;
    } catch {
        return path;
    }
}

export function extractData(url: string, html: string): SeoData {
    const $ = cheerio.load(html);

    const title = $('title').text().trim() || null;
    const description = $('meta[name="description"]').attr('content')?.trim() || null;
    const canonical = $('link[rel="canonical"]').attr('href')?.trim() || null;

    const ogTags: Record<string, string> = {};
    $('meta[property^="og:"]').each((_, el) => {
        const property = $(el).attr('property');
        const content = $(el).attr('content');
        if (property && content) {
            ogTags[property] = content;
        }
    });

    const headers = {
        h1: $('h1').map((_, el) => $(el).text().trim()).get(),
        h2: $('h2').map((_, el) => $(el).text().trim()).get(),
        h3: $('h3').map((_, el) => $(el).text().trim()).get(),
        h4: $('h4').map((_, el) => $(el).text().trim()).get(),
        h5: $('h5').map((_, el) => $(el).text().trim()).get(),
        h6: $('h6').map((_, el) => $(el).text().trim()).get(),
    };

    const paragraphs = $('p').map((_, el) => $(el).text().trim()).get();

    let featuredImageUrl = ogTags['og:image'] || null;
    
    // Fallback 1: Sprawdzamy czy theme ustawia obrazek jako tlo dla headera
    if (!featuredImageUrl) {
        const headlineStyle = $('.btPageHeadline').attr('style') || '';
        const match = headlineStyle.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/i);
        if (match && match[1]) {
            featuredImageUrl = match[1];
        }
    }

    // Fallback 2: Pierwszy slider/boldSection z obrazkiem w tle jako Hero Image
    if (!featuredImageUrl) {
        const firstBgElem = $('*[style*="background-image"]').first().attr('style') || '';
        const match = firstBgElem.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/i);
        if (match && match[1]) {
            featuredImageUrl = match[1];
        }
    }

    let featuredImageFilename = 'None';
    if (featuredImageUrl) {
        try {
            const urlObj = new URL(featuredImageUrl);
            featuredImageFilename = urlObj.pathname.split('/').pop() || 'None';
            // W razie jakby URL tła był względny
        } catch {
            featuredImageFilename = featuredImageUrl.split('/').pop() || 'None';
            featuredImageUrl = resolveUrl(url, featuredImageUrl);
        }
    }

    const images = $('img').map((_, el) => {
        const srcAttr = $(el).attr('src');
        return {
            src: srcAttr ? resolveUrl(url, srcAttr) : null,
            alt: $(el).attr('alt'),
            title: $(el).attr('title'),
        };
    }).get();

    const pdfs = $('a[href$=".pdf"]').map((_, el) => {
        const href = $(el).attr('href');
        return href ? resolveUrl(url, href) : null;
    }).get().filter(Boolean) as string[];

    const rootTarget = $('main').length > 0 ? $('main') : $('body');
    let rawContent = `---\nURL: ${url}\nTITLE: ${title || 'None'}\nFEATURED IMAGE: ${featuredImageFilename}\n---\n\n`;
    
    rootTarget.find('h1, h2, h3, h4, h5, h6, p, li, .btMenuItemPrice, .btMenuItemDescription, a, button, .bt_bb_text, .bt_bb_headline, .headline, article, blockquote').each((_, el) => {
        const tagName = el.tagName.toLowerCase();
        // Skip child elements of these tags if Cheerio's .find matches them nested?
        // Actually, Cheerio traverses in DOM tree order. We'll extract text.
        let text = $(el).text();
        
        // Remove extra whitespaces inside text block but preserve normal spaces
        text = text.replace(/\\s+/g, ' ').trim();
        
        if (!text) return;
        
        if ($(el).hasClass('btMenuItemPrice')) rawContent += `CENA: ${text}\n\n`;
        else if ($(el).hasClass('btMenuItemDescription')) rawContent += `${text}\n\n`;
        else if (tagName === 'h1') rawContent += `# [H1] ${text}\n\n`;
        else if (tagName === 'h2') rawContent += `## [H2] ${text}\n\n`;
        else if (tagName === 'h3') rawContent += `### [H3] ${text}\n\n`;
        else if (tagName === 'h4') rawContent += `#### [H4] ${text}\n\n`;
        else if (tagName === 'h5') rawContent += `##### [H5] ${text}\n\n`;
        else if (tagName === 'h6') rawContent += `###### [H6] ${text}\n\n`;
        else if (tagName === 'p') rawContent += `${text}\n\n`;
        else if (tagName === 'li') rawContent += `- ${text}\n`;
        else if (tagName === 'a' || tagName === 'button') {
            const href = $(el).attr('href');
            const isBtn = $(el).hasClass('btn') || $(el).hasClass('button');
            if (href || isBtn) {
                const linkHref = href ? resolveUrl(url, href) : '';
                rawContent += `\n[BUTTON: ${text}] (${linkHref})\n\n`;
            }
        } else {
            rawContent += `${text}\n\n`;
        }
    });

    rawContent = rawContent.trim();

    return {
        url,
        title,
        description,
        canonical,
        ogTags,
        featuredImage: featuredImageUrl,
        headers,
        paragraphs,
        images,
        pdfs,
        rawContent
    };
}

export async function fetchWithRetry(url: string, retries: number = 3): Promise<string> {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url, { timeout: 10000 });
            return response.data;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(res => setTimeout(res, 1000 * (i + 1))); // Exponentialish backoff
        }
    }
    throw new Error('Failed to fetch after retries');
}

export async function processUrls(urls: string[]): Promise<SeoData[]> {
    const results: SeoData[] = [];
    for (const url of urls) {
        try {
            const html = await fetchWithRetry(url);
            results.push(extractData(url, html));
        } catch (err) {
            console.error(`Error processing ${url}:`, err);
        }
    }
    return results;
}
