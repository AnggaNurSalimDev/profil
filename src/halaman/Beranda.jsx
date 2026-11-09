import { Link } from 'react-router-dom';
import { proyek, profil } from '../data/index.js';
import { Kepala, Kaki, Sorot, TombolWa, useJudulTab } from '../komponen/umum.jsx';

const PESAN_WA = 'Halo Angga, saya lihat web portofolio Anda.';

const RIWAYAT_KERJA = ['Groomer pet shop', 'Teknisi poles mobil', 'Crew restoran', 'Pemilik warung'];


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
            <h1>Sistem web yang dibuat dari <Sorot>cara kerja bisnis Anda</Sorot></h1>
            <p className="hero-lead">
              Stok yang selisih, absen yang dititipkan, pelamar yang dinilai berbeda-beda. Masalah seperti ini sering muncul
              saat aturan kerja hanya ada di kepala atau di kertas. Sistem web menjalankan aturan itu setiap hari dan mencatat
              siapa melakukan apa.
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
            <h2>Contoh yang bisa Anda coba sekarang</h2>
            <div className="grid-kartu">
              {proyek.map((p) => <KartuProyek key={p.id} p={p} />)}
            </div>
          </div>
        </section>

        <section id="kontak" className="bagian-kontak">
          <div className="wadah">
            <div className="pita-gelap kontak">
              <div className="kontak-teks">
                <h2>Mencari usaha pertama untuk memakai <span className="tanpa-putus">sistem-sistem</span> ini</h2>
                <p>
                  Sistem-sistem di atas sudah bisa dicoba, tapi belum pernah dipakai di usaha sungguhan. Karena itu, usaha
                  pertama yang memakai salah satunya akan mendapatkannya gratis. Saya juga perlu melihat bagaimana sistem ini
                  bekerja di tempat yang sebenarnya.
                </p>
                <p>Kalau masalah di usaha Anda berbeda, ceritakan saja lewat WhatsApp. Saya buatkan demonya lebih dulu.</p>
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
          </div>
        </section>

        <section id="tentang" className="bagian-putih">
          <div className="wadah bagian tentang">
            <img className="foto" src={profil.foto.src} alt={profil.foto.alt} width="672" height="840" loading="lazy" decoding="async" />
            <div className="tentang-teks">
              <p className="label">TENTANG SAYA</p>
              <h2>{profil.nama}, developer web di {profil.kota}</h2>
              <p className="redup">
                Sebelum membuat web, saya bekerja di lapangan, dan sekarang menjalankan warung sendiri.
              </p>
              <p className="redup">
                Karena itu saya membuat sistem yang mudah dipakai oleh orang yang menjalankannya setiap hari, seperti kasir,
                crew, dan staf HR.
              </p>
              <ul className="pil-daftar" aria-label="Pengalaman kerja">
                {RIWAYAT_KERJA.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Kaki />
    </>
  );
}
