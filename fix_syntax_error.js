const fs = require('fs');
let mockPath = 'js/mock-engine.js';
let mockContent = fs.readFileSync(mockPath, 'utf8');

// Replace the duplicate const modal at the end of renderExamInterface
const duplicateModalCode = `    const modal = document.getElementById('modal');
    if (modal && !modal.open) modal.showModal();
  },`;

const fixedCode = `  },`;

mockContent = mockContent.replace(duplicateModalCode, fixedCode);
fs.writeFileSync(mockPath, mockContent);
console.log('Fixed SyntaxError caused by duplicate const modal!');
