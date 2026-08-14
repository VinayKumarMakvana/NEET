const fs = require('fs');
const serverPath = 'server.js';
let content = fs.readFileSync(serverPath, 'utf8');

if (!content.includes('dns.setServers')) {
  content = content.replace(
    "const mongoose = require('mongoose');",
    "const mongoose = require('mongoose');\nconst dns = require('dns');\n// Force Google DNS to bypass ISP block for MongoDB Atlas\ndns.setServers(['8.8.8.8', '8.8.4.4']);"
  );
  fs.writeFileSync(serverPath, content);
  console.log('Patched server.js with Google DNS fix');
}
