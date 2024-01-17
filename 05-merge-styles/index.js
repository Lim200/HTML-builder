const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  const stylesDir = path.join(__dirname, 'styles');
  const outputDir = path.join(__dirname, 'project-dist');
  const outputFile = path.join(outputDir, 'bundle.css');

  try {
    await fs.mkdir(outputDir, { recursive: true });
    const filesArr = await fs.readdir(stylesDir, { withFileTypes: true });
    let bundleContent = '';

    for (const file of filesArr) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesDir, file.name);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        bundleContent += fileContent + '\n';
      }
    }

    await fs.writeFile(outputFile, bundleContent);
    console.log('Styles have been merged into bundle.css');
  } catch (err) {
    console.error(err);
  }
}

mergeStyles();
