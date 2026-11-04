// Dijalankan setelah `vite build`.
// WhatsApp, Facebook, dan LinkedIn tidak menjalankan JavaScript, jadi judul dan gambar
// pratinjau tautan harus sudah ada di HTML. Skrip ini menulis satu index.html per halaman
// (dist/index.html, dist/proyek/<id>/index.html) dengan tag Open Graph masing-masing.
// Isi halaman tetap dirender React di browser.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validasiProyek } from '../src/data/skema.js';
import { META_BERANDA } from '../src/data/meta.js';

const akar = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(akar, 'dist');
const PENANDA = '<!--META-->';

// Alamat situs untuk og:image (harus absolut). Vercel mengisi VERCEL_PROJECT_PRODUCTION_URL saat build.
function alamatSitus() {
  const dariEnv = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || '';
  if (!dariEnv) return null;
  const url = dariEnv.startsWith('http') ? dariEnv : `https://${dariEnv}`;
  return url.replace(/\/+$/, '');
}

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function tagMeta({ judul, deskripsi, path, gambar }, situs) {
  const abs = (p) => (situs ? situs + p : p);
  return [
    `<title>${escape(judul)}</title>`,
    `<meta name="description" content="${escape(deskripsi)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${escape(judul)}">`,
    `<meta property="og:description" content="${escape(deskripsi)}">`,
    `<meta property="og:url" content="${escape(abs(path))}">`,
    `<meta property="og:image" content="${escape(abs(gambar))}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:locale" content="id_ID">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    situs ? `<link rel="canonical" href="${escape(abs(path))}">` : '',
  ]
    .filter(Boolean)
    .join('\n    ');
}

try {
  const pathIndex = join(dist, 'index.html');
  if (!existsSync(pathIndex)) throw new Error('dist/index.html tidak ada. Jalankan vite build dulu.');
  const template = readFileSync(pathIndex, 'utf8');
  if (!template.includes(PENANDA)) throw new Error(`Penanda ${PENANDA} tidak ada di index.html.`);

  const situs = alamatSitus();
  if (!situs) {
    console.warn('PERINGATAN: SITE_URL belum diisi. og:image ditulis relatif; pratinjau WhatsApp butuh alamat absolut.');
  }

  const proyek = validasiProyek(JSON.parse(readFileSync(join(akar, 'src/data/proyek.json'), 'utf8')));
  const halaman = [
    { ...META_BERANDA, path: '/', gambar: '/og/beranda.png', keluaran: pathIndex },
    ...proyek.map((p) => ({
      judul: p.og.judul,
      deskripsi: p.og.deskripsi,
      path: `/proyek/${p.id}`,
      gambar: `/og/${p.id}.png`,
      keluaran: join(dist, 'proyek', p.id, 'index.html'),
    })),
  ];

  for (const h of halaman) {
    if (!existsSync(join(dist, h.gambar))) {
      throw new Error(`Gambar pratinjau ${h.gambar} tidak ada. Jalankan npm run og-image.`);
    }
    mkdirSync(dirname(h.keluaran), { recursive: true });
    writeFileSync(h.keluaran, template.replace(PENANDA, tagMeta(h, situs)));
  }
  console.log(`Halaman statis: ${halaman.map((h) => h.path).join(', ')}${situs ? ` (situs ${situs})` : ''}`);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
