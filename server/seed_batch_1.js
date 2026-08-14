const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const batchQuestions = [
  // Topic 1: Free Body Diagrams (FBD)
  {
    subject: "Physics",
    subjectCode: "phy",
    chapter: "Laws of Motion & Friction",
    tag: "Free Body Diagrams (FBD)",
    questionType: "assertion-reason",
    question: "Assertion (A): A book resting on a table exerts a downward force on the table, and the table exerts an equal and opposite upward normal force on the book. These two forces form an action-reaction pair.\nReason (R): Newton's third law states that action and reaction always act on different bodies and are equal in magnitude and opposite in direction.",
    questionHi: "अभिकथन (A): मेज पर रखी एक पुस्तक मेज पर नीचे की ओर बल लगाती है, और मेज पुस्तक पर समान और विपरीत ऊपर की ओर अभिलंब बल लगाती है। ये दोनों बल एक क्रिया-प्रतिक्रिया युग्म बनाते हैं।\nकारण (R): न्यूटन का तीसरा नियम कहता है कि क्रिया और प्रतिक्रिया हमेशा अलग-अलग पिंडों पर कार्य करते हैं और परिमाण में समान और दिशा में विपरीत होते हैं।",
    optionA: "Both A and R are true and R is the correct explanation of A",
    optionB: "Both A and R are true but R is NOT the correct explanation of A",
    optionC: "A is true but R is false",
    optionD: "A is false but R is true",
    optionAHi: "A और R दोनों सत्य हैं और R, A की सही व्याख्या है",
    optionBHi: "A और R दोनों सत्य हैं लेकिन R, A की सही व्याख्या नहीं है",
    optionCHi: "A सत्य है लेकिन R असत्य है",
    optionDHi: "A असत्य है लेकिन R सत्य है",
    correctIndex: 0,
    difficulty: "Medium",
    pyqYear: "NTA Conceptual",
    explanation: "The force the book exerts on the table and the normal force the table exerts on the book are acting on different bodies. Thus, they form a perfect action-reaction pair according to Newton's 3rd Law.",
    explanationHi: "पुस्तक द्वारा मेज पर लगाया गया बल और मेज द्वारा पुस्तक पर लगाया गया अभिलंब बल अलग-अलग पिंडों पर कार्य कर रहे हैं। इस प्रकार, वे न्यूटन के तीसरे नियम के अनुसार एक पूर्ण क्रिया-प्रतिक्रिया युग्म बनाते हैं।",
    ncertRef: "Class 11 Physics, Chapter 5"
  },
  {
    subject: "Physics",
    subjectCode: "phy",
    chapter: "Laws of Motion & Friction",
    tag: "Free Body Diagrams (FBD)",
    questionType: "statement",
    question: "Statement I: In a free body diagram (FBD) of a body, only the forces acting ON the body are shown, not the forces exerted BY the body.\nStatement II: Internal forces between the particles of a rigid body must be included in its FBD to accurately determine its translation motion.",
    questionHi: "कथन I: किसी पिंड के मुक्त पिंड आरेख (FBD) में, केवल पिंड पर कार्य करने वाले बलों को दर्शाया जाता है, पिंड द्वारा लगाए गए बलों को नहीं।\nकथन II: किसी दृढ़ पिंड के कणों के बीच के आंतरिक बलों को उसकी स्थानांतरीय गति का सटीक निर्धारण करने के लिए उसके FBD में शामिल किया जाना चाहिए।",
    optionA: "Both Statement I and Statement II are correct",
    optionB: "Both Statement I and Statement II are incorrect",
    optionC: "Statement I is correct but Statement II is incorrect",
    optionD: "Statement I is incorrect but Statement II is correct",
    optionAHi: "कथन I और कथन II दोनों सही हैं",
    optionBHi: "कथन I और कथन II दोनों गलत हैं",
    optionCHi: "कथन I सही है लेकिन कथन II गलत है",
    optionDHi: "कथन I गलत है लेकिन कथन II सही है",
    correctIndex: 2,
    difficulty: "Medium",
    pyqYear: "NEET Expected Trap",
    explanation: "Statement I is correct. Statement II is false because internal forces cancel each other out in pairs (Newton's 3rd law) and do not affect the translational motion of the center of mass.",
    explanationHi: "कथन I सही है। कथन II गलत है क्योंकि आंतरिक बल जोड़े में एक-दूसरे को रद्द कर देते हैं (न्यूटन का तीसरा नियम) और द्रव्यमान केंद्र की स्थानांतरीय गति को प्रभावित नहीं करते हैं।",
    ncertRef: "Class 11 Physics, Chapter 5"
  },
  
  // Topic 2: Pulley-Mass Systems
  {
    subject: "Physics",
    subjectCode: "phy",
    chapter: "Laws of Motion & Friction",
    tag: "Pulley-Mass Systems",
    questionType: "statement",
    question: "Statement I: In an ideal Atwood machine (massless, frictionless pulley), the tension in the string is strictly equal to the arithmetic mean of the weights of the two masses.\nStatement II: The acceleration of the system is given by the difference in weights divided by the total mass.",
    questionHi: "कथन I: एक आदर्श एटवुड मशीन (द्रव्यमानहीन, घर्षण रहित घिरनी) में, डोरी में तनाव सख्ती से दोनों द्रव्यमानों के भार के अंकगणितीय माध्य के बराबर होता है।\nकथन II: निकाय का त्वरण भार में अंतर को कुल द्रव्यमान से विभाजित करने पर प्राप्त होता है।",
    optionA: "Both Statement I and Statement II are correct",
    optionB: "Both Statement I and Statement II are incorrect",
    optionC: "Statement I is correct but Statement II is incorrect",
    optionD: "Statement I is incorrect but Statement II is correct",
    optionAHi: "कथन I और कथन II दोनों सही हैं",
    optionBHi: "कथन I और कथन II दोनों गलत हैं",
    optionCHi: "कथन I सही है लेकिन कथन II गलत है",
    optionDHi: "कथन I गलत है लेकिन कथन II सही है",
    correctIndex: 3,
    difficulty: "Hard",
    pyqYear: "NEET High Yield",
    explanation: "Statement I is false. Tension T = 2m1m2g / (m1+m2), which is the HARMONIC mean of the weights, not arithmetic mean. Statement II is true: a = (m1-m2)g / (m1+m2).",
    explanationHi: "कथन I गलत है। तनाव T = 2m1m2g / (m1+m2), जो भारों का हरात्मक माध्य (Harmonic mean) है, न कि अंकगणितीय माध्य। कथन II सत्य है: a = (m1-m2)g / (m1+m2)।",
    ncertRef: "Class 11 Physics, Chapter 5"
  },
  
  // Topic 3: Static/Kinetic Friction & Angle of Repose
  {
    subject: "Physics",
    subjectCode: "phy",
    chapter: "Laws of Motion & Friction",
    tag: "Static/Kinetic Friction & Angle of Repose",
    questionType: "assertion-reason",
    question: "Assertion (A): Static friction is a self-adjusting force up to a certain limit.\nReason (R): The coefficient of static friction is always strictly less than the coefficient of kinetic friction for a given pair of surfaces.",
    questionHi: "अभिकथन (A): स्थैतिक घर्षण एक निश्चित सीमा तक स्व-समायोज्य बल है।\nकारण (R): दिए गए सतहों के युग्म के लिए स्थैतिक घर्षण गुणांक हमेशा गतिज घर्षण गुणांक से सख्ती से कम होता है।",
    optionA: "Both A and R are true and R is the correct explanation of A",
    optionB: "Both A and R are true but R is NOT the correct explanation of A",
    optionC: "A is true but R is false",
    optionD: "A is false but R is true",
    optionAHi: "A और R दोनों सत्य हैं और R, A की सही व्याख्या है",
    optionBHi: "A और R दोनों सत्य हैं लेकिन R, A की सही व्याख्या नहीं है",
    optionCHi: "A सत्य है लेकिन R असत्य है",
    optionDHi: "A असत्य है लेकिन R सत्य है",
    correctIndex: 2,
    difficulty: "Medium",
    pyqYear: "NCERT Exemplar",
    explanation: "Static friction adjusts itself to applied force until limiting friction. Reason is false because coefficient of static friction (μs) is always GREATER than coefficient of kinetic friction (μk).",
    explanationHi: "स्थैतिक घर्षण सीमांत घर्षण तक लगाए गए बल के अनुसार खुद को समायोजित करता है। कारण गलत है क्योंकि स्थैतिक घर्षण गुणांक (μs) हमेशा गतिज घर्षण गुणांक (μk) से अधिक होता है।",
    ncertRef: "Class 11 Physics, Chapter 5"
  },
  
  // Topic 4: Banking of Roads
  {
    subject: "Physics",
    subjectCode: "phy",
    chapter: "Laws of Motion & Friction",
    tag: "Banking of Roads",
    questionType: "statement",
    question: "Statement I: The optimum speed for negotiating a banked curve safely without any dependence on friction is v = √(rg tanθ).\nStatement II: If a vehicle travels at a speed greater than the optimum speed on a rough banked road, the static friction acts upwards along the incline.",
    questionHi: "कथन I: बिना घर्षण पर निर्भर हुए किसी बंकित वक्र को सुरक्षित रूप से पार करने के लिए इष्टतम चाल v = √(rg tanθ) है।\nकथन II: यदि कोई वाहन किसी खुरदरी बंकित सड़क पर इष्टतम चाल से अधिक चाल से चलता है, तो स्थैतिक घर्षण आनत तल के अनुदिश ऊपर की ओर कार्य करता है।",
    optionA: "Both Statement I and Statement II are correct",
    optionB: "Both Statement I and Statement II are incorrect",
    optionC: "Statement I is correct but Statement II is incorrect",
    optionD: "Statement I is incorrect but Statement II is correct",
    optionAHi: "कथन I और कथन II दोनों सही हैं",
    optionBHi: "कथन I और कथन II दोनों गलत हैं",
    optionCHi: "कथन I सही है लेकिन कथन II गलत है",
    optionDHi: "कथन I गलत है लेकिन कथन II सही है",
    correctIndex: 2,
    difficulty: "Hard",
    pyqYear: "NTA Director Trap",
    explanation: "Statement I is correct. Statement II is false: if speed > optimum, the vehicle tends to skid OUTWARDS (up the incline), so static friction acts DOWNWARDS along the incline to provide extra centripetal force.",
    explanationHi: "कथन I सही है। कथन II गलत है: यदि चाल > इष्टतम चाल, तो वाहन बाहर की ओर (आनत तल पर ऊपर) फिसलने की प्रवृत्ति रखता है, इसलिए स्थैतिक घर्षण अतिरिक्त अभिकेंद्र बल प्रदान करने के लिए आनत तल के अनुदिश नीचे की ओर कार्य करता है।",
    ncertRef: "Class 11 Physics, Chapter 5"
  },
  
  // Topic 5: Work-Energy Theorem
  {
    subject: "Physics",
    subjectCode: "phy",
    chapter: "Work, Energy and Power & Collisions",
    tag: "Work-Energy Theorem (W_all = ΔK)",
    questionType: "assertion-reason",
    question: "Assertion (A): The work-energy theorem is valid for non-inertial frames of reference provided pseudo forces are included.\nReason (R): Work done by all forces, including pseudo forces, equals the change in kinetic energy observed in that frame.",
    questionHi: "अभिकथन (A): कार्य-ऊर्जा प्रमेय अजड़त्वीय निर्देश तंत्रों के लिए मान्य है, बशर्ते छद्म बलों (pseudo forces) को शामिल किया जाए।\nकारण (R): छद्म बलों सहित सभी बलों द्वारा किया गया कार्य, उस फ्रेम में देखे गए गतिज ऊर्जा में परिवर्तन के बराबर होता है।",
    optionA: "Both A and R are true and R is the correct explanation of A",
    optionB: "Both A and R are true but R is NOT the correct explanation of A",
    optionC: "A is true but R is false",
    optionD: "A is false but R is true",
    optionAHi: "A और R दोनों सत्य हैं और R, A की सही व्याख्या है",
    optionBHi: "A और R दोनों सत्य हैं लेकिन R, A की सही व्याख्या नहीं है",
    optionCHi: "A सत्य है लेकिन R असत्य है",
    optionDHi: "A असत्य है लेकिन R सत्य है",
    correctIndex: 0,
    difficulty: "Hard",
    pyqYear: "Advanced Concept",
    explanation: "Work-Energy theorem is a universal consequence of Newton's second law. In a non-inertial frame, by introducing pseudo forces, Newton's second law holds, and thus the W-E theorem also holds.",
    explanationHi: "कार्य-ऊर्जा प्रमेय न्यूटन के दूसरे नियम का एक सार्वभौमिक परिणाम है। एक अजड़त्वीय फ्रेम में, छद्म बलों को शामिल करके न्यूटन का दूसरा नियम लागू होता है, और इस प्रकार कार्य-ऊर्जा प्रमेय भी मान्य होता है।",
    ncertRef: "Class 11 Physics, Chapter 6"
  }
];

db.serialize(() => {
  const stmt = db.prepare(`
    INSERT INTO questions (
      internal_id, subject, subjectCode, chapter, questionType, question, questionHi,
      optionA, optionB, optionC, optionD, optionAHi, optionBHi, optionCHi, optionDHi,
      correctIndex, difficulty, pyqYear, tag, explanation, explanationHi, ncertRef
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  batchQuestions.forEach(q => {
    const internal_id = `q-ai-manual-${Date.now()}-${Math.random().toString(36).substr(2,5)}`;
    stmt.run([
      internal_id, q.subject, q.subjectCode, q.chapter, q.questionType, q.question, q.questionHi,
      q.optionA, q.optionB, q.optionC, q.optionD, q.optionAHi, q.optionBHi, q.optionCHi, q.optionDHi,
      q.correctIndex, q.difficulty, q.pyqYear, q.tag, q.explanation, q.explanationHi, q.ncertRef
    ]);
  });
  
  stmt.finalize(() => {
    console.log(`✅ Successfully added ${batchQuestions.length} manual questions covering 5 NEW topics to database.sqlite!`);
    db.close();
  });
});
