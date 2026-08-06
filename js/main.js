/**
 * NEET UG 2028: Master Application Core
 * Unified State Management, Views, Pomodoro Timer & 2028 Exam OS
 */

const STORAGE_KEY = 'neet-2028-medical-os-v1';

// Seed Initial State
const seedState = {
  profile: {
    targetYear: 2028,
    targetDate: '2028-05-07T09:00:00', // Typical 1st Sunday of May 2028
    dailyTargetHours: 10,
    theme: 'dark'
  },
  doctorName: '',
  targetCollege: 'AIIMS New Delhi',
  progress: {},       // { chapterId: boolean }
  revisions: {},      // { chapterId: ISOString nextDue }
  flashcardReviews: {}, // { flashcardId: { intervalDays: number, nextDue: ISOString, count: number } }
  studySessions: [],  // [ { chapterId, minutes, date } ]
  customResources: [],
  testHistory: [],
  mistakes: [],
  notesNotes: {},
  startedAt: new Date().toISOString()
};

// Load State from LocalStorage
let appState = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || seedState;
// Ensure required keys exist
appState.progress = appState.progress || {};
appState.revisions = appState.revisions || {};
appState.flashcardReviews = appState.flashcardReviews || {};
appState.studySessions = appState.studySessions || [];
appState.testHistory = appState.testHistory || [];
appState.mistakes = appState.mistakes || [];
appState.customResources = appState.customResources || [];

function saveState() {
  const currentUid = (typeof ClerkAuth !== 'undefined' && ClerkAuth.currentUser && ClerkAuth.currentUser.id) 
    ? ClerkAuth.currentUser.id 
    : null;
  
  if (currentUid) {
    localStorage.setItem(`${STORAGE_KEY}_${currentUid}`, JSON.stringify(appState));
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));

  // Automatically sync full database to Clerk Cloud Metadata
  if (typeof ClerkAuth !== 'undefined' && typeof ClerkAuth.syncDatabaseToClerkCloud === 'function') {
    ClerkAuth.syncDatabaseToClerkCloud();
  }
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>'"]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[c]));
}

// Spaced Repetition Queue Logic
function getDueRevisionChapters() {
  const now = Date.now();
  const allCh = getAllChapters();
  return allCh
    .filter(ch => appState.progress[ch.id])
    .filter(ch => !appState.revisions[ch.id] || new Date(appState.revisions[ch.id]).getTime() <= now)
    .sort((a, b) => new Date(appState.revisions[a.id] || 0) - new Date(appState.revisions[b.id] || 0));
}

function scheduleRevision(chapterId, days) {
  appState.revisions[chapterId] = new Date(Date.now() + days * 864e5).toISOString();
  saveState();
  renderApp();
}

function toggleChapterComplete(chapterId) {
  appState.progress[chapterId] = !appState.progress[chapterId];
  if (appState.progress[chapterId]) {
    // Schedule first revision in 1 day
    appState.revisions[chapterId] = new Date(Date.now() + 864e5).toISOString();
  } else {
    delete appState.revisions[chapterId];
  }
  saveState();
  renderApp();
}

// 720 Score Predictor Engine
function calculatePredictedScore() {
  const allCh = getAllChapters();
  if (!allCh.length) return 0;
  
  const completedCh = allCh.filter(ch => appState.progress[ch.id]).length;
  const syllabusPct = completedCh / allCh.length;

  // Base score from syllabus coverage (up to 540 marks)
  let score = syllabusPct * 540;

  // Mock test score factor (up to 120 marks)
  if (appState.testHistory.length > 0) {
    const avgTestPct = appState.testHistory.reduce((sum, t) => sum + (t.percentage || 0), 0) / appState.testHistory.length;
    score += (avgTestPct / 100) * 120;
  } else {
    score += syllabusPct * 80;
  }

  // Mistake resolution bonus (up to 60 marks)
  const totalMistakes = appState.mistakes.length;
  if (totalMistakes > 0) {
    const resolvedCount = appState.mistakes.filter(m => m.resolved).length;
    const resRatio = resolvedCount / totalMistakes;
    score += resRatio * 60;
  } else {
    score += 40;
  }

  return Math.min(720, Math.round(score));
}

// Subject Progress Helpers
function getSubjectProgress(subjectCode) {
  const subjectChapters = getSubjectChapters(subjectCode);
  if (!subjectChapters.length) return { count: 0, total: 0, pct: 0, hours: 0 };
  const done = subjectChapters.filter(ch => appState.progress[ch.id]).length;
  const total = subjectChapters.length;
  const hours = subjectChapters.reduce((a, b) => a + b.hours, 0);
  return {
    count: done,
    total,
    pct: Math.round((done / total) * 100),
    hours
  };
}

// Pomodoro Timer Engine
// Advanced Customizable Focus & Pomodoro Timer Engine
const PomodoroTimer = {
  durationMinutes: (typeof appState !== 'undefined' && appState.profile && appState.profile.customTimerMinutes) || 25,
  remainingSeconds: 25 * 60,
  totalSeconds: 25 * 60,
  isRunning: false,
  intervalId: null,
  activeChapterId: null,

  init() {
    const saved = (typeof appState !== 'undefined' && appState.profile && appState.profile.customTimerMinutes) || 25;
    this.durationMinutes = saved;
    this.remainingSeconds = saved * 60;
    this.totalSeconds = saved * 60;
  },

  setDuration(minutes) {
    const parsed = parseInt(minutes, 10);
    if (isNaN(parsed) || parsed <= 0) return;
    const cleanMinutes = Math.min(360, Math.max(1, parsed)); // 1 min to 6 hours
    
    this.pause();
    this.durationMinutes = cleanMinutes;
    this.remainingSeconds = cleanMinutes * 60;
    this.totalSeconds = cleanMinutes * 60;
    
    if (typeof appState !== 'undefined' && appState.profile) {
      appState.profile.customTimerMinutes = cleanMinutes;
      saveState();
    }
    
    this.updateDisplay();
  },

  start(chapterId = null) {
    if (this.isRunning) return;
    this.isRunning = true;
    if (chapterId) this.activeChapterId = chapterId;

    this.intervalId = setInterval(() => {
      this.remainingSeconds--;
      this.updateDisplay();

      if (this.remainingSeconds <= 0) {
        clearInterval(this.intervalId);
        this.isRunning = false;
        this.remainingSeconds = this.durationMinutes * 60;
        
        this.playChime();

        // Log study time
        if (typeof appState !== 'undefined') {
          appState.studySessions.push({
            chapterId: this.activeChapterId || 'general_study',
            minutes: this.durationMinutes,
            date: new Date().toISOString()
          });
          saveState();
          renderApp();
        }

        setTimeout(() => {
          alert(`🎯 Focus Session Complete (${this.durationMinutes} Minutes)! Great deep work. Take a short 5-minute break to consolidate your NCERT recall.`);
        }, 100);
        this.updateDisplay();
      }
    }, 1000);
    this.updateDisplay();
  },

  pause() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.updateDisplay();
  },

  reset() {
    this.pause();
    this.remainingSeconds = this.durationMinutes * 60;
    this.totalSeconds = this.durationMinutes * 60;
    this.updateDisplay();
  },

  setChapter(chapterId) {
    this.activeChapterId = chapterId || null;
  },

  playChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playTone = (freq, start, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playTone(523.25, 0, 0.4); // C5
      playTone(659.25, 0.2, 0.4); // E5
      playTone(783.99, 0.4, 0.6); // G5
      playTone(1046.50, 0.6, 0.8); // C6
    } catch (e) {
      console.log('Audio chime not supported or muted');
    }
  },

  updateDisplay() {
    const displayEl = document.getElementById('pomoTimeDisplay');
    const startBtn = document.getElementById('pomoStartBtn');
    const progressEl = document.getElementById('pomoProgressBar');
    const customInput = document.getElementById('pomoCustomInput');
    
    if (displayEl) {
      const m = Math.floor(this.remainingSeconds / 60);
      const s = this.remainingSeconds % 60;
      displayEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    if (customInput && document.activeElement !== customInput) {
      customInput.value = this.durationMinutes;
    }

    if (progressEl && this.totalSeconds > 0) {
      const elapsed = this.totalSeconds - this.remainingSeconds;
      const pct = Math.min(100, Math.round((elapsed / this.totalSeconds) * 100));
      progressEl.style.width = `${pct}%`;
    }

    if (startBtn) {
      startBtn.innerHTML = this.isRunning ? '⏸ Pause' : '▶ Start Focus';
      startBtn.className = this.isRunning ? 'btn ghost' : 'btn btn-primary';
    }

    // Update active state on preset chips
    document.querySelectorAll('.timer-preset-chip').forEach(chip => {
      const mins = parseInt(chip.dataset.minutes, 10);
      chip.classList.toggle('active-preset', mins === this.durationMinutes);
    });
  }
};
PomodoroTimer.init();


// Real-Time Countdown to NEET 2028
function updateCountdownBadge() {
  const badge = document.getElementById('headerCountdown') || document.getElementById('countdownBadge');
  if (!badge) return;

  const target = new Date(appState.profile.targetDate).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    badge.innerHTML = `NEET 2028 EXAM DAY!`;
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  badge.innerHTML = `NEET 2028: <strong>${days} Days ${hours}h</strong> Left`;
}
setInterval(updateCountdownBadge, 60000);

// Global Auth Helper
function isAuthActive() {
  return typeof ClerkAuth !== 'undefined' && typeof ClerkAuth.isAuthenticated === 'function' && ClerkAuth.isAuthenticated();
}
window.isAuthActive = isAuthActive;

