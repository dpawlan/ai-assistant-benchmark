#!/usr/bin/env node
/** Contribution pilot. Run `node scripts/contribute.mjs help` for commands. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { validateBundle, scrub, digest, wire, stageBundle, reviewDigest } from './lib/contribution.mjs';
import { redisClient, INDEX, payloadKey } from './lib/contribution-store.mjs';

const { values: opts, positionals } = parseArgs({ allowPositionals: true, options: Object.fromEntries([
  'slug','handle','platform','disclosure','comped','tier','timezone','integrations','out','file','endpoint','invite-file','confirm','ids','receipt',
].map(k => [k,{type:'string'}]).concat(['publish-excerpts','show-proposal'].map(k => [k,{type:'boolean'}]))) });
const ROOT = process.cwd();
const DATA = path.join(ROOT,'data');
const endpoint = opts.endpoint ?? 'https://assistantbenchmark.com/api/contribute';
const read = (p, fallback) => { try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch (e) { if (e.code === 'ENOENT' && fallback !== undefined) return fallback; throw e; } };
const write = (p, data) => { fs.mkdirSync(path.dirname(p),{recursive:true,mode:0o700}); const tmp = `${p}.tmp`; fs.writeFileSync(tmp, wire(data),{mode:0o600}); fs.renameSync(tmp,p); };
const fail = message => { throw new Error(message); };
const required = key => opts[key] ?? fail(`--${key} is required`);
const roster = read(path.join(DATA,'index.json')).agents.map(a => a.slug);
const rubric = read(path.join(DATA,'tasks.json'));
const validate = b => validateBundle(b,{slugs:roster,categories:rubric.tasks.map(t=>t.key)});
const dir = () => { const slug=required('slug'); if (!roster.includes(slug)) fail('Unknown assistant'); return path.join(DATA,'agents',slug); };
const selected = () => {
  const all=read(path.join(dir(),'runs.draft.json'),[]), ids=required('ids').split(',');
  if (new Set(ids).size !== ids.length) fail('Repeated IDs');
  const drafts=ids.map(id => all.find(d=>d.id===id) ?? fail(`Unknown draft ${id}`));
  if (drafts.some(d=>!d.contribution)) fail('This review flow is for contributed runs');
  return {all,drafts};
};
function bundle() {
  const agent=dir();
  for (const k of ['handle','platform','disclosure','comped','tier','timezone','integrations']) required(k);
  const usage=read(path.join(agent,'usage.json'));
  const drafts=read(path.join(agent,'runs.draft.json')).filter(d=>d.skip!==true);
  const signalsKeys=['turns','my_messages','agent_messages','first_reply_s','duration_min','agent_said_done','agent_said_cant','agent_asked_question','agent_initiated'];
  const b=validate({
    version:2,id:crypto.randomUUID(),tool_revision:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),rubric_version:rubric.version,slug:opts.slug,
    contributor:{platform:opts.platform,handle:opts.handle.startsWith('@')?opts.handle:`@${opts.handle}`,disclosure:scrub(opts.disclosure),comped:scrub(opts.comped)},
    source:usage.source,context:{tier:opts.tier,timezone:opts.timezone,integrations:opts.integrations},
    drafts:drafts.map(d=>({id:d.id,category:d.category,protocol:d.protocol,date:d.date,
      signals:Object.fromEntries(signalsKeys.map(k=>[k,d.signals[k]])),
      excerpt:d.excerpt.map(m=>({from:m.from,ts:m.ts,text:scrub(m.text),attachment:Boolean(m.attachment)})),
      truncated:d.truncated !== false,proposed_score:d.score??null,proposed_outcome:d.outcome??null,notes:scrub(d.notes??''),public_excerpts:opts['publish-excerpts']===true,
    })),
  });
  const file=opts.out??path.join('contrib',`${opts.slug}-${b.id}.json`);
  write(file,b);
  console.log(`Bundle: ${file}\nNo data sent. Preview it before requesting consent.`);
}
function preview() {
  const b=validate(read(required('file'))), body=wire(b);
  const url=new URL(endpoint);
  if (url.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(url.hostname)) fail('HTTPS is required');
  console.log(`Destination: ${endpoint}\nEvery field below will be sent. Excerpts may contain personal details; review them in full.\nPrivate submissions expire after 90 days. Approved public results remain until corrected or withdrawn.\n`);
  process.stdout.write(body);
  const confirmation=digest(`${endpoint}\n${body}`);
  write(`${opts.file}.preview.json`,{confirmation,endpoint});
  console.log(`\nConfirmation digest: ${confirmation}\nAsk the contributor for an explicit yes before using submit --confirm with this digest.`);
}
async function submit() {
  const b=validate(read(required('file'))), body=wire(b);
  const preview=read(`${opts.file}.preview.json`);
  const confirmation=digest(`${endpoint}\n${body}`);
  if (preview.confirmation!==confirmation || required('confirm')!==confirmation || preview.endpoint!==endpoint) fail('Content or destination changed. Preview again and get new consent.');
  const invitation=read(required('invite-file'));
  if (Date.parse(invitation.expires_at)<=Date.now() || typeof invitation.token!=='string') fail('Invitation expired or invalid');
  let res;
  try { res=await fetch(endpoint,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json',Authorization:`Bearer ${invitation.token}`},body,signal:AbortSignal.timeout(30000)}); }
  catch { fail('Receipt unknown. Keep the bundle and retry this exact command; do not rebuild it.'); }
  const result=await res.json();
  if (!res.ok || !result.success || !/^[a-f0-9]{64}$/.test(result.id)) fail(`Not confirmed received: ${result.error??res.status}. Keep the bundle.`);
  write(`${opts.file}.receipt.json`,{id:result.id,endpoint,received_at:new Date().toISOString(),duplicate:result.duplicate});
  console.log(`Received: ${result.id}\nSaved receipt: ${opts.file}.receipt.json\nDavid will review the evidence and confirm any score before publication.`);
}
async function pull() {
  const redis=redisClient(), ids=await redis(['SMEMBERS',INDEX]);
  let count=0;
  for (const slug of roster) {
    const folder=path.join(DATA,'agents',slug), privateDir=path.join(folder,'contrib');
    if (!fs.existsSync(privateDir)) continue;
    const expired=new Set();
    for (const file of fs.readdirSync(privateDir).filter(f=>/^[a-f0-9]{64}\.json$/.test(f))) {
      const record=read(path.join(privateDir,file));
      if (Date.parse(record.expires_at)<=Date.now()) { expired.add(record.id); fs.rmSync(path.join(privateDir,file)); }
    }
    if (expired.size) {
      const f=path.join(folder,'runs.draft.json');
      write(f,read(f,[]).filter(d=>!expired.has(d.contribution?.receipt)));
    }
  }
  for (const id of ids) {
    if (!/^[a-f0-9]{64}$/.test(id)) continue;
    const payload=await redis(['GET',payloadKey(id)]);
    if (!payload) { await redis(['SREM',INDEX,id]); continue; }
    const record=typeof payload==='string'?JSON.parse(payload):payload;
    const b=validate(record.bundle), folder=path.join(DATA,'agents',b.slug);
    const draftsFile=path.join(folder,'runs.draft.json');
    const drafts=read(draftsFile,[]), runs=read(path.join(folder,'runs.json'),[]);
    const next=stageBundle(b,id,drafts,runs);
    write(path.join(folder,'contrib',`${id}.json`),record);
    write(draftsFile,next); count+=next.length-drafts.length;
  }
  console.log(`${count} drafts staged privately. Public scores and Speed were not changed.`);
}
function review() {
  const {drafts}=selected();
  if (opts['show-proposal'] && drafts.some(d=>d.score==null || !d.rationale)) fail('Record an independent score and rationale before revealing proposals.');
  const publicExcerpts=Boolean(opts['publish-excerpts']);
  for (const d of drafts) {
    const {approval,proposed_score,proposed_outcome,...card}=d;
    console.log(wire({...card,...(opts['show-proposal']?{proposed_score,proposed_outcome}:{}),publication:{public_excerpts:publicExcerpts,ranking_eligible:false}}));
  }
  const confirmation=digest({digests:drafts.map(reviewDigest),publicExcerpts});
  console.log(`Review digest: ${confirmation}\nDavid must approve the selected scores, notes, attribution, disclosures and excerpt visibility.\nUse confirm-review --confirm with this digest only after his explicit approval.`);
}
function confirmReview() {
  const {all,drafts}=selected(), publicExcerpts=Boolean(opts['publish-excerpts']);
  const confirmation=digest({digests:drafts.map(reviewDigest),publicExcerpts});
  if (required('confirm')!==confirmation) fail('Review changed. Show a new review card to David.');
  for (const d of drafts) {
    if (!Number.isInteger(d.score)||d.score<1||d.score>10||!['pass','partial','fail'].includes(d.outcome)||!d.rationale?.trim()||!d.notes?.trim()) fail('Each run needs a final score, outcome, rationale and public note');
    if (publicExcerpts && !d.public_excerpts) fail('Contributor did not permit public excerpts');
    if (d.ranking_eligible!==false) fail('Pilot contributions cannot affect rankings');
    d.approval={digest:reviewDigest(d),reviewer:'David Pawlan',at:new Date().toISOString(),publish_excerpts:publicExcerpts};
  }
  write(path.join(dir(),'runs.draft.json'),all);
  console.log(`Approved ${drafts.length} selected drafts. Publish with imessage.mjs approve --slug ${opts.slug} --ids ${opts.ids}${publicExcerpts?' --publish-excerpts':''}, then review the generated site diff before deploying.`);
}
function invite() {
  const token=crypto.randomBytes(32).toString('hex'), expires_at=new Date(Date.now()+14*86400000).toISOString();
  const file=required('out'); write(file,{token,expires_at});
  console.log(`Private invitation file created: ${file}\nSend it only to the intended tester. Do not commit it.\nAdd this public hash entry to CONTRIB_INVITES_JSON on the server:\n${JSON.stringify({hash:digest(token),expires_at})}`);
}
async function purge() {
  const id=required('receipt'); if (!/^[a-f0-9]{64}$/.test(id)) fail('Invalid receipt');
  if (required('confirm')!==id) fail('Confirm the receipt to purge the private payload');
  const redis=redisClient(); await redis(['DEL',payloadKey(id)]); await redis(['SREM',INDEX,id]);
  for (const slug of roster) {
    const folder=path.join(DATA,'agents',slug); fs.rmSync(path.join(folder,'contrib',`${id}.json`),{force:true});
    const f=path.join(folder,'runs.draft.json'), drafts=read(f,[]);
    if (drafts.some(d=>d.contribution?.receipt===id)) write(f,drafts.filter(d=>d.contribution?.receipt!==id));
  }
  console.log('Private payload and staged drafts removed. Review any published evidence separately; public copies may still exist.');
}
const commands={bundle,preview,submit,pull,review,'confirm-review':confirmReview,invite,purge};
try {
  if (!commands[positionals[0]]) console.log('Commands: bundle, preview, submit, pull, review, confirm-review, invite, purge. See docs/contributing/maintainer.md and skills/contribute-runs/SKILL.md.');
  else await commands[positionals[0]]();
} catch(e) { console.error(`error: ${e.message}`); process.exitCode=1; }
