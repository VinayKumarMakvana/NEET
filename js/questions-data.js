/**
 * NEET UG 2028: High-Yield Question Bank & Director-Level MCQ Engine
 * Standard NTA Pattern with Assertion-Reason, Statement I & II, Match Columns, Diagram Traps & Full NCERT Solutions
 * Fully Bilingual (English & Hindi) for 100% Free Coaching Alternative & Rural Access
 */

const NEET_QUESTIONS = [
  // ==========================================
  // BOTANY — A/R, STATEMENT & HIGH-YIELD PYQs
  // ==========================================
  {
    id: 'q-bot-01',
    subject: 'Botany',
    subjectCode: 'bot',
    chapter: 'Molecular Basis of Inheritance: Transcription, Genetic Code & Translation',
    topicKey: 'replication_ligase',
    questionType: 'statement',
    question: 'Given below are two statements:\nStatement I: The discontinuous fragments of DNA synthesized on the lagging strand are joined by the enzyme DNA ligase.\nStatement II: The replication of DNA in eukaryotes is continuous on both the strands.',
    questionHi: 'नीचे दो कथन दिए गए हैं:\nकथन I: लैगिंग स्ट्रैंड पर संश्लेषित DNA के असतत टुकड़ों (ओकाजाकी खंडों) को DNA लाइगेज एंजाइम द्वारा जोड़ा जाता है।\nकथन II: यूकैरियोट्स में DNA की प्रतिकृति दोनों रज्जुकों पर सतत होती है।',
    options: [
      'Both Statement I and Statement II are correct',
      'Both Statement I and Statement II are incorrect',
      'Statement I is correct but Statement II is incorrect',
      'Statement I is incorrect but Statement II is correct'
    ],
    optionsHi: [
      'कथन I और कथन II दोनों सही हैं',
      'कथन I और कथन II दोनों गलत हैं',
      'कथन I सही है लेकिन कथन II गलत है',
      'कथन I गलत है लेकिन कथन II सही है'
    ],
    correctIndex: 2,
    difficulty: 'Medium',
    pyqYear: 'NEET 2023 / 2024',
    pyqRepeat: 5,
    tag: 'NEET 2024 REPEAT 5x',
    explanation: 'Statement I is correct: DNA ligase joins Okazaki fragments on the lagging strand by forming phosphodiester bonds. Statement II is incorrect: In both prokaryotes and eukaryotes, replication is semidiscontinuous — continuous on the leading strand (3\' -> 5\' template) and discontinuous on the lagging strand (5\' -> 3\' template).',
    explanationHi: 'कथन I सही है: DNA लाइगेज फॉस्फोडिएस्टर बंध बनाकर ओकाजाकी खंडों को जोड़ता है। कथन II गलत है: प्रतिकृति अर्ध-असतत (semidiscontinuous) होती है — लीडिंग स्ट्रैंड पर सतत और लैगिंग स्ट्रैंड पर असतत।',
    ncertRef: 'NCERT Class 12, Chapter 6, Page 106'
  },
  {
    id: 'q-bot-02',
    subject: 'Botany',
    subjectCode: 'bot',
    chapter: 'Cell Cycle and Cell Division',
    topicKey: 's_phase_chromosomes',
    questionType: 'assertion-reason',
    question: 'Assertion (A): During the S phase of interphase, the amount of DNA per cell doubles from 2C to 4C.\nReason (R): During the S phase, the chromosome number is also doubled from 2n to 4n.',
    questionHi: 'अभिकथन (A): अंतरावस्था की S प्रावस्था के दौरान, प्रति कोशिका DNA की मात्रा 2C से बढ़कर 4C (दोगुनी) हो जाती है।\nकारण (R): S प्रावस्था के दौरान, गुणसूत्रों की संख्या भी 2n से बढ़कर 4n (दोगुनी) हो जाती है।',
    options: [
      'Both (A) and (R) are true and (R) is the correct explanation of (A)',
      'Both (A) and (R) are true but (R) is NOT the correct explanation of (A)',
      '(A) is true but (R) is false',
      'Both (A) and (R) are false'
    ],
    optionsHi: [
      '(A) और (R) दोनों सही हैं और (R), (A) की सही व्याख्या है',
      '(A) और (R) दोनों सही हैं लेकिन (R), (A) की सही व्याख्या नहीं है',
      '(A) सही है लेकिन (R) गलत है',
      '(A) और (R) दोनों गलत हैं'
    ],
    correctIndex: 2,
    difficulty: 'Hard',
    pyqYear: 'NEET 2022 / 2023',
    pyqRepeat: 4,
    tag: 'NEET 2023 REPEAT 4x',
    explanation: 'Assertion is TRUE: In S phase, DNA replication doubles the DNA content from 2C to 4C. Reason is FALSE: The chromosome number remains strictly constant (2n remains 2n because sister chromatids remain attached at a single centromere until anaphase).',
    explanationHi: 'अभिकथन (A) सत्य है: S प्रावस्था में DNA की मात्रा 2C से 4C हो जाती है। कारण (R) असत्य है: गुणसूत्रों की संख्या नियत रहती है (2n ही रहती है, 4n नहीं होती)।',
    ncertRef: 'NCERT Class 11, Chapter 10, Page 163'
  },
  {
    id: 'q-bot-03',
    subject: 'Botany',
    subjectCode: 'bot',
    chapter: 'Photosynthesis in Higher Plants',
    topicKey: 'c4_pep_rubisco',
    questionType: 'statement',
    question: 'Given below are two statements regarding C4 plants:\nStatement I: Primary CO2 acceptor in C4 plants is Phosphoenolpyruvate (PEP) and is present in mesophyll cells.\nStatement II: Mesophyll cells of C4 plants lack the RuBisCO enzyme.',
    questionHi: 'C4 पादपों के संबंध में नीचे दो कथन दिए गए हैं:\nकथन I: C4 पादपों में प्राथमिक CO2 ग्राही फॉस्फोइनोलपायरूवेट (PEP) होता है जो पर्णमध्योतक (mesophyll) कोशिकाओं में उपस्थित होता है।\nकथन II: C4 पादपों की पर्णमध्योतक कोशिकाओं में RuBisCO एंजाइम का अभाव होता है।',
    options: [
      'Both Statement I and Statement II are correct',
      'Both Statement I and Statement II are incorrect',
      'Statement I is correct but Statement II is incorrect',
      'Statement I is incorrect but Statement II is correct'
    ],
    optionsHi: [
      'कथन I और कथन II दोनों सही हैं',
      'कथन I और कथन II दोनों गलत हैं',
      'कथन I सही है लेकिन कथन II गलत है',
      'कथन I गलत है लेकिन कथन II सही है'
    ],
    correctIndex: 0,
    difficulty: 'Medium',
    pyqYear: 'NEET 2021 / 2024',
    pyqRepeat: 6,
    tag: 'NEET 2024 REPEAT 6x',
    explanation: 'Both statements are 100% correct! In C4 plants, PEP (3C) is the primary CO2 acceptor catalyzed by PEP carboxylase in mesophyll cells. Mesophyll cells lack RuBisCO; RuBisCO is concentrated exclusively in the bundle sheath cells where photorespiration is minimized.',
    explanationHi: 'दोनों कथन 100% सही हैं! C4 पादपों में PEP प्राथमिक CO2 ग्राही है। मेसोफिल कोशिकाओं में RuBisCO नहीं होता, बल्कि यह पूलाच्छद (bundle sheath) कोशिकाओं में पाया जाता है।',
    ncertRef: 'NCERT Class 11, Chapter 13, Page 218'
  },
  {
    id: 'q-bot-04',
    subject: 'Botany',
    subjectCode: 'bot',
    chapter: 'Sexual Reproduction in Flowering Plants',
    topicKey: 'pen_triple_fusion',
    questionType: 'assertion-reason',
    question: 'Assertion (A): In angiosperms, the primary endosperm nucleus (PEN) is triploid (3n).\nReason (R): PEN is formed by the fusion of one haploid male gamete with two haploid polar nuclei in the central cell (triple fusion).',
    questionHi: 'अभिकथन (A): आवृतबीजी (angiosperms) पादपों में प्राथमिक भ्रूणपोष केंद्रक (PEN) त्रिगुणित (3n) होता है।\nकारण (R): PEN का निर्माण केंद्रीय कोशिका में एक अगुणित नर युग्मक और दो अगुणित ध्रुवीय केंद्रकों के संलयन (त्रिसंलयन) द्वारा होता है।',
    options: [
      'Both (A) and (R) are true and (R) is the correct explanation of (A)',
      'Both (A) and (R) are true but (R) is NOT the correct explanation of (A)',
      '(A) is true but (R) is false',
      'Both (A) and (R) are false'
    ],
    optionsHi: [
      '(A) और (R) दोनों सही हैं और (R), (A) की सही व्याख्या है',
      '(A) और (R) दोनों सही हैं लेकिन (R), (A) की सही व्याख्या नहीं है',
      '(A) सही है लेकिन (R) गलत है',
      '(A) और (R) दोनों गलत हैं'
    ],
    correctIndex: 0,
    difficulty: 'Easy',
    pyqYear: 'NEET 2020 / 2023',
    pyqRepeat: 4,
    tag: 'NEET 2023 REPEAT 4x',
    explanation: 'Both Assertion and Reason are true, and (R) correctly explains (A). Triple fusion involves 1 male gamete (n) + central cell with 2 polar nuclei (n+n = 2n) = 3n primary endosperm nucleus.',
    explanationHi: 'अभिकथन और कारण दोनों सही हैं और कारण सही व्याख्या करता है। त्रिसंलयन (Triple fusion): 1 नर युग्मक (n) + 2 ध्रुवीय केंद्रक (2n) = 3n PEN।',
    ncertRef: 'NCERT Class 12, Chapter 2, Page 34'
  },
  {
    id: 'q-bot-05',
    subject: 'Botany',
    subjectCode: 'bot',
    chapter: 'Morphology of Flowering Plants',
    topicKey: 'placentation_types',
    questionType: 'match',
    question: 'Match List-I (Placentation type) with List-II (NCERT Examples):\nList-I:\n(A) Marginal\n(B) Axile\n(C) Parietal\n(D) Free central\n\nList-II:\n(I) Mustard, Argemone\n(II) Dianthus, Primrose\n(III) Pea\n(IV) China rose, Tomato, Lemon',
    questionHi: 'सूची-I (बीजांडन्यास प्रकार) को सूची-II (NCERT उदाहरण) से सुमेलित कीजिए:\nसूची-I:\n(A) सीमांत (Marginal)\n(B) स्तंभीय (Axile)\n(C) भित्तीय (Parietal)\n(D) मुक्त स्तंभीय (Free central)\n\nसूची-II:\n(I) सरसों, आर्जिमोन\n(II) डायन्थस, प्रिमरोज\n(III) मटर\n(IV) गुड़हल, टमाटर, नींबू',
    options: [
      'A-III, B-IV, C-I, D-II',
      'A-III, B-I, C-IV, D-II',
      'A-I, B-II, C-III, D-IV',
      'A-IV, B-III, C-II, D-I'
    ],
    optionsHi: [
      'A-III, B-IV, C-I, D-II',
      'A-III, B-I, C-IV, D-II',
      'A-I, B-II, C-III, D-IV',
      'A-IV, B-III, C-II, D-I'
    ],
    correctIndex: 0,
    difficulty: 'Medium',
    pyqYear: 'NEET 2021 / 2023',
    pyqRepeat: 5,
    tag: 'NEET 2023 REPEAT 5x',
    explanation: 'Correct NCERT Matching: Marginal -> Pea; Axile -> China rose, Tomato, Lemon; Parietal -> Mustard, Argemone (with false septum / replum); Free central -> Dianthus, Primrose.',
    explanationHi: 'सही NCERT मिलान: सीमांत -> मटर; स्तंभीय -> गुड़हल, टमाटर, नींबू; भित्तीय -> सरसों, आर्जिमोन (कूट पट के साथ); मुक्त स्तंभीय -> डायन्थस, प्रिमरोज।',
    ncertRef: 'NCERT Class 11, Chapter 5, Page 75'
  },
  {
    id: 'q-bot-06',
    subject: 'Botany',
    subjectCode: 'bot',
    chapter: 'Principles of Inheritance and Variation',
    topicKey: 'linkage_morgan_drosophila',
    questionType: 'statement',
    question: 'Given below are two statements regarding Morgan\'s dihybrid cross in Drosophila:\nStatement I: Genes for yellow body and white eyes were very tightly linked and showed only 1.3% recombination.\nStatement II: Genes for white eyes and miniature wings showed 37.2% recombination because they were located on different chromosomes.',
    questionHi: 'ड्रोसोफिला में मॉर्गन के द्विसंकर संकरण के संबंध में नीचे दो कथन दिए गए हैं:\nकथन I: पीले शरीर और सफेद आंखों के जीन अत्यधिक मजबूती से सहलग्न थे और केवल 1.3% पुनर्योजन दर्शाया।\nकथन II: सफेद आंखों और लघु पंखों के जीन ने 37.2% पुनर्योजन दर्शाया क्योंकि वे अलग-अलग गुणसूत्रों पर स्थित थे।',
    options: [
      'Both Statement I and Statement II are correct',
      'Statement I is correct but Statement II is incorrect',
      'Statement I is incorrect but Statement II is correct',
      'Both Statement I and Statement II are incorrect'
    ],
    optionsHi: [
      'कथन I और कथन II दोनों सही हैं',
      'कथन I सही है लेकिन कथन II गलत है',
      'कथन I गलत है लेकिन कथन II सही है',
      'कथन I और कथन II दोनों गलत हैं'
    ],
    correctIndex: 1,
    difficulty: 'Hard',
    pyqYear: 'NEET 2022 / 2024',
    pyqRepeat: 4,
    tag: 'NEET 2024 REPEAT 4x',
    explanation: 'Statement I is correct (1.3% recombination for y and w). Statement II is INCORRECT because both genes (w and m) are located on the same X chromosome, but are loosely linked due to greater physical distance between them, resulting in 37.2% recombination.',
    explanationHi: 'कथन I सही है (y और w के लिए 1.3% पुनर्योजन)। कथन II गलत है क्योंकि दोनों जीन एक ही X गुणसूत्र पर स्थित थे, लेकिन उनके बीच की दूरी अधिक होने के कारण 37.2% पुनर्योजन हुआ।',
    ncertRef: 'NCERT Class 12, Chapter 5, Page 83'
  },
  {
    id: 'q-bot-07',
    subject: 'Botany',
    subjectCode: 'bot',
    chapter: 'Anatomy of Flowering Plants',
    topicKey: 'secondary_growth_bark',
    questionType: 'assertion-reason',
    question: 'Assertion (A): Bark is a non-technical term that refers to all tissues exterior to the vascular cambium.\nReason (R): Bark includes secondary phloem, phelloderm, phellogen, and phellem.',
    questionHi: 'अभिकथन (A): छाल (Bark) एक गैर-तकनीकी शब्द है जो संवहन एधा (vascular cambium) के बाहर स्थित सभी ऊतकों को संदर्भित करता है।\nकारण (R): छाल में द्वितीयक फ्लोएम, काग-स्तर (phelloderm), काग-एधा (phellogen) और काग (phellem) शामिल हैं।',
    options: [
      'Both (A) and (R) are true and (R) is the correct explanation of (A)',
      'Both (A) and (R) are true but (R) is NOT the correct explanation of (A)',
      '(A) is true but (R) is false',
      'Both (A) and (R) are false'
    ],
    optionsHi: [
      '(A) और (R) दोनों सही हैं और (R), (A) की सही व्याख्या है',
      '(A) और (R) दोनों सही हैं लेकिन (R), (A) की सही व्याख्या नहीं है',
      '(A) सही है लेकिन (R) गलत है',
      '(A) और (R) दोनों गलत हैं'
    ],
    correctIndex: 0,
    difficulty: 'Medium',
    pyqYear: 'NEET 2021 / 2023',
    pyqRepeat: 3,
    tag: 'NEET 2023 REPEAT 3x',
    explanation: 'Both Assertion and Reason are true: Bark = Periderm (Phellem + Phellogen + Phelloderm) + Secondary Phloem. All of these lie exterior to the vascular cambium.',
    explanationHi: 'अभिकथन और कारण दोनों सत्य हैं: छाल = परित्वक (फेलम + फेलोजेन + फेलोडर्म) + द्वितीयक फ्लोएम। ये सभी संवहन एधा के बाहर स्थित होते हैं।',
    ncertRef: 'NCERT Class 11, Chapter 6, Page 96'
  },
  {
    id: 'q-bot-08',
    subject: 'Botany',
    subjectCode: 'bot',
    chapter: 'Respiration in Plants',
    topicKey: 'ets_complexes_cytochrome',
    questionType: 'match',
    question: 'Match Complex of Mitochondrial ETS with its Component:\nList-I:\n(A) Complex I\n(B) Complex II\n(C) Complex III\n(D) Complex IV\n\nList-II:\n(I) Cytochrome c oxidase (Cyt a, a3, 2 Cu centres)\n(II) Cytochrome bc1 complex\n(III) Succinate dehydrogenase (FADH2)\n(IV) NADH dehydrogenase (FMN, Fe-S)',
    questionHi: 'माइटोकॉन्ड्रियल ETS के संकुलों को उनके घटकों से सुमेलित कीजिए:\nसूची-I:\n(A) संकुल I (Complex I)\n(B) संकुल II (Complex II)\n(C) संकुल III (Complex III)\n(D) संकुल IV (Complex IV)\n\nसूची-II:\n(I) साइटोक्रोम c ऑक्सीडेज (Cyt a, a3, 2 Cu केंद्र)\n(II) साइटोक्रोम bc1 संकुल\n(III) सक्सीनेट डिहाइड्रोजनेज (FADH2)\n(IV) NADH डिहाइड्रोजनेज (FMN, Fe-S)',
    options: [
      'A-IV, B-III, C-II, D-I',
      'A-III, B-IV, C-I, D-II',
      'A-IV, B-II, C-III, D-I',
      'A-I, B-II, C-III, D-IV'
    ],
    optionsHi: [
      'A-IV, B-III, C-II, D-I',
      'A-III, B-IV, C-I, D-II',
      'A-IV, B-II, C-III, D-I',
      'A-I, B-II, C-III, D-IV'
    ],
    correctIndex: 0,
    difficulty: 'Hard',
    pyqYear: 'NEET 2020 / 2024',
    pyqRepeat: 5,
    tag: 'NEET 2024 REPEAT 5x',
    explanation: 'Complex I = NADH dehydrogenase; Complex II = Succinate dehydrogenase; Complex III = Cytochrome bc1; Complex IV = Cytochrome c oxidase (contains cytochromes a and a3, and two copper centers).',
    explanationHi: 'संकुल I = NADH डिहाइड्रोजनेज; संकुल II = सक्सीनेट डिहाइड्रोजनेज; संकुल III = साइटोक्रोम bc1; संकुल IV = साइटोक्रोम c ऑक्सीडेज।',
    ncertRef: 'NCERT Class 11, Chapter 14, Page 233'
  },

  // ==========================================
  // ZOOLOGY — A/R, STATEMENT & HIGH-YIELD PYQs
  // ==========================================
  {
    id: 'q-zoo-01',
    subject: 'Zoology',
    subjectCode: 'zoo',
    chapter: 'Human Reproduction: Gametogenesis & Fertilization',
    topicKey: 'corpus_luteum_progesterone',
    questionType: 'assertion-reason',
    question: 'Assertion (A): Corpus luteum secretes large amounts of progesterone which is essential for maintenance of the endometrium.\nReason (R): In the absence of fertilization, corpus luteum degenerates into corpus albicans, causing disintegration of endometrium and leading to menstruation.',
    questionHi: 'अभिकथन (A): कॉर्पस ल्यूटियम भारी मात्रा में प्रोजेस्टेरोन का स्राव करता है जो गर्भाशय के एंडोमेट्रियम के रखरखाव के लिए आवश्यक है।\nकारण (R): निषेचन न होने की स्थिति में, कॉर्पस ल्यूटियम विघटित होकर कॉर्पस एल्बिकैन्स में बदल जाता है, जिससे एंडोमेट्रियम टूटता है और आर्तव चक्र (menstruation) होता है।',
    options: [
      'Both (A) and (R) are true and (R) is the correct explanation of (A)',
      'Both (A) and (R) are true but (R) is NOT the correct explanation of (A)',
      '(A) is true but (R) is false',
      'Both (A) and (R) are false'
    ],
    optionsHi: [
      '(A) और (R) दोनों सही हैं और (R), (A) की सही व्याख्या है',
      '(A) और (R) दोनों सही हैं लेकिन (R), (A) की सही व्याख्या नहीं है',
      '(A) सही है लेकिन (R) गलत है',
      '(A) और (R) दोनों गलत हैं'
    ],
    correctIndex: 1,
    difficulty: 'Medium',
    pyqYear: 'NEET 2021 / 2024',
    pyqRepeat: 5,
    tag: 'NEET 2024 REPEAT 5x',
    explanation: 'Both statements are true. However, Reason describes the consequence of non-fertilization rather than explaining the physiological mechanism of why progesterone is required to maintain the secretory endometrium for implantation.',
    explanationHi: 'दोनों कथन सत्य हैं। लेकिन कारण (R) निषेचन न होने के परिणाम का वर्णन करता है, यह इस बात की व्याख्या नहीं करता कि प्रोजेस्टेरोन एंडोमेट्रियम को कैसे बनाए रखता है।',
    ncertRef: 'NCERT Class 12, Chapter 3, Page 51'
  },
  {
    id: 'q-zoo-02',
    subject: 'Zoology',
    subjectCode: 'zoo',
    chapter: 'Biotechnology: Principles and Processes',
    topicKey: 'ecori_palindrome',
    questionType: 'statement',
    question: 'Given below are two statements regarding restriction endonucleases:\nStatement I: EcoRI cuts the DNA strand between bases G and A only when the sequence 5\'-GAATTC-3\' is present.\nStatement II: Restriction endonucleases inspect the length of DNA and bind to specific recognition palindromic sequences to cut both strands of the double helix at their sugar-phosphate backbones.',
    questionHi: 'प्रतिबंधन एंडोन्यूक्लिएज (restriction endonuclease) के संबंध में नीचे दो कथन दिए गए हैं:\nकथन I: EcoRI डीएनए रज्जुक को G और A क्षारों के बीच केवल तभी काटता है जब 5\'-GAATTC-3\' अनुक्रम उपस्थित हो।\nकथन II: प्रतिबंधन एंडोन्यूक्लिएज डीएनए की लंबाई का निरीक्षण करते हैं और विशिष्ट पैलिंड्रोमिक पहचान अनुक्रमों से जुड़कर शर्करा-फॉस्फेट रीढ़ पर दोनों रज्जुकों को काटते हैं।',
    options: [
      'Both Statement I and Statement II are correct',
      'Both Statement I and Statement II are incorrect',
      'Statement I is correct but Statement II is incorrect',
      'Statement I is incorrect but Statement II is correct'
    ],
    optionsHi: [
      'कथन I और कथन II दोनों सही हैं',
      'कथन I और कथन II दोनों गलत हैं',
      'कथन I सही है लेकिन कथन II गलत है',
      'कथन I गलत है लेकिन कथन II सही है'
    ],
    correctIndex: 0,
    difficulty: 'Easy',
    pyqYear: 'NEET 2023 / 2024',
    pyqRepeat: 6,
    tag: 'NEET 2024 REPEAT 6x',
    explanation: 'Both statements are 100% accurate from NCERT. EcoRI recognizes 5\'-GAATTC-3\' (and 3\'-CTTAAG-5\') and cuts between G and A on both strands, creating sticky single-stranded overhangs.',
    explanationHi: 'दोनों कथन NCERT के अनुसार 100% सही हैं। EcoRI पैलिंड्रोम 5\'-GAATTC-3\' को पहचानता है और G तथा A के बीच कट लगाता है।',
    ncertRef: 'NCERT Class 12, Chapter 11, Page 196'
  },
  {
    id: 'q-zoo-03',
    subject: 'Zoology',
    subjectCode: 'zoo',
    chapter: 'Breathing and Exchange of Gases',
    topicKey: 'oxygen_dissociation_curve',
    questionType: 'mcq',
    question: 'Which of the following factors shifts the Oxygen-Hemoglobin dissociation curve to the RIGHT (promoting oxygen unloading at tissues)?',
    questionHi: 'निम्नलिखित में से कौन से कारक ऑक्सीजन-हीमोग्लोबिन वियोजन वक्र को दाईं ओर (RIGHT) विस्थापित करते हैं (ऊतकों पर ऑक्सीजन मुक्त करने को बढ़ावा देते हैं)?',
    options: [
      'High pO2, Low pCO2, Low H+ concentration, Low temperature',
      'Low pO2, High pCO2, High H+ concentration (low pH), High temperature',
      'High pO2, High pCO2, Low H+ concentration, Low temperature',
      'Low pO2, Low pCO2, Low H+ concentration, High temperature'
    ],
    optionsHi: [
      'उच्च pO2, निम्न pCO2, कम H+ सांद्रता, कम तापमान',
      'कम pO2, उच्च pCO2, उच्च H+ सांद्रता (कम pH), उच्च तापमान',
      'उच्च pO2, उच्च pCO2, कम H+ सांद्रता, कम तापमान',
      'कम pO2, कम pCO2, कम H+ सांद्रता, उच्च तापमान'
    ],
    correctIndex: 1,
    difficulty: 'Medium',
    pyqYear: 'NEET 2019 / 2023',
    pyqRepeat: 7,
    tag: 'NEET 2023 REPEAT 7x',
    explanation: 'Shift to RIGHT (Bohr Effect / Tissue Level) occurs due to: Low pO2, High pCO2, High H+ (low pH), High Temperature, and higher 2,3-BPG. This decreases hemoglobin affinity for oxygen and facilitates delivery to metabolically active tissues.',
    explanationHi: 'दाईं ओर विस्थापन (बोहर प्रभाव / ऊतक स्तर): कम pO2, उच्च pCO2, अधिक H+ आयन (कम pH) और उच्च तापमान के कारण होता है, जिससे हीमोग्लोबिन से ऑक्सीजन आसानी से अलग हो जाती है।',
    ncertRef: 'NCERT Class 11, Chapter 17, Page 274'
  },
  {
    id: 'q-zoo-04',
    subject: 'Zoology',
    subjectCode: 'zoo',
    chapter: 'Chemical Coordination and Integration',
    topicKey: 'hormones_mechanism_ip3',
    questionType: 'statement',
    question: 'Given below are two statements:\nStatement I: Steroid hormones and iodothyronines interact with intracellular receptors and regulate gene expression.\nStatement II: Peptide hormones (e.g. Insulin, Glucagon, FSH) interact with membrane-bound receptors and generate second messengers like cAMP, IP3, and Ca2+.',
    questionHi: 'नीचे दो कथन दिए गए हैं:\nकथन I: स्टेरॉयड हार्मोन और आयोडोथायरोनिन अंतःकोशिकीय ग्राही (intracellular receptors) के साथ परस्पर क्रिया करते हैं और जीन अभिव्यक्ति को नियंत्रित करते हैं।\nकथन II: पेप्टाइड हार्मोन (उदा. इंसुलिन, ग्लूकागन, FSH) झिल्ली-बद्ध ग्राहियों से जुड़ते हैं और द्वितीयक संदेशवाहक जैसे cAMP, IP3 व Ca2+ उत्पन्न करते हैं।',
    options: [
      'Both Statement I and Statement II are correct',
      'Both Statement I and Statement II are incorrect',
      'Statement I is correct but Statement II is incorrect',
      'Statement I is incorrect but Statement II is correct'
    ],
    optionsHi: [
      'कथन I और कथन II दोनों सही हैं',
      'कथन I और कथन II दोनों गलत हैं',
      'कथन I सही है लेकिन कथन II गलत है',
      'कथन I गलत है लेकिन कथन II सही है'
    ],
    correctIndex: 0,
    difficulty: 'Medium',
    pyqYear: 'NEET 2020 / 2024',
    pyqRepeat: 4,
    tag: 'NEET 2024 REPEAT 4x',
    explanation: 'Both statements are true. Water-soluble peptide hormones cannot cross the lipid bilayer, so they generate secondary messengers (cAMP, IP3, Ca2+). Lipid-soluble steroids (estrogen, progesterone, cortisol) cross membranes to bind nuclear receptors directly.',
    explanationHi: 'दोनों कथन सत्य हैं। जल-घुलनशील पेप्टाइड हार्मोन लिपिड झिल्ली को पार नहीं कर सकते, इसलिए द्वितीयक संदेशवाहक उत्पन्न करते हैं। स्टेरॉयड सीधे केंद्रक ग्राहियों से जुड़ते हैं।',
    ncertRef: 'NCERT Class 11, Chapter 22, Page 340'
  },
  {
    id: 'q-zoo-05',
    subject: 'Zoology',
    subjectCode: 'zoo',
    chapter: 'Evolution',
    topicKey: 'hardy_weinberg_equilibrium',
    questionType: 'mcq',
    question: 'In a population in Hardy-Weinberg equilibrium, the frequency of a recessive allele (a) is 0.4. What is the percentage of heterozygous carriers (Aa) in the population?',
    questionHi: 'हार्डी-वेनबर्ग साम्यावस्था वाली एक समष्टि में, एक अप्रभावी युग्मविकल्पी (a) की आवृत्ति 0.4 है। समष्टि में विषमयुग्मजी वाहकों (Aa) का प्रतिशत क्या है?',
    options: [
      '16%',
      '36%',
      '48%',
      '24%'
    ],
    optionsHi: [
      '16%',
      '36%',
      '48%',
      '24%'
    ],
    correctIndex: 2,
    difficulty: 'Medium',
    pyqYear: 'NEET 2022 / 2024',
    pyqRepeat: 5,
    tag: 'NEET 2024 REPEAT 5x',
    explanation: 'Given q = 0.4. Since p + q = 1, p = 1 - 0.4 = 0.6. Heterozygote frequency (Aa) = 2pq = 2 * (0.6) * (0.4) = 0.48 = 48%.',
    explanationHi: 'दिया गया है q = 0.4। चूंकि p + q = 1, इसलिए p = 0.6। विषमयुग्मजी (Aa) की आवृत्ति = 2pq = 2 × 0.6 × 0.4 = 0.48 यानी 48%।',
    ncertRef: 'NCERT Class 12, Chapter 7, Page 136'
  },
  {
    id: 'q-zoo-06',
    subject: 'Zoology',
    subjectCode: 'zoo',
    chapter: 'Excretory Products and their Elimination',
    topicKey: 'raas_juxtaglomerular',
    questionType: 'assertion-reason',
    question: 'Assertion (A): Renin-Angiotensin-Aldosterone System (RAAS) increases blood pressure and GFR.\nReason (R): Angiotensin II is a powerful vasodilator and stimulates adrenal cortex to release atrial natriuretic factor (ANF).',
    questionHi: 'अभिकथन (A): रेनिन-एंजियोटेंसिन-एल्डोस्टेरोन तंत्र (RAAS) रक्तचाप और GFR को बढ़ाता है।\nकारण (R): एंजियोटेंसिन II एक शक्तिशाली वाहिकाविस्फारक (vasodilator) है और अलिंद नैट्रियूरेटिक कारक (ANF) स्रावित करने के लिए अधिवृक्क वल्कुट को उत्तेजित करता है।',
    options: [
      'Both (A) and (R) are true and (R) is the correct explanation of (A)',
      'Both (A) and (R) are true but (R) is NOT the correct explanation of (A)',
      '(A) is true but (R) is false',
      'Both (A) and (R) are false'
    ],
    optionsHi: [
      '(A) और (R) दोनों सही हैं और (R), (A) की सही व्याख्या है',
      '(A) और (R) दोनों सही हैं लेकिन (R), (A) की सही व्याख्या नहीं है',
      '(A) सही है लेकिन (R) गलत है',
      '(A) और (R) दोनों गलत हैं'
    ],
    correctIndex: 2,
    difficulty: 'Hard',
    pyqYear: 'NEET 2021 / 2023',
    pyqRepeat: 4,
    tag: 'NEET 2023 REPEAT 4x',
    explanation: 'Assertion is TRUE: RAAS increases blood volume, BP and GFR. Reason is completely FALSE: Angiotensin II is a powerful VASOCONSTRICTOR (not vasodilator) and stimulates adrenal cortex to release ALDOSTERONE (not ANF; ANF is released by heart atria and is an antagonist to RAAS).',
    explanationHi: 'अभिकथन सत्य है। कारण पूरी तरह असत्य है: एंजियोटेंसिन II एक शक्तिशाली वाहिका-संकीर्णक (vasoconstrictor) है और एल्डोस्टेरोन जारी करवाता है (ANF नहीं)।',
    ncertRef: 'NCERT Class 11, Chapter 19, Page 297'
  },

  // ==========================================
  // PHYSICS — A/R, FORMULA TRAPS & NUMERICALS
  // ==========================================
  {
    id: 'q-phy-01',
    subject: 'Physics',
    subjectCode: 'phy',
    chapter: 'Current Electricity: Ohm\'s Law, Drift Velocity & Kirchhoff\'s Rules',
    topicKey: 'drift_velocity_cross_section',
    questionType: 'mcq',
    question: 'A steady current flows through a metallic conductor of non-uniform cross-section. Which of the following quantities remains CONSTANT along the entire length of the conductor?',
    questionHi: 'असमान अनुप्रस्थ काट वाले एक धात्विक चालक में से स्थिर विद्युत धारा प्रवाहित हो रही है। चालक की पूरी लंबाई के अनुदिश निम्नलिखित में से कौन सी राशि नियत (CONSTANT) रहती है?',
    options: [
      'Current density (J)',
      'Electric field (E)',
      'Drift speed (vd)',
      'Electric current (I)'
    ],
    optionsHi: [
      'धारा घनत्व (J)',
      'विद्युत क्षेत्र (E)',
      'अपवाह वेग (vd)',
      'विद्युत धारा (I)'
    ],
    correctIndex: 3,
    difficulty: 'Medium',
    pyqYear: 'NEET 2018 / 2023',
    pyqRepeat: 5,
    tag: 'NEET 2023 REPEAT 5x',
    explanation: 'By conservation of charge, steady Electric Current I is identical across every cross-section. Current density J = I/A, Electric field E = J/sigma, and drift velocity vd = I/(n e A) all vary inversely with cross-sectional area A.',
    explanationHi: 'आवेश संरक्षण के नियम से, प्रत्येक अनुप्रस्थ काट से प्रवाहित होने वाली विद्युत धारा (I) समान रहती है। धारा घनत्व (J), विद्युत क्षेत्र (E) तथा अपवाह चाल (vd) क्षेत्रफल A के व्युत्क्रमानुपाती होते हैं।',
    ncertRef: 'NCERT Class 12, Chapter 3, Page 98'
  },
  {
    id: 'q-phy-02',
    subject: 'Physics',
    subjectCode: 'phy',
    chapter: 'Ray Optics and Optical Instruments',
    topicKey: 'total_internal_reflection_prism',
    questionType: 'mcq',
    question: 'A ray of light is incident at an angle of 60° on one face of an equilateral glass prism (mu = sqrt(3)). The angle of minimum deviation (delta_min) produced by the prism is:',
    questionHi: 'एक समबाहु कांच के प्रिज्म (अपवर्तनांक mu = sqrt(3)) के एक फलक पर प्रकाश की किरण 60° के कोण पर आपतित होती है। प्रिज्म द्वारा उत्पन्न न्यूनतम विचलन कोण (delta_min) क्या होगा?',
    options: [
      '30°',
      '45°',
      '60°',
      '90°'
    ],
    optionsHi: [
      '30°',
      '45°',
      '60°',
      '90°'
    ],
    correctIndex: 2,
    difficulty: 'Hard',
    pyqYear: 'NEET 2021 / 2024',
    pyqRepeat: 4,
    tag: 'NEET 2024 REPEAT 4x',
    explanation: 'For equilateral prism, A = 60°. Formula: mu = sin((A + delta_min)/2) / sin(A/2) => sqrt(3) = sin((60° + delta_min)/2) / sin(30°) => sqrt(3) * 0.5 = sin((60° + delta_min)/2) => sin(60°) = sin((60° + delta_min)/2) => (60° + delta_min)/2 = 60° => delta_min = 120° - 60° = 60°.',
    explanationHi: 'समबाहु प्रिज्म हेतु A = 60°। सूत्र: mu = sin((A + delta)/2) / sin(A/2) => sqrt(3) = sin((60° + delta)/2) / sin(30°) => sin((60° + delta)/2) = sqrt(3)/2 = sin(60°) => 60° + delta = 120° => delta = 60°।',
    ncertRef: 'NCERT Class 12, Chapter 9, Page 331'
  },
  {
    id: 'q-phy-03',
    subject: 'Physics',
    subjectCode: 'phy',
    chapter: 'Thermodynamics',
    topicKey: 'carnot_engine_efficiency',
    questionType: 'mcq',
    question: 'A Carnot engine has an efficiency of 50% when its sink temperature is at 27°C (300 K). If its efficiency is to be increased to 60%, by how much should the source temperature be increased?',
    questionHi: 'एक कार्नो इंजन की दक्षता 50% है जब इसके सिंक का तापमान 27°C (300 K) है। यदि इसकी दक्षता बढ़ाकर 60% करनी हो, तो स्रोत के तापमान में कितनी वृद्धि करनी चाहिए?',
    options: [
      '150 K',
      '200 K',
      '100 K',
      '50 K'
    ],
    optionsHi: [
      '150 K',
      '200 K',
      '100 K',
      '50 K'
    ],
    correctIndex: 0,
    difficulty: 'Medium',
    pyqYear: 'NEET 2020 / 2024',
    pyqRepeat: 5,
    tag: 'NEET 2024 REPEAT 5x',
    explanation: 'Initial: eta = 1 - T2/T1 => 0.50 = 1 - 300/T1 => T1 = 600 K. New target: 0.60 = 1 - 300/T1\' => 300/T1\' = 0.40 => T1\' = 300 / 0.40 = 750 K. Increase in source temperature = 750 K - 600 K = 150 K.',
    explanationHi: 'प्रारंभ में: eta = 1 - T2/T1 => 0.5 = 1 - 300/T1 => T1 = 600 K। नया मान: 0.6 = 1 - 300/T1\' => T1\' = 750 K। स्रोत के तापमान में वृद्धि = 750 K - 600 K = 150 K।',
    ncertRef: 'NCERT Class 11, Chapter 12, Page 313'
  },
  {
    id: 'q-phy-04',
    subject: 'Physics',
    subjectCode: 'phy',
    chapter: 'Motion in a Straight Line (1D Kinematics)',
    topicKey: 'stopping_distance_velocity',
    questionType: 'mcq',
    question: 'A car moving at speed v is stopped by applying brakes over a distance d. If the same car moves at speed 3v and the same retarding force is applied, what will be the new stopping distance?',
    questionHi: 'चाल v से गतिमान एक कार को ब्रेक लगाकर d दूरी पर रोक दिया जाता है। यदि वही कार 3v चाल से चल रही हो और समान मंदन बल लगाया जाए, तो नई अवरोधन दूरी (stopping distance) क्या होगी?',
    options: [
      '3d',
      '6d',
      '9d',
      '12d'
    ],
    optionsHi: [
      '3d',
      '6d',
      '9d',
      '12d'
    ],
    correctIndex: 2,
    difficulty: 'Easy',
    pyqYear: 'NEET 2019 / 2023',
    pyqRepeat: 6,
    tag: 'NEET 2023 REPEAT 6x',
    explanation: 'Using v^2 - u^2 = 2as with final velocity = 0: stopping distance d = u^2 / (2a). Since stopping distance is directly proportional to u^2, tripling speed (3u) multiplies stopping distance by 3^2 = 9d.',
    explanationHi: 'सूत्र: v^2 = u^2 - 2as => अंतिम वेग शून्य होने पर d = u^2 / (2a)। अवरोधन दूरी चाल के वर्ग (u^2) के समानुपाती होती है, अतः चाल 3 गुना करने पर दूरी 3^2 = 9d हो जाएगी।',
    ncertRef: 'NCERT Class 11, Chapter 3, Page 50'
  },
  {
    id: 'q-phy-05',
    subject: 'Physics',
    subjectCode: 'phy',
    chapter: 'Semiconductor Electronics: Materials, Devices and Simple Circuits',
    topicKey: 'diode_biasing_depletion_layer',
    questionType: 'statement',
    question: 'Given below are two statements regarding p-n junction diodes:\nStatement I: Under forward bias, the width of the depletion layer decreases and barrier height is reduced.\nStatement II: Under reverse bias, the barrier height increases and the current is predominantly due to majority charge carriers.',
    questionHi: 'p-n संधि डायोड के संबंध में नीचे दो कथन दिए गए हैं:\nकथन I: अग्र अभिनति (forward bias) के अंतर्गत अवक्षय परत (depletion layer) की चौड़ाई घटती है तथा विभव प्राचीर की ऊंचाई कम हो जाती है।\nकथन II: पश्च अभिनति (reverse bias) के अंतर्गत विभव प्राचीर बढ़ता है तथा धारा मुख्य रूप से बहुसंख्यक आवेश वाहकों के कारण होती है।',
    options: [
      'Both Statement I and Statement II are correct',
      'Statement I is correct but Statement II is incorrect',
      'Statement I is incorrect but Statement II is correct',
      'Both Statement I and Statement II are incorrect'
    ],
    optionsHi: [
      'कथन I और कथन II दोनों सही हैं',
      'कथन I सही है लेकिन कथन II गलत है',
      'कथन I गलत है लेकिन कथन II सही है',
      'कथन I और कथन II दोनों गलत हैं'
    ],
    correctIndex: 1,
    difficulty: 'Medium',
    pyqYear: 'NEET 2022 / 2024',
    pyqRepeat: 4,
    tag: 'NEET 2024 REPEAT 4x',
    explanation: 'Statement I is correct. Statement II is INCORRECT because reverse bias current (drift current / reverse saturation current) is mediated exclusively by MINORITY charge carriers (thermally generated), not majority carriers.',
    explanationHi: 'कथन I सही है। कथन II गलत है क्योंकि उत्क्रम अभिनति में धारा अल्पसंख्यक आवेश वाहकों (minority carriers) के कारण होती है, बहुसंख्यकों के कारण नहीं।',
    ncertRef: 'NCERT Class 12, Chapter 14, Page 480'
  },
  {
    id: 'q-phy-06',
    subject: 'Physics',
    subjectCode: 'phy',
    chapter: 'Gravitation',
    topicKey: 'escape_velocity_orbital_velocity',
    questionType: 'mcq',
    question: 'If the radius of the Earth were to shrink by 1% while its mass remains constant, the acceleration due to gravity (g) on the Earth\'s surface would:',
    questionHi: 'यदि पृथ्वी का द्रव्यमान नियत रहते हुए उसकी त्रिज्या में 1% का संकुचन (कमी) हो जाए, तो पृथ्वी की सतह पर गुरुत्वीय त्वरण (g) के मान में क्या परिवर्तन होगा?',
    options: [
      'Increase by 2%',
      'Decrease by 2%',
      'Increase by 1%',
      'Decrease by 1%'
    ],
    optionsHi: [
      '2% की वृद्धि होगी',
      '2% की कमी होगी',
      '1% की वृद्धि होगी',
      '1% की कमी होगी'
    ],
    correctIndex: 0,
    difficulty: 'Medium',
    pyqYear: 'NEET 2021 / 2023',
    pyqRepeat: 4,
    tag: 'NEET 2023 REPEAT 4x',
    explanation: 'g = G * M / R^2. By fractional change: dg/g = -2 * (dR/R). If R decreases by 1% (dR/R = -1%), then dg/g = -2 * (-1%) = +2% (increases by 2%).',
    explanationHi: 'g = G*M / R^2 => dg/g = -2*(dR/R)। यदि त्रिज्या 1% घटती है (dR/R = -1%), तो गुरुत्वीय त्वरण dg/g = -2 * (-1%) = +2% बढ़ जाएगा।',
    ncertRef: 'NCERT Class 11, Chapter 8, Page 190'
  },

  // ==========================================
  // CHEMISTRY — A/R, REACTION TRAPS & NUMERICALS
  // ==========================================
  {
    id: 'q-chem-01',
    subject: 'Chemistry',
    subjectCode: 'chem',
    chapter: 'Chemical Bonding and Molecular Structure',
    topicKey: 'dipole_moment_nh3_nf3',
    questionType: 'assertion-reason',
    question: 'Assertion (A): The dipole moment of NH3 (1.47 D) is significantly higher than that of NF3 (0.24 D).\nReason (R): In NH3, the orbital dipole due to lone pair and the N-H bond dipoles point in the same direction, whereas in NF3 the lone pair dipole opposes the resultant N-F bond dipoles.',
    questionHi: 'अभिकथन (A): NH3 का द्विध्रुव आघूर्ण (1.47 D), NF3 के द्विध्रुव आघूर्ण (0.24 D) से काफी अधिक होता है।\nकारण (R): NH3 में एकाकी युग्म के कारण कक्षक द्विध्रुव और N-H आबंध द्विध्रुव एक ही दिशा में होते हैं, जबकि NF3 में एकाकी युग्म का द्विध्रुव परिणामी N-F आबंध द्विध्रुवों का विरोध करता है।',
    options: [
      'Both (A) and (R) are true and (R) is the correct explanation of (A)',
      'Both (A) and (R) are true but (R) is NOT the correct explanation of (A)',
      '(A) is true but (R) is false',
      'Both (A) and (R) are false'
    ],
    optionsHi: [
      '(A) और (R) दोनों सही हैं और (R), (A) की सही व्याख्या है',
      '(A) और (R) दोनों सही हैं लेकिन (R), (A) की सही व्याख्या नहीं है',
      '(A) सही है लेकिन (R) गलत है',
      '(A) और (R) दोनों गलत हैं'
    ],
    correctIndex: 0,
    difficulty: 'Medium',
    pyqYear: 'NEET 2022 / 2024',
    pyqRepeat: 6,
    tag: 'NEET 2024 REPEAT 6x',
    explanation: 'Both Assertion and Reason are true, and Reason is the exact NCERT explanation! In NH3, N is more electronegative than H, so bond dipoles add to lone pair dipole. In NF3, F is more electronegative than N, so bond dipoles point away and partially cancel the lone pair dipole.',
    explanationHi: 'अभिकथन और कारण दोनों सत्य हैं और (R) सही व्याख्या है। NH3 में N-H आबंधों के द्विध्रुव एकाकी युग्म की दिशा में जुड़ते हैं, जबकि NF3 में F की अधिक विद्युतऋणात्मकता के कारण N-F आबंध द्विध्रुव एकाकी युग्म के विपरीत कार्य करते हैं।',
    ncertRef: 'NCERT Class 11, Chapter 4, Page 108'
  },
  {
    id: 'q-chem-02',
    subject: 'Chemistry',
    subjectCode: 'chem',
    chapter: 'Chemical Kinetics',
    topicKey: 'first_order_half_life_units',
    questionType: 'mcq',
    question: 'For a first-order reaction A -> Products, the time taken for 99.9% completion is approximately how many times its half-life (t1/2)?',
    questionHi: 'प्रथम कोटि की अभिक्रिया (A -> उत्पाद) के लिए, 99.9% अभिक्रिया पूर्ण होने में लगने वाला समय इसकी अर्ध-आयु (t1/2) का लगभग कितने गुना होता है?',
    options: [
      '3 times',
      '10 times',
      '6.6 times',
      '20 times'
    ],
    optionsHi: [
      '3 गुना',
      '10 गुना',
      '6.6 गुना',
      '20 गुना'
    ],
    correctIndex: 1,
    difficulty: 'Medium',
    pyqYear: 'NEET 2021 / 2023',
    pyqRepeat: 5,
    tag: 'NEET 2023 REPEAT 5x',
    explanation: 't99.9% = (2.303 / k) * log10(100 / (100 - 99.9)) = (2.303 / k) * log10(1000) = (2.303 / k) * 3 = 6.909 / k. Since t1/2 = 0.693 / k, t99.9% = (6.909 / 0.693) * t1/2 = 10 * t1/2.',
    explanationHi: 't99.9% = (2.303/k) * log(100/0.1) = (2.303/k) * 3 = 6.909/k। चूंकि t1/2 = 0.693/k, अतः t99.9% = (6.909 / 0.693) * t1/2 = 10 गुना।',
    ncertRef: 'NCERT Class 12, Chapter 4, Page 112'
  },
  {
    id: 'q-chem-03',
    subject: 'Chemistry',
    subjectCode: 'chem',
    chapter: 'Solutions & Colligative Properties',
    topicKey: 'vant_hoff_factor_dissociation',
    questionType: 'mcq',
    question: 'If the degree of dissociation (alpha) of a weak electrolyte AB2 is 0.40, its van\'t Hoff factor (i) will be:',
    questionHi: 'यदि एक दुर्बल विद्युत-अपघट्य AB2 के वियोजन की मात्रा (alpha) 0.40 है, तो इसका वांट हॉफ गुणांक (i) क्या होगा?',
    options: [
      '1.40',
      '1.80',
      '2.20',
      '1.20'
    ],
    optionsHi: [
      '1.40',
      '1.80',
      '2.20',
      '1.20'
    ],
    correctIndex: 1,
    difficulty: 'Medium',
    pyqYear: 'NEET 2020 / 2024',
    pyqRepeat: 4,
    tag: 'NEET 2024 REPEAT 4x',
    explanation: 'For AB2 -> A2+ + 2B-, number of particles n = 3. Formula: i = 1 + (n - 1) * alpha = 1 + (3 - 1) * 0.40 = 1 + 2 * 0.40 = 1 + 0.80 = 1.80.',
    explanationHi: 'AB2 -> A2+ + 2B- हेतु कुल आयन n = 3। सूत्र: i = 1 + (n - 1)*alpha = 1 + (3 - 1)*0.40 = 1 + 0.80 = 1.80।',
    ncertRef: 'NCERT Class 12, Chapter 2, Page 57'
  },
  {
    id: 'q-chem-04',
    subject: 'Chemistry',
    subjectCode: 'chem',
    chapter: 'Organic Chemistry: Some Basic Principles and Techniques (GOC)',
    topicKey: 'acidity_picric_acid_resonance',
    questionType: 'statement',
    question: 'Given below are two statements regarding Carboxylic Acids and Phenols:\nStatement I: Picric acid (2,4,6-trinitrophenol) is more acidic than acetic acid despite not having a -COOH carboxylic group.\nStatement II: The presence of three strong electron-withdrawing -NO2 groups at ortho and para positions strongly stabilizes the phenoxide ion by extensive resonance.',
    questionHi: 'कार्बोक्सिलिक अम्लों और फिनोल के संबंध में नीचे दो कथन दिए गए हैं:\nकथन I: पिक्रिक अम्ल (2,4,6-ट्राइनाइट्रोफिनोल) में -COOH समूह न होने के बावजूद यह एसिटिक अम्ल से अधिक अम्लीय है।\nकथन II: ऑर्थो और पैरा स्थितियों पर तीन प्रबल इलेक्ट्रॉन-आकर्षी -NO2 समूहों की उपस्थिति फिनॉक्साइड आयन को अनुनाद द्वारा अत्यधिक स्थिर बनाती है।',
    options: [
      'Both Statement I and Statement II are correct and Statement II is correct explanation',
      'Both Statement I and Statement II are incorrect',
      'Statement I is correct but Statement II is incorrect',
      'Statement I is incorrect but Statement II is correct'
    ],
    optionsHi: [
      'कथन I और कथन II दोनों सही हैं और कथन II सही व्याख्या है',
      'कथन I और कथन II दोनों गलत हैं',
      'कथन I सही है लेकिन कथन II गलत है',
      'कथन I गलत है लेकिन कथन II सही है'
    ],
    correctIndex: 0,
    difficulty: 'Hard',
    pyqYear: 'NEET 2022 / 2024',
    pyqRepeat: 5,
    tag: 'NEET 2024 REPEAT 5x',
    explanation: 'Both statements are 100% correct! Picric acid (pKa ~ 0.38) is far more acidic than acetic acid (pKa ~ 4.76) because three -NO2 groups exert massive -M and -I effects, delocalizing the negative charge across the ring and nitro oxygens.',
    explanationHi: 'दोनों कथन 100% सही हैं! पिक्रिक अम्ल (pKa ~ 0.38) एसिटिक अम्ल (pKa ~ 4.76) से अधिक अम्लीय है क्योंकि तीन -NO2 समूह -M और -I प्रभाव द्वारा ऋणायन को अत्यधिक स्थिरता प्रदान करते हैं।',
    ncertRef: 'NCERT Class 12, Chapter 11, Page 338'
  },
  {
    id: 'q-chem-05',
    subject: 'Chemistry',
    subjectCode: 'chem',
    chapter: 'Aldehydes, Ketones and Carboxylic Acids',
    topicKey: 'cannizzaro_aldol_alpha_hydrogen',
    questionType: 'mcq',
    question: 'Which of the following compounds will undergo Cannizzaro reaction when treated with 50% concentrated NaOH?',
    questionHi: 'निम्नलिखित में से कौन सा यौगिक 50% सांद्र NaOH के साथ उपचारित करने पर कैनिजारो (Cannizzaro) अभिक्रिया देगा?',
    options: [
      'Acetaldehyde (CH3CHO)',
      'Benzaldehyde (C6H5CHO)',
      'Acetone (CH3COCH3)',
      'Propionaldehyde (CH3CH2CHO)'
    ],
    optionsHi: [
      'ऐसीटैल्डिहाइड (CH3CHO)',
      'बेंजैल्डिहाइड (C6H5CHO)',
      'ऐसीटोन (CH3COCH3)',
      'प्रोपियोनैल्डिहाइड (CH3CH2CHO)'
    ],
    correctIndex: 1,
    difficulty: 'Medium',
    pyqYear: 'NEET 2021 / 2023',
    pyqRepeat: 6,
    tag: 'NEET 2023 REPEAT 6x',
    explanation: 'Cannizzaro reaction is given exclusively by aldehydes that LACK alpha-hydrogen atoms (e.g. Formaldehyde HCHO, Benzaldehyde C6H5CHO, Trimethylacetaldehyde). Acetaldehyde and propionaldehyde have alpha-hydrogens and undergo Aldol condensation.',
    explanationHi: 'कैनिजारो अभिक्रिया केवल वे एल्डिहाइड देते हैं जिनमें अल्फा-हाइड्रोजन नहीं होता (जैसे बेंजैल्डिहाइड C6H5CHO, फॉर्मैल्डिहाइड HCHO)। ऐसीटैल्डिहाइड में अल्फा-H होने से वह एल्डोल संघनन देता है।',
    ncertRef: 'NCERT Class 12, Chapter 12, Page 370'
  },
  {
    id: 'q-chem-06',
    subject: 'Chemistry',
    subjectCode: 'chem',
    chapter: 'd and f-Block Elements & Coordination Compounds',
    topicKey: 'spin_only_magnetic_moment',
    questionType: 'mcq',
    question: 'The spin-only magnetic moment of [Fe(CN)6]4- and [Fe(H2O)6]2+ respectively are:',
    questionHi: '[Fe(CN)6]4- और [Fe(H2O)6]2+ का केवल चक्रण चुंबकीय आघूर्ण (spin-only magnetic moment) क्रमशः क्या होगा?',
    options: [
      '0 BM and 4.90 BM',
      '4.90 BM and 0 BM',
      '2.83 BM and 5.92 BM',
      '0 BM and 5.92 BM'
    ],
    optionsHi: [
      '0 BM तथा 4.90 BM',
      '4.90 BM तथा 0 BM',
      '2.83 BM तथा 5.92 BM',
      '0 BM तथा 5.92 BM'
    ],
    correctIndex: 0,
    difficulty: 'Hard',
    pyqYear: 'NEET 2020 / 2024',
    pyqRepeat: 5,
    tag: 'NEET 2024 REPEAT 5x',
    explanation: 'Fe2+ is 3d6. In [Fe(CN)6]4-, CN- is a strong field ligand -> pairing occurs -> t2g^6 eg^0 -> 0 unpaired electrons -> mu = 0 BM (diamagnetic). In [Fe(H2O)6]2+, H2O is a weak field ligand -> t2g^4 eg^2 -> 4 unpaired electrons -> mu = sqrt(4 * 6) = sqrt(24) = 4.90 BM.',
    explanationHi: 'Fe2+ (3d6)। [Fe(CN)6]4- में CN- प्रबल लिगैंड है जिससे युग्मन होता है (0 अयुग्मित इलेक्ट्रॉन -> 0 BM)। [Fe(H2O)6]2+ में दुर्बल लिगैंड H2O होने से 4 अयुग्मित इलेक्ट्रॉन रहते हैं (mu = sqrt(4*6) = 4.90 BM)।',
    ncertRef: 'NCERT Class 12, Chapter 9, Page 254'
  }
];

