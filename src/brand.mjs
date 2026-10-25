import { readFileSync } from 'node:fs';

/**
 * Published brand files come from the vendored Cosmik brand release named in
 * brand-provenance.json, never from hand-copied files. The build copies exactly
 * the `published` set into site/, and src/assets.mjs hashes the same bytes.
 */
const read = path => readFileSync(new URL(`../${path}`, import.meta.url));
export const provenance = JSON.parse(read('brand-provenance.json'));
export const locks = Object.fromEntries(Object.entries(provenance.locks).map(([name, path]) => [name, JSON.parse(read(path))]));

/** The lock (and so the release) a vendored path belongs to: the deepest lock directory that contains it. */
export function lockFor(path) {
  const owners = Object.entries(provenance.locks)
    .map(([name, lock]) => ({ name, dir: lock.slice(0, lock.lastIndexOf('/') + 1) }))
    .filter(({ dir }) => path.startsWith(dir))
    .sort((a, b) => b.dir.length - a.dir.length);
  if (!owners.length) throw new Error(`${path} is not inside a vendored release.`);
  const { name, dir } = owners[0];
  return { name, dir, lock: locks[name], file: path.slice(dir.length) };
}

/** The bytes the site publishes at `target`: the vendored file, unchanged. */
export function publishedBytes(target) {
  const entry = provenance.published[target];
  if (!entry) return null;
  if (entry.derive) throw new Error(`${target}: published brand files are copied unchanged; derivations are not supported.`);
  return read(entry.from);
}
