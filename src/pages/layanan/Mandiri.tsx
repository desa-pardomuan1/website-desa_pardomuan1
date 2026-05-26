import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe } from "lucide-react";

export default function MandiriPage() {
  const { data: profil } = trpc.desa.profil.list.useQuery();
  const layananUrl = profil?.layanan_mandiri_url || "#";

  return (
    <Layout>
      <div className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Layanan Mandiri</h1>
          <p className="text-emerald-100 mt-2">
            Akses layanan mandiri masyarakat secara online
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <Card className="border-0 shadow-lg text-center">
          <CardContent className="p-12">
            <div className="h-20 w-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe className="h-10 w-10 text-emerald-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Layanan Mandiri Masyarakat
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Akses layanan pengurusan dokumen, pengajuan permohonan, dan
              layanan publik lainnya secara mandiri melalui platform online.
            </p>
            <Button
              size="lg"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
              asChild
            >
              <a
                href={layananUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Buka Layanan Mandiri
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
            <p className="text-xs text-gray-400 mt-4">
              Anda akan diarahkan ke halaman eksternal
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "📄",
              title: "Pengurusan Dokumen",
              desc: "KTP, KK, Surat Domisili, dll",
            },
            {
              icon: "📋",
              title: "Pengajuan Izin",
              desc: "Izin usaha, izin keramaian",
            },
            {
              icon: "📢",
              title: "Pengaduan",
              desc: "Sampaikan aspirasi Anda",
            },
          ].map((item) => (
            <Card key={item.title} className="border-0 shadow-sm text-center">
              <CardContent className="p-5">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-medium text-sm text-gray-900">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
