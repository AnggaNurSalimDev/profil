import { Link } from 'react-router-dom';
import { proyek, profil } from '../data/index.js';
import { Kepala, Kaki, Sorot, TombolWa, useJudulTab } from '../komponen/umum.jsx';

const PESAN_WA = 'Halo Angga, saya lihat web portofolio Anda.';

const RIWAYAT_KERJA = ['Groomer pet shop', 'Teknisi poles mobil', 'Crew restoran', 'Pemilik warung'];

const CARA_KERJA = [
  ['Mulai dari masalah, bukan dari fitur', 'Saya tanya dulu apa yang sering salah di usaha Anda, baru menentukan apa yang perlu dibuat.'],
  ['Anda bisa mencoba sebelum memutuskan', 'Setiap aturan sudah punya pilihan bawaan yang bisa langsung dicoba di demo. Anda cukup bilang mana yang tidak cocok.'],
  ['Diuji seperti dipakai sungguhan', 'Data berbulan-bulan, salah input, shift yang lupa ditutup, dan CV yang berantakan, bukan hanya kasus yang lancar.'],
];

function Nota() {
  // Angka diambil dari data proyek, jadi nota ikut berubah saat proyek ditambah.
  return (
    <div className="nota" role="img" aria-label={`Nota ringkasan portofolio: ${proyek.length} proyek dengan demo yang bisa dicoba`}>
      <div className="nota-judul">NOTA PORTOFOLIO</div>
      <div className="nota-sub">{profil.nama} · {profil.kota}</div>
      <hr />
      {proyek.map((p) => (
        <div className="nota-baris" key={p.id}><span>{p.nama}</span><span>{p.nota}</span></div>
      ))}
      <div className="nota-baris"><span>Demo bisa dicoba</span><span>{proyek.length}</span></div>
      <div className="nota-baris"><span>Biaya mencoba</span><span>Rp 0</span></div>
      <hr />
      <div className="nota-baris nota-total"><span>DARI</span><span>masalah nyata</span></div>
      <div className="nota-sub nota-penutup">Terima kasih sudah mampir</div>
    </div>
  );
}

function KartuProyek({ p }) {
  return (
    <article className="kartu">
      <img src={p.gambar.kartu.src} alt={p.gambar.kartu.alt} width="1120" height="680" loading="lazy" decoding="async" />
      <div className="kartu-isi">
        <p className="label">UNTUK: {p.untuk.join(' · ').toUpperCase()}</p>
        <h3>{p.judul}</h3>
        <div>
          <p className="sub-judul">Masalahnya</p>
          <p className="redup">{p.masalah}</p>
        </div>
        <div>
          <p className="sub-judul">Solusinya</p>
          <p className="redup">{p.solusi}</p>
        </div>
        <div className="baris-tombol kartu-tombol">
          <a className="tombol tombol-isi kecil" href={p.demo.url} target="_blank" rel="noopener noreferrer">Coba demo</a>
          <Link className="tombol tombol-garis kecil" to={`/proyek/${p.id}`}>Baca cerita lengkap</Link>
        </div>
        <p className="catatan">
          {p.demo.akun && <>Masuk dengan <span className="mono">{p.demo.akun.email}</span> / <span className="mono">{p.demo.akun.password}</span>. </>}
          {p.demo.catatan}
        </p>
      </div>
    </article>
  );
}

export default function Beranda() {
  useJudulTab(null);
  return (
    <>
      <Kepala diBeranda />
      <main>
        <section id="atas" className="wadah hero">
          <div className="hero-teks">
            <p className="label">DEVELOPER WEB · {profil.kota.toUpperCase()}</p>
            <h1>Web untuk <Sorot>masalah sehari-hari</Sorot> di usaha Anda</h1>
            <p className="hero-lead">
              Saya Angga, developer web di {profil.kota}. Saya membuat sistem yang mengurus pekerjaan yang sering salah
              kalau dikerjakan manual: menghitung stok bahan, menyaring pelamar kerja, dan mencatat siapa mengerjakan apa.
            </p>
            <div className="baris-tombol">
              <a className="tombol tombol-isi" href="#proyek">Lihat proyek</a>
              <TombolWa pesan={PESAN_WA} />
            </div>
          </div>
          <Nota />
        </section>

        <section id="proyek" className="bagian-putih">
          <div className="wadah bagian">
            <p className="label">PROYEK</p>
            <h2>Dua masalah, dua web yang bisa langsung dicoba</h2>
            <div className="grid-kartu">
              {proyek.map((p) => <KartuProyek key={p.id} p={p} />)}
            </div>
          </div>
        </section>

        <section className="wadah bagian">
          <p className="label">CARA SAYA BEKERJA</p>
          <h2>Dari masalah dulu, baru kode</h2>
          <ol className="grid-cara">
            {CARA_KERJA.map(([judul, isi], i) => (
              <li key={judul}>
                <p className="label">{String(i + 1).padStart(2, '0')}</p>
                <h3>{judul}</h3>
                <p className="redup">{isi}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="tentang" className="bagian-putih">
          <div className="wadah bagian tentang">
            <img className="foto" src={profil.foto.src} alt={profil.foto.alt} width="672" height="840" loading="lazy" decoding="async" />
            <div className="tentang-teks">
              <p className="label">TENTANG SAYA</p>
              <h2>Pernah di balik meja kasir, sekarang membuat kasirnya</h2>
              <p className="redup">
                Saya {profil.nama}, developer web otodidak di {profil.kota}, lulusan SMK jurusan Teknik Bisnis Sepeda Motor (2021).
              </p>
              <p className="redup">
                Sebelum membuat web, saya bekerja di lapangan, dan saya juga menjalankan warung. Dari situ saya tahu rasanya
                menghitung stok di akhir shift, menjaga toko sambil melayani pelanggan, dan bekerja dengan sistem yang tidak membantu.
              </p>
              <p className="redup">
                Proyek-proyek di sini lahir dari pengalaman itu. Saya bekerja dengan React dan JavaScript, dan merancang sistem
                dari aturan bisnisnya dulu.
              </p>
              <ul className="pil-daftar" aria-label="Pengalaman kerja">
                {RIWAYAT_KERJA.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section id="kontak" className="pita-gelap">
          <div className="wadah kontak">
            <div className="kontak-teks">
              <h2>Punya masalah serupa di usaha Anda?</h2>
              <p>Ceritakan saja dulu, tidak harus sudah tahu mau dibuatkan apa.</p>
            </div>
            <div className="kontak-aksi">
              <TombolWa pesan={PESAN_WA} varian="stabilo" />
              <div className="kontak-tautan">
                <a href={`mailto:${profil.email}`}>{profil.email}</a>
                {profil.linkedin && <a href={profil.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                <a href={profil.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Kaki />
    </>
  );
}
