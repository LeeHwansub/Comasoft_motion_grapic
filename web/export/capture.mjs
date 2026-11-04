// 프레임 단위 캡처 → ffmpeg 로 MP4(H.264) / WebM(VP9) 생성
// 사용: node capture.mjs [--page=v5] [--theme=dark] [--fps=30] [--still=0.5,1.5]
//   --page=v4|v5 : 캡처 대상 (기본 v4 = web/index.html, v5 = web/v5/index.html)
//   --still : 지정 시점만 PNG 로 저장 (검증용)
import puppeteer from 'puppeteer-core';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, v = 'true'] = a.replace(/^--/, '').split('=');
  return [k, v];
}));
const theme = args.theme === 'dark' ? 'dark' : 'light';
const pageId = args.page === 'v5' ? 'v5' : 'v4';
const fps = Math.max(1, parseInt(args.fps ?? '30', 10));
const DURATION = 5;
const CHROME = process.env.CHROME_PATH
  ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const outDir = join(here, 'out');
mkdirSync(outDir, { recursive: true });

const entry = pageId === 'v5' ? join(here, '..', 'v5', 'index.html') : join(here, '..', 'index.html');
const url = pathToFileURL(entry);
url.search = `?t=0&theme=${theme}`;
const outBase = pageId === 'v5' ? `comasoft-intro-v5-${theme}` : `comasoft-intro-${theme}`;
const stillPrefix = pageId === 'v5' ? `still-v5-${theme}` : `still-${theme}`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto(url.href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.__ready);

  const shot = async (t, path) => {
    await page.evaluate(t => window.renderAt(t), t);
    await page.screenshot({ path, type: 'png' });
  };

  if (args.still) {
    const times = args.still === 'true' ? [0.5, 1.5, 2.6, 3.6, 4.9] : args.still.split(',').map(Number);
    for (const t of times) await shot(t, join(outDir, `${stillPrefix}-${t.toFixed(2)}.png`));
    console.log(`stills → ${outDir}`);
  } else {
    const frames = mkdtempSync(join(tmpdir(), 'comasoft-frames-'));
    try {
      const total = Math.round(DURATION * fps);
      for (let i = 0; i < total; i++) await shot(i / fps, join(frames, `f_${String(i).padStart(4, '0')}.png`));
      const input = ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', join(frames, 'f_%04d.png')];
      const base = join(outDir, outBase);
      execFileSync('ffmpeg', [...input, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-movflags', '+faststart', `${base}.mp4`], { stdio: 'inherit' });
      if (args.webm !== 'false') {
        execFileSync('ffmpeg', [...input, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-crf', '24', '-b:v', '0', `${base}.webm`], { stdio: 'inherit' });
        console.log(`${total} frames → ${base}.mp4 / .webm`);
      } else {
        console.log(`${total} frames → ${base}.mp4`);
      }
    } finally {
      rmSync(frames, { recursive: true, force: true });
    }
  }
} finally {
  await browser.close();
}
