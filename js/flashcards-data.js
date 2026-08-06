/**
 * NEET UG 2028: Active Recall Flashcard Engine
 * Anki-style spaced repetition cards for 100% factual retention
 */
const NEET_FLASHCARDS = [
  // --- BIOLOGY NCERT LINE RECALL ---
  {
    id: 'fc-bio-01',
    subject: 'Biology',
    category: 'Genetics',
    front: 'What is the exact base pair length and physical length of human diploid DNA?',
    back: '6.6 × 10⁹ base pairs (bp), corresponding to approximately 2.2 meters in length (0.34 × 10⁻⁹ m per bp).',
    reference: 'NCERT Class 12, Chapter 6 (Molecular Basis of Inheritance)'
  },
  {
    id: 'fc-bio-02',
    subject: 'Biology',
    category: 'Genetics',
    front: 'What is the genetic code mutation that causes Sickle Cell Anaemia in humans?',
    back: 'Point mutation in the 6th codon of β-globin gene: GAG (Glutamic acid) is mutated to GUG (Valine).',
    reference: 'NCERT Class 12, Chapter 5 (Principles of Inheritance)'
  },
  {
    id: 'fc-bio-03',
    subject: 'Biology',
    category: 'Genetics',
    front: 'What were the parental and recombinant percentages obtained by T.H. Morgan for body colour and eye colour genes in Drosophila?',
    back: '98.7% Parental types and 1.3% Recombinants (indicating very tight linkage on the X chromosome).',
    reference: 'NCERT Class 12, Chapter 5 (Page 83)'
  },
  {
    id: 'fc-bio-04',
    subject: 'Biology',
    category: 'Biotechnology',
    front: 'Which specific Cry proteins of Bacillus thuringiensis control Cotton Bollworms and Corn Borer respectively?',
    back: '• Cotton Bollworms: CryIAc and CryIIAb\n• Corn Borer: CryIAb',
    reference: 'NCERT Class 12, Chapter 12 (Biotechnology and its Applications)'
  },
  {
    id: 'fc-bio-05',
    subject: 'Biology',
    category: 'Human Physiology',
    front: 'Which respiratory volume cannot be measured by a standard clinical spirometer?',
    back: 'Residual Volume (RV) — and consequently capacities containing RV: Functional Residual Capacity (FRC) and Total Lung Capacity (TLC).',
    reference: 'NCERT Class 11, Chapter 17 (Breathing and Exchange of Gases)'
  },
  {
    id: 'fc-bio-06',
    subject: 'Biology',
    category: 'Human Physiology',
    front: 'What do the P wave, QRS complex, and T wave represent on a standard clinical ECG?',
    back: '• P Wave: Atrial depolarisation\n• QRS Complex: Ventricular depolarisation (onset of ventricular contraction)\n• T Wave: Ventricular repolarisation',
    reference: 'NCERT Class 11, Chapter 18 (Body Fluids and Circulation)'
  },
  {
    id: 'fc-bio-07',
    subject: 'Biology',
    category: 'Plant Physiology',
    front: 'What is the first stable product of CO₂ fixation in C₃ plants vs C₄ plants?',
    back: '• C₃ Plants: 3-PGA (3-Phosphoglyceric acid, 3-Carbon compound)\n• C₄ Plants: OAA (Oxaloacetic acid, 4-Carbon compound)',
    reference: 'NCERT Class 11, Chapter 13 (Photosynthesis)'
  },
  {
    id: 'fc-bio-08',
    subject: 'Biology',
    category: 'Cell Biology',
    front: 'During which sub-stage of Prophase I of Meiosis does crossing over and synapsis take place?',
    back: '• Synapsis (pairing of homologous chromosomes): Zygotene\n• Crossing over (recombination nodule mediated by Recombinase): Pachytene\n• Chiasmata appearance: Diplotene',
    reference: 'NCERT Class 11, Chapter 10 (Cell Cycle and Division)'
  },
  {
    id: 'fc-bio-09',
    subject: 'Biology',
    category: 'Ecology',
    front: 'What is "The Evil Quartet" in biodiversity loss?',
    back: '1. Habitat loss and fragmentation (most important cause)\n2. Over-exploitation\n3. Alien species invasion\n4. Co-extinctions',
    reference: 'NCERT Class 12, Chapter 15 (Biodiversity and Conservation)'
  },
  {
    id: 'fc-bio-10',
    subject: 'Biology',
    category: 'Human Reproduction',
    front: 'Which hormone surge triggers ovulation on approximately day 14 of the menstrual cycle?',
    back: 'LH Surge (Luteinizing Hormone peak induced by high estrogen levels from the mature Graafian follicle).',
    reference: 'NCERT Class 12, Chapter 3 (Human Reproduction)'
  },

  // --- CHEMISTRY ACTIVE RECALL ---
  {
    id: 'fc-chem-01',
    subject: 'Chemistry',
    category: 'Inorganic Chemistry',
    front: 'Why is the first ionization enthalpy of Nitrogen higher than that of Oxygen?',
    back: 'Nitrogen has a half-filled 2p subshell (1s² 2s² 2p³), which confers extra quantum exchange stability and symmetry compared to Oxygen (1s² 2s² 2p⁴).',
    reference: 'NCERT Class 11, Chapter 3 (Periodicity)'
  },
  {
    id: 'fc-chem-02',
    subject: 'Chemistry',
    category: 'Inorganic Chemistry',
    front: 'Why does Chlorine have a higher negative electron gain enthalpy than Fluorine?',
    back: 'Fluorine’s 2p orbital is extremely compact; adding an incoming electron causes strong inter-electronic repulsions in the small 2p cloud compared to Chlorine’s larger 3p subshell.',
    reference: 'NCERT Class 11, Chapter 3 (Periodicity)'
  },
  {
    id: 'fc-chem-03',
    subject: 'Chemistry',
    category: 'Organic Chemistry',
    front: 'What is the active electrophile intermediate in the Reimer-Tiemann reaction of Phenol with CHCl₃ + aq. NaOH?',
    back: 'Dichlorocarbene (:CCl₂), a neutral singlet carbene intermediate with 6 valence electrons (an electron-deficient species).',
    reference: 'NCERT Class 12, Chapter 11 (Alcohols, Phenols and Ethers)'
  },
  {
    id: 'fc-chem-04',
    subject: 'Chemistry',
    category: 'Organic Chemistry',
    front: 'Why can Gabriel Phthalimide Synthesis NOT be used to prepare aromatic primary amines (Aniline)?',
    back: 'Aryl halides do not undergo nucleophilic substitution with the potassium phthalimide anion due to partial double bond character of the C-X bond and aryl steric hindrance.',
    reference: 'NCERT Class 12, Chapter 13 (Amines)'
  },
  {
    id: 'fc-chem-05',
    subject: 'Chemistry',
    category: 'Physical Chemistry',
    front: 'What is the relationship between the van’t Hoff factor (i) and the degree of dissociation (α) for a solute giving n ions?',
    back: 'i = 1 + (n - 1)α  ⟹  α = (i - 1) / (n - 1)',
    reference: 'NCERT Class 12, Chapter 2 (Solutions)'
  },
  {
    id: 'fc-chem-06',
    subject: 'Chemistry',
    category: 'Coordination Chemistry',
    front: 'What is the formula for the "spin-only" magnetic moment of a transition metal ion?',
    back: 'μ = √(n(n + 2)) BM (Bohr Magnetons), where n is the number of unpaired electrons.',
    reference: 'NCERT Class 12, Chapter 9 (Coordination Compounds)'
  },

  // --- PHYSICS ACTIVE RECALL ---
  {
    id: 'fc-phy-01',
    subject: 'Physics',
    category: 'Mechanics',
    front: 'What is the ratio of maximum height (H) to horizontal range (R) in ground-to-ground projectile motion?',
    back: 'H / R = (tan θ) / 4  ⟹  R = 4H cot θ',
    reference: 'NCERT Class 11, Chapter 4 (Motion in a Plane)'
  },
  {
    id: 'fc-phy-02',
    subject: 'Physics',
    category: 'Modern Physics',
    front: 'What is the de Broglie wavelength formula for an electron accelerated through potential V volts?',
    back: 'λ = h / √(2m e V) = 12.27 / √V Å (or 1.227 / √V nm).',
    reference: 'NCERT Class 12, Chapter 11 (Dual Nature of Radiation)'
  },
  {
    id: 'fc-phy-03',
    subject: 'Physics',
    category: 'Optics',
    front: 'What is the lens maker’s formula for a thin lens of refractive index μ in air?',
    back: '1/f = (μ - 1) [ (1/R₁) - (1/R₂) ]',
    reference: 'NCERT Class 12, Chapter 9 (Ray Optics)'
  },
  {
    id: 'fc-phy-04',
    subject: 'Physics',
    category: 'Electrodynamics',
    front: 'What is the resonance frequency (ω₀ and f₀) and impedance (Z) in a series LCR AC circuit?',
    back: '• ω₀ = 1 / √(LC)\n• f₀ = 1 / (2π√(LC))\n• At resonance, X_L = X_C, so impedance is minimum: Z = R, and current is maximum.',
    reference: 'NCERT Class 12, Chapter 7 (Alternating Current)'
  }
];

function getFlashcardsBySubject(subject) {
  if (!subject || subject === 'All') return NEET_FLASHCARDS;
  return NEET_FLASHCARDS.filter(fc => fc.subject === subject);
}
