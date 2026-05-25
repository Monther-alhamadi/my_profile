// Run: node scripts/generate-placeholders.mjs
import puppeteer from 'puppeteer';

const placeholders = [
  {
    name: 'cachear',
    title: 'Cachear Enterprise POS',
    subtitle: 'Flutter • Offline-First • Enterprise',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #1a2a4a 50%, #0d1b2a 100%)',
    accent: '#34d399'
  },
  {
    name: 'unischeduler',
    title: 'University Scheduling Engine',
    subtitle: 'AI • Genetic Algorithms • TypeScript',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #2a1a3a 50%, #0d1b2a 100%)',
    accent: '#a78bfa'
  },
];

const html = (p) => `<!DOCTYPE html><html lang="en"><head><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1440px; height:900px; display:flex; align-items:center; justify-content:center;
  font-family:'Syne','Segoe UI',sans-serif; background:${p.gradient}; overflow:hidden; }
.container { text-align:center; padding:60px; }
.icon { font-size:80px; margin-bottom:30px; opacity:0.9; }
h1 { font-size:52px; font-weight:800; color:#f5f0eb; letter-spacing:-0.02em; margin-bottom:12px; line-height:1.1; }
p { font-size:22px; color:rgba(245,240,235,0.5); font-family:'DM Sans',sans-serif; }
.badge { display:inline-block; margin-top:40px; padding:10px 28px; border-radius:4px;
  font-size:14px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
  background:${p.accent}20; color:${p.accent}; border:1px solid ${p.accent}30; }
.accent-line { width:80px; height:3px; background:${p.accent}; margin:24px auto; border-radius:2px; }
.grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:50px; opacity:0.3; }
.cell { height:120px; border-radius:8px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); }
</style></head><body>
<div class="container">
  <div class="icon">${p.name === 'cachear' ? '🏪' : '🎓'}</div>
  <div class="accent-line"></div>
  <h1>${p.title}</h1>
  <p>${p.subtitle}</p>
  <div class="badge">Coming Soon</div>
  <div class="grid"><div class="cell"></div><div class="cell"></div><div class="cell"></div></div>
</div></body></html>`;

async function generate() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  console.log('🚀 Generating placeholders...\n');

  for (const p of placeholders) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.setContent(html(p), { waitUntil: 'networkidle0' });
    await page.screenshot({ path: `public/images/projects/${p.name}-desktop.png`, fullPage: false });
    console.log(`   ✅ ${p.name}-desktop.png`);

    await page.setViewport({ width: 390, height: 844 });
    await page.screenshot({ path: `public/images/projects/${p.name}-mobile.png`, fullPage: false });
    console.log(`   ✅ ${p.name}-mobile.png`);
    await page.close();
  }

  await browser.close();
  console.log('\n🎉 Placeholders generated!');
}

generate().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
