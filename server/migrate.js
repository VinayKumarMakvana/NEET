const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Question } = require('./models');

// Force Google DNS to bypass local ISP SRV query blocks
dns.setServers(['8.8.8.8', '8.8.4.4']);

let MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI && MONGO_URI.startsWith('"') && MONGO_URI.endsWith('"')) {
  MONGO_URI = MONGO_URI.slice(1, -1);
}
if (!MONGO_URI) {
  console.error('MONGO_URI is missing in .env!');
  process.exit(1);
}

// Add connection options for better stability
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 })
  .then(() => {
    console.log('Connected to MongoDB for Migration.');
    migrateData();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

function migrateData() {
  const dbPath = path.resolve(__dirname, 'database.sqlite');
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error connecting to SQLite database:', err.message);
      process.exit(1);
    }
  });

  db.all('SELECT * FROM questions', async (err, rows) => {
    if (err) {
      console.error('Error fetching SQLite questions:', err);
      process.exit(1);
    }
    
    console.log(`Found ${rows.length} questions in SQLite. Starting migration...`);
    
    try {
      await Question.deleteMany({});
      
      const bulkOps = rows.map(row => ({
        insertOne: {
          document: row
        }
      }));

      if (bulkOps.length > 0) {
        const result = await Question.bulkWrite(bulkOps);
        console.log(`Successfully migrated ${result.insertedCount} questions to MongoDB!`);
      } else {
        console.log('No questions found to migrate.');
      }
      
      console.log('Migration Complete.');
      process.exit(0);
    } catch (error) {
      console.error('Error during migration:', error);
      process.exit(1);
    }
  });
}
