const fs = require('fs/promises');
const path = require('path');

async function buildProject() {
  const projectDir = path.join(__dirname, 'project-dist');
  const templateFilePath = path.join(__dirname, 'template.html');
  const stylesDir = path.join(__dirname, 'styles');
  const componentsFileDir = path.join(__dirname, 'components');
  const assetsDir = path.join(__dirname, 'assets');

  await fs.mkdir(projectDir, { recursive: true });

  await replaceTemplateTags(templateFilePath, componentsFileDir, projectDir);

  await mergeStyles(stylesDir, projectDir);

  await copyDir(assetsDir, path.join(projectDir, 'assets'));
}

async function replaceTemplateTags(
  templateFilePath,
  componentsFileDir,
  projectDir,
) {
  let template = await fs.readFile(templateFilePath, 'utf-8');
  const componentFiles = await fs.readdir(componentsFileDir, {
    withFileTypes: true,
  });

  for (const file of componentFiles) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      const name = file.name.split('.')[0];
      const componentContent = await fs.readFile(
        path.join(componentsFileDir, file.name),
        'utf-8',
      );
      template = template.replace(
        new RegExp(`{{${name}}}`, 'g'),
        componentContent,
      );
    }
  }

  await fs.writeFile(path.join(projectDir, 'index.html'), template);
}

async function mergeStyles(stylesDir, projectDir) {
  const filesArr = await fs.readdir(stylesDir, { withFileTypes: true });
  let styleContent = '';

  for (const file of filesArr) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(stylesDir, file.name);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      styleContent += fileContent + '\n';
    }
  }

  await fs.writeFile(path.join(projectDir, 'style.css'), styleContent);
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

buildProject().catch(console.error);
