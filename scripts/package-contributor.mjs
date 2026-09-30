#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {toolRevision} from './tool-version.mjs';

const root=process.cwd(), output=process.argv[2];
if(!output) throw new Error('Usage: node scripts/package-contributor.mjs /absolute/output.zip');
if(!path.isAbsolute(output) || fs.existsSync(output)) throw new Error('Choose a new absolute output path');
const staging=fs.mkdtempSync(path.join(os.tmpdir(),'benchmark-package-'));
const name='assistant-benchmark-contributor', dir=path.join(staging,name);
const files={};
function write(name,content){const dest=path.join(dir,name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,content);files[name]=createHash('sha256').update(content).digest('hex');}
try {
 // Explicit allowlist: never copy the repo, environment files, local mappings, conversations or reviews.
 for(const name of ['scripts/install-contribute.mjs','scripts/contribute.mjs','scripts/imessage.mjs','scripts/lint-notes.mjs','scripts/tool-version.mjs','scripts/lib/contribution.mjs','scripts/lib/contribution-store.mjs','skills/contribute-runs/SKILL.md','data/tasks.json']) write(name,fs.readFileSync(path.join(root,name)));
 const agents=JSON.parse(fs.readFileSync(path.join(root,'data/index.json'))).agents.map(({slug,name})=>({slug,name}));
 write('data/index.json',JSON.stringify({agents},null,2)+'\n');
 write('data/sources.json',JSON.stringify({_redact_terms:[],agents:Object.fromEntries(agents.map(a=>[a.slug,{name:a.name,imessage_handles:[]}]))},null,2)+'\n');
 write('START-HERE.txt','Assistant Benchmark contributor tools\n\nRequires Node 22.13+, no Git or GitHub access. In this extracted folder run:\n\nCodex: node scripts/install-contribute.mjs --agent codex\nClaude Code: node scripts/install-contribute.mjs --agent claude\n\nOpen a new local agent session in this folder and ask to use contribute-runs.\nNo invitation required. Nothing is sent before you approve the complete preview.\nFor Messages, identify the assistant number when asked; personal mappings stay local.\n');
 fs.writeFileSync(path.join(dir,'contributor-release.json'),JSON.stringify({format:1,source_revision:toolRevision(root),files},null,2)+'\n');
 fs.mkdirSync(path.dirname(output),{recursive:true});execFileSync('/usr/bin/zip',['-qr',output,name],{cwd:staging});
 console.log(JSON.stringify({archive:output,bytes:fs.statSync(output).size,sha256:createHash('sha256').update(fs.readFileSync(output)).digest('hex'),files:Object.keys(files).length+1},null,2));
}finally{fs.rmSync(staging,{recursive:true,force:true});}
