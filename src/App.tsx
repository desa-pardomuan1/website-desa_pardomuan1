import { Routes, Route } from "react-router";
import { Toaster } from "@/components/ui/sonner";

// Public Pages
import Home from "./pages/Home";
import SejarahPage from "./pages/profil/Sejarah";
import GeografisPage from "./pages/profil/Geografis";
import DemografiPage from "./pages/profil/Demografi";
import StrukturPage from "./pages/pemerintahan/Struktur";
import BPDPage from "./pages/pemerintahan/BPD";
import LembagaPage from "./pages/pemerintahan/Lembaga";
import PanduanPage from "./pages/layanan/Panduan";
import DokumenPage from "./pages/layanan/Dokumen";
import MandiriPage from "./pages/layanan/Mandiri";
import ApbdesPage from "./pages/transparansi/Apbdes";
import GaleriPage from "./pages/transparansi/Galeri";
import KomoditasPage from "./pages/potensi/Komoditas";
import UmkmPage from "./pages/potensi/Umkm";
import BeritaPage from "./pages/Berita";
import BeritaDetailPage from "./pages/BeritaDetail";
import KontakPage from "./pages/Kontak";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProfil from "./pages/admin/Profil";
import AdminStatistik from "./pages/admin/Statistik";
import AdminBerita from "./pages/admin/Berita";
import AdminPanduan from "./pages/admin/Panduan";
import AdminDokumen from "./pages/admin/Dokumen";
import AdminLembaga from "./pages/admin/Lembaga";
import AdminGaleri from "./pages/admin/Galeri";
import AdminKomoditas from "./pages/admin/Komoditas";
import AdminUmkm from "./pages/admin/Umkm";
import AdminApbdes from "./pages/admin/Apbdes";
import AdminPengaduan from "./pages/admin/Pengaduan";

// Auth Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        {/* Profil Desa */}
        <Route path="/profil/sejarah" element={<SejarahPage />} />
        <Route path="/profil/geografis" element={<GeografisPage />} />
        <Route path="/profil/demografi" element={<DemografiPage />} />
        
        {/* Pemerintahan */}
        <Route path="/pemerintahan/struktur" element={<StrukturPage />} />
        <Route path="/pemerintahan/bpd" element={<BPDPage />} />
        <Route path="/pemerintahan/lembaga" element={<LembagaPage />} />
        
        {/* Layanan Publik */}
        <Route path="/layanan/panduan" element={<PanduanPage />} />
        <Route path="/layanan/dokumen" element={<DokumenPage />} />
        <Route path="/layanan/mandiri" element={<MandiriPage />} />
        
        {/* Transparansi */}
        <Route path="/transparansi/apbdes" element={<ApbdesPage />} />
        <Route path="/transparansi/galeri" element={<GaleriPage />} />
        
        {/* Potensi Desa */}
        <Route path="/potensi/komoditas" element={<KomoditasPage />} />
        <Route path="/potensi/umkm" element={<UmkmPage />} />
        
        {/* Berita */}
        <Route path="/berita" element={<BeritaPage />} />
        <Route path="/berita/:slug" element={<BeritaDetailPage />} />
        
        {/* Kontak */}
        <Route path="/kontak" element={<KontakPage />} />
        
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/profil" element={<AdminProfil />} />
        <Route path="/admin/statistik" element={<AdminStatistik />} />
        <Route path="/admin/berita" element={<AdminBerita />} />
        <Route path="/admin/panduan" element={<AdminPanduan />} />
        <Route path="/admin/dokumen" element={<AdminDokumen />} />
        <Route path="/admin/lembaga" element={<AdminLembaga />} />
        <Route path="/admin/galeri" element={<AdminGaleri />} />
        <Route path="/admin/komoditas" element={<AdminKomoditas />} />
        <Route path="/admin/umkm" element={<AdminUmkm />} />
        <Route path="/admin/apbdes" element={<AdminApbdes />} />
        <Route path="/admin/pengaduan" element={<AdminPengaduan />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}
