const fs = require('fs');
const path = require('path');
const dir = 'src/pages/admin';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const regex = /(gambarUrl|gambarSampul|fotoUrl|gambar|fileUrl|logoUrl|kepalaDesaFotoUrl|strukturOrganisasiUrl|bannerUrl):\s*(e\.target\.value)/g;

let modifiedCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  if (regex.test(content)) {
    // Replace the specific fields
    content = content.replace(regex, '$1: parseGoogleDriveUrl($2)');
    
    // Add import if not present
    if (!content.includes('parseGoogleDriveUrl')) {
      // Find the last import statement or the beginning of the file
      const importRegex = /^import\s+.*?;?\s*$/gm;
      let lastImportIndex = 0;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        lastImportIndex = match.index + match[0].length;
      }
      
      const importStatement = '\nimport { parseGoogleDriveUrl } from "@/lib/utils";\n';
      
      if (lastImportIndex > 0) {
        content = content.slice(0, lastImportIndex) + importStatement + content.slice(lastImportIndex);
      } else {
        content = importStatement + content;
      }
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log('Updated', file);
      modifiedCount++;
    }
  }
}
console.log('Total files modified:', modifiedCount);
