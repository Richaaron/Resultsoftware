import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf-8');
let lines = content.split('\n');

// Lines to fix: 1369, 1388, 1597, 1618 (0-indexed: 1368, 1387, 1596, 1617)
const linesToFix = [1368, 1387, 1596, 1617];

for(const lineIndex of linesToFix) {
  if(lines[lineIndex].endsWith('`}}')) {
    lines[lineIndex] = lines[lineIndex].slice(0, -1);  // Remove last character
    console.log('Fixed line ' + (lineIndex + 1));
  }
}

fs.writeFileSync('src/pages/AdminDashboard.jsx', lines.join('\n'));
console.log('Done!');
