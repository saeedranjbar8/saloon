import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
async function walk(dir) {
 const entries=await readdir(dir,{withFileTypes:true});
 const files=[];
 for(const entry of entries){const file=join(dir,entry.name);if(entry.isDirectory())files.push(...await walk(file));else if(/\.tsx?$/.test(entry.name))files.push(file);}
 return files;
}
const files=await walk('src/modules');
const issues=[];
for(const file of files){
 const owner=file.split(/[\\/]/)[2];
 const source=await readFile(file,'utf8');
 for(const [,specifier] of source.matchAll(/from\s+['"]([^'"]+)['"]/g)){
  const target=specifier.match(/^\.\.\/([^/]+)/);
  if(target && target[1]!==owner && !specifier.endsWith('/index')) issues.push(`${file}: cross-module internal import ${specifier}`);
 }
}
if(issues.length){console.error(issues.join('\n'));process.exit(1);}
console.log(`Boundary check passed (${files.length} files).`);
