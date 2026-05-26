import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import AdminLayout from "@/components/AdminLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Newspaper,
  MessageSquare,
  Store,
  Image,
  Users,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const statCards = [
  {
    label: "Total Berita",
    query: "totalBerita" as const,
    icon: Newspaper,
    color: "bg-blue-500",
    path: "/admin/berita",
  },
  {
    label: "Pengaduan",
    query: "totalPengaduan" as const,
    icon: MessageSquare,
    color: "bg-orange-500",
    path: "/admin/pengaduan",
  },
  {
    label: "UMKM",
    query: "totalUmkm" as const,
    icon: Store,
    color: "bg-emerald-500",
    path: "/admin/umkm",
  },
  {
    label: "Galeri",
    query: "totalGaleri" as const,
    icon: Image,
    color: "bg-purple-500",
    path: "/admin/galeri",
  },
  {
    label: "Lembaga",
    query: "totalLembaga" as const,
    icon: Users,
    color: "bg-cyan-500",
    path: "/admin/lembaga",
  },
  {
    label: "Pengaduan Baru",
    query: "pengaduanBaru" as const,
    icon: AlertCircle,
    color: "bg-red-500",
    path: "/admin/pengaduan",
  },
];

const quickLinks = [
  { label: "Kelola Berita", path: "/admin/berita", desc: "Tambah/edit/hapus berita" },
  { label: "Kelola Profil Desa", path: "/admin/profil", desc: "Atur informasi desa" },
  { label: "Kelola Statistik", path: "/admin/statistik", desc: "Data kependudukan" },
  { label: "Lihat Pengaduan", path: "/admin/pengaduan", desc: "Respons pengaduan" },
];

export default function AdminDashboard() {
  const { data: stats } = trpc.desa.dashboard.stats.useQuery();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Ringkasan data dan aktivitas website desa
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((item) => (
            <Link key={item.path} to={item.path}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 ${item.color} rounded-lg flex items-center justify-center`}
                      >
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats?.[item.query] ?? "0"}
                        </p>
                        <p className="text-xs text-gray-500">{item.label}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Akses Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-900 group-hover:text-emerald-700">
                      {link.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-700" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                <TrendingUp className="h-4 w-4 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-900">
                  Tips Pengelolaan Website
                </h3>
                <ul className="mt-2 space-y-1 text-xs text-gray-600">
                  <li>
                    - Pastikan data profil desa selalu terbaru untuk memberikan
                    informasi akurat
                  </li>
                  <li>
                    - Perbarui statistik kependudukan secara berkala (minimal
                    setahun sekali)
                  </li>
                  <li>
                    - Tanggapi pengaduan masyarakat dalam waktu maksimal 3 hari
                    kerja
                  </li>
                  <li>
                    - Upload foto kegiatan desa ke galeri untuk dokumentasi yang
                    baik
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
