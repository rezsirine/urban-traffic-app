const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/data\.(incidents|zones|vehicles|notifications|dashboard)/g, '(data as any).$1');
    fs.writeFileSync(filePath, content);
    console.log('Fixed', filePath);
  }
}

const files = [
  'app/incidents/page.tsx',
  'app/notifications/page.tsx',
  'app/page.tsx',
  'app/vehicles/page.tsx',
  'app/zones/page.tsx'
];

files.forEach(f => replaceInFile(path.join(__dirname, f)));
