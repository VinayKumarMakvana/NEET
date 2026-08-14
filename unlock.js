const fs = require('fs');
let treePath = 'js/test-tree-engine.js';
let treeContent = fs.readFileSync(treePath, 'utf8');

// 1. Remove lock from launchSubjectTest
// The lock code looks like:
// const hasPassedChapter = Object.keys(state.chapterTests || {})...
// if (!hasPassedChapter) { ... return; }
// We can just regex replace it or string replace it.

let lockBlockRegex = /const\s+hasPassedChapter\s*=\s*Object\.keys[^}]+if\s*\(!hasPassedChapter\)\s*\{[^}]+return;\s*\}/;
treeContent = treeContent.replace(lockBlockRegex, '// PROGRESSION LOCK REMOVED FOR LEVEL 3');

// 2. Remove lock from launchChapterTest (original) if it still exists
let lockBlock2Regex = /const\s+hasPassedTopic\s*=\s*Object\.keys[^}]+if\s*\(!hasPassedTopic\)\s*\{[^}]+return;\s*\}/;
treeContent = treeContent.replace(lockBlock2Regex, '// PROGRESSION LOCK REMOVED FOR LEVEL 2');

// 3. Update UI badges
// Replace PROGRESSIVE with UNLOCKED
treeContent = treeContent.replace(/<span style="font-size:12px; font-weight:700; color:var\(--text-muted\);">PROGRESSIVE<\/span>/g, '<span style="font-size:12px; font-weight:700; color:var(--brand-emerald);">UNLOCKED</span>');

fs.writeFileSync(treePath, treeContent);
console.log('Unlocked levels 1, 2, 3 successfully!');
