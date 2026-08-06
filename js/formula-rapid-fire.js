/**
 * NEET UG 2028: 60-Second Physics & Physical Chemistry Formula Rapid-Fire Engine
 * High-Speed Active Recall Drill for 180/180 Speed & Accuracy
 */
const FORMULA_RAPID_FIRE_BANK = [
  // --- PHYSICS CLASS 11 ---
  {
    topic: 'Motion in a Plane (Projectiles)',
    subject: 'Physics',
    prompt: 'Maximum Horizontal Range of Projectile ($R_{max}$ at $\\theta = 45^\\circ$):',
    options: [
      'R_{max} = u^2 / g',
      'R_{max} = u^2 / 2g',
      'R_{max} = 2u^2 / g',
      'R_{max} = u / g'
    ],
    correct: 0,
    hint: 'Range is maximum when sin(2θ) = 1, i.e. θ = 45°'
  },
  {
    topic: 'Laws of Motion (Friction & Banking)',
    subject: 'Physics',
    prompt: 'Optimum Speed for Banking of Curved Road without Friction ($v_{opt}$):',
    options: [
      'v = \\sqrt{R g \\tan\\theta}',
      'v = \\sqrt{R g / \\tan\\theta}',
      'v = R g \\sin\\theta',
      'v = \\sqrt{2 R g \\cos\\theta}'
    ],
    correct: 0,
    hint: 'N sinθ provides centripetal force mv²/R, N cosθ balances mg'
  },
  {
    topic: 'System of Particles & Rotation',
    subject: 'Physics',
    prompt: 'Moment of Inertia of a Uniform Solid Sphere about its Diameter ($I_{dia}$):',
    options: [
      'I = (2/5) M R^2',
      'I = (2/3) M R^2',
      'I = (1/2) M R^2',
      'I = M R^2'
    ],
    correct: 0,
    hint: 'Hollow sphere is (2/3)MR², Solid sphere is (2/5)MR²'
  },
  {
    topic: 'Gravitation & Escape Velocity',
    subject: 'Physics',
    prompt: 'Escape Velocity from the Surface of Earth ($v_e$):',
    options: [
      'v_e = \\sqrt{2 g R} = \\sqrt{\\frac{2GM}{R}} \\approx 11.2\\text{ km/s}',
      'v_e = \\sqrt{g R} = 7.9\\text{ km/s}',
      'v_e = \\sqrt{\\frac{GM}{2R}}',
      'v_e = 2\\sqrt{g R}'
    ],
    correct: 0,
    hint: 'Escape velocity is √2 times orbital velocity near surface'
  },
  {
    topic: 'Thermodynamics & Heat Engines',
    subject: 'Physics',
    prompt: 'Maximum Theoretical Efficiency of a Carnot Engine ($\\eta$):',
    options: [
      '\\eta = 1 - \\frac{T_2}{T_1} = \\frac{T_1 - T_2}{T_1}',
      '\\eta = 1 - \\frac{T_1}{T_2}',
      '\\eta = \\frac{T_2}{T_1}',
      '\\eta = 1 + \\frac{T_2}{T_1}'
    ],
    correct: 0,
    hint: 'T1 is source temperature (higher), T2 is sink temperature (lower) in Kelvin'
  },
  {
    topic: 'Oscillations (Simple Harmonic Motion)',
    subject: 'Physics',
    prompt: 'Time Period of a Simple Pendulum ($T$):',
    options: [
      'T = 2\\pi \\sqrt{\\frac{L}{g}}',
      'T = 2\\pi \\sqrt{\\frac{g}{L}}',
      'T = \\frac{1}{2\\pi} \\sqrt{\\frac{L}{g}}',
      'T = 2\\pi \\sqrt{\\frac{m}{k}}'
    ],
    correct: 0,
    hint: 'Time period depends only on effective length L and local acceleration g'
  },

  // --- PHYSICS CLASS 12 ---
  {
    topic: 'Electrostatics (Gauss Law)',
    subject: 'Physics',
    prompt: 'Electric Field due to an Infinitely Long Straight Uniformly Charged Wire ($E$):',
    options: [
      'E = \\frac{\\lambda}{2\\pi \\varepsilon_0 r}',
      'E = \\frac{\\lambda}{4\\pi \\varepsilon_0 r^2}',
      'E = \\frac{\\sigma}{2\\varepsilon_0}',
      'E = \\frac{\\lambda}{\\varepsilon_0 r}'
    ],
    correct: 0,
    hint: 'Gaussian cylindrical surface gives E(2πrL) = λL / ε0'
  },
  {
    topic: 'Current Electricity (Drift Velocity)',
    subject: 'Physics',
    prompt: 'Relation between Electric Current ($I$) and Drift Velocity ($v_d$):',
    options: [
      'I = n e A v_d',
      'I = n e v_d / A',
      'I = \\frac{n A}{e v_d}',
      'I = n e^2 A v_d'
    ],
    correct: 0,
    hint: 'n is number density of electrons, A is cross-sectional area, e is charge'
  },
  {
    topic: 'Electromagnetic Induction',
    subject: 'Physics',
    prompt: 'Motional EMF induced in a conductor of length $L$ moving with velocity $v$ perpendicular to field $B$:',
    options: [
      'e = B v L',
      'e = \\frac{1}{2} B v L',
      'e = B v^2 L',
      'e = \\frac{B L}{v}'
    ],
    correct: 0,
    hint: 'Lorentz force on electrons gives potential difference e = BvL'
  },
  {
    topic: 'Ray Optics (Lens Maker Formula)',
    subject: 'Physics',
    prompt: 'Lens Maker’s Formula for a Thin Lens in Air:',
    options: [
      '\\frac{1}{f} = (\\mu - 1) \\left( \\frac{1}{R_1} - \\frac{1}{R_2} \\right)',
      '\\frac{1}{f} = (\\mu + 1) \\left( \\frac{1}{R_1} + \\frac{1}{R_2} \\right)',
      '\\frac{1}{f} = \\mu \\left( \\frac{1}{R_1} - \\frac{1}{R_2} \\right)',
      '\\frac{1}{f} = (\\mu - 1) (R_1 - R_2)'
    ],
    correct: 0,
    hint: 'Derived by double refraction at spherical surfaces with radii R1 and R2'
  },
  {
    topic: 'Dual Nature (de Broglie Wavelength)',
    subject: 'Physics',
    prompt: 'de Broglie Wavelength of an Electron accelerated through potential difference $V$ volts:',
    options: [
      '\\lambda = \\frac{12.27}{\\sqrt{V}}\\text{ \\AA} = \\frac{1.227}{\\sqrt{V}}\\text{ nm}',
      '\\lambda = \\frac{0.286}{\\sqrt{V}}\\text{ \\AA}',
      '\\lambda = \\frac{12.27}{V}\\text{ \\AA}',
      '\\lambda = \\frac{h}{\\sqrt{V}}'
    ],
    correct: 0,
    hint: 'Substitute constants h, m_e, e into λ = h / √(2m_e eV)'
  },
  {
    topic: 'Atoms & Bohr Model',
    subject: 'Physics',
    prompt: 'Total Energy of an Electron in the $n$-th Bohr Orbit of Hydrogen-like ion ($E_n$):',
    options: [
      'E_n = -13.6 \\frac{Z^2}{n^2}\\text{ eV}',
      'E_n = -13.6 \\frac{Z}{n}\\text{ eV}',
      'E_n = +13.6 \\frac{Z^2}{n^2}\\text{ eV}',
      'E_n = -13.6 \\frac{n^2}{Z^2}\\text{ eV}'
    ],
    correct: 0,
    hint: 'Potential energy is 2 * Total Energy; Kinetic Energy is -Total Energy'
  },

  // --- PHYSICAL CHEMISTRY ---
  {
    topic: 'Mole Concept & Solutions',
    subject: 'Chemistry',
    prompt: 'Relation between Molarity ($M$), Molality ($m$), Density of Solution ($d$ g/mL), and Molar Mass of Solute ($M_2$):',
    options: [
      'm = \\frac{1000 M}{1000 d - M M_2}',
      'm = \\frac{1000 M}{1000 d + M M_2}',
      'M = \\frac{1000 m}{1000 d - m M_2}',
      'm = \\frac{M \\cdot d}{1000 - M_2}'
    ],
    correct: 0,
    hint: 'Mass of solvent = mass of solution - mass of solute = (1000d - M*M2)'
  },
  {
    topic: 'Chemical Thermodynamics',
    subject: 'Chemistry',
    prompt: 'Gibbs-Helmholtz Equation for Spontaneity Criterion at Constant $T$ and $P$:',
    options: [
      '\\Delta G = \\Delta H - T \\Delta S \\quad (\\Delta G < 0 \\text{ for Spontaneous})',
      '\\Delta G = \\Delta H + T \\Delta S',
      '\\Delta G = T \\Delta S - \\Delta H',
      '\\Delta G = \\Delta U - T \\Delta S'
    ],
    correct: 0,
    hint: 'At equilibrium ΔG = 0, so T_eq = ΔH / ΔS'
  },
  {
    topic: 'Ionic Equilibrium (Buffer Solutions)',
    subject: 'Chemistry',
    prompt: 'Henderson-Hasselbalch Equation for pH of an Acidic Buffer Solution:',
    options: [
      '\\text{pH} = \\text{p}K_a + \\log \\frac{[\\text{Conjugate Base / Salt}]}{[\\text{Weak Acid}]}',
      '\\text{pH} = \\text{p}K_a - \\log \\frac{[\\text{Salt}]}{[\\text{Acid}]}',
      '\\text{pH} = \\text{p}K_b + \\log \\frac{[\\text{Salt}]}{[\\text{Base}]}',
      '\\text{pH} = 7 + \\frac{1}{2} \\text{p}K_a + \\frac{1}{2} \\log C'
    ],
    correct: 0,
    hint: 'When [Salt] = [Acid], pH = pKa (maximum buffer capacity)'
  },
  {
    topic: 'Electrochemistry (Nernst Equation)',
    subject: 'Chemistry',
    prompt: 'Nernst Equation for a Cell Reaction at $298\\text{ K}$ ($25^\\circ\\text{C}$):',
    options: [
      'E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log Q',
      'E_{\\text{cell}} = E^\\circ_{\\text{cell}} + \\frac{0.0591}{n} \\log Q',
      'E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\ln Q',
      'E_{\\text{cell}} = \\frac{0.0591}{n} \\log K_c'
    ],
    correct: 0,
    hint: 'At equilibrium E_cell = 0, so E°_cell = (0.0591/n) log Kc'
  },
  {
    topic: 'Chemical Kinetics (Arrhenius Equation)',
    subject: 'Chemistry',
    prompt: 'Temperature Dependence of Rate Constant (Arrhenius Equation):',
    options: [
      'k = A e^{-E_a / RT} \\iff \\log \\frac{k_2}{k_1} = \\frac{E_a}{2.303 R} \\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)',
      'k = A e^{+E_a / RT}',
      '\\log \\frac{k_2}{k_1} = \\frac{E_a}{2.303 R} \\left( \\frac{1}{T_2} - \\frac{1}{T_1} \\right)',
      'k = A \\ln(E_a / RT)'
    ],
    correct: 0,
    hint: 'Plot of ln k vs 1/T gives a straight line with slope = -Ea / R'
  }
];

