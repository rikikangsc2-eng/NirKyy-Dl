/*
* Lokasi: pages/api/docs.js
* Versi: v2
*/

import { getAllRoutes } from '../../utils/api-parser';

export default async function handler(req, res) {
  try {
    const docs = getAllRoutes();
    res.status(200).json(docs);
  } catch (error) {
    console.error('Error in docs handler:', error);
    res.status(500).json({ error: 'Failed to read documentation files.' });
  }
}