/**
 * Intelligent Dynamic Question Dispatcher
 * Selects or generates questions for all 6 test levels without unexpected blanks.
 */
async function getQuestionsForHierarchicalTest(params) {
  const { level, subjectCode, subjectsList, count = 10, drillType, topicTitle, chapterTitle, chapterId } = params;

  try {
    const fetchSubj = async (code, n) => {
      let apiUrl = `/api/questions?subjectCode=${code}&count=${n}`;
      if (chapterTitle) apiUrl += `&chapter=${encodeURIComponent(chapterTitle)}`;
      if (topicTitle) apiUrl += `&tag=${encodeURIComponent(topicTitle)}`;
      
      const stats = (window.appState && window.appState.questionStats) || 
                    (window.NEET2028State && window.NEET2028State.questionStats) || {};
      
      const excludeIds = [];
      for (const [id, attempts] of Object.entries(stats)) {
        if (attempts >= 3) {
          excludeIds.push(id);
        }
      }
                         
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ excludeIds })
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    };

    if (level === 6) {
      // Level 6: Full Syllabus Mock (All 4 subjects, 50 Qs each = 200)
      const phy = await fetchSubj('phy', 50);
      const chem = await fetchSubj('chem', 50);
      const bot = await fetchSubj('bot', 50);
      const zoo = await fetchSubj('zoo', 50);
      return [...phy, ...chem, ...bot, ...zoo];
    } else if (level >= 4 && level <= 5) {
      // Levels 4 & 5: Combo subjects (2 or 3 subjects)
      if (!subjectsList || subjectsList.length === 0) return [];
      const qPerSubj = Math.floor(count / subjectsList.length);
      let allQs = [];
      for (const code of subjectsList) {
        const subjQs = await fetchSubj(code, qPerSubj);
        allQs = allQs.concat(subjQs);
      }
      return allQs;
    } else {
      // Levels 1, 2, 3: Single topic, chapter, or subject
      const codeParam = subjectCode || 'all';
      return await fetchSubj(codeParam, count);
    }
  } catch (err) {
    console.warn("Backend not running or error, falling back to dummy data...", err);
    // FALLBACK LOGIC if backend isn't started
    return getFallbackQuestions(params);
  }
}

