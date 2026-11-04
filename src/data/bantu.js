// Fungsi bantu murni tanpa zod, supaya tidak ikut membesarkan bundel browser.

/** Cari proyek menurut id. Id yang bukan string atau tidak ada → null (bukan error). */
export function cariProyek(daftar, id) {
  if (typeof id !== 'string' || id === '') return null;
  return daftar.find((p) => p.id === id) ?? null;
}

/** Semua path gambar yang dipakai data, untuk dicek keberadaannya di public/. */
export function semuaGambar(daftar, profil) {
  const daftarPath = daftar.flatMap((p) => [p.gambar.kartu.src, ...p.gambar.galeri.map((g) => g.src)]);
  return profil ? [profil.foto.src, ...daftarPath] : daftarPath;
}

/**
 * Tautan WhatsApp dengan pesan pembuka. Nomor dicek ulang di sini supaya
 * pemanggil yang lupa validasi tidak menghasilkan tautan rusak diam-diam.
 */
export function tautanWa(nomor, pesan) {
  if (!/^62[0-9]{8,13}$/.test(nomor)) throw new Error(`Nomor WhatsApp tidak valid: ${nomor}`);
  const dasar = `https://wa.me/${nomor}`;
  return pesan ? `${dasar}?text=${encodeURIComponent(pesan)}` : dasar;
}

/** Pecah judul menjadi [sebelum, sorot, sesudah] untuk disorot stabilo. */
export function pecahJudul(judul, sorot) {
  const i = judul.indexOf(sorot);
  if (!sorot || i === -1) return [judul, '', ''];
  return [judul.slice(0, i), sorot, judul.slice(i + sorot.length)];
}
