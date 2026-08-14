/**
 * NEET OS: Master Application Core
 * Unified State Management, Views, Pomodoro Timer & Dual Main/Adv Exam OS
 */

window.NEET_STORAGE_KEY = window.NEET_STORAGE_KEY || 'neet_study_state_v1';

// Seed Initial State
const seedState = {
  profile: {
    targetCollege: 'AIIMS New Delhi',
    dailyTargetHours: 8,
    theme: 'dark',
  },
  aspirantName: 'Future Doctor',
  targetPercentile: 700,
  progress: {},       // { chapterId: boolean }
  revisions: {},      // { chapterId: ISOString nextDue }
  flashcardReviews: {},
  studySessions: [],
  customResources: [],
  testHistory: [],
  mistakes: [],
  notes: {},
  lang: 'bilingual',
  startedAt: new Date().toISOString()
};

// Automatic cleanup of useless old cache/data to prevent UI breakage
function cleanOldCache() {
  const essentialKeys = ['neet_os_state', 'premium_until', 'neet_intent_sign_in', 'clerk-db-jwt', 'clerk-telemetry', window.NEET_STORAGE_KEY, 'neet_active_student_session', 'neet_registered_students_v1'];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !essentialKeys.includes(key) && !key.startsWith('pending_utr_') && !key.startsWith(`${window.NEET_STORAGE_KEY}_`)) {
        // Safe to remove non-essential items
        localStorage.removeItem(key);
      }
    }
  } catch (e) {
    console.error("Cache cleanup failed", e);
  }
}
cleanOldCache();

// Load State from LocalStorage
let loadedState = null;
try {
  loadedState = JSON.parse(localStorage.getItem(window.NEET_STORAGE_KEY));
} catch (e) {
  console.error("Failed to parse appState from localStorage", e);
}
window.appState = window.appState || loadedState || seedState;
var appState = window.appState;
appState.progress = appState.progress || {};
appState.revisions = appState.revisions || {};
appState.flashcardReviews = appState.flashcardReviews || {};
appState.studySessions = appState.studySessions || [];
appState.testHistory = appState.testHistory || [];
appState.mistakes = appState.mistakes || [];
appState.customResources = appState.customResources || [];
appState.profile = appState.profile || seedState.profile;
appState.lang = appState.lang || 'bilingual';

function saveState() {
    const currentUid = (typeof ClerkAuth !== 'undefined' && ClerkAuth.currentUser && ClerkAuth.currentUser.id) 
      ? ClerkAuth.currentUser.id 
      : (window.appState && window.appState.profile && window.appState.profile.id) || 'guest';
    
    if (currentUid && currentUid !== 'guest') {
      localStorage.setItem(`${window.NEET_STORAGE_KEY}_${currentUid}`, JSON.stringify(appState));
      
      // SYNC WITH MONGODB BACKEND
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUid, appState: window.appState })
      }).catch(err => console.warn('Cloud Sync Failed:', err));
    }
    localStorage.setItem(window.NEET_STORAGE_KEY, JSON.stringify(appState));

  if (typeof ClerkAuth !== 'undefined') {
    if (typeof ClerkAuth.syncDatabaseToClerkCloud === 'function') {
      ClerkAuth.syncDatabaseToClerkCloud();
    }
    if (typeof ClerkAuth.syncUserStateToServer === 'function') {
      ClerkAuth.syncUserStateToServer();
    }
  }
}
window.saveState = saveState;

if (typeof window.escapeHtml !== 'function') {
  window.escapeHtml = function escapeHtml(str) {
    return String(str || '').replace(/[&<>'"]/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[c]));
  };
}

// Current View Controller
let currentView = 'home';
window.currentSubjectFilter = 'all';

function setGlobalLanguage(lang) {
  appState.lang = lang;
  window.appLanguage = lang;
  saveState();
  renderApp();
}
window.setGlobalLanguage = setGlobalLanguage;


function toggleAppTheme() {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  appState.profile.theme = isLight ? 'light' : 'dark';
  saveState();
}
window.toggleAppTheme = toggleAppTheme;

function navigateView(viewName) {
  // Login Gate: Only 'home' and 'more' are public without login
  const PUBLIC_VIEWS = ['home', 'more'];
  if (!PUBLIC_VIEWS.includes(viewName)) {
    if (window.ClerkAuth && !window.ClerkAuth.isAuthenticated()) {
      window.ClerkAuth.openSignIn();
      return; // Stop navigation
    }
  }

  currentView = viewName;
  
  // Update desktop tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });

  // Update mobile bottom nav
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
}
window.navigateView = navigateView;

// Drawer Controls
function openMoreToolsDrawer() {
  const drawer = document.getElementById('moreToolsDrawer');
  const backdrop = document.getElementById('moreToolsBackdrop');
  if (drawer && backdrop) {
    drawer.style.display = 'block';
    backdrop.style.display = 'block';
    setTimeout(() => drawer.classList.add('open'), 10);
  }
}
window.openMoreToolsDrawer = openMoreToolsDrawer;

function closeMoreToolsDrawer() {
  const drawer = document.getElementById('moreToolsDrawer');
  const backdrop = document.getElementById('moreToolsBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    setTimeout(() => {
      drawer.style.display = 'none';
      backdrop.style.display = 'none';
    }, 300);
  }
}
window.closeMoreToolsDrawer = closeMoreToolsDrawer;

// Toast Notifications
function showToast(message, duration = 3000) {
  let toastContainer = document.getElementById('appToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'appToastContainer';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
      width: max-content;
      max-width: 90vw;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: rgba(15, 23, 42, 0.95);
    color: #f8fafc;
    border: 1px solid rgba(56, 189, 248, 0.4);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 10px 18px;
    border-radius: 9999px;
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    pointer-events: auto;
  `;
  toast.innerHTML = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
window.showToast = showToast;

// Study Time Tracker
window.studyTrackerPeriod = window.studyTrackerPeriod || 'daily';
window.activeStudySession = window.activeStudySession || {
  isRunning: false,
  timerId: null,
  seconds: 0
};

function getStudyStats() {
  const today = new Date().toISOString().slice(0, 10);
  if (!appState.studyStats) {
    appState.studyStats = {
      todayDate: today,
      todaySeconds: 10800, // Default 3h for visual reward
      dailyGoalSeconds: 28800, // 8 hours goal
      history: {},
      activeStreak: 7,
      lastActiveDate: today
    };
    for (let i = 6; i >= 1; i--) {
      const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
      const hours = [5.5, 6.2, 7.0, 6.8, 7.5, 8.5][6 - i] || 6.0;
      appState.studyStats.history[d] = Math.round(hours * 3600);
    }
    appState.studyStats.history[today] = appState.studyStats.todaySeconds;
  }

  if (appState.studyStats.todayDate !== today) {
    appState.studyStats.history[appState.studyStats.todayDate] = appState.studyStats.todaySeconds;
    appState.studyStats.todayDate = today;
    appState.studyStats.todaySeconds = 0;
    appState.studyStats.history[today] = 0;
  }
  return appState.studyStats;
}

function formatStudySeconds(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}h ${m}m ${s}s`;
}

function toggleStudySession() {
  const session = window.activeStudySession;

    let totalTests = 0;
    let totalAttempted = 0;
    let totalCorrect = 0;
    let avgAccuracy = 0;

    if (window.appState && window.appState.testHistory && window.appState.testHistory.length > 0) {
      totalTests = window.appState.testHistory.length;
      window.appState.testHistory.forEach(t => {
        totalAttempted += (t.correctCount || 0) + (t.wrongCount || 0);
        totalCorrect += (t.correctCount || 0);
      });
      if (totalTests > 0) {
        avgAccuracy = Math.round(window.appState.testHistory.reduce((acc, t) => acc + (t.accuracy || 0), 0) / totalTests);
      }
    }
  
  if (session.isRunning) {
    clearInterval(session.timerId);
    session.isRunning = false;
    showToast(`<i class="ph-fill ph-timer"></i> Study session paused (${formatStudySeconds(session.seconds)} recorded)`);
  } else {
    session.isRunning = true;
    session.timerId = setInterval(() => {
      session.seconds++;
      const stats = getStudyStats();
      stats.todaySeconds++;
      const today = new Date().toISOString().slice(0, 10);
      stats.history[today] = stats.todaySeconds;

      const liveDisplay = document.getElementById('liveStudyTimerDisplay');
      if (liveDisplay) {
        liveDisplay.textContent = formatStudySeconds(stats.todaySeconds);
      }
      if (session.seconds % 15 === 0) {
        saveState();
      }
    }, 1000);
    showToast('<i class="ph-fill ph-rocket"></i> Deep Study session started!');
  }
  saveState();
  renderApp();
}
window.toggleStudySession = toggleStudySession;

// Chapter Toggle Helper
function toggleChapterComplete(chapterId) {
  appState.progress[chapterId] = !appState.progress[chapterId];
  if (appState.progress[chapterId]) {
    appState.revisions[chapterId] = new Date(Date.now() + 864e5).toISOString();
    showToast('<i class="ph-fill ph-check-circle"></i> Chapter marked complete!');
  } else {
    delete appState.revisions[chapterId];
  }
  saveState();
  renderApp();
}
window.toggleChapterComplete = toggleChapterComplete;

// Comprehensive Chapter Details Modal
function openChapterModal(chapterId) {
  const allCh = typeof getAllChapters === 'function' ? getAllChapters() : [];
  const ch = allCh.find(c => c.id === chapterId);
  if (!ch) return;

  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  if (!modal || !modalBody) return;

  const isDone = !!appState.progress[ch.id];
  const isHindi = appState.lang === 'hindi';

  modalBody.innerHTML = `
    <div style="padding: 6px;">
      <!-- Header -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <div>
          <span class="tag-badge ${ch.subjectCode === 'phy' ? 'tag-high' : ch.subjectCode === 'chem' ? 'tag-adv' : ''}">
            ${ch.subject.toUpperCase()} · ${ch.classNum}
          </span>
          <span class="tag-badge" style="background:rgba(245,158,11,0.15); color:var(--brand-gold); border:1px solid rgba(245,158,11,0.3); margin-left:6px;">
            ${ch.difficulty || 'High Yield'}
          </span>
        </div>
        <span style="font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--brand-gold); font-weight:700;">
          <i class="ph-fill ph-timer"></i> ${ch.hours}h · NEET Core: ${ch.neetWeight || '5%'} · AIIMS AIQ: ${ch.aiimsWeight || '6%'}
        </span>
      </div>

      <h2 style="font-size:20px; font-weight:800; margin-bottom:4px; color:var(--text-heading);">
        ${isHindi ? (ch.hindiName || ch.name) : ch.name}
      </h2>
      <div style="font-size:13px; color:var(--text-muted); margin-bottom:16px;">
        ${isHindi && ch.name !== ch.hindiName ? `<span style="color:var(--brand-sky); font-weight:600;">${ch.name}</span> · ` : ''}
        ${ch.phase || 'NEET Core Curriculum'}
      </div>

      <!-- <i class="ph-fill ph-books"></i> KAHA SE PADHE (WHERE TO STUDY FROM) & DIRECT BOOK/PDF/VIDEO LINKS -->
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px; padding:16px; margin-bottom:16px;">
        <h4 style="font-size:13px; font-weight:800; color:var(--brand-sky); text-transform:uppercase; margin:0 0 10px; display:flex; align-items:center; gap:6px;">
          <i class="ph-fill ph-books"></i> ${isHindi ? 'कहाँ से पढ़ना है? (मानक किताबें व डायरेक्ट लिंक्स)' : 'Where to Study From? (Recommended Books & Direct Links)'}
        </h4>
        
        <div style="display:flex; flex-direction:column; gap:10px;">
          <!-- 1. Standard Reference Book -->
          <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:8px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div>
              <div style="font-size:11px; color:var(--brand-gold); font-weight:700;"><i class="ph-fill ph-book-open"></i> Standard Reference Book:</div>
              <div style="font-size:12.5px; color:var(--text-main); font-weight:600;">${ch.primaryBook || 'Dr. H.C. Verma / MS Chouhan / Black Book'}</div>
            </div>
            ${ch.bookId ? `
              <button class="btn ghost btn-sm" onclick="document.getElementById('modal').close(); openBookModal('${ch.bookId}');" style="font-size:11px; color:var(--brand-sky); border-color:rgba(56,189,248,0.4);">
                <i class="ph-fill ph-book-open"></i> Open Book Guide →
              </button>
            ` : ''}
          </div>

          <!-- 2. NCERT Official Textbook PDF Link -->
          <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:8px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div>
              <div style="font-size:11px; color:var(--brand-emerald); font-weight:700;"><i class="ph-fill ph-book-bookmark"></i> Official NCERT Portal & Free PDF:</div>
              <div style="font-size:12px; color:var(--text-muted);">100% Free Official Government Textbook for NEET direct line questions</div>
            </div>
            <a href="${ch.ncertPdfUrl || 'https://ncert.nic.in/textbook.php'}" target="_blank" rel="noopener noreferrer" class="btn ghost btn-sm" style="font-size:11px; color:var(--brand-emerald); border-color:rgba(16,185,129,0.4); text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
              <i class="ph-fill ph-download-simple"></i> Open NCERT PDF ↗
            </a>
          </div>

          <!-- 3. Free Video Masterclass Link -->
          <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:8px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div>
              <div style="font-size:11px; color:var(--brand-rose); font-weight:700;"><i class="ph-fill ph-video-camera"></i> Curated One-Shot & Video Masterclass:</div>
              <div style="font-size:12px; color:var(--text-muted);">Top Kota Faculties & NPTEL open courseware</div>
            </div>
            <a href="${ch.videoLectureUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn ghost btn-sm" style="font-size:11px; color:var(--brand-rose); border-color:rgba(244,63,94,0.4); text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
              <i class="ph-fill ph-play-circle"></i> Watch Video Lecture ↗
            </a>
          </div>

          <!-- 4. Must-Solve Questions Guide -->
          <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-left:3px solid var(--brand-gold); border-radius:8px; padding:10px 12px;">
            <div style="font-size:11px; color:var(--brand-gold); font-weight:700; margin-bottom:2px;"><i class="ph-fill ph-target"></i> Must-Solve Problems:</div>
            <div style="font-size:12px; color:var(--text-main);">${ch.mustSolvePractice || 'Solve all NCERT In-Text + HCV / MS Chouhan Level 1 & 2 + 2019-2025 PYQs'}</div>
          </div>
        </div>
      </div>

      <!-- Key Formulas & Derivations -->
      ${ch.keyFormulas && ch.keyFormulas.length > 0 ? `
        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px; padding:14px; margin-bottom:16px;">
          <h4 style="font-size:12px; font-weight:800; color:var(--brand-sky); text-transform:uppercase; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
            <i class="ph-fill ph-lightning"></i> Essential Chapter Formulas & Short-Cuts:
          </h4>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${ch.keyFormulas.map(f => `
              <div style="font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--text-main); background:var(--bg-surface); border:1px solid var(--border-color); padding:6px 10px; border-radius:6px; border-left:3px solid var(--brand-sky);">
                ${f}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Subtopics Breakdown -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:12px; padding:14px; margin-bottom:16px;">
        <h4 style="font-size:12px; font-weight:800; color:var(--brand-gold); text-transform:uppercase; margin-bottom:8px;">
          <i class="ph-fill ph-push-pin"></i> Syllabus Breakdown & High-Yield Focus:
        </h4>
        <ul style="padding-left:18px; font-size:12.5px; color:var(--text-main); display:flex; flex-direction:column; gap:5px; line-height:1.4;">
          ${Array.isArray(ch.subtopics) ? ch.subtopics.map(s => `<li>${s}</li>`).join('') : `<li>${ch.subtopics || 'Core concept Mastery'}</li>`}
        </ul>
      </div>

      <!-- Action Buttons -->
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn ${isDone ? 'ghost' : 'primary'}" style="flex:1;" onclick="toggleChapterComplete('${ch.id}'); document.getElementById('modal').close();">
          ${isDone ? '↩️ Mark Incomplete' : '<i class="ph-fill ph-check-circle"></i> Mark Chapter Complete (+25 XP)'}
        </button>
        <button class="btn ghost" onclick="document.getElementById('modal').close(); navigateView('tests'); if(window.MockEngine) MockEngine.startPracticeTest('${ch.id}');">
          <i class="ph-fill ph-target"></i> Practice 10-Q Chapter CBT
        </button>
        <button class="btn ghost" onclick="document.getElementById('modal').close(); navigateView('notes');">
          <i class="ph-fill ph-file-text"></i> Open Master Notes
        </button>
      </div>
    </div>
  `;
  modal.showModal();
}
window.openChapterModal = openChapterModal;

// ================= MASTER APP VIEWS =================

// 1. HOME DASHBOARD VIEW
function renderHomeView() {
  const allCh = typeof getAllChapters === 'function' ? getAllChapters() : [];
  const completedCount = Object.values(appState.progress).filter(Boolean).length;
  const totalChapters = allCh.length || 34;
  const progressPct = Math.round((completedCount / totalChapters) * 100);
  const isHindi = appState.lang === 'hindi';
  const isAdv = false;
  const studyStats = getStudyStats();
  const session = window.activeStudySession;

    let totalTests = 0;
    let totalAttempted = 0;
    let totalCorrect = 0;
    let avgAccuracy = 0;

    if (window.appState && window.appState.testHistory && window.appState.testHistory.length > 0) {
      totalTests = window.appState.testHistory.length;
      window.appState.testHistory.forEach(t => {
        totalAttempted += (t.correctCount || 0) + (t.wrongCount || 0);
        totalCorrect += (t.correctCount || 0);
      });
      if (totalTests > 0) {
        avgAccuracy = Math.round(window.appState.testHistory.reduce((acc, t) => acc + (t.accuracy || 0), 0) / totalTests);
      }
    }
  

  return `
    <!-- Hero HUD -->
    <div class="hero-hud" style="${isAdv ? 'border-color: rgba(245,158,11,0.35); background: linear-gradient(135deg, rgba(245,158,11,0.1), rgba(236,72,153,0.06));' : ''}">
      <div class="hud-grid">
        <div class="hud-headline">
          <div style="display:inline-flex; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap;">
            <span class="tag-badge ${isAdv ? 'tag-adv' : 'tag-high'}">${isAdv ? '<i class="ph-fill ph-lightning"></i> NEET UG ADVANCED MODE' : '<i class="ph-fill ph-target"></i> NEET 720M MODE'}</span>
            <span class="tag-badge ${isAdv ? 'tag-high' : 'tag-adv'}">${isAdv ? 'TARGET AIR < 50 · AIIMS BOMBAY CSE' : 'TARGET 700%ile · TOP NITS & IAIIMSS'}</span>
          </div>
          <h2>${isAdv 
            ? (isHindi ? '<i class="ph-fill ph-lightning"></i> स्वागत है, भावी Doctor! (AIIMS NEET 720 Mode)' : '<i class="ph-fill ph-lightning"></i> Welcome back, Future Doctor! (NEET 720 Mode)')
            : (isHindi ? '<i class="ph-fill ph-target"></i> स्वागत है, भविष्य के इंजीनियर! (NEET Mode)' : '<i class="ph-fill ph-target"></i> Welcome back, Aspirant Doctor! (NEET Mode)')}</h2>
          <p>${isAdv 
            ? (isHindi 
                ? 'AIIMS बॉम्बे व शीर्ष AIIMSs के लिए उन्नत बहु-अवधारणात्मक अभ्यास। 360 अंकों की पेपर 1 व पेपर 2 सिमुलेशन, मल्टी-करेक्ट आंशिक मार्किंग (+4/-2) और इरोडोव/ब्लैक बुक स्तर के प्रश्न।' 
                : 'Advanced multi-concept problem solving engineered for Top AIIMSs. 720 Marks Paper 1 & Paper 2 CBT simulations with multi-correct partial marking (+4/+3/+2/+1/-2) and matrix lists.')
            : (isHindi 
                ? 'आपका उच्च-प्रदर्शन, ज़ीरो-डिस्ट्रैक्शन NEET UG इंजीनियरिंग OS। NTA CBT सिमुलेटर, फॉर्मूला वॉल्ट और ऑल इंडिया रैंक प्रेडिक्टर।' 
                : 'Your high-performance, zero-distraction engineering entrance OS. NTA CBT simulator, formula vault, and rank predictor.')}
          </p>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btn ${isAdv ? 'gold' : 'primary'}" onclick="navigateView('tests')">
              ${isAdv ? (isHindi ? '<i class="ph-fill ph-lightning"></i> AIIMS 360M ग्रांड टेस्ट दें' : '<i class="ph-fill ph-lightning"></i> Launch AIIMS 360M Mock Test') : (isHindi ? '<i class="ph-fill ph-target"></i> NTA CBT टेस्ट शुरू करें' : '<i class="ph-fill ph-target"></i> Launch CBT Mock Test')}
            </button>
            <button class="btn ${isAdv ? 'primary' : 'gold'}" onclick="navigateView('rapid-fire')">
              <i class="ph-fill ph-fire"></i> ${isHindi ? '60s फॉर्मूला स्प्रिंट' : '60s Formula Sprint'}
            </button>
            <button class="btn ghost" onclick="navigateView('predictor')">
              <i class="ph-fill ph-chart-bar"></i> ${isHindi ? 'रैंक व कॉलेज प्रेडिक्टर' : 'Rank & College Predictor'}
            </button>
          </div>
        </div>

        <div class="hud-stats-row">
          <div class="stat-tile">
            <strong>${completedCount} / ${totalChapters}</strong>
            <span>${isHindi ? 'अध्याय पूर्ण' : 'Chapters Done'} (${progressPct}%)</span>
          </div>
          <div class="stat-tile">
            <strong style="color:${isAdv ? 'var(--brand-gold)' : 'var(--brand-sky)'};">${isAdv ? 'AIR < 50' : `${appState.targetPercentile || 700}%`}</strong>
            <span>${isAdv ? (isHindi ? 'लक्ष्य AIIMS रैंक' : 'Target AIIMS Rank') : (isHindi ? 'लक्ष्य %ile' : 'Target %ile')}</span>
          </div>
          <div class="stat-tile">
            <strong style="color:var(--brand-emerald);">100%</strong>
            <span>${isHindi ? 'मुफ्त एक्सेस' : 'Free Access'}</span>
          </div>
          <div class="stat-tile">
            <strong style="color:var(--brand-rose);">${appState.mistakes.length}</strong>
            <span>${isHindi ? 'गलतियां नोट' : 'Mistakes Log'}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Deep Study Stopwatch Strip -->
    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; padding:16px 20px; margin-bottom:24px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px;">
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:24px;"><i class="ph-fill ph-timer"></i></span>
        <div>
          <div style="font-size:12px; font-weight:700; color:var(--text-muted);">${isHindi ? 'आज का अध्ययन समय (Today\'s Focus)' : 'Today\'s Deep Study Tracker'}</div>
          <div id="liveStudyTimerDisplay" style="font-family:'JetBrains Mono', monospace; font-size:20px; font-weight:800; color:var(--brand-sky);">
            ${formatStudySeconds(studyStats.todaySeconds)}
          </div>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <button class="btn ${session.isRunning ? 'gold' : 'primary'}" onclick="toggleStudySession()">
          ${session.isRunning ? '⏸️ Pause Timer' : '<i class="ph-fill ph-play-circle"></i>️ Start Study Session'}
        </button>
        <button class="btn ghost" onclick="navigateView('focus')">
          <i class="ph-fill ph-headphones"></i> Pomodoro Room
        </button>
      </div>
    </div>

    
    <!-- User Progress Analytics -->
    <div style="background:var(--bg-card); border:1px solid var(--brand-indigo); border-radius:14px; padding:16px 20px; margin-bottom:24px;">
      <h3 style="font-size:16px; font-weight:800; color:var(--brand-indigo); margin-top:0; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
        <i class="ph-fill ph-chart-line-up"></i> My Progress Analytics Report
      </h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(100px, 1fr)); gap:12px;">
        <div class="stat-tile" style="background:rgba(99,102,241,0.1); border-left:3px solid var(--brand-indigo); padding:10px;">
          <strong style="font-size:22px; color:var(--brand-indigo);">${totalTests}</strong>
          <span style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Tests Taken</span>
        </div>
        <div class="stat-tile" style="background:rgba(56,189,248,0.1); border-left:3px solid var(--brand-sky); padding:10px;">
          <strong style="font-size:22px; color:var(--brand-sky);">${totalAttempted}</strong>
          <span style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Qs Attempted</span>
        </div>
        <div class="stat-tile" style="background:rgba(16,185,129,0.1); border-left:3px solid var(--brand-emerald); padding:10px;">
          <strong style="font-size:22px; color:var(--brand-emerald);">${totalCorrect}</strong>
          <span style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Right Answers</span>
        </div>
        <div class="stat-tile" style="background:rgba(245,158,11,0.1); border-left:3px solid var(--brand-gold); padding:10px;">
          <strong style="font-size:22px; color:var(--brand-gold);">${avgAccuracy}%</strong>
          <span style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Avg Accuracy</span>
        </div>
      </div>
    </div>

    <!-- Core Medical Modules Grid -->
    <h3 style="font-size:18px; font-weight:800; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
      <i class="ph-fill ph-lightning"></i> ${isHindi ? 'मुख्य मेडिकल मॉड्यूल्स' : 'Core Medical Modules'}
    </h3>
    <div class="card-grid">
      <div class="action-card" onclick="navigateView('heatmap')">
        <div>
          <div class="action-card-header">
            <div class="action-card-icon"><i class="ph-fill ph-fire"></i></div>
            <div>
              <strong style="font-size:15px;">10-Year PYQ Heatmap & Yield</strong>
              <div style="font-size:11px; color:var(--brand-emerald); font-weight:700;">142 Shifts Analyzed (2015-25)</div>
            </div>
          </div>
          <p style="font-size:12.5px; color:var(--text-muted); margin-top:6px;">
            High-yield, low-effort chapters with question frequency, trends, and guaranteed marks.
          </p>
        </div>
        <div style="font-size:12px; font-weight:700; color:var(--brand-emerald); margin-top:12px;">Open Heatmap →</div>
      </div>

      <div class="action-card" onclick="navigateView('cheatsheets')">
        <div>
          <div class="action-card-header">
            <div class="action-card-icon"><i class="ph-fill ph-file-text"></i></div>
            <div>
              <strong style="font-size:15px;">1-Page Formula Cheat-Sheets</strong>
              <div style="font-size:11px; color:var(--brand-sky); font-weight:700;">Topper Equation Sheets</div>
            </div>
          </div>
          <p style="font-size:12.5px; color:var(--text-muted); margin-top:6px;">
            Printable 1-page summary cards for Physics, Organic Reactions, and Biology shortcuts.
          </p>
        </div>
        <div style="font-size:12px; font-weight:700; color:var(--brand-sky); margin-top:12px;">View Cheat Sheets →</div>
      </div>

      <div class="action-card" onclick="navigateView('aiims')">
        <div>
          <div class="action-card-header">
            <div class="action-card-icon"><i class="ph-fill ph-bank"></i></div>
            <div>
              <strong style="font-size:15px;">AIIMS & Govt Medical Cutoff Explorer</strong>
              <div style="font-size:11px; color:var(--brand-gold); font-weight:700;">Top Medical Colleges Ranks</div>
            </div>
          </div>
          <p style="font-size:12.5px; color:var(--text-muted); margin-top:6px;">
            Live chance calculator (Safe, Probable, Dream) for MBBS and BDS branches.
          </p>
        </div>
        <div style="font-size:12px; font-weight:700; color:var(--brand-gold); margin-top:12px;">Explore Medical Cutoffs →</div>
      </div>

      <div class="action-card" onclick="navigateView('speedmath')">
        <div>
          <div class="action-card-header">
            <div class="action-card-icon"><i class="ph-fill ph-calculator"></i></div>
            <div>
              <strong style="font-size:15px;">60s Speed Math & Constants</strong>
              <div style="font-size:11px; color:var(--brand-rose); font-weight:700;">Rapid Calculation Drills</div>
            </div>
          </div>
          <p style="font-size:12.5px; color:var(--text-muted); margin-top:6px;">
            Squares, Cubes, Physics constants (hc, k, R), logs, and special trigonometry angles.
          </p>
        </div>
        <div style="font-size:12px; font-weight:700; color:var(--brand-rose); margin-top:12px;">Start Speed Drill →</div>
      </div>

      <div class="action-card" onclick="navigateView('podcast')">
        <div>
          <div class="action-card-header">
            <div class="action-card-icon">🎙️</div>
            <div>
              <strong style="font-size:15px;">Audio Podcasts & Revision</strong>
              <div style="font-size:11px; color:var(--brand-cyan); font-weight:700;">Hands-Free Voice Recall</div>
            </div>
          </div>
          <p style="font-size:12.5px; color:var(--text-muted); margin-top:6px;">
            Listen to periodic trends, rotational laws, and genetics properties with adjustable speed.
          </p>
        </div>
        <div style="font-size:12px; font-weight:700; color:var(--brand-cyan); margin-top:12px;">Listen Audio →</div>
      </div>

      <div class="action-card" onclick="navigateView('solver')">
        <div>
          <div class="action-card-header">
            <div class="action-card-icon">🤖</div>
            <div>
              <strong style="font-size:15px;">AI Explainer & Daily DPP</strong>
              <div style="font-size:11px; color:var(--brand-sky); font-weight:700;">Targeted Weak-Area Booster</div>
            </div>
          </div>
          <p style="font-size:12.5px; color:var(--text-muted); margin-top:6px;">
            Step-by-step problem deconstruction and auto-generated daily 5-question problem sets.
          </p>
        </div>
        <div style="font-size:12px; font-weight:700; color:var(--brand-sky); margin-top:12px;">Launch Explainer →</div>
      </div>

      <div class="action-card" onclick="navigateView('books')">
        <div>
          <div class="action-card-header">
            <div class="action-card-icon"><i class="ph-fill ph-books"></i></div>
            <div>
              <strong style="font-size:15px;">PCB Syllabus & Standard Books</strong>
              <div style="font-size:11px; color:var(--brand-sky); font-weight:700;">NCERT, Trueman & MTG</div>
            </div>
          </div>
          <p style="font-size:12.5px; color:var(--text-muted); margin-top:6px;">
            Physics, Chemistry, and Biology chapters with weightage, formula sheets, and top reference texts.
          </p>
        </div>
        <div style="font-size:12px; font-weight:700; color:var(--brand-sky); margin-top:12px;">Explore Library →</div>
      </div>

      <div class="action-card" onclick="navigateView('tests')">
        <div>
          <div class="action-card-header">
            <div class="action-card-icon"><i class="ph-fill ph-target"></i></div>
            <div>
              <strong style="font-size:15px;">NTA & NEET NTA CBT Simulator</strong>
              <div style="font-size:11px; color:var(--brand-gold); font-weight:700;">Unified NEET Engine</div>
            </div>
          </div>
          <p style="font-size:12.5px; color:var(--text-muted); margin-top:6px;">
            Full-screen CBT exam palette, numerical keypad, multi-correct partial marking, and live timer.
          </p>
        </div>
        <div style="font-size:12px; font-weight:700; color:var(--brand-gold); margin-top:12px;">Start CBT Mock →</div>
      </div>
    </div>
  `;
}

// 2. BOOKS & SYLLABUS VIEW
function renderBooksView() {
  const allCh = typeof getAllChapters === 'function' ? getAllChapters() : [];
  const phyCount = allCh.filter(c => c.subjectCode === 'phy').length;
  const chemCount = allCh.filter(c => c.subjectCode === 'chem').length;
  const botCount = allCh.filter(c => c.subjectCode === 'bot').length;
  const zooCount = allCh.filter(c => c.subjectCode === 'zoo').length;
  
  const filter = window.currentSubjectFilter || 'all';
  const filteredCh = filter === 'all' ? allCh : allCh.filter(c => c.subjectCode === filter);
  const isHindi = appState.lang === 'hindi';
  const isAdv = false;
  const books = typeof neet_BOOKS_LIBRARY !== 'undefined' ? neet_BOOKS_LIBRARY : [];
  let filteredBooks = filter === 'all' ? books : books.filter(b => b.subjectCode === filter || b.subjectCode === 'all');

  if (isAdv) {
    filteredBooks = [...filteredBooks].sort((a, b) => {
      const aScore = (a.badge && (a.badge.includes('ADV') || a.badge.includes('AIIMS') || a.badge.includes('TOUGHEST'))) ? 1 : 0;
      const bScore = (b.badge && (b.badge.includes('ADV') || b.badge.includes('AIIMS') || b.badge.includes('TOUGHEST'))) ? 1 : 0;
      return bScore - aScore;
    });
  }

  return `
    <div style="margin-bottom:20px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
        <div>
          <div style="display:inline-flex; align-items:center; gap:6px; margin-bottom:6px;">
            <span class="tag-badge ${isAdv ? 'tag-adv' : 'tag-high'}">${isAdv ? '<i class="ph-fill ph-lightning"></i> NEET NTA REFERENCE ENGINE' : '<i class="ph-fill ph-target"></i> NEET REFERENCE ENGINE'}</span>
            <span style="font-size:11.5px; color:${isAdv ? 'var(--brand-gold)' : 'var(--brand-sky)'}; font-weight:700;">${isAdv ? 'Irodov, MS Chouhan, Black Book & Top AIIMS Decks Prioritized' : 'NCERT Line-by-Line & HCV Foundation Prioritized'}</span>
          </div>
          <h2 style="font-size:22px; font-weight:800; margin-bottom:4px;">
            <i class="ph-fill ph-books"></i> ${isHindi ? 'PCB मानक किताबें, नोट्स व 96 अध्याय पाठ्यक्रम' : 'PCB Standard Reference Books, Notes & 96-Chapter Syllabus'}
          </h2>
          <p style="font-size:13px; color:var(--text-muted); margin:0;">
            ${isHindi ? 'कक्षा 11 व 12 की प्रामाणिक किताबें, टॉपर्स फॉर्मूला शीट्स, हल सहित उदाहरण और विस्तृत पाठ्यक्रम।' : 'Official NCERT Biology, HC Verma, Trueman, key derivations & complete NTA syllabus.'}
          </p>
        </div>
        <button class="btn ghost btn-sm" onclick="navigateView('cheatsheets')"><i class="ph-fill ph-lightning"></i> Topper Cheat-Sheets →</button>
      </div>
    </div>

    <!-- Subject Filters -->
    <div class="filter-strip">
      <button class="filter-btn ${filter === 'all' ? 'active' : ''}" onclick="window.currentSubjectFilter='all'; renderApp();">
        🌟 All Subjects (${allCh.length})
      </button>
      <button class="filter-btn ${filter === 'phy' ? 'active' : ''}" onclick="window.currentSubjectFilter='phy'; renderApp();">
        <i class="ph-fill ph-atom"></i> Physics (${phyCount})
      </button>
      <button class="filter-btn ${filter === 'chem' ? 'active' : ''}" onclick="window.currentSubjectFilter='chem'; renderApp();">
        🧪 Chemistry (${chemCount})
      </button>
      <button class="filter-btn ${filter === 'bot' ? 'active' : ''}" onclick="window.currentSubjectFilter='bot'; renderApp();">
        🌿 Botany (${botCount})
      </button>
      <button class="filter-btn ${filter === 'zoo' ? 'active' : ''}" onclick="window.currentSubjectFilter='zoo'; renderApp();">
        🦁 Zoology (${zooCount})
      </button>
    </div>

    <!-- Interactive Standard Reference Books Shelf -->
    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; padding:18px; margin-bottom:24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:6px;">
        <h4 style="font-size:15px; font-weight:800; color:var(--brand-sky); margin:0;">
          <i class="ph-fill ph-book-open"></i> Standard NEET Reference Books & Problem Decks:
        </h4>
        <span style="font-size:11px; color:var(--text-muted);">Click any book to read key chapters & worked problems</span>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:12px;">
        ${filteredBooks.map(b => `
          <div style="background:var(--bg-surface); padding:14px; border-radius:10px; border:1px solid var(--border-color); display:flex; flex-direction:column; justify-content:space-between; transition:transform 0.15s ease;" onmouseover="this.style.borderColor='var(--brand-sky)'" onmouseout="this.style.borderColor='var(--border-color)'">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                <span class="tag-badge tag-high" style="font-size:9.5px;">${b.badge}</span>
                <span style="font-size:10.5px; color:var(--brand-gold); font-weight:700;">★ 4.9</span>
              </div>
              <strong style="font-size:13.5px; color:var(--text-heading); display:block; margin-bottom:2px;">${b.coverIcon} ${isHindi ? b.hindiTitle : b.title}</strong>
              <div style="font-size:11px; color:var(--brand-sky); font-weight:600; margin-bottom:6px;">✍️ ${b.author}</div>
              <p style="font-size:11.5px; color:var(--text-muted); line-height:1.4; margin-bottom:12px;">
                ${b.description.substring(0, 95)}...
              </p>
            </div>
            <div style="display:flex; gap:6px; flex-direction:column;">
              <button class="btn ghost btn-sm" style="width:100%; font-size:12px; font-weight:700; color:var(--brand-sky); border-color:rgba(56,189,248,0.3);" onclick="openBookModal('${b.id}')">
                <i class="ph-fill ph-book-open"></i> Study Guide & Solved Qs →
              </button>
              <a href="${b.readOnlineUrl || 'https://ncert.nic.in/textbook.php'}" target="_blank" rel="noopener noreferrer" class="btn ghost btn-sm" style="width:100%; font-size:11px; font-weight:600; color:var(--brand-emerald); border-color:rgba(16,185,129,0.3); text-decoration:none; text-align:center;">
                🌐 Free PDF / Online Portal ↗
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Chapter Cards List Header -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <h3 style="font-size:16px; font-weight:800; color:var(--text-heading); margin:0;">
        <i class="ph-fill ph-file-text"></i> Chapter Syllabus, Books & Resource Hub (${filteredCh.length} Chapters)
      </h3>
      <span style="font-size:11px; color:var(--text-muted);">Mark checkbox to track completion</span>
    </div>

    <!-- Chapter Cards List -->
    <div style="display:flex; flex-direction:column; gap:10px;">
      ${filteredCh.map(ch => {
        const isDone = !!appState.progress[ch.id];
        return `
          <div class="chapter-card" style="border-left: 4px solid ${ch.subjectCode === 'phy' ? 'var(--sub-phy)' : ch.subjectCode === 'chem' ? 'var(--sub-chem)' : 'var(--sub-math)'};">
            <div class="chapter-header">
              <div style="flex:1;">
                <div class="chapter-title" style="display:flex; align-items:center; gap:8px;">
                  <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleChapterComplete('${ch.id}')" style="accent-color:var(--brand-sky); width:18px; height:18px; cursor:pointer;" title="Mark complete">
                  <span style="cursor:pointer; font-weight:700; color:var(--text-heading);" onclick="openChapterModal('${ch.id}')">${isHindi ? (ch.hindiName || ch.name) : ch.name}</span>
                </div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:4px;">
                  <span style="color:var(--brand-sky); font-weight:600;">${ch.subject.toUpperCase()}</span> · ${ch.classNum} · <i class="ph-fill ph-timer"></i> ${ch.hours}h · Main: <strong style="color:var(--brand-gold);">${ch.neetWeight}</strong> · Adv: <strong style="color:var(--brand-rose);">${ch.aiimsWeight}</strong>
                </div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:3px;">
                  <i class="ph-fill ph-book-open"></i> <strong style="color:var(--brand-gold);">${ch.primaryBook || 'Standard Textbook'}</strong>
                </div>
              </div>
              <div class="chapter-tags" style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <button class="btn ghost btn-sm" onclick="openChapterModal('${ch.id}')" style="font-size:11.5px; color:var(--brand-sky); border-color:rgba(56,189,248,0.3);">
                  <i class="ph-fill ph-books"></i> Kaha Se Padhe & Notes →
                </button>
                <a href="${ch.ncertPdfUrl || 'https://ncert.nic.in/textbook.php'}" target="_blank" rel="noopener noreferrer" class="btn ghost btn-sm" style="font-size:11px; color:var(--brand-emerald); border-color:rgba(16,185,129,0.3); text-decoration:none;">
                  <i class="ph-fill ph-download-simple"></i> NCERT PDF ↗
                </a>
                <button class="btn ghost btn-sm" onclick="navigateView('tests'); if(window.MockEngine) MockEngine.startPracticeTest('${ch.id}');" style="font-size:11.5px; color:var(--brand-gold); border-color:rgba(245,158,11,0.3);">
                  <i class="ph-fill ph-target"></i> Quiz
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// 3. VIDEO CLASSES VIEW
function renderVideosView() {
  const isHindi = appState.lang === 'hindi';
  return `
    <div style="margin-bottom:20px;">
      <h2 style="font-size:22px; font-weight:800; margin-bottom:4px;">
        <i class="ph-fill ph-video-camera"></i> ${isHindi ? 'मुफ्त उच्च-गुणवत्ता वीडियो क्लासेज' : 'Free High-Yield Video Lectures'}
      </h2>
      <p style="font-size:13px; color:var(--text-muted);">
        ${isHindi ? 'शीर्ष Doctors और अनुभवी संकायों के संपूर्ण क्लास 11 व 12 PCM वीडियो लेक्चर्स।' : 'Curated full chapter masterclasses from top AIIMS faculties and educators.'}
      </p>
    </div>

    <div class="card-grid">
      <div class="action-card">
        <div class="action-card-header">
          <div class="action-card-icon"><i class="ph-fill ph-atom"></i></div>
          <div>
            <strong>Physics Galaxy (Ashish Arora Sir)</strong>
            <div style="font-size:11px; color:var(--brand-sky); font-weight:700;">Complete NEET Concept Videos</div>
          </div>
        </div>
        <p style="font-size:12.5px; color:var(--text-muted);">700+ Illustration problem videos for Rotational Motion, EMI, and Modern Physics.</p>
        <a href="https://www.youtube.com/@physicsgalaxy74" target="_blank" rel="noopener noreferrer" class="btn primary btn-sm" style="margin-top:12px; width:100%;">
          Watch on YouTube ↗
        </a>
      </div>

      <div class="action-card">
        <div class="action-card-header">
          <div class="action-card-icon">🧪</div>
          <div>
            <strong>Mohit Tyagi / Competishun</strong>
            <div style="font-size:11px; color:var(--brand-emerald); font-weight:700;">Zero-to-NEET Complete Course</div>
          </div>
        </div>
        <p style="font-size:12.5px; color:var(--text-muted);">Full whiteboard classroom lectures for Physical, Organic, and Inorganic Chemistry.</p>
        <a href="https://www.youtube.com/@MohitTyagi" target="_blank" rel="noopener noreferrer" class="btn primary btn-sm" style="margin-top:12px; width:100%;">
          Watch on YouTube ↗
        </a>
      </div>

      <div class="action-card">
        <div class="action-card-header">
          <div class="action-card-icon">📐</div>
          <div>
            <strong>Unacademy NEET / Namo Kaul</strong>
            <div style="font-size:11px; color:var(--brand-gold); font-weight:700;">Calculus & Coordinate Geometry</div>
          </div>
        </div>
        <p style="font-size:12.5px; color:var(--text-muted);">High-speed problem solving shortcuts, PYQ analysis, and live marathon sessions.</p>
        <a href="https://www.youtube.com/@UnacademyNEET" target="_blank" rel="noopener noreferrer" class="btn primary btn-sm" style="margin-top:12px; width:100%;">
          Watch on YouTube ↗
        </a>
      </div>

      <div class="action-card">
        <div class="action-card-header">
          <div class="action-card-icon"><i class="ph-fill ph-bank"></i></div>
          <div>
            <strong>AIIMS-PAL / Swayam Prabha (MHRD)</strong>
            <div style="font-size:11px; color:var(--brand-violet); font-weight:700;">Official AIIMS Faculty Lectures</div>
          </div>
        </div>
        <p style="font-size:12.5px; color:var(--text-muted);">Conceptual lectures directly by professors of AIIMS Delhi, AIIMS Bombay, and AIIMS Madras.</p>
        <a href="https://www.youtube.com/@AIIMSPAL" target="_blank" rel="noopener noreferrer" class="btn primary btn-sm" style="margin-top:12px; width:100%;">
          Watch on YouTube ↗
        </a>
      </div>
    </div>
  `;
}

// 4. TESTS & PRACTICE VIEW (WITH TEST TREE & NTA SIMULATOR)
function renderTestsView() {
  const isHindi = appState.lang === 'hindi';
  const isAdv = false;

  return `
    <div style="margin-bottom:16px;">
      <div style="display:inline-flex; align-items:center; gap:6px; margin-bottom:6px;">
        <span class="tag-badge ${isAdv ? 'tag-adv' : 'tag-high'}">${isAdv ? '<i class="ph-fill ph-lightning"></i> NEET UG ADVANCED MODE' : '<i class="ph-fill ph-target"></i> NEET 720M MODE'}</span>
        <span style="font-size:11.5px; color:${isAdv ? 'var(--brand-gold)' : 'var(--brand-sky)'}; font-weight:700;">${isAdv ? '720 Marks Scale · Multi-Correct Partial & Numerical Keypad' : '720 Marks Scale · NTA Single & Integer Questions'}</span>
      </div>
      <h2 style="font-size:22px; font-weight:800; margin-bottom:4px;">
        ${isAdv 
          ? (isHindi ? '<i class="ph-fill ph-lightning"></i> NEET UG एडवांस्ड परीक्षा हब व टेस्ट ट्री (360 अंक)' : '<i class="ph-fill ph-lightning"></i> AIIMS CBT Simulator & Topic Mastery Tree (360M)')
          : (isHindi ? '<i class="ph-fill ph-target"></i> NEET मेन परीक्षा हब व 6-स्तरीय टेस्ट ट्री (300 अंक)' : '<i class="ph-fill ph-target"></i> Tests, CBT Simulator & Topic Mastery Tree (300M)')}
      </h2>
      <p style="font-size:13px; color:var(--text-muted);">
        ${isAdv 
          ? (isHindi ? 'प्रत्येक टॉपिक का AIIMS स्तर का माइक्रो ड्रिल, 18 प्रश्नों का चैप्टर माइलस्टोन और 10 फुल NEET एडवांस 360M ग्रांड सिमुलेशन (पेपर 1 व 2)।' : 'Granular AIIMS micro drills for every subtopic, full 18-Q chapter milestone exams, and 10 full-length AIIMS 360M Grand Simulations.')
          : (isHindi ? 'प्रत्येक टॉपिक का 5 प्रश्नों का माइक्रो टेस्ट, संपूर्ण चैप्टर माइलस्टोन टेस्ट और 10 फुल NTA CBT ग्रांड मॉक।' : 'Granular 5-Q topic tests for every subtopic, full 20-Q chapter milestone exams, and 10 full-length NTA CBT Grand Mocks.')}
      </p>
    </div>

    <!-- Quick Action Banner for CBT & OMR -->
    <div class="card-grid" style="margin-bottom:20px;">
      <div class="action-card" onclick="if(window.MockEngine) MockEngine.startFullMock();" style="${isAdv ? 'border-color: rgba(245,158,11,0.35);' : ''}">
        <div class="action-card-header">
          <div class="action-card-icon">${isAdv ? '<i class="ph-fill ph-lightning"></i>' : '<i class="ph-fill ph-rocket"></i>'}</div>
          <div>
            <strong>${isAdv ? 'Launch AIIMS Grand AIIMS Simulation' : 'Launch Official NTA CBT Grand Mock'}</strong>
            <div style="font-size:11px; color:${isAdv ? 'var(--brand-gold)' : 'var(--brand-sky)'}; font-weight:700;">${isAdv ? '720 Marks · 180 Mins · Paper 1 + 2 Simulation' : '720 Marks · 180 Mins · Single & Numerical'}</div>
          </div>
        </div>
        <p style="font-size:12.5px; color:var(--text-muted);">${isAdv ? 'Authentic AIIMS CBT double-paper simulation with multi-correct partial marking (+4/+3/+2/+1/-2), matrix list, and numerical keypad.' : 'Full examination screen with question palette, numerical keypad, and subject switching.'}</p>
        <button class="btn ${isAdv ? 'gold' : 'primary'} btn-sm" style="margin-top:10px;">${isAdv ? 'Start AIIMS Simulation →' : 'Start Real Mock →'}</button>
      </div>

      <div class="action-card" onclick="if(window.OMREngine) OMREngine.openDigitalOMR();">
        <div class="action-card-header">
          <div class="action-card-icon">📝</div>
          <div>
            <strong>Digital OMR Sheet Simulator</strong>
            <div style="font-size:11px; color:var(--brand-emerald); font-weight:700;">Offline Paper-Pen Exam Answering</div>
          </div>
        </div>
        <p style="font-size:12.5px; color:var(--text-muted);">Interactive bubble filling with instant answer key checking and negative mark penalty.</p>
        <button class="btn ghost btn-sm" style="margin-top:10px;" onclick="TestTreeEngine.launchPreNeetMock(1)">Start Test in OMR Mode →</button>
      </div>
    </div>

    <!-- Complete 6-Level Test Mastery Tree -->
    ${window.TestTreeEngine && typeof window.TestTreeEngine.renderTreeHTML === 'function' ? window.TestTreeEngine.renderTreeHTML() : '<div style="padding:20px; text-align:center;">Loading Test Tree Engine...</div>'}
  `;
}

// 5. MORE SETTINGS & TOOLS VIEW
function renderMoreView() {
  const isHindi = appState.lang === 'hindi';
  return `
    <div style="margin-bottom:20px;">
      <h2 style="font-size:22px; font-weight:800; margin-bottom:4px;">
        <i class="ph-fill ph-gear"></i> ${isHindi ? 'अतिरिक्त टूल्स, सेटिंग्स व सपोर्ट' : 'Additional Tools, Settings & Developer Hub'}
      </h2>
      <p style="font-size:13px; color:var(--text-muted);">
        ${isHindi ? 'फॉर्मूला वॉल्ट, रैपिड-फायर स्प्रिंट, मिस्टेक नोटबुक, प्रेडिक्टर और डेवलपर प्रोफाइल।' : 'Advanced utilities, formula vault, error notebook, rank predictor, and developer social profile.'}
      </p>
    </div>

    <!-- App Settings (Mobile Priority) -->
    <div style="font-size:12px; font-weight:800; color:var(--brand-sky); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px;">
      <i class="ph-fill ph-sliders"></i> ${isHindi ? 'ऐप सेटिंग्स' : 'App Settings'}
    </div>
    <div class="card-grid" style="margin-bottom:24px;">
      
      <!-- App Language -->
      <div class="setting-card">
        <div>
          <strong style="display:block; font-size:14px;"><i class="ph-fill ph-translate"></i> ${isHindi ? 'भाषा बदलें' : 'App Language'}</strong>
          <span style="font-size:11px; color:var(--text-muted);">${isHindi ? 'पूरे ऐप की भाषा बदलें' : 'Change global application language'}</span>
        </div>
        <div class="segmented-control">
          <button class="${!isHindi ? 'active' : ''}" onclick="setGlobalLanguage('bilingual'); renderApp();">🌐 Bilingual</button>
          <button class="${isHindi ? 'active' : ''}" onclick="setGlobalLanguage('hindi'); renderApp();">🇮🇳 हिन्दी</button>
        </div>
      </div>
      
      <!-- Theme Toggle -->
      <div class="setting-card">
        <div>
          <strong style="display:block; font-size:14px;"><i class="ph-fill ph-moon-stars"></i> ${isHindi ? 'डार्क / लाइट मोड' : 'Dark / Light Theme'}</strong>
          <span style="font-size:11px; color:var(--text-muted);">${isHindi ? 'आँखों के आराम के लिए' : 'Toggle for eye comfort'}</span>
        </div>
        <div class="segmented-control">
          <button class="active" onclick="toggleAppTheme()">🌗 Toggle Theme</button>
        </div>
      </div>

      <!-- Account & Cloud Sync -->
      <div class="setting-card">
        <div>
          <strong style="display:block; font-size:14px;"><i class="ph-fill ph-user-circle"></i> ${isHindi ? 'अकाउंट व सिंक' : 'Account & Sync'}</strong>
          <span style="font-size:11px; color:var(--text-muted);">${isHindi ? 'प्रोग्रेस को क्लाउड पर सेव करें' : 'Cloud save your progress'}</span>
        </div>
        <div class="segmented-control">
          ${(window.ClerkAuth && window.ClerkAuth.isAuthenticated()) 
            ? `<button class="active" onclick="if(window.ClerkAuth) window.ClerkAuth.openUserProfile()" style="background:var(--brand-emerald); color:#fff; border-color:var(--brand-emerald);">View Profile</button>`
            : `<button class="active" onclick="if(window.ClerkAuth) window.ClerkAuth.openSignIn()" style="background:var(--brand-sky); color:#fff; border-color:var(--brand-sky);">Login Profile</button>`
          }
        </div>
      </div>

    </div>

    <div class="card-grid">
      <div class="action-card" onclick="navigateView('notes')">
        <div class="action-card-header">
          <div class="action-card-icon"><i class="ph-fill ph-lightning"></i></div>
          <div>
            <strong>Notes & Formula Vault</strong>
            <div style="font-size:11px; color:var(--brand-sky);">High-Yield Equation Sheets</div>
          </div>
        </div>
        <p style="font-size:12.5px; color:var(--text-muted);">Instant formula revision sheets for PCM.</p>
      </div>

      <div class="action-card" onclick="navigateView('rapid-fire')">
        <div class="action-card-header">
          <div class="action-card-icon"><i class="ph-fill ph-fire"></i></div>
          <div>
            <strong>60s Formula Rapid-Fire</strong>
            <div style="font-size:11px; color:var(--brand-gold);">Active Recall Speed Drill</div>
          </div>
        </div>
        <p style="font-size:12.5px; color:var(--text-muted);">Gamified 60-second formula sprint with sound effects.</p>
      </div>

      <div class="action-card" onclick="navigateView('mistakes')">
        <div class="action-card-header">
          <div class="action-card-icon">⚠️</div>
          <div>
            <strong>Mistake Notebook</strong>
            <div style="font-size:11px; color:var(--brand-rose);">Smart Error Vault</div>
          </div>
        </div>
        <p style="font-size:12.5px; color:var(--text-muted);">Auto-logs incorrect questions for retakes.</p>
      </div>

      <div class="action-card" onclick="navigateView('flashcards')">
        <div class="action-card-header">
          <div class="action-card-icon">🗂️</div>
          <div>
            <strong>Spaced Repetition Flashcards</strong>
            <div style="font-size:11px; color:var(--brand-emerald);">Anki-Style Recall</div>
          </div>
        </div>
        <p style="font-size:12.5px; color:var(--text-muted);">Scientific memory retention drills.</p>
      </div>

      <div class="action-card" onclick="navigateView('scientists')">
        <div class="action-card-header">
          <div class="action-card-icon">🔬</div>
          <div>
            <strong>Physicists & Theorems</strong>
            <div style="font-size:11px; color:var(--brand-violet);">Laws, Discoveries & Formulas</div>
          </div>
        </div>
        <p style="font-size:12.5px; color:var(--text-muted);">Newton, Maxwell, Schrödinger, Euler, Gauss & Ramanujan.</p>
      </div>

      <div class="action-card" onclick="navigateView('certificate')">
        <div class="action-card-header">
          <div class="action-card-icon"><i class="ph-fill ph-trophy"></i></div>
          <div>
            <strong>Doctor Elite Certificate</strong>
            <div style="font-size:11px; color:var(--brand-gold);">Canvas High-Res Generator</div>
          </div>
        </div>
        <p style="font-size:12.5px; color:var(--text-muted);">Downloadable milestone proof of preparation.</p>
      </div>

      <div class="action-card" onclick="navigateView('updates')">
        <div class="action-card-header">
          <div class="action-card-icon">💾</div>
          <div>
            <strong>Backup & Data Management</strong>
            <div style="font-size:11px; color:var(--brand-sky);">Export / Import JSON</div>
          </div>
        </div>
        <p style="font-size:12.5px; color:var(--text-muted);">Save and restore your complete preparation progress.</p>
      </div>
    </div>

    <!-- Developer Profile & Direct Supporter Box -->
    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:16px; padding:24px; text-align:center; margin-top:20px;">
      <div style="font-size:11px; font-weight:800; color:var(--brand-sky); letter-spacing:1px; margin-bottom:4px;">FOUNDER & LEAD DEVELOPER</div>
      <h3 style="font-size:20px; font-weight:800; margin-bottom:6px;">Vinay Kumar Makvana</h3>
      <p style="font-size:13px; color:var(--text-muted); max-width:540px; margin:0 auto 16px;">
        Dedicated to providing 100% free, high-performance coaching alternative software for engineering aspirants across India.
      </p>
      <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin-bottom:18px;">
        <a href="https://www.instagram.com/vi.naytailor/" target="_blank" rel="noopener noreferrer" class="btn ghost btn-sm">
          📸 Instagram: @vi.naytailor
        </a>
        <a href="https://www.linkedin.com/in/vinay-kumar-makvana-2371ba391/" target="_blank" rel="noopener noreferrer" class="btn ghost btn-sm">
          💼 LinkedIn Profile
        </a>
        <button class="btn gold btn-sm" onclick="openContributionModal()">
          ☕ Support Free Education (Contribute)
        </button>
      </div>
      <div style="font-size:11px; color:var(--text-dim);">
        © 2026 NEET OS · Mission AIIMS AIR 1 · 100% Free Pure Engineering OS
      </div>
    </div>
  `;
}

// Support & Voluntary Contribution Engine with Dynamic QR Scanner & Bank-Grade Security
window.currentContributionAmount = 59;
const UPI_BENEFICIARY_ID = (window.APP_CONFIG && window.APP_CONFIG.VITE_UPI_ID) || 'vinay.neetos@okaxis';
const UPI_BENEFICIARY_NAME = (window.APP_CONFIG && window.APP_CONFIG.VITE_UPI_NAME) || 'Vinay Kumar Makvana';

function buildUPIUrl(amount) {
  const amtParam = amount && !isNaN(amount) && Number(amount) > 0 ? `&am=${encodeURIComponent(amount)}` : '';
  return `upi://pay?pa=${encodeURIComponent(UPI_BENEFICIARY_ID)}&pn=${encodeURIComponent(UPI_BENEFICIARY_NAME)}${amtParam}&cu=INR&tn=${encodeURIComponent('NEET OS Voluntary Free Education Support')}`;
}

function getUPIQrUrl(amount) {
  const upiUrl = buildUPIUrl(amount);
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}&margin=8`;
}

function updateContributionAmount(amount) {
  window.currentContributionAmount = amount;
  const qrImg = document.getElementById('contribQrImage');
  const payBtn = document.getElementById('contribDirectPayBtn');
  const amountDisplay = document.getElementById('contribSelectedAmtDisplay');

  const upiUrl = buildUPIUrl(amount);
  const qrUrl = getUPIQrUrl(amount);

  if (qrImg) qrImg.src = qrUrl;
  if (payBtn) {
    payBtn.href = upiUrl;
    payBtn.innerHTML = `<i class="ph-fill ph-rocket"></i> Pay ${amount ? '₹' + amount : 'Voluntary Support'} via UPI App`;
  }
  if (amountDisplay) {
    amountDisplay.textContent = amount ? `₹${amount}` : 'Flexible Support';
  }

  // Highlight active button pill
  document.querySelectorAll('.contrib-amt-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.amount === String(amount));
  });
}
window.updateContributionAmount = updateContributionAmount;

function copyUPIId() {
  const idText = UPI_BENEFICIARY_ID;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(idText).then(() => {
      const copyBtn = document.getElementById('contribCopyBtn');
      if (copyBtn) {
        copyBtn.innerHTML = '<i class="ph-fill ph-check-circle"></i> Copied!';
        copyBtn.style.color = 'var(--brand-emerald)';
        setTimeout(() => {
          if (copyBtn) {
            copyBtn.innerHTML = '<i class="ph-fill ph-clipboard"></i> Copy';
            copyBtn.style.color = '';
          }
        }, 2500);
      }
      showToast('<i class="ph-fill ph-clipboard"></i> UPI ID Copied: ' + idText);
    }).catch(() => {
      showToast('UPI ID: ' + idText);
    });
  } else {
    showToast('UPI ID: ' + idText);
  }
}
window.copyUPIId = copyUPIId;

function confirmContributionTxn() {
  const input = document.getElementById('contribUtrInput');
  const utr = input ? input.value.trim() : '';
  if (!utr || utr.length < 4) {
    showToast('⚠️ Please enter a valid 12-digit UTR / UPI Reference No.');
    return;
  }

  if (!appState.supporterTxns) appState.supporterTxns = [];
  appState.supporterTxns.push({
    utr: utr,
    amount: window.currentContributionAmount || 59,
    date: new Date().toISOString()
  });
  appState.supporterBadge = true;
  saveState();

  const successBox = document.getElementById('contribSuccessFeedback');
  if (successBox) {
    successBox.style.display = 'block';
    successBox.innerHTML = `
      <div style="background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.4); border-radius:12px; padding:14px; margin-top:14px; text-align:center;">
        <div style="font-size:28px; margin-bottom:4px;"><i class="ph-fill ph-confetti"></i></div>
        <strong style="color:var(--brand-emerald); font-size:14px;">Heartfelt Gratitude! Elite Supporter Badge Activated!</strong>
        <p style="font-size:12px; color:var(--text-muted); margin:4px 0 0;">
          UTR: ${escapeHtml(utr)} · Thank you for empowering thousands of aspirants across India!
        </p>
      </div>
    `;
  }
  showToast('🌟 Thank you! Elite Supporter Badge activated.');
}
window.confirmContributionTxn = confirmContributionTxn;

function openContributionModal() {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  if (!modal || !modalBody) return;
  const isHindi = (window.appState && window.appState.lang === 'hindi');
  const initialAmount = window.currentContributionAmount || 59;
  const initialUpiUrl = buildUPIUrl(initialAmount);
  const initialQrUrl = getUPIQrUrl(initialAmount);

  modalBody.innerHTML = `
    <div class="contrib-modal-container">
      <div style="font-size:36px; margin-bottom:6px;">☕</div>
      <h2 style="font-size:22px; font-weight:800; color:var(--text-heading); margin-bottom:6px;">
        ${isHindi ? 'मुफ़्त शिक्षा का समर्थन करें' : 'Support 100% Free Pure Education'}
      </h2>
      <p style="font-size:13px; color:var(--text-muted); max-width:460px; margin:0 auto 14px; line-height:1.5;">
        ${isHindi 
          ? 'NEET OS सभी छात्रों के लिए <strong>100% मुफ़्त</strong> है। यह स्वैच्छिक सहयोग सर्वर होस्टिंग, NTA टेस्ट सीरीज और नए स्टडी कंटेंट को निरंतर मुफ़्त रखने में मदद करता है।' 
          : 'NEET OS is <strong>100% free and open</strong> for all aspirants. Your voluntary contribution powers high-speed servers, test engines, and free study notes.'}
      </p>

      <!-- Custom Amount Selection -->
      <div style="font-size:11.5px; font-weight:800; color:var(--brand-sky); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">
        ${isHindi ? 'अपनी इच्छा अनुसार राशि दर्ज करें (Enter Amount)' : 'Enter Voluntary Amount'}
      </div>
      <div style="display:flex; justify-content:center; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:20px;">
        <span style="font-size:24px; font-weight:800; color:var(--text-main);">₹</span>
        <input type="number" id="customContribAmount" value="${initialAmount}" min="1" 
               style="min-width:0; width:120px; max-width:100%; flex-shrink:1; font-size:24px; font-weight:800; text-align:center; padding:8px; background:var(--bg-card); border:2px solid var(--brand-sky); border-radius:12px; color:var(--text-main); outline:none;"
               oninput="if(this.value) updateContributionAmount(this.value)">
      </div>

      <!-- Secure UPI QR Code Scanner Box -->
      <div class="contrib-qr-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div style="font-size:11px; font-weight:800; color:var(--brand-gold); text-transform:uppercase; letter-spacing:0.5px;">
            <i class="ph-fill ph-lightning"></i> Direct NPCI UPI QR Scanner
          </div>
          <div id="contribSelectedAmtDisplay" style="font-family:'JetBrains Mono', monospace; font-size:14px; font-weight:800; color:var(--brand-sky);">
            ₹${initialAmount}
          </div>
        </div>

        <div class="contrib-qr-wrapper">
          <img id="contribQrImage" src="${initialQrUrl}" alt="UPI Payment QR Code" style="max-width:100%; height:auto; width:190px; display:block; border-radius:8px;">
        </div>

        <div style="font-size:12px; font-weight:700; color:var(--text-main); margin-bottom:10px;">
          <i class="ph-fill ph-device-mobile"></i> Scan with GPay, PhonePe, Paytm, BHIM, Amazon Pay or CRED
        </div>

        <!-- Copyable UPI ID Box -->
        <div class="contrib-upi-display">
          <div style="text-align:left;">
            <div style="font-size:10px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Official UPI ID</div>
            <span style="font-size:14px; color:var(--brand-sky); word-break:break-all;">${UPI_BENEFICIARY_ID}</span>
          </div>
          <button id="contribCopyBtn" class="btn ghost btn-sm" onclick="copyUPIId()" style="font-size:11.5px; padding:4px 10px; font-weight:700;">
            <i class="ph-fill ph-clipboard"></i> Copy
          </button>
        </div>

        <!-- 1-Tap Mobile Intent Direct Button -->
        <a id="contribDirectPayBtn" href="${initialUpiUrl}" class="btn primary" style="width:100%; padding:11px; font-size:14px; font-weight:800; display:block; text-decoration:none; margin-bottom:6px; box-sizing:border-box;">
          <i class="ph-fill ph-rocket"></i> Pay ₹${initialAmount} via UPI App (1-Tap)
        </a>
      </div>

      <!-- Trust & Bank-Grade Security Guarantees -->
      <div class="trust-security-grid">
        <div class="trust-pill">
          <span style="font-size:16px;"><i class="ph-fill ph-shield-check"></i></span>
          <div>
            <strong style="display:block; font-size:11px; color:var(--text-main);">100% Peer-to-Peer</strong>
            <span style="font-size:10px;">0% Gateway Cut · Direct Beneficiary</span>
          </div>
        </div>
        <div class="trust-pill">
          <span style="font-size:16px;"><i class="ph-fill ph-lock-key"></i></span>
          <div>
            <strong style="display:block; font-size:11px; color:var(--text-main);">NPCI Encrypted</strong>
            <span style="font-size:10px;">Bank-to-Bank Instant Settlement</span>
          </div>
        </div>
      </div>


      <!-- Dismiss Button -->
      <div>
        <button class="btn ghost btn-sm" style="padding:8px 20px; font-weight:700; color:var(--text-muted);" onclick="document.getElementById('modal').close()">
          ${isHindi ? 'बंद करें (Back to NEET Prep)' : 'Close (Back to Learning)'}
        </button>
      </div>
    </div>
  `;

  modal.showModal();
}
window.openContributionModal = openContributionModal;

// 6. SCIENTISTS & THEOREMS VIEW
function renderScientistsView() {
  const data = typeof SCIENTISTS_DATA !== 'undefined' ? SCIENTISTS_DATA : [];
  const isHindi = appState.lang === 'hindi';

  return `
    <div style="margin-bottom:20px;">
      <h2 style="font-size:22px; font-weight:800; margin-bottom:4px;">
        🔬 ${isHindi ? 'महान वैज्ञानिक, गणितज्ञ, प्रमेय व नियम' : 'Great Physicists, Chemists, Mathematicians & Theorems'}
      </h2>
      <p style="font-size:13px; color:var(--text-muted);">
        ${isHindi ? 'NEET & Advanced के लिए महत्वपूर्ण नियम, समीकरण और उनकी प्रायोगिक प्रासंगिकता।' : 'Fundamental laws, theorems, equations, and diagrams tested in NEET.'}
      </p>
    </div>

    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:16px;">
      ${data.map(s => `
        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; padding:18px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <div>
              <strong style="font-size:16px; color:var(--text-main);">${isHindi ? s.hindiName : s.name}</strong>
              <div style="font-size:11px; color:var(--brand-sky); font-weight:700;">${s.field} · ${s.era}</div>
            </div>
            <span class="tag-badge tag-high">${s.diagramType || 'Theory'}</span>
          </div>
          <p style="font-size:12.5px; color:var(--text-muted); margin-bottom:12px;">
            ${isHindi ? s.hindiContribution : s.contribution}
          </p>
          <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:8px; padding:10px; margin-bottom:10px;">
            <div style="font-size:10px; font-weight:800; color:var(--brand-gold); margin-bottom:4px;">KEY EQUATIONS:</div>
            <div style="font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--text-main); display:flex; flex-direction:column; gap:4px;">
              ${s.keyFormulas.map(f => `<div>• ${f}</div>`).join('')}
            </div>
          </div>
          <div style="font-size:11px; color:var(--text-dim);">
            <strong>NEET Significance:</strong> ${s.neetSignificance}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// 7. RANK & COLLEGE PREDICTOR VIEW
function renderPredictorView() {
  if (typeof RankPredictor !== 'undefined' && typeof RankPredictor.renderView === 'function') {
    return RankPredictor.renderView();
  }
  return `<div style="text-align:center; padding:40px;">Rank Predictor Loaded</div>`;
}

// 8. NOTES / FORMULA VAULT VIEW
function renderNotesView() {
  const notes = typeof NOTES_DATA !== 'undefined' ? NOTES_DATA : [];
  return `
    <div style="margin-bottom:20px;">
      <h2 style="font-size:22px; font-weight:800; margin-bottom:4px;"><i class="ph-fill ph-lightning"></i> PCM Formula Vault & Cheat Sheets</h2>
      <p style="font-size:13px; color:var(--text-muted);">High-yield equation sheets for rapid recall before CBT tests.</p>
    </div>
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:16px;">
      ${notes.map(n => `
        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; padding:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="tag-badge tag-high">${n.subject ? n.subject.toUpperCase() : 'PCM'}</span>
            <span style="font-size:11px; color:var(--brand-gold); font-weight:700;">High Yield</span>
          </div>
          <h3 style="font-size:16px; font-weight:800; margin-bottom:8px;">${n.title}</h3>
          <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">${n.description || ''}</p>
          <div style="background:var(--bg-surface); padding:10px; border-radius:8px; font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--brand-sky);">
            ${n.previewFormula || 'E = mc², F = dp/dt, \\int x^n dx = \\frac{x^{n+1}}{n+1}'}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// 9. RAPID FIRE VIEW
function renderRapidFireView() {
  if (typeof FormulaRapidFire !== 'undefined' && typeof FormulaRapidFire.renderView === 'function') {
    return FormulaRapidFire.renderView();
  }
  return `<div style="text-align:center; padding:40px;">Rapid Fire Sprint Loading...</div>`;
}

// 10. MISTAKE NOTEBOOK VIEW
function renderMistakesView() {
  if (typeof MistakeNotebook !== 'undefined' && typeof MistakeNotebook.renderView === 'function') {
    return MistakeNotebook.renderView();
  }
  return `<div style="text-align:center; padding:40px;">Mistake Notebook Loading...</div>`;
}

// 11. FLASHCARDS VIEW
function renderFlashcardsView() {
  const cards = typeof FLASHCARDS_DATA !== 'undefined' ? FLASHCARDS_DATA : [];
  return `
    <div style="margin-bottom:20px; text-align:center;">
      <h2 style="font-size:22px; font-weight:800; margin-bottom:4px;">🗂️ Spaced Repetition Flashcards</h2>
      <p style="font-size:13px; color:var(--text-muted);">Scientific active recall for tough formulas and derivations.</p>
    </div>
    <div class="flashcard-wrapper">
      <div class="flashcard-box" onclick="this.classList.toggle('flipped')">
        <div class="flashcard-category">Physics · Rotational Mechanics</div>
        <div class="flashcard-content">
          What is the Moment of Inertia of a solid cylinder of mass M and radius R about its longitudinal axis?
        </div>
        <div class="flashcard-footer">💡 Click to reveal answer & formula derivation</div>
      </div>
      <div style="display:flex; justify-content:center; gap:10px; margin-top:20px;">
        <button class="btn ghost btn-sm" style="color:var(--brand-rose);">Again (1d)</button>
        <button class="btn ghost btn-sm" style="color:var(--brand-amber);">Hard (2d)</button>
        <button class="btn ghost btn-sm" style="color:var(--brand-emerald);">Good (4d)</button>
        <button class="btn ghost btn-sm" style="color:var(--brand-sky);">Easy (7d)</button>
      </div>
    </div>
  `;
}

// 12. FOCUS POMODORO ROOM
function renderFocusView() {
  const studyStats = getStudyStats();
  const session = window.activeStudySession;

    let totalTests = 0;
    let totalAttempted = 0;
    let totalCorrect = 0;
    let avgAccuracy = 0;

    if (window.appState && window.appState.testHistory && window.appState.testHistory.length > 0) {
      totalTests = window.appState.testHistory.length;
      window.appState.testHistory.forEach(t => {
        totalAttempted += (t.correctCount || 0) + (t.wrongCount || 0);
        totalCorrect += (t.correctCount || 0);
      });
      if (totalTests > 0) {
        avgAccuracy = Math.round(window.appState.testHistory.reduce((acc, t) => acc + (t.accuracy || 0), 0) / totalTests);
      }
    }
  
  return `
    <div style="max-width:540px; margin:0 auto; text-align:center; padding:20px 0;">
      <div style="font-size:44px; margin-bottom:8px;"><i class="ph-fill ph-headphones"></i></div>
      <h2 style="font-size:24px; font-weight:800; margin-bottom:4px;">Deep Work Pomodoro Room</h2>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom:24px;">Zero distraction AIIMS focus chamber with live study tracker.</p>
      
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:20px; padding:36px 24px; box-shadow:var(--shadow-md); margin-bottom:20px;">
        <div style="font-size:12px; font-weight:700; color:var(--brand-sky); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">
          Active Study Session
        </div>
        <div style="font-family:'JetBrains Mono', monospace; font-size:42px; font-weight:800; color:var(--text-heading); margin-bottom:18px;">
          ${formatStudySeconds(session.seconds)}
        </div>
        <div style="display:flex; justify-content:center; gap:12px;">
          <button class="btn ${session.isRunning ? 'gold' : 'primary'}" onclick="toggleStudySession()">
            ${session.isRunning ? '⏸️ Pause Session' : '<i class="ph-fill ph-play-circle"></i>️ Start Deep Study'}
          </button>
        </div>
      </div>
    </div>
  `;
}

// 13. CERTIFICATE GENERATOR VIEW
function renderCertificateView() {
  if (typeof CertificateEngine !== 'undefined' && typeof CertificateEngine.renderView === 'function') {
    return CertificateEngine.renderView();
  }
  return `<div style="text-align:center; padding:40px;">Certificate Engine Loading...</div>`;
}

// 14. UPDATES & BACKUP VIEW
function renderUpdatesView() {
  return `
    <div style="max-width:600px; margin:0 auto; padding:10px 0;">
      <h2 style="font-size:22px; font-weight:800; margin-bottom:4px;">💾 Data Backup & Restore</h2>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom:20px;">Export your complete preparation progress to JSON or restore anytime.</p>
      
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; padding:20px; margin-bottom:16px;">
        <h4 style="font-size:14px; font-weight:800; margin-bottom:8px;">Export State:</h4>
        <button class="btn primary" onclick="const blob = new Blob([JSON.stringify(appState, null, 2)], {type: 'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'neet_OS_BACKUP.json'; a.click(); showToast('💾 Backup downloaded!');">
          <i class="ph-fill ph-download-simple"></i> Download JSON Backup
        </button>
      </div>

      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; padding:20px;">
        <h4 style="font-size:14px; font-weight:800; margin-bottom:8px;">Restore State:</h4>
        <input type="file" id="restoreFile" accept=".json" style="margin-bottom:12px; font-size:12px; color:var(--text-muted);">
        <div>
          <button class="btn ghost btn-sm" onclick="const file = document.getElementById('restoreFile').files[0]; if(file){ const reader = new FileReader(); reader.onload = e => { try { appState = JSON.parse(e.target.result); saveState(); renderApp(); alert('<i class="ph-fill ph-confetti"></i> Backup restored successfully!'); } catch(err) { alert('Invalid file format'); } }; reader.readAsText(file); }">
            📤 Restore from File
          </button>
        </div>
      </div>
    </div>
  `;
}

// ================= NEW ADVANCED NEET STUDY POWERHOUSES =================

function renderPYQHeatmapView() {
  const data = window.PYQHeatmapData || { physics: [], chemistry: [], botany: [], zoology: [] };
  const isHindi = appState.lang === 'hindi';

  const renderSubjectSection = (subjName, icon, chapters, color) => `
    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; padding:18px; margin-bottom:20px;">
      <h3 style="font-size:17px; font-weight:800; color:${color}; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
        <span>${icon}</span> <span>${subjName}</span>
      </h3>
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${chapters.map(ch => `
          <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-left:4px solid ${ch.yieldCategory === 'golden' ? 'var(--brand-emerald)' : 'var(--brand-gold)'}; border-radius:10px; padding:14px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
              <div>
                <strong style="font-size:14px; color:var(--text-main);">${isHindi ? ch.hindi : ch.chapter}</strong>
                <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Class ${ch.class} · Trend: <span style="color:var(--brand-sky); font-weight:700;">${ch.trend}</span></div>
              </div>
              <div style="display:flex; gap:6px;">
                <span class="tag-badge ${ch.yieldCategory === 'golden' ? 'tag-high' : 'tag-adv'}" style="font-size:10px;">
                  ${ch.yieldCategory === 'golden' ? '🌟 HIGH ROI / LOW EFFORT' : '⚓ ANCHOR PILLAR'}
                </span>
              </div>
            </div>
            
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:8px; margin:10px 0; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px;">
              <div><span style="font-size:10px; color:var(--text-muted);">Avg Qs / Shift:</span> <strong style="font-size:12px; color:var(--brand-gold);">${ch.avgQuestionsPerPaper} Qs</strong></div>
              <div><span style="font-size:10px; color:var(--text-muted);">Avg Marks:</span> <strong style="font-size:12px; color:var(--brand-emerald);">~${ch.avgMarks} Marks</strong></div>
              <div><span style="font-size:10px; color:var(--text-muted);">10-Yr Total Qs:</span> <strong style="font-size:12px; color:var(--brand-sky);">${ch.pyq10YearCount} Qs</strong></div>
              <div><span style="font-size:10px; color:var(--text-muted);">Difficulty:</span> <strong style="font-size:12px;">${ch.difficulty}</strong></div>
            </div>

            <div style="font-size:11px; color:var(--text-muted);">
              <i class="ph-fill ph-target"></i> <strong>Top Scoring Concepts:</strong> ${ch.highFrequencyTopics.join(' · ')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  return `
    <div style="max-width:960px; margin:0 auto; padding:10px 0;">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
        <button class="btn ghost btn-sm" onclick="navigateView('home')">← Back to Home</button>
        <h2 style="font-size:22px; font-weight:800; margin:0;"><i class="ph-fill ph-fire"></i> 10-Year PYQ Weightage Heatmap (2015-2025)</h2>
      </div>
      <p style="color:var(--text-muted); font-size:13px; margin-bottom:20px;">
        Analyzed across 142 official NTA NEET & Advanced shifts. Focus on <strong>High ROI Chapters</strong> to guarantee 100+ marks with minimum hours.
      </p>

      ${renderSubjectSection('Physics 10-Yr Weightage', '<i class="ph-fill ph-atom"></i>', data.physics, 'var(--brand-cyan)')}
      ${renderSubjectSection('Chemistry 10-Yr Weightage', '🧪', data.chemistry, 'var(--brand-rose)')}
      ${renderSubjectSection('Botany 10-Yr Weightage', '🌿', data.botany || [], 'var(--brand-emerald)')}
      ${renderSubjectSection('Zoology 10-Yr Weightage', '🦁', data.zoology || [], 'var(--brand-gold)')}
    </div>
  `;
}

// 2. 1-Page Cheat Sheets View
function renderCheatSheetsView() {
  const engine = window.CheatSheetEngine;
  if (!engine) return `<div>Loading Cheat Sheets...</div>`;

  return `
    <div style="max-width:960px; margin:0 auto; padding:10px 0;">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
        <button class="btn ghost btn-sm" onclick="navigateView('home')">← Back to Home</button>
        <h2 style="font-size:22px; font-weight:800; margin:0;"><i class="ph-fill ph-file-text"></i> 1-Page Topper Formula Cheat-Sheets</h2>
      </div>
      <p style="color:var(--text-muted); font-size:13px; margin-bottom:20px;">
        High-density equation summaries, reaction roadmaps, and pro-tips for instant revision. Printable in 1 click.
      </p>

      <div style="display:flex; flex-direction:column; gap:20px;">
        ${engine.sheets.map(sheet => `
          <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; padding:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
              <div>
                <span class="tag-badge tag-high" style="font-size:10px;">${sheet.badge}</span>
                <h3 style="font-size:17px; font-weight:800; margin:4px 0 0;">${sheet.title}</h3>
              </div>
              <button class="btn ghost btn-sm" onclick="CheatSheetEngine.printSheet('${sheet.id}')">
                🖨️ Print / Save PDF
              </button>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">
              ${sheet.cards.map(c => `
                <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:10px; padding:14px;">
                  <h4 style="font-size:13.5px; font-weight:700; color:var(--brand-sky); margin-bottom:8px;">${c.heading}</h4>
                  <div style="font-family:'JetBrains Mono', monospace; font-size:12px; background:rgba(0,0,0,0.3); padding:10px; border-radius:6px; margin-bottom:8px; line-height:1.5;">
                    ${c.formulas.join('<br>')}
                  </div>
                  <div style="font-size:11.5px; color:var(--text-muted); line-height:1.4; border-left:2px solid var(--brand-gold); padding-left:8px;">
                    💡 <strong>Pro Tip:</strong> ${c.tip}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 3. AIIMS AIIMS / NIT Cutoff Explorer View
function renderAiimsView() {
  const explorer = window.AIIMSExplorer;
  const colleges = (explorer && explorer.colleges) || [];

  return `
    <div style="max-width:960px; margin:0 auto; padding:10px 0;">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
        <button class="btn ghost btn-sm" onclick="navigateView('home')">← Back to Home</button>
        <h2 style="font-size:22px; font-weight:800; margin:0;"><i class="ph-fill ph-bank"></i> AIIMS AIIMS & NIT Cutoff Matrix</h2>
      </div>

      <!-- Rank / Score Live Filter Bar -->
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; padding:16px; margin-bottom:20px; display:flex; gap:14px; flex-wrap:wrap; align-items:center;">
        <div style="flex:1; min-width:200px;">
          <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Enter Your Expected AIIMS / Main Rank:</label>
          <input type="number" id="aiimsUserRank" placeholder="e.g. 1250" class="num-display" style="font-size:14px; padding:8px 12px; width:100%;" oninput="renderApp()">
        </div>
        <div style="min-width:160px;">
          <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Category Quota:</label>
          <select id="aiimsCategory" class="lang-select" style="width:100%; padding:9px;" onchange="renderApp()">
            <option value="open">General / OPEN</option>
            <option value="obc">OBC-NCL</option>
            <option value="ews">GEN-EWS</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
          </select>
        </div>
      </div>

      <!-- College List -->
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${colleges.map(col => {
          const rankVal = parseInt(document.getElementById('aiimsUserRank')?.value || '0', 10);
          const cat = document.getElementById('aiimsCategory')?.value || 'open';

          return `
            <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; padding:18px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; flex-wrap:wrap; gap:6px;">
                <div>
                  <h3 style="font-size:17px; font-weight:800; margin:0 0 2px;">${col.name}</h3>
                  <div style="font-size:11.5px; color:var(--text-muted);">${col.city} · NIRF Rank #${col.nirf}</div>
                </div>
                <span class="tag-badge ${col.type === 'AIIMS' ? 'tag-high' : 'tag-adv'}">${col.type}</span>
              </div>

              <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; font-size:12.5px;">
                  <thead>
                    <tr style="border-bottom:1px solid var(--border-color); text-align:left; color:var(--text-muted);">
                      <th style="padding:8px 6px;">Branch Name</th>
                      <th style="padding:8px 6px;">Opening Rank</th>
                      <th style="padding:8px 6px;">Closing Rank (${cat.toUpperCase()})</th>
                      <th style="padding:8px 6px;">Your Chance</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${col.branches.map(b => {
                      let closeR = b.closeRank;
                      if (cat === 'obc') closeR = b.obcClose || Math.round(b.closeRank * 0.4);
                      if (cat === 'ews') closeR = b.ewsClose || Math.round(b.closeRank * 0.2);
                      if (cat === 'sc') closeR = b.scClose || Math.round(b.closeRank * 0.25);
                      if (cat === 'st') closeR = b.stClose || Math.round(b.closeRank * 0.12);

                      const chance = AIIMSExplorer.getChanceLabel(rankVal, closeR);

                      return `
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                          <td style="padding:8px 6px; font-weight:600;">${b.name}</td>
                          <td style="padding:8px 6px; font-family:'JetBrains Mono', monospace;">${b.openRank}</td>
                          <td style="padding:8px 6px; font-family:'JetBrains Mono', monospace; color:var(--brand-sky); font-weight:700;">${closeR}</td>
                          <td style="padding:8px 6px; font-weight:700; color:${chance.color};">${chance.label}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// 4. Speed Math & Calculation Drill View
function renderSpeedMathView() {
  const engine = window.SpeedMathEngine;
  if (!engine) return `<div>Loading Speed Math...</div>`;

  return `
    <div style="max-width:800px; margin:0 auto; padding:10px 0;">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
        <button class="btn ghost btn-sm" onclick="navigateView('home')">← Back to Home</button>
        <h2 style="font-size:22px; font-weight:800; margin:0;"><i class="ph-fill ph-calculator"></i> 60s Speed Math & Constants Trainer</h2>
      </div>
      <p style="color:var(--text-muted); font-size:13px; margin-bottom:20px;">
        Train high-speed mental calculations, standard Physics constants ($hc, k, R, g$), and trigonometry values to save 15+ minutes in NEET.
      </p>

      <!-- Category Selectors -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:10px; margin-bottom:20px;">
        ${engine.DRILL_TYPES.map(d => `
          <button class="btn ghost" style="padding:12px; font-size:12px; justify-content:center; text-align:center;" onclick="SpeedMathEngine.startDrill('${d.id}')">
            <span>${d.icon}</span> <span>${d.name}</span>
          </button>
        `).join('')}
      </div>

      <div id="speedMathContainer">
        <div style="text-align:center; padding:30px 16px; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:16px;">
          <div style="font-size:44px; margin-bottom:12px;"><i class="ph-fill ph-lightning"></i></div>
          <h3 style="font-size:20px; font-weight:800; margin-bottom:8px;">Ready for the 60-Second Calculation Sprint?</h3>
          <p style="color:var(--text-muted); font-size:13px; margin-bottom:18px;">Pick a category above or launch the Mixed Speed Sprint.</p>
          <button class="btn btn-gold" style="padding:12px 28px; font-size:15px; font-weight:800;" onclick="SpeedMathEngine.startDrill('mixed')">
            <i class="ph-fill ph-rocket"></i> Launch 60s Rapid Drill
          </button>
        </div>
      </div>
    </div>
  `;
}

// 5. Audio Podcast Revision View
function renderAudioPodcastView() {
  const engine = window.AudioPodcastEngine;
  if (!engine) return `<div>Loading Audio Podcast...</div>`;

  return `
    <div style="max-width:800px; margin:0 auto; padding:10px 0;">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
        <button class="btn ghost btn-sm" onclick="navigateView('home')">← Back to Home</button>
        <h2 style="font-size:22px; font-weight:800; margin:0;">🎙️ Hands-Free Audio Revision & Podcast</h2>
      </div>
      <p style="color:var(--text-muted); font-size:13px; margin-bottom:20px;">
        Listen to high-yield audio summaries of Inorganic Chemistry, Physics Laws & Maths formulas with natural voice narration.
      </p>

      <!-- Player Controls Bar -->
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:16px; padding:18px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="font-size:11px; color:var(--text-muted);">NOW PLAYING</div>
          <strong id="podcastNowPlaying" style="font-size:14px; color:var(--brand-sky);">Select an episode below to begin</strong>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <button id="podcastPlayPauseBtn" class="btn btn-primary btn-sm" onclick="AudioPodcastEngine.pauseOrResume()"><i class="ph-fill ph-play-circle"></i>️ Play</button>
          <button class="btn btn-ghost btn-sm" onclick="AudioPodcastEngine.stop()">⏹️ Stop</button>
          <div style="display:flex; gap:4px;">
            <button class="btn btn-ghost btn-sm speed-pill-btn active" data-speed="1.0" onclick="AudioPodcastEngine.setSpeed(1.0)">1x</button>
            <button class="btn btn-ghost btn-sm speed-pill-btn" data-speed="1.25" onclick="AudioPodcastEngine.setSpeed(1.25)">1.25x</button>
            <button class="btn btn-ghost btn-sm speed-pill-btn" data-speed="1.5" onclick="AudioPodcastEngine.setSpeed(1.5)">1.5x</button>
          </div>
        </div>
      </div>

      <!-- Episode List -->
      <div style="display:flex; flex-direction:column; gap:14px;">
        ${engine.EPISODES.map(ep => `
          <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:12px; padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <div>
                <span class="tag-badge tag-adv" style="font-size:10px;">${ep.subject} · ${ep.duration}</span>
                <h4 style="font-size:15px; font-weight:800; margin:6px 0 2px;">${ep.title}</h4>
              </div>
              <button class="btn btn-gold btn-sm" onclick="AudioPodcastEngine.playEpisode('${ep.id}')">
                <i class="ph-fill ph-play-circle"></i>️ Play Episode
              </button>
            </div>
            <ul style="padding-left:18px; font-size:12px; color:var(--text-muted); margin:0;">
              ${ep.keyPoints.map(k => `<li>${k}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 6. AI Problem Solver & Daily DPP View
function renderProblemSolverView() {
  const engine = window.ProblemSolverEngine;
  if (!engine) return `<div>Loading Problem Solver...</div>`;

  const dppQuestions = engine.generateDailyDPP();

  return `
    <div style="max-width:960px; margin:0 auto; padding:10px 0;">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
        <button class="btn ghost btn-sm" onclick="navigateView('home')">← Back to Home</button>
        <h2 style="font-size:22px; font-weight:800; margin:0;">🤖 AI Problem Explainer & Daily Weak-Area DPP</h2>
      </div>

      <!-- Section 1: Daily 5-Question DPP -->
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:16px; padding:20px; margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
          <div>
            <span class="tag-badge tag-high"><i class="ph-fill ph-target"></i> PERSONALIZED PRACTICE</span>
            <h3 style="font-size:18px; font-weight:800; margin:4px 0 0;">Today's 5-Question Weak-Area Booster DPP</h3>
          </div>
          <button class="btn btn-primary btn-sm" onclick="navigateView('tests'); if(window.MockEngine) MockEngine.startLevelTest(1);">
            <i class="ph-fill ph-rocket"></i> Launch DPP Test
          </button>
        </div>
        <p style="font-size:12.5px; color:var(--text-muted); margin-bottom:12px;">
          Auto-generated based on error logs in your Mistake Notebook.
        </p>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${dppQuestions.map((q, idx) => `
            <div style="background:var(--bg-surface); padding:10px 14px; border-radius:8px; border:1px solid var(--border-color); font-size:13px; display:flex; justify-content:space-between; align-items:center;">
              <div><strong>Q${idx+1}:</strong> ${q.question || q.text || 'High-Yield Concept Question'}</div>
              <span style="font-size:11px; color:var(--brand-sky); font-weight:700;">${q.subject || 'PCM'}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section 2: Step-by-Step Advanced Problem Deconstructors -->
      <h3 style="font-size:18px; font-weight:800; margin-bottom:14px;">
        <i class="ph-fill ph-lightning"></i> Legendary AIIMS Problem Deconstruction
      </h3>
      <div style="display:flex; flex-direction:column; gap:20px;">
        ${engine.SAMPLE_PROBLEMS.map(p => `
          <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:16px; padding:20px;">
            <span class="tag-badge tag-adv">${p.source}</span>
            <h4 style="font-size:16px; font-weight:800; margin:8px 0 10px;">${p.title}</h4>
            <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:10px; padding:14px; font-size:13.5px; margin-bottom:16px; line-height:1.5;">
              ${p.problemText}
            </div>

            <div style="display:flex; flex-direction:column; gap:12px;">
              ${p.steps.map(s => `
                <div style="background:rgba(0,0,0,0.25); border-left:3px solid var(--brand-sky); border-radius:8px; padding:12px;">
                  <strong style="font-size:13px; color:var(--brand-sky);">${s.title}</strong>
                  <div style="font-size:12.5px; color:var(--text-main); margin-top:4px; line-height:1.5;">
                    ${s.content}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Main Render Dispatcher
function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  switch (currentView) {
    case 'home':
      app.innerHTML = renderHomeView();
      break;
    case 'books':
      app.innerHTML = renderBooksView();
      break;
    case 'videos':
      app.innerHTML = renderVideosView();
      break;
    case 'tests':
      app.innerHTML = renderTestsView();
      break;
    case 'more':
      app.innerHTML = renderMoreView();
      break;
    case 'heatmap':
      app.innerHTML = renderPYQHeatmapView();
      break;
    case 'cheatsheets':
      app.innerHTML = renderCheatSheetsView();
      break;
    case 'aiims':
      app.innerHTML = renderAiimsView();
      break;
    case 'speedmath':
      app.innerHTML = renderSpeedMathView();
      break;
    case 'podcast':
      app.innerHTML = renderAudioPodcastView();
      break;
    case 'solver':
      app.innerHTML = renderProblemSolverView();
      break;
    case 'scientists':
      app.innerHTML = renderScientistsView();
      break;
    case 'predictor':
      app.innerHTML = renderPredictorView();
      break;
    case 'notes':
      app.innerHTML = renderNotesView();
      break;
    case 'rapid-fire':
      app.innerHTML = renderRapidFireView();
      break;
    case 'mistakes':
      app.innerHTML = renderMistakesView();
      break;
    case 'flashcards':
      app.innerHTML = renderFlashcardsView();
      break;
    case 'focus':
      app.innerHTML = renderFocusView();
      break;
    case 'certificate':
      app.innerHTML = renderCertificateView();
      break;
    case 'updates':
      app.innerHTML = renderUpdatesView();
      break;
    default:
      app.innerHTML = renderHomeView();
  }
}
window.renderApp = renderApp;
window.renderHomeView = renderHomeView;

// Initial Boot
function initNEETApp() {
  // Setup theme
  if (appState.profile && appState.profile.theme === 'light') {
    document.body.classList.add('light');
  }
  // Setup language selector
  const langSelect = document.getElementById('globalLangSelect');
  if (langSelect && appState.lang) {
    langSelect.value = appState.lang;
  }
  // Setup exam mode pills
  const mode = (appState.profile && appState.profile.examMode) || 'main';
  const btnMain = document.getElementById('modePillMain');
  const btnAdv = document.getElementById('modePillAdv');
  if (btnMain && btnAdv) {
    btnMain.className = mode === 'main' ? 'mode-pill-btn active-main' : 'mode-pill-btn';
    btnAdv.className = mode === 'advanced' ? 'mode-pill-btn active-adv' : 'mode-pill-btn';
  }
  // Setup tab event listeners
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.view) navigateView(btn.dataset.view);
    });
  });

  // Initialize Gamification & Daily Streaks
  if (window.GamificationEngine && typeof window.GamificationEngine.updateDailyStreak === 'function') {
    window.GamificationEngine.updateDailyStreak();
  }

  // Initialize Authentication & Cloud Sync
  if (window.ClerkAuth && typeof window.ClerkAuth.init === 'function') {
    window.ClerkAuth.init();
  }

  // Listen for auth state change
  window.addEventListener('neet-auth-state-changed', () => {
    renderApp();
  });

  renderApp();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initNEETApp);
} else {
  initNEETApp();
}



// ==========================================
// MONGODB CLOUD SYNC
// ==========================================
window.syncWithCloud = async function() {
  const currentUid = (typeof ClerkAuth !== 'undefined' && ClerkAuth.currentUser && ClerkAuth.currentUser.id) 
    ? ClerkAuth.currentUser.id 
    : (window.appState && window.appState.profile && window.appState.profile.id) || null;
    
  if (currentUid && currentUid !== 'guest') {
    try {
      const res = await fetch(`/api/progress/${currentUid}`);
      const data = await res.json();
      if (data.success && data.appState) {
        // Merge cloud state into local state
        window.appState = { ...window.appState, ...data.appState };
        localStorage.setItem(window.NEET_STORAGE_KEY, JSON.stringify(window.appState));
        if (typeof renderApp === 'function') renderApp();
        console.log('Cloud Sync Complete: State Restored from MongoDB');
      }
    } catch (err) {
      console.warn('Failed to fetch state from MongoDB', err);
    }
  }
};

// Call sync immediately after init
setTimeout(() => window.syncWithCloud(), 1000);
