import { useParams } from 'react-router-dom';
import { proyek } from '../data/index.js';
import { cariProyek } from '../data/bantu.js';
import { Kepala, Kaki, JudulSorot, PitaAjakan, useJudulTab } from '../komponen/umum.jsx';
import TidakDitemukan from './TidakDitemukan.jsx';

function Gambar({ g, lebar }) {
  return (
    <figure className={`gambar-lebar ${lebar}`}>
      <img src={g.src} alt={g.alt} loading="lazy" decoding="async" />
      <figcaption>{g.keterangan}</figcaption>
    </figure>
  );
}

export default function StudiKasus() {
  const { id } = useParams();
  const p = cariProyek(proyek, id);
  useJudulTab(p ? p.og.judul : 'Proyek tidak ditemukan');

  // Guard: id di alamat tidak dikenal → halaman "tidak ditemukan", bukan layar kosong.
  if (!p) return <TidakDitemukan pesan="Proyek ini tidak ada. Mungkin alamatnya salah ketik." />;

  // Gambar galeri pertama setelah "Masalahnya", sisanya setelah "3 keputusan penting".
  const [gambarPertama, ...gambarLain] = p.gambar.galeri;

  return (
    <>
      <Kepala />
      <main>
        <article className="kolom-baca kasus-awal">
          <p className="label">STUDI KASUS · {p.nama.toUpperCase()}</p>
          <h1><JudulSorot judul={p.judul} sorot={p.judulSorot} /></h1>
          <div className="baris-tombol">
            <a className="tombol tombol-isi" href={p.demo.url} target="_blank" rel="noopener noreferrer">Coba demo</a>
            <a className="tombol tombol-garis" href={p.repo} target="_blank" rel="noopener noreferrer">Lihat kode</a>
          </div>
          <p className="catatan">
            Untuk {p.untuk.join(', ')}
            {p.demo.akun && <> · masuk dengan <span className="mono">{p.demo.akun.email}</span> / <span className="mono">{p.demo.akun.password}</span></>}
          </p>

          <h2>Masalahnya</h2>
          <p className="redup">{p.masalahPanjang}</p>
        </article>

        {gambarPertama && <Gambar g={gambarPertama} lebar="lebar-penuh" />}

        <article className="kolom-baca">
          <h2>Coba sendiri dalam {p.langkah.length} langkah</h2>
          <ol className="daftar-langkah">
            {p.langkah.map((l, i) => (
              <li key={l}><span className="label">{String(i + 1).padStart(2, '0')}</span><span>{l}</span></li>
            ))}
          </ol>

          <h2>{p.keputusan.length} keputusan penting</h2>
          <div className="daftar-keputusan">
            {p.keputusan.map((k, i) => (
              <div key={k.judul} className="keputusan">
                <p className="label">KEPUTUSAN {i + 1}{k.catatan && ` · ${k.catatan.toUpperCase()}`}</p>
                <h3>{k.judul}</h3>
                <p className="redup">{k.isi}</p>
              </div>
            ))}
          </div>
        </article>

        {gambarLain.map((g) => <Gambar key={g.src} g={g} lebar="lebar-sedang" />)}

        <article className="kolom-baca kasus-akhir">
          {p.belum.length > 0 && (
            <>
              <h2>Yang belum ada</h2>
              <ul className="daftar-belum">
                {p.belum.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </>
          )}
          <details className="lipatan">
            <summary>Untuk developer</summary>
            <div>
              <p>{p.teknis.stack.join(', ')}. <span className="mono">{p.teknis.jumlahTest} test</span>. {p.teknis.catatan}</p>
              <a href={p.repo} target="_blank" rel="noopener noreferrer">{p.repo.replace('https://', '')}</a>
            </div>
          </details>
        </article>

        <PitaAjakan judul={p.ajakan} pesan={`Halo Angga, saya tertarik dengan ${p.nama}.`} />
      </main>
      <Kaki />
    </>
  );
}
