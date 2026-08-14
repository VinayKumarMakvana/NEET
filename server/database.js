const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.serialize(() => {
      // Create questions table
      db.run(`
        CREATE TABLE IF NOT EXISTS questions (
          internal_id TEXT PRIMARY KEY,
          subject TEXT,
          subjectCode TEXT,
          chapter TEXT,
          questionType TEXT,
          question TEXT,
          questionHi TEXT,
          optionA TEXT,
          optionB TEXT,
          optionC TEXT,
          optionD TEXT,
          optionAHi TEXT,
          optionBHi TEXT,
          optionCHi TEXT,
          optionDHi TEXT,
          correctIndex INTEGER,
          difficulty TEXT,
          pyqYear TEXT,
          tag TEXT,
          explanation TEXT,
          explanationHi TEXT,
          ncertRef TEXT
        )
      `, (err) => {
        if (err) {
          console.error('Error creating questions table:', err.message);
        } else {
          console.log('Questions table ready.');
        }
      });
      
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT,
          email TEXT UNIQUE,
          phone TEXT,
          pin TEXT,
          sessionId TEXT,
          subscriptionExpiry TEXT
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
        } else {
          console.log('Users table ready.');
        }
      });

      db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          userId TEXT,
          utr TEXT UNIQUE,
          amount INTEGER,
          status TEXT,
          createdAt TEXT
        )
      `, (err) => {
        if (err) console.error('Error creating transactions table:', err.message);
        else console.log('Transactions table ready.');
      });
    });
  }
});

module.exports = db;
