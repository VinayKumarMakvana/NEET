const fs = require('fs');
const mainPath = 'js/main.js';
let mainContent = fs.readFileSync(mainPath, 'utf8');

const oldSaveState = `  function saveState() {
    const currentUid = (typeof ClerkAuth !== 'undefined' && ClerkAuth.currentUser && ClerkAuth.currentUser.id) 
      ? ClerkAuth.currentUser.id 
      : null;
    
    if (currentUid) {
      localStorage.setItem(\`\${window.NEET_STORAGE_KEY}_\${currentUid}\`, JSON.stringify(appState));
    }
    localStorage.setItem(window.NEET_STORAGE_KEY, JSON.stringify(appState));`;

const newSaveState = `  function saveState() {
    const currentUid = (typeof ClerkAuth !== 'undefined' && ClerkAuth.currentUser && ClerkAuth.currentUser.id) 
      ? ClerkAuth.currentUser.id 
      : (window.appState && window.appState.profile && window.appState.profile.id) || 'guest';
    
    if (currentUid && currentUid !== 'guest') {
      localStorage.setItem(\`\${window.NEET_STORAGE_KEY}_\${currentUid}\`, JSON.stringify(appState));
      
      // SYNC WITH MONGODB BACKEND
      fetch('http://localhost:3028/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUid, appState: window.appState })
      }).catch(err => console.warn('Cloud Sync Failed:', err));
    }
    localStorage.setItem(window.NEET_STORAGE_KEY, JSON.stringify(appState));`;

if (mainContent.includes(oldSaveState)) {
  mainContent = mainContent.replace(oldSaveState, newSaveState);
  fs.writeFileSync(mainPath, mainContent);
  console.log('Successfully updated saveState to sync with MongoDB backend!');
} else {
  console.log('Could not find exact saveState string to replace.');
}
