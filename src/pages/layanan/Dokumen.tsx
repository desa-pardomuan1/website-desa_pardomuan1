import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FolderOpen, Search, FileText } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function DokumenPage() {
  const { data: dokumenList } = trpc.desa.dokumen.list.useQuery();
  const [search, setSearch] = useState("");

  const filtered = dokumenList?.filter(
    (d) =>
      d.judul.toLowerCase().includes(search.toLowerCase()) ||
      d.kategori?.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold">Unduh Dokumen</h1>
          <p className="text-emerald-100 mt-2">
            Dokumen-dokumen penting pemerintah desa
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari dokumen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {grouped && Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([kategori, items]) => (
            <div key={kategori}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-emerald-700" />
                {kategori}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {items?.map((item) => (
                  <Card
                    key={item.id}
                    className="border-0 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-900">
                            {item.judul}
                          </h3>
                          {item.deskripsi && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {item.deskripsi}
                            </p>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 text-xs"
                            asChild
                          >
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileDown className="w-3 h-3 mr-1" />
                              Unduh
                            </a>
                          </Button>
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
              <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {search
                  ? "Tidak ada hasil untuk pencarian Anda"
                  : "Data dokumen belum tersedia"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
