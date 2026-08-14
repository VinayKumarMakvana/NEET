const fs = require('fs');
let mockPath = 'js/mock-engine.js';
let mockContent = fs.readFileSync(mockPath, 'utf8');

if (!mockContent.includes('modal.showModal()') || mockContent.match(/modal\.showModal\(\)/g).length < 3) {
  // Fix confirmSubmit
  const confirmStr = `const modalBody = document.getElementById('modalBody');`;
  mockContent = mockContent.replace(
    /const modalBody = document\.getElementById\('modalBody'\);\s*if \(!modalBody\) return;/g,
    `const modal = document.getElementById('modal');\n    const modalBody = document.getElementById('modalBody');\n    if (!modal || !modalBody) return;\n    if (!modal.open) modal.showModal();`
  );
  fs.writeFileSync(mockPath, mockContent);
  console.log('Fixed modal.showModal() bugs in mock-engine.js!');
}
