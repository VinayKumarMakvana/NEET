const fs = require('fs');
const indexPath = 'index.html';
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Increment versions to bust cache
indexContent = indexContent.replace(/\?v=1\.2\.0/g, '?v=1.2.1');
indexContent = indexContent.replace(/\.js"/g, '.js?v=1.2.1"'); // Add to any that don't have one
indexContent = indexContent.replace(/\?v=1\.2\.1\?v=1\.2\.1/g, '?v=1.2.1'); // Fix double appends if any

fs.writeFileSync(indexPath, indexContent);
console.log('Successfully bumped versions to 1.2.1 to bust cache!');
