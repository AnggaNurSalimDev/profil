import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import dataProyek from './proyek.json';
import dataProfil from './profil.json';
import {
  validasiProyek, validasiProfil, cariProyek, tautanWa, pecahJudul, semuaGambar,
} from './skema.js';

const salin = () => structuredClone(dataProyek);
const gagal = (data, potongan) => expect(() => validasiProyek(data)).toThrow(potongan);

describe('data asli', () => {
  it('proyek.json dan profil.json valid', () => {
    expect(validasiProyek(dataProyek)).toHaveLength(dataProyek.length);
    expect(validasiProfil(dataProfil).nama).toBe('Angga Nur Salim');
  });

  it('setiap gambar yang dipakai ada di public/', () => {
    const hilang = semuaGambar(validasiProyek(dataProyek), dataProfil)
      .filter((src) => !existsSync(join(process.cwd(), 'public', src)));
    expect(hilang).toEqual([]);
  });
});

describe('invariant proyek', () => {
  it('menolak id ganda', () => {
    const d = salin(); d[1].id = d[0].id;
    gagal(d, 'dipakai lebih dari sekali');
  });

  it('menolak urutan ganda', () => {
    const d = salin(); d[1].urutan = d[0].urutan;
    gagal(d, 'urutan');
  });

  it('menolak id dengan huruf besar atau spasi', () => {
    for (const id of ['Kasir', 'kasir baru', '-kasir', 'kasir-']) {
      const d = salin(); d[0].id = id;
      gagal(d, 'id hanya huruf kecil');
    }
  });

  it('menolak url demo yang bukan https', () => {
    const d1 = salin(); d1[0].demo.url = 'http://contoh.id';
    gagal(d1, 'https://');
    const d2 = salin(); d2[0].demo.url = 'kasir.vercel.app';
    gagal(d2, 'https://');
  });

  it('nota: wajib, maksimal 24 karakter supaya muat satu baris', () => {
    const kosong = salin(); kosong[0].nota = '';
    gagal(kosong, 'Tidak boleh kosong');
    const pas = salin(); pas[0].nota = 'a'.repeat(24);
    expect(() => validasiProyek(pas)).not.toThrow();
    const lebih = salin(); lebih[0].nota = 'a'.repeat(25);
    gagal(lebih, 'Maksimal 24');
  });

  it('masalah dan solusi: kosong ditolak, 200 karakter boleh, 201 ditolak', () => {
    const kosong = salin(); kosong[0].masalah = '   ';
    gagal(kosong, 'Tidak boleh kosong');
    const pas = salin(); pas[0].solusi = 'a'.repeat(200);
    expect(() => validasiProyek(pas)).not.toThrow();
    const lebih = salin(); lebih[0].solusi = 'a'.repeat(201);
    gagal(lebih, 'Maksimal 200');
  });

  it('keputusan harus 1–5', () => {
    const nol = salin(); nol[0].keputusan = [];
    gagal(nol, 'keputusan');
    const enam = salin(); enam[0].keputusan = Array(6).fill(enam[0].keputusan[0]);
    gagal(enam, 'keputusan');
  });

  it('judulSorot harus bagian dari judul', () => {
    const d = salin(); d[0].judulSorot = 'tidak ada di judul';
    gagal(d, 'judulSorot');
  });

  it('path gambar harus diawali "/" dan tanpa ".."', () => {
    const d1 = salin(); d1[0].gambar.kartu.src = 'proyek/kasir/kartu.webp';
    gagal(d1, 'Path gambar');
    const d2 = salin(); d2[0].gambar.kartu.src = '/../rahasia.png';
    gagal(d2, '..');
  });

  it('alt gambar wajib', () => {
    const d = salin(); d[0].gambar.kartu.alt = '';
    gagal(d, 'Tidak boleh kosong');
  });

  it('field asing ditolak (salah ketik tidak lolos diam-diam)', () => {
    const d = salin(); d[0].masalahh = 'salah ketik';
    gagal(d, 'masalahh');
  });

  it('daftar kosong ditolak', () => {
    gagal([], 'Minimal satu proyek');
  });

  it('hasil diurutkan menurut urutan, bukan urutan di file', () => {
    const d = salin().reverse();
    const diharapkan = d.map((p) => p.urutan).sort((a, b) => a - b);
    expect(diharapkan.length).toBeGreaterThan(1); // invariant: tes ini tidak berarti dengan < 2 proyek
    expect(validasiProyek(d).map((p) => p.urutan)).toEqual(diharapkan);
  });
});

describe('invariant profil', () => {
  it('nomor WhatsApp harus format 62…', () => {
    for (const nomor of ['089508482581', '+6289508482581', '62 895', '62']) {
      expect(() => validasiProfil({ ...dataProfil, whatsapp: nomor })).toThrow('WhatsApp');
    }
  });

  it('linkedin boleh null, tetapi kalau diisi harus https', () => {
    expect(() => validasiProfil({ ...dataProfil, linkedin: null })).not.toThrow();
    expect(() => validasiProfil({ ...dataProfil, linkedin: 'linkedin.com/in/x' })).toThrow('https://');
  });
});

describe('cariProyek', () => {
  const daftar = validasiProyek(dataProyek);
  it('menemukan id yang ada', () => expect(cariProyek(daftar, 'kasir').nama).toBe('Kasir Stok Otomatis'));
  it('id tidak ada / kosong / bukan string → null', () => {
    expect(cariProyek(daftar, 'tidak-ada')).toBeNull();
    expect(cariProyek(daftar, '')).toBeNull();
    expect(cariProyek(daftar, undefined)).toBeNull();
  });
});

describe('tautanWa', () => {
  it('menyandikan pesan', () => {
    expect(tautanWa('6289508482581', 'Halo Angga, saya lihat web Anda.'))
      .toBe('https://wa.me/6289508482581?text=Halo%20Angga%2C%20saya%20lihat%20web%20Anda.');
  });
  it('tanpa pesan → tanpa ?text', () => expect(tautanWa('6289508482581')).toBe('https://wa.me/6289508482581'));
  it('nomor salah format → error, bukan tautan rusak', () => {
    expect(() => tautanWa('0895-0848-2581', 'x')).toThrow('tidak valid');
  });
});

describe('pecahJudul', () => {
  it('memecah di bagian yang disorot', () => {
    expect(pecahJudul('Kasir yang menghitung stok bahan sendiri', 'stok bahan'))
      .toEqual(['Kasir yang menghitung ', 'stok bahan', ' sendiri']);
  });
  it('sorot di akhir judul', () => {
    expect(pecahJudul('Seleksi yang bisa dipertanggungjawabkan', 'bisa dipertanggungjawabkan'))
      .toEqual(['Seleksi yang ', 'bisa dipertanggungjawabkan', '']);
  });
  it('sorot tidak ditemukan atau kosong → judul utuh tanpa sorotan', () => {
    expect(pecahJudul('Judul', 'lain')).toEqual(['Judul', '', '']);
    expect(pecahJudul('Judul', '')).toEqual(['Judul', '', '']);
  });
});
