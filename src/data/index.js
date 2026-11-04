// Satu-satunya pintu data untuk halaman.
// Validasi penuh (zod + invariant) dijalankan saat build (scripts/cek-data.mjs) dan di test,
// jadi data yang tidak valid tidak pernah sampai ke browser. Di sini zod sengaja tidak
// diimpor: ukurannya hampir dua kali lipat seluruh aplikasi.
import dataProyek from './proyek.json';
import dataProfil from './profil.json';

export const proyek = [...dataProyek].sort((a, b) => a.urutan - b.urutan);
export const profil = dataProfil;
