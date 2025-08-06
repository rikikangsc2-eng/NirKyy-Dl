/*
* Lokasi: utils/api-parser.js
* Versi: v10
*/

import docsCache from '../lib/docs-cache.json';

let allRoutesCache = null;

export function getAllRoutes() {
  if (allRoutesCache) {
    return allRoutesCache;
  }
  allRoutesCache = docsCache;
  return allRoutesCache;
}

export function getRouteById(id) {
  const allDocs = getAllRoutes();
  for (const category in allDocs) {
    const found = allDocs[category].find(doc => doc.id === id);
    if (found) {
      return found;
    }
  }
  return null;
}