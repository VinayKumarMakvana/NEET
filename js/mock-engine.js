/**
 * NEET UG 2028: NTA Standard Timed Mock Test & Hierarchical Testing Engine
 * Section A & B format, +4/-1 Negative Marking, Virtual OMR, Tree Analytics & Mistake Notebook Sync
 */

const MockTestEngine = {
  currentTest: null,
  timerInterval: null,
  isOmrMode: false,

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
  },

  // Universal Entrypoint for Hierarchical 6-Level Tests
  async initHierarchicalTest(params) {
    if (typeof ClerkAuth !== 'undefined' && typeof ClerkAuth.isAuthenticated === 'function' && !ClerkAuth.isAuthenticated()) {
      if (typeof ClerkAuth.openSignIn === 'function') {
        ClerkAuth.openSignIn();
      }
      return;
    }

    if (params.level >= 4) {
      const currentUser = ClerkAuth.getCurrentUser();
      const isPremium = currentUser && new Date(currentUser.subscriptionExpiry) > new Date();
      if (!isPremium) {
        if (typeof PaymentEngine !== 'undefined' && typeof PaymentEngine.openCheckoutModal === 'function') {
          PaymentEngine.openCheckoutModal();
        } else {
          alert('This test requires NEET OS Premium (Rs. 99/Year). Please upgrade.');
        }
        return;
      }
    }

    const {
      level = 1,
      testId = `test_${Date.now()}`,
      title = 'NEET Practice Test',
      subjectCode = 'all',
      subjectsList = null,
      count = 10,
      attemptTarget = null,
      totalMarks = null,
      durationMinutes = 15,
      drillType = 'standard',
      topicTitle = null,
      chapterTitle = null,
      chapterId = null,
      mockNum = null
    } = params;

    if (window.showToast) window.showToast('Generating AI Test Questions...', 2000);

    let questions = [];
    if (typeof getQuestionsForHierarchicalTest === 'function') {
      const res = getQuestionsForHierarchicalTest(params);
      if (res instanceof Promise) {
        questions = await res;
      } else {
        questions = res;
      }
    } else {
      questions = typeof NEET_QUESTIONS !== 'undefined' ? NEET_QUESTIONS.slice(0, count) : [];
    }

    const finalCount = questions.length || count;
    const maxScore = totalMarks || (finalCount * 4);

    this.currentTest = {
      level,
      testId,
      title,
      subjectCode,
      subjectsList,
      drillType,
      topicTitle,
      chapterTitle,
      chapterId,
      mockNum,
      questions,
      userAnswers: {}, // { [qIndex]: selectedOptionIndex }
      markedForReview: {},
      currentIndex: 0,
      totalQuestions: finalCount,
      attemptTarget: attemptTarget || finalCount,
      maxScore,
      durationSeconds: durationMinutes * 60,
      remainingSeconds: durationMinutes * 60,
      startTime: new Date().toISOString(),
      isSubmitted: false,
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      unattemptedCount: 0,
      percentage: 0
    };

    window.activeTest = this.currentTest;
    this.startTimer();
    this.renderExamInterface();
  },

  // Legacy compatibility for simple subject drills
  initTest(subjectCode = 'all', count = 10, durationMinutes = 20, drillType = 'standard') {
    let title = 'Subject Drill';
    if (drillType === 'ar_statements') title = 'Assertion-Reason & Statement Drill';
    else if (drillType === 'pyq_sprint') title = '10-Year High-Repeat PYQ Sprint';
    else if (subjectCode !== 'all') title = `${subjectCode.toUpperCase()} Practice Drill`;
    else title = 'Mixed Subject Grand Drill';

    this.initHierarchicalTest({
      level: 2,
      testId: `drill_${subjectCode}_${Date.now()}`,
      title,
      subjectCode,
      count,
      durationMinutes,
      drillType
    });
  },

  toggleOmrMode() {
    this.isOmrMode = !this.isOmrMode;
    this.renderExamInterface();
  },

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.currentTest || this.currentTest.isSubmitted) {
        clearInterval(this.timerInterval);
        return;
      }
      this.currentTest.remainingSeconds--;
      this.updateTimerDisplay();

      if (this.currentTest.remainingSeconds <= 0) {
        clearInterval(this.timerInterval);
        alert('⏱️ Time is UP! NTA strict exam timer expired. Auto-submitting your test now.');
        this.submitTest();
      }
    }, 1000);
  },

  updateTimerDisplay() {
    const timerEl = document.getElementById('examTimerDisplay');
    if (!timerEl || !this.currentTest) return;
    const m = Math.floor(this.currentTest.remainingSeconds / 60);
    const s = this.currentTest.remainingSeconds % 60;
    timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  renderExamInterface() {
    const test = this.currentTest;
    if (!test) return;

    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody) return;
    if (!modal.open) modal.showModal();

    const q = test.questions[test.currentIndex];
    const qNum = test.currentIndex + 1;
    const selectedAns = test.userAnswers[test.currentIndex];
    const isMarked = !!test.markedForReview[test.currentIndex];
    // Header badge
    let drillBadge = `LEVEL ${test.level} · EXAM`;
    if (test.level === 1) drillBadge = 'LEVEL 1 · TOPIC MICRO-TEST';
    else if (test.level === 2) drillBadge = 'LEVEL 2 · CHAPTER MILESTONE EXAM';
    else if (test.level === 3) drillBadge = 'LEVEL 3 · SINGLE SUBJECT MASTERY';
    else if (test.level === 4) drillBadge = 'LEVEL 4 · 2-SUBJECT COMBINATION';
    else if (test.level === 5) drillBadge = 'LEVEL 5 · 3-SUBJECT PCB COMBINATION';
    else if (test.level === 6) drillBadge = `LEVEL 6 · PRE-NEET GRAND MOCK 0${test.mockNum || 1}`;

    let ntaSectionBadge = '';
    let currentActiveTab = 'phy';
    if (test.level === 6 && test.totalQuestions === 200) {
      const qIdx = test.currentIndex;
      let subjName = '';
      let isSecB = false;
      if (qIdx <= 49) { subjName = 'Physics'; isSecB = qIdx >= 35; currentActiveTab = 'phy'; }
      else if (qIdx <= 99) { subjName = 'Chemistry'; isSecB = qIdx >= 85; currentActiveTab = 'chem'; }
      else if (qIdx <= 149) { subjName = 'Botany'; isSecB = qIdx >= 135; currentActiveTab = 'bot'; }
      else { subjName = 'Zoology'; isSecB = qIdx >= 185; currentActiveTab = 'zoo'; }
      
      ntaSectionBadge = `<span class="tag-badge ${isSecB ? 'tag-high' : 'tag-adv'}" style="margin-left:8px; font-size:12px; background: ${isSecB ? '#ef4444' : '#10b981'}; color: #fff;">${subjName} - Section ${isSecB ? 'B (Attempt Any 10)' : 'A (Compulsory)'}</span>`;
    }


    modalBody.innerHTML = `
      <div class="test-arena-header" style="border-bottom:1px solid var(--border-color); padding-bottom:12px; margin-bottom:16px;">
        <div>
        <div style="display:flex; justify-content:space-between; align-items:center; width: 100%;">
          <div>
            <span class="eyebrow" style="color:var(--brand-gold);">${drillBadge}</span> ${ntaSectionBadge}
          </div>
          <button class="btn ghost btn-sm" style="color:var(--brand-rose); border:1px solid rgba(244,63,94,0.3); font-size:11px;" onclick="if(confirm('Are you sure you want to exit? Your progress will be saved.')){ document.getElementById('modal').close(); MockTestEngine.submitTest(); }">Exit Test ✖</button>
        </div>
          <h3 style="font-size:17px; margin:4px 0 0; word-break:break-word;">${escapeHtml(test.title)}</h3>
        </div>
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <button class="btn ghost btn-sm" style="font-size:11px;" onclick="MockTestEngine.toggleOmrMode()">
            📝 ${this.isOmrMode ? 'Interactive View' : 'Virtual OMR'}
          </button>
          <div class="exam-timer" id="examTimerDisplay" style="font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:800; color:var(--brand-emerald); background:var(--bg-secondary); padding:4px 10px; border-radius:8px; border:1px solid var(--border-color);">
            --:--
          </div>
        </div>
      </div>

      <div class="test-grid ${this.isOmrMode ? 'test-grid-omr' : ''}" style="display:grid; grid-template-columns:${this.isOmrMode ? '1fr 280px' : '1fr 220px'}; gap:16px;">
        <!-- Left: Question Container -->
        <div class="question-box" style="min-width:0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:6px;">
            <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
              <span class="tag ${q.subjectCode || 'phy'}">${q.subject || 'NEET'}</span>
              <span class="tag" style="font-size:11px; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(q.chapter || 'Syllabus')}</span>
              ${q.tag ? `<span class="tag gold" style="font-weight:700;"><i class="fas fa-fire"></i> ${q.tag}</span>` : ''}
              ${q.questionType ? `<span class="tag" style="background:rgba(99,102,241,0.12); color:#818cf8; text-transform:uppercase; font-size:10px;">${q.questionType.replace('-', ' ')}</span>` : ''}
            </div>
            <span class="tag gold" style="font-weight:800; font-size:11px;">+4 / -1 Mark</span>
          </div>

          <div class="bilingual-q-container" style="display:flex; flex-direction:column; gap:8px; margin-bottom:14px;">
            <div style="display:flex; align-items:baseline; gap:8px;">
              <span style="font-family:'Outfit',sans-serif; font-size:18px; font-weight:800; color:var(--brand-teal);">Q.${qNum}</span>
              <p class="question-text-en" style="font-size:15px; font-weight:600; line-height:1.6; white-space:pre-line; color:var(--text-main); margin:0;">${escapeHtml(q.question)}</p>
            </div>
            ${q.questionHi ? `
              <div class="question-text-hi" style="margin-left:32px; font-size:14px; font-weight:500; line-height:1.6; color:#38bdf8; background:rgba(56, 189, 248, 0.08); padding:8px 12px; border-radius:8px; border-left:3px solid #38bdf8; white-space:pre-line;">
                <span style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; opacity:0.85; display:block; margin-bottom:2px;">🇮🇳 हिंदी (Hindi Translation):</span>
                ${escapeHtml(q.questionHi)}
              </div>
            ` : ''}
          </div>

          <div class="list" style="display:flex; flex-direction:column; gap:8px; margin:16px 0;">
            ${q.options.map((opt, i) => `
              <button 
                type="button"
                class="option-btn ${selectedAns === i ? 'selected' : ''}" 
                style="display:flex; flex-direction:column; gap:4px; padding:12px 14px; text-align:left; border-radius:10px; border:1px solid ${selectedAns === i ? 'var(--brand-emerald)' : 'var(--border-color)'}; background:${selectedAns === i ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-secondary)'}; color:var(--text-main); cursor:pointer; transition:all 0.2s;"
                onclick="MockTestEngine.selectAnswer(${i})"
              >
                <div style="display:flex; align-items:flex-start; gap:10px; width:100%;">
                  <strong style="font-family:'JetBrains Mono',monospace; color:${selectedAns === i ? 'var(--brand-emerald)' : 'var(--brand-teal)'}; min-width:20px;">${String.fromCharCode(65 + i)}.</strong>
                  <span style="font-size:13.5px; line-height:1.4; font-weight:600;">${escapeHtml(opt)}</span>
                </div>
                ${q.optionsHi && q.optionsHi[i] ? `
                  <div style="padding-left:30px; font-size:12.5px; line-height:1.4; color:var(--text-muted); border-top:1px dashed rgba(255,255,255,0.08); padding-top:4px; margin-top:2px;">
                    ${escapeHtml(q.optionsHi[i])}
                  </div>
                ` : ''}
              </button>
            `).join('')}
          </div>

          <!-- Bottom Control Bar -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; flex-wrap:wrap; gap:8px; border-top:1px solid var(--border-color); padding-top:14px;">
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button class="btn ghost btn-sm" onclick="MockTestEngine.prevQuestion()" ${test.currentIndex === 0 ? 'disabled' : ''}>← Prev</button>
              <button class="btn ghost btn-sm" onclick="MockTestEngine.toggleReview()">${isMarked ? '★ Marked' : '☆ Mark Review'}</button>
              <button class="btn ghost btn-sm" onclick="MockTestEngine.clearAnswer()">Clear</button>
            </div>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-primary btn-sm" onclick="MockTestEngine.nextQuestion()">${test.currentIndex === test.totalQuestions - 1 ? 'Finish & Review' : 'Save & Next →'}</button>
              <button class="btn-danger btn-sm" onclick="MockTestEngine.confirmSubmit()">Submit</button>
            </div>
          </div>
        </div>

        <!-- Right: Question Palette / OMR -->
        ${this.isOmrMode ? `
          <div class="card omr-side-container" id="mock-omr-target" style="padding:12px; max-height:480px; overflow-y:auto;"></div>
        ` : `
          <div class="card" style="padding:12px; max-height:480px; overflow-y:auto;">
            
            <h4 style="font-size:12px; margin-bottom:10px; color:var(--text-muted); letter-spacing:0.5px;"><i class="fas fa-th"></i> QUESTION PALETTE</h4>
            ${test.level === 6 && test.totalQuestions === 200 ? `
              <div style="display:flex; gap:4px; margin-bottom:8px; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
                <button onclick="MockTestEngine.jumpTo(0)" style="flex:1; font-size:9px; padding:4px; border-radius:4px; cursor:pointer; background:${currentActiveTab==='phy'?'var(--brand-teal)':'var(--bg-surface)'}; color:${currentActiveTab==='phy'?'#fff':'var(--text-muted)'}; border:1px solid var(--border-color);">PHY</button>
                <button onclick="MockTestEngine.jumpTo(50)" style="flex:1; font-size:9px; padding:4px; border-radius:4px; cursor:pointer; background:${currentActiveTab==='chem'?'var(--brand-teal)':'var(--bg-surface)'}; color:${currentActiveTab==='chem'?'#fff':'var(--text-muted)'}; border:1px solid var(--border-color);">CHEM</button>
                <button onclick="MockTestEngine.jumpTo(100)" style="flex:1; font-size:9px; padding:4px; border-radius:4px; cursor:pointer; background:${currentActiveTab==='bot'?'var(--brand-teal)':'var(--bg-surface)'}; color:${currentActiveTab==='bot'?'#fff':'var(--text-muted)'}; border:1px solid var(--border-color);">BOT</button>
                <button onclick="MockTestEngine.jumpTo(150)" style="flex:1; font-size:9px; padding:4px; border-radius:4px; cursor:pointer; background:${currentActiveTab==='zoo'?'var(--brand-teal)':'var(--bg-surface)'}; color:${currentActiveTab==='zoo'?'#fff':'var(--text-muted)'}; border:1px solid var(--border-color);">ZOO</button>
              </div>
              <div class="question-palette" style="display:grid; grid-template-columns:repeat(5, 1fr); gap:4px;">
                ${(() => {
                   let start = currentActiveTab === 'phy' ? 0 : currentActiveTab === 'chem' ? 50 : currentActiveTab === 'bot' ? 100 : 150;
                   let html = '<div style="grid-column: span 5; font-size:10px; color:var(--text-muted); text-align:center; padding:4px 0;">Section A</div>';
                   for(let i=0; i<35; i++) {
                     const idx = start + i;
                     let bg = 'var(--bg-secondary)'; let border = 'var(--border-color)'; let color = 'var(--text-muted)';
                     if (idx === test.currentIndex) { border = 'var(--brand-teal)'; color = 'var(--brand-teal)'; }
                     if (test.userAnswers[idx] !== undefined) { bg = 'var(--brand-emerald)'; border = 'var(--brand-emerald)'; color = '#ffffff'; }
                     else if (test.markedForReview[idx]) { bg = 'var(--brand-purple)'; border = 'var(--brand-purple)'; color = '#ffffff'; }
                     html += `<button class="palette-btn" style="padding:4px 0; font-size:10px; font-weight:700; border-radius:4px; background:${bg}; border:1px solid ${border}; color:${color}; cursor:pointer;" onclick="MockTestEngine.jumpTo(${idx})">${idx + 1}</button>`;
                   }
                   html += '<div style="grid-column: span 5; font-size:10px; color:#ef4444; text-align:center; padding:4px 0; margin-top:4px;">Section B (Attempt Any 10)</div>';
                   for(let i=35; i<50; i++) {
                     const idx = start + i;
                     let bg = 'var(--bg-secondary)'; let border = 'var(--border-color)'; let color = 'var(--text-muted)';
                     if (idx === test.currentIndex) { border = 'var(--brand-teal)'; color = 'var(--brand-teal)'; }
                     if (test.userAnswers[idx] !== undefined) { bg = 'var(--brand-emerald)'; border = 'var(--brand-emerald)'; color = '#ffffff'; }
                     else if (test.markedForReview[idx]) { bg = 'var(--brand-purple)'; border = 'var(--brand-purple)'; color = '#ffffff'; }
                     html += `<button class="palette-btn" style="padding:4px 0; font-size:10px; font-weight:700; border-radius:4px; background:${bg}; border:1px solid ${border}; color:${color}; cursor:pointer;" onclick="MockTestEngine.jumpTo(${idx})">${idx + 1}</button>`;
                   }
                   return html;
                })()}
              </div>
            ` : `
            <div class="question-palette" style="display:grid; grid-template-columns:repeat(5, 1fr); gap:4px;">
              ${test.questions.map((_, idx) => {
                let bg = 'var(--bg-secondary)';
                let border = 'var(--border-color)';
                let color = 'var(--text-muted)';
                if (idx === test.currentIndex) {
                  border = 'var(--brand-teal)';
                  color = 'var(--brand-teal)';
                }
                if (test.userAnswers[idx] !== undefined) {
                  bg = 'var(--brand-emerald)';
                  border = 'var(--brand-emerald)';
                  color = '#ffffff';
                } else if (test.markedForReview[idx]) {
                  bg = 'var(--brand-purple)';
                  border = 'var(--brand-purple)';
                  color = '#ffffff';
                }
                return `
                  <button 
                    class="palette-btn" 
                    style="padding:6px 0; font-size:11px; font-weight:700; border-radius:6px; background:${bg}; border:1px solid ${border}; color:${color}; cursor:pointer;"
                    onclick="MockTestEngine.jumpTo(${idx})"
                  >
                    ${idx + 1}
                  </button>
                `;
              }).join('')}
            </div>
            `}

<div style="margin-top:14px; font-size:11px; display:flex; flex-direction:column; gap:4px; color:var(--text-muted);">
              <div style="display:flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; background:var(--brand-emerald); border-radius:2px;"></span> Answered</div>
              <div style="display:flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; background:var(--brand-purple); border-radius:2px;"></span> Marked for Review</div>
              <div style="display:flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:2px;"></span> Unanswered</div>
            </div>
          </div>
        `}
      </div>
    `;

    this.updateTimerDisplay();

    if (this.isOmrMode && window.omrEngine) {
      window.omrEngine.renderOMR('mock-omr-target');
    }

    },
  selectAnswer(index) {
    if (!this.currentTest) return;
    
    // NTA Section B Rule Logic
    if (this.currentTest.level === 6 && this.currentTest.totalQuestions === 200) {
      const qIdx = this.currentTest.currentIndex;
      const isSectionB = (qIdx >= 35 && qIdx <= 49) || 
                         (qIdx >= 85 && qIdx <= 99) || 
                         (qIdx >= 135 && qIdx <= 149) || 
                         (qIdx >= 185 && qIdx <= 199);
      
      if (isSectionB) {
        let startIdx = 0;
        if (qIdx <= 49) startIdx = 35;
        else if (qIdx <= 99) startIdx = 85;
        else if (qIdx <= 149) startIdx = 135;
        else startIdx = 185;
        
        let answeredCount = 0;
        for (let i = startIdx; i < startIdx + 15; i++) {
          if (this.currentTest.userAnswers[i] !== undefined && i !== qIdx) {
            answeredCount++;
          }
        }
        
        if (answeredCount >= 10 && this.currentTest.userAnswers[qIdx] === undefined) {
          alert('⚠️ NTA Rule: You can only attempt 10 questions in Section B. Please clear an earlier answer to attempt this one.');
          return;
        }
      }
    }
    
    this.currentTest.userAnswers[this.currentTest.currentIndex] = index;
    if (window.omrEngine) {
      window.omrEngine.bubbles[this.currentTest.currentIndex] = index;
    }
    this.renderExamInterface();
  },


  clearAnswer() {
    if (!this.currentTest) return;
    delete this.currentTest.userAnswers[this.currentTest.currentIndex];
    if (window.omrEngine) {
      delete window.omrEngine.bubbles[this.currentTest.currentIndex];
    }
    this.renderExamInterface();
  },

  toggleReview() {
    if (!this.currentTest) return;
    const cur = this.currentTest.currentIndex;
    this.currentTest.markedForReview[cur] = !this.currentTest.markedForReview[cur];
    this.renderExamInterface();
  },

  prevQuestion() {
    if (!this.currentTest || this.currentTest.currentIndex <= 0) return;
    this.currentTest.currentIndex--;
    this.renderExamInterface();
  },

  nextQuestion() {
    if (!this.currentTest) return;
    if (this.currentTest.currentIndex < this.currentTest.totalQuestions - 1) {
      this.currentTest.currentIndex++;
      this.renderExamInterface();
    } else {
      this.confirmSubmit();
    }
  },

  jumpTo(index) {
    if (!this.currentTest || index < 0 || index >= this.currentTest.totalQuestions) return;
    this.currentTest.currentIndex = index;
    this.renderExamInterface();
  },

  confirmSubmit() {
    if (!this.currentTest) return;
    const test = this.currentTest;
    const answeredCount = Object.keys(test.userAnswers).length;
    const markedCount = Object.values(test.markedForReview).filter(Boolean).length;
    const leftCount = test.totalQuestions - answeredCount;

    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody) return;
    if (!modal.open) modal.showModal();

    modalBody.innerHTML = `
      <div style="text-align:center; padding:10px 0;">
        <div style="font-size:36px; margin-bottom:8px;">📊</div>
        <h3 style="margin-bottom:6px;">Submit ${escapeHtml(test.title)}?</h3>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:16px;">Review your exam summary before final evaluation.</p>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:20px;">
          <div class="card" style="padding:10px; text-align:center;">
            <div style="font-size:20px; font-weight:800; color:var(--brand-emerald);">${answeredCount}</div>
            <div style="font-size:11px; color:var(--text-muted);">Answered</div>
          </div>
          <div class="card" style="padding:10px; text-align:center;">
            <div style="font-size:20px; font-weight:800; color:var(--brand-purple);">${markedCount}</div>
            <div style="font-size:11px; color:var(--text-muted);">Marked</div>
          </div>
          <div class="card" style="padding:10px; text-align:center;">
            <div style="font-size:20px; font-weight:800; color:var(--text-secondary);">${leftCount}</div>
            <div style="font-size:11px; color:var(--text-muted);">Unattempted</div>
          </div>
        </div>

        <div style="display:flex; justify-content:center; gap:10px;">
          <button class="btn ghost btn-sm" onclick="MockTestEngine.renderExamInterface()">← Back to Exam</button>
          <button class="btn-danger btn-sm" onclick="MockTestEngine.submitTest()">Confirm & Evaluate Score</button>
        </div>
      </div>
    `;
  },

  submitTest() {
    if (!this.currentTest) return;
    this.stopTimer();

    const test = this.currentTest;
    let correctCount = 0;
    let wrongCount = 0;
    let score = 0;
    const mistakes = [];

    test.questions.forEach((q, idx) => {
      const userAns = test.userAnswers[idx];
      if (userAns !== undefined) {
        if (userAns === q.correctIndex) {
          correctCount++;
          score += 4;
        } else {
          wrongCount++;
          score -= 1;
          mistakes.push({
            id: `mistake-${Date.now()}-${idx}`,
            questionId: q.id,
            questionText: q.question,
            questionTextHi: q.questionHi || null,
            subject: q.subject,
            subjectCode: q.subjectCode,
            chapter: q.chapter,
            userAnswer: q.options[userAns],
            userAnswerHi: q.optionsHi ? q.optionsHi[userAns] : null,
            correctAnswer: q.options[q.correctIndex],
            correctAnswerHi: q.optionsHi ? q.optionsHi[q.correctIndex] : null,
            explanation: q.explanation,
            explanationHi: q.explanationHi || null,
            ncertRef: q.ncertRef,
            testTitle: test.title,
            testLevel: test.level,
            timestamp: new Date().toISOString()
          });
        }
      }
    });

    const unattemptedCount = test.totalQuestions - (correctCount + wrongCount);
    const maxScore = test.totalQuestions * 4;
    const accuracy = (correctCount + wrongCount) > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;

    test.score = score;
    test.correctCount = correctCount;
    test.wrongCount = wrongCount;
    test.unattemptedCount = unattemptedCount;
    test.maxScore = maxScore;
    test.accuracy = accuracy;
    test.isCompleted = true;

    // Save test result to appState
    if (window.appState) {
      if (!window.appState.testHistory) window.appState.testHistory = [];
      window.appState.testHistory.unshift({
        id: test.id,
        title: test.title,
        level: test.level,
        score,
        maxScore,
        accuracy,
        correctCount,
        wrongCount,
        unattemptedCount,
        date: new Date().toLocaleDateString()
      });
      
      // Track attempt counts for intelligent repetition filtering (max 3 attempts)
      if (!window.appState.questionStats) window.appState.questionStats = {};
      test.questions.forEach(q => {
        const id = q.internal_id || q.id;
        if (id) {
          window.appState.questionStats[id] = (window.appState.questionStats[id] || 0) + 1;
        }
      });

      // Save mistakes to Mistake Notebook
      if (mistakes.length) {
        if (!window.appState.mistakes) window.appState.mistakes = [];
        window.appState.mistakes = [...mistakes, ...window.appState.mistakes].slice(0, 100);
      }

      // Record result into TestTreeEngine hierarchy
      if (window.TestTreeEngine && typeof window.TestTreeEngine.recordResult === 'function') {
        window.TestTreeEngine.recordResult({
          level: test.level,
          testId: test.id,
          score: score,
          maxScore: maxScore,
          percentage: accuracy,
          passed: accuracy >= 65,
          correct: correctCount,
          wrong: wrongCount,
          unattempted: unattemptedCount
        });
      }

      if (typeof window.saveState === 'function') window.saveState();
    }

    this.renderScorecard();
  },

  renderScorecard() {
    const test = this.currentTest;
    if (!test) return;

    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody) return;
    if (!modal.open) modal.showModal();

    const isPassed = test.accuracy >= 65;

    modalBody.innerHTML = `
      <div style="text-align:center; padding-bottom:12px; border-bottom:1px solid var(--border-color); margin-bottom:16px;">
        <span class="tag ${isPassed ? 'bot' : 'phy'}" style="font-size:12px; font-weight:800;">
          ${isPassed ? '🎯 LEVEL MILESTONE CRACKED!' : '⚠️ NCERT REVISION REQUIRED'}
        </span>
        <h2 style="font-size:22px; margin:8px 0 4px;">${escapeHtml(test.title)}</h2>
        <p style="font-size:13px; color:var(--text-muted); margin:0;">Level ${test.level} · Diagnostic Scorecard & AI Performance Audit</p>
      </div>

      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin-bottom:16px;">
        <div class="card" style="text-align:center; padding:12px; border-left:4px solid var(--brand-teal);">
          <div style="font-size:22px; font-weight:800; color:var(--brand-teal);">${test.score} / ${test.maxScore}</div>
          <div style="font-size:11px; color:var(--text-muted);">FINAL SCORE</div>
        </div>
        <div class="card" style="text-align:center; padding:12px; border-left:4px solid var(--brand-emerald);">
          <div style="font-size:22px; font-weight:800; color:var(--brand-emerald);">${test.correctCount}</div>
          <div style="font-size:11px; color:var(--text-muted);">CORRECT (+${test.correctCount * 4})</div>
        </div>
        <div class="card" style="text-align:center; padding:12px; border-left:4px solid var(--danger-color);">
          <div style="font-size:22px; font-weight:800; color:var(--danger-color);">${test.wrongCount}</div>
          <div style="font-size:11px; color:var(--text-muted);">NEGATIVE (-${test.wrongCount})</div>
        </div>
        <div class="card" style="text-align:center; padding:12px; border-left:4px solid var(--border-color);">
          <div style="font-size:22px; font-weight:800; color:var(--text-secondary);">${test.unattemptedCount}</div>
          <div style="font-size:11px; color:var(--text-muted);">SKIPPED (0)</div>
        </div>
      </div>

      <h3 style="font-size:15px; margin:16px 0 10px;">NCERT Bilingual Solutions & Clinical Page References</h3>
      <div style="display:flex; flex-direction:column; gap:12px; max-height:300px; overflow-y:auto; padding-right:4px;">
        ${test.questions.map((q, idx) => {
          const userAns = test.userAnswers[idx];
          const isCorrect = userAns === q.correctIndex;
          const isUnattempted = userAns === undefined;

          let statusTag = `<span class="tag" style="background:#fee2e2; color:#991b1b; font-size:10px;">Wrong (-1)</span>`;
          if (isCorrect) statusTag = `<span class="tag" style="background:#dcfce7; color:#166534; font-size:10px;">Correct (+4)</span>`;
          if (isUnattempted) statusTag = `<span class="tag" style="font-size:10px;">Skipped (0)</span>`;

          return `
            <div class="card" style="padding:12px; border-left:3px solid ${isCorrect ? 'var(--brand-emerald)' : isUnattempted ? 'var(--border-color)' : 'var(--danger-color)'};">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px; align-items:center;">
                <span style="font-weight:700; font-size:12.5px;">Q${idx + 1}. ${escapeHtml(q.chapter || q.subject)}</span>
                ${statusTag}
              </div>
              <p style="font-size:13px; margin-bottom:4px; white-space:pre-line; line-height:1.4;">${escapeHtml(q.question)}</p>
              ${q.questionHi ? `
                <div style="font-size:12px; color:#38bdf8; margin-bottom:8px; line-height:1.4; background:rgba(56, 189, 248, 0.06); padding:4px 8px; border-radius:6px;">
                  🇮🇳 ${escapeHtml(q.questionHi)}
                </div>
              ` : ''}
              <div style="font-size:12px; line-height:1.4;">
                <div><b>Your Answer:</b> ${userAns !== undefined ? `${escapeHtml(q.options[userAns])} ${q.optionsHi && q.optionsHi[userAns] ? `(${escapeHtml(q.optionsHi[userAns])})` : ''}` : '<i>Not Attempted</i>'}</div>
                <div><b>Correct Answer:</b> <span style="color:var(--brand-emerald); font-weight:700;">${escapeHtml(q.options[q.correctIndex])} ${q.optionsHi && q.optionsHi[q.correctIndex] ? `(${escapeHtml(q.optionsHi[q.correctIndex])})` : ''}</span></div>
                <div style="margin-top:6px; padding:6px 8px; background:var(--bg-secondary); border-radius:6px; font-size:11.5px;">
                  <b>NCERT Solution:</b> ${escapeHtml(q.explanation)}<br>
                  ${q.explanationHi ? `<div style="color:var(--text-muted); margin-top:2px;"><b>हिंदी व्याख्या:</b> ${escapeHtml(q.explanationHi)}</div>` : ''}
                  <span style="color:var(--brand-teal); font-weight:600; display:inline-block; margin-top:4px;">📖 ${escapeHtml(q.ncertRef || 'NCERT Standard')}</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="display:flex; justify-content:space-between; gap:8px; margin-top:20px; flex-wrap:wrap;">
        <button class="btn ghost btn-sm" onclick="document.getElementById('modal').close()">Close</button>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="document.getElementById('modal').close(); if(window.renderApp) window.renderApp();">View Test Tree →</button>
          <button class="btn btn-gold btn-sm" onclick="document.getElementById('modal').close(); if(window.navigateView) window.navigateView('mistakes');">Mistake Notebook →</button>
        </div>
      </div>
    `;
  },
  
  stopTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
};

window.MockTestEngine = MockTestEngine;

window.MockEngine = MockTestEngine;
