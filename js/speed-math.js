/**
 * JEE OS: Speed Math & Calculation Drill Engine (60-Second Rapid Fire)
 * Trains aspirants on High-Speed Mental Math, Physics Constants & Trigonometric Recall
 */

const SpeedMathEngine = {
  activeSession: null,
  timerInterval: null,

  DRILL_TYPES: [
    { id: 'squares', name: 'Squares & Cubes (1 to 50)', icon: '🔢' },
    { id: 'constants', name: 'Physics Standard Constants (hc, k, R, g)', icon: '⚛️' },
    { id: 'trig', name: 'Trigonometry & Special Angles (37°, 53°, 15°)', icon: '📐' },
    { id: 'log', name: 'Logarithm Approximations (log 2, 3, 5, 7, ln)', icon: '📈' },
    { id: 'mixed', name: '🎲 All-Round Speed Champion', icon: '⚡' }
  ],

  // Question Pool Generators
  generateQuestion(type = 'mixed') {
    const selectedType = type === 'mixed' 
      ? ['squares', 'constants', 'trig', 'log'][Math.floor(Math.random() * 4)]
      : type;

    if (selectedType === 'squares') {
      const isCube = Math.random() > 0.6;
      if (isCube) {
        const n = Math.floor(Math.random() * 15) + 2; // 2 to 16
        const ans = Math.pow(n, 3);
        const options = this.generateOptions(ans, 4);
        return {
          question: `What is the value of ${n}³?`,
          questionHindi: `${n}³ का मान क्या है?`,
          correctAnswer: ans,
          options: options,
          category: 'Cubes'
        };
      } else {
        const n = Math.floor(Math.random() * 40) + 11; // 11 to 50
        const ans = n * n;
        const options = this.generateOptions(ans, 4);
        return {
          question: `What is the square of ${n} (${n}²)?`,
          questionHindi: `${n} का वर्ग (${n}²) क्या है?`,
          correctAnswer: ans,
          options: options,
          category: 'Squares'
        };
      }
    }

    if (selectedType === 'constants') {
      const pool = [
        { q: "Value of Planck product 'hc' in eV·nm", a: "1240", opts: ["1240", "1360", "662", "300"], cat: "Modern Physics" },
        { q: "Universal Gas Constant 'R' in J/(mol·K)", a: "8.314", opts: ["8.314", "1.987", "0.0821", "6.023"], cat: "Thermodynamics" },
        { q: "Value of 1/(4πε₀) in N·m²/C²", a: "9 × 10⁹", opts: ["9 × 10⁹", "8.85 × 10⁻¹²", "1.6 × 10⁻¹⁹", "6.67 × 10⁻¹¹"], cat: "Electrostatics" },
        { q: "Rydberg Constant (R_H) value in m⁻¹", a: "1.097 × 10⁷", opts: ["1.097 × 10⁷", "3 × 10⁸", "6.63 × 10⁻³⁴", "9.1 × 10⁻³¹"], cat: "Atomic Physics" },
        { q: "Approximate value of ln(2)", a: "0.693", opts: ["0.693", "0.301", "2.303", "1.414"], cat: "Nuclear Physics" },
        { q: "Atmospheric pressure 1 atm in Pascals (N/m²)", a: "1.013 × 10⁵", opts: ["1.013 × 10⁵", "10⁴", "1.013 × 10⁶", "760"], cat: "Fluids" }
      ];
      const item = pool[Math.floor(Math.random() * pool.length)];
      return {
        question: item.q,
        questionHindi: item.q,
        correctAnswer: item.a,
        options: this.shuffleArray([...item.opts]),
        category: item.cat
      };
    }

    if (selectedType === 'trig') {
      const pool = [
        { q: "Value of sin(37°) / cos(53°)", a: "3/5 (0.6)", opts: ["3/5 (0.6)", "4/5 (0.8)", "3/4 (0.75)", "1/2 (0.5)"] },
        { q: "Value of tan(53°)", a: "4/3 (1.33)", opts: ["4/3 (1.33)", "3/4 (0.75)", "5/4 (1.25)", "1.732"] },
        { q: "Value of cos(37°)", a: "4/5 (0.8)", opts: ["4/5 (0.8)", "3/5 (0.6)", "1/√2", "√3/2"] },
        { q: "Value of sin(15°)", a: "(√6 - √2)/4", opts: ["(√6 - √2)/4", "(√6 + √2)/4", "1/(2√2)", "(√3 - 1)/2"] },
        { q: "Value of tan(15°)", a: "2 - √3", opts: ["2 - √3", "2 + √3", "√3 - 1", "1/√3"] }
      ];
      const item = pool[Math.floor(Math.random() * pool.length)];
      return {
        question: item.q,
        questionHindi: item.q,
        correctAnswer: item.a,
        options: this.shuffleArray([...item.opts]),
        category: 'Trigonometry'
      };
    }

    // Log pool
    const pool = [
      { q: "Value of log₁₀(2)", a: "0.3010", opts: ["0.3010", "0.4771", "0.6990", "0.8450"] },
      { q: "Value of log₁₀(3)", a: "0.4771", opts: ["0.4771", "0.3010", "0.6020", "0.7781"] },
      { q: "Value of log₁₀(7)", a: "0.8450", opts: ["0.8450", "0.6990", "0.9030", "0.4771"] },
      { q: "Value of 2.303 × log₁₀(x)", a: "ln(x)", opts: ["ln(x)", "log₂(x)", "exp(x)", "10^x"] }
    ];
    const item = pool[Math.floor(Math.random() * pool.length)];
    return {
      question: item.q,
      questionHindi: item.q,
      correctAnswer: item.a,
      options: this.shuffleArray([...item.opts]),
      category: 'Logarithms'
    };
  },

  generateOptions(correctVal, count = 4) {
    const opts = new Set([correctVal]);
    while (opts.size < count) {
      const delta = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1) * (correctVal > 100 ? 10 : 2);
      const fake = Math.max(1, correctVal + delta);
      opts.add(fake);
    }
    return this.shuffleArray(Array.from(opts));
  },

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  startDrill(type = 'mixed') {
    this.activeSession = {
      type: type,
      score: 0,
      total: 0,
      timeLeft: 60,
      streak: 0,
      maxStreak: 0,
      currentQuestion: this.generateQuestion(type)
    };

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.activeSession) {
        this.activeSession.timeLeft--;
        const timerEl = document.getElementById('speedMathTimer');
        if (timerEl) timerEl.textContent = `${this.activeSession.timeLeft}s`;
        if (this.activeSession.timeLeft <= 0) {
          this.endDrill();
        }
      }
    }, 1000);

    this.renderDrillStage();
  },

  answerCurrent(selectedVal) {
    if (!this.activeSession || this.activeSession.timeLeft <= 0) return;

    const s = this.activeSession;
    s.total++;
    const isCorrect = String(selectedVal) === String(s.currentQuestion.correctAnswer);

    if (isCorrect) {
      s.score += 4;
      s.streak++;
      if (s.streak > s.maxStreak) s.maxStreak = s.streak;
    } else {
      s.score = Math.max(0, s.score - 1);
      s.streak = 0;
    }

    s.currentQuestion = this.generateQuestion(s.type);
    this.renderDrillStage();
  },

  endDrill() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const container = document.getElementById('speedMathContainer');
    if (!container || !this.activeSession) return;

    const s = this.activeSession;
    const accuracy = s.total > 0 ? Math.round(((s.score + (s.total - (s.score/4))) / s.total) * 100) : 0;

    container.innerHTML = `
      <div style="text-align:center; padding:24px 16px; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:16px;">
        <div style="font-size:40px; margin-bottom:8px;">⏱️ Drill Completed!</div>
        <h2 style="font-size:24px; font-weight:800; margin-bottom:14px;">Calculation Speed Report</h2>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; max-width:400px; margin:0 auto 20px;">
          <div style="background:var(--bg-card); padding:12px; border-radius:10px; border:1px solid var(--border-color);">
            <div style="font-size:11px; color:var(--text-muted);">Points</div>
            <div style="font-size:22px; font-weight:800; color:var(--brand-sky);">${s.score}</div>
          </div>
          <div style="background:var(--bg-card); padding:12px; border-radius:10px; border:1px solid var(--border-color);">
            <div style="font-size:11px; color:var(--text-muted);">Questions</div>
            <div style="font-size:22px; font-weight:800; color:var(--brand-gold);">${s.total}</div>
          </div>
          <div style="background:var(--bg-card); padding:12px; border-radius:10px; border:1px solid var(--border-color);">
            <div style="font-size:11px; color:var(--text-muted);">Max Streak</div>
            <div style="font-size:22px; font-weight:800; color:var(--brand-emerald);">🔥 ${s.maxStreak}</div>
          </div>
        </div>

        <button class="btn btn-primary" onclick="SpeedMathEngine.startDrill('${s.type}')" style="padding:10px 24px;">
          🔄 Play Again (60s)
        </button>
      </div>
    `;
  },

  renderDrillStage() {
    const container = document.getElementById('speedMathContainer');
    if (!container || !this.activeSession) return;

    const s = this.activeSession;
    const q = s.currentQuestion;

    container.innerHTML = `
      <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:16px; padding:20px; text-align:center;">
        <!-- Header Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <span style="font-size:11px; font-weight:800; color:var(--brand-sky); text-transform:uppercase;">${q.category}</span>
          <div style="display:flex; gap:12px; align-items:center;">
            <span style="font-size:12px; font-weight:700; color:var(--brand-gold);">Score: ${s.score}</span>
            <span id="speedMathTimer" style="font-size:14px; font-family:'JetBrains Mono', monospace; font-weight:800; color:#ef4444; background:rgba(239,68,68,0.1); padding:4px 10px; border-radius:8px;">${s.timeLeft}s</span>
          </div>
        </div>

        <!-- Question Prompt -->
        <h3 style="font-size:20px; font-weight:800; margin:16px 0 20px; min-height:48px;">
          ${q.question}
        </h3>

        <!-- Options Grid -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; max-width:440px; margin:0 auto 16px;">
          ${q.options.map(opt => `
            <button class="btn btn-ghost" style="padding:14px; font-size:16px; font-weight:700; font-family:'JetBrains Mono', monospace; justify-content:center;" onclick="SpeedMathEngine.answerCurrent('${opt}')">
              ${opt}
            </button>
          `).join('')}
        </div>

        <div style="font-size:12px; color:var(--text-muted);">
          Current Streak: <strong style="color:var(--brand-emerald);">🔥 ${s.streak} in a row</strong>
        </div>
      </div>
    `;
  }
};

window.SpeedMathEngine = SpeedMathEngine;
