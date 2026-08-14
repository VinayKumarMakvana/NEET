/**
 * NEET UG 2028: High-Yield Notes, Formula Vault, Organic Roadmaps & NCERT Line Summaries
 */
const NEET_NOTES = [
  // --- PHYSICS FORMULA & CONCEPT VAULT ---
  {
    id: 'note-phy-mechanics',
    subject: 'Physics',
    category: 'Formula Vault',
    title: 'Mechanics & Kinematics Master Formula Sheet',
    summary: 'Essential formulas for 1D, 2D motion, NLM, Work-Power-Energy & Rotational Dynamics.',
    content: `
### 1. Kinematics (1D & 2D)
- **Kinematic Equations (Uniform Acceleration):**
  $$v = u + at$$
  $$s = ut + \\frac{1}{2}at^2$$
  $$v^2 = u^2 + 2as$$
  $$s_n = u + \\frac{a}{2}(2n - 1)$$ (Distance in $n$-th second)
- **Projectile Motion (Ground to Ground):**
  - Time of Flight: $T = \\frac{2u \\sin\\theta}{g}$
  - Maximum Height: $H = \\frac{u^2 \\sin^2\\theta}{2g}$
  - Horizontal Range: $R = \\frac{u^2 \\sin(2\\theta)}{g}$ (Max Range at $\\theta = 45^\\circ$, $R_{max} = \\frac{u^2}{g}$)
  - Relation: $H = \\frac{R \\tan\\theta}{4}$

### 2. Newton's Laws & Friction
- **Impulse:** $J = \\int F dt = \\Delta p = m(v - u)$
- **Friction Force:** $f_s \\le \\mu_s N$; Kinetic friction $f_k = \\mu_k N$ (where $\\mu_k < \\mu_s$).
- **Banking of Roads:**
  - Without friction: $v = \\sqrt{R g \\tan\\theta}$
  - With friction (Maximum safe velocity): $v_{max} = \\sqrt{R g \\left(\\frac{\\mu + \\tan\\theta}{1 - \\mu \\tan\\theta}\\right)}$

### 3. Work, Energy & Power
- **Work-Energy Theorem:** $W_{all} = \\Delta K = K_f - K_i$
- **Potential Energy of Spring:** $U = \\frac{1}{2}kx^2$
- **Power:** $P = \\frac{dW}{dt} = \\vec{F} \\cdot \\vec{v}$
- **Coefficient of Restitution (Collision):** $e = \\frac{v_2 - v_1}{u_1 - u_2}$ (Elastic $e=1$, Inelastic $0<e<1$, Perfectly Inelastic $e=0$).

### 4. Rotational Motion & Moment of Inertia ($I$)
- Ring/Hoop about central axis: $I = MR^2$
- Uniform Disc: $I = \\frac{1}{2}MR^2$
- Solid Cylinder: $I = \\frac{1}{2}MR^2$; Hollow Cylinder: $I = MR^2$
- Solid Sphere: $I = \\frac{2}{5}MR^2$; Hollow Sphere: $I = \\frac{2}{3}MR^2$
- Uniform Rod about center: $I = \\frac{1}{12}ML^2$; about end: $I = \\frac{1}{3}ML^2$
- **Parallel Axis Theorem:** $I = I_{cm} + M d^2$
- **Torque & Angular Momentum:** $\\tau = I\\alpha = \\frac{dL}{dt}$, $L = I\\omega = m v r_\\perp$
- **Rolling without Slipping:** $K_{total} = \\frac{1}{2}mv^2 + \\frac{1}{2}I\\omega^2 = \\frac{1}{2}mv^2 \\left(1 + \\frac{k^2}{R^2}\\right)$
    `
  },
  {
    id: 'note-phy-electrodynamics',
    subject: 'Physics',
    category: 'Formula Vault',
    title: 'Electrodynamics, Magnetism & AC Circuits Formula Vault',
    summary: 'Coulomb’s law, Gauss’s law, Capacitors, Kirchhoff’s laws, Biot-Savart & AC resonance.',
    content: `
### 1. Electrostatics & Capacitance
- **Coulomb’s Law:** $F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_1 q_2}{r^2}$ ($k = 9 \\times 10^9 \\text{ N}\\cdot\\text{m}^2/\\text{C}^2$)
- **Electric Dipole:**
  - Dipole moment: $\\vec{p} = q \\cdot 2\\vec{a}$
  - Axial Field: $E_{axial} = \\frac{2kp}{r^3}$; Equatorial Field: $E_{eq} = \\frac{kp}{r^3}$ ($E_{axial} = 2 E_{eq}$)
  - Torque in uniform field: $\\vec{\\tau} = \\vec{p} \\times \\vec{E}$, Potential energy: $U = -\\vec{p} \\cdot \\vec{E}$
- **Parallel Plate Capacitor:** $C = \\frac{\\kappa \\varepsilon_0 A}{d}$
  - Energy stored: $U = \\frac{1}{2}CV^2 = \\frac{Q^2}{2C} = \\frac{1}{2}QV$
  - Energy density: $u_E = \\frac{1}{2}\\varepsilon_0 E^2$

### 2. Current Electricity
- **Current & Drift Velocity:** $I = n e A v_d$, where $v_d = \\frac{e E \\tau}{m}$
- **Resistivity & Temperature:** $\\rho_T = \\rho_0 [1 + \\alpha(T - T_0)]$
- **Kirchhoff’s Laws:**
  - KCL (Junction rule): $\\sum I = 0$ (Conservation of Charge)
  - KVL (Loop rule): $\\sum \\Delta V = 0$ (Conservation of Energy)
- **Cells in Combination:**
  - Series: $\\mathcal{E}_{eq} = \\mathcal{E}_1 + \\mathcal{E}_2$, $r_{eq} = r_1 + r_2$
  - Parallel: $\\mathcal{E}_{eq} = \\frac{\\mathcal{E}_1/r_1 + \\mathcal{E}_2/r_2}{1/r_1 + 1/r_2}$, $\\frac{1}{r_{eq}} = \\frac{1}{r_1} + \\frac{1}{r_2}$

### 3. Magnetism & EMI & AC
- **Magnetic Force:** $\\vec{F} = q(\\vec{v} \\times \\vec{B})$, Radius in circular orbit: $r = \\frac{mv}{qB}$
- **Biot-Savart Law:** $dB = \\frac{\\mu_0}{4\\pi} \\frac{I dl \\sin\\theta}{r^2}$
  - Straight Wire: $B = \\frac{\\mu_0 I}{2\\pi d}$
  - Center of Circular Loop: $B = \\frac{\\mu_0 I}{2R}$
- **Faraday’s Law of Induction:** $\\varepsilon = -\\frac{d\\Phi_B}{dt} = -N \\frac{d(BA\\cos\\theta)}{dt}$
- **Series LCR AC Circuit:**
  - Impedance: $Z = \\sqrt{R^2 + (X_L - X_C)^2}$ (where $X_L = \\omega L$, $X_C = \\frac{1}{\\omega C}$)
  - Resonance Frequency: $\\omega_0 = \\frac{1}{\\sqrt{LC}}$ ($f_0 = \\frac{1}{2\\pi\\sqrt{LC}}$)
  - Power in AC: $P_{avg} = V_{rms} I_{rms} \\cos\\phi$ (Power factor $\\cos\\phi = \\frac{R}{Z}$)
    `
  },
  {
    id: 'note-phy-optics-modern',
    subject: 'Physics',
    category: 'Formula Vault',
    title: 'Optics, Wave Nature & Modern Physics Formula Vault',
    summary: 'Snell’s law, Lens maker’s formula, YDSE, Photoelectric effect, Bohr atom & Nuclear physics.',
    content: `
### 1. Ray Optics & Optical Instruments
- **Refraction at Spherical Surface:** $\\frac{\\mu_2}{v} - \\frac{\\mu_1}{u} = \\frac{\\mu_2 - \\mu_1}{R}$
- **Lens Maker’s Formula:** $\\frac{1}{f} = (\\mu - 1) \\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)$
- **Prism Equation:** $A + \\delta = i + e$; At minimum deviation $\\delta_m$: $\\mu = \\frac{\\sin\\left(\\frac{A + \\delta_m}{2}\\right)}{\\sin\\left(\\frac{A}{2}\\right)}$
- **Compound Microscope:** $M = -\\frac{v_o}{u_o} \\left(1 + \\frac{D}{f_e}\\right)$ or for normal adjustment $M = -\\frac{L}{f_o} \\frac{D}{f_e}$

### 2. Wave Optics
- **Young’s Double Slit Experiment (YDSE):**
  - Fringe width: $\\beta = \\frac{\\lambda D}{d}$
  - Maxima condition: $\\Delta x = n\\lambda$, Position $y_n = \\frac{n\\lambda D}{d}$
  - Minima condition: $\\Delta x = (2n - 1)\\frac{\\lambda}{2}$, Position $y_n = (2n - 1)\\frac{\\lambda D}{2d}$

### 3. Modern Physics & Quantum Mechanics
- **Photoelectric Equation:** $h\\nu = \\Phi_0 + K_{max} = h\\nu_0 + e V_0$
- **de Broglie Wavelength:** $\\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2mE}} = \\frac{12.27}{\\sqrt{V}} \\text{ \\AA}$ (for electron)
- **Bohr Model of Hydrogen Atom:**
  - Radius: $r_n = 0.529 \\frac{n^2}{Z} \\text{ \\AA}$
  - Velocity: $v_n = 2.18 \\times 10^6 \\frac{Z}{n} \\text{ m/s}$
  - Energy: $E_n = -13.6 \\frac{Z^2}{n^2} \\text{ eV}$
- **Rydberg Formula:** $\\frac{1}{\\lambda} = R Z^2 \\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)$
  - Lyman (UV): $n_1=1$; Balmer (Visible): $n_1=2$; Paschen (Infrared): $n_1=3$
    `
  },

  // --- CHEMISTRY MASTER REACTION & EXCEPTION VAULT ---
  {
    id: 'note-chem-organic-roadmaps',
    subject: 'Chemistry',
    category: 'Reaction Roadmap',
    title: 'Organic Chemistry High-Yield Named Reactions & Conversions',
    summary: 'All key named reactions, reagents, tests, and mechanisms required for NEET 180/180.',
    content: `
### 1. Top High-Yield Organic Named Reactions
1. **Reimer-Tiemann Reaction:**
   - Phenol $+ \\text{CHCl}_3 + \\text{aq. NaOH} \\xrightarrow{340\\text{ K}} \\text{Salicylaldehyde (ortho-hydroxybenzaldehyde)}$
   - *Electrophile:* Dichlorocarbene $(:\\text{CCl}_2)$ (neutral electrophile with 6 valence electrons).
2. **Kolbe’s Reaction:**
   - Phenol $+ \\text{NaOH} \\rightarrow \\text{Sodium Phenoxide} \\xrightarrow[125^\\circ\\text{C}, 4-7\\text{ atm}]{\\text{CO}_2} \\xrightarrow{\\text{H}^+} \\text{Salicylic Acid}$ (Used in Aspirin synthesis).
3. **Aldol Condensation:**
   - Carbonyls containing **$\\alpha$-hydrogens** with dilute alkali ($\\text{dil. NaOH}$) $\\rightarrow$ $\\beta$-hydroxy aldehyde/ketone $\\xrightarrow{\\Delta, -\\text{H}_2\\text{O}} \\alpha,\\beta$-unsaturated carbonyl compound.
4. **Cannizzaro Reaction:**
   - Aldehydes **without $\\alpha$-hydrogens** (HCHO, $\\text{C}_6\\text{H}_5\\text{CHO}$, $(\\text{CH}_3)_3\\text{C-CHO}$) with conc. alkali ($50\\% \\text{ KOH}$) undergo disproportionation:
   - $2\\text{HCHO} + \\text{conc. KOH} \\rightarrow \\text{HCOOK} + \\text{CH}_3\\text{OH}$.
5. **Gabriel Phthalimide Synthesis:**
   - Used exclusively for preparation of **pure $1^\\circ$ aliphatic amines** (Aromatic $1^\\circ$ amines cannot be prepared because aryl halides do not undergo nucleophilic substitution with phthalimide anion).
6. **Hoffmann Bromamide Degradation Reaction:**
   - $\\text{R-CONH}_2 + \\text{Br}_2 + 4\\text{KOH} \\rightarrow \\text{R-NH}_2 + \\text{K}_2\\text{CO}_3 + 2\\text{KBr} + 2\\text{H}_2\\text{O}$ (Product amine has **one less carbon** than amide).
7. **Rosenmund Reduction:**
   - $\\text{R-COCl} + \\text{H}_2 \\xrightarrow{\\text{Pd/BaSO}_4, \\text{quinoline/sulphur}} \\text{R-CHO}$ (BaSO4 poisons the catalyst to stop further reduction to alcohol).
8. **Etard Reaction:**
   - Toluene $+ \\text{CrO}_2\\text{Cl}_2$ (chromyl chloride in $\\text{CS}_2$) $\\rightarrow$ Chromium complex $\\xrightarrow{\\text{H}_3\\text{O}^+} \\text{Benzaldehyde}$.

### 2. Functional Group Identification Tests
- **Lucas Test ($1^\\circ, 2^\\circ, 3^\\circ$ Alcohols):** Anhydrous $\\text{ZnCl}_2 + \\text{conc. HCl}$
  - $3^\\circ$ alcohol: Turbidity appears immediately.
  - $2^\\circ$ alcohol: Turbidity appears within 5 minutes.
  - $1^\\circ$ alcohol: Turbidity appears only upon heating.
- **Iodoform Test:** $\\text{I}_2 + \\text{NaOH}$ (Yellow precipitate of $\\text{CHI}_3$, MP $119^\\circ\\text{C}$)
  - Positive for compounds having $\\text{CH}_3-\\text{C=O}$ or $\\text{CH}_3-\\text{CH(OH)}-$ group (Ethanol, Acetaldehyde, Acetone, 2-Propanol, 2-Pentanone, Acetophenone).
- **Hinsberg Test for Amines (Benzene sulphonyl chloride $\\text{C}_6\\text{H}_5\\text{SO}_2\\text{Cl}$):**
  - $1^\\circ$ Amine: Forms N-alkylbenzene sulphonamide, **soluble in alkali** (due to acidic H).
  - $2^\\circ$ Amine: Forms N,N-dialkylbenzene sulphonamide, **insoluble in alkali** (no acidic H).
  - $3^\\circ$ Amine: **No reaction** (no H on nitrogen).
    `
  },
  {
    id: 'note-chem-inorganic-exceptions',
    subject: 'Chemistry',
    category: 'Exception Vault',
    title: 'Inorganic Chemistry Critical Trends, Exceptions & Coordination Theory',
    summary: 'Periodic anomalies, inert pair effect, lanthanoid contraction, CFT splitting & d-block colors.',
    content: `
### 1. Periodic Trends & Famous Exceptions
- **Ionization Enthalpy (IE):**
  - Group 2 > Group 13: $\\text{Be} (1s^2 2s^2) > \\text{B} (1s^2 2s^2 2p^1)$ because fully filled $2s$ orbital has higher penetration and stability.
  - Group 15 > Group 16: $\\text{N} (2p^3) > \\text{O} (2p^4)$ because half-filled $2p^3$ configuration is extra stable.
  - Overall order of 2nd period: $\\text{Li} < \\text{B} < \\text{Be} < \\text{C} < \\text{O} < \\text{N} < \\text{F} < \\text{Ne}$.
- **Electron Gain Enthalpy (Negative $\\Delta_{eg}H$):**
  - $\\text{Cl} > \\text{F}$ and $\\text{S} > \\text{O}$ (Chlorine has highest electron gain enthalpy in the entire periodic table because Fluorine’s compact $2p$ subshell experiences high electron-electron repulsion).
  - Order: $\\text{Cl} > \\text{F} > \\text{Br} > \\text{I}$; $\\text{S} > \\text{Se} > \\text{Te} > \\text{Po} > \\text{O}$.
- **Bond Dissociation Enthalpy of Halogens:**
  - Order: $\\text{Cl}_2 > \\text{Br}_2 > \\text{F}_2 > \\text{I}_2$ (Fluorine has lower bond enthalpy than $\\text{Cl}_2$ and $\\text{Br}_2$ due to high lone-pair-lone-pair repulsions).

### 2. Coordination Chemistry & Crystal Field Theory (CFT)
- **Spectrochemical Series:**
  $$\\text{I}^- < \\text{Br}^- < \\text{S}^{2-} < \\text{SCN}^- < \\text{Cl}^- < \\text{N}_3^- < \\text{F}^- < \\text{OH}^- < \\text{C}_2\\text{O}_4^{2-} < \\text{H}_2\\text{O} < \\text{NCS}^- < \\text{EDTA}^{4-} < \\text{NH}_3 < \\text{en} < \\text{CN}^- < \\text{CO}$$
  - Strong Field Ligands (CN-, CO, en, NH3) $\\rightarrow$ High $\\Delta_o$, cause pairing ($P < \\Delta_o$), form **Low-Spin / Inner Orbital Complexes**.
  - Weak Field Ligands (Halides, H2O, OH-) $\\rightarrow$ Low $\\Delta_o$, no pairing ($P > \\Delta_o$), form **High-Spin / Outer Orbital Complexes**.
- **Octahedral vs Tetrahedral Splitting:**
  - $\\Delta_t = \\frac{4}{9} \\Delta_o$ (Tetrahedral complexes are almost always high-spin because $\\Delta_t$ is smaller than pairing energy).
- **Magnetic Moment Formula:**
  $$\\mu = \\sqrt{n(n + 2)} \\text{ BM}$$ (where $n = \\text{number of unpaired electrons}$).
    `
  },

  // --- BIOLOGY NCERT LINE-BY-LINE CRACKER ---
  {
    id: 'note-bio-genetics-molecular',
    subject: 'Biology',
    category: 'NCERT Line Cracker',
    title: 'Genetics & Molecular Biology NCERT Line-by-Line Gold Notes',
    summary: 'Mendelian crosses, Morgan linkage data, DNA replication enzymes, Lac Operon, Genetic code.',
    content: `
### 1. Principles of Inheritance & Variation (Genetics I)
- **Incomplete Dominance:** *Mirabilis jalapa* (4 o'clock plant) and *Antirrhinum majus* (Snapdragon/Dog flower) $\\rightarrow$ Phenotypic and Genotypic ratio both $= 1:2:1$ (Red : Pink : White).
- **Co-dominance & Multiple Alleles:** ABO Blood grouping controlled by gene $I$ with 3 alleles: $I^A, I^B, i$. Six genotypes, four phenotypes. $I^A$ and $I^B$ are completely dominant over $i$, but co-dominant with each other ($I^A I^B$ produces AB blood group).
- **Morgan's Drosophila Experiments:**
  - Eye colour & Body colour genes (Yellow body & White eye): $98.7\\%$ Parental, **$1.3\\%$ Recombinant** (Very tightly linked on X chromosome).
  - Eye colour & Wing shape genes (White eye & Miniature wing): $62.8\\%$ Parental, **$37.2\\%$ Recombinant** (Loosely linked).
  - Alfred Sturtevant used frequency of recombination as a measure of genetic map distance ($1\\% \\text{ recombination} = 1\\text{ Map Unit} = 1\\text{ centiMorgan}$).
- **Genetic Disorders Mode of Inheritance:**
  - *Autosomal Recessive:* Sickle cell anaemia (GAG to GUG mutation on 6th codon of $\\beta$-globin chain, Glutamic acid replaced by Valine), Phenylketonuria (lack of phenylalanine hydroxylase enzyme), Thalassemia.
  - *Autosomal Dominant:* Myotonic dystrophy.
  - *X-Linked Recessive:* Haemophilia (Queen Victoria carrier pedigree), Red-Green Colour blindness.
  - *Chromosomal:* Down’s Syndrome (Trisomy 21, 47 chromosomes), Klinefelter’s Syndrome (44 + XXY, 47 chromosomes, sterile male with gynaecomastia), Turner’s Syndrome (44 + X0, 45 chromosomes, sterile female with rudimentary ovaries).

### 2. Molecular Basis of Inheritance (Genetics II)
- **DNA Dimensions:** Distance between two base pairs $= 0.34\\text{ nm} = 0.34 \\times 10^{-9}\\text{ m}$. Pitch of helix $= 3.4\\text{ nm}$ ($10\\text{ bp}$ per turn). Length of human diploid DNA $= 6.6 \\times 10^9 \\text{ bp} \\times 0.34 \\times 10^{-9} \\approx 2.2\\text{ meters}$.
- **Semiconservative Replication Proof:** Meselson & Stahl (1958) using $^{15}\\text{NH}_4\\text{Cl}$ and CsCl density gradient centrifugation in *E. coli*. Taylor et al. used radioactive thymidine in *Vicia faba*.
- **Enzymes of Replication:**
  - Main enzyme: DNA-dependent DNA Polymerase (adds nucleotides only in $5' \\rightarrow 3'$ direction with high fidelity).
  - Continuous synthesis on Leading strand ($3' \\rightarrow 5'$ template); Discontinuous synthesis on Lagging strand ($5' \\rightarrow 3'$ template forming Okazaki fragments joined by DNA Ligase).
- **Lac Operon (Jacob & Monod):**
  - *i-gene (regulator):* Constitutively synthesizes Lac Repressor protein.
  - *Operator ($O$):* Binding site for repressor. When Inducer (**Allolactose/Lactose**) binds repressor, repressor is inactivated and RNA polymerase transcribes polycistronic mRNA.
  - *Structural genes:*
    - **$z$ gene:** Codes for $\\beta$-galactosidase (hydrolyzes lactose into glucose + galactose).
    - **$y$ gene:** Codes for Permease (increases cell permeability to $\\beta$-galactosides).
    - **$a$ gene:** Codes for Transacetylase.
    `
  },
  {
    id: 'note-bio-human-physiology',
    subject: 'Biology',
    category: 'NCERT Line Cracker',
    title: 'Human Physiology NCERT Line-by-Line High-Yield Summary',
    summary: 'Respiratory capacities, ECG waves, Counter-current mechanism, Sarcomere bands, Endocrine axes.',
    content: `
### 1. Breathing & Respiratory Capacities
- **Tidal Volume (TV):** $\\approx 500\\text{ mL}$ (6000–8000 mL/min).
- **Inspiratory Reserve Volume (IRV):** $2500 - 3000\\text{ mL}$.
- **Expiratory Reserve Volume (ERV):** $1000 - 1100\\text{ mL}$.
- **Residual Volume (RV):** $1100 - 1200\\text{ mL}$ (Cannot be measured by spirometer!).
- **Vital Capacity (VC):** $\\text{ERV} + \\text{TV} + \\text{IRV} \\approx 3500 - 4500\\text{ mL}$.
- **Total Lung Capacity (TLC):** $\\text{RV} + \\text{ERV} + \\text{TV} + \\text{IRV} = \\text{VC} + \\text{RV} \\approx 5800\\text{ mL}$.
- **Oxygen-Haemoglobin Dissociation Curve:** Sigmoid curve.
  - *Shift to Right (Decreased Affinity / Bohr Effect):* High $\\text{pCO}_2$, High $\\text{H}^+$ (Low pH), High Temperature, High 2,3-BPG (Occurs in tissues).
  - *Shift to Left (Increased Affinity):* High $\\text{pO}_2$, Low $\\text{pCO}_2$, Low $\\text{H}^+$ (High pH), Low Temperature (Occurs in alveoli).

### 2. Body Fluids & Circulation
- **Cardiac Output:** $\\text{Stroke Volume} \\times \\text{Heart Rate} = 70\\text{ mL} \\times 72/\\text{min} \\approx 5000\\text{ mL/min} = 5\\text{ Litres/min}$.
- **ECG Interpretation:**
  - **P Wave:** Depolarisation of atria (leads to atrial contraction).
  - **QRS Complex:** Depolarisation of ventricles (marks onset of ventricular contraction).
  - **T Wave:** Repolarisation of ventricles (return to resting state).
  - *Clinical note:* Elevation of ST segment indicates Myocardial Infarction.

### 3. Excretory System & Counter-Current Mechanism
- **Glomerular Filtration Rate (GFR):** $125\\text{ mL/min} = 180\\text{ Litres/day}$. Urine output is only $\\approx 1.5\\text{ L/day}$ ($99\\%$ reabsorbed!).
- **Counter-Current Multiplier:** Maintained by Henle’s loop and Vasa recta in renal medulla. Medullary osmolarity increases from $300\\text{ mOsmol/L}$ (cortex) to $1200\\text{ mOsmol/L}$ (inner medulla) due to $\\text{NaCl}$ and Urea.
- **Hormonal Control (RAAS):** Decreased blood flow $\\rightarrow$ JGA cells secrete **Renin** $\\rightarrow$ converts Angiotensinogen to Angiotensin I $\\rightarrow$ Angiotensin II (powerful vasoconstrictor) $\\rightarrow$ stimulates Adrenal Cortex to release **Aldosterone** (reabsorbs $\\text{Na}^+$ and $\\text{H}_2\\text{O}$ from DCT). Antagonized by **ANF** (Atrial Natriuretic Factor from heart wall causes vasodilation).
    `
  },
  {
    id: 'note-nmc-waste-elimination',
    subject: 'Biology',
    category: 'NMC Pure NCERT Guide',
    title: '🛡️ NMC 2024-2028 Pure NCERT Protocol: What to OMIT & AVOID (Zero-Waste Guide)',
    summary: 'Strict list of deleted topics, out-of-syllabus BSc modules, and AIIMS-Level physics derivations to NEVER waste time on.',
    content: `
### 🚫 1. DELETED & OUT-OF-SYLLABUS BIOLOGY (DO NOT TOUCH!)
Many old coaching modules contain 100+ pages of out-of-syllabus BSc material. The NMC and NTA have strictly rationalized the NEET syllabus:

- **Deleted Zoology Topics:**
  - ❌ **Earthworm (Pheretima posthuma)**: Completely deleted from NEET syllabus.
  - ❌ **Cockroach (Periplaneta americana)** detailed anatomy: Only brief insect morphology/Frog (Rana tigrina) is priority.
  - ❌ **Digestion and Absorption** (Human Physiology Unit): Removed by NMC.
  - ❌ **Reproduction in Organisms** (Class 12 Ch 1): Deleted.
  - ❌ **Strategies for Enhancement in Food Production** (Animal/Plant Breeding modules): Deleted.

- **Deleted Botany Topics:**
  - ❌ **Transport in Plants** (Class 11): Removed by NMC.
  - ❌ **Mineral Nutrition** (Class 11): Removed by NMC.
  - ❌ **Environmental Issues** (Class 12 Ecology Ch 16): Deleted.
  - ❌ **Secondary Growth in Anatomy of Flowering Plants**: Highly simplified in latest NCERT; skip complex BSc periderm/bark formulas.

---

### 🚫 2. ZERO NEET-ADVANCED OVERKILL IN PHYSICS
NEET Physics tests **concept clarity + calculation speed**, not 5-page mathematical proofs:
- ❌ **Avoid Multivariable Calculus / Double Integrals**: NEET never asks derivations using differential equations or triple integration.
- ❌ **Avoid Complex AIIMS AIQ Mechanics**: Wedge-constraint 4-pulley systems, variable mass rocket trajectory calculus, or Lagrangian mechanics have 0% relevance for NEET 720/720.
- ✅ **Stick to High-Yield NEET Formula Recall**: Direct application of $v=u+at$, Work-Energy Theorem, Biot-Savart, Snell's Law, Photoelectric Effect $E=h\\nu-\\phi$, and Bohr's orbits.

---

### 🚫 3. ZERO SOCIAL FEED & DISTRACTION-FREE COMMITMENT
- ❌ **No Chatrooms, Social Comments or Flame Wars**: 95% of social discussion threads on test prep apps are filled with anxiety and misinformation.
- ✅ **Focus 100% on Active Recall & Error Elimination**: Use your **Mistake Notebook**, **60s Formula Rapid-Fire**, and **NCERT Line-by-Line Mock Tests**.
    `
  }
];

function getNotesBySubject(subject) {
  if (!subject || subject === 'All') return NEET_NOTES;
  return NEET_NOTES.filter(n => n.subject === subject);
}

