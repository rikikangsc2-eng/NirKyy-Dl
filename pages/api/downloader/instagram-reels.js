/*
* Lokasi: pages/api/downloader/instagram-reels.js
* Versi: v3
*/

import axios from 'axios';
import * as cheerio from 'cheerio';
import vm from 'vm';
import { URLSearchParams } from 'url';
import { jsonResponse, withCorsAndJson } from '../../../utils/api-helpers';

export const metadata = {
  name: 'Instagram Reels',
  category: 'Downloader',
  method: 'GET, POST',
  path: '/downloader/instagram-reels',
  description: 'Mengunduh konten Instagram (Reels)',
  params: [
    { name: 'url', type: 'text', optional: false, example: 'https://www.instagram.com/reel/DAIXhDJM7ms/' }
  ]
};

const handler = async (req, res) => {
  try {
    const url = req.query.url || (req.body && req.body.url);
    if (!url) {
      return jsonResponse(res, 400, { success: false, message: 'Cuy, URL-nya mana nih? Kosong gitu.' });
    }

    const payload = new URLSearchParams({ url: url, action: 'post', lang: 'id' });
    const config = {
      method: 'post',
      url: 'https://savegram.info/action.php',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Referer': 'https://savegram.info/id',
      },
      data: payload.toString(),
    };

    const { data: obfuscatedScript } = await axios(config);
    if (typeof obfuscatedScript !== 'string') {
      return jsonResponse(res, 500, { success: false, message: 'Waduh, servernya ngasih respon aneh nih, bukan skrip.' });
    }

    let capturedHtml = '';
    const context = {
      window: { location: { hostname: 'savegram.info' } },
      pushAlert: () => {},
      gtag: () => {},
      document: {
        getElementById: (id) => {
          if (id === 'div_download') return { set innerHTML(html) { capturedHtml = html; } };
          return { style: {}, remove: () => {} };
        },
        querySelector: () => ({ classList: { remove: () => {} } }),
      },
    };

    vm.createContext(context);
    const script = new vm.Script(obfuscatedScript);
    script.runInContext(context);

    if (!capturedHtml) {
      return jsonResponse(res, 404, { success: false, message: 'Gagal dapet HTML-nya, cuy. URL-nya salah kali atau webnya udah ganti jurus.' });
    }

    const $ = cheerio.load(capturedHtml);
    const downloads = [];
    $('.download-items').each((i, el) => {
      const item = $(el);
      const thumbnail = item.find('img').attr('src');
      const downloadButton = item.find('.download-items__btn a');
      const qualityText = downloadButton.text().trim();
      const downloadUrl = downloadButton.attr('href');
      if (downloadUrl) {
        downloads.push({ thumbnail, kualitas: qualityText || 'Standar lah', url_download: downloadUrl });
      }
    });

    if (downloads.length === 0) {
      return jsonResponse(res, 404, { success: false, message: 'Nggak nemu media buat diunduh nih di HTML-nya, cuy. Coba lagi yang lain.' });
    }

    return jsonResponse(res, 200, { success: true, message: 'Konten Instagram berhasil diunduh.', data: downloads });

  } catch (error) {
    const pesanError = error.response ? error.response.data : error.message;
    return jsonResponse(res, 500, { success: false, message: 'Waduh, ada error nih di server, sabar ya cuy. Mungkin lagi ngambek.', data: { detail_teknis: pesanError.toString() } });
  }
};

export default withCorsAndJson(handler);