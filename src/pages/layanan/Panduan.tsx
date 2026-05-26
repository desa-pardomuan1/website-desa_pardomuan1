import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ClipboardList, FileText, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function PanduanPage() {
  const { data: panduanList } = trpc.desa.panduan.list.useQuery();
  const [search, setSearch] = useState("");

  const filtered = panduanList?.filter(
    (p) =>
      p.judul.toLowerCase().includes(search.toLowerCase()) ||
      p.kategori?.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const grouped = filtered?.reduce(
    (acc, item) => {
      const cat = item.kategori || "Umum";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {} as Record<string, typeof filtered>
  );

  return (
    <Layout>
      <div className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Panduan Layanan</h1>
          <p className="text-emerald-100 mt-2">
            Prosedur dan persyaratan pengurusan dokumen
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari panduan layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {grouped && Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([kategori, items]) => (
            <div key={kategori}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-emerald-700" />
                {kategori}
              </h2>
              <div className="space-y-3">
                {items?.map((item) => (
                  <Card
                    key={item.id}
                    className="border-0 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-600" />
                            {item.judul}
                          </h3>
                          <div className="mt-3 text-sm text-gray-600 whitespace-pre-line">
                            {item.konten}
                          </div>
                          {item.filePdf && (
                            <a
                              href={item.filePdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-800 mt-3 font-medium"
                            >
                              <FileText className="w-4 h-4" />
                              Unduh File PDF
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {search
                  ? "Tidak ada hasil untuk pencarian Anda"
                  : "Data panduan layanan belum tersedia"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
