import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { downloadImage, getSlugFromUrl } from './downloader';

jest.mock('axios');
jest.mock('fs');
const mockedAxios = axios as unknown as jest.Mock;

describe('downloader', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getSlugFromUrl', () => {
        it('should extract a valid slug from a URL', () => {
            expect(getSlugFromUrl('https://mysite.com/about/')).toBe('about');
            expect(getSlugFromUrl('https://mysite.com/some/path')).toBe('some-path');
            expect(getSlugFromUrl('https://mysite.com/')).toBe('home');
        });
    });

    describe('downloadImage', () => {
        it('should download image and resolve the path', async () => {
            const stream = {
                pipe: jest.fn(),
            };
            mockedAxios.mockResolvedValueOnce({ data: stream });
            
            const mockWriter = {
                on: jest.fn((event, callback) => {
                    if (event === 'finish') {
                        callback();
                    }
                })
            };
            (fs.createWriteStream as jest.Mock).mockReturnValue(mockWriter);

            const result = await downloadImage('https://example.com/test.png', '/tmp/output');
            
            expect(mockedAxios).toHaveBeenCalledWith({
                method: 'GET',
                url: 'https://example.com/test.png',
                responseType: 'stream'
            });
            expect(fs.createWriteStream).toHaveBeenCalledWith(path.join('/tmp/output', 'test.png'));
            expect(result).toBe(path.join('/tmp/output', 'test.png'));
        });
    });
});
