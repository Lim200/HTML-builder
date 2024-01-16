const fs = require('fs');
const path = require('path');

function readFileStream() {
  const filePath = path.join(__dirname, 'text.txt');
  const readStream = fs.createReadStream(filePath, 'utf-8');

  let data = '';

  readStream.on('data', (chunk) => {
    data += chunk;
  });

  readStream.on('end', () => {
    console.log(data);
  });

  readStream.on('error', (error) => {
    console.log('Error', error.message);
  });
}

readFileStream();
