const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath);

stdout.write('Приветственное сообщение!:\n');
stdin.on('data', data => {
  if(data.toString().trim() === 'exit') {
    process.exit();
  } else writeStream.write(data);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Прощальное сообщение!'));