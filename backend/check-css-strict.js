const fs = require('fs');
const content = fs.readFileSync('../frontend-react/src/components/ReportCard.css', 'utf8');
const lines = content.split('\n');

let depth = 0;
lines.forEach((line, i) => {
  for (let char of line) {
    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth < 0) {
        console.log(`ERROR: Unexpected } at Line ${i + 1}`);
        console.log(`Content: ${line.trim()}`);
        depth = 0;
      }
    }
  }
});

if (depth > 0) {
  console.log(`ERROR: Missing ${depth} closing brace(s) at end of file.`);
} else if (depth === 0) {
  console.log('SUCCESS: All braces are correctly matched.');
}
