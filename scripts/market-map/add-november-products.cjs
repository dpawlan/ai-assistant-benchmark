/** Compose verified logo assets onto the existing map; never redraw brand artwork. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../..');
const base = path.join(root, 'public/images/articles/ai-agent-market-map-29b10e6d82.png');
const additions = JSON.parse(fs.readFileSync(path.join(root, 'data/research/market-map-additions-2026-11-25.json')));
const W = 4000, H = 3972;
const bg = '#f4f0e6', panel = '#fbfaf6', border = '#d9d2c4';
const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const svg = content => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${content}</svg>`);
const card = (x,y,w,h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="27" fill="${panel}" stroke="${border}" stroke-width="2"/>`;
const layout = {
 'Consumer personal assistants': {existing:54,x:172,y:520,cols:16,dx:238,dy:140,countX:3887,countY:498},
 'Work & productivity': {existing:52,x:172,y:2260,cols:16,dx:238,dy:140,countX:3887,countY:2238},
 'Agent infrastructure': {existing:90,x:172,y:2928,cols:16,dx:238,dy:140,extraFirst:22,countX:3887,countY:2904},
 'Shopping & commerce': {existing:4,x:145,y:1186,cols:5,dx:180,dy:140,countX:990,countY:1162},
 'Finance & money': {existing:11,x:2075,y:1186,cols:5,dx:180,dy:140,countX:2920,countY:1162},
 'Email & calendar': {existing:6,x:3040,y:1186,cols:5,dx:180,dy:140,countX:3887,countY:1162},
 'Multiplayer & group chat': {existing:5,x:145,y:1712,cols:5,dx:180,dy:140,countX:990,countY:1688},
 'Open source & self-hosted': {existing:7,x:3040,y:1712,cols:5,dx:180,dy:140,countX:3887,countY:1688},
};
(async()=>{
 const extended = await sharp(base).extend({bottom:140,background:bg}).png().toBuffer();
 const panels = svg(card(80,1116,945,365)+card(80,1642,945,365)+card(80,2858,3840,1090));
 const composites = [{input:panels}];
 // Keep original labels and every existing logo pixel-for-pixel, omitting old bottom borders.
 for(const [left,top,width,height] of [[82,1118,941,203],[82,1644,941,203],[82,2860,3836,928]]){
  composites.push({input:await sharp(base).extract({left,top,width,height}).png().toBuffer(),left,top});
 }
 let marks='';
 for(const [category,l] of Object.entries(layout)){
  const group=additions.filter(a=>a.category===category);
  marks+=`<rect x="${l.countX-52}" y="${l.countY-27}" width="58" height="33" fill="${panel}"/><text x="${l.countX}" y="${l.countY}" text-anchor="end" font-family="Arial" font-size="22" font-weight="600" fill="#767165">${l.existing+group.length}</text>`;
  for(let j=0;j<group.length;j++){
   const a=group[j], n=l.existing+j, row=Math.floor(n/l.cols),x=l.x+(n%l.cols)*l.dx,y=l.y+row*l.dy+(row>0?(l.extraFirst||0):0);
   marks+=`<rect x="${x}" y="${y}" width="94" height="94" rx="18" fill="white" stroke="${border}" stroke-width="2"/>`;
   const name=a.id==='minds'?'Minds':a.name;
   marks+=`<text x="${x+47}" y="${y+128}" text-anchor="middle" font-family="Arial" font-size="20" font-weight="500" fill="#25241f">${escape(name)}</text>`;
   const logo=await sharp(path.join(root,'public/logos',a.id+'.png')).resize(82,82).png().toBuffer();
   composites.push({input:logo,left:x+6,top:y+6});
  }
 }
 // Frames behind logo images, text outside them.
 composites.splice(4,0,{input:svg(marks)});
 const out=await sharp(extended).composite(composites).png().toBuffer();
 const name='ai-agent-market-map-'+crypto.createHash('sha256').update(out).digest('hex').slice(0,10)+'.png';
 fs.writeFileSync(path.join(root,'public/images/articles',name),out);
 fs.writeFileSync('/tmp/updated-market-map-name',name);
 console.log(name);
})();
