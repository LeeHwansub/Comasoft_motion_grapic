// Copy web/export/out → web/export/history/YYYY-MM-DD-<label>
// Usage: node snapshot.mjs --label=v5-scene04
import { cpSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, v = 'true'] = a.replace(/^--/, '').split('=');
  return [k, v];
}));

const label = args.label;
if (!label || label === 'true') {
  console.error('Usage: node snapshot.mjs --label=<name>');
  process.exit(1);
}

const outDir = join(here, 'out');
if (!existsSync(outDir) || readdirSync(outDir).filter(f => f !== '.DS_Store').length === 0) {
  console.error('out/ is empty — run capture.mjs first');
  process.exit(1);
}

const day = new Date().toISOString().slice(0, 10);
const dest = join(here, 'history', `${day}-${label}`);
mkdirSync(dest, { recursive: true });
for (const name of readdirSync(outDir)) {
  if (name === '.DS_Store') continue;
  cpSync(join(outDir, name), join(dest, name));
}
console.log(`snapshot → ${dest}`);
