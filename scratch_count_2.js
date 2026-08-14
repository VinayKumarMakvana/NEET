require('./js/questions-data.js'); // Assuming questions-data.js sets NEET_QUESTIONS globally
// Since it's in the browser, let's mock window/global
const fs = require('fs');
const code = fs.readFileSync('./js/questions-data.js', 'utf8');

// evaluate the file
eval(code);

if (typeof NEET_QUESTIONS !== 'undefined') {
  const topics = new Set();
  let count = 0;
  for (let q of NEET_QUESTIONS) {
    if (q && q.topic) {
      topics.add(q.topic);
      count++;
    }
  }
  console.log(`Total explicit questions: ${count}`);
  console.log(`Unique Topics covered: ${topics.size}`);
  console.log(`Topics Remaining out of 357: ${357 - topics.size}`);
} else {
  console.log('NEET_QUESTIONS not found in eval.');
}
