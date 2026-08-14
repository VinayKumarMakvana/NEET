const express = require('express');
const path = require('path');
// Vercel auto-injects env vars, no need for dotenv file traversal
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
const dns = require('dns');
// Force Google DNS to bypass ISP block for MongoDB Atlas
// dns.setServers(['8.8.8.8', '8.8.4.4']); // REMOVED: Breaks Vercel AWS Lambda DNS resolution

// Import new Mongoose models
const { User, Question, Progress, Transaction } = require('./models');

const app = express();
const port = process.env.PORT || 3028;

app.use(cors());
app.use(express.json({ limit: '5mb' })); // Reduced limit to prevent Vercel payload too large crashes

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/neet2028';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// ==========================================
// NEW PROGRESS API (MongoDB ONLY)
// ==========================================
app.post('/api/progress', async (req, res) => {
  try {
    const { userId, appState } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    
    await Progress.findOneAndUpdate(
      { userId },
      { appState, lastUpdated: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: 'Progress saved securely to cloud.' });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Server error saving progress.' });
  }
});

app.get('/api/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await Progress.findOne({ userId });
    if (!progress) return res.json({ success: true, appState: null });
    res.json({ success: true, appState: progress.appState });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Server error fetching progress.' });
  }
});

// ==========================================
// REFACTORED APIs (SQLite -> Mongoose)
// ==========================================

// Fetch questions
app.post('/api/questions', async (req, res) => {
  try {
    const { count, subjectCode, chapter, tag } = req.query;
    const { excludeIds } = req.body || {};
    const limit = count ? parseInt(count) : 200;
    
    let query = {};
    if (subjectCode && subjectCode !== 'all') query.subjectCode = subjectCode;
    if (chapter) query.chapter = chapter;
    if (tag) query.tag = tag;
    if (excludeIds && excludeIds.length > 0) {
      query.internal_id = { $nin: excludeIds };
    }
    
    // Use aggregation to get a random sample
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: limit } }
    ]);
    
    res.json(questions);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const count = await Question.countDocuments();
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: 'Database connection failed. Vercel environment variable MONGO_URI is missing or Atlas IP is blocked.' });
    }
    const { name, emailOrPhone, pin } = req.body;
    const id = 'user_' + Date.now();
    const isEmail = emailOrPhone.includes('@');
    
    const newUser = new User({
      id,
      name: name || 'Student',
      phone: isEmail ? undefined : emailOrPhone,
      email: isEmail ? emailOrPhone : undefined,
      pin,
      role: 'free'
    });
    
    await newUser.save();
    res.json({ success: true, user: { id, name: newUser.name, role: 'free' } });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Account already exists' });
    console.error('Registration Error:', err);
      res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: 'Database connection failed. Vercel environment variable MONGO_URI is missing or Atlas IP is blocked.' });
    }
    const { emailOrPhone, pin } = req.body;
    if (!emailOrPhone || !pin) return res.status(400).json({ error: 'Missing credentials' });
    
    const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (user.pin !== pin) return res.status(401).json({ error: 'Incorrect PIN' });
    
    res.json({ success: true, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/check-session', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing parameters' });
    
    const user = await User.findOne({ id: userId });
    if (!user) return res.json({ success: false });
    
    res.json({ success: true, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/payment/submit-utr', async (req, res) => {
  try {
    const { userId, utr, amount } = req.body;
    const tx = new Transaction({ id: 'tx_' + Date.now(), userId, utr, amount, status: 'pending' });
    await tx.save();
    res.json({ success: true, message: 'UTR submitted for verification' });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'UTR already submitted' });
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/config', (req, res) => {
  res.json({
    upiId: process.env.UPI_ID || 'vinay.makvana@ptyes',
    upiName: process.env.UPI_NAME || 'Vinay Makvana',
    amount: process.env.PREMIUM_AMOUNT || '99',
    supportPhone: process.env.SUPPORT_PHONE || '+91-9999999999',
    database: 'MongoDB'
  });
});

// Catch-all route to prevent empty responses or HTML 404s on Vercel
app.use((req, res) => {
  res.status(404).json({ 
    error: `API Route not found: ${req.method} ${req.url}. This usually means Vercel rewrite did not match the Express route.` 
  });
});

// Always export for Vercel Serverless
module.exports = app;

