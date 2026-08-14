const fs = require('fs');
let treePath = 'js/test-tree-engine.js';
let treeContent = fs.readFileSync(treePath, 'utf8');

// The block we want to replace starts with "openChapterSelectorModal(level) {"
// and ends right before "launchChapterTest" or similar. 
// We will replace both openChapterSelectorModal and launchChapterTest.

// First, we remove everything from "openChapterSelectorModal(level) {" to "getTreeStats() {"
const startIdx = treeContent.indexOf('openChapterSelectorModal(level) {');
const endIdx = treeContent.indexOf('getTreeStats() {');

if (startIdx !== -1 && endIdx !== -1) {
  const newCode = `
  openChapterSelectorModal(level) {
    const allCh = typeof getAllChapters === 'function' ? getAllChapters() : [];
    if (allCh.length === 0) return;

    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody) return;

    const title = level === 1 ? 'Select Topic for Micro-Test' : 'Select Chapter for Exam';

    // Group chapters by subject
    const subjects = {
      'phy': { name: 'Physics', icon: 'ph-atom', chapters: [] },
      'chem': { name: 'Chemistry', icon: 'ph-flask', chapters: [] },
      'bot': { name: 'Botany', icon: 'ph-plant', chapters: [] },
      'zoo': { name: 'Zoology', icon: 'ph-paw-print', chapters: [] }
    };

    allCh.forEach(ch => {
      if (subjects[ch.subjectCode]) {
        subjects[ch.subjectCode].chapters.push(ch);
      }
    });

    let html = \`
      <div style="padding:20px;">
        <h2 style="margin-top:0; color:var(--text-main); font-size:18px;">\${title}</h2>
        <div style="max-height:65vh; overflow-y:auto; padding-right:5px; display:flex; flex-direction:column; gap:8px;">
    \`;

    Object.keys(subjects).forEach(subKey => {
      const sub = subjects[subKey];
      if (sub.chapters.length === 0) return;

      html += \`
        <details style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:8px; padding:10px;">
          <summary style="font-weight:800; font-size:15px; cursor:pointer; color:var(--brand-sky); padding:5px; list-style:none; display:flex; justify-content:space-between; align-items:center;">
            <span><i class="ph-fill \${sub.icon}"></i> \${sub.name} (\${sub.chapters.length})</span>
            <i class="ph ph-caret-down" style="font-size:12px;"></i>
          </summary>
          <div style="margin-top:10px; display:flex; flex-direction:column; gap:6px;">
      \`;

      sub.chapters.forEach(ch => {
        if (level === 2) {
          // Level 2: Chapter Exam
          html += \`
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:10px; border-radius:6px;">
              <span style="font-size:13px; font-weight:600;">\${ch.title}</span>
              <button class="btn primary btn-sm" onclick="document.getElementById('modal').close(); TestTreeEngine.launchChapterTest(\${level}, '\${ch.id}')" style="flex-shrink:0;">
                Start Test <i class="ph-bold ph-play"></i>
              </button>
            </div>
          \`;
        } else {
          // Level 1: Topic Micro-Test
          let topics = [];
          if (Array.isArray(ch.subtopics)) {
            topics = ch.subtopics;
          } else if (typeof ch.subtopics === 'string') {
            topics = ch.subtopics.split(',').map(t => t.trim()).filter(Boolean);
          } else {
            topics = ['Core Concepts'];
          }

          html += \`
            <details style="background:rgba(0,0,0,0.1); border-left:3px solid var(--brand-teal); border-radius:4px; padding:8px;">
              <summary style="font-size:13px; font-weight:700; cursor:pointer; color:var(--text-main); list-style:none; display:flex; justify-content:space-between;">
                <span>\${ch.title} (\${topics.length} Topics)</span>
                <i class="ph ph-caret-down" style="font-size:10px; color:var(--text-muted);"></i>
              </summary>
              <div style="margin-top:8px; margin-left:10px; display:flex; flex-direction:column; gap:4px;">
          \`;

          topics.forEach(topic => {
            const escapedTopic = topic.replace(/'/g, "\\\\'");
            html += \`
              <div style="display:flex; justify-content:space-between; align-items:center; padding:6px; border-bottom:1px solid rgba(255,255,255,0.05);">
                <span style="font-size:11.5px; color:var(--text-muted);">\${topic}</span>
                <button class="btn primary btn-sm" onclick="document.getElementById('modal').close(); TestTreeEngine.launchChapterTest(\${level}, '\${ch.id}', '\${escapedTopic}')" style="padding:4px 8px; font-size:10px;">
                  Start
                </button>
              </div>
            \`;
          });

          html += \`
              </div>
            </details>
          \`;
        }
      });

      html += \`
          </div>
        </details>
      \`;
    });

    html += \`
        </div>
      </div>
    \`;

    modalBody.innerHTML = html;
    modal.showModal();
  },

  launchChapterTest(level, chapterId, topicName = null) {
    const allCh = typeof getAllChapters === 'function' ? getAllChapters() : [];
    const ch = allCh.find(c => c.id === chapterId);
    if (!ch) return;

    const count = level === 1 ? 5 : 15;
    const duration = level === 1 ? 5 : 15;
    const testTitle = topicName ? \`\${topicName} (Micro-Test)\` : ch.title + ' (Chapter Exam)';

    if (window.MockTestEngine) {
      window.MockTestEngine.initHierarchicalTest({
        level: level,
        testId: 'lvl' + level + '_' + chapterId + (topicName ? '_' + Date.now() : ''),
        title: testTitle,
        chapterId: chapterId,
        chapterTitle: ch.title,
        topicTitle: topicName,
        subjectCode: ch.subjectCode,
        count: count,
        durationMinutes: duration
      });
    }
  },

  `;

  treeContent = treeContent.substring(0, startIdx) + newCode + treeContent.substring(endIdx);
  fs.writeFileSync(treePath, treeContent);
  console.log('Accordion modal implemented successfully!');
} else {
  console.log('Could not find injection point');
}
