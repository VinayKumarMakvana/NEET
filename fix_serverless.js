const fs = require('fs');
const serverPath = 'server/server.js';
let content = fs.readFileSync(serverPath, 'utf8');

// Replace the app.listen block with a conditional app.listen and export
const oldListen = /app\.listen\(port, \(\) => \{[\s\S]*?\}\);/g;
const newListen = `if (require.main === module) {
  app.listen(port, () => {
    console.log(\`Server running on http://localhost:\${port}\`);
    console.log(\`Using Database: MongoDB (Mongoose)\`);
  });
}
module.exports = app;`;

if (content.match(oldListen)) {
  content = content.replace(oldListen, newListen);
  fs.writeFileSync(serverPath, content);
  console.log('Modified server.js for serverless deployment');
} else {
  console.log('app.listen not found or already modified.');
}
