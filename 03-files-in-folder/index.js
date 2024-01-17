const fs = require('fs/promises');
const path = require('path');

async function showFilesInfo() {
  const folderPath = path.join(__dirname, 'secret-folder');

  try {
    const filesArr = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of filesArr) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const infoFile = await fs.stat(filePath);
        const fileExt = path.extname(file.name).slice(1);
        const fileSize = infoFile.size;

        console.log(
          `${path.basename(
            file.name,
            '.' + fileExt,
          )} - ${fileExt} - ${fileSize}b`,
        );
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err.message);
  }
}

showFilesInfo();
