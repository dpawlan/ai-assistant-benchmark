import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createIntake, createReadiness, readBounded } from './lib/contribution-intake.mjs';
import { validateBundle, digest, wire, stageBundle, reviewDigest, checkApproval, isRankingEligible, MAX_BYTES, scrub } from './lib/contribution.mjs';
const ROOT=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const now=Date.parse('2026-09-29T12:00:00Z');
const options={slugs:['instinct'],categories:['memory'],now};
const env={CONTRIB_ENABLED:'true',UPSTASH_REDIS_REST_TOKEN:'test-salt',VERCEL:'1'};
function fixture() { return {
 version:2,id:'12345678-1234-4234-8234-123456789abc',tool_revision:'a'.repeat(40),rubric_version:'0.2',slug:'instinct',
 contributor:{platform:'github',handle:'@tester',disclosure:'I work for a vendor',comped:'One free account'},source:'pasted',timing:'recorded',context:{tier:'paid',timezone:'UTC',integrations:'none'},
 drafts:[{id:'instinct-example',category:'memory',protocol:'observed',date:'2026-09-28',signals:{turns:2,my_messages:1,agent_messages:1,first_reply_s:2,duration_min:1,agent_said_done:false,agent_said_cant:false,agent_asked_question:false,agent_initiated:false},excerpt:[{from:'me',ts:'2026-09-28T12:00:00Z',text:'Please remember my preference.',attachment:false},{from:'agent',ts:'2026-09-28T12:00:02Z',text:'Saved. '+ 'Context '.repeat(28) + 'LAST VISIBLE WORDS',attachment:false}],truncated:false,proposed_score:7,proposed_outcome:'partial',notes:'Remembered a preference.',public_excerpts:false}]
}; }
function request(b=fixture(), ip='192.0.2.1') { return new Request('https://assistantbenchmark.com/api/contribute',{method:'POST',headers:{'x-forwarded-for':ip},body:wire(b)}); }
function temp() { const p=fs.mkdtempSync(path.join(os.tmpdir(),'contrib-test-'));fs.mkdirSync(path.join(p,'data/agents/instinct'),{recursive:true});fs.writeFileSync(path.join(p,'data/index.json'),JSON.stringify({agents:[{slug:'instinct'}]}));fs.writeFileSync(path.join(p,'data/tasks.json'),JSON.stringify({version:'0.2',tasks:[{key:'memory'}]}));fs.writeFileSync(path.join(p,'data/sources.json'),JSON.stringify({agents:{instinct:{}}}));return p; }
function cli(cwd,args,script='contribute.mjs') { return spawnSync(process.execPath,[path.join(ROOT,'scripts',script),...args],{cwd,encoding:'utf8'}); }

