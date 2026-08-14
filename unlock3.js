const fs = require('fs');
let treePath = 'js/test-tree-engine.js';
let treeContent = fs.readFileSync(treePath, 'utf8');

// Use regex to replace the blocks regardless of whitespace
const topicLockRegex = /const\s+hasPassedTopic\s*=\s*Object\.keys[\s\S]*?if\s*\(!hasPassedTopic\)\s*\{[\s\S]*?return;\s*\}/;
treeContent = treeContent.replace(topicLockRegex, '// Level 1 lock removed');

const chapterLockRegex = /const\s+hasPassedChapter\s*=\s*Object\.keys[\s\S]*?if\s*\(!hasPassedChapter\)\s*\{[\s\S]*?return;\s*\}/;
treeContent = treeContent.replace(chapterLockRegex, '// Level 2 lock removed');

// Change UI Tags to UNLOCKED for Level 2 and 3
treeContent = treeContent.replace(/<span style="font-size:12px; font-weight:700; color:var\(--text-muted\);">PROGRESSIVE<\/span>/g, '<span style="font-size:12px; font-weight:700; color:var(--brand-emerald);">UNLOCKED</span>');

fs.writeFileSync(treePath, treeContent);
console.log('Unlocked levels 1, 2, 3 successfully via regex!');
