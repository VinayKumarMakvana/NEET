const fs = require('fs');
let rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
let serverPkg = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));

if (!rootPkg.dependencies) rootPkg.dependencies = {};

Object.assign(rootPkg.dependencies, serverPkg.dependencies);

fs.writeFileSync('package.json', JSON.stringify(rootPkg, null, 2));
console.log('Merged dependencies into package.json');
