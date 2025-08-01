/*
* Lokasi: pages/api/converter/remove-background.js
* Versi: v2
*/

import axios from 'axios';
import CryptoJS from 'crypto-js';
import formidable from 'formidable';
import fs from 'fs';
import { jsonResponse, withCorsAndJson } from '../../../utils/api-helpers';

export const metadata = {
    name: 'Background Remover',
    category: 'Converter',
    method: 'POST',
    path: '/converter/remove-background',
    description: 'Menghapus latar belakang dari gambar via URL atau upload file.',
    params: [
        { name: 'url', type: 'text', optional: true, example: null },
        { name: 'file', type: 'file', optional: true }
    ]
};

class RemovePhotos {
  constructor(apiKey = "0zcCs5xWKy6fb4ZVnRdlhao0YKrQERfL", origin = "https://remove.photos/remove-background") {
    this.apiKey = apiKey;
    this.origin = origin;
    this.hostDomain = origin;
    const originMatch = origin.match(/^https?:\/\/[^/]+/);
    if (!originMatch) throw new Error("Invalid origin URL provided.");
    this.baseUrl = originMatch[0];
  }

  randomCryptoIP() {
    const randomWords = CryptoJS.lib.WordArray.random(4);
    const bytes = [];
    for (let i = 0; i < 4; i++) {
      const byte = randomWords.words[Math.floor(i / 4)] >>> 24 - i % 4 * 8 & 255;
      bytes.push(byte);
    }
    return bytes.join(".");
  }

  randomID(length = 16) {
    const randomWords = CryptoJS.lib.WordArray.random(Math.ceil(length / 2));
    return randomWords.toString(CryptoJS.enc.Hex).slice(0, length);
  }

  buildHeaders(extra = {}) {
    const ip = this.randomCryptoIP();
    return {
      accept: "*/*",
      "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
      origin: this.baseUrl,
      referer: `${this.baseUrl}/`,
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      "sec-ch-ua": `"Chromium";v="131", "Not_A Brand";v="24", "Google Chrome";v="131"`,
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": `"Android"`,
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-forwarded-for": ip,
      "x-real-ip": ip,
      "x-request-id": this.randomID(8),
      ...extra
    };
  }

