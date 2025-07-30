/*
* Lokasi: pages/api/docs.js
* Versi: v1
*/

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const routesDir = path.join(process.cwd(), 'routes');
    const filenames = fs.readdirSync(routesDir);

    const docs = await Promise.all(
      filenames
        .filter(filename => filename.endsWith('.js'))
        .map(async filename => {
          const filePath = path.join(routesDir, filename);
          try {
            // Use file:// URL for dynamic imports to work with absolute paths
            const fileUrl = `file://${filePath}`;
            const routeModule = await import(fileUrl);
            return {
              id: path.parse(filename).name,
              ...(routeModule.default || routeModule)
            };
          } catch (importError) {
            console.error(`Error importing ${filePath}:`, importError);
            return null;
          }
        })
    );

    // Filter out any null results from failed imports
    const validDocs = docs.filter(doc => doc !== null);

    res.status(200).json(validDocs);
  } catch (error) {
    console.error('Error in docs handler:', error);
    res.status(500).json({ error: 'Failed to read documentation files.' });
  }
}