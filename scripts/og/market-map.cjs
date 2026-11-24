const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(root, 'public/images/articles/ai-agent-market-map-799e1ebe7a.png')).toString('base64');
// Original map tile coordinates; artwork is copied without redrawing.
const icons = [
 ['Claude Duet',410,275],['Dots',172,275],['Grok Bot',1362,2260],['Muse',886,275],
 ['Instinct',410,520],['Hermes Agent',3400,1712],['Hark',172,520],['Zapia',886,520],
 ['Tomo',648,520],['Pally',1124,520],['Dazzle',1600,520],['Town',1600,2260],
 ['Fo',1362,520],['Tab',2314,520],['Poke',3742,520],['OpenClaw',3040,1712],
];
const tiles = icons.map(([name,x,y])=>`<div class="tile"><svg aria-label="${name}" viewBox="${x+3} ${y+3} 88 88"><image href="data:image/png;base64,${source}" width="4000" height="3832" /></svg></div>`).join('');
const html = `<html><head><style>*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#f3efe5;color:#151410;font-family:Georgia,serif}.copy{position:absolute;left:44px;top:0;width:584px;height:630px;display:flex;flex-direction:column;justify-content:center;gap:22px}.brand{font:500 23px Arial,sans-serif;letter-spacing:4px}h1{margin:0;font-size:86px;font-weight:700;line-height:1.02;letter-spacing:-4px}.grid{position:absolute;left:660px;top:63px;width:504px;display:grid;grid-template-columns:repeat(4,117px);gap:12px}.tile{width:117px;height:117px;border:1px solid #c7bdab;border-radius:21px;background:#fff;display:flex;align-items:center;justify-content:center}svg{display:block;width:88px;height:88px;border-radius:13px;overflow:hidden}</style></head><body><div class="copy"><div class="brand">ASSISTANT BENCHMARK</div><h1>The AI Agent<br>Market Map</h1></div><div class="grid">${tiles}</div></body></html>`;
(async()=>{const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});await page.setContent(html);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(root,'public/og/articles/the-ai-agent-market-map.png')});await browser.close();})();
