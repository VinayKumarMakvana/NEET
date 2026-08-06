/**
 * NEET UG 2028: Complete NMC / NTA Zero-Gap Syllabus Master
 * 96 Granular Chapters across Physics, Chemistry, Botany & Zoology
 * Tailored to Allen / Aakash / PW High-Yield Topper Standards
 */
const NEET_SYLLABUS = [
  // ==========================================
  // PHYSICS — CLASS 11 (14 CHAPTERS)
  // ==========================================
  {
    id: 'phy-11',
    subject: 'Physics',
    subjectCode: 'phy',
    standard: 'Class 11',
    phase: 'Physics - Class 11 Foundation & Mechanics',
    chapters: [
      {
        id: 'phy-11-01',
        title: 'Units and Measurements & Error Analysis',
        subtopics: 'SI units, dimensional analysis & applications, significant figures, vernier calipers, screw gauge, rounding off, propagation of errors',
        hours: 18,
        weightage: '4%',
        ncertClass: '11th Vol 1',
        keyConcepts: ['Dimensional Homogeneity', 'Least Count & Errors', 'Vernier & Screw Gauge', 'Significant Figures']
      },
      {
        id: 'phy-11-02',
        title: 'Motion in a Straight Line (1D Kinematics)',
        subtopics: 'Position-time & velocity-time graphs, equations of uniformly accelerated motion, relative velocity, motion under gravity, stopping distance & reaction time',
        hours: 24,
        weightage: '4%',
        ncertClass: '11th Vol 1',
        keyConcepts: ['Kinematic Equations (v=u+at, s=ut+1/2at²)', 'v-t & s-t Graphs', 'Free Fall & Relative Velocity']
      },
      {
        id: 'phy-11-03',
        title: 'Motion in a Plane (2D Vectors & Projectiles)',
        subtopics: 'Scalars & vectors, vector algebra, dot & cross products, projectile motion (ground-to-ground, inclined), uniform circular motion, centripetal acceleration',
        hours: 28,
        weightage: '5%',
        ncertClass: '11th Vol 1',
        keyConcepts: ['Projectile Trajectory & Range', 'Uniform Circular Motion', 'Vector Resolution & Dot/Cross Product']
      },
      {
        id: 'phy-11-04',
        title: 'Laws of Motion & Friction',
        subtopics: 'Newton’s three laws, inertia, momentum, impulse-momentum theorem, equilibrium of concurrent forces, static & kinetic friction, banking of roads, connected motion / pulley systems',
        hours: 32,
        weightage: '6%',
        ncertClass: '11th Vol 1',
        keyConcepts: ['Free Body Diagrams (FBD)', 'Pulley-Mass Systems', 'Static/Kinetic Friction & Angle of Repose', 'Banking of Roads']
      },
      {
        id: 'phy-11-05',
        title: 'Work, Energy and Power & Collisions',
        subtopics: 'Work done by constant & variable force, kinetic energy, work-energy theorem, potential energy of spring, conservative forces, conservation of mechanical energy, power, elastic & inelastic collisions in 1D & 2D',
        hours: 30,
        weightage: '6%',
        ncertClass: '11th Vol 1',
        keyConcepts: ['Work-Energy Theorem (W_all = ΔK)', 'Conservative Forces (F = -dU/dx)', 'Spring Potential Energy', 'Elastic & Inelastic Collisions (e)']
      },
      {
        id: 'phy-11-06',
        title: 'System of Particles & Rotational Motion',
        subtopics: 'Centre of mass of 2-particle & rigid bodies, torque, angular momentum & conservation, moment of inertia (parallel & perpendicular axis theorems), radius of gyration, rotational kinematics & rolling motion',
        hours: 36,
        weightage: '7%',
        ncertClass: '11th Vol 1',
        keyConcepts: ['Centre of Mass Calculation', 'Torque (τ = Iα)', 'Moment of Inertia Theorems', 'Rolling Without Slipping (K_total = K_trans + K_rot)']
      },
      {
        id: 'phy-11-07',
        title: 'Gravitation & Planetary Motion',
        subtopics: 'Kepler’s laws of planetary motion, universal law of gravitation, variation of acceleration due to gravity (height, depth, latitude), gravitational potential energy & potential, escape velocity, orbital velocity of satellites, geostationary satellites',
        hours: 22,
        weightage: '4%',
        ncertClass: '11th Vol 1',
        keyConcepts: ['g Variation (Height & Depth)', 'Gravitational Potential Energy & Escape Velocity', 'Orbital Velocity & Kepler’s 3rd Law']
      },
      {
        id: 'phy-11-08',
        title: 'Mechanical Properties of Solids (Elasticity)',
        subtopics: 'Stress-strain relationship, Hooke’s law, Young’s modulus, Bulk modulus, Shear modulus of rigidity, Poisson’s ratio, elastic potential energy in stretched wire',
        hours: 16,
        weightage: '3%',
        ncertClass: '11th Vol 2',
        keyConcepts: ['Stress vs Strain Curve', 'Young’s / Bulk / Rigidity Modulus', 'Elastic Potential Energy']
      },
      {
        id: 'phy-11-09',
        title: 'Mechanical Properties of Fluids (Hydrostatics & Hydrodynamics)',
        subtopics: 'Pressure in fluid, Pascal’s law & hydraulic lift, buoyancy & Archimedes principle, viscosity, Stokes’ law & terminal velocity, streamline flow, Reynolds number, Bernoulli’s principle & applications, surface tension, surface energy, angle of contact, capillarity',
        hours: 28,
        weightage: '5%',
        ncertClass: '11th Vol 2',
        keyConcepts: ['Bernoulli’s Theorem (P + 1/2ρv² + ρgh = const)', 'Stokes Law & Terminal Velocity', 'Surface Tension & Capillary Rise']
      },
      {
        id: 'phy-11-10',
        title: 'Thermal Properties of Matter & Heat Transfer',
        subtopics: 'Heat, temperature, thermal expansion (alpha, beta, gamma), specific heat capacity, calorimetry & latent heat, heat transfer (conduction, convection, radiation), Newton’s law of cooling, Stefan-Boltzmann law, Wien’s displacement law',
        hours: 20,
        weightage: '4%',
        ncertClass: '11th Vol 2',
        keyConcepts: ['Calorimetry & Phase Change', 'Thermal Conduction & Resistance', 'Stefan-Boltzmann & Wien’s Law']
      },
      {
        id: 'phy-11-11',
        title: 'Thermodynamics & Heat Engines',
        subtopics: 'Thermal equilibrium, zeroth law of thermodynamics, first law of thermodynamics (work, internal energy, heat), isothermal, adiabatic, isobaric, isochoric processes, indicator diagrams (P-V diagrams), second law of thermodynamics, Carnot engine efficiency, refrigerators',
        hours: 26,
        weightage: '5%',
        ncertClass: '11th Vol 2',
        keyConcepts: ['First Law of Thermodynamics (dQ = dU + dW)', 'Adiabatic Process (PV^γ = const)', 'Carnot Efficiency (η = 1 - T2/T1)']
      },
      {
        id: 'phy-11-12',
        title: 'Kinetic Theory of Gases (KTG)',
        subtopics: 'Equation of state of perfect gas, kinetic interpretation of temperature, rms, average & most probable speeds, degrees of freedom, law of equipartition of energy, specific heats of gases (Cp, Cv), mean free path',
        hours: 16,
        weightage: '3%',
        ncertClass: '11th Vol 2',
        keyConcepts: ['P = 1/3 ρ v_rms²', 'Degrees of Freedom & Equipartition', 'Cp and Cv Relations (Mayer’s Relation)']
      },
      {
        id: 'phy-11-13',
        title: 'Oscillations (Simple Harmonic Motion)',
        subtopics: 'Periodic & oscillatory motion, SHM equations, displacement, velocity, acceleration, energy in SHM (kinetic & potential), simple pendulum, spring-mass system (series & parallel combinations)',
        hours: 24,
        weightage: '4%',
        ncertClass: '11th Vol 2',
        keyConcepts: ['SHM Differential Equation', 'Simple Pendulum Time Period', 'Spring System Time Period (T = 2π√(m/k))']
      },
      {
        id: 'phy-11-14',
        title: 'Waves & Acoustics',
        subtopics: 'Wave motion, longitudinal & transverse waves, speed of wave, principle of superposition of waves, standing waves in strings and organ pipes (open & closed), beats',
        hours: 22,
        weightage: '4%',
        ncertClass: '11th Vol 2',
        keyConcepts: ['Wave Equation (y = A sin(kx - ωt))', 'Organ Pipe Harmonics (Open & Closed)', 'Beat Frequency (f_b = |f1 - f2|)']
      }
    ]
  },

  // ==========================================
  // PHYSICS — CLASS 12 (15 CHAPTERS)
  // ==========================================
  {
    id: 'phy-12',
    subject: 'Physics',
    subjectCode: 'phy',
    standard: 'Class 12',
    phase: 'Physics - Class 12 Electrodynamics & Modern Physics',
    chapters: [
      {
        id: 'phy-12-01',
        title: 'Electric Charges and Fields (Electrostatics I)',
        subtopics: 'Electric charge & conservation, Coulomb’s law (vector form), superposition principle, continuous charge distribution, electric field, electric field lines, electric dipole, dipole in uniform field, electric flux, Gauss’s theorem & applications (infinite wire, infinite sheet, spherical shell)',
        hours: 30,
        weightage: '6%',
        ncertClass: '12th Vol 1',
        keyConcepts: ['Coulomb’s Law & Superposition', 'Gauss’s Law Applications (Wire, Sheet, Shell)', 'Electric Dipole Torque & Field (Axial & Equat)']
      },
      {
        id: 'phy-12-02',
        title: 'Electrostatic Potential and Capacitance (Electrostatics II)',
        subtopics: 'Electric potential & potential difference, potential due to point charge & dipole, equipotential surfaces, electrical potential energy, conductors in electrostatic field, dielectrics & polarization, capacitors & capacitance (parallel plate with dielectric), combination of capacitors (series & parallel), energy stored in capacitor',
        hours: 32,
        weightage: '6%',
        ncertClass: '12th Vol 1',
        keyConcepts: ['Equipotential Surfaces & E = -dV/dr', 'Parallel Plate Capacitor with Dielectric Slab', 'Capacitor Energy & Energy Density (1/2 ε0 E²)']
      },
      {
        id: 'phy-12-03',
        title: 'Current Electricity & Circuit Laws',
        subtopics: 'Electric current, drift velocity, mobility & Ohm’s law, electrical resistance, V-I characteristics, electrical resistivity & conductivity, temperature dependence of resistance, internal resistance of cell, potential difference & EMF of cell, combination of cells, Kirchhoff’s laws & applications, Wheatstone bridge, Meter Bridge, Potentiometer principle & applications',
        hours: 38,
        weightage: '8%',
        ncertClass: '12th Vol 1',
        keyConcepts: ['Drift Velocity & Current (I = n e A v_d)', 'Kirchhoff’s Laws (Junction & Loop Rules)', 'Potentiometer (EMF Comparison & Internal Resistance)']
      },
      {
        id: 'phy-12-04',
        title: 'Moving Charges and Magnetism',
        subtopics: 'Biot-Savart law & application to circular loop, Ampere’s circuital law & application to straight wire and solenoid, force on moving charge in magnetic field (Lorentz force), cyclotron motion, magnetic force on current-carrying conductor, force between parallel conductors, torque on current loop, magnetic dipole moment, moving coil galvanometer & conversion to ammeter/voltmeter',
        hours: 34,
        weightage: '7%',
        ncertClass: '12th Vol 1',
        keyConcepts: ['Biot-Savart Law on Axial Loop', 'Ampere’s Law & Solenoid Field', 'Force Between Parallel Currents (F/L = μ0 I1 I2 / 2πd)', 'Galvanometer Conversion (Shunt & Multiplier)']
      },
      {
        id: 'phy-12-05',
        title: 'Magnetism and Matter',
        subtopics: 'Bar magnet as equivalent solenoid, magnetic field lines, Earth’s magnetic field (declination, dip, horizontal component), magnetic properties of materials: dia-, para- and ferromagnetic substances, Curie temperature & hysteresis curve',
        hours: 18,
        weightage: '3%',
        ncertClass: '12th Vol 1',
        keyConcepts: ['Earth’s Magnetic Elements (B_H = B cosθ)', 'Dia-, Para-, Ferromagnetic Material Characteristics', 'Magnetic Susceptibility & Curie’s Law']
      },
      {
        id: 'phy-12-06',
        title: 'Electromagnetic Induction (EMI)',
        subtopics: 'Magnetic flux, Faraday’s laws of induction, Lenz’s law & conservation of energy, motional EMF, eddy currents, self-inductance and mutual inductance, inductors in series & parallel, AC generator principle',
        hours: 26,
        weightage: '5%',
        ncertClass: '12th Vol 1',
        keyConcepts: ['Faraday’s Law & Lenz’s Law Direction', 'Motional EMF (e = BvL)', 'Self & Mutual Inductance (L and M Formulas)']
      },
      {
        id: 'phy-12-07',
        title: 'Alternating Current (AC Circuits)',
        subtopics: 'Peak, rms and average values of AC, AC through R, L, C, series LCR circuit, phasor diagrams, reactance & impedance, resonance in LCR circuit & Q-factor, power in AC circuits, wattless current, LC oscillations, transformers (step-up & step-down)',
        hours: 30,
        weightage: '6%',
        ncertClass: '12th Vol 1',
        keyConcepts: ['RMS & Peak Value (I_rms = I0 / √2)', 'LCR Series Resonance & Impedance Z = √(R² + (XL-XC)²)', 'AC Power Factor (cos φ = R/Z) & Transformer Equation']
      },
      {
        id: 'phy-12-08',
        title: 'Electromagnetic Waves',
        subtopics: 'Displacement current, Maxwell’s equations overview, characteristics of EM waves, transverse nature of EM waves, electromagnetic spectrum (Radio, Microwave, IR, Visible, UV, X-ray, Gamma rays - frequencies, wavelengths & applications)',
        hours: 14,
        weightage: '3%',
        ncertClass: '12th Vol 1',
        keyConcepts: ['Displacement Current (Id = ε0 dΦE/dt)', 'EM Wave Speed (c = 1/√(μ0 ε0) = E0/B0)', 'EM Spectrum Order & Uses']
      },
      {
        id: 'phy-12-09',
        title: 'Ray Optics and Optical Instruments',
        subtopics: 'Reflection by spherical mirrors, mirror formula, refraction at plane and spherical surfaces, total internal reflection (TIR) & optical fibres, lenses, thin lens formula, lens maker’s formula, magnification, power of lens, combination of lenses, refraction through prism (minimum deviation), dispersion, optical instruments: magnifying glass, compound microscope, astronomical telescope',
        hours: 38,
        weightage: '8%',
        ncertClass: '12th Vol 2',
        keyConcepts: ['Total Internal Reflection & Critical Angle (sin C = 1/μ)', 'Lens Maker’s Formula (1/f = (μ-1)(1/R1 - 1/R2))', 'Prism Formula (μ = sin((A+δm)/2) / sin(A/2))', 'Microscope & Telescope Magnifying Power']
      },
      {
        id: 'phy-12-10',
        title: 'Wave Optics & Interference/Diffraction',
        subtopics: 'Wavefront and Huygens’ principle, reflection and refraction using Huygens principle, proof of Snell’s law, coherent sources, interference of light, Young’s double slit experiment (YDSE - derivation of fringe width, intensity distribution), diffraction at single slit, resolving power & polarization basics',
        hours: 28,
        weightage: '6%',
        ncertClass: '12th Vol 2',
        keyConcepts: ['Huygens’ Principle & Secondary Wavelets', 'YDSE Fringe Width (β = λD/d)', 'Single Slit Diffraction Central Maxima Width (2λD/a)']
      },
      {
        id: 'phy-12-11',
        title: 'Dual Nature of Radiation and Matter (Photoelectric Effect)',
        subtopics: 'Photoelectric effect, Hertz and Lenard observations, Einstein’s photoelectric equation, work function, threshold frequency, stopping potential, matter waves, de Broglie relation, Davisson-Germer experiment',
        hours: 22,
        weightage: '5%',
        ncertClass: '12th Vol 2',
        keyConcepts: ['Einstein Photoelectric Equation (hν = Φ0 + K_max)', 'Stopping Potential vs Frequency Graphs', 'de Broglie Wavelength (λ = h/p = 12.27/√V Å)']
      },
      {
        id: 'phy-12-12',
        title: 'Atoms & Bohr Model',
        subtopics: 'Alpha-particle scattering experiment, Rutherford’s nuclear model, Bohr model of hydrogen atom (postulates, radius, velocity, energy of electron in orbits), energy levels, hydrogen emission spectrum (Lyman, Balmer, Paschen, Brackett, Pfund series), de Broglie’s explanation of Bohr’s second postulate',
        hours: 20,
        weightage: '4%',
        ncertClass: '12th Vol 2',
        keyConcepts: ['Bohr Orbital Radius (r_n ∝ n²/Z) & Energy (E_n = -13.6 Z²/n² eV)', 'Rydberg Formula for Spectral Lines', 'Bohr Angular Momentum Quantization (mvr = nh/2π)']
      },
      {
        id: 'phy-12-13',
        title: 'Nuclei & Nuclear Energy',
        subtopics: 'Composition and size of nucleus, atomic masses, isotopes, isobars, isotones, mass-energy relation, mass defect, binding energy per nucleon and its variation with mass number, nuclear forces, nuclear fission and fusion',
        hours: 18,
        weightage: '4%',
        ncertClass: '12th Vol 2',
        keyConcepts: ['Nuclear Radius (R = R0 A^(1/3))', 'Mass Defect & Binding Energy (ΔE = Δm c²)', 'Binding Energy Curve & Nuclear Stability']
      },
      {
        id: 'phy-12-14',
        title: 'Semiconductor Electronics: Materials, Devices & Simple Circuits',
        subtopics: 'Energy bands in solids (conductors, semiconductors, insulators), intrinsic and extrinsic semiconductors (p-type, n-type), p-n junction diode: formation, forward and reverse bias characteristics, diode as rectifier (half wave & full wave), Zener diode and voltage regulation, optoelectronic devices: LED, Photodiode, Solar cell, Logic gates (AND, OR, NOT, NAND, NOR truth tables)',
        hours: 32,
        weightage: '7%',
        ncertClass: '12th Vol 2',
        keyConcepts: ['p-n Junction Forward & Reverse Bias V-I Curve', 'Half Wave vs Full Wave Rectifier Efficiency & Ripple Factor', 'Zener Diode Voltage Regulator Mechanism', 'Universal Logic Gates (NAND & NOR)']
      },
      {
        id: 'phy-12-15',
        title: 'Experimental Physics & Practical Skills',
        subtopics: 'Vernier calipers, screw gauge, simple pendulum, meter scale, Young’s modulus by Searle’s method, surface tension by capillary rise, coefficient of viscosity by Poiseuille’s method, speed of sound by resonance tube, specific heat by calorimeter, meter bridge, potentiometer, post office box, multimeter, focal length of mirrors and lenses, I-V characteristics of p-n junction diode',
        hours: 20,
        weightage: '4%',
        ncertClass: '11th & 12th Lab Manual',
        keyConcepts: ['Least Count & Zero Error Calculations', 'Meter Bridge Resistance Measurement', 'Resonance Tube End Correction', 'Focal Length by u-v Method']
      }
    ]
  },

  // ==========================================
  // CHEMISTRY — CLASS 11 (11 CHAPTERS)
  // ==========================================
  {
    id: 'chem-11',
    subject: 'Chemistry',
    subjectCode: 'chem',
    standard: 'Class 11',
    phase: 'Chemistry - Class 11 Foundations, Physical & Inorganic',
    chapters: [
      {
        id: 'chem-11-01',
        title: 'Some Basic Concepts of Chemistry (Mole Concept)',
        subtopics: 'Matter & its nature, laws of chemical combination, Dalton’s atomic theory, atomic and molecular masses, mole concept, molar mass, percentage composition, empirical and molecular formula, stoichiometry and stoichiometric calculations, limiting reagent, concentration terms (molarity, molality, mole fraction, ppm, normality)',
        hours: 26,
        weightage: '5%',
        ncertClass: '11th Vol 1',
        keyConcepts: ['Mole Concept & Avogadro Number Calculations', 'Limiting Reagent Stoichiometry', 'Empirical & Molecular Formula Determination', 'Molarity vs Molality Temperature Dependence']
      },
      {
        id: 'chem-11-02',
        title: 'Structure of Atom',
        subtopics: 'Discovery of subatomic particles, Thomson and Rutherford atomic models, Bohr’s model of atom (limitations), dual nature of matter (de Broglie), Heisenberg’s uncertainty principle, quantum mechanical model of atom, quantum numbers (n, l, m, s), shapes of s, p, d orbitals, Aufbau principle, Pauli’s exclusion principle, Hund’s rule of maximum multiplicity, electronic configuration of atoms',
        hours: 32,
        weightage: '6%',
        ncertClass: '11th Vol 1',
        keyConcepts: ['Bohr Model Energy & Radius Calculations', 'Heisenberg Uncertainty Principle (Δx · Δp ≥ h/4π)', 'Quantum Numbers & Radial/Angular Nodes', 'Aufbau, Pauli & Hund Electronic Rules']
      },
      {
        id: 'chem-11-03',
        title: 'Classification of Elements and Periodicity in Properties',
        subtopics: 'Modern periodic law and periodic table, periodic trends in properties of elements: atomic radii, ionic radii, inert gas radii, ionization enthalpy, electron gain enthalpy, electronegativity, valence, anomalous properties of second-period elements, diagonal relationship',
        hours: 24,
        weightage: '5%',
        ncertClass: '11th Vol 1',
        keyConcepts: ['Ionization Enthalpy Trends & Exceptions (Be>B, N>O)', 'Electron Gain Enthalpy Trends (Cl > F)', 'Electronegativity Scales (Pauling)', 'Isoelectronic Species Ionic Radii Order']
      },
      {
        id: 'chem-11-04',
        title: 'Chemical Bonding and Molecular Structure',
        subtopics: 'Ionic bond, lattice enthalpy, Born-Haber cycle, covalent bond, Lewis dot structures, formal charge, resonance, polar character of covalent bond, dipole moment & percentage ionic character, Fajan’s rules, VSEPR theory and shapes of simple molecules, Valence Bond Theory (orbital overlap, sigma and pi bonds), hybridization (sp, sp2, sp3, sp3d, sp3d2), Molecular Orbital Theory (LCAO, homonuclear diatomic molecules N2, O2, magnetic behaviour, bond order), hydrogen bonding (inter- and intra-molecular)',
        hours: 38,
        weightage: '9%',
        ncertClass: '11th Vol 1',
        keyConcepts: ['VSEPR Shapes & Lone Pair Repulsions', 'Hybridization Calculations', 'MOT Bond Order & Paramagnetic Nature of O2, B2', 'Fajan’s Rules for Covalent Character', 'Dipole Moments (NH3 vs NF3)']
      },
      {
        id: 'chem-11-05',
        title: 'Chemical Thermodynamics & Energetics',
        subtopics: 'Concepts of system and surroundings, types of systems, state functions, first law of thermodynamics: internal energy and enthalpy, heat capacity and specific heat, measurement of ΔU and ΔH (bomb calorimeter), Hess’s law of constant heat summation, enthalpy of bond dissociation, combustion, formation, atomization, sublimation, phase transition, ionization, solution and dilution; Second law of thermodynamics: spontaneity, entropy as a state function, Gibbs energy change for spontaneous and non-spontaneous processes, ΔG° and equilibrium constant',
        hours: 34,
        weightage: '7%',
        ncertClass: '11th Vol 1',
        keyConcepts: ['First Law (ΔU = q + w)', 'Hess’s Law Enthalpy of Reaction Calculations', 'Entropy (ΔS) and Gibbs Energy (ΔG = ΔH - TΔS)', 'Spontaneity Criteria (ΔG < 0)']
      },
      {
        id: 'chem-11-06',
        title: 'Equilibrium (Chemical & Ionic Equilibrium)',
        subtopics: 'Equilibrium in physical and chemical processes, dynamic nature of equilibrium, law of mass action, equilibrium constant (Kc, Kp), Le Chatelier’s principle (effect of concentration, temperature, pressure, inert gas addition); Ionic equilibrium: ionization of electrolytes, acid-base concepts (Arrhenius, Bronsted-Lowry, Lewis), ionization of water and pH scale, ionization constants of weak acids and bases, common ion effect, buffer solutions, solubility product (Ksp) and common ion effect applications in qualitative analysis, salt hydrolysis',
        hours: 38,
        weightage: '8%',
        ncertClass: '11th Vol 1',
        keyConcepts: ['Kp = Kc (RT)^Δn Calculations', 'Le Chatelier’s Principle Applications', 'pH Calculations of Acids, Bases & Salts', 'Buffer Solutions (Henderson-Hasselbalch Equation)', 'Solubility Product (Ksp) & Precipitation Conditions']
      },
      {
        id: 'chem-11-07',
        title: 'Redox Reactions & Oxidation States',
        subtopics: 'Concept of oxidation and reduction, redox reactions, oxidation number, balancing redox reactions: ion-electron method and oxidation number method, applications of redox reactions',
        hours: 18,
        weightage: '4%',
        ncertClass: '11th Vol 2',
        keyConcepts: ['Oxidation Number Calculation Rules & Exceptions (CrO5, H2SO5)', 'Balancing Redox in Acidic & Basic Media', 'Disproportionation Reactions']
      },
      {
        id: 'chem-11-08',
        title: 'Organic Chemistry: Some Basic Principles and Techniques (GOC)',
        subtopics: 'General introduction, IUPAC nomenclature of organic compounds (monofunctional & polyfunctional), electronic displacements in covalent bond: inductive effect, electromeric effect, resonance / mesomeric effect, hyperconjugation; Homolytic and heterolytic fission, reactive intermediates: carbocations, carbanions, free radicals, carbenes, electrophiles and nucleophiles; Types of organic reactions (substitution, addition, elimination, rearrangement); Purification methods; Qualitative and quantitative analysis of organic compounds (Dumas, Kjeldahl, Carius method)',
        hours: 42,
        weightage: '9%',
        ncertClass: '11th Vol 2',
        keyConcepts: ['IUPAC Naming Rules of Complex Compounds', 'Stability of Carbocations, Carbanions & Radicals', 'Aromaticity & Huckel’s (4n+2)π Rule', 'Kjeldahl & Dumas Method Formulas for % Nitrogen']
      },
      {
        id: 'chem-11-09',
        title: 'Hydrocarbons (Alkanes, Alkenes, Alkynes & Aromatic)',
        subtopics: 'Classification of hydrocarbons; Alkanes: nomenclature, isomerism, conformations of ethane (sawhorse, Newman projections), physical properties, chemical reactions: halogenation mechanism (free radical), combustion, pyrolysis; Alkenes: nomenclature, geometrical isomerism (cis-trans), methods of preparation, chemical reactions: addition of hydrogen, halogen, water, hydrogen halides (Markovnikov’s addition and peroxide effect / Kharasch effect), ozonolysis, oxidation (Baeyer’s reagent); Alkynes: nomenclature, structure, acidity of alkynes, addition reactions, cyclic polymerization; Aromatic hydrocarbons: benzene structure, resonance, aromaticity, electrophilic substitution reactions: nitration, sulphonation, halogenation, Friedel-Crafts alkylation & acylation, directive influence of functional groups in mono-substituted benzene',
        hours: 40,
        weightage: '9%',
        ncertClass: '11th Vol 2',
        keyConcepts: ['Conformations of Ethane Staggered vs Eclipsed', 'Markovnikov vs Anti-Markovnikov Addition Mechanism', 'Ozonolysis Products & Identification of Alkenes', 'Electrophilic Aromatic Substitution (EAS) Mechanism']
      },
      {
        id: 'chem-11-10',
        title: 'Environmental Chemistry',
        subtopics: 'Environmental pollution: air, water and soil pollution; Chemical reactions in atmosphere, photochemical smog, acid rain, ozone layer depletion, greenhouse effect and global warming, green chemistry as an alternative tool for reducing pollution',
        hours: 14,
        weightage: '3%',
        ncertClass: '11th Vol 2',
        keyConcepts: ['Classical vs Photochemical Smog Components', 'Acid Rain pH & Chemistry (SO2, NOx)', 'Ozone Depletion Catalyzed by CFCs & Cl Free Radicals']
      },
      {
        id: 'chem-11-11',
        title: 'Practical Chemistry & Basic Laboratory Operations',
        subtopics: 'Preparation of standard solutions, titration of oxalic acid against KMnO4, ferrous ammonium sulphate (Mohr salt) against KMnO4, qualitative analysis of group I and II cations, basic filtration, crystallization and boiling point determination',
        hours: 16,
        weightage: '3%',
        ncertClass: '11th Lab Manual',
        keyConcepts: ['Mohr’s Salt Redox Titration', 'Oxalic Acid Primary Standard', 'Laboratory Safety & Reagents']
      }
    ]
  },

  // ==========================================
  // CHEMISTRY — CLASS 12 (13 CHAPTERS)
  // ==========================================
  {
    id: 'chem-12',
    subject: 'Chemistry',
    subjectCode: 'chem',
    standard: 'Class 12',
    phase: 'Chemistry - Class 12 Solutions, Kinetics, Organic & Coordination',
    chapters: [
      {
        id: 'chem-12-01',
        title: 'Solutions & Colligative Properties',
        subtopics: 'Types of solutions, expression of concentration of solutions of solids in liquids, solubility of gases in liquids (Henry’s law), solid solutions, Raoult’s law, ideal and non-ideal solutions, positive and negative deviations, azeotropes, colligative properties: relative lowering of vapour pressure, elevation of boiling point, depression of freezing point, osmotic pressure (reverse osmosis), determination of molecular mass, abnormal molecular mass and van’t Hoff factor (i) for association and dissociation',
        hours: 32,
        weightage: '7%',
        ncertClass: '12th Vol 1',
        keyConcepts: ['Raoult’s Law & Positive/Negative Deviations from Ideality', 'Colligative Property Formulas (ΔTb = i Kb m, ΔTf = i Kf m)', 'Osmotic Pressure (π = i CRT)', 'van’t Hoff Factor Relation with Degree of Dissociation (i = 1 + (n-1)α)']
      },
      {
        id: 'chem-12-02',
        title: 'Electrochemistry',
        subtopics: 'Redox reactions, galvanic / electrochemical cells, EMF of cell, standard electrode potential, Nernst equation and its application to chemical cells, relation between Gibbs energy change and EMF of a cell, conductance in electrolytic solutions, specific and molar conductivity (variation with concentration), Kohlrausch’s law and its applications, electrolysis and laws of electrolysis (Faraday’s 1st and 2nd laws), dry cell, lead-acid storage battery, fuel cells, corrosion mechanism',
        hours: 36,
        weightage: '8%',
        ncertClass: '12th Vol 1',
        keyConcepts: ['Nernst Equation (E_cell = E°_cell - (0.0591/n) log Q)', 'ΔG° = -n F E°_cell Relation', 'Kohlrausch’s Law & Limiting Molar Conductivity Λ°m', 'Faraday’s Laws of Electrolysis (m = ZIt)']
      },
      {
        id: 'chem-12-03',
        title: 'Chemical Kinetics',
        subtopics: 'Rate of reaction (average and instantaneous), factors affecting rate of reaction: concentration, temperature, catalyst; order and molecularity of a reaction, rate law and specific rate constant, integrated rate equations and half-life for zero and first order reactions, pseudo first order reactions, temperature dependence of rate constant: Arrhenius equation, activation energy (Ea)',
        hours: 28,
        weightage: '5%',
        ncertClass: '12th Vol 1',
        keyConcepts: ['Zero & 1st Order Integrated Rate Laws & t_1/2', 'Rate Law & Order from Experimental Data', 'Arrhenius Equation (log(k2/k1) = Ea/2.303R (1/T1 - 1/T2))']
      },
      {
        id: 'chem-12-04',
        title: 'd- and f-Block Elements (Transition & Inner Transition)',
        subtopics: 'General trends in 3d series: electronic configuration, occurrence, metallic character, oxidation states, ionic radii, catalytic property, magnetic properties, coloured ions, alloy formation, interstitial compounds; Preparation, properties and oxidizing action of K2Cr2O7 and KMnO4; Lanthanoids: electronic configuration, oxidation states, lanthanoid contraction and consequences; Actinoids: general electronic configuration and oxidation states',
        hours: 28,
        weightage: '6%',
        ncertClass: '12th Vol 1',
        keyConcepts: ['Lanthanoid Contraction & Consequences (Zr-Hf size)', 'KMnO4 & K2Cr2O7 Redox Titration Reactions', 'Spin-Only Magnetic Moment (μ = √(n(n+2)) BM)']
      },
      {
        id: 'chem-12-05',
        title: 'Coordination Compounds',
        subtopics: 'Werner’s coordination theory, ligands, coordination number, denticity, chelate effect, IUPAC nomenclature of mononuclear coordination compounds, isomerism in coordination compounds (structural and stereo / geometrical & optical isomerism), Valence Bond Theory (inner & outer orbital complexes), Crystal Field Theory (CFT) crystal field splitting in octahedral and tetrahedral complexes, spectrochemical series, colour, magnetic properties, stability of complexes',
        hours: 34,
        weightage: '7%',
        ncertClass: '12th Vol 1',
        keyConcepts: ['IUPAC Naming of Complexes', 'Geometrical & Optical Isomerism in Ma2b2, Ma3b3, M(aa)2b2', 'CFT Splitting (Δo vs Δt, High-spin vs Low-spin, CFSE)']
      },
      {
        id: 'chem-12-06',
        title: 'p-Block Elements (Group 15, 16, 17, 18 Overview)',
        subtopics: 'General trends, electronic configurations, oxidation states, anomalous behaviour of first elements of groups, preparation, properties and uses of nitrogen compounds, oxides of nitrogen, phosphorus allotropes, oxygen, ozone, sulphur allotropes, sulphuric acid contact process, halogens and interhalogen compounds, noble gas compounds (XeF2, XeF4, XeF6, XeO3 structures)',
        hours: 24,
        weightage: '5%',
        ncertClass: '12th Vol 1',
        keyConcepts: ['Inert Pair Effect Trends', 'Interhalogen Compounds & Structures', 'Xenon Fluorides & Oxides Geometry (VSEPR)']
      },
      {
        id: 'chem-12-07',
        title: 'Haloalkanes and Haloarenes',
        subtopics: 'Nomenclature, nature of C-X bond, methods of preparation, physical properties, chemical reactions: mechanism of nucleophilic substitution reactions (SN1 and SN2 mechanism, kinetics, stereochemistry, inversion of configuration vs racemization), elimination reactions (Saytzeff rule), reactions of haloarenes (nucleophilic substitution low reactivity reasons, electrophilic substitution reactions, Wurtz-Fittig reaction, Fittig reaction)',
        hours: 26,
        weightage: '5%',
        ncertClass: '12th Vol 2',
        keyConcepts: ['SN1 vs SN2 Detailed Mechanisms & Reactivity Orders', 'Stereochemical Inversion (Walden) vs Racemization', 'Low Reactivity of Chlorobenzene towards Nu- Substitution']
      },
      {
        id: 'chem-12-08',
        title: 'Alcohols, Phenols and Ethers',
        subtopics: 'Nomenclature, preparation methods (from alkenes, carbonyls, Grignard reagents), physical properties (hydrogen bonding), chemical reactions of alcohols: acidity comparison, Lucas test (1°, 2°, 3° identification), dehydration mechanism; Phenols: preparation from cumene, acidity of phenol vs alcohols, Kolbe’s reaction, Reimer-Tiemann reaction, electrophilic substitution; Ethers: preparation by Williamson ether synthesis, reaction with HI (cleavage mechanism)',
        hours: 30,
        weightage: '6%',
        ncertClass: '12th Vol 2',
        keyConcepts: ['Lucas Reagent Test', 'Reimer-Tiemann & Kolbe Reactions', 'Williamson Synthesis & HI Cleavage Mechanism of Ethers']
      },
      {
        id: 'chem-12-09',
        title: 'Aldehydes, Ketones and Carboxylic Acids',
        subtopics: 'Nomenclature, nature of carbonyl group, methods of preparation (Rosenmund, Stephen, Etard, Gatterman-Koch, Friedel-Crafts), nucleophilic addition reactions (HCN, NaHSO3, Grignard, alcohols, ammonia derivatives), reduction (Clemmensen, Wolff-Kishner), oxidation (Tollens’, Fehling’s, haloform / iodoform test), Aldol condensation, Cross-aldol, Cannizzaro reaction; Carboxylic acids: acidity & effect of substituents on pKa, Hell-Volhard-Zelinsky (HVZ) reaction, decarboxylation',
        hours: 36,
        weightage: '8%',
        ncertClass: '12th Vol 2',
        keyConcepts: ['Nucleophilic Addition Reactivity Order', 'Tollens / Fehling / Iodoform Identification Tests', 'Aldol vs Cannizzaro Reaction Conditions', 'HVZ Reaction of Carboxylic Acids']
      },
      {
        id: 'chem-12-10',
        title: 'Organic Compounds Containing Nitrogen (Amines & Diazonium Salts)',
        subtopics: 'Amines: classification, structure, nomenclature, preparation (reduction of nitro, nitriles, amides, Gabriel phthalimide synthesis, Hoffmann bromamide degradation), physical properties, basic character of amines (gas phase vs aqueous phase order), chemical reactions: acylation, carbylamine reaction, reaction with nitrous acid, Hinsberg test for 1°, 2°, 3° amines; Diazonium salts: preparation, chemical reactions (Sandmeyer, Gattermann, azo coupling reactions with phenol & aniline)',
        hours: 28,
        weightage: '6%',
        ncertClass: '12th Vol 2',
        keyConcepts: ['Hoffmann Bromamide & Gabriel Phthalimide Synthesis', 'Basic Strength Order in Aqueous Solution (2° > 1° > 3° in methyl/ethyl)', 'Hinsberg Test for Amine Separation', 'Sandmeyer & Azo Dye Coupling Reactions']
      },
      {
        id: 'chem-12-11',
        title: 'Biomolecules',
        subtopics: 'Carbohydrates: classification (aldoses and ketoses), monosaccharides (glucose and fructose - open & ring structures), D-L configuration, oligosaccharides (sucrose, lactose, maltose glycosidic linkage), polysaccharides (starch, cellulose, glycogen); Proteins: amino acids (essential and non-essential, zwitterion), peptide bond, primary, secondary (alpha-helix, beta-sheet), tertiary, quaternary structures, denaturation of proteins; Enzymes; Vitamins: classification and deficiency diseases; Nucleic acids: chemical composition of DNA and RNA, double helix model, functions (replication, transcription, translation)',
        hours: 22,
        weightage: '5%',
        ncertClass: '12th Vol 2',
        keyConcepts: ['Reducing vs Non-Reducing Sugars', 'Essential Amino Acids List & Zwitterion Structure', 'Protein Denaturation & Structure Levels', 'DNA Base Pairing & Purines/Pyrimidines']
      },
      {
        id: 'chem-12-12',
        title: 'Principles Related to Practical Chemistry (Salt Analysis)',
        subtopics: 'Qualitative analysis of cations (Pb2+, Cu2+, Fe3+, Al3+, Zn2+, Ni2+, Ca2+, Ba2+, Mg2+, NH4+) and anions (CO3 2-, S 2-, SO3 2-, NO3 -, Cl-, Br-, I-, SO4 2-); Detection of functional groups (unsaturation, alcoholic, phenolic, aldehydic, ketonic, carboxylic, amino); Flame test, borax bead test',
        hours: 18,
        weightage: '4%',
        ncertClass: '11th & 12th Lab Manual',
        keyConcepts: ['Group Reagents in Salt Analysis', 'Confirmatory Tests for Anions & Cations', 'Brown Ring Test & Chromyl Chloride Test']
      },
      {
        id: 'chem-12-13',
        title: 'Surface Chemistry & Colloids (Applied Concepts)',
        subtopics: 'Adsorption - physisorption and chemisorption, factors affecting adsorption of gases on solids, Freundlich adsorption isotherm, catalysis (homogeneous and heterogeneous, enzyme catalysis), colloidal state: distinction between true solutions, colloids and suspensions; lyophilic, lyophobic, multimolecular and macromolecular colloids, properties of colloids: Tyndall effect, Brownian movement, electrophoresis, coagulation (Hardy-Schulze rule), emulsions',
        hours: 16,
        weightage: '3%',
        ncertClass: '12th Chemistry Ref',
        keyConcepts: ['Physisorption vs Chemisorption', 'Freundlich Adsorption Isotherm (x/m = k P^(1/n))', 'Hardy-Schulze Rule Coagulating Power', 'Micelle Formation & CMC (Critical Micelle Concentration)']
      }
    ]
  },

  // ==========================================
  // BOTANY — CLASS 11 (12 CHAPTERS)
  // ==========================================
  {
    id: 'bot-11',
    subject: 'Botany',
    subjectCode: 'bot',
    standard: 'Class 11',
    phase: 'Botany - Class 11 Plant Diversity, Cell Biology & Plant Physiology',
    chapters: [
      {
        id: 'bot-11-01',
        title: 'The Living World',
        subtopics: 'What is living? Biodiversity, need for classification, three domains of life, taxonomy and systematics, concept of species and taxonomical hierarchy, binomial nomenclature (ICBN / ICZN rules)',
        hours: 12,
        weightage: '2%',
        ncertClass: '11th Bio',
        keyConcepts: ['Binomial Nomenclature Rules (Linnaeus)', 'Taxonomic Hierarchy (Kingdom to Species)', 'Defining vs Non-defining Properties of Life']
      },
      {
        id: 'bot-11-02',
        title: 'Biological Classification: Monera & Protista',
        subtopics: 'Five kingdom classification (Whittaker): Monera (archaebacteria - methanogens, halophiles, thermoacidophiles; eubacteria, cyanobacteria, heterocyst in Nostoc, mycoplasma), Protista (Chrysophytes - diatoms & diatomaceous earth, Dinoflagellates - red tides Gonyaulax, Euglenoids, Slime moulds, Protozoans)',
        hours: 20,
        weightage: '5%',
        ncertClass: '11th Bio',
        keyConcepts: ['Whittaker 5 Kingdom Criteria', 'Cyanobacteria Heterocyst & Nitrogen Fixation', 'Diatomaceous Earth & Chrysophytes Silica Walls', 'Gonyaulax Red Tides']
      },
      {
        id: 'bot-11-03',
        title: 'Biological Classification: Fungi, Lichens & Viruses',
        subtopics: 'Fungi structural morphology and nutrition; Classes of Fungi: Phycomycetes (Rhizopus, Albugo), Ascomycetes (Penicillium, Claviceps, Aspergillus, Neurospora), Basidiomycetes (Agaricus, Ustilago, Puccinia), Deuteromycetes (Alternaria, Colletotrichum, Trichoderma); Lichens (mycobiont, phycobiont as SO2 pollution indicator), Viruses, Viroids (T.O. Diener, lack protein coat) and Prions (mad cow disease/BSE)',
        hours: 22,
        weightage: '5%',
        ncertClass: '11th Bio',
        keyConcepts: ['Fungi 4 Classes Spores & Fruiting Bodies', 'Viroids Structure (Free low MW RNA)', 'Lichens Symbiotic Partnership & Pollution Indicator']
      },
      {
        id: 'bot-11-04',
        title: 'Plant Kingdom: Algae and Bryophytes',
        subtopics: 'Salient features and classification: Algae (Chlorophyceae - starch, Chlamydomonas, Volvox, Spirogyra; Phaeophyceae - laminarin/mannitol, fucoxanthin, algin, Ectocarpus, Dictyota, Laminaria, Sargassum, Fucus; Rhodophyceae - floridean starch, r-phycoerythrin, agar from Gelidium and Gracilaria, Polysiphonia, Porphyra); Bryophytes (Liverworts - Marchantia thallus, gemma cups; Mosses - Funaria, Polytrichum, Sphagnum peat moss, protonema stage)',
        hours: 24,
        weightage: '5%',
        ncertClass: '11th Bio',
        keyConcepts: ['Algae Table (Pigments, Food Storage & Flagella)', 'Hydrocolloids (Algin & Carrageen)', 'Gemma Cups & Marchantia Archegoniophore', 'Sphagnum Peat Moss Water Retention']
      },
      {
        id: 'bot-11-05',
        title: 'Plant Kingdom: Pteridophytes, Gymnosperms & Alternation of Generations',
        subtopics: 'Pteridophytes: vascular cryptogams, sporophyte dominance, microphylls vs macrophylls, heterospory and origin of seed habit in Selaginella and Salvinia, prothallus requirements; Gymnosperms: naked seeds, mycorrhizal association in Pinus, coralloid roots in Cycas, ovule and pollen chamber, life cycles and alternation of generations: Haplontic (Volvox, Spirogyra), Diplontic (Fucus, Gymnosperms, Angiosperms), Haplodiplontic (Bryophytes, Pteridophytes, Ectocarpus, Polysiphonia, Kelps)',
        hours: 26,
        weightage: '6%',
        ncertClass: '11th Bio',
        keyConcepts: ['Heterospory in Selaginella & Salvinia (Seed Habit Precursor)', 'Pinus Mycorrhiza vs Cycas Coralloid Roots', 'Life Cycle Patterns & Exceptional Algae Examples']
      },
      {
        id: 'bot-11-06',
        title: 'Morphology of Flowering Plants',
        subtopics: 'Morphology of root, stem, leaf and modifications; Inflorescence (racemose and cymose); Flower parts (calyx, corolla, androecium, gynoecium), symmetry (actinomorphic, zygomorphic), ovary position (hypogynous, perigynous, epigynous), aestivation (valvate, twisted, imbricate, vexillary), placentation (marginal, axile, parietal, free central, basal); Fruit and seed structure; Description of families: Fabaceae, Solanaceae, Liliaceae, Malvaceae, Cruciferae, Compositae, Gramineae',
        hours: 28,
        weightage: '7%',
        ncertClass: '11th Bio',
        keyConcepts: ['Placentation Types & NCERT Examples', 'Aestivation Types (Valvate, Twisted, Imbricate, Vexillary)', 'Floral Formulas of Solanaceae, Fabaceae, Malvaceae']
      },
      {
        id: 'bot-11-07',
        title: 'Anatomy of Flowering Plants',
        subtopics: 'Tissues: meristematic and permanent tissues (simple: parenchyma, collenchyma, sclerenchyma; complex: xylem & phloem); Tissue systems (epidermal, ground, vascular); Internal anatomy of dicotyledonous and monocotyledonous root, stem and leaf; Secondary growth in dicot stem and root (vascular cambium, cork cambium, spring wood & autumn wood, heartwood & sapwood)',
        hours: 26,
        weightage: '6%',
        ncertClass: '11th Bio',
        keyConcepts: ['Dicot vs Monocot Stem/Root Anatomy', 'Spring Wood vs Autumn Wood & Annual Rings', 'Heartwood vs Sapwood Properties', 'Periderm (Phellogen, Phellem, Phelloderm)']
      },
      {
        id: 'bot-11-08',
        title: 'Cell: The Unit of Life',
        subtopics: 'Cell theory (Schleiden, Schwann, Virchow), prokaryotic vs eukaryotic cell, cell envelope and modifications (glycocalyx, cell wall, cell membrane - fluid mosaic model of Singer & Nicolson), endomembrane system (ER, Golgi apparatus, lysosomes, vacuoles), mitochondria, plastids (chloroplast structure & pigments), ribosomes (70S and 80S), cytoskeleton, cilia, flagella, centrosome & centrioles, nucleus (chromatin, nucleolus, chromosome morphology - metacentric, submetacentric, acrocentric, telocentric)',
        hours: 30,
        weightage: '8%',
        ncertClass: '11th Bio',
        keyConcepts: ['Fluid Mosaic Model of Membrane', 'Endomembrane System Components', 'Mitochondria & Chloroplast Semi-Autonomous Organelles', 'Chromosome Centromere Positions']
      },
      {
        id: 'bot-11-09',
        title: 'Cell Cycle and Cell Division',
        subtopics: 'Cell cycle phases: Interphase (G1, S, G2 phase, G0 quiescent stage), M Phase; Mitosis: Prophase, Metaphase, Anaphase, Telophase, Cytokinesis; Meiosis: Meiosis I (Prophase I: Leptotene, Zygotene, Pachytene, Diplotene, Diakinesis - synapsis, crossing over, chiasmata), Metaphase I, Anaphase I, Telophase I; Meiosis II; Significance of mitosis and meiosis',
        hours: 22,
        weightage: '6%',
        ncertClass: '11th Bio',
        keyConcepts: ['Prophase I Sub-Stages (Zygotene Synapsis, Pachytene Crossing Over)', 'DNA Content (2C to 4C in S phase) vs Chromosome Number', 'Anaphase Centromere Splitting']
      },
      {
        id: 'bot-11-10',
        title: 'Photosynthesis in Higher Plants',
        subtopics: 'Site of photosynthesis, photosynthetic pigments (chlorophyll a, b, carotenoids), absorption and action spectra, photochemical phase (light reactions): photosystems I and II, non-cyclic and cyclic photophosphorylation, splitting of water (photolysis), chemiosmotic hypothesis (ATP synthesis), biosynthetic phase (dark reactions): C3 cycle (Calvin cycle - carboxylation, reduction, regeneration), C4 pathway (Hatch-Slack pathway, Kranz anatomy), photorespiration (C2 cycle), factors affecting photosynthesis (Blackman’s law of limiting factors)',
        hours: 32,
        weightage: '7%',
        ncertClass: '11th Bio',
        keyConcepts: ['Z-Scheme & Chemiosmotic ATP Generation', 'Calvin Cycle ATP & NADPH Consumption', 'C4 Kranz Anatomy & PEPcase Carboxylation', 'Photorespiration & RuBisCO Dual Nature']
      },
      {
        id: 'bot-11-11',
        title: 'Respiration in Plants',
        subtopics: 'Cellular respiration: Glycolysis (EMP pathway, steps, ATP yield), fermentation (alcoholic and lactic acid), aerobic respiration: link reaction (acetyl CoA formation), TCA cycle / Krebs cycle, electron transport system (ETS) and oxidative phosphorylation, respiratory balance sheet, amphibolic pathway, respiratory quotient (RQ) of carbohydrates, fats, proteins, organic acids',
        hours: 26,
        weightage: '6%',
        ncertClass: '11th Bio',
        keyConcepts: ['Glycolysis Key Enzymes & Net ATP', 'Krebs Cycle Steps & Decarboxylation Reactions', 'ETS Complex I, II, III, IV, V (ATP Synthase)', 'RQ Values (Carb=1, Fat=0.7, Protein=0.9)']
      },
      {
        id: 'bot-11-12',
        title: 'Plant Growth and Development',
        subtopics: 'Growth phases, growth rate (arithmetic and geometric), differentiation, dedifferentiation, redifferentiation, plasticity, plant growth regulators (PGRs): discovery, physiological effects and agricultural applications of Auxins, Gibberellins, Cytokinins, Ethylene, Abscisic acid (ABA)',
        hours: 20,
        weightage: '4%',
        ncertClass: '11th Bio',
        keyConcepts: ['Auxin (Apical Dominance, 2,4-D Weedicide)', 'Gibberellin (Bolting, Malting)', 'Cytokinin (Cell Division, Delay Senescence)', 'Ethylene (Fruit Ripening) & ABA (Stress Hormone)']
      }
    ]
  },

  // ==========================================
  // BOTANY — CLASS 12 (10 CHAPTERS)
  // ==========================================
  {
    id: 'bot-12',
    subject: 'Botany',
    subjectCode: 'bot',
    standard: 'Class 12',
    phase: 'Botany - Class 12 Reproduction, Genetics & Ecology',
    chapters: [
      {
        id: 'bot-12-01',
        title: 'Sexual Reproduction in Flowering Plants',
        subtopics: 'Structure of stamen, microsporangium and pollen grain, pollen viability; Structure of pistil, megasporangium (ovule) and embryo sac (7-celled, 8-nucleate structure), pollination types (autogamy, geitonogamy, xenogamy), agents of pollination, outbreeding devices, pollen-pistil interaction, double fertilization (syngamy and triple fusion), development of endosperm (free nuclear, cellular) and embryo, structure of dicot and monocot seeds, apomixis and polyembryony',
        hours: 32,
        weightage: '8%',
        ncertClass: '12th Bio',
        keyConcepts: ['7-Celled 8-Nucleate Embryo Sac Organization', 'Outbreeding Devices (Self-Incompatibility, etc.)', 'Double Fertilization & Ploidy of Structures (PEN = 3n)', 'Apomixis & Seed Formation without Fertilization']
      },
      {
        id: 'bot-12-02',
        title: 'Principles of Inheritance & Variation: Mendelian Genetics',
        subtopics: 'Mendel’s laws of inheritance: Law of segregation, law of independent assortment, monohybrid and dihybrid cross ratios, test cross & back cross, incomplete dominance (Mirabilis jalapa, Snapdragon), co-dominance (ABO blood groups), multiple alleles, pleiotropy (Phenylketonuria, Starch synthesis in pea seeds), polygenic inheritance (human skin colour)',
        hours: 36,
        weightage: '9%',
        ncertClass: '12th Bio',
        keyConcepts: ['Mendelian Cross Ratios & Test Cross Interpretation', 'Incomplete vs Co-dominance Mechanisms', 'ABO Blood Groups & Multiple Allele Genetics', 'Pleiotropy vs Polygenic Inheritance']
      },
      {
        id: 'bot-12-03',
        title: 'Principles of Inheritance & Variation: Chromosomal Genetics & Disorders',
        subtopics: 'Chromosomal theory of inheritance (Sutton & Boveri), Morgan’s Drosophila experiments (linkage, recombination, parental vs recombinant frequencies), chromosome mapping by Alfred Sturtevant, sex determination (XX-XY, XX-XO, ZZ-ZW, honey bee haplodiploidy), mutation (point mutation, frameshift mutation), pedigree analysis symbols & problem solving; Mendelian disorders: Haemophilia, Sickle cell anaemia, Phenylketonuria, Thalassemia, Colour blindness; Chromosomal disorders: Down’s syndrome, Klinefelter’s syndrome, Turner’s syndrome',
        hours: 36,
        weightage: '9%',
        ncertClass: '12th Bio',
        keyConcepts: ['Morgan’s Linkage Data (1.3% vs 37.2% Recombination)', 'Pedigree Analysis Logic & Inheritance Types', 'Sickle Cell Point Mutation (GAG to GUG)', 'Down, Klinefelter & Turner Karyotypes']
      },
      {
        id: 'bot-12-04',
        title: 'Molecular Basis of Inheritance: DNA Structure & Replication',
        subtopics: 'Structure of polynucleotide chain, double helix model of DNA (Watson and Crick, Chargaff’s equivalence rules), packaging of DNA helix (histone octamer, nucleosome structure, euchromatin vs heterochromatin), search for genetic material: Griffith transformation experiment, Avery-MacLeod-McCarty, Hershey-Chase bacteriophage experiment; DNA replication: Meselson and Stahl experiment (15N CsCl centrifugation), Taylor’s thymidine experiment in Vicia faba, replication machinery and enzymes (DNA polymerase, helicase, primase, ligase, Okazaki fragments, continuous vs discontinuous synthesis)',
        hours: 38,
        weightage: '9%',
        ncertClass: '12th Bio',
        keyConcepts: ['Nucleosome Structure & Histone Octamer', 'Hershey-Chase 32P & 35S Isotope Experiment', 'Meselson-Stahl Semiconservative Centrifugation Densities', 'DNA Polymerase 5\' to 3\' Synthesis & Okazaki Fragments']
      },
      {
        id: 'bot-12-05',
        title: 'Molecular Basis of Inheritance: Transcription, Genetic Code & Translation',
        subtopics: 'Transcription unit (promoter, structural gene, terminator), transcription in prokaryotes (polycistronic mRNA, sigma and rho factors) vs eukaryotes (monocistronic mRNA, RNA polymerases I, II, III, post-transcriptional modifications: splicing, capping with methyl guanosine triphosphate, tailing with poly-A tail); Genetic code: properties (triplet, degenerate, unambiguous, universal, AUG start codon), tRNA as adapter molecule; Translation: charging of tRNA (aminoacylation), initiation, elongation, termination, ribozyme 23S rRNA; Regulation of gene expression: Lac Operon (Jacob & Monod - i gene, operator, promoter, z, y, a structural genes, inducer allolactose/lactose); Human Genome Project (HGP) and DNA fingerprinting (VNTR, Southern blot)',
        hours: 42,
        weightage: '10%',
        ncertClass: '12th Bio',
        keyConcepts: ['Transcription Post-Transcriptional Splicing/Capping/Tailing', 'Genetic Code Degeneracy & Non-Overlapping Nature', 'Lac Operon Repressor Inactivation by Inducer', 'DNA Fingerprinting VNTR Polymorphism']
      },
      {
        id: 'bot-12-06',
        title: 'Microbes in Human Welfare',
        subtopics: 'Microbes in household food processing (LAB, curd, cheese, Baker’s yeast), microbes in industrial production (fermented beverages, antibiotics - penicillin, organic acids, alcohol, enzymes, bioactive molecules - cyclosporin A, statins), microbes in sewage treatment (primary and secondary/biological treatment, BOD), microbes in production of biogas (methanogens, biogas plant structure), microbes as biocontrol agents (Bacillus thuringiensis, Trichoderma, Baculoviruses/NPV), microbes as biofertilizers (Rhizobium, Azospirillum, Azotobacter, Mycorrhiza, Cyanobacteria/Anabaena)',
        hours: 20,
        weightage: '4%',
        ncertClass: '12th Bio',
        keyConcepts: ['Bioactive Molecules (Cyclosporin A, Statin, Streptokinase)', 'Sewage Treatment & BOD Concept', 'Baculoviruses Genus Nucleopolyhedrovirus Species-Specific', 'Biofertilizers & Mycorrhizal Associations']
      },
      {
        id: 'bot-12-07',
        title: 'Organisms and Populations: Ecology & Adaptations',
        subtopics: 'Organism and its environment, major abiotic factors (temperature, water, light, soil), responses to abiotic factors (conform, regulate, migrate, suspend - diapause, hibernation, aestivation), adaptations in plants (xerophytic adaptations, succulent stems, cuticle, stomata) and animals (Allen’s rule, altitude sickness & acclimation, Kangaroo rat water conservation)',
        hours: 22,
        weightage: '5%',
        ncertClass: '12th Bio',
        keyConcepts: ['Eurythermal vs Stenothermal Organisms', 'Allen’s Rule for Polar Animals', 'Altitude Sickness Physiological Responses (EPO, Breathing Rate)', 'Kangaroo Rat Internal Fat Oxidation']
      },
      {
        id: 'bot-12-08',
        title: 'Organisms and Populations: Population Dynamics & Interactions',
        subtopics: 'Population attributes: natality, mortality, sex ratio, age pyramids (expanding, stable, declining), population density; Population growth models: exponential growth (J-shaped curve, dN/dt = rN) and logistic growth (S-shaped / sigmoid curve, Verhulst-Pearl logistic growth dN/dt = rN(K-N)/K, carrying capacity K); Population interactions: mutualism (lichen, mycorrhiza, fig-wasp, Mediterranean orchid Ophrys sexual deceit), competition (Gause’s competitive exclusion principle, MacArthur resource partitioning in warblers), predation (prickly pear cactus & moth, monarch butterfly defence), parasitism (brood parasitism in cuckoo & crow, ecto vs endoparasites), commensalism (epiphytic orchid on mango, clownfish & sea anemone, barnacles on whale), amensalism (Penicillium & bacteria)',
        hours: 24,
        weightage: '6%',
        ncertClass: '12th Bio',
        keyConcepts: ['Verhulst-Pearl Logistic Growth Equation', 'Gause’s Exclusion vs MacArthur Resource Partitioning', 'Co-evolution in Fig & Wasp Mutualism', 'Sexual Deceit in Mediterranean Orchid Ophrys']
      },
      {
        id: 'bot-12-09',
        title: 'Ecosystem Structure, Function & Succession',
        subtopics: 'Ecosystem components: abiotic and biotic factors, productivity (Gross Primary Productivity GPP, Net Primary Productivity NPP, NPP = GPP - R), decomposition (steps: fragmentation, leaching, catabolism, humification, mineralization), energy flow (10% law of Lindeman, food chains grazing vs detritus, food web), ecological pyramids (pyramid of numbers, biomass, energy - why energy pyramid is always upright and never inverted), nutrient cycling (carbon & phosphorus biogeochemical cycles), ecological succession: pioneer species, seral stages, climax community, primary vs secondary succession, hydrarch and xerarch succession pathways',
        hours: 24,
        weightage: '6%',
        ncertClass: '12th Bio',
        keyConcepts: ['Decomposition Factors & 5 Sequential Steps', 'Lindeman 10% Trophic Energy Law', 'Pyramid of Biomass in Sea (Inverted) vs Terrestrial', 'Hydrarch (Phytoplankton to Forest) & Xerarch (Lichen to Forest)']
      },
      {
        id: 'bot-12-10',
        title: 'Biodiversity and Conservation',
        subtopics: 'Concept and levels of biodiversity (genetic, species, ecological), global species estimates (Robert May’s 7 million estimate), patterns of biodiversity (latitudinal gradient, species-area relationship of Alexander von Humboldt - S = CA^z, log S = log C + z log A, z value ranges), importance of biodiversity (Rivet popper hypothesis of Paul Ehrlich, David Tilman’s long-term plots), loss of biodiversity (The Evil Quartet: habitat loss and fragmentation, over-exploitation, alien species invasion - Nile perch in Lake Victoria, Eichhornia, Parthenium, Clarias gariepinus, co-extinctions); Conservation strategies: In-situ (National parks, wildlife sanctuaries, biosphere reserves, sacred groves) and Ex-situ (zoological parks, botanical gardens, wildlife safari parks, cryopreservation, seed banks), International conventions (Earth Summit 1992 Rio, World Summit 2002 Johannesburg)',
        hours: 22,
        weightage: '5%',
        ncertClass: '12th Bio',
        keyConcepts: ['Species-Area Relationship Formula & Slopes (z = 0.1-0.2 vs 0.6-1.2)', 'The Evil Quartet 4 Major Threats', 'In-Situ vs Ex-Situ Conservation Examples (Sacred Groves)', 'Earth Summit vs World Summit Goals']
      }
    ]
  },

  // ==========================================
  // ZOOLOGY — CLASS 11 (11 CHAPTERS)
  // ==========================================
  {
    id: 'zoo-11',
    subject: 'Zoology',
    subjectCode: 'zoo',
    standard: 'Class 11',
    phase: 'Zoology - Class 11 Animal Diversity & Human Physiology',
    chapters: [
      {
        id: 'zoo-11-01',
        title: 'Animal Kingdom: Non-Chordates (Porifera to Echinodermata & Hemichordata)',
        subtopics: 'Basis of animal classification: levels of organization, symmetry, diploblastic vs triploblastic, coelom types (acoelomate Platyhelminthes, pseudocoelomate Aschelminthes, coelomate), segmentation/metamerism; Phylum Porifera (spongocoel, choanocytes/collar cells, Sycon, Spongilla, Euspongia), Cnidaria/Coelenterata (cnidoblasts, polyp & medusa, metagenesis in Obelia, Physalia, Adamsia, Pennatula, Gorgonia, Meandrina), Ctenophora (comb plates, bioluminescence, Pleurobrachia, Ctenoplana), Platyhelminthes (flame cells, Taenia, Fasciola), Aschelminthes (syncytial epidermis, Ascaris, Wuchereria, Ancylostoma), Annelida (nephridia, parapodia in Nereis, Pheretima, Hirudinaria), Arthropoda (chitinous exoskeleton, Malpighian tubules, statocysts, Apis, Bombyx, Laccifer, Anopheles, Culex, Aedes, Locusta, Limulus living fossil), Mollusca (radula, mantle cavity, feather gills, Pila, Pinctada, Sepia, Loligo, Octopus, Aplysia, Dentalium, Chaetopleura), Echinodermata (water vascular system, radial symmetry in adult, bilateral in larva, Asterias, Echinus, Antedon, Cucumaria, Ophiura), Hemichordata (proboscis, collar, trunk, Balanoglossus, Saccoglossus)',
        hours: 36,
        weightage: '8%',
        ncertClass: '11th Bio',
        keyConcepts: ['Phylum Key Features (Choanocytes, Cnidoblasts, Flame Cells, Malpighian Tubules, Water Vascular System)', 'Metagenesis in Obelia & Bioluminescence in Ctenophores', 'Larval vs Adult Symmetry in Echinoderms', 'Living Fossil Limulus & Vectors Anopheles/Aedes']
      },
      {
        id: 'zoo-11-02',
        title: 'Animal Kingdom: Chordates (Protochordata to Mammalia)',
        subtopics: 'Fundamental chordate characters (notochord, dorsal hollow nerve cord, paired pharyngeal gill slits, post-anal tail); Subphylum Urochordata/Tunicata (notochord in larval tail only, Ascidia, Salpa, Doliolum) and Cephalochordata (notochord from head to tail, Branchiostoma/Amphioxus); Subphylum Vertebrata: Class Cyclostomata (sucking jawless mouth, Petromyzon, Myxine); Superclass Pisces: Class Chondrichthyes (cartilaginous, placoid scales, ventral mouth, operculum absent, air bladder absent, claspers present, electric organ Torpedo, poison sting Trygon, Scoliodon, Pristis, Carcharodon) vs Class Osteichthyes (bony, cycloid/ctenoid scales, terminal mouth, 4 pairs gills with operculum, air bladder present, Exocoetus, Hippocampus, Labeo, Catla, Clarias, Betta, Pterophyllum); Superclass Tetrapoda: Class Amphibia (dual life, moist scale-less skin, tympanum, 3-chambered heart, Bufo, Rana, Hyla, Salamandra, Ichthyophis), Class Reptilia (creeping, dry cornified skin, epidermal scales/scutes, 3-chambered heart with 4-chambered exception in crocodile, Chelone, Testudo, Chameleon, Calotes, Crocodilus, Alligator, Hemidactylus, venomous Naja, Bangarus, Vipera), Class Aves (feathers, beak, pneumatic bones, air sacs connected to lungs, homeothermic, 4-chambered heart, Corvus, Columba, Psittacula, Struthio, Pavo, Aptenodytes, Neophron), Class Mammalia (mammary glands, hair, pinna, homeothermic, 4-chambered heart, oviparous Ornithorhynchus platypus, viviparous Macropus, Pteropus, Camelus, Macaca, Rattus, Canis, Felis, Elephas, Equus, Delphinus, Balaenoptera, Panthera tigris, Panthera leo)',
        hours: 32,
        weightage: '7%',
        ncertClass: '11th Bio',
        keyConcepts: ['Chondrichthyes vs Osteichthyes Complete Comparison', 'Amphibia vs Reptilia vs Aves vs Mammalia Heart & Respiration', 'Pneumatic Bones & Air Sacs in Birds', 'Oviparous Mammal Ornithorhynchus (Platypus)']
      },
      {
        id: 'zoo-11-03',
        title: 'Structural Organisation in Animals: Animal Tissues',
        subtopics: 'Epithelial tissue: Simple epithelium (squamous in blood vessels & air sacs, cuboidal in ducts & tubular nephrons, brush bordered cuboidal in PCT, columnar in stomach & intestine, ciliated in bronchioles & fallopian tubes, glandular: unicellular goblet cells vs multicellular salivary glands); Compound epithelium (stratified squamous); Cell junctions: Tight junctions (prevent leakage), Adhering junctions (cementing), Gap junctions (rapid ion & molecule communication); Connective tissue: Loose connective tissue (areolar tissue beneath skin, adipose tissue fat storage), Dense connective tissue (dense regular: tendons connecting muscle to bone, ligaments connecting bone to bone; dense irregular in dermis), Specialised connective tissue (cartilage: chondrocytes in lacunae, solid & pliable; bone: osteocytes in lacunae, hard & non-pliable with calcium salts & collagen; blood: RBC, WBC, platelets & plasma); Muscle tissue (skeletal: striated & voluntary, smooth: non-striated, spindle-shaped & involuntary in visceral organs, cardiac: striated, involuntary with intercalated discs); Neural tissue (neurons & neuroglial cells)',
        hours: 26,
        weightage: '6%',
        ncertClass: '11th Bio',
        keyConcepts: ['Epithelium Types & Precise NCERT Body Locations', 'Cell Junctions Functional Differences', 'Tendon (Muscle-to-Bone) vs Ligament (Bone-to-Bone)', 'Cardiac Intercalated Discs & Gap Junctions']
      },
      {
        id: 'zoo-11-04',
        title: 'Structural Organisation in Animals: Frog Morphology & Anatomy',
        subtopics: 'Morphology of Frog (Rana tigrina): skin (mucus glands, camouflage/mimicry), head and trunk, eyes with nictitating membrane, tympanum, forelimbs & hindlimbs (webbed digits, copulatory pad & vocal sacs in male); Anatomy of Frog: Digestive system (alimentary canal, cloaca, liver, pancreas), Respiratory system (cutaneous respiration, buccopharyngeal, pulmonary respiration), Circulatory system (3-chambered heart with sinus venosus and conus arteriosus, hepatic portal & renal portal systems), Excretory system (mesonephric kidneys, ureters opening into cloaca, ureotelic), Nervous system (CNS, PNS, sympathetic & parasympathetic), Reproductive system (male: 10-12 vasa efferentia entering Bidder’s canal; female: paired ovaries releasing 2500-3000 ova into cloaca; external fertilization in water, tadpole larva metamorphosis)',
        hours: 20,
        weightage: '4%',
        ncertClass: '11th Bio',
        keyConcepts: ['Male Frog Vocal Sacs & Copulatory Pads on 1st Digit', 'Sinus Venosus & Conus Arteriosus in Frog Heart', 'Bidder’s Canal Path for Sperm in Male Frog Kidney', 'Cutaneous Respiration during Hibernation & Aestivation']
      },
      {
        id: 'zoo-11-05',
        title: 'Breathing and Exchange of Gases (Human Respiration)',
        subtopics: 'Human respiratory tract (nostrils, pharynx, larynx with vocal cords, trachea, bronchi, bronchioles, alveoli); Mechanism of breathing (diaphragm and external/internal intercostal muscles, inspiration vs expiration pressures); Respiratory volumes and capacities: Tidal Volume (TV = 500 mL), Inspiratory Reserve Volume (IRV = 2500-3000 mL), Expiratory Reserve Volume (ERV = 1000-1100 mL), Residual Volume (RV = 1100-1200 mL, cannot be measured by spirometer), Inspiratory Capacity (IC = TV + IRV), Expiratory Capacity (EC = TV + ERV), Functional Residual Capacity (FRC = ERV + RV), Vital Capacity (VC = ERV + TV + IRV), Total Lung Capacity (TLC = VC + RV); Exchange of gases: partial pressures of O2 and CO2 in atmospheric air, alveoli, deoxygenated blood, oxygenated blood and tissues; Transport of gases: O2 transport (97% as oxyhaemoglobin, 3% dissolved in plasma), Oxygen-haemoglobin dissociation sigmoid curve (factors causing right shift: high pCO2, low pH, high H+, high temp; left shift in alveoli); CO2 transport (70% as bicarbonate ions with carbonic anhydrase, 20-25% as carbamino-haemoglobin, 7% dissolved in plasma); Regulation of respiration: Respiratory rhythm centre in medulla, pneumotaxic centre in pons, chemosensitive area sensitive to CO2 and H+; Respiratory disorders: Asthma, Emphysema (alveolar wall damage), Occupational respiratory disorders (silicosis, asbestosis)',
        hours: 28,
        weightage: '6%',
        ncertClass: '11th Bio',
        keyConcepts: ['Respiratory Volumes & Capacities Numerical Values & Formulas', 'Alveolar vs Tissue pO2 and pCO2 Table (104, 40, 45, 95 mmHg)', 'Oxygen-Haemoglobin Dissociation Curve Shifts (Bohr Effect)', 'Pneumotaxic Centre & Chemosensitive Regulation']
      },
      {
        id: 'zoo-11-06',
        title: 'Body Fluids and Circulation (Human Cardiovascular System)',
        subtopics: 'Composition of blood: plasma (fibrinogen, globulins, albumins) and formed elements (erythrocytes 5-5.5 million/mm3, leucocytes: granulocytes neutrophils, eosinophils, basophils; agranulocytes lymphocytes B & T, monocytes; thrombocytes/platelets 1.5-3.5 lakh/mm3); Blood groups: ABO system (antigens on RBC surface, antibodies in plasma) and Rh system (Rh incompatibility, erythroblastosis foetalis & anti-Rh antibodies administration); Coagulation of blood (clotting cascade, thrombokinase, prothrombin to thrombin, fibrinogen to fibrin); Lymph (interstitial tissue fluid); Human circulatory system: structure of heart (4 chambers, interatrial & interventricular septum, tricuspid, bicuspid/mitral valve, semilunar valves), nodal tissue (Sino-atrial node SAN pacemaker 70-75/min, AV node, AV bundle, Bundle of His, Purkinje fibres); Cardiac cycle (atrial systole, ventricular systole, joint diastole, stroke volume 70 mL, cardiac output 5 L/min), Heart sounds (LUB due to AV valve closure, DUB due to semilunar valve closure); Electrocardiogram (ECG: P wave atrial depolarisation, QRS complex ventricular depolarisation, T wave ventricular repolarisation); Double circulation (pulmonary and systemic, hepatic portal system, coronary circulation); Regulation of cardiac activity (ANS sympathetic accelerates, parasympathetic/vagus slows, adrenal medullary hormones); Disorders: Hypertension (>140/90 mmHg), Coronary Artery Disease (CAD/Atherosclerosis), Angina pectoris, Heart failure',
        hours: 32,
        weightage: '7%',
        ncertClass: '11th Bio',
        keyConcepts: ['Nodal Tissue Auto-Excitability & SAN Pacemaker Rate', 'Cardiac Cycle Volumes (Stroke Volume = EDV - ESV)', 'ECG Waves Precise Clinical Meanings (P, QRS, T)', 'Erythroblastosis Foetalis Rh- Mother & Rh+ Foetus Condition']
      },
      {
        id: 'zoo-11-07',
        title: 'Excretory Products and Their Elimination (Human Excretory System)',
        subtopics: 'Modes of excretion: Ammonotelism (aquatic invertebrates, bony fishes, tadpole), Ureotelism (mammals, amphibians, cartilaginous fishes), Uricotelism (reptiles, birds, insects, land snails); Human excretory system: macroscopic structure of kidney (cortex, medulla, medullary pyramids, renal pelvis, calyces), Nephron structure (Bowman’s capsule, glomerulus, Malpighian body, PCT, Loop of Henle descending & ascending limbs, DCT, Collecting duct; cortical vs juxtamedullary nephrons with long loop of Henle & vasa recta); Urine formation: 1. Glomerular filtration (GFR = 125 mL/min = 180 L/day, net filtration pressure NFP, filtration membrane 3 layers), 2. Tubular reabsorption (99% reabsorption, PCT obligate reabsorption of glucose, amino acids, Na+, water, brush border), 3. Tubular secretion (H+, K+, ammonia secreted into DCT & collecting duct for pH balance); Mechanism of concentration of filtrate: Counter-current multiplier (Henle’s loop) and counter-current exchanger (vasa recta), medullary gradient from 300 to 1200 mOsmol/L due to NaCl and Urea; Regulation of kidney function: Hypothalamic osmoreceptors & ADH/Vasopressin (water reabsorption from DCT), Juxtaglomerular Apparatus (JGA) Renin-Angiotensin-Aldosterone System (RAAS pathway: Renin converts angiotensinogen to angiotensin I to angiotensin II, aldosterone causes Na+ and water reabsorption), Atrial Natriuretic Factor (ANF from heart causes vasodilation & natriuresis, antagonizes RAAS); Micturition reflex; Role of lungs (CO2 200 mL/min), liver (bilirubin, biliverdin, cholesterol), skin (sweat NaCl, urea, lactic acid; sebum sterols, hydrocarbons); Disorders: Uraemia, Renal calculi (calcium oxalate stones), Glomerulonephritis, Hemodialysis mechanism (dialyzing fluid, cellophane membrane, heparin & anti-heparin)',
        hours: 32,
        weightage: '7%',
        ncertClass: '11th Bio',
        keyConcepts: ['Counter-Current Mechanism Flow Directions & Medullary Osmolarity Gradient', 'GFR Value & Glomerular Filtration Membrane 3 Layers', 'RAAS Pathway (Renin -> Angiotensin II -> Aldosterone) vs ANF', 'Hemodialysis Setup & Heparin / Anti-Heparin Addition']
      },
      {
        id: 'zoo-11-08',
        title: 'Locomotion and Movement: Muscular System & Contraction',
        subtopics: 'Types of movement: amoeboid (macrophages, leucocytes), ciliary (ciliated epithelium of trachea & fallopian tubes), muscular; Skeletal muscle structure: epimysium, perimysium, endomysium, muscle bundle/fascicle, muscle fibre/sarcolemma, sarcoplasmic reticulum (calcium reservoir); Myofibril structure: sarcomere as functional unit between two Z-lines, dark anisotropic A-band (myosin thick filaments + overlapping actin), light isotropic I-band (actin thin filaments with Z-line in center), H-zone (central myosin only with M-line in center); Contractile proteins: Actin (two F-actin helices of G-actin monomers, two tropomyosin filaments, troponin complex with TnT, TnI, TnC binding Ca2+), Myosin (meromyosin monomers with heavy meromyosin HMM head with actin & ATP binding site, light meromyosin LMM tail); Mechanism of muscle contraction: Sliding Filament Theory (action potential at neuromuscular junction, acetylcholine release, Ca2+ release from sarcoplasm, Ca2+ binds Troponin-C, unmasking of active sites on actin, ATP hydrolysis by myosin ATPase, cross-bridge formation, power stroke pulling actin toward center, shortening of sarcomere: I-band shortens, H-zone reduces/disappears, A-band length remains constant, ATP binding breaks cross-bridge); Red muscle fibres (high myoglobin, rich mitochondria, aerobic, slow fatigue) vs White muscle fibres (low myoglobin, rich sarcoplasmic reticulum, anaerobic, fast fatigue)',
        hours: 26,
        weightage: '6%',
        ncertClass: '11th Bio',
        keyConcepts: ['Sarcomere Band Changes during Contraction (I shortens, H disappears, A constant)', 'Troponin-C Ca2+ Binding & Cross-Bridge Power Stroke', 'Myosin Head ATPase & Actin Binding Sites', 'Red (Aerobic) vs White (Anaerobic) Muscle Fibres']
      },
      {
        id: 'zoo-11-09',
        title: 'Locomotion and Movement: Human Skeletal System & Joints',
        subtopics: 'Human skeleton total 206 bones; Axial skeleton (80 bones): Skull (22 bones: 8 cranial frontal, parietal 2, temporal 2, occipital, sphenoid, ethmoid; 14 facial nasal 2, maxillae 2, zygomatic 2, lacrimal 2, palatine 2, inferior nasal conchae 2, vomer, mandible; hyoid bone 1, ear ossicles 6: malleus 2, incus 2, stapes 2), Vertebral column (26 bones: cervical 7 with atlas C1 & axis C2, thoracic 12, lumbar 5, sacrum 1 fused, coccyx 1 fused), Sternum (1 bone), Ribs (12 pairs: true ribs 1-7 vertebrosternal, false ribs 8-10 vertebrochondral, floating ribs 11-12 vertebral); Appendicular skeleton (126 bones): Pectoral girdle (4 bones: clavicle 2, scapula 2 with spine, acromion process, glenoid cavity), Upper limb bones (60 bones: humerus 2, radius 2, ulna 2, carpals 16, metacarpals 10, phalanges 28 formula 2,3,3,3,3), Pelvic girdle (2 coxal bones formed by fusion of ilium, ischium, pubis meeting at pubic symphysis, acetabulum cavity for femur), Lower limb bones (60 bones: femur 2 longest & heaviest, patella 2 knee cap, tibia 2, fibula 2, tarsals 14 with calcaneus, metatarsals 10, phalanges 28); Joints classification: 1. Fibrous / immovable joints (sutures in skull), 2. Cartilaginous / slightly movable joints (intervertebral discs, pubic symphysis), 3. Synovial / freely movable joints (synovial fluid, synovial membrane: Ball and socket joint between humerus & glenoid cavity / femur & acetabulum, Hinge joint knee & elbow, Pivot joint between atlas & axis, Gliding joint between carpals, Saddle joint between carpal and metacarpal of thumb); Disorders of musculoskeletal system: Myasthenia gravis (autoimmune attacking neuromuscular junction acetylcholine receptors), Tetany (rapid spasms due to low Ca2+ in body fluids), Muscular dystrophy (progressive degeneration of skeletal muscle, genetic), Arthritis (inflammation of joints), Osteoarthritis (cartilage wear), Rheumatoid arthritis (autoimmune synovial membrane inflammation), Osteoporosis (age-related bone mass decrease due to low estrogen), Gout (inflammation of joints due to accumulation of uric acid crystals)',
        hours: 26,
        weightage: '6%',
        ncertClass: '11th Bio',
        keyConcepts: ['206 Bones Breakdown Table (Axial 80, Appendicular 126)', 'Ribs Classification (True 1-7, False 8-10, Floating 11-12)', 'Synovial Joint Types & NCERT Body Location Examples', 'Musculoskeletal Disorders Pathology (Myasthenia, Tetany, Gout, Osteoporosis)']
      },
      {
        id: 'zoo-11-10',
        title: 'Neural Control and Coordination: Nerve Conduction & Central Nervous System',
        subtopics: 'Human nervous system: Central Nervous System (Brain and Spinal cord) and Peripheral Nervous System (Somatic nervous system and Autonomic nervous system: sympathetic & parasympathetic); Structure of neuron (cell body / cyton, dendrites with Nissl’s granules, axon, axon terminal, synaptic knob with neurotransmitter vesicles); Types of neurons (multipolar in cerebral cortex, bipolar in retina of eye, unipolar in embryonic stage); Myelinated nerve fibres (Schwann cells, myelin sheath, nodes of Ranvier) vs unmyelinated nerve fibres; Conduction of nerve impulse: 1. Resting potential (-70 mV, polarized state, Na+/K+ ATPase pump pumping 3 Na+ out and 2 K+ in, high K+ and organic negative proteins inside, high Na+ outside), 2. Action potential / Nerve impulse (+30 mV, depolarization due to rapid influx of Na+ through voltage-gated Na+ channels), 3. Repolarization (closure of Na+ channels, opening of voltage-gated K+ channels and K+ efflux), 4. Hyperpolarization and refractory period; Transmission of impulses at synapses: Electrical synapse (gap junctions, very fast, rare in humans) vs Chemical synapse (synaptic cleft 20 nm, arrival of action potential, opening of voltage-gated Ca2+ channels, Ca2+ influx causes synaptic vesicles to fuse with presynaptic membrane, neurotransmitter acetylcholine release by exocytosis, binding to specific postsynaptic receptors, opening of ion channels generating excitatory EPSP or inhibitory IPSP); Central Nervous System: Meniges (dura mater, arachnoid mater, pia mater), Forebrain (Cerebrum: cerebral cortex grey matter with sensory, motor and association areas, corpus callosum connecting two cerebral hemispheres; Thalamus sensory relay; Hypothalamus thermoregulation, hunger, thirst, endocrine secretion, limbic system amygdala & hippocampus for emotions, memory & sexual behaviour), Midbrain (corpora quadrigemina 4 round lobes for visual & auditory reflexes, cerebral aqueduct canal), Hindbrain (Pons fibre tracts, Cerebellum convoluted surface for body balance and posture, Medulla oblongata cardiovascular reflexes, respiration, gastric secretions, vomiting centre); Reflex action and Reflex Arc (receptor, afferent sensory neuron, dorsal root ganglion, interneuron in grey matter of spinal cord, efferent motor neuron, ventral root, effector muscle)',
        hours: 30,
        weightage: '7%',
        ncertClass: '11th Bio',
        keyConcepts: ['Resting Potential (-70mV) & Na+/K+ Pump Stoichiometry (3 Na+ out / 2 K+ in)', 'Action Potential Ionic Basis (Na+ Influx -> Depolarisation)', 'Chemical Synapse Ca2+ Role & Neurotransmitter Receptors', 'Brain Functions: Hypothalamus, Corpus Callosum & Medulla Oblongata', 'Reflex Arc Path from Dorsal Root to Ventral Root']
      },
      {
        id: 'zoo-11-11',
        title: 'Chemical Coordination and Integration: Endocrine System & Hormone Mechanisms',
        subtopics: 'Endocrine glands vs exocrine glands; Hormone definitions (intercellular chemical messengers produced in trace amounts); Hypothalamus hormones: Releasing hormones (GnRH, TRH, CRH, GHRH) and Inhibiting hormones (Somatostatin, Dopamine/PIH); Pituitary Gland (Hypophysis): Adenohypophysis (Pars distalis: Growth Hormone GH - gigantism, acromegaly, pituitary dwarfism; Prolactin PRL milk production; Thyroid Stimulating Hormone TSH; Adrenocorticotropic Hormone ACTH; Luteinizing Hormone LH stimulates Leydig cells for androgens in male, triggers ovulation & maintains corpus luteum in female; Follicle Stimulating Hormone FSH spermatogenesis & ovarian follicle growth; Pars intermedia: Melanocyte Stimulating Hormone MSH pigmentation); Neurohypophysis (Pars nervosa: Oxytocin milk ejection & uterine contraction in parturition; Vasopressin / Anti-Diuretic Hormone ADH water reabsorption in DCT, deficiency causes Diabetes Insipidus / polyuria); Pineal Gland (epiphysis): Melatonin (24-hour diurnal circadian rhythm, sleep-wake cycle, body temperature, metabolism, pigmentation, menstrual cycle); Thyroid Gland: Follicular cells produce T4 (tetraiodothyronine/thyroxine) and T3 (triiodothyronine, iodine essential for synthesis; Hypothyroidism causes goitre, cretinism in infants, myxoedema; Hyperthyroidism causes Exophthalmic goitre / Graves’ disease with protruding eyeballs), Parafollicular / C-cells produce Thyrocalcitonin TCT (hypocalcemic hormone, decreases blood Ca2+ by bone deposition); Parathyroid Glands (4 glands): Parathyroid Hormone PTH / Collip’s hormone (hypercalcemic hormone, increases blood Ca2+ by bone resorption/osteolysis, renal Ca2+ reabsorption, intestinal Ca2+ absorption; antagonizes Calcitonin); Thymus Gland: Thymosins (differentiation of T-lymphocytes for Cell-Mediated Immunity, humoral antibody production, degenerates with old age); Adrenal Gland (Suprarenal): Adrenal Cortex (Zona glomerulosa outer: Mineralocorticoids like Aldosterone regulating Na+/K+ water balance; Zona fasciculata middle: Glucocorticoids like Cortisol for gluconeogenesis, lipolysis, anti-inflammatory & immunosuppressive action; Zona reticularis inner: Androgenic corticoids for axial/pubic hair; Deficiency causes Addison’s disease with bronze skin pigmentation, excess causes Cushing’s syndrome); Adrenal Medulla: Catecholamines (Adrenaline / Epinephrine and Noradrenaline / Norepinephrine - emergency fight or flight hormones, increase alertness, pupillary dilation, piloerection, sweating, heartbeat, glycogenolysis); Pancreas (Islets of Langerhans): Alpha cells secrete Glucagon (hyperglycemic hormone, stimulates glycogenolysis & gluconeogenesis), Beta cells secrete Insulin (hypoglycemic hormone, enhances cellular glucose uptake by GLUT-4, glycogenesis; Deficiency causes Diabetes Mellitus with hyperglycemia and glucosuria / ketone bodies), Delta cells secrete Somatostatin; Gonads: Testes Leydig cells produce Androgens (Testosterone development of male secondary sex organs & characters, anabolic effects); Ovaries produce Estrogen (Graafian follicles, female secondary sex characters) and Progesterone (Corpus luteum, maintains pregnancy, alveoli in mammary glands); Hormones of other tissues: Heart wall secretes Atrial Natriuretic Factor ANF (vasodilation, lowers BP), Kidney JG cells secrete Erythropoietin (stimulates erythropoiesis in bone marrow), Gastrointestinal Tract: Gastrin (stimulates HCl & pepsinogen), Secretin (stimulates water & bicarbonate from exocrine pancreas), Cholecystokinin CCK (stimulates pancreatic enzymes & bile juice from gall bladder), Gastric Inhibitory Peptide GIP (inhibits gastric secretion & motility); Mechanism of Hormone Action: 1. Water-soluble peptide/protein hormones (Insulin, Glucagon, Pituitary hormones, Epinephrine) bind to extracellular membrane-bound receptors, generate second messengers (cAMP, IP3, DAG, Ca2+) to amplify biochemical responses, 2. Lipid-soluble steroid hormones (Estrogen, Progesterone, Testosterone, Cortisol, Aldosterone) and Thyroid hormones enter target cells, bind to intracellular nuclear receptors, hormone-receptor complex interacts with genome to alter gene expression & protein synthesis',
        hours: 34,
        weightage: '8%',
        ncertClass: '11th Bio',
        keyConcepts: ['Antagonistic Hormone Pairs: PTH (Hypercalcemic) vs Calcitonin (Hypocalcemic), Insulin vs Glucagon', 'Peptide Hormone Action with Second Messengers (cAMP, IP3) vs Intracellular Steroid Receptors', 'Anterior vs Posterior Pituitary Hormones (Oxytocin & ADH Synthesized in Hypothalamus)', 'Endocrine Disorders Match List: Addison, Cushing, Graves, Cretinism, Diabetes Mellitus vs Insipidus']
      }
    ]
  },

  // ==========================================
  // ZOOLOGY — CLASS 12 (10 CHAPTERS)
  // ==========================================
  {
    id: 'zoo-12',
    subject: 'Zoology',
    subjectCode: 'zoo',
    standard: 'Class 12',
    phase: 'Zoology - Class 12 Reproduction, Evolution, Health & Biotechnology',
    chapters: [
      {
        id: 'zoo-12-01',
        title: 'Human Reproduction: Male & Female Reproductive Systems',
        subtopics: 'Male reproductive system: Scrotum (maintains 2-2.5°C lower temperature for spermatogenesis), Testes (250 testicular lobules, each with 1-3 seminiferous tubules), Seminiferous tubule cells: Male germ cells / spermatogonia and Sertoli cells / nurse cells (nourishment, inhibin secretion), Interstitial / Leydig cells in interstitial spaces (secrete androgens / testosterone); Male accessory ducts: Rete testis, Vasa efferentia, Epididymis (sperm maturation & storage), Vas deferens (ejaculatory duct, urethra); Male accessory glands: Seminal vesicles (fructose, calcium, prostaglandins 60-70% semen), Prostate gland (milky alkaline fluid 20-25%), Bulbourethral / Cowper’s glands (lubrication of penis); External genitalia: Penis (erectile tissue corpora cavernosa & corpus spongiosum, glans penis covered by foreskin/prepuce); Female reproductive system: Ovaries (produce ova and steroid hormones, ovarian stroma peripheral cortex & inner medulla), Female accessory ducts: Fallopian tubes / Oviducts (10-12 cm: Infundibulum with fimbriae collection of ovum, Ampulla site of fertilization, Isthmus), Uterus / Womb (inverted pear shape: Perimetrium external serous, Myometrium thick smooth muscle vigorous contractions in labour, Endometrium glandular vascular lining undergoing cyclical changes in menstrual cycle), Cervix (cervical canal + vagina = birth canal), Vagina; External genitalia / Vulva: Mons pubis, Labia majora, Labia minora, Hymen, Clitoris; Mammary glands: Glandular tissue (15-20 mammary lobes -> mammary alveoli milk secretion -> mammary tubules -> mammary ampulla -> lactiferous duct)',
        hours: 32,
        weightage: '7%',
        ncertClass: '12th Bio',
        keyConcepts: ['Scrotum Thermoregulation Temperature Difference', 'Sertoli vs Leydig Cell Functions & Secretions', 'Fallopian Tube Ampulla as Site of Fertilization', 'Uterus 3 Layers Functions: Myometrium (Contraction) vs Endometrium (Cycle)']
      },
      {
        id: 'zoo-12-02',
        title: 'Human Reproduction: Gametogenesis, Menstrual Cycle & Fertilization',
        subtopics: 'Spermatogenesis: Spermatogonia (2n=46) mitotic multiplication -> Primary spermatocytes (2n=46) Meiosis I -> Secondary spermatocytes (n=23) Meiosis II -> Spermatids (n=23) -> Spermiogenesis (transformation of spermatid to flagellated spermatozoon/sperm) -> Spermiation (release of mature sperm from Sertoli cells into lumen of seminiferous tubules); Structure of mature sperm: Head (haploid nucleus + Acrosome cap with hyaluronidase & proteolytic enzymes), Neck (proximal centriole for first cleavage, distal centriole for axial filament), Middle piece (spiral mitochondria / Nebenkern producing ATP for motility), Tail; Hormonal control of male reproduction: GnRH stimulates anterior pituitary -> LH stimulates Leydig cells to secrete Androgens (stimulate spermatogenesis), FSH stimulates Sertoli cells to secrete factors for spermiogenesis & Inhibin (negative feedback on FSH); Oogenesis: Oogonia (2n=46) formed in fetal ovary (no oogonia added after birth!) -> Primary oocyte (2n=46) arrested at Prophase-I of Meiosis-I surrounded by granulosa cells (Primary follicle -> Secondary follicle with theca -> Tertiary follicle with fluid-filled cavity Antrum and theca interna/externa) -> Primary oocyte completes Meiosis-I just before ovulation forming large Secondary oocyte (n=23) and tiny First Polar Body -> Mature Graafian follicle with Zona pellucida acellular glycoprotein coat; Menstrual Cycle (28-29 days): 1. Menstrual phase (days 1-5, breakdown of endometrium & blood vessels due to progesterone drop), 2. Follicular / Proliferative phase (days 6-13, FSH and LH stimulate follicular growth & estrogen secretion, estrogen regenerates endometrium), 3. Ovulatory phase (day 14, LH Surge induces rupture of Graafian follicle and release of secondary oocyte / Ovulation), 4. Luteal / Secretory phase (days 15-28, ruptured Graafian follicle transforms into Corpus Luteum secreting large amounts of Progesterone to maintain secretory endometrium; if fertilization does not occur, corpus luteum degenerates into Corpus Albicans); Fertilization and Implantation: Capacitation of sperm in female tract, Acrosomal reaction, Binding of sperm to ZP3 receptor on Zona pellucida, Cortical granule reaction (depolarization and cortical granules harden zona pellucida to block polyspermy), Entry of sperm induces secondary oocyte to complete Meiosis-II forming second polar body and haploid ovum / ootid, Syngamy forming diploid Zygote (2n=46); Cleavage: Holoblastic unequal cleavage in fallopian tube (2-cell -> 4-cell -> 8-16 cell solid Morula -> Blastocyst / Blastula with outer Trophoblast and Inner Cell Mass ICM stem cells), Implantation of blastocyst into endometrium on day 6-7 post-fertilization',
        hours: 38,
        weightage: '9%',
        ncertClass: '12th Bio',
        keyConcepts: ['Spermatogenesis vs Oogenesis Timeline, Arrest Points & Polar Bodies', 'Menstrual Cycle Hormone Peaks Graph (Estrogen peak day 12, LH Surge day 14, Progesterone peak day 21)', 'Polyspermy Block Mechanisms (Fast Electrical & Slow Cortical Zona Hardening)', 'Blastocyst Trophoblast (Placenta Precursor) vs Inner Cell Mass (Embryo Proper)']
      },
      {
        id: 'zoo-12-03',
        title: 'Human Reproduction: Pregnancy, Placenta, Parturition & Lactation',
        subtopics: 'Pregnancy: Chorionic villi from trophoblast interdigitate with uterine tissue to form Placenta (structural and functional unit between developing embryo and maternal body); Functions of placenta: transport of nutrients, O2 and waste removal, Endocrine organ producing hormones exclusively during pregnancy: human Chorionic Gonadotropin (hCG - detected in pregnancy test kits), human Placental Lactogen (hPL), Relaxin (secreted by ovary & placenta in late pregnancy), Estrogens and Progestogens; Embryonic development stages: First month heart forms, Second month limbs and digits form, Third month / first trimester major organ systems external genitalia form, Fifth month first fetal movements and appearance of hair on head, Sixth month / second trimester fine body hair, eye-lids separate, eyelashes form, Ninth month full-term fetus ready for delivery; Parturition / Childbirth: Neuroendocrine mechanism / Fetal Ejection Reflex (fully developed fetus and placenta induce mild uterine contractions, triggers release of Oxytocin from maternal posterior pituitary, oxytocin causes stronger uterine contractions in positive feedback loop until baby is delivered through birth canal); Lactation: Mammary glands undergo differentiation under prolactin and human placental lactogen, Colostrum (first yellow milk produced during initial days, rich in IgA antibodies conferring passive immunity to newborn, rich in proteins, low in fat)',
        hours: 22,
        weightage: '5%',
        ncertClass: '12th Bio',
        keyConcepts: ['Hormones Produced Exclusively During Pregnancy (hCG, hPL, Relaxin)', 'Fetal Development Milestones Timeline (Month 1 Heart, Month 5 First Movement)', 'Fetal Ejection Reflex & Oxytocin Positive Feedback Loop', 'Colostrum IgA Antibodies & Passive Immunity']
      },
      {
        id: 'zoo-12-04',
        title: 'Reproductive Health & Population Control',
        subtopics: 'Reproductive health definition (WHO: total well-being in physical, emotional, behavioural and social aspects); Population explosion and causes (decline in death rate, maternal mortality rate MMR, infant mortality rate IMR, increase in reproductive age population); Contraceptive Methods: 1. Natural / Traditional methods: Periodic abstinence (avoiding coitus days 10-17 of cycle), Coitus interruptus / withdrawal, Lactational amenorrhea (absence of menstruation during intense lactation up to 6 months), 2. Barrier methods: Condoms (Nirodh, prevents STIs and AIDS), Diaphragms, Cervical caps and Vaults (reusable, used with spermicidal creams/foams/jellies), 3. Intrauterine Devices (IUDs inserted by doctor in uterus): Non-medicated IUDs (Lippes loop - increases phagocytosis of sperms), Copper-releasing IUDs (CuT, Cu7, Multiload-375 - Cu ions suppress sperm motility and fertilizing capacity), Hormone-releasing IUDs (Progestasert, LNG-20 - make uterus unsuitable for implantation and cervix hostile to sperms, ideal for spacing children), 4. Oral Contraceptive Pills: Combined pills (Progestogen-estrogen combination, inhibit ovulation & implantation), Progestogen-only pills, Saheli (non-steroidal once-a-week pill with high contraceptive value & few side effects, developed by CDRI Lucknow), 5. Injectables and Implants (subcutaneous progestogens under skin, long-term), 6. Emergency contraception (progestogens or progestogen-estrogen combinations or IUDs within 72 hours of unprotected coitus to prevent rape or accidental pregnancy), 7. Surgical methods / Sterilization (terminal method to block gamete transport): Vasectomy in males (cutting and tying of small part of vas deferens through small incision on scrotum, semen has seminal fluid but NO sperms), Tubectomy in females (cutting and tying of small part of fallopian tubes through small incision in abdomen or vagina, highly effective with poor reversibility)',
        hours: 24,
        weightage: '5%',
        ncertClass: '12th Bio',
        keyConcepts: ['IUD Complete Classification & Mechanisms (Non-medicated, Copper, Hormone)', 'Saheli Pill Key Features & CDRI Lucknow Discovery', 'Emergency Contraception 72-Hour Window', 'Vasectomy (Vas Deferens) vs Tubectomy (Fallopian Tube)']
      },
      {
        id: 'zoo-12-05',
        title: 'Reproductive Health: MTP, STIs & Infertility (ART Technologies)',
        subtopics: 'Medical Termination of Pregnancy (MTP / Induced abortion): MTP Act 1971 (amended 2017 & 2021: up to 12 weeks with 1 RMP opinion, 12-20 weeks with 2 RMP opinions for fetal abnormality or rape), safest during first trimester (up to 12 weeks), misuse of amniocentesis for female foeticide and statutory ban on prenatal sex determination; Sexually Transmitted Infections (STIs / Venereal Diseases VD / Reproductive Tract Infections RTI): Bacterial (Gonorrhoea Neisseria gonorrhoeae, Syphilis Treponema pallidum, Chlamydiasis Chlamydia trachomatis), Viral (Genital herpes Herpes simplex virus, Genital warts Human Papilloma Virus HPV, Hepatitis-B, HIV-AIDS - Hepatitis-B, genital herpes and HIV are not completely curable!), Protozoan (Trichomoniasis Trichomonas vaginalis); Infertility: Definition (inability to conceive or produce children even after 2 years of unprotected sexual cohabitation); Assisted Reproductive Technologies (ART): 1. In-Vitro Fertilization (IVF / Test-tube baby programme: fertilization outside body): Zygote Intra-Fallopian Transfer (ZIFT - embryo up to 8 blastomeres transferred into fallopian tube), Intra-Uterine Transfer (IUT - embryo with more than 8 blastomeres transferred into uterus), 2. Gamete Intra-Fallopian Transfer (GIFT - transfer of unfertilized ovum from donor into fallopian tube of female who cannot produce ovum but can provide environment for fertilization), 3. Intra-Cytoplasmic Sperm Injection (ICSI - single sperm directly injected into cytoplasm of ovum in lab), 4. Artificial Insemination (AI) / Intra-Uterine Insemination (IUI - semen collected from husband or healthy donor is artificially introduced into vagina or uterus of female when male partner has low sperm count / oligospermia or inability to inseminate)',
        hours: 24,
        weightage: '5%',
        ncertClass: '12th Bio',
        keyConcepts: ['MTP Legal Amendment Act & Trimester Safety Limits', 'Curable vs Incurable STIs (Hepatitis-B, Genital Herpes, HIV Incurable)', 'ART Selection Logic: ZIFT (<=8 blastomeres) vs IUT (>8 blastomeres) vs GIFT vs ICSI vs IUI', 'Amniocentesis Purpose & Female Foeticide Misuse Ban']
      },
      {
        id: 'zoo-12-06',
        title: 'Evolution: Origin of Life & Evidences for Evolution',
        subtopics: 'Origin of Universe (Big Bang Theory 20 billion years ago); Origin of Earth (4.5 billion years ago, primitive atmosphere was reducing with CH4, NH3, H2O vapour, H2 and NO free O2); Theories of origin of life: Theory of Special Creation, Panspermia / Cosmozoic theory, Theory of Spontaneous Generation / Abiogenesis (disproved by Louis Pasteur swan-neck flask experiment), Oparin-Haldane Theory of Chemical Evolution (abiotic synthesis of organic molecules from inorganic precursors in reducing atmosphere); Urey and Miller Experiment (1953: electric discharge spark in closed flask containing CH4, NH3, H2 in 2:1:2 ratio and water vapour at 800°C, obtained amino acids glycine, alanine, aspartic acid); Evidences for Evolution: 1. Paleontological evidences (fossils in sedimentary rocks, geological time scale: eras, periods, epochs), 2. Comparative anatomy and morphology: Homologous organs (same origin & basic anatomical structure, different functions, divergent evolution: forelimbs of whale, bat, cheetah, human; thorns of Bougainvillea and tendrils of Cucurbita), Analogous organs (different origin & anatomical structure, similar functions, convergent evolution: wings of butterfly and birds, eye of octopus and mammal, flippers of penguins and dolphins, sweet potato root modification and potato stem modification), 3. Biogeographical evidences (adaptive radiation: Darwin’s finches in Galapagos Islands from original seed-eating to vegetarian and insectivorous beaks, Australian marsupials evolving from ancestral stock in isolated continent, placental mammals vs Australian marsupials parallel evolution), 4. Biochemical & Embryological evidences (similarities in proteins, genes, Ernst Haeckel biogenetic law disproved by Karl Ernst von Baer), 5. Evidences from natural selection: Industrial melanism in England peppered moth Biston betularia (white-winged vs dark-winged/melanic moth before and after industrial revolution 1850 vs 1920), evolution of herbicide and pesticide resistance, evolution of antibiotic-resistant bacteria as examples of anthropogenic evolution',
        hours: 32,
        weightage: '7%',
        ncertClass: '12th Bio',
        keyConcepts: ['Miller-Urey Experiment Apparatus, Gas Ratios (CH4:NH3:H2 = 2:1:2) & 800°C Spark', 'Homologous Organs (Divergent Evolution) vs Analogous Organs (Convergent Evolution) NCERT Examples', 'Adaptive Radiation in Darwin’s Finches & Australian Marsupials', 'Industrial Melanism in Peppered Moth & Anthropogenic Selection']
      },
      {
        id: 'zoo-12-07',
        title: 'Evolution: Theories of Evolution, Hardy-Weinberg & Human Evolution',
        subtopics: 'Theories of biological evolution: 1. Lamarckism (Theory of inheritance of acquired characters, use and disuse of organs, giraffe neck example), 2. Darwinism (Theory of Natural Selection: overproduction, struggle for existence, variations, survival of the fittest, natural selection, branching descent and natural selection as two key concepts of Darwinism; Limitations: could not explain origin of variations), 3. Mutation Theory of Hugo de Vries (based on experiments on evening primrose Oenothera lamarckiana: mutations are sudden, random, directionless, discontinuous, single-step large mutation called Saltation causing speciation); Modern Synthetic Theory of Evolution; Hardy-Weinberg Principle: Allele frequencies in a stable population remain constant from generation to generation (Genetic Equilibrium: p² + 2pq + q² = 1 where p = dominant allele frequency, q = recessive allele frequency, p² = homozygous dominant, 2pq = heterozygous, q² = homozygous recessive); Factors affecting Hardy-Weinberg equilibrium: 1. Gene flow / Gene migration, 2. Genetic drift (random change in allele frequencies in small populations due to chance: Founder effect and Bottleneck effect), 3. Mutation, 4. Genetic recombination during meiosis, 5. Natural selection: Stabilizing selection (peak gets higher and narrower, favours mean individuals), Directional selection (peak shifts in one direction, favours one extreme), Disruptive selection (two peaks form at extremes, favours both extreme phenotypes); Origin and Evolution of Man (Chronology & Cranial capacities): Dryopithecus (15 mya, ape-like, hairy, walked like gorillas), Ramapithecus (15 mya, more man-like, hairy), Australopithecus (2 mya in East African grasslands, hunted with stone weapons, ate fruit), Homo habilis (first human-like hominid, tool maker, brain capacity 650-800 cc, did not eat meat), Homo erectus (1.5 mya fossils in Java, brain capacity 900 cc, ate meat), Neanderthal man (100,000 to 40,000 years ago in East and Central Asia, brain capacity 1400 cc, used hides to protect body and buried their dead), Homo sapiens / Modern man (arose in Africa during ice age 75,000-10,000 years ago, prehistoric cave art 18,000 years ago at Bhimbetka, agriculture started 10,000 years ago)',
        hours: 32,
        weightage: '7%',
        ncertClass: '12th Bio',
        keyConcepts: ['Hugo de Vries Mutation (Saltation - Single Step Large Mutation) vs Darwinism', 'Hardy-Weinberg Equation Problem Solving (p + q = 1, p² + 2pq + q² = 1)', 'Natural Selection Types Graphs: Stabilizing, Directional, Disruptive', 'Human Evolution Complete Chronology & Cranial Capacities (Habilis 650-800 cc, Erectus 900 cc, Neanderthal 1400 cc)']
      },
      {
        id: 'zoo-12-08',
        title: 'Human Health and Disease: Infectious Diseases & Pathogens',
        subtopics: 'Health definition (state of complete physical, mental and social well-being); Pathogens and disease transmission: 1. Bacterial diseases: Typhoid fever (Salmonella typhi, enters small intestine through contaminated food & water, symptoms: sustained high fever 39-40°C, weakness, stomach pain, constipation, intestinal perforation in severe cases, Widal test confirmation, classic Mary Mallon case), Pneumonia (Streptococcus pneumoniae and Haemophilus influenzae, infects alveoli which get filled with fluid, symptoms: fever, chills, cough, grey/bluish lips and fingernails, spread by droplets/aerosols); 2. Viral diseases: Common Cold (Rhino viruses, infects nose and respiratory passage but NOT lungs, symptoms: nasal congestion, discharge, sore throat, cough for 3-7 days); 3. Protozoan diseases: Malaria (Plasmodium vivax, P. malariae, P. falciparum malignant and fatal malaria; Life cycle of Plasmodium: Female Anopheles mosquito bites human and injects infectious Sporozoites -> Sporozoites reach liver cells and multiply asexually -> Liver cells burst releasing parasites into red blood cells RBCs -> Parasites reproduce asexually in RBCs, bursting RBCs and releasing toxic substance Haemozoin responsible for chills and high recurring fever every 3-4 days -> Gametocytes develop in RBCs -> Female Anopheles takes up gametocytes with blood meal -> Fertilization and development in mosquito gut -> Mature sporozoites escape gut and migrate to mosquito salivary glands); Amoebiasis / Amoebic dysentery (Entamoeba histolytica in large intestine, symptoms: constipation, abdominal pain, stools with excess mucous and blood clots, houseflies act as mechanical carriers); 4. Fungal diseases: Ringworm (Microsporum, Trichophyton, Epidermophyton, symptoms: dry scaly lesions with intense itching on skin, nails, groin, acquired from soil, towels, clothes); 5. Helminthic diseases: Ascariasis (Ascaris lumbricoides intestinal parasite, symptoms: internal bleeding, muscular pain, fever, anaemia, blockage of intestinal passage, eggs excreted in faeces contaminate soil/water/plants), Filariasis / Elephantiasis (Wuchereria bancrofti and W. malayi, transmitted by female Culex mosquito, chronic inflammation of lymphatic vessels of lower limbs and genital organs)',
        hours: 32,
        weightage: '7%',
        ncertClass: '12th Bio',
        keyConcepts: ['Typhoid Symptoms & Widal Diagnostic Test', 'Plasmodium Complete Life Cycle: Sporozoite -> Liver -> RBC Haemozoin -> Gametocyte -> Mosquito Gut', 'Pneumonia (Alveoli Fluid) vs Common Cold (Upper Respiratory Only)', 'Filariasis Lymphatic Blockage & Culex Vector']
      },
      {
        id: 'zoo-12-09',
        title: 'Human Health and Disease: Immunology, Cancer, AIDS & Drug Abuse',
        subtopics: 'Immunity: 1. Innate Immunity (non-specific, present from birth): Physical barriers (Skin, Mucus coating of respiratory/GI/urogenital tracts), Physiological barriers (Stomach HCl acid, Saliva in mouth, Tears from eyes with lysozyme), Cellular barriers (Polymorphonuclear leucocytes PMNL-neutrophils, Monocytes, Natural Killer NK lymphocytes, Macrophages), Cytokine barriers (Interferons secreted by virus-infected cells to protect non-infected cells); 2. Acquired Immunity (pathogen-specific, memory-based): Primary response (low intensity on first encounter) vs Secondary / Anamnestic response (highly intensified on re-encounter); Humoral immune response (B-lymphocytes produce antibodies into blood/lymph) vs Cell-Mediated Immunity CMI (T-lymphocytes, responsible for Graft rejection in organ transplantation, requires tissue matching & immunosuppressants like Cyclosporin A); Structure of an Antibody molecule: Y-shaped immunoglobulin with 2 heavy (H) and 2 light (L) chains represented as H2L2, antigen-binding variable fragment (Fab) and constant fragment (Fc); Antibody types: IgA (in colostrum & saliva), IgG (most abundant, crosses placenta), IgM (pentamer, first responder), IgE (allergic reactions), IgD; Active vs Passive immunity (active: body produces own antibodies through infection or vaccine; passive: ready-made preformed antibodies transferred, e.g. colostrum IgA, anti-tetanus serum ATS, anti-venom); Vaccination and Immunization; Allergies: exaggerated immune response to allergens (pollen, dust, animal dander) mediated by IgE antibodies, release of histamine and serotonin from mast cells, treated with antihistamines, adrenaline and steroids; Autoimmunity: immune system attacks self-cells (Rheumatoid arthritis, Myasthenia gravis); Immune System in the Body: Primary lymphoid organs (Bone marrow where all blood cells including lymphocytes originate, and Thymus where T-cells mature) vs Secondary lymphoid organs (Spleen reservoir of erythrocytes, Lymph nodes filter microorganisms, Tonsils, Peyer’s patches of small intestine, Appendix, Mucosa-Associated Lymphoid Tissue MALT constituting 50% of lymphoid tissue in human body); AIDS (Acquired Immuno Deficiency Syndrome): Caused by HIV (Human Immunodeficiency Virus, a retrovirus with RNA genome surrounded by protein coat and reverse transcriptase enzyme); Transmission: sexual contact, contaminated blood transfusion, sharing infected needles, mother to fetus; Mechanism of HIV infection: HIV enters Macrophages (acts as HIV factory) -> Viral RNA reverse transcribed into viral DNA by Reverse Transcriptase -> Viral DNA integrates into host genome and directs production of new virus particles -> HIV enters T-helper / CD4 lymphocytes, replicates and destroys them -> Progressive decrease in CD4 T-cells (<200/mm3) -> Patient becomes susceptible to opportunistic infections (Mycobacterium, Toxoplasma, viruses, fungi); Diagnosis: ELISA (Enzyme Linked Immuno Sorbent Assay), confirmation by Western Blot; Prevention & Treatment: NACO (National AIDS Control Organisation), Antiretroviral drugs (reverse transcriptase inhibitors, protease inhibitors only prolong life); Cancer: Uncontrolled mitotic cell division, loss of contact inhibition, forms tumors: Benign (confined to original location) vs Malignant tumors (mass of proliferating neoplastic cells, grow rapidly, invade surrounding tissues, exhibit Metastasis - most feared property where cancer cells detach and spread via blood to distant sites forming secondary tumors); Causes of cancer (Carcinogens: physical X-rays, gamma rays, UV rays; chemical tobacco smoke; biological oncogenic viruses with viral oncogenes, cellular oncogenes / proto-oncogenes activated to oncogenes); Cancer detection and diagnosis (Biopsy and histopathology, blood tests, X-ray radiography, CT computed tomography, MRI magnetic resonance imaging, monoclonal antibodies); Cancer treatment (Surgery, Radiotherapy destroying tumor cells, Chemotherapy with cytotoxic drugs, Immunotherapy using biological response modifiers like alpha-interferon which activates immune system to destroy tumor); Drugs and Alcohol Abuse: Opioids (morphine extracted from latex of poppy plant Papaver somniferum, heroin / smack is diacetylmorphine, depressant slowing body functions, bind to opioid receptors in CNS & GI tract), Cannabinoids (obtained from Cannabis sativa hemp plant inflorescences, marijuana, hashish, charas, ganja, interact with cannabinoid receptors in brain, affect cardiovascular system), Coca alkaloids / Cocaine / Crack (extracted from Erythroxylum coca native to South America, interferes with transport of dopamine neurotransmitter, potent CNS stimulant producing euphoria, hallucinations at high doses), Hallucinogens (Atropa belladonna, Datura, LSD lysergic acid diethylamide), Tobacco (contains nicotine alkaloid stimulating adrenal gland to release adrenaline, increases BP & heart rate, causes lung cancer, oral cancer, bronchitis, emphysema, coronary heart disease, increases CO in blood reducing oxyhaemoglobin), Adolescence, addiction and dependence (withdrawal syndrome: anxiety, shakiness, nausea, sweating on abrupt discontinuation)',
        hours: 42,
        weightage: '10%',
        ncertClass: '12th Bio',
        keyConcepts: ['Innate Immunity 4 Barrier Categories (Interferons as Cytokine Barrier)', 'Cell-Mediated Immunity (T-Cells & Graft Rejection) vs Humoral (B-Cells)', 'Antibody H2L2 Structure & Classes (IgA Colostrum, IgE Allergy, IgG Placental)', 'HIV Replication Cycle in Macrophages & Helper T-Cells', 'Malignant Tumor Metastasis Property & Alpha-Interferon Immunotherapy', 'Opioid (Papaver somniferum) vs Cannabinoid vs Cocaine (Erythroxylum coca) Mechanisms']
      },
      {
        id: 'zoo-12-10',
        title: 'Biotechnology: Principles, Tools & Genetic Engineering Applications',
        subtopics: 'Principles of Biotechnology: Genetic engineering (creation of recombinant DNA rDNA, gene cloning and gene transfer) and Chemical / Bioprocess engineering (maintenance of sterile ambient conditions for growth of desired microbe to manufacture antibiotics, vaccines, enzymes); Tools of Recombinant DNA Technology: 1. Restriction Enzymes (Molecular scissors discovered by Arber, Nathan & Smith; Exonucleases remove nucleotides from ends, Endonucleases make specific cuts within DNA at specific palindromic nucleotide sequences; e.g. EcoRI from Escherichia coli RY13 recognizes 5\'-GAATTC-3\' and cuts between G and A producing sticky single-stranded overhangs); 2. DNA Ligase (Molecular glue joining sticky ends with phosphodiester bonds), 3. DNA Polymerase, 4. Cloning Vectors (Plasmids and Bacteriophages): Key features of cloning vector: (a) Origin of replication (Ori site controls copy number), (b) Selectable markers (identify and eliminate non-transformants, e.g. ampicillin ampR, tetracycline tetR, kanamycin, chloramphenicol resistance genes in pBR322 plasmid vector; Insertional inactivation of beta-galactosidase / lacZ gene: recombinant colonies produce white colonies in presence of chromogenic X-gal substrate, non-recombinants produce blue colonies), (c) Cloning sites (recognition sites for restriction enzymes, e.g. BamHI in tetR, PstI in ampR of pBR322), (d) Vectors for cloning in plants (Ti plasmid of Agrobacterium tumefaciens disarmed) and animals (Disarmed Retroviruses); 5. Competent Host for transformation: Chemical treatment with divalent cation (Ca2+) followed by Heat Shock (42°C then ice), Micro-injection (direct injection of rDNA into nucleus of animal cell), Biolistics / Gene gun (cells bombarded with high velocity micro-particles of gold or tungsten coated with DNA for plant cells); Processes of Recombinant DNA Technology: 1. Isolation of Genetic Material (DNA): Lysis of cells (lysozyme for bacteria, cellulase for plant cells, chitinase for fungi), RNA removal by ribonuclease, protein removal by protease, precipitation of purified DNA by adding chilled ethanol (DNA spooling), 2. Cutting of DNA at specific locations and separation by Agarose Gel Electrophoresis (DNA fragments are negatively charged, migrate toward positive anode, smaller fragments move faster/further, visualized under UV light after staining with Ethidium bromide EtBr as bright orange bands, cutting out bands is Elution), 3. Amplification of Gene of Interest using Polymerase Chain Reaction (PCR developed by Kary Mullis): 3 steps: (a) Denaturation (94-96°C, separating double-stranded DNA), (b) Annealing (50-60°C, two sets of synthetic oligonucleotide primers bind to complementary 3\' ends), (c) Extension (72°C, thermostable Taq DNA Polymerase isolated from bacterium Thermus aquaticus synthesizes new strands using dNTPs, 1 billion copies after 30 cycles), 4. Insertion of rDNA into host, 5. Obtaining the foreign gene product: Bioreactors (large vessels 100-1000 L providing optimal growth conditions: temperature, pH, substrate, oxygen: Simple Stirred-tank bioreactor with agitator vs Sparged stirred-tank bioreactor with sterile air bubbles for increased oxygen transfer surface), 6. Downstream Processing: separation and purification of product, addition of preservatives, clinical trials & quality control testing; Applications of Biotechnology: 1. In Agriculture: Genetically Modified Organisms (GMOs): Bt Cotton (Cry genes from soil bacterium Bacillus thuringiensis produce inactive crystal protoxin proteins CryIAc, CryIIAb controlling cotton bollworms, CryIAb controlling corn borer; in insect alkaline gut, crystal is solubilized, activated toxin binds to midgut epithelial cells, creates pores, cell swelling and lysis killing insect); Pest-resistant plants: RNA interference (RNAi) mechanism in tobacco plants against nematode Meloidogyne incognita (using Agrobacterium vectors, sense and antisense RNA introduced, forming double-stranded dsRNA, cellular machinery Dicer cuts into siRNA, RISC complex silences specific nematode mRNA preventing translation); 2. In Medicine: Genetically Engineered Insulin (Humulin produced by Eli Lilly in 1983: Human insulin has chain A 21 amino acids and chain B 30 amino acids linked by disulphide bonds; synthesized as Pro-insulin with extra C-peptide 33 amino acids which is removed during maturation; Eli Lilly prepared two DNA sequences corresponding to A and B chains, inserted into pBR322 of E. coli, produced chains separately and combined by creating disulphide bonds); Gene Therapy: First clinical gene therapy in 1990 on 4-year-old girl with Adenosine Deaminase (ADA) deficiency causing Severe Combined Immuno-Deficiency SCID: Lymphocytes from patient blood grown in culture, functional ADA cDNA introduced using retroviral vector, infused back; permanent cure if gene introduced into early embryonic cells; Molecular Diagnosis: PCR (early detection of HIV, cancer mutations), ELISA (antigen-antibody interaction), Probe hybridization with radioactive probe; 3. Transgenic Animals: Transgenic mice (95% of all transgenic animals for disease models of cancer, cystic fibrosis, Alzheimer’s), Transgenic cow Rosie (1997: produced human protein-enriched milk 2.4 g/L containing human alpha-lactalbumin for human babies), Alpha-1-antitrypsin production for emphysema treatment; 4. Ethical Issues: GEAC (Genetic Engineering Appraisal Committee in India), Biopiracy (exploitation of bioresources of developing nations without proper authorization or compensatory payment, e.g. patenting of Indian Basmati rice, Neem, Turmeric by foreign corporations)',
        hours: 44,
        weightage: '11%',
        ncertClass: '12th Bio',
        keyConcepts: ['Restriction Enzyme Palindromic Recognition & EcoRI Cleavage', 'pBR322 Vector Plasmid Map (Ori, ampR, tetR, rop) & Insertional Inactivation (Blue-White Screening)', 'Agarose Gel Electrophoresis (Ethidium Bromide Staining & UV Orange Bands)', 'PCR 3 Sequential Steps & Temperatures (Denaturation 94°C, Annealing 54°C, Extension 72°C with Taq Polymerase)', 'Bt Cotton CryIAc & CryIIAb (Bollworms) vs CryIAb (Corn Borer) Specificity', 'Humulin Eli Lilly A & B Chain Synthesis & C-Peptide Absence', 'ADA Deficiency Gene Therapy in 1990 using Retroviral Vector', 'Transgenic Cow Rosie (Human Alpha-Lactalbumin Milk)']
      }
    ]
  }
];

// Helper functions for syllabus queries
function getAllChapters() {
  return NEET_SYLLABUS.flatMap(phase => 
    phase.chapters.map(ch => ({
      ...ch,
      phaseId: phase.id,
      phaseTitle: phase.phase,
      subject: phase.subject,
      subjectCode: phase.subjectCode,
      standard: phase.standard
    }))
  );
}

function getSubjectChapters(subjectCode) {
  return getAllChapters().filter(ch => ch.subjectCode === subjectCode);
}

function getTotalSyllabusHours() {
  return getAllChapters().reduce((acc, ch) => acc + ch.hours, 0);
}
