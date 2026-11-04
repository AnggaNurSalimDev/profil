import { Link } from 'react-router-dom';
import { Kepala, Kaki, useJudulTab } from '../komponen/umum.jsx';

export default function TidakDitemukan({ pesan = 'Halaman ini tidak ada.' }) {
  useJudulTab('Halaman tidak ditemukan');
  return (
    <>
      <Kepala />
      <main className="kolom-baca tidak-ditemukan">
        <p className="label">404</p>
        <h1>Tidak ditemukan</h1>
        <p className="redup">{pesan}</p>
        <div className="baris-tombol">
          <Link className="tombol tombol-isi" to="/">Ke beranda</Link>
          <Link className="tombol tombol-garis" to="/#proyek">Lihat semua proyek</Link>
        </div>
      </main>
      <Kaki />
    </>
  );
}
