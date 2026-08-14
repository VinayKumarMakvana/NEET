const fs = require('fs');
let mockPath = 'js/mock-engine.js';
let mockContent = fs.readFileSync(mockPath, 'utf8');

// Replace the duplicate const modal at the end of renderExamInterface
const regex = /const modal = document\.getElementById\('modal'\);\s*if \(modal && !modal\.open\) modal\.showModal\(\);\s*\},\s*selectAnswer\(index\)/;

const fixedCode = `},\n  selectAnswer(index)`;

if (mockContent.match(regex)) {
  mockContent = mockContent.replace(regex, fixedCode);
  fs.writeFileSync(mockPath, mockContent);
  console.log('Successfully fixed the SyntaxError regex match!');
} else {
  console.log('Regex still failed.');
}
