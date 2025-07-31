const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream('project.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`ZIP selesai: project.zip (${archive.pointer()} bytes)`);
});

archive.on('error', err => { throw err; });

archive.pipe(output);

const EXCLUDES = ['zip.js','node_modules', 'package-lock.json'];
const isHidden = name => name.startsWith('.');

// Fungsi rekursif untuk tambahkan file/folder
const addDirAsTxt = (baseDir, relPath = '') => {
  const entries = fs.readdirSync(path.join(baseDir, relPath));

  entries.forEach(entry => {
    if (EXCLUDES.includes(entry) || isHidden(entry)) return;

    const fullPath = path.join(baseDir, relPath, entry);
    const relativeZipPath = path.join(relPath, entry);

    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      addDirAsTxt(baseDir, relativeZipPath);
    } else if (stats.isFile()) {
      archive.append(fs.createReadStream(fullPath), {
        name: relativeZipPath + '.txt'
      });
    }
  });
};

// Mulai dari direktori saat ini
addDirAsTxt(process.cwd());

archive.finalize();
