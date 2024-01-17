const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filePath = path.join(__dirname, 'output-text.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.emitKeypressEvents(process.stdin);

console.log(
  'Hello, enter text to write to file, or "exit" or "ctrl + c" to exit:',
);

if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    console.log('\nGood job! Have a good day!');
    writeStream.end();
    process.exit(0);
  }
});

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Good job! Have a good day!');
    writeStream.end();
    process.exit(0);
  } else {
    writeStream.write(input + '\n');
    console.log(
      'Added to file. Enter more text or "exit" or "ctrl + c" to exit:',
    );
  }
});
