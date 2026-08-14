/**
 * NEET UG 2028: Hierarchical Tree-Testing Engine
 * Level 1: Topic Micro-Tests (Compulsory per Subtopic)
 * Level 2: Chapter Milestone Tests (Full Chapter Exam)
 * Level 3: Single-Subject Full Mastery (3 Phy, 3 Chem, 3 Bot, 3 Zoo = 12 Tests)
 * Level 4: 2-Subject Combinations (Phy+Chem, Bot+Zoo, Phy+Bio = 9 Tests)
 * Level 5: 3-Subject Combinations (Physics+Chemistry+Biology = 3 Tests)
 * Level 6: 10 Full-Length Pre-NEET Grand Mocks (720 Marks · 200 Mins · NTA Simulation)
 */

const TestTreeEngine = {
  // Configured test structures
  LEVEL_CONFIG: {
    1: { name: 'Level 1: Topic Micro-Tests', questions: 5, durationMins: 5, passMarksPct: 60, badge: 'MICRO-TEST' },
    2: { name: 'Level 2: Chapter Milestone Tests', questions: 15, durationMins: 15, passMarksPct: 65, badge: 'CHAPTER EXAM' },
    3: { name: 'Level 3: Single-Subject Full Mastery', questions: 45, durationMins: 45, passMarksPct: 70, badge: 'SUBJECT MASTERY' },
    4: { name: 'Level 4: 2-Subject Combined Tests', questions: 90, durationMins: 90, passMarksPct: 75, badge: '2-SUB COMBO' },
    5: { name: 'Level 5: 3-Subject Combined Tests', questions: 135, durationMins: 135, passMarksPct: 80, badge: '3-SUB COMBO' },
    6: { name: 'Level 6: Pre-NEET Grand Mocks', questions: 200, durationMins: 200, passMarksPct: 85, badge: '720 GRAND MOCK' }
  },

  // Pre-configured Single Subject Tests (Level 3)
  SUBJECT_TESTS: [
    { id: 'sub-phy-1', subjectCode: 'phy', subject: 'Physics', num: 1, title: 'Physics Full Test 01: Mechanics & General Physics', questions: 45, duration: 45 },
    { id: 'sub-phy-2', subjectCode: 'phy', subject: 'Physics', num: 2, title: 'Physics Full Test 02: Electrodynamics, Optics & Modern Physics', questions: 45, duration: 45 },
    { id: 'sub-phy-3', subjectCode: 'phy', subject: 'Physics', num: 3, title: 'Physics Full Test 03: Complete Class 11 & 12 Grand Physics', questions: 45, duration: 45 },

    { id: 'sub-chem-1', subjectCode: 'chem', subject: 'Chemistry', num: 1, title: 'Chemistry Full Test 01: Physical & Inorganic Chemistry', questions: 45, duration: 45 },
    { id: 'sub-chem-2', subjectCode: 'chem', subject: 'Chemistry', num: 2, title: 'Chemistry Full Test 02: Organic Chemistry Reaction Mechanisms & Bio-molecules', questions: 45, duration: 45 },
    { id: 'sub-chem-3', subjectCode: 'chem', subject: 'Chemistry', num: 3, title: 'Chemistry Full Test 03: Complete Class 11 & 12 Grand Chemistry', questions: 45, duration: 45 },

    { id: 'sub-bot-1', subjectCode: 'bot', subject: 'Botany', num: 1, title: 'Botany Full Test 01: Plant Physiology & Cell Biology', questions: 45, duration: 45 },
    { id: 'sub-bot-2', subjectCode: 'bot', subject: 'Botany', num: 2, title: 'Botany Full Test 02: Genetics, Ecology & Plant Diversity', questions: 45, duration: 45 },
    { id: 'sub-bot-3', subjectCode: 'bot', subject: 'Botany', num: 3, title: 'Botany Full Test 03: Complete Class 11 & 12 Grand Botany', questions: 45, duration: 45 },

    { id: 'sub-zoo-1', subjectCode: 'zoo', subject: 'Zoology', num: 1, title: 'Zoology Full Test 01: Human Physiology & Animal Diversity', questions: 45, duration: 45 },
    { id: 'sub-zoo-2', subjectCode: 'zoo', subject: 'Zoology', num: 2, title: 'Zoology Full Test 02: Human Reproduction, Evolution & Biotechnology', questions: 45, duration: 45 },
    { id: 'sub-zoo-3', subjectCode: 'zoo', subject: 'Zoology', num: 3, title: 'Zoology Full Test 03: Complete Class 11 & 12 Grand Zoology', questions: 45, duration: 45 }
  ],

  // 2-Subject Combinations (Level 4)
  COMBO_2_TESTS: [
    { id: 'combo2-pc-1', type: 'phy_chem', title: 'Physics + Chemistry Combined Test 01', subjects: ['phy', 'chem'], num: 1, questions: 90, duration: 90 },
    { id: 'combo2-pc-2', type: 'phy_chem', title: 'Physics + Chemistry Combined Test 02', subjects: ['phy', 'chem'], num: 2, questions: 90, duration: 90 },
    { id: 'combo2-pc-3', type: 'phy_chem', title: 'Physics + Chemistry Combined Test 03', subjects: ['phy', 'chem'], num: 3, questions: 90, duration: 90 },

    { id: 'combo2-bz-1', type: 'bot_zoo', title: 'Complete Biology (Botany + Zoology) Test 01', subjects: ['bot', 'zoo'], num: 1, questions: 90, duration: 90 },
    { id: 'combo2-bz-2', type: 'bot_zoo', title: 'Complete Biology (Botany + Zoology) Test 02', subjects: ['bot', 'zoo'], num: 2, questions: 90, duration: 90 },
    { id: 'combo2-bz-3', type: 'bot_zoo', title: 'Complete Biology (Botany + Zoology) Test 03', subjects: ['bot', 'zoo'], num: 3, questions: 90, duration: 90 },

    { id: 'combo2-pb-1', type: 'phy_bio', title: 'Physics + Biology High-Yield Cross Drill 01', subjects: ['phy', 'bot', 'zoo'], num: 1, questions: 90, duration: 90 },
    { id: 'combo2-pb-2', type: 'phy_bio', title: 'Physics + Biology High-Yield Cross Drill 02', subjects: ['phy', 'bot', 'zoo'], num: 2, questions: 90, duration: 90 },
    { id: 'combo2-pb-3', type: 'phy_bio', title: 'Physics + Biology High-Yield Cross Drill 03', subjects: ['phy', 'bot', 'zoo'], num: 3, questions: 90, duration: 90 }
  ],

  // 3-Subject PCB Combinations (Level 5)
  COMBO_3_TESTS: [
    { id: 'combo3-pcb-1', title: 'PCB Grand Integration Test 01: Class 11 Complete', subjects: ['phy', 'chem', 'bot', 'zoo'], num: 1, questions: 135, duration: 135 },
    { id: 'combo3-pcb-2', title: 'PCB Grand Integration Test 02: Class 12 Complete', subjects: ['phy', 'chem', 'bot', 'zoo'], num: 2, questions: 135, duration: 135 },
    { id: 'combo3-pcb-3', title: 'PCB Grand Integration Test 03: Full High-Yield Syllabus Simulation', subjects: ['phy', 'chem', 'bot', 'zoo'], num: 3, questions: 135, duration: 135 }
  ],

  // 10 Full-Length Pre-NEET Grand Mocks (Level 6)
  GRAND_MOCKS: Array.from({ length: 10 }, (_, i) => ({
    id: `grand-mock-${i + 1}`,
    mockNum: i + 1,
    title: `Pre-NEET Grand Mock ${String(i + 1).padStart(2, '0')} (Official NTA 720 Simulation)`,
    questions: 200,
    attemptTarget: 180,
    totalMarks: 720,
    duration: 200,
    difficulty: i < 3 ? 'Standard NTA' : i < 7 ? 'Moderate (AIIMS Trend)' : 'Tricky / High Cutoff Director Exam',
    badge: `PRE-NEET ${String(i + 1).padStart(2, '0')}`
  })),

  // State Accessor & Initialization
  getTreeState() {
    if (!window.appState) return {};
    window.appState.testTree = window.appState.testTree || {
      topicTests: {},    // { [topicKey]: { score, total, percentage, date, passed } }
      chapterTests: {},  // { [chapterId]: { score, total, percentage, date, passed } }
      subjectTests: {},  // { [testId]: { score, total, percentage, date, passed } }
      combo2Tests: {},   // { [testId]: { score, total, percentage, date, passed } }
      combo3Tests: {},   // { [testId]: { score, total, percentage, date, passed } }
      grandMocks: {}     // { [mockId]: { score, total, percentage, date, passed, rank } }
    };
    return window.appState.testTree;
  },

  // Save state helper
  saveTreeState() {
    if (typeof window.saveState === 'function') {
      window.saveState();
    }
  },

  // Calculate Overall Tree Progress
  
  
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

    let html = `
      <div style="padding:20px;">
        <h2 style="margin-top:0; color:var(--text-main); font-size:18px;">${title}</h2>
        <div style="max-height:65vh; overflow-y:auto; padding-right:5px; display:flex; flex-direction:column; gap:8px;">
    `;

    Object.keys(subjects).forEach(subKey => {
      const sub = subjects[subKey];
      if (sub.chapters.length === 0) return;

      html += `
        <details style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:8px; padding:10px;">
          <summary style="font-weight:800; font-size:15px; cursor:pointer; color:var(--brand-sky); padding:5px; list-style:none; display:flex; justify-content:space-between; align-items:center;">
            <span><i class="ph-fill ${sub.icon}"></i> ${sub.name} (${sub.chapters.length})</span>
            <i class="ph ph-caret-down" style="font-size:12px;"></i>
          </summary>
          <div style="margin-top:10px; display:flex; flex-direction:column; gap:6px;">
      `;

      sub.chapters.forEach(ch => {
        if (level === 2) {
          // Level 2: Chapter Exam
          html += `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:10px; border-radius:6px;">
              <span style="font-size:13px; font-weight:600;">${ch.title}</span>
              <button class="btn primary btn-sm" onclick="document.getElementById('modal').close(); TestTreeEngine.launchChapterTest(${level}, '${ch.id}')" style="flex-shrink:0;">
                Start Test <i class="ph-bold ph-play"></i>
              </button>
            </div>
          `;
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

          html += `
            <details style="background:rgba(0,0,0,0.1); border-left:3px solid var(--brand-teal); border-radius:4px; padding:8px;">
              <summary style="font-size:13px; font-weight:700; cursor:pointer; color:var(--text-main); list-style:none; display:flex; justify-content:space-between;">
                <span>${ch.title} (${topics.length} Topics)</span>
                <i class="ph ph-caret-down" style="font-size:10px; color:var(--text-muted);"></i>
              </summary>
              <div style="margin-top:8px; margin-left:10px; display:flex; flex-direction:column; gap:4px;">
          `;

          topics.forEach(topic => {
            const escapedTopic = topic.replace(/'/g, "\\'");
            html += `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:6px; border-bottom:1px solid rgba(255,255,255,0.05);">
                <span style="font-size:11.5px; color:var(--text-muted);">${topic}</span>
                <button class="btn primary btn-sm" onclick="document.getElementById('modal').close(); TestTreeEngine.launchChapterTest(${level}, '${ch.id}', '${escapedTopic}')" style="padding:4px 8px; font-size:10px;">
                  Start
                </button>
              </div>
            `;
          });

          html += `
              </div>
            </details>
          `;
        }
      });

      html += `
          </div>
        </details>
      `;
    });

    html += `
        </div>
      </div>
    `;

    modalBody.innerHTML = html;
    modal.showModal();
  },

  launchChapterTest(level, chapterId, topicName = null) {
    const allCh = typeof getAllChapters === 'function' ? getAllChapters() : [];
    const ch = allCh.find(c => c.id === chapterId);
    if (!ch) return;

    const count = level === 1 ? 5 : 15;
    const duration = level === 1 ? 5 : 15;
    const testTitle = topicName ? `${topicName} (Micro-Test)` : ch.title + ' (Chapter Exam)';

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

  getTreeStats() {
    const state = this.getTreeState();
    const allCh = typeof getAllChapters === 'function' ? getAllChapters() : [];

    const topicDone = Object.keys(state.topicTests || {}).length;
    const chapterDone = Object.values(state.chapterTests || {}).filter(t => t.passed).length;
    const subjectDone = Object.values(state.subjectTests || {}).filter(t => t.passed).length;
    const combo2Done = Object.values(state.combo2Tests || {}).filter(t => t.passed).length;
    const combo3Done = Object.values(state.combo3Tests || {}).filter(t => t.passed).length;
    const grandDone = Object.values(state.grandMocks || {}).filter(t => t.passed || t.percentage >= 50).length;

    return {
      topicDone,
      chapterDone,
      totalChapters: allCh.length || 96,
      subjectDone,
      totalSubjects: this.SUBJECT_TESTS.length, // 12
      combo2Done,
      totalCombo2: this.COMBO_2_TESTS.length, // 9
      combo3Done,
      totalCombo3: this.COMBO_3_TESTS.length, // 3
      grandDone,
      totalGrandMocks: this.GRAND_MOCKS.length, // 10
      totalAttempted: topicDone + chapterDone + subjectDone + combo2Done + combo3Done + grandDone
    };
  },

  // Launch Level 1: Topic Micro-Test
  launchTopicTest(chapterId, topicTitle) {
    const allCh = typeof getAllChapters === 'function' ? getAllChapters() : [];
    const chapter = allCh.find(c => c.id === chapterId);
    const subjectCode = chapter ? chapter.subjectCode : 'all';
    const cleanTopic = (topicTitle || 'General Topic').trim();

    if (window.MockTestEngine) {
      window.MockTestEngine.initHierarchicalTest({
        level: 1,
        testId: `topic_${chapterId}_${cleanTopic.replace(/[^a-zA-Z0-9]/g, '_')}`,
        title: `Topic Test: ${cleanTopic}`,
        chapterId,
        subjectCode,
        count: 5,
        durationMinutes: 5,
        drillType: 'topic_test',
        topicTitle: cleanTopic
      });
    }
  },

  // Launch Level 3: Subject Full Test
  launchSubjectTest(testId) {
    const config = this.SUBJECT_TESTS.find(t => t.id === testId);
    if (!config || !window.MockTestEngine) return;

    // Progression Lock: Must pass at least 1 Chapter Test in this subject
    const state = this.getTreeState();
    const allCh = typeof getAllChapters === 'function' ? getAllChapters() : [];
    const subjectChapters = allCh.filter(c => c.subjectCode === config.subjectCode).map(c => `ch_exam_${c.id}`);

    // Level 2 lock removed

    window.MockTestEngine.initHierarchicalTest({
      level: 3,
      testId: config.id,
      title: config.title,
      subjectCode: config.subjectCode,
      count: config.questions,
      durationMinutes: config.duration,
      drillType: 'subject_mastery'
    });
  },

  // Launch Level 4: 2-Subject Combo Test
  launchCombo2Test(testId) {
    if (typeof window !== 'undefined' && window.PaymentEngine && !window.PaymentEngine.isLevelUnlocked(4)) {
      window.PaymentEngine.openCheckoutModal('level4');
      return;
    }

    const config = this.COMBO_2_TESTS.find(t => t.id === testId);
    if (!config || !window.MockTestEngine) return;

    window.MockTestEngine.initHierarchicalTest({
      level: 4,
      testId: config.id,
      title: config.title,
      subjectCode: config.subjects.join('_'),
      subjectsList: config.subjects,
      count: config.questions,
      durationMinutes: config.duration,
      drillType: 'combo2_test'
    });
  },

  // Launch Level 5: 3-Subject Combo Test
  launchCombo3Test(testId) {
    if (typeof window !== 'undefined' && window.PaymentEngine && !window.PaymentEngine.isLevelUnlocked(5)) {
      window.PaymentEngine.openCheckoutModal('level5');
      return;
    }

    const config = this.COMBO_3_TESTS.find(t => t.id === testId);
    if (!config || !window.MockTestEngine) return;

    window.MockTestEngine.initHierarchicalTest({
      level: 5,
      testId: config.id,
      title: config.title,
      subjectCode: 'all',
      count: config.questions,
      durationMinutes: config.duration,
      drillType: 'combo3_test'
    });
  },

  // Launch Level 6: 10 Pre-NEET Grand Mocks
  launchPreNeetMock(mockNum) {
    if (typeof window !== 'undefined' && window.PaymentEngine && !window.PaymentEngine.isLevelUnlocked(6)) {
      window.PaymentEngine.openCheckoutModal('level6');
      return;
    }

    const config = this.GRAND_MOCKS.find(m => m.mockNum === +mockNum);
    if (!config || !window.MockTestEngine) return;

    window.MockTestEngine.initHierarchicalTest({
      level: 6,
      testId: config.id,
      title: config.title,
      subjectCode: 'all',
      count: 200,
      attemptTarget: 180,
      totalMarks: 720,
      durationMinutes: config.duration, // 200 mins
      drillType: 'grand_mock',
      mockNum: config.mockNum
    });
  },

  // Record Result into Hierarchy Tree
  recordResult(testInfo) {
    const state = this.getTreeState();
    const { level, testId, score, maxScore, percentage, passed, correct, wrong, unattempted } = testInfo;
    const now = new Date().toISOString();

    const record = {
      score,
      maxScore,
      percentage,
      passed: !!passed,
      correct,
      wrong,
      unattempted,
      date: now
    };

    if (level === 1) {
      state.topicTests[testId] = record;
    } else if (level === 2) {
      state.chapterTests[testId] = record;
    } else if (level === 3) {
      state.subjectTests[testId] = record;
    } else if (level === 4) {
      state.combo2Tests[testId] = record;
    } else if (level === 5) {
      state.combo3Tests[testId] = record;
    } else if (level === 6) {
      state.grandMocks[testId] = record;
    }

    this.saveTreeState();
  },

  renderTreeHTML() {
    const isHindi = (typeof appState !== 'undefined' && appState.lang === 'hindi');

    return `
      <div style="padding: 10px 0;">
        <h2 style="font-size:20px; margin-bottom:16px; color:var(--brand-gold);">🏆 NEET 6-Level Mastery Tree</h2>
        <p style="font-size:12px; color:var(--text-muted); margin-bottom:20px;">
          Progressively unlock higher levels by conquering micro-tests and chapter milestones.
        </p>
        
        <div class="card-grid">
          <!-- Level 1 -->
          <div class="card" style="padding:16px; position:relative; overflow:hidden;">
            <div style="position:absolute; top:0; left:0; width:4px; height:100%; background:var(--brand-teal);"></div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="tag" style="background:rgba(13,148,136,0.2); color:var(--brand-teal);">LEVEL 1</span>
              <span style="font-size:12px; font-weight:700; color:var(--brand-emerald);">UNLOCKED</span>
            </div>
            <h3 style="font-size:16px; margin:0 0 4px;">Topic Micro-Tests</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">5 Qs • 5 Mins • Instant Review</p>
            <button class="btn btn-sm" style="width:100%; background:var(--bg-surface); border:1px solid var(--brand-teal); color:var(--text-main);" onclick="TestTreeEngine.openChapterSelectorModal(1)">Take Topic Test <i class="ph-bold ph-arrow-right"></i></button>
          </div>

          <!-- Level 2 -->
          <div class="card" style="padding:16px; position:relative; overflow:hidden;">
            <div style="position:absolute; top:0; left:0; width:4px; height:100%; background:var(--brand-cyan);"></div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="tag" style="background:rgba(6,182,212,0.2); color:var(--brand-cyan);">LEVEL 2</span>
              <span style="font-size:12px; font-weight:700; color:var(--brand-emerald);">UNLOCKED</span>
            </div>
            <h3 style="font-size:16px; margin:0 0 4px;">Chapter Exams</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">15 Qs • 15 Mins • Milestones</p>
            <button class="btn btn-sm" style="width:100%; background:var(--bg-surface); border:1px solid var(--brand-cyan); color:var(--text-main);" onclick="TestTreeEngine.openChapterSelectorModal(2)">Take Chapter Exam <i class="ph-bold ph-arrow-right"></i></button>
          </div>

          <!-- Level 3 -->
          <div class="card" style="padding:16px; position:relative; overflow:hidden;">
            <div style="position:absolute; top:0; left:0; width:4px; height:100%; background:var(--brand-indigo);"></div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="tag" style="background:rgba(99,102,241,0.2); color:var(--brand-indigo);">LEVEL 3</span>
              <span style="font-size:12px; font-weight:700; color:var(--brand-emerald);">UNLOCKED</span>
            </div>
            <h3 style="font-size:16px; margin:0 0 4px;">Subject Full Tests</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">45 Qs • 45 Mins • Mastery</p>
            <button class="btn btn-sm" style="width:100%; background:var(--brand-indigo); color:white;" onclick="TestTreeEngine.launchSubjectTest('sub-phy-3')">Try Physics Grand →</button>
          </div>

          <!-- Level 4 -->
          <div class="card" style="padding:16px; position:relative; overflow:hidden;">
            <div style="position:absolute; top:0; left:0; width:4px; height:100%; background:var(--brand-violet);"></div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="tag" style="background:rgba(139,92,246,0.2); color:var(--brand-violet);">LEVEL 4</span>
              <span style="font-size:12px; font-weight:700; color:var(--brand-gold);">PREMIUM</span>
            </div>
            <h3 style="font-size:16px; margin:0 0 4px;">2-Subject Combo</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">90 Qs • 90 Mins • Mixed Drill</p>
            <button class="btn btn-sm" style="width:100%; background:var(--bg-surface); border:1px solid var(--brand-violet); color:var(--text-main);" onclick="TestTreeEngine.launchCombo2Test('combo2-pc-1')">Start PC Combo →</button>
          </div>

          <!-- Level 5 -->
          <div class="card" style="padding:16px; position:relative; overflow:hidden;">
            <div style="position:absolute; top:0; left:0; width:4px; height:100%; background:var(--brand-rose);"></div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="tag" style="background:rgba(244,63,94,0.2); color:var(--brand-rose);">LEVEL 5</span>
              <span style="font-size:12px; font-weight:700; color:var(--brand-gold);">PREMIUM</span>
            </div>
            <h3 style="font-size:16px; margin:0 0 4px;">3-Subject Combo</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">135 Qs • 135 Mins • Integration</p>
            <button class="btn btn-sm" style="width:100%; background:var(--bg-surface); border:1px solid var(--brand-rose); color:var(--text-main);" onclick="TestTreeEngine.launchCombo3Test('combo3-pcb-1')">Start PCB Combo →</button>
          </div>

          <!-- Level 6 -->
          <div class="card" style="padding:16px; position:relative; overflow:hidden; border:1px solid rgba(245,158,11,0.3);">
            <div style="position:absolute; top:0; left:0; width:4px; height:100%; background:var(--brand-gold);"></div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="tag gold">LEVEL 6 (FINAL)</span>
              <span style="font-size:12px; font-weight:700; color:var(--brand-gold);">PREMIUM</span>
            </div>
            <h3 style="font-size:16px; margin:0 0 4px;">10 Grand Mocks</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">200 Qs • 200 Mins • NTA Simulation</p>
            <button class="btn btn-primary btn-sm" style="width:100%;" onclick="TestTreeEngine.launchPreNeetMock(1)">Start Mock 1 🚀</button>
          </div>
        </div>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.TestTreeEngine = TestTreeEngine;
} else if (typeof global !== 'undefined') {
  global.TestTreeEngine = TestTreeEngine;
}
