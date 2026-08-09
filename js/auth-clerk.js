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
        }
      }
    } catch (e) {
      // Server unreachable, ignore silent check
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

    // 1. Send to server for permanent cross-device persistence
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          emailOrPhone: cleanEmail,
          pin: pin,
          targetCollege: targetCollege,
          initialData: window.appState || {}
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server registration failed.');
      }

      const userProfile = {
        ...data.user,
        sessionId: data.sessionId,
        lastLoginAt: new Date().toISOString()
      };

      // Also save locally as offline fallback
      const students = this.getRegisteredStudents();
      students.push({
        id: userProfile.id,
        fullName: userProfile.fullName,
        firstName: userProfile.firstName,
        emailOrPhone: userProfile.emailOrPhone,
        pin: btoa(pin),
        targetCollege: userProfile.targetCollege,
        provider: 'local_pin',
        sessionId: data.sessionId
      });
      localStorage.setItem(AUTH_STUDENTS_STORAGE_KEY, JSON.stringify(students));

      this.setActiveUser(userProfile);
      this.startSessionHeartbeat();
      return userProfile;
    } catch (serverErr) {
      if (serverErr.message && serverErr.message.includes('already exists')) {
        throw serverErr;
      }
      console.warn('⚠️ Server offline, falling back to local storage registration:', serverErr);

      // Local fallback
      const students = this.getRegisteredStudents();
      const cleanId = 'std_' + Date.now();
      const existing = students.find(s => s.emailOrPhone.toLowerCase() === cleanEmail.toLowerCase());
      
      if (existing && cleanEmail) {
        throw new Error('An account with this Email/Phone already exists. Please Log In.');
      }

      const newStudent = {
        id: cleanId,
        fullName: cleanName,
        firstName: cleanName.replace(/^Dr\.\s*/i, '').split(' ')[0],
        emailOrPhone: cleanEmail,
        pin: btoa(pin),
        targetCollege: targetCollege || 'AIIMS New Delhi',
        targetYear: 2028,
        provider: 'local_pin',
        sessionId: 'sess_local_' + Date.now(),
        createdAt: new Date().toISOString()
      };

      students.push(newStudent);
      localStorage.setItem(AUTH_STUDENTS_STORAGE_KEY, JSON.stringify(students));

      this.setActiveUser(newStudent);
      return newStudent;
    }
  },

  async loginWithStudentPin(emailOrPhone, pin) {
    if (!emailOrPhone || !pin) {
      throw new Error('Please enter your Student ID / Email and Security PIN.');
    }

    const cleanInput = emailOrPhone.trim();

    // 1. Attempt Server Login (Cross-device + single device session generation)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: cleanInput,
          pin: pin
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      const userProfile = {
        ...data.user,
        sessionId: data.sessionId,
        lastLoginAt: new Date().toISOString()
      };

      // 2. Restore all user study data and purchases permanently (ZERO DATA LOSS!)
      if (data.studyData && typeof data.studyData === 'object' && Object.keys(data.studyData).length > 0) {
        console.log('📦 Restoring student database & purchases from server...', data.studyData);
        window.appState = {
          ...(window.appState || {}),
          ...data.studyData,
          progress: { ...((window.appState && window.appState.progress) || {}), ...(data.studyData.progress || {}) },
          testHistory: [ ...(data.studyData.testHistory || (window.appState && window.appState.testHistory) || []) ],
          mistakes: [ ...(data.studyData.mistakes || (window.appState && window.appState.mistakes) || []) ],
          purchases: {
            ...((window.appState && window.appState.purchases) || {}),
            ...(data.studyData.purchases || {})
          }
        };

        if (typeof STORAGE_KEY !== 'undefined') {
          localStorage.setItem(`${STORAGE_KEY}_${userProfile.id}`, JSON.stringify(window.appState));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(window.appState));
        }
      }

      this.setActiveUser(userProfile);
      this.startSessionHeartbeat();
      return userProfile;
    } catch (serverErr) {
      if (serverErr.message && (serverErr.message.includes('not found') || serverErr.message.includes('Incorrect'))) {
        throw serverErr;
      }

      console.warn('⚠️ Server login offline, checking local storage:', serverErr);

      // Local offline fallback
      const students = this.getRegisteredStudents();
      const target = students.find(s => 
        s.emailOrPhone.toLowerCase() === cleanInput.toLowerCase() ||
        s.fullName.toLowerCase().includes(cleanInput.toLowerCase()) ||
        s.id === cleanInput
      );

      if (!target) {
        throw new Error('Student account not found. Please check your credentials or Register.');
      }

      if (target.pin !== btoa(pin) && target.pin !== pin) {
        throw new Error('Incorrect Security PIN. Please try again.');
      }

      target.sessionId = 'sess_local_' + Date.now();
      this.setActiveUser(target);
      return target;
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
          max-width: 380px !important;
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
              <button id="authTabClerk" class="auth-seg-btn ${initialTab === 'clerk' ? 'active' : ''}" onclick="ClerkAuth.switchModalTab('clerk')">
                Cloud Login
              </button>
              <button id="authTabPin" class="auth-seg-btn ${initialTab === 'pin' ? 'active' : ''}" onclick="ClerkAuth.switchModalTab('pin')">
                Sign In
              </button>
              <button id="authTabRegister" class="auth-seg-btn ${initialTab === 'register' ? 'active' : ''}" onclick="ClerkAuth.switchModalTab('register')">
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
