/*
* Lokasi: utils/api-parser.js
* Versi: v6
*/

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const apiDir = path.join(process.cwd(), 'pages', 'api');

function parseRouteFile(filePath) {
  try {
    let fileContent = fs.readFileSync(filePath, 'utf-8');

    fileContent = fileContent.replace(/export const metadata/g, 'module.exports.metadata');

    const module = { exports: {} };
    const fn = new Function('module', 'exports', fileContent);
    fn(module, module.exports);

    const metadata = module.exports.metadata;

    if (typeof metadata !== 'object' || metadata === null) return null;

    const relativePath = path.relative(apiDir, filePath);
    const id = relativePath.replace(/\\/g, '/').replace(/\.js$/, '');

    return {
      id,
      ...metadata,
      path: `/${id}`
    };
  } catch (e) {
    console.error(`Error parsing ${filePath}:`, e);
    return null;
  }
}

export function getAllRoutes() {
  const filePaths = glob.sync('**/*.js', { cwd: apiDir });

  const allDocs = filePaths
    .filter(p => !p.startsWith('_') && !p.includes('['))
    .map(p => parseRouteFile(path.join(apiDir, p)))
    .filter(Boolean)
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  const grouped = {};
  for (const doc of allDocs) {
    const category = doc.category || 'Uncategorized';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(doc);
  }
  return grouped;
}

export function getRouteById(id) {
  const fullPath = path.join(apiDir, `${id}.js`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return parseRouteFile(fullPath);
}