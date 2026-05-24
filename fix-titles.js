const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('page.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src/app');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace "Something | Quietly Humans" with "Something"
  if (content.match(/title:\s*["']([^"']+) \| Quietly Humans["']/g)) {
    content = content.replace(/title:\s*["']([^"']+) \| Quietly Humans["']/g, 'title: "$1"');
    changed = true;
  }
  
  // Replace "Something - Quietly Humans" with "Something"
  if (content.match(/title:\s*["']([^"']+) - Quietly Humans["']/g)) {
    content = content.replace(/title:\s*["']([^"']+) - Quietly Humans["']/g, 'title: "$1"');
    changed = true;
  }
  
  // Also check for dynamic template literals
  if (content.match(/title:\s*`([^`]+) \| Quietly Humans`/g)) {
    content = content.replace(/title:\s*`([^`]+) \| Quietly Humans`/g, 'title: `$1`');
    changed = true;
  }
  
  if (content.match(/title:\s*`([^`]+) - Quietly Humans`/g)) {
    content = content.replace(/title:\s*`([^`]+) - Quietly Humans`/g, 'title: `$1`');
    changed = true;
  }

  // Edge cases where the page ONLY says "Quietly Humans"
  if (content.match(/title:\s*["']Quietly Humans["']/g) && !file.includes('layout.tsx')) {
    // If it's a home page or something, we might leave it or let template handle it
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated title in ${file}`);
  }
});
