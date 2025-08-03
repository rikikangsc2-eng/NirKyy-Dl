/*
* Lokasi: pages/api/cron.js
* Versi: v1
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

  try {
    const client = await pool.connect();
    try {
      await client.query(`
        DELETE FROM website_counters
        WHERE last_updated < NOW() - INTERVAL '3 months';
      `);
      res.status(200).send('ok');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Cron job failed:', error);
    res.status(500).send('Internal Server Error');
  }
}