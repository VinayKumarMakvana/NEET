const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./server/database.sqlite');

const newQuestions = [
  // Topic 1: Kinematic Equations
  {
    subject: "Physics",
    subjectCode: "phy",
    chapter: "Motion in a Straight Line (1D Kinematics)",
    tag: "Kinematic Equations (v=u+at, s=ut+1/2at²)",
    questionType: "assertion-reason",
    question: "Assertion (A): If a body is thrown vertically upwards, the distance covered in the last second of its upward journey is independent of its initial velocity.\nReason (R): The distance covered in the last second of an upward journey is always equal to the distance covered in the first second of its free fall from the highest point.",
    questionHi: "अभिकथन (A): यदि किसी पिंड को लंबवत ऊपर की ओर फेंका जाता है, तो उसकी ऊपर की यात्रा के अंतिम सेकंड में तय की गई दूरी उसके प्रारंभिक वेग से स्वतंत्र होती है।\nकारण (R): ऊपर की यात्रा के अंतिम सेकंड में तय की गई दूरी हमेशा उच्चतम बिंदु से उसके मुक्त पतन के पहले सेकंड में तय की गई दूरी के बराबर होती है।",
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
    pyqYear: "NTA Director Level",
    explanation: "Distance covered in the last 't' seconds of upward journey is independent of initial velocity and equals the distance covered in the first 't' seconds of free fall (1/2 * g * t^2). For t=1s, it is always ~4.9m.",
    explanationHi: "ऊपर की यात्रा के अंतिम 't' सेकंड में तय की गई दूरी प्रारंभिक वेग से स्वतंत्र होती है और मुक्त पतन के पहले 't' सेकंड में तय की गई दूरी (1/2 * g * t^2) के बराबर होती है। t=1s के लिए, यह हमेशा ~4.9m होती है।",
    ncertRef: "Class 11 Physics, Chapter 3"
  },
  {
    subject: "Physics",
    subjectCode: "phy",
    chapter: "Motion in a Straight Line (1D Kinematics)",
    tag: "Kinematic Equations (v=u+at, s=ut+1/2at²)",
    questionType: "statement",
    question: "Statement I: The displacement of a particle moving with uniform acceleration in a given time interval is always equal to the area under its velocity-time graph.\nStatement II: For a particle moving with uniform acceleration, its average velocity over a time interval is equal to the instantaneous velocity exactly at the midpoint of that time interval.",
    questionHi: "कथन I: किसी दिए गए समय अंतराल में एकसमान त्वरण के साथ गतिमान कण का विस्थापन हमेशा उसके वेग-समय ग्राफ के अंतर्गत क्षेत्रफल के बराबर होता है।\nकथन II: एकसमान त्वरण के साथ गतिमान कण के लिए, किसी समय अंतराल में इसका औसत वेग उस समय अंतराल के ठीक मध्य-बिंदु पर तात्कालिक वेग के बराबर होता है।",
    optionA: "Both Statement I and Statement II are correct",
    optionB: "Both Statement I and Statement II are incorrect",
    optionC: "Statement I is correct but Statement II is incorrect",
    optionD: "Statement I is incorrect but Statement II is correct",
    optionAHi: "कथन I और कथन II दोनों सही हैं",
    optionBHi: "कथन I और कथन II दोनों गलत हैं",
    optionCHi: "कथन I सही है लेकिन कथन II गलत है",
    optionDHi: "कथन I गलत है लेकिन कथन II सही है",
    correctIndex: 0,
    difficulty: "Medium",
    pyqYear: "NTA Director Level",
    explanation: "Area under v-t graph gives displacement. Also, for constant acceleration, v_avg = (u+v)/2, which is exactly the velocity at t_mid = (t_initial + t_final)/2.",
    explanationHi: "v-t ग्राफ के अंतर्गत क्षेत्रफल विस्थापन देता है। साथ ही, नियत त्वरण के लिए, v_avg = (u+v)/2, जो ठीक t_mid = (t_initial + t_final)/2 पर वेग है।",
    ncertRef: "Class 11 Physics, Chapter 3"
  },
  {
    subject: "Physics",
    subjectCode: "phy",
    chapter: "Motion in a Straight Line (1D Kinematics)",
    tag: "Kinematic Equations (v=u+at, s=ut+1/2at²)",
    questionType: "assertion-reason",
    question: "Assertion (A): A body falling freely under gravity covers distances in the ratio 1:3:5:7 in successive equal time intervals.\nReason (R): This is known as Galileo's law of odd numbers, which is valid only when initial velocity is zero and acceleration is constant.",
    questionHi: "अभिकथन (A): गुरुत्वाकर्षण के अधीन मुक्त रूप से गिरने वाला पिंड क्रमिक समान समय अंतरालों में 1:3:5:7 के अनुपात में दूरी तय करता है।\nकारण (R): इसे गैलीलियो का विषम संख्याओं का नियम कहा जाता है, जो केवल तभी मान्य होता है जब प्रारंभिक वेग शून्य हो और त्वरण नियत हो।",
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
    pyqYear: "NTA Director Level",
    explanation: "Galileo's law applies to any constant acceleration motion starting from rest. The distances in successive intervals 't' are proportional to 1:3:5:7...",
    explanationHi: "गैलीलियो का नियम विरामावस्था से शुरू होने वाली किसी भी नियत त्वरण गति पर लागू होता है। क्रमिक अंतरालों 't' में दूरियां 1:3:5:7... के समानुपाती होती हैं।",
    ncertRef: "Class 11 Physics, Chapter 3"
  },
  {
    subject: "Physics",
    subjectCode: "phy",
    chapter: "Motion in a Plane (2D Vectors & Projectiles)",
    tag: "Projectile Trajectory & Range",
    questionType: "statement",
    question: "Statement I: In projectile motion, the horizontal range is same for two angles of projection θ and (90°-θ), provided the initial speeds are equal.\nStatement II: The maximum height attained for both these complementary angles of projection is always equal.",
    questionHi: "कथन I: प्रक्षेप्य गति में, दो प्रक्षेप्य कोणों θ और (90°-θ) के लिए क्षैतिज परास समान होता है, बशर्ते प्रारंभिक चाल समान हो।\nकथन II: प्रक्षेप्य के इन दोनों पूरक कोणों के लिए प्राप्त अधिकतम ऊंचाई हमेशा समान होती है।",
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
    pyqYear: "NTA Director Level",
    explanation: "Ranges are equal because sin(2θ) = sin(2(90°-θ)). But maximum heights are H1 = (u²sin²θ)/2g and H2 = (u²cos²θ)/2g, which are different.",
    explanationHi: "परास समान होते हैं क्योंकि sin(2θ) = sin(2(90°-θ))। लेकिन अधिकतम ऊंचाइयां H1 = (u²sin²θ)/2g और H2 = (u²cos²θ)/2g हैं, जो भिन्न हैं।",
    ncertRef: "Class 11 Physics, Chapter 4"
  },
  {
    subject: "Physics",
    subjectCode: "phy",
    chapter: "Motion in a Plane (2D Vectors & Projectiles)",
    tag: "Projectile Trajectory & Range",
    questionType: "assertion-reason",
    question: "Assertion (A): The trajectory of a projectile is a parabola, independent of air resistance.\nReason (R): Air resistance decreases both the horizontal range and maximum height, altering the parabolic shape into a non-symmetrical curve.",
    questionHi: "अभिकथन (A): वायु प्रतिरोध से स्वतंत्र, प्रक्षेप्य का प्रक्षेप-पथ एक परवलय होता है।\nकारण (R): वायु प्रतिरोध क्षैतिज परास और अधिकतम ऊंचाई दोनों को कम कर देता है, जिससे परवलयिक आकार एक असममित वक्र में बदल जाता है।",
    optionA: "Both A and R are true and R is the correct explanation of A",
    optionB: "Both A and R are true but R is NOT the correct explanation of A",
    optionC: "A is true but R is false",
    optionD: "A is false but R is true",
    optionAHi: "A और R दोनों सत्य हैं और R, A की सही व्याख्या है",
    optionBHi: "A और R दोनों सत्य हैं लेकिन R, A की सही व्याख्या नहीं है",
    optionCHi: "A सत्य है लेकिन R असत्य है",
    optionDHi: "A असत्य है लेकिन R सत्य है",
    correctIndex: 3,
    difficulty: "Hard",
    pyqYear: "NTA Director Level",
    explanation: "Assertion is false. The trajectory is a pure parabola ONLY IF air resistance is neglected. When considered, the path becomes an asymmetrical curve (ballistic trajectory).",
    explanationHi: "अभिकथन असत्य है। प्रक्षेप-पथ एक शुद्ध परवलय केवल तभी होता है जब वायु प्रतिरोध को नगण्य माना जाए। जब विचार किया जाता है, तो पथ एक असममित वक्र (बैलिस्टिक प्रक्षेप-पथ) बन जाता है।",
    ncertRef: "Class 11 Physics, Chapter 4"
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
  
  newQuestions.forEach(q => {
    const internal_id = `q-ai-manual-${Date.now()}-${Math.random().toString(36).substr(2,5)}`;
    stmt.run([
      internal_id, q.subject, q.subjectCode, q.chapter, q.questionType, q.question, q.questionHi,
      q.optionA, q.optionB, q.optionC, q.optionD, q.optionAHi, q.optionBHi, q.optionCHi, q.optionDHi,
      q.correctIndex, q.difficulty, q.pyqYear, q.tag, q.explanation, q.explanationHi, q.ncertRef
    ]);
  });
  
  stmt.finalize(() => {
    console.log(`Successfully added ${newQuestions.length} manual questions covering 2 topics.`);
    db.close();
  });
});
