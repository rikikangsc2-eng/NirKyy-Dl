/*
* Lokasi: pages/api/ai/upscale.js
* Versi: v1
*/

import { Pool } from 'pg';
import crypto from 'crypto';
import axios from 'axios';
import { jsonResponse, withCorsAndJson } from '../../../utils/api-helpers';

export const metadata = {
  name: 'AI Image Upscaler (Async)',
  category: 'AI',
  method: 'POST',
  path: '/ai/upscale',
  description: 'Meningkatkan resolusi gambar hingga 4x menggunakan AI. Proses ini berjalan secara asinkron. Gunakan endpoint /job-status untuk mengecek hasilnya.',
  params: [
    { name: 'url', type: 'text', optional: false, example: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_qunMNGGtG4huNifqPKYJJxUuO--WKY8rm7TWd5QwVM1MJE9YWvd55yM&s=10' },
    { name: 'scale', type: 'text', optional: true, example: '2' },
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
  const { url, scale } = { ...req.query, ...req.body };

  if (!url) {
    return jsonResponse(res, 400, { success: false, message: "Parameter 'url' wajib diisi." });
  }

  const client = await pool.connect();
  try {
    await client.query(CREATE_TABLE_QUERY);

    const jobId = crypto.randomUUID();
    const callbackKey = crypto.randomBytes(32).toString('hex');
    const host1BaseUrl = "https://nirkyy-kun.vercel.app";
    const callbackUrl = `${host1BaseUrl}/api/_callback/job-update`;
    const host2Url = 'https://nirkyy-api.hf.space/upscale';

    const insertQuery = `
      INSERT INTO async_jobs (job_id, callback_key)
      VALUES ($1, $2);
    `;
    await client.query(insertQuery, [jobId, callbackKey]);

    axios.post(host2Url, {
      imageUrl: url,
      scale: parseInt(scale, 10) || 4,
      jobId,
      callbackUrl,
      callbackKey
    }).catch(error => {
      console.error(`Failed to trigger worker for job ${jobId}:`, error.message);
    });

    const statusUrl = `${host1BaseUrl}/api/job-status?id=${jobId}`;
    return jsonResponse(res, 202, {
      success: true,
      message: 'Job berhasil dibuat dan sedang diproses. Silakan cek status secara berkala.',
      data: { jobId, status: 'pending', statusUrl }
    });

  } catch (error) {
    console.error('Upscale Job Creation Error:', error);
    return jsonResponse(res, 500, { success: false, message: 'Gagal membuat job upscale.', data: { details: error.message } });
  } finally {
    client.release();
  }
};

export default withCorsAndJson(handler);