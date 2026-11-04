// Dijalankan sebelum build: data tidak valid atau gambar hilang → build gagal.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validasiProyek, validasiProfil, semuaGambar } from '../src/data/skema.js';

const akar = join(dirname(fileURLToPath(import.meta.url)), '..');
const baca = (p) => JSON.parse(readFileSync(join(akar, p), 'utf8'));

try {
  const proyek = validasiProyek(baca('src/data/proyek.json'));
  const profil = validasiProfil(baca('src/data/profil.json'));
  const hilang = semuaGambar(proyek, profil).filter((src) => !existsSync(join(akar, 'public', src)));
  if (hilang.length > 0) {
    throw new Error('Gambar tidak ada di public/:\n- ' + hilang.join('\n- '));
  }
  console.log(`Data valid: ${proyek.length} proyek (${proyek.map((p) => p.id).join(', ')}).`);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
