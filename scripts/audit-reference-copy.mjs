import fs from 'node:fs';
import ts from 'typescript';
const dictionary=ts.createSourceFile('copy.ts',fs.readFileSync('src/components/template/reference-copy.ts','utf8'),ts.ScriptTarget.Latest,true);
const keys=new Set();
function readKeys(n){if(ts.isPropertyAssignment(n)&&n.name&&(ts.isStringLiteral(n.name)||ts.isIdentifier(n.name)))keys.add(n.name.text);ts.forEachChild(n,readKeys);}
readKeys(dictionary);
const missing=new Set();
for(const name of fs.readdirSync('src/components/template').filter(n=>n.endsWith('.tsx'))){
 const file=ts.createSourceFile(name,fs.readFileSync(`src/components/template/${name}`,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 function walk(n){
  if(ts.isCallExpression(n)&&ts.isIdentifier(n.expression)&&n.expression.text==='copyText'&&n.arguments[0]&&ts.isStringLiteral(n.arguments[0])){
   const value=n.arguments[0].text.trim();if(/[a-zA-Z]{3}/.test(value)&&!keys.has(value)&&!/^RYCODE|^AI$/.test(value))missing.add(value);
  }
  if(ts.isPropertyAssignment(n)&&ts.isIdentifier(n.name)&&['title','label','question','answer','name','description','role'].includes(n.name.text)&&ts.isStringLiteral(n.initializer)){
   const value=n.initializer.text.trim();if(/[a-zA-Z]{3}/.test(value)&&!keys.has(value)&&!value.startsWith('RYCODE'))missing.add(value);
  }
  ts.forEachChild(n,walk);
 }
 walk(file);
}
console.log(JSON.stringify([...missing].sort(),null,2));
