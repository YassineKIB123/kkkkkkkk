import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function createCleanZip() {
  const zip = new JSZip();
  const rootDir = path.resolve('.');

  function addDir(dirPath, zipFolder) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git' || entry.name === 'out') {
        continue;
      }
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        const subFolder = zipFolder.folder(entry.name);
        addDir(fullPath, subFolder);
      } else {
        const fileData = fs.readFileSync(fullPath);
        zipFolder.file(entry.name, fileData);
      }
    }
  }

  const projectFolder = zip.folder('kkkkkkkk-main');
  addDir(rootDir, projectFolder);

  console.log('Generating zip buffer...');
  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  const destPath = path.resolve('../iknowapdf-fixed.zip');
  fs.writeFileSync(destPath, zipBuffer);
  console.log('Saved clean zip to:', destPath, 'Size:', zipBuffer.length, 'bytes');
}

createCleanZip().catch(console.error);
