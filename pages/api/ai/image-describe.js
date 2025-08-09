/*
* Lokasi: pages/api/ai/image-describe.js
* Versi: v1
*/

import { Pool } from 'pg';
import crypto from 'crypto';
import axios from 'axios';
import { jsonResponse, withCorsAndJson } from '../../../utils/api-helpers';

export const metadata = {
  name: 'AI Image Describer (Async)',
  category: 'AI',
  method: 'POST',
  path: '/ai/image-describe',
  description: 'Mendeskripsikan konten sebuah gambar berdasarkan prompt yang diberikan. Proses ini berjalan secara asinkron. Gunakan endpoint /job-status untuk mengecek hasilnya.',
  params: [
    { name: 'url', type: 'text', optional: false, example: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_qunMNGGtG4huNifqPKYJJxUuO--WKY8rm7TWd5QwVM1MJE9YWvd55yM&s=10' },
    { name: 'prompt', type: 'text', optional: false, example: 'jelaskan semua menu yang ada di gambar ini dalam format list' },
  ]
};

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const CREATE_TABLE_QUERY = `
CREATE TABLE IF NOT EXISTS async_jobs (
    job_id UUID PRIMARY KEY,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    result JSONB,
    callback_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);
`;

const handler = async (req, res) => {
  const { url, prompt } = { ...req.query, ...req.body };

  if (!url || !prompt) {
    return jsonResponse(res, 400, { success: false, message: "Parameter 'url' dan 'prompt' wajib diisi." });
  }

  const client = await pool.connect();
  try {
    await client.query(CREATE_TABLE_QUERY);

    const jobId = crypto.randomUUID();
    const callbackKey = crypto.randomBytes(32).toString('hex');
    const host1BaseUrl = "https://nirkyy-kun.vercel.app";
    const callbackUrl = `${host1BaseUrl}/api/_callback/job-update`;
    const workerUrl = 'https://nirkyy-api.hf.space/image-describe';

    const insertQuery = `
      INSERT INTO async_jobs (job_id, callback_key)
      VALUES ($1, $2);
    `;
    await client.query(insertQuery, [jobId, callbackKey]);

    axios.post(workerUrl, {
      imageUrl: url,
      prompt,
      jobId,
      callbackUrl,
      callbackKey
    }).catch(error => {
      console.error(`Gagal memicu worker untuk job ${jobId}:`, error.message);
    });

    const statusUrl = `${host1BaseUrl}/api/job-status?id=${jobId}`;
    return jsonResponse(res, 202, {
      success: true,
      message: 'Job berhasil dibuat dan sedang diproses. Silakan cek status secara berkala.',
      data: { jobId, status: 'pending', statusUrl }
    });

  } catch (error) {
    console.error('Image Describe Job Creation Error:', error);
    return jsonResponse(res, 500, { success: false, message: 'Gagal membuat job image-describe.', data: { details: error.message } });
  } finally {
    client.release();
  }
};

export default withCorsAndJson(handler);