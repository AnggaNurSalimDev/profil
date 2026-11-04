# Web profil Angga Nur Salim

**Situs:** https://profil-wheat.vercel.app

Satu tautan untuk semua portofolio: profil singkat, kartu proyek, halaman studi kasus per proyek, dan tombol WhatsApp.
Web statis (React + Vite), tanpa server dan tanpa memanggil API.

```
src/data/proyek.json ─┐
src/data/profil.json ─┼─ cek-data (zod + invariant) ── gagal → build berhenti
                      │
                      ├─▶ vite build ──▶ dist/index.html (React)
                      │
                      └─▶ halaman-statis ──▶ dist/index.html
                                             dist/proyek/<id>/index.html   ← tag Open Graph per halaman
                                             (pratinjau WhatsApp tidak menjalankan JavaScript)
```

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 24 test: skema, invariant, tautan WhatsApp, sorotan judul
npm run build      # cek data → build → halaman statis
```

## Menambah proyek

1. Taruh gambar di `public/proyek/<id>/` (WebP, < 200 KB).
2. Tambah satu entri di `src/data/proyek.json` (contoh: entri `kasir`).
3. Jalankan `npm run og-image` untuk membuat gambar pratinjau tautan (butuh Playwright: `npm i -D playwright && npx playwright install chromium`).
4. `npm test && npm run build`. Halaman `/proyek/<id>` dan kartunya muncul sendiri.

Aturan yang dicek (build gagal jika dilanggar): `id` unik dan huruf kecil/angka/tanda hubung, `urutan` unik,
`masalah`/`solusi` 1–200 karakter, URL demo dan repo `https://`, `keputusan` 1–5, `judulSorot` harus bagian dari `judul`,
setiap gambar ada di `public/` dan punya `alt`, field asing ditolak, nomor WhatsApp format `62…`.

## Deploy ke Vercel

1. Buat repo GitHub baru (misalnya `profil`), push folder ini.
2. vercel.com → **Add New → Project** → pilih repo. Framework terbaca Vite; `vercel.json` sudah mengatur build.
3. Deploy. Alamat situs untuk gambar pratinjau diambil otomatis dari `VERCEL_PROJECT_PRODUCTION_URL`.
   Kalau memakai domain sendiri, isi Environment Variable `SITE_URL` (contoh `https://angganursalim.my.id`) lalu Redeploy.
4. Uji: tempel alamatnya di chat WhatsApp → harus muncul gambar dan judul.

## Struktur

```
public/            favicon, gambar proyek, foto, og/ (gambar pratinjau 1200×630)
scripts/           cek-data, halaman-statis, buat-og-image
src/data/          proyek.json, profil.json, skema.js (zod), bantu.js (fungsi murni), meta.js
src/komponen/      umum.jsx: kepala, kaki, tombol WhatsApp, judul bersorot
src/halaman/       Beranda, StudiKasus, TidakDitemukan
```

Catatan: zod hanya dipakai saat build dan test, tidak ikut ke browser. Isi halaman dirender di browser;
tag pratinjau tautan sudah ada di HTML untuk setiap halaman.
