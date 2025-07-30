/*
* Lokasi: utils/api-parser.js
* Versi: v3
*/

import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'routes');

function parseRouteFile(filename) {
  try {
    const filePath = path.join(routesDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const module = { exports: {} };
    const fn = new Function('module', 'exports', fileContent);
    fn(module, module.exports);

    const routeModule = module.exports;

    if (typeof routeModule !== 'object' || routeModule === null) return null;

    return {
      id: path.parse(filename).name,
      ...routeModule
    };
  } catch (e) {
    console.error(`Error parsing ${filename}:`, e);
    return null;
  }
}

export function getAllRoutes() {
  const filenames = fs.readdirSync(routesDir);
  const allDocs = filenames
    .filter(filename => filename.endsWith('.js'))
    .map(filename => parseRouteFile(filename))
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

export function getRouteById(endpointId) {
  const filename = `${endpointId}.js`;
  const filePath = path.join(routesDir, filename);

  if (!fs.existsSync(filePath)) return null;

  return parseRouteFile(filename);
}