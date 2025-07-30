/*
* Lokasi: lib/api-docs.js
* Versi: v1
*/

import fs from 'fs';
import path from 'path';

export function getAllApiEndpoints() {
  const apiDirectory = path.join(process.cwd(), 'pages/api');
  const endpoints = [];

  function findApiFiles(directory) {
    const files = fs.readdirSync(directory);
    files.forEach((file) => {
      const fullPath = path.join(directory, file);
      if (fs.statSync(fullPath).isDirectory()) {
        findApiFiles(fullPath);
      } else if (file.endsWith('.js')) {
        const relativePath = path.relative(apiDirectory, fullPath);
        const apiPath = `/api/${relativePath.replace(/\\/g, '/').replace(/\.js$/, '')}`;
        const category = relativePath.split(path.sep)[0] || 'general';

        const module = require(fullPath);
        if (module && module.metadata) {
          const metadataArray = Array.isArray(module.metadata) ? module.metadata : [module.metadata];
          metadataArray.forEach(meta => {
            endpoints.push({
              ...meta,
              path: apiPath,
              category: category.charAt(0).toUpperCase() + category.slice(1),
              curl: `curl -X ${meta.method} "https://your-domain.vercel.app${apiPath}${meta.method === 'GET' && meta.parameters.length > 0 ? '?url=example' : ''}" ${meta.method === 'POST' ? `-H "Content-Type: application/json" -d '${JSON.stringify(meta.examplePayload || {})}'` : ''}`.trim()
            });
          });
        }
      }
    });
  }

  findApiFiles(apiDirectory);
  return endpoints;
}