  getAppName() {
    return this.hostDomain.replace(/^https?:\/\//, "").split("/")[0];
  }

  formatter() {
    return {
      stringify: e => {
        const t = { ct: e.ciphertext.toString(CryptoJS.enc.Base64) };
        if (e.iv) t.iv = e.iv.toString();
        if (e.s) t.s = e.salt.toString();
        return JSON.stringify(t);
      },
      parse: e => {
        const t = JSON.parse(e);
        const o = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(t.ct) });
        if (t.iv) o.iv = CryptoJS.enc.Hex.parse(t.iv);
        if (t.s) o.s = CryptoJS.enc.Hex.parse(t.s);
        return o;
      }
    };
  }

  encrypt(data) {
    return CryptoJS.AES.encrypt(typeof data === "string" ? data : JSON.stringify(data), this.apiKey, { format: this.formatter() }).toString();
  }

  decrypt(encryptedData) {
    const jsonStr = typeof encryptedData === "string" ? encryptedData : JSON.stringify(encryptedData);
    try {
      const decryptedBytes = CryptoJS.AES.decrypt(jsonStr, this.apiKey, { format: this.formatter() });
      return decryptedBytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return "";
    }
  }

  createSignData(data) {
    const encrypted = this.encrypt(data);
    const timestamp = Date.now();
    const appName = this.getAppName();
    const sign = CryptoJS.MD5(encrypted + timestamp + appName).toString();
    return JSON.stringify({ _sign: sign, _key: timestamp, _data: encrypted });
  }

  async convertUrlToBase64(url) {
    try {
      const res = await axios.get(url, { responseType: "arraybuffer" });
      const contentType = res.headers["content-type"] || "image/jpeg";
      const extension = contentType.split("/")[1] || "jpg";
      const uint8Array = new Uint8Array(res.data);
      const wordArray = CryptoJS.lib.WordArray.create(uint8Array);
      const base64 = CryptoJS.enc.Base64.stringify(wordArray);
      return { base64: base64, fileName: `input_${Date.now()}.${extension}` };
    } catch (err) {
      return null;
    }
  }

  async matting({ base64, fileName }) {
    try {
      const imageData = { base64, type: "matting", fileName };
      const payload = this.createSignData(imageData);
      const apiHeaders = this.buildHeaders({ "content-type": "application/json", accept: "application/json, text/plain, */*" });
      const res = await axios.post(`${this.baseUrl}/api/images/matting`, payload, { headers: apiHeaders });
      const decryptedResponse = this.decrypt(res.data);
      if (!decryptedResponse) throw new Error("Failed to decrypt matting response");
      const { fileID } = JSON.parse(decryptedResponse);
      if (!fileID) throw new Error("fileID not found");
      const result = await this.pollingTask(fileID);
      if (!result) throw new Error("Polling task failed");
      return result;
    } catch (err) {
      return null;
    }
  }

  async pollingTask(fileID) {
    const interval = 3000;
    let attempts = 0;
    const maxAttempts = 20;
    while (attempts < maxAttempts) {
      attempts++;
      const payload = this.createSignData({ fileID: fileID, type: "matting" });
      const apiHeaders = this.buildHeaders({ "content-type": "application/json", accept: "application/json, text/plain, */*" });
      try {
        await new Promise(resolve => setTimeout(resolve, interval));
        const res = await axios.post(`${this.baseUrl}/api/images/result`, payload, { headers: apiHeaders });
        const decryptedResponse = this.decrypt(res.data);
        if (!decryptedResponse) continue;
        const raw = JSON.parse(decryptedResponse);
        const results = raw?.results;
        if (results?.recommend?.image) {
          return {
            original: results.original?.image ? { url: this.baseUrl + results.original.image, width: results.original.width, height: results.original.height, type: results.original.type } : null,
            no_background: { url: this.baseUrl + results.recommend.image, model: results.recommend.model }
          };
        } else if (raw?.status === "processing" || raw?.status === "pending" || raw?.code === 10003) {
        } else if (raw?.code !== 0 && raw?.message) {
          return null;
        }
      } catch (err) {
        if (err.response && err.response.status >= 500) return null;
      }
    }
    return null;
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
    const form = formidable({});

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return jsonResponse(res, 500, { success: false, message: 'Gagal memproses form data.' });
        }

        const imageUrl = fields.url;
        const uploadedFile = files.file;

        if (!imageUrl && !uploadedFile) {
            return jsonResponse(res, 400, { success: false, message: "Harap berikan 'url' atau 'file' untuk diproses." });
        }

        const client = new RemovePhotos();
        let imageDataSource = null;

        try {
            if (uploadedFile) {
                const fileBuffer = fs.readFileSync(uploadedFile.filepath);
                const base64 = fileBuffer.toString('base64');
                const fileName = uploadedFile.originalFilename || `upload_${Date.now()}.png`;
                imageDataSource = { base64, fileName };
            } else if (imageUrl) {
                const urlData = await client.convertUrlToBase64(imageUrl);
                if (!urlData) throw new Error("Gagal mengonversi gambar dari URL. Pastikan URL valid dan dapat diakses.");
                imageDataSource = urlData;
            }

            if (!imageDataSource) {
                return jsonResponse(res, 500, { success: false, message: 'Tidak dapat memperoleh data gambar.' });
            }

            const result = await client.matting(imageDataSource);

            if (!result) {
                return jsonResponse(res, 500, { success: false, message: "Gagal memproses gambar. Layanan eksternal mungkin sedang tidak aktif." });
            }

            return jsonResponse(res, 200, { success: true, message: "Latar belakang berhasil dihapus.", data: result });

        } catch (error) {
            return jsonResponse(res, 500, { success: false, message: error.message || "Terjadi kesalahan internal." });
        }
    });
};

export default withCorsAndJson(handler);