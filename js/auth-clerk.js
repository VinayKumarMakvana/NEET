/**
 * NEET UG 2028: Master Authentication & Data Protection Gatekeeper
 * Supports Clerk Cloud OAuth (Google/Email) & Verified Student Passcode Accounts
 */

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
window.escapeHtml = escapeHtml;

const CLERK_DEFAULT_KEY = 'pk_test_cG9zc2libGUtdHJvdXQtNTkuY2xlcmsuYWNjb3VudHMuZGV2JA';
const AUTH_STUDENTS_STORAGE_KEY = 'neet_registered_students_v1';
const AUTH_ACTIVE_SESSION_KEY = 'neet_active_student_session';

const ClerkAuth = {
  publishableKey: localStorage.getItem('neet_clerk_publishable_key') || CLERK_DEFAULT_KEY,
  clerkInstance: null,
  isInitialized: false,
  currentUser: null,
  cloudSyncStatus: 'synced', // 'synced' | 'syncing' | 'offline' | 'local'
  lastSyncTimestamp: Date.now(),
  _syncDebounceTimer: null,

  isAuthenticated() {
    return !!this.currentUser && !!this.currentUser.id;
  },

  getCurrentUser() {
    return this.currentUser;
  },

  async init() {
    console.log('🔐 Initializing NEET UG 2028 Auth & Security Guard Engine...');

    // 1. Check existing verified student session first
    this.restoreActiveSession();

    // 2. Initialize Clerk SDK in background
    // Clerk SDK disabled

    if (!this.isAuthenticated()) {
      localStorage.removeItem(AUTH_ACTIVE_SESSION_KEY);
      this.currentUser = null;
    }
    this.renderAuthUI();
    this.broadcastAuthChange();

    if (typeof renderApp === 'function') {
      renderApp();
    }
  },

  restoreActiveSession() {
    try {
      const savedSession = localStorage.getItem(AUTH_ACTIVE_SESSION_KEY);
      if (savedSession) {
        this.currentUser = JSON.parse(savedSession);
        // Do not broadcast yet, init() will do it
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
      localStorage.removeItem(AUTH_ACTIVE_SESSION_KEY);
    }
  },

  // Real-Time Sync & Single-Device Heartbeat Engine
  _heartbeatTimer: null,

  startSessionHeartbeat() {
    if (this._heartbeatTimer) clearInterval(this._heartbeatTimer);
    this._heartbeatTimer = setInterval(() => {
      this.checkActiveSession();
    }, 15000); // Check every 15 seconds
  },

  stopSessionHeartbeat() {
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer);
      this._heartbeatTimer = null;
    }
  },

  async checkActiveSession() {
    if (!this.currentUser || !this.currentUser.id || !this.currentUser.sessionId) return;
    try {
      const res = await fetch(`/api/auth/check-session?userId=${encodeURIComponent(this.currentUser.id)}&sessionId=${encodeURIComponent(this.currentUser.sessionId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.active === false) {
          console.warn('🚨 Single Device Policy Triggered: Logged in on another device.');
          this.handleSingleDeviceMismatch();
        } else {
          // Sync premium status
          this.currentUser.subscriptionExpiry = data.subscriptionExpiry;
          this.currentUser.isPremium = data.isPremium;
          localStorage.setItem(AUTH_ACTIVE_SESSION_KEY, JSON.stringify(this.currentUser));
        }
      }
    } catch (e) {
      console.log('Heartbeat sync failed (offline)', e);
    }
  },

  handleSingleDeviceMismatch() {
    this.stopSessionHeartbeat();
    this.signOut(true); // silent logout
    this.showSingleDeviceWarningModal();
  },

  showSingleDeviceWarningModal() {
    const modalBody = document.getElementById('modalBody');
    const modal = document.getElementById('modal');
    if (!modalBody || !modal) {
      alert('⚠️ Single Device Security Alert:\nAapka account kisi doosre device me login kiya gaya he.\nEk time me sirf 1 device allowed he. Is device se logout kar diya gaya he.');
      return;
    }

    modalBody.innerHTML = `
      <div style="padding:10px 0; text-align:center;">
        <div style="width:64px; height:64px; border-radius:50%; background:rgba(239, 68, 68, 0.15); border:2px solid #ef4444; color:#ef4444; font-size:32px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:12px;">
          🔒
        </div>
        <h3 style="font-size:20px; font-weight:800; color:#ef4444; margin:0 0 8px;">Single Device Security Alert</h3>
        <p style="font-size:13px; color:var(--text-main); font-weight:600; margin:0 0 10px;">
          Aapka account kisi doosre phone ya device me login kiya gaya he.
        </p>
        <p style="font-size:12px; color:var(--text-muted); line-height:1.5; margin:0 0 18px;">
          Security aur Fair Usage policy ke antargat ek time par sirf <strong>1 Active Device</strong> me hi account chal sakta he. Aapka sabhi data & purchases (Level 5/6 unlocks) safe hain.
        </p>
        <button class="btn btn-primary" style="width:100%; justify-content:center; padding:12px;" onclick="document.getElementById('modal').close(); ClerkAuth.openSignIn('pin');">
          🔑 Re-Login on This Device
        </button>
      </div>
    `;
    modal.showModal();
  },

  // Student Passcode Management (Permanent Cross-Device & Server Storage)
  getRegisteredStudents() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_STUDENTS_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  },

  async registerStudentAccount(name, emailOrPhone, pin, targetCollege = 'AIIMS New Delhi') {
    if (!name || !pin) {
      throw new Error('Name and Security PIN are required.');
    }
    if (pin.length < 4) {
      throw new Error('Security PIN must be at least 4 characters/digits.');
    }

    const cleanName = name.trim().startsWith('Dr.') ? name.trim() : 'Dr. ' + name.trim();
    const cleanEmail = (emailOrPhone || '').trim();
    const cleanId = 'std_' + Date.now();
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          emailOrPhone: cleanEmail,
          pin: pin,
          targetCollege: targetCollege
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed on server');
      }

      const newStudent = {
        id: cleanId,
        fullName: cleanName,
        firstName: cleanName.replace(/^Dr\.\s*/i, '').split(' ')[0],
        emailOrPhone: cleanEmail,
        targetCollege: targetCollege || 'AIIMS New Delhi',
        targetYear: 2028,
        provider: 'server_pin',
        sessionId: data.sessionId,
        createdAt: new Date().toISOString(),
        subscriptionExpiry: new Date(0).toISOString(),
        isPremium: false
      };

      // Reset app state for the new user
      window.appState = { progress: {}, testHistory: [], mistakes: [], lang: 'bilingual' };
      if (typeof saveState === 'function') saveState();

      this.setActiveUser(newStudent);
      this.startSessionHeartbeat();
      return newStudent;
      
    } catch (err) {
      console.error(err);
      throw new Error(err.message || 'Network error during registration');
    }
  },

  async loginWithStudentPin(emailOrPhone, pin) {
    if (!emailOrPhone || !pin) {
      throw new Error('Please enter your Student ID / Email and Security PIN.');
    }

    const cleanEmail = emailOrPhone.trim();
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: cleanEmail,
          pin: pin
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }
      
      const student = data.user;
      
      const sessionUser = {
        id: student.id,
        fullName: student.name,
        firstName: student.name.replace(/^Dr\.\s*/i, '').split(' ')[0],
        emailOrPhone: student.email,
        provider: 'server_pin',
        sessionId: student.sessionId,
        subscriptionExpiry: student.subscriptionExpiry,
        isPremium: student.isPremium
      };

      if (typeof loadState === 'function') {
        const loaded = loadState(sessionUser.id);
        if (!loaded) {
           window.appState = { progress: {}, testHistory: [], mistakes: [], lang: 'bilingual' };
        }
      }

      this.setActiveUser(sessionUser);
      this.startSessionHeartbeat();
      return sessionUser;
      
    } catch (err) {
      console.error(err);
      throw new Error(err.message || 'Network error during login');
    }
  },

  // Server Data Synchronizer (Runs on every saveState, test complete, or purchase)
  async syncUserStateToServer() {
    if (!this.currentUser || !this.currentUser.id || !this.currentUser.sessionId) return;
    try {
      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.currentUser.id,
          sessionId: this.currentUser.sessionId,
          studyData: window.appState || {}
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.sessionTerminated) {
          this.handleSingleDeviceMismatch();
        }
      } else if (response.status === 403) {
        const data = await response.json().catch(() => ({}));
        if (data.sessionTerminated) {
          this.handleSingleDeviceMismatch();
        }
      }
    } catch (e) {
      // Offline, ignore
    }
  },

  // Auth Modals
  openSignIn(tab = 'clerk') {
    this.showSignInModal(tab);
  },

  openSignUp() {
    this.showSignInModal('register');
  },

  openUserProfile() {
    this.showProfileModal();
  },

  showSignInModal(initialTab = 'clerk') {
    const modalBody = document.getElementById('modalBody');
    const modal = document.getElementById('modal');
    if (!modalBody || !modal) return;

    modalBody.innerHTML = `
      <style>
        /* Force the native dialog to be a transparent wrapper perfectly sized to our card */
        #modal {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          max-width: 480px !important;
          width: 95vw !important;
          margin: auto !important;
          overflow: visible !important;
        }
        #modal::backdrop {
          background: rgba(0,0,0,0.7) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
        }
        #modalBody {
          padding: 0 !important;
        }
        .modal-close-btn {
          display: none !important;
        }
        .auth-master-wrapper {
          width: 100%;
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .auth-glass-card {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 24px 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        .auth-glass-card::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.1), transparent 50%),
                      radial-gradient(circle at 50% 100%, rgba(6, 182, 212, 0.08), transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        .auth-content-z {
          position: relative;
          z-index: 1;
        }
        .auth-segmented-control {
          display: flex;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 3px;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .auth-seg-btn {
          flex: 1;
          padding: 8px 0;
          text-align: center;
          font-size: 11.5px;
          font-weight: 700;
          color: var(--text-muted);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
          border: none;
        }
        .auth-seg-btn.active {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .auth-input-group {
          margin-bottom: 12px;
          text-align: left;
        }
        .auth-label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .auth-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 10px 14px;
          color: #fff;
          font-size: 13px;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .auth-input:focus {
          outline: none;
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
          background: rgba(0, 0, 0, 0.3);
        }
        .auth-btn-primary {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #10b981, #0ea5e9);
          color: #fff;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          margin-top: 4px;
        }
        .auth-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }
        .auth-btn-google {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .auth-btn-google:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .auth-footer-link {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .auth-footer-link:hover {
          color: #fff;
        }
      </style>

      <div class="auth-master-wrapper">
        <div class="auth-glass-card">
          <!-- Custom Close Button -->
          <button onclick="document.getElementById('modal').close()" style="position:absolute; top:16px; right:16px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); width:28px; height:28px; border-radius:50%; color:rgba(255,255,255,0.7); font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:20; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'; this.style.color='#fff';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.color='rgba(255,255,255,0.7)';">✕</button>
          
          <div class="auth-content-z">
            <!-- Header Section -->
            <div style="text-align:center; margin-bottom:20px;">
              <div style="width:50px; height:50px; margin:0 auto 10px; border-radius:14px; background:linear-gradient(135deg, #0f172a, #1e293b); border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; box-shadow:0 8px 20px rgba(0,0,0,0.4); position:relative;">
                <div style="position:absolute; inset:0; border-radius:14px; background:linear-gradient(135deg, rgba(16,185,129,0.5), rgba(6,182,212,0.5)); filter:blur(8px); opacity:0.5; z-index:-1;"></div>
                <span style="font-size:22px;">🩺</span>
              </div>
              <h3 style="font-size:18px; font-weight:800; color:#fff; margin:0 0 4px; letter-spacing:-0.5px;">NEET Aspirant Gateway</h3>
              <p style="font-size:11px; color:rgba(255,255,255,0.5); margin:0;">Secure your rank. Sync your progress.</p>
            </div>

            <!-- Segmented Tab Selector -->
            <div class="auth-segmented-control">
              <button id="authBtnClerk" class="auth-seg-btn ${initialTab === 'clerk' ? 'active' : ''}" onclick="ClerkAuth.switchModalTab('clerk')">
                Cloud Login
              </button>
              <button id="authBtnPin" class="auth-seg-btn ${initialTab === 'pin' ? 'active' : ''}" onclick="ClerkAuth.switchModalTab('pin')">
                Sign In
              </button>
              <button id="authBtnRegister" class="auth-seg-btn ${initialTab === 'register' ? 'active' : ''}" onclick="ClerkAuth.switchModalTab('register')">
                Create Profile
              </button>
            </div>

            <div id="authTabError" style="font-size:11px; color:#ef4444; font-weight:600; text-align:center; display:none; margin-bottom:12px;"></div>

            <!-- TAB 1: CLERK CLOUD LOGIN -->
            <div id="authTabClerk" style="display: ${initialTab === 'clerk' ? 'block' : 'none'}; text-align:center;">
              <div style="margin-bottom:16px; padding:12px; background:rgba(0,0,0,0.2); border-radius:10px; border:1px solid rgba(255,255,255,0.05);">
                <p style="font-size:11.5px; color:rgba(255,255,255,0.7); margin:0; line-height:1.5;">
                  Sync your mock scores, bookmarks, and detailed analytics securely to the cloud. Access your progress from any device.
                </p>
              </div>
              <div id="clerk-mount-target" style="min-height:120px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px;">
                <button class="auth-btn-google" onclick="
                  if (ClerkAuth.clerkInstance && typeof ClerkAuth.clerkInstance.openSignIn === 'function') {
                    ClerkAuth.clerkInstance.openSignIn();
                    document.getElementById('modal').close();
                  } else {
                    ClerkAuth.switchModalTab('pin');
                  }
                ">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" style="width:16px; height:16px;">
                  Continue with Google
                </button>
                <span style="font-size:10px; color:var(--text-muted);">
                  ☁️ Automatically saves your progress
                </span>
              </div>
            </div>

            <!-- TAB 2: STUDENT PIN LOGIN -->
            <div id="authTabPin" style="display: ${initialTab === 'pin' ? 'block' : 'none'};">
              <form onsubmit="ClerkAuth.handlePinLoginSubmit(event)" style="padding:4px 0;">
                <div class="auth-input-group">
                  <label for="loginStudentId" class="auth-label">Student ID / Mobile</label>
                  <input type="text" id="loginStudentId" class="auth-input" placeholder="e.g. 9876543210 or Vinay" required autocomplete="username">
                </div>
                <div class="auth-input-group">
                  <label for="loginStudentPin" class="auth-label" style="color:#10b981;">4-Digit PIN</label>
                  <input type="password" id="loginStudentPin" class="auth-input" placeholder="••••" style="font-size:20px; letter-spacing:10px; font-family:monospace;" required autocomplete="current-password" minlength="4">
                </div>
                <button type="submit" class="auth-btn-primary">
                  Unlock Medical OS 🚀
                </button>
              </form>
            </div>

            <!-- TAB 3: REGISTER NEW STUDENT -->
            <div id="authTabRegister" style="display: ${initialTab === 'register' ? 'block' : 'none'};">
              <form onsubmit="ClerkAuth.handleRegisterSubmit(event)" style="padding:4px 0;">
                <div class="auth-input-group">
                  <label for="regStudentName" class="auth-label">Doctor / Aspirant Name</label>
                  <input type="text" id="regStudentName" class="auth-input" placeholder="e.g. Dr. Vinay Kumar" required>
                </div>
                <div class="auth-input-group">
                  <label for="regEmailPhone" class="auth-label">Email / Mobile No.</label>
                  <input type="text" id="regEmailPhone" class="auth-input" placeholder="For account recovery" required>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div class="auth-input-group">
                    <label for="regTargetCollege" class="auth-label">Dream College</label>
                    <select id="regTargetCollege" class="auth-input" style="cursor:pointer; appearance:none; padding:10px 8px;">
                      <option value="AIIMS New Delhi">AIIMS Delhi</option>
                      <option value="JIPMER Puducherry">JIPMER</option>
                      <option value="MAMC New Delhi">MAMC</option>
                      <option value="KGMU Lucknow">KGMU</option>
                      <option value="State Top GMC">State Top GMC</option>
                    </select>
                  </div>
                  <div class="auth-input-group">
                    <label for="regStudentPin" class="auth-label" style="color:#10b981;">4-Digit PIN</label>
                    <input type="password" id="regStudentPin" class="auth-input" placeholder="••••" style="font-size:20px; letter-spacing:6px; font-family:monospace;" required minlength="4">
                  </div>
                </div>
                <button type="submit" class="auth-btn-primary">
                  Create Profile 🎯
                </button>
              </form>
            </div>

            <!-- Data Import/Export -->
            <div style="margin-top:16px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.1); display:flex; justify-content:center; gap:20px;">
              <span class="auth-footer-link" onclick="ClerkAuth.exportDatabaseJSON()">📥 Backup Data</span>
              <span class="auth-footer-link" onclick="document.getElementById('jsonImportInput').click()">📤 Restore Data</span>
              <input type="file" id="jsonImportInput" style="display:none;" onchange="ClerkAuth.importDatabaseJSON(event)">
            </div>
          </div>
        </div>
      </div>
    `;

    modal.showModal();

    // If Clerk instance has mountSignIn, mount it in tab 1
    if (this.clerkInstance && typeof this.clerkInstance.mountSignIn === 'function' && initialTab === 'clerk') {
      const mountDiv = document.getElementById('clerk-mount-target');
      if (mountDiv) {
        try {
          mountDiv.innerHTML = '';
          this.clerkInstance.mountSignIn(mountDiv);
        } catch (e) {
          console.log('Clerk mount fallback:', e);
        }
      }
    }
  },

  switchModalTab(tab) {
    const errorEl = document.getElementById('authTabError');
    if (errorEl) errorEl.style.display = 'none';

    document.querySelectorAll('.auth-seg-btn').forEach((btn, i) => {
      btn.classList.toggle('active', 
        (tab === 'clerk' && i === 0) || 
        (tab === 'pin' && i === 1) || 
        (tab === 'register' && i === 2)
      );
    });

    const cTab = document.getElementById('authTabClerk');
    const pTab = document.getElementById('authTabPin');
    const rTab = document.getElementById('authTabRegister');

    if (cTab) cTab.style.display = tab === 'clerk' ? 'block' : 'none';
    if (pTab) pTab.style.display = tab === 'pin' ? 'block' : 'none';
    if (rTab) rTab.style.display = tab === 'register' ? 'block' : 'none';

    if (tab === 'clerk' && this.clerkInstance && typeof this.clerkInstance.mountSignIn === 'function') {
      const mountDiv = document.getElementById('clerk-mount-target');
      if (mountDiv && !mountDiv.querySelector('.cl-rootBox')) {
        try {
          mountDiv.innerHTML = '';
          this.clerkInstance.mountSignIn(mountDiv);
        } catch (e) {
          console.log('Clerk mount fallback:', e);
        }
      }
    }
  },

  async handlePinLoginSubmit(e) {
    e.preventDefault();
    const errorEl = document.getElementById('authTabError');
    const idInput = document.getElementById('loginStudentId');
    const pinInput = document.getElementById('loginStudentPin');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    if (errorEl) errorEl.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '🔄 Verifying Credentials...';
    }

    try {
      await this.loginWithStudentPin(idInput.value, pinInput.value);
      document.getElementById('modal').close();
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = '⚠️ ' + err.message;
        errorEl.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🔓 Verify & Unlock Study OS';
      }
    }
  },

  async handleRegisterSubmit(e) {
    e.preventDefault();
    const errorEl = document.getElementById('authTabError');
    const name = document.getElementById('regStudentName').value;
    const emailPhone = document.getElementById('regEmailPhone').value;
    const college = document.getElementById('regTargetCollege').value;
    const pin = document.getElementById('regStudentPin').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    if (errorEl) errorEl.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '🔄 Registering Account...';
    }

    try {
      await this.registerStudentAccount(name, emailPhone, pin, college);
      document.getElementById('modal').close();
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = '⚠️ ' + err.message;
        errorEl.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🩺 Create Verified Profile & Unlock Portal';
      }
    }
  },

  showProfileModal() {
    const modalBody = document.getElementById('modalBody');
    const modal = document.getElementById('modal');
    if (!modalBody || !modal) return;

    const isClerk = this.currentUser && this.currentUser.provider === 'clerk';
    const totalChaptersDone = Object.values((window.appState && window.appState.progress) || {}).filter(Boolean).length;
    const totalTestsTaken = ((window.appState && window.appState.testHistory) || []).length;
    const totalMistakesLogged = ((window.appState && window.appState.mistakes) || []).length;

    modalBody.innerHTML = `
      <div style="padding:10px 0;">
        <span class="eyebrow">ACTIVE VERIFIED DOCTOR SESSION</span>
        <h2 style="font-size:22px; margin:8px 0 16px;">🩺 Student Profile & Clerk Database Hub</h2>
        
        <div class="card" style="padding:18px; display:flex; align-items:center; gap:16px; margin-bottom:16px;">
          ${this.currentUser && this.currentUser.imageUrl ? 
            `<img src="${this.currentUser.imageUrl}" alt="Avatar" style="width:52px; height:52px; border-radius:50%; border:2px solid var(--brand-emerald);">` : 
            `<div style="width:52px; height:52px; border-radius:50%; background:rgba(13,148,136,0.25); border:2px solid var(--brand-teal); display:flex; align-items:center; justify-content:center; font-size:24px;">🩺</div>`
          }
          <div style="flex:1;">
            <h3 style="font-size:16px; font-weight:700; color:var(--text-main); margin-bottom:2px;">
              ${escapeHtml(this.currentUser ? this.currentUser.fullName : 'Aspirant')}
            </h3>
            <span style="font-size:12px; color:var(--brand-emerald); font-weight:600;">
              Target: ${escapeHtml(this.currentUser ? (this.currentUser.targetCollege || 'AIIMS New Delhi') : 'AIIMS')} (NEET 2028)
            </span><br>
            <span style="font-size:11px; color:var(--text-muted);">
              ID: <code>${escapeHtml(this.currentUser ? this.currentUser.id : '')}</code> · Provider: <strong>${isClerk ? '🌐 Clerk Cloud OAuth' : '🩺 Local Passcode'}</strong>
            </span>
          </div>
          <div style="text-align:right;">
            <span class="badge ${isClerk ? 'badge-emerald' : 'badge-gold'}" style="font-size:11px;">
              ${isClerk ? '🟢 Clerk Cloud Connected' : '💾 Local Mode'}
            </span>
          </div>
        </div>

        <!-- Database Health & Cloud Statistics -->
        <div class="card" style="padding:14px; margin-bottom:16px; background:rgba(19,30,54,0.6); border:1px solid rgba(13,148,136,0.3);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong style="font-size:13px; color:var(--text-main);">☁️ Clerk Database Connection Status</strong>
            <span id="clerkCloudSyncBadge" style="font-size:11px; font-weight:700;">
              ${isClerk ? '☁️ <span style="color:var(--brand-emerald);">Clerk Cloud Connected</span>' : '💾 <span style="color:var(--brand-teal);">Local Passcode Storage</span>'}
            </span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; text-align:center; margin:10px 0;">
            <div style="background:var(--bg-secondary); padding:8px; border-radius:6px; border:1px solid var(--border-color);">
              <div style="font-size:18px; font-weight:800; color:var(--brand-emerald);">${totalChaptersDone}/96</div>
              <div style="font-size:10px; color:var(--text-muted);">NCERT Chapters</div>
            </div>
            <div style="background:var(--bg-secondary); padding:8px; border-radius:6px; border:1px solid var(--border-color);">
              <div style="font-size:18px; font-weight:800; color:var(--brand-gold);">${totalTestsTaken}</div>
              <div style="font-size:10px; color:var(--text-muted);">Mocks Taken</div>
            </div>
            <div style="background:var(--bg-secondary); padding:8px; border-radius:6px; border:1px solid var(--border-color);">
              <div style="font-size:18px; font-weight:800; color:var(--brand-rose);">${totalMistakesLogged}</div>
              <div style="font-size:10px; color:var(--text-muted);">Mistakes Logged</div>
            </div>
          </div>
          <div id="clerkSyncNotice" style="font-size:11px; color:var(--text-muted); margin-top:6px;">
            ${isClerk ? 'All study data is automatically synchronized to Clerk Cloud Metadata with zero data loss.' : 'Upgrade to Clerk Google Cloud to sync progress across all your mobile & laptop devices.'}
          </div>
        </div>

        <!-- Cloud Actions & Backup/Restore -->
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px;">
          ${isClerk ? `
            <button class="btn btn-sm btn-primary" onclick="ClerkAuth.forceClerkSync()" style="font-size:12px;">
              🔄 Sync to Clerk Cloud Now
            </button>
          ` : `
            <button class="btn btn-sm btn-primary" onclick="ClerkAuth.openSignIn('clerk')" style="font-size:12px;">
              ☁️ Connect Clerk Google Account
            </button>
          `}
          <button class="btn btn-sm ghost" onclick="ClerkAuth.exportDatabaseJSON()" style="font-size:12px;" title="Download full study progress as JSON">
            ⬇️ Download Backup
          </button>
          <label class="btn btn-sm ghost" style="font-size:12px; cursor:pointer; margin:0;" title="Restore study progress from JSON">
            ⬆️ Restore Backup
            <input type="file" accept=".json" onchange="ClerkAuth.importDatabaseJSON(event)" style="display:none;">
          </label>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; gap:10px; border-top:1px solid var(--border-color); padding-top:14px;">
          ${isClerk && this.clerkInstance && typeof this.clerkInstance.openUserProfile === 'function' ? `
            <button class="btn ghost btn-sm" onclick="ClerkAuth.clerkInstance.openUserProfile(); document.getElementById('modal').close();">
              Clerk Account Settings ↗
            </button>
          ` : `<div></div>`}
          <button class="btn ghost btn-sm" onclick="ClerkAuth.signOut(); document.getElementById('modal').close();" style="color:var(--brand-rose); border-color:rgba(244,63,94,0.3);">
            🔒 Lock & Sign Out
          </button>
        </div>
      </div>
    `;

    modal.showModal();
  },

  signOut(silent = false) {
    this.currentUser = null;
    localStorage.removeItem(AUTH_ACTIVE_SESSION_KEY);
    this.stopSessionHeartbeat();
    this.renderAuthUI();
    this.broadcastAuthChange();
    if (typeof renderApp === 'function') {
      renderApp();
    }
  },

  broadcastAuthChange() {
    window.dispatchEvent(new CustomEvent('neet-auth-state-changed', {
      detail: {
        isAuthenticated: this.isAuthenticated(),
        user: this.currentUser
      }
    }));
  },

  setActiveUser(user) {
    this.currentUser = user;
    localStorage.setItem(AUTH_ACTIVE_SESSION_KEY, JSON.stringify(user));
    this.syncUserState(user.id);
    this.renderAuthUI();
    this.broadcastAuthChange();
    if (typeof renderApp === 'function') {
      renderApp();
    }
  },

  syncUserState(userId) {
    if (typeof STORAGE_KEY === 'undefined') return;
    const userStorageKey = `${STORAGE_KEY}_${userId}`;
    const savedUserState = localStorage.getItem(userStorageKey);
    if (savedUserState) {
      try {
        window.appState = JSON.parse(savedUserState);
      } catch (e) {
        console.error('Failed to parse user state:', e);
      }
    }
    if (window.appState) {
      window.appState.doctorName = this.currentUser.fullName || window.appState.doctorName || 'Aspirant Doctor';
      if (typeof saveState === 'function') saveState();
    }
  },



  renderAuthUI() {
    const authContainer = document.getElementById('headerAuthContainer');
    if (!authContainer) return;

    if (this.isAuthenticated()) {
      const isClerk = this.currentUser && this.currentUser.provider === 'clerk';
      authContainer.innerHTML = `
        <div style="display:flex; align-items:center; gap:6px;">
          <div style="display:flex; align-items:center; gap:8px; background:rgba(13, 148, 136, 0.15); border:1px solid rgba(13, 148, 136, 0.4); padding:4px 12px; border-radius:20px; cursor:pointer;" onclick="ClerkAuth.openUserProfile()" title="View Student Profile & Clerk Database Hub">
            ${this.currentUser.imageUrl ? 
              `<img src="${this.currentUser.imageUrl}" alt="Avatar" style="width:22px; height:22px; border-radius:50%; object-fit:cover;">` : 
              `<span style="font-size:13px;">🩺</span>`
            }
            <span style="font-size:12px; font-weight:700; color:var(--text-main);">${escapeHtml(this.currentUser.firstName || this.currentUser.fullName || 'Doctor')}</span>
            <span style="font-size:10px; padding:2px 6px; border-radius:10px; background:${isClerk ? 'rgba(16,185,129,0.2)' : 'rgba(234,179,8,0.2)'}; color:${isClerk ? 'var(--brand-emerald)' : 'var(--brand-gold)'}; font-weight:800;">
              ${isClerk ? '☁️ CLERK' : 'PIN'}
            </span>
          </div>
          <button class="ghost" style="padding:4px 8px; font-size:11px; color:var(--brand-rose);" onclick="ClerkAuth.signOut()" title="Lock & Sign Out">🔒 Logout</button>
        </div>
      `;
    } else {
      authContainer.innerHTML = `
        <button class="btn-gold" style="font-size:12px; padding:6px 14px; border-radius:8px; display:inline-flex; align-items:center; gap:6px;" onclick="ClerkAuth.openSignIn()">
          <span>🔒</span> <strong>Login to Access</strong>
        </button>
      `;
    }
  }
};

window.ClerkAuth = ClerkAuth;

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  ClerkAuth.init();
});
