/**
 * NEET OS: Standard Reference Books & Digital Chapter Library
 * Interactive books with full readable theory, key formulas, topper recommendations & solved examples
 */

const NEET_BOOKS_LIBRARY = [
  // =========================================================================
  // ⚛️ PHYSICS REFERENCE BOOKS
  // =========================================================================
  {
    id: "book-hcv",
    title: "Concepts of Physics (Vol 1 & 2)",
    hindiTitle: "कॉन्सेप्ट्स ऑफ फिजिक्स (भाग 1 व 2) — डॉ. एच.सी. वर्मा",
    author: "Dr. H.C. Verma (Ex-Professor, AIIMS Kanpur)",
    subject: "Physics",
    subjectCode: "phy",
    badge: "PHYSICS BIBLE",
    color: "#00f2fe",
    rating: "4.9 / 5.0 (Essential for AIIMS AIR 1)",
    coverIcon: "⚛️",
    readOnlineUrl: "https://ncert.nic.in/textbook.php?keph1=1-8",
    description: "The universally revered gold standard for developing profound physical intuition and mastering NEET Core & Advanced mechanics, electrodynamics, optics, and modern physics.",
    strategy: "Read the theory line-by-line, solve all 'Questions for Short Answer' orally to test concepts, complete Objective I & II (crucial for multi-correct), and solve exercises up to problem 40+ in high-yield chapters.",
    chapters: [
      {
        title: "Chapter 3: Rest and Motion (Kinematics)",
        hindi: "विराम और गति — गतिकी",
        keyTakeaway: "Displacement vs distance distinction, calculus definitions of velocity (v = dx/dt) and acceleration (a = v dv/dx), projectile trajectory parabola.",
        formulas: [
          "v = u + a·t | s = u·t + ½·a·t² | v² = u² + 2·a·s",
          "Projectile Range: R = (u² · sin 2θ) / g | H_max = (u² · sin²θ) / (2g) | T = (2u · sinθ) / g",
          "Trajectory Equation: y = x·tanθ · [1 - (x / R)]"
        ],
        mustSolve: "Objective I (Q1 - Q12), Objective II (Q1 - Q8), Exercises (Q15, 22, 31, 38, 45, 52)",
        solvedExample: {
          q: "A ball is thrown at speed u at angle θ. What is its radius of curvature at the highest point of trajectory?",
          sol: "At top point, velocity is strictly horizontal: v = u·cosθ. Acceleration is purely vertical: a = g. Radius of curvature R_c = v² / a_perp = (u·cosθ)² / g."
        }
      },
      {
        title: "Chapter 5: Newton's Laws of Motion & Friction",
        hindi: "न्यूटन के गति नियम एवं घर्षण",
        keyTakeaway: "Draw complete Free Body Diagrams (FBDs), identify third-law action-reaction pairs, apply pseudo force in accelerating frames, understand static vs kinetic friction transitions.",
        formulas: [
          "ΣF_external = m · a_cm",
          "Static Friction: f_s ≤ μ_s · N | Kinetic Friction: f_k = μ_k · N",
          "Block on inclined plane: Sliding starts when tanθ > μ_s"
        ],
        mustSolve: "Objective I & II (All), Exercises (Q12, 18, 26, 33, 39, 44, 49)",
        solvedExample: {
          q: "Two blocks of masses m₁ and m₂ are in contact on a frictionless floor. A horizontal force F is applied on m₁. Find contact force between them.",
          sol: "Common acceleration a = F / (m₁ + m₂). Contact force N on m₂ is N = m₂ · a = (m₂ · F) / (m₁ + m₂)."
        }
      },
      {
        title: "Chapter 10: Rotational Mechanics (The NEET Adv Pillar)",
        hindi: "घूर्णन यांत्रिकी (Rotational Dynamics)",
        keyTakeaway: "Torque about an axis (τ = I·α), Parallel Axis (I = I_cm + Md²) and Perpendicular Axis theorems, conservation of angular momentum (L = I·ω), pure rolling condition (v_cm = R·ω).",
        formulas: [
          "Torque: τ = r × F = I · α | Angular Momentum: L = r × p = I · ω",
          "Pure Rolling: a_cm = (g · sinθ) / [1 + (k² / R²)]",
          "Rolling Kinetic Energy: K_total = ½·M·v_cm² · [1 + (k² / R²)]"
        ],
        mustSolve: "Objective I & II (Mandatory for multi-correct), Exercises (Q18, 25, 34, 42, 50, 58, 67, 75)",
        solvedExample: {
          q: "A uniform disc of mass M and radius R rolls without slipping down an incline of angle θ. Find its acceleration.",
          sol: "For disc, k²/R² = ½. a = (g·sinθ) / (1 + ½) = (2/3)·g·sinθ."
        }
      },
      {
        title: "Chapter 29 & 30: Electric Field, Potential & Gauss's Law",
        hindi: "विद्युत क्षेत्र, विभव एवं गाउस का नियम",
        keyTakeaway: "Flux Φ = ∮ E·dA = q_enclosed / ε₀. Superposition principle for charge distributions, spherical shell shielding, capacitance charging transients.",
        formulas: [
          "Gauss Law: ∮ E · dA = Q_inside / ε₀",
          "Ring on Axis: E = (k·Q·x) / (x² + R²)^(3/2) (Max at x = R / √2)",
          "Infinite Sheet: E = σ / (2ε₀) | Infinite Wire: E = (2k·λ) / r"
        ],
        mustSolve: "Objective I & II, Exercises (Q14, 21, 29, 36, 43, 55)",
        solvedExample: {
          q: "What is electric field inside a hollow spherical conducting shell carrying charge Q?",
          sol: "By Gauss's law, enclosed charge inside any Gaussian surface interior to the hollow shell is 0, hence E = 0 everywhere inside."
        }
      }
    ]
  },

  {
    id: "book-irodov",
    title: "Problems in General Physics — I.E. Irodov",
    hindiTitle: "प्रॉब्लम्स इन जनरल फिजिक्स — आई.ई. इरोडोव",
    author: "I.E. Irodov (Moscow Institute of Physics and Technology)",
    subject: "Physics",
    subjectCode: "phy",
    badge: "ADVANCED DRILL",
    color: "#38bdf8",
    rating: "5.0 / 5.0 (Top 500 AIR Ranker)",
    coverIcon: "🚀",
    readOnlineUrl: "https://archive.org/details/IrodovProblemsInGeneralPhysics",
    description: "The ultimate weapon for AIIMS AIIMS AIQ Top 500 aspirants. Tests mathematical modeling, differential formulations, and non-standard problem-solving agility.",
    strategy: "Do not attempt the whole book! Focus strictly on the NEET-relevant Top 150 selected problems in Mechanics (Part 1), Electrodynamics (Part 3), and Oscillations & Waves.",
    chapters: [
      {
        title: "Part 1: Physical Fundamentals of Mechanics",
        hindi: "यांत्रिकी के मूल भौतिक सिद्धांत",
        keyTakeaway: "Velocity in polar coordinates (v_r, v_θ), pursuit curves, variable mass rocket dynamics (Tsiolkovsky equation), non-inertial Coriolis forces.",
        formulas: [
          "Coriolis Force: F_cor = 2m(v' × ω) | Centrifugal: F_cf = m·ω²·r",
          "Rocket Equation: v = u · ln(m₀ / m) - g·t",
          "Angular Impulse: ∫ τ dt = ΔL"
        ],
        mustSolve: "Problems: 1.1, 1.4, 1.9, 1.13, 1.18, 1.25, 1.34, 1.48, 1.75, 1.92, 1.120, 1.145, 1.188",
        solvedExample: {
          q: "Three turtles at vertices of equilateral triangle of side a move with constant speed v directly towards each other. When do they meet?",
          sol: "Approach velocity between any two turtles is v + v·cos(60°) = 1.5v. Initial distance is a. Meeting time t = a / (1.5v) = 2a / (3v)."
        }
      },
      {
        title: "Part 3: Electrodynamics & Magnetic Fields",
        hindi: "विद्युतगतिकी एवं चुंबकीय क्षेत्र",
        keyTakeaway: "Vector potential, Biot-Savart law integration, electromagnetic induction in moving conductors, LC oscillations with damping.",
        formulas: [
          "Biot-Savart: dB = (μ₀ / 4π) · (I dl × r̂) / r²",
          "Motional EMF: ε = ∮ (v × B) · dl",
          "Energy Density: u_B = B² / (2μ₀) | u_E = ½·ε₀·E²"
        ],
        mustSolve: "Problems: 3.1, 3.7, 3.14, 3.22, 3.45, 3.67, 3.110, 3.145, 3.180",
        solvedExample: {
          q: "A conducting wire rod of length L rotates with angular speed ω in uniform magnetic field B perpendicular to rotation axis. Find induced EMF.",
          sol: "ε = ∫₀ᴸ v·B·dr = ∫₀ᴸ (ω·r)·B·dr = ½ · B · ω · L²."
        }
      }
    ]
  },

  // =========================================================================
  // 🧪 CHEMISTRY REFERENCE BOOKS
  // =========================================================================
  {
    id: "book-ms-chouhan",
    title: "Advanced Problems in Organic Chemistry — M.S. Chouhan",
    hindiTitle: "एडवांस्ड प्रॉब्लम्स इन ऑर्गेनिक केमिस्ट्री — एम.एस. चौहान",
    author: "M.S. Chouhan (Director, Vibrant Academy Kota)",
    subject: "Chemistry",
    subjectCode: "chem",
    badge: "ORGANIC MASTER",
    color: "#ec4899",
    rating: "4.9 / 5.0 (Kota Topper Favorite)",
    coverIcon: "🧪",
    readOnlineUrl: "https://ncert.nic.in/textbook.php?lech2=1-6",
    description: "The definitive practice workbook for mastering Organic reaction mechanisms, carbocation rearrangements, stereoisomerism, and multi-step synthesis.",
    strategy: "Master GOC (General Organic Chemistry) first. Solve Level 1 (Single Option) to build speed, Level 2 for multi-correct & comprehension, and Level 3 for multi-step roadmaps.",
    chapters: [
      {
        title: "Chapter 1 & 2: GOC, Aromaticity & Acid-Base Strength",
        hindi: "सामान्य कार्बनिक रसायन (GOC) एवं अम्लीय/क्षारीय सामर्थ्य",
        keyTakeaway: "Carbocation stability (Resonance > Hyperconjugation > Inductive), Hückel's Rule (4n+2 π electrons for aromaticity), ortho-effect in benzoic acids, SIR & SIP effects.",
        formulas: [
          "Acidity ∝ Stability of Conjugate Base (Anion)",
          "Basicity ∝ Availability of Lone Pair (Steric Inhibition of Protonation)",
          "Aromaticity: Planar, fully conjugated, (4n+2) π electrons"
        ],
        mustSolve: "Level 1 (Q1 - Q50), Level 2 Multi-correct (Q1 - Q25)",
        solvedExample: {
          q: "Why is 2,6-di-tert-butylphenol a weaker acid than regular phenol?",
          sol: "Steric crowding by bulky tert-butyl groups prevents solvent water molecules from solvating and stabilizing the phenoxide conjugate base."
        }
      },
      {
        title: "Chapter 8: Aldehydes, Ketones & Condensations",
        hindi: "एल्डिहाइड, कीटोन एवं संघनन अभिक्रियाएँ",
        keyTakeaway: "Nucleophilic addition kinetics, Aldol vs Cannizzaro selection, Haloform mechanism, Beckmann rearrangement, Baeyer-Villiger oxidation.",
        formulas: [
          "Aldol: 2 RCH₂CHO + OH⁻ → α,β-unsaturated aldehyde (needs α-H)",
          "Cannizzaro: 2 HCHO + 50% KOH → CH₃OH + HCOOK (no α-H)",
          "Iodoform: R-CO-CH₃ + 3I₂ + 4NaOH → RCOONa + CHI₃↓ (yellow)"
        ],
        mustSolve: "Level 1 (Q1 - Q40), Level 2 (Multi-Correct Q10 - Q35)",
        solvedExample: {
          q: "What is the product when Cyclohexanone reacts with m-CPBA (Baeyer-Villiger Oxidation)?",
          sol: "Oxygen is inserted into the ring to expand the 6-membered cyclic ketone into a 7-membered cyclic ester (ε-Caprolactone)."
        }
      }
    ]
  },

  {
    id: "book-jd-lee",
    title: "Concise Inorganic Chemistry — J.D. Lee (Adapted for NEET)",
    hindiTitle: "कंंसाइज इनऑर्गेनिक केमिस्ट्री — जे.डी. ली",
    author: "J.D. Lee / Adapted by Sudarshan Guha",
    subject: "Chemistry",
    subjectCode: "chem",
    badge: "INORGANIC BIBLE",
    color: "#f43f5e",
    rating: "4.8 / 5.0 (Conceptual Clarity)",
    coverIcon: "🔬",
    readOnlineUrl: "https://ncert.nic.in/textbook.php?lech1=1-6",
    description: "Eliminates mindless memorization of Inorganic Chemistry by providing elegant crystal field theory, molecular orbital theory, and periodic trend justifications.",
    strategy: "Read Chemical Bonding and Coordination Compounds chapters with maximum focus. Combine with NCERT line-by-line notes for 100% marks in NEET Core Inorganic.",
    chapters: [
      {
        title: "Chapter: Chemical Bonding & Molecular Orbital Theory (MOT)",
        hindi: "रासायनिक आबंधन एवं अणु कक्षक सिद्धांत (MOT)",
        keyTakeaway: "Bond order calculations, paramagnetic behavior of O₂ and B₂, dipole moment vector sum, hydrogen bonding strength comparison.",
        formulas: [
          "Bond Order = ½ · (N_bonding - N_antibonding)",
          "MOT Trick: 14e⁻ (N₂) = 3.0 | ±1 e⁻ = subtract 0.5 (15e⁻=2.5, 16e⁻=2.0)",
          "Dipole Moment: μ = q · d (Debye)"
        ],
        mustSolve: "All In-Text Review Questions & NEET Practice Exercises",
        solvedExample: {
          q: "Why is the bond order of CO⁺ (3.5) higher than CO (3.0)?",
          sol: "In CO, the HOMO electron is removed from a slightly antibonding orbital (σ*2s with hybrid non-bonding character), increasing net bonding strength."
        }
      },
      {
        title: "Chapter: Coordination Compounds & Isomerism",
        hindi: "उपसहसंयोजक यौगिक एवं समावयवता",
        keyTakeaway: "Octahedral Δ_o and tetrahedral Δ_t splitting, spectrochemical series (strong vs weak field ligands), inner vs outer orbital complexes, optical isomerism in chelates.",
        formulas: [
          "Magnetic Moment: μ = √[n(n + 2)] BM (n = unpaired electrons)",
          "Tetrahedral Splitting: Δ_t = (4/9) · Δ_o",
          "CFSE for Octahedral: CFSE = [-0.4·n(t₂g) + 0.6·n(e_g)] · Δ_o + Pairing Energy"
        ],
        mustSolve: "Section Review on Crystal Field Theory & Isomerism Exercises",
        solvedExample: {
          q: "Calculate the spin-only magnetic moment of [Fe(H₂O)₆]²⁺.",
          sol: "Fe²⁺ has 3d⁶ configuration. H₂O is a weak-field ligand, so pairing does not occur: t₂g⁴ e_g² (4 unpaired electrons, n=4). μ = √[4(4+2)] = √24 ≈ 4.90 BM."
        }
      }
    ]
  },



  {
    id: "book-ncert-pcb",
    title: "NCERT Official PCB Class 11 & 12 Digital Master Guide",
    hindiTitle: "NCERT आधिकारिक PCB क्लास 11 व 12 मास्टर गाइड",
    author: "NCERT (National Council of Educational Research & Training)",
    subject: "All Subjects",
    subjectCode: "all",
    badge: "100% FREE OFFICIAL",
    color: "#10b981",
    rating: "5.0 / 5.0 (Official NEET Base)",
    coverIcon: "📘",
    readOnlineUrl: "https://ncert.nic.in/textbook.php",
    description: "Every single NEET Core session pulls direct conceptual questions and statements from NCERT PCB textbooks. 100% free and essential for 99+ percentile.",
    strategy: "Read Biology (Botany/Zoology) NCERT line-by-line multiple times. Read Chemistry NCERT for Inorganic & Organic. Solve Physics Exemplar.",
    chapters: [
      {
        title: "Chemistry: Complete In-Text Reactions & Summary",
        hindi: "रसायन: संपूर्ण पाठ्यपुस्तक रिएक्शंस एवं सारांश",
        keyTakeaway: "Biomolecules structures (Glucose, Amino acids, DNA), Polymers, Coordination compounds naming, d and f block exceptions, metallurgy principles.",
        formulas: [
          "Arrhenius Equation: k = A · e^(-Ea / RT)",
          "Nernst Equation: E_cell = E°_cell - (0.0591 / n) · log Q",
          "Henry's Law: p = K_H · x"
        ],
        mustSolve: "All NCERT Back Exercises & Exemplar Multi-Choice Questions",
        solvedExample: {
          q: "Which vitamin deficiency causes Pernicious Anemia?",
          sol: "Vitamin B₁₂ (Cobalamin), which is absorbed with the help of Castle's intrinsic factor."
        }
      },
      {
        title: "Biology: Botany & Zoology Line-by-Line",
        hindi: "जीव विज्ञान: बॉटनी एवं जूलॉजी लाइन-बाय-लाइन",
        keyTakeaway: "Genetics, Human Physiology, Plant Physiology, and Biotechnology. Must remember all scientist names, dates, and diagram labels.",
        formulas: [
          "Hardy-Weinberg Equation: p² + 2pq + q² = 1",
          "Cardiac Output = Stroke Volume × Heart Rate",
          "Gross Primary Productivity - Respiration = Net Primary Productivity"
        ],
        mustSolve: "All NCERT Back Exercises & Summary Points",
        solvedExample: {
          q: "What is the role of restriction endonuclease?",
          sol: "It cuts DNA at specific recognition nucleotide sequences known as restriction sites."
        }
      }
    ]
  }
];