class FormulaRapidFireEngine {
  constructor() {
    this.timer = null;
    this.timeLeft = 60;
    this.score = 0;
    this.streak = 0;
    this.multiplier = 1;
    this.currentIndex = 0;
    this.shuffledDeck = [];
    this.isActive = false;
    this.highScore = typeof localStorage !== 'undefined' ? parseInt(localStorage.getItem('neet2028_formula_highscore') || '0', 10) : 0;
  }

  start() {
    if (typeof ClerkAuth !== 'undefined' && typeof ClerkAuth.isAuthenticated === 'function' && !ClerkAuth.isAuthenticated()) {
      if (typeof ClerkAuth.openSignIn === 'function') {
        ClerkAuth.openSignIn();
      }
      return;
    }
    this.shuffledDeck = [...FORMULA_RAPID_FIRE_BANK].sort(() => Math.random() - 0.5);
    this.timeLeft = 60;
    this.score = 0;
    this.streak = 0;
    this.multiplier = 1;
    this.currentIndex = 0;
    this.isActive = true;
    this.render();

    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeLeft--;
      const timerEl = typeof document !== 'undefined' ? document.getElementById('rapid-fire-time') : null;
      if (timerEl) {
        timerEl.textContent = `${this.timeLeft}s`;
        if (this.timeLeft <= 10) {
          timerEl.style.color = 'var(--danger-color)';
        }
      }
      if (this.timeLeft <= 0) {
        this.finish();
      }
    }, 1000);
  }

  submitAnswer(selectedOptionIndex) {
    if (!this.isActive) return;
    const currentQ = this.shuffledDeck[this.currentIndex];
    const isCorrect = selectedOptionIndex === currentQ.correct;

    if (isCorrect) {
      this.streak++;
      if (this.streak >= 5) this.multiplier = 3;
      else if (this.streak >= 3) this.multiplier = 2;
      else this.multiplier = 1;

      const points = 10 * this.multiplier;
      this.score += points;
      this.flashFeedback(true, `+${points} pts (${this.multiplier}x Combo!)`);
    } else {
      this.streak = 0;
      this.multiplier = 1;
      this.score = Math.max(0, this.score - 5);
      this.flashFeedback(false, `-5 pts (Correct: ${currentQ.options[currentQ.correct]})`);
    }

    this.currentIndex = (this.currentIndex + 1) % this.shuffledDeck.length;
    setTimeout(() => {
      if (this.isActive) this.renderQuestion();
    }, 400);
  }

  flashFeedback(isCorrect, msg) {
    const feedbackEl = typeof document !== 'undefined' ? document.getElementById('rapid-feedback-banner') : null;
    if (feedbackEl) {
      feedbackEl.textContent = msg;
      feedbackEl.className = isCorrect ? 'rapid-badge correct-flash' : 'rapid-badge wrong-flash';
      feedbackEl.style.opacity = '1';
      setTimeout(() => {
        if (feedbackEl) feedbackEl.style.opacity = '0';
      }, 1200);
    }
  }

  finish() {
    clearInterval(this.timer);
    this.isActive = false;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('neet2028_formula_highscore', this.score.toString());
      }
    }
    this.renderFinish();
  }

  render() {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('rapid-fire-container');
    if (!container) return;

    container.innerHTML = `
      <div class="rapid-fire-hud">
        <div class="rapid-hud-stat">
          <span class="hud-label">TIME</span>
          <span class="hud-val timer-val" id="rapid-fire-time">60s</span>
        </div>
        <div class="rapid-hud-stat">
          <span class="hud-label">SCORE</span>
          <span class="hud-val score-val" id="rapid-fire-score">${this.score}</span>
        </div>
        <div class="rapid-hud-stat">
          <span class="hud-label">STREAK</span>
          <span class="hud-val streak-val" id="rapid-fire-streak">${this.streak} 🔥</span>
        </div>
        <div class="rapid-hud-stat">
          <span class="hud-label">BEST RECORD</span>
          <span class="hud-val best-val">${this.highScore}</span>
        </div>
      </div>
      <div id="rapid-feedback-banner" class="rapid-badge" style="opacity:0;"></div>
      <div id="rapid-fire-card-target"></div>
    `;
    this.renderQuestion();
  }

  renderQuestion() {
    if (typeof document === 'undefined') return;
    const cardTarget = document.getElementById('rapid-fire-card-target');
    if (!cardTarget) return;

    const scoreEl = document.getElementById('rapid-fire-score');
    const streakEl = document.getElementById('rapid-fire-streak');
    if (scoreEl) scoreEl.textContent = this.score;
    if (streakEl) streakEl.textContent = `${this.streak} 🔥 (${this.multiplier}x)`;

    const q = this.shuffledDeck[this.currentIndex];
    cardTarget.innerHTML = `
      <div class="rapid-card glass-panel">
        <div class="rapid-card-header">
          <span class="badge ${q.subject === 'Physics' ? 'badge-physics' : 'badge-chemistry'}">${q.subject}</span>
          <span class="rapid-topic-title">${q.topic}</span>
        </div>
        <div class="rapid-prompt">${q.prompt}</div>
        <div class="rapid-options-grid">
          ${q.options.map((opt, i) => `
            <button class="rapid-opt-btn" onclick="window.rapidFireEngine.submitAnswer(${i})">
              <span class="opt-key">${['A', 'B', 'C', 'D'][i]}</span>
              <span class="opt-formula">${opt}</span>
            </button>
          `).join('')}
        </div>
        <div class="rapid-hint-box"><i class="fas fa-lightbulb"></i> <b>Speed Hint:</b> ${q.hint}</div>
      </div>
    `;
  }

  renderFinish() {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('rapid-fire-container');
    if (!container) return;

    container.innerHTML = `
      <div class="rapid-summary glass-panel text-center">
        <div class="rapid-finish-badge">⚡ 60-SECOND RAPID FIRE COMPLETED!</div>
        <h2 style="font-size:2rem; margin:1rem 0; color:var(--primary-color);">Final Score: ${this.score} Points</h2>
        <p style="color:var(--text-secondary); margin-bottom:1.5rem;">
          ${this.score >= 120 ? '🌟 Outstanding Master Speed! You are firing formulas at AIIMS Top 50 Ranker velocity!' : 
            this.score >= 60 ? '⚡ Good Speed! Daily practice will take your formula reflex to pure 180/180 accuracy.' : 
            '🎯 Solid Attempt! Review the formula sheet and replay to beat your speed record!'}
        </p>
        <div style="display:flex; justify-content:center; gap:1rem;">
          <button class="btn btn-primary" onclick="window.rapidFireEngine.start()"><i class="fas fa-redo"></i> Play Again (60s)</button>
          <button class="btn btn-outline" onclick="window.navigateTo('notes')"><i class="fas fa-book"></i> Review Formula Sheets</button>
        </div>
      </div>
    `;
  }
}

if (typeof window !== 'undefined') {
  window.rapidFireEngine = new FormulaRapidFireEngine();
}
