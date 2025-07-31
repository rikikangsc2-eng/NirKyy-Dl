/*
* Lokasi: utils/api-parser.js
* Versi: v8
*/

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const apiDir = path.join(process.cwd(), 'pages', 'api');

function parseRouteFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const metadataRegex = /export const metadata\s*=\s*(\{[\s\S]*?\});/;
    const match = fileContent.match(metadataRegex);

    if (!match || !match[1]) {
      return null;
    }

    const metadataString = match[1];
    const metadata = new Function(`return ${metadataString}`)();

    if (typeof metadata !== 'object' || metadata === null) {
      return null;
    }

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