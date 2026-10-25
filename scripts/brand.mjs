// Sync or verify the vendored Cosmik brand release with the brand vendor tool.
//
//   npm run brand:sync -- --brand <checkout>
//   npm run brand:verify [-- --brand <checkout>]
//
// The checkout must be clean and exactly at its vX.Y.Z tag. `sync` runs the release's own
// vendor tool. `verify` checks every file against the lock; given the checkout, it also proves
// the lock against its release tag. The website uses only the Cosmik brand: product family
// kits (brand-tectra, brand-hplx) are not vendored here.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [command, ...args] = process.argv.slice(2);
let checkout;
for (let i = 0; i < args.length; i += 2) {
  if (args[i] !== '--brand' || !args[i + 1]) usage(`Unknown or incomplete option ${args[i]}.`);
  checkout = path.resolve(args[i + 1]);
}
if (!['sync', 'verify'].includes(command)) usage('Choose sync or verify.');
if (command === 'sync' && !checkout) usage('sync needs the brand checkout.');

const into = 'vendor/brand';
if (command === 'sync') run(path.join(checkout, 'scripts/vendor.mjs'), 'sync', '--from', checkout, '--into', into);
run(path.join(root, into, 'scripts/vendor.mjs'), 'verify', into, ...(checkout ? ['--release', checkout] : []));

function run(...argv) {
  const result = spawnSync(process.execPath, argv, { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function usage(message) {
  console.error(`${message}\nUsage: node scripts/brand.mjs sync|verify [--brand <checkout>]`);
  process.exit(2);
}
