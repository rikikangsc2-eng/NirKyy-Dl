/*
* Lokasi: pages/api/converter/remove-background.js
* Versi: v3
*/

import crypto from 'crypto';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import formidable from 'formidable';
import { jsonResponse, withCorsAndJson } from '../../../utils/api-helpers';

export const metadata = {
    name: 'Background Remover',
    category: 'Converter',
    method: 'POST',
    path: '/converter/remove-background',
    description: 'Menghapus latar belakang dari gambar via URL atau upload file menggunakan MagicStudio API.',
    params: [
        { name: 'url', type: 'text', optional: true, example: null },
        { name: 'file', type: 'file', optional: true }
    ]
};

async function removeBackground(imageBuffer) {
    const endpoint = 'https://ai-api.magicstudio.com/api/remove-background';
    const imageBase64 = imageBuffer.toString('base64');
    const imageDataUri = `data:image/jpeg;base64,${imageBase64}`;

    const form = new FormData();
    form.append('image', imageDataUri);
    form.append('output_type', 'image');
    form.append('output_format', 'url');
    form.append('auto_delete_data', 'true');
    form.append('user_profile_id', 'null');
    form.append('anonymous_user_id', crypto.randomUUID());
    form.append('request_timestamp', (Date.now() / 1000).toString());
    form.append('user_is_subscribed', 'false');
    form.append('client_id', 'pSgX7WgjukXCBoYwDM8G8GLnRRkvAoJlqa5eAVvj95o');

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://magicstudio.com',
        'Referer': 'https://magicstudio.com/background-remover/editor/',
        ...form.getHeaders(),
    };

    const response = await axios.post(endpoint, form, { headers });
    return response.data;
}

async function getBufferFromUrl(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
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

        let imageBuffer;

        try {
            if (uploadedFile) {
                imageBuffer = fs.readFileSync(uploadedFile.filepath);
            } else if (imageUrl) {
                imageBuffer = await getBufferFromUrl(imageUrl);
            }

            if (!imageBuffer) {
                return jsonResponse(res, 500, { success: false, message: 'Tidak dapat memperoleh data gambar.' });
            }

            const result = await removeBackground(imageBuffer);

            if (result && result.results && result.results.length > 0) {
                 return jsonResponse(res, 200, { success: true, message: "Latar belakang berhasil dihapus.", data: result.results[0] });
            } else {
                 return jsonResponse(res, 500, { success: false, message: "Gagal memproses gambar. Respon dari API tidak valid.", data: result });
            }

        } catch (error) {
            const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
            return jsonResponse(res, 500, { success: false, message: "Terjadi kesalahan saat memproses gambar.", data: { details: errorMessage } });
        }
    });
};

export default withCorsAndJson(handler);