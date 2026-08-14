/**
 * NEET UG 2028: Curated Zero-Gap Resource Library & Video Master Vault
 * 100% Pure NCERT Bound · YouTube Masterclasses · Free Government & Academic Portals
 */
const NEET_RESOURCES = [
  // =========================================================================
  // 🏛️ FREE GOVERNMENT & OFFICIAL ACADEMIC PORTALS (NON-YOUTUBE)
  // =========================================================================
  {
    id: 'yt-pw-ummeed',
    title: 'Physics Wallah (PW) — Ummeed Series (Complete NEET Syllabus)',
    url: 'https://www.youtube.com/c/PhysicsWallah',
    subject: 'All Subjects',
    type: 'YouTube Masterclass',
    category: 'Top Free Coaching',
    provider: 'Alakh Pandey (PW)',
    hours: 450,
    priority: 'Legendary Free Batch for Droppers & 12th — Beats Most Paid Courses',
    description: 'The most recommended free series for NEET aspirants in India. Covers Physics, Chemistry, Botany, and Zoology from zero to top medical college level in simple Hindi/English mix.',
    isExternalPortal: true,
    tags: ['Physics Wallah', 'Ummeed', 'Free Coaching', 'All Subjects']
  },
  {
    id: 'yt-seep-pahuja',
    title: 'Seep Pahuja Biology — NCERT Line-by-Line Series',
    url: 'https://www.youtube.com/',
    subject: 'Biology',
    type: 'YouTube Masterclass',
    category: 'Top Free Coaching',
    provider: 'Dr. Seep Pahuja',
    hours: 120,
    priority: 'Best for 360/360 in NEET Biology (Botany & Zoology)',
    description: 'Master Genetics, Human Physiology, and Plant Diversity. Every single line of NCERT is decoded with memory tricks and direct NEET PYQs.',
    isExternalPortal: true,
    tags: ['Biology', 'Seep Pahuja', 'NCERT Decoding', 'Free']
  },
  {
    id: 'yt-ashish-arora',
    title: 'Physics Galaxy — NEET Physics Revision Checklist',
    url: 'https://www.youtube.com/c/physicsgalaxy74',
    subject: 'Physics',
    type: 'YouTube Masterclass',
    category: 'Top Free Coaching',
    provider: 'Ashish Arora Sir',
    hours: 80,
    priority: "Topper's Secret: Quickest Revision of Entire Physics",
    description: 'Fast-track revision checklists and advanced conceptual traps. If you want 170+ in Physics, watch these checklists before every mock test.',
    isExternalPortal: true,
    tags: ['Physics Galaxy', 'Ashish Arora', 'Revision Checklist', 'Physics']
  },
  {
    id: 'yt-garima-goel',
    title: 'Garima Goel Biology — G-Square Notes & Crash Course',
    url: 'https://www.youtube.com/',
    subject: 'Biology',
    type: 'YouTube Masterclass',
    category: 'Top Free Coaching',
    provider: 'Garima Goel',
    hours: 100,
    priority: 'Extremely High-Yield Hand-written Notes Series',
    description: 'Short crisp lectures focusing exactly on what NTA asks in exams. Highly recommended for quick coverage of Biology.',
    isExternalPortal: true,
    tags: ['Garima Goel', 'Biology', 'Crash Course', 'Free']
  },

  {
    id: 'portal-diksha-ncert',
    title: 'DIKSHA & ePathshala — NCERT Official Audiovisual & Interactive Portal',
    url: 'https://diksha.gov.in/explore',
    subject: 'All Subjects',
    type: 'Govt Portal',
    category: 'Official Govt Portals',
    provider: 'NCERT / Ministry of Education',
    hours: 100,
    priority: 'Official NCERT Interactive 3D Lessons & QR Code Audiovisuals',
    description: 'Digital Infrastructure for Knowledge Sharing by NCERT. Provides chapter-wise audiovisual lessons, 3D animations, and textbook QR-linked solutions.',
    isExternalPortal: true,
    tags: ['DIKSHA', 'ePathshala', 'NCERT', 'Free']
  },
  {
    id: 'portal-khan-academy',
    title: 'Khan Academy India — Conceptual Science & Medical Foundation Track',
    url: 'https://www.khanacademy.org/science',
    subject: 'All Subjects',
    type: 'Interactive Visuals',
    category: 'Official Govt Portals',
    provider: 'Khan Academy (NCERT Aligned)',
    hours: 90,
    priority: 'Zero-Ad, Crystal-Clear Concept Animations & Deep Visuals',
    description: '100% free non-profit platform offering world-class step-by-step video lessons and practice problems aligned with Indian Class 11 & 12 NCERT curriculum.',
    isExternalPortal: true,
    tags: ['Khan Academy', 'Zero Ads', 'Animations', 'Conceptual']
  },
  {
    id: 'portal-phet-simulations',
    title: 'PhET Interactive Simulations (Univ of Colorado) — Physics & Chemistry Labs',
    url: 'https://phet.colorado.edu/en/simulations/browse',
    subject: 'Physics',
    type: 'Interactive Simulation',
    category: 'Interactive 3D/Simulations',
    provider: 'Univ of Colorado',
    hours: 40,
    priority: 'Interactive Visual Intuition for Ray Optics, Waves & Thermodynamics',
    description: 'Interactive, research-based simulations for Physics and Chemistry (Ray Optics, Wave Interference, Electric Fields, Gas Laws, and Reaction Kinetics).',
    isExternalPortal: true,
    tags: ['PhET', 'Simulations', 'Physics', 'Chemistry', 'Free']
  },
  {
    id: 'portal-biodigital-human',
    title: 'BioDigital Human & Anatronica 3D — Interactive Human Physiology Atlas',
    url: 'https://human.biodigital.com/',
    subject: 'Zoology',
    type: '3D Anatomy Explorer',
    category: 'Interactive 3D/Simulations',
    provider: 'BioDigital / Medical Visuals',
    hours: 35,
    priority: '3D Interactive Organ Systems: Heart, Kidney, Brain & Locomotion',
    description: 'Free interactive 3D model of the human body. Rotate, dissect, and visualize heart chambers, nephron filtration, neural synapses, and muscle contractions in real 3D.',
    isExternalPortal: true,
    tags: ['3D Anatomy', 'Zoology', 'Human Physiology', 'Interactive']
  },

  // =========================================================================
  // 📚 OFFICIAL NCERT E-BOOKS & EXEMPLARS (HINDI & ENGLISH MEDIUM PDF DIRECT)
  // =========================================================================
  {
    id: 'res-ncert-bio-11-hi',
    title: 'NCERT जीव विज्ञान कक्षा 11 (हिन्दी माध्यम सम्पूर्ण ई-बुक PDF)',
    url: 'https://ncert.nic.in/textbook.php?khbo1=0-22',
    subject: 'Botany',
    type: 'Official NCERT Hindi',
    category: 'Official NCERT',
    provider: 'NCERT Official (हिन्दी)',
    hours: 120,
    priority: 'हिन्दी माध्यम के विद्यार्थियों के लिए मूल NCERT पुस्तक (प्रत्येक पंक्ति से प्रश्न)',
    description: 'कक्षा 11 जीव विज्ञान की सम्पूर्ण 22 अध्यायों की आधिकारिक NCERT पुस्तक हिन्दी में सीधे डाउनलोड करें।',
    tags: ['NCERT Hindi', 'Class 11', 'जीव विज्ञान', 'Free']
  },
  {
    id: 'res-ncert-bio-12-hi',
    title: 'NCERT जीव विज्ञान कक्षा 12 (हिन्दी माध्यम सम्पूर्ण ई-बुक PDF)',
    url: 'https://ncert.nic.in/textbook.php?lhbo1=0-16',
    subject: 'Zoology',
    type: 'Official NCERT Hindi',
    category: 'Official NCERT',
    provider: 'NCERT Official (हिन्दी)',
    hours: 110,
    priority: 'जीव विज्ञान में 360/360 अंक प्राप्त करने के लिए सबसे महत्वपूर्ण पुस्तक',
    description: 'कक्षा 12 जीव विज्ञान की सम्पूर्ण 16 अध्यायों की आधिकारिक NCERT पुस्तक हिन्दी में सीधे डाउनलोड करें।',
    tags: ['NCERT Hindi', 'Class 12', 'जीव विज्ञान', 'Free']
  },
  {
    id: 'res-ncert-chem-11-hi',
    title: 'NCERT रसायन विज्ञान कक्षा 11 भाग 1 व 2 (हिन्दी माध्यम)',
    url: 'https://ncert.nic.in/textbook.php?khch1=0-7',
    subject: 'Chemistry',
    type: 'Official NCERT Hindi',
    category: 'Official NCERT',
    provider: 'NCERT Official (हिन्दी)',
    hours: 90,
    priority: 'अकार्बनिक आबंधन, ऊष्मागतिकी व साम्यावस्था हेतु आवश्यक',
    description: 'कक्षा 11 रसायन विज्ञान भाग 1 व भाग 2 की आधिकारिक NCERT पुस्तक हिन्दी में।',
    tags: ['NCERT Hindi', 'Class 11', 'रसायन विज्ञान', 'Free']
  },
  {
    id: 'res-ncert-chem-12-hi',
    title: 'NCERT रसायन विज्ञान कक्षा 12 भाग 1 व 2 (हिन्दी माध्यम)',
    url: 'https://ncert.nic.in/textbook.php?lhch1=0-10',
    subject: 'Chemistry',
    type: 'Official NCERT Hindi',
    category: 'Official NCERT',
    provider: 'NCERT Official (हिन्दी)',
    hours: 95,
    priority: 'कार्बनिक अभिक्रियाएं, d-ब्लॉक व उपसहसंयोजन यौगिक',
    description: 'कक्षा 12 रसायन विज्ञान भाग 1 व भाग 2 की आधिकारिक NCERT पुस्तक हिन्दी में।',
    tags: ['NCERT Hindi', 'Class 12', 'रसायन विज्ञान', 'Free']
  },
  {
    id: 'res-ncert-phy-11-hi',
    title: 'NCERT भौतिकी कक्षा 11 भाग 1 व 2 (हिन्दी माध्यम)',
    url: 'https://ncert.nic.in/textbook.php?khph1=0-8',
    subject: 'Physics',
    type: 'Official NCERT Hindi',
    category: 'Official NCERT',
    provider: 'NCERT Official (हिन्दी)',
    hours: 80,
    priority: 'विचारणीय बिंदु (Points to Ponder) और सारांश रेखाएं',
    description: 'कक्षा 11 भौतिकी भाग 1 व भाग 2 की आधिकारिक NCERT पुस्तक हिन्दी में।',
    tags: ['NCERT Hindi', 'Class 11', 'भौतिक विज्ञान', 'Free']
  },
  {
    id: 'res-ncert-phy-12-hi',
    title: 'NCERT भौतिकी कक्षा 12 भाग 1 व 2 (हिन्दी माध्यम)',
    url: 'https://ncert.nic.in/textbook.php?lhph1=0-8',
    subject: 'Physics',
    type: 'Official NCERT Hindi',
    category: 'Official NCERT',
    provider: 'NCERT Official (हिन्दी)',
    hours: 85,
    priority: 'आधुनिक भौतिकी, अर्धचालक व प्रकाशिकी',
    description: 'कक्षा 12 भौतिकी भाग 1 व भाग 2 की आधिकारिक NCERT पुस्तक हिन्दी में।',
    tags: ['NCERT Hindi', 'Class 12', 'भौतिक विज्ञान', 'Free']
  },
  {
    id: 'res-ncert-bio-11',
    title: 'NCERT Biology Class 11 (English Medium Official PDF)',
    url: 'https://ncert.nic.in/textbook.php?kebo1=0-22',
    subject: 'Botany',
    type: 'Official NCERT',
    category: 'Official NCERT',
    provider: 'NCERT Official',
    hours: 120,
    priority: 'Core Bible (Every Single Line is Potential Question)',
    description: 'Official 22-chapter NCERT Biology Class 11 textbook directly downloadable in PDF from NCERT portal.',
    tags: ['NCERT', 'Class 11', 'Bio', 'Free']
  },
  {
    id: 'res-ncert-bio-12',
    title: 'NCERT Biology Class 12 (English Medium Official PDF)',
    url: 'https://ncert.nic.in/textbook.php?lebo1=0-16',
    subject: 'Zoology',
    type: 'Official NCERT',
    category: 'Official NCERT',
    provider: 'NCERT Official',
    hours: 110,
    priority: 'Core Bible (Target 360/360 in Biology)',
    description: 'Official 16-chapter NCERT Biology Class 12 textbook directly downloadable in PDF from NCERT portal.',
    tags: ['NCERT', 'Class 12', 'Bio', 'Free']
  },
  {
    id: 'res-ncert-chem-11',
    title: 'NCERT Chemistry Class 11 (English Medium Official PDF)',
    url: 'https://ncert.nic.in/textbook.php?kech1=0-7',
    subject: 'Chemistry',
    type: 'Official NCERT',
    category: 'Official NCERT',
    provider: 'NCERT Official',
    hours: 90,
    priority: 'Must-Read for Inorganic Bonding & Physical Foundations',
    description: 'Official NCERT Chemistry Class 11 textbook covering Structure of Atom, Thermodynamics, Equilibrium, and Chemical Bonding.',
    tags: ['NCERT', 'Class 11', 'Chem', 'Free']
  },
  {
    id: 'res-ncert-chem-12',
    title: 'NCERT Chemistry Class 12 (English Medium Official PDF)',
    url: 'https://ncert.nic.in/textbook.php?lech1=0-10',
    subject: 'Chemistry',
    type: 'Official NCERT',
    category: 'Official NCERT',
    provider: 'NCERT Official',
    hours: 95,
    priority: 'Must-Read for Organic Name Reactions, d-Block & Coordination',
    description: 'Official NCERT Chemistry Class 12 textbook with exact NCERT tables, graphs, and reaction roadmaps.',
    tags: ['NCERT', 'Class 12', 'Chem', 'Free']
  },
  {
    id: 'res-ncert-phy-11',
    title: 'NCERT Physics Class 11 (English Medium Official PDF)',
    url: 'https://ncert.nic.in/textbook.php?keph1=0-8',
    subject: 'Physics',
    type: 'Official NCERT',
    category: 'Official NCERT',
    provider: 'NCERT Official',
    hours: 80,
    priority: 'Mandatory for Points to Ponder, Graphs & Summary Lines',
    description: 'Official NCERT Physics Class 11 textbook. Essential for theoretical assertion-reason and graph-based questions.',
    tags: ['NCERT', 'Class 11', 'Physics', 'Free']
  },
  {
    id: 'res-ncert-phy-12',
    title: 'NCERT Physics Class 12 (English Medium Official PDF)',
    url: 'https://ncert.nic.in/textbook.php?leph1=0-8',
    subject: 'Physics',
    type: 'Official NCERT',
    category: 'Official NCERT',
    provider: 'NCERT Official',
    hours: 85,
    priority: 'Semiconductors, Modern Physics & Wave Optics Line-by-Line',
    description: 'Official NCERT Physics Class 12 textbook containing direct exam-line statements for Modern Physics and Optics.',
    tags: ['NCERT', 'Class 12', 'Physics', 'Free']
  },
  {
    id: 'res-ncert-exemplar',
    title: 'NCERT Exemplar Problems & Solutions (Physics, Chemistry, Biology)',
    url: 'https://ncert.nic.in/exemplar-problems.php',
    subject: 'All Subjects',
    type: 'Exemplar Practice',
    category: 'Official NCERT',
    provider: 'NCERT Official',
    hours: 60,
    priority: 'Direct Source of 15-20% Multi-Concept MCQs in NEET',
    description: 'Official NCERT Exemplar question bank with Single Option Correct, Multiple Correct, Matching, and Statement questions in Hindi and English.',
    tags: ['Exemplar', 'MCQs', 'High-Yield', 'NCERT']
  },

  // =========================================================================
  // 🎥 HINDI & HINGLISH FREE MASTERCLASSES (FOR SELF-STUDY STUDENTS)
  // =========================================================================
  {
    id: 'vid-khan-academy-hindi',
    title: 'खान एकेडमी हिन्दी (Khan Academy Hindi) — 100% नि:शुल्क सम्पूर्ण विज्ञान',
    url: 'https://hi.khanacademy.org/science',
    subject: 'All Subjects',
    type: 'Hindi Video Lectures',
    category: 'Full Lectures',
    provider: 'Khan Academy Hindi',
    hours: 110,
    priority: 'बिना किसी विज्ञापन के स्पष्ट और सरल हिन्दी में समझें',
    description: 'कक्षा 11 व 12 के सम्पूर्ण भौतिकी, रसायन और जीव विज्ञान के संकल्पनात्मक वीडियो पाठ नि:शुल्क उपलब्ध हैं।',
    tags: ['Hindi Medium', 'Khan Academy', 'Free', 'NCERT']
  },
  {
    id: 'vid-pw-hindi-neet',
    title: 'Physics Wallah हिन्दी माध्यम — NEET सम्पूर्ण भौतिकी, रसायन एवं जीव विज्ञान',
    url: 'https://www.youtube.com/results?search_query=physics+wallah+hindi+medium+neet+lectures',
    subject: 'All Subjects',
    type: 'Hindi Video Lectures',
    category: 'Full Lectures',
    provider: 'Physics Wallah (हिन्दी माध्यम)',
    hours: 180,
    priority: 'ग्रामीण व हिन्दी माध्यम के विद्यार्थियों के लिए देश की सर्वश्रेष्ठ फ्री कक्षाएं',
    description: 'अलख पाण्डेय सर एवं पीडब्ल्यू के शीर्ष शिक्षकों द्वारा हिन्दी माध्यम में NEET 720/720 की पूरी तैयारी।',
    tags: ['Hindi Medium', 'Physics Wallah', 'Alakh Pandey', 'Free']
  },
  {
    id: 'vid-pankaj-sir-chem-hi',
    title: 'पंकज सर केमिस्ट्री (Pankaj Sir Chemistry) — कार्बनिक व अकार्बनिक रसायन',
    url: 'https://www.youtube.com/results?search_query=pankaj+sir+chemistry+neet+lectures',
    subject: 'Chemistry',
    type: 'Hindi Video Lectures',
    category: 'Full Lectures',
    provider: 'Pankaj Sir',
    hours: 120,
    priority: 'केमिस्ट्री में 180/180 का लक्ष्य — आसान भाषा में पूरे नियम व ट्रिक्स',
    description: 'कक्षा 11 व 12 की ऑर्गेनिक, इनऑर्गेनिक और फिजिकल केमिस्ट्री के फ्री मास्टर वीडियो लेक्चर्स।',
    tags: ['Chemistry', 'Pankaj Sir', 'Hindi Medium', 'Free']
  },
  {
    id: 'vid-tarun-sir-bot-hi',
    title: 'तरुण सर बॉटनी (Tarun Sir Botany) — NCERT लाइन-बाय-लाइन व्याख्या',
    url: 'https://www.youtube.com/results?search_query=tarun+sir+botany+ncert+neet',
    subject: 'Botany',
    type: 'Hindi Video Lectures',
    category: 'Full Lectures',
    provider: 'Tarun Sir (Botany Master)',
    hours: 100,
    priority: 'पादप कार्यिकी, आनुवंशिकी और कोशिका विज्ञान की सर्वोत्तम व्याख्या',
    description: 'NCERT की प्रत्येक पंक्ति और आरेख की गहराई से समझ — बॉटनी में पूरे 180 अंक।',
    tags: ['Botany', 'Tarun Sir', 'Hindi', 'NCERT']
  },
  {
    id: 'vid-seep-pahuja-zoo-hi',
    title: 'डॉ. सीप पाहुजा (Dr. Seep Pahuja) — प्राणी विज्ञान (Zoology) NCERT मास्टरक्लास',
    url: 'https://www.youtube.com/results?search_query=seep+pahuja+zoology+ncert+neet',
    subject: 'Zoology',
    type: 'Hindi Video Lectures',
    category: 'Full Lectures',
    provider: 'Dr. Seep Pahuja',
    hours: 95,
    priority: 'मानव कार्यिकी, जनन एवं जैव प्रौद्योगिकी की संपूर्ण NCERT व्याख्या',
    description: 'NCERT जूलॉजी के आरेख, टेबल और पिछले 10 वर्षों के NEET प्रश्नों का सम्पूर्ण हल।',
    tags: ['Zoology', 'Seep Pahuja', 'Hindi', 'NCERT']
  },

  // =========================================================================
  // 🎥 PHYSICS MASTERCLASSES & FREE YOUTUBE LECTURES
  // =========================================================================
  {
    id: 'vid-pw-alakh-phy-11-12',
    title: 'Alakh Pandey Sir (Physics Wallah) — Classic Full Physics Master Lectures',
    url: 'https://www.youtube.com/results?search_query=alakh+pandey+physics+wallah+class+11+12+playlist',
    subject: 'Physics',
    type: 'Full Video Lectures',
    category: 'Full Lectures',
    provider: 'Physics Wallah (Alakh Pandey)',
    hours: 140,
    priority: 'Foundational Depth, Derivations & Direct Numerical Problem Solving',
    description: 'The legendary whiteboard lecture series by Alakh Pandey covering complete Mechanics, Electrostatics, Magnetism, Optics, and Modern Physics.',
    tags: ['Physics', 'Alakh Pandey', 'Full Lectures', 'Free']
  },
  {
    id: 'vid-physics-galaxy-ashish-arora',
    title: 'Physics Galaxy (Ashish Arora Sir) — Complete Concept Video Library',
    url: 'https://www.youtube.com/results?search_query=physics+galaxy+concept+videos+neet+physics',
    subject: 'Physics',
    type: 'Concept Mastery',
    category: 'Full Lectures',
    provider: 'Physics Galaxy (Ashish Arora)',
    hours: 95,
    priority: '700+ Concise 10-15 Min Crystal-Clear Conceptual Visuals',
    description: 'Renowned Kota mentor Ashish Arora explains every minute physics phenomenon with real illustrations and mathematical intuition without time waste.',
    tags: ['Physics Galaxy', 'Concept Videos', 'Ashish Arora', 'Physics']
  },
  {
    id: 'vid-abj-sir-physics',
    title: 'ABJ Sir (Mohit Tyagi) — Deep Analytical Physics for Tricky Numericals',
    url: 'https://www.youtube.com/results?search_query=abj+sir+physics+playlist+mohit+tyagi',
    subject: 'Physics',
    type: 'In-Depth Numericals',
    category: 'Full Lectures',
    provider: 'Mohit Tyagi / ABJ Sir',
    hours: 110,
    priority: 'Flawless Vector Mathematics, Mechanics & Electrodynamics Rigor',
    description: 'Comprehensive, distraction-free lecture series focusing on systematic derivation and multi-step numerical problem solving.',
    tags: ['ABJ Sir', 'Deep Numericals', 'Physics', 'Free']
  },
  {
    id: 'vid-pw-ummeed-phy-oneshot',
    title: 'PW Ummeed & Manzil — Physics Complete NCERT One-Shot Marathons',
    url: 'https://www.youtube.com/results?search_query=ummeed+physics+one+shot+neet+playlist',
    subject: 'Physics',
    type: 'One-Shot Revision',
    category: 'One-Shots',
    provider: 'PW Ummeed Series',
    hours: 75,
    priority: 'Complete Chapter in 3-4 Hours with Top 50 PYQs & Formulas',
    description: 'Fast-paced one-shot revisions of each chapter designed specifically for rapid revision and formula retention.',
    tags: ['Ummeed', 'OneShot', 'Physics', 'PYQs']
  },

  // =========================================================================
  // 🧪 CHEMISTRY MASTERCLASSES & FREE YOUTUBE LECTURES
  // =========================================================================
  {
    id: 'vid-pankaj-sir-chemistry',
    title: 'Pankaj Sir Chemistry — Complete Organic, Inorganic & Physical Lectures',
    url: 'https://www.youtube.com/results?search_query=pankaj+sir+chemistry+neet+full+playlist',
    subject: 'Chemistry',
    type: 'Full Video Lectures',
    category: 'Full Lectures',
    provider: 'Pankaj Sir Chemistry',
    hours: 130,
    priority: 'GOC, Reaction Mechanisms, Organic Roadmaps & Inorganic Line-by-Line',
    description: 'Crystal-clear chemistry lectures with step-by-step electron movement in organic mechanisms and memory mnemonics for inorganic periodic trends.',
    tags: ['Pankaj Sir', 'Organic', 'Inorganic', 'Chemistry', 'Free']
  },
  {
    id: 'vid-paaras-sir-inorganic',
    title: 'Canvas Classes (Paaras Sir) — NCERT Line-by-Line Inorganic Chemistry',
    url: 'https://www.youtube.com/results?search_query=canvas+classes+paaras+thakur+inorganic+chemistry',
    subject: 'Chemistry',
    type: 'NCERT Line Decoder',
    category: 'Full Lectures',
    provider: 'Paaras Thakur (Canvas Classes)',
    hours: 80,
    priority: 'Coordination Compounds, Chemical Bonding, p-Block & d-Block NCERT Exact Lines',
    description: 'Dedicated to reading and explaining every single NCERT statement, exception, table, and color code in inorganic chemistry.',
    tags: ['Inorganic', 'NCERT Line-by-Line', 'Paaras Sir', 'Chemistry']
  },
  {
    id: 'vid-bharat-panchal-chemistry',
    title: 'Bharat Panchal Sir — 100 Reaction Maps & Chemistry One-Shots',
    url: 'https://www.youtube.com/results?search_query=bharat+panchal+chemistry+neet+one+shot',
    subject: 'Chemistry',
    type: 'One-Shot Revision',
    category: 'One-Shots',
    provider: 'Bharat Panchal',
    hours: 65,
    priority: 'Organic Reaction Flowcharts, Physical Formula Sheets & Quick Revisions',
    description: 'Handwritten reaction roadmaps and quick revision sessions covering the entire Class 11 and 12 chemistry syllabus.',
    tags: ['Bharat Panchal', 'Reaction Maps', 'OneShot', 'Chemistry']
  },
  {
    id: 'vid-pw-ummeed-chem-oneshot',
    title: 'PW Ummeed Chemistry One-Shots (Sudhanshu Sir & Mohit Ryan Sir)',
    url: 'https://www.youtube.com/results?search_query=ummeed+chemistry+one+shot+neet+playlist',
    subject: 'Chemistry',
    type: 'One-Shot Revision',
    category: 'One-Shots',
    provider: 'PW Ummeed Chemistry',
    hours: 70,
    priority: 'Physical Chemistry Calculations & Organic Conversion Shortcuts',
    description: 'High-yield 3-4 hour one-shots per chapter covering theoretical concepts, numerical tricks, and previous year question trends.',
    tags: ['Ummeed', 'Chemistry', 'OneShot', 'Sudhanshu Sir']
  },

  // =========================================================================
  // 🌿 BOTANY MASTERCLASSES & FREE YOUTUBE LECTURES
  // =========================================================================
  {
    id: 'vid-tarun-sir-botany-master',
    title: 'Tarun Sir Botany — Complete NCERT Line-by-Line Botany Series',
    url: 'https://www.youtube.com/results?search_query=tarun+sir+botany+neet+full+playlist',
    subject: 'Botany',
    type: 'Full Video Lectures',
    category: 'Full Lectures',
    provider: 'Tarun Sir (Sankalp Bharat / PW)',
    hours: 95,
    priority: 'Genetics, Molecular Basis, Plant Physiology, Biotechnology & Ecology Master',
    description: 'India top-rated botany faculty explaining intricate botanical concepts with pure NCERT boundary, handmade diagrams, and zero out-of-syllabus fluff.',
    tags: ['Tarun Sir', 'Botany', 'Genetics', 'NCERT Pure', 'Free']
  },
  {
    id: 'vid-vipin-sharma-ozone',
    title: 'Dr. Vipin Sharma (Ozone Classes) — Word-to-Word NCERT Biology Series',
    url: 'https://www.youtube.com/results?search_query=dr+vipin+sharma+ozone+classes+ncert+line+by+line',
    subject: 'Botany',
    type: 'NCERT Line Decoder',
    category: 'Full Lectures',
    provider: 'Dr. Vipin Sharma (Ozone Classes)',
    hours: 85,
    priority: 'NCERT Textbook Open-Book Reading with Important Word Highlighting',
    description: 'Complete video walkthrough with on-screen NCERT PDF highlighting every potential MCQ line and hidden meaning.',
    tags: ['Vipin Sharma', 'NCERT Word-to-Word', 'Botany', 'Biology']
  },
  {
    id: 'vid-anand-mani-botany',
    title: 'Dr. Anand Mani — Botany Concept & Diagram Masterclasses',
    url: 'https://www.youtube.com/results?search_query=dr+anand+mani+botany+neet+playlist',
    subject: 'Botany',
    type: 'Concept Mastery',
    category: 'Full Lectures',
    provider: 'Dr. Anand Mani',
    hours: 75,
    priority: 'Plant Kingdom, Morphology, Anatomy & Cell Division Visual Mastery',
    description: 'High-energy, focused botany lectures with detailed breakdowns of NCERT diagrams and scientific terminology.',
    tags: ['Anand Mani', 'Botany', 'Diagrams', 'Free']
  },

  // =========================================================================
  // 🦁 ZOOLOGY MASTERCLASSES & FREE YOUTUBE LECTURES
  // =========================================================================
  {
    id: 'vid-seep-pahuja-zoology',
    title: 'Dr. Seep Pahuja — Zoology NCERT Decoded & Human Physiology Masterclass',
    url: 'https://www.youtube.com/results?search_query=seep+pahuja+zoology+full+playlist',
    subject: 'Zoology',
    type: 'Full Video Lectures',
    category: 'Full Lectures',
    provider: 'Dr. Seep Pahuja (Unacademy NEET)',
    hours: 90,
    priority: 'Human Physiology, Animal Kingdom, Evolution & Human Reproduction Specialist',
    description: 'Detailed NCERT line-by-line coverage with memory flowcharts, clinical correlations, and 100% adherence to NTA guidelines.',
    tags: ['Seep Pahuja', 'Zoology', 'Human Physiology', 'NCERT Decoded']
  },
  {
    id: 'vid-sachin-kapur-zoology',
    title: 'Dr. Sachin Kapur — 30+ Years Experienced Medical Faculty Zoology Lectures',
    url: 'https://www.youtube.com/results?search_query=dr+sachin+kapur+zoology+neet+lectures',
    subject: 'Zoology',
    type: 'Clinical & Conceptual',
    category: 'Full Lectures',
    provider: 'Dr. Sachin Kapur',
    hours: 80,
    priority: 'Deep Conceptual Physiology & Animal Tissue Classification with AIIMS Pedagogy',
    description: 'Senior medical educator teaching Zoology with anatomical precision, helping students understand why physiological mechanisms work.',
    tags: ['Sachin Kapur', 'AIIMS Faculty', 'Zoology', 'Free']
  },
  {
    id: 'vid-garima-goel-zoology',
    title: 'Dr. Garima Goel — Zoology NCERT Nichod & Fast-Track Revisions',
    url: 'https://www.youtube.com/results?search_query=garima+goel+zoology+neet+playlist',
    subject: 'Zoology',
    type: 'One-Shot Revision',
    category: 'One-Shots',
    provider: 'Dr. Garima Goel',
    hours: 65,
    priority: 'High-Speed Rapid Revision of Examples, Exceptions & Diagram Traps',
    description: 'Rapid recall series designed to memorize all animal kingdom examples, physiological hormone tables, and reproductive stages in record time.',
    tags: ['Garima Goel', 'Zoology', 'NCERT Nichod', 'Revision']
  },

  // =========================================================================
  // 🎯 PYQ & ASSERTION-REASON VIDEO SOLVING SERIES
  // =========================================================================
  {
    id: 'vid-neet-10yr-pyq-solutions',
    title: 'NEET 10-Year (2014–2024) Chapterwise PYQ Video Solutions Series',
    url: 'https://www.youtube.com/results?search_query=neet+10+year+pyq+chapterwise+solutions+playlist',
    subject: 'All Subjects',
    type: 'PYQ Video Solutions',
    category: 'PYQ Video Solutions',
    provider: 'NEET PYQ Vault',
    hours: 80,
    priority: 'Detailed Step-by-Step Video Explanations for Over 2,000 NEET MCQs',
    description: 'Comprehensive video solving of past 10 years NEET questions with elimination techniques, calculation shortcuts, and trap alerts.',
    tags: ['PYQ Solutions', '10 Years', 'MCQs', 'All Subjects']
  },
  {
    id: 'vid-ar-statement-video-tricks',
    title: 'Assertion-Reason & Statement 1 / Statement 2 Elimination Strategy Masterclass',
    url: 'https://www.youtube.com/results?search_query=assertion+reason+statement+questions+neet+tricks+playlist',
    subject: 'All Subjects',
    type: 'A/R Strategy Video',
    category: 'PYQ Video Solutions',
    provider: 'NTA Special Workshop',
    hours: 30,
    priority: 'Zero-Negative Marking Framework for Assertion-Reason & Statement I/II Traps',
    description: 'Proven logical techniques to avoid getting tricked by subtle NCERT wording differences in modern NTA assertion-reason questions.',
    tags: ['Assertion-Reason', 'Statement Traps', 'Strategy', 'Free']
  },

  // =========================================================================
  // 📖 STANDARD REFERENCE BOOKS & QUESTION ARCHIVES
  // =========================================================================
  {
    id: 'res-hcv-physics',
    title: 'HC Verma — Concepts of Physics (Vol 1 & Vol 2 Guidelines & Solutions)',
    url: 'https://archive.org/details/concepts-of-physics-h-c-verma',
    subject: 'Physics',
    type: 'Reference Guide',
    category: 'Question Banks',
    provider: 'HC Verma Archive',
    hours: 50,
    priority: 'Foundational Mechanics, Electrodynamics & Optics Conceptual Depth',
    description: 'Classic physics reference text for building rock-solid numerical fundamentals.',
    tags: ['HC Verma', 'Numericals', 'Physics']
  },
  {
    id: 'res-neetprep-questions',
    title: 'NeetPrep — High-Yield NCERT Filtered Question Bank & PYQ Analyzer',
    url: 'https://www.neetprep.com/',
    subject: 'All Subjects',
    type: 'Practice Portal',
    category: 'Question Banks',
    provider: 'NeetPrep Free Track',
    hours: 80,
    priority: 'Line-by-Line NCERT Target Questions with Filterable Error Logs',
    description: 'Online practice portal with NCERT line-referenced questions for self-assessment.',
    tags: ['NeetPrep', 'PYQs', 'Online Bank']
  },
  {
    id: 'res-nta-pyq-official',
    title: 'NTA NEET UG Official Past 10 Years Question Papers & Answer Keys',
    url: 'https://nta.ac.in/Downloads',
    subject: 'All Subjects',
    type: 'Official PYQs',
    category: 'Official NCERT',
    provider: 'National Testing Agency (NTA)',
    hours: 50,
    priority: 'Mandatory 2013-2025 Original Papers Solving in Timed Mode',
    description: 'Direct official PDFs of previous year question papers released by NTA.',
    tags: ['Official', 'NTA', 'PYQ', 'Free']
  }
];

function getResourcesBySubject(subject, category = 'All') {
  let list = NEET_RESOURCES;
  if (subject && subject !== 'All') {
    list = list.filter(r => r.subject.includes(subject) || r.subject === 'All Subjects');
  }
  if (category && category !== 'All') {
    list = list.filter(r => r.category === category || r.type === category);
  }
  return list;
}

if (typeof module !== 'undefined') {
  module.exports = { NEET_RESOURCES, getResourcesBySubject };
}

