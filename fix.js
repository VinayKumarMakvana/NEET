const fs = require('fs');

// Fix Mock Engine
let mockPath = 'js/mock-engine.js';
let mockContent = fs.readFileSync(mockPath, 'utf8');

if (!mockContent.includes('startPracticeTest(chapterId)')) {
  const insertMockCode = `
  startPracticeTest(chapterId) {
    if (typeof getAllChapters !== 'function') return;
    const allCh = getAllChapters();
    const ch = allCh.find(c => c.id === chapterId);
    if (!ch) return;
    
    this.initHierarchicalTest({
      level: 2,
      testId: 'chap_' + chapterId,
      title: ch.title + ' Exam',
      chapterId: chapterId,
      chapterTitle: ch.title,
      subjectCode: ch.subjectCode,
      count: 15,
      durationMinutes: 15
    });
  },`;
  mockContent = mockContent.replace('isOmrMode: false,', 'isOmrMode: false,\n' + insertMockCode);
  if (!mockContent.includes('window.MockEngine = MockTestEngine')) {
      mockContent += '\nwindow.MockEngine = MockTestEngine;\n';
  }
  fs.writeFileSync(mockPath, mockContent);
  console.log('Updated mock-engine.js');
}

// Fix Test Tree Engine
let treePath = 'js/test-tree-engine.js';
let treeContent = fs.readFileSync(treePath, 'utf8');

if (!treeContent.includes('openChapterSelectorModal')) {
  const insertTreeCode = `
  openChapterSelectorModal(level) {
    const allCh = typeof getAllChapters === 'function' ? getAllChapters() : [];
    if (allCh.length === 0) return;

    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody) return;

    const title = level === 1 ? 'Select Topic for Micro-Test' : 'Select Chapter for Exam';

    let html = \`
      <div style="padding:20px;">
        <h2 style="margin-top:0; color:var(--text-main); font-size:18px;">\${title}</h2>
        <div style="display:flex; flex-direction:column; gap:10px; max-height:60vh; overflow-y:auto; padding-right:10px;">
    \`;

    allCh.forEach(ch => {
      html += \`
        <div class="card" style="padding:15px; border-left:4px solid var(--brand-sky); display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">\${ch.subjectCode}</div>
            <div style="font-weight:700; color:var(--text-main); font-size:13px;">\${ch.title}</div>
          </div>
          <button class="btn primary btn-sm" onclick="document.getElementById('modal').close(); TestTreeEngine.launchChapterTest(\${level}, '\${ch.id}')" style="flex-shrink:0; margin-left:10px;">
            Start <i class="ph-bold ph-play"></i>
          </button>
        </div>
      \`;
    });

    html += \`
        </div>
      </div>
    \`;

    modalBody.innerHTML = html;
    modal.showModal();
  },

  launchChapterTest(level, chapterId) {
    const allCh = typeof getAllChapters === 'function' ? getAllChapters() : [];
    const ch = allCh.find(c => c.id === chapterId);
    if (!ch) return;

    const count = level === 1 ? 5 : 15;
    const duration = level === 1 ? 5 : 15;

    if (window.MockTestEngine) {
      window.MockTestEngine.initHierarchicalTest({
        level: level,
        testId: 'lvl' + level + '_' + chapterId,
        title: ch.title + (level === 1 ? ' Micro-Test' : ' Chapter Exam'),
        chapterId: chapterId,
        chapterTitle: ch.title,
        subjectCode: ch.subjectCode,
        count: count,
        durationMinutes: duration
      });
    }
  },
`;
  
  treeContent = treeContent.replace(
    `onclick="if(window.navigateView) window.navigateView('home');">Go to Syllabus +'</button>`,
    `onclick="TestTreeEngine.openChapterSelectorModal(1)">Take Topic Test +'</button>`
  );
  
  treeContent = treeContent.replace(
    `onclick="if(window.navigateView) window.navigateView('home');">Select Chapter +'</button>`,
    `onclick="TestTreeEngine.openChapterSelectorModal(2)">Take Chapter Exam +'</button>`
  );

  treeContent = treeContent.replace('getTreeStats() {', insertTreeCode + '\n  getTreeStats() {');
  
  fs.writeFileSync(treePath, treeContent);
  console.log('Updated test-tree-engine.js');
}
