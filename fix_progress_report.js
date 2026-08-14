const fs = require('fs');
let mainPath = 'js/main.js';
let mainContent = fs.readFileSync(mainPath, 'utf8');

// 1. Inject calculation logic into renderHomeView()
if (!mainContent.includes('totalAttempted = 0;')) {
  const calcLogic = `
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
  `;
  mainContent = mainContent.replace(
    /const session = window\.activeStudySession;/g,
    `const session = window.activeStudySession;\n${calcLogic}`
  );

  // 2. Inject HTML into renderHomeView return string
  const htmlInject = `
    <!-- User Progress Analytics -->
    <div style="background:var(--bg-card); border:1px solid var(--brand-indigo); border-radius:14px; padding:16px 20px; margin-bottom:24px;">
      <h3 style="font-size:16px; font-weight:800; color:var(--brand-indigo); margin-top:0; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
        <i class="ph-fill ph-chart-line-up"></i> My Progress Analytics Report
      </h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(100px, 1fr)); gap:12px;">
        <div class="stat-tile" style="background:rgba(99,102,241,0.1); border-left:3px solid var(--brand-indigo); padding:10px;">
          <strong style="font-size:22px; color:var(--brand-indigo);">\${totalTests}</strong>
          <span style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Tests Taken</span>
        </div>
        <div class="stat-tile" style="background:rgba(56,189,248,0.1); border-left:3px solid var(--brand-sky); padding:10px;">
          <strong style="font-size:22px; color:var(--brand-sky);">\${totalAttempted}</strong>
          <span style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Qs Attempted</span>
        </div>
        <div class="stat-tile" style="background:rgba(16,185,129,0.1); border-left:3px solid var(--brand-emerald); padding:10px;">
          <strong style="font-size:22px; color:var(--brand-emerald);">\${totalCorrect}</strong>
          <span style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Right Answers</span>
        </div>
        <div class="stat-tile" style="background:rgba(245,158,11,0.1); border-left:3px solid var(--brand-gold); padding:10px;">
          <strong style="font-size:22px; color:var(--brand-gold);">\${avgAccuracy}%</strong>
          <span style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Avg Accuracy</span>
        </div>
      </div>
    </div>

    <!-- Core Medical Modules Grid -->`;

  mainContent = mainContent.replace(
    /<!-- Core Medical Modules Grid -->/g,
    htmlInject
  );

  fs.writeFileSync(mainPath, mainContent);
  console.log('Progress Report successfully injected into main.js!');
} else {
  console.log('Progress Report was already injected.');
}
