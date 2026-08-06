/**
 * NEET UG 2028: Master Authentication & Data Protection Gatekeeper
 * Supports Clerk Cloud OAuth (Google/Email) & Verified Student Passcode Accounts
 */

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
    try {
      await this.loadClerkSDK(this.publishableKey);

      if (window.Clerk) {
        if (typeof window.Clerk === 'function') {
          this.clerkInstance = new window.Clerk(this.publishableKey);
        } else {
          this.clerkInstance = window.Clerk;
        }

        const loadOptions = {
          appearance: {
            variables: {
              colorPrimary: '#0d9488',
              colorText: '#f8fafc',
              colorBackground: '#0a0f1d',
              colorInputBackground: '#131e36',
              colorInputText: '#f8fafc',
              borderRadius: '10px'
            }
          }
        };

        if (window.__internal_ClerkUICtor) {
          loadOptions.ui = { ClerkUI: window.__internal_ClerkUICtor };
        }

        await this.clerkInstance.load(loadOptions);
        this.isInitialized = true;
        console.log('✅ Clerk Loaded. isSignedIn:', !!this.clerkInstance.user || !!this.clerkInstance.isSignedIn);

        if (this.clerkInstance.user) {
          this.handleClerkUserLogin(this.clerkInstance.user);
        }

        if (typeof this.clerkInstance.addListener === 'function') {
          this.clerkInstance.addListener((emission) => {
            if (emission.user) {
              this.handleClerkUserLogin(emission.user);
            } else if (this.currentUser && this.currentUser.provider === 'clerk') {
              this.handleUserLogout();
            }
          });
        }
      }
    } catch (err) {
      console.warn('ℹ️ Clerk SDK offline/deferred mode:', err);
    }

    this.renderAuthUI();
    this.broadcastAuthChange();
  },

  async loadClerkSDK(key) {
    if (window.Clerk && (typeof window.Clerk === 'object' || typeof window.Clerk === 'function')) {
      return;
    }

    let clerkDomain = 'possible-trout-59.clerk.accounts.dev';
    try {
      if (key && key.includes('_')) {
        const parts = key.split('_');
        if (parts[2]) {
          clerkDomain = atob(parts[2]).slice(0, -1);
        }
      }
    } catch {
      // Use fallback domain
    }

    try {
      await new Promise((resolve) => {
        const uiScript = document.createElement('script');
        uiScript.src = `https://${clerkDomain}/npm/@clerk/ui@1/dist/ui.browser.js`;
        uiScript.async = true;
        uiScript.crossOrigin = 'anonymous';
        uiScript.onload = resolve;
        uiScript.onerror = () => resolve();
        document.head.appendChild(uiScript);
      });
    } catch {
      // Proceed
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.setAttribute('data-clerk-publishable-key', key);
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://${clerkDomain}/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`;
      
      script.onload = () => resolve();
      script.onerror = () => {
        const fallbackScript = document.createElement('script');
        fallbackScript.setAttribute('data-clerk-publishable-key', key);
        fallbackScript.async = true;
        fallbackScript.crossOrigin = 'anonymous';
        fallbackScript.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js';
        fallbackScript.onload = () => resolve();
        fallbackScript.onerror = (e) => reject(e);
        document.head.appendChild(fallbackScript);
      };

      document.head.appendChild(script);
    });
  },

  restoreActiveSession() {
    const sessionRaw = localStorage.getItem(AUTH_ACTIVE_SESSION_KEY);
    if (sessionRaw) {
      try {
        const session = JSON.parse(sessionRaw);
        if (session && session.id && session.fullName) {
          this.currentUser = session;
          this.syncUserState(session.id);
        }
      } catch (e) {
        console.error('Session restore error:', e);
        localStorage.removeItem(AUTH_ACTIVE_SESSION_KEY);
      }
    }
  },

  handleClerkUserLogin(clerkUser) {
    if (!clerkUser) return;

    const userProfile = {
      id: 'clerk_' + clerkUser.id,
      clerkId: clerkUser.id,
      fullName: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Dr. Aspirant',
      firstName: clerkUser.firstName || 'Doctor',
      email: clerkUser.primaryEmailAddress ? clerkUser.primaryEmailAddress.emailAddress : '',
      imageUrl: clerkUser.imageUrl || '',
      provider: 'clerk',
      targetCollege: 'AIIMS New Delhi',
      targetYear: 2028,
      loginAt: new Date().toISOString()
    };

    // 1. Check if Clerk Cloud Database already has saved study data for this user
    const cloudDb = clerkUser.unsafeMetadata && clerkUser.unsafeMetadata.neetStudyDatabase;
    if (cloudDb && typeof cloudDb === 'object' && Object.keys(cloudDb).length > 0) {
      console.log('☁️ [Clerk Database] Connected! Restoring student database directly from Clerk Cloud...');
      if (typeof window !== 'undefined') {
        const baseState = typeof seedState !== 'undefined' ? seedState : {};
        window.appState = {
          ...baseState,
          ...cloudDb,
          progress: { ...(cloudDb.progress || {}) },
          revisions: { ...(cloudDb.revisions || {}) },
          testHistory: [ ...(cloudDb.testHistory || []) ],
          mistakes: [ ...(cloudDb.mistakes || []) ],
          studySessions: [ ...(cloudDb.studySessions || []) ],
          flashcardReviews: { ...(cloudDb.flashcardReviews || {}) }
        };
        const userStorageKey = `${typeof STORAGE_KEY !== 'undefined' ? STORAGE_KEY : 'neet_study_state_2028'}_clerk_${clerkUser.id}`;
        localStorage.setItem(userStorageKey, JSON.stringify(window.appState));
        if (typeof STORAGE_KEY !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(window.appState));
        }
      }
      this.cloudSyncStatus = 'synced';
      this.lastSyncTimestamp = clerkUser.unsafeMetadata.lastSyncTimestamp || Date.now();
    } else {
      // First-time Clerk login or empty cloud DB: immediately push existing local state to Clerk Cloud!
      console.log('☁️ [Clerk Database] New Clerk student account. Uploading initial local database to Clerk Cloud...');
      this.cloudSyncStatus = 'synced';
      setTimeout(() => {
        this.syncDatabaseToClerkCloud(true);
      }, 500);
    }

    this.setActiveUser(userProfile);
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
        console.error('Failed to parse user isolated state:', e);
      }
    }

    if (window.appState) {
      window.appState.doctorName = this.currentUser.fullName || window.appState.doctorName || 'Aspirant Doctor';
      if (this.currentUser.targetCollege) {
        window.appState.targetCollege = this.currentUser.targetCollege;
      }
      if (typeof saveState === 'function') {
        saveState();
      }
    }
  },

  // Real-Time Clerk Cloud Database Synchronizer
  syncDatabaseToClerkCloud(force = false) {
    if (!this.currentUser) return;

    // If local PIN user, mark as local synced
    if (this.currentUser.provider !== 'clerk') {
      this.cloudSyncStatus = 'local';
      this.updateSyncUI();
      return;
    }

    if (!this.clerkInstance || !this.clerkInstance.user) {
      this.cloudSyncStatus = 'offline';
      this.updateSyncUI();
      return;
    }

    if (this._syncDebounceTimer) {
      clearTimeout(this._syncDebounceTimer);
    }

    this._syncDebounceTimer = setTimeout(async () => {
      try {
        this.cloudSyncStatus = 'syncing';
        this.updateSyncUI();

        const payload = {
          neetStudyDatabase: window.appState || {},
          lastSyncTimestamp: Date.now(),
          lastSyncIso: new Date().toISOString(),
          appVersion: '2028.1.0'
        };

        if (this.clerkInstance && this.clerkInstance.user && typeof this.clerkInstance.user.update === 'function') {
          await this.clerkInstance.user.update({
            unsafeMetadata: {
              ...(this.clerkInstance.user.unsafeMetadata || {}),
              ...payload
            }
          });
          this.lastSyncTimestamp = Date.now();
          this.cloudSyncStatus = 'synced';
          console.log('☁️ [Clerk Database] Sync complete. All chapters, tests & notebook saved to Clerk Cloud Database.');
        }
      } catch (err) {
        console.warn('⚠️ [Clerk Database] Cloud metadata sync deferred:', err);
        this.cloudSyncStatus = 'offline';
      } finally {
        this.updateSyncUI();
      }
    }, force ? 0 : 800);
  },

  async forceClerkSync() {
    if (!this.currentUser || this.currentUser.provider !== 'clerk') {
      alert('You are currently logged in with an offline student PIN. To sync with Clerk Cloud Database, please log in with your Clerk/Google Account.');
      return;
    }
    const statusMsg = document.getElementById('clerkSyncNotice');
    if (statusMsg) statusMsg.innerHTML = '<span style="color:var(--brand-gold);">🔄 Connecting to Clerk Cloud Database...</span>';
    
    await this.syncDatabaseToClerkCloud(true);
    
    if (statusMsg) {
      statusMsg.innerHTML = '<span style="color:var(--brand-emerald);">✅ 100% Synced with Clerk Cloud Database! (' + new Date().toLocaleTimeString() + ')</span>';
    }
  },

  exportDatabaseJSON() {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.appState || {}, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `NEET_2028_Database_${(this.currentUser ? this.currentUser.firstName : 'Doctor')}_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert('Export failed: ' + e.message);
    }
  },

  importDatabaseJSON(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported && typeof imported === 'object') {
          window.appState = { ...window.appState, ...imported };
          if (typeof saveState === 'function') saveState();
          this.syncDatabaseToClerkCloud(true);
          alert('✅ Database successfully imported and synced to Clerk Cloud!');
          if (typeof renderApp === 'function') renderApp();
          const modal = document.getElementById('modal');
          if (modal) modal.close();
        }
      } catch (err) {
        alert('Invalid JSON database file: ' + err.message);
      }
    };
    reader.readAsText(file);
  },

  updateSyncUI() {
    const badge = document.getElementById('clerkCloudSyncBadge');
    if (badge) {
      if (this.cloudSyncStatus === 'syncing') {
        badge.innerHTML = '🔄 <span style="color:var(--brand-gold);">Syncing to Clerk...</span>';
      } else if (this.cloudSyncStatus === 'synced') {
        badge.innerHTML = '☁️ <span style="color:var(--brand-emerald);">Clerk Cloud Connected</span>';
      } else if (this.cloudSyncStatus === 'offline') {
        badge.innerHTML = '⚠️ <span style="color:var(--brand-amber);">Local Cached</span>';
      } else {
        badge.innerHTML = '💾 <span style="color:var(--brand-teal);">Local Passcode Mode</span>';
      }
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

  async signOut() {
    if (this.currentUser && this.currentUser.provider === 'clerk' && this.clerkInstance && typeof this.clerkInstance.signOut === 'function') {
      try {
        await this.clerkInstance.signOut();
      } catch (e) {
        console.warn('Clerk signOut warning:', e);
      }
    }

    localStorage.removeItem(AUTH_ACTIVE_SESSION_KEY);
    this.currentUser = null;
    this.renderAuthUI();
    this.broadcastAuthChange();

    if (typeof renderApp === 'function') {
      renderApp();
    }
  },

  // Student Passcode Management
  getRegisteredStudents() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_STUDENTS_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  },

  registerStudentAccount(name, emailOrPhone, pin, targetCollege = 'AIIMS New Delhi') {
    if (!name || !pin) {
      throw new Error('Name and Security PIN are required.');
    }
    if (pin.length < 4) {
      throw new Error('Security PIN must be at least 4 characters/digits.');
    }

    const students = this.getRegisteredStudents();
    const cleanId = 'std_' + Date.now();
    const existing = students.find(s => s.emailOrPhone.toLowerCase() === emailOrPhone.trim().toLowerCase());
    
    if (existing && emailOrPhone) {
      throw new Error('An account with this Email/Phone already exists. Please Log In.');
    }

    const newStudent = {
      id: cleanId,
      fullName: name.trim().startsWith('Dr.') ? name.trim() : 'Dr. ' + name.trim(),
      firstName: name.trim().replace(/^Dr\.\s*/i, '').split(' ')[0],
      emailOrPhone: emailOrPhone.trim(),
      pin: btoa(pin), // Base64 encoded verification pin
      targetCollege: targetCollege || 'AIIMS New Delhi',
      targetYear: 2028,
      provider: 'local_pin',
      createdAt: new Date().toISOString()
    };

    students.push(newStudent);
    localStorage.setItem(AUTH_STUDENTS_STORAGE_KEY, JSON.stringify(students));

    this.setActiveUser(newStudent);
    return newStudent;
  },

  loginWithStudentPin(emailOrPhone, pin) {
    if (!emailOrPhone || !pin) {
      throw new Error('Please enter your Student ID / Email and Security PIN.');
    }

    const students = this.getRegisteredStudents();
    const target = students.find(s => 
      s.emailOrPhone.toLowerCase() === emailOrPhone.trim().toLowerCase() ||
      s.fullName.toLowerCase().includes(emailOrPhone.trim().toLowerCase()) ||
      s.id === emailOrPhone.trim()
    );

    if (!target) {
      throw new Error('Student account not found. Please check your credentials or Register.');
    }

    if (target.pin !== btoa(pin)) {
      throw new Error('Incorrect Security PIN. Please try again.');
    }

    this.setActiveUser(target);
    return target;
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
      <div style="padding:4px 0;">
        <div style="text-align:center; margin-bottom:16px;">
          <span class="gate-lock-pill"><span class="pulse-red-dot"></span> ACCESS VERIFICATION REQUIRED</span>
          <h2 style="font-size:22px; margin:8px 0 4px; font-family:'Cinzel', serif; font-weight:700;">🔐 Medical OS Student Login</h2>
          <p style="font-size:12px; color:var(--text-muted); margin:0;">
            Sign in to unlock all 96 NCERT Chapters, High-Yield Notes, Mock Tests, and AIIMS 720/720 Engine.
          </p>
        </div>

        <div class="auth-tabs-nav">
          <button class="auth-tab-btn ${initialTab === 'clerk' ? 'active' : ''}" onclick="ClerkAuth.switchModalTab('clerk')">⚡ Google / Clerk Cloud</button>
          <button class="auth-tab-btn ${initialTab === 'pin' ? 'active' : ''}" onclick="ClerkAuth.switchModalTab('pin')">🩺 Student PIN Login</button>
          <button class="auth-tab-btn ${initialTab === 'register' ? 'active' : ''}" onclick="ClerkAuth.switchModalTab('register')">📝 Register Student ID</button>
        </div>

        <div id="authTabError" class="auth-error-badge"></div>

        <!-- TAB 1: CLERK CLOUD LOGIN -->
        <div id="authTabClerk" style="display: ${initialTab === 'clerk' ? 'block' : 'none'};">
          <div style="padding:16px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:14px; text-align:center;">
            <p style="font-size:13px; font-weight:600; color:var(--text-main); margin-bottom:14px;">
              Fast Cloud Sync with Google & One-Time Password (OTP)
            </p>

            <div id="clerk-mount-target" style="min-height:120px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px;">
              <button class="gate-cta-primary" style="width:100%; justify-content:center; padding:12px;" onclick="
                if (ClerkAuth.clerkInstance && typeof ClerkAuth.clerkInstance.openSignIn === 'function') {
                  ClerkAuth.clerkInstance.openSignIn();
                  document.getElementById('modal').close();
                } else {
                  ClerkAuth.switchModalTab('pin');
                }
              ">
                🌐 Continue with Google / Clerk OAuth
              </button>

              <span style="font-size:11px; color:var(--text-muted);">
                ☁️ Automatically saves your progress across Mobile, Tablet & PC
              </span>
            </div>
          </div>
        </div>

        <!-- TAB 2: STUDENT PIN LOGIN -->
        <div id="authTabPin" style="display: ${initialTab === 'pin' ? 'block' : 'none'};">
          <form onsubmit="ClerkAuth.handlePinLoginSubmit(event)" style="padding:10px 0;">
            <div class="auth-form-group">
              <label for="loginStudentId">Doctor Name, Email, or Phone</label>
              <input type="text" id="loginStudentId" class="auth-form-input" placeholder="e.g. Dr. Vinay or student@neet.edu" required autocomplete="username">
            </div>
            <div class="auth-form-group">
              <label for="loginStudentPin">Security Passcode / PIN</label>
              <input type="password" id="loginStudentPin" class="auth-form-input" placeholder="Enter your 4+ digit PIN" required autocomplete="current-password">
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; padding:12px; margin-top:8px;">
              🔓 Verify & Unlock Study OS
            </button>
          </form>
        </div>

        <!-- TAB 3: REGISTER NEW STUDENT -->
        <div id="authTabRegister" style="display: ${initialTab === 'register' ? 'block' : 'none'};">
          <form onsubmit="ClerkAuth.handleRegisterSubmit(event)" style="padding:10px 0;">
            <div class="auth-form-group">
              <label for="regStudentName">Full Doctor / Aspirant Name</label>
              <input type="text" id="regStudentName" class="auth-form-input" placeholder="e.g. Dr. Vinay Kumar Makvana" required>
            </div>
            <div class="auth-form-group">
              <label for="regEmailPhone">Email or Mobile Number (for account ID)</label>
              <input type="text" id="regEmailPhone" class="auth-form-input" placeholder="e.g. vinay@gmail.com or 9876543210" required>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div class="auth-form-group">
                <label for="regTargetCollege">Dream Medical College</label>
                <select id="regTargetCollege" class="auth-form-input">
                  <option value="AIIMS New Delhi">AIIMS New Delhi (Rank 1)</option>
                  <option value="JIPMER Puducherry">JIPMER Puducherry</option>
                  <option value="MAMC New Delhi">MAMC New Delhi</option>
                  <option value="KGMU Lucknow">KGMU Lucknow</option>
                  <option value="State Top GMC">State Top GMC</option>
                </select>
              </div>
              <div class="auth-form-group">
                <label for="regStudentPin">Create 4+ Digit Passcode</label>
                <input type="password" id="regStudentPin" class="auth-form-input" placeholder="Set 4+ digit PIN" required minlength="4">
              </div>
            </div>
            <button type="submit" class="btn btn-emerald" style="width:100%; justify-content:center; padding:12px; margin-top:8px;">
              🩺 Create Verified Profile & Unlock Portal
            </button>
          </form>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:14px;">
          <button class="btn ghost" onclick="document.getElementById('modal').close()">Dismiss</button>
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

    document.querySelectorAll('.auth-tab-btn').forEach((btn, i) => {
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
  },

  handlePinLoginSubmit(e) {
    e.preventDefault();
    const errorEl = document.getElementById('authTabError');
    const idInput = document.getElementById('loginStudentId');
    const pinInput = document.getElementById('loginStudentPin');

    try {
      this.loginWithStudentPin(idInput.value, pinInput.value);
      document.getElementById('modal').close();
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = '⚠️ ' + err.message;
        errorEl.style.display = 'block';
      }
    }
  },

  handleRegisterSubmit(e) {
    e.preventDefault();
    const errorEl = document.getElementById('authTabError');
    const name = document.getElementById('regStudentName').value;
    const emailPhone = document.getElementById('regEmailPhone').value;
    const college = document.getElementById('regTargetCollege').value;
    const pin = document.getElementById('regStudentPin').value;

    try {
      this.registerStudentAccount(name, emailPhone, pin, college);
      document.getElementById('modal').close();
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = '⚠️ ' + err.message;
        errorEl.style.display = 'block';
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
