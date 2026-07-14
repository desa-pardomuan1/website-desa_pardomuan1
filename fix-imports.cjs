const fs = require('fs');
const path = require('path');
const dir = 'src/pages/admin';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
let c = 0;
for (const file of files) {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  if (content.includes('parseGoogleDriveUrl(') && !content.includes('import { parseGoogleDriveUrl }')) {
    if (content.includes('import { toast } from "sonner";')) {
      content = content.replace('import { toast } from "sonner";', 'import { toast } from "sonner";\nimport { parseGoogleDriveUrl } from "@/lib/utils";');
    } else {
      content = 'import { parseGoogleDriveUrl } from "@/lib/utils";\n' + content;
    }
    fs.writeFileSync(p, content);
    c++;
    console.log('Fixed imports in', file);
  }
}
console.log('Fixed', c, 'files');
