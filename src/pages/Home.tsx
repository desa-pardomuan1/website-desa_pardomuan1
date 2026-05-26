import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  MapPin,
  Building2,
  TrendingUp,
  Newspaper,
  ArrowRight,
  Calendar,
  Sprout,
  Store,
  Phone,
} from "lucide-react";

export default function Home() {
  const { data: profil } = trpc.desa.profil.list.useQuery();
  const { data: statistik } = trpc.desa.statistik.getLatest.useQuery();
  const { data: beritaList } = trpc.desa.berita.list.useQuery({
    status: "published",
    limit: 4,
  });
  const { data: lembagaList } = trpc.desa.lembaga.list.useQuery();
  const { data: galeriList } = trpc.desa.galeri.list.useQuery();
    const { data: umkmList } = trpc.desa.umkm.list.useQuery();

  const namaDesa = profil?.nama_desa || "Desa Cantik";
  const visi = profil?.visi || "";

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
              Website Resmi Pemerintah Desa
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Selamat Datang di<br />
              <span className="text-emerald-200">{namaDesa}</span>
            </h1>
            <p className="text-lg text-emerald-100 mb-8 leading-relaxed">
              {visi}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/profil/sejarah">
                <Button className="bg-white text-emerald-800 hover:bg-emerald-50 font-medium">
                  Profil Desa
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/layanan/panduan">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Layanan Publik
                </Button>
              </Link>
              <Link to="/kontak">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="-mt-10 relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistik?.totalPenduduk?.toLocaleString("id-ID") || "0"}
                  </p>
                  <p className="text-xs text-gray-500">Jiwa Penduduk</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistik?.luasWilayah || "0"}
                  </p>
                  <p className="text-xs text-gray-500">Ha Luas Wilayah</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-orange-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistik?.totalKK?.toLocaleString("id-ID") || "0"}
                  </p>
                  <p className="text-xs text-gray-500">Kepala Keluarga</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistik?.jumlahDusun || "0"}
                  </p>
                  <p className="text-xs text-gray-500">Dusun</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Access Menu */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Layanan & Informasi
          </h2>
          <p className="text-gray-500 mt-1">
            Akses cepat ke layanan dan informasi desa
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: Building2,
              label: "Profil Desa",
              desc: "Sejarah, visi misi, dan geografis",
              path: "/profil/sejarah",
              color: "bg-emerald-50 text-emerald-700",
            },
            {
              icon: Users,
              label: "Pemerintahan",
              desc: "Struktur organisasi desa",
              path: "/pemerintahan/struktur",
              color: "bg-blue-50 text-blue-700",
            },
            {
              icon: TrendingUp,
              label: "Transparansi",
              desc: "APBDes dan infografis",
              path: "/transparansi/apbdes",
              color: "bg-orange-50 text-orange-700",
            },
            {
              icon: Newspaper,
              label: "Berita",
              desc: "Kabar & pengumuman desa",
              path: "/berita",
              color: "bg-purple-50 text-purple-700",
            },
            {
              icon: Sprout,
              label: "Pertanian",
              desc: "Komoditas unggulan",
              path: "/potensi/komoditas",
              color: "bg-green-50 text-green-700",
            },
            {
              icon: Store,
              label: "UMKM",
              desc: "Usaha lokal desa",
              path: "/potensi/umkm",
              color: "bg-pink-50 text-pink-700",
            },
            {
              icon: MapPin,
              label: "Geografis",
              desc: "Peta dan kondisi wilayah",
              path: "/profil/geografis",
              color: "bg-cyan-50 text-cyan-700",
            },
            {
              icon: Phone,
              label: "Pengaduan",
              desc: "Layanan pengaduan masyarakat",
              path: "/kontak",
              color: "bg-red-50 text-red-700",
            },
          ].map((item) => (
            <Link key={item.path} to={item.path}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-5 text-center">
                  <div
                    className={`h-12 w-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900">
                    {item.label}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest News */}
      {beritaList && beritaList.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Berita & Pengumuman
                </h2>
                <p className="text-gray-500 mt-1">
                  Informasi terbaru dari desa
                </p>
              </div>
              <Link to="/berita">
                <Button variant="outline" className="hidden sm:flex">
                  Lihat Semua
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {beritaList.map((berita) => (
                <Link key={berita.id} to={`/berita/${berita.slug}`}>
                  <Card className="border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer h-full overflow-hidden group">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={
                          berita.gambarSampul ||
                          "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=400"
                        }
                        alt={berita.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            berita.kategori === "pengumuman"
                              ? "bg-orange-100 text-orange-700"
                              : berita.kategori === "berita"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {berita.kategori === "kabar_desa"
                            ? "Kabar Desa"
                            : berita.kategori === "pengumuman"
                              ? "Pengumuman"
                              : "Berita"}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(berita.tanggalPublish)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {berita.judul}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      {galeriList && galeriList.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Galeri Desa</h2>
              <p className="text-gray-500 mt-1">Dokumentasi kegiatan desa</p>
            </div>
            <Link to="/transparansi/galeri">
              <Button variant="outline" className="hidden sm:flex">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {galeriList.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="relative group overflow-hidden rounded-xl aspect-[4/3]"
              >
                <img
                  src={item.gambarUrl}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white text-sm font-medium">
                    {item.judul}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* UMKM Preview */}
      {umkmList && umkmList.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  UMKM & Produk Lokal
                </h2>
                <p className="text-gray-500 mt-1">
                  Temukan produk unggulan desa
                </p>
              </div>
              <Link to="/potensi/umkm">
                <Button variant="outline" className="hidden sm:flex">
                  Lihat Semua
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {umkmList.map((item) => (
                <Card
                  key={item.id}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="h-44 overflow-hidden">
                    <img
                      src={
                        item.fotoUrl ||
                        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400"
                      }
                      alt={item.namaProduk}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium capitalize">
                      {item.kategori}
                    </span>
                    <h3 className="font-semibold text-sm text-gray-900 mt-2">
                      {item.namaProduk}
                    </h3>
                    {item.namaUsaha && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.namaUsaha}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lembaga */}
      {lembagaList && lembagaList.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Lembaga Kemasyarakatan
            </h2>
            <p className="text-gray-500 mt-1">
              Struktur organisasi kemasyarakatan desa
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {lembagaList.slice(0, 3).map((item) => (
              <Card
                key={item.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {item.fotoUrl ? (
                      <img
                        src={item.fotoUrl}
                        alt={item.nama}
                        className="h-14 w-14 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-14 w-14 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                        <Users className="h-6 w-6 text-emerald-700" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">
                        {item.nama}
                      </h3>
                      {item.ketua && (
                        <p className="text-xs text-gray-500 mt-1">
                          Ketua: {item.ketua}
                        </p>
                      )}
                      {item.anggota && (
                        <p className="text-xs text-gray-400 mt-1">
                          {item.anggota} anggota
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/pemerintahan/lembaga">
              <Button variant="outline">
                Lihat Semua Lembaga
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </Layout>
  );
}
