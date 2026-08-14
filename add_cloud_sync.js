const fs = require('fs');
const mainPath = 'js/main.js';
let mainContent = fs.readFileSync(mainPath, 'utf8');

const syncFunction = `
// ==========================================
// MONGODB CLOUD SYNC
// ==========================================
window.syncWithCloud = async function() {
  const currentUid = (typeof ClerkAuth !== 'undefined' && ClerkAuth.currentUser && ClerkAuth.currentUser.id) 
    ? ClerkAuth.currentUser.id 
    : (window.appState && window.appState.profile && window.appState.profile.id) || null;
    
  if (currentUid && currentUid !== 'guest') {
    try {
      const res = await fetch(\`http://localhost:3028/api/progress/\${currentUid}\`);
      const data = await res.json();
      if (data.success && data.appState) {
        // Merge cloud state into local state
        window.appState = { ...window.appState, ...data.appState };
        localStorage.setItem(window.NEET_STORAGE_KEY, JSON.stringify(window.appState));
        if (typeof renderApp === 'function') renderApp();
        console.log('Cloud Sync Complete: State Restored from MongoDB');
      }
    } catch (err) {
      console.warn('Failed to fetch state from MongoDB', err);
    }
  }
};

// Call sync immediately after init
setTimeout(() => window.syncWithCloud(), 1000);
`;

mainContent = mainContent + '\n' + syncFunction;
fs.writeFileSync(mainPath, mainContent);
console.log('Added syncWithCloud to main.js!');
