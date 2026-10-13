import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const dir = mkdtempSync(join(tmpdir(), 'travel-media-test-'));
const file = join(dir, 'fixture.mp4');
writeFileSync(file, '0123456789');
const code = ts.transpileModule(readFileSync('src/app/api/travel-evidence/[asset]/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const mod = { exports: {} };
new Function('module', 'exports', 'require', code)(mod, mod.exports, name => name === '@/lib/travel-evidence-media' ? { travelEvidenceFiles: { 'r1-miso': { video: file } } } : require(name));
const original = process.env.NODE_ENV;
const call = (asset = 'r1-miso.mp4', headers = {}, host = '127.0.0.1') => mod.exports.GET(new Request(`http://${host}/api/travel-evidence/${asset}`, { headers }), { params: Promise.resolve({ asset }) });
try {
  process.env.NODE_ENV = 'production';
  assert.equal((await call()).status, 404);
  process.env.NODE_ENV = 'development';
  assert.equal((await call(undefined, {}, 'example.com')).status, 404);
  assert.equal((await call(undefined, { 'sec-fetch-site': 'cross-site' })).status, 404);
  assert.equal((await call('../private.txt')).status, 404);
  assert.equal((await call('r1-unknown.mp4')).status, 404);
  assert.equal((await call(undefined, { range: 'bytes=99-100' })).status, 416);
  const range = await call(undefined, { range: 'bytes=2-5' });
  assert.equal(range.status, 206);
  assert.equal(range.headers.get('content-range'), 'bytes 2-5/10');
  assert.equal(await range.text(), '2345');
  const suffix = await call(undefined, { range: 'bytes=-3' });
  assert.equal(await suffix.text(), '789');
  const full = await call();
  assert.equal(full.headers.get('cache-control'), 'no-store');
  assert.equal(await full.text(), '0123456789');
  console.log('Evidence media: production/external/cross-site access denied; fixed asset allowlist, byte ranges and no-store passed.');
} finally {
  if (original === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = original;
  rmSync(dir, { recursive: true });
}
