const path = require('path');
const fs = require('fs');

const project = path.join(__dirname, 'project-dist');
const pathImg = path.join(__dirname, 'project-dist', 'assets', 'img');
const pathFonts = path.join(__dirname, 'project-dist', 'assets', 'fonts');
const pathSvg = path.join(__dirname, 'project-dist', 'assets', 'svg');

function createProjectDir() {
  fs.mkdir(project, () => {
    fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), () => {
      fs.mkdir(pathImg, () => {
      });
      fs.mkdir(pathFonts, () => {
      });
      fs.mkdir(pathSvg, () => {
      });
    });
  });
}

function copyFile(folder, folderCopy) {
  fs.readdir(folder, (error, files) => {
    files.forEach(file => {
      fs.mkdir(folderCopy, {recursive: true}, () => {
        fs.copyFile(path.join(folder, file), path.join(folderCopy, file), err => {
          if (err) {
            console.log(err.message);
          }
        });
      });
    });
  });
}

function mergeStyles(styles, project) {
  const result = fs.createWriteStream(path.join(project, 'style.css'));
  fs.readdir(styles, (error, files) => {
    for (let file of files) {
      if (file.slice(file.lastIndexOf('.')) === '.css') {
        fs.createReadStream(path.join(styles, file), 'utf-8').pipe(result);
      }
    }
  });
}

async function createHTML(template, components) {
  let templateData = '';
  const templateFile = fs.createReadStream(template, 'utf-8');
  templateFile.on('data', data => {
    templateData = data;
  });
  templateFile.on('end', async () => {
    await fs.readdir(components, (error, files) => {
      for (let file of files) {
        const componentFile = fs.createReadStream(path.join(components, file), 'utf-8');
        let componentData = '';
        componentFile.on('data', data => componentData += data);
        componentFile.on('end', () => {
          templateData = templateData.replace(`{{${file.split('.')[0]}}}`, componentData);
          fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html')).write(templateData);
        });
      }
    });
  });
}

async function buildProject() {
  createProjectDir();
  copyFile(path.join(__dirname, 'assets', 'img'), pathImg);
  copyFile(path.join(__dirname, 'assets', 'svg'), pathSvg);
  copyFile(path.join(__dirname, 'assets', 'fonts'), pathFonts);
  mergeStyles(path.join(__dirname, 'styles'), project);
  createHTML(path.join(__dirname, 'template.html'), path.join(__dirname, 'components'));
}

buildProject();