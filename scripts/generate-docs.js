/*
* Lokasi: scripts/generate-docs.js
* Versi: v4
*/

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const apiDir = path.join(process.cwd(), 'pages', 'api');
const cachePath = path.join(process.cwd(), 'lib', 'docs-cache.json');

function parseRouteFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const metadataRegex = /export const metadata\s*=\s*(\{[\s\S]*?\});/;
    const match = fileContent.match(metadataRegex);

    if (!match || !match[1]) return null;

    const metadata = new Function(`return ${match[1]}`)();
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

function generateDocsCache() {
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

  try {
    if (!fs.existsSync(path.dirname(cachePath))) {
        fs.mkdirSync(path.dirname(cachePath), { recursive: true });
    }
    fs.writeFileSync(cachePath, JSON.stringify(grouped, null, 2));
    console.log('✅ Documentation cache generated successfully.');
  } catch (error) {
    console.error('❌ Error writing documentation cache:', error);
  }
}

generateDocsCache();