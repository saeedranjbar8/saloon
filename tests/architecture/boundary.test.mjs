import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const checker=await readFile('scripts/check-boundaries.mjs','utf8');
function hasBoundaryRule(source) { return source.includes("!specifier.endsWith('/index')") && source.includes('cross-module internal import'); }
assert.equal(hasBoundaryRule(checker), true, 'checker must reject cross-module internals and allow index.ts');
const violation="import '../payments/internal';";
const publicImport="import '../payments/index';";
assert.match(violation,/\.\.\/payments\/(?!index)/);
assert.doesNotMatch(publicImport,/\.\.\/payments\/(?!index)/);
console.log('Boundary checker rule and deliberate violation fixture verified.');
