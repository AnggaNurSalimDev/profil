import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Beranda from './halaman/Beranda.jsx';
import StudiKasus from './halaman/StudiKasus.jsx';
import TidakDitemukan from './halaman/TidakDitemukan.jsx';

// Pindah halaman → mulai dari atas. Alamat dengan #bagian → gulir ke bagian itu.
function AturGulir() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <AturGulir />
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/proyek/:id" element={<StudiKasus />} />
        <Route path="*" element={<TidakDitemukan />} />
      </Routes>
    </>
  );
}
