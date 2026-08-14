require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Tried gemini-1.5-flash");
  } catch(e) {}
  
  // Actually, we can't easily list models in the Node SDK without googleapis package.
  // But let's just try 'gemini-1.5-flash-8b' or 'gemini-1.5-pro' again.
}
run();
