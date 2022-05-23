const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const pathCreateFolder = path.join(__dirname, 'project-dist');
const pathNewCss = path.join(pathCreateFolder, 'style.css');
const pathNewHtml = path.join(pathCreateFolder, 'index.html');
const pathNewAssets = path.join(pathCreateFolder, 'assets');

const pathAssets = path.join(__dirname, 'assets');
const pathCss = path.join(__dirname, 'styles');
const pathComponents = path.join(__dirname, 'components');

async function createFolder(inputPath) {
  fs.access(pathCreateFolder, (e) => {
    if (e) {
      fsPromises.mkdir(inputPath);
    }
  });
}

async function createFile(inputPath, content) {
  return await fsPromises.writeFile(inputPath, content);
}

async function copyDir(fromPath, toPath) {
  await fsPromises.rm(toPath, { force: true, recursive: true });
  await fsPromises.mkdir(toPath, { recursive: true });
  
  const filesNameArr = await fsPromises.readdir(fromPath, { withFileTypes: true });

  for (let file of filesNameArr) {
    const currentItemPath = path.join(fromPath, file.name);
    const copyItemPath = path.join(toPath, file.name);
    
    if (file.isDirectory()) {
      await fsPromises.mkdir(copyItemPath, { recursive: true });
      await copyDir(currentItemPath, copyItemPath);
      
    } else if (file.isFile()) {
      await fsPromises.copyFile(currentItemPath, copyItemPath);
    }
  }
}

async function mergeFiles() {
  let arrStyles = [];
  const filesNameArr = await fsPromises.readdir(pathCss, { withFileTypes: true });

  for (let file of filesNameArr) {
    const pathToCurrentFile = path.join(pathCss, file.name);
    const fileType = path.extname(pathToCurrentFile);

    if (fileType === '.css') {
      const css = await fsPromises.readFile(pathToCurrentFile, 'utf8');
      arrStyles.push(`${css}\n\n`);
    }
  }

  createFile(pathNewCss, arrStyles);
}

async function pasteComponents() {
  let html = await fsPromises.readFile(__dirname + '/template.html', 'utf-8');
  const filesNameArr = await fsPromises.readdir(pathComponents, { withFileTypes: true });

  for (let file of filesNameArr) {
    const componentContent = await fsPromises.readFile(path.join(pathComponents, `${file.name}`), 'utf-8');
    const regExp = new RegExp(`{{${(file.name).split('.')[0]}}}`, 'g');
    html = html.replace(regExp, componentContent);
  }

  createFile(pathNewHtml, html);
}

async function buildPage() {
  createFolder(pathCreateFolder);
  mergeFiles();
  copyDir(pathAssets, pathNewAssets);
  pasteComponents();
}

buildPage();