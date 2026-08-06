/**
 * NEET UG 2028: NCERT Hidden Lab & Scientist Bio Hub
 * Unit-by-Unit Biographies, Historical Milestones, Diagram Labeling Traps & High-Yield Questions
 */
const NCERT_SCIENTISTS = [
  {
    id: 'sci-01',
    name: 'Ernst Mayr (1904 – 2005)',
    title: 'The Darwin of the 20th Century',
    ncertUnit: 'Class 11, Unit 1: Diversity in the Living World',
    highlights: [
      'Born in Kempten, Germany. Joined Harvard University faculty in 1953.',
      'Almost single-handedly made the origin of species diversity the central question of evolutionary biology.',
      'Pioneered the currently accepted Biological Concept of Species (reproductive isolation among interbreeding natural populations).',
      'Awarded the Triple Crown of Biology: Balzan Prize (1983), International Prize for Biology (1994), and Crafoord Prize (1999).',
      'Died at the age of 100 in 2004.'
    ],
    trapQuestions: [
      {
        q: 'Who defined the biological concept of species based on reproductive isolation?',
        ans: 'Ernst Mayr (Harvard evolutionary biologist)'
      },
      {
        q: 'Which prizes make up the "Triple Crown of Biology" won by Ernst Mayr?',
        ans: 'Balzan Prize (1983), International Prize for Biology (1994), Crafoord Prize (1999)'
      }
    ]
  },
  {
    id: 'sci-02',
    name: 'Katherine Esau (1898 – 1997)',
    title: 'Grand Old Lady of Plant Anatomy',
    ncertUnit: 'Class 11, Unit 2: Structural Organisation in Plants and Animals',
    highlights: [
      'Born in Ukraine in 1898. Received doctorate in 1931 in the United States.',
      'Published the landmark book "Plant Anatomy" (1954), referred to as the Bible of plant biology by Webster.',
      'Published "Anatomy of Seed Plants" (1960), which was described as a \'web of life\'.',
      'Her early work focused on curly top virus spreading through phloem tissue.',
      'Elected to the National Academy of Sciences in 1957. Awarded National Medal of Science by President George Bush in 1989.'
    ],
    trapQuestions: [
      {
        q: 'Which famous plant anatomist authored the classic text "Anatomy of Seed Plants" (1960)?',
        ans: 'Katherine Esau'
      },
      {
        q: 'What plant disease mechanism did Katherine Esau specialize in early research?',
        ans: 'Curly top virus spread through phloem tissue'
      }
    ]
  },
  {
    id: 'sci-03',
    name: 'G. N. Ramachandran (1922 – 2001)',
    title: 'Founder of the Madras School of Conformational Analysis',
    ncertUnit: 'Class 11, Unit 3: Cell: Structure and Functions',
    highlights: [
      'Born in Cochin, India. Studied under Sir C. V. Raman at IISc Bangalore.',
      'Discovered the triple helical structure of Collagen in 1954.',
      'Developed the famous "Ramachandran Plot" using phi (Φ) and psi (Ψ) dihedral rotation angles to understand allowed peptide chain conformations.',
      'Linus Pauling and G. N. Ramachandran are pillars in structural protein biochemistry.'
    ],
    trapQuestions: [
      {
        q: 'Who proposed the triple-helical structure of collagen and designed the Ramachandran Plot for polypeptide backbone angles?',
        ans: 'G. N. Ramachandran'
      },
      {
        q: 'What two dihedral angles are plotted on the axes of a Ramachandran Plot?',
        ans: 'Phi (Φ, C_alpha - N bond) and Psi (Ψ, C_alpha - C bond)'
      }
    ]
  },
  {
    id: 'sci-04',
    name: 'Melvin Calvin (1911 – 1997)',
    title: 'Pioneer of Carbon Fixation & Photosynthesis C3 Cycle',
    ncertUnit: 'Class 11, Unit 4: Plant Physiology',
    highlights: [
      'Born in Minnesota. Worked at UC Berkeley.',
      'Used radioactive Carbon-14 (14C) isotope in algal photosynthesis (Chlorella) research.',
      'Discovered that the first stable CO2 fixation product was a 3-carbon organic acid: 3-Phosphoglyceric acid (3-PGA).',
      'Elucidated the entire cyclic pathway of carbon fixation (Calvin-Benson-Bassham Cycle).',
      'Awarded the Nobel Prize in Chemistry in 1961.'
    ],
    trapQuestions: [
      {
        q: 'Which radioactive isotope and organism did Melvin Calvin use to discover the C3 cycle?',
        ans: 'Radioactive Carbon-14 (14C) in green alga Chlorella'
      },
      {
        q: 'What is the very first stable intermediate identified by Calvin in the dark reaction?',
        ans: '3-Phosphoglyceric acid (3-PGA), a 3-carbon compound'
      }
    ]
  },
  {
    id: 'sci-05',
    name: 'James Watson & Francis Crick',
    title: 'Architects of the DNA Double Helix (1953)',
    ncertUnit: 'Class 12, Unit 7: Genetics and Evolution',
    highlights: [
      'Proposed the Double Helix model for the structure of DNA in 1953 based on X-ray diffraction data produced by Rosalind Franklin and Maurice Wilkins.',
      'Formulated base pairing rule (Purine always pairs with Pyrimidine: A=T with 2 H-bonds, G≡C with 3 H-bonds) in accordance with Erwin Chargaff’s equivalence ratios (A+G = T+C).',
      'Postulated the Central Dogma of Molecular Biology (DNA -> RNA -> Protein).',
      'Awarded the Nobel Prize in Physiology or Medicine in 1962 along with Maurice Wilkins.'
    ],
    trapQuestions: [
      {
        q: 'Whose X-ray diffraction data was critically used by Watson and Crick to deduce the double helix?',
        ans: 'Maurice Wilkins and Rosalind Franklin'
      },
      {
        q: 'What is the pitch and distance between base pairs in B-DNA according to Watson & Crick?',
        ans: 'Pitch = 3.4 nm (34 Å), distance between adjacent bp = 0.34 nm (3.4 Å, 10 bp per turn)'
      }
    ]
  },
  {
    id: 'sci-06',
    name: 'François Jacob & Jacques Monod',
    title: 'Dispensers of Genetic Regulation & The Lac Operon',
    ncertUnit: 'Class 12, Unit 7: Molecular Basis of Inheritance',
    highlights: [
      'French geneticist François Jacob and biochemist Jacques Monod were the first to elucidate a transcriptionally regulated system in bacteria in 1961.',
      'Proposed the Lac Operon model in Escherichia coli.',
      'Identified the regulatory gene (i gene encoding repressor protein), operator, promoter, and structural genes (lac Z: beta-galactosidase, lac Y: permease, lac A: transacetylase).',
      'Awarded the Nobel Prize in Physiology or Medicine in 1965.'
    ],
    trapQuestions: [
      {
        q: 'What are the products of structural genes z, y, and a in the Lac Operon?',
        ans: 'z = Beta-galactosidase; y = Permease; a = Transacetylase'
      },
      {
        q: 'What acts as the real inducer for repressor inactivation in the Lac Operon?',
        ans: 'Allolactose (isomer of lactose formed by beta-galactosidase)'
      }
    ]
  },
  {
    id: 'sci-07',
    name: 'Herbert Boyer & Stanley Cohen',
    title: 'Founders of Modern Recombinant DNA Technology (1972)',
    ncertUnit: 'Class 12, Unit 9: Biotechnology',
    highlights: [
      'Herbert Boyer discovered restriction endonucleases cutting DNA at specific sticky sites in 1969.',
      'Stanley Cohen developed methods of isolating intact plasmid DNA and introducing them into bacterial cells.',
      'In 1972, Boyer and Cohen combined their discoveries: they isolated an antibiotic resistance gene from a plasmid and linked it with a plasmid vector of Salmonella typhimurium using DNA ligase, creating the first recombinant DNA molecule.'
    ],
    trapQuestions: [
      {
        q: 'Which bacterium was used by Cohen and Boyer in 1972 to construct the first recombinant DNA?',
        ans: 'Salmonella typhimurium'
      },
      {
        q: 'Which enzyme was used to covalently join the antibiotic resistance gene to the plasmid vector?',
        ans: 'DNA ligase'
      }
    ]
  },
  {
    id: 'sci-08',
    name: 'Kary Mullis (1944 – 2019)',
    title: 'Inventor of Polymerase Chain Reaction (PCR)',
    ncertUnit: 'Class 12, Unit 9: Biotechnology: Principles and Processes',
    highlights: [
      'Invented PCR in 1983 at Cetus Corporation.',
      'Devised the 3-step thermal cycle: Denaturation (94°C), Primer Annealing (54°C), and Extension (72°C) using heat-stable Taq DNA Polymerase isolated from thermophilic bacterium Thermus aquaticus.',
      'PCR allows 1 billion-fold amplification of a single DNA fragment in ~30 cycles.',
      'Awarded the Nobel Prize in Chemistry in 1993.'
    ],
    trapQuestions: [
      {
        q: 'From which thermophilic bacterium was Taq DNA Polymerase isolated?',
        ans: 'Thermus aquaticus (active up to 95°C)'
      },
      {
        q: 'What are the 3 sequential steps and approximate temperatures in a PCR thermal cycle?',
        ans: '1. Denaturation (~94°C), 2. Annealing (~50-60°C), 3. Extension (~72°C)'
      }
    ]
  }
];