test('closed schema rejects hidden payloads, invalid dates and signals',()=>{
 const valid=validateBundle(fixture(),options);assert.equal(valid.drafts.length,1);
 for(const mutate of [b=>b.usage={raw:'secret'}, b=>b.drafts[0].signals.secret='private',b=>b.drafts[0].date='2026-02-30',b=>b.drafts[0].signals.turns=Infinity,b=>b.drafts[0].signals.turns=3,b=>b.drafts[0].excerpt.reverse(),b=>b.drafts.push(b.drafts[0]),b=>b.drafts[0].proposed_score=7.5]) {
  const b=fixture();mutate(b);assert.throws(()=>validateBundle(b,options));
 }
});
test('redaction covers free text without claiming contextual anonymity',()=>{
 const b=fixture();const sensitive='Jane Smith jane@example.com +44 20 7946 0958 4111 1111 1111 1111 https://assistantbenchmark.com/?secret=value';
 b.contributor.disclosure=sensitive;b.context.tier=sensitive;b.drafts[0].notes=sensitive;
 const clean=JSON.stringify(validateBundle(b,options));assert(!clean.includes('example.com'));assert(!clean.includes('4111'));assert(!clean.includes('7946'));assert(!clean.includes('secret=value'));assert(clean.includes('Jane Smith'));
 assert.equal(scrub('Safe ordinary text'),'Safe ordinary text');
});
test('body cap applies without Content-Length',async()=>{
 const req=new Request('https://example.com',{method:'POST',body:'x'.repeat(MAX_BYTES+1)});
 await assert.rejects(readBounded(req),/too large/);
});
test('public intake fails closed on disabled configuration or missing storage',async()=>{
 assert.equal((await createIntake({...options,env:{},now:()=>now})(request())).status,503);
 const down=createIntake({...options,env,now:()=>now,redis:async()=>{throw Error('offline');}});
 assert.equal((await createIntake({...options,env:{CONTRIB_ENABLED:'true'},now:()=>now})(request())).status,503);
 assert.equal((await down(request())).status,503);
});
test('durable success survives notification failure; retry/conflict/rate statuses are explicit',async()=>{
 let count=0;let payload;
 const redis=async command=>{assert.equal(command[0],'EVAL');assert.equal(command[2],'4');payload=JSON.parse(command[8]);count++;return count===1?'stored':'duplicate';};
 const route=createIntake({...options,env,redis,now:()=>now,notify:async()=>{throw Error('email down');}});
 const first=await route(request());assert.equal(first.status,201);const receipt=await first.json();assert.equal(receipt.notification,'failed');assert.equal(payload.bundle.contributor.platform,'github');
 const second=await route(request());assert.equal(second.status,200);assert.equal((await second.json()).id,receipt.id);
 for(const [status,code] of [['conflict',409],['limited',429],['unexpected',503]]) assert.equal((await createIntake({...options,env,now:()=>now,redis:async()=>status})(request())).status,code);
});
test('staging is idempotent, preserves disclosure, namespaces collisions, never enables ranking',()=>{
 const b=fixture();const one=stageBundle(b,'a'.repeat(64),[],[]);const again=stageBundle(b,'a'.repeat(64),one,[]);const two=stageBundle(b,'b'.repeat(64),again,[]);
 assert.equal(again.length,1);assert.equal(two.length,2);assert.notEqual(two[0].id,two[1].id);assert.equal(two[0].score,null);assert.equal(two[0].contribution.contributor.disclosure,b.contributor.disclosure);
 assert(!isRankingEligible(two[0]));assert(!isRankingEligible({tester:'@legacy'}));assert(isRankingEligible({id:'first-party'}));
});
test('approval binds content, excerpt consent and ranking exclusion',()=>{
 const d=stageBundle(fixture(),'a'.repeat(64),[],[])[0];d.score=7;d.outcome='partial';d.rationale='Supported by the excerpt';assert.throws(()=>checkApproval(d,false));
 d.approval={digest:reviewDigest(d),reviewer:'David Pawlan',publish_excerpts:false};checkApproval(d,false);assert.throws(()=>checkApproval(d,true));
 d.notes='Changed after approval';assert.throws(()=>checkApproval(d,false));
});
test('CLI preview shows full payload and refuses edited content before sending',()=>{
 const cwd=temp();try{
  fs.writeFileSync(path.join(cwd,'bundle.json'),wire(fixture()));
  const preview=cli(cwd,['preview','--file','bundle.json']);assert.equal(preview.status,0,preview.stderr);assert(preview.stdout.includes('LAST VISIBLE WORDS'));assert(preview.stdout.includes('first_reply_s'));assert(preview.stdout.includes('One free account'));
  const confirmation=JSON.parse(fs.readFileSync(path.join(cwd,'bundle.json.preview.json'))).confirmation;
  const changed=fixture();changed.drafts[0].notes='Different';fs.writeFileSync(path.join(cwd,'bundle.json'),wire(changed));
  const submit=cli(cwd,['submit','--file','bundle.json','--confirm',confirmation]);assert.equal(submit.status,1);assert.match(submit.stderr,/changed/);
 }finally{fs.rmSync(cwd,{recursive:true,force:true});}
});
test('actual publisher requires selected approved IDs and preserves attribution without ranking eligibility',()=>{
 const cwd=temp();try{
  const folder=path.join(cwd,'data/agents/instinct');let drafts=stageBundle(fixture(),'a'.repeat(64),[],[]);drafts=stageBundle(fixture(),'b'.repeat(64),drafts,[]);
  for(const d of drafts){d.score=7;d.outcome='partial';d.rationale='Evidence supports partial completion';}
  const save=()=>fs.writeFileSync(path.join(folder,'runs.draft.json'),wire(drafts));save();
  let result=cli(cwd,['approve','--slug','instinct'],'imessage.mjs');assert.notEqual(result.status,0);assert(!fs.existsSync(path.join(folder,'runs.json')));
  result=cli(cwd,['approve','--slug','instinct','--ids',drafts[0].id],'imessage.mjs');assert.notEqual(result.status,0);
  drafts[0].approval={digest:reviewDigest(drafts[0]),reviewer:'David Pawlan',at:'2026-09-29T00:00:00Z',publish_excerpts:false};save();
  result=cli(cwd,['approve','--slug','instinct','--ids',drafts[0].id],'imessage.mjs');assert.equal(result.status,0,result.stdout+result.stderr);
  const published=JSON.parse(fs.readFileSync(path.join(folder,'runs.json')));assert.equal(published.length,1);assert.equal(published[0].contribution.contributor.platform,'github');assert(!isRankingEligible(published[0]));
  const evidence=JSON.parse(fs.readFileSync(path.join(folder,'evidence',`${drafts[0].id}.json`)));assert(!evidence.excerpt);assert.equal(evidence.contribution.contributor.comped,'One free account');assert.equal(JSON.parse(fs.readFileSync(path.join(folder,'runs.draft.json'))).length,1);
 }finally{fs.rmSync(cwd,{recursive:true,force:true});}
});
test('installer uses supported paths without overwriting an existing skill',()=>{
 const cwd=fs.mkdtempSync(path.join(os.tmpdir(),'contrib-install-'));try{
  for(const agent of ['codex','claude']){
   const skills=path.join(cwd,agent);const result=cli(ROOT,['--agent',agent,'--skills-dir',skills],'install-contribute.mjs');assert.equal(result.status,0,result.stderr);
   const installed=fs.readFileSync(path.join(skills,'contribute-runs/SKILL.md'),'utf8');assert(installed.includes(ROOT));assert(!installed.includes('TOOL_CHECKOUT_PATH'));
   assert.equal(cli(ROOT,['--agent',agent,'--skills-dir',skills],'install-contribute.mjs').status,1);
  }
 }finally{fs.rmSync(cwd,{recursive:true,force:true});}
});

