const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'text.txt');
const reader = fs.createReadStream(dir);
  
reader.on('data', chunk => console.log(chunk.toString()));