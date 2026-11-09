// Membuat gambar pratinjau tautan (1200×630) untuk setiap halaman ke public/og/.
// Dijalankan manual saat judul berubah: npm run og-image (butuh Playwright + Chromium:
// npm i -D playwright && npx playwright install chromium). Hasilnya di-commit, jadi
// build di Vercel tidak butuh browser.
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validasiProyek, validasiProfil } from '../src/data/skema.js';
import { pecahJudul } from '../src/data/bantu.js';

const akar = join(dirname(fileURLToPath(import.meta.url)), '..');
const baca = (p) => JSON.parse(readFileSync(join(akar, p), 'utf8'));
// Huruf disematkan sebagai data URI: halaman dari setContent (about:blank) tidak boleh memuat file://.
const huruf = (paket, file) =>
  'data:font/woff2;base64,' + readFileSync(join(akar, 'node_modules/@fontsource-variable', paket, 'files', file)).toString('base64');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Playwright belum terpasang. Jalankan: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const proyek = validasiProyek(baca('src/data/proyek.json'));
const profil = validasiProfil(baca('src/data/profil.json'));

function html({ label, judul, sorot, bawah }) {
  const [a, s, z] = pecahJudul(judul, sorot);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Judul;src:url(${huruf('bricolage-grotesque', 'bricolage-grotesque-latin-wght-normal.woff2')});font-weight:200 800}
@font-face{font-family:Isi;src:url(${huruf('plus-jakarta-sans', 'plus-jakarta-sans-latin-wght-normal.woff2')});font-weight:200 800}
body{margin:0}
.k{width:1200px;height:630px;box-sizing:border-box;padding:72px 80px;background:#FAFAF7;color:#1A1F2B;display:flex;flex-direction:column;justify-content:space-between;font-family:Isi;border-bottom:18px solid #1A1F2B}
.l{font-family:ui-monospace,Menlo,monospace;font-size:24px;letter-spacing:.05em;color:#4B5363}
h1{margin:0;font-family:Judul;font-weight:700;font-size:76px;line-height:1.06;letter-spacing:-.02em;max-width:1000px}
.s{white-space:nowrap;background:#FFE066;padding:0 8px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.b{display:flex;justify-content:space-between;align-items:center;font-size:28px;font-weight:600}
.w{font-size:24px;font-weight:500;color:#4B5363}
</style></head><body><div class="k">
<div class="l">${esc(label)}</div>
<h1>${esc(a)}${s ? `<span class="s">${esc(s)}</span>` : ''}${esc(z)}</h1>
<div class="b"><span>${esc(profil.nama)}</span><span class="w">${esc(bawah)}</span></div>
</div></body></html>`;
}

const halaman = [
  { file: 'beranda', label: `DEVELOPER WEB · ${profil.kota.toUpperCase()}`, judul: 'Sistem web yang dibuat dari cara kerja bisnis Anda', sorot: 'cara kerja bisnis Anda', bawah: 'Coba demonya langsung' },
  ...proyek.map((p) => ({ file: p.id, label: `STUDI KASUS · ${p.nama.toUpperCase()}`, judul: p.judul, sorot: p.judulSorot, bawah: 'Demo bisa langsung dicoba' })),
];

const keluar = join(akar, 'public/og');
mkdirSync(keluar, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const h of halaman) {
    await page.setContent(html(h), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(keluar, `${h.file}.png`) });
    console.log(`public/og/${h.file}.png`);
  }
} finally {
  await browser.close();
}
