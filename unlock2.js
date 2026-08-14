const fs = require('fs');
let treePath = 'js/test-tree-engine.js';
let treeContent = fs.readFileSync(treePath, 'utf8');

// Replace Level 1 lock
let level1Lock = `    const hasPassedTopic = Object.keys(state.topicTests || {}).some(id => id.startsWith(\`topic_\${chapterId}_\`) && state.topicTests[id].passed);
    if (!hasPassedTopic) {
      if (window.showToast) window.showToast("?? Complete at least 1 Topic Test (Level 1) of this chapter to unlock Level 2!", 4000);
      return;
    }`;
treeContent = treeContent.replace(level1Lock, '// Level 1 lock removed');

// Replace Level 2 lock
let level2Lock = `    const hasPassedChapter = Object.keys(state.chapterTests || {}).some(id => subjectChapters.includes(id) && state.chapterTests[id].passed);
    if (!hasPassedChapter) {
      if (window.showToast) window.showToast(\`?? Pass at least 1 Chapter Test (Level 2) in \${config.subjectCode.toUpperCase()} to unlock Level 3!\`, 4000);
      return;
    }`;
treeContent = treeContent.replace(level2Lock, '// Level 2 lock removed');

fs.writeFileSync(treePath, treeContent);
console.log('Unlocked levels 1, 2, 3 successfully!');
