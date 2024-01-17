const fs = require('fs/promises');
const path = require('path');

async function copyDir(src, pathNewDir) {
  await fs.mkdir(pathNewDir, { recursive: true });
  const contentSrcDir = await fs.readdir(src, { withFileTypes: true });

  for (const entry of await fs.readdir(pathNewDir, { withFileTypes: true })) {
    const currentPath = path.join(pathNewDir, entry.name);
    if (entry.isDirectory()) {
      await fs.rm(currentPath, { recursive: true, force: true });
    } else {
      await fs.unlink(currentPath);
    }
  }

  for (const item of contentSrcDir) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(pathNewDir, item.name);

    if (item.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

const sourceDir = path.join(__dirname, 'files');
const filesСopyDir = path.join(__dirname, 'files-copy');

copyDir(sourceDir, filesСopyDir).catch(console.error);
