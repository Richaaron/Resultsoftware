import fs from 'fs';

const code = fs.readFileSync('./src/pages/AdminDashboard.jsx', 'utf-8');
const lines = code.split('\n');

// Find where MainAdminDashboard return starts and ends
console.log("=== Component analysis ===");
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line.startsWith('const') && line.includes('= () => {')) {
    console.log(`Line ${i+1}: ${line}`);
  }
}

// Check around line 1735
console.log("\n=== Around error line 1735 ===");
for (let i = 1728; i < 1745; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
