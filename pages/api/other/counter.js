/*
* Lokasi: pages/api/other/counter.js
* Versi: v1
*/

import { Pool } from 'pg';
import { jsonResponse, withCorsAndJson } from '../../../utils/api-helpers';

export const metadata = {
  name: 'API Counter',
  category: 'Other',
  method: 'GET',
  path: '/other/counter',
  description: 'Tracks and displays visit counts for a website. Use write=true to increment the counter.',
  params: [
    { name: 'website', type: 'text', optional: false, example: 'example.com' },
    { name: 'write', type: 'text', optional: true, example: 'true' }
  ]
};

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const CREATE_TABLE_QUERY = `
CREATE TABLE IF NOT EXISTS website_counters (
    website TEXT PRIMARY KEY,
    total_hits INTEGER DEFAULT 1,
    daily_hits INTEGER DEFAULT 1,
    weekly_hits INTEGER DEFAULT 1,
    yesterday_hits INTEGER DEFAULT 0,
    last_week_hits INTEGER DEFAULT 0,
    last_reset_daily DATE DEFAULT CURRENT_DATE,
    last_reset_weekly DATE DEFAULT date_trunc('week', CURRENT_DATE),
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;

const handler = async (req, res) => {
  const { website, write } = req.query;

  if (!website) {
    return jsonResponse(res, 400, { success: false, message: 'Parameter "website" is required.' });
  }

  const client = await pool.connect();
  try {
    await client.query(CREATE_TABLE_QUERY);

    if (write === 'true') {
      const upsertQuery = `
        INSERT INTO website_counters (website) VALUES ($1)
        ON CONFLICT (website) DO UPDATE SET
            total_hits = website_counters.total_hits + 1,
            daily_hits = CASE
                WHEN website_counters.last_reset_daily < CURRENT_DATE THEN 1
                ELSE website_counters.daily_hits + 1
            END,
            weekly_hits = CASE
                WHEN website_counters.last_reset_weekly < date_trunc('week', CURRENT_DATE) THEN 1
                ELSE website_counters.weekly_hits + 1
            END,
            yesterday_hits = CASE
                WHEN website_counters.last_reset_daily < CURRENT_DATE THEN website_counters.daily_hits
                ELSE website_counters.yesterday_hits
            END,
            last_week_hits = CASE
                WHEN website_counters.last_reset_weekly < date_trunc('week', CURRENT_DATE) THEN website_counters.weekly_hits
                ELSE website_counters.last_week_hits
            END,
            last_reset_daily = CASE
                WHEN website_counters.last_reset_daily < CURRENT_DATE THEN CURRENT_DATE
                ELSE website_counters.last_reset_daily
            END,
            last_reset_weekly = CASE
                WHEN website_counters.last_reset_weekly < date_trunc('week', CURRENT_DATE) THEN date_trunc('week', CURRENT_DATE)
                ELSE website_counters.last_reset_weekly
            END,
            last_updated = CURRENT_TIMESTAMP;
      `;
      await client.query(upsertQuery, [website]);
    }

    const result = await client.query('SELECT * FROM website_counters WHERE website = $1', [website]);

    if (result.rows.length === 0) {
      return jsonResponse(res, 200, {
        success: true,
        message: 'Website not yet tracked. Set write=true to begin tracking.',
        data: { daily: 0, weekly: 0, yesterday: 0, "last-week": 0, total: 0, "last-updated": null }
      });
    }

    const stats = result.rows[0];
    const responseData = {
      daily: stats.daily_hits,
      weekly: stats.weekly_hits,
      yesterday: stats.yesterday_hits,
      "last-week": stats.last_week_hits,
      total: stats.total_hits,
      "last-updated": stats.last_updated
    };

    return jsonResponse(res, 200, { success: true, message: 'Counter data fetched successfully.', data: responseData });
  } catch (error) {
    console.error('API Counter Error:', error);
    return jsonResponse(res, 500, { success: false, message: 'An internal server error occurred.', data: { details: error.message } });
  } finally {
    client.release();
  }
};

export default withCorsAndJson(handler);