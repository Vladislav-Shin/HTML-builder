const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '/secret-folder');

function traverse(dir) {
  fs.readdir(dir, { withFileTypes: false }, function(err, list) {
    list.forEach((element) => {
      fs.stat(dir + `/${element}`, function(err, stats) {
        if (stats.isFile()) {
          const name = element.replace(/\.[^/.]+$/, '');
          const ext = element.split('.')[1];
          console.log(`${name} - ${ext} - ` + formatSize(stats.size));
        }
      });
    }, this);
  });
}

traverse(dir);

function formatSize(length){
  let i = 0, type = ['б','Кб','Мб','Гб','Тб','Пб'];
  while((length / 1000 | 0) && i < type.length - 1) {
    length /= 1024;
    i++;
  }
  return length.toFixed(2) + ' ' + type[i];
}


