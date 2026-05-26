import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, User } from "lucide-react";

export default function StrukturPage() {
  const { data: lembagaList } = trpc.desa.lembaga.list.useQuery({
    jenis: "pemerintahan",
  });

  const pemerintahan = lembagaList?.[0];

  return (
    <Layout>
      <div className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Struktur Organisasi</h1>
          <p className="text-emerald-100 mt-2">
            Struktur organisasi pemerintah desa
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* Kepala Desa */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-28 w-28 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                {pemerintahan?.fotoUrl ? (
                  <img
                    src={pemerintahan.fotoUrl}
                    alt={pemerintahan.ketua || "Kepala Desa"}
                    className="h-28 w-28 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-14 w-14 text-white" />
                )}
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-emerald-200 mb-1">Kepala Desa</p>
                <h2 className="text-2xl font-bold">
                  {pemerintahan?.ketua || "Belum diisi"}
                </h2>
                <p className="text-emerald-200 mt-1">
                  {pemerintahan?.nama || "Pemerintah Desa"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Struktur Organisasi Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              Bagan Struktur Organisasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-6">
              {/* Kepala Desa */}
              <div className="bg-emerald-700 text-white px-8 py-3 rounded-xl text-center min-w-[200px]">
                <p className="text-xs opacity-80">Kepala Desa</p>
                <p className="font-semibold">
                  {pemerintahan?.ketua || "-"}
                </p>
              </div>

              {/* Connector */}
              <div className="w-0.5 h-6 bg-gray-300" />

              {/* Sekretaris */}
              <div className="bg-blue-600 text-white px-8 py-3 rounded-xl text-center min-w-[200px]">
                <p className="text-xs opacity-80">Sekretaris Desa</p>
                <p className="font-semibold">Sekdes</p>
              </div>

              {/* Connector */}
              <div className="w-0.5 h-6 bg-gray-300" />

              {/* Kasi/Kaur Level */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl">
                {[
                  "Kasi Pemerintahan",
                  "Kasi Kesejahteraan",
                  "Kasi Pelayanan",
                  "Kaur TU & Umum",
                  "Kaur Perencanaan",
                  "Kaur Keuangan",
                ].map((jabatan) => (
                  <div
                    key={jabatan}
                    className="bg-gray-100 border border-gray-200 text-gray-800 px-4 py-3 rounded-lg text-center"
                  >
                    <p className="text-[11px] font-medium">{jabatan}</p>
                  </div>
                ))}
              </div>

              {/* Connector */}
              <div className="w-0.5 h-6 bg-gray-300" />

              {/* Kepala Dusun */}
              <div className="bg-orange-500 text-white px-8 py-3 rounded-xl text-center min-w-[200px]">
                <p className="text-xs opacity-80">Kepala Dusun / Kadus</p>
                <p className="font-semibold">5 Dusun</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deskripsi */}
        {pemerintahan?.deskripsi && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Tugas dan Fungsi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {pemerintahan.deskripsi}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
