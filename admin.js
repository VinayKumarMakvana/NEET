const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TX_FILE = path.join(DATA_DIR, 'transactions.json');

function getTransactions() {
  try {
    return JSON.parse(fs.readFileSync(TX_FILE, 'utf8') || '[]');
  } catch (e) {
    return [];
  }
}

function saveTransactions(txs) {
  fs.writeFileSync(TX_FILE, JSON.stringify(txs, null, 2), 'utf8');
}

function getUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '{}');
  } catch (e) {
    return {};
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log("Usage: node admin.js [command]");
  console.log("Commands:");
  console.log("  list                - List all pending transactions");
  console.log("  approve <UTR>       - Approve a transaction and unlock 1 year premium");
  process.exit(1);
}

if (command === 'list') {
  const txs = getTransactions();
  const pending = txs.filter(t => t.status === 'pending');
  
  if (pending.length === 0) {
    console.log("✅ No pending transactions.");
  } else {
    console.log(`\n⏳ Found ${pending.length} pending transactions:\n`);
    pending.forEach(t => {
      console.log(`----------------------------------------`);
      console.log(`UTR:       ${t.utr}`);
      console.log(`Amount:    Rs. ${t.amount}`);
      console.log(`User ID:   ${t.userId}`);
      console.log(`Date:      ${new Date(t.createdAt).toLocaleString()}`);
    });
    console.log(`----------------------------------------`);
    console.log(`\nTo approve, run: node admin.js approve <UTR>`);
  }
} else if (command === 'approve') {
  const utr = args[1];
  if (!utr) {
    console.log("❌ Error: Missing UTR. Usage: node admin.js approve <UTR>");
    process.exit(1);
  }

  const txs = getTransactions();
  const txIndex = txs.findIndex(t => t.utr === utr);

  if (txIndex === -1) {
    console.log(`❌ Error: UTR ${utr} not found.`);
    process.exit(1);
  }

  if (txs[txIndex].status === 'approved') {
    console.log(`⚠️ UTR ${utr} is already approved.`);
    process.exit(0);
  }

  // Mark as approved
  txs[txIndex].status = 'approved';
  saveTransactions(txs);

  // Unlock user
  const userId = txs[txIndex].userId;
  if (userId && userId !== 'guest') {
    const users = getUsers();
    const user = users[userId];
    if (user) {
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      user.subscriptionExpiry = oneYearFromNow.toISOString();
      saveUsers(users);
      console.log(`✅ UTR ${utr} approved! 1 Year Premium unlocked for User ID: ${userId}.`);
    } else {
      console.log(`⚠️ UTR ${utr} approved, but User ID ${userId} not found in database.`);
    }
  } else {
    console.log(`✅ UTR ${utr} approved! (Guest Checkout - no user account linked).`);
  }
} else {
  console.log(`❌ Error: Unknown command '${command}'`);
}