test('Messages discovery keeps personal threads out of output and export honors date bounds',async()=>{
 const { DatabaseSync }=await import('node:sqlite');
 const cwd=temp();try{
  const file=path.join(cwd,'chat.db');const db=new DatabaseSync(file);
  db.exec(`CREATE TABLE chat(chat_identifier TEXT,service_name TEXT); CREATE TABLE handle(id TEXT); CREATE TABLE chat_handle_join(chat_id INTEGER,handle_id INTEGER); CREATE TABLE chat_message_join(chat_id INTEGER,message_id INTEGER); CREATE TABLE message(date INTEGER,is_from_me INTEGER,text TEXT,attributedBody BLOB,cache_has_attachments INTEGER,item_type INTEGER,associated_message_type INTEGER);`);
  db.exec(`INSERT INTO chat VALUES('assistant','iMessage'),('private','iMessage'); INSERT INTO handle VALUES('+12025550123'),('+12025550999'); INSERT INTO chat_handle_join VALUES(1,1),(2,2);`);
  for(const chat of [1,2]) for(const day of [26,27,28]) {
   const ms=Date.parse(`2026-09-${day}T12:00:00Z`);
   const result=db.prepare('INSERT INTO message VALUES(?,?,?,?,?,?,?)').run(BigInt(ms-978307200000)*1000000n,0,chat===1?'Remember my preference.':'UNRELATED PERSONAL SECRET',null,0,0,0);
   db.prepare('INSERT INTO chat_message_join VALUES(?,?)').run(chat,result.lastInsertRowid);
  }
  db.close();
  fs.writeFileSync(path.join(cwd,'data/sources.json'),JSON.stringify({agents:{instinct:{imessage_handles:['+12025550123']}}}));
  let result=cli(cwd,['discover','--assistants-only','--db',file,'--since','2026-09-01'],'imessage.mjs');
  assert.equal(result.status,0,result.stderr);assert(result.stdout.includes('instinct'));assert(!result.stdout.includes('UNRELATED'));assert(!result.stdout.includes('50999'));assert(!result.stdout.includes('Remember my preference'));
  result=cli(cwd,['export','--slug','instinct','--db',file,'--since','2026-09-27','--until','2026-09-27'],'imessage.mjs');assert.equal(result.status,0,result.stderr);
  const transcript=JSON.parse(fs.readFileSync(path.join(cwd,'data/agents/instinct/transcripts/messages.json')));assert.equal(transcript.messages.length,1);assert.equal(transcript.messages[0].ts.slice(0,10),'2026-09-27');assert(!JSON.stringify(transcript).includes('UNRELATED'));
 }finally{fs.rmSync(cwd,{recursive:true,force:true});}
});

