import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function toolRevision(root = process.cwd()) {
  const file = path.join(root, 'contributor-release.json');
  if (!fs.existsSync(file)) return execFileSync('git', ['rev-parse', 'HEAD'], {cwd:root, encoding:'utf8'}).trim();
  const release = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (release.format !== 1 || !/^[a-f0-9]{40}$/.test(release.source_revision)) throw new Error('Invalid contributor release');
  for (const [name, expected] of Object.entries(release.files)) {
    if (path.isAbsolute(name) || name.split('/').includes('..')) throw new Error('Invalid release path');
    const actual = createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex');
    if (actual !== expected) throw new Error(`Release file changed: ${name}. Extract a fresh copy; preserve your contribution files.`);
  }
  return release.source_revision;
}
if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) console.log(toolRevision());
