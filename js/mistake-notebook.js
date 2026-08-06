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

            <p style="font-size:14px; font-weight:600; margin-bottom:8px;">${escapeHtml(m.question)}</p>

            <div style="font-size:13px; color:var(--text-muted); background:var(--bg-secondary); padding:10px; border-radius:8px; margin-bottom:10px;">
              <div style="color:var(--brand-red);">Your past answer: <strong>${escapeHtml(m.userSelected || 'Incorrect')}</strong></div>
              <div style="color:var(--brand-emerald); margin-top:2px;">Correct answer: <strong>${escapeHtml(m.correctAnswer)}</strong></div>
            </div>

            <div class="callout" style="font-size:12px; margin:8px 0;">
              <strong>Key Takeaway:</strong> ${escapeHtml(m.explanation)}<br>
              <span class="ncert-highlight" style="font-size:11px; margin-top:4px; display:inline-block;">📖 ${escapeHtml(m.ncertRef || 'NCERT Chapter')}</span>
            </div>

            <div style="display:flex; gap:12px; align-items:center; margin-top:12px; flex-wrap:wrap;">
              <label style="font-size:12px; color:var(--text-muted);">
                Mistake Type:
                <select style="margin-left:6px; padding:4px 8px; font-size:12px; border-radius:6px;" onchange="MistakeNotebook.setReason('${m.id}', this.value)">
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
                style="flex:1; min-width:200px; padding:6px 12px; font-size:12px;" 
                onchange="MistakeNotebook.setNotes('${m.id}', this.value)"
              >
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
};
