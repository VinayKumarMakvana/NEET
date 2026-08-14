const fs = require('fs');
const path = 'server/models.js';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(
  "phone: { type: String, required: true, unique: true }",
  "phone: { type: String, unique: true, sparse: true }"
);
fs.writeFileSync(path, content);
console.log('Fixed models.js');
