#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';

const { values } = parseArgs({ options: { agent: {type:'string'}, 'skills-dir': {type:'string'} } });
try {
  const [major,minor]=process.versions.node.split('.').map(Number);
  if (major<22 || (major===22 && minor<13)) throw new Error('Node 22.13 or newer is required');
  if (!['codex','claude'].includes(values.agent)) throw new Error('Use --agent codex or --agent claude');
  const root=process.cwd();
  const revision=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  const source=fs.readFileSync(path.join(root,'skills/contribute-runs/SKILL.md'),'utf8');
  const parent=values['skills-dir']??path.join(os.homedir(),values.agent==='codex'?'.agents':'.claude','skills');
  const destination=path.join(parent,'contribute-runs');
  if (fs.existsSync(destination)) throw new Error(`Already installed at ${destination}. Review/remove that skill folder before replacing it.`);
  fs.mkdirSync(destination,{recursive:true});
  fs.writeFileSync(path.join(destination,'SKILL.md'),source.replace('TOOL_CHECKOUT_PATH',root).replace('TOOL_CHECKOUT_REVISION',revision));
  console.log(`Installed contribute-runs for ${values.agent} at ${destination}\nTool checkout: ${root}\nRevision: ${revision}\nOpen a new agent session in this checkout. Ask: Use contribute-runs and first check intake readiness.\nNo invitation is required. The skill checks live intake readiness before accessing conversations.\nNo conversations read or sent.`);
} catch(e) { console.error(`error: ${e.message}`); process.exitCode=1; }
