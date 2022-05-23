
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const dir = path.join(__dirname, 'text.txt');
const rl = readline.createInterface({ input, output });

function fileHandler() {
  fs.open(dir, 'w', (err) => {
    console.log('Приветственное сообщение!');
    if (err) throw err;
  });

  rl.on('line', (answer) => {
    fs.appendFile(dir, ` ${answer}`, (err) => {
      if(err) throw err;
    });

    if (answer.trim() == 'exit') {
      rl.close();
      console.log('Прощальное сообщение!');
    }
  });
}

fileHandler();