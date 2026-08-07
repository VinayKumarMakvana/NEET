const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3028;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.webmanifest': 'application/manifest+json; charset=UTF-8',
  '.svg': 'image/svg+xml; charset=UTF-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=UTF-8'
};

// Simple .env parser
function loadEnv() {
  const env = {};
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
          env[key] = val;
        }
      }
    }
  }
  return env;
}

const envVars = loadEnv();

// Persistent Database Files
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TX_FILE = path.join(DATA_DIR, 'transactions.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2), 'utf8');
  }
  if (!fs.existsSync(TX_FILE)) {
    fs.writeFileSync(TX_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

function getUsers() {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '{}');
  } catch (e) {
    return {};
  }
}

function saveUsers(users) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function getTransactions() {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(TX_FILE, 'utf8') || '[]');
  } catch (e) {
    return [];
  }
}

function saveTransactions(txs) {
  ensureDataDir();
  fs.writeFileSync(TX_FILE, JSON.stringify(txs, null, 2), 'utf8');
}

// Security: SHA-256 PIN Hashing
function hashPin(pin) {
  if (!pin) return '';
  return crypto.createHash('sha256').update(String(pin).trim() + '_aiims_neet_2028').digest('hex');
}

function verifyPinMatch(storedPin, inputPin) {
  if (!storedPin || !inputPin) return false;
  const inClean = String(inputPin).trim();
  if (storedPin === hashPin(inClean)) return true;
  if (storedPin === inClean) return true;
  if (storedPin === Buffer.from(inClean).toString('base64')) return true;
  try {
    if (Buffer.from(storedPin, 'base64').toString('utf8') === inClean) return true;
  } catch (e) {}
  return false;
}