// Open rich interactive book modal
function openBookModal(bookId) {
  const book = NEET_BOOKS_LIBRARY.find(b => b.id === bookId) || NEET_BOOKS_LIBRARY[0];
  if (!book) return;

  let modal = document.getElementById('bookDetailModal');
  if (!modal) {
    modal = document.createElement('dialog');
    modal.id = 'bookDetailModal';
    modal.className = 'neet-dialog';
    modal.style.cssText = `
      background: var(--bg-surface, #0f172a);
      color: var(--text-main, #f8fafc);
      border: 1px solid var(--brand-sky, #38bdf8);
      border-radius: 16px;
      padding: 0;
      max-width: 840px;
      width: 95%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(16px);
    `;
    document.body.appendChild(modal);
  }

  const isHindi = (window.appState && window.appState.lang === 'hindi');

  modal.innerHTML = `
    <div style="background:var(--bg-surface); padding:18px 24px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:flex-start;">
      <div>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <span class="tag-badge tag-high" style="font-size:10px;">${book.badge}</span>
          <span style="font-size:11px; color:var(--brand-gold); font-weight:700;">★ ${book.rating}</span>
        </div>
        <h2 style="font-size:20px; font-weight:800; margin:0 0 2px; color:var(--text-heading);">${book.coverIcon} ${isHindi ? book.hindiTitle : book.title}</h2>
        <div style="font-size:12px; color:var(--text-muted);">✍️ Author: <strong style="color:var(--brand-sky);">${book.author}</strong></div>
      </div>
      <button class="btn ghost btn-sm" onclick="document.getElementById('bookDetailModal').close()" style="font-size:18px; line-height:1; cursor:pointer;">✕</button>
    </div>

    <div style="padding:20px 24px; max-height:75vh; overflow-y:auto; background:var(--bg-card); color:var(--text-main);">
      <!-- Direct Online Reading & Free Official PDF Action Bar -->
      <div style="background:var(--bg-surface); border:1px solid var(--brand-emerald); border-radius:12px; padding:14px 18px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <div style="font-size:13px; font-weight:800; color:var(--text-heading); margin-bottom:2px;">
            🌐 100% Free Official Reading & PDF Access:
          </div>
          <div style="font-size:11.5px; color:var(--text-muted);">
            Direct link to NCERT, NPTEL, Swayam Prabha & Open Access Archives
          </div>
        </div>
        <a href="${book.readOnlineUrl || 'https://ncert.nic.in/textbook.php'}" target="_blank" rel="noopener noreferrer" class="btn primary btn-sm" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; font-weight:700;">
          📖 Open Official Free PDF & Portal ↗
        </a>
      </div>

      <!-- Book Strategy & Topper Method -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-left:3px solid var(--brand-sky); border-radius:12px; padding:14px; margin-bottom:18px;">
        <h4 style="font-size:13px; font-weight:800; color:var(--brand-sky); margin:0 0 6px;">💡 How Toppers Solve This Book for NEET:</h4>
        <p style="font-size:12.5px; color:var(--text-main); line-height:1.5; margin:0;">${book.strategy}</p>
      </div>

      <!-- Chapter Breakdown & Reading Notes -->
      <h3 style="font-size:15px; font-weight:800; color:var(--text-heading); margin:0 0 12px;">📑 Key Chapters, Formulas & Worked Examples</h3>
      <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px;">
        ${book.chapters.map((ch, idx) => `
          <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:12px; padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
              <h4 style="font-size:14px; font-weight:800; color:var(--brand-gold); margin:0;">${ch.title}</h4>
              <span class="tag-badge tag-adv" style="font-size:10px;">Must Solve</span>
            </div>
            
            <p style="font-size:12px; color:var(--text-muted); line-height:1.4; margin-bottom:10px;">
              🔍 <strong>Core Concept:</strong> ${ch.keyTakeaway}
            </p>

            <!-- Key Formulas -->
            <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:10px 12px; border-radius:8px; border-left:3px solid var(--brand-sky); margin-bottom:10px;">
              <div style="font-size:10.5px; font-weight:700; color:var(--brand-sky); text-transform:uppercase; margin-bottom:4px;">⚡ Essential Equations:</div>
              ${ch.formulas.map(f => `
                <div style="font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--text-main); margin-bottom:3px;">• ${f}</div>
              `).join('')}
            </div>

            <!-- Solved Example -->
            ${ch.solvedExample ? `
              <div style="background:var(--bg-card); border:1px solid rgba(16,185,129,0.3); border-radius:8px; padding:10px 12px; margin-bottom:10px;">
                <div style="font-size:11px; font-weight:800; color:var(--brand-emerald); margin-bottom:4px;">🎯 Real Concept Problem:</div>
                <div style="font-size:12px; font-weight:600; color:var(--text-heading); margin-bottom:4px;">${ch.solvedExample.q}</div>
                <div style="font-size:11.5px; color:var(--text-muted); line-height:1.4;"><strong style="color:var(--brand-emerald);">Ans:</strong> ${ch.solvedExample.sol}</div>
              </div>
            ` : ''}

            <div style="font-size:11px; color:var(--text-muted);">
              📌 <strong>Recommended Questions:</strong> <span style="color:var(--text-main); font-weight:600;">${ch.mustSolve}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <a href="${book.readOnlineUrl || 'https://ncert.nic.in/textbook.php'}" target="_blank" rel="noopener noreferrer" style="font-size:12px; color:var(--brand-sky); font-weight:700; text-decoration:none;">
          🌐 Open Official Reading Page ↗
        </a>
        <button class="btn ghost btn-sm" onclick="document.getElementById('bookDetailModal').close()">Close</button>
      </div>
    </div>
  `;

  modal.showModal();
}

window.NEET_BOOKS_LIBRARY = NEET_BOOKS_LIBRARY;
window.openBookModal = openBookModal;

