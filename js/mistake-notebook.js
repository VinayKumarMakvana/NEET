/**
 * NEET UG 2028: Mistake Notebook & Error Elimination OS
 * Every 720/720 Topper's Secret: Continuous Error Analysis & Root Cause Remediation
 */

const MistakeNotebook = {
  getMistakes() {
    if (typeof appState === 'undefined' || !appState.mistakes) return [];
    return appState.mistakes;
  },

  addMistake(mistakeObj) {
    if (typeof appState === 'undefined') return;
    appState.mistakes = appState.mistakes || [];
    
    // Avoid exact duplicate question entries if not resolved
    const existing = appState.mistakes.find(m => m.questionId === mistakeObj.questionId && !m.resolved);
    if (!existing) {
      appState.mistakes.unshift({
        id: 'm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        ...mistakeObj,
        reason: mistakeObj.reason || 'Conceptual Gap',
        resolved: false,
        notes: ''
      });
      if (typeof saveState === 'function') saveState();
    }
  },

  setReason(mistakeId, reason) {
    const m = this.getMistakes().find(x => x.id === mistakeId);
    if (m) {
      m.reason = reason;
      if (typeof saveState === 'function') saveState();
      if (typeof renderApp === 'function') renderApp();
    }
  },

  setNotes(mistakeId, notes) {
    const m = this.getMistakes().find(x => x.id === mistakeId);
    if (m) {
      m.notes = notes;
      if (typeof saveState === 'function') saveState();
    }
  },

  toggleResolved(mistakeId) {
    const m = this.getMistakes().find(x => x.id === mistakeId);
    if (m) {
      m.resolved = !m.resolved;
      if (typeof saveState === 'function') saveState();
      if (typeof renderApp === 'function') renderApp();
    }
  },

  deleteMistake(mistakeId) {
    if (typeof appState === 'undefined') return;
    appState.mistakes = (appState.mistakes || []).filter(m => m.id !== mistakeId);
    if (typeof saveState === 'function') saveState();
    if (typeof renderApp === 'function') renderApp();
  },

  renderMistakeList(filterSubject = 'All', showResolved = false) {
    let list = this.getMistakes();
    if (filterSubject !== 'All') {
      list = list.filter(m => m.subject.includes(filterSubject) || m.subjectCode === filterSubject);
    }
    if (!showResolved) {
      list = list.filter(m => !m.resolved);
    }

    if (!list.length) {
      return `
        <div class="card" style="text-align:center; padding:48px 20px;">
          <p style="font-size:40px; margin-bottom:12px;">🩺✨</p>
          <h3>No Unresolved Mistakes in this category!</h3>
          <p class="muted">All logged errors are either resolved or you have a clean slate. Take a Mock Test to test your limits!</p>
          <button style="margin-top:16px;" onclick="navigateView('tests')">Launch Mock Test</button>
        </div>
      `;
    }

    return `
      <div class="list">
        ${list.map(m => `
          <div class="item ${m.resolved ? 'completed' : ''}" style="display:block;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; gap:12px;">
              <div>
                <span class="tag ${m.subjectCode || 'phy'}">${escapeHtml(m.subject)}</span>
                <span class="tag" style="margin-left:6px;">${escapeHtml(m.chapter)}</span>
              </div>
              <div style="display:flex; gap:8px;">
                <button class="ghost" style="padding:4px 10px; font-size:12px;" onclick="MistakeNotebook.toggleResolved('${m.id}')">
                  ${m.resolved ? 'Mark Unresolved' : '✓ Mark Concept Mastered'}
                </button>
                <button class="ghost btn-danger" style="padding:4px 8px; font-size:12px;" onclick="MistakeNotebook.deleteMistake('${m.id}')">✕</button>
              </div>
            </div>

            <div class="bilingual-q-container" style="display:flex; flex-direction:column; gap:6px; margin-bottom:10px;">
              <p style="font-size:14px; font-weight:600; margin:0; line-height:1.5; color:var(--text-main);">${escapeHtml(m.question || m.questionText)}</p>
              ${(m.questionTextHi || m.questionHi) ? `
                <div style="font-size:13px; color:#38bdf8; background:rgba(56, 189, 248, 0.08); padding:6px 10px; border-radius:6px; border-left:3px solid #38bdf8; line-height:1.4;">
                  🇮🇳 ${escapeHtml(m.questionTextHi || m.questionHi)}
                </div>
              ` : ''}
            </div>

            <div style="font-size:13px; color:var(--text-muted); background:var(--bg-secondary); padding:10px 12px; border-radius:8px; margin-bottom:10px; border:1px solid var(--border-color);">
              <div style="color:var(--brand-red); margin-bottom:4px;">
                <b>Your past answer:</b> ${escapeHtml(m.userSelected || m.userAnswer || 'Incorrect')} 
                ${(m.userAnswerHi) ? `<span style="opacity:0.8;">(${escapeHtml(m.userAnswerHi)})</span>` : ''}
              </div>
              <div style="color:var(--brand-emerald); font-weight:600;">
                <b>Correct answer:</b> ${escapeHtml(m.correctAnswer)} 
                ${(m.correctAnswerHi) ? `<span style="opacity:0.8;">(${escapeHtml(m.correctAnswerHi)})</span>` : ''}
              </div>
            </div>

            <div class="callout" style="font-size:12.5px; margin:8px 0; padding:10px 12px;">
              <strong>📖 NCERT Key Takeaway:</strong> ${escapeHtml(m.explanation)}
              ${(m.explanationHi) ? `<div style="color:var(--text-muted); margin-top:4px;"><b>हिंदी व्याख्या:</b> ${escapeHtml(m.explanationHi)}</div>` : ''}
              <span class="ncert-highlight" style="font-size:11px; margin-top:6px; display:inline-block;">📖 ${escapeHtml(m.ncertRef || 'NCERT Master Text')}</span>
            </div>

            <div style="display:flex; gap:10px; align-items:center; margin-top:12px; flex-wrap:wrap;">
              <label style="font-size:12px; color:var(--text-muted); display:flex; align-items:center; gap:4px;">
                <span>Mistake Type:</span>
                <select style="padding:4px 8px; font-size:12px; border-radius:6px; background:var(--bg-secondary); color:var(--text-main); border:1px solid var(--border-color);" onchange="MistakeNotebook.setReason('${m.id}', this.value)">
                  <option value="Conceptual Gap" ${m.reason === 'Conceptual Gap' ? 'selected' : ''}>Conceptual Gap</option>
                  <option value="Calculation Error" ${m.reason === 'Calculation Error' ? 'selected' : ''}>Calculation Error</option>
                  <option value="Silly Mistake / Misread" ${m.reason === 'Silly Mistake / Misread' ? 'selected' : ''}>Silly Mistake / Misread</option>
                  <option value="Time Rush" ${m.reason === 'Time Rush' ? 'selected' : ''}>Time Rush / Guess</option>
                </select>
              </label>

              <input 
                type="text" 
                placeholder="Add your personalized NCERT correction note..." 
                value="${escapeHtml(m.notes || '')}" 
                style="flex:1; min-width:180px; padding:6px 12px; font-size:12px; border-radius:6px; background:var(--bg-secondary); color:var(--text-main); border:1px solid var(--border-color);" 
                onchange="MistakeNotebook.setNotes('${m.id}', this.value)"
              >
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
};
