const fs = require('fs');
const mainPath = 'js/main.js';
let content = fs.readFileSync(mainPath, 'utf8');

// Replace all instances of http://localhost:3028 with nothing (relative path)
content = content.replace(/http:\/\/localhost:3028/g, '');

fs.writeFileSync(mainPath, content);
console.log('Removed localhost from js/main.js');
