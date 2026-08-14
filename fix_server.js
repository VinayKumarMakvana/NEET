const fs = require('fs');
const path = 'server/server.js';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(
  "res.status(500).json({ error: 'Server error' });",
  "console.error('Registration Error:', err);\n      res.status(500).json({ error: 'Server error: ' + err.message });"
);
fs.writeFileSync(path, content);
console.log('Fixed server.js error logging');
