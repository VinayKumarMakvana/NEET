const fs = require('fs');
let treePath = 'js/test-tree-engine.js';
let treeContent = fs.readFileSync(treePath, 'utf8');

const goSyllabusRegex = /onclick="if\(window\.navigateView\)\s*window\.navigateView\('home'\);"[^>]*>Go to Syllabus[^<]*<\/button>/g;
treeContent = treeContent.replace(goSyllabusRegex, `onclick="TestTreeEngine.openChapterSelectorModal(1)">Take Topic Test <i class="ph-bold ph-arrow-right"></i></button>`);

const selectChapterRegex = /onclick="if\(window\.navigateView\)\s*window\.navigateView\('home'\);"[^>]*>Select Chapter[^<]*<\/button>/g;
treeContent = treeContent.replace(selectChapterRegex, `onclick="TestTreeEngine.openChapterSelectorModal(2)">Take Chapter Exam <i class="ph-bold ph-arrow-right"></i></button>`);

fs.writeFileSync(treePath, treeContent);
console.log('Buttons successfully fixed!');
