import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Vote, Gavel } from "lucide-react";

export default function BPDPage() {
  const { data: bpdList } = trpc.desa.lembaga.list.useQuery({ jenis: "bpd" });
  const bpd = bpdList?.[0];

  return (
    <Layout>
      <div className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">
            Badan Permusyawaratan Desa (BPD)
          </h1>
          <p className="text-emerald-100 mt-2">
            Lembaga legislatif dan pengawas pemerintahan desa
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* BPD Header */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold">{bpd?.nama || "BPD"}</h2>
                {bpd?.ketua && (
                  <p className="text-blue-200 mt-1">
                    Ketua: {bpd.ketua}
                  </p>
                )}
                {bpd?.anggota && (
                  <p className="text-blue-200 text-sm mt-1">
                    {bpd.anggota} Anggota
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Tugas dan Wewenang */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-blue-700" />
                Tugas Pokok BPD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Menampung dan menyalurkan aspirasi masyarakat",
                  "Melaksanakan pengawasan terhadap penyelenggaraan pemerintahan desa",
                  "Menyusun dan menyampaikan peraturan desa yang akan ditetapkan",
                  "Menggali, memfasilitasi, dan menyalurkan potensi masyarakat",
                  "Menyelenggarakan musyawarah desa",
                  "Memilih dan menetapkan Kepala Desa",
                ].map((tugas, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-5 w-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700">{tugas}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-blue-700" />
                Hak dan Wewenang
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Mengajukan usulan penyusunan Rencana Pembangunan Jangka Panjang Desa",
                  "Menampung dan menyalurkan aspirasi masyarakat",
                  "Memberikan persetujuan bersama dengan Kepala Desa terhadap Peraturan Desa",
                  "Mengusulkan pengangkatan dan pemberhentian Kepala Desa",
                  "Mengawasi penyelenggaraan pemerintahan desa",
                  "Menyampaikan laporan berkala kepada masyarakat",
                ].map((hak, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-5 w-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700">{hak}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Deskripsi */}
        {bpd?.deskripsi && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Tentang BPD</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{bpd.deskripsi}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
