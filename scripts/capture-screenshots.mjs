// Run: node scripts/capture-screenshots.mjs
import puppeteer from 'puppeteer';

const projects = [
  { name: 'nextvendors', url: 'https://next-vendors.vercel.app' },
  { name: 'heiconv', url: 'https://heiconverts.vercel.app' },
  { name: 'kayany7', url: 'https://kayany7.vercel.app' },
  { name: 'aibridge', url: 'https://ai-bridge-ten.vercel.app' },
];

const outputDir = 'public/images/projects';
const widths = [1440, 390]; // desktop + mobile

async function capture() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  console.log('🚀 Browser launched\n');

  for (const project of projects) {
    console.log(`📸 ${project.name} — ${project.url}`);
    const page = await browser.newPage();

    for (const width of widths) {
      await page.setViewport({ width, height: 900 });
      await page.goto(project.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000)); // wait for animations

      const ext = width === 1440 ? 'desktop' : 'mobile';
      const path = `${outputDir}/${project.name}-${ext}.png`;
      await page.screenshot({ path, fullPage: true });
      console.log(`   ✅ ${ext} (${width}px) saved`);
    }

    await page.close();
  }

  await browser.close();
  console.log('\n🎉 All screenshots captured!');
}

capture().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
