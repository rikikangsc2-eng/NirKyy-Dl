/*
* Lokasi: pages/api/_callback/job-update.js
* Versi: v1
*/

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { jobId, callbackKey, status, result } = req.body;

  if (!jobId || !callbackKey || !status || !result) {
    return res.status(400).json({ success: false, message: 'Missing parameters in callback.' });
  }

  const client = await pool.connect();
  try {
    const jobResult = await client.query('SELECT callback_key FROM async_jobs WHERE job_id = $1', [jobId]);

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const storedKey = jobResult.rows[0].callback_key;
    if (storedKey !== callbackKey) {
      return res.status(403).json({ success: false, message: 'Invalid callback key.' });
    }

    const updateQuery = 'UPDATE async_jobs SET status = $1, result = $2, updated_at = NOW() WHERE job_id = $3';
    await client.query(updateQuery, [status, JSON.stringify(result), jobId]);

    return res.status(200).json({ success: true, message: 'Job updated successfully.' });
  } catch (error) {
    console.error('Callback Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during callback processing.' });
  } finally {
    client.release();
  }
}