const fs = require('fs');
const content = fs.readFileSync('../frontend-react/src/components/ReportCard.css', 'utf8');
const lines = content.split('\n');

let depth = 0;
lines.forEach((line, i) => {
  const opens = (line.match(/\{/g) || []).length;
  const closes = (line.match(/\}/g) || []).length;
  
  const prevDepth = depth;
  depth += opens - closes;
  
  if (depth < 0) {
    console.log(`LINE ${i + 1}: Unexpected closing brace! (Depth became ${depth})`);
    console.log(`Content: ${line}`);
    depth = 0; // reset for further checking
  }
  
  // if (opens > 0 || closes > 0) {
  //   console.log(`LINE ${i + 1}: Depth ${prevDepth} -> ${depth} | ${line.trim()}`);
  // }
});

if (depth > 0) {
  console.log(`END OF FILE: Missing ${depth} closing brace(s)!`);
} else if (depth < 0) {
  console.log(`END OF FILE: Too many closing braces! (${depth})`);
} else {
  console.log('Braces are balanced and correctly ordered.');
}
