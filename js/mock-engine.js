/**
 * NEET UG 2028: NTA Standard Timed Mock Test & Hierarchical Testing Engine
 * Section A & B format, +4/-1 Negative Marking, Virtual OMR, Tree Analytics & Mistake Notebook Sync
 */

const MockTestEngine = {
  currentTest: null,
  timerInterval: null,
  isOmrMode: false,

  // Universal Entrypoint for Hierarchical 6-Level Tests
  initHierarchicalTest(params) {
    if (typeof ClerkAuth !== 'undefined' && typeof ClerkAuth.isAuthenticated === 'function' && !ClerkAuth.isAuthenticated()) {
      if (typeof ClerkAuth.openSignIn === 'function') {
        ClerkAuth.openSignIn();
      }
      return;
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

    const questions = typeof getQuestionsForHierarchicalTest === 'function' 
      ? getQuestionsForHierarchicalTest(params)
      : (typeof NEET_QUESTIONS !== 'undefined' ? NEET_QUESTIONS.slice(0, count) : []);

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

    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;

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

    modalBody.innerHTML = `
      <div class="test-arena-header" style="border-bottom:1px solid var(--border-color); padding-bottom:12px; margin-bottom:16px;">
        <div>
          <span class="eyebrow" style="color:var(--brand-gold);">${drillBadge}</span>
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

          <div style="display:flex; align-items:baseline; gap:8px; margin-bottom:12px;">
            <span style="font-family:'Outfit',sans-serif; font-size:18px; font-weight:800; color:var(--brand-teal);">Q.${qNum}</span>
            <p style="font-size:15px; font-weight:600; line-height:1.6; white-space:pre-line; color:var(--text-main); margin:0;">${escapeHtml(q.question)}</p>
          </div>

          <div class="list" style="display:flex; flex-direction:column; gap:8px; margin:16px 0;">
            ${q.options.map((opt, i) => `
              <button 
                type="button"
                class="option-btn ${selectedAns === i ? 'selected' : ''}" 
                style="display:flex; align-items:flex-start; gap:10px; padding:12px 14px; text-align:left; border-radius:10px; border:1px solid ${selectedAns === i ? 'var(--brand-emerald)' : 'var(--border-color)'}; background:${selectedAns === i ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-secondary)'}; color:var(--text-main); cursor:pointer; transition:all 0.2s;"
                onclick="MockTestEngine.selectAnswer(${i})"
              >
                <strong style="font-family:'JetBrains Mono',monospace; color:${selectedAns === i ? 'var(--brand-emerald)' : 'var(--text-muted)'}; min-width:20px;">${String.fromCharCode(65 + i)}.</strong>
                <span style="font-size:13.5px; line-height:1.4;">${escapeHtml(opt)}</span>
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
            <h4 style="font-size:12px; margin-bottom:10px; color:var(--text-muted); letter-spacing:0.5px;"><i class="fas fa-th"></i> QUESTION PALETTE (${test.totalQuestions})</h4>
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

    const modal = document.getElementById('modal');
    if (modal && !modal.open) modal.showModal();
  },

  selectAnswer(index) {
    if (!this.currentTest) return;
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
    const idx = this.currentTest.currentIndex;
    if (this.currentTest.markedForReview[idx]) {
      delete this.currentTest.markedForReview[idx];
    } else {
      this.currentTest.markedForReview[idx] = true;
    }
    this.renderExamInterface();
  },

  nextQuestion() {
    if (!this.currentTest) return;
    if (this.currentTest.currentIndex < this.currentTest.totalQuestions - 1) {
      this.currentTest.currentIndex++;
      this.renderExamInterface();
    }
  },

  prevQuestion() {
    if (!this.currentTest) return;
    if (this.currentTest.currentIndex > 0) {
      this.currentTest.currentIndex--;
      this.renderExamInterface();
    }
  },

  jumpTo(index) {
    if (!this.currentTest || index < 0 || index >= this.currentTest.totalQuestions) return;
    this.currentTest.currentIndex = index;
    this.renderExamInterface();
  },

  confirmSubmit() {
    const answered = Object.keys(this.currentTest.userAnswers).length;
    const remaining = this.currentTest.totalQuestions - answered;
    if (confirm(`Submit Test? \n\n• Answered: ${answered}\n• Unattempted: ${remaining}\n\nYour score and mistakes will be analyzed immediately.`)) {
      this.submitTest();
    }
  },

  submitTest() {
    if (!this.currentTest || this.currentTest.isSubmitted) return;
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.currentTest.isSubmitted = true;
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    let score = 0;

    const mistakesToLog = [];
    const subjectStats = {
      phy: { correct: 0, wrong: 0, score: 0 },
      chem: { correct: 0, wrong: 0, score: 0 },
      bot: { correct: 0, wrong: 0, score: 0 },
      zoo: { correct: 0, wrong: 0, score: 0 }
    };

    this.currentTest.questions.forEach((q, idx) => {
      const userAns = this.currentTest.userAnswers[idx];
      const sCode = q.subjectCode || 'phy';

      if (userAns === undefined) {
        unattempted++;
      } else if (userAns === q.correctIndex) {
        correct++;
        score += 4;
        if (subjectStats[sCode]) {
          subjectStats[sCode].correct++;
          subjectStats[sCode].score += 4;
        }
      } else {
        wrong++;
        score -= 1;
        if (subjectStats[sCode]) {
          subjectStats[sCode].wrong++;
          subjectStats[sCode].score -= 1;
        }
        // Auto-log to Mistake Notebook
        mistakesToLog.push({
          questionId: q.id,
          question: q.question,
          chapter: q.chapter || 'NEET Chapter',
          subject: q.subject || 'Physics',
          subjectCode: sCode,
          userSelected: q.options[userAns],
          correctAnswer: q.options[q.correctIndex],
          explanation: q.explanation,
          ncertRef: q.ncertRef || 'NCERT Master Text',
          date: new Date().toISOString()
        });
      }
    });

    const maxScore = this.currentTest.maxScore || (this.currentTest.totalQuestions * 4);
    const percentage = Math.max(0, Math.round((score / maxScore) * 100));
    const passed = percentage >= (this.currentTest.level === 6 ? 50 : 60);

    this.currentTest.correctCount = correct;
    this.currentTest.wrongCount = wrong;
    this.currentTest.unattemptedCount = unattempted;
    this.currentTest.score = score;
    this.currentTest.maxScore = maxScore;
    this.currentTest.percentage = percentage;
    this.currentTest.passed = passed;
    this.currentTest.subjectStats = subjectStats;

    // Save to App State test history
    if (typeof appState !== 'undefined') {
      appState.testHistory = appState.testHistory || [];
      appState.testHistory.push({
        date: new Date().toISOString(),
        testId: this.currentTest.testId,
        title: this.currentTest.title,
        level: this.currentTest.level,
        subject: this.currentTest.subjectCode,
        score,
        maxScore,
        percentage,
        correct,
        wrong,
        unattempted,
        drillType: this.currentTest.drillType
      });

      // Auto-log mistakes to MistakeNotebook
      mistakesToLog.forEach(m => {
        if (typeof MistakeNotebook !== 'undefined') {
          MistakeNotebook.addMistake(m);
        }
      });

      // Record in Hierarchical Tree Engine
      if (typeof TestTreeEngine !== 'undefined' && TestTreeEngine.recordResult) {
        TestTreeEngine.recordResult({
          level: this.currentTest.level,
          testId: this.currentTest.testId,
          score,
          maxScore,
          percentage,
          passed,
          correct,
          wrong,
          unattempted
        });
      }

      if (typeof saveState === 'function') saveState();
    }

    this.renderScorecard();
  },

  renderScorecard() {
    const test = this.currentTest;
    const modalBody = document.getElementById('modalBody');
    if (!modalBody || !test) return;

    // Estimate All India Rank projection based on 720 conversion
    const normalized720 = Math.round((test.score / test.maxScore) * 720);
    let rankEstimate = 'AIR Top 50 (AIIMS New Delhi)';
    if (normalized720 < 450) rankEstimate = 'Foundation Level · Needs Revision';
    else if (normalized720 < 550) rankEstimate = 'State Medical College Qualified';
    else if (normalized720 < 620) rankEstimate = 'Govt Medical College (Top 15,000)';
    else if (normalized720 < 680) rankEstimate = 'Top Central Medical College (Top 2,000)';

    modalBody.innerHTML = `
      <div style="text-align:center; padding:10px 0 20px;">
        <span class="tag gold" style="margin-bottom:8px; font-weight:800;">
          ${test.passed ? '🎉 TEST CLEARED' : '⚠️ RETEST RECOMMENDED'} · LEVEL ${test.level}
        </span>
        <h2 style="font-size:2rem; margin:6px 0;">${test.score} / ${test.maxScore} Marks</h2>
        <p style="color:var(--text-muted); font-size:14px; margin-top:2px;">
          Accuracy: <b>${test.percentage}%</b> · Normalized NEET Projection: <b>${normalized720}/720</b> (${rankEstimate})
        </p>
      </div>

      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:20px;">
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

      <h3 style="font-size:15px; margin:16px 0 10px;">NCERT Clinical Solutions & Page References</h3>
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
              <p style="font-size:13px; margin-bottom:6px; white-space:pre-line; line-height:1.4;">${escapeHtml(q.question)}</p>
              <div style="font-size:12px; line-height:1.4;">
                <div><b>Your Answer:</b> ${userAns !== undefined ? escapeHtml(q.options[userAns]) : '<i>Not Attempted</i>'}</div>
                <div><b>Correct Answer:</b> <span style="color:var(--brand-emerald); font-weight:700;">${escapeHtml(q.options[q.correctIndex])}</span></div>
                <div style="margin-top:6px; padding:6px 8px; background:var(--bg-secondary); border-radius:6px; font-size:11.5px;">
                  <b>NCERT Solution:</b> ${escapeHtml(q.explanation)}<br>
                  <span style="color:var(--brand-teal); font-weight:600;">📖 ${escapeHtml(q.ncertRef)}</span>
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
  }
};

window.MockTestEngine = MockTestEngine;
