/*
* Lokasi: pages/api/docs.js
* Versi: v1
*/

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const routesDir = path.join(process.cwd(), 'routes');
    const filenames = fs.readdirSync(routesDir);

    const docs = filenames
      .filter(filename => filename.endsWith('.js'))
      .map(filename => {
        const filePath = path.join(routesDir, filename);
        const routeModule = require(filePath);
        return {
          id: path.parse(filename).name,
          ...routeModule
        };
      });

    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read documentation files.' });
  }
}