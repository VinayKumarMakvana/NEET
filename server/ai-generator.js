require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('./database');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.error("❌ ERROR: Please set GEMINI_API_KEY in the .env file.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

// Load Syllabus Topics
const syllabusData = JSON.parse(fs.readFileSync(path.join(__dirname, 'syllabus.json'), 'utf-8'));

const promptTemplate = `
You are an elite coaching director for NEET UG in India. Your goal is to design an ultra-hard, conceptual, NTA-level assertion-reason or statement-based question that guarantees selection for top AIIMS students. Do NOT write simple fact-based questions. Write traps.

Subject: {SUBJECT}
Chapter: {CHAPTER}
Topic to focus strictly on: {TOPIC}

Return EXACTLY a JSON array containing 5 extremely high-quality questions for this specific topic. The output MUST be raw JSON without any markdown formatting like \`\`\`json.
Each question MUST have this exact schema:
[
  {
    "subject": "{SUBJECT}",
    "subjectCode": "{SUBJECT_CODE}",
    "chapter": "{CHAPTER}",
    "tag": "{TOPIC}",
    "questionType": "assertion-reason", // or "statement", "match"
    "question": "Question in English",
    "questionHi": "Question properly translated in Hindi",
    "optionA": "English option 1",
    "optionB": "English option 2",
    "optionC": "English option 3",
    "optionD": "English option 4",
    "optionAHi": "Hindi option 1",
    "optionBHi": "Hindi option 2",
    "optionCHi": "Hindi option 3",
    "optionDHi": "Hindi option 4",
    "correctIndex": 0, // 0 for A, 1 for B, 2 for C, 3 for D
    "difficulty": "Hard",
    "pyqYear": "NTA Director Level",
    "explanation": "Detailed explanation in English",
    "explanationHi": "Detailed explanation in Hindi",
    "ncertRef": "Exact NCERT Class & Chapter reference"
  }
]
`;

async function generateQuestions() {
  console.log("🚀 Starting Autonomous Topic-Wise AI Question Generator...");
  console.log(`Found ${syllabusData.length} unique topics across the syllabus.`);
  
  const ITERATIONS = 3; // 3 iterations * 357 topics * 5 questions = ~5355 questions
  
  for (let iter = 1; iter <= ITERATIONS; iter++) {
    console.log(`\\n\\n🔄 STARTING SYLLABUS SWEEP ITERATION ${iter} OF ${ITERATIONS}...\\n`);
    
    for (let i = 0; i < syllabusData.length; i++) {
      const item = syllabusData[i];
      console.log(`\\n[Iter ${iter}] [${i+1}/${syllabusData.length}] 🧠 Generating 5 Qs for Topic: "${item.topic}" (Chapter: ${item.chapter})...`);
      
      const prompt = promptTemplate
        .replaceAll('{SUBJECT}', item.subject)
        .replaceAll('{SUBJECT_CODE}', item.subjectCode)
        .replaceAll('{CHAPTER}', item.chapter)
        .replaceAll('{TOPIC}', item.topic);
        
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();
        
        if (text.startsWith('\`\`\`json')) text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
        if (text.startsWith('\`\`\`')) text = text.replace(/\`\`\`/g, '');
        
        const qArray = JSON.parse(text);
        
        db.serialize(() => {
          const stmt = db.prepare(`
            INSERT INTO questions (
              internal_id, subject, subjectCode, chapter, questionType, question, questionHi,
              optionA, optionB, optionC, optionD, optionAHi, optionBHi, optionCHi, optionDHi,
              correctIndex, difficulty, pyqYear, tag, explanation, explanationHi, ncertRef
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          
          qArray.forEach(q => {
            stmt.run([
              `q-ai-${Date.now()}-${Math.random().toString(36).substr(2,5)}`,
              q.subject, q.subjectCode, q.chapter, q.questionType, q.question, q.questionHi,
              q.optionA, q.optionB, q.optionC, q.optionD, q.optionAHi, q.optionBHi, q.optionCHi, q.optionDHi,
              q.correctIndex, q.difficulty, q.pyqYear, item.topic, q.explanation, q.explanationHi, q.ncertRef
            ]);
          });
          
          stmt.finalize();
        });
        console.log(`✅ Saved ${qArray.length} ultra-hard questions for "${item.topic}".`);
        
        await new Promise(r => setTimeout(r, 4000));
        
      } catch (err) {
        console.error(`❌ Error on ${item.topic}:`, err.message);
      }
    }
  }
  
  console.log("\\n🎉 MEGA GENERATION COMPLETE! All 5000+ AI-generated questions are in the database.");
}

generateQuestions();
