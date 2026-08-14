const fs = require('fs');
const mainPath = 'js/main.js';
let mainContent = fs.readFileSync(mainPath, 'utf8');

const regex = /function saveState\(\)\s*\{[\s\S]*?localStorage\.setItem\(window\.NEET_STORAGE_KEY,\s*JSON\.stringify\(appState\)\);/;

const newSaveState = `function saveState() {
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

if (mainContent.match(regex)) {
  mainContent = mainContent.replace(regex, newSaveState);
  fs.writeFileSync(mainPath, mainContent);
  console.log('Regex update for saveState successful!');
} else {
  console.log('Regex failed.');
}