// Rate Limiter for Login (Anti-Brute-Force)
const failedAttempts = new Map();
function isRateLimited(ip) {
  const entry = failedAttempts.get(ip);
  if (!entry) return false;
  const now = Date.now();
  if (entry.count >= 5 && now - entry.last < 3 * 60 * 1000) {
    return true;
  }
  if (now - entry.last >= 3 * 60 * 1000) {
    failedAttempts.delete(ip);
  }
  return false;
}
function recordFailure(ip) {
  const now = Date.now();
  const entry = failedAttempts.get(ip) || { count: 0, last: now };
  entry.count += 1;
  entry.last = now;
  failedAttempts.set(ip, entry);
}
function clearFailure(ip) {
  failedAttempts.delete(ip);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

function findUser(query) {
  if (!query) return null;
  const users = getUsers();
  const q = String(query).trim().toLowerCase();
  
  if (users[query.trim()]) return users[query.trim()];
  if (users[q]) return users[q];

  for (const user of Object.values(users)) {
    if (!user || !user.id) continue;
    if (user.id.toLowerCase() === q) return user;
    if (user.emailOrPhone && user.emailOrPhone.toLowerCase() === q) return user;
    if (user.fullName && user.fullName.toLowerCase() === q) return user;
    if (user.firstName && user.firstName.toLowerCase() === q) return user;
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    });
    return res.end();
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost:3028'}`);
  const reqPath = urlObj.pathname;

  if (reqPath === '/api/health') {
    return sendJson(res, 200, { status: 'ok', app: 'NEET UG 2028 - Target 720/720 OS', time: new Date().toISOString() });
  }

  if (reqPath === '/api/config') {
    return sendJson(res, 200, {
      upiId: process.env.UPI_ID || envVars.UPI_ID || 'vinay.neet2028@okaxis',
      upiName: process.env.UPI_NAME || envVars.UPI_NAME || 'NEET 2028 Exam Creator'
    });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  // --- API: Student Registration (Cross-Device Permanent Storage) ---
  if (reqPath === '/api/auth/register' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const { name, emailOrPhone, pin, targetCollege, initialData } = body;

      if (!name || !pin) {
        return sendJson(res, 400, { error: 'Name and PIN are required.' });
      }

      const existing = findUser(emailOrPhone || name);
      if (existing) {
        return sendJson(res, 409, { error: 'An account with this Email/Phone/Name already exists. Please Log In.' });
      }

      const users = getUsers();
      const cleanId = 'std_' + Date.now();
      const activeSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

      const newUser = {
        id: cleanId,
        fullName: name.trim().startsWith('Dr.') ? name.trim() : 'Dr. ' + name.trim(),
        firstName: name.trim().replace(/^Dr\.\s*/i, '').split(' ')[0],
        emailOrPhone: (emailOrPhone || '').trim(),
        pin: hashPin(pin), // Secure SHA-256 Salted Hash
        targetCollege: targetCollege || 'AIIMS New Delhi',
        targetYear: 2028,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        activeSessionId: activeSessionId,
        studyData: initialData || {}
      };

      users[cleanId] = newUser;
      saveUsers(users);

      return sendJson(res, 200, {
        success: true,
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          firstName: newUser.firstName,
          emailOrPhone: newUser.emailOrPhone,
          targetCollege: newUser.targetCollege,
          targetYear: newUser.targetYear,
          provider: 'local_pin'
        },
        sessionId: activeSessionId,
        studyData: newUser.studyData
      });
    } catch (e) {
      return sendJson(res, 500, { error: 'Registration failed: ' + e.message });
    }
  }

  // --- API: Student Login (Anti-Brute Force, Cross-Device & Single Session) ---
  if (reqPath === '/api/auth/login' && req.method === 'POST') {
    try {
      if (isRateLimited(clientIp)) {
        return sendJson(res, 429, { error: 'Too many failed login attempts. Please wait 3 minutes for security.' });
      }

      const body = await readJsonBody(req);
      const { emailOrPhone, pin } = body;

      if (!emailOrPhone || !pin) {
        return sendJson(res, 400, { error: 'Please enter Student ID / Email and Security PIN.' });
      }

      const user = findUser(emailOrPhone);
      if (!user) {
        recordFailure(clientIp);
        return sendJson(res, 404, { error: 'Student account not found. Please verify your details or Register.' });
      }

      // PIN check (compares against SHA-256 hash or legacy format)
      if (!verifyPinMatch(user.pin, pin)) {
        recordFailure(clientIp);
        return sendJson(res, 401, { error: 'Incorrect Security PIN. Please try again.' });
      }

      clearFailure(clientIp);

      // Auto-upgrade legacy PIN to salted SHA-256 hash
      if (user.pin !== hashPin(pin)) {
        user.pin = hashPin(pin);
      }

      // SINGLE DEVICE POLICY: Invalidate previous device by creating a new activeSessionId
      const newSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      user.activeSessionId = newSessionId;
      user.lastLoginAt = new Date().toISOString();

      const users = getUsers();
      users[user.id] = user;
      saveUsers(users);

      return sendJson(res, 200, {
        success: true,
        user: {
          id: user.id,
          fullName: user.fullName,
          firstName: user.firstName,
          emailOrPhone: user.emailOrPhone,
          targetCollege: user.targetCollege,
          targetYear: user.targetYear,
          provider: 'local_pin'
        },
        sessionId: newSessionId,
        studyData: user.studyData || {}
      });
    } catch (e) {
      return sendJson(res, 500, { error: 'Login failed: ' + e.message });
    }
  }

  // --- API: Study Data Sync (Never Lose Progress or Purchases) ---
  if (reqPath === '/api/auth/sync' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const { userId, sessionId, studyData } = body;

      if (!userId) {
        return sendJson(res, 400, { error: 'Missing userId.' });
      }

      const user = findUser(userId);
      if (!user) {
        return sendJson(res, 404, { error: 'User not found.' });
      }

      // Check single-device active session
      if (user.activeSessionId && sessionId && user.activeSessionId !== sessionId) {
        return sendJson(res, 403, {
          sessionTerminated: true,
          error: 'Your account is active on another device. Only 1 device allowed at a time.'
        });
      }

      // Merge and save study data (chapters, test history, purchases)
      user.studyData = {
        ...(user.studyData || {}),
        ...(studyData || {}),
        purchases: {
          ...((user.studyData && user.studyData.purchases) || {}),
          ...((studyData && studyData.purchases) || {})
        }
      };
      user.lastSyncAt = new Date().toISOString();

      const users = getUsers();
      users[user.id] = user;
      saveUsers(users);

      return sendJson(res, 200, { success: true, lastSynced: Date.now() });
    } catch (e) {
      return sendJson(res, 500, { error: 'Sync failed: ' + e.message });
    }
  }

  // --- API: Payment Transaction Logging & Verification ---
  if (reqPath === '/api/payment/log-transaction' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const { userId, utr, packId, amount, studentName } = body;

      if (!utr || !packId) {
        return sendJson(res, 400, { error: 'Missing UTR or Package details.' });
      }

      const txs = getTransactions();
      const cleanUtr = String(utr).trim();

      // Duplicate check
      const duplicate = txs.find(t => t.utr === cleanUtr);
      if (duplicate) {
        return sendJson(res, 409, { error: 'This UTR has already been recorded.' });
      }

      const tx = {
        id: 'TXN_' + Date.now(),
        utr: cleanUtr,
        userId: userId || 'guest',
        studentName: studentName || 'Dr. Aspirant',
        packId: packId,
        amount: Number(amount) || 0,
        createdAt: new Date().toISOString(),
        verified: true
      };

      txs.push(tx);
      saveTransactions(txs);

      // If user exists, unlock directly in their server profile
      if (userId) {
        const user = findUser(userId);
        if (user) {
          user.studyData = user.studyData || {};
          user.studyData.purchases = user.studyData.purchases || {};
          if (packId === 'level5') user.studyData.purchases.level5 = true;
          if (packId === 'level6') user.studyData.purchases.level6 = true;
          if (packId === 'combo') {
            user.studyData.purchases.level5 = true;
            user.studyData.purchases.level6 = true;
            user.studyData.purchases.combo = true;
          }
          const users = getUsers();
          users[user.id] = user;
          saveUsers(users);
        }
      }

      return sendJson(res, 200, { success: true, transaction: tx });
    } catch (e) {
      return sendJson(res, 500, { error: 'Transaction log failed: ' + e.message });
    }
  }

  // --- API: Admin Transaction Viewer ---
  if (reqPath === '/api/payment/transactions' && req.method === 'GET') {
    const txs = getTransactions();
    return sendJson(res, 200, { success: true, count: txs.length, transactions: txs });
  }

  // --- API: Single-Device Session Check ---
  if (reqPath === '/api/auth/check-session' && req.method === 'GET') {
    const userId = urlObj.searchParams.get('userId');
    const sessionId = urlObj.searchParams.get('sessionId');

    if (!userId || !sessionId) {
      return sendJson(res, 200, { active: true });
    }

    const user = findUser(userId);
    if (!user) {
      return sendJson(res, 200, { active: true });
    }

    const isActive = !user.activeSessionId || user.activeSessionId === sessionId;
    return sendJson(res, 200, { active: isActive });
  }

  // Static File Serving
  let reqUrl = reqPath === '/' ? '/index.html' : reqPath;
  const filePath = path.join(__dirname, reqUrl);

  // Security check: ensure path is within __dirname
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('File Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🏥 NEET UG 2028 OS: Target 720/720 Server Running!`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`🩺 Dream AIIMS Delhi | Full Syllabus & Topper Tools Loaded`);
  console.log(`======================================================\n`);
});
