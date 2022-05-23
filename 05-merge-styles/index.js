
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '/project-dist/bundle.css');

function fileHandler(){
  fs.open(dir, 'w', (err) => {
    if(err) throw err;
    console.log('File created');
  });
  fs.readdir(__dirname + '/styles', (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (path.extname(file) == '.css') {
          fs.readFile(`${__dirname}/styles/${file}`, 'utf8', 
            function(error,data){
              console.log('Асинхронное чтение файла');
              if(error) throw error; // если возникла ошибка
              fs.appendFile(dir, data, (err) => {
                if(err) throw err;
              });
            });
        }
      });
    }
  });
}

fileHandler();