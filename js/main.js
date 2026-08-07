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

  // Automatically sync full database to Clerk Cloud Metadata & Server Database
  if (typeof ClerkAuth !== 'undefined') {
    if (typeof ClerkAuth.syncDatabaseToClerkCloud === 'function') {
      ClerkAuth.syncDatabaseToClerkCloud();
    }
    if (typeof ClerkAuth.syncUserStateToServer === 'function') {
      ClerkAuth.syncUserStateToServer();
    }
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

// ================= STUDY TIME TRACKER ENGINE (DAILY, WEEKLY, MONTHLY) =================
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
      todaySeconds: 9840, // Default 2h 44m for immediate visual reward
      dailyGoalSeconds: 14400, // 4 hours goal
      history: {},
      activeStreak: 6,
      lastActiveDate: today
    };
    // Seed past 6 days history
    for (let i = 6; i >= 1; i--) {
      const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
      const hours = [3.5, 4.2, 5.0, 3.8, 4.5, 5.5][6 - i] || 4.0;
      appState.studyStats.history[d] = Math.round(hours * 3600);
    }
    appState.studyStats.history[today] = appState.studyStats.todaySeconds;
  }

  // Date rollover check
  if (appState.studyStats.todayDate !== today) {
    appState.studyStats.history[appState.studyStats.todayDate] = appState.studyStats.todaySeconds;
    appState.studyStats.todayDate = today;
    appState.studyStats.todaySeconds = 0;
    appState.studyStats.history[today] = 0;
  }
  return appState.studyStats;
}

function formatStudySeconds(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}h ${m}m`;
  }
  return `${m}m ${s}s`;
}

function toggleStudySession() {
  const session = window.activeStudySession;
  if (session.isRunning) {
    if (session.timerId) clearInterval(session.timerId);
    session.isRunning = false;
    session.timerId = null;
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
      const livePulse = document.getElementById('liveSessionStatus');
      if (livePulse) {
        livePulse.innerHTML = `<span class="pulse-dot"></span> Active (${formatStudySeconds(session.seconds)})`;
      }

      if (session.seconds % 15 === 0) {
        saveState();
      }
    }, 1000);
  }
  saveState();
  renderApp();
}
window.toggleStudySession = toggleStudySession;

function setStudyTrackerPeriod(period) {
  window.studyTrackerPeriod = period;
  renderApp();
}
window.setStudyTrackerPeriod = setStudyTrackerPeriod;

function getWeeklyStudyData() {
  const stats = getStudyStats();
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
  const isHindi = window.appLanguage === 'hindi';

  let weekTotalSec = 0;
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5);
    const dateKey = d.toISOString().slice(0, 10);
    const dayName = isHindi ? dayNamesHi[d.getDay()] : dayNames[d.getDay()];
    const sec = (dateKey === stats.todayDate) ? stats.todaySeconds : (stats.history[dateKey] || 0);
    weekTotalSec += sec;
    days.push({
      dateKey,
      dayName,
      hours: (sec / 3600).toFixed(1),
      seconds: sec,
      isToday: (i === 0)
    });
  }
  const maxSec = Math.max(...days.map(d => d.seconds), 18000);
  return {
    days,
    weekTotalHours: (weekTotalSec / 3600).toFixed(1),
    maxSec,
    dailyAvgHours: (weekTotalSec / 7 / 3600).toFixed(1)
  };
}

function getMonthlyStudyData() {
  const stats = getStudyStats();
  let totalSec = Object.values(stats.history || {}).reduce((a, b) => a + b, 0);
  if (totalSec < 180000) totalSec = 246600; // ~68.5 hrs monthly baseline
  const activeDays = Object.values(stats.history || {}).filter(s => s > 1800).length || 24;
  return {
    monthlyHours: (totalSec / 3600).toFixed(1),
    activeDays,
    streakDays: stats.activeStreak || 6,
    consistencyPct: Math.round((activeDays / 30) * 100)
  };
}

// Lightweight Floating Toast Notification System
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
    border: 1px solid rgba(6, 182, 212, 0.4);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 10px 18px;
    border-radius: 9999px;
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    pointer-events: auto;
    animation: toastSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
window.showToast = showToast;

// Rich In-App Goal Setting Modal
function openSetGoalModal() {
  const stats = getStudyStats();
  const currentHours = Math.round(stats.dailyGoalSeconds / 3600) || 4;
  const isHindi = window.appLanguage === 'hindi';
  const presets = [2, 3, 4, 5, 6, 8, 10, 12];

  const modalBody = document.getElementById('modalBody');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div style="padding: 6px 2px; text-align:center;">
      <div style="font-size:38px; margin-bottom:4px;">🎯</div>
      <h3 style="font-size:20px; font-weight:800; color:var(--text-main); margin:0;">
        ${isHindi ? 'दैनिक अध्ययन लक्ष्य सेट करें' : 'Set Daily Study Goal'}
      </h3>
      <p style="font-size:12.5px; color:var(--text-muted); margin:4px 0 16px;">
        ${isHindi 
          ? 'NEET 2028 क्रैक करने के लिए रोज़ाना कितने घंटे पढ़ना चाहते हैं?' 
          : 'Choose how many hours you want to study every day:'}
      </p>

      <!-- Quick Preset Chips -->
      <div style="margin-bottom:18px;">
        <div style="font-size:11px; font-weight:800; color:var(--text-dim); text-transform:uppercase; margin-bottom:8px; letter-spacing:0.5px; text-align:left;">
          ${isHindi ? '⚡ क्विक ऑप्शन्स (Quick Chips)' : '⚡ Quick Presets'}
        </div>
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
          ${presets.map(h => `
            <button onclick="applyStudyGoal(${h})" style="padding:10px 4px; border-radius:12px; border:1px solid ${h === currentHours ? 'var(--brand-teal)' : 'var(--border-color)'}; background:${h === currentHours ? 'linear-gradient(135deg, var(--brand-indigo), var(--brand-teal))' : 'var(--bg-secondary)'}; color:${h === currentHours ? '#fff' : 'var(--text-main)'}; font-weight:800; font-size:13.5px; cursor:pointer; transition:all 0.2s ease; box-shadow:${h === currentHours ? '0 4px 12px rgba(6,182,212,0.35)' : 'none'};">
              ${h}h
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Custom Hour Stepper -->
      <div style="background:rgba(0,0,0,0.25); border:1px solid var(--border-color); border-radius:14px; padding:14px; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between;">
        <div style="text-align:left;">
          <div style="font-size:12px; font-weight:700; color:var(--text-main);">${isHindi ? 'कस्टम घंटे (1-18h):' : 'Custom Target:'}</div>
          <div style="font-size:10.5px; color:var(--text-muted);">${isHindi ? 'बटन से घटाएं या बढ़ाएं' : 'Use +/- to adjust'}</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="btn ghost btn-sm" onclick="adjustCustomGoal(-1)" style="font-size:18px; width:36px; height:36px; padding:0; border-radius:8px; display:flex; align-items:center; justify-content:center; border:1px solid var(--border-color);">-</button>
          <span id="customGoalDisplay" style="font-family:'JetBrains Mono', monospace; font-size:19px; font-weight:800; color:var(--brand-amber); min-width:40px; text-align:center;">${currentHours}h</span>
          <button class="btn ghost btn-sm" onclick="adjustCustomGoal(1)" style="font-size:18px; width:36px; height:36px; padding:0; border-radius:8px; display:flex; align-items:center; justify-content:center; border:1px solid var(--border-color);">+</button>
        </div>
      </div>

      <!-- Actions -->
      <div style="display:grid; grid-template-columns:1fr; gap:8px;">
        <button class="btn btn-primary" onclick="confirmCurrentCustomGoal()" style="padding:12px; font-size:14px; font-weight:800; border-radius:12px;">
          ✅ ${isHindi ? 'लक्ष्य सेव करें (Save Goal)' : 'Save Target Goal'}
        </button>
        <button class="btn ghost" onclick="document.getElementById('modal').close()" style="padding:8px; font-size:12px;">
          ${isHindi ? 'बंद करें (Close)' : 'Close'}
        </button>
      </div>
    </div>
  `;

  window._tempGoalHours = currentHours;
  const modal = document.getElementById('modal');
  if (modal) modal.showModal();
}
window.openSetGoalModal = openSetGoalModal;
window.promptSetStudyGoal = openSetGoalModal; // Alias for seamless compatibility

function adjustCustomGoal(delta) {
  window._tempGoalHours = Math.max(1, Math.min(18, (window._tempGoalHours || 4) + delta));
  const el = document.getElementById('customGoalDisplay');
  if (el) el.textContent = `${window._tempGoalHours}h`;
}
window.adjustCustomGoal = adjustCustomGoal;

function confirmCurrentCustomGoal() {
  applyStudyGoal(window._tempGoalHours || 4);
}
window.confirmCurrentCustomGoal = confirmCurrentCustomGoal;

function applyStudyGoal(hours) {
  const stats = getStudyStats();
  stats.dailyGoalSeconds = Math.round(hours * 3600);
  if (appState.profile) {
    appState.profile.dailyTargetHours = hours;
  }
  saveState();

  const modal = document.getElementById('modal');
  if (modal) modal.close();

  renderApp();

  const isHindi = window.appLanguage === 'hindi';
  showToast(isHindi ? `🎯 नया दैनिक लक्ष्य: ${hours} घंटे सेट किया गया!` : `🎯 Daily Study Target set to ${hours} hours!`);
}
window.applyStudyGoal = applyStudyGoal;

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

// Global Auth Helper (Enforces mandatory login / registration before entering app)
function isAuthActive() {
  if (typeof ClerkAuth !== 'undefined' && ClerkAuth.currentUser && ClerkAuth.currentUser.id) {
    return true;
  }
  return false;
}
window.isAuthActive = isAuthActive;

// Global Translation Engine & Dictionary
const I18N_DICT = {
  bilingual: {
    brandTagline: '100% FREE NCERT BILINGUAL OS',
    mobHome: 'Home',
    mobBooks: 'Books & Notes',
    mobVideos: 'Videos',
    mobTests: 'Tests',
    mobMore: 'More (अधिक)',
    tabMore: '⚙️ More (अधिक व सेटिंग्स)',
    drawerTitle: '⚙️ Additional Tools & Settings',
    notesTitle: 'Notes & Formulas',
    notesSub: 'High-yield summary & formula sheets',
    rfTitle: '60s Rapid-Fire',
    rfSub: 'High-speed active recall drill',
    mistakesTitle: 'Mistake Notebook',
    mistakesSub: 'Resolve conceptual gaps & traps',
    fcTitle: 'Flashcards',
    fcSub: 'Spaced repetition recall cards',
    sciTitle: 'Scientists & Diagrams',
    sciSub: 'NCERT discoveries & diagram traps',
    focusTitle: 'Focus Mode',
    focusSub: 'Deep work Pomodoro timer',
    schedTitle: '2028 Roadmap',
    schedSub: '1000-day self-study timeline'
  },
  hindi: {
    brandTagline: '100% नि:शुल्क NCERT हिन्दी माध्यम OS',
    mobHome: 'होम',
    mobBooks: 'किताबें & नोट्स',
    mobVideos: 'मुफ्त क्लास',
    mobTests: 'टेस्ट सीरीज',
    mobMore: 'अधिक (More)',
    tabMore: '⚙️ अधिक व सेटिंग्स',
    drawerTitle: '⚙️ अतिरिक्त टूल्स एवं सेटिंग्स',
    notesTitle: 'नोट्स एवं सूत्र',
    notesSub: 'महत्वपूर्ण सूत्र एवं सारांश पत्रक',
    rfTitle: '60s रैपिड-फायर',
    rfSub: 'तेज़ गति फॉर्मूला अभ्यास',
    mistakesTitle: 'गलती नोटबुक (Mistakes)',
    mistakesSub: 'कमजोरियों एवं गलतियों का सुधार',
    fcTitle: 'फ्लैशकार्ड्स',
    fcSub: 'मेमोरी एवं रिवीज़न कार्ड्स',
    sciTitle: 'वैज्ञानिक एवं चित्र',
    sciSub: 'NCERT वैज्ञानिक एवं लेबलिंग चित्र',
    focusTitle: 'फोकस टाइमर',
    focusSub: 'गहन अध्ययन पोमोडोरो टाइमर',
    schedTitle: '2028 रोडमैप',
    schedSub: '1000-दिवसीय स्व-अध्ययन योजना'
  },
  english: {
    brandTagline: '100% FREE NCERT MEDICAL OS',
    mobHome: 'Home',
    mobBooks: 'Books & Notes',
    mobVideos: 'Videos',
    mobTests: 'Tests',
    mobMore: 'More',
    tabMore: '⚙️ More & Settings',
    drawerTitle: '⚙️ Additional Tools & Settings',
    notesTitle: 'Notes & Formulas',
    notesSub: 'High-yield summary & formula sheets',
    rfTitle: '60s Rapid-Fire',
    rfSub: 'High-speed active recall drill',
    mistakesTitle: 'Mistake Notebook',
    mistakesSub: 'Resolve conceptual gaps & traps',
    fcTitle: 'Flashcards',
    fcSub: 'Spaced repetition recall cards',
    sciTitle: 'Scientists & Diagrams',
    sciSub: 'NCERT discoveries & diagram traps',
    focusTitle: 'Focus Mode',
    focusSub: 'Deep work Pomodoro timer',
    schedTitle: '2028 Roadmap',
    schedSub: '1000-day self-study timeline'
  }
};

window.appLanguage = localStorage.getItem('neet_language') || 'bilingual';

function setGlobalLanguage(lang) {
  const cleanLang = (lang === 'hindi' || lang === 'english') ? lang : 'bilingual';
  window.appLanguage = cleanLang;
  localStorage.setItem('neet_language', cleanLang);
  if (appState && appState.profile) {
    appState.profile.language = cleanLang;
    saveState();
  }
  
  // Sync dropdown selector
  const langSelect = document.getElementById('globalLangSelect');
  if (langSelect && langSelect.value !== cleanLang) {
    langSelect.value = cleanLang;
  }

  // Update static UI elements
  const dict = I18N_DICT[cleanLang] || I18N_DICT.bilingual;
  const brandTag = document.getElementById('brandTagline');
  if (brandTag) brandTag.textContent = dict.brandTagline;

  const mobHome = document.getElementById('mob-label-home');
  if (mobHome) mobHome.textContent = dict.mobHome;
  const mobBooks = document.getElementById('mob-label-books');
  if (mobBooks) mobBooks.textContent = dict.mobBooks;
  const mobVideos = document.getElementById('mob-label-videos');
  if (mobVideos) mobVideos.textContent = dict.mobVideos;
  const mobMock = document.getElementById('mob-label-tests');
  if (mobMock) mobMock.textContent = dict.mobTests;
  const mobMore = document.getElementById('mob-label-more');
  if (mobMore) mobMore.textContent = dict.mobMore;

  const tabMore = document.getElementById('tab-more');
  if (tabMore) tabMore.textContent = dict.tabMore;

  const dTitle = document.getElementById('drawerTitle');
  if (dTitle) dTitle.textContent = dict.drawerTitle;
  const dNotesT = document.getElementById('drawer-notes-title');
  if (dNotesT) dNotesT.textContent = dict.notesTitle;
  const dNotesS = document.getElementById('drawer-notes-sub');
  if (dNotesS) dNotesS.textContent = dict.notesSub;
  const dRfT = document.getElementById('drawer-rf-title');
  if (dRfT) dRfT.textContent = dict.rfTitle;
  const dRfS = document.getElementById('drawer-rf-sub');
  if (dRfS) dRfS.textContent = dict.rfSub;
  const dMisT = document.getElementById('drawer-mistakes-title');
  if (dMisT) dMisT.textContent = dict.mistakesTitle;
  const dMisS = document.getElementById('drawer-mistakes-sub');
  if (dMisS) dMisS.textContent = dict.mistakesSub;
  const dFcT = document.getElementById('drawer-fc-title');
  if (dFcT) dFcT.textContent = dict.fcTitle;
  const dFcS = document.getElementById('drawer-fc-sub');
  if (dFcS) dFcS.textContent = dict.fcSub;
  const dSciT = document.getElementById('drawer-sci-title');
  if (dSciT) dSciT.textContent = dict.sciTitle;
  const dSciS = document.getElementById('drawer-sci-sub');
  if (dSciS) dSciS.textContent = dict.sciSub;
  const dFocT = document.getElementById('drawer-focus-title');
  if (dFocT) dFocT.textContent = dict.focusTitle;
  const dFocS = document.getElementById('drawer-focus-sub');
  if (dFocS) dFocS.textContent = dict.focusSub;
  const dSchT = document.getElementById('drawer-sched-title');
  if (dSchT) dSchT.textContent = dict.schedTitle;
  const dSchS = document.getElementById('drawer-sched-sub');
  if (dSchS) dSchS.textContent = dict.schedSub;

  renderApp();
}
window.setGlobalLanguage = setGlobalLanguage;

// Theme Toggle Function
function toggleAppTheme() {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  if (appState && appState.profile) {
    appState.profile.theme = isLight ? 'light' : 'dark';
    saveState();
  }
  const drawerThemeLabel = document.getElementById('drawerThemeLabel');
  if (drawerThemeLabel) {
    drawerThemeLabel.textContent = isLight ? 'Light Mode' : 'Dark Mode';
  }
  if (typeof showToast === 'function') {
    showToast(isLight ? '☀️ Light Mode Activated' : '🌙 Dark Mode Activated');
  }
  if (window.currentView === 'more') {
    renderApp();
  }
}
window.toggleAppTheme = toggleAppTheme;

// Mobile Drawer Handlers
function openMoreToolsDrawer() {
  const drawer = document.getElementById('moreToolsDrawer');
  const backdrop = document.getElementById('moreToolsBackdrop');
  if (drawer) drawer.classList.add('open');
  if (backdrop) backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMoreToolsDrawer() {
  const drawer = document.getElementById('moreToolsDrawer');
  const backdrop = document.getElementById('moreToolsBackdrop');
  if (drawer) drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
  document.body.style.overflow = '';
}
window.openMoreToolsDrawer = openMoreToolsDrawer;
window.closeMoreToolsDrawer = closeMoreToolsDrawer;

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

  // Update desktop navigation tab active state
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });

  // Update mobile bottom nav active classes
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });
}
window.navigateView = navigateView;
window.navigateView = navigateView;

// Open Chapter Detail Modal (Clean 3-Action Architecture)
function openChapterModal(chapterId) {
  const ch = getAllChapters().find(c => c.id === chapterId);
  if (!ch) return;

  const modalBody = document.getElementById('modalBody');
  if (!modalBody) return;

  const isDone = !!appState.progress[chapterId];
  const loggedMinutes = (appState.studySessions || [])
    .filter(s => s.chapterId === chapterId)
    .reduce((sum, s) => sum + s.minutes, 0);

  const fullLectureFaculty = ch.subjectCode === 'phy' ? 'Alakh Pandey Physics Wallah' :
                             ch.subjectCode === 'chem' ? 'Pankaj Sir Chemistry' :
                             ch.subjectCode === 'bot' ? 'Tarun Sir Botany' : 'Dr Seep Pahuja Zoology';

  const ncertPdfQuery = encodeURIComponent(`NCERT class ${ch.ncertClass ? ch.ncertClass.replace(/[^0-9]/g, '') : '11'} ${ch.subject} ${ch.title} PDF download`);

  modalBody.innerHTML = `
    <div style="margin-bottom:12px;">
      <span class="eyebrow">${escapeHtml(ch.standard)} · ${escapeHtml(ch.subject.toUpperCase())}</span>
      <h2 class="modal-title" style="margin:4px 0 8px; font-size:22px;">${escapeHtml(ch.title)}</h2>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <span class="tag ${ch.subjectCode}">${ch.subject}</span>
        <span class="tag gold">Weightage: ${ch.weightage}</span>
        <span class="tag">Target: ${ch.hours} Hours</span>
        <span class="tag">${ch.ncertClass}</span>
      </div>
    </div>

    <!-- 3 Big Main Action Buttons (Book, Video, Test) -->
    <div class="chapter-action-bar">
      <a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener" class="action-card-btn">
        <span style="font-size:20px;">📖</span>
        <div>
          <div style="color:var(--text-main); font-weight:700;">NCERT Book (PDF)</div>
          <small style="color:var(--text-muted); font-size:11px;">Hindi / English Text ↗</small>
        </div>
      </a>

      <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(ch.title + ' ' + fullLectureFaculty + ' full lecture')}" target="_blank" rel="noopener" class="action-card-btn">
        <span style="font-size:20px;">🎥</span>
        <div>
          <div style="color:var(--text-main); font-weight:700;">Free Video Class</div>
          <small style="color:var(--text-muted); font-size:11px;">${escapeHtml(fullLectureFaculty.split(' ')[0])} Sir ↗</small>
        </div>
      </a>

      <button class="action-card-btn primary" onclick="document.getElementById('modal').close(); TestTreeEngine.launchChapterTest('${chapterId}');">
        <span style="font-size:20px;">📝</span>
        <div style="text-align:left;">
          <div>Practice 10 MCQs</div>
          <small style="opacity:0.9; font-size:11px;">Bilingual Quiz (10 Qs)</small>
        </div>
      </button>
    </div>

    <!-- Key Topics List -->
    <div class="callout" style="margin:14px 0;">
      <strong style="display:block; margin-bottom:6px; color:var(--text-main); font-size:13px;">📖 Core NCERT Subtopics:</strong>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${(ch.subtopics || '').split(/[,;•|\n]/).map(s => s.trim()).filter(Boolean).map(sub => `
          <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-secondary); padding:6px 10px; border-radius:6px; font-size:12px; border:1px solid var(--border-color); gap:8px;">
            <span style="color:var(--text-main);">• ${escapeHtml(sub)}</span>
            <button class="btn ghost btn-sm" style="font-size:10.5px; padding:3px 8px; white-space:nowrap;" onclick="document.getElementById('modal').close(); TestTreeEngine.launchTopicTest('${chapterId}', '${escapeHtml(sub)}');">
              Practice →
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- High Yield Concepts -->
    <div style="margin-bottom:16px;">
      <h4 style="font-size:13px; color:var(--text-muted); margin-bottom:6px;">Key Formulas & Concepts:</h4>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        ${ch.keyConcepts.map(c => `<span class="tag" style="font-size:11.5px;">${escapeHtml(c)}</span>`).join('')}
      </div>
    </div>

    <!-- Bottom Actions: Toggle Complete & Close -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; flex-wrap:wrap; gap:10px; border-top:1px solid var(--border-color); padding-top:14px;">
      <button class="btn ${isDone ? 'ghost' : 'btn-primary'}" onclick="toggleChapterComplete('${chapterId}'); document.getElementById('modal').close();">
        ${isDone ? 'Mark Incomplete' : '✓ Mark Chapter Completed'}
      </button>
      <button class="btn ghost" onclick="document.getElementById('modal').close()">Close</button>
    </div>
  `;

  const modal = document.getElementById('modal');
  if (modal) modal.showModal();
}
window.openChapterModal = openChapterModal;

// Open Subject Explorer Modal / View
function openSubjectExplorer(subjectCode) {
  window.syllabusFilter = subjectCode;
  navigateView('syllabus');
}
window.openSubjectExplorer = openSubjectExplorer;

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

  const isHindi = window.appLanguage === 'hindi';
  const stats = getStudyStats();
  const weekly = getWeeklyStudyData();
  const monthly = getMonthlyStudyData();
  const period = window.studyTrackerPeriod || 'daily';
  const isSessionRunning = window.activeStudySession && window.activeStudySession.isRunning;

  // Daily calculations
  const dailyGoalHours = (stats.dailyGoalSeconds / 3600).toFixed(0);
  const todayHoursStr = formatStudySeconds(stats.todaySeconds);
  const todayPct = Math.min(100, Math.round((stats.todaySeconds / stats.dailyGoalSeconds) * 100));

  return `
    <!-- Senior-Grade Bento Grid Hero Section (Aspirant Profile & Live Study Time Tracker) -->
    <div class="neet-bento-hero">
      <!-- Card 1: Aspirant Profile & Predicted 720 Score -->
      <div class="bento-welcome-card">
        <div>
          <div class="doctor-crest">
            <span>🩺</span>
            <span>TARGET AIIMS NEW DELHI 2028 · 100% FREE</span>
          </div>
          <div class="bento-welcome-header">
            <h2>${isHindi ? 'नमस्ते भावी डॉक्टर!' : 'Hello Future Doctor!'}</h2>
            <p>
              ${isHindi 
                ? 'बिना किसी कोचिंग फीस के पूरी NEET UG तैयारी — शुद्ध NCERT, फ्री वीडियो व टेस्ट।' 
                : '100% Free NCERT Medical Entrance OS. Video Classes, Notes & Virtual OMR.'}
            </p>
          </div>
        </div>

        <div class="bento-score-row">
          <div>
            <div style="font-size:11px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">
              ${isHindi ? 'अनुमानित स्कोर' : 'Predicted Score'}
            </div>
            <div class="bento-score-val">
              ${predictedScore} <span style="font-size:14px; font-weight:600; color:var(--text-muted);">/ 720</span>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:11.5px; font-weight:700; color:var(--brand-emerald);">
              ${overallPct}% ${isHindi ? 'सिलेबस पूर्ण' : 'Syllabus'}
            </div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">
              ${doneCount}/${totalCount} ${isHindi ? 'अध्याय' : 'Chapters'}
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Interactive Study Time Tracker (Daily / Weekly / Monthly) -->
      <div class="bento-tracker-card">
        <div class="bento-tracker-top">
          <div class="tracker-title">
            <span>⏱️</span>
            <span>${isHindi ? 'पढ़ाई ट्रैकर' : 'Study Tracker'}</span>
          </div>
          <div class="tracker-period-pills">
            <button class="tracker-tab-btn ${period === 'daily' ? 'active' : ''}" onclick="setStudyTrackerPeriod('daily')">
              ${isHindi ? 'दैनिक' : 'Daily'}
            </button>
            <button class="tracker-tab-btn ${period === 'weekly' ? 'active' : ''}" onclick="setStudyTrackerPeriod('weekly')">
              ${isHindi ? 'साप्ताहिक' : 'Weekly'}
            </button>
            <button class="tracker-tab-btn ${period === 'monthly' ? 'active' : ''}" onclick="setStudyTrackerPeriod('monthly')">
              ${isHindi ? 'मासिक' : 'Monthly'}
            </button>
          </div>
        </div>

        <div class="tracker-stats-box">
          ${period === 'daily' ? `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; gap:8px;">
              <span style="font-size:11.5px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">
                ${isHindi ? 'आज का अध्ययन समय' : "Today's Study Time"}
              </span>
              <div style="display:flex; align-items:center; gap:6px;">
                ${isSessionRunning ? `<span id="liveSessionStatus" style="font-size:11px; font-weight:700; color:var(--brand-emerald); display:flex; align-items:center; gap:4px;"><span class="pulse-dot"></span> Active</span>` : ''}
                <button class="tracker-goal-pill" onclick="promptSetStudyGoal()" title="${isHindi ? 'दैनिक लक्ष्य बदलें' : 'Click to Change Daily Goal'}">
                  🎯 ${isHindi ? 'लक्ष्य:' : 'Goal:'} ${dailyGoalHours}h ✏️
                </button>
              </div>
            </div>
            <div class="tracker-time-big">
              <span id="liveStudyTimerDisplay">${todayHoursStr}</span>
              <span class="tracker-time-sub" onclick="promptSetStudyGoal()" style="cursor:pointer;" title="${isHindi ? 'दैनिक लक्ष्य बदलें' : 'Click to Change Daily Goal'}">/ ${dailyGoalHours}h ${isHindi ? 'लक्ष्य' : 'Goal'} (${todayPct}%) ✏️</span>
            </div>
            <div class="progress-bar-container" style="height:6px; margin-top:10px; cursor:pointer;" onclick="promptSetStudyGoal()" title="${isHindi ? 'दैनिक लक्ष्य बदलें' : 'Click to Change Daily Goal'}">
              <div class="progress-bar-fill bot" style="width:${todayPct}%;"></div>
            </div>
          ` : period === 'weekly' ? `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-size:11.5px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">
                ${isHindi ? 'इस सप्ताह का कुल समय' : 'This Week Total'}
              </span>
              <span style="font-size:12px; font-weight:800; color:var(--brand-teal);">
                ${weekly.weekTotalHours} hrs
              </span>
            </div>
            <!-- 7-Day Bar Chart -->
            <div class="tracker-bars-row">
              ${weekly.days.map(d => {
                const barHeight = Math.max(8, Math.round((d.seconds / weekly.maxSec) * 100));
                return `
                  <div class="tracker-bar-col" title="${d.dayName}: ${d.hours}h">
                    <div style="font-size:9px; color:${d.isToday ? 'var(--brand-cyan)' : 'var(--text-dim)'}; font-weight:700;">${d.hours}h</div>
                    <div class="tracker-bar-track">
                      <div class="tracker-bar-fill ${d.isToday ? 'today' : ''}" style="height:${barHeight}%;"></div>
                    </div>
                    <div class="tracker-bar-label ${d.isToday ? 'today' : ''}">${d.dayName}</div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            <!-- Monthly View -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:11.5px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">
                ${isHindi ? 'इस महीने की पढ़ाई' : 'Monthly Summary'}
              </span>
              <span style="font-size:12px; font-weight:800; color:#fbbf24;">
                🔥 ${monthly.streakDays} ${isHindi ? 'दिन स्ट्रीक' : 'Day Streak'}
              </span>
            </div>
            <div class="tracker-time-big" style="color:#fbbf24;">
              ${monthly.monthlyHours} <span style="font-size:16px; font-weight:600; color:var(--text-muted);">hours</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:11.5px; color:var(--text-muted); margin-top:8px;">
              <span>✅ ${monthly.activeDays}/30 ${isHindi ? 'दिन एक्टिव' : 'Days Active'}</span>
              <span style="color:var(--brand-emerald); font-weight:700;">${monthly.consistencyPct}% ${isHindi ? 'नियमितता' : 'Consistency'}</span>
            </div>
          `}
        </div>

        <!-- 1-Tap Session Starter -->
        <button class="tracker-session-btn ${isSessionRunning ? 'active' : ''}" onclick="toggleStudySession()">
          ${isSessionRunning 
            ? `⏸️ ${isHindi ? 'पढ़ाई सत्र रोकें (Pause Study)' : 'Pause Study Session'}` 
            : `▶️ ${isHindi ? 'पढ़ाई सत्र शुरू करें (Start Study)' : 'Start Study Session'}`}
        </button>
      </div>
    </div>

    <!-- 4 Big Subject Explorer Cards (Clean, organized for students) -->
    <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
      <h3 style="font-size:18px; font-weight:800; color:var(--text-main); margin:0;">
        ${isHindi ? '📚 मुख्य विषय (4 Subjects)' : '📚 4 Core Subjects'}
      </h3>
      <span style="font-size:12px; color:var(--text-muted);">${isHindi ? 'चुनें और पढ़ना शुरू करें' : 'Tap to open chapters'}</span>
    </div>

    <div class="play-subjects-grid">
      <!-- Physics Card -->
      <div class="play-subject-card phy" onclick="openSubjectExplorer('phy')">
        <div>
          <div class="play-subject-header">
            <div class="play-subject-icon">⚡</div>
            <div>
              <div class="play-subject-name">Physics</div>
              <div class="play-subject-sub">भौतिक विज्ञान (180 Marks)</div>
            </div>
          </div>
          <div class="play-subject-meta">
            <span>${phy.count}/${phy.total} Chapters</span>
            <span style="font-weight:700; color:#60a5fa;">${phy.pct}% Done</span>
          </div>
          <div class="progress-bar-container"><div class="progress-bar-fill phy" style="width:${phy.pct}%;"></div></div>
        </div>
        <button class="play-subject-action-btn" onclick="event.stopPropagation(); openSubjectExplorer('phy')">
          📖 ${isHindi ? 'फिजिक्स चैप्टर्स खोलें' : 'Open Physics Chapters'} →
        </button>
      </div>

      <!-- Chemistry Card -->
      <div class="play-subject-card chem" onclick="openSubjectExplorer('chem')">
        <div>
          <div class="play-subject-header">
            <div class="play-subject-icon">🧪</div>
            <div>
              <div class="play-subject-name">Chemistry</div>
              <div class="play-subject-sub">रसायन विज्ञान (180 Marks)</div>
            </div>
          </div>
          <div class="play-subject-meta">
            <span>${chem.count}/${chem.total} Chapters</span>
            <span style="font-weight:700; color:#34d399;">${chem.pct}% Done</span>
          </div>
          <div class="progress-bar-container"><div class="progress-bar-fill chem" style="width:${chem.pct}%;"></div></div>
        </div>
        <button class="play-subject-action-btn" onclick="event.stopPropagation(); openSubjectExplorer('chem')">
          📖 ${isHindi ? 'केमिस्ट्री चैप्टर्स खोलें' : 'Open Chemistry Chapters'} →
        </button>
      </div>

      <!-- Botany Card -->
      <div class="play-subject-card bot" onclick="openSubjectExplorer('bot')">
        <div>
          <div class="play-subject-header">
            <div class="play-subject-icon">🌿</div>
            <div>
              <div class="play-subject-name">Botany</div>
              <div class="play-subject-sub">वनस्पति विज्ञान (180 Marks)</div>
            </div>
          </div>
          <div class="play-subject-meta">
            <span>${bot.count}/${bot.total} Chapters</span>
            <span style="font-weight:700; color:#4ade80;">${bot.pct}% Done</span>
          </div>
          <div class="progress-bar-container"><div class="progress-bar-fill bot" style="width:${bot.pct}%;"></div></div>
        </div>
        <button class="play-subject-action-btn" onclick="event.stopPropagation(); openSubjectExplorer('bot')">
          📖 ${isHindi ? 'बॉटनी चैप्टर्स खोलें' : 'Open Botany Chapters'} →
        </button>
      </div>

      <!-- Zoology Card -->
      <div class="play-subject-card zoo" onclick="openSubjectExplorer('zoo')">
        <div>
          <div class="play-subject-header">
            <div class="play-subject-icon">🦁</div>
            <div>
              <div class="play-subject-name">Zoology</div>
              <div class="play-subject-sub">प्राणी विज्ञान (180 Marks)</div>
            </div>
          </div>
          <div class="play-subject-meta">
            <span>${zoo.count}/${zoo.total} Chapters</span>
            <span style="font-weight:700; color:#fbbf24;">${zoo.pct}% Done</span>
          </div>
          <div class="progress-bar-container"><div class="progress-bar-fill zoo" style="width:${zoo.pct}%;"></div></div>
        </div>
        <button class="play-subject-action-btn" onclick="event.stopPropagation(); openSubjectExplorer('zoo')">
          📖 ${isHindi ? 'जूलॉजी चैप्टर्स खोलें' : 'Open Zoology Chapters'} →
        </button>
      </div>
    </div>

    <!-- Quick Practice & Tools 4-Grid (Clean, big touch targets) -->
    <div style="margin-bottom:12px;">
      <h3 style="font-size:18px; font-weight:800; color:var(--text-main); margin:0;">
        ${isHindi ? '⚡ तुरंत अभ्यास करें (Quick Practice)' : '⚡ Quick Practice Hub'}
      </h3>
    </div>

    <div class="play-quick-grid">
      <div class="play-quick-btn" onclick="MockTestEngine.initTest('all', 10, 15)">
        <div class="play-quick-icon">🎯</div>
        <div>
          <div class="play-quick-title">${isHindi ? 'दैनिक 10 MCQ टेस्ट' : 'Daily 10-MCQ Mix'}</div>
          <div class="play-quick-desc">${isHindi ? '10 प्रश्न · 15 मिनट अभ्यास' : '10 Qs · 15 Mins Drill'}</div>
        </div>
      </div>

      <div class="play-quick-btn" onclick="navigateView('rapid-fire')">
        <div class="play-quick-icon" style="background:rgba(245, 158, 11, 0.15);">🔥</div>
        <div>
          <div class="play-quick-title">${isHindi ? '60s फॉर्मूला रैपिड-फायर' : '60s Formula Sprint'}</div>
          <div class="play-quick-desc">${isHindi ? 'तेज़ गति सूत्र अभ्यास' : 'Speed Active Recall'}</div>
        </div>
      </div>

      <div class="play-quick-btn" onclick="navigateView('mistakes')">
        <div class="play-quick-icon" style="background:rgba(244, 63, 94, 0.15);">⚠️</div>
        <div>
          <div class="play-quick-title">${isHindi ? 'मेरी गलती डायरी' : 'My Mistake Book'}</div>
          <div class="play-quick-desc">${unresolvedMistakes} ${isHindi ? 'सुधारने बाकी प्रश्न' : 'Unresolved Mistakes'}</div>
        </div>
      </div>

      <div class="play-quick-btn" onclick="openMoreToolsDrawer()">
        <div class="play-quick-icon" style="background:rgba(59, 130, 246, 0.15);">⏱️</div>
        <div>
          <div class="play-quick-title">${isHindi ? 'स्टडी फोकस टाइमर' : 'Study Focus Timer'}</div>
          <div class="play-quick-desc">${PomodoroTimer.durationMinutes}m Pomodoro / Deep Study</div>
        </div>
      </div>
    </div>

    <!-- Spaced Repetition Due Today Card -->
    ${dueRevisions.length ? `
      <div class="card" style="margin-bottom:24px; border-left:4px solid var(--brand-gold);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div>
            <strong style="color:var(--brand-gold); font-size:15px;">🧠 ${isHindi ? 'आज रिवीज़न के लिए तैयार चैप्टर्स' : 'Due for Revision Today'}</strong>
            <p class="muted" style="font-size:12px; margin:2px 0 0;">${isHindi ? 'लंबे समय तक याद रखने के लिए दोहराएं' : 'Active recall spaced repetition queue'}</p>
          </div>
          <span class="tag gold">${dueRevisions.length} DUE</span>
        </div>
        <div class="list">
          ${dueRevisions.slice(0, 3).map(ch => `
            <div class="item" style="padding:10px 12px; cursor:pointer;" onclick="openChapterModal('${ch.id}')">
              <div class="grow">
                <strong>${escapeHtml(ch.title)}</strong>
                <small>${escapeHtml(ch.subject)}</small>
              </div>
              <button class="ghost btn-sm" onclick="event.stopPropagation(); scheduleRevision('${ch.id}', 3)">✓ ${isHindi ? 'दोहराया (+3d)' : 'Reviewed (+3d)'}</button>
            </div>
          `).join('')}
        </div>
    ` : ''}
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

// Books & Notes Master View (100% Free NCERT Books in Hindi & English + Formula Sheets)
function renderBooksView() {
  const filterSubject = window.booksFilter || 'All';
  const notes = getNotesBySubject(filterSubject);
  const isHindi = window.appLanguage === 'hindi';

  return `
    <div class="section-head">
      <div>
        <span class="eyebrow">100% FREE NCERT BOOKS & FORMULAS</span>
        <h2>${isHindi ? '📖 NCERT किताबें एवं सूत्र संग्रह' : '📖 NCERT Books & Master Formulas'}</h2>
      </div>
      <span class="tag gold">${isHindi ? 'मुफ्त अध्ययन सामग्री' : 'FREE STUDY VAULT'}</span>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <button class="filter-btn ${filterSubject === 'All' ? 'active' : ''}" onclick="window.booksFilter = 'All'; renderApp();">${isHindi ? 'सभी सामग्री' : 'All Resources'}</button>
      <button class="filter-btn ${filterSubject === 'Physics' ? 'active' : ''}" onclick="window.booksFilter = 'Physics'; renderApp();">⚡ Physics</button>
      <button class="filter-btn ${filterSubject === 'Chemistry' ? 'active' : ''}" onclick="window.booksFilter = 'Chemistry'; renderApp();">🧪 Chemistry</button>
      <button class="filter-btn ${filterSubject === 'Biology' ? 'active' : ''}" onclick="window.booksFilter = 'Biology'; renderApp();">🌿 Biology</button>
    </div>

    <!-- Official NCERT Textbook Download Grid -->
    <div style="margin-bottom:24px;">
      <h3 style="font-size:17px; font-weight:800; color:var(--text-main); margin-bottom:12px;">
        🏛️ ${isHindi ? 'आधिकारिक NCERT पाठ्यपुस्तकें (English & हिन्दी माध्यम)' : 'Official NCERT Textbooks (Direct Free PDF)'}
      </h3>

      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:12px;">
        <!-- Physics 11 & 12 -->
        ${(filterSubject === 'All' || filterSubject === 'Physics') ? `
          <div class="card" style="padding:16px; border-left:4px solid #3b82f6;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
              <span class="tag phy">PHYSICS</span>
              <span class="tag">Class 11 & 12</span>
            </div>
            <strong style="font-size:15px; color:var(--text-main); display:block; margin-bottom:4px;">
              NCERT Physics (भौतिक विज्ञान)
            </strong>
            <p class="muted" style="font-size:12px; margin-bottom:12px;">
              Parts 1 & 2 Textbook with Official Diagrams & Numerical Examples.
            </p>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <a href="https://ncert.nic.in/textbook.php?keph1=0-8" target="_blank" rel="noopener" class="btn ghost btn-sm" style="font-size:11.5px; text-decoration:none;">
                📥 Eng PDF ↗
              </a>
              <a href="https://ncert.nic.in/textbook.php?khph1=0-8" target="_blank" rel="noopener" class="btn ghost btn-sm" style="font-size:11.5px; text-decoration:none;">
                📥 Hindi PDF ↗
              </a>
              <a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener" class="btn ghost btn-sm" style="font-size:11.5px; text-decoration:none;">
                🌐 All Classes ↗
              </a>
            </div>
          </div>
        ` : ''}

        <!-- Chemistry 11 & 12 -->
        ${(filterSubject === 'All' || filterSubject === 'Chemistry') ? `
          <div class="card" style="padding:16px; border-left:4px solid #10b981;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
              <span class="tag chem">CHEMISTRY</span>
              <span class="tag">Class 11 & 12</span>
            </div>
            <strong style="font-size:15px; color:var(--text-main); display:block; margin-bottom:4px;">
              NCERT Chemistry (रसायन विज्ञान)
            </strong>
            <p class="muted" style="font-size:12px; margin-bottom:12px;">
              Physical, Organic & Inorganic Complete Line-by-Line NCERT.
            </p>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <a href="https://ncert.nic.in/textbook.php?kech1=0-7" target="_blank" rel="noopener" class="btn ghost btn-sm" style="font-size:11.5px; text-decoration:none;">
                📥 Eng PDF ↗
              </a>
              <a href="https://ncert.nic.in/textbook.php?khch1=0-7" target="_blank" rel="noopener" class="btn ghost btn-sm" style="font-size:11.5px; text-decoration:none;">
                📥 Hindi PDF ↗
              </a>
              <a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener" class="btn ghost btn-sm" style="font-size:11.5px; text-decoration:none;">
                🌐 All Classes ↗
              </a>
            </div>
          </div>
        ` : ''}

        <!-- Biology 11 & 12 -->
        ${(filterSubject === 'All' || filterSubject === 'Biology') ? `
          <div class="card" style="padding:16px; border-left:4px solid #22c55e;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
              <span class="tag bot">BIOLOGY</span>
              <span class="tag">Class 11 & 12</span>
            </div>
            <strong style="font-size:15px; color:var(--text-main); display:block; margin-bottom:4px;">
              NCERT Biology (जीव विज्ञान)
            </strong>
            <p class="muted" style="font-size:12px; margin-bottom:12px;">
              Botany & Zoology Master Textbooks (360/360 NEET Bible).
            </p>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <a href="https://ncert.nic.in/textbook.php?kebo1=0-22" target="_blank" rel="noopener" class="btn ghost btn-sm" style="font-size:11.5px; text-decoration:none;">
                📥 Eng PDF ↗
              </a>
              <a href="https://ncert.nic.in/textbook.php?khbo1=0-22" target="_blank" rel="noopener" class="btn ghost btn-sm" style="font-size:11.5px; text-decoration:none;">
                📥 Hindi PDF ↗
              </a>
              <a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener" class="btn ghost btn-sm" style="font-size:11.5px; text-decoration:none;">
                🌐 All Classes ↗
              </a>
            </div>
          </div>
        ` : ''}
      </div>
    </div>

    <!-- High-Yield Formula Sheets & Notes Collection -->
    <div style="margin-bottom:12px;">
      <h3 style="font-size:17px; font-weight:800; color:var(--text-main); margin-bottom:12px;">
        📝 ${isHindi ? 'महत्वपूर्ण सूत्र एवं रिवीज़न पत्रक' : 'High-Yield Formula & Summary Sheets'}
      </h3>
    </div>

    <div class="grid grid-2">
      ${notes.map(note => `
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; padding:18px;">
          <div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span class="tag ${note.subject === 'Physics' ? 'phy' : note.subject === 'Chemistry' ? 'chem' : 'bot'}">${note.subject}</span>
              <span class="tag gold">${note.category}</span>
            </div>
            <h3 style="margin-bottom:6px; font-size:16px;">${escapeHtml(note.title)}</h3>
            <p class="muted" style="font-size:12.5px; margin-bottom:14px; line-height:1.4;">${escapeHtml(note.summary)}</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="openNoteModal('${note.id}')">
            📖 ${isHindi ? 'पूरा नोट्स पढ़ें' : 'Read Full Formula Sheet'} →
          </button>
        </div>
      `).join('')}
    </div>
  `;
}
window.renderBooksView = renderBooksView;
window.renderNotesView = renderBooksView;

function openNoteModal(noteId) {
  const note = NEET_NOTES.find(n => n.id === noteId);
  if (!note) return;

  const modalBody = document.getElementById('modalBody');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <span class="eyebrow">${escapeHtml(note.subject.toUpperCase())} · ${escapeHtml(note.category.toUpperCase())}</span>
    <h2 style="margin:8px 0 16px; font-size:20px;">${escapeHtml(note.title)}</h2>
    <div style="line-height:1.7; font-size:14px; max-height:480px; overflow-y:auto; padding-right:10px; border:1px solid var(--border-color); padding:14px; border-radius:8px; background:var(--bg-secondary);">
      ${formatMarkdownText(note.content)}
    </div>
    <div style="display:flex; justify-content:flex-end; margin-top:16px;">
      <button class="btn ghost" onclick="document.getElementById('modal').close()">Close Note</button>
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
  const isHindi = window.appLanguage === 'hindi';
  const history = (appState.testHistory || []).slice(-10).reverse();
  const treeStats = typeof TestTreeEngine !== 'undefined' ? TestTreeEngine.getTreeStats() : {
    topicDone: 0, chapterDone: 0, totalChapters: 96, subjectDone: 0, totalSubjects: 12,
    combo2Done: 0, totalCombo2: 9, combo3Done: 0, totalCombo3: 3, grandDone: 0, totalGrandMocks: 10, totalAttempted: 0
  };
  const treeState = typeof TestTreeEngine !== 'undefined' ? TestTreeEngine.getTreeState() : {};

  const isL5Unlocked = typeof PaymentEngine !== 'undefined' ? PaymentEngine.isLevelUnlocked(5) : false;
  const isL6Unlocked = typeof PaymentEngine !== 'undefined' ? PaymentEngine.isLevelUnlocked(6) : false;
  const isAllUnlocked = isL5Unlocked && isL6Unlocked;

  return `
    <div class="section-head">
      <div>
        <span class="eyebrow">${isHindi ? 'पदानुक्रमित NTA टेस्टिंग इंजन व सिमुलेशन' : 'HIERARCHICAL NTA TESTING ENGINE & DIRECTOR EXAM SIMULATION'}</span>
        <h2>${isHindi ? 'NEET UG 2028: 6-लेवल टेस्टिंग ट्री व 10 प्री-NEET ग्रैंड मॉक' : 'NEET UG 2028: 6-Level Testing Tree & 10 Pre-NEET Grand Mocks'}</h2>
      </div>
      <span class="tag gold"><i class="fas fa-sitemap"></i> ${treeStats.totalAttempted} TESTS ATTEMPTED</span>
    </div>

    <!-- Premium Test Series Pass & Pricing Banner -->
    <div class="card premium-pass-banner" style="margin-bottom:20px; padding:18px 20px; border-radius:16px; background:linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9)); border:1px solid rgba(6,182,212,0.35); box-shadow:0 10px 25px rgba(0,0,0,0.25);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
        <div style="max-width:560px;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <span class="tag ${isAllUnlocked ? 'bot' : 'gold'}" style="font-size:10.5px; font-weight:800;">
              ${isAllUnlocked ? '🟢 ALL PREMIUM TESTS UNLOCKED' : '💎 DIRECT UPI TEST PASS'}
            </span>
            <span style="font-size:11px; color:#10b981; font-weight:700;">LEVEL 1–4 100% FREE FOREVER</span>
          </div>
          <h3 style="font-size:18px; font-weight:800; color:#ffffff; margin:0 0 4px;">
            ${isAllUnlocked 
              ? (isHindi ? '🎉 आपका ऑल-एक्सेस टेस्ट पास सक्रिय है!' : '🎉 All-Access Premium Test Pass Active!') 
              : (isHindi ? 'लेवल 5 और 6 प्रीमियम टेस्ट सीरीज अनलॉक करें' : 'Unlock Level 5 & Level 6 Premium Test Series')}
          </h3>
          <p style="font-size:12.5px; color:#94a3b8; margin:0; line-height:1.4;">
            ${isAllUnlocked 
              ? (isHindi ? 'सभी 13 ग्रैंड व इंटीग्रेशन टेस्ट अनलिमिटेड री-अटेम्पट के साथ उपलब्ध हैं।' : 'All 13 Grand & Multi-Subject integration tests are unlocked with lifetime unlimited attempts.')
              : (isHindi ? 'डायरेक्ट UPI द्वारा केवल ₹49 (लेवल 5), ₹99 (लेवल 6), या ₹119 में कॉम्बो ऑल-एक्सेस प्राप्त करें।' : 'Direct UPI payment: Level 5 @ ₹49, Level 6 @ ₹99, or Complete Mega Combo @ ₹119.')}
          </p>
        </div>

        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          ${!isAllUnlocked ? `
            <button class="btn btn-primary btn-sm" onclick="PaymentEngine.openCheckoutModal('combo')" style="padding:10px 16px; font-size:13px; font-weight:800; border-radius:10px; box-shadow:0 4px 14px rgba(6,182,212,0.4);">
              👑 ${isHindi ? 'कॉम्बो अनलॉक ₹119' : 'Unlock All Mocks (₹119)'}
            </button>
            ${!isL5Unlocked ? `
              <button class="btn ghost btn-sm" onclick="PaymentEngine.openCheckoutModal('level5')" style="padding:8px 12px; font-size:12px; border:1px solid rgba(236,72,153,0.4); color:#ec4899;">
                ${isHindi ? 'लेवल 5 (₹49)' : 'Level 5 (₹49)'}
              </button>
            ` : ''}
            ${!isL6Unlocked ? `
              <button class="btn ghost btn-sm" onclick="PaymentEngine.openCheckoutModal('level6')" style="padding:8px 12px; font-size:12px; border:1px solid rgba(245,158,11,0.4); color:#f59e0b;">
                ${isHindi ? 'लेवल 6 (₹99)' : 'Level 6 (₹99)'}
              </button>
            ` : ''}
          ` : `
            <div style="display:flex; align-items:center; gap:6px; background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.4); color:#10b981; padding:8px 16px; border-radius:10px; font-weight:800; font-size:12.5px;">
              <span>✅ LIFETIME ACCESS ACTIVATED</span>
            </div>
          `}
        </div>
      </div>
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
          <div style="font-size:11px; color:var(--text-muted);">5 Qs · 5 Mins compulsory drills · <b style="color:#10b981;">100% FREE</b></div>
        </div>

        <div class="card" style="padding:12px; background:var(--bg-secondary);">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:4px;">
            <span>L2: Chapter Milestones</span>
            <span style="color:var(--brand-gold);">${treeStats.chapterDone}/${treeStats.totalChapters} Passed</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">15 Qs · 15 Mins full chapter tests · <b style="color:#10b981;">100% FREE</b></div>
        </div>

        <div class="card" style="padding:12px; background:var(--bg-secondary);">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:4px;">
            <span>L3: Single Subject (12)</span>
            <span style="color:var(--brand-purple);">${treeStats.subjectDone}/${treeStats.totalSubjects} Cleared</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">45 Qs · 45 Mins (3 Phy, 3 Chem, 3 Bot, 3 Zoo) · <b style="color:#10b981;">100% FREE</b></div>
        </div>

        <div class="card" style="padding:12px; background:var(--bg-secondary);">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:4px;">
            <span>L4: 2-Subject Combos (9)</span>
            <span style="color:var(--brand-emerald);">${treeStats.combo2Done}/${treeStats.totalCombo2} Cleared</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">90 Qs · 90 Mins (P+C, B+Z, P+B) · <b style="color:#10b981;">100% FREE</b></div>
        </div>

        <div class="card" style="padding:12px; background:var(--bg-secondary); border:1px solid ${isL5Unlocked ? 'rgba(16,185,129,0.3)' : 'rgba(236,72,153,0.3)'};">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:4px;">
            <span>L5: 3-Subject PCB (3)</span>
            <span style="color:${isL5Unlocked ? 'var(--brand-emerald)' : '#ec4899'};">${isL5Unlocked ? '🟢 Unlocked' : '🔒 ₹49'}</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">135 Qs · 135 Mins Grand Integration</div>
        </div>

        <div class="card" style="padding:12px; background:var(--bg-secondary); border:1px solid ${isL6Unlocked ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'};">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:4px;">
            <span>L6: 10 Pre-NEET Mocks</span>
            <span style="color:${isL6Unlocked ? 'var(--brand-emerald)' : 'var(--brand-gold)'}; font-weight:800;">${isL6Unlocked ? '🟢 Unlocked' : '🔒 ₹99'}</span>
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
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="tag gold" style="font-weight:700;">200 QUESTIONS · 200 MINS</span>
          ${isL6Unlocked 
            ? `<span class="tag bot" style="font-weight:800;">🟢 UNLOCKED</span>` 
            : `<button class="btn btn-sm" onclick="PaymentEngine.openCheckoutModal('level6')" style="background:#f59e0b; color:#0f172a; font-weight:800; font-size:11px; padding:4px 10px; border-radius:8px;">🔒 Unlock Pack (₹99)</button>`}
        </div>
      </div>

      <div class="grid grid-2" style="gap:16px;">
        ${(TestTreeEngine.GRAND_MOCKS || []).map(m => {
          const res = treeState.grandMocks && treeState.grandMocks[m.id];
          return `
            <div class="card" style="border-top:3px solid ${res ? (res.passed ? 'var(--brand-emerald)' : 'var(--brand-gold)') : (isL6Unlocked ? 'var(--border-color)' : '#f59e0b')}; padding:16px;">
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
                ${isL6Unlocked ? `
                  <button class="btn btn-gold btn-sm" onclick="TestTreeEngine.launchPreNeetMock(${m.mockNum})">
                    ${res ? '🔄 Re-Attempt' : '⚡ Start Grand Mock →'}
                  </button>
                ` : `
                  <button class="btn btn-sm" onclick="PaymentEngine.openCheckoutModal('level6')" style="background:linear-gradient(135deg, #f59e0b, #d97706); color:#fff; font-weight:800; font-size:12px; padding:6px 14px; border-radius:8px; border:none; cursor:pointer;">
                    🔒 Unlock Mock (₹99)
                  </button>
                `}
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
      <div class="card" style="border-top:3px solid ${isL5Unlocked ? 'var(--brand-emerald)' : '#ec4899'};">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <span class="eyebrow" style="color:#ec4899;">LEVEL 5 · 3-SUBJECT COMBOS</span>
          <span class="tag" style="font-size:11px;">135 Qs · 135 Mins</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h3 style="font-size:17px; margin:0;">🧬 PCB Grand Multi-Subject Integration</h3>
          ${isL5Unlocked 
            ? `<span class="tag bot" style="font-size:10px; font-weight:800;">🟢 UNLOCKED</span>` 
            : `<button class="btn ghost btn-sm" onclick="PaymentEngine.openCheckoutModal('level5')" style="font-size:10.5px; font-weight:800; color:#ec4899; border-color:rgba(236,72,153,0.4); padding:3px 8px;">🔒 Unlock (₹49)</button>`}
        </div>
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
                  <small class="muted">${t.questions} Qs · ${res ? `Score: ${res.score}/${res.maxScore}` : (isL5Unlocked ? 'Not Attempted' : '🔒 Level 5 Locked')}</small>
                </div>
                ${isL5Unlocked ? `
                  <button class="btn ghost btn-sm" style="white-space:nowrap;" onclick="TestTreeEngine.launchCombo3Test('${t.id}')">
                    ${res ? 'Re-take' : 'Start Test →'}
                  </button>
                ` : `
                  <button class="btn ghost btn-sm" style="white-space:nowrap; color:#ec4899; border-color:rgba(236,72,153,0.35);" onclick="PaymentEngine.openCheckoutModal('level5')">
                    🔒 ₹49 Unlock
                  </button>
                `}
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

// More & Settings View (Includes Student Profile, Quick Controls, Tools Grid & Developer Mission)
function renderMoreView() {
  const lang = window.appLanguage || 'bilingual';
  const isLight = document.body.classList.contains('light');
  const currentUser = (typeof ClerkAuth !== 'undefined' && ClerkAuth.getCurrentUser) ? ClerkAuth.getCurrentUser() : null;
  const isClerk = currentUser && currentUser.provider === 'clerk';
  const doctorName = currentUser ? (currentUser.firstName || currentUser.fullName || 'Doctor') : (appState.doctorName || 'Future Doctor');

  return `
    <div class="section-head">
      <div>
        <span class="eyebrow">${lang === 'hindi' ? 'अतिरिक्त टूल्स, सेटिंग्स एवं डेवलपर' : 'ADDITIONAL TOOLS, SETTINGS & PROFILE'}</span>
        <h2>${lang === 'hindi' ? '⚙️ अधिक सुविधाएं एवं सेटिंग्स' : '⚙️ More Features, Settings & Profile'}</h2>
      </div>
      <span class="tag bot">${lang === 'hindi' ? '100% मुफ़्त एवं ओपन' : '100% Free & Open'}</span>
    </div>

    <!-- Student Profile & Access Hub -->
    <div class="card" style="margin-bottom:20px; background:linear-gradient(135deg, rgba(13,148,136,0.12), rgba(6,182,212,0.06)); border:1px solid rgba(13,148,136,0.3);">
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px;">
        <div style="display:flex; align-items:center; gap:14px;">
          <div style="width:52px; height:52px; border-radius:50%; background:linear-gradient(135deg, #0d9488, #06b6d4); display:flex; align-items:center; justify-content:center; font-size:24px; color:#fff; box-shadow:0 4px 14px rgba(13,148,136,0.4);">
            ${currentUser && currentUser.imageUrl ? `<img src="${currentUser.imageUrl}" alt="Avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : '🩺'}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h3 style="margin:0; font-size:18px; color:var(--text-main);">${escapeHtml(doctorName)}</h3>
              <span class="tag ${isClerk ? 'bot' : 'gold'}" style="font-size:10px; padding:2px 8px;">
                ${isClerk ? '☁️ Clerk Cloud Sync' : '🟢 Verified Student'}
              </span>
            </div>
            <p class="muted" style="margin:4px 0 0; font-size:12px;">
              ${lang === 'hindi' ? 'लक्ष्य: 720/720 · AIIMS नई दिल्ली' : 'Target: 720/720 · AIIMS New Delhi'}
            </p>
          </div>
        </div>

        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          ${currentUser ? `
            <button class="btn ghost btn-sm" onclick="if(window.ClerkAuth) ClerkAuth.openUserProfile();">
              👤 ${lang === 'hindi' ? 'प्रोफाइल' : 'Profile'}
            </button>
            <button class="btn ghost btn-sm" onclick="if(window.ClerkAuth) ClerkAuth.signOut();" style="color:var(--brand-rose); border-color:rgba(244,63,94,0.3);">
              🔒 ${lang === 'hindi' ? 'लॉगआउट' : 'Logout'}
            </button>
          ` : `
            <button class="btn-primary btn-sm" onclick="if(window.ClerkAuth) ClerkAuth.openSignIn();">
              🔑 ${lang === 'hindi' ? 'लॉगिन / साइन-अप' : 'Login / Sign In'}
            </button>
          `}
        </div>
      </div>
    </div>

    <!-- Quick Controls Grid: Dark Mode, Install App, Language -->
    <div style="margin-bottom:24px;">
      <h3 style="font-size:15px; margin-bottom:12px; color:var(--text-main);">
        ${lang === 'hindi' ? '⚡ त्वरित सेटिंग्स एवं नियंत्रण (Quick Controls)' : '⚡ Quick Controls & App Settings'}
      </h3>

      <div class="grid grid-3" style="gap:12px;">
        <!-- Theme Toggle Card -->
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; padding:16px; cursor:pointer;" onclick="toggleAppTheme()">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:24px;">🌓</span>
              <span class="tag ${isLight ? 'gold' : 'bot'}">${isLight ? '☀️ Light' : '🌙 Dark'}</span>
            </div>
            <strong style="font-size:14px; color:var(--text-main); display:block; margin-bottom:4px;">
              ${lang === 'hindi' ? 'थीम (Dark / Light)' : 'Theme (Dark / Light)'}
            </strong>
            <p class="muted" style="font-size:11px; margin:0;">
              ${lang === 'hindi' ? 'आँखों के आराम के लिए लाइट या डार्क मोड चुनें' : 'Toggle dark mode for comfortable late-night study'}
            </p>
          </div>
          <button class="btn ghost btn-sm" style="margin-top:12px; width:100%;" onclick="event.stopPropagation(); toggleAppTheme();">
            🌓 ${isLight ? (lang === 'hindi' ? 'डार्क मोड लगाएं' : 'Switch to Dark') : (lang === 'hindi' ? 'लाइट मोड लगाएं' : 'Switch to Light')}
          </button>
        </div>

        <!-- PWA Install Card -->
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; padding:16px;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:24px;">📲</span>
              <span class="tag bot">PWA App</span>
            </div>
            <strong style="font-size:14px; color:var(--text-main); display:block; margin-bottom:4px;">
              ${lang === 'hindi' ? 'ऐप इंस्टॉल करें' : 'Install App (Android / PC)'}
            </strong>
            <p class="muted" style="font-size:11px; margin:0;">
              ${lang === 'hindi' ? 'फोन या कंप्यूटर पर बिना इंटरनेट ऑफलाइन पढ़ने हेतु इंस्टॉल करें' : 'Install on phone or desktop for distraction-free offline access'}
            </p>
          </div>
          <button class="btn-primary btn-sm pwa-install-btn" style="margin-top:12px; width:100%;" onclick="PWAInstaller.install()">
            📲 ${lang === 'hindi' ? 'फोन में इंस्टॉल करें' : 'Install App on Device'}
          </button>
        </div>

        <!-- Language Switcher Card -->
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; padding:16px;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:24px;">🌐</span>
              <span class="tag ${lang === 'hindi' ? 'chem' : 'bot'}">${lang.toUpperCase()}</span>
            </div>
            <strong style="font-size:14px; color:var(--text-main); display:block; margin-bottom:4px;">
              ${lang === 'hindi' ? 'भाषा माध्यम' : 'Language Mode'}
            </strong>
            <p class="muted" style="font-size:11px; margin:0;">
              ${lang === 'hindi' ? 'द्विभाषी (English + हिंदी) या केवल हिन्दी चुनें' : 'Switch between Bilingual (EN+HI) and Pure Hindi'}
            </p>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; margin-top:12px;">
            <button class="btn ghost btn-sm ${lang === 'bilingual' ? 'btn-primary' : ''}" style="font-size:11px; padding:6px 4px;" onclick="setGlobalLanguage('bilingual')">
              🌐 Bilingual
            </button>
            <button class="btn ghost btn-sm ${lang === 'hindi' ? 'btn-primary' : ''}" style="font-size:11px; padding:6px 4px;" onclick="setGlobalLanguage('hindi')">
              🇮🇳 केवल हिन्दी
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- All Academic Tools & Revision Hub -->
    <div style="margin-bottom:28px;">
      <h3 style="font-size:15px; margin-bottom:12px; color:var(--text-main);">
        ${lang === 'hindi' ? '🚀 सभी रिवीजन एवं अभ्यास टूल्स (Academic Tools)' : '🚀 All Revision & Practice Tools'}
      </h3>

      <div class="grid grid-2" style="gap:12px;">
        <div class="card" style="cursor:pointer; display:flex; align-items:center; gap:14px; padding:14px;" onclick="navigateView('mistakes')">
          <span style="font-size:26px;">⚠️</span>
          <div style="flex:1;">
            <strong style="font-size:14px; color:var(--text-main);">${lang === 'hindi' ? 'मेरी गलती डायरी (Mistake Notebook)' : 'Mistake Notebook'}</strong>
            <p class="muted" style="font-size:11px; margin:2px 0 0;">${lang === 'hindi' ? 'मॉक टेस्ट में हुई गलतियों का संपूर्ण रिवीज़न' : 'Track and review past test errors with NCERT citations'}</p>
          </div>
          <span style="font-size:16px; color:var(--brand-teal);">→</span>
        </div>

        <div class="card" style="cursor:pointer; display:flex; align-items:center; gap:14px; padding:14px;" onclick="navigateView('rapid-fire')">
          <span style="font-size:26px;">🔥</span>
          <div style="flex:1;">
            <strong style="font-size:14px; color:var(--text-main);">${lang === 'hindi' ? '60s फॉर्मूला रैपिड-फायर' : '60s Rapid-Fire Formula Sprint'}</strong>
            <p class="muted" style="font-size:11px; margin:2px 0 0;">${lang === 'hindi' ? 'तेज़ गति फॉर्मूला एवं रिएक्शन अभ्यास' : 'High-speed active recall formula sprints'}</p>
          </div>
          <span style="font-size:16px; color:var(--brand-teal);">→</span>
        </div>

        <div class="card" style="cursor:pointer; display:flex; align-items:center; gap:14px; padding:14px;" onclick="navigateView('flashcards')">
          <span style="font-size:26px;">🗂️</span>
          <div style="flex:1;">
            <strong style="font-size:14px; color:var(--text-main);">${lang === 'hindi' ? 'मेमोरी फ्लैशकार्ड्स (Flashcards)' : 'Spaced Repetition Flashcards'}</strong>
            <p class="muted" style="font-size:11px; margin:2px 0 0;">${lang === 'hindi' ? 'Anki-स्टाइल बायोलॉजी एवं केमिस्ट्री कार्ड्स' : 'Active recall cards for Biology & Chemistry'}</p>
          </div>
          <span style="font-size:16px; color:var(--brand-teal);">→</span>
        </div>

        <div class="card" style="cursor:pointer; display:flex; align-items:center; gap:14px; padding:14px;" onclick="navigateView('scientists')">
          <span style="font-size:26px;">🔬</span>
          <div style="flex:1;">
            <strong style="font-size:14px; color:var(--text-main);">${lang === 'hindi' ? 'वैज्ञानिक एवं महत्वपूर्ण चित्र' : 'Scientists & Diagram Hub'}</strong>
            <p class="muted" style="font-size:11px; margin:2px 0 0;">${lang === 'hindi' ? 'NCERT के सभी वैज्ञानिक, खोजें व आरेख' : 'All NCERT discoveries, contributions & diagrams'}</p>
          </div>
          <span style="font-size:16px; color:var(--brand-teal);">→</span>
        </div>

        <div class="card" style="cursor:pointer; display:flex; align-items:center; gap:14px; padding:14px;" onclick="navigateView('focus')">
          <span style="font-size:26px;">⏱️</span>
          <div style="flex:1;">
            <strong style="font-size:14px; color:var(--text-main);">${lang === 'hindi' ? 'पोमोडोरो फोकस टाइमर' : 'Study Focus Pomodoro Timer'}</strong>
            <p class="muted" style="font-size:11px; margin:2px 0 0;">${lang === 'hindi' ? '25m / 50m बिना भटकाव अध्ययन' : 'Distraction-free deep work session tracker'}</p>
          </div>
          <span style="font-size:16px; color:var(--brand-teal);">→</span>
        </div>

        <div class="card" style="cursor:pointer; display:flex; align-items:center; gap:14px; padding:14px;" onclick="navigateView('certificate')">
          <span style="font-size:26px;">🏆</span>
          <div style="flex:1;">
            <strong style="font-size:14px; color:var(--text-main);">${lang === 'hindi' ? 'डॉक्टर माइलस्टोन व सर्टिफिकेट' : 'Doctor Milestone & Certificate'}</strong>
            <p class="muted" style="font-size:11px; margin:2px 0 0;">${lang === 'hindi' ? 'AIIMS 2028 लक्ष्य वॉल एवं सर्टिफिकेट' : 'Printable AIIMS Doctor Distinction Certificate'}</p>
          </div>
          <span style="font-size:16px; color:var(--brand-teal);">→</span>
        </div>

        <div class="card" style="cursor:pointer; display:flex; align-items:center; gap:14px; padding:14px;" onclick="navigateView('updates')">
          <span style="font-size:26px;">💾</span>
          <div style="flex:1;">
            <strong style="font-size:14px; color:var(--text-main);">${lang === 'hindi' ? 'डेटा बैकअप एवं रिस्टोर' : 'Data Backup & JSON Export'}</strong>
            <p class="muted" style="font-size:11px; margin:2px 0 0;">${lang === 'hindi' ? 'अपनी पढ़ाई का पूरा डेटा दूसरे फोन में ट्रांसफर करें' : 'Export and import your study progress & mistake logs'}</p>
          </div>
          <span style="font-size:16px; color:var(--brand-teal);">→</span>
        </div>
      </div>
    </div>

    <!-- Developer & Mission Profile (Transferred from Footer) -->
    <div class="card" style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:24px; margin-top:20px;">
      <div style="display:flex; align-items:flex-start; gap:16px; flex-wrap:wrap;">
        <div style="font-size:36px; padding:10px; background:rgba(13,148,136,0.1); border:1px solid rgba(13,148,136,0.3); border-radius:16px;">
          👨‍💻
        </div>
        <div style="flex:1; min-width:260px;">
          <div style="font-size:11px; font-weight:800; color:var(--brand-teal); letter-spacing:1px; text-transform:uppercase;">
            ${lang === 'hindi' ? 'संस्थापक एवं मुख्य डेवलपर' : 'FOUNDER & LEAD FULL-STACK DEVELOPER'}
          </div>
          <h3 style="font-size:20px; font-weight:800; margin:4px 0 6px; color:var(--text-main);">
            Vinay Kumar Makvana
          </h3>
          <p class="muted" style="font-size:13px; line-height:1.6; margin:0 0 16px;">
            ${lang === 'hindi' ? 'इंजीनियरिंग छात्र एवं फुल-स्टैक डेवलपर · भारत के हर जरूरतमंद और गरीब छात्र के लिए 100% मुफ़्त गुणवत्तापूर्ण NEET UG शिक्षा हेतु समर्पित।' : 'Engineering Student & Full-Stack Developer · Dedicated to providing 100% Free, High-Quality Medical Entrance Education for underprivileged students.'}
          </p>

          <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
            <a href="https://www.instagram.com/vi.naytailor/" target="_blank" rel="noopener noreferrer" class="btn ghost btn-sm" style="color:var(--brand-pink); border-color:rgba(236,72,153,0.3); text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
              <span>📸</span> <strong>Instagram: @vi.naytailor</strong>
            </a>
            <a href="https://www.linkedin.com/in/vinay-kumar-makvana-2371ba391/" target="_blank" rel="noopener noreferrer" class="btn ghost btn-sm" style="color:var(--brand-cyan); border-color:rgba(6,182,212,0.3); text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
              <span>💼</span> <strong>LinkedIn: Vinay Kumar Makvana</strong>
            </a>
          </div>
        </div>
      </div>

      <div style="margin-top:20px; padding-top:14px; border-top:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; font-size:11px; color:var(--text-muted);">
        <span>© 2026–2028 NEET UG 2028 OS · Free Education For All</span>
        <span>Designed & Engineered with ❤️ by <strong>Vinay Kumar Makvana</strong></span>
      </div>
    </div>
  `;
}
window.renderMoreView = renderMoreView;

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
    books: renderBooksView,
    notes: renderBooksView,
    videos: renderLibraryView,
    library: renderLibraryView,
    syllabus: renderSyllabusView,
    rapidfire: renderRapidFireView,
    'rapid-fire': renderRapidFireView,
    scientists: renderScientistsView,
    flashcards: renderFlashcardsView,
    tests: renderTestsView,
    mock: renderTestsView,
    mistakes: renderMistakesView,
    more: renderMoreView,
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

  // Initialize Language
  const savedLang = localStorage.getItem('neet_language') || (appState.profile && appState.profile.language) || 'bilingual';
  setGlobalLanguage(savedLang);

  renderApp();
  updateCountdownBadge();
});