test('unavailable and partially missing times never become measured durations', async()=>{
 const {parseText}=await import('./imessage.mjs');
 assert.equal(parseText('Me: remember tea\n09:02 Agent: saved',{agentName:'Agent',date:'2026-09-28'}).timed,false);
 const b=fixture();b.timing='unavailable';assert.throws(()=>validateBundle(b,options));
 b.drafts[0].signals.first_reply_s=null;b.drafts[0].signals.duration_min=0;
 const clean=validateBundle(b,options);assert.equal(stageBundle(clean,'receipt',[],[])[0].contribution.timing,'unavailable');
 const cwd=temp();try{fs.writeFileSync(path.join(cwd,'bundle.json'),wire(clean));const p=cli(cwd,['preview','--file','bundle.json']);assert.equal(p.status,0,p.stderr);assert(p.stdout.includes('not measured times'));}finally{fs.rmSync(cwd,{recursive:true,force:true});}
});

test('readiness only reports accepting with enabled healthy storage',async()=>{
 assert.equal((await createReadiness({env:{}})()).status,503);
 assert.equal((await createReadiness({env,redis:async()=>{throw Error();}})()).status,503);
 const r=await createReadiness({env,redis:async()=> 'PONG'})();assert.equal(r.status,200);assert.equal((await r.json()).invitation_required,false);
});

test('real Redis atomic receipt, retry, conflict, TTL and both rate limits', {skip:process.env.CONTRIB_REDIS_TEST!=='true'}, async()=>{
 const {redisClient,persist,payloadKey}=await import('./lib/contribution-store.mjs');
 const redis=redisClient();const prefix=`contributions:smoke:${crypto.randomUUID()}:`;const keys=new Set();
 const isolated=async command=>{
  const copy=[...command];for(let i=3;i<7;i++){copy[i]=copy[i].replace('contributions:v2:',prefix);keys.add(copy[i]);}
  return redis(copy);
 };
 const b=fixture();const at=Date.now();const hash=digest(wire(b));
 try {
  const results=await Promise.all([persist(b,hash,'network-a',isolated,at),persist(b,hash,'network-a',isolated,at)]);
  assert.deepEqual(results.map(r=>r.status).sort(),['duplicate','stored']);
  assert.equal((await persist(b,hash,'network-b',isolated,at)).status,'duplicate');
  assert.equal((await persist(b,'changed','network-a',isolated,at)).status,'conflict');
  const ttl=await redis(['TTL',payloadKey(results[0].id).replace('contributions:v2:',prefix)]);assert(ttl>7775900 && ttl<=7776000);
  for(let i=0;i<5;i++)assert.equal((await persist({...b,id:crypto.randomUUID()},hash,'network-a',isolated,at)).status,'stored');
  assert.equal((await persist({...b,id:crypto.randomUUID()},hash,'network-a',isolated,at)).status,'limited');
  const daily=`${prefix}daily:${Math.floor(at/86400000)}`;await redis(['SET',daily,'100','EX','60']);
  assert.equal((await persist({...b,id:crypto.randomUUID()},hash,'network-c',isolated,at)).status,'limited');
 } finally { if(keys.size)await redis(['DEL',...keys]); }
});
