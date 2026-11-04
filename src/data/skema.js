// Skema dan invariant data proyek & profil.
// Fungsi murni (tanpa React, tanpa fs) supaya dipakai di browser, di test,
// dan di skrip build (scripts/cek-data.mjs, scripts/halaman-statis.mjs).
import { z } from 'zod';

const teks = (maks) => z.string().trim().min(1, 'Tidak boleh kosong').max(maks, `Maksimal ${maks} karakter`);
const urlHttps = z.string().regex(/^https:\/\/[^\s]+$/, 'Harus diawali https://');
// Path gambar di folder public/: diawali "/", tanpa "..", tanpa spasi.
const pathGambar = z
  .string()
  .regex(/^\/[A-Za-z0-9/_.-]+\.(webp|png|jpg|jpeg|svg)$/, 'Path gambar harus diawali "/" dan berakhiran webp/png/jpg/svg')
  .refine((p) => !p.includes('..'), 'Path gambar tidak boleh berisi ".."');

const skemaGambar = z.object({ src: pathGambar, alt: teks(300) }).strict();

export const skemaProyek = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'id hanya huruf kecil, angka, dan tanda hubung'),
    nama: teks(60),
    // Satu baris di nota beranda; harus dipahami pemilik usaha (bukan istilah teknis).
    nota: teks(24),
    urutan: z.number().int().min(1),
    judul: teks(90),
    judulSorot: teks(60),
    untuk: z.array(teks(40)).min(1).max(5),
    masalah: teks(200),
    solusi: teks(200),
    masalahPanjang: teks(1200),
    demo: z
      .object({
        url: urlHttps,
        akun: z.object({ email: teks(100), password: teks(100) }).strict().nullable(),
        catatan: teks(160),
      })
      .strict(),
    langkah: z.array(teks(200)).min(1).max(5),
    keputusan: z
      .array(z.object({ judul: teks(90), isi: teks(500), catatan: teks(60).optional() }).strict())
      .min(1)
      .max(5),
    gambar: z
      .object({
        kartu: skemaGambar,
        galeri: z.array(skemaGambar.extend({ keterangan: teks(200) }).strict()).max(6),
      })
      .strict(),
    belum: z.array(teks(300)).max(6),
    ajakan: teks(80),
    og: z.object({ judul: teks(70), deskripsi: teks(160) }).strict(),
  })
  .strict()
  // Bagian yang disorot stabilo harus benar-benar ada di judul; kalau tidak, sorotan hilang diam-diam.
  .refine((p) => p.judul.includes(p.judulSorot), { message: 'judulSorot harus bagian dari judul', path: ['judulSorot'] });

export const skemaDaftarProyek = z
  .array(skemaProyek)
  .min(1, 'Minimal satu proyek')
  .superRefine((daftar, ctx) => {
    const lihatGanda = (kunci) => {
      const dilihat = new Set();
      daftar.forEach((p, i) => {
        if (dilihat.has(p[kunci])) {
          ctx.addIssue({ code: 'custom', message: `${kunci} "${p[kunci]}" dipakai lebih dari sekali`, path: [i, kunci] });
        }
        dilihat.add(p[kunci]);
      });
    };
    lihatGanda('id');
    lihatGanda('urutan');
  });

export const skemaProfil = z
  .object({
    nama: teks(60),
    kota: teks(40),
    // Format internasional tanpa "+" dan tanpa 0 di depan, seperti yang diminta wa.me.
    whatsapp: z.string().regex(/^62[0-9]{8,13}$/, 'Nomor WhatsApp harus format 62xxxxxxxxxx'),
    email: z.email(),
    github: urlHttps,
    linkedin: urlHttps.nullable(),
    foto: skemaGambar,
  })
  .strict();

/** Ubah galat zod menjadi daftar kalimat "path: pesan" yang mudah dibaca. */
export function ringkasGalat(galat) {
  return galat.issues.map((i) => `${i.path.join('.') || '(akar)'}: ${i.message}`);
}

/**
 * Validasi daftar proyek. Mengembalikan salinan yang sudah diurutkan menurut `urutan`
 * (urutan di file tidak berpengaruh). Melempar Error berisi semua pelanggaran.
 */
export function validasiProyek(data) {
  const hasil = skemaDaftarProyek.safeParse(data);
  if (!hasil.success) {
    throw new Error('Data proyek tidak valid:\n- ' + ringkasGalat(hasil.error).join('\n- '));
  }
  return [...hasil.data].sort((a, b) => a.urutan - b.urutan);
}

export function validasiProfil(data) {
  const hasil = skemaProfil.safeParse(data);
  if (!hasil.success) {
    throw new Error('Data profil tidak valid:\n- ' + ringkasGalat(hasil.error).join('\n- '));
  }
  return hasil.data;
}

export { cariProyek, semuaGambar, tautanWa, pecahJudul } from './bantu.js';
