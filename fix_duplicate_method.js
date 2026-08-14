const fs = require('fs');
let treePath = 'js/test-tree-engine.js';
let treeContent = fs.readFileSync(treePath, 'utf8');

// Find the second launchChapterTest(chapterId) and remove it.
// It starts with "// Launch Level 2: Chapter Milestone Test"
// And ends before "// Launch Level 3: Subject Full Test"

const startIdx = treeContent.indexOf('// Launch Level 2: Chapter Milestone Test');
const endIdx = treeContent.indexOf('// Launch Level 3: Subject Full Test');

if (startIdx !== -1 && endIdx !== -1) {
  treeContent = treeContent.substring(0, startIdx) + treeContent.substring(endIdx);
  fs.writeFileSync(treePath, treeContent);
  console.log('Successfully removed the duplicate launchChapterTest that was breaking the test engine!');
} else {
  console.log('Could not find the duplicate method block.');
}
