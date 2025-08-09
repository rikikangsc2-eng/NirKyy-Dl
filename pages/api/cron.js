/*
* Lokasi: pages/api/cron.js
* Versi: v4
*/

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const client = await pool.connect();
  try {
    const cleanupWebsiteCounters = client.query(`
      DELETE FROM website_counters
      WHERE last_updated < NOW() - INTERVAL '3 months';
    `);

    const cleanupChatHistory = client.query(`
      DELETE FROM blackbox_chat_history
      WHERE last_updated < NOW() - INTERVAL '1 week';
    `);

    const cleanupAsyncJobs = client.query(`
      DELETE FROM async_jobs
      WHERE created_at < NOW() - INTERVAL '15 minutes';
    `);

    await Promise.all([cleanupWebsiteCounters, cleanupChatHistory, cleanupAsyncJobs]);

    res.status(200).json({ status: 'ok', message: 'Cron job executed successfully. All old data cleaned up.' });
  } catch (error) {
    console.error('Cron job failed:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  } finally {
    client.release();
  }
}