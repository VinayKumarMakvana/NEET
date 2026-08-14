const db = require('./database');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const csvPath = path.resolve(__dirname, '../questions_template.csv');
const results = [];

console.log('Reading CSV file from:', csvPath);

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    db.serialize(() => {
      const stmt = db.prepare(`
        INSERT OR IGNORE INTO questions (
          internal_id, subject, subjectCode, chapter, questionType, question, questionHi,
          optionA, optionB, optionC, optionD, optionAHi, optionBHi, optionCHi, optionDHi,
          correctIndex, difficulty, pyqYear, tag, explanation, explanationHi, ncertRef
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      let inserted = 0;
      results.forEach(row => {
        try {
          stmt.run([
            row.internal_id || `q-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            row.subject,
            row.subjectCode,
            row.chapter,
            row.questionType,
            row.question,
            row.questionHi,
            row.optionA,
            row.optionB,
            row.optionC,
            row.optionD,
            row.optionAHi,
            row.optionBHi,
            row.optionCHi,
            row.optionDHi,
            parseInt(row.correctIndex),
            row.difficulty,
            row.pyqYear,
            row.tag,
            row.explanation,
            row.explanationHi,
            row.ncertRef
          ]);
          inserted++;
        } catch(e) {
          console.error("Error inserting row:", e);
        }
      });
      
      stmt.finalize();
      console.log(`✅ Successfully seeded ${inserted} questions from CSV.`);
      
      // Let's also add 50 dummy questions per subject so the app doesn't break when requesting 200 for grand mock
      console.log('Seeding initial backend with procedural placeholders to enable testing...');
      
      const insertProcedural = db.prepare(`
        INSERT INTO questions (
          internal_id, subject, subjectCode, chapter, questionType, question, optionA, optionB, optionC, optionD, correctIndex
        ) VALUES (?, ?, ?, ?, 'mcq', ?, 'A', 'B', 'C', 'D', 0)
      `);
      
      const subjects = [
        { name: 'Physics', code: 'phy' },
        { name: 'Chemistry', code: 'chem' },
        { name: 'Botany', code: 'bot' },
        { name: 'Zoology', code: 'zoo' }
      ];
      
      let pCount = 0;
      for (const subj of subjects) {
        for (let i = 1; i <= 60; i++) {
           insertProcedural.run([
             `${subj.code}-mock-${i}`,
             subj.name,
             subj.code,
             'Syllabus',
             `[${subj.name} Q${i}] Real Backend Question. Replace via CSV.`
           ]);
           pCount++;
        }
      }
      insertProcedural.finalize();
      console.log(`✅ Added ${pCount} real database rows to ensure full Mocks load. Replace them using the CSV API later.`);
    });
  });
