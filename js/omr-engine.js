/**
 * NEET UG 2028: Interactive Virtual OMR Bubble Sheet Simulator
 * Realistic Pen-and-Paper Exam Simulation to Eliminate Parallax & Bubble Errors
 */
class VirtualOMREngine {
  constructor() {
    this.totalQuestions = 200; // Standard NEET 200 Qs format (180 to attempt)
    this.bubbles = {}; // { qNum: optionIndex (0=A, 1=B, 2=C, 3=D) }
    this.activeQuestion = 1;
    this.penType = 'blue'; // 'blue' or 'black'
    this.fillTimeSeconds = 0;
    this.fillTimer = null;
  }

  init(totalQuestions = 200, initialAnswers = {}) {
    this.totalQuestions = totalQuestions;
    this.bubbles = { ...initialAnswers };
    this.renderOMR();
  }

  setPen(color) {
    this.penType = color;
    document.querySelectorAll('.omr-bubble.filled').forEach(el => {
      el.style.backgroundColor = color === 'black' ? '#111827' : '#1d4ed8';
    });
  }

  fillBubble(qIndex, optIndex) {
    // Fill the bubble with realistic pen stroke
    this.bubbles[qIndex] = optIndex;
    
    // Sync with active mock test if active
    if (window.activeTest && typeof window.activeTest.selectOption === 'function') {
      window.activeTest.userAnswers[qIndex] = optIndex;
      window.activeTest.renderQuestion();
      window.activeTest.renderPalette();
    }

    this.renderOMR();
  }

  clearBubble(qIndex) {
    delete this.bubbles[qIndex];
    if (window.activeTest && window.activeTest.userAnswers) {
      delete window.activeTest.userAnswers[qIndex];
      window.activeTest.renderQuestion();
      window.activeTest.renderPalette();
    }
    this.renderOMR();
  }

  renderOMR(containerId = 'omr-sheet-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    let rowsHtml = '';
    const qCount = window.activeTest ? window.activeTest.questions.length : Math.min(this.totalQuestions, 20);

    for (let i = 0; i < qCount; i++) {
      const qNum = i + 1;
      const filled = this.bubbles[i];
      const isActive = window.activeTest ? window.activeTest.currentIndex === i : false;

      rowsHtml += `
        <div class="omr-row ${isActive ? 'omr-row-active' : ''}">
          <div class="omr-q-num">${qNum.toString().padStart(2, '0')}</div>
          <div class="omr-bubbles-grp">
            ${['A', 'B', 'C', 'D'].map((letter, optIdx) => `
              <button 
                type="button" 
                class="omr-bubble ${filled === optIdx ? 'filled filled-' + this.penType : ''}" 
                onclick="window.omrEngine.fillBubble(${i}, ${optIdx})"
                title="Fill Bubble ${letter} for Q${qNum}"
              >
                ${letter}
              </button>
            `).join('')}
          </div>
          ${filled !== undefined ? `
            <button class="omr-clear-btn" onclick="window.omrEngine.clearBubble(${i})" title="Clear Bubble">×</button>
          ` : '<span class="omr-clear-spacer"></span>'}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="omr-sheet-card">
        <div class="omr-header">
          <div class="omr-title">
            <i class="fas fa-barcode"></i> NTA OMR ANSWER SHEET
          </div>
          <div class="omr-pen-selector">
            <span style="font-size:0.75rem; color:var(--text-secondary);">PEN:</span>
            <button class="pen-btn ${this.penType === 'blue' ? 'active-pen' : ''}" onclick="window.omrEngine.setPen('blue')" style="background:#2563eb; color:#fff;">Blue</button>
            <button class="pen-btn ${this.penType === 'black' ? 'active-pen' : ''}" onclick="window.omrEngine.setPen('black')" style="background:#111827; color:#fff;">Black</button>
          </div>
        </div>
        <div class="omr-instructions">
          Use dark blue/black ballpoint pen only. Darken completely without stray marks.
        </div>
        <div class="omr-grid-scroll">
          ${rowsHtml}
        </div>
      </div>
    `;
  }
}

if (typeof window !== 'undefined') {
  window.omrEngine = new VirtualOMREngine();
}
