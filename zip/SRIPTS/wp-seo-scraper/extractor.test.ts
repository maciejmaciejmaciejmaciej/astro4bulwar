import { extractData } from './extractor';

describe('extractData', () => {
    it('should extract correct SEO information and resolve relative paths', () => {
        const url = 'https://example.com/page';
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Test Page Title</title>
                <meta name="description" content="This is a test description.">
                <link rel="canonical" href="https://example.com/page">
                <meta property="og:title" content="OG Title">
                <meta property="og:type" content="article">
            </head>
            <body>
                <h1>Header 1</h1>
                <h2>Header 2 A</h2>
                <h2>Header 2 B</h2>
                <p>Paragraph 1 text.</p>
                <p>Paragraph 2 text.</p>
                <img src="/image.png" alt="Test Image" title="Test Title">
                <img src="https://other.com/ext.jpg" alt="Ext Image">
            </body>
            </html>
        `;

        const result = extractData(url, html);

        expect(result.url).toBe(url);
        expect(result.title).toBe('Test Page Title');
        expect(result.description).toBe('This is a test description.');
        expect(result.canonical).toBe('https://example.com/page');
        expect(result.ogTags).toEqual({
            'og:title': 'OG Title',
            'og:type': 'article'
        });
        expect(result.headers.h1).toEqual(['Header 1']);
        expect(result.headers.h2).toEqual(['Header 2 A', 'Header 2 B']);
        expect(result.headers.h3).toEqual([]);
        expect(result.paragraphs).toEqual(['Paragraph 1 text.', 'Paragraph 2 text.']);
        expect(result.images).toEqual([
            { src: 'https://example.com/image.png', alt: 'Test Image', title: 'Test Title' },
            { src: 'https://other.com/ext.jpg', alt: 'Ext Image', title: undefined }
        ]);

        const expectedRawContent = `---\nURL: https://example.com/page\nTITLE: Test Page Title\nFEATURED IMAGE: None\n---\n\n# [H1] Header 1\n\n## [H2] Header 2 A\n\n## [H2] Header 2 B\n\nParagraph 1 text.\n\nParagraph 2 text.`;
        expect(result.rawContent).toBe(expectedRawContent);
    });
});
