/**
 * NEET OS: 1-Page Topper Formula Cheat-Sheets & Biology Roadmaps
 * Clean, high-yield, crystal-clear formulas with shortcuts
 */

const CheatSheetEngine = {
  sheets: [
    {
      id: "phy-mechanics",
      subject: "physics",
      title: "⚡ Physics: Mechanics & Gravitation Super Sheet",
      hindiTitle: "यांत्रिकी एवं गुरुत्वाकर्षण (Mechanics & Gravitation)",
      color: "var(--brand-cyan, #00f2fe)",
      badge: "PHYSICS 1-PAGE",
      cards: [
        {
          id: "phy_kinematics",
          heading: "Kinematics & Projectile Motion (गति विज्ञान)",
          formulaList: [
            { label: "1st Equation", formula: "v = u + a·t", meaning: "Final Velocity = Initial Velocity + (Accel × Time)" },
            { label: "2nd Equation", formula: "s = u·t + ½·a·t²", meaning: "Displacement with Constant Acceleration" },
            { label: "3rd Equation", formula: "v² = u² + 2·a·s", meaning: "Speed-Displacement without time" },
            { label: "Max Height", formula: "H_max = (u² · sin²θ) / (2g)", meaning: "Maximum vertical height reached by projectile" },
            { label: "Time of Flight", formula: "T = (2u · sinθ) / g", meaning: "Total time in air (Ascent + Descent)" },
            { label: "Horizontal Range", formula: "R = (u² · sin 2θ) / g", meaning: "Max range at θ = 45° (R_max = u²/g)" }
          ],
          tip: "💡 Topper Shortcut: If two projectiles have same speed $u$ at complementary angles $\\theta$ and $(90^\\circ - \\theta)$, their Horizontal Ranges are IDENTICAL ($R_1 = R_2$)!",
          example: "Q: At what angle is Range = 4 × Max Height? \nAns: R = 4H $\\implies$ $\\tan\\theta = 4H/R = 1 \\implies \\theta = 45^\\circ$."
        }
      ]
    },
    {
      id: "chem-organic-reactions",
      subject: "chemistry",
      title: "🧪 Chemistry: Organic Name Reactions",
      hindiTitle: "कार्बनिक रसायन: प्रमुख रिएक्शंस (Organic Master Sheet)",
      color: "var(--brand-rose, #ec4899)",
      badge: "CHEMISTRY 1-PAGE",
      cards: [
        {
          id: "chem_name_rxns",
          heading: "Aldol, Cannizzaro & Haloform",
          formulaList: [
            { label: "Aldol Reaction", formula: "2 CH₃CHO + dil. NaOH → CH₃-CH(OH)-CH₂CHO", meaning: "Requires at least one α-Hydrogen" },
            { label: "Cannizzaro Rxn", formula: "2 HCHO + 50% KOH → CH₃OH + HCOOK", meaning: "No α-Hydrogen; Disproportionation reaction" },
            { label: "Haloform (Iodoform)", formula: "R-CO-CH₃ + 3 I₂ + 4 NaOH → CHI₃↓ (Yellow Ppt)", meaning: "Specific test for Methyl Ketone" }
          ],
          tip: "💡 Iodoform Positive: Ethanol, Propan-2-ol, Acetone. METHANOL (CH₃OH) DOES NOT give Iodoform test!",
          example: "Q: Which gives yellow ppt with I₂/NaOH: (a) Propan-1-ol (b) Propan-2-ol?\nAns: Propan-2-ol (has CH₃-CH(OH)- group)."
        }
      ]
    },
    {
      id: "bio-genetics",
      subject: "botany",
      title: "🧬 Biology: Genetics & Inheritance Master Sheet",
      hindiTitle: "वंशागति एवं आनुवंशिकी (Genetics)",
      color: "var(--brand-emerald, #10b981)",
      badge: "BIOLOGY 1-PAGE",
      cards: [
        {
          id: "bio_mendelian",
          heading: "Mendelian Crosses & Ratios (मेंडेलियन अनुपात)",
          formulaList: [
            { label: "Monohybrid Phenotype", formula: "3 : 1", meaning: "Tall : Dwarf in F2 generation" },
            { label: "Monohybrid Genotype", formula: "1 : 2 : 1", meaning: "TT : Tt : tt" },
            { label: "Dihybrid Phenotype", formula: "9 : 3 : 3 : 1", meaning: "Round Yellow : Round Green : Wrinkled Yellow : Wrinkled Green" },
            { label: "Dihybrid Genotype", formula: "1:2:1:2:4:2:1:2:1", meaning: "Rarely asked directly, remember 9 genotypes total" },
            { label: "Test Cross Ratio", formula: "1 : 1 (Mono) | 1 : 1 : 1 : 1 (Di)", meaning: "Crossing F1 hybrid with homozygous recessive parent" }
          ],
          tip: "💡 Shortcut for finding number of gametes: $2^n$ where n = number of heterozygous alleles. (e.g. AaBbCc has 3 heterozygous = 2³ = 8 types of gametes).",
          example: "Q: How many types of gametes are produced by genotype AABbCc?\nAns: 2 heterozygous pairs (Bb, Cc) $\\implies 2^2 = 4$ types."
        },
        {
          id: "bio_molecular",
          heading: "Molecular Basis of Inheritance (आणविक आधार)",
          formulaList: [
            { label: "Chargaff's Rule", formula: "A + G = T + C", meaning: "Purines = Pyrimidines in double-stranded DNA" },
            { label: "Length of DNA", formula: "Total bp × 0.34 nm", meaning: "Distance between two base pairs is 0.34 nm (or 3.4 Å)" },
            { label: "Nucleosome", formula: "200 bp of DNA wrapping", meaning: "Wrapped around histone octamer (H2A, H2B, H3, H4 x 2)" },
            { label: "Start / Stop Codons", formula: "Start: AUG | Stop: UAA, UAG, UGA", meaning: "AUG also codes for Methionine" }
          ],
          tip: "💡 Memory Trick for Stop Codons: UAA (U Are Away), UAG (U Are Gone), UGA (U Go Away)!",
          example: "Q: A DNA segment has 20% Adenine. What is the % of Cytosine?\nAns: A=20%, T=20% (Total 40%). Remaining 60% is G+C. So C = 30%."
        }
      ]
    },
    {
      id: "bio-human-physiology",
      subject: "zoology",
      title: "🫀 Biology: Human Physiology Flowcharts",
      hindiTitle: "मानव कार्यिकी (Human Physiology)",
      color: "var(--brand-teal, #06b6d4)",
      badge: "BIOLOGY 1-PAGE",
      cards: [
        {
          id: "bio_cardiac",
          heading: "Cardiac Cycle & ECG (हृदय चक्र एवं ECG)",
          formulaList: [
            { label: "Cardiac Output (CO)", formula: "CO = Stroke Volume × Heart Rate", meaning: "Normal: 70 ml × 72 bpm ≈ 5000 ml/min (5 Liters)" },
            { label: "P Wave (ECG)", formula: "Atrial Depolarization", meaning: "Leads to contraction (systole) of both atria" },
            { label: "QRS Complex", formula: "Ventricular Depolarization", meaning: "Initiates ventricular contraction" },
            { label: "T Wave", formula: "Ventricular Repolarization", meaning: "Return of ventricles to normal excited state" }
          ],
          tip: "💡 Topper Fact: The end of the T-wave marks the END of ventricular systole.",
          example: "Q: Which wave represents the electrical excitation of atria?\nAns: P Wave."
        }
      ]
    }
  ],

  copyFormula(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('📋 Formula copied to clipboard:\n' + text);
      }).catch(() => {
        alert('Formula:\n' + text);
      });
    } else {
      alert('Formula:\n' + text);
    }
  },

  openFormulaModal(sheetId, cardId) {
    const sheet = this.sheets.find(s => s.id === sheetId);
    if (!sheet) return;
    const card = sheet.cards.find(c => c.id === cardId) || sheet.cards[0];
    if (!card) return;

    let modal = document.getElementById('formulaDetailModal');
    if (!modal) {
      modal = document.createElement('dialog');
      modal.id = 'formulaDetailModal';
      modal.className = 'NEET-dialog';
      modal.style.cssText = `
        background: var(--bg-card);
        color: var(--text-main);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 0;
        max-width: 720px;
        width: 95%;
        box-shadow: var(--shadow-lg);
        backdrop-filter: blur(16px);
      `;
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="background:var(--bg-surface); padding:18px 22px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-size:10px; font-weight:800; padding:4px 8px; border-radius:6px; background:rgba(255,255,255,0.08); color:${sheet.color};">${sheet.badge}</span>
          <h2 style="font-size:18px; font-weight:800; color:var(--text-heading); margin-top:8px;">${card.heading}</h2>
        </div>
        <button onclick="document.getElementById('formulaDetailModal').close()" style="background:rgba(255,255,255,0.1); border:none; width:32px; height:32px; border-radius:50%; color:var(--text-main); cursor:pointer; display:flex; align-items:center; justify-content:center;">
          <i class="ph-bold ph-x"></i>
        </button>
      </div>
      <div style="padding:22px;">
        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
          ${card.formulaList.map(f => `
            <div style="background:rgba(0,0,0,0.2); border:1px solid var(--border-color); border-radius:8px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
              <div style="flex:1;">
                <div style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:4px; text-transform:uppercase;">${f.label}</div>
                <div style="font-family:'JetBrains Mono', monospace; font-size:16px; font-weight:700; color:${sheet.color};">${f.formula}</div>
                <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">${f.meaning}</div>
              </div>
              <button onclick="CheatSheetEngine.copyFormula('${f.formula.replace(/'/g, "\\'")}')" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); width:36px; height:36px; border-radius:8px; color:var(--text-main); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'" title="Copy Formula">
                <i class="ph-fill ph-copy"></i>
              </button>
            </div>
          `).join('')}
        </div>
        <div style="background:rgba(245, 158, 11, 0.1); border-left:4px solid #f59e0b; padding:14px 18px; border-radius:0 8px 8px 0; margin-bottom:12px;">
          <div style="font-size:14px; color:var(--text-main); font-weight:600; line-height:1.5;">${card.tip}</div>
        </div>
        <div style="background:rgba(16, 185, 129, 0.08); border-radius:8px; padding:14px 18px; font-family:'JetBrains Mono', monospace; font-size:13px; color:#10b981; line-height:1.6;">
          ${card.example.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;

    modal.showModal();
  },

  render: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
      <div class="cheatsheet-header" style="background:var(--bg-card); padding:20px; border-radius:12px; border:1px solid var(--border-color); margin-bottom:20px; text-align:center;">
        <h2 style="font-size:24px; color:var(--text-heading); margin-bottom:8px;">
          <i class="ph-fill ph-file-text" style="color:var(--brand-blue);"></i> 1-Page NEET Cheat Sheets
        </h2>
        <p style="color:var(--text-muted); font-size:14px;">Master Biology Roadmaps, Organic Name Reactions, and Physics Formulas in one glance. Designed for rapid revision.</p>
      </div>
    `;

    html += '<div style="display:flex; flex-direction:column; gap:30px;">';

    this.sheets.forEach(sheet => {
      html += `
        <div>
          <div style="margin-bottom:16px; border-left:4px solid ${sheet.color}; padding-left:12px;">
            <h3 style="font-size:18px; font-weight:800; color:var(--text-heading); margin-bottom:4px;">${sheet.title}</h3>
            <div style="font-size:13px; color:var(--text-muted); font-family:'Noto Sans Devanagari';">${sheet.hindiTitle}</div>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:16px;">
      `;

      sheet.cards.forEach(card => {
        html += `
          <div onclick="CheatSheetEngine.openFormulaModal('${sheet.id}', '${card.id}')" style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px; padding:18px; cursor:pointer; transition:transform 0.2s, box-shadow 0.2s; position:relative; overflow:hidden;" class="hover-scale">
            <div style="position:absolute; top:0; left:0; width:100%; height:3px; background:${sheet.color};"></div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <span style="font-size:10px; font-weight:800; padding:3px 8px; border-radius:4px; background:rgba(255,255,255,0.08); color:${sheet.color};">${sheet.badge}</span>
              <span style="color:var(--text-dim);"><i class="ph-bold ph-arrow-right"></i></span>
            </div>
            <h4 style="font-size:16px; font-weight:700; color:var(--text-main); line-height:1.4; margin-bottom:12px;">${card.heading}</h4>
            <div style="font-size:12px; color:var(--text-muted); display:flex; align-items:center; gap:6px;">
              <i class="ph-fill ph-list-dashes" style="color:${sheet.color};"></i> ${card.formulaList.length} High-Yield Concepts
            </div>
          </div>
        `;
      });

      html += `</div></div>`;
    });

    html += '</div>';
    container.innerHTML = html;
  },

  getHtml: function() {
    let html = `
      <div class="cheatsheet-header" style="background:var(--bg-card); padding:20px; border-radius:12px; border:1px solid var(--border-color); margin-bottom:20px; text-align:center;">
        <h2 style="font-size:24px; color:var(--text-heading); margin-bottom:8px;">
          <i class="ph-fill ph-file-text" style="color:var(--brand-blue);"></i> 1-Page NEET Cheat Sheets
        </h2>
        <p style="color:var(--text-muted); font-size:14px;">Master Biology Roadmaps, Organic Name Reactions, and Physics Formulas in one glance. Designed for rapid revision.</p>
      </div>
    `;
    html += '<div style="display:flex; flex-direction:column; gap:30px;">';
    this.sheets.forEach(sheet => {
      html += `
        <div>
          <div style="margin-bottom:16px; border-left:4px solid ${sheet.color}; padding-left:12px;">
            <h3 style="font-size:18px; font-weight:800; color:var(--text-heading); margin-bottom:4px;">${sheet.title}</h3>
            <div style="font-size:13px; color:var(--text-muted); font-family:'Noto Sans Devanagari';">${sheet.hindiTitle}</div>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:16px;">
      `;
      sheet.cards.forEach(card => {
        html += `
          <div onclick="CheatSheetEngine.openFormulaModal('${sheet.id}', '${card.id}')" style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px; padding:18px; cursor:pointer; transition:transform 0.2s, box-shadow 0.2s; position:relative; overflow:hidden;" class="hover-scale">
            <div style="position:absolute; top:0; left:0; width:100%; height:3px; background:${sheet.color};"></div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <span style="font-size:10px; font-weight:800; padding:3px 8px; border-radius:4px; background:rgba(255,255,255,0.08); color:${sheet.color};">${sheet.badge}</span>
              <span style="color:var(--text-dim);"><i class="ph-bold ph-arrow-right"></i></span>
            </div>
            <h4 style="font-size:16px; font-weight:700; color:var(--text-main); line-height:1.4; margin-bottom:12px;">${card.heading}</h4>
            <div style="font-size:12px; color:var(--text-muted); display:flex; align-items:center; gap:6px;">
              <i class="ph-fill ph-list-dashes" style="color:${sheet.color};"></i> ${card.formulaList.length} High-Yield Concepts
            </div>
          </div>
        `;
      });
      html += `</div></div>`;
    });
    html += '</div>';
    return html;
  }
};

window.CheatSheetEngine = CheatSheetEngine;

function renderCheatSheetsView() {
  return CheatSheetEngine.getHtml();
}
window.renderCheatSheetsView = renderCheatSheetsView;