function getFallbackQuestions(params) {
  const { level, count = 10 } = params;
  if (level === 6 && count === 200) {
    const getSubj = (code, n) => {
      let pool = NEET_QUESTIONS.filter(q => q.subjectCode === code).sort(() => 0.5 - Math.random());
      if (pool.length < n) pool = pool.concat(generateProceduralTestQuestions({ ...params, subjectCode: code }, n - pool.length, pool.length + 1));
      return pool.slice(0, n);
    };
    return [...getSubj('phy', 50), ...getSubj('chem', 50), ...getSubj('bot', 50), ...getSubj('zoo', 50)];
  }
  let pool = [...NEET_QUESTIONS].sort(() => 0.5 - Math.random());
  if (pool.length < count) pool = pool.concat(generateProceduralTestQuestions(params, count - pool.length, pool.length + 1));
  return pool.slice(0, count);
}

/**
 * High-Yield Procedural Question Generator
 * Creates Director-Standard NTA Pattern MCQs with realistic options, solutions & NCERT page numbers
 */
function generateProceduralTestQuestions(params, neededCount, startId) {
  const { level, subjectCode, topicTitle, chapterTitle } = params;
  const subjects = ['Physics', 'Chemistry', 'Botany', 'Zoology'];
  const generated = [];

  const subjectKey = subjectCode === 'phy' ? 'Physics' :
                     subjectCode === 'chem' ? 'Chemistry' :
                     subjectCode === 'bot' ? 'Botany' :
                     subjectCode === 'zoo' ? 'Zoology' : null;

  for (let i = 0; i < neededCount; i++) {
    const s = subjectKey || subjects[(startId + i) % 4];
    const sCode = s === 'Physics' ? 'phy' : s === 'Chemistry' ? 'chem' : s === 'Botany' ? 'bot' : 'zoo';
    const qNum = startId + i;

    if (s === 'Physics') {
      generated.push({
        id: `proc-phy-${qNum}`,
        subject: 'Physics',
        subjectCode: 'phy',
        chapter: chapterTitle || 'High-Yield Mechanics & Electrodynamics',
        questionType: i % 2 === 0 ? 'mcq' : 'assertion-reason',
        question: `[Q.${qNum} NTA Standard] In an alternating circuit containing an inductor L and resistance R in series with an AC supply of frequency f, if the frequency is doubled, the impedance of the circuit:`,
        questionHi: `[प्रश्न ${qNum} NTA मानक] आवृत्ति f की AC आपूर्ति के साथ श्रेणीक्रम में प्रेरक L तथा प्रतिरोध R युक्त परिपथ में, यदि आवृत्ति को दोगुना कर दिया जाए, तो परिपथ की प्रतिबाधा (impedance):`,
        options: [
          'Remains strictly unchanged',
          'Increases because inductive reactance XL = 2*pi*f*L doubles',
          'Decreases because inductive reactance decreases',
          'Becomes exactly four times the initial impedance'
        ],
        optionsHi: [
          'पूरी तरह अपरिवर्तित रहती है',
          'बढ़ती है क्योंकि प्रेरणिक प्रतिघात XL = 2*pi*f*L दोगुना हो जाता है',
          'घटती है क्योंकि प्रेरणिक प्रतिघात कम होता है',
          'प्रारंभिक प्रतिबाधा की ठीक चार गुना हो जाती है'
        ],
        correctIndex: 1,
        difficulty: 'Medium',
        pyqYear: 'NTA Model Director Exam',
        tag: 'NTA HIGH-YIELD',
        explanation: 'Impedance Z = sqrt(R^2 + XL^2) where XL = 2 * pi * f * L. As frequency f doubles, inductive reactance XL doubles, leading to an overall increase in impedance Z.',
        explanationHi: 'प्रतिबाधा Z = sqrt(R^2 + XL^2) जहां XL = 2*pi*f*L। आवृत्ति f दोगुनी होने पर XL दोगुना हो जाता है, जिससे प्रतिबाधा Z में वृद्धि होती है।',
        ncertRef: 'NCERT Class 12, Chapter 7'
      });
    } else if (s === 'Chemistry') {
      generated.push({
        id: `proc-chem-${qNum}`,
        subject: 'Chemistry',
        subjectCode: 'chem',
        chapter: chapterTitle || 'Physical & Organic Equilibrium High-Yield Drill',
        questionType: i % 2 === 0 ? 'statement' : 'mcq',
        question: `[Q.${qNum} NTA Standard] Given below are two statements:\nStatement I: For an exothermic reversible reaction, increasing the temperature decreases the equilibrium constant Keq.\nStatement II: According to Le Chatelier\'s principle, adding an inert gas at constant volume has no effect on equilibrium.`,
        questionHi: `[प्रश्न ${qNum} NTA मानक] नीचे दो कथन दिए गए हैं:\nकथन I: एक ऊष्माक्षेपी उत्क्रमणीय अभिक्रिया के लिए तापमान बढ़ाने पर साम्य स्थिरांक Keq का मान घट जाता है।\nकथन II: ला-शातेलिए के नियमानुसार नियत आयतन पर अक्रिय गैस मिलाने से साम्यावस्था पर कोई प्रभाव नहीं पड़ता।`,
        options: [
          'Both Statement I and Statement II are correct',
          'Both Statement I and Statement II are incorrect',
          'Statement I is correct but Statement II is incorrect',
          'Statement I is incorrect but Statement II is correct'
        ],
        optionsHi: [
          'कथन I और कथन II दोनों सही हैं',
          'कथन I और कथन II दोनों गलत हैं',
          'कथन I सही है लेकिन कथन II गलत है',
          'कथन I गलत है लेकिन कथन II सही है'
        ],
        correctIndex: 0,
        difficulty: 'Medium',
        pyqYear: 'NTA Model Director Exam',
        tag: 'NTA HIGH-YIELD',
        explanation: 'Both statements are true. By van\'t Hoff equation d(ln K)/dT = deltaH / (R*T^2), for exothermic reactions (deltaH < 0), K decreases with T. Adding inert gas at constant volume does not change partial pressures of reactants/products.',
        explanationHi: 'दोनों कथन सत्य हैं। ऊष्माक्षेपी अभिक्रियाओं (deltaH < 0) के लिए तापमान बढ़ने पर साम्य स्थिरांक Keq घटता है। नियत आयतन पर अक्रिय गैस मिलाने से आंशिक दाब नहीं बदलता।',
        ncertRef: 'NCERT Class 11, Chapter 7'
      });
    } else if (s === 'Botany') {
      generated.push({
        id: `proc-bot-${qNum}`,
        subject: 'Botany',
        subjectCode: 'bot',
        chapter: chapterTitle || 'NCERT Plant Physiology & Genetics Trap Drill',
        questionType: 'assertion-reason',
        question: `[Q.${qNum} NTA Standard] Assertion (A): Photorespiration is a wasteful process that occurs in C3 plants under high light and low CO2 conditions.\nReason (R): Under high O2/CO2 ratio, RuBisCO binds O2 and converts RuBP into 1 molecule of 3-PGA and 1 molecule of 2-phosphoglycolate without producing ATP or NADPH.`,
        questionHi: `[प्रश्न ${qNum} NTA मानक] अभिकथन (A): प्रकाश-श्वसन (Photorespiration) एक ऊर्जा-अपव्ययी प्रक्रिया है जो C3 पादपों में तीव्र प्रकाश व निम्न CO2 की स्थिति में होती है।\nकारण (R): उच्च O2/CO2 अनुपात में RuBisCO ऑक्सीजन से जुड़कर RuBP को 3-PGA के 1 अणु तथा 2-फॉस्फोग्लाइकोलेट के 1 अणु में बदल देता है जिसमें न तो ATP बनता है न ही NADPH।`,
        options: [
          'Both (A) and (R) are true and (R) is the correct explanation of (A)',
          'Both (A) and (R) are true but (R) is NOT the correct explanation of (A)',
          '(A) is true but (R) is false',
          'Both (A) and (R) are false'
        ],
        optionsHi: [
          '(A) और (R) दोनों सही हैं और (R), (A) की सही व्याख्या है',
          '(A) और (R) दोनों सही हैं लेकिन (R), (A) की सही व्याख्या नहीं है',
          '(A) सही है लेकिन (R) गलत है',
          '(A) और (R) दोनों गलत हैं'
        ],
        correctIndex: 0,
        difficulty: 'Hard',
        pyqYear: 'NTA Model Director Exam',
        tag: 'NTA HIGH-YIELD',
        explanation: 'Both Assertion and Reason are true: In C3 plants, RuBisCO oxygenase activity wastes energy by converting RuBP into 3-PGA and 2-phosphoglycolate (C2 cycle) while consuming ATP and releasing CO2 without carbon fixation.',
        explanationHi: 'अभिकथन और कारण दोनों सत्य हैं: C3 पादपों में RuBisCO की ऑक्सीजनेज सक्रियता के कारण RuBP से 3-PGA व 2-फॉस्फोग्लाइकोलेट बनता है, जिसमें ATP नष्ट होता है।',
        ncertRef: 'NCERT Class 11, Chapter 13'
      });
    } else {
      generated.push({
        id: `proc-zoo-${qNum}`,
        subject: 'Zoology',
        subjectCode: 'zoo',
        chapter: chapterTitle || 'Human Physiology & Biotechnology Clinical Drill',
        questionType: 'statement',
        question: `[Q.${qNum} NTA Standard] Given below are two statements regarding the Human Neural System:\nStatement I: The resting axonal membrane is comparatively more permeable to potassium ions (K+) and nearly impermeable to sodium ions (Na+).\nStatement II: The ionic gradients across the resting membrane are maintained by active transport of ions by the Na+/K+ pump which transports 2 Na+ outwards for 3 K+ into the cell.`,
        questionHi: `[प्रश्न ${qNum} NTA मानक] मानव तंत्रिका तंत्र के संबंध में नीचे दो कथन दिए गए हैं:\nकथन I: विश्राम अवस्था में एक्सॉन झिल्ली पोटेशियम आयनों (K+) के लिए अपेक्षाकृत अधिक पारगम्य तथा सोडियम आयनों (Na+) के लिए लगभग अपारगम्य होती है।\nकथन II: विश्राम झिल्ली के आर-पार आयनिक प्रवणता को Na+/K+ पंप के सक्रिय परिवहन द्वारा बनाए रखा जाता है जो 2 Na+ बाहर तथा 3 K+ अंदर भेजता है।`,
        options: [
          'Statement I is correct but Statement II is incorrect',
          'Both Statement I and Statement II are correct',
          'Both Statement I and Statement II are incorrect',
          'Statement I is incorrect but Statement II is correct'
        ],
        optionsHi: [
          'कथन I सही है लेकिन कथन II गलत है',
          'कथन I और कथन II दोनों सही हैं',
          'कथन I और कथन II दोनों गलत हैं',
          'कथन I गलत है लेकिन कथन II सही है'
        ],
        correctIndex: 0,
        difficulty: 'Hard',
        pyqYear: 'NTA Model Director Exam',
        tag: 'NTA HIGH-YIELD',
        explanation: 'Statement I is correct. Statement II is INCORRECT because the Na+/K+ ATPase pump actively expels 3 Na+ OUTWARDS for every 2 K+ pumped INWARDS (3 Na+ out / 2 K+ in).',
        explanationHi: 'कथन I सही है। कथन II गलत है क्योंकि Na+/K+ ATPase पंप 3 Na+ बाहर निकालता है और 2 K+ अंदर लाता है (3 Na+ बाहर / 2 K+ अंदर)।',
        ncertRef: 'NCERT Class 11, Chapter 21, Page 317'
      });
    }
  }

  return generated;
}

// Global helpers
function getQuestionsBySubject(subjectCode) {
  return NEET_QUESTIONS.filter(q => q.subjectCode === subjectCode);
}

function getQuestionsByType(questionType) {
  return NEET_QUESTIONS.filter(q => q.questionType === questionType);
}

function getPYQQuestions() {
  return NEET_QUESTIONS.filter(q => q.pyqRepeat && q.pyqRepeat >= 3);
}

if (typeof window !== 'undefined') {
  window.NEET_QUESTIONS = NEET_QUESTIONS;
  window.getQuestionsForHierarchicalTest = getQuestionsForHierarchicalTest;
  window.getQuestionsBySubject = getQuestionsBySubject;
  window.getQuestionsByType = getQuestionsByType;
  window.getPYQQuestions = getPYQQuestions;
} else if (typeof global !== 'undefined') {
  global.NEET_QUESTIONS = NEET_QUESTIONS;
  global.getQuestionsForHierarchicalTest = getQuestionsForHierarchicalTest;
  global.getQuestionsBySubject = getQuestionsBySubject;
  global.getQuestionsByType = getQuestionsByType;
  global.getPYQQuestions = getPYQQuestions;
}
