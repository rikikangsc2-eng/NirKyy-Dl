/*
* Lokasi: pages/api/job-status.js
* Versi: v1
*/

import { Pool } from 'pg';
import { jsonResponse, withCorsAndJson } from '../../utils/api-helpers';

export const metadata = {
  name: 'Job Status Checker',
  category: 'Other',
  method: 'GET',
  path: '/job-status',
  description: 'Mengecek status dari sebuah pekerjaan asinkron (seperti AI Upscaler) menggunakan Job ID.',
  params: [
    { name: 'id', type: 'text', optional: false, example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
  ]
};

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return jsonResponse(res, 400, { success: false, message: "Parameter 'id' (Job ID) wajib diisi." });
  }

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT job_id, status, result, created_at FROM async_jobs WHERE job_id = $1', [id]);

    if (result.rows.length === 0) {
      return jsonResponse(res, 404, { success: false, message: 'Job tidak ditemukan atau sudah kedaluwarsa.' });
    }

    const job = result.rows[0];
    const jobAgeMinutes = (new Date() - new Date(job.created_at)) / (1000 * 60);

    if (jobAgeMinutes > 15) {
      return jsonResponse(res, 410, { success: false, message: 'Job sudah kedaluwarsa (lebih dari 15 menit).', data: { jobId: job.job_id, status: 'expired' } });
    }

    return jsonResponse(res, 200, {
      success: true,
      message: `Status job berhasil diambil.`,
      data: {
        jobId: job.job_id,
        status: job.status,
        result: job.result || null,
      }
    });

  } catch (error) {
    console.error('Job Status Error:', error);
    return jsonResponse(res, 500, { success: false, message: 'Gagal mengambil status job.', data: { details: error.message } });
  } finally {
    client.release();
  }
};

export default withCorsAndJson(handler);