const fs = require('fs');

const code = fs.readFileSync('js/questions-data.js', 'utf8');
const match = code.match(/const NEET_QUESTIONS_DB = (\{[\s\S]*?\});/);

if (match) {
  try {
    const db = eval('(' + match[1] + ')');
    let topics = 0;
    let qs = 0;
    for (const sub in db) {
      for (const top in db[sub]) {
        topics++;
        qs += db[sub][top].length;
      }
    }
    console.log(`Completed Topics: ${topics} / 357`);
    console.log(`Total Questions: ${qs}`);
  } catch(e) {
    console.error('Eval error', e);
  }
} else {
  console.log('DB not found');
}
