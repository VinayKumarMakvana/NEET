require('dotenv').config();
const https = require('https');

const apiKey = process.env.GEMINI_API_KEY;

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.models) {
        console.log("Available generateContent models:");
        json.models.filter(m => m.supportedGenerationMethods.includes("generateContent"))
                   .forEach(m => console.log(m.name));
      } else {
        console.log(json);
      }
    } catch(e) {
      console.error(e);
    }
  });
}).on('error', (err) => {
  console.error("Error: ", err.message);
});