const NCERT_DIAGRAM_TRAPS = [
  {
    id: 'diag-01',
    title: 'pBR322 Cloning Vector Restriction Sites & Markers',
    ncertRef: 'NCERT Class 12, Chapter 11, Figure 11.4',
    subject: 'Zoology',
    criticalLabels: [
      { label: 'EcoRI, ClaI, HindIII', location: 'Near promoter before ampR' },
      { label: 'PstI, PvuI', location: 'Inside Ampicillin resistance gene (ampR)' },
      { label: 'BamHI, SalI', location: 'Inside Tetracycline resistance gene (tetR)' },
      { label: 'PvuII', location: 'Inside ROP gene (Repressor of Primer controlling plasmid copy number)' },
      { label: 'ori', location: 'Origin of replication' }
    ],
    topperTip: 'Mnemonic for pBR322: "Amar Pst Pvu" (ampR contains PstI & PvuI) and "Tera Bam Sal" (tetR contains BamHI & SalI). ROP contains PvuII.'
  },
  {
    id: 'diag-02',
    title: 'Human Heart Electrocardiogram (ECG) Waves',
    ncertRef: 'NCERT Class 11, Chapter 18, Figure 18.3',
    subject: 'Zoology',
    criticalLabels: [
      { label: 'P-wave', location: 'Atrial depolarisation (both atria contract)' },
      { label: 'QRS complex', location: 'Ventricular depolarisation (ventricles contract immediately after Q)' },
      { label: 'T-wave', location: 'Ventricular repolarisation (ventricles return to relaxed state)' },
      { label: 'End of T-wave', location: 'Marks the end of ventricular systole' }
    ],
    topperTip: 'By counting the number of QRS complexes in a given time period, one can determine the heart beat rate of an individual.'
  },
  {
    id: 'diag-03',
    title: 'Anatropous Ovule (Megasporangium) Parts',
    ncertRef: 'NCERT Class 12, Chapter 2, Figure 2.7',
    subject: 'Botany',
    criticalLabels: [
      { label: 'Funicle & Hilum', location: 'Stalk and point of junction with ovule body' },
      { label: 'Micropyle & Micropylar pole', location: 'Small opening for pollen tube entry' },
      { label: 'Chalaza & Chalazal pole', location: 'Basal part of the ovule opposite micropyle' },
      { label: 'Nucellus', location: 'Central nutritive tissue with abundant food reserve' },
      { label: 'Embryo sac', location: 'Female gametophyte (7-celled, 8-nucleate)' }
    ],
    topperTip: 'The micropylar end has the Egg apparatus (1 egg + 2 synergids with filiform apparatus); the chalazal end has 3 Antipodal cells.'
  },
  {
    id: 'diag-04',
    title: 'Sarcomere Ultrastructure (A-Band, I-Band, H-Zone, Z-Line)',
    ncertRef: 'NCERT Class 11, Chapter 20, Figure 20.2',
    subject: 'Zoology',
    criticalLabels: [
      { label: 'Z-line', location: 'Elastic membrane bisecting each I-band; defines sarcomere boundary' },
      { label: 'I-band (Isotropic)', location: 'Light band containing only actin thin filaments' },
      { label: 'A-band (Anisotropic)', location: 'Dark band containing thick myosin filaments + overlapping actin' },
      { label: 'H-zone', location: 'Central region of A-band not overlapped by thin filaments' },
      { label: 'M-line', location: 'Thin fibrous membrane holding thick filaments together in H-zone' }
    ],
    topperTip: 'During contraction: I-band shortens, H-zone reduces/disappears, A-band length stays completely unchanged!'
  }
];
