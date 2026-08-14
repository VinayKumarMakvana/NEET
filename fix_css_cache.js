const fs = require('fs');
const indexPath = 'index.html';
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Increment versions to bust cache
indexContent = indexContent.replace(/styles\.css\?v=1\.3\.0/g, 'styles.css?v=1.3.1');

fs.writeFileSync(indexPath, indexContent);
console.log('Successfully bumped styles.css version to bust cache!');
