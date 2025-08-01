/*
* Lokasi: pages/api/search/lyrics.js
* Versi: v1
*/

import axios from 'axios';
import * as cheerio from 'cheerio';
import { jsonResponse, withCorsAndJson } from '../../../utils/api-helpers';

export const metadata = {
  name: 'Lyrics Finder',
  category: 'Search',
  method: 'GET',
  path: '/search/lyrics',
  description: 'Mencari lirik lagu berdasarkan judul atau artis dari lyrics.com.',
  params: [
    { name: 'q', type: 'text', optional: false, example: 'never gonna give you up' }
  ]
};

const handler = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return jsonResponse(res, 400, { success: false, message: 'Parameter q (query) diperlukan.' });
    }

    const url = `https://www.lyrics.com/lyrics/${encodeURIComponent(q)}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                'Referer': `https://www.lyrics.com/lyrics/${encodeURIComponent(q)}`,
            },
            decompress: true,
        });

        const htmlContent = response.data;
        const $ = cheerio.load(htmlContent);
        const lyricDiv = $('.sec-lyric.clearfix').first();
        const lyricBody = lyricDiv.find('.lyric-body').text().trim();

        if (lyricBody) {
            return jsonResponse(res, 200, { success: true, message: 'Lirik berhasil ditemukan.', data: { lyrics: lyricBody } });
        } else {
            return jsonResponse(res, 404, { success: false, message: 'Lirik tidak ditemukan untuk query tersebut.' });
        }
    } catch (error) {
        return jsonResponse(res, 500, { success: false, message: 'Terjadi kesalahan saat mengambil lirik.', data: { details: error.message } });
    }
};

export default withCorsAndJson(handler);