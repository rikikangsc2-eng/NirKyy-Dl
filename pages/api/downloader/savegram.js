/*
* Lokasi: pages/api/downloader/savegram.js
* Versi: v1
*/

import axios from 'axios';
import * as cheerio from 'cheerio';
import vm from 'vm';
import { URLSearchParams } from 'url';

export const metadata = {
  name: 'SaveGram Downloader',
  category: 'Downloader',
  method: 'GET',
  path: '/downloader/savegram',
  description: 'Mengunduh konten Instagram (video, foto) melalui scrapper SaveGram.',
  params: [
    { name: 'url', type: 'text', optional: false, example: 'https://www.instagram.com/p/Cq5c-c5p9a6/' }
  ]
};

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = async (req, res) => {
  try {
    const url = req.query.url || (req.body && req.body.url);
    if (!url) {
      return res.status(400).json({ status: 'gagal', pesan: 'Cuy, URL-nya mana nih? Kosong gitu.' });
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
      return res.status(500).json({ status: 'gagal', pesan: 'Waduh, servernya ngasih respon aneh nih, bukan skrip.' });
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
      return res.status(404).json({ status: 'gagal', pesan: 'Gagal dapet HTML-nya, cuy. URL-nya salah kali atau webnya udah ganti jurus.' });
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
      return res.status(404).json({ status: 'gagal', pesan: 'Nggak nemu media buat diunduh nih di HTML-nya, cuy. Coba lagi yang lain.' });
    }

    res.status(200).json({ status: 'sukses', author: 'NirKyy', data: downloads });

  } catch (error) {
    const pesanError = error.response ? error.response.data : error.message;
    res.status(500).json({ status: 'gagal total', pesan: 'Waduh, ada error nih di server, sabar ya cuy. Mungkin lagi ngambek.', detail_teknis: pesanError.toString() });
  }
};

export default allowCors(handler);