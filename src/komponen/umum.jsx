import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profil } from '../data/index.js';
import { tautanWa, pecahJudul } from '../data/bantu.js';
import { META_BERANDA } from '../data/meta.js';

/** Judul tab browser. Tag Open Graph untuk WhatsApp ditulis saat build (scripts/halaman-statis.mjs). */
export function useJudulTab(judul) {
  useEffect(() => {
    document.title = judul || META_BERANDA.judul;
  }, [judul]);
}

export function Sorot({ children }) {
  return <span className="sorot">{children}</span>;
}

/** Judul dengan satu bagian disorot stabilo. Bagian yang tidak ditemukan → judul biasa. */
export function JudulSorot({ judul, sorot }) {
  const [awal, tengah, akhir] = pecahJudul(judul, sorot);
  return (
    <>
      {awal}
      {tengah && <Sorot>{tengah}</Sorot>}
      {akhir}
    </>
  );
}

function IkonWa() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z" />
    </svg>
  );
}

/** varian: "garis" (putih bergaris) | "stabilo" (kuning, untuk latar gelap) */
export function TombolWa({ pesan, varian = 'garis' }) {
  return (
    <a className={`tombol tombol-${varian}`} href={tautanWa(profil.whatsapp, pesan)} target="_blank" rel="noopener noreferrer">
      <IkonWa />
      Chat WhatsApp
    </a>
  );
}

export function Kepala({ diBeranda }) {
  return (
    <header className="kepala">
      <nav aria-label="Utama" className="wadah kepala-isi">
        <Link to="/" className="merek">{profil.nama}</Link>
        {diBeranda ? (
          <div className="menu">
            <a href="#proyek">Proyek</a>
            <a href="#tentang">Tentang</a>
            <a href="#kontak">Kontak</a>
          </div>
        ) : (
          <Link to="/#proyek" className="menu-kembali">← Semua proyek</Link>
        )}
      </nav>
    </header>
  );
}

export function PitaAjakan({ judul, pesan }) {
  return (
    <section className="pita-gelap">
      <div className="wadah pita-ajakan">
        <h2>{judul}</h2>
        <TombolWa pesan={pesan} varian="stabilo" />
      </div>
    </section>
  );
}

export function Kaki() {
  return (
    <footer className="kaki">
      <div className="wadah">© {new Date().getFullYear()} {profil.nama} · {profil.kota}</div>
    </footer>
  );
}