// Global Navigation
window.currentView = 'home';
function navigateView(viewName) {
  if (!isAuthActive()) {
    if (typeof ClerkAuth !== 'undefined' && typeof ClerkAuth.openSignIn === 'function') {
      ClerkAuth.openSignIn();
    }
    return;
  }
  window.currentView = viewName;
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.navigateView = navigateView;

// Open Chapter Detail Modal
function openChapterModal(chapterId) {
  if (!isAuthActive()) {
    if (typeof ClerkAuth !== 'undefined' && typeof ClerkAuth.openSignIn === 'function') {
      ClerkAuth.openSignIn();
    }
    return;
  }
  const ch = getAllChapters().find(c => c.id === chapterId);
  if (!ch) return;

  const isDone = !!appState.progress[chapterId];
  const loggedMinutes = (appState.studySessions || [])
    .filter(s => s.chapterId === chapterId)
    .reduce((sum, s) => sum + s.minutes, 0);

  const queryTerm = encodeURIComponent(`${ch.title} NEET`);
  const fullLectureFaculty = ch.subjectCode === 'phy' ? 'Alakh Pandey Physics Wallah' :
                             ch.subjectCode === 'chem' ? 'Pankaj Sir Chemistry' :
                             ch.subjectCode === 'bot' ? 'Tarun Sir Botany' : 'Dr Seep Pahuja Zoology';

  modalBody.innerHTML = `
    <span class="eyebrow">${escapeHtml(ch.standard)} · ${escapeHtml(ch.subject.toUpperCase())}</span>
    <h2 class="modal-title">${escapeHtml(ch.title)}</h2>
    
    <div style="display:flex; gap:6px; margin:8px 0; flex-wrap:wrap;">
      <span class="tag ${ch.subjectCode}">${ch.subject}</span>
      <span class="tag gold">Weightage: ${ch.weightage}</span>
      <span class="tag">Estimated: ${ch.hours} Hours</span>
      <span class="tag">${ch.ncertClass}</span>
    </div>

    <div class="callout">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <strong>Core NCERT Syllabus & Subtopics (Compulsory Tests):</strong>
        <span class="tag gold" style="font-size:10px;">LEVEL 1: 5 MCQs / 5 Mins</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px; margin-top:6px;">
        ${(ch.subtopics || '').split(/[,;•|\n]/).map(s => s.trim()).filter(Boolean).map(sub => `
          <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-secondary); padding:6px 10px; border-radius:6px; font-size:12.5px; border:1px solid var(--border-color); gap:8px;">
            <span style="color:var(--text-main); font-weight:500;">📖 ${escapeHtml(sub)}</span>
            <button class="btn ghost btn-sm" style="font-size:11px; padding:4px 8px; white-space:nowrap;" onclick="document.getElementById('modal').close(); TestTreeEngine.launchTopicTest('${chapterId}', '${escapeHtml(sub)}');">
              📝 Take Topic Test
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <h4 style="margin:16px 0 8px;">High-Yield Key Concepts</h4>
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
      ${ch.keyConcepts.map(c => `<span class="tag">${escapeHtml(c)}</span>`).join('')}
    </div>

    <!-- 🎥 Curated Free Video Lectures for this Chapter -->
    <div class="card" style="padding:16px; margin-bottom:16px; border:1px solid rgba(13, 148, 136, 0.3); background:rgba(13, 148, 136, 0.05);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <strong style="color:var(--brand-emerald); font-size:14px;">🎥 Curated Free Videos & One-Shots for This Chapter</strong>
        <span class="tag gold" style="font-size:10px;">100% Pure NCERT</span>
      </div>
      
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">
        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(ch.title + ' ' + fullLectureFaculty + ' full lecture')}" target="_blank" rel="noopener" class="btn ghost" style="font-size:12px; padding:8px 12px; justify-content:flex-start; text-decoration:none;">
          ▶ <strong>Full NCERT Lecture</strong> (${escapeHtml(fullLectureFaculty.split(' ')[0])}) ↗
        </a>
        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(ch.title + ' NEET one shot revision')}" target="_blank" rel="noopener" class="btn ghost" style="font-size:12px; padding:8px 12px; justify-content:flex-start; text-decoration:none;">
          ⚡ <strong>One-Shot Rapid Revision</strong> ↗
        </a>
        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(ch.title + ' NEET past 10 years pyq questions')}" target="_blank" rel="noopener" class="btn ghost" style="font-size:12px; padding:8px 12px; justify-content:flex-start; text-decoration:none;">
          🎯 <strong>10-Yr PYQ Video Solutions</strong> ↗
        </a>
        <a href="https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(ch.title)}" target="_blank" rel="noopener" class="btn ghost" style="font-size:12px; padding:8px 12px; justify-content:flex-start; text-decoration:none;">
          🏛️ <strong>Khan Academy Visuals (No Ads)</strong> ↗
        </a>
      </div>
    </div>

    <div class="card" style="padding:14px; margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>Study Logger & Pomodoro</strong>
          <small class="muted" style="display:block;">Logged: ${loggedMinutes} minutes</small>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="ghost" style="padding:6px 12px; font-size:12px;" onclick="logQuickStudy('${chapterId}', 25)">+25 Min</button>
          <button class="ghost" style="padding:6px 12px; font-size:12px;" onclick="logQuickStudy('${chapterId}', 60)">+1 Hour</button>
        </div>
      </div>
    </div>

    <!-- Chapter Milestone Exam Launcher (Level 2) -->
    <div class="card" style="padding:14px; margin-bottom:16px; border:1px solid rgba(245, 158, 11, 0.4); background:rgba(245, 158, 11, 0.04);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div>
          <strong style="color:var(--brand-gold); font-size:13.5px;">🏆 Level 2: Chapter Milestone Exam</strong>
          <small class="muted" style="display:block;">15 High-Yield Director-Level MCQs · 15 Mins · +4/-1 Marking</small>
        </div>
        <button class="btn btn-gold btn-sm" onclick="document.getElementById('modal').close(); TestTreeEngine.launchChapterTest('${chapterId}');">
          ⚡ Launch Chapter Exam →
        </button>
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; flex-wrap:wrap; gap:10px;">
      <button class="btn btn-primary" onclick="toggleChapterComplete('${chapterId}'); document.getElementById('modal').close();">
        ${isDone ? 'Mark Incomplete' : '✓ Mark Chapter Completed'}
      </button>
      <div style="display:flex; gap:8px;">
        <button class="btn ghost" onclick="document.getElementById('modal').close()">Close</button>
      </div>
    </div>
  `;

  const modal = document.getElementById('modal');
  if (modal) modal.showModal();
}
window.openChapterModal = openChapterModal;

function logQuickStudy(chapterId, minutes) {
  appState.studySessions.push({
    chapterId,
    minutes: +minutes,
    date: new Date().toISOString()
  });
  saveState();
  openChapterModal(chapterId);
  renderApp();
}
window.logQuickStudy = logQuickStudy;

function launchChapterQuiz(subjectCode) {
  MockTestEngine.initTest(subjectCode, 5, 10);
}
window.launchChapterQuiz = launchChapterQuiz;

// ================= VIEW RENDERERS =================

function renderHomeView() {
  const allCh = getAllChapters();
  const doneCount = allCh.filter(c => appState.progress[c.id]).length;
  const totalCount = allCh.length;
  const overallPct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  const predictedScore = calculatePredictedScore();

  const phy = getSubjectProgress('phy');
  const chem = getSubjectProgress('chem');
  const bot = getSubjectProgress('bot');
  const zoo = getSubjectProgress('zoo');

  const dueRevisions = getDueRevisionChapters();
  const nextChapter = allCh.find(c => !appState.progress[c.id]);

  const unresolvedMistakes = appState.mistakes.filter(m => !m.resolved).length;

  return `
    <section class="hero-banner">
      <div>
        <div class="doctor-crest">🩺 TARGET AIIMS NEW DELHI 2028 · 720/720 OS</div>
        <h2>Master the Science.<br><span>Become the Doctor.</span></h2>
        <p class="muted">
          Your complete offline-first medical preparation platform. 100% NCERT line-by-line coverage, NTA Section A/B mock tests, and systematic error elimination.
        </p>
        <div style="display:flex; gap:12px; margin-top:20px; flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="navigateView('syllabus')">Explore Full Syllabus →</button>
          <button class="btn btn-gold" onclick="MockTestEngine.initTest('all', 10, 20)">Start Daily Mock Test</button>
        </div>
      </div>

      <div class="hero-target-box">
        <div class="score-tracker-pill">
          <div>
            <span class="eyebrow">PREDICTED SCORE</span>
            <div class="score-display">${predictedScore}<span> / 720</span></div>
          </div>
          <span class="target-720-badge">${overallPct}% SYLLABUS</span>
        </div>

        <div style="font-size:13px; color:var(--text-muted); display:flex; justify-content:space-between;">
          <span>Syllabus Done: <strong>${doneCount}/${totalCount}</strong></span>
          <span>Unresolved Errors: <strong style="color:${unresolvedMistakes > 0 ? 'var(--brand-red)' : 'var(--brand-emerald)'};">${unresolvedMistakes}</strong></span>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width:${overallPct}%;"></div>
        </div>

        <div style="margin-top:8px; font-size:12px; color:var(--text-dim); text-align:center;">
          Targeting Rank 1 · Top Medical Colleges in India
        </div>
      </div>
    </section>

    <!-- Subject Cards -->
    <div class="grid grid-4" style="margin-bottom:20px;">
      <div class="card card-stat phy" style="cursor:pointer;" onclick="navigateView('syllabus')">
        <span class="tag phy">PHYSICS (180 MARKS)</span>
        <div class="stat-val" style="margin:10px 0 4px;">${phy.pct}%</div>
        <small class="muted">${phy.count}/${phy.total} Chapters · ${phy.hours}h Target</small>
        <div class="progress-bar-container"><div class="progress-bar-fill phy" style="width:${phy.pct}%;"></div></div>
      </div>

      <div class="card card-stat chem" style="cursor:pointer;" onclick="navigateView('syllabus')">
        <span class="tag chem">CHEMISTRY (180 MARKS)</span>
        <div class="stat-val" style="margin:10px 0 4px;">${chem.pct}%</div>
        <small class="muted">${chem.count}/${chem.total} Chapters · ${chem.hours}h Target</small>
        <div class="progress-bar-container"><div class="progress-bar-fill chem" style="width:${chem.pct}%;"></div></div>
      </div>

      <div class="card card-stat bot" style="cursor:pointer;" onclick="navigateView('syllabus')">
        <span class="tag bot">BOTANY (180 MARKS)</span>
        <div class="stat-val" style="margin:10px 0 4px;">${bot.pct}%</div>
        <small class="muted">${bot.count}/${bot.total} Chapters · ${bot.hours}h Target</small>
        <div class="progress-bar-container"><div class="progress-bar-fill bot" style="width:${bot.pct}%;"></div></div>
      </div>

      <div class="card card-stat zoo" style="cursor:pointer;" onclick="navigateView('syllabus')">
        <span class="tag zoo">ZOOLOGY (180 MARKS)</span>
        <div class="stat-val" style="margin:10px 0 4px;">${zoo.pct}%</div>
        <small class="muted">${zoo.count}/${zoo.total} Chapters · ${zoo.hours}h Target</small>
        <div class="progress-bar-container"><div class="progress-bar-fill zoo" style="width:${zoo.pct}%;"></div></div>
      </div>
    </div>

    <!-- 100% Pure NCERT & Zero Waste Protocol Badge -->
    <div class="card" style="margin-bottom:24px; border-left:4px solid var(--brand-emerald); background:rgba(16, 185, 129, 0.05);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:24px;">🛡️</span>
          <div>
            <strong style="color:var(--brand-emerald); font-size:15px;">100% Pure NCERT Bound (NMC Rationalized 2024-2028 Protocol)</strong>
            <p class="muted" style="font-size:12px; margin-top:2px;">
              🚫 0% Out-of-Syllabus BSc Content · 🚫 0% Social Distraction / Chats · 🚫 0% JEE Advanced Overkill Derivations.
            </p>
          </div>
        </div>
        <button class="btn ghost" style="padding:6px 12px; font-size:12px;" onclick="window.notesFilter = 'All'; navigateView('notes');">Read Waste Elimination Guide →</button>
      </div>
    </div>

    <!-- Two Column Grid: Focus Timer & Spaced Revision -->
    <div class="grid grid-2">
      <!-- Focus Timer & Deep Work Custom Engine -->
      <div class="card focus-timer-card">
        <div class="section-head" style="margin-bottom:12px;">
          <div>
            <span class="eyebrow">HIGH-PERFORMANCE DEEP WORK</span>
            <h3>Custom Focus Mode Timer</h3>
          </div>
          <span class="tag gold"><i class="fas fa-bullseye"></i> Target: 10-12 hrs/day</span>
        </div>

        <div class="focus-timer-box">
          <!-- Live Timer Display -->
          <div id="pomoTimeDisplay" class="focus-time-digits">
            ${String(PomodoroTimer.durationMinutes).padStart(2, '0')}:00
          </div>

          <!-- Animated Progress Bar -->
          <div class="focus-progress-track">
            <div id="pomoProgressBar" class="focus-progress-fill" style="width: 0%;"></div>
          </div>

          <!-- Preset Duration Chips -->
          <div class="focus-preset-chips">
            <button type="button" class="timer-preset-chip ${PomodoroTimer.durationMinutes === 15 ? 'active-preset' : ''}" data-minutes="15" onclick="PomodoroTimer.setDuration(15)">15m</button>
            <button type="button" class="timer-preset-chip ${PomodoroTimer.durationMinutes === 25 ? 'active-preset' : ''}" data-minutes="25" onclick="PomodoroTimer.setDuration(25)">25m (Pomo)</button>
            <button type="button" class="timer-preset-chip ${PomodoroTimer.durationMinutes === 45 ? 'active-preset' : ''}" data-minutes="45" onclick="PomodoroTimer.setDuration(45)">45m</button>
            <button type="button" class="timer-preset-chip ${PomodoroTimer.durationMinutes === 60 ? 'active-preset' : ''}" data-minutes="60" onclick="PomodoroTimer.setDuration(60)">60m (1h)</button>
            <button type="button" class="timer-preset-chip ${PomodoroTimer.durationMinutes === 90 ? 'active-preset' : ''}" data-minutes="90" onclick="PomodoroTimer.setDuration(90)">90m</button>
            <button type="button" class="timer-preset-chip ${PomodoroTimer.durationMinutes === 120 ? 'active-preset' : ''}" data-minutes="120" onclick="PomodoroTimer.setDuration(120)">120m (2h)</button>
            <button type="button" class="timer-preset-chip ${PomodoroTimer.durationMinutes === 180 ? 'active-preset' : ''}" data-minutes="180" onclick="PomodoroTimer.setDuration(180)">180m (NEET Mock)</button>
          </div>

          <!-- Custom Minutes Input Row -->
          <div class="focus-custom-row">
            <label class="custom-min-label">
              <span>⏱️ Custom Minutes:</span>
              <input 
                type="number" 
                id="pomoCustomInput" 
                min="1" 
                max="360" 
                value="${PomodoroTimer.durationMinutes}" 
                class="custom-min-input"
                placeholder="Minutes"
                onchange="PomodoroTimer.setDuration(this.value)"
              >
            </label>
            <button class="btn ghost btn-sm" onclick="PomodoroTimer.setDuration(document.getElementById('pomoCustomInput').value)">Set Time</button>
          </div>

          <!-- Chapter Tagging -->
          <div style="margin: 10px 0 14px; width: 100%; max-width: 100%; box-sizing: border-box;">
            <select class="search-input" style="font-size:12px; padding:6px 10px; width:100%; max-width:100%; box-sizing:border-box; text-overflow:ellipsis; overflow:hidden;" onchange="PomodoroTimer.setChapter(this.value)">
              <option value="">🎯 General NCERT Study (No Chapter Tag)</option>
              ${allCh.map(c => `
                <option value="${c.id}" ${c.id === (nextChapter ? nextChapter.id : '') ? 'selected' : ''}>
                  ${c.subject}: ${escapeHtml(c.title)}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Primary Control Buttons -->
          <div class="focus-controls">
            <button id="pomoStartBtn" class="btn btn-primary" style="flex:1;" onclick="PomodoroTimer.isRunning ? PomodoroTimer.pause() : PomodoroTimer.start('${nextChapter ? nextChapter.id : ''}')">
              ${PomodoroTimer.isRunning ? '⏸ Pause' : '▶ Start Focus'}
            </button>
            <button class="btn ghost" onclick="PomodoroTimer.reset()">↺ Reset</button>
          </div>
        </div>

        ${nextChapter ? `
          <div class="item" style="cursor:pointer; margin-top:12px;" onclick="openChapterModal('${nextChapter.id}')">
            <div class="grow">
              <span class="eyebrow">RECOMMENDED NEXT CHAPTER</span>
              <strong>${escapeHtml(nextChapter.title)}</strong>
              <small>${escapeHtml(nextChapter.subject)} · ${nextChapter.hours} Focused Hours</small>
            </div>
            <button onclick="event.stopPropagation(); openChapterModal('${nextChapter.id}')">Open →</button>
          </div>
        ` : `
          <div class="callout" style="margin-top:12px;">🎉 Remarkable! You have completed all core syllabus chapters! Focus on Full Mock Tests & Mistake Revisions.</div>
        `}
      </div>

      <!-- Spaced Repetition Queue -->
      <div class="card">
        <div class="section-head" style="margin-bottom:14px;">
          <div>
            <span class="eyebrow">ACTIVE RECALL LOOP</span>
            <h3>Due for Revision Today</h3>
          </div>
          <span class="tag">${dueRevisions.length} DUE</span>
        </div>

        <p class="muted" style="font-size:13px; margin-bottom:14px;">
          Every completed chapter returns in 1, 3, 7, 14, and 30 days to guarantee long-term retention.
        </p>

        <div class="list" style="max-height:280px; overflow-y:auto; padding-right:4px;">
          ${dueRevisions.length ? dueRevisions.slice(0, 5).map(ch => `
            <div class="item" style="padding:10px 14px;">
              <div class="grow">
                <strong>${escapeHtml(ch.title)}</strong>
                <small>${escapeHtml(ch.subject)}</small>
              </div>
              <div style="display:flex; gap:4px;">
                <button class="ghost" style="padding:4px 8px; font-size:11px;" onclick="scheduleRevision('${ch.id}', 1)">+1d</button>
                <button class="ghost" style="padding:4px 8px; font-size:11px;" onclick="scheduleRevision('${ch.id}', 7)">+7d</button>
                <button class="ghost" style="padding:4px 8px; font-size:11px;" onclick="scheduleRevision('${ch.id}', 30)">+30d</button>
              </div>
            </div>
          `).join('') : `
            <p class="muted" style="text-align:center; padding:30px 0;">No revisions due right now! Complete more topics in Syllabus to start the retention loop.</p>
          `}
        </div>
      </div>
    </div>
  `;
}

function renderSyllabusView() {
  const filterSubject = window.syllabusFilter || 'all';
  const searchTerm = (window.syllabusSearch || '').toLowerCase();

  let phases = NEET_SYLLABUS;
  if (filterSubject !== 'all') {
    phases = phases.filter(p => p.subjectCode === filterSubject);
  }

  return `
    <div class="section-head">
      <div>
        <span class="eyebrow">NMC / NTA OFFICIAL MASTER CURRICULUM</span>
        <h2>NEET UG 2028 Full Syllabus (96+ Units)</h2>
      </div>
      <span class="tag gold">100% COMPLETE ZERO-GAP</span>
    </div>

    <div class="filter-bar">
      <input 
        type="text" 
        class="search-input" 
        placeholder="Search chapter, keyword (e.g. Optics, Genetics, Amines, Photosynthesis)..." 
        value="${escapeHtml(window.syllabusSearch || '')}"
        oninput="window.syllabusSearch = this.value; renderApp();"
      >
      <button class="filter-btn ${filterSubject === 'all' ? 'active' : ''}" onclick="window.syllabusFilter = 'all'; renderApp();">All Subjects</button>
      <button class="filter-btn ${filterSubject === 'phy' ? 'active' : ''}" onclick="window.syllabusFilter = 'phy'; renderApp();">Physics</button>
      <button class="filter-btn ${filterSubject === 'chem' ? 'active' : ''}" onclick="window.syllabusFilter = 'chem'; renderApp();">Chemistry</button>
      <button class="filter-btn ${filterSubject === 'bot' ? 'active' : ''}" onclick="window.syllabusFilter = 'bot'; renderApp();">Botany</button>
      <button class="filter-btn ${filterSubject === 'zoo' ? 'active' : ''}" onclick="window.syllabusFilter = 'zoo'; renderApp();">Zoology</button>
    </div>

    <div>
      ${phases.map(phase => {
        let chapters = phase.chapters;
        if (searchTerm) {
          chapters = chapters.filter(c => 
            c.title.toLowerCase().includes(searchTerm) || 
            c.subtopics.toLowerCase().includes(searchTerm) ||
            c.keyConcepts.some(k => k.toLowerCase().includes(searchTerm))
          );
        }
        if (!chapters.length) return '';

        const phaseDone = chapters.filter(c => appState.progress[c.id]).length;

        return `
          <section style="margin-bottom:32px;">
            <div class="section-head" style="margin-bottom:12px; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
              <div>
                <span class="eyebrow">${escapeHtml(phase.standard)}</span>
                <h3>${escapeHtml(phase.phase)}</h3>
              </div>
              <span class="tag ${phase.subjectCode}">${phaseDone}/${chapters.length} DONE</span>
            </div>

            <div class="list">
              ${chapters.map(ch => {
                const isDone = !!appState.progress[ch.id];
                return `
                  <div class="item ${isDone ? 'completed' : ''}" style="cursor:pointer;" onclick="openChapterModal('${ch.id}')">
                    <input 
                      type="checkbox" 
                      ${isDone ? 'checked' : ''} 
                      onclick="event.stopPropagation(); toggleChapterComplete('${ch.id}');"
                    >
                    <div class="grow">
                      <strong>${escapeHtml(ch.title)}</strong>
                      <small>${escapeHtml(ch.subtopics)}</small>
                      <small style="margin-top:4px; color:var(--text-dim);">
                        Weightage: ${ch.weightage} · ~${ch.hours} hrs · ${ch.ncertClass}
                      </small>
                    </div>
                    <span class="tag ${phase.subjectCode}">${ch.hours}h</span>
                    <button class="ghost" onclick="event.stopPropagation(); openChapterModal('${ch.id}');">Study →</button>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        `;
      }).join('')}
    </div>
  `;
}

function renderNotesView() {
  const filterSubject = window.notesFilter || 'All';
  const notes = getNotesBySubject(filterSubject);

  return `
    <div class="section-head">
      <div>
        <span class="eyebrow">NCERT HIGH-YIELD VAULT</span>
        <h2>Master Formulas, Reactions & NCERT Lines</h2>
      </div>
      <span class="tag gold">REVISION SHEETS</span>
    </div>

    <div class="filter-bar">
      <button class="filter-btn ${filterSubject === 'All' ? 'active' : ''}" onclick="window.notesFilter = 'All'; renderApp();">All Notes</button>
      <button class="filter-btn ${filterSubject === 'Physics' ? 'active' : ''}" onclick="window.notesFilter = 'Physics'; renderApp();">Physics Formulas</button>
      <button class="filter-btn ${filterSubject === 'Chemistry' ? 'active' : ''}" onclick="window.notesFilter = 'Chemistry'; renderApp();">Chemistry Roadmaps & Exceptions</button>
      <button class="filter-btn ${filterSubject === 'Biology' ? 'active' : ''}" onclick="window.notesFilter = 'Biology'; renderApp();">Biology NCERT Lines</button>
    </div>

    <div class="grid grid-2">
      ${notes.map(note => `
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span class="tag ${note.subject === 'Physics' ? 'phy' : note.subject === 'Chemistry' ? 'chem' : 'bot'}">${note.subject}</span>
              <span class="tag gold">${note.category}</span>
            </div>
            <h3 style="margin-bottom:8px;">${escapeHtml(note.title)}</h3>
            <p class="muted" style="font-size:13px; margin-bottom:14px;">${escapeHtml(note.summary)}</p>
          </div>
          <button onclick="openNoteModal('${note.id}')">Read Full Sheet →</button>
        </div>
      `).join('')}
    </div>
  `;
}

function openNoteModal(noteId) {
  if (!isAuthActive()) {
    if (typeof ClerkAuth !== 'undefined' && typeof ClerkAuth.openSignIn === 'function') {
      ClerkAuth.openSignIn();
    }
    return;
  }
  const note = NEET_NOTES.find(n => n.id === noteId);
  if (!note) return;

  const modalBody = document.getElementById('modalBody');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <span class="eyebrow">${escapeHtml(note.subject.toUpperCase())} · ${escapeHtml(note.category.toUpperCase())}</span>
    <h2 style="margin:8px 0 16px;">${escapeHtml(note.title)}</h2>
    <div style="line-height:1.7; font-size:14px; max-height:480px; overflow-y:auto; padding-right:10px;">
      ${formatMarkdownText(note.content)}
    </div>
    <div style="display:flex; justify-content:flex-end; margin-top:20px;">
      <button onclick="document.getElementById('modal').close()">Close Note</button>
    </div>
  `;

  const modal = document.getElementById('modal');
  if (modal) modal.showModal();
}
window.openNoteModal = openNoteModal;

function formatMarkdownText(text) {
  return text
    .replace(/^### (.*$)/gim, '<h3 style="margin:16px 0 8px; color:var(--brand-emerald);">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="margin:20px 0 10px; color:var(--text-main);">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:var(--bg-secondary); padding:2px 6px; border-radius:4px; font-family:monospace;">$1</code>')
    .replace(/\n\n/g, '<br><br>');
}

// Flashcard Interactive State
window.activeFlashcardIndex = 0;
window.flashcardFlipped = false;

function renderFlashcardsView() {
  const filterSubject = window.fcFilter || 'All';
  const cards = getFlashcardsBySubject(filterSubject);
  const currentCard = cards[window.activeFlashcardIndex % cards.length];

  return `
    <div class="section-head">
      <div>
        <span class="eyebrow">ACTIVE RECALL ENGINE</span>
        <h2>High-Yield NEET Flashcards (Anki-Style)</h2>
      </div>
      <span class="tag gold">${cards.length} CARDS</span>
    </div>

    <div class="filter-bar">
      <button class="filter-btn ${filterSubject === 'All' ? 'active' : ''}" onclick="window.fcFilter = 'All'; window.activeFlashcardIndex = 0; renderApp();">All Subjects</button>
      <button class="filter-btn ${filterSubject === 'Biology' ? 'active' : ''}" onclick="window.fcFilter = 'Biology'; window.activeFlashcardIndex = 0; renderApp();">Biology NCERT</button>
      <button class="filter-btn ${filterSubject === 'Chemistry' ? 'active' : ''}" onclick="window.fcFilter = 'Chemistry'; window.activeFlashcardIndex = 0; renderApp();">Chemistry</button>
      <button class="filter-btn ${filterSubject === 'Physics' ? 'active' : ''}" onclick="window.fcFilter = 'Physics'; window.activeFlashcardIndex = 0; renderApp();">Physics</button>
    </div>

    <div class="flashcard-stage">
      <div class="flashcard" onclick="window.flashcardFlipped = !window.flashcardFlipped; renderApp();">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="tag ${currentCard.subject === 'Biology' ? 'bot' : currentCard.subject === 'Chemistry' ? 'chem' : 'phy'}">${currentCard.subject} · ${currentCard.category}</span>
          <span class="muted" style="font-size:12px;">Card ${window.activeFlashcardIndex + 1} of ${cards.length} · Tap to Flip</span>
        </div>

        <div class="flashcard-content">
          ${window.flashcardFlipped ? `
            <div style="color:var(--brand-emerald); font-weight:700;">
              ${escapeHtml(currentCard.back).replace(/\n/g, '<br>')}
            </div>
            <div class="ncert-highlight" style="font-size:12px; margin-top:16px;">
              📖 ${escapeHtml(currentCard.reference)}
            </div>
          ` : `
            <div>
              ${escapeHtml(currentCard.front)}
            </div>
          `}
        </div>

        <div class="flashcard-footer">
          <span>${window.flashcardFlipped ? 'Answer Revealed' : 'Question (Recall before flipping)'}</span>
          <span style="font-weight:700; color:var(--brand-gold);">↻ Flip Card</span>
        </div>
      </div>

      <div class="flashcard-actions">
        <button class="btn-danger" onclick="rateFlashcard('${currentCard.id}', 1)">Again (1d)</button>
        <button class="ghost" onclick="rateFlashcard('${currentCard.id}', 3)">Hard (3d)</button>
        <button onclick="rateFlashcard('${currentCard.id}', 7)">Good (7d)</button>
        <button class="btn-gold" onclick="rateFlashcard('${currentCard.id}', 30)">Easy (30d)</button>
      </div>
    </div>
  `;
}

function rateFlashcard(cardId, days) {
  appState.flashcardReviews[cardId] = {
    intervalDays: days,
    nextDue: new Date(Date.now() + days * 864e5).toISOString(),
    count: ((appState.flashcardReviews[cardId] || {}).count || 0) + 1
  };
  saveState();
  window.flashcardFlipped = false;
  window.activeFlashcardIndex++;
  renderApp();
}
window.rateFlashcard = rateFlashcard;

function renderLibraryView() {
  const filterSubject = window.libraryFilter || 'All';
  const filterCategory = window.libraryCategoryFilter || 'All';
  const searchQuery = (window.librarySearchQuery || '').trim().toLowerCase();

  let resources = getResourcesBySubject(filterSubject, filterCategory);

  if (searchQuery) {
    resources = resources.filter(r => 
      r.title.toLowerCase().includes(searchQuery) ||
      (r.description && r.description.toLowerCase().includes(searchQuery)) ||
      (r.provider && r.provider.toLowerCase().includes(searchQuery)) ||
      (r.tags && r.tags.some(t => t.toLowerCase().includes(searchQuery)))
    );
  }

  const formatCategories = [
    { id: 'All', label: 'All Resources' },
    { id: 'Full Lectures', label: '🎥 Full Lectures' },
    { id: 'One-Shots', label: '⚡ One-Shots' },
    { id: 'Official Govt Portals', label: '🏛️ Govt Portals' },
    { id: 'Interactive 3D/Simulations', label: '🧪 3D & Labs' },
    { id: 'Official NCERT', label: '📚 NCERT Official' },
    { id: 'PYQ Video Solutions', label: '🎯 PYQ Solutions' }
  ];

  return `
    <div class="section-head">
      <div>
        <span class="eyebrow">CURATED ZERO-GAP MEDICAL VAULT</span>
        <h2>NCERT Videos, One-Shots & Free Academic Portals</h2>
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        <span class="tag gold"><i class="fas fa-shield-alt"></i> 100% PURE NCERT · NO FLUFF</span>
      </div>
    </div>

    <!-- Educational Guarantee Callout -->
    <div class="callout" style="border-left-color:var(--brand-emerald); background:rgba(13, 148, 136, 0.08); margin-bottom:20px;">
      <strong>🎯 NEET 2028 Zero-Distraction Principle:</strong> Every resource listed below is strictly bound to the NMC NEET Syllabus. No out-of-syllabus BSc botany, no time-wasting fluff, and no distracting feeds. Pure concept clarity, line-by-line NCERT decoding, and high-yield numerical problem solving.
    </div>

    <!-- Search & Filter Controls -->
    <div class="card" style="padding:16px; margin-bottom:24px;">
      <div style="margin-bottom:14px;">
        <input 
          type="search" 
          placeholder="🔍 Search videos by faculty (Alakh Pandey, Tarun Sir, Pankaj Sir), portal, or concept..." 
          value="${escapeHtml(window.librarySearchQuery || '')}"
          oninput="window.librarySearchQuery = this.value; renderApp();"
          style="width:100%; padding:12px 16px; border-radius:10px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-main); font-family:inherit; font-size:14px;"
        >
      </div>

      <!-- Subject Filters -->
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px; align-items:center;">
        <span style="font-size:12px; font-weight:700; color:var(--text-muted); min-width:65px;">SUBJECT:</span>
        <button class="filter-btn ${filterSubject === 'All' ? 'active' : ''}" onclick="window.libraryFilter = 'All'; renderApp();">All Subjects</button>
        <button class="filter-btn ${filterSubject === 'Physics' ? 'active' : ''}" onclick="window.libraryFilter = 'Physics'; renderApp();">⚡ Physics</button>
        <button class="filter-btn ${filterSubject === 'Chemistry' ? 'active' : ''}" onclick="window.libraryFilter = 'Chemistry'; renderApp();">🧪 Chemistry</button>
        <button class="filter-btn ${filterSubject === 'Botany' ? 'active' : ''}" onclick="window.libraryFilter = 'Botany'; renderApp();">🌿 Botany</button>
        <button class="filter-btn ${filterSubject === 'Zoology' ? 'active' : ''}" onclick="window.libraryFilter = 'Zoology'; renderApp();">🦁 Zoology</button>
      </div>

      <!-- Format Categories -->
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <span style="font-size:12px; font-weight:700; color:var(--text-muted); min-width:65px;">FORMAT:</span>
        ${formatCategories.map(cat => `
          <button class="filter-btn ${filterCategory === cat.id ? 'active' : ''}" style="font-size:12px; padding:5px 12px;" onclick="window.libraryCategoryFilter = '${cat.id}'; renderApp();">
            ${cat.label}
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Resource Results Grid -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
      <span style="font-size:13px; color:var(--text-muted);">Found <strong>${resources.length}</strong> verified free resources</span>
      ${searchQuery || filterSubject !== 'All' || filterCategory !== 'All' ? `
        <button class="ghost" style="font-size:11px; padding:4px 10px;" onclick="window.libraryFilter='All'; window.libraryCategoryFilter='All'; window.librarySearchQuery=''; renderApp();">
          Reset Filters ✕
        </button>
      ` : ''}
    </div>

    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap:16px;">
      ${resources.length === 0 ? `
        <div class="card" style="grid-column: 1 / -1; text-align:center; padding:40px 20px;">
          <p class="muted">No resources matched your search "${escapeHtml(searchQuery)}".</p>
          <button class="btn ghost" style="margin-top:10px;" onclick="window.libraryFilter='All'; window.libraryCategoryFilter='All'; window.librarySearchQuery=''; renderApp();">Show All Resources</button>
        </div>
      ` : resources.map(res => {
        const isGovt = res.category === 'Official Govt Portals' || res.isExternalPortal;
        const isVideo = res.category === 'Full Lectures' || res.category === 'One-Shots' || res.category === 'PYQ Video Solutions';
        const isSim = res.category === 'Interactive 3D/Simulations';

        return `
          <article class="card" style="display:flex; flex-direction:column; justify-content:space-between; padding:20px; transition: transform 0.2s ease, border-color 0.2s ease;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:10px;">
                <span class="tag ${isGovt ? 'gold' : isSim ? 'phy' : isVideo ? 'bot' : 'chem'}" style="font-size:11px; font-weight:700;">
                  ${res.category || res.type}
                </span>
                <span style="font-size:11px; color:var(--text-muted); font-weight:600;">
                  ⏱️ ~${res.hours}h Study
                </span>
              </div>

              <h3 style="font-size:16px; font-weight:700; line-height:1.4; margin-bottom:8px;">
                <a href="${escapeHtml(res.url)}" target="_blank" rel="noopener" style="color:var(--text-main); text-decoration:none;">
                  ${escapeHtml(res.title)}
                </a>
              </h3>

              <div style="color:var(--brand-emerald); font-size:12px; font-weight:600; margin-bottom:8px;">
                ⭐ ${escapeHtml(res.provider || res.type)}
              </div>

              <p style="font-size:13px; color:var(--text-muted); line-height:1.5; margin-bottom:12px;">
                ${escapeHtml(res.description || res.priority)}
              </p>

              <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:16px;">
                <span class="tag ${res.subject === 'Physics' ? 'phy' : res.subject === 'Chemistry' ? 'chem' : res.subject === 'Botany' ? 'bot' : res.subject === 'Zoology' ? 'zoo' : ''}">
                  ${res.subject}
                </span>
                ${(res.tags || []).slice(0, 3).map(t => `<span class="tag" style="font-size:11px;">#${escapeHtml(t)}</span>`).join('')}
              </div>
            </div>

            <div style="border-top:1px solid var(--border-color); padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:11px; color:var(--text-muted);">
                ${res.isExternalPortal ? '🏛️ Official Portal' : '▶ Free High-Yield'}
              </span>
              <a href="${escapeHtml(res.url)}" target="_blank" rel="noopener" class="btn ${isGovt ? 'btn-gold' : 'btn-primary'}" style="font-size:12px; padding:8px 16px; text-decoration:none;">
                ${isGovt ? 'Launch Portal ↗' : isSim ? 'Open 3D Lab ↗' : 'Open Video Course ↗'}
              </a>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

function renderRapidFireView() {
  setTimeout(() => {
    if (window.rapidFireEngine && !window.rapidFireEngine.isActive) {
      window.rapidFireEngine.start();
    }
  }, 50);

  return `
    <div class="section-head">
      <div>
        <span class="eyebrow">HIGH-SPEED ACTIVE RECALL ENGINE</span>
        <h2>60-Second Physics & Physical Chemistry Rapid-Fire</h2>
      </div>
      <span class="tag gold"><i class="fas fa-bolt"></i> 180/180 FORMULA SPEED DRILL</span>
    </div>

    <div class="callout">
      <strong>Topper Reflex Protocol:</strong> NEET Physics requires solving 45 questions in 45-50 minutes. You have 60 seconds to identify as many correct formulas and laws as possible. Build combo streaks for 2x and 3x multipliers!
    </div>

    <div id="rapid-fire-container">
      <div style="text-align:center; padding:40px 0;">
        <button class="btn btn-primary" onclick="window.rapidFireEngine.start()">⚡ Start 60s Rapid-Fire Drill</button>
      </div>
    </div>
  `;
}

function renderScientistsView() {
  const scientists = typeof NCERT_SCIENTISTS !== 'undefined' ? NCERT_SCIENTISTS : [];
  const diagrams = typeof NCERT_DIAGRAM_TRAPS !== 'undefined' ? NCERT_DIAGRAM_TRAPS : [];

  return `
    <div class="section-head">
      <div>
        <span class="eyebrow">NCERT FIRST-PAGE BIOGRAPHIES & DIAGRAM LAB</span>
        <h2>NCERT Scientists, Discoveries & Diagram Traps</h2>
      </div>
      <span class="tag gold">100% NTA DIRECT MARKS</span>
    </div>

    <div class="callout warning">
      <strong>Clinical Professor Note:</strong> Every year NTA asks 2-4 questions directly from the introductory scientist pages and diagram labelings in NCERT Biology. Never skip these high-yield milestones!
    </div>

    <h3 style="font-size:20px; margin:24px 0 16px;"><i class="fas fa-user-md"></i> Core NCERT Unit Scientists & Nobel Discoveries</h3>
    <div class="scientist-grid">
      ${scientists.map(s => `
        <div class="scientist-card">
          <div class="scientist-header">
            <span class="scientist-unit">${escapeHtml(s.ncertUnit)}</span>
            <h4 class="scientist-name">${escapeHtml(s.name)}</h4>
            <div class="scientist-title">${escapeHtml(s.title)}</div>
          </div>
          <ul class="scientist-highlights">
            ${s.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
          </ul>
          ${s.trapQuestions ? `
            <div class="trap-card">
              <strong>🎯 NCERT Exam Trap:</strong><br>
              <div style="margin-top:4px;"><b>Q:</b> ${escapeHtml(s.trapQuestions[0].q)}</div>
              <div style="color:var(--brand-teal); font-weight:700; margin-top:2px;"><b>Ans:</b> ${escapeHtml(s.trapQuestions[0].ans)}</div>
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>

    <h3 style="font-size:20px; margin:36px 0 16px;"><i class="fas fa-microscope"></i> High-Yield NCERT Diagram Labeling Traps</h3>
    <div class="grid grid-2">
      ${diagrams.map(d => `
        <div class="diagram-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div>
              <span class="tag ${d.subject === 'Botany' ? 'bot' : 'zoo'}">${d.subject}</span>
              <h4 style="font-size:16px; font-weight:700; margin-top:6px;">${escapeHtml(d.title)}</h4>
            </div>
            <span class="tag" style="font-size:11px;">${escapeHtml(d.ncertRef)}</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px; margin:14px 0;">
            ${d.criticalLabels.map(l => `
              <div style="display:flex; justify-content:space-between; padding:8px 12px; background:var(--bg-secondary); border-radius:8px; font-size:13px;">
                <strong style="color:var(--brand-teal);">${escapeHtml(l.label)}</strong>
                <span style="color:var(--text-muted);">${escapeHtml(l.location)}</span>
              </div>
            `).join('')}
          </div>

          <div class="diagram-topper-tip">
            <i class="fas fa-lightbulb"></i> <b>Topper NCERT Shortcut:</b> ${escapeHtml(d.topperTip)}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTestsView() {
  const history = (appState.testHistory || []).slice(-10).reverse();
  const treeStats = typeof TestTreeEngine !== 'undefined' ? TestTreeEngine.getTreeStats() : {
    topicDone: 0, chapterDone: 0, totalChapters: 96, subjectDone: 0, totalSubjects: 12,
    combo2Done: 0, totalCombo2: 9, combo3Done: 0, totalCombo3: 3, grandDone: 0, totalGrandMocks: 10, totalAttempted: 0
  };
  const treeState = typeof TestTreeEngine !== 'undefined' ? TestTreeEngine.getTreeState() : {};

  return `
    <div class="section-head">
      <div>
        <span class="eyebrow">HIERARCHICAL NTA TESTING ENGINE & DIRECTOR EXAM SIMULATION</span>
        <h2>NEET UG 2028: 6-Level Testing Tree & 10 Pre-NEET Grand Mocks</h2>
      </div>
      <span class="tag gold"><i class="fas fa-sitemap"></i> ${treeStats.totalAttempted} TESTS ATTEMPTED</span>
    </div>

    <!-- Tree Overall Progress Banner -->
    <div class="card" style="margin-bottom:24px; padding:20px; border-top:4px solid var(--brand-gold); background:linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(13,148,136,0.05) 100%);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
        <div>
          <h3 style="font-size:18px; margin:0 0 4px;">🌳 Hierarchical Mastery Roadmap (Level 1 → Level 6)</h3>
          <p class="muted" style="font-size:13px; margin:0;">
            Master each topic compulsory test, progress to Chapter Milestones, conquer Multi-Subject Combos, and peak on the 10 Full-Length Pre-NEET Grand Mocks!
          </p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <span class="tag gold" style="font-weight:700;">+4 / -1 NEGATIVE MARKING</span>
          <span class="tag bot" style="font-weight:700;">STRICT NTA TIMERS</span>
        </div>
      </div>

      <!-- 6-Level Progress Grid -->
      <div class="grid grid-3" style="gap:12px;">
        <div class="card" style="padding:12px; background:var(--bg-secondary);">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:4px;">
            <span>L1: Topic Micro-Tests</span>
            <span style="color:var(--brand-teal);">${treeStats.topicDone} Completed</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">5 Qs · 5 Mins compulsory drills</div>
        </div>

        <div class="card" style="padding:12px; background:var(--bg-secondary);">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:4px;">
            <span>L2: Chapter Milestones</span>
            <span style="color:var(--brand-gold);">${treeStats.chapterDone}/${treeStats.totalChapters} Passed</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">15 Qs · 15 Mins full chapter tests</div>
        </div>

        <div class="card" style="padding:12px; background:var(--bg-secondary);">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:4px;">
            <span>L3: Single Subject (12)</span>
            <span style="color:var(--brand-purple);">${treeStats.subjectDone}/${treeStats.totalSubjects} Cleared</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">45 Qs · 45 Mins (3 Phy, 3 Chem, 3 Bot, 3 Zoo)</div>
        </div>

        <div class="card" style="padding:12px; background:var(--bg-secondary);">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:4px;">
            <span>L4: 2-Subject Combos (9)</span>
            <span style="color:var(--brand-emerald);">${treeStats.combo2Done}/${treeStats.totalCombo2} Cleared</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">90 Qs · 90 Mins (P+C, B+Z, P+B)</div>
        </div>

        <div class="card" style="padding:12px; background:var(--bg-secondary);">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:4px;">
            <span>L5: 3-Subject PCB (3)</span>
            <span style="color:#ec4899;">${treeStats.combo3Done}/${treeStats.totalCombo3} Cleared</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">135 Qs · 135 Mins Grand Integration</div>
        </div>

        <div class="card" style="padding:12px; background:var(--bg-secondary);">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:4px;">
            <span>L6: 10 Pre-NEET Mocks</span>
            <span style="color:var(--brand-gold); font-weight:800;">${treeStats.grandDone}/${treeStats.totalGrandMocks} Done</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">720 Marks · 200 Qs · 200 Mins (NTA Pattern)</div>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- LEVEL 6: 10 FULL-LENGTH PRE-NEET GRAND MOCKS (720 MARKS) -->
    <!-- ========================================================= -->
    <div style="margin-bottom:32px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
        <div>
          <span class="eyebrow" style="color:var(--brand-gold);">ULTIMATE NTA SIMULATION · LEVEL 6</span>
          <h3 style="font-size:20px; margin:2px 0 0;">🏆 10 Full-Length Pre-NEET Grand Mocks (720/720)</h3>
        </div>
        <span class="tag gold" style="font-weight:700;">200 QUESTIONS · 200 MINS</span>
      </div>

      <div class="grid grid-2" style="gap:16px;">
        ${(TestTreeEngine.GRAND_MOCKS || []).map(m => {
          const res = treeState.grandMocks && treeState.grandMocks[m.id];
          return `
            <div class="card" style="border-top:3px solid ${res ? (res.passed ? 'var(--brand-emerald)' : 'var(--brand-gold)') : 'var(--border-color)'}; padding:16px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <span class="tag gold" style="font-size:10.5px; font-weight:800;">${m.badge}</span>
                <span class="tag" style="font-size:11px;">${escapeHtml(m.difficulty)}</span>
              </div>
              <h4 style="font-size:15px; font-weight:700; margin:4px 0 6px;">${escapeHtml(m.title)}</h4>
              <p class="muted" style="font-size:12.5px; margin-bottom:12px; line-height:1.4;">
                Full 4-Subject NTA Standard: Physics (50 Qs), Chemistry (50 Qs), Botany (50 Qs), Zoology (50 Qs).
              </p>

              ${res ? `
                <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-secondary); padding:8px 12px; border-radius:8px; margin-bottom:12px; font-size:12px;">
                  <span><b>Score:</b> ${res.score}/${res.maxScore} (${res.percentage}%)</span>
                  <span class="tag ${res.percentage >= 80 ? 'bot' : 'chem'}">${res.passed ? 'Passed' : 'Attempted'}</span>
                </div>
              ` : ''}

              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <span style="font-size:11.5px; color:var(--text-muted); font-weight:600;">⏱️ 200 Minutes · 720 Marks</span>
                <button class="btn btn-gold btn-sm" onclick="TestTreeEngine.launchPreNeetMock(${m.mockNum})">
                  ${res ? '🔄 Re-Attempt' : '⚡ Start Grand Mock →'}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- LEVEL 4 & 5: MULTI-SUBJECT COMBINATION TESTS              -->
    <!-- ========================================================= -->
    <div class="grid grid-2" style="margin-bottom:32px; gap:20px;">
      <!-- Level 5: 3-Subject PCB Combined -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <span class="eyebrow" style="color:#ec4899;">LEVEL 5 · 3-SUBJECT COMBOS</span>
          <span class="tag" style="font-size:11px;">135 Qs · 135 Mins</span>
        </div>
        <h3 style="font-size:17px; margin-bottom:8px;">🧬 PCB Grand Multi-Subject Integration</h3>
        <p class="muted" style="font-size:13px; margin-bottom:14px;">
          Simulate full-day exam stamina with 135 integrated Physics, Chemistry, and Biology questions.
        </p>

        <div style="display:flex; flex-direction:column; gap:8px;">
          ${(TestTreeEngine.COMBO_3_TESTS || []).map(t => {
            const res = treeState.combo3Tests && treeState.combo3Tests[t.id];
            return `
              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-secondary); padding:10px 12px; border-radius:8px; border:1px solid var(--border-color); gap:8px;">
                <div style="min-width:0;">
                  <strong style="font-size:13px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(t.title)}</strong>
                  <small class="muted">${t.questions} Qs · ${res ? `Score: ${res.score}/${res.maxScore}` : 'Not Attempted'}</small>
                </div>
                <button class="btn ghost btn-sm" style="white-space:nowrap;" onclick="TestTreeEngine.launchCombo3Test('${t.id}')">
                  ${res ? 'Re-take' : 'Start Test →'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Level 4: 2-Subject Combined -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <span class="eyebrow" style="color:var(--brand-emerald);">LEVEL 4 · 2-SUBJECT COMBOS</span>
          <span class="tag" style="font-size:11px;">90 Qs · 90 Mins</span>
        </div>
        <h3 style="font-size:17px; margin-bottom:8px;">⚡ 2-Subject Cross Mastery (9 Sets)</h3>
        <p class="muted" style="font-size:13px; margin-bottom:14px;">
          Physics+Chemistry calculation sprint, Botany+Zoology speed drill, and Cross-Subject tests.
        </p>

        <div style="display:flex; flex-direction:column; gap:8px; max-height:260px; overflow-y:auto;">
          ${(TestTreeEngine.COMBO_2_TESTS || []).map(t => {
            const res = treeState.combo2Tests && treeState.combo2Tests[t.id];
            return `
              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-secondary); padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); gap:8px;">
                <div style="min-width:0;">
                  <strong style="font-size:12.5px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(t.title)}</strong>
                  <small class="muted">${t.questions} Qs · ${res ? `Score: ${res.score}/${res.maxScore}` : 'Not Attempted'}</small>
                </div>
                <button class="btn ghost btn-sm" style="white-space:nowrap; font-size:11.5px;" onclick="TestTreeEngine.launchCombo2Test('${t.id}')">
                  ${res ? 'Re-take' : 'Start →'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- LEVEL 3: SINGLE SUBJECT FULL MASTERY (12 TESTS)          -->
    <!-- ========================================================= -->
    <div style="margin-bottom:32px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
        <div>
          <span class="eyebrow" style="color:var(--brand-purple);">LEVEL 3 · SINGLE SUBJECT FULL MASTERY</span>
          <h3 style="font-size:20px; margin:2px 0 0;">📚 12 Full Subject Tests (3 Phy · 3 Chem · 3 Bot · 3 Zoo)</h3>
        </div>
        <span class="tag purple" style="font-weight:700;">45 QUESTIONS · 45 MINS</span>
      </div>

      <div class="grid grid-4" style="gap:12px;">
        ${(TestTreeEngine.SUBJECT_TESTS || []).map(t => {
          const res = treeState.subjectTests && treeState.subjectTests[t.id];
          return `
            <div class="card" style="padding:14px;">
              <span class="tag ${t.subjectCode}" style="font-size:10px; font-weight:700;">${t.subject.toUpperCase()} TEST 0${t.num}</span>
              <h4 style="font-size:13.5px; font-weight:700; margin:6px 0 8px; line-height:1.4;">${escapeHtml(t.title)}</h4>
              <div style="font-size:11.5px; color:var(--text-muted); margin-bottom:10px;">
                45 Qs · 45 Mins ${res ? `· <b>Score: ${res.score}/180</b>` : ''}
              </div>
              <button class="btn ghost btn-sm" style="width:100%; font-size:11.5px;" onclick="TestTreeEngine.launchSubjectTest('${t.id}')">
                ${res ? '🔄 Re-Attempt' : '⚡ Start Test →'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- SPECIALIZED TOPPER DRILL MODES                            -->
    <!-- ========================================================= -->
    <div style="margin-bottom:32px;">
      <h3 style="font-size:18px; margin-bottom:14px;"><i class="fas fa-bolt"></i> Specialized NTA Question Traps & Drills</h3>
      <div class="grid grid-3" style="gap:16px;">
        <div class="card" style="border-top:4px solid #8b5cf6;">
          <span class="tag" style="background:#ede9fe; color:#6d28d9; font-weight:700;">NEW NTA PATTERN</span>
          <h4 style="margin:10px 0 6px;">Assertion-Reason & Statement Drill</h4>
          <p class="muted" style="font-size:13px; margin-bottom:16px;">
            Master Statement I & II and A/R traps from NCERT. Eliminate the #1 source of negative marking in NEET!
          </p>
          <button class="btn-primary" style="width:100%;" onclick="MockTestEngine.initTest('all', 10, 15, 'ar_statements')">
            ⚡ Launch A/R Drill (10 Qs) →
          </button>
        </div>

        <div class="card" style="border-top:4px solid #f59e0b;">
          <span class="tag gold" style="font-weight:700;">10-YEAR PYQ VAULT</span>
          <h4 style="margin:10px 0 6px;">High-Repeat PYQ Sprint</h4>
          <p class="muted" style="font-size:13px; margin-bottom:16px;">
            Target questions repeated 3x to 7x times in NEET 2015-2024. Guaranteed recurring concepts!
          </p>
          <button class="btn-gold" style="width:100%;" onclick="MockTestEngine.initTest('all', 10, 15, 'pyq_sprint')">
            🔥 Launch PYQ Sprint (10 Qs) →
          </button>
        </div>

        <div class="card" style="border-top:4px solid #10b981;">
          <span class="tag" style="background:#dcfce7; color:#15803d; font-weight:700;">OFFLINE EXAM SIMULATION</span>
          <h4 style="margin:10px 0 6px;">Virtual OMR Sheet Mock</h4>
          <p class="muted" style="font-size:13px; margin-bottom:16px;">
            Practice filling round bubbles with realistic pen time tracking to prevent parallax errors.
          </p>
          <button class="btn" style="width:100%; background:var(--brand-emerald); color:#fff;" onclick="MockTestEngine.isOmrMode = true; MockTestEngine.initTest('all', 15, 25, 'standard')">
            📝 Launch OMR Mock (15 Qs) →
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Test History -->
    <div class="card" style="margin-bottom:30px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h3>📊 Recent Test History & Performance Log</h3>
        <span class="tag">${history.length} Recent Records</span>
      </div>
      <div class="list">
        ${history.length ? history.map(h => `
          <div class="item" style="padding:10px 14px;">
            <div class="grow">
              <strong>${escapeHtml(h.title || 'NEET Practice Test')} — ${h.score}/${h.maxScore} marks (${h.percentage}%)</strong>
              <small>${new Date(h.date).toLocaleDateString()} · ${h.correct} Correct · ${h.wrong} Wrong · ${h.unattempted || 0} Skipped</small>
            </div>
            <span class="tag ${h.percentage >= 80 ? 'bot' : h.percentage >= 50 ? 'chem' : 'zoo'}">${h.percentage}%</span>
          </div>
        `).join('') : `
          <p class="muted" style="text-align:center; padding:30px 0;">No tests attempted yet. Start from Level 1 Topic Tests or launch Pre-NEET Grand Mock 01!</p>
        `}
      </div>
    </div>
  `;
}

function renderMistakesView() {
  const filterSubject = window.mistakeFilter || 'All';
  const showResolved = !!window.mistakeShowResolved;

  return `
    <div class="section-head">
      <div>
        <span class="eyebrow">THE 720/720 TOPPER SECRET</span>
        <h2>Mistake Notebook (Error Elimination Log)</h2>
      </div>
      <span class="tag gold">${appState.mistakes.filter(m => !m.resolved).length} UNRESOLVED</span>
    </div>

    <div class="callout warning">
      <strong>Zero-Error Protocol:</strong> Analyze why every question was missed. Fix the conceptual gap in NCERT, label the mistake reason, and mark it resolved only when you can re-solve it with 100% confidence.
    </div>

    <div class="filter-bar">
      <button class="filter-btn ${filterSubject === 'All' ? 'active' : ''}" onclick="window.mistakeFilter = 'All'; renderApp();">All Subjects</button>
      <button class="filter-btn ${filterSubject === 'Physics' ? 'active' : ''}" onclick="window.mistakeFilter = 'Physics'; renderApp();">Physics</button>
      <button class="filter-btn ${filterSubject === 'Chemistry' ? 'active' : ''}" onclick="window.mistakeFilter = 'Chemistry'; renderApp();">Chemistry</button>
      <button class="filter-btn ${filterSubject === 'Botany' ? 'active' : ''}" onclick="window.mistakeFilter = 'Botany'; renderApp();">Botany</button>
      <button class="filter-btn ${filterSubject === 'Zoology' ? 'active' : ''}" onclick="window.mistakeFilter = 'Zoology'; renderApp();">Zoology</button>
      
      <label style="margin-left:auto; display:flex; align-items:center; gap:6px; font-size:13px; color:var(--text-muted); cursor:pointer;">
        <input type="checkbox" ${showResolved ? 'checked' : ''} onchange="window.mistakeShowResolved = this.checked; renderApp();">
        Show Resolved Errors
      </label>
    </div>

    ${MistakeNotebook.renderMistakeList(filterSubject, showResolved)}
  `;
}

function renderCertificateView() {
  const allCh = getAllChapters();
  const done = allCh.filter(c => appState.progress[c.id]).length;
  const pct = allCh.length ? Math.round((done / allCh.length) * 100) : 0;
  const isComplete = pct === 100;

  return `
    <div class="section-head">
      <div>
        <span class="eyebrow">DOCTOR'S MILESTONES & WALL OF FAME</span>
        <h2>Mission 2028: AIIMS Doctor Milestone</h2>
      </div>
      <span class="tag gold">${pct}% COMPLETE</span>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3>Doctor Profile & Dream Destination</h3>
        <p class="muted" style="font-size:13px; margin:6px 0 16px;">
          Personalize your goal wall and completion certificate.
        </p>

        <div class="list">
          <label>
            Full Name (Dr. First & Last Name)
            <input 
              type="text" 
              class="search-input" 
              placeholder="e.g. Dr. Aryan Sharma" 
              value="${escapeHtml(appState.doctorName || '')}" 
              oninput="CertificateGenerator.saveDoctorName(this.value);"
            >
          </label>

          <label>
            Target Medical College
            <input 
              type="text" 
              class="search-input" 
              placeholder="e.g. AIIMS New Delhi / MAMC / JIPMER" 
              value="${escapeHtml(appState.targetCollege || 'AIIMS New Delhi')}" 
              oninput="CertificateGenerator.saveTargetCollege(this.value);"
            >
          </label>
        </div>

        <div style="margin-top:20px;">
          <button class="btn-gold" onclick="CertificateGenerator.generatePrintableCertificate()">
            Generate & Print Doctor Certificate 🖨️
          </button>
        </div>
      </div>

      <div class="card">
        <h3>Milestone Unlocks</h3>
        <div class="list" style="margin-top:14px;">
          <div class="item">
            <span class="tag ${pct >= 25 ? 'bot' : ''}">25%</span>
            <div class="grow">
              <strong>Medical Aspirant Rank</strong>
              <small>Foundation Mechanics & Cell Biology Mastered</small>
            </div>
            <span>${pct >= 25 ? '✓ Unlocked' : '🔒 Locked'}</span>
          </div>

          <div class="item">
            <span class="tag ${pct >= 50 ? 'bot' : ''}">50%</span>
            <div class="grow">
              <strong>Clinical Intern Rank</strong>
              <small>Complete Class 11 Syllabus Cleared</small>
            </div>
            <span>${pct >= 50 ? '✓ Unlocked' : '🔒 Locked'}</span>
          </div>

          <div class="item">
            <span class="tag ${pct >= 75 ? 'bot' : ''}">75%</span>
            <div class="grow">
              <strong>Junior Resident Medic</strong>
              <small>Class 12 Electrodynamics & Genetics Dominated</small>
            </div>
            <span>${pct >= 75 ? '✓ Unlocked' : '🔒 Locked'}</span>
          </div>

          <div class="item">
            <span class="tag ${pct >= 100 ? 'gold' : ''}">100%</span>
            <div class="grow">
              <strong>AIIMS 720/720 Doctor Distinction</strong>
              <small>All 96 Units Completed & Mistakes Remedied</small>
            </div>
            <span>${pct >= 100 ? '👑 Conferred' : '🔒 Locked'}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderUpdatesView() {
  return `
    <div class="section-head">
      <div>
        <span class="eyebrow">OFFLINE STORAGE & BACKUP OS</span>
        <h2>Data Management, Backup & Custom Content</h2>
      </div>
      <span class="tag ${navigator.onLine ? 'bot' : 'chem'}">${navigator.onLine ? '● Online Connected' : '○ Offline PWA Mode'}</span>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3>Data Backup & Restore</h3>
        <p class="muted" style="font-size:13px; margin:6px 0 16px;">
          Export your entire learning state, mistake log, and test scores to a JSON file to transfer between phone, laptop, and tablet.
        </p>

        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <button onclick="exportBackupData()">Export Full JSON Backup</button>
          <label class="btn ghost" style="cursor:pointer;">
            Import Backup File
            <input type="file" accept="application/json" style="display:none;" onchange="importBackupData(event)">
          </label>
        </div>
      </div>

      <div class="card">
        <h3>Reset Local Data</h3>
        <p class="muted" style="font-size:13px; margin:6px 0 16px;">
          Permanently clear this device's progress and return to a clean slate. Export a backup first.
        </p>
        <button class="btn-danger" onclick="resetAllData()">Reset Dashboard & Data</button>
      </div>
    </div>
  `;
}

function exportBackupData() {
  const blob = new Blob([JSON.stringify(appState, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `neet-2028-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
window.exportBackupData = exportBackupData;

function importBackupData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data.progress && !data.syllabus) throw Error();
      appState = data;
      saveState();
      alert('NEET 2028 OS data successfully restored!');
      renderApp();
    } catch {
      alert('Invalid backup file. Please select a valid NEET 2028 JSON backup.');
    }
  };
  reader.readAsText(file);
}
window.importBackupData = importBackupData;

function resetAllData() {
  if (confirm('Are you sure you want to reset all NEET 2028 progress? This action cannot be undone.')) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}
window.resetAllData = resetAllData;

// High-Impact AIIMS Medical Entrance Locked Access Screen
function renderLockedGateView() {
  return `
    <div class="locked-gate-container">
      <div class="gate-hero">
        <div class="gate-lock-pill">
          <span class="pulse-red-dot"></span> AIIMS SECURITY GATEWAY · ACCESS LOCKED
        </div>
        
        <h1 class="gate-title">NEET UG 2028 MEDICAL ENTRANCE OS</h1>
        <p class="gate-subtitle">
          Mission 720/720 · AIIMS New Delhi Standard Preparation Platform. All 96 NCERT Chapters, High-Yield Formula Engine, NTA Timed Mock Tests, and AI Mistake Notebook are strictly protected. <strong>Please log in or register your student account to access full study data.</strong>
        </p>

        <div class="gate-cta-box">
          <button class="gate-cta-primary" onclick="ClerkAuth.openSignIn('clerk')">
            🌐 Login with Google / Cloud Sync
          </button>
          <button class="gate-cta-secondary" onclick="ClerkAuth.openSignIn('pin')">
            🩺 Aspirant Passcode Login
          </button>
          <button class="gate-cta-secondary" style="border-color:var(--brand-emerald); color:var(--brand-emerald);" onclick="ClerkAuth.openSignUp()">
            📝 Register New Student ID
          </button>
        </div>
      </div>

      <div class="gate-features-header">
        <h3>🔒 Study Materials & Topper Engines Protected Behind Login</h3>
        <p>Login to immediately unlock all 11 medical entrance modules and personalized analytics</p>
      </div>

      <div class="gate-features-grid">
        <div class="gate-feature-card" style="cursor:pointer;" onclick="ClerkAuth.openSignIn()">
          <div class="lock-icon-corner">🔒 LOCKED</div>
          <div class="gate-feature-icon">📗</div>
          <h4>96 Pure NCERT Chapters</h4>
          <p>Physics (29), Chemistry (30), Botany (19), Zoology (18) complete breakdown with topic-wise weightage and difficulty classification.</p>
        </div>

        <div class="gate-feature-card" style="cursor:pointer;" onclick="ClerkAuth.openSignIn()">
          <div class="lock-icon-corner">🔒 LOCKED</div>
          <div class="gate-feature-icon">⚡</div>
          <h4>High-Yield Notes & Formula Engine</h4>
          <p>Line-by-line NCERT extract summaries, reaction charts, and 60-second Physics/Chemistry formula rapid-fire tester.</p>
        </div>

        <div class="gate-feature-card" style="cursor:pointer;" onclick="ClerkAuth.openSignIn()">
          <div class="lock-icon-corner">🔒 LOCKED</div>
          <div class="gate-feature-icon">🎯</div>
          <h4>NTA Mock Tests & Virtual OMR</h4>
          <p>Section A & B exam format with +4/-1 negative marking, 200-question grand simulations, and instant rank analytics.</p>
        </div>

        <div class="gate-feature-card" style="cursor:pointer;" onclick="ClerkAuth.openSignIn()">
          <div class="lock-icon-corner">🔒 LOCKED</div>
          <div class="gate-feature-icon">⚠️</div>
          <h4>Spaced Revision & Mistake Notebook</h4>
          <p>Automated revision queue, conceptual error tracking, spaced repetition algorithm, and 720 score predictor.</p>
        </div>
      </div>

      <div class="gate-trust-bar">
        <div class="trust-item">
          <span>🛡️</span>
          <div><strong>100% Data Protection</strong> · Isolated Per-Student Cloud Storage</div>
        </div>
        <div class="trust-item">
          <span>☁️</span>
          <div><strong>Multi-Device Sync</strong> · Phone, Tablet & Desktop Auto-Sync</div>
        </div>
        <div class="trust-item">
          <span>🎯</span>
          <div><strong>Target 720/720</strong> · AIIMS New Delhi Medical Entrance Engine</div>
        </div>
      </div>
    </div>
  `;
}
window.renderLockedGateView = renderLockedGateView;

// Main App Render Dispatcher with Strict Auth Guarding
function renderApp() {
  const viewEl = document.getElementById('app') || document.getElementById('view');
  if (!viewEl) return;

  const isAuth = isAuthActive();

  // If user is not logged in, enforce STRICT LOCK GATE: No data or study content rendered
  if (!isAuth) {
    viewEl.innerHTML = renderLockedGateView();
    
    // Update navigation tabs to reflect locked state
    document.querySelectorAll('#tabs button').forEach(b => {
      b.classList.remove('active');
      b.classList.add('is-locked');
    });

    updateCountdownBadge();
    if (typeof ClerkAuth !== 'undefined' && typeof ClerkAuth.renderAuthUI === 'function') {
      ClerkAuth.renderAuthUI();
    }
    return;
  }

  // User is authenticated: unlock all navigation tabs and render requested view
  document.querySelectorAll('#tabs button').forEach(b => {
    b.classList.remove('is-locked');
    b.classList.toggle('active', b.dataset.view === window.currentView);
  });

  const views = {
    home: renderHomeView,
    syllabus: renderSyllabusView,
    notes: renderNotesView,
    rapidfire: renderRapidFireView,
    'rapid-fire': renderRapidFireView,
    scientists: renderScientistsView,
    flashcards: renderFlashcardsView,
    library: renderLibraryView,
    tests: renderTestsView,
    mock: renderTestsView,
    mistakes: renderMistakesView,
    focus: renderUpdatesView,
    updates: renderUpdatesView,
    certificate: renderCertificateView,
    schedule: renderCertificateView
  };

  viewEl.innerHTML = (views[window.currentView] || renderHomeView)();
  updateCountdownBadge();
  if (typeof ClerkAuth !== 'undefined' && typeof ClerkAuth.renderAuthUI === 'function') {
    ClerkAuth.renderAuthUI();
  }
}
window.renderApp = renderApp;

// App Startup Initializer
document.addEventListener('DOMContentLoaded', () => {
  // Theme Setup
  const themeBtn = document.getElementById('themeToggle') || document.getElementById('themeBtn');
  if (themeBtn) {
    if (appState.profile.theme === 'light') document.body.classList.add('light');
    themeBtn.onclick = () => {
      document.body.classList.toggle('light');
      appState.profile.theme = document.body.classList.contains('light') ? 'light' : 'dark';
      saveState();
    };
  }

  // Navigation Click Handler with Strict Auth Interception
  const tabs = document.getElementById('tabs');
  if (tabs) {
    tabs.onclick = e => {
      const btn = e.target.closest('button');
      if (btn && btn.dataset.view) {
        if (!isAuthActive()) {
          if (typeof ClerkAuth !== 'undefined' && typeof ClerkAuth.openSignIn === 'function') {
            ClerkAuth.openSignIn();
          }
          return;
        }
        navigateView(btn.dataset.view);
      }
    };
  }

  // Real-Time Auth State Listener
  window.addEventListener('neet-auth-state-changed', () => {
    renderApp();
  });

  // Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW register warning:', err));
  }

  // Universal Modal Backdrop Click-to-Dismiss
  const modal = document.getElementById('modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        modal.close();
      }
    });
  }

  renderApp();
  updateCountdownBadge();
});
