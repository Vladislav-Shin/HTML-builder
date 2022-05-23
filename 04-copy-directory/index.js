const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const dir = path.join(__dirname + '/files');
  
function copyDir() {
  fsPromises.mkdir(dir + '-copy', {recursive: true})
    // удаление files-copy
    .then(function() {
      fs.readdir(dir + '-copy', { withFileTypes: false }, function(err, list) {
        list.forEach((element) => {
          fs.unlink(`${dir}-copy/${element}`, err => {
            if(err) throw err; // не удалось удалить файл
          });
        }, this);
      });
    })
    // создание files-copy
    .then(function() {
      fs.readdir(dir, { withFileTypes: false }, function(err, list) {
        list.forEach((element) => {
          fs.copyFile(`${dir}/${element}`, `${dir}-copy/new-${element}`, err => {
            if(err) throw err; // не удалось скопировать файл
            console.log(`Файл успешно скопирован: new-${element}`);
          });
        }, this);
      });
    })
    .catch(function() {
      console.log('failed to create directory');
    });
}

copyDir